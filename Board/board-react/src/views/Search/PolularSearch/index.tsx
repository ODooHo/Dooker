import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import {PopularSearchList } from "../../../interfaces";
import { useCookies } from "react-cookie";
import { PopularSearchApi } from "../../../apis/searchApis";

export default function PopularSearch() {
  // 무작위로 인기 검색어 리스트를 만듭니다. (임시 데이터)
  const [popularSearches, setPopularSearches] = useState<PopularSearchList[]>([]);
  const [cookies] = useCookies();

  useEffect(() => {
    async function fetchData(){
      const token = cookies.token;
      try{
        const response = await PopularSearchApi(token);
        const data = response.data;
        setPopularSearches(data);
      }catch(error){
        console.error("게시글 가져오기 실패:", error);
        setPopularSearches([]);
      }
    }
    fetchData();
  }, []);



  return (
    <Card 
    sx={{ minWidth: 275, maxWidth: "20vw", padding: 2, marginTop: "100px" }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          인기 검색어
        </Typography>
        <Grid container spacing={2}>
          {popularSearches.map((search, index) => (
            <Grid item xs={6} key={index}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={40}
                bgcolor="#f0f0f0"
                borderRadius={5}
              >
                <Typography variant="body1" align="center">
                  {search.popularTerm}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}