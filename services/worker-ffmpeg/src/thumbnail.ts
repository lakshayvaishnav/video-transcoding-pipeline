import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import type { Logger } from 'pino';
import { config } from './config.js';

if (config.ffmpeg.path) {
  ffmpeg.setFfmpegPath(config.ffmpeg.path);
}

interface ThumbnailResult {
  filename: string;
  path: string;
  isPoster: boolean;
}

export async function generateThumbnails(
  sourcePath: string,
  outputDir: string,
  logger: Logger
): Promise<ThumbnailResult[]> {
  const results: ThumbnailResult[] = [];

  // Get video duration for thumbnail timing
  const duration = await new Promise<number>((resolve, reject) => {
    ffmpeg.ffprobe(sourcePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration ?? 0);
    });
  });

  // Generate poster (main thumbnail at 10% of video)
  const posterPath = path.join(outputDir, 'poster.jpg');
  const posterTime = Math.max(1, Math.floor(duration * 0.1));

  await new Promise<void>((resolve, reject) => {
    ffmpeg(sourcePath)
      .screenshots({
        count: 1,
        folder: outputDir,
        filename: 'poster.jpg',
        timemarks: [posterTime],
        size: '1280x720',
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  results.push({
    filename: 'poster.jpg',
    path: posterPath,
    isPoster: true,
  });

  logger.info({ path: posterPath }, 'Poster generated');

  // Generate thumbnails at regular intervals (every 10 seconds or 10 thumbnails max)
  const interval = Math.max(10, Math.floor(duration / 10));
  const thumbnailCount = Math.min(10, Math.floor(duration / interval));

  for (let i = 0; i < thumbnailCount; i++) {
    const time = Math.min((i + 1) * interval, duration - 1);
    const filename = `thumb_${String(i + 1).padStart(2, '0')}.jpg`;
    const thumbPath = path.join(outputDir, filename);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(sourcePath)
        .screenshots({
          count: 1,
          folder: outputDir,
          filename,
          timemarks: [time],
          size: '320x180',
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    results.push({
      filename,
      path: thumbPath,
      isPoster: false,
    });
  }

  logger.info({ count: results.length }, 'Thumbnails generated');

  return results;
}
