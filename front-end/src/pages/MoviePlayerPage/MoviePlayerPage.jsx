import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Share2, BookmarkPlus, Eye, ChevronLeft } from 'lucide-react';
import RelatedMovies from '@/components/RelatedMovies';

import classNames from 'classnames/bind';
import styles from './MoviePlayerPage.module.scss';
const cx = classNames.bind(styles);

import { fetchMovieDataAPI, getRelatedMoviesAPI } from '@/apis';

const MoviePlayerPage = () => {
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState({});
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [videoLoading, setVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const videoRef = useRef(null);
    const { movieId } = useParams();
    const navigate = useNavigate();

    const API_STREAMING_GO_URL = import.meta.env.VITE_GOLANG_STREAMING_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchMovieDataAPI(movieId);
                setMovie(response.result);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };
        fetchData();
    }, [movieId]);

    useEffect(() => {
        const fetchRelatedMovies = async () => {
            try {
                const response = await getRelatedMoviesAPI(movieId);
                setRelatedMovies(response.result);
            } catch (error) {
                console.error('Error fetching related movies:', error);
            }
        };
        fetchRelatedMovies();
    }, [movieId]);

    useEffect(() => {
        if (movie && movie.id && videoRef.current) {
            const videoUrl = `${API_STREAMING_GO_URL}/stream/${movieId}`;
            fetch(videoUrl, {
                method: 'HEAD',
                credentials: 'include',
                mode: 'cors',
            })
                .then((response) => {
                    if (response.ok) {
                        setVideoLoading(false);
                        setIsVideoReady(true);
                    } else {
                        throw new Error(`Server responded with ${response.status}`);
                    }
                })
                .catch((error) => {
                    console.error('Error checking video availability:', error);
                    handleVideoError(error);
                });
        }
    }, [movie, movieId, API_STREAMING_GO_URL]);

    const handleBackToDetails = () => {
        navigate(-1);
    };

    const handleVideoError = (e) => {
        console.error('Video error:', e);
        setVideoError(
            'Trang web này chỉ dành cho mục đích tìm hiểu, học tập. Do giới hạn request của Google Drive API (403) trong một khoảng thời gian nhất định.',
        );
    };

    const renderVideo = () => {
        if (videoError) {
            return (
                <div className={cx('video-error')}>
                    <p>{videoError}</p>
                    <br />
                    <p>
                        Chúng mình sẽ update stream phim với CDN chuyên nghiệp và có người dùng trong tương lai ^^ Vui
                        lòng thử lại sau TvT
                    </p>
                </div>
            );
        }

        if (videoLoading) {
            return (
                <div className={cx('video-loading')}>
                    <div className={cx('loading-spinner')}></div>
                    <p>Đang tải video...</p>
                </div>
            );
        }

        return (
            <video ref={videoRef} className={cx('video-player')} controls autoPlay onError={handleVideoError}>
                <source src={`${API_STREAMING_GO_URL}/stream/${movieId}`} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
            </video>
        );
    };

    if (loading) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('loading-spinner')}></div>
            </div>
        );
    }

    return (
        <div className={cx('movie-player-page')}>
            <div className={cx('movie-player')}>{renderVideo()}</div>
            <main className={cx('main-content')}>
                <div className={cx('movie-info')}>
                    <div onClick={handleBackToDetails} className={cx('back-link')}>
                        <ChevronLeft size={18} />
                        <span>Quay lại</span>
                    </div>
                    <h1 className={cx('movie-title')}>{movie.title}</h1>
                    <p className={cx('movie-original-title')}>{movie.originalTitle}</p>

                    <div className={cx('movie-details')}>
                        <span className={cx('duration')}>
                            {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                        </span>
                        {movie.genres?.length > 0 && (
                            <span className={cx('genres')}>{movie.genres.map((g) => g.name).join(', ')}</span>
                        )}
                        {movie.countries?.length > 0 && (
                            <span className={cx('countries')}>{movie.countries.map((c) => c.name).join(', ')}</span>
                        )}
                    </div>

                    <div className={cx('action-buttons')}>
                        <button className={cx('action-button')}>
                            <Share2 size={18} />
                            <span>Chia sẻ</span>
                        </button>
                        <button className={cx('action-button')}>
                            <BookmarkPlus size={18} />
                            <span>Xem sau</span>
                        </button>
                        <button className={cx('action-button')}>
                            <Eye size={18} />
                            <span>Theo dõi</span>
                        </button>
                    </div>

                    {movie?.categories?.some((cat) => cat?.slug === 'phim-bo') || movie?.episodes?.length === 0 ? (
                        <div className={cx('notification')}>
                            <p className={cx('notification-text')}>Đang cập nhật tập cho phim bộ</p>
                        </div>
                    ) : (
                        <div className={cx('episodes-container')}></div>
                    )}

                    {movie.description && (
                        <div className={cx('description')}>
                            <h3>Giới thiệu:</h3>
                            <p>{movie.description}</p>
                        </div>
                    )}

                    {movie.trailerLink && (
                        <div className={cx('trailer')}>
                            <a
                                href={movie.trailerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx('trailer-button')}
                            >
                                <Play size={18} />
                                <span>Xem Trailer</span>
                            </a>
                        </div>
                    )}

                    <div className={cx('credits')}>
                        {movie.directors?.length > 0 && (
                            <div className={cx('directors')}>
                                <span className={cx('label')}>Đạo diễn: </span>
                                {movie.directors.map((d) => d.name).join(', ')}
                            </div>
                        )}
                        {movie.actors?.length > 0 && (
                            <div className={cx('actors')}>
                                <span className={cx('label')}>Diễn viên: </span>
                                {movie.actors.map((a) => a.name).join(', ')}
                            </div>
                        )}
                    </div>

                    <div className={cx('notification')}>
                        <p className={cx('notification-text')}>
                            Dưới đây là các phụ đề của phim này được hệ thống lấy tự động từ subsene.com. Nếu chọn được
                            một phụ đề vừa ý (khớp thời gian & dịch chuẩn), hãy 👍 phụ đề đó để lần sau xem lại phim, hệ
                            thống sẽ tự động sử dụng phụ đề đó cho bạn!
                        </p>
                    </div>

                    <RelatedMovies relatedMovies={relatedMovies} />
                </div>
            </main>
        </div>
    );
};

export default MoviePlayerPage;
