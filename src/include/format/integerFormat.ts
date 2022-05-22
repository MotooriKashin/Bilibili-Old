namespace API {
    /**
     * 格式化整数
     * @param num 原始整数
     * @param byte 格式化位数
     * @returns 格式化结果
     * @example 
     * integerFormat(2, 3) // 结果：002
     * integerFormat(20, 1) // 结果：20（不变）
     */
    export function integerFormat(num: number, byte: number = 2) {
        return num < 10 ** byte ? (Array(byte).join('0') + num).slice(-1 * byte) : num;
    }
}