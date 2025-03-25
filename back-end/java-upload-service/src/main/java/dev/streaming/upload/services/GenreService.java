package dev.streaming.upload.services;

import java.util.List;
import org.springframework.stereotype.Service;
import dev.streaming.upload.DTO.response.GenreResponse;
import dev.streaming.upload.Entity.Genre;
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
    public GenreResponse create( String genreName ) {
        String slug = SlugUtils.toSlug(genreName);
        Genre genre= genreRepository.save(Genre.builder().name(genreName).slug(slug).build());

        GenreResponse genreResponse = genreMapper.toGenreResponse(genre);
        return genreResponse;
    }

      public List<Genre> getAll() {
        List<Genre> genres = genreRepository.findAll();
        return genres;
    }

    public void delete(String genreName) {
        genreRepository.deleteByName(genreName);
    }


}
