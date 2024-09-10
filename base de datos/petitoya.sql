-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 09-09-2024 a las 23:59:20
-- Versión del servidor: 8.0.31
-- Versión de PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '12345'; 


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `petitoya`
--
CREATE DATABASE IF NOT EXISTS `petitoya` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `petitoya`;

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `AgregarProductoAPedido`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AgregarProductoAPedido` (IN `p_id_pedido` INT, IN `p_id_producto` INT, IN `p_precio_compra` INT, IN `p_cantidad` INT)   BEGIN
    INSERT INTO pedido_producto (id_pedido, id_producto, precio_compra, cantidad)
    VALUES (
        p_id_pedido,
        p_id_producto,
        p_precio_compra,
        p_cantidad
    );
END$$

DROP PROCEDURE IF EXISTS `AutenticarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AutenticarUsuario` (IN `p_id_cliente` VARCHAR(20), OUT `p_contrasena` VARCHAR(255), OUT `p_nombre` VARCHAR(50), OUT `p_id_rol` INT)   BEGIN
    SELECT contrasena, nombre, id_rol
    INTO p_contrasena, p_nombre, p_id_rol
    FROM clientes
    WHERE id_cliente = p_id_cliente;
END$$

DROP PROCEDURE IF EXISTS `CambiarContrasena`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CambiarContrasena` (IN `p_id_cliente` VARCHAR(20), IN `p_nueva_contrasena` VARCHAR(255))   BEGIN
    DECLARE v_contrasena_actual VARCHAR(255);

    -- Obtener la contraseña actual
    SELECT contrasena INTO v_contrasena_actual
    FROM clientes
    WHERE id_cliente = p_id_cliente;

    -- Verificar que la nueva contraseña no sea igual a la actual
    IF v_contrasena_actual = p_nueva_contrasena THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La nueva contraseña no puede ser igual a la contraseña actual';
    ELSE
        -- Actualizar la contraseña del cliente
        UPDATE clientes
        SET contrasena = p_nueva_contrasena
        WHERE id_cliente = p_id_cliente;
    END IF;
END$$

DROP PROCEDURE IF EXISTS `CrearPedido`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearPedido` (IN `p_id_cliente` VARCHAR(20), IN `p_estado` VARCHAR(20))   BEGIN
    INSERT INTO pedidos (id_cliente, estado)
    VALUES (p_id_cliente, p_estado);
END$$

DROP PROCEDURE IF EXISTS `CrearProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearProducto` (IN `p_id_producto` VARCHAR(20), IN `p_nombre` VARCHAR(50), IN `p_descripcion` TEXT, IN `p_precio` DECIMAL(10,2), IN `p_categoria` VARCHAR(50), IN `p_imagen` LONGBLOB)   BEGIN
    INSERT INTO productos (id_producto, nombre, descripcion, precio, fecha_creacion, categoria, imagen)
    VALUES (p_id_producto, p_nombre, p_descripcion, p_precio, NOW(), p_categoria, p_imagen);
END$$

DROP PROCEDURE IF EXISTS `CrearUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearUsuario` (IN `p_id_cliente` VARCHAR(20), IN `p_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50), IN `p_correo_electronico` VARCHAR(255), IN `p_telefono` VARCHAR(15), IN `p_contrasena` VARCHAR(255), IN `p_id_rol` INT)   BEGIN
    INSERT INTO clientes (
        id_cliente,
        nombre,
        apellido,
        correo_electronico,
        telefono,
        contrasena,
        id_rol
    )
    VALUES (
        p_id_cliente,
        p_nombre,
        p_apellido,
        p_correo_electronico,
        p_telefono,
        p_contrasena,
        p_id_rol
    );
END$$

DROP PROCEDURE IF EXISTS `DesactivarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DesactivarProducto` (IN `p_id_producto` VARCHAR(20))   BEGIN
    UPDATE productos
    SET estado = 'inactivo'
    WHERE id_producto = p_id_producto;
END$$

DROP PROCEDURE IF EXISTS `GenerarInformeUsuarios`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerarInformeUsuarios` ()   BEGIN
    SELECT
        id_cliente,
        nombre,
        correo_electronico,
        telefono,
        fecha_creacion,
        estado,
        id_rol
    FROM clientes;
END$$

DROP PROCEDURE IF EXISTS `HabilitarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `HabilitarProducto` (IN `p_id_producto` VARCHAR(20))   BEGIN
    UPDATE productos
    SET estado = 'activo'
    WHERE id_producto = p_id_producto;
END$$

DROP PROCEDURE IF EXISTS `HabilitarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `HabilitarUsuario` (IN `p_id_cliente` VARCHAR(20))   BEGIN
    UPDATE clientes
    SET estado = 'activo'
    WHERE id_cliente = p_id_cliente;
END$$

DROP PROCEDURE IF EXISTS `InhabilitarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `InhabilitarUsuario` (IN `p_id_cliente` VARCHAR(20))   BEGIN
    UPDATE clientes
    SET estado = 'inactivo'
    WHERE id_cliente = p_id_cliente;
END$$

