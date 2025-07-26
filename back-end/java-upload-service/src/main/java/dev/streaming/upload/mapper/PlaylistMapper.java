package dev.streaming.upload.mapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import dev.streaming.upload.DTO.request.PlaylistRequest;
import dev.streaming.upload.DTO.response.PlaylistResponse;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.Playlist;

@Mapper(componentModel = "spring", uses = {MovieMapper.class, UserMapper.class})
public interface PlaylistMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "movies", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Playlist toPlaylist(PlaylistRequest request);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "movies", source = "movies")
    @Mapping(target = "movieCount", expression = "java(playlist.getMovies() != null ? playlist.getMovies().size() : 0)")
    PlaylistResponse toPlaylistResponse(Playlist playlist);

    default List<Movie> mapMovieIds(List<String> movieIds) {
        if (movieIds == null) {
            return Collections.emptyList();
        }
        return new ArrayList<>(); // Sẽ được xử lý trong service
    }
}
