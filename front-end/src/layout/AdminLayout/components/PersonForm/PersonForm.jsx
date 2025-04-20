import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";

import { X, Upload, Save, ArrowLeft } from "lucide-react";
import adminRouteConfig from "@/config/adminRoutes";
import { createPersonDataAPI, updatePersonDataAPI } from "@/apis";

const cx = classNames.bind(styles);

const PersonForm = ({ editMode = false, personData = null, personType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    editMode && personData
      ? personData
      : {
          name: "",
          birthDate: "",
          biography: "",
          role: personType === "actor" ? "Actor" : "Director",
          personAvatar: null,
        }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "personAvatar") {
        setFormData({
          ...formData,
          personAvatar: files[0],
          personAvatarPreview: URL.createObjectURL(files[0]),
        });
      }
    }
  };

  const prepareRequestData = () => {
    const requestData = {
      name: formData.name,
      role: formData.role,
      biography: formData.biography || "",
      birthDate: formData.birthDate || "",
    };

    return JSON.stringify(requestData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.personAvatar && !editMode) {
        throw new Error("Vui lòng chọn hình ảnh");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("request", prepareRequestData());
      if (formData.personAvatar && formData.personAvatar instanceof File) {
        formDataToSend.append("personAvatar", formData.personAvatar);
      }

      const response = editMode
        ? await updatePersonDataAPI(id, formDataToSend)
        : await createPersonDataAPI(formDataToSend);

      if (response && response.result) {
        alert(
          editMode
            ? `${
                personType === "actor" ? "Diễn viên" : "Đạo diễn"
              } đã được cập nhật!`
            : `${
                personType === "actor" ? "Diễn viên" : "Đạo diễn"
              } đã được tạo thành công!`
        );
        navigate(
          personType === "actor"
            ? adminRouteConfig.listActors
            : adminRouteConfig.listDirectors
        );
      } else {
        throw new Error(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError(
        err.message ||
          `Có lỗi xảy ra khi lưu ${
            personType === "actor" ? "diễn viên" : "đạo diễn"
          }`
      );
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() =>
              navigate(
                personType === "actor"
                  ? adminRouteConfig.listActors
                  : adminRouteConfig.listDirectors
              )
            }
            style={{
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "12px",
              color: "#4a5568",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2>
            {editMode
              ? `Chỉnh sửa ${personType === "actor" ? "diễn viên" : "đạo diễn"}`
              : `Tạo ${personType === "actor" ? "diễn viên" : "đạo diễn"} mới`}
          </h2>
        </div>
        <button
          className={cx("button-primary")}
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save size={16} />
          {loading ? "Đang xử lý..." : editMode ? "Cập nhật" : "Lưu"}
        </button>
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
        <form className={cx("form-container")} onSubmit={handleSubmit}>
          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>
                Tên {personType === "actor" ? "diễn viên" : "đạo diễn"}
              </label>
              <input
                type="text"
                name="name"
                className={cx("form-control")}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Ngày sinh</label>
              <input
                type="date"
                name="birthDate"
                className={cx("form-control")}
                value={formData.birthDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={cx("form-group")}>
            <label className={cx("form-label")}>Tiểu sử</label>
            <textarea
              name="biography"
              className={cx("form-control")}
              value={formData.biography}
              onChange={handleInputChange}
              rows="5"
            ></textarea>
          </div>

          <div className={cx("form-group")}>
            <label className={cx("form-label")}>Hình ảnh</label>
            <div className={cx("image-upload")}>
              <input
                type="file"
                name="personAvatar"
                id="personAvatar"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="personAvatar">
                <div className={cx("upload-icon")}>
                  <Upload size={36} />
                </div>
                <div className={cx("upload-text")}>
                  Kéo thả hình ảnh vào đây hoặc click để chọn file
                </div>
              </label>
            </div>
            {(formData.personAvatarPreview ||
              (editMode && formData.personAvatar)) && (
              <img
                src={formData.personAvatarPreview || formData.personAvatar}
                alt="Preview"
                className={cx("preview-image")}
                style={{ maxHeight: "200px", marginTop: "10px" }}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;
