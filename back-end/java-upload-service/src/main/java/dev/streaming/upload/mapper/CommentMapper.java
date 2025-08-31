package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;

import com.google.api.services.drive.model.Comment;

import dev.streaming.upload.DTO.response.CommentResponse;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentResponse toCommentResponse(Comment comment);
}
