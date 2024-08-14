import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";

const AnadirProducto = ({ setProductos }) => {
  const [idExistError, setIdExistError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Función para manejar el envío del formulario
  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Verificar si el ID ya existe
      const idExistResponse = await axios.get(
        `http://localhost:3001/products/${values.id_producto}`
      );

      if (idExistResponse.data.length > 0) {
        // Si el ID ya existe, muestra un mensaje de error
        setIdExistError("El ID ya existe. Por favor, elige otro.");
      } else {
        // Si el ID no existe, procede con la inserción
        setIdExistError("");

        // Crear un FormData para enviar datos de formulario y la imagen
        const formData = new FormData();
        formData.append("nombre", values.nombre);
        formData.append("descripcion", values.descripcion);
        formData.append("precio", values.precio);
        formData.append("categoria", values.categoria);
        formData.append("imagen", selectedFile);

        // Enviar solicitud POST al servidor
        await axios.post("http://localhost:3001/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Obtener la lista actualizada de productos después de la inserción
        const response = await axios.get("http://localhost:3001/products");

        // Actualizar el estado local con la nueva lista de productos
        setProductos(response.data);

        // Limpiar los campos después de una inserción exitosa
        resetForm();
        setSelectedFile(null); // Limpia el archivo seleccionado

        toast.success("Producto añadido exitosamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error al añadir el producto", error);
      toast.error("Error al añadir el producto", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleAgregarProducto = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
    precio: Yup.number()
      .required("El precio es obligatorio")
      .positive("El precio debe ser un número positivo"),
    categoria: Yup.string().required("La categoría es obligatoria"),
    imagen: Yup.mixed().required("La imagen es obligatoria"),
  });

  return (
    <div className="container mt-5 text-center mb-5">
      {mostrarFormulario ? (
        <>
          <h2 className="mb-4">Añadir Producto</h2>
          <Formik
            initialValues={{
              nombre: "",
              descripcion: "",
              precio: "",
              categoria: "",
              imagen: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="w-75 container bg-Barra2 text-white rounded p-3">
                <div className="row">
                  <div className="mb-1 col-md">
                    <label className="form-label">Nombre:</label>
                    <Field type="text" name="nombre" className="form-control" />
                    <ErrorMessage
                      name="nombre"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                <div className="mb-1 col-md">
                  <label className="form-label">Descripción:</label>
                  <Field
                    type="text"
                    name="descripcion"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="descripcion"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="row">
                  <div className="mb-1 col-md-6">
                    <label className="form-label">Precio:</label>
                    <Field
                      type="number"
                      name="precio"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="precio"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-1 col-md-6 mb-4">
                    <label className="form-label">Categoría:</label>
                    <Field
                      as="select"
                      name="categoria"
                      className="form-control"
                    >
                      <option value="" disabled>
                        Selecciona una categoría
                      </option>
                      <option value="Comida">Comida</option>
                      <option value="Bebida">Bebida</option>
                    </Field>
                    <ErrorMessage
                      name="categoria"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                <div className="mb-1 col-md">
                  <label className="form-label">Imagen:</label>
                  <input
                    type="file"
                    name="imagen"
                    className="form-control"
                    onChange={(event) => {
                      setFieldValue("imagen", event.currentTarget.files[0]);
                      setSelectedFile(event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage
                    name="imagen"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary custom-button1"
                >
                  Añadir Producto
                </button>
                <button
                  type="button"
                  className="btn btn-primary ml-3 mr-3 custom-button2"
                  onClick={handleAgregarProducto}
                >
                  Cerrar
                </button>
              </Form>
            )}
          </Formik>{" "}
        </>
      ) : (
        <button
          className="btn btn-primary custom-button2"
          onClick={handleAgregarProducto}
        >
          Añadir Producto
        </button>
      )}
    </div>
  );
};

export default AnadirProducto;
