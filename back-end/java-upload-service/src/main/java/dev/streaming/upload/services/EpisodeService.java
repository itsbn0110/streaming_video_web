package dev.streaming.upload.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.streaming.upload.DTO.request.UpdateEpisodeRequest;
import dev.streaming.upload.DTO.response.EpisodeResponse;
import dev.streaming.upload.Entity.Episode;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.EpisodeMapper;
import dev.streaming.upload.repository.EpisodeRepository;
import dev.streaming.upload.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EpisodeService {
    EpisodeRepository episodeRepository;
    EpisodeMapper episodeMapper;
    GoogleDriveManager googleDriveManager;
    MovieRepository movieRepository;

    public List<EpisodeResponse> getAllEpisodesByMovieId(String movieId) {
        List<Episode> episodes = episodeRepository.findAllByMovieId(movieId);
        // Tôi muốn trả về kèm theo tên của movie đó
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        return episodes.stream()
                .map(episode -> {
                    EpisodeResponse response = episodeMapper.toEpisodeResponse(episode);
                    response.setMovieTitle(movie.getTitle());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public EpisodeResponse getEpisodeById(String episodeId) {
        Episode episode =
                episodeRepository.findById(episodeId).orElseThrow(() -> new AppException(ErrorCode.EPISODE_NOT_FOUND));
        return episodeMapper.toEpisodeResponse(episode);
    }

    public List<EpisodeResponse> getAllEpisodes() {
        List<Episode> episodes = episodeRepository.findAll();
        return episodes.stream().map(episodeMapper::toEpisodeResponse).collect(Collectors.toList());
    }

    public EpisodeResponse update(String episodeId, UpdateEpisodeRequest request) {
        Episode episode =
                episodeRepository.findById(episodeId).orElseThrow(() -> new AppException(ErrorCode.EPISODE_NOT_FOUND));
        // Check xem phim đã có tập này chưa nếu có rồi thì không cho nó update
        // Tìm phim từ episode.getMovieId() sau đó kiểm tra xem phim đó đã có tập nào có episodeNumber trùng chưa, nếu
        // rồi thì không cho update
        List<Episode> existingEpisodes = episodeRepository.findAllByMovieId(episode.getMovieId());
        boolean episodeNumberExists = existingEpisodes.stream()
                .anyMatch(existingEpisode -> existingEpisode.getEpisodeNumber().equals(request.getEpisodeNumber()));
        if (episodeNumberExists) {
            throw new AppException(ErrorCode.EPISODE_NUMBER_ALREADY_EXISTS);
        }
        episodeMapper.updateEpisodeFromRequest(request, episode);
        episodeRepository.save(episode);
        return episodeMapper.toEpisodeResponse(episode);
    }

    public void delete(String episodeId) {
        Episode episode =
                episodeRepository.findById(episodeId).orElseThrow(() -> new AppException(ErrorCode.EPISODE_NOT_FOUND));
        episodeRepository.delete(episode);
        // Xóa video trên google drive bằng folderId;
        String folderId = episode.getFolderId();
        if (folderId != null) {
            try {
                googleDriveManager.deleteFileOrFolderById(folderId);
            } catch (Exception e) {
                log.error("Error deleting folder from Google Drive: {}", e.getMessage(), e);
            }
        }

        log.info("Successfully deleted episode with ID: {}", episodeId);
    }
}
