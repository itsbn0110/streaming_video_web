import React from 'react';
import styles from './Banner.module.css';
import banner from '../../assets/Duty.jpg';
const Banner = () => {
  return (
    <section 
      className={styles.banner}
      style={{
        backgroundImage: `url(${banner})`,
      }}
    >
      <div className={styles['banner-content']}>
        <h2 className={styles['banner-title']}>Duty After School - Học Kỳ Sinh Tử</h2>
        <button className={styles['banner-button']}>Đăng ký ngay</button>
      </div>
    </section>
  );
};

export default Banner;