package dev.streaming.upload.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.Entity.*;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.MovieMapper;
import dev.streaming.upload.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieService {

    GoogleDriveManager googleDriveManager;
    CategoryRepository categoryRepository;
    GenreRepository genreRepository;
    CountryRepository countryRepository;
    PersonRepository personRepository;
    MovieRepository movieRepository;
    DailyMovieViewsRepository dailyMovieViewsRepository;
    MovieMapper movieMapper;
    CloudinaryService cloudinaryService;
    UserTimeStatsRepository userTimeStatsRepository;
    UserGenreStatsRepository userGenreStatsRepository;
    OpenAiService openAiService;

    public Page<Movie> getAllMovies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return movieRepository.findAll(pageable);
    }

    public Movie getMovieById(String movieId) {
        return movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }

    @Transactional
    public String getVideoId(String movieId, Integer ep) {
        log.info("getVideoId movieId: {}, ep: {}", movieId, ep);
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        log.info("Incrementing view count for movie ID: {}", movieId);
        movie.setViews(movie.getViews() + 1);
        incrementView(movieId); // Increment daily views
        movieRepository.save(movie);
        log.info("Updated view count: {}", movie.getViews());

        if (ep != null) {
            // Handle episode-specific logic here
            log.info("getVideoId movieId: {}, ep: {}", movieId, ep);
            log.info("episodes: {}", movie.getEpisodes().size());
            Episode episode = movie.getEpisodes().stream()
                    .filter(e -> e.getEpisodeNumber().equals(ep))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.EPISODE_NOT_FOUND));

            return episode.getVideoId();
        }
        return movie.getVideoId();
    }

    public List<MovieResponse> getMovieRelated(String movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        List<Long> genreIds = movie.getGenres().stream().map(Genre::getId).collect(Collectors.toList());
        List<Movie> relatedMovies = movieRepository.findRelatedMovies(genreIds, movieId, movie.getMovieType());

        return relatedMovies.stream().map(movieMapper::toMovieResponse).collect(Collectors.toList());
    }

    public Page<MovieResponse> getMovieByCategories(String slug, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> moviePage = movieRepository.findByCategorySlug(slug, pageable);
        return moviePage.map(movieMapper::toMovieResponse);
    }

    public List<MovieResponse> getNewlyUpdatedByCategory(String categorySlug) {
        List<Movie> movies = movieRepository.findByCategoriesSlugBasicOrderByUpdatedAtDesc(categorySlug);
        return movies.stream().map(movieMapper::toMovieResponse).collect(Collectors.toList());
    }

    public List<MovieResponse> getNewlyUpdatedMovies() {
        List<Movie> movies = movieRepository.findTop10ByOrderByUpdatedAtDesc();
        return movies.stream().map(movieMapper::toMovieResponse).collect(Collectors.toList());
    }
    /**
     * [ĐÃ TỐI ƯU HÓA] Lọc phim hiệu quả bằng cách đẩy logic xuống DB.
     */
    public Page<MovieResponse> filterMovies(
            String categorySlug,
            Integer releaseYear,
            Long countryId,
            String duration,
            String genreId,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Movie> moviePage = movieRepository.filterMovies(categorySlug, releaseYear, countryId, genreId, pageable);
        List<Movie> movies = new ArrayList<>(moviePage.getContent());

        // 2. Lọc bổ sung theo thời lượng (duration) trong bộ nhớ (trên một tập dữ liệu nhỏ)
        if (duration != null && !duration.isBlank()) {
            switch (duration.toLowerCase()) {
                case "short":
                    movies.removeIf(movie -> movie.getDuration() >= 90);
                    break;
                case "medium":
                    movies.removeIf(movie -> movie.getDuration() < 90 || movie.getDuration() > 120);
                    break;
                case "long":
                    movies.removeIf(movie -> movie.getDuration() <= 120);
                    break;
                default:
                    log.warn("Invalid duration filter: {}", duration);
            }
        }

        List<MovieResponse> movieResponses =
                movies.stream().map(movieMapper::toMovieResponse).collect(Collectors.toList());

        // 3. Trả về một trang mới với dữ liệu đã lọc cuối cùng
        return new PageImpl<>(movieResponses, pageable, moviePage.getTotalElements());
    }

    public Movie updateMovie(
            MovieUploadRequest request,
            String movieId,
            MultipartFile thumbnailFile,
            MultipartFile movieFile,
            MultipartFile movieBackDrop)
            throws Exception {
        var categories = categoryRepository.findByNameIn(request.getCategories());
        var genres = genreRepository.findByNameIn(request.getGenres());
        var countries = countryRepository.findByNameIn(request.getCountries());
        var actors = personRepository.findByNameIn(request.getActors());
        var directors = personRepository.findByNameIn(request.getDirectors());
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            String thumbnail = cloudinaryService.uploadImage(thumbnailFile, 255, 375);
            movie.setThumbnail(thumbnail);
        }

        if (movieBackDrop != null && !movieBackDrop.isEmpty()) {
            String backdrop = cloudinaryService.uploadImage(movieBackDrop, 1920, 1080);
            movie.setBackdrop(backdrop);
        }

        if (movieFile != null && !movieFile.isEmpty()) {
            googleDriveManager.replaceMovieFile(movieFile, request.getTitle(), movie);
        }

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDuration(request.getDuration());
        movie.setGenres(new HashSet<>(genres));
        movie.setCategories(new HashSet<>(categories));
        movie.setCountries(new HashSet<>(countries));
        movie.setDirectors(new HashSet<>(directors));
        movie.setActors(new HashSet<>(actors));
        movie.setUpdatedAt(LocalDateTime.now());
        movie.setStatus(request.getStatus());

        return movieRepository.save(movie);
    }

    /**
     * [ĐÃ SỬA LỖI] Xóa phim một cách an toàn và đúng đắn với JPA.
     * Sử dụng @Transactional để đảm bảo tính nhất quán của dữ liệu.
     */
    @Transactional
    public void deleteMovie(String movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        String folderId = movie.getFolderId();

        // Xóa tất cả quan hệ ManyToMany qua native query
        movieRepository.deleteFromPlaylists(movieId);
        movieRepository.deleteFromActors(movieId);
        movieRepository.deleteFromDirectors(movieId);
        movieRepository.deleteFromGenres(movieId);
        movieRepository.deleteFromCategories(movieId);
        movieRepository.deleteFromCountries(movieId);

        // Xóa Movie
        movieRepository.deleteById(movieId);

        // Xóa folder trên Google Drive
        if (folderId != null) {
            try {
                googleDriveManager.deleteFileOrFolderById(folderId);
            } catch (Exception e) {
                log.error("Error deleting folder from Google Drive: {}", e.getMessage(), e);
            }
        }

        log.info("Successfully deleted movie with ID: {}", movieId);
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null) return null;
        return java.text.Normalizer.normalize(keyword, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase();
    }

    public Page<MovieResponse> searchMovies(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String normalizedKeyword = normalizeKeyword(keyword);
        Page<Movie> moviePage = movieRepository.findByKeyword(normalizedKeyword, pageable);
        return moviePage.map(movieMapper::toMovieResponse);
    }

    @Transactional
    public void incrementView(String movieId) {
        LocalDate today = LocalDate.now();
        DailyMovieViewsId id = new DailyMovieViewsId(movieId, today);
        log.info("check DailyMovieViewsId: {}", id);
        DailyMovieViews record = dailyMovieViewsRepository
                .findById(id)
                .orElse(DailyMovieViews.builder()
                        .id(id)
                        .movie(movieRepository.getReferenceById(movieId))
                        .viewCount(0L)
                        .build());

        record.setViewCount(record.getViewCount() + 1);
        dailyMovieViewsRepository.save(record);
    }

    @Transactional
    public void updateMovieStatus(String movieId, int status) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        movie.setStatus(status);
        movieRepository.save(movie);
        log.info("Updated status for movie ID {}: {}", movieId, status);
    }

    @Transactional
    public void trackView(String userId, List<Long> genreIds) {
        // Update movie_views for all relevant records
        log.info("Track view service");
        List<UserGenreStats> userGenreStatsList = userGenreStatsRepository.findByUserId(userId);

        List<UserGenreStats> allUserGenreStats = userGenreStatsRepository.findAll();
        for (UserGenreStats stats : allUserGenreStats) {
            stats.setMovieViews(stats.getMovieViews() + 1);
        }
        userGenreStatsRepository.saveAll(allUserGenreStats);

        log.info("Updated movie views for user {}: {}", userId, userGenreStatsList);

        // Update user_genre_stats for each genre
        for (Long genreId : genreIds) {
            userGenreStatsRepository.incrementGenreView(userId, genreId);
        }

        // Determine time slot
        String timeSlot = getTimeSlot();
        userTimeStatsRepository.incrementTimeSlotView(userId, timeSlot);
    }

    private String getTimeSlot() {
        LocalTime now = LocalTime.now();
        if (now.isAfter(LocalTime.of(6, 0)) && now.isBefore(LocalTime.of(12, 0))) {
            return "MORNING";
        } else if (now.isAfter(LocalTime.of(12, 0)) && now.isBefore(LocalTime.of(18, 0))) {
            return "AFTERNOON";
        } else if (now.isAfter(LocalTime.of(18, 0)) && now.isBefore(LocalTime.of(22, 0))) {
            return "EVENING";
        } else {
            return "NIGHT";
        }
    }

    public Map<String, Object> getUserProfile(String userId) {
    Map<String, Object> userProfile = new HashMap<>();

    // Fetch genre statistics
    List<UserGenreStats> genreStats = userGenreStatsRepository.findByUserId(userId);
    Map<String, Map<String, Integer>> genreViews = genreStats.stream()
            .collect(Collectors.toMap(
                    stat -> genreRepository.findById(stat.getGenreId()).map(Genre::getName).orElse("Unknown Genre"),
                    stat -> Map.of(
                        "totalViews", stat.getTotalViews(),
                        "movieViews", stat.getMovieViews()
                    )
            ));
    userProfile.put("genreStats", genreViews);
    log.info("genreViews: {}", genreViews);

    // Fetch time slot statistics
    List<UserTimeStats> timeStats = userTimeStatsRepository.findByUserId(userId);
    Map<String, Integer> timeSlotViews = timeStats.stream()
            .collect(Collectors.toMap(
                    stat -> stat.getTimeSlot() != null ? stat.getTimeSlot().name() : "UNKNOWN",
                    UserTimeStats::getTotalViews
            ));
    userProfile.put("timeStats", timeSlotViews);
    log.info("userProfile: {}", userProfile);

    return userProfile;
}

