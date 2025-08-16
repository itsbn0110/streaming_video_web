package dev.streaming.upload.services;

import java.util.List;
import org.springframework.stereotype.Service;

import dev.streaming.upload.DTO.response.GenreResponse;
import dev.streaming.upload.Entity.Genre;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.GenreMapper;
import dev.streaming.upload.repository.GenreRepository;
import dev.streaming.upload.utils.SlugUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreService {

    GenreRepository genreRepository;
    GenreMapper genreMapper;

    public GenreResponse create(String genreName) {
        String slug = SlugUtils.toSlug(genreName);
        Genre genre =
                genreRepository.save(Genre.builder().name(genreName).slug(slug).build());

        GenreResponse genreResponse = genreMapper.toGenreResponse(genre);
        return genreResponse;
    }

    public List<Genre> getAll() {
        List<Genre> genres = genreRepository.findAll();
        return genres;
    }

    public GenreResponse getGenre (Long genreId) {
        var genre = genreRepository.findById(genreId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        GenreResponse genreResponse = genreMapper.toGenreResponse(genre);

        return genreResponse;
    }

    public GenreResponse update(Long genreId, String genreName) {
        String slug = SlugUtils.toSlug(genreName);
        var genre = genreRepository.findById(genreId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        genre.setSlug(slug);
        genre.setName(genreName);

        genreRepository.save(genre);

        GenreResponse genreResponse = genreMapper.toGenreResponse(genre);
        return genreResponse;
    }

    public void delete(Long genreId) {
        Genre genre = genreRepository.findById(genreId).orElseThrow(() -> new RuntimeException("Genre not found"));

        for (Movie movie : genre.getMovies()) {
            movie.getGenres().remove(genre);
        }

        genre.getMovies().clear();

        genreRepository.delete(genre);
    }
}
