package dev.streaming.upload.controllers;


import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.CategoryRequest;
import dev.streaming.upload.DTO.response.CategoryResponse;
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

    @PostMapping
    ApiResponse<CategoryResponse> create(@RequestBody CategoryRequest request) {
        log.info("categoryName:{}",request.getCategoryName());
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.create(request.getCategoryName()))
                .message("Created category successfully!")
                .build();
    }


    @DeleteMapping
    ApiResponse<Void> delete(@RequestParam String categoryName) {
        categoryService.delete(categoryName);
        return ApiResponse.<Void>builder().build();
    }
}
