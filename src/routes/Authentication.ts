import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../services/JWTService";
import { JsonWebTokenError } from "jsonwebtoken";

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
        }
    }
}


export function requiresAuthentication(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies) {
        return res.status(401).send({ error: "Cookies not found" });
    }

    const token = req.cookies['access_token'];

    if (!token) {
        return res.status(401).send({ error: "Token not found" });
    }

    try {
        const payload = verifyJWT(token);
        
        req.userId = payload.id; 
        
        next();
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            return res.status(401).send({ error: "Invalid token" });
        }
        next(err);
    }
}

export function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.access_token;

    if (!token) {
        return next();
    }

    try {
        const payload = verifyJWT(token); 
        req.userId = payload.id; 
        next();
    } catch (err) {
        return res.status(401).json({ error: "Ungültiger Token" });
    }
}