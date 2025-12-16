import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ObservationModal from "../components/ObservationModal";
import { Loader2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function ScanPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { token, enviarMensaje, showAlert } = useContext(AppContext);
  
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        setLoading(true);
        
        // ✅ Llamada directa a la API sin autenticación
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
        const response = await axios.get(`${API_URL}/clients/public/${clientId}`);
        
        if (response.data) {
          setCliente(response.data);
          setShowModal(true);
        } else {
          setError("Cliente no encontrado");
        }
      } catch (err) {
        console.error("Error cargando cliente:", err);
        setError("Cliente no encontrado");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      cargarCliente();
    }
  }, [clientId]);

  const handleSaveMensaje = async (data) => {
    try {
      if (!token) {
        // Si no hay token, guardar sin autenticación
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
        await axios.post(`${API_URL}/clients/public/${clientId}/mensaje`, data);
      } else {
        // Si hay token, usar la función del contexto
        await enviarMensaje(clientId, data);
      }
      
      setShowModal(false);
      showAlert("success", "✅ Mensaje enviado correctamente");
      
      // Si está logueado, volver a clientes, si no, solo cerrar
      if (token) {
        navigate("/clients");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      showAlert("error", "❌ Error al enviar el mensaje");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-300">Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-red-800 rounded-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          {token && (
            <button
              onClick={() => navigate("/clients")}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
            >
              Volver a clientes
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          Cliente escaneado
        </h2>
        
        {cliente && (
          <div className="space-y-3 mb-6">
            <div className="bg-slate-900 p-4 rounded-lg">
              <p className="text-sm text-slate-400">Nombre</p>
              <p className="text-lg font-semibold text-slate-100">{cliente.nombre}</p>
            </div>
            
            <div className="bg-slate-900 p-4 rounded-lg">
              <p className="text-sm text-slate-400">Teléfono</p>
              <p className="text-slate-100">{cliente.telefono}</p>
            </div>
            
            {cliente.empresa && (
              <div className="bg-slate-900 p-4 rounded-lg">
                <p className="text-sm text-slate-400">Empresa</p>
                <p className="text-slate-100">{cliente.empresa}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg text-white font-medium transition-colors"
          >
            Enviar Mensaje
          </button>
          {token && (
            <button
              onClick={() => navigate("/clients")}
              className="px-6 py-3 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
            >
              Ver Lista
            </button>
          )}
        </div>
      </div>

      {showModal && cliente && (
        <ObservationModal
          cliente={cliente}
          onClose={() => setShowModal(false)}
          onSave={handleSaveMensaje}
        />
      )}
    </div>
  );
}