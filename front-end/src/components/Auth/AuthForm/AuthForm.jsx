import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginAPI, registerAPI } from "@/apis";
import styles from "./AuthForm.module.scss";
import classNames from "classnames/bind";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";

const cx = classNames.bind(styles);
function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      setLoading(false);
      return;
    }

    try {
      const response = isLogin
        ? await loginAPI({ username, password })
        : await registerAPI({ username, password });

      if (response.code === 1000) {
        const { token, user } = response.result;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (!isLogin) {
          setIsLogin(true);
          setError("");
          setPassword("");
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
        } else if (hasRole("ADMIN")) {
          navigate("/admin");
        } else if (hasRole("USER")) {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorMessage = isLogin
        ? "Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu."
        : "Đăng ký thất bại. Tài khoản có thể đã tồn tại.";
      setError(err.response?.data?.message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div className={cx("auth-container")}>
      <div className={cx("auth-form")}>
        <h2 className={cx("auth-title")}>
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={cx("form-group")}>
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              className={cx("input-field")}
              placeholder="Nhập tên tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={cx("form-group")}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              className={cx("input-field")}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className={cx("form-group")}>
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                className={cx("input-field")}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {error && <div className={cx("error-message")}>{error}</div>}

          <button
            type="submit"
            className={cx("auth-button")}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <div className={cx("toggle-mode")}>
          <span>{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}</span>
          <button className={cx("toggle-button")} onClick={toggleAuthMode}>
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </div>

        {isLogin && (
          <>
            <div className={cx("divider")}>
              <span>Hoặc đăng nhập bằng</span>
            </div>

            <div className={cx("social-login")}>
              <button className={cx("social-button", "qr-code")}>
                <BsQrCode />
              </button>
              <button className={cx("social-button", "facebook")}>
                <FaFacebook />
              </button>
              <button className={cx("social-button", "google")}>
                <FaGoogle />
              </button>
            </div>
          </>
        )}

        <div className={cx("terms")}>
          <p>
            {" "}
            Đăng nhập tài khoản với ITLU, bạn sẽ được trải nghiệm phim tốc độ
            cao
          </p>
          <a href="#" className={cx("terms-link")}>
            Điều khoản sử dụng và Chính sách bảo mật
          </a>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
