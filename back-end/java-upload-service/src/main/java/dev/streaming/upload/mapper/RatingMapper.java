package dev.streaming.upload.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import dev.streaming.upload.DTO.request.RatingRequest;
import dev.streaming.upload.DTO.response.RatingResponse;
import dev.streaming.upload.Entity.Rating;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface RatingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "movie", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "starValue", source = "starValue")
    @Mapping(target = "comment", source = "comment")
    Rating toRating(RatingRequest request);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "starValue", source = "starValue")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "reviewCount", source = "reviewCount")
    @Mapping(target = "comment", source = "comment")
    RatingResponse toRatingResponse(Rating rating);

    List<RatingResponse> toRatingResponseList(List<Rating> ratings);
}