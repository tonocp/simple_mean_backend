const request = require("supertest");
const { buildTestApp } = require("../utils/buildTestApp");
const heroesRouter = require("../../routes/heroes");
const Heroe = require("../../models/Heroe");
const { generarJWT } = require("../../helpers/jwt");

const app = buildTestApp("/api/heroes", heroesRouter);

let token;

beforeAll(async () => {
  token = await generarJWT("uid-123", "Test User");
});

afterEach(() => {
  jest.restoreAllMocks();
});

const castError = () => {
  const error = new Error("Cast to ObjectId failed");
  error.name = "CastError";
  throw error;
};

describe("autenticación", () => {
  it("responde 401 en cualquier ruta sin token", async () => {
    const res = await request(app).get("/api/heroes/list");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/heroes/list", () => {
  it("devuelve la lista de heroes", async () => {
    jest.spyOn(Heroe, "find").mockResolvedValue([{ superhero: "Batman" }]);

    const res = await request(app).get("/api/heroes/list").set("x-token", token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ superhero: "Batman" }]);
  });
});

describe("GET /api/heroes/search/:termino", () => {
  it("busca heroes por nombre (case-insensitive)", async () => {
    const findSpy = jest.spyOn(Heroe, "find").mockResolvedValue([{ superhero: "Spider-Man" }]);

    const res = await request(app).get("/api/heroes/search/spider").set("x-token", token);

    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ superhero: expect.any(RegExp) });
  });
});

describe("GET /api/heroes/:id", () => {
  it("devuelve el heroe si existe", async () => {
    jest.spyOn(Heroe, "findById").mockResolvedValue({ superhero: "Batman" });

    const res = await request(app).get("/api/heroes/507f1f77bcf86cd799439011").set("x-token", token);

    expect(res.status).toBe(200);
    expect(res.body.superhero).toBe("Batman");
  });

  it("responde 404 si no existe", async () => {
    jest.spyOn(Heroe, "findById").mockResolvedValue(null);

    const res = await request(app).get("/api/heroes/507f1f77bcf86cd799439011").set("x-token", token);

    expect(res.status).toBe(404);
  });

  it("responde 400 si el id no es válido", async () => {
    jest.spyOn(Heroe, "findById").mockImplementation(castError);

    const res = await request(app).get("/api/heroes/id-invalido").set("x-token", token);

    expect(res.status).toBe(400);
  });
});

describe("POST /api/heroes/new", () => {
  const heroeValido = {
    superhero: "Spider-Man",
    publisher: "Marvel Comics",
    alter_ego: "Peter Parker",
    first_appearance: "Amazing Fantasy #15",
    characters: "Peter Parker",
  };

  it("crea el heroe correctamente", async () => {
    jest.spyOn(Heroe.prototype, "save").mockResolvedValue();

    const res = await request(app)
      .post("/api/heroes/new")
      .set("x-token", token)
      .send(heroeValido);

    expect(res.status).toBe(201);
    expect(res.body.superhero).toBe("Spider-Man");
  });

  it("responde 400 si la editorial no es válida", async () => {
    const res = await request(app)
      .post("/api/heroes/new")
      .set("x-token", token)
      .send({ ...heroeValido, publisher: "Image Comics" });

    expect(res.status).toBe(400);
  });

  it("ignora cualquier 'seeded' que venga en el body", async () => {
    let heroeGuardado;
    jest.spyOn(Heroe.prototype, "save").mockImplementation(function () {
      heroeGuardado = this;
      return Promise.resolve();
    });

    await request(app)
      .post("/api/heroes/new")
      .set("x-token", token)
      .send({ ...heroeValido, seeded: true });

    expect(heroeGuardado.seeded).toBe(false);
  });
});

describe("PUT /api/heroes/edit/:id", () => {
  it("actualiza el heroe si no es del seed", async () => {
    jest.spyOn(Heroe, "findById").mockResolvedValue({ seeded: false });
    jest.spyOn(Heroe, "findByIdAndUpdate").mockResolvedValue({ superhero: "Spider-Man Edited" });

    const res = await request(app)
      .put("/api/heroes/edit/507f1f77bcf86cd799439011")
      .set("x-token", token)
      .send({ superhero: "Spider-Man Edited" });

    expect(res.status).toBe(200);
    expect(res.body.superhero).toBe("Spider-Man Edited");
  });

  it("responde 404 si no existe", async () => {
    jest.spyOn(Heroe, "findById").mockResolvedValue(null);

    const res = await request(app)
      .put("/api/heroes/edit/507f1f77bcf86cd799439011")
      .set("x-token", token)
      .send({ superhero: "x" });

    expect(res.status).toBe(404);
  });

  it("responde 403 si el heroe es del seed", async () => {
    jest.spyOn(Heroe, "findById").mockResolvedValue({ seeded: true });

    const res = await request(app)
      .put("/api/heroes/edit/507f1f77bcf86cd799439011")
      .set("x-token", token)
      .send({ superhero: "HACKED" });

    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/heroes/:id", () => {
  it("borra el heroe si no es del seed", async () => {
    jest.spyOn(Heroe, "findById").mockResolvedValue({ seeded: false });
    jest.spyOn(Heroe, "findByIdAndDelete").mockResolvedValue({ superhero: "Test Hero" });

    const res = await request(app)
      .delete("/api/heroes/507f1f77bcf86cd799439011")
      .set("x-token", token);

    expect(res.status).toBe(200);
  });

  it("responde 404 si no existe", async () => {
    jest.spyOn(Heroe, "findById").mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/heroes/507f1f77bcf86cd799439011")
      .set("x-token", token);

    expect(res.status).toBe(404);
  });

  it("responde 403 si el heroe es del seed", async () => {
    jest.spyOn(Heroe, "findById").mockResolvedValue({ seeded: true });

    const res = await request(app)
      .delete("/api/heroes/507f1f77bcf86cd799439011")
      .set("x-token", token);

    expect(res.status).toBe(403);
  });
});
