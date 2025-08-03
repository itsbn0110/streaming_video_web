-- Initial schema based on JPA entities

-- Roles table
CREATE TABLE IF NOT EXISTS role (
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    description VARCHAR(255)
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permission (
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    description VARCHAR(255)
);

-- Role-Permission junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_name VARCHAR(255) NOT NULL,
    permissions_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_name, permissions_name),
    FOREIGN KEY (role_name) REFERENCES role (name),
    FOREIGN KEY (permissions_name) REFERENCES permission (name)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    dob DATE
);

-- User-Role junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(36) NOT NULL,
    roles_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, roles_name),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (roles_name) REFERENCES role (name)
);

-- Countries table
CREATE TABLE IF NOT EXISTS country (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS category (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Genres table
CREATE TABLE IF NOT EXISTS genre (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Persons table (for actors and directors)
CREATE TABLE IF NOT EXISTS person (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    profile_photo VARCHAR(255),
    biography TEXT
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    trailer_link VARCHAR(255),
    description TEXT NOT NULL,
    release_year INT NOT NULL,
    thumbnail VARCHAR(255) NOT NULL,
    backdrop VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    premium BOOLEAN NOT NULL,
    folder_id VARCHAR(255),
    duration DOUBLE NOT NULL,
    stream_url VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    views INT DEFAULT 0,
    average_rating DOUBLE DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
);

-- Episodes table
CREATE TABLE IF NOT EXISTS episode (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    season INT NOT NULL,
    episode_number INT NOT NULL,
    duration DOUBLE NOT NULL,
    thumbnail VARCHAR(255),
    stream_url VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    movie_id VARCHAR(36),
    FOREIGN KEY (movie_id) REFERENCES movies (id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comment (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME,
    movie_id VARCHAR(36),
    user_id VARCHAR(36),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Ratings table
CREATE TABLE IF NOT EXISTS rating (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    star_value INT NOT NULL,
    comment VARCHAR(255),
    review_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    movie_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME,
    movie_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT uk_user_movie UNIQUE (user_id, movie_id)
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlist (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME,
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Movie-Genre junction table
CREATE TABLE IF NOT EXISTS movie_genre (
    movie_id VARCHAR(36) NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (genre_id) REFERENCES genre (id)
);

-- Movie-Category junction table
CREATE TABLE IF NOT EXISTS movie_category (
    movie_id VARCHAR(36) NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, category_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (category_id) REFERENCES category (id)
);

-- Movie-Country junction table
CREATE TABLE IF NOT EXISTS movie_country (
    movie_id VARCHAR(36) NOT NULL,
    country_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, country_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (country_id) REFERENCES country (id)
);

-- Movie-Director junction table
CREATE TABLE IF NOT EXISTS movie_director (
    movie_id VARCHAR(36) NOT NULL,
    person_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, person_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (person_id) REFERENCES person (id)
);

-- Movie-Actor junction table
CREATE TABLE IF NOT EXISTS movie_actor (
    movie_id VARCHAR(36) NOT NULL,
    person_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, person_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (person_id) REFERENCES person (id)
);

-- Playlist-Movie junction table
CREATE TABLE IF NOT EXISTS playlist_movies (
    playlist_id BIGINT NOT NULL,
    movies_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (playlist_id, movies_id),
    FOREIGN KEY (playlist_id) REFERENCES playlist (id),
    FOREIGN KEY (movies_id) REFERENCES movies (id)
);

-- Invalidated Tokens table
CREATE TABLE IF NOT EXISTS invalidated_token (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    expiry_time DATETIME
);

-- Create essential indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year);
CREATE INDEX IF NOT EXISTS idx_movies_status ON movies(status);
CREATE INDEX IF NOT EXISTS idx_movies_premium ON movies(premium);
CREATE INDEX IF NOT EXISTS idx_ratings_star_value ON rating(star_value);
CREATE INDEX IF NOT EXISTS idx_ratings_movie_id ON rating(movie_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON rating(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_movie_id ON favorites(movie_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_movie_id ON comment(movie_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comment(user_id);
CREATE INDEX IF NOT EXISTS idx_episodes_movie_id ON episode(movie_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season ON episode(season);
CREATE INDEX IF NOT EXISTS idx_episodes_episode_number ON episode(episode_number);
