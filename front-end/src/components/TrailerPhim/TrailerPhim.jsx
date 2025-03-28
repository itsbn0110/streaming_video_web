import React from 'react';
import styles from './TrailerPhim.module.css'; // Import CSS module
import HD from '../../assets/HD.jpg';
import tl1 from '../../assets/trailer1.jpg';
import tl2 from '../../assets/trailer2.jpg';
import tl3 from '../../assets/trailer3.jpg';

const TrailerPhim = () => {
  const trailers = [
    { anh: HD, tieuDe: 'HD' },
    { anh: tl1, tieuDe: 'TRAILER' },
    { anh: tl2, tieuDe: 'TRAILER' },
    { anh: tl3, tieuDe: 'TRAILER' },
  ];

  return (
    <div className={styles['trailer-container']}>
      <h2 className={styles['trailer-title']}>TRAILER</h2>
      <div className={styles['trailer-list']}>
        {trailers.map((trailer, index) => (
          <div className={styles['trailer-item']} key={index}>
            <img src={trailer.anh} alt={trailer.tieuDe} className={styles['trailer-image']} />
            <p
              className={`${styles['trailer-label']} ${
                trailer.tieuDe === 'HD' ? styles['trailer-label-hd'] : ''
              }`}
            >
              {trailer.tieuDe}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailerPhim;