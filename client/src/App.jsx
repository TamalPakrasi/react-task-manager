import { lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import AuthLayout from "@layouts/AuthLayout";
import MainLayout from "@layouts/MainLayout";

// Route Protector
import PrivateRoute from "@routes/PrivateRoute";

// interceptor
import AxiosInterceptor from "@network/AxiosInterceptor";

// Auth Pages
const Login = lazy(() => import("@pages/Auth/Login"));
const Register = lazy(() => import("@pages/Auth/Register"));

// Admin Pages
const AdminDashBorad = lazy(() => import("@pages/Admin/Dashboard"));
const ManageTasks = lazy(() => import("@pages/Admin/ManageTasks"));
const CreateTask = lazy(() => import("@pages/Admin/CreateTask"));
const ManageUsers = lazy(() => import("@pages/Admin/ManageUsers"));
const UpdateTask = lazy(() => import("@pages/Admin/updateTask"));

// member Pages
const MemberDashBorad = lazy(() => import("@pages/Users/Dashboard"));
const MyTasks = lazy(() => import("@pages/Users/MyTasks"));
const ViewMemberTaskDetails = lazy(() =>
  import("@pages/Users/ViewTaskDetails")
);

function App() {
  useEffect(() => {
    document.documentElement.classList.add("scrollbar");
  }, []);

  return (
    <Router>
      <AxiosInterceptor />
      {/* Auth Routes */}
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Other Routes */}
        <Route path="/" element={<MainLayout />}>
          {/* Admin Routes */}
          <Route path="admin" element={<PrivateRoute allowedRole="admin" />}>
            <Route path="dashboard" element={<AdminDashBorad />} />
            <Route path="tasks" element={<ManageTasks />} />
            <Route path="update-task/:id" element={<UpdateTask />} />
            <Route path="create-tasks" element={<CreateTask />} />
            <Route path="members" element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route path="member" element={<PrivateRoute allowedRole="member" />}>
            <Route path="dashboard" element={<MemberDashBorad />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route
              path="task-details/:id"
              element={<ViewMemberTaskDetails />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
