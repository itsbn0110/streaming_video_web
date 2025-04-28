import { useState, useEffect } from 'react';
import routes from '@/config/routes';
import { Link, useNavigate } from 'react-router-dom';

import { logoutAPI } from '@/apis';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '@/assets/images';
import Search from '../Search';
const cx = classNames.bind(styles);

function Header({ isHeaderHidden }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('user', user);
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        if (isHeaderHidden) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (isHeaderHidden) {
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isHeaderHidden]);

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
        <header
            className={cx('wrapper', {
                scrolled: isHeaderHidden && isScrolled,
                default: !isHeaderHidden,
            })}
        >
            <div className={cx('nav-container')}>
                <div>
                    <Link to={routes.home}>
                        <h1 className={cx('logo')}>ITLU</h1>
                    </Link>
                </div>

                <ul className={cx('nav', 'hidden', 'md:flex')}>
                    <li>
                        <Link to={routes.home}>Trang chủ</Link>
                    </li>
                    <li>
                        <Link to={routes.hot}>Mới & Phổ biến</Link>
                    </li>
                    <li>
                        <Link to={routes.single}>Phim lẻ</Link>
                    </li>
                    <li>
                        <Link to={routes.series}>Phim bộ</Link>
                    </li>
                    <li>
                        <Link to={routes.donate}>Donater</Link>
                    </li>
                </ul>
            </div>

            <div className={cx('actions')}>
                <Search />

                {user ? (
                    <div className="flex justify-center items-center gap-3">
                        <button onClick={handleSignout} className={cx('sign-in')}>
                            Sign Out
                        </button>
                        <img
                            style={{
                                borderRadius: '50%',
                                height: '36px',
                                width: '36px',
                                objectFit: 'cover',
                                border: user?.avatar ? '1px solid #fff' : 'none',
                            }}
                            src={user?.avatar ? user.avatar : images.fallBackAvatar}
                            alt={user?.username}
                        />
                    </div>
                ) : (
                    <Link to="/login">
                        <button className={cx('sign-in')}>Sign In</button>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Header;
