import Fastify from "fastify";
import { config } from "./config.js";
import helmet from "@fastify/helmet";
const app = Fastify({
    logger: {
        level: config,
        transport: config.server.nodeEnv === "development"
            ? { target: "pino-pretty", options: { colorize: true } }
            : undefined,
    },
});
async function buildApp() {
    await app.register(helmet, { contentSecurityPolicy: false });
}
//# sourceMappingURL=index.js.map