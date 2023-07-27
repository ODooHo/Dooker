import { useState } from "react";
import { Box, Grid } from "@mui/material";
import BoardTop3 from "./BoardTop3";
import BoardList from "./BoardList";
import BoardDetail from "./BoardDetail";
import PopularSearch from "../Search/PolularSearch";

export default function BoardMain() {

  const [currentPage, setCurrentPage] = useState('Main'); // 초기 페이지를 'boardMain'으로 설정합니다
  const [currentBoardId, setCurrentBoardId] = useState<number>(1); // 선택된 게시물의 ID를 상태로 관리
  
  const handleMainClick = () => {
    setCurrentPage('Main')
  }
  
  

  const handleDetailClick = (boardId: number) => {
    setCurrentBoardId(boardId); // 선택한 게시물의 ID를 상태로 관리
    setCurrentPage('Detail'); // 페이지 전환을 Detail 페이지로 설정
  };
  return (
    <>
    {currentPage === 'Main'?(
    <Box display="flex" flexDirection="column">
      <Box>
      <BoardTop3 onDetailClick={handleDetailClick} />
    </Box>
    <Grid container spacing={2} padding={5}>
      <Grid item xs={12} md={6} >
        <BoardList onDetailClick={handleDetailClick} />
      </Grid>
      <Grid item xs={12} md={6}>
        <PopularSearch />
      </Grid>
    </Grid>
  </Box>
    ) :(
        <BoardDetail 
          onMainClick={handleMainClick}
          currentPage={currentPage}
          boardNumber={currentBoardId}
          />)
    }
    </>
  );
}
