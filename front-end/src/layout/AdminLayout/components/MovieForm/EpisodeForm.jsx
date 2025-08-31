import { useState, useEffect } from 'react';
import { X, Upload, Save, Film } from 'lucide-react';

const EpisodeForm = ({
    episode = null,
    movieId = 1,
    movieTitle = 'Test Movie',
    nextEpisodeNumber = 1,
    onSubmit = () => console.log('Submit clicked'),
    onCancel = () => console.log('Cancel clicked'),
    loading = false,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        episodeNumber: nextEpisodeNumber,
        duration: 0,
        movieFile: null,
        status: 0, // Default to the first status (e.g., DRAFT)
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { value: 0, label: 'Nháp' },
        { value: 1, label: 'CÔNG KHAI' },
        { value: 2, label: 'LƯU TRỮ' },
    ];

    // Check if this is an edit form
    const isEditMode = Boolean(episode);

    useEffect(() => {
        if (episode) {
            setFormData({
                title: episode.title || '',
                description: episode.description || '',
                episodeNumber: episode.episodeNumber || nextEpisodeNumber,
                duration: episode.duration || 0,
                movieFile: null, // Always null for edit mode
                status: episode.status !== undefined ? episode.status : 0,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                episodeNumber: nextEpisodeNumber,
                duration: 0,
                movieFile: null,
                status: 0, // Default to DRAFT
            });
        }
    }, [episode, nextEpisodeNumber]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleFileChange = (e) => {
        const { files } = e.target;
        if (files.length > 0) {
            setFormData({
                ...formData,
                movieFile: files[0],
            });
        }

        if (errors.movieFile) {
            setErrors({
                ...errors,
                movieFile: '',
            });
        }
    };

    const handleStatusChange = (e) => {
        setFormData({
            ...formData,
            status: parseInt(e.target.value, 10),
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tên tập phim là bắt buộc';
        }

        if (formData.title.length > 255) {
            newErrors.title = 'Tên tập phim không được vượt quá 255 ký tự';
        }

        if (!formData.episodeNumber || formData.episodeNumber < 1) {
            newErrors.episodeNumber = 'Số tập phải lớn hơn 0';
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
        }

        // Fix: Only require movieFile for new episodes, not for updates
        if (!formData.movieFile && !isEditMode) {
            newErrors.movieFile = 'Vui lòng chọn file video';
        }

        if (formData.duration <= 0) {
            newErrors.duration = 'Thời lượng phải lớn hơn 0 phút';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const requestData = {
                title: formData.title.trim(),
                description: formData.description?.trim() || '',
                episodeNumber: formData.episodeNumber,
                duration: formData.duration,
                movieId,
                status: formData.status, // Send the numeric status value
            };

            if (isEditMode) {
                delete requestData.movieId;
            }

            console.log('Form Data to submit:', {
                requestData,
                hasFile: !!formData.movieFile,
                fileName: formData.movieFile?.name,
                fileSize: formData.movieFile?.size,
                fileType: formData.movieFile?.type,
            });

            // Fix: Always use FormData for consistency and proper file handling
            const formDataToSend = new FormData();

            // Append the JSON request data
            formDataToSend.append('request', JSON.stringify(requestData));

            // For new episodes, movieFile is required
            if (!isEditMode && formData.movieFile) {
                formDataToSend.append('movieFile', formData.movieFile, formData.movieFile.name);
                console.log('Appending movieFile:', formData.movieFile.name);
            }

            // Debug: Log FormData contents
            console.log('FormData contents:');
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]));
            }

            await onSubmit(formDataToSend);
        } catch (error) {
            console.error('Error in form submission:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isLoading = loading || isSubmitting;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center p-5">
            <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-semibold flex items-center gap-3 m-0">
                            <Film size={24} />
                            {isEditMode ? 'Chỉnh sửa tập phim' : 'Thêm tập phim mới'}
                        </h3>
                        {movieTitle && (
                            <p className="mt-2 text-base opacity-90 font-normal m-0">
                                Bộ phim: <strong className="font-medium">{movieTitle}</strong>
                            </p>
                        )}
                    </div>
                    {/* Fixed close button - changed to have dark background */}
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className=" bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-40 rounded-lg text-white w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Changed to div instead of form */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="space-y-8">
                            {/* Basic Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 border-l-4 border-indigo-500 pl-3 mb-5">
                                    Thông tin cơ bản
                                </h4>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Tên tập phim <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: Tập 1 - Khởi đầu cuộc phiêu lưu"
                                            maxLength="255"
                                            className={`w-full px-4 py-3 rounded-lg border-2 text-sm outline-none transition-colors ${
                                                errors.title
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 focus:border-indigo-500 bg-white'
                                            }`}
                                        />
                                        <div className="text-xs text-gray-500 mt-1 text-right">
                                            {formData.title.length}/255 ký tự
                                        </div>
                                        {errors.title && (
                                            <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Số tập <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="episodeNumber"
                                            value={formData.episodeNumber}
                                            onChange={handleInputChange}
                                            min="1"
                                            placeholder="1"
                                            className={`w-full px-4 py-3 rounded-lg border-2 text-sm outline-none transition-colors ${
                                                errors.episodeNumber
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 focus:border-indigo-500 bg-white'
                                            }`}
                                        />
                                        {errors.episodeNumber && (
                                            <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                {errors.episodeNumber}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Thời lượng (phút) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.1"
                                            placeholder="45.5"
                                            className={`w-full px-4 py-3 rounded-lg border-2 text-sm outline-none transition-colors ${
                                                errors.duration
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 focus:border-indigo-500 bg-white'
                                            }`}
                                        />
                                        {errors.duration && (
                                            <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                {errors.duration}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Trạng thái tập phim
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleStatusChange}
                                            className="w-full px-4 py-3 rounded-lg border-2 text-sm outline-none transition-colors border-gray-200 focus:border-indigo-500 bg-white"
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Mô tả tập phim
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Mô tả ngắn gọn về nội dung, cốt truyện của tập phim này..."
                                        maxLength="500"
                                        className={`w-full px-4 py-3 rounded-lg border-2 text-sm resize-vertical outline-none transition-colors ${
                                            errors.description
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 focus:border-indigo-500 bg-white'
                                        }`}
                                    />
                                    <div className="text-xs text-gray-500 mt-1 text-right">
                                        {(formData.description || '').length}/500 ký tự
                                    </div>
                                    {errors.description && (
                                        <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                            {errors.description}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* File Upload - Fix: Hide for edit mode or show with different message */}
                            {!isEditMode && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 border-l-4 border-green-500 pl-3 mb-5">
                                        File video
                                    </h4>

                                    <div>
                                        <label className="block text-sm font-medium mb-3 text-gray-700">
                                            File video <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className={`border-2 border-dashed rounded-xl p-12 text-center bg-gray-50 transition-all cursor-pointer hover:bg-gray-100 ${
                                                errors.movieFile
                                                    ? 'border-red-300 bg-red-50'
                                                    : 'border-gray-300 hover:border-indigo-300'
                                            }`}
                                        >
                                            <input
                                                type="file"
                                                name="movieFile"
                                                id="movieFile"
                                                accept="video/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <label htmlFor="movieFile" className="cursor-pointer block">
                                                <div className="mb-4">
                                                    <Upload size={48} className="text-gray-400 mx-auto" />
                                                </div>
                                                <div className="font-medium mb-2 text-gray-700 text-lg">
                                                    Kéo thả file video vào đây hoặc click để chọn
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Hỗ trợ: MP4, AVI, MOV, WMV, MKV (tối đa 2GB)
                                                </div>
                                            </label>
                                        </div>
                                        {formData.movieFile && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="font-medium mb-2 text-blue-800 flex items-center gap-2">
                                                    🎬 {formData.movieFile.name}
                                                </div>
                                                <div className="text-sm text-blue-600">
                                                    Kích thước: {formatFileSize(formData.movieFile.size)} • Loại:{' '}
                                                    {formData.movieFile.type || 'Unknown'}
                                                </div>
                                            </div>
                                        )}
                                        {errors.movieFile && (
                                            <div className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                {errors.movieFile}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Edit Mode Notice */}
                            {isEditMode && (
                                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Film size={20} className="text-blue-600" />
                                        <h4 className="text-lg font-semibold text-blue-800 m-0">
                                            Chế độ chỉnh sửa tập phim
                                        </h4>
                                    </div>
                                    <p className="text-sm text-blue-700 mb-0">
                                        Bạn đang chỉnh sửa thông tin của tập phim. Video hiện tại sẽ được giữ nguyên. Để
                                        thay đổi video, vui lòng tạo tập phim mới.
                                    </p>
                                </div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100 text-center">
                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                                        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse rounded-full"></div>
                                    </div>
                                    <div className="text-base text-gray-700 font-semibold mb-2 flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                        🎬 {isEditMode ? 'Đang cập nhật thông tin...' : 'Đang upload và xử lý video...'}
                                        <div
                                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                            style={{ animationDelay: '0.1s' }}
                                        ></div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {isEditMode
                                            ? 'Vui lòng đợi trong giây lát.'
                                            : 'Vui lòng không đóng trang. Quá trình này có thể mất vài phút tùy thuộc vào kích thước file.'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex justify-end gap-3 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-600 font-medium cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit} // Changed from type="submit" to onClick
                            disabled={isLoading}
                            className="px-6 py-3 rounded-lg border-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium cursor-pointer transition-all hover:from-indigo-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-70 flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <Save size={16} />
                            {isLoading ? 'Đang xử lý...' : isEditMode ? 'Cập nhật tập phim' : 'Thêm tập phim'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EpisodeForm;
