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

const storageKey = "loggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

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
              isAllowed={userData?.jwt}
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
            <ProtectedRoute
              isAllowed={!userData?.jwt} // allow if NOT logged in
              redirectPath="/"
              data={userData}
            >
              <LoginPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="register"
          element={
            <ProtectedRoute
              isAllowed={!userData?.jwt} 
              redirectPath="/"
              data={userData}
            >
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute
              isAllowed={userData?.jwt}
              redirectPath="/profile"
              data={userData}
            >
              <h2>Profile page</h2>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<PageNotFound />} />
    </>
  )
);

export default router;
