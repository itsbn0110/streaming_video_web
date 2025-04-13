package dev.streaming.upload.services;

import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;

import dev.streaming.upload.DTO.request.RoleRequest;
import dev.streaming.upload.DTO.response.RoleResponse;
import dev.streaming.upload.mapper.RoleMapper;
import dev.streaming.upload.repository.PermissionRepository;
import dev.streaming.upload.repository.RoleRepositiory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepositiory roleRepositiory;
    PermissionRepository permissionRepository;

    RoleMapper roleMapper;

    public RoleResponse create(RoleRequest request) {
        var role = roleMapper.toRole(request);
        
        var permissions = permissionRepository.findAllById(request.getPermissions());

        role.setPermissions(new HashSet<>(permissions));

        role = roleRepositiory.save(role);
        
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll() {
        var roles = roleRepositiory.findAll();
        return roles.stream().map(roleMapper::toRoleResponse).toList();
    }

    public void delete(String role) {
        roleRepositiory.deleteById(role);
    }
}
