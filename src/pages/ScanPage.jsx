import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ObservationModal from "../components/ObservationModal";
import { Loader2, AlertCircle } from "lucide-react";

export default function ScanPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, fetchClients, enviarMensaje } = useContext(AppContext);
  
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        setLoading(true);
        
        // Si no hay clientes cargados, cargarlos
        if (!clients || clients.length === 0) {
          await fetchClients();
        }
        
        // Buscar el cliente por ID
        const clienteEncontrado = clients.find(c => c._id === clientId);
        
        if (clienteEncontrado) {
          setCliente(clienteEncontrado);
          setShowModal(true); // Abrir modal automáticamente
        } else {
          setError("Cliente no encontrado");
        }
      } catch (err) {
        console.error("Error cargando cliente:", err);
        setError("Error al cargar la información del cliente");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      cargarCliente();
    }
  }, [clientId, clients, fetchClients]);

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
          <button
            onClick={() => navigate("/clients")}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            Volver a clientes
          </button>
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
          <button
            onClick={() => navigate("/clients")}
            className="px-6 py-3 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
          >
            Ver Lista
          </button>
        </div>
      </div>

      {/* Modal de observaciones */}
      {showModal && cliente && (
        <ObservationModal
          cliente={cliente}
          onClose={() => setShowModal(false)}
          onSave={async (texto) => {
            try {
              await enviarMensaje(cliente._id, texto);
              await fetchClients();
              setShowModal(false);
              
              // Mostrar confirmación
              alert("Mensaje enviado correctamente");
              navigate("/clients");
            } catch (error) {
              console.error("Error al guardar observación:", error);
              alert("Error al enviar el mensaje");
            }
          }}
        />
      )}
    </div>
  );
}