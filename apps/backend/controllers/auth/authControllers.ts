import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { signupSchema, loginSchema } from "@antcolony/zod";
import { prisma } from "@antcolony/db";
import { Prisma } from "@antcolony/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

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
        res.status(201).json({ userdata: safeUser });
    } catch (err) {
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2002"
        ) {
            const target = (err.meta?.target as string[] | undefined)?.join(", ");
            res.status(409).json({ error: `${target ?? "field"} already in use` });
            return;
        }
        console.error(err);
        res.status(500).json({ error: "internal server error" });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "invalid data" });
        return;
    }
    const { loginIdentifier, password } = parsed.data;

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: loginIdentifier },
                    { email: loginIdentifier },
                ],
            },
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

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password: _, ...safeUser } = user;
        res.status(200).json({ token, userdata: safeUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal server error" });
    }
}