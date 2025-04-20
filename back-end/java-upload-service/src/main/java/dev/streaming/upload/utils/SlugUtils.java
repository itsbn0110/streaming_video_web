package dev.streaming.upload.utils;

import java.text.Normalizer;

public class SlugUtils {
    public static String toSlug(String input) {
        if (input == null) return "";

        // Chuyển Đ -> D, đ -> d
        input = input.replaceAll("Đ", "D").replaceAll("đ", "d");

        // Chuẩn hóa Unicode và loại bỏ dấu
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String slug = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        // Chuyển về chữ thường, thay khoảng trắng bằng dấu '-'
        slug = slug.toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-");

        return slug;
    }
}
