package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import dev.streaming.upload.DTO.request.EpisodeUploadRequest;
import dev.streaming.upload.DTO.request.UpdateEpisodeRequest;
import dev.streaming.upload.DTO.response.EpisodeResponse;
import dev.streaming.upload.Entity.Episode;

@Mapper(componentModel = "spring")
public interface EpisodeMapper {

    // Mapping từ request sang entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "videoId", ignore = true)
    @Mapping(target = "streamUrl", ignore = true)
    @Mapping(target = "folderId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "movie", ignore = true)
    Episode toEpisodeMovie(EpisodeUploadRequest request);

    // Mapping từ entity sang response
    EpisodeResponse toEpisodeResponse(Episode episode);

    // Dùng để update entity từ request (ví dụ update episode)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "videoId", ignore = true)
    @Mapping(target = "streamUrl", ignore = true)
    @Mapping(target = "folderId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "movie", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEpisodeFromRequest(EpisodeUploadRequest request, @MappingTarget Episode episode);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "videoId", ignore = true)
    @Mapping(target = "streamUrl", ignore = true)
    @Mapping(target = "folderId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "movie", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEpisodeFromRequest(UpdateEpisodeRequest request, @MappingTarget Episode episode);
}
