import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";
import ScanPage from "./pages/ScanPage";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Toast from "./components/Toast";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Historial from "./pages/HistoryPage";
import UsersAdmin from "./pages/UsersAdmin";
import MobileNavbar from "./components/MobileNavbar";
import InstallPWA from "./components/InstallPWA";

// Page wrapper con animaciones
function PageWrapper({ children }) {
  return (
    <div className="animate-page-enter">
      {children}
    </div>
  );
}

function RequireRole({ allow, children }) {
  const { currentUser } = useContext(AppContext);
  const role = currentUser?.role || "vendedor";

  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { token } = useContext(AppContext);

  return (
    <BrowserRouter>
      <Toast />
      <InstallPWA /> 
      
      <Routes>
        {/* ✅ RUTA PÚBLICA - No requiere login */}
        <Route path="/scan/:clientId" element={<ScanPage />} />
        
        {!token ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <Route path="*" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
              <Sidebar />
              <div className="md:pl-16">
                <Topbar />
                <main className="p-4 md:p-6 max-w-full overflow-x-hidden">
                  <Routes>
                    <Route path="/dashboard" element={
                      <PageWrapper>
                        <Dashboard />
                      </PageWrapper>
                    } />
                    <Route path="/clients" element={
                      <PageWrapper>
                        <Clients />
                      </PageWrapper>
                    } />
                    <Route path="/analytics" element={
                      <PageWrapper>
                        <RequireRole allow={["admin", "gerente", "vendedor"]}>
                          <Analytics />
                        </RequireRole>
                      </PageWrapper>
                    } />
                    <Route path="/reports" element={
                      <PageWrapper>
                        <RequireRole allow={["admin", "gerente", "vendedor"]}>
                          <Reports />
                        </RequireRole>
                      </PageWrapper>
                    } />
                    <Route path="/activity" element={
                      <PageWrapper>
                        <Activity />
                      </PageWrapper>
                    } />
                    <Route path="/settings" element={
                      <PageWrapper>
                        <RequireRole allow={["admin"]}>
                          <Settings />
                        </RequireRole>
                      </PageWrapper>
                    } />
                    <Route path="/admin/users" element={
                      <PageWrapper>
                        <RequireRole allow={["admin"]}>
                          <UsersAdmin />
                        </RequireRole>
                      </PageWrapper>
                    } />
                    <Route path="/historial" element={
                      <PageWrapper>
                        <Historial />
                      </PageWrapper>
                    } />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </main>
              </div>
              <MobileNavbar />
            </div>
          } />
        )}
      </Routes>
    </BrowserRouter>
  );
}
