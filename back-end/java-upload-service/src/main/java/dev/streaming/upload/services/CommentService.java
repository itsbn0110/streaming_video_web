package dev.streaming.upload.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class CommentService {
    CommentRepository commentRepository;

    MovieRepository movieRepository;

    UserRepository userRepository;

    public CommentResponse createComment(CreateCommentRequest request, String userId) {
        // validate user exist
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // validate movieExists
        Movie movie = movieRepository
                .findById(request.getMovieId())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Long finalParentId = null;

        // Validate parent comment if provided and ensure only 2-level comments
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository
                    .findById(request.getParentCommentId())
                    .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

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
        Comment comment =
                commentRepository.findById(commentId).orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        comment.setLikesCount(comment.getLikesCount() + 1);
        Comment updatedComment = commentRepository.save(comment);

        return mapToResponseDTO(updatedComment);
    }

    public CommentResponse dislikeComment(Long commentId) {
        Comment comment =
                commentRepository.findById(commentId).orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));

        comment.setDislikesCount(comment.getDislikesCount() + 1);
        Comment updatedComment = commentRepository.save(comment);

        return mapToResponseDTO(updatedComment);
    }

    public Long countCommentsByMovieAndEpisode(String movieId, Integer episodeNumber) {
        return commentRepository.countByMovieIdAndEpisodeNumber(movieId, episodeNumber);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getUserComments(String userId, int page, int size) {
        userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Comment> userComments = commentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        return userComments.getContent().stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public CommentResponse mapToResponseDTOSafe(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setEpisodeNumber(comment.getEpisodeNumber());
        dto.setParentCommentId(comment.getParentCommentId());
        dto.setLikesCount(comment.getLikesCount());
        dto.setIsEdited(comment.getIsEdited());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setDislikesCount(comment.getDislikesCount());
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

    public PagedResponse<CommentResponse> getMovieComments(String movieId, Integer episodeNumber, int page, int size) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Comment> comments;

        if (movie.getCategories().stream().anyMatch(category -> category.getSlug().equals("phim-bo"))) {
            // Series movie: filter by episodeNumber
            comments = commentRepository.findByMovieIdAndEpisodeNumber(movieId, episodeNumber, pageable);
        } else {
            // Single movie: ignore episodeNumber
            comments = commentRepository.findByMovieId(movieId, pageable);
        }

        // Convert flat list of comments to a nested structure
        List<CommentResponse> commentResponseList = comments.getContent().stream()
                .map(this::mapToResponseDTOSafe)
                .collect(Collectors.toList());

        List<CommentResponse> nestedComments = buildNestedComments(commentResponseList);

        return new PagedResponse<>(
                nestedComments,
                comments.getNumber(),
                comments.getTotalPages(),
                comments.getTotalElements(),
                comments.getSize());
    }

    private List<CommentResponse> buildNestedComments(List<CommentResponse> comments) {
        Map<Long, CommentResponse> commentMap = comments.stream()
                .collect(Collectors.toMap(CommentResponse::getId, comment -> comment));

        List<CommentResponse> topLevelComments = new ArrayList<>();

        for (CommentResponse comment : comments) {
            if (comment.getParentCommentId() == null) {
                topLevelComments.add(comment);
            } else {
                CommentResponse parent = commentMap.get(comment.getParentCommentId());
                if (parent != null) {
                    if (parent.getReplies() == null) {
                        parent.setReplies(new ArrayList<>());
                    }
                    parent.getReplies().add(comment);
                }
            }
        }

        return topLevelComments;
    }

    public CommentResponse mapToResponseDTO(Comment comment) {
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
        if (comment.getParentComment() != null && comment.getParentComment().getUser() != null) {
            dto.setReplyToUsername(comment.getParentComment().getUser().getUsername());
        } else {
            dto.setReplyToUsername(null); // Handle null parent comment or user
        }

        return dto;
    }
}
