const request = require("supertest");
const bcrypt = require("bcryptjs");
const { buildTestApp } = require("../utils/buildTestApp");
const authRouter = require("../../routes/auth");
const Usuario = require("../../models/Usuario");

const app = buildTestApp("/api/auth", authRouter);

afterEach(() => {
  jest.restoreAllMocks();
});

describe("POST /api/auth/new", () => {
  it("crea el usuario y devuelve token cuando el email no existe", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);
    jest.spyOn(Usuario.prototype, "save").mockResolvedValue();

    const res = await request(app).post("/api/auth/new").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.email).toBe("test@example.com");
  });

  it("responde 400 si ya existe un usuario con ese email", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue({ email: "test@example.com" });

    const res = await request(app).post("/api/auth/new").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("responde 400 de validación si falta el email", async () => {
    const res = await request(app).post("/api/auth/new").send({
      name: "Test User",
      password: "123456",
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth (login)", () => {
  it("hace login correctamente con credenciales válidas", async () => {
    const hash = bcrypt.hashSync("123456", 10);
    jest.spyOn(Usuario, "findOne").mockResolvedValue({
      id: "abc123",
      name: "Test User",
      email: "test@example.com",
      password: hash,
    });

    const res = await request(app).post("/api/auth").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it("responde 400 si el email no existe", async () => {
    jest.spyOn(Usuario, "findOne").mockResolvedValue(null);

    const res = await request(app).post("/api/auth").send({
      email: "noexiste@example.com",
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("El correo no existe.");
  });

  it("responde 400 si el password es incorrecto", async () => {
    const hash = bcrypt.hashSync("123456", 10);
    jest.spyOn(Usuario, "findOne").mockResolvedValue({
      id: "abc123",
      name: "Test User",
      email: "test@example.com",
      password: hash,
    });

    const res = await request(app).post("/api/auth").send({
      email: "test@example.com",
      password: "otro-password",
    });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe("El password no es válido.");
  });
});

describe("GET /api/auth/renew", () => {
  it("responde 401 sin token", async () => {
    const res = await request(app).get("/api/auth/renew");
    expect(res.status).toBe(401);
  });

  it("renueva el token con un token válido", async () => {
    const bcryptHash = bcrypt.hashSync("123456", 10);
    jest.spyOn(Usuario, "findOne").mockResolvedValue({
      id: "uid-123",
      name: "Test User",
      email: "test@example.com",
      password: bcryptHash,
    });

    const loginRes = await request(app).post("/api/auth").send({
      email: "test@example.com",
      password: "123456",
    });

    jest.spyOn(Usuario, "findById").mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
    });

    const res = await request(app)
      .get("/api/auth/renew")
      .set("x-token", loginRes.body.token);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
  });
});
