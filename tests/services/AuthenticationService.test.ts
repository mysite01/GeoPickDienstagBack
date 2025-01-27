import { User } from "../../src/model/UserModel";
import { login } from "../../src/services/AuthenticationService";

it("soll einen Benutzer erfolgreich einloggen, wenn die Anmeldedaten korrekt sind", async () => {
    process.env.JWT_SECRET = "testsecret"; // Dummy-Wert für Testzwecke
    const user = await User.create({
        name: "TestUser",
        password: "securepassword", // Wird beim Speichern gehasht
    });

    // Führe die Login-Funktion aus
    const result = await login("TestUser", "securepassword");

    // Überprüfe, ob das Login erfolgreich war
    expect(result).toBeTruthy();
    if (result) {
        expect(result.id).toBe(user._id.toString());
    }
});


test("soll `false` zurückgeben, wenn der Benutzer nicht existiert", async () => {
    const result = await login("NonExistentUser", "password");
    expect(result).toBe(false);
});

test("soll `false` zurückgeben, wenn das Passwort falsch ist", async () => {
    await User.create({
        name: "TestUser",
        password: "securepassword", 
    });

    const result = await login("TestUser", "wrongpassword");
    expect(result).toBe(false);
});

