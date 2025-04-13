package dev.streaming.upload.controllers;


<<<<<<< HEAD
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
=======
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.GenreRequest;
import dev.streaming.upload.DTO.response.GenreResponse;
<<<<<<< HEAD
import dev.streaming.upload.Entity.Genre;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
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

<<<<<<< HEAD
    @GetMapping
    ApiResponse<List<Genre>> getAllGenres() {
        return ApiResponse.<List<Genre>>builder()
        .result(genreService.getAll())
        .build();
    }

    @PutMapping("/{genreId}")
    ApiResponse<GenreResponse> update(@PathVariable Long genreId,@RequestBody GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
        .result(genreService.update(genreId,request.getGenreName()))
        .message("Updated genres successfully!")
        .build();
    }

    @DeleteMapping("{genreId}")
    ApiResponse<Void> delete(@PathVariable Long genreId) {
         try {
            genreService.delete(genreId);
        } catch (Exception e) {
            throw new AppException(ErrorCode.DELETE_FAILED);
        }
        return ApiResponse.<Void>builder().message("deleted successfully").build();
=======

    @DeleteMapping
    ApiResponse<Void> delete(@RequestParam String genreName) {
        genreService.delete(genreName);
        return ApiResponse.<Void>builder().build();
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    }
}
