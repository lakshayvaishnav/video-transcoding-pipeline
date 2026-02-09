import fs from 'fs/promises';
import path from 'path';
import type { Logger } from 'pino';

interface VariantInfo {
  name: string;
  path: string;
  bandwidth: number;
}

export async function generateHlsPlaylist(
  outputDir: string,
  variants: VariantInfo[],
  logger: Logger
): Promise<string> {
  const masterPlaylistPath = path.join(outputDir, 'hls', 'master.m3u8');

  // Build master playlist content
  let content = '#EXTM3U\n';
  content += '#EXT-X-VERSION:3\n\n';

  // Sort variants by bandwidth (highest first for adaptive streaming)
  const sortedVariants = [...variants].sort((a, b) => b.bandwidth - a.bandwidth);

  for (const variant of sortedVariants) {
    const resolution = getResolutionFromName(variant.name);
    content += `#EXT-X-STREAM-INF:BANDWIDTH=${variant.bandwidth},RESOLUTION=${resolution},NAME="${variant.name}"\n`;
    content += `${variant.name}/playlist.m3u8\n`;
  }

  // Ensure directory exists
  await fs.mkdir(path.dirname(masterPlaylistPath), { recursive: true });
  await fs.writeFile(masterPlaylistPath, content, 'utf-8');

  logger.info({ path: masterPlaylistPath, variants: variants.length }, 'Master playlist generated');

  return masterPlaylistPath;
}

function getResolutionFromName(name: string): string {
  const resolutions: Record<string, string> = {
    '1080p': '1920x1080',
    '720p': '1280x720',
    '480p': '854x480',
    '360p': '640x360',
    '240p': '426x240',
  };
  return resolutions[name] ?? '1920x1080';
}
