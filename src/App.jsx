import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = "http://localhost:8080/api/clientes";

  const [clientes, setClientes] = useState([]);

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    direccion: ""
  });

  const [cotizacion, setCotizacion] = useState({
    origen: "",
    destino: "",
    distancia: "",
    objetos: "",
    pisoOrigen: "",
    pisoDestino: "",
    fecha: "",
    estado: "Pendiente"
  });

  const [servicios, setServicios] = useState([]);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState("");

  const obtenerClientes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      setMensaje("No se pudo conectar con el backend");
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const manejarCambioCliente = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  const manejarCambioCotizacion = (e) => {
    setCotizacion({
      ...cotizacion,
      [e.target.name]: e.target.value
    });
  };

  const guardarCliente = async () => {
    if (!cliente.nombre || !cliente.apellido || !cliente.telefono) {
      setMensaje("Completa nombre, apellido y teléfono");
      return;
    }

    await fetch(API_URL, {
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

    setMensaje("Cliente guardado correctamente");
    obtenerClientes();
  };

  const eliminarCliente = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    setMensaje("Cliente eliminado correctamente");
    obtenerClientes();
  };

  const calcularCotizacion = () => {
    const tarifaBase = 80000;
    const valorKm = Number(cotizacion.distancia) * 3000;
    const valorObjetos = Number(cotizacion.objetos) * 5000;
    const valorPisos =
      (Number(cotizacion.pisoOrigen) + Number(cotizacion.pisoDestino)) * 10000;

    const totalCalculado = tarifaBase + valorKm + valorObjetos + valorPisos;

    setTotal(totalCalculado);

    const nuevoServicio = {
      id: Date.now(),
      cliente:
        clientes.length > 0
          ? `${clientes[0].nombre} ${clientes[0].apellido}`
          : "Cliente registrado",
      origen: cotizacion.origen,
      destino: cotizacion.destino,
      fecha: cotizacion.fecha,
      total: totalCalculado,
      estado: cotizacion.estado
    };

    setServicios([...servicios, nuevoServicio]);
    setMensaje("Cotización y servicio agendado correctamente");
  };

  const cambiarEstadoServicio = (id) => {
    const serviciosActualizados = servicios.map((servicio) => {
      if (servicio.id === id) {
        let nuevoEstado = "Pendiente";

        if (servicio.estado === "Pendiente") {
          nuevoEstado = "En proceso";
        } else if (servicio.estado === "En proceso") {
          nuevoEstado = "Finalizado";
        }

        return {
          ...servicio,
          estado: nuevoEstado
        };
      }

      return servicio;
    });

    setServicios(serviciosActualizados);
  };

  return (
    <div className="contenedor">
      <header className="encabezado">
        <h1>Sistema de Gestión de Mudanzas</h1>
        <p>Gestión de clientes, cotizaciones y servicios de mudanza</p>
      </header>

      {mensaje && <div className="mensaje">{mensaje}</div>}

      <section className="grid">
        <div className="card">
          <h2>Registro de Clientes</h2>

          <input name="nombre" placeholder="Nombre" value={cliente.nombre} onChange={manejarCambioCliente} />
          <input name="apellido" placeholder="Apellido" value={cliente.apellido} onChange={manejarCambioCliente} />
          <input name="telefono" placeholder="Teléfono" value={cliente.telefono} onChange={manejarCambioCliente} />
          <input name="correo" placeholder="Correo" value={cliente.correo} onChange={manejarCambioCliente} />
          <input name="direccion" placeholder="Dirección" value={cliente.direccion} onChange={manejarCambioCliente} />

          <button className="btn-principal" onClick={guardarCliente}>
            Guardar Cliente
          </button>
        </div>

        <div className="card">
          <h2>Cotización de Mudanza</h2>

          <input name="origen" placeholder="Ciudad o dirección de origen" value={cotizacion.origen} onChange={manejarCambioCotizacion} />
          <input name="destino" placeholder="Ciudad o dirección de destino" value={cotizacion.destino} onChange={manejarCambioCotizacion} />
          <input type="number" name="distancia" placeholder="Distancia en km" value={cotizacion.distancia} onChange={manejarCambioCotizacion} />
          <input type="number" name="objetos" placeholder="Cantidad de objetos" value={cotizacion.objetos} onChange={manejarCambioCotizacion} />
          <input type="number" name="pisoOrigen" placeholder="Piso origen" value={cotizacion.pisoOrigen} onChange={manejarCambioCotizacion} />
          <input type="number" name="pisoDestino" placeholder="Piso destino" value={cotizacion.pisoDestino} onChange={manejarCambioCotizacion} />
          <input type="date" name="fecha" value={cotizacion.fecha} onChange={manejarCambioCotizacion} />

          <select name="estado" value={cotizacion.estado} onChange={manejarCambioCotizacion}>
            <option>Pendiente</option>
            <option>En proceso</option>
            <option>Finalizado</option>
          </select>

          <button className="btn-secundario" onClick={calcularCotizacion}>
            Calcular Cotización
          </button>

          {total > 0 && (
            <div className="resultado">
              <h3>Total estimado:</h3>
              <p>${total.toLocaleString("es-CO")}</p>
              <small>
                Estado del servicio: <strong>{cotizacion.estado}</strong>
              </small>
            </div>
          )}
        </div>
      </section>

      <section className="card tabla-card">
        <h2>Listado de Clientes</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
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
                  <button className="btn-eliminar" onClick={() => eliminarCliente(c.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card tabla-card">
        <h2>Servicios Agendados</h2>

        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {servicios.map((s) => (
              <tr key={s.id}>
                <td>{s.cliente}</td>
                <td>{s.origen}</td>
                <td>{s.destino}</td>
                <td>{s.fecha}</td>
                <td>${s.total.toLocaleString("es-CO")}</td>
                <td>{s.estado}</td>
                <td>
                  <button className="btn-secundario" onClick={() => cambiarEstadoServicio(s.id)}>
                    Cambiar Estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;