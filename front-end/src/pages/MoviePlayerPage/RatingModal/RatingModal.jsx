import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './RatingModal.module.scss';
const cx = classNames.bind(styles);
import { X, Star } from 'lucide-react';
import Tippy from '@tippyjs/react';
export const RatingModal = ({
    isOpen,
    onClose,
    movieTitle,
    currentRating = 0,
    onSubmitRating,
    ratingCount,
    averageRating,
    userRating,
}) => {
    const [selectedRating, setSelectedRating] = useState(currentRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    console.log('hello mount rating modal');
    const handleSubmit = () => {
        if (selectedRating > 0) {
            onSubmitRating(selectedRating, comment);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={cx('modal-overlay')}>
            <div className={cx('rating-modal')}>
                <div className={cx('modal-header')}>
                    <h3>{movieTitle}</h3>
                    <button onClick={onClose} className={cx('close-btn')}>
                        <X size={24} />
                    </button>
                </div>

                <div className={cx('current-rating-display')}>
                    <div className={cx('rating-info')}>
                        <Star size={20} fill="#fbbf24" color="#fbbf24" />
                        <span>{averageRating}</span>
                        <span>/ {ratingCount} lượt đánh giá</span>
                    </div>
                </div>

                <div className={cx('star-rating')}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={cx('star-button')}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setSelectedRating(star)}
                        >
                            <Star
                                size={40}
                                fill={(hoverRating || selectedRating) >= star ? '#dc2626' : 'transparent'}
                                color="#dc2626"
                            />
                        </button>
                    ))}
                </div>

                <div className={cx('modal-comment')}>
                    <textarea
                        placeholder="Viết nhận xét về phim (tùy chọn)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className={cx('modal-actions')}>
                    <Tippy
                        content={userRating ? 'Bạn đã đánh giá bộ phim này rồi' : ''}
                        disabled={!userRating}
                        placement="top"
                    >
                        <div>
                            <button
                                onClick={handleSubmit}
                                disabled={selectedRating === 0 || !!userRating}
                                className={cx('submit-rating-btn')}
                            >
                                Gửi đánh giá
                            </button>
                        </div>
                    </Tippy>
                    <button onClick={onClose} className={cx('cancel-btn')}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
