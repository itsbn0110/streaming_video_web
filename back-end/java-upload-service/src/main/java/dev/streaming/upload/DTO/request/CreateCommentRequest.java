package dev.streaming.upload.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class CreateCommentRequest {
    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Content cannot exceed 1000 characters")
    private String content;

    @NotNull(message = "Movie ID is required")
    private String movieId;

    private Integer episodeNumber;

    private Long parentCommentId; // Optional for replies (only 2 levels supported)

    // Optional: ID of the comment being replied to (for UI reference)
    private Long replyToCommentId; // This helps UI show "Replying to @username"
}
