export declare const UploadStatus: {
    readonly PENDING: "PENDING";
    readonly UPLOADED: "UPLOADED";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus];
export declare const JobStatus: {
    readonly PENDING: "PENDING";
    readonly QUEUED: "QUEUED";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly CANCELLED: "CANCELLED";
};
export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
export declare const OutputType: {
    readonly HLS_MASTER: "HLS_MASTER";
    readonly HLS_VARIANT: "HLS_VARIANT";
    readonly MP4: "MP4";
    readonly THUMBNAIL: "THUMBNAIL";
    readonly POSTER: "POSTER";
};
export type OutputType = (typeof OutputType)[keyof typeof OutputType];
//# sourceMappingURL=enums.d.ts.map