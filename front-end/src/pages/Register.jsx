import React, { useState } from 'react';
import styles from './Register.module.css'; // Import CSS module

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // Xử lý logic đăng ký tại đây
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className={styles['register-container']}>
      <h1 className={styles['register-title']}>Đăng Ký</h1>
      <form className={styles['register-form']} onSubmit={handleRegister}>
        <div className={styles['form-group']}>
          <label htmlFor="name" className={styles['form-label']}>
            Tên
          </label>
          <input
            type="text"
            id="name"
            className={styles['form-input']}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bạn"
            required
          />
        </div>
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
        <button type="submit" className={styles['register-button']}>
          Đăng Ký
        </button>
      </form>
      <p className={styles['login-link']}>
        Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
      </p>
    </div>
  );
};

export default Register;