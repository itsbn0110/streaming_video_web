import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { Plus, RefreshCw, Pencil, Trash, Search } from "lucide-react";
import { fetchAllUsersAPI, deleteUserDataAPI } from "@/apis";
import adminRouteConfig from "@/config/adminRoutes";

const cx = classNames.bind(styles);

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pagination
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllUsersAPI(page, size);
      if (response && response.result && response.result.content) {
        setUsers(response.result.content);
        setTotalPages(response.result.content.totalPages || 1);
        setTotalElements(
          response.result.totalElements || response.result.length
        );
        setCurrentPage(page);
      } else {
        setError("Failed to load users");
      }
    } catch (err) {
      setError("Error loading users: " + err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers(currentPage);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUserDataAPI(id);
        if (users.length === 1 && currentPage > 0) {
          fetchUsers(currentPage - 1);
        } else {
          fetchUsers(currentPage);
        }
      } catch (err) {
        setError("Error deleting user: " + err.message);
        console.error("Error deleting user:", err);
      }
    }
  };

  const paginate = (pageNumber) => {
    fetchUsers(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    fetchUsers(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <h2>Danh sách người dùng</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={cx("button-primary")} onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            to={adminRouteConfig.createUsers}
            className={cx("button-primary")}
          >
            <Plus size={16} />
            Tạo người dùng
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

      <div className={cx("search-bar")}>
        <form onSubmit={handleSearch}>
          <div className={cx("search-input-wrapper")}>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cx("search-input")}
            />
            <button type="submit" className={cx("search-button")}>
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      <div className={cx("card")}>
        {loading ? (
          <div className={cx("loading-indicator")}>Đang tải...</div>
        ) : (
          <>
            <table className={cx("data-table")}>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Tên đăng nhập</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Ngày sinh</th>
                  <th>Quyền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <img
                          style={{
                            borderRadius: "50%",
                            height: "70px",
                            width: "70px",
                            objectFit: "cover",
                          }}
                          alt={user?.username}
                          src={user?.avatar}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: "500" }}>{user.username}</div>
                      </td>
                      <td>
                        {user?.fullName ? user.fullName : "Chưa Cập Nhật"}
                      </td>
                      <td>{user?.email ? user.email : "Chưa cập nhật"}</td>
                      <td>{formatDate(user.dob)}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                          }}
                        >
                          {user.roles &&
                            user.roles.map((role, index) => (
                              <span
                                key={index}
                                style={{
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  backgroundColor:
                                    role.name === "ROLE_ADMIN"
                                      ? "#fed7d7"
                                      : role.name === "ROLE_MODERATOR"
                                      ? "#c6f6d5"
                                      : "#e2e8f0",
                                  color:
                                    role.name === "ROLE_ADMIN"
                                      ? "#9b2c2c"
                                      : role.name === "ROLE_MODERATOR"
                                      ? "#276749"
                                      : "#4a5568",
                                }}
                              >
                                {role.name.replace("ROLE_", "")}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td>
                        <div className={cx("action-buttons")}>
                          <Link to={`${adminRouteConfig.editUsers}/${user.id}`}>
                            <button
                              className={cx("edit")}
                              title="Sửa người dùng"
                            >
                              <Pencil size={14} />
                            </button>
                          </Link>
                          <button
                            className={cx("delete")}
                            title="Xóa người dùng"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Không có dữ liệu người dùng
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
                Hiển thị {users.length} trên {totalElements} kết quả
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
