import { POIListResource } from "src/Resources";
import { POIList, IPOIList } from "../model/POIListsModel";
import { Types } from "mongoose";

/**
 * Erstellt eine neue POI-Liste
 */
export async function createPOIList(name: string, poilIds: string[]): Promise<IPOIList> {
    const poiList = new POIList({
        name,
        poilId: poilIds.map((id) => new Types.ObjectId(id)),
    });

    return await poiList.save();
}

/**
 * Holt eine POI-Liste anhand der ID
 */
export async function getPOIListById(id: string): Promise<POIListResource | null> {
    try {
        const poilist = await POIList.findById(id).exec();
        if (!poilist) return null;

        return {
            id: poilist._id.toString(),
            name: poilist.name,
            poilId: poilist.poilId.map((id) => id.toString()),
        };
    } catch (error) {
        console.error("Fehler im Service: ", error); // Debugging
        throw new Error("Fehler beim Abrufen der POI-Liste");
    }
}

/**
 * Löscht eine POI-Liste anhand der ID
 */
export async function deletePOIList(id: string): Promise<boolean> {
    const result = await POIList.findByIdAndDelete(id);
    return result !== null; // Gibt `true` zurück, wenn die POI-Liste gelöscht wurde
}
