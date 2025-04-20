import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "../../AdminLayout.module.scss";
import axios from "axios";
import { X, Upload, Save, ArrowLeft } from "lucide-react";
import adminRouteConfig from "@/config/adminRoutes";

const cx = classNames.bind(styles);

import TagInput from "../TagInput/TagInput";
const MovieForm = ({ editMode = false, movieData = null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    editMode && movieData
      ? movieData
      : {
          title: "",
          originalTitle: "",
          description: "",
          releaseYear: new Date().getFullYear(),
          status: "PUBLIC",
          categories: [],
          genres: [],
          countries: [],
          directors: [],
          actors: [],
          thumbnail: null,
          movieBackDrop: null,
          thumbnailPreview: null,
          backDropPreview: null,
          movieFile: null,
          trailerLink: "",
          duration: 0,
          premium: false,
        }
  );

  const [genreOptions, setGenreOptions] = useState([]);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [actorOptions, setActorOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("accessToken") || "";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch genres, countries, directors, actors from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const categoriesRes = await axios.get(`${API_BASE_URL}/categories`, {
          headers,
        });
        console.log("categories: ", categoriesRes.data.result);
        if (categoriesRes.data && categoriesRes.data.result) {
          setCategoryOptions(categoriesRes.data.result || []);
        }

        // Get genres (genres)
        const genresRes = await axios.get(`${API_BASE_URL}/genres`, {
          headers,
        });
        console.log("genres: ", genresRes.data.result);
        if (genresRes.data && genresRes.data.result) {
          setGenreOptions(genresRes.data.result || []);
        }

        // Get countries
        const countriesRes = await axios.get(`${API_BASE_URL}/countries`, {
          headers,
        });
        console.log("countries: ", countriesRes.data.result);
        if (countriesRes.data && countriesRes.data.result) {
          setCountryOptions(countriesRes.data.result || []);
        }

        // Get directors
        const directorsRes = await axios.get(
          `${API_BASE_URL}/person/directors`,
          { headers }
        );
        console.log("directors: ", directorsRes.data.result);

        if (directorsRes.data && directorsRes.data.result) {
          setDirectorOptions(directorsRes.data.result || []);
        }

        // Get actors
        const actorsRes = await axios.get(`${API_BASE_URL}/person/actors`, {
          headers,
        });
        console.log("actors: ", actorsRes);

        if (actorsRes.data && actorsRes.data.result) {
          setActorOptions(actorsRes.data.result || []);
        }
      } catch (err) {
        console.error("Error fetching options:", err);
        setError("Không thể lấy dữ liệu. Vui lòng thử lại sau.");
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "thumbnail") {
        setFormData({
          ...formData,
          thumbnail: files[0],
          thumbnailPreview: URL.createObjectURL(files[0]),
        });
      } else if (name == "backDrop") {
        setFormData({
          ...formData,
          movieBackDrop: files[0],
          backDropPreview: URL.createObjectURL(files[0]),
        });
      } else if (name === "movieFile") {
        setFormData({
          ...formData,
          movieFile: files[0],
        });
      }
    }
  };

  const handleGenresChange = (newGenres) => {
    setFormData({
      ...formData,
      genres: newGenres,
    });
  };

  const handleCountriesChange = (newCountries) => {
    setFormData({
      ...formData,
      countries: newCountries,
    });
  };

  const handleDirectorsChange = (newDirectors) => {
    setFormData({
      ...formData,
      directors: newDirectors,
    });
  };

  const handleActorsChange = (newActors) => {
    console.log("newactor:", newActors);
    setFormData({
      ...formData,
      actors: newActors,
    });
  };

  const handleCategoriesChange = (newCategories) => {
    console.log("newcategory:", newCategories);
    setFormData({
      ...formData,
      categories: newCategories,
    });
  };

  const prepareRequestData = () => {
    // Create the request object to match the expected format
    const requestData = {
      title: formData.title,
      originalTitle: formData.originalTitle || "",
      description: formData.description,
      releaseYear: formData.releaseYear,
      categories: formData.categories.map(
        (category) => category.name || category
      ),
      status: formData.status,
      trailerLink: formData.trailerLink || "",

      duration: formData.duration || 0,
      premium: formData.premium,
      genres: formData.genres.map((cat) => cat.name || cat),
      countries: formData.countries.map((country) => country.name || country),
      directors: formData.directors.map(
        (director) => director.name || director
      ),
      actors: formData.actors.map((actor) => actor.name || actor),
    };

    return JSON.stringify(requestData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log(e);

    try {
      if (!formData.thumbnail && !editMode) {
        throw new Error("Vui lòng chọn hình thumbnail");
      }

      if (!formData.movieFile && !editMode) {
        throw new Error("Vui lòng chọn file phim");
      }

      console.log("request", prepareRequestData());
      console.log("thumbnailFile", formData.thumbnail);
      // console.log("thumbnailFile", formData.thumbnailPreview);

      console.log("movieFile", formData.movieFile);
      console.log("movieBackDrop", formData.movieBackDrop);

      let response;
      if (editMode) {
        const formDataToSend = new FormData();
        formDataToSend.append("request", prepareRequestData());

        response = await axios.put(
          `${API_BASE_URL}/movies/update/${id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...headers,
            },
          }
        );
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("request", prepareRequestData());
        formDataToSend.append("thumbnailFile", formData.thumbnail);
        formDataToSend.append("movieFile", formData.movieFile);
        formDataToSend.append("movieBackDrop", formData.movieBackDrop);

        // formDataToSend.append("thumbnailPreview", formData.thumbnailPreview);

        response = await axios.post(
          `${API_BASE_URL}/v1/google-drive/upload`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...headers,
            },
          }
        );
      }

      if (response.data && response.data.result) {
        alert(
          editMode ? "Phim đã được cập nhật!" : "Phim đã được tạo thành công!"
        );
        navigate(`${adminRouteConfig.list}`);
      } else {
        throw new Error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi lưu phim");
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={cx("page-header")}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => navigate(`${adminRouteConfig.list}`)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "12px",
              color: "#4a5568",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2>{editMode ? "Chỉnh sửa phim" : "Tạo phim mới"}</h2>
        </div>
        <button
          className={cx("button-primary")}
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save size={16} />
          {loading ? "Đang xử lý..." : editMode ? "Cập nhật" : "Lưu phim"}
        </button>
      </div>

      {error && (
        <div
          className={cx("alert", "alert-danger")}
          style={{ marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      <div className={cx("card")}>
        <form className={cx("form-container")} onSubmit={handleSubmit}>
          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Tên phim</label>
              <input
                type="text"
                name="title"
                className={cx("form-control")}
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Tên gốc (nếu có)</label>
              <input
                type="text"
                name="originalTitle"
                className={cx("form-control")}
                value={formData.originalTitle}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={cx("form-group")}>
            <label className={cx("form-label")}>Mô tả ngắn</label>
            <textarea
              name="description"
              className={cx("form-control")}
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
            ></textarea>
          </div>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Năm phát hành</label>
              <input
                type="number"
                name="releaseYear"
                className={cx("form-control")}
                value={formData.releaseYear}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Link trailer</label>
              <input
                type="text"
                name="trailerLink"
                className={cx("form-control")}
                value={formData.trailerLink}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Loại phim</label>
              <div className={cx("dropdown-with-tags")}>
                <TagInput
                  options={categoryOptions}
                  selectedTags={formData.categories}
                  onTagsChange={handleCategoriesChange}
                  placeholder="Thêm loại phim mới..."
                  className={cx("dropdown-with-tags")}
                />
              </div>
            </div>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Thời lượng (phút)</label>
              <input
                type="number"
                name="duration"
                className={cx("form-control")}
                value={formData.duration}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Status</label>
              <input
                type="text"
                name="status"
                className={cx("form-control")}
                value={formData.status}
                onChange={handleInputChange}
                placeholder="inception-movie"
              />
            </div>
            <div className={cx("form-group")} style={{ flex: "0.5" }}>
              <label className={cx("form-label")}>Premium</label>
              <div style={{ marginTop: "10px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="premium"
                    checked={formData.premium}
                    onChange={handleInputChange}
                    style={{ marginRight: "8px" }}
                  />
                  Phim Premium
                </label>
              </div>
            </div>
          </div>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Đạo diễn</label>
              <div className={cx("dropdown-with-tags")}>
                <TagInput
                  options={directorOptions}
                  selectedTags={formData.directors}
                  onTagsChange={handleDirectorsChange}
                  placeholder="Thêm đạo diễn mới..."
                  className={cx("dropdown-with-tags")}
                />
              </div>
            </div>

            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Diễn viên</label>
              {console.log("actorOptions: ", actorOptions)}
              <div className={cx("dropdown-with-tags")}>
                <TagInput
                  options={actorOptions}
                  selectedTags={formData.actors}
                  onTagsChange={handleActorsChange}
                  placeholder="Thêm diễn viên mới..."
                  className={cx("dropdown-with-tags")}
                />
              </div>
            </div>
          </div>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Thể loại</label>
              <div className={cx("dropdown-with-tags")}>
                <TagInput
                  options={genreOptions}
                  selectedTags={formData.genres}
                  onTagsChange={handleGenresChange}
                  placeholder="Thêm thể loại mới..."
                  className={cx("dropdown-with-tags")}
                />
              </div>
            </div>

            <div className={cx("form-group")}>
              <label className={cx("form-label")}>Quốc gia</label>
              <div className={cx("dropdown-with-tags")}>
                <TagInput
                  options={countryOptions}
                  selectedTags={formData.countries}
                  onTagsChange={handleCountriesChange}
                  placeholder="Thêm quốc gia mới..."
                  className={cx("dropdown-with-tags")}
                />
              </div>
            </div>
          </div>

          {!editMode ? (
            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label className={cx("form-label")}>Thumbnail</label>
                <div className={cx("image-upload")}>
                  <input
                    type="file"
                    name="thumbnail"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="thumbnail">
                    <div className={cx("upload-icon")}>
                      <Upload size={36} />
                    </div>
                    <div className={cx("upload-text")}>
                      Kéo thả hình ảnh vào đây hoặc click để chọn file
                    </div>
                  </label>
                </div>
                {formData.thumbnailPreview && (
                  <img
                    src={formData.thumbnailPreview}
                    alt="Thumbnail preview"
                    className={cx("preview-image")}
                    style={{ maxHeight: "200px" }}
                  />
                )}
              </div>

              <div className={cx("form-group")}>
                <label className={cx("form-label")}>Back Drop</label>
                <div className={cx("image-upload")}>
                  <input
                    type="file"
                    name="backDrop"
                    id="backDrop"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="backDrop">
                    <div className={cx("upload-icon")}>
                      <Upload size={36} />
                    </div>
                    <div className={cx("upload-text")}>
                      Kéo thả hình ảnh vào đây hoặc click để chọn file
                    </div>
                  </label>
                </div>
                {formData.backDropPreview && (
                  <img
                    src={formData.backDropPreview}
                    alt="Backdrop preview"
                    className={cx("preview-image")}
                    style={{ maxHeight: "200px" }}
                  />
                )}
              </div>

              <div className={cx("form-group")}>
                <label className={cx("form-label")}>File phim</label>
                <div className={cx("image-upload")}>
                  <input
                    type="file"
                    name="movieFile"
                    id="movieFile"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="movieFile">
                    <div className={cx("upload-icon")}>
                      <Upload size={36} />
                    </div>
                    <div className={cx("upload-text")}>
                      Kéo thả file phim vào đây hoặc click để chọn file
                    </div>
                  </label>
                </div>
                {formData.movieFile && (
                  <div style={{ marginTop: "12px" }}>
                    <span style={{ fontWeight: "500" }}>File đã chọn:</span>{" "}
                    {formData.movieFile.name}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
