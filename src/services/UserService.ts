import mongoose, { Types } from 'mongoose';
import { User, IUser } from '../model/UserModel';
import { UserResource } from 'src/Resources';
import crypto from "crypto";
import nodemailer from "nodemailer";


/**
 * Erstellt einen neuen Benutzer
 */
export async function createUser(userResource: UserResource): Promise<UserResource> {
    try {
        const existingUser = await User.findOne({ name: userResource.name }).exec();
        if (existingUser) {
            throw new Error("Benutzername existiert bereits.");
        }

        // Verifizierungstoken generieren
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = new User({
            name: userResource.name,
            password: userResource.password,
            createdAt: new Date(),
            email: userResource.email,
            verificationToken,
            emailConfirmed: false, // Noch nicht bestätigt
        });

        const savedUser = await user.save();

        // Zoho SMTP-Transporter einrichten
        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.eu",
            port: 465, // SSL-Port
            secure: true, // SSL aktivieren
            auth: {
                user: "geopickpoints@zohomail.eu", // Ersetze durch deine Zoho-E-Mail-Adresse
                pass: "uZvVv@qN@j6CRn2", // Ersetze durch dein Zoho-Passwort
            },
        });

        // Verbindung testen (optional, nur für Debugging)
        transporter.verify((error, success) => {
            if (error) {
                console.error("Fehler bei der SMTP-Verbindung:", error);
            } else {
                console.log("SMTP-Verbindung erfolgreich:", success);
            }
        });

        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const verificationUrl = `${clientUrl}/verify-email?token=${verificationToken}`;
            const mailResponse = await transporter.sendMail({
            from: "geopickpoints@zohomail.eu", // Absenderadresse
            to: user.email, // Empfängeradresse
            subject: "Bestätige deine E-Mail-Adresse",
            html: `<p>Hallo ${user.name},</p>
                   <p>Bitte bestätige deine E-Mail-Adresse, indem du auf den folgenden Link klickst:</p>
                   <a href="${verificationUrl}">E-Mail bestätigen</a>
                   <p>Der Link ist 24 Stunden gültig.</p>`,
        });

        console.log("E-Mail gesendet:", mailResponse.messageId);

        return {
            id: savedUser._id.toString(),
            name: savedUser.name,
            createdAt: savedUser.createdAt,
        };
    } catch (error: any) {
        throw new Error(`Fehler beim Erstellen des Benutzers: ${error.message}`);
    }
}

/**
 * Löscht einen Benutzer anhand der ID
 */
export async function deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;  // Gibt `true` zurück, wenn ein Benutzer gelöscht wurde, `false` wenn kein Benutzer gefunden wurde
}
/**
 * Holt alle Benutzer anhand der ID
 */
export async function getUserById(userId: string): Promise<UserResource> {
    try {
        const user = await User.findById(userId).exec();

        if (!user) {
            throw new Error("Benutzer nicht gefunden");
        }

        return {
            id: (user._id as Types.ObjectId).toString(), // _id explizit als ObjectId behandeln und in einen String umwandeln
            name: user.name,
            password: user.password,
            createdAt: user.createdAt
        };
    } catch (error) {
        throw new Error("Fehler beim Abrufen des Benutzers");
    }
}

/**
 * 
 * @param name 
 * @returns 
 */
export async function getUserByName(name: string): Promise<UserResource> {
    try {
        const user = await User.findOne({ name }).exec();

        if (!user) {
            throw new Error("Benutzer nicht gefunden");
        }

        return {
            id: (user._id as Types.ObjectId).toString(), // _id explizit als ObjectId behandeln und in einen String umwandeln
            name: user.name,
            password: user.password,
            createdAt: user.createdAt
        };
    } catch (error) {
        throw new Error("Fehler beim Abrufen des Benutzers");
    }
}


/**
 * Verifiziert die E-Mail-Adresse eines Benutzers anhand des Tokens.
 */
export async function verifyEmail(token: string): Promise<boolean> {
    try {
        // Benutzer anhand des Tokens finden
        const user = await User.findOne({ verificationToken: token }).exec();

        if (!user) {
            throw new Error("Ungültiger Verifizierungstoken.");
        }

        // Ablaufdatum des Tokens prüfen (falls vorhanden)
        if (user.verificationTokenExpiration && user.verificationTokenExpiration < new Date()) {
            throw new Error("Verifizierungstoken ist abgelaufen.");
        }

        // Benutzer als verifiziert markieren
        user.emailConfirmed = true;
        user.verificationToken = null; // Token entfernen
        user.verificationTokenExpiration = undefined; // Ablaufdatum entfernen
        await user.save();

        return true;
    } catch (error: any) {
        console.error("Fehler bei der E-Mail-Verifizierung:", error.message);
        throw new Error(`Fehler bei der E-Mail-Verifizierung: ${error.message}`);
    }
}
