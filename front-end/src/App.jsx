import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "@/layout/DefaultLayout";
import adminRoutes from "./routes/adminRoutes";
import { publicRoutes } from "./routes";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NotFound } from "./components/Auth/NotFound/NotFound";
import AdminLayout from "./layout/AdminLayout";
export const ProtectedRoute = ({
  children,
  requiredRoles = [],
  redirectPath = "/login",
}) => {
  const location = useLocation();
  const { hasAnyRole } = useAuth();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/unauthorized" element={<NotFound />} />
        {/* Admin Routes */}
        {adminRoutes.map((route, index) => {
          return (
            <Route
              key={`admin-${index}`}
              path={route.path}
              element={
                <ProtectedRoute requiredRoles={["ADMIN"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {route.children &&
                route.children.map((childRoute, childIndex) => (
                  <Route
                    key={`admin-child-${childIndex}`}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
            </Route>
          );
        })}

        {/* Public Routes */}
        {publicRoutes.map((route, index) => {
          let Layout = DefaultLayout;
          const Page = route.component;
          const slug = route.slug;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>{slug ? <Page slug={slug} /> : <Page />}</Layout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
