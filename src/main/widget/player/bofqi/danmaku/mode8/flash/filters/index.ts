
/** 滤镜效果方法的键 */
export const applyFilter = Symbol('BitmapFilter');

/** 图像滤镜效果的基类 */
export interface BitmapFilter {
    /** 返回此滤镜对象的副本。 */
    clone(): this;
    /**
     * 将 BevelFilter 转换为 SVG 滤镜基元字符串
     * @param inPrimitive 上一个滤镜基元的输出结果ID，用于串联
     * @returns 包含 SVG 滤镜基元和其最终输出ID的对象
     */
    [applyFilter](inPrimitive: string): { primitives: string; result: string }
}