import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import NotFound from '../pages/NotFound.jsx';
import StudentDashboard from '../pages/StudentDashboard.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="student" element={<StudentDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
