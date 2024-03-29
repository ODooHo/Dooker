package com.dooho.board.api.board.search.querydsl;

import com.dooho.board.api.board.search.QSearchEntity;
import com.dooho.board.api.board.search.SearchEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomSearchRepositoryImpl implements CustomSearchRepository{
    @PersistenceContext
    EntityManager em;

    private JPAQueryFactory queryFactory;
    private final QSearchEntity qSearchEntity = QSearchEntity.searchEntity;


    public CustomSearchRepositoryImpl(EntityManager em){
        this.queryFactory = new JPAQueryFactory(em);
    }




    @Override
    public List<SearchEntity> findTop10(){
        return queryFactory
                .selectFrom(qSearchEntity)
                .orderBy(qSearchEntity.popularSearchCount.desc())
                .limit(10)
                .fetch();

    }
}
