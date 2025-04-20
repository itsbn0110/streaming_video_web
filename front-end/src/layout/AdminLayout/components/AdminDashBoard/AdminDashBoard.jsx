import React from "react";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";

import { Film, Users, BarChart2, Clock } from "lucide-react";

const cx = classNames.bind(styles);

const AdminDashboard = () => {
  return (
    <div>
      <div className={cx("page-header")}>
        <h2>Dashboard</h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          title="Tổng số phim"
          value="526"
          icon={<Film size={24} />}
          color="#4361ee"
        />
        <StatCard
          title="Phim mới trong tháng"
          value="48"
          icon={<Clock size={24} />}
          color="#3a0ca3"
        />
        <StatCard
          title="Người dùng"
          value="1,842"
          icon={<Users size={24} />}
          color="#7209b7"
        />
        <StatCard
          title="Lượt xem hôm nay"
          value="12,486"
          icon={<BarChart2 size={24} />}
          color="#f72585"
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}
      >
        <div className={cx("card")}>
          <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
            Phim mới cập nhật
          </h3>
          <table className={cx("data-table")}>
            <thead>
              <tr>
                <th>Tên phim</th>
                <th>Loại phim</th>
                <th>Năm</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Xin Đừng Tin Có Ấy</td>
                <td>Phim bộ</td>
                <td>2023</td>
                <td>
                  <span className={cx("badge", "public")}>Công khai</span>
                </td>
                <td>8,183</td>
              </tr>
              <tr>
                <td>13 Nghi Thức Trừ Tà</td>
                <td>Phim lẻ</td>
                <td>2023</td>
                <td>
                  <span className={cx("badge", "public")}>Công khai</span>
                </td>
                <td>9,909</td>
              </tr>
              <tr>
                <td>Avatar: Dòng Chảy Của Nước</td>
                <td>Phim chiếu rạp</td>
                <td>2023</td>
                <td>
                  <span className={cx("badge", "public")}>Công khai</span>
                </td>
                <td>5,183</td>
              </tr>
              <tr>
                <td>Amsterdam</td>
                <td>Phim lẻ</td>
                <td>2021</td>
                <td>
                  <span className={cx("badge", "premium")}>Premium</span>
                </td>
                <td>8,749</td>
              </tr>
              <tr>
                <td>Anne - Cô Gái Mạnh Mẽ</td>
                <td>Phim chiếu rạp</td>
                <td>2023</td>
                <td>
                  <span className={cx("badge", "premium")}>Premium</span>
                </td>
                <td>4,274</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={cx("card")}>
          <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
            Thể loại phổ biến
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <GenreStatItem name="Hành động" count="152" percentage={65} />
            <GenreStatItem name="Tình cảm" count="98" percentage={42} />
            <GenreStatItem name="Kinh dị" count="76" percentage={32} />
            <GenreStatItem name="Hài" count="64" percentage={27} />
            <GenreStatItem name="Tâm lý" count="52" percentage={22} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div
      className={cx("card")}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "24px",
        borderTop: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          backgroundColor: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
        }}
      >
        {icon}
      </div>
      <div style={{ marginLeft: "16px" }}>
        <div
          style={{ fontSize: "14px", color: "#718096", marginBottom: "4px" }}
        >
          {title}
        </div>
        <div style={{ fontSize: "24px", fontWeight: "700" }}>{value}</div>
      </div>
    </div>
  );
};

const GenreStatItem = ({ name, count, percentage }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <span>{name}</span>
        <span>{count} phim</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "#e2e8f0",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "#62c3e7",
            borderRadius: "4px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
