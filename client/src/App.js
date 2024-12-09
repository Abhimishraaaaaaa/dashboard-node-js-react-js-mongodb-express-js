import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoutes from "./components/routes/PrivateRoutes";
import PublicRoutes from "./components/routes/PublicRoutes";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <HomePage />
            </PublicRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoutes>
              <Register />
            </PublicRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoutes>
              <Dashboard />
            </PrivateRoutes>
          }
        />

        {/* Route for handling 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
