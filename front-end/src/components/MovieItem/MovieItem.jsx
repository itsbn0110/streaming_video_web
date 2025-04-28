import classNames from 'classnames/bind';
import styles from './MovieItem.module.scss';
const cx = classNames.bind(styles);
import images from '@/assets/images';
function MovieItem() {
    return (
        <div className={cx('wrapper')}>
            <img src={images.mickey17} alt="movie" className={cx('movie-image')} />
            <div className={cx('movie-info')}>
                <h3 className={cx('movie-title')}>Mickey 17</h3>
                <p className={cx('movie-original-title')}> Original title </p>
                <p className={cx('movie-episodes')}> 6/6</p>
            </div>
        </div>
    );
}

export default MovieItem;
