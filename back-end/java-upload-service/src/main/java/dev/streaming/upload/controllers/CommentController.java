package dev.streaming.upload.controllers;


import dev.streaming.upload.DTO.request.CreateCommentRequest;
import dev.streaming.upload.DTO.response.CommentResponse;
import dev.streaming.upload.DTO.response.PagedResponse;
import dev.streaming.upload.services.CommentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {
    private CommentService commentService;


    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String userId = jwt.getSubject(); // Assuming JWT contains user ID
        log.info("User ID: {}", userId);
        CommentResponse comment = commentService.createComment(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<CommentResponse> likeComment(@PathVariable Long commentId) {
        CommentResponse comment = commentService.likeComment(commentId);
        return ResponseEntity.ok(comment);
    }

    @PostMapping("/{commentId}/dislike")
    public ResponseEntity<CommentResponse> dislikeComment(@PathVariable Long commentId) {
        CommentResponse comment = commentService.dislikeComment(commentId);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/movie/{movieId}/episode/{episodeNumber}/count")
    public ResponseEntity<Long> countComments(
            @PathVariable String movieId,
            @PathVariable Integer episodeNumber) {

        Long count = commentService.countCommentsByMovieAndEpisode(movieId, episodeNumber);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/get-all-comments/{movieId}/{episodeNumber}")
    public ResponseEntity<PagedResponse<CommentResponse>> getUserComments(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String movieId,
            @PathVariable Integer episodeNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<CommentResponse> comments = commentService.getMovieComments(movieId,episodeNumber, page, size);
        return ResponseEntity.ok(comments);
    }
}
