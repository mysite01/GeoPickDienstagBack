import { createGame, deleteGame, getGameById } from "../../src/services/GameService";
import { Game } from "../../src/model/GameModel";
import { GameResource } from "../../src/Resources";
import { Types } from "mongoose";

describe("GameService Tests", () => {
    afterEach(async () => {
        await Game.deleteMany({});
    });

    test("Create Game with POIs", async () => {
        const gameData: GameResource = {
            title: "Berlin Sehenswürdigkeiten",
            beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Berlin",
            POIs: [
                {
                    type: "Point",
                    coordinates: [13.404954, 52.520008], // Brandenburger Tor
                },
                {
                    type: "Point",
                    coordinates: [13.377704, 52.516275], // Reichstag
                },
            ],
            poilId: [new Types.ObjectId().toString()],
            maxTeam: 5,
            userId: new Types.ObjectId().toString(),
        };

        const createdGame = await createGame(gameData);

        expect(createdGame).toBeTruthy();
        expect(createdGame.title).toBe(gameData.title);
        expect(createdGame.beschreibung).toBe(gameData.beschreibung);
        expect(createdGame.POIs).toHaveLength(2);

        expect(createdGame.POIs![0].coordinates).toEqual([13.404954, 52.520008]);
        expect(createdGame.POIs![1].coordinates).toEqual([13.377704, 52.516275]);
    });

    test("Create Game without POIs", async () => {
        const gameData: GameResource = {
            title: "Spiel ohne POIs",
            beschreibung: "Dieses Spiel hat keine POIs",
            poilId: [new Types.ObjectId().toString()],
            maxTeam: 3,
            userId: new Types.ObjectId().toString(),
        };

        const createdGame = await createGame(gameData);

        expect(createdGame).toBeTruthy();
        expect(createdGame.title).toBe(gameData.title);
        expect(createdGame.beschreibung).toBe(gameData.beschreibung);
        expect(createdGame.POIs).toEqual([]); // POIs sollte ein leeres Array sein
    });

    test("Get Game by ID", async () => {
        const game = await Game.create({
            title: "Berlin Sehenswürdigkeiten",
            beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Berlin",
            poilId: [new Types.ObjectId()],
            maxTeam: 5,
            userId: new Types.ObjectId(),
        });

        const foundGame = await getGameById(game._id.toString());

        expect(foundGame).toBeTruthy();
        expect(foundGame.title).toBe(game.title);
        expect(foundGame.beschreibung).toBe(game.beschreibung);
        expect(foundGame.poilId).toHaveLength(1);
        expect(foundGame.maxTeam).toBe(game.maxTeam);
        expect(foundGame.userId).toBe(game.userId.toString());
        expect(foundGame.POIs).toEqual([]); // Standardwert für POIs
    });

    test("Delete Game by ID", async () => {
        const game = await Game.create({
            title: "Testspiel",
            beschreibung: "Ein Testspiel für Löschung",
            poilId: [new Types.ObjectId()],
            maxTeam: 3,
            userId: new Types.ObjectId(),
        });

        const gameId = game._id.toString();

        await deleteGame(gameId);

        const deletedGame = await Game.findById(gameId);
        expect(deletedGame).toBeNull();
    });

    test("Get Game by non-existent ID", async () => {
        const invalidId = new Types.ObjectId().toString();

        await expect(getGameById(invalidId)).rejects.toThrow("Spiel nicht gefunden");
    });
});