@SuppressWarnings("unchecked")
private Map<String, Integer> safeCastToMap(Object obj) {
    if (obj instanceof Map) {
        return (Map<String, Integer>) obj;
    }
    return new HashMap<>();
}
   

   // Cải tiến MovieService để tạo nhiều bộ sưu tập đa dạng

/**
 * [IMPROVED] Generate multiple themed movie collections
 */
public List<Map<String, Object>> generateMovieCollections(String userId) {
    try {
        // Step 1: Get user profile for AI context
        Map<String, Object> userProfile = getUserProfile(userId);
        
        // Step 2: Build AI prompt for multiple themed collections
        String aiPrompt = buildMultipleCollectionsPrompt(userProfile, userId);
        
        // Step 3: Request AI for structured JSON response
        String aiResponse = openAiService.generateResponse(aiPrompt);
        log.info("AI Raw Response: {}", aiResponse);
        
        // Step 4: Parse AI JSON response
        List<Map<String, Object>> aiCollections = parseAiJsonResponse(aiResponse);
        
        // Step 5: Enrich with actual movie data from database
        List<Map<String, Object>> enrichedCollections = enrichCollectionsWithMovieData(aiCollections);
        
        return enrichedCollections;
        
    } catch (Exception e) {
        log.error("Failed to generate movie collections for user {}: {}", userId, e.getMessage(), e);
        return createDiverseFallbackCollections(userId);
    }
}

