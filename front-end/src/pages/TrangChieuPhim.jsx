import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BannerChieuPhim from "../components/BannerChieuphim/BannerChieuPhim";
import styles from "./BGPhim.module.css"; // Import CSS module

const TrangChPh = () => {
  return (
    <>
      <Header />
      <div className={styles["trang-phim"]}><BannerChieuPhim/></div>
      <Footer />
    </>
  );
};

export default TrangChPh;
