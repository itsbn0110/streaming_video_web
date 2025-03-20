package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import dev.streaming.upload.DTO.request.RoleRequest;
import dev.streaming.upload.DTO.response.RoleResponse;
import dev.streaming.upload.Entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
