import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../../AdminLayout.module.scss';
import { Plus, Database, RefreshCw, Pencil, Trash } from 'lucide-react';
import { fetchAllMoviesAPI, deleteMovieDataAPI, createEpisodeAPI, updateMovieStatusAPI } from '@/apis';
import adminRouteConfig from '@/config/adminRoutes';
import EpisodeForm from '../MovieForm/EpisodeForm';
import { MovieStatus } from './enums/Status';
const cx = classNames.bind(styles);

const MovieList = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal states
    const [showEpisodeModal, setShowEpisodeModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [episodeLoading, setEpisodeLoading] = useState(false);

    const fetchMovies = useCallback(
        async (page = currentPage, size = pageSize) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchAllMoviesAPI(page, size);
                if (response && response.result) {
                    setMovies(response.result.content);
                    setTotalPages(response.result.totalPages);
                    setTotalElements(response.result.totalElements);
                    setCurrentPage(response.result.pageable.pageNumber);
                } else {
                    setError('Failed to load movies');
                }
            } catch (err) {
                setError('Error loading movies: ' + err.message);
                console.error('Error fetching movies:', err);
            } finally {
                setLoading(false);
            }
        },
        [currentPage, pageSize],
    );

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleRefresh = () => {
        fetchMovies(currentPage);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
            try {
                await deleteMovieDataAPI(id);
                if (movies.length === 1 && currentPage > 0) {
                    fetchMovies(currentPage - 1);
                } else {
                    fetchMovies(currentPage);
                }
            } catch (err) {
                setError('Error deleting movie: ' + err.message);
                console.error('Error deleting movie:', err);
            }
        }
    };

    // Xử lý chuyển hướng đến trang quản lý tập phim
    const handleAddEpisode = (movie) => {
        navigate(`/admin/episode-management/${movie.id}`, {
            state: { movieTitle: movie.title },
        });
    };

    // Xử lý đóng modal
    const handleCloseEpisodeModal = () => {
        setShowEpisodeModal(false);
        setSelectedMovie(null);
        setEpisodeLoading(false);
    };

    // Xử lý submit tạo tập
    const handleEpisodeSubmit = async (formData, movieId) => {
        setEpisodeLoading(true);
        try {
            await createEpisodeAPI(movieId, formData);

            // Thông báo thành công
            alert(`Thêm tập phim cho "${selectedMovie?.title}" thành công!`);

            // Đóng modal
            handleCloseEpisodeModal();

            // Refresh danh sách phim (tùy chọn)
            // fetchMovies(currentPage);
        } catch (error) {
            console.error('Error creating episode:', error);
            alert('Có lỗi xảy ra khi tạo tập phim. Vui lòng thử lại!');
        } finally {
            setEpisodeLoading(false);
        }
    };

    const paginate = (pageNumber) => {
        fetchMovies(pageNumber);
    };

    // Hàm để xác định loại phim dựa trên movieType
    const getMovieTypeDisplay = (movie) => {
        if (movie.movieType === 'SERIES') {
            return 'Phim bộ';
        } else if (movie.movieType === 'SINGLE') {
            return 'Phim lẻ';
        }
        // Fallback: kiểm tra categories nếu không có movieType
        return movie?.categories?.[0]?.name || 'Không xác định';
    };

    // Hàm kiểm tra xem có phải phim bộ không
    const isSeriesMovie = (movie) => {
        return movie.movieType === 'SERIES';
    };

    const handleStatusChange = async (movieId, newStatus) => {
        try {
            await updateMovieStatusAPI(movieId, newStatus);
            alert('Status updated successfully!');
            handleRefresh(); // Refresh the movie list
        } catch (error) {
            console.error('Error updating movie status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    // Hàm để render status dropdown với style giống hình 2
    const renderStatusDropdown = (movie) => {
        const getStatusStyle = (status) => {
            switch (status) {
                case 0: // Nháp
                    return {
                        backgroundColor: '#fefcbf',
                        color: '#b7791f',
                        border: '1px solid #f6e05e',
                    };
                case 1: // Công khai
                    return {
                        backgroundColor: '#c6f6d5',
                        color: '#2f855a',
                        border: '1px solid #68d391',
                    };
                case 2: // Đã lưu trữ
                    return {
                        backgroundColor: '#e2e8f0',
                        color: '#4a5568',
                        border: '1px solid #cbd5e0',
                    };
                default:
                    return {
                        backgroundColor: '#f7fafc',
                        color: '#4a5568',
                        border: '1px solid #e2e8f0',
                    };
            }
        };

        const statusStyle = getStatusStyle(movie.status);

        return (
            <select
                value={movie.status}
                onChange={(e) => handleStatusChange(movie.id, e.target.value)}
                className={cx('status-dropdown')}
                style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    minWidth: '100px',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '14px',
                    paddingRight: '32px',
                    ...statusStyle,
                }}
            >
                <option value="0" style={{ backgroundColor: '#fefcbf', color: '#b7791f' }}>
                    NHÁP
                </option>
                <option value="1" style={{ backgroundColor: '#c6f6d5', color: '#2f855a' }}>
                    CÔNG KHAI
                </option>
                <option value="2" style={{ backgroundColor: '#e2e8f0', color: '#4a5568' }}>
                    ĐÃ LƯU TRỮ
                </option>
            </select>
        );
    };

    console.log('movieStatus: ', MovieStatus[1]);
    return (
        <div>
            <div className={cx('page-header')}>
                <h2>Danh sách phim</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={cx('button-primary')} onClick={handleRefresh}>
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                    <Link to={adminRouteConfig.createFilm} className={cx('button-primary')}>
                        <Plus size={16} />
                        Tạo phim
                    </Link>
                </div>
            </div>

            {error && (
                <div className={cx('alert', 'alert-danger')} style={{ marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <div className={cx('card')}>
                {loading ? (
                    <div className={cx('loading-indicator')}>Đang tải...</div>
                ) : (
                    <>
                        <table className={cx('data-table')}>
                            <thead>
                                <tr>
                                    <th>Tên phim</th>
                                    <th>Loại phim</th>
                                    <th>Năm phát hành</th>
                                    <th>Thể loại</th>
                                    <th>Views</th>
                                    <th>Rating</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.length > 0 ? (
                                    movies.map((movie) => (
                                        <tr key={movie.id}>
                                            <td>
                                                <div style={{ fontWeight: '500' }}>{movie?.title}</div>
                                                {movie?.originalTitle && (
                                                    <div style={{ fontSize: '12px', color: '#718096' }}>
                                                        {movie?.originalTitle}
                                                    </div>
                                                )}
                                            </td>
                                            <td>{getMovieTypeDisplay(movie)}</td>
                                            <td>{movie.releaseYear}</td>
                                            <td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: '4px',
                                                    }}
                                                >
                                                    {movie.genres &&
                                                        movie.genres.slice(0, 3).map((genre, index) => (
                                                            <span
                                                                key={index}
                                                                style={{
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px',
                                                                    backgroundColor: '#e2e8f0',
                                                                    color: '#4a5568',
                                                                }}
                                                            >
                                                                {genre.name}
                                                            </span>
                                                        ))}
                                                    {movie.genres && movie.genres.length > 3 && (
                                                        <span
                                                            style={{
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                backgroundColor: '#e2e8f0',
                                                                color: '#4a5568',
                                                            }}
                                                        >
                                                            +{movie.genres.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {movie.views
                                                    ? movie.views.toLocaleString()
                                                    : Math.floor(Math.random() * 10000)}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ color: '#f6ad55', marginRight: '4px' }}>★</span>
                                                    {movie.rating || Math.floor(Math.random() * 10 + 1)}
                                                </div>
                                            </td>
                                            <td>{renderStatusDropdown(movie)}</td>
                                            <td>
                                                <div className={cx('action-buttons')}>
                                                    {/* Nút thêm tập chỉ hiện với phim bộ */}
                                                    {isSeriesMovie(movie) && (
                                                        <button
                                                            className={cx('add-episode')}
                                                            title="Thêm tập phim"
                                                            onClick={() => handleAddEpisode(movie)}
                                                            style={{
                                                                backgroundColor: '#10b981',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '6px 8px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                marginRight: '4px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Database size={14} />
                                                        </button>
                                                    )}

                                                    <Link to={`${adminRouteConfig.editFilm}/${movie.id}`}>
                                                        <button className={cx('edit')} title="Sửa phim">
                                                            <Pencil size={14} />
                                                        </button>
                                                    </Link>

                                                    <button
                                                        className={cx('delete')}
                                                        title="Xóa phim"
                                                        onClick={() => handleDelete(movie.id)}
                                                    >
                                                        <Trash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center' }}>
                                            Không có dữ liệu phim
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className={cx('pagination')}>
                                <div className={cx('page-item')}>
                                    <button
                                        onClick={() => paginate(currentPage > 0 ? currentPage - 1 : 0)}
                                        disabled={currentPage === 0}
                                    >
                                        &laquo;
                                    </button>
                                </div>
                                {[...Array(totalPages).keys()].map((number) => (
                                    <div key={number} className={cx('page-item')}>
                                        <button
                                            className={currentPage === number ? cx('active') : ''}
                                            onClick={() => paginate(number)}
                                        >
                                            {number + 1}
                                        </button>
                                    </div>
                                ))}
                                <div className={cx('page-item')}>
                                    <button
                                        onClick={() =>
                                            paginate(currentPage < totalPages - 1 ? currentPage + 1 : totalPages - 1)
                                        }
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        &raquo;
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={cx('pagination-info')}>
                            <span>
                                Hiển thị {movies.length} trên {totalElements} kết quả
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Modal thêm tập phim */}
            {showEpisodeModal && selectedMovie && (
                <EpisodeForm
                    movieId={selectedMovie.id}
                    movieTitle={selectedMovie.title}
                    nextEpisodeNumber={1} // Có thể tính toán số tập tiếp theo nếu cần
                    onSubmit={handleEpisodeSubmit}
                    onCancel={handleCloseEpisodeModal}
                    loading={episodeLoading}
                />
            )}
        </div>
    );
};

export default MovieList;
