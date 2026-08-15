const { Router } = require("express");
const { getRedesSociales } = require("../controllers/graficas");

const router = Router();

// Ruta pública: alimenta los gráficos de un portfolio, no requiere token

router.get("/redes-sociales", getRedesSociales);

module.exports = router;
