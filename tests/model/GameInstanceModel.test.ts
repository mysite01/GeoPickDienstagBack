import { GameInstance } from "../../src/model/GameInstanceModel";
import { Game } from "../../src/model/GameModel";
import { Team } from "../../src/model/TeamModel";

test("GameInstance Model soll erfolgreich erstellt werden", async () => {
    const game = await Game.create({ title: "Test Game", POIs: [], playersID: [] });

    const team1 = await Team.create({ name: "Team A", players: [], gameInstances: [] });
    const team2 = await Team.create({ name: "Team B", players: [], gameInstances: [] });

    const gameInstanceData = {
        name: "Test Game Instance",
        status: 1, // läuft
        startTime: new Date("2023-01-01T10:00:00Z"),
        endTime: new Date("2023-01-01T12:00:00Z"),
        game: game,
        teams: [team1, team2]
    };

    const gameInstance = new GameInstance(gameInstanceData);
    const savedGameInstance = await gameInstance.save();

    expect(savedGameInstance._id).toBeDefined();
    expect(savedGameInstance.name).toBe(gameInstanceData.name);
    expect(savedGameInstance.status).toBe(gameInstanceData.status);
    expect(savedGameInstance.startTime).toEqual(gameInstanceData.startTime);
    expect(savedGameInstance.endTime).toEqual(gameInstanceData.endTime);
    expect(savedGameInstance.game).toEqual(gameInstanceData.game);
    expect(savedGameInstance.teams.length).toBe(2);
    expect(savedGameInstance.teams[0]).toEqual(gameInstanceData.teams[0]);
    expect(savedGameInstance.teams[1]).toEqual(gameInstanceData.teams[1]);
});