const express = require("express");

const buildTestApp = (basePath, router) => {
  const app = express();
  app.use(express.json());
  app.use(basePath, router);
  return app;
};

module.exports = { buildTestApp };
