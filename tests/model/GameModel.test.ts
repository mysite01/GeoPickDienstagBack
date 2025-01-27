import { Game } from "../../src/model/GameModel";

describe("GameModel Tests", () => {
    test("CreateGame with multiple POIs and description", async () => {
        const game = await Game.create({
            title: "Berlin Sehenswürdigkeiten",
            beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Berlin",
            poilId: [], // Keine direkten POI-Referenzen für diesen Test
            maxTeam: 5,
            userId: "647fbe2e14a0d2d3a2a69abc" // Beispiel-UserId
        });

        // Überprüfen, ob das Spiel erfolgreich erstellt wurde
        expect(game).toBeTruthy();
        expect(game.title).toBe("Berlin Sehenswürdigkeiten");

        // Überprüfen, ob die Beschreibung korrekt gesetzt ist
        expect(game.beschreibung).toBe("Einige der bekanntesten Sehenswürdigkeiten in Berlin");

        // Überprüfen, ob die poilId korrekt initialisiert ist (hier leer)
        expect(game.poilId).toBeDefined();
        expect(game.poilId).toHaveLength(0);

        // Überprüfen der weiteren Eigenschaften
        expect(game.maxTeam).toBe(5);
        expect(game.userId.toString()).toBe("647fbe2e14a0d2d3a2a69abc");
    });

    test("CreateGame with POI references", async () => {
        const game = await Game.create({
            title: "Naturreise",
            beschreibung: "Eine Tour durch die Natur",
            poilId: ["647fbe2e14a0d2d3a2a69bcd", "647fbe2e14a0d2d3a2a69def"], // Beispiel-POI-IDs
            maxTeam: 3,
            userId: "647fbe2e14a0d2d3a2a69abc" // Beispiel-UserId
        });

        // Überprüfen, ob das Spiel erfolgreich erstellt wurde
        expect(game).toBeTruthy();
        expect(game.title).toBe("Naturreise");

        // Überprüfen, ob die Beschreibung korrekt gesetzt ist
        expect(game.beschreibung).toBe("Eine Tour durch die Natur");

        // Überprüfen, ob die poilId korrekt definiert ist
        expect(game.poilId).toBeDefined();
        expect(game.poilId).toHaveLength(2);

        // Überprüfen der POI-Referenzen
       // expect(game.poilId[0].toString()).toBe("647fbe2e14a0d2d3a2a69bcd");
        //expect(game.poilId[1].toString()).toBe("647fbe2e14a0d2d3a2a69def");

        // Überprüfen der weiteren Eigenschaften
        expect(game.maxTeam).toBe(3);
        expect(game.userId.toString()).toBe("647fbe2e14a0d2d3a2a69abc");
    });

    test("CreateGame without description", async () => {
        const game = await Game.create({
            title: "Ohne Beschreibung",
            poilId: [],
            maxTeam: 4,
            userId: "647fbe2e14a0d2d3a2a69abc"
        });

        // Überprüfen, ob das Spiel erfolgreich erstellt wurde
        expect(game).toBeTruthy();
        expect(game.title).toBe("Ohne Beschreibung");

        // Überprüfen, ob die Beschreibung fehlt oder leer ist
        expect(game.beschreibung).toBeUndefined();

        // Überprüfen der weiteren Eigenschaften
        expect(game.maxTeam).toBe(4);
        expect(game.userId.toString()).toBe("647fbe2e14a0d2d3a2a69abc");
    });
});
