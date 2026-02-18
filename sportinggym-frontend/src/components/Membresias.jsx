import { useState, useEffect } from "react";
import { Check, Dumbbell, Calendar, AlertCircle, Pencil, Plus, Trash2 } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";
import MembresiaForm from "./MembresiaForm"; // Importamos el modal
import Swal from "sweetalert2";

const Membresias = () => {
  const [tiposMembresia, setTiposMembresia] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      const { data } = await api.get("/TiposMembresia");
      setTiposMembresia(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (plan) => {
    setPlanToEdit(plan);
    setShowModal(true);
  };

  const handleCreate = () => {
    setPlanToEdit(null); // Limpiamos para crear uno nuevo
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
        title: '¿Eliminar Plan?',
        text: "Cuidado: Si hay socios con este plan, podrías generar inconsistencias visuales.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
      }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await api.delete(`/TiposMembresia/${id}`);
                toast.success("Plan eliminado");
                fetchPlanes();
            } catch (error) {
                toast.error("No se pudo eliminar");
            }
        }
      });
  };

  // Mantengo tu lógica visual de beneficios
  const obtenerBeneficios = (dias) => {
    if (dias === 3) return "Acceso a maquinaria";
    if (dias === 5) return "Acceso a maquinaria + Lockers";
    if (dias >= 7) return "Acceso a maquinaria + Lockers + Duchas";
    return "Acceso a instalaciones";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Tarifas y Planes</h2>
            <p className="text-slate-500">Gestiona los precios y tipos de suscripción.</p>
        </div>
        <button 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-200 transition-all"
        >
            <Plus size={20} /> Crear Nuevo Plan
        </button>
      </div>

      {tiposMembresia.length === 0 ? (
        <div className="text-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-600">No hay planes creados</h3>
          <p className="text-slate-400 mb-6">Crea el primero para comenzar a registrar socios.</p>
          <button onClick={handleCreate} className="text-blue-600 font-bold hover:underline">Crear Plan Inicial</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiposMembresia.map((plan) => (
            <div key={plan.id} className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col hover:border-blue-300 transition-all group">
              
              {/* Botones de acción flotantes (aparecen al pasar el mouse o siempre visibles en móvil) */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => handleEdit(plan)}
                    className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                >
                    <Pencil size={16} />
                </button>
                <button 
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                >
                    <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-4 pr-10">
                <h3 className="text-lg font-bold text-slate-700 uppercase tracking-wide truncate">{plan.nombre}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">${plan.costo}</span>
                  <span className="text-slate-500 font-medium">/mes</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar size={18} className="text-blue-500" />
                  <span>Duración: <strong>30 Días</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <Dumbbell size={18} className="text-blue-500" />
                  <span>Pase: <strong>{plan.diasPermitidosPorSemana} días x sem.</strong></span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500" />
                  <span className="font-medium">{obtenerBeneficios(plan.diasPermitidosPorSemana)}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MembresiaForm 
            onClose={() => setShowModal(false)}
            onSuccess={fetchPlanes}
            planToEdit={planToEdit}
        />
      )}
    </div>
  );
};

export default Membresias;