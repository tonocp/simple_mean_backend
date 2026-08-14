const { response } = require("express");
const Heroe = require("../models/Heroe");

// Listar todos los heroes

const getHeroes = async (req, res = response) => {
  try {
    const heroes = await Heroe.find();
    return res.json(heroes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

// Obtener un heroe por id

const getHeroePorId = async (req, res = response) => {
  const { id } = req.params;

  try {
    const heroe = await Heroe.findById(id);

    if (!heroe) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un héroe con ese id.",
      });
    }

    return res.json(heroe);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        ok: false,
        msg: "El id no es válido.",
      });
    }

    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

// Buscar heroes por nombre

const buscarHeroes = async (req, res = response) => {
  const { termino } = req.params;

  try {
    const regex = new RegExp(termino, "i");
    const heroes = await Heroe.find({ superhero: regex });
    return res.json(heroes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

// Crear un nuevo heroe

const crearHeroe = async (req, res = response) => {
  try {
    // "seeded" solo lo puede fijar el script de seed, nunca la API pública
    const { seeded, ...body } = req.body;
    const heroe = new Heroe(body);
    await heroe.save();
    return res.status(201).json(heroe);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

// Actualizar un heroe

const actualizarHeroe = async (req, res = response) => {
  const { id } = req.params;

  try {
    const existente = await Heroe.findById(id);

    if (!existente) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un héroe con ese id.",
      });
    }

    if (existente.seeded) {
      return res.status(403).json({
        ok: false,
        msg: "Este héroe forma parte de la colección precargada y no se puede editar.",
      });
    }

    // "seeded" solo lo puede fijar el script de seed, nunca la API pública
    const { seeded, ...body } = req.body;
    const heroe = await Heroe.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    return res.json(heroe);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        ok: false,
        msg: "El id no es válido.",
      });
    }

    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

// Borrar un heroe

const borrarHeroe = async (req, res = response) => {
  const { id } = req.params;

  try {
    const existente = await Heroe.findById(id);

    if (!existente) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un héroe con ese id.",
      });
    }

    if (existente.seeded) {
      return res.status(403).json({
        ok: false,
        msg: "Este héroe forma parte de la colección precargada y no se puede borrar.",
      });
    }

    const heroe = await Heroe.findByIdAndDelete(id);

    return res.json(heroe);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        ok: false,
        msg: "El id no es válido.",
      });
    }

    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

module.exports = {
  getHeroes,
  getHeroePorId,
  buscarHeroes,
  crearHeroe,
  actualizarHeroe,
  borrarHeroe,
};
