import supertest from "supertest";
import app from "../../src/app";
import { POIList } from "../../src/model/POIListsModel";
import { Types } from "mongoose";

describe("POIList API Routes", () => {
    const request = supertest(app);

    afterEach(async () => {
        await POIList.deleteMany({});
    });

    test("POST /api/poilist - Create POIList", async () => {
        const poilIds = [new Types.ObjectId().toString(), new Types.ObjectId().toString()];
        const newPOIList = { name: "Berlin POIs", poilIds };

        const response = await request.post("/api/poilist").send(newPOIList);

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newPOIList.name);
        expect(response.body.poilId).toHaveLength(poilIds.length);
    });

    test("GET /api/poilist/:id - Get POIList by ID", async () => {
        const poilIds = [new Types.ObjectId(), new Types.ObjectId()];
        const poiList = await POIList.create({ name: "Berlin POIs", poilId: poilIds });

        const response = await request.get(`/api/poilist/${poiList._id}`).send();

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(poiList.name);
        expect(response.body.poilId).toHaveLength(poilIds.length);
    });

    test("DELETE /api/poilist/:id - Delete POIList by ID", async () => {
        const poiList = await POIList.create({
            name: "Berlin POIs",
            poilId: [new Types.ObjectId()],
        });

        const response = await request.delete(`/api/poilist/${poiList._id}`).send();
        expect(response.statusCode).toBe(204);

        const deletedPOIList = await POIList.findById(poiList._id);
        expect(deletedPOIList).toBeNull();
    });

    test("DELETE /api/poilist/:id - Delete non-existent POIList", async () => {
        const nonExistentId = new Types.ObjectId().toString();

        const response = await request.delete(`/api/poilist/${nonExistentId}`).send();
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("POI-Liste nicht gefunden");
    });
});
