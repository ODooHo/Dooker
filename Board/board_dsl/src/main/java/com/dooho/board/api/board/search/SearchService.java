package com.dooho.board.api.board.search;

import com.dooho.board.api.ResponseDto;
import com.dooho.board.api.board.BoardEntity;
import com.dooho.board.api.board.BoardRepository;
import com.dooho.board.api.board.search.dto.SearchDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Transactional(readOnly = true)
@Slf4j
@Service
public class SearchService {

    private final BoardRepository boardRepository;

    private final SearchRepository searchRepository;

    public SearchService(BoardRepository boardRepository, SearchRepository searchRepository) {
        this.boardRepository = boardRepository;
        this.searchRepository = searchRepository;
    }

    public ResponseDto<List<BoardEntity>> getSearchList(SearchDto dto){
        SearchEntity searchEntity = null;
        String searchWord = dto.popularTerm();
        List<BoardEntity> boardList = new ArrayList<BoardEntity>();
        try{
            if(searchRepository.existsByPopularTerm(searchWord)){
                searchEntity = searchRepository.findById(searchWord).orElse(null);
                Integer count = searchEntity.getPopularSearchCount() + 1;
                searchEntity.setPopularSearchCount(count);
                searchRepository.save(searchEntity);
            }else{
                searchEntity = SearchEntity.of(dto.popularTerm(),dto.popularSearchCount());
                searchEntity.setPopularSearchCount(1);
                searchRepository.save(searchEntity);
            }
            boardList = boardRepository.findByTitleContains(searchWord);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseDto.setFailed("DataBase Error!");
        }

        return ResponseDto.setSuccess("Success",boardList);
    }


    public ResponseDto<List<SearchEntity>> getPopularSearchList(){
        List<SearchEntity> popularSearchList = new ArrayList<SearchEntity>();

        try{
            popularSearchList = searchRepository.findTop10();
        }catch (Exception e){
            e.printStackTrace();
            return ResponseDto.setFailed("DataBase Error!");
        }

        return ResponseDto.setSuccess("Success",popularSearchList);
    }

}
