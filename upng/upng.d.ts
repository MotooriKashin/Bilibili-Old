export const UPNG: {
    /**
     * png encoder
     * @param imgs 帧数组。一帧为一个ArrayBuffer（8位RGBA）
     * @param w 图像的宽度
     * @param h 图像的高度
     * @param cnum 颜色数。0：所有颜色（无损PNG）
     * @param dels 每帧的毫秒延迟数组（仅当 2 或更多帧时）
     * @returns png文件数据
     */
    encode(imgs: ArrayBufferLike[], w: number, h: number, cnum: number, dels?: any): Uint8Array;
    /**
     * png encoder 低级编码  
     * 不做任何优化，只存储数据。适用于两种情况：  
     *    1. 保存 16 位颜色图片（big-endian）
     *    2. 图像数据过大，转换为8位RGBA会消耗过多内存
     * @param imgs 帧数组。一帧为一个ArrayBuffer（8位RGBA）
     * @param w 图像的宽度
     * @param h 图像的高度
     * @param cc 颜色通道数（1 或 3）
     * @param ac alpha 通道数（0 或 1）
     * @param depth 像素数据的位深度 (1, 2, 4, 8, 16)
     * @param dels 每帧的毫秒延迟数组（仅当 2 或更多帧时）
     * @returns png文件数据
     */
    encodeLL(imgs: ArrayBufferLike, w: number, h: number, cc: number, ac: number, depth: number, dels?: any): Uint8Array;
    /**
     * png decoder
     * @param buffer png文件数据
     */
    decode(buffer: ArrayBufferLike): IPNG;
    /**
     * png文件数据
     * @param img 帧数组。一帧为一个ArrayBuffer（8位RGBA）
     */
    toRGBA8(img: IPNG): Uint8Array[];
}

interface IPNG {
    /** 图像的宽度 */
    width: number;
    /** 图像的高度 */
    height: number;
    /** 像素数据的位深度 */
    depth: number;
    /** 颜色类型 */
    ctype: number;
    /** 帧数据 */
    frames: unknown[];
    /** 附加数据块 */
    tabs: Record<string, any>;
    /** 图像数据 */
    data: Uint8Array;
}