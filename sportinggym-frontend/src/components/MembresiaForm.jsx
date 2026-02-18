import { useState, useEffect } from "react";
import { X, Save, Tag, DollarSign, Calendar } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const MembresiaForm = ({ onClose, onSuccess, planToEdit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    costo: "",
    diasPermitidosPorSemana: ""
  });

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        nombre: planToEdit.nombre,
        costo: planToEdit.costo,
        diasPermitidosPorSemana: planToEdit.diasPermitidosPorSemana
      });
    }
  }, [planToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formData.nombre,
        costo: parseFloat(formData.costo),
        diasPermitidosPorSemana: parseInt(formData.diasPermitidosPorSemana)
      };

      if (planToEdit) {
        await api.put(`/TiposMembresia/${planToEdit.id}`, payload);
        toast.success("Plan actualizado correctamente");
      } else {
        await api.post("/TiposMembresia", payload);
        toast.success("Nuevo plan creado");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el plan");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            {planToEdit ? "Editar Tarifa" : "Crear Nuevo Plan"}
          </h3>
          <button onClick={onClose}><X className="text-slate-400 hover:text-red-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Plan</label>
            <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Plan Verano, Pase Libre..."
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Precio Mensual ($)</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                  className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                  value={formData.costo}
                  onChange={(e) => setFormData({...formData, costo: e.target.value})}
                  required
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Días por Semana</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="number" 
                  className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: 3, 5, 7"
                  max="30"
                  value={formData.diasPermitidosPorSemana}
                  onChange={(e) => setFormData({...formData, diasPermitidosPorSemana: e.target.value})}
                  required
                />
            </div>
            <p className="text-xs text-slate-400 pl-1">Pon 7 para pase libre diario.</p>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 mt-4"
          >
            <Save size={20} /> Guardar Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default MembresiaForm;