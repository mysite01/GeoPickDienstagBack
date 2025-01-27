import { Schema, model, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    name: string;
    password: string;
    createdAt: Date;
    email?: string; // Optionale E-Mail-Adresse
    emailConfirmed?: boolean; // Status der E-Mail-Bestätigung
    resetToken?: string; // Token für Passwort-Zurücksetzen
    resetTokenExpiration?: Date; // Ablaufzeitpunkt des Reset-Tokens
    verificationToken?: string | null; // Token für E-Mail-Verifizierung
    verificationTokenExpiration?: Date; // Ablaufzeit für Verifizierungstoken
}

interface IUserMethods {
    isCorrectPassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }, // Email als Pflichtfeld
    emailConfirmed: { type: Boolean, default: false }, // Standard: Nicht bestätigt
    resetToken: { type: String, required: false }, // Token für Passwort-Zurücksetzen
    resetTokenExpiration: { type: Date, required: false }, // Ablaufzeit des Tokens
    verificationToken: { type: String, default: null }, // Token für Verifizierung
    createdAt: { type: Date, default: Date.now },
    verificationTokenExpiration: { type: Date, required: false } // Ablaufzeit für Verifizierungstoken
});

// **Middleware: Passwort-Hashing vor dem Speichern**
UserSchema.pre("save", async function () {
    if (this.isModified("password")) { // Hashing nur, wenn das Passwort geändert wurde
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
});

// **Methode zur Passwortprüfung**
UserSchema.method("isCorrectPassword", async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
});

export const User = model<IUser, UserModel>("User", UserSchema);

