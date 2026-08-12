const jwt = require("jsonwebtoken");
const { generarJWT } = require("../../helpers/jwt");

describe("generarJWT", () => {
  it("genera un token firmado con HS256 que contiene el uid y el name", async () => {
    const token = await generarJWT("abc123", "Test User");

    expect(typeof token).toBe("string");

    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED, {
      algorithms: ["HS256"],
    });

    expect(payload.uid).toBe("abc123");
    expect(payload.name).toBe("Test User");
  });

  it("expira en 24h", async () => {
    const token = await generarJWT("abc123", "Test User");
    const payload = jwt.decode(token);

    expect(payload.exp - payload.iat).toBe(24 * 60 * 60);
  });
});
