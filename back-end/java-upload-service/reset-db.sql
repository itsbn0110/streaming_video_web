SET FOREIGN_KEY_CHECKS = 0;
-- Script để reset hoàn toàn database
-- Cảnh báo: Script này sẽ xóa hết dữ liệu

-- Chọn database
USE streaming_web;

-- Tắt foreign key check tạm thời để xóa bảng
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa tất cả các bảng hiện có
DROP TABLE IF EXISTS movie_actor;
DROP TABLE IF EXISTS movie_director;
DROP TABLE IF EXISTS movie_genre;
DROP TABLE IF EXISTS movie_category;
DROP TABLE IF EXISTS movie_country;
DROP TABLE IF EXISTS playlist_movies;
DROP TABLE IF EXISTS playlist_movie;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS episode;
DROP TABLE IF EXISTS playlist;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS genre;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS country;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS permission;
DROP TABLE IF EXISTS invalidated_token;
DROP TABLE IF EXISTS migration_tracking;

-- Xóa bảng Flyway history
DROP TABLE IF EXISTS flyway_schema_history;

-- Bật lại foreign key check
SET FOREIGN_KEY_CHECKS = 1;

-- Thông báo hoàn thành
SELECT 'Database reset completed successfully!' AS Result;
-- Junction tables
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS movie_genre;
DROP TABLE IF EXISTS movie_category;
DROP TABLE IF EXISTS movie_country;
DROP TABLE IF EXISTS movie_director;
DROP TABLE IF EXISTS movie_actor;
DROP TABLE IF EXISTS playlist_movies;
DROP TABLE IF EXISTS playlist_movie;

-- Entity tables 
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS episode;
DROP TABLE IF EXISTS playlists;
DROP TABLE IF EXISTS invalidated_token;
DROP TABLE IF EXISTS migration_tracking;

-- Main tables
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS person;

-- Flyway table
DROP TABLE IF EXISTS flyway_schema_history;

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Thông báo kết quả
SELECT 'Database has been completely reset. Now you can run Flyway migrate again.' AS message;
