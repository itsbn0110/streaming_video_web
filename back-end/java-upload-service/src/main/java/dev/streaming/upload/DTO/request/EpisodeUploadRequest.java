package dev.streaming.upload.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeUploadRequest {
    @NotBlank(message = "NOT_BLANK_TITLE")
    String title;

    @Size(max = 500, message = "NOT_BLANK_DESCRIPTION")
    String description;

    private Integer episodeNumber;

    private int status;

    double duration;

    String movieId;
}
