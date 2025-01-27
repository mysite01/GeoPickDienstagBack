import supertest from "supertest";
import app from "../../src/app";

import * as TeamService from "../../src/services/TeamService"
import * as PlayerService from "../../src/services/PlayerService"
import { TeamResource } from "src/Resources";

test ("Test post Team, korrekte eingaben", async()=>{
    const newPlayer = await PlayerService.createPlayer({nickName: "Thomas", host: false, teamId:"1234"})
    const playerID: string = newPlayer.id!
    const newTeamResource: TeamResource = {
        name: "Team 1",
        playersID: [playerID],
        poiId:["12132"],
        codeInvite:"SCD234",
    }
    const testee = supertest(app)
    const response = await testee.post(`/api/team/`).send(newTeamResource)
    expect(response.statusCode).toBe(404)
})

test ("Delete Team Test", async()=>{
    const newPlayer = await PlayerService.createPlayer({nickName: "Thomas", host: true, teamId:"1234"})
    const playerID: string = newPlayer.id!
    const newTeamResource: TeamResource = {
        name: "Team 1",
        playersID: [playerID],
        poiId:["12132"],
        codeInvite:"SCD234",
    }
    const newTeam = await TeamService.createTeam(newTeamResource, newTeamResource.name)

    const testee = supertest(app)

    const response = await testee.delete(`/api/team/${newTeam.id}`).send()
    expect(response.statusCode).toBe(204)
})

test("Get Players in Team test", async()=>{
    const newPlayer = await PlayerService.createPlayer({nickName: "Thomas", host: true,teamId:"1234"})
    const playerID: string = newPlayer.id!
    const newTeamResource: TeamResource = {
        name: "Team 1",
        playersID: [playerID],
        poiId:["12132"],
        codeInvite:"SCD234",
    }
    const newTeam = await TeamService.createTeam(newTeamResource, newTeamResource.name)

    const testee = supertest(app)

    const response = await testee.get(`/api/team/${newTeam.id}`).send()
    expect(response.statusCode).toBe(404)
})