import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";

const ROLES = ["admin", "gerente", "vendedor"];

export default function UsersAdmin() {
  const { currentUser, listUsers, updateUserRole, registerUserAsAdmin, showAlert } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", nombre: "", role: "vendedor" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await listUsers();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
      showAlert("error", e?.response?.data?.msg || "No autorizado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.username, u.nombre, u.role].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [users, search]);

  const onChangeRole = async (userId, role) => {
    if (!ROLES.includes(role)) return;

    try {
      const updated = await updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (String(u._id) === String(userId) ? updated : u)));
      showAlert("success", "Rol actualizado");
    } catch (e) {
      console.error(e);
      showAlert("error", e?.response?.data?.msg || "Error actualizando rol");
    }
  };

  const canEditRole = (u) => String(u?._id) !== String(currentUser?.id);

  const createUser = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.nombre) {
      showAlert("error", "Faltan campos");
      return;
    }

    setCreating(true);
    try {
      await registerUserAsAdmin(form);
      setForm({ username: "", password: "", nombre: "", role: "vendedor" });
      await load();
    } catch (err) {
      console.error(err);
      showAlert("error", err?.response?.data?.msg || "Error creando usuario");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Usuarios</h1>
          <p className="text-sm text-slate-400 mt-1">Administra usuarios y roles</p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar usuario..."
          className="pl-4 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Crear usuario</h2>

        <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            placeholder="Usuario"
            className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-400"
            autoComplete="off"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Contraseña"
            className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-400"
          />
          <input
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            placeholder="Nombre"
            className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-400"
          />
          <div className="flex gap-3">
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100"
            >
              <option value="vendedor">vendedor</option>
              <option value="gerente">gerente</option>
              <option value="admin">admin</option>
            </select>
            <button
              disabled={creating}
              className="bg-indigo-600 px-6 py-3 rounded-xl text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-soft"
            >
              {creating ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-500 mt-3">
          Tip: no puedes cambiar tu propio rol desde aquÃ­ (evita quedarte sin acceso).
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-100">Lista de usuarios</h2>
          <button
            onClick={load}
            className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-slate-200 hover:bg-slate-700 transition"
          >
            Recargar
          </button>
        </div>

        {loading ? (
          <div className="text-slate-400">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-slate-400">Sin usuarios</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-800">
                  <th className="py-3 pr-4">Usuario</th>
                  <th className="py-3 pr-4">Nombre</th>
                  <th className="py-3 pr-4">Rol</th>
                  <th className="py-3 pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const role = u.role || "vendedor";
                  const isSelf = String(u?._id) === String(currentUser?.id);
                  return (
                    <tr key={u._id} className="border-b border-slate-800/60">
                      <td className="py-3 pr-4 text-slate-100 font-medium">{u.username}</td>
                      <td className="py-3 pr-4 text-slate-200">{u.nombre || "-"}</td>
                      <td className="py-3 pr-4">
                        <select
                          value={role}
                          disabled={!canEditRole(u)}
                          onChange={(e) => onChangeRole(u._id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-slate-100 disabled:opacity-60"
                          title={isSelf ? "No puedes cambiar tu propio rol" : "Cambiar rol"}
                        >
                          <option value="vendedor">vendedor</option>
                          <option value="gerente">gerente</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-3 pr-4 text-slate-400">
                        {isSelf ? "Tú" : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

