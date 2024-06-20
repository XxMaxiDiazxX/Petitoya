-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 19-06-2024 a las 19:09:31
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarProducto` (IN `p_id_producto` VARCHAR(20), IN `p_nombre` VARCHAR(50), IN `p_descripcion` TEXT, IN `p_precio` DECIMAL(10,2), IN `p_categoria` VARCHAR(50))   BEGIN
    UPDATE productos
    SET nombre = p_nombre, descripcion = p_descripcion, precio = p_precio, categoria = p_categoria
    WHERE id_producto = p_id_producto;
END$$

DROP PROCEDURE IF EXISTS `ModificarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarUsuario` (IN `p_id_cliente` VARCHAR(20), IN `p_nombre` VARCHAR(50), IN `p_correo_electronico` VARCHAR(255), IN `p_telefono` VARCHAR(15), IN `p_id_rol` INT)   BEGIN
    UPDATE clientes
    SET
        nombre = p_nombre,
        correo_electronico = p_correo_electronico,
        telefono = p_telefono,
        id_rol = p_id_rol
    WHERE
        id_cliente = p_id_cliente;
END$$

DELIMITER ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `correo_electronico`, `telefono`, `contrasena`, `fecha_creacion`, `estado`, `id_rol`) VALUES
('1025884474', 'Johan', 'johansebastianvelezortiz@gmail.com', '3214140078', 'asesinonZ@2', '2024-06-08 22:36:25', 'activo', 1),
('1025884475', 'Juan', 'asdasdasda@gmail.com', '123', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-08 22:39:09', 'activo', 2),
('1038128324', 'karen', '1@gmail.com', '321414565656', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-08 23:29:14', 'activo', 3);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  PRIMARY KEY (`id_pedido`),
  KEY `id_cliente` (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Disparadores `pedido_producto`
--
DROP TRIGGER IF EXISTS `after_insert_pedido_producto`;
DELIMITER $$
CREATE TRIGGER `after_insert_pedido_producto` AFTER INSERT ON `pedido_producto` FOR EACH ROW BEGIN
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
  `imagen` longblob,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
