import React, { useEffect, useState } from "react";
import styles from "./RelatedMovies.module.scss";
import classNames from "classnames/bind";
import MovieCategory from "../MovieCategory";
const cx = classNames.bind(styles);

const RelatedMovies = React.memo(({ relatedMovies }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (relatedMovies && relatedMovies.length >= 0) {
      setLoading(false);
    }
  }, [relatedMovies]);

  if (loading) {
    return (
      <div className={cx("loading")}>
        <div className={cx("loader")}></div>
      </div>
    );
  }

  if (!relatedMovies || relatedMovies.length === 0) {
    return null;
  }

  console.log("relatedMovies in component", relatedMovies);

  return (
    <div className="mt-8">
      <MovieCategory
        title="Phim Liên Quan"
        movies={relatedMovies}
        sectionTitle={true}
      />{" "}
    </div>
  );
});

export default RelatedMovies;
