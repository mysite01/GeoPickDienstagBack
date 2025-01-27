import { POI } from "../../src/model/POIModel";

test("sollte einen POI erfolgreich erstellen", async () => {
    const poiData = {
        name: "Brandenburger Tor",
        lat: 52.5163,
        long: 13.3777,
        beschreibung: "Historisches Wahrzeichen in Berlin",
        punkte: 10,
    };

    const poi = new POI(poiData);
    const savedPOI = await poi.save();

    expect(savedPOI._id).toBeDefined();
    expect(savedPOI.name).toBe(poiData.name);
    expect(savedPOI.lat).toBe(poiData.lat);
    expect(savedPOI.long).toBe(poiData.long);
    expect(savedPOI.beschreibung).toBe(poiData.beschreibung);
    expect(savedPOI.punkte).toBe(poiData.punkte);
});