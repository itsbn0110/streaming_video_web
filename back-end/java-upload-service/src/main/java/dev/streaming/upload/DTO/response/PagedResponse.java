package dev.streaming.upload.DTO.response;

import java.util.List;

import lombok.Data;

@Data
public class PagedResponse<T> {
    private List<T> content;
    private int currentPage;
    private int totalPages;
    private long totalItems;
    private int pageSize;

    // Constructor, Getters, Setters
    public PagedResponse(List<T> content, int currentPage, int totalPages, long totalItems, int pageSize) {
        this.content = content;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalItems = totalItems;
        this.pageSize = pageSize;
    }

    // Getters và Setters
}
