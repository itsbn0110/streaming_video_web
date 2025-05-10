import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../../AdminLayout.module.scss';
import { Save, ArrowLeft } from 'lucide-react';
import adminRouteConfig from '@/config/adminRoutes';
import { fetchCategoryDataAPI, createCategoryDataAPI, updateCategoryDataAPI } from '@/apis';

const cx = classNames.bind(styles);

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchCategoryData();
        }
    }, [id]);

    const fetchCategoryData = async () => {
        setLoading(true);
        try {
            const response = await fetchCategoryDataAPI(id);
            if (response && response.result) {
                setCategoryName(response.result.name);
            } else {
                setError('Không thể tải thông tin danh mục');
            }
        } catch (err) {
            setError('Lỗi khi tải thông tin danh mục: ' + err.message);
            console.error('Error fetching category:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSubmitSuccess(false);

        try {
            const payload = { categoryName: categoryName.trim() };
            let response;
            if (isEditMode) {
                response = await updateCategoryDataAPI(id, payload);
            } else {
                response = await createCategoryDataAPI(payload);
            }

            if (response && response.code === 1000) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    navigate(adminRouteConfig.listCategories);
                }, 1500);
            } else {
                setError('Có lỗi xảy ra khi lưu danh mục');
            }
        } catch (err) {
            setError('Lỗi khi lưu danh mục: ' + err.message);
            console.error('Error submitting category:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={cx('page-header')}>
                <h2>{isEditMode ? 'Sửa danh mục' : 'Tạo danh mục mới'}</h2>
                <Link to={adminRouteConfig.listCategories} className={cx('button-outline')}>
                    <ArrowLeft size={16} />
                    Quay lại
                </Link>
            </div>

            {error && (
                <div className={cx('alert', 'alert-danger')} style={{ marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {submitSuccess && (
                <div className={cx('alert', 'alert-success')} style={{ marginBottom: '1rem' }}>
                    {isEditMode ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục mới thành công!'}
                </div>
            )}

            <div className={cx('card')}>
                {loading && !isEditMode ? (
                    <div className={cx('loading-indicator')}>Đang tải...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className={cx('form-group')}>
                            <label htmlFor="categoryName">Tên danh mục</label>
                            <input
                                type="text"
                                id="categoryName"
                                className={cx('form-control')}
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                                placeholder="Nhập tên danh mục"
                            />
                        </div>

                        <div className={cx('form-actions')}>
                            <button type="submit" className={cx('button-primary')} disabled={loading}>
                                <Save size={16} />
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CategoryForm;
