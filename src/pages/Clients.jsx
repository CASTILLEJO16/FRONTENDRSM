import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import ClientList from "../components/ClientList";
import ClientForm from "../components/ClientForm";

export default function Clients() {
  const { clients, fetchClients, createClient, updateClient, deleteClient, showAlert } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchClients(); }, []);

  const filtered = (clients || []).filter(c =>
    [c.nombre, c.empresa, c.email, c.vendedor].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // Función para agregar una nueva venta a un cliente
  const handleAddSale = async (clientId, venta) => {
    try {
      // Buscar el cliente
      const client = clients.find(c => c._id === clientId);
      if (!client) return;

      // Agregar la nueva venta al array existente
      const updatedClient = {
        ...client,
        ventas: [...(client.ventas || []), { ...venta, fecha: new Date() }]
      };

      // Actualizar en el backend
      await updateClient(clientId, updatedClient);
      
      // Mostrar mensaje de éxito
      showAlert("success", "Venta registrada exitosamente");
      
      // Recargar clientes para actualizar la gráfica
      await fetchClients();
    } catch (error) {
      console.error("Error al registrar venta:", error);
      showAlert("error", "Error al registrar la venta");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Clientes</h1>
          <p className="text-sm text-slate-400 mt-1">Gestiona tu lista de clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Buscar clientes..." 
            className="pl-4 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200" 
          />
          <button 
            onClick={() => { setOpen(true); setEditing(null); }} 
            className="bg-indigo-600 px-6 py-3 rounded-xl text-white font-medium hover:bg-indigo-700 transition-colors shadow-soft hover:shadow-soft-lg"
          >
            Nuevo Cliente
          </button>
        </div>
      </div>

      <ClientList 
        clients={filtered} 
        onEdit={(c) => { setEditing(c); setOpen(true); }} 
        onDelete={(id) => deleteClient(id)}
        onAddSale={handleAddSale}
      />

      <ClientForm
        open={open}
        onClose={() => { setOpen(false); setEditing(null); }}
        editing={editing}
        onSave={async (data) => {
          if (editing) await updateClient(editing._id, data);
          else await createClient({ ...data, fecha: data.fecha || new Date() });
          setOpen(false);
          await fetchClients();
        }}
      />
    </div>
  );
}