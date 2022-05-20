namespace API {
    /**
     * 格式化进位
     * @param num 正整数
     * @returns 进位结果
     * @example
     * unitFormat(10001) // 1万
     */
    export function unitFormat(num: number = 0) {
        num = 1 * num || 0;
        let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
        while (dex > 1) {
            if (num >= dex) {
                num = Number((num / dex).toFixed(1));
                break;
            }
            dex = dex / 10000;
            i--;
        }
        return num + unit[i];
    }
}