import { User } from "../model/UserModel";
import jwt from "jsonwebtoken";
import { verifyJWT } from "./JWTService";

/**
 * Prüft Name und Passwort. Bei Erfolg wird die Benutzer-ID und ein JWT zurückgegeben.
 */

export async function login(name: string, password: string): Promise<{ id: string; token: string }> {
    // Benutzer suchen
    const user = await User.findOne({ name }).exec();

    // Fehlerbehandlung: Benutzer nicht gefunden
    if (!user) {
        throw new Error('User not found');
    }

    // Überprüfen, ob die E-Mail-Adresse bestätigt ist
    if (!user.emailConfirmed) {
        throw new Error("Email not confirmed. Please confirm your email before logging in.");
    }

    // Passwortvalidierung
    const isCorrectPassword = await user.isCorrectPassword(password);
    if (!isCorrectPassword) {
        throw new Error('Invalid password');
    }

    // Token-Erstellung
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("Umgebungsvariable JWT_SECRET ist nicht gesetzt.");
    }

    const token = jwt.sign(
        {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        }, // Payload
        secret,
        { expiresIn: "1h" } // Ablaufzeit des Tokens
    );

    // Erfolgreiches Login: Token und ID zurückgeben
    return {
        id: user._id.toString(),
        token,
    };
}


/**
 * Registriert einen neuen Benutzer.
 * Überprüft, ob der Name bereits existiert, und speichert den Benutzer, falls nicht.
 */
export async function register(name: string, password: string): Promise<{ id: string }> {
    const existingUser = await User.findOne({ name }).exec();

    if (existingUser) {
        throw new Error("Ein Benutzer mit diesem Namen existiert bereits.");
    }

    const newUser = new User({
        name,
        password,
        createdAt: new Date(),
    });

    const savedUser = await newUser.save();

    return {
        id: savedUser._id.toString(),
    };
}

export async function authenticateToken(token: string): Promise<{ id: string }> {
    try {
        const decoded = verifyJWT(token); // Verifiziert das Token
        return { id: decoded.id 
            
        };
    } catch (error) {
        throw new Error("Ungültiges oder abgelaufenes Token.");
    }
}
    