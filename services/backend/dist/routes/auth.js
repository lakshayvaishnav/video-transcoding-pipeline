import { z } from "zod";
import { randomUUID } from "crypto";
import { prisma } from "@video-transcoder/database";
const SALT_ROUNDS = 12;
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    name: z.string().min(1).max(100).optional(),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
async function hashPassword(password) {
    // Dynamic import for bcrypt (native module)
    const bcrypt = await import("bcrypt");
    return bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
    const bcrypt = await import("bcrypt");
    return bcrypt.compare(password, hash);
}
export async function authRoutes(app) {
    app.post("/register", {
        schema: {
            description: "Register a new user account",
            tags: ["Auth"],
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                    name: { type: "string" },
                },
            },
        },
    }, async (request, reply) => {
        const body = registerSchema.parse(request.body);
        const existing = await prisma.user.findUnique({
            where: { email: body.email },
        });
        if (existing) {
            return reply.status(409).send({
                statusCode: 409,
                error: "Conflict",
                message: "User with this email already exists",
            });
        }
        const hashedPassword = await hashPassword(body.password);
        const user = await prisma.user.create({
            data: {
                id: randomUUID(),
                email: body.email,
                password: hashedPassword,
                name: body.name,
            },
        });
        const accessToken = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: "24h" });
        const refreshToken = app.jwt.sign({ id: user.id, type: "refresh" }, { expiresIn: "7d" });
        return reply.status(201).send({
            accessToken,
            refreshToken,
            expiresIn: 86400, // 24 hours in seconds
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    });
    app.post("/login", {
        schema: {
            description: "Login with email and password",
            tags: ["Auth"],
            body: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                },
            },
        },
    }, async (request, reply) => {
        const body = loginSchema.parse(request.body);
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });
        if (!user) {
            return reply.status(401).send({
                statusCode: 401,
                error: "Unauthorized",
                message: "Invalid email or password",
            });
        }
        // Verify password
        const valid = await verifyPassword(body.password, user.password);
        if (!valid) {
            return reply.status(401).send({
                statusCode: 401,
                error: "Unauthorized",
                message: "Invalid email or password",
            });
        }
        // Generate tokens
        const accessToken = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: "24h" });
        const refreshToken = app.jwt.sign({ id: user.id, type: "refresh" }, { expiresIn: "7d" });
        return reply.send({
            accessToken,
            refreshToken,
            expiresIn: 86400,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    });
    app.post("/refresh", {
        schema: {
            description: "Refresh access token using refresh token",
            tags: ["Auth"],
            body: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                    refreshToken: { type: "string" },
                },
            },
        },
    }, async (request, reply) => {
        const { refreshToken } = request.body;
        try {
            const decoded = app.jwt.verify(refreshToken);
            if (decoded.type !== "refresh") {
                throw new Error("Invalid token type");
            }
            // Get user
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                throw new Error("User not found");
            }
            // Generate new access token
            const accessToken = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: "24h" });
            return reply.send({
                accessToken,
                expiresIn: 86400,
            });
        }
        catch {
            return reply.status(401).send({
                statusCode: 401,
                error: "Unauthorized",
                message: "Invalid refresh token",
            });
        }
    });
    app.get("/me", {
        schema: {
            description: "Get current user profile",
            tags: ["Auth"],
            security: [{ bearerAuth: [] }],
        },
    }, async (request, reply) => {
        try {
            await request.jwtVerify();
            const tokenUser = request.user;
            const user = await prisma.user.findUnique({
                where: { id: tokenUser.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            });
            if (!user) {
                return reply.status(404).send({
                    statusCode: 404,
                    error: "Not Found",
                    message: "User not found",
                });
            }
            return reply.send(user);
        }
        catch {
            return reply.status(401).send({
                statusCode: 401,
                error: "Unauthorized",
                message: "Invalid or missing token",
            });
        }
    });
}
//# sourceMappingURL=auth.js.map