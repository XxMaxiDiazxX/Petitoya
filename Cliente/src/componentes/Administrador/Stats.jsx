import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const apiUrl = import.meta.env.VITE_API_URL;

export const EstadisticasVentas = () => {
  const [productosMasComprados, setProductosMasComprados] = useState([]);
  const [productosMenosComprados, setProductosMenosComprados] = useState([]);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [ventasSemanales, setVentasSemanales] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [masCompradosRes, menosCompradosRes, diariasRes, semanalesRes, mensualesRes] = await Promise.all([
          axios.get(`${apiUrl}/stats/mascomprados`),
          axios.get(`${apiUrl}/stats/menoscomprados`),
          axios.get(`${apiUrl}/stats/diarias`),
          axios.get(`${apiUrl}/stats/semanales`),
          axios.get(`${apiUrl}/stats/mensuales`)
        ]);

        setProductosMasComprados(masCompradosRes.data);
        setProductosMenosComprados(menosCompradosRes.data);
        setVentasDiarias(diariasRes.data);
        setVentasSemanales(semanalesRes.data);
        setVentasMensuales(mensualesRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h2>Estadísticas de Ventas</h2>

      <div className="row">
        <div className="col-md-6">
          <h3>Productos Más Comprados</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={productosMasComprados}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_cantidad" name="Cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h3>Productos Menos Comprados</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={productosMenosComprados}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_cantidad" name="Cantidad" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <h3>Ventas Diarias</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={ventasDiarias}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_ventas" name="Ventas" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-4">
          <h3>Ventas Semanales</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={ventasSemanales}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_ventas" name="Ventas" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-4">
          <h3>Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={ventasMensuales}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_ventas" name="Ventas" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasVentas;
