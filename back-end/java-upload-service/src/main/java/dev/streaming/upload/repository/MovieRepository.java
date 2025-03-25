package dev.streaming.upload.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {}
