const routes = {
    home: '/',
    hot: '/phim-hot',
    single: '/phim-le',
    series: '/phim-bo',
    donate: '/donate',
    movieDetail: '/movies/:id',
    watch: '/watch/:movieId',
    login: '/login',
    search: '/search',
    actorDetail: '/actor/:id',
    profile: '/profile',
    editProfile: '/profile/edit',
    changePassword: '/profile/change-password',
    episodeManagement: '/admin/episode-management/:movieId',
    aiSuggestions: '/ai-suggestions',
};

export default routes;
