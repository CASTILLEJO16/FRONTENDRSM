import React, { useEffect, useMemo, useState } from "react";
import { useClients } from "../context/ClientsContext";
import { useProducts } from "../context/ProductsContext";
import { useNotifications } from "../context/NotificationsContext";
import ClientList from "../components/ClientList";
import ClientForm from "../components/ClientForm";
import SaleForm from "../components/SaleForm";
import { Search } from "lucide-react";

export default function Clients() {
  const { clients, fetchClients, createClient, updateClient, toggleClientStatus } = useClients();
  const { products, updateStock } = useProducts();
  const { showSuccessAlert, showErrorAlert, showWarningAlert, showError } = useNotifications();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newSaleClient, setNewSaleClient] = useState(null);

  useEffect(() => { 
    fetchClients(); 
  }, [fetchClients]);

  const filtered = useMemo(() => {
    let baseClients = clients || [];

    if (statusFilter === "activos") {
      baseClients = baseClients.filter((client) => client.activo !== false);
    }

    if (statusFilter === "inactivos") {
      baseClients = baseClients.filter((client) => client.activo === false);
    }

    if (!search.trim()) {
      return baseClients;
    }

    if (selectedClientId) {
      return baseClients.filter((client) => client._id === selectedClientId);
    }

    return baseClients.filter((client) =>
      client.nombre?.toLowerCase().includes(search.toLowerCase())
    );
  }, [clients, search, selectedClientId, statusFilter]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];

    const term = search.toLowerCase();
    return (clients || [])
      .filter((client) => client.nombre?.toLowerCase().includes(term))
      .slice(0, 6);
  }, [clients, search]);

  const handleSelectClient = (client) => {
    setSearch(client.nombre || "");
    setSelectedClientId(client._id);
    setShowSuggestions(false);
  };

  const handleDelete = (client) => {
    showError(
      `No es posible borrar el cliente "${client.nombre}". Para ocultarlo del sistema, edítalo y márcalo como Inactivo.`
    );
  };

  // Función para agregar una nueva venta a un cliente
  const handleAddSale = async (clientId, venta) => {
    try {
      // Buscar el cliente
      const client = clients.find(c => c._id === clientId);
      if (!client) return;

      // Buscar el producto por nombre
      const product = products.find(p => p.nombre === venta.producto);
      
      // Actualizar stock del producto si existe
      if (product) {
        const cantidadVendida = Number(venta.cantidad) || 0;
        const delta = -cantidadVendida; // Negativo para restar
        const nuevoStock = (product.stock || 0) + delta;
        
        await updateStock(product._id, delta);
        
        // Verificar si el stock está bajo (menor a 5)
        if (nuevoStock > 0 && nuevoStock <= 5) {
          showWarningAlert(`⚠️ Stock bajo: ${product.nombre} tiene ${nuevoStock} ${product.unidad || 'unidad(es)'} restantes`);
        } else if (nuevoStock <= 0) {
          showWarningAlert(`⚠️ Stock agotado: ${product.nombre} está sin stock`);
        }
      }

      // Agregar la nueva venta al array existente
      const updatedClient = {
        ...client,
        ventas: [...(client.ventas || []), { ...venta, fecha: new Date() }]
      };

      // Actualizar en el backend
      await updateClient(clientId, updatedClient);
      
      // Mostrar mensaje de éxito
      showSuccessAlert("Venta registrada exitosamente");
      
      // Recargar clientes para actualizar la gráfica
      await fetchClients();
    } catch (error) {
      console.error("Error al registrar venta:", error);
      showErrorAlert("Error al registrar la venta");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Clientes</h1>
          <p className="text-sm text-slate-400 mt-1">Gestiona tu lista de clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedClientId(null);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Buscar clientes..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-soft-lg z-50 max-h-64 overflow-y-auto">
                {suggestions.map((client) => (
                  <button
                    key={client._id}
                    type="button"
                    onClick={() => handleSelectClient(client)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                  >
                    <div className="font-medium text-slate-100">{client.nombre}</div>
                    {client.empresa && (
                      <div className="text-sm text-slate-400">{client.empresa}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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
        onDelete={handleDelete}
        onAddSale={handleAddSale}
      />

      <ClientForm
        open={open}
        onClose={() => { setOpen(false); setEditing(null); }}
        editing={editing}
        onSave={async (data) => {
          const payload = {
            ...data,
            activo: data.activo !== false,
          };

          if (editing) {
            const statusChanged = (editing.activo !== false) !== payload.activo;
            await updateClient(editing._id, payload);
            if (statusChanged) {
              await toggleClientStatus(editing._id, payload.activo);
            }
            showSuccessAlert("Cliente actualizado correctamente");
          } else {
            await createClient({ ...payload, fecha: data.fecha || new Date() });
            showSuccessAlert("Cliente creado correctamente");
          }
          setOpen(false);
          await fetchClients();
        }}
        onSaveAndNewSale={async (data) => {
          let created;
          const payload = {
            ...data,
            activo: data.activo !== false,
            fecha: data.fecha || new Date(),
          };
          const res = await createClient(payload);
          if (res?.success) {
            showSuccessAlert("Cliente creado correctamente");
          }
          if (res && res.success && res.client) {
            created = res.client;
          } else if (res && !res.success) {
            return; // Error handled by context
          }
          setOpen(false);
          await fetchClients();
          if (created) {
            setNewSaleClient(created);
          }
        }}
      />

      <SaleForm
        open={!!newSaleClient}
        cliente={newSaleClient}
        onClose={() => setNewSaleClient(null)}
        onSave={async (venta) => {
          if (newSaleClient) {
            await handleAddSale(newSaleClient._id, venta);
          }
          setNewSaleClient(null);
        }}
      />
    </div>
  );
}
