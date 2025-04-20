import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./MovieListPage.module.scss";
import classNames from "classnames/bind";
import MovieCard from "@/components/MovieCard";
import {
  fetchMoviesByCategoryAPI,
  fetchMoviesWithFiltersAPI,
  fetchAllCountriesAPI,
} from "@/apis";

const cx = classNames.bind(styles);

function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [countryOptions, setCountryOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState({
    releaseYear: searchParams.get("releaseYear") || "",
    countryId: searchParams.get("countryId") || "",
    duration: searchParams.get("duration") || "",
    // sort: searchParams.get("sort") || "latest",
  });

  const path = location.pathname.split("/");
  const categoryFromPath = path[path.length - 1];

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const countriesRes = await fetchAllCountriesAPI();
        if (countriesRes && countriesRes.result) {
          setCountryOptions(countriesRes.result || []);
        }

        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 2000; year--) {
          years.push({ id: year, name: year.toString() });
        }
        setYearOptions(years);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  const fetchMoviesByCategory = async (categorySlug) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMoviesByCategoryAPI(categorySlug);
      setMovies(response.result || []);
    } catch (err) {
      console.error("Failed to fetch movies by category:", err);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesWithFilters = async (categorySlug, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.keys(currentFilters).reduce((acc, key) => {
        if (currentFilters[key]) {
          acc[key] = currentFilters[key];
        }
        return acc;
      }, {});

      const response = await fetchMoviesWithFiltersAPI(categorySlug, params);
      setMovies(response.result || []);
    } catch (err) {
      console.error("Failed to fetch movies with filters:", err);
      setError("Failed to apply filters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newFilters = {
      releaseYear: searchParams.get("releaseYear") || "",
      countryId: searchParams.get("countryId") || "",
      duration: searchParams.get("duration") || "",
      // sort: searchParams.get("sort") || "latest",
    };

    setFilters(newFilters);

    if (categoryFromPath) {
      const hasFilters = Object.values(newFilters).some(
        (value) => value !== ""
      );

      if (hasFilters) {
        fetchMoviesWithFilters(categoryFromPath, newFilters);
      } else {
        fetchMoviesByCategory(categoryFromPath);
      }
    }
  }, [location.pathname, location.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        newSearchParams.set(key, val);
      }
    });

    const currentCategory = location.pathname.split("/").filter(Boolean).pop();

    navigate(
      `/${currentCategory}${
        newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
      }`,
      { replace: true }
    );
  };

  const getCategoryTitle = () => {
    switch (categoryFromPath) {
      case "phim-le":
        return "PHIM LẺ";
      case "phim-bo":
        return "PHIM BỘ";
      case "phim-hot":
        return "PHIM HOT";
      case "phim-moi":
        return "PHIM MỚI";
      default:
        return "TẤT CẢ PHIM";
    }
  };

  return (
    <div className={cx("movie-list-page")}>
      <h1 className={cx("page-title")}>{getCategoryTitle()}</h1>

      <div className={cx("content")}>
        <div className={cx("filters")}>
          <div className={cx("filter-group")}>
            <label>Loại phim:</label>
            <select disabled value={categoryFromPath || ""}>
              <option value="phim-le">Phim Lẻ</option>
              <option value="phim-bo">Phim Bộ</option>
            </select>
          </div>

          <div className={cx("filter-group")}>
            <label>Quốc gia:</label>
            <select
              name="countryId"
              onChange={handleFilterChange}
              value={filters.countryId}
            >
              <option value="">- Tất cả -</option>
              {countryOptions.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className={cx("filter-group")}>
            <label>Năm:</label>
            <select
              name="releaseYear"
              onChange={handleFilterChange}
              value={filters.releaseYear}
            >
              <option value="">- Tất cả -</option>
              {yearOptions.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>

          <div className={cx("filter-group")}>
            <label>Thời lượng:</label>
            <select
              name="duration"
              onChange={handleFilterChange}
              value={filters.duration}
            >
              <option value="">- Tất cả -</option>
              <option value="short">Dưới 90 phút</option>
              <option value="medium">90-120 phút</option>
              <option value="long">Trên 120 phút</option>
            </select>
          </div>

          <div className={cx("filter-group")}>
            <label>Sắp xếp:</label>
            <select
              name="sort"
              onChange={handleFilterChange}
              value={filters.sort}
            >
              <option value="latest">Ngày cập nhật</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="year-desc">Năm mới nhất</option>
              <option value="year-asc">Năm cũ nhất</option>
            </select>
          </div>
        </div>

        {error && <div className={cx("error-message")}>{error}</div>}

        {loading ? (
          <div className={cx("loading")}>Đang tải...</div>
        ) : (
          <div className={cx("movies")}>
            {movies.length > 0 ? (
              movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : (
              <div className={cx("no-results")}>
                Không tìm thấy phim phù hợp
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieListPage;
