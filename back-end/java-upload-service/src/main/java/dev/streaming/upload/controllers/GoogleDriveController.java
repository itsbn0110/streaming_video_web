package dev.streaming.upload.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.EpisodeUploadRequest;
import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.services.GoogleDriveService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/google-drive")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoogleDriveController {

    GoogleDriveService googleDriveService;

    @PreAuthorize(value = "hasRole('ADMIN')")
    @PostMapping("/upload")
    public ApiResponse<MovieResponse> uploadMovie(
            @RequestParam("request") String requestJson,
            @RequestPart("thumbnailFile") MultipartFile thumbnailFile,
            @RequestPart(value = "movieFile", required = false) MultipartFile movieFile,
            @RequestPart("movieBackDrop") MultipartFile movieBackDrop)
            throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        MovieUploadRequest request = mapper.readValue(requestJson, MovieUploadRequest.class);

        log.info("title: {}", request.getTitle());
        MovieResponse response = googleDriveService.uploadMovie(request, thumbnailFile, movieFile, movieBackDrop);

        return ApiResponse.<MovieResponse>builder().result(response).build();
    }

    @PreAuthorize(value = "hasRole('ADMIN')")
    @PostMapping("/upload-episode")
    public ApiResponse<MovieResponse> uploadEpisodeMovie(
            @RequestParam("request") String requestJson,
            @RequestPart(value = "movieFile", required = false) MultipartFile movieFile)
            throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        EpisodeUploadRequest request = mapper.readValue(requestJson, EpisodeUploadRequest.class);

        MovieResponse response = googleDriveService.uploadEpisodeMovie(request, movieFile, request.getMovieId());

        return ApiResponse.<MovieResponse>builder().result(response).build();
    }
}
