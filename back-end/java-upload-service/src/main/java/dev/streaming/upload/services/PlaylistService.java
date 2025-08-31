package dev.streaming.upload.services;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.streaming.upload.DTO.request.PlaylistRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.DTO.response.PlaylistResponse;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.Playlist;
import dev.streaming.upload.Entity.User;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.MovieMapper;
import dev.streaming.upload.mapper.PlaylistMapper;
import dev.streaming.upload.repository.MovieRepository;
import dev.streaming.upload.repository.PlaylistRepository;
import dev.streaming.upload.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PlaylistService {

    PlaylistRepository playlistRepository;
    UserRepository userRepository;
    MovieRepository movieRepository;
    PlaylistMapper playlistMapper;
    MovieMapper movieMapper;

    @PersistenceContext
    EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<PlaylistResponse> getUserPlaylists(String userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            List<Playlist> playlists = playlistRepository.findByUser(user);

            return playlists.stream()
                    .map(this::mapPlaylistToResponse) // Sử dụng custom mapping
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting user playlists for userId: {}", userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Transactional(readOnly = true)
    public PlaylistResponse getPlaylistById(String userId, Long playlistId) {
        try {
            Playlist playlist = findPlaylistByIdAndUserId(playlistId, userId);
            return mapPlaylistToResponse(playlist);
        } catch (Exception e) {
            log.error("Error getting playlist by id: {} for userId: {}", playlistId, userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    // Thay đổi: Custom mapping method để tránh lazy loading issues
    private PlaylistResponse mapPlaylistToResponse(Playlist playlist) {
        PlaylistResponse response = playlistMapper.toPlaylistResponse(playlist);

        // Load movies separately using native query để tránh lazy loading
        List<MovieResponse> movieResponses =
                getPlaylistMovies(playlist.getUser().getId(), playlist.getId());

        response.setMovies(movieResponses);
        return response;
    }

    @Transactional
    public PlaylistResponse createPlaylist(String userId, PlaylistRequest request) {
        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            Playlist playlist = playlistMapper.toPlaylist(request);
            playlist.setUser(user);
            playlist.setCreatedAt(LocalDateTime.now());
            playlist.setUpdatedAt(LocalDateTime.now());
            // Không cần set movies ở đây vì đã có default value

            Playlist savedPlaylist = playlistRepository.save(playlist);

            // Flush để đảm bảo data được lưu
            entityManager.flush();

            return mapPlaylistToResponse(savedPlaylist);
        } catch (Exception e) {
            log.error("Error creating playlist for userId: {}", userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Transactional
    public PlaylistResponse updatePlaylist(String userId, Long playlistId, PlaylistRequest request) {
        try {
            Playlist playlist = findPlaylistByIdAndUserId(playlistId, userId);

            playlist.setName(request.getName());
            playlist.setDescription(request.getDescription());
            playlist.setUpdatedAt(LocalDateTime.now());

            Playlist updatedPlaylist = playlistRepository.save(playlist);
            entityManager.flush();

            return mapPlaylistToResponse(updatedPlaylist);
        } catch (Exception e) {
            log.error("Error updating playlist id: {} for userId: {}", playlistId, userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Transactional
    public void deletePlaylist(String userId, Long playlistId) {
        try {
            Playlist playlist = findPlaylistByIdAndUserId(playlistId, userId);

            // Xóa tất cả relationships trước
            entityManager
                    .createNativeQuery("DELETE FROM playlist_movie WHERE playlist_id = ?")
                    .setParameter(1, playlistId)
                    .executeUpdate();

            playlistRepository.delete(playlist);
            entityManager.flush();
        } catch (Exception e) {
            log.error("Error deleting playlist id: {} for userId: {}", playlistId, userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Transactional
    public PlaylistResponse addMovieToPlaylist(String userId, Long playlistId, String movieId) {
        try {
            // Kiểm tra playlist tồn tại và thuộc về user
            Playlist playlist = findPlaylistByIdAndUserId(playlistId, userId);

            // Kiểm tra movie tồn tại
            Movie movie =
                    movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));

            // Kiểm tra movie có trong playlist chưa
            if (isMovieInPlaylist(playlistId, movieId)) {
                throw new AppException(ErrorCode.MOVIE_ALREADY_IN_PLAYLIST);
            }

            // Thêm movie vào playlist bằng native query để tránh lazy loading
            entityManager
                    .createNativeQuery("INSERT INTO playlist_movie (playlist_id, movie_id) VALUES (?, ?)")
                    .setParameter(1, playlistId)
                    .setParameter(2, movieId)
                    .executeUpdate();

            // Cập nhật thời gian sửa đổi
            playlist.setUpdatedAt(LocalDateTime.now());
            playlistRepository.save(playlist);

            entityManager.flush();

            log.info("Successfully added movie {} to playlist {}", movieId, playlistId);
            return mapPlaylistToResponse(playlist);
        } catch (AppException ae) {
            throw ae;
        } catch (Exception e) {
            log.error("Error adding movie {} to playlist {} for userId: {}", movieId, playlistId, userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Transactional
    public PlaylistResponse removeMovieFromPlaylist(String userId, Long playlistId, String movieId) {
        try {
            // Kiểm tra playlist tồn tại và thuộc về user
            Playlist playlist = findPlaylistByIdAndUserId(playlistId, userId);

            // Kiểm tra movie tồn tại
            movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_EXISTED));

            // Kiểm tra movie có trong playlist không
            if (!isMovieInPlaylist(playlistId, movieId)) {
                throw new AppException(ErrorCode.MOVIE_NOT_IN_PLAYLIST);
            }

            // Xóa movie khỏi playlist bằng native query
            int rowsAffected = entityManager
                    .createNativeQuery("DELETE FROM playlist_movie WHERE playlist_id = ? AND movie_id = ?")
                    .setParameter(1, playlistId)
                    .setParameter(2, movieId)
                    .executeUpdate();

            if (rowsAffected == 0) {
                throw new AppException(ErrorCode.MOVIE_NOT_IN_PLAYLIST);
            }

            // Cập nhật thời gian sửa đổi
            playlist.setUpdatedAt(LocalDateTime.now());
            playlistRepository.save(playlist);

            entityManager.flush();

            log.info("Successfully removed movie {} from playlist {}", movieId, playlistId);
            return mapPlaylistToResponse(playlist);
        } catch (AppException ae) {
            throw ae;
        } catch (Exception e) {
            log.error("Error removing movie {} from playlist {} for userId: {}", movieId, playlistId, userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Transactional
    public PlaylistResponse clearPlaylist(String userId, Long playlistId) {
        try {
            // Kiểm tra playlist tồn tại và thuộc về user
            Playlist playlist = findPlaylistByIdAndUserId(playlistId, userId);

            // Xóa tất cả movies khỏi playlist bằng native query
            entityManager
                    .createNativeQuery("DELETE FROM playlist_movie WHERE playlist_id = ?")
                    .setParameter(1, playlistId)
                    .executeUpdate();

            // Cập nhật thời gian sửa đổi
            playlist.setUpdatedAt(LocalDateTime.now());
            playlistRepository.save(playlist);

            entityManager.flush();

            log.info("Successfully cleared all movies from playlist {}", playlistId);
            return mapPlaylistToResponse(playlist);
        } catch (Exception e) {
            log.error("Error clearing playlist {} for userId: {}", playlistId, userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getPlaylistMovies(String userId, Long playlistId) {
        try {
            // Kiểm tra playlist tồn tại và thuộc về user
            findPlaylistByIdAndUserId(playlistId, userId);

            // Sử dụng native query để lấy danh sách movie_id
            @SuppressWarnings("unchecked")
            List<String> movieIds = entityManager
                    .createNativeQuery("SELECT movie_id FROM playlist_movie WHERE playlist_id = ?")
                    .setParameter(1, playlistId)
                    .getResultList();

            if (movieIds.isEmpty()) {
                return Collections.emptyList();
            }

            // Lấy đầy đủ thông tin các movie từ movieIds
            List<Movie> movies = movieRepository.findAllById(movieIds);

            // Chuyển đổi sang MovieResponse
            return movies.stream().map(movieMapper::toMovieResponse).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting movies for playlist {} and userId: {}", playlistId, userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    private Playlist findPlaylistByIdAndUserId(Long playlistId, String userId) {
        return playlistRepository
                .findByIdAndUserId(playlistId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAYLIST_NOT_EXISTED));
    }

    private boolean isMovieInPlaylist(Long playlistId, String movieId) {
        try {
            log.info("check playlistId: {}", playlistId);
            Number count = (Number) entityManager
                    .createNativeQuery("SELECT COUNT(*) FROM playlist_movie WHERE playlist_id = ? AND movie_id = ?")
                    .setParameter(1, playlistId)
                    .setParameter(2, movieId)
                    .getSingleResult();
            log.info("check count: {}", count);
            return count != null && count.intValue() > 0;
        } catch (Exception e) {
            log.warn("Error checking if movie is in playlist: {}", e.getMessage());
            return false;
        }
    }

    @Transactional
    public void addMovieToPlaylists(String userId, List<Long> playlistIds, String movieId) {
        try {

            Movie movie = movieRepository.findById(movieId).orElseThrow(() -> {
                log.error("Movie with ID {} does not exist", movieId);
                return new AppException(ErrorCode.MOVIE_NOT_EXISTED);
            });

            // Check if the movie is already in any of the playlists
            List<Long> existingPlaylists = playlistIds.stream()
                    .filter(playlistId -> isMovieInPlaylist(playlistId, movieId))
                    .collect(Collectors.toList());

            if (!existingPlaylists.isEmpty()) {
                log.warn("Movie {} is already in playlists: {}", movieId, existingPlaylists);
                throw new AppException(ErrorCode.MOVIE_ALREADY_IN_PLAYLIST);
            }

            // Add the movie to all playlists where it does not exist
            for (Long playlistId : playlistIds) {
                Playlist playlist = findPlaylistByIdAndUserId(playlistId, userId);

                entityManager
                        .createNativeQuery("INSERT INTO playlist_movie (playlist_id, movie_id) VALUES (?, ?)")
                        .setParameter(1, playlistId)
                        .setParameter(2, movieId)
                        .executeUpdate();
            }

            log.info("Successfully added movie {} to playlists {} for user {}", movieId, playlistIds, userId);
        } catch (AppException e) {
            log.error("Error adding movie to playlists for userId: {}. Reason: {}", userId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error adding movie to playlists for userId: {}", userId, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
}
