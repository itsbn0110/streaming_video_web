import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { X, Upload, Save } from 'lucide-react';
import styles from '../../AdminLayout.module.scss';

const cx = classNames.bind(styles);

const EpisodeForm = ({ episode = null, movieId, nextEpisodeNumber = 1, onSubmit, onCancel, loading = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        episodeNumber: nextEpisodeNumber,
        seasonNumber: 1,
        duration: 0,
        videoFile: null,
        thumbnail: null,
        thumbnailPreview: null,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (episode) {
            setFormData({
                title: episode.title || '',
                description: episode.description || '',
                episodeNumber: episode.episodeNumber || nextEpisodeNumber,
                seasonNumber: episode.seasonNumber || 1,
                duration: episode.duration || 0,
                videoFile: null,
                thumbnail: null,
                thumbnailPreview: episode.thumbnail || null,
            });
        }
    }, [episode, nextEpisodeNumber]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            if (name === 'thumbnail') {
                setFormData({
                    ...formData,
                    thumbnail: files[0],
                    thumbnailPreview: URL.createObjectURL(files[0]),
                });
            } else if (name === 'videoFile') {
                setFormData({
                    ...formData,
                    videoFile: files[0],
                });
            }
        }

        // Clear error when user selects file
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tên tập phim là bắt buộc';
        }

        if (!formData.episodeNumber || formData.episodeNumber < 1) {
            newErrors.episodeNumber = 'Số tập phải lớn hơn 0';
        }

        if (!formData.videoFile && !episode) {
            newErrors.videoFile = 'Vui lòng chọn file video';
        }

        if (formData.duration <= 0) {
            newErrors.duration = 'Thời lượng phải lớn hơn 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const prepareFormData = () => {
        const requestData = {
            title: formData.title,
            description: formData.description,
            episodeNumber: formData.episodeNumber,
            seasonNumber: formData.seasonNumber,
            duration: formData.duration,
        };

        const formDataToSend = new FormData();
        formDataToSend.append('request', JSON.stringify(requestData));

        if (formData.videoFile) {
            formDataToSend.append('videoFile', formData.videoFile);
        }

        if (formData.thumbnail) {
            formDataToSend.append('thumbnailFile', formData.thumbnail);
        }

        return formDataToSend;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataToSend = prepareFormData();
        await onSubmit(formDataToSend);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={cx('modal-overlay')}>
            <div className={cx('modal-content')} style={{ maxWidth: '800px', width: '90%' }}>
                <div className={cx('modal-header')}>
                    <h3>{episode ? 'Chỉnh sửa tập phim' : 'Thêm tập phim mới'}</h3>
                    <button className={cx('button-icon')} onClick={onCancel} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <form className={cx('modal-body')} onSubmit={handleSubmit}>
                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                Tên tập <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                className={cx('form-control', { error: errors.title })}
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Tập 1 - Khởi đầu"
                            />
                            {errors.title && <div className={cx('error-message')}>{errors.title}</div>}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                Số tập <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="number"
                                name="episodeNumber"
                                className={cx('form-control', { error: errors.episodeNumber })}
                                value={formData.episodeNumber}
                                onChange={handleInputChange}
                                min="1"
                            />
                            {errors.episodeNumber && <div className={cx('error-message')}>{errors.episodeNumber}</div>}
                        </div>
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Số season</label>
                            <input
                                type="number"
                                name="seasonNumber"
                                className={cx('form-control')}
                                value={formData.seasonNumber}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                Thời lượng (phút) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="number"
                                name="duration"
                                className={cx('form-control', { error: errors.duration })}
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="0"
                                step="0.1"
                            />
                            {errors.duration && <div className={cx('error-message')}>{errors.duration}</div>}
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Mô tả tập</label>
                        <textarea
                            name="description"
                            className={cx('form-control')}
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Mô tả ngắn gọn về nội dung tập phim..."
                        ></textarea>
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                File video {!episode && <span style={{ color: 'red' }}>*</span>}
                            </label>
                            <div className={cx('image-upload', { error: errors.videoFile })}>
                                <input
                                    type="file"
                                    name="videoFile"
                                    id="videoFile"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="videoFile">
                                    <div className={cx('upload-icon')}>
                                        <Upload size={36} />
                                    </div>
                                    <div className={cx('upload-text')}>
                                        Kéo thả file video vào đây hoặc click để chọn
                                    </div>
                                    <div className={cx('upload-hint')}>Hỗ trợ: MP4, AVI, MOV, WMV (tối đa 2GB)</div>
                                </label>
                            </div>
                            {formData.videoFile && (
                                <div
                                    style={{
                                        marginTop: '12px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                        File đã chọn: {formData.videoFile.name}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                        Kích thước: {formatFileSize(formData.videoFile.size)}
                                    </div>
                                </div>
                            )}
                            {errors.videoFile && <div className={cx('error-message')}>{errors.videoFile}</div>}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Thumbnail tập</label>
                            <div className={cx('image-upload')}>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    id="episode-thumbnail"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="episode-thumbnail">
                                    <div className={cx('upload-icon')}>
                                        <Upload size={36} />
                                    </div>
                                    <div className={cx('upload-text')}>Thumbnail riêng cho tập này</div>
                                    <div className={cx('upload-hint')}>
                                        Tùy chọn - nếu không chọn sẽ dùng thumbnail của phim
                                    </div>
                                </label>
                            </div>
                            {formData.thumbnailPreview && (
                                <img
                                    src={formData.thumbnailPreview}
                                    alt="Episode thumbnail preview"
                                    className={cx('preview-image')}
                                    style={{ maxHeight: '120px', marginTop: '12px' }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Upload Progress Indicator */}
                    {loading && (
                        <div className={cx('upload-progress')}>
                            <div className={cx('progress-bar')}>
                                <div className={cx('progress-fill')}></div>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#666' }}>
                                Đang upload video, vui lòng không đóng trang...
                            </div>
                        </div>
                    )}
                </form>

                <div className={cx('modal-footer')}>
                    <button type="button" className={cx('button-secondary')} onClick={onCancel} disabled={loading}>
                        Hủy
                    </button>
                    <button type="submit" className={cx('button-primary')} onClick={handleSubmit} disabled={loading}>
                        <Save size={16} />
                        {loading ? 'Đang xử lý...' : episode ? 'Cập nhật' : 'Thêm tập'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EpisodeForm;
