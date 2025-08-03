# Hướng dẫn thiết lập và sử dụng Flyway Migration

## Thiết lập hiện tại

Hệ thống hiện đang sử dụng Flyway để quản lý tất cả thay đổi database:

1. **Hibernate Validate**: Chỉ kiểm tra và xác nhận schema đúng với entity
   ```yaml
   jpa:
     hibernate:
       ddl-auto: validate
     generate-ddl: false
   ```

2. **Flyway**: Theo dõi và quản lý tất cả thay đổi database
   ```yaml
   flyway:
     enabled: true
     baseline-on-migrate: true
     locations: classpath:db/migration
     clean-disabled: false
     repair-on-migrate: true
   ```

## Cách thức hoạt động

- **Khởi động đầu tiên**: Flyway sẽ thực hiện migration V1 để tạo toàn bộ schema ban đầu
- **Thay đổi Entity**: Mọi thay đổi entity đều cần thêm file migration mới
- **Quản lý thay đổi**: Tất cả các thay đổi database đều được quản lý qua các file migration

## Cách tạo migration mới

Khi cần thay đổi database (thêm bảng, sửa cấu trúc, thêm cột, v.v.):

1. Tạo file migration mới trong thư mục `src/main/resources/db/migration`
2. Đặt tên file theo định dạng `V{version}__{description}.sql`
   - Ví dụ: `V3__Add_new_column.sql`
3. Viết SQL cần thiết trong file
   - Ví dụ: `ALTER TABLE users ADD COLUMN phone VARCHAR(20);`
4. Cập nhật entity Java tương ứng với thay đổi database

## Lưu ý quan trọng

1. **Không sửa đổi file migration đã áp dụng**
2. **Version phải tăng dần**: V1, V2, V3, ...
3. **Luôn backup database trước khi áp dụng migration mới**
4. **Tất cả thay đổi schema đều phải có migration**

## Ưu điểm của thiết lập hiện tại

1. **Kiểm soát chặt chẽ**: Mọi thay đổi database đều được quản lý và theo dõi
2. **Khả năng rollback**: Có thể quay lại phiên bản trước khi cần thiết
3. **Phù hợp cho production**: Áp dụng được cho môi trường sản phẩm thực tế
4. **Phối hợp tốt**: Nhiều developer có thể làm việc trên cùng một codebase

## Quy trình khi thay đổi entity

1. Cập nhật entity Java (thêm field, sửa annotation, v.v.)
2. Tạo file migration SQL cho thay đổi tương ứng
3. Chạy lệnh `mvn flyway:info` để kiểm tra migration mới đã được nhận diện
4. Khởi động ứng dụng để áp dụng migration

## Các lệnh hữu ích

```bash
# Kiểm tra trạng thái migration
./mvnw flyway:info

# Xóa và tạo lại database schema (chỉ dùng cho môi trường phát triển)
./mvnw flyway:clean

# Tạo database schema bằng Flyway migration
./mvnw flyway:migrate

# Sửa chữa bảng flyway_schema_history khi có vấn đề
./mvnw flyway:repair
```

## Khắc phục sự cố

Khi gặp lỗi schema không khớp với entity:

1. Kiểm tra log để xác định entity và cột gây lỗi
2. Tạo migration mới để cập nhật schema cho phù hợp
3. Nếu cần thiết, sử dụng lệnh repair:

```bash
./mvnw flyway:repair
```

Khi gặp lỗi checksum (do sửa file migration cũ):

```bash
# Sửa chữa lỗi checksum trong bảng flyway_schema_history
./mvnw flyway:repair -Dflyway.ignoreFailedMigrations=true
```

Nếu cần reset hoàn toàn (chỉ trong môi trường phát triển):

```bash
# Chạy script reset-db.sql
mysql -u root -p < reset-db.sql

# Khởi động lại ứng dụng
./mvnw spring-boot:run
```
