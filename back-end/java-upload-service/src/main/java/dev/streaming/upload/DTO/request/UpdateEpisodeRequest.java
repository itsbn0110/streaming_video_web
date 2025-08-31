package dev.streaming.upload.DTO.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UpdateEpisodeRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private Integer episodeNumber;

    private Double duration;

    private int status;
}
