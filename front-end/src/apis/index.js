const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        config.headers = {
            ...config.headers,
            'ngrok-skip-browser-warning': 'true',
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

function getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Movies
export const fetchMovieDataAPI = async (movieId) => {
    const res = await api.get(`/movies/${movieId}`);
    return res.data;
};

export const fetchAllMoviesAPI = async (page = 0, size = 5) => {
    const res = await api.get(`/movies/get-all`, {
        params: { page, size },
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const createMovieDataAPI = async (formData) => {
    const res = await api.post(`/v1/google-drive/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders(),
        },
    });
    return res.data;
};

export const updateMovieDataAPI = async (movieId, formData) => {
    const res = await api.put(`/movies/update/${movieId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders(),
        },
    });
    return res.data;
};

export const deleteMovieDataAPI = async (movieId) => {
    const res = await api.delete(`/movies/delete/${movieId}`, { headers: getAuthHeaders() });
    return res.data;
};

export const getRelatedMoviesAPI = async (movieId) => {
    const res = await api.get(`/movies/${movieId}/related`);
    return res.data;
};

export const fetchMovieByIdAPI = async (movieId) => {
    const res = await api.get(`/movies/${movieId}`, { headers: getAuthHeaders() });
    return res.data;
};

// MovieDetail
export const fetchMovieDetailsAPI = async (movieId) => {
    const res = await api.get(`/movies/${movieId}`);
    return res.data;
};

export const fetchRelatedMoviesAPI = async (movieId) => {
    const res = await api.get(`/movies/${movieId}/related`);
    return res.data;
};

// Homepage
export const fetchNewlyUpdatedMoviesAPI = async (categorySlug) => {
    const res = await api.get(`/movies/newly-updated/${categorySlug}`);
    return res.data;
};

// Genres Admin
export const fetchAllGenresAPI = async () => {
    const res = await api.get(`/genres`, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchGenreDataAPI = async (genreId) => {
    const res = await api.get(`/genres/${genreId}`, { headers: getAuthHeaders() });
    return res.data;
};

export const createGenreDataAPI = async (payload) => {
    const res = await api.post(`/genres`, payload, { headers: getAuthHeaders() });
    return res.data;
};

export const updateGenreDataAPI = async (genreId, payload) => {
    const res = await api.put(`/genres/${genreId}`, payload, { headers: getAuthHeaders() });
    return res.data;
};

export const deleteGenreDataAPI = async (genreId) => {
    const res = await api.delete(`/genres/${genreId}`, { headers: getAuthHeaders() });
    return res.data;
};

// Category Admin
export const fetchAllCategoriesAPI = async () => {
    const res = await api.get(`/categories`, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchCategoryDataAPI = async (categoryId) => {
    const res = await api.get(`/categories/${categoryId}`, { headers: getAuthHeaders() });
    return res.data;
};

export const createCategoryDataAPI = async (payload) => {
    const res = await api.post(`/categories`, payload, { headers: getAuthHeaders() });
    return res.data;
};

export const updateCategoryDataAPI = async (categoryId, payload) => {
    const res = await api.put(`/categories/${categoryId}`, payload, { headers: getAuthHeaders() });
    return res.data;
};

export const deleteCategoryDataAPI = async (categoryId) => {
    const res = await api.delete(`/categories/${categoryId}`, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchAllPersonsAPI = async (type) => {
    const endpoint = type === 'actor' ? 'actors' : 'directors';
    const res = await api.get(`/person/${endpoint}`);
    return res.data;
};

export const fetchPersonDataAPI = async (personId) => {
    const res = await api.get(`/person/${personId}`);
    return res.data;
};

export const createPersonDataAPI = async (formData) => {
    const res = await api.post(`/person`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders(),
        },
    });
    return res.data;
};

export const updatePersonDataAPI = async (personId, formData) => {
    const res = await api.put(`/person/${personId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders(),
        },
    });
    return res.data;
};

export const deletePersonDataAPI = async (personId) => {
    const res = await api.delete(`/person/${personId}`, { headers: getAuthHeaders() });
    return res.data;
};

// Country Admin
export const fetchCountryDataAPI = async (countryId) => {
    const res = await api.get(`/countries/${countryId}`);
    return res.data;
};

export const createCountryDataAPI = async (payload) => {
    const res = await api.post(`/countries`, payload, { headers: getAuthHeaders() });
    return res.data;
};

export const updateCountryDataAPI = async (countryId, payload) => {
    const res = await api.put(`/countries/${countryId}`, payload, { headers: getAuthHeaders() });
    return res.data;
};

export const deleteCountryDataAPI = async (countryId) => {
    const res = await api.delete(`/countries/${countryId}`, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchAllCountriesAPI = async () => {
    const res = await api.get(`/countries`);
    return res.data;
};

// User Admin
export const fetchAllUsersAPI = async (page = 0, size = 15) => {
    const res = await api.get(`/users`, {
        params: { page, size },
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const fetchUserDataAPI = async (userId) => {
    const res = await api.get(`/users/${userId}`, { headers: getAuthHeaders() });
    return res.data;
};

export const createUserDataAPI = async (formData) => {
    const res = await api.post(`/users/create`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders(),
        },
    });
    return res.data;
};

export const updateUserDataAPI = async (userId, formData) => {
    const res = await api.put(`/users/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders(),
        },
    });
    return res.data;
};

export const deleteUserDataAPI = async (userId) => {
    const res = await api.delete(`/users/delete/${userId}`, { headers: getAuthHeaders() });
    return res.data;
};

export const changePasswordAPI = async ({ userId, currentPassword, newPassword }) => {
    const res = await api.put('/users/profile/change-password', null, {
        params: { userId, currentPassword, newPassword },
        headers: getAuthHeaders(),
    });
    return res.data;
};

export const updateProfileAPI = async (formData) => {
    const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
    });
    return res.data;
};

// MovieList Page
export const fetchMoviesByCategoryAPI = async (categorySlug, page = 0, size = 12) => {
    const res = await api.get(`/movies/category/${categorySlug}`, {
        params: { page, size },
    });
    return res.data;
};

export const fetchMoviesWithFiltersAPI = async (categorySlug, params) => {
    const res = await api.get(`/movies/filter`, {
        params: { categorySlug, ...params },
    });
    return res.data;
};

// Auth
export const loginAPI = async (credentials) => {
    const res = await api.post(`/auth/login`, credentials);
    return res.data;
};

export const registerAPI = async (userData) => {
    const res = await api.post(`/auth/register`, userData);
    return res.data;
};

export const logoutAPI = async (token) => {
    const res = await api.post(
        `/auth/logout`,
        { token },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return res.data;
};

export const fetchBannerMoviesAPI = async () => {
    const res = await api.get(`/movies/category/phim-hot`, {
        params: { page: 0, size: 5 },
    });
    return res.data;
};

export const fetchMovieByIdForCategoryAPI = async (movieId) => {
    const res = await api.get(`/movies/${movieId}`);
    return res.data;
};

export const fetchMoviesByKeywordAPI = async (keyword, page = 0, size = 12) => {
    const res = await api.get(`/movies/search`, {
        params: { keyword, page, size },
    });
    return res.data;
};
