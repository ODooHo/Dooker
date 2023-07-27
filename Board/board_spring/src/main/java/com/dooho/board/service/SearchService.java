package com.dooho.board.service;

import com.dooho.board.dto.SearchDto;
import com.dooho.board.dto.ResponseDto;
import com.dooho.board.entity.BoardEntity;
import com.dooho.board.entity.SearchEntity;
import com.dooho.board.repository.BoardRepository;
import com.dooho.board.repository.SearchRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Slf4j
@Service
public class SearchService {

    private final BoardRepository boardRepository;

    private final SearchRepository searchRepository;

    @Autowired
    public SearchService(BoardRepository boardRepository, SearchRepository searchRepository) {
        this.boardRepository = boardRepository;
        this.searchRepository = searchRepository;
    }

    public ResponseDto<List<BoardEntity>> getSearchList(SearchDto dto){
        SearchEntity searchEntity = null;
        String searchWord = dto.getPopularTerm();
        List<BoardEntity> boardList = new ArrayList<BoardEntity>();
        try{
            if(searchRepository.existsByPopularTerm(searchWord)){
                searchEntity = searchRepository.findById(searchWord).orElse(null);
                Integer count = searchEntity.getPopularSearchCount() + 1;
                searchEntity.setPopularSearchCount(count);
                searchRepository.save(searchEntity);
            }else{
                searchEntity = new SearchEntity(dto);
                searchEntity.setPopularSearchCount(1);
                searchRepository.save(searchEntity);
            }
            boardList = boardRepository.findByBoardTitleContains(searchWord);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseDto.setFailed("DataBase Error!");
        }

        return ResponseDto.setSuccess("Success",boardList);
    }


    public ResponseDto<List<SearchEntity>> getPopularSearchList(){
        List<SearchEntity> popularSearchList = new ArrayList<SearchEntity>();

        try{
            popularSearchList = searchRepository.findTop10ByOrderByPopularSearchCountDesc();
        }catch (Exception e){
            e.printStackTrace();
            return ResponseDto.setFailed("DataBase Error!");
        }

        return ResponseDto.setSuccess("Success",popularSearchList);
    }

}
