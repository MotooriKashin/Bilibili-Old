export enum FNVAL {
    FLV = 0,
    MP4 = 1,
    DASH_H265 = 16,
    HDR = 64,
    DASH_4K = 128,
    DOLBYAUDIO = 256,
    DOLBYVIDEO = 512,
    DASH_8K = 1024,
    DASH_AV1 = 2048
}
/** 画质（8k） */
export const qn = 127;
/** 取流标记 */
export const fnver = 0;
/** 取流类型（av1） */
export const fnval = FNVAL.FLV
    + FNVAL.DASH_H265
    + FNVAL.HDR
    + FNVAL.DASH_4K
    + FNVAL.DOLBYAUDIO
    + FNVAL.DOLBYVIDEO
    + FNVAL.DASH_8K
    + FNVAL.DASH_AV1;