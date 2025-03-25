package dev.streaming.upload.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import dev.streaming.upload.DTO.ApiResponse;
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

    @PostMapping("/upload")
    public ApiResponse<MovieResponse> uploadMovie(
            @RequestParam("request") String requestJson,
            @RequestPart("thumbnailFile") MultipartFile thumbnailFile,
            @RequestPart("movieFile") MultipartFile movieFile)
            throws Exception {
        // Chuyển đổi JSON string thành MovieUploadRequest object
        ObjectMapper mapper = new ObjectMapper();
        MovieUploadRequest request = mapper.readValue(requestJson, MovieUploadRequest.class);

        log.info("thumbnailFile: {}", thumbnailFile.getOriginalFilename());
        log.info("movieFile: {}", movieFile.getOriginalFilename());
        log.info("request: {}", request);

        return ApiResponse.<MovieResponse>builder()
                .result(googleDriveService.uploadMovie(request, thumbnailFile, movieFile))
                .build();
    }
}
