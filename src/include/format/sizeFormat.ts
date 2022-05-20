namespace API {
    /**
     * 格式化字节
     * @param size 字节/B
     * @returns 字节大小
     * @example 
     * sizeFormat(0) // N/A
     * sizeFormat(1024) // 1.00K
     */
    export function sizeFormat(size: number = 0) {
        let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
        while (dex > 1) {
            if (size >= vor) {
                size = Number((size / dex).toFixed(2));
                break;
            }
            dex = dex / 1024;
            vor = vor / 1000;
            i--;
        }
        return size ? size + unit[i] : "N/A";
    }
}