package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;

import dev.streaming.upload.DTO.response.GenreResponse;
import dev.streaming.upload.Entity.Genre;

@Mapper(componentModel = "spring")
public interface GenreMapper {
    GenreResponse toGenreResponse(Genre genre);
}
