import React, { useContext, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ClientsProvider } from "./context/ClientsContext";
import { ProductsProvider } from "./context/ProductsContext";
import { NotificationsProvider } from "./context/NotificationsContext";

// Components
import ErrorBoundary from "./components/ErrorBoundary";
import Toast from "./components/Toast";
import ConnectionStatus from "./components/ConnectionStatus";
import InstallPWA from "./components/InstallPWA";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Lazy loaded components
const ScanPage = lazy(() => import("./pages/ScanPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Clients = lazy(() => import("./pages/Clients"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Reports = lazy(() => import("./pages/Reports"));
const Activity = lazy(() => import("./pages/Activity"));
const Settings = lazy(() => import("./pages/Settings"));
const Historial = lazy(() => import("./pages/HistoryPage"));
const UsersAdmin = lazy(() => import("./pages/UsersAdmin"));
const Stock = lazy(() => import("./pages/Stock"));
const Sidebar = lazy(() => import("./components/Sidebar"));
const Topbar = lazy(() => import("./components/Topbar"));
const MobileNavbar = lazy(() => import("./components/MobileNavbar"));

// Page wrapper con animaciones
function PageWrapper({ children }) {
  return (
    <div className="animate-page-enter">
      {children}
    </div>
  );
}

function RequireRole({ allow, children }) {
  const { currentUser } = useAuth();
  const role = currentUser?.role || "vendedor";

  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}

// Componente para rutas protegidas
function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <Sidebar />
      </Suspense>
      
      <div className="md:pl-16">
        <Suspense fallback={<LoadingSpinner />}>
          <Topbar />
        </Suspense>
        
        <main className="p-4 md:p-6 max-w-full overflow-x-hidden">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route 
                path="/dashboard" 
                element={
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="/clients" 
                element={
                  <PageWrapper>
                    <Clients />
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="/analytics" 
                element={
                  <PageWrapper>
                    <RequireRole allow={["admin", "gerente", "vendedor"]}>
                      <Analytics />
                    </RequireRole>
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="/reports" 
                element={
                  <PageWrapper>
                    <RequireRole allow={["admin", "gerente", "vendedor"]}>
                      <Reports />
                    </RequireRole>
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="/activity" 
                element={
                  <PageWrapper>
                    <Activity />
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <PageWrapper>
                    <RequireRole allow={["admin"]}>
                      <Settings />
                    </RequireRole>
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="/admin/users" 
                element={
                  <PageWrapper>
                    <RequireRole allow={["admin"]}>
                      <UsersAdmin />
                    </RequireRole>
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="/historial" 
                element={
                  <PageWrapper>
                    <Historial />
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="/stock" 
                element={
                  <PageWrapper>
                    <Stock />
                  </PageWrapper>
                } 
              />
              
              <Route 
                path="*" 
                element={<Navigate to="/dashboard" />} 
              />
            </Routes>
          </Suspense>
        </main>
      </div>
      
      <Suspense fallback={null}>
        <MobileNavbar />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <NotificationsProvider>
          <AuthProvider>
            <ClientsProvider>
              <ProductsProvider>
                <Toast />
                <ConnectionStatus />
                <InstallPWA />
              
              <Routes>
                {/* RUTA PÚBLICA - No requiere login */}
                <Route 
                  path="/scan/:clientId" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ScanPage />
                    </Suspense>
                  } 
                />
                
                {/* Rutas de autenticación */}
                <Route 
                  path="/login" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <LoginPage />
                    </Suspense>
                  } 
                />
                
                {/* Rutas protegidas */}
                <Route 
                  path="/*" 
                  element={<ProtectedRoutes />}
                />
              </Routes>
              </ProductsProvider>
            </ClientsProvider>
          </AuthProvider>
        </NotificationsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
