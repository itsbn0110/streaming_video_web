package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;

import dev.streaming.upload.DTO.request.PermissionRequest;
import dev.streaming.upload.DTO.response.PermissionResponse;
import dev.streaming.upload.Entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
