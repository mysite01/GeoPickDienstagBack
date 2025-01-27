import express from "express";
import * as UserService from "../services/UserService";

export const userRouter = express.Router();

/**
 * Route zum Erstellen eines neuen Benutzers
 */
userRouter.post("/", async (req, res, next) => {
    try {
      
        const newUser = await UserService.createUser(req.body);
        res.status(201).send(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Fehler beim Erstellen des Benutzers',Error: `name ${req.body.name} already exists. Please input a new one.`, });
        next(err);
    }

    
});

/**
 * Route zum Löschen eines Benutzers anhand der ID
 */
// userRouter.ts
// userRouter.ts
userRouter.delete("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
        const wasDeleted = await UserService.deleteUser(id);
        if (!wasDeleted) {
            res.status(404).json({ message: "Benutzer nicht gefunden" });
            return;
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Fehler beim Löschen des Benutzers' });
        next(err);
    }
});


/**
 * Route zum Abrufen eines Benutzers anhand der ID
 */
userRouter.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await UserService.getUserById(id);
        if (!user) {
            res.status(404).json({ message: "Benutzer nicht gefunden" });
            return;
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).json({ message: 'Fehler beim Abrufen des Benutzers' });
        next(err);
    }
});

userRouter.post("/verify-email", async (req, res, next) => {
    try {
        const { token } = req.body;

        // Verifizierung durchführen
        const isVerified = await UserService.verifyEmail(token);

        if (!isVerified) {
            res.status(400).json({ message: "Ungültiger oder abgelaufener Token." });
            return;
        }

        res.status(200).json({ message: "E-Mail erfolgreich bestätigt!" });
    } catch (err) {
        res.status(500).json({ 
            message: "Fehler bei der E-Mail-Verifizierung."
                });
        next(err);
    }
});