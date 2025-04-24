import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { Plus, RefreshCw, Pencil, Trash } from "lucide-react";
import { fetchAllCategoriesAPI, deleteCategoryDataAPI } from "@/apis";
import adminRouteConfig from "@/config/adminRoutes";

const cx = classNames.bind(styles);

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllCategoriesAPI();
      if (response && response.result) {
        setCategories(response.result);
      } else {
        setError("Không thể tải danh sách danh mục");
      }
    } catch (err) {
      setError("Lỗi khi tải danh mục: " + err.message);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategoryDataAPI(id);
        fetchCategories();
      } catch (err) {
        setError("Lỗi khi xóa danh mục: " + err.message);
        console.error("Error deleting category:", err);
      }
    }
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <h2>Danh sách danh mục</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={cx("button-primary")} onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            to={adminRouteConfig.createCategory}
            className={cx("button-primary")}
          >
            <Plus size={16} />
            Tạo danh mục
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
                    <th>Tên danh mục</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td>
                          <div className={cx("action-buttons")}>
                            <Link
                              to={`${adminRouteConfig.editCategory}/${category.id}`}
                            >
                              <button className={cx("edit")} title="Sửa">
                                <Pencil size={14} />
                              </button>
                            </Link>
                            <button
                              className={cx("delete")}
                              title="Xóa"
                              onClick={() => handleDelete(category.id)}
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
              <span>Hiển thị {categories.length} danh mục</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
