import { Game } from "../../src/model/GameModel";
import { Team } from "../../src/model/TeamModel";
import * as GameInstanceService from "../../src/services/GameInstanceService";
import { GameInstanceResource } from "../../src/Resources";
import mongoose, { Types } from "mongoose";
import { GameInstance } from "../../src/model/GameInstanceModel";

test("sollte eine GameInstance erfolgreich erstellen und zurückgeben", async () => {
    const game = await Game.create({ title: "Test Game", POIs: [], playersID: [] });

    const team1 = await Team.create({ name: "Team A", players: [], gameInstances: [] });
    const team2 = await Team.create({ name: "Team B", players: [], gameInstances: [] });

    // Noch mit dem Team klären, ist von Mehmet
    const team1Id = (team1._id as Types.ObjectId).toString();
    const team2Id = (team2._id as Types.ObjectId).toString();

    const gameInstanceData: GameInstanceResource = {
        name: "Test Game Instance",
        status: 1, // läuft
        startTime: new Date("2023-01-01T10:00:00Z").toISOString(),
        endTime: new Date("2023-01-01T12:00:00Z").toISOString(),
        gameID: game._id.toString(),
        teamsID: [team1Id, team2Id]
    };

    const createdGameInstance = await GameInstanceService.createGameInstance(gameInstanceData);

    expect(createdGameInstance.id).toBeDefined();
    expect(createdGameInstance.name).toBe(gameInstanceData.name);
    expect(createdGameInstance.status).toBe(gameInstanceData.status);
    expect(createdGameInstance.startTime).toBe(gameInstanceData.startTime);
    expect(createdGameInstance.endTime).toBe(gameInstanceData.endTime);
    expect(createdGameInstance.gameID).toBe(game._id.toString());
    expect(createdGameInstance.teamsID.length).toBe(2);
    expect(createdGameInstance.teamsID[0]).toBe(team1Id);
    expect(createdGameInstance.teamsID[1]).toBe(team2Id);
});

test("sollte den Status einer GameInstance erfolgreich aktualisieren", async () => {
    const game = await Game.create({ title: "Test Game", POIs: [], playersID: [] });

    const team1 = await Team.create({ name: "Team A", players: [], gameInstances: [] });
    const team2 = await Team.create({ name: "Team B", players: [], gameInstances: [] });

    const gameInstance = await GameInstance.create({
        name: "Test Game Instance",
        status: 0, // Lobby
        startTime: new Date("2023-01-01T10:00:00Z"),
        endTime: new Date("2023-01-01T12:00:00Z"),
        game: game._id,
        teams: [team1._id, team2._id]
    });

    const newStatus = 1; // Läuft
    const updatedGameInstance = await GameInstanceService.updateGameInstanceStatus(gameInstance._id.toString(), newStatus);

    expect(updatedGameInstance.id).toBe(gameInstance._id.toString());
    expect(updatedGameInstance.name).toBe(gameInstance.name);
    expect(updatedGameInstance.status).toBe(newStatus);
    expect(updatedGameInstance.startTime).toBe(gameInstance.startTime.toISOString());
    expect(updatedGameInstance.endTime).toBe(gameInstance.endTime.toISOString());
    expect(updatedGameInstance.gameID).toBe(game._id.toString());
    expect(updatedGameInstance.teamsID.length).toBe(2);
    expect(updatedGameInstance.teamsID[0]).toBe((team1._id as Types.ObjectId).toString());
    expect(updatedGameInstance.teamsID[1]).toBe((team2._id as Types.ObjectId).toString());
});

test("sollte eine GameInstance anhand der ID erfolgreich abrufen", async () => {
    const game = await Game.create({ title: "Test Game", POIs: [], playersID: [] });

    const team1 = await Team.create({ name: "Team A", players: [], gameInstances: [] });
    const team2 = await Team.create({ name: "Team B", players: [], gameInstances: [] });

    const gameInstance = await GameInstance.create({
        name: "Test Game Instance",
        status: 0, // Lobby
        startTime: new Date("2023-01-01T10:00:00Z"),
        endTime: new Date("2023-01-01T12:00:00Z"),
        game: game._id,
        teams: [team1._id, team2._id]
    });

    const fetchedGameInstance = await GameInstanceService.getGameInstanceById(gameInstance._id.toString());

    expect(fetchedGameInstance.id).toBe(gameInstance._id.toString());
    expect(fetchedGameInstance.name).toBe(gameInstance.name);
    expect(fetchedGameInstance.status).toBe(gameInstance.status);
    expect(fetchedGameInstance.startTime).toBe(gameInstance.startTime.toISOString());
    expect(fetchedGameInstance.endTime).toBe(gameInstance.endTime.toISOString());
    expect(fetchedGameInstance.gameID).toBe(game._id.toString());
    expect(fetchedGameInstance.teamsID.length).toBe(2);
    expect(fetchedGameInstance.teamsID[0]).toBe((team1._id as Types.ObjectId).toString());
    expect(fetchedGameInstance.teamsID[1]).toBe((team2._id as Types.ObjectId).toString());
});

test("sollte eine GameInstance erfolgreich löschen", async () => {
    const game = await Game.create({ title: "Test Game", POIs: [], playersID: [] });

    const team1 = await Team.create({ name: "Team A", players: [] });
    const team2 = await Team.create({ name: "Team B", players: [] });

    const gameInstance = await GameInstance.create({
        name: "Test Game Instance",
        status: 1, // Läuft
        startTime: new Date("2023-01-01T10:00:00Z"),
        endTime: new Date("2023-01-01T12:00:00Z"),
        game: game._id,
        teams: [team1._id, team2._id]
    });

    await expect(GameInstanceService.deleteGameInstance(gameInstance._id.toString())).resolves.not.toThrow();

    const deletedGameInstance = await GameInstance.findById(gameInstance._id).exec();
    expect(deletedGameInstance).toBeNull();
});

test("sollte einen Fehler werfen, wenn die GameInstance nicht existiert", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    await expect(GameInstanceService.deleteGameInstance(nonExistentId)).rejects
        .toThrow(`GameInstance mit der ID ${nonExistentId} konnte nicht gelöscht werden.`);
});