import { POIList } from "../../src/model/POIListsModel";
import { Types } from "mongoose";

describe("POIList Model Tests", () => {
    afterEach(async () => {
        await POIList.deleteMany({});
    });

    test("Should create a POIList with valid data", async () => {
        const poilIds = [new Types.ObjectId(), new Types.ObjectId()];
        const poiList = await POIList.create({
            name: "Test POIList",
            poilId: poilIds,
        });

        expect(poiList).toBeTruthy();
        expect(poiList.name).toBe("Test POIList");
        expect(poiList.poilId).toHaveLength(poilIds.length);
    });

    test("Should fail to create a POIList without name", async () => {
        await expect(POIList.create({ poilId: [new Types.ObjectId()] })).rejects.toThrow();
    });

    test("Should fetch a POIList by ID", async () => {
        const poilIds = [new Types.ObjectId(), new Types.ObjectId()];
        const poiList = await POIList.create({
            name: "Test POIList",
            poilId: poilIds,
        });

        const foundPOIList = await POIList.findById(poiList._id).exec();
        expect(foundPOIList).toBeTruthy();
        expect(foundPOIList?.name).toBe(poiList.name);
    });
});
