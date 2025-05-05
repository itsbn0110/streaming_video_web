import React, { useState, useCallback, useRef, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import styles from './ActorSection.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function ActorSection({ movie }) {
    const sliderActorRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    const checkScrollPosition = useCallback(() => {
        if (!sliderActorRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = sliderActorRef.current;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }, []);

    const scrollLeft = useCallback(() => {
        if (!sliderActorRef.current) return;
        sliderActorRef.current.scrollBy({ left: -635, behavior: 'smooth' });
        setTimeout(checkScrollPosition, 300);
    }, [checkScrollPosition]);

    const scrollRight = useCallback(() => {
        if (!sliderActorRef.current) return;
        sliderActorRef.current.scrollBy({ left: 635, behavior: 'smooth' });
        setTimeout(checkScrollPosition, 300);
    }, [checkScrollPosition]);

    useEffect(() => {
        if (movie.actors && movie.actors.length > 0 && sliderActorRef.current) {
            setTimeout(checkScrollPosition, 100);
        }
    }, [movie.actors, checkScrollPosition]);

    useEffect(() => {
        const slider = sliderActorRef.current;
        if (slider) {
            slider.addEventListener('scroll', checkScrollPosition);
            return () => {
                slider.removeEventListener('scroll', checkScrollPosition);
            };
        }
    }, [checkScrollPosition]);

    if (!movie.actors || movie.actors.length === 0) {
        return <div className={cx('noActors')}>Không có thông tin diễn viên</div>;
    }

    console.log(movie);
    return (
        <div className={cx('actorSection')}>
            <div className={cx('actor-wrapper')}>
                <span className={cx('actorLabel')}>Diễn viên</span>
                <div className={cx('slider-controls')}>
                    <button
                        className={cx('slider-button-left', 'slider-property', {
                            'show-left': showLeftButton,
                        })}
                        onClick={scrollLeft}
                        aria-label="Scroll left"
                    >
                        {' '}
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    <button
                        className={cx('slider-button-right', 'slider-property', {
                            'show-right': showRightButton,
                        })}
                        onClick={scrollRight}
                        aria-label="Scroll right"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>
            <div className={cx('slider-container')}>
                <div className={cx('slider')} ref={sliderActorRef}>
                    {movie.actors.map((actor, index) => (
                        <Link to={`/actor/${actor.id}`} key={actor.id || index} className={cx('actor-item')}>
                            <img src={actor.avatar} alt={actor.name || 'Actor'} />
                            <p>{actor.name}</p>
                            <div className={cx('overlay')}></div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ActorSection;
