const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Corriendo en el puerto ${PORT}`);
});
