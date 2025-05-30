import React, { useState, useEffect, useRef } from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Banner.scss';
import { fetchBannerMoviesAPI } from '@/apis';
import Button from '../Button';

function Banner() {
    const sliderRef = useRef(null);

    const [movies, setMovies] = useState([]);
    const fetchBannerFilm = async () => {
        try {
            const response = await fetchBannerMoviesAPI();
            if (response && response.code === 1000) {
                const data = response.result?.content || response.result || [];
                setMovies(data);
            }
        } catch (e) {
            console.log('Error when fetch video banner: ', e);
        }
    };

    useEffect(() => {
        fetchBannerFilm();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                sliderRef.current.slickPrev();
            } else if (event.key === 'ArrowRight') {
                sliderRef.current.slickNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: movies.length === 0 ? null : <NextArrow />,
        prevArrow: movies.length === 0 ? null : <PrevArrow />,
    };

    return (
        <div className="banner">
            <Slider ref={sliderRef} {...settings}>
                {movies &&
                    movies.length > 0 &&
                    movies.map((movie, index) => (
                        <div className="banner-slide" key={movie.id || index}>
                            <img
                                src={movie?.backdrop || movie?.thumbnail}
                                alt={`Banner ${index + 1}`}
                                className="banner-image"
                            />
                            <div className="banner-content">
                                <h2 className="banner-title">{movie?.title}</h2>
                                <p className="banner-description">{movie?.originalTitle}</p>
                                <Button to={`watch/${movie.id}`} secondary>
                                    Xem phim
                                </Button>
                            </div>
                        </div>
                    ))}
            </Slider>
        </div>
    );
}

function NextArrow(props) {
    const { onClick } = props;
    return (
        <button className="custom-arrow custom-next" onClick={onClick}>
            &#8250;
        </button>
    );
}

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button className="custom-arrow custom-prev" onClick={onClick}>
            &#8249;
        </button>
    );
}

export default Banner;
