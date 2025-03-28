import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BannerPhim from "../components/BannerPhim/BannerPhim";
import NoiDungPhim from "../components/NoiDungPhim/NoiDungPhim";
import DanhSachDienVien from "../components/DSDV/DSDV";
import TrailerPhim from "../components/TrailerPhim/TrailerPhim";
import PhimTuongTu from "../components/PhimTuongTu/PhimTuongTu";
import styles from "./BGPhim.module.css"; // Import CSS module

const TrangPh = () => {
  return (
    <>
      <Header />
      <div className={styles["trang-phim"]}>
        <BannerPhim />
        <NoiDungPhim /> 
        <DanhSachDienVien />
        <TrailerPhim />
        <PhimTuongTu />
      </div>      
      <Footer />
    </>
  );
};

export default TrangPh;
