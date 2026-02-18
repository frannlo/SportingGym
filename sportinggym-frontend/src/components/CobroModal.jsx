import { useState, useEffect } from "react";
import { X, CheckCircle, DollarSign, User, CreditCard } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const CobroModal = ({ onClose, onSuccess }) => {
  const [socios, setSocios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [seleccion, setSeleccion] = useState({
    socioId: "",
    tipoMembresiaId: ""
  });

  // Cargar listas al abrir
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resSocios, resPlanes] = await Promise.all([
          api.get("/Socios"),
          api.get("/TiposMembresia")
        ]);
        // Filtramos solo socios activos para cobrar
        setSocios(resSocios.data.filter(s => s.activo));
        setPlanes(resPlanes.data);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar datos");
      }
    };
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Enviamos al endpoint de renovación
        await api.post("/Membresias/renovar", {
            socioId: parseInt(seleccion.socioId),
            tipoMembresiaId: parseInt(seleccion.tipoMembresiaId)
        });
        
        toast.success("¡Pago registrado y membresía renovada!");
        onSuccess(); // Recargar tabla de pagos
        onClose();
    } catch (error) {
        console.error(error);
        toast.error("Error al procesar el cobro");
    } finally {
        setLoading(false);
    }
  };

  // Buscar precio del plan seleccionado para mostrarlo
  const planSeleccionado = planes.find(p => p.id === parseInt(seleccion.tipoMembresiaId));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="bg-green-600 px-6 py-4 border-b border-green-500 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <DollarSign size={24} /> Registrar Nuevo Cobro
          </h3>
          <button onClick={onClose}><X className="hover:text-green-200" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Seleccionar Socio */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User size={16} /> Socio
            </label>
            <select
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                value={seleccion.socioId}
                onChange={e => setSeleccion({...seleccion, socioId: e.target.value})}
                required
            >
                <option value="">-- Buscar Socio --</option>
                {socios.map(s => (
                    <option key={s.id} value={s.id}>
                        {s.nombre} {s.apellido} ({s.dni})
                    </option>
                ))}
            </select>
          </div>

          {/* Seleccionar Plan */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CreditCard size={16} /> Plan a Renovar
            </label>
            <select
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                value={seleccion.tipoMembresiaId}
                onChange={e => setSeleccion({...seleccion, tipoMembresiaId: e.target.value})}
                required
            >
                <option value="">-- Elegir Tarifa --</option>
                {planes.map(p => (
                    <option key={p.id} value={p.id}>
                        {p.nombre} — ${p.costo}
                    </option>
                ))}
            </select>
          </div>

          {/* Resumen de Total */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Total a Cobrar:</span>
            <span className="text-2xl font-bold text-green-600">
                ${planSeleccionado ? planSeleccionado.costo : "0"}
            </span>
          </div>

          <button 
            type="submit" 
            disabled={loading || !seleccion.socioId || !seleccion.tipoMembresiaId}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-200"
          >
            {loading ? "Procesando..." : <><CheckCircle size={20} /> Confirmar Pago</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CobroModal;