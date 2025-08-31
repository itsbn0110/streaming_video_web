import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './AiSuggestionsPage.module.scss';
import MovieCard from '@/components/MovieCard';
import { fetchUserProfileAPI, fetchMoodRecommendationsAPI, getLuckyPickAPI } from '@/apis';
import {
    Sparkles,
    Brain,
    Heart,
    MessageCircle,
    TrendingUp,
    Shuffle,
    BarChart3,
    Clock,
    Star,
    User,
    Wand2,
    Target,
    Coffee,
    Moon,
    Sun,
    Sunset,
    Send,
    Loader,
    Film,
} from 'lucide-react';

const cx = classNames.bind(styles);

function AiSuggestionsPage() {
    const [movieCollections, setMovieCollections] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLuckyLoading, setIsLuckyLoading] = useState(false);
    const [showChatBox, setShowChatBox] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [luckyPick, setLuckyPick] = useState(null);
    const [selectedMoodTag, setSelectedMoodTag] = useState('');

    // Mood tags for quick selection
    const moodTags = [
        { label: 'Vui vẻ', value: 'happy', icon: '😊', color: '#ffd93d' },
        { label: 'Buồn', value: 'sad', icon: '😢', color: '#6c5ce7' },
        { label: 'Căng thẳng', value: 'stressed', icon: '😰', color: '#fd79a8' },
        { label: 'Chán', value: 'bored', icon: '😴', color: '#74b9ff' },
        { label: 'Lãng mạn', value: 'romantic', icon: '💕', color: '#ff7675' },
        { label: 'Phấn khích', value: 'excited', icon: '🤩', color: '#00cec9' },
        { label: 'Thư giãn', value: 'relaxed', icon: '😌', color: '#81ecec' },
        { label: 'Hồi hộp', value: 'thrilled', value: 'thriller', icon: '😱', color: '#a29bfe' },
    ];

    // Calculate user stats from profile
    const calculateUserStats = useCallback((profile) => {
        if (!profile?.genreStats || !profile?.timeStats) return null;

        const { genreStats, timeStats } = profile;

        // Extract representative movieViews from the first entry of genreStats
        const movieViews = Object.values(genreStats)[0]?.movieViews || 0;

        const totalGenreViews = Object.values(genreStats).reduce((sum, stat) => sum + stat.totalViews, 0);
        const favoriteGenre = Object.keys(genreStats).reduce((a, b) =>
            genreStats[a].totalViews > genreStats[b].totalViews ? a : b,
        );

        // Determine favorite time slot based on total views
        const favoriteTime = Object.keys(timeStats).reduce((a, b) => (timeStats[a] > timeStats[b] ? a : b));

        // Calculate favoriteGenrePercent based on totalViews
        const favoriteGenrePercent = Math.round((genreStats[favoriteGenre].totalViews / totalGenreViews) * 100);
        const favoriteTimePercent = Math.round(
            (timeStats[favoriteTime] / Object.values(timeStats).reduce((sum, views) => sum + views, 0)) * 100,
        );

        return {
            movieViews,
            favoriteGenre,
            favoriteTime,
            favoriteGenrePercent,
            favoriteTimePercent,
            genreDiversity: Object.keys(genreStats).length,
            genreStats,
            timeStats,
        };
    }, []);

    // Fetch user profile
    const fetchUserProfile = useCallback(async () => {
        try {
            const profile = await fetchUserProfileAPI();
            if (profile) {
                const stats = calculateUserStats(profile);
                setUserStats(stats);
                return profile;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
        return null;
    }, [calculateUserStats]);

    // Fetch AI recommendations and integrate with collections
    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchMoodRecommendationsAPI(); // Using the API helper from index.js
            console.log('check data:', data);
            if (data.code === 1000 && Array.isArray(data)) {
                setMovieCollections(data);
            } else {
                console.error('Unexpected API response:', data);
                setMovieCollections([]);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setMovieCollections([]);
        } finally {
            setIsLoading(false);
        }
    }, []);
    console.log('collection: ', movieCollections);
    // Handle lucky pick
    const handleLuckyPick = async () => {
        setIsLuckyLoading(true);
        try {
            const pick = await getLuckyPickAPI();
            console.log('Lucky pick:', pick);
            setLuckyPick(pick);
        } catch (error) {
            console.error('Error getting lucky pick:', error);
        } finally {
            setIsLuckyLoading(false);
        }
    };

    // Handle mood tag selection
    const handleMoodTag = async (moodValue) => {
        setSelectedMoodTag(moodValue);
        await fetchRecommendations(moodValue);
    };

    // Handle chat message
    const handleSendMessage = async () => {
        if (!currentMessage.trim()) return;

        const userMessage = { type: 'user', content: currentMessage };
        setChatMessages((prev) => [...prev, userMessage]);

        try {
            const collections = await fetchMoodRecommendationsAPI(currentMessage);

            const aiMessage = {
                type: 'ai',
                content: `Tôi hiểu tâm trạng "${currentMessage}" của bạn! Đã tạo ${collections.length} bộ sưu tập phù hợp.`,
            };
            setChatMessages((prev) => [...prev, aiMessage]);

            if (Array.isArray(collections)) {
                setMovieCollections(collections);
            }
        } catch (error) {
            console.log(error);
            const errorMessage = {
                type: 'ai',
                content: 'Xin lỗi, có lỗi xảy ra. Hãy thử lại!',
            };
            setChatMessages((prev) => [...prev, errorMessage]);
        }

        setCurrentMessage('');
    };

    // Helper functions for UI display
    const getThemeIcon = (theme) => {
        switch (theme) {
            case 'main_interest':
                return <Target className={cx('theme-icon')} />;
            case 'discovery':
                return <Sparkles className={cx('theme-icon')} />;
            case 'mood_based':
                return <Heart className={cx('theme-icon')} />;
            case 'seasonal':
                return <TrendingUp className={cx('theme-icon')} />;
            default:
                return <Film className={cx('theme-icon')} />;
        }
    };

    const getThemeLabel = (theme) => {
        switch (theme) {
            case 'main_interest':
                return 'Sở thích chính';
            case 'discovery':
                return 'Khám phá';
            case 'mood_based':
                return 'Theo tâm trạng';
            case 'seasonal':
                return 'Thịnh hành';
            default:
                return 'Gợi ý';
        }
    };

    const getMoodLabel = (mood) => {
        switch (mood) {
            case 'relaxed':
                return 'thư giãn';
            case 'excited':
                return 'phấn khích';
            case 'thoughtful':
                return 'suy ngẫm';
            case 'entertainment':
                return 'giải trí';
            case 'intense':
                return 'căng thẳng';
            case 'social':
                return 'theo xu hướng';
            default:
                return mood;
        }
    };
    const handleMovieClick = async (movie) => {
        try {
            // Track view if movie has genre info
            if (movie.genres && movie.genres.length > 0) {
                console.log('Tracking view for movie:', movie.title);
                // Note: Implement genre name to ID mapping if needed
            }
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    };

    // Get time-based icon
    const getTimeIcon = () => {
        const hour = new Date().getHours();
        if (hour < 12) return <Sun className={cx('time-icon')} />;
        if (hour < 18) return <Coffee className={cx('time-icon')} />;
        if (hour < 22) return <Sunset className={cx('time-icon')} />;
        return <Moon className={cx('time-icon')} />;
    };

    // Initialize page
    useEffect(() => {
        const initialize = async () => {
            await fetchUserProfile();
            await fetchRecommendations();
        };
        initialize();
    }, [fetchUserProfile, fetchRecommendations]);
    // Render movie collections with reasons and enriched data
    const renderMovieCollections = () => {
        if (movieCollections.length === 0) {
            return (
                <div className={cx('empty-state')}>
                    <Sparkles className={cx('empty-icon')} />
                    <h3>Chưa có gợi ý nào</h3>
                    <p>Hãy ấn "Tạo Gợi Ý Mới" để AI tạo bộ sưu tập cho bạn!</p>
                </div>
            );
        }

        return (
            <div className={cx('collections-grid')}>
                {movieCollections.map((collection, index) => (
                    <div key={index} className={cx('collection-card')}>
                        <div className={cx('collection-header')}>
                            <h3 className={cx('collection-title')}>{collection.title}</h3>
                            {collection.confidence && (
                                <span className={cx('confidence-badge')}>
                                    <Star className={cx('confidence-icon')} />
                                    {collection.confidence}%
                                </span>
                            )}
                            <p className={cx('collection-description')}>{collection.description}</p>
                            {collection.reason && <p className={cx('collection-reason')}>💡 {collection.reason}</p>}
                        </div>

                        {/* Movies Grid */}
                        {collection.movies && collection.movies.length > 0 && (
                            <div className={cx('collection-movies')}>
                                {collection.movies.map((movie, movieIndex) => (
                                    <MovieCard
                                        key={`${index}-${movieIndex}`}
                                        movie={movie}
                                        onClick={() => handleMovieClick(movie)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={cx('ai-suggestions-page')}>
            {/* Hero Section */}
            <div className={cx('hero-section')}>
                <div className={cx('hero-content')}>
                    <div className={cx('hero-header')}>
                        <div className={cx('hero-icon')}>
                            <Brain className={cx('brain-icon')} />
                        </div>
                        <h1 className={cx('hero-title')}>
                            {getTimeIcon()}
                            AI Gợi Ý Phim Thông Minh
                        </h1>
                        <p className={cx('hero-subtitle')}>
                            {userStats
                                ? `Được cá nhân hóa từ ${userStats.movieViews} lượt xem và ${userStats.genreDiversity} thể loại yêu thích`
                                : 'AI đang học về sở thích phim của bạn'}
                        </p>
                    </div>

                    {/* User Stats Display */}
                    {userStats && (
                        <div className={cx('stats-display')}>
                            <div className={cx('stat-item')}>
                                <BarChart3 className={cx('stat-icon')} />
                                <div className={cx('stat-info')}>
                                    <span className={cx('stat-label')}>Thể loại yêu thích</span>
                                    <span className={cx('stat-value')}>
                                        {userStats.favoriteGenre} ({userStats.favoriteGenrePercent}%)
                                    </span>
                                </div>
                            </div>
                            <div className={cx('stat-item')}>
                                <Clock className={cx('stat-icon')} />
                                <div className={cx('stat-info')}>
                                    <span className={cx('stat-label')}>Thời gian xem</span>
                                    <span className={cx('stat-value')}>
                                        {userStats.favoriteTime} ({userStats.favoriteTimePercent}%)
                                    </span>
                                </div>
                            </div>
                            <div className={cx('stat-item')}>
                                <Film className={cx('stat-icon')} />
                                <div className={cx('stat-info')}>
                                    <span className={cx('stat-label')}>Tổng lượt xem</span>
                                    <span className={cx('stat-value')}>{userStats.movieViews}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className={cx('action-section')}>
                <div className={cx('container')}>
                    <div className={cx('action-grid')}>
                        {/* Generate Recommendations Button */}
                        <div className={cx('action-card')}>
                            <div className={cx('action-header')}>
                                <Wand2 className={cx('action-icon')} />
                                <h3>Tạo Bộ Sưu Tập Mới</h3>
                            </div>
                            <p>AI phân tích sở thích và tạo bộ sưu tập phim được cá nhân hóa</p>
                            <button
                                onClick={() => fetchRecommendations()}
                                className={cx('action-button', 'primary', { loading: isLoading })}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className={cx('loading-icon')} />
                                        AI đang phân tích...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className={cx('button-icon')} />
                                        Tạo Gợi Ý Mới
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Lucky Pick Button */}
                        <div className={cx('action-card')}>
                            <div className={cx('action-header')}>
                                <Target className={cx('action-icon')} />
                                <h3>Phim May Mắn</h3>
                            </div>
                            <p>Để AI chọn một bộ phim hoàn hảo cho thời điểm này</p>
                            <button
                                onClick={handleLuckyPick}
                                className={cx('action-button', 'secondary', { loading: isLuckyLoading })}
                                disabled={isLuckyLoading}
                            >
                                {isLuckyLoading ? (
                                    <>
                                        <Loader className={cx('loading-icon')} />
                                        Đang chọn...
                                    </>
                                ) : (
                                    <>
                                        <Shuffle className={cx('button-icon')} />
                                        Chọn Phim May Mắn
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Chat with AI Button */}
                        <div className={cx('action-card')}>
                            <div className={cx('action-header')}>
                                <MessageCircle className={cx('action-icon')} />
                                <h3>Chat Tâm Trạng</h3>
                            </div>
                            <p>Chia sẻ cảm xúc để nhận gợi ý phim phù hợp với tâm trạng</p>
                            <button onClick={() => setShowChatBox(true)} className={cx('action-button', 'accent')}>
                                <Heart className={cx('button-icon')} />
                                Bắt Đầu Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Mood Selection */}
            <div className={cx('mood-section')}>
                <div className={cx('container')}>
                    <h2 className={cx('section-title')}>
                        <Heart className={cx('section-icon')} />
                        Chọn Tâm Trạng Nhanh
                    </h2>
                    <div className={cx('mood-tags')}>
                        {moodTags.map((mood) => (
                            <button
                                key={mood.value}
                                onClick={() => handleMoodTag(mood.value)}
                                className={cx('mood-tag', { active: selectedMoodTag === mood.value })}
                                style={{ '--mood-color': mood.color }}
                            >
                                <span className={cx('mood-emoji')}>{mood.icon}</span>
                                <span className={cx('mood-label')}>{mood.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lucky Pick Display */}
            {luckyPick && (
                <div className={cx('lucky-pick-section')}>
                    <div className={cx('container')}>
                        <div className={cx('lucky-pick-card')}>
                            <div className={cx('lucky-header')}>
                                <Target className={cx('lucky-icon')} />
                                <h3>🎯 Phim May Mắn Của Bạn</h3>
                                <span className={cx('confidence-badge')}>{luckyPick.confidence}% phù hợp</span>
                            </div>

                            {luckyPick.found && luckyPick.movie ? (
                                <div className={cx('lucky-movie')}>
                                    <MovieCard
                                        movie={luckyPick.movie}
                                        onClick={() => handleMovieClick(luckyPick.movie)}
                                    />
                                    <div className={cx('lucky-details')}>
                                        <p className={cx('lucky-reason')}>💡 {luckyPick.reason}</p>
                                        <p className={cx('mood-match')}>🎭 {luckyPick.moodMatch}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={cx('lucky-not-found')}>
                                    <p>{luckyPick.message || 'Không tìm thấy phim phù hợp'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Movie Collections Display */}
            <div className={cx('collections-section')}>
                <div className={cx('container')}>
                    {movieCollections.length > 0 ? (
                        <>
                            <div className={cx('collections-header')}>
                                <TrendingUp className={cx('section-icon')} />
                                <h2 className={cx('section-title')}>Bộ Sưu Tập AI Tạo Riêng Cho Bạn</h2>
                                <p className={cx('section-subtitle')}>
                                    {isLoading
                                        ? 'AI đang phân tích...'
                                        : `${movieCollections.length} bộ sưu tập được tạo dựa trên sở thích của bạn`}
                                </p>
                            </div>

                            {renderMovieCollections()}
                        </>
                    ) : (
                        <div className={cx('empty-state')}>
                            <Sparkles className={cx('empty-icon')} />
                            <h3>Chưa có gợi ý nào</h3>
                            <p>Hãy ấn "Tạo Gợi Ý Mới" hoặc chọn tâm trạng để AI tạo bộ sưu tập cho bạn!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Modal */}
            {showChatBox && (
                <div className={cx('chat-overlay')} onClick={() => setShowChatBox(false)}>
                    <div className={cx('chat-modal')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('chat-header')}>
                            <MessageCircle className={cx('chat-header-icon')} />
                            <h3>Chat Tâm Trạng với AI</h3>
                            <button onClick={() => setShowChatBox(false)} className={cx('close-button')}>
                                ×
                            </button>
                        </div>

                        <div className={cx('chat-messages')}>
                            {chatMessages.length === 0 && (
                                <div className={cx('chat-welcome')}>
                                    <Sparkles className={cx('welcome-icon')} />
                                    <p>Xin chào! Hôm nay bạn cảm thấy thế nào?</p>
                                    <p>Chia sẻ tâm trạng để tôi gợi ý phim phù hợp nhé!</p>
                                </div>
                            )}

                            {chatMessages.map((message, index) => (
                                <div key={index} className={cx('chat-message', message.type)}>
                                    {message.type === 'ai' && <Sparkles className={cx('message-icon')} />}
                                    {message.type === 'user' && <User className={cx('message-icon')} />}
                                    <div className={cx('message-content')}>
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={cx('chat-input-area')}>
                            <div className={cx('chat-input')}>
                                <input
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    placeholder="Chia sẻ tâm trạng của bạn..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className={cx('message-input')}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!currentMessage.trim()}
                                    className={cx('send-button')}
                                >
                                    <Send className={cx('send-icon')} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className={cx('loading-overlay')}>
                    <div className={cx('loading-content')}>
                        <Sparkles className={cx('loading-icon')} />
                        <p>AI đang phân tích sở thích của bạn...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AiSuggestionsPage;
