-- Add indexes to improve performance

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Movies table indexes
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year);
CREATE INDEX IF NOT EXISTS idx_movies_status ON movies(status);
CREATE INDEX IF NOT EXISTS idx_movies_premium ON movies(premium);

-- Rating indexes
CREATE INDEX IF NOT EXISTS idx_ratings_star_value ON ratings(star_value);
CREATE INDEX IF NOT EXISTS idx_ratings_movie_id ON ratings(movie_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_favorites_movie_id ON favorites(movie_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_movie_id ON comments(movie_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Episodes indexes
CREATE INDEX IF NOT EXISTS idx_episodes_movie_id ON episode(movie_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season ON episode(season);
CREATE INDEX IF NOT EXISTS idx_episodes_episode_number ON episode(episode_number);
