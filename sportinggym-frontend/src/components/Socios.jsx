import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";

const Socios = () => {
  // Datos "Mock" (Falsos) para probar el diseño antes de conectar la API
  const [socios] = useState([
    { id: 1, nombre: "Ana García", dni: "12345678", plan: "Pase Libre", estado: "Activo", vencimiento: "2026-03-15" },
    { id: 2, nombre: "Carlos López", dni: "87654321", plan: "3 Días", estado: "Vencido", vencimiento: "2026-02-10" },
    { id: 3, nombre: "Mariana Ruiz", dni: "11223344", plan: "Pase Libre", estado: "Activo", vencimiento: "2026-03-01" },
    { id: 4, nombre: "Jorge Diaz", dni: "99887766", plan: "Musculación", estado: "Inactivo", vencimiento: "2025-12-20" },
  ]);

  return (
    <div className="space-y-6">
      {/* Encabezado de la página */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Socios</h2>
          <p className="text-slate-500">Administra los miembros del gimnasio y sus estados.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm">
          <Plus size={20} />
          Nuevo Socio
        </button>
      </div>

      {/* Barra de Herramientas (Búsqueda y Filtros) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o DNI..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* Tabla de Datos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Socio</th>
                <th className="p-4 font-semibold">DNI</th>
                <th className="p-4 font-semibold">Plan Actual</th>
                <th className="p-4 font-semibold">Vencimiento</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {socios.map((socio) => (
                <tr key={socio.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{socio.nombre}</div>
                    <div className="text-xs text-slate-500">ID: #{socio.id}</div>
                  </td>
                  <td className="p-4 text-slate-600 font-mono">{socio.dni}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                      {socio.plan}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{socio.vencimiento}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      socio.estado === "Activo" ? "bg-green-100 text-green-700" :
                      socio.estado === "Vencido" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {socio.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación simple */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
          <span>Mostrando 4 de 24 socios</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Anterior</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Socios;