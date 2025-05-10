package dev.streaming.upload.Entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false)
    String title;

    @Column(name = "original_title")
    String originalTitle;

    @Column(name = "trailer_link")
    String trailerLink;

    @Column(nullable = false, columnDefinition = "TEXT")
    String description;

    @Column(name = "release_year", nullable = false)
    int releaseYear;

    @Column(nullable = false)
    String thumbnail;

    @Column(nullable = false)
    String backdrop;

    //     @Column(nullable = false)
    //     String thumbnailPreview;

    @Column(nullable = false)
    String status;

    @Column(nullable = false)
    Boolean premium;

    String folderId;

    @Column(nullable = false)
    double duration;

    @Column(name = "stream_url", nullable = false)
    String streamUrl;

    @Column(name = "video_id", nullable = false)
    String videoId;

    @ManyToMany
    @JoinTable(
            name = "movie_genre",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id"))
    Set<Genre> genres;

    @ManyToMany
    @JoinTable(
            name = "movie_category",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    Set<Category> categories;

    @ManyToMany
    @JoinTable(
            name = "movie_country",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "country_id"))
    Set<Country> countries;

    @ManyToMany
    @JoinTable(
            name = "movie_director",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id"))
    Set<Person> directors;

    @ManyToMany
    @JoinTable(
            name = "movie_actor",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id"))
    Set<Person> actors;

    @Column
    Integer views = 0;

    @Column(name = "average_rating")
    Double averageRating = 0.0;

    @Column(name = "rating_count")
    Integer ratingCount = 0;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Episode> episodes;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    List<Comment> comments;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    List<Rating> ratings;
}
