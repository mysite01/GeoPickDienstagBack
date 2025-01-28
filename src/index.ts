import dotenv from 'dotenv';
dotenv.config(); // .env-Datei laden

import http from "http";
import mongoose from 'mongoose';
import app from "./app";

import { GameResource, POIResource } from "src/Resources";
import { Types } from "mongoose";
import * as GameService from "./services/GameService";
import * as POIService from "./services/POIService"
import { WebSocketServer, WebSocket } from 'ws';










import express from 'express';
import cors from 'cors';





const corsOptions = {
  origin: 'https://geo-pick-front.vercel.app', // Ersetze dies mit deiner tatsächlichen Frontend-Domain
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization', // Erlaubte Header
  credentials: true, // Falls du Cookies oder Authentifizierung benötigst
};




app.use(cors(corsOptions));


// Reagiere auf Preflight-Anfragen (OPTIONEN-Methoden)
app.options('*', cors(corsOptions));


app.post('*', (req, res, next) => {
  console.log(`POST request from: ${req.get('Origin') || req.ip}`);
  next(); // Weiter mit der nächsten Middleware oder Route
});








async function createExampleGame() {
    const berlinPoi1: POIResource = { name: "Alexanderplatz", lat: 52.520008, long: 13.404954, beschreibung: "Ein belebter Platz mit Fernsehturm, Geschäften und urbanem Flair.", punkte: 100}
    const berlinPoi2: POIResource = { name: "Brandenburger Tor", lat: 52.516275, long: 13.377704, beschreibung: "Ein ikonisches Monument und Symbol für Geschichte und Einheit.", punkte: 200}
    const berlinPoi3: POIResource = { name: "Podsdamer Platz", lat: 52.509290, long: 13.376340, beschreibung: "Ein moderner Knotenpunkt mit Architektur, Kultur und Unterhaltung.", punkte: 100}
    const berlinPoi4: POIResource = { name: "Oberbaumbrücke", lat: 52.501834, long: 13.445656, beschreibung: "Eine markante Brücke mit Doppeldeck-Architektur und historischem Charme.", punkte: 100}
    const berlinPoi5: POIResource = { name: "Museumsinsel", lat: 52.516260, long: 13.402480, beschreibung: "Ein einzigartiges Kulturensemble mit weltberühmten Museen.", punkte: 100}
    const berlinPoi6: POIResource = { name: "Volkspark Friedrichhain", lat: 52.528730, long: 13.442284, beschreibung: "Ein weitläufiger Park mit grünen Wiesen, Hügeln und Entspannungsoasen.", punkte: 50}
    const berlinPoi7: POIResource = { name: "Deutsches Technikmuseum", lat: 52.498603, long: 13.378154, beschreibung: "Ein faszinierendes Museum mit historischen Exponaten zu Technik und Ingenieurskunst.", punkte: 50}
    const berlinPoi8: POIResource = { name: "Checkpoint Charlie", lat: 52.507530, long: 13.390378, beschreibung: "Ein historischer Grenzpunkt und Symbol des Kalten Krieges.", punkte: 200}
   
    const bhtPOI1: POIResource = {name: "Workout Park", lat: 52.545374, long: 13.352802, beschreibung:"Workout Park", punkte: 50}
    const bhtPOI2: POIResource = {name: "Spielplatz auf dem Zeppelinplatz", lat: 52.546413, long: 13.353094, beschreibung:"Spielplatz auf dem Zeppelinplatz", punkte: 200}
    const bhtPOI3: POIResource = {name: "Einfahrt", lat: 52.546101, long: 13.355068, beschreibung:"Einfahrt", punkte: 50}
    const bhtPOI4: POIResource = {name: "Fahrradständer Zeppelinplatz", lat: 52.545717, long: 13.351990, beschreibung:"Fahrradständer Zeppelinplatz", punkte: 100}
    const bhtPOI5: POIResource = {name: "Eingang Zeppelinplatz", lat: 52.545879, long: 13.354316, beschreibung:"Eingang Zeppelinplatz", punkte: 100}

    const berlinPoi1FullData = await POIService.createPOI(berlinPoi1)
    const berlinPoi2FullData = await POIService.createPOI(berlinPoi2)
    const berlinPoi3FullData = await POIService.createPOI(berlinPoi3)
    const berlinPoi4FullData = await POIService.createPOI(berlinPoi4)
    const berlinPoi5FullData = await POIService.createPOI(berlinPoi5)
    const berlinPoi6FullData = await POIService.createPOI(berlinPoi6)
    const berlinPoi7FullData = await POIService.createPOI(berlinPoi7)
    const berlinPoi8FullData = await POIService.createPOI(berlinPoi8)

    const bhtPOI1FullData = await POIService.createPOI(bhtPOI1)
    const bhtPOI2FullData = await POIService.createPOI(bhtPOI2)
    const bhtPOI3FullData = await POIService.createPOI(bhtPOI3)
    const bhtPOI4FullData = await POIService.createPOI(bhtPOI4)
    const bhtPOI5FullData = await POIService.createPOI(bhtPOI5)

    const gameData: GameResource = {
        title: "Berlin Sehenswürdigkeiten",
        beschreibung: "Einige der bekanntesten Sehenswürdigkeiten in Berlin",
        poilId: [
          berlinPoi1FullData.id!,
          berlinPoi2FullData.id!,
          berlinPoi3FullData.id!,
          berlinPoi4FullData.id!,
          berlinPoi5FullData.id!,
          berlinPoi6FullData.id!,
          berlinPoi7FullData.id!,
          berlinPoi8FullData.id!,

          bhtPOI1FullData.id!,
          bhtPOI2FullData.id!,
          bhtPOI3FullData.id!,
          bhtPOI4FullData.id!,
          bhtPOI5FullData.id!,
        ],
        maxTeam: 5,
        userId: new Types.ObjectId().toString(),
    };
    await GameService.createGame(gameData)
}

