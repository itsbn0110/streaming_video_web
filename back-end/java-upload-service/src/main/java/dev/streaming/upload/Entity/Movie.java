package dev.streaming.upload.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.streaming.upload.enums.MovieType;
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

    @Column(nullable = false)
    int status;

    @Column()
    Boolean premium;

    @Column(name = "folder_id", nullable = true)
    String folderId;

    @Column(nullable = true)
    double duration;

    @Column(name = "stream_url", nullable = true)
    String streamUrl;

    @Column(name = "video_id", nullable = true)
    String videoId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_genre",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id"))
    Set<Genre> genres = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_category",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    Set<Category> categories = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_country",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "country_id"))
    Set<Country> countries = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_director",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id"))
    Set<Person> directors = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "movie_actor",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id"))
    Set<Person> actors = new HashSet<>();

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

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    Set<Episode> episodes = new HashSet<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<Rating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<Favorite> favorites = new ArrayList<>();

    @ManyToMany(mappedBy = "movies", fetch = FetchType.LAZY)
    @JsonIgnore
    Set<Playlist> playlists = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private MovieType movieType;

    public void removePlaylist(Playlist playlist) {
        // Xóa playlist khỏi danh sách của movie này
        this.playlists.remove(playlist);
        // Đồng thời, xóa movie này khỏi danh sách của playlist đó
        playlist.getMovies().remove(this);
    }
}
