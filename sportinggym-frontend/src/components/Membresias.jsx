import { useState, useEffect } from "react";
import { Check, Dumbbell, Calendar, AlertCircle } from "lucide-react";
import api from "../config/api";
import VentaModal from "./VentaModal"; // Importamos el modal
import toast from "react-hot-toast";

const Membresias = () => {
  const [tiposMembresia, setTiposMembresia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planSeleccionado, setPlanSeleccionado] = useState(null); // Para controlar qué plan se va a vender

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      const { data } = await api.get("/TiposMembresia");
      setTiposMembresia(data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar los planes");
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para determinar estilos según el precio (solo estético)
  const getCardStyle = (costo) => {
    if (costo > 20000) return "border-blue-200 bg-blue-50 ring-1 ring-blue-100"; // Plan Caro/Premium
    return "border-slate-200 bg-white hover:border-blue-300"; // Plan Normal
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando planes...</div>;
  // Lógica para decidir qué beneficios mostrar según la cantidad de días
  const obtenerBeneficios = (dias) => {
    if (dias === 3) return "Acceso a maquinaria";
    if (dias === 5) return "Acceso a maquinaria + Lockers";
    if (dias === 7) return "Acceso a maquinaria + Lockers + Duchas";
    return "Acceso a instalaciones"; // Texto por defecto para otros casos
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Encabezado */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Planes Disponibles</h2>
        <p className="text-slate-500">Gestiona y vende las suscripciones de tu gimnasio.</p>
      </div>

      {/* Grid de Planes */}
      {tiposMembresia.length === 0 ? (
        <div className="text-center p-10 bg-slate-100 rounded-xl border border-dashed border-slate-300">
          <AlertCircle className="mx-auto h-10 w-10 text-slate-400 mb-2" />
          <p className="text-slate-500">No hay tipos de membresía creados en el sistema.</p>
          <p className="text-sm text-slate-400">Agregalos desde tu Base de Datos o Swagger primero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiposMembresia.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative rounded-2xl p-6 border shadow-sm transition-all hover:shadow-lg flex flex-col ${getCardStyle(plan.costo)}`}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-700 uppercase tracking-wide">{plan.nombre}</h3>
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
                  <span>
                    Acceso: <strong>{plan.diasPermitidosPorSemana === 7 ? "6 días por semana(Sábado por la mañana)" : `${plan.diasPermitidosPorSemana} días por semana`}</strong>
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <Check size={18} className="text-green-500" />
                  <span>{obtenerBeneficios(plan.diasPermitidosPorSemana)}</span>
                </li>
              </ul>

              <button 
                onClick={() => setPlanSeleccionado(plan)}
                className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-blue-600 transition-all shadow-md active:scale-95"
              >
                Vender Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Venta (Solo se muestra si hay un plan seleccionado) */}
      {planSeleccionado && (
        <VentaModal 
          plan={planSeleccionado}
          onClose={() => setPlanSeleccionado(null)}
          onSuccess={() => {
            // Aquí podrías recargar algo si fuera necesario
          }}
        />
      )}
    </div>
  );
};

export default Membresias;