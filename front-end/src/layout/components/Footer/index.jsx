import React from "react";
import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import images from "@/assets/images";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useLocation, matchPath } from "react-router-dom";
import routes from "@/config/routes";
const cx = classNames.bind(styles);

function Footer() {
  const location = useLocation();
  const match = matchPath("/movies/:id", location.pathname);
  const matchWatchPage = matchPath("/watch/:movieId", location.pathname);

  return (
    <footer
      className={
        match?.pattern?.path === routes.movieDetail ||
        matchWatchPage?.pattern?.path === routes.watch
          ? cx("footer", "another-background")
          : cx("footer")
      }
    >
      <div className={cx("footer-top")}>
        <div className={cx("footer-logo")}>
          <img src={images.logoWeb} alt="Logo" />
        </div>
        <div className={cx("footer-content")}>
          <div className={cx("footer-links")}>
            <a href="#">Giới thiệu</a>
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách dữ liệu cá nhân</a>
            <a href="#">Liên hệ</a>
          </div>
          <div className={cx("social-links")}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className={cx("footer-bottom")}>
        <div className={cx("footer-info")}>
          <p>
            ITLU được xây dựng trên nền tảng Google Drive API
            <br />
            Mang đến trải nghiệm xem phim mượt mà, tốc độ cao và ổn định.
            <br />
            Nhờ hệ thống lưu trữ thông minh, phim luôn có chất lượng Full HD,
            4K, phát nhanh, không giật lag.
            <br />
            Tổng đài chăm sóc khách hàng: 18008119 (miễn phí).
            <br />
            Địa chỉ: Đ. Nghiêm Xuân Yêm, Đại Kim, Hoàng Mai, Hà Nội 100000
            <br />
            Ngày thành lập: 15 tháng 12, 1988
          </p>
        </div>
        <div className={cx("footer-apps")}>
          <p>Tải app và theo dõi chúng tôi</p>
          <div className={cx("app-links")}>
            <img
              src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/playstore.png"
              alt="Google Play"
            />
            <img
              src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/appstore.png"
              alt="App Store"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
