import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PromptPage from "./pages/PromptPage";
import MainLayout from "./layouts/AppLayout";
import AIPage from "./pages/AIPage";
import ProfilePage from "./pages/Profile";
import ExcercisePage from "./pages/Excercise";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="prompts" element={<PromptPage />} />
          <Route path="/ai-tool" element={<AIPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/exercise" element={<ExcercisePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
