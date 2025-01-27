import { createUser, deleteUser, getUserById, verifyEmail } from "../../src/services/UserService";
import { User } from '../../src/model/UserModel';
import { UserResource } from "../../src/Resources";
import { Types } from "mongoose"; 
import nodemailer from "nodemailer";


describe("UserService Tests", () => {
    afterEach(async () => {
        await User.deleteMany({});
    });

    test("Create User", async () => {
        const userData: UserResource = {
            name: "John Doe",
            password: "password123",
            createdAt: new Date(),
            email: "test@test.de"
        };

        const createdUser = await createUser(userData);

        expect(createdUser).toBeTruthy();
        expect(createdUser.name).toBe(userData.name);
        expect(createdUser.password).not.toBe(userData.password);
        expect(createdUser).toHaveProperty("createdAt");
        //expect(getUserById(createdUser.name)).toBe(userData.name);
    });

    test("Get User by ID", async () => {
        const user = await User.create({
            name: "Jane Doe",
            password: "securepassword",
            createdAt: new Date(),
            email: "test@test.de"
        });

        const foundUser = await getUserById((user._id as Types.ObjectId).toString());
        expect(foundUser).toBeTruthy();
        expect(foundUser?.name).toBe(user.name);
        expect(foundUser?.password).toBe(user.password);
    });

    test("Delete User by ID", async () => {
        const user = await User.create({
            name: "Tom Doe",
            password: "anotherpassword",
            createdAt: new Date(),
            email: "test@test.de"
        });

        const userId = (user._id as Types.ObjectId).toString();

        await deleteUser(userId);
        const deletedUser = await User.findById(userId);
        expect(deletedUser).toBeNull();
    });
});
jest.setTimeout(30000); // 30 Sekunden Timeout

test("should create a new user and send a verification email", async () => {
    // Benutzer-Ressource
    const userData: UserResource = {
        name: "John Doe",
        password: "password123",
        createdAt: new Date(),
        email: "EmirKaya19@outlook.de",
    };

    // Benutzer erstellen
    const createdUser = await createUser(userData);

    console.log("Erstellter Benutzer:", createdUser);

    // Prüfen, ob der Benutzer korrekt erstellt wurde
    expect(createdUser).toBeTruthy();
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser.password).not.toBe(userData.password);
    expect(createdUser).toHaveProperty("createdAt");

    // Prüfen, ob die E-Mail korrekt gespeichert wurde
    const userInDb = await User.findOne({ name: "John Doe" });
    console.log("Benutzer in der Datenbank:", userInDb);
    expect(userInDb).not.toBeNull();
    expect(userInDb!.email).toBe("EmirKaya19@outlook.de");
    expect(userInDb!.verificationToken).not.toBeNull();
    expect(userInDb!.emailConfirmed).toBe(false);

    // E-Mail-Verifizierung durchführen
    const verificationToken = userInDb!.verificationToken!;
    const isVerified = await verifyEmail(verificationToken);

    expect(isVerified).toBe(false);

    // Benutzer erneut überprüfen
    const verifiedUserInDb = await User.findOne({ name: "John Doe" });
    console.log("Verifizierter Benutzer:", verifiedUserInDb);
    expect(verifiedUserInDb!.emailConfirmed).toBe(true);
});