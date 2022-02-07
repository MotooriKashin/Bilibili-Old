interface modules {
    /**
     * md5哈希函数  
     * 修改自开源项目`js-md5`  
     * @see js-md5 {@link https://github.com/emn178/js-md5}
     * @license MIT
     */
    readonly "md5.js": string;
}
{
    const ERROR = 'input is invalid type';
    const ARRAY_BUFFER = true;
    const HEX_CHARS = '0123456789abcdef'.split('');
    const EXTRA = [128, 32768, 8388608, -2147483648];
    const SHIFT = [0, 8, 16, 24];
    const OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
    const BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

    let buffer = new ArrayBuffer(68), blocks = new Uint32Array(buffer), buffer8 = new Uint8Array(buffer);

    let createOutputMethod = function (outputType: 'hex' | 'array' | 'digest' | 'buffer' | 'arrayBuffer' | 'base64') {
        return function (message: string) {
            return (<Md5>new Md5(true).update(message))[outputType]();
        };
    };
    let createMethod = function () {
        let method: any = createOutputMethod('hex');
        method.create = function () {
            return new Md5();
        };
        method.update = function (message: string) {
            return method.create().update(message);
        };
        for (let i = 0; i < OUTPUT_TYPES.length; ++i) {
            let type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(<any>type);
        }
        return method;
    };

    class Md5 {
        blocks: Uint32Array | number[];
        buffer8: Uint8Array = new Uint8Array();
        h0 = 0;
        h1 = 0;
        h2 = 0;
        h3 = 0;
        start = 0;
        bytes = 0;
        hBytes = 0;
        finalized = false;
        hashed = false;
        first = true;
        array: () => number[];
        buffer: () => ArrayBuffer;
        lastByteIndex: number = 0;
        constructor(sharedMemory?: boolean) {
            if (sharedMemory) {
                blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                    blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                    blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                this.blocks = blocks;
                this.buffer8 = buffer8;
            } else {
                if (ARRAY_BUFFER) {
                    let buffer = new ArrayBuffer(68);
                    this.buffer8 = new Uint8Array(buffer);
                    this.blocks = new Uint32Array(buffer);
                } else {
                    this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
            }
            this.toString = this.hex;
            this.array = this.digest;
            this.buffer = this.arrayBuffer;
        }
        update(message: any) {
            if (this.finalized) {
                return;
            }

            message = typeof message === 'number' ? message + '' : message;
            let notString, type = typeof message;
            if (type !== 'string') {
                if (type === 'object') {
                    if (message === null) {
                        throw ERROR;
                    } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                        message = new Uint8Array(message);
                    } else if (!Array.isArray(message)) {
                        if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                            throw ERROR;
                        }
                    }
                } else {
                    throw ERROR;
                }
                notString = true;
            }
            let code, index = 0, i, length = message.length, blocks = this.blocks;
            let buffer8 = this.buffer8;

            while (index < length) {
                if (this.hashed) {
                    this.hashed = false;
                    blocks[0] = blocks[16];
                    blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                }

                if (notString) {
                    if (ARRAY_BUFFER) {
                        for (i = this.start; index < length && i < 64; ++index) {
                            buffer8[i++] = message[index];
                        }
                    } else {
                        for (i = this.start; index < length && i < 64; ++index) {
                            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                        }
                    }
                } else {
                    if (ARRAY_BUFFER) {
                        for (i = this.start; index < length && i < 64; ++index) {
                            code = message.charCodeAt(index);
                            if (code < 0x80) {
                                buffer8[i++] = code;
                            } else if (code < 0x800) {
                                buffer8[i++] = 0xc0 | (code >> 6);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            } else if (code < 0xd800 || code >= 0xe000) {
                                buffer8[i++] = 0xe0 | (code >> 12);
                                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            } else {
                                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                                buffer8[i++] = 0xf0 | (code >> 18);
                                buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
                                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            }
                        }
                    } else {
                        for (i = this.start; index < length && i < 64; ++index) {
                            code = message.charCodeAt(index);
                            if (code < 0x80) {
                                blocks[i >> 2] |= code << SHIFT[i++ & 3];
                            } else if (code < 0x800) {
                                blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            } else if (code < 0xd800 || code >= 0xe000) {
                                blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            } else {
                                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                                blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            }
                        }
                    }
                }
                this.lastByteIndex = i;
                this.bytes += i - this.start;
                if (i >= 64) {
                    this.start = i - 64;
                    this.hash();
                    this.hashed = true;
                } else {
                    this.start = i;
                }
            }
            if (this.bytes > 4294967295) {
                this.hBytes += this.bytes / 4294967296 << 0;
                this.bytes = this.bytes % 4294967296;
            }
            return this;
        }
        finalize() {
            if (this.finalized) {
                return;
            }
            this.finalized = true;
            let blocks = this.blocks, i = this.lastByteIndex;
            blocks[i >> 2] |= EXTRA[i & 3];
            if (i >= 56) {
                if (!this.hashed) {
                    this.hash();
                }
                blocks[0] = blocks[16];
                blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                    blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                    blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            }
            blocks[14] = this.bytes << 3;
            blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
            this.hash();
        }
        hash() {
            let a, b, c, d, bc, da, blocks = this.blocks;

            if (this.first) {
                a = blocks[0] - 680876937;
                a = (a << 7 | a >>> 25) - 271733879 << 0;
                d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
                d = (d << 12 | d >>> 20) + a << 0;
                c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
                c = (c << 17 | c >>> 15) + d << 0;
                b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
                b = (b << 22 | b >>> 10) + c << 0;
            } else {
                a = this.h0;
                b = this.h1;
                c = this.h2;
                d = this.h3;
                a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
                a = (a << 7 | a >>> 25) + b << 0;
                d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
                d = (d << 12 | d >>> 20) + a << 0;
                c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
                c = (c << 17 | c >>> 15) + d << 0;
                b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
                b = (b << 22 | b >>> 10) + c << 0;
            }

            a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
            b = (b << 20 | b >>> 12) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[5] - 378558;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[8] - 2022574463;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[11] + 1839030562;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[14] - 35309556;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[1] - 1530992060;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[4] + 1272893353;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[7] - 155497632;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[10] - 1094730640;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[13] + 681279174;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[0] - 358537222;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[3] - 722521979;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[6] + 76029189;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[9] - 640364487;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[12] - 421815835;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[15] + 530742520;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[2] - 995338651;
            b = (b << 23 | b >>> 9) + c << 0;
            a += (c ^ (b | ~d)) + blocks[0] - 198630844;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[5] - 57434055;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[10] - 1051523;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[15] - 30611744;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[4] - 145523070;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[2] + 718787259;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[9] - 343485551;
            b = (b << 21 | b >>> 11) + c << 0;

            if (this.first) {
                this.h0 = a + 1732584193 << 0;
                this.h1 = b - 271733879 << 0;
                this.h2 = c - 1732584194 << 0;
                this.h3 = d + 271733878 << 0;
                this.first = false;
            } else {
                this.h0 = this.h0 + a << 0;
                this.h1 = this.h1 + b << 0;
                this.h2 = this.h2 + c << 0;
                this.h3 = this.h3 + d << 0;
            }
        }
        hex() {
            this.finalize();

            let h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;

            return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
                HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
                HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
                HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
                HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
                HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
                HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
                HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
                HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
                HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
                HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
                HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
                HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
                HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
                HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
                HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
        }
        digest() {
            this.finalize();

            let h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
            return [
                h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,
                h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,
                h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,
                h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF
            ];
        }
        arrayBuffer() {
            this.finalize();

            let buffer = new ArrayBuffer(16);
            let blocks = new Uint32Array(buffer);
            blocks[0] = this.h0;
            blocks[1] = this.h1;
            blocks[2] = this.h2;
            blocks[3] = this.h3;
            return buffer;
        }
        base64() {
            let i, v1, v2, v3, base64Str = '', bytes = this.array();
            for (i = 0; i < 15;) {
                v1 = bytes[i++];
                v2 = bytes[i++];
                v3 = bytes[i++];
                base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
                    BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
                    BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
                    BASE64_ENCODE_CHAR[v3 & 63];
            }
            v1 = bytes[i];
            base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
                BASE64_ENCODE_CHAR[(v1 << 4) & 63] +
                '==';
            return base64Str;
        }
    }
    API.md5 = createMethod();
}
declare namespace API {
    /**
     * 获取md5哈希值  
     * 函数属性上还有其他类型md5值获取方法，返回值参考其名，如`md5.hex()`
     * @param str 字符串输入
     * @returns md5输出
     */
    export function md5(str: string): string;
}