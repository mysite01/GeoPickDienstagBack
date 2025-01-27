import express, {Request} from "express";
import * as PlayerService from "../services/PlayerService"
import { PlayerResource } from "src/Resources";
import * as TeamService from "../services/TeamService"

//TODO: mit ExpressValidator Input validieren


export const playerRouter = express.Router();

/**
 * Route für erstellen von Player
 * 
 */
playerRouter.post("/", async (req, res, next) =>{
    try{
        const newPlayer = await PlayerService.createPlayer(req.body)
        res.status(201).send(newPlayer)
    } catch (err){
        res.status(404)
        next(err)
    }
})

/**
 * Route für das Löschen von Player
 */
playerRouter.delete("/:id", async (req, res, next) =>{
    let id = "";
    if(req.params){
        id = req.params.id
    }

    try{
        await PlayerService.deletePlayer(id)
        res.status(204).send()
    } catch (err){
        res.status(404)
        next(err)
    }
})

/**
 * Route für das finden von einem Player
 */
playerRouter.get("/:id", async (req, res, next) =>{
    let id = "";
    if(req.params){
        id = req.params.id
    }

    try{
        const player = await PlayerService.getPlayer(id)
        res.status(200).send(player)
    } catch (err){
        res.status(404)
        next(err)
    }
})

/**
 * Route für update teamId in player
 */

playerRouter.put("/:id", async (req, res, next) => {
    try {
        const playerId = req.params.id;
        const {teamId, action} = req.body;

        if(action === "remove"){
            const updatedTeamIDInPlayer = await PlayerService.updateDeletePlayerInTeam(playerId, req.body);
            res.status(200).send(updatedTeamIDInPlayer);  

        }else{
            const updatedPlayer = await PlayerService.updatePlayer(playerId, req.body);
            res.status(200).send(updatedPlayer);  
        }
         
    } catch (err) {
        res.status(404); 
        next(err); 
    }
});

/**
 * Route für das finden von  Player by teamID 
 */
playerRouter.get("/team/:teamId", async (req, res, next) => {
    const teamId = req.params.teamId;
    try {
        const players = await PlayerService.getPlayersByTeam(teamId);
        res.status(200).json(players);
    } catch (err) {
        next(err);
    }
});
