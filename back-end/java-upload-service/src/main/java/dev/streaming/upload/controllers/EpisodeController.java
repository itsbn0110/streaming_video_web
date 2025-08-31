package dev.streaming.upload.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.UpdateEpisodeRequest;
import dev.streaming.upload.DTO.response.EpisodeResponse;
import dev.streaming.upload.services.EpisodeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/episodes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EpisodeController {

    EpisodeService episodeService;

    @GetMapping("/movie/{movieId}")
    public ApiResponse<List<EpisodeResponse>> getAllEpisodesByMovieId(@PathVariable String movieId) {

        return ApiResponse.<List<EpisodeResponse>>builder()
                .result(episodeService.getAllEpisodesByMovieId(movieId))
                .message("Retrieved all episodes successfully!")
                .build();
    }

    // Tạo các phương thức khác tương tự
    @GetMapping("/{episodeId}")
    public ApiResponse<EpisodeResponse> getById(@PathVariable String episodeId) {
        log.info("Getting episode with ID: {}", episodeId);
        return ApiResponse.<EpisodeResponse>builder()
                .result(episodeService.getEpisodeById(episodeId))
                .message("Episode retrieved successfully!")
                .build();
    }

    @PatchMapping("/{episodeId}")
    public ApiResponse<EpisodeResponse> update(
            @PathVariable String episodeId, @RequestParam("request") String requestJson) throws Exception {
        log.info("Updating episode with ID: {}", episodeId);
        ObjectMapper mapper = new ObjectMapper();
        UpdateEpisodeRequest request = mapper.readValue(requestJson, UpdateEpisodeRequest.class);
        return ApiResponse.<EpisodeResponse>builder()
                .result(episodeService.update(episodeId, request))
                .message("Episode updated successfully!")
                .build();
    }

    // Viết nốt route Delete
    @DeleteMapping("/{episodeId}")
    public ApiResponse<Void> delete(@PathVariable String episodeId) {
        log.info("Deleting episode with ID: {}", episodeId);
        episodeService.delete(episodeId);
        return ApiResponse.<Void>builder()
                .message("Episode deleted successfully!")
                .build();
    }
}
