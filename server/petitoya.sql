-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 25-07-2024 a las 03:38:38
-- Versión del servidor: 8.0.31
-- Versión de PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


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
CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearUsuario` (IN `p_id_cliente` VARCHAR(20), IN `p_nombre` VARCHAR(50), IN `p_correo_electronico` VARCHAR(255), IN `p_telefono` VARCHAR(15), IN `p_contrasena` VARCHAR(255), IN `p_id_rol` INT)   BEGIN
    INSERT INTO clientes (
        id_cliente,
        nombre,
        correo_electronico,
        telefono,
        contrasena,
        id_rol
    )
    VALUES (
        p_id_cliente,
        p_nombre,
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarUsuario` (IN `p_id_cliente` VARCHAR(20), IN `p_nombre` VARCHAR(50), IN `p_correo_electronico` VARCHAR(255), IN `p_telefono` VARCHAR(15), IN `p_id_rol` INT)   BEGIN
    UPDATE clientes
    SET
        nombre = p_nombre,
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
  `id_cliente` varchar(20) NOT NULL,
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
  `id_cliente` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(10) NOT NULL DEFAULT 'activo',
  `id_rol` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_cliente`),
  KEY `id_rol` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `correo_electronico`, `telefono`, `contrasena`, `fecha_creacion`, `estado`, `id_rol`) VALUES
('1025884474', 'karen', '1@gmail.com', '321414565656', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-08 23:29:14', 'activo', 3),
('1025884475', 'Juan', 'asdasdasda@gmail.com', '123', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-08 22:39:09', 'activo', 2),
('3', 'sebas', '1@gmail.com', '123', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-24 23:02:26', 'activo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_cambios`
--

