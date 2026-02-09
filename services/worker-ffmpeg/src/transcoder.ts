import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import type { Logger } from 'pino';
import type { TranscodeProfile } from '@video-transcoder/shared-types';
import { config } from './config.js';

// Configure FFmpeg paths if provided
if (config.ffmpeg.path) {
  ffmpeg.setFfmpegPath(config.ffmpeg.path);
}
if (config.ffmpeg.probePath) {
  ffmpeg.setFfprobePath(config.ffmpeg.probePath);
}

interface TranscodeResult {
  mp4Path: string;
  hlsPath: string;
}

export async function transcodeToProfile(
  sourcePath: string,
  outputDir: string,
  profile: TranscodeProfile,
  logger: Logger
): Promise<TranscodeResult> {
  const mp4OutputPath = path.join(outputDir, `${profile.name}.mp4`);
  const hlsDir = path.join(outputDir, 'hls', profile.name);
  const hlsPlaylistPath = path.join(hlsDir, 'playlist.m3u8');

  logger.info(
    { profile: profile.name, resolution: `${profile.width}x${profile.height}` },
    'Starting transcode'
  );

  // Transcode to MP4
  await new Promise<void>((resolve, reject) => {
    ffmpeg(sourcePath)
      .outputOptions([
        `-c:v ${profile.codec === 'h264' ? 'libx264' : 'libx265'}`,
        `-preset ${profile.preset}`,
        `-b:v ${profile.bitrate}`,
        `-maxrate ${Math.floor(profile.bitrate * 1.5)}`,
        `-bufsize ${profile.bitrate * 2}`,
        `-vf scale=${profile.width}:${profile.height}:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=${profile.width}:${profile.height}:(ow-iw)/2:(oh-ih)/2`,
        `-c:a ${profile.audioCodec}`,
        `-b:a ${profile.audioBitrate}`,
        '-movflags +faststart',
        '-pix_fmt yuv420p',
      ])
      .output(mp4OutputPath)
      .on('start', (cmd) => logger.debug({ cmd }, 'FFmpeg MP4 command'))
      .on('stderr', (stderr) => logger.debug({ stderr }, 'FFmpeg stderr'))
      .on('progress', (progress) => {
        if (progress.percent) {
          logger.debug(
            { profile: profile.name, percent: progress.percent.toFixed(1) },
            'Transcode progress'
          );
        }
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });

  logger.info({ profile: profile.name, mp4Path: mp4OutputPath }, 'MP4 transcode complete');

  // Transcode to HLS
  await new Promise<void>((resolve, reject) => {
    ffmpeg(mp4OutputPath)
      .outputOptions([
        '-c:v copy',
        '-c:a copy',
        '-f hls',
        '-hls_time 6',
        '-hls_list_size 0',
        '-hls_segment_filename',
        path.join(hlsDir, 'segment_%03d.ts'),
      ])
      .output(hlsPlaylistPath)
      .on('start', async (cmd) => {
        logger.debug({ cmd }, 'FFmpeg HLS command');
        await fs.mkdir(hlsDir, { recursive: true });
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });

  logger.info({ profile: profile.name, hlsPath: hlsPlaylistPath }, 'HLS segmentation complete');

  return {
    mp4Path: mp4OutputPath,
    hlsPath: hlsPlaylistPath,
  };
}

export async function getVideoMetadata(
  filePath: string
): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
      if (!videoStream) {
        reject(new Error('No video stream found'));
        return;
      }

      resolve({
        duration: metadata.format.duration ?? 0,
        width: videoStream.width ?? 0,
        height: videoStream.height ?? 0,
      });
    });
  });
}
