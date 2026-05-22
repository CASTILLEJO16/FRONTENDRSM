import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useErrorHandler } from '../hooks/useErrorHandler';

const ClientsContext = createContext();

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
}

export function ClientsProvider({ children }) {
  const { authAPI, isAuthenticated, token } = useAuth();
  const { handleError } = useErrorHandler();
  
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Función para obtener todos los clientes
  const fetchClients = useCallback(async (activo) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    console.log('[ClientsContext] Intentando cargar clientes...');
    console.log('[ClientsContext] URL:', authAPI.defaults.baseURL);
    console.log('[ClientsContext] Token disponible:', !!token);
    
    try {
      const query = (activo === true || activo === false) ? `?activo=${activo}` : '';
      const res = await authAPI.get(`/clients${query}`);
      console.log('[ClientsContext] Clientes cargados:', res.data.length);
      setClients(res.data);
      setRetryCount(0);
      return { success: true, clients: res.data };
    } catch (error) {
      console.error('[ClientsContext] Error al cargar:', error.message, error.code);
      const handledError = handleError(error, {
        userMessage: 'Error al obtener clientes',
        context: 'clients.fetchClients',
        showToast: true
      });
      setError(handledError);
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setRetryCount(prev => prev + 1);
      }
      
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, isAuthenticated, handleError, token]);

  // Cargar clientes cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && retryCount < 3) { // Limitar a 3 reintentos
      fetchClients();
    } else if (!isAuthenticated) {
      setClients([]);
      setRetryCount(0);
    }
  }, [isAuthenticated, fetchClients, retryCount]);

  // Función para reintentar manualmente
  const retryFetchClients = useCallback(() => {
    setRetryCount(0);
    fetchClients();
  }, [fetchClients]);

  // Crear nuevo cliente
  const createClient = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await authAPI.post('/clients', payload);
      const newClient = res.data;
      
      setClients(prev => [newClient, ...prev]);
      return { success: true, client: newClient };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: error?.response?.data?.msg || 'Error al crear cliente',
        context: 'clients.createClient'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Actualizar cliente existente
  const updateClient = useCallback(async (id, payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await authAPI.put(`/clients/${id}`, payload);
      const updatedClient = res.data;
      
      setClients(prev => prev.map(client => 
        client._id === id ? updatedClient : client
      ));
      return { success: true, client: updatedClient };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: error?.response?.data?.msg || 'Error al actualizar cliente',
        context: 'clients.updateClient'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Eliminar cliente
  const deleteClient = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await authAPI.delete(`/clients/${id}`);
      const updatedClient = res.data;

      setClients(prev => prev.map(client =>
        client._id === id ? updatedClient : client
      ));
      return { success: true, client: updatedClient };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: error?.response?.data?.msg || 'Error al inactivar cliente',
        context: 'clients.deleteClient'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  const toggleClientStatus = useCallback(async (id, activo) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authAPI.patch(`/clients/${id}/status`, { activo });
      const updatedClient = res.data;

      setClients(prev => prev.map(client =>
        client._id === id ? updatedClient : client
      ));
      return { success: true, client: updatedClient };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: error?.response?.data?.msg || 'Error al actualizar estado del cliente',
        context: 'clients.toggleClientStatus'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Agregar venta a cliente
  const agregarVenta = useCallback(async (clientId, payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await authAPI.post(`/clients/${clientId}/ventas`, payload);
      const updatedClient = res.data;
      
      setClients(prev => prev.map(client => 
        client._id === clientId ? updatedClient : client
      ));
      return { success: true, client: updatedClient };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al registrar venta',
        context: 'clients.agregarVenta'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Enviar mensaje a cliente
  const enviarMensaje = useCallback(async (clientId, data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payload = typeof data === 'string' ? { mensaje: data } : data;
      const res = await authAPI.post(`/clients/${clientId}/mensaje`, payload);
      const updatedClient = res.data;
      
      setClients(prev => prev.map(client => 
        client._id === clientId ? updatedClient : client
      ));
      return { success: true, client: updatedClient };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al enviar mensaje',
        context: 'clients.enviarMensaje'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Agregar observación (alias de enviarMensaje)
  const agregarObservacion = useCallback(async (clientId, texto) => {
    return enviarMensaje(clientId, texto);
  }, [enviarMensaje]);

  // Obtener cliente por ID
  const getClientById = useCallback(async (id) => {
    try {
      const res = await authAPI.get(`/clients/${id}`);
      return { success: true, client: res.data };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al obtener cliente',
        context: 'clients.getClientById'
      });
      return { success: false, error: handledError };
    }
  }, [authAPI, handleError]);

  // Buscar clientes
  const searchClients = useCallback(async (query) => {
    if (!query.trim()) {
      return { success: true, clients };
    }
    
    try {
      const res = await authAPI.get(`/clients/search?q=${encodeURIComponent(query)}`);
      return { success: true, clients: res.data };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al buscar clientes',
        context: 'clients.searchClients'
      });
      return { success: false, error: handledError };
    }
  }, [authAPI, handleError, clients]);

  // Filtrar clientes localmente
  const filterClients = useCallback((filters) => {
    return clients.filter(client => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          client.nombre?.toLowerCase().includes(searchLower) ||
          client.empresa?.toLowerCase().includes(searchLower) ||
          client.telefono?.toLowerCase().includes(searchLower) ||
          client.email?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      if (filters.vendedor && client.vendedor?._id !== filters.vendedor) {
        return false;
      }
      
      if (filters.estado !== undefined && client.compro !== filters.estado) {
        return false;
      }
      
      if (filters.fechaDesde) {
        const clientDate = new Date(client.fecha);
        const filterDate = new Date(filters.fechaDesde);
        if (clientDate < filterDate) return false;
      }
      
      if (filters.fechaHasta) {
        const clientDate = new Date(client.fecha);
        const filterDate = new Date(filters.fechaHasta);
        if (clientDate > filterDate) return false;
      }
      
      return true;
    });
  }, [clients]);

  // Estadísticas de clientes
  const getClientStats = useCallback(() => {
    const total = clients.length;
    const conVentas = clients.filter(c => c.ventas && c.ventas.length > 0).length;
    const sinVentas = total - conVentas;
    const comproTrue = clients.filter(c => c.compro === true).length;
    const comproFalse = clients.filter(c => c.compro === false).length;
    const pendientes = clients.filter(c => c.compro === null).length;
    
    const totalVentas = clients.reduce((sum, client) => {
      return sum + (client.ventas?.reduce((clientSum, venta) => 
        clientSum + Number(venta.monto || 0), 0) || 0);
    }, 0);
    
    const totalTransacciones = clients.reduce((sum, client) => {
      return sum + (client.ventas?.length || 0);
    }, 0);
    
    return {
      total,
      conVentas,
      sinVentas,
      comproTrue,
      comproFalse,
      pendientes,
      totalVentas,
      totalTransacciones,
      promedioPorVenta: totalTransacciones > 0 ? totalVentas / totalTransacciones : 0,
      tasaConversion: total > 0 ? (comproTrue / total) * 100 : 0
    };
  }, [clients]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    // Estado
    clients,
    isLoading,
    error,
    retryCount,
    
    // CRUD Operations
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
    getClientById,
    
    // Utilidades
    retryFetchClients,
    clearError: () => setError(null),
    
    // Operaciones específicas
    agregarVenta,
    enviarMensaje,
    agregarObservacion,
    
    // Búsqueda y filtrado
    searchClients,
    filterClients,
    
    // Estadísticas
    getClientStats,
    
    // Utilidades
    refreshClients: fetchClients
  };

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
}

export default ClientsContext;
