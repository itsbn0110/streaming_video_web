package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.DTO.response.VideoIdResponse;
import dev.streaming.upload.Entity.Movie;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    @Mapping(target = "actors", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "directors", ignore = true)
    @Mapping(target = "countries", ignore = true)
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "backdrop", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "episodes", ignore = true)
    @Mapping(target = "favorites", ignore = true)
    @Mapping(target = "folderId", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "movieType", ignore = true)
    @Mapping(target = "playlists", ignore = true)
    @Mapping(target = "ratingCount", ignore = true)
    @Mapping(target = "ratings", ignore = true)
    @Mapping(target = "streamUrl", ignore = true)
    @Mapping(target = "thumbnail", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "videoId", ignore = true)
    @Mapping(target = "views", ignore = true)
    Movie toMovie(MovieUploadRequest request);

    @Mapping(source = "movieType", target = "movieType")
    MovieResponse toMovieResponse(Movie movie);

    VideoIdResponse toVideoIdResponse(Movie movie);
}
