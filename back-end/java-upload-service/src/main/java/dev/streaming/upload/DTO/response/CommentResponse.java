package dev.streaming.upload.DTO.response;


import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private Integer episodeNumber;
    private Long parentCommentId;
    private Integer likesCount;
    private Boolean isEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // User info
    private String userId;
    private String username;
    private String userAvatar;

    // Movie info
    private String movieId;
    private String movieTitle;

    // Level 2 replies only (flattened structure)
    private List<CommentResponse> replies;

    // For UI: indicate if this is a reply and who it's replying to
    private Boolean isReply; // true if parentCommentId is not null
    private String replyToUsername; // username of the person being replied to
    private Long replyToCommentId; // ID of the comment being replied to
}
