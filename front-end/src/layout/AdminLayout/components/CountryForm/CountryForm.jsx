import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { Save, ArrowLeft } from "lucide-react";
import adminRouteConfig from "@/config/adminRoutes";
import { createCountryDataAPI, updateCountryDataAPI } from "@/apis";
const cx = classNames.bind(styles);

const CountryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      const payload = {
        countryName: countryName,
      };

      let response;
      if (!isEditMode) {
        response = await createCountryDataAPI(payload);
        console.log(response);
      } else {
        response = await updateCountryDataAPI(id, payload);
      }

      if (response && response.code === 1000) {
        setSubmitSuccess(true);

        setTimeout(() => {
          navigate(adminRouteConfig.listCountries);
        }, 1500);
      } else {
        setError("Có lỗi xảy ra khi lưu quốc gia");
      }
    } catch (err) {
      setError(
        "Lỗi khi lưu quốc gia: " + (err.response?.message || err.message)
      );
      console.error("Error submitting country:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <h2>{isEditMode ? "Sửa quốc gia" : "Tạo quốc gia mới"}</h2>
        <Link
          to={adminRouteConfig.listCountries}
          className={cx("button-outline")}
        >
          <ArrowLeft size={16} />
          Quay lại
        </Link>
      </div>

      {error && (
        <div
          className={cx("alert", "alert-danger")}
          style={{ marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      {submitSuccess && (
        <div
          className={cx("alert", "alert-success")}
          style={{ marginBottom: "1rem" }}
        >
          {isEditMode
            ? "Cập nhật quốc gia thành công!"
            : "Tạo quốc gia mới thành công!"}
        </div>
      )}

      <div className={cx("card")}>
        {loading && !isEditMode ? (
          <div className={cx("loading-indicator")}>Đang tải...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={cx("form-group")}>
              <label htmlFor="countryName">Tên quốc gia</label>
              <input
                type="text"
                id="countryName"
                className={cx("form-control")}
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                required
                placeholder="Nhập tên quốc gia"
              />
            </div>

            <div className={cx("form-actions")}>
              <button
                type="submit"
                className={cx("button-primary")}
                disabled={loading}
              >
                <Save size={16} />
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CountryForm;
