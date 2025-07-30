import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ErrorHandler from "../Components/errors/ErrorHandler";
import ProtectedRoute from "../Components/auth/ProtectedRoutes";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import RootLayout from "../Pages/Layout";
import PageNotFound from "../Pages/PageNotFound";

const isLoggedIn = false;
const userData: { email: string } | null = isLoggedIn
  ? { email: "email@gmail.com" }
  : null;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Root Layout */}
      <Route path="/" element={<RootLayout />} errorElement={<ErrorHandler />}>
        {/* Protected Home */}
        <Route
          index
          element={
            <ProtectedRoute
              isAllowed={isLoggedIn}
              redirectPath="/login"
              data={userData}
            >
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route
          path="login"
          element={
            !isLoggedIn ? (
              <LoginPage />
            ) : (
              <ProtectedRoute
                isAllowed={false}
                redirectPath="/"
                data={userData}
              >
                <LoginPage />
              </ProtectedRoute>
            )
          }
        />

        <Route
          path="register"
          element={
            !isLoggedIn ? (
              <RegisterPage />
            ) : (
              <ProtectedRoute
                isAllowed={false}
                redirectPath="/"
                data={userData}
              >
                <RegisterPage />
              </ProtectedRoute>
            )
          }
        />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<PageNotFound />} />
    </>
  )
);

export default router;
