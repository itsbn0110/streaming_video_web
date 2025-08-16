// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import classNames from 'classnames/bind';
// import { Plus, Save, ArrowLeft, Trash2, Upload, Edit, Eye } from 'lucide-react';
// import { fetchMovieEpisodesAPI, createEpisodeAPI, updateEpisodeAPI, deleteEpisodeAPI, fetchMovieDataAPI } from '@/apis';
// import EpisodeForm from './EpisodeForm';
// import styles from '../../AdminLayout.module.scss';

// const cx = classNames.bind(styles);

// const EpisodeManager = () => {
//     const { movieId } = useParams();
//     const navigate = useNavigate();

//     const [movie, setMovie] = useState(null);
//     const [episodes, setEpisodes] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [editingEpisode, setEditingEpisode] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchMovieData();
//         fetchEpisodes();
//     }, [movieId]);

//     const fetchMovieData = async () => {
//         try {
//             const response = await fetchMovieDataAPI(movieId);
//             if (response && response.result) {
//                 setMovie(response.result);
//             }
//         } catch (err) {
//             console.error('Error fetching movie data:', err);
//             setError('Không thể lấy thông tin phim');
//         }
//     };

//     const fetchEpisodes = async () => {
//         try {
//             setLoading(true);
//             const response = await fetchMovieEpisodesAPI(movieId);
//             if (response && response.result) {
//                 setEpisodes(response.result.sort((a, b) => a.episodeNumber - b.episodeNumber));
//             }
//         } catch (err) {
//             console.error('Error fetching episodes:', err);
//             setError('Không thể lấy danh sách tập phim');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddEpisode = () => {
//         setEditingEpisode(null);
//         setShowForm(true);
//     };

//     const handleEditEpisode = (episode) => {
//         setEditingEpisode(episode);
//         setShowForm(true);
//     };

//     const handleDeleteEpisode = async (episodeId) => {
//         if (!window.confirm('Bạn có chắc chắn muốn xóa tập phim này?')) {
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await deleteEpisodeAPI(episodeId);
//             if (response) {
//                 await fetchEpisodes();
//                 alert('Xóa tập phim thành công!');
//             }
//         } catch (err) {
//             console.error('Error deleting episode:', err);
//             setError('Không thể xóa tập phim');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleFormSubmit = async (episodeData) => {
//         try {
//             setLoading(true);
//             let response;

//             if (editingEpisode) {
//                 response = await updateEpisodeAPI(editingEpisode.id, episodeData);
//             } else {
//                 response = await createEpisodeAPI(movieId, episodeData);
//             }

//             if (response && response.result) {
//                 await fetchEpisodes();
//                 setShowForm(false);
//                 setEditingEpisode(null);
//                 alert(editingEpisode ? 'Cập nhật tập phim thành công!' : 'Thêm tập phim thành công!');
//             }
//         } catch (err) {
//             console.error('Error submitting episode:', err);
//             setError('Không thể lưu tập phim');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getNextEpisodeNumber = () => {
//         if (episodes.length === 0) return 1;
//         return Math.max(...episodes.map((ep) => ep.episodeNumber)) + 1;
//     };

//     if (!movie) {
//         return (
//             <div className={cx('loading-container')}>
//                 <div>Đang tải thông tin phim...</div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className={cx('page-header')}>
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <button
//                         onClick={() => navigate(-1)}
//                         style={{
//                             background: 'none',
//                             border: 'none',
//                             display: 'flex',
//                             alignItems: 'center',
//                             cursor: 'pointer',
//                             marginRight: '12px',
//                             color: '#4a5568',
//                         }}
//                     >
//                         <ArrowLeft size={20} />
//                     </button>
//                     <div>
//                         <h2>Quản lý tập phim</h2>
//                         <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
//                             {movie.title} ({episodes.length} tập)
//                         </div>
//                     </div>
//                 </div>
//                 <button className={cx('button-primary')} onClick={handleAddEpisode} disabled={loading}>
//                     <Plus size={16} />
//                     Thêm tập mới
//                 </button>
//             </div>

//             {error && (
//                 <div className={cx('alert', 'alert-danger')} style={{ marginBottom: '1rem' }}>
//                     {error}
//                 </div>
//             )}

//             {/* Movie Info Card */}
//             <div className={cx('card')} style={{ marginBottom: '24px' }}>
//                 <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
//                     {movie.thumbnail && (
//                         <img
//                             src={movie.thumbnail}
//                             alt={movie.title}
//                             style={{
//                                 width: '120px',
//                                 height: '180px',
//                                 objectFit: 'cover',
//                                 borderRadius: '8px',
//                             }}
//                         />
//                     )}
//                     <div style={{ flex: 1 }}>
//                         <h3 style={{ marginBottom: '8px', fontSize: '24px' }}>{movie.title}</h3>
//                         {movie.originalTitle && (
//                             <p style={{ marginBottom: '8px', fontSize: '16px', color: '#666' }}>
//                                 {movie.originalTitle}
//                             </p>
//                         )}
//                         <p style={{ marginBottom: '12px', color: '#666', lineHeight: '1.5' }}>{movie.description}</p>
//                         <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
//                             <span>Năm: {movie.releaseYear}</span>
//                             <span>Trạng thái: {movie.status}</span>
//                             <span>Premium: {movie.premium ? 'Có' : 'Không'}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Episodes List */}
//             <div className={cx('card')}>
//                 <div className={cx('card-header')}>
//                     <h3>Danh sách tập phim</h3>
//                 </div>

