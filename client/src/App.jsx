import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Main Layout
import Layout from "./Layout";

// Route Protector
import PrivateRoute from "./routes/PrivateRoute";

// Auth Pages
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));

// Admin Pages
const AdminDashBorad = lazy(() => import("./pages/Admin/Dashboard"));
const ManageTasks = lazy(() => import("./pages/Admin/ManageTasks"));
const CreateTasks = lazy(() => import("./pages/Admin/CreateTask"));
const ManageUsers = lazy(() => import("./pages/Admin/ManageUsers"));

// User Pages
const UserDashBorad = lazy(() => import("./pages/Users/Dashboard"));
const MyTasks = lazy(() => import("./pages/Users/MyTasks"));
const ViewTaskDetails = lazy(() => import("./pages/Users/ViewTaskDetails"));

// componenets
import { AuthLoader } from "./components";

function App() {
  return (
    <Router>
      {/* Auth Routes */}
      <Suspense fallback={<AuthLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>

      {/* Other Routes */}
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Admin Routes */}
          <Route path="admin" element={<PrivateRoute allowedRoles="admin" />}>
            <Route path="dashboard" element={<AdminDashBorad />} />
            <Route path="tasks" element={<ManageTasks />} />
            <Route path="create-tasks" element={<CreateTasks />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route path="user" element={<PrivateRoute allowedRoles="user" />}>
            <Route path="dashboard" element={<UserDashBorad />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="task-details/:id" element={<ViewTaskDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
