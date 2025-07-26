# Hướng dẫn triển khai Thống kê Người dùng

Tài liệu này mô tả cách triển khai chức năng thống kê người dùng cho ứng dụng web streaming phim.

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Các loại thống kê](#các-loại-thống-kê)
3. [Thiết kế kỹ thuật](#thiết-kế-kỹ-thuật)
4. [Mô tả API](#mô-tả-api)
5. [Triển khai chi tiết](#triển-khai-chi-tiết)
6. [Trực quan hóa dữ liệu](#trực-quan-hóa-dữ-liệu)

## Tổng quan

Chức năng thống kê người dùng cho phép quản trị viên có cái nhìn tổng quan về các hoạt động của người dùng trên nền tảng, giúp đưa ra các quyết định kinh doanh và cải thiện trải nghiệm người dùng.

## Các loại thống kê

### 1. Thống kê tổng quát

- Tổng số người dùng đăng ký
- Số người dùng mới trong ngày/tuần/tháng
- Tỷ lệ người dùng đăng nhập hàng ngày (DAU - Daily Active Users)
- Tỷ lệ người dùng đăng nhập hàng tháng (MAU - Monthly Active Users)
- Thời gian trung bình mỗi phiên xem phim

### 2. Thống kê nội dung

- Top phim được xem nhiều nhất
- Top phim được đánh giá cao nhất
- Top phim được thêm vào danh sách yêu thích nhiều nhất
- Top thể loại phim được xem nhiều nhất
- Phân bố lượt xem theo thể loại

### 3. Thống kê tương tác

- Số lượng bình luận trung bình mỗi phim
- Số lượng đánh giá trung bình mỗi phim
- Số lượng playlist được tạo
- Số lượng phim trung bình trong mỗi playlist

### 4. Thống kê địa lý

- Phân bố người dùng theo quốc gia/khu vực
- Thời gian xem trung bình theo khu vực

## Thiết kế kỹ thuật

### Cấu trúc dữ liệu

Cần thêm các bảng và trường dữ liệu sau:

#### 1. Bảng UserActivity

```java
@Entity
@Table(name = "user_activities")
public class UserActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private ActivityType activityType; // LOGIN, WATCH, RATE, COMMENT, etc.

    @Column(name = "activity_data")
    private String activityData; // JSON data for specific activities

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Geolocation data
    private String country;
    private String region;
    private String city;

    // Device info
    private String deviceType;
    private String browser;
    private String operatingSystem;
}
```

#### 2. Bảng UserSession

```java
@Entity
@Table(name = "user_sessions")
public class UserSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "session_start")
    private LocalDateTime sessionStart;

    @Column(name = "session_end")
    private LocalDateTime sessionEnd;

    @Column(name = "duration_seconds")
    private Long durationSeconds;

    private String ipAddress;
    private String deviceInfo;
}
```

#### 3. Bảng WatchSession

```java
@Entity
@Table(name = "watch_sessions")
public class WatchSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(name = "watch_start")
    private LocalDateTime watchStart;

    @Column(name = "watch_end")
    private LocalDateTime watchEnd;

    @Column(name = "duration_seconds")
    private Long durationSeconds;

    @Column(name = "watched_percentage")
    private Double watchedPercentage;

    private Boolean completed;
}
```

## Mô tả API

### 1. API Thống kê tổng quát

```
GET /api/v1/admin/statistics/users/summary
```

Trả về thông tin tổng quan về người dùng.

### 2. API Thống kê theo thời gian

```
GET /api/v1/admin/statistics/users/time-series
```

Tham số:
- `period`: day, week, month, year
- `start_date`: Ngày bắt đầu (ISO format)
- `end_date`: Ngày kết thúc (ISO format)
- `metric`: registered, active, engagement

### 3. API Thống kê nội dung

```
GET /api/v1/admin/statistics/content
```

Tham số:
- `type`: views, ratings, favorites, comments
- `limit`: Số lượng kết quả (mặc định 10)
- `period`: all_time, day, week, month, year

### 4. API Thống kê địa lý

```
GET /api/v1/admin/statistics/geography
```

Trả về phân bố người dùng theo quốc gia/khu vực.

## Triển khai chi tiết

### 1. Tạo các Entity và Repository

Tạo các entity và repository cho UserActivity, UserSession và WatchSession như đã mô tả ở phần Cấu trúc dữ liệu.

### 2. Tạo Service xử lý thống kê

```java
@Service
public class StatisticsService {
    // Inject các repository cần thiết

    public UserStatsSummary getUserStatsSummary() {
        // Logic để tính toán thống kê tổng quát
    }

    public List<TimeSeriesData> getUserTimeSeriesData(String period, LocalDate startDate, LocalDate endDate, String metric) {
        // Logic để tính toán dữ liệu chuỗi thời gian
    }

    public List<ContentStats> getContentStats(String type, int limit, String period) {
        // Logic để lấy thống kê nội dung
    }

    public Map<String, Object> getGeographicStats() {
        // Logic để lấy thống kê địa lý
    }
}
```

### 3. Tạo Controller xử lý API

```java
@RestController
@RequestMapping("/api/v1/admin/statistics")
public class StatisticsController {
    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/users/summary")
    public ApiResponse<UserStatsSummary> getUserStatsSummary() {
        return ApiResponse.<UserStatsSummary>builder()
                .result(statisticsService.getUserStatsSummary())
                .build();
    }

    @GetMapping("/users/time-series")
    public ApiResponse<List<TimeSeriesData>> getUserTimeSeriesData(
            @RequestParam(defaultValue = "day") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "active") String metric) {

        return ApiResponse.<List<TimeSeriesData>>builder()
                .result(statisticsService.getUserTimeSeriesData(period, startDate, endDate, metric))
                .build();
    }

    @GetMapping("/content")
    public ApiResponse<List<ContentStats>> getContentStats(
            @RequestParam(defaultValue = "views") String type,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "all_time") String period) {

        return ApiResponse.<List<ContentStats>>builder()
                .result(statisticsService.getContentStats(type, limit, period))
                .build();
    }

    @GetMapping("/geography")
    public ApiResponse<Map<String, Object>> getGeographicStats() {
        return ApiResponse.<Map<String, Object>>builder()
                .result(statisticsService.getGeographicStats())
                .build();
    }
}
```

### 4. Theo dõi hoạt động người dùng

Cần tạo một Aspect hoặc Filter để ghi lại hoạt động người dùng:

```java
@Aspect
@Component
public class UserActivityLogger {
    private final UserActivityRepository userActivityRepository;
    private final HttpServletRequest request;

    @Autowired
    public UserActivityLogger(UserActivityRepository userActivityRepository, HttpServletRequest request) {
        this.userActivityRepository = userActivityRepository;
        this.request = request;
    }

    @AfterReturning(pointcut = "execution(* dev.streaming.upload.controllers.*.*(..)) && @annotation(org.springframework.web.bind.annotation.GetMapping)")
    public void logUserActivity(JoinPoint joinPoint) {
        // Logic để ghi lại hoạt động người dùng
        // Lấy thông tin user từ security context
        // Lấy thông tin device từ request headers
        // Lưu vào database
    }
}
```

### 5. Theo dõi phiên xem phim

Tạo một WebSocket hoặc API để theo dõi phiên xem phim của người dùng:

```java
@RestController
@RequestMapping("/api/v1/watch-sessions")
public class WatchSessionController {
    private final WatchSessionService watchSessionService;

    @PostMapping("/start")
    public ApiResponse<WatchSessionDTO> startWatchSession(@RequestBody WatchSessionRequest request) {
        // Logic để bắt đầu phiên xem phim
    }

    @PostMapping("/update")
    public ApiResponse<WatchSessionDTO> updateWatchSession(@RequestBody WatchSessionUpdateRequest request) {
        // Logic để cập nhật tiến độ xem phim
    }

    @PostMapping("/end")
    public ApiResponse<WatchSessionDTO> endWatchSession(@RequestBody WatchSessionEndRequest request) {
        // Logic để kết thúc phiên xem phim
    }
}
```

## Trực quan hóa dữ liệu

Sử dụng thư viện Chart.js hoặc D3.js để hiển thị dữ liệu thống kê trên giao diện admin:

1. **Dashboard tổng quan:**
   - Hiển thị số liệu tổng quát như số người dùng, số phim, số lượt xem, v.v.
   - Biểu đồ người dùng mới theo thời gian
   - Biểu đồ hoạt động theo thời gian

2. **Phân tích nội dung:**
   - Biểu đồ cột cho top phim được xem nhiều nhất
   - Biểu đồ tròn cho phân bố lượt xem theo thể loại
   - Biểu đồ nhiệt cho lượt xem theo giờ trong ngày

3. **Phân tích người dùng:**
   - Bản đồ nhiệt cho phân bố địa lý của người dùng
   - Biểu đồ cho thời gian trung bình mỗi phiên xem
   - Biểu đồ cho tỷ lệ người dùng theo loại thiết bị

### Ví dụ React Component

```jsx
import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';

const StatisticsDashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      const summary = await axios.get('/api/v1/admin/statistics/users/summary');
      const timeSeries = await axios.get('/api/v1/admin/statistics/users/time-series?metric=active&period=month');
      const content = await axios.get('/api/v1/admin/statistics/content?type=views&limit=10');

      setSummaryData(summary.data.result);
      setTimeSeriesData(timeSeries.data.result);
      setContentData(content.data.result);
    };

    fetchData();
  }, []);

  // Prepare chart data
  const prepareTimeSeriesChartData = () => {
    if (!timeSeriesData) return null;

    return {
      labels: timeSeriesData.map(item => item.date),
      datasets: [
        {
          label: 'Số người dùng hoạt động',
          data: timeSeriesData.map(item => item.value),
          fill: false,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    };
  };

  // Render loading state if data not yet available
  if (!summaryData || !timeSeriesData || !contentData) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard Thống kê</h1>

      <div className="summary-cards">
        <div className="card">
          <h3>Tổng số người dùng</h3>
          <p className="number">{summaryData.totalUsers}</p>
        </div>
        <div className="card">
          <h3>Người dùng mới hôm nay</h3>
          <p className="number">{summaryData.newUsersToday}</p>
        </div>
        <div className="card">
          <h3>Lượt xem hôm nay</h3>
          <p className="number">{summaryData.viewsToday}</p>
        </div>
      </div>

      <div className="chart-container">
        <h2>Người dùng hoạt động theo tháng</h2>
        <Line data={prepareTimeSeriesChartData()} />
      </div>

      <div className="chart-container">
        <h2>Top 10 phim được xem nhiều nhất</h2>
        <Bar 
          data={{
            labels: contentData.map(item => item.title),
            datasets: [
              {
                label: 'Lượt xem',
                data: contentData.map(item => item.views),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgb(153, 102, 255)',
                borderWidth: 1
              }
            ]
          }} 
        />
      </div>
    </div>
  );
};

export default StatisticsDashboard;
```

---

## Kết luận

Việc triển khai hệ thống thống kê người dùng sẽ giúp bạn nắm bắt được hành vi và sở thích của người dùng, từ đó cải thiện nội dung và trải nghiệm người dùng trên nền tảng streaming phim của bạn. Các dữ liệu thống kê này còn có thể được sử dụng để đưa ra các quyết định kinh doanh quan trọng như lựa chọn nội dung mới, cải thiện tính năng, hoặc tối ưu hóa chiến lược marketing.

Để triển khai hiệu quả, bạn nên theo dõi và phân tích dữ liệu thường xuyên, đồng thời không ngừng cải thiện hệ thống thống kê để có được những thông tin hữu ích nhất.
