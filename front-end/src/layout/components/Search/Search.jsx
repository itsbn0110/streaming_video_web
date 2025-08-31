import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { faSearch, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMoviesByKeywordAPI } from '@/apis';
import MovieItem from '@/components/MovieItem';
import { Wrapper as PopperWrapper } from '@/components/Wrapper';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

const Search = React.forwardRef((props, ref) => {
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef();
    const resultItemsRef = useRef([]);
    const navigate = useNavigate();
    const isMobileOrTablet = useRef(window.innerWidth < 1010);

    // Check screen size on window resize
    useEffect(() => {
        const handleResize = () => {
            isMobileOrTablet.current = window.innerWidth < 1010;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const normalizeKeyword = (keyword) => {
        return keyword
            ? keyword
                  .normalize('NFD')
                  .replace(/\p{Diacritic}/gu, '')
                  .toLowerCase()
            : '';
    };

    useEffect(() => {
        if (searchValue.trim().length < 1) {
            setSearchResult([]);
            return;
        }
        setLoading(true);
        setActiveIndex(-1);
        const timeoutId = setTimeout(async () => {
            try {
                // Normalize the search value
                const normalizedSearchValue = normalizeKeyword(searchValue.trim());
                const encodedSearchValue = encodeURIComponent(normalizedSearchValue);
                const res = await fetchMoviesByKeywordAPI(encodedSearchValue, 0, 10);
                const results = res?.result?.content || res?.result || [];
                setSearchResult(Array.isArray(results) ? results.slice(0, 10) : []);
            } catch {
                setSearchResult([]);
            }
            setLoading(false);
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [searchValue]);

    useEffect(() => {
        if (!isExpanded) {
            setShowResult(false);
            setActiveIndex(-1);
        } else if (isInputFocused && searchResult.length > 0) {
            setShowResult(true);
        }
    }, [isExpanded, isInputFocused, searchResult.length]);

    useEffect(() => {
        resultItemsRef.current = resultItemsRef.current.slice(0, searchResult.length);
    }, [searchResult]);

    const handleClickOutside = () => {
        setShowResult(false);
    };

    const handleSearchToggle = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    };

    const handleMouseEnter = () => {
        if (!isMobileOrTablet.current) {
            setIsExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobileOrTablet.current && !isInputFocused && !searchValue.trim()) {
            setIsExpanded(false);
            setShowResult(false);
        }
    };

    const handleInputFocus = () => {
        setIsInputFocused(true);
        if (searchResult.length > 0) {
            setShowResult(true);
        }
    };

    const handleInputBlur = () => {
        setIsInputFocused(false);
        if (!searchValue.trim()) {
            setIsExpanded(false);
        }
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current?.focus();
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movies/${movieId}`);
        setShowResult(false);
        setActiveIndex(-1);
        if (isMobileOrTablet.current) {
            setIsExpanded(false);
        }
    };

    const handleKeyDown = useCallback(
        (e) => {
            if (!showResult || searchResult.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setActiveIndex((prev) => {
                        const newIndex = prev < searchResult.length - 1 ? prev + 1 : 0;
                        if (resultItemsRef.current[newIndex]) {
                            resultItemsRef.current[newIndex].scrollIntoView({ block: 'nearest' });
                        }
                        return newIndex;
                    });
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    setActiveIndex((prev) => {
                        const newIndex = prev > 0 ? prev - 1 : searchResult.length - 1;
                        if (resultItemsRef.current[newIndex]) {
                            resultItemsRef.current[newIndex].scrollIntoView({ block: 'nearest' });
                        }
                        return newIndex;
                    });
                    break;

                case 'Enter':
                    if (activeIndex >= 0 && activeIndex < searchResult.length) {
                        e.preventDefault();
                        const selectedMovie = searchResult[activeIndex];
                        navigate(`/movies/${selectedMovie.id}`);
                        setShowResult(false);
                        setActiveIndex(-1);
                        // Close search on mobile/tablet when submitting
                        if (isMobileOrTablet.current) {
                            setIsExpanded(false);
                        }
                    }
                    break;

                case 'Escape':
                    setShowResult(false);
                    setActiveIndex(-1);
                    // Close search on mobile/tablet when pressing Escape
                    if (isMobileOrTablet.current) {
                        setIsExpanded(false);
                    }
                    break;

                default:
                    break;
            }
        },
        [activeIndex, navigate, searchResult, showResult],
    );

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchValue.trim())}`);
            setShowResult(false);
            setActiveIndex(-1);
            if (isMobileOrTablet.current) {
                setIsExpanded(false);
            }
        }
    };

    return (
        <div className={cx('search-wrapper')} ref={ref}>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={cx('search-container')}>
                {!isExpanded && (
                    <button className={cx('search-button')} onClick={handleSearchToggle}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                )}

                <HeadlessTippy
                    interactive
                    visible={showResult && searchResult.length > 0}
                    placement="top"
                    offset={[0, -1]}
                    render={(attrs) => (
                        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                            <PopperWrapper>
                                <h3 className={cx('search-title')}>Movies</h3>
                                <div
                                    style={{
                                        maxHeight: 400,
                                        overflowY: 'auto',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#888 #222',
                                    }}
                                >
                                    {searchResult.map((movie, index) => {
                                        if (!movie || typeof movie !== 'object' || !movie.id) {
                                            console.error('Invalid movie object:', movie);
                                            return null;
                                        }
                                        return (
                                            <div
                                                ref={(el) => (resultItemsRef.current[index] = el)}
                                                className={cx('result-item-wrapper', { active: index === activeIndex })}
                                                key={movie.id || index}
                                                onMouseEnter={() => setActiveIndex(index)}
                                                onClick={() => handleMovieClick(movie.id)}
                                            >
                                                <MovieItem
                                                    data={movie}
                                                    handleCloseSearch={() => handleMovieClick(movie.id)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </PopperWrapper>
                        </div>
                    )}
                    onClickOutside={handleClickOutside}
                >
                    <form className={cx('search', { active: isExpanded })} onSubmit={handleSearchSubmit}>
                        <input
                            ref={inputRef}
                            value={searchValue}
                            type="text"
                            placeholder="Tìm kiếm những nội dung hấp dẫn..."
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                        />

                        {!loading && !!searchValue && (
                            <button className={cx('clear')} onClick={handleClearSearch} type="button">
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                        )}

                        {loading && <LoaderCircle size={16} className={cx('search-loading')} />}

                        <button className={cx('search-button-inside')} type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                </HeadlessTippy>
            </div>
        </div>
    );
});

export default Search;
