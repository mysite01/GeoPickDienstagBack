import request from "supertest";
import app from "../../src/app"; // Dein Express-Server
import { POI } from "../../src/model/POIModel";

// Testdaten für die Erstellung eines POI
const poiData = {
  name: "Brandenburger Tor",
  lat: 52.516339,
  long: 13.377661,
  beschreibung: "Ein historisches Wahrzeichen Berlins",
  punkte: 10,
};

test("POST /api/poi - sollte einen neuen POI erstellen", async () => {
    const response = await request(app).post("/api/poi").send(poiData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(poiData.name);
    expect(response.body.lat).toBe(poiData.lat);
    expect(response.body.long).toBe(poiData.long);
    expect(response.body.beschreibung).toBe(poiData.beschreibung);
    expect(response.body.punkte).toBe(poiData.punkte);
});

test("GET /api/poi/:id - sollte einen POI nach ID abrufen", async () => {
    const poi = await POI.create(poiData);
    const response = await request(app).get(`/api/poi/${poi._id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(poiData.name);
    expect(response.body.lat).toBe(poiData.lat);
    expect(response.body.long).toBe(poiData.long);
    expect(response.body.beschreibung).toBe(poiData.beschreibung);
    expect(response.body.punkte).toBe(poiData.punkte);
  });

  test("DELETE /api/poi/:id - sollte einen POI nach ID löschen", async () => {
    const poi = await POI.create(poiData);
    const response = await request(app).delete(`/api/poi/${poi._id}`);

    expect(response.status).toBe(204);

    const deletedPOI = await POI.findById(poi._id);
    expect(deletedPOI).toBeNull();
  });

  test("GET /api/poi - sollte alle POIs abrufen", async () => {
    await POI.create(poiData);
    const response = await request(app).get("/api/poi");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe(poiData.name);
  });