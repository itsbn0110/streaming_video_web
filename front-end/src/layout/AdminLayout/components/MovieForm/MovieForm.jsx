import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { X, Upload, Save, ArrowLeft } from 'lucide-react';
import adminRouteConfig from '@/config/adminRoutes';
import {
    createMovieDataAPI,
    updateMovieDataAPI,
    fetchAllCategoriesAPI,
    fetchAllGenresAPI,
    fetchAllCountriesAPI,
    fetchAllPersonsAPI,
    fetchMovieDataAPI,
} from '@/apis';
import Select from 'react-select';
import styles from '../../AdminLayout.module.scss';

const cx = classNames.bind(styles);

const MovieForm = ({ editMode = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        originalTitle: '',
        description: '',
        releaseYear: new Date().getFullYear(),
        status: 'PUBLIC',
        categories: [],
        genres: [],
        countries: [],
        directors: [],
        actors: [],
        thumbnail: null,
        movieBackDrop: null,
        thumbnailPreview: null,
        backDropPreview: null,
        movieFile: null,
        trailerLink: '',
        duration: 0,
        premium: false,
    });

    const [genreOptions, setGenreOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [directorOptions, setDirectorOptions] = useState([]);
    const [actorOptions, setActorOptions] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editMode && id) {
            const fetchMovie = async () => {
                try {
                    const res = await fetchMovieDataAPI(id);
                    if (res && res.result) {
                        const movie = res.result;
                        setFormData({
                            ...formData,
                            title: movie.title || '',
                            originalTitle: movie.originalTitle || '',
                            description: movie.description || '',
                            releaseYear: movie.releaseYear || new Date().getFullYear(),
                            status: movie.status || 'PUBLIC',
                            categories: movie.categories || [],
                            genres: movie.genres || [],
                            countries: movie.countries || [],
                            directors: movie.directors || [],
                            actors: movie.actors || [],
                            thumbnail: null,
                            movieBackDrop: null,
                            thumbnailPreview: movie.thumbnail || null,
                            backDropPreview: movie.backdrop || null,
                            movieFile: null,
                            trailerLink: movie.trailerLink || '',
                            duration: movie.duration || 0,
                            premium: movie.premium || false,
                        });
                    }
                } catch (err) {
                    console.log(err);
                    setError('Không thể lấy dữ liệu phim để chỉnh sửa');
                }
            };
            fetchMovie();
        }
    }, [editMode, id]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [categoriesRes, genresRes, countriesRes, directorsRes, actorsRes] = await Promise.all([
                    fetchAllCategoriesAPI(),
                    fetchAllGenresAPI(),
                    fetchAllCountriesAPI(),
                    fetchAllPersonsAPI('director'),
                    fetchAllPersonsAPI('actor'),
                ]);

                setCategoryOptions(categoriesRes?.result || []);
                setGenreOptions(genresRes?.result || []);
                setCountryOptions(countriesRes?.result || []);
                setDirectorOptions(directorsRes?.result || []);
                setActorOptions(actorsRes?.result || []);
            } catch (err) {
                console.error('Fetch lỗi :', err);
                setError('Lỗi lấy dữ liệu');
            }
        };

        fetchOptions();
    }, []);

    const actorSelectOptions = actorOptions.map((actor) => ({ value: actor, label: actor.name }));
    const directorSelectOptions = directorOptions.map((director) => ({ value: director, label: director.name }));
    const genreSelectOptions = genreOptions.map((genre) => ({ value: genre, label: genre.name }));
    const countrySelectOptions = countryOptions.map((country) => ({ value: country, label: country.name }));
    const categorySelectOptions = categoryOptions.map((category) => ({ value: category, label: category.name }));

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
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
            } else if (name === 'backDrop') {
                setFormData({
                    ...formData,
                    movieBackDrop: files[0],
                    backDropPreview: URL.createObjectURL(files[0]),
                });
            } else if (name === 'movieFile') {
                setFormData({
                    ...formData,
                    movieFile: files[0],
                });
            }
        }
    };

    const handleSelectChange = (selected, actionMeta) => {
        const { name } = actionMeta;
        setFormData({
            ...formData,
            [name]: selected ? selected.map((option) => option.value) : [],
        });
    };

    const prepareRequestData = () => {
        const requestData = {
            movieType: 'SINGLE',
            title: formData.title,
            originalTitle: formData.originalTitle || '',
            description: formData.description,
            releaseYear: formData.releaseYear,
            categories: formData.categories.map((category) => category.name || category),
            status: formData.status,
            trailerLink: formData.trailerLink || '',
            duration: formData.duration || 0,
            premium: formData.premium,
            genres: formData.genres.map((genre) => genre.name || genre),
            countries: formData.countries.map((country) => country.name || country),
            directors: formData.directors.map((director) => director.name || director),
            actors: formData.actors.map((actor) => actor.name || actor),
        };

        return JSON.stringify(requestData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.thumbnail && !editMode) {
                throw new Error('Vui lòng chọn hình thumbnail');
            }

            if (!formData.movieFile && !editMode) {
                throw new Error('Vui lòng chọn file phim');
            }

            if (!formData.duration || formData.duration <= 0) {
                throw new Error('Vui lòng nhập thời lượng phim hợp lệ');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('request', prepareRequestData());

            if (formData.thumbnail) {
                formDataToSend.append('thumbnailFile', formData.thumbnail);
            }
            if (formData.movieFile) {
                formDataToSend.append('movieFile', formData.movieFile);
            }
            if (formData.movieBackDrop) {
                formDataToSend.append('movieBackDrop', formData.movieBackDrop);
            }

            let response;
            if (editMode) {
                response = await updateMovieDataAPI(id, formDataToSend);
            } else {
                response = await createMovieDataAPI(formDataToSend);
            }

            if (response && response.result) {
                alert(editMode ? 'Phim lẻ đã được cập nhật!' : 'Phim lẻ đã được tạo thành công!');
                navigate(`${adminRouteConfig.list}`);
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi lưu phim');
            console.error('Error submitting form:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={cx('page-header')}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            marginRight: '12px',
                            color: '#4a5568',
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2>{editMode ? 'Chỉnh sửa phim lẻ' : 'Tạo phim lẻ mới'}</h2>
                </div>
                <button className={cx('button-primary')} onClick={handleSubmit} disabled={loading}>
                    <Save size={16} />
                    {loading ? 'Đang xử lý...' : editMode ? 'Cập nhật' : 'Lưu phim'}
                </button>
            </div>

            {error && (
                <div className={cx('alert', 'alert-danger')} style={{ marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <div className={cx('card')}>
                <form className={cx('form-container')} onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                Tên phim <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                className={cx('form-control')}
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Tên gốc (nếu có)</label>
                            <input
                                type="text"
                                name="originalTitle"
                                className={cx('form-control')}
                                value={formData.originalTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Mô tả ngắn <span style={{ color: 'red' }}>*</span>
                        </label>
                        <textarea
                            name="description"
                            className={cx('form-control')}
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    {/* Movie Details */}
                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                Năm phát hành <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="number"
                                name="releaseYear"
                                className={cx('form-control')}
                                value={formData.releaseYear}
                                onChange={handleInputChange}
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                required
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                Thời lượng (phút) <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="number"
                                name="duration"
                                className={cx('form-control')}
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Link trailer</label>
                            <input
                                type="url"
                                name="trailerLink"
                                className={cx('form-control')}
                                value={formData.trailerLink}
                                onChange={handleInputChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>
                    </div>

                    {/* Categories and Settings */}
                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Loại phim</label>
                            <Select
                                isMulti
                                name="categories"
                                options={categorySelectOptions}
                                value={formData.categories.map((c) => ({ value: c, label: c.name }))}
                                onChange={handleSelectChange}
                                placeholder="Chọn loại phim..."
                                classNamePrefix="react-select"
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Status</label>
                            <select
                                name="status"
                                className={cx('form-control')}
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="PUBLIC">Công khai</option>
                                <option value="PRIVATE">Riêng tư</option>
                                <option value="DRAFT">Nháp</option>
                            </select>
                        </div>

                        <div className={cx('form-group')} style={{ flex: '0.5' }}>
                            <label className={cx('form-label')}>Premium</label>
                            <div style={{ marginTop: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="premium"
                                        checked={formData.premium}
                                        onChange={handleInputChange}
                                        style={{ marginRight: '8px' }}
                                    />
                                    Phim Premium
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* People */}
                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Đạo diễn</label>
                            <Select
                                isMulti
                                name="directors"
                                options={directorSelectOptions}
                                value={formData.directors.map((d) => ({ value: d, label: d.name }))}
                                onChange={handleSelectChange}
                                placeholder="Chọn đạo diễn..."
                                classNamePrefix="react-select"
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Diễn viên</label>
                            <Select
                                isMulti
                                name="actors"
                                options={actorSelectOptions}
                                value={formData.actors.map((a) => ({ value: a, label: a.name }))}
                                onChange={handleSelectChange}
                                placeholder="Chọn diễn viên..."
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>

                    {/* Genres and Countries */}
                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Thể loại</label>
                            <Select
                                isMulti
                                name="genres"
                                options={genreSelectOptions}
                                value={formData.genres.map((g) => ({ value: g, label: g.name }))}
                                onChange={handleSelectChange}
                                placeholder="Chọn thể loại..."
                                classNamePrefix="react-select"
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Quốc gia</label>
                            <Select
                                isMulti
                                name="countries"
                                options={countrySelectOptions}
                                value={formData.countries.map((c) => ({ value: c, label: c.name }))}
                                onChange={handleSelectChange}
                                placeholder="Chọn quốc gia..."
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>

                    {/* File Uploads */}
                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                Thumbnail <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div className={cx('image-upload')}>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    id="thumbnail"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="thumbnail">
                                    <div className={cx('upload-icon')}>
                                        <Upload size={36} />
                                    </div>
                                    <div className={cx('upload-text')}>
                                        Kéo thả hình ảnh thumbnail vào đây hoặc click để chọn
                                    </div>
                                </label>
                            </div>
                            {formData.thumbnailPreview && (
                                <img
                                    src={formData.thumbnailPreview}
                                    alt="Thumbnail preview"
                                    className={cx('preview-image')}
                                    style={{ maxHeight: '200px' }}
                                />
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Backdrop</label>
                            <div className={cx('image-upload')}>
                                <input
                                    type="file"
                                    name="backDrop"
                                    id="backDrop"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="backDrop">
                                    <div className={cx('upload-icon')}>
                                        <Upload size={36} />
                                    </div>
                                    <div className={cx('upload-text')}>
                                        Kéo thả hình ảnh backdrop vào đây hoặc click để chọn
                                    </div>
                                </label>
                            </div>
                            {formData.backDropPreview && (
                                <img
                                    src={formData.backDropPreview}
                                    alt="Backdrop preview"
                                    className={cx('preview-image')}
                                    style={{ maxHeight: '200px' }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Movie File */}
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            File phim <span style={{ color: 'red' }}>*</span>
                        </label>
                        <div className={cx('image-upload')}>
                            <input
                                type="file"
                                name="movieFile"
                                id="movieFile"
                                accept="video/*"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="movieFile">
                                <div className={cx('upload-icon')}>
                                    <Upload size={36} />
                                </div>
                                <div className={cx('upload-text')}>
                                    Kéo thả file phim vào đây hoặc click để chọn file
                                </div>
                            </label>
                        </div>
                        {formData.movieFile && (
                            <div style={{ marginTop: '12px' }}>
                                <span style={{ fontWeight: '500' }}>File đã chọn:</span> {formData.movieFile.name}
                                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                    Kích thước: {(formData.movieFile.size / (1024 * 1024)).toFixed(2)} MB
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovieForm;
