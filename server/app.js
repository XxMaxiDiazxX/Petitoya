const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();




const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const statsRoutes = require('./routes/statsRoutes');
const superUsRouter = require('./routes/superUsRoutes');


// Middlewares
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());


// Rutas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/stats', statsRoutes);
app.use('/super', superUsRouter);


// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Corriendo en el puerto ${PORT}`);
});
