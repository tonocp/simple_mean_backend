require("dotenv").config();
const mongoose = require("mongoose");
const Heroe = require("../models/Heroe");
const heroes = require("./heroes.seed");

const force = process.argv.includes("--force");

const run = async () => {
  await mongoose.connect(process.env.DB_CNN);

  const count = await Heroe.countDocuments({ seeded: true });

  if (count > 0 && !force) {
    console.log(
      `Ya hay ${count} heroe(s) del seed en la colección. No se hace nada. Usa --force para reemplazarlos (los heroes creados por usuarios no se tocan).`
    );
    await mongoose.disconnect();
    return;
  }

  if (force) {
    await Heroe.deleteMany({ seeded: true });
  }

  await Heroe.insertMany(heroes.map((heroe) => ({ ...heroe, seeded: true })));
  console.log(`${heroes.length} heroes insertados.`);

  await mongoose.disconnect();
};

run().catch((error) => {
  console.log(error);
  process.exit(1);
});
