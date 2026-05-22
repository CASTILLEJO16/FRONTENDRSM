import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useErrorHandler } from '../hooks/useErrorHandler';

const ProductsContext = createContext();

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}

export function ProductsProvider({ children }) {
  const { authAPI, isAuthenticated, token } = useAuth();
  const { handleError } = useErrorHandler();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener productos
  // activo = true  → solo activos
  // activo = false → solo inactivos
  // activo = undefined (sin argumento) → TODOS
  const fetchProducts = useCallback(async (activo) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Solo agrega el filtro si se pasa true o false explícitamente
      const query = (activo === true || activo === false) ? `?activo=${activo}` : '';
      const res = await authAPI.get(`/products${query}`);
      setProducts(res.data);
      return { success: true, products: res.data };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al obtener productos',
        context: 'products.fetchProducts',
        showToast: true
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, isAuthenticated, handleError]);

  // Cargar productos cuando el usuario está autenticado (todos: activos e inactivos)
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts(undefined); // undefined = sin filtro, trae todos
    } else {
      setProducts([]);
    }
  }, [isAuthenticated, fetchProducts]);

  // Crear nuevo producto
  const createProduct = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await authAPI.post('/products', payload);
      const newProduct = res.data;
      
      setProducts(prev => [newProduct, ...prev]);
      return { success: true, product: newProduct };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: error?.response?.data?.msg || 'Error al crear producto',
        context: 'products.createProduct'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Actualizar producto existente
  const updateProduct = useCallback(async (id, payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await authAPI.put(`/products/${id}`, payload);
      const updatedProduct = res.data;
      
      setProducts(prev => prev.map(product => 
        product._id === id ? updatedProduct : product
      ));
      return { success: true, product: updatedProduct };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: error?.response?.data?.msg || 'Error al actualizar producto',
        context: 'products.updateProduct'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Eliminar producto
  const deleteProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authAPI.delete(`/products/${id}`);
      
      setProducts(prev => prev.filter(product => product._id !== id));
      return { success: true };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: error?.response?.data?.msg || 'Error al eliminar producto',
        context: 'products.deleteProduct'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Actualizar stock
  const updateStock = useCallback(async (id, cantidad) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await authAPI.patch(`/products/${id}/stock`, { cantidad });
      const updatedProduct = res.data;
      
      setProducts(prev => prev.map(product => 
        product._id === id ? updatedProduct : product
      ));
      return { success: true, product: updatedProduct };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: error?.response?.data?.msg || 'Error al actualizar stock',
        context: 'products.updateStock'
      });
      setError(handledError);
      return { success: false, error: handledError };
    } finally {
      setIsLoading(false);
    }
  }, [authAPI, handleError]);

  // Obtener producto por ID
  const getProductById = useCallback(async (id) => {
    try {
      const res = await authAPI.get(`/products/${id}`);
      return { success: true, product: res.data };
    } catch (error) {
      const handledError = handleError(error, {
        userMessage: 'Error al obtener producto',
        context: 'products.getProductById'
      });
      return { success: false, error: handledError };
    }
  }, [authAPI, handleError]);

  // Buscar productos localmente
  const searchProducts = useCallback((query) => {
    if (!query.trim()) {
      return products;
    }
    
    const searchLower = query.toLowerCase();
    return products.filter(product => 
      product.nombre?.toLowerCase().includes(searchLower) ||
      product.descripcion?.toLowerCase().includes(searchLower) ||
      product.categoria?.toLowerCase().includes(searchLower)
    );
  }, [products]);

  // Obtener productos activos (para dropdown)
  const getActiveProducts = useCallback(() => {
    return products.filter(p => p.activo !== false);
  }, [products]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    // Estado
    products,
    isLoading,
    error,
    
    // CRUD Operations
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    
    // Operaciones específicas
    updateStock,
    
    // Utilidades
    searchProducts,
    getActiveProducts,
    clearError,
    refreshProducts: fetchProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsContext;
