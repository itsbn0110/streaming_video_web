package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import dev.streaming.upload.DTO.request.EpisodeUploadRequest;
import dev.streaming.upload.DTO.response.EpisodeResponse;
import dev.streaming.upload.Entity.Episode;

@Mapper(componentModel = "spring")
public interface EpisodeMapper {
    @Mapping(target = "videoId", ignore = true)
    @Mapping(target = "streamUrl", ignore = true)
    Episode toEpisodeMovie (EpisodeUploadRequest request);

    EpisodeResponse toEpisodeResponse (Episode episode);

}