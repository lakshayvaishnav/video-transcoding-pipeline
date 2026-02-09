import type { Logger } from 'pino';
export declare function ensureTempDir(dir: string): Promise<void>;
export declare function cleanupTempDir(dir: string): Promise<void>;
export declare function downloadSourceFile(bucket: string, key: string, outputDir: string, logger: Logger): Promise<string>;
//# sourceMappingURL=fs.d.ts.map