const { Router } = require("express");
const { check } = require("express-validator");
const {
  getHeroes,
  getHeroePorId,
  buscarHeroes,
  crearHeroe,
  actualizarHeroe,
  borrarHeroe,
} = require("../controllers/heroes");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// Todas las rutas de heroes requieren un token válido

router.use(validarJWT);

router.get("/list", getHeroes);

router.get("/search/:termino", buscarHeroes);

router.get("/:id", getHeroePorId);

router.post(
  "/new",
  [
    check("superhero", "El nombre del héroe es obligatorio.").notEmpty(),
    check("publisher", "La editorial no es válida.").isIn(["DC Comics", "Marvel Comics"]),
    check("alter_ego", "El alter ego es obligatorio.").notEmpty(),
    check("first_appearance", "La primera aparición es obligatoria.").notEmpty(),
    check("characters", "Los personajes son obligatorios.").notEmpty(),
    validarCampos,
  ],
  crearHeroe
);

router.put("/edit/:id", actualizarHeroe);

router.delete("/:id", borrarHeroe);

module.exports = router;
