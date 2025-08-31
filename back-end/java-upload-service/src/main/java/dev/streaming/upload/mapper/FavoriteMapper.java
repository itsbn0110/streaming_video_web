package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import dev.streaming.upload.DTO.response.FavoriteResponse;
import dev.streaming.upload.Entity.Favorite;

@Mapper(
        componentModel = "spring",
        uses = {MovieMapper.class})
public interface FavoriteMapper {

    @Mapping(target = "movie", source = "movie")
    FavoriteResponse toFavoriteResponse(Favorite favorite);
}
