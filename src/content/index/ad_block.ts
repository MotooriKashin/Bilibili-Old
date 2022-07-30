/**
 * 广告过滤
 * @param prev 原始locsData
 * @returns 无广告数据
 */
export function adblock(prev: Record<"is_ad", boolean>[]) {
    return prev.filter(d => !d.is_ad);
}