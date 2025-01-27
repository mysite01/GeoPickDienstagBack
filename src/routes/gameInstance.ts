import express from "express";
import { createGameInstance, deleteGameInstance, getGameInstanceById } from "../services/GameInstanceService";


export const gameInstanceRouter = express.Router();

/**
 * Route zum Erstellen einer neuen GameInstance.
 */
gameInstanceRouter.post("/", async (req, res, next) => {
    try {
        const newGameInstance = await createGameInstance(req.body);
        res.status(201).send(newGameInstance);
    } catch (err) {
        res.status(400); 
        next(err);
    }
});

/**
 * Route zum Abrufen einer GameInstance anhand der ID.
 */
gameInstanceRouter.get("/:id", async (req, res, next) => {
    try {
        const gameInstanceId = req.params.id; 
        const gameInstance = await getGameInstanceById(gameInstanceId);
        res.status(200).json(gameInstance);
    } catch (error) {
        res.status(404).json({ error: `GameInstance mit der ID ${req.params.id} wurde nicht gefunden.` });
        next(error);
    }
});

/**
 * Route zum Aktualisieren des Status einer GameInstance.
 */
gameInstanceRouter.patch("/:id/status", async (req, res, next) => {
    throw new Error("not implemented yet");
});

/**
 * Route zum Löschen einer GameInstance anhand der ID.
 */
gameInstanceRouter.delete("/:id", async (req, res, next) => {
    try {
        const gameInstanceId = req.params.id;
        await deleteGameInstance(gameInstanceId);
        res.status(200).json({ message: "GameInstance wurde erfolgreich gelöscht!" });
    } catch (error) {
        res.status(404).json({ error: `GameInstance mit der ID ${req.params.id} konnte nicht gelöscht werden.` });
        next(error);
    }
});


/**
 * Route zum Abrufen aller GameInstances eines bestimmten Spiels.
 */
gameInstanceRouter.get("/game/:gameId", async (req, res, next) => {
    throw new Error("not implemented yet");
});

export default gameInstanceRouter;