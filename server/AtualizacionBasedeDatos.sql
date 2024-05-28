CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'Usuario'),
(2, 'Administrador'),
(3, 'Superusuario');



CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(10) NOT NULL DEFAULT 'activo',
  `id_rol` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_cliente`),
  FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pedido`),
  FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `precio` int(11) NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `categoria` varchar(25) NOT NULL,
  `estado` varchar(25) NOT NULL DEFAULT 'activo',
  `imagen` longblob DEFAULT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `pedido_producto` (
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `precio_compra` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  PRIMARY KEY (`id_pedido`, `id_producto`),
  FOREIGN KEY (`id_pedido`) REFERENCES `pedidos`(`id_pedido`),
  FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* //este es opcional no sé*/

CREATE TABLE `historial_cambios` (
  `id_cambio` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `cambio` varchar(255) NOT NULL,
  `fecha_cambio` datetime DEFAULT NULL,
  `realizado_por` int(11) NOT NULL, -- ID del usuario que realizó el cambio
  PRIMARY KEY (`id_cambio`),
  FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`),
  FOREIGN KEY (`realizado_por`) REFERENCES `clientes`(`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;






/* PROCEDIMIENTOS ALMACENADOS */


CREATE PROCEDURE CrearUsuario(
    IN p_id_cliente INT,
    IN p_nombre VARCHAR(50),
    IN p_correo_electronico VARCHAR(255),
    IN p_telefono VARCHAR(15),
    IN p_contrasena VARCHAR(255),
    IN p_id_rol INT
)
BEGIN
    INSERT INTO clientes (id_cliente, nombre, correo_electronico, telefono, contrasena, id_rol)
    VALUES (p_id_cliente, p_nombre, p_correo_electronico, p_telefono, p_contrasena, p_id_rol);
END;



CREATE PROCEDURE ModificarUsuario(
    IN p_id_cliente INT,
    IN p_nombre VARCHAR(50),
    IN p_correo_electronico VARCHAR(255),
    IN p_telefono VARCHAR(15),
    IN p_id_rol INT
)
BEGIN
    UPDATE clientes
    SET nombre = p_nombre, correo_electronico = p_correo_electronico, telefono = p_telefono, id_rol = p_id_rol
    WHERE id_cliente = p_id_cliente;
END;



CREATE PROCEDURE InhabilitarUsuario(
    IN p_id_cliente INT
)
BEGIN
    UPDATE clientes
    SET estado = 'inactivo'
    WHERE id_cliente = p_id_cliente;
END;


CREATE PROCEDURE GenerarInformeUsuarios()
BEGIN
    SELECT id_cliente, nombre, correo_electronico, telefono, fecha_creacion, estado, id_rol
    FROM clientes;
END;


CREATE PROCEDURE CrearPedido(
    IN p_id_cliente INT,
    IN p_estado VARCHAR(20)
)
BEGIN
    INSERT INTO pedidos (id_cliente, estado)
    VALUES (p_id_cliente, p_estado);
END;


CREATE PROCEDURE AgregarProductoAPedido(
    IN p_id_pedido INT,
    IN p_id_producto INT,
    IN p_precio_compra INT,
    IN p_cantidad INT
)
BEGIN
    INSERT INTO pedido_producto (id_pedido, id_producto, precio_compra, cantidad)
    VALUES (p_id_pedido, p_id_producto, p_precio_compra, p_cantidad);
END;



CREATE PROCEDURE GenerarInformePedido(
    IN p_id_pedido INT
)
BEGIN
    SELECT 
        p.id_pedido,
        c.nombre AS cliente,
        c.correo_electronico,
        ped.fecha_compra,
        prod.nombre AS producto,
        pp.precio_compra,
        pp.cantidad,
        (pp.precio_compra * pp.cantidad) AS total_producto
    FROM pedidos p
    JOIN clientes c ON p.id_cliente = c.id_cliente
    JOIN pedido_producto pp ON p.id_pedido = pp.id_pedido
    JOIN productos prod ON pp.id_producto = prod.id_producto
    WHERE p.id_pedido = p_id_pedido;
END;
