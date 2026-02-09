export declare const config: {
    nodeEnv: "development" | "production" | "test";
    logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    kafka: {
        brokers: string[];
        groupId: string;
    };
    s3: {
        endpoint: string | undefined;
        accessKey: string;
        secretKey: string;
        bucketUploads: string;
        bucketOutputs: string;
        region: string;
        forcePathStyle: boolean;
    };
    tempDir: string;
    maxRetries: number;
    ffmpeg: {
        path: string | undefined;
        probePath: string | undefined;
    };
};
//# sourceMappingURL=config.d.ts.map