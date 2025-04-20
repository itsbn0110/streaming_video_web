import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { Plus, RefreshCw, Pencil, Trash } from "lucide-react";
import { fetchAllGenresAPI, deleteGenreDataAPI } from "@/apis";
import adminRouteConfig from "@/config/adminRoutes";

const cx = classNames.bind(styles);

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGenres = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllGenresAPI();
      if (response && response.result) {
        setGenres(response.result);
      } else {
        setError("Không thể tải danh sách thể loại");
      }
    } catch (err) {
      setError("Lỗi khi tải thể loại: " + err.message);
      console.error("Error fetching genres:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleRefresh = () => {
    fetchGenres();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
      try {
        await deleteGenreDataAPI(id);
        fetchGenres();
      } catch (err) {
        setError("Lỗi khi xóa thể loại: " + err.message);
        console.error("Error deleting genre:", err);
      }
    }
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <h2>Danh sách thể loại</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={cx("button-primary")} onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            to={adminRouteConfig.createGenre}
            className={cx("button-primary")}
          >
            <Plus size={16} />
            Tạo thể loại
          </Link>
        </div>
      </div>

      {error && (
        <div
          className={cx("alert", "alert-danger")}
          style={{ marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      <div className={cx("card")}>
        {loading ? (
          <div className={cx("loading-indicator")}>Đang tải...</div>
        ) : (
          <>
            <div
              className={cx("table-container")}
              style={{ maxHeight: "65vh", overflowY: "auto" }}
            >
              <table className={cx("data-table")}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên thể loại</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {genres.length > 0 ? (
                    genres.map((genre, index) => (
                      <tr key={genre.id}>
                        <td>{index + 1}</td>
                        <td>{genre.name}</td>
                        <td>
                          <div className={cx("action-buttons")}>
                            <Link
                              to={`${adminRouteConfig.editGenre}/${genre.id}`}
                            >
                              <button className={cx("edit")} title="Sửa">
                                <Pencil size={14} />
                              </button>
                            </Link>
                            <button
                              className={cx("delete")}
                              title="Xóa"
                              onClick={() => handleDelete(genre.id)}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={cx("list-info")}>
              <span>Hiển thị {genres.length} thể loại</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GenreList;
