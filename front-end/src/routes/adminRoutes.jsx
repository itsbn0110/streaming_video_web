import AdminLayout from "@/layout/AdminLayout";
import AdminDashboard from "@/layout/AdminLayout/components/AdminDashBoard";
import adminRouteConfig from "@/config/adminRoutes";
import MovieForm from "@/layout/AdminLayout/components/MovieForm";
import PersonList from "@/layout/AdminLayout/components/PersonList";
import PersonForm from "@/layout/AdminLayout/components/PersonForm";
import GenreList from "@/layout/AdminLayout/components/GenreList";
import CountryList from "@/layout/AdminLayout/components/CountryList";
import CategoryList from "@/layout/AdminLayout/components/CategoryList";
import CategoryForm from "@/layout/AdminLayout/components/CategoryForm";
import GenreForm from "@/layout/AdminLayout/components/GenreForm";
import CountryForm from "@/layout/AdminLayout/components/CountryForm";
import UserList from "@/layout/AdminLayout/components/UserList";
import UserForm from "@/layout/AdminLayout/components/UserForm";
import MovieList from "@/layout/AdminLayout/components/MovieList";
const adminRoutes = [
  {
    path: adminRouteConfig.adminRoute,
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: adminRouteConfig.list, element: <MovieList /> },
      {
        path: adminRouteConfig.createFilm,
        element: <MovieForm editMode={false} />,
      },
      {
        path: `${adminRouteConfig.editFilm}/:id`,
        element: <MovieForm editMode={true} />,
      },
      {
        path: adminRouteConfig.listActors,
        element: <PersonList personType="actor" />,
      },
      {
        path: adminRouteConfig.createActor,
        element: <PersonForm personType="actor" />,
      },
      {
        path: `${adminRouteConfig.editActor}/:id`,
        element: <PersonForm editMode={true} personType="actor" />,
      },
      {
        path: adminRouteConfig.listDirectors,
        element: <PersonList personType="director" />,
      },
      {
        path: adminRouteConfig.createDirector,
        element: <PersonForm personType="director" />,
      },
      {
        path: `${adminRouteConfig.editDirector}/:id`,
        element: <PersonForm editMode={true} personType="director" />,
      },
      {
        path: `${adminRouteConfig.listGenres}`,
        element: <GenreList />,
      },
      {
        path: `${adminRouteConfig.listCountries}`,
        element: <CountryList />,
      },

      {
        path: `${adminRouteConfig.listCategories}`,
        element: <CategoryList />,
      },
      {
        path: adminRouteConfig.createGenre,
        element: <GenreForm />,
      },
      {
        path: `${adminRouteConfig.editGenre}/:id`,
        element: <GenreForm />,
      },
      {
        path: adminRouteConfig.createCountry,
        element: <CountryForm />,
      },
      {
        path: `${adminRouteConfig.editCountry}/:id`,
        element: <CountryForm editMode={true} />,
      },
      {
        path: adminRouteConfig.createCategory,
        element: <CategoryForm />,
      },
      {
        path: `${adminRouteConfig.editCategory}/:id`,
        element: <CategoryForm editMode={true} />,
      },
      {
        path: `${adminRouteConfig.listUsers}`,
        element: <UserList />,
      },

      {
        path: adminRouteConfig.createUsers,
        element: <UserForm />,
      },
      {
        path: `${adminRouteConfig.editUsers}/:id`,
        element: <UserForm editMode={true} />,
      },
    ],
  },
];

export default adminRoutes;
