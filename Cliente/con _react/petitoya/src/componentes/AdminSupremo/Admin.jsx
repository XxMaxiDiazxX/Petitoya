import AñadirProducto from "./AñadirProducto";
import { ListaProductos } from "./ListaPordutctos";


const Admin = () => {
  // Contenido del componente AdminPanel
  return (
    <div>
      {/* Contenido del panel de administrador */}
      <h2 className="text-center">Panel de Administrador</h2>
      <AñadirProducto />
      <ListaProductos />

      {/* ... otros elementos del panel de administrador */}
    </div>
  );
};

export default Admin;