const clients: Set<WebSocket> = new Set();

function broadcast(data: any) {
    const jsonData = JSON.stringify(data);
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(jsonData);
        }
    });
}

async function setup() {
    console.log("USE_SSL:", process.env.USE_SSL);
    console.log("HTTP_PORT:", process.env.HTTP_PORT);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    let mongodURI = "memory"
    if (!mongodURI) {
        console.error(`Cannot start`);
        process.exit(1);
    }

    if (mongodURI === "memory") {
        console.info("Start MongoMemoryServer");
        const MMS = await import('mongodb-memory-server');
        const mongo = await MMS.MongoMemoryServer.create();
        mongodURI = mongo.getUri();
    }

    console.info(`Connecting to MongoDB at ${mongodURI}`);
    await mongoose.connect(mongodURI);

    await createExampleGame();

    const httpPort = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3443;
    const httpServer = http.createServer(app);

    const wss = new WebSocketServer({ server: httpServer });

    wss.on("connection", (ws: WebSocket) => {
        //console.info("Ein neuer Client hat sich verbunden.");
        clients.add(ws);
      
        ws.on("message", (message) => {
          try {
            //console.info(`Nachricht empfangen: ${message}`);
            const data = JSON.parse(message.toString());
            //console.info("Parsed message:", data); // Debugging-Ausgabe
      
            if (data.type === "join") {
              //console.info(`${data.playerName} ist Team ${data.teamId} beigetreten.`);
              broadcast({
                type: "join",
                playerId: data.playerId,
                playerName: data.playerName,
                teamId: data.teamId,
              });
            } else if (data.type === "leave") {
              //console.info(`${data.playerName} hat Team ${data.teamId} verlassen.`);
              broadcast({
                type: "leave",
                playerId: data.playerId,
                playerName: data.playerName,
                teamId: data.teamId,
              });
            } else if (data.type === "loadMap") {
              broadcast({
                type: "loadMap",
                dataGameInstance: data.dataGameInstance,
                teamID: data.teamID
              });
            }else if (data.type === "loadGame") {
              broadcast({
                type: "loadGame",
              });
            } else if (data.type === "gameOver"){
              broadcast({
                type: "gameOver"
              })
            } else if (data.type === "PoiClaimed"){
              broadcast({
                type: "PoiClaimed"
              })
            }
          } catch (error) {
            console.error("Fehler beim Verarbeiten der Nachricht:", error);
          }
        });
      
        ws.on("close", () => {
          //console.info("Ein Client hat die Verbindung geschlossen.");
          clients.delete(ws);
        });
      });
      

    

    function startHttpServer() {
        httpServer.listen(httpPort, () => {
            console.info(`Listening for HTTP at http://localhost:${httpPort}`);
        });
    }

    httpServer.on('error', (err) => {
        if (err instanceof Error && (err as any).code === 'EADDRINUSE') {
            console.error('Address in use, retrying...');
            setTimeout(() => {
                httpServer.close();
                startHttpServer();
            }, 1000);
        } else {
            console.error(`Server error: ${err.message}`);
        }
    });

    startHttpServer();

    process.on('SIGINT', () => {
        console.info('Received SIGINT. Shutting down gracefully...');
        httpServer.close(() => {
            console.info('Server closed.');
            process.exit(0);
        });
    });
}

setup();