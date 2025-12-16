import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";
import ScanPage from "./pages/ScanPage";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Toast from "./components/Toast"; // ✅ CAMBIO: Usar Toast en lugar de Alert

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Historial from "./pages/HistoryPage";
import MobileNavbar from "./components/MobileNavbar";

export default function App() {
  const { token } = useContext(AppContext);

  return (
    <BrowserRouter>
      {/* ✅ Toast global - se muestra en toda la app */}
      <Toast />
      
      {!token ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="min-h-screen bg-slate-900 text-slate-100">
          <Sidebar />
          <div className="md:pl-64">
            <Topbar />
            <main className="p-6">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/scan/:clientId" element={<ScanPage />}/>
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
          <MobileNavbar />
        </div>
      )}
    </BrowserRouter>
  );
}