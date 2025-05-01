import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { faSearch, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { LoaderCircle } from 'lucide-react';
import MovieItem from '@/components/MovieItem';
import { Wrapper as PopperWrapper } from '@/components/Wrapper';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef();
    const searchContainerRef = useRef();

    useEffect(() => {
        if (!searchValue.trim()) {
            setSearchResult([]);
            return;
        }

        setLoading(true);

        const timeoutId = setTimeout(() => {
            setSearchResult([1, 2, 3]);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [searchValue]);

    useEffect(() => {
        if (!isExpanded) {
            setShowResult(false);
        } else if (isInputFocused && searchResult.length > 0) {
            setShowResult(true);
        }
    }, [isExpanded, isInputFocused, searchResult.length]);

    const handleClickOutside = () => {
        setShowResult(false);
        if (!isInputFocused) {
            setIsExpanded(false);
        }
    };

    const handleMouseEnter = () => {
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        if (!isInputFocused) {
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
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current?.focus();
    };

    return (
        <div className={cx('search-wrapper')} ref={searchContainerRef}>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={cx('search-container')}>
                {!isExpanded && (
                    <button className={cx('search-button')}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                )}

                <HeadlessTippy
                    interactive
                    visible={showResult && searchResult.length > 0}
                    render={(attrs) => (
                        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                            <PopperWrapper>
                                <h3 className={cx('search-title')}>Movies</h3>
                                {searchResult.map((_, index) => (
                                    <MovieItem key={index} />
                                ))}
                            </PopperWrapper>
                        </div>
                    )}
                    onClickOutside={handleClickOutside}
                >
                    <div className={cx('search', { active: isExpanded })}>
                        <input
                            ref={inputRef}
                            value={searchValue}
                            type="text"
                            placeholder="Tìm kiếm những nội dung hấp dẫn..."
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        {!loading && !!searchValue && (
                            <button className={cx('clear')} onClick={handleClearSearch}>
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                        )}

                        {loading && <LoaderCircle size={16} className={cx('search-loading')} />}

                        <button className={cx('search-button-inside')} type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </HeadlessTippy>
            </div>
        </div>
    );
}

export default Search;
