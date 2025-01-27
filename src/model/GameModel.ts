import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
    _id: mongoose.Types.ObjectId; // Typisiere `_id` explizit
    title: string;
    beschreibung?: string;
    poilId?: mongoose.Types.ObjectId[];
    maxTeam: number;
    userId: mongoose.Types.ObjectId;
}

const gameSchema = new Schema<IGame>(
    {
        title: { type: String, required: true },
        beschreibung: { type: String },
        poilId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "POILists", // Verweis auf das `POILists`-Modell
            },
        ],
        maxTeam: { type: Number, required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId as typeof Schema.Types.ObjectId,
            ref: "User", // Verweis auf das `User`-Modell
            required: true,
        },
    }
);

export const Game = mongoose.model<IGame>("Game", gameSchema);
