import React from 'react';
import styles from './MovieList.module.css'; // Import CSS module
import dutyImage from '../../assets/Duty.jpg';
import p1 from '../../assets/trailer1.jpg';
import p2 from '../../assets/trailer2.jpg';
import p3 from '../../assets/trailer3.jpg';
import p4 from '../../assets/HD.jpg';
import p5 from '../../assets/th.jpg';
import p6 from '../../assets/p1.jpg';
import p7 from '../../assets/p2.jpg';
import p8 from '../../assets/p3.jpg';
import p9 from '../../assets/p4.jpg';


// Data giả lập
const hotMovies = [
  { id: 1, title: "Movie 1", image: p1 },
  { id: 2, title: "Movie 2", image: p2 },
  { id: 3, title: "Movie 3", image: dutyImage },
];

const leMovies = [
  { id: 1, title: "Movie Lẻ 1", image: p3 },
  { id: 2, title: "Movie Lẻ 2", image: p4 },
  { id: 3, title: "Movie Lẻ 3", image: p5 },
  { id: 4, title: "Movie Lẻ 4", image: p6 },
  { id: 5, title: "Movie Lẻ 5", image: p7 },
];

const boMovies = [
  { id: 1, title: "Movie 1", image: p8 },
  { id: 2, title: "Movie 2", image: p9 },
  { id: 3, title: "Movie 3", image: p5 },
  { id: 4, title: "Movie 4", image: p6 },
  { id: 5, title: "Movie 5", image: dutyImage },
];

const MovieList = () => {
  return (
    <div className={styles.container}>
      {/* Phim hot */}
      <h3 className={styles['section-title']}>Phim hot</h3>
      <div className={styles['hot-movies-row']}>
        {hotMovies.map((movie) => (
          <div className={styles['hot-movie-col']} key={movie.id}>
            <div className={styles['card']}>
              <img
                src={movie.image}
                className={styles['card-img-top']}
                alt={movie.title}
              />
              <div className={styles['card-body']}>
                <h5>{movie.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phim lẻ */}
      <h3 className={styles['section-title']}>Phim lẻ</h3>
      <div className={styles.row}>
        {leMovies.map((movie) => (
          <div className={styles['custom-col']} key={movie.id}>
            <div className={styles.card}>
              <img src={movie.image} className={styles['card-img-top']} alt={movie.title} />
              <div className={styles['card-body']}>
                <h5>{movie.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phim bộ */}
      <h3 className={styles['section-title']}>Phim bộ</h3>
      <div className={styles.row}>
        {boMovies.map((movie) => (
          <div className={styles['custom-col']} key={movie.id}>
            <div className={styles.card}>
              <img src={movie.image} className={styles['card-img-top']} alt={movie.title} />
              <div className={styles['card-body']}>
                <h5>{movie.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;