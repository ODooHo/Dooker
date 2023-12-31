import axios, { AxiosError } from "axios";
import { getAccessTokenApi } from "./authApis";


const testUrl = 'http://localhost:8080'
const defaultUrl = 'http://15.165.24.146:8080'


export const profileUploadApi = async (token: string | null, refreshToken: string | null, data: any) => {
    const url = `${testUrl}/api/upload/profile`;
    
    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        })
        const result = response.data;
        return result
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 403 && refreshToken) {
            try {
                // 액세스 토큰 만료로 인한 에러 발생 시, refreshToken을 사용하여 새로운 액세스 토큰 발급
                const refreshResponse = await getAccessTokenApi(refreshToken)

                if (refreshResponse.data) {
                    const token = refreshResponse.data.token;
                    // 새로 발급된 액세스 토큰으로 다시 요청 보내기
                    const newResponse = await axios.post(url, data,{
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    const result = newResponse.data;
                    localStorage.setItem('token',token);
                    
                    return result;
                } else {
                    // 리프레시 토큰도 만료된 경우 또는 다른 이유로 실패한 경우
                    console.error("Refresh token is expired or invalid");
                    return null;
                }
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }

        }
        console.error("Error refreshing access token:", axiosError);
        return null;
    }


}



export const getProfileApi = async (token: string | null, refreshToken: string | null, imageName: string | number) => {
    const url = `${testUrl}/api/images/${imageName}/profile`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if(response.data) {
            const imageUrl = response.data.data;
            displayImage(imageUrl);
            return imageUrl;
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 403 && refreshToken) {
            try {
                // 액세스 토큰 만료로 인한 에러 발생 시, refreshToken을 사용하여 새로운 액세스 토큰 발급
                const refreshResponse = await getAccessTokenApi(refreshToken)

                if (refreshResponse.data) {
                    const token = refreshResponse.data.token;
                    // 새로 발급된 액세스 토큰으로 다시 요청 보내기
                    const newResponse = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if(newResponse.data) {
                        const imageUrl = newResponse.data.data;
                        displayImage(imageUrl);
                        return imageUrl;
                    }
                } else {
                    // 리프레시 토큰도 만료된 경우 또는 다른 이유로 실패한 경우
                    console.error("Refresh token is expired or invalid");
                    return null;
                }
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }

        }else if(axiosError.response && axiosError.response.status === 404){
            const imageUrl = ""
            return imageUrl;
        }
        console.error("Error refreshing access token:", axiosError);
        return null;
    }

};

export const getImageApi = async (token: string | null, refreshToken: string | null, imageName: string | number) => {
    const url = `${testUrl}/api/images/${imageName}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        if(response.data) {
            const imageUrl = response.data.data;
            displayImage(imageUrl);
            return imageUrl;
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 403 && refreshToken) {
            try {
                // 액세스 토큰 만료로 인한 에러 발생 시, refreshToken을 사용하여 새로운 액세스 토큰 발급
                const refreshResponse = await getAccessTokenApi(refreshToken)

                if (refreshResponse.data) {
                    const token = refreshResponse.data.token;
                    // 새로 발급된 액세스 토큰으로 다시 요청 보내기
                    const newResponse = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if(newResponse.data) {
                        const imageUrl = newResponse.data.data;
                        displayImage(imageUrl);
                        return imageUrl;
                    }
                } else {
                    // 리프레시 토큰도 만료된 경우 또는 다른 이유로 실패한 경우
                    console.error("Refresh token is expired or invalid");
                    return null;
                }
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }

        }else if(axiosError.response && axiosError.response.status === 404){
            const imageUrl = ""
            return imageUrl;
        }
        console.error("Error refreshing access token:", axiosError);
        return null;
    }
};


export const getVideoApi = async (token: string | null, refreshToken: string | null, videoName: string | number) => {
    const url = `${testUrl}/api/videos/${videoName}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        if(response.data) {
            const videoUrl = response.data.data;
            displayVideo(videoUrl);
            return videoUrl;
        }

    } catch (error) {
        const axiosError = error as AxiosError;
        //403 -> 토큰 만료시 에러, 500 -> 토큰 만료시 userEntity 찾지 못하는 에러 
        if (axiosError.response && axiosError.response.status === 403 && refreshToken) {
            try {
                // 액세스 토큰 만료로 인한 에러 발생 시, refreshToken을 사용하여 새로운 액세스 토큰 발급
                const refreshResponse = await getAccessTokenApi(refreshToken)

                if (refreshResponse.data) {
                    const token = refreshResponse.data.token;
                    // 새로 발급된 액세스 토큰으로 다시 요청 보내기
                    const newResponse = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        responseType: 'blob'
                    });

                    if(newResponse.data) {
                        const videoUrl = newResponse.data.data;
                        displayVideo(videoUrl);
                        return videoUrl;
                    }
                } else {
                    // 리프레시 토큰도 만료된 경우 또는 다른 이유로 실패한 경우
                    console.error("Refresh token is expired or invalid");
                    return null;
                }
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }

        }
        console.error("Error refreshing access token:", axiosError);
        return null;
    }
};

export const fileDownloadApi = async (token: string | null, refreshToken: string | null, fileName: string) => {
    const url = `${testUrl}/api/files/${fileName}`
    
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        })
        const result = response.data.data;
        return result
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 403 && refreshToken) {
            try {
                // 액세스 토큰 만료로 인한 에러 발생 시, refreshToken을 사용하여 새로운 액세스 토큰 발급
                const refreshResponse = await getAccessTokenApi(refreshToken)

                if (refreshResponse.data) {
                    const token = refreshResponse.data.token;
                    // 새로 발급된 액세스 토큰으로 다시 요청 보내기
                    const newResponse = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },

                    });
                    

                    const result = newResponse.data.data;
                    localStorage.setItem('token',token);
                    
                    return result;
                } else {
                    // 리프레시 토큰도 만료된 경우 또는 다른 이유로 실패한 경우
                    console.error("Refresh token is expired or invalid");
                    return null;
                }
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }

        }
        console.error("Error refreshing access token:", axiosError);
        return null;
    }


    

}

function displayImage(imageUrl: string) {
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    // Assuming you have a div with id "imageContainer" to display the image
    const imageContainer = document.getElementById('imageContainer');
    imageContainer?.appendChild(imgElement);
}

function displayVideo(videoUrl: string) {
    const videoElement = document.createElement('video');
    videoElement.src = videoUrl;
    videoElement.controls = true; // Show video controls (play, pause, etc.)
    videoElement.setAttribute('width', '640'); // Set video width
    videoElement.setAttribute('height', '480'); // Set video height

    const videoContainer = document.getElementById('videoContainer');
    videoContainer?.appendChild(videoElement);
}