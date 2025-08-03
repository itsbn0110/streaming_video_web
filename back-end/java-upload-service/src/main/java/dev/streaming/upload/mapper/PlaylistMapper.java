package dev.streaming.upload.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import dev.streaming.upload.DTO.request.PlaylistRequest;
import dev.streaming.upload.DTO.response.PlaylistResponse;
import dev.streaming.upload.Entity.Playlist;

@Mapper(componentModel = "spring", uses = {MovieMapper.class, UserMapper.class})
public interface PlaylistMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "movies", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Playlist toPlaylist(PlaylistRequest request);

    // Thay đổi: Không map movies trực tiếp, để service xử lý
    @Mapping(target = "movies", ignore = true) // Ignore để tránh lazy loading
    @Mapping(target = "movieCount", expression = "java(playlist.getMoviesCount())")
    PlaylistResponse toPlaylistResponse(Playlist playlist);

    // Thay đổi: Xóa các phương thức có thể gây ra lazy loading
    // Các phương thức này sẽ được xử lý trong service layer
}