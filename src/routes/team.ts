import express, { Request, Response, NextFunction } from "express";
import * as TeamService from "../services/TeamService"
import * as PlayerService from "../services/PlayerService"
import {  Player } from "../model/PlayerModel";
import { TeamResource } from "src/Resources";
import { ITeam} from "src/model/TeamModel";
import { Team } from "../model/TeamModel";
import { generateQAcode } from "../utils/Qacodegenerate";


//TODO: mit ExpressValidator Input validieren


export const teamRouter = express.Router();


/**
 * Route für erstellen von team
 * 
 */
teamRouter.post("/", async (req, res, next) =>{
    //console.log("name nickName.......",req.body);
    const nameofTeam = req.body.nameOfTeam;

    try{
      let newTeam
        if(req.body.codeInvite){
          newTeam = await TeamService.createTeam(req.body, nameofTeam, req.body.codeInvite)
        } else {
          newTeam = await TeamService.createTeam(req.body, nameofTeam)
        }
        res.status(201).send(newTeam)
        
    } catch (err){
        res.status(404)
        next(err)
    }
})

/**
 * Route für das entfernen von Teams
 */
teamRouter.delete("/:id", async (req, res, next) => {
    let id = "";
    if(req.params){
        id = req.params.id
    }

    try{
        await TeamService.deleteTeam(id)
        res.status(204).send()
    } catch (err){
        res.status(404)
        next(err)
    }
})


teamRouter.get("/team/:id", async (req,res, next)=>{
  try {
    const teamId = req.params.id;
    const pois = await TeamService.getTeam(teamId);
    res.status(200).send(pois); 
} catch (err) {
    res.status(500); 
    next(err);
}
})


/**
 * Route update Team
 */
teamRouter.put("/:id", async (req, res, next) => {
    try {
        const teamId = req.params.id;
        const {playerID, action} = req.body;
        
        if(action === "remove"){
            const updatedPlayerInTeam = await TeamService.updateDeletePlayerInTeam(teamId, req.body);
            res.status(200).send(updatedPlayerInTeam); 

        }else{
            const updatedTeam = await TeamService.updateTeam(teamId, req.body); 
            res.status(200).send(updatedTeam);  
        }
         
    } catch (err) {
        res.status(404); 
        next(err); 
    }
});

/**
 * get Team by codeInvite
 */

teamRouter.get("/:codeInvite",async (req: Request<{ codeInvite: string }>, res: Response, next: NextFunction): Promise<void> => {
      const codeInvite = req.params.codeInvite;
  
      try {
        const teams: ITeam[] = await TeamService.getTeamsByQACode(codeInvite);
        //console.log(teams)
        const playerIDs = teams.flatMap(team => team.players).map(id => id.toString());
  
        // Hole alle Spieler-Daten auf einmal
        const playersData = await Player.find({ _id: { $in: playerIDs } }).select("nickName").lean();
  
        // Spieler-Daten in die Map einfügen
        const playerDataMap = new Map<string, { nickName: string; host:boolean }>();
        playersData.forEach(player => {
                playerDataMap.set(player._id.toString(), { nickName: player.nickName, host:player.host });
        });

          // Erzeuge das neue Team-Array mit den Spieler-Details
        const newTeams = teams.map(team => ({
          _id: team._id,
          name: team.name,
          players: team.players.map(playerId => {
            const playerData = playerDataMap.get(playerId.toString());
            return {
              id: playerId.toString(),
              nickName: playerData ? playerData.nickName : 'Unbekannter Spieler',
            };
          }),
          codeInvite: team.codeInvite,
          qaCode: team.qaCode,
          shareUrl:team.shareUrl,
        }));
  
        // Return the teams found
        res.status(200).json(newTeams);
      } catch (error) {
        console.error("Error fetching team data:", error);
        res.status(500).json({ message: "Error fetching team data." });
        next(error);  
      }
});