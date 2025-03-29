import React from 'react';
import styles from './BannerPhim.module.css'; // Import CSS module
import bannerPoster from '../../assets/th2.jpg'; // Thay đổi đường dẫn ảnh
import '@fortawesome/fontawesome-free/css/all.min.css';

const BannerPhim = () => {
  return (
    <div className={styles['banner-phim']}>
      <div className={styles['banner-content']}>
        <div className={styles['banner-left']}>
          <img src={bannerPoster} alt="Poster Phim" className={styles['banner-poster']} />
          <button className={styles['banner-button']}>XEM PHIM</button> {/* Di chuyển nút xuống đây */}
        </div>
        <div className={styles['banner-right']}>
          <h2 className={styles['banner-title']}>Dragon Ball Super Movie: Broly</h2>
          <p className={styles['banner-description']}>Bảy Viên Ngọc Rồng Siêu Cấp: Huyền Thoại Broly (2018)</p>
          <div className={styles['banner-details']}>
            <div className={styles['banner-detail-item']}>
              <i className="fas fa-clock"></i>
              <span>1 giờ 41 phút</span>
            </div>
            <div className={styles['banner-detail-item']}>
              <i className="fas fa-star"></i>
              <span>7.7</span>
            </div>
            <div className={styles['banner-detail-item']}>
              <i className="fas fa-check"></i>
              <span>Đã xem</span>
            </div>
          </div>
          <div className={styles['banner-genres']}>
            <span className={styles['banner-genre']}>Hành động</span>
            <span className={styles['banner-genre']}>Hoạt hình</span>
            <span className={styles['banner-genre']}>Viễn tưởng</span>
          </div>
          <p>Đạo diễn: Tatsuya Nagamine</p>
          <p>Quốc gia: Nhật Bản</p>
          <p>Khởi chiếu: 14/12/2018</p>
        </div>
      </div>
    </div>
  );
};

export default BannerPhim;