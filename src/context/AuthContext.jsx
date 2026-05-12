import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useErrorHandler } from '../hooks/useErrorHandler';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const tokenRef = useRef(token);
  
  // Actualizar ref cuando cambie el token
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  const [isLoading, setIsLoading] = useState(false);
  const { handleError, handleAuthError } = useErrorHandler();

  // Configurar axios instance para auth
  const authAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    timeout: 60000,
  });

  // Interceptor para incluir token en requests (usa ref para valor actual)
  authAPI.interceptors.request.use((config) => {
    if (tokenRef.current) {
      config.headers.Authorization = `Bearer ${tokenRef.current}`;
    }
    return config;
  });

  // Interceptor para manejar errores de auth
  authAPI.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  // Efecto para limpiar datos si no hay token
  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      localStorage.removeItem('user');
    }
  }, [token]);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const res = await authAPI.post('/auth/login', { username, password });
      const { token: newToken, user } = res.data;

      setToken(newToken);
      setCurrentUser(user);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      const handledError = handleAuthError(error, {
        userMessage: 'Error al iniciar sesión. Verifica tus credenciales.',
        context: 'auth.login'
      });
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, password, nombre, role = 'vendedor') => {
    setIsLoading(true);
    try {
      await authAPI.post('/auth/register', { username, password, nombre, role });
      return { success: true };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al registrar usuario. Intenta con otros datos.',
        context: 'auth.register'
      });
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authAPI.put('/auth/profile', userData);
      const updatedUser = res.data;
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al actualizar perfil.',
        context: 'auth.updateProfile'
      });
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      await authAPI.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al cambiar contraseña. Verifica la actual.',
        context: 'auth.changePassword'
      });
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones de admin
  const listUsers = async () => {
    try {
      const res = await authAPI.get('/auth/users');
      return { success: true, users: res.data };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al obtener usuarios.',
        context: 'auth.listUsers'
      });
      return { success: false, error: handledError };
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const res = await authAPI.patch(`/auth/users/${userId}/role`, { role });
      return { success: true, user: res.data };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al actualizar rol de usuario.',
        context: 'auth.updateUserRole'
      });
      return { success: false, error: handledError };
    }
  };

  const listSalesUsers = async () => {
    try {
      const res = await authAPI.get('/auth/sales-users');
      return { success: true, users: res.data };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al obtener vendedores.',
        context: 'auth.listSalesUsers'
      });
      return { success: false, error: handledError };
    }
  };

  const registerUserAsAdmin = async ({ username, password, nombre, role }) => {
    try {
      await authAPI.post('/auth/register', { username, password, nombre, role });
      return { success: true };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al crear usuario.',
        context: 'auth.registerUserAsAdmin'
      });
      return { success: false, error: handledError };
    }
  };

  const value = {
    // Estado
    token,
    currentUser,
    isLoading,
    isAuthenticated: !!token,
    
    // API instance
    authAPI,
    
    // Métodos
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    
    // Métodos de admin
    listUsers,
    updateUserRole,
    listSalesUsers,
    registerUserAsAdmin,
    
    // Utilidades
    isAdmin: currentUser?.role === 'admin',
    isGerente: currentUser?.role === 'gerente',
    isVendedor: currentUser?.role === 'vendedor',
    canManageUsers: ['admin'].includes(currentUser?.role),
    canViewReports: ['admin', 'gerente', 'vendedor'].includes(currentUser?.role),
    canManageSettings: ['admin'].includes(currentUser?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
