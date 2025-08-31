package dev.streaming.upload.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Find comments by movie and episode (only parent comments)
    @Query(
            "SELECT c FROM Comment c WHERE c.movie.id = :movieId AND c.episodeNumber = :episodeNumber AND c.parentCommentId IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findByMovieIdAndEpisodeNumberAndParentCommentIdIsNull(
            @Param("movieId") String movieId, @Param("episodeNumber") Integer episodeNumber, Pageable pageable);

    Page<Comment> findByUser_Id(String userId, Pageable pageable);

    long countByUser_Id(String userId);

    @Query("SELECT c FROM Comment c " + "LEFT JOIN FETCH c.user "
            + "LEFT JOIN FETCH c.movie "
            + "WHERE c.user.id = :userId "
            + "ORDER BY c.createdAt DESC")
    Page<Comment> findByUserIdWithFetch(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.user.id = :userId")
    Page<Comment> findCommentsByUserId(@Param("userId") String userId, Pageable pageable);

    // Find replies for a comment
    @Query("SELECT c FROM Comment c WHERE c.parentCommentId = :parentCommentId ORDER BY c.createdAt ASC")
    List<Comment> findByParentCommentId(@Param("parentCommentId") Long parentCommentId);

    // Find comments by user
    Page<Comment> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    // Find comment by ID with user and movie
    @Query("SELECT c FROM Comment c JOIN FETCH c.user JOIN FETCH c.movie WHERE c.id = :id")
    Optional<Comment> findByIdWithUserAndMovie(@Param("id") Long id);

    // Count comments by movie and episode
    Long countByMovieIdAndEpisodeNumber(String movieId, Integer episodeNumber);

    Page<Comment> findByMovieIdAndEpisodeNumber(String movieId, Integer episodeNumber, Pageable pageable);

    // Delete comments by movie ID
    void deleteByMovieId(String movieId);

    Page<Comment> findByMovieId(String movieId, Pageable pageable);
}