/**
 * Build AI prompt for multiple themed collections
 */
private String buildMultipleCollectionsPrompt(Map<String, Object> userProfile, String userId) {
    StringBuilder prompt = new StringBuilder();

    prompt.append("You are an expert movie curator AI. Create 3-4 DIFFERENT themed movie collections for a user.\n\n");

    // User context
    if (userProfile != null && userProfile.containsKey("genreStats")) {
        Map<String, Object> genreStats = (Map<String, Object>) userProfile.get("genreStats");
        Map<String, Integer> timeStats = safeCastToMap(userProfile.get("timeStats"));

        prompt.append("USER VIEWING PROFILE:\n");
        prompt.append("Genre preferences: ").append(genreStats.toString()).append("\n");
        prompt.append("Time preferences: ").append(timeStats.toString()).append("\n");

        // Find top genres based on totalViews
        String topGenre = genreStats.entrySet().stream()
            .max((entry1, entry2) -> Integer.compare(
                ((Map<String, Integer>) entry1.getValue()).get("totalViews"),
                ((Map<String, Integer>) entry2.getValue()).get("totalViews")
            ))
            .map(Map.Entry::getKey)
            .orElse("Drama");

        String secondGenre = genreStats.entrySet().stream()
            .filter(entry -> !entry.getKey().equals(topGenre))
            .max((entry1, entry2) -> Integer.compare(
                ((Map<String, Integer>) entry1.getValue()).get("totalViews"),
                ((Map<String, Integer>) entry2.getValue()).get("totalViews")
            ))
            .map(Map.Entry::getKey)
            .orElse("Action");

        prompt.append("Top genres: ").append(topGenre).append(", ").append(secondGenre).append("\n");
    }

    // Fetch movie data from the database
    List<Movie> allMovies = movieRepository.findAll();
    prompt.append("\nMOVIE DATABASE:\n");
    for (Movie movie : allMovies) {
        prompt.append("- Title: ").append(movie.getTitle()).append(", Genres: ")
              .append(movie.getGenres().stream().map(Genre::getName).collect(Collectors.joining(", ")))
              .append(", Release Year: ").append(movie.getReleaseYear()).append("\n");
    }

    prompt.append("\nCURRENT CONTEXT:\n");
    prompt.append("Time: ").append(getTimeSlot()).append(" on ").append(LocalDateTime.now().getDayOfWeek()).append("\n");
    prompt.append("Season: ").append(getCurrentSeason()).append("\n\n");

    prompt.append("COLLECTION THEMES TO CREATE:\n");
    prompt.append("1. Main Interest Collection (based on favorite genre)\n");
    prompt.append("2. Discovery Collection (new genres to explore)\n");
    prompt.append("3. Mood-based Collection (perfect for current time)\n");
    prompt.append("4. Seasonal/Trending Collection (current relevance)\n\n");

    prompt.append("RESPONSE FORMAT - Return EXACTLY this JSON structure:\n");
    prompt.append("[\n");
    prompt.append("  {\n");
    prompt.append("    \"collectionName\": \"Compelling collection name\",\n");
    prompt.append("    \"theme\": \"main_interest|discovery|mood_based|seasonal\",\n");
    prompt.append("    \"description\": \"Why this collection is perfect for the user (1-2 sentences)\",\n");
    prompt.append("    \"reason\": \"Specific reasoning for recommendation (personalized)\",\n");
    prompt.append("    \"targetMood\": \"relaxed|excited|thoughtful|entertainment\",\n");
    prompt.append("    \"confidence\": 85,\n");
    prompt.append("    \"movieTitles\": [\"Well-known Movie 1\", \"Popular Movie 2\", \"Famous Movie 3\"]\n");
    prompt.append("  },\n");
    prompt.append("  {\n");
    prompt.append("    \"collectionName\": \"Different theme collection\",\n");
    prompt.append("    \"theme\": \"discovery\",\n");
    prompt.append("    \"description\": \"Description for second collection\",\n");
    prompt.append("    \"reason\": \"Different reasoning\",\n");
    prompt.append("    \"targetMood\": \"excited\",\n");
    prompt.append("    \"confidence\": 80,\n");
    prompt.append("    \"movieTitles\": [\"Movie A\", \"Movie B\", \"Movie C\"]\n");
    prompt.append("  }\n");
    prompt.append("]\n\n");

    prompt.append("IMPORTANT RULES:\n");
    prompt.append("- Create exactly 3-4 collections with DIFFERENT themes\n");
    prompt.append("- Each collection: 3-4 well-known movies only\n");
    prompt.append("- Use popular movie titles that likely exist in databases\n");
    prompt.append("- Make each collection serve a different purpose\n");
    prompt.append("- Confidence should be 75-95 based on how well it matches user\n");
    prompt.append("- NO text outside the JSON array\n");
    prompt.append("- Make collection names creative and appealing\n\n");

    prompt.append("Create diverse, themed collections now:");

    return prompt.toString();
}

