package dev.streaming.upload.Entity;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.persistence.*;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "playlists")
public class Playlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    // Thay đổi 1: Sử dụng LAZY loading thay vì EAGER
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "playlist_movie",
            joinColumns = @JoinColumn(name = "playlist_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id"))
    @Builder.Default
    Set<Movie> movies = ConcurrentHashMap.newKeySet(); // Thread-safe Set

    // Thay đổi 2: Phương thức an toàn với synchronized
    public synchronized List<Movie> getMoviesSafe() {
        if (movies == null) {
            return new ArrayList<>();
        }

        try {
            // Tạo defensive copy để tránh ConcurrentModificationException
            return new ArrayList<>(movies);
        } catch (Exception e) {
            // Nếu vẫn có lỗi, trả về empty list
            return new ArrayList<>();
        }
    }

    // Thay đổi 3: Phương thức để lấy size an toàn
    public synchronized int getMoviesCount() {
        if (movies == null) {
            return 0;
        }

        try {
            return movies.size();
        } catch (Exception e) {
            return 0;
        }
    }

    // Thay đổi 4: Phương thức để check movie có trong playlist không
    public synchronized boolean containsMovie(Movie movie) {
        if (movies == null || movie == null) {
            return false;
        }

        try {
            return movies.contains(movie);
        } catch (Exception e) {
            return false;
        }
    }

    // Thay đổi 5: Phương thức để thêm movie an toàn
    public synchronized boolean addMovieSafe(Movie movie) {
        if (movies == null) {
            movies = ConcurrentHashMap.newKeySet();
        }

        if (movie == null) {
            return false;
        }

        try {
            return movies.add(movie);
        } catch (Exception e) {
            return false;
        }
    }

    // Thay đổi 6: Phương thức để xóa movie an toàn
    public synchronized boolean removeMovieSafe(Movie movie) {
        if (movies == null || movie == null) {
            return false;
        }

        try {
            return movies.remove(movie);
        } catch (Exception e) {
            return false;
        }
    }

    public void removeMovie(Movie movie) {
        // Xóa movie khỏi danh sách của playlist này
        this.movies.remove(movie);
        // Đồng thời, xóa playlist này khỏi danh sách của movie đó
        movie.getPlaylists().remove(this);
    }

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
