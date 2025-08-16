package dev.streaming.upload.mapper;

import com.google.api.services.drive.model.Comment;
import dev.streaming.upload.DTO.response.CommentResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentResponse toCommentResponse(Comment comment);
}