import Sidebar from "./Sidebar"; 

const Layout = ({ children }) => {
  return (
    // Agregamos print:bg-white para no imprimir el fondo gris
    <div className="min-h-screen bg-[#C1C2CF] print:bg-white font-sans text-slate-900">
      
      {/* print:hidden oculta el menú al imprimir */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* print:ml-0 quita el margen del sidebar en la hoja de papel */}
      <main className="ml-64 print:ml-0 p-4 md:p-8 print:p-0">
        {children}
      </main>

    </div>
  );
};

export default Layout;