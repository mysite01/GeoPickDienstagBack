import { createPOI, deletePOI, getPOIById, getAllPOIs } from "../../src/services/POIService";
import { POI } from "../../src/model/POIModel";
import mongoose from "mongoose";

// Test-Daten
const testPOIData = {
    name: "Brandenburger Tor",
    lat: 52.516339860850195,
    long: 13.377661181403282,
    beschreibung: "Historisches Wahrzeichen in Berlin",
    punkte: 50
};

// Test für createPOI
test("sollte einen neuen POI erfolgreich erstellen", async () => {
    const createdPOI = await createPOI(testPOIData);

    expect(createdPOI).toBeDefined();
    expect(createdPOI.name).toBe(testPOIData.name);
    expect(createdPOI.lat).toBe(testPOIData.lat);
    expect(createdPOI.long).toBe(testPOIData.long);
    expect(createdPOI.beschreibung).toBe(testPOIData.beschreibung);
    expect(createdPOI.punkte).toBe(testPOIData.punkte);
});

// Test für deletePOI
test("sollte einen POI erfolgreich löschen", async () => {
    const poi = new POI(testPOIData);
    const savedPOI = await poi.save();

    await deletePOI(savedPOI._id.toString());

    const foundPOI = await POI.findById(savedPOI._id).exec();
    expect(foundPOI).toBeNull();
});

// Test für getPOIById
test("sollte einen POI anhand der ID erfolgreich abrufen", async () => {
    const poi = new POI(testPOIData);
    const savedPOI = await poi.save();

    const foundPOI = await getPOIById(savedPOI._id.toString());

    expect(foundPOI).toBeDefined();
    expect(foundPOI.name).toBe(testPOIData.name);
    expect(foundPOI.lat).toBe(testPOIData.lat);
    expect(foundPOI.long).toBe(testPOIData.long);
    expect(foundPOI.beschreibung).toBe(testPOIData.beschreibung);
    expect(foundPOI.punkte).toBe(testPOIData.punkte);
});

// Test für getAllPOIs
test("sollte alle POIs erfolgreich abrufen", async () => {
    await POI.deleteMany({}); 

    const poi1 = new POI({ ...testPOIData, name: "POI 1" });
    const poi2 = new POI({ ...testPOIData, name: "POI 2" });

    await poi1.save();
    await poi2.save();

    const allPOIs = await getAllPOIs();

    expect(allPOIs).toBeDefined();
    expect(allPOIs.length).toBe(2);
    expect(allPOIs[0].name).toBe("POI 1");
    expect(allPOIs[1].name).toBe("POI 2");
});

// Fehlerfall-Test für deletePOI
test("sollte Fehler werfen wenn der POI beim Löschen nicht gefunden wird", async () => {
    const nonExistentId = "012345678901234567890123";
    await expect(deletePOI(nonExistentId)).rejects.toThrow(`POI mit der ID ${nonExistentId} konnte nicht gelöscht werden.`);
});

// Fehlerfall-Test für getPOIById
test("sollte Fehler werfen wenn der POI beim Abrufen nicht gefunden wird", async () => {
    const nonExistentId = "012345678901234567890123";
    await expect(getPOIById(nonExistentId)).rejects.toThrow(`POI mit der ID ${nonExistentId} wurde nicht gefunden.`);
});