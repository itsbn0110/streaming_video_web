package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
<<<<<<< HEAD
import dev.streaming.upload.DTO.response.VideoIdResponse;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import dev.streaming.upload.Entity.Movie;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    @Mapping(target = "actors", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "directors", ignore = true)
    @Mapping(target = "countries", ignore = true)
    @Mapping(target = "genres", ignore = true)
    Movie toMovie(MovieUploadRequest request);

    MovieResponse toMovieResponse (Movie movie);
<<<<<<< HEAD
    VideoIdResponse toVideoIdResponse (Movie movie);

=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
}
