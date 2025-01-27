import express from "express";
import * as GameService from "../services/GameService";

export const gameRouter = express.Router();

/**
 * Route zum Erstellen eines neuen Spiels
 */
gameRouter.post("/", async (req, res, next) => {
    try {
        const newGame = await GameService.createGame(req.body);
        res.status(201).send(newGame);
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Erstellen des Spiels" });
        next(err);
    }
});

/**
 * Route zum Löschen eines Spiels anhand der ID
 */
gameRouter.delete("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
        const wasDeleted = await GameService.deleteGame(id);
        if (!wasDeleted) {
            res.status(404).json({ message: "Spiel nicht gefunden" });
            return;
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Löschen des Spiels" });
        next(err);
    }
});

/**
 * Route zum Abrufen eines Spiels anhand der ID
 */
gameRouter.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
        const game = await GameService.getGameById(id);
        if (!game) {
            res.status(404).json({ message: "Spiel nicht gefunden" });
            return;
        }
        res.status(200).send(game);
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Abrufen des Spiels" });
        next(err);
    }
});

/**
 * Route zum Abrufen eines Beispiel Spiels
 */
gameRouter.get("/", async (req, res, next) => {
    try {
        const game = await GameService.getGame();
        if (!game) {
            res.status(404).json({ message: "Spiel nicht gefunden" });
            return;
        }
        res.status(200).send(game);
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Abrufen des Spiels" });
        next(err);
    }
});

/**
 * Route zum Abrufen aller POIs eines Spiels anhand der GameId
 */
gameRouter.get("/pois/:id", async (req, res, next) => {
    const { id } = req.params; 

    try {
        let game = await GameService.getGame(); //Beispielgame (später anpassen)
        const poilist = game.poilId;
        if (!game) {
            res.status(404).json({ message: "Spiel nicht gefunden" });
            return;
        }
        if(!poilist){
            res.status(404).json({ message: "keine POIs in Game" })
        }
        res.status(200).send(poilist);
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Abrufen des Spiels" });
        next(err);
    }
});