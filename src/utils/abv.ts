class Abv {
    base58Table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
    digitMap = [11, 10, 3, 8, 4, 6];
    xor = 177451812;
    add = 8728348608;
    bvidTemplate = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
    table: Record<string, number> = {};
    constructor() {
        for (let i = 0; i < 58; i++) this.table[this.base58Table[i]] = i;
    }
    /**
     * av/BV互转
     * @param input av或BV，可带av/BV前缀
     * @returns 转化结果
     */
    check(input: string | number) {
        if (/^[aA][vV][0-9]+$/.test(String(input)) || /^\d+$/.test(String(input))) return this.avToBv(Number((<RegExpExecArray>/[0-9]+/.exec(String(input)))[0]));
        if (/^1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}$/.test(String(input))) return this.bvToAv("BV" + input);
        if (/^[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}$/.test(String(input))) return this.bvToAv(String(input));
        throw input;
    }
    bvToAv(BV: string) {
        let r = 0;
        for (let i = 0; i < 6; i++) r += this.table[BV[this.digitMap[i]]] * 58 ** i;
        return (r - this.add) ^ this.xor;
    }
    avToBv(av: number) {
        let bv = Array.from(this.bvidTemplate);
        av = (av ^ this.xor) + this.add;
        for (let i = 0; i < 6; i++) bv[this.digitMap[i]] = this.base58Table[parseInt(String(av / 58 ** i)) % 58];
        return bv.join("");
    }
}
/**
 * av <=> BV
 * @param input av/BV
 * @returns BV/aid
 * @example
 * abv(170001) // BV17x411w7KC
 * abv("av170001") // BV17x411w7KC
 * abv("AV170001") // BV17x411w7KC
 * abv("BV17x411w7KC") // 170001
 * abv("17x411w7KC") // 170001
 */
export function abv(input: string | number) {
    return new Abv().check(input);
}
/**
 * 替换所有BV号为av号
 * @param str 含有BV号的字符串
 */
export function BV2avAll(str: string) {
    return str.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (s: string) => "av" + abv(s));
}