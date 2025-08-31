import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Share2,
    ChevronLeft,
    Star,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    Heart,
    Plus,
    HeartOff,
    SendHorizontal,
} from 'lucide-react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import TickIcon from './assets/small-green-tick.svg?react';
import classNames from 'classnames/bind';
import styles from './MoviePlayerPage.module.scss';
const cx = classNames.bind(styles);
import {
    fetchMovieDataAPI,
    getRelatedMoviesAPI,
    fetchUserPlaylistsAPI,
    addMovieToPlaylistsAPI,
    submitRatingAPI,
    fetchMovieRatingsAPI,
    fetchUserRatingForMovieAPI,
    getMovieCommentsAPI,
    createCommentAPI,
    likeCommentAPI,
    dislikeCommentAPI,
    addFavoriteAPI,
    removeFavoriteAPI,
    checkIsFavoriteAPI,
    trackViewAPI,
} from '@/apis';
import { RatingModal } from './RatingModal/RatingModal';
import Button from '@/components/Button';
import moment from 'moment';

const MoviePlayerPage = () => {
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState({});
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [videoLoading, setVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [isSeries, setIsSeries] = useState(null);
    const [commentTextArea, setCommentTextArea] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [activeTab, setActiveTab] = useState('comments');
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [comments, setComments] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [commentCount, setCommentCount] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [replyToComment, setReplyToComment] = useState(null);
    const [lastCommentTime, setLastCommentTime] = useState(null);

    // New state to track video initialization - prevent multiple calls
    const [videoInitialized, setVideoInitialized] = useState(false);
    const [streamingUrl, setStreamingUrl] = useState('');
    const hasInitialized = useRef(false);

    const videoRef = useRef(null);
    const { movieId } = useParams();
    const [searchParam] = useSearchParams();
    const episodeNumber = parseInt(searchParam.get('ep') || 1);
    const navigate = useNavigate();
    const API_STREAMING_GO_URL = import.meta.env.VITE_GOLANG_STREAMING_API_URL;

    const scrollIntoCommentSection = () => {
        const section = document.getElementById('comment-section');
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    };

    useEffect(() => {
        checkIsFavoriteAPI(movieId).then((res) => {
            console.log('check res', res);
            setIsFavorite(res || false);
        });
    }, [movieId]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetchMovieDataAPI(movieId);
                const movieData = response.result;

                // Sort episodes by episodeNumber if they exist
                if (movieData.episodes && Array.isArray(movieData.episodes)) {
                    movieData.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
                }

                setMovie(movieData);
            } catch {
                console.error('Failed to fetch movie details');
            }
        };
        fetchMovieDetails();
    }, [movieId]);

    // Combined effect to handle movie type detection and initial setup
    useEffect(() => {
        if (movie && Object.keys(movie).length > 0 && !hasInitialized.current) {
            const isSeriesType = movie?.categories?.some((category) => category?.slug === 'phim-bo');
            setIsSeries(isSeriesType);

            let finalEpisodeNumber = 1;

            // For series, ensure episode parameter is set
            if (isSeriesType) {
                if (!searchParam.get('ep')) {
                    const newSearchParams = new URLSearchParams(searchParam);
                    newSearchParams.set('ep', '1');
                    navigate(`${window.location.pathname}?${newSearchParams.toString()}`, { replace: true });
                    finalEpisodeNumber = 1;
                } else {
                    finalEpisodeNumber = episodeNumber;
                }
                setSelectedEpisode(finalEpisodeNumber);
            }

            // Generate streaming URL once
            const url = isSeriesType
                ? `${API_STREAMING_GO_URL}/stream/${movieId}?ep=${finalEpisodeNumber}`
                : `${API_STREAMING_GO_URL}/stream/${movieId}`;

            setStreamingUrl(url);
            setLoading(false);
            setVideoInitialized(true);
            hasInitialized.current = true;
        }
    }, [movie, movieId, episodeNumber, searchParam, navigate, API_STREAMING_GO_URL]);

    // Effect to handle video loading state - only runs when video should be initialized
    useEffect(() => {
        if (videoInitialized && streamingUrl) {
            setVideoLoading(false);
        }
    }, [videoInitialized, streamingUrl]);

    const handleBackToDetails = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await fetchMovieRatingsAPI(movieId);
                setRatings(res.result || []);
            } catch (error) {
                console.log(error);
                setRatings([]);
            }
        };
        fetchRatings();
    }, [movieId]);

    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const res = await fetchUserRatingForMovieAPI(movieId);
                setUserRating(res.result || null);
            } catch (error) {
                console.log(error);
                setUserRating(null);
            }
        };
        fetchUserRating();
    }, [movieId, showRatingModal]);

    const handleSubmitRating = async (rating, comment) => {
        try {
            const payload = {
                starValue: rating,
                comment,
                movieId: movie.id,
            };
            await submitRatingAPI(payload);
            toast.success('Rating submitted successfully!');
            setShowRatingModal(false);
            // Refresh ratings
            const res = await fetchMovieRatingsAPI(movieId);
            setRatings(res.result || []);
            // Refresh user rating
            const userRes = await fetchUserRatingForMovieAPI(movieId);
            setUserRating(userRes.result || null);
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Failed to submit rating. Please try again.');
        }
    };

    const fetchComments = useCallback(async () => {
        try {
            let response;
            if (isSeries && selectedEpisode) {
                console.log('lần 1 isSeries: ', isSeries);
                response = await getMovieCommentsAPI(movie.id, selectedEpisode);
            } else if (!isSeries) {
                response = await getMovieCommentsAPI(movie.id);
            } else {
                return;
            }

            setComments(response.content);
            setCommentCount(response.totalElements);
        } catch {
            console.error('Error fetching comments');
        }
    }, [isSeries, selectedEpisode, movie.id]);

    useEffect(() => {
        if (movie.id && isSeries !== null) {
            fetchComments();
        }
    }, [fetchComments, movie.id, isSeries]);

    const handleVideoError = (e) => {
        console.error('Video error:', e);
        setVideoError(
            'Trang web này chỉ dành cho mục đích tìm hiểu,học tập, do giới hạn request của google drive api (403) trong một khoảng thời gian nhất định',
        );
    };

    const handleEpisodeSelect = (episodeNum = 1) => {
        setSelectedEpisode(episodeNum);
        setVideoLoading(true);
        setVideoError(null);

        // Update URL
        const newSearchParams = new URLSearchParams(searchParam);
        newSearchParams.set('ep', episodeNum.toString());
        navigate(`${window.location.pathname}?${newSearchParams.toString()}`, { replace: true });

        // Update streaming URL for new episode
        const newUrl = `${API_STREAMING_GO_URL}/stream/${movieId}?ep=${episodeNum}`;
        setStreamingUrl(newUrl);

        // Short delay for smooth transition
        setTimeout(() => {
            setVideoLoading(false);
        }, 500);
    };

    const renderStar = (ratingCount) => {
        const stars = [];
        for (let i = 1; i <= ratingCount; i++) {
            stars.push(
                <span key={i} className={cx('star', 'mr-0.5')}>
                    ★
                </span>,
            );
        }
        return <div className={cx('stars')}>{stars}</div>;
    };

    useEffect(() => {
        const fetchRelatedMovies = async () => {
            try {
                const response = await getRelatedMoviesAPI(movieId);
                setRelatedMovies(response.result);
            } catch {
                console.error('Failed to fetch related movies');
            }
        };
        fetchRelatedMovies();
    }, [movieId]);

    useEffect(() => {
        // Fetch user-created lists (mocked for now)
        const fetchUserLists = async () => {
            try {
                const res = await fetchUserPlaylistsAPI(); // Replace with actual API call
                console.log(res.result);
                setUserLists(res.result);
            } catch (error) {
                console.error('Error fetching user lists:', error);
            }
        };
        fetchUserLists();
    }, []);

    useEffect(() => {
        if (movie.id && movie.genres && movie.genres.length > 0) {
            const genreIds = movie.genres.map((genre) => genre.id); // Collect all genre IDs
            if (!videoLoading && !videoError) {
                trackView(genreIds);
            }
        }
    }, [videoLoading, videoError, movie]);

    const trackView = async (genreIds) => {
        try {
            await trackViewAPI(genreIds);
            console.log(`Tracked view for movie ID:, genre IDs: ${genreIds}`);
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    };

    const handleAddToPlaylists = async () => {
        const selectedPlaylists = userLists.filter((playlist) => playlist.isSelected).map((playlist) => playlist.id);
        if (selectedPlaylists.length > 0) {
            try {
                const payload = {
                    playlistIds: selectedPlaylists,
                    movieId: movie.id,
                };
                await addMovieToPlaylistsAPI(payload);
                toast.success('Movie added to selected playlists successfully!');

                setShowDropdown(false);
            } catch (error) {
                console.error('Error adding movie to playlists:', error);
                toast.error(error?.response?.data?.message || 'An error occurred while adding the movie to playlists.');
            }
        } else {
            toast.error('Please select at least one playlist.');
        }
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    const handleClickCommentButton = () => {
        if (activeTab !== 'comments') {
            setActiveTab('comments');
        }
        scrollIntoCommentSection();
    };

    const isLoggedIn = !!localStorage.getItem('accessToken');

    if (loading) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('loading-spinner')}></div>
            </div>
        );
    }

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.id} className={cx('comment-item')}>
                <div className={cx('comment-avatar')}>
                    <img src={comment?.userAvatar || '/api/placeholder/32/32'} alt="User" />
                </div>
                <div className={cx('comment-content')}>
                    <div className={cx('comment-header')}>
                        <span className={cx('username')}>{comment?.username || 'Ẩn danh'}</span>
                        <span className={cx('comment-time')}>{moment(comment.createdAt).fromNow()}</span>
                    </div>
                    <p className={cx('comment-text')}>{comment.content}</p>
                    <div className={cx('comment-actions-row')}>
                        <button className={cx('action-btn')} onClick={() => handleLikeComment(comment.id)}>
                            <ThumbsUp size={14} />
                            <span>{comment.likesCount}</span>
                        </button>
                        <button className={cx('action-btn')} onClick={() => handleDislikeComment(comment.id)}>
                            <ThumbsDown size={14} />
                            <span>{comment.dislikesCount}</span>
                        </button>
                        <button className={cx('action-btn')} onClick={() => setReplyToComment(comment.id)}>
                            Reply
                        </button>
                    </div>
                    {replyToComment === comment.id && (
                        <form className={cx('reply-form')} onSubmit={(e) => handleCommentSubmit(e, comment.id)}>
                            <textarea
                                className={cx('reply-input')}
                                placeholder="Write a reply..."
                                onChange={(e) => setCommentTextArea(e.target.value)}
                                rows={2}
                                value={commentTextArea}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (commentTextArea.trim()) {
                                            handleCommentSubmit(e);
                                        } else {
                                            toast.error('Bình luận không được để trống!');
                                        }
                                    }
                                }}
                            />
                            <button type="submit" className={cx('submit-reply-btn')}>
                                Submit
                            </button>
                        </form>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className={cx('replies')}>{renderComments(comment.replies)}</div>
                    )}
                </div>
            </div>
        ));
    };

    const handleCommentSubmit = async (e, parentCommentId = null) => {
        e.preventDefault();

        const currentTime = new Date().getTime();
        if (lastCommentTime && currentTime - lastCommentTime < 1 * 60 * 1000) {
            toast.error('Từ từ thôi bạn ơi!. Gửi lại bình luận');
            return;
        }

        if (!commentTextArea.trim()) {
            toast.error('Bình luận không được để trống!');
            return;
        }

        try {
            const payload = {
                movieId: movie.id,
                content: commentTextArea,
                parentCommentId,
            };

            // If the movie is a series, include the episode number
            if (isSeries) {
                payload.episodeNumber = selectedEpisode;
            }

            await createCommentAPI(payload); // Gửi bình luận qua API
            toast.success('Bình luận đã được gửi thành công!');
            setCommentTextArea('');
            setReplyToComment(null); // Reset trạng thái trả lời
            setLastCommentTime(currentTime); // Cập nhật thời gian gửi bình luận cuối cùng
            fetchComments();
        } catch {
            console.error('Failed to submit comment.');
            toast.error('Không thể gửi bình luận. Vui lòng thử lại.');
        }
    };

    const updateCommentRecursively = (comments, commentId, updateFn) => {
        return comments.map((comment) => {
            if (comment.id === commentId) {
                return updateFn(comment);
            } else if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateCommentRecursively(comment.replies, commentId, updateFn),
                };
            }
            return comment;
        });
    };

    const handleLikeComment = async (commentId) => {
        if (!isLoggedIn) {
            toast.error('You must be logged in to perform this action.!');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return;
        }

        // Update UI ngay lập tức
        const updatedComments = updateCommentRecursively(comments, commentId, (comment) => ({
            ...comment,
            likesCount: comment.likesCount + 1,
        }));
        setComments(updatedComments);

        try {
            await likeCommentAPI(commentId);
        } catch (error) {
            console.error('Failed to like comment:', error);
            // Rollback nếu API call thất bại
            setComments(comments);
            toast.error('Không thể like comment. Vui lòng thử lại!');
        }
    };

    const handleDislikeComment = async (commentId) => {
        if (!isLoggedIn) {
            toast.error('You must be logged in to perform this action.!');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return;
        }

        // Update UI ngay lập tức
        const updatedComments = updateCommentRecursively(comments, commentId, (comment) => ({
            ...comment,
            dislikesCount: comment.dislikesCount + 1,
        }));
        setComments(updatedComments);

        try {
            await dislikeCommentAPI(commentId);
        } catch (error) {
            console.error('Failed to dislike comment:', error);
            // Rollback nếu API call thất bại
            setComments(comments);
            toast.error('Không thể dislike comment. Vui lòng thử lại!');
        }
    };

    const handleFavoriteToggle = async () => {
        try {
            const newFavoriteStatus = !isFavorite;
            setIsFavorite(newFavoriteStatus);
            if (!isFavorite) {
                await addFavoriteAPI(movie.id);
            } else {
                await removeFavoriteAPI(movie.id);
            }
            toast.success(
                newFavoriteStatus ? 'Đã thêm phim này vào danh sách yêu thích.' : 'Đã bỏ yêu thích phim này.',
            );
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };

    // Render video component only when everything is ready
    const renderVideoPlayer = () => {
        if (!videoInitialized || isSeries === null) {
            return (
                <div className={cx('video-loading')}>
                    <div className={cx('loading-spinner')}></div>
                    <p>Đang khởi tạo video...</p>
                </div>
            );
        }

        if (videoError) {
            return (
                <div className={cx('video-error')}>
                    <p>{videoError}</p>
                    <br />
                    <p>
                        Chúng mình sẽ update stream phim với cdn chuyên nghiệp và có người dùng trong tương lai ^^ Vui
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

        // Single video element for both series and single movies
        return (
            <video
                ref={videoRef}
                className={cx('video-element')}
                controls
                onError={handleVideoError}
                autoPlay
                key={streamingUrl} // Use streamingUrl as key to ensure proper re-rendering
                src={streamingUrl}
            >
                <source src={streamingUrl} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
            </video>
        );
    };

    return (
        <div className={cx('movie-player-page')}>
            <div className={cx('movie-player')}>{renderVideoPlayer()}</div>

            <main className={cx('main-content')}>
                <div className={cx('content-layout')}>
                    <div className={cx('left-column')}>
                        <div className={cx('movie-info')}>
                            <div onClick={handleBackToDetails} className={cx('back-link')}>
                                <ChevronLeft size={18} />
                                <span>Quay lại</span>
                            </div>
                            <h1 className={cx('movie-title')}>{movie.title}</h1>
                            <p className={cx('movie-original-title')}>{movie.originalTitle}</p>

                            <div className={cx('movie-meta')}>
                                <div className={cx('movie-details')}>
                                    <span className={cx('duration')}>
                                        {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                    </span>
                                    {movie.genres && movie.genres.length > 0 && (
                                        <span className={cx('genres')}>
                                            {movie.genres.map((genre) => genre.name).join(', ')}
                                        </span>
                                    )}
                                    {movie.countries && movie.countries.length > 0 && (
                                        <span className={cx('countries')}>
                                            {movie.countries.map((country) => country.name).join(', ')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('action-buttons')}>
                                <div className={cx('dropdown-container')}>
                                    <button
                                        className={cx('action-button')}
                                        onClick={() => {
                                            if (!isLoggedIn) {
                                                toast.error('Bạn phải đăng nhập để dùng chức năng này!');
                                                return;
                                            }
                                            setShowDropdown((prev) => !prev);
                                        }}
                                    >
                                        <Plus /> Thêm vào
                                    </button>
                                    {showDropdown && (
                                        <div className={cx('dropdown')}>
                                            <h3 className={cx('dropdown-title')}>Chọn danh sách</h3>
                                            <ul className={cx('dropdown-list')}>
                                                {userLists.map((playlist) => (
                                                    <li key={playlist.id} className={cx('dropdown-item')}>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                name="playlist"
                                                                value={playlist.id}
                                                                onChange={(e) => {
                                                                    const updatedLists = userLists.map((list) =>
                                                                        list.id === playlist.id
                                                                            ? { ...list, isSelected: e.target.checked }
                                                                            : list,
                                                                    );
                                                                    setUserLists(updatedLists);
                                                                }}
                                                            />
                                                            {playlist.name}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button className={cx('add-button')} onClick={handleAddToPlaylists}>
                                                Thêm vào danh sách
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button className={cx('action-button')}>
                                    <Share2 size={18} />
                                    <span>Chia sẻ</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            toast.error('Bạn phải đăng nhập để dùng chức năng này!');
                                            return;
                                        }
                                        handleFavoriteToggle();
                                    }}
                                    className={cx('action-button', { 'favorite-active': isFavorite })}
                                >
                                    {isFavorite ? (
                                        <span className="flex items-center gap-2">
                                            <HeartOff size={18} color="currentColor" />
                                            <span>Hủy yêu thích</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Heart size={18} color="#ffffff" />
                                            <span>Yêu thích</span>
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Episodes Section for Series */}
                            {isSeries && movie.episodes && movie.episodes.length > 0 && (
                                <div className={cx('episodes-section')}>
                                    <div className={cx('episodes-grid')}>
                                        {movie.episodes.map((episode) => (
                                            <button
                                                key={episode.id}
                                                className={cx('episode-button', {
                                                    active: selectedEpisode === episode.episodeNumber,
                                                })}
                                                onClick={() => handleEpisodeSelect(episode.episodeNumber)}
                                            >
                                                Tập {episode.episodeNumber}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {movie.description && (
                                <div className={cx('description')}>
                                    <h3>Giới thiệu:</h3>
                                    <p>{movie.description}</p>
                                </div>
                            )}

                            <div className={cx('credits')}>
                                {movie.directors && movie.directors.length > 0 && (
                                    <div className={cx('directors')}>
                                        <span className={cx('label')}>Đạo diễn: </span>
                                        {movie.directors.map((director) => director.name).join(', ')}
                                    </div>
                                )}

                                {movie.actors && movie.actors.length > 0 && (
                                    <div className={cx('actors')}>
                                        <span className={cx('label')}>Diễn viên: </span>
                                        {movie.actors.map((actor) => actor.name).join(', ')}
                                    </div>
                                )}
                            </div>

                            {/* Comments Section */}
                            <div id="comment-section" className={cx('comments-section')}>
                                <div className={cx('tabs')}>
                                    <button
                                        className={cx('tabButton', { active: activeTab === 'comments' })}
                                        onClick={() => handleTabChange('comments')}
                                    >
                                        Bình luận
                                    </button>
                                    <button
                                        className={cx('tabButton', { active: activeTab === 'ratings' })}
                                        onClick={() => handleTabChange('ratings')}
                                    >
                                        Đánh giá
                                    </button>

                                    <span className={cx('rating', 'flex', 'items-center', 'gap-1')}>
                                        <TickIcon />
                                        <span className="ml-1">{movie.ratingCount || 8.0}</span>
                                        <span className={cx('rating-text')}>Lượt đánh giá</span>
                                    </span>
                                </div>
                                <div className={cx('tabContent')}>
                                    {activeTab === 'comments' && (
                                        <>
                                            {!isLoggedIn && (
                                                <div className={cx('comment-notice')}>
                                                    Bạn phải đăng nhập để dùng chức năng này.
                                                </div>
                                            )}
                                            <form className={cx('comment-form')} onSubmit={handleCommentSubmit}>
                                                <textarea
                                                    className={cx('comment-input')}
                                                    placeholder="Viết bình luận"
                                                    onChange={(e) => setCommentTextArea(e.target.value)}
                                                    rows={3}
                                                    disabled={!isLoggedIn}
                                                    value={commentTextArea}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            if (commentTextArea.trim()) {
                                                                handleCommentSubmit(e);
                                                            } else {
                                                                toast.error('Bình luận không được để trống!');
                                                            }
                                                        }
                                                    }}
                                                />
                                                <div className={cx('comment-actions')}>
                                                    <span className={cx('char-count')}>
                                                        {commentTextArea.length} / 1000
                                                    </span>
                                                    <button
                                                        type="submit"
                                                        className={cx('submit-btn', 'flex items-center gap-2')}
                                                        disabled={!isLoggedIn || !commentTextArea.trim()}
                                                    >
                                                        Gửi <SendHorizontal />
                                                    </button>
                                                </div>
                                            </form>

                                            <div className={cx('comments-list')}>
                                                {comments.length > 0 ? (
                                                    renderComments(comments)
                                                ) : (
                                                    <div>Chưa có bình luận nào cho phim này.</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'ratings' && (
                                        <>
                                            {!isLoggedIn && (
                                                <div className={cx('comment-notice')}>
                                                    Bạn phải đăng nhập để dùng chức năng này.
                                                </div>
                                            )}
                                            <div className={cx('ratings-list')}>
                                                {/* Hiển thị danh sách đánh giá của user cho phim này */}
                                                {ratings.length > 0 ? (
                                                    ratings.map((rating) => (
                                                        <div key={rating.id} className={cx('rating-item')}>
                                                            <div className={cx('rating-header')}>
                                                                <div className={cx('rating-avatar')}>
                                                                    <img
                                                                        src={
                                                                            rating.user?.avatar ||
                                                                            '/api/placeholder/32/32'
                                                                        }
                                                                        alt={rating.user?.name || 'User'}
                                                                    />
                                                                </div>
                                                                <span className={cx('username')}>
                                                                    {rating.user?.username || 'Ẩn danh'}
                                                                </span>
                                                                <span className={cx('rating-time')}>
                                                                    {moment(rating.createdAt).fromNow()}
                                                                </span>
                                                            </div>
                                                            <div className={cx('rating-content')}>
                                                                <span className={cx('star-value')}>
                                                                    {renderStar(rating.starValue)}
                                                                </span>
                                                                <p>{rating.comment}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Chưa có đánh giá nào cho phim này.</div>
                                                )}
                                                {/* Nếu muốn hiển thị đánh giá của user hiện tại riêng biệt, có thể thêm userRating ở đây */}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('right-column')}>
                        {/* Rating and Actions */}
                        <div className={cx('rating-section')}>
                            <div className={cx('rating-buttons')}>
                                <Button
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            toast.error('Bạn phải đăng nhập để dùng chức năng này!');
                                            return;
                                        }
                                        setShowRatingModal(true);
                                    }}
                                    secondary
                                    small
                                    leftIcon={<Star size={12} />}
                                >
                                    Đánh giá
                                </Button>
                                <button onClick={handleClickCommentButton} className={cx('rating-btn')}>
                                    <MessageCircle size={16} />
                                    <span>Bình luận</span>
                                </button>
                                <div className={cx('movie-rating')}>
                                    <span className={cx('rating-score')}>
                                        {movie?.averageRating || 0}{' '}
                                        <span className={cx('stars', 'text-[1.1rem] ml-0.5')}>★</span>
                                    </span>
                                    <span className={cx('rating-label')}>Đánh giá</span>
                                </div>
                            </div>
                        </div>

                        {/* Actors Section */}
                        <div className={cx('actors-section')}>
                            <h3 className={cx('section-title')}>Diễn viên</h3>
                            <div className={cx('actors-grid')}>
                                {movie.actors?.slice(0, 7).map((actor, index) => (
                                    <Link to={`/actor/${actor.id}`} key={index} className={cx('actor-card')}>
                                        <img
                                            src={actor.avatar || '/api/placeholder/60/60'}
                                            alt={actor.name}
                                            className={cx('actor-avatar')}
                                        />
                                        <span className={cx('actor-name')}>{actor.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations Section */}
                        <div className={cx('recommendations-section')}>
                            <h3 className={cx('section-title')}>Đề xuất cho bạn</h3>
                            <div className={cx('recommendations-list')}>
                                {relatedMovies?.slice(0, 6).map((relatedMovie, index) => (
                                    <div key={index} className={cx('recommendation-item')}>
                                        <img
                                            src={relatedMovie.thumbnail || '/api/placeholder/60/80'}
                                            alt={relatedMovie.title}
                                            className={cx('recommendation-poster')}
                                        />
                                        <div className={cx('recommendation-info')}>
                                            <h4 className={cx('recommendation-title')}>{relatedMovie.title}</h4>
                                            <p className={cx('recommendation-subtitle')}>
                                                {relatedMovie.originalTitle}
                                            </p>
                                            <div className={cx('recommendation-meta')}>
                                                <span className={cx('recommendation-episodes')}>
                                                    Tập {relatedMovie.episodes.length || 1}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {showRatingModal && (
                <RatingModal
                    isOpen={showRatingModal}
                    onClose={() => setShowRatingModal(false)}
                    movieTitle={movie.title}
                    averageRating={movie.averageRating}
                    ratingCount={movie.ratingCount}
                    currentRating={0}
                    onSubmitRating={handleSubmitRating}
                    userRating={userRating}
                />
            )}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
};

export default MoviePlayerPage;