DROP TABLE IF EXISTS `historial_cambios`;
CREATE TABLE IF NOT EXISTS `historial_cambios` (
  `id_cambio` int NOT NULL AUTO_INCREMENT,
  `id_cliente` varchar(20) NOT NULL,
  `cambio` varchar(255) NOT NULL,
  `fecha_cambio` datetime DEFAULT NULL,
  `realizado_por` varchar(20) NOT NULL,
  PRIMARY KEY (`id_cambio`),
  KEY `id_cliente` (`id_cliente`),
  KEY `realizado_por` (`realizado_por`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `informe_pedidos_auditoria`
--

DROP TABLE IF EXISTS `informe_pedidos_auditoria`;
CREATE TABLE IF NOT EXISTS `informe_pedidos_auditoria` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int DEFAULT NULL,
  `cliente` varchar(255) DEFAULT NULL,
  `correo_electronico` varchar(255) DEFAULT NULL,
  `fecha_compra` datetime DEFAULT NULL,
  `producto` varchar(255) DEFAULT NULL,
  `precio_compra` decimal(10,2) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `total_producto` decimal(10,2) DEFAULT NULL,
  `fecha_informe` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `informe_pedidos_auditoria`
--

INSERT INTO `informe_pedidos_auditoria` (`id_auditoria`, `id_pedido`, `cliente`, `correo_electronico`, `fecha_compra`, `producto`, `precio_compra`, `cantidad`, `total_producto`, `fecha_informe`) VALUES
(1, 12, 'karen', '1@gmail.com', '2024-06-22 20:15:27', 'asd', '99999999.99', 6, '99999999.99', '2024-06-22 20:15:27'),
(2, 12, 'karen', '1@gmail.com', '2024-06-22 20:15:27', 'Gasesa', '40000.00', 2, '80000.00', '2024-06-22 20:15:27'),
(3, 13, 'karen', '1@gmail.com', '2024-06-22 20:16:51', 'asd', '99999999.99', 3, '99999999.99', '2024-06-22 20:16:51'),
(4, 13, 'karen', '1@gmail.com', '2024-06-22 20:16:51', 'Gasesa', '40000.00', 4, '160000.00', '2024-06-22 20:16:51'),
(5, 14, 'karen', '1@gmail.com', '2024-06-22 20:17:41', 'asd', '99999999.99', 1, '99999999.99', '2024-06-22 20:17:41'),
(6, 14, 'karen', '1@gmail.com', '2024-06-22 20:17:41', 'Gasesa', '40000.00', 1, '40000.00', '2024-06-22 20:17:41'),
(7, 15, 'karen', '1@gmail.com', '2024-06-22 20:19:09', 'asd', '99999999.99', 1, '99999999.99', '2024-06-22 20:19:09'),
(8, 15, 'karen', '1@gmail.com', '2024-06-22 20:19:09', 'Gasesa', '40000.00', 1, '40000.00', '2024-06-22 20:19:09'),
(9, 16, 'karen', '1@gmail.com', '2024-06-22 20:20:45', 'asd', '99999999.99', 2, '99999999.99', '2024-06-22 20:20:45'),
(10, 16, 'karen', '1@gmail.com', '2024-06-22 20:20:45', 'Gasesa', '40000.00', 2, '80000.00', '2024-06-22 20:20:45'),
(11, 17, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:05:42', 'Agua Mineral', '2.00', 5, '10.00', '2024-06-24 00:05:42'),
(12, 17, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:05:42', 'Galletas de Avena', '2.00', 3, '6.00', '2024-06-24 00:05:42'),
(13, 17, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:05:42', 'Donut de Vainilla', '2.00', 2, '4.00', '2024-06-24 00:05:42'),
(14, 18, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:05:50', 'Café Espresso', '3.00', 2, '6.00', '2024-06-24 00:05:50'),
(15, 19, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:05:55', 'Capuchino', '3.00', 2, '6.00', '2024-06-24 00:05:55'),
(16, 20, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:05:59', 'Pizza Margherita', '8.00', 3, '24.00', '2024-06-24 00:05:59'),
(17, 21, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:06:03', 'Ensalada César', '5.00', 3, '15.00', '2024-06-24 00:06:03'),
(18, 22, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:06:07', 'Ensalada César', '5.00', 3, '15.00', '2024-06-24 00:06:07'),
(19, 23, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 00:06:14', 'Sándwich de Pollo', '4.00', 2, '8.00', '2024-06-24 00:06:14'),
(20, 24, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 18:01:56', 'mari', '10000.00', 13, '130000.00', '2024-06-24 18:01:56'),
(21, 24, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 18:01:56', 'Café Mocha', '4.00', 11, '44.00', '2024-06-24 18:01:56'),
(22, 24, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 18:01:56', 'Croissant de Mantequilla', '2.00', 14, '28.00', '2024-06-24 18:01:56'),
(23, 25, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 22:50:34', 'mari', '10000.00', 1, '10000.00', '2024-06-24 22:50:34'),
(24, 26, 'Juan', 'asdasdasda@gmail.com', '2024-06-24 22:51:19', 'Capuchino', '3.00', 5, '15.00', '2024-06-24 22:51:19'),
(25, 27, 'sebas', '1@gmail.com', '2024-06-24 23:05:54', 'mari', '10000.00', 3, '30000.00', '2024-06-24 23:05:54'),
(26, 27, 'sebas', '1@gmail.com', '2024-06-24 23:05:54', 'Croissant de Mantequilla', '2.00', 3, '6.00', '2024-06-24 23:05:54'),
(27, 28, 'karen', '1@gmail.com', '2024-06-25 00:30:04', 'mari', '10000.00', 1, '10000.00', '2024-06-25 00:30:04'),
(28, 29, 'karen', '1@gmail.com', '2024-06-25 02:01:07', 'mari', '10000.00', 1, '10000.00', '2024-06-25 02:01:07'),
(29, 30, 'karen', '1@gmail.com', '2024-06-25 02:01:09', 'Café Espresso', '3.00', 1, '3.00', '2024-06-25 02:01:09'),
(30, 31, 'karen', '1@gmail.com', '2024-06-25 02:01:11', 'Croissant de Mantequilla', '2.00', 1, '2.00', '2024-06-25 02:01:11'),
(31, 32, 'karen', '1@gmail.com', '2024-06-25 03:42:20', 'mari', '10000.00', 1, '10000.00', '2024-06-25 03:42:20'),
(32, 32, 'karen', '1@gmail.com', '2024-06-25 03:42:20', 'Croissant de Mantequilla', '2.00', 1, '2.00', '2024-06-25 03:42:20'),
(33, 33, 'karen', '1@gmail.com', '2024-06-25 04:14:37', 'mari', '10000.00', 2, '20000.00', '2024-06-25 04:14:37'),
(34, 34, 'karen', '1@gmail.com', '2024-06-25 04:16:57', 'mari', '10000.00', 1, '10000.00', '2024-06-25 04:16:57'),
(35, 35, 'karen', '1@gmail.com', '2024-06-25 04:17:27', 'mari', '10000.00', 2, '20000.00', '2024-06-25 04:17:27'),
(36, 36, 'sebas', '1@gmail.com', '2024-06-25 04:49:45', 'mari', '10000.00', 2, '20000.00', '2024-06-25 04:49:45'),
(37, 36, 'sebas', '1@gmail.com', '2024-06-25 04:49:45', 'Café Espresso', '3.00', 2, '6.00', '2024-06-25 04:49:45'),
(38, 37, 'sebas', '1@gmail.com', '2024-06-25 22:45:41', 'mari', '10000.00', 1, '10000.00', '2024-06-25 22:45:41'),
(39, 37, 'sebas', '1@gmail.com', '2024-06-25 22:45:41', 'Café Mocha', '4.00', 2, '8.00', '2024-06-25 22:45:41'),
(40, 38, 'sebas', '1@gmail.com', '2024-07-24 21:39:26', 'Donut de Vainilla', '2.00', 1, '2.00', '2024-07-24 21:39:26'),
(41, 38, 'sebas', '1@gmail.com', '2024-07-24 21:39:26', 'WEBONES', '100000.00', 1, '100000.00', '2024-07-24 21:39:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_cliente` varchar(20) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto_total` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id_pedido`),
  KEY `id_cliente` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Disparadores `pedido_producto`
--
DROP TRIGGER IF EXISTS `after_insert_pedido_producto`;
DELIMITER $$
CREATE TRIGGER `after_insert_pedido_producto` AFTER INSERT ON `pedido_producto` FOR EACH ROW BEGIN
    DECLARE v_id_pedido INT;

    -- Obtener el id_pedido de la fila insertada
    SELECT id_pedido INTO v_id_pedido FROM pedidos WHERE id_pedido = NEW.id_pedido;

    -- Insertar en informe_pedidos_auditoria si el pedido existe
    IF v_id_pedido IS NOT NULL THEN
        INSERT INTO informe_pedidos_auditoria (id_pedido, cliente, correo_electronico, fecha_compra, producto, precio_compra, cantidad, total_producto)
        SELECT 
            p.id_pedido,
            c.nombre AS cliente,
            c.correo_electronico,
            p.fecha_compra,
            prod.nombre AS producto,
            NEW.precio_compra,
            NEW.cantidad,
            (NEW.precio_compra * NEW.cantidad) AS total_producto
        FROM pedidos p
        JOIN clientes c ON p.id_cliente = c.id_cliente
        JOIN productos prod ON NEW.id_producto = prod.id_producto
        WHERE p.id_pedido = NEW.id_pedido;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `precio` int NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `categoria` varchar(25) NOT NULL,
  `estado` varchar(25) NOT NULL DEFAULT 'activo',
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=488 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `fecha_creacion`, `categoria`, `estado`, `imagen`) VALUES
(466, 'Café Espressa', 'Café espresso con una intensa crema', 3, NULL, 'Bebida', 'activo', 'uploads/cafe.jpg'),
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
-- Estructura Stand-in para la vista `producto_cantidad_pedidos`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `producto_cantidad_pedidos`;
CREATE TABLE IF NOT EXISTS `producto_cantidad_pedidos` (
`cantidad_pedidos` bigint
,`categoria` varchar(25)
,`descripcion` varchar(255)
,`estado` varchar(25)
,`id_producto` int
,`imagen` varchar(255)
,`nombre` varchar(255)
,`precio` int
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'Usuario'),
(2, 'Administrador'),
(3, 'Superusuario');

-- --------------------------------------------------------
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
-- Filtros para la tabla `historial_cambios`
--
ALTER TABLE `historial_cambios`
  ADD CONSTRAINT `historial_cambios_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `historial_cambios_ibfk_2` FOREIGN KEY (`realizado_por`) REFERENCES `clientes` (`id_cliente`);

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
