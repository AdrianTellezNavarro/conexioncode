const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

// Conexión a la base de datos
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "n0m3l0",
  database: "desesperanza",
});
con.connect();

// Middlewares
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

// Crear usuario
app.post("/agregarUsuario", (req, res) => {
  const nombre = req.body.nombre;

  con.query(
    "INSERT INTO usuario (nombre) VALUES (?)",
    [nombre],
    (err, resultado) => {
      if (err) {
        console.error("Error al agregar usuario:", err);
        return res.status(500).send("Error al agregar usuario");
      }
      return res.send(`Usuario "${nombre}" agregado correctamente`);
    }
  );
});

// Leer usuarios
app.get("/obtenerUsuario", (req, res) => {
  con.query("SELECT * FROM usuario", (err, respuesta) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return res.status(500).send("Error al obtener usuarios");
    }

    let userHTML = "";
    respuesta.forEach((user, i) => {
      userHTML += `<tr><td>${user.id_usuario}</td><td>${user.nombre}</td></tr>`;
    });

    return res.send(`
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          ${userHTML}
        </tbody>
      </table>
    `);
  });
});

// Actualizar usuario
app.post("/actualizarUsuario", (req, res) => {
  const nombreAnterior = req.body.nombre;
  const nuevoNombre = req.body.nuevoNombre;

  con.query(
    "UPDATE usuario SET nombre = ? WHERE nombre = ?",
    [nuevoNombre, nombreAnterior],
    (err, resultado) => {
      if (err) {
        console.error("Error al actualizar usuario:", err);
        return res.status(500).send("Error al actualizar usuario");
      }
      if (resultado.affectedRows === 0) {
        return res.status(404).send(`No se encontró el usuario con nombre "${nombreAnterior}"`);
      }
      return res.send(`Usuario "${nombreAnterior}" actualizado a "${nuevoNombre}" correctamente`);
    }
  );
});

// Borrar usuario
app.post("/borrarUsuario", (req, res) => {
  const id = req.body.id;

  con.query(
    "DELETE FROM usuario WHERE id_usuario = ?",
    [id],
    (err, resultado) => {
      if (err) {
        console.error("Error al borrar el usuario:", err);
        return res.status(500).send("Error al borrar el usuario");
      }
      if (resultado.affectedRows === 0) {
        return res.status(404).send("Usuario no encontrado");
      }
      return res.send(`Usuario con ID ${id} borrado correctamente`);
    }
  );
});

// Iniciar servidor
app.listen(10000, () => {
  console.log("Servidor escuchando en el puerto 10000");
});