/**
 * [IMPROVED] Parse AI response with better collection handling
 */
private List<Map<String, Object>> parseAiJsonResponse(String aiResponse) {
    List<Map<String, Object>> collections = new ArrayList<>();
    
    try {
        String cleanedResponse = extractJsonFromResponse(aiResponse);
        log.info("Cleaned AI Response: {}", cleanedResponse);
        
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(cleanedResponse);
        
        if (rootNode.isArray()) {
            for (JsonNode collectionNode : rootNode) {
                Map<String, Object> collection = new HashMap<>();
                collection.put("collectionName", collectionNode.get("collectionName").asText());
                collection.put("theme", collectionNode.get("theme").asText());
                collection.put("description", collectionNode.get("description").asText());
                collection.put("reason", collectionNode.get("reason").asText());
                collection.put("targetMood", collectionNode.get("targetMood").asText());
                collection.put("confidence", collectionNode.get("confidence").asInt());
                
                // Extract movie titles
                List<String> movieTitles = new ArrayList<>();
                JsonNode moviesNode = collectionNode.get("movieTitles");
                if (moviesNode != null && moviesNode.isArray()) {
                    for (JsonNode movieNode : moviesNode) {
                        movieTitles.add(movieNode.asText());
                    }
                }
                collection.put("movieTitles", movieTitles);
                collections.add(collection);
            }
        }
        
        log.info("Successfully parsed {} collections from AI", collections.size());
        
    } catch (Exception e) {
        log.error("Failed to parse AI JSON response: {}", e.getMessage(), e);
        log.error("Raw AI response was: {}", aiResponse);
    }
    
    return collections;
}

/**
 * [NEW] Create diverse fallback collections when AI fails
 */
private List<Map<String, Object>> createDiverseFallbackCollections(String userId) {
    List<Map<String, Object>> fallbackCollections = new ArrayList<>();
    
    try {
        Map<String, Object> userProfile = getUserProfile(userId);
        
        if (userProfile != null && userProfile.containsKey("genreStats")) {
            Map<String, Integer> genreStats = safeCastToMap(userProfile.get("genreStats"));
            
            // Collection 1: Favorite Genre
            String favoriteGenre = genreStats.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Drama");
            
            List<Movie> favoriteGenreMovies = findMoviesByGenre(favoriteGenre, 4);
            if (!favoriteGenreMovies.isEmpty()) {
                Map<String, Object> collection1 = new HashMap<>();
                collection1.put("title", "Bộ Sưu Tập " + favoriteGenre + " Yêu Thích");
                collection1.put("theme", "main_interest");
                collection1.put("description", "Những bộ phim " + favoriteGenre + " hàng đầu dành cho bạn");
                collection1.put("reason", "Dựa trên " + genreStats.get(favoriteGenre) + " lượt xem thể loại này");
                collection1.put("confidence", 85);
                collection1.put("targetMood", "entertainment");
                collection1.put("movies", favoriteGenreMovies.stream()
                    .map(this::convertToMovieCardFormat)
                    .collect(Collectors.toList()));
                collection1.put("movieCount", favoriteGenreMovies.size());
                fallbackCollections.add(collection1);
            }
            
            // Collection 2: Discovery (different genre)
            String discoveryGenre = genreStats.keySet().stream()
                .filter(genre -> !genre.equals(favoriteGenre))
                .findFirst()
                .orElse("Action");
                
            List<Movie> discoveryMovies = findMoviesByGenre(discoveryGenre, 3);
            if (!discoveryMovies.isEmpty()) {
                Map<String, Object> collection2 = new HashMap<>();
                collection2.put("title", "Khám Phá " + discoveryGenre);
                collection2.put("theme", "discovery");
                collection2.put("description", "Mở rộng sở thích với thể loại " + discoveryGenre);
                collection2.put("reason", "Gợi ý thể loại mới để bạn khám phá");
                collection2.put("confidence", 70);
                collection2.put("targetMood", "curious");
                collection2.put("movies", discoveryMovies.stream()
                    .map(this::convertToMovieCardFormat)
                    .collect(Collectors.toList()));
                collection2.put("movieCount", discoveryMovies.size());
                fallbackCollections.add(collection2);
            }
        }
        
        // Collection 3: Time-based
        String currentTimeSlot = getTimeSlot();
        List<Movie> timeBasedMovies = getMoviesForTimeSlot(currentTimeSlot, 3);
        if (!timeBasedMovies.isEmpty()) {
            Map<String, Object> collection3 = new HashMap<>();
            collection3.put("title", getTimeBasedCollectionName(currentTimeSlot));
            collection3.put("theme", "mood_based");
            collection3.put("description", getTimeBasedDescription(currentTimeSlot));
            collection3.put("reason", "Phù hợp với thời gian " + currentTimeSlot + " hiện tại");
            collection3.put("confidence", 75);
            collection3.put("targetMood", getTimeBasedMood(currentTimeSlot));
            collection3.put("movies", timeBasedMovies.stream()
                .map(this::convertToMovieCardFormat)
                .collect(Collectors.toList()));
            collection3.put("movieCount", timeBasedMovies.size());
            fallbackCollections.add(collection3);
        }
        
        // Collection 4: Popular/Trending
        List<Movie> popularMovies = movieRepository.findTop10ByOrderByViewsDesc()
            .stream().limit(4).collect(Collectors.toList());
        if (!popularMovies.isEmpty()) {
            Map<String, Object> collection4 = new HashMap<>();
            collection4.put("title", "Phim Đang Hot");
            collection4.put("theme", "trending");
            collection4.put("description", "Những bộ phim được nhiều người xem nhất gần đây");
            collection4.put("reason", "Xu hướng phổ biến hiện tại");
            collection4.put("confidence", 80);
            collection4.put("targetMood", "social");
            collection4.put("movies", popularMovies.stream()
                .map(this::convertToMovieCardFormat)
                .collect(Collectors.toList()));
            collection4.put("movieCount", popularMovies.size());
            fallbackCollections.add(collection4);
        }
        
    } catch (Exception e) {
        log.error("Failed to create diverse fallback collections: {}", e.getMessage(), e);
    }
    
    return fallbackCollections;
}

