package com.dooho.board.api.board.search;

import com.dooho.board.api.board.BoardRepository;
import com.dooho.board.api.board.dto.BoardDto;
import com.dooho.board.api.board.search.dto.PopularSearchDto;
import com.dooho.board.api.board.search.dto.SearchDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Slf4j
@Service
public class SearchService {

    private final BoardRepository boardRepository;

    private final SearchRepository searchRepository;

    public SearchService(BoardRepository boardRepository, SearchRepository searchRepository) {
        this.boardRepository = boardRepository;
        this.searchRepository = searchRepository;
    }

    public List<BoardDto> getSearchList(SearchDto dto){
        String searchWord = dto.searchWord();
        SearchEntity searchEntity = searchRepository.findById(searchWord).orElse(null);
        if(searchEntity != null){
            Integer count = searchEntity.getPopularSearchCount();
            searchEntity.setPopularSearchCount(count+1);
            searchRepository.save(searchEntity);
        }else{
            PopularSearchDto searchDto = PopularSearchDto.of(searchWord, 1);
            searchRepository.save(searchDto.toEntity());
        }
        return boardRepository.findByTitleContains(searchWord)
                .stream()
                .map(BoardDto::from)
                .toList();

    }


    @Transactional(readOnly = true)
    public List<PopularSearchDto> getPopularSearchList(){
        return searchRepository.findTop10()
                .stream()
                .map(PopularSearchDto::from)
                .toList();
    }

}
