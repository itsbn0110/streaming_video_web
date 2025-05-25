import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import routes from '@/config/routes';
import { Link, useNavigate } from 'react-router-dom';
import { logoutAPI } from '@/apis';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '@/assets/images';
import Search from '../Search';
import Account from '@/components/Account';
import Button from '@/components/Button';
import { List, X, Home, TrendingUp, Film, User, DollarSign, LogOut, Bell, Settings } from 'lucide-react';

const cx = classNames.bind(styles);

function Header({ isHeaderHidden = 'hello' }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const sidebarRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobileMenuOpen) {
                const isToggleButton = event.target.closest(`.${cx('nav-list-mobile')}`);
                if (!isToggleButton) {
                    setIsMobileMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

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
                <div className={cx('nav-list-mobile')} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <List size={33} />
                </div>

                <div>
                    <Link to={routes.home}>
                        <h1 className={cx('logo')}>ITLU</h1>
                    </Link>
                </div>

                <ul className={cx('nav-list')}>
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
                </ul>
            </div>

            <div className={cx('actions')}>
                <Search />

                {user ? (
                    <Account />
                ) : (
                    <Button outline sizeType="small" to="/login">
                        Sign In
                    </Button>
                )}
            </div>

            {/* Mobile Menu Sidebar */}
            <div className={cx('mobile-sidebar', { open: isMobileMenuOpen })} ref={sidebarRef}>
                <div className={cx('sidebar-header')}>
                    <div className={cx('user-profile')}>
                        {user ? (
                            <>
                                <img
                                    src={user?.avatar ? user.avatar : images.fallBackAvatar}
                                    alt={user?.username}
                                    className={cx('avatar')}
                                />
                                <span className={cx('username')}>Người Dùng</span>
                                <button className={cx('close-btn')} onClick={closeMobileMenu}>
                                    <X size={24} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className={cx('guest-avatar')}>
                                    <User size={24} />
                                </div>
                                <span className={cx('username')}>Khách</span>
                                <button className={cx('close-btn')} onClick={closeMobileMenu}>
                                    <X size={24} />
                                </button>
                            </>
                        )}
                    </div>
                    {user && (
                        <div className={cx('user-actions')}>
                            <Link to="/profile" className={cx('user-action-item')} onClick={closeMobileMenu}>
                                <User size={20} />
                                <span>Chỉnh sửa thông tin</span>
                            </Link>
                            <Link to={routes.home} className={cx('user-action-item')} onClick={closeMobileMenu}>
                                <Settings size={20} />
                                <span>Tài khoản và Cài đặt</span>
                            </Link>
                            <Link to={routes.home} className={cx('user-action-item')} onClick={closeMobileMenu}>
                                <Bell size={20} />
                                <span>Thông báo</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className={cx('sidebar-divider')}></div>

                <nav className={cx('sidebar-nav')}>
                    <Link to={routes.home} className={cx('nav-item')} onClick={closeMobileMenu}>
                        <Home size={20} />
                        <span>Trang chủ</span>
                    </Link>
                    <Link to={routes.series} className={cx('nav-item')} onClick={closeMobileMenu}>
                        <Home size={20} />
                        <span>Phim bộ</span>
                    </Link>
                    <Link to={routes.single} className={cx('nav-item')} onClick={closeMobileMenu}>
                        <Film size={20} />
                        <span>Phim lẻ</span>
                    </Link>

                    <Link to={routes.hot} className={cx('nav-item')} onClick={closeMobileMenu}>
                        <TrendingUp size={20} />
                        <span>Mới & Phổ biến</span>
                    </Link>
                </nav>

                {user && (
                    <>
                        <div className={cx('sidebar-divider')}></div>
                        <div className={cx('sidebar-footer')}>
                            <Link to={routes.donate} className={cx('footer-item')} onClick={closeMobileMenu}>
                                <DollarSign size={20} />
                                <span>Donate</span>
                            </Link>
                            <Link
                                to={routes.login}
                                className={cx('footer-item')}
                                onClick={() => {
                                    handleSignout();
                                    closeMobileMenu();
                                }}
                            >
                                <LogOut size={20} />
                                <span>Đăng xuất</span>
                            </Link>
                        </div>
                    </>
                )}
                {!user && (
                    <>
                        <div className={cx('sidebar-divider')}></div>
                        <div className={cx('sidebar-footer')}>
                            <Button to="/login" full primary sizeType="medium" onClick={closeMobileMenu}>
                                Đăng nhập
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Backdrop overlay when mobile menu is open */}
            {isMobileMenuOpen && <div className={cx('backdrop')} onClick={closeMobileMenu}></div>}
        </header>
    );
}

Header.PropTypes = {
    isHeaderHidden: PropTypes.bool,
};

export default Header;
