package dev.streaming.upload.services;

import dev.streaming.upload.DTO.request.CreateCommentRequest;
import dev.streaming.upload.DTO.response.CommentResponse;
import dev.streaming.upload.DTO.response.PagedResponse;
import dev.streaming.upload.Entity.Comment;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.User;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.repository.CommentRepository;
import dev.streaming.upload.repository.MovieRepository;
import dev.streaming.upload.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class CommentService {
    private CommentRepository commentRepository;

    private MovieRepository movieRepository;

    private UserRepository userRepository;

    public CommentResponse createComment(CreateCommentRequest request, String userId) {
        // validate user exist
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // validate movieExists
        Movie movie = movieRepository.findById(request.getMovieId()).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Long finalParentId = null;

        // Validate parent comment if provided and ensure only 2-level comments
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId()).orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

            if (parentComment.getParentCommentId() != null) {
                finalParentId = parentComment.getParentCommentId();
            } else {
                finalParentId = request.getParentCommentId();
            }

        }

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setEpisodeNumber(request.getEpisodeNumber());
        comment.setParentCommentId(finalParentId);
        comment.setUser(user);
        comment.setMovie(movie);

        Comment savedComment = commentRepository.save(comment);

        return mapToResponseDTO(savedComment);
    }

    public CommentResponse likeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        comment.setLikesCount(comment.getLikesCount() + 1);
        Comment updatedComment = commentRepository.save(comment);

        return mapToResponseDTO(updatedComment);
    }

    public CommentResponse dislikeComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        comment.setLikesCount(comment.getDislikesCount() + 1);
        Comment updatedComment = commentRepository.save(comment);

        return mapToResponseDTO(updatedComment);
    }

    public Long countCommentsByMovieAndEpisode(String movieId, Integer episodeNumber) {
        return commentRepository.countByMovieIdAndEpisodeNumber(movieId, episodeNumber);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getUserComments(String userId, int page, int size) {
        userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Comment> userComments = commentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        return userComments.getContent().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private CommentResponse mapToResponseDTOSafe(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setEpisodeNumber(comment.getEpisodeNumber());
        dto.setParentCommentId(comment.getParentCommentId());
        dto.setLikesCount(comment.getLikesCount());
        dto.setIsEdited(comment.getIsEdited());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());

        // User info - safe access
        try {
            dto.setUserId(comment.getUser().getId());
            dto.setUsername(comment.getUser().getUsername());
            dto.setUserAvatar(comment.getUser().getAvatar());
        } catch (Exception e) {
            log.warn("Could not load user info for comment {}", comment.getId());
        }

        // Movie info - safe access
        try {
            dto.setMovieId(comment.getMovie().getId());
            dto.setMovieTitle(comment.getMovie().getTitle());
        } catch (Exception e) {
            log.warn("Could not load movie info for comment {}", comment.getId());
        }

        // Set reply info
        dto.setIsReply(comment.getParentCommentId() != null);

        return dto;
    }

    public PagedResponse<CommentResponse> getMovieComments(String movieId,int episodeNumber, int page, int size) {
        movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Comment> comments = commentRepository.findByMovieIdAndEpisodeNumber(movieId, episodeNumber, pageable);

        List<CommentResponse> commentResponseList = comments.getContent()
                .stream()
                .map(this::mapToResponseDTOSafe)
                .collect(Collectors.toList());
        return new PagedResponse<>(
                commentResponseList,
                comments.getNumber(),       // current page
                comments.getTotalPages(),   // total pages
                comments.getTotalElements(),// total items
                comments.getSize()          // page size
        );
    }

    private CommentResponse mapToResponseDTO(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setEpisodeNumber(comment.getEpisodeNumber());
        dto.setParentCommentId(comment.getParentCommentId());
        dto.setLikesCount(comment.getLikesCount());
        dto.setIsEdited(comment.getIsEdited());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());

        // User info
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setUserAvatar(comment.getUser().getAvatar());

        // Movie info
        dto.setMovieId(comment.getMovie().getId());
        dto.setMovieTitle(comment.getMovie().getTitle());

        // Set reply info
        dto.setIsReply(comment.getParentCommentId() != null);
        dto.setReplyToUsername(comment.getParentComment().getUser().getUsername());
        return dto;
    }
}
