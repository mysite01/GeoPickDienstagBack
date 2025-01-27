import { model, Schema, Types } from "mongoose";

export interface IGameInstance {
    name: string;
    status: number; 
    startTime: Date;
    endTime: Date;
    game: Types.ObjectId;
    teams: Types.ObjectId[];
}

const gameInstanceSchema = new Schema<IGameInstance>(
    {
        name: { type: String, required: false },
        status: {
            type: Number,
            enum: [0, 1, 2], // 0 = lobby, 1 = läuft, 2 = geschlossen
            required: true,
            default: 0
        },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        game: {
            type: Schema.Types.ObjectId,
            ref: "Game",
            required: true
        },
        teams: [{
            type: Schema.Types.ObjectId,
            ref: "Team",
            required: true
        }],
    },
    {
        timestamps: true,
    }
);

export const GameInstance = model<IGameInstance>("GameInstance", gameInstanceSchema);