import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { Plus, RefreshCw, Pencil, Trash } from "lucide-react";

import adminRouteConfig from "@/config/adminRoutes";
import { fetchAllPersonsAPI, deletePersonDataAPI } from "@/apis";

const cx = classNames.bind(styles);

const PersonList = ({ personType }) => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPersons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllPersonsAPI(personType);
      if (response && response.result) {
        setPersons(response.result);
      } else {
        setError(
          `Không thể tải danh sách ${
            personType === "actor" ? "diễn viên" : "đạo diễn"
          }`
        );
      }
    } catch (err) {
      setError(
        `Lỗi khi tải ${personType === "actor" ? "diễn viên" : "đạo diễn"}: ` +
          err.message
      );
      console.error(`Error fetching ${personType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, [personType]);

  const handleRefresh = () => {
    fetchPersons();
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${
          personType === "actor" ? "diễn viên" : "đạo diễn"
        } này?`
      )
    ) {
      try {
        await deletePersonDataAPI(id);
        fetchPersons();
      } catch (err) {
        setError(
          `Lỗi khi xóa ${personType === "actor" ? "diễn viên" : "đạo diễn"}: ` +
            err.message
        );
        console.error(`Error deleting ${personType}:`, err);
      }
    }
  };

  const getTitle = () => {
    return personType === "actor"
      ? "Danh sách diễn viên"
      : "Danh sách đạo diễn";
  };

  const getCreateLink = () => {
    return personType === "actor"
      ? adminRouteConfig.createActor
      : adminRouteConfig.createDirector;
  };

  const getEditLink = (id) => {
    return personType === "actor"
      ? `${adminRouteConfig.editActor}/${id}`
      : `${adminRouteConfig.editDirector}/${id}`;
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <h2>{getTitle()}</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={cx("button-primary")} onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link to={getCreateLink()} className={cx("button-primary")}>
            <Plus size={16} />
            Tạo {personType === "actor" ? "diễn viên" : "đạo diễn"}
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
                    <th>Hình ảnh</th>
                    <th>Tên</th>
                    <th>Ngày sinh</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {persons.length > 0 ? (
                    persons.map((person) => (
                      <tr key={person.id}>
                        <td>
                          <img
                            src={person.avatar || "/placeholder-avatar.png"}
                            alt={person.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: "500" }}>{person.name}</div>
                        </td>
                        <td>{person.birthDate || "Không có"}</td>

                        <td>
                          <div className={cx("action-buttons")}>
                            <Link to={getEditLink(person.id)}>
                              <button className={cx("edit")} title="Sửa">
                                <Pencil size={14} />
                              </button>
                            </Link>
                            <button
                              className={cx("delete")}
                              title="Xóa"
                              onClick={() => handleDelete(person.id)}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={cx("list-info")}>
              <span>
                Hiển thị {persons.length}{" "}
                {personType === "actor" ? "diễn viên" : "đạo diễn"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonList;
