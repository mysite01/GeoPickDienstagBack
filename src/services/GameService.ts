import mongoose, { Types } from "mongoose";
import { Game, IGame } from "../model/GameModel";
import { GameResource } from "src/Resources";

/**
 * Erstellt ein neues Spiel
 */
export async function createGame(gameResource: GameResource): Promise<GameResource> {
    try {
        const game = new Game({
            title: gameResource.title,
            beschreibung: gameResource.beschreibung,
            poilId: gameResource.poilId?.map((id) => new mongoose.Types.ObjectId(id)),
            maxTeam: gameResource.maxTeam,
            userId: new mongoose.Types.ObjectId(gameResource.userId),
            POIs: gameResource.POIs || [],
        });

        const savedGame = await game.save();

        return {
            id: savedGame._id.toString(),
            title: savedGame.title,
            beschreibung: savedGame.beschreibung,
            poilId: savedGame.poilId?.map((id) => id.toString()),
            maxTeam: savedGame.maxTeam,
            userId: savedGame.userId.toString(),
            POIs: gameResource.POIs || [],
        };
    } catch (error: any) {
        throw new Error(`Fehler beim Erstellen des Spiels: ${error.message}`);
    }
}

/**
 * Löscht ein Spiel anhand der ID
 */
export async function deleteGame(id: string): Promise<boolean> {
    const result = await Game.findByIdAndDelete(id);
    return result !== null; // Gibt `true` zurück, wenn ein Spiel gelöscht wurde, `false`, wenn kein Spiel gefunden wurde
}

/**
 * Holt ein Spiel anhand der ID
 */
export async function getGameById(gameId: string): Promise<GameResource> {
    try {
        const game = await Game.findById(gameId).exec();
        
        if (!game) {
            throw new Error("Spiel nicht gefunden"); // Diese Fehlermeldung wird erwartet
        }

        return {
            id: game._id.toString(),
            title: game.title,
            beschreibung: game.beschreibung || "",
            poilId: game.poilId?.map((id) => id.toString()),
            maxTeam: game.maxTeam,
            userId: game.userId.toString(),
            POIs: [], // Standardwert für POIs
        };
    } catch (error) {
        throw new Error("Spiel nicht gefunden"); // Einheitliche Fehlermeldung
    }
}

/**
 * Holt ein Beispiel Spiel 
 */
export async function getGame(): Promise<GameResource> {
    try {
        const game = await Game.findOne().exec();
        if (!game) {
            throw new Error("Spiel nicht gefunden"); // Diese Fehlermeldung wird erwartet
        }

        return {
            id: game._id.toString(),
            title: game.title,
            beschreibung: game.beschreibung || "",
            poilId: game.poilId?.map((id) => id.toString()),
            maxTeam: game.maxTeam,
            userId: game.userId.toString(),
            POIs: [], // Standardwert für POIs
        };
    } catch (error) {
        throw new Error("Spiel nicht gefunden"); // Einheitliche Fehlermeldung
    }
}
