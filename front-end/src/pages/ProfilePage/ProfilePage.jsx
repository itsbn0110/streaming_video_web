import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProfilePage.module.scss';
import { Save, ArrowLeft, User, Lock } from 'lucide-react';
import { updateProfileAPI, changePasswordAPI } from '@/apis';

const cx = classNames.bind(styles);

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        fullName: '',
        dob: '',
        avatar: '',
        id: '',
    });

    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserData({
                    username: user.username || '',
                    email: user.email || '',
                    fullName: user.fullName || '',
                    dob: user.dob ? user.dob.split('T')[0] : '',
                    avatar: user.avatar || '',
                    id: user.id || '',
                });
                setAvatarPreview(user.avatar || '');
            } catch (e) {
                console.log(e);
            }
        }
    }, []);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSubmitSuccess(false);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('userId', userData.id);
            formDataToSend.append(
                'request',
                JSON.stringify({
                    email: userData.email,
                    fullName: userData.fullName,
                    dob: userData.dob,
                }),
            );
            if (userData.avatar && typeof userData.avatar !== 'string') {
                formDataToSend.append('avatarFile', userData.avatar);
            }
            const response = await updateProfileAPI(formDataToSend);
            if (response && response.result) {
                setSubmitSuccess(true);
                localStorage.setItem('user', JSON.stringify(response.result));
                setAvatarPreview(response.result.avatar || '');
            } else {
                setError('Có lỗi xảy ra khi cập nhật thông tin cá nhân');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật thông tin cá nhân: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSubmitSuccess(false);
        try {
            const response = await changePasswordAPI({
                userId: userData.id,
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            if (response && response.result) {
                setSubmitSuccess(true);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                setError('Có lỗi xảy ra khi đổi mật khẩu');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi đổi mật khẩu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserData((prev) => ({
                ...prev,
                avatar: file,
            }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className={cx('profile-container')}>
            <div className={cx('page-header')}>
                <h2>Thông tin cá nhân</h2>
                <Link to="/" className={cx('btn-back')}>
                    <ArrowLeft size={16} />
                    Quay lại trang chủ
                </Link>
            </div>

            {error && <div className={cx('alert', 'alert-danger')}>{error}</div>}

            {submitSuccess && (
                <div className={cx('alert', 'alert-success')}>
                    {activeTab === 'profile' ? 'Cập nhật thông tin cá nhân thành công!' : 'Đổi mật khẩu thành công!'}
                </div>
            )}

            <div className={cx('profile-card')}>
                <div className={cx('tab-navigation')}>
                    <button
                        className={cx('tab-button', { active: activeTab === 'profile' })}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={16} />
                        Thông tin cá nhân
                    </button>
                    <button
                        className={cx('tab-button', { active: activeTab === 'password' })}
                        onClick={() => setActiveTab('password')}
                    >
                        <Lock size={16} />
                        Đổi mật khẩu
                    </button>
                </div>

                {activeTab === 'profile' ? (
                    <form onSubmit={handleProfileSubmit} className={cx('profile-form')}>
                        <div className={cx('profile-header')}>
                            <div className={cx('avatar-container')}>
                                <img
                                    src={avatarPreview || '/fallback-img-profile.png'}
                                    alt="Avatar"
                                    className={cx('avatar')}
                                />
                                <div className={cx('avatar-upload')}>
                                    <label htmlFor="avatar-input" className={cx('upload-button')}>
                                        Thay đổi ảnh
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar-input"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="username">Tên đăng nhập</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={cx('form-control')}
                                value={userData.username}
                                onChange={handleProfileChange}
                                readOnly
                                disabled
                            />
                            <small className={cx('form-text')}>Tên đăng nhập không thể thay đổi</small>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={cx('form-control')}
                                value={userData.email}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="fullName">Họ và tên</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                className={cx('form-control')}
                                value={userData.fullName}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="dob">Ngày sinh</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                className={cx('form-control')}
                                value={userData.dob}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className={cx('form-actions')}>
                            <button type="submit" className={cx('button-primary')} disabled={loading}>
                                <Save size={16} />
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className={cx('password-form')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                className={cx('form-control')}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                className={cx('form-control')}
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="Nhập mật khẩu mới"
                                minLength="6"
                            />
                            <small className={cx('form-text')}>Mật khẩu phải có ít nhất 6 ký tự</small>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={cx('form-control')}
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>

                        <div className={cx('form-actions')}>
                            <button type="submit" className={cx('button-primary')} disabled={loading}>
                                <Save size={16} />
                                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
