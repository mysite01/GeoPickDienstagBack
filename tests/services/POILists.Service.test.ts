import { createPOIList, getPOIListById, deletePOIList } from "../../src/services/POILists.Service";
import { POIList } from "../../src/model/POIListsModel";
import { Types } from "mongoose";

describe("POIList Service Tests", () => {
    afterEach(async () => {
        await POIList.deleteMany({});
    });

    test("Should create a POIList with valid data", async () => {
        const poilIds = [new Types.ObjectId().toString(), new Types.ObjectId().toString()];
        const poiList = await createPOIList("Test POIList", poilIds);

        expect(poiList).toBeTruthy();
        expect(poiList.name).toBe("Test POIList");
        expect(poiList.poilId).toHaveLength(poilIds.length);
    });

    test("Should delete a POIList by ID", async () => {
        const poilIds = [new Types.ObjectId(), new Types.ObjectId()];
        const poiList = await POIList.create({ name: "Test POIList", poilId: poilIds });

        const wasDeleted = await deletePOIList(poiList._id.toString());
        expect(wasDeleted).toBe(true);

        const deletedPOIList = await POIList.findById(poiList._id);
        expect(deletedPOIList).toBeNull();
    });

    test("Should return false when deleting non-existent POIList", async () => {
        const nonExistentId = new Types.ObjectId().toString();
        const wasDeleted = await deletePOIList(nonExistentId);

        expect(wasDeleted).toBe(false);
    });
});
