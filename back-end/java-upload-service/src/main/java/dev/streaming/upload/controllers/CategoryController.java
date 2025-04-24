package dev.streaming.upload.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.CategoryRequest;
import dev.streaming.upload.DTO.response.CategoryResponse;
import dev.streaming.upload.Entity.Category;
import dev.streaming.upload.services.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;

    @PreAuthorize(value = "hasRole('ADMIN')")
    @PostMapping
    ApiResponse<CategoryResponse> create(@RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.create(request.getCategoryName()))
                .message("Created category successfully!")
                .build();
    }

    @GetMapping
    ApiResponse<List<Category>> getAllCategories() {
        return ApiResponse.<List<Category>>builder()
                .result(categoryService.getAll())
                .build();
    }

    @PreAuthorize(value = "hasRole('ADMIN')")
    @DeleteMapping("{categoryId}")
    ApiResponse<Void> delete(@PathVariable Long categoryId) {
        categoryService.delete(categoryId);
        return ApiResponse.<Void>builder().build();
    }
}
