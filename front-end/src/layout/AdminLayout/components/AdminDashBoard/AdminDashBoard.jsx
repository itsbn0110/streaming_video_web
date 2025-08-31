import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../AdminLayout.module.scss';
import { MovieStatus } from '../MovieList/enums/Status';
import { Film, Users, BarChart2, Clock } from 'lucide-react';
import {
    fetchTotalMoviesAPI,
    fetchNewMoviesMonthlyAPI,
    fetchTotalUsersAPI,
    fetchDailyViewsAPI,
    fetchAdminNewlyUpdatedMoviesAPI,
    fetchGenresStatsAPI,
} from '../../../../apis';

const cx = classNames.bind(styles);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalMovies: 0,
        newMoviesMonthly: 0,
        totalUsers: 0,
        dailyViews: 0,
        newlyUpdatedMovies: [],
        genresStats: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [totalMovies, newMoviesMonthly, totalUsers, dailyViews, newlyUpdatedMovies, genresStats] =
                    await Promise.all([
                        fetchTotalMoviesAPI(),
                        fetchNewMoviesMonthlyAPI(),
                        fetchTotalUsersAPI(),
                        fetchDailyViewsAPI(),
                        fetchAdminNewlyUpdatedMoviesAPI(),
                        fetchGenresStatsAPI(),
                    ]);

                setStats({
                    totalMovies,
                    newMoviesMonthly,
                    totalUsers,
                    dailyViews,
                    newlyUpdatedMovies,
                    genresStats,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className={cx('page-header')}>
                <h2>Dashboard</h2>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                    marginBottom: '24px',
                }}
            >
                <StatCard title="Tổng số phim" value={stats.totalMovies} icon={<Film size={24} />} color="#4361ee" />
                <StatCard
                    title="Phim mới trong tháng"
                    value={stats.newMoviesMonthly}
                    icon={<Clock size={24} />}
                    color="#3a0ca3"
                />
                <StatCard title="Người dùng" value={stats.totalUsers} icon={<Users size={24} />} color="#7209b7" />
                <StatCard
                    title="Lượt xem hôm nay"
                    value={stats.dailyViews}
                    icon={<BarChart2 size={24} />}
                    color="#f72585"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div className={cx('card')}>
                    <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Phim mới cập nhật</h3>
                    <table className={cx('data-table')}>
                        <thead>
                            <tr>
                                <th>Tên phim</th>
                                <th>Loại phim</th>
                                <th>Năm</th>
                                <th>Trạng thái</th>
                                <th>Lượt xem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.newlyUpdatedMovies.map((movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.title}</td>
                                    <td>{movie.movieType === 'SINGLE' ? 'Phim lẻ' : 'Phim bộ'}</td>
                                    <td>{movie.releaseYear}</td>
                                    <td>
                                        <span
                                            className={cx(
                                                'badge',
                                                movie.status === 0 ? 'draft' : '',
                                                movie.status === 1 ? 'published' : '',
                                                movie.status === 2 ? 'archived' : '',
                                            )}
                                        >
                                            {MovieStatus[movie.status] || 'Unknown Status'}
                                        </span>
                                    </td>
                                    <td>{movie.views}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={cx('card')}>
                    <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Thể loại phổ biến</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {stats.genresStats.map((genre) => (
                            <GenreStatItem
                                key={genre.genreName}
                                name={genre.genreName}
                                count={genre.movieCount}
                                percentage={(genre.movieCount / stats.totalMovies) * 100}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div
            className={cx('card')}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px',
                borderTop: `4px solid ${color}`,
            }}
        >
            <div
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    backgroundColor: `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                }}
            >
                {icon}
            </div>
            <div style={{ marginLeft: '16px' }}>
                <div style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{value}</div>
            </div>
        </div>
    );
};

const GenreStatItem = ({ name, count, percentage }) => {
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                }}
            >
                <span>{name}</span>
                <span>{count} phim</span>
            </div>
            <div
                style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: '#62c3e7',
                        borderRadius: '4px',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default AdminDashboard;
