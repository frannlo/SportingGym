import { Link, useLocation } from "react-router-dom";
import { Users, CreditCard, Ticket, LayoutDashboard, Dumbbell } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard },
    { path: "/socios", name: "Socios", icon: Users },
    { path: "/membresias", name: "Membresías", icon: Ticket },
    { path: "/pagos", name: "Pagos", icon: CreditCard },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl fixed left-0 top-0">
      {/* Logo / Título */}
      <div className="p-6 flex items-center gap-2 border-b border-slate-700">
        <Dumbbell className="text-blue-500 w-8 h-8" />
        <h1 className="text-xl font-bold tracking-wider">SportingGym</h1>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
        © 2026 SportingGym System
      </div>
    </div>
  );
};

export default Sidebar;