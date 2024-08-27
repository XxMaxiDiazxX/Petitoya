const socketIo = require("socket.io");

let io;

const setupSocketIo = (server) => {
  io = socketIo(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    // Maneja la unión a una sala específica basada en el ID del usuario
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`Cliente ${socket.id} se unió a la sala ${userId}`);
    });

    // Enviar notificación a una sala específica
    socket.on("pedidoStatusChanged", (pedido) => {
      const userId = pedido.id_cliente;
      const message = `El estado de tu pedido ha cambiado a ${pedido.estado}`;
      io.to(userId).emit("notificacion", { mensaje: message });
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO no está inicializado. Asegúrate de llamar a setupSocketIo.");
  }
  return io;
};

module.exports = {
  setupSocketIo,
  getIo
};
