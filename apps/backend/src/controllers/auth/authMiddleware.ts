import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

export interface AuthPayload {
    id: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "missing or invalid authorization header" });
        return;
    }

    const token = authHeader.split(" ")[1];
    if(!token){
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as AuthPayload;
        req.user = decoded;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: "token expired" });
            return;
        }
        res.status(401).json({ error: "invalid token" });
    }
}
