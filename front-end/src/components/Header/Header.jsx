import React, { useState } from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.webp";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Trạng thái hiển thị search bar

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen); // Đổi trạng thái hiển thị search bar
  };

  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <nav>
        {/* Biểu tượng 3 dấu gạch ngang */}
        <button className={styles.menuButton} onClick={toggleMenu}>
          ☰
        </button>

        {/* Menu */}
        <ul className={`${styles.navList} ${isMenuOpen ? styles.showMenu : ""}`}>
          <li>
            <a href="#search" className={styles.navLink} onClick={toggleSearch}>
              Tìm kiếm
            </a>
            {/* Search Bar */}
            {isSearchOpen && (
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="Nhập nội dung tìm kiếm..."
                  className={styles.searchInput}
                />
                <button className={styles.searchButton}>
                  <a href="/"><i className="fas fa-search"></i></a> {/* Icon tìm kiếm */}
                </button>
              </div>
            )}
          </li>
          <li><a href="#hot" className={styles.navLink}>Phim hot</a></li>
          <li><a href="#single" className={styles.navLink}>Phim lẻ</a></li>
          <li><a href="#series" className={styles.navLink}>Phim bộ</a></li>
          <li><a href="#faq" className={styles.navLink}>FAQ</a></li>
        </ul>
      </nav>

      <button className={styles.loginButton}>Đăng nhập</button>
    </header>
  );
};

export default Header;