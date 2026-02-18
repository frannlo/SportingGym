import { useState, useEffect } from "react";
import { Plus, Search, Pencil, UserX, UserCheck, Power } from "lucide-react"; // Nuevos iconos
import api from "../config/api";
import SocioForm from "./SocioForm";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const Socios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [socioToEdit, setSocioToEdit] = useState(null);

  useEffect(() => {
    cargarSocios();
  }, []);

  const cargarSocios = async () => {
    try {
      const { data } = await api.get("/Socios");
      setSocios(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los socios");
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar estado (Activar/Desactivar)
  const handleToggleEstado = (socio) => {
    const accion = socio.activo ? "dar de baja" : "reactivar";
    const nuevoEstado = !socio.activo;

    Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)}?`,
      text: `Vas a ${accion} a ${socio.nombre} ${socio.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: socio.activo ? '#d33' : '#10b981', // Rojo si baja, Verde si alta
      cancelButtonColor: '#64748b',
      confirmButtonText: socio.activo ? 'Sí, dar de baja' : 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            await api.put(`/Socios/${socio.id}/estado`); 
          
          Swal.fire(
            '¡Actualizado!',
            `El socio ha sido ${socio.activo ? 'desactivado' : 'reactivado'}.`,
            'success'
          );
          cargarSocios();
        }catch (error) {
          console.error(error);
          toast.error("No se pudo cambiar el estado");
        }
      }
    });
  };

  const handleEdit = (socio) => {
    setSocioToEdit(socio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSocioToEdit(null);
  };

  const sociosFiltrados = socios.filter(s =>
    s.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    s.apellido.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando socios...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Socios</h2>
          <p className="text-slate-500">Administra las altas y bajas de tus clientes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Nuevo Socio
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Estado</th> {/* NUEVA COLUMNA */}
              <th className="p-4 font-semibold">Nombre</th>
              <th className="p-4 font-semibold">DNI</th>
              <th className="p-4 font-semibold">Plan Actual</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sociosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  No se encontraron socios.
                </td>
              </tr>
            ) : (
              sociosFiltrados.map((socio) => (
                <tr key={socio.id} className={`transition-colors ${socio.activo ? 'hover:bg-slate-50' : 'bg-slate-50/80 grayscale opacity-75'}`}>
                  
                  {/* 1. Estado (Semáforo) */}
                  <td className="p-4">
                    {socio.activo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Inactivo
                      </span>
                    )}
                  </td>

                  {/* 2. Nombre */}
                  <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${socio.activo ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                      {socio.nombre.charAt(0)}{socio.apellido.charAt(0)}
                    </div>
                    <span className={socio.activo ? "text-slate-800" : "text-slate-500 line-through decoration-slate-400"}>
                        {socio.nombre} {socio.apellido}
                    </span>
                  </td>

                  {/* 3. DNI */}
                  <td className="p-4 text-slate-600">
                    {socio.dni}
                  </td>

                  {/* 4. Plan */}
                  <td className="p-4">
                    {socio.nombrePlan && socio.nombrePlan !== "-" && socio.nombrePlan !== "Sin Plan" ? (
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${socio.activo ? 'bg-green-100 text-green-800 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {socio.nombrePlan}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">
                        Sin membresía
                      </span>
                    )}
                  </td>

                  {/* 5. Acciones */}
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(socio)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar datos"
                    >
                      <Pencil size={18} />
                    </button>
                    
                    {/* Botón de Toggle Estado (Power) */}
                    <button 
                      onClick={() => handleToggleEstado(socio)}
                      className={`p-2 rounded-lg transition-colors ${
                        socio.activo 
                          ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' // Si está activo, botón rojo para apagar
                          : 'text-slate-400 hover:text-green-600 hover:bg-green-50' // Si está inactivo, botón verde para prender
                      }`}
                      title={socio.activo ? "Dar de baja" : "Reactivar"}
                    >
                      {socio.activo ? <UserX size={18} /> : <UserCheck size={18} />}
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <SocioForm 
          onClose={handleCloseModal}
          onSuccess={cargarSocios}
          socioToEdit={socioToEdit}
        />
      )}
    </div>
  );
};

export default Socios;
