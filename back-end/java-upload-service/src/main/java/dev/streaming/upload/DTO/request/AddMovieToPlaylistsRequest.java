package dev.streaming.upload.DTO.request;

import java.util.List;

import lombok.Data;

@Data
public class AddMovieToPlaylistsRequest {
    private List<Long> playlistIds;
    private String movieId;
}