/**
 * Get movies suitable for current time slot
 */
private List<Movie> getMoviesForTimeSlot(String timeSlot, int limit) {
    try {
        switch (timeSlot.toUpperCase()) {
            case "MORNING":
                // Light, uplifting movies for morning
                return movieRepository.findByGenreAndDurationRange("Comedy", 60, 120)
                    .stream().limit(limit).collect(Collectors.toList());
            case "AFTERNOON":
                // Action or adventure for afternoon energy
                return movieRepository.findByGenreAndDurationRange("Action", 90, 150)
                    .stream().limit(limit).collect(Collectors.toList());
            case "EVENING":
                // Drama or thriller for evening
                return movieRepository.findByGenreAndDurationRange("Drama", 100, 180)
                    .stream().limit(limit).collect(Collectors.toList());
            case "NIGHT":
                // Horror or mystery for night
                return movieRepository.findByGenreAndDurationRange("Horror", 80, 120)
                    .stream().limit(limit).collect(Collectors.toList());
            default:
                return movieRepository.findTop10ByOrderByViewsDesc()
                    .stream().limit(limit).collect(Collectors.toList());
        }
    } catch (Exception e) {
        log.error("Error getting time-based movies: {}", e.getMessage());
        return new ArrayList<>();
    }
}

/**
 * Get collection name based on time slot
 */
private String getTimeBasedCollectionName(String timeSlot) {
    switch (timeSlot.toUpperCase()) {
        case "MORNING": return "Buổi Sáng Tươi Mới";
        case "AFTERNOON": return "Chiều Năng Động";
        case "EVENING": return "Tối Thư Giãn";
        case "NIGHT": return "Đêm Ly Kỳ";
        default: return "Bất Kỳ Lúc Nào";
    }
}

/**
 * Get description based on time slot
 */
private String getTimeBasedDescription(String timeSlot) {
    switch (timeSlot.toUpperCase()) {
        case "MORNING": return "Những bộ phim nhẹ nhàng, tích cực để bắt đầu ngày mới";
        case "AFTERNOON": return "Phim hành động, phiêu lưu cho buổi chiều đầy năng lượng";
        case "EVENING": return "Phim kịch tính, cảm động cho buổi tối thư giãn";
        case "NIGHT": return "Phim hồi hộp, bí ẩn cho đêm muộn";
        default: return "Phim phù hợp mọi thời điểm";
    }
}

/**
 * Get target mood based on time slot
 */
private String getTimeBasedMood(String timeSlot) {
    switch (timeSlot.toUpperCase()) {
        case "MORNING": return "energetic";
        case "AFTERNOON": return "active";
        case "EVENING": return "relaxed";
        case "NIGHT": return "thrilled";
        default: return "balanced";
    }
}

/**
 * Get current season for seasonal recommendations
 */
private String getCurrentSeason() {
    int month = LocalDateTime.now().getMonthValue();
    if (month >= 3 && month <= 5) return "Spring";
    if (month >= 6 && month <= 8) return "Summer";
    if (month >= 9 && month <= 11) return "Autumn";
    return "Winter";
}

/**
 * [ENHANCED] Enrich collections ensuring each has different movies
 */
