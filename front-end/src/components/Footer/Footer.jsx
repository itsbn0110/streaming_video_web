import React from 'react';
import styles from './Footer.module.css';
import logo from "../../assets/logo.webp";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row">
          {/* Giới thiệu */}
          <div className="col-md-4">
            <img src={logo} alt="Logo" className={styles.logo} />
            <p>
              TLMove là trang web xem phim trực tuyến được phát triển bởi 
              Trường Đại học Thăng Long mang đến kho phim đa dạng, chất lượng cao
              và trải nghiệm mượt mà cho người dùng.
            </p>
          </div>

          {/* Menu */}
          <div className="col-md-4">
            <h5>Giới thiệu</h5>
            <ul className={styles.list}>
              <li><a href="/terms" className={styles.link}>Quy chế sử dụng dịch vụ</a></li>
              <li><a href="/promotions" className={styles.link}>Khuyến mãi</a></li>
              <li><a href="/privacy" className={styles.link}>Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div className="col-md-4">
            <h5>Hỗ trợ</h5>
            <p>0787117478</p>
            <h5>Kết nối với chúng tôi</h5>
            <div className={styles['social-icons']}>
              <a href="https://facebook.com" className={styles['social-icon']}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" className={styles['social-icon']}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" className={styles['social-icon']}>
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;