import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import NodeCache from 'node-cache';

const app = express();
const port = 3000;

// Khởi tạo cache
const videoInfoCache = new NodeCache({
    stdTTL: 3600, // 1 giờ
    checkperiod: 120, // kiểm tra hết hạn sau mỗi 2 phút
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    }),
);

const getVideoResponse = async (movieId) => {
    // Kiểm tra cache trước
    const cacheKey = `movie_info:${movieId}`;
    const cachedData = videoInfoCache.get(cacheKey);

    if (cachedData) {
        console.log('Sử dụng thông tin phim từ cache:', movieId);
        return { data: cachedData };
    }

    // Nếu không có trong cache, gọi API
    try {
        const res = await axios.get(`http://localhost:8082/api/movies/golang/${movieId}`);

        // Lưu vào cache
        videoInfoCache.set(cacheKey, res.data);
        return res;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin phim:', error.message);
        throw error;
    }
};

// Cấu hình các API keys để luân phiên sử dụng
const API_KEYS = [
    'AIzaSyACCAxVDycTZW5kg5MEe-EMmC0ZTyxMcok',
    'AIzaSyAQINhuGU9lFotdZBKLbV0F8jHuy8JGsGc',
    'AIzaSyDHfMloDeUbqitW86if_pxibGu1SDGQxgU',
    'AIzaSyDkBISlfqL3GAKiVJipC4AbO2JC0G7zCng',
];

// Biến để theo dõi API key hiện tại đang sử dụng
let currentKeyIndex = 0;

// Hàm lấy API key tiếp theo
const getNextApiKey = () => {
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
};

app.get('/stream/:movieId', async (req, res) => {
    const movieId = req.params.movieId;
    const range = req.headers.range;

    if (!range) {
        return res.status(400).send('Requires Range header');
    }

    try {
        // Lấy thông tin videoId
        const videoResponse = await getVideoResponse(movieId);
        const videoID = videoResponse.data.result.videoId;
        console.log('videoID: ', videoID);

        // Lấy API key
        const apiKey = getNextApiKey();
        console.log('Sử dụng API key:', apiKey);

        // URL để lấy video từ Google Drive
        const googleDriveURL = `https://www.googleapis.com/drive/v3/files/${videoID}?alt=media&key=${apiKey}`;

        // Gửi request đến Google Drive với range từ trình duyệt
        const response = await axios({
            method: 'GET',
            url: googleDriveURL,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Node.js Proxy Streaming',
                Accept: 'video/mp4',
                Range: range,
            },
            timeout: 30000, // timeout sau 30 giây
        });

        // Thiết lập headers từ response của Google Drive
        const contentRange = response.headers['content-range'];
        const contentLength = response.headers['content-length'];
        const contentType = response.headers['content-type'] || 'video/mp4';

        // Trả về response với status 206 (Partial Content)
        res.status(206);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', contentLength);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Range', contentRange);
        res.setHeader('Cache-Control', 'public, max-age=3600');

        // Stream dữ liệu từ Google Drive đến client
        response.data.pipe(res);
    } catch (error) {
        console.error('Lỗi khi proxy video:', error.message);

        // Log chi tiết lỗi nếu có
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);

            // Nếu lỗi là do API key (403 Forbidden), thử với key khác
            if (error.response.status === 403 && API_KEYS.length > 1) {
                console.log('Thử lại với API key khác do lỗi 403');
                // Chỉ thử lại nếu chưa thử qua tất cả các keys
                if (!req.retryCount || req.retryCount < API_KEYS.length) {
                    req.retryCount = (req.retryCount || 0) + 1;
                    return app._router.handle(req, res);
                }
            }
        }

        res.status(500).json({ error: 'Không thể truy xuất video' });
    }
});

// Thêm endpoint để xem trạng thái cache
app.get('/cache-status', (req, res) => {
    const stats = videoInfoCache.getStats();
    res.json({
        hits: stats.hits,
        misses: stats.misses,
        keys: stats.keys,
        ksize: stats.ksize,
        vsize: stats.vsize,
    });
});

// Thêm endpoint để xóa cache
app.post('/clear-cache', (req, res) => {
    try {
        videoInfoCache.flushAll();
        res.json({ success: true, message: 'Cache đã được xóa' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Server streaming video đang chạy');
});

app.listen(port, () => {
    console.log(`Server đang chạy trên cổng ${port}`);
});
