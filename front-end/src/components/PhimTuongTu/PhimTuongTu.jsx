<<<<<<< HEAD
import React from "react";
import styles from "./PhimTuongTu.module.css"; // Import CSS module
import p1 from "../../assets/p1.jpg";
import p2 from "../../assets/p2.jpg";
import p3 from "../../assets/p3.jpg";
import p4 from "../../assets/p4.jpg";
import p5 from "../../assets/Duty.jpg";

const PhimTuongTu = () => {
  const phimTuongTus = [
    { anh: p1, ten: "Phim 1" },
    { anh: p2, ten: "Phim 2" },
    { anh: p3, ten: "Phim 3" },
    { anh: p4, ten: "Phim 4" },
    { anh: p5, ten: "Phim 5" },
    { anh: p1, ten: "Phim 1" },
    { anh: p2, ten: "Phim 2" },
    { anh: p3, ten: "Phim 3" },
    { anh: p4, ten: "Phim 4" },
    { anh: p5, ten: "Phim 5" },
  ];

  return (
    <div className={styles["phim-tuong-tu-container"]}>
      <h2 className={styles["phim-tuong-tu-title"]}>PHIM TƯƠNG TỰ</h2>
      <div className={styles["phim-tuong-tu-list"]}>
        {phimTuongTus.map((phim, index) => (
          <div className={styles["phim-tuong-tu-item"]} key={index}>
            <img
              src={phim.anh}
              alt={phim.ten}
              className={styles["phim-tuong-tu-image"]}
            />
            <p className={styles["phim-tuong-tu-label"]}>{phim.ten}</p>
=======
import React from 'react';
import styles from './PhimTuongTu.module.css'; // Import CSS module
import p1 from '../../assets/p1.jpg';
import p2 from '../../assets/p2.jpg';
import p3 from '../../assets/p3.jpg';
import p4 from '../../assets/p4.jpg';
import p5 from '../../assets/Duty.jpg';

const PhimTuongTu = () => {
  const phimTuongTus = [
    { anh: p1, ten: 'Phim 1' },
    { anh: p2, ten: 'Phim 2' },
    { anh: p3, ten: 'Phim 3' },
    { anh: p4, ten: 'Phim 4' },
    { anh: p5, ten: 'Phim 5' },
  ];

  return (
    <div className={styles['phim-tuong-tu-container']}>
      <h2 className={styles['phim-tuong-tu-title']}>PHIM TƯƠNG TỰ</h2>
      <div className={styles['phim-tuong-tu-list']}>
        {phimTuongTus.map((phim, index) => (
          <div className={styles['phim-tuong-tu-item']} key={index}>
            <img
              src={phim.anh}
              alt={phim.ten}
              className={styles['phim-tuong-tu-image']}
            />
            <p className={styles['phim-tuong-tu-label']}>{phim.ten}</p>
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
          </div>
        ))}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default PhimTuongTu;
=======
export default PhimTuongTu;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
