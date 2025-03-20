package dev.streaming.upload.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.streaming.upload.Entity.InvalidatedToken;

public interface InvalidatedRepository extends JpaRepository<InvalidatedToken, String> {}
