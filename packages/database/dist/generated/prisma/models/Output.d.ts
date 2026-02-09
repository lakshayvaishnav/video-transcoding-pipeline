import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Output
 *
 */
export type OutputModel = runtime.Types.Result.DefaultSelection<Prisma.$OutputPayload>;
export type AggregateOutput = {
    _count: OutputCountAggregateOutputType | null;
    _avg: OutputAvgAggregateOutputType | null;
    _sum: OutputSumAggregateOutputType | null;
    _min: OutputMinAggregateOutputType | null;
    _max: OutputMaxAggregateOutputType | null;
};
export type OutputAvgAggregateOutputType = {
    bitrate: number | null;
    size: number | null;
    duration: number | null;
};
export type OutputSumAggregateOutputType = {
    bitrate: number | null;
    size: bigint | null;
    duration: number | null;
};
export type OutputMinAggregateOutputType = {
    id: string | null;
    jobId: string | null;
    type: $Enums.OutputType | null;
    path: string | null;
    profileName: string | null;
    resolution: string | null;
    bitrate: number | null;
    size: bigint | null;
    duration: number | null;
    manifestUrl: string | null;
    createdAt: Date | null;
};
export type OutputMaxAggregateOutputType = {
    id: string | null;
    jobId: string | null;
    type: $Enums.OutputType | null;
    path: string | null;
    profileName: string | null;
    resolution: string | null;
    bitrate: number | null;
    size: bigint | null;
    duration: number | null;
    manifestUrl: string | null;
    createdAt: Date | null;
};
export type OutputCountAggregateOutputType = {
    id: number;
    jobId: number;
    type: number;
    path: number;
    profileName: number;
    resolution: number;
    bitrate: number;
    size: number;
    duration: number;
    manifestUrl: number;
    createdAt: number;
    _all: number;
};
export type OutputAvgAggregateInputType = {
    bitrate?: true;
    size?: true;
    duration?: true;
};
export type OutputSumAggregateInputType = {
    bitrate?: true;
    size?: true;
    duration?: true;
};
export type OutputMinAggregateInputType = {
    id?: true;
    jobId?: true;
    type?: true;
    path?: true;
    profileName?: true;
    resolution?: true;
    bitrate?: true;
    size?: true;
    duration?: true;
    manifestUrl?: true;
    createdAt?: true;
};
export type OutputMaxAggregateInputType = {
    id?: true;
    jobId?: true;
    type?: true;
    path?: true;
    profileName?: true;
    resolution?: true;
    bitrate?: true;
    size?: true;
    duration?: true;
    manifestUrl?: true;
    createdAt?: true;
};
export type OutputCountAggregateInputType = {
    id?: true;
    jobId?: true;
    type?: true;
    path?: true;
    profileName?: true;
    resolution?: true;
    bitrate?: true;
    size?: true;
    duration?: true;
    manifestUrl?: true;
    createdAt?: true;
    _all?: true;
};
export type OutputAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Output to aggregate.
     */
    where?: Prisma.OutputWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Outputs to fetch.
     */
    orderBy?: Prisma.OutputOrderByWithRelationInput | Prisma.OutputOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OutputWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Outputs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Outputs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Outputs
    **/
    _count?: true | OutputCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: OutputAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: OutputSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OutputMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OutputMaxAggregateInputType;
};
export type GetOutputAggregateType<T extends OutputAggregateArgs> = {
    [P in keyof T & keyof AggregateOutput]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOutput[P]> : Prisma.GetScalarType<T[P], AggregateOutput[P]>;
};
export type OutputGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OutputWhereInput;
    orderBy?: Prisma.OutputOrderByWithAggregationInput | Prisma.OutputOrderByWithAggregationInput[];
    by: Prisma.OutputScalarFieldEnum[] | Prisma.OutputScalarFieldEnum;
    having?: Prisma.OutputScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OutputCountAggregateInputType | true;
    _avg?: OutputAvgAggregateInputType;
    _sum?: OutputSumAggregateInputType;
    _min?: OutputMinAggregateInputType;
    _max?: OutputMaxAggregateInputType;
};
export type OutputGroupByOutputType = {
    id: string;
    jobId: string;
    type: $Enums.OutputType;
    path: string;
    profileName: string | null;
    resolution: string | null;
    bitrate: number | null;
    size: bigint | null;
    duration: number | null;
    manifestUrl: string | null;
    createdAt: Date;
    _count: OutputCountAggregateOutputType | null;
    _avg: OutputAvgAggregateOutputType | null;
    _sum: OutputSumAggregateOutputType | null;
    _min: OutputMinAggregateOutputType | null;
    _max: OutputMaxAggregateOutputType | null;
};
type GetOutputGroupByPayload<T extends OutputGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OutputGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OutputGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OutputGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OutputGroupByOutputType[P]>;
}>>;
export type OutputWhereInput = {
    AND?: Prisma.OutputWhereInput | Prisma.OutputWhereInput[];
    OR?: Prisma.OutputWhereInput[];
    NOT?: Prisma.OutputWhereInput | Prisma.OutputWhereInput[];
    id?: Prisma.StringFilter<"Output"> | string;
    jobId?: Prisma.StringFilter<"Output"> | string;
    type?: Prisma.EnumOutputTypeFilter<"Output"> | $Enums.OutputType;
    path?: Prisma.StringFilter<"Output"> | string;
    profileName?: Prisma.StringNullableFilter<"Output"> | string | null;
    resolution?: Prisma.StringNullableFilter<"Output"> | string | null;
    bitrate?: Prisma.IntNullableFilter<"Output"> | number | null;
    size?: Prisma.BigIntNullableFilter<"Output"> | bigint | number | null;
    duration?: Prisma.FloatNullableFilter<"Output"> | number | null;
    manifestUrl?: Prisma.StringNullableFilter<"Output"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Output"> | Date | string;
    job?: Prisma.XOR<Prisma.TranscodeJobScalarRelationFilter, Prisma.TranscodeJobWhereInput>;
};
export type OutputOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    path?: Prisma.SortOrder;
    profileName?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolution?: Prisma.SortOrderInput | Prisma.SortOrder;
    bitrate?: Prisma.SortOrderInput | Prisma.SortOrder;
    size?: Prisma.SortOrderInput | Prisma.SortOrder;
    duration?: Prisma.SortOrderInput | Prisma.SortOrder;
    manifestUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    job?: Prisma.TranscodeJobOrderByWithRelationInput;
};
export type OutputWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OutputWhereInput | Prisma.OutputWhereInput[];
    OR?: Prisma.OutputWhereInput[];
    NOT?: Prisma.OutputWhereInput | Prisma.OutputWhereInput[];
    jobId?: Prisma.StringFilter<"Output"> | string;
    type?: Prisma.EnumOutputTypeFilter<"Output"> | $Enums.OutputType;
    path?: Prisma.StringFilter<"Output"> | string;
    profileName?: Prisma.StringNullableFilter<"Output"> | string | null;
    resolution?: Prisma.StringNullableFilter<"Output"> | string | null;
    bitrate?: Prisma.IntNullableFilter<"Output"> | number | null;
    size?: Prisma.BigIntNullableFilter<"Output"> | bigint | number | null;
    duration?: Prisma.FloatNullableFilter<"Output"> | number | null;
    manifestUrl?: Prisma.StringNullableFilter<"Output"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Output"> | Date | string;
    job?: Prisma.XOR<Prisma.TranscodeJobScalarRelationFilter, Prisma.TranscodeJobWhereInput>;
}, "id">;
export type OutputOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    path?: Prisma.SortOrder;
    profileName?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolution?: Prisma.SortOrderInput | Prisma.SortOrder;
    bitrate?: Prisma.SortOrderInput | Prisma.SortOrder;
    size?: Prisma.SortOrderInput | Prisma.SortOrder;
    duration?: Prisma.SortOrderInput | Prisma.SortOrder;
    manifestUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.OutputCountOrderByAggregateInput;
    _avg?: Prisma.OutputAvgOrderByAggregateInput;
    _max?: Prisma.OutputMaxOrderByAggregateInput;
    _min?: Prisma.OutputMinOrderByAggregateInput;
    _sum?: Prisma.OutputSumOrderByAggregateInput;
};
export type OutputScalarWhereWithAggregatesInput = {
    AND?: Prisma.OutputScalarWhereWithAggregatesInput | Prisma.OutputScalarWhereWithAggregatesInput[];
    OR?: Prisma.OutputScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OutputScalarWhereWithAggregatesInput | Prisma.OutputScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Output"> | string;
    jobId?: Prisma.StringWithAggregatesFilter<"Output"> | string;
    type?: Prisma.EnumOutputTypeWithAggregatesFilter<"Output"> | $Enums.OutputType;
    path?: Prisma.StringWithAggregatesFilter<"Output"> | string;
    profileName?: Prisma.StringNullableWithAggregatesFilter<"Output"> | string | null;
    resolution?: Prisma.StringNullableWithAggregatesFilter<"Output"> | string | null;
    bitrate?: Prisma.IntNullableWithAggregatesFilter<"Output"> | number | null;
    size?: Prisma.BigIntNullableWithAggregatesFilter<"Output"> | bigint | number | null;
    duration?: Prisma.FloatNullableWithAggregatesFilter<"Output"> | number | null;
    manifestUrl?: Prisma.StringNullableWithAggregatesFilter<"Output"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Output"> | Date | string;
};
export type OutputCreateInput = {
    id?: string;
    type: $Enums.OutputType;
    path: string;
    profileName?: string | null;
    resolution?: string | null;
    bitrate?: number | null;
    size?: bigint | number | null;
    duration?: number | null;
    manifestUrl?: string | null;
    createdAt?: Date | string;
    job: Prisma.TranscodeJobCreateNestedOneWithoutOutputsInput;
};
export type OutputUncheckedCreateInput = {
    id?: string;
    jobId: string;
    type: $Enums.OutputType;
    path: string;
    profileName?: string | null;
    resolution?: string | null;
    bitrate?: number | null;
    size?: bigint | number | null;
    duration?: number | null;
    manifestUrl?: string | null;
    createdAt?: Date | string;
};
export type OutputUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumOutputTypeFieldUpdateOperationsInput | $Enums.OutputType;
    path?: Prisma.StringFieldUpdateOperationsInput | string;
    profileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bitrate?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    size?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    duration?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    manifestUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    job?: Prisma.TranscodeJobUpdateOneRequiredWithoutOutputsNestedInput;
};
export type OutputUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jobId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumOutputTypeFieldUpdateOperationsInput | $Enums.OutputType;
    path?: Prisma.StringFieldUpdateOperationsInput | string;
    profileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bitrate?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    size?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    duration?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    manifestUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OutputCreateManyInput = {
    id?: string;
    jobId: string;
    type: $Enums.OutputType;
    path: string;
    profileName?: string | null;
    resolution?: string | null;
    bitrate?: number | null;
    size?: bigint | number | null;
    duration?: number | null;
    manifestUrl?: string | null;
    createdAt?: Date | string;
};
export type OutputUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumOutputTypeFieldUpdateOperationsInput | $Enums.OutputType;
    path?: Prisma.StringFieldUpdateOperationsInput | string;
    profileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bitrate?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    size?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    duration?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    manifestUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OutputUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jobId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumOutputTypeFieldUpdateOperationsInput | $Enums.OutputType;
    path?: Prisma.StringFieldUpdateOperationsInput | string;
    profileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bitrate?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    size?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    duration?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    manifestUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OutputListRelationFilter = {
    every?: Prisma.OutputWhereInput;
    some?: Prisma.OutputWhereInput;
    none?: Prisma.OutputWhereInput;
};
export type OutputOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OutputCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    path?: Prisma.SortOrder;
    profileName?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    bitrate?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    manifestUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OutputAvgOrderByAggregateInput = {
    bitrate?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
};
export type OutputMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    path?: Prisma.SortOrder;
    profileName?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    bitrate?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    manifestUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OutputMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    jobId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    path?: Prisma.SortOrder;
    profileName?: Prisma.SortOrder;
    resolution?: Prisma.SortOrder;
    bitrate?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    manifestUrl?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OutputSumOrderByAggregateInput = {
    bitrate?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
};
export type OutputCreateNestedManyWithoutJobInput = {
    create?: Prisma.XOR<Prisma.OutputCreateWithoutJobInput, Prisma.OutputUncheckedCreateWithoutJobInput> | Prisma.OutputCreateWithoutJobInput[] | Prisma.OutputUncheckedCreateWithoutJobInput[];
    connectOrCreate?: Prisma.OutputCreateOrConnectWithoutJobInput | Prisma.OutputCreateOrConnectWithoutJobInput[];
    createMany?: Prisma.OutputCreateManyJobInputEnvelope;
    connect?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
};
export type OutputUncheckedCreateNestedManyWithoutJobInput = {
    create?: Prisma.XOR<Prisma.OutputCreateWithoutJobInput, Prisma.OutputUncheckedCreateWithoutJobInput> | Prisma.OutputCreateWithoutJobInput[] | Prisma.OutputUncheckedCreateWithoutJobInput[];
    connectOrCreate?: Prisma.OutputCreateOrConnectWithoutJobInput | Prisma.OutputCreateOrConnectWithoutJobInput[];
    createMany?: Prisma.OutputCreateManyJobInputEnvelope;
    connect?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
};
export type OutputUpdateManyWithoutJobNestedInput = {
    create?: Prisma.XOR<Prisma.OutputCreateWithoutJobInput, Prisma.OutputUncheckedCreateWithoutJobInput> | Prisma.OutputCreateWithoutJobInput[] | Prisma.OutputUncheckedCreateWithoutJobInput[];
    connectOrCreate?: Prisma.OutputCreateOrConnectWithoutJobInput | Prisma.OutputCreateOrConnectWithoutJobInput[];
    upsert?: Prisma.OutputUpsertWithWhereUniqueWithoutJobInput | Prisma.OutputUpsertWithWhereUniqueWithoutJobInput[];
    createMany?: Prisma.OutputCreateManyJobInputEnvelope;
    set?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
    disconnect?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
    delete?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
    connect?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
    update?: Prisma.OutputUpdateWithWhereUniqueWithoutJobInput | Prisma.OutputUpdateWithWhereUniqueWithoutJobInput[];
    updateMany?: Prisma.OutputUpdateManyWithWhereWithoutJobInput | Prisma.OutputUpdateManyWithWhereWithoutJobInput[];
    deleteMany?: Prisma.OutputScalarWhereInput | Prisma.OutputScalarWhereInput[];
};
export type OutputUncheckedUpdateManyWithoutJobNestedInput = {
    create?: Prisma.XOR<Prisma.OutputCreateWithoutJobInput, Prisma.OutputUncheckedCreateWithoutJobInput> | Prisma.OutputCreateWithoutJobInput[] | Prisma.OutputUncheckedCreateWithoutJobInput[];
    connectOrCreate?: Prisma.OutputCreateOrConnectWithoutJobInput | Prisma.OutputCreateOrConnectWithoutJobInput[];
    upsert?: Prisma.OutputUpsertWithWhereUniqueWithoutJobInput | Prisma.OutputUpsertWithWhereUniqueWithoutJobInput[];
    createMany?: Prisma.OutputCreateManyJobInputEnvelope;
    set?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
    disconnect?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
    delete?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
    connect?: Prisma.OutputWhereUniqueInput | Prisma.OutputWhereUniqueInput[];
    update?: Prisma.OutputUpdateWithWhereUniqueWithoutJobInput | Prisma.OutputUpdateWithWhereUniqueWithoutJobInput[];
    updateMany?: Prisma.OutputUpdateManyWithWhereWithoutJobInput | Prisma.OutputUpdateManyWithWhereWithoutJobInput[];
    deleteMany?: Prisma.OutputScalarWhereInput | Prisma.OutputScalarWhereInput[];
};
export type EnumOutputTypeFieldUpdateOperationsInput = {
    set?: $Enums.OutputType;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type OutputCreateWithoutJobInput = {
    id?: string;
    type: $Enums.OutputType;
    path: string;
    profileName?: string | null;
    resolution?: string | null;
    bitrate?: number | null;
    size?: bigint | number | null;
    duration?: number | null;
    manifestUrl?: string | null;
    createdAt?: Date | string;
};
export type OutputUncheckedCreateWithoutJobInput = {
    id?: string;
    type: $Enums.OutputType;
    path: string;
    profileName?: string | null;
    resolution?: string | null;
    bitrate?: number | null;
    size?: bigint | number | null;
    duration?: number | null;
    manifestUrl?: string | null;
    createdAt?: Date | string;
};
export type OutputCreateOrConnectWithoutJobInput = {
    where: Prisma.OutputWhereUniqueInput;
    create: Prisma.XOR<Prisma.OutputCreateWithoutJobInput, Prisma.OutputUncheckedCreateWithoutJobInput>;
};
export type OutputCreateManyJobInputEnvelope = {
    data: Prisma.OutputCreateManyJobInput | Prisma.OutputCreateManyJobInput[];
    skipDuplicates?: boolean;
};
export type OutputUpsertWithWhereUniqueWithoutJobInput = {
    where: Prisma.OutputWhereUniqueInput;
    update: Prisma.XOR<Prisma.OutputUpdateWithoutJobInput, Prisma.OutputUncheckedUpdateWithoutJobInput>;
    create: Prisma.XOR<Prisma.OutputCreateWithoutJobInput, Prisma.OutputUncheckedCreateWithoutJobInput>;
};
export type OutputUpdateWithWhereUniqueWithoutJobInput = {
    where: Prisma.OutputWhereUniqueInput;
    data: Prisma.XOR<Prisma.OutputUpdateWithoutJobInput, Prisma.OutputUncheckedUpdateWithoutJobInput>;
};
export type OutputUpdateManyWithWhereWithoutJobInput = {
    where: Prisma.OutputScalarWhereInput;
    data: Prisma.XOR<Prisma.OutputUpdateManyMutationInput, Prisma.OutputUncheckedUpdateManyWithoutJobInput>;
};
export type OutputScalarWhereInput = {
    AND?: Prisma.OutputScalarWhereInput | Prisma.OutputScalarWhereInput[];
    OR?: Prisma.OutputScalarWhereInput[];
    NOT?: Prisma.OutputScalarWhereInput | Prisma.OutputScalarWhereInput[];
    id?: Prisma.StringFilter<"Output"> | string;
    jobId?: Prisma.StringFilter<"Output"> | string;
    type?: Prisma.EnumOutputTypeFilter<"Output"> | $Enums.OutputType;
    path?: Prisma.StringFilter<"Output"> | string;
    profileName?: Prisma.StringNullableFilter<"Output"> | string | null;
    resolution?: Prisma.StringNullableFilter<"Output"> | string | null;
    bitrate?: Prisma.IntNullableFilter<"Output"> | number | null;
    size?: Prisma.BigIntNullableFilter<"Output"> | bigint | number | null;
    duration?: Prisma.FloatNullableFilter<"Output"> | number | null;
    manifestUrl?: Prisma.StringNullableFilter<"Output"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Output"> | Date | string;
};
export type OutputCreateManyJobInput = {
    id?: string;
    type: $Enums.OutputType;
    path: string;
    profileName?: string | null;
    resolution?: string | null;
    bitrate?: number | null;
    size?: bigint | number | null;
    duration?: number | null;
    manifestUrl?: string | null;
    createdAt?: Date | string;
};
export type OutputUpdateWithoutJobInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumOutputTypeFieldUpdateOperationsInput | $Enums.OutputType;
    path?: Prisma.StringFieldUpdateOperationsInput | string;
    profileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bitrate?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    size?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    duration?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    manifestUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OutputUncheckedUpdateWithoutJobInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumOutputTypeFieldUpdateOperationsInput | $Enums.OutputType;
    path?: Prisma.StringFieldUpdateOperationsInput | string;
    profileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bitrate?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    size?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    duration?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    manifestUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OutputUncheckedUpdateManyWithoutJobInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumOutputTypeFieldUpdateOperationsInput | $Enums.OutputType;
    path?: Prisma.StringFieldUpdateOperationsInput | string;
    profileName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resolution?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bitrate?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    size?: Prisma.NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    duration?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    manifestUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OutputSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    jobId?: boolean;
    type?: boolean;
    path?: boolean;
    profileName?: boolean;
    resolution?: boolean;
    bitrate?: boolean;
    size?: boolean;
    duration?: boolean;
    manifestUrl?: boolean;
    createdAt?: boolean;
    job?: boolean | Prisma.TranscodeJobDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["output"]>;
export type OutputSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    jobId?: boolean;
    type?: boolean;
    path?: boolean;
    profileName?: boolean;
    resolution?: boolean;
    bitrate?: boolean;
    size?: boolean;
    duration?: boolean;
    manifestUrl?: boolean;
    createdAt?: boolean;
    job?: boolean | Prisma.TranscodeJobDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["output"]>;
export type OutputSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    jobId?: boolean;
    type?: boolean;
    path?: boolean;
    profileName?: boolean;
    resolution?: boolean;
    bitrate?: boolean;
    size?: boolean;
    duration?: boolean;
    manifestUrl?: boolean;
    createdAt?: boolean;
    job?: boolean | Prisma.TranscodeJobDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["output"]>;
export type OutputSelectScalar = {
    id?: boolean;
    jobId?: boolean;
    type?: boolean;
    path?: boolean;
    profileName?: boolean;
    resolution?: boolean;
    bitrate?: boolean;
    size?: boolean;
    duration?: boolean;
    manifestUrl?: boolean;
    createdAt?: boolean;
};
export type OutputOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "jobId" | "type" | "path" | "profileName" | "resolution" | "bitrate" | "size" | "duration" | "manifestUrl" | "createdAt", ExtArgs["result"]["output"]>;
export type OutputInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    job?: boolean | Prisma.TranscodeJobDefaultArgs<ExtArgs>;
};
export type OutputIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    job?: boolean | Prisma.TranscodeJobDefaultArgs<ExtArgs>;
};
export type OutputIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    job?: boolean | Prisma.TranscodeJobDefaultArgs<ExtArgs>;
};
export type $OutputPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Output";
    objects: {
        job: Prisma.$TranscodeJobPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        jobId: string;
        type: $Enums.OutputType;
        path: string;
        profileName: string | null;
        resolution: string | null;
        bitrate: number | null;
        size: bigint | null;
        duration: number | null;
        manifestUrl: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["output"]>;
    composites: {};
};
export type OutputGetPayload<S extends boolean | null | undefined | OutputDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OutputPayload, S>;
export type OutputCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OutputFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OutputCountAggregateInputType | true;
};
export interface OutputDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Output'];
        meta: {
            name: 'Output';
        };
    };
    /**
     * Find zero or one Output that matches the filter.
     * @param {OutputFindUniqueArgs} args - Arguments to find a Output
     * @example
     * // Get one Output
     * const output = await prisma.output.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OutputFindUniqueArgs>(args: Prisma.SelectSubset<T, OutputFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OutputClient<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Output that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OutputFindUniqueOrThrowArgs} args - Arguments to find a Output
     * @example
     * // Get one Output
     * const output = await prisma.output.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OutputFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OutputFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OutputClient<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Output that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutputFindFirstArgs} args - Arguments to find a Output
     * @example
     * // Get one Output
     * const output = await prisma.output.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OutputFindFirstArgs>(args?: Prisma.SelectSubset<T, OutputFindFirstArgs<ExtArgs>>): Prisma.Prisma__OutputClient<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Output that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutputFindFirstOrThrowArgs} args - Arguments to find a Output
     * @example
     * // Get one Output
     * const output = await prisma.output.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OutputFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OutputFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OutputClient<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Outputs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutputFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Outputs
     * const outputs = await prisma.output.findMany()
     *
     * // Get first 10 Outputs
     * const outputs = await prisma.output.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const outputWithIdOnly = await prisma.output.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OutputFindManyArgs>(args?: Prisma.SelectSubset<T, OutputFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Output.
     * @param {OutputCreateArgs} args - Arguments to create a Output.
     * @example
     * // Create one Output
     * const Output = await prisma.output.create({
     *   data: {
     *     // ... data to create a Output
     *   }
     * })
     *
     */
    create<T extends OutputCreateArgs>(args: Prisma.SelectSubset<T, OutputCreateArgs<ExtArgs>>): Prisma.Prisma__OutputClient<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Outputs.
     * @param {OutputCreateManyArgs} args - Arguments to create many Outputs.
     * @example
     * // Create many Outputs
     * const output = await prisma.output.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OutputCreateManyArgs>(args?: Prisma.SelectSubset<T, OutputCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Outputs and returns the data saved in the database.
     * @param {OutputCreateManyAndReturnArgs} args - Arguments to create many Outputs.
     * @example
     * // Create many Outputs
     * const output = await prisma.output.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Outputs and only return the `id`
     * const outputWithIdOnly = await prisma.output.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OutputCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OutputCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Output.
     * @param {OutputDeleteArgs} args - Arguments to delete one Output.
     * @example
     * // Delete one Output
     * const Output = await prisma.output.delete({
     *   where: {
     *     // ... filter to delete one Output
     *   }
     * })
     *
     */
    delete<T extends OutputDeleteArgs>(args: Prisma.SelectSubset<T, OutputDeleteArgs<ExtArgs>>): Prisma.Prisma__OutputClient<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Output.
     * @param {OutputUpdateArgs} args - Arguments to update one Output.
     * @example
     * // Update one Output
     * const output = await prisma.output.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OutputUpdateArgs>(args: Prisma.SelectSubset<T, OutputUpdateArgs<ExtArgs>>): Prisma.Prisma__OutputClient<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Outputs.
     * @param {OutputDeleteManyArgs} args - Arguments to filter Outputs to delete.
     * @example
     * // Delete a few Outputs
     * const { count } = await prisma.output.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OutputDeleteManyArgs>(args?: Prisma.SelectSubset<T, OutputDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Outputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutputUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Outputs
     * const output = await prisma.output.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OutputUpdateManyArgs>(args: Prisma.SelectSubset<T, OutputUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Outputs and returns the data updated in the database.
     * @param {OutputUpdateManyAndReturnArgs} args - Arguments to update many Outputs.
     * @example
     * // Update many Outputs
     * const output = await prisma.output.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Outputs and only return the `id`
     * const outputWithIdOnly = await prisma.output.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends OutputUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OutputUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Output.
     * @param {OutputUpsertArgs} args - Arguments to update or create a Output.
     * @example
     * // Update or create a Output
     * const output = await prisma.output.upsert({
     *   create: {
     *     // ... data to create a Output
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Output we want to update
     *   }
     * })
     */
    upsert<T extends OutputUpsertArgs>(args: Prisma.SelectSubset<T, OutputUpsertArgs<ExtArgs>>): Prisma.Prisma__OutputClient<runtime.Types.Result.GetResult<Prisma.$OutputPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Outputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutputCountArgs} args - Arguments to filter Outputs to count.
     * @example
     * // Count the number of Outputs
     * const count = await prisma.output.count({
     *   where: {
     *     // ... the filter for the Outputs we want to count
     *   }
     * })
    **/
    count<T extends OutputCountArgs>(args?: Prisma.Subset<T, OutputCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OutputCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Output.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutputAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OutputAggregateArgs>(args: Prisma.Subset<T, OutputAggregateArgs>): Prisma.PrismaPromise<GetOutputAggregateType<T>>;
    /**
     * Group by Output.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutputGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends OutputGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OutputGroupByArgs['orderBy'];
    } : {
        orderBy?: OutputGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OutputGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOutputGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Output model
     */
    readonly fields: OutputFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Output.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OutputClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    job<T extends Prisma.TranscodeJobDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TranscodeJobDefaultArgs<ExtArgs>>): Prisma.Prisma__TranscodeJobClient<runtime.Types.Result.GetResult<Prisma.$TranscodeJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Output model
 */
export interface OutputFieldRefs {
    readonly id: Prisma.FieldRef<"Output", 'String'>;
    readonly jobId: Prisma.FieldRef<"Output", 'String'>;
    readonly type: Prisma.FieldRef<"Output", 'OutputType'>;
    readonly path: Prisma.FieldRef<"Output", 'String'>;
    readonly profileName: Prisma.FieldRef<"Output", 'String'>;
    readonly resolution: Prisma.FieldRef<"Output", 'String'>;
    readonly bitrate: Prisma.FieldRef<"Output", 'Int'>;
    readonly size: Prisma.FieldRef<"Output", 'BigInt'>;
    readonly duration: Prisma.FieldRef<"Output", 'Float'>;
    readonly manifestUrl: Prisma.FieldRef<"Output", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Output", 'DateTime'>;
}
/**
 * Output findUnique
 */
export type OutputFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * Filter, which Output to fetch.
     */
    where: Prisma.OutputWhereUniqueInput;
};
/**
 * Output findUniqueOrThrow
 */
export type OutputFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * Filter, which Output to fetch.
     */
    where: Prisma.OutputWhereUniqueInput;
};
/**
 * Output findFirst
 */
