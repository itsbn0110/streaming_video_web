import React, { useState } from 'react';
import styles from './Login.module.css'; // Import CSS module

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Xử lý logic đăng nhập tại đây
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className={styles['login-container']}>
      <h1 className={styles['login-title']}>Đăng Nhập</h1>
      <form className={styles['login-form']} onSubmit={handleLogin}>
        <div className={styles['form-group']}>
          <label htmlFor="email" className={styles['form-label']}>
            Email
          </label>
          <input
            type="email"
            id="email"
            className={styles['form-input']}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password" className={styles['form-label']}>
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            className={styles['form-input']}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu của bạn"
            required
          />
        </div>
        <button type="submit" className={styles['login-button']}>
          Đăng Nhập
        </button>
      </form>
      <p className={styles['register-link']}>
        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
      </p>
    </div>
  );
};

export default Login;