import { useState, useEffect } from "react";
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";
import SocioForm from "./SocioForm";

const Socios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [socioEditar, setSocioEditar] = useState(null); // <--- Nuevo estado para saber a quién editamos

  useEffect(() => {
    cargarSocios();
  }, []);

  const cargarSocios = async () => {
    try {
      const response = await api.get('/Socios');
      setSocios(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando socios:", error);
      toast.error("Error de conexión");
      setLoading(false);
    }
  };

  // Función para abrir el modal en modo edición
  const handleEdit = (socio) => {
    setSocioEditar(socio); // Guardamos el socio seleccionado
    setShowModal(true);    // Abrimos el modal
  };

  // Función para abrir el modal en modo creación (limpio)
  const handleNew = () => {
    setSocioEditar(null); // Nos aseguramos de que esté vacío
    setShowModal(true);
  };

  // Función para borrar un socio
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este socio? Esta acción no se puede deshacer.")) return;

    try {
      await api.delete(`/Socios/${id}`);
      toast.success("Socio eliminado correctamente");
      cargarSocios(); // Recargamos la lista
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el socio");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Socios</h2>
          <p className="text-slate-500">Listado general de miembros activos.</p>
        </div>
        
        <button 
          onClick={handleNew} // Usamos la nueva función handleNew
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm font-medium"
        >
          <Plus size={20} />
          Nuevo Socio
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">DNI</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {socios.map((socio) => (
                <tr key={socio.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{socio.nombre} {socio.apellido}</td>
                  <td className="p-4 text-slate-600 font-mono">{socio.dni}</td>
                  <td className="p-4 text-slate-500">{socio.email}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Botón Editar */}
                      <button 
                        onClick={() => handleEdit(socio)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      
                      {/* Botón Eliminar */}
                      <button 
                        onClick={() => handleDelete(socio.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
      </div>

      {showModal && (
        <SocioForm 
          onClose={() => setShowModal(false)} 
          onSuccess={cargarSocios}
          socioToEdit={socioEditar} // <--- Pasamos el socio seleccionado (o null)
        />
      )}
    </div>
  );
};

export default Socios;