export type OutputFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * Filter, which Output to fetch.
     */
    where?: Prisma.OutputWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Outputs to fetch.
     */
    orderBy?: Prisma.OutputOrderByWithRelationInput | Prisma.OutputOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Outputs.
     */
    cursor?: Prisma.OutputWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Outputs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Outputs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Outputs.
     */
    distinct?: Prisma.OutputScalarFieldEnum | Prisma.OutputScalarFieldEnum[];
};
/**
 * Output findFirstOrThrow
 */
export type OutputFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * Filter, which Output to fetch.
     */
    where?: Prisma.OutputWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Outputs to fetch.
     */
    orderBy?: Prisma.OutputOrderByWithRelationInput | Prisma.OutputOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Outputs.
     */
    cursor?: Prisma.OutputWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Outputs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Outputs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Outputs.
     */
    distinct?: Prisma.OutputScalarFieldEnum | Prisma.OutputScalarFieldEnum[];
};
/**
 * Output findMany
 */
export type OutputFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * Filter, which Outputs to fetch.
     */
    where?: Prisma.OutputWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Outputs to fetch.
     */
    orderBy?: Prisma.OutputOrderByWithRelationInput | Prisma.OutputOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Outputs.
     */
    cursor?: Prisma.OutputWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Outputs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Outputs.
     */
    skip?: number;
    distinct?: Prisma.OutputScalarFieldEnum | Prisma.OutputScalarFieldEnum[];
};
/**
 * Output create
 */
