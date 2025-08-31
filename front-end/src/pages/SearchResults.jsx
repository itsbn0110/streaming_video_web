import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './MovieListPage/MovieListPage.module.scss';
import classNames from 'classnames/bind';
import MovieCard from '@/components/MovieCard';
import { fetchMoviesByKeywordAPI } from '@/apis';

const cx = classNames.bind(styles);

function SearchResults() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        if (!keyword) return;
        setLoading(true);
        setError(null);
        fetchMoviesByKeywordAPI(keyword, page - 1, pageSize)
            .then((res) => {
                const data = res?.result?.content || res?.result || [];
                setMovies(Array.isArray(data) ? data : []);
                setTotalPages(res?.result?.totalPages || 1);
                setTotalItems(res?.result?.totalElements || data.length);
            })
            .catch(() => setError('Không thể tải dữ liệu phim.'))
            .finally(() => setLoading(false));
    }, [keyword, page]);

    return (
        <div className={cx('movie-list-page')}>
            <h1 className={cx('page-title')}>Tìm kiếm phim: "{keyword}"</h1>
            <div className={cx('content')}>
                {error && <div className={cx('error-message')}>{error}</div>}
                {loading ? (
                    <div className={cx('loading')}>Đang tải...</div>
                ) : (
                    <div className={cx('movies')}>
                        {movies.length > 0 ? (
                            movies.map((movie) => {
                                if (!movie || typeof movie !== 'object' || !movie.id) {
                                    console.error('Invalid movie object:', movie);
                                    return null;
                                }
                                return <MovieCard key={movie.id} movie={movie} />;
                            })
                        ) : (
                            <div className={cx('no-results')}>Không tìm thấy phim phù hợp</div>
                        )}
                    </div>
                )}
                {totalPages > 1 && (
                    <div className={cx('pagination')}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} className={cx({ active: page === i + 1 })} onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
