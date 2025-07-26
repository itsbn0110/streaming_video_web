package dev.streaming.upload.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.PlaylistRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.DTO.response.PlaylistResponse;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.mapper.MovieMapper;
import dev.streaming.upload.services.PlaylistService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/playlists")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PlaylistController {

    PlaylistService playlistService;
    MovieMapper movieMapper;

    @GetMapping
    public ApiResponse<List<PlaylistResponse>> getUserPlaylists(
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<PlaylistResponse> playlists = playlistService.getUserPlaylists(userId);
        return ApiResponse.<List<PlaylistResponse>>builder()
                .result(playlists)
                .build();
    }

    @GetMapping("/{playlistId}")
    public ApiResponse<PlaylistResponse> getPlaylistById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long playlistId) {
        String userId = jwt.getSubject();
        PlaylistResponse playlist = playlistService.getPlaylistById(userId, playlistId);
        return ApiResponse.<PlaylistResponse>builder()
                .result(playlist)
                .build();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PlaylistResponse> createPlaylist(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody PlaylistRequest request) {
        String userId = jwt.getSubject();
        PlaylistResponse playlist = playlistService.createPlaylist(userId, request);
        return ApiResponse.<PlaylistResponse>builder()
                .result(playlist)
                .message("Playlist created successfully")
                .build();
    }

    @PutMapping("/{playlistId}")
    public ApiResponse<PlaylistResponse> updatePlaylist(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long playlistId,
            @RequestBody PlaylistRequest request) {
        String userId = jwt.getSubject();
        PlaylistResponse playlist = playlistService.updatePlaylist(userId, playlistId, request);
        return ApiResponse.<PlaylistResponse>builder()
                .result(playlist)
                .message("Playlist updated successfully")
                .build();
    }

    @DeleteMapping("/{playlistId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> deletePlaylist(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long playlistId) {
        String userId = jwt.getSubject();
        playlistService.deletePlaylist(userId, playlistId);
        return ApiResponse.<Void>builder()
                .message("Playlist deleted successfully")
                .build();
    }

    @PostMapping("/{playlistId}/movies/{movieId}")
    public ApiResponse<PlaylistResponse> addMovieToPlaylist(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long playlistId,
            @PathVariable String movieId) {
        String userId = jwt.getSubject();
        PlaylistResponse playlist = playlistService.addMovieToPlaylist(userId, playlistId, movieId);
        return ApiResponse.<PlaylistResponse>builder()
                .result(playlist)
                .message("Movie added to playlist successfully")
                .build();
    }

    @DeleteMapping("/{playlistId}/movies/{movieId}")
    public ApiResponse<PlaylistResponse> removeMovieFromPlaylist(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long playlistId,
            @PathVariable String movieId) {
        String userId = jwt.getSubject();
        PlaylistResponse playlist = playlistService.removeMovieFromPlaylist(userId, playlistId, movieId);
        return ApiResponse.<PlaylistResponse>builder()
                .result(playlist)
                .message("Movie removed from playlist successfully")
                .build();
    }

    @DeleteMapping("/{playlistId}/clear")
    public ApiResponse<PlaylistResponse> clearPlaylist(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long playlistId) {
        String userId = jwt.getSubject();
        PlaylistResponse playlist = playlistService.clearPlaylist(userId, playlistId);
        return ApiResponse.<PlaylistResponse>builder()
                .result(playlist)
                .message("Playlist cleared successfully")
                .build();
    }

    @GetMapping("/{playlistId}/movies")
    public ApiResponse<List<MovieResponse>> getPlaylistMovies(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long playlistId) {
        String userId = jwt.getSubject();
        List<Movie> movies = playlistService.getPlaylistMovies(userId, playlistId);
        List<MovieResponse> movieResponses = movies.stream()
                .map(movieMapper::toMovieResponse)
                .toList();
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieResponses)
                .build();
    }
}
