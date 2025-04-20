import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play, Share2, BookmarkPlus, Eye, ChevronLeft } from "lucide-react";
import RelatedMovies from "@/components/RelatedMovies";

import classNames from "classnames/bind";
import styles from "./MoviePlayerPage.module.scss";
const cx = classNames.bind(styles);
import { fetchMovieDataAPI, getRelatedMoviesAPI } from "@/apis";
const MoviePlayerPage = () => {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const videoRef = useRef(null);
  const { movieId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (movie) {
      setLoading(false);
    }
  }, [movie]);

  const handleBackToDetails = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMovieDataAPI(movieId);
        setMovie(response.result);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchData();
  }, [movieId]);

  useEffect(() => {
    if (movie) {
      setVideoLoading(false);
    }
  }, [movie]);

  const handleVideoError = (e) => {
    console.error("Video error:", e);
    setVideoError("Không thể phát video. Vui lòng thử lại sau.");
  };

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      try {
        const response = await getRelatedMoviesAPI(movieId);
        setRelatedMovies(response.result);
      } catch (error) {
        console.error("Error fetching related movies:", error);
      }
    };

    fetchRelatedMovies();
  }, [movieId]);
  if (loading) {
    return (
      <div className={cx("loading-container")}>
        <div className={cx("loading-spinner")}></div>
      </div>
    );
  }

  return (
    <div className={cx("movie-player-page")}>
      <div className={cx("movie-player")}>
        {videoError ? (
          <div className={cx("video-error")}>
            <p>Lỗi: {videoError}</p>
          </div>
        ) : videoLoading ? (
          <div className={cx("video-loading")}>
            <div className={cx("loading-spinner")}></div>
            <p>Đang tải video...</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className={cx("video-element")}
            controls
            onError={handleVideoError}
            // autoPlay
          >
            <source
              src={`http://localhost:3000/stream/${movieId}`}
              type="video/mp4"
            />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        )}
      </div>
      <main className={cx("main-content")}>
        <div className={cx("movie-info")}>
          <div onClick={handleBackToDetails} className={cx("back-link")}>
            <ChevronLeft size={18} />
            <span>Quay lại</span>
          </div>
          <h1 className={cx("movie-title")}>{movie.title}</h1>
          <p className={cx("movie-original-title")}>{movie.originalTitle}</p>

          <div className={cx("movie-details")}>
            <span className={cx("duration")}>
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
            {movie.genres && movie.genres.length > 0 && (
              <span className={cx("genres")}>
                {movie.genres.map((genre) => genre.name).join(", ")}
              </span>
            )}
            {movie.countries && movie.countries.length > 0 && (
              <span className={cx("countries")}>
                {movie.countries.map((country) => country.name).join(", ")}
              </span>
            )}
          </div>

          <div className={cx("action-buttons")}>
            <button className={cx("action-button")}>
              <Share2 size={18} />
              <span>Chia sẻ</span>
            </button>
            <button className={cx("action-button")}>
              <BookmarkPlus size={18} />
              <span>Xem sau</span>
            </button>
            <button className={cx("action-button")}>
              <Eye size={18} />
              <span>Theo dõi</span>
            </button>
          </div>

          {movie?.categories?.some(
            (category) => category?.slug === "phim-bo"
          ) || movie?.episodes?.length === 0 ? (
            <div className={cx("notification")}>
              <p className={cx("notification-text")}>
                Đang cập nhật tập cho phim bộ
              </p>
            </div>
          ) : (
            <div className={cx("episodes-container")}></div>
          )}

          {movie.description && (
            <div className={cx("description")}>
              <h3>Giới thiệu:</h3>
              <p>{movie.description}</p>
            </div>
          )}

          {movie.trailerLink && (
            <div className={cx("trailer")}>
              <a
                href={movie.trailerLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cx("trailer-button")}
              >
                <Play size={18} />
                <span>Xem Trailer</span>
              </a>
            </div>
          )}

          <div className={cx("credits")}>
            {movie.directors && movie.directors.length > 0 && (
              <div className={cx("directors")}>
                <span className={cx("label")}>Đạo diễn: </span>
                {movie.directors.map((director) => director.name).join(", ")}
              </div>
            )}

            {movie.actors && movie.actors.length > 0 && (
              <div className={cx("actors")}>
                <span className={cx("label")}>Diễn viên: </span>
                {movie.actors.map((actor) => actor.name).join(", ")}
              </div>
            )}
          </div>

          <div className={cx("notification")}>
            <p className={cx("notification-text")}>
              Dưới đây là các phụ đề của phim này được hệ thống lấy tự động từ
              subsene.com. Nếu chọn được một phụ đề vừa ý (khớp thời gian & dịch
              chuẩn), hãy 👍 phụ đề đó để lần sau xem lại phim, hệ thống sẽ tự
              động sử dụng phụ đề đó cho bạn!
            </p>
          </div>

          <RelatedMovies relatedMovies={relatedMovies} />
        </div>
      </main>
    </div>
  );
};

export default MoviePlayerPage;
