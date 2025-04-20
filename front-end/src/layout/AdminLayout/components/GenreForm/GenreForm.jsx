import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { Save, ArrowLeft } from "lucide-react";
import adminRouteConfig from "@/config/adminRoutes";
import {
  fetchGenreDataAPI,
  createGenreDataAPI,
  updateGenreDataAPI,
} from "@/apis";

const cx = classNames.bind(styles);

const GenreForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchGenreData();
    }
  }, [id]);

  const fetchGenreData = async () => {
    setLoading(true);
    try {
      const response = await fetchGenreDataAPI(id);
      if (response && response.result) {
        setGenreName(response.result.name);
      } else {
        setError("Không thể tải thông tin thể loại");
      }
    } catch (err) {
      setError("Lỗi khi tải thông tin thể loại: " + err.message);
      console.error("Error fetching genre:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      const payload = { genreName };
      let response;
      if (isEditMode) {
        response = await updateGenreDataAPI(id, payload);
      } else {
        response = await createGenreDataAPI(payload);
      }

      if (response && response.code === 1000) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate(adminRouteConfig.listGenres);
        }, 1500);
      } else {
        setError("Có lỗi xảy ra khi lưu thể loại");
      }
    } catch (err) {
      setError("Lỗi khi lưu thể loại: " + err.message);
      console.error("Error submitting genre:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <h2>{isEditMode ? "Sửa thể loại" : "Tạo thể loại mới"}</h2>
        <Link to={adminRouteConfig.listGenres} className={cx("button-outline")}>
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
            ? "Cập nhật thể loại thành công!"
            : "Tạo thể loại mới thành công!"}
        </div>
      )}

      <div className={cx("card")}>
        {loading && !isEditMode ? (
          <div className={cx("loading-indicator")}>Đang tải...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={cx("form-group")}>
              <label htmlFor="genreName">Tên thể loại</label>
              <input
                type="text"
                id="genreName"
                className={cx("form-control")}
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
                required
                placeholder="Nhập tên thể loại"
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

export default GenreForm;
