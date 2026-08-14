const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./db/config");
require("dotenv").config();

//Crear el servidor/aplicacion de express

const app = express();

// Base de Datos

dbConnection();

// CORS

const corsOrigin = process.env.CORS_ORIGIN;

app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(",") : true,
  })
);

// Lectura y parseo del body

app.use(express.json());

// Rutas

app.use("/api/auth", require("./routes/auth"));
app.use("/api/heroes", require("./routes/heroes"));

app.get("/", (req, res) => {
  res.json({ ok: true, service: "simple_mean_backend" });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
