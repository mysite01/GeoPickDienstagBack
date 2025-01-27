import supertest from 'supertest';
import app from '../../src/app';
import { Game } from '../../src/model/GameModel';

describe("Game API Routes", () => {
    const request = supertest(app);

    // Datenbank nach jedem Test leeren, um Tests voneinander zu isolieren
    afterEach(async () => {
        await Game.deleteMany({});
    });

    test("POST /api/game - Create Game", async () => {
        const newGame = {
            title: "Berlin Sehenswürdigkeiten",
            beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Berlin",
            maxTeam: 5,
            userId: "507f191e810c19729de860ea", // Beispiel-ObjectId
        };

        const response = await request.post('/api/game').send(newGame);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe(newGame.title);
        expect(response.body.beschreibung).toBe(newGame.beschreibung);
        expect(response.body.maxTeam).toBe(newGame.maxTeam);
        expect(response.body.userId).toBe(newGame.userId);
    });

    test("GET /api/game/:id - Get Game by ID", async () => {
        // Erstellt ein Spiel direkt in der Datenbank
        const game = await Game.create({
            title: "Test Game",
            beschreibung: "Ein Testspiel",
            maxTeam: 3,
            userId: "507f191e810c19729de860ea",
        });

        const response = await request.get(`/api/game/${game._id}`).send();

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(game.title);
        expect(response.body.beschreibung).toBe(game.beschreibung);
        expect(response.body.maxTeam).toBe(game.maxTeam);
        expect(response.body.userId).toBe(game.userId.toString());
    });

    test("DELETE /api/game/:id - Delete Game by ID", async () => {
        // Erstellt ein Spiel direkt in der Datenbank
        const game = await Game.create({
            title: "Test Game",
            beschreibung: "Ein Testspiel",
            maxTeam: 3,
            userId: "507f191e810c19729de860ea",
        });

        const response = await request.delete(`/api/game/${game._id}`).send();

        expect(response.statusCode).toBe(204);

        // Überprüfen, ob das Spiel tatsächlich gelöscht wurde
        const deletedGame = await Game.findById(game._id);
        expect(deletedGame).toBeNull();
    });

    test("DELETE /api/game/:id - Delete non-existent Game returns 404", async () => {
        const nonExistentId = "507f191e810c19729de860ea"; // Gültige ObjectId-Formatierung
        const response = await request.delete(`/api/game/${nonExistentId}`).send();

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Spiel nicht gefunden");
    });
});
