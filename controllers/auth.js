const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

// Crear un nuevo usuario

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    // Verificar email existente

    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: `Ya existe un usuario con el email '${email}'`,
      });
    }

    // Crear usuario con el modelo

    let dbUser = new Usuario(req.body);

    // Encriptar el password (Hash)

    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    // Generar el JSON Web Token

    const token = await generarJWT(dbUser.id, dbUser.name);

    // Crear Usuario en DB

    await dbUser.save();

    // Generar respuesta exitosa

    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

// Login usuario

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar email existente

    const dbUser = await Usuario.findOne({ email });
    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "El correo no existe.",
      });
    }

    // Verificar el Password

    const validPass = bcrypt.compareSync(password, dbUser.password);
    if (!validPass) {
      return res.status(400).json({
        ok: false,
        msg: "El password no es válido.",
      });
    }

    // Generar el JSON Web Token

    const token = await generarJWT(dbUser.id, dbUser.name);

    // Generar respuesta exitosa

    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con el Administrador.",
    });
  }
};

// Validar y revalidar token

const revalidarToken = async (req, res) => {
  const { uid } = req;

  // Leer la base de datos

  const dbUser = await Usuario.findById(uid);

  // Generar otro JSON Web Token

  const token = await generarJWT(uid, dbUser.name);

  return res.json({
    ok: true,
    uid,
    name: dbUser.name,
    email: dbUser.email,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
