import styles from "./MovieCard.module.scss";
import classNames from "classnames/bind";
import images from "@/assets/images";
import { Link, useNavigate } from "react-router-dom";
import { fetchMovieByIdAPI } from "@/apis";

const cx = classNames.bind(styles);

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClickMovieCard = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchMovieByIdAPI(movie.id);
      if (response && response.result) {
        console.log("Movie details fetched successfully: ", response.result);
        navigate(`/movies/${movie.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cx("movie-card")}>
      <Link
        to={`/movies/${movie.id}`}
        onClick={handleClickMovieCard}
        className={cx("movie-link")}
      >
        <img
          src={
            movie.thumbnail || images.user_avatar || "/placeholder-movie.jpg"
          }
          alt={movie.title}
          className={cx("movie-poster")}
        />
        <div className={cx("movie-info")}>
          <h3 className={cx("movie-title")}>{movie.title}</h3>
          <div className={cx("movie-subtitle")}>{movie.originalTitle}</div>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
