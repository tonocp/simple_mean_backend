const request = require("supertest");
const { buildTestApp } = require("../utils/buildTestApp");
const graficasRouter = require("../../routes/graficas");
const RedSocial = require("../../models/RedSocial");

const app = buildTestApp("/api/graficas", graficasRouter);

afterEach(() => {
  jest.restoreAllMocks();
});

describe("GET /api/graficas/redes-sociales", () => {
  it("responde sin necesidad de token", async () => {
    jest.spyOn(RedSocial, "find").mockResolvedValue([{ red: "Instagram", seguidores: 100 }]);

    const res = await request(app).get("/api/graficas/redes-sociales");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ red: "Instagram", seguidores: 100 }]);
  });

  it("responde 500 si falla la consulta", async () => {
    jest.spyOn(RedSocial, "find").mockRejectedValue(new Error("db error"));

    const res = await request(app).get("/api/graficas/redes-sociales");

    expect(res.status).toBe(500);
  });
});
