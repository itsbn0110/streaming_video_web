import React, { useState } from "react";
import { FaPlay, FaStar } from "react-icons/fa";
import styles from "./BannerChieuPhim.module.css"; 
import img1 from '../../assets/th.jpg';
import img2 from '../../assets/th2.jpg';
import img3 from '../../assets/Duty.jpg';
import img4 from '../../assets/logo.webp';
import img5 from '../../assets/vite.svg';

const BannerChieuPhim = () => {
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([
        { user: "Siu Nhân Gao", text: "Phim rất hay!", rating: 5 },
    ]);

    const handleCommentSubmit = () => {
        if (comment.trim() !== "") {
        setComments([...comments, { user: "Bạn", text: comment, rating: 5 }]);
        setComment("");
        }
    };

    return (
    <div className={styles.container}>
        {/* Video Section */}
        <div className={styles.video}>
            <img
                src={img1}
                alt="Dragon Ball Super Movie: Broly scene"
            />
            <button className={styles.playButton}>
                <FaPlay />
            </button>

            {/* Progress Bar (luôn hiển thị) */}
            <div className={styles.progressBar}>
                <div className={styles.progress}></div>
            </div>

            {/* Video Controls */}
            <div className={styles.videoControls}>
                {/* Control Buttons */}
                <div className={styles.controlButtons}>
                {/* Left-side controls */}
                    <div className={styles.controlButtonsLeft}>
                        <button className={styles.controlButton}>
                        <FaPlay /> {/* Play/Pause Icon */}
                        </button>
                        <button className={styles.controlButton}>
                        <i className="fas fa-backward"></i> {/* Rewind Icon */}
                        </button>
                        <button className={styles.controlButton}>
                        <i className="fas fa-forward"></i> {/* Forward Icon */}
                        </button>
                        <button className={styles.controlButton}>
                        <i className="fas fa-volume-up"></i> {/* Volume Icon */}
                        </button>
                    </div>

                    {/* Right-side controls */}
                    <div className={styles.controlButtonsRight}>
                        <button className={styles.controlButton}>
                        <i className="fas fa-cog"></i> {/* Settings Icon */}
                        </button>
                        <button className={styles.controlButton}>
                        <i className="fas fa-expand"></i> {/* Fullscreen Icon */}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Movie Title and Rating */}
        <div className={styles.movieInfo}>
            <h1 className={styles.movieTitle}>Dragon Ball Super Movie: Broly</h1>
            <p className={styles.movieDescription}>
            Bảy Viên Ngọc Rồng Siêu Cấp: Huyền Thoại Broly (2018)
            </p>
            <div className={styles.rating}>
            {[...Array(4)].map((_, i) => (
                <FaStar key={i} className={`${styles.star} ${styles.starFilled}`} />
            ))}
            <FaStar className={`${styles.star} ${styles.starEmpty}`} />
            </div>
        </div>

        {/* Episode List */}
        <div className={styles.episodeSection}>
            <div>
                <p>Danh sách tập</p>
                <div className={styles.episodeList}>
                    {[...Array(10)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedEpisode(i + 1)}
                        className={`${styles.episodeButton} ${
                        selectedEpisode === i + 1 ? styles.episodeButtonActive : ""
                        }`}
                    >
                        {i + 1}
                    </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Movie Description */}
        <div className={styles.movieDescriptionSection}>
            <img
            src={img2}
            alt="Dragon Ball Super Movie: Broly poster"
            className={styles.moviePoster}
            />
            <div>
                <h2 className={styles.movieDetailsTitle}>
                    Dragon Ball Super Movie: Broly
                </h2>
                <p className={styles.movieDetailsDescription}>
                    Bảy Viên Ngọc Rồng Siêu Cấp: Huyền Thoại Broly (2018)
                </p>
                <p>
                Chào mừng bạn đến với trang web MoonPlay - nơi bạn có thể khám phá thế giới tuyệt vời của điện ảnh và trải nghiệm những bộ phim đẹp và đầy cảm xúc. Với một thư viện phong phú chứa đựng hàng ngàn tác phẩm từ mọi thể loại, chúng tôi mang đến cho bạn những giờ phút thư giãn và hứng khởi. Cốt truyện của "Bảy Viên Ngọc Rồng" xoay quanh việc tìm kiếm và thu thập bảy viên ngọc rồng. Mỗi viên ngọc có khả năng...
                </p>
            </div>
        </div>

        {/* Comments Section */}
        <div className={styles.commentsSection}>
            <p>{comments.length} bình luận</p>
            <div className={styles.commentInputSection}>
                <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className={styles.commentInput}
                />
                <button
                onClick={handleCommentSubmit}
                className={styles.commentSubmitButton}
                >
                Gửi
                </button>
            </div>
            {comments.map((c, i) => (
                <div key={i} className={styles.comment}>
                    {/* Avatar */}
                    <img
                        src={`https://i.pravatar.cc/40?img=${i + 1}`} // Avatar giả lập
                        alt="Avatar"
                        className={styles.commentAvatar}
                    />
                    <div className={styles.commentContent}>
                        {/* Tên người dùng và đánh giá */}
                        <div className={styles.commentHeader}>
                            <p className={styles.commentUser}>
                                {c.user}
                                <span className={styles.commentRating}>
                                {[...Array(c.rating)].map((_, i) => (
                                    <FaStar key={i} className={styles.star} />
                                ))}
                                </span>
                            </p>
                        </div>
                        {/* Nội dung bình luận */}
                        <p className={styles.commentText}>{c.text}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Recommendations Section */}
        <div className={styles.recommendationsSection}>
            <p>Có thể bạn muốn xem</p>
            <div className={styles.recommendationsList}>
                {[img1, img2, img3, img4, img5, ].map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt={`Movie recommendation ${i + 1}`}
                    className={styles.recommendationImage}
                />
                ))}
            </div>
        </div>
    </div>
    );
};

export default BannerChieuPhim;