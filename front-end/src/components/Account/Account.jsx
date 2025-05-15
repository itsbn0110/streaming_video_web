import { Wrapper as PopperWrapper } from '@/components/Wrapper';
import HeadlessTippy from '@tippyjs/react/headless';
import { Link, useNavigate } from 'react-router-dom';
import { logoutAPI } from '@/apis';
import styles from './Account.module.scss';
import classNames from 'classnames/bind';
import images from '@/assets/images';
import routes from '@/config/routes';
import { User, HandCoins, LogOut, BookHeart } from 'lucide-react';
const cx = classNames.bind(styles);

function Account() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    const handleSignout = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('No token found');
                return;
            }

            const response = await logoutAPI(token);
            if (response.code === 1000) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <HeadlessTippy
            interactive
            placement="auto"
            render={(attrs) => (
                <PopperWrapper>
                    <ul className={cx('user-menu')} tabIndex={-1} {...attrs}>
                        <li className={cx('user-item')}>
                            <Link to={`/profile`} className={cx('user-item-link')}>
                                <User size={16} /> Thông tin tài khoản
                            </Link>
                        </li>

                        <li className={cx('user-item')}>
                            <Link to={routes.donate} className={cx('user-item-link')}>
                                <HandCoins size={16} /> Donate
                            </Link>
                        </li>

                        <li className={cx('user-item')}>
                            <Link to={routes.home} className={cx('user-item-link')}>
                                <BookHeart size={16} /> Mục yêu thích
                            </Link>
                        </li>

                        <li className={cx('user-item')}>
                            <Link to={routes.login} onClick={handleSignout} className={cx('user-item-link')}>
                                <LogOut size={16} /> Đăng xuất
                            </Link>
                        </li>
                    </ul>
                </PopperWrapper>
            )}
        >
            <div className={cx('user-settings', 'flex justify-center items-center gap-3')}>
                <img
                    style={{
                        borderRadius: '50%',
                        height: '32px',
                        width: '32px',
                        objectFit: 'cover',
                        border: user?.avatar ? '1px solid #fff' : 'none',
                    }}
                    src={user?.avatar ? user.avatar : images.fallBackAvatar}
                    alt={user?.username}
                />
            </div>
        </HeadlessTippy>
    );
}

export default Account;
