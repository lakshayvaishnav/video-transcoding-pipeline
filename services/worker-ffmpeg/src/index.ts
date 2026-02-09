import pino from 'pino';
import { config } from './config.js';
import { createKafkaClient, type KafkaClient } from '@video-transcoder/kafka-client';
import { startJobConsumer } from './consumer.js';
import { ensureTempDir } from './utils/fs.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pinoLogger = (pino as any).default ?? pino;

const logger = pinoLogger({
  level: config.logLevel,
  transport:
    config.nodeEnv === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

let kafkaClient: KafkaClient | null = null;

async function main() {
  logger.info('Starting FFmpeg Worker Service...');

  // Ensure temp directory exists
  await ensureTempDir(config.tempDir);
  logger.info({ tempDir: config.tempDir }, 'Temp directory ready');

  // Initialize Kafka client
  kafkaClient = createKafkaClient({
    brokers: config.kafka.brokers,
    clientId: 'worker-ffmpeg',
    logLevel: config.nodeEnv === 'development' ? 'debug' : 'warn',
  });

  await kafkaClient.connectProducer();
  logger.info('Kafka producer connected');

  // Start job consumer
  await startJobConsumer(kafkaClient, logger);

  logger.info('FFmpeg Worker Service started successfully');
}

// Graceful shutdown
const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    // Give current job time to finish
    setTimeout(async () => {
      if (kafkaClient) {
        await kafkaClient.disconnectAll();
      }
      process.exit(0);
    }, 5000);
  });
});

main().catch((err) => {
  logger.error(err, 'Failed to start FFmpeg Worker');
  process.exit(1);
});
