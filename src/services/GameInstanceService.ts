import { GameInstance } from "../model/GameInstanceModel";
import { GameInstanceResource } from "../Resources";
import { Types } from "mongoose";

/**
 * Erstellt eine neue GameInstance.
 */
export async function createGameInstance(data: GameInstanceResource): Promise<GameInstanceResource> {
    const gameInstance = new GameInstance({
        name: data.name,
        status: "0",
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        game: new Types.ObjectId(data.gameID),
        teams: data.teamsID.map(id => new Types.ObjectId(id))
    });

    const savedGameInstance = await gameInstance.save();
    
    return {
        id: savedGameInstance._id.toString(),
        name: savedGameInstance.name,
        status: savedGameInstance.status,
        startTime: savedGameInstance.startTime.toISOString(),
        endTime: savedGameInstance.endTime.toISOString(),
        gameID: savedGameInstance.game.toString(),
        teamsID: savedGameInstance.teams.map(team => team.toString())
    };
}

/**
 * Aktualisiert den Status einer GameInstance.
 */
export async function updateGameInstanceStatus(id: string, status: number): Promise<GameInstanceResource> {
    const updatedGameInstance = await GameInstance.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    ).exec();

    if (!updatedGameInstance) {
        throw new Error(`GameInstance mit der ID ${id} konnte nicht aktualisiert werden.`);
    }

    return {
        id: updatedGameInstance._id.toString(),
        name: updatedGameInstance.name,
        status: updatedGameInstance.status,
        startTime: updatedGameInstance.startTime.toISOString(),
        endTime: updatedGameInstance.endTime.toISOString(),
        gameID: updatedGameInstance.game.toString(),
        teamsID: updatedGameInstance.teams.map(team => team.toString())
    };
}

/**
 * Findet eine GameInstance anhand der ID.
 */
export async function getGameInstanceById(id: string): Promise<GameInstanceResource> {
    const gameInstance = await GameInstance.findById(id).exec();
    if (!gameInstance) {
        throw new Error(`GameInstance mit der ID ${id} wurde nicht gefunden.`);
    }

    return {
        id: gameInstance._id.toString(),
        name: gameInstance.name,
        status: gameInstance.status,
        startTime: gameInstance.startTime.toISOString(),
        endTime: gameInstance.endTime.toISOString(),
        gameID: gameInstance.game.toString(),
        teamsID: gameInstance.teams.map(team => team.toString())
    };
}

/**
 * Löscht eine GameInstance anhand der ID.
 */
export async function deleteGameInstance(id: string): Promise<void> {
    const result = await GameInstance.findByIdAndDelete(id).exec();
    if (!result) {
        throw new Error(`GameInstance mit der ID ${id} konnte nicht gelöscht werden.`);
    }
}


