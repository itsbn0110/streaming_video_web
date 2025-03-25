package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;
import dev.streaming.upload.DTO.response.CategoryResponse;
import dev.streaming.upload.Entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse (Category category);
}
