const { response } = require("express");
const RedSocial = require("../models/RedSocial");

// Listar seguidores por red social

const getRedesSociales = async (req, res = response) => {
  try {
    const redesSociales = await RedSocial.find();
    return res.json(redesSociales);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

module.exports = {
  getRedesSociales,
};
