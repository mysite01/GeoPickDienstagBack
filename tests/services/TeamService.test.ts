import { createTeam, deleteTeam, getPlayerInTeam } from "../../src/services/TeamService";
import { Team } from '../../src/model/TeamModel';
import { TeamResource } from "src/Resources";
import { Types } from "mongoose"; 

test('CreateTeam with multiple players', async () => {
    const teamData: TeamResource = {
        name: "Team Alpha",
        playersID: [new Types.ObjectId().toString(), new Types.ObjectId().toString(), new Types.ObjectId().toString()],
        poiId:["12132"],
        codeInvite:"SCD234",
    };

    const createdTeam = await createTeam(teamData,teamData.name);

    expect(createdTeam).toBeTruthy();
    expect(createdTeam.name).toBe(teamData.name);
    expect(createdTeam.playersID).toHaveLength(3);
    expect(createdTeam.playersID).toEqual(expect.arrayContaining(teamData.playersID));
});

test('deleteTeam by ID', async () => {
    const team = await Team.create({
        name: "Team zum Löschen",
        players: [new Types.ObjectId()],
        poiId:[new Types.ObjectId()],
        codeInvite:"SCD234",
    });

    expect(team).toBeTruthy();
    const teamId = (team._id as Types.ObjectId).toString(); // Typ-Casting auf Types.ObjectId und zu String konvertieren

    await deleteTeam(teamId);
    const deletedTeam = await Team.findById(teamId).exec();
    expect(deletedTeam).toBeNull();
});

test('Get players in team by ID', async () => {
    const teamData: TeamResource = {
        name: "Team Bravo",
        playersID: [new Types.ObjectId().toString(), new Types.ObjectId().toString()],
        poiId:["12132"],
        codeInvite:"SCD234",
    };
    
    const createdTeam = await createTeam(teamData,teamData.name);
    const fetchedPlayers = await getPlayerInTeam(createdTeam.id!);

    expect(fetchedPlayers).toHaveLength(2);
    expect(fetchedPlayers).toEqual(expect.arrayContaining(teamData.playersID));
});