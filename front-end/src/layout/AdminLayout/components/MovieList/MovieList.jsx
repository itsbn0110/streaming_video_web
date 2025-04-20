import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { Plus, RefreshCw, Pencil, Trash } from "lucide-react";
import { fetchAllMoviesAPI, deleteMovieDataAPI } from "@/apis";
import adminRouteConfig from "@/config/adminRoutes";

const cx = classNames.bind(styles);

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllMoviesAPI(page, size);
      if (response && response.result) {
        setMovies(response.result.content);
        setTotalPages(response.result.totalPages);
        setTotalElements(response.result.totalElements);
        setCurrentPage(response.result.pageable.pageNumber);
      } else {
        setError("Failed to load movies");
      }
    } catch (err) {
      setError("Error loading movies: " + err.message);
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleRefresh = () => {
    fetchMovies(currentPage);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      try {
        await deleteMovieDataAPI(id);
        if (movies.length === 1 && currentPage > 0) {
          fetchMovies(currentPage - 1);
        } else {
          fetchMovies(currentPage);
        }
      } catch (err) {
        setError("Error deleting movie: " + err.message);
        console.error("Error deleting movie:", err);
      }
    }
  };

  const paginate = (pageNumber) => {
    fetchMovies(pageNumber);
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <h2>Danh sách phim</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={cx("button-primary")} onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            to={adminRouteConfig.createFilm}
            className={cx("button-primary")}
          >
            <Plus size={16} />
            Tạo phim
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
            <table className={cx("data-table")}>
              <thead>
                <tr>
                  <th>Tên phim</th>
                  <th>Loại phim</th>
                  <th>Năm phát hành</th>
                  <th>Thể loại</th>
                  <th>Views</th>
                  <th>Rating</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {movies.length > 0 ? (
                  movies.map((movie) => (
                    <tr key={movie.id}>
                      <td>
                        <div style={{ fontWeight: "500" }}>{movie.title}</div>
                        {movie.originalTitle && (
                          <div style={{ fontSize: "12px", color: "#718096" }}>
                            {movie.originalTitle}
                          </div>
                        )}
                      </td>

                      <td> {movie?.categories?.[0].name} </td>
                      <td>{movie.releaseYear}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                          }}
                        >
                          {movie.genres &&
                            movie.genres.slice(0, 3).map((genre, index) => (
                              <span
                                key={index}
                                style={{
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  backgroundColor: "#e2e8f0",
                                  color: "#4a5568",
                                }}
                              >
                                {genre.name}
                              </span>
                            ))}
                          {movie.genres && movie.genres.length > 3 && (
                            <span
                              style={{
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                backgroundColor: "#e2e8f0",
                                color: "#4a5568",
                              }}
                            >
                              +{movie.genres.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {movie.views
                          ? movie.views.toLocaleString()
                          : Math.floor(Math.random() * 10000)}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{ color: "#f6ad55", marginRight: "4px" }}
                          >
                            ★
                          </span>
                          {movie.rating || Math.floor(Math.random() * 10 + 1)}
                        </div>
                      </td>
                      <td>
                        <span
                          className={cx(
                            "badge",
                            movie.status === "PUBLIC" ? "public" : ""
                          )}
                        >
                          {movie.status === "PUBLIC"
                            ? "Công khai"
                            : movie.status}
                        </span>
                      </td>
                      <td>
                        <div className={cx("action-buttons")}>
                          <Link to={`${adminRouteConfig.editFilm}/${movie.id}`}>
                            <button className={cx("edit")} title="Sửa phim">
                              <Pencil size={14} />
                            </button>
                          </Link>
                          <button
                            className={cx("delete")}
                            title="Xóa phim"
                            onClick={() => handleDelete(movie.id)}
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      Không có dữ liệu phim
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className={cx("pagination")}>
                <div className={cx("page-item")}>
                  <button
                    onClick={() =>
                      paginate(currentPage > 0 ? currentPage - 1 : 0)
                    }
                    disabled={currentPage === 0}
                  >
                    &laquo;
                  </button>
                </div>
                {[...Array(totalPages).keys()].map((number) => (
                  <div key={number} className={cx("page-item")}>
                    <button
                      className={currentPage === number ? cx("active") : ""}
                      onClick={() => paginate(number)}
                    >
                      {number + 1}
                    </button>
                  </div>
                ))}
                <div className={cx("page-item")}>
                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalPages - 1
                          ? currentPage + 1
                          : totalPages - 1
                      )
                    }
                    disabled={currentPage === totalPages - 1}
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}

            <div className={cx("pagination-info")}>
              <span>
                Hiển thị {movies.length} trên {totalElements} kết quả
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieList;
