const adminRouteConfig = {
  adminRoute: "/admin",

  list: "/admin/phim/danh-sach",
  createFilm: "/admin/phim/tao-phim",
  editFilm: "/admin/phim/sua-phim",

  listActors: "/admin/dien-vien/danh-sach",
  createActor: "/admin/dien-vien/tao-dien-vien",
  editActor: "/admin/dien-vien/chinh-sua",

  listDirectors: "/admin/dao-dien/danh-sach",
  createDirector: "/admin/dao-dien/tao-dao-dien",
  editDirector: "/admin/dao-dien/chinh-sua",

  listGenres: "/admin/the-loai/danh-sach",
  createGenre: "/admin/the-loai/tao-the-loai",
  editGenre: "/admin/the-loai/chinh-sua",

  listCountries: "/admin/quoc-gia/danh-sach",
  createCountry: "/admin/quoc-gia/tao-quoc-gia",
  editCountry: "/admin/quoc-gia/chinh-sua",

  listUsers: "/admin/user/danh-sach",
  createUsers: "/admin/users/create",
  editUsers: "/admin/users/edit",
};

export default adminRouteConfig;
