import { objUrl, urlObj } from "../format/url.js";
import { md5 } from "./md5.js";

class Sign {
    static table = [
        "rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg", // iVGU...uDCf
        "/a_206b`_.61.bca6117.175bcdadc41850c010c..././1``", // bb31...2e27
        "157bdd`6/bc73632.bcd660baa03a.43841211032b5c4`6b/", // 1d8b...3436
        "351a7a6b/.b`d77da1cdccc25_13bc0a81a6d63.7ad13`c50", // 27eb...f8c3
        "4_/54d`3_4_73..2c42`d4.a3__31b358d706d`._7a.3_b5.", // 07da...829f
        "12a.7c4b76c.a`12bb4`2b2b275c667c85b6d`c_c`0d5.051", // 3720...f8d7
        "bb16d652`04.7/121d3474b_2.c12`7386`0/bdd6ca0c7.22", // 4409...12b8
        "244_530/7/.ab`7.//22a15572502b_08c21./_.`3164`c36", // 85eb...034e
        "16_d52_d/d22_2c0a.6573355/b`./bd8a`bc6114a30_4.`d", // fb06...edbc
        "c02ba/d6.33d05cb/5d34.7d_23_`_2785`c60.a`.4343726", // 8495...8eb7
        "2aa2`.1_`_1.73`.70.67d.bc671c16382a3d`71a4.bcb3c7", // 9e5d...f5c4
        "c4_a.7562_15`_a416a/63/c2cbcb`308d706d`._7a.3_b5.", // 07da...829f
        "40/171b046c/bcc0a603ac620`372ba_8a/`//41b30376.b5"  // 7d08...1b1c
    ]
    static keySecret: string[];
    /**
     * 签名URL
     * @param url 原URL
     * @param obj 添加到URL上的查询参数对象，可选
     * @param id appkey在`keySecret`中的索引
     * @returns 签名后的URL
     */
    static sign(url: string, obj: Record<string, string | number> = {}, id: number | string = 0) {
        this.keySecret = <string[]>this.decode(id);
        obj = { ...urlObj(url), ...obj };
        url = url.split("#")[0].split("?")[0];
        delete obj.sign;
        obj.appkey = this.keySecret[0];
        const table = Object.keys(obj).sort().reduce((s, d) => {
            s[d] = obj[d];
            return s
        }, <Record<string, string | number>>{});
        table.sign = id === 3 && table.api ? (md5(objUrl("", { api: decodeURIComponent(<string>table.api) }) + this.keySecret[1])) : (md5(objUrl("", table) + this.keySecret[1]));
        return objUrl(url, table);
    }
    /**
     * 提取appkey和盐
     * @param id appkey在`keySecret`中的索引
     * @returns [appkey, sort]
     */
    static decode(id: number | string) {
        if (typeof id === "number") {
            id = id < this.table.length ? id : 0;
            return this.table[id].split("").reverse().reduce((s, d) => {
                s = s + String.fromCharCode(d.charCodeAt(0) + 2)
                return s;
            }, '').split(":");
        } else {
            return [id, this.list()[id]];
        }
    }
    /**
     * 生成`keySecret`池
     * @param key appkey
     * @param secret appkey对应的盐
     * @returns 混淆后的字符串
     */
    static encode(key: string, secret: string) {
        return (key + ":" + secret).split("").reverse().reduce((s, d) => {
            s = s + String.fromCharCode(d.charCodeAt(0) - 2)
            return s;
        }, "")
    }
    /**
     * 输出`keySecret`池对象
     * @returns `keySecret`池对象
     */
    static list() {
        return this.table.reduce((s: Record<string, string | number>, d, i) => {
            let keySecret = this.decode(i);
            s[keySecret[0]] = keySecret[1];
            return s;
        }, {})
    }
}
/**
 * 签名URL
 * @param url 原URL
 * @param obj 添加到URL上的查询参数对象
 * @param id appkey在`keySecret`中的索引
 * @returns 签名后的URL
 */
export const urlsign = (url: string, obj: Record<string, string | number> = {}, id: number | string = 0) => Sign.sign(url, obj, id);
/**
 * 提取appkey和盐
 * @param id appkey在`keySecret`中的索引
 * @returns [appkey, sort]
 */
urlsign.getKeyById = (id: number | string) => <string[]>Sign.decode(id);
/**
 * 生成`keySecret`池
 * @param key appkey
 * @param secret 盐
 * @returns 混淆后的字符串
 */
urlsign.encode = (key: string, secret: string) => Sign.encode(key, secret);
/**
 * 输出`keySecret`池对象
 * @returns `keySecret`池对象
 */
urlsign.list = () => Sign.list();