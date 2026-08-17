import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { signupSchema, loginSchema } from "@antcolony/zod";
import { prisma } from "@antcolony/db"; // adjust to your actual prisma client export

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function signup(req: Request, res: Response): Promise<void> {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "invalid data" });
        return;
    }
    const { username, name, password, email } = parsed.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                email,
            },
        });

        const { password: _, ...safeUser } = user;
        res.status(200).json({ userdata: safeUser });
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "invalid data" });
        return;
    }
    const { username, password, email } = parsed.data;

    try {
        const user = await prisma.user.findFirst({
            where: { username, email },
        });

        if (!user) {
            res.status(404).json({ error: "user not found" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid username or password" });
            return;
        }

        const { password: _, ...safeUser } = user;
        const token = jwt.sign(safeUser, JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
}