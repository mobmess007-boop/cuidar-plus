import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Medicamentos from './pages/Medicamentos/index';
import AdicionarMedicamento from './pages/Medicamentos/Adicionar';
import Pressao from './pages/Pressao/index';
import AdicionarPressao from './pages/Pressao/Adicionar';
import Diabetes from './pages/Diabetes/index';
import AdicionarDiabetes from './pages/Diabetes/Adicionar';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/medicamentos/adicionar" element={<AdicionarMedicamento />} />
            <Route path="/pressao" element={<Pressao />} />
            <Route path="/pressao/adicionar" element={<AdicionarPressao />} />
            <Route path="/diabetes" element={<Diabetes />} />
            <Route path="/diabetes/adicionar" element={<AdicionarDiabetes />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
