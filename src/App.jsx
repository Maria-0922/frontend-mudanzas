import { useEffect, useState } from "react";

function App() {

  const [clientes, setClientes] = useState([]);

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    direccion: ""
  });

  const obtenerClientes = async () => {
    const response = await fetch("http://localhost:8080/api/clientes");
    const data = await response.json();
    setClientes(data);
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const guardarCliente = async () => {

    await fetch("http://localhost:8080/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cliente)
    });

    setCliente({
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      direccion: ""
    });

    obtenerClientes();
  };

const eliminarCliente = async (id) => {
  await fetch(`http://localhost:8080/api/clientes/${id}`, {
    method: "DELETE"
  });

  obtenerClientes();
};

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      <h1>Sistema de Clientes</h1>

      <div style={{ marginBottom: "20px" }}>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={cliente.nombre}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={cliente.apellido}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="telefono"
          placeholder="Telefono"
          value={cliente.telefono}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="correo"
          placeholder="Correo"
          value={cliente.correo}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="direccion"
          placeholder="Direccion"
          value={cliente.direccion}
          onChange={handleChange}
        />

        <br /><br />

        <button onClick={guardarCliente}>
          Guardar Cliente
        </button>

      </div>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Direccion</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.apellido}</td>
              <td>{c.telefono}</td>
              <td>{c.correo}</td>
              <td>{c.direccion}</td>
              <td>
                <button onClick={() => eliminarCliente(c.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;