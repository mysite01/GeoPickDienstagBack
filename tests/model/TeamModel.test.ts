import { Team } from '../../src/model/TeamModel';
import { Player } from '../../src/model/PlayerModel';


test("Create Team with multiple Players (Mocked)", () => {
    const player1 = { _id: "player1", nickName: "Player 1" };
    const player2 = { _id: "player2", nickName: "Player 2" };

    const team = {
        name: "Team A",
        players: [player1, player2]
    };

    expect(team).toBeTruthy();
    expect(team.name).toBe("Team A");

    expect(team.players).toBeDefined();
    expect(team.players).toHaveLength(2);

    expect(team.players[0]._id).toBe("player1");
    expect(team.players[0].nickName).toBe("Player 1");

    expect(team.players[1]._id).toBe("player2");
    expect(team.players[1].nickName).toBe("Player 2");
});
