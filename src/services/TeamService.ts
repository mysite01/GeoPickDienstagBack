import mongoose, { Types } from 'mongoose';
import { Team, ITeam } from '../model/TeamModel';
import { TeamResource } from 'src/Resources';
import { IPlayer, Player } from '../model/PlayerModel';
import { generateQAcode } from '../utils/Qacodegenerate';
import { ObjectId } from "mongodb";
/**
 * Erstellt ein neues Team
 */
export async function createTeam(teamResource: TeamResource, nameOfTeam: string, codeInvite?: string): Promise<TeamResource> {
    try {

        let uniqueCode: string = "";
        let qrCodeDataUrl: string = "";
        let shareUrl: string = "";

        if (codeInvite) {
            const existingTeam = await Team.findOne({codeInvite: codeInvite})
            if(existingTeam){
                qrCodeDataUrl = existingTeam.qaCode
                shareUrl = existingTeam.shareUrl || '';
                uniqueCode = codeInvite;
            }
        } else {
            // Generiere neuen Einladungscode und QR-Code
            const qaCode = await generateQAcode();
            if (typeof qaCode === 'object' && qaCode !== null  ) {
                uniqueCode = qaCode.uniqueCode;
                qrCodeDataUrl = qaCode.qrCodeDataUrl;
                shareUrl = qaCode.shareUrl;
            } else {
                throw new Error("Ungültige Antwort von generateQAcode");
            }
        }

        // Erstelle ein neues Team-Dokument
        const team = new Team({
            name: nameOfTeam,
            players: teamResource.playersID.map(playerId => new Types.ObjectId(playerId)),
            codeInvite: uniqueCode,
            qaCode: qrCodeDataUrl,
            shareUrl: shareUrl,
        });

        // Speichere das Team in der Datenbank
        const savedTeam = await team.save() as ITeam & { _id: Types.ObjectId };

        // Gib das gespeicherte Team als Antwort zurück
        return {
            id: savedTeam.id.toString(),
            name: savedTeam.name,
            poiId: savedTeam.poiId.map(poiId => poiId.toString()),
            poiPoints: team.poiPoints,
            playersID: savedTeam.players.map(playerId => playerId.toString()),
            codeInvite: savedTeam.codeInvite,
            qaCode: savedTeam.qaCode,
            shareUrl: savedTeam.shareUrl,
        };
    } catch (error) {
        console.error("Fehler beim Erstellen des Teams:", error);
        throw new Error("Fehler beim Erstellen des Teams");
    }
}

/**
 * Löscht ein Team anhand der ID
 */
export async function deleteTeam(id: string): Promise<void> {
    const query = await Team.findByIdAndDelete(id).exec();
    if (!query) {
        throw new Error("Das Team konnte nicht gelöscht werden!");
    }
}
/**
 * Holt alle Spieler in einem Team anhand der Team-ID
 */
export async function getPlayerInTeam(teamId: string): Promise<string[]> {
    try {
        const team = await Team.findById(teamId).exec();
        if (!team) {
            throw new Error("Team nicht gefunden"); // Erwartete Fehlermeldung
        }
        return team.players.map(playerId => playerId.toString());
    } catch (error) {
        throw new Error("Fehler beim Abrufen der Spieler im Team");
    }
}


/**
 * update Teamplayers anhand der Team-ID
 */

export async function updateTeam(teamId: string, updatedData: any): Promise<any> {
    try {
       
        const team = await Team.findById(teamId).exec();

        if (!team) {
            throw new Error("Team nicht gefunden");
        }

        const uniquePlayers = Array.from(new Set([...team.players, ...updatedData.players]));
        
        team.players = uniquePlayers;
        const updatedTeam = await team.save();
        
        return updatedTeam;

    } catch (error) {
        throw new Error("Fehler beim Update der Spieler im Team");
    }
}

/**
 * Update POIs in a team based on the team ID
 */
