const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const statsRoutes = require("./routes/statsRoutes");
const superUsRouter = require("./routes/superUsRoutes");
const adminRouter = require("./routes/adminRoutes")
const { setupSocketIo } = require("./utils/socket");

const app = express();
const server = http.createServer(app);
setupSocketIo(server);

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/stats", statsRoutes);
app.use("/super", superUsRouter);
app.use("/admin", adminRouter);

// Iniciar el servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});