import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "./MovieDetail.module.scss";
import classNames from "classnames/bind";
import { PlayCircle, Heart, Share2, Star } from "lucide-react";
import { fetchMovieDetailsAPI, fetchRelatedMoviesAPI } from "@/apis";
import RelatedMovies from "../RelatedMovies";
import ActorSection from "../ActorSection";

const cx = classNames.bind(styles);

const MovieDetail = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [movie, setMovie] = useState({});
  const [relatedMovies, setRelatedMovies] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const scrollIntoTrailerSection = useCallback(() => {
    const section = document.getElementById("trailerSection");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  const handleTrailerButtonClick = useCallback(() => {
    setActiveTab("trailer");
    setTimeout(() => {
      scrollIntoTrailerSection();
    }, 100);
  }, [scrollIntoTrailerSection]);

  const handleTabChange = useCallback(
    (tabName) => {
      setActiveTab(tabName);
      if (tabName === "trailer") {
        setTimeout(() => {
          scrollIntoTrailerSection();
        }, 100);
      }
    },
    [scrollIntoTrailerSection]
  );

  const handleClickWatchButton = (e) => {
    e.preventDefault();
    navigate(`/watch/${movie.id}`);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetchMovieDetailsAPI(id);
        if (response && response.result) {
          setMovie(response.result);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const renderCommaSeparatedList = useCallback((items) => {
    if (!items || items.length === 0) return "";

    return items.map((item, index) => {
      const isLast = index === items.length - 1;
      return isLast ? item.name : `${item.name}, `;
    });
  }, []);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      try {
        const response = await fetchRelatedMoviesAPI(id);
        setRelatedMovies(response);
      } catch (error) {
        console.error("Error fetching related movies:", error);
      }
    };

    if (id) {
      fetchRelatedMovies();
    }
  }, [id]);

  return (
    <div className={cx("movieDetail")}>
      <div
        className={cx("heroSection")}
        style={{ backgroundImage: `url(${movie.backdrop})` }}
      >
        <div className={cx("overlay")}>
          <div className={cx("container")}>
            <div className={cx("movieInfo")}>
              <div className={cx("posterWrapper")}>
                <img
                  src={movie?.thumbnail}
                  alt={movie.title || "Movie poster"}
                  className={cx("poster")}
                />
              </div>
              <div className={cx("infoContent")}>
                <h1 className={cx("title")}>{movie.title}</h1>
                {movie.originalTitle && (
                  <h2 className={cx("originalTitle")}>{movie.originalTitle}</h2>
                )}

                <div className={cx("rating")}>
                  <Star
                    className={cx("starIcon")}
                    size={20}
                    fill="#ffd700"
                    color="#ffd700"
                  />
                  <span>{parseFloat(Math.random() * 3 + 7).toFixed(1)}</span>
                </div>

                <div className={cx("metaInfo")}>
                  {movie.releaseYear && (
                    <span className={cx("year")}>{movie.releaseYear}</span>
                  )}
                  {movie.duration && (
                    <span className={cx("duration")}>
                      {movie.duration} Phút
                    </span>
                  )}
                </div>

                <div className={cx("genres")}>
                  {movie.genres?.map((genre, index) => (
                    <span key={index} className={cx("genre")}>
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className={cx("actions")}>
                  <Link
                    to={`/watch/${movie.id}`}
                    onClick={handleClickWatchButton}
                  >
                    <button className={cx("watchButton")}>
                      <PlayCircle size={20} />
                      <span>Xem Phim</span>
                    </button>
                  </Link>

                  <button
                    className={cx("trailerButton")}
                    onClick={handleTrailerButtonClick}
                  >
                    <PlayCircle size={20} />
                    <span>Trailer</span>
                  </button>
                  <button className={cx("iconButton")}>
                    <Heart size={20} />
                  </button>
                  <button className={cx("iconButton")}>
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("contentSection")}>
        <div className={cx("container")}>
          <div className={cx("tabs")}>
            <button
              className={cx("tabButton", {
                active: activeTab === "description",
              })}
              onClick={() => handleTabChange("description")}
            >
              Nội dung phim
            </button>
            <button
              className={cx("tabButton", { active: activeTab === "trailer" })}
              onClick={() => handleTabChange("trailer")}
            >
              Trailer
            </button>
          </div>

          <div className={cx("tabContent")}>
            {activeTab === "description" && (
              <div className={cx("description")}>
                {movie.description && <p>{movie.description}</p>}

                <div className={cx("additionalInfo")}>
                  <div className={cx("infoItem")}>
                    <span className={cx("infoLabel")}>Đạo diễn:</span>
                    <span className={cx("infoValue")}>
                      {renderCommaSeparatedList(movie.directors)}
                    </span>
                  </div>

                  <div className={cx("infoItem")}>
                    <span className={cx("infoLabel")}>Quốc gia:</span>
                    <span className={cx("infoValue")}>
                      {renderCommaSeparatedList(movie.countries)}
                    </span>
                  </div>

                  <div className={cx("infoItem")}>
                    <span className={cx("infoLabel")}>Ngày phát hành:</span>
                    <span className={cx("infoValue")}>{movie.releaseYear}</span>
                  </div>

                  <ActorSection movie={movie} />
                </div>
              </div>
            )}

            {activeTab === "trailer" && (
              <div id="trailerSection" className={cx("trailerContainer")}>
                {movie.trailerLink ? (
                  <iframe
                    className={cx("trailerFrame")}
                    src={movie.trailerLink.replace("watch?v=", "embed/")}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className={cx("noTrailer")}>Không có trailer</div>
                )}
              </div>
            )}

            {relatedMovies?.result && relatedMovies?.result?.length > 0 && (
              <RelatedMovies
                movieId={id}
                relatedMovies={relatedMovies.result}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