export type OutputCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * The data needed to create a Output.
     */
    data: Prisma.XOR<Prisma.OutputCreateInput, Prisma.OutputUncheckedCreateInput>;
};
/**
 * Output createMany
 */
export type OutputCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Outputs.
     */
    data: Prisma.OutputCreateManyInput | Prisma.OutputCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Output createManyAndReturn
 */
export type OutputCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * The data used to create many Outputs.
     */
    data: Prisma.OutputCreateManyInput | Prisma.OutputCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * Output update
 */
export type OutputUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * The data needed to update a Output.
     */
    data: Prisma.XOR<Prisma.OutputUpdateInput, Prisma.OutputUncheckedUpdateInput>;
    /**
     * Choose, which Output to update.
     */
    where: Prisma.OutputWhereUniqueInput;
};
/**
 * Output updateMany
 */
export type OutputUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Outputs.
     */
    data: Prisma.XOR<Prisma.OutputUpdateManyMutationInput, Prisma.OutputUncheckedUpdateManyInput>;
    /**
     * Filter which Outputs to update
     */
    where?: Prisma.OutputWhereInput;
    /**
     * Limit how many Outputs to update.
     */
    limit?: number;
};
/**
 * Output updateManyAndReturn
 */
export type OutputUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * The data used to update Outputs.
     */
    data: Prisma.XOR<Prisma.OutputUpdateManyMutationInput, Prisma.OutputUncheckedUpdateManyInput>;
    /**
     * Filter which Outputs to update
     */
    where?: Prisma.OutputWhereInput;
    /**
     * Limit how many Outputs to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * Output upsert
 */
export type OutputUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * The filter to search for the Output to update in case it exists.
     */
    where: Prisma.OutputWhereUniqueInput;
    /**
     * In case the Output found by the `where` argument doesn't exist, create a new Output with this data.
     */
    create: Prisma.XOR<Prisma.OutputCreateInput, Prisma.OutputUncheckedCreateInput>;
    /**
     * In case the Output was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OutputUpdateInput, Prisma.OutputUncheckedUpdateInput>;
};
/**
 * Output delete
 */
export type OutputDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
    /**
     * Filter which Output to delete.
     */
    where: Prisma.OutputWhereUniqueInput;
};
/**
 * Output deleteMany
 */
export type OutputDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Outputs to delete
     */
    where?: Prisma.OutputWhereInput;
    /**
     * Limit how many Outputs to delete.
     */
    limit?: number;
};
/**
 * Output without action
 */
export type OutputDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Output
     */
    select?: Prisma.OutputSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Output
     */
    omit?: Prisma.OutputOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OutputInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Output.d.ts.map