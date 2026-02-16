import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido Dinámico (aquí se renderizarán las páginas) */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;