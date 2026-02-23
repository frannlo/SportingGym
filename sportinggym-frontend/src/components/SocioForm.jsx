import { useState, useEffect } from "react";
import { X, Save, User, Mail, Phone, Calendar, CreditCard, AlignLeft } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const SocioForm = ({ onClose, onSuccess, socioToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [planes, setPlanes] = useState([]); // Para llenar el select

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    tipoMembresiaId: "" // Nuevo campo obligatorio para crear
  });

  // 1. Cargar Planes disponibles y datos si es edición
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const { data } = await api.get("/TiposMembresia");
        setPlanes(data);
      } catch (error) {
        console.error("Error al cargar planes", error);
        toast.error("No se pudieron cargar los planes de membresía");
      }
    };

    // Solo cargamos planes si estamos creando un usuario nuevo (porque es obligatorio elegir uno)
    if (!socioToEdit) {
      fetchPlanes();
    }

    // Si estamos editando, rellenamos el formulario con los datos del socio
    if (socioToEdit) {
      setFormData({
        nombre: socioToEdit.nombre || "",
        apellido: socioToEdit.apellido || "",
        dni: socioToEdit.dni || "",
        email: socioToEdit.email || "",
        telefono: socioToEdit.telefono || "",
        fechaNacimiento: socioToEdit.fechaNacimiento ? socioToEdit.fechaNacimiento.split('T')[0] : "",
        tipoMembresiaId: "" // En edición no cambiamos el plan desde aquí
      });
    }
  }, [socioToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (socioToEdit) {
        // MODO EDICIÓN
        const payloadEdicion = {
          id: socioToEdit.id,
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          email: formData.email,
          telefono: formData.telefono,
          fechaNacimiento: formData.fechaNacimiento
        };

        await api.put(`/Socios/${socioToEdit.id}`, payloadEdicion);
        toast.success("Socio actualizado correctamente");
      } else {
        // MODO CREACIÓN (POST)
        if (!formData.tipoMembresiaId) {
            toast.error("Debes seleccionar un plan");
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            tipoMembresiaId: parseInt(formData.tipoMembresiaId)
        };
        
        await api.post("/Socios", payload);
        toast.success("¡Socio registrado!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Detalle completo del error:", error.response?.data);
      
      if (error.response?.data?.errors) {
          const validationErrors = error.response.data.errors;
          const firstField = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstField][0];
          toast.error(`Error en ${firstField}: ${firstErrorMessage}`);
      } else {
          const errorMsg = error.response?.data?.message || "Error desconocido";
          toast.error(typeof errorMsg === 'string' ? errorMsg : "Error al guardar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {socioToEdit ? <User className="text-blue-600" /> : <User className="text-green-600" />}
            {socioToEdit ? "Editar Socio" : "Nuevo Socio + Membresía"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6">
          <form id="socio-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Sección: Datos Personales */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <AlignLeft size={14} /> Datos Personales
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Nombre</label>
                        <input 
                            type="text" 
                            name="nombre"
                            className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej: Juan"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Apellido</label>
                        <input 
                            type="text" 
                            name="apellido"
                            className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej: Pérez"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">DNI (Identificación)</label>
                    <input 
                        type="text" 
                        name="dni"
                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        placeholder="Ej: 12345678"
                        value={formData.dni}
                        onChange={handleChange}
                        required
                        maxLength={8}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Mail size={14} className="text-slate-400" /> Email
                        </label>
                        <input 
                            type="email" 
                            name="email"
                            className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="juan@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Phone size={14} className="text-slate-400" /> Teléfono
                        </label>
                        <input 
                            type="tel" 
                            name="telefono"
                            className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej: 381..."
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" /> Fecha de Nacimiento
                    </label>
                    <input 
                        type="date" 
                        name="fechaNacimiento"
                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {/* Sección: Plan Inicial (SOLO APARECE AL CREAR) */}
            {!socioToEdit && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider flex items-center gap-2 bg-green-50 p-2 rounded-lg w-fit">
                        <CreditCard size={16} /> Selección de Plan Inicial
                    </h4>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Elige la membresía con la que inicia:</label>
                        <select
                            name="tipoMembresiaId"
                            value={formData.tipoMembresiaId}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium text-slate-700"
                            required
                        >
                            <option value="">-- Seleccionar Plan --</option>
                            {planes.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.nombre} — ${plan.costo} (Membresía Mensual)
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500">
                            * Al guardar, se creará el socio y se registrará automáticamente esta membresía por 30 días.
                        </p>
                    </div>
                </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose} 
            type="button"
            className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="socio-form"
            disabled={loading}
            className={`flex-1 py-2.5 text-white font-bold rounded-xl transition-all shadow-md flex justify-center items-center gap-2 ${
                socioToEdit 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-50`}
          >
            {loading ? "Guardando..." : <><Save size={20} /> {socioToEdit ? "Actualizar Datos" : "Crear Socio"}</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SocioForm;