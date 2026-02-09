import { ZodError } from "zod";
export function errorHandler(error, request, reply) {
    request.log.error(error);
    // Zod validation errors
    if (error instanceof ZodError) {
        const response = {
            statusCode: 400,
            error: "Validation Error",
            message: "Invalid request data",
            details: error.errors,
        };
        reply.status(400).send(response);
        return;
    }
    // JWT errors
    if (error.code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER") {
        const response = {
            statusCode: 401,
            error: "Unauthorized",
            message: "Missing authorization header",
        };
        reply.status(401).send(response);
        return;
    }
    if (error.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID") {
        const response = {
            statusCode: 401,
            error: "Unauthorized",
            message: "Invalid token",
        };
        reply.status(401).send(response);
        return;
    }
    // Known HTTP errors
    if (error.statusCode) {
        const response = {
            statusCode: error.statusCode,
            error: error.name || "Error",
            message: error.message,
        };
        reply.status(error.statusCode).send(response);
        return;
    }
    // Unknown errors
    const response = {
        statusCode: 500,
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development"
            ? error.message
            : "An unexpected error occurred",
    };
    reply.status(500).send(response);
}
//# sourceMappingURL=error-handler.js.map