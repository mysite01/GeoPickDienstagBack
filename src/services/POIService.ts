import { POI } from "../model/POIModel";
import { POIResource } from "../Resources";
import { Team } from "../model/TeamModel";

/*
 * Erstellt einen neuen POI
 */
export async function createPOI(poiData: POIResource): Promise<POIResource> {
    const poi = new POI({
        name: poiData.name,
        lat: poiData.lat,
        long: poiData.long,
        beschreibung: poiData.beschreibung,
        punkte: poiData.punkte,
    });

    const savedPOI = await poi.save();

    return {
        id: savedPOI._id.toString(),
        name: savedPOI.name,
        lat: savedPOI.lat,
        long: savedPOI.long,
        beschreibung: savedPOI.beschreibung,
        punkte: savedPOI.punkte,
    };
}

/**
 * Löscht einen POI anhand der ID
 */
export async function deletePOI(id: string): Promise<void> {
    const result = await POI.findByIdAndDelete(id).exec();
    if (!result) {
        throw new Error(`POI mit der ID ${id} konnte nicht gelöscht werden.`);
    }
}

export async function getPOIById(id: string): Promise<POIResource> {
    const poi = await POI.findById(id).exec();
    if (!poi) {
        throw new Error(`POI mit der ID ${id} wurde nicht gefunden.`);
    }
    return {
        id: poi._id.toString(),
        name: poi.name,
        lat: poi.lat,
        long: poi.long,
        beschreibung: poi.beschreibung,
        punkte: poi.punkte,
    };
}

//returns both poi and gives points based on first, second, etc.
export async function getPOIByIdandTeam(id: string, teamId: string): Promise<POIResource> {
    const poi = await POI.findById(id).exec();
    if (!poi) {
        throw new Error(`POI mit der ID ${id} wurde nicht gefunden.`);
    }
    const team = await Team.findById(teamId).exec();
    if(!team){
        throw new Error(`Team mit der ID ${teamId} wurde nicht gefunden.`);
    }
    const index = team.poiId.findIndex((objectId) => objectId.toString() === id);
    const poiPoints = poi.punkte;
    const numberOfClaim: number = team.poiPoints[index];
    const points = calculatePoints(poiPoints, numberOfClaim);
    return {
        id: poi._id.toString(),
        name: poi.name,
        lat: poi.lat,
        long: poi.long,
        beschreibung: poi.beschreibung,
        punkte: points,
    };
}

export async function getAllPOIs(): Promise<POIResource[]> {
    const pois = await POI.find().exec();
    return pois.map(poi => ({
        id: poi._id.toString(),
        name: poi.name,
        lat: poi.lat,
        long: poi.long,
        beschreibung: poi.beschreibung,
        punkte: poi.punkte,
    }));
}


function calculatePoints (poiPoints: number, numberOfClaim: number): number{
    if (numberOfClaim <= 1) {
        return poiPoints; // Full points for the first claim
    }

    const minPoints = poiPoints * 0.3; 
    const decayRate = 0.5;
    const adjustedPoints = poiPoints * Math.pow(decayRate, numberOfClaim - 1);

    return Math.max(adjustedPoints, minPoints);
}