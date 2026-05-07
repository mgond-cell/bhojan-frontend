import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import CookPanel from "./pages/cookPanel";
import Profile from "./pages/Profile";

import OrderTracker from "./pages/OrderTracker";
import "./styles/global.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
  <Route path="/"      element={<Home />} />
  <Route path="/plans" element={<Plans />} />
  <Route path="/login" element={<Auth />} />
  <Route path="/dashboard" element={
    <ProtectedRoute><Dashboard /></ProtectedRoute>
  } />
  <Route path="/cook" element={
    <ProtectedRoute><CookPanel /></ProtectedRoute>
  } />
  <Route path="/profile" element={
  <ProtectedRoute><Profile /></ProtectedRoute>
} />
<Route path="/tracker" element={
  <ProtectedRoute><OrderTracker /></ProtectedRoute>
} />
</Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}