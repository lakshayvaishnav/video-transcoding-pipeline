import type { Logger } from 'pino';
import type { TranscodeProfile } from '@video-transcoder/shared-types';
interface TranscodeResult {
    mp4Path: string;
    hlsPath: string;
}
export declare function transcodeToProfile(sourcePath: string, outputDir: string, profile: TranscodeProfile, logger: Logger): Promise<TranscodeResult>;
export declare function getVideoMetadata(filePath: string): Promise<{
    duration: number;
    width: number;
    height: number;
}>;
export {};
//# sourceMappingURL=transcoder.d.ts.map