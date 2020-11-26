/*
 * @module "crc.js"
 * @description 哈希值反查引擎，按需加载，以midcrc方法挂载在BLOD或window下，输入crc哈希，输出uid
 * https://github.com/esterTion/BiliBili_crc2mid
 */
(function () {
    const root = window.BLOD || window;

    const BiliBili_midcrc = function () {
        const CRCPOLYNOMIAL = 0xEDB88320;
        let crctable = new Array(256),
            create_table = function () {
                let crcreg,
                    i,
                    j;
                for (i = 0; i < 256; ++i) {
                    crcreg = i;
                    for (j = 0; j < 8; ++j) {
                        if ((crcreg & 1) !== 0) {
                            crcreg = CRCPOLYNOMIAL ^ (crcreg >>> 1);
                        } else {
                            crcreg >>>= 1;
                        }
                    }
                    crctable[i] = crcreg;
                }
            },
            crc32 = function (input) {
                if (typeof (input) != 'string') input = input.toString();
                let crcstart = 0xFFFFFFFF,
                    len = input.length,
                    index;
                for (let i = 0; i < len; ++i) {
                    index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                    crcstart = (crcstart >>> 8) ^ crctable[index];
                }
                return crcstart;
            },
            crc32lastindex = function (input) {
                if (typeof (input) != 'string') input = input.toString();
                let crcstart = 0xFFFFFFFF,
                    len = input.length,
                    index;
                for (let i = 0; i < len; ++i) {
                    index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                    crcstart = (crcstart >>> 8) ^ crctable[index];
                }
                return index;
            },
            getcrcindex = function (t) {
                for (let i = 0; i < 256; i++) if (crctable[i] >>> 24 == t) return i;
                return -1;
            },
            deepCheck = function (i, index) {
                let tc = 0x00,
                    str = '',
                    hash = crc32(i);
                tc = hash & 0xff ^ index[2];
                if (!(tc <= 57 && tc >= 48)) return [0];
                str += tc - 48;
                hash = crctable[index[2]] ^ (hash >>> 8);
                tc = hash & 0xff ^ index[1];
                if (!(tc <= 57 && tc >= 48)) return [0];
                str += tc - 48;
                hash = crctable[index[1]] ^ (hash >>> 8);
                tc = hash & 0xff ^ index[0];
                if (!(tc <= 57 && tc >= 48)) return [0];
                str += tc - 48;
                hash = crctable[index[0]] ^ (hash >>> 8);
                return [1, str];
            };
        create_table();
        let index = new Array(4);
        return function (input) {
            let ht = parseInt('0x' + input) ^ 0xffffffff,
                snum,
                i,
                lastindex,
                deepCheckData;
            for (i = 3; i >= 0; i--) {
                index[3 - i] = getcrcindex(ht >>> (i * 8));
                snum = crctable[index[3 - i]];
                ht ^= snum >>> ((3 - i) * 8);
            }
            for (i = 0; i < 10000000; i++) {
                lastindex = crc32lastindex(i);
                if (lastindex == index[3]) {
                    deepCheckData = deepCheck(i, index);
                    if (deepCheckData[0]) break;
                }
            }
            if (i == 10000000) return -1;
            return i + '' + deepCheckData[1];
        }
    }

    const exports = new BiliBili_midcrc();
    root.midcrc = exports;

})()