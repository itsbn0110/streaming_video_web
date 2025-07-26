package dev.streaming.upload.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.streaming.upload.DTO.request.PlaylistRequest;
import dev.streaming.upload.DTO.response.PlaylistResponse;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.Playlist;
import dev.streaming.upload.Entity.User;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
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

    public List<PlaylistResponse> getUserPlaylists(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Playlist> playlists = playlistRepository.findByUser(user);

        if (playlists.isEmpty()) {
            // Tạo playlist mặc định nếu người dùng chưa có playlist nào
            Playlist defaultPlaylist = createDefaultPlaylist(user);
            playlists = List.of(defaultPlaylist);
        }

        return playlists.stream()
                .map(playlistMapper::toPlaylistResponse)
                .collect(Collectors.toList());
    }

    public PlaylistResponse getPlaylistById(String userId, Long playlistId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Playlist playlist = playlistRepository.findByUserAndId(user, playlistId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAYLIST_NOT_FOUND));

        return playlistMapper.toPlaylistResponse(playlist);
    }

    private Playlist createDefaultPlaylist(User user) {
        Playlist playlist = Playlist.builder()
                .name(user.getUsername() + "'s Playlist")
                .description("My favorite movies collection")
                .user(user)
                .movies(new HashSet<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return playlistRepository.save(playlist);
    }

    @Transactional
    public PlaylistResponse createPlaylist(String userId, PlaylistRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Playlist playlist = Playlist.builder()
                .name(request.getName())
                .description(request.getDescription())
                .user(user)
                .movies(new HashSet<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Thêm phim vào playlist nếu có movieId
        if (request.getMovieId() != null && !request.getMovieId().isEmpty()) {
            Movie movie = movieRepository.findById(request.getMovieId())
                    .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
            playlist.getMovies().add(movie);
        }

        Playlist savedPlaylist = playlistRepository.save(playlist);
        log.info("Created new playlist '{}' for user {}", request.getName(), user.getUsername());

        return playlistMapper.toPlaylistResponse(savedPlaylist);
    }

    @Transactional
    public PlaylistResponse updatePlaylist(String userId, Long playlistId, PlaylistRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Playlist playlist = playlistRepository.findByUserAndId(user, playlistId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAYLIST_NOT_FOUND));

        playlist.setName(request.getName());
        playlist.setDescription(request.getDescription());
        playlist.setUpdatedAt(LocalDateTime.now());

        playlistRepository.save(playlist);
        log.info("Updated playlist '{}' for user {}", request.getName(), user.getUsername());

        return playlistMapper.toPlaylistResponse(playlist);
    }

    @Transactional
    public void deletePlaylist(String userId, Long playlistId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Playlist playlist = playlistRepository.findByUserAndId(user, playlistId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAYLIST_NOT_FOUND));

        playlistRepository.delete(playlist);
        log.info("Deleted playlist '{}' for user {}", playlist.getName(), user.getUsername());
    }

    @Transactional
    public PlaylistResponse addMovieToPlaylist(String userId, Long playlistId, String movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Playlist playlist = playlistRepository.findByUserAndId(user, playlistId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAYLIST_NOT_FOUND));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        // Kiểm tra xem phim đã có trong playlist chưa
        if (playlistRepository.existsByPlaylistIdAndMovieId(playlistId, movieId)) {
            throw new AppException(ErrorCode.MOVIE_ALREADY_IN_PLAYLIST);
        }

        playlist.getMovies().add(movie);
        playlist.setUpdatedAt(LocalDateTime.now());
        playlistRepository.save(playlist);

        log.info("Added movie '{}' to playlist '{}' for user {}", movie.getTitle(), playlist.getName(), user.getUsername());

        return playlistMapper.toPlaylistResponse(playlist);
    }

    @Transactional
    public PlaylistResponse removeMovieFromPlaylist(String userId, Long playlistId, String movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Playlist playlist = playlistRepository.findByUserAndId(user, playlistId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAYLIST_NOT_FOUND));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        // Kiểm tra xem phim có trong playlist không
        if (!playlistRepository.existsByPlaylistIdAndMovieId(playlistId, movieId)) {
            throw new AppException(ErrorCode.MOVIE_NOT_IN_PLAYLIST);
        }

        playlist.getMovies().remove(movie);
        playlist.setUpdatedAt(LocalDateTime.now());
        playlistRepository.save(playlist);

        log.info("Removed movie '{}' from playlist '{}' for user {}", movie.getTitle(), playlist.getName(), user.getUsername());

        return playlistMapper.toPlaylistResponse(playlist);
    }

    @Transactional
    public PlaylistResponse clearPlaylist(String userId, Long playlistId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Playlist playlist = playlistRepository.findByUserAndId(user, playlistId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAYLIST_NOT_FOUND));

        playlist.getMovies().clear();
        playlist.setUpdatedAt(LocalDateTime.now());
        playlistRepository.save(playlist);

        log.info("Cleared playlist '{}' for user {}", playlist.getName(), user.getUsername());

        return playlistMapper.toPlaylistResponse(playlist);
    }

    public List<Movie> getPlaylistMovies(String userId, Long playlistId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Playlist playlist = playlistRepository.findByUserAndId(user, playlistId)
                .orElseThrow(() -> new AppException(ErrorCode.PLAYLIST_NOT_FOUND));

        return new ArrayList<>(playlist.getMovies());
    }
}
