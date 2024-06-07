-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-05-2024 a las 22:58:27
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `telefono` varchar(12) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `Administrador` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `correo_electronico`, `telefono`, `contrasena`, `fecha_creacion`, `Administrador`) VALUES
(1025884473, 'Johan      ', 'Velez@gmail.com', '2314140078', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-05-03 13:33:07', 0),
(1025884474, 'Tomass', 'no@gmail.com', '2345673278', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-04-30 15:35:39', 1),
(1025884475, 'Tomas', 'no@gmail.com', '2345673278', '$2b$10$1qAZ.HvYnoX0ZomDnkgiIuTDsvFJjhw3G8AJxFlkKbPlJTqppYdB6', '2024-04-30 15:35:39', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

CREATE TABLE `configuracion` (
  `id_config` int(11) NOT NULL,
  `pais` varchar(255) NOT NULL,
  `idioma` varchar(50) NOT NULL,
  `moneda` varchar(50) NOT NULL,
  `tiempo_pedido` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`id_config`, `pais`, `idioma`, `moneda`, `tiempo_pedido`) VALUES
(1, 'México', 'Español', 'Peso Mexicano', '2023-09-17 09:47:13'),
(2, 'Estados Unidos', 'Inglés', 'Dólar estadounidense', '2023-09-17 09:47:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envios`
--

CREATE TABLE `envios` (
  `id_envio` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `fecha_envio` datetime DEFAULT NULL,
  `fecha_entrega` datetime DEFAULT NULL,
  `direccion_entrega` varchar(255) NOT NULL,
  `persona_recibio` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `envios`
--

INSERT INTO `envios` (`id_envio`, `id_pedido`, `fecha_envio`, `fecha_entrega`, `direccion_entrega`, `persona_recibio`) VALUES
(1, 1, '2023-09-17 09:47:13', '2023-09-17 09:47:13', 'Calle Principal 123, Ciudad ABC', 'Juan Perez'),
(2, 2, '2023-09-17 09:47:13', '2023-09-17 09:47:13', 'Avenida Secundaria 456, Ciudad DEF', 'Maria Lopez'),
(3, 3, '2023-09-17 09:47:13', '2023-09-17 09:47:13', 'Calle Secundaria 789, Ciudad GHI', 'Carlos Rodriguez');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `his_contra`
--

CREATE TABLE `his_contra` (
  `id_hiscontra` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `contrasena` varchar(25) NOT NULL,
  `fecha_modifi` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `monto_total` int(11) NOT NULL,
  `metodo_pago` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_pedido`, `fecha_pago`, `monto_total`, `metodo_pago`) VALUES
(1, 1, '2023-09-17 09:47:13', 500, 'Tarjeta de crédito'),
(2, 2, '2023-09-17 09:47:13', 750, 'PayPal'),
(3, 3, '2023-09-17 09:47:13', 300, 'Transferencia bancaria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_compra` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_cliente`, `estado`, `fecha_compra`) VALUES
(1, 1025884474, 'Pendiente', '2023-09-17 09:47:13'),
(2, 2, 'En proceso', '2023-09-17 09:47:13'),
(3, 3, 'Entregado', '2023-09-17 09:47:13');

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
(1, 1, 100, 0),
(1, 2, 150, 0),
(2, 2, 50, 0),
(3, 3, 200, 0);

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
  `imagen` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `fecha_creacion`, `categoria`, `estado`, `imagen`) VALUES
(1, '1', 'Descripción del Producto 1', 100, '2023-09-17', 'Comida', 'activo', NULL),
(2, 'Producto 2', 'Descripción del Producto 2', 50, '2023-09-17', 'Comida', 'activo', NULL),
(3, 'Producto 5', 'Descripción del Producto 3', 200, '2023-09-17', 'Bebida', 'activo', NULL);
INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `fecha_creacion`, `categoria`, `estado`, `imagen`) VALUES
INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `fecha_creacion`, `categoria`, `estado`, `imagen`) VALUES

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`id_config`);

--
-- Indices de la tabla `envios`
--
ALTER TABLE `envios`
  ADD PRIMARY KEY (`id_envio`);

--
-- Indices de la tabla `his_contra`
--
ALTER TABLE `his_contra`
  ADD PRIMARY KEY (`id_hiscontra`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_pedido` (`id_pedido`);

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
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
