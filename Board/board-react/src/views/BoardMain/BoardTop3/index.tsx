import { useEffect, useState } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import { Board } from "../../../interfaces";
import { BoardTop3Api } from "../../../apis/boardApis";

// 인터페이스를 정의합니다.

interface BoardTop3Props {
  onDetailClick: (boardId: number) => void;
}

export default function BoardTop3({ onDetailClick }: BoardTop3Props) {
  // authView : true - signUp / false - signIn
  const [boardData, setBoardData] = useState<Board[]>([]); // 인터페이스를 적용하여 배열의 요소를 정확히 타입화합니다.
  const [cookies] = useCookies();
  const token = localStorage.getItem('token');;
  const refreshToken = localStorage.getItem('refreshToken');;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await BoardTop3Api(token, refreshToken);
        const data = response.data;
        setBoardData(data);
      } catch (error) {
        console.error("게시글 가져오기 실패:", error);
        setBoardData([]);
      }
    }

    fetchData();
  }, [cookies.token]); // Run only when cookies.token changes

  const defaultImage = "default-image.png";
  const images = ["1.jpg", "2.jpg", "3.jpg"]; // 이미지 파일 이름들

  return (
    <>
      <Box
        padding="5px"
        marginTop="100px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h5" align="center" gutterBottom>
          연간 Top3 게시글
        </Typography>
        <Divider />

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="flex-start" // Adjust alignment to the top
          flexWrap="wrap"
        >
          {boardData.slice(0,3).map((board,index) => (
            <Button
              key={board.id}
              variant="outlined"
              sx={{
                width: "300px",
                height: "400px",
                margin: "10px",
                display: "flex", // Add display flex to make flexbox work for the Button
                flexDirection: "column", // Stack the elements vertically
                justifyContent: "flex-end", // Center children vertically
                backgroundImage: `url(${images[index]})`, // 이미지 파일 경로 설정
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: 2,
                cursor: "pointer",
              }}
              onClick={() => onDetailClick(board.id)}
            >
                  <Box display="flex" width="100%" justifyContent="flex-start">
                    <Box display="flex" alignItems="flex-start">
                      <Box
                        width={35}
                        height={35}
                        borderRadius="50%"
                        overflow="hidden"
                        mr={1} // 이미지와 닉네임 사이의 간격을 설정합니다.
                      >
                        <img
                          src={board.user.userProfile || defaultImage}
                          width="100%"
                          height="100%"
                        />
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                      >
                        <Typography
                          variant="body1"
                          gutterBottom
                          marginBottom="3px"
                          color="white"
                        >
                          {board.user.userNickname}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#A4A4A4"
                          marginBottom="3px"
                        >
                          {board.boardWriteDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.2rem", // 원하는 글꼴 크기 설정 (예: 1.2rem)
                        color:"white"
                      }}
                    >
                      {board.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="#A4A4A4"
                      sx={{ mt: 1 ,textAlign: "left" }}
                    >
                      {board.content.slice(0, 80)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#A4A4A4"
                      sx={{ mt: 1 }}
                    >
                      조회수: {board.clickCount} 좋아요:{" "}
                      {board.likesCount} 댓글: {board.commentsCount}
                    </Typography>
                  </Box>
            </Button>
          ))}
        </Box>
      </Box>
    </>
  );
}
