package dev.streaming.upload.controllers;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.GenreRequest;
import dev.streaming.upload.DTO.response.GenreResponse;
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


    @DeleteMapping
    ApiResponse<Void> delete(@RequestParam String genreName) {
        genreService.delete(genreName);
        return ApiResponse.<Void>builder().build();
    }
}
