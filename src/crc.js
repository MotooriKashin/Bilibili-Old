/**
 * @module crc
 * @description crc32引擎：将src哈西逆向为mid，以便进一步获取弹幕发送者信息
 * @author Motooti Kashin
 * @license MIT
 */
(function () {
    const root = window.BLOD || window; /** @see main */

    /**
     * @see MoePus {@link https://moepus.oicp.net/2016/11/27/crccrack}
     * @see esterTion {@link https://github.com/esterTion/BiliBili_crc2mid}
     * @license GFUL
     */
    class Midcrc {
        constructor() {
            this.CRCPOLYNOMIAL = 0xEDB88320;
            this.crctable = new Array(256);
            this.create_table();
            this.index = new Array(4);
        }
        /**
         * @param {string} input 输入crc32哈西值
         * @returns {number} 逆向出的mid值
         */
        run(input) {
            let ht = parseInt('0x' + input) ^ 0xffffffff,
                snum,
                i,
                lastindex,
                deepCheckData;
            for (i = 3; i >= 0; i--) {
                this.index[3 - i] = this.getcrcindex(ht >>> (i * 8));
                snum = this.crctable[this.index[3 - i]];
                ht ^= snum >>> ((3 - i) * 8);
            }
            for (i = 0; i < 10000000; i++) {
                lastindex = this.crc32lastindex(i);
                if (lastindex == this.index[3]) {
                    deepCheckData = this.deepCheck(i, this.index);
                    if (deepCheckData[0]) break;
                }
            }
            if (i == 10000000) return -1;
            return Number(i + '' + deepCheckData[1]);
        }
        create_table() {
            let crcreg,
                i,
                j;
            for (i = 0; i < 256; ++i) {
                crcreg = i;
                for (j = 0; j < 8; ++j) {
                    if ((crcreg & 1) !== 0) {
                        crcreg = this.CRCPOLYNOMIAL ^ (crcreg >>> 1);
                    } else {
                        crcreg >>>= 1;
                    }
                }
                this.crctable[i] = crcreg;
            }
        }
        crc32(input) {
            if (typeof (input) != 'string') input = input.toString();
            let crcstart = 0xFFFFFFFF,
                len = input.length,
                index;
            for (let i = 0; i < len; ++i) {
                index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                crcstart = (crcstart >>> 8) ^ this.crctable[index];
            }
            return crcstart;
        }
        crc32lastindex(input) {
            if (typeof (input) != 'string') input = input.toString();
            let crcstart = 0xFFFFFFFF,
                len = input.length,
                index;
            for (let i = 0; i < len; ++i) {
                index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                crcstart = (crcstart >>> 8) ^ this.crctable[index];
            }
            return index;
        }
        getcrcindex(t) {
            for (let i = 0; i < 256; i++) if (this.crctable[i] >>> 24 == t) return i;
            return -1;
        }
        deepCheck(i, index) {
            let tc = 0x00,
                str = '',
                hash = this.crc32(i);
            tc = hash & 0xff ^ index[2];
            if (!(tc <= 57 && tc >= 48)) return [0];
            str += tc - 48;
            hash = this.crctable[index[2]] ^ (hash >>> 8);
            tc = hash & 0xff ^ index[1];
            if (!(tc <= 57 && tc >= 48)) return [0];
            str += tc - 48;
            hash = this.crctable[index[1]] ^ (hash >>> 8);
            tc = hash & 0xff ^ index[0];
            if (!(tc <= 57 && tc >= 48)) return [0];
            str += tc - 48;
            hash = this.crctable[index[0]] ^ (hash >>> 8);
            return [1, str];
        }
    }

    const exports = () => {
        let midcrc = new Midcrc();
        return (() => {
            return (input) => {
                return midcrc.run(input);
            }
        })()
    }
    root.midcrc = exports();

})()