DROP PROCEDURE IF EXISTS `ModificarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarProducto` (IN `p_id_producto` INT, IN `p_nombre` VARCHAR(255), IN `p_descripcion` TEXT, IN `p_precio` DECIMAL(10,2), IN `p_categoria` VARCHAR(255), IN `p_imagen` VARCHAR(255))   BEGIN
    UPDATE productos
    SET 
        nombre = p_nombre,
        descripcion = p_descripcion,
        precio = p_precio,
        categoria = p_categoria,
        imagen = COALESCE(p_imagen, imagen) -- Solo actualiza si se proporciona nueva imagen
    WHERE 
        id_producto = p_id_producto;
END$$

DROP PROCEDURE IF EXISTS `ModificarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarUsuario` (IN `p_id_cliente` VARCHAR(20), IN `p_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50), IN `p_correo_electronico` VARCHAR(255), IN `p_telefono` VARCHAR(15))   BEGIN
    UPDATE clientes
    SET
        nombre = p_nombre,
        apellido = p_apellido,
        correo_electronico = p_correo_electronico,
        telefono = p_telefono
    WHERE
        id_cliente = p_id_cliente;
END$$

DROP PROCEDURE IF EXISTS `ObtenerProductosMenosUsados`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerProductosMenosUsados` ()   BEGIN
    SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.categoria,
        p.estado,
        COUNT(pp.id_producto) AS cantidad_pedidos
    FROM 
        productos p
    LEFT JOIN 
        pedido_producto pp ON p.id_producto = pp.id_producto
    GROUP BY 
        p.id_producto, p.nombre, p.descripcion, p.precio, p.categoria, p.estado
    ORDER BY 
        cantidad_pedidos ASC;
END$$

DROP PROCEDURE IF EXISTS `RealizarPedidoDesdeCarrito`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `RealizarPedidoDesdeCarrito` (IN `p_id_cliente` VARCHAR(20), OUT `p_id_pedido` INT, OUT `p_message` VARCHAR(255))   BEGIN
    DECLARE v_count INT;
    DECLARE total_pedido DECIMAL(10, 2);

    -- Verificar si hay elementos en el carrito para el cliente dado
    SELECT COUNT(*) INTO v_count
    FROM carrito
    WHERE id_cliente = p_id_cliente;

    IF v_count = 0 THEN
        SET p_message = 'El carrito está vacío';
    ELSE
        -- Crear un nuevo pedido
        INSERT INTO pedidos (id_cliente, estado, fecha_compra)
        VALUES (p_id_cliente, 'pendiente', NOW());

        SET p_id_pedido = LAST_INSERT_ID();

        -- Insertar productos del carrito en pedido_producto
        INSERT INTO pedido_producto (id_pedido, id_producto, precio_compra, cantidad)
        SELECT
            p_id_pedido,
            c.id_producto,
            p.precio,
            c.cantidad
        FROM carrito c
        JOIN productos p ON c.id_producto = p.id_producto
        WHERE c.id_cliente = p_id_cliente;

        -- Calcular el monto total del pedido
        SELECT SUM(pp.precio_compra * pp.cantidad) INTO total_pedido
        FROM pedido_producto pp
        WHERE pp.id_pedido = p_id_pedido;

        -- Actualizar monto_total en la tabla pedidos
        UPDATE pedidos
        SET monto_total = total_pedido
        WHERE id_pedido = p_id_pedido;

        -- Vaciar el carrito
        DELETE FROM carrito WHERE id_cliente = p_id_cliente;

        SET p_message = 'Pedido realizado con éxito';
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

DROP TABLE IF EXISTS `carrito`;
CREATE TABLE IF NOT EXISTS `carrito` (
  `id_cliente` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_cliente`,`id_producto`),
  KEY `id_producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE IF NOT EXISTS `clientes` (
  `id_cliente` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `correo_electronico` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'activo',
  `id_rol` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_cliente`),
  KEY `id_rol` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `correo_electronico`, `telefono`, `contrasena`, `fecha_creacion`, `estado`, `id_rol`) VALUES
('-1111', 'Johan', 'Velez', 'johansebastianvelezortiz@gmail.com', '321414007813', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-09-09 04:00:05', 'activo', 1),
('1025884470', 'asd', 'Velez', '12@gmail.com', '32141400781', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-09-09 03:51:54', 'activo', 1),
('1025884474', 'karen', 'velez', '1@gmail.com', '321414565656', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-08 23:29:14', 'activo', 3),
('1025884475', 'Juan', 'Suarez', 'asdasdasda@gmail.com', '1233', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-08 22:39:09', 'activo', 2),
('103812832411', 'asd', 'Velez', '112@gmail.com', '32141410789', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-09-09 04:03:39', 'activo', 3),
('103812832423', 'Johan', 'adsadasd', '1231@gmail.com', '123221', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-09-09 04:00:47', 'activo', 2),
('3', 'sebasas', 'Gonzales', '1@gmail.com', '123', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-24 23:02:26', 'activo', 1),
('4', 'Mari', 'Perez', '5@gmail.com', '3214141078', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-09-03 21:10:26', 'activo', 1),
('413', 'Johan', 'Velez', '1@gmail.com31', '1234324', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-09-09 03:58:49', 'activo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_cliente` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto_total` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id_pedido`),
  KEY `id_cliente` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_cliente`, `estado`, `fecha_compra`, `monto_total`, `modo_pago`) VALUES
(39, '3', 'por entrega', '2024-08-29 22:30:47', '3.00', ''),
(40, '3', 'entregado', '2024-09-02 22:42:40', '5.00', ''),
(41, '3', 'pendiente', '2024-09-09 01:52:32', '3.00', ''),
(42, '3', 'pendiente', '2024-09-09 01:56:55', '6.00', ''),
(43, '3', 'pendiente', '2024-09-09 01:59:43', '3.00', ''),
(44, '3', 'pendiente', '2024-09-09 02:02:15', '4.00', ''),
(45, '3', 'pendiente', '2024-09-09 02:02:47', '4.00', ''),
(46, '3', 'pendiente', '2024-09-09 02:27:48', '11.00', ''),
(47, '3', 'pendiente', '2024-09-09 03:16:51', '42.00', ''),
(48, '3', 'pendiente', '2024-09-09 03:17:40', '5.00', ''),
(49, '3', 'pendiente', '2024-09-09 03:17:59', '6.00', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_producto`
--

DROP TABLE IF EXISTS `pedido_producto`;
CREATE TABLE IF NOT EXISTS `pedido_producto` (
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `precio_compra` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_pedido`,`id_producto`),
  KEY `id_producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido_producto`
--

INSERT INTO `pedido_producto` (`id_pedido`, `id_producto`, `precio_compra`, `cantidad`) VALUES
(39, 471, 3, 1),
(40, 474, 3, 1),
(40, 475, 2, 1),
(41, 471, 3, 1),
(42, 471, 3, 2),
(43, 471, 3, 1),
(44, 466, 4, 1),
(45, 466, 4, 1),
(46, 466, 4, 2),
(46, 471, 3, 1),
(47, 466, 4, 3),
(47, 471, 3, 3),
(47, 474, 3, 1),
(47, 476, 2, 2),
(47, 480, 7, 2),
(48, 470, 3, 1),
(48, 476, 2, 1),
(49, 471, 3, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `precio` int NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `categoria` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'activo',
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=488 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `fecha_creacion`, `categoria`, `estado`, `imagen`) VALUES
(466, 'Café Espressa', 'Café espresso con una intensa crem', 4, NULL, 'Bebida', 'activo', 'uploads/cafe.jpg'),
(467, 'Café American', 'Café americano suave y equilibrado', 2, NULL, 'Bebida', 'inactivo', NULL),
(468, 'Café Latte', 'Café latte con espuma de leche cremosa', 3, NULL, 'Bebida', 'inactivo', NULL),
(469, 'Café Mocha', 'Café mocha con chocolate y crema batida', 4, NULL, 'Bebida', 'inactivo', NULL),
(470, 'Capuchino', 'Capuchino con una perfecta mezcla de café y leche', 3, NULL, 'Bebida', 'activo', 'uploads/capu.jpg'),
(471, 'Té Verde', 'Té verde japonés caliente', 3, NULL, 'Comida', 'activo', 'uploads\\te.jpg'),
(472, 'Té Negro', 'Té negro aromático y robusto', 2, NULL, 'Bebida', 'inactivo', NULL),
(473, 'Jugo de Naranja Natural', 'Jugo de naranja fresco recién exprimido', 4, NULL, 'Bebida', 'activo', 'uploads\\jug.jpg'),
(474, 'Limonada', 'Refrescante limonada con hielo', 3, NULL, 'Bebida', 'activo', 'uploads\\lim.jpg'),
(475, 'Agua Mineral', 'Agua mineral natural', 2, NULL, 'Bebida', 'activo', 'uploads\\agu.jpg'),
(476, 'Croissant de Mantequilla', 'Croissant de hojaldre con mantequilla', 2, NULL, 'Comida', 'activo', 'uploads\\caisa.jpg'),
(477, 'Sándwich de Pollo', 'Sándwich con filete de pollo y vegetales frescos', 4, NULL, 'Comida', 'activo', 'uploads\\san.jpg'),
(478, 'Ensalada César', 'Ensalada con pollo a la parrilla, lechuga romana y aderezo césar', 5, NULL, 'Comida', 'activo', 'uploads\\ensa.jpg'),
(479, 'Pizza Margherita', 'Pizza tradicional italiana con salsa de tomate, mozzarella y albahaca', 8, NULL, 'Comida', 'activo', 'uploads\\piz.jpg'),
(480, 'Hamburguesa Clásica', 'Hamburguesa de carne con queso cheddar y salsa especial', 7, NULL, 'Comida', 'activo', 'uploads\\ham.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'Usuario'),
(2, 'Administrador'),
(3, 'Superusuario');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`);

--
-- Filtros para la tabla `pedido_producto`
--
ALTER TABLE `pedido_producto`
  ADD CONSTRAINT `pedido_producto_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `pedido_producto_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
