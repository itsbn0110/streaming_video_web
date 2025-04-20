import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import { ArrowLeft, Save, Upload } from "lucide-react";
import adminRouteConfig from "@/config/adminRoutes";
import { fetchUserDataAPI, createUserDataAPI, updateUserDataAPI } from "@/apis";

const cx = classNames.bind(styles);

const UserForm = ({ editMode = false, userData = null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    editMode && userData
      ? userData
      : {
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          dob: "",
          fullName: "",
          avatar: null,
          avatarPreview: null,
          role: "USER",
        }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    return () => {
      if (formData.avatarPreview) {
        URL.revokeObjectURL(formData.avatarPreview);
      }
    };
  }, [formData.avatarPreview]);

  useEffect(() => {
    if (editMode && id && !userData) {
      const fetchUserData = async () => {
        try {
          const response = await fetchUserDataAPI(id);
          if (response && response.result) {
            const user = response.result;
            const formattedDob = user.dob ? user.dob.split("T")[0] : "";
            setFormData({
              ...user,
              dob: formattedDob,
              password: "",
              confirmPassword: "",
              role:
                user.roles && user.roles.some((r) => r.name === "ROLE_ADMIN")
                  ? "ADMIN"
                  : "USER",
            });
          }
        } catch (err) {
          setError("Error loading user data: " + err.message);
        }
      };
      fetchUserData();
    }
  }, [editMode, id, userData]);

  const validateForm = () => {
    const errors = {};

    if (formData.username.length < 3 && !editMode) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editMode && !emailRegex.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!editMode && formData.password.length < 3) {
      errors.password = "Mật khẩu phải có ít nhất 3 ký tự";
    }

    if (!editMode && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }

    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();

      if (
        age < 16 ||
        (age === 16 && monthDiff < 0) ||
        (age === 16 && monthDiff === 0 && today.getDate() < dobDate.getDate())
      ) {
        errors.dob = "Người dùng phải trên 16 tuổi";
      }
    } else {
      if (!editMode) errors.dob = "Vui lòng nhập ngày sinh";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "avatar") {
        setFormData({
          ...formData,
          avatar: files[0],
          avatarPreview: URL.createObjectURL(files[0]),
        });
      }
    }
  };

  const prepareRequestData = () => {
    const formattedDob = formData.dob ? formData.dob : null;

    const requestData = {
      username: formData.username,
      email: formData.email,
      password: formData.password || null,
      dob: formattedDob,
      fullName: formData.fullName || "",
      role: formData.role || "USER",
    };

    if (editMode && !requestData.fullName) {
      delete requestData.fullName;
    }

    if (editMode && !requestData.password) {
      delete requestData.password;
    }

    if (editMode && !requestData.dob) {
      delete requestData.dob;
    }

    if (editMode && !requestData.email) {
      delete requestData.email;
    }

    if (editMode) delete requestData.username;

    return JSON.stringify(requestData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("request", prepareRequestData());

      if (formData.avatar) {
        formDataToSend.append("avatarFile", formData.avatar);
      }

      const response = editMode
        ? await updateUserDataAPI(id, formDataToSend)
        : await createUserDataAPI(formDataToSend);

      if (response && response.result) {
        alert(
          editMode
            ? "Người dùng đã được cập nhật!"
            : "Người dùng đã được tạo thành công!"
        );
        navigate(adminRouteConfig.users);
      } else {
        throw new Error(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi lưu người dùng");
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
            onClick={() => navigate(adminRouteConfig.listUsers)}
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
          <h2>{editMode ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}</h2>
        </div>
        <button
          className={cx("button-primary")}
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save size={16} />
          {loading ? "Đang xử lý..." : editMode ? "Cập nhật" : "Lưu người dùng"}
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
              <label className={cx("form-label")}>Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                className={cx("form-control")}
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={editMode}
              />
              {validationErrors.username && (
                <div className={cx("error-message")}>
                  {validationErrors.username}
                </div>
              )}
            </div>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Email</label>
              <input
                type="email"
                name="email"
                className={cx("form-control")}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {validationErrors.email && (
                <div className={cx("error-message")}>
                  {validationErrors.email}
                </div>
              )}
            </div>
          </div>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>
                {editMode
                  ? "Mật khẩu mới (để trống nếu không thay đổi)"
                  : "Mật khẩu"}
              </label>
              <input
                type="password"
                name="password"
                className={cx("form-control")}
                value={formData.password}
                onChange={handleInputChange}
                required={!editMode}
              />
              {validationErrors.password && (
                <div className={cx("error-message")}>
                  {validationErrors.password}
                </div>
              )}
            </div>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>
                {editMode ? "Xác nhận mật khẩu mới" : "Xác nhận mật khẩu"}
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={cx("form-control")}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!editMode}
              />
              {validationErrors.confirmPassword && (
                <div className={cx("error-message")}>
                  {validationErrors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                className={cx("form-control")}
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Ngày sinh</label>
              <input
                type="date"
                name="dob"
                className={cx("form-control")}
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
              {validationErrors.dob && (
                <div className={cx("error-message")}>
                  {validationErrors.dob}
                </div>
              )}
            </div>
          </div>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Vai trò</label>
              <select
                name="role"
                className={cx("form-control")}
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="USER">Người dùng</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
          </div>

          <div className={cx("form-group")}>
            <label className={cx("form-label")}>Ảnh đại diện</label>
            <div className={cx("image-upload")}>
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="avatar">
                <div className={cx("upload-icon")}>
                  <Upload size={36} />
                </div>
                <div className={cx("upload-text")}>
                  Kéo thả hình ảnh vào đây hoặc click để chọn file
                </div>
              </label>
            </div>
            {formData.avatarPreview && (
              <img
                src={formData.avatarPreview}
                alt="Avatar preview"
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

export default UserForm;
