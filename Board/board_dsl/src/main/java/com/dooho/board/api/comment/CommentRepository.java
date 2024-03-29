package com.dooho.board.api.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CommentRepository extends JpaRepository<CommentEntity, Integer>{

    Integer countByBoard_Id(Integer boardId);

    List<CommentEntity> findByUser_UserEmail(String userEmail);

    List<CommentEntity> findAllByBoard_Id (Integer boardId);
}
