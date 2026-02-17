import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const SocioForm = ({ onClose, onSuccess, socioToEdit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    fechaNacimiento: ""
  });

  // Efecto Mágico: Si nos pasan un socio para editar, rellenamos el formulario
  useEffect(() => {
    if (socioToEdit) {
      setFormData({
        nombre: socioToEdit.nombre,
        apellido: socioToEdit.apellido,
        dni: socioToEdit.dni,
        email: socioToEdit.email || "", // Si es null, ponemos string vacío
        telefono: socioToEdit.telefono || "",
        // Truco para las fechas: Cortamos la parte de la hora (T) para que el input type="date" la entienda
        fechaNacimiento: socioToEdit.fechaNacimiento ? socioToEdit.fechaNacimiento.split('T')[0] : ""
      });
    }
  }, [socioToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (socioToEdit) {
        // MODO EDICIÓN (PUT)
        await api.put(`/Socios/${socioToEdit.id}`, formData);
        toast.success("¡Socio actualizado correctamente!");
      } else {
        // MODO CREACIÓN (POST)
        await api.post("/Socios", formData);
        toast.success("¡Socio registrado correctamente!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      const mensaje = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(", ")
        : "Error al guardar los cambios";
      toast.error(mensaje);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Encabezado Dinámico */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            {socioToEdit ? "Editar Socio" : "Nuevo Socio"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nombre</label>
              <input required name="nombre" value={formData.nombre} onChange={handleChange} 
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Apellido</label>
              <input required name="apellido" value={formData.apellido} onChange={handleChange} 
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">DNI</label>
            <input required name="dni" value={formData.dni} onChange={handleChange} 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Teléfono</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Fecha de Nacimiento</label>
            <input required type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 font-medium">
              <Save size={18} /> {socioToEdit ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocioForm;