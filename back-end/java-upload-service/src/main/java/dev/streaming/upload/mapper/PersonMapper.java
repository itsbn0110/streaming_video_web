package dev.streaming.upload.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.IterableMapping;

import dev.streaming.upload.DTO.request.PersonRequest;
import dev.streaming.upload.DTO.response.PersonResponse;
import dev.streaming.upload.DTO.response.MovieSimpleResponse;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.Person;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PersonMapper {
    Person toPerson(PersonRequest request);

    @Mapping(target = "actedMovies", source = "actedMovies", qualifiedByName = "toMovieSimpleSet")
    @Mapping(target = "directedMovies", source = "directedMovies", qualifiedByName = "toMovieSimpleSet")
    PersonResponse toPersonResponse(Person person);

    @Named("toMovieSimple")
    static MovieSimpleResponse toMovieSimple(Movie movie) {
        if (movie == null) return null;
        return MovieSimpleResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .originalTitle(movie.getOriginalTitle())
                .thumbnail(movie.getThumbnail())
                .build();
    }

    @Named("toMovieSimpleSet")
    @IterableMapping(qualifiedByName = "toMovieSimple")
    static Set<MovieSimpleResponse> toMovieSimpleSet(List<Movie> movies) {
        if (movies == null) return null;
        return movies.stream().map(PersonMapper::toMovieSimple).collect(Collectors.toSet());
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(PersonRequest request, @MappingTarget Person person);
}
