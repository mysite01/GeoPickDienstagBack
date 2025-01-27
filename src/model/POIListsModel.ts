import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPOIList extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    poilId: Types.ObjectId[]; // Array von ObjectIds, die auf POIs verweisen
}

const POIListSchema = new Schema<IPOIList>({
    name: { type: String, required: true },
    poilId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "POI", // Verweist auf das POI-Modell
        },
    ],
});

export const POIList = mongoose.model<IPOIList>("POIList", POIListSchema);
