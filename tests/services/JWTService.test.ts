import { verifyPasswordAndCreateJWT, verifyJWT } from "../../src/services/JWTService";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { User } from "../../src/model/UserModel";
import dotenv from "dotenv";

dotenv.config();

describe("JWTService Tests", () => {
    beforeAll(async () => {
        process.env.JWT_SECRET = "super-geheimes-passwort";
        process.env.JWT_TTL = "3600"; // 1 Stunde
    });

    test("JWT Erstellung und Verifikation erfolgreich", async () => {
        const user = new User({ name: "testuser", password: "securepassword" });
        await user.save();

        const token = await verifyPasswordAndCreateJWT("testuser", "securepassword");
        expect(token).toBeDefined();

        const decoded = verifyJWT(token!);
        expect(decoded).toBeDefined();
        expect(decoded.id).toBe(user._id.toString());
    });

    test("JWT Erstellung fehlschlägt bei falschem Passwort", async () => {
        const user = new User({ name: "testuser", password: "securepassword" });
        await user.save();

        const token = await verifyPasswordAndCreateJWT("testuser", "wrongpassword");
        expect(token).toBeUndefined();
    });

    test("JWT Verifikation erfolgreich", async () => {
        const payload = { sub: "12345" };
        const secret = process.env.JWT_SECRET!;
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });

        const decoded = verifyJWT(token);
        expect(decoded.id).toBe(payload.sub);
        expect(decoded.exp).toBeDefined();
    });

    test("JWT Verifikation fehlschlägt bei ungültigem Token", () => {
        expect(() => verifyJWT("invalid-token")).toThrow(JsonWebTokenError);
    });

    test("JWT Verifikation fehlschlägt bei abgelaufenem Token", () => {
        const payload = { sub: "12345" };
        const secret = process.env.JWT_SECRET!;
        const token = jwt.sign(payload, secret, { expiresIn: "1ms" }); // Sehr kurzer TTL

        setTimeout(() => {
            expect(() => verifyJWT(token)).toThrow(JsonWebTokenError);}, 10); 
    });

    test("Fehler, wenn JWT_SECRET nicht gesetzt ist", async () => {
        delete process.env.JWT_SECRET;

        const payload = { sub: "12345" };
        const token = jwt.sign(payload, "dummy-secret", { expiresIn: "1h" });

        expect(() => verifyJWT(token)).toThrow("Umgebungsvariable JWT_SECRET ist nicht gesetzt.");
    });
});
