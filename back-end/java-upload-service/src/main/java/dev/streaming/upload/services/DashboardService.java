package dev.streaming.upload.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Service;

import dev.streaming.upload.DTO.dto.GenreStatsDTO;
import dev.streaming.upload.repository.DailyMovieViewsRepository;
import dev.streaming.upload.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {
    MovieRepository movieRepository;
    DailyMovieViewsRepository dailyMovieViewsRepository;

    @PersistenceContext
    EntityManager entityManager;

    public Long getNewMoviesMonthly() {
        log.info("date: {}", LocalDate.now().minusMonths(1).atStartOfDay());
        return movieRepository.countByCreatedAtAfter(
                LocalDate.now().minusMonths(1).atStartOfDay());
    }

    public Long getDailyViews() {
        Long views = dailyMovieViewsRepository.sumViewsByDate(LocalDate.now());
        if (views == null) {
            views = 0L;
        }
        log.info("daily views: {}", views);
        return views;
    }

    public List<GenreStatsDTO> getGenresStats() {
        List<Object[]> result = entityManager
                .createNativeQuery(
                        """
			SELECT g.name, COUNT(mg.movie_id) AS movie_count
			FROM movie_genre mg
			JOIN genres g ON mg.genre_id = g.id
			GROUP BY g.name, g.id
			ORDER BY movie_count DESC
		""")
                .getResultList();

        log.info("result: ", result);

        return result.stream()
                .map(row -> new GenreStatsDTO((String) row[0], ((Number) row[1]).longValue()))
                .collect(Collectors.toList());
    }
}
