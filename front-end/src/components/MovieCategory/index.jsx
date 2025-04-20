import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import { fetchMovieByIdForCategoryAPI } from "@/apis";
import styles from "./MovieCategory.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function MovieCategory({ title, movies, sectionTitle }) {
  const navigate = useNavigate();

  const sliderRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    checkScrollPosition();
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    checkScrollPosition();
  };

  const checkScrollPosition = () => {
    const { scrollLeft } = sliderRef.current;
    setShowLeftButton(scrollLeft > 0);
  };

  const handleClickMovieItem = async (movieId) => {
    try {
      const response = await fetchMovieByIdForCategoryAPI(movieId);
      if (response && response.code === 1000) {
        console.log("Movie details fetched successfully: ", response.result);
        navigate(`/movies/${movieId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cx("movie-category")}>
      <div className={cx("header")}>
        <h2
          className={sectionTitle ? cx("sectionTitle") : cx("title-category")}
        >
          {title}
        </h2>
      </div>
      <div className={cx("slider-container")}>
        {showLeftButton && (
          <button className={cx("slider-button", "left")} onClick={scrollLeft}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}
        <div className={cx("slider")} ref={sliderRef}>
          {movies.map((movie, index) => (
            <div
              key={index}
              onClick={() => handleClickMovieItem(movie.id)}
              className={cx("movie-item")}
            >
              <img src={movie.thumbnail} alt={movie.title} />
              <div className={cx("overlay")}>
                <p>{movie.title}</p>
              </div>
            </div>
          ))}
        </div>
        <button className={cx("slider-button", "right")} onClick={scrollRight}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}

export default MovieCategory;
