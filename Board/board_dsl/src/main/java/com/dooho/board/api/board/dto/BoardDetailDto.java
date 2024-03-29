package com.dooho.board.api.board.dto;

import com.dooho.board.api.board.BoardEntity;
import com.dooho.board.api.board.liky.dto.LikyDto;
import com.dooho.board.api.comment.dto.CommentDto;
import com.dooho.board.api.user.UserEntity;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public record BoardDetailDto(
        Integer id,
        String title,
        String content,
        String image,
        String video,
        String file,
        LocalDate boardWriteDate,
        int clickCount,
        int likesCount,
        int commentsCount,
        UserEntity user,
        Set<CommentDto> comments,
        Set<LikyDto> likes
) {

    public static BoardDetailDto of(
            String title,
            String content,
            String image,
            String video,
            String file,
            LocalDate boardWriteDate,
            int clickCount,
            int likesCount,
            int commentsCount,
            UserEntity user,
            Set<CommentDto> comments,
            Set<LikyDto> likes
    ) {
        return new BoardDetailDto(null, title, content, image, video, file, boardWriteDate, clickCount, likesCount, commentsCount, user, comments, likes);
    }

    public static BoardDetailDto of(
            int id,
            String title,
            String content,
            String image,
            String video,
            String file,
            LocalDate boardWriteDate,
            int clickCount,
            int likesCount,
            int commentsCount,
            UserEntity user,
            Set<CommentDto> comments,
            Set<LikyDto> likes
    ) {
        return new BoardDetailDto(id, title, content, image, video, file, boardWriteDate, clickCount, likesCount, commentsCount, user, comments, likes);
    }

    public static BoardDetailDto from(BoardEntity board) {
        return new BoardDetailDto(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getImage(),
                board.getVideo(),
                board.getFile(),
                board.getBoardWriteDate(),
                board.getClickCount(),
                board.getLikes().size(),
                board.getComments().size(),
                board.getUser(),
                board.getComments().stream()
                        .map(CommentDto::from)
                        .collect(Collectors.toCollection(LinkedHashSet::new)),
                board.getLikes().stream()
                        .map(LikyDto::from)
                        .collect(Collectors.toCollection(LinkedHashSet::new))
        );
    }
}