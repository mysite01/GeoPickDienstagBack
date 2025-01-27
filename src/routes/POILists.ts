import express from "express";
import * as POIListService from "../services/POILists.Service";

export const poiListRouter = express.Router();

/**
 * Route zum Erstellen einer neuen POI-Liste
 */
poiListRouter.post("/", async (req, res, next) => {
    try {
        const { name, poilIds } = req.body;
        const poiList = await POIListService.createPOIList(name, poilIds || []);
        res.status(201).send(poiList);
    } catch (err) {
        res.status(400).json({ message: "Fehler beim Erstellen der POI-Liste" });
        next(err);
    }
});

/**
 * Route zum Abrufen einer POI-Liste anhand der ID
 */
poiListRouter.get("/:id", async (req, res, next) => {
    try {   
        const poilist = await POIListService.getPOIListById(req.params.id);
        if (!poilist) {
            res.status(404).json({ message: "POI-Liste nicht gefunden" });
            return;
        }
        res.status(200).send(poilist);
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Abrufen der POI-Liste" });
        next(err);
    }
});


/**
 * Route zum Löschen einer POI-Liste
 */
poiListRouter.delete("/:id", async (req, res, next) => {
    try {
        const wasDeleted = await POIListService.deletePOIList(req.params.id);
        if (!wasDeleted) {
            res.status(404).json({ message: "POI-Liste nicht gefunden" });
            return;
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Löschen der POI-Liste" });
        next(err);
    }
});
