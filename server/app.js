const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Requerimos http para crear un servidor HTTP
const socketIo = require('socket.io'); // Importamos Socket.IO

const app = express();

// Crear un servidor HTTP utilizando la instancia de Express
const server = http.createServer(app);

// Inicializar Socket.IO con el servidor HTTP
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Middlewares
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const statsRoutes = require('./routes/statsRoutes');
const superUsRouter = require('./routes/superUsRoutes');

// Configurar las rutas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/stats', statsRoutes);
app.use('/super', superUsRouter);

// Configurar eventos de Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar el servidor
const PORT = 3001;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => { // Cambiamos 'app.listen' por 'server.listen'
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Servidor corriendo en el host ${HOST}`);
});
