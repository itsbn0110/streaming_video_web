import Banner from "@/components/Banner";
import MovieCategory from "@/components/MovieCategory";
import classNames from "classnames/bind";
import styles from "./HomePage.module.scss";
import { useEffect, useState } from "react";
import { fetchNewlyUpdatedMoviesAPI } from "@/apis";

const cx = classNames.bind(styles);

function HomePage() {
  const [newMovies, setNewMovies] = useState([]);
  const [newSeries, setNewSeries] = useState([]);

  const fetchNewUpdatedContent = async (categorySlug, setStateFunction) => {
    try {
      const response = await fetchNewlyUpdatedMoviesAPI(categorySlug);
      if (response && response.code === 1000) {
        console.log(`New ${categorySlug} data:`, response.result);
        setStateFunction(response.result);
      }
    } catch (e) {
      console.log(`Error when fetching ${categorySlug}:`, e);
    }
  };

  useEffect(() => {
    fetchNewUpdatedContent("phim-le", setNewMovies);
    fetchNewUpdatedContent("phim-bo", setNewSeries);
  }, []);

  return (
    <div>
      <Banner />
      <div className={cx("content")}>
        <div className="mb-8">
          <MovieCategory title="Phim Lẻ Mới Cập Nhật" movies={newMovies} />
        </div>

        <div className="mb-8">
          <MovieCategory title="Phim Bộ Mới Cập Nhật" movies={newSeries} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
