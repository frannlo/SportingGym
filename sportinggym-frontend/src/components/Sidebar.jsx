import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, Ticket, Dumbbell } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  // Definimos las rutas y sus iconos aquí para que sea fácil agregar más
  const menuItems = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard },
    { path: "/socios", name: "Socios", icon: Users },
    { path: "/membresias", name: "Membresías", icon: Ticket },
    { path: "/pagos", name: "Pagos", icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shadow-sm fixed left-0 top-0 z-10">
      {/* Header del Sidebar */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Dumbbell size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">SportingGym</h1>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon 
                size={20} 
                className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} 
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer simple */}
      <div className="p-4 border-t border-slate-100">
        <div className="text-xs text-slate-400 text-center">
          v1.0.0 - Panel Admin
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;