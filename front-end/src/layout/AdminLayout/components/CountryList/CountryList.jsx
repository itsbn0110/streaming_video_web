import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { Plus, RefreshCw, Pencil, Trash } from "lucide-react";
import adminRouteConfig from "@/config/adminRoutes";
import { fetchAllCountriesAPI, deleteCountryDataAPI } from "@/apis";

const cx = classNames.bind(styles);

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllCountriesAPI();
      if (response && response.result) {
        setCountries(response.result);
      } else {
        setError("Không thể tải danh sách quốc gia");
      }
    } catch (err) {
      setError(
        "Lỗi khi tải quốc gia: " + (err.response?.data?.message || err.message)
      );
      console.error("Error fetching countries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleRefresh = () => {
    fetchCountries();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quốc gia này?")) {
      try {
        await deleteCountryDataAPI(id);
        fetchCountries();
      } catch (err) {
        setError(
          "Lỗi khi xóa quốc gia: " +
            (err.response?.data?.message || err.message)
        );
        console.error("Error deleting country:", err);
      }
    }
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <h2>Danh sách quốc gia</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={cx("button-primary")} onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            to={adminRouteConfig.createCountry}
            className={cx("button-primary")}
          >
            <Plus size={16} />
            Tạo quốc gia
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
                    <th>Tên quốc gia</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.length > 0 ? (
                    countries.map((country, index) => (
                      <tr key={country.id}>
                        <td>{index + 1}</td>
                        <td>{country.name}</td>
                        <td>
                          <div className={cx("action-buttons")}>
                            <Link
                              to={`${adminRouteConfig.editCountry}/${country.id}`}
                            >
                              <button className={cx("edit")} title="Sửa">
                                <Pencil size={14} />
                              </button>
                            </Link>
                            <button
                              className={cx("delete")}
                              title="Xóa"
                              onClick={() => handleDelete(country.id)}
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
              <span>Hiển thị {countries.length} quốc gia</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CountryList;
