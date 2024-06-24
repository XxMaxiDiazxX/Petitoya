const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes)


// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Corriendo en el puerto ${PORT}`);
});
