import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const apiUrl = "http://localhost:3001/";

const EditarProductoModal = ({
  productoSeleccionado,
  mostrarModal,
  setMostrarModal,
  setProductoSeleccionado,
  setNotification,
}) => {
  const [imagenPreview, setImagenPreview] = useState("");
  const modalRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Efecto para actualizar la previsualización cuando se seleccione un producto
  useEffect(() => {
    if (productoSeleccionado) {
      const urlImagen = `${apiUrl}${productoSeleccionado.imagenSrc}`;
      setImagenPreview(urlImagen);
    }
  }, [productoSeleccionado]);

  // Manejador de clics fuera del modal
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMostrarModal(false);
      }
    };

    if (mostrarModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [mostrarModal, setMostrarModal]);

  const handleEditarProducto = async (formData) => {
    try {
      await axios.put(`${apiUrl}products/${productoSeleccionado.id_producto}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMostrarModal(false);
      setNotification({
        type: "success",
        message: "Producto editado exitosamente",
      });
    } catch (error) {
      console.error("Error al editar el producto:", error);
      setNotification({
        type: "error",
        message: "Error al editar el producto",
      });
    }
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
    precio: Yup.number()
      .required("El precio es obligatorio")
      .positive("Tiene que ser un número valido"),
    categoria: Yup.string().required("La categoría es obligatoria"),
    imagen: Yup.mixed()
      .test("fileSize", "El archivo debe ser una imagen", (value) => {
        if (!value) return true; // Si no hay archivo, no es obligatorio
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        return validTypes.includes(value.type);
      })
  });
  
  const handleSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("nombre", values.nombre);
    formData.append("descripcion", values.descripcion);
    formData.append("precio", values.precio);
    formData.append("categoria", values.categoria);

    if (selectedFile) {
      formData.append("imagen", selectedFile);
    }

    handleEditarProducto(formData);
    resetForm();
    setMostrarModal(false);
  };

  if (!productoSeleccionado) {
    return null;
  }

  return (
    <div>
      {mostrarModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
          }}
        >
          <div
            className={`modal ${mostrarModal ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{
              display: mostrarModal ? "block" : "none",
              position: "fixed",
              zIndex: 1050,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              ref={modalRef}
            >
              <div className="modal-content red">
                <div className="">
                  {imagenPreview && (
                    <img
                      src={imagenPreview}
                      alt="Imagen del producto"
                      className="card-img-top"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body m-2">
                    <h5 className="card-title">Editar Producto</h5>
                    <Formik
                      initialValues={{
                        nombre: productoSeleccionado.nombre || "",
                        descripcion: productoSeleccionado.descripcion || "",
                        precio: productoSeleccionado.precio || "",
                        categoria: productoSeleccionado.categoria || "",
                        imagen: "",
                      }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ setFieldValue }) => (
                        <Form>
                          <div className="form-group">
                            <label htmlFor="imagen">Imagen:</label>
                            <input
                              type="file"
                              className="form-control"
                              id="imagen"
                              accept="image/*"
                              onChange={(event) => {
                                const file = event.currentTarget.files[0];
                                setSelectedFile(file);
                                setFieldValue("imagen", file);
                                setImagenPreview(URL.createObjectURL(file));
                              }}
                            />
                            <ErrorMessage name="imagen" component="div" className="text-danger" />
                          </div>

                          <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="nombre"
                              name="nombre"
                            />
                            <ErrorMessage name="nombre" component="div" className="text-danger" />
                          </div>

                          <div className="form-group">
                            <label htmlFor="descripcion">Descripción:</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="descripcion"
                              name="descripcion"
                            />
                            <ErrorMessage name="descripcion" component="div" className="text-danger" />
                          </div>

                          <div className="form-group">
                            <label htmlFor="precio">Precio:</label>
                            <Field
                              type="number"
                              className="form-control"
                              id="precio"
                              name="precio"
                            />
                            <ErrorMessage name="precio" component="div" className="text-danger" />
                          </div>

                          <div className="form-group mb-4">
                            <label htmlFor="categoria">Categoría:</label>
                            <Field
                              as="select"
                              className="form-control"
                              id="categoria"
                              name="categoria"
                            >
                              <option value="">Selecciona una categoría</option>
                              <option value="Comida">Comida</option>
                              <option value="Bebida">Bebida</option>
                            </Field>
                            <ErrorMessage name="categoria" component="div" className="text-danger" />
                          </div>

                          <button type="submit" className="btn custom-button2">
                            Guardar Cambios
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarProductoModal;
