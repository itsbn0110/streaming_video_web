import AdminLayout from "@/layout/AdminLayout";
import AdminDashboard from "@/layout/AdminLayout/components/AdminDashBoard";
import MovieForm from "@/layout/AdminLayout/components/MovieForm/MovieForm";
import MovieList from "@/layout/AdminLayout/components/MovieList/MovieList";
import adminRouteConfig from "@/config/adminRoutes";
import PersonForm from "@/layout/AdminLayout/components/PersonForm/PersonForm";
import PersonList from "@/layout/AdminLayout/components/PersonList/PersonList";
import GenreList from "@/layout/AdminLayout/components/GenreList/GengeList";
import CountryList from "@/layout/AdminLayout/components/CountryList/CountryList.";
import GenreForm from "@/layout/AdminLayout/components/GenreForm/GenreForm";
import CountryForm from "@/layout/AdminLayout/components/CountryForm/CountryForm";
import UserList from "@/layout/AdminLayout/components/UserList/UserList";
import UserForm from "@/layout/AdminLayout/components/UserForm/UserForm";
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
      // New routes for genre forms
      {
        path: adminRouteConfig.createGenre,
        element: <GenreForm />,
      },
      {
        path: `${adminRouteConfig.editGenre}/:id`,
        element: <GenreForm />,
      },
      // New routes for country forms
      {
        path: adminRouteConfig.createCountry,
        element: <CountryForm />,
      },
      {
        path: `${adminRouteConfig.editCountry}/:id`,
        element: <CountryForm editMode={true} />,
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
