import classNames from 'classnames/bind';
import styles from './MovieItem.module.scss';
const cx = classNames.bind(styles);
import images from '@/assets/images';

function MovieItem({ data, handleCloseSearch }) {
    return (
        <div onClick={handleCloseSearch} className={cx('wrapper')}>
            <img src={data?.thumbnail || images.noImage} alt={data?.title || 'movie'} className={cx('movie-image')} />
            <div className={cx('movie-info')}>
                <h3 className={cx('movie-title')}>{data?.title || 'No title'}</h3>
                <p className={cx('movie-original-title')}>{data?.originalTitle || ''}</p>
                {data?.episodes && data?.episodes.length > 0 && (
                    <p className={cx('movie-episodes')}>
                        {Array.isArray(data.episodes) ? data.episodes.length : '0'} Tập
                    </p>
                )}
            </div>
        </div>
    );
}

export default MovieItem;
