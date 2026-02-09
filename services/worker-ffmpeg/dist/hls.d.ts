import type { Logger } from 'pino';
interface VariantInfo {
    name: string;
    path: string;
    bandwidth: number;
}
export declare function generateHlsPlaylist(outputDir: string, variants: VariantInfo[], logger: Logger): Promise<string>;
export {};
//# sourceMappingURL=hls.d.ts.map