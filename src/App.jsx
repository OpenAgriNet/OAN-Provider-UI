import { Suspense, lazy } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";

const AdminHome = lazy(() => import("./pages/Admin/AdminHome"));
const TagContent = lazy(() => import("./pages/TagContent"));
const MyCourses = lazy(() => import("./pages/MyCourses"));
const MyAnalytics = lazy(() => import("./pages/MyAnalytics"));
const HomePage = lazy(() => import("./pages/HomePage"));
const Register = lazy(() => import("./pages/Register"));
const uploadCSV = lazy(() => import("./pages/uploadCSV"));
const Services = lazy(() => import("./pages/Services"));
const Login = lazy(() => import("./pages/Login"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
// const MyCollection = lazy(() => import("./pages/MyCollection"));
const ProtectedRoutes = lazy(() =>
  import("./routes/ProtectedRoutes/ProtectedRoutes")
);

const MyTotalCollection = lazy(() => import("./pages/MyTotalCollection"));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route path="/" element={<ProtectedRoutes Component={Login} />} />
            <Route
              path="/home"
              element={<ProtectedRoutes Component={HomePage} />}
            />
            <Route
              path="/tagcontent"
              element={<ProtectedRoutes Component={TagContent} />}
            />
            <Route
              path="/content"
              element={<ProtectedRoutes Component={MyCourses} />}
            />
            <Route
              path="/myanalytics"
              element={<ProtectedRoutes Component={MyAnalytics} />}
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={<ProtectedRoutes Component={Login} />}
            />
            <Route
              path="/uploadCSV"
              element={<ProtectedRoutes Component={uploadCSV} />}
            />
            <Route
              path="/services"
              element={<ProtectedRoutes Component={Services} />}
            />
            {/* <Route
              path="/collection"
              element={<ProtectedRoutes Component={MyCollection} />}
            /> */}
            <Route
              path="/admin-home"
              element={<ProtectedRoutes Component={AdminHome} />}
            />
            <Route
              path="/collections"
              element={<ProtectedRoutes Component={MyTotalCollection} />}
            />
          </Routes>
        </Router>
      </Suspense>
    </>
  );
}

export default App;
