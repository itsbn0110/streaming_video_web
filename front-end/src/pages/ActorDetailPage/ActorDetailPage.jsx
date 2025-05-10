import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPersonDataAPI } from '@/apis';
import styles from './ActorDetailPage.module.scss';
import classNames from 'classnames/bind';
import MovieCard from '@/components/MovieCard';

const cx = classNames.bind(styles);

function ActorDetailPage() {
    const { id } = useParams();
    const [actor, setActor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        fetchPersonDataAPI(id)
            .then((res) => {
                setActor(res.result);
            })
            .catch(() => setError('Không thể tải thông tin diễn viên.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className={cx('loading')}>Đang tải...</div>;
    if (error) return <div className={cx('error-message')}>{error}</div>;
    if (!actor) return null;

    return (
        <div className={cx('actor-detail-page')}>
            <div className={cx('actor-container')}>
                <div className={cx('actor-left')}>
                    <img src={actor.avatar} alt={actor.name} className={cx('actor-avatar')} />
                    <div className={cx('actor-info-box')}>
                        <h3 className={cx('actor-info-title')}>Thông tin cá nhân</h3>
                        <div className={cx('actor-info-row')}>
                            <strong>Nghề nghiệp</strong>
                            <div>{actor.role === 'Actor' ? 'Diễn Viên' : 'Đạo diễn'}</div>
                        </div>
                        <div className={cx('actor-info-row')}>
                            <strong>Giới tính</strong>
                            <div>{actor.gender || 'Không rõ'}</div>
                        </div>
                        <div className={cx('actor-info-row')}>
                            <strong>Ngày sinh</strong>
                            <div>{actor.birthDate || '9/23/1978'}</div>
                        </div>
                        <div className={cx('actor-info-row')}>
                            <strong>Nơi sinh</strong>
                            <div>{actor.placeOfBirth || 'Không rõ'}</div>
                        </div>
                    </div>
                </div>
                <div className={cx('actor-right')}>
                    <h1 className={cx('actor-name')}>{actor.name || 'Anthony Mackie'}</h1>
                    <h2 className={cx('actor-bio-title')}>Tiểu sử</h2>
                    <div className={cx('actor-bio')}>
                        {actor.biography ||
                            "Anthony Mackie (sinh ngày 23 tháng 9 năm 1979) là một diễn viên người Mỹ. Anh ấy đã được đặc trưng trong các bộ phim truyện, phim truyền hình và các vở kịch Broadway và Off-Broadway, bao gồm Black bottom của Ma Rainey, Drowning Crow, McReele, A Soldier's Play, và Talk, bởi Carl Hancock Rux, mà anh ấy đã giành được giải thưởng Obie năm 2002."}
                    </div>
                    <h2 className={cx('actor-movie-title')}>Các phim đã tham gia</h2>
                    <div className={cx('actor-movie-list')}>
                        {actor.actedMovies &&
                            actor.actedMovies.length > 0 &&
                            actor.actedMovies.map((movie) => <MovieCard key={movie.id} movie={movie} isPerson />)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActorDetailPage;
