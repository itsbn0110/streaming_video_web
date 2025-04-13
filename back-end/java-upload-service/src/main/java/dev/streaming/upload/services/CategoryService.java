package dev.streaming.upload.services;

import java.util.List;
import org.springframework.stereotype.Service;
import dev.streaming.upload.DTO.response.CategoryResponse;
import dev.streaming.upload.Entity.Category;
<<<<<<< HEAD
import dev.streaming.upload.Entity.Movie;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import dev.streaming.upload.mapper.CategoryMapper;
import dev.streaming.upload.repository.CategoryRepository;
import dev.streaming.upload.utils.SlugUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {

    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    public CategoryResponse create( String categoryName ) {
        String slug = SlugUtils.toSlug(categoryName);
        log.info("slug: {}", slug);
        Category category= categoryRepository.save(Category.builder().name(categoryName).slug(slug).build());

        CategoryResponse categoryResponse = categoryMapper.toCategoryResponse(category);
        return categoryResponse;
    }

<<<<<<< HEAD
    public List<Category> getAll() {
=======
      public List<Category> getAll() {
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
        List<Category> categories = categoryRepository.findAll();
        return categories;
    }

<<<<<<< HEAD
    public void delete(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

        for (Movie movie : category.getMovies()) {
            movie.getCategories().remove(category); 
        }

    
        category.getMovies().clear();

    
        categoryRepository.delete(category);
=======
    public void delete(String categoryName) {
        categoryRepository.deleteByName(categoryName);
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    }


}
