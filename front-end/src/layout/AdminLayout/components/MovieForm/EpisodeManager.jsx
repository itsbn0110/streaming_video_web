import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash, Play, Eye, Search, Clock, Calendar, FileVideo, RefreshCw, ArrowLeft } from 'lucide-react';
import EpisodeForm from './EpisodeForm';
import {
    fetchEpisodesByMovieIdAPI,
    createEpisodeAPI,
    updateEpisodeAPI,
    deleteEpisodeAPI,
    fetchEpisodeByIdAPI,
} from '@/apis';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EpisodeManagement = () => {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEpisodeForm, setShowEpisodeForm] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('episodeNumber');
    const [sortOrder, setSortOrder] = useState('asc');
    const [error, setError] = useState(null);
    const { movieId } = useParams();

    // Fetch episodes from API
    const fetchEpisodes = useCallback(async () => {
        if (!movieId) {
            setError('Movie ID không tồn tại');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await fetchEpisodesByMovieIdAPI(movieId);
            console.log('data: ', data);

            // Handle different API response structures
            let episodesData = [];
            if (data?.result && Array.isArray(data.result)) {
                episodesData = data.result;
            } else if (Array.isArray(data)) {
                episodesData = data;
            } else {
                console.error('API response is not an array:', data);
                setError('Dữ liệu không hợp lệ. Vui lòng thử lại.');
                return;
            }

            // Ensure all episodes have required properties
            const processedEpisodes = episodesData.map((episode) => ({
                id: episode.id || '',
                episodeNumber: episode.episodeNumber || 0,
                title: episode.title || 'Chưa có tiêu đề',
                description: episode.description || '',
                duration: episode.duration || 0,
                views: episode.views || 0,
                movieTitle: episode.movieTitle || 'Chưa có tiêu đề',
                status: episode.status !== undefined ? episode.status : 0, // Fix: Use numeric status
                createdAt: episode.createdAt || new Date().toISOString().split('T')[0],
                updatedAt: episode.updatedAt || new Date().toISOString().split('T')[0],
                thumbnailUrl: episode.thumbnailUrl || null,
                videoUrl: episode.videoUrl || null,
            }));

            setEpisodes(processedEpisodes);
        } catch (error) {
            console.error('Error fetching episodes:', error);
            setError('Không thể tải danh sách tập phim. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [movieId]);

    // Load episodes on component mount
    useEffect(() => {
        fetchEpisodes();
    }, [fetchEpisodes]);

    // Filtered and sorted episodes - với safe checks
    const filteredEpisodes = React.useMemo(() => {
        if (!Array.isArray(episodes)) {
            return [];
        }

        return episodes
            .filter((episode) => {
                if (!episode) return false;

                const title = episode.title || '';
                const description = episode.description || '';
                const status = episode.status;

                const matchesSearch =
                    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    description.toLowerCase().includes(searchTerm.toLowerCase());

                // Fix: Update status filter to work with numeric values
                let matchesStatus = false;
                if (statusFilter === 'ALL') {
                    matchesStatus = true;
                } else if (statusFilter === 'PUBLISHED') {
                    matchesStatus = status === 1;
                } else if (statusFilter === 'DRAFT') {
                    matchesStatus = status === 0;
                } else if (statusFilter === 'PRIVATE') {
                    matchesStatus = status === 2;
                }

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (!a || !b) return 0;

                let aValue = a[sortBy];
                let bValue = b[sortBy];

                // Handle undefined values
                if (aValue === undefined || aValue === null) aValue = '';
                if (bValue === undefined || bValue === null) bValue = '';

                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = String(bValue).toLowerCase();
                }

                if (sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
    }, [episodes, searchTerm, statusFilter, sortBy, sortOrder]);

    // Handlers
    const handleAddEpisode = () => {
        setSelectedEpisode(null);
        setShowEpisodeForm(true);
    };

    const handleEditEpisode = async (episodeId) => {
        if (!episodeId) {
            setError('Episode ID không hợp lệ');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const episodeData = await fetchEpisodeByIdAPI(episodeId);
            const episode = episodeData?.result || episodeData;

            if (!episode) {
                throw new Error('Không tìm thấy thông tin tập phim');
            }

            setSelectedEpisode(episode);
            setShowEpisodeForm(true);
        } catch (error) {
            console.error('Error fetching episode details:', error);
            setError('Không thể tải thông tin tập phim. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEpisode = async (episodeId) => {
        if (!episodeId) {
            setError('Episode ID không hợp lệ');
            return;
        }

        if (!window.confirm('Bạn có chắc chắn muốn xóa tập phim này?')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await deleteEpisodeAPI(episodeId);
            setEpisodes((prevEpisodes) =>
                Array.isArray(prevEpisodes) ? prevEpisodes.filter((ep) => ep?.id !== episodeId) : [],
            );
        } catch (error) {
            console.error('Error deleting episode:', error);
            setError('Không thể xóa tập phim. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (formDataToSubmit) => {
        if (!formDataToSubmit) {
            setError('Dữ liệu form không hợp lệ');
            toast.error('Dữ liệu form không hợp lệ');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Submitting form data:', formDataToSubmit);

            if (selectedEpisode?.id) {
                // Update existing episode
                console.log('Updating episode:', selectedEpisode.id);
                const updatedEpisodeData = await updateEpisodeAPI(selectedEpisode.id, formDataToSubmit);
                const updatedEpisode = updatedEpisodeData?.result || updatedEpisodeData;

                console.log('Updated episode response:', updatedEpisode);

                setEpisodes((prevEpisodes) =>
                    Array.isArray(prevEpisodes)
                        ? prevEpisodes.map((ep) =>
                              ep?.id === selectedEpisode.id
                                  ? {
                                        ...ep,
                                        ...updatedEpisode,
                                        title:
                                            updatedEpisode.title ||
                                            (formDataToSubmit instanceof FormData
                                                ? JSON.parse(formDataToSubmit.get('request')).title
                                                : formDataToSubmit.title),
                                        description:
                                            updatedEpisode.description ||
                                            (formDataToSubmit instanceof FormData
                                                ? JSON.parse(formDataToSubmit.get('request')).description
                                                : formDataToSubmit.description),
                                        episodeNumber:
                                            updatedEpisode.episodeNumber ||
                                            (formDataToSubmit instanceof FormData
                                                ? JSON.parse(formDataToSubmit.get('request')).episodeNumber
                                                : formDataToSubmit.episodeNumber),
                                        duration:
                                            updatedEpisode.duration ||
                                            (formDataToSubmit instanceof FormData
                                                ? JSON.parse(formDataToSubmit.get('request')).duration
                                                : formDataToSubmit.duration),
                                        status:
                                            updatedEpisode.status !== undefined
                                                ? updatedEpisode.status
                                                : formDataToSubmit instanceof FormData
                                                ? JSON.parse(formDataToSubmit.get('request')).status
                                                : formDataToSubmit.status,
                                    }
                                  : ep,
                          )
                        : [],
                );

                toast.success('Tập phim đã được cập nhật thành công!');
            } else {
                if (formDataToSubmit instanceof FormData) {
                    console.log('FormData contents:');
                    for (let pair of formDataToSubmit.entries()) {
                        console.log(
                            pair[0] +
                                ': ' +
                                (pair[1] instanceof File ? `File(${pair[1].name}, ${pair[1].size} bytes)` : pair[1]),
                        );
                    }
                }

                const newEpisodeData = await createEpisodeAPI(formDataToSubmit);
                const newEpisode = newEpisodeData?.result || newEpisodeData;

                setEpisodes((prevEpisodes) => {
                    const requestData =
                        formDataToSubmit instanceof FormData
                            ? JSON.parse(formDataToSubmit.get('request'))
                            : formDataToSubmit;

                    const newEpisodeFormatted = {
                        id: newEpisode.id || '',
                        episodeNumber: newEpisode.episodeNumber || requestData.episodeNumber,
                        title: newEpisode.title || requestData.title,
                        description: newEpisode.description || requestData.description,
                        duration: newEpisode.duration || requestData.duration,
                        views: newEpisode.views || 0,
                        status: newEpisode.status !== undefined ? newEpisode.status : requestData.status,
                        createdAt: newEpisode.createdAt || new Date().toISOString().split('T')[0],
                        updatedAt: newEpisode.updatedAt || new Date().toISOString().split('T')[0],
                        thumbnailUrl: newEpisode.thumbnailUrl || null,
                        videoUrl: newEpisode.videoUrl || null,
                    };

                    toast.success('Tập phim mới đã được thêm thành công!');

                    return Array.isArray(prevEpisodes) ? [...prevEpisodes, newEpisodeFormatted] : [newEpisodeFormatted];
                });
            }

            setShowEpisodeForm(false);
            setSelectedEpisode(null);
        } catch (error) {
            console.log('error', error);
            const errorMessage = error?.response?.data?.message || 'Không thể lưu tập phim. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFormCancel = () => {
        setShowEpisodeForm(false);
        setSelectedEpisode(null);
        setError(null);
    };

    const handleRefresh = () => {
        fetchEpisodes();
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            0: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Bản nháp' },
            1: { bg: 'bg-green-100', text: 'text-green-800', label: 'Công khai' },
            2: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã lưu trữ' },
        };

        const config = statusConfig[status] || statusConfig[0];

        return (
            <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDuration = (minutes) => {
        const duration = Number(minutes) || 0;
        const hrs = Math.floor(duration / 60);
        const mins = Math.floor(duration % 60);
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    };

    const formatViews = (views) => {
        const viewCount = Number(views) || 0;
        if (viewCount >= 1000000) {
            return `${(viewCount / 1000000).toFixed(1)}M`;
        } else if (viewCount >= 1000) {
            return `${(viewCount / 1000).toFixed(1)}K`;
        }
        return viewCount.toString();
    };

    // Safe calculations for stats
    const totalEpisodes = Array.isArray(episodes) ? episodes.length : 0;
    const publishedEpisodes = Array.isArray(episodes) ? episodes.filter((e) => e?.status === 1).length : 0; // Fix: Use numeric 1
    const totalViews = Array.isArray(episodes) ? episodes.reduce((sum, e) => sum + (Number(e?.views) || 0), 0) : 0;
    const totalDuration = Array.isArray(episodes)
        ? episodes.reduce((sum, e) => sum + (Number(e?.duration) || 0), 0)
        : 0;
    const maxEpisodeNumber =
        Array.isArray(episodes) && episodes.length > 0
            ? Math.max(...episodes.map((e) => Number(e?.episodeNumber) || 0))
            : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer />
            <div className="max-w-7xl mx-auto p-4">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                        <div className="text-red-800 text-sm font-medium">{error}</div>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 text-red-600 hover:text-red-800 text-xs font-medium underline"
                        >
                            Đóng
                        </button>
                    </div>
                )}

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft size={22} className="text-gray-600" />
                        </button>
                        <div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">Quản lý tập phim</div>
                            <p className="text-gray-600 text-[18px]">{episodes[0]?.movieTitle}</p>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
                                <div className="relative min-w-0 flex-1 max-w-md">
                                    <Search
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tập phim..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[150px]"
                                >
                                    <option value="ALL">Tất cả trạng thái</option>
                                    <option value="PUBLISHED">Công khai</option>
                                    <option value="DRAFT">Bản nháp</option>
                                    <option value="PRIVATE">Lưu trữ</option>
                                </select>

                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] = e.target.value.split('-');
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[180px]"
                                >
                                    <option value="episodeNumber-asc">Tập phim (tăng dần)</option>
                                    <option value="episodeNumber-desc">Tập phim (giảm dần)</option>
                                    <option value="title-asc">Tên A-Z</option>
                                    <option value="title-desc">Tên Z-A</option>
                                    <option value="views-desc">Lượt xem (cao nhất)</option>
                                    <option value="createdAt-desc">Ngày tạo (mới nhất)</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium"
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                    Làm mới
                                </button>
                                <button
                                    onClick={handleAddEpisode}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
                                >
                                    <Plus size={16} />
                                    Thêm tập mới
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{totalEpisodes}</div>
                        <div className="text-gray-600 font-medium">Tổng số tập</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-3xl font-bold text-green-600 mb-2">{publishedEpisodes}</div>
                        <div className="text-gray-600 font-medium">Đã xuất bản</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-3xl font-bold text-orange-600 mb-2">{formatViews(totalViews)}</div>
                        <div className="text-gray-600 font-medium">Tổng lượt xem</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-3xl font-bold text-purple-600 mb-2">{formatDuration(totalDuration)}</div>
                        <div className="text-gray-600 font-medium">Tổng thời lượng</div>
                    </div>
                </div>

                {/* Episode List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {loading && (
                        <div className="p-16 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={32} />
                            <p className="text-gray-600 text-lg">Đang tải...</p>
                        </div>
                    )}

                    {!loading && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                    <tr>
                                        <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tập phim
                                        </th>
                                        <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Thông tin
                                        </th>
                                        <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Thời lượng
                                        </th>
                                        <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-8 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Ngày tạo
                                        </th>
                                        <th className="px-8 py-6 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/50 divide-y divide-gray-100">
                                    {filteredEpisodes.length > 0 ? (
                                        filteredEpisodes.map((episode) => (
                                            <tr
                                                key={episode?.id || Math.random()}
                                                className="hover:bg-white/80 transition-all duration-200 group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-20 bg-gradient-to-br from-blue-100 via-purple-50 to-blue-200 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                                                            <FileVideo className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900 mb-1">
                                                                Tập {episode?.episodeNumber || 'N/A'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 font-mono">
                                                                #{episode?.id || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs">
                                                        <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                                                            {episode?.title || 'Chưa có tiêu đề'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 line-clamp-2">
                                                            {episode?.description || 'Chưa có mô tả'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center text-xs text-gray-700 font-medium bg-gray-100 px-2 py-1.5 rounded-md w-fit">
                                                        <Clock size={12} className="mr-1.5 text-gray-500" />
                                                        {formatDuration(episode?.duration)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 min-w-[120px]">
                                                    {getStatusBadge(episode?.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1.5 rounded-md w-fit">
                                                        <Calendar size={12} className="mr-1.5 text-gray-400" />
                                                        {episode?.createdAt || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {episode?.videoUrl && (
                                                            <button
                                                                title="Xem trước"
                                                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                                            >
                                                                <Play size={16} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleEditEpisode(episode?.id)}
                                                            title="Chỉnh sửa"
                                                            disabled={loading || !episode?.id}
                                                            className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-md transform hover:scale-105"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteEpisode(episode?.id)}
                                                            title="Xóa"
                                                            disabled={loading || !episode?.id}
                                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-md transform hover:scale-105"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                                        <FileVideo size={48} className="text-blue-500" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                        Chưa có tập phim nào
                                                    </h3>
                                                    <p className="text-gray-500 mb-8 max-w-md text-lg">
                                                        Bắt đầu bằng cách thêm tập phim đầu tiên cho bộ phim này.
                                                    </p>
                                                    <button
                                                        onClick={handleAddEpisode}
                                                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                                    >
                                                        <Plus size={20} />
                                                        Thêm tập đầu tiên
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Episode Form Modal */}
                {showEpisodeForm && (
                    <EpisodeForm
                        episode={selectedEpisode}
                        movieId={movieId}
                        movieTitle={episodes[0]?.movieTitle}
                        nextEpisodeNumber={maxEpisodeNumber + 1}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
};

export default EpisodeManagement;
