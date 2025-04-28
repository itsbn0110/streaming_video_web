import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { faSearch, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { LoaderCircle } from 'lucide-react';

import MovieItem from '@/components/MovieItem';
import { Wrapper as PopperWrapper } from '@/components/Wrapper';
const cx = classNames.bind(styles);
import styles from './Search.module.scss';
function Search() {
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        if (!searchValue) {
            setSearchResult([]);
            return;
        }
        setLoading(true);
        setShowResult(true);
        setTimeout(() => {
            setSearchResult([1, 2, 3]);
            setLoading(false);
        }, 3000);
    }, [searchValue]);

    const handleClickOutSide = () => {
        setShowResult(false);
        setShowSearchBar(false);
    };

    const handleShowSearchBar = () => {
        setShowSearchBar(true);
        setTimeout(() => {
            inputRef.current && inputRef.current.focus();
        }, 200);
    };

    return (
        <div className={cx('search-wrapper')}>
            {!showSearchBar && (
                <button className={cx('search-button')} onClick={handleShowSearchBar}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            )}
            {showSearchBar && (
                <HeadlessTippy
                    interactive
                    visible={showResult && searchResult.length > 0}
                    render={(attrs) => (
                        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                            <PopperWrapper>
                                <h3 className={cx('search-title')}>Movies</h3>
                                <MovieItem />
                                <MovieItem />
                                <MovieItem />
                            </PopperWrapper>
                        </div>
                    )}
                    onClickOutside={handleClickOutSide}
                >
                    <div className={cx('search')}>
                        <input
                            ref={inputRef}
                            value={searchValue}
                            type="text"
                            placeholder="Tìm kiếm những nội dung hấp dẫn..."
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setShowResult(true)}
                        />

                        {!loading && !!searchValue && (
                            <button
                                className={cx('clear')}
                                onClick={() => {
                                    setSearchValue('');
                                    setSearchResult([]);
                                    inputRef.current.focus();
                                }}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                        )}
                        {loading && <LoaderCircle size={16} className={cx('search-loading')} />}

                        <button className={cx('search-button')} type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </HeadlessTippy>
            )}
        </div>
    );
}

export default Search;