private List<Map<String, Object>> enrichCollectionsWithMovieData(List<Map<String, Object>> aiCollections) {
    List<Map<String, Object>> enrichedCollections = new ArrayList<>();
    Set<String> usedMovieIds = new HashSet<>(); // Prevent duplicate movies across collections
    
    for (Map<String, Object> collection : aiCollections) {
        List<String> movieTitles = (List<String>) collection.get("movieTitles");
        
        if (movieTitles == null || movieTitles.isEmpty()) {
            log.warn("No movie titles found in collection: {}", collection.get("collectionName"));
            continue;
        }
        
        // Search for movies, avoiding duplicates
        List<Movie> foundMovies = findUniqueMoviesByTitles(movieTitles, usedMovieIds);
        
        if (foundMovies.isEmpty()) {
            log.warn("No unique movies found for collection: {}", collection.get("collectionName"));
            continue;
        }
        
        // Add found movie IDs to used set
        foundMovies.forEach(movie -> usedMovieIds.add(movie.getId()));
        
        // Convert to MovieCard format
        List<Map<String, Object>> movieCards = foundMovies.stream()
            .map(this::convertToMovieCardFormat)
            .collect(Collectors.toList());
        
        // Create enriched collection
        Map<String, Object> enrichedCollection = new HashMap<>();
        enrichedCollection.put("title", collection.get("collectionName"));
        enrichedCollection.put("theme", collection.get("theme"));
        enrichedCollection.put("description", collection.get("description"));
        enrichedCollection.put("reason", collection.get("reason"));
        enrichedCollection.put("targetMood", collection.get("targetMood"));
        enrichedCollection.put("confidence", collection.get("confidence"));
        enrichedCollection.put("movies", movieCards);
        enrichedCollection.put("movieCount", movieCards.size());
        
        enrichedCollections.add(enrichedCollection);
    }
    
    log.info("Successfully enriched {} collections with {} total unique movies", 
        enrichedCollections.size(), usedMovieIds.size());
    
    return enrichedCollections;
}

/**
 * Find unique movies by titles, avoiding already used movies
 */
private List<Movie> findUniqueMoviesByTitles(List<String> movieTitles, Set<String> usedMovieIds) {
    List<Movie> foundMovies = new ArrayList<>();
    
    for (String title : movieTitles) {
        // Try exact match first
        List<Movie> exactMatches = movieRepository.findByTitleContainingIgnoreCase(title)
            .stream()
            .filter(movie -> !usedMovieIds.contains(movie.getId()))
            .limit(1)
            .collect(Collectors.toList());
        
        if (!exactMatches.isEmpty()) {
            foundMovies.addAll(exactMatches);
        } else {
            // Try partial match for unique movies
            String[] keywords = title.split("\\s+");
            for (String keyword : keywords) {
                if (keyword.length() > 3) {
                    List<Movie> partialMatches = movieRepository.findByTitleContainingIgnoreCase(keyword)
                        .stream()
                        .filter(movie -> !usedMovieIds.contains(movie.getId()))
                        .limit(1)
                        .collect(Collectors.toList());
                    
                    if (!partialMatches.isEmpty()) {
                        foundMovies.addAll(partialMatches);
                        break;
                    }
                }
            }
        }
        
        // Stop if we have enough movies for this collection
        if (foundMovies.size() >= 4) break;
    }
    
    return foundMovies.stream().distinct().collect(Collectors.toList());
}
   
    /**
     * Find movies by genre name
     */
    private List<Movie> findMoviesByGenre(String genreName, int limit) {
        try {
            Genre genre = genreRepository.findByNameIgnoreCase(genreName);
            if (genre != null) {
                return movieRepository.findByGenresContaining(genre)
                    .stream()
                    .limit(limit)
                    .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("Error finding movies by genre {}: {}", genreName, e.getMessage());
        }
        return new ArrayList<>();
    }


    /**
     * Search for movies by titles with fuzzy matching
     */
    private List<Movie> findMoviesByTitles(List<String> movieTitles) {
        List<Movie> foundMovies = new ArrayList<>();
        
        for (String title : movieTitles) {
            // Try exact match first
            List<Movie> exactMatches = movieRepository.findByTitleContainingIgnoreCase(title);
            
            if (!exactMatches.isEmpty()) {
                foundMovies.addAll(exactMatches.stream().limit(1).collect(Collectors.toList()));
            } else {
                // Try partial match if no exact match
                String[] keywords = title.split("\\s+");
                for (String keyword : keywords) {
                    if (keyword.length() > 3) { // Only search meaningful keywords
                        List<Movie> partialMatches = movieRepository.findByTitleContainingIgnoreCase(keyword);
                        if (!partialMatches.isEmpty()) {
                            foundMovies.addAll(partialMatches.stream().limit(1).collect(Collectors.toList()));
                            break; // Stop at first match
                        }
                    }
                }
            }
        }
        
        // Remove duplicates
        return foundMovies.stream()
            .distinct()
            .limit(10) // Limit to reasonable number
            .collect(Collectors.toList());
    }

    /**
     * Converts a Movie entity to a card format (Map<String, Object>) for collections.
     */
    private Map<String, Object> convertToMovieCardFormat(Movie movie) {
        Map<String, Object> card = new HashMap<>();
        card.put("id", movie.getId());
        card.put("title", movie.getTitle());
        card.put("thumbnail", movie.getThumbnail());
        card.put("description", movie.getDescription());
        card.put("releaseYear", movie.getReleaseYear());
        card.put("duration", movie.getDuration());
        card.put("views", movie.getViews());
        card.put("genres", movie.getGenres().stream().map(Genre::getName).collect(Collectors.toList()));
        card.put("categories", movie.getCategories().stream().map(Category::getName).collect(Collectors.toList()));
        card.put("countries", movie.getCountries().stream().map(Country::getName).collect(Collectors.toList()));
        return card;
    }

    /**
     * Extract JSON array from AI response that might contain extra text
     */
    private String extractJsonFromResponse(String response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);

            // Navigate to the content field
            JsonNode contentNode = rootNode.findPath("content");
            if (contentNode != null && contentNode.isTextual()) {
                String content = contentNode.asText();

                // Extract JSON array from content
                int startIndex = content.indexOf('[');
                int endIndex = content.lastIndexOf(']');
                if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
                    return content.substring(startIndex, endIndex + 1);
                }
            }
        } catch (Exception e) {
            log.error("Failed to extract JSON from AI response: {}", e.getMessage(), e);
        }

        log.warn("Could not extract JSON array from AI response. Returning raw response.");
        return response; // Return raw response as fallback
    }
