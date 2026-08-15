require("dotenv").config();
const mongoose = require("mongoose");
const Heroe = require("../models/Heroe");
const RedSocial = require("../models/RedSocial");
const heroes = require("./heroes.seed");
const redesSociales = require("./redes-sociales.seed");

const force = process.argv.includes("--force");

const seedColeccion = async (Modelo, datos, nombre) => {
  const count = await Modelo.countDocuments({ seeded: true });

  if (count > 0 && !force) {
    console.log(
      `Ya hay ${count} ${nombre}(s) del seed en la colección. No se hace nada. Usa --force para reemplazarlos (los documentos creados por usuarios no se tocan).`
    );
    return;
  }

  if (force) {
    await Modelo.deleteMany({ seeded: true });
  }

  await Modelo.insertMany(datos.map((dato) => ({ ...dato, seeded: true })));
  console.log(`${datos.length} ${nombre}(s) insertados.`);
};

const run = async () => {
  await mongoose.connect(process.env.DB_CNN);

  await seedColeccion(Heroe, heroes, "heroe");
  await seedColeccion(RedSocial, redesSociales, "red social");

  await mongoose.disconnect();
};

run().catch((error) => {
  console.log(error);
  process.exit(1);
});
