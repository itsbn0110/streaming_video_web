package dev.streaming.upload.DTO.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackViewRequest {
    private List<Long> genreIds;
}