/**
 * Get lucky movie pick for user
 */
public Map<String, Object> getLuckyMoviePick(String userId) {
    try {
        // Get user profile
        Map<String, Object> userProfile = getUserProfile(userId);
        
        // Build lucky pick prompt
        String luckyPrompt = buildLuckyPickPrompt(userProfile, userId);
        
        // Get AI response
        String aiResponse = openAiService.generateResponse(luckyPrompt);
        log.info("Lucky pick AI response: {}", aiResponse);
        
        // Parse single movie recommendation
        Map<String, Object> luckyPick = parseLuckyPickResponse(aiResponse);
        
        return luckyPick;
        
    } catch (Exception e) {
        log.error("Failed to get lucky pick: {}", e.getMessage(), e);
        return createFallbackLuckyPick(userId);
    }
}



    /**
 * Generate mood-based movie collections
 */
public List<Map<String, Object>> generateMoodBasedCollections(String userId, String mood) {
    try {
        // Get user profile for context
        Map<String, Object> userProfile = getUserProfile(userId);
        
        // Build mood-specific AI prompt
        String moodPrompt = buildMoodBasedPrompt(userProfile, mood, userId);
        
        // Request AI for mood-based collections
        String aiResponse = openAiService.generateResponse(moodPrompt);
        log.info("Mood-based AI Response: {}", aiResponse);
        
        // Parse and enrich collections
        List<Map<String, Object>> aiCollections = parseAiJsonResponse(aiResponse);
        List<Map<String, Object>> enrichedCollections = enrichCollectionsWithMovieData(aiCollections);
        
        return enrichedCollections;
        
    } catch (Exception e) {
        log.error("Failed to generate mood-based collections: {}", e.getMessage(), e);
        return createMoodFallbackCollections(userId, mood);
    }
}
private String buildMoodBasedPrompt(Map<String, Object> userProfile, String mood, String userId) {
    StringBuilder prompt = new StringBuilder();
    
    prompt.append("You are a movie recommendation AI. Create personalized movie collections based on user's current MOOD.\n\n");
    
    // Add mood context
    prompt.append("USER CURRENT MOOD: ").append(mood).append("\n");
    prompt.append("TIME: ").append(getTimeSlot()).append(" - ").append(LocalDateTime.now().getDayOfWeek()).append("\n\n");
    
    // Add user preferences if available
    if (userProfile != null && userProfile.containsKey("genreStats")) {
        Map<String, Integer> genreStats = safeCastToMap(userProfile.get("genreStats"));
        prompt.append("USER PREFERENCES: ").append(genreStats.toString()).append("\n\n");
    }
    
    // Mood-specific instructions
    prompt.append("MOOD MAPPING GUIDE:\n");
    prompt.append("- Happy/Excited → Comedy, Adventure, Feel-good movies\n");
    prompt.append("- Sad/Depressed → Uplifting, Comedy, or Dramatic movies that inspire\n");
    prompt.append("- Stressed/Anxious → Relaxing, Comedy, Light romance\n");
    prompt.append("- Bored → Action, Thriller, Adventure\n");
    prompt.append("- Romantic → Romance, Romantic comedy, Drama\n");
    prompt.append("- Tired → Easy watching, Comedy, Light drama\n");
    prompt.append("- Angry → Action, Thriller, or Calming nature documentaries\n\n");
    
    // JSON format requirement
    prompt.append("RESPOND WITH ONLY THIS JSON FORMAT:\n");
    prompt.append("[\n");
    prompt.append("  {\n");
    prompt.append("    \"collectionName\": \"Mood-appropriate collection name\",\n");
    prompt.append("    \"description\": \"Why perfect for current mood\",\n");
    prompt.append("    \"reason\": \"AI mood analysis explanation\",\n");
    prompt.append("    \"confidence\": 90,\n");
    prompt.append("    \"movieTitles\": [\"Movie 1\", \"Movie 2\", \"Movie 3\"]\n");
    prompt.append("  }\n");
    prompt.append("]\n\n");
    
    prompt.append("Create 1-2 collections with 3-4 movies each, perfectly matched to the mood: ").append(mood);
    
    return prompt.toString();
}

/**
 * Build lucky pick prompt
 */
