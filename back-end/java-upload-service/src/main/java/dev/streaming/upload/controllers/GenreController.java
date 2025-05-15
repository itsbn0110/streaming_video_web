package dev.streaming.upload.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.GenreRequest;
import dev.streaming.upload.DTO.response.GenreResponse;
import dev.streaming.upload.Entity.Genre;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.services.GenreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/genres")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreController {

    GenreService genreService;

    @PreAuthorize(value = "hasRole('ADMIN')")
    @PostMapping
    ApiResponse<GenreResponse> create(@RequestBody GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.create(request.getGenreName()))
                .message("Created genres successfully!")
                .build();
    }

    
    @GetMapping
    ApiResponse<List<Genre>> getAllGenres() {
        return ApiResponse.<List<Genre>>builder().result(genreService.getAll()).build();
    }

    @GetMapping("/{genreId}")
    ApiResponse<GenreResponse> getGenre(@PathVariable Long genreId) {
        return ApiResponse.<GenreResponse>builder()
        .result(genreService.getGenre(genreId))
        .build();
    }


    @PutMapping("/{genreId}")
    @PreAuthorize(value = "hasRole('ADMIN')")
    ApiResponse<GenreResponse> update(@PathVariable Long genreId, @RequestBody GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.update(genreId, request.getGenreName()))
                .message("Updated genres successfully!")
                .build();
    }

    @DeleteMapping("{genreId}")
    @PreAuthorize(value = "hasRole('ADMIN')")
    ApiResponse<Void> delete(@PathVariable Long genreId) {
        try {
            genreService.delete(genreId);
        } catch (Exception e) {
            throw new AppException(ErrorCode.DELETE_FAILED);
        }
        return ApiResponse.<Void>builder().message("deleted successfully").build();
    }
}
