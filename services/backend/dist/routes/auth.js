import { z } from "zod";
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
            const hashedPassword = await hashPassword(body.password);
        }
    });
}
//# sourceMappingURL=auth.js.map