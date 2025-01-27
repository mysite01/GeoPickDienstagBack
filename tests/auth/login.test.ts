// Muss vor allen anderen Imports stehen
import dotenv from "dotenv";
dotenv.config();

import { parseCookies } from "restmatcher";
import supertest from "supertest";
import app from "../../src/app";
import { createUser } from "../../src/services/UserService";
import { User } from "../../src/model/UserModel";

/**
 * Positivtest für POST /api/login
 */
test(`/api/login POST, Positivtest`, async () => {
    await createUser({ name: "Emir", password: "Password123" });

    const testee = supertest(app);
    const loginData = { name: "Emir", password: "Password123" };
    const response = parseCookies(await testee.post(`/api/login`).send(loginData));
    expect(response).statusCode("2*");

    // Überprüfung des Cookies
    expect(response).toHaveProperty("cookies");
    expect(response.cookies).toHaveProperty("access_token"); // JWT-Cookie
    const token = response.cookies.access_token;
    expect(token).toBeDefined();

    // Rohes Cookie überprüfen
    expect(response).toHaveProperty("cookiesRaw");
    const rawCookie = response.cookiesRaw.find(c => c.name === "access_token");
    expect(rawCookie?.httpOnly).toBe(true);
    expect(rawCookie?.sameSite).toBe("None");
    expect(rawCookie?.secure).toBe(true);
});

/**
 * Positivtest für DELETE /api/login
 */
test(`/api/login DELETE, Positivtest`, async () => {
    await createUser({ name: "Emir", password: "anotherSecurePassword123" });

    const testee = supertest(app);
    const loginData = { name: "Emir", password: "anotherSecurePassword123" };
    await testee.post(`/api/login`).send(loginData);

    const response = await testee.delete(`/api/login`).expect(204);
    expect(response.statusCode).toBe(204);
});

/**
 * Positivtest für GET /api/login
 */
test(`/api/login GET, Positivtest`, async () => {
    await createUser({ name: "Alice", password: "passwordForAlice123" });

    const testee = supertest(app);
    const loginData = { name: "Alice", password: "passwordForAlice123" };
    const loginResponse = parseCookies(await testee.post(`/api/login`).send(loginData));
    const token = loginResponse.cookies.access_token;

    const response = await testee.get(`/api/login`).set("Cookie", [`access_token=${token}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("exp");
    expect(response.body.id).toBeDefined();
});

/**
 * Negativtest für POST /api/login
 * Login mit falschem Passwort sollte fehlschlagen.
 */
test(`/api/login POST, Negativtest`, async () => {
    await createUser({ name: "John", password: "correctPassword123" });

    const testee = supertest(app);
    const loginData = { name: "John", password: "wrongPassword123" };
    const response = await testee.post(`/api/login`).send(loginData);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Login fehlgeschlagen");
});

/**
 * Negativtest für GET /api/login
 * Anfrage ohne gültigen Cookie sollte false zurückgeben.
 */
test(`/api/login GET, Negativtest`, async () => {
    const testee = supertest(app);

    const response = await testee.get(`/api/login`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(false);
});
