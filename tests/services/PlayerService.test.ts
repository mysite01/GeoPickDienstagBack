import { Player } from "../../src/model/PlayerModel"
import { getAllPlayers, getPlayer, createPlayer, deletePlayer } from "../../src/services/PlayerService"

beforeEach(async () => {
    // Leere die Player Collection vor jedem Test
    await Player.deleteMany({});
});

test("getAllPlayers - Alle Spieler eines Spiels abrufen", async () => {
    // Erstelle zwei Spieler
    const player1 = await Player.create({ nickName: "Player1", host: false });
    const player2 = await Player.create({ nickName: "Player2", host: false });
    const players = await getAllPlayers();
    expect(players.length).toBe(2);
    expect(players[0].id).toBe(player1._id.toString());
    expect(players[1].id).toBe(player2._id.toString());
    expect(players[0].host).toBe(false);
});

test("getPlayer - Spieler mit bestimmter ID abrufen", async () => {
    const player = await Player.create({ nickName: "Player1", host: false });
    const fetchedPlayer = await getPlayer(player._id.toString());
    expect(fetchedPlayer.id).toBe(player._id.toString());
    expect(fetchedPlayer.nickName).toBe("Player1");
    expect(fetchedPlayer.host).toBe(false);
});


test("createPlayer - Spieler erstellen", async () => {
    const playerData = {
        nickName: "NewPlayer",
        host: true,
        createdAt: new Date().toISOString(),
        teamId:"1234",
    };
    const createdPlayer = await createPlayer(playerData);
    expect(createdPlayer.nickName).toBe("NewPlayer");
    expect(createdPlayer.host).toBe(true);
    expect(createdPlayer.createdAt).toBeDefined();
});

test("deletePlayer - Spieler löschen", async () => {
    const player = await Player.create({ nickName: "PlayerToDelete", host: true });
    await deletePlayer(player._id.toString());
    const deletedPlayer = await Player.findById(player._id);
    expect(deletedPlayer).toBeNull();
});

test("deletePlayer - Fehler bei nicht existierendem Spieler", async () => {
    const nonExistentId = "000000000000000000000000";
    await expect(deletePlayer(nonExistentId)).rejects.toThrow(`Couldnt delete Eintrag with id ${nonExistentId}`);
});
