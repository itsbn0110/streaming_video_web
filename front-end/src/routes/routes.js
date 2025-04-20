import config from "@/config";
import HomePage from "@/pages/HomePage";

import MovieListPage from "@/pages/MovieListPage/MovieListPage";
import MovieDetail from "@/components/MovieDetail";
import MoviePlayerPage from "@/pages/MoviePlayerPage";
import AuthForm from "@/components/Auth/AuthForm";
const publicRoutes = [
  { path: config.routes.home, component: HomePage },
  { path: config.routes.hot, component: MovieListPage, slug: "phim-hot" },
  { path: config.routes.single, component: MovieListPage, slug: "phim-le" },
  { path: config.routes.series, component: MovieListPage, slug: "phim-bo" },
  { path: config.routes.donate, component: HomePage },
  { path: config.routes.movieDetail, component: MovieDetail },
  { path: config.routes.watch, component: MoviePlayerPage },
  { path: config.routes.login, component: AuthForm },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
