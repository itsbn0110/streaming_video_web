package dev.streaming.upload.DTO.response;

import java.time.LocalDateTime;
import java.util.Set;

import dev.streaming.upload.Entity.Category;
import dev.streaming.upload.Entity.Country;
import dev.streaming.upload.Entity.Genre;
import dev.streaming.upload.Entity.Person;

public class MovieUploadResponse {

    String title;

    String description;

    int releaseYear;

    String thumbnail;

    double duration;

    String streamUrl;

    String videoId;

    Set<Genre> genres;

    Set<Category> categories;

    Set<Country> countries;

    Set<Person> directors;

    Set<Person> actors;

    LocalDateTime createdAt;
}