private String buildLuckyPickPrompt(Map<String, Object> userProfile, String userId) {
    StringBuilder prompt = new StringBuilder();
    
    prompt.append("You are a movie recommendation AI. Pick ONE PERFECT movie for this user right now.\n\n");
    
    // Context
    prompt.append("CURRENT CONTEXT:\n");
    prompt.append("Time: ").append(getTimeSlot()).append(" on ").append(LocalDateTime.now().getDayOfWeek()).append("\n");
    
    if (userProfile != null && userProfile.containsKey("genreStats")) {
        Map<String, Integer> genreStats = safeCastToMap(userProfile.get("genreStats"));
        prompt.append("User preferences: ").append(genreStats.toString()).append("\n");
    }
    
    prompt.append("\nRESPOND WITH ONLY THIS JSON FORMAT:\n");
    prompt.append("{\n");
    prompt.append("  \"movieTitle\": \"Perfect movie title\",\n");
    prompt.append("  \"reason\": \"Why this is the perfect choice right now\",\n");
    prompt.append("  \"confidence\": 95,\n");
    prompt.append("  \"moodMatch\": \"Current mood this movie fits\"\n");
    prompt.append("}\n\n");
    
    prompt.append("Pick the PERFECT movie for this moment!");
    
    return prompt.toString();
}

    /**
 * Parse lucky pick AI response
 */
private Map<String, Object> parseLuckyPickResponse(String aiResponse) {
    try {
        String cleanedResponse = extractJsonFromResponse(aiResponse);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(cleanedResponse);
        
        String movieTitle = rootNode.get("movieTitle").asText();
        String reason = rootNode.get("reason").asText();
        int confidence = rootNode.get("confidence").asInt();
        String moodMatch = rootNode.get("moodMatch").asText();
        
        // Find the movie in database
        List<Movie> foundMovies = findMoviesByTitles(Arrays.asList(movieTitle));
        
        Map<String, Object> luckyPick = new HashMap<>();
        luckyPick.put("reason", reason);
        luckyPick.put("confidence", confidence);
        luckyPick.put("moodMatch", moodMatch);
        
        if (!foundMovies.isEmpty()) {
            Movie movie = foundMovies.get(0);
            luckyPick.put("movie", convertToMovieCardFormat(movie));
            luckyPick.put("found", true);
        } else {
            luckyPick.put("movieTitle", movieTitle);
            luckyPick.put("found", false);
            luckyPick.put("message", "Phim được gợi ý: " + movieTitle + " (chưa có trong hệ thống)");
        }
        
        return luckyPick;
        
    } catch (Exception e) {
        log.error("Failed to parse lucky pick response: {}", e.getMessage(), e);
        throw new RuntimeException("Failed to parse lucky pick response", e);
    }
}

/**
 * Create mood-based fallback collections
 */
private List<Map<String, Object>> createMoodFallbackCollections(String userId, String mood) {
    List<Map<String, Object>> fallbackCollections = new ArrayList<>();
    
    try {
        // Simple mood-to-genre mapping
        String targetGenre = mapMoodToGenre(mood);
        List<Movie> moodMovies = findMoviesByGenre(targetGenre, 4);
        
        if (!moodMovies.isEmpty()) {
            Map<String, Object> collection = new HashMap<>();
            collection.put("title", "Phim phù hợp với tâm trạng - " + targetGenre);
            collection.put("description", "Bộ sưu tập dựa trên tâm trạng: " + mood);
            collection.put("reason", "Fallback mood-based collection");
            collection.put("confidence", 75);
            collection.put("movies", moodMovies.stream()
                .map(this::convertToMovieCardFormat)
                .collect(Collectors.toList()));
            collection.put("movieCount", moodMovies.size());
            
            fallbackCollections.add(collection);
        }
        
    } catch (Exception e) {
        log.error("Failed to create mood fallback: {}", e.getMessage(), e);
    }
    
    return fallbackCollections;
}

/**
 * Create fallback lucky pick
 */
    private Map<String, Object> createFallbackLuckyPick(String userId) {
    Map<String, Object> fallbackPick = new HashMap<>();
    
    try {
        // Get a random popular movie
        List<Movie> popularMovies = movieRepository.findTop10ByOrderByViewsDesc();
        
        if (!popularMovies.isEmpty()) {
            Movie randomMovie = popularMovies.get((int) (Math.random() * Math.min(5, popularMovies.size())));
            
            fallbackPick.put("movie", convertToMovieCardFormat(randomMovie));
            fallbackPick.put("reason", "Phim phổ biến được nhiều người yêu thích");
            fallbackPick.put("confidence", 70);
            fallbackPick.put("moodMatch", "Universal appeal");
            fallbackPick.put("found", true);
        } else {
            fallbackPick.put("found", false);
            fallbackPick.put("message", "Không thể tạo gợi ý lúc này");
        }
        
    } catch (Exception e) {
        log.error("Failed to create fallback lucky pick: {}", e.getMessage(), e);
    }
    
    return fallbackPick;
}

/**
 * Simple mood to genre mapping
 */
    private String mapMoodToGenre(String mood) {
        String lowerMood = mood.toLowerCase();
        
        if (lowerMood.contains("happy") || lowerMood.contains("vui") || lowerMood.contains("hạnh phúc")) {
            return "Comedy";
        } else if (lowerMood.contains("sad") || lowerMood.contains("buồn") || lowerMood.contains("tủi")) {
            return "Drama";
        } else if (lowerMood.contains("stress") || lowerMood.contains("căng thẳng") || lowerMood.contains("mệt")) {
            return "Comedy";
        } else if (lowerMood.contains("bored") || lowerMood.contains("chán") || lowerMood.contains("boring")) {
            return "Action";
        } else if (lowerMood.contains("romantic") || lowerMood.contains("lãng mạn") || lowerMood.contains("tình")) {
            return "Romance";
        } else if (lowerMood.contains("scared") || lowerMood.contains("sợ") || lowerMood.contains("kinh dị")) {
            return "Horror";
        } else {
            return "Drama"; // Default
        }
    }

}
