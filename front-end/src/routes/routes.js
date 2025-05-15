import config from '@/config';
import HomePage from '@/pages/HomePage';
import MovieListPage from '@/pages/MovieListPage/MovieListPage';
import MovieDetail from '@/components/MovieDetail';
import MoviePlayerPage from '@/pages/MoviePlayerPage';
import AuthForm from '@/components/Auth/AuthForm';
import SearchResults from '@/pages/SearchResults';
import ActorDetailPage from '@/pages/ActorDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import DonatePage from '@/pages/DonatePage';
const publicRoutes = [
    { path: config.routes.home, component: HomePage },
    { path: config.routes.hot, component: MovieListPage, slug: 'phim-hot' },
    { path: config.routes.single, component: MovieListPage, slug: 'phim-le' },
    { path: config.routes.series, component: MovieListPage, slug: 'phim-bo' },
    { path: config.routes.donate, component: DonatePage },
    { path: config.routes.movieDetail, component: MovieDetail },
    { path: config.routes.watch, component: MoviePlayerPage },
    { path: config.routes.login, component: AuthForm },
    { path: config.routes.search, component: SearchResults },
    { path: config.routes.actorDetail, component: ActorDetailPage },
    { path: config.routes.profile, component: ProfilePage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
