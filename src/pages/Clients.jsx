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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-slate-400">Gestiona tu lista de clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Buscar clientes..." 
            className="pl-3 pr-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" 
          />
          <button 
            onClick={() => { setOpen(true); setEditing(null); }} 
            className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
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