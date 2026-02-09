import type { Logger } from 'pino';
interface ThumbnailResult {
    filename: string;
    path: string;
    isPoster: boolean;
}
export declare function generateThumbnails(sourcePath: string, outputDir: string, logger: Logger): Promise<ThumbnailResult[]>;
export {};
//# sourceMappingURL=thumbnail.d.ts.map