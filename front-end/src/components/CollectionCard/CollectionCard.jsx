import React from 'react';
import classNames from 'classnames/bind';
import styles from './CollectionCard.module.scss';
import MovieCard from '@/components/MovieCard';
import { Star, Film, ChevronRight, Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function CollectionCard({ collection, onMovieClick, className }) {
    const handleMovieClick = (movie) => {
        if (onMovieClick) {
            onMovieClick(movie);
        }
    };

    return (
        <div className={cx('collection-card', className)}>
            {/* Collection Header */}
            <div className={cx('collection-header')}>
                <div className={cx('title-row')}>
                    <h3 className={cx('collection-title')}>{collection.title}</h3>
                    {collection.confidence && (
                        <div className={cx('confidence-badge')}>
                            <Star className={cx('confidence-icon')} />
                            <span>{collection.confidence}%</span>
                        </div>
                    )}
                </div>

                <p className={cx('collection-description')}>{collection.description}</p>

                {collection.reason && (
                    <div className={cx('collection-reason')}>
                        <Sparkles className={cx('reason-icon')} />
                        <span>{collection.reason}</span>
                    </div>
                )}
            </div>

            {/* Movie Count Info */}
            <div className={cx('movie-info')}>
                <div className={cx('movie-count')}>
                    <Film className={cx('count-icon')} />
                    <span>{collection.movieCount || collection.movies?.length || 0} bộ phim</span>
                </div>
                <ChevronRight className={cx('arrow-icon')} />
            </div>

            {/* Movies Grid */}
            {collection.movies && collection.movies.length > 0 && (
                <div className={cx('movies-grid')}>
                    {collection.movies.map((movie, index) => (
                        <div key={index} className={cx('movie-wrapper')}>
                            <MovieCard movie={movie} onClick={() => handleMovieClick(movie)} />
                            {/* Movie Additional Info */}
                            <div className={cx('movie-extra-info')}>
                                {movie.genres && (
                                    <div className={cx('genre-tags')}>
                                        {movie.genres.slice(0, 2).map((genre, idx) => (
                                            <span key={idx} className={cx('genre-tag')}>
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {movie.releaseYear && <span className={cx('release-year')}>{movie.releaseYear}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {(!collection.movies || collection.movies.length === 0) && (
                <div className={cx('empty-movies')}>
                    <Film className={cx('empty-icon')} />
                    <p>Không tìm thấy phim phù hợp</p>
                </div>
            )}
        </div>
    );
}

CollectionCard.propTypes = {
    collection: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        reason: PropTypes.string,
        confidence: PropTypes.number,
        movies: PropTypes.array,
        movieCount: PropTypes.number,
    }).isRequired,
    onMovieClick: PropTypes.func,
    className: PropTypes.string,
};

export default CollectionCard;
