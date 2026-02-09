import Fastify from "fastify";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import cors from "@fastify/cors";
import { config } from "./config.js";
import helmet from "@fastify/helmet";

const app = Fastify({
  logger: {
    level: config.server.logLevel,
    transport:
      config.server.nodeEnv === "development"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
});

async function buildApp() {
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin:
      config.server.nodeEnv === "development"
        ? true
        : ["http://localhost:3000"],
    credentials: true,
  });

  await app.register(jwt, {
    secret: config.auth.jwtSecret,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "video transcoder API",
        description: "API for video upload, transcoding and streaming",
        version: "1.0.0",
      },
      servers: [{ url: `http://localhost:${config.server.port}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });

  // add the error handler
  // app.setErrorHandler()

  return app;
}

async function start() {
  try {
    await buildApp();
    await app.listen({ port: config.server.port, host: config.server.host });

    app.log.info(
      `🚀 BACKEND server started at http://${config.server.host}:${config.server.port}`,
    );
    app.log.info(
      `📚 API docs at http://${config.server.host}:${config.server.port}/docs`,
    );
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
  process.on(signal, async () => {
    app.log.info(`Recieved ${signal}, shutting down gracefully...`);
    await app.close();
    // todo: add shutdown services...
    process.exit();
  });
});

start();
