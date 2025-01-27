import mongoose, { Schema} from "mongoose";

export interface IPOI {
    name: string;
    lat: number; 
    long: number;  
    beschreibung: string;
    punkte: number;
}

const poiSchema = new Schema<IPOI>({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    beschreibung: { type: String, required: true },
    punkte: { type: Number, required: true },
}, {
    timestamps: true,
});

export const POI = mongoose.model<IPOI>("POI", poiSchema);
