import { useEffect, useState } from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import { Board } from "../../../interfaces";
import { BoardListApi } from "../../../apis/boardApis";

// 인터페이스를 정의합니다.

interface BoardListProps {
  onDetailClick: (boardId: number) => void;
}

export default function BoardList({ onDetailClick }: BoardListProps) {
  // authView : true - signUp / false - signIn
  const [boardData, setBoardData] = useState<Board[]>([]); // 인터페이스를 적용하여 배열의 요소를 정확히 타입화합니다.

  const [cookies] = useCookies();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5; // 한 페이지에 보여줄 게시글 수
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const BoardHandler = async () => {
    try {
      const response = await BoardListApi(token, refreshToken);
      const data = response.data;
      setBoardData(data);
    } catch (error) {
      console.error("게시글 가져오기 실패:", error);
      setBoardData([]); // 실패 시 빈 배열로 초기화
    }
  };

  // 페이지가 변경될 때마다 API를 호출하도록 useEffect 사용
  useEffect(() => {
    BoardHandler();
  }, [currentPage]);

  // 컴포넌트가 마운트되면 바로 게시글을 확인하도록 useEffect 사용
  useEffect(() => {
    BoardHandler();
  }, []);


  const getPageNumbers = (totalPages: number) => {
    const pageNumbers = [];
    const maxPageToShow = 5; // 최대 5개의 페이지 번호만 표시
    const getPageData = () => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return boardData.slice(startIndex, endIndex);
    };

    if (currentPage <= maxPageToShow) {
      // 현재 페이지가 maxPageToShow 이하이면, 1부터 현재 페이지까지 표시
      for (let i = 1; i <= Math.min(totalPages, maxPageToShow); i++) {
        pageNumbers.push(i);
      }
    } else {
      // 현재 페이지가 maxPageToShow 이상이면, "..." 표시를 추가하여 이전 페이지로 이동할 수 있도록 함
      pageNumbers.push(1, "...");

      // 현재 페이지를 기준으로 앞뒤로 2개의 페이지 번호를 표시
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        if (i > 1 && i < totalPages) {
          pageNumbers.push(i);
        }
      }

      // 뒤로 이동할 수 있도록 "..." 표시 추가
      pageNumbers.push("...", totalPages);
    }

    return pageNumbers;
  };

  const totalPages = Math.ceil(boardData.length / pageSize);
  const pageNumbers = getPageNumbers(totalPages);

  const getPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return boardData.slice(startIndex, endIndex);
  };

  const pageData = getPageData();

  const defaultImage = "default-image.png";
  return (
    <>
      <Card
        elevation={0}
        sx={{
          minWidth: 300,
          maxWidth: "40vw",
          padding: 5,
          marginTop: "100px",
          marginLeft: "30px",
          backgroundColor: "#FAFAFA",
        }}
      >
        <Box>
          <Typography variant="h5">최신 게시글</Typography>
        </Box>
        <Box
          height={"70vh"}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Box flex="1" overflow="auto">
            {pageData.map((board) => (
              <div key={board.id}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  sx={{
                    my: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    padding: 2,
                    backgroundColor: "white",
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
                          src={board.user.userProfile|| defaultImage}
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
                        >
                          {board.user.userNickname }
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
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
                      }}
                    >
                      {board.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mt: 1, textAlign: "left" }}
                    >
                      {board.content.slice(0, 80)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      조회수: {board.clickCount} 좋아요:{" "}
                      {board.likesCount} 댓글: {board.commentsCount}
                    </Typography>
                  </Box>
                </Button>
              </div>
            ))}
          </Box>
          {/* 페이징 처리 버튼 */}
          <Box display="flex" justifyContent="center" mt={2}>
            {pageNumbers.map((pageNumber, index) => (
              <Typography
                key={index}
                onClick={() =>
                  setCurrentPage(
                    pageNumber === "..." ? currentPage : Number(pageNumber)
                  )
                }
                variant="body1"
                component="span"
                color={
                  pageNumber === currentPage ? "primary" : "text.secondary"
                }
                sx={{
                  cursor: "pointer",
                  mx: 1,
                  width: "40px", // 조절 가능한 버튼의 너비 값
                  height: "40px", // 조절 가능한 버튼의 높이 값
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    pageNumber === currentPage ? "#f0f0f0" : "transparent",
                  borderRadius : "50%",
                  transition: "background-color 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {pageNumber}
              </Typography>
            ))}
          </Box>
        </Box>
      </Card>
    </>
  );
}
