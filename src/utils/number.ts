
/**
 * 格式化进位
 * @param v 原始数字
 * @returns 格式化后的字符串
 */
export function unitFormat(v: number) {
    if (v < 1e4) {
        return v.toString();
    }

    v /= 1e4;

    if (v <= 1e4) {
        return `${v.toFixed(1)}万`;
    }

    v /= 1e4;
    return `${v.toFixed(1)}亿`;
}

/**
 * 生成指定闭区间的随机整数
 * @param min 整数最小值
 * @param max 整数最大值
 * @returns 随机整数
 */
export function randBetween(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}