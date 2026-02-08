export declare const config: {
    server: {
        port: number;
        host: string;
        nodeEnv: "development" | "production" | "test";
        logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    };
    database: {
        url: string;
    };
    redis: {
        url: string;
    };
    kafka: {
        brokers: string[];
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
    auth: {
        jwtSecret: string;
        jwtExpiresIn: string;
    };
};
export type Config = typeof config;
//# sourceMappingURL=config.d.ts.map