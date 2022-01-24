/**
 * 本模块负责负责提供av/BV互转函数  
 * 感谢知乎mcfx的回答，在其python代码基础上翻译为JavaScript，源链接如下
 * @see mcfx {@link https://www.zhihu.com/question/381784377/answer/1099438784}
 * */
(function () {
    try {
        class Abv {
            base58Table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            digitMap = [11, 10, 3, 8, 4, 6];
            xor = 177451812;
            add = 8728348608;
            bvidTemplate = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
            table: { [name: string]: any } = {};
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
        let abv = new Abv();
        API.abv = (input: string | number) => abv.check(input);
    } catch (e) { toast.error("abv.js", e) }
})();
declare namespace API {
    /**
     * av <=> BV
     * @param input av/BV
     * @returns BV/aid
     */
    export function abv(input: string | number): string | number
}