const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";
const token = localStorage.getItem("accessToken") || "";

const headers = {
  Authorization: `Bearer ${token}`,
};

// Movies
export const fetchMovieDataAPI = async (movieId) => {
  const res = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
  return res.data;
};

export const fetchAllMoviesAPI = async (page = 0, size = 5) => {
  const res = await axios.get(
    `${API_BASE_URL}/movies/get-all?page=${page}&size=${size}`
  );
  return res.data;
};

export const createMovieDataAPI = async (formData) => {
  const res = await axios.post(
    `${API_BASE_URL}/v1/google-drive/upload`,
    formData,
    {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const updateMovieDataAPI = async (movieId, formData) => {
  const res = await axios.put(
    `${API_BASE_URL}/movies/update/${movieId}`,
    formData,
    {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const deleteMovieDataAPI = async (movieId) => {
  const res = await axios.delete(`${API_BASE_URL}/movies/delete/${movieId}`, {
    headers,
  });
  return res.data;
};

export const getRelatedMoviesAPI = async (movieId) => {
  const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/related`);
  return res.data;
};

export const fetchMovieByIdAPI = async (movieId) => {
  const res = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
  return res.data;
};

// MovieDetail
export const fetchMovieDetailsAPI = async (movieId) => {
  const res = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
  return res.data;
};

export const fetchRelatedMoviesAPI = async (movieId) => {
  const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/related`);
  return res.data;
};

// Homepage
export const fetchNewlyUpdatedMoviesAPI = async (categorySlug) => {
  const res = await axios.get(
    `${API_BASE_URL}/movies/newly-updated/${categorySlug}`
  );
  return res.data;
};

// Genres
export const fetchAllGenresAPI = async () => {
  const res = await axios.get(`${API_BASE_URL}/genres`, { headers });
  return res.data;
};

export const fetchGenreDataAPI = async (genreId) => {
  const res = await axios.get(`${API_BASE_URL}/genres/${genreId}`, { headers });
  return res.data;
};

export const createGenreDataAPI = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/genres`, payload, { headers });
  return res.data;
};

export const updateGenreDataAPI = async (genreId, payload) => {
  const res = await axios.put(`${API_BASE_URL}/genres/${genreId}`, payload, {
    headers,
  });
  return res.data;
};

export const deleteGenreDataAPI = async (genreId) => {
  const res = await axios.delete(`${API_BASE_URL}/genres/${genreId}`, {
    headers,
  });
  return res.data;
};

export const fetchAllPersonsAPI = async (type) => {
  const endpoint = type === "actor" ? "actors" : "directors";
  const res = await axios.get(`${API_BASE_URL}/person/${endpoint}`, {
    headers,
  });
  return res.data;
};

export const fetchPersonDataAPI = async (personId) => {
  const res = await axios.get(`${API_BASE_URL}/person/${personId}`, {
    headers,
  });
  return res.data;
};

export const createPersonDataAPI = async (formData) => {
  const res = await axios.post(`${API_BASE_URL}/person`, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updatePersonDataAPI = async (personId, formData) => {
  const res = await axios.put(`${API_BASE_URL}/person/${personId}`, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deletePersonDataAPI = async (personId) => {
  const res = await axios.delete(`${API_BASE_URL}/person/${personId}`, {
    headers,
  });
  return res.data;
};

// Country
export const fetchCountryDataAPI = async (countryId) => {
  const res = await axios.get(`${API_BASE_URL}/countries/${countryId}`);
  return res.data;
};

export const createCountryDataAPI = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/countries`, payload, {
    headers,
  });
  return res.data;
};

export const updateCountryDataAPI = async (countryId, payload) => {
  const res = await axios.put(
    `${API_BASE_URL}/countries/${countryId}`,
    payload,
    {
      headers,
    }
  );
  return res.data;
};

export const deleteCountryDataAPI = async (countryId) => {
  const res = await axios.delete(`${API_BASE_URL}/countries/${countryId}`, {
    headers,
  });
  return res.data;
};

export const fetchAllCountriesAPI = async () => {
  const res = await axios.get(`${API_BASE_URL}/countries`);
  return res.data;
};

// User
export const fetchAllUsersAPI = async (page = 0, size = 15) => {
  const res = await axios.get(
    `${API_BASE_URL}/users?page=${page}&size=${size}`,
    { headers }
  );
  return res.data;
};

export const fetchUserDataAPI = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/users/${userId}`, { headers });
  return res.data;
};

export const createUserDataAPI = async (formData) => {
  const res = await axios.post(`${API_BASE_URL}/users/create`, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateUserDataAPI = async (userId, formData) => {
  const res = await axios.put(`${API_BASE_URL}/users/${userId}`, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteUserDataAPI = async (userId) => {
  const res = await axios.delete(`${API_BASE_URL}/users/delete/${userId}`, {
    headers,
  });
  return res.data;
};

// MovieList Page
export const fetchMoviesByCategoryAPI = async (categorySlug) => {
  const res = await axios.get(
    `${API_BASE_URL}/movies/category/${categorySlug}`
  );
  return res.data;
};

export const fetchMoviesWithFiltersAPI = async (categorySlug, params) => {
  const res = await axios.get(`${API_BASE_URL}/movies/filter`, {
    params: { categorySlug, ...params },
  });
  return res.data;
};

// Auth
export const loginAPI = async (credentials) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return res.data;
};

export const registerAPI = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return res.data;
};

export const logoutAPI = async (token) => {
  const res = await axios.post(
    `${API_BASE_URL}/auth/logout`,
    { token },
    { headers }
  );
  return res.data;
};

export const fetchBannerMoviesAPI = async () => {
  const res = await axios.get(`${API_BASE_URL}/movies/category/phim-hot`);
  return res.data;
};

export const fetchMovieByIdForCategoryAPI = async (movieId) => {
  const res = await axios.get(`${API_BASE_URL}/movies/${movieId}`, { headers });
  return res.data;
};
