-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-09-2024 a las 19:31:00
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

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
CREATE DEFINER=`root`@`localhost` PROCEDURE `AgregarProductoAPedido` (IN `p_id_pedido` INT, IN `p_id_producto` INT, IN `p_precio_compra` INT, IN `p_cantidad` INT)   BEGIN
    INSERT INTO pedido_producto (id_pedido, id_producto, precio_compra, cantidad)
    VALUES (
        p_id_pedido,
        p_id_producto,
        p_precio_compra,
        p_cantidad
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AutenticarUsuario` (IN `p_id_cliente` VARCHAR(20), OUT `p_contrasena` VARCHAR(255), OUT `p_nombre` VARCHAR(50), OUT `p_id_rol` INT)   BEGIN
    SELECT contrasena, nombre, id_rol
    INTO p_contrasena, p_nombre, p_id_rol
    FROM clientes
    WHERE id_cliente = p_id_cliente;
END$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearPedido` (IN `p_id_cliente` VARCHAR(20), IN `p_estado` VARCHAR(20))   BEGIN
    INSERT INTO pedidos (id_cliente, estado)
    VALUES (p_id_cliente, p_estado);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearProducto` (IN `p_id_producto` VARCHAR(20), IN `p_nombre` VARCHAR(50), IN `p_descripcion` TEXT, IN `p_precio` DECIMAL(10,2), IN `p_categoria` VARCHAR(50), IN `p_imagen` LONGBLOB)   BEGIN
    INSERT INTO productos (id_producto, nombre, descripcion, precio, fecha_creacion, categoria, imagen)
    VALUES (p_id_producto, p_nombre, p_descripcion, p_precio, NOW(), p_categoria, p_imagen);
END$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `DesactivarProducto` (IN `p_id_producto` VARCHAR(20))   BEGIN
    UPDATE productos
    SET estado = 'inactivo'
    WHERE id_producto = p_id_producto;
END$$

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `HabilitarProducto` (IN `p_id_producto` VARCHAR(20))   BEGIN
    UPDATE productos
    SET estado = 'activo'
    WHERE id_producto = p_id_producto;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `HabilitarUsuario` (IN `p_id_cliente` VARCHAR(20))   BEGIN
    UPDATE clientes
    SET estado = 'activo'
    WHERE id_cliente = p_id_cliente;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InhabilitarUsuario` (IN `p_id_cliente` VARCHAR(20))   BEGIN
    UPDATE clientes
    SET estado = 'inactivo'
    WHERE id_cliente = p_id_cliente;
END$$

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

CREATE TABLE `carrito` (
  `id_cliente` varchar(20) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_cliente`, `id_producto`, `cantidad`) VALUES
('1025884474', 474, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `estado` varchar(10) NOT NULL DEFAULT 'activo',
  `id_rol` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `correo_electronico`, `telefono`, `contrasena`, `fecha_creacion`, `estado`, `id_rol`) VALUES
('1', 'puto', '', '1@gmail.com', '321414565656', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-08 23:29:14', 'activo', 2),
('1025884474', 'karen', '', '1@gmail.com', '321414565656', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-08 23:29:14', 'activo', 3),
('1025884476', 'joahn', '', 'johane@gmail.com', '3214140079', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-09-03 12:45:00', 'activo', 1),
('1025884479', 'joahn', '', 'johandsa@gmail.com', '3214140071', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-09-03 12:47:50', 'activo', 1),
('3', 'sebas', '', '1@gmail.com', '123', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-06-24 23:02:26', 'activo', 1),
('5', 'joahn', '', 'johan@gmail.com', '3214140078', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-08-28 13:46:53', 'activo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_cliente` varchar(20) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_compra` datetime DEFAULT current_timestamp(),
  `monto_total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_cliente`, `estado`, `fecha_compra`, `monto_total`) VALUES
(39, '3', 'entregado', '2024-08-28 13:34:21', '3.00'),
(40, '3', 'entregado', '2024-08-29 12:59:15', '3.00'),
(41, '3', 'entregado', '2024-08-29 13:10:58', '3.00'),
(42, '3', 'entregado', '2024-08-29 13:16:24', '3.00'),
(43, '3', 'entregado', '2024-08-29 13:19:05', '3.00'),
(44, '3', 'entregado', '2024-08-29 13:23:29', '3.00'),
(45, '3', 'entregado', '2024-08-29 13:23:31', '4.00'),
(46, '3', 'entregado', '2024-08-29 13:23:31', '3.00'),
(47, '3', 'entregado', '2024-08-29 13:33:57', '3.00'),
(48, '3', 'entregado', '2024-08-29 13:39:13', '3.00'),
(49, '3', 'entregado', '2024-08-29 13:42:17', '2.00'),
(50, '3', 'entregado', '2024-08-29 13:44:58', '3.00'),
(51, '1025884474', 'entregado', '2024-08-29 13:50:54', '4.00'),
(52, '3', 'entregado', '2024-08-29 14:23:29', '11.00'),
(53, '3', 'entregado', '2024-08-29 14:35:04', '3.00'),
(54, '3', 'por entrega', '2024-08-29 15:33:22', '3.00'),
(55, '3', 'entregado', '2024-09-03 12:15:15', '4.00'),
(56, '3', 'entregado', '2024-09-03 15:43:45', '2.00'),
(57, '1025884474', 'por entrega', '2024-09-03 15:50:55', '16.00'),
(58, '1025884474', 'entregado', '2024-09-03 15:51:38', '4.00'),
(59, '1025884474', 'por entrega', '2024-09-03 15:53:07', '2.00'),
(60, '1025884474', 'por entrega', '2024-09-03 15:53:27', '3.00'),
(61, '1025884474', 'por entrega', '2024-09-03 15:53:32', '3.00'),
(62, '1025884474', 'por entrega', '2024-09-03 15:53:56', '8072.00'),
(63, '1025884474', 'por entrega', '2024-09-03 15:54:12', '4000.00'),
(64, '1025884474', 'por entrega', '2024-09-03 15:54:17', '400000.00'),
(65, '3', 'en proceso', '2024-09-03 16:08:36', '3546.00'),
(66, '3', 'en proceso', '2024-09-03 16:08:39', '3.00'),
(67, '3', 'en proceso', '2024-09-03 16:09:13', '4.00'),
(68, '3', 'en proceso', '2024-09-03 16:09:31', '11.00'),
(69, '3', 'pendiente', '2024-09-03 16:09:34', '4.00'),
(70, '3', 'pendiente', '2024-09-03 16:09:38', '2.00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_producto`
--

CREATE TABLE `pedido_producto` (
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `precio_compra` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pedido_producto`
--

INSERT INTO `pedido_producto` (`id_pedido`, `id_producto`, `precio_compra`, `cantidad`) VALUES
(39, 471, 3, 1),
(40, 470, 3, 1),
(41, 470, 3, 1),
(42, 471, 3, 1),
(43, 466, 3, 1),
(44, 470, 3, 1),
(45, 473, 4, 1),
(46, 474, 3, 1),
(47, 466, 3, 1),
(48, 470, 3, 1),
(49, 476, 2, 1),
(50, 466, 3, 1),
(51, 477, 4, 1),
(52, 470, 3, 1),
(52, 479, 8, 1),
(53, 470, 3, 1),
(54, 471, 3, 1),
(55, 466, 4, 1),
(56, 475, 2, 1),
(57, 466, 4, 4),
(58, 466, 4, 1),
(59, 475, 2, 1),
(60, 474, 3, 1),
(61, 474, 3, 1),
(62, 473, 4, 2018),
(63, 473, 4, 1000),
(64, 473, 4, 100000),
(65, 488, 3546, 1),
(66, 470, 3, 1),
(67, 476, 2, 2),
(68, 474, 3, 1),
(68, 479, 8, 1),
(69, 473, 4, 1),
(70, 475, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `precio` int(11) NOT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `categoria` varchar(25) NOT NULL,
  `estado` varchar(25) NOT NULL DEFAULT 'activo',
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `fecha_creacion`, `categoria`, `estado`, `imagen`) VALUES
(466, 'Café Espress', 'Café espresso con una intensa crema', 4, NULL, 'Bebida', 'activo', 'uploads/cafe.jpg'),
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
(480, 'Hamburguesa Clásica', 'Hamburguesa de carne con queso cheddar y salsa especial', 7, NULL, 'Comida', 'activo', 'uploads\\ham.jpg'),
(488, 'eagfer', 'kljrtdgh', 3546, '2024-09-03', 'Bebida', 'inactivo', 'uploads\\1725396933720-Black and Beige Elegant Simple Modern Typography Logo (1).png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'Usuario'),
(2, 'Administrador'),
(3, 'Superusuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_cliente`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `pedido_producto`
--
ALTER TABLE `pedido_producto`
  ADD PRIMARY KEY (`id_pedido`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=489;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
