# Hướng dẫn Database Migration với Flyway

## Giới thiệu

 phiên bảnDự án này sử dụng Flyway để quản lý các thay đổi database schema. Flyway giúp theo dõi, kiểm soát và áp dụng các thay đổi schema một cách nhất quán trên tất cả môi trường (development, staging, production).

## Cách thức hoạt động

Flyway quản lý database migrations thông qua các file SQL được đánh số phiên bản. Các file này được đặt trong thư mục `src/main/resources/db/migration`. Khi ứng dụng khởi động, Flyway sẽ:

1. Tạo bảng `flyway_schema_history` để theo dõi các migration đã được áp dụng
2. Đối chiếu các file migration với bảng lịch sử để xác định migration nào cần chạy
3. Chạy các migration mới theo thứ tự

## Quy tắc đặt tên file migration

Format tên file: `V{version}__{description}.sql`

- `V` - Prefix bắt buộc
- `{version}` - Số phiên bản (1, 2, 3, ... hoặc 1.1, 1.2, ...)
- `__` - Hai dấu gạch dưới
- `{description}` - Mô tả ngắn gọn, sử dụng dấu gạch dưới thay cho khoảng trắng

Ví dụ:
- `V1__Initial_schema.sql`
- `V2__Add_indexes.sql`
- `V3__Create_new_table.sql`

## Làm việc với database migration

### Tạo migration mới

1. Tạo file SQL mới trong thư mục `src/main/resources/db/migration`
2. Đặt tên file theo quy tắc: `V{next_version}__{description}.sql`
3. Viết SQL cần thiết cho migration

### Chạy migration

Flyway sẽ tự động chạy migration khi ứng dụng khởi động. Để chạy thủ công, sử dụng Maven:

```bash
# Hiển thị trạng thái hiện tại của migration
mvn flyway:info

# Chạy migration
mvn flyway:migrate
```

### Kiểm tra lịch sử migration

```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;
```

## Môi trường phát triển

Trong môi trường dev, bạn có thể reset database bằng lệnh:

```bash
# Cảnh báo: Lệnh này sẽ xóa toàn bộ dữ liệu
mvn flyway:clean

# Chạy lại migration
mvn flyway:migrate
```

## Xử lý lỗi migration

Nếu một migration bị lỗi:

1. Sửa lỗi trong SQL migration
2. Xóa record migration bị lỗi từ bảng `flyway_schema_history`
3. Chạy lại migration

Hoặc trong môi trường dev:

1. Sửa lỗi trong SQL migration
2. Chạy `mvn flyway:clean` (cẩn thận: sẽ xóa toàn bộ dữ liệu)
3. Chạy lại `mvn flyway:migrate`

## Quy trình làm việc an toàn

1. **Backup database** trước khi áp dụng migration mới
2. **Chạy thử nghiệm** trên môi trường dev/staging trước khi áp dụng lên production
3. **Không sửa đổi** migration đã được áp dụng
4. **Viết migration có thể rollback** khi có thể

## Best practices

1. **Mỗi migration chỉ nên thực hiện một thay đổi logic** để dễ quản lý và rollback
2. **Không bao giờ sửa đổi migration đã áp dụng** - tạo migration mới để sửa lỗi
3. **Luôn backup database trước khi chạy migration** trên production
4. **Test kỹ migration** trên môi trường non-production
5. **Giữ migration nhỏ gọn** để giảm thời gian lock database

## Giải quyết vấn đề phổ biến

### Migration failed but database changed

Trong trường hợp migration bị lỗi nhưng đã thay đổi database:

1. Fix lỗi trong SQL
2. Xóa entry từ bảng `flyway_schema_history`
3. Sửa thủ công database nếu cần
4. Chạy lại migration

### Checksum mismatch error

Lỗi này xảy ra khi nội dung file migration đã thay đổi sau khi đã được áp dụng:

1. **Không bao giờ sửa đổi migration đã áp dụng**
2. Nếu cần sửa, hãy tạo migration mới

## Kết luận

Flyway giúp quản lý schema database một cách an toàn và nhất quán. Tuân thủ các best practices và quy trình làm việc sẽ giúp tránh được các vấn đề liên quan đến database schema trong quá trình phát triển và triển khai.
