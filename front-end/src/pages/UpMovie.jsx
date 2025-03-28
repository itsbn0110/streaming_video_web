import React, { useState } from "react";
import styles from "./UpMovie.module.css"; // Import CSS module

const UploadMovie = () => {
  const [movieFile, setMovieFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [movieData, setMovieData] = useState({
    title: "",
    description: "",
    releaseYear: "",
    genres: "",
    categories: "",
    countries: "",
    directors: "",
    actors: "",
  });

  const handleFileChange = (e, type) => {
    if (type === "movie") {
      setMovieFile(e.target.files[0]);
    } else if (type === "thumbnail") {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!movieFile || !thumbnailFile) {
      alert("Vui lòng chọn file phim và ảnh thumbnail!");
      return;
    }

    const formData = new FormData();
    formData.append("movieFile", movieFile);
    formData.append("thumbnailFile", thumbnailFile);
    formData.append("request", JSON.stringify(movieData));

    try {
      const response = await fetch("https://api.example.com/upload-movie", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.code === 1000) {
        alert("Upload thành công!");
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Lỗi khi upload!");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Upload Movie</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="releaseYear"
        placeholder="Release Year"
        onChange={handleInputChange}
      />

      <label>Movie File:</label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => handleFileChange(e, "movie")}
      />

      <label>Thumbnail File:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, "thumbnail")}
      />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadMovie;