/**
 * 提取随机子数组
 * @param res 原始数组
 * @param num 子数组大小
 * @returns 子数组，长度为1时直接返回该值。
 * @example
 * subArray([1, 2, 3], 2) // [1, 2]（结果之一）
 * subArray([1, 2, 3], 1) // 1（结果之一）
 */
export function subArray(res: any[], num: number = 1): any[] | any {
    const arr = [...res];
    const out = [];
    num = num || 1;
    num = num < arr.length ? num : arr.length;
    while (out.length < num) {
        var temp = (Math.random() * arr.length) >> 0;
        out.push(arr.splice(temp, 1)[0]);
    }
    return num === 1 ? out[0] : out;
}
