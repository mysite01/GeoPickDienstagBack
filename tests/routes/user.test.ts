import supertest from 'supertest';
import app from '../../src/app';
import { User } from '../../src/model/UserModel';

describe("User API Routes", () => {
    const request = supertest(app);

    // Datenbank nach jedem Test leeren, um Tests voneinander zu isolieren
    afterEach(async () => {
        await User.deleteMany({});
    });

    test("POST /api/user - Create User", async () => {
        const newUser = { name: "John Doe", password: "password123" };

        const response = await request.post('/api/user').send(newUser);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe(newUser.name);
        expect(response.body.password).not.toBe(newUser.password);
        expect(response.body).toHaveProperty("createdAt");
    });

    test("GET /api/user/:id - Get User by ID", async () => {
        // Erstellt einen Benutzer direkt in der Datenbank
        const user = await User.create({ name: "Jane Doe", password: "securepassword" });

        const response = await request.get(`/api/user/${user._id}`).send();

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(user.name);
        expect(response.body.password).toBe(user.password);
    });

    


    test("DELETE /api/user/:id - Delete non-existent User returns 404", async () => {
        const nonExistentId = "507f191e810c19729de860ea"; // Gültige ObjectId-Formatierung
        const response = await request.delete(`/api/user/${nonExistentId}`).send();

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Benutzer nicht gefunden");
    });
});
