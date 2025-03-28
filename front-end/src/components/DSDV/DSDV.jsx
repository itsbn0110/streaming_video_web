import React from 'react';
import styles from './DSDV.module.css'; // Import CSS module
import dutyImage from '../../assets/Duty.jpg';
import DV1 from '../../assets/DV1.jpg';
import DV2 from '../../assets/DV2.jpg';
import DV3 from '../../assets/DV3.jpg';
import DV4 from '../../assets/DV4.jpg';
import DV5 from '../../assets/DV5.jpg';

const DanhSachDienVien = () => {
  const dienViens = [
    { ten: 'Masako Nozawa', vai: 'Son Goku', anh: DV1 },
    { ten: 'Ryou Horikawa', vai: 'Vegeta', anh: DV2 },
    { ten: 'Bin Shimada', vai: 'Broly', anh: DV3 },
    { ten: 'Ryusei Nakao', vai: 'Freeza', anh: DV4 },
    { ten: 'Banjou Ginga', vai: 'King Vegeta', anh: DV5 },
  ];

  return (
    <div className={styles['dien-vien-container']}>
      <h2 className={styles['dien-vien-title']}>DIỄN VIÊN</h2>
      <div className={styles['dien-vien-list']}>
        {dienViens.map((dienVien, index) => (
          <div className={styles['dien-vien-item']} key={index}>
            <img
              src={dienVien.anh}
              alt={dienVien.ten}
              className={styles['dien-vien-image']}
            />
            <div className={styles['dien-vien-info']}>
              <p className={styles['dien-vien-name']}>{dienVien.ten}</p>
              <p className={styles['dien-vien-vai']}>{dienVien.vai}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DanhSachDienVien;