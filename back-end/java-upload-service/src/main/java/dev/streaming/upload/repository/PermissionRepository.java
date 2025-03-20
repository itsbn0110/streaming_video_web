package dev.streaming.upload.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {}
