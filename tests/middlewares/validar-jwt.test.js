const { validarJWT } = require("../../middlewares/validar-jwt");
const { generarJWT } = require("../../helpers/jwt");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("validarJWT", () => {
  it("responde 401 si no hay header x-token", () => {
    const req = { header: () => undefined };
    const res = mockRes();
    const next = jest.fn();

    validarJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("responde 401 si el token no es válido", () => {
    const req = { header: () => "token-invalido" };
    const res = mockRes();
    const next = jest.fn();

    validarJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("llama a next() y añade uid/name al request si el token es válido", async () => {
    const token = await generarJWT("uid-123", "Test User");
    const req = { header: () => token };
    const res = mockRes();
    const next = jest.fn();

    validarJWT(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.uid).toBe("uid-123");
    expect(req.name).toBe("Test User");
    expect(res.status).not.toHaveBeenCalled();
  });
});