//                 {loading ? (
//                     <div style={{ padding: '40px', textAlign: 'center' }}>
//                         <div>Đang tải...</div>
//                     </div>
//                 ) : episodes.length === 0 ? (
//                     <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
//                         <div style={{ marginBottom: '16px' }}>
//                             <PlayCircle size={48} color="#ccc" />
//                         </div>
//                         <div style={{ fontSize: '18px', marginBottom: '8px' }}>Chưa có tập phim nào</div>
//                         <div style={{ fontSize: '14px' }}>
//                             Nhấn "Thêm tập mới" để bắt đầu thêm tập phim cho bộ phim này
//                         </div>
//                     </div>
//                 ) : (
//                     <div className={cx('table-container')}>
//                         <table className={cx('table')}>
//                             <thead>
//                                 <tr>
//                                     <th style={{ width: '80px' }}>Tập</th>
//                                     <th style={{ width: '120px' }}>Thumbnail</th>
//                                     <th>Tên tập</th>
//                                     <th style={{ width: '100px' }}>Thời lượng</th>
//                                     <th style={{ width: '120px' }}>Trạng thái</th>
//                                     <th style={{ width: '150px' }}>Thao tác</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {episodes.map((episode) => (
//                                     <tr key={episode.id}>
//                                         <td>
//                                             <span
//                                                 style={{
//                                                     fontWeight: '600',
//                                                     padding: '4px 8px',
//                                                     backgroundColor: '#f0f0f0',
//                                                     borderRadius: '4px',
//                                                 }}
//                                             >
//                                                 {episode.episodeNumber}
//                                             </span>
//                                         </td>
//                                         <td>
//                                             {episode.thumbnail ? (
//                                                 <img
//                                                     src={episode.thumbnail}
//                                                     alt={`Tập ${episode.episodeNumber}`}
//                                                     style={{
//                                                         width: '80px',
//                                                         height: '45px',
//                                                         objectFit: 'cover',
//                                                         borderRadius: '4px',
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <div
//                                                     style={{
//                                                         width: '80px',
//                                                         height: '45px',
//                                                         backgroundColor: '#f0f0f0',
//                                                         borderRadius: '4px',
//                                                         display: 'flex',
//                                                         alignItems: 'center',
//                                                         justifyContent: 'center',
//                                                     }}
//                                                 >
//                                                     <Upload size={16} color="#999" />
//                                                 </div>
//                                             )}
//                                         </td>
//                                         <td>
//                                             <div style={{ fontWeight: '500' }}>
//                                                 {episode.title || `Tập ${episode.episodeNumber}`}
//                                             </div>
//                                             {episode.description && (
//                                                 <div
//                                                     style={{
//                                                         fontSize: '12px',
//                                                         color: '#666',
//                                                         marginTop: '4px',
//                                                         overflow: 'hidden',
//                                                         textOverflow: 'ellipsis',
//                                                         whiteSpace: 'nowrap',
//                                                     }}
//                                                 >
//                                                     {episode.description}
//                                                 </div>
//                                             )}
//                                         </td>
//                                         <td>{episode.duration ? `${Math.floor(episode.duration)} phút` : '-'}</td>
//                                         <td>
//                                             <span
//                                                 className={cx('status-badge', {
//                                                     'status-active': episode.streamUrl,
//                                                     'status-inactive': !episode.streamUrl,
//                                                 })}
//                                             >
//                                                 {episode.streamUrl ? 'Đã upload' : 'Chưa upload'}
//                                             </span>
//                                         </td>
//                                         <td>
//                                             <div style={{ display: 'flex', gap: '8px' }}>
//                                                 <button
//                                                     className={cx('button-icon')}
//                                                     onClick={() => handleEditEpisode(episode)}
//                                                     title="Chỉnh sửa"
//                                                 >
//                                                     <Edit size={16} />
//                                                 </button>
//                                                 <button
//                                                     className={cx('button-icon', 'button-danger')}
//                                                     onClick={() => handleDeleteEpisode(episode.id)}
//                                                     title="Xóa"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Episode Form Modal */}
//             {showForm && (
//                 <EpisodeForm
//                     episode={editingEpisode}
//                     movieId={movieId}
//                     nextEpisodeNumber={getNextEpisodeNumber()}
//                     onSubmit={handleFormSubmit}
//                     onCancel={() => {
//                         setShowForm(false);
//                         setEditingEpisode(null);
//                     }}
//                     loading={loading}
//                 />
//             )}
//         </div>
//     );
// };

// export default EpisodeManager;
