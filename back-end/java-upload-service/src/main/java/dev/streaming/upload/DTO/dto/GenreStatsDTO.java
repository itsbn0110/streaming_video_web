package dev.streaming.upload.DTO.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenreStatsDTO {
    private String genreName;
    private Long movieCount;
}
