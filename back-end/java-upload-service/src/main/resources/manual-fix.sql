-- Script này dùng để khắc phục lỗi Flyway migration thủ công
-- Chạy script này trực tiếp trong MySQL CLI hoặc MySQL Workbench

-- 1. Chọn database
USE streaming_web;

-- 2. Xóa bảng quản lý Flyway
DROP TABLE IF EXISTS flyway_schema_history;

-- 3. Kiểm tra và sửa bảng playlist_movie
-- Kiểm tra xem bảng playlist_movies có tồn tại không
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables 
                     WHERE table_schema = DATABASE() 
                     AND table_name = 'playlist_movies');

SET @new_table_exists = (SELECT COUNT(*) FROM information_schema.tables 
                        WHERE table_schema = DATABASE() 
                        AND table_name = 'playlist_movie');

-- Nếu cả hai bảng đều không tồn tại, tạo mới bảng playlist_movie
SET @create_table = IF(@table_exists = 0 AND @new_table_exists = 0, 1, 0);

SET @create_sql = '
CREATE TABLE IF NOT EXISTS playlist_movie (
    playlist_id BIGINT NOT NULL,
    movie_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (playlist_id, movie_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
)';

-- Chạy lệnh tạo bảng nếu cần
SET @sql = IF(@create_table = 1, @create_sql, 'SELECT "Skipping table creation"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Nếu bảng playlist_movies tồn tại nhưng playlist_movie không tồn tại, đổi tên bảng
SET @rename_needed = IF(@table_exists > 0 AND @new_table_exists = 0, 1, 0);
SET @rename_sql = 'RENAME TABLE playlist_movies TO playlist_movie';

SET @sql = IF(@rename_needed = 1, @rename_sql, 'SELECT "Skipping table rename"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Kiểm tra cột movies_id trong bảng playlist_movie
SET @column_exists = (SELECT COUNT(*) 
                     FROM information_schema.columns 
                     WHERE table_schema = DATABASE() 
                     AND table_name = 'playlist_movie' 
                     AND column_name = 'movies_id');

-- Thay đổi tên cột movies_id thành movie_id nếu tồn tại
SET @column_rename_needed = IF(@column_exists > 0, 1, 0);
SET @alter_sql = 'ALTER TABLE playlist_movie CHANGE COLUMN movies_id movie_id VARCHAR(36) NOT NULL';

SET @sql = IF(@column_rename_needed = 1, @alter_sql, 'SELECT "Skipping column rename"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Kiểm tra kết quả
SELECT table_name FROM information_schema.tables 
 WHERE table_schema = DATABASE() 
 AND table_name LIKE 'playlist%';

SELECT column_name FROM information_schema.columns 
 WHERE table_schema = DATABASE() 
 AND table_name = 'playlist_movie';