export async function updateTeamPOIs(teamId: string, updatedPOIs: { poiId: string[] }): Promise<any> {
    try {
        const team = await Team.findById(teamId).exec();

        if (!team) {
            throw new Error("Team nicht gefunden");
        }

        // Convert current and updated POIs to strings for comparison
        const currentPOIs = team.poiId.map(poi => poi.toString());
        const updatedPOIsIds = updatedPOIs.poiId.map(poi => new ObjectId(poi).toString());

        // Merge and deduplicate by string representation
        const uniquePOIs = Array.from(new Set([...currentPOIs, ...updatedPOIsIds]));

        // Convert back to ObjectId for MongoDB
        team.poiId = uniquePOIs.map(poi => new ObjectId(poi));

        const updatedTeam = await team.save();

        return updatedTeam;
    } catch (error) {
        throw new Error(`Fehler beim Update der POIs im Team: ${error}`);
    }
}

export async function updateTeamPoiPoints(
    teamId: string,
    updatedPoiPoints: { poiPoints: number[] }
): Promise<any> {
    try {
        const team = await Team.findById(teamId).exec();

        if (!team) {
            throw new Error("Team nicht gefunden");
        }

        const updatedPoiPointsArray = updatedPoiPoints.poiPoints; 

        team.poiPoints = updatedPoiPointsArray;

        const updatedTeam = await team.save();

        return updatedTeam;
    } catch (error) { 
        throw new Error(`Fehler beim Update der POI-Punkte im Team`); 
    }
}





export async function updateDeletePlayerInTeam(teamId: string, updatedData: { playerID: string, action: string }): Promise<any> {
    try {
        const team = await Team.findById(teamId).exec();

        if (!team) {
            throw new Error("Team nicht gefunden");
        }

        // Check action type
        if (updatedData.action === "remove") {
            team.players = team.players.filter(id => id.toString() !== updatedData.playerID);
        
        } else if (updatedData.action === "add") {
            if (!team.players.some(id => id.toString() === updatedData.playerID)) {
                team.players.push(new mongoose.Types.ObjectId(updatedData.playerID)); // Ensure it's stored as ObjectId
            }
        } else {
            throw new Error("Ungültige Aktion");
        }

        const updatedTeam = await team.save();

        return updatedTeam;

    } catch (error) {
        throw new Error("Fehler beim Aktualisieren der Spieler im Team");
    }
}


export async function getTeamsByQACode(codeInvite: string): Promise<any[]> {
    try {
        const teams = await Team.find({ codeInvite: codeInvite });
        return teams;
        
    } catch (error) {
        console.error("Error in getTeamsByQACode:", error);
        throw error;
    }
}


export async function getTeam(id: string): Promise<TeamResource> {
    const team = await Team.findById(id).exec();
    if (!team) {
        throw new Error(`Team mit der ID ${id} wurde nicht gefunden.`);
    }
    return {
        id: team.id.toString(),
        name: team.name,
        poiId: team.poiId.map(poiId => poiId.toString()),
        poiPoints: team.poiPoints,
        playersID: team.players.map(playerId => playerId.toString()),
        codeInvite: team.codeInvite,
        qaCode: team.qaCode,
        shareUrl: team.shareUrl,
    };
}

export async function getTeamByPlayerId(id: string): Promise<TeamResource> {

    const objectId = new mongoose.Types.ObjectId(id);

    const team = await Team.findOne({ players: objectId }).exec();
    if (!team) {
      throw new Error(`Team für den Spieler mit der ID ${id} wurde nicht gefunden.`);
    }

    return {
        id: team.id.toString(),
        name: team.name,
        poiId: team.poiId.map(poiId => poiId.toString()),
        poiPoints: team.poiPoints,
        playersID: team.players.map(playerId => playerId.toString()),
        codeInvite: team.codeInvite,
        qaCode: team.qaCode,
        shareUrl: team.shareUrl,
    };
}
