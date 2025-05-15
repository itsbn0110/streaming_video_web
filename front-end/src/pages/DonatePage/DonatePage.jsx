import classNames from 'classnames/bind';
import styles from './DonatePage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot, faHeart } from '@fortawesome/free-solid-svg-icons';
import images from '@/assets/images';

const cx = classNames.bind(styles);

function DonatePage() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('header')}>
                    <h1 className={cx('header-title')}>
                        <FontAwesomeIcon icon={faHeart} className={cx('icon-heart')} />
                        Donate
                        <FontAwesomeIcon icon={faHeart} className={cx('icon-heart')} />
                    </h1>
                    <p className={cx('header-description')}>
                        Bạn có thể ủng hộ chúng mình 1 ly cà phê tại đây
                        <FontAwesomeIcon icon={faMugHot} className={cx('icon-coffee')} />
                    </p>
                    <div className={cx('divider')}></div>
                    <p className={cx('header-additional')}>
                        Chúng mình sẽ update thêm nhiều tính năng mới trong thời gian tới, hãy theo dõi chúng mình nhé!
                    </p>
                </div>

                <div className={cx('qr-container')}>
                    <div className={cx('qr-card')}>
                        <div className={cx('qr-code')}>
                            <img src={images.qrCode} alt="Donate QR Code" />
                        </div>
                        <div className={cx('qr-label')}>Quét mã để ủng hộ</div>
                    </div>
                </div>

                <div className={cx('thank-you')}>
                    <p>Cảm ơn bạn đã ủng hộ và đồng hành cùng ITLU!</p>
                </div>
            </div>
        </div>
    );
}

export default DonatePage;
