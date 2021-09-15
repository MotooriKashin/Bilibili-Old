/**
 * 本模块提供B站URL签名工具
 */
(function () {
    /**
     * appkey and salt
     * 注释后是带掩码版 appkey
     * 强烈建议还是专事专用
     */
    const keySecret = [
        "rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg",
        "/a_206b`_.61.bca6117.175bcdadc41850c010c..././1``",
        "157bdd`6/bc73632.bcd660baa03a.43841211032b5c4`6b/",
        "351a7a6b/.b`d77da1cdccc25_13bc0a81a6d63.7ad13`c50",
        "4_/54d`3_4_73..2c42`d4.a3__31b358d706d`._7a.3_b5.",
        "12a.7c4b76c.a`12bb4`2b2b275c667c85b6d`c_c`0d5.051",
        "bb16d652`04.7/121d3474b_2.c12`7386`0/bdd6ca0c7.22",
        "244_530/7/.ab`7.//22a15572502b_08c21./_.`3164`c36",
        "16_d52_d/d22_2c0a.6573355/b`./bd8a`bc6114a30_4.`d",
        "c02ba/d6.33d05cb/5d34.7d_23_`_2785`c60.a`.4343726",
        "2aa2`.1_`_1.73`.70.67d.bc671c16382a3d`71a4.bcb3c7",
        "40/171b046c/bcc0a603ac620`372ba_8d706d`._7a.3_b5.",
        "c4_a.7562_15`_a416a/63/c2cbcb`308a/`//41b30376.b5" // 7d08...1b1c
    ];
    class Sign {
        /**
         * 签名URL
         * @param url 原URL
         * @param obj 添加到URL上的查询参数对象，可选
         * @param id appkey在`keySecret`中的索引
         * @returns 签名后的URL
         */
        static sign(url, obj = {}, id = 0) {
            let table = {};
            this.keySecret = this.decode(id);
            obj = { ...API.urlObj(url), ...obj };
            url = url.split("#")[0].split("?")[0];
            delete obj.sign;
            obj.appkey = this.keySecret[0];
            Object.keys(obj).sort().map(key => { table[key] = obj[key]; });
            table.sign = id === 3 && table.api ? (API.md5(API.objUrl("", { api: decodeURIComponent(table.api) }) + this.keySecret[1])) : (API.md5(API.objUrl("", table) + this.keySecret[1]));
            return API.objUrl(url, table);
        }
        /**
         * 提取appkey和盐
         * @param id appkey在`keySecret`中的索引
         * @returns [appkey, sort]
         */
        static decode(id) {
            if (typeof id === "number") {
                id = id < keySecret.length ? id : 0;
                return keySecret[id].split("").reverse().reduce((s, d) => {
                    s = s + String.fromCharCode(d.charCodeAt(0) + 2);
                    return s;
                }, '').split(":");
            }
            else {
                return [id, this.list()[id]];
            }
        }
        /**
         * 生成`keySecret`池
         * @param key appkey
         * @param secret appkey对应的盐
         * @returns 混淆后的字符串
         */
        static encode(key, secret) {
            return (key + ":" + secret).split("").reverse().reduce((s, d) => {
                s = s + String.fromCharCode(d.charCodeAt(0) - 2);
                return s;
            }, "");
        }
        /**
         * 输出`keySecret`池对象
         * @returns `keySecret`池对象
         */
        static list() {
            return keySecret.reduce((s, d, i) => {
                let keySecret = this.decode(i);
                s[keySecret[0]] = keySecret[1];
                return s;
            }, {});
        }
    }
    const urlsign = (url, obj = {}, id = 0) => Sign.sign(url, obj, id);
    urlsign.getKeyById = (id) => Sign.decode(id);
    urlsign.encode = (key, secret) => Sign.encode(key, secret);
    urlsign.list = () => Sign.list();
    API.urlsign = urlsign;
})();
