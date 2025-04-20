package dev.streaming.upload.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByNameIn(List<String> categories);

    void deleteByName(String categoryName);
}
