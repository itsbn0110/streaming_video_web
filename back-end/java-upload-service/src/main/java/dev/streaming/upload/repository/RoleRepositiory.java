package dev.streaming.upload.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Role;

@Repository
public interface RoleRepositiory extends JpaRepository<Role, String> {}
