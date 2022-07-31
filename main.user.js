// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      10.0.0
// @description  恢复Bilibili旧版页面，为了那些念旧的人。
// @author       MotooriKashin, wly5556
// @homepage     https://github.com/MotooriKashin/Bilibili-Old
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://*.bilibili.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM.cookie
// @run-at       document-start
// @license      MIT
// @resource     bilibiliPlayer.js https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@3ae20f30de5ad37882b474aa886ea06f9641886b/src/bilibili/bilibiliPlayer.min.js
// ==/UserScript==

const modules =`
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod2) => function __require() {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
    isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
    mod2
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/@protobufjs/aspromise/index.js
  var require_aspromise = __commonJS({
    "node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
      "use strict";
      module2.exports = asPromise;
      function asPromise(fn, ctx) {
        var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
        while (index < arguments.length)
          params[offset++] = arguments[index++];
        return new Promise(function executor(resolve, reject) {
          params[offset] = function callback(err) {
            if (pending) {
              pending = false;
              if (err)
                reject(err);
              else {
                var params2 = new Array(arguments.length - 1), offset2 = 0;
                while (offset2 < params2.length)
                  params2[offset2++] = arguments[offset2];
                resolve.apply(null, params2);
              }
            }
          };
          try {
            fn.apply(ctx || null, params);
          } catch (err) {
            if (pending) {
              pending = false;
              reject(err);
            }
          }
        });
      }
    }
  });

  // node_modules/@protobufjs/base64/index.js
  var require_base64 = __commonJS({
    "node_modules/@protobufjs/base64/index.js"(exports2) {
      "use strict";
      var base64 = exports2;
      base64.length = function length(string) {
        var p = string.length;
        if (!p)
          return 0;
        var n = 0;
        while (--p % 4 > 1 && string.charAt(p) === "=")
          ++n;
        return Math.ceil(string.length * 3) / 4 - n;
      };
      var b64 = new Array(64);
      var s64 = new Array(123);
      for (i = 0; i < 64; )
        s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
      var i;
      base64.encode = function encode(buffer2, start, end) {
        var parts = null, chunk = [];
        var i2 = 0, j = 0, t;
        while (start < end) {
          var b = buffer2[start++];
          switch (j) {
            case 0:
              chunk[i2++] = b64[b >> 2];
              t = (b & 3) << 4;
              j = 1;
              break;
            case 1:
              chunk[i2++] = b64[t | b >> 4];
              t = (b & 15) << 2;
              j = 2;
              break;
            case 2:
              chunk[i2++] = b64[t | b >> 6];
              chunk[i2++] = b64[b & 63];
              j = 0;
              break;
          }
          if (i2 > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i2 = 0;
          }
        }
        if (j) {
          chunk[i2++] = b64[t];
          chunk[i2++] = 61;
          if (j === 1)
            chunk[i2++] = 61;
        }
        if (parts) {
          if (i2)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i2));
      };
      var invalidEncoding = "invalid encoding";
      base64.decode = function decode(string, buffer2, offset) {
        var start = offset;
        var j = 0, t;
        for (var i2 = 0; i2 < string.length; ) {
          var c = string.charCodeAt(i2++);
          if (c === 61 && j > 1)
            break;
          if ((c = s64[c]) === void 0)
            throw Error(invalidEncoding);
          switch (j) {
            case 0:
              t = c;
              j = 1;
              break;
            case 1:
              buffer2[offset++] = t << 2 | (c & 48) >> 4;
              t = c;
              j = 2;
              break;
            case 2:
              buffer2[offset++] = (t & 15) << 4 | (c & 60) >> 2;
              t = c;
              j = 3;
              break;
            case 3:
              buffer2[offset++] = (t & 3) << 6 | c;
              j = 0;
              break;
          }
        }
        if (j === 1)
          throw Error(invalidEncoding);
        return offset - start;
      };
      base64.test = function test(string) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\$/.test(string);
      };
    }
  });

  // node_modules/@protobufjs/eventemitter/index.js
  var require_eventemitter = __commonJS({
    "node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
      "use strict";
      module2.exports = EventEmitter;
      function EventEmitter() {
        this._listeners = {};
      }
      EventEmitter.prototype.on = function on(evt, fn, ctx) {
        (this._listeners[evt] || (this._listeners[evt] = [])).push({
          fn,
          ctx: ctx || this
        });
        return this;
      };
      EventEmitter.prototype.off = function off(evt, fn) {
        if (evt === void 0)
          this._listeners = {};
        else {
          if (fn === void 0)
            this._listeners[evt] = [];
          else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length; )
              if (listeners[i].fn === fn)
                listeners.splice(i, 1);
              else
                ++i;
          }
        }
        return this;
      };
      EventEmitter.prototype.emit = function emit(evt) {
        var listeners = this._listeners[evt];
        if (listeners) {
          var args = [], i = 1;
          for (; i < arguments.length; )
            args.push(arguments[i++]);
          for (i = 0; i < listeners.length; )
            listeners[i].fn.apply(listeners[i++].ctx, args);
        }
        return this;
      };
    }
  });

  // node_modules/@protobufjs/float/index.js
  var require_float = __commonJS({
    "node_modules/@protobufjs/float/index.js"(exports2, module2) {
      "use strict";
      module2.exports = factory(factory);
      function factory(exports3) {
        if (typeof Float32Array !== "undefined")
          (function() {
            var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
            function writeFloat_f32_cpy(val, buf, pos) {
              f32[0] = val;
              buf[pos] = f8b[0];
              buf[pos + 1] = f8b[1];
              buf[pos + 2] = f8b[2];
              buf[pos + 3] = f8b[3];
            }
            function writeFloat_f32_rev(val, buf, pos) {
              f32[0] = val;
              buf[pos] = f8b[3];
              buf[pos + 1] = f8b[2];
              buf[pos + 2] = f8b[1];
              buf[pos + 3] = f8b[0];
            }
            exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
            exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
            function readFloat_f32_cpy(buf, pos) {
              f8b[0] = buf[pos];
              f8b[1] = buf[pos + 1];
              f8b[2] = buf[pos + 2];
              f8b[3] = buf[pos + 3];
              return f32[0];
            }
            function readFloat_f32_rev(buf, pos) {
              f8b[3] = buf[pos];
              f8b[2] = buf[pos + 1];
              f8b[1] = buf[pos + 2];
              f8b[0] = buf[pos + 3];
              return f32[0];
            }
            exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
            exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
          })();
        else
          (function() {
            function writeFloat_ieee754(writeUint, val, buf, pos) {
              var sign = val < 0 ? 1 : 0;
              if (sign)
                val = -val;
              if (val === 0)
                writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos);
              else if (isNaN(val))
                writeUint(2143289344, buf, pos);
              else if (val > 34028234663852886e22)
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
              else if (val < 11754943508222875e-54)
                writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
              else {
                var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
              }
            }
            exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
            exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
            function readFloat_ieee754(readUint, buf, pos) {
              var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
              return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
            }
            exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
            exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
          })();
        if (typeof Float64Array !== "undefined")
          (function() {
            var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
            function writeDouble_f64_cpy(val, buf, pos) {
              f64[0] = val;
              buf[pos] = f8b[0];
              buf[pos + 1] = f8b[1];
              buf[pos + 2] = f8b[2];
              buf[pos + 3] = f8b[3];
              buf[pos + 4] = f8b[4];
              buf[pos + 5] = f8b[5];
              buf[pos + 6] = f8b[6];
              buf[pos + 7] = f8b[7];
            }
            function writeDouble_f64_rev(val, buf, pos) {
              f64[0] = val;
              buf[pos] = f8b[7];
              buf[pos + 1] = f8b[6];
              buf[pos + 2] = f8b[5];
              buf[pos + 3] = f8b[4];
              buf[pos + 4] = f8b[3];
              buf[pos + 5] = f8b[2];
              buf[pos + 6] = f8b[1];
              buf[pos + 7] = f8b[0];
            }
            exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
            exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
            function readDouble_f64_cpy(buf, pos) {
              f8b[0] = buf[pos];
              f8b[1] = buf[pos + 1];
              f8b[2] = buf[pos + 2];
              f8b[3] = buf[pos + 3];
              f8b[4] = buf[pos + 4];
              f8b[5] = buf[pos + 5];
              f8b[6] = buf[pos + 6];
              f8b[7] = buf[pos + 7];
              return f64[0];
            }
            function readDouble_f64_rev(buf, pos) {
              f8b[7] = buf[pos];
              f8b[6] = buf[pos + 1];
              f8b[5] = buf[pos + 2];
              f8b[4] = buf[pos + 3];
              f8b[3] = buf[pos + 4];
              f8b[2] = buf[pos + 5];
              f8b[1] = buf[pos + 6];
              f8b[0] = buf[pos + 7];
              return f64[0];
            }
            exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
            exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
          })();
        else
          (function() {
            function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
              var sign = val < 0 ? 1 : 0;
              if (sign)
                val = -val;
              if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos + off1);
              } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
              } else if (val > 17976931348623157e292) {
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
              } else {
                var mantissa;
                if (val < 22250738585072014e-324) {
                  mantissa = val / 5e-324;
                  writeUint(mantissa >>> 0, buf, pos + off0);
                  writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                  var exponent = Math.floor(Math.log(val) / Math.LN2);
                  if (exponent === 1024)
                    exponent = 1023;
                  mantissa = val * Math.pow(2, -exponent);
                  writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                  writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
              }
            }
            exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
            exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
            function readDouble_ieee754(readUint, off0, off1, buf, pos) {
              var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
              var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
              return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
            }
            exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
            exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
          })();
        return exports3;
      }
      function writeUintLE(val, buf, pos) {
        buf[pos] = val & 255;
        buf[pos + 1] = val >>> 8 & 255;
        buf[pos + 2] = val >>> 16 & 255;
        buf[pos + 3] = val >>> 24;
      }
      function writeUintBE(val, buf, pos) {
        buf[pos] = val >>> 24;
        buf[pos + 1] = val >>> 16 & 255;
        buf[pos + 2] = val >>> 8 & 255;
        buf[pos + 3] = val & 255;
      }
      function readUintLE(buf, pos) {
        return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
      }
      function readUintBE(buf, pos) {
        return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
      }
    }
  });

  // node_modules/@protobufjs/inquire/index.js
  var require_inquire = __commonJS({
    "node_modules/@protobufjs/inquire/index.js"(exports, module) {
      "use strict";
      module.exports = inquire;
      function inquire(moduleName) {
        try {
          var mod = eval("quire".replace(/^/, "re"))(moduleName);
          if (mod && (mod.length || Object.keys(mod).length))
            return mod;
        } catch (e) {
        }
        return null;
      }
    }
  });

  // node_modules/@protobufjs/utf8/index.js
  var require_utf8 = __commonJS({
    "node_modules/@protobufjs/utf8/index.js"(exports2) {
      "use strict";
      var utf8 = exports2;
      utf8.length = function utf8_length(string) {
        var len = 0, c = 0;
        for (var i = 0; i < string.length; ++i) {
          c = string.charCodeAt(i);
          if (c < 128)
            len += 1;
          else if (c < 2048)
            len += 2;
          else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
            ++i;
            len += 4;
          } else
            len += 3;
        }
        return len;
      };
      utf8.read = function utf8_read(buffer2, start, end) {
        var len = end - start;
        if (len < 1)
          return "";
        var parts = null, chunk = [], i = 0, t;
        while (start < end) {
          t = buffer2[start++];
          if (t < 128)
            chunk[i++] = t;
          else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer2[start++] & 63;
          else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer2[start++] & 63) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63) - 65536;
            chunk[i++] = 55296 + (t >> 10);
            chunk[i++] = 56320 + (t & 1023);
          } else
            chunk[i++] = (t & 15) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63;
          if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
          }
        }
        if (parts) {
          if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i));
      };
      utf8.write = function utf8_write(string, buffer2, offset) {
        var start = offset, c1, c2;
        for (var i = 0; i < string.length; ++i) {
          c1 = string.charCodeAt(i);
          if (c1 < 128) {
            buffer2[offset++] = c1;
          } else if (c1 < 2048) {
            buffer2[offset++] = c1 >> 6 | 192;
            buffer2[offset++] = c1 & 63 | 128;
          } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
            c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
            ++i;
            buffer2[offset++] = c1 >> 18 | 240;
            buffer2[offset++] = c1 >> 12 & 63 | 128;
            buffer2[offset++] = c1 >> 6 & 63 | 128;
            buffer2[offset++] = c1 & 63 | 128;
          } else {
            buffer2[offset++] = c1 >> 12 | 224;
            buffer2[offset++] = c1 >> 6 & 63 | 128;
            buffer2[offset++] = c1 & 63 | 128;
          }
        }
        return offset - start;
      };
    }
  });

  // node_modules/@protobufjs/pool/index.js
  var require_pool = __commonJS({
    "node_modules/@protobufjs/pool/index.js"(exports2, module2) {
      "use strict";
      module2.exports = pool;
      function pool(alloc, slice, size) {
        var SIZE = size || 8192;
        var MAX = SIZE >>> 1;
        var slab = null;
        var offset = SIZE;
        return function pool_alloc(size2) {
          if (size2 < 1 || size2 > MAX)
            return alloc(size2);
          if (offset + size2 > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
          }
          var buf = slice.call(slab, offset, offset += size2);
          if (offset & 7)
            offset = (offset | 7) + 1;
          return buf;
        };
      }
    }
  });

  // node_modules/protobufjs/src/util/longbits.js
  var require_longbits = __commonJS({
    "node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
      "use strict";
      module2.exports = LongBits;
      var util = require_minimal();
      function LongBits(lo, hi) {
        this.lo = lo >>> 0;
        this.hi = hi >>> 0;
      }
      var zero = LongBits.zero = new LongBits(0, 0);
      zero.toNumber = function() {
        return 0;
      };
      zero.zzEncode = zero.zzDecode = function() {
        return this;
      };
      zero.length = function() {
        return 1;
      };
      var zeroHash = LongBits.zeroHash = "\\0\\0\\0\\0\\0\\0\\0\\0";
      LongBits.fromNumber = function fromNumber(value) {
        if (value === 0)
          return zero;
        var sign = value < 0;
        if (sign)
          value = -value;
        var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
        if (sign) {
          hi = ~hi >>> 0;
          lo = ~lo >>> 0;
          if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
              hi = 0;
          }
        }
        return new LongBits(lo, hi);
      };
      LongBits.from = function from(value) {
        if (typeof value === "number")
          return LongBits.fromNumber(value);
        if (util.isString(value)) {
          if (util.Long)
            value = util.Long.fromString(value);
          else
            return LongBits.fromNumber(parseInt(value, 10));
        }
        return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
      };
      LongBits.prototype.toNumber = function toNumber(unsigned) {
        if (!unsigned && this.hi >>> 31) {
          var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
          if (!lo)
            hi = hi + 1 >>> 0;
          return -(lo + hi * 4294967296);
        }
        return this.lo + this.hi * 4294967296;
      };
      LongBits.prototype.toLong = function toLong(unsigned) {
        return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
      };
      var charCodeAt = String.prototype.charCodeAt;
      LongBits.fromHash = function fromHash(hash) {
        if (hash === zeroHash)
          return zero;
        return new LongBits(
          (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
          (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
        );
      };
      LongBits.prototype.toHash = function toHash() {
        return String.fromCharCode(
          this.lo & 255,
          this.lo >>> 8 & 255,
          this.lo >>> 16 & 255,
          this.lo >>> 24,
          this.hi & 255,
          this.hi >>> 8 & 255,
          this.hi >>> 16 & 255,
          this.hi >>> 24
        );
      };
      LongBits.prototype.zzEncode = function zzEncode() {
        var mask = this.hi >> 31;
        this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
        this.lo = (this.lo << 1 ^ mask) >>> 0;
        return this;
      };
      LongBits.prototype.zzDecode = function zzDecode() {
        var mask = -(this.lo & 1);
        this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
        this.hi = (this.hi >>> 1 ^ mask) >>> 0;
        return this;
      };
      LongBits.prototype.length = function length() {
        var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
        return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
      };
    }
  });

  // node_modules/protobufjs/src/util/minimal.js
  var require_minimal = __commonJS({
    "node_modules/protobufjs/src/util/minimal.js"(exports2) {
      "use strict";
      var util = exports2;
      util.asPromise = require_aspromise();
      util.base64 = require_base64();
      util.EventEmitter = require_eventemitter();
      util.float = require_float();
      util.inquire = require_inquire();
      util.utf8 = require_utf8();
      util.pool = require_pool();
      util.LongBits = require_longbits();
      util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
      util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
      util.emptyArray = Object.freeze ? Object.freeze([]) : [];
      util.emptyObject = Object.freeze ? Object.freeze({}) : {};
      util.isInteger = Number.isInteger || function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
      util.isString = function isString(value) {
        return typeof value === "string" || value instanceof String;
      };
      util.isObject = function isObject2(value) {
        return value && typeof value === "object";
      };
      util.isset = util.isSet = function isSet(obj, prop) {
        var value = obj[prop];
        if (value != null && obj.hasOwnProperty(prop))
          return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
        return false;
      };
      util.Buffer = function() {
        try {
          var Buffer2 = util.inquire("buffer").Buffer;
          return Buffer2.prototype.utf8Write ? Buffer2 : null;
        } catch (e) {
          return null;
        }
      }();
      util._Buffer_from = null;
      util._Buffer_allocUnsafe = null;
      util.newBuffer = function newBuffer(sizeOrArray) {
        return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
      };
      util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      util.Long = util.global.dcodeIO && util.global.dcodeIO.Long || util.global.Long || util.inquire("long");
      util.key2Re = /^true|false|0|1\$/;
      util.key32Re = /^-?(?:0|[1-9][0-9]*)\$/;
      util.key64Re = /^(?:[\\\\x00-\\\\xff]{8}|-?(?:0|[1-9][0-9]*))\$/;
      util.longToHash = function longToHash(value) {
        return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
      };
      util.longFromHash = function longFromHash(hash, unsigned) {
        var bits = util.LongBits.fromHash(hash);
        if (util.Long)
          return util.Long.fromBits(bits.lo, bits.hi, unsigned);
        return bits.toNumber(Boolean(unsigned));
      };
      function merge(dst, src, ifNotSet) {
        for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
          if (dst[keys[i]] === void 0 || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
        return dst;
      }
      util.merge = merge;
      util.lcFirst = function lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
      };
      function newError(name) {
        function CustomError(message2, properties) {
          if (!(this instanceof CustomError))
            return new CustomError(message2, properties);
          Object.defineProperty(this, "message", { get: function() {
            return message2;
          } });
          if (Error.captureStackTrace)
            Error.captureStackTrace(this, CustomError);
          else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });
          if (properties)
            merge(this, properties);
        }
        (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;
        Object.defineProperty(CustomError.prototype, "name", { get: function() {
          return name;
        } });
        CustomError.prototype.toString = function toString() {
          return this.name + ": " + this.message;
        };
        return CustomError;
      }
      util.newError = newError;
      util.ProtocolError = newError("ProtocolError");
      util.oneOfGetter = function getOneOf(fieldNames) {
        var fieldMap = {};
        for (var i = 0; i < fieldNames.length; ++i)
          fieldMap[fieldNames[i]] = 1;
        return function() {
          for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
            if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
              return keys[i2];
        };
      };
      util.oneOfSetter = function setOneOf(fieldNames) {
        return function(name) {
          for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
              delete this[fieldNames[i]];
        };
      };
      util.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: true
      };
      util._configure = function() {
        var Buffer2 = util.Buffer;
        if (!Buffer2) {
          util._Buffer_from = util._Buffer_allocUnsafe = null;
          return;
        }
        util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || function Buffer_from(value, encoding) {
          return new Buffer2(value, encoding);
        };
        util._Buffer_allocUnsafe = Buffer2.allocUnsafe || function Buffer_allocUnsafe(size) {
          return new Buffer2(size);
        };
      };
    }
  });

  // node_modules/protobufjs/src/writer.js
  var require_writer = __commonJS({
    "node_modules/protobufjs/src/writer.js"(exports2, module2) {
      "use strict";
      module2.exports = Writer;
      var util = require_minimal();
      var BufferWriter;
      var LongBits = util.LongBits;
      var base64 = util.base64;
      var utf8 = util.utf8;
      function Op(fn, len, val) {
        this.fn = fn;
        this.len = len;
        this.next = void 0;
        this.val = val;
      }
      function noop() {
      }
      function State(writer) {
        this.head = writer.head;
        this.tail = writer.tail;
        this.len = writer.len;
        this.next = writer.states;
      }
      function Writer() {
        this.len = 0;
        this.head = new Op(noop, 0, 0);
        this.tail = this.head;
        this.states = null;
      }
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup() {
          return (Writer.create = function create_buffer() {
            return new BufferWriter();
          })();
        } : function create_array() {
          return new Writer();
        };
      };
      Writer.create = create();
      Writer.alloc = function alloc(size) {
        return new util.Array(size);
      };
      if (util.Array !== Array)
        Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
      Writer.prototype._push = function push(fn, len, val) {
        this.tail = this.tail.next = new Op(fn, len, val);
        this.len += len;
        return this;
      };
      function writeByte(val, buf, pos) {
        buf[pos] = val & 255;
      }
      function writeVarint32(val, buf, pos) {
        while (val > 127) {
          buf[pos++] = val & 127 | 128;
          val >>>= 7;
        }
        buf[pos] = val;
      }
      function VarintOp(len, val) {
        this.len = len;
        this.next = void 0;
        this.val = val;
      }
      VarintOp.prototype = Object.create(Op.prototype);
      VarintOp.prototype.fn = writeVarint32;
      Writer.prototype.uint32 = function write_uint32(value) {
        this.len += (this.tail = this.tail.next = new VarintOp(
          (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
          value
        )).len;
        return this;
      };
      Writer.prototype.int32 = function write_int32(value) {
        return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
      };
      Writer.prototype.sint32 = function write_sint32(value) {
        return this.uint32((value << 1 ^ value >> 31) >>> 0);
      };
      function writeVarint64(val, buf, pos) {
        while (val.hi) {
          buf[pos++] = val.lo & 127 | 128;
          val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
          val.hi >>>= 7;
        }
        while (val.lo > 127) {
          buf[pos++] = val.lo & 127 | 128;
          val.lo = val.lo >>> 7;
        }
        buf[pos++] = val.lo;
      }
      Writer.prototype.uint64 = function write_uint64(value) {
        var bits = LongBits.from(value);
        return this._push(writeVarint64, bits.length(), bits);
      };
      Writer.prototype.int64 = Writer.prototype.uint64;
      Writer.prototype.sint64 = function write_sint64(value) {
        var bits = LongBits.from(value).zzEncode();
        return this._push(writeVarint64, bits.length(), bits);
      };
      Writer.prototype.bool = function write_bool(value) {
        return this._push(writeByte, 1, value ? 1 : 0);
      };
      function writeFixed32(val, buf, pos) {
        buf[pos] = val & 255;
        buf[pos + 1] = val >>> 8 & 255;
        buf[pos + 2] = val >>> 16 & 255;
        buf[pos + 3] = val >>> 24;
      }
      Writer.prototype.fixed32 = function write_fixed32(value) {
        return this._push(writeFixed32, 4, value >>> 0);
      };
      Writer.prototype.sfixed32 = Writer.prototype.fixed32;
      Writer.prototype.fixed64 = function write_fixed64(value) {
        var bits = LongBits.from(value);
        return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
      };
      Writer.prototype.sfixed64 = Writer.prototype.fixed64;
      Writer.prototype.float = function write_float(value) {
        return this._push(util.float.writeFloatLE, 4, value);
      };
      Writer.prototype.double = function write_double(value) {
        return this._push(util.float.writeDoubleLE, 8, value);
      };
      var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos);
      } : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
          buf[pos + i] = val[i];
      };
      Writer.prototype.bytes = function write_bytes(value) {
        var len = value.length >>> 0;
        if (!len)
          return this._push(writeByte, 1, 0);
        if (util.isString(value)) {
          var buf = Writer.alloc(len = base64.length(value));
          base64.decode(value, buf, 0);
          value = buf;
        }
        return this.uint32(len)._push(writeBytes, len, value);
      };
      Writer.prototype.string = function write_string(value) {
        var len = utf8.length(value);
        return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
      };
      Writer.prototype.fork = function fork() {
        this.states = new State(this);
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
        return this;
      };
      Writer.prototype.reset = function reset() {
        if (this.states) {
          this.head = this.states.head;
          this.tail = this.states.tail;
          this.len = this.states.len;
          this.states = this.states.next;
        } else {
          this.head = this.tail = new Op(noop, 0, 0);
          this.len = 0;
        }
        return this;
      };
      Writer.prototype.ldelim = function ldelim() {
        var head = this.head, tail = this.tail, len = this.len;
        this.reset().uint32(len);
        if (len) {
          this.tail.next = head.next;
          this.tail = tail;
          this.len += len;
        }
        return this;
      };
      Writer.prototype.finish = function finish() {
        var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
        while (head) {
          head.fn(head.val, buf, pos);
          pos += head.len;
          head = head.next;
        }
        return buf;
      };
      Writer._configure = function(BufferWriter_) {
        BufferWriter = BufferWriter_;
        Writer.create = create();
        BufferWriter._configure();
      };
    }
  });

  // node_modules/protobufjs/src/writer_buffer.js
  var require_writer_buffer = __commonJS({
    "node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
      "use strict";
      module2.exports = BufferWriter;
      var Writer = require_writer();
      (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
      var util = require_minimal();
      function BufferWriter() {
        Writer.call(this);
      }
      BufferWriter._configure = function() {
        BufferWriter.alloc = util._Buffer_allocUnsafe;
        BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
          buf.set(val, pos);
        } : function writeBytesBuffer_copy(val, buf, pos) {
          if (val.copy)
            val.copy(buf, pos, 0, val.length);
          else
            for (var i = 0; i < val.length; )
              buf[pos++] = val[i++];
        };
      };
      BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
        if (util.isString(value))
          value = util._Buffer_from(value, "base64");
        var len = value.length >>> 0;
        this.uint32(len);
        if (len)
          this._push(BufferWriter.writeBytesBuffer, len, value);
        return this;
      };
      function writeStringBuffer(val, buf, pos) {
        if (val.length < 40)
          util.utf8.write(val, buf, pos);
        else if (buf.utf8Write)
          buf.utf8Write(val, pos);
        else
          buf.write(val, pos);
      }
      BufferWriter.prototype.string = function write_string_buffer(value) {
        var len = util.Buffer.byteLength(value);
        this.uint32(len);
        if (len)
          this._push(writeStringBuffer, len, value);
        return this;
      };
      BufferWriter._configure();
    }
  });

  // node_modules/protobufjs/src/reader.js
  var require_reader = __commonJS({
    "node_modules/protobufjs/src/reader.js"(exports2, module2) {
      "use strict";
      module2.exports = Reader;
      var util = require_minimal();
      var BufferReader;
      var LongBits = util.LongBits;
      var utf8 = util.utf8;
      function indexOutOfRange(reader, writeLength) {
        return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
      }
      function Reader(buffer2) {
        this.buf = buffer2;
        this.pos = 0;
        this.len = buffer2.length;
      }
      var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer2) {
        if (buffer2 instanceof Uint8Array || Array.isArray(buffer2))
          return new Reader(buffer2);
        throw Error("illegal buffer");
      } : function create_array2(buffer2) {
        if (Array.isArray(buffer2))
          return new Reader(buffer2);
        throw Error("illegal buffer");
      };
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup(buffer2) {
          return (Reader.create = function create_buffer(buffer3) {
            return util.Buffer.isBuffer(buffer3) ? new BufferReader(buffer3) : create_array(buffer3);
          })(buffer2);
        } : create_array;
      };
      Reader.create = create();
      Reader.prototype._slice = util.Array.prototype.subarray || util.Array.prototype.slice;
      Reader.prototype.uint32 = function read_uint32_setup() {
        var value = 4294967295;
        return function read_uint32() {
          value = (this.buf[this.pos] & 127) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
          if (this.buf[this.pos++] < 128)
            return value;
          if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
          }
          return value;
        };
      }();
      Reader.prototype.int32 = function read_int32() {
        return this.uint32() | 0;
      };
      Reader.prototype.sint32 = function read_sint32() {
        var value = this.uint32();
        return value >>> 1 ^ -(value & 1) | 0;
      };
      function readLongVarint() {
        var bits = new LongBits(0, 0);
        var i = 0;
        if (this.len - this.pos > 4) {
          for (; i < 4; ++i) {
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
          i = 0;
        } else {
          for (; i < 3; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
          bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
          return bits;
        }
        if (this.len - this.pos > 4) {
          for (; i < 5; ++i) {
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
        } else {
          for (; i < 5; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
        }
        throw Error("invalid varint encoding");
      }
      Reader.prototype.bool = function read_bool() {
        return this.uint32() !== 0;
      };
      function readFixed32_end(buf, end) {
        return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
      }
      Reader.prototype.fixed32 = function read_fixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4);
      };
      Reader.prototype.sfixed32 = function read_sfixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4) | 0;
      };
      function readFixed64() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 8);
        return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
      }
      Reader.prototype.float = function read_float() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readFloatLE(this.buf, this.pos);
        this.pos += 4;
        return value;
      };
      Reader.prototype.double = function read_double() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readDoubleLE(this.buf, this.pos);
        this.pos += 8;
        return value;
      };
      Reader.prototype.bytes = function read_bytes() {
        var length = this.uint32(), start = this.pos, end = this.pos + length;
        if (end > this.len)
          throw indexOutOfRange(this, length);
        this.pos += length;
        if (Array.isArray(this.buf))
          return this.buf.slice(start, end);
        return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
      };
      Reader.prototype.string = function read_string() {
        var bytes = this.bytes();
        return utf8.read(bytes, 0, bytes.length);
      };
      Reader.prototype.skip = function skip(length) {
        if (typeof length === "number") {
          if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
          this.pos += length;
        } else {
          do {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
          } while (this.buf[this.pos++] & 128);
        }
        return this;
      };
      Reader.prototype.skipType = function(wireType) {
        switch (wireType) {
          case 0:
            this.skip();
            break;
          case 1:
            this.skip(8);
            break;
          case 2:
            this.skip(this.uint32());
            break;
          case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
              this.skipType(wireType);
            }
            break;
          case 5:
            this.skip(4);
            break;
          default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
        }
        return this;
      };
      Reader._configure = function(BufferReader_) {
        BufferReader = BufferReader_;
        Reader.create = create();
        BufferReader._configure();
        var fn = util.Long ? "toLong" : "toNumber";
        util.merge(Reader.prototype, {
          int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
          },
          uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
          },
          sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
          },
          fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
          },
          sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
          }
        });
      };
    }
  });

  // node_modules/protobufjs/src/reader_buffer.js
  var require_reader_buffer = __commonJS({
    "node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
      "use strict";
      module2.exports = BufferReader;
      var Reader = require_reader();
      (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
      var util = require_minimal();
      function BufferReader(buffer2) {
        Reader.call(this, buffer2);
      }
      BufferReader._configure = function() {
        if (util.Buffer)
          BufferReader.prototype._slice = util.Buffer.prototype.slice;
      };
      BufferReader.prototype.string = function read_string_buffer() {
        var len = this.uint32();
        return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
      };
      BufferReader._configure();
    }
  });

  // node_modules/protobufjs/src/rpc/service.js
  var require_service = __commonJS({
    "node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
      "use strict";
      module2.exports = Service;
      var util = require_minimal();
      (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
      function Service(rpcImpl, requestDelimited, responseDelimited) {
        if (typeof rpcImpl !== "function")
          throw TypeError("rpcImpl must be a function");
        util.EventEmitter.call(this);
        this.rpcImpl = rpcImpl;
        this.requestDelimited = Boolean(requestDelimited);
        this.responseDelimited = Boolean(responseDelimited);
      }
      Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
        if (!request)
          throw TypeError("request must be specified");
        var self2 = this;
        if (!callback)
          return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
        if (!self2.rpcImpl) {
          setTimeout(function() {
            callback(Error("already ended"));
          }, 0);
          return void 0;
        }
        try {
          return self2.rpcImpl(
            method,
            requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {
              if (err) {
                self2.emit("error", err, method);
                return callback(err);
              }
              if (response === null) {
                self2.end(true);
                return void 0;
              }
              if (!(response instanceof responseCtor)) {
                try {
                  response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
                } catch (err2) {
                  self2.emit("error", err2, method);
                  return callback(err2);
                }
              }
              self2.emit("data", response, method);
              return callback(null, response);
            }
          );
        } catch (err) {
          self2.emit("error", err, method);
          setTimeout(function() {
            callback(err);
          }, 0);
          return void 0;
        }
      };
      Service.prototype.end = function end(endedByRPC) {
        if (this.rpcImpl) {
          if (!endedByRPC)
            this.rpcImpl(null, null, null);
          this.rpcImpl = null;
          this.emit("end").off();
        }
        return this;
      };
    }
  });

  // node_modules/protobufjs/src/rpc.js
  var require_rpc = __commonJS({
    "node_modules/protobufjs/src/rpc.js"(exports2) {
      "use strict";
      var rpc = exports2;
      rpc.Service = require_service();
    }
  });

  // node_modules/protobufjs/src/roots.js
  var require_roots = __commonJS({
    "node_modules/protobufjs/src/roots.js"(exports2, module2) {
      "use strict";
      module2.exports = {};
    }
  });

  // node_modules/protobufjs/src/index-minimal.js
  var require_index_minimal = __commonJS({
    "node_modules/protobufjs/src/index-minimal.js"(exports2) {
      "use strict";
      var protobuf3 = exports2;
      protobuf3.build = "minimal";
      protobuf3.Writer = require_writer();
      protobuf3.BufferWriter = require_writer_buffer();
      protobuf3.Reader = require_reader();
      protobuf3.BufferReader = require_reader_buffer();
      protobuf3.util = require_minimal();
      protobuf3.rpc = require_rpc();
      protobuf3.roots = require_roots();
      protobuf3.configure = configure;
      function configure() {
        protobuf3.util._configure();
        protobuf3.Writer._configure(protobuf3.BufferWriter);
        protobuf3.Reader._configure(protobuf3.BufferReader);
      }
      configure();
    }
  });

  // node_modules/@protobufjs/codegen/index.js
  var require_codegen = __commonJS({
    "node_modules/@protobufjs/codegen/index.js"(exports2, module2) {
      "use strict";
      module2.exports = codegen;
      function codegen(functionParams, functionName) {
        if (typeof functionParams === "string") {
          functionName = functionParams;
          functionParams = void 0;
        }
        var body = [];
        function Codegen(formatStringOrScope) {
          if (typeof formatStringOrScope !== "string") {
            var source = toString();
            if (codegen.verbose)
              console.log("codegen: " + source);
            source = "return " + source;
            if (formatStringOrScope) {
              var scopeKeys = Object.keys(formatStringOrScope), scopeParams = new Array(scopeKeys.length + 1), scopeValues = new Array(scopeKeys.length), scopeOffset = 0;
              while (scopeOffset < scopeKeys.length) {
                scopeParams[scopeOffset] = scopeKeys[scopeOffset];
                scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
              }
              scopeParams[scopeOffset] = source;
              return Function.apply(null, scopeParams).apply(null, scopeValues);
            }
            return Function(source)();
          }
          var formatParams = new Array(arguments.length - 1), formatOffset = 0;
          while (formatOffset < formatParams.length)
            formatParams[formatOffset] = arguments[++formatOffset];
          formatOffset = 0;
          formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace(\$0, \$1) {
            var value = formatParams[formatOffset++];
            switch (\$1) {
              case "d":
              case "f":
                return String(Number(value));
              case "i":
                return String(Math.floor(value));
              case "j":
                return JSON.stringify(value);
              case "s":
                return String(value);
            }
            return "%";
          });
          if (formatOffset !== formatParams.length)
            throw Error("parameter count mismatch");
          body.push(formatStringOrScope);
          return Codegen;
        }
        function toString(functionNameOverride) {
          return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\\n  " + body.join("\\n  ") + "\\n}";
        }
        Codegen.toString = toString;
        return Codegen;
      }
      codegen.verbose = false;
    }
  });

  // node_modules/@protobufjs/fetch/index.js
  var require_fetch = __commonJS({
    "node_modules/@protobufjs/fetch/index.js"(exports2, module2) {
      "use strict";
      module2.exports = fetch2;
      var asPromise = require_aspromise();
      var inquire2 = require_inquire();
      var fs = inquire2("fs");
      function fetch2(filename, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        } else if (!options)
          options = {};
        if (!callback)
          return asPromise(fetch2, this, filename, options);
        if (!options.xhr && fs && fs.readFile)
          return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
            return err && typeof XMLHttpRequest !== "undefined" ? fetch2.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
          });
        return fetch2.xhr(filename, options, callback);
      }
      fetch2.xhr = function fetch_xhr(filename, options, callback) {
        var xhr2 = new XMLHttpRequest();
        xhr2.onreadystatechange = function fetchOnReadyStateChange() {
          if (xhr2.readyState !== 4)
            return void 0;
          if (xhr2.status !== 0 && xhr2.status !== 200)
            return callback(Error("status " + xhr2.status));
          if (options.binary) {
            var buffer2 = xhr2.response;
            if (!buffer2) {
              buffer2 = [];
              for (var i = 0; i < xhr2.responseText.length; ++i)
                buffer2.push(xhr2.responseText.charCodeAt(i) & 255);
            }
            return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer2) : buffer2);
          }
          return callback(null, xhr2.responseText);
        };
        if (options.binary) {
          if ("overrideMimeType" in xhr2)
            xhr2.overrideMimeType("text/plain; charset=x-user-defined");
          xhr2.responseType = "arraybuffer";
        }
        xhr2.open("GET", filename);
        xhr2.send();
      };
    }
  });

  // node_modules/@protobufjs/path/index.js
  var require_path = __commonJS({
    "node_modules/@protobufjs/path/index.js"(exports2) {
      "use strict";
      var path2 = exports2;
      var isAbsolute = path2.isAbsolute = function isAbsolute2(path3) {
        return /^(?:\\/|\\w+:)/.test(path3);
      };
      var normalize = path2.normalize = function normalize2(path3) {
        path3 = path3.replace(/\\\\/g, "/").replace(/\\/{2,}/g, "/");
        var parts = path3.split("/"), absolute = isAbsolute(path3), prefix = "";
        if (absolute)
          prefix = parts.shift() + "/";
        for (var i = 0; i < parts.length; ) {
          if (parts[i] === "..") {
            if (i > 0 && parts[i - 1] !== "..")
              parts.splice(--i, 2);
            else if (absolute)
              parts.splice(i, 1);
            else
              ++i;
          } else if (parts[i] === ".")
            parts.splice(i, 1);
          else
            ++i;
        }
        return prefix + parts.join("/");
      };
      path2.resolve = function resolve(originPath, includePath, alreadyNormalized) {
        if (!alreadyNormalized)
          includePath = normalize(includePath);
        if (isAbsolute(includePath))
          return includePath;
        if (!alreadyNormalized)
          originPath = normalize(originPath);
        return (originPath = originPath.replace(/(?:\\/|^)[^/]+\$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
      };
    }
  });

  // node_modules/protobufjs/src/types.js
  var require_types = __commonJS({
    "node_modules/protobufjs/src/types.js"(exports2) {
      "use strict";
      var types = exports2;
      var util = require_util();
      var s = [
        "double",
        "float",
        "int32",
        "uint32",
        "sint32",
        "fixed32",
        "sfixed32",
        "int64",
        "uint64",
        "sint64",
        "fixed64",
        "sfixed64",
        "bool",
        "string",
        "bytes"
      ];
      function bake(values, offset) {
        var i = 0, o = {};
        offset |= 0;
        while (i < values.length)
          o[s[i + offset]] = values[i++];
        return o;
      }
      types.basic = bake([
        1,
        5,
        0,
        0,
        0,
        5,
        5,
        0,
        0,
        0,
        1,
        1,
        0,
        2,
        2
      ]);
      types.defaults = bake([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        false,
        "",
        util.emptyArray,
        null
      ]);
      types.long = bake([
        0,
        0,
        0,
        1,
        1
      ], 7);
      types.mapKey = bake([
        0,
        0,
        0,
        5,
        5,
        0,
        0,
        0,
        1,
        1,
        0,
        2
      ], 2);
      types.packed = bake([
        1,
        5,
        0,
        0,
        0,
        5,
        5,
        0,
        0,
        0,
        1,
        1,
        0
      ]);
    }
  });

  // node_modules/protobufjs/src/field.js
  var require_field = __commonJS({
    "node_modules/protobufjs/src/field.js"(exports2, module2) {
      "use strict";
      module2.exports = Field;
      var ReflectionObject = require_object();
      ((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      var Type;
      var ruleRe = /^required|optional|repeated\$/;
      Field.fromJSON = function fromJSON(name, json) {
        return new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
      };
      function Field(name, id, type, rule, extend, options, comment) {
        if (util.isObject(rule)) {
          comment = extend;
          options = rule;
          rule = extend = void 0;
        } else if (util.isObject(extend)) {
          comment = options;
          options = extend;
          extend = void 0;
        }
        ReflectionObject.call(this, name, options);
        if (!util.isInteger(id) || id < 0)
          throw TypeError("id must be a non-negative integer");
        if (!util.isString(type))
          throw TypeError("type must be a string");
        if (rule !== void 0 && !ruleRe.test(rule = rule.toString().toLowerCase()))
          throw TypeError("rule must be a string rule");
        if (extend !== void 0 && !util.isString(extend))
          throw TypeError("extend must be a string");
        if (rule === "proto3_optional") {
          rule = "optional";
        }
        this.rule = rule && rule !== "optional" ? rule : void 0;
        this.type = type;
        this.id = id;
        this.extend = extend || void 0;
        this.required = rule === "required";
        this.optional = !this.required;
        this.repeated = rule === "repeated";
        this.map = false;
        this.message = null;
        this.partOf = null;
        this.typeDefault = null;
        this.defaultValue = null;
        this.long = util.Long ? types.long[type] !== void 0 : false;
        this.bytes = type === "bytes";
        this.resolvedType = null;
        this.extensionField = null;
        this.declaringField = null;
        this._packed = null;
        this.comment = comment;
      }
      Object.defineProperty(Field.prototype, "packed", {
        get: function() {
          if (this._packed === null)
            this._packed = this.getOption("packed") !== false;
          return this._packed;
        }
      });
      Field.prototype.setOption = function setOption(name, value, ifNotSet) {
        if (name === "packed")
          this._packed = null;
        return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
      };
      Field.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "rule",
          this.rule !== "optional" && this.rule || void 0,
          "type",
          this.type,
          "id",
          this.id,
          "extend",
          this.extend,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Field.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if ((this.typeDefault = types.defaults[this.type]) === void 0) {
          this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
          if (this.resolvedType instanceof Type)
            this.typeDefault = null;
          else
            this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
        }
        if (this.options && this.options["default"] != null) {
          this.typeDefault = this.options["default"];
          if (this.resolvedType instanceof Enum && typeof this.typeDefault === "string")
            this.typeDefault = this.resolvedType.values[this.typeDefault];
        }
        if (this.options) {
          if (this.options.packed === true || this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof Enum))
            delete this.options.packed;
          if (!Object.keys(this.options).length)
            this.options = void 0;
        }
        if (this.long) {
          this.typeDefault = util.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u");
          if (Object.freeze)
            Object.freeze(this.typeDefault);
        } else if (this.bytes && typeof this.typeDefault === "string") {
          var buf;
          if (util.base64.test(this.typeDefault))
            util.base64.decode(this.typeDefault, buf = util.newBuffer(util.base64.length(this.typeDefault)), 0);
          else
            util.utf8.write(this.typeDefault, buf = util.newBuffer(util.utf8.length(this.typeDefault)), 0);
          this.typeDefault = buf;
        }
        if (this.map)
          this.defaultValue = util.emptyObject;
        else if (this.repeated)
          this.defaultValue = util.emptyArray;
        else
          this.defaultValue = this.typeDefault;
        if (this.parent instanceof Type)
          this.parent.ctor.prototype[this.name] = this.defaultValue;
        return ReflectionObject.prototype.resolve.call(this);
      };
      Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {
        if (typeof fieldType === "function")
          fieldType = util.decorateType(fieldType).name;
        else if (fieldType && typeof fieldType === "object")
          fieldType = util.decorateEnum(fieldType).name;
        return function fieldDecorator(prototype, fieldName) {
          util.decorateType(prototype.constructor).add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
        };
      };
      Field._configure = function configure(Type_) {
        Type = Type_;
      };
    }
  });

  // node_modules/protobufjs/src/oneof.js
  var require_oneof = __commonJS({
    "node_modules/protobufjs/src/oneof.js"(exports2, module2) {
      "use strict";
      module2.exports = OneOf;
      var ReflectionObject = require_object();
      ((OneOf.prototype = Object.create(ReflectionObject.prototype)).constructor = OneOf).className = "OneOf";
      var Field = require_field();
      var util = require_util();
      function OneOf(name, fieldNames, options, comment) {
        if (!Array.isArray(fieldNames)) {
          options = fieldNames;
          fieldNames = void 0;
        }
        ReflectionObject.call(this, name, options);
        if (!(fieldNames === void 0 || Array.isArray(fieldNames)))
          throw TypeError("fieldNames must be an Array");
        this.oneof = fieldNames || [];
        this.fieldsArray = [];
        this.comment = comment;
      }
      OneOf.fromJSON = function fromJSON(name, json) {
        return new OneOf(name, json.oneof, json.options, json.comment);
      };
      OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "options",
          this.options,
          "oneof",
          this.oneof,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      function addFieldsToParent(oneof) {
        if (oneof.parent) {
          for (var i = 0; i < oneof.fieldsArray.length; ++i)
            if (!oneof.fieldsArray[i].parent)
              oneof.parent.add(oneof.fieldsArray[i]);
        }
      }
      OneOf.prototype.add = function add(field) {
        if (!(field instanceof Field))
          throw TypeError("field must be a Field");
        if (field.parent && field.parent !== this.parent)
          field.parent.remove(field);
        this.oneof.push(field.name);
        this.fieldsArray.push(field);
        field.partOf = this;
        addFieldsToParent(this);
        return this;
      };
      OneOf.prototype.remove = function remove(field) {
        if (!(field instanceof Field))
          throw TypeError("field must be a Field");
        var index = this.fieldsArray.indexOf(field);
        if (index < 0)
          throw Error(field + " is not a member of " + this);
        this.fieldsArray.splice(index, 1);
        index = this.oneof.indexOf(field.name);
        if (index > -1)
          this.oneof.splice(index, 1);
        field.partOf = null;
        return this;
      };
      OneOf.prototype.onAdd = function onAdd(parent) {
        ReflectionObject.prototype.onAdd.call(this, parent);
        var self2 = this;
        for (var i = 0; i < this.oneof.length; ++i) {
          var field = parent.get(this.oneof[i]);
          if (field && !field.partOf) {
            field.partOf = self2;
            self2.fieldsArray.push(field);
          }
        }
        addFieldsToParent(this);
      };
      OneOf.prototype.onRemove = function onRemove(parent) {
        for (var i = 0, field; i < this.fieldsArray.length; ++i)
          if ((field = this.fieldsArray[i]).parent)
            field.parent.remove(field);
        ReflectionObject.prototype.onRemove.call(this, parent);
      };
      OneOf.d = function decorateOneOf() {
        var fieldNames = new Array(arguments.length), index = 0;
        while (index < arguments.length)
          fieldNames[index] = arguments[index++];
        return function oneOfDecorator(prototype, oneofName) {
          util.decorateType(prototype.constructor).add(new OneOf(oneofName, fieldNames));
          Object.defineProperty(prototype, oneofName, {
            get: util.oneOfGetter(fieldNames),
            set: util.oneOfSetter(fieldNames)
          });
        };
      };
    }
  });

  // node_modules/protobufjs/src/namespace.js
  var require_namespace = __commonJS({
    "node_modules/protobufjs/src/namespace.js"(exports2, module2) {
      "use strict";
      module2.exports = Namespace;
      var ReflectionObject = require_object();
      ((Namespace.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace).className = "Namespace";
      var Field = require_field();
      var OneOf = require_oneof();
      var util = require_util();
      var Type;
      var Service;
      var Enum;
      Namespace.fromJSON = function fromJSON(name, json) {
        return new Namespace(name, json.options).addJSON(json.nested);
      };
      function arrayToJSON(array, toJSONOptions) {
        if (!(array && array.length))
          return void 0;
        var obj = {};
        for (var i = 0; i < array.length; ++i)
          obj[array[i].name] = array[i].toJSON(toJSONOptions);
        return obj;
      }
      Namespace.arrayToJSON = arrayToJSON;
      Namespace.isReservedId = function isReservedId(reserved, id) {
        if (reserved) {
          for (var i = 0; i < reserved.length; ++i)
            if (typeof reserved[i] !== "string" && reserved[i][0] <= id && reserved[i][1] > id)
              return true;
        }
        return false;
      };
      Namespace.isReservedName = function isReservedName(reserved, name) {
        if (reserved) {
          for (var i = 0; i < reserved.length; ++i)
            if (reserved[i] === name)
              return true;
        }
        return false;
      };
      function Namespace(name, options) {
        ReflectionObject.call(this, name, options);
        this.nested = void 0;
        this._nestedArray = null;
      }
      function clearCache(namespace) {
        namespace._nestedArray = null;
        return namespace;
      }
      Object.defineProperty(Namespace.prototype, "nestedArray", {
        get: function() {
          return this._nestedArray || (this._nestedArray = util.toArray(this.nested));
        }
      });
      Namespace.prototype.toJSON = function toJSON(toJSONOptions) {
        return util.toObject([
          "options",
          this.options,
          "nested",
          arrayToJSON(this.nestedArray, toJSONOptions)
        ]);
      };
      Namespace.prototype.addJSON = function addJSON(nestedJson) {
        var ns = this;
        if (nestedJson) {
          for (var names = Object.keys(nestedJson), i = 0, nested; i < names.length; ++i) {
            nested = nestedJson[names[i]];
            ns.add(
              (nested.fields !== void 0 ? Type.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service.fromJSON : nested.id !== void 0 ? Field.fromJSON : Namespace.fromJSON)(names[i], nested)
            );
          }
        }
        return this;
      };
      Namespace.prototype.get = function get3(name) {
        return this.nested && this.nested[name] || null;
      };
      Namespace.prototype.getEnum = function getEnum(name) {
        if (this.nested && this.nested[name] instanceof Enum)
          return this.nested[name].values;
        throw Error("no such enum: " + name);
      };
      Namespace.prototype.add = function add(object) {
        if (!(object instanceof Field && object.extend !== void 0 || object instanceof Type || object instanceof Enum || object instanceof Service || object instanceof Namespace || object instanceof OneOf))
          throw TypeError("object must be a valid nested object");
        if (!this.nested)
          this.nested = {};
        else {
          var prev = this.get(object.name);
          if (prev) {
            if (prev instanceof Namespace && object instanceof Namespace && !(prev instanceof Type || prev instanceof Service)) {
              var nested = prev.nestedArray;
              for (var i = 0; i < nested.length; ++i)
                object.add(nested[i]);
              this.remove(prev);
              if (!this.nested)
                this.nested = {};
              object.setOptions(prev.options, true);
            } else
              throw Error("duplicate name '" + object.name + "' in " + this);
          }
        }
        this.nested[object.name] = object;
        object.onAdd(this);
        return clearCache(this);
      };
      Namespace.prototype.remove = function remove(object) {
        if (!(object instanceof ReflectionObject))
          throw TypeError("object must be a ReflectionObject");
        if (object.parent !== this)
          throw Error(object + " is not a member of " + this);
        delete this.nested[object.name];
        if (!Object.keys(this.nested).length)
          this.nested = void 0;
        object.onRemove(this);
        return clearCache(this);
      };
      Namespace.prototype.define = function define(path2, json) {
        if (util.isString(path2))
          path2 = path2.split(".");
        else if (!Array.isArray(path2))
          throw TypeError("illegal path");
        if (path2 && path2.length && path2[0] === "")
          throw Error("path must be relative");
        var ptr = this;
        while (path2.length > 0) {
          var part = path2.shift();
          if (ptr.nested && ptr.nested[part]) {
            ptr = ptr.nested[part];
            if (!(ptr instanceof Namespace))
              throw Error("path conflicts with non-namespace objects");
          } else
            ptr.add(ptr = new Namespace(part));
        }
        if (json)
          ptr.addJSON(json);
        return ptr;
      };
      Namespace.prototype.resolveAll = function resolveAll() {
        var nested = this.nestedArray, i = 0;
        while (i < nested.length)
          if (nested[i] instanceof Namespace)
            nested[i++].resolveAll();
          else
            nested[i++].resolve();
        return this.resolve();
      };
      Namespace.prototype.lookup = function lookup(path2, filterTypes, parentAlreadyChecked) {
        if (typeof filterTypes === "boolean") {
          parentAlreadyChecked = filterTypes;
          filterTypes = void 0;
        } else if (filterTypes && !Array.isArray(filterTypes))
          filterTypes = [filterTypes];
        if (util.isString(path2) && path2.length) {
          if (path2 === ".")
            return this.root;
          path2 = path2.split(".");
        } else if (!path2.length)
          return this;
        if (path2[0] === "")
          return this.root.lookup(path2.slice(1), filterTypes);
        var found = this.get(path2[0]);
        if (found) {
          if (path2.length === 1) {
            if (!filterTypes || filterTypes.indexOf(found.constructor) > -1)
              return found;
          } else if (found instanceof Namespace && (found = found.lookup(path2.slice(1), filterTypes, true)))
            return found;
        } else
          for (var i = 0; i < this.nestedArray.length; ++i)
            if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i].lookup(path2, filterTypes, true)))
              return found;
        if (this.parent === null || parentAlreadyChecked)
          return null;
        return this.parent.lookup(path2, filterTypes);
      };
      Namespace.prototype.lookupType = function lookupType(path2) {
        var found = this.lookup(path2, [Type]);
        if (!found)
          throw Error("no such type: " + path2);
        return found;
      };
      Namespace.prototype.lookupEnum = function lookupEnum(path2) {
        var found = this.lookup(path2, [Enum]);
        if (!found)
          throw Error("no such Enum '" + path2 + "' in " + this);
        return found;
      };
      Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path2) {
        var found = this.lookup(path2, [Type, Enum]);
        if (!found)
          throw Error("no such Type or Enum '" + path2 + "' in " + this);
        return found;
      };
      Namespace.prototype.lookupService = function lookupService(path2) {
        var found = this.lookup(path2, [Service]);
        if (!found)
          throw Error("no such Service '" + path2 + "' in " + this);
        return found;
      };
      Namespace._configure = function(Type_, Service_, Enum_) {
        Type = Type_;
        Service = Service_;
        Enum = Enum_;
      };
    }
  });

  // node_modules/protobufjs/src/mapfield.js
  var require_mapfield = __commonJS({
    "node_modules/protobufjs/src/mapfield.js"(exports2, module2) {
      "use strict";
      module2.exports = MapField;
      var Field = require_field();
      ((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";
      var types = require_types();
      var util = require_util();
      function MapField(name, id, keyType, type, options, comment) {
        Field.call(this, name, id, type, void 0, void 0, options, comment);
        if (!util.isString(keyType))
          throw TypeError("keyType must be a string");
        this.keyType = keyType;
        this.resolvedKeyType = null;
        this.map = true;
      }
      MapField.fromJSON = function fromJSON(name, json) {
        return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
      };
      MapField.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "keyType",
          this.keyType,
          "type",
          this.type,
          "id",
          this.id,
          "extend",
          this.extend,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      MapField.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (types.mapKey[this.keyType] === void 0)
          throw Error("invalid key type: " + this.keyType);
        return Field.prototype.resolve.call(this);
      };
      MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
        if (typeof fieldValueType === "function")
          fieldValueType = util.decorateType(fieldValueType).name;
        else if (fieldValueType && typeof fieldValueType === "object")
          fieldValueType = util.decorateEnum(fieldValueType).name;
        return function mapFieldDecorator(prototype, fieldName) {
          util.decorateType(prototype.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
        };
      };
    }
  });

  // node_modules/protobufjs/src/method.js
  var require_method = __commonJS({
    "node_modules/protobufjs/src/method.js"(exports2, module2) {
      "use strict";
      module2.exports = Method;
      var ReflectionObject = require_object();
      ((Method.prototype = Object.create(ReflectionObject.prototype)).constructor = Method).className = "Method";
      var util = require_util();
      function Method(name, type, requestType, responseType, requestStream, responseStream, options, comment, parsedOptions) {
        if (util.isObject(requestStream)) {
          options = requestStream;
          requestStream = responseStream = void 0;
        } else if (util.isObject(responseStream)) {
          options = responseStream;
          responseStream = void 0;
        }
        if (!(type === void 0 || util.isString(type)))
          throw TypeError("type must be a string");
        if (!util.isString(requestType))
          throw TypeError("requestType must be a string");
        if (!util.isString(responseType))
          throw TypeError("responseType must be a string");
        ReflectionObject.call(this, name, options);
        this.type = type || "rpc";
        this.requestType = requestType;
        this.requestStream = requestStream ? true : void 0;
        this.responseType = responseType;
        this.responseStream = responseStream ? true : void 0;
        this.resolvedRequestType = null;
        this.resolvedResponseType = null;
        this.comment = comment;
        this.parsedOptions = parsedOptions;
      }
      Method.fromJSON = function fromJSON(name, json) {
        return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment, json.parsedOptions);
      };
      Method.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "type",
          this.type !== "rpc" && this.type || void 0,
          "requestType",
          this.requestType,
          "requestStream",
          this.requestStream,
          "responseType",
          this.responseType,
          "responseStream",
          this.responseStream,
          "options",
          this.options,
          "comment",
          keepComments ? this.comment : void 0,
          "parsedOptions",
          this.parsedOptions
        ]);
      };
      Method.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        this.resolvedRequestType = this.parent.lookupType(this.requestType);
        this.resolvedResponseType = this.parent.lookupType(this.responseType);
        return ReflectionObject.prototype.resolve.call(this);
      };
    }
  });

  // node_modules/protobufjs/src/service.js
  var require_service2 = __commonJS({
    "node_modules/protobufjs/src/service.js"(exports2, module2) {
      "use strict";
      module2.exports = Service;
      var Namespace = require_namespace();
      ((Service.prototype = Object.create(Namespace.prototype)).constructor = Service).className = "Service";
      var Method = require_method();
      var util = require_util();
      var rpc = require_rpc();
      function Service(name, options) {
        Namespace.call(this, name, options);
        this.methods = {};
        this._methodsArray = null;
      }
      Service.fromJSON = function fromJSON(name, json) {
        var service = new Service(name, json.options);
        if (json.methods)
          for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i)
            service.add(Method.fromJSON(names[i], json.methods[names[i]]));
        if (json.nested)
          service.addJSON(json.nested);
        service.comment = json.comment;
        return service;
      };
      Service.prototype.toJSON = function toJSON(toJSONOptions) {
        var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "options",
          inherited && inherited.options || void 0,
          "methods",
          Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || {},
          "nested",
          inherited && inherited.nested || void 0,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Object.defineProperty(Service.prototype, "methodsArray", {
        get: function() {
          return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
        }
      });
      function clearCache(service) {
        service._methodsArray = null;
        return service;
      }
      Service.prototype.get = function get3(name) {
        return this.methods[name] || Namespace.prototype.get.call(this, name);
      };
      Service.prototype.resolveAll = function resolveAll() {
        var methods = this.methodsArray;
        for (var i = 0; i < methods.length; ++i)
          methods[i].resolve();
        return Namespace.prototype.resolve.call(this);
      };
      Service.prototype.add = function add(object) {
        if (this.get(object.name))
          throw Error("duplicate name '" + object.name + "' in " + this);
        if (object instanceof Method) {
          this.methods[object.name] = object;
          object.parent = this;
          return clearCache(this);
        }
        return Namespace.prototype.add.call(this, object);
      };
      Service.prototype.remove = function remove(object) {
        if (object instanceof Method) {
          if (this.methods[object.name] !== object)
            throw Error(object + " is not a member of " + this);
          delete this.methods[object.name];
          object.parent = null;
          return clearCache(this);
        }
        return Namespace.prototype.remove.call(this, object);
      };
      Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
        var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);
        for (var i = 0, method; i < this.methodsArray.length; ++i) {
          var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^\$\\w_]/g, "");
          rpcService[methodName] = util.codegen(["r", "c"], util.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
            m: method,
            q: method.resolvedRequestType.ctor,
            s: method.resolvedResponseType.ctor
          });
        }
        return rpcService;
      };
    }
  });

  // node_modules/protobufjs/src/message.js
  var require_message = __commonJS({
    "node_modules/protobufjs/src/message.js"(exports2, module2) {
      "use strict";
      module2.exports = Message;
      var util = require_minimal();
      function Message(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            this[keys[i]] = properties[keys[i]];
      }
      Message.create = function create(properties) {
        return this.\$type.create(properties);
      };
      Message.encode = function encode(message2, writer) {
        return this.\$type.encode(message2, writer);
      };
      Message.encodeDelimited = function encodeDelimited(message2, writer) {
        return this.\$type.encodeDelimited(message2, writer);
      };
      Message.decode = function decode(reader) {
        return this.\$type.decode(reader);
      };
      Message.decodeDelimited = function decodeDelimited(reader) {
        return this.\$type.decodeDelimited(reader);
      };
      Message.verify = function verify(message2) {
        return this.\$type.verify(message2);
      };
      Message.fromObject = function fromObject(object) {
        return this.\$type.fromObject(object);
      };
      Message.toObject = function toObject(message2, options) {
        return this.\$type.toObject(message2, options);
      };
      Message.prototype.toJSON = function toJSON() {
        return this.\$type.toObject(this, util.toJSONOptions);
      };
    }
  });

  // node_modules/protobufjs/src/decoder.js
  var require_decoder = __commonJS({
    "node_modules/protobufjs/src/decoder.js"(exports2, module2) {
      "use strict";
      module2.exports = decoder;
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      function missing(field) {
        return "missing required '" + field.name + "'";
      }
      function decoder(mtype) {
        var gen = util.codegen(["r", "l"], mtype.name + "\$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function(field2) {
          return field2.map;
        }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()");
        if (mtype.group)
          gen("if((t&7)===4)")("break");
        gen("switch(t>>>3){");
        var i = 0;
        for (; i < mtype.fieldsArray.length; ++i) {
          var field = mtype._fieldsArray[i].resolve(), type = field.resolvedType instanceof Enum ? "int32" : field.type, ref = "m" + util.safeProp(field.name);
          gen("case %i:", field.id);
          if (field.map) {
            gen("if(%s===util.emptyObject)", ref)("%s={}", ref)("var c2 = r.uint32()+r.pos");
            if (types.defaults[field.keyType] !== void 0)
              gen("k=%j", types.defaults[field.keyType]);
            else
              gen("k=null");
            if (types.defaults[type] !== void 0)
              gen("value=%j", types.defaults[type]);
            else
              gen("value=null");
            gen("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", field.keyType)("case 2:");
            if (types.basic[type] === void 0)
              gen("value=types[%i].decode(r,r.uint32())", i);
            else
              gen("value=r.%s()", type);
            gen("break")("default:")("r.skipType(tag2&7)")("break")("}")("}");
            if (types.long[field.keyType] !== void 0)
              gen('%s[typeof k==="object"?util.longToHash(k):k]=value', ref);
            else
              gen("%s[k]=value", ref);
          } else if (field.repeated) {
            gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref);
            if (types.packed[type] !== void 0)
              gen("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", ref, type)("}else");
            if (types.basic[type] === void 0)
              gen(field.resolvedType.group ? "%s.push(types[%i].decode(r))" : "%s.push(types[%i].decode(r,r.uint32()))", ref, i);
            else
              gen("%s.push(r.%s())", ref, type);
          } else if (types.basic[type] === void 0)
            gen(field.resolvedType.group ? "%s=types[%i].decode(r)" : "%s=types[%i].decode(r,r.uint32())", ref, i);
          else
            gen("%s=r.%s()", ref, type);
          gen("break");
        }
        gen("default:")("r.skipType(t&7)")("break")("}")("}");
        for (i = 0; i < mtype._fieldsArray.length; ++i) {
          var rfield = mtype._fieldsArray[i];
          if (rfield.required)
            gen("if(!m.hasOwnProperty(%j))", rfield.name)("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
        }
        return gen("return m");
      }
    }
  });

  // node_modules/protobufjs/src/verifier.js
  var require_verifier = __commonJS({
    "node_modules/protobufjs/src/verifier.js"(exports2, module2) {
      "use strict";
      module2.exports = verifier;
      var Enum = require_enum();
      var util = require_util();
      function invalid(field, expected) {
        return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:" + field.keyType + "}" : "") + " expected";
      }
      function genVerifyValue(gen, field, fieldIndex, ref) {
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum) {
            gen("switch(%s){", ref)("default:")("return%j", invalid(field, "enum value"));
            for (var keys = Object.keys(field.resolvedType.values), j = 0; j < keys.length; ++j)
              gen("case %i:", field.resolvedType.values[keys[j]]);
            gen("break")("}");
          } else {
            gen("{")("var e=types[%i].verify(%s);", fieldIndex, ref)("if(e)")("return%j+e", field.name + ".")("}");
          }
        } else {
          switch (field.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32":
              gen("if(!util.isInteger(%s))", ref)("return%j", invalid(field, "integer"));
              break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
              gen("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)("return%j", invalid(field, "integer|Long"));
              break;
            case "float":
            case "double":
              gen('if(typeof %s!=="number")', ref)("return%j", invalid(field, "number"));
              break;
            case "bool":
              gen('if(typeof %s!=="boolean")', ref)("return%j", invalid(field, "boolean"));
              break;
            case "string":
              gen("if(!util.isString(%s))", ref)("return%j", invalid(field, "string"));
              break;
            case "bytes":
              gen('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', ref, ref, ref)("return%j", invalid(field, "buffer"));
              break;
          }
        }
        return gen;
      }
      function genVerifyKey(gen, field, ref) {
        switch (field.keyType) {
          case "int32":
          case "uint32":
          case "sint32":
          case "fixed32":
          case "sfixed32":
            gen("if(!util.key32Re.test(%s))", ref)("return%j", invalid(field, "integer key"));
            break;
          case "int64":
          case "uint64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen("if(!util.key64Re.test(%s))", ref)("return%j", invalid(field, "integer|Long key"));
            break;
          case "bool":
            gen("if(!util.key2Re.test(%s))", ref)("return%j", invalid(field, "boolean key"));
            break;
        }
        return gen;
      }
      function verifier(mtype) {
        var gen = util.codegen(["m"], mtype.name + "\$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected");
        var oneofs = mtype.oneofsArray, seenFirstField = {};
        if (oneofs.length)
          gen("var p={}");
        for (var i = 0; i < mtype.fieldsArray.length; ++i) {
          var field = mtype._fieldsArray[i].resolve(), ref = "m" + util.safeProp(field.name);
          if (field.optional)
            gen("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field.name);
          if (field.map) {
            gen("if(!util.isObject(%s))", ref)("return%j", invalid(field, "object"))("var k=Object.keys(%s)", ref)("for(var i=0;i<k.length;++i){");
            genVerifyKey(gen, field, "k[i]");
            genVerifyValue(gen, field, i, ref + "[k[i]]")("}");
          } else if (field.repeated) {
            gen("if(!Array.isArray(%s))", ref)("return%j", invalid(field, "array"))("for(var i=0;i<%s.length;++i){", ref);
            genVerifyValue(gen, field, i, ref + "[i]")("}");
          } else {
            if (field.partOf) {
              var oneofProp = util.safeProp(field.partOf.name);
              if (seenFirstField[field.partOf.name] === 1)
                gen("if(p%s===1)", oneofProp)("return%j", field.partOf.name + ": multiple values");
              seenFirstField[field.partOf.name] = 1;
              gen("p%s=1", oneofProp);
            }
            genVerifyValue(gen, field, i, ref);
          }
          if (field.optional)
            gen("}");
        }
        return gen("return null");
      }
    }
  });

  // node_modules/protobufjs/src/converter.js
  var require_converter = __commonJS({
    "node_modules/protobufjs/src/converter.js"(exports2) {
      "use strict";
      var converter = exports2;
      var Enum = require_enum();
      var util = require_util();
      function genValuePartial_fromObject(gen, field, fieldIndex, prop) {
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum) {
            gen("switch(d%s){", prop);
            for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
              if (field.repeated && values[keys[i]] === field.typeDefault)
                gen("default:");
              gen("case%j:", keys[i])("case %i:", values[keys[i]])("m%s=%j", prop, values[keys[i]])("break");
            }
            gen("}");
          } else
            gen('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", prop, fieldIndex, prop);
        } else {
          var isUnsigned = false;
          switch (field.type) {
            case "double":
            case "float":
              gen("m%s=Number(d%s)", prop, prop);
              break;
            case "uint32":
            case "fixed32":
              gen("m%s=d%s>>>0", prop, prop);
              break;
            case "int32":
            case "sint32":
            case "sfixed32":
              gen("m%s=d%s|0", prop, prop);
              break;
            case "uint64":
              isUnsigned = true;
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
              gen("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", prop, prop, isUnsigned)('else if(typeof d%s==="string")', prop)("m%s=parseInt(d%s,10)", prop, prop)('else if(typeof d%s==="number")', prop)("m%s=d%s", prop, prop)('else if(typeof d%s==="object")', prop)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
              break;
            case "bytes":
              gen('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length)", prop)("m%s=d%s", prop, prop);
              break;
            case "string":
              gen("m%s=String(d%s)", prop, prop);
              break;
            case "bool":
              gen("m%s=Boolean(d%s)", prop, prop);
              break;
          }
        }
        return gen;
      }
      converter.fromObject = function fromObject(mtype) {
        var fields = mtype.fieldsArray;
        var gen = util.codegen(["d"], mtype.name + "\$fromObject")("if(d instanceof this.ctor)")("return d");
        if (!fields.length)
          return gen("return new this.ctor");
        gen("var m=new this.ctor");
        for (var i = 0; i < fields.length; ++i) {
          var field = fields[i].resolve(), prop = util.safeProp(field.name);
          if (field.map) {
            gen("if(d%s){", prop)('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s={}", prop)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
            genValuePartial_fromObject(gen, field, i, prop + "[ks[i]]")("}")("}");
          } else if (field.repeated) {
            gen("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field.fullName + ": array expected")("m%s=[]", prop)("for(var i=0;i<d%s.length;++i){", prop);
            genValuePartial_fromObject(gen, field, i, prop + "[i]")("}")("}");
          } else {
            if (!(field.resolvedType instanceof Enum))
              gen("if(d%s!=null){", prop);
            genValuePartial_fromObject(gen, field, i, prop);
            if (!(field.resolvedType instanceof Enum))
              gen("}");
          }
        }
        return gen("return m");
      };
      function genValuePartial_toObject(gen, field, fieldIndex, prop) {
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum)
            gen("d%s=o.enums===String?types[%i].values[m%s]:m%s", prop, fieldIndex, prop, prop);
          else
            gen("d%s=types[%i].toObject(m%s,o)", prop, fieldIndex, prop);
        } else {
          var isUnsigned = false;
          switch (field.type) {
            case "double":
            case "float":
              gen("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", prop, prop, prop, prop);
              break;
            case "uint64":
              isUnsigned = true;
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64":
              gen('if(typeof m%s==="number")', prop)("d%s=o.longs===String?String(m%s):m%s", prop, prop, prop)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", prop, prop, prop, prop, isUnsigned ? "true" : "", prop);
              break;
            case "bytes":
              gen("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", prop, prop, prop, prop, prop);
              break;
            default:
              gen("d%s=m%s", prop, prop);
              break;
          }
        }
        return gen;
      }
      converter.toObject = function toObject(mtype) {
        var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
        if (!fields.length)
          return util.codegen()("return {}");
        var gen = util.codegen(["m", "o"], mtype.name + "\$toObject")("if(!o)")("o={}")("var d={}");
        var repeatedFields = [], mapFields = [], normalFields = [], i = 0;
        for (; i < fields.length; ++i)
          if (!fields[i].partOf)
            (fields[i].resolve().repeated ? repeatedFields : fields[i].map ? mapFields : normalFields).push(fields[i]);
        if (repeatedFields.length) {
          gen("if(o.arrays||o.defaults){");
          for (i = 0; i < repeatedFields.length; ++i)
            gen("d%s=[]", util.safeProp(repeatedFields[i].name));
          gen("}");
        }
        if (mapFields.length) {
          gen("if(o.objects||o.defaults){");
          for (i = 0; i < mapFields.length; ++i)
            gen("d%s={}", util.safeProp(mapFields[i].name));
          gen("}");
        }
        if (normalFields.length) {
          gen("if(o.defaults){");
          for (i = 0; i < normalFields.length; ++i) {
            var field = normalFields[i], prop = util.safeProp(field.name);
            if (field.resolvedType instanceof Enum)
              gen("d%s=o.enums===String?%j:%j", prop, field.resolvedType.valuesById[field.typeDefault], field.typeDefault);
            else if (field.long)
              gen("if(util.Long){")("var n=new util.Long(%i,%i,%j)", field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", prop)("}else")("d%s=o.longs===String?%j:%i", prop, field.typeDefault.toString(), field.typeDefault.toNumber());
            else if (field.bytes) {
              var arrayDefault = "[" + Array.prototype.slice.call(field.typeDefault).join(",") + "]";
              gen("if(o.bytes===String)d%s=%j", prop, String.fromCharCode.apply(String, field.typeDefault))("else{")("d%s=%s", prop, arrayDefault)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)("}");
            } else
              gen("d%s=%j", prop, field.typeDefault);
          }
          gen("}");
        }
        var hasKs2 = false;
        for (i = 0; i < fields.length; ++i) {
          var field = fields[i], index = mtype._fieldsArray.indexOf(field), prop = util.safeProp(field.name);
          if (field.map) {
            if (!hasKs2) {
              hasKs2 = true;
              gen("var ks2");
            }
            gen("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)("d%s={}", prop)("for(var j=0;j<ks2.length;++j){");
            genValuePartial_toObject(gen, field, index, prop + "[ks2[j]]")("}");
          } else if (field.repeated) {
            gen("if(m%s&&m%s.length){", prop, prop)("d%s=[]", prop)("for(var j=0;j<m%s.length;++j){", prop);
            genValuePartial_toObject(gen, field, index, prop + "[j]")("}");
          } else {
            gen("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field.name);
            genValuePartial_toObject(gen, field, index, prop);
            if (field.partOf)
              gen("if(o.oneofs)")("d%s=%j", util.safeProp(field.partOf.name), field.name);
          }
          gen("}");
        }
        return gen("return d");
      };
    }
  });

  // node_modules/protobufjs/src/wrappers.js
  var require_wrappers = __commonJS({
    "node_modules/protobufjs/src/wrappers.js"(exports2) {
      "use strict";
      var wrappers = exports2;
      var Message = require_message();
      wrappers[".google.protobuf.Any"] = {
        fromObject: function(object) {
          if (object && object["@type"]) {
            var name = object["@type"].substring(object["@type"].lastIndexOf("/") + 1);
            var type = this.lookup(name);
            if (type) {
              var type_url = object["@type"].charAt(0) === "." ? object["@type"].substr(1) : object["@type"];
              if (type_url.indexOf("/") === -1) {
                type_url = "/" + type_url;
              }
              return this.create({
                type_url,
                value: type.encode(type.fromObject(object)).finish()
              });
            }
          }
          return this.fromObject(object);
        },
        toObject: function(message2, options) {
          var googleApi = "type.googleapis.com/";
          var prefix = "";
          var name = "";
          if (options && options.json && message2.type_url && message2.value) {
            name = message2.type_url.substring(message2.type_url.lastIndexOf("/") + 1);
            prefix = message2.type_url.substring(0, message2.type_url.lastIndexOf("/") + 1);
            var type = this.lookup(name);
            if (type)
              message2 = type.decode(message2.value);
          }
          if (!(message2 instanceof this.ctor) && message2 instanceof Message) {
            var object = message2.\$type.toObject(message2, options);
            var messageName = message2.\$type.fullName[0] === "." ? message2.\$type.fullName.substr(1) : message2.\$type.fullName;
            if (prefix === "") {
              prefix = googleApi;
            }
            name = prefix + messageName;
            object["@type"] = name;
            return object;
          }
          return this.toObject(message2, options);
        }
      };
    }
  });

  // node_modules/protobufjs/src/type.js
  var require_type = __commonJS({
    "node_modules/protobufjs/src/type.js"(exports2, module2) {
      "use strict";
      module2.exports = Type;
      var Namespace = require_namespace();
      ((Type.prototype = Object.create(Namespace.prototype)).constructor = Type).className = "Type";
      var Enum = require_enum();
      var OneOf = require_oneof();
      var Field = require_field();
      var MapField = require_mapfield();
      var Service = require_service2();
      var Message = require_message();
      var Reader = require_reader();
      var Writer = require_writer();
      var util = require_util();
      var encoder2 = require_encoder();
      var decoder = require_decoder();
      var verifier = require_verifier();
      var converter = require_converter();
      var wrappers = require_wrappers();
      function Type(name, options) {
        Namespace.call(this, name, options);
        this.fields = {};
        this.oneofs = void 0;
        this.extensions = void 0;
        this.reserved = void 0;
        this.group = void 0;
        this._fieldsById = null;
        this._fieldsArray = null;
        this._oneofsArray = null;
        this._ctor = null;
      }
      Object.defineProperties(Type.prototype, {
        fieldsById: {
          get: function() {
            if (this._fieldsById)
              return this._fieldsById;
            this._fieldsById = {};
            for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
              var field = this.fields[names[i]], id = field.id;
              if (this._fieldsById[id])
                throw Error("duplicate id " + id + " in " + this);
              this._fieldsById[id] = field;
            }
            return this._fieldsById;
          }
        },
        fieldsArray: {
          get: function() {
            return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
          }
        },
        oneofsArray: {
          get: function() {
            return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
          }
        },
        ctor: {
          get: function() {
            return this._ctor || (this.ctor = Type.generateConstructor(this)());
          },
          set: function(ctor) {
            var prototype = ctor.prototype;
            if (!(prototype instanceof Message)) {
              (ctor.prototype = new Message()).constructor = ctor;
              util.merge(ctor.prototype, prototype);
            }
            ctor.\$type = ctor.prototype.\$type = this;
            util.merge(ctor, Message, true);
            this._ctor = ctor;
            var i = 0;
            for (; i < this.fieldsArray.length; ++i)
              this._fieldsArray[i].resolve();
            var ctorProperties = {};
            for (i = 0; i < this.oneofsArray.length; ++i)
              ctorProperties[this._oneofsArray[i].resolve().name] = {
                get: util.oneOfGetter(this._oneofsArray[i].oneof),
                set: util.oneOfSetter(this._oneofsArray[i].oneof)
              };
            if (i)
              Object.defineProperties(ctor.prototype, ctorProperties);
          }
        }
      });
      Type.generateConstructor = function generateConstructor(mtype) {
        var gen = util.codegen(["p"], mtype.name);
        for (var i = 0, field; i < mtype.fieldsArray.length; ++i)
          if ((field = mtype._fieldsArray[i]).map)
            gen("this%s={}", util.safeProp(field.name));
          else if (field.repeated)
            gen("this%s=[]", util.safeProp(field.name));
        return gen("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]");
      };
      function clearCache(type) {
        type._fieldsById = type._fieldsArray = type._oneofsArray = null;
        delete type.encode;
        delete type.decode;
        delete type.verify;
        return type;
      }
      Type.fromJSON = function fromJSON(name, json) {
        var type = new Type(name, json.options);
        type.extensions = json.extensions;
        type.reserved = json.reserved;
        var names = Object.keys(json.fields), i = 0;
        for (; i < names.length; ++i)
          type.add(
            (typeof json.fields[names[i]].keyType !== "undefined" ? MapField.fromJSON : Field.fromJSON)(names[i], json.fields[names[i]])
          );
        if (json.oneofs)
          for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i)
            type.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
        if (json.nested)
          for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
            var nested = json.nested[names[i]];
            type.add(
              (nested.id !== void 0 ? Field.fromJSON : nested.fields !== void 0 ? Type.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service.fromJSON : Namespace.fromJSON)(names[i], nested)
            );
          }
        if (json.extensions && json.extensions.length)
          type.extensions = json.extensions;
        if (json.reserved && json.reserved.length)
          type.reserved = json.reserved;
        if (json.group)
          type.group = true;
        if (json.comment)
          type.comment = json.comment;
        return type;
      };
      Type.prototype.toJSON = function toJSON(toJSONOptions) {
        var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "options",
          inherited && inherited.options || void 0,
          "oneofs",
          Namespace.arrayToJSON(this.oneofsArray, toJSONOptions),
          "fields",
          Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) {
            return !obj.declaringField;
          }), toJSONOptions) || {},
          "extensions",
          this.extensions && this.extensions.length ? this.extensions : void 0,
          "reserved",
          this.reserved && this.reserved.length ? this.reserved : void 0,
          "group",
          this.group || void 0,
          "nested",
          inherited && inherited.nested || void 0,
          "comment",
          keepComments ? this.comment : void 0
        ]);
      };
      Type.prototype.resolveAll = function resolveAll() {
        var fields = this.fieldsArray, i = 0;
        while (i < fields.length)
          fields[i++].resolve();
        var oneofs = this.oneofsArray;
        i = 0;
        while (i < oneofs.length)
          oneofs[i++].resolve();
        return Namespace.prototype.resolveAll.call(this);
      };
      Type.prototype.get = function get3(name) {
        return this.fields[name] || this.oneofs && this.oneofs[name] || this.nested && this.nested[name] || null;
      };
      Type.prototype.add = function add(object) {
        if (this.get(object.name))
          throw Error("duplicate name '" + object.name + "' in " + this);
        if (object instanceof Field && object.extend === void 0) {
          if (this._fieldsById ? this._fieldsById[object.id] : this.fieldsById[object.id])
            throw Error("duplicate id " + object.id + " in " + this);
          if (this.isReservedId(object.id))
            throw Error("id " + object.id + " is reserved in " + this);
          if (this.isReservedName(object.name))
            throw Error("name '" + object.name + "' is reserved in " + this);
          if (object.parent)
            object.parent.remove(object);
          this.fields[object.name] = object;
          object.message = this;
          object.onAdd(this);
          return clearCache(this);
        }
        if (object instanceof OneOf) {
          if (!this.oneofs)
            this.oneofs = {};
          this.oneofs[object.name] = object;
          object.onAdd(this);
          return clearCache(this);
        }
        return Namespace.prototype.add.call(this, object);
      };
      Type.prototype.remove = function remove(object) {
        if (object instanceof Field && object.extend === void 0) {
          if (!this.fields || this.fields[object.name] !== object)
            throw Error(object + " is not a member of " + this);
          delete this.fields[object.name];
          object.parent = null;
          object.onRemove(this);
          return clearCache(this);
        }
        if (object instanceof OneOf) {
          if (!this.oneofs || this.oneofs[object.name] !== object)
            throw Error(object + " is not a member of " + this);
          delete this.oneofs[object.name];
          object.parent = null;
          object.onRemove(this);
          return clearCache(this);
        }
        return Namespace.prototype.remove.call(this, object);
      };
      Type.prototype.isReservedId = function isReservedId(id) {
        return Namespace.isReservedId(this.reserved, id);
      };
      Type.prototype.isReservedName = function isReservedName(name) {
        return Namespace.isReservedName(this.reserved, name);
      };
      Type.prototype.create = function create(properties) {
        return new this.ctor(properties);
      };
      Type.prototype.setup = function setup() {
        var fullName = this.fullName, types = [];
        for (var i = 0; i < this.fieldsArray.length; ++i)
          types.push(this._fieldsArray[i].resolve().resolvedType);
        this.encode = encoder2(this)({
          Writer,
          types,
          util
        });
        this.decode = decoder(this)({
          Reader,
          types,
          util
        });
        this.verify = verifier(this)({
          types,
          util
        });
        this.fromObject = converter.fromObject(this)({
          types,
          util
        });
        this.toObject = converter.toObject(this)({
          types,
          util
        });
        var wrapper = wrappers[fullName];
        if (wrapper) {
          var originalThis = Object.create(this);
          originalThis.fromObject = this.fromObject;
          this.fromObject = wrapper.fromObject.bind(originalThis);
          originalThis.toObject = this.toObject;
          this.toObject = wrapper.toObject.bind(originalThis);
        }
        return this;
      };
      Type.prototype.encode = function encode_setup(message2, writer) {
        return this.setup().encode(message2, writer);
      };
      Type.prototype.encodeDelimited = function encodeDelimited(message2, writer) {
        return this.encode(message2, writer && writer.len ? writer.fork() : writer).ldelim();
      };
      Type.prototype.decode = function decode_setup(reader, length) {
        return this.setup().decode(reader, length);
      };
      Type.prototype.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof Reader))
          reader = Reader.create(reader);
        return this.decode(reader, reader.uint32());
      };
      Type.prototype.verify = function verify_setup(message2) {
        return this.setup().verify(message2);
      };
      Type.prototype.fromObject = function fromObject(object) {
        return this.setup().fromObject(object);
      };
      Type.prototype.toObject = function toObject(message2, options) {
        return this.setup().toObject(message2, options);
      };
      Type.d = function decorateType(typeName) {
        return function typeDecorator(target) {
          util.decorateType(target, typeName);
        };
      };
    }
  });

  // node_modules/protobufjs/src/root.js
  var require_root = __commonJS({
    "node_modules/protobufjs/src/root.js"(exports2, module2) {
      "use strict";
      module2.exports = Root;
      var Namespace = require_namespace();
      ((Root.prototype = Object.create(Namespace.prototype)).constructor = Root).className = "Root";
      var Field = require_field();
      var Enum = require_enum();
      var OneOf = require_oneof();
      var util = require_util();
      var Type;
      var parse;
      var common;
      function Root(options) {
        Namespace.call(this, "", options);
        this.deferred = [];
        this.files = [];
      }
      Root.fromJSON = function fromJSON(json, root3) {
        if (!root3)
          root3 = new Root();
        if (json.options)
          root3.setOptions(json.options);
        return root3.addJSON(json.nested);
      };
      Root.prototype.resolvePath = util.path.resolve;
      Root.prototype.fetch = util.fetch;
      function SYNC() {
      }
      Root.prototype.load = function load3(filename, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = void 0;
        }
        var self2 = this;
        if (!callback)
          return util.asPromise(load3, self2, filename, options);
        var sync = callback === SYNC;
        function finish(err, root3) {
          if (!callback)
            return;
          var cb = callback;
          callback = null;
          if (sync)
            throw err;
          cb(err, root3);
        }
        function getBundledFileName(filename2) {
          var idx = filename2.lastIndexOf("google/protobuf/");
          if (idx > -1) {
            var altname = filename2.substring(idx);
            if (altname in common)
              return altname;
          }
          return null;
        }
        function process(filename2, source) {
          try {
            if (util.isString(source) && source.charAt(0) === "{")
              source = JSON.parse(source);
            if (!util.isString(source))
              self2.setOptions(source.options).addJSON(source.nested);
            else {
              parse.filename = filename2;
              var parsed = parse(source, self2, options), resolved2, i2 = 0;
              if (parsed.imports) {
                for (; i2 < parsed.imports.length; ++i2)
                  if (resolved2 = getBundledFileName(parsed.imports[i2]) || self2.resolvePath(filename2, parsed.imports[i2]))
                    fetch2(resolved2);
              }
              if (parsed.weakImports) {
                for (i2 = 0; i2 < parsed.weakImports.length; ++i2)
                  if (resolved2 = getBundledFileName(parsed.weakImports[i2]) || self2.resolvePath(filename2, parsed.weakImports[i2]))
                    fetch2(resolved2, true);
              }
            }
          } catch (err) {
            finish(err);
          }
          if (!sync && !queued)
            finish(null, self2);
        }
        function fetch2(filename2, weak) {
          if (self2.files.indexOf(filename2) > -1)
            return;
          self2.files.push(filename2);
          if (filename2 in common) {
            if (sync)
              process(filename2, common[filename2]);
            else {
              ++queued;
              setTimeout(function() {
                --queued;
                process(filename2, common[filename2]);
              });
            }
            return;
          }
          if (sync) {
            var source;
            try {
              source = util.fs.readFileSync(filename2).toString("utf8");
            } catch (err) {
              if (!weak)
                finish(err);
              return;
            }
            process(filename2, source);
          } else {
            ++queued;
            self2.fetch(filename2, function(err, source2) {
              --queued;
              if (!callback)
                return;
              if (err) {
                if (!weak)
                  finish(err);
                else if (!queued)
                  finish(null, self2);
                return;
              }
              process(filename2, source2);
            });
          }
        }
        var queued = 0;
        if (util.isString(filename))
          filename = [filename];
        for (var i = 0, resolved; i < filename.length; ++i)
          if (resolved = self2.resolvePath("", filename[i]))
            fetch2(resolved);
        if (sync)
          return self2;
        if (!queued)
          finish(null, self2);
        return void 0;
      };
      Root.prototype.loadSync = function loadSync(filename, options) {
        if (!util.isNode)
          throw Error("not supported");
        return this.load(filename, options, SYNC);
      };
      Root.prototype.resolveAll = function resolveAll() {
        if (this.deferred.length)
          throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
            return "'extend " + field.extend + "' in " + field.parent.fullName;
          }).join(", "));
        return Namespace.prototype.resolveAll.call(this);
      };
      var exposeRe = /^[A-Z]/;
      function tryHandleExtension(root3, field) {
        var extendedType = field.parent.lookup(field.extend);
        if (extendedType) {
          var sisterField = new Field(field.fullName, field.id, field.type, field.rule, void 0, field.options);
          sisterField.declaringField = field;
          field.extensionField = sisterField;
          extendedType.add(sisterField);
          return true;
        }
        return false;
      }
      Root.prototype._handleAdd = function _handleAdd(object) {
        if (object instanceof Field) {
          if (object.extend !== void 0 && !object.extensionField) {
            if (!tryHandleExtension(this, object))
              this.deferred.push(object);
          }
        } else if (object instanceof Enum) {
          if (exposeRe.test(object.name))
            object.parent[object.name] = object.values;
        } else if (!(object instanceof OneOf)) {
          if (object instanceof Type)
            for (var i = 0; i < this.deferred.length; )
              if (tryHandleExtension(this, this.deferred[i]))
                this.deferred.splice(i, 1);
              else
                ++i;
          for (var j = 0; j < object.nestedArray.length; ++j)
            this._handleAdd(object._nestedArray[j]);
          if (exposeRe.test(object.name))
            object.parent[object.name] = object;
        }
      };
      Root.prototype._handleRemove = function _handleRemove(object) {
        if (object instanceof Field) {
          if (object.extend !== void 0) {
            if (object.extensionField) {
              object.extensionField.parent.remove(object.extensionField);
              object.extensionField = null;
            } else {
              var index = this.deferred.indexOf(object);
              if (index > -1)
                this.deferred.splice(index, 1);
            }
          }
        } else if (object instanceof Enum) {
          if (exposeRe.test(object.name))
            delete object.parent[object.name];
        } else if (object instanceof Namespace) {
          for (var i = 0; i < object.nestedArray.length; ++i)
            this._handleRemove(object._nestedArray[i]);
          if (exposeRe.test(object.name))
            delete object.parent[object.name];
        }
      };
      Root._configure = function(Type_, parse_, common_) {
        Type = Type_;
        parse = parse_;
        common = common_;
      };
    }
  });

  // node_modules/protobufjs/src/util.js
  var require_util = __commonJS({
    "node_modules/protobufjs/src/util.js"(exports2, module2) {
      "use strict";
      var util = module2.exports = require_minimal();
      var roots = require_roots();
      var Type;
      var Enum;
      util.codegen = require_codegen();
      util.fetch = require_fetch();
      util.path = require_path();
      util.fs = util.inquire("fs");
      util.toArray = function toArray(object) {
        if (object) {
          var keys = Object.keys(object), array = new Array(keys.length), index = 0;
          while (index < keys.length)
            array[index] = object[keys[index++]];
          return array;
        }
        return [];
      };
      util.toObject = function toObject(array) {
        var object = {}, index = 0;
        while (index < array.length) {
          var key = array[index++], val = array[index++];
          if (val !== void 0)
            object[key] = val;
        }
        return object;
      };
      var safePropBackslashRe = /\\\\/g;
      var safePropQuoteRe = /"/g;
      util.isReserved = function isReserved(name) {
        return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)\$/.test(name);
      };
      util.safeProp = function safeProp(prop) {
        if (!/^[\$\\w_]+\$/.test(prop) || util.isReserved(prop))
          return '["' + prop.replace(safePropBackslashRe, "\\\\\\\\").replace(safePropQuoteRe, '\\\\"') + '"]';
        return "." + prop;
      };
      util.ucFirst = function ucFirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      };
      var camelCaseRe = /_([a-z])/g;
      util.camelCase = function camelCase(str) {
        return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function(\$0, \$1) {
          return \$1.toUpperCase();
        });
      };
      util.compareFieldsById = function compareFieldsById(a, b) {
        return a.id - b.id;
      };
      util.decorateType = function decorateType(ctor, typeName) {
        if (ctor.\$type) {
          if (typeName && ctor.\$type.name !== typeName) {
            util.decorateRoot.remove(ctor.\$type);
            ctor.\$type.name = typeName;
            util.decorateRoot.add(ctor.\$type);
          }
          return ctor.\$type;
        }
        if (!Type)
          Type = require_type();
        var type = new Type(typeName || ctor.name);
        util.decorateRoot.add(type);
        type.ctor = ctor;
        Object.defineProperty(ctor, "\$type", { value: type, enumerable: false });
        Object.defineProperty(ctor.prototype, "\$type", { value: type, enumerable: false });
        return type;
      };
      var decorateEnumIndex = 0;
      util.decorateEnum = function decorateEnum(object) {
        if (object.\$type)
          return object.\$type;
        if (!Enum)
          Enum = require_enum();
        var enm = new Enum("Enum" + decorateEnumIndex++, object);
        util.decorateRoot.add(enm);
        Object.defineProperty(object, "\$type", { value: enm, enumerable: false });
        return enm;
      };
      util.setProperty = function setProperty(dst, path2, value) {
        function setProp(dst2, path3, value2) {
          var part = path3.shift();
          if (part === "__proto__") {
            return dst2;
          }
          if (path3.length > 0) {
            dst2[part] = setProp(dst2[part] || {}, path3, value2);
          } else {
            var prevValue = dst2[part];
            if (prevValue)
              value2 = [].concat(prevValue).concat(value2);
            dst2[part] = value2;
          }
          return dst2;
        }
        if (typeof dst !== "object")
          throw TypeError("dst must be an object");
        if (!path2)
          throw TypeError("path must be specified");
        path2 = path2.split(".");
        return setProp(dst, path2, value);
      };
      Object.defineProperty(util, "decorateRoot", {
        get: function() {
          return roots["decorated"] || (roots["decorated"] = new (require_root())());
        }
      });
    }
  });

  // node_modules/protobufjs/src/object.js
  var require_object = __commonJS({
    "node_modules/protobufjs/src/object.js"(exports2, module2) {
      "use strict";
      module2.exports = ReflectionObject;
      ReflectionObject.className = "ReflectionObject";
      var util = require_util();
      var Root;
      function ReflectionObject(name, options) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        if (options && !util.isObject(options))
          throw TypeError("options must be an object");
        this.options = options;
        this.parsedOptions = null;
        this.name = name;
        this.parent = null;
        this.resolved = false;
        this.comment = null;
        this.filename = null;
      }
      Object.defineProperties(ReflectionObject.prototype, {
        root: {
          get: function() {
            var ptr = this;
            while (ptr.parent !== null)
              ptr = ptr.parent;
            return ptr;
          }
        },
        fullName: {
          get: function() {
            var path2 = [this.name], ptr = this.parent;
            while (ptr) {
              path2.unshift(ptr.name);
              ptr = ptr.parent;
            }
            return path2.join(".");
          }
        }
      });
      ReflectionObject.prototype.toJSON = function toJSON() {
        throw Error();
      };
      ReflectionObject.prototype.onAdd = function onAdd(parent) {
        if (this.parent && this.parent !== parent)
          this.parent.remove(this);
        this.parent = parent;
        this.resolved = false;
        var root3 = parent.root;
        if (root3 instanceof Root)
          root3._handleAdd(this);
      };
      ReflectionObject.prototype.onRemove = function onRemove(parent) {
        var root3 = parent.root;
        if (root3 instanceof Root)
          root3._handleRemove(this);
        this.parent = null;
        this.resolved = false;
      };
      ReflectionObject.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (this.root instanceof Root)
          this.resolved = true;
        return this;
      };
      ReflectionObject.prototype.getOption = function getOption(name) {
        if (this.options)
          return this.options[name];
        return void 0;
      };
      ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
        if (!ifNotSet || !this.options || this.options[name] === void 0)
          (this.options || (this.options = {}))[name] = value;
        return this;
      };
      ReflectionObject.prototype.setParsedOption = function setParsedOption(name, value, propName) {
        if (!this.parsedOptions) {
          this.parsedOptions = [];
        }
        var parsedOptions = this.parsedOptions;
        if (propName) {
          var opt = parsedOptions.find(function(opt2) {
            return Object.prototype.hasOwnProperty.call(opt2, name);
          });
          if (opt) {
            var newValue = opt[name];
            util.setProperty(newValue, propName, value);
          } else {
            opt = {};
            opt[name] = util.setProperty({}, propName, value);
            parsedOptions.push(opt);
          }
        } else {
          var newOpt = {};
          newOpt[name] = value;
          parsedOptions.push(newOpt);
        }
        return this;
      };
      ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
        if (options)
          for (var keys = Object.keys(options), i = 0; i < keys.length; ++i)
            this.setOption(keys[i], options[keys[i]], ifNotSet);
        return this;
      };
      ReflectionObject.prototype.toString = function toString() {
        var className = this.constructor.className, fullName = this.fullName;
        if (fullName.length)
          return className + " " + fullName;
        return className;
      };
      ReflectionObject._configure = function(Root_) {
        Root = Root_;
      };
    }
  });

  // node_modules/protobufjs/src/enum.js
  var require_enum = __commonJS({
    "node_modules/protobufjs/src/enum.js"(exports2, module2) {
      "use strict";
      module2.exports = Enum;
      var ReflectionObject = require_object();
      ((Enum.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum).className = "Enum";
      var Namespace = require_namespace();
      var util = require_util();
      function Enum(name, values, options, comment, comments) {
        ReflectionObject.call(this, name, options);
        if (values && typeof values !== "object")
          throw TypeError("values must be an object");
        this.valuesById = {};
        this.values = Object.create(this.valuesById);
        this.comment = comment;
        this.comments = comments || {};
        this.reserved = void 0;
        if (values) {
          for (var keys = Object.keys(values), i = 0; i < keys.length; ++i)
            if (typeof values[keys[i]] === "number")
              this.valuesById[this.values[keys[i]] = values[keys[i]]] = keys[i];
        }
      }
      Enum.fromJSON = function fromJSON(name, json) {
        var enm = new Enum(name, json.values, json.options, json.comment, json.comments);
        enm.reserved = json.reserved;
        return enm;
      };
      Enum.prototype.toJSON = function toJSON(toJSONOptions) {
        var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
        return util.toObject([
          "options",
          this.options,
          "values",
          this.values,
          "reserved",
          this.reserved && this.reserved.length ? this.reserved : void 0,
          "comment",
          keepComments ? this.comment : void 0,
          "comments",
          keepComments ? this.comments : void 0
        ]);
      };
      Enum.prototype.add = function add(name, id, comment) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        if (!util.isInteger(id))
          throw TypeError("id must be an integer");
        if (this.values[name] !== void 0)
          throw Error("duplicate name '" + name + "' in " + this);
        if (this.isReservedId(id))
          throw Error("id " + id + " is reserved in " + this);
        if (this.isReservedName(name))
          throw Error("name '" + name + "' is reserved in " + this);
        if (this.valuesById[id] !== void 0) {
          if (!(this.options && this.options.allow_alias))
            throw Error("duplicate id " + id + " in " + this);
          this.values[name] = id;
        } else
          this.valuesById[this.values[name] = id] = name;
        this.comments[name] = comment || null;
        return this;
      };
      Enum.prototype.remove = function remove(name) {
        if (!util.isString(name))
          throw TypeError("name must be a string");
        var val = this.values[name];
        if (val == null)
          throw Error("name '" + name + "' does not exist in " + this);
        delete this.valuesById[val];
        delete this.values[name];
        delete this.comments[name];
        return this;
      };
      Enum.prototype.isReservedId = function isReservedId(id) {
        return Namespace.isReservedId(this.reserved, id);
      };
      Enum.prototype.isReservedName = function isReservedName(name) {
        return Namespace.isReservedName(this.reserved, name);
      };
    }
  });

  // node_modules/protobufjs/src/encoder.js
  var require_encoder = __commonJS({
    "node_modules/protobufjs/src/encoder.js"(exports2, module2) {
      "use strict";
      module2.exports = encoder2;
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      function genTypePartial(gen, field, fieldIndex, ref) {
        return field.resolvedType.group ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
      }
      function encoder2(mtype) {
        var gen = util.codegen(["m", "w"], mtype.name + "\$encode")("if(!w)")("w=Writer.create()");
        var i, ref;
        var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
        for (var i = 0; i < fields.length; ++i) {
          var field = fields[i].resolve(), index = mtype._fieldsArray.indexOf(field), type = field.resolvedType instanceof Enum ? "int32" : field.type, wireType = types.basic[type];
          ref = "m" + util.safeProp(field.name);
          if (field.map) {
            gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType);
            if (wireType === void 0)
              gen("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref);
            else
              gen(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
            gen("}")("}");
          } else if (field.repeated) {
            gen("if(%s!=null&&%s.length){", ref, ref);
            if (field.packed && types.packed[type] !== void 0) {
              gen("w.uint32(%i).fork()", (field.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", ref)("w.%s(%s[i])", type, ref)("w.ldelim()");
            } else {
              gen("for(var i=0;i<%s.length;++i)", ref);
              if (wireType === void 0)
                genTypePartial(gen, field, index, ref + "[i]");
              else
                gen("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);
            }
            gen("}");
          } else {
            if (field.optional)
              gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field.name);
            if (wireType === void 0)
              genTypePartial(gen, field, index, ref);
            else
              gen("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);
          }
        }
        return gen("return w");
      }
    }
  });

  // node_modules/protobufjs/src/index-light.js
  var require_index_light = __commonJS({
    "node_modules/protobufjs/src/index-light.js"(exports2, module2) {
      "use strict";
      var protobuf3 = module2.exports = require_index_minimal();
      protobuf3.build = "light";
      function load3(filename, root3, callback) {
        if (typeof root3 === "function") {
          callback = root3;
          root3 = new protobuf3.Root();
        } else if (!root3)
          root3 = new protobuf3.Root();
        return root3.load(filename, callback);
      }
      protobuf3.load = load3;
      function loadSync(filename, root3) {
        if (!root3)
          root3 = new protobuf3.Root();
        return root3.loadSync(filename);
      }
      protobuf3.loadSync = loadSync;
      protobuf3.encoder = require_encoder();
      protobuf3.decoder = require_decoder();
      protobuf3.verifier = require_verifier();
      protobuf3.converter = require_converter();
      protobuf3.ReflectionObject = require_object();
      protobuf3.Namespace = require_namespace();
      protobuf3.Root = require_root();
      protobuf3.Enum = require_enum();
      protobuf3.Type = require_type();
      protobuf3.Field = require_field();
      protobuf3.OneOf = require_oneof();
      protobuf3.MapField = require_mapfield();
      protobuf3.Service = require_service2();
      protobuf3.Method = require_method();
      protobuf3.Message = require_message();
      protobuf3.wrappers = require_wrappers();
      protobuf3.types = require_types();
      protobuf3.util = require_util();
      protobuf3.ReflectionObject._configure(protobuf3.Root);
      protobuf3.Namespace._configure(protobuf3.Type, protobuf3.Service, protobuf3.Enum);
      protobuf3.Root._configure(protobuf3.Type);
      protobuf3.Field._configure(protobuf3.Type);
    }
  });

  // node_modules/protobufjs/light.js
  var require_light = __commonJS({
    "node_modules/protobufjs/light.js"(exports2, module2) {
      "use strict";
      module2.exports = require_index_light();
    }
  });

  // src/runtime/element/create_element.ts
  function createSVG(element) {
    const node2 = document.createElementNS("http://www.w3.org/2000/svg", element.tagName);
    element.props && Object.entries(element.props).forEach((d) => {
      node2.setAttribute(d[0], d[1]);
    });
    element.children && element.children.forEach((d) => {
      node2.appendChild(createSVG(d));
    });
    return node2;
  }
  function createElement(element) {
    if (element.tagName === "text") {
      return document.createTextNode(element.text);
    }
    if (element.tagName === "svg") {
      return createSVG(element);
    }
    const node2 = document.createElement(element.tagName);
    element.props && Object.entries(element.props).forEach((d) => {
      node2.setAttribute(d[0], d[1]);
    });
    element.text && node2.appendChild(document.createTextNode(element.text));
    element.event && Object.entries(element.event).forEach((d) => {
      node2.addEventListener(...d);
    });
    element.children && element.children.forEach((d) => {
      node2.appendChild(createElement(d));
    });
    return node2;
  }
  function createElements(elements) {
    const fragment = document.createDocumentFragment();
    elements.forEach((d) => {
      fragment.appendChild(createElement(d));
    });
    return fragment;
  }

  // src/runtime/element/html_vnode.ts
  var Vnode = class {
    tagName;
    props = {};
    children = [];
    text;
    constructor(tagName) {
      this.tagName = tagName;
    }
  };
  var Scanner = class {
    html;
    pos = 0;
    vnode = [];
    tagNames = [];
    targets = [];
    text = "";
    quote = "";
    constructor(html) {
      this.html = html;
      this.targets.push({ children: this.vnode });
      while (this.html) {
        this.organizeTag();
      }
      this.textContent();
    }
    organizeTag() {
      if (!this.quote && this.html[0] === "<") {
        if (this.html.startsWith(\`</\${this.tagNames.reduce((s, d) => s = d, void 0)}\`)) {
          this.textContent();
          this.html = this.html.replace(new RegExp(\`^</\${this.tagNames.reduce((s, d) => s = d, void 0)}>\`), "");
          this.popNode();
        } else {
          this.removeScanned();
          if (this.html.startsWith("!-- ")) {
            this.html = this.html.replace(/^!--[\\S\\s]+?-->/, "");
          }
          if (/^[a-zA-Z]/.test(this.html)) {
            this.textContent();
            const func = [];
            let stop = false;
            for (this.pos = 0; this.pos < this.html.length; this.pos++) {
              if (stop) {
                this.pos--;
                break;
              }
              switch (this.html[this.pos]) {
                case " ":
                case "\\r":
                case "\\n":
                  func.push(() => this.organizeProp());
                  stop = true;
                  break;
                case ">":
                  this.html[this.pos - 1] === "/" ? func.push(() => this.popNode()) : func.push(() => this.tagSingle());
                  stop = true;
                  break;
              }
            }
            const tagName = this.html.substring(0, this.pos);
            const tag = new Vnode(tagName);
            this.tagNames.push(tagName);
            this.targets.reduce((s, d) => s = d, void 0).children.push(tag);
            this.targets.push(tag);
            this.removeScanned(this.pos + 1);
            func.forEach((d) => d());
          }
        }
      } else {
        switch (this.html[0]) {
          case "'":
            !this.quote ? this.quote = "'" : this.quote === "'" && (this.quote = "");
            break;
          case '"':
            !this.quote ? this.quote = '"' : this.quote === '"' && (this.quote = "");
            break;
          case "\`":
            !this.quote ? this.quote = "\`" : this.quote === "\`" && (this.quote = "");
            break;
        }
        this.text += this.html[0];
        this.removeScanned();
      }
    }
    organizeProp() {
      let value = false;
      let stop = false;
      let start = 0;
      let popd = false;
      for (this.pos = 0; this.pos < this.html.length; this.pos++) {
        if (stop)
          break;
        switch (this.html[this.pos]) {
          case '"':
            value = !value;
            break;
          case " ":
            if (!value) {
              const str = this.html.substring(start, this.pos).replace(/\\r|\\n|"/g, "").replace(/^ +/, "");
              const prop = str.split("=");
              const key = prop.shift();
              key && key !== "/" && (this.targets.reduce((s, d) => s = d, void 0).props[key] = prop.join("=") || key);
              start = this.pos;
            }
            break;
          case ">":
            if (!value) {
              stop = true;
              const str = this.html.substring(start, this.pos).replace(/\\r|\\n|"/g, "").replace(/^ +/, "");
              const prop = str.split("=");
              const key = prop.shift();
              key && key !== "/" && (this.targets.reduce((s, d) => s = d, void 0).props[key] = prop.join("=") || key);
              if (this.html[this.pos - 1] === "/") {
                this.popNode();
                popd = true;
              }
            }
            break;
        }
      }
      if (!popd)
        this.tagSingle();
      this.removeScanned(this.pos--);
    }
    tagSingle() {
      switch (this.tagNames.reduce((s, d) => s = d, void 0)) {
        case "area":
        case "base":
        case "br":
        case "col":
        case "colgroup":
        case "command":
        case "embed":
        case "hr":
        case "img":
        case "input":
        case "keygen":
        case "link":
        case "meta":
        case "param":
        case "path":
        case "source":
        case "track":
        case "wbr":
          this.popNode();
          break;
      }
    }
    popNode() {
      this.tagNames.splice(this.tagNames.length - 1, 1);
      this.targets.splice(this.targets.length - 1, 1);
      this.text = "";
    }
    removeScanned(length = 1) {
      this.html = this.html.slice(length);
    }
    textContent() {
      const text = this.text.replace(/\\r|\\n| /g, "");
      if (text) {
        const tag = new Vnode("text");
        tag.text = this.text;
        this.targets.reduce((s, d) => s = d, void 0).children.push(tag);
      }
      this.text = "";
    }
  };
  function htmlVnode(html) {
    return new Scanner(html).vnode;
  }

  // src/runtime/format/integer.ts
  function integerFormat(num, byte = 2) {
    return num < 10 ** byte ? (Array(byte).join("0") + num).slice(-1 * byte) : num;
  }

  // src/runtime/format/time.ts
  function timeFormat(time = new Date().getTime(), type) {
    const date = new Date(time);
    const arr2 = date.toLocaleString().split(" ");
    const day = arr2[0].split("/");
    day[1] = integerFormat(day[1], 2);
    day[2] = integerFormat(day[2], 2);
    return type ? day.join("-") + " " + arr2[1] : arr2[1];
  }

  // src/runtime/debug.ts
  var group = {
    i: 0,
    call: []
  };
  function debug(...data) {
    group.call.push(console.log.bind(console, \`%c[\${timeFormat()}]\`, "color: blue;", ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  }
  debug.assert = function(condition, ...data) {
    group.call.push(console.assert.bind(console, \`[\${timeFormat()}]\`, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  };
  debug.clear = function() {
    group.i = 0;
    group.call = [];
    setTimeout(console.clear.bind(console));
    return debug;
  };
  debug.debug = function(...data) {
    group.call.push(console.debug.bind(console, \`[\${timeFormat()}]\`, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  };
  debug.error = function(...data) {
    group.call.push(console.error.bind(console, \`[\${timeFormat()}]\`, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  };
  debug.group = function(...data) {
    group.i++;
    group.call.push(console.group.bind(console, \`[\${timeFormat()}]\`, ...arguments));
    return debug;
  };
  debug.groupCollapsed = function(...data) {
    group.i++;
    group.call.push(console.groupCollapsed.bind(console, \`[\${timeFormat()}]\`, ...arguments));
    return debug;
  };
  debug.groupEnd = function() {
    if (group.i) {
      group.i--;
      group.call.push(console.groupEnd.bind(console));
      !group.i && (group.call.push(() => group.call = []), group.call.forEach((d) => setTimeout(d)));
    }
    return debug;
  };
  debug.info = function(...data) {
    group.call.push(console.info.bind(console, \`%c[\${timeFormat()}]\`, "color: blue;", ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  };
  debug.log = function(...data) {
    group.call.push(console.log.bind(console, \`%c[\${timeFormat()}]\`, "color: blue;", ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  };
  debug.table = function(tabularData, properties) {
    group.call.push(console.table.bind(console, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  };
  debug.time = function(label) {
    console.time(label);
    return debug;
  };
  debug.timeEnd = function(label) {
    console.timeEnd(label);
    return debug;
  };
  debug.timeLog = function(label, ...data) {
    console.timeLog(label, \`[\${timeFormat()}]\`, ...data);
    return debug;
  };
  debug.trace = function(...data) {
    group.call.push(console.trace.bind(console, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  };
  debug.warn = function(...data) {
    group.call.push(console.warn.bind(console, \`[\${timeFormat()}]\`, ...arguments));
    !group.i && setTimeout(group.call.shift());
    return debug;
  };

  // src/runtime/format/url.ts
  var URLEs = class extends URL {
    constructor(url, base) {
      if (!base && typeof url === "string" && !/^[a-z]+:/.test(url)) {
        if (url.includes("=") && !url.includes("?") || !/^[A-Za-z0-9]/.test(url)) {
          base = location.origin;
        } else {
          const str = url.startsWith("//") ? "" : "//";
          url = location.protocol + str + url;
        }
      }
      super(url, base);
    }
  };
  function objUrl(url, obj) {
    const res = new URLEs(url);
    Object.entries(obj).forEach((d) => {
      if (d[1] || d[1] === "") {
        res.searchParams.set(d[0], d[1]);
      }
    });
    return res.toJSON();
  }
  function urlObj(url) {
    const res = new URLEs(url);
    const result = {};
    res.searchParams.forEach((v, k) => {
      result[k] = v;
    });
    return result;
  }

  // src/runtime/hook/node.ts
  var appendChildHead = HTMLHeadElement.prototype.appendChild;
  var appendChildBody = HTMLBodyElement.prototype.appendChild;
  var insertBeforeHead = HTMLHeadElement.prototype.insertBefore;
  var insertBeforeBody = HTMLBodyElement.prototype.insertBefore;
  var jsonp = [];
  HTMLHeadElement.prototype.appendChild = function(newChild) {
    newChild.nodeName == "SCRIPT" && newChild.src && jsonp.forEach((d) => {
      d[0].every((d2) => newChild.src.includes(d2)) && d[1].call(newChild);
    });
    return appendChildHead.call(this, newChild);
  };
  HTMLBodyElement.prototype.appendChild = function(newChild) {
    newChild.nodeName == "SCRIPT" && newChild.src && jsonp.forEach((d) => {
      d[0].every((d2) => newChild.src.includes(d2)) && d[1].call(newChild);
    });
    return appendChildBody.call(this, newChild);
  };
  HTMLHeadElement.prototype.insertBefore = function(newChild, refChild) {
    newChild.nodeName == "SCRIPT" && newChild.src && jsonp.forEach((d) => {
      d[0].every((d2) => newChild.src.includes(d2)) && d[1].call(newChild);
    });
    return insertBeforeHead.call(this, newChild, refChild);
  };
  HTMLBodyElement.prototype.insertBefore = function(newChild, refChild) {
    newChild.nodeName == "SCRIPT" && newChild.src && jsonp.forEach((d) => {
      d[0].every((d2) => newChild.src.includes(d2)) && d[1].call(newChild);
    });
    return insertBeforeBody.call(this, newChild, refChild);
  };
  function jsonphook(url, redirect, modifyResponse, once = true) {
    let id;
    const one = Array.isArray(url) ? url : [url];
    const two = function() {
      once && id && delete jsonp[id - 1];
      if (redirect)
        try {
          this.src = redirect(this.src) || this.src;
        } catch (e) {
          debug.error("redirect of jsonphook", one, e);
        }
      if (modifyResponse) {
        const obj = urlObj(this.src);
        if (obj) {
          const callback = obj.callback;
          const call = window[callback];
          const url2 = this.src;
          if (call) {
            window[callback] = function(v) {
              try {
                v = modifyResponse(v, url2, call) || v;
              } catch (e) {
                debug.error("modifyResponse of jsonphook", one, e);
              }
              return v !== true && call(v);
            };
          }
        }
      }
    };
    return id = jsonp.push([one, two]);
  }
  function jsonphookasync(url, condition, modifyResponse, once = true) {
    let id;
    const one = Array.isArray(url) ? url : [url];
    const two = function() {
      try {
        once && id && delete jsonp[id - 1];
        if (!condition || condition(this.src)) {
          const obj = urlObj(this.src);
          if (obj) {
            const callback = obj.callback;
            const call = window[callback];
            if (call) {
              modifyResponse && modifyResponse(this.src).then((d) => {
                window[callback](d);
                this.dispatchEvent(new ProgressEvent("load"));
              }).catch((e) => {
                this.dispatchEvent(new ProgressEvent("error"));
                debug.error("modifyResponse of xhrhookasync", one, e);
              });
            }
            this.removeAttribute("src");
          }
        }
      } catch (e) {
        debug.error("jsonphook", one, e);
      }
    };
    return id = jsonp.push([one, two]);
  }

  // src/runtime/lib/typeof.ts
  var isArray = Array.isArray;
  var isObject = (val) => val !== null && typeof val === "object";

  // src/tampermonkey/check.ts
  var isUserScript = false;
  try {
    GM_getValue("config");
    isUserScript = true;
  } catch {
  }

  // src/runtime/variable/mutex.ts
  var mutex = Math.random().toString(36).substring(2);

  // src/runtime/gm.ts
  var xhrGM = [];
  var getValue = [];
  var cookiesEs = [];
  window.addEventListener("message", (ev) => {
    if (isUserScript)
      return;
    if (typeof ev.data === "object" && ev.data.flag === mutex) {
      switch (ev.data.\$type) {
        case "xhrGMResponse":
          if (xhrGM[ev.data.index]) {
            Reflect.has(ev.data, "resolve") && xhrGM[ev.data.index][0](ev.data.resolve);
            Reflect.has(ev.data, "reject") && xhrGM[ev.data.index][1](ev.data.reject);
            delete xhrGM[ev.data.index];
          }
          break;
        case "getValueResponse":
          if (getValue[ev.data.index]) {
            Reflect.has(ev.data, "resolve") && getValue[ev.data.index][0](ev.data.resolve);
            Reflect.has(ev.data, "reject") && getValue[ev.data.index][1](ev.data.reject);
            delete getValue[ev.data.index];
          }
          break;
        case "cookiesResponse":
          if (cookiesEs[ev.data.index]) {
            Reflect.has(ev.data, "resolve") && cookiesEs[ev.data.index][0](ev.data.resolve);
            Reflect.has(ev.data, "reject") && cookiesEs[ev.data.index][1](ev.data.reject);
            delete cookiesEs[ev.data.index];
          }
          break;
      }
    }
  });
  var GM = {
    xhr(details) {
      return new Promise((resolve, reject) => {
        details.method = details.method || "GET";
        details.onload = details.onload || ((xhr2) => {
          resolve(xhr2.response);
        });
        details.onerror = details.onerror || ((xhr2) => {
          reject(xhr2.response);
        });
        GM_xmlhttpRequest(details);
      });
    },
    xmlHttpRequest(input, init2) {
      return new Promise((resolve, reject) => {
        window.postMessage({
          \$type: "xhrGM",
          data: {
            index: xhrGM.push([resolve, reject]) - 1,
            input,
            init: init2,
            flag: mutex
          }
        });
      });
    },
    getValue(key, def) {
      return new Promise((resolve, reject) => {
        window.postMessage({
          \$type: "getValue",
          data: {
            index: getValue.push([resolve, reject]) - 1,
            key,
            def,
            flag: mutex
          }
        });
      });
    },
    setValue(key, value) {
      if (isUserScript) {
        GM_setValue(key, value);
      } else {
        const obj = {};
        obj[key] = value;
        window.postMessage({
          \$type: "setValue",
          data: obj
        });
      }
    },
    deleteValue(...key) {
      if (isUserScript) {
        key.forEach((d) => GM_deleteValue(d));
      } else {
        window.postMessage({
          \$type: "setValue",
          data: key
        });
      }
    },
    cookie() {
      return new Promise((resolve, reject) => {
        const host = location.host;
        const arr2 = host.split(".");
        arr2.length > 2 && arr2.shift();
        window.postMessage({
          \$type: "getCookies",
          data: {
            url: arr2.join("."),
            index: cookiesEs.push([resolve, reject]) - 1,
            flag: mutex
          }
        });
      });
    }
  };

  // src/runtime/lib/md5.ts
  var ERROR = "input is invalid type";
  var ARRAY_BUFFER = true;
  var HEX_CHARS = "0123456789abcdef".split("");
  var EXTRA = [128, 32768, 8388608, -2147483648];
  var SHIFT = [0, 8, 16, 24];
  var OUTPUT_TYPES = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"];
  var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  var buffer = new ArrayBuffer(68);
  var blocks = new Uint32Array(buffer);
  var buffer8 = new Uint8Array(buffer);
  var createOutputMethod = function(outputType) {
    return function(message2) {
      return new Md5(true).update(message2)[outputType]();
    };
  };
  var createMethod = function() {
    let method = createOutputMethod("hex");
    method.create = function() {
      return new Md5();
    };
    method.update = function(message2) {
      return method.create().update(message2);
    };
    for (let i = 0; i < OUTPUT_TYPES.length; ++i) {
      let type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type);
    }
    return method;
  };
  var Md5 = class {
    blocks;
    buffer8 = new Uint8Array();
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
    array;
    buffer;
    lastByteIndex = 0;
    constructor(sharedMemory) {
      if (sharedMemory) {
        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        this.blocks = blocks;
        this.buffer8 = buffer8;
      } else {
        if (ARRAY_BUFFER) {
          let buffer2 = new ArrayBuffer(68);
          this.buffer8 = new Uint8Array(buffer2);
          this.blocks = new Uint32Array(buffer2);
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
      }
      this.toString = this.hex;
      this.array = this.digest;
      this.buffer = this.arrayBuffer;
    }
    update(message2) {
      if (this.finalized) {
        return;
      }
      message2 = typeof message2 === "number" ? message2 + "" : message2;
      let notString, type = typeof message2;
      if (type !== "string") {
        if (type === "object") {
          if (message2 === null) {
            throw ERROR;
          } else if (ARRAY_BUFFER && message2.constructor === ArrayBuffer) {
            message2 = new Uint8Array(message2);
          } else if (!Array.isArray(message2)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(message2)) {
              throw ERROR;
            }
          }
        } else {
          throw ERROR;
        }
        notString = true;
      }
      let code, index = 0, i, length = message2.length, blocks2 = this.blocks;
      let buffer82 = this.buffer8;
      while (index < length) {
        if (this.hashed) {
          this.hashed = false;
          blocks2[0] = blocks2[16];
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        if (notString) {
          if (ARRAY_BUFFER) {
            for (i = this.start; index < length && i < 64; ++index) {
              buffer82[i++] = message2[index];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks2[i >> 2] |= message2[index] << SHIFT[i++ & 3];
            }
          }
        } else {
          if (ARRAY_BUFFER) {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message2.charCodeAt(index);
              if (code < 128) {
                buffer82[i++] = code;
              } else if (code < 2048) {
                buffer82[i++] = 192 | code >> 6;
                buffer82[i++] = 128 | code & 63;
              } else if (code < 55296 || code >= 57344) {
                buffer82[i++] = 224 | code >> 12;
                buffer82[i++] = 128 | code >> 6 & 63;
                buffer82[i++] = 128 | code & 63;
              } else {
                code = 65536 + ((code & 1023) << 10 | message2.charCodeAt(++index) & 1023);
                buffer82[i++] = 240 | code >> 18;
                buffer82[i++] = 128 | code >> 12 & 63;
                buffer82[i++] = 128 | code >> 6 & 63;
                buffer82[i++] = 128 | code & 63;
              }
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message2.charCodeAt(index);
              if (code < 128) {
                blocks2[i >> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 2048) {
                blocks2[i >> 2] |= (192 | code >> 6) << SHIFT[i++ & 3];
                blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else if (code < 55296 || code >= 57344) {
                blocks2[i >> 2] |= (224 | code >> 12) << SHIFT[i++ & 3];
                blocks2[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else {
                code = 65536 + ((code & 1023) << 10 | message2.charCodeAt(++index) & 1023);
                blocks2[i >> 2] |= (240 | code >> 18) << SHIFT[i++ & 3];
                blocks2[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[i++ & 3];
                blocks2[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
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
      let blocks2 = this.blocks, i = this.lastByteIndex;
      blocks2[i >> 2] |= EXTRA[i & 3];
      if (i >= 56) {
        if (!this.hashed) {
          this.hash();
        }
        blocks2[0] = blocks2[16];
        blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
      }
      blocks2[14] = this.bytes << 3;
      blocks2[15] = this.hBytes << 3 | this.bytes >>> 29;
      this.hash();
    }
    hash() {
      let a, b, c, d, bc, da, blocks2 = this.blocks;
      if (this.first) {
        a = blocks2[0] - 680876937;
        a = (a << 7 | a >>> 25) - 271733879 << 0;
        d = (-1732584194 ^ a & 2004318071) + blocks2[1] - 117830708;
        d = (d << 12 | d >>> 20) + a << 0;
        c = (-271733879 ^ d & (a ^ -271733879)) + blocks2[2] - 1126478375;
        c = (c << 17 | c >>> 15) + d << 0;
        b = (a ^ c & (d ^ a)) + blocks2[3] - 1316259209;
        b = (b << 22 | b >>> 10) + c << 0;
      } else {
        a = this.h0;
        b = this.h1;
        c = this.h2;
        d = this.h3;
        a += (d ^ b & (c ^ d)) + blocks2[0] - 680876936;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[1] - 389564586;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[2] + 606105819;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[3] - 1044525330;
        b = (b << 22 | b >>> 10) + c << 0;
      }
      a += (d ^ b & (c ^ d)) + blocks2[4] - 176418897;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks2[5] + 1200080426;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks2[6] - 1473231341;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks2[7] - 45705983;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ b & (c ^ d)) + blocks2[8] + 1770035416;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks2[9] - 1958414417;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks2[10] - 42063;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks2[11] - 1990404162;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ b & (c ^ d)) + blocks2[12] + 1804603682;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks2[13] - 40341101;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks2[14] - 1502002290;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks2[15] + 1236535329;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (c ^ d & (b ^ c)) + blocks2[1] - 165796510;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ c & (a ^ b)) + blocks2[6] - 1069501632;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ b & (d ^ a)) + blocks2[11] + 643717713;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ a & (c ^ d)) + blocks2[0] - 373897302;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ d & (b ^ c)) + blocks2[5] - 701558691;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ c & (a ^ b)) + blocks2[10] + 38016083;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ b & (d ^ a)) + blocks2[15] - 660478335;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ a & (c ^ d)) + blocks2[4] - 405537848;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ d & (b ^ c)) + blocks2[9] + 568446438;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ c & (a ^ b)) + blocks2[14] - 1019803690;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ b & (d ^ a)) + blocks2[3] - 187363961;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ a & (c ^ d)) + blocks2[8] + 1163531501;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ d & (b ^ c)) + blocks2[13] - 1444681467;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ c & (a ^ b)) + blocks2[2] - 51403784;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ b & (d ^ a)) + blocks2[7] + 1735328473;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ a & (c ^ d)) + blocks2[12] - 1926607734;
      b = (b << 20 | b >>> 12) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks2[5] - 378558;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks2[8] - 2022574463;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks2[11] + 1839030562;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks2[14] - 35309556;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks2[1] - 1530992060;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks2[4] + 1272893353;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks2[7] - 155497632;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks2[10] - 1094730640;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks2[13] + 681279174;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks2[0] - 358537222;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks2[3] - 722521979;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks2[6] + 76029189;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks2[9] - 640364487;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks2[12] - 421815835;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks2[15] + 530742520;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks2[2] - 995338651;
      b = (b << 23 | b >>> 9) + c << 0;
      a += (c ^ (b | ~d)) + blocks2[0] - 198630844;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks2[7] + 1126891415;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks2[14] - 1416354905;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks2[5] - 57434055;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks2[12] + 1700485571;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks2[3] - 1894986606;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks2[10] - 1051523;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks2[1] - 2054922799;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks2[8] + 1873313359;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks2[15] - 30611744;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks2[6] - 1560198380;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks2[13] + 1309151649;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks2[4] - 145523070;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks2[11] - 1120210379;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks2[2] + 718787259;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks2[9] - 343485551;
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
      return HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15];
    }
    digest() {
      this.finalize();
      let h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
      return [
        h0 & 255,
        h0 >> 8 & 255,
        h0 >> 16 & 255,
        h0 >> 24 & 255,
        h1 & 255,
        h1 >> 8 & 255,
        h1 >> 16 & 255,
        h1 >> 24 & 255,
        h2 & 255,
        h2 >> 8 & 255,
        h2 >> 16 & 255,
        h2 >> 24 & 255,
        h3 & 255,
        h3 >> 8 & 255,
        h3 >> 16 & 255,
        h3 >> 24 & 255
      ];
    }
    arrayBuffer() {
      this.finalize();
      let buffer2 = new ArrayBuffer(16);
      let blocks2 = new Uint32Array(buffer2);
      blocks2[0] = this.h0;
      blocks2[1] = this.h1;
      blocks2[2] = this.h2;
      blocks2[3] = this.h3;
      return buffer2;
    }
    base64() {
      let i, v1, v2, v3, base64Str = "", bytes = this.array();
      for (i = 0; i < 15; ) {
        v1 = bytes[i++];
        v2 = bytes[i++];
        v3 = bytes[i++];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
      }
      v1 = bytes[i];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
      return base64Str;
    }
  };
  var md5 = createMethod();

  // src/runtime/lib/sign.ts
  var Sign = class {
    static sign(url, obj = {}, id = 0) {
      this.keySecret = this.decode(id);
      const urlobj = new URLEs(url);
      const params = url ? urlobj.searchParams : new URLSearchParams();
      Object.entries(obj).forEach((d) => {
        if (d[1] || d[1] === "") {
          params.set(d[0], d[1]);
        }
      });
      params.delete("sign");
      params.set("appkey", this.keySecret[0]);
      params.sort();
      params.set("sign", md5(id === 3 && params.has("api") ? new URLSearchParams({ api: decodeURIComponent(params.get("api")) }).toString() : params.toString() + this.keySecret[1]));
      return urlobj ? urlobj.toString() : params.toString();
    }
    static decode(id) {
      if (typeof id === "number") {
        id = id < this.table.length ? id : 0;
        return this.table[id].split("").reverse().reduce((s, d) => {
          s = s + String.fromCharCode(d.charCodeAt(0) + 2);
          return s;
        }, "").split(":");
      } else {
        return [id, this.list()[id]];
      }
    }
    static encode(key, secret) {
      return (key + ":" + secret).split("").reverse().reduce((s, d) => {
        s = s + String.fromCharCode(d.charCodeAt(0) - 2);
        return s;
      }, "");
    }
    static list() {
      return this.table.reduce((s, d, i) => {
        let keySecret = this.decode(i);
        s[keySecret[0]] = keySecret[1];
        return s;
      }, {});
    }
  };
  __publicField(Sign, "table", [
    "rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg",
    "/a_206b\`_.61.bca6117.175bcdadc41850c010c..././1\`\`",
    "157bdd\`6/bc73632.bcd660baa03a.43841211032b5c4\`6b/",
    "351a7a6b/.b\`d77da1cdccc25_13bc0a81a6d63.7ad13\`c50",
    "4_/54d\`3_4_73..2c42\`d4.a3__31b358d706d\`._7a.3_b5.",
    "12a.7c4b76c.a\`12bb4\`2b2b275c667c85b6d\`c_c\`0d5.051",
    "bb16d652\`04.7/121d3474b_2.c12\`7386\`0/bdd6ca0c7.22",
    "244_530/7/.ab\`7.//22a15572502b_08c21./_.\`3164\`c36",
    "16_d52_d/d22_2c0a.6573355/b\`./bd8a\`bc6114a30_4.\`d",
    "c02ba/d6.33d05cb/5d34.7d_23_\`_2785\`c60.a\`.4343726",
    "2aa2\`.1_\`_1.73\`.70.67d.bc671c16382a3d\`71a4.bcb3c7",
    "c4_a.7562_15\`_a416a/63/c2cbcb\`308d706d\`._7a.3_b5.",
    "40/171b046c/bcc0a603ac620\`372ba_8a/\`//41b30376.b5"
  ]);
  __publicField(Sign, "keySecret");
  var urlsign = (url, obj = {}, id = 0) => Sign.sign(url, obj, id);
  urlsign.getKeyById = (id) => Sign.decode(id);
  urlsign.encode = (key, secret) => Sign.encode(key, secret);
  urlsign.list = () => Sign.list();

  // src/runtime/lib/abv.ts
  var Abv = class {
    base58Table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
    digitMap = [11, 10, 3, 8, 4, 6];
    xor = 177451812;
    add = 8728348608;
    bvidTemplate = ["B", "V", 1, "", "", 4, "", 1, "", 7, "", ""];
    table = {};
    constructor() {
      for (let i = 0; i < 58; i++)
        this.table[this.base58Table[i]] = i;
    }
    check(input) {
      if (/^[aA][vV][0-9]+\$/.test(String(input)) || /^\\d+\$/.test(String(input)))
        return this.avToBv(Number(/[0-9]+/.exec(String(input))[0]));
      if (/^1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}\$/.test(String(input)))
        return this.bvToAv("BV" + input);
      if (/^[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}\$/.test(String(input)))
        return this.bvToAv(String(input));
      throw input;
    }
    bvToAv(BV) {
      let r = 0;
      for (let i = 0; i < 6; i++)
        r += this.table[BV[this.digitMap[i]]] * 58 ** i;
      return r - this.add ^ this.xor;
    }
    avToBv(av) {
      let bv = Array.from(this.bvidTemplate);
      av = (av ^ this.xor) + this.add;
      for (let i = 0; i < 6; i++)
        bv[this.digitMap[i]] = this.base58Table[parseInt(String(av / 58 ** i)) % 58];
      return bv.join("");
    }
  };
  function abv(input) {
    return new Abv().check(input);
  }

  // src/runtime/do_while.ts
  function doWhile(check2, callback, delay = 100, stop = 180) {
    let timer2 = setInterval(() => {
      const d = check2();
      if (d) {
        clearInterval(timer2);
        callback(d);
      }
    }, delay);
    stop && setTimeout(() => clearInterval(timer2), stop * 1e3);
  }

  // src/runtime/element/add_element.ts
  function addElement(tag, attribute, parrent, innerHTML, top, replaced) {
    let element = document.createElement(tag);
    attribute && Object.entries(attribute).forEach((d) => element.setAttribute(d[0], d[1]));
    parrent = parrent || document.body;
    innerHTML && (element.innerHTML = innerHTML);
    replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
    return element;
  }
  async function addCss(txt, id, parrent) {
    if (!parrent && !document.head) {
      await new Promise((r) => doWhile(() => document.body, r));
    }
    parrent = parrent || document.head;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    id && !parrent.querySelector(\`#\${id}\`) && style.setAttribute("id", id);
    style.appendChild(document.createTextNode(txt));
    parrent.appendChild(style);
  }
  function loadScript(src, onload) {
    return new Promise((r, j) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.addEventListener("load", () => {
        script.remove();
        onload && onload();
        r(true);
      });
      script.addEventListener("error", () => {
        script.remove();
        j();
      });
      (document.body || document.head || document.documentElement || document).appendChild(script);
    });
  }

  // src/runtime/unit.ts
  function jsonCheck(data) {
    let result = typeof data === "string" ? JSON.parse(data) : data;
    if ("code" in result && result.code !== 0) {
      let msg = result.msg || result.message || "";
      throw [result.code, msg];
    }
    return result;
  }
  function getTotalTop(node2) {
    var sum = 0;
    do {
      sum += node2.offsetTop;
      node2 = node2.offsetParent;
    } while (node2);
    return sum;
  }
  function biliQuickLogin() {
    window.biliQuickLogin ? window.biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
  }
  function getUrlValue(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|\$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null)
      return decodeURIComponent(r[2]);
    return null;
  }
  function statusCheck(status) {
    return status >= 200 && status < 300 || status === 304;
  }

  // src/runtime/xhr.ts
  var Record = {
    default: {},
    arraybuffer: {},
    blob: {},
    document: {},
    json: {},
    text: {}
  };
  function xhr(details, cache = false) {
    details.method == "POST" && (details.headers = details.headers || {}, !details.headers["Content-Type"] && Reflect.set(details.headers, "Content-Type", "application/x-www-form-urlencoded"));
    if (details.async === false) {
      if (cache && Record[details.responseType || "default"][details.url])
        return Record[details.responseType || "default"][details.url];
      let xhr2 = new XMLHttpRequest();
      xhr2.open(details.method || "GET", details.url, false);
      details.responseType && (xhr2.responseType = details.responseType);
      details.credentials && (xhr2.withCredentials = true);
      details.headers && Object.entries(details.headers).forEach((d) => xhr2.setRequestHeader(d[0], d[1]));
      details.timeout && (xhr2.timeout = details.timeout);
      xhr2.send(details.data);
      Promise.resolve().then(() => Record[details.responseType || "default"][details.url] = xhr2.response);
      return xhr2.response;
    } else
      return new Promise((resolve, reject) => {
        if (cache && Record[details.responseType || "default"][details.url])
          return resolve(Record[details.responseType || "default"][details.url]);
        let xhr2 = new XMLHttpRequest();
        xhr2.open(details.method || "GET", details.url);
        details.responseType && (xhr2.responseType = details.responseType);
        details.headers && Object.entries(details.headers).forEach((d) => xhr2.setRequestHeader(d[0], d[1]));
        details.credentials && (xhr2.withCredentials = true);
        details.timeout && (xhr2.timeout = details.timeout);
        xhr2.onabort = details.onabort || reject;
        xhr2.onerror = details.onerror || reject;
        details.onloadstart && (xhr2.onloadstart = details.onloadstart);
        details.onprogress && (xhr2.onprogress = details.onprogress);
        details.onreadystatechange && (xhr2.onreadystatechange = details.onreadystatechange);
        xhr2.ontimeout = details.ontimeout || reject;
        xhr2.onload = details.onload || (() => resolve(xhr2.response));
        xhr2.addEventListener("load", () => {
          Promise.resolve().then(() => Record[details.responseType || "default"][details.url] = xhr2.response);
        });
        xhr2.send(details.data);
      });
  }
  function get(url, details = {}, cache = false) {
    !Reflect.has(details, "credentials") && (details.credentials = true);
    return xhr({ url, ...details }, cache);
  }
  xhr.get = get;
  function post(url, data, contentType = "application/x-www-form-urlencoded", details = {}, cache = false) {
    !Reflect.has(details, "credentials") && (details.credentials = true);
    details.headers = { "Content-Type": contentType, ...details.headers };
    return xhr({ url, method: "POST", data, ...details }, cache);
  }
  xhr.port = post;

  // src/runtime/url_param.ts
  var catchs = { aid: {}, ssid: {}, epid: {} };
  async function urlParam(url = location.href, redirect = true) {
    url && !url.includes("?") && (url = "?" + url);
    const obj = urlObj(url);
    let { aid, cid, ssid, epid, p } = obj;
    let pgc = false;
    !aid && (aid = obj.avid);
    !aid && url.replace(/[aA][vV]\\d+/, (d) => aid = d.substring(2));
    !aid && url.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/, (d) => aid = abv(d));
    !aid && obj.bvid && (aid = abv(obj.bvid));
    aid && !Number(aid) && (aid = abv(aid));
    p = p || 1;
    !ssid && (ssid = obj.seasonId);
    !ssid && (ssid = obj.season_id);
    !ssid && url.replace(/[sS][sS]\\d+/, (d) => ssid = d.substring(2));
    !epid && (epid = obj.episodeId);
    !epid && (epid = obj.ep_id);
    !epid && url.replace(/[eE][pP]\\d+/, (d) => epid = d.substring(2));
    if (!ssid && !epid && aid) {
      if (catchs.aid[aid])
        return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
      if (!cid) {
        try {
          let data = jsonCheck(await xhr({ url: objUrl("https://api.bilibili.com/x/web-interface/view", { "aid": aid }) }, true)).data;
          if (data.redirect_url)
            return urlParam(objUrl(data.redirect_url, { aid, cid, ssid, epid, p }));
          catchs.aid[aid] = data.pages;
          catchs.aid[aid].forEach((d) => d.aid = aid);
          return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
        } catch (e) {
          debug.error("view", e);
          try {
            catchs.aid[aid] = jsonCheck(await xhr({ url: objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": aid }) }, true)).data;
            catchs.aid[aid].forEach((d) => d.aid = aid);
            return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
          } catch (e2) {
            debug.error("pagelist", e2);
            try {
              catchs.aid[aid] = jsonCheck(await xhr({ url: \`//api.bilibili.com/view?appkey=8e9fc618fbd41e28&id=\${aid}&type=json\` }, true)).list;
              catchs.aid[aid].forEach((d) => d.aid = aid);
              return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
            } catch (e3) {
              debug.error("appkey", e3);
              try {
                let data = jsonCheck(await xhr({ url: objUrl("https://www.biliplus.com/api/view", { "id": aid }) }, true));
                catchs.aid[aid] = data.list || data.v2_app_api && data.v2_app_api.pages;
                catchs.aid[aid].forEach((d) => d.aid = aid);
                if (redirect && data.v2_app_api && data.v2_app_api.redirect_url)
                  return urlParam(objUrl(data.v2_app_api.redirect_url, { aid, cid, ssid, epid, p }));
                return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
              } catch (e4) {
                debug.error("biliplus", e4);
              }
            }
          }
        }
      }
    }
    if (ssid || epid) {
      if (ssid && catchs.ssid[ssid])
        return catchs.ssid[ssid][p - 1] || catchs.ssid[ssid][0];
      if (epid && catchs.epid[epid])
        return catchs.epid[epid];
      pgc = true;
      const param2 = { ep_id: epid, season_id: ssid };
      let data = jsonCheck(await xhr({ url: objUrl("https://bangumi.bilibili.com/view/web_api/season", param2) }, true)).result;
      ssid = data.season_id;
      catchs.ssid[ssid] = [];
      data.episodes.forEach((d) => {
        Object.assign(d, { ssid, pgc, epid: d.ep_id });
        catchs.aid[d.aid] = catchs.aid[d.aid] || [];
        catchs.aid[d.aid].push(d);
        catchs.ssid[ssid].push(catchs.epid[d.ep_id] = d);
      });
      if (epid)
        return catchs.epid[epid];
      return catchs.ssid[ssid][p - 1] || catchs.ssid[ssid][0];
    }
    return { aid, cid, ssid, epid, p, pgc };
  }

  // src/runtime/chrome/setting.json
  var setting_default = {
    logReport: false,
    toast: {
      status: true,
      rtl: false,
      position: "top-right",
      delay: 4,
      type: "warning"
    },
    av: true,
    videoLimit: {
      switch: false,
      server: "内置",
      cn: "",
      hk: "",
      tw: "",
      th: ""
    },
    protobufDanmaku: true,
    section: true,
    danmakuHashId: false,
    flash: false,
    enlike: false,
    upList: false,
    commandDm: false,
    bangumi: true,
    watchlater: true,
    player: true,
    index: true,
    ranking: true,
    read: true,
    playlist: true,
    automate: {
      danmakuFirst: false,
      showBofqi: false,
      screenWide: false,
      noDanmaku: false,
      autoPlay: false,
      webFullScreen: false,
      videospeed: false,
      electric: false
    },
    heartbeat: false,
    bangumiEplist: false,
    history: false,
    searchHistory: false,
    liveP2p: true,
    sleepCheck: true,
    errands: true,
    album: false,
    jointime: false,
    restore: false,
    codecType: "AVC",
    collection: true,
    search: true,
    liveRecord: false,
    closedCaption: true,
    segProgress: false,
    videoDisableAA: false,
    commentLinkDetail: false,
    downlaodType: [
      "mp4"
    ],
    TVresource: false,
    downloadQn: 127,
    downloadOther: false,
    danmakuSaveType: "xml",
    downloadMethod: "默认",
    userAgent: "Bilibili Freedoooooom/MarkII",
    referer: "https://www.bilibili.com",
    filepath: "",
    aria2: {
      token: "",
      server: "http://localhost",
      port: 6800
    },
    animatedBanner: false,
    accessKey: {
      key: "",
      date: ""
    },
    timeline: false,
    privateRecommend: false,
    episodeData: false,
    comment: false,
    lostVideo: false,
    uposReplace: {
      nor: "不替换",
      gat: "不替换",
      th: "ks3（金山）",
      dl: "不替换"
    },
    danmakuContact: false,
    allDanmaku: 3,
    IDM: {
      wait: false,
      silence: false
    },
    development: false
  };

  // src/runtime/lib/proxy_handler.ts
  function get2(t, p, r) {
    try {
      return Reflect.get(t, p, r);
    } catch (e) {
      return t[p];
    }
  }
  var ProxyHandler = class {
    constructor(callback) {
      return {
        deleteProperty: (target, key) => {
          Promise.resolve().then(() => callback());
          return Reflect.deleteProperty(target, key);
        },
        get: (target, key, receiver) => {
          const res = get2(target, key, receiver);
          const targetIsArray = isArray(res);
          if (isObject(res) || targetIsArray) {
            return new Proxy(res, new ProxyHandler(callback));
          }
          return res;
        },
        set: (target, key, value, receiver) => {
          value !== get2(target, key, receiver) && Promise.resolve().then(() => callback());
          return Reflect.set(target, key, value, receiver);
        }
      };
    }
  };

  // src/runtime/storage.ts
  var LocalStorage = class {
    clear() {
      self.localStorage.clear();
    }
    getItem(key) {
      let str = self.localStorage.getItem(key);
      try {
        str = JSON.parse(str);
      } catch (e) {
      }
      return str;
    }
    keys() {
      return Object.keys(self.localStorage);
    }
    removeItem(key) {
      self.localStorage.removeItem(key);
    }
    setItem(key, value) {
      switch (typeof value) {
        case "object":
          self.localStorage.setItem(key, JSON.stringify(value));
          break;
        case "function":
          console.warn("函数类型并不适合这样存储！", key, value);
          break;
        default:
          self.localStorage.setItem(key, String(value));
      }
    }
    get length() {
      return self.localStorage.length;
    }
  };
  var SessionStorage = class {
    clear() {
      self.sessionStorage.clear();
    }
    getItem(key) {
      let str = self.sessionStorage.getItem(key);
      try {
        str = JSON.parse(str);
      } catch (e) {
      }
      return str;
    }
    keys() {
      return Object.keys(self.sessionStorage);
    }
    removeItem(key) {
      self.sessionStorage.removeItem(key);
    }
    setItem(key, value) {
      switch (typeof value) {
        case "object":
          self.sessionStorage.setItem(key, JSON.stringify(value));
          break;
        case "function":
          console.warn("函数类型并不适合这样存储！", key, value);
          break;
        default:
          self.sessionStorage.setItem(key, String(value));
      }
    }
    get length() {
      return self.sessionStorage.length;
    }
  };
  var localStorage = new LocalStorage();
  var sessionStorage2 = new SessionStorage();

  // src/runtime/setting.ts
  var setting = setting_default;
  function getSetting() {
    if (isUserScript) {
      let save2 = function() {
        GM_setValue("config", newSetting);
      };
      var save = save2;
      const newSetting = GM_getValue("config", setting_default);
      setting = new Proxy(newSetting, new ProxyHandler(save2));
    } else {
      let save2 = function() {
        GM.setValue("setting", newSetting);
        sessionStorage2.setItem("setting", newSetting);
      };
      var save = save2;
      const newSetting = sessionStorage2.getItem("setting");
      newSetting ? setting = new Proxy(newSetting, new ProxyHandler(save2)) : setTimeout(getSetting);
    }
  }
  chrome?.storage ? chrome.storage.local.get().then((d) => setting = d.setting) : getSetting();

  // src/runtime/variable/variable.ts
  var API = {
    get aid() {
      return window.aid;
    },
    set aid(v) {
      window.aid = v;
    },
    get cid() {
      return window.cid;
    },
    set cid(v) {
      window.cid = v;
    },
    get ssid() {
      return window.ssid;
    },
    set ssid(v) {
      window.ssid = v;
    },
    get epid() {
      return window.epid;
    },
    set epid(v) {
      window.epid = v;
    },
    get __INITIAL_STATE__() {
      return window.__INITIAL_STATE__;
    },
    set __INITIAL_STATE__(v) {
      window.__INITIAL_STATE__ = v;
    },
    __playinfo__: void 0,
    limit: void 0,
    bkg_cover: void 0,
    cover: void 0,
    title: void 0,
    th: void 0,
    pgc: void 0,
    playerParam: void 0,
    rewrite: false,
    GM,
    urlParam,
    xhr,
    urlsign,
    objUrl,
    urlObj,
    URLEs
  };
  setting.development && Reflect.set(window, "API", API);

  // src/runtime/hook/webpack_jsonp.ts
  var hook;
  var arr = [];
  var param = [];
  var webpackJsonp = window.webpackJsonp;
  Object.defineProperty(window, "webpackJsonp", {
    set: (v) => hook = v,
    get: () => {
      if (hook) {
        if (isArray(hook)) {
          if (API.rewrite && hook.length > 1)
            hook.shift();
          return hook;
        }
        ;
        return (chunkIds, moreModules, executeModules) => {
          if (arr[moreModules.length]) {
            const obj = arr[moreModules.length];
            const pam = param[moreModules.length];
            Object.entries(obj).forEach((d) => {
              let code = moreModules[d[0]];
              if (code) {
                code = code.toString();
                d[1].forEach((e) => code = e(code));
                moreModules[d[0]] = new Function(pam[0], pam[1], pam[2], \`(\${code})(\${pam[0]},\${pam[1]},\${pam[2]})\`);
              }
            });
          }
          return hook(chunkIds, moreModules, executeModules);
        };
      }
    },
    configurable: true
  });
  window.webpackJsonp = webpackJsonp;
  function webpackhook(len, pos, rpc, params = ["t", "e", "i"]) {
    if (!arr[len]) {
      arr[len] = {};
      param[len] = params;
    }
    arr[len][pos] = arr[len][pos] || [];
    arr[len][pos].push((code) => rpc(code));
  }

  // src/runtime/lib/crc32.ts
  var Midcrc = class {
    CRCPOLYNOMIAL = 3988292384;
    crctable = new Array(256);
    index = new Array(4);
    constructor() {
      this.create_table();
    }
    run(input) {
      let ht = parseInt("0x" + input) ^ 4294967295, snum, i, lastindex, deepCheckData;
      for (i = 3; i >= 0; i--) {
        this.index[3 - i] = this.getcrcindex(ht >>> i * 8);
        snum = this.crctable[this.index[3 - i]];
        ht ^= snum >>> (3 - i) * 8;
      }
      for (i = 0; i < 1e7; i++) {
        lastindex = this.crc32lastindex(i);
        if (lastindex == this.index[3]) {
          deepCheckData = this.deepCheck(i, this.index);
          if (deepCheckData[0])
            break;
        }
      }
      if (i == 1e7)
        return -1;
      return Number(i + "" + deepCheckData[1]);
    }
    create_table() {
      let crcreg, i, j;
      for (i = 0; i < 256; ++i) {
        crcreg = i;
        for (j = 0; j < 8; ++j) {
          if ((crcreg & 1) !== 0) {
            crcreg = this.CRCPOLYNOMIAL ^ crcreg >>> 1;
          } else {
            crcreg >>>= 1;
          }
        }
        this.crctable[i] = crcreg;
      }
    }
    crc32(input) {
      if (typeof input != "string")
        input = input.toString();
      let crcstart = 4294967295, len = input.length, index;
      for (let i = 0; i < len; ++i) {
        index = (crcstart ^ input.charCodeAt(i)) & 255;
        crcstart = crcstart >>> 8 ^ this.crctable[index];
      }
      return crcstart;
    }
    crc32lastindex(input) {
      if (typeof input != "string")
        input = input.toString();
      let crcstart = 4294967295, len = input.length, index;
      for (let i = 0; i < len; ++i) {
        index = (crcstart ^ input.charCodeAt(i)) & 255;
        crcstart = crcstart >>> 8 ^ this.crctable[index];
      }
      return index;
    }
    getcrcindex(t) {
      for (let i = 0; i < 256; i++)
        if (this.crctable[i] >>> 24 == t)
          return i;
      return -1;
    }
    deepCheck(i, index) {
      let tc = 0, str = "", hash = this.crc32(i);
      tc = hash & 255 ^ index[2];
      if (!(tc <= 57 && tc >= 48))
        return [0];
      str += tc - 48;
      hash = this.crctable[index[2]] ^ hash >>> 8;
      tc = hash & 255 ^ index[1];
      if (!(tc <= 57 && tc >= 48))
        return [0];
      str += tc - 48;
      hash = this.crctable[index[1]] ^ hash >>> 8;
      tc = hash & 255 ^ index[0];
      if (!(tc <= 57 && tc >= 48))
        return [0];
      str += tc - 48;
      hash = this.crctable[index[0]] ^ hash >>> 8;
      return [1, str];
    }
  };
  var crc = new Midcrc();
  function midcrc(input) {
    return crc.run(input);
  }
  function crc32(input) {
    return ((crc.crc32(input) + 1) * -1 >>> 0).toString(16);
  }

  // src/images/svg/fork.svg
  var fork_default = '<svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#212121" stroke-linecap="round"></path></svg>';

  // src/runtime/toast/toast.html
  var toast_default = '<div id="toast-container"></div>\\r\\n<style type="text/css">\\r\\n    .toast-close-button>svg {\\r\\n        width: 12px;\\r\\n        height: 12px;\\r\\n    }\\r\\n\\r\\n    .toast {\\r\\n        transition: height 1s ease 0s, padding 1s ease 0s;\\r\\n    }\\r\\n\\r\\n    #toast-container {\\r\\n        font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif;\\r\\n    }\\r\\n</style>\\r\\n<style type="text/css">\\r\\n    /*\\r\\n     * Note that this is toastr v2.1.3, the "latest" version in url has no more maintenance,\\r\\n     * please go to https://cdnjs.com/libraries/toastr.js and pick a certain version you want to use,\\r\\n     * make sure you copy the url from the website since the url may change between versions.\\r\\n     */\\r\\n    .toast-title {\\r\\n        font-weight: bold;\\r\\n    }\\r\\n\\r\\n    .toast-message {\\r\\n        -ms-word-wrap: break-word;\\r\\n        word-wrap: break-word;\\r\\n    }\\r\\n\\r\\n    .toast-message a,\\r\\n    .toast-message label {\\r\\n        color: #FFFFFF;\\r\\n    }\\r\\n\\r\\n    .toast-message a:hover {\\r\\n        color: #CCCCCC;\\r\\n        text-decoration: none;\\r\\n    }\\r\\n\\r\\n    .toast-close-button {\\r\\n        position: relative;\\r\\n        right: -0.3em;\\r\\n        top: -0.3em;\\r\\n        float: right;\\r\\n        font-size: 20px;\\r\\n        font-weight: bold;\\r\\n        color: #FFFFFF;\\r\\n        -webkit-text-shadow: 0 1px 0 #ffffff;\\r\\n        text-shadow: 0 1px 0 #ffffff;\\r\\n        opacity: 0.8;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);\\r\\n        filter: alpha(opacity=80);\\r\\n        line-height: 1;\\r\\n    }\\r\\n\\r\\n    .toast-close-button:hover,\\r\\n    .toast-close-button:focus {\\r\\n        color: #000000;\\r\\n        text-decoration: none;\\r\\n        cursor: pointer;\\r\\n        opacity: 0.4;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);\\r\\n        filter: alpha(opacity=40);\\r\\n    }\\r\\n\\r\\n    .rtl .toast-close-button {\\r\\n        left: -0.3em;\\r\\n        float: left;\\r\\n        right: 0.3em;\\r\\n    }\\r\\n\\r\\n    /*Additional properties for button version\\r\\n     iOS requires the button element instead of an anchor tag.\\r\\n     If you want the anchor version, it requires \`href="#"\`.*/\\r\\n    button.toast-close-button {\\r\\n        padding: 0;\\r\\n        cursor: pointer;\\r\\n        background: transparent;\\r\\n        border: 0;\\r\\n        -webkit-appearance: none;\\r\\n    }\\r\\n\\r\\n    .toast-top-center {\\r\\n        top: 0;\\r\\n        right: 0;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .toast-bottom-center {\\r\\n        bottom: 0;\\r\\n        right: 0;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .toast-top-full-width {\\r\\n        top: 0;\\r\\n        right: 0;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .toast-bottom-full-width {\\r\\n        bottom: 0;\\r\\n        right: 0;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .toast-top-left {\\r\\n        top: 12px;\\r\\n        left: 12px;\\r\\n    }\\r\\n\\r\\n    .toast-top-right {\\r\\n        top: 12px;\\r\\n        right: 12px;\\r\\n    }\\r\\n\\r\\n    .toast-bottom-right {\\r\\n        right: 12px;\\r\\n        bottom: 12px;\\r\\n    }\\r\\n\\r\\n    .toast-bottom-left {\\r\\n        bottom: 12px;\\r\\n        left: 12px;\\r\\n    }\\r\\n\\r\\n    #toast-container {\\r\\n        position: fixed;\\r\\n        z-index: 999999;\\r\\n        pointer-events: none;\\r\\n        /*overrides*/\\r\\n    }\\r\\n\\r\\n    #toast-container * {\\r\\n        -moz-box-sizing: border-box;\\r\\n        -webkit-box-sizing: border-box;\\r\\n        box-sizing: border-box;\\r\\n    }\\r\\n\\r\\n    #toast-container>div {\\r\\n        position: relative;\\r\\n        pointer-events: auto;\\r\\n        overflow: hidden;\\r\\n        margin: 0 0 6px;\\r\\n        padding: 15px 15px 15px 50px;\\r\\n        width: 300px;\\r\\n        -moz-border-radius: 3px 3px 3px 3px;\\r\\n        -webkit-border-radius: 3px 3px 3px 3px;\\r\\n        border-radius: 3px 3px 3px 3px;\\r\\n        background-position: 15px center;\\r\\n        background-repeat: no-repeat;\\r\\n        -moz-box-shadow: 0 0 12px #999999;\\r\\n        -webkit-box-shadow: 0 0 12px #999999;\\r\\n        box-shadow: 0 0 12px #999999;\\r\\n        color: #FFFFFF;\\r\\n        opacity: 0.8;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);\\r\\n        filter: alpha(opacity=80);\\r\\n    }\\r\\n\\r\\n    #toast-container>div.rtl {\\r\\n        direction: rtl;\\r\\n        padding: 15px 50px 15px 15px;\\r\\n        background-position: right 15px center;\\r\\n    }\\r\\n\\r\\n    #toast-container>div:hover {\\r\\n        -moz-box-shadow: 0 0 12px #000000;\\r\\n        -webkit-box-shadow: 0 0 12px #000000;\\r\\n        box-shadow: 0 0 12px #000000;\\r\\n        opacity: 1;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\\r\\n        filter: alpha(opacity=100);\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    #toast-container>.toast-info {\\r\\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=") !important;\\r\\n    }\\r\\n\\r\\n    #toast-container>.toast-error {\\r\\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=") !important;\\r\\n    }\\r\\n\\r\\n    #toast-container>.toast-success {\\r\\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==") !important;\\r\\n    }\\r\\n\\r\\n    #toast-container>.toast-warning {\\r\\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=") !important;\\r\\n    }\\r\\n\\r\\n    #toast-container.toast-top-center>div,\\r\\n    #toast-container.toast-bottom-center>div {\\r\\n        width: 300px;\\r\\n        margin-left: auto;\\r\\n        margin-right: auto;\\r\\n    }\\r\\n\\r\\n    #toast-container.toast-top-full-width>div,\\r\\n    #toast-container.toast-bottom-full-width>div {\\r\\n        width: 96%;\\r\\n        margin-left: auto;\\r\\n        margin-right: auto;\\r\\n    }\\r\\n\\r\\n    .toast {\\r\\n        background-color: #030303;\\r\\n    }\\r\\n\\r\\n    .toast-success {\\r\\n        background-color: #51A351;\\r\\n    }\\r\\n\\r\\n    .toast-error {\\r\\n        background-color: #BD362F;\\r\\n    }\\r\\n\\r\\n    .toast-info {\\r\\n        background-color: #2F96B4;\\r\\n    }\\r\\n\\r\\n    .toast-warning {\\r\\n        background-color: #F89406;\\r\\n    }\\r\\n\\r\\n    .toast-progress {\\r\\n        position: absolute;\\r\\n        left: 0;\\r\\n        bottom: 0;\\r\\n        height: 4px;\\r\\n        background-color: #000000;\\r\\n        opacity: 0.4;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);\\r\\n        filter: alpha(opacity=40);\\r\\n    }\\r\\n\\r\\n    /*Responsive Design*/\\r\\n    @media all and (max-width: 240px) {\\r\\n        #toast-container>div {\\r\\n            padding: 8px 8px 8px 50px;\\r\\n            width: 11em;\\r\\n        }\\r\\n\\r\\n        #toast-container>div.rtl {\\r\\n            padding: 8px 50px 8px 8px;\\r\\n        }\\r\\n\\r\\n        #toast-container .toast-close-button {\\r\\n            right: -0.2em;\\r\\n            top: -0.2em;\\r\\n        }\\r\\n\\r\\n        #toast-container .rtl .toast-close-button {\\r\\n            left: -0.2em;\\r\\n            right: 0.2em;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    @media all and (min-width: 241px) and (max-width: 480px) {\\r\\n        #toast-container>div {\\r\\n            padding: 8px 8px 8px 50px;\\r\\n            width: 18em;\\r\\n        }\\r\\n\\r\\n        #toast-container>div.rtl {\\r\\n            padding: 8px 50px 8px 8px;\\r\\n        }\\r\\n\\r\\n        #toast-container .toast-close-button {\\r\\n            right: -0.2em;\\r\\n            top: -0.2em;\\r\\n        }\\r\\n\\r\\n        #toast-container .rtl .toast-close-button {\\r\\n            left: -0.2em;\\r\\n            right: 0.2em;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    @media all and (min-width: 481px) and (max-width: 768px) {\\r\\n        #toast-container>div {\\r\\n            padding: 15px 15px 15px 50px;\\r\\n            width: 25em;\\r\\n        }\\r\\n\\r\\n        #toast-container>div.rtl {\\r\\n            padding: 15px 50px 15px 15px;\\r\\n        }\\r\\n    }\\r\\n</style>';

  // src/runtime/toast/toast.ts
  var ToastContainer = class extends HTMLElement {
    positionList = ["top-right", "top-left", "bottom-right", "bottom-left"];
    typeList = ["success", "error", "info", "warning", ""];
    container;
    status = true;
    rtl = false;
    position = "top-right";
    delay = 4;
    constructor() {
      super();
      const root3 = this.attachShadow({ mode: "closed" });
      root3.appendChild(createElements(htmlVnode(toast_default)));
      this.container = root3.children[0];
      Object.defineProperties(this, {
        status: {
          get: () => setting.toast.status,
          set: (v) => {
            if (v === setting.toast.status)
              return;
            setting.toast.status = v;
          }
        },
        rtl: {
          get: () => setting.toast.rtl,
          set: (v) => {
            if (v === setting.toast.rtl)
              return;
            setting.toast.rtl = v;
            v ? this.container.childNodes.forEach((d) => {
              d.classList.add("rtl");
            }) : this.container.childNodes.forEach((d) => {
              d.classList.remove("rtl");
            });
          }
        },
        position: {
          get: () => setting.toast.position,
          set: (v) => {
            if (v === setting.toast.position)
              return;
            if (!this.positionList.includes(v))
              return;
            setting.toast.position = v;
            this.container.className = \`toast-\${v}\`;
          }
        },
        delay: {
          get: () => setting.toast.delay,
          set: (v) => {
            if (v === setting.toast.delay)
              return;
            setting.toast.delay = v;
          }
        }
      });
    }
    toast(delay, type, ...data) {
      if (!this.status)
        return;
      document.body.contains(this) || document.body.appendChild(this);
      this.container.className = \`toast-\${this.position}\`;
      let html = \`<div class="toast\${type ? " toast-" + type : ""}\${this.rtl ? " rtl" : ""}" aria-live="assertive" style="padding-top: 0px;padding-bottom: 0px;height: 0px;"><div class="toast-message">\`;
      !delay && (html += \`<div class="toast-close-button">\${fork_default}</div>\`);
      data.forEach((d, i) => {
        if (isObject(d)) {
          try {
            d = JSON.stringify(d, void 0, "<br>");
          } catch (e) {
          }
        }
        html += i ? \`<br>\${d}\` : \`<label>\${d}</label>\`;
      });
      html += "</div></div>";
      const node2 = createElements(htmlVnode(html));
      const toast2 = node2.children[0];
      this.container.insertBefore(node2, this.container.firstChild);
      toast2.setAttribute("style", \`height: \${toast2.scrollHeight + 30}px;\`);
      let hovering = false;
      toast2.addEventListener("mouseover", () => hovering = true);
      toast2.addEventListener("mouseout", () => hovering = false);
      Object.defineProperties(toast2, {
        "type": {
          get: () => type,
          set: (v) => {
            if (v === type)
              return;
            if (!this.typeList.includes(v))
              return;
            type && toast2.classList.remove(\`toast-\${type}\`);
            v && toast2.classList.add(\`toast-\${v}\`);
            toast2.classList;
            type = v;
          }
        },
        "data": {
          get: () => new Proxy(data, new ProxyHandler(ToastContainer.organizeDate.bind(ToastContainer, toast2))),
          set: (v) => {
            if (v === data)
              return;
            data = v;
            ToastContainer.organizeDate(toast2);
          }
        },
        "delay": {
          get: () => delay,
          set: (v) => {
            if (v === delay)
              return;
            if (isNaN(v))
              return;
            if (delay === 0)
              delay = v, ToastContainer.countDown(toast2);
            delay = v;
            if (v === 0) {
              hovering ? toast2.addEventListener("mouseout", () => ToastContainer.remove(toast2)) : ToastContainer.remove(toast2);
            }
          }
        }
      });
      !delay ? toast2.children[0].children[0].addEventListener("click", () => ToastContainer.remove(toast2)) : ToastContainer.countDown(toast2);
      return toast2;
    }
    static countDown(node2) {
      node2.delay && setTimeout(() => {
        node2.delay--;
        this.countDown(node2);
      }, 1e3);
    }
    static remove(node2) {
      node2.setAttribute("style", "padding-top: 0px;padding-bottom: 0px;height: 0px;");
      setTimeout(() => node2.remove(), 1e3);
    }
    static organizeDate(node2) {
      let html = !node2.delay ? \`<div class="toast-close-button">\${fork_default}</div>\` : "";
      node2.data.forEach((d, i) => {
        if (isObject(d)) {
          try {
            d = JSON.stringify(d, void 0, "<br>");
          } catch (e) {
          }
        }
        html += i ? \`<br>\${d}\` : \`<label>\${d}</label>\`;
      });
      node2.children[0].replaceChildren(createElements(htmlVnode(html)));
      node2.setAttribute("style", \`height: \${node2.firstChild.clientHeight + 30}px;\`);
      !node2.delay && node2.children[0].children[0].addEventListener("click", () => ToastContainer.remove(node2));
    }
  };
  customElements.get(\`toast-container\${mutex}\`) || customElements.define(\`toast-container\${mutex}\`, ToastContainer);
  var node = customElements ? new ToastContainer() : { toast: () => {
  } };
  function Toast(type, ...data) {
    return node.toast(node.delay, type, ...data);
  }
  function toast(...data) {
    return Toast.bind(node, "")(...data);
  }
  toast.success = Toast.bind(node, "success");
  toast.error = Toast.bind(node, "error");
  toast.info = Toast.bind(node, "info");
  toast.warning = Toast.bind(node, "warning");
  toast.custom = node.toast.bind(node);

  // src/runtime/danmaku/danmaku_hash_id.css
  var danmaku_hash_id_default = "/* 反查弹幕发送者相关样式 */\\r\\n.bb-comment,\\r\\n.comment-bilibili-fold {\\r\\n    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;\\r\\n    font-size: 0;\\r\\n    zoom: 1;\\r\\n    min-height: 100px;\\r\\n    background: #fff;\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list,\\r\\n.comment-bilibili-fold .comment-list {\\r\\n    padding-top: 20px;\\r\\n}\\r\\n\\r\\n.bb-comment *,\\r\\n.comment-bilibili-fold * {\\r\\n    box-sizing: content-box;\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face,\\r\\n.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face {\\r\\n    display: inline-block;\\r\\n    position: relative;\\r\\n    margin-right: 10px;\\r\\n    vertical-align: top;\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face img,\\r\\n.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face img {\\r\\n    width: 24px;\\r\\n    height: 24px;\\r\\n    border-radius: 50%;\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con,\\r\\n.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con {\\r\\n    display: inline-block;\\r\\n    width: calc(100% - 34px);\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user,\\r\\n.comment-bilibili-fold .comment-list .list-item .user {\\r\\n    font-size: 12px;\\r\\n    font-weight: 700;\\r\\n    line-height: 18px;\\r\\n    padding-bottom: 4px;\\r\\n    display: block;\\r\\n    word-wrap: break-word;\\r\\n    position: relative;\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user .name,\\r\\n.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user .name {\\r\\n    position: relative;\\r\\n    top: -1px;\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .reply-box .reply-item .level,\\r\\n.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .level {\\r\\n    margin: 0 15px 0 8px;\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l0,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l0 {\\r\\n    background-position: -23px -28px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l1,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l1 {\\r\\n    background-position: -23px -92px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l2,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l2 {\\r\\n    background-position: -23px -156px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l3,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l3 {\\r\\n    background-position: -23px -220px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l4,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l4 {\\r\\n    background-position: -23px -284px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l5,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l5 {\\r\\n    background-position: -23px -348px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l6,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l6 {\\r\\n    background-position: -23px -412px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l7,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l7 {\\r\\n    background-position: -23px -476px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l8,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l8 {\\r\\n    background-position: -23px -540px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level.l9,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level.l9 {\\r\\n    background-position: -23px -604px\\r\\n}\\r\\n\\r\\n.bb-comment .comment-list .list-item .user .level,\\r\\n.comment-bilibili-fold .comment-list .list-item .user .level {\\r\\n    display: inline-block;\\r\\n    width: 19px;\\r\\n    height: 9px;\\r\\n    vertical-align: middle;\\r\\n    margin: 0 8px;\\r\\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAMAAAB6fSTWAAAA51BMVEUAAACYoKhwd3yboqni5emDjJL7+/yZoqoAodbnix8AodYAodaZoqoAodYAodaln5jnix8Aodbnix8AodaZoqoAodbnix8Aodbnix/yXY6ZoqoAodYAodYAodaZoqoAodaZoqryXY7yXY4AodbyXY6ZoqryXY6ZoqoAodaZoqoAodaZoqryXY7nix8AodYAodbnix+ZoqqZoqrnix8AodYAodbnix+Zoqr////19vfM0NcAoda/v7/l6e9MyP//u1PlL+z/s3yS0eWV3bL/bAAVFRX/AACEHPnnix+M2fn/1pbyXY4iIiIkv4BgAAAAOHRSTlMA9fUreZKu4eI+EfDtgtwP7AkexYcv2WfIsP3refnX0mcmGUPyxsScjXkXF++zoZpMMyn+Ppl8Q6/LsKoAAA3QSURBVHja7NvdbtowGIfxP7UsaEqbfkGj0bWVpqofiK0f2nZALyD3f0V7E4KsbULCjpRA9fykQDjw4SOb2BEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG2cF4X64vzAeJc+/sDYeGDH3Q0e1MrV1x9q4eW0LNUTP2j4xPEHDS9gp70O50O1MRk9j5Tu13tZhX4+LdS5ejJvpnUlqCfzZloXsMPym99qFfrZ7Telh54vyop1Xk7VNevbqeas+KT5fD2eOR3b+FhR1/L84dJaz42SZNnPR2UnWZadKV7+Mi1rss7P1THXdB7u47iq83DP/3RsijtQpevQ78bjL/fS29CMHxTvana0vDjT5MTMviuSVb6movvO5Qe+Wr2vLvsRP6H7avW+ujxTOjaErrrw+mq+1K1hrqHWxoo3yjTS2kyRTssQeh9sEg+hO/uIZJN4CN3xLx07G7pC6G/3KaErhD65UKQyUGEfhbplaYfQlRK6Quja29CPj4W/febQn55ahn59vY+hO9VcWuhh/P6GfrxcUvq/PnHo965l6BcTRZruwNLdexnv05buYfzeLt2tc0qPkBi6qb77D31+o3ahP58o1mERQl8U/TyMc3bZjUt9GOfsshvHwzhsDt00jdf3fYZ+d9ky9KtHxcsPe99ec746NJO+veZ8dWiG7TVs9PGfzkOfr0PPb16TQn9eh57dTtoemCm0NQ7MAHH76OOVJylxH/2oNrtufQR2oa1xBBbYN/ZSy7ui8VILsF94TRUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAH3buoMVNIAzA8BxESA5ldyHkUui1p/Y6YrJ71v//g/rFmFoKaaMBdZPngTWzh+/4MqKTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwIMqyirnqizungfWqihzryzum5c6rFVkWrUfoa0i1Unzx+Y9NMfTPKzZvv6ZnlJ02n702ih1wnzz3muUzrrt6rpOS3kbFrMrzp0PpRdj57vOh9LdvbNer/WCob+9bFJn8zJ/6eWl87Y9l16OnW/6xpvuakvnvw5naW7bbX2y3W5f0xI2UXr/MbciV33nffBVLsbNH/vO++CPtnSuxT3o/k/z2td/+JGWEIkv0vmwobf596KcsqE3ORa2dK46nNLuLsNiXpF3/F2kRUTkC3QeqnzpPBadXI2bv3Qei07Mg9CvlR6dLyDnc+ehqqou9Dxu/tJ5zB+70HOCtYf+Nd3sgUKvcqedGno/3widTxL6Lt3skW7do+/ofPKtezh17tadf4YeTp8rCP1Lup2HcR7GMSL00BfeNb5o6N/TzR7r9Vobnd/zeq2Jzr1e47rD35YM/dsujfMwB2bauE4/MNMdl7Ghs2r7+o5HcY7AOgILn4AvtcAz8DVVeAZ+eAKegp+SAgAAAAAAAAAAAAAAAAAAAH6xczctbQRxAIf/RmHDGgyiQWisCkV8gxaF0nZDTjkF+v0/T4dNrIFe6g5JnOR5srksDHP6wTCzDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlKhZdXRY3HjgPzS/Vkybd5fW/FyRxmfOr3RorS/0ZHqUEXqSxufODyRrDD1pckJPmuz5gQihQxc3g8GnwcJDdHAxPp4ct8aXUR6hsx+qp6iiNbx6jvfrP0Y/WvX1KIojdDZtthCbVbVP6+a8S+jt07q4j+IsQjvIDH2eGfpU6Dtutioi2WLoT1d5oT+eRHEWof0+yAt9Ms8LvZkKfbfNoi28/be2GXrcHmaFHmflrd2XoafSs0KfzPNCb6ZC32kfK/SHh7zQL8vbjluGnkrPC30yzwu9mQp9l62Evv2le7zc5oU+OovS/A29J3Q66BT6Vjbjhm+hx6BD6PVb6DGO0ryG3rN0Z41e406/jNBzz9FvI16qZHDX7Rz97DRGJ8n4a5RmGXrPZhzr1Gb92vjyzaYNh3fnMbwaJtFFXX+/j/qkruvTKM4itJ7jNdZq9q/YuFT5j6iiu9PrL9GPIvlghj3yXD1VkWHUfxS60Pnwbg7uIsfF529RJKHDHhA67AEXT8AecJUU7IHG5ZAAAAAAAAAAAAAAAMAfdu6etUEgDuDwNcnkUMgQshS6dmrXeOKSLdDv/3kqlxeELCVXk9T/84Aogtz0w+OUAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAmVqu8ti/ex74RWe5b8dueH43Vj0+8PdWfVsV2mrofOyG8YUOU8ttXWh5Vxd6boUOV4QOt9h2F28pHqETwxD4cBTvmxSO0Lm3/VGqUBd695HCuYT2Uhn6oTL0Xuhzth8rdx4Z+msKJ587/64L/dDVhd5noc/ZPpXCy1E8LPQi3tw9nzuvC/3Q1YXeZ6HP2pOFHm85Lp86rwv90NWF3mehz9so9CeYug+X0Rz7WgidKzN+o0cN3dSdaZ36LufHhL7tRj5TNLk9WliMY0Il69J3xap7paYpkTdNs07h5PZk4fMa09lfS/e3Djlr98MM0WyELnQC2HZfKSShQwBChwBsPAEB2EoKIljaHBIAAAAAAAAAAPhhzw5WGwSiMIzekCGbkF1Wgb5HhzIL3/+lClaCEixCCMl4zwER3H/8OgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADtX2gYlgJ617w1aAD0TOiQgdEhA6JCA0CEBoUMCQocEhA4JCB0SEDokIHRIQOiQgNBJ6nq4xlMu50t0Q+gkdbsd4ilfP+fohtB5o+FPbGTRhU4vhrkYr+CB0OnbEPfChb5O6PTtU0L36i505l4Z+vRkI4dxQqcXi9AHi75C6PRt6nu6+0ZfIXT6NmY99i30/widrg0z/qOvEjo4jBM6WHShQ0ZChwSEDgkIHRIQOiQgdEhA6JDAQ+i1tSp02Je2rLy2cjyWVqvQYUfaYsxPJUbl1KrQYTfaYszjbpx1of+yZ8c4DINAFAW3QJwpFO64/5kiMAUU6eP1jGS5oH76loEcajvGfDlnvdUAnqxc7dOuY8yPWZ/HJYBHK3WN+e9jnQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPyNfgsgmb6LQeiQTo9Z+P2ERYeUhA4vsIXu0x2y2kOfhA75rL7HW+iQ1cx69O2vO+TVN+7RAQAAAAAAAAAAvuzZwQnAIBBE0a1u+i8pqBch15wm74FawWdFAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvpFjgDK5zSJ0qJPZhZ81JjpUEjr8wBW6qzu0ek10oUOfTJZ1Ch1aZW/JeHWHXrn4RwcAAAAAAHjYs2MbgIEQCIKURv9VWY8dfAGOjhkJUcFGBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8I9+FRCmb3UIHeJ0TeFzQ+iQR+iwgNBhAaHDAl/f5wsdUk3W07fQIVZf7OgAAAAPe3ZQA0AIQ1Gw7r5/Rxu6lwrgVGYSqIIXCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANyRXwHLZKpD6LBOqgvv1UPosI/Q4QEjdFd32MqJDg9I5ThT6LBVekvKqzvslcE/+sduHZ0AAIIAFHQ5918pMggH6MvuQJzgoQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kEcAw2cUmdBgnowqvqSV0mEfo8IEWutcdprqh17joiz07tgEQhgEgmBoEUuQaZZDU3n8lCBUbIFl3hT3BNzaUlC2XtYUOVeU7MpurO9SVH/7oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+L+YgGVBZzaUBp2xA6FNaP8zqPmEPoUFaPueyxCf1mz45NIIaBIAAqdCKBcOTAgZBDh86uhO+/n9fzTZhjJtgOloNbSKtGm322qGX3jIOsWjwrn2gFSOuMvrLHWYC0WkwXHbKrsc0+t6gFSKvv8bP3AuT139H1HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4OXGcV3HKEBi4/4st6Z/2bODG4BhEAaArJFnoyjLeP99WnUMuHuwgQXC0NnK2vsbBfR1sqt2TgF9CToM4HSHATzjYIJnJeo16O3mdwvoS9BhhqSA7q51DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAve3AgAAAAAADk/9oIqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrCHhwIAAAAAAD5vzaCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwBwcCAAAAAED+r42gqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqirtwQEJAAAAgKD/r9sRqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8BfEgGFMI1IvvAAAAABJRU5ErkJggg==) no-repeat;\\r\\n}";

  // src/runtime/danmaku/danmaku_hash_id.ts
  function danmakuHashId() {
    addCss(danmaku_hash_id_default);
    class DanmakuHashId {
      static count = 0;
      static catch = {};
      count = 0;
      hash;
      mid;
      node;
      dm;
      constructor(crc2) {
        DanmakuHashId.count = DanmakuHashId.count ? DanmakuHashId.count + 1 : 1;
        this.count = DanmakuHashId.count;
        DanmakuHashId.catch = DanmakuHashId.catch || {};
        this.hash = crc2;
        this.mid = midcrc(this.hash);
        this.getInfo();
      }
      async getInfo() {
        try {
          this.node = document.querySelector(".bilibili-player-context-menu-container.active");
          if (!this.node)
            return setTimeout(() => {
              this.getInfo();
            }, 100);
          this.node = this.node.children[0];
          let j = 0;
          for (let i = this.node.children.length - 1; i >= 0; i--) {
            if (this.node.children[i].textContent.includes("mid")) {
              this.dm = this.node.children[i];
              j++;
              if (this.count === j)
                break;
            }
          }
          if (!this.dm)
            return setTimeout(() => {
              this.getInfo();
            }, 100);
          if (this.dm.tagName != "LI")
            return;
          DanmakuHashId.catch[this.mid] = DanmakuHashId.catch[this.mid] || jsonCheck(await xhr({ url: objUrl("https://api.bilibili.com/x/web-interface/card", { mid: this.mid }) }, true));
          this.dm.innerHTML = '<div style="min-height:0px;z-index:-5;background-color: unset;" class="bb-comment"><div style="padding-top: 0;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin-left: 15px;vertical-align: middle;" data-usercard-mid="' + this.mid + '" class="reply-face"><img src="' + DanmakuHashId.catch[this.mid].data.card.face + '@52w_52h.webp" alt=""></div><div class="reply-con"><div class="user" style="padding-bottom: 0;top: 3px;"><a style="display:initial;padding: 0px;" data-usercard-mid="' + this.mid + '" href="//space.bilibili.com/' + this.mid + '" target="_blank" class="' + (DanmakuHashId.catch[this.mid].data.card.vip.vipType > 1 ? "name vip-red-name" : "name") + '">' + DanmakuHashId.catch[this.mid].data.card.name + "</a> " + DanmakuHashId.catch[this.mid].data.card.sex + '<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' + (DanmakuHashId.catch[this.mid].data.card.is_senior_member ? 7 : DanmakuHashId.catch[this.mid].data.card.level_info.current_level) + '"></i></a></div></div></div></div></div></div></div>';
          DanmakuHashId.count--;
        } catch (e) {
          DanmakuHashId.count--;
          toast.error("反差弹幕发送者信息失败 ಥ_ಥ");
          debug.error(e);
        }
      }
    }
    window.danmakuHashId = (crc2) => {
      try {
        const check2 = new DanmakuHashId(crc2);
        return \`hash: \${check2.hash} mid: \${check2.mid}\`;
      } catch (e) {
        debug.error(e);
      }
    };
  }

  // src/runtime/lib/file.ts
  function readAs(file, type = "string", encoding = "utf-8") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      switch (type) {
        case "ArrayBuffer":
          reader.readAsArrayBuffer(file);
          break;
        case "DataURL":
          reader.readAsDataURL(file);
          break;
        case "string":
          reader.readAsText(file, encoding);
          break;
      }
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
    });
  }
  async function saveAs(content, fileName, contentType = "text/plain") {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.addEventListener("load", () => URL.revokeObjectURL(a.href));
    a.click();
  }
  function fileRead(accept, multiple) {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      accept && (input.accept = accept);
      multiple && (input.multiple = multiple);
      input.style.opacity = "0";
      input.addEventListener("change", () => resolve(input.files));
      document.body.appendChild(input);
      input.click();
    });
  }

  // src/runtime/variable/fnval.ts
  var Fnval = class {
    MP4 = 1;
    DASH_H265 = 16;
    HDR = 64;
    DASH_4K = 128;
    DOLBYAUDIO = 256;
    DOLBYVIDEO = 512;
    DASH_8K = 1024;
    DASH_AV1 = 2048;
  };
  var _ = new Fnval();
  var fnval = Reflect.ownKeys(_).reduce((s, d) => {
    s += _[d];
    return s;
  }, -1);

  // src/runtime/lib/url.ts
  var UrlPack = class {
    get ts() {
      return new Date().getTime();
    }
    access_key = setting.accessKey?.key || void 0;
    jsonUrlDefault = {
      "api.bilibili.com/pgc/player/web/playurl": { qn: 127, otype: "json", fourk: 1 },
      "api.bilibili.com/x/player/playurl": { qn: 127, otype: "json", fourk: 1 },
      "interface.bilibili.com/v2/playurl": { appkey: 9, otype: "json", quality: 127, type: "" },
      "bangumi.bilibili.com/player/web_api/v2/playurl": { appkey: 9, module: "bangumi", otype: "json", quality: 127, type: "" },
      "api.bilibili.com/pgc/player/api/playurlproj": { access_key: this.access_key, appkey: 1, build: "2040100", device: "android", expire: "0", mid: "0", mobi_app: "android_i", module: "bangumi", otype: "json", platform: "android_i", qn: 127, ts: this.ts },
      "app.bilibili.com/v2/playurlproj": { access_key: this.access_key, appkey: 1, build: "2040100", device: "android", expire: "0", mid: "0", mobi_app: "android_i", otype: "json", platform: "android_i", qn: 127, ts: this.ts },
      "api.bilibili.com/pgc/player/api/playurltv": { appkey: 6, qn: 127, fourk: 1, otype: "json", platform: "android", mobi_app: "android_tv_yst", build: 102801 },
      "api.bilibili.com/x/tv/ugc/playurl": { appkey: 6, qn: 127, fourk: 1, otype: "json", platform: "android", mobi_app: "android_tv_yst", build: 102801 },
      "app.bilibili.com/x/intl/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: "json", ts: this.ts },
      "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: "json", ts: this.ts },
      "api.bilibili.com/view": { type: "json", appkey: "8e9fc618fbd41e28" },
      "api.bilibili.com/x/v2/reply/detail": { build: "6042000", channel: "master", mobi_app: "android", platform: "android", prev: "0", ps: "20" },
      "app.bilibili.com/x/v2/activity/index": { appkey: 1, build: 303e4, c_locale: "zh_CN", channel: "master", fnval, fnver: 0, force_host: 0, fourk: 1, https_url_req: 0, mobi_app: "android_i", offset: 0, platform: "android", player_net: 1, qn: 32, s_locale: "zh_CN", tab_id: 0, tab_module_id: 0, ts: this.ts },
      "app.bilibili.com/x/v2/activity/inline": { appkey: 1, build: 303e4, c_locale: "zh_CN", channel: "master", fnval, fnver: 0, force_host: 0, fourk: 1, https_url_req: 0, mobi_app: "android_i", platform: "android", player_net: 1, qn: 32, s_locale: "zh_CN", ts: this.ts },
      "bangumi.bilibili.com/api/season_v5": { appkey: 2, build: "2040100", platform: "android" }
    };
    getJson(url, detail, gm) {
      const str = objUrl(url, Object.assign(this.jsonUrlDefault[url], detail));
      return gm ? isUserScript ? GM.xhr({ url: this.jsonUrlDefault[url].appkey > 0 ? urlsign(str, void 0, this.jsonUrlDefault[url].appkey) : str, responseType: "json" }) : GM.xmlHttpRequest(this.jsonUrlDefault[url].appkey > 0 ? urlsign(str, void 0, this.jsonUrlDefault[url].appkey) : str, { credentials: "include" }).then((d) => JSON.parse(d)) : xhr({
        url: this.jsonUrlDefault[url].appkey > 0 ? urlsign(str, void 0, this.jsonUrlDefault[url].appkey) : str,
        responseType: "json",
        credentials: true
      });
    }
  };
  var urlPack = new UrlPack();

  // src/runtime/player/upos_replace.ts
  var UPOS = {
    "ks3（金山）": "upos-sz-mirrorks3.bilivideo.com",
    "ks3b（金山）": "upos-sz-mirrorks3b.bilivideo.com",
    "ks3c（金山）": "upos-sz-mirrorks3c.bilivideo.com",
    "ks32（金山）": "upos-sz-mirrorks32.bilivideo.com",
    "kodo（七牛）": "upos-sz-mirrorkodo.bilivideo.com",
    "kodob（七牛）": "upos-sz-mirrorkodob.bilivideo.com",
    "cos（腾讯）": "upos-sz-mirrorcos.bilivideo.com",
    "cosb（腾讯）": "upos-sz-mirrorcosb.bilivideo.com",
    "coso1（腾讯）": "upos-sz-mirrorcoso1.bilivideo.com",
    "coso2（腾讯）": "upos-sz-mirrorcoso2.bilivideo.com",
    "bos（腾讯）": "upos-sz-mirrorbos.bilivideo.com",
    "hw（华为）": "upos-sz-mirrorhw.bilivideo.com",
    "hwb（华为）": "upos-sz-mirrorhwb.bilivideo.com",
    "uphw（华为）": "upos-sz-upcdnhw.bilivideo.com",
    "js（华为）": "upos-tf-all-js.bilivideo.com",
    "hk（香港）": "cn-hk-eq-bcache-01.bilivideo.com",
    "akamai（海外）": "upos-hz-mirrorakam.akamaized.net"
  };
  var dis = false;
  var timer = 0;
  function uposReplace(str, uposName) {
    if (uposName === "不替换")
      return str;
    !dis && toast.custom(10, "warning", "已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", \`CDN：\${uposName}\`, \`UPOS：\${UPOS[uposName]}\`);
    dis = true;
    clearTimeout(timer);
    timer = setTimeout(() => dis = false, 1e3);
    return str.replace(/:\\\\?\\/\\\\?\\/[^\\/]+\\\\?\\//g, () => \`://\${UPOS[uposName]}/\`);
  }

  // src/runtime/node_observer.ts
  var nodelist = [];
  function observerAddedNodes(callback) {
    try {
      if (typeof callback === "function")
        nodelist.push(callback);
      return nodelist.length - 1;
    } catch (e) {
      debug.error(e);
    }
  }
  var observe = new MutationObserver((d) => d.forEach((d2) => {
    d2.addedNodes[0] && nodelist.forEach(async (f) => {
      try {
        f(d2.addedNodes[0]);
      } catch (e) {
        debug.error(d2).error(e);
      }
    });
  }));
  observe.observe(document, { childList: true, subtree: true });

  // src/runtime/switch_video.ts
  var switchlist = [];
  function switchVideo(callback) {
    try {
      if (typeof callback === "function")
        switchlist.push(callback);
    } catch (e) {
      debug.error("switchVideo.js", e);
    }
  }
  observerAddedNodes((node2) => {
    if (/bilibili-player-area video-state-pause/.test(node2.className)) {
      switchlist.forEach(async (d) => {
        try {
          d();
        } catch (e) {
          debug.error(d);
          debug.error(e);
        }
      });
    }
  });

  // src/runtime/element/popupbox.html
  var popupbox_default = '<div class="box">\\r\\n    <div class="contain"></div>\\r\\n    <div class="fork"></div>\\r\\n</div>\\r\\n<style type="text/css">\\r\\n    .box {\\r\\n        top: 50%;\\r\\n        left: 50%;\\r\\n        transform: translateX(-50%) translateY(-50%);\\r\\n        transition: 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);\\r\\n        padding: 12px;\\r\\n        background-color: #fff;\\r\\n        color: black;\\r\\n        border-radius: 8px;\\r\\n        box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);\\r\\n        border: 1px solid rgba(136, 136, 136, 0.13333);\\r\\n        box-sizing: border-box;\\r\\n        position: fixed;\\r\\n        font-size: 13px;\\r\\n        z-index: 11115;\\r\\n        line-height: 14px;\\r\\n    }\\r\\n\\r\\n    .contain {\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        height: 100%;\\r\\n    }\\r\\n\\r\\n    .fork {\\r\\n        position: absolute;\\r\\n        transform: scale(0.8);\\r\\n        right: 10px;\\r\\n        top: 10px;\\r\\n        height: 20px;\\r\\n        width: 20px;\\r\\n        pointer-events: visible;\\r\\n    }\\r\\n\\r\\n    .fork:hover {\\r\\n        border-radius: 50%;\\r\\n        background-color: rgba(0, 0, 0, 10%);\\r\\n    }\\r\\n</style>';

  // src/runtime/element/popupbox.ts
  var ClickRemove = class {
    cancel;
    observe;
    constructor(node2) {
      node2.addEventListener("click", (e) => e.stopPropagation());
      function remove() {
        node2.remove();
        document.removeEventListener("click", remove);
      }
      this.cancel = () => document.removeEventListener("click", remove);
      this.observe = () => {
        setTimeout(() => {
          document.addEventListener("click", remove);
        }, 100);
      };
    }
  };
  var PopupBox = class extends HTMLElement {
    _children;
    _style;
    _fork;
    _observe;
    __contain;
    __fork;
    constructor(obj) {
      super();
      const { children, style, fork } = obj;
      const root3 = this.attachShadow({ mode: "closed" });
      root3.appendChild(createElements(htmlVnode(popupbox_default.replace('<div class="fork"></div>', \`<div class="fork">\${fork_default}</div>\`))));
      this.__contain = root3.children[0].children[0];
      this.__fork = root3.children[0].children[1];
      this._observe = new ClickRemove(this);
      Object.defineProperties(obj, {
        children: {
          get: () => this._children,
          set: (v) => {
            if (this._children === v)
              return;
            this._children = v;
            this.\$children();
          }
        },
        style: {
          get: () => this._style,
          set: (v) => {
            if (this._style === v)
              return;
            this._style = v;
            this.\$style();
          }
        },
        fork: {
          get: () => this._fork,
          set: (v) => {
            if (this._fork === v)
              return;
            this._fork = v;
            this.\$fork();
          }
        }
      });
      this._children = obj.children = children || document.createDocumentFragment();
      this._style = obj.style = style || "";
      this._fork = obj.fork = fork || false;
      this.__fork.addEventListener("click", () => this.remove());
      document.body.appendChild(this);
    }
    timer = 0;
    \$children() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.__contain.replaceChildren(this._children);
      }, 250);
    }
    \$style() {
      this.__contain.setAttribute("style", this._style);
    }
    \$fork() {
      if (this._fork) {
        this._observe.cancel();
        this.__fork.style.display = "";
      } else {
        this._observe.observe();
        this.__fork.style.display = "none";
      }
    }
  };
  customElements.get(\`popup-box\${mutex}\`) || customElements.define(\`popup-box\${mutex}\`, PopupBox);

  // src/runtime/download/download_ui.html
  var download_ui_default = '<div class="table"></div>\\r\\n<style type="text/css">\\r\\n    .table {\\r\\n        position: fixed;\\r\\n        z-index: 11113;\\r\\n        bottom: 0;\\r\\n        width: 100%;\\r\\n        min-height: 50px;\\r\\n        display: flex;\\r\\n        box-sizing: border-box;\\r\\n        background: #fff;\\r\\n        border-radius: 8px;\\r\\n        box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);\\r\\n        transition: transform 0.3s ease-in;\\r\\n        flex-wrap: wrap;\\r\\n        align-content: center;\\r\\n        justify-content: center;\\r\\n        align-items: center;\\r\\n    }\\r\\n\\r\\n    .cell {\\r\\n        background-color: #fff;\\r\\n        color: #000 !important;\\r\\n        border: #ccc 1px solid;\\r\\n        border-radius: 3px;\\r\\n        display: flex;\\r\\n        margin: 3px;\\r\\n        flex-wrap: wrap;\\r\\n        align-content: center;\\r\\n        justify-content: center;\\r\\n        align-items: center;\\r\\n        flex-direction: row;\\r\\n    }\\r\\n\\r\\n    .type {\\r\\n        color: #000 !important;\\r\\n        display: table-cell;\\r\\n        min-width: 1.5em;\\r\\n        text-align: center;\\r\\n        vertical-align: middle;\\r\\n        padding: 10px 3px;\\r\\n    }\\r\\n\\r\\n    .type.mp4 {\\r\\n        background-color: #e0e;\\r\\n    }\\r\\n\\r\\n    .type.av1 {\\r\\n        background-color: #feb;\\r\\n    }\\r\\n\\r\\n    .type.avc {\\r\\n        background-color: #07e;\\r\\n    }\\r\\n\\r\\n    .type.hev {\\r\\n        background-color: #7ba;\\r\\n    }\\r\\n\\r\\n    .type.aac {\\r\\n        background-color: #0d0;\\r\\n    }\\r\\n\\r\\n    .type.flv {\\r\\n        background-color: #0dd;\\r\\n    }\\r\\n\\r\\n    .item {\\r\\n        display: table-cell;\\r\\n        text-decoration: none;\\r\\n        padding: 3px;\\r\\n        cursor: pointer;\\r\\n        color: #1184B4;\\r\\n    }\\r\\n\\r\\n    .item:hover {\\r\\n        color: #FE3676;\\r\\n    }\\r\\n\\r\\n    .up {\\r\\n        color: #fff !important;\\r\\n        text-align: center;\\r\\n        padding: 1px 3px;\\r\\n        background-color: #777;\\r\\n    }\\r\\n\\r\\n    .up.yellow {\\r\\n        background-color: #ffe42b;\\r\\n        background-image: linear-gradient(to right, #ffe42b, #dfb200);\\r\\n    }\\r\\n\\r\\n    .up.pink {\\r\\n        background-color: #ffafc9;\\r\\n        background-image: linear-gradient(to right, #ffafc9, #dfada7);\\r\\n    }\\r\\n\\r\\n    .up.purple {\\r\\n        background-color: #c0f;\\r\\n        background-image: linear-gradient(to right, #c0f, #90f);\\r\\n    }\\r\\n\\r\\n    .up.red {\\r\\n        background-color: #f00;\\r\\n        background-image: linear-gradient(to right, #f00, #c00);\\r\\n    }\\r\\n\\r\\n    .up.orange {\\r\\n        background-color: #f90;\\r\\n        background-image: linear-gradient(to right, #f90, #d70);\\r\\n    }\\r\\n\\r\\n    .up.blue {\\r\\n        background-color: #00d;\\r\\n        background-image: linear-gradient(to right, #00d, #00b);\\r\\n    }\\r\\n\\r\\n    .up.green {\\r\\n        background-color: #0d0;\\r\\n        background-image: linear-gradient(to right, #0d0, #0b0);\\r\\n    }\\r\\n\\r\\n    .up.lv9 {\\r\\n        background-color: #151515;\\r\\n        background-image: linear-gradient(to right, #151515, #030303);\\r\\n    }\\r\\n\\r\\n    .up.lv8 {\\r\\n        background-color: #841cf9;\\r\\n        background-image: linear-gradient(to right, #841cf9, #620ad7);\\r\\n    }\\r\\n\\r\\n    .up.lv7 {\\r\\n        background-color: #e52fec;\\r\\n        background-image: linear-gradient(to right, #e52fec, #c30dca);\\r\\n    }\\r\\n\\r\\n    .up.lv6 {\\r\\n        background-color: #ff0000;\\r\\n        background-image: linear-gradient(to right, #ff0000, #dd0000);\\r\\n    }\\r\\n\\r\\n    .up.lv5 {\\r\\n        background-color: #ff6c00;\\r\\n        background-image: linear-gradient(to right, #ff6c00, #dd4a00);\\r\\n    }\\r\\n\\r\\n    .up.lv4 {\\r\\n        background-color: #ffb37c;\\r\\n        background-image: linear-gradient(to right, #ffb37c, #dd915a);\\r\\n    }\\r\\n\\r\\n    .up.lv3 {\\r\\n        background-color: #92d1e5;\\r\\n        background-image: linear-gradient(to right, #92d1e5, #70b0c3);\\r\\n    }\\r\\n\\r\\n    .up.lv2 {\\r\\n        background-color: #95ddb2;\\r\\n        background-image: linear-gradient(to right, #95ddb2, #73bb90);\\r\\n    }\\r\\n\\r\\n    .up.lv1 {\\r\\n        background-color: #bfbfbf;\\r\\n        background-image: linear-gradient(to right, #bfbfbf, #9d9d9d);\\r\\n    }\\r\\n\\r\\n    .down {\\r\\n        font-size: 90%;\\r\\n        margin-top: 2px;\\r\\n        text-align: center;\\r\\n        padding: 1px 3px;\\r\\n    }\\r\\n</style>';

  // src/runtime/download/download_ui.ts
  var BiliOldDownload = class extends HTMLElement {
    _data;
    obj;
    _table;
    observer = new ClickRemove(this);
    constructor(obj) {
      super();
      const { data } = obj;
      const root3 = this.attachShadow({ mode: "closed" });
      root3.appendChild(createElements(htmlVnode(download_ui_default)));
      this._table = root3.children[0];
      this.obj = obj;
      Object.defineProperty(obj, "data", {
        configurable: true,
        get: () => new Proxy(this._data, new ProxyHandler(() => this.\$data())),
        set: (v) => {
          if (v === this._data)
            return;
          this._data = v;
          this.\$data();
        }
      });
      this._data = obj.data = data;
    }
    \$data() {
      const vdoms = Object.entries(this._data).reduce((s, d) => {
        const vdom = {
          tagName: "div",
          props: { class: "cell" },
          children: [
            {
              tagName: "div",
              props: { class: \`type \${d[0]}\` },
              children: [
                {
                  tagName: "text",
                  text: d[0]
                }
              ]
            }
          ]
        };
        d[1].forEach((d2) => {
          const a = { class: "item", target: "_blank" };
          d2.href && (a.href = d2.href);
          d2.fileName && (a.download = d2.fileName);
          vdom.children?.push({
            tagName: "a",
            props: a,
            children: [
              {
                tagName: "div",
                props: { class: \`up\${d2.color ? \` \${d2.color}\` : ""}\` },
                children: [
                  {
                    tagName: "text",
                    text: d2.up
                  }
                ]
              },
              {
                tagName: "div",
                props: { class: \`down\` },
                children: [
                  {
                    tagName: "text",
                    text: d2.down
                  }
                ]
              }
            ],
            event: {
              click: () => {
                d2.onclick && d2.onclick();
              }
            }
          });
        });
        s.push(vdom);
        return s;
      }, []);
      vdoms.length || vdoms.push({
        tagName: "div",
        children: [
          {
            tagName: "text",
            text: "正在获取下载数据~"
          }
        ]
      });
      this._table.replaceChildren(createElements(vdoms));
    }
    show() {
      document.body.contains(this) || document.body.appendChild(this);
      this.observer.observe();
    }
  };
  customElements.get(\`biliold-download\${mutex}\`) || customElements.define(\`biliold-download\${mutex}\`, BiliOldDownload);
  var downloadUI = new BiliOldDownload({ data: {} });

  // src/runtime/format/size.ts
  function sizeFormat(size = 0) {
    let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1e3 ** i;
    while (dex > 1) {
      if (size >= vor) {
        size = Number((size / dex).toFixed(2));
        break;
      }
      dex = dex / 1024;
      vor = vor / 1e3;
      i--;
    }
    return size ? size + unit[i] : "N/A";
  }

  // src/runtime/format/sub_array.ts
  function subArray(res, num = 1) {
    const arr2 = [...res];
    const out = [];
    num = num || 1;
    num = num < arr2.length ? num : arr2.length;
    while (out.length < num) {
      var temp2 = Math.random() * arr2.length >> 0;
      out.push(arr2.splice(temp2, 1)[0]);
    }
    return num === 1 ? out[0] : out;
  }

  // src/runtime/lib/base64.ts
  var Base64 = class {
    static encode(str) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode("0x" + p1);
      }));
    }
    static decode(str) {
      return decodeURIComponent(atob(str).split("").map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
    }
  };

  // src/runtime/download/aria2.ts
  var Aria2 = class {
    setting = {};
    constructor() {
      if (!setting)
        return;
      setting.userAgent && (this.setting.userAgent = setting.userAgent);
      setting.referer && (this.setting.referer = setting.referer);
      setting.filepath && (this.setting.directory = setting.filepath);
      setting.aria2.token && (this.setting.token = setting.aria2.token);
    }
    shell(obj) {
      return new Promise((r, j) => {
        let result = "aria2c";
        obj = { ...this.setting, ...obj };
        obj.urls.forEach((d) => result += \` "\${d}"\`);
        obj.out && (result += \` --out="\${obj.out}"\`);
        obj.userAgent && (result += \` --user-agent="\${obj.userAgent}"\`);
        obj.referer && (result += \` --referer="\${obj.referer}"\`);
        obj.directory && (result += \` --dir="\${obj.directory}"\`);
        obj.split && (result += \` --split="\${obj.split}"\`);
        obj.header && Object.entries(obj.header).forEach((d) => result += \` --header="\${d[0]}: \${d[1]}"\`);
        navigator.clipboard.writeText(result).then(r, (e) => j(e));
      });
    }
    rpc(obj) {
      obj = { ...this.setting, ...obj };
      const options = {};
      obj.out && (options.out = obj.out);
      obj.userAgent && (options["user-agent"] = obj.userAgent);
      obj.referer && (options["referer"] = obj.referer);
      obj.directory && (options["dir"] = obj.directory);
      obj.split && (options["split"] = obj.split);
      obj.header && (options["header"] = obj.header);
      return this.postMessage("aria2.addUri", obj.id || new Date().getTime(), [obj.urls, options]);
    }
    postMessage(method, id, params = []) {
      const url = \`\${setting.aria2.server}:\${setting.aria2.port}/jsonrpc\`;
      setting.aria2.token && params.unshift(\`token:\${setting.aria2.token}\`);
      return new Promise((r, j) => {
        xhr({
          url,
          method: "POST",
          responseType: "json",
          data: JSON.stringify({ method, id, params })
        }).then((d) => {
          d.error && j(d.error);
          d.result && r(d.result);
        }).catch((e) => {
          xhr({
            url: objUrl(url, { method, id, params: Base64.encode(JSON.stringify(params)) }),
            method: "GET",
            responseType: "json"
          }).then((d) => {
            d.error && j(d.error);
            d.result && r(d.result);
          }).catch(() => j(e));
        });
      });
    }
    getVersion() {
      return this.postMessage("aria2.getVersion", new Date().getTime());
    }
  };
  var aria2 = new Aria2();

  // src/runtime/download/ef2.ts
  var Ef2 = class {
    setting = {};
    constructor() {
      if (!setting)
        return;
      setting.IDM.wait && (this.setting.sendToList = setting.IDM.wait);
      setting.IDM.silence && (this.setting.toastDisabled = setting.IDM.silence);
      setting.userAgent && (this.setting.userAgent = setting.userAgent);
      setting.referer && (this.setting.referer = setting.referer);
      setting.filepath && (this.setting.directory = setting.filepath);
    }
    sendLinkToIDM(data) {
      data = { ...this.setting, ...data };
      const a = document.createElement("a");
      a.href = this.encode(data);
      a.click();
    }
    encode(data) {
      let result = "";
      Object.keys(data).forEach((d) => {
        switch (d) {
          case "cookies":
            result += \` -c "\${data.cookies}"\`;
            break;
          case "directory":
            data.directory = data.directory.replace(/\\//, "\\\\");
            data.directory && data.directory[data.directory.length - 1] == "\\\\" && (data.directory = data.directory.substr(0, data.directory.length - 1));
            result += \` -o "\${data.directory}"\`;
            break;
          case "out":
            result += \` -s "\${data.out}"\`;
            break;
          case "password":
            result += \` -P "\${data.password}"\`;
            break;
          case "postDate":
            result += \` -d "\${data.postDate}"\`;
            break;
          case "referer":
            result += \` -r "\${data.referer}"\`;
            break;
          case "sendToList":
            result += \` -q\`;
            break;
          case "toastDisabled":
            result += \` -f\`;
            break;
          case "url":
            data.url.startsWith("//") && (data.url = "https:" + data.url);
            result += \` -u "\${data.url}"\`;
            break;
          case "userAgent":
            result += \` -a "\${data.userAgent}"\`;
            break;
          case "userName":
            result += \` -U "\${data.userName}"\`;
            break;
        }
      });
      result && result.startsWith(" ") && (result = result.substr(1, result.length));
      return "ef2://" + Base64.encode(result);
    }
    decode(ef2ptl) {
      ef2ptl = ef2ptl.replace("ef2://", "");
      ef2ptl = Base64.decode(ef2ptl) + " ";
      const key = ef2ptl.match(/-\\w /g);
      const value = ef2ptl.split(/-\\w /);
      value.shift();
      return Array.from(key).reduce((s, d, i) => {
        value[i] && value[i].endsWith(" ") && (value[i] = value[i].substr(0, value[i].length - 1));
        value[i] && value[i].endsWith('"') && (value[i] = value[i].substr(1, value[i].length - 2));
        switch (d) {
          case "-c ":
            s.cookies = value[i];
            break;
          case "-o ":
            s.directory = value[i];
            break;
          case "-s ":
            s.out = value[i];
            break;
          case "-P ":
            s.password = value[i];
            break;
          case "-d ":
            s.postDate = value[i];
            break;
          case "-r ":
            s.referer = value[i];
            break;
          case "-q ":
            s.sendToList = true;
            break;
          case "-f ":
            s.toastDisabled = true;
            break;
          case "-u ":
            s.url = value[i];
            break;
          case "-a ":
            s.userAgent = value[i];
            break;
          case "-U ":
            s.userName = value[i];
            break;
        }
        return s;
      }, {});
    }
  };
  var ef2 = new Ef2();

  // src/runtime/download/playinfo_filter.ts
  var PlayinfoFiter = class {
    quality = {
      100032: "8K",
      100029: "4K",
      100028: "1080P60",
      100027: "1080P+",
      100026: "1080P",
      100024: "720P",
      100023: "480P",
      100022: "360P",
      30280: "320Kbps",
      30260: "320Kbps",
      30259: "128Kbps",
      30257: "64Kbps",
      30255: "AUDIO",
      30251: "FLAC",
      30250: "ATMOS",
      30232: "128Kbps",
      30216: "64Kbps",
      30127: "8K",
      30126: "Dolby",
      30125: "HDR",
      30121: "4K",
      30120: "4K",
      30116: "1080P60",
      30112: "1080P+",
      30106: "1080P60",
      30102: "1080P+",
      30080: "1080P",
      30077: "1080P",
      30076: "720P",
      30074: "720P",
      30066: "720P",
      30064: "720P",
      30048: "720P",
      30033: "480P",
      30032: "480P",
      30016: "360P",
      30015: "360P",
      30011: "360P",
      464: "预览",
      336: "1080P",
      320: "720P",
      288: "480P",
      272: "360P",
      208: "1080P",
      192: "720P",
      160: "480P",
      127: "8K",
      126: "Dolby",
      125: "HDR",
      120: "4K",
      116: "1080P60",
      112: "1080P+",
      80: "1080P",
      74: "720P60",
      64: "720P",
      48: "720P",
      32: "480P",
      16: "360P",
      15: "360P",
      6: "240P",
      5: "144P"
    };
    codec = {
      hev: [30127, 30126, 30125, 30121, 30106, 30102, 30077, 30066, 30033, 30011],
      avc: [30120, 30112, 30080, 30064, 30032, 30016],
      av1: [100029, 100028, 100027, 100026, 100024, 100023, 100022]
    };
    color = {
      "8K": "yellow",
      "Dolby": "pink",
      "FLAC": "pink",
      "ATMOS": "pink",
      "AUDIO": "pink",
      "HDR": "purple",
      "4K": "purple",
      "1080P60": "red",
      "1080P+": "red",
      "1080P": "red",
      "720P60": "orange",
      "720P": "orange",
      "480P": "blue",
      "360P": "green",
      "320Kbps": "red",
      "128Kbps": "blue",
      "64Kbps": "green"
    };
    record = [];
    fileName;
    constructor(fileName) {
      this.fileName = fileName;
    }
    filter(playinfo) {
      if (playinfo) {
        playinfo.data && this.filter(playinfo.data);
        playinfo.result && this.filter(playinfo.result);
        playinfo.durl && this.durl(playinfo.durl);
        playinfo.dash && this.dash(playinfo.dash);
      }
      return this.record;
    }
    durl(durl) {
      let index = 0;
      durl.forEach((d) => {
        const url = d.backupUrl || d.backup_url || [];
        url.unshift(d.url);
        const qua = this.getQuality(url[0], d.id);
        const link = {
          type: "",
          url,
          quality: qua,
          size: sizeFormat(d.size),
          color: this.color[qua] || ""
        };
        switch (d.url.includes("mp4?")) {
          case true:
            link.type = "mp4";
            break;
          case false:
            link.type = "flv";
            index++;
            link.flv = index;
            break;
        }
        this.fileName && (link.fileName = \`\${this.fileName}\${qua}.\${link.type}\`);
        this.record.push(link);
      });
    }
    dash(dash) {
      dash.video && this.dashVideo(dash.video, dash.duration);
      dash.audio && this.dashAudio(dash.audio, dash.duration);
      dash.dolby && dash.dolby.audio && Array.isArray(dash.dolby.audio) && this.dashAudio(dash.dolby.audio, dash.duration);
      dash.flac && dash.flac.audio && this.dashAudio([dash.flac.audio], dash.duration, ".flac");
    }
    dashVideo(video, duration) {
      video.forEach((d) => {
        const url = d.backupUrl || d.backup_url || [];
        (d.baseUrl || d.base_url) && url.unshift(d.baseUrl || d.base_url);
        if (!url.length)
          return;
        let type = "";
        if (d.codecs) {
          type = d.codecs.includes("avc") ? "avc" : d.codecs.includes("av01") ? "av1" : "hev";
        } else {
          const id = this.getID(url[0]);
          type = this.codec.hev.find((d2) => d2 === id) ? "hev" : "avc";
        }
        const qua = this.getQuality(url[0], d.id);
        this.record.push({
          type,
          url,
          quality: qua,
          size: sizeFormat(d.bandwidth * duration / 8),
          color: this.color[qua] || "",
          fileName: \`\${this.fileName}\${qua}.m4v\`
        });
      });
    }
    dashAudio(audio, duration, fmt = ".m4a") {
      audio.forEach((d) => {
        const url = d.backupUrl || d.backup_url || [];
        (d.baseUrl || d.base_url) && url.unshift(d.baseUrl || d.base_url);
        const qua = this.getQuality(url[0], d.id);
        url.length && this.record.push({
          type: "aac",
          url,
          quality: qua,
          size: sizeFormat(d.bandwidth * duration / 8),
          color: this.color[qua] || "",
          fileName: \`\${this.fileName}\${qua}.\${fmt}\`
        });
      });
    }
    getQuality(url, id) {
      return this.quality[this.getID(url)] || id && this.quality[id] || "N/A";
    }
    getID(url) {
      let id = 0;
      url.replace(/\\d+\\.((flv)|(mp4)|(m4s))/, (d) => id = Number(d.split(".")[0]));
      return id;
    }
  };
  function playinfoFiter(playinfo, prev = {}, fileName = API.title) {
    return new PlayinfoFiter(fileName).filter(playinfo).reduce((s, d) => {
      s[d.type] || (s[d.type] = []);
      const obj = {
        up: Reflect.has(d, "flv") ? \`\${d.quality}*\${d.flv}\` : d.quality,
        down: d.size,
        href: subArray(d.url),
        color: d.color
      };
      if (setting.downloadMethod !== "默认") {
        delete obj.href;
        obj.onclick = () => {
          postData(d);
        };
      }
      s[d.type].push(obj);
      return s;
    }, prev);
  }
  function postData(data) {
    switch (setting.downloadMethod) {
      case "IDM+ef2":
        ef2.sendLinkToIDM({ url: data.url[0], out: data.fileName });
        break;
      case "aria2":
        aria2.shell({ urls: data.url, out: data.fileName }).then(() => toast.success(\`已复制aria2命令行到剪切板，在cmd等shell中使用即可下载~\`)).catch((e) => {
          toast.error(\`复制aria2命令行失败！\`);
          debug.error(\`复制aria2命令行失败！\`, e);
        });
        break;
      case "aria2+rpc":
        aria2.rpc({ urls: data.url, out: data.fileName }).then((GID) => toast.success(\`已添加下载任务到aria2 RPC主机，任务GID：\${GID}\`)).catch((e) => {
          toast.error(\`添加下载任务到aria2 RPC主机出错！\`);
          debug.error(\`添加下载任务到aria2 RPC主机出错！\`, e);
        });
        break;
    }
  }

  // src/runtime/download/download.ts
  var Record2 = {};
  var downloading = false;
  var isCover = false;
  switchVideo(() => {
    isCover = false;
    Object.keys(Record2).forEach((d) => delete Record2[d]);
  });
  function pushDownload(obj) {
    Reflect.has(Record2, obj.group) || (Record2[obj.group] = []);
    const data = { up: obj.up, down: obj.down };
    obj.color && (data.color = obj.color);
    obj.fileName && (data.fileName = obj.fileName);
    if (obj.url) {
      data.href = obj.url;
    } else {
      data.onclick = () => {
        if (obj.callback) {
          return obj.callback();
        }
        isObject(obj.data) ? saveAs(JSON.stringify(obj.data), obj.fileName || "") : saveAs(obj.data, obj.fileName || "");
      };
    }
    Record2[obj.group].push(data);
  }
  function contactDownloadDate(target, source) {
    Object.entries(source).forEach((d) => {
      Reflect.has(target, d[0]) || (target[d[0]] = []);
      target[d[0]] = target[d[0]].concat(d[1]);
    });
  }
  function getCover() {
    if (!setting.downloadOther || isCover)
      return;
    isCover = true;
    const cover = API.cover, bkg_cover = API.bkg_cover, title = API.title;
    cover && pushDownload({
      group: "封面",
      url: cover,
      up: "封面",
      down: "N/A",
      fileName: \`\${title || \`av\${API.aid}\`}.\${cover.split(".").reduce((s, d) => s = d, void 0) || "jpg"}\`
    });
    bkg_cover && pushDownload({
      group: "封面",
      url: bkg_cover,
      up: "封面",
      down: "N/A",
      fileName: \`\${title || \`av\${API.aid}\`}.\${bkg_cover.split(".").reduce((s, d) => s = d, void 0) || "jpg"}\`
    });
  }
  async function downloadDefault() {
    if (downloading)
      return;
    downloading = true;
    if (!API.cid)
      return toast.warning("请在视频页使用本功能~");
    if (API.th)
      toast.warning("泰区视频！", "请将【referer】置空，【UserAgent】设为默认值，并选用【默认】以外的方式进行下载~");
    const data = playinfoFiter(API.__playinfo__);
    const request = [];
    const type = setting.downlaodType.join(" ").toLowerCase();
    downloadUI.obj.data = data;
    downloadUI.show();
    /mp4/g.test(type) && request.push(getContent("mp4"));
    data.flv || /flv/g.test(type) && request.push(getContent("flv"));
    data.aac || /dash/g.test(type) && request.push(getContent("dash"));
    (await Promise.all(request)).forEach((d) => {
      playinfoFiter(d, downloadUI.obj.data);
    });
    getCover();
    contactDownloadDate(downloadUI.obj.data, Record2);
    downloading = false;
  }
  async function getContent(d) {
    d = d.toLowerCase();
    let result;
    const pgc = API.pgc;
    try {
      switch (d) {
        case "dash":
          result = pgc ? await urlPack.getJson(setting.TVresource ? "api.bilibili.com/pgc/player/api/playurltv" : "api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval }) : await urlPack.getJson(setting.TVresource ? "api.bilibili.com/x/tv/ugc/playurl" : "api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval });
          break;
        case "flv":
          result = pgc ? await urlPack.getJson(setting.TVresource ? "api.bilibili.com/pgc/player/api/playurltv" : "api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid, qn: setting.downloadQn }) : await urlPack.getJson(setting.TVresource ? "api.bilibili.com/x/tv/ugc/playurl" : "api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid, qn: setting.downloadQn });
          break;
        case "mp4":
          result = pgc ? await urlPack.getJson("api.bilibili.com/pgc/player/api/playurlproj", { cid: API.cid }) : await urlPack.getJson("app.bilibili.com/v2/playurlproj", { cid: API.cid });
          break;
      }
    } catch (e) {
    }
    return JSON.parse(uposReplace(JSON.stringify(result), setting.uposReplace.dl));
  }
  window.addEventListener("message", (ev) => {
    if (typeof ev.data === "object") {
      if (ev.data.\$type == "downloadDefault") {
        downloadDefault();
      }
    }
  });

  // src/runtime/danmaku/danmaku.ts
  var import_light = __toESM(require_light());

  // src/runtime/cookies.ts
  function getCookies() {
    return document.cookie.split("; ").reduce((s, d) => {
      let key = d.split("=")[0];
      let val = d.split("=")[1];
      s[key] = unescape(val);
      return s;
    }, {});
  }

  // src/runtime/variable/uid.ts
  var uid = Number(getCookies().DedeUserID);

  // src/runtime/danmaku/bilibili_danmaku.json
  var bilibili_danmaku_default = {
    nested: {
      bilibili: {
        nested: {
          DmWebViewReply: {
            fields: {
              state: {
                type: "int32",
                id: 1
              },
              text: {
                type: "string",
                id: 2
              },
              textSide: {
                type: "string",
                id: 3
              },
              dmSge: {
                type: "DmSegConfig",
                id: 4
              },
              flag: {
                type: "DanmakuFlagConfig",
                id: 5
              },
              specialDms: {
                rule: "repeated",
                type: "string",
                id: 6
              },
              checkBox: {
                type: "bool",
                id: 7
              },
              count: {
                type: "int64",
                id: 8
              },
              commandDms: {
                rule: "repeated",
                type: "CommandDm",
                id: 9
              },
              dmSetting: {
                type: "DanmuWebPlayerConfig",
                id: 10
              }
            }
          },
          CommandDm: {
            fields: {
              id: {
                type: "int64",
                id: 1
              },
              oid: {
                type: "int64",
                id: 2
              },
              mid: {
                type: "int64",
                id: 3
              },
              command: {
                type: "string",
                id: 4
              },
              content: {
                type: "string",
                id: 5
              },
              progress: {
                type: "int32",
                id: 6
              },
              ctime: {
                type: "string",
                id: 7
              },
              mtime: {
                type: "string",
                id: 8
              },
              extra: {
                type: "string",
                id: 9
              },
              idStr: {
                type: "string",
                id: 10
              }
            }
          },
          DmSegConfig: {
            fields: {
              pageSize: {
                type: "int64",
                id: 1
              },
              total: {
                type: "int64",
                id: 2
              }
            }
          },
          DanmakuFlagConfig: {
            fields: {
              recFlag: {
                type: "int32",
                id: 1
              },
              recText: {
                type: "string",
                id: 2
              },
              recSwitch: {
                type: "int32",
                id: 3
              }
            }
          },
          DmSegMobileReply: {
            fields: {
              elems: {
                rule: "repeated",
                type: "DanmakuElem",
                id: 1
              }
            }
          },
          DanmakuElem: {
            fields: {
              id: {
                type: "int64",
                id: 1
              },
              progress: {
                type: "int32",
                id: 2
              },
              mode: {
                type: "int32",
                id: 3
              },
              fontsize: {
                type: "int32",
                id: 4
              },
              color: {
                type: "uint32",
                id: 5
              },
              midHash: {
                type: "string",
                id: 6
              },
              content: {
                type: "string",
                id: 7
              },
              ctime: {
                type: "int64",
                id: 8
              },
              weight: {
                type: "int32",
                id: 9
              },
              action: {
                type: "string",
                id: 10
              },
              pool: {
                type: "int32",
                id: 11
              },
              idStr: {
                type: "string",
                id: 12
              },
              attr: {
                type: "int32",
                id: 13
              }
            }
          },
          DanmuWebPlayerConfig: {
            fields: {
              dmSwitch: {
                type: "bool",
                id: 1
              },
              aiSwitch: {
                type: "bool",
                id: 2
              },
              aiLevel: {
                type: "int32",
                id: 3
              },
              blocktop: {
                type: "bool",
                id: 4
              },
              blockscroll: {
                type: "bool",
                id: 5
              },
              blockbottom: {
                type: "bool",
                id: 6
              },
              blockcolor: {
                type: "bool",
                id: 7
              },
              blockspecial: {
                type: "bool",
                id: 8
              },
              preventshade: {
                type: "bool",
                id: 9
              },
              dmask: {
                type: "bool",
                id: 10
              },
              opacity: {
                type: "float",
                id: 11
              },
              dmarea: {
                type: "int32",
                id: 12
              },
              speedplus: {
                type: "float",
                id: 13
              },
              fontsize: {
                type: "float",
                id: 14
              },
              screensync: {
                type: "bool",
                id: 15
              },
              speedsync: {
                type: "bool",
                id: 16
              },
              fontfamily: {
                type: "string",
                id: 17
              },
              bold: {
                type: "bool",
                id: 18
              },
              fontborder: {
                type: "int32",
                id: 19
              },
              drawType: {
                type: "string",
                id: 20
              }
            }
          }
        }
      }
    }
  };

  // src/runtime/danmaku/command_dm.css
  var command_dm_default = '.commandDm-popup {\\r\\n    border-radius: 1rem;\\r\\n    background-color: #f5f5f5;\\r\\n    position: absolute;\\r\\n    cursor: default;\\r\\n    opacity: 0;\\r\\n    transition: opacity 0.2s;\\r\\n    padding: 0.8rem 1rem;\\r\\n}\\r\\n\\r\\n.commandDm-popup.on {\\r\\n    opacity: 1;\\r\\n}\\r\\n\\r\\n.vote-dialog {\\r\\n    overflow: hidden;\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n}\\r\\n\\r\\n.vote-panel {\\r\\n    display: flex;\\r\\n    justify-content: space-between;\\r\\n    width: 100%;\\r\\n}\\r\\n\\r\\n.vote-title,\\r\\n.grade-title {\\r\\n    font-weight: bolder;\\r\\n    margin-bottom: 0.5rem;\\r\\n}\\r\\n\\r\\n.vote-option {\\r\\n    display: flex;\\r\\n    flex-direction: column;\\r\\n    width: 100%;\\r\\n}\\r\\n\\r\\n.vote-button {\\r\\n    text-align: center;\\r\\n    min-width: 85px;\\r\\n    display: inline-block;\\r\\n    padding: 0.3rem 2rem;\\r\\n    border: 1px solid #00a1d6;\\r\\n    border-radius: 5px;\\r\\n    margin: 0.2rem 0;\\r\\n    background-color: #fff;\\r\\n    cursor: pointer;\\r\\n}\\r\\n\\r\\n.vote-button:hover {\\r\\n    background-color: #1baada;\\r\\n    color: #f5f5f5;\\r\\n    transition: all 0.15s ease-out;\\r\\n}\\r\\n\\r\\n.vote-button::before {\\r\\n    position: absolute;\\r\\n    padding: 0 1.8rem;\\r\\n    left: 0;\\r\\n    content: attr(idx);\\r\\n}\\r\\n\\r\\n.vote-progress-bg {\\r\\n    border-radius: 5px;\\r\\n    min-width: 85px;\\r\\n    margin: 0.2rem 0;\\r\\n    border: 1px solid #1a1a1a6b;\\r\\n    background-color: white;\\r\\n    position: relative;\\r\\n}\\r\\n\\r\\n.vote-progress {\\r\\n    transition: width 0.3s, background-color 0.2s;\\r\\n    animation: opacity-animation 0.5s;\\r\\n    overflow: hidden;\\r\\n    display: inline-block;\\r\\n    border-radius: 4px 0 0 4px;\\r\\n    background-color: #d3d3d3;\\r\\n    text-align: left;\\r\\n    overflow: visible;\\r\\n    position: relative;\\r\\n}\\r\\n\\r\\n.vote-progress-blue {\\r\\n    background-color: #9fdef3;\\r\\n}\\r\\n\\r\\n.vote-progress-desc {\\r\\n    display: inline-block;\\r\\n    margin: 0.3rem 0.8rem;\\r\\n}\\r\\n\\r\\n@keyframes opacity-animation {\\r\\n    from {\\r\\n        opacity: 0;\\r\\n    }\\r\\n\\r\\n    to {\\r\\n        opacity: 1;\\r\\n    }\\r\\n}\\r\\n\\r\\n.vote-count {\\r\\n    display: inline-block;\\r\\n    position: absolute;\\r\\n    right: 0.8rem;\\r\\n    top: 0.3rem;\\r\\n}\\r\\n\\r\\n.vote-count::after {\\r\\n    content: "票";\\r\\n}\\r\\n\\r\\n.bilibili-player-video-popup {\\r\\n    z-index: 100;\\r\\n    position: absolute;\\r\\n    top: 0;\\r\\n    left: 0;\\r\\n    width: 100%;\\r\\n    height: 100%;\\r\\n    pointer-events: none;\\r\\n}\\r\\n\\r\\n.bilibili-player-video-popup>* {\\r\\n    pointer-events: all;\\r\\n}\\r\\n\\r\\n.link-button {\\r\\n    animation: opacity-animation 0.2s;\\r\\n    position: absolute;\\r\\n    left: 40%;\\r\\n    top: 20%;\\r\\n    background-color: #f5f5f5;\\r\\n    padding: 0.4rem 1rem;\\r\\n    border-radius: 0.6rem;\\r\\n    font-size: large;\\r\\n    box-shadow: #888888c7 0px 0px 6px;\\r\\n}\\r\\n\\r\\n.link-button:hover {\\r\\n    color: #00a1d6;\\r\\n    cursor: pointer;\\r\\n}\\r\\n\\r\\n.link-button>* {\\r\\n    vertical-align: middle;\\r\\n}\\r\\n\\r\\n.link-button>img {\\r\\n    transform: scale(0.7) translateY(-1px);\\r\\n}\\r\\n\\r\\n.danmaku-up-icon::before {\\r\\n    content: "UP主";\\r\\n    background-color: #00a1d6;\\r\\n    border-radius: 5px;\\r\\n    font-size: 0.8em;\\r\\n    padding: 0.1em;\\r\\n    transform: translateY(-0.1em);\\r\\n    display: inline-block;\\r\\n    box-shadow: #888888c7 0px 0px 6px;\\r\\n}\\r\\n\\r\\n.grade-score-area>div {\\r\\n    display: inline-block;\\r\\n    position: relative;\\r\\n    width: 41px;\\r\\n    transition: width 0.3s;\\r\\n}\\r\\n\\r\\n.grade-score-area.pointer {\\r\\n    cursor: pointer;\\r\\n}\\r\\n\\r\\n.grade-score-area>div:last-child {\\r\\n    width: 20px;\\r\\n}\\r\\n\\r\\n.grade-score-area .score-button {\\r\\n    filter: grayscale(1);\\r\\n}\\r\\n\\r\\n.grade-score-area .highlight .score-button {\\r\\n    filter: none;\\r\\n}\\r\\n\\r\\n.grade-score-area .bg {\\r\\n    position: absolute;\\r\\n    left: 0;\\r\\n    filter: blur(9px);\\r\\n    visibility: hidden;\\r\\n}\\r\\n\\r\\n.grade-score-area .highlight .bg {\\r\\n    visibility: visible;\\r\\n}\\r\\n\\r\\n.grade-score-info {\\r\\n    position: absolute;\\r\\n    right: 1rem;\\r\\n    bottom: 0.6rem;\\r\\n    opacity: 0;\\r\\n}\\r\\n\\r\\n@keyframes grade-score-showup {\\r\\n    0% {\\r\\n        opacity: 0;\\r\\n        transform: translateY(5px);\\r\\n    }\\r\\n\\r\\n    100% {\\r\\n        opacity: 1;\\r\\n        transform: translateY(0);\\r\\n    }\\r\\n}\\r\\n\\r\\n@keyframes grade-score-hit {\\r\\n    0% {\\r\\n        filter: brightness(1);\\r\\n    }\\r\\n\\r\\n    30% {\\r\\n        filter: brightness(1.5);\\r\\n    }\\r\\n\\r\\n    100% {\\r\\n        filter: brightness(1);\\r\\n    }\\r\\n}';

  // src/runtime/danmaku/command_dm.ts
  addCss(command_dm_default);
  var player;
  var widgetContainer;
  var playing = false;
  var visible = true;
  var commandDm = {
    visible: [],
    hidden: []
  };
  function init(cdm) {
    if (window.player) {
      if (widgetContainer === void 0)
        widgetContainer = initContainer();
      player = window.player;
      bindEvents();
      load(cdm);
    } else
      throw "获取window.player失败";
  }
  function load(commandDmRaw) {
    commandDm.hidden = parseDm(commandDmRaw);
    resize();
  }
  function initContainer() {
    let videoWrap = document.getElementsByClassName("bilibili-player-video-wrap")[0];
    if (!videoWrap)
      throw "未能获取播放器div";
    let widgetContainer2 = document.createElement("div");
    widgetContainer2.className = "bilibili-player-video-popup";
    videoWrap.appendChild(widgetContainer2);
    return widgetContainer2;
  }
  function bindEvents() {
    const EVENT = {
      VIDEO_MEDIA_PLAYING: "video_media_playing",
      VIDEO_MEDIA_PAUSE: "video_media_pause",
      VIDEO_MEDIA_SEEK: "video_media_seek",
      VIDEO_MEDIA_SEEKED: "video_media_seeked",
      VIDEO_MEDIA_ENDED: "video_media_ended",
      VIDEO_RESIZE: "video_resize",
      VIDEO_PLAYER_RESIZE: "video_player_resize",
      VIDEO_DESTROY: "video_destroy"
    };
    player.addEventListener(EVENT.VIDEO_MEDIA_PLAYING, play);
    player.addEventListener(EVENT.VIDEO_MEDIA_PAUSE, pause);
    player.addEventListener(EVENT.VIDEO_MEDIA_SEEK, pause);
    player.addEventListener(EVENT.VIDEO_MEDIA_SEEKED, play);
    player.addEventListener(EVENT.VIDEO_MEDIA_ENDED, pause);
    player.addEventListener(EVENT.VIDEO_PLAYER_RESIZE, resize);
    player.addEventListener(EVENT.VIDEO_DESTROY, destroy);
    document.querySelector("div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku").addEventListener(
      "click",
      (event) => {
        let option = event.target.getAttribute("name");
        if (option == "ctlbar_danmuku_close") {
          visible = false;
          pause();
          widgetContainer.style.display = "none";
        } else if (option == "ctlbar_danmuku_on") {
          visible = true;
          play();
          widgetContainer.style.display = "";
        }
      }
    );
  }
  function parseDm(commandDmRaw) {
    let popupWindow = [];
    for (let i = 0, cdm, extra, from; i < commandDmRaw.length; i++) {
      cdm = commandDmRaw[i];
      extra = JSON.parse(cdm.extra);
      from = cdm.progress / 1e3;
      switch (cdm.command) {
        case "#ATTENTION#":
        case "#ACTORFOLLOW#":
        case "#MANAGERFOLLOW#":
          debug.warn("未被支持的互动弹幕类型：" + cdm.command);
          debug.warn(cdm);
          break;
        case "#VOTE#":
          popupWindow.push(new Vote(cdm, extra, from));
          break;
        case "#GRADE#":
          popupWindow.push(new Grade(cdm, extra, from));
          break;
        case "#LINK#":
          popupWindow.push(new Link(cdm, extra, from));
          break;
        case "#RESERVE#":
        case "#ACTOR#":
        case "#ACTIVITYCOMBO#":
          debug.warn("未被支持的互动弹幕类型：" + cdm.command);
          debug.warn(cdm);
          break;
      }
    }
    return popupWindow;
  }
  function play() {
    if (visible) {
      playing = true;
      loop();
    }
  }
  function pause() {
    playing = false;
    loop();
  }
  function resize() {
    let scaleX = widgetContainer.clientWidth / 680;
    let scaleY = widgetContainer.clientHeight / 504;
    for (let i = 0; i < commandDm.visible.length; i++) {
      commandDm.visible[i].resize(scaleX, scaleY, widgetContainer.clientWidth, widgetContainer.clientHeight);
    }
    for (let i = 0; i < commandDm.hidden.length; i++) {
      commandDm.hidden[i].resize(scaleX, scaleY, widgetContainer.clientWidth, widgetContainer.clientHeight);
    }
  }
  function loop() {
    let time = player.getCurrentTime();
    if (playing) {
      requestAnimationFrame(loop);
    }
    for (let i = 0, cdm; i < commandDm.hidden.length; i++) {
      cdm = commandDm.hidden[i];
      if (cdm.from < time && cdm.to > time) {
        commandDm.visible.push(cdm);
        commandDm.hidden.splice(i, 1);
        cdm.show();
        resize();
      }
    }
    for (let i = 0, cdm; i < commandDm.visible.length; i++) {
      cdm = commandDm.visible[i];
      if (cdm.to < time || cdm.from > time) {
        commandDm.hidden.push(cdm);
        commandDm.visible.splice(i, 1);
        cdm.hide();
      }
    }
  }
  function destroy() {
    playing = false;
    for (let i = 0; i < commandDm.visible.length; i++) {
      commandDm.visible[i].destroy();
    }
    for (let i = 0; i < commandDm.hidden.length; i++) {
      commandDm.hidden[i].destroy();
    }
    commandDm.visible.splice(0, commandDm.visible.length);
    commandDm.hidden.splice(0, commandDm.hidden.length);
  }
  function divClass(className) {
    let div = document.createElement("div");
    div.className = className;
    return div;
  }
  function isLoggedin() {
    if (uid)
      return true;
    player.pause();
    toast.warning("请先登录！");
    biliQuickLogin();
  }
  function post2(url, data, contentType = "application/x-www-form-urlencoded;charset=UTF-8") {
    data.csrf = getCookies().bili_jct;
    return xhr({
      url,
      data: objUrl("", data),
      headers: { "Content-Type": contentType },
      method: "POST",
      credentials: true
    });
  }
  var PopupWindow = class {
    popup;
    duration;
    from;
    to;
    pos_x;
    pos_y;
    constructor(cdm, extra, from) {
      this.duration = extra.duration / 1e3 || 5;
      this.from = from || 0;
      this.to = from + (extra.duration / 1e3 || 5);
      this.pos_x = extra.posX || 200;
      this.pos_y = extra.posY || 200;
      this.popup = divClass("commandDm-popup");
      this.popup.style.display = "none";
      widgetContainer.appendChild(this.popup);
    }
    show() {
      this.popup.style.display = "";
      requestAnimationFrame(() => this.popup.className = "commandDm-popup on");
    }
    hide() {
      this.popup.className = "commandDm-popup";
      setTimeout(() => this.popup.style.display = "none", 200);
    }
    destroy() {
    }
    resize(scaleX, scaleY, containerWidth, containerHeight) {
      this.popup.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min((scaleX + scaleY) / 2, 1.5) + ")";
      let left = this.pos_x * scaleX;
      let top = this.pos_y * scaleY;
      left = Math.max(left, this.popup.clientWidth / 2);
      top = Math.max(top, this.popup.clientHeight / 2);
      left = Math.min(left, containerWidth - this.popup.clientWidth / 2);
      top = Math.min(top, containerHeight - this.popup.clientHeight / 2);
      this.popup.style.left = left + "px";
      this.popup.style.top = top + "px";
    }
  };
  var Vote = class extends PopupWindow {
    total;
    voteId;
    options;
    question;
    myVote;
    dialog;
    result;
    button;
    count;
    progress;
    constructor(cdm, extra, from) {
      super(cdm, extra, from);
      this.popup.style.width = "150px";
      this.total = extra.cnt;
      this.voteId = extra.vote_id;
      this.options = extra.options;
      this.question = extra.question;
      this.myVote = extra.my_vote;
      let dialog = divClass("vote-dialog");
      let panel = divClass("vote-panel");
      let title = divClass("vote-title");
      title.innerHTML = this.question;
      let optionDiv = divClass("vote-option");
      let button = [];
      for (let i = 0, btn, opt; i < this.options.length; i++) {
        opt = this.options[i];
        btn = divClass("vote-button");
        btn.innerHTML = opt.desc;
        btn.setAttribute("idx", opt.idx);
        btn.onclick = () => this.goVote(opt.idx, i);
        button[i] = btn;
        optionDiv.appendChild(btn);
      }
      panel.appendChild(optionDiv);
      dialog.appendChild(title);
      dialog.appendChild(panel);
      this.popup.appendChild(dialog);
      this.dialog = dialog;
      this.button = button;
      this.progress = [];
      if (this.myVote !== 0) {
        this.showResult();
        this.progress[this.myVote - 1].className = "vote-progress vote-progress-blue";
      }
      ;
    }
    goVote(idx, i) {
      if (isLoggedin()) {
        this.total += 1;
        this.options[i].cnt += 1;
        let url = "//api.bilibili.com/x/web-interface/view/dm/vote";
        post2(url, {
          aid: API.aid,
          cid: API.cid,
          progress: Math.max(Math.round(1e3 * player.getCurrentTime()), 1),
          vote: idx,
          vote_id: this.voteId
        }).then((resp) => {
          resp = JSON.parse(resp);
          biliAPI.verify(resp, "投票");
          this.progress[i].className = "vote-progress vote-progress-blue";
        });
        this.myVote = idx;
        this.showResult();
        this.to += 5;
      }
    }
    showResult() {
      this.count = [];
      for (let i = 0, progress, desc; i < this.button.length; i++) {
        this.button[i].onclick = null;
        this.button[i].innerHTML = "";
        this.button[i].className = "vote-progress-bg";
        progress = divClass("vote-progress");
        desc = divClass("vote-progress-desc");
        desc.innerHTML = this.options[i].desc;
        progress.appendChild(desc);
        this.button[i].appendChild(progress);
        this.progress[i] = progress;
        let cnt = divClass("vote-count");
        cnt.innerHTML = this.options[i].cnt;
        this.count[i] = cnt;
        this.button[i].appendChild(cnt);
      }
      this.resultAnimation();
    }
    resultAnimation() {
      for (let i = 0; i < this.progress.length; i++) {
        this.progress[i].style.width = "0";
        requestAnimationFrame(() => this.progress[i].style.width = this.options[i].cnt / this.total * 100 + "%");
      }
      let start = performance.now();
      let frame = (t) => {
        let percentage = (t - start) * 125e-5;
        if (percentage < 1)
          requestAnimationFrame(frame);
        else
          percentage = 1;
        for (let i = 0; i < this.count.length; i++) {
          this.count[i].innerHTML = Math.floor(this.options[i].cnt * percentage);
        }
      };
      requestAnimationFrame(frame);
    }
    show() {
      super.show();
      if (this.myVote !== 0) {
        this.resultAnimation();
      }
    }
    hide() {
      super.hide();
      this.to = this.from + this.duration;
    }
  };
  var Grade = class extends PopupWindow {
    gradeInfo;
    scoreInfo;
    scoreButton;
    constructor(cdm, info, from) {
      super(cdm, info, from);
      this.popup.style.width = "184px";
      this.gradeInfo = info;
      this.popup.innerHTML = \`
            <div style="display:block" class="grade-title">\${info.msg}</div>
            <div class="grade-score-area pointer"></div>
            <div class="grade-score-info" style="display:none">
                <div style="color:#6f6f6f;display:inline-block;">平均</div><span style="color:\${info.skin_font_color};font-size:27px" class="grade-avg-score">\${info.avg_score}</span>
            </div>
            <span style="position:absolute;right:1rem;top:0.8rem;font-size:12px;color:#6f6f6f" class="grade-score-count">\${info.count}人参与</span>
            \`;
      this.scoreInfo = this.popup.getElementsByClassName("grade-score-info")[0];
      let scoreArea = this.popup.getElementsByClassName("grade-score-area")[0];
      let scoreButton = [];
      function highlightScores(i) {
        for (let m = 0; m < 5; m++) {
          if (m <= i && !scoreButton[m].highlight) {
            scoreButton[m].highlight = true;
            scoreButton[m].className = "highlight";
          } else if (m > i && scoreButton[m].highlight) {
            scoreButton[m].highlight = false;
            scoreButton[m].className = "";
          }
        }
      }
      for (let i = 0; i < 5; i++) {
        let score = document.createElement("div");
        scoreButton[i] = score;
        score.innerHTML = \`
                <img width=20 hegiht=20 src="\${info.skin_selected}" class="bg"></img>
                <img width=20 hegiht=20 src="\${info.skin_selected}" class="score-button"></img>\`;
        scoreArea.appendChild(score);
        if (info.mid_score === 0) {
          score.onmouseenter = () => highlightScores(i);
          score.onclick = () => {
            if (isLoggedin()) {
              this.gradeInfo.avg_score = (this.gradeInfo.count * this.gradeInfo.avg_score + (i + 1) * 2) / (this.gradeInfo.count + 1);
              this.gradeInfo.avg_score = this.gradeInfo.avg_score.toPrecision(2);
              this.gradeInfo.count += 1;
              this.popup.getElementsByClassName("grade-avg-score")[0].innerHTML = this.gradeInfo.avg_score;
              this.popup.getElementsByClassName("grade-score-count")[0].innerHTML = this.gradeInfo.count + "人参与";
              this.showResult();
              for (let index = 0; index < 5; index++) {
                if (index <= i) {
                  scoreButton[index].style.animation = "grade-score-hit 0.7s ease forwards";
                  setTimeout(() => scoreButton[index].style.animation = "", 1e3);
                }
                scoreButton[index].onclick = null;
                scoreButton[index].onmouseenter = null;
              }
              scoreArea.onmouseleave = null;
              scoreArea.classList.remove("pointer");
              this.goGrade((i + 1) * 2);
            }
          };
        }
      }
      ;
      if (info.mid_score === 0)
        scoreArea.onmouseleave = () => highlightScores(-1);
      this.scoreButton = scoreButton;
      if (info.mid_score != 0) {
        this.showResult();
        highlightScores(info.mid_score / 2 - 1);
        scoreArea.classList.remove("pointer");
      }
    }
    goGrade(score) {
      post2("https://api.bilibili.com/x/v2/dm/command/grade/post", {
        aid: API.aid,
        cid: API.cid,
        progress: parseInt(player.getCurrentTime()) * 1e3,
        grade_id: this.gradeInfo.grade_id,
        grade_score: score
      });
      this.to += 3;
    }
    showResult() {
      this.scoreInfo.style.display = "";
      this.scoreInfo.style.animation = "grade-score-showup 0.3s ease 0.2s forwards";
      for (let i = 0; i < 4; i++) {
        setTimeout(() => this.scoreButton[i].style.width = "24px", i * 50);
      }
    }
    hide() {
      super.hide();
      this.to = this.from + this.duration;
    }
  };
  var favList = class {
    static get() {
      if (this.list.length > 0)
        return Promise.resolve(this.list);
      return xhr({
        url: objUrl("//api.bilibili.com/x/v3/fav/folder/created/list-all", {
          type: 2,
          rid: API.aid,
          up_mid: uid
        }),
        credentials: true
      }).then((resp) => {
        resp = JSON.parse(resp);
        biliAPI.verify(resp, "获取收藏列表");
        this.list = resp.data.list;
        this.list.forEach((v) => v.attr === 1 && (this.defaultFolderId = v.id));
        return this.list;
      });
    }
    static getDefaultFolder() {
      if (this.defaultFolderId !== 0)
        return Promise.resolve(this.defaultFolderId);
      return this.get().then(() => {
        return this.defaultFolderId;
      });
    }
  };
  __publicField(favList, "list", []);
  __publicField(favList, "defaultFolderId", 0);
  var biliAPI = class {
    static verify(resp, msg) {
      if (resp.code !== 0) {
        toast.error(msg + "失败", resp.code, resp.message);
        throw msg + "失败";
      }
      return resp;
    }
    static like(bool) {
      bool = bool ? 1 : 2;
      return post2("//api.bilibili.com/x/web-interface/archive/like", {
        aid: API.aid,
        like: bool
      }, "application/json; charset=utf-8").then((resp) => biliAPI.verify(resp, "点赞"));
    }
    static follow() {
      return post2("//api.bilibili.com/x/relation/modify", {
        aid: API.aid,
        fid: window.getAuthorInfo().mid,
        act: 1,
        re_src: 14
      }).then((resp) => {
        resp = JSON.parse(resp);
        return biliAPI.verify(resp, "关注");
      });
    }
    static coin() {
    }
    static fav() {
      return post2("//api.bilibili.com/x/v3/fav/resource/deal", {
        rid: API.aid,
        type: 2,
        add_media_ids: favList.defaultFolderId
      }).then((resp) => {
        resp = JSON.parse(resp);
        return biliAPI.verify(resp, "收藏");
      });
    }
    static triple() {
      return post2("//api.bilibili.com/x/web-interface/archive/like/triple", {
        aid: API.aid
      }, "application/json; charset=utf-8").then((resp) => {
        biliAPI.verify(resp, "三连");
        let d = resp.data;
        if (d.coin && d.like && d.fav)
          return;
        if (!d.coin)
          toast.error("投币失败");
        if (!d.like)
          toast.error("点赞失败");
        if (!d.fav)
          toast.error("收藏失败");
        return d;
      });
    }
  };
  var Link = class {
    content;
    aid;
    from;
    to;
    pos_x;
    pos_y;
    button;
    constructor(cdm, extra, from) {
      this.content = cdm.content;
      this.aid = extra.aid;
      this.from = from || 0;
      this.to = from + 5;
      this.pos_x = extra.posX || 200;
      this.pos_y = extra.posY || 200;
      let button = divClass("link-button");
      let img = document.createElement("img");
      img.src = "https://static.hdslb.com/images/favicon.ico";
      let span = document.createElement("span");
      span.innerHTML = this.content;
      button.appendChild(img);
      button.appendChild(span);
      button.style.display = "none";
      button.onclick = () => {
        player.pause();
        window.open("https://www.bilibili.com/video/av" + this.aid);
      };
      widgetContainer.appendChild(button);
      this.button = button;
    }
    show() {
      this.button.style.display = "block";
    }
    hide() {
      this.button.style.display = "none";
    }
    resize(scaleX, scaleY) {
      this.button.style.left = this.pos_x * scaleX + "px";
      this.button.style.top = this.pos_y * scaleY + "px";
      this.button.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min(1.5, (scaleX + scaleY) / 2) + ")";
    }
    destroy() {
    }
  };
  async function loadCommandDm(cdm, aid, cid) {
    try {
      if (aid != aid || cid != cid || widgetContainer !== void 0 && document.getElementById("bilibiliPlayer").contains(widgetContainer)) {
        return;
      }
      init(cdm);
    } catch (e) {
      toast.error("互动弹幕组件出错~");
      debug.error("互动弹幕组件出错~", e);
    }
  }

  // src/runtime/player/video_float.ts
  function videoFloat(data, hint, callback, time = 5) {
    const node2 = document.querySelector(".bilibili-player-video-toast-wrp");
    if (node2 && data) {
      const flt = node2.appendChild(createElement(htmlVnode(
        \`<div class="bilibili-player-video-toast-bottom">
                    <div class="bilibili-player-video-toast-item bilibili-player-video-toast-pay">
                        <span class="video-float-hint-text">\${data}</span>
                        \${hint ? \`<span class="video-float-hint-btn\${callback ? " hint-red" : ""}">\${hint}</span>\` : ""}
                    </div>
                </div>\`
      )[0]));
      if (callback && hint) {
        flt.children[0].children[1].addEventListener("click", callback);
      }
      if (time && !isNaN(time)) {
        setTimeout(() => flt.remove(), time * 1e3);
      }
    }
  }

  // src/runtime/danmaku/local_danmaku.ts
  var LocalMedia = class {
    data = { xml: [], json: [], mp4: [] };
    offset = 0;
    keyboard = false;
    constructor(files) {
      this.change(files);
    }
    change(files) {
      if (!window.player) {
        return toast.warning("请在播放页使用本功能 →_→");
      }
      const file = files;
      if (file.length === 0) {
        return toast.warning("请选择本地视频或弹幕文件！", "视频：.mp4（且符合浏览器支持的编码）", "弹幕：.xml, .json");
      }
      this.data = { xml: [], json: [], mp4: [] };
      this.data = Array.from(file).reduce((d, i) => {
        /\\.xml\$/.test(i.name) && d.xml.push(i);
        /\\.json\$/.test(i.name) && d.json.push(i);
        /\\.mp4\$/.test(i.name) && d.mp4.push(i);
        return d;
      }, this.data);
      if (!this.data.xml[0] && !this.data.json[0] && !this.data.mp4[0]) {
        return toast.warning("未能识别到任何有效文件信息 →_→");
      }
      this.video();
      this.danmaku();
    }
    async danmaku() {
      if (!danmaku.loadLocalDm) {
        return toast.error("载入本地弹幕失败：本地弹幕组件丢失！", "本功能只能在旧版播放器使用~");
        ;
      }
      if (!this.data.xml[0] && !this.data.json[0])
        return;
      this.data.xml.forEach(async (d, i) => {
        let data = await readAs(d);
        toast("本地弹幕：" + d.name, "载入模式：" + (i || setting.danmakuContact ? "与当前弹幕合并" : "替换当前弹幕"));
        danmaku.loadLocalDm(data, Boolean(i) || setting.danmakuContact);
      });
      this.data.json.forEach(async (d, i) => {
        let data = JSON.parse(await readAs(d)) || [];
        toast("本地弹幕：" + d.name, "载入模式：" + (this.data.xml[0] || i || setting.danmakuContact ? "与当前弹幕合并" : "替换当前弹幕"));
        window.player?.setDanmaku(data, this.data.xml[0] || Boolean(i) || setting.danmakuContact);
      });
      this.offset = 0;
      if (!window.player?.offsetDanmaku)
        return toast.error("绑定键盘事件失败：弹幕偏移组件丢失！");
      else {
        toast("已绑定键盘事件", "可以通过键盘 , 和 . 两个键（即上标为 < 和 > 的两个键）提前或延后弹幕偏移，频度1秒/次");
        if (!this.keyboard) {
          this.keyboard = true;
          document.addEventListener("keydown", (ev) => {
            switch (ev.key) {
              case ",":
                window.player.offsetDanmaku(-1);
                this.offset--;
                videoFloat("弹幕偏移：", \`\${this.offset} 秒\`);
                break;
              case ".":
                window.player.offsetDanmaku(1);
                this.offset++;
                videoFloat("弹幕偏移：", \`\${this.offset} 秒\`);
                break;
              default:
                break;
            }
          });
        }
      }
    }
    video() {
      if (this.data.mp4[0]) {
        toast.warning("载入本地视频中...", "请无视控制台大量报错！");
        let video = document.querySelector("#bilibiliPlayer > div.bilibili-player-area.video-state-pause > div.bilibili-player-video-wrap > div.bilibili-player-video > video");
        video.src = URL.createObjectURL(this.data.mp4[0]);
        toast.success("本地视频：" + this.data.mp4[0].name);
        document.querySelector(".bilibili-player-video-time-total").textContent = this.time(video.duration);
      }
    }
    time(time) {
      time = Number(time) || 0;
      let s = time % 60;
      let m = (time - s) / 60;
      s = (Array(2).join("0") + s).slice(-2);
      m = m < 10 ? (Array(2).join("0") + m).slice(-2) : m;
      return \`\${m}:\${s}\`;
    }
  };

  // src/runtime/format/unit.ts
  function unitFormat(num = 0) {
    num = 1 * num || 0;
    let unit = ["", "万", "亿"], i = unit.length - 1, dex = 1e4 ** i;
    while (dex > 1) {
      if (num >= dex) {
        num = Number((num / dex).toFixed(1));
        break;
      }
      dex = dex / 1e4;
      i--;
    }
    return num + unit[i];
  }

  // src/runtime/danmaku/all_danmaku.ts
  var AllDanmaku = class {
    pubdate;
    today;
    time;
    arrP;
    danmaku = [];
    arrT;
    timeT;
    float;
    note;
    constructor() {
      this.note = toast.custom(0, "info", "冷却延时请尽量调大，以免短时间内大量请求被临时封端口！");
      this.float = toast.custom(0, "info", "正在尝试获取全部弹幕请耐心等待。。。");
      xhr({
        url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
        responseType: "json",
        credentials: true
      }, true).then((d) => {
        this.pubdate = d.data.pubdate;
        this.pubdate = timeFormat(this.pubdate * 1e3, true).split(" ")[0];
        this.today = timeFormat(void 0, true).split(" ")[0];
        this.time = this.today;
        this.arrP = this.pubdate.split("-");
        this.danmaku = [];
        if (this.pubdate) {
          this.arrT = this.time.split("-");
          this.check();
        } else {
          return Promise.reject("获取视频上传日期数据失败，已停止~");
        }
      }).catch((e) => {
        this.floatChange("error", ["获取全弹幕失败，已停止~"], 3);
        this.noteChange("error", ["ಥ_ಥ"], 3);
        debug.error("全弹幕装填", e);
      });
      this.pubdate = new Date(2009, 0);
    }
    floatChange(type, data, delay) {
      if (this.float) {
        this.float.type = type;
        this.float.data = data;
        delay !== void 0 && (this.float.delay = delay);
      }
      switch (type) {
        case "error":
          debug.error(...data);
          break;
        case "success":
          debug.log(...data);
          break;
        case "info":
          debug.log(...data);
          break;
        case "warning":
          debug.warn(...data);
          break;
      }
    }
    noteChange(type, data, delay) {
      if (this.note) {
        this.note.type = type;
        data.forEach((d) => {
          if (this.note.data.length >= 20)
            this.note?.data.shift();
          this.note?.data.push(d);
        });
        delay !== void 0 && (this.note.delay = delay);
      }
      switch (type) {
        case "error":
          debug.error(...data);
          break;
        case "success":
          debug.log(...data);
          break;
        case "info":
          debug.log(...data);
          break;
        case "warning":
          debug.warn(...data);
          break;
      }
    }
    async init() {
      try {
        this.arrT = this.time.split("-");
        if (this.arrT[0] < this.arrP[0])
          return this.done(1);
        if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1])
          return this.done(1);
        if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2])
          return this.done(1);
        this.noteChange("info", ["正在获取 " + this.time + " 日的弹幕。。。"]);
        let Dm = await danmaku.getHistoryDanmaku(this.time);
        danmaku.sortDmById(Dm, "idStr");
        Dm.reverse();
        this.time = timeFormat(Dm[Dm.length - 1].ctime * 1e3, true).split(" ")[0];
        this.danmaku = this.danmaku.concat(Dm);
        this.floatChange("success", ["数据返回！已获取弹幕数：" + unitFormat(this.danmaku.length)]);
        this.arrT = this.time.split("-");
        if (this.pubdate != this.today)
          return this.check();
        this.done(1);
      } catch (e) {
        debug.error("全弹幕装填", e);
        if (this.danmaku[0]) {
          this.floatChange("warning", ["弹幕获取出错！", "保留并载入已获取的弹幕"]);
          this.done();
        } else {
          this.floatChange("error", ["弹幕获取出错！", "已退出！"], 3);
          this.noteChange("error", ["ಥ_ಥ"], 3);
        }
      }
    }
    async check() {
      try {
        if (this.arrT[0] < this.arrP[0])
          return this.done(1);
        if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1])
          return this.done(1);
        if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2])
          return this.done(1);
        let data = await xhr({
          url: objUrl("https://api.bilibili.com/x/v2/dm/history/index", {
            type: 1,
            oid: API.cid,
            month: this.arrT.slice(0, 2).join("-")
          }),
          credentials: true
        });
        data = jsonCheck(data).data;
        if (data && data[0]) {
          for (let i = data.length - 1; i >= 0; i--) {
            let date = data[i].split("-");
            if (date[2] < this.arrT[2]) {
              this.timeT = data[i];
              break;
            }
          }
          if (this.timeT) {
            this.time = this.timeT;
            this.timeT = void 0;
            this.noteChange("info", [\`技能冷却中。。。请稍待 \${setting.allDanmaku} 秒钟\`]);
            return setTimeout(() => this.init(), setting.allDanmaku * 1e3);
          } else {
            if (this.arrT[1] > 1) {
              this.arrT[1]--;
              this.arrT[1] = integerFormat(this.arrT[1], 2);
            } else
              this.arrT = [this.arrT[0] - 1, 12, 31];
            this.noteChange("info", [\`获取前一个月数据 \${this.arrT.slice(0, 2).join("-")} 请稍待 \${setting.allDanmaku} 秒钟\`]);
            return setTimeout(() => this.check(), setting.allDanmaku * 1e3);
          }
        } else {
          if (this.arrT[1] > 1) {
            this.arrT[1]--;
            if (this.arrT[1] < 10)
              this.arrT[1] = integerFormat(this.arrT[1], 2);
          } else
            this.arrT = [this.arrT[0] - 1, 12, 31];
          this.noteChange("info", [\`获取前一个月数据 \${this.arrT.slice(0, 2).join("-")} 请稍待 \${setting.allDanmaku} 秒钟\`]);
          return setTimeout(() => this.check(), setting.allDanmaku * 1e3);
        }
      } catch (e) {
        e = Array.isArray(e) ? e : [e];
        debug.error("全弹幕装填", e);
        if (this.danmaku[0]) {
          this.floatChange("warning", ["弹幕获取出错！", "保留并载入已获取的弹幕"]);
          this.done();
        } else {
          this.floatChange("error", ["弹幕获取出错！", "已退出！"]);
          this.noteChange("error", ["ಥ_ಥ"], 3);
        }
      }
    }
    async done(boolean) {
      try {
        this.noteChange("info", ["正在获取BAS/代码弹幕专包。。。"]);
        this.danmaku = this.danmaku.concat(await danmaku.specialDms());
      } catch (e) {
      }
      let Dm = danmaku.danmakuFormat(this.danmaku);
      if (boolean) {
        this.floatChange("success", ["全弹幕获取成功，正在装填。。。", "总弹幕量：" + unitFormat(this.danmaku.length), "同时推送至下载面板，可右键保存 π_π"], 3);
      }
      this.noteChange("info", ["执行结束~"], 3);
      window.player?.setDanmaku(Dm);
      setting.downloadOther && pushDownload({
        group: "弹幕",
        data: Dm,
        up: "全弹幕",
        down: \`N/A\`,
        callback: () => danmaku.saveDanmaku(Dm, \`[全弹幕]\${API.title || API.cid}\`)
      });
    }
  };
  function allDanmaku() {
    if (!uid)
      return toast.warning("请登录后使用 ಥ_ಥ");
    if (!window.player)
      return toast.warning("请在播放页面使用本功能 →_→");
    if (!window.player.setDanmaku)
      return toast.warning("内部组件丢失！", "请检查【托管原生脚本】功能是否开启！");
    new AllDanmaku();
  }

  // src/runtime/danmaku/danmaku.ts
  var root = import_light.default.Root.fromJSON(bilibili_danmaku_default);
  var danmakuType = new Proxy({}, {
    get: (t, p, r) => {
      if (!t[p]) {
        t[p] = root.lookupType(\`bilibili.\${p}\`);
      }
      return t[p];
    },
    set: (t, p, v, r) => true
  });
  var loadProgress = {
    get root() {
      return document.querySelector(".bilibili-player-danmaku-load-status");
    },
    _pos: 0,
    _total: 0,
    _error: 0,
    set total(v) {
      this._total = v;
      this.root && (this.root.innerHTML = \`载入弹幕数据（\${this._pos || "--"}\${this._error ? this._error : ""}/\${parseInt(this._total) || "--"}）\`);
    },
    get total() {
      return this._total;
    },
    set pos(v) {
      this._pos = v;
      this.root && (this.root.innerHTML = \`载入弹幕数据（\${this._pos || "--"}\${this._error ? this._error : ""}/\${parseInt(this._total) || "--"}）\`);
    },
    get pos() {
      return this._pos;
    },
    set error(v) {
      this._error = v;
      this.root && (this.root.innerHTML = \`载入弹幕数据（\${this._pos || "--"}\${this._error ? this._error : ""}/\${parseInt(this._total) || "--"}）\`);
    },
    get error() {
      return this._error;
    },
    clear() {
      if (this._error) {
        toast.warning("部分弹幕包丢失~", \`\${this._error}/\${parseInt(this._total)}\`);
        debug.error(\`弹幕分包：\${parseInt(this._total)}\`, \`成功：\${this._pos}\`, \`失败：\${this._error}\`);
      } else
        debug("加载弹幕成功~", \`分包总数：\${parseInt(this._total)}\`);
      this._pos = 0;
      this._total = 0;
      this._error = 0;
    }
  };
  var Danmaku = class {
    dmView = {};
    toXml(danmaku2) {
      let DM = Reflect.has(danmaku2[0], "idStr") ? this.danmakuFormat(danmaku2) : danmaku2;
      this.sortDmById(DM, "dmid");
      let xml = DM.reduce((s, d) => {
        s += \`<d p="\${d.stime},\${d.mode},\${d.size},\${d.color},\${d.date},\${d.class},\${d.uid},\${d.dmid}">\${d.text.replace(/[<">'&]/g, (a) => {
          return { "<": "&lt;", '"': "&quot;", ">": "&gt;", "'": "&#39;", "&": "&amp;" }[a];
        }).replace(/(\\n|\\r\\n)/g, "/n")}</d>\\r
\`;
        return s;
      }, '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.api.bilibili.com</chatserver><chatid>' + API.cid + "</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>\\r\\n");
      xml += "</i>";
      var regex = /((?:[\\0-\\x08\\x0B\\f\\x0E-\\x1F\\uFFFD\\uFFFE\\uFFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))/g;
      return xml.replace(regex, "");
    }
    sortDmById(danmaku2, key) {
      let egx = /^\\d+\$/;
      for (let i = 0, d; i < danmaku2.length; i++) {
        d = danmaku2[i];
        if (!egx.test(d[key]))
          throw "请输入数字字符串";
        if (typeof d[key] !== "string")
          d[key] = String(d[key]);
        d[key] = d[key].replace(/^0+/, "");
      }
      danmaku2.sort((a, b) => this.bigInt(a[key], b[key]) ? 1 : -1);
    }
    danmakuFormat(dm) {
      if (!dm)
        return [];
      let danmaku2 = dm.map(function(v) {
        let result = {
          class: v.pool,
          color: v.color,
          date: v.ctime,
          dmid: v.idStr,
          mode: v.mode,
          size: v.fontsize,
          stime: v.progress / 1e3,
          text: v.mode != 8 && v.mode != 9 ? v.content.replace(/(\\/n|\\\\n|\\n|\\r\\n)/g, "\\n") : v.content,
          uid: v.midHash,
          weight: v.weight
        };
        if (v.action && v.action.startsWith("picture:"))
          result.html = \`<img src="//\${v.action.split(":")[1]}" style="width:auto;height:56.25px;">\`;
        if (v.styleClass !== void 0)
          result.AH = v.styleClass;
        return result;
      });
      this.sortDmById(danmaku2, "dmid");
      return danmaku2;
    }
    bigInt(num1, num2) {
      if (num1.length > num2.length)
        return true;
      else if (num1.length < num2.length)
        return false;
      else {
        for (let i = 0; i < num1.length; i++) {
          if (num1[i] > num2[i])
            return true;
          if (num1[i] < num2[i])
            return false;
        }
        return false;
      }
    }
    segDmDecode(response) {
      return danmakuType.DmSegMobileReply.decode(new Uint8Array(response)).elems;
    }
    async getSegDanmaku(aid = API.aid, cid = API.cid) {
      try {
        if (!aid || !cid)
          throw \`无法获取弹幕 aid：\${aid} cid：\${cid}\`;
        const dmMeta = await this.dmWebView(aid, cid);
        const pageSize = dmMeta.dmSge.pageSize ? dmMeta.dmSge.pageSize / 1e3 : 360;
        loadProgress.total = window.player && window.player.getDuration && window.player.getDuration() / pageSize + 1 || dmMeta.dmSge.total;
        if (aid && aid != API.aid)
          loadProgress.total = dmMeta.dmSge.total;
        let result = [];
        const req = [];
        for (let index = 1; index <= loadProgress.total; index++) {
          req.push(this.dmWebSeg(index, aid, cid));
        }
        (await Promise.all(req)).forEach((d) => result = result.concat(d));
        result = result.concat(await this.specialDms(aid, cid, dmMeta));
        dmMeta.commandDms.length > 0 && (result = result.concat(this.upHighlightDm(dmMeta.commandDms)));
        setting.commandDm && dmMeta.commandDms && Promise.resolve().then(() => {
          loadCommandDm(dmMeta.commandDms, aid, cid);
        });
        return result;
      } catch (e) {
        toast.error("加载弹幕出错~");
        debug.error("加载弹幕出错~", e);
      }
    }
    async dmWebView(aid = API.aid, cid = API.cid) {
      try {
        if (this.dmView[cid])
          return this.dmView[cid];
        const data = await xhr({
          url: objUrl("https://api.bilibili.com/x/v2/dm/web/view", {
            type: 1,
            oid: cid,
            pid: aid
          }),
          credentials: true,
          responseType: "arraybuffer"
        }, true);
        return this.dmView[cid] = danmakuType.DmWebViewReply.decode(new Uint8Array(data));
      } catch (e) {
        toast.error("加载弹幕元数据出错！");
        throw e;
      }
    }
    async dmWebSeg(i, aid = API.aid, cid = API.cid) {
      try {
        const data = await xhr({
          url: objUrl("https://api.bilibili.com/x/v2/dm/web/seg.so", {
            type: 1,
            oid: cid,
            pid: aid,
            segment_index: i
          }),
          credentials: true,
          responseType: "arraybuffer"
        });
        loadProgress.pos++;
        return this.segDmDecode(data);
      } catch (e) {
        loadProgress.error++;
        debug.error(\`加载弹幕分包 \${i} 出错\`);
        return [];
      }
    }
    async specialDms(aid = API.aid, cid = API.cid, config) {
      let result = [];
      try {
        config = config || await this.dmWebView(aid, cid);
        if (config.specialDms.length > 0) {
          loadProgress.total += config.specialDms.length;
          const data = await Promise.all(config.specialDms.reduce((s, d) => {
            s.push(this.dmSpSeg(d.replace("http:", "https:")));
            return s;
          }, []));
          data.forEach((d) => result = result.concat(d));
        }
      } catch (e) {
        debug.error("获取特殊弹幕出错~", e);
      }
      loadProgress.clear();
      return result;
    }
    async dmSpSeg(url) {
      try {
        const data = await xhr({
          url,
          responseType: "arraybuffer"
        });
        loadProgress.pos++;
        return this.segDmDecode(data);
      } catch (e) {
        loadProgress.error++;
        debug("获取特殊弹幕出错~", url, e);
        return [];
      }
    }
    upHighlightDm(dms) {
      try {
        return dms.reduce((s, d) => {
          if (d.command == "#UP#") {
            d.styleClass = "danmaku-up-icon";
            d.color = 16777215;
            d.pool = 0;
            d.fontsize = 25;
            d.ctime = new Date(d.mtime).getTime() / 1e3;
            d.mode = 1;
            d.midHash = crc32(d.mid);
          }
          return s;
        }, []);
      } catch (e) {
        debug.error("UP主高亮弹幕", e);
        return [];
      }
    }
    loadLocalDm(xml, append) {
      let doc = new DOMParser().parseFromString(xml, "application/xml");
      let dm = doc.querySelectorAll("d");
      if (dm.length == 0) {
        toast.warning("从弹幕文件中没有获取到任何弹幕！");
        return;
      }
      let danmaku2 = [];
      let attr, v, mode;
      for (let i = 0; i < dm.length; i++) {
        v = dm[i];
        attr = v.getAttribute("p").split(",");
        mode = parseInt(attr[1]);
        danmaku2[i] = {
          class: parseInt(attr[5]),
          color: parseInt(attr[3]),
          date: parseInt(attr[4]),
          dmid: attr[7],
          mode,
          size: parseInt(attr[2]),
          stime: parseFloat(attr[0]),
          text: mode != 8 && mode != 9 ? v.textContent.replace(/(\\/n|\\\\n|\\n|\\r\\n)/g, "\\n") : v.textContent,
          uid: attr[6]
        };
      }
      this.sortDmById(danmaku2, "dmid");
      if (!window.player?.setDanmaku)
        return toast.error("刷新弹幕列表失败：播放器内部调用丢失！");
      window.player?.setDanmaku(danmaku2, append);
    }
    async getHistoryDanmaku(date, cid = API.cid) {
      if (!date || !uid)
        return;
      let dm = await xhr({
        url: objUrl("https://api.bilibili.com/x/v2/dm/web/history/seg.so", {
          type: String(1),
          oid: String(cid),
          date
        }),
        responseType: "arraybuffer",
        credentials: true
      });
      return this.segDmDecode(dm);
    }
    saveDanmaku(dm, fileName) {
      let data = setting.danmakuSaveType === "xml" ? this.toXml(dm) : JSON.stringify(dm, void 0, "	");
      saveAs(data, \`\${fileName || API.title || API.cid}\${setting.danmakuSaveType === "xml" ? ".xml" : ".json"}\`);
    }
  };
  var danmaku = new Danmaku();
  window.addEventListener("message", async (ev) => {
    if (typeof ev.data === "object") {
      if (ev.data.\$type == "onlineDanmaku") {
        if (!window.player)
          return toast.warning("请在播放页面使用本功能 →_→");
        if (!window.player.setDanmaku)
          return toast.warning("内部组件丢失！", "请检查【托管原生脚本】功能是否开启！");
        if (!ev.data.url)
          return toast.warning("请输入视频链接或参数~");
        toast.info(\`正在解析url：\${ev.data.url}\`);
        try {
          const d = await urlParam(ev.data.url, false);
          if (d.aid && d.cid) {
            toast.info("参数解析成功，正在获取弹幕数据~", d);
            debug(ev.data.url, d);
            let dm = await danmaku.getSegDanmaku(d.aid, d.cid);
            if (dm) {
              const dat = danmaku.danmakuFormat(dm);
              toast.success("获取弹幕成功~");
              window.player?.setDanmaku(dat, setting.danmakuContact);
              setting.downloadOther && pushDownload({
                group: "弹幕",
                data: dat,
                up: "在线",
                down: \`N/A\`,
                callback: () => danmaku.saveDanmaku(dat, ev.data.url)
              });
            } else {
              toast.error("获取弹幕失败，请在控制台检查原因~");
            }
          } else {
            toast.warning("提取弹幕参数失败，请检查输入~");
          }
        } catch (e) {
          toast.error("在线弹幕", e);
          debug.error("在线弹幕", e);
        }
      }
      if (typeof ev.data === "object") {
        if (ev.data.\$type == "localMedia") {
          fileRead(".mp4,.json", true).then((d) => {
            d && new LocalMedia(d);
          });
        }
      }
      if (ev.data.\$type == "allDanmaku") {
        allDanmaku();
      }
    }
  });

  // src/runtime/hook/xhr.ts
  var rules = [];
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(...rest) {
    const args = [...rest];
    args[1] && rules.forEach((d) => {
      d && d[0].every((d2) => args[1].includes(d2)) && d[1].call(this, args);
    });
    return open.call(this, ...args);
  };
  function xhrhook(url, modifyOpen, modifyResponse, once = true) {
    let id;
    const one = Array.isArray(url) ? url : [url];
    const two = function(args) {
      once && id && delete rules[id - 1];
      if (modifyOpen)
        try {
          modifyOpen(args);
        } catch (e) {
          debug.error("modifyOpen of xhrhook", one, e);
        }
      if (modifyResponse)
        try {
          this.addEventListener("readystatechange", () => {
            try {
              if (this.readyState === 4) {
                const response = { response: this.response, responseType: this.responseType, status: this.status, statusText: this.statusText };
                (this.responseType === "" || this.responseType === "text") && (response.responseText = this.responseText);
                (this.responseType === "" || this.responseType === "document") && (response.responseXML = this.responseXML);
                modifyResponse(response);
                Object.defineProperty(this, "response", { configurable: true, value: response.response });
                response.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: response.responseText });
                response.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: response.responseXML });
              }
            } catch (e) {
              debug.error("modifyResponse of xhrhook", one, e);
            }
          });
        } catch (e) {
          debug.error("modifyResponse of xhrhook", one, e);
        }
    };
    return id = rules.push([one, two]);
  }
  function xhrhookAsync(url, condition, modifyResponse, once = true) {
    let id, temp2;
    const one = Array.isArray(url) ? url : [url];
    const two = function(args) {
      try {
        if (!condition || condition(args)) {
          this.xhrhookTimes = this.xhrhookTimes ? this.xhrhookTimes++ : 1;
          id && (temp2 = rules[id - 1]);
          delete rules[id - 1];
          this.send = () => true;
          (!args[2] || args[2] === true) && (this.timeout = 0);
          const et = setInterval(() => {
            this.dispatchEvent(new ProgressEvent("progress"));
          }, 50);
          Object.defineProperty(this, "status", { configurable: true, value: 200 });
          Object.defineProperty(this, "readyState", { configurable: true, value: 2 });
          this.dispatchEvent(new ProgressEvent("readystatechange"));
          modifyResponse ? modifyResponse(args, this.responseType).then((d) => {
            clearInterval(et);
            if (d) {
              Object.defineProperty(this, "response", { configurable: true, value: d.response });
              d.responseType && Object.defineProperty(this, "responseType", { configurable: true, value: d.responseType });
              d.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
              d.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
              !this.responseURL && Object.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
              Object.defineProperty(this, "readyState", { configurable: true, value: 4 });
              this.dispatchEvent(new ProgressEvent("readystatechange"));
              this.dispatchEvent(new ProgressEvent("load"));
              this.dispatchEvent(new ProgressEvent("loadend"));
            }
          }).catch((d) => {
            if (this.xhrhookTimes === 1) {
              if (d && d.response) {
                Object.defineProperty(this, "response", { configurable: true, value: d.response });
                d.responseType && Object.defineProperty(this, "responseType", { configurable: true, value: d.responseType });
                d.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                d.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                !this.responseURL && Object.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                Object.defineProperty(this, "readyState", { configurable: true, value: 4 });
                this.dispatchEvent(new ProgressEvent("readystatechange"));
                this.dispatchEvent(new ProgressEvent("load"));
                this.dispatchEvent(new ProgressEvent("loadend"));
              } else {
                this.dispatchEvent(new ProgressEvent("error"));
              }
            } else {
              this.xhrhookTimes--;
            }
            debug.error("modifyResponse of xhrhookasync", one, d);
          }).finally(() => {
            clearInterval(et);
            !once && (id = rules.push(temp2));
          }) : (this.abort(), !once && (id = rules.push(temp2)));
          clearInterval(et);
        }
      } catch (e) {
        debug.error("condition of xhrhook", one, e);
      }
    };
    return id = rules.push([one, two]);
  }
  function removeXhrhook(id) {
    id >= 0 && delete rules[id - 1];
  }

  // src/runtime/danmaku/history_danmaku.ts
  function historyDanmaku() {
    const id = xhrhookAsync("history?type=", (args) => {
      const param2 = urlObj(args[1]);
      if (!window.player?.setDanmaku) {
        removeXhrhook(id);
        return false;
      } else if (!param2.date)
        return false;
      xhr({
        url: \`https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=\${API.cid}&date=\${param2.date}\`,
        responseType: "arraybuffer",
        credentials: true
      }).then((seg) => {
        let dm = danmaku.danmakuFormat(danmaku.segDmDecode(seg));
        window.player?.setDanmaku(dm);
        setting.downloadOther && pushDownload({
          group: "弹幕",
          data: dm,
          up: "历史",
          down: \`N/A\`,
          callback: () => danmaku.saveDanmaku(dm, \`\${API.title || API.cid}\`)
        });
      }).catch((e) => {
        toast.error("载入历史弹幕失败", "请尝试刷新页面");
        toast.error(e);
      });
      return true;
    }, void 0, false);
  }

  // src/runtime/danmaku/bilibili_broadcast.json
  var bilibili_broadcast_default = {
    nested: {
      bilibili: {
        nested: {
          broadcast: {
            nested: {
              v1: {
                nested: {
                  AuthReq: {
                    fields: {
                      guid: {
                        type: "string",
                        id: 1
                      },
                      connId: {
                        type: "string",
                        id: 2
                      },
                      lastMsgId: {
                        type: "int64",
                        id: 3
                      }
                    }
                  },
                  AuthResp: {
                    fields: {}
                  },
                  HeartbeatReq: {
                    fields: {}
                  },
                  HeartbeatResp: {
                    fields: {}
                  },
                  TargetPath: {
                    fields: {
                      targetPaths: {
                        rule: "repeated",
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  MessageAckReq: {
                    fields: {
                      ackId: {
                        type: "int64",
                        id: 1
                      },
                      ackOrigin: {
                        type: "string",
                        id: 2
                      },
                      targetPath: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  Subscribe: {
                    fields: {
                      type: {
                        type: "string",
                        id: 1
                      },
                      targetPaths: {
                        rule: "repeated",
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  Status: {
                    fields: {
                      code: {
                        type: "int32",
                        id: 1
                      },
                      message: {
                        type: "string",
                        id: 2
                      },
                      details: {
                        rule: "repeated",
                        type: "google.protobuf.Any",
                        id: 3
                      }
                    }
                  },
                  FrameOption: {
                    fields: {
                      messageId: {
                        type: "int64",
                        id: 1
                      },
                      sequence: {
                        type: "int64",
                        id: 2
                      },
                      isAck: {
                        type: "bool",
                        id: 3
                      },
                      status: {
                        type: "Status",
                        id: 4
                      },
                      ackOrigin: {
                        type: "string",
                        id: 5
                      }
                    }
                  },
                  BroadcastFrame: {
                    fields: {
                      options: {
                        type: "FrameOption",
                        id: 1
                      },
                      targetPath: {
                        type: "string",
                        id: 2
                      },
                      body: {
                        type: "google.protobuf.Any",
                        id: 3
                      }
                    }
                  },
                  RoomJoinEvent: {
                    fields: {}
                  },
                  RoomLeaveEvent: {
                    fields: {}
                  },
                  RoomOnlineEvent: {
                    fields: {
                      online: {
                        type: "int32",
                        id: 1
                      },
                      allOnline: {
                        type: "int32",
                        id: 2
                      }
                    }
                  },
                  RoomMessageEvent: {
                    fields: {
                      targetPath: {
                        type: "string",
                        id: 1
                      },
                      body: {
                        type: "google.protobuf.Any",
                        id: 2
                      }
                    }
                  },
                  RoomErrorEvent: {
                    fields: {
                      status: {
                        type: "Status",
                        id: 1
                      }
                    }
                  },
                  RoomReq: {
                    oneofs: {
                      event: {
                        oneof: [
                          "join",
                          "leave",
                          "online",
                          "msg"
                        ]
                      }
                    },
                    fields: {
                      id: {
                        type: "string",
                        id: 1
                      },
                      join: {
                        type: "RoomJoinEvent",
                        id: 2
                      },
                      leave: {
                        type: "RoomLeaveEvent",
                        id: 3
                      },
                      online: {
                        type: "RoomOnlineEvent",
                        id: 4
                      },
                      msg: {
                        type: "RoomMessageEvent",
                        id: 5
                      }
                    }
                  },
                  RoomResp: {
                    oneofs: {
                      event: {
                        oneof: [
                          "join",
                          "leave",
                          "online",
                          "msg",
                          "err"
                        ]
                      }
                    },
                    fields: {
                      id: {
                        type: "string",
                        id: 1
                      },
                      join: {
                        type: "RoomJoinEvent",
                        id: 2
                      },
                      leave: {
                        type: "RoomLeaveEvent",
                        id: 3
                      },
                      online: {
                        type: "RoomOnlineEvent",
                        id: 4
                      },
                      msg: {
                        type: "RoomMessageEvent",
                        id: 5
                      },
                      err: {
                        type: "RoomErrorEvent",
                        id: 6
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      google: {
        nested: {
          protobuf: {
            nested: {
              Any: {
                fields: {
                  type_url: {
                    type: "string",
                    id: 1
                  },
                  value: {
                    type: "bytes",
                    id: 2
                  }
                }
              },
              Empty: {
                fields: {}
              }
            }
          }
        }
      }
    }
  };

  // src/runtime/danmaku/bilibili_broadcast_danmaku.json
  var bilibili_broadcast_danmaku_default = {
    nested: {
      bilibili: {
        nested: {
          broadcast: {
            nested: {
              message: {
                nested: {
                  main: {
                    nested: {
                      DanmakuElem: {
                        fields: {
                          id: {
                            type: "int64",
                            id: 1
                          },
                          progress: {
                            type: "int32",
                            id: 2
                          },
                          mode: {
                            type: "int32",
                            id: 3
                          },
                          fontsize: {
                            type: "int32",
                            id: 4
                          },
                          color: {
                            type: "uint32",
                            id: 5
                          },
                          midHash: {
                            type: "string",
                            id: 6
                          },
                          content: {
                            type: "string",
                            id: 7
                          },
                          ctime: {
                            type: "int64",
                            id: 8
                          },
                          action: {
                            type: "string",
                            id: 9
                          },
                          pool: {
                            type: "int32",
                            id: 10
                          },
                          idStr: {
                            type: "string",
                            id: 11
                          }
                        }
                      },
                      DanmukuEvent: {
                        fields: {
                          elems: {
                            rule: "repeated",
                            type: "DanmakuElem",
                            id: 1
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  // src/runtime/danmaku/live_danmaku.ts
  var import_light2 = __toESM(require_light());
  var root2 = import_light2.default.Root.fromJSON(bilibili_broadcast_default);
  var danmakuElem = import_light2.default.Root.fromJSON(bilibili_broadcast_danmaku_default).lookupType("bilibili.broadcast.message.main.DanmukuEvent");
  var sequence = 1;
  var message = {
    msgType: root2.lookupType("BroadcastFrame"),
    targetPathType: root2.lookupType("TargetPath"),
    beatReqType: root2.lookupType("HeartbeatReq"),
    ackReqType: root2.lookupType("MessageAckReq"),
    anyType: root2.lookupType("google.protobuf.Any"),
    roomRequest: root2.lookupType("RoomReq"),
    roomResp: root2.lookupType("RoomResp"),
    roomEvents: {
      join: root2.lookupType("RoomJoinEvent"),
      leave: root2.lookupType("RoomLeaveEvent"),
      online: root2.lookupType("RoomOnlineEvent")
    }
  };
  var targetPath = {
    "AUTH": "/bilibili.broadcast.v1.Broadcast/Auth",
    "HEARTBEAT": "/bilibili.broadcast.v1.Broadcast/Heartbeat",
    "SUBSCRIBE": "/bilibili.broadcast.v1.Broadcast/Subscribe",
    "UNSUBSCRIBE": "/bilibili.broadcast.v1.Broadcast/Unsubscribe",
    "MSG_ACK": "/bilibili.broadcast.v1.Broadcast/MessageAck",
    "ENTER": "/bilibili.broadcast.v1.BroadcastRoom/Enter",
    "ROOMREQ": "/bilibili.broadcast.v1.RoomReq",
    "ROOMRES": "/bilibili.broadcast.v1.RoomResp",
    "AUTHREQ": "/bilibili.broadcast.v1.AuthReq",
    "TARGETPATH": "/bilibili.broadcast.v1.TargetPath",
    "HEARTBEATRES": "/bilibili.broadcast.v1.HeartbeatResp",
    "MSG_ACK_REQ": "/bilibili.broadcast.v1.MessageAckReq"
  };
  var utils = {
    encodeAny: function(body, encoder2, url) {
      return url = "type.googleapis.com" + url, message.anyType.create({
        type_url: url,
        value: encoder2.encode(body).finish()
      });
    },
    toBuffer: function(body, encoder2) {
      if (encoder2.verify(body))
        return "";
      let t = encoder2.create(body);
      return encoder2.encode(t).finish();
    },
    toMsg: function(body, decoder) {
      let t;
      try {
        t = decoder.toObject(decoder.decode(new Uint8Array(body)));
      } catch (i) {
        debug.error(i);
      }
      return t;
    }
  };
  var encoder = new TextEncoder();
  var liveChatOld;
  var liveChat;
  var wsHookRunOnce = true;
  var wssend = WebSocket.prototype.send;
  function initLiveChat() {
    liveChat = new WebSocket("wss://broadcast.chat.bilibili.com:7826/sub?platform=web", "proto");
    liveChat.binaryType = "arraybuffer";
    liveChat.beatTimer = 0;
    liveChat.msgFlag = {};
    liveChat.socketKey = "video://" + API.aid + "/" + API.cid;
    API.pgc && (liveChat.socketKey += "?sid=" + API.__INITIAL_STATE__.ssId + "&epid=" + API.__INITIAL_STATE__.epId);
    liveChat.sendMsg = function(body, encoder2) {
      void 0 === encoder2 && (encoder2 = message.msgType);
      this.send(utils.toBuffer(body, encoder2));
    };
    liveChat.auth = function() {
      this.sendMsg({
        options: {
          sequence: ++sequence
        },
        targetPath: targetPath.AUTH,
        body: utils.encodeAny(message.anyType.create({}), message.anyType, targetPath.AUTHREQ)
      });
    };
    liveChat.onAuthed = function(t) {
      this.authed = true;
      this.subscribeBase(["bilibili.broadcast.message.main.DanmukuEvent"]);
      this.roomBase(liveChat.socketKey);
    };
    liveChat.subscribeBase = function(t, e) {
      if (void 0 === e && (e = true), t && t.length) {
        var i = ++sequence;
        this.msgFlag[i] = t, this.sendMsg({
          options: {
            sequence: i
          },
          targetPath: e ? targetPath.SUBSCRIBE : targetPath.UNSUBSCRIBE,
          body: utils.encodeAny(message.targetPathType.create({
            targetPaths: t
          }), message.targetPathType, targetPath.TARGETPATH)
        });
      }
    };
    liveChat.roomBase = function(t) {
      let event = {
        id: t,
        join: message.roomEvents.join.create({})
      };
      var i = ++sequence;
      this.msgFlag[i] = t, this.sendMsg({
        options: {
          sequence: i
        },
        targetPath: targetPath.ENTER,
        body: utils.encodeAny(message.roomRequest.create(event), message.roomRequest, targetPath.ROOMREQ)
      });
    };
    liveChat.onRoomMsg = function(t) {
      var e, i;
      if (null === (e = t.body) || void 0 === e ? void 0 : e.value) {
        var o = utils.toMsg(t.body.value, message.roomResp);
        if (null === (i = o.msg) || void 0 === i ? void 0 : i.targetPath) {
          var r = utils.toMsg(o.msg.body.value, danmakuElem);
          r.elems.forEach(function(v) {
            liveChatOld.onmessage({
              data: liveChatOld.convertToArrayBuffer({
                cmd: "DM",
                info: [[v.progress / 1e3, v.mode, v.fontsize, v.color, v.ctime, "", v.pool, v.midHash, v.idStr].join(","), v.content]
              }, 5)
            });
          });
        }
      }
    };
    liveChat.heartBeat = function() {
      var i = this;
      this.beatTimer && clearTimeout(this.beatTimer);
      this.beatTimer = window.setTimeout(function() {
        if (i.readyState === 1) {
          i.sendMsg({
            options: {
              sequence: ++sequence
            },
            targetPath: targetPath.HEARTBEAT,
            body: utils.encodeAny(message.beatReqType.create({}), message.beatReqType, targetPath.HEARTBEATRES)
          });
          i.heartBeat();
        }
      }, 1e3 * 20);
    };
    liveChat.onopen = function() {
      this.auth();
    };
    liveChat.onclose = function() {
      if (liveChatOld.readyState === 1) {
        initLiveChat();
      } else {
        this.beatTimer && clearTimeout(this.beatTimer);
      }
    };
    liveChat.onmessage = function(i) {
      var t, a = utils.toMsg(i.data, message.msgType);
      if (this.heartBeat(), a) {
        if (null == a ? void 0 : a.targetPath)
          switch (a.targetPath) {
            case targetPath.AUTH:
              this.onAuthed(a);
              break;
            case targetPath.SUBSCRIBE:
              break;
            case targetPath.UNSUBSCRIBE:
              break;
            case targetPath.HEARTBEAT:
              break;
            case targetPath.ENTER:
              this.onRoomMsg(a);
              break;
            default:
          }
        delete this.msgFlag[null === (t = a.options) || void 0 === t ? void 0 : t.sequence];
      }
    };
  }
  function liveDanmaku() {
    WebSocket.prototype.send = function(...arg) {
      if (wsHookRunOnce && this.url == "wss://broadcast.chat.bilibili.com:4095/sub") {
        liveChatOld = this;
        liveChatOld.convertToArrayBuffer = function(body, option) {
          let header2 = [{ "name": "Header Length", "key": "headerLen", "qg": 2, "offset": 4, "value": 16 }, { "name": "Protocol Version", "key": "ver", "qg": 2, "offset": 6, "value": 1 }, { "name": "Operation", "key": "op", "qg": 4, "offset": 8, "value": option }, { "name": "Sequence Id", "key": "seq", "qg": 4, "offset": 12, "value": 1 }];
          let headerBuf = new ArrayBuffer(16);
          let viewer = new DataView(headerBuf, 0);
          let bodyBuf = encoder.encode(JSON.stringify(body));
          viewer.setInt32(0, 16 + bodyBuf.byteLength);
          header2.forEach(function(b) {
            4 === b.qg ? viewer.setInt32(b.offset, b.value) : 2 === b.qg && viewer.setInt16(b.offset, b.value);
          });
          function mergeArrayBuffer(headerBuf2, bodyBuf2) {
            headerBuf2 = new Uint8Array(headerBuf2);
            bodyBuf2 = new Uint8Array(bodyBuf2);
            var d = new Uint8Array(headerBuf2.byteLength + bodyBuf2.byteLength);
            d.set(headerBuf2, 0);
            d.set(bodyBuf2, headerBuf2.byteLength);
            return d.buffer;
          }
          return mergeArrayBuffer(headerBuf, bodyBuf);
        };
        let onclose = liveChatOld.onclose;
        liveChatOld.onclose = function() {
          wsHookRunOnce = true;
          clearTimeout(liveChat.beatTimer);
          liveChat.close();
          onclose.call(this);
        };
        wsHookRunOnce = false;
        initLiveChat();
      }
      wssend.call(this, ...arg);
    };
  }

  // src/runtime/danmaku/protobuf_danmaku.ts
  function loadDanmakuEngine() {
    if (setting.protobufDanmaku) {
      let workerPostMsg = Worker.prototype.postMessage;
      let list_so;
      Worker.prototype.postMessage = function(aMessage, transferList) {
        if (aMessage.url && aMessage.url.includes("list.so")) {
          const obj = urlObj(aMessage.url);
          list_so = this;
          let triggerOnMsg = (danmaku2, loadTime, parseTime) => list_so.onmessage({
            data: {
              code: 0,
              danmakuArray: danmaku2,
              loadTime,
              parseTime,
              sendTip: "",
              state: 0,
              textSide: "",
              total: danmaku2.length.toString()
            }
          });
          let loadDanmaku = (loadTime) => danmaku.getSegDanmaku(void 0, obj.oid).then((Segments) => {
            loadTime = new Date() - loadTime;
            let parseTime = new Date();
            let Dm = danmaku.danmakuFormat(Segments);
            parseTime = new Date() - parseTime;
            triggerOnMsg(Dm, loadTime, parseTime);
            setting.downloadOther && pushDownload({
              group: "弹幕",
              data: Dm,
              up: "当前",
              down: \`N/A\`,
              callback: () => danmaku.saveDanmaku(Dm, \`\${API.title || API.cid}\`)
            });
          });
          loadDanmaku(new Date());
        } else {
          workerPostMsg.call(this, aMessage, transferList);
        }
      };
    }
    historyDanmaku();
    liveDanmaku();
  }

  // src/runtime/hook/keymap.ts
  var bindMap = {};
  var isTyping = () => {
    const { activeElement } = document;
    if (!activeElement) {
      return false;
    }
    if (activeElement.hasAttribute("contenteditable")) {
      return true;
    }
    return ["input", "textarea"].includes(activeElement.nodeName.toLowerCase());
  };
  doWhile(() => document.body, (d) => {
    d.addEventListener("keydown", (e) => {
      if (isTyping())
        return;
      const key = e.key.toLowerCase();
      e.key && bindMap[key] && bindMap[key].forEach((d2) => {
        let disable = d2.disable;
        Number(d2.altKey) ^ Number(e.altKey) && (disable = true);
        Number(d2.ctrlKey) ^ Number(e.ctrlKey) && (disable = true);
        Number(d2.metaKey) ^ Number(e.metaKey) && (disable = true);
        Number(d2.repeat) ^ Number(e.repeat) && (disable = true);
        Number(d2.shiftKey) ^ Number(e.shiftKey) && (disable = true);
        try {
          !disable && d2.callback();
        } catch (e2) {
          debug.error("keymap.js", e2);
        }
      });
    });
  });
  function bindKeyMap(key, callback, special = {}) {
    const keyl = key.toLowerCase();
    const map = Object.assign(special, { callback, disable: false });
    bindMap[keyl] ? bindMap[keyl].push(map) : bindMap[keyl] = [map];
    return function changeKeyMap(disable) {
      if (arguments.length) {
        map.disable = disable;
      } else {
        map.disable = !map.disable;
      }
    };
  }

  // src/runtime/player/player_key_map.ts
  function playerKeyMap() {
    bindKeyMap("F", () => {
      document.querySelector(".icon-24fullscreen")?.click();
    });
    bindKeyMap("D", () => {
      document.querySelector(".bilibili-player-video-btn-danmaku")?.click();
    });
    bindKeyMap("[", () => {
      window.player.prev();
    });
    bindKeyMap("]", () => {
      window.player.next();
    });
    bindKeyMap("enter", () => {
      document.querySelector(".bilibili-player-video-danmaku-input")?.select();
    });
    bindKeyMap("V", () => {
      let video = document.querySelector("#bilibiliPlayer .bilibili-player-video video");
      if (video) {
        let filter = video.style.filter;
        if (filter.includes("contrast")) {
          filter = filter.replace("contrast(1)", "");
          setting.videoDisableAA = false;
        } else {
          filter += "contrast(1)";
          setting.videoDisableAA = true;
        }
        video.style.filter = filter;
      }
    });
  }

  // src/runtime/player/media_meta.ts
  var temp;
  function mediaSession(data) {
    Promise.resolve().then(() => window.GrayManager.setActionHandler());
    const check2 = JSON.stringify(data);
    if (temp === check2)
      return;
    temp = check2;
    if (!navigator.mediaSession.metadata)
      navigator.mediaSession.metadata = new MediaMetadata({ ...data });
    else {
      navigator.mediaSession.metadata.title = data.title;
      navigator.mediaSession.metadata.artist = data.artist;
      navigator.mediaSession.metadata.album = data.album;
      navigator.mediaSession.metadata.artwork = data.artwork;
    }
  }
  function setMediaSession() {
    const epid = API.epid;
    const aid = API.aid;
    xhr({
      url: \`https://api.bilibili.com/x/article/cards?ids=av\${aid}\`,
      responseType: "json"
    }, true).then((d) => {
      if (d.data[\`av\${aid}\`]) {
        mediaSession({
          title: d.data[\`av\${aid}\`].title,
          artist: d.data[\`av\${aid}\`].owner.name,
          album: epid ? \`ep\${epid}\` : \`av\${aid}\`,
          artwork: [
            { src: d.data[\`av\${aid}\`].pic }
          ]
        });
        API.cover = d.data[\`av\${aid}\`].pic;
        API.title = d.data[\`av\${aid}\`].title;
      }
    }).catch((e) => {
      debug.error("MediaSession", e);
    });
  }

  // src/runtime/player/automate.ts
  function bofqiToView() {
    let str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
    let node2 = str.reduce((s, d) => {
      s = s || document.querySelector(d);
      return s;
    }, document.querySelector("#__bofqi"));
    node2 && node2.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function automate() {
    switchVideo(() => {
      setting.automate.webFullScreen && doWhile(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => document.querySelector(".bilibili-player-video-web-fullscreen").click());
      setting.automate.noDanmaku && doWhile(() => document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku"), (d) => {
        !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off") && d.click();
      });
      setting.videoDisableAA && doWhile(() => document.querySelector("#bilibiliPlayer .bilibili-player-video video"), (d) => d.style.filter += "contrast(1)");
      setTimeout(() => {
        setting.automate.showBofqi && bofqiToView();
      }, 500);
      setMediaSession();
    });
    setting.automate.danmakuFirst && sessionStorage2.setItem("player_last_filter_tab_info", 4);
    let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
    if (bilibili_player_settings) {
      if (bilibili_player_settings.video_status?.autopart !== "") {
        GM.setValue("bilibili_player_settings", bilibili_player_settings);
      }
    } else {
      if (isUserScript) {
        const d = GM_getValue("bilibili_player_settings");
        d && localStorage.setItem("bilibili_player_settings", d);
      } else {
        GM.getValue("bilibili_player_settings").then((d) => {
          d && localStorage.setItem("bilibili_player_settings", d);
        });
      }
    }
    if (setting.automate.videospeed) {
      if (isUserScript) {
        const videospeed = GM_getValue("videospeed");
        if (videospeed) {
          let setting2 = sessionStorage2.getItem("bilibili_player_settings");
          setting2 ? setting2.video_status ? setting2.video_status.videospeed = videospeed : setting2.video_status = { videospeed } : setting2 = { video_status: { videospeed } };
          sessionStorage2.setItem("bilibili_player_settings", setting2);
        }
      } else {
        GM.getValue("videospeed").then((videospeed) => {
          if (videospeed) {
            let setting2 = sessionStorage2.getItem("bilibili_player_settings");
            setting2 ? setting2.video_status ? setting2.video_status.videospeed = videospeed : setting2.video_status = { videospeed } : setting2 = { video_status: { videospeed } };
            sessionStorage2.setItem("bilibili_player_settings", setting2);
          }
        });
      }
      switchVideo(() => {
        doWhile(() => document.querySelector("#bofqi")?.querySelector("video"), (d) => {
          d.addEventListener("ratechange", (e) => {
            GM.setValue("videospeed", e.target.playbackRate || 1);
          });
        });
      });
    }
  }

  // src/runtime/player/bgray_btn.html
  var bgray_btn_default = '<style type="text/css">\\r\\n    .movie_play {\\r\\n        overflow: visible;\\r\\n    }\\r\\n\\r\\n    .movie_play .bgray-btn-wrap {\\r\\n        top: -10px;\\r\\n    }\\r\\n\\r\\n    #bofqi {\\r\\n        box-shadow: 0 0 0;\\r\\n    }\\r\\n\\r\\n    .player-wrapper {\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .player-fullscreen-fix {\\r\\n        position: fixed;\\r\\n        top: 0;\\r\\n        left: 0;\\r\\n        margin: 0;\\r\\n        padding: 0;\\r\\n        width: 100%;\\r\\n        height: 100%;\\r\\n    }\\r\\n\\r\\n    .player-fullscreen-fix #bofqi .player {\\r\\n        position: fixed !important;\\r\\n        border-radius: 0;\\r\\n        z-index: 100000 !important;\\r\\n        left: 0;\\r\\n        top: 0;\\r\\n        width: 100% !important;\\r\\n        height: 100% !important;\\r\\n    }\\r\\n\\r\\n    .bgray-btn-wrap {\\r\\n        position: absolute;\\r\\n        top: 10px;\\r\\n        left: 50%;\\r\\n        margin-left: 490px;\\r\\n        width: 70px;\\r\\n        height: 200px;\\r\\n    }\\r\\n\\r\\n    .widescreen .bgray-btn-wrap {\\r\\n        margin-left: 580px;\\r\\n    }\\r\\n\\r\\n    .bgray-btn {\\r\\n        transition: all 0.3s;\\r\\n        cursor: pointer;\\r\\n        margin: 10px 0;\\r\\n        background-color: #fff;\\r\\n        text-align: center;\\r\\n        padding: 7px 5px;\\r\\n        display: block;\\r\\n        left: 100%;\\r\\n        font-size: 12px;\\r\\n        line-height: 12px;\\r\\n        margin-left: 10px;\\r\\n        width: 20px;\\r\\n        border-radius: 4px;\\r\\n        border: 1px solid #e5e9ef;\\r\\n        color: #99a2aa;\\r\\n    }\\r\\n\\r\\n    .bgray-btn-feedback {\\r\\n        height: 72px;\\r\\n        margin-bottom: 5px;\\r\\n    }\\r\\n\\r\\n    .bgray-btn-help {\\r\\n        height: 24px;\\r\\n        margin-top: 5px;\\r\\n    }\\r\\n\\r\\n    .bgray-btn:hover {\\r\\n        color: #6d757a;\\r\\n        border-color: #6d757a;\\r\\n    }\\r\\n\\r\\n    .bgray-btn.player-feedback-disable {\\r\\n        color: #ccd0d7\\r\\n    }\\r\\n\\r\\n    .bgray-btn.player-feedback-disable:hover {\\r\\n        color: #ccd0d7;\\r\\n        border-color: #ccd0d7;\\r\\n    }\\r\\n\\r\\n    .bgray-btn.player-feedback-disable {\\r\\n        color: #ccd0d7\\r\\n    }\\r\\n\\r\\n    .bgray-btn.player-feedback-disable:hover {\\r\\n        color: #ccd0d7;\\r\\n        border-color: #ccd0d7;\\r\\n    }\\r\\n\\r\\n    .bgray-btn.active {\\r\\n        cursor: default;\\r\\n        color: #00a1d6;\\r\\n        border-color: #00a1d6;\\r\\n    }\\r\\n\\r\\n    .bgray-line {\\r\\n        display: none;\\r\\n        width: 42px;\\r\\n        margin: 0 auto;\\r\\n        border-bottom: 1px solid #e5e9ef;\\r\\n    }\\r\\n\\r\\n    .bgray-btn {\\r\\n        display: none;\\r\\n    }\\r\\n\\r\\n    .bgray-btn.show {\\r\\n        display: block;\\r\\n    }\\r\\n\\r\\n    @media screen and (min-width: 1400px) {\\r\\n        .bgray-btn-wrap {\\r\\n            margin-left: 580px;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    .bgray-btn.happyfoolsday {\\r\\n        line-height: 13px;\\r\\n        background-color: #00a1d6;\\r\\n        border-color: #00a1d6;\\r\\n        color: #fff;\\r\\n    }\\r\\n\\r\\n    .bgray-btn.happyfoolsday:hover {\\r\\n        background-color: #00b5e5;\\r\\n        border-color: #00b5e5;\\r\\n        color: #fff;\\r\\n    }\\r\\n</style>';

  // src/runtime/format/cht_2_chs.ts
  var aTC2SC = {
    "以功覆過": "以功复过",
    "侔德覆載": "侔德复载",
    "傷亡枕藉": "伤亡枕借",
    "出醜狼藉": "出丑狼借",
    "反反覆覆": "反反复复",
    "名覆金甌": "名复金瓯",
    "情有獨鍾": "情有独锺",
    "文錦覆阱": "文锦复阱",
    "於呼哀哉": "於呼哀哉",
    "旋乾轉坤": "旋乾转坤",
    "朝乾夕惕": "朝乾夕惕",
    "狐藉虎威": "狐借虎威",
    "瞭若指掌": "了若指掌",
    "老態龍鍾": "老态龙锺",
    "藉箸代籌": "借箸代筹",
    "藉草枕塊": "借草枕块",
    "藉藉无名": "藉藉无名",
    "衹見樹木": "只见树木",
    "覆蕉尋鹿": "复蕉寻鹿",
    "覆鹿尋蕉": "复鹿寻蕉",
    "覆鹿遺蕉": "复鹿遗蕉",
    "買臣覆水": "买臣复水",
    "踅門瞭戶": "踅门了户",
    "雁杳魚沈": "雁杳鱼沉",
    "顛乾倒坤": "颠乾倒坤",
    "乾清宮": "乾清宫",
    "乾盛世": "乾盛世",
    "八濛山": "八濛山",
    "千鍾粟": "千锺粟",
    "尼乾陀": "尼乾陀",
    "張法乾": "张法乾",
    "於世成": "於世成",
    "於仲完": "於仲完",
    "於其一": "於其一",
    "於勇明": "於勇明",
    "於崇文": "於崇文",
    "於忠祥": "於忠祥",
    "於惟一": "於惟一",
    "於梨華": "於梨华",
    "於清言": "於清言",
    "於竹屋": "於竹屋",
    "於陵子": "於陵子",
    "李乾德": "李乾德",
    "李澤鉅": "李泽钜",
    "李鍊福": "李链福",
    "李鍾郁": "李锺郁",
    "樊於期": "樊於期",
    "藉寇兵": "借寇兵",
    "覆醬瓿": "复酱瓿",
    "角徵羽": "角徵羽",
    "貂覆額": "貂复额",
    "郭子乾": "郭子乾",
    "錢鍾書": "钱锺书",
    "鍾萬梅": "锺万梅",
    "鍾重發": "锺重发",
    "麼些族": "麽些族",
    "黄鍾公": "黄锺公",
    "上鍊": "上链",
    "么麼": "幺麽",
    "么麽": "幺麽",
    "乾元": "乾元",
    "乾卦": "乾卦",
    "乾嘉": "乾嘉",
    "乾圖": "乾图",
    "乾坤": "乾坤",
    "乾宅": "乾宅",
    "乾斷": "乾断",
    "乾旦": "乾旦",
    "乾曜": "乾曜",
    "乾紅": "乾红",
    "乾綱": "乾纲",
    "乾縣": "乾县",
    "乾象": "乾象",
    "乾造": "乾造",
    "乾道": "乾道",
    "乾陵": "乾陵",
    "乾隆": "乾隆",
    "家俱": "家具",
    "傢具": "家具",
    "傢俱": "家具",
    "凌藉": "凌借",
    "函覆": "函复",
    "反覆": "反复",
    "哪吒": "哪吒",
    "哪咤": "哪吒",
    "回覆": "回复",
    "射覆": "射复",
    "幺麼": "幺麽",
    "康乾": "康乾",
    "彷彿": "仿佛",
    "徵弦": "徵弦",
    "徵絃": "徵弦",
    "徵聲": "徵声",
    "徵調": "徵调",
    "徵音": "徵音",
    "憑藉": "凭借",
    "手鍊": "手链",
    "拉鍊": "拉链",
    "拜覆": "拜复",
    "於乎": "於乎",
    "於倫": "於伦",
    "於則": "於则",
    "於單": "於单",
    "於坦": "於坦",
    "於戲": "於戏",
    "於敖": "於敖",
    "於琳": "於琳",
    "於穆": "於穆",
    "於菟": "於菟",
    "於邑": "於邑",
    "明瞭": "明了",
    "明覆": "明复",
    "木吒": "木吒",
    "木咤": "木吒",
    "沈沒": "沉没",
    "沈積": "沉积",
    "沈船": "沉船",
    "沈默": "沉默",
    "流徵": "流徵",
    "滑藉": "滑借",
    "牴牾": "抵牾",
    "牴觸": "抵触",
    "甚鉅": "甚钜",
    "申覆": "申复",
    "畢昇": "毕昇",
    "發覆": "发复",
    "瞭如": "了如",
    "瞭然": "了然",
    "瞭解": "了解",
    "示覆": "示复",
    "禀覆": "禀复",
    "答覆": "答复",
    "篤麼": "笃麽",
    "籌畫": "筹划",
    "素藉": "素借",
    "茵藉": "茵借",
    "萬鍾": "万锺",
    "蒜薹": "蒜薹",
    "蕓薹": "芸薹",
    "蕩覆": "荡复",
    "蕭乾": "萧乾",
    "藉代": "借代",
    "藉以": "借以",
    "藉助": "借助",
    "藉卉": "借卉",
    "藉口": "借口",
    "藉喻": "借喻",
    "藉手": "借手",
    "藉據": "借据",
    "藉故": "借故",
    "藉方": "借方",
    "藉條": "借条",
    "藉槁": "借槁",
    "藉機": "借机",
    "藉此": "借此",
    "藉甚": "借甚",
    "藉由": "借由",
    "藉著": "借着",
    "藉端": "借端",
    "藉藉": "借借",
    "藉詞": "借词",
    "藉讀": "借读",
    "藉資": "借资",
    "衹得": "只得",
    "覆上": "复上",
    "覆住": "复住",
    "覆信": "复信",
    "覆冒": "复冒",
    "覆呈": "复呈",
    "覆命": "复命",
    "覆墓": "复墓",
    "覆宗": "复宗",
    "覆帳": "复帐",
    "覆幬": "复帱",
    "覆成": "复成",
    "覆按": "复按",
    "覆文": "复文",
    "覆杯": "复杯",
    "覆校": "复校",
    "覆瓿": "复瓿",
    "覆盂": "复盂",
    "覆育": "复育",
    "覆逆": "复逆",
    "覆醢": "复醢",
    "覆電": "复电",
    "覆露": "复露",
    "覆鼎": "复鼎",
    "見覆": "见复",
    "角徵": "角徵",
    "計畫": "计划",
    "變徵": "变徵",
    "躪藉": "躏借",
    "酝藉": "酝借",
    "重覆": "重复",
    "金吒": "金吒",
    "金咤": "金吒",
    "金鍊": "金链",
    "鈕釦": "纽扣",
    "鈞覆": "钧复",
    "鉅子": "钜子",
    "鉅萬": "钜万",
    "鉅防": "钜防",
    "鉸鍊": "铰链",
    "銀鍊": "银链",
    "鍊墜": "链坠",
    "鍊子": "链子",
    "鍊形": "链形",
    "鍊條": "链条",
    "鍊錘": "链锤",
    "鍊鎖": "链锁",
    "鍛鍾": "锻锺",
    "鍾鍛": "锺锻",
    "鍾馗": "锺馗",
    "鎖鍊": "锁链",
    "鐵鍊": "铁链",
    "電覆": "电复",
    "露覆": "露复",
    "項鍊": "项链",
    "頗覆": "颇复",
    "頸鍊": "颈链",
    "顧藉": "顾借",
    "煞車": "刹车",
    "著": "着",
    "乾": "干",
    "儘": "尽",
    "劃": "划",
    "徵": "征",
    "於": "于",
    "瀋": "沈",
    "瀰": "弥",
    "畫": "画",
    "睪": "睾",
    "綵": "彩",
    "線": "线",
    "薹": "苔",
    "蘋": "苹",
    "襬": "摆",
    "託": "托",
    "諮": "咨",
    "鈕": "钮",
    "鉅": "巨",
    "鍾": "钟",
    "钁": "镢",
    "靦": "腼",
    "餘": "余",
    "麪": "面",
    "麴": "曲",
    "麵": "面",
    "麼": "么",
    "麽": "么",
    "開": "开",
    "噹": "当",
    "崙": "仑",
    "擣": "捣",
    "牴": "抵",
    "衹": "只",
    "諫": "谏",
    "譾": "谫",
    "買": "买",
    "閒": "闲",
    "願": "愿",
    "餬": "糊",
    "餱": "糇",
    "餵": "喂",
    "驄": "骢",
    "鵰": "雕",
    "齧": "啮",
    "鍊": "炼",
    "㑯": "㑔",
    "㑳": "㑇",
    "㑶": "㐹",
    "㓨": "刾",
    "㘚": "㘎",
    "㜄": "㚯",
    "㜏": "㛣",
    "㠏": "㟆",
    "㥮": "㤘",
    "㩜": "㨫",
    "㩳": "㧐",
    "䁻": "䀥",
    "䊷": "䌶",
    "䋙": "䌺",
    "䋚": "䌻",
    "䋹": "䌿",
    "䋻": "䌾",
    "䎱": "䎬",
    "䙡": "䙌",
    "䜀": "䜧",
    "䝼": "䞍",
    "䥇": "䦂",
    "䥱": "䥾",
    "䦛": "䦶",
    "䦟": "䦷",
    "䯀": "䯅",
    "䰾": "鲃",
    "䱷": "䲣",
    "䱽": "䲝",
    "䲁": "鳚",
    "䲘": "鳤",
    "䴉": "鹮",
    "丟": "丢",
    "並": "并",
    "亂": "乱",
    "亙": "亘",
    "亞": "亚",
    "佇": "伫",
    "佈": "布",
    "佔": "占",
    "併": "并",
    "來": "来",
    "侖": "仑",
    "侶": "侣",
    "侷": "局",
    "俁": "俣",
    "係": "系",
    "俔": "伣",
    "俠": "侠",
    "俥": "伡",
    "俬": "私",
    "倀": "伥",
    "倆": "俩",
    "倈": "俫",
    "倉": "仓",
    "個": "个",
    "們": "们",
    "倖": "幸",
    "倫": "伦",
    "倲": "㑈",
    "偉": "伟",
    "偑": "㐽",
    "側": "侧",
    "偵": "侦",
    "偽": "伪",
    "傌": "㐷",
    "傑": "杰",
    "傖": "伧",
    "傘": "伞",
    "備": "备",
    "傢": "家",
    "傭": "佣",
    "傯": "偬",
    "傳": "传",
    "傴": "伛",
    "債": "债",
    "傷": "伤",
    "傾": "倾",
    "僂": "偻",
    "僅": "仅",
    "僉": "佥",
    "僑": "侨",
    "僕": "仆",
    "僞": "伪",
    "僥": "侥",
    "僨": "偾",
    "僱": "雇",
    "價": "价",
    "儀": "仪",
    "儁": "俊",
    "儂": "侬",
    "億": "亿",
    "儈": "侩",
    "儉": "俭",
    "儐": "傧",
    "儔": "俦",
    "儕": "侪",
    "償": "偿",
    "優": "优",
    "儲": "储",
    "儷": "俪",
    "儸": "㑩",
    "儺": "傩",
    "儻": "傥",
    "儼": "俨",
    "兇": "凶",
    "兌": "兑",
    "兒": "儿",
    "兗": "兖",
    "內": "内",
    "兩": "两",
    "冊": "册",
    "冑": "胄",
    "冪": "幂",
    "凈": "净",
    "凍": "冻",
    "凜": "凛",
    "凱": "凯",
    "別": "别",
    "刪": "删",
    "剄": "刭",
    "則": "则",
    "剋": "克",
    "剎": "刹",
    "剗": "刬",
    "剛": "刚",
    "剝": "剥",
    "剮": "剐",
    "剴": "剀",
    "創": "创",
    "剷": "铲",
    "劇": "剧",
    "劉": "刘",
    "劊": "刽",
    "劌": "刿",
    "劍": "剑",
    "劏": "㓥",
    "劑": "剂",
    "劚": "㔉",
    "勁": "劲",
    "動": "动",
    "務": "务",
    "勛": "勋",
    "勝": "胜",
    "勞": "劳",
    "勢": "势",
    "勩": "勚",
    "勱": "劢",
    "勳": "勋",
    "勵": "励",
    "勸": "劝",
    "勻": "匀",
    "匭": "匦",
    "匯": "汇",
    "匱": "匮",
    "區": "区",
    "協": "协",
    "卹": "恤",
    "卻": "却",
    "卽": "即",
    "厙": "厍",
    "厠": "厕",
    "厤": "历",
    "厭": "厌",
    "厲": "厉",
    "厴": "厣",
    "參": "参",
    "叄": "叁",
    "叢": "丛",
    "吒": "咤",
    "吳": "吴",
    "吶": "呐",
    "呂": "吕",
    "咼": "呙",
    "員": "员",
    "唄": "呗",
    "唚": "吣",
    "唸": "念",
    "問": "问",
    "啓": "启",
    "啞": "哑",
    "啟": "启",
    "啢": "唡",
    "喎": "㖞",
    "喚": "唤",
    "喪": "丧",
    "喫": "吃",
    "喬": "乔",
    "單": "单",
    "喲": "哟",
    "嗆": "呛",
    "嗇": "啬",
    "嗊": "唝",
    "嗎": "吗",
    "嗚": "呜",
    "嗩": "唢",
    "嗶": "哔",
    "嘆": "叹",
    "嘍": "喽",
    "嘓": "啯",
    "嘔": "呕",
    "嘖": "啧",
    "嘗": "尝",
    "嘜": "唛",
    "嘩": "哗",
    "嘮": "唠",
    "嘯": "啸",
    "嘰": "叽",
    "嘵": "哓",
    "嘸": "呒",
    "嘽": "啴",
    "噁": "恶",
    "噓": "嘘",
    "噚": "㖊",
    "噝": "咝",
    "噠": "哒",
    "噥": "哝",
    "噦": "哕",
    "噯": "嗳",
    "噲": "哙",
    "噴": "喷",
    "噸": "吨",
    "嚀": "咛",
    "嚇": "吓",
    "嚌": "哜",
    "嚐": "尝",
    "嚕": "噜",
    "嚙": "啮",
    "嚥": "咽",
    "嚦": "呖",
    "嚨": "咙",
    "嚮": "向",
    "嚲": "亸",
    "嚳": "喾",
    "嚴": "严",
    "嚶": "嘤",
    "囀": "啭",
    "囁": "嗫",
    "囂": "嚣",
    "囅": "冁",
    "囈": "呓",
    "囉": "啰",
    "囌": "苏",
    "囑": "嘱",
    "囪": "囱",
    "圇": "囵",
    "國": "国",
    "圍": "围",
    "園": "园",
    "圓": "圆",
    "圖": "图",
    "團": "团",
    "垵": "埯",
    "埡": "垭",
    "埰": "采",
    "執": "执",
    "堅": "坚",
    "堊": "垩",
    "堖": "垴",
    "堝": "埚",
    "堯": "尧",
    "報": "报",
    "場": "场",
    "塊": "块",
    "塋": "茔",
    "塏": "垲",
    "塒": "埘",
    "塗": "涂",
    "塚": "冢",
    "塢": "坞",
    "塤": "埙",
    "塵": "尘",
    "塹": "堑",
    "墊": "垫",
    "墜": "坠",
    "墮": "堕",
    "墰": "坛",
    "墳": "坟",
    "墶": "垯",
    "墻": "墙",
    "墾": "垦",
    "壇": "坛",
    "壋": "垱",
    "壎": "埙",
    "壓": "压",
    "壘": "垒",
    "壙": "圹",
    "壚": "垆",
    "壜": "坛",
    "壞": "坏",
    "壟": "垄",
    "壠": "垅",
    "壢": "坜",
    "壩": "坝",
    "壯": "壮",
    "壺": "壶",
    "壼": "壸",
    "壽": "寿",
    "夠": "够",
    "夢": "梦",
    "夥": "伙",
    "夾": "夹",
    "奐": "奂",
    "奧": "奥",
    "奩": "奁",
    "奪": "夺",
    "奬": "奖",
    "奮": "奋",
    "奼": "姹",
    "妝": "妆",
    "姍": "姗",
    "姦": "奸",
    "娛": "娱",
    "婁": "娄",
    "婦": "妇",
    "婭": "娅",
    "媧": "娲",
    "媯": "妫",
    "媰": "㛀",
    "媼": "媪",
    "媽": "妈",
    "嫋": "袅",
    "嫗": "妪",
    "嫵": "妩",
    "嫺": "娴",
    "嫻": "娴",
    "嫿": "婳",
    "嬀": "妫",
    "嬃": "媭",
    "嬈": "娆",
    "嬋": "婵",
    "嬌": "娇",
    "嬙": "嫱",
    "嬡": "嫒",
    "嬤": "嬷",
    "嬪": "嫔",
    "嬰": "婴",
    "嬸": "婶",
    "孃": "娘",
    "孋": "㛤",
    "孌": "娈",
    "孫": "孙",
    "學": "学",
    "孿": "孪",
    "宮": "宫",
    "寀": "采",
    "寢": "寝",
    "實": "实",
    "寧": "宁",
    "審": "审",
    "寫": "写",
    "寬": "宽",
    "寵": "宠",
    "寶": "宝",
    "將": "将",
    "專": "专",
    "尋": "寻",
    "對": "对",
    "導": "导",
    "尷": "尴",
    "屆": "届",
    "屍": "尸",
    "屓": "屃",
    "屜": "屉",
    "屢": "屡",
    "層": "层",
    "屨": "屦",
    "屬": "属",
    "岡": "冈",
    "峯": "峰",
    "峴": "岘",
    "島": "岛",
    "峽": "峡",
    "崍": "崃",
    "崑": "昆",
    "崗": "岗",
    "崢": "峥",
    "崬": "岽",
    "嵐": "岚",
    "嵗": "岁",
    "嶁": "嵝",
    "嶄": "崭",
    "嶇": "岖",
    "嶔": "嵚",
    "嶗": "崂",
    "嶠": "峤",
    "嶢": "峣",
    "嶧": "峄",
    "嶨": "峃",
    "嶮": "崄",
    "嶴": "岙",
    "嶸": "嵘",
    "嶺": "岭",
    "嶼": "屿",
    "嶽": "岳",
    "巋": "岿",
    "巒": "峦",
    "巔": "巅",
    "巖": "岩",
    "巰": "巯",
    "巹": "卺",
    "帥": "帅",
    "師": "师",
    "帳": "帐",
    "帶": "带",
    "幀": "帧",
    "幃": "帏",
    "幗": "帼",
    "幘": "帻",
    "幟": "帜",
    "幣": "币",
    "幫": "帮",
    "幬": "帱",
    "幹": "干",
    "幾": "几",
    "庫": "库",
    "廁": "厕",
    "廂": "厢",
    "廄": "厩",
    "廈": "厦",
    "廎": "庼",
    "廕": "荫",
    "廚": "厨",
    "廝": "厮",
    "廟": "庙",
    "廠": "厂",
    "廡": "庑",
    "廢": "废",
    "廣": "广",
    "廩": "廪",
    "廬": "庐",
    "廳": "厅",
    "弒": "弑",
    "弔": "吊",
    "弳": "弪",
    "張": "张",
    "強": "强",
    "彆": "别",
    "彈": "弹",
    "彌": "弥",
    "彎": "弯",
    "彔": "录",
    "彙": "汇",
    "彞": "彝",
    "彠": "彟",
    "彥": "彦",
    "彫": "雕",
    "彲": "彨",
    "彿": "佛",
    "後": "后",
    "徑": "径",
    "從": "从",
    "徠": "徕",
    "復": "复",
    "徹": "彻",
    "恆": "恒",
    "恥": "耻",
    "悅": "悦",
    "悞": "悮",
    "悵": "怅",
    "悶": "闷",
    "悽": "凄",
    "惡": "恶",
    "惱": "恼",
    "惲": "恽",
    "惻": "恻",
    "愛": "爱",
    "愜": "惬",
    "愨": "悫",
    "愴": "怆",
    "愷": "恺",
    "愾": "忾",
    "慄": "栗",
    "態": "态",
    "慍": "愠",
    "慘": "惨",
    "慚": "惭",
    "慟": "恸",
    "慣": "惯",
    "慤": "悫",
    "慪": "怄",
    "慫": "怂",
    "慮": "虑",
    "慳": "悭",
    "慶": "庆",
    "慼": "戚",
    "慾": "欲",
    "憂": "忧",
    "憊": "惫",
    "憐": "怜",
    "憑": "凭",
    "憒": "愦",
    "憚": "惮",
    "憤": "愤",
    "憫": "悯",
    "憮": "怃",
    "憲": "宪",
    "憶": "忆",
    "懇": "恳",
    "應": "应",
    "懌": "怿",
    "懍": "懔",
    "懞": "蒙",
    "懟": "怼",
    "懣": "懑",
    "懨": "恹",
    "懲": "惩",
    "懶": "懒",
    "懷": "怀",
    "懸": "悬",
    "懺": "忏",
    "懼": "惧",
    "懾": "慑",
    "戀": "恋",
    "戇": "戆",
    "戔": "戋",
    "戧": "戗",
    "戩": "戬",
    "戰": "战",
    "戱": "戯",
    "戲": "戏",
    "戶": "户",
    "拋": "抛",
    "挩": "捝",
    "挱": "挲",
    "挾": "挟",
    "捨": "舍",
    "捫": "扪",
    "捱": "挨",
    "捲": "卷",
    "掃": "扫",
    "掄": "抡",
    "掆": "㧏",
    "掗": "挜",
    "掙": "挣",
    "掛": "挂",
    "採": "采",
    "揀": "拣",
    "揚": "扬",
    "換": "换",
    "揮": "挥",
    "損": "损",
    "搖": "摇",
    "搗": "捣",
    "搵": "揾",
    "搶": "抢",
    "摑": "掴",
    "摜": "掼",
    "摟": "搂",
    "摯": "挚",
    "摳": "抠",
    "摶": "抟",
    "摺": "折",
    "摻": "掺",
    "撈": "捞",
    "撏": "挦",
    "撐": "撑",
    "撓": "挠",
    "撝": "㧑",
    "撟": "挢",
    "撣": "掸",
    "撥": "拨",
    "撫": "抚",
    "撲": "扑",
    "撳": "揿",
    "撻": "挞",
    "撾": "挝",
    "撿": "捡",
    "擁": "拥",
    "擄": "掳",
    "擇": "择",
    "擊": "击",
    "擋": "挡",
    "擓": "㧟",
    "擔": "担",
    "據": "据",
    "擠": "挤",
    "擡": "抬",
    "擬": "拟",
    "擯": "摈",
    "擰": "拧",
    "擱": "搁",
    "擲": "掷",
    "擴": "扩",
    "擷": "撷",
    "擺": "摆",
    "擻": "擞",
    "擼": "撸",
    "擽": "㧰",
    "擾": "扰",
    "攄": "摅",
    "攆": "撵",
    "攏": "拢",
    "攔": "拦",
    "攖": "撄",
    "攙": "搀",
    "攛": "撺",
    "攜": "携",
    "攝": "摄",
    "攢": "攒",
    "攣": "挛",
    "攤": "摊",
    "攪": "搅",
    "攬": "揽",
    "敎": "教",
    "敓": "敚",
    "敗": "败",
    "敘": "叙",
    "敵": "敌",
    "數": "数",
    "斂": "敛",
    "斃": "毙",
    "斆": "敩",
    "斕": "斓",
    "斬": "斩",
    "斷": "断",
    "旂": "旗",
    "旣": "既",
    "昇": "升",
    "時": "时",
    "晉": "晋",
    "晝": "昼",
    "暈": "晕",
    "暉": "晖",
    "暘": "旸",
    "暢": "畅",
    "暫": "暂",
    "曄": "晔",
    "曆": "历",
    "曇": "昙",
    "曉": "晓",
    "曏": "向",
    "曖": "暧",
    "曠": "旷",
    "曨": "昽",
    "曬": "晒",
    "書": "书",
    "會": "会",
    "朧": "胧",
    "朮": "术",
    "東": "东",
    "杴": "锨",
    "枴": "拐",
    "柵": "栅",
    "柺": "拐",
    "査": "查",
    "桿": "杆",
    "梔": "栀",
    "梘": "枧",
    "條": "条",
    "梟": "枭",
    "梲": "棁",
    "棄": "弃",
    "棊": "棋",
    "棖": "枨",
    "棗": "枣",
    "棟": "栋",
    "棡": "㭎",
    "棧": "栈",
    "棲": "栖",
    "棶": "梾",
    "椏": "桠",
    "椲": "㭏",
    "楊": "杨",
    "楓": "枫",
    "楨": "桢",
    "業": "业",
    "極": "极",
    "榘": "矩",
    "榦": "干",
    "榪": "杩",
    "榮": "荣",
    "榲": "榅",
    "榿": "桤",
    "構": "构",
    "槍": "枪",
    "槓": "杠",
    "槤": "梿",
    "槧": "椠",
    "槨": "椁",
    "槮": "椮",
    "槳": "桨",
    "槶": "椢",
    "槼": "椝",
    "樁": "桩",
    "樂": "乐",
    "樅": "枞",
    "樑": "梁",
    "樓": "楼",
    "標": "标",
    "樞": "枢",
    "樢": "㭤",
    "樣": "样",
    "樫": "㭴",
    "樳": "桪",
    "樸": "朴",
    "樹": "树",
    "樺": "桦",
    "樿": "椫",
    "橈": "桡",
    "橋": "桥",
    "機": "机",
    "橢": "椭",
    "橫": "横",
    "檁": "檩",
    "檉": "柽",
    "檔": "档",
    "檜": "桧",
    "檟": "槚",
    "檢": "检",
    "檣": "樯",
    "檮": "梼",
    "檯": "台",
    "檳": "槟",
    "檸": "柠",
    "檻": "槛",
    "櫃": "柜",
    "櫓": "橹",
    "櫚": "榈",
    "櫛": "栉",
    "櫝": "椟",
    "櫞": "橼",
    "櫟": "栎",
    "櫥": "橱",
    "櫧": "槠",
    "櫨": "栌",
    "櫪": "枥",
    "櫫": "橥",
    "櫬": "榇",
    "櫱": "蘖",
    "櫳": "栊",
    "櫸": "榉",
    "櫺": "棂",
    "櫻": "樱",
    "欄": "栏",
    "欅": "榉",
    "權": "权",
    "欏": "椤",
    "欒": "栾",
    "欖": "榄",
    "欞": "棂",
    "欽": "钦",
    "歎": "叹",
    "歐": "欧",
    "歟": "欤",
    "歡": "欢",
    "歲": "岁",
    "歷": "历",
    "歸": "归",
    "歿": "殁",
    "殘": "残",
    "殞": "殒",
    "殤": "殇",
    "殨": "㱮",
    "殫": "殚",
    "殭": "僵",
    "殮": "殓",
    "殯": "殡",
    "殰": "㱩",
    "殲": "歼",
    "殺": "杀",
    "殻": "壳",
    "殼": "壳",
    "毀": "毁",
    "毆": "殴",
    "毿": "毵",
    "氂": "牦",
    "氈": "毡",
    "氌": "氇",
    "氣": "气",
    "氫": "氢",
    "氬": "氩",
    "氳": "氲",
    "氾": "泛",
    "汎": "泛",
    "汙": "污",
    "決": "决",
    "沒": "没",
    "沖": "冲",
    "況": "况",
    "泝": "溯",
    "洩": "泄",
    "洶": "汹",
    "浹": "浃",
    "涇": "泾",
    "涗": "涚",
    "涼": "凉",
    "淒": "凄",
    "淚": "泪",
    "淥": "渌",
    "淨": "净",
    "淩": "凌",
    "淪": "沦",
    "淵": "渊",
    "淶": "涞",
    "淺": "浅",
    "渙": "涣",
    "減": "减",
    "渢": "沨",
    "渦": "涡",
    "測": "测",
    "渾": "浑",
    "湊": "凑",
    "湞": "浈",
    "湧": "涌",
    "湯": "汤",
    "溈": "沩",
    "準": "准",
    "溝": "沟",
    "溫": "温",
    "溮": "浉",
    "溳": "涢",
    "溼": "湿",
    "滄": "沧",
    "滅": "灭",
    "滌": "涤",
    "滎": "荥",
    "滙": "汇",
    "滬": "沪",
    "滯": "滞",
    "滲": "渗",
    "滷": "卤",
    "滸": "浒",
    "滻": "浐",
    "滾": "滚",
    "滿": "满",
    "漁": "渔",
    "漊": "溇",
    "漚": "沤",
    "漢": "汉",
    "漣": "涟",
    "漬": "渍",
    "漲": "涨",
    "漵": "溆",
    "漸": "渐",
    "漿": "浆",
    "潁": "颍",
    "潑": "泼",
    "潔": "洁",
    "潙": "沩",
    "潛": "潜",
    "潤": "润",
    "潯": "浔",
    "潰": "溃",
    "潷": "滗",
    "潿": "涠",
    "澀": "涩",
    "澆": "浇",
    "澇": "涝",
    "澐": "沄",
    "澗": "涧",
    "澠": "渑",
    "澤": "泽",
    "澦": "滪",
    "澩": "泶",
    "澮": "浍",
    "澱": "淀",
    "澾": "㳠",
    "濁": "浊",
    "濃": "浓",
    "濄": "㳡",
    "濕": "湿",
    "濘": "泞",
    "濛": "蒙",
    "濜": "浕",
    "濟": "济",
    "濤": "涛",
    "濧": "㳔",
    "濫": "滥",
    "濰": "潍",
    "濱": "滨",
    "濺": "溅",
    "濼": "泺",
    "濾": "滤",
    "瀂": "澛",
    "瀅": "滢",
    "瀆": "渎",
    "瀇": "㲿",
    "瀉": "泻",
    "瀏": "浏",
    "瀕": "濒",
    "瀘": "泸",
    "瀝": "沥",
    "瀟": "潇",
    "瀠": "潆",
    "瀦": "潴",
    "瀧": "泷",
    "瀨": "濑",
    "瀲": "潋",
    "瀾": "澜",
    "灃": "沣",
    "灄": "滠",
    "灑": "洒",
    "灕": "漓",
    "灘": "滩",
    "灝": "灏",
    "灠": "漤",
    "灡": "㳕",
    "灣": "湾",
    "灤": "滦",
    "灧": "滟",
    "灩": "滟",
    "災": "灾",
    "為": "为",
    "烏": "乌",
    "烴": "烃",
    "無": "无",
    "煉": "炼",
    "煒": "炜",
    "煙": "烟",
    "煢": "茕",
    "煥": "焕",
    "煩": "烦",
    "煬": "炀",
    "煱": "㶽",
    "熅": "煴",
    "熒": "荧",
    "熗": "炝",
    "熱": "热",
    "熲": "颎",
    "熾": "炽",
    "燁": "烨",
    "燈": "灯",
    "燉": "炖",
    "燒": "烧",
    "燙": "烫",
    "燜": "焖",
    "營": "营",
    "燦": "灿",
    "燬": "毁",
    "燭": "烛",
    "燴": "烩",
    "燶": "㶶",
    "燻": "熏",
    "燼": "烬",
    "燾": "焘",
    "爍": "烁",
    "爐": "炉",
    "爛": "烂",
    "爭": "争",
    "爲": "为",
    "爺": "爷",
    "爾": "尔",
    "牀": "床",
    "牆": "墙",
    "牘": "牍",
    "牽": "牵",
    "犖": "荦",
    "犛": "牦",
    "犢": "犊",
    "犧": "牺",
    "狀": "状",
    "狹": "狭",
    "狽": "狈",
    "猙": "狰",
    "猶": "犹",
    "猻": "狲",
    "獁": "犸",
    "獃": "呆",
    "獄": "狱",
    "獅": "狮",
    "獎": "奖",
    "獨": "独",
    "獪": "狯",
    "獫": "猃",
    "獮": "狝",
    "獰": "狞",
    "獱": "㺍",
    "獲": "获",
    "獵": "猎",
    "獷": "犷",
    "獸": "兽",
    "獺": "獭",
    "獻": "献",
    "獼": "猕",
    "玀": "猡",
    "現": "现",
    "琱": "雕",
    "琺": "珐",
    "琿": "珲",
    "瑋": "玮",
    "瑒": "玚",
    "瑣": "琐",
    "瑤": "瑶",
    "瑩": "莹",
    "瑪": "玛",
    "瑲": "玱",
    "璉": "琏",
    "璡": "琎",
    "璣": "玑",
    "璦": "瑷",
    "璫": "珰",
    "璯": "㻅",
    "環": "环",
    "璵": "玙",
    "璸": "瑸",
    "璽": "玺",
    "瓊": "琼",
    "瓏": "珑",
    "瓔": "璎",
    "瓚": "瓒",
    "甌": "瓯",
    "甕": "瓮",
    "產": "产",
    "産": "产",
    "甦": "苏",
    "甯": "宁",
    "畝": "亩",
    "畢": "毕",
    "異": "异",
    "畵": "画",
    "當": "当",
    "疇": "畴",
    "疊": "叠",
    "痙": "痉",
    "痠": "酸",
    "痾": "疴",
    "瘂": "痖",
    "瘋": "疯",
    "瘍": "疡",
    "瘓": "痪",
    "瘞": "瘗",
    "瘡": "疮",
    "瘧": "疟",
    "瘮": "瘆",
    "瘲": "疭",
    "瘺": "瘘",
    "瘻": "瘘",
    "療": "疗",
    "癆": "痨",
    "癇": "痫",
    "癉": "瘅",
    "癒": "愈",
    "癘": "疠",
    "癟": "瘪",
    "癡": "痴",
    "癢": "痒",
    "癤": "疖",
    "癥": "症",
    "癧": "疬",
    "癩": "癞",
    "癬": "癣",
    "癭": "瘿",
    "癮": "瘾",
    "癰": "痈",
    "癱": "瘫",
    "癲": "癫",
    "發": "发",
    "皁": "皂",
    "皚": "皑",
    "皰": "疱",
    "皸": "皲",
    "皺": "皱",
    "盃": "杯",
    "盜": "盗",
    "盞": "盏",
    "盡": "尽",
    "監": "监",
    "盤": "盘",
    "盧": "卢",
    "盪": "荡",
    "眞": "真",
    "眥": "眦",
    "眾": "众",
    "睏": "困",
    "睜": "睁",
    "睞": "睐",
    "瞘": "眍",
    "瞜": "䁖",
    "瞞": "瞒",
    "瞶": "瞆",
    "瞼": "睑",
    "矇": "蒙",
    "矓": "眬",
    "矚": "瞩",
    "矯": "矫",
    "硃": "朱",
    "硜": "硁",
    "硤": "硖",
    "硨": "砗",
    "硯": "砚",
    "碕": "埼",
    "碩": "硕",
    "碭": "砀",
    "碸": "砜",
    "確": "确",
    "碼": "码",
    "碽": "䂵",
    "磑": "硙",
    "磚": "砖",
    "磠": "硵",
    "磣": "碜",
    "磧": "碛",
    "磯": "矶",
    "磽": "硗",
    "礄": "硚",
    "礆": "硷",
    "礎": "础",
    "礙": "碍",
    "礦": "矿",
    "礪": "砺",
    "礫": "砾",
    "礬": "矾",
    "礱": "砻",
    "祕": "秘",
    "祿": "禄",
    "禍": "祸",
    "禎": "祯",
    "禕": "祎",
    "禡": "祃",
    "禦": "御",
    "禪": "禅",
    "禮": "礼",
    "禰": "祢",
    "禱": "祷",
    "禿": "秃",
    "秈": "籼",
    "稅": "税",
    "稈": "秆",
    "稏": "䅉",
    "稜": "棱",
    "稟": "禀",
    "種": "种",
    "稱": "称",
    "穀": "谷",
    "穇": "䅟",
    "穌": "稣",
    "積": "积",
    "穎": "颖",
    "穠": "秾",
    "穡": "穑",
    "穢": "秽",
    "穩": "稳",
    "穫": "获",
    "穭": "稆",
    "窩": "窝",
    "窪": "洼",
    "窮": "穷",
    "窯": "窑",
    "窵": "窎",
    "窶": "窭",
    "窺": "窥",
    "竄": "窜",
    "竅": "窍",
    "竇": "窦",
    "竈": "灶",
    "竊": "窃",
    "竪": "竖",
    "競": "竞",
    "筆": "笔",
    "筍": "笋",
    "筧": "笕",
    "筴": "䇲",
    "箇": "个",
    "箋": "笺",
    "箏": "筝",
    "節": "节",
    "範": "范",
    "築": "筑",
    "篋": "箧",
    "篔": "筼",
    "篤": "笃",
    "篩": "筛",
    "篳": "筚",
    "簀": "箦",
    "簍": "篓",
    "簑": "蓑",
    "簞": "箪",
    "簡": "简",
    "簣": "篑",
    "簫": "箫",
    "簹": "筜",
    "簽": "签",
    "簾": "帘",
    "籃": "篮",
    "籌": "筹",
    "籔": "䉤",
    "籙": "箓",
    "籛": "篯",
    "籜": "箨",
    "籟": "籁",
    "籠": "笼",
    "籤": "签",
    "籩": "笾",
    "籪": "簖",
    "籬": "篱",
    "籮": "箩",
    "籲": "吁",
    "粵": "粤",
    "糉": "粽",
    "糝": "糁",
    "糞": "粪",
    "糧": "粮",
    "糰": "团",
    "糲": "粝",
    "糴": "籴",
    "糶": "粜",
    "糹": "纟",
    "糾": "纠",
    "紀": "纪",
    "紂": "纣",
    "約": "约",
    "紅": "红",
    "紆": "纡",
    "紇": "纥",
    "紈": "纨",
    "紉": "纫",
    "紋": "纹",
    "納": "纳",
    "紐": "纽",
    "紓": "纾",
    "純": "纯",
    "紕": "纰",
    "紖": "纼",
    "紗": "纱",
    "紘": "纮",
    "紙": "纸",
    "級": "级",
    "紛": "纷",
    "紜": "纭",
    "紝": "纴",
    "紡": "纺",
    "紬": "䌷",
    "紮": "扎",
    "細": "细",
    "紱": "绂",
    "紲": "绁",
    "紳": "绅",
    "紵": "纻",
    "紹": "绍",
    "紺": "绀",
    "紼": "绋",
    "紿": "绐",
    "絀": "绌",
    "終": "终",
    "絃": "弦",
    "組": "组",
    "絅": "䌹",
    "絆": "绊",
    "絎": "绗",
    "結": "结",
    "絕": "绝",
    "絛": "绦",
    "絝": "绔",
    "絞": "绞",
    "絡": "络",
    "絢": "绚",
    "給": "给",
    "絨": "绒",
    "絰": "绖",
    "統": "统",
    "絲": "丝",
    "絳": "绛",
    "絶": "绝",
    "絹": "绢",
    "綁": "绑",
    "綃": "绡",
    "綆": "绠",
    "綈": "绨",
    "綉": "绣",
    "綌": "绤",
    "綏": "绥",
    "綐": "䌼",
    "綑": "捆",
    "經": "经",
    "綜": "综",
    "綞": "缍",
    "綠": "绿",
    "綢": "绸",
    "綣": "绻",
    "綫": "线",
    "綬": "绶",
    "維": "维",
    "綯": "绹",
    "綰": "绾",
    "綱": "纲",
    "網": "网",
    "綳": "绷",
    "綴": "缀",
    "綸": "纶",
    "綹": "绺",
    "綺": "绮",
    "綻": "绽",
    "綽": "绰",
    "綾": "绫",
    "綿": "绵",
    "緄": "绲",
    "緇": "缁",
    "緊": "紧",
    "緋": "绯",
    "緑": "绿",
    "緒": "绪",
    "緓": "绬",
    "緔": "绱",
    "緗": "缃",
    "緘": "缄",
    "緙": "缂",
    "緝": "缉",
    "緞": "缎",
    "締": "缔",
    "緡": "缗",
    "緣": "缘",
    "緦": "缌",
    "編": "编",
    "緩": "缓",
    "緬": "缅",
    "緯": "纬",
    "緱": "缑",
    "緲": "缈",
    "練": "练",
    "緶": "缏",
    "緹": "缇",
    "緻": "致",
    "緼": "缊",
    "縈": "萦",
    "縉": "缙",
    "縊": "缢",
    "縋": "缒",
    "縐": "绉",
    "縑": "缣",
    "縕": "缊",
    "縗": "缞",
    "縛": "缚",
    "縝": "缜",
    "縞": "缟",
    "縟": "缛",
    "縣": "县",
    "縧": "绦",
    "縫": "缝",
    "縭": "缡",
    "縮": "缩",
    "縱": "纵",
    "縲": "缧",
    "縳": "䌸",
    "縴": "纤",
    "縵": "缦",
    "縶": "絷",
    "縷": "缕",
    "縹": "缥",
    "總": "总",
    "績": "绩",
    "繃": "绷",
    "繅": "缫",
    "繆": "缪",
    "繐": "穗",
    "繒": "缯",
    "織": "织",
    "繕": "缮",
    "繚": "缭",
    "繞": "绕",
    "繡": "绣",
    "繢": "缋",
    "繩": "绳",
    "繪": "绘",
    "繫": "系",
    "繭": "茧",
    "繮": "缰",
    "繯": "缳",
    "繰": "缲",
    "繳": "缴",
    "繸": "䍁",
    "繹": "绎",
    "繼": "继",
    "繽": "缤",
    "繾": "缱",
    "繿": "䍀",
    "纇": "颣",
    "纈": "缬",
    "纊": "纩",
    "續": "续",
    "纍": "累",
    "纏": "缠",
    "纓": "缨",
    "纔": "才",
    "纖": "纤",
    "纘": "缵",
    "纜": "缆",
    "缽": "钵",
    "罈": "坛",
    "罌": "罂",
    "罎": "坛",
    "罰": "罚",
    "罵": "骂",
    "罷": "罢",
    "羅": "罗",
    "羆": "罴",
    "羈": "羁",
    "羋": "芈",
    "羣": "群",
    "羥": "羟",
    "羨": "羡",
    "義": "义",
    "羶": "膻",
    "習": "习",
    "翬": "翚",
    "翹": "翘",
    "翽": "翙",
    "耬": "耧",
    "耮": "耢",
    "聖": "圣",
    "聞": "闻",
    "聯": "联",
    "聰": "聪",
    "聲": "声",
    "聳": "耸",
    "聵": "聩",
    "聶": "聂",
    "職": "职",
    "聹": "聍",
    "聽": "听",
    "聾": "聋",
    "肅": "肃",
    "脅": "胁",
    "脈": "脉",
    "脛": "胫",
    "脣": "唇",
    "脩": "修",
    "脫": "脱",
    "脹": "胀",
    "腎": "肾",
    "腖": "胨",
    "腡": "脶",
    "腦": "脑",
    "腫": "肿",
    "腳": "脚",
    "腸": "肠",
    "膃": "腽",
    "膕": "腘",
    "膚": "肤",
    "膞": "䏝",
    "膠": "胶",
    "膩": "腻",
    "膽": "胆",
    "膾": "脍",
    "膿": "脓",
    "臉": "脸",
    "臍": "脐",
    "臏": "膑",
    "臘": "腊",
    "臚": "胪",
    "臟": "脏",
    "臠": "脔",
    "臢": "臜",
    "臥": "卧",
    "臨": "临",
    "臺": "台",
    "與": "与",
    "興": "兴",
    "舉": "举",
    "舊": "旧",
    "舘": "馆",
    "艙": "舱",
    "艤": "舣",
    "艦": "舰",
    "艫": "舻",
    "艱": "艰",
    "艷": "艳",
    "芻": "刍",
    "苧": "苎",
    "茲": "兹",
    "荊": "荆",
    "莊": "庄",
    "莖": "茎",
    "莢": "荚",
    "莧": "苋",
    "華": "华",
    "菴": "庵",
    "菸": "烟",
    "萇": "苌",
    "萊": "莱",
    "萬": "万",
    "萴": "荝",
    "萵": "莴",
    "葉": "叶",
    "葒": "荭",
    "葤": "荮",
    "葦": "苇",
    "葯": "药",
    "葷": "荤",
    "蒐": "搜",
    "蒓": "莼",
    "蒔": "莳",
    "蒕": "蒀",
    "蒞": "莅",
    "蒼": "苍",
    "蓀": "荪",
    "蓆": "席",
    "蓋": "盖",
    "蓮": "莲",
    "蓯": "苁",
    "蓴": "莼",
    "蓽": "荜",
    "蔔": "卜",
    "蔘": "参",
    "蔞": "蒌",
    "蔣": "蒋",
    "蔥": "葱",
    "蔦": "茑",
    "蔭": "荫",
    "蕁": "荨",
    "蕆": "蒇",
    "蕎": "荞",
    "蕒": "荬",
    "蕓": "芸",
    "蕕": "莸",
    "蕘": "荛",
    "蕢": "蒉",
    "蕩": "荡",
    "蕪": "芜",
    "蕭": "萧",
    "蕷": "蓣",
    "薀": "蕰",
    "薈": "荟",
    "薊": "蓟",
    "薌": "芗",
    "薑": "姜",
    "薔": "蔷",
    "薘": "荙",
    "薟": "莶",
    "薦": "荐",
    "薩": "萨",
    "薳": "䓕",
    "薴": "苧",
    "薺": "荠",
    "藍": "蓝",
    "藎": "荩",
    "藝": "艺",
    "藥": "药",
    "藪": "薮",
    "藭": "䓖",
    "藴": "蕴",
    "藶": "苈",
    "藹": "蔼",
    "藺": "蔺",
    "蘀": "萚",
    "蘄": "蕲",
    "蘆": "芦",
    "蘇": "苏",
    "蘊": "蕴",
    "蘚": "藓",
    "蘞": "蔹",
    "蘢": "茏",
    "蘭": "兰",
    "蘺": "蓠",
    "蘿": "萝",
    "虆": "蔂",
    "處": "处",
    "虛": "虚",
    "虜": "虏",
    "號": "号",
    "虧": "亏",
    "虯": "虬",
    "蛺": "蛱",
    "蛻": "蜕",
    "蜆": "蚬",
    "蝕": "蚀",
    "蝟": "猬",
    "蝦": "虾",
    "蝨": "虱",
    "蝸": "蜗",
    "螄": "蛳",
    "螞": "蚂",
    "螢": "萤",
    "螮": "䗖",
    "螻": "蝼",
    "螿": "螀",
    "蟄": "蛰",
    "蟈": "蝈",
    "蟎": "螨",
    "蟣": "虮",
    "蟬": "蝉",
    "蟯": "蛲",
    "蟲": "虫",
    "蟶": "蛏",
    "蟻": "蚁",
    "蠁": "蚃",
    "蠅": "蝇",
    "蠆": "虿",
    "蠍": "蝎",
    "蠐": "蛴",
    "蠑": "蝾",
    "蠔": "蚝",
    "蠟": "蜡",
    "蠣": "蛎",
    "蠨": "蟏",
    "蠱": "蛊",
    "蠶": "蚕",
    "蠻": "蛮",
    "衆": "众",
    "衊": "蔑",
    "術": "术",
    "衕": "同",
    "衚": "胡",
    "衛": "卫",
    "衝": "冲",
    "袞": "衮",
    "裊": "袅",
    "裏": "里",
    "補": "补",
    "裝": "装",
    "裡": "里",
    "製": "制",
    "複": "复",
    "褌": "裈",
    "褘": "袆",
    "褲": "裤",
    "褳": "裢",
    "褸": "褛",
    "褻": "亵",
    "襆": "幞",
    "襇": "裥",
    "襉": "裥",
    "襏": "袯",
    "襖": "袄",
    "襝": "裣",
    "襠": "裆",
    "襤": "褴",
    "襪": "袜",
    "襯": "衬",
    "襲": "袭",
    "襴": "襕",
    "覈": "核",
    "見": "见",
    "覎": "觃",
    "規": "规",
    "覓": "觅",
    "視": "视",
    "覘": "觇",
    "覡": "觋",
    "覥": "觍",
    "覦": "觎",
    "親": "亲",
    "覬": "觊",
    "覯": "觏",
    "覲": "觐",
    "覷": "觑",
    "覺": "觉",
    "覽": "览",
    "覿": "觌",
    "觀": "观",
    "觴": "觞",
    "觶": "觯",
    "觸": "触",
    "訁": "讠",
    "訂": "订",
    "訃": "讣",
    "計": "计",
    "訊": "讯",
    "訌": "讧",
    "討": "讨",
    "訐": "讦",
    "訒": "讱",
    "訓": "训",
    "訕": "讪",
    "訖": "讫",
    "記": "记",
    "訛": "讹",
    "訝": "讶",
    "訟": "讼",
    "訢": "䜣",
    "訣": "诀",
    "訥": "讷",
    "訩": "讻",
    "訪": "访",
    "設": "设",
    "許": "许",
    "訴": "诉",
    "訶": "诃",
    "診": "诊",
    "註": "注",
    "証": "证",
    "詁": "诂",
    "詆": "诋",
    "詎": "讵",
    "詐": "诈",
    "詒": "诒",
    "詔": "诏",
    "評": "评",
    "詖": "诐",
    "詗": "诇",
    "詘": "诎",
    "詛": "诅",
    "詞": "词",
    "詠": "咏",
    "詡": "诩",
    "詢": "询",
    "詣": "诣",
    "試": "试",
    "詩": "诗",
    "詫": "诧",
    "詬": "诟",
    "詭": "诡",
    "詮": "诠",
    "詰": "诘",
    "話": "话",
    "該": "该",
    "詳": "详",
    "詵": "诜",
    "詼": "诙",
    "詿": "诖",
    "誄": "诔",
    "誅": "诛",
    "誆": "诓",
    "誇": "夸",
    "誌": "志",
    "認": "认",
    "誑": "诳",
    "誒": "诶",
    "誕": "诞",
    "誘": "诱",
    "誚": "诮",
    "語": "语",
    "誠": "诚",
    "誡": "诫",
    "誣": "诬",
    "誤": "误",
    "誥": "诰",
    "誦": "诵",
    "誨": "诲",
    "說": "说",
    "説": "说",
    "誰": "谁",
    "課": "课",
    "誶": "谇",
    "誹": "诽",
    "誼": "谊",
    "誾": "訚",
    "調": "调",
    "諂": "谄",
    "諄": "谆",
    "談": "谈",
    "諉": "诿",
    "請": "请",
    "諍": "诤",
    "諏": "诹",
    "諑": "诼",
    "諒": "谅",
    "論": "论",
    "諗": "谂",
    "諛": "谀",
    "諜": "谍",
    "諝": "谞",
    "諞": "谝",
    "諡": "谥",
    "諢": "诨",
    "諤": "谔",
    "諦": "谛",
    "諧": "谐",
    "諭": "谕",
    "諱": "讳",
    "諳": "谙",
    "諶": "谌",
    "諷": "讽",
    "諸": "诸",
    "諺": "谚",
    "諼": "谖",
    "諾": "诺",
    "謀": "谋",
    "謁": "谒",
    "謂": "谓",
    "謄": "誊",
    "謅": "诌",
    "謊": "谎",
    "謎": "谜",
    "謐": "谧",
    "謔": "谑",
    "謖": "谡",
    "謗": "谤",
    "謙": "谦",
    "謚": "谥",
    "講": "讲",
    "謝": "谢",
    "謠": "谣",
    "謡": "谣",
    "謨": "谟",
    "謫": "谪",
    "謬": "谬",
    "謭": "谫",
    "謳": "讴",
    "謹": "谨",
    "謾": "谩",
    "譁": "哗",
    "譅": "䜧",
    "證": "证",
    "譎": "谲",
    "譏": "讥",
    "譖": "谮",
    "識": "识",
    "譙": "谯",
    "譚": "谭",
    "譜": "谱",
    "譟": "噪",
    "譫": "谵",
    "譭": "毁",
    "譯": "译",
    "議": "议",
    "譴": "谴",
    "護": "护",
    "譸": "诪",
    "譽": "誉",
    "讀": "读",
    "讅": "谉",
    "變": "变",
    "讋": "詟",
    "讌": "䜩",
    "讎": "雠",
    "讒": "谗",
    "讓": "让",
    "讕": "谰",
    "讖": "谶",
    "讚": "赞",
    "讜": "谠",
    "讞": "谳",
    "豈": "岂",
    "豎": "竖",
    "豐": "丰",
    "豔": "艳",
    "豬": "猪",
    "豶": "豮",
    "貓": "猫",
    "貙": "䝙",
    "貝": "贝",
    "貞": "贞",
    "貟": "贠",
    "負": "负",
    "財": "财",
    "貢": "贡",
    "貧": "贫",
    "貨": "货",
    "販": "贩",
    "貪": "贪",
    "貫": "贯",
    "責": "责",
    "貯": "贮",
    "貰": "贳",
    "貲": "赀",
    "貳": "贰",
    "貴": "贵",
    "貶": "贬",
    "貸": "贷",
    "貺": "贶",
    "費": "费",
    "貼": "贴",
    "貽": "贻",
    "貿": "贸",
    "賀": "贺",
    "賁": "贲",
    "賂": "赂",
    "賃": "赁",
    "賄": "贿",
    "賅": "赅",
    "資": "资",
    "賈": "贾",
    "賊": "贼",
    "賑": "赈",
    "賒": "赊",
    "賓": "宾",
    "賕": "赇",
    "賙": "赒",
    "賚": "赉",
    "賜": "赐",
    "賞": "赏",
    "賠": "赔",
    "賡": "赓",
    "賢": "贤",
    "賣": "卖",
    "賤": "贱",
    "賦": "赋",
    "賧": "赕",
    "質": "质",
    "賫": "赍",
    "賬": "账",
    "賭": "赌",
    "賰": "䞐",
    "賴": "赖",
    "賵": "赗",
    "賺": "赚",
    "賻": "赙",
    "購": "购",
    "賽": "赛",
    "賾": "赜",
    "贄": "贽",
    "贅": "赘",
    "贇": "赟",
    "贈": "赠",
    "贊": "赞",
    "贋": "赝",
    "贍": "赡",
    "贏": "赢",
    "贐": "赆",
    "贓": "赃",
    "贔": "赑",
    "贖": "赎",
    "贗": "赝",
    "贛": "赣",
    "贜": "赃",
    "赬": "赪",
    "趕": "赶",
    "趙": "赵",
    "趨": "趋",
    "趲": "趱",
    "跡": "迹",
    "踐": "践",
    "踰": "逾",
    "踴": "踊",
    "蹌": "跄",
    "蹕": "跸",
    "蹟": "迹",
    "蹣": "蹒",
    "蹤": "踪",
    "蹺": "跷",
    "躂": "跶",
    "躉": "趸",
    "躊": "踌",
    "躋": "跻",
    "躍": "跃",
    "躎": "䟢",
    "躑": "踯",
    "躒": "跞",
    "躓": "踬",
    "躕": "蹰",
    "躚": "跹",
    "躡": "蹑",
    "躥": "蹿",
    "躦": "躜",
    "躪": "躏",
    "軀": "躯",
    "車": "车",
    "軋": "轧",
    "軌": "轨",
    "軍": "军",
    "軑": "轪",
    "軒": "轩",
    "軔": "轫",
    "軛": "轭",
    "軟": "软",
    "軤": "轷",
    "軫": "轸",
    "軲": "轱",
    "軸": "轴",
    "軹": "轵",
    "軺": "轺",
    "軻": "轲",
    "軼": "轶",
    "軾": "轼",
    "較": "较",
    "輅": "辂",
    "輇": "辁",
    "輈": "辀",
    "載": "载",
    "輊": "轾",
    "輒": "辄",
    "輓": "挽",
    "輔": "辅",
    "輕": "轻",
    "輛": "辆",
    "輜": "辎",
    "輝": "辉",
    "輞": "辋",
    "輟": "辍",
    "輥": "辊",
    "輦": "辇",
    "輩": "辈",
    "輪": "轮",
    "輬": "辌",
    "輯": "辑",
    "輳": "辏",
    "輸": "输",
    "輻": "辐",
    "輼": "辒",
    "輾": "辗",
    "輿": "舆",
    "轀": "辒",
    "轂": "毂",
    "轄": "辖",
    "轅": "辕",
    "轆": "辘",
    "轉": "转",
    "轍": "辙",
    "轎": "轿",
    "轔": "辚",
    "轟": "轰",
    "轡": "辔",
    "轢": "轹",
    "轤": "轳",
    "辦": "办",
    "辭": "辞",
    "辮": "辫",
    "辯": "辩",
    "農": "农",
    "迴": "回",
    "逕": "迳",
    "這": "这",
    "連": "连",
    "週": "周",
    "進": "进",
    "遊": "游",
    "運": "运",
    "過": "过",
    "達": "达",
    "違": "违",
    "遙": "遥",
    "遜": "逊",
    "遞": "递",
    "遠": "远",
    "遡": "溯",
    "適": "适",
    "遲": "迟",
    "遷": "迁",
    "選": "选",
    "遺": "遗",
    "遼": "辽",
    "邁": "迈",
    "還": "还",
    "邇": "迩",
    "邊": "边",
    "邏": "逻",
    "邐": "逦",
    "郟": "郏",
    "郵": "邮",
    "鄆": "郓",
    "鄉": "乡",
    "鄒": "邹",
    "鄔": "邬",
    "鄖": "郧",
    "鄧": "邓",
    "鄭": "郑",
    "鄰": "邻",
    "鄲": "郸",
    "鄴": "邺",
    "鄶": "郐",
    "鄺": "邝",
    "酇": "酂",
    "酈": "郦",
    "醃": "腌",
    "醖": "酝",
    "醜": "丑",
    "醞": "酝",
    "醣": "糖",
    "醫": "医",
    "醬": "酱",
    "醱": "酦",
    "釀": "酿",
    "釁": "衅",
    "釃": "酾",
    "釅": "酽",
    "釋": "释",
    "釐": "厘",
    "釒": "钅",
    "釓": "钆",
    "釔": "钇",
    "釕": "钌",
    "釗": "钊",
    "釘": "钉",
    "釙": "钋",
    "針": "针",
    "釣": "钓",
    "釤": "钐",
    "釦": "扣",
    "釧": "钏",
    "釩": "钒",
    "釵": "钗",
    "釷": "钍",
    "釹": "钕",
    "釺": "钎",
    "釾": "䥺",
    "鈀": "钯",
    "鈁": "钫",
    "鈃": "钘",
    "鈄": "钭",
    "鈅": "钥",
    "鈈": "钚",
    "鈉": "钠",
    "鈍": "钝",
    "鈎": "钩",
    "鈐": "钤",
    "鈑": "钣",
    "鈒": "钑",
    "鈔": "钞",
    "鈞": "钧",
    "鈡": "钟",
    "鈣": "钙",
    "鈥": "钬",
    "鈦": "钛",
    "鈧": "钪",
    "鈮": "铌",
    "鈰": "铈",
    "鈳": "钶",
    "鈴": "铃",
    "鈷": "钴",
    "鈸": "钹",
    "鈹": "铍",
    "鈺": "钰",
    "鈽": "钸",
    "鈾": "铀",
    "鈿": "钿",
    "鉀": "钾",
    "鉆": "钻",
    "鉈": "铊",
    "鉉": "铉",
    "鉋": "铇",
    "鉍": "铋",
    "鉑": "铂",
    "鉕": "钷",
    "鉗": "钳",
    "鉚": "铆",
    "鉛": "铅",
    "鉞": "钺",
    "鉢": "钵",
    "鉤": "钩",
    "鉦": "钲",
    "鉬": "钼",
    "鉭": "钽",
    "鉶": "铏",
    "鉸": "铰",
    "鉺": "铒",
    "鉻": "铬",
    "鉿": "铪",
    "銀": "银",
    "銃": "铳",
    "銅": "铜",
    "銍": "铚",
    "銑": "铣",
    "銓": "铨",
    "銖": "铢",
    "銘": "铭",
    "銚": "铫",
    "銛": "铦",
    "銜": "衔",
    "銠": "铑",
    "銣": "铷",
    "銥": "铱",
    "銦": "铟",
    "銨": "铵",
    "銩": "铥",
    "銪": "铕",
    "銫": "铯",
    "銬": "铐",
    "銱": "铞",
    "銳": "锐",
    "銷": "销",
    "銹": "锈",
    "銻": "锑",
    "銼": "锉",
    "鋁": "铝",
    "鋃": "锒",
    "鋅": "锌",
    "鋇": "钡",
    "鋌": "铤",
    "鋏": "铗",
    "鋒": "锋",
    "鋙": "铻",
    "鋝": "锊",
    "鋟": "锓",
    "鋣": "铘",
    "鋤": "锄",
    "鋥": "锃",
    "鋦": "锔",
    "鋨": "锇",
    "鋩": "铓",
    "鋪": "铺",
    "鋭": "锐",
    "鋮": "铖",
    "鋯": "锆",
    "鋰": "锂",
    "鋱": "铽",
    "鋶": "锍",
    "鋸": "锯",
    "鋼": "钢",
    "錁": "锞",
    "錄": "录",
    "錆": "锖",
    "錇": "锫",
    "錈": "锩",
    "錏": "铔",
    "錐": "锥",
    "錒": "锕",
    "錕": "锟",
    "錘": "锤",
    "錙": "锱",
    "錚": "铮",
    "錛": "锛",
    "錟": "锬",
    "錠": "锭",
    "錡": "锜",
    "錢": "钱",
    "錦": "锦",
    "錨": "锚",
    "錩": "锠",
    "錫": "锡",
    "錮": "锢",
    "錯": "错",
    "録": "录",
    "錳": "锰",
    "錶": "表",
    "錸": "铼",
    "鍀": "锝",
    "鍁": "锨",
    "鍃": "锪",
    "鍆": "钔",
    "鍇": "锴",
    "鍈": "锳",
    "鍋": "锅",
    "鍍": "镀",
    "鍔": "锷",
    "鍘": "铡",
    "鍚": "钖",
    "鍛": "锻",
    "鍠": "锽",
    "鍤": "锸",
    "鍥": "锲",
    "鍩": "锘",
    "鍬": "锹",
    "鍰": "锾",
    "鍵": "键",
    "鍶": "锶",
    "鍺": "锗",
    "鍼": "针",
    "鎂": "镁",
    "鎄": "锿",
    "鎇": "镅",
    "鎊": "镑",
    "鎌": "镰",
    "鎔": "镕",
    "鎖": "锁",
    "鎘": "镉",
    "鎚": "锤",
    "鎛": "镈",
    "鎡": "镃",
    "鎢": "钨",
    "鎣": "蓥",
    "鎦": "镏",
    "鎧": "铠",
    "鎩": "铩",
    "鎪": "锼",
    "鎬": "镐",
    "鎭": "镇",
    "鎮": "镇",
    "鎰": "镒",
    "鎲": "镋",
    "鎳": "镍",
    "鎵": "镓",
    "鎸": "镌",
    "鎿": "镎",
    "鏃": "镞",
    "鏇": "镟",
    "鏈": "链",
    "鏌": "镆",
    "鏍": "镙",
    "鏐": "镠",
    "鏑": "镝",
    "鏗": "铿",
    "鏘": "锵",
    "鏚": "戚",
    "鏜": "镗",
    "鏝": "镘",
    "鏞": "镛",
    "鏟": "铲",
    "鏡": "镜",
    "鏢": "镖",
    "鏤": "镂",
    "鏨": "錾",
    "鏰": "镚",
    "鏵": "铧",
    "鏷": "镤",
    "鏹": "镪",
    "鏺": "䥽",
    "鏽": "锈",
    "鐃": "铙",
    "鐋": "铴",
    "鐐": "镣",
    "鐒": "铹",
    "鐓": "镦",
    "鐔": "镡",
    "鐗": "锏",
    "鐘": "钟",
    "鐙": "镫",
    "鐝": "镢",
    "鐠": "镨",
    "鐥": "䦅",
    "鐦": "锎",
    "鐧": "锏",
    "鐨": "镄",
    "鐫": "镌",
    "鐮": "镰",
    "鐯": "䦃",
    "鐲": "镯",
    "鐳": "镭",
    "鐵": "铁",
    "鐶": "镮",
    "鐸": "铎",
    "鐺": "铛",
    "鐿": "镱",
    "鑄": "铸",
    "鑊": "镬",
    "鑌": "镔",
    "鑑": "鉴",
    "鑒": "鉴",
    "鑔": "镲",
    "鑕": "锧",
    "鑞": "镴",
    "鑠": "铄",
    "鑣": "镳",
    "鑥": "镥",
    "鑭": "镧",
    "鑰": "钥",
    "鑱": "镵",
    "鑲": "镶",
    "鑷": "镊",
    "鑹": "镩",
    "鑼": "锣",
    "鑽": "钻",
    "鑾": "銮",
    "鑿": "凿",
    "钂": "镋",
    "镟": "旋",
    "長": "长",
    "門": "门",
    "閂": "闩",
    "閃": "闪",
    "閆": "闫",
    "閈": "闬",
    "閉": "闭",
    "閌": "闶",
    "閎": "闳",
    "閏": "闰",
    "閑": "闲",
    "間": "间",
    "閔": "闵",
    "閘": "闸",
    "閡": "阂",
    "閣": "阁",
    "閤": "合",
    "閥": "阀",
    "閨": "闺",
    "閩": "闽",
    "閫": "阃",
    "閬": "阆",
    "閭": "闾",
    "閱": "阅",
    "閲": "阅",
    "閶": "阊",
    "閹": "阉",
    "閻": "阎",
    "閼": "阏",
    "閽": "阍",
    "閾": "阈",
    "閿": "阌",
    "闃": "阒",
    "闆": "板",
    "闇": "暗",
    "闈": "闱",
    "闊": "阔",
    "闋": "阕",
    "闌": "阑",
    "闍": "阇",
    "闐": "阗",
    "闒": "阘",
    "闓": "闿",
    "闔": "阖",
    "闕": "阙",
    "闖": "闯",
    "關": "关",
    "闞": "阚",
    "闠": "阓",
    "闡": "阐",
    "闢": "辟",
    "闤": "阛",
    "闥": "闼",
    "陘": "陉",
    "陝": "陕",
    "陞": "升",
    "陣": "阵",
    "陰": "阴",
    "陳": "陈",
    "陸": "陆",
    "陽": "阳",
    "隉": "陧",
    "隊": "队",
    "階": "阶",
    "隕": "陨",
    "際": "际",
    "隨": "随",
    "險": "险",
    "隱": "隐",
    "隴": "陇",
    "隸": "隶",
    "隻": "只",
    "雋": "隽",
    "雖": "虽",
    "雙": "双",
    "雛": "雏",
    "雜": "杂",
    "雞": "鸡",
    "離": "离",
    "難": "难",
    "雲": "云",
    "電": "电",
    "霢": "霡",
    "霧": "雾",
    "霽": "霁",
    "靂": "雳",
    "靄": "霭",
    "靆": "叇",
    "靈": "灵",
    "靉": "叆",
    "靚": "靓",
    "靜": "静",
    "靨": "靥",
    "鞀": "鼗",
    "鞏": "巩",
    "鞝": "绱",
    "鞦": "秋",
    "鞽": "鞒",
    "韁": "缰",
    "韃": "鞑",
    "韆": "千",
    "韉": "鞯",
    "韋": "韦",
    "韌": "韧",
    "韍": "韨",
    "韓": "韩",
    "韙": "韪",
    "韜": "韬",
    "韞": "韫",
    "韻": "韵",
    "響": "响",
    "頁": "页",
    "頂": "顶",
    "頃": "顷",
    "項": "项",
    "順": "顺",
    "頇": "顸",
    "須": "须",
    "頊": "顼",
    "頌": "颂",
    "頎": "颀",
    "頏": "颃",
    "預": "预",
    "頑": "顽",
    "頒": "颁",
    "頓": "顿",
    "頗": "颇",
    "領": "领",
    "頜": "颌",
    "頡": "颉",
    "頤": "颐",
    "頦": "颏",
    "頭": "头",
    "頮": "颒",
    "頰": "颊",
    "頲": "颋",
    "頴": "颕",
    "頷": "颔",
    "頸": "颈",
    "頹": "颓",
    "頻": "频",
    "頽": "颓",
    "顆": "颗",
    "題": "题",
    "額": "额",
    "顎": "颚",
    "顏": "颜",
    "顒": "颙",
    "顓": "颛",
    "顔": "颜",
    "顙": "颡",
    "顛": "颠",
    "類": "类",
    "顢": "颟",
    "顥": "颢",
    "顧": "顾",
    "顫": "颤",
    "顬": "颥",
    "顯": "显",
    "顰": "颦",
    "顱": "颅",
    "顳": "颞",
    "顴": "颧",
    "風": "风",
    "颭": "飐",
    "颮": "飑",
    "颯": "飒",
    "颱": "台",
    "颳": "刮",
    "颶": "飓",
    "颸": "飔",
    "颺": "飏",
    "颻": "飖",
    "颼": "飕",
    "飀": "飗",
    "飄": "飘",
    "飆": "飙",
    "飈": "飚",
    "飛": "飞",
    "飠": "饣",
    "飢": "饥",
    "飣": "饤",
    "飥": "饦",
    "飩": "饨",
    "飪": "饪",
    "飫": "饫",
    "飭": "饬",
    "飯": "饭",
    "飱": "飧",
    "飲": "饮",
    "飴": "饴",
    "飼": "饲",
    "飽": "饱",
    "飾": "饰",
    "飿": "饳",
    "餃": "饺",
    "餄": "饸",
    "餅": "饼",
    "餉": "饷",
    "養": "养",
    "餌": "饵",
    "餎": "饹",
    "餏": "饻",
    "餑": "饽",
    "餒": "馁",
    "餓": "饿",
    "餕": "馂",
    "餖": "饾",
    "餚": "肴",
    "餛": "馄",
    "餜": "馃",
    "餞": "饯",
    "餡": "馅",
    "館": "馆",
    "餳": "饧",
    "餶": "馉",
    "餷": "馇",
    "餺": "馎",
    "餼": "饩",
    "餾": "馏",
    "餿": "馊",
    "饁": "馌",
    "饃": "馍",
    "饅": "馒",
    "饈": "馐",
    "饉": "馑",
    "饊": "馓",
    "饋": "馈",
    "饌": "馔",
    "饑": "饥",
    "饒": "饶",
    "饗": "飨",
    "饜": "餍",
    "饞": "馋",
    "饢": "馕",
    "馬": "马",
    "馭": "驭",
    "馮": "冯",
    "馱": "驮",
    "馳": "驰",
    "馴": "驯",
    "馹": "驲",
    "駁": "驳",
    "駐": "驻",
    "駑": "驽",
    "駒": "驹",
    "駔": "驵",
    "駕": "驾",
    "駘": "骀",
    "駙": "驸",
    "駛": "驶",
    "駝": "驼",
    "駟": "驷",
    "駡": "骂",
    "駢": "骈",
    "駭": "骇",
    "駰": "骃",
    "駱": "骆",
    "駸": "骎",
    "駿": "骏",
    "騁": "骋",
    "騂": "骍",
    "騅": "骓",
    "騌": "骔",
    "騍": "骒",
    "騎": "骑",
    "騏": "骐",
    "騖": "骛",
    "騙": "骗",
    "騤": "骙",
    "騧": "䯄",
    "騫": "骞",
    "騭": "骘",
    "騮": "骝",
    "騰": "腾",
    "騶": "驺",
    "騷": "骚",
    "騸": "骟",
    "騾": "骡",
    "驀": "蓦",
    "驁": "骜",
    "驂": "骖",
    "驃": "骠",
    "驅": "驱",
    "驊": "骅",
    "驌": "骕",
    "驍": "骁",
    "驏": "骣",
    "驕": "骄",
    "驗": "验",
    "驚": "惊",
    "驛": "驿",
    "驟": "骤",
    "驢": "驴",
    "驤": "骧",
    "驥": "骥",
    "驦": "骦",
    "驪": "骊",
    "驫": "骉",
    "骯": "肮",
    "髏": "髅",
    "髒": "脏",
    "體": "体",
    "髕": "髌",
    "髖": "髋",
    "髮": "发",
    "鬆": "松",
    "鬍": "胡",
    "鬚": "须",
    "鬢": "鬓",
    "鬥": "斗",
    "鬧": "闹",
    "鬨": "哄",
    "鬩": "阋",
    "鬮": "阄",
    "鬱": "郁",
    "鬹": "鬶",
    "魎": "魉",
    "魘": "魇",
    "魚": "鱼",
    "魛": "鱽",
    "魢": "鱾",
    "魨": "鲀",
    "魯": "鲁",
    "魴": "鲂",
    "魷": "鱿",
    "魺": "鲄",
    "鮁": "鲅",
    "鮃": "鲆",
    "鮊": "鲌",
    "鮋": "鲉",
    "鮍": "鲏",
    "鮎": "鲇",
    "鮐": "鲐",
    "鮑": "鲍",
    "鮒": "鲋",
    "鮓": "鲊",
    "鮚": "鲒",
    "鮜": "鲘",
    "鮝": "鲞",
    "鮞": "鲕",
    "鮣": "䲟",
    "鮦": "鲖",
    "鮪": "鲔",
    "鮫": "鲛",
    "鮭": "鲑",
    "鮮": "鲜",
    "鮳": "鲓",
    "鮶": "鲪",
    "鮺": "鲝",
    "鯀": "鲧",
    "鯁": "鲠",
    "鯇": "鲩",
    "鯉": "鲤",
    "鯊": "鲨",
    "鯒": "鲬",
    "鯔": "鲻",
    "鯕": "鲯",
    "鯖": "鲭",
    "鯗": "鲞",
    "鯛": "鲷",
    "鯝": "鲴",
    "鯡": "鲱",
    "鯢": "鲵",
    "鯤": "鲲",
    "鯧": "鲳",
    "鯨": "鲸",
    "鯪": "鲮",
    "鯫": "鲰",
    "鯰": "鲶",
    "鯴": "鲺",
    "鯷": "鳀",
    "鯽": "鲫",
    "鯿": "鳊",
    "鰁": "鳈",
    "鰂": "鲗",
    "鰃": "鳂",
    "鰆": "䲠",
    "鰈": "鲽",
    "鰉": "鳇",
    "鰌": "䲡",
    "鰍": "鳅",
    "鰏": "鲾",
    "鰐": "鳄",
    "鰒": "鳆",
    "鰓": "鳃",
    "鰛": "鳁",
    "鰜": "鳒",
    "鰟": "鳑",
    "鰠": "鳋",
    "鰣": "鲥",
    "鰥": "鳏",
    "鰧": "䲢",
    "鰨": "鳎",
    "鰩": "鳐",
    "鰭": "鳍",
    "鰮": "鳁",
    "鰱": "鲢",
    "鰲": "鳌",
    "鰳": "鳓",
    "鰵": "鳘",
    "鰷": "鲦",
    "鰹": "鲣",
    "鰺": "鲹",
    "鰻": "鳗",
    "鰼": "鳛",
    "鰾": "鳔",
    "鱂": "鳉",
    "鱅": "鳙",
    "鱈": "鳕",
    "鱉": "鳖",
    "鱒": "鳟",
    "鱔": "鳝",
    "鱖": "鳜",
    "鱗": "鳞",
    "鱘": "鲟",
    "鱝": "鲼",
    "鱟": "鲎",
    "鱠": "鲙",
    "鱣": "鳣",
    "鱤": "鳡",
    "鱧": "鳢",
    "鱨": "鲿",
    "鱭": "鲚",
    "鱯": "鳠",
    "鱷": "鳄",
    "鱸": "鲈",
    "鱺": "鲡",
    "鳥": "鸟",
    "鳧": "凫",
    "鳩": "鸠",
    "鳬": "凫",
    "鳲": "鸤",
    "鳳": "凤",
    "鳴": "鸣",
    "鳶": "鸢",
    "鳾": "䴓",
    "鴆": "鸩",
    "鴇": "鸨",
    "鴉": "鸦",
    "鴒": "鸰",
    "鴕": "鸵",
    "鴛": "鸳",
    "鴝": "鸲",
    "鴞": "鸮",
    "鴟": "鸱",
    "鴣": "鸪",
    "鴦": "鸯",
    "鴨": "鸭",
    "鴯": "鸸",
    "鴰": "鸹",
    "鴴": "鸻",
    "鴷": "䴕",
    "鴻": "鸿",
    "鴿": "鸽",
    "鵁": "䴔",
    "鵂": "鸺",
    "鵃": "鸼",
    "鵐": "鹀",
    "鵑": "鹃",
    "鵒": "鹆",
    "鵓": "鹁",
    "鵜": "鹈",
    "鵝": "鹅",
    "鵠": "鹄",
    "鵡": "鹉",
    "鵪": "鹌",
    "鵬": "鹏",
    "鵮": "鹐",
    "鵯": "鹎",
    "鵲": "鹊",
    "鵷": "鹓",
    "鵾": "鹍",
    "鶄": "䴖",
    "鶇": "鸫",
    "鶉": "鹑",
    "鶊": "鹒",
    "鶓": "鹋",
    "鶖": "鹙",
    "鶘": "鹕",
    "鶚": "鹗",
    "鶡": "鹖",
    "鶥": "鹛",
    "鶩": "鹜",
    "鶪": "䴗",
    "鶬": "鸧",
    "鶯": "莺",
    "鶲": "鹟",
    "鶴": "鹤",
    "鶹": "鹠",
    "鶺": "鹡",
    "鶻": "鹘",
    "鶼": "鹣",
    "鶿": "鹚",
    "鷀": "鹚",
    "鷁": "鹢",
    "鷂": "鹞",
    "鷄": "鸡",
    "鷈": "䴘",
    "鷉": "䴘",
    "鷊": "鹝",
    "鷓": "鹧",
    "鷖": "鹥",
    "鷗": "鸥",
    "鷙": "鸷",
    "鷚": "鹨",
    "鷥": "鸶",
    "鷦": "鹪",
    "鷫": "鹔",
    "鷯": "鹩",
    "鷲": "鹫",
    "鷳": "鹇",
    "鷴": "鹇",
    "鷸": "鹬",
    "鷹": "鹰",
    "鷺": "鹭",
    "鷽": "鸴",
    "鷿": "䴙",
    "鸂": "㶉",
    "鸇": "鹯",
    "鸊": "䴙",
    "鸌": "鹱",
    "鸏": "鹲",
    "鸕": "鸬",
    "鸘": "鹴",
    "鸚": "鹦",
    "鸛": "鹳",
    "鸝": "鹂",
    "鸞": "鸾",
    "鹵": "卤",
    "鹹": "咸",
    "鹺": "鹾",
    "鹼": "碱",
    "鹽": "盐",
    "麗": "丽",
    "麥": "麦",
    "麩": "麸",
    "麫": "面",
    "麯": "曲",
    "黃": "黄",
    "黌": "黉",
    "點": "点",
    "黨": "党",
    "黲": "黪",
    "黴": "霉",
    "黶": "黡",
    "黷": "黩",
    "黽": "黾",
    "黿": "鼋",
    "鼉": "鼍",
    "鼕": "冬",
    "鼴": "鼹",
    "齇": "齄",
    "齊": "齐",
    "齋": "斋",
    "齎": "赍",
    "齏": "齑",
    "齒": "齿",
    "齔": "龀",
    "齕": "龁",
    "齗": "龂",
    "齙": "龅",
    "齜": "龇",
    "齟": "龃",
    "齠": "龆",
    "齡": "龄",
    "齣": "出",
    "齦": "龈",
    "齪": "龊",
    "齬": "龉",
    "齲": "龋",
    "齶": "腭",
    "齷": "龌",
    "龍": "龙",
    "龎": "厐",
    "龐": "庞",
    "龑": "䶮",
    "龔": "龚",
    "龕": "龛",
    "龜": "龟",
    "鿁": "䜤",
    "妳": "你"
  };
  var regexp = new RegExp(Object.keys(aTC2SC).join("|"), "g");
  function cht2chs(text) {
    return text.replace(regexp, (d) => aTC2SC[d]);
  }

  // src/runtime/player/closed_caption.css
  var closed_caption_default = \`/* CC字幕相关样式 */\\r
/*对齐，悬停按钮显示菜单*/\\r
#subtitle-setting-panel>div>* {\\r
    margin-right: 5px;\\r
}\\r
\\r
#bilibili-player-subtitle-btn:hover>#subtitle-setting-panel {\\r
    display: block !important;\\r
}\\r
\\r
/*滑动选择样式*/\\r
#subtitle-setting-panel input[type="range"] {\\r
    background-color: #ebeff4;\\r
    -webkit-appearance: none;\\r
    height: 4px;\\r
    transform: translateY(-4px);\\r
}\\r
\\r
#subtitle-setting-panel input[type="range"]::-webkit-slider-thumb {\\r
    -webkit-appearance: none;\\r
    height: 15px;\\r
    width: 15px;\\r
    background: #fff;\\r
    border-radius: 15px;\\r
    border: 1px solid;\\r
}\\r
\\r
/*复选框和其对应标签样式*/\\r
#subtitle-setting-panel input[type="checkbox"] {\\r
    display: none;\\r
}\\r
\\r
#subtitle-setting-panel input~label {\\r
    cursor: pointer;\\r
}\\r
\\r
#subtitle-setting-panel input:checked~label:before {\\r
    content: '\\\\2714';\\r
}\\r
\\r
#subtitle-setting-panel input~label:before {\\r
    width: 12px;\\r
    height: 12px;\\r
    line-height: 14px;\\r
    vertical-align: text-bottom;\\r
    border-radius: 3px;\\r
    border: 1px solid #d3d3d3;\\r
    display: inline-block;\\r
    text-align: center;\\r
    content: ' ';\\r
}\\r
\\r
/*悬停显示下拉框样式*/\\r
#subtitle-setting-panel .bpui-selectmenu:hover .bpui-selectmenu-list {\\r
    display: block;\\r
}\\r
\\r
/*滚动条样式*/\\r
#subtitle-setting-panel ::-webkit-scrollbar {\\r
    width: 7px;\\r
}\\r
\\r
#subtitle-setting-panel ::-webkit-scrollbar-track {\\r
    border-radius: 4px;\\r
    background-color: #EEE;\\r
}\\r
\\r
#subtitle-setting-panel ::-webkit-scrollbar-thumb {\\r
    border-radius: 4px;\\r
    background-color: #999;\\r
}\`;

  // src/runtime/player/closed_caption.ts
  var ClosedCaption = class {
    element = {};
    data = {};
    resizeRate = 100;
    subtitle = [];
    ON = \`<svg width="22" height="28" viewbox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m4.07787,6.88102l14,0a2,2 0 0 1 2,2l0,10a2,2 0 0 1 -2,2l-14,0a2,2 0 0 1 -2,-2l0,-10a2,2 0 0 1 2,-2zm5,5.5a1,1 0 1 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0zm8,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0z"/></svg>\`;
    OFF = \`<svg width="22" height="28" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m15.172,21.87103l-11.172,0a2,2 0 0 1 -2,-2l0,-10c0,-0.34 0.084,-0.658 0.233,-0.938l-0.425,-0.426a1,1 0 1 1 1.414,-1.414l15.556,15.556a1,1 0 0 1 -1.414,1.414l-2.192,-2.192zm-10.21,-10.21c-0.577,0.351 -0.962,0.986 -0.962,1.71l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 0.713,-0.958l-1.751,-1.752zm1.866,-3.79l11.172,0a2,2 0 0 1 2,2l0,10c0,0.34 -0.084,0.658 -0.233,0.938l-2.48,-2.48a1,1 0 0 0 -0.287,-1.958l-1.672,0l-1.328,-1.328l0,-0.672a1,1 0 0 1 1,-1l2,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -1.977,1.695l-5.195,-5.195z"/></svg>\`;
    color = [
      { value: "16777215", content: '<span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span>' },
      { value: "16007990", content: '<b style="color:#F44336;text-shadow: #000 0px 0px 1px">红色</b>' },
      { value: "10233776", content: '<b style="color:#9C27B0;text-shadow: #000 0px 0px 1px">紫色</b>' },
      { value: "6765239", content: '<b style="color:#673AB7;text-shadow: #000 0px 0px 1px">深紫色</b>' },
      { value: "4149685", content: '<b style="color:#3F51B5;text-shadow: #000 0px 0px 1px">靛青色</b>' },
      { value: "2201331", content: '<b style="color:#2196F3;text-shadow: #000 0px 0px 1px">蓝色</b>' },
      { value: "240116", content: '<b style="color:#03A9F4;text-shadow: #000 0px 0px 1px">亮蓝色</b>' }
    ];
    position = [
      { value: "bl", content: "左下角" },
      { value: "bc", content: "底部居中" },
      { value: "br", content: "右下角" },
      { value: "tl", content: "左上角" },
      { value: "tc", content: "顶部居中" },
      { value: "tr", content: "右上角" }
    ];
    shadow = [
      { value: "0", content: "无描边", style: "" },
      { value: "1", content: "重墨", style: \`text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px,#000 -1px 0px 1px;\` },
      { value: "2", content: "描边", style: \`text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;\` },
      { value: "3", content: "45°投影", style: \`text-shadow: #000 1px 1px 2px, #000 0px 0px 1px;\` }
    ];
    setting;
    subtitlePrefer;
    isON = false;
    caption;
    contain;
    captions = [];
    text;
    constructor() {
      this.setting = { backgroundopacity: 0.5, color: 16777215, fontsize: 1, isclosed: false, scale: true, shadow: "0", position: "bc" };
      if (isUserScript) {
        const d = GM_getValue("subtitle", this.setting);
        this.setting = new Proxy(d, new ProxyHandler(() => {
          GM_setValue("subtitle", d);
        }));
      } else {
        GM.getValue("subtitle", this.setting).then((d) => {
          this.setting = new Proxy(d, new ProxyHandler(() => {
            GM.setValue("subtitle", d);
          }));
        });
      }
      if (isUserScript) {
        const d = GM_getValue("subtitlePrefer", void 0);
        this.subtitlePrefer = d;
      } else {
        GM.getValue("subtitlePrefer").then((d) => {
          this.subtitlePrefer = d;
        });
      }
    }
    initUI() {
      this.element.node = document.createElement("div");
      this.element.node.setAttribute("class", "bilibili-player-video-btn");
      this.element.node.setAttribute("id", "bilibili-player-subtitle-btn");
      this.element.node.setAttribute("style", "display: block;");
      this.element.span = addElement("span", {}, this.element.node);
      this.element.span.innerHTML = this.ON;
      this.isON = true;
      this.element.span.onclick = () => {
        if (this.isON)
          this.iconSwitch();
        else
          this.iconSwitch(this.caption);
      };
      this.element.table = addElement("div", { id: "subtitle-setting-panel", style: "position: absolute; bottom: 28px; right: 30px; background: white; border-radius: 4px; text-align: left; padding: 13px; display: none; cursor: default;" }, this.element.node);
      this.language();
      this.fontsize();
      this.fontcolor();
      this.fontshadow();
      this.fontposition();
      this.fontopacrity();
      addCss(closed_caption_default);
      this.changeResize();
      this.changePosition();
    }
    changeStyle() {
      document.querySelector("#caption-style")?.remove();
      addCss(\`span.subtitle-item-background{opacity: \${this.setting.backgroundopacity};}
            span.subtitle-item-text {color:#\${("000000" + this.setting.color.toString(16)).slice(-6)};}
            span.subtitle-item {font-size: \${this.setting.fontsize * this.resizeRate}%;line-height: 110%;}
            span.subtitle-item {\${this.shadow[this.setting.shadow].style}}\`, "caption-style");
    }
    changeResize() {
      this.resizeRate = this.setting.scale ? window.player.getWidth() / 1280 * 100 : 100;
      this.changeStyle();
    }
    changePosition() {
      this.contain = document.querySelector(".bilibili-player-video-subtitle>div");
      this.contain.className = "subtitle-position subtitle-position-" + (this.setting.position || "bc");
      this.contain.style = "";
    }
    iconSwitch(caption) {
      if (caption) {
        this.isON = true;
        this.element.span.innerHTML = this.ON;
        this.setCaption(caption);
        this.text.innerHTML = caption.lan_doc;
        this.element.language.children[2].disabled = false;
      } else {
        this.isON = false;
        this.element.span.innerHTML = this.OFF;
        this.setCaption();
        this.text.innerHTML = "关闭";
        this.element.language.children[2].disabled = true;
      }
    }
    language() {
      this.element.language = addElement("div", {}, this.element.table);
      this.element.language.innerHTML = \`<div>字幕</div>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 100px;">
            <div class="bpui-selectmenu-txt">关闭</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 180px; overflow: hidden auto; white-space: nowrap;">
            <li class="bpui-selectmenu-list-row" data-value="close">关闭</li>
            </ul></div>
            <button class="bpui-button" style="padding: 0px 8px;">下载</button>
            <a class="bpui-button" href="https://member.bilibili.com/v2#/zimu/my-zimu/zimu-editor?cid=\${API.cid}&aid=\${API.aid}" target="_blank" title="" style="margin-right: 0px; height: 24px; padding: 0px 6px;">添加字幕</a>\`;
      let list = this.element.language.children[1].children[2];
      this.text = this.element.language.children[1].children[0];
      this.element.language.children[2].onclick = () => {
        this.caption.subtitle_url && fetch(this.caption.subtitle_url).then((d) => {
          d.blob().then((d2) => {
            saveAs(d2, \`\${sessionStorage.getItem("title")}-\${this.caption.lan_doc}.json\`);
          });
        });
      };
      list.children[0].onclick = () => {
        this.text.innerHTML = "关闭";
        this.setCaption();
      };
      this.text.innerHTML = this.caption.lan_doc;
      this.captions = this.captions.reverse();
      this.captions.forEach((d) => {
        let temp2 = addElement("div", { class: "bpui-selectmenu-list-row", "data-value": d.lan }, list, d.lan_doc, true);
        temp2.onclick = () => {
          this.text.innerHTML = d.lan_doc;
          this.iconSwitch(d);
          GM.setValue("subtitlePrefer", JSON.parse(JSON.stringify(this.subtitlePrefer = d.lan)));
        };
      });
    }
    fontsize() {
      this.element.fontsize = addElement("div", {}, this.element.table);
      this.element.fontsize.innerHTML = \`<div>字体大小</div>
            <input type="range" step="25" style="width: 70%;">
            <input id="subtitle-auto-resize" type="checkbox">
            <label for="subtitle-auto-resize" style="cursor: pointer;">自动缩放</label>\`;
      this.element.fontsize.children[1].value = this.setting.fontsize == 0.6 ? 0 : this.setting.fontsize == 0.8 ? 25 : this.setting.fontsize == 1.3 ? 75 : this.setting.fontsize == 1.6 ? 100 : 50;
      this.element.fontsize.children[1].oninput = (e) => {
        const v = e.target.value / 25;
        this.setting.fontsize = v > 2 ? (v - 2) * 0.3 + 1 : v * 0.2 + 0.6;
        this.changeStyle();
      };
      this.element.fontsize.children[2].checked = this.setting.scale;
      this.element.fontsize.children[2].onchange = (e) => this.changeResize(this.setting.scale = e.target.checked);
    }
    fontcolor() {
      this.element.fontcolor = addElement("div", {}, this.element.table);
      this.element.fontcolor.innerHTML = \`<span>字幕颜色</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt"><span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span></div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
      this.color.forEach((d) => {
        if (d.value == this.setting.color)
          this.element.fontcolor.children[1].children[0].innerHTML = d.content;
        let temp2 = addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontcolor.children[1].children[2]);
        temp2.innerHTML = d.content;
        temp2.onclick = () => {
          this.element.fontcolor.children[1].children[0].innerHTML = d.content;
          this.changeStyle(this.setting.color = parseInt(d.value));
        };
      });
    }
    fontshadow() {
      this.element.fontshadow = addElement("div", {}, this.element.table);
      this.element.fontshadow.innerHTML = \`<span>字幕描边</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">无描边</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
      this.shadow.forEach((d) => {
        if (d.value == this.setting.shadow)
          this.element.fontshadow.children[1].children[0].innerHTML = d.content;
        let temp2 = addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontshadow.children[1].children[2]);
        temp2.innerHTML = d.content;
        temp2.onclick = () => {
          this.element.fontshadow.children[1].children[0].innerHTML = d.content;
          this.changeStyle(this.setting.shadow = d.value);
        };
      });
    }
    fontposition() {
      this.element.fontposition = addElement("div", {}, this.element.table);
      this.element.fontposition.innerHTML = \`<span>字幕位置</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">底部居中</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 100px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
      this.position.forEach((d) => {
        if (d.value == this.setting.position)
          this.element.fontposition.children[1].children[0].innerHTML = d.content;
        let temp2 = addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontposition.children[1].children[2]);
        temp2.innerHTML = d.content;
        temp2.onclick = () => {
          this.element.fontposition.children[1].children[0].innerHTML = d.content;
          this.changePosition(this.setting.position = d.value);
        };
      });
    }
    fontopacrity() {
      this.element.fontopacrity = addElement("div", {}, this.element.table);
      this.element.fontopacrity.innerHTML = \`<div>背景不透明度</div><input type="range" style="width: 100%;">\`;
      this.element.fontopacrity.children[1].value = this.setting.backgroundopacity * 100;
      this.element.fontopacrity.children[1].oninput = (e) => {
        this.changeStyle(this.setting.backgroundopacity = e.target.value / 100);
      };
    }
    async getCaption(data) {
      try {
        this.data = [];
        this.subtitle = this.captions = data || [];
        this.convertion(this.captions);
        let i = this.captions.findIndex((d) => d.lan == this.subtitlePrefer);
        i = i < 0 ? 0 : i;
        if (this.captions[i])
          await this.setCaption(this.captions[i]);
        if (this.caption) {
          window.player.addEventListener("video_resize", (event) => {
            this.changeResize(event);
          });
          let anchor = document.querySelector(".bilibili-player-video-btn-quality");
          this.initUI();
          if (!document.querySelector("#bilibili-player-subtitle-btn"))
            anchor.insertAdjacentElement("afterend", this.element.node);
        }
      } catch (e) {
        debug.error("closedCaption.js", e);
      }
    }
    convertion(arr2) {
      let chs = false, base = void 0;
      arr2.forEach((d) => {
        d.lan && (d.lan === "zh-CN" && (chs = true), d.lan === "zh-Hans" && (chs = true), d.lan.includes("zh") && (base = { ...d }));
        setting.downloadOther && pushDownload({
          group: "CC字幕",
          url: d.subtitle_url,
          up: d.lan,
          down: d.lan_doc,
          fileName: \`\${sessionStorage.getItem("title") || \`av\${API.aid}\`}-\${d.lan_doc}.json\`
        });
      });
      if (chs || !base)
        return;
      base.lan = "zh-CN";
      base.lan_doc = "中文（繁=>简）";
      base.convert = true;
      arr2.push(base);
    }
    async setCaption(caption) {
      let data = { body: [] };
      if (caption && caption.subtitle_url) {
        this.data[caption.lan] = this.data[caption.lan] || await (await fetch(caption.subtitle_url.replace("http:", "https:"))).json();
        if (caption.convert) {
          this.data[caption.lan] = JSON.parse(cht2chs(JSON.stringify(this.data[caption.lan])));
          caption.convert = void 0;
        }
        data = this.data[caption.lan] || data;
      }
      window.player.updateSubtitle(data);
      setTimeout(() => {
        if (window.player.getState() == "PLAYING") {
          window.player.pause();
          window.player.play();
        }
      }, 1e3);
      if (caption && caption.subtitle_url) {
        this.caption = caption;
        videoFloat("载入字幕：", this.caption.lan_doc, () => {
        });
      } else
        videoFloat("关闭弹幕");
    }
  };
  var closedCaption = new ClosedCaption();

  // src/runtime/player/seg_progress.ts
  var _SegProgress = class {
    constructor(resp) {
      if (!resp || resp.length == 0)
        return;
      this.init(resp);
    }
    async init(view_points) {
      if (!_SegProgress.cssInited) {
        _SegProgress.cssInited = true;
        addCss(\`
                            .bilibili-progress-segmentation-logo{display:inline-block;position:absolute;top:-12px;height:30px;width:1px; transition: opacity .1s}
                            .bilibili-progress-segmentation-logo>img{position: absolute;top:-14px;transform:translate(-50%,-50%) scale(0.7);left:50%;transition:top 0.1s}
                            .bilibili-progress-segmentation-logo>svg{position: absolute;top: -19px;width: 32px;height: 36px;transform: translate(-50%, -50%)}
                            .bilibili-player.mode-widescreen .bilibili-progress-segmentation-logo>img,
                            .bilibili-player.mode-webfullscreen .bilibili-progress-segmentation-logo>img,
                            .bilibili-player.mode-fullscreen .bilibili-progress-segmentation-logo>img{top:-18px;left:50%;transform:translate(-50%,-50%) scale(1)}
                            .bilibili-progress-segmentation{height:29px;position:absolute;top:-12px}
                            .bilibili-progress-segmentation:hover > div > div{border-color:#fb7299;border-style:solid;border-width:0 2px;width:100%;height:3px;top:6px;left:-2px;position:relative;background:#fb7299}
                            .bilibili-progress-segmentation > div{box-sizing:border-box;border-style:solid;border-color:#fb7299;border-left-width:2px;position:absolute;width:100%;height:6px;top:12px}
                            .bilibili-progress-detail-chapter{top:-96px;position:absolute;width:100%;font-size:17px;font-weight:bold;color:#fff;text-shadow:0 0 5px #000}
                            .bilibili-progress-segmentation:last-child > div{border-right-width:2px}
                            .bilibili-player-filter-chapter:hover{color:#00a1d6}
                            .bilibili-player-chapterList{position:relative;height:100%;width:100%;overflow:auto}
                            .bilibili-player-chapterList::-webkit-scrollbar{width:6px}
                            .bilibili-player-chapterList::-webkit-scrollbar-track{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList::-webkit-scrollbar-thumb{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-track{background-color:#edf2f9}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-thumb{background-color:#a2a2a2}
                            .bilibili-player-chapter-info{width:100%;height:72px;margin-top:5px;white-space:normal;font-size:14px;position:relative;cursor:pointer}
                            .bilibili-player-chapter-info > img{position:absolute;left:15px;top:4px;border-radius:2px}
                            .bilibili-player-chapter-info > p{padding-top:5px;margin:0 5px 5px 138px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;height:43px}
                            .bilibili-player-chapter-info:hover > p{color:#00a1d6}
                            .bilibili-player-chapter-info > span{color:#99a2aa}
                            .bilibili-player-chapter-info.active{background-color:#f3f3f3}\`);
      }
      let sliderTracker = document.querySelector(".bilibili-player-video-progress .bpui-slider-tracker");
      let sliderBar = document.getElementsByClassName("bilibili-player-video-progress-bar")[0];
      let handleWidth = document.getElementsByClassName("bpui-slider-handle")[0].clientWidth;
      let trackerWrp = document.getElementsByClassName("bpui-slider-tracker-wrp")[0];
      let videoDuration = window.player.getDuration();
      let chptName = document.createElement("div");
      chptName.className = "bilibili-progress-detail-chapter";
      document.querySelector(".bilibili-player-video-progress-detail").appendChild(chptName);
      let type = view_points[0].type;
      let segDivs = [];
      for (let v of view_points) {
        let seg = document.createElement("div");
        if (type == "1") {
          seg.className = "bilibili-progress-segmentation-logo";
          let title = document.createElement("div");
          title.innerHTML = "-> " + v.content;
          title.className = "bilibili-progress-detail-chapter";
          title.style.cssText = "width: auto; transform: translateX(-50%); display: none";
          let img;
          if (v.logoUrl) {
            img = document.createElement("img");
            img.id = "segmentation-logo";
            img.width = 32;
            img.height = 36;
            img.src = v.logoUrl;
          } else {
            img = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            img.setAttribute("viewBox", "0 -3 32 36");
            img.innerHTML = \`
                    <defs>
                    <radialGradient id="gradient">
                            <stop offset="10%" stop-color="#ffe78f"></stop>
                            <stop offset="40%" stop-color="#ffe996"></stop>
                            <stop offset="95%" stop-color="#fcecae"></stop>
                        </radialGradient>
                    </defs>
                    <path style="fill: rgb(252, 236, 174); stroke: rgb(252, 236, 174);" d="M 16 32.097 C 13.312 32.106 10.608 30.145 11 25.897 C 11.265 22.744 16 17.097 16 17.097 C 16 17.097 20.822 22.697 21.022 25.897 C 21.322 30.097 18.801 32.088 16 32.097 Z" transform="matrix(-1, 0, 0, -1, 32.021761, 49.196602)"></path>
                    <circle cx="16" cy="22" r="5" fill="url(#gradient)"/>\`;
          }
          img.addEventListener("mousemove", (e) => e.stopPropagation());
          img.addEventListener("mouseenter", () => {
            title.style.display = "";
            img.style.zIndex = "1000";
          });
          img.addEventListener("mouseleave", () => {
            title.style.display = "none";
            img.style.zIndex = "";
          });
          img.addEventListener("click", () => window.player.seek(v.from));
          seg.appendChild(title);
          seg.appendChild(img);
        } else if (type == "2") {
          seg.className = "bilibili-progress-segmentation";
          let duration = view_points[view_points.length - 1].to;
          let ratio = videoDuration / duration / duration;
          seg.style.width = (v.to - v.from) * ratio * 100 + "%";
          seg.style.left = v.from * ratio * 100 + "%";
          seg.innerHTML = "<div><div></div></div>";
          seg.onmouseenter = () => chptName.innerHTML = v.content;
        }
        segDivs.push(seg);
        sliderTracker.appendChild(seg);
      }
      if (type == "1") {
        let update2 = function() {
          for (let i = 0; i < segDivs.length; i++) {
            segDivs[i].style.left = view_points[i].to / videoDuration * (trackerWrp.clientWidth - handleWidth) + handleWidth / 2 + "px";
          }
        }, hide2 = function() {
          if (!visibility)
            return;
          visibility = false;
          for (let i = 0; i < segDivs.length; i++)
            segDivs[i].style.opacity = "0";
          setTimeout(() => {
            for (let i = 0; i < segDivs.length; i++)
              segDivs[i].style.visibility = "hidden";
          }, 100);
        };
        var update = update2, hide = hide2;
        addCss(\`#app #bilibiliPlayer .bilibili-player-video-progress-detail > .bilibili-player-video-progress-detail-img {top:-120px}
                            .bilibili-player-video-progress-detail > .bilibili-player-video-progress-detail-time {top:-48px}\`);
        setTimeout(() => update2(), 500);
        chptName.style.top = "-150px";
        let playerArea = document.getElementsByClassName("bilibili-player-area")[0], visibility = true;
        playerArea.addEventListener("mouseleave", (e) => {
          hide2();
        });
        playerArea.addEventListener("mousemove", (e) => {
          let clientRect = playerArea.getBoundingClientRect();
          if (e.pageY < clientRect.top + window.scrollY + clientRect.height * 0.65) {
            hide2();
          } else {
            visibility = true;
            for (let i = 0; i < segDivs.length; i++) {
              segDivs[i].style.visibility = "";
              segDivs[i].style.opacity = "1";
            }
          }
        });
        trackerWrp.addEventListener("mousemove", (e) => {
          let closestPoint = 1e6;
          let box = sliderBar.getBoundingClientRect();
          let pos = (e.pageX - (box.left + window.scrollX - document.body.clientLeft) - handleWidth / 2) / (trackerWrp.clientWidth - handleWidth) * videoDuration;
          0 > pos && (pos = 0);
          pos > videoDuration && (pos = videoDuration);
          let thumbnailArea = 80 / (trackerWrp.clientWidth - handleWidth) * videoDuration;
          let hitArea = trackerWrp.clientWidth > 400 ? thumbnailArea / 10 : thumbnailArea / 20;
          for (let i = 0; i < view_points.length; i++) {
            segDivs[i].style.zIndex = "";
            if (view_points[i].to >= pos - hitArea && view_points[i].to <= pos + hitArea && Math.abs(view_points[i].to - pos) < closestPoint) {
              chptName.innerHTML = view_points[i].content;
              closestPoint = Math.abs(view_points[i].to - pos);
              segDivs[i].style.zIndex = "1000";
            }
          }
          if (closestPoint == 1e6)
            chptName.innerHTML = "";
        });
        window.player.addEventListener("video_player_resize", () => update2());
        trackerWrp.addEventListener("mouseleave", () => {
          for (let i = 0; i < segDivs.length; i++) {
            segDivs[i].className = "bilibili-progress-segmentation-logo";
          }
        });
      }
      let wrapList = document.querySelector("div.bilibili-player-wraplist");
      let panels = wrapList.children;
      let chptInfo = null;
      let chptPanel = document.createElement("div");
      chptPanel.style.display = "none";
      chptPanel.className = "bilibili-player-filter-wrap bilibili-player-chapterList";
      wrapList.appendChild(chptPanel);
      let chptBtn = document.createElement("div");
      chptBtn.className = "bilibili-player-filter-btn bilibili-player-filter-chapter bpui-component bpui-button bpui-button-type-small button";
      chptBtn.innerHTML = '<span class="bpui-button-text"><span>视频看点</span></span>';
      document.querySelector("div.bilibili-player-filter").appendChild(chptBtn);
      function refreshState() {
        if (!chptInfo)
          return;
        let progress = window.player.getCurrentTime();
        for (let i = 0, v; i < view_points.length; i++) {
          v = view_points[i];
          if (progress < v.to) {
            let active = document.querySelector(".bilibili-player-chapter-info.active");
            active && active.classList.remove("active");
            chptInfo[i].classList.add("active");
            break;
          }
        }
      }
      let timeFormat2 = (t) => t < 10 ? "0" + t : t;
      chptBtn.onclick = () => {
        let activePanel = document.querySelector("div.bilibili-player-filter-btn.active");
        if (activePanel == chptBtn)
          return;
        activePanel.classList.remove("active");
        chptBtn.classList.add("active");
        for (let i = 0; i < panels.length; i++) {
          const element = panels[i];
          if (element.style.display == "block") {
            element.style.display = "none";
            break;
          }
        }
        if (!chptInfo) {
          chptInfo = [];
          for (let i = 0, v; i < view_points.length; i++) {
            v = view_points[i];
            let dura = v.to - v.from;
            let div = document.createElement("div");
            div.className = "bilibili-player-chapter-info";
            div.innerHTML = \`<img width="112" height="63" src="\${v.imgUrl}"/>
                                        <p class="chapter-name">\${v.content}</p>
                                        <span style="margin-left: 138px">\${timeFormat2(Math.floor(v.from / 60))}:\${timeFormat2(v.from % 60)}</span>
                                        <span style="margin-right: 5px; float: right;">\${dura >= 60 ? \`\${Math.floor(dura / 60)}分\` : ""}\${dura > 0 ? \`\${dura % 60}秒\` : ""}</span>\`;
            div.onclick = ((jumpto) => () => {
              window.player.seek(jumpto);
              let active = document.querySelector(".bilibili-player-chapter-info.active");
              active && active.classList.remove("active");
              div.classList.add("active");
            })(v.from);
            chptInfo[i] = div;
            chptPanel.appendChild(div);
          }
        }
        ;
        chptPanel.style.display = "block";
        refreshState();
      };
      window.player.addEventListener("video_media_seeked", refreshState);
      chptPanel.onmouseenter = refreshState;
      class timer2 {
        static handle;
        static start() {
          if (!timer2.handle)
            timer2.handle = setInterval(refreshState, 3e3);
        }
        static stop() {
          if (timer2.handle) {
            clearInterval(timer2.handle);
            timer2.handle = null;
          }
        }
      }
      window.player.addEventListener("video_media_playing", timer2.start);
      window.player.addEventListener("video_media_pause", timer2.stop);
      if (window.player.getState() == "PLAYING")
        timer2.start();
    }
  };
  var SegProgress = _SegProgress;
  __publicField(SegProgress, "cssInited", false);

  // src/runtime/player/playinfo.ts
  function dealwithPlayinfo() {
    xhrhook("/playurl?", (args) => {
      const param2 = urlObj(args[1]);
      args[1].includes("84956560bc028eb7") && (args[1] = urlsign(args[1], {}, 8));
      args[1].includes("pgc") && (API.pgc = true);
      param2.aid && (API.aid = Number(param2.aid)) && (API.aid = param2.aid);
      param2.avid && (API.aid = Number(param2.avid)) && (API.aid = param2.avid);
      param2.cid && (API.cid = Number(param2.cid)) && (API.cid = param2.cid);
      param2.seasonId && (API.ssid = param2.seasonId);
      param2.episodeId && (API.epid = param2.episodeId);
      param2.ep_id && (API.epid = param2.ep_id);
    }, (obj) => {
      try {
        const data = uposReplace(obj.responseType === "json" ? JSON.stringify(obj.response) : obj.response, setting.uposReplace.nor);
        obj.responseType === "json" ? obj.response = JSON.parse(data) : obj.response = obj.responseText = data;
        API.__playinfo__ = data;
        Promise.resolve().then(() => {
          try {
            const d = JSON.parse(data);
            if (d.code === 87005)
              toast.warning(d.message, "请到新版页面付费后继续！");
          } catch (e) {
          }
        });
      } catch (e) {
      }
    }, false);
    let timer2, tag = false;
    xhrhook("api.bilibili.com/x/player.so", () => {
      if (!tag && API.th && API.__INITIAL_STATE__?.epInfo?.subtitles) {
        if (API.__INITIAL_STATE__.epInfo.subtitles[0]) {
          setting.closedCaption && closedCaption.getCaption(API.__INITIAL_STATE__.epInfo.subtitles.reduce((s, d) => {
            s.push({
              ai_type: 0,
              id: d.id,
              id_str: d.id,
              is_lock: false,
              lan: d.key,
              lan_doc: d.title,
              subtitle_url: d.url,
              type: 0
            });
            return s;
          }, []));
          tag = true;
          clearTimeout(timer2);
          timer2 = setTimeout(() => {
            tag = false;
          }, 1e3);
        }
      }
      return true;
    }, (res) => {
      try {
        if (statusCheck(res.status)) {
          let subtitle = "", view_points;
          res.response.replace(/<subtitle>.+?<\\/subtitle>/, (d) => {
            subtitle = d.replace("<subtitle>", "").replace("</subtitle>", "");
          });
          res.response.replace(/<view_points>.+?<\\/view_points>/, (d) => {
            view_points = d.replace("<view_points>", "").replace("</view_points>", "");
          });
          subtitle && setting.closedCaption && closedCaption.getCaption(JSON.parse(subtitle).subtitles);
          view_points && setting.segProgress && new SegProgress(JSON.parse(view_points));
        } else {
          !tag && xhr({
            url: objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: API.cid, aid: API.aid, type: 1 }),
            responseType: "json",
            credentials: true
          }, true).then((data) => {
            setting.closedCaption && data?.data?.subtitle?.subtitles && closedCaption.getCaption(data.data.subtitle.subtitles);
            setting.segProgress && data.data.view_points && data.data.view_points[1] && new SegProgress(data.data.view_points);
          });
          tag = true;
          clearTimeout(timer2);
          timer2 = setTimeout(() => {
            tag = false;
          }, 1e3);
        }
      } catch (e) {
      }
    }, false);
    xhrhookAsync("api.bilibili.com/x/player/carousel.so", void 0, async () => {
      let str = \`<msg><item bgcolor="#000000" catalog="news"><![CDATA[<a href="//app.bilibili.com/?from=bfq" target="_blank"><font color="#ffffff">客户端下载</font></a>]]></item><item bgcolor="#000000" catalog="news"><![CDATA[<a href="http://link.acg.tv/forum.php" target="_blank"><font color="#ffffff">bug反馈传送门</font></a>]]></item></msg>'\`;
      try {
        const arr2 = await Promise.all([
          xhr.get("//api.bilibili.com/pgc/operation/api/slideshow?position_id=531", { responseType: "json" }).then((d) => {
            return d.result.reduce((s, d2, i) => {
              s += \`<item tooltip="" bgcolor="#000000" catalog="bangumi" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="\${d2.blink}" target="_blank"><font color="#FFFFFF">\${d2.title}</font></a>]]></item>\`;
              return s;
            }, "");
          }).catch((e) => {
            debug.error("播放器消息", "bangumi", e);
            return "";
          }),
          xhr.get("https://api.bilibili.com/x/web-show/res/loc?pf=0&id=4694", { responseType: "json" }).then((d) => {
            return d.data.reduce((s, d2, i) => {
              d2.name && (s += \`<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="\${d2.url}" target="_blank"><font color="#FFFFFF">\${d2.name}</font></a>]]></item>\`);
              return s;
            }, "");
          }).catch((e) => {
            debug.error("播放器消息", "system", e);
            return "";
          }),
          xhr.get("https://api.bilibili.com/x/web-interface/search/square?limit=10", { responseType: "json" }).then((d) => {
            return d.data.trending.list.reduce((s, d2, i) => {
              s += \`<item tooltip="" bgcolor="#000000" catalog="news" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="https://search.bilibili.com/all?keyword=\${encodeURIComponent(d2.keyword)}" target="_blank"><font color="#FFFFFF">\${d2.keyword}</font></a>]]></item>\`;
              return s;
            }, "<msg>");
          }).catch((e) => {
            debug.error("播放器消息", "news", e);
            return "";
          })
        ]);
        str = arr2.sort(() => 0.5 - Math.random()).reduce((s, d) => {
          s += d;
          return s;
        }, "<msg>") + "</msg>";
      } catch (e) {
        debug.error("播放器消息", e);
      }
      const dom = new DOMParser().parseFromString(str, "text/xml");
      return {
        response: dom,
        responseXML: dom
      };
    }, false);
  }

  // src/runtime/player/bstar_playurl.ts
  var descriptionMap = {
    127: "超高清 8K",
    126: "杜比视界",
    125: "HDR",
    121: "超清 4K",
    120: "超清 4K",
    116: "高清 1080P60",
    112: "高清 1080P+",
    80: "高清 1080P",
    74: "高清 720P60",
    64: "高清 720P",
    48: "高清 720P",
    32: "清晰 480P",
    16: "流畅 360P",
    15: "流畅 360P",
    6: "流畅 240P",
    5: "流畅 144P"
  };
  var formatMap = {
    127: "hdflv2",
    126: "hdflv2",
    125: "hdflv2",
    121: "hdflv2",
    120: "hdflv2",
    116: "flv_p60",
    112: "hdflv2",
    80: "flv",
    74: "flv720_p60",
    64: "flv720",
    48: "flv720",
    32: "flv480",
    16: "mp4",
    15: "mp4",
    6: "mp4",
    5: "mp4"
  };
  var qualityMap = {
    127: "8K",
    126: "Dolby",
    125: "HDR",
    121: "4K",
    120: "4K",
    116: "1080P60",
    112: "1080P+",
    80: "1080P",
    74: "720P60",
    64: "720P",
    48: "720P",
    32: "480P",
    16: "360P",
    15: "360P",
    6: "240P",
    5: "144P"
  };
  var Playurl = class {
    accept_description = [];
    accept_format = "";
    accept_quality = [];
    bp = 0;
    code = 0;
    dash = {
      audio: [],
      dolby: { audio: [], type: "NONE" },
      duration: 0,
      min_buffer_time: 1.5,
      minBufferTime: 1.5,
      video: []
    };
    fnval = 0;
    fnver = 0;
    format = "flv480";
    from = "local";
    has_paid = false;
    is_preview = 0;
    message = "";
    no_rexcode = 1;
    quality = 32;
    result = "suee";
    seek_param = "start";
    seek_type = "offset";
    status = 2;
    support_formats = [];
    timelength = 0;
    type = "DASH";
    video_codecid = 7;
    video_project = true;
  };
  var codecs = {
    default: {
      30121: "hev1.1.6.L156.90",
      121: "hev1.1.6.L156.90",
      30120: "avc1.64003C",
      120: "avc1.64003C",
      30112: "avc1.640028",
      112: "avc1.640028",
      30102: "hev1.1.6.L120.90",
      102: "hev1.1.6.L120.90",
      30080: "avc1.640028",
      80: "avc1.640028",
      30077: "hev1.1.6.L120.90",
      77: "hev1.1.6.L120.90",
      30064: "avc1.64001F",
      64: "avc1.64001F",
      30066: "hev1.1.6.L120.90",
      66: "hev1.1.6.L120.90",
      30032: "avc1.64001E",
      32: "avc1.64001E",
      30033: "hev1.1.6.L120.90",
      33: "hev1.1.6.L120.90",
      30011: "hev1.1.6.L120.90",
      11: "hev1.1.6.L120.90",
      30016: "avc1.64001E",
      16: "avc1.64001E",
      30006: "avc1.64001E",
      6: "avc1.64001E",
      30005: "avc1.64001E",
      5: "avc1.64001E",
      30280: "mp4a.40.2",
      30232: "mp4a.40.2",
      30216: "mp4a.40.2"
    },
    app: {
      30016: "avc1.64001E",
      16: "avc1.64001E",
      30032: "avc1.64001F",
      32: "avc1.64001F",
      30064: "avc1.640028",
      64: "avc1.640028",
      30080: "avc1.640032",
      80: "avc1.640032",
      30216: "mp4a.40.2",
      30232: "mp4a.40.2",
      30280: "mp4a.40.2"
    }
  };
  var frameRate = {
    30121: "16000/672",
    121: "16000/672",
    30120: "16000/672",
    120: "16000/672",
    30112: "16000/672",
    112: "16000/672",
    30102: "16000/672",
    102: "16000/672",
    30080: "16000/672",
    80: "16000/672",
    30077: "16000/656",
    77: "16000/656",
    30064: "16000/672",
    64: "16000/672",
    30066: "16000/656",
    66: "16000/656",
    30032: "16000/672",
    32: "16000/672",
    30033: "16000/656",
    33: "16000/656",
    30011: "16000/656",
    11: "16000/656",
    30016: "16000/672",
    16: "16000/672",
    30006: "16000/672",
    6: "16000/672",
    30005: "16000/672",
    5: "16000/672"
  };
  var resolution = {
    30121: [3840, 2160],
    121: [3840, 2160],
    30120: [3840, 2160],
    120: [3840, 2160],
    30112: [1920, 1080],
    112: [1920, 1080],
    30102: [1920, 1080],
    102: [1920, 1080],
    30080: [1920, 1080],
    80: [1920, 1080],
    30077: [1920, 1080],
    77: [1920, 1080],
    30064: [1280, 720],
    64: [1280, 720],
    30066: [1280, 720],
    66: [1280, 720],
    30032: [852, 480],
    32: [852, 480],
    30033: [852, 480],
    33: [852, 480],
    30011: [640, 360],
    11: [640, 360],
    30016: [640, 360],
    16: [640, 360],
    30006: [426, 240],
    6: [426, 240],
    30005: [256, 144],
    5: [256, 144]
  };
  function getIdxs(url, duration) {
    let range = Math.round(duration * 3.5);
    range = range < 6e3 ? 6e3 : range;
    return xhr({
      url: url.replace("http:", "https:"),
      responseType: "arraybuffer",
      headers: { "Range": \`bytes=0-\${range}\` }
    });
  }
  var OBJ = {};
  async function bstarPlayurl(ogv) {
    const playurl = new Playurl();
    const set = [];
    playurl.quality = ogv.data.video_info.stream_list[0].stream_info.quality || ogv.data.video_info.quality;
    playurl.format = formatMap[playurl.quality];
    playurl.timelength = ogv.data.video_info.timelength;
    playurl.dash.duration = Math.ceil(playurl.timelength / 1e3);
    playurl.dash.minBufferTime = playurl.dash.min_buffer_time = 1.5;
    await Promise.all(ogv.data.video_info.stream_list.reduce((s, d, i) => {
      if (d.dash_video && d.dash_video.base_url) {
        s.push((async (d2) => {
          OBJ[\`sidx\${API.cid}\`] || (OBJ[\`sidx\${API.cid}\`] = {});
          const id = d2.stream_info.quality || d2.dash_video.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
          playurl.accept_description.push(descriptionMap[id]);
          set.push(formatMap[id]);
          playurl.accept_quality.push(id);
          playurl.support_formats.push({
            description: descriptionMap[id],
            display_desc: qualityMap[id],
            format: formatMap[id],
            new_description: descriptionMap[id],
            quality: id,
            superscript: ""
          });
          if (!OBJ[\`sidx\${API.cid}\`][id]) {
            let data = new Uint8Array(await getIdxs(d2.dash_video.base_url, playurl.dash.duration));
            let hex_data = Array.prototype.map.call(data, (x) => ("00" + x.toString(16)).slice(-2)).join("");
            let indexRangeStart = hex_data.indexOf("73696478") / 2 - 4;
            let indexRagneEnd = hex_data.indexOf("6d6f6f66") / 2 - 5;
            OBJ[\`sidx\${API.cid}\`][id] = ["0-" + String(indexRangeStart - 1), String(indexRangeStart) + "-" + String(indexRagneEnd)];
            debug("DASH-video：", id, OBJ[\`sidx\${API.cid}\`][id]);
          }
          playurl.dash.video.push({
            SegmentBase: {
              Initialization: OBJ[\`sidx\${API.cid}\`][id][0],
              indexRange: OBJ[\`sidx\${API.cid}\`][id][1]
            },
            segment_base: {
              initialization: OBJ[\`sidx\${API.cid}\`][id][0],
              index_range: OBJ[\`sidx\${API.cid}\`][id][1]
            },
            backupUrl: [],
            backup_url: [],
            bandwidth: d2.dash_video.bandwidth,
            baseUrl: d2.dash_video.base_url,
            base_url: d2.dash_video.base_url,
            codecid: d2.dash_video.codecid,
            codecs: codecs.app[id] || codecs.default[id],
            frameRate: frameRate[id],
            frame_rate: frameRate[id],
            height: resolution[id] && resolution[id][1],
            id: d2.stream_info.quality,
            md5: d2.dash_video.md5,
            mimeType: "video/mp4",
            mime_type: "video/mp4",
            sar: "1:1",
            size: d2.dash_video.size,
            startWithSAP: 1,
            start_with_sap: 1,
            width: resolution[id] && resolution[id][0]
          });
        })(d));
      }
      !i && ogv.data.video_info.dash_audio.forEach((d2) => {
        s.push((async (d3) => {
          OBJ[\`sidx\${API.cid}\`] || (OBJ[\`sidx\${API.cid}\`] = {});
          const id = d3.id || d3.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
          if (!OBJ[\`sidx\${API.cid}\`][id]) {
            let data = new Uint8Array(await getIdxs(d3.base_url, playurl.dash.duration));
            let hex_data = Array.prototype.map.call(data, (x) => ("00" + x.toString(16)).slice(-2)).join("");
            let indexRangeStart = hex_data.indexOf("73696478") / 2 - 4;
            let indexRagneEnd = hex_data.indexOf("6d6f6f66") / 2 - 5;
            OBJ[\`sidx\${API.cid}\`][id] = ["0-" + String(indexRangeStart - 1), String(indexRangeStart) + "-" + String(indexRagneEnd)];
            debug("DASH-video：", id, OBJ[\`sidx\${API.cid}\`][id]);
          }
          playurl.dash.audio.push({
            SegmentBase: {
              Initialization: OBJ[\`sidx\${API.cid}\`][id][0],
              indexRange: OBJ[\`sidx\${API.cid}\`][id][1]
            },
            segment_base: {
              initialization: OBJ[\`sidx\${API.cid}\`][id][0],
              index_range: OBJ[\`sidx\${API.cid}\`][id][1]
            },
            backupUrl: [],
            backup_url: [],
            bandwidth: d3.bandwidth,
            baseUrl: d3.base_url,
            base_url: d3.base_url,
            codecid: d3.codecid,
            codecs: codecs.app[id] || codecs.default[id],
            frameRate: "",
            frame_rate: "",
            height: 0,
            id,
            md5: d3.md5,
            mimeType: "audio/mp4",
            mime_type: "audio/mp4",
            sar: "",
            size: d3.size,
            startWithSAP: 0,
            start_with_sap: 0,
            width: 0
          });
        })(d2));
      });
      return s;
    }, []));
    const avc = [], hev = [], video = [];
    playurl.dash.video.forEach((d) => {
      if (d.codecid == 7)
        avc.push(d);
      else
        hev.push(d);
    });
    let length = avc.length > hev.length ? avc.length : hev.length;
    for (let i = length - 1; i >= 0; i--) {
      if (avc[i])
        video.push(avc[i]);
      if (hev[i])
        video.push(hev[i]);
    }
    playurl.dash.video = video;
    playurl.accept_format = set.join(",");
    playurl.quality > 80 && (playurl.quality = 80);
    return playurl;
  }

  // src/runtime/player/video_limit.ts
  var Backup = {};
  var HookTimeOut = class {
    hook;
    constructor() {
      this.hook = setTimeout;
      window.setTimeout = (...args) => {
        if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
          toast.warning("禁用播放器强制初始化！", ...args);
          return Number.MIN_VALUE;
        }
        return this.hook.call(window, ...args);
      };
    }
    relese() {
      window.setTimeout = this.hook;
    }
  };
  async function customServer(obj, area) {
    if (area === "tw" && !setting.videoLimit.tw)
      return customServer(obj, "hk");
    if (area === "hk" && !setting.videoLimit.hk)
      return customServer(obj, "cn");
    if (area === "cn" && !setting.videoLimit.cn)
      throw "无有效代理服务器地址";
    try {
      Object.assign(obj, {
        area,
        build: 6720300,
        device: "android",
        force_host: 2,
        mobi_app: "android",
        platform: "android",
        ts: new Date().getTime()
      });
      const result = jsonCheck(await xhr({
        url: urlsign(\`https://\${setting.videoLimit[area]}/pgc/player/api/playurl\`, obj, 2)
      }));
      if (result.code !== 0)
        throw result;
      return result;
    } catch (e) {
      debug.error("代理服务器", setting.videoLimit[area], e);
      if (area === "tw")
        return customServer(obj, "hk");
      if (area === "hk")
        return customServer(obj, "cn");
      toast.error("代理服务器", setting.videoLimit[area], e);
      throw "所有代理服务器都已失败！";
    }
  }
  function videoLimit() {
    xhrhookAsync("/playurl?", () => API.limit || API.th, async (args, type) => {
      let response;
      const obj = urlObj(args[1]);
      obj.seasonId && (API.ssid = obj.seasonId);
      obj.episodeId && (API.epid = obj.episodeId);
      obj.ep_id && (API.epid = obj.ep_id);
      obj.aid && (API.aid = Number(obj.aid)) && (API.aid = obj.aid);
      obj.avid && (API.aid = Number(obj.avid)) && (API.aid = obj.avid);
      obj.cid && (API.cid = Number(obj.cid)) && (API.cid = obj.cid);
      const hookTimeout = new HookTimeOut();
      const epid = obj.ep_id || obj.episodeId || API.epid;
      const accesskey = setting.accessKey.key || void 0;
      obj.access_key = accesskey;
      Backup[epid] && (response = Backup[epid]);
      if (!response) {
        if (API.th) {
          Object.assign(obj, {
            area: "th",
            build: 1001310,
            device: "android",
            force_host: 2,
            download: 1,
            mobi_app: "bstar_a",
            platform: "android",
            ts: new Date().getTime()
          });
          try {
            toast.info("尝试解除区域限制... 访问代理服务器");
            response = jsonCheck(uposReplace(await xhr({
              url: urlsign(\`https://\${setting.videoLimit.th || "api.global.bilibili.com"}/intl/gateway/v2/ogv/playurl\`, obj, 12)
            }), setting.uposReplace.th));
            response = { "code": 0, "message": "success", "result": await bstarPlayurl(response) };
            toast.success(\`解除区域限制！aid=\${API.aid}, cid=\${API.cid}\`);
          } catch (e) {
            toast.error("解除限制失败 ಥ_ಥ");
            debug.error("解除限制失败 ಥ_ಥ", e);
            if (!accesskey) {
              toast.warning("这似乎是一个泰区限制视频，需要授权解析服务器使用您的账户才能尝试解析，请到设置里进行【账户授权】。<strong>但这意味着解析服务器会获得您账户的部分权限，请务必确认对反的可靠性然后操作！</strong>");
            }
            response = { "code": -404, "message": e, "data": null };
          }
        } else if (API.limit) {
          obj.module = window.__INITIAL_STATE__?.upInfo?.mid == 1988098633 || window.__INITIAL_STATE__?.upInfo?.mid == 2042149112 ? "movie" : "bangumi";
          obj.fnval && (obj.fnval = String(fnval));
          try {
            toast.info("尝试解除区域限制... 访问代理服务器");
            setting.uposReplace.gat !== "不替换" && window.postMessage({ \$type: "th" });
            response = setting.videoLimit.server === "内置" ? jsonCheck(await xhr({
              url: objUrl("https://www.biliplus.com/BPplayurl.php", obj)
            })) : (delete obj.module, await customServer(obj, "tw"));
            response = JSON.parse(uposReplace(JSON.stringify(response), setting.uposReplace.gat));
            response = { "code": 0, "message": "success", "result": response };
            toast.success(\`解除区域限制！aid=\${API.aid}, cid=\${API.cid}\`);
          } catch (e) {
            toast.error("解除限制失败 ಥ_ಥ");
            debug.error("解除限制失败 ಥ_ಥ", e);
            if (setting.videoLimit.server === "自定义") {
              toast.warning("您将代理服务器设置为【自定义】，服务器返回出错，这可能是您由于未进行【账户授权】或者授权过期，请到设置里进行【账户授权】。");
            }
            response = { "code": -404, "message": e, "data": null };
          }
        }
      }
      hookTimeout.relese();
      if (response.code === -404)
        throw type === "json" ? { response } : {
          response: JSON.stringify(response),
          responseText: JSON.stringify(response)
        };
      Backup[epid] = response;
      API.__playinfo__ = response;
      return type === "json" ? { response } : {
        response: JSON.stringify(response),
        responseText: JSON.stringify(response)
      };
    }, false);
  }

  // src/runtime/player/load_bilibili_player.ts
  async function loadBilibiliPlayer() {
    if (!window.jQuery)
      await loadScript("//static.hdslb.com/js/jquery.min.js");
    if (isUserScript) {
      const player2 = GM_getResourceText("bilibiliPlayer.js");
      if (player2)
        return new Function(GM_getResourceText("bilibiliPlayer.js"))();
      return loadScript("//static.hdslb.com/player/js/bilibiliPlayer.min.js").then(() => {
        toast.warning("bilibiliPlayer.min.js 已回滚~", "当前可能无法访问 jsdelivr ！", "反查弹幕发送者等部分播放器增强功能暂时无法使用🤣");
      });
    }
    return await loadScript(\`chrome-extension://\${sessionStorage.getItem("bilibili-old")}/bilibili/bilibiliPlayer.js\`);
  }

  // src/runtime/player/embed_player.ts
  var _EmbedPlayer = class {
    playerParam;
    playerType;
    upgrade;
    callbackFn;
    flashAddEvents = [];
    flashRemoveEvents = [];
    pageno = void 0;
    bofqi = document.querySelector("#bofqi");
    get gray_html5() {
      return !setting.flash;
    }
    set gray_html5(v) {
      setting.flash = !v;
    }
    constructor(player2, swf, playerParams, playerType, upgrade, callbackFn, bofqi) {
      this.playerParam = urlObj(\`?\${playerParams}\`);
      this.playerParam.dashSymbol = true;
      this.playerType = playerType;
      this.upgrade = upgrade;
      this.callbackFn = callbackFn;
      Object.entries(this.playerParam).forEach((d) => {
        Reflect.set(window, ...d);
      });
      this.playerParam.seasonId && (API.ssid = this.playerParam.seasonId);
      this.playerParam.episodeId && (API.epid = this.playerParam.episodeId);
      (_EmbedPlayer.asWide || setting.automate.screenWide) && (this.playerParam.as_wide = 1);
      setting.automate.autoPlay && (this.playerParam.autoplay = 1);
      this.gray_loader();
      API.playerParam = this.playerParam;
    }
    loadScript(src, onload) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.addEventListener("load", () => {
        script.remove();
        onload && onload();
      });
      script.addEventListener("error", (e) => {
        script.remove();
        toast.error("加载播放器脚本失败！", e.message);
      });
      document.body.appendChild(script);
    }
    loadHtml5Player() {
      if (!window.bilibiliPlayer) {
        loadBilibiliPlayer().then(() => {
          this.bofqi.innerHTML = '<div class="player"><div id="bilibiliPlayer"></div></div><div id="player_placeholder"></div>';
          window.player = new window.bilibiliPlayer(this.playerParam);
          this.gray_html5_compatible();
        });
      } else {
        this.bofqi.innerHTML = '<div class="player"><div id="bilibiliPlayer"></div></div><div id="player_placeholder"></div>';
        window.player = new window.bilibiliPlayer(this.playerParam);
        this.gray_html5_compatible();
      }
    }
    eventMaps = {
      "jwplayerMediaBuffer": "video_media_buffer",
      "jwplayerMediaBufferFull": "video_media_buffer_full",
      "jwplayerMediaComplete": "video_media_ended",
      "jwplayerMediaError": "video_media_error",
      "jwplayerMediaLoaded": "video_media_loaded",
      "jwplayerMediaMute": "video_media_mute",
      "jwplayerMediaSeek": "video_media_seek",
      "jwplayerMediaTime": "video_media_time",
      "jwplayerMediaVolume": "video_media_volume"
    };
    apiMaps = {
      "mukio_reloadAccess": "reloadAccess",
      "jwPlay": "play",
      "jwPause": "pause",
      "jwStop": "stop",
      "jwSeek": "seek",
      "jwPlaylistPrev": "prev",
      "jwPlaylistNext": "next",
      "jwGetBuffer": "getBufferRate",
      "jwGetDuration": "getDuration",
      "jwGetFullscreen": "isFullScreen",
      "jwGetWidth": "getWidth",
      "jwGetHeight": "getHeight",
      "jwGetMute": "isMute",
      "jwSetMute": "setMute",
      "jwGetPlaylist": "getPlaylist",
      "jwGetPlaylistIndex": "getPlaylistIndex",
      "jwGetPosition": "getCurrentTime",
      "jwGetState": "getState",
      "jwGetVersion": "getVersion",
      "jwGetVolume": "volume",
      "jwSetVolume": "volume"
    };
    cElement = void 0;
    gray_html5_compatible() {
      this.setActionHandler();
      this.cElement = this.bofqi.querySelector("#player_placeholder");
      Object.entries(this.apiMaps).forEach((d) => {
        this.cElement[d[0]] = function() {
          if (window.player && "function" == typeof window.player[d[1]]) {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
              t[n] = arguments[n];
            return window.player[d[1]].apply(window.player, t);
          }
          return false;
        };
      });
      Reflect.set(this.cElement, "jwAddEventListener", (type, callback) => {
        var callbackString = "", _callback;
        try {
          "function" != typeof callback && (callbackString = new Function(callback));
        } catch (e) {
          callbackString = function() {
          };
        }
        this.eventMaps[type] && (_callback = callbackString || callback, window.player && window.player.addEventListener && window.player.addEventListener(this.eventMaps[type], _callback));
      });
      Reflect.set(this.cElement, "jwRemoveEventListener", (e) => {
        this.eventMaps[e] && window.player && window.player.removeEventListener && window.player.removeEventListener(this.eventMaps[e]);
      });
      "function" == typeof this.callbackFn && this.cElement.jwAddEventListener("jwplayerMediaLoaded", () => this.callbackFn());
      "function" == typeof window.PlayerMediaLoaded && window.PlayerMediaLoaded();
    }
    setActionHandler() {
      navigator.mediaSession.setActionHandler("play", () => window.player.play());
      navigator.mediaSession.setActionHandler("pause", () => window.player.pause());
      navigator.mediaSession.setActionHandler("seekbackward", () => window.player.seek(window.player.getCurrentTime() - 10));
      navigator.mediaSession.setActionHandler("seekforward", () => window.player.seek(window.player.getCurrentTime() + 10));
      navigator.mediaSession.setActionHandler("previoustrack", () => window.player.prev());
      navigator.mediaSession.setActionHandler("nexttrack", () => window.player.next());
    }
    flashChecker() {
      let e = false, t = 0;
      if (!!/msie [\\w.]+/.exec(navigator.userAgent.toLowerCase()) && !/Edge/i.test(navigator.userAgent) || /Trident/i.test(navigator.userAgent)) {
        try {
          var n = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash");
          if (n) {
            e = true;
            var r = n.GetVariable("\$version");
            t = parseInt(r.split(" ")[1].split(",")[0], 10);
          }
        } catch (e2) {
          console.error(e2);
        }
      } else if (navigator.plugins && 0 < navigator.plugins.length) {
        var i = navigator.plugins["Shockwave Flash"];
        if (i) {
          e = true;
          for (var a = i.description.split(" "), o = 0; o < a.length; ++o)
            isNaN(parseInt(a[o], 10)) || (t = parseInt(a[o], 10));
        }
      }
      return {
        hasFlash: e,
        flashVersion: t
      };
    }
    gray_loader_flash() {
      this.playerParam.aid && (window.aid = this.playerParam.aid);
      this.playerParam.cid && (window.cid = this.playerParam.cid);
      this.flashChecker().hasFlash ? window.swfobject && window.swfobject.embedSWF ? this.loadFlashPlayer() : this.loadScript("//static.hdslb.com/js/swfobject.js", () => this.loadFlashPlayer()) : this.getNoFlashTips();
    }
    getNoFlashTips() {
      window.NoFlashTips ? this.createNoFlashTipsInstance() : this.loadScript("//static.hdslb.com/player/noflashtips/no-flash-tips.min.js", () => this.createNoFlashTipsInstance());
    }
    createNoFlashTipsInstance() {
      const msg = {
        backgroundColor: "white",
        msg: "主人，未安装Flash插件，暂时无法观看视频，您可以…",
        msgColor: "#000",
        msgSize: 14,
        btnList: [
          {
            title: "下载Flash插件",
            width: 166,
            height: 40,
            type: "flash",
            theme: "white"
          },
          {
            title: "使用HTML5播放器",
            width: 166,
            height: 40,
            type: "html5",
            theme: "blue",
            onClick: (e) => {
              this.gray_html5 = true, this.loadHtml5Player(), "function" == typeof e && e();
            }
          }
        ],
        hasOrText: false
      };
      new window.NoFlashTips(this.bofqi, msg);
      this.bofqi.style.removeProperty("position");
    }
    loadFlashPlayer() {
      this.bofqi.innerHTML = '<div id="player_placeholder" class="player"></div>';
      window.swfobject.embedSWF(this.upgrade ? "//static.hdslb.com/play_recommend.swf" : "//static.hdslb.com/play.swf", "player_placeholder", "950", "482", "0", "", this.playerParam, {
        bgcolor: "#ffffff",
        allowfullscreeninteractive: "true",
        allowfullscreen: "true",
        quality: "high",
        allowscriptaccess: "always",
        wmode: /Firefox/.test(navigator.userAgent) ? "opaque" : "direct"
      }, {
        class: "player"
      }, () => {
        "function" == typeof this.callbackFn && this.callbackFn();
        "function" == typeof window.PlayerMediaLoaded && window.PlayerMediaLoaded();
        this.gray_flash_compatible();
      });
    }
    gray_flash_compatible() {
      this.cElement = this.bofqi.querySelector("#player_placeholder");
      window.player = {};
      Object.entries(this.apiMaps).forEach((d) => {
        this.cElement[d[0]] = function() {
          if (window.player && "function" == typeof window.player[d[1]]) {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
              t[n] = arguments[n];
            return window.player[d[1]].apply(window.player, t);
          }
          return false;
        };
        window.player[d[1]] = () => {
          if (typeof this.cElement[d[0]] === "function") {
            return this.cElement[d[0]].apply(this.cElement, arguments);
          }
        };
      });
      Reflect.set(this.cElement, "jwAddEventListener", () => {
        this.cElement["jwAddEventListener"].apply(this, arguments);
      });
      Reflect.set(this.cElement, "jwRemoveEventListener", () => {
        this.cElement["jwRemoveEventListener"].apply(this, arguments);
      });
      const eventMaps = {
        "video_media_buffer": "jwplayerMediaBuffer",
        "video_media_buffer_full": "jwplayerMediaBufferFull",
        "video_media_ended": "jwplayerMediaComplete",
        "video_media_error": "jwplayerMediaError",
        "video_media_loaded": "jwplayerMediaLoaded",
        "video_media_mute": "jwplayerMediaMute",
        "video_media_seek": "jwplayerMediaSeek",
        "video_media_time": "jwplayerMediaTime",
        "video_media_volume": "jwplayerMediaVolume"
      };
      window.player["addEventListener"] = (type, callback) => {
        try {
          if (typeof callback !== "function") {
            callback = new Function(callback);
          }
        } catch (e) {
          callback = function() {
          };
        }
        if (eventMaps[type]) {
          this.flashAddEvents.push([type, callback]);
        }
      };
      window.player["removeEventListener"] = (type) => {
        if (eventMaps[type]) {
          for (var i = this.flashAddEvents.length - 1; i > 0; i--) {
            if (this.flashAddEvents[i][0] == type) {
              this.flashAddEvents.splice(i, 1);
            }
          }
        }
      };
      Object.entries(eventMaps).forEach((d) => {
        this.cElement["jwAddEventListener"](d[1], () => {
          this.callFunction(d[0]);
        });
      });
    }
    callFunction(type) {
      const eventMaps = {
        "video_media_buffer": "jwplayerMediaBuffer",
        "video_media_buffer_full": "jwplayerMediaBufferFull",
        "video_media_ended": "jwplayerMediaComplete",
        "video_media_error": "jwplayerMediaError",
        "video_media_loaded": "jwplayerMediaLoaded",
        "video_media_mute": "jwplayerMediaMute",
        "video_media_seek": "jwplayerMediaSeek",
        "video_media_time": "jwplayerMediaTime",
        "video_media_volume": "jwplayerMediaVolume"
      };
      if (eventMaps[type]) {
        for (var i = 0; i < this.flashAddEvents.length; i++) {
          this.flashAddEvents[i] && this.flashAddEvents[i][0] == type && this.flashAddEvents[i][1]();
        }
      }
    }
    loadExtraMenuConfig(type) {
      let v = "20161115", exconfig = [];
      if (type === "flash" || type === "flash_gray") {
        if (this.gray_html5) {
          exconfig.push({ label: "HTML5播放器", id: "change_h5" });
          exconfig.push({ label: "Flash播放器", id: "change_flash", active: true });
        }
      } else {
        exconfig.push({ label: "HTML5播放器", id: "change_h5", active: true });
        exconfig.push({ label: "Flash播放器", id: "change_flash" });
      }
      return { "ver": v, "menuItems": exconfig };
    }
    clickMenu(id) {
      setTimeout(() => {
        if (id === "change_h5") {
          this.gray_html5 = true;
          this.gray_loader();
        } else if (id === "change_flash") {
          this.gray_html5 = false;
          window.player && window.player.destroy && window.player.destroy();
          this.gray_loader();
        }
      });
    }
    gray_loader() {
      if (!this.bofqi)
        return debug.warn("播放器节点未初始化，请稍候~", this.playerParam);
      this.init_bgray_btn();
      "html5" === this.playerType || this.gray_html5 ? this.loadHtml5Player() : this.gray_loader_flash();
    }
    feedback = void 0;
    bgray_btn = [
      {
        tagName: "div",
        props: { class: "bgray-btn show bgray-btn-feedback" },
        children: [
          {
            tagName: "text",
            text: "播放"
          },
          {
            tagName: "br"
          },
          {
            tagName: "text",
            text: "问题"
          },
          {
            tagName: "br"
          },
          {
            tagName: "text",
            text: "反馈"
          }
        ],
        event: {
          click: (e) => {
            const gray = e.target;
            this.feedback ? this.feedback.show() : window.FeedBackInstance ? (this.feedback = new window.FeedBackInstance(), this.feedback.show()) : (gray.classList.add("player-feedback-disable"), this.loadScript("//static.hdslb.com/player/feedback/feedback.min.js", () => {
              gray.classList.remove("player-feedback-disable");
              this.feedback = window.FeedBackInstance && new window.FeedBackInstance();
              this.feedback && this.feedback.show();
            }));
          }
        }
      },
      {
        tagName: "div",
        props: { class: "bgray-btn show bgray-btn-help" },
        children: [{ tagName: "text", text: "帮助" }],
        event: {
          click: () => {
            window.open("//www.bilibili.com/blackboard/help.html#常见播放问题自救方法");
          }
        }
      }
    ];
    append_bgray_btn(title, callback, className) {
      const vdom = {
        tagName: "div",
        props: { class: \`bgray-btn show bgray-btn-\${className || "any"}\` },
        children: [],
        event: {
          click: () => {
            callback();
          }
        }
      };
      const arr2 = title.split("");
      while (arr2.length) {
        let str = arr2.shift() || "";
        str += arr2.shift() || "";
        if (str) {
          vdom.children?.length && vdom.children?.push({ tagName: "br" });
          vdom.children?.push({
            tagName: "text",
            text: str
          });
        }
      }
      this.bgray_btn.push(vdom);
      this.init_bgray_btn();
    }
    init_bgray_btn() {
      const prt = this.bofqi.parentElement;
      prt.appendChild(createElement({
        tagName: "div",
        props: { class: "bgray-btn-wrap" },
        children: this.bgray_btn
      }));
      document.head.appendChild(createElements(htmlVnode(bgray_btn_default)));
    }
  };
  var EmbedPlayer = _EmbedPlayer;
  __publicField(EmbedPlayer, "asWide", false);
  var GrayManager = class extends EmbedPlayer {
    codec;
    constructor(player2, swf, playerParams, playerType, upgrade, callbackFn) {
      super(player2, swf, playerParams, playerType, upgrade, callbackFn);
      let codecId = {
        "AVC": 7,
        "HEVC": 12,
        "AV1": 13
      };
      this.codec = {
        preference: codecId[setting.codecType],
        support: {}
      };
      let mime = {
        "AVC": 'video/mp4;codecs="avc1.640028"',
        "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
        "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"'
      };
      for (let i in mime) {
        this.codec.support[codecId[i]] = MediaSource.isTypeSupported(mime[i]);
      }
      location.href.includes("t=") && (this.playerParam.p = this.GetUrlValue("t"));
      location.href.includes("d=") && (this.playerParam.d = this.GetUrlValue("d"));
      location.href.includes("lastplaytime=") && (this.playerParam.lastplaytime = this.GetUrlValue("lastplaytime"));
    }
    reload(playerParams) {
      if (this.playerParam) {
        try {
          window.swfobject && window.swfobject.removeSWF("player_placeholder"), window.player && window.player.pause(), window.player && window.player.destroy && window.player.destroy(), (this.HashManage.get("page") || this.GetUrlValue("p")) && (window.pageno = this.HashManage.get("page") || this.GetUrlValue("p") || 1, this.pageno = window.pageno);
        } catch (e) {
          console.log(e);
        }
        this.playerParam = urlObj(\`?\${playerParams}\`) || this.playerParam;
        this.playerParam.dashSymbol = true;
        this.playerParam && (Reflect.set(window, "aid", this.playerParam.aid), Reflect.set(window, "cid", this.playerParam.cid));
        this.gray_loader();
      } else
        window.location.reload();
    }
    HashManage = {
      p: function(e) {
        return (this.p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
          return typeof e2;
        } : function(e2) {
          return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
        })(e);
      },
      prependHash: "!",
      _change: function(e, t) {
        var n, r = location.hash, i = [], a = "", o = 0, s = {};
        r && (r = r.substring(1), this.prependHash && (r = r.replace(new RegExp("^".concat(this.prependHash.replace(/[-[\\]{}()*+?.,\\\\^\$|#\\s]/g, "\\\\\$&"))), ""))), i = r.split("&");
        for (var u = 0; u < i.length; u++) {
          var l = i[u].split("=")[0], d = i[u].split("=")[1];
          l && (s[l] = decodeURIComponent(d));
        }
        if ("object" === this.p(e)) {
          n = Object.keys(e).length;
          for (var f = 0; f < n; f++) {
            var c = e[n[f]];
            c ? s[n[f]] = encodeURIComponent(c) : false === c && delete s[n[f]];
          }
        } else if (t)
          s[e] = encodeURIComponent(t);
        else {
          if (false !== t)
            return void 0 === e ? s : s[e] || null;
          delete s[e];
        }
        n = Object.keys(s);
        for (var h = 0; h < n.length; h++)
          a += 0 !== o ? "&" : this.prependHash, a += "".concat(n[h], "=").concat(s[n[h]]), o += 1;
        return location.hash = a, s;
      },
      get: function(e) {
        return this._change(e, null);
      },
      set: function(e, t) {
        return this._change(e, t);
      },
      clear: function() {
        location.hash = "";
      }
    };
    GetUrlValue(e) {
      var t = new RegExp("(^|&)".concat(e, "=([^&]*)(&|\$)"), "i"), n = window.location.search.substr(1).match(t);
      if (null != n)
        try {
          return decodeURIComponent(n[2]);
        } catch (e2) {
          return null;
        }
      return null;
    }
  };
  function loadVideoScript(bofqi, asWide = false) {
    Object.defineProperty(window, "EmbedPlayer", {
      configurable: true,
      get: () => (player2, swf, playerParams, playerType, upgrade, callbackFn) => {
        try {
          delete window.__playinfo__;
          asWide && (EmbedPlayer.asWide = true);
          bofqi && (document.querySelector(bofqi).id = "bofqi");
          window.GrayManager = new GrayManager(player2, swf, playerParams, playerType, upgrade, callbackFn);
        } catch (e) {
          toast.error("EmbedPlayer 启动播放器出错~");
          debug.error("EmbedPlayer 启动播放器出错~", e);
        }
      },
      set: () => true
    });
    playerKeyMap();
  }
  setting.danmakuHashId && danmakuHashId();
  setting.heartbeat && xhrhook(["api.bilibili.com/x/report/web/heartbeat"], function(args) {
    args[1] = args[1].replace("api.bilibili.com/x/report/web/heartbeat", "api.bilibili.com/x/click-interface/web/heartbeat");
  }, void 0, false);
  setting.videoLimit.switch && videoLimit();
  loadDanmakuEngine();
  dealwithPlayinfo();
  automate();

  // src/content/comment.ts
  var Feedback;
  var loading = false;
  var load2 = false;
  function loadComment() {
    Object.defineProperty(window, "bbComment", {
      configurable: true,
      set: (v) => {
        Feedback = v;
        bbCommentModify();
        Object.defineProperty(window, "bbComment", { configurable: true, value: Feedback });
      },
      get: () => Feedback
    });
    Object.defineProperty(window, "initComment", {
      configurable: true,
      set: (v) => true,
      get: () => {
        if (load2) {
          let initComment2 = function(tar, init2) {
            new Feedback(tar, init2.oid, init2.pageType, init2.userStatus);
          };
          var initComment = initComment2;
          Object.defineProperty(window, "initComment", { configurable: true, value: initComment2 });
          return initComment2;
        }
        return function() {
          if (!loading) {
            loadScript(\`//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js\`).then(() => {
              load2 = true;
            });
          }
          loading = true;
          setTimeout(() => window.initComment(...arguments), 100);
        };
      }
    });
  }
  function bbCommentModify() {
    Feedback.prototype.initAbtest = function() {
      this.abtest = {};
      this.abtest.optimize = false;
      if (this.jumpId || this.noPage) {
        this.abtest.optimize = false;
      }
      if (this.appMode === "comic") {
        this.abtest.optimize = false;
      }
      this._registerEvent();
      this.init();
    };
    Feedback.prototype._renderBottomPagination = function(pageInfo) {
      if (this.noPage) {
        var isLastPage = pageInfo.count <= this.pageSize;
        var html = "";
        if (isLastPage) {
          html = "没有更多了～";
        } else {
          html = '<a class="more-link" href="javascript:">查看更多评论</a>';
        }
        this.\$root.find(".bottom-page").addClass("center").html(html);
        return;
      }
      const count = Math.ceil(pageInfo.count / pageInfo.size);
      if (count > 1) {
        this.\$root.find(".header-interaction").addClass("paging-box").paging({
          pageCount: count,
          current: pageInfo.num,
          backFn: (p) => {
            this.\$root.trigger("replyPageChange", {
              p,
              isBottom: true
            });
            this.trigger("replyPageChange", {
              p,
              isBottom: true
            });
            this.currentPage = p;
          }
        });
        this.\$root.find(".bottom-page").paging({
          pageCount: count,
          current: pageInfo.num,
          jump: true,
          smallSize: this.smallPager,
          backFn: (p) => {
            this.\$root.trigger("replyPageChange", {
              p,
              isBottom: true
            });
            this.trigger("replyPageChange", {
              p,
              isBottom: true
            });
            this.currentPage = p;
          }
        });
      } else {
        this.\$root.find(".header-page").html("");
        this.\$root.find(".bottom-page").html("");
      }
    };
    Feedback.prototype._createListCon = function(item, i, pos) {
      const blCon = this._parentBlacklistDom(item, i, pos);
      const con = [
        '<div class="con ' + (pos == i ? "no-border" : "") + '">',
        '<div class="user">' + this._createNickNameDom(item),
        this._createLevelLink(item),
        this._identity(item.mid, item.assist, item.member.fans_detail),
        this._createNameplate(item.member.nameplate) + this._createUserSailing(item) + "</div>",
        this._createMsgContent(item),
        this._createPerfectReply(item),
        '<div class="info">',
        item.floor ? '<span class="floor">#' + item.floor + "</span>" : "",
        this._createPlatformDom(item.content.plat),
        '<span class="time-location">',
        '<span class="reply-time">'.concat(this._formateTime(item.ctime), "</span>"),
        item?.reply_control?.location ? \`<span class="reply-location">\${item?.reply_control?.location || ""}</span>\` : "",
        "</span>",
        item.lottery_id ? "" : '<span class="like ' + (item.action == 1 ? "liked" : "") + '"><i></i><span>' + (item.like ? item.like : "") + "</span></span>",
        item.lottery_id ? "" : '<span class="hate ' + (item.action == 2 ? "hated" : "") + '"><i></i></span>',
        item.lottery_id ? "" : this._createReplyBtn(item.rcount),
        item.lottery_id && item.mid !== this.userStatus.mid ? "" : '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(item) ? '<li class="set-top">' + (item.isUpTop ? "取消置顶" : "设为置顶") + "</li>" : "") + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(item.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(item.mid) && !item.isTop ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : "") + "</ul></div></div>",
        this._createLotteryContent(item.content),
        this._createVoteContent(item.content),
        this._createTags(item),
        "</div>",
        '<div class="reply-box">',
        this._createSubReplyList(item.replies, item.rcount, false, item.rpid, item.folder && item.folder.has_folded, item.reply_control),
        "</div>",
        '<div class="paging-box">',
        "</div>",
        "</div>"
      ].join("");
      return item.state === this.blacklistCode ? blCon : con;
    };
    Feedback.prototype._createSubReplyItem = function(item, i) {
      if (item.invisible) {
        return "";
      }
      return [
        '<div class="reply-item reply-wrap" data-id="' + item.rpid + '" data-index="' + i + '">',
        this._createSubReplyUserFace(item),
        '<div class="reply-con">',
        '<div class="user">',
        this._createNickNameDom(item),
        this._createLevelLink(item),
        this._identity(item.mid, item.assist, item.member.fans_detail),
        this._createSubMsgContent(item),
        "</div>",
        "</div>",
        '<div class="info">',
        item.floor ? '<span class="floor">#' + item.floor + "</span>" : "",
        this._createPlatformDom(item.content.plat),
        '<span class="time-location">',
        '<span class="reply-time">'.concat(this._formateTime(item.ctime), "</span>"),
        item?.reply_control?.location ? \`<span class="reply-location">\${item?.reply_control?.location || ""}</span>\` : "",
        "</span>",
        '<span class="like ' + (item.action == 1 ? "liked" : "") + '"><i></i><span>' + (item.like ? item.like : "") + "</span></span>",
        '<span class="hate ' + (item.action == 2 ? "hated" : "") + '"><i></i></span>',
        '<span class="reply btn-hover">回复</span>',
        '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul>' + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(item.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(item.mid) ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : "") + "</ul></div></div>",
        "</div>",
        "</div>"
      ].join("");
    };
  }

  // src/content/av/av.html
  var av_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta charset="utf-8" />\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords"\\r\\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\\r\\n        title="哔哩哔哩" />\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" />\\r\\n    <style type="text/css">\\r\\n        #bofqi .player {\\r\\n            width: 980px;\\r\\n            height: 620px;\\r\\n            display: block;\\r\\n        }\\r\\n\\r\\n        @media screen and (min-width:1400px) {\\r\\n\\r\\n            #bofqi .player {\\r\\n                width: 1160px;\\r\\n                height: 720px\\r\\n            }\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container has-menu"></div>\\r\\n    <div id="video-page-app"></div>\\r\\n    <div id="app" data-server-rendered="true"></div>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/content/av/script.html
  var script_default = '<script type="text/javascript">\\r\\n    window.getInternetExplorerVersion = function () {\\r\\n        var e = -1; if ("Microsoft Internet Explorer" == navigator.appName) {\\r\\n            var r = navigator.userAgent;\\r\\n            null != new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r) && (e = parseFloat(RegExp.\$1))\\r\\n        }\\r\\n        return e\\r\\n    };\\r\\n    function getQueryString(e) {\\r\\n        var r = new RegExp("(^|&)" + e + "=([^&]*)(&|\$)"),\\r\\n            i = window.location.search.substr(1).match(r);\\r\\n        return null != i ? unescape(i[2]) : null\\r\\n    }\\r\\n    window.commentAgent = { seek: t => window.player && window.player.seek(t) };\\r\\n<\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js"><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\\r\\n    crossorigin=""><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\\r\\n    crossorigin=""><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\\r\\n    crossorigin=""><\\/script>\\r\\n<script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\\/script>';

  // src/content/av/menu_config.txt
  var menu_config_default = '[{name:"首页",route:"/",tid:"",locid:23,sub:[]},{name:"动画",route:"douga",tid:1,locid:52,count:"",subMenuSize:162,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2507,leftId:2452,rightId:2453},sub:[{name:"MAD·AMV",route:"mad",tid:24,ps:15,rps:10,ad:{active:!0,dataLocId:151},desc:"具有一定制作程度的动画或静画的二次创作视频",url:"//www.bilibili.com/video/douga-mad-1.html"},{name:"MMD·3D",route:"mmd",tid:25,ps:15,rps:10,ad:{active:!0,dataLocId:152},desc:"使用MMD（MikuMikuDance）和其他3D建模类软件制作的视频",url:"//www.bilibili.com/video/douga-mmd-1.html"},{name:"短片·手书·配音",route:"voice",tid:47,ps:15,rps:10,desc:"追求创新并具有强烈特色的短片、手书（绘）及ACG相关配音",url:"//www.bilibili.com/video/douga-voice-1.html"},{name:"手办·模玩",route:"garage_kit",tid:210,ps:15,rps:10,desc:"手办模玩的测评、改造或其他衍生内容",url:""},{name:"特摄",route:"tokusatsu",tid:86,ps:15,rps:10,desc:"特摄相关衍生视频",url:"//www.bilibili.com/video/cinephile-tokusatsu.html"},{name:"综合",route:"other",tid:27,ps:15,rps:10,ad:{active:!0,dataLocId:153},desc:"以动画及动画相关内容为素材，包括但不仅限于音频替换、杂谈、排行榜等内容",url:"//www.bilibili.com/video/douga-else-1.html"}]},{name:"番剧",route:"anime",tid:13,url:"//www.bilibili.com/anime/",takeOvered:!0,count:"",subMenuSize:172,combination:!0,sub:[{name:"连载动画",tid:33,route:"serial",desc:"当季连载的动画番剧",url:"//www.bilibili.com/video/bangumi-two-1.html"},{name:"完结动画",tid:32,route:"finish",desc:"已完结的动画番剧合集",url:"//www.bilibili.com/video/part-twoelement-1.html"},{name:"资讯",tid:51,route:"information",desc:"动画番剧相关资讯视频",url:"//www.bilibili.com/video/douga-else-information-1.html"},{name:"官方延伸",tid:152,route:"offical",desc:"动画番剧为主题的宣传节目、采访视频，及声优相关视频",url:"//www.bilibili.com/video/bagumi_offical_1.html"},{name:"新番时间表",url:"//www.bilibili.com/anime/timeline/",desc:""},{name:"番剧索引",url:"//www.bilibili.com/anime/index/",desc:""}]},{name:"国创",tid:167,route:"guochuang",url:"//www.bilibili.com/guochuang/",takeOvered:!0,count:"",subMenuSize:214,combination:!0,sub:[{name:"国产动画",tid:153,route:"chinese",desc:"我国出品的PGC动画",url:"//www.bilibili.com/video/bangumi_chinese_1.html"},{name:"国产原创相关",tid:168,route:"original",desc:"",url:"//www.bilibili.com/video/guochuang-fanvid-1.html"},{name:"布袋戏",tid:169,route:"puppetry",desc:"",url:"//www.bilibili.com/video/glove-puppetry-1.html"},{name:"动态漫·广播剧",tid:195,route:"motioncomic",desc:"",url:""},{name:"资讯",tid:170,route:"information",desc:"",url:"//www.bilibili.com/video/guochuang-offical-1.html"},{name:"新番时间表",url:"//www.bilibili.com/guochuang/timeline/",desc:""},{name:"国产动画索引",url:"//www.bilibili.com/guochuang/index/",desc:""}]},{name:"音乐",route:"music",tid:3,locid:58,count:"",subMenuSize:268,slider:{width:620,height:220},viewTag:!0,customComponent:{name:"Energy",titleId:2511,leftId:2462,rightId:3131,rightType:"slide"},sub:[{name:"原创音乐",route:"original",tid:28,ps:15,rps:10,viewHotTag:!0,ad:{active:!0,dataLocId:243},dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"原创歌曲及纯音乐，包括改编、重编曲及remix",url:"//www.bilibili.com/video/music-original-1.html"},{name:"翻唱",route:"cover",tid:31,ps:15,rps:10,ad:{active:!0,dataLocId:245},viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"对曲目的人声再演绎视频",url:"//www.bilibili.com/video/music-Cover-1.html"},{name:"演奏",route:"perform",tid:59,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"乐器和非传统乐器器材的演奏作品",url:"//www.bilibili.com/video/music-perform-1.html"},{name:"VOCALOID·UTAU",route:"vocaloid",tid:30,ps:15,rps:10,viewHotTag:!0,ad:{active:!0,dataLocId:247},dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"以VOCALOID等歌声合成引擎为基础，运用各类音源进行的创作",url:"//www.bilibili.com/video/music-vocaloid-1.html"},{name:"音乐现场",route:"live",tid:29,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"音乐表演的实况视频，包括官方/个人拍摄的综艺节目、音乐剧、音乐节、演唱会等",url:"//www.bilibili.com/video/music-oped-1.html"},{name:"MV",route:"mv",tid:193,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"为音乐作品配合拍摄或制作的音乐录影带（Music Video），以及自制拍摄、剪辑、翻拍MV",url:"//www.bilibili.com/video/music-coordinate-1.html"},{name:"乐评盘点",route:"commentary",tid:243,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"音乐类新闻、盘点、点评、reaction、榜单、采访、幕后故事、唱片开箱等",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音乐教学",route:"tutorial",tid:244,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"以音乐教学为目的的内容",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音乐综合",route:"other",tid:130,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"所有无法被收纳到其他音乐二级分区的音乐类视频",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音频",customZone:"Audio",route:"audio",url:"//www.bilibili.com/audio/home?musicType=music"},{name:"说唱",url:"//www.bilibili.com/v/rap"}]},{name:"舞蹈",route:"dance",tid:129,locid:64,count:"",subMenuSize:172,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2513,leftId:2472,rightId:2473},sub:[{name:"宅舞",route:"otaku",tid:20,ps:15,rps:10,ad:{active:!0,dataLocId:249},desc:"与ACG相关的翻跳、原创舞蹈",url:"//www.bilibili.com/video/dance-1.html"},{name:"街舞",route:"hiphop",tid:198,ps:15,rps:10,ad:{active:!0,dataLocId:251},desc:"收录街舞相关内容，包括赛事现场、舞室作品、个人翻跳、FREESTYLE等",url:""},{name:"明星舞蹈",route:"star",tid:199,ps:15,rps:10,desc:"国内外明星发布的官方舞蹈及其翻跳内容",url:""},{name:"中国舞",route:"china",tid:200,ps:15,rps:10,ad:{active:!0,dataLocId:253},desc:"传承中国艺术文化的舞蹈内容，包括古典舞、民族民间舞、汉唐舞、古风舞等",url:""},{name:"舞蹈综合",route:"three_d",tid:154,ps:15,rps:10,desc:"收录无法定义到其他舞蹈子分区的舞蹈视频",url:""},{name:"舞蹈教程",route:"demo",tid:156,ps:10,rps:6,desc:"镜面慢速，动作分解，基础教程等具有教学意义的舞蹈视频",url:"//www.bilibili.com/video/dance-demo-1.html"}]},{name:"游戏",route:"game",tid:4,locid:70,count:"",subMenuSize:240,slider:{width:470,height:216},viewTag:!0,customComponent:{name:"Energy",titleId:3761,leftId:3765,rightId:3775,rightType:"slide"},recommendCardType:"GameGroomBox",sub:[{name:"单机游戏",route:"stand_alone",tid:17,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:255},dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"以所有平台（PC、主机、移动端）的单机或联机游戏为主的视频内容，包括游戏预告、CG、实况解说及相关的评测、杂谈与视频剪辑等",url:"//www.bilibili.com/video/videogame-1.html"},{name:"电子竞技",route:"esports",tid:171,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:257},desc:"具有高对抗性的电子竞技游戏项目，其相关的赛事、实况、攻略、解说、短剧等视频。",url:"//www.bilibili.com/video/esports-1.html"},{name:"手机游戏",route:"mobile",tid:172,ps:10,rps:7,rankshow:1,viewHotTag:!0,desc:"以手机及平板设备为主要平台的游戏，其相关的实况、攻略、解说、短剧、演示等视频。",url:"//www.bilibili.com/video/mobilegame-1.html"},{name:"网络游戏",route:"online",tid:65,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:259},dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"由网络运营商运营的多人在线游戏，以及电子竞技的相关游戏内容。包括赛事、攻略、实况、解说等相关视频",url:"//www.bilibili.com/video/onlinegame-1.html"},{name:"桌游棋牌",route:"board",tid:173,ps:5,rps:3,rankshow:1,viewHotTag:!0,desc:"桌游、棋牌、卡牌对战等及其相关电子版游戏的实况、攻略、解说、演示等视频。",url:"//www.bilibili.com/video/boardgame-1.html"},{name:"GMV",route:"gmv",tid:121,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"由游戏素材制作的MV视频。以游戏内容或CG为主制作的，具有一定创作程度的MV类型的视频",url:"//www.bilibili.com/video/gmv-1.html"},{name:"音游",route:"music",tid:136,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"各个平台上，通过配合音乐与节奏而进行的音乐类游戏视频",url:"//www.bilibili.com/video/music-game-1.html"},{name:"Mugen",route:"mugen",tid:19,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"以Mugen引擎为平台制作、或与Mugen相关的游戏视频",url:"//www.bilibili.com/video/game-mugen-1.html"},{name:"游戏赛事",url:"//www.bilibili.com/v/game/match/",newIcon:!0}]},{name:"知识",route:"knowledge",tid:36,locid:76,count:"",subMenuSize:172,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2058,leftId:2047,rightId:2048},sub:[{name:"科学科普",route:"science",tid:201,ps:15,rps:10,ad:{active:!0,dataLocId:261},desc:"回答你的十万个为什么"},{name:"社科·法律·心理",route:"social_science",tid:124,ps:15,rps:10,ad:{active:!0,dataLocId:263},desc:"基于社会科学、法学、心理学展开或个人观点输出的知识视频"},{name:"人文历史",route:"humanity_history",tid:228,ps:15,rps:10,desc:"看看古今人物，聊聊历史过往，品品文学典籍"},{name:"财经商业",route:"business",tid:207,ps:15,rps:10,desc:"说金融市场，谈宏观经济，一起畅聊商业故事"},{name:"校园学习",route:"campus",tid:208,ps:15,rps:10,ad:{active:!0,dataLocId:265},desc:"老师很有趣，学生也有才，我们一起搞学习"},{name:"职业职场",route:"career",tid:209,ps:15,rps:10,desc:"职业分享、升级指南，一起成为最有料的职场人"},{name:"设计·创意",route:"design",tid:229,ps:15,rps:10,desc:"天马行空，创意设计，都在这里"},{name:"野生技能协会",route:"skill",tid:122,ps:15,rps:10,desc:"技能党集合，是时候展示真正的技术了"}]},{name:"科技",route:"tech",tid:188,locid:2977,count:"",subMenuSize:80,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2980,leftId:2978,rightId:2979},sub:[{name:"数码",route:"digital",tid:95,ps:15,rps:10,viewHotTag:!0,desc:"科技数码产品大全，一起来做发烧友",url:"#"},{name:"软件应用",route:"application",tid:230,ps:15,rps:10,viewHotTag:!0,desc:"超全软件应用指南",url:"#"},{name:"计算机技术",route:"computer_tech",tid:231,ps:15,rps:10,viewHotTag:!0,desc:"研究分析、教学演示、经验分享......有关计算机技术的都在这里",url:"#"},{name:"科工机械",route:"industry",tid:232,ps:15,rps:10,viewHotTag:!0,desc:"从小芯片到大工程，一起见证科工力量",url:"#"},{name:"极客DIY",route:"diy",tid:233,ps:15,rps:10,viewHotTag:!0,desc:"炫酷技能，极客文化，硬核技巧，准备好你的惊讶",url:"#"}]},{name:"运动",route:"sports",tid:234,locid:4639,isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4646,rightId:4652,rightType:"slide"},sub:[{name:"篮球·足球",route:"basketballfootball",tid:235,ps:15,rps:10,ad:{active:!0,dataLocId:4656},desc:"与篮球、足球相关的视频，包括但不限于篮足球赛事、教学、评述、剪辑、剧情等相关内容",url:"#"},{name:"健身",route:"aerobics",tid:164,ps:15,rps:10,desc:"与健身相关的视频，包括但不限于瑜伽、CrossFit、健美、力量举、普拉提、街健等相关内容",url:"//www.bilibili.com/video/fashion-body-1.html"},{name:"竞技体育",route:"athletic",tid:236,ps:15,rps:10,desc:"与竞技体育相关的视频，包括但不限于乒乓、羽毛球、排球、赛车等竞技项目的赛事、评述、剪辑、剧情等相关内容",url:"#"},{name:"运动文化",route:"culture",tid:237,ps:15,rps:10,desc:"与运动文化相关的视频，包络但不限于球鞋、球衣、球星卡等运动衍生品的分享、解读，体育产业的分析、科普等相关内容",url:"#"},{name:"运动综合",route:"comprehensive",tid:238,ps:15,rps:10,desc:"与运动综合相关的视频，包括但不限于钓鱼、骑行、滑板等日常运动分享、教学、Vlog等相关内容",url:"#"}]},{name:"汽车",route:"car",tid:223,locid:4428,isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4435,rightId:4441,rightType:"slide"},sub:[{name:"汽车生活",route:"life",tid:176,ps:15,rps:10,ad:{active:!0,dataLocId:4445},desc:"分享汽车及出行相关的生活体验类视频",url:"#"},{name:"汽车文化",route:"culture",tid:224,ps:15,rps:10,desc:"汽车改装、品牌历史、汽车设计、老爷车、汽车模型等",url:"#"},{name:"赛车",route:"racing",tid:245,ps:15,rps:10,desc:"F1等汽车运动相关",url:"#"},{name:"汽车极客",route:"geek",tid:225,ps:15,rps:10,desc:"汽车硬核达人聚集地，包括DIY造车、专业评测和技术知识分享",url:"#"},{name:"摩托车",route:"motorcycle",tid:240,ps:15,rps:10,desc:"骑士们集合啦",url:"#"},{name:"智能出行",route:"smart",tid:226,ps:15,rps:10,desc:"探索新能源汽车和未来智能出行的前沿阵地",url:"#"},{name:"购车攻略",route:"strategy",tid:227,ps:15,rps:10,desc:"丰富详实的购车建议和新车体验",url:"#"}]},{name:"生活",route:"life",tid:160,locid:88,count:"",subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2062,leftId:1674,rightId:1670},sub:[{name:"搞笑",route:"funny",tid:138,ps:15,rps:10,ad:{active:!0,dataLocId:273},desc:"各种沙雕有趣的搞笑剪辑，挑战，表演，配音等视频",url:"//www.bilibili.com/video/ent_funny_1.html",locid:4204,recommendId:4210,slider:{width:620,height:220},customComponent:{name:"Energy",leftId:4212,rightId:4218,rightType:"slide"}},{name:"家居房产",route:"home",tid:239,ps:15,rps:10,ad:{active:!0,dataLocId:275},desc:"与买房、装修、居家生活相关的分享",url:"#"},{name:"手工",route:"handmake",tid:161,ps:15,rps:10,desc:"手工制品的制作过程或成品展示、教程、测评类视频",url:"//www.bilibili.com/video/ent-handmake-1.html"},{name:"绘画",route:"painting",tid:162,ps:15,rps:10,desc:"绘画过程或绘画教程，以及绘画相关的所有视频",url:"//www.bilibili.com/video/ent-painting-1.html"},{name:"日常",route:"daily",tid:21,ps:15,rps:10,desc:"记录日常生活，分享生活故事",url:"//www.bilibili.com/video/ent-life-1.html"}]},{name:"美食",route:"food",tid:211,locid:4243,count:"",isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4258,rightId:4264},sub:[{name:"美食制作",route:"make",tid:76,ps:15,rps:10,ad:{active:!0,dataLocId:4268},desc:"学做人间美味，展示精湛厨艺",url:"#"},{name:"美食侦探",route:"detective",tid:212,ps:15,rps:10,desc:"寻找美味餐厅，发现街头美食",url:"#"},{name:"美食测评",route:"measurement",tid:213,ps:15,rps:10,desc:"吃货世界，品尝世间美味",url:"#"},{name:"田园美食",route:"rural",tid:214,ps:15,rps:10,desc:"品味乡野美食，寻找山与海的味道",url:"#"},{name:"美食记录",route:"record",tid:215,ps:15,rps:10,desc:"记录一日三餐，给生活添一点幸福感",url:"#"}]},{name:"动物圈",route:"animal",tid:217,locid:4365,count:"",isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4376,rightId:4381,rightType:"slide"},sub:[{name:"喵星人",route:"cat",tid:218,ps:15,rps:10,desc:"喵喵喵喵喵",url:"#",ad:{active:!0,dataLocId:4385}},{name:"汪星人",route:"dog",tid:219,ps:15,rps:10,desc:"汪汪汪汪汪",url:"#"},{name:"大熊猫",route:"panda",tid:220,ps:15,rps:10,desc:"芝麻汤圆营业中",url:"#"},{name:"野生动物",route:"wild_animal",tid:221,ps:15,rps:10,desc:"内有“猛兽”出没",url:"#"},{name:"爬宠",route:"reptiles",tid:222,ps:15,rps:10,desc:"鳞甲有灵",url:"#"},{name:"动物综合",route:"animal_composite",tid:75,ps:15,rps:10,desc:"收录除上述子分区外，其余动物相关视频以及非动物主体或多个动物主体的动物相关延伸内容",url:"#"}]},{name:"鬼畜",route:"kichiku",tid:119,locid:100,count:"",subMenuSize:182,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2509,leftId:2482,rightId:2483},sub:[{name:"鬼畜调教",route:"guide",tid:22,ps:15,rps:10,ad:{active:!0,dataLocId:285},desc:"使用素材在音频、画面上做一定处理，达到与BGM一定的同步感",url:"//www.bilibili.com/video/ent-Kichiku-1.html"},{name:"音MAD",route:"mad",tid:26,ps:15,rps:10,ad:{active:!0,dataLocId:287},desc:"使用素材音频进行一定的二次创作来达到还原原曲的非商业性质稿件",url:"//www.bilibili.com/video/douga-kichiku-1.html"},{name:"人力VOCALOID",route:"manual_vocaloid",tid:126,ps:15,rps:10,desc:"将人物或者角色的无伴奏素材进行人工调音，使其就像VOCALOID一样歌唱的技术",url:"//www.bilibili.com/video/kichiku-manual_vocaloid-1.html"},{name:"鬼畜剧场",route:"theatre",tid:216,ps:15,rps:10,desc:"使用素材进行人工剪辑编排的有剧情的作品"},{name:"教程演示",route:"course",tid:127,ps:10,rps:6,rightComponent:{name:"CmImgList",id:148},ad:{active:!0,dataLocId:289},hideDropdown:!1,desc:"鬼畜相关的教程演示",url:"//www.bilibili.com/video/kichiku-course-1.html"}]},{name:"时尚",route:"fashion",tid:155,locid:94,count:"",subMenuSize:124,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2515,leftId:2492,rightId:2493},sub:[{name:"美妆护肤",route:"makeup",tid:157,ps:15,rps:10,ad:{active:!0,dataLocId:279},desc:"彩妆护肤、美甲美发、仿妆、医美相关内容分享或产品测评",url:"//www.bilibili.com/video/fashion-makeup-fitness-1.html"},{name:"穿搭",route:"clothing",tid:158,ps:15,rps:10,ad:{active:!0,dataLocId:281},desc:"穿搭风格、穿搭技巧的展示分享，涵盖衣服、鞋靴、箱包配件、配饰（帽子、钟表、珠宝首饰）等",url:"//www.bilibili.com/video/fashion-clothing-1.html"},{name:"时尚潮流",route:"trend",tid:159,ps:15,rps:10,desc:"时尚街拍、时装周、时尚大片，时尚品牌、潮流等行业相关记录及知识科普",url:"#"}]},{name:"资讯",route:"information",tid:202,locid:4076,count:"",subMenuSize:60,slider:{width:620,height:220},viewTag:!1,sub:[{name:"热点",route:"hotspot",tid:203,ps:18,rps:10,desc:"全民关注的时政热门资讯"},{name:"环球",route:"global",tid:204,ps:18,rps:10,desc:"全球范围内发生的具有重大影响力的事件动态"},{name:"社会",route:"social",tid:205,ps:18,rps:10,desc:"日常生活的社会事件、社会问题、社会风貌的报道"},{name:"综合",route:"multiple",tid:206,ps:18,rps:10,desc:"除上述领域外其它垂直领域的综合资讯"}]},{name:"娱乐",route:"ent",tid:5,locid:82,count:"",subMenuSize:62,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2067,leftId:2065,rightId:2066},sub:[{name:"综艺",route:"variety",tid:71,ps:15,rps:10,ad:{active:!0,dataLocId:267},desc:"所有综艺相关，全部一手掌握！",url:"//www.bilibili.com/video/ent-variety-1.html"},{name:"娱乐杂谈",route:"talker",tid:241,ps:15,rps:10,ad:{active:!0,dataLocId:269},desc:"娱乐人物解读、娱乐热点点评、娱乐行业分析"},{name:"粉丝创作",route:"fans",tid:242,ps:15,rps:10,desc:"粉丝向创作视频"},{name:"明星综合",route:"celebrity",tid:137,ps:15,rps:10,desc:"娱乐圈动态、明星资讯相关"}]},{name:"影视",route:"cinephile",tid:181,locid:2211,count:"",subMenuSize:84,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2309,leftId:2307,rightId:2308},sub:[{name:"影视杂谈",route:"cinecism",tid:182,ps:15,rps:10,ad:{active:!0,dataLocId:2212},desc:"影视评论、解说、吐槽、科普等",url:"//www.bilibili.com/video/cinephile-cinecism.html"},{name:"影视剪辑",route:"montage",tid:183,ps:15,rps:10,ad:{active:!0,dataLocId:2213},desc:"对影视素材进行剪辑再创作的视频",url:"//www.bilibili.com/video/cinephile-montage.html"},{name:"短片",route:"shortfilm",tid:85,ps:15,rps:10,desc:"追求自我表达且具有特色的短片",url:"//www.bilibili.com/video/cinephile-shortfilm.html"},{name:"预告·资讯",route:"trailer_info",tid:184,ps:15,rps:10,ad:{active:!0,dataLocId:2214},desc:"影视类相关资讯，预告，花絮等视频",url:"//www.bilibili.com/video/cinephile-trailer-info.html"}]},{name:"纪录片",route:"documentary",tid:177,url:"//www.bilibili.com/documentary/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"人文·历史",tid:37,route:"history",dise:"",url:"//www.bilibili.com/video/doco-history.html"},{name:"科学·探索·自然",tid:178,route:"science",dise:"",url:"//www.bilibili.com/video/doco-science.html"},{name:"军事",tid:179,route:"military",dise:"",url:"//www.bilibili.com/video/doco-military.html"},{name:"社会·美食·旅行",tid:180,route:"travel",dise:"",url:"//www.bilibili.com/video/doco-travel.html"},{name:"纪录片索引",url:"//www.bilibili.com/documentary/index/"}]},{name:"电影",route:"movie",tid:23,url:"//www.bilibili.com/movie/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"华语电影",tid:147,route:"chinese",desc:"",url:"//www.bilibili.com/video/movie_chinese_1.html"},{name:"欧美电影",tid:145,route:"west",desc:"",url:"//www.bilibili.com/video/movie_west_1.html"},{name:"日本电影",tid:146,route:"japan",desc:"",url:"//www.bilibili.com/video/movie_japan_1.html"},{name:"其他国家",tid:83,route:"movie",desc:"",url:"//www.bilibili.com/video/movie-movie-1.html"},{name:"电影索引",url:"//www.bilibili.com/movie/index/"}]},{name:"电视剧",route:"tv",tid:11,url:"//www.bilibili.com/tv/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"国产剧",tid:185,route:"mainland",desc:"",url:"//www.bilibili.com/video/tv-mainland.html"},{name:"海外剧",tid:187,route:"overseas",desc:"",url:"//www.bilibili.com/video/tv-overseas.html"},{name:"电视剧索引",url:"//www.bilibili.com/tv/index/"}]},{name:"虚拟UP主",route:"virtual",locid:4735,count:"",isHide:!0,subMenuSize:60,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:4754,leftId:4756},sub:[{name:"游戏",route:"game",tid:4,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/game"},{name:"音乐",route:"music",tid:3,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/music"},{name:"动画",route:"douga",tid:1,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/douga"},{name:"其他",route:"other",tid:0,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/other"}]}]';

  // src/runtime/element/create_scripts.ts
  function createScripts(elements) {
    return elements.reduce((s, d) => {
      s.push(createElement(d));
      return s;
    }, []);
  }
  function loopScript(scripts) {
    return new Promise((r, j) => {
      const prev = scripts.shift();
      if (prev) {
        if (prev.src) {
          prev.addEventListener("load", () => r(loopScript(scripts)));
          prev.addEventListener("abort", () => r(loopScript(scripts)));
          prev.addEventListener("error", () => r(loopScript(scripts)));
          return document.body.appendChild(prev);
        }
        document.body.appendChild(prev);
        r(loopScript(scripts));
      } else
        r(void 0);
    });
  }
  function appendScripts(elements) {
    return loopScript(createScripts(htmlVnode(elements)));
  }
  function loadScriptEs(path2) {
    const files = isArray(path2) ? path2 : [path2];
    window.postMessage({
      \$type: "executeScript",
      data: files
    });
  }

  // src/images/svg/dislike.svg
  var dislike_default = '<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1 {fill: #f36392;}</style></defs><g><path class="cls-1" d="M10.28,32.77h2.5V13.19h-2.5ZM25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86H5.56a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h6.25l6.8-8.49A3.83,3.83,0,0,1,25.25,5Zm10.14,2.51H22.22l.28-2.92L22.92,5a1.26,1.26,0,0,0-.18-1,1.28,1.28,0,0,0-.82-.56,1.11,1.11,0,0,0-1.25.42l-6.36,8.2-.83,1.11H5.14a2,2,0,0,0-.83.28,2.28,2.28,0,0,0-1.25,2.08V30.41a2,2,0,0,0,.42,1.25,2,2,0,0,0,2.08,1.11H28.89a2.38,2.38,0,0,0,1.39-.41,3.61,3.61,0,0,0,2.08-2.78L36.8,15l2.5.56L36.8,15a2.45,2.45,0,0,0-.14-1.39,2.89,2.89,0,0,0-1.52-.54l.28-2.5Z" transform="translate(-0.56 -0.82)" /></g></svg>';

  // src/images/svg/like.svg
  var like_default = '<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1 {fill: #f36392;}</style></defs><g><path class="cls-1" d="M12.06,35.27V10.43h-.15l6.7-8.37A3.83,3.83,0,0,1,25.25,5L25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86Zm-2.5,0h-4a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h4Z" transform="translate(-0.56 -0.82)" /></g></svg>';

  // src/content/av/en_like.ts
  var enLike = class {
    aid = void 0;
    coin = void 0;
    span = void 0;
    liked = false;
    number = 0;
    type;
    svgLike = dislike_default;
    svgEnLike = like_default;
    constructor(type, num = 0) {
      this.type = type;
      this.number = num;
      doWhile(() => {
        this.coin = type === "watchlater" ? document.querySelector(".u.coin") : document.querySelector("[report-id*=coin]");
        return this.coin && API.aid;
      }, () => this.init());
    }
    init() {
      this.style();
      this.aid = API.aid;
      this.span = document.createElement("span");
      this.span.classList.add("ulike");
      this.coin.parentElement.insertBefore(this.span, this.coin);
      this.changeLiked();
      this.span.addEventListener("click", () => this.setLike());
      switchVideo(() => this.switch());
      try {
        !this.number && xhr({
          url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
          credentials: true,
          responseType: "json"
        }, true).then((d) => {
          this.number = jsonCheck(d).data.stat.like;
          this.changeLiked();
        });
        uid && xhr({
          url: \`https://api.bilibili.com/x/web-interface/archive/has/like?aid=\${API.aid}\`,
          credentials: true,
          responseType: "json"
        }).then((d) => {
          d = jsonCheck(d).data;
          d === 1 && (this.liked = true, this.changeLiked());
        });
      } catch (e) {
        toast.error("点赞失败！");
        debug.error("点赞失败！", e);
      }
    }
    style() {
      let style = \`.ulike {cursor: pointer;}.ulike svg{vertical-align: middle;margin-right: 10px;}\`;
      switch (this.type) {
        case "bangumi":
          style += \`.ulike {margin-left: 15px;position: relative;float: left;height: 100%;line-height: 18px;font-size: 12px;color: #222;}\`;
          break;
        case "watchlater":
          style += \`.video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}\`;
          break;
        default:
          style += \`.video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}\`;
      }
      addCss(style);
    }
    setLike() {
      if (uid) {
        const like = this.liked ? 2 : 1;
        xhr({
          url: "https://api.bilibili.com/x/web-interface/archive/like",
          method: "POST",
          data: \`aid=\${API.aid}&like=\${like}&csrf=\${getCookies().bili_jct}\`,
          credentials: true,
          responseType: "json"
        }).then((d) => {
          jsonCheck(d).ttl;
          this.liked = !this.liked;
          this.number = this.liked ? this.number + 1 : this.number - 1;
          this.changeLiked();
        });
      } else {
        toast.warning("请先登录 щ(ʘ╻ʘ)щ");
        biliQuickLogin();
      }
    }
    changeLiked() {
      this.span.innerHTML = \`\${this.liked ? this.svgEnLike : this.svgLike}</i>点赞 \${unitFormat(this.number) || "--"}\`;
    }
    switch() {
      if (this.aid != API.aid) {
        this.aid = API.aid;
        xhr({
          url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
          credentials: true,
          responseType: "json"
        }).then((d) => {
          this.number = jsonCheck(d).data.stat.like;
          this.changeLiked();
        });
      }
    }
  };

  // src/content/av/collection.ts
  function calcDivWidth(text) {
    let elem = document.createElement("div");
    elem.setAttribute("style", "display: inline-block");
    elem.innerText = text;
    document.body.append(elem);
    let w = elem.clientWidth;
    document.body.removeChild(elem);
    return w;
  }
  function calcOffsetPos(elem) {
    let result = { x: 0, y: 0 };
    for (let e = elem; e != null; e = e.offsetParent) {
      result.x += e.offsetLeft;
      result.y += e.offsetTop;
    }
    return result;
  }
  function getAid() {
    return window.history.state?.aid;
  }
  var CollectionElement = class {
    container;
    clearfix;
    items = [];
    spread = null;
    constructor(onSpread) {
      this.container = document.createElement("div");
      this.clearfix = document.createElement("ul");
      this.clearfix.className = "clearfix";
      this.container.appendChild(this.clearfix);
      if (onSpread) {
        this.spread = document.createElement("a");
        this.spread.className = "item v-part-toggle";
        this.spread.addEventListener("click", (e) => {
          onSpread();
          e.preventDefault();
        });
        this.clearfix.appendChild(this.spread);
      }
    }
    setContainerAttr(attr) {
      let staticClass = "multi-page bili-wrapper report-wrap-module report-scroll-module";
      this.container.className = [staticClass, attr.class].join(" ").trim();
    }
    setItemAttrs(attrs) {
      while (this.items.length > attrs.length)
        this.clearfix.removeChild(this.items.pop().node);
      while (this.items.length < attrs.length) {
        let i = { click: null, node: document.createElement("a") };
        i.node.addEventListener("mouseenter", (e) => this.showFloatTxt(e));
        i.node.addEventListener("mouseleave", () => this.hideFloatText());
        i.node.addEventListener("click", (e) => {
          if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.defaultPrevented || e.button != 0)
            return;
          e.preventDefault();
          i.click && i.click(e);
        });
        this.clearfix.insertBefore(i.node, this.spread);
        this.items.push(i);
      }
      const staticClass = "item";
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].node.className = [staticClass, attrs[i].class].join(" ").trim();
        this.items[i].node.innerText = attrs[i].text;
        this.items[i].node.href = attrs[i].href;
        this.items[i].click = attrs[i].click;
      }
    }
    setSpreadAttr(attr) {
      if (this.spread) {
        this.spread.style.top = attr.top + "px";
        attr.text && (this.spread.innerText = attr.text);
      }
    }
    showFloatTxt(e) {
      let item = e.target;
      let treshold = calcDivWidth(item.innerText) + 14;
      if (item.offsetWidth >= treshold)
        return;
      let floatTxt = document.createElement("div");
      floatTxt.className = "p-float-txt";
      floatTxt.innerText = item.innerText;
      document.body.appendChild(floatTxt);
      let pos = calcOffsetPos(item);
      floatTxt.style.left = pos.x + "px";
      floatTxt.style.top = pos.y - 8 - floatTxt.clientHeight + "px";
      floatTxt.style.transition = "opacity 0.4s, top 0.4s cubic-bezier(0.37, 0, 0.63, 1)";
      floatTxt.style.top = pos.y - 3 - floatTxt.clientHeight + "px";
      floatTxt.style.opacity = "1";
    }
    hideFloatText() {
      let e = document.querySelector(".p-float-txt");
      e && document.body.removeChild(e);
    }
  };
  var CollectionData = class {
    notify = null;
    _viewEpisodes = [];
    _ep = 0;
    _spread = false;
    _spreadBtnTop = 0;
    _colCount = 4;
    episodes = [];
    get viewEpisodes() {
      return this._viewEpisodes;
    }
    get ep() {
      if (this.episodes[this._ep].aid != getAid())
        this._ep = this.episodes.findIndex((ep) => ep.aid == getAid());
      return this._ep;
    }
    get spreadBtnTop() {
      return this._spreadBtnTop;
    }
    set spreadBtnTop(n) {
      if (this._spreadBtnTop != n) {
        this._spreadBtnTop = n;
        this.notify?.spreadBtnTop(this._spreadBtnTop);
      }
    }
    get spread() {
      return this._spread;
    }
    get colCount() {
      return this._colCount;
    }
    get pageList() {
      return this.episodes.reduce((s, ep, i) => {
        s.push({
          aid: ep.aid,
          cid: ep.cid,
          page: i + 1,
          part: ep.title,
          duration: ep.page.duration,
          dimension: ep.page.dimension,
          from: ep.page.from,
          vid: "",
          weblink: ""
        });
        return s;
      }, []);
    }
    constructor(season) {
      this.initEpisodes(season);
      this.calcColCount();
      this._viewEpisodes = !this.needSpread() ? this.episodes : this.calcViewEpisodesOnCollapsed(this.ep);
    }
    initEpisodes(season) {
      season.sections.forEach((section2) => {
        Array.prototype.push.apply(this.episodes, section2.episodes);
      });
    }
    calcColCount() {
      let w = calcDivWidth(this.episodes[this.ep].title);
      this._colCount = w >= 241 ? 3 : w >= 186 ? 4 : w >= 149 ? 5 : w >= 123 ? 6 : window.innerWidth > 1440 ? 7 : 6;
    }
    calcViewEpisodesOnCollapsed(ep) {
      let begin = ep == 0 ? 0 : ep - 1 + this._colCount <= this.episodes.length ? ep - 1 : Math.max(this.episodes.length - this._colCount, 0);
      return this.episodes.slice(begin, begin + this._colCount);
    }
    needSpread() {
      return this._colCount < this.episodes.length || this.spread;
    }
    toggleSpread() {
      this._spread = !this._spread;
      this._viewEpisodes = this._spread ? this.episodes : this.calcViewEpisodesOnCollapsed(this.ep);
      this._spreadBtnTop = 0;
      this.calcColCount();
      this.notify?.spread(this._spread);
    }
    updateEp() {
      let ep = this._ep;
      if (ep == this.ep)
        return;
      this._viewEpisodes = this._spread ? this.episodes : this.calcViewEpisodesOnCollapsed(this.ep);
      this.notify?.ep();
    }
  };
  var CollectionComponent = class {
    data;
    elem;
    constructor(season, player2) {
      this.data = new CollectionData(season);
      this.elem = new CollectionElement(this.data.needSpread() ? () => this.data.toggleSpread() : null);
      window.callAppointPart = (_p, video) => {
        let state = { aid: video.aid, cid: video.cid };
        window.history.pushState(state, "", "/video/av" + video.aid);
        this.onRouteChanged(state);
      };
      window.addEventListener("popstate", (e) => {
        this.reloadPlayer(e.state);
        this.onRouteChanged(e.state);
      });
      window.addEventListener("scroll", () => this.onWindowScroll());
      this.render();
      player2.parentNode.insertBefore(this.elem.container, player2);
      this.data.notify = {
        spread: (spread) => {
          this.render();
          !spread && window.scroll({ top: calcOffsetPos(document.getElementById("viewbox_report")).y });
        },
        spreadBtnTop: (top) => {
          this.elem.setSpreadAttr({ top });
        },
        ep: () => this.render()
      };
      xhrhook("/x/player/pagelist", void 0, (r) => {
        r.response = JSON.stringify({
          code: 0,
          message: 0,
          ttl: 1,
          data: this.data.pageList
        });
        r.responseText = r.response;
      }, false);
    }
    render() {
      this.elem.setContainerAttr({ class: "col-" + this.data.colCount });
      this.elem.setItemAttrs(this.data.viewEpisodes.map((p) => {
        return {
          class: p.aid == getAid() ? "on" : "",
          href: "/video/av" + p.aid,
          text: p.title,
          click: (_e) => {
            let video = { aid: p.aid, cid: p.cid };
            this.reloadPlayer(video);
            window.callAppointPart(1, video);
          }
        };
      }, this));
      this.elem.setSpreadAttr({
        top: this.data.spreadBtnTop,
        text: this.data.spread ? "收起" : "展开"
      });
    }
    reloadPlayer(v) {
      window.GrayManager.reload(\`aid=\${v.aid}&cid=\${v.cid}&has_next=1\`);
    }
    onWindowScroll() {
      if (!this.data.spread)
        return;
      let div = this.elem.container;
      let btn = this.elem.spread;
      let divY = calcOffsetPos(div).y;
      let maxTop = div.clientHeight - btn.clientHeight - 20;
      this.data.spreadBtnTop = window.scrollY <= divY - 20 ? 0 : Math.min(window.scrollY - divY + 20, maxTop);
    }
    onRouteChanged(state) {
      this.data.updateEp();
      let avComponent = window.biliUIcomponents;
      avComponent.\$store.state.aid = state.aid;
      xhr({
        url: objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: state.aid }),
        responseType: "json",
        credentials: true
      }).then((d) => {
        avComponent?.setVideoData(d.data?.View);
      });
      xhr({
        url: objUrl("https://api.bilibili.com/x/web-interface/archive/related", { aid: state.aid }),
        responseType: "json",
        credentials: true
      }).then((d) => avComponent.related = d.data);
      avComponent.initPage();
    }
  };
  var Collection = class {
    component = void 0;
    constructor(videoData) {
      xhrhook("/x/player.so", void 0, (r) => {
        r.response = r.response.replace(/<has_next>\\s*0/, "<has_next>1");
        r.responseText = r.response;
      }, false);
      doWhile(() => document.getElementById("__bofqi"), (player2) => {
        try {
          window.history.replaceState({ aid: videoData.aid, cid: videoData.cid }, "");
          this.component = new CollectionComponent(videoData.ugc_season, player2);
          this.component.render();
        } catch (e) {
          toast.error("collection.js", e);
        }
      });
      toast.warning("视频合集，现以分P样式呈现！", "如需关闭，请访问设置-重构-合集选项。");
    }
    static needDisplay(videoData) {
      return videoData.videos <= 1 && videoData.ugc_season && videoData.is_season_display;
    }
    static run(videoData) {
      this.needDisplay(videoData) && new Collection(videoData);
    }
  };
  function collection(v) {
    Collection.run(v);
  }

  // src/content/av/up_list.css
  var up_list_default = ".up-info-m .up-card-box {\\r\\n    white-space: nowrap;\\r\\n    overflow: auto;\\r\\n}\\r\\n\\r\\n.up-info-m .up-card {\\r\\n    display: inline-block;\\r\\n    margin-top: 10px;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar img {\\r\\n    cursor: pointer;\\r\\n    width: 40px;\\r\\n    height: 40px;\\r\\n    border-radius: 50%;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar {\\r\\n    position: relative;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar .info-tag {\\r\\n    position: absolute;\\r\\n    background: #fff;\\r\\n    border: 1px solid #fb7299;\\r\\n    border-radius: 2px;\\r\\n    display: inline-block;\\r\\n    font-size: 12px;\\r\\n    color: #fb7299;\\r\\n    padding: 0 3px;\\r\\n    top: -10px;\\r\\n    right: -10px;\\r\\n    white-space: nowrap;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar {\\r\\n    width: 60px;\\r\\n    height: 30px;\\r\\n    display: -ms-flexbox;\\r\\n    display: flex;\\r\\n    -ms-flex-pack: center;\\r\\n    justify-content: center;\\r\\n    -ms-flex-align: start;\\r\\n    align-items: flex-start;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar .name-text {\\r\\n    font-family: PingFangSC-Regular, sans-serif;\\r\\n    line-height: 30px;\\r\\n    color: #222;\\r\\n    word-break: break-all;\\r\\n    overflow: hidden;\\r\\n    text-overflow: ellipsis;\\r\\n    display: -webkit-box;\\r\\n    -webkit-line-clamp: 2;\\r\\n    -webkit-box-orient: vertical;\\r\\n    white-space: nowrap;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar .name-text.is-vip,\\r\\n.up-info-m .avatar .name-text:hover {\\r\\n    color: #fb7299;\\r\\n}\\r\\n\\r\\n.up-info-m .title {\\r\\n    display: block;\\r\\n    font-size: 14px;\\r\\n    margin-right: 80px;\\r\\n    color: #525659;\\r\\n    overflow: hidden;\\r\\n    height: 24px;\\r\\n    font-weight: 400;\\r\\n    padding: 8px 0;\\r\\n}\\r\\n\\r\\n.up-card-box::-webkit-scrollbar {\\r\\n    width: 7px;\\r\\n}\\r\\n\\r\\n.up-card-box::-webkit-scrollbar-track {\\r\\n    border-radius: 4px;\\r\\n    background-color: #EEE;\\r\\n}\\r\\n\\r\\n.up-card-box::-webkit-scrollbar-thumb {\\r\\n    border-radius: 4px;\\r\\n    background-color: #999;\\r\\n}";

  // src/content/av/up_list.ts
  function upList(staff) {
    doWhile(() => document.querySelector("#v_upinfo"), (node2) => {
      let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
      fl = staff.reduce((s, d) => {
        s = s + \`<div class="up-card">
                <a href="//space.bilibili.com/\${d.mid}" data-usercard-mid="\${d.mid}" target="_blank" class="avatar">
                <img src="\${d.face}@48w_48h.webp" /><!---->
                <span class="info-tag">\${d.title}</span><!----></a>
                <div class="avatar">
                <a href="//space.bilibili.com/\${d.mid}" data-usercard-mid="\${d.mid}" target="_blank" class="\${d.vip && d.vip.status ? "name-text is-vip" : "name-text"}">\${d.name}</a>
                </div></div>\`;
        return s;
      }, fl) + \`</div>\`;
      node2.innerHTML = fl;
      addCss(up_list_default);
    });
  }

  // src/runtime/variable/clean.ts
  var dushs = [
    "__INITIAL_STATE__",
    "__PGC_USERSTATE__",
    "__BILI_CONFIG__",
    "Sentry",
    "__mobxGlobals",
    "__mobxInstanceCount",
    "_babelPolyfill",
    "BiliJsBridge",
    "LazyLoad",
    "lazyload",
    "Bjax",
    "BPlayer",
    "BwpElement",
    "BwpMediaSource",
    "bPlayer",
    "PlayerAgent",
    "PlayerSetOnline",
    "abtest",
    "ad_rp",
    "ad_url",
    "bPlayer",
    "bsourceFrom",
    "deltaFilter",
    "directiveDispatcher",
    "flashChecker",
    "getAuthorInfo",
    "gqs",
    "heimu",
    "insertLink",
    "insertScript",
    "iris",
    "isBiliPlayer",
    "isEmbedPlayer",
    "isInit",
    "jsurl",
    "jsUrls",
    "loginInfoCallbacks",
    "md",
    "nano",
    "nanoWidgetsJsonp",
    "player",
    "playerInfo",
    "player_fullwin",
    "player_widewin",
    "rec_rp",
    "regeneratorRuntime",
    "reportConfig",
    "reportFistAdFs",
    "reportObserver",
    "setSize",
    "setSizeStyle",
    "vd",
    "videoWidgetsJsonP",
    "webAbTest",
    "BiliCm",
    "BiliHeader",
    "UserStatus",
    "jvsCert",
    "mOxie",
    "moxie",
    "plupload",
    "recaptcha",
    "setTid",
    "show1080p",
    "showCoopModal",
    "showPay",
    "swfobject",
    "tabSocket",
    "__BiliUser__",
    "___grecaptcha_cfg",
    "__core-js_shared__"
  ];
  function variableCleaner() {
    dushs.forEach((d) => {
      try {
        Reflect.deleteProperty(window, d);
      } catch (e) {
        window[d] = void 0;
      }
    });
  }

  // src/content/bangumi/script.html
  var script_default2 = '<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js"><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"><\\/script>\\r\\n<script>\\r\\n    window.__INITIAL_STATE__ = { activity: {}, app: false, area: 0, canReview: false, epId: -1, epInfo: {}, epList: [], epStat: { isPay: false, isVip: false, payPack: 0, status: 0, vipNeedPay: false }, isPlayerTrigger: false, loginInfo: { isLogin: false }, mdId: -1, mediaInfo: {}, mediaRating: {}, miniOn: 0, newestEp: {}, paster: {}, payMent: {}, payPack: {}, playerRecomList: [], pubInfo: {}, recomList: [], rightsInfo: {}, seasonFollowed: false, seasonList: [], seasonStat: { coins: 0, danmakus: 0, favorites: 0, views: 0 }, special: false, spending: 0, sponsorTotal: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } }, sponsorTotalCount: 0, sponsorWeek: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } }, ssId: -1, ssStat: { isPay: false, isVip: false, payPack: 0, status: 0, vipNeedPay: false }, upInfo: {}, userCoined: false, userLongReview: {}, userScore: 0, userShortReview: {}, userStat: { error: true, follow: 0, loaded: true, pay: 0, payPackPaid: 0, sponsor: 0, vipInfo: { due_date: 0, status: 0, type: 0 }, watchProgress: { lastEpId: -1, lastEpIndex: "", lastTime: 0 } }, ver: {} }; (function () { Reflect.deleteProperty(window, "webpackJsonp"); Reflect.deleteProperty(window, "_babelPolyfill"); var s; (s = document.currentScript || document.scripts[document.scripts.length - 1]).parentNode.removeChild(s); }());\\r\\n<\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"\\r\\n    crossorigin=""><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"\\r\\n    crossorigin=""><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\\/script>';

  // src/content/bangumi/bangumi.html
  var bangumi_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta charset="utf-8" />\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords"\\r\\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\\r\\n        title="哔哩哔哩" />\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" />\\r\\n    <style type="text/css">\\r\\n        .new-entry {\\r\\n            display: none;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container has-menu"></div>\\r\\n    <div id="app" data-server-rendered="true" class="main-container"></div>\\r\\n    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/content/bangumi/bangumi_initial_state.ts
  function setEpStat(status, pay, payPackPaid, loginInfo) {
    var s = 0, o = false, a = (1 === loginInfo.vipType || 2 === loginInfo.vipType) && 1 === loginInfo.vipStatus, r = "number" == typeof payPackPaid ? payPackPaid : -1;
    return 1 === pay ? s = 0 : 6 === status || 7 === status ? s = loginInfo.isLogin ? a ? 0 : 1 : 2 : 8 === status || 9 === status ? (s = loginInfo.isLogin ? 1 : 2, o = true) : 12 === status ? s = loginInfo.isLogin ? 1 === r ? 0 : 1 : 2 : 13 === status && (s = loginInfo.isLogin ? a ? 0 : 1 : 2), {
      status: s,
      isPay: 6 === status || 7 === status || 8 === status || 9 === status || 12 === status || 13 === status,
      isVip: a,
      vipNeedPay: o,
      payPack: r
    };
  }
  function V(t, e) {
    var i = Number(t), n = 1 === e || 4 === e || "番剧" === e || "国创" === e ? "话" : "集";
    return isNaN(i) ? t : "第".concat(i).concat(n);
  }
  function Q(t, e) {
    var i = {
      1: "番剧",
      2: "电影",
      3: "纪录片",
      4: "国创",
      5: "电视剧",
      7: "综艺",
      music: "音乐"
    };
    return [26484, 26481].indexOf(e) > -1 ? i.music : i[t] || "番剧";
  }
  function setTitle(t, e, i, n) {
    var s = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4], o = "";
    if (i = void 0 === i ? "番剧" : i, e && i)
      if (s && t) {
        var a = V(t, i);
        o = "".concat(e, "：").concat(a, "_").concat(i).concat(n ? "_bilibili" : "", "_哔哩哔哩");
      } else
        o = "".concat(e, "_").concat(i).concat(n ? "_bilibili" : "", "_哔哩哔哩");
    else
      o = "番剧".concat(n ? "_bilibili" : "", "_哔哩哔哩");
    if ("undefined" != typeof window) {
      var r = window.document.createElement("div");
      r.innerHTML = o, o = r.innerText || r.textContent, r = null;
    }
    return o;
  }
  async function bangumiInitialState() {
    try {
      let ssid = API.ssid;
      let epid = API.epid;
      const obj = epid ? { ep_id: epid } : { season_id: ssid };
      const result = await Promise.allSettled([
        xhr({
          url: objUrl("https://bangumi.bilibili.com/view/web_api/season", obj),
          responseType: "json",
          credentials: true
        }, true),
        xhr({
          url: objUrl("https://api.bilibili.com/pgc/view/web/season/user/status", obj),
          responseType: "json",
          credentials: true
        }, true)
      ]);
      const data = {};
      await new Promise((r) => doWhile(() => window.__INITIAL_STATE__, r));
      const t = window.__INITIAL_STATE__;
      result[0].status === "fulfilled" && result[0].value.code === 0 && (data.bangumi = result[0].value.result);
      result[1].status === "fulfilled" && result[1].value.code === 0 && (data.status = result[1].value.result);
      if (data.status) {
        const i = data.status.progress ? data.status.progress.last_ep_id : -1, n = data.status.progress ? data.status.progress.last_ep_index : "", s = data.status.progress ? data.status.progress.last_time : 0, o = data.status.vip_info || {};
        !epid && i > 0 && (epid = i);
        t.userStat = {
          loaded: true,
          error: void 0 === data.status.pay,
          follow: data.status.follow || 0,
          pay: data.status.pay || 0,
          payPackPaid: data.status.pay_pack_paid || 0,
          sponsor: data.status.sponsor || 0,
          watchProgress: {
            lastEpId: 0 === i ? -1 : i,
            lastEpIndex: n,
            lastTime: s
          },
          vipInfo: {
            due_date: o.due_date || 0,
            status: o.status || 0,
            type: o.type || 0
          }
        };
        data.status.paster && (t.paster = data.status.paster || {});
        API.limit = data.status.area_limit || 0;
        !setting.videoLimit.switch && (t.area = API.limit);
        t.seasonFollowed = 1 === data.status.follow;
      }
      if (data.bangumi) {
        let loopTitle2 = function() {
          doWhile(() => document.title != title, () => {
            document.title = title;
            if (document.title != title)
              loopTitle2();
          });
        };
        var loopTitle = loopTitle2;
        const i = JSON.parse(JSON.stringify(data.bangumi));
        delete i.episodes;
        delete i.seasons;
        delete i.up_info;
        delete i.rights;
        delete i.publish;
        delete i.newest_ep;
        delete i.rating;
        delete i.pay_pack;
        delete i.payment;
        delete i.activity;
        if (setting.bangumiEplist)
          delete i.bkg_cover;
        setting.videoLimit.switch && data.bangumi.rights && (data.bangumi.rights.watch_platform = 0);
        t.mediaInfo = i;
        t.mediaInfo.bkg_cover && (t.special = true, API.bkg_cover = t.mediaInfo.bkg_cover);
        t.ssId = data.bangumi.season_id || -1;
        t.mdId = data.bangumi.media_id;
        t.epInfo = epid && data.bangumi.episodes.find((d) => d.ep_id == epid) || data.bangumi.episodes[0] || {};
        t.epList = data.bangumi.episodes || [];
        t.seasonList = data.bangumi.seasons || [];
        t.upInfo = data.bangumi.up_info || {};
        t.rightsInfo = data.bangumi.rights || {};
        t.app = 1 === t.rightsInfo.watch_platform;
        t.pubInfo = data.bangumi.publish || {};
        t.newestEp = data.bangumi.newest_ep || {};
        t.mediaRating = data.bangumi.rating || {};
        t.payPack = data.bangumi.pay_pack || {};
        t.payMent = data.bangumi.payment || {};
        t.activity = data.bangumi.activity || {};
        t.epStat = setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
        t.epId = Number(epid || t.epInfo.ep_id);
        API.ssid = t.ssId;
        API.epid = t.epId;
        if (t.epInfo.badge === "互动") {
          sessionStorage2.setItem("keepNew", "旧版页面不支持互动视频！已重定向回新版页面，番剧能互动🤣");
          location.reload();
        }
        if (t.upInfo.mid == 677043260 || t.upInfo.mid == 688418886) {
          API.th = true;
        }
        const title = setTitle(t.epInfo.index, t.mediaInfo.title, Q(t.mediaInfo.season_type), true);
        loopTitle2();
      } else {
        debug.error(result[0]);
        debug.error(result[1]);
        return globalSession();
      }
    } catch (e) {
      toast.error("获取视频数据出错 ಥ_ಥ");
      debug.error("视频数据", e);
    }
  }
  async function globalSession() {
    toast.info("Bangumi号可能无效~", "正在尝试泰区代理接口~");
    let ssid = API.ssid;
    let epid = API.epid;
    const obj = epid ? { ep_id: epid } : { season_id: ssid };
    Object.assign(obj, {
      access_key: setting.accessKey.key || void 0,
      build: 108003,
      mobi_app: "bstar_a",
      s_locale: "zh_SG"
    });
    try {
      const result = await xhr({
        url: objUrl(\`https://\${setting.videoLimit.th || "api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season\`, obj),
        responseType: "json"
      }, true);
      if (result.code === 0) {
        let loopTitle2 = function() {
          doWhile(() => document.title != title, () => {
            document.title = title;
            if (document.title != title)
              loopTitle2();
          });
        };
        var loopTitle = loopTitle2;
        window.postMessage({ \$type: "th" });
        await new Promise((r) => doWhile(() => window.__INITIAL_STATE__, r));
        const t = window.__INITIAL_STATE__;
        const i = JSON.parse(JSON.stringify(result.result));
        const episodes = result.result.modules.reduce((s, d) => {
          d.data.episodes.forEach((d2) => {
            s.push({
              aid: d2.aid,
              cid: d2.id,
              cover: d2.cover,
              ep_id: d2.id,
              episode_status: d2.status,
              from: d2.from,
              index: d2.title,
              index_title: d2.title_display,
              subtitles: d2.subtitles
            });
          });
          return s;
        }, []);
        t.mediaInfo = {
          actors: i.actor?.info,
          alias: i.alias,
          areas: i.areas,
          cover: i.cover,
          evaluate: i.evaluate,
          is_paster_ads: 0,
          jp_title: i.origin_name,
          link: i.link,
          media_id: -1,
          mode: i.mode,
          paster_text: "",
          season_id: i.season_id,
          season_status: i.status,
          season_title: i.season_title,
          season_type: i.type,
          series_title: i.title,
          square_cover: i.square_cover,
          staff: i.actor?.info,
          stat: i.stat,
          style: i.styles?.reduce((s, d) => {
            s.push(d.name);
            return s;
          }, []),
          title: i.title,
          total_ep: i.total
        };
        t.mediaInfo.bkg_cover && (t.special = true, API.bkg_cover = t.mediaInfo.bkg_cover);
        t.ssId = result.result.season_id || -1;
        t.epInfo = epid && episodes.find((d) => d.ep_id == epid) || episodes[0] || {};
        t.epList = episodes;
        t.seasonList = result.result.series?.seasons?.reduce((s, d) => {
          s.push({
            badge: "独家",
            badge_type: 1,
            cover: "",
            media_id: -1,
            new_ep: {},
            season_id: d.season_id,
            season_title: d.quarter_title,
            season_type: 1,
            stat: {},
            title: d.quarter_title
          });
          return s;
        }, []) || [];
        t.upInfo = result.result.up_info || {};
        t.rightsInfo = result.result.rights || {};
        t.app = 1 === t.rightsInfo.watch_platform;
        result.result.publish.is_started = 1;
        result.result.publish?.time_length_show === "已完结" && (result.result.publish.is_finish = 1);
        t.pubInfo = result.result.publish || {};
        if (result.result.new_ep) {
          result.result.new_ep.desc = result.result.new_ep.new_ep_display;
          result.result.new_ep.index = result.result.new_ep.title;
        }
        t.newestEp = result.result.new_ep || {};
        t.mediaRating = result.result.rating || {};
        t.payPack = result.result.pay_pack || {};
        t.payMent = result.result.payment || {};
        t.activity = result.result.activity_dialog || {};
        t.epStat = setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
        t.epId = Number(epid || t.epInfo.ep_id);
        API.ssid = t.ssId;
        API.epid = t.epId;
        API.th = true;
        xhrhook("api.bilibili.com/pgc/web/season/stat", void 0, (res) => {
          const t2 = \`{"code": 0,"message":"0","ttl":1,"result":\${JSON.stringify(result.result.stat)}}\`;
          res.responseType === "json" ? res.response = JSON.parse(t2) : res.response = res.responseText = t2;
        }, false);
        toast.warning("这大概是一个泰区专属Bangumi，可能没有弹幕和评论区，可以使用【在线弹幕】【播放本地文件】等功能载入弹幕~", "另外：播放泰区番剧还可能导致历史记录错乱，请多担待🤣");
        const title = setTitle(t.epInfo.index, t.mediaInfo.title, Q(t.mediaInfo.season_type), true);
        loopTitle2();
      } else
        throw result;
    } catch (e) {
      toast.error("访问泰区B站出错，请检查泰区代理服务器设置~", "或许这就是个无效Bangumi？", e);
      debug.error("BilibiliGlobal", e);
    }
  }

  // src/content/av/load_by_dm_id.ts
  function loadByDmId() {
    const dmid = urlObj(location.href).dmid;
    let progress = Number(urlObj(location.href).dm_progress);
    let first2 = 0;
    switchVideo(async () => {
      if (!window.player?.seek) {
        await new Promise((r) => {
          doWhile(() => window.player?.seek, r);
        });
      }
      if (first2)
        return;
      first2++;
      if (progress)
        return window.player.seek(progress);
      if (dmid) {
        progress = await xhr({
          url: \`https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=\${API.cid}&dmid=\${dmid}\`,
          credentials: true
        }, true);
        progress = jsonCheck(progress).data.progress;
        progress && window.player.seek(progress / 1e3 - 0.2);
      }
    });
  }

  // src/runtime/lib/cubic_bezier.ts
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 1e-3;
  var SUBDIVISION_PRECISION = 1e-7;
  var SUBDIVISION_MAX_ITERATIONS = 10;
  var kSplineTableSize = 11;
  var kSampleStepSize = 1 / (kSplineTableSize - 1);
  var float32ArraySupported = typeof Float32Array === "function";
  function A(aA1, aA2) {
    return 1 - 3 * aA2 + 3 * aA1;
  }
  function B(aA1, aA2) {
    return 3 * aA2 - 6 * aA1;
  }
  function C(aA1) {
    return 3 * aA1;
  }
  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }
  function getSlope(aT, aA1, aA2) {
    return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
  }
  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    let currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }
  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0) {
        return aGuessT;
      }
      const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
  function LinearEasing(x) {
    return x;
  }
  function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error("bezier x values must be in [0, 1] range");
    }
    if (mX1 === mY1 && mX2 === mY2) {
      return LinearEasing;
    }
    const sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (let i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
    function getTForX(aX) {
      let intervalStart = 0;
      let currentSample = 1;
      const lastSample = kSplineTableSize - 1;
      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;
      const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      const guessForT = intervalStart + dist * kSampleStepSize;
      const initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }
    return function BezierEasing(x) {
      if (x === 0 || x === 1) {
        return x;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  }

  // src/content/animated_banner.html
  var animated_banner_default = '<style type="text/css">\\r\\n    .animated-banner {\\r\\n        position: absolute;\\r\\n        top: 0;\\r\\n        bottom: 0;\\r\\n        left: 0;\\r\\n        right: 0;\\r\\n    }\\r\\n\\r\\n    .animated-banner>.layer {\\r\\n        position: absolute;\\r\\n        left: 0;\\r\\n        top: 0;\\r\\n        height: 100%;\\r\\n        width: 100%;\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        overflow: hidden;\\r\\n    }\\r\\n\\r\\n    @keyframes banner-fade-in {\\r\\n        0% {\\r\\n            opacity: 0;\\r\\n        }\\r\\n\\r\\n        100% {\\r\\n            opacity: 1;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    .animated-banner .layer {\\r\\n        animation: banner-fade-in 0.7s;\\r\\n    }\\r\\n</style>';

  // src/content/banner.ts
  var primaryMenu = () => {
    doWhile(() => document.querySelector("#primary_menu"), () => {
      const vue = document.querySelector("#primary_menu").__vue__;
      vue.menuList.forEach((d, i, s) => {
        switch (d.name) {
          case "动画":
            s[i].sub = [{ "name": "MAD·AMV", "route": "mad", "tid": 24, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 151 }, "desc": "具有一定制作程度的动画或静画的二次创作视频", "url": "//www.bilibili.com/video/douga-mad-1.html" }, { "name": "MMD·3D", "route": "mmd", "tid": 25, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 152 }, "desc": "使用MMD（MikuMikuDance）和其他3D建模类软件制作的视频", "url": "//www.bilibili.com/video/douga-mmd-1.html" }, { "name": "短片·手书·配音", "route": "voice", "tid": 47, "ps": 15, "rps": 10, "desc": "追求创新并具有强烈特色的短片、手书（绘）及ACG相关配音", "url": "//www.bilibili.com/video/douga-voice-1.html" }, { "name": "手办·模玩", "route": "garage_kit", "tid": 210, "ps": 15, "rps": 10, "desc": "手办模玩的测评、改造或其他衍生内容", "url": "" }, { "name": "特摄", "route": "tokusatsu", "tid": 86, "ps": 15, "rps": 10, "desc": "特摄相关衍生视频", "url": "//www.bilibili.com/video/cinephile-tokusatsu.html" }, { "name": "综合", "route": "other", "tid": 27, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 153 }, "desc": "以动画及动画相关内容为素材，包括但不仅限于音频替换、杂谈、排行榜等内容", "url": "//www.bilibili.com/video/douga-else-1.html" }];
            break;
          case "音乐":
            s[i].sub = [{ "name": "原创音乐", "route": "original", "tid": 28, "ps": 15, "rps": 10, "viewHotTag": true, "ad": { "active": true, "dataLocId": 243 }, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "原创歌曲及纯音乐，包括改编、重编曲及remix", "url": "//www.bilibili.com/video/music-original-1.html" }, { "name": "翻唱", "route": "cover", "tid": 31, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 245 }, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "对曲目的人声再演绎视频", "url": "//www.bilibili.com/video/music-Cover-1.html" }, { "name": "演奏", "route": "perform", "tid": 59, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "乐器和非传统乐器器材的演奏作品", "url": "//www.bilibili.com/video/music-perform-1.html" }, { "name": "VOCALOID·UTAU", "route": "vocaloid", "tid": 30, "ps": 15, "rps": 10, "viewHotTag": true, "ad": { "active": true, "dataLocId": 247 }, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "以VOCALOID等歌声合成引擎为基础，运用各类音源进行的创作", "url": "//www.bilibili.com/video/music-vocaloid-1.html" }, { "name": "音乐现场", "route": "live", "tid": 29, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "音乐表演的实况视频，包括官方/个人拍摄的综艺节目、音乐剧、音乐节、演唱会等", "url": "//www.bilibili.com/video/music-oped-1.html" }, { "name": "MV", "route": "mv", "tid": 193, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "为音乐作品配合拍摄或制作的音乐录影带（Music Video），以及自制拍摄、剪辑、翻拍MV", "url": "//www.bilibili.com/video/music-coordinate-1.html" }, { "name": "乐评盘点", "route": "commentary", "tid": 243, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "音乐类新闻、盘点、点评、reaction、榜单、采访、幕后故事、唱片开箱等", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音乐教学", "route": "tutorial", "tid": 244, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "以音乐教学为目的的内容", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音乐综合", "route": "other", "tid": 130, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "所有无法被收纳到其他音乐二级分区的音乐类视频", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音频", "customZone": "Audio", "route": "audio", "url": "//www.bilibili.com/audio/home?musicType=music" }, { "name": "说唱", "url": "//www.bilibili.com/v/rap" }];
            break;
          case "科技":
            s[i].name = "知识";
            s[i].route = "knowledge";
            s[i].sub = [{ "name": "科学科普", "route": "science", "tid": 201, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 261 }, "desc": "回答你的十万个为什么" }, { "name": "社科·法律·心理", "route": "social_science", "tid": 124, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 263 }, "desc": "基于社会科学、法学、心理学展开或个人观点输出的知识视频" }, { "name": "人文历史", "route": "humanity_history", "tid": 228, "ps": 15, "rps": 10, "desc": "看看古今人物，聊聊历史过往，品品文学典籍" }, { "name": "财经商业", "route": "business", "tid": 207, "ps": 15, "rps": 10, "desc": "说金融市场，谈宏观经济，一起畅聊商业故事" }, { "name": "校园学习", "route": "campus", "tid": 208, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 265 }, "desc": "老师很有趣，学生也有才，我们一起搞学习" }, { "name": "职业职场", "route": "career", "tid": 209, "ps": 15, "rps": 10, "desc": "职业分享、升级指南，一起成为最有料的职场人" }, { "name": "设计·创意", "route": "design", "tid": 229, "ps": 15, "rps": 10, "desc": "天马行空，创意设计，都在这里" }, { "name": "野生技能协会", "route": "skill", "tid": 122, "ps": 15, "rps": 10, "desc": "技能党集合，是时候展示真正的技术了" }];
            break;
          case "数码":
            s[i].name = "科技";
            s[i].route = "tech";
            s[i].sub = [{ "name": "数码", "route": "digital", "tid": 95, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "科技数码产品大全，一起来做发烧友", "url": "#" }, { "name": "软件应用", "route": "application", "tid": 230, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "超全软件应用指南", "url": "#" }, { "name": "计算机技术", "route": "computer_tech", "tid": 231, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "研究分析、教学演示、经验分享......有关计算机技术的都在这里", "url": "#" }, { "name": "科工机械", "route": "industry", "tid": 232, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "从小芯片到大工程，一起见证科工力量", "url": "#" }, { "name": "极客DIY", "route": "diy", "tid": 233, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "炫酷技能，极客文化，硬核技巧，准备好你的惊讶", "url": "#" }];
            break;
          case "生活":
            s[i].sub = [{ "name": "搞笑", "route": "funny", "tid": 138, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 273 }, "desc": "各种沙雕有趣的搞笑剪辑，挑战，表演，配音等视频", "url": "//www.bilibili.com/video/ent_funny_1.html", "locid": 4204, "recommendId": 4210, "slider": { "width": 620, "height": 220 }, "customComponent": { "name": "Energy", "leftId": 4212, "rightId": 4218, "rightType": "slide" } }, { "name": "家居房产", "route": "home", "tid": 239, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 275 }, "desc": "与买房、装修、居家生活相关的分享", "url": "#" }, { "name": "手工", "route": "handmake", "tid": 161, "ps": 15, "rps": 10, "desc": "手工制品的制作过程或成品展示、教程、测评类视频", "url": "//www.bilibili.com/video/ent-handmake-1.html" }, { "name": "绘画", "route": "painting", "tid": 162, "ps": 15, "rps": 10, "desc": "绘画过程或绘画教程，以及绘画相关的所有视频", "url": "//www.bilibili.com/video/ent-painting-1.html" }, { "name": "日常", "route": "daily", "tid": 21, "ps": 15, "rps": 10, "desc": "记录日常生活，分享生活故事", "url": "//www.bilibili.com/video/ent-life-1.html" }];
            break;
          case "鬼畜":
            s[i].sub = [{ "name": "鬼畜调教", "route": "guide", "tid": 22, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 285 }, "desc": "使用素材在音频、画面上做一定处理，达到与BGM一定的同步感", "url": "//www.bilibili.com/video/ent-Kichiku-1.html" }, { "name": "音MAD", "route": "mad", "tid": 26, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 287 }, "desc": "使用素材音频进行一定的二次创作来达到还原原曲的非商业性质稿件", "url": "//www.bilibili.com/video/douga-kichiku-1.html" }, { "name": "人力VOCALOID", "route": "manual_vocaloid", "tid": 126, "ps": 15, "rps": 10, "desc": "将人物或者角色的无伴奏素材进行人工调音，使其就像VOCALOID一样歌唱的技术", "url": "//www.bilibili.com/video/kichiku-manual_vocaloid-1.html" }, { "name": "鬼畜剧场", "route": "theatre", "tid": 216, "ps": 15, "rps": 10, "desc": "使用素材进行人工剪辑编排的有剧情的作品" }, { "name": "教程演示", "route": "course", "tid": 127, "ps": 10, "rps": 6, "rightComponent": { "name": "CmImgList", "id": 148 }, "ad": { "active": true, "dataLocId": 289 }, "hideDropdown": false, "desc": "鬼畜相关的教程演示", "url": "//www.bilibili.com/video/kichiku-course-1.html" }];
            break;
          case "时尚":
            s[i].sub = [{ "name": "美妆护肤", "route": "makeup", "tid": 157, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 279 }, "desc": "彩妆护肤、美甲美发、仿妆、医美相关内容分享或产品测评", "url": "//www.bilibili.com/video/fashion-makeup-fitness-1.html" }, { "name": "穿搭", "route": "clothing", "tid": 158, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 281 }, "desc": "穿搭风格、穿搭技巧的展示分享，涵盖衣服、鞋靴、箱包配件、配饰（帽子、钟表、珠宝首饰）等", "url": "//www.bilibili.com/video/fashion-clothing-1.html" }, { "name": "时尚潮流", "route": "trend", "tid": 159, "ps": 15, "rps": 10, "desc": "时尚街拍、时装周、时尚大片，时尚品牌、潮流等行业相关记录及知识科普", "url": "#" }];
            break;
          case "广告":
            s[i].name = "资讯";
            s[i].route = "information";
            s[i].tid = 202;
            s[i].sub = [{ "name": "热点", "route": "hotspot", "tid": 203, "ps": 18, "rps": 10, "desc": "全民关注的时政热门资讯" }, { "name": "环球", "route": "global", "tid": 204, "ps": 18, "rps": 10, "desc": "全球范围内发生的具有重大影响力的事件动态" }, { "name": "社会", "route": "social", "tid": 205, "ps": 18, "rps": 10, "desc": "日常生活的社会事件、社会问题、社会风貌的报道" }, { "name": "综合", "route": "multiple", "tid": 206, "ps": 18, "rps": 10, "desc": "除上述领域外其它垂直领域的综合资讯" }];
            break;
          case "娱乐":
            s[i].sub = [{ "name": "综艺", "route": "variety", "tid": 71, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 267 }, "desc": "所有综艺相关，全部一手掌握！", "url": "//www.bilibili.com/video/ent-variety-1.html" }, { "name": "娱乐杂谈", "route": "talker", "tid": 241, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 269 }, "desc": "娱乐人物解读、娱乐热点点评、娱乐行业分析" }, { "name": "粉丝创作", "route": "fans", "tid": 242, "ps": 15, "rps": 10, "desc": "粉丝向创作视频" }, { "name": "明星综合", "route": "celebrity", "tid": 137, "ps": 15, "rps": 10, "desc": "娱乐圈动态、明星资讯相关" }];
            break;
        }
      });
    });
    jsonphookasync("api.bilibili.com/plaza/banner", () => true, async () => {
      return { "code": 0, "result": [{ "link": "https://www.bilibili.com/blackboard/x/act_list", "end": 1640966407, "begin": 1456709887, "title": "bilibili 活动", "cover": "http://i0.hdslb.com/bfs/square/6830d0e479eee8cc9a42c3e375ca99a5147390cd.jpg", "id": 9, "created_ts": 1491386053 }, { "link": "http://www.bilibili.com/blackboard/topic_list.html", "end": 1640966418, "begin": 1544258598, "title": "话题列表", "cover": "http://i0.hdslb.com/bfs/square/b1b00a0c3ce8570b48277ae07a2e55603a4a4ddf.jpg", "id": 17, "created_ts": 1491386030 }] };
    }, false);
    jsonphookasync("api.bilibili.com/x/web-interface/index/icon", void 0, async () => {
      const data = await fetch("https://www.bilibili.com/index/index-icon.json").then((d) => d.json());
      return {
        code: 0,
        data: subArray(data.fix),
        message: "0",
        ttl: 1
      };
    }, false);
  };
  var banner = () => {
    document.head.appendChild(createElements(htmlVnode(animated_banner_default)));
    class Animate {
      static once = false;
      static record = {};
      static rid = this.resourceId();
      static locs = [1576, 1612, 1580, 1920, 1584, 1588, 1592, 3129, 1600, 1608, 1604, 1596, 2210, 1634, 142];
      animatedBannerSupport = typeof CSS !== "undefined" && CSS.supports && CSS.supports("filter: blur(1px)") && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      layerConfig = {};
      resources = [];
      entered = false;
      extensions = [];
      handleMouseLeave = void 0;
      handleMouseMove = void 0;
      handleResize = void 0;
      constructor(v) {
        if (this.animatedBannerSupport)
          this.mounted(v);
        if (v.is_split_layer !== 0) {
          addCss(".blur-bg {display:none}");
        } else
          addCss(".blur-bg {background:none !important;-webkit-backdrop-filter: blur(4px);backdrop-filter: blur(4px)}");
      }
      static resourceId() {
        if (location.href.includes("v/douga"))
          return 1576;
        if (location.href.includes("/anime"))
          return 1612;
        if (location.href.includes("v/music"))
          return 1580;
        if (location.href.includes("/guochuang"))
          return 1920;
        if (location.href.includes("v/dance"))
          return 1584;
        if (location.href.includes("v/game"))
          return 1588;
        if (location.href.includes("v/knowledge"))
          return 1592;
        if (location.href.includes("v/tech"))
          return 3129;
        if (location.href.includes("v/life"))
          return 1600;
        if (location.href.includes("v/kichiku"))
          return 1608;
        if (location.href.includes("v/fashion"))
          return 1604;
        if (location.href.includes("v/ent"))
          return 1596;
        if (location.href.includes("v/cinephile"))
          return 2210;
        if (location.href.includes("/cinema"))
          return 1634;
        return 142;
      }
      async mounted(v) {
        this.layerConfig = JSON.parse(v.split_layer);
        if (!this.layerConfig.layers)
          return;
        try {
          if ("extensions" in this.layerConfig && "time" in this.layerConfig.extensions) {
            let time = void 0, now = (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1e3;
            let timeCode = Object.keys(this.layerConfig.extensions.time).sort((a, b) => parseInt(a) - parseInt(b));
            for (let t of timeCode) {
              if (parseInt(t) < now)
                time = parseInt(t);
              else
                break;
            }
            let timelayers = this.layerConfig.extensions.time[time];
            this.layerConfig.layers = timelayers[Math.floor(Math.random() * timelayers.length)].layers;
          }
          await Promise.all(this.layerConfig.layers.map(async (v2, index) => {
            return Promise.all(v2.resources.map(async (i) => {
              if (/\\.(webm|mp4)\$/.test(i.src)) {
                const res = await fetch(i.src).then((d) => d.blob());
                const url = URL.createObjectURL(res);
                const video = document.createElement("video");
                video.muted = true;
                video.loop = true;
                video.src = url;
                video.playsInline = true;
                video.style.objectFit = "cover";
                this.resources[index] = video;
                video.width = 0;
                video.height = 0;
                document.body.appendChild(video);
                await new Promise((resolve) => {
                  const onMetaLoad = () => {
                    resolve(true);
                    video.removeEventListener("loadedmetadata", onMetaLoad);
                  };
                  video.addEventListener("loadedmetadata", onMetaLoad);
                });
              } else {
                const img = document.createElement("img");
                img.src = i.src;
                await new Promise((resolve) => img.onload = resolve);
                this.resources[index] = img;
              }
            }));
          }));
        } catch (e) {
          debug.error("load animated banner images error", e);
          return;
        }
        let container = document.querySelector("#banner_link");
        if (!container) {
          container = document.querySelector(".h-center");
          if (!container)
            return this.resources.forEach((d) => d.remove());
          container.parentElement.removeAttribute("style");
          container.style.width = "100%";
          container.style.top = "-42px";
          container.style.marginBottom = "-42px";
          container.innerHTML = "";
          document.querySelector(".b-header-mask-wrp")?.remove();
        }
        ;
        container.classList.add("animated-banner");
        let containerHeight = container.clientHeight;
        let containerWidth = container.clientWidth;
        let containerScale = 180 / 155;
        this.layerConfig.layers.forEach((v2) => {
          v2._initState = {
            scale: 1,
            rotate: v2.rotate?.initial || 0,
            translate: v2.translate?.initial || [0, 0],
            blur: v2.blur?.initial || 0,
            opacity: v2.opacity?.initial === void 0 ? 1 : v2.opacity.initial
          };
          v2.resources.forEach((i, index) => {
            const el = this.resources[index];
            if (el.tagName === "VIDEO") {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
              el.dataset.height = el.videoHeight;
              el.dataset.width = el.videoWidth;
            } else {
              el.dataset.height = el.naturalHeight;
              el.dataset.width = el.naturalWidth;
            }
            const initial = v2.scale?.initial === void 0 ? 1 : v2.scale?.initial;
            el.height = el.dataset.height * containerScale * initial;
            el.width = el.dataset.width * containerScale * initial;
          });
        });
        const layers = this.layerConfig.layers.map((v2) => {
          const layer = document.createElement("div");
          layer.classList.add("layer");
          container.appendChild(layer);
          return layer;
        });
        let displace = 0;
        let enterX = 0;
        let raf = 0;
        const curveParameterToFunc = (param2) => {
          const o = bezier(...param2);
          return (v2) => v2 > 0 ? o(v2) : -o(-v2);
        };
        let lastDisplace = NaN;
        const af = (t) => {
          try {
            if (lastDisplace === displace) {
              return;
            }
            lastDisplace = displace;
            layers.map((layer, i) => {
              const v2 = this.layerConfig.layers[i];
              const a = layer.firstChild;
              if (!a) {
                return;
              }
              const transform = {
                scale: v2._initState.scale,
                rotate: v2._initState.rotate,
                translate: v2._initState.translate
              };
              if (v2.scale) {
                const x = v2.scale.offset || 0;
                const itp = v2.scale.offsetCurve ? curveParameterToFunc(v2.scale.offsetCurve) : (x2) => x2;
                const offset = x * itp(displace);
                transform.scale = v2._initState.scale + offset;
              }
              if (v2.rotate) {
                const x = v2.rotate.offset || 0;
                const itp = v2.rotate.offsetCurve ? curveParameterToFunc(v2.rotate.offsetCurve) : (x2) => x2;
                const offset = x * itp(displace);
                transform.rotate = v2._initState.rotate + offset;
              }
              if (v2.translate) {
                const x = v2.translate.offset || [0, 0];
                const itp = v2.translate.offsetCurve ? curveParameterToFunc(v2.translate.offsetCurve) : (x2) => x2;
                const offset = x.map((v3) => itp(displace) * v3);
                const translate = v2._initState.translate.map((x2, i2) => (x2 + offset[i2]) * containerScale * (v2.scale?.initial || 1));
                transform.translate = translate;
              }
              a.style.transform = \`scale(\${transform.scale})translate(\${transform.translate[0]}px, \${transform.translate[1]}px)rotate(\${transform.rotate}deg)\`;
              if (v2.blur) {
                const x = v2.blur.offset || 0;
                const itp = v2.blur.offsetCurve ? curveParameterToFunc(v2.blur.offsetCurve) : (x2) => x2;
                const blurOffset = x * itp(displace);
                let res = 0;
                if (!v2.blur.wrap || v2.blur.wrap === "clamp") {
                  res = Math.max(0, v2._initState.blur + blurOffset);
                } else if (v2.blur.wrap === "alternate") {
                  res = Math.abs(v2._initState.blur + blurOffset);
                }
                a.style.filter = res < 1e-4 ? "" : \`blur(\${res}px)\`;
              }
              if (v2.opacity) {
                const x = v2.opacity.offset || 0;
                const itp = v2.opacity.offsetCurve ? curveParameterToFunc(v2.opacity.offsetCurve) : (x2) => x2;
                const opacityOffset = x * itp(displace);
                const initial = v2._initState.opacity;
                if (!v2.opacity.wrap || v2.opacity.wrap === "clamp") {
                  a.style.opacity = Math.max(0, Math.min(1, initial + opacityOffset));
                } else if (v2.opacity.wrap === "alternate") {
                  const x2 = initial + opacityOffset;
                  let y = Math.abs(x2 % 1);
                  if (Math.abs(x2 % 2) >= 1) {
                    y = 1 - y;
                  }
                  a.style.opacity = y;
                }
              }
            });
          } catch (e) {
            debug.error(e);
          }
        };
        this.layerConfig.layers.map((v2, i) => {
          const a = this.resources[i];
          layers[i].appendChild(a);
          if (a.tagName === "VIDEO") {
            a.play();
          }
          requestAnimationFrame(af);
        });
        const handleLeave = () => {
          const now = performance.now();
          const timeout = 200;
          const tempDisplace = displace;
          cancelAnimationFrame(raf);
          const leaveAF = (t) => {
            if (t - now < timeout) {
              displace = tempDisplace * (1 - (t - now) / 200);
              af(t);
              requestAnimationFrame(leaveAF);
            } else {
              displace = 0;
              af(t);
            }
          };
          raf = requestAnimationFrame(leaveAF);
        };
        this.handleMouseLeave = (e) => {
          this.entered = false;
          handleLeave();
        };
        this.handleMouseMove = (e) => {
          const offsetY = document.documentElement.scrollTop + e.clientY;
          if (offsetY < containerHeight) {
            if (!this.entered) {
              this.entered = true;
              enterX = e.clientX;
            }
            displace = (e.clientX - enterX) / containerWidth;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(af);
          } else {
            if (this.entered) {
              this.entered = false;
              handleLeave();
            }
          }
          this.extensions.map((v2) => v2.handleMouseMove?.({ e, displace }));
        };
        this.handleResize = (e) => {
          containerHeight = container.clientHeight;
          containerWidth = container.clientWidth;
          containerScale = 180 / 155;
          this.layerConfig.layers.forEach((lc) => {
            lc.resources.forEach((d, i) => {
              const el = this.resources[i];
              el.height = el.dataset.height * containerScale * (lc.scale?.initial || 1);
              el.width = el.dataset.width * containerScale * (lc.scale?.initial || 1);
            });
          });
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame((t) => {
            af(t);
          });
          this.extensions.map((v2) => v2.handleResize?.(e));
        };
        document.addEventListener("mouseleave", this.handleMouseLeave);
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("resize", this.handleResize);
      }
    }
    jsonphookasync("api.bilibili.com/x/web-show/res/loc", void 0, async (url) => {
      const obj = new URL(url);
      obj.searchParams.delete("callback");
      let loc = Animate.record[url];
      let header2 = Animate.record[Animate.rid];
      let rqs;
      if (!loc || !header2) {
        rqs = await Promise.all([
          fetch(obj.toJSON()).then((d) => d.json()),
          fetch(\`https://api.bilibili.com/x/web-show/page/header?resource_id=\${Animate.rid}\`).then((d) => d.json())
        ]);
        loc = Animate.record[url] = rqs[0];
        header2 = Animate.record[Animate.rid] = rqs[1];
      }
      loc.data && Animate.locs.forEach((d) => {
        loc.data[d] && (loc.data[d][0].pic = header2 && header2.data.pic || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png", loc.data[d][0].litpic = header2 && header2.data.litpic, loc.data[d][0].url = header2 && header2.data.url || "", loc.data[d][0].title = header2 && header2.data.name || "");
        if (url.includes("loc?") && obj.searchParams.get("id") == String(d)) {
          loc.data[0].pic = header2 && header2.data.pic || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png";
          loc.data[0].litpic = header2 && header2.data.litpic || "";
          loc.data[0].url = header2 && header2.data.url || "";
          loc.data[0].title = header2 && header2.data.name || "";
        }
      });
      setting.animatedBanner && !Animate.once && (Animate.once = true, setTimeout(() => new Animate(header2.data)));
      return loc;
    }, false);
  };

  // src/content/bangumi/episode_data.ts
  var first = 0;
  function episodeData() {
    switchVideo(async () => {
      try {
        first++;
        let views = document.querySelector(".view-count").querySelector("span");
        let danmakus = document.querySelector(".danmu-count").querySelector("span");
        if (first === 1) {
          const [view2, danmaku3] = [
            unitFormat(API.__INITIAL_STATE__.mediaInfo.stat.views),
            unitFormat(API.__INITIAL_STATE__.mediaInfo.stat.danmakus)
          ];
          views.setAttribute("title", "总播放数 " + view2);
          danmakus.setAttribute("title", "总弹幕数 " + danmaku3);
          debug.log("总播放数：", view2, "总弹幕数", danmaku3);
        }
        let data = await xhr({
          url: objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": API.aid }),
          credentials: true
        });
        data = jsonCheck(data).data;
        let view = data.view;
        let danmaku2 = data.danmaku;
        view = unitFormat(view);
        danmaku2 = unitFormat(danmaku2);
        views.innerText = view;
        danmakus.innerText = danmaku2;
        debug.debug("播放", view + " 弹幕", danmaku2);
      } catch (e) {
        debug.error("episodeData.js", e);
      }
    });
  }

  // src/runtime/variable/path.ts
  var path = location.href.split("/");

  // src/content/dynamic.ts
  function dynamicPage() {
    xhrhook("api.bilibili.com/x/polymer/web-dynamic/v1/feed/all", void 0, (r) => {
      try {
        const response = jsonCheck(r.response);
        response.data.items = response.data.items.filter((d) => d.modules?.module_dynamic?.major?.archive?.badge?.text != "直播回放");
        r.responseType === "json" ? r.response = response : r.response = r.responseText = JSON.stringify(response);
      } catch (e) {
      }
    }, false);
  }

  // src/content/history.ts
  function historyPage() {
    setting.history && xhrhook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function(args) {
      let obj = new URL(args[1]), max = obj.searchParams.get("max") || "", view_at = obj.searchParams.get("view_at") || "";
      args[1] = objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max, view_at, type: "archive", ps: "20" });
    }, void 0, false);
    setting.searchHistory && doWhile(() => document.querySelector(".b-head-search"), () => document.querySelector(".b-head-search")?.remove());
  }

  // src/content/index/timeline.ts
  var inline = [];
  function getDate(ctx) {
    let result = "";
    ctx.replace(/\\d{2}:\\d{2}/, (d) => result = d);
    return result;
  }
  function decodeInline(title, item) {
    let i = 0;
    switch (title) {
      case "周一":
        i = 1;
        break;
      case "周二":
        i = 2;
        break;
      case "周三":
        i = 3;
        break;
      case "周四":
        i = 4;
        break;
      case "周五":
        i = 5;
        break;
      case "周六":
        i = 6;
        break;
      case "周日":
        i = 7;
        break;
    }
    inline[i] || (inline[i] = {});
    item.forEach((d) => {
      let time = getDate(d.content);
      if (time) {
        inline[i][time] || (inline[i][time] = []);
        inline[i][time].push({
          cover: "",
          delay: 0,
          delay_id: 0,
          delay_index: "",
          delay_reason: "",
          ep_cover: "",
          episode_id: -1,
          follows: d.positions.position3,
          plays: d.positions.position2,
          pub_index: d.positions.position4,
          pub_time: time,
          pub_ts: -1,
          published: 1,
          season_id: d.item_id,
          square_cover: d.image,
          title: d.title
        });
      }
    });
  }
  var timeline = () => {
    doWhile(() => document.querySelector("#bili_bangumi > .bangumi-module")?.__vue__ || window?.__INITIAL_STATE__, async (d) => {
      try {
        const index = await urlPack.getJson("app.bilibili.com/x/v2/activity/index", { page_id: 167998 });
        const item = index.data.cards[0].item[0].item;
        await Promise.all(item.reduce((s, d2) => {
          s.push(urlPack.getJson("app.bilibili.com/x/v2/activity/inline", { page_id: d2.item_id }).then((t) => {
            const item2 = t.data.cards[0].item;
            decodeInline(d2.title, item2);
          }));
          return s;
        }, []));
        const source = JSON.parse(JSON.stringify(d.timeline || d.timingData));
        source.forEach((d2) => {
          const i = d2.day_of_week;
          Object.entries(inline[i]).forEach((t) => {
            if (d2.episodes) {
              d2.episodes.push(...t[1]);
            } else {
              d2.seasonMap[t[0]] || (d2.seasonMap[t[0]] = []);
              d2.seasonMap[t[0]].push(...t[1]);
            }
          });
        });
        d.timeline ? d.timeline = source : d.timingData = source;
      } catch (e) {
        debug.error("获取港澳台番剧时间线出错 ಥ_ಥ");
        toast.error("港澳台番剧时间线", e);
      }
    });
  };

  // src/content/live/sleep_check.ts
  function sleepCheck() {
    const fun = setInterval;
    let flag = 0;
    window.setInterval = (...args) => {
      if (args[1] && args[1] == 3e5 && args[0] && args[0].toString() == "function(){e.triggerSleepCallback()}") {
        if (!flag) {
          toast.warning("成功阻止直播间挂机检测！");
          flag++;
        }
        return Number.MIN_VALUE;
      }
      return fun.call(window, ...args);
    };
  }

  // src/content/live/live.ts
  function livePage() {
    setting.sleepCheck && sleepCheck();
    doWhile(() => document.querySelector(".web-player-icon-roomStatus"), (d) => d.remove());
  }

  // src/content/log_report.ts
  function blockReport() {
    Object.defineProperty(window, "reportObserver", {
      get: () => new Proxy(() => true, { get: (t, p, r) => r }),
      set: () => true,
      configurable: true
    });
    Object.defineProperty(window, "rec_rp", {
      get: () => new Proxy(() => true, { get: (t, p, r) => r }),
      set: () => true,
      configurable: true
    });
    Object.defineProperty(window, "reportMsgObj", {
      get: () => new Proxy(() => true, { get: (t, p, r) => r }),
      set: () => true,
      configurable: true
    });
  }

  // src/content/media.ts
  function mediaPage() {
    xhrhook("user/status", void 0, (res) => {
      try {
        const result = jsonCheck(res.response);
        result.result.area_limit = 0;
        result.result.ban_area_show = 0;
        res.responseType === "json" ? res.response = result : res.response = res.responseText = JSON.stringify(result);
      } catch (e) {
      }
    }, false);
  }

  // src/content/message/message.css
  var message_default = "/* 修复消息页样式 */\\r\\n.container[data-v-6969394c] {\\r\\n    height: calc(100vh - 42px) !important;\\r\\n}\\r\\n\\r\\n.container[data-v-1c9150a9] {\\r\\n    height: calc(100vh - 42px) !important;\\r\\n}\\r\\n\\r\\n.im-root,\\r\\n.im-root .im-list-box * {\\r\\n    font-size: 12px;\\r\\n    line-height: 42px;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box {\\r\\n    width: 100%;\\r\\n    overflow: visible;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-list {\\r\\n    line-height: 42px;\\r\\n    height: 42px;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-notify.im-number {\\r\\n    height: 14px;\\r\\n    line-height: 13px;\\r\\n    border-radius: 10px;\\r\\n    padding: 1px 3px;\\r\\n    font-size: 12px;\\r\\n    min-width: 20px;\\r\\n    text-align: center;\\r\\n    color: #fff;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-notify.im-number.im-center {\\r\\n    top: 14px;\\r\\n    left: 80px;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-notify.im-dot {\\r\\n    top: 11px;\\r\\n    right: -10px;\\r\\n    width: 8px;\\r\\n    height: 8px;\\r\\n    border-radius: 100%;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-notify.im-dot.im-center {\\r\\n    top: 16px;\\r\\n    right: 20px;\\r\\n}";

  // src/content/message/message.ts
  function messagePage() {
    addCss(message_default);
  }

  // src/content/player/bnj.css
  var bnj_default = ".player {\\r\\n    width: 100%;\\r\\n    height: 100%;\\r\\n    margin: 0px;\\r\\n    padding: 0px;\\r\\n}\\r\\n\\r\\n.player-box {\\r\\n    width: 100%;\\r\\n    height: 100%;\\r\\n    overflow: visible;\\r\\n    box-sizing: border-box;\\r\\n}\\r\\n\\r\\nobject {\\r\\n    width: 100%;\\r\\n    height: 100%;\\r\\n}\\r\\n\\r\\n.bgray-btn-wrap {\\r\\n    display: none;\\r\\n}";

  // src/content/player/bnj.ts
  function bnj() {
    addCss(bnj_default);
    window.bnj = false;
    const arr2 = [];
    doWhile(() => window.__INITIAL_STATE__, () => {
      const node2 = document.querySelector("#bilibili-player").parentElement;
      const root3 = node2.attachShadow({ mode: "closed" });
      const iframe = document.createElement("iframe");
      iframe.src = \`https://www.bilibili.com/blackboard/html5player.html?aid=\${window.__INITIAL_STATE__.videoInfo.aid}&cid=\${window.__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1&bnj=1\`;
      iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
      root3.appendChild(iframe);
    });
    Object.defineProperty(window, "EmbedPlayer", {
      configurable: true,
      set: (v) => {
        if (!window.bnj) {
          arr2.unshift(v);
        }
      },
      get: () => {
        if (window.bnj) {
          Object.defineProperty(window, "EmbedPlayer", { configurable: true, value: arr2[0] });
          return arr2[0];
        } else {
          return function() {
            setTimeout(() => window.EmbedPlayer(...arguments), 100);
          };
        }
      }
    });
  }

  // src/content/avatar_animation.css
  var avatar_animation_default = "/* 鼠标放在顶栏上的动效 */\\r\\n.bili-header-m .profile-info .i-face .face {\\r\\n    border: 0\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info .i-face .pendant {\\r\\n    transform: scale(0.5);\\r\\n    width: 112px;\\r\\n    height: 112px;\\r\\n    left: -41px;\\r\\n    bottom: -46px;\\r\\n    opacity: 0;\\r\\n    transition: opacity .1s ease-in\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face {\\r\\n    left: 8px !important;\\r\\n    top: 0 !important;\\r\\n    height: 32px !important;\\r\\n    width: 32px !important;\\r\\n    transform: translateY(10px) translateX(-16px) scale(2);\\r\\n    transform-origin: top left\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face .legalize {\\r\\n    transform: scale(0.5) translate(10px, 15px)\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face .pendant {\\r\\n    opacity: 1\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face .face {\\r\\n    border: 0;\\r\\n    box-shadow: 0 0 0 2px #fff\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face.scale-in {\\r\\n    transform: translateY(5px) translateX(-10px) scale(1.75)\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .scale-in .face {\\r\\n    height: 32px;\\r\\n    width: 32px\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face.scale-in .legalize {\\r\\n    transform: scale(0.5) translate(38px, 48px)\\r\\n}";

  // src/content/section.ts
  async function header(menu = false) {
    if (menu) {
      primaryMenu();
      banner();
    }
    if (window.loginInfoCallbacks && window.onLoginInfoLoaded) {
      let fun = window.onLoginInfoLoaded;
      Object.defineProperty(window, "onLoginInfoLoaded", {
        configurable: true,
        get: () => fun,
        set: (t) => {
          fun = t;
          window.loginInfoCallbacks.forEach((d) => {
            fun(...d);
          });
        }
      });
    }
    if (!window.jQuery)
      await loadScript("//static.hdslb.com/js/jquery.min.js");
    loadScript("//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
  }
  async function footer() {
    if (!window.jQuery)
      await loadScript("//static.hdslb.com/js/jquery.min.js");
    loadScript("//static.hdslb.com/common/js/footer.js");
  }
  function styleClear() {
    const d = document.styleSheets;
    for (let i = 0; i < d.length; i++) {
      (d[i].href?.includes("laputa-footer") || d[i].href?.includes("laputa-header")) && (d[i].disabled = true);
    }
  }
  function replaceHeader(t) {
    let menu = false;
    if (document.querySelector(".mini-type") || /festival/.test(location.href)) {
      menu = false;
    }
    if (location.href.includes("blackboard/topic_list") || location.href.includes("blackboard/x/act_list") || document.querySelector(".large-header") || document.querySelector(".bili-banner") || t.getAttribute("type") == "all") {
      menu = true;
    }
    if (t.parentElement?.id === "app") {
      addElement("div", { class: \`z-top-container\${menu ? " has-menu" : ""}\` }, void 0, void 0, true);
      t.setAttribute("hidden", "hidden");
    } else {
      t.setAttribute("class", \`z-top-container\${menu ? " has-menu" : ""}\`);
      t.removeAttribute("id");
    }
    header(menu);
    styleClear();
  }
  function section() {
    addCss(".nav-item.live {width: auto;}.lt-row {display: none !important;}");
    doWhile(() => document.querySelector("#internationalHeader"), replaceHeader);
    doWhile(() => document.querySelector("#biliMainHeader"), replaceHeader);
    doWhile(() => document.querySelector(".z_top_container"), (t) => {
      t.setAttribute("class", "z-top-container has-menu");
      document.querySelector(".header")?.remove();
      header(true);
    });
    doWhile(() => document.querySelector(".international-footer") || document.querySelector("#biliMainFooter"), (t) => {
      t.replaceChildren();
      t.setAttribute("class", "footer bili-footer report-wrap-module");
      t.setAttribute("id", "home_footer");
      footer();
      styleClear();
    });
    doWhile(() => document.querySelector("#bili-header-m"), () => {
      addCss(avatar_animation_default, "avatarAnimation");
    });
    doWhile(() => document.body && document.body.classList.contains("header-v3") || document.querySelector("#bili-header-container"), () => {
      document.body.classList.remove("header-v3");
      header(true);
    });
  }

  // src/content/space/album.ts
  function album() {
    xhrhook("api.bilibili.com/x/dynamic/feed/draw/doc_list", void 0, (obj) => {
      const response = JSON.parse(obj.responseText);
      let data = response.data.items.reduce((s, d) => {
        s.push(d.doc_id);
        return s;
      }, []);
      setTimeout(() => {
        document.querySelectorAll(".album-card").forEach((d, i) => {
          d.firstChild.href = \`//h.bilibili.com/\${data[i]}\`;
          d.children[1].href = \`//h.bilibili.com/\${data[i]}\`;
        });
      }, 1e3);
    }, false);
    xhrhook("api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail", void 0, (res) => {
      const result = res.responseType === "json" ? res.response : JSON.parse(res.response);
      if (result.code === 0) {
        if (result.data?.card?.desc?.type === 2)
          location.replace(\`https://h.bilibili.com/\${result.data.card.desc.rid_str}\`);
      }
    }, false);
  }

  // src/content/space/jointime.ts
  function jointime(mid) {
    doWhile(() => document.querySelector(".section.user-info"), (t) => {
      (isUserScript ? GM.xhr({ url: \`https://account.bilibili.com/api/member/getCardByMid?mid=\${mid}\` }) : GM.xmlHttpRequest(\`https://account.bilibili.com/api/member/getCardByMid?mid=\${mid}\`)).then((d) => {
        const data = jsonCheck(d);
        const jointime2 = timeFormat(data.card.regtime * 1e3, true);
        const node2 = t.lastChild;
        node2.appendChild(createElement({
          tagName: "div",
          props: { class: "info-regtime", style: "display: inline-block;word-break: break-all;" },
          children: [
            {
              tagName: "span",
              props: { class: "info-command", style: "display: inline-block;font-size: 12px;font-family: Microsoft YaHei;line-height: 16px;color: #9499a0;margin-right: 16px;" },
              children: [
                {
                  tagName: "text",
                  text: "注册"
                }
              ]
            },
            {
              tagName: "span",
              props: { class: "info-value", style: "color: #6d757a;font-family: Microsoft YaHei;font-size: 12px;line-height: 16px;padding-right: 15px;" },
              children: [
                {
                  tagName: "text",
                  text: jointime2
                }
              ]
            }
          ]
        }));
      });
    });
  }

  // src/content/space/lost_video.ts
  async function getLostVideo(aid) {
    let result = [];
    try {
      let data = await (isUserScript ? GM.xhr({ url: \`https://www.biliplus.com/video/av\${aid}\` }) : GM.xmlHttpRequest(\`https://www.biliplus.com/video/av\${aid}\`));
      if (data.match(/\\<title\\>.+?\\ \\-\\ AV/)) {
        result[0] = data.match(/\\<title\\>.+?\\ \\-\\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
        result[1] = data.match(/\\<img style=\\"display:none\\"\\ src=\\".+?\\"\\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
      }
    } catch (e) {
      debug.error("lostVideo.js", e);
    }
    if (!result[0] || !result[1]) {
      try {
        let data = await (isUserScript ? GM.xhr({ url: \`https://www.biliplus.com/all/video/av\${aid}\` }) : GM.xmlHttpRequest(\`https://www.biliplus.com/all/video/av\${aid}/\`));
        if (data.match("/api/view_all?")) {
          data = data.match(/\\/api\\/view_all\\?.+?\\',cloudmoe/)[0].replace(/\\',cloudmoe/, "");
          data = await (isUserScript ? GM.xhr({ url: \`//www.biliplus.com\${aid}\` }) : GM.xmlHttpRequest(\`//www.biliplus.com\${data}\`));
          data = jsonCheck(data).data;
          result[0] = result[0] || data.info.title;
          result[1] = result[1] || data.info.pic;
        }
      } catch (e) {
        debug.error("lostVideo.js", e);
      }
    }
    if (!result[0] || !result[1]) {
      try {
        let data = await (isUserScript ? GM.xhr({ url: \`https://www.jijidown.com/video/\${aid}\` }) : GM.xmlHttpRequest(\`https://www.jijidown.com/video/\${aid}\`));
        if (data.match("window._INIT")) {
          result[0] = result[0] || data.match(/\\<title\\>.+?\\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
          result[1] = result[1] || data.match(/\\"img\\":\\ \\".+?\\",/)[0].match(/http.+?\\",/)[0].replace(/",/, "");
        }
      } catch (e) {
        debug.error("lostVideo.js", e);
      }
    }
    result[0] = result[0] || \`av\${aid}\`;
    result[1] = result[1] ? result[1].replace("http:", "") : "//i0.hdslb.com/bfs/archive/be27fd62c99036dce67efface486fb0a88ffed06.jpg";
    return result;
  }
  function lostVideo() {
    observerAddedNodes((node2) => {
      if (/section channel guest/.test(node2.className)) {
        let items = node2.querySelectorAll(".small-item.disabled");
        items.forEach((d) => {
          let aid = d.getAttribute("data-aid");
          aid = Number(aid) || abv(aid);
          d.setAttribute("class", "small-item fakeDanmu-item");
          d.setAttribute("data-aid", aid);
          d.children[0].href = \`//www.bilibili.com/video/av\${aid}\`;
          d.children[1].href = \`//www.bilibili.com/video/av\${aid}\`;
          d.children[0].setAttribute("target", "_blank");
          d.children[1].setAttribute("target", "_blank");
          d.children[0].setAttribute("class", "cover cover-normal");
          d.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
          getLostVideo(aid).then((data) => {
            d.children[1].setAttribute("title", data[0]);
            d.children[1].text = data[0];
            d.children[0].children[0].alt = data[0];
            d.children[0].children[0].src = data[1];
          });
        });
      }
      if (/small-item disabled/.test(node2.className)) {
        let aid = node2.getAttribute("data-aid");
        aid = Number(aid) || abv(aid);
        node2.setAttribute("class", "small-item fakeDanmu-item");
        node2.setAttribute("data-aid", aid);
        node2.children[0].href = \`//www.bilibili.com/video/av\${aid}\`;
        node2.children[1].href = \`//www.bilibili.com/video/av\${aid}\`;
        node2.children[0].setAttribute("target", "_blank");
        node2.children[1].setAttribute("target", "_blank");
        node2.children[0].setAttribute("class", "cover cover-normal");
        node2.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
        getLostVideo(aid).then((data) => {
          node2.children[1].setAttribute("title", data[0]);
          node2.children[1].text = data[0];
          node2.children[0].children[0].alt = data[0];
          node2.children[0].children[0].src = data[1];
        });
      }
    });
  }

  // src/content/space/mid.json
  var mid_default = {
    code: 0,
    data: {
      birthday: "1980-01-01",
      coins: 0,
      face: "http://i2.hdslb.com/bfs/face/9f10323503739e676857f06f5e4f5eb323e9f3f2.jpg",
      fans_badge: false,
      is_followed: true,
      jointime: 1436351229,
      level: 6,
      mid: 11783021,
      moral: 0,
      name: "哔哩哔哩番剧出差",
      official: {
        type: 1,
        desc: "哔哩哔哩番剧出差 官方账号"
      },
      pendant: {
        pid: 0,
        name: "",
        image: "",
        expire: 0
      },
      rank: "10000",
      sex: "保密",
      sign: "",
      silence: 0,
      sys_notice: {},
      theme: {},
      user_honour_info: {
        colour: null,
        mid: 0,
        tags: null
      },
      vip: {
        avatar_subscript: 1,
        avatar_subscript_url: "http://i0.hdslb.com/bfs/vip/icon_Certification_big_member_22_3x.png",
        due_date: 16557408e5,
        label: {
          bg_color: "#FB7299",
          bg_style: 1,
          border_color: "",
          label_theme: "annual_vip",
          path: "",
          text: "年度大会员",
          text_color: "#FFFFFF"
        },
        nickname_color: "#FB7299",
        role: 3,
        status: 1,
        theme_type: 0,
        type: 2,
        vip_pay_type: 1
      }
    },
    message: "0",
    ttl: 1
  };

  // src/content/space/midInfo.ts
  function midInfo(mid) {
    mid_default.data.mid = mid;
    switch (Number(mid)) {
      case 11783021:
        mid_default.data.name = "哔哩哔哩番剧出差";
        mid_default.data.official.desc = "哔哩哔哩番剧出差 官方帐号";
        break;
      case 1988098633:
        mid_default.data.name = "b站_戲劇咖";
        mid_default.data.official.desc = "b站_戲劇咖 官方帐号";
        break;
      case 2042149112:
        mid_default.data.name = "b站_綜藝咖";
        mid_default.data.official.desc = "b站_綜藝咖 官方帐号";
        break;
    }
    xhrhook("api.bilibili.com/x/space/acc/info", void 0, (obj) => {
      if (obj.responseText && obj.responseText.includes("-404")) {
        obj.response = obj.responseText = JSON.stringify(mid_default);
        toast.warning("该用户被404，已使用缓存数据恢复访问！");
      }
    }, false);
  }

  // src/content/space/space.ts
  function spacePage() {
    const path2 = location.href.split("/");
    const mid = Number(path2[3] && path2[3].split("?")[0]);
    (mid == 11783021 || mid == 1988098633 || mid == 2042149112) && midInfo(mid);
    setting.album && album();
    setting.jointime && jointime(mid);
    setting.lostVideo && lostVideo();
  }

  // src/content/web_rtc.ts
  function disableWebRTC() {
    if (typeof navigator.getUserMedia !== "undefined")
      navigator.getUserMedia = void 0;
    if (typeof window.MediaStreamTrack !== "undefined")
      window.MediaStreamTrack = void 0;
    if (typeof window.RTCPeerConnection !== "undefined")
      window.RTCPeerConnection = void 0;
    if (typeof window.RTCSessionDescription !== "undefined")
      window.RTCSessionDescription = void 0;
    if (typeof navigator.mozGetUserMedia !== "undefined")
      navigator.mozGetUserMedia = void 0;
    if (typeof window.mozMediaStreamTrack !== "undefined")
      window.mozMediaStreamTrack = void 0;
    if (typeof window.mozRTCPeerConnection !== "undefined")
      window.mozRTCPeerConnection = void 0;
    if (typeof window.mozRTCSessionDescription !== "undefined")
      window.mozRTCSessionDescription = void 0;
    if (typeof navigator.webkitGetUserMedia !== "undefined")
      navigator.webkitGetUserMedia = void 0;
    if (typeof window.webkitMediaStreamTrack !== "undefined")
      window.webkitMediaStreamTrack = void 0;
    if (typeof window.webkitRTCPeerConnection !== "undefined")
      window.webkitRTCPeerConnection = void 0;
    if (typeof window.webkitRTCSessionDescription !== "undefined")
      window.webkitRTCSessionDescription = void 0;
  }

  // src/content/global.ts
  function globalVector() {
    if (window.BILIOLD_GOLBAL)
      return;
    window.BILIOLD_GOLBAL = true;
    setting.section && section();
    setting.comment && loadComment();
    setting.logReport && blockReport();
    setting.player && /\\/festival\\//.test(location.href) && bnj();
    path[2] == "message.bilibili.com" && messagePage();
    setting.liveP2p && disableWebRTC();
    /live\\.bilibili\\.com/.test(location.href) && livePage();
    /space\\.bilibili\\.com/.test(location.href) && spacePage();
    path[2] == "t.bilibili.com" && setting.liveRecord && dynamicPage();
    location.href.includes("www.bilibili.com/account/history") && historyPage();
    /bangumi\\/media\\/md/.test(location.href) && mediaPage();
    setting.timeline && /anime\\/timeline/.test(location.href) && timeline();
    setting.album && /t.bilibili.com\\/\\d+/.test(location.href) && album();
    window.addEventListener("message", (ev) => {
      if (isUserScript)
        return;
      if (typeof ev.data === "object") {
        switch (ev.data.\$type) {
          case "getPageInfo":
            window.postMessage({
              \$type: "pageInfoResponse",
              data: {
                aid: API.aid,
                cid: API.cid,
                pgc: API.pgc,
                cover: API.cover,
                title: API.title,
                playerParam: API.playerParam
              }
            });
            break;
          default:
        }
      }
    });
  }

  // src/runtime/url_clean.ts
  var paramsSet = /* @__PURE__ */ new Set([
    "spm_id_from",
    "from_source",
    "msource",
    "bsource",
    "seid",
    "source",
    "session_id",
    "visit_id",
    "sourceFrom",
    "from_spmid",
    "share_source",
    "share_medium",
    "share_plat",
    "share_session_id",
    "share_tag",
    "unique_k",
    "vd_source",
    "csource"
  ]);
  var paramArr = Object.entries({
    from: ["search"]
  });
  function replaceUrl(url) {
    window.history.replaceState(window.history.state, "", url);
  }
  function urlClean(str) {
    const base = str.split("#")[0].split("?")[0];
    const url = new URLEs(str);
    if (url) {
      const params = url.searchParams;
      if (params.has("bvid")) {
        params.set("aid", abv(params.get("bvid")));
        params.delete("bvid");
      }
      if (params.has("aid") && !Number(params.get("aid"))) {
        params.set("aid", abv(params.get("aid")));
      }
      paramsSet.forEach((d) => {
        params.delete(d);
      });
      paramArr.forEach((d) => {
        if (params.has(d[0])) {
          if (d[1].includes(params.get(d[0]))) {
            params.delete(d[0]);
          }
        }
      });
      return (base + url.search + url.hash).replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (s) => "av" + abv(s));
    } else
      return str;
  }
  function anchorClean(list) {
    list.forEach((d) => {
      if (!d.href)
        return;
      d.href = urlClean(d.href);
    });
  }
  function AnchorClick(e) {
    var f = e.target;
    for (; f && "A" !== f.tagName; ) {
      f = f.parentNode;
    }
    if ("A" !== (null == f ? void 0 : f.tagName)) {
      return;
    }
    anchorClean([f]);
  }
  window.navigation?.addEventListener("navigate", (e) => {
    const newURL = urlClean(e.destination.url);
    if (e.destination.url != newURL) {
      e.preventDefault();
      if (newURL == window.location.href)
        return;
      window.history.replaceState(window.history.state, "", newURL);
    }
  });
  window.addEventListener("click", AnchorClick, false);
  window.addEventListener("contextmenu", AnchorClick, false);
  document.addEventListener("DOMContentLoaded", () => anchorClean(document.querySelectorAll("a")));

  // src/content/av/keep_new.ts
  function keepNewCheck() {
    const keepNew = sessionStorage.getItem("keepNew");
    const redirect = sessionStorage.getItem("redirect");
    if (keepNew) {
      toast.warning(keepNew);
      sessionStorage.removeItem("keepNew");
      globalVector();
      throw new Error("禁用旧版页面重构！");
    }
    if (redirect) {
      replaceUrl(redirect);
      sessionStorage.removeItem("redirect");
    }
    API.rewrite = true;
  }

  // src/content/bangumi/code.ts
  function bangumiPage() {
    keepNewCheck();
    const title = document.title;
    document.documentElement.replaceWith(createElements(htmlVnode(bangumi_default)));
    title && !title.includes("404") && (document.title = title);
    API.pgc = true;
    location.href.replace(/[sS][sS]\\d+/, (d) => API.ssid = Number(d.substring(2)));
    location.href.replace(/[eE][pP]\\d+/, (d) => API.epid = Number(d.substring(2)));
    loadVideoScript();
    loadComment();
    xhrhook("api.bilibili.com/pgc/web/recommend/related/recommend", (args) => {
      args[1] = args[1].replace("web/recommend", "season/web");
    }, (r) => {
      try {
        const result = jsonCheck(r.response);
        result.result = result.data.season;
        r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
      } catch (e) {
      }
    });
    xhrhook("bangumi.bilibili.com/ext/web_api/season_count", (args) => {
      args[1] = args[1].replace("bangumi.bilibili.com/ext/web_api/season_count", "api.bilibili.com/pgc/web/season/stat");
    }, (r) => {
      try {
        const result = jsonCheck(r.response);
        result.result.favorites = result.result.follow;
        r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
      } catch (e) {
      }
    }, true);
    setting.videoLimit.switch && xhrhook("bangumi.bilibili.com/view/web_api/season/user/status", void 0, (res) => {
      try {
        const data = res.responseType === "json" ? res.response : JSON.parse(res.response);
        data.result.area_limit = 0;
        data.result.ban_area_show = 0;
        res.responseType === "json" || (res.response = res.responseText = JSON.stringify(data));
      } catch (e) {
      }
    }, false);
    const related = {};
    xhrhookAsync("x/web-interface/archive/related", () => window.__INITIAL_STATE__.mediaInfo.title, async (u, t) => {
      let result = '{ code: 0, data: [], message: "0" }';
      if (related[window.__INITIAL_STATE__.mediaInfo.title]) {
        result = related[window.__INITIAL_STATE__.mediaInfo.title];
      } else {
        try {
          const info = await xhr({
            url: \`https://api.bilibili.com/x/tag/info?tag_name=\${window.__INITIAL_STATE__.mediaInfo.title}\`,
            responseType: "json"
          }, true);
          related[window.__INITIAL_STATE__.mediaInfo.title] = result = await xhr({
            url: \`https://api.bilibili.com/x/web-interface/tag/top?tid=\${info.data.tag_id}\`
          }, true);
        } catch (e) {
          debug.error("相关视频推荐", e);
        }
      }
      return t === "json" ? { response: JSON.parse(result) } : { response: result, responseText: result };
    }, false);
    bangumiInitialState().then(() => {
      setting.enlike && new enLike("bangumi", window.__INITIAL_STATE__.mediaInfo.stat.likes);
      if (window.__INITIAL_STATE__.special) {
        addCss("#bili-header-m > #banner_link,#bili-header-m > .bili-wrapper{ display: none; }");
      }
    });
    appendScripts(script_default2);
    primaryMenu();
    banner();
    loadByDmId();
    episodeData();
    globalVector();
  }

  // src/content/av/av_lost_check.ts
  var Detail = class {
    code = 0;
    data = {
      Card: { archive_count: -1, article_count: -1, card: {}, follower: -1, following: false, like_num: -1, space: {} },
      Related: [],
      Reply: { page: {}, replies: [] },
      Spec: null,
      Tags: [],
      View: {},
      elec: null,
      hot_share: {},
      recommend: null,
      view_addit: {}
    };
    message = "0";
    ttl = 1;
  };
  function view2Detail(data) {
    const result = new Detail();
    if (data.v2_app_api) {
      delete data.v2_app_api.redirect_url;
      result.data.Card.follower = data.v2_app_api.owner_ext?.fans;
      result.data.Card.card = { ...data.v2_app_api.owner, ...data.v2_app_api.owner_ext };
      result.data.Tags = data.v2_app_api.tag;
      result.data.View = data.v2_app_api;
      xhrhook(\`api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`, void 0, (res) => {
        const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify(result.data.View)}}\`;
        res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
      }, false);
      xhrhook(\`api.bilibili.com/x/web-interface/archive/stat?aid=\${API.aid}\`, void 0, (res) => {
        const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify({ ...result.data.View.stat, aid: API.aid })}}\`;
        res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
      }, false);
      return JSON.parse(JSON.stringify(result));
    } else
      return v1api(data);
  }
  function v1api(data) {
    const result = new Detail();
    const p = Number(getUrlValue("p"));
    result.data.Card.card = {
      face: "//static.hdslb.com/images/akari.jpg",
      mid: data.mid,
      name: data.author,
      vip: {}
    };
    result.data.View = {
      aid: data.aid || data.id || API.aid,
      cid: data.list[p ? p - 1 : 0].cid,
      copyright: 1,
      ctime: data.created,
      dimension: { width: 1920, height: 1080, rotate: 0 },
      duration: -1,
      owner: result.data.Card.card,
      pages: data.list,
      pic: data.pic,
      pubdate: data.lastupdatets,
      rights: {},
      stat: {
        aid: data.aid || data.id || API.aid,
        coin: data.coins,
        danmaku: data.video_review,
        dislike: 0,
        evaluation: "",
        favorite: data.favorites,
        his_rank: 0,
        like: -1,
        now_rank: 0,
        reply: -1,
        share: -1,
        view: data.play
      },
      state: 0,
      subtitle: { allow_submit: false, list: [] },
      tid: data.tid,
      title: data.title,
      tname: data.typename,
      videos: data.list.length
    };
    data.bangumi && (result.data.View.season = data.bangumi);
    xhrhook(\`api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`, void 0, (res) => {
      const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify(result.data.View)}}\`;
      res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
    }, false);
    xhrhook(\`api.bilibili.com/x/web-interface/archive/stat?aid=\${API.aid}\`, void 0, (res) => {
      const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify({ ...result.data.View.stat, aid: API.aid })}}\`;
      res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
    }, false);
    return JSON.parse(JSON.stringify(result));
  }
  async function check(call) {
    try {
      toast.info(\`正在进一步查询 av\${API.aid} 的信息~\`);
      const card = await xhr({
        url: \`https://api.bilibili.com/x/article/cards?ids=av\${API.aid}\`,
        responseType: "json"
      });
      if (card.data[\`av\${API.aid}\`]) {
        if (card.data[\`av\${API.aid}\`].redirect_url) {
          sessionStorage2.setItem("redirect", card.data[\`av\${API.aid}\`].redirect_url);
          call(new Detail());
          variableCleaner();
          if (isUserScript)
            return bangumiPage();
          return loadScriptEs("content/bangumi/bangumi.js");
        }
      }
      const data = await xhr({
        url: \`https://www.biliplus.com/api/view?id=\${API.aid}\`,
        responseType: "json"
      }, true);
      const res = view2Detail(data);
      if (res.data.View.season) {
        sessionStorage2.setItem("redirect", res.data.View.season.ogv_play_url);
        res.data.View.season = void 0;
        call(res);
        variableCleaner();
        if (isUserScript)
          return bangumiPage();
        return loadScriptEs("content/bangumi/bangumi.js");
      }
      call(res);
      setTimeout(() => {
        toast.custom(0, "warning", "这大概是一个无效av号~", "本页面使用缓存数据生成，并无法播放！", "部分上古视频还存在评论区哦~");
      }, 1e3);
    } catch (e) {
      debug.error(e);
    }
  }
  function avLostCheck() {
    jsonphook("api.bilibili.com/x/web-interface/view/detail", void 0, (res, r, call) => {
      if (0 !== res.code) {
        const obj = urlObj(r);
        if (obj.aid) {
          API.aid = obj.aid;
          check(call);
          return true;
        }
      } else {
        if (res.data && res.data.View) {
          if (res.data.View.stein_guide_cid) {
            sessionStorage2.setItem("keepNew", "旧版页面不支持互动视频！已重定向回新版页面🤣");
            location.reload();
          }
          Promise.resolve().then(() => {
            setting.upList && res.data.View.staff && upList(res.data.View.staff);
            setting.collection && res.data.View.is_season_display && res.data.View.ugc_season && collection(res.data.View);
          });
        }
      }
    }, false);
  }

  // src/content/av/code.ts
  function avPage() {
    keepNewCheck();
    location.href.includes("/s/video") && replaceUrl(location.href.replace("/s/video", "/video"));
    const title = document.title;
    document.documentElement.replaceWith(createElements(htmlVnode(av_default)));
    title && !title.includes("404") && (document.title = title);
    loadVideoScript();
    loadComment();
    webpackhook(717, 274, (code) => code.replace("init:function(){", "init:function(){window.biliUIcomponents=this;").replace("this.getAdData()", "this.getAdData"));
    webpackhook(717, 251, (code) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
    webpackhook(717, 660, (code) => code.replace('tag/"+t.info.tag_id+"/?pagetype=videopage', 'topic/"+t.info.tag_id+"/?pagetype=videopage'));
    webpackhook(717, 100, (code) => code.replace(/MenuConfig[\\S\\s]+?LiveMenuConfig/, \`MenuConfig=\${menu_config_default},e.LiveMenuConfig\`));
    webpackhook(717, 609, () => \`()=>{}\`);
    webpackhook(717, 2, (code) => code.replace("av\$1</a>')", \`av\$1</a>').replace(/(?!<a[^>]*>)cv([0-9]+)(?![^<]*<\\\\/a>)/ig, '<a href="//www.bilibili.com/read/cv\$1/" target="_blank" data-view="\$1">cv\$1</a>').replace(/(?!<a[^>]*>)(bv1)(\\\\w{9})(?![^<]*<\\\\/a>)/ig, '<a href="//www.bilibili.com/video/bv1\$2/" target="_blank">\$1\$2</a>')\`).replace("http://acg.tv/sm", "https://www.nicovideo.jp/watch/sm"));
    webpackhook(717, 286, (code) => code.replace('e("setVideoData",t)', \`e("setVideoData",t);\$("#bofqi").attr("id","__bofqi").html('<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>');new Function(t.embedPlayer)();\`));
    setting.automate.electric && jsonphookasync("api.bilibili.com/x/web-interface/elec/show", void 0, async () => {
      return { code: -404 };
    }, false);
    Object.defineProperty(window, "__INITIAL_STATE__", { configurable: true, value: void 0 });
    appendScripts(script_default);
    setting.enlike && new enLike();
    avLostCheck();
    primaryMenu();
    banner();
    loadByDmId();
    globalVector();
  }

  // src/content/index/ad_block.ts
  function adblock(prev) {
    return prev.filter((d) => !d.is_ad);
  }

  // src/content/index/index.html
  var index_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta charset="utf-8" />\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords"\\r\\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\\r\\n        title="哔哩哔哩" />\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css" />\\r\\n    <style type="text/css">\\r\\n        /* 隐藏失效节点 */\\r\\n        #fixed_app_download,\\r\\n        #app>div.report-wrap-module.elevator-module>div.ver {\\r\\n            display: none;\\r\\n        }\\r\\n\\r\\n        /* 禁用失效节点 */\\r\\n        .bili-tab.rank-tab,\\r\\n        .bili-dropdown.rank-dropdown {\\r\\n            pointer-events: none;\\r\\n        }\\r\\n\\r\\n        /* 资讯区图标 */\\r\\n        .icon.icon_t.icon-news {\\r\\n            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMzNhZmQ3OS04ZTViLWQ2NDItOTYxZi0yNDM2MGQyN2JhM2YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTFEMzQ4MEJBNUM1MTFFQ0FGQTk5NEVFMjgwODg3M0UiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTFEMzQ4MEFBNUM1MTFFQ0FGQTk5NEVFMjgwODg3M0UiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBiNzNlZjA5LTA1ZmEtNTM0MC1iMWY3LWE4MTljMjFhYmEzMiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjI2MDJjOTk2LTBiNzQtZDQ0MC1hMzcxLTIxN2NkM2ZlOTgzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsCIXZoAAAi+SURBVHja7Fh7TJvXFT+fwTa2MX5gXjZgg3kEJvICh6YELUujNKNb10ZpWFc17aapSxcpy1YlUjctUbt0L22VMm2NlkXLsqZJWdT0sWwlaZOmCwW1gfIMCSYYDOZhDH6ADdjGvvvOhc8YY8Bru61/9EhX97vnnnvv755z7znnfgwhBD7PxIPPOcWHNxiGWdSp0Wi2eX0+uSxJVuxyOaXIk8nkk1hj2+FwlHGyCoWiMbwfaXLCNRIEsAsFAufU9LSdLxL2jw4O21cCFGlRJpzBAUzTqnX2Qdtlti8/XFir04AqK58RieVgtxinPB6XyFBRRQf19nfDtH10Cr+Rj/XIuNvnnXQJuPFCqcznc0+YgyRoCQaD/ckq1d/HbLaLMQP0zPjmtCFN7Nq45csFzxz4IeTk6ilPJBGDLjMNJAmCmM0zMu4Ci2UEek09YBs0w+jENHR13aV9nS0fTHXe6hRpdbojPT13jy0HkDK44p72QmpKyncl8uQZEiOxY2j5JLT/0E9IfFx8EC0WDQ+WJRqUihNOVz++78nzZ14KafS/QWgJnF+eKCFypWI3Z+pIDS65xTweL7vSULLsxHE8Hj2rkRdq0Rzz/VzhLSOLIEsrtzIsCGXMbobH8DJzS8qjCuMygWAwpP7lKBhhpmAUWc46ZYZy7M+PGaAgMUkb3u7r7YWrV94Bv98PZL7d3NT0mZm6pGQdhLurFQF2dfaowt0C3anbDUODg9DR1hZq28ftnxlAbbaeWi0mgLV1danRHLZAKGQBtgPr+BbxUZM1587DG6+9Bk6nk7aNXV2078b196m2kdACttFRWr98+i+s3MeRniTf+uP90phMjOBUcskinkqlArVGAw0f1Id4uCCC1uXowOv1Qf2NOhAIBHDX2E03guAGzP1UDi3g9/lpvbGsFHL0uaF5sjQptD6Vti5rVYDD/b1aTnuRx3rt+nV0gZHhEdoetVpp7Z50g1AogPGxMdBkZdG612SiG0KQKKfLyQF1pgYK1hRCR3sHCPj80LzJiiQaYXDtVQFmZOeYlzsLKampdCEEGW56BF5RWQk7H6gCuVw+dxxYEPr8PJAmSeHjxibI0mZT+fLNm0EqlcL1a+99umxmzOmJKlxqWLhsOblzZmpraYU7nbfxJtI2mtzn9YImMxMy1GrKS2U3N2QZpGdwcnISfD7vkrndnqn1q2Yzx399lNrP7bCGeLl5emo6JLFEAl9/+KGF7288SM0pSUwEuUIx5zbWroXCoiLgs2bE71y9nsoioVbTM9JDm0NiN0PQcyRKxC2rAmx/Ypdff6IGPaiQu8cikZgWjtCMHOHCXypZHHWQJw7/ngeHNR6RSJqc8jJRjnx0E0t++iLN5UYtff+zhHTaQzM0MFRs88d0Bll1m+saO0KxcqWElgt/keyFWLy0L5IwFUOyDPQOxQQwL0/f8uGNSySWbJdzR5HshVi8tC+SME+E1VLs8HxQlZKyC3O0my13FuVuASyBIC3++TKL7SCbH9PyiVJC8s29TxPMP7lIEpkPxi9RqSD+OtavvPQ8FB0/DX0WKzVjUe1lGLm/FOKS9ayb8BE2ajAkTI+xPg7T/noOhqrKwK/eACn8IH0qZKepmtN+/ofJVW8xkulun51NWs/86W+XH12z5U0hBvPUty4A+f0JMmLez1j2PAYJXh89WbJpE1imJaAWutlavOwxQOKrsyGruR54hw5Pqxu3i7oOfh9uTCXTd4xtfPxfy20o6puELp4ovpoglVfI9v5CaPBPwQWlHWzt3dOHlEoRXoDkNDkok5SQmiRaERhH+B550GaFEkkCtHtm4HmvGhqMTeB4/1VjYpK02mG3t0SbZ5EGERSmPrOB2Xo2swZJaZXQVvxVeKf1FrQ+ooNS93HR2NlzYFLIiNXu8eFkMxNOAcbSCE8g4F5x4d/fySsW8N/4DbPjnBkc7nWgvP4q4FocuJhMLMsvLSDf/lGB3J9FknfeA/iasXS+jUGMTd5K4NK+FOAfe44Z7LopnHv7OsEx7hAqkuciCfsdmovlURlpkhy89WcFWa1+hkgVILS0Anm4wKerqBHAweonXd1N9yLQ3Fw9+pxjywJMksmewTRPf98jkC2eZHrYvIDPruv0Z8OfGzuhbE8pkOpfAsyOgKbQQGuINwC5+RGQzjvAFK8BYh0G3mM7WH76fH86ndv/8iWGbNDDW7e9MDNkhfUBEPBU2ZB7tgGCY/0FfQerC/q7m4yRABf5QVS1w3jzWt/hvdA/JaXgkGZScqCm9haAZhN0GPLh/vRiYDUYWpwxbAJIl8Hsm/+gIClx4Nj6e9u2B4/WnATeE3vhSkc3O5+Bzu1nlc0qYi6iDHd78Syu6Adp5qHJUPLj+V2p9z1O9C80BAsvuMiGdwkRP11L37F6vTaIfhJL+dbt5OBT3yL1b9cQ4h+ec2xsffujK5R39IXfEk4WC8qqD5wkca+4yKYmQgu2sQ/9bzQ/uARgWBb9KxyIE+y+PUF4R7qoQ0XHah60UnAcSORvrdpNN4BtVdE9RLn7Z7Qgf3jMSUFzfARWdtlMx+PYlR7uUQHiTyPUIg7efMJEJ0QNNgy4QxGgd8JPeRzhwqh13BD+aUDZHadM7sjIgWOY94gX50QLIWhUxnIajI92tfGPFv7g8bknoO1Zg1aUkS9k2DNy3LNHOPDQ16CYTbFOmueGbjn2Lq2dxXtg16MZ8M/f1bNuyQi1bR6oa3ZKjmaOwE4yAC5RHpjaP4REYwNk1Mv4cco0UJSpGUfzAzDx+nOHAsHAGXaaiys66mjZCqo/MOXfyG6nnHu/snnKVwRPXWKqDtwLF88PUzkEp01LBLPVTUHixcoR2on5SCVwfhJ9IveHayGxCFqSlcrzozbbqZh/v60YS1nAbpf3zj6TTZgvWBjb7Vs6FvuvnfwjvH74B0aZQv5sIBAwrfaP8FMDjIuLu6ooMGz7TxNT1hkb/bP+wtXkVgT4xT/qLwD+H+jfAgwAa4KbOGyf2aUAAAAASUVORK5CYII=);\\r\\n            background-position: unset;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div id="home-app"></div>\\r\\n    <div id="app" data-server-rendered="true"></div>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/content/index/news.html
  var news_default = '<div class="r-con">\\r\\n    <div class="r-con">\\r\\n        <header style="margin-bottom: 14px">\\r\\n            <h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3>\\r\\n        </header>\\r\\n        <div class="carousel-module">\\r\\n            <div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img\\r\\n                        src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp"\\r\\n                        width="260" height="280" /></a></div>\\r\\n        </div>\\r\\n    </div>\\r\\n</div>';

  // src/content/index/initial_state.ts
  var __INITIAL_STATE__ = {
    locsData: {
      23: null,
      29: null,
      31: null,
      34: null,
      40: null,
      42: null,
      44: null,
      142: null
    },
    recommendData: null
  };

  // src/content/index/recommend_data.ts
  async function recommendData(privateRecommend = false) {
    const d = await fetch("https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3", {
      credentials: privateRecommend ? "include" : "omit"
    }).then((d2) => d2.json());
    d.data.item.forEach((d_1, i, s) => {
      s[i].author = d_1.owner.name;
      s[i].play = d_1.stat.view;
      s[i].aid = d_1.id;
    });
    return d.data.item;
  }

  // src/content/index/code.ts
  function indexPage() {
    keepNewCheck();
    document.documentElement.replaceWith(createElements(htmlVnode(index_default)));
    window.__INITIAL_STATE__ = __INITIAL_STATE__;
    appendScripts(\`
<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>
<script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js"><\\/script>
<script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"><\\/script>
<script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"><\\/script>
<script src="//static.hdslb.com/common/js/footer.js"><\\/script>
\`);
    fetch("https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,29,31,34,40,42,44").then((d) => d.text()).then((d) => {
      d = JSON.parse(d.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (s) => "av" + abv(s)));
      __INITIAL_STATE__.locsData[23] = adblock(d.data[4694]);
      __INITIAL_STATE__.locsData[29] = adblock(d.data[29]);
      __INITIAL_STATE__.locsData[31] = adblock(d.data[31]);
      __INITIAL_STATE__.locsData[34] = adblock(d.data[34]);
      __INITIAL_STATE__.locsData[40] = adblock(d.data[40]);
      __INITIAL_STATE__.locsData[42] = adblock(d.data[42]);
      __INITIAL_STATE__.locsData[44] = adblock(d.data[44]);
    }).catch((reason) => {
      debug.error("获取推荐数据失败 ಥ_ಥ", reason);
      toast.error("获取推荐数据失败 ಥ_ಥ");
    });
    recommendData(setting.privateRecommend).then((d) => {
      if (uid && setting.privateRecommend) {
        __INITIAL_STATE__.recommendData = d;
        doWhile(() => document.querySelector(".rec-btn.prev"), () => {
          addElement(
            "span",
            { class: "rec-btn prev" },
            void 0,
            "刷新",
            void 0,
            document.querySelector(".rec-btn.prev")
          ).addEventListener("click", () => {
            recommendData(setting.privateRecommend).then((d2) => __INITIAL_STATE__.recommendData = d2);
          });
          addElement(
            "span",
            { class: "rec-btn next" },
            void 0,
            "刷新",
            void 0,
            document.querySelector(".rec-btn.next")
          ).addEventListener("click", () => {
            recommendData(setting.privateRecommend).then((d2) => __INITIAL_STATE__.recommendData = d2);
          });
        });
      } else {
        const one = d.splice(0, 10);
        const two = d.splice(0, 10);
        __INITIAL_STATE__.recommendData = [...one];
        jsonphookasync("api.bilibili.com/x/web-interface/ranking/index", void 0, async (str) => {
          const obj = urlObj(str);
          if (obj) {
            if (obj.day == "7") {
              return { code: 0, data: two, message: "0", ttl: 1 };
            } else if (obj.day == "1") {
              return { code: 0, data: d, message: "0", ttl: 1 };
            }
            return { code: 0, data: one, message: "0", ttl: 1 };
          }
        }, false);
      }
    }).catch((reason) => {
      toast.error("获取推荐数据失败 ಥ_ಥ");
      debug.error("获取推荐数据失败 ಥ_ಥ", reason);
    });
    doWhile(() => document.querySelector("#ranking_ad"), () => {
      const vue = document.querySelector("#app > div.report-wrap-module.elevator-module").__vue__;
      const ranking_ad = document.querySelector("#ranking_ad").__vue__;
      const ranking_technology = document.querySelector("#ranking_technology").__vue__;
      const ranking_digital = document.querySelector("#ranking_digital").__vue__;
      vue.config[13].morelink = "/v/information/";
      vue.config[13].name = "资讯";
      vue.config[13].tid = 202;
      vue.config[13].type = "news";
      vue.config[8].morelink = "/v/knowledge/";
      vue.config[8].name = "知识";
      vue.config[9].morelink = "/v/tech/";
      vue.config[9].name = "科技";
      ranking_ad.config.morelink = "/v/information/";
      ranking_ad.config.name = "资讯";
      ranking_ad.config.tid = 202;
      ranking_ad.config.type = "news";
      ranking_technology.config.morelink = "/v/knowledge/";
      ranking_technology.config.name = "知识";
      ranking_digital.config.morelink = "/v/tech/";
      ranking_digital.config.name = "科技";
      doWhile(() => document.querySelector("#ranking_news"), () => {
        document.querySelector("#ranking_news").replaceChildren(createElements(htmlVnode(news_default)));
      });
    });
    xhrhook("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec", (args) => {
      args[1] = args[1].includes("List") ? args[1].replace("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList", "api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web") : args[1].replace("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore", "api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web");
    }, (obj) => {
      let response = obj.responseText?.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
      if (response) {
        response = JSON.parse(response);
        response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
        if (response.data.recommend) {
          for (let i = 0; i < response.data.recommend.length; i++) {
            response.data.recommend[i].pic = response.data.recommend[i].cover;
            response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
          }
        }
        if (response.data.preview)
          for (let i = 0; i < response.data.preview.length; i++)
            response.data.preview[i].url = response.data.preview[i].link;
        obj.response = obj.responseText = JSON.stringify(response);
      }
    }, false);
    jsonphook(["newlist", "rid=202"], (url) => url.replace("rid=202", "rid=203"), void 0, false);
    jsonphook("api.bilibili.com/x/web-interface/ranking/region", (url) => {
      const obj = new URL(url);
      let arr2 = void 0;
      switch (obj.searchParams.get("rid")) {
        case "23":
          arr2 = [document.querySelector("#ranking_movie"), 2, "/ranking/cinema/23/0/3"];
          break;
        case "11":
          arr2 = [document.querySelector("#ranking_teleplay"), 5, "/ranking/cinema/11/0/3"];
          break;
        case "177":
          arr2 = [document.querySelector("#ranking_documentary"), 3, "/ranking/cinema/177/0/3"];
          break;
      }
      if (arr2) {
        fetch(\`https://api.bilibili.com/pgc/season/rank/web/list?season_type=\${arr2[1]}&day=3\`).then((d) => d.json()).then((d) => {
          const data = jsonCheck(d).data;
          let html = \`<header class="rank-head"><h3>排行</h3><div class="bili-dropdown rank-dropdown"><span class="selected">三日</span><i class="icon icon-arrow-down"></i><ul class="dropdown-list"><li class="dropdown-item" style="display: none;">三日</li><li class="dropdown-item">一周</li></ul></div></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list">\`;
          for (let i = 0; i < 8; i++) {
            html += \`<li class="rank-item\${i < 3 ? " highlight" : ""}"><i class="ri-num">\${i + 1}</i><a href="\${data.list[i].url}" target="_blank" title="\${data.list[i].title} 播放:\${data.list[i].stat.view}" class="ri-info-wrap"><p class="ri-title">\${data.list[i].title}</p><span class="ri-total">\${data.list[i].new_ep.index_show}</span></a></li>\`;
          }
          html += \`</ul></div><a href="\${arr2[2]}" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>\`;
          const vnode = htmlVnode(html);
          vnode[1].children[0].children?.forEach((d2, i) => {
            let node2;
            d2.event = {
              "mouseover": (e) => {
                const target = e.target;
                const nodes = createElements(htmlVnode(\`<div class="bangumi-info-module" style="left: \${target.getBoundingClientRect().left}px; top: \${getTotalTop(target) - 150}px;"><div class="v-preview clearfix"><div class="lazy-img cover"><img alt="\${data.list[i].title}" src="\${data.list[i].cover.replace("http:", "")}" /></div><div><p class="title">\${data.list[i].title}</p><p class="desc">\${data.list[i].new_ep.index_show}</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>\${unitFormat(data.list[i].stat.view)}</span><span class="danmu"><i class="icon"></i>\${unitFormat(data.list[i].stat.danmaku)}</span><span class="fav"><i class="icon"></i>\${unitFormat(data.list[i].stat.follow)}</span></div></div>\`));
                node2 = nodes.children[0];
                document.body.appendChild(nodes);
              },
              "mouseout": () => node2.remove()
            };
          });
          arr2[0].replaceChildren(createElements(vnode));
        }).catch((e) => {
          debug.error(arr2[0], e);
        });
      }
      return url;
    }, void 0, false);
    xhrhook("api.bilibili.com/pgc/web/timeline?types=1", void 0, (res) => {
      setting.timeline && timeline();
    });
    primaryMenu();
    banner();
    globalVector();
  }

  // src/content/player/script.html
  var script_default3 = '<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/player/js/whitelist.js"><\\/script>';

  // src/content/player/player.html
  var player_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\\r\\n    <meta name="viewport"\\r\\n        content="target-densitydpi=device-dpi,width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,minimal-ui">\\r\\n    <title>player - bilibili.com</title>\\r\\n    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />\\r\\n    <style type="text/css">\\r\\n        html {\\r\\n            background-color: #fff;\\r\\n            font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;\\r\\n            overflow: hidden;\\r\\n        }\\r\\n\\r\\n        html,\\r\\n        body,\\r\\n        #bofqi,\\r\\n        .player {\\r\\n            width: 100%;\\r\\n            height: 100%;\\r\\n            margin: 0px;\\r\\n            padding: 0px;\\r\\n        }\\r\\n\\r\\n        #bofqi,\\r\\n        #bofqi .player-box {\\r\\n            width: 100%;\\r\\n            height: 100%;\\r\\n            overflow: visible;\\r\\n            box-sizing: border-box;\\r\\n        }\\r\\n\\r\\n        #bofqi object {\\r\\n            width: 100%;\\r\\n            height: 100%;\\r\\n        }\\r\\n\\r\\n        #dm_send_bar {\\r\\n            width: 100%;\\r\\n            height: 60px;\\r\\n            position: absolute;\\r\\n            bottom: -60px;\\r\\n            background-color: transparent;\\r\\n        }\\r\\n\\r\\n        #dm_send_input {\\r\\n            margin: 10px 0 10px 2%;\\r\\n            height: 40px;\\r\\n            line-height: 38px;\\r\\n            border: 1px solid #ddd;\\r\\n            border-radius: 5px;\\r\\n            font-size: 1rem;\\r\\n            font-family: "Microsoft YaHei";\\r\\n            padding: 0 8px;\\r\\n            width: 70%;\\r\\n            outline: 0;\\r\\n            box-sizing: border-box;\\r\\n            color: #333;\\r\\n        }\\r\\n\\r\\n        #dm_send_btn {\\r\\n            height: 40px;\\r\\n            line-height: 40px;\\r\\n            font-size: 1rem;\\r\\n            color: #fff;\\r\\n            background: #de698c;\\r\\n            border-radius: 6px;\\r\\n            margin: 10px 3% 10px 0;\\r\\n            width: 20%;\\r\\n            box-sizing: border-box;\\r\\n            outline: 0;\\r\\n            border: 0;\\r\\n            float: right;\\r\\n        }\\r\\n\\r\\n        #dm_send_btn:focus,\\r\\n        #dm_send_btn.disabled {\\r\\n            background-color: #b65673;\\r\\n        }\\r\\n\\r\\n        #player_placeholder {\\r\\n            display: none !important;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div id="bofqi"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/content/player/code.ts
  function palyerPage() {
    document.documentElement.replaceWith(createElements(htmlVnode(player_default)));
    loadVideoScript(void 0, true);
    document.domain = "bilibili.com";
    appendScripts(script_default3).then(() => {
      const playerParam = {
        aid: getUrlValue("aid") || getUrlValue("avid"),
        cid: getUrlValue("cid"),
        p: getUrlValue("P"),
        as_wide: getUrlValue("as_wide"),
        bnj: getUrlValue("bnj"),
        player_type: getUrlValue("player_type"),
        season_type: getUrlValue("season_type")
      };
      if (playerParam.bnj) {
        try {
          window.parent.EmbedPlayer = window.EmbedPlayer;
          window.parent.bnj = true;
        } catch (e) {
        }
      } else {
        urlParam(location.href).then((d) => {
          if (!d.cid)
            throw d;
          playerParam.aid = d.aid;
          playerParam.cid = d.cid;
          if (d.pgc || d.ssid || d.epid) {
            !playerParam.season_type && (playerParam.season_type = "1");
            Reflect.set(playerParam, "seasonId", d.ssid);
            Reflect.set(playerParam, "episodeId", d.epid);
            Reflect.set(playerParam, "urlparam", \`module%3Dbangumi%26season_type%3D\${playerParam.season_type}\`);
          }
          window.EmbedPlayer("player", "//static.hdslb.com/play.swf", objUrl("", playerParam));
        });
      }
      doWhile(() => window.player, () => {
        try {
          window.parent.player = window.player;
        } catch (e) {
        }
      });
    });
    globalVector();
  }

  // src/content/playlist/toview.json
  var toview_default = {
    attr: 2,
    count: 100,
    cover: "https://i0.hdslb.com/bfs/archive/a45ef4fcde397247032cf4ce0c8f71815f9e28d0.jpg",
    ctime: 1529021131,
    description: "bilibili moe 2018 动画角色人气大赏日本动画场应援视频播单 / 每天不定时更新最新的一批",
    faved_count: 0,
    favored: 0,
    favorite: false,
    id: 1826036,
    is_favorite: false,
    like_count: 0,
    list: [
      {
        aid: 24883898,
        attribute: 16768,
        cid: 41980488,
        copyright: 1,
        ctime: 1528969754,
        desc: "bilibili moe 2018 动画角色人气大赏日本动画场宣传PV / BGM : No.1 / Editor : @暗猫の祝福  \\n\\n活动地址 https://www.bilibili.com/moe/2018/jp/home\\n\\n了解活动最新动态请关注@哔哩哔哩萌战基",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 191,
        dynamic: "#日本场应援##角色应援##bilibilimoe2018#",
        owner: {
          face: "http://i2.hdslb.com/bfs/face/1e711421fdd158a0cadc1c4351ca19a75ea712ec.jpg",
          mid: 26366366,
          name: "哔哩哔哩活动"
        },
        pages: [
          {
            cid: 41980488,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 191,
            from: "vupload",
            page: 1,
            part: "bilibili moe 2018 动画角色人气大赏 - 日本动画场PV",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/6e7ce18cca1965da52090e96c03c095ee97f43a7.jpg",
        pubdate: 1529121652,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 24883898,
          coin: 30379,
          danmaku: 38599,
          dislike: 0,
          favorite: 29868,
          his_rank: 76,
          like: 18109,
          now_rank: 0,
          reply: 18082,
          share: 12878,
          view: 1072577
        },
        state: 0,
        tid: 24,
        title: "bilibili moe 2018 动画角色人气大赏日本动画场宣传PV",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28854498,
        attribute: 16768,
        cid: 50012938,
        copyright: 1,
        ctime: 1533734369,
        desc: "因为是突然心血来潮的作品，所以也没有特意去找无字幕的片源，直接用了带字幕的。所以中间有一段我添加了部分马赛克。\\n之前已经做过一次关于（Fate/Stay night 宛若天堂）这一条樱线的视频了，但是上一次毕竟是战斗画面为主，所以这一次我决定给樱做一期她为主角的剪辑视频，希望大家可以喜欢。\\nBGM：River Flows in You",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 192,
        dynamic: "#日本场应援2018##AMV##MAD#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/d6c946012742c3c86839fc2caf547a99159009ad.jpg",
          mid: 24626247,
          name: "星火琉璃酱"
        },
        pages: [
          {
            cid: 50012938,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 192,
            from: "vupload",
            page: 1,
            part: "【AMV】樱，你是我喜欢的女孩。",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/dacc8024b48b7cc756b27e2945bd7d7d9cbbc387.jpg",
        pubdate: 1533734369,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28854498,
          coin: 27,
          danmaku: 31,
          dislike: 0,
          favorite: 22,
          his_rank: 0,
          like: 29,
          now_rank: 0,
          reply: 7,
          share: 4,
          view: 4788
        },
        state: 0,
        tid: 24,
        title: "【AMV】樱，你是我喜欢的女孩。",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28854218,
        attribute: 16768,
        cid: 50011454,
        copyright: 1,
        ctime: 1533733783,
        desc: "尼禄殿下好可爱啊，用了前十集的素材。一共30多个唔嗯，有些不能用，用了好长时间剪素材\\n动漫：Fate/EXTRA Last Encore，其实我觉得这番挺好看的，内容也是有点，可能还是和UBW有点差距吧\\nBGM：Unity",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 121,
        dynamic: "#日本场应援2018##新星计划##尼禄#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/67d4c8c9a6d9b58fd5c935047c64cdd3b5cadbef.jpg",
          mid: 14911961,
          name: "抹不去の伤痛"
        },
        pages: [
          {
            cid: 50011454,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 121,
            from: "vupload",
            page: 1,
            part: "FateEXTRA Last Encore - 如今在古老边狱之底(Av18806005,P1)",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/8a213e873515eda27d474f0c9cc31e6c47166cb3.jpg",
        pubdate: 1533733783,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28854218,
          coin: 56,
          danmaku: 47,
          dislike: 0,
          favorite: 96,
          his_rank: 0,
          like: 91,
          now_rank: 0,
          reply: 21,
          share: 28,
          view: 6641
        },
        state: 0,
        tid: 27,
        title: "尼禄殿下世界第一可爱",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28851731,
        attribute: 24704,
        cid: 49951942,
        copyright: 1,
        ctime: 1533733741,
        desc: "米娜桑，大家好！这次趁着B萌赶紧做一波应援视频，希望大家喜欢！btw考虑一下投凛哟~\\n使用素材: Fate/Grand Order, Fate/Stay Night UBW, Fate/Zero, Fate,/Stay Night HF, Fate/Hollow Ataraxia\\n视频类型: AMV/MAD\\nBGM【音乐名】: Illuminate\\nBGM【音乐人】: Minami",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 287,
        dynamic: "#金闪闪##日本场应援2018##卫宫士郎##远坂凛#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/3c3eb61912831b33c83a5924c16d1d17f1ad893c.jpg",
          mid: 44371203,
          name: "呆毛万岁233"
        },
        pages: [
          {
            cid: 49951942,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 287,
            from: "vupload",
            page: 1,
            part: "【Fate:全角色应援:MAD:慢燃】吾等响应汝之召唤而来，众英灵，参上！",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/5cde6c0623ec8701da5ade96425c72d21448bd22.jpg",
        pubdate: 1533733741,
        rights: {
          autoplay: 0,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28851731,
          coin: 139,
          danmaku: 81,
          dislike: 0,
          favorite: 152,
          his_rank: 0,
          like: 141,
          now_rank: 0,
          reply: 47,
          share: 37,
          view: 5948
        },
        state: 0,
        tid: 24,
        title: "【Fate/全角色应援/慢燃/MAD】吾等响应汝之召唤而来，众英灵，参上！",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28847039,
        attribute: 16512,
        cid: 49996088,
        copyright: 1,
        ctime: 1533728826,
        desc: "萌萌的小樱~",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 749,
        dynamic: "#日本场应援2018##魔卡少女樱##木之本樱#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/fcafbef391efb9b59978242c27d1907de11a4270.jpg",
          mid: 32452880,
          name: "月下的纯白"
        },
        pages: [
          {
            cid: 49996088,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 749,
            from: "vupload",
            page: 1,
            part: "小樱",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/003c7674aad37e0fa0791e21c2b1c16935132f99.jpg",
        pubdate: 1533728826,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28847039,
          coin: 42,
          danmaku: 10,
          dislike: 0,
          favorite: 19,
          his_rank: 0,
          like: 45,
          now_rank: 0,
          reply: 26,
          share: 9,
          view: 2271
        },
        state: 0,
        tid: 162,
        title: "【绘画过程】木之本樱 封印解除~",
        tname: "绘画",
        videos: 1
      },
      {
        aid: 28845287,
        attribute: 16768,
        cid: 49992801,
        copyright: 1,
        ctime: 1533723329,
        desc: "救救孩子！！请给咔酱投上一票！！！\\n【别问我为什么要用这样的应援我已经彻底放弃剪燃向了_(:з」∠)_】【无cp】\\nBGM:\\nだってまだまだアバンタイトル—觉得爆豪同学特别可爱的轰君和切岛君x【梶裕贵/增田俊树】",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 64,
        dynamic: "#日本场应援2018##爆豪胜己##我的英雄学院#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/4874ce1162dce147670b610aad356272ba23ef1a.jpg",
          mid: 26498497,
          name: "是扑倒不是扑倒"
        },
        pages: [
          {
            cid: 49992801,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 64,
            from: "vupload",
            page: 1,
            part: "【爆豪胜己】可爱的爆豪君（日常吸咔＾q＾）",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/6bb2a44b5179fc2389b72815f20c08fc227e1a63.jpg",
        pubdate: 1533723329,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28845287,
          coin: 22,
          danmaku: 13,
          dislike: 0,
          favorite: 10,
          his_rank: 0,
          like: 42,
          now_rank: 0,
          reply: 13,
          share: 3,
          view: 1482
        },
        state: -100,
        tid: 24,
        title: "【爆豪胜己】这么可爱的咔不来吸一口吗＾q＾",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28841791,
        attribute: 16512,
        cid: 49986585,
        copyright: 1,
        ctime: 1533724456,
        desc: "封面源自网络\\r\\n前方高渣....\\r\\n使用素材: 我的英雄学院\\r\\nBGM【音乐名】: Look At Me Now",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 132,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/62c5c0b39cd1f9b559d0eea9083702110abde6b0.jpg",
          mid: 9565447,
          name: "祁延浅"
        },
        pages: [
          {
            cid: 49986585,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 132,
            from: "vupload",
            page: 1,
            part: "秀气的我_bilibili",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/2fde6388863e889fda437507379719ca47228e94.png",
        pubdate: 1533724456,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28841791,
          coin: 70,
          danmaku: 41,
          dislike: 0,
          favorite: 44,
          his_rank: 0,
          like: 100,
          now_rank: 0,
          reply: 29,
          share: 14,
          view: 2163
        },
        state: -100,
        tid: 24,
        title: "【B萌/绿谷出久应援】冲向更遥远的彼方!",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28840257,
        attribute: 2113664,
        cid: 49983925,
        copyright: 1,
        ctime: 1533719916,
        desc: "模型：ザビ男：なかむら\\n场景：im8225803：SNowly\\n动作：sm25937215：ゆり\\n镜头：一騎当千(1人用)：うぐいす\\nBGM：一騎当千（Luz）\\nMME：AutoLuminous4、Diffusion7：そぼろ",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 209,
        dynamic: "#岸浪白野##日本场应援2018##FATE#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg",
          mid: 16295316,
          name: "岸波玉藻"
        },
        pages: [
          {
            cid: 49983925,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 209,
            from: "vupload",
            page: 1,
            part: "1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/d4eeaf566b61e6c3c32271cbbc51d658402af01b.jpg",
        pubdate: 1533719916,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28840257,
          coin: 4,
          danmaku: 0,
          dislike: 0,
          favorite: 9,
          his_rank: 0,
          like: 30,
          now_rank: 0,
          reply: 8,
          share: 8,
          view: 529
        },
        state: 0,
        tid: 25,
        title: "【FATE MMD】扎比君的一骑当千",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28840256,
        attribute: 16512,
        cid: 49984131,
        copyright: 1,
        ctime: 1533721986,
        desc: "BGM：skillet--hero\\n喜欢的话点个转发，加个关注都是对我最大的支持～",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 188,
        dynamic: "#日本场应援2018##AMV##纯剪辑#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/45b27a346e342f9d92a71c68ec78dac5dd0893b4.jpg",
          mid: 237269440,
          name: "无sol谓"
        },
        pages: [
          {
            cid: 49984131,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 188,
            from: "vupload",
            page: 1,
            part: "未命名项目",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/f9b7ad36badbee092bf05c85e5b1364b2cefc000.jpg",
        pubdate: 1533721986,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28840256,
          coin: 35,
          danmaku: 14,
          dislike: 0,
          favorite: 7,
          his_rank: 0,
          like: 32,
          now_rank: 0,
          reply: 18,
          share: 7,
          view: 858
        },
        state: -100,
        tid: 24,
        title: "「我的英雄学院/AMV」三人共同的意志",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28840249,
        attribute: 16512,
        cid: 49977458,
        copyright: 1,
        ctime: 1533723558,
        desc: "某不知名萌新up，第一次做mad/amv。做的不好请多指教\\nBGM：THERE IS REASON。\\n因为我的天谴之力，一共做了4次，第一次没保存重做，第二次出了致命问题重做，第三次电脑死机重做，第四次电脑卡死只保存了一半......但是游戏人生是我top1，剧场版看哭了40分钟，所以还是坚持做完了·-·\\n播放量要是没超1w，可能我以后就不会做这种视频了,除非游戏人生出第二季→.→...\\n求关注求硬币求推荐求收藏求打赏求转发(๑ • . • ๑)",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 437,
        dynamic: "#日本场应援2018##游戏人生ZERO##游戏人生#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/f7a8cb6818a31566ecb686c334b79c7251385e7d.jpg",
          mid: 69185991,
          name: "邪少年丶"
        },
        pages: [
          {
            cid: 49977458,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 437,
            from: "vupload",
            page: 1,
            part: "最终成品游戏人生zero",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/ab4da65db1a29bb62187a43f4163f84642632ae9.jpg",
        pubdate: 1533723558,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28840249,
          coin: 80,
          danmaku: 23,
          dislike: 0,
          favorite: 52,
          his_rank: 0,
          like: 107,
          now_rank: 0,
          reply: 27,
          share: 29,
          view: 2537
        },
        state: 0,
        tid: 24,
        title: "【游戏人生zero/剧场版/mad】跨越种族的爱情。休比，下次我们一定会赢！",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28837429,
        attribute: 16512,
        cid: 49978954,
        copyright: 1,
        ctime: 1533719385,
        desc: "",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 227,
        dynamic: "#日本场应援2018##此花亭奇谭##柚#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/39f667b341cf21827cd7ae81f68da3081934ac82.jpg",
          mid: 97248224,
          name: "bili_97248224"
        },
        pages: [
          {
            cid: 49978954,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 227,
            from: "vupload",
            page: 1,
            part: "周杰伦 - 稻香",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/1e89c1ef6c8a3be7b1585599c8ca418c939d6440.jpg",
        pubdate: 1533719385,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28837429,
          coin: 19,
          danmaku: 3,
          dislike: 0,
          favorite: 18,
          his_rank: 0,
          like: 19,
          now_rank: 0,
          reply: 4,
          share: 8,
          view: 729
        },
        state: 0,
        tid: 24,
        title: "【此花亭奇谭】稻香X此花亭奇谭",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28835367,
        attribute: 16512,
        cid: 49973121,
        copyright: 1,
        ctime: 1533718379,
        desc: "歌曲：魔法少女小圆OPコネクト -歌手：ClariS（网易云有）\\n剪辑软件：PR\\n没找到生肉，也没找到歌词字幕，，好气啊。。。。\\n总之，2018萌战请多多支持小樱，拜托了！！！",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 267,
        dynamic: "#魔卡少女樱##动漫##新人向#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/04a86a7f99fb9506003c13a130134763c283536b.jpg",
          mid: 29543952,
          name: "渡鸦爱德华"
        },
        pages: [
          {
            cid: 49973121,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 267,
            from: "vupload",
            page: 1,
            part: "魔卡少女樱",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/60a588aae46e8ae2e172682ab98a4779b7f5ea87.jpg",
        pubdate: 1533718379,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28835367,
          coin: 48,
          danmaku: 28,
          dislike: 0,
          favorite: 66,
          his_rank: 0,
          like: 102,
          now_rank: 0,
          reply: 53,
          share: 19,
          view: 3232
        },
        state: 0,
        tid: 24,
        title: "【2018 B萌 应援/魔卡少女樱】无论前方有多么大的阻碍，也一定可以越过（用小圆的方式打开小樱）",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28833022,
        attribute: 16512,
        cid: 49966396,
        copyright: 1,
        ctime: 1533715262,
        desc: "《闪耀之海》\\n演唱：染音若蔡\\n作词：冰梓yuri\\n作曲：甄小熊\\nPV：EinsElric\\n封面画师：汐洛琪SHIROKI\\n\\nST声迹配音组《宝石之国》中文配音原创歌。助力宝石之国B萌大人气角色，取得好成绩！\\n网易云：https://music.163.com/#/album?id=71806628\\n5sing：http://5sing.kugou.com/yc/3652162.html\\n\\n微博：@瑷珥-染音若蔡",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 133,
        dynamic: "B萌记得给宝石们投票哦~！支持请多多点赞收藏~！爱你们~！\\nps:配合PV看会感觉到了不一样的东西！\\n《闪耀之海》\\n演唱：@瑷珥-染音若蔡\\n作词：@冰梓yuri\\n作曲：甄小熊\\nPV：@EinsElric\\n封面画师：@汐洛琪SHIROKI\\n#宝石之国##染音若蔡##磷叶石##原创歌#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/dc14daced5b61f985759fd931980f43f7605ace1.jpg",
          mid: 215210,
          name: "瑷珥-染音若蔡"
        },
        pages: [
          {
            cid: 49966396,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 133,
            from: "vupload",
            page: 1,
            part: "118【染音若蔡】闪耀之海【宝石之国 原创歌】_1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/531a0b243f53ab33b854ecd8a5ea72d8f7f8fc2d.jpg",
        pubdate: 1533715262,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28833022,
          coin: 347,
          danmaku: 42,
          dislike: 0,
          favorite: 377,
          his_rank: 0,
          like: 656,
          now_rank: 0,
          reply: 63,
          share: 41,
          view: 6559
        },
        state: 0,
        tid: 28,
        title: "【染音若蔡】你还记得宝石之国那闪耀之海吗",
        tname: "原创音乐",
        videos: 1
      },
      {
        aid: 28831588,
        attribute: 16512,
        cid: 49967939,
        copyright: 1,
        ctime: 1533715661,
        desc: "智乃应援视频第二弹终于肝出来了！！由于是两天肝出来的，有一半的镜头有重复，但看点完全是两个看点！希望大家多多支持智乃！！！emmm也希望智乃能比伊莉雅的票高!!\\nbgm：光吉猛修 - 天国と地獄",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 83,
        dynamic: "智乃应援视频第二弹终于肝出来了！！由于是两天肝出来的，有一半的镜头有重复，但看点完全是两个看点！希望大家多多支持智乃！！！emmm也希望智乃能比伊莉雅的票高！#日本场应援2018##bilibili moe##请问您今天要来点兔子吗？？##香风智乃##新星计划#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/7a9e7d5d792c853f6adeb262ebabf61d59e6cf0a.jpg",
          mid: 11354330,
          name: "凌云Chino"
        },
        pages: [
          {
            cid: 49967939,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 83,
            from: "vupload",
            page: 1,
            part: "老婆！你有毒！",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/bd95d3672b7030d7ad33a607ac74d15088940d1e.jpg",
        pubdate: 1533715661,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28831588,
          coin: 52,
          danmaku: 9,
          dislike: 0,
          favorite: 27,
          his_rank: 0,
          like: 58,
          now_rank: 0,
          reply: 67,
          share: 15,
          view: 1866
        },
        state: 0,
        tid: 24,
        title: "【欢乐向/智乃应援】老婆！你有毒！",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28831178,
        attribute: 16768,
        cid: 49964130,
        copyright: 1,
        ctime: 1533715825,
        desc: "新人渣作，素材和音乐等方面有很大不足，请大家多多见谅，欢迎大家的批评指教。\\n封面ID64099009",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 142,
        dynamic: "#AMV##新人向##纯剪辑",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/021b691a4de5c69f85c97b0745481eb092695131.jpg",
          mid: 23033971,
          name: "漫雪凛冬"
        },
        pages: [
          {
            cid: 49964130,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 142,
            from: "vupload",
            page: 1,
            part: "我的视频",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/448a64ab80ab613b97a0f6661df9cd21e2154cf5.jpg",
        pubdate: 1533718392,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28831178,
          coin: 10,
          danmaku: 1,
          dislike: 0,
          favorite: 4,
          his_rank: 0,
          like: 14,
          now_rank: 0,
          reply: 10,
          share: 7,
          view: 689
        },
        state: 0,
        tid: 24,
        title: "绚烂如樱，尘世似雪",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28830153,
        attribute: 16768,
        cid: 49964529,
        copyright: 1,
        ctime: 1533714855,
        desc: "做完这个视频后B站暂时不会再发布新视频了，工作重心转移到自己的学业和微博上，说不出为什么就是不想再这样参加萌战了，但无论如何，智乃加油吧，大家加油吧。",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 299,
        dynamic: "#日本场应援2018##香风智乃##二次元# 大家加油",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/5bcbe2e796416996929cc225b57f252ef2772fa8.jpg",
          mid: 31895977,
          name: "Andy安笛"
        },
        pages: [
          {
            cid: 49964529,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 299,
            from: "vupload",
            page: 1,
            part: "Last",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/41c200994248d6f491786fe4753bf29049f2e893.jpg",
        pubdate: 1533714855,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28830153,
          coin: 25,
          danmaku: 0,
          dislike: 0,
          favorite: 20,
          his_rank: 0,
          like: 32,
          now_rank: 0,
          reply: 18,
          share: 11,
          view: 3325
        },
        state: 0,
        tid: 24,
        title: "【Moe2018应援/退圈纪念/点兔/香风智乃】CONTINUE....?",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28829710,
        attribute: 16512,
        cid: 49965171,
        copyright: 1,
        ctime: 1533715229,
        desc: "主要内容为纳萨力克大坟墓目前登场的领域守护者\\nBGM：鏡音レン,mothy - 悪ノ召使\\n欢迎加入UP的粉丝群：237213911",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 299,
        dynamic: "#不死者之王##骨傲天##Overlord##新星计划#\\n主要内容为纳萨力克大坟墓目前登场的领域守护者\\nBGM：鏡音レン,mothy - 悪ノ召使\\n欢迎加入UP的粉丝群：237213911",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/a4cbc140157251afb969023ada66e6d7b084bf6e.jpg",
          mid: 4021955,
          name: "红莲妖"
        },
        pages: [
          {
            cid: 49965171,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 299,
            from: "vupload",
            page: 1,
            part: "领域守护者",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/b4986d507dc65cf0222f2b1d40d35a640ac1e757.jpg",
        pubdate: 1533715229,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28829710,
          coin: 41,
          danmaku: 26,
          dislike: 0,
          favorite: 24,
          his_rank: 0,
          like: 82,
          now_rank: 0,
          reply: 21,
          share: 1,
          view: 4222
        },
        state: 0,
        tid: 27,
        title: "【瞎考剧】Overlord：领域守护者",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28826330,
        attribute: 16512,
        cid: 49957386,
        copyright: 1,
        ctime: 1533710501,
        desc: "·自制，2018b萌日本场贞德应援作品\\n·草稿风，渣上色，轻喷……\\n·BGM：自伤无色\\n·无cp向，请勿ky，一起愉快的食用\\n·求硬币，收藏，关注(　´・◡・｀)",
        dimension: {
          height: 1072,
          rotate: 0,
          width: 1520
        },
        duration: 105,
        dynamic: "#日本场应援2018##fgo##贞德应援#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/2f787c2dcafdd2d0772b3564bd772ab17bd83633.jpg",
          mid: 5825627,
          name: "Great乱舞"
        },
        pages: [
          {
            cid: 49957386,
            dimension: {
              height: 1072,
              rotate: 0,
              width: 1520
            },
            duration: 105,
            from: "vupload",
            page: 1,
            part: "乐秀视频第12部_20180808133443914",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/4bb5318d9c5b1654d25ecca194170fe4badeb03a.jpg",
        pubdate: 1533710501,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28826330,
          coin: 323,
          danmaku: 37,
          dislike: 0,
          favorite: 501,
          his_rank: 0,
          like: 363,
          now_rank: 0,
          reply: 56,
          share: 42,
          view: 6674
        },
        state: 0,
        tid: 47,
        title: "【FGO手书】这样的我生存于世",
        tname: "短片·手书·配音",
        videos: 1
      },
      {
        aid: 28826083,
        attribute: 16768,
        cid: 49956973,
        copyright: 1,
        ctime: 1533711389,
        desc: "因果流转，人总得靠其他人的帮助才能生活下去，所以总有一天，请你去帮助其他人吧。  阿万音铃羽",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 59,
        dynamic: "#日本场应援2018##命运石之门##命运石之门0#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/9d9a503bc52be6f408910ea0b8aba6653bb018d8.jpg",
          mid: 7583781,
          name: "素晴硝子"
        },
        pages: [
          {
            cid: 49956973,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 59,
            from: "vupload",
            page: 1,
            part: "翎羽1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/2965363a0f23ab4fae38481e08032f2a91f33078.jpg",
        pubdate: 1533711389,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28826083,
          coin: 85,
          danmaku: 1,
          dislike: 0,
          favorite: 32,
          his_rank: 0,
          like: 101,
          now_rank: 0,
          reply: 36,
          share: 18,
          view: 1374
        },
        state: 0,
        tid: 27,
        title: "【应援】铃羽莫比乌斯的跃迁",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28825682,
        attribute: 16768,
        cid: 49824582,
        copyright: 1,
        ctime: 1533708951,
        desc: "-",
        dimension: {
          height: 1440,
          rotate: 0,
          width: 2560
        },
        duration: 106,
        dynamic: "#日本场应援2018##木之本樱##魔卡少女樱#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/bed3035d9ac8ef3a8d4428551110a1f061ffc932.jpg",
          mid: 3651600,
          name: "咕大福"
        },
        pages: [
          {
            cid: 49824582,
            dimension: {
              height: 1440,
              rotate: 0,
              width: 2560
            },
            duration: 106,
            from: "vupload",
            page: 1,
            part: "【木之本樱B萌应援】燃向踩点混剪，小樱今天就告诉你什么是魔法少女\\\\(✨∇✨)\\\\",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/ffe6068e6cf665e2bfdbc7d88bda39312d13d196.jpg",
        pubdate: 1533708951,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28825682,
          coin: 51,
          danmaku: 37,
          dislike: 0,
          favorite: 73,
          his_rank: 0,
          like: 119,
          now_rank: 0,
          reply: 32,
          share: 25,
          view: 3764
        },
        state: 0,
        tid: 183,
        title: "【木之本樱B萌应援】燃向踩点混剪，小樱今天就告诉你什么是魔法少女(✨∇✨)",
        tname: "影视剪辑",
        videos: 1
      },
      {
        aid: 28822944,
        attribute: 2113920,
        cid: 49952983,
        copyright: 1,
        ctime: 1533709292,
        desc: "各位好我是冥香。这个不出意外可能是天草在参加本届B萌期间我会做的最后一个应援视频。\\r\\n这次改成适用持刀的动作费了好长时间……如果觉得效果好，也不用给我投币，请给天草投票xxxxxxxxxxx\\r\\n\\r\\n总而言之本周六天草对小太阳的32进16，希望大家支持天草！虽然我也很喜欢小太阳但内战就是这样了！！",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 201,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/40d60aa15ac21ed3f8f0a13aac77d176094e4e8f.jpg",
          mid: 422673,
          name: "冥香"
        },
        pages: [
          {
            cid: 49952983,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 201,
            from: "vupload",
            page: 1,
            part: "moe3",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/3726c6fe26cf6b0e39b45f62f3701abccb49a293.png",
        pubdate: 1533709292,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28822944,
          coin: 50,
          danmaku: 5,
          dislike: 0,
          favorite: 51,
          his_rank: 0,
          like: 55,
          now_rank: 0,
          reply: 13,
          share: 13,
          view: 1100
        },
        state: 0,
        tid: 25,
        title: "【B萌2018日本场应援】[A]ddiction【天草四郎】【动作改变】",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28821884,
        attribute: 16512,
        cid: 49951385,
        copyright: 1,
        ctime: 1533707868,
        desc: "这次做了好长时间哦。\\r\\n素材：魔法少女伊莉雅雪下的誓言，Fate/Stay Night06版，Fate/Stay Night UBW版，Fate/Stay Night HF版\\r\\n音乐：Flower Dance",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 254,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/1d3318128de6a4d2164cd37e43f4ad45222fe98b.jpg",
          mid: 175795512,
          name: "我是笔帽"
        },
        pages: [
          {
            cid: 49951385,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 254,
            from: "vupload",
            page: 1,
            part: "第14话 理想的尽头_高清_3",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/84a5b2d3a3e098a8db0ddc0326bee4603a88be44.png",
        pubdate: 1533707868,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28821884,
          coin: 23,
          danmaku: 11,
          dislike: 0,
          favorite: 35,
          his_rank: 0,
          like: 39,
          now_rank: 0,
          reply: 9,
          share: 12,
          view: 2179
        },
        state: 0,
        tid: 24,
        title: "【Fate/卫宫士郎应援】无论发生什么，我也不会后悔！",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28820064,
        attribute: 2113664,
        cid: 49946360,
        copyright: 1,
        ctime: 1533705696,
        desc: "模型：衛宮士郎：ごまもりは流れゆく／遠坂凛、間桐桜、ぐだお：珠華（しゅか）／セイバー：ribbondog／ネロ・クラウディウス：あかね／玉藻の前、ザビ男：なかむら／ザビ子：1010浣／エミヤ、クーフーリン：ちょビ玉／ギルガメッシュ：ひどく泰平化されたオティー\\n场景：月面ステージ、月面低軌道ステージ：Tansoku102cm-短足沼地人\\n动作/镜头：Thriller：DJRocket\\nBGM：Thriller（Michael Jackson）\\nMME：Diffusion7：そぼろ",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 128,
        dynamic: "#THRILLER##FATE##日本场应援2018#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg",
          mid: 16295316,
          name: "岸波玉藻"
        },
        pages: [
          {
            cid: 49946360,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 128,
            from: "vupload",
            page: 1,
            part: "2",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/3103e49ef8b92433c74cd86b58ebb8482bde0046.jpg",
        pubdate: 1533705696,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28820064,
          coin: 27,
          danmaku: 58,
          dislike: 0,
          favorite: 71,
          his_rank: 0,
          like: 93,
          now_rank: 0,
          reply: 45,
          share: 25,
          view: 2953
        },
        state: 0,
        tid: 25,
        title: "【FATE MMD】Thriller",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28819794,
        attribute: 16512,
        cid: 49945412,
        copyright: 1,
        ctime: 1533705933,
        desc: "视频类型: 其他\\n相关题材: OVERLORD；报菜名\\n简介: 老骨头：我的那萨里克原来还有说相声的女仆！？\\n贯口：相声中常见的表现形式，\\n贯是一气呵成，一贯到底的意思。",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 147,
        dynamic: "视频类型: 其他\\n相关题材: OVERLORD；报菜名\\n简介: 老骨头：我的那萨里克原来还有说相声的女仆！？\\n贯口：相声中常见的表现形式，\\n贯是一气呵成，一贯到底的意思。",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/0901945fce57e13d89b3d941330ab89a10cd9ebd.jpg",
          mid: 4159782,
          name: "养耗子防猫"
        },
        pages: [
          {
            cid: 49945412,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 147,
            from: "vupload",
            page: 1,
            part: "goodgang",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/329994b5fecf7222c05586036ff4e634d0c5c97e.jpg",
        pubdate: 1533705933,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28819794,
          coin: 84,
          danmaku: 45,
          dislike: 0,
          favorite: 34,
          his_rank: 0,
          like: 114,
          now_rank: 0,
          reply: 34,
          share: 19,
          view: 8210
        },
        state: 0,
        tid: 27,
        title: "【OVERLORD】老骨：我请您吃饭..",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28819726,
        attribute: 16512,
        cid: 49943436,
        copyright: 1,
        ctime: 1533705782,
        desc: "大家如果观后感觉不错，有劳点个推荐赞一下吧，小透明up主在B站生存艰难，没有推荐就没有播放量，拜托各位了，十分感谢！\\n新作指路 ——→ 鬼灯不同造型帅气瞬间，av30505048 ：【踩点高燃】鬼灯：无所不能，瞬间切换！白泽：笑瘫！鬼灯百变造型帅气瞬间剪辑，求推荐哇！\\n在av28147879里，白泽被鬼灯一顿狂扁，弹幕和评论中不少老中医粉纷纷表达心疼。为了活命，up主做了新的剪辑。\\n这次，换白泽来折腾鬼灯！虐啊——！从头到尾，鬼灯被安排得明明白白。题目为《欲胜鬼灯，惟可用情》。“胜”改为“虐”后，情，就是",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 229,
        dynamic: "本视频主题：鬼灯可爱~（误......）\\n身为一只上亿岁的老神兽，白泽反虐的方式，自然与鬼灯不同。\\n鬼灯战力爆表，名贯三界，遇事属他拎得清，总能找到最适宜有效的解决方法。虽然行事和表情令人生怖，但威严下亦有对他人尊重、体恤与守护的心意。\\n这样的人物，却反常且别扭地，总和非奸非恶的白泽过不去。\\n可能鬼灯自己也没有发觉内心真实的情感吧。\\n难以察觉的情感，即本视频主题。\\n#鬼灯的冷彻# #白泽# #鬼灯# #Bilibili Moe# #日本场应援2018# #剪辑#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/86d74a90ee6c2b729392bcb9d6d6a954f7f0ae26.jpg",
          mid: 2609880,
          name: "树狸饭堂"
        },
        pages: [
          {
            cid: 49943436,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 229,
            from: "vupload",
            page: 1,
            part: "白泽鬼灯甜折腾720P",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/204887868346b795c004d55cf4678fbf5dea898f.jpg",
        pubdate: 1533705782,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28819726,
          coin: 1267,
          danmaku: 218,
          dislike: 0,
          favorite: 1828,
          his_rank: 0,
          like: 2122,
          now_rank: 0,
          reply: 272,
          share: 138,
          view: 39315
        },
        state: 0,
        tid: 27,
        title: "【HE】换白泽来虐鬼灯！鬼灯：被安排得明明白白...原台词重塑甜向剧情",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28819080,
        attribute: 16512,
        cid: 49943054,
        copyright: 1,
        ctime: 1533702750,
        desc: "字幕来源／应援文：半翅雀@半翅雀\\n票根来源：UP主自己\\n让我们迎接各位刀回家，他们在我们心里是最棒的\\n欢迎各位婶婶加入刀剑乱舞B萌应援群\\n群号：773458796",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1200
        },
        duration: 238,
        dynamic: "#日本场应援2018##刀剑乱舞##鹤丸国永#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/2e3e8bcedcbcb6abcfdf00cca6049d5345d0da58.jpg",
          mid: 19505617,
          name: "夜雨月落"
        },
        pages: [
          {
            cid: 49943054,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1200
            },
            duration: 238,
            from: "vupload",
            page: 1,
            part: "【墨染瑶】【刀剑乱舞B萌应援】刀剑乱舞2018 Bilibili Moe 日漫场送别",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/7149b35ee1df51de1d8dfbd88f7a77e4a11e3f4e.jpg",
        pubdate: 1533702750,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28819080,
          coin: 13,
          danmaku: 1,
          dislike: 0,
          favorite: 12,
          his_rank: 0,
          like: 18,
          now_rank: 0,
          reply: 19,
          share: 14,
          view: 559
        },
        state: 0,
        tid: 47,
        title: "【墨染瑶】【刀剑乱舞B萌应援】刀剑乱舞2018 Bilibili Moe 日漫场送别",
        tname: "短片·手书·配音",
        videos: 1
      },
      {
        aid: 28810607,
        attribute: 16768,
        cid: 49922234,
        copyright: 1,
        ctime: 1533696555,
        desc: "番名：《DARLING in the FRANXX》\\nBGM:日剧产科医生鸿鸟的主题曲《あなたがここにいて抱きしめることができるなら》    from  miwa\\n第二发了，做完就感觉比上次工作量大了很多，很幸运歌不算很难，对我这个萌新比较友好\\n喜欢我的视频别忘了点赞，投币，收藏，关注，分享给你的朋友。b萌02加油！02赛高！让这个世界给这个女孩一丝温暖吧！\\n敏娜桑！！！多谢了！！！    \\n最后祝02在b萌取得好成绩",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1440
        },
        duration: 357,
        dynamic: "#日本场应援2018##bilibili moe##动画#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/96c43c12e194c5cc95e86a624099da01dd309b9f.jpg",
          mid: 29459594,
          name: "KLArkalin阿卡林"
        },
        pages: [
          {
            cid: 49922234,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1440
            },
            duration: 357,
            from: "vupload",
            page: 1,
            part: "二期成品字幕_2",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/98f22b1956f8f68355e2b9db0c127c03c90c16c3.jpg",
        pubdate: 1533697364,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28810607,
          coin: 252,
          danmaku: 82,
          dislike: 0,
          favorite: 179,
          his_rank: 0,
          like: 224,
          now_rank: 0,
          reply: 141,
          share: 41,
          view: 3341
        },
        state: 0,
        tid: 24,
        title: "【DitF/02应援/催泪向】只要能将眼前的你拥入怀中，我别无所求",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28805234,
        attribute: 16512,
        cid: 49913077,
        copyright: 1,
        ctime: 1533691390,
        desc: "第一次做amv也是费了一番心血\\n从文案 剪辑 后期\\n一共花了大概一个星期吧\\n其中偷懒过 爆肝过\\n苦想过 也欣喜过\\n用自己微弱的力量给薇尔莉特应援\\n薇尔莉特 冲鸭！！！！！！！！！！！！！",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 208,
        dynamic: "#日本场应援2018##AMV##新人向#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/d234685696aeb25f42bf096e619e0e8fd1fa69e0.jpg",
          mid: 85985833,
          name: "安少目"
        },
        pages: [
          {
            cid: 49913077,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 208,
            from: "vupload",
            page: 1,
            part: "08_3",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/bfe2df5b1183b4022f355b88a7eef61d35db9478.jpg",
        pubdate: 1533691390,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28805234,
          coin: 52,
          danmaku: 23,
          dislike: 0,
          favorite: 15,
          his_rank: 0,
          like: 56,
          now_rank: 0,
          reply: 29,
          share: 8,
          view: 903
        },
        state: -100,
        tid: 24,
        title: "【AMV/紫罗兰】一个人如其名的书记人偶 一段扣人心弦的寻爱之旅",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28804750,
        attribute: 16512,
        cid: 49915214,
        copyright: 1,
        ctime: 1533690428,
        desc: "(　・ˍ・)　(・ˍ・*)",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1080
        },
        duration: 231,
        dynamic: "#日本场应援2018##我的英雄学院##绿谷出久#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/46877cdaa4023321d113153564fd97e4b620127c.jpg",
          mid: 25328929,
          name: "SWINGNOW"
        },
        pages: [
          {
            cid: 49915214,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1080
            },
            duration: 231,
            from: "vupload",
            page: 1,
            part: "合成 1_1_x264",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/099048695bcba2fd6ba0075269fd549f1105a74b.jpg",
        pubdate: 1533690428,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28804750,
          coin: 4,
          danmaku: 13,
          dislike: 0,
          favorite: 5,
          his_rank: 0,
          like: 25,
          now_rank: 0,
          reply: 16,
          share: 1,
          view: 944
        },
        state: -100,
        tid: 24,
        title: "【我英应援】逆战",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28803085,
        attribute: 16512,
        cid: 49912292,
        copyright: 1,
        ctime: 1533687448,
        desc: "不要收藏，不要硬币，要脸。\\r\\n啊……太菜了……剪了半天弄了个什么出来……留个黑历史在这儿以后拿来嘲笑一下自己。",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 159,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/77a572f604a652b2b73432127f4191d8354970ef.jpg",
          mid: 43971264,
          name: "烟唐秋豪丶"
        },
        pages: [
          {
            cid: 49912292,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 159,
            from: "vupload",
            page: 1,
            part: "磷叶石终稿",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/d2747e03786090bf318f4eb6c3916fd8c332a017.png",
        pubdate: 1533687448,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28803085,
          coin: 28,
          danmaku: 4,
          dislike: 0,
          favorite: 39,
          his_rank: 0,
          like: 45,
          now_rank: 0,
          reply: 25,
          share: 9,
          view: 1201
        },
        state: 0,
        tid: 24,
        title: "【宝石之国AMV】法斯：我该如何改变？",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28802665,
        attribute: 16768,
        cid: 49911644,
        copyright: 1,
        ctime: 1533686451,
        desc: "8月6日，与人梭哈莓反杀，惜败\\r\\n素材：DARLING in the FRANXX\\r\\nBGM：Take me hand  - DAISHI DANCE",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 262,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/28e3b7964a7a25462350583a45ecfb57883aebc5.jpg",
          mid: 3127528,
          name: "空耳狂魔"
        },
        pages: [
          {
            cid: 49911644,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 262,
            from: "vupload",
            page: 1,
            part: "序列 01_24",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/e90fd9a48797ce034fde2d885116b0c86cf6aefc.png",
        pubdate: 1533686451,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28802665,
          coin: 4015,
          danmaku: 468,
          dislike: 0,
          favorite: 3102,
          his_rank: 0,
          like: 3422,
          now_rank: 0,
          reply: 332,
          share: 756,
          view: 62078
        },
        state: 0,
        tid: 24,
        title: "【02应援】你一票我一票，02今晚就出道",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28797741,
        attribute: 16512,
        cid: 49901368,
        copyright: 1,
        ctime: 1533675012,
        desc: "Emmmmmmm白纸up没技术没生肉没智商，但是（我永远喜欢田所惠.jpg）",
        dimension: {
          height: 576,
          rotate: 0,
          width: 720
        },
        duration: 238,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/59dee61bb5022c7fa331c3ffb8177b4e6910e6f2.jpg",
          mid: 298019774,
          name: "Mztty"
        },
        pages: [
          {
            cid: 49901368,
            dimension: {
              height: 576,
              rotate: 0,
              width: 720
            },
            duration: 238,
            from: "vupload",
            page: 1,
            part: "田所惠",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/91f9a1af07a609e94fb7ac2c82816deacd4e90b7.jpg",
        pubdate: 1533675012,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28797741,
          coin: 4,
          danmaku: 0,
          dislike: 0,
          favorite: 0,
          his_rank: 0,
          like: 1,
          now_rank: 0,
          reply: 1,
          share: 2,
          view: 332
        },
        state: -100,
        tid: 24,
        title: "【食戟之灵】感谢你出现在我的身边",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28797730,
        attribute: 16512,
        cid: 49901363,
        copyright: 1,
        ctime: 1533675022,
        desc: "时间飞快的流逝，唯独现在，我有一种想对爱因斯坦发牢骚的心情，冈部，时间根据每个人的主观感受，既会变长，也会变短，相对论真是既浪漫又伤感的东西呢。——牧濑红莉栖",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 150,
        dynamic: "#日本场应援2018##命运石之门##MAD#时间飞快的流逝，唯独现在，我有一种想对爱因斯坦发牢骚的心情，冈部，时间根据每个人的主观感受，既会变长，也会变短，相对论真是既浪漫又伤感的东西呢。——牧濑红莉栖",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/d7018376ff9e712c03a34f6d4e77c247b6a2ba75.jpg",
          mid: 22044759,
          name: "丶牧濑红莉牺"
        },
        pages: [
          {
            cid: 49901363,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 150,
            from: "vupload",
            page: 1,
            part: "命运石之门.amv",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/a9d7ad25f84f34abcdd32d200fb9b7a9e7986462.jpg",
        pubdate: 1533675022,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28797730,
          coin: 89,
          danmaku: 3,
          dislike: 0,
          favorite: 37,
          his_rank: 0,
          like: 73,
          now_rank: 0,
          reply: 32,
          share: 8,
          view: 1369
        },
        state: 0,
        tid: 24,
        title: "【牧濑红莉栖应援】穿越世界线，与你相遇，仅此而已",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28796831,
        attribute: 16512,
        cid: 49900181,
        copyright: 1,
        ctime: 1533678023,
        desc: "做了16天的视频，可是食戟全员已回家，但128强仍然值得骄傲。\\n素材：食戟之灵\\nBGM：Black Rail\\n参考了一个黑契的视频：av3219374，是一个良作",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 137,
        dynamic: "#日本场应援2018##食戟之灵##MAD#欢迎食戟全员回家，招待不周",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/19c9dc8a6e28c4c570c16733599492f0503ea7c3.jpg",
          mid: 20443161,
          name: "Hope豪侠"
        },
        pages: [
          {
            cid: 49900181,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 137,
            from: "vupload",
            page: 1,
            part: "食戟之灵应援视频2_1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/3048dddd60221bdfe0e6002e15dbe821e078ff50.jpg",
        pubdate: 1533693611,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28796831,
          coin: 37,
          danmaku: 3,
          dislike: 0,
          favorite: 16,
          his_rank: 0,
          like: 25,
          now_rank: 0,
          reply: 17,
          share: 4,
          view: 859
        },
        state: 0,
        tid: 24,
        title: "【接全员回家】我的食戟，不，是我们的食戟",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28795012,
        attribute: 2113920,
        cid: 49887724,
        copyright: 1,
        ctime: 1533671812,
        desc: "BGM:ONE OK ROCK -The beginning\\n素材：fate  进击的巨人 一击男  小英雄 \\n上一次做的很多小伙伴说不够好,BGM不搭什么的，这次就重新做了一遍，希望大家会喜欢",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 294,
        dynamic: "#日本场应援2018##MAD##AMV#这次重新做了一版，希望会让大家满意",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/7c6d2f48e51eb4849fde10975b47f9fddbcb8373.jpg",
          mid: 113630734,
          name: "我就是BB机啊"
        },
        pages: [
          {
            cid: 49887724,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 294,
            from: "vupload",
            page: 1,
            part: "爱剪辑-我的信念AMV_clip",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/e70a5139253a8de2c78dce317a2f237d30fbeba5.jpg",
        pubdate: 1533671812,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28795012,
          coin: 78,
          danmaku: 18,
          dislike: 0,
          favorite: 101,
          his_rank: 0,
          like: 80,
          now_rank: 0,
          reply: 29,
          share: 27,
          view: 3798
        },
        state: 0,
        tid: 24,
        title: "【AMV】因为背负着信念才不会甘愿认输！",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28794117,
        attribute: 16512,
        cid: 49894425,
        copyright: 1,
        ctime: 1533671090,
        desc: "bgm--卡路里",
        dimension: {
          height: 576,
          rotate: 0,
          width: 720
        },
        duration: 324,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/6f15a7a5df1658f1fe0bdb79c0ca729672556f5c.jpg",
          mid: 211720194,
          name: "珠珠珠珠珠珠玉"
        },
        pages: [
          {
            cid: 49894425,
            dimension: {
              height: 576,
              rotate: 0,
              width: 720
            },
            duration: 162,
            from: "vupload",
            page: 1,
            part: "画面有问题对不起呜呜呜",
            vid: "",
            weblink: ""
          },
          {
            cid: 50379376,
            dimension: {
              height: 576,
              rotate: 0,
              width: 720
            },
            duration: 162,
            from: "vupload",
            page: 2,
            part: "画面调整啦，直接看这个就行",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/733e426e0c3d5221c117fe7a4e6d2c3309389a18.jpg",
        pubdate: 1533671090,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28794117,
          coin: 778,
          danmaku: 273,
          dislike: 0,
          favorite: 1258,
          his_rank: 0,
          like: 1237,
          now_rank: 0,
          reply: 266,
          share: 438,
          view: 32021
        },
        state: 0,
        tid: 27,
        title: "爱过，再见。",
        tname: "综合",
        videos: 2
      },
      {
        aid: 28793582,
        attribute: 16512,
        cid: 49893323,
        copyright: 1,
        ctime: 1533675084,
        desc: "爆豪胜己，粗中有细\\n话不多说，西内为敬\\n西内！",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 350,
        dynamic: "#日本场应援2018##我的英雄学院##爆豪胜己#西内！",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/863cbca4ad7d93581d7c2fc382da6bb66e4a74e9.jpg",
          mid: 22701238,
          name: "Hello-Newworld"
        },
        pages: [
          {
            cid: 49893323,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 350,
            from: "vupload",
            page: 1,
            part: "爆豪",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/60ae2e49ebfc28a60447adcd46f2bc6833336411.jpg",
        pubdate: 1533675083,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28793582,
          coin: 22,
          danmaku: 7,
          dislike: 0,
          favorite: 24,
          his_rank: 0,
          like: 56,
          now_rank: 0,
          reply: 0,
          share: 7,
          view: 1552
        },
        state: -100,
        tid: 24,
        title: "【爆豪胜己】为了成为No.1的英雄！",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28792753,
        attribute: 16768,
        cid: 49891825,
        copyright: 1,
        ctime: 1533666186,
        desc: "喜欢还请点个推荐，就是那个大拇指，点个关注，收藏硬币！谢谢各位支持！",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 41,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/19626abafb253b1864026aaa4a5c86d150262df1.jpg",
          mid: 9253594,
          name: "拔旗"
        },
        pages: [
          {
            cid: 49891825,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 41,
            from: "vupload",
            page: 1,
            part: "卡酱1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/477bea426007d003a8e02e75ea82994dcef1c329.png",
        pubdate: 1533666186,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28792753,
          coin: 27,
          danmaku: 17,
          dislike: 0,
          favorite: 84,
          his_rank: 0,
          like: 225,
          now_rank: 0,
          reply: 54,
          share: 11,
          view: 8421
        },
        state: -100,
        tid: 22,
        title: "【旗子】爆豪：啊？啊啊？啊啊啊？诶啊啊啊？！",
        tname: "鬼畜调教",
        videos: 1
      },
      {
        aid: 28792602,
        attribute: 16512,
        cid: 49892800,
        copyright: 1,
        ctime: 1533670521,
        desc: "和伊莉雅领证的最后一关选择了打闪闪，和ubw以及魔伊的混剪，喜欢的话请关注下up哦。",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 647,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/a7cc9d0187170a0ef41dd5c77c0c1d8965df3050.jpg",
          mid: 44487065,
          name: "怪人兰斯"
        },
        pages: [
          {
            cid: 49892800,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 647,
            from: "vupload",
            page: 1,
            part: "伊莉雅",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/4c29c30c26d7094294b38eabb4f911735e03d568.png",
        pubdate: 1533670521,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28792602,
          coin: 6,
          danmaku: 33,
          dislike: 0,
          favorite: 21,
          his_rank: 0,
          like: 27,
          now_rank: 0,
          reply: 33,
          share: 11,
          view: 3596
        },
        state: 0,
        tid: 172,
        title: "震惊！某UP与伊莉雅结婚现场上，某金发男路人竟惨遭殴打，重伤不起！（b萌伊莉雅，金闪闪应援）",
        tname: "手机游戏",
        videos: 1
      },
      {
        aid: 28792328,
        attribute: 16768,
        cid: 53221024,
        copyright: 1,
        ctime: 1533666210,
        desc: "之前做得不太满意，这次在原版的基础上做了一点小改动，希望大家能够喜欢～～",
        dimension: {
          height: 2160,
          rotate: 0,
          width: 3840
        },
        duration: 77,
        dynamic: "#FATE# #尼禄#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/e277274b0f6e0b587031f7415e868ec767f9c349.jpg",
          mid: 52367389,
          name: "柯哀落樱飘雪"
        },
        pages: [
          {
            cid: 53221024,
            dimension: {
              height: 2160,
              rotate: 0,
              width: 3840
            },
            duration: 77,
            from: "vupload",
            page: 1,
            part: "【Fate/Extra Last Encore】尼禄陛下的欢脱日常",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/0c7b4d21b030b10ea1137d6822b31d9ca1078aa0.jpg",
        pubdate: 1533666210,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28792328,
          coin: 34,
          danmaku: 6,
          dislike: 0,
          favorite: 31,
          his_rank: 0,
          like: 51,
          now_rank: 0,
          reply: 7,
          share: 5,
          view: 2221
        },
        state: -100,
        tid: 27,
        title: "【Fate/Extra Last Encore】红saber：今天余不但要唱歌～还要唱rap！",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28789557,
        attribute: 16768,
        cid: 49886535,
        copyright: 1,
        ctime: 1533669770,
        desc: "fate全员应援，外加失踪人口回归（｡ò ∀ ó｡）\\nBGM：Shot In The Dark",
        dimension: {
          height: 2160,
          rotate: 0,
          width: 3840
        },
        duration: 299,
        dynamic: "#日本场应援2018##fate##吾王#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/0c1d6eb8b497ffe10e3c29817b41e84ad13ee5e9.jpg",
          mid: 23226251,
          name: "Saber琪"
        },
        pages: [
          {
            cid: 49886535,
            dimension: {
              height: 2160,
              rotate: 0,
              width: 3840
            },
            duration: 299,
            from: "vupload",
            page: 1,
            part: "2160_25_12.76_Aug072018",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/1e3fac7c49cc612020ecc4260156b9938cc62650.jpg",
        pubdate: 1533669770,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28789557,
          coin: 67,
          danmaku: 8,
          dislike: 0,
          favorite: 84,
          his_rank: 0,
          like: 65,
          now_rank: 0,
          reply: 18,
          share: 24,
          view: 2351
        },
        state: 0,
        tid: 24,
        title: "【FGO/AMV/燃向】欢迎来到人理之光",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28788090,
        attribute: 16512,
        cid: 49883160,
        copyright: 1,
        ctime: 1533667419,
        desc: "第一次做mad，做的不怎么好，多多包涵。\\r\\n素材：魔法少女伊莉雅剧场版：雪下的誓言\\r\\nBGM：ひび割れた世界\\r\\n封面：https://www.pixiv.net/member_illust.php?mode=medium&illust_id=65608478",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 329,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/b7f988546726555377681f732c4bfed54c299613.jpg",
          mid: 8416010,
          name: "阡陌初雪"
        },
        pages: [
          {
            cid: 49883160,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 329,
            from: "vupload",
            page: 1,
            part: "雪下的誓言",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/ef03d707048a19e83796341b56eedb67db044440.png",
        pubdate: 1533667419,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28788090,
          coin: 1682,
          danmaku: 504,
          dislike: 0,
          favorite: 2383,
          his_rank: 0,
          like: 1685,
          now_rank: 0,
          reply: 441,
          share: 429,
          view: 79651
        },
        state: 0,
        tid: 24,
        title: "【卫宫士郎】我没能成为拯救所有人的正义的伙伴",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28787251,
        attribute: 16768,
        cid: 49900934,
        copyright: 1,
        ctime: 1533675107,
        desc: "第一次做AMV，估计观感欠佳_(:з」∠)_\\r\\n算是b萌朱碧和利库的应援视频吧ww\\r\\n素材：NGNL0（No Game No Life Zero)\\r\\n           鈴木このみ - There is a reason",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 602,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/f6e7b7ff85f7af44ed547c895dfe5f16a5e75d60.jpg",
          mid: 13902416,
          name: "一本畫時"
        },
        pages: [
          {
            cid: 49900934,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 301,
            from: "vupload",
            page: 1,
            part: "字幕版",
            vid: "",
            weblink: ""
          },
          {
            cid: 49881402,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 301,
            from: "vupload",
            page: 2,
            part: "无字版",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/9e3eeaf0b1e2983ba283da7c80063874f0ab7a15.png",
        pubdate: 1533675107,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28787251,
          coin: 20,
          danmaku: 1,
          dislike: 0,
          favorite: 18,
          his_rank: 0,
          like: 36,
          now_rank: 0,
          reply: 12,
          share: 18,
          view: 798
        },
        state: 0,
        tid: 24,
        title: "【No Game No Life · Zero】There is a reason 愛のために「AMV」",
        tname: "MAD·AMV",
        videos: 2
      },
      {
        aid: 28787096,
        attribute: 16512,
        cid: 49880064,
        copyright: 1,
        ctime: 1533666205,
        desc: "新人初投稿 请多指教\\n五战骑主从真好\\n\\nBGM：浅川悠-《瞬时の涡》（Fate/Stay Night Rider 角色歌）\\n素材来源：《Fate/Stay Night[Unlimited Blade Works]》、《Fate/Stay Night[Heaven's Feel I.presage flower]》",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 90,
        dynamic: "#日本场应援2018# #AMV# #美杜莎# #间桐樱#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/45227ce02741601a2a0098e0bfd5df11af7fb8c2.jpg",
          mid: 35151881,
          name: "-雪户鹤织-"
        },
        pages: [
          {
            cid: 49880064,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 90,
            from: "vupload",
            page: 1,
            part: "瞬时の涡",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/0b9a6b5da7e5e43ee0ec6f818b19e33a51bdd718.jpg",
        pubdate: 1533666205,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28787096,
          coin: 25,
          danmaku: 1,
          dislike: 0,
          favorite: 24,
          his_rank: 0,
          like: 33,
          now_rank: 0,
          reply: 7,
          share: 7,
          view: 1743
        },
        state: 0,
        tid: 24,
        title: "[Fate/AMV]Rider&间桐樱|只要澄澈的羁绊仍无言地照亮心间",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28787024,
        attribute: 2113664,
        cid: 49881578,
        copyright: 1,
        ctime: 1533666213,
        desc: "借用见视频尾",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 55,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/8ab9d8c06b1ede208b51fb7be1e0a9c06b396ac2.jpg",
          mid: 5033425,
          name: "木2森森"
        },
        pages: [
          {
            cid: 49881578,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 55,
            from: "vupload",
            page: 1,
            part: "001",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/917d5441b2f434f227453c5544570dd6b9434056.png",
        pubdate: 1533666213,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28787024,
          coin: 11,
          danmaku: 3,
          dislike: 0,
          favorite: 40,
          his_rank: 0,
          like: 30,
          now_rank: 0,
          reply: 9,
          share: 5,
          view: 1189
        },
        state: 0,
        tid: 25,
        title: "【我的英雄学院MMD】轰焦冻的runaway baby",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28786327,
        attribute: 2113664,
        cid: 49876912,
        copyright: 1,
        ctime: 1533666200,
        desc: "迦勒底加班人员的b萌应援。\\n嘛，对上了大狗感觉有点恐怖,也许是在做最后的挣扎也说不定呢。。。。.。\\n说起来这是我第一次正经地尝试2d向渲染，我吹爆akon太太的模型wwwww~\\nBGM是れをる桑的no title，降了三个半调（降调狂魔就是我了）。\\n韦伯子裙子的物理出了点问题咋改也改不好我也很烦恼，稍微忍耐下吧，别刷暂停成功什么的，小心复明失败23333。\\n借物表见评论，如果没看见就是你来的太早啦我还没起床。\\n另外为了应援9号当天我会发一个小彩蛋，能记住的可以来我的动态看下哦~",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 245,
        dynamic: "#日本场应援2018##君主·埃尔梅罗二世##bilibili moe#迦勒底加班势力登场~~~~b萌希望能投一票哦",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/8aeb328aec7b35b61786fb1dbdf2df7a6431154f.jpg",
          mid: 10986504,
          name: "xyz坐标"
        },
        pages: [
          {
            cid: 49876912,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 245,
            from: "vupload",
            page: 1,
            part: "001",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/a8973399567558849135be742ac6c1fcdc6f2ffe.jpg",
        pubdate: 1533666200,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28786327,
          coin: 42,
          danmaku: 11,
          dislike: 0,
          favorite: 27,
          his_rank: 0,
          like: 38,
          now_rank: 0,
          reply: 16,
          share: 15,
          view: 1241
        },
        state: 0,
        tid: 25,
        title: "【B萌应援】迦勒底加班势力登场",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28785523,
        attribute: 2113664,
        cid: 49877810,
        copyright: 1,
        ctime: 1533666183,
        desc: "Bilibili Moe,弗兰肯斯坦应援向MMD\\nBGM:from Y to Y\\nModel:做成参谋\\nCamera+Action:Hiramori Amu",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 322,
        dynamic: "#日本场应援2018##舞蹈MMD##新人向#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/98545d02fcb6bd97fe21eeb784a38ec24eb0f6ed.jpg",
          mid: 39469126,
          name: "双商下线"
        },
        pages: [
          {
            cid: 49877810,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 322,
            from: "vupload",
            page: 1,
            part: "from Y to Y(弗兰肯斯坦ver._BiliBili",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/3fb6aa9bd61c14133d65ebf1959a16dc16d1e771.jpg",
        pubdate: 1533666183,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28785523,
          coin: 13,
          danmaku: 4,
          dislike: 0,
          favorite: 4,
          his_rank: 0,
          like: 6,
          now_rank: 0,
          reply: 4,
          share: 3,
          view: 394
        },
        state: 0,
        tid: 25,
        title: "【MMD/B萌应援】from Y to Y(弗兰肯斯坦)",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28782524,
        attribute: 16512,
        cid: 49926392,
        copyright: 1,
        ctime: 1533660829,
        desc: "BGM:田中井彩智——黄金の辉き\\n=\\n说到做到。上星期看到B站上架了06版的fate，打鸡血剪辑的……剪到后面遇到不少困难有点摸鱼了，甚至忘了自己最初想通过视频表达什么了，有些粗制滥造，真是对不起（飞歌语气）。\\n可能赶不上士郎今天的应援了，但是我喜欢士郎的热情还是不变的（笑），也请大家多多支持士郎咯。",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 277,
        dynamic: "#日本场应援2018##卫宫士郎##fate#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/3ae164771bc5df3dc8f3083fc09154984f912a0f.jpg",
          mid: 8983166,
          name: "自我意识过剩者"
        },
        pages: [
          {
            cid: 49926392,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 277,
            from: "vupload",
            page: 1,
            part: "黄金の辉き（士郎应援）_bilibili",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/707cfd0e00eab017fa6792e5d2ee2db19a9ac508.jpg",
        pubdate: 1533660828,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28782524,
          coin: 103,
          danmaku: 9,
          dislike: 0,
          favorite: 135,
          his_rank: 0,
          like: 113,
          now_rank: 0,
          reply: 39,
          share: 19,
          view: 3160
        },
        state: 0,
        tid: 24,
        title: "【Fate/卫宫士郎】背负理想不断前行",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28779967,
        attribute: 16768,
        cid: 49868565,
        copyright: 1,
        ctime: 1533657496,
        desc: "bgm：Old Memory\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n希望有一个小埋那样的妹妹",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 106,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/4fd3f9c70ba89b9f87d6db91796b87233edcd670.jpg",
          mid: 20963025,
          name: "HoshikawaKanade"
        },
        pages: [
          {
            cid: 49868565,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 106,
            from: "vupload",
            page: 1,
            part: "【小埋应援】Old Memory",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/697ef3486f5bcd8514fea73d9677930bc1b5873d.jpg",
        pubdate: 1533657496,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28779967,
          coin: 36,
          danmaku: 27,
          dislike: 0,
          favorite: 23,
          his_rank: 0,
          like: 74,
          now_rank: 0,
          reply: 41,
          share: 8,
          view: 2025
        },
        state: -100,
        tid: 24,
        title: "【土间埋应援】Old Memory",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28778494,
        attribute: 16768,
        cid: 49865025,
        copyright: 1,
        ctime: 1533657293,
        desc: "有一对夫妻他们很强，但他们从来没赢过。        有一对兄妹他们很弱，但他们从来没输过。",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 245,
        dynamic: "#日本场应援2018##里克与休比#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/e177eb81b4d0b835cf5023f411a9a9c612cd3037.jpg",
          mid: 289091320,
          name: "牧瑟秋风"
        },
        pages: [
          {
            cid: 49865025,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 245,
            from: "vupload",
            page: 1,
            part: "游戏人生剧场版里克与休比",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/fc4f4ea539ac75cf8f2aadc4778d09e3e6a05222.jpg",
        pubdate: 1533657293,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28778494,
          coin: 7,
          danmaku: 0,
          dislike: 0,
          favorite: 2,
          his_rank: 0,
          like: 4,
          now_rank: 0,
          reply: 1,
          share: 0,
          view: 312
        },
        state: -100,
        tid: 27,
        title: "游戏人生剧场版里克与休比",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28773575,
        attribute: 16512,
        cid: 49854596,
        copyright: 1,
        ctime: 1533657302,
        desc: "第一次剪辑这种视频\\n所以暂且把开头放出来当预告\\n不知道大家感觉怎么样\\n评论区说一下，我在正片里改改\\n争取赶在十号之前给小樱应援L('ω')┘三└('ω')｣\\n\\n视频素材：魔卡少女樱clear篇\\n音乐素材：认真卖萌么么哒--洛天依（作曲：周存JUSF）",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 45,
        dynamic: "#日本场应援2018##动漫##童年#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/f6af35d8b410256680a4f3dec77ffc86a8677e90.jpg",
          mid: 10434225,
          name: "花子君のドーナツ"
        },
        pages: [
          {
            cid: 49854596,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 45,
            from: "vupload",
            page: 1,
            part: "认真卖萌么么哒   2018.8.7",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/79bebca16fcad64fb529c2973c176f3088a02ee2.jpg",
        pubdate: 1533657302,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28773575,
          coin: 10,
          danmaku: 1,
          dislike: 0,
          favorite: 16,
          his_rank: 0,
          like: 56,
          now_rank: 0,
          reply: 16,
          share: 1,
          view: 1468
        },
        state: -100,
        tid: 27,
        title: "【樱狼警告】认真卖萌给你看~=ω=【预告】",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28771695,
        attribute: 16512,
        cid: 49850403,
        copyright: 1,
        ctime: 1533657307,
        desc: "做MAD之前：这首歌好适合士樱啊，做个MAD试试吧\\n为了做MAD去看了HF线生肉后：呜呜呜呜，老虫子你还我樱！qaq\\n【BGM：THERE IS A REASON】\\n顺便求个关注收藏推荐硬币，你们的支持是我最大的动力！",
        dimension: {
          height: 720,
          rotate: 0,
          width: 960
        },
        duration: 295,
        dynamic: "#日本场应援2018##卫宫士郎##间桐樱#我以后再也不拿pr做字幕了.....手都得断掉......",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/1f3d7848eba42e5775235e3bb9d6789133a56674.jpg",
          mid: 272915884,
          name: "藤丸嘉人"
        },
        pages: [
          {
            cid: 49850403,
            dimension: {
              height: 720,
              rotate: 0,
              width: 960
            },
            duration: 295,
            from: "vupload",
            page: 1,
            part: "鈴木このみ - THERE IS A REASON_1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/48874afd663622db93026f5325909b12340947e4.jpg",
        pubdate: 1533657307,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28771695,
          coin: 38,
          danmaku: 3,
          dislike: 0,
          favorite: 45,
          his_rank: 0,
          like: 43,
          now_rank: 0,
          reply: 16,
          share: 14,
          view: 1975
        },
        state: 0,
        tid: 24,
        title: "仅此一人的英雄【fate/HF  MAD/AMV】",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28770849,
        attribute: 16768,
        cid: 49849896,
        copyright: 1,
        ctime: 1533657317,
        desc: "这个和预告系没有任何关系，没看过的被剧透别怪我~~~",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 601,
        dynamic: "#日本场应援2018##AMV##游戏人生##TOS偶像总选举#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/694658b56ad6d747497b7ffb7b2efdad5f4a4623.jpg",
          mid: 3001391,
          name: "NearLight"
        },
        pages: [
          {
            cid: 49849896,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 301,
            from: "vupload",
            page: 1,
            part: "参赛稿",
            vid: "",
            weblink: ""
          },
          {
            cid: 56785862,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 300,
            from: "vupload",
            page: 2,
            part: "工程文件整理",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/2b43cacdfc92b09c6f838fb4df417b688a28d154.jpg",
        pubdate: 1533657317,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28770849,
          coin: 750,
          danmaku: 25,
          dislike: 0,
          favorite: 1102,
          his_rank: 0,
          like: 1672,
          now_rank: 0,
          reply: 108,
          share: 105,
          view: 14257
        },
        state: 0,
        tid: 24,
        title: "【AMV/NGNL/游戏人生ZERO】无命而去 有命而逝",
        tname: "MAD·AMV",
        videos: 2
      },
      {
        aid: 28770700,
        attribute: 16512,
        cid: 49850685,
        copyright: 1,
        ctime: 1533651391,
        desc: "关于胜出上学路上的小故事\\n尝试做了手书，差点累死我这个手残\\n果然还是回去好好学画画吧",
        dimension: {
          height: 576,
          rotate: 0,
          width: 720
        },
        duration: 118,
        dynamic: "#我的英雄学院##手书##胜出#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/d0c5030ab6cf4a7a53eac013fb8522db13033166.jpg",
          mid: 20359495,
          name: "今天惹咔酱生气了吗"
        },
        pages: [
          {
            cid: 49850685,
            dimension: {
              height: 576,
              rotate: 0,
              width: 720
            },
            duration: 118,
            from: "vupload",
            page: 1,
            part: "你的心拍数",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/b6b74f8c4365d9e6364ae95f3b03fa58814d95a0.jpg",
        pubdate: 1533651391,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28770700,
          coin: 8,
          danmaku: 5,
          dislike: 0,
          favorite: 8,
          his_rank: 0,
          like: 43,
          now_rank: 0,
          reply: 4,
          share: 9,
          view: 1215
        },
        state: -100,
        tid: 47,
        title: "{我的英雄学院/胜出/手书} 你的心拍数",
        tname: "短片·手书·配音",
        videos: 1
      },
      {
        aid: 28769993,
        attribute: 1065171,
        cid: 49835843,
        copyright: 1,
        ctime: 1533650863,
        desc: "末尾有信长三连！\\n没纯踩点所以不敢用87k！\\n没错我就是那个欠债的后期！\\n\\nbgm：handclap",
        dimension: {
          height: 576,
          rotate: 0,
          width: 720
        },
        duration: 110,
        dynamic: "#日本场应援2018##FREE!#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/2e6f63afc605959f370db3dfe91c0e5dd69a3a9b.jpg",
          mid: 104557039,
          name: "梓川木由"
        },
        pages: [
          {
            cid: 49835843,
            dimension: {
              height: 576,
              rotate: 0,
              width: 720
            },
            duration: 110,
            from: "vupload",
            page: 1,
            part: "Fitz & the Tantrums - HandClap_1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/301c5a13e052776f333f005f6de16479191635d6.jpg",
        pubdate: 1533650863,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28769993,
          coin: 14,
          danmaku: 9,
          dislike: 0,
          favorite: 9,
          his_rank: 0,
          like: 17,
          now_rank: 0,
          reply: 5,
          share: 8,
          view: 770
        },
        state: 0,
        tid: 24,
        title: "【混剪】不就是想看小哥哥脱衣服么！",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28768955,
        attribute: 16512,
        cid: 49838604,
        copyright: 1,
        ctime: 1533650172,
        desc: "■ 调教 · 混音 · 字幕：梦落遗廊P\\n■ 曲：じん\\n■ 編曲：Nhato\\n■ 映像：しづ\\n \\n● 本家 → sm21720819\\n● 时隔5个月的稿，鸽了这么久请诸位别把我抓去炖汤……\\n● 调教了这首带感曲子来应援阳炎，海选赛只有Konoha通过了，球球你们本战投稿这位小天使一票，让他好歹撑到决赛(´；ω；\`)\\n● 在niconico也有投稿 → sm33640672 \\n● 之前用 IA 翻调的车祸曲 → av20887402",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 217,
        dynamic: "#じん##VOCALOID##阳炎计划#个\\n翻调了界外科学，快来听一听ww",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/ef2b6e770837ed88f1e02a90f289af18a0f4c42e.jpg",
          mid: 111651195,
          name: "Niscet"
        },
        pages: [
          {
            cid: 49838604,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 217,
            from: "vupload",
            page: 1,
            part: "结月缘 · GUMI Ver.",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/5806182a696baba6fe44fb10d36202707528d910.jpg",
        pubdate: 1533650172,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28768955,
          coin: 24,
          danmaku: 72,
          dislike: 0,
          favorite: 43,
          his_rank: 0,
          like: 42,
          now_rank: 0,
          reply: 13,
          share: 12,
          view: 894
        },
        state: 0,
        tid: 30,
        title: "【结月缘 · GUMI】界外科学 / アウターサイエンス【VOCALOID COVER】【原PV付 · 自制中文字幕】【2018B萌应援】",
        tname: "VOCALOID·UTAU",
        videos: 1
      },
      {
        aid: 28767558,
        attribute: 16768,
        cid: 49842496,
        copyright: 1,
        ctime: 1533648380,
        desc: "娱乐至上，大家看的开心就好",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 62,
        dynamic: "求求审核老哥给个面子吧QAQ",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/0dc27beff4d096b67ece41d5213d417f076ec81e.jpg",
          mid: 4328994,
          name: "三木先森不会咕"
        },
        pages: [
          {
            cid: 49842496,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 62,
            from: "vupload",
            page: 1,
            part: "圣经_x264",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/eaa6950d0823447ebc8fea77fbda57d7d645132c.jpg",
        pubdate: 1533648380,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28767558,
          coin: 57,
          danmaku: 7,
          dislike: 0,
          favorite: 13,
          his_rank: 0,
          like: 40,
          now_rank: 0,
          reply: 40,
          share: 19,
          view: 1412
        },
        state: 0,
        tid: 27,
        title: "如果以命运石之门的方式去打开7酱圣经会怎么样",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28766665,
        attribute: 16579,
        cid: 213977771,
        copyright: 1,
        ctime: 1533648458,
        desc: "不希望别人看这个视频啦\\n所以呢就悄悄地换了源！\\n不删掉视频的原因是会扣硬币w\\n\\n原简介：\\n万恶之源：av17699810\\n参考，音频：av20536168",
        dimension: {
          height: 1280,
          rotate: 0,
          width: 590
        },
        duration: 10,
        dynamic: "#日本场应援2018##手书##自制#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/5deb5de649e9d0fc7c3da927e48e1eae74ec8754.jpg",
          mid: 13437131,
          name: "UID_13437131"
        },
        pages: [
          {
            cid: 213977771,
            dimension: {
              height: 1280,
              rotate: 0,
              width: 590
            },
            duration: 10,
            from: "vupload",
            page: 1,
            part: "SVID_20200718_222845_1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/82f16c06497ecffc29b20ee6d5d433dd11c0a799.jpg",
        pubdate: 1533648458,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28766665,
          coin: 587,
          danmaku: 2,
          dislike: 0,
          favorite: 2352,
          his_rank: 0,
          like: 3413,
          now_rank: 0,
          reply: 238,
          share: 122,
          view: 129535
        },
        state: 0,
        tid: 174,
        title: "已删除",
        tname: "其他",
        videos: 1
      },
      {
        aid: 28764554,
        attribute: 16768,
        cid: 49836795,
        copyright: 1,
        ctime: 1533648227,
        desc: "02加油",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 46,
        dynamic: "#日本场应援2018##MAD.AMV##bilibili  moe#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/02478906b35a1ea1ef29eecf8c93548cf47d07c8.jpg",
          mid: 65732857,
          name: "零二的達令"
        },
        pages: [
          {
            cid: 49836795,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 46,
            from: "vupload",
            page: 1,
            part: "[02应援]",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/f173f5886356dc23b4966a6b0a35763db3fe50d6.jpg",
        pubdate: 1533648227,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28764554,
          coin: 26,
          danmaku: 2,
          dislike: 0,
          favorite: 21,
          his_rank: 0,
          like: 47,
          now_rank: 0,
          reply: 13,
          share: 7,
          view: 1048
        },
        state: 0,
        tid: 24,
        title: "[02应援]",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28759375,
        attribute: 2113664,
        cid: 49826852,
        copyright: 1,
        ctime: 1533646967,
        desc: "模型：アストルフォ：すがきれもん\\n场景：im8225803：SNowly\\n动作/镜头：av25782915：浪潮小汐\\n表情：av25782915：閃爍P\\nBGM：恋して♥ポプテピピック（牧野由依、渡部优衣）\\nMME：AutoLuminous4、Diffusion7：そぼろ",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 90,
        dynamic: "#阿斯托尔福##日本场应援2018##FATE#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg",
          mid: 16295316,
          name: "岸波玉藻"
        },
        pages: [
          {
            cid: 49826852,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 90,
            from: "vupload",
            page: 1,
            part: "1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/28235650899fd8313e78e62238340a99c0f4f6bf.jpg",
        pubdate: 1533646967,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28759375,
          coin: 10,
          danmaku: 4,
          dislike: 0,
          favorite: 13,
          his_rank: 0,
          like: 38,
          now_rank: 0,
          reply: 5,
          share: 10,
          view: 815
        },
        state: 0,
        tid: 25,
        title: "【FATE MMD】阿斯托尔福的恋爱吧❤POP TEAM EPIC",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28757836,
        attribute: 16384,
        cid: 49820005,
        copyright: 1,
        ctime: 1533646283,
        desc: "话说对导演下手的“家伙”还是挺多的嘛，如：\\n库洛牌：消牌、冰牌、迷牌、声牌、地牌、无牌等\\n人物：柊泽艾力欧、女占卜师等\\n透明牌-包围、冰雹、幻影等\\n（还有个破坏知世房子的摇动没加进去）",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 196,
        dynamic: "对导演知世动手的片段小剪。#日本场应援2018#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/d6cb50fc26bdd24652a25e0d3571243a9cfa6c14.jpg",
          mid: 23218911,
          name: "花中童"
        },
        pages: [
          {
            cid: 49820005,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 160,
            from: "vupload",
            page: 1,
            part: "正片",
            vid: "",
            weblink: ""
          },
          {
            cid: 50634353,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 36,
            from: "vupload",
            page: 2,
            part: "补续",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/d14c77ad2456cacdd9d3b498eb64e17bb520743d.jpg",
        pubdate: 1533646283,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 0,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28757836,
          coin: 21,
          danmaku: 103,
          dislike: 0,
          favorite: 162,
          his_rank: 0,
          like: 142,
          now_rank: 0,
          reply: 53,
          share: 19,
          view: 11693
        },
        state: 0,
        tid: 27,
        title: "【魔卡少女樱】那些年敢对知世动手的人或牌（不全）",
        tname: "综合",
        videos: 2
      },
      {
        aid: 28757709,
        attribute: 16768,
        cid: 49821087,
        copyright: 1,
        ctime: 1533646295,
        desc: "一个短小的绿谷小天使应援视频...........\\n莺莺燕燕嘤嘤\\n新人UP求关注",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 86,
        dynamic: "#日本场应援2018##我的英雄学院##AMV#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/be45bacc10a0467bc798dac935dd62825dcb06b6.jpg",
          mid: 351853136,
          name: "带肥皂的小纸船"
        },
        pages: [
          {
            cid: 49821087,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 86,
            from: "vupload",
            page: 1,
            part: "绿谷",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/46bb690c9c9cace1c02e6efec8162ed1e955c35e.jpg",
        pubdate: 1533646295,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28757709,
          coin: 17,
          danmaku: 6,
          dislike: 0,
          favorite: 9,
          his_rank: 0,
          like: 32,
          now_rank: 0,
          reply: 20,
          share: 9,
          view: 957
        },
        state: 0,
        tid: 24,
        title: "【小英雄/AMV/泪燃向】承包绿谷小天使(●'◡'●)",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28756456,
        attribute: 16768,
        cid: 49814945,
        copyright: 1,
        ctime: 1533644685,
        desc: "迦尔纳应援视频，各位一定要去为迦尔纳投票啊，他现在的处境很不好。\\n不要三连，只要你们投票。\\n十分感谢。",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 226,
        dynamic: "#日本场应援2018##fate/apocrypha##迦尔纳#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/0057690360800f5120c82b581909725f09a94c14.jpg",
          mid: 76807994,
          name: "ZXSA-solider"
        },
        pages: [
          {
            cid: 49814945,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 226,
            from: "vupload",
            page: 1,
            part: "迦尔纳应援是视频2_01",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/960d6efdab3975e5ba6b13178d9a0a49cbe4f584.jpg",
        pubdate: 1533644685,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28756456,
          coin: 48,
          danmaku: 1,
          dislike: 0,
          favorite: 10,
          his_rank: 0,
          like: 40,
          now_rank: 0,
          reply: 27,
          share: 12,
          view: 904
        },
        state: 0,
        tid: 183,
        title: "【2018 bilbil moe】 迦尔纳应援视频   第二弹",
        tname: "影视剪辑",
        videos: 1
      },
      {
        aid: 28753982,
        attribute: 16512,
        cid: 49813835,
        copyright: 1,
        ctime: 1533643235,
        desc: "这是在下第一次投稿希望不会出什么问题......也许吧。\\n如果问题太多我就重做一次吧。",
        dimension: {
          height: 576,
          rotate: 0,
          width: 720
        },
        duration: 238,
        dynamic: "#日本场应援2018##FGO##FATE#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/6273def76c5d6a9cc61b4465a23cfaaeb6f5888b.jpg",
          mid: 28036674,
          name: "言峰明"
        },
        pages: [
          {
            cid: 49813835,
            dimension: {
              height: 576,
              rotate: 0,
              width: 720
            },
            duration: 238,
            from: "vupload",
            page: 1,
            part: "fgo原创卡片视频系列-阿尔泰尔",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/e969f49f4e218e6c18b5d39eb6d80147509a6d55.jpg",
        pubdate: 1533643235,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28753982,
          coin: 24,
          danmaku: 5,
          dislike: 0,
          favorite: 5,
          his_rank: 0,
          like: 23,
          now_rank: 0,
          reply: 17,
          share: 8,
          view: 857
        },
        state: -100,
        tid: 172,
        title: "fgo原创卡片视频系列-阿尔泰尔",
        tname: "手机游戏",
        videos: 1
      },
      {
        aid: 28750045,
        attribute: 16512,
        cid: 49858754,
        copyright: 1,
        ctime: 1533630352,
        desc: "视频类型: 动画\\r\\n动漫中那些毁天灭地的炫酷大招",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 890,
        dynamic: "#动漫##动画##热血#",
        owner: {
          face: "http://i0.hdslb.com/bfs/face/607efa42b42d23a32433f524d452d3ab36a6cdd2.jpg",
          mid: 7360144,
          name: "十柒号"
        },
        pages: [
          {
            cid: 49858754,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 890,
            from: "vupload",
            page: 1,
            part: "动漫中那些毁天灭地的炫酷大招",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/6583dc0f9c786eb7386f808771437b236732a589.png",
        pubdate: 1533657312,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28750045,
          coin: 359,
          danmaku: 1784,
          dislike: 0,
          favorite: 1235,
          his_rank: 0,
          like: 1057,
          now_rank: 0,
          reply: 403,
          share: 88,
          view: 138104
        },
        state: 0,
        tid: 27,
        title: "动漫中那些毁天灭地的炫酷大招",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28749274,
        attribute: 16512,
        cid: 49803783,
        copyright: 1,
        ctime: 1533639413,
        desc: "一个潦草的自制手书233333有描绘，原作Takadabear",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 63,
        dynamic: "#日本场应援2018##卫宫切嗣##卫宫士郎#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/57dd2529a51790824a6fb3e0fa3778b424cd7cab.jpg",
          mid: 524252,
          name: "笑揉橘猫不语"
        },
        pages: [
          {
            cid: 49803783,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 63,
            from: "vupload",
            page: 1,
            part: "卫宫 搓腚舞",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/1a15f0b0220690a8d0b8e09a6cdda1fbe7011123.jpg",
        pubdate: 1533639413,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28749274,
          coin: 79,
          danmaku: 33,
          dislike: 0,
          favorite: 89,
          his_rank: 0,
          like: 107,
          now_rank: 0,
          reply: 48,
          share: 31,
          view: 2578
        },
        state: 0,
        tid: 47,
        title: "【卫宫家的搓屁舞】孩子不听话怎么办",
        tname: "短片·手书·配音",
        videos: 1
      },
      {
        aid: 28748902,
        attribute: 2113664,
        cid: 49803395,
        copyright: 1,
        ctime: 1533639596,
        desc: "模型：天草四郎時貞：sema／カルナ：ユタカ／シェイクスピア：履物連絡用（準備中）\\n背景：sm15356644：kiyo_NoN\\n动作/镜头：sm24491916：にもゆに\\nBGM：EVERYBODY（Backstreet Boys）\\nMME：Diffusion7：そぼろ",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 231,
        dynamic: "#日本场应援2018##FATE##EVERYBODY#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg",
          mid: 16295316,
          name: "岸波玉藻"
        },
        pages: [
          {
            cid: 49803395,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 231,
            from: "vupload",
            page: 1,
            part: "3",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/59e215ed79cc0814a36c0ed815b633e28c6ed1f7.jpg",
        pubdate: 1533639596,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28748902,
          coin: 13,
          danmaku: 0,
          dislike: 0,
          favorite: 7,
          his_rank: 0,
          like: 29,
          now_rank: 0,
          reply: 5,
          share: 7,
          view: 636
        },
        state: 0,
        tid: 25,
        title: "【FATE MMD】EVERYBODY【天草四郎&迦尔纳&莎士比亚】",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28745414,
        attribute: 16512,
        cid: 49795470,
        copyright: 1,
        ctime: 1533634290,
        desc: "喜欢就点个赞吧 谢谢大家！\\nbgm: 菅田将晖《ロングホープ・フィリア》",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 86,
        dynamic: "#动漫##剪辑##我的英雄学院#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/96a64c7bbf85efa5453cbb5751b471e61265c394.jpg",
          mid: 12423973,
          name: "拉二的小太阳"
        },
        pages: [
          {
            cid: 49795470,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 86,
            from: "vupload",
            page: 1,
            part: "切爆",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/136403e510faead254816acfd76ba6d5f5a6ce38.jpg",
        pubdate: 1533634290,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28745414,
          coin: 831,
          danmaku: 225,
          dislike: 0,
          favorite: 2334,
          his_rank: 0,
          like: 2236,
          now_rank: 0,
          reply: 341,
          share: 263,
          view: 72678
        },
        state: 0,
        tid: 27,
        title: "【我英】（切爆）鸡窝头，你老是垂头丧气，我都不舒服了！（谢谢你切岛）",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28744228,
        attribute: 16512,
        cid: 49793945,
        copyright: 1,
        ctime: 1533633433,
        desc: "第一次尝试着做视频，对pr还不是很了解，\\n但对于金木。（尽力了）\\n做视频不敢有任何懈怠，大家好，新人up猪\\n我来啦,希望各位大佬wu喷\\nBGM：Angel    saybia\\n           透明で透き通って何でも成れそうで    haku",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 367,
        dynamic: "#剪辑##东京喰种##金木#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/220f925eafda0466421f1395a52ddad47dfc07a7.jpg",
          mid: 288141009,
          name: "-时鸣涧-"
        },
        pages: [
          {
            cid: 49793945,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 367,
            from: "vupload",
            page: 1,
            part: "金木研：  我，从未后悔",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/768d50b95d27d6cab7c9be696cd3a23a640799df.jpg",
        pubdate: 1533633433,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28744228,
          coin: 46,
          danmaku: 90,
          dislike: 0,
          favorite: 204,
          his_rank: 0,
          like: 212,
          now_rank: 0,
          reply: 87,
          share: 28,
          view: 13225
        },
        state: 0,
        tid: 183,
        title: "金木研：  我，从未后悔",
        tname: "影视剪辑",
        videos: 1
      },
      {
        aid: 28743188,
        attribute: 2113664,
        cid: 49793120,
        copyright: 1,
        ctime: 1533632587,
        desc: "模型：ロビン・フッド：切な顔P\\n场景：im4179284：切な顔P\\n动作：sm29180863：yurie\\n镜头：sm29298856：一護牛乳\\nBGM：av5451565：云潇翼Seanwing\\nMME：Diffusion7：そぼろ",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 221,
        dynamic: "#FATE##日本场应援2018##罗宾汉#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg",
          mid: 16295316,
          name: "岸波玉藻"
        },
        pages: [
          {
            cid: 49793120,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 221,
            from: "vupload",
            page: 1,
            part: "2",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/84dabeaa9b7d5d127c98f8121b0d46f241287767.jpg",
        pubdate: 1533632587,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28743188,
          coin: 2,
          danmaku: 0,
          dislike: 0,
          favorite: 7,
          his_rank: 0,
          like: 23,
          now_rank: 0,
          reply: 6,
          share: 2,
          view: 124
        },
        state: -100,
        tid: 25,
        title: "【FATE MMD】罗宾汉的极乐净土",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28741550,
        attribute: 16768,
        cid: 49789622,
        copyright: 1,
        ctime: 1533630391,
        desc: "BGM：Désir——《fate/apocrypha》ED1\\n新人up摸鱼出来的第二个视频\\n前面一段偷懒了还望谅解（还有一小段用过两次\\n喜欢的话就请关注投币推荐收藏一条龙吧=v=",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 278,
        dynamic: "#日本场应援2018##间桐樱##卫宫士郎##远坂凛##燃向#终于弄好了哇QAQ",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/016fb61758a8697378703853f075e5ffd96dfc80.jpg",
          mid: 74156490,
          name: "极と墨"
        },
        pages: [
          {
            cid: 49789622,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 278,
            from: "vupload",
            page: 1,
            part: "樱应援(2)",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/48b2c32d85521f0074ff8a34385811b8e0c59399.jpg",
        pubdate: 1533630391,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28741550,
          coin: 431,
          danmaku: 75,
          dislike: 0,
          favorite: 776,
          his_rank: 0,
          like: 466,
          now_rank: 0,
          reply: 92,
          share: 58,
          view: 17369
        },
        state: 0,
        tid: 24,
        title: "【FATE/fgo】正义之所在",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28740360,
        attribute: 16512,
        cid: 49786602,
        copyright: 1,
        ctime: 1533629143,
        desc: "首先，感谢网易云用户：saberycr他在网易云投稿的游戏人生mad非常棒！给了我很大的灵感，大家可以去看看。\\n新人渣作，喜欢的话就点个赞也是好的，谢谢！",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 368,
        dynamic: "#日本场应援2018##AMV##MAD#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/fd9cf396df8779b55a84f8793a668f028f37608d.jpg",
          mid: 107142392,
          name: "清居wl"
        },
        pages: [
          {
            cid: 49786602,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 368,
            from: "vupload",
            page: 1,
            part: "【MAD·AMV游戏人生zero】休比，下辈子再做我的妻子好吗？",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/e41e625d36b235e1fd55bbf479b550d6b93190e0.jpg",
        pubdate: 1533629142,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28740360,
          coin: 19,
          danmaku: 5,
          dislike: 0,
          favorite: 12,
          his_rank: 0,
          like: 26,
          now_rank: 0,
          reply: 15,
          share: 12,
          view: 575
        },
        state: 0,
        tid: 24,
        title: "【MAD·AMV游戏人生zero】休比，下辈子再做我的妻子好吗？",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28739521,
        attribute: 16512,
        cid: 49782315,
        copyright: 1,
        ctime: 1533629243,
        desc: "大家好我死回来啦.........!\\n学会了录屏和一点点简单的剪辑超开心!!!\\n炫耀一下vqv。\\n大家今天一定要给茶茶投票鸭!!!!!!!!!!!!!\\n\\nbgm:\\n無邪気な冒険心——Goose house\\n3/4——Goose house\\n18歲——Goose house",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 799,
        dynamic: "#绘画过程##板绘##上色#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/8901e94eb89768277f88f3e5e021b28f0202bdb5.jpg",
          mid: 12469873,
          name: "嗨呀个嘿"
        },
        pages: [
          {
            cid: 49782315,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 799,
            from: "vupload",
            page: 1,
            part: "20180806_172718.mp4",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/428deb75735cab3e32cfd6af4a7e15dc62564ff6.jpg",
        pubdate: 1533629243,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28739521,
          coin: 15,
          danmaku: 0,
          dislike: 0,
          favorite: 5,
          his_rank: 0,
          like: 13,
          now_rank: 0,
          reply: 15,
          share: 11,
          view: 417
        },
        state: -100,
        tid: 162,
        title: "【一个过程】简陋的画了一个茶茶",
        tname: "绘画",
        videos: 1
      },
      {
        aid: 28738449,
        attribute: 16512,
        cid: 49783840,
        copyright: 1,
        ctime: 1533628244,
        desc: "休息了2周 再次回来做视频了\\nBGM:一刀缭乱-六花\\n希望大家喜欢 也希望fate在萌战里获得好成绩 也希望大家鬼岛活动加油！",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 200,
        dynamic: "#日本场应援2018##AMV##FATE#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/ff34db61ca71de81684ea0ae9b708e5ee68cd342.jpg",
          mid: 3294538,
          name: "月无挽风"
        },
        pages: [
          {
            cid: 49783840,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 200,
            from: "vupload",
            page: 1,
            part: "六花 - 一刀繚乱",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/dac96f76cc81fe4205fc29fb37f3d52178c73a87.jpg",
        pubdate: 1533628244,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28738449,
          coin: 162,
          danmaku: 23,
          dislike: 0,
          favorite: 223,
          his_rank: 0,
          like: 174,
          now_rank: 0,
          reply: 33,
          share: 48,
          view: 5548
        },
        state: 0,
        tid: 24,
        title: "【FGO/AMV】为御主献上 如雷鸣般的喝彩！",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28738418,
        attribute: 16512,
        cid: 49800159,
        copyright: 1,
        ctime: 1533623268,
        desc: "应援视频。\\n对不起来晚了，如果这样就能让故事停留在P1就好了。\\n（虽然我觉得P2很好）\\n希望休比和助手都能拿个好名次~",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 696,
        dynamic: "#日本场应援2018##NO GAME NO LIFE##游戏人生#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/20fbb85c51b1cfcfc24372d5e06068addaf6f8a0.jpg",
          mid: 4313856,
          name: "年度枫"
        },
        pages: [
          {
            cid: 49800159,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 135,
            from: "vupload",
            page: 1,
            part: "游戏人生zero-休比（原音频）",
            vid: "",
            weblink: ""
          },
          {
            cid: 49800172,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 561,
            from: "vupload",
            page: 2,
            part: "如果没有P2就好了（配乐版）",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/ff2227531a7dcc0eaef3c22e73c34733689fec45.jpg",
        pubdate: 1533634230,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28738418,
          coin: 22,
          danmaku: 10,
          dislike: 0,
          favorite: 19,
          his_rank: 0,
          like: 26,
          now_rank: 0,
          reply: 13,
          share: 10,
          view: 1278
        },
        state: 0,
        tid: 27,
        title: "【游戏人生zero】休比应援：这场游戏是休比赢了",
        tname: "综合",
        videos: 2
      },
      {
        aid: 28736888,
        attribute: 2113664,
        cid: 49781520,
        copyright: 1,
        ctime: 1533621539,
        desc: "模型：エミヤ：ちょビ玉\\n场景：im8147346：鯖缶359\\n动作：sm24923974：遊風稜\\n口型：sm32918418：しわこ\\n镜头：sm26631976：足屋ｺｰﾋｰ\\nMME：Diffusion7：そぼろ\\nBGM：Beat It（Michael Jackson）",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 218,
        dynamic: "#FATE##日本场应援2018##卫宫#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg",
          mid: 16295316,
          name: "岸波玉藻"
        },
        pages: [
          {
            cid: 49781520,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 218,
            from: "vupload",
            page: 1,
            part: "1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/10338319f5125dfb9b793795a0fd02241dfc52fc.jpg",
        pubdate: 1533621539,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28736888,
          coin: 0,
          danmaku: 1,
          dislike: 0,
          favorite: 7,
          his_rank: 0,
          like: 27,
          now_rank: 0,
          reply: 3,
          share: 10,
          view: 475
        },
        state: 0,
        tid: 25,
        title: "【FATE MMD】卫宫的Beat it",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28734732,
        attribute: 16768,
        cid: 49769513,
        copyright: 1,
        ctime: 1533622564,
        desc: "第三期预告（水视频）\\n我怀疑我们能不能继续了（失望）赞好少，感觉大家不是很喜欢我这个系列\\n真的如果收藏没有达到200我们打算做其他简单的了",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 264,
        dynamic: "#日本场应援2018##魔法少女伊莉雅##阿库娅#我才不是什么智障，我是魔法女神！发起火来连自己都打！",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/a12473cd675c85d35ca62ebb16ee8788f924512e.jpg",
          mid: 104934805,
          name: "小千藤"
        },
        pages: [
          {
            cid: 49769513,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 264,
            from: "vupload",
            page: 1,
            part: "第三期魔法少女",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/6d4d6dc5044c32ba3fa8e155abb89d71438c3904.jpg",
        pubdate: 1533622564,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28734732,
          coin: 272,
          danmaku: 91,
          dislike: 0,
          favorite: 151,
          his_rank: 0,
          like: 588,
          now_rank: 0,
          reply: 145,
          share: 48,
          view: 9016
        },
        state: -100,
        tid: 24,
        title: "【AMV/误解】我才不是智障！我是魔法少女~",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28734092,
        attribute: 16512,
        cid: 49775961,
        copyright: 1,
        ctime: 1533620802,
        desc: "因为第一次传失误了所以删除了...对此感到抱歉...\\n明天的帮派火拼请各位务必投zero two一票\\nBGM：い〜やい〜やい〜や（算了~算了~算了~）",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 199,
        dynamic: "#日本场应援2018##DARLINGINTHEFRANX##国家队#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/b17b1cfde77da1bb362f962e639852b853679a56.jpg",
          mid: 33916569,
          name: "熊屋_"
        },
        pages: [
          {
            cid: 49775961,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 199,
            from: "vupload",
            page: 1,
            part: "4 (2)",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/ee255addecc8c1f9c61bb854b96dc2d6d45c606c.jpg",
        pubdate: 1533620802,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28734092,
          coin: 12,
          danmaku: 1,
          dislike: 0,
          favorite: 19,
          his_rank: 0,
          like: 32,
          now_rank: 0,
          reply: 7,
          share: 1,
          view: 874
        },
        state: -100,
        tid: 24,
        title: "[Darling in the Franxx]因为我们13部队是一家人啊",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28729478,
        attribute: 16512,
        cid: 49766687,
        copyright: 1,
        ctime: 1533614675,
        desc: "bgm:彼女は旅に出る\\n我的英雄学院实在是，太太太太太太太太好看了！！！！吹爆我英！！！真的具TM好看，我永远爱着绿谷小天使/咔酱/轰总/茶爷/欧叔/渡我/...(省略)，真的，我英真的很棒，b萌轰总下一场和小天使对，自己人打自己人，咔酱对闪闪，简直死亡分组）\\nqaq手书里的绿毛是up我了，刚开始因为画风，然后一直没看，我朋友安利过我很多次了，后面是没东西看了，然后去看我英，然后 出不来了！！\\n此生无悔入我英，祝小伙伴们食用愉快【比心】",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 205,
        dynamic: "#我的英雄学院##手书##all出#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/a42c2ed64c15f8f782597a6a2d8dfc14064c8539.jpg",
          mid: 8882876,
          name: "七月萤兮"
        },
        pages: [
          {
            cid: 49766687,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 205,
            from: "vupload",
            page: 1,
            part: "Pixgram_2018-08-06-05-51-39",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/78ea20ba7fa688185ef8def45bd6b27ba142a1aa.jpg",
        pubdate: 1533614675,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28729478,
          coin: 33,
          danmaku: 33,
          dislike: 0,
          favorite: 30,
          his_rank: 0,
          like: 43,
          now_rank: 0,
          reply: 42,
          share: 12,
          view: 807
        },
        state: -100,
        tid: 47,
        title: "【七月萤兮/我的英雄学院手书】我的小英雄",
        tname: "短片·手书·配音",
        videos: 1
      },
      {
        aid: 28729392,
        attribute: 16512,
        cid: 49765760,
        copyright: 1,
        ctime: 1533614699,
        desc: "bgm：Re：rain",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1434
        },
        duration: 290,
        dynamic: "#日本场应援2018##恋爱##我的青春恋爱物语果然有问题#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/18ca4971240d76810158623d7c75240e675f4874.jpg",
          mid: 31451891,
          name: "骑士王SABER233"
        },
        pages: [
          {
            cid: 49765760,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1434
            },
            duration: 290,
            from: "vupload",
            page: 1,
            part: "我的青春恋爱物语果然有问题 (1)",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/7b8058ac794060dbefac6e00256185bea88dcf7a.jpg",
        pubdate: 1533614699,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28729392,
          coin: 6,
          danmaku: 6,
          dislike: 0,
          favorite: 14,
          his_rank: 0,
          like: 21,
          now_rank: 0,
          reply: 13,
          share: 7,
          view: 1101
        },
        state: 0,
        tid: 24,
        title: "【我的青春恋爱物语果然有问题】那个房间依旧演绎着永不终结的日常",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28728563,
        attribute: 16512,
        cid: 49764773,
        copyright: 1,
        ctime: 1533613174,
        desc: "ooc警告！！！！！！！！！！\\n开头声音不知道为什么爆炸了，小心啊（虽然我觉得没人看简介）\\n本家手书：sm7598520\\n是半成品（但是不会画完，因为懒）\\n作品是闪恩向向，伊斯塔凛厨慎入",
        dimension: {
          height: 704,
          rotate: 0,
          width: 1280
        },
        duration: 81,
        dynamic: "#日本场应援2018##bilibili moe#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/b8c804b83b724a75dbd695114b8e94fa0fd5c8b6.jpg",
          mid: 5246707,
          name: "鸦青夙"
        },
        pages: [
          {
            cid: 49764773,
            dimension: {
              height: 704,
              rotate: 0,
              width: 1280
            },
            duration: 81,
            from: "vupload",
            page: 1,
            part: "bandicam 2018-08-07 10-52-36-456",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/7a09ba0de0d85a3062aac90740382b6d96b24cac.jpg",
        pubdate: 1533646608,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28728563,
          coin: 88,
          danmaku: 38,
          dislike: 0,
          favorite: 101,
          his_rank: 0,
          like: 149,
          now_rank: 0,
          reply: 50,
          share: 27,
          view: 4009
        },
        state: -100,
        tid: 47,
        title: "【描绘】那什么的吉尔伽美什",
        tname: "短片·手书·配音",
        videos: 1
      },
      {
        aid: 28728539,
        attribute: 16768,
        cid: 49763239,
        copyright: 1,
        ctime: 1533613312,
        desc: "原图作者：@micsu3_3   \\n一时兴起录的勾线视频 \\n因为我就是被这张图拉入闪恩 就当给闪闪应援了\\nBGM发在弹幕里   \\n作者大大只在图里做了签名 但是微博p站都找不到了\\n有人知道求发我一下",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 901,
        dynamic: "#日本场应援2018##手绘##板绘#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/b0129594cbf7b0472760055e06619ff38ca5bd82.jpg",
          mid: 101222463,
          name: "-吾生-"
        },
        pages: [
          {
            cid: 49763239,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 901,
            from: "vupload",
            page: 1,
            part: "金闪闪小恩",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/71b0f51ca97edab7f09ebe06d0a6d8df68968022.jpg",
        pubdate: 1533613312,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28728539,
          coin: 65,
          danmaku: 32,
          dislike: 0,
          favorite: 38,
          his_rank: 0,
          like: 48,
          now_rank: 0,
          reply: 25,
          share: 9,
          view: 1705
        },
        state: -100,
        tid: 162,
        title: "(封面勾线）闪恩 超舒服的勾线教程 金闪闪应援  原图@micsu3_3",
        tname: "绘画",
        videos: 1
      },
      {
        aid: 28726197,
        attribute: 16768,
        cid: 49760343,
        copyright: 1,
        ctime: 1533610523,
        desc: "素材 DARLING in the FRANXX\\nBGM lie 三无MarBlue\\n02应援 希望大家多多支持02",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 177,
        dynamic: "#日本场应援2018##02##剪辑#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/9584df17eab3fa95f602a0f786c30fa40848aedd.jpg",
          mid: 180306090,
          name: "黑火saki"
        },
        pages: [
          {
            cid: 49760343,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 177,
            from: "vupload",
            page: 1,
            part: "催泪 02应援 DARLING in the FRANXX BGM超燃",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/28862cff8571c64f8b1c366da7cfb2214cb0e8de.jpg",
        pubdate: 1533610523,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28726197,
          coin: 45,
          danmaku: 1,
          dislike: 0,
          favorite: 32,
          his_rank: 0,
          like: 53,
          now_rank: 0,
          reply: 23,
          share: 10,
          view: 1279
        },
        state: 0,
        tid: 183,
        title: "催泪 02应援 DARLING in the FRANXX BGM超燃",
        tname: "影视剪辑",
        videos: 1
      },
      {
        aid: 28724349,
        attribute: 16768,
        cid: 49753999,
        copyright: 1,
        ctime: 1533609970,
        desc: "为02和广主席疯狂打call！\\n封面pixiv画师：星晓吻",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 235,
        dynamic: "#AMV##MAD##新人向#国家队虽然瑕疵挺多，但这不妨它成为今年上半年给我留下印象最深的日本动画。",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/0a735c9ff4fe87d7c0f205a832e59cc59a902694.jpg",
          mid: 8189036,
          name: "幻化涅槃"
        },
        pages: [
          {
            cid: 49753999,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 235,
            from: "vupload",
            page: 1,
            part: "比翼齐飞，终不悔",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/54587be6c0441b911ffa551666efe6e2c21c7ce3.jpg",
        pubdate: 1533609970,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28724349,
          coin: 69,
          danmaku: 12,
          dislike: 0,
          favorite: 67,
          his_rank: 0,
          like: 87,
          now_rank: 0,
          reply: 25,
          share: 22,
          view: 1690
        },
        state: 0,
        tid: 24,
        title: "【02广应援/燃】比翼齐飞，终不悔",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28721456,
        attribute: 16768,
        cid: 49750661,
        copyright: 1,
        ctime: 1533607334,
        desc: "这次画了一个知世，我知道我画残了，完全没有知世小姐姐的那种气质TAT…………cm我也不画了，想不出来。（尾巴我居然忘了…………TAT）我也希望本战大家能多投给这善解人意，为他人着想，又是神助攻的知世几票，我不希望她就此止步于32强~以及，不喜勿喷。",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 238,
        dynamic: "#日本场应援2018##我的小马驹##动画#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/ab1bf911a50086c21707f0f558908c1adda0f8ac.jpg",
          mid: 71304403,
          name: "暮临呀"
        },
        pages: [
          {
            cid: 49750661,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 238,
            from: "vupload",
            page: 1,
            part: "知世拟马",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/7435ec40e0b513949546a93c15661df3dea27f94.jpg",
        pubdate: 1533607334,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28721456,
          coin: 4,
          danmaku: 0,
          dislike: 0,
          favorite: 3,
          his_rank: 0,
          like: 2,
          now_rank: 0,
          reply: 19,
          share: 5,
          view: 322
        },
        state: 0,
        tid: 27,
        title: "[mlp速绘]知世拟马",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28719317,
        attribute: 2113664,
        cid: 49746204,
        copyright: 1,
        ctime: 1533603953,
        desc: "借物表：\\nmodel:Kei\\nmotion:srs\\ncamera:aokana\\nstage:hazi，溯北，怪獣対若大将P，kotami，RedialC\\nmme:角砂糖，下っ腹P，XDOF，Diffusion7，SSAO\\nmusic:無情",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 212,
        dynamic: "#舞蹈MMD##日本场应援2018##新人#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/6061182c896d07597978ff34862d690652f29cf4.jpg",
          mid: 348898917,
          name: "ex陌书"
        },
        pages: [
          {
            cid: 49746204,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 212,
            from: "vupload",
            page: 1,
            part: "無情",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/95039a13d98c56f3281791f33c7b19c6351df1fb.jpg",
        pubdate: 1533603953,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28719317,
          coin: 4,
          danmaku: 1,
          dislike: 0,
          favorite: 53,
          his_rank: 0,
          like: 19,
          now_rank: 0,
          reply: 9,
          share: 10,
          view: 665
        },
        state: 0,
        tid: 25,
        title: "【刀剑乱舞MMD】無情--来自kei咪",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28718973,
        attribute: 16512,
        cid: 49751276,
        copyright: 1,
        ctime: 1533606982,
        desc: "主要内容为管家助理艾克雷亚·艾克雷尔·艾伊克雷亚\\nBGM：ほぼ日P - 家に帰ると妻が必ず死んだふりをしています\\n欢迎加入UP的粉丝群：237213911",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 163,
        dynamic: "#不死者之王##骨傲天##Overlord##新星计划#\\n主要内容为管家助理艾克雷亚·艾克雷尔·艾伊克雷亚\\nBGM：ほぼ日P - 家に帰ると妻が必ず死んだふりをしています\\n欢迎加入UP的粉丝群：237213911",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/a4cbc140157251afb969023ada66e6d7b084bf6e.jpg",
          mid: 4021955,
          name: "红莲妖"
        },
        pages: [
          {
            cid: 49751276,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 163,
            from: "vupload",
            page: 1,
            part: "助理_1",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/dbec0f5b79c77003b9f2065ab5806b1f662d7f06.jpg",
        pubdate: 1533606982,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28718973,
          coin: 37,
          danmaku: 15,
          dislike: 0,
          favorite: 14,
          his_rank: 0,
          like: 85,
          now_rank: 0,
          reply: 38,
          share: 7,
          view: 6447
        },
        state: 0,
        tid: 27,
        title: "【瞎考剧】Overlord：艾克雷亚·艾克雷尔·艾伊克雷亚",
        tname: "综合",
        videos: 1
      },
      {
        aid: 28718963,
        attribute: 16512,
        cid: 49851722,
        copyright: 1,
        ctime: 1533607036,
        desc: "又一个积压了一个多月的视频，花了两天时间憋出来。\\n（才刚用pr的新人啥也不会）\\n很遗憾爱酱的B萌已经落幕了\\n但他的留下反叛精神与钢铁的意志永远不会消失\\n献给伟大的起义领袖，斯巴达克斯\\n（中间部分已3倍速快进，需要也可跳至25:35继续食用）",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 1846,
        dynamic: "#Fate/Grand Order##国服##实况##斯巴达克斯#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/584f66e6583416ef5117910c32fcb5ef26df0e5c.jpg",
          mid: 9366744,
          name: "Actinides"
        },
        pages: [
          {
            cid: 49851722,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 1846,
            from: "vupload",
            page: 1,
            part: "序列 01",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/fb8b9580a2039ca2bb56efcc0315fd911801f27e.jpg",
        pubdate: 1533619025,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28718963,
          coin: 6,
          danmaku: 5,
          dislike: 0,
          favorite: 6,
          his_rank: 0,
          like: 9,
          now_rank: 0,
          reply: 7,
          share: 8,
          view: 822
        },
        state: 0,
        tid: 172,
        title: "我的爱终将毁灭一切压迫！斯巴达克斯主手vs魔性菩萨",
        tname: "手机游戏",
        videos: 1
      },
      {
        aid: 28714933,
        attribute: 16768,
        cid: 78023888,
        copyright: 1,
        ctime: 1533603974,
        desc: "bgm:lemon\\n稍微小改了一下,虽然感觉还有点问题,但之后也没有大改的打算了",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 269,
        dynamic: "#日本场应援2018##命运石之门##石头门#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/b77b86be883edc9e028148d4dbbe30e25f2e8682.jpg",
          mid: 12787286,
          name: "羽室233"
        },
        pages: [
          {
            cid: 78023888,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 269,
            from: "vupload",
            page: 1,
            part: "试下直接删旧源换源0.0",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/fa7894144ea6aa79df078be2b9a427346c569237.jpg",
        pubdate: 1533603974,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28714933,
          coin: 51,
          danmaku: 2,
          dislike: 0,
          favorite: 24,
          his_rank: 0,
          like: 35,
          now_rank: 0,
          reply: 24,
          share: 14,
          view: 1094
        },
        state: 0,
        tid: 24,
        title: "【命运石之门】误入α线——你待在这里，只不过是在梦境中罢了",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28714440,
        attribute: 2113920,
        cid: 49737324,
        copyright: 1,
        ctime: 1533603986,
        desc: "高三那年看了游戏人生zero，过了很久才释然...\\n“我其实不想给任何人的...喜欢里克的心情，不想和他分开的心情，毕竟很害羞啊！从里克那得到的多到数不清的系统错误，这些都是只属于休比自己的东西，现在要把这些交给你们，这意味着什么？你们给我明白啊！笨蛋！别在那啰里啰唆！给我把这份思念继承下去啊！\\n给我把应援票投给休比啊！w\\n给我把关注和硬币投up主啊！（误）“\\n休比，祝你终有一天能与自己重要的人重逢.\\n\\n封面截自BD  0：55：56\\nbgm：befall（崩三女王降临印象曲）",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 235,
        dynamic: "#日本场应援2018##新星计划##游戏人生zero#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/0e0c4b99b95726bf34c62122effa08c4e1e36e11.jpg",
          mid: 35578381,
          name: "阴久晴"
        },
        pages: [
          {
            cid: 49737324,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 235,
            from: "vupload",
            page: 1,
            part: "游戏人生",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/527eb42364d323d9c171be6cce97178c7b140656.jpg",
        pubdate: 1533616201,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28714440,
          coin: 70,
          danmaku: 9,
          dislike: 0,
          favorite: 39,
          his_rank: 0,
          like: 72,
          now_rank: 0,
          reply: 17,
          share: 11,
          view: 967
        },
        state: 1,
        tid: 24,
        title: "【游戏人生/休比应援】当给休比配上崩三的bgm，悲剧是否能够改变",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28714349,
        attribute: 16512,
        cid: 49738002,
        copyright: 1,
        ctime: 1533603990,
        desc: "第一次剪视频，完全用爱发电爆肝赶在凛凛本战的时候做完，做得不好的地方还请大家包容啦。\\n他们俩真好嘤嘤嘤，凛凛、哈鲁冲鸭！\\n事先声明，里面混有玻璃渣，但结局绝对是甜的！绝对！！",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 306,
        dynamic: "#日本场应援2018##凛遥##Free！#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/7c8e6063dbcbe34411c761c1645038e49f19a5cf.jpg",
          mid: 4902600,
          name: "浮声"
        },
        pages: [
          {
            cid: 49738002,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 306,
            from: "vupload",
            page: 1,
            part: "free",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/df18b2ffe096c285a8b6f1953cd75a5429ee6de7.jpg",
        pubdate: 1533603990,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28714349,
          coin: 177,
          danmaku: 70,
          dislike: 0,
          favorite: 214,
          his_rank: 0,
          like: 173,
          now_rank: 0,
          reply: 84,
          share: 29,
          view: 2883
        },
        state: 0,
        tid: 24,
        title: "【Free!凛遥】【愛してるのに、愛せない】爱着你、却无法爱你",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28712030,
        attribute: 16768,
        cid: 49732205,
        copyright: 1,
        ctime: 1533604e3,
        desc: "永不放弃努力前行 是想抓住梦想的翅膀\\n时至今日 想要传达的心愿无法按捺 在心中迸发\\n动摇的心或有迷茫 即使如此也要向前\\n相信会有风停雨散\\n向着明天前行  得以遇见Sunshine!\\n昂首便是万里晴空",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 282,
        dynamic: "#日本场应援2018##MAD.AMV##MAD##Aqours##lovelive#\\n永不放弃努力前行 是想抓住梦想的翅膀\\n时至今日 想要传达的心愿无法按捺 在心中迸发\\n动摇的心或有迷茫 即使如此也要向前\\n相信会有风停雨散\\n向着明天前行  得以遇见Sunshine!\\n昂首便是万里晴空",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/0630cf1774548a15fe62fe93de01f76f91232dbb.jpg",
          mid: 177444763,
          name: "希大0723"
        },
        pages: [
          {
            cid: 49732205,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 282,
            from: "vupload",
            page: 1,
            part: "序列 01",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/edccc6da7934da5cf39e095bedbcbffc8f1f66ba.jpg",
        pubdate: 1533604e3,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28712030,
          coin: 27,
          danmaku: 2,
          dislike: 0,
          favorite: 11,
          his_rank: 0,
          like: 19,
          now_rank: 0,
          reply: 5,
          share: 2,
          view: 787
        },
        state: -4,
        tid: 24,
        title: "【Aqours BD7纪念】キセキヒカル 奇迹闪耀",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28711339,
        attribute: 16768,
        cid: 49733160,
        copyright: 1,
        ctime: 1533584227,
        desc: "士郎加油，喜欢的话推荐收藏一下哦!",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 255,
        dynamic: "#日本场应援2018##卫宫士郎##AMV#",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/78527264bbbb4c1370ffb1c57c999c3984323dd6.jpg",
          mid: 66862188,
          name: "伊卡伊卡w"
        },
        pages: [
          {
            cid: 49733160,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 255,
            from: "vupload",
            page: 1,
            part: "【AMV·卫宫士郎应援】“输给谁都可以，但是，决不能输给自己!”",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/ead76899d19cdbe371b1a646c13a8ec850e89040.jpg",
        pubdate: 1533584227,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28711339,
          coin: 25,
          danmaku: 9,
          dislike: 0,
          favorite: 46,
          his_rank: 0,
          like: 56,
          now_rank: 0,
          reply: 19,
          share: 16,
          view: 2037
        },
        state: 0,
        tid: 24,
        title: "【AMV·卫宫士郎应援】“输给谁都可以，但是，决不能输给自己!”",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28710374,
        attribute: 16512,
        cid: 49727323,
        copyright: 1,
        ctime: 1533604007,
        desc: "尝试去讲一个机器人少女拥有心的故事，于是选用了镜音的这首歌曲，同时和花たん的翻唱结合做音频处理，试图从休比的个体视角，而不是故事的全局视角，去表现少女从“无心”到拥有“心”的升华过程。\\n\\n素材：no game no life 0（游戏人生剧场版）\\nBGM：ココロ（镜音+花たん,UP主剪辑版）",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 312,
        dynamic: "#日本场应援2018##休比·多拉##休比# 还是太赶了，待打磨的地方太多，完成度三成吧",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/fe4a7d538ddbcba7bf28a2bf1b29965ac1d2a6b5.jpg",
          mid: 16386653,
          name: "精神隶属机"
        },
        pages: [
          {
            cid: 49727323,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 312,
            from: "vupload",
            page: 1,
            part: "心·机凯",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/841ef5644f90f16633bb5b17201bd73932bd8e38.jpg",
        pubdate: 1533604007,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28710374,
          coin: 706,
          danmaku: 111,
          dislike: 0,
          favorite: 353,
          his_rank: 0,
          like: 607,
          now_rank: 0,
          reply: 109,
          share: 113,
          view: 12415
        },
        state: -100,
        tid: 24,
        title: "【游戏人生ZERO】心·机凯——那是名为“心”的奇迹（ココロ・エクスマキナ）",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28709514,
        attribute: 2113920,
        cid: 49728720,
        copyright: 1,
        ctime: 1533609142,
        desc: '青叶可真是个罪孽深重的女人，没有青叶看我要死了("▔□▔)/\\n请大家为青叶投上宝贵的一票！！\\nbgm：恋爱循环香菜版',
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 204,
        dynamic: "#日本场应援2018##新星计划##凉风青叶#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/0e0c4b99b95726bf34c62122effa08c4e1e36e11.jpg",
          mid: 35578381,
          name: "阴久晴"
        },
        pages: [
          {
            cid: 49728720,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 204,
            from: "vupload",
            page: 1,
            part: "凉风青叶",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/be899252235f5fbc3f432d354fad87e59e79a8d3.jpg",
        pubdate: 1533634233,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28709514,
          coin: 29,
          danmaku: 25,
          dislike: 0,
          favorite: 16,
          his_rank: 0,
          like: 35,
          now_rank: 0,
          reply: 12,
          share: 10,
          view: 411
        },
        state: 1,
        tid: 24,
        title: '【青叶应援】没有青叶看我要死了("▔□▔)/青叶赛高',
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28708306,
        attribute: 2113664,
        cid: 50233770,
        copyright: 1,
        ctime: 1533604016,
        desc: "自制，借物表见视频内\\n摸鱼，这次算填完一个坑，于是顺便把它当做了应援视频，虽然感觉发的时间有点微妙\\n很喜欢这首歌的动作数据，感觉和波特莫名契合，很可爱",
        dimension: {
          height: 768,
          rotate: 0,
          width: 1366
        },
        duration: 194,
        dynamic: "",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/63f3fe9708a4dfb9158d5a1d845e3f1bfa04592a.jpg",
          mid: 6565661,
          name: "Tiua"
        },
        pages: [
          {
            cid: 50233770,
            dimension: {
              height: 768,
              rotate: 0,
              width: 1366
            },
            duration: 194,
            from: "vupload",
            page: 1,
            part: "0",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/2b3bf7256a573bfb5a1d1c2ac8308a5724ec0859.jpg",
        pubdate: 1533604016,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28708306,
          coin: 8,
          danmaku: 1,
          dislike: 0,
          favorite: 16,
          his_rank: 0,
          like: 15,
          now_rank: 0,
          reply: 7,
          share: 7,
          view: 397
        },
        state: 0,
        tid: 25,
        title: "【女神异闻录5MMD】波特的染上你的颜色",
        tname: "MMD·3D",
        videos: 1
      },
      {
        aid: 28707654,
        attribute: 16640,
        cid: 49726539,
        copyright: 1,
        ctime: 1533604019,
        desc: "=-=想哭了，感觉莫名对不到节奏\\n但总之是吧之前的遗憾略微弥补了一下（真的是略微）哭\\n因为里克违背了誓约，所以他注定要失去一切（哭）\\nMAD很一般，不知道是做的烂还是审美疲劳了（我觉得是做的烂）\\n请审核大佬放过~呜呜呜",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 255,
        dynamic: "#日本场应援2018##里克##休比#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/67c1f2995c2b69abef1e952eb01d6e72a3a249c1.jpg",
          mid: 6410318,
          name: "玖钥桑"
        },
        pages: [
          {
            cid: 49726539,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 255,
            from: "vupload",
            page: 1,
            part: "无标题2",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/e8f2e8e8bf2461dbabaf0352cbc28c8a7bca78cf.jpg",
        pubdate: 1533604019,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 0,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28707654,
          coin: 21,
          danmaku: 4,
          dislike: 0,
          favorite: 20,
          his_rank: 0,
          like: 37,
          now_rank: 0,
          reply: 17,
          share: 11,
          view: 945
        },
        state: 0,
        tid: 24,
        title: "【游戏人生ZERO/MAD/终极应援】违背了誓约，我注定失去这一切",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28707213,
        attribute: 16768,
        cid: 49725419,
        copyright: 1,
        ctime: 1533604022,
        desc: "虽然用很多时间搞，但是依然做的很烂",
        dimension: {
          height: 1080,
          rotate: 0,
          width: 1920
        },
        duration: 87,
        dynamic: "#日本场应援2018##AMV##fate#",
        mission_id: 10568,
        owner: {
          face: "http://i1.hdslb.com/bfs/face/147a6f160a5cc3364828bf2ad10909d6bf2ff082.jpg",
          mid: 4961140,
          name: "凉宫杏夏"
        },
        pages: [
          {
            cid: 49725419,
            dimension: {
              height: 1080,
              rotate: 0,
              width: 1920
            },
            duration: 87,
            from: "vupload",
            page: 1,
            part: "序列 03",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i2.hdslb.com/bfs/archive/b6969e7eb14eb1854d094c95d243e3356a88719f.jpg",
        pubdate: 1533604022,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 1,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28707213,
          coin: 7,
          danmaku: 5,
          dislike: 0,
          favorite: 14,
          his_rank: 0,
          like: 23,
          now_rank: 0,
          reply: 10,
          share: 8,
          view: 967
        },
        state: 0,
        tid: 24,
        title: "【AMV】高燃，最爱的红色Archer和红色的魔法师",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28705483,
        attribute: 16512,
        cid: 49722687,
        copyright: 1,
        ctime: 1533574047,
        desc: "bgm很老了，小学生估计都没听过",
        dimension: {
          height: 720,
          rotate: 0,
          width: 1280
        },
        duration: 112,
        dynamic: "#日本场应援2018##AMV##MAD#",
        mission_id: 10568,
        owner: {
          face: "http://i2.hdslb.com/bfs/face/39f667b341cf21827cd7ae81f68da3081934ac82.jpg",
          mid: 97248224,
          name: "bili_97248224"
        },
        pages: [
          {
            cid: 49722687,
            dimension: {
              height: 720,
              rotate: 0,
              width: 1280
            },
            duration: 112,
            from: "vupload",
            page: 1,
            part: "【龙王的工作】八一x空银子，只对你有感觉",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i0.hdslb.com/bfs/archive/9925518d391f52287c1a11e0b1f13f87505ed3f5.jpg",
        pubdate: 1533574047,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28705483,
          coin: 15,
          danmaku: 3,
          dislike: 0,
          favorite: 11,
          his_rank: 0,
          like: 24,
          now_rank: 0,
          reply: 10,
          share: 11,
          view: 1389
        },
        state: 0,
        tid: 24,
        title: "【龙王的工作】八一x空银子，只对你有感觉",
        tname: "MAD·AMV",
        videos: 1
      },
      {
        aid: 28705200,
        attribute: 16512,
        cid: 49719266,
        copyright: 1,
        ctime: 1533604035,
        desc: "原作：《孤独的巡礼/孤独な巡礼》\\n出自作品：Fate/Stay Night\\n作者：川井宪次\\n演奏乐器：钢琴/小提琴\\nSTAFF：钢琴/小提琴/COS/后期：Kino\\n终于翻了自己从刚入fate坑就特别喜欢的这首歌~！\\n一人全役了整首歌，有许多不足，还请各位dalao们指正~\\n一人制作辛苦，如果喜欢希望能给点个赞啦~比心(๑•̀ㅁ•́ฅ)\\n（原声乐器的录音好蓝瘦QWQ）\\n这次试了远坂凛在Fate/Grand Order中的概念礼装元素转换的COS，凛酱赛高！我永远喜欢远坂凛.JPG \\n（虽然这是Saber的",
        dimension: {
          height: 480,
          rotate: 0,
          width: 640
        },
        duration: 116,
        dynamic: "#fate##日本场应援2018#终于翻了自己从刚入fate坑就特别喜欢的《孤独的巡礼》，试了远坂凛在Fate/Grand Order中的概念礼装元素转换的COS，凛酱赛高！我永远喜欢远坂凛.JPG。一人全役了整首歌，有许多不足，还请各位dalao们指正~",
        mission_id: 10568,
        owner: {
          face: "http://i0.hdslb.com/bfs/face/71f384ff3ed0a7a9b3e7cad28cedbb988ca16173.jpg",
          mid: 3575182,
          name: "LogicKino"
        },
        pages: [
          {
            cid: 49719266,
            dimension: {
              height: 480,
              rotate: 0,
              width: 640
            },
            duration: 116,
            from: "vupload",
            page: 1,
            part: "孤独的巡礼",
            vid: "",
            weblink: ""
          }
        ],
        pic: "http://i1.hdslb.com/bfs/archive/3f54e6e37135ad042b49b66e75f1d0495321fd46.jpg",
        pubdate: 1533604035,
        rights: {
          autoplay: 1,
          bp: 0,
          download: 0,
          elec: 0,
          hd5: 0,
          is_cooperation: 0,
          movie: 0,
          no_background: 0,
          no_reprint: 1,
          pay: 0,
          ugc_pay: 0,
          ugc_pay_preview: 0
        },
        stat: {
          aid: 28705200,
          coin: 122,
          danmaku: 10,
          dislike: 0,
          favorite: 30,
          his_rank: 0,
          like: 82,
          now_rank: 0,
          reply: 64,
          share: 16,
          view: 2323
        },
        state: 0,
        tid: 59,
        title: "【一人全役】【钢琴&小提琴】孤独的巡礼 Fate/Stay Night插入曲【B萌日本场应援】",
        tname: "演奏",
        videos: 1
      }
    ],
    mid: 26468955,
    mlid: 182603655,
    mtime: 1533874759,
    name: "bilibili moe 2018 日本动画场应援",
    owner: {
      face: "http://i2.hdslb.com/bfs/face/57389d533621407d36981a99fed93834dd8b20e6.jpg",
      mid: 26468955,
      name: "萌战基"
    },
    pid: 769,
    play_count: 0,
    recent_oids: [
      28705200,
      28705483,
      28707213
    ],
    recent_res: [
      {
        oid: 28705200,
        typ: 2
      },
      {
        oid: 28705483,
        typ: 2
      },
      {
        oid: 28707213,
        typ: 2
      }
    ],
    reply_count: 0,
    share_count: 0,
    stat: {
      favorite: 1685,
      pid: 769,
      reply: 10,
      share: 0,
      view: 298928
    },
    state: 0,
    type: 2
  };

  // src/content/playlist/script.html
  var script_default4 = '<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js"><\\/script>\\r\\n<script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"><\\/script>\\r\\n<script type="text/javascript"\\r\\n    src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"><\\/script>\\r\\n<script type="text/javascript"\\r\\n    src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"><\\/script>';

  // src/content/playlist/playlist.html
  var playlist_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta charset="utf-8" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <meta charset="utf-8" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <link\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css"\\r\\n        rel="stylesheet" />\\r\\n    <style type="text/css">\\r\\n        #bofqi .player {\\r\\n            width: 980px;\\r\\n            height: 620px;\\r\\n            display: block;\\r\\n        }\\r\\n\\r\\n        @media screen and (min-width:1400px) {\\r\\n            #bofqi .player {\\r\\n                width: 1160px;\\r\\n                height: 720px\\r\\n            }\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div id="playlist-video-app"></div>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/content/playlist/code.ts
  function playlistPage() {
    keepNewCheck();
    const title = document.title;
    document.documentElement.replaceWith(createElements(htmlVnode(playlist_default)));
    title && !title.includes("404") && (document.title = title);
    loadVideoScript();
    loadComment();
    const route = urlObj(location.href);
    let type = 3, pl = -1, isPl = Boolean(path[5].startsWith("pl")), oid = "", has_more = false, observer = new MutationObserver((d) => Observer(d));
    path[5].replace(/\\d+/, (d) => pl = d);
    if (route.business) {
      switch (route.business) {
        case "space":
          type = 1;
          break;
        case "space_series":
          type = 5;
          pl = route.business_id;
          break;
        case "space_channel":
          type = 6;
          pl = 10 * route.business_id + pl % 10;
          break;
        case "space_collection":
          type = 8;
          pl = route.business_id;
          break;
        default:
          type = 3;
      }
    }
    !isPl && replaceUrl(objUrl(\`https://www.bilibili.com/playlist/video/pl\${pl}\`, route));
    function info(obj) {
      toview_default.attr = obj.data.attr;
      toview_default.count = obj.data.media_count;
      toview_default.cover = obj.data.cover;
      toview_default.ctime = obj.data.ctime;
      toview_default.description = obj.data.intro;
      toview_default.favored = obj.data.fav_state;
      toview_default.favorite = Boolean(obj.data.fav_state);
      toview_default.id = obj.data.id;
      toview_default.is_favorite = Boolean(obj.data.fav_state);
      toview_default.like_count = obj.data.like_state;
      toview_default.mid = obj.data.mid;
      toview_default.mlid = obj.data.id;
      toview_default.mtime = obj.data.ctime;
      toview_default.name = obj.data.title;
      toview_default.owner = obj.data.upper;
      toview_default.pid = obj.data.id;
      toview_default.stat.favorite = obj.data.cnt_info.collect;
      toview_default.stat.pid = obj.data.id;
      toview_default.stat.reply = obj.data.cnt_info.reply;
      toview_default.stat.share = obj.data.cnt_info.share;
      toview_default.stat.view = obj.data.cnt_info.play;
    }
    function list(obj) {
      obj.data.media_list.reduce((s, d) => {
        s.push({
          aid: d.id,
          attr: d.attr,
          attribute: 0,
          cid: d.pages[0].id,
          copyright: d.copy_right,
          ctime: d.pubtime,
          desc: d.intro,
          dimension: d.pages[0].dimension,
          duration: d.duration,
          dynamic: "",
          owner: d.upper,
          pages: d.pages.reduce((s2, b) => {
            s2.push({
              cid: b.id,
              dimension: b.dimension,
              duration: b.duration,
              from: b.from,
              page: b.page,
              part: b.title,
              vid: "",
              weblink: b.link
            });
            return s2;
          }, []),
          pic: d.cover,
          pubdate: d.pubtime,
          rights: d.rights,
          stat: {
            aid: d.id,
            coin: d.cnt_info.coin,
            danmaku: d.cnt_info.danmaku,
            dislike: d.cnt_info.thumb_down,
            favorite: d.cnt_info.collect,
            his_rank: 0,
            like: d.cnt_info.thumb_up,
            now_rank: 0,
            reply: d.cnt_info.reply,
            share: d.cnt_info.share,
            view: d.cnt_info.play
          },
          state: 0,
          tid: d.tid,
          title: d.title,
          tname: "",
          videos: d.page
        });
        return s;
      }, toview_default.list);
      has_more = obj.data.has_more;
      oid = toview_default.list.at(-1)?.aid;
    }
    function Observer(record) {
      record.forEach((d) => {
        calcScroll(d.target);
      });
    }
    function calcScroll(node2) {
      const maxHeight = node2.scrollHeight;
      const scroll = /\\d+/.exec(node2.style.top) ? Number(/\\d+/.exec(node2.style.top)) : 0;
      if (node2.className.includes("hidden"))
        return;
      if (maxHeight - scroll > 0 && maxHeight - scroll < 600) {
        observer.disconnect();
        videoFloat("加载更多列表中~");
        xhr.get(\`https://api.bilibili.com/x/v2/medialist/resource/list?type=\${type}&oid=\${oid}&otype=2&biz_id=\${pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true\`, { responseType: "json" }).then((d) => {
          formatMore(d);
          has_more && startObserver();
        }).catch((e) => {
          toast.error("获取更多列表数据出错~");
          debug.error("播单", e);
        });
      }
    }
    function startObserver() {
      observer.observe(document.querySelector(".bilibili-player-playlist-item").parentElement.parentElement, { attributes: true });
    }
    function formatMore(obj) {
      const result = obj.data.media_list.reduce((s, d) => {
        s.push({
          ao: d.rights && d.rights.pay,
          Sz: d.upper && d.upper.face,
          Te: d.pages.reduce((s2, f) => {
            s2.push({
              Da: d.bangumi?.ep_id,
              Fb: d.bangumi?.season?.season_id,
              aid: d.id,
              duration: f.duration,
              from: f.from,
              j: f.id,
              ni: f.title,
              page: f.page
            });
            return s2;
          }, []),
          Tz: d.upper && d.upper.mid,
          aid: d.id,
          duration: d.duration,
          ko: d.upper && d.upper.name,
          lb: d.cover,
          state: 0,
          title: d.title
        });
        return s;
      }, []);
      list(obj);
      has_more ? window.player?.updatePlaylist(result) : videoFloat("没有更多了！");
    }
    jsonphookasync("toview", void 0, async (url) => {
      replaceUrl(path.join("/"));
      try {
        if (isPl || pl === 182603655) {
          toast.warning("原生playlist页面已无法访问，已重定向到备份的pl769~");
        } else {
          toview_default.list = [];
          const rqs = await Promise.all([
            xhr.get(\`https://api.bilibili.com/x/v1/medialist/info?type=\${type}&biz_id=\${pl}&tid=0\`, { responseType: "json" }),
            xhr.get(\`https://api.bilibili.com/x/v2/medialist/resource/list?type=\${type}&oid=\${oid}&otype=2&biz_id=\${pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true\`, { responseType: "json" })
          ]);
          info(rqs[0]);
          list(rqs[1]);
        }
        return { code: 0, data: toview_default, message: "0", ttl: 1 };
      } catch (e) {
        toast.error("获取medialist数据失败！请刷新页面或者在设置中关闭重构“medialist”选项");
        throw e;
      }
    });
    switchVideo(() => {
      if (has_more) {
        doWhile(() => document.querySelector(".bilibili-player-playlist-item"), () => startObserver());
      }
    });
    appendScripts(script_default4);
    setting.enlike && new enLike();
    primaryMenu();
    banner();
    loadByDmId();
    setting.automate.electric && jsonphookasync("api.bilibili.com/x/web-interface/elec/show", void 0, async () => {
      return { code: -404 };
    }, false);
    globalVector();
  }

  // src/content/ranking/script.html
  var script_default5 = '<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin=""><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\\/script>';

  // src/content/ranking/ranking.html
  var ranking_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <title>热门视频排行榜 - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta charset="utf-8" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/rank/css/rank.0.ba58f8684a87651e0e1c576df8f918bfa10c1a90.css" />\\r\\n    <style type="text/css">\\r\\n        .gg-floor-module {\\r\\n            display: none;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container has-menu"></div>\\r\\n    <div id="rank-app"></div>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/content/ranking/code.ts
  function rankingPage() {
    keepNewCheck();
    const title = document.title;
    document.documentElement.replaceWith(createElements(htmlVnode(ranking_default)));
    title && !title.includes("404") && (document.title = title);
    replaceUrl(/ranking/.test(document.referrer) ? document.referrer : "https://www.bilibili.com/ranking");
    jsonphook(["api.bilibili.com/x/web-interface/ranking", "arc_type=0"], (d) => d.replace(/day=\\d+/, "day=3"), void 0, false);
    Object.defineProperty(window, "__INITIAL_STATE__", { configurable: true, value: void 0 });
    appendScripts(script_default5);
    addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
    primaryMenu();
    banner();
    globalVector();
  }

  // src/content/read/script.html
  var script_default6 = '<script src="//static.hdslb.com/public/intersection-observer.js"><\\/script>\\r\\n<script src="//static.hdslb.com/public/timing.min.js"><\\/script>\\r\\n<script src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js"><\\/script>\\r\\n<script type="text/javascript" charset="utf-8" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n<script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/biliapp/biliapp.js"><\\/script>\\r\\n<script type="text/javascript"\\r\\n    src="//s1.hdslb.com/bfs/static/jinkela/article/manifest.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\\/script>\\r\\n<script type="text/javascript"\\r\\n    src="//s1.hdslb.com/bfs/static/jinkela/article/vendor.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\\/script>\\r\\n<script type="text/javascript"\\r\\n    src="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\\/script>';

  // src/content/read/read.html
  var read_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head itemprop="Article" itemscope="itemscope" itemtype="http://schema.org/Article">\\r\\n    <meta charset="UTF-8" />\\r\\n    <meta data-n-head="true" name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />\\r\\n    <meta name="theme-color" content="#de698c" />\\r\\n    <meta http="Cache-Control" content="no-transform" />\\r\\n    <meta name="format-detection" content="telephone=no" />\\r\\n    <meta name="applicable-device" content="pc" />\\r\\n    <link rel="apple-touch-icon-precomposed" href="//static.hdslb.com/mobile/img/512.png" />\\r\\n    <link rel="icon" type="image/vnd.microsoft.icon" href="//www.bilibili.com/favicon.ico" />\\r\\n    <link rel="apple-touch-icon" href="//www.bilibili.com/favicon.ico" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <link data-n-head="true" rel="icon" type="image/x-icon" href="//www.bilibili.com/favicon.ico" />\\r\\n    <link data-n-head="true" rel="apple-touch-icon-precomposed" type="image/x-icon"\\r\\n        href="//static.hdslb.com/mobile/img/512.png" />\\r\\n    <title>哔哩哔哩专栏</title>\\r\\n    <link href="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.css"\\r\\n        rel="stylesheet" />\\r\\n    <style type="text/css">\\r\\n        .nav-tab-bar .tab-item[data-tab-id="41"]:before {\\r\\n            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA6lBMVEUAAAAiIiIkJCT///8jIyMiIiIiIiIiIiJVVVUjIyMjIyMlJSU0NDT9/f0iIiIoKCjz8/NCQkIjIyMjIyMrKysiIiJFRUWQkJAiIiIlJSUjIyMkJCQzMzNAQEDv7+/7+/tHR0ciIiIlJSUjIyNKSkp7e3tcXFxoaGgjIyMjIyMkJCT8/PxDQ0MnJyf39/fx8fHn5+cvLy/i4uLe3t7R0dHAwMA0NDQjIyOtra06Ojo+Pj4iIiJAQEBOTk5VVVVwcHBtbW1hYWEjIyMjIyMjIyMiIiIiIiIlJSUpKSkkJCT///95eXltbW1zc3PUVbhEAAAASnRSTlMAf4H+6NOdaAOnQRQF/asO/vTs5NnXxcO6NzMaCgT++fLv3s7GwMC/v6Fi+vr59PDn5ePh2dHOzMrKyMjGw8C/v7+1sZeVUikfHAMz54kAAAEUSURBVCjPldLXboMwFIDhQ7DNDBA2JGmTNLt7772d9v1fp5hSjEOkqP+lP/lIlg+sTVcaRV1gKXE/mLWBZWqYSEUMjfjsYv/4Hr0zxJYKlYxgItOsaMpmItHwA82TkQGgEMG2JrTITwGkRsXs80f6F/oU0b4el3YaQI585l1pm/6bgHZ/Ry7tcgYCaoetjcKaV1ZXwGSwvSi0efNsgoAvI0oXLYc9MXwyQcTBSXb83XOoPIw7AGlawQ8ks4FfPWc47fyec5yHmTHddZmJqEU57t16baghOqL0IArdVxvq6I3GvqvN2bU6JkRK+Odx5P0LFbIaicLWBKurTPX0/IEWV24WBpaJEWksRbBmlkstLaXosK4fYdYsW/LHMigAAAAASUVORK5CYII=);\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container report-wrap-module"></div>\\r\\n    <div class="page-container"></div>\\r\\n    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/runtime/rightCopy.ts
  function rightCopyEnable() {
    addCss(\`* {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
    }\`);
    [].forEach.call(["contextmenu", "copy", "cut", "paste", "mouseup", "mousedown", "keyup", "keydown", "drag", "dragstart", "select", "selectstart"], function(event) {
      document.addEventListener(event, function(e) {
        e.stopPropagation();
      }, true);
    });
  }

  // src/content/read/code.ts
  function readPage() {
    keepNewCheck();
    const title = document.title;
    document.documentElement.replaceWith(createElements(htmlVnode(read_default)));
    title && !title.includes("404") && (document.title = title);
    loadComment();
    xhr.get(location.href).then((data) => {
      data = data.includes("__INITIAL_STATE__=") ? JSON.parse(data.match(/INITIAL_STATE__=.+?\\;\\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\\(function/, "")) : "";
      if (!data)
        throw toast.error("获取专栏数据失败 ಥ_ಥ");
      const bar = [
        [0, "推荐", "home"],
        [2, "动画", "douga"],
        [1, "游戏", "game"],
        [28, "影视", "cinephile"],
        [3, "生活", "life"],
        [29, "兴趣", "interest"],
        [16, "轻小说", "lightnovel"],
        [17, "科技", "technology"],
        [41, "笔记", "note"]
      ];
      let temp2 = bar.reduce((o, d) => {
        o = o + \`<a href="//www.bilibili.com/read/\${d[2]}?from=articleDetail" target="_self" class="tab-item\${data.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="\${d[0]}"><span>\${d[1]}</span></a>\`;
        return o;
      }, \`<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>\`) + "</div>";
      temp2 += \`<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
    <a class="up-face-holder" href="//space.bilibili.com/\${data.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="\${data.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
    <a class="up-name" href="//space.bilibili.com/\${data.readInfo.author.mid}" target="_blank">\${data.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
    </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>\`;
      temp2 += \`<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
        <h1 class="title">\${data.readInfo.title}</h1><div class="info">
        <a class="category-link" href="//www.bilibili.com/read/\${bar.find((d) => {
        if (d[0] == data.readInfo.category.parent_id)
          return d;
      })[2]}#rid=\${data.readInfo.category.id}" target="_blank"><span>\${data.readInfo.category.name}</span></a> <span class="create-time" data-ts="\${data.readInfo.ctime}"></span><div class="article-data"></div>
        </div></div><div style="display:none" class="author-container">
        <a class="author-face" href="//space.bilibili.com/\${data.readInfo.author.mid}" target="_blank"><img data-face-src="\${data.readInfo.author.face.replace("http:", "")}" src="\${data.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/\${data.readInfo.author.mid}" target="_blank">\${data.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>\`;
      temp2 += \`<div class="article-holder">\${data.readInfo.content}</div><p class="original">本文为我原创</p>\`;
      temp2 += (data.readInfo.tags || []).reduce((o, d) => {
        o = o + \`<li data-tag-id="\${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">\${d.name}</span></li>\`;
        return o;
      }, \`<ul class="tag-container">\`) + \`</ul><div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>\`;
      window.original = {
        cvid: data.cvid,
        author: {
          name: data.readInfo.author.name,
          mid: data.readInfo.author.mid
        },
        banner_url: data.readInfo.banner_url || data.readInfo && data.readInfo.image_urls[0] || null,
        reprint: data.readInfo.reprint,
        summary: data.readInfo.summary,
        media: "",
        actId: data.readInfo.act_id,
        dispute: {
          dispute: "",
          dispute_url: ""
        },
        spoiler: "0"
      };
      document.querySelector(".page-container").innerHTML = temp2;
      appendScripts(script_default6);
      rightCopyEnable();
    }).catch((e) => {
      debug.error(e);
    });
    globalVector();
  }

  // src/content/search/script.html
  var script_default7 = '<script type="text/javascript"\\r\\n    src="//www.bilibili.com/gentleman/polyfill.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.vue.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/jinkela/search/1.search.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.js"><\\/script>\\r\\n<script src="//s1.hdslb.com/bfs/static/jinkela/search/search.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.js"><\\/script>';

  // src/content/search/search.html
  var search_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <title data-vue-meta="true"> _ 搜索结果_哔哩哔哩_Bilibili</title>\\r\\n    <meta data-vue-meta="true" charset="UTF-8">\\r\\n    <meta data-vue-meta="true" http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\\r\\n    <meta data-vue-meta="true" name="renderer" content="webkit|ie-comp|ie-stand">\\r\\n    <meta data-vue-meta="true" name="description"\\r\\n        content="点击查看更多相关视频、番剧、影视、直播、专栏、话题、用户等内容；你感兴趣的视频都在B站，bilibili是国内知名的视频弹幕网站，这里有及时的动漫新番，活跃的ACG氛围，有创意的Up主。大家可以在这里找到许多欢乐。">\\r\\n    <meta data-vue-meta="true" name="keywords"\\r\\n        content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid">\\r\\n    <meta data-vue-meta="true" charset="UTF-8">\\r\\n    <meta name="referrer" content="no-referrer-when-downgrade">\\r\\n    <link rel="dns-prefetch" href="//s1.hdslb.com">\\r\\n    <link rel="dns-prefetch" href="//i0.hdslb.com">\\r\\n    <link rel="dns-prefetch" href="//i1.hdslb.com">\\r\\n    <link rel="dns-prefetch" href="//i2.hdslb.com">\\r\\n    <link rel="dns-prefetch" href="//static.hdslb.com">\\r\\n    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico">\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/search/css/search.1.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.css">\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/search/css/search.0.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.css">\\r\\n</head>\\r\\n\\r\\n<body id="bili-search">\\r\\n    <div class="z-top-container"></div>\\r\\n    <div id="search-app"></div>\\r\\n    <!-- built files will be auto injected -->\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/content/search/code.ts
  function searchPage() {
    keepNewCheck();
    const title = document.title;
    document.documentElement.replaceWith(createElements(htmlVnode(search_default)));
    title && !title.includes("404") && (document.title = title);
    doWhile(() => location.href.endsWith("all"), () => {
      replaceUrl(location.origin);
    }, 10, 30);
    Object.defineProperty(window, "__INITIAL_STATE__", { configurable: true, value: void 0 });
    appendScripts(script_default7);
    globalVector();
  }

  // src/content/watchlater/script.html
  var script_default8 = '<script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js"><\\/script>\\r\\n<script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"><\\/script>\\r\\n<script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"><\\/script>\\r\\n<script type="text/javascript"\\r\\n    src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"><\\/script>';

  // src/content/watchlater/watchlater.html
  var watchlater_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta charset="utf-8" />\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />\\r\\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\\r\\n        title="哔哩哔哩" />\\r\\n    <link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css" />\\r\\n    <link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css" />\\r\\n    <link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css"\\r\\n        rel="stylesheet" />\\r\\n    <style type="text/css">\\r\\n        #bofqi .player {\\r\\n            width: 980px;\\r\\n            height: 620px;\\r\\n            display: block;\\r\\n        }\\r\\n\\r\\n        @media screen and (min-width:1400px) {\\r\\n            #bofqi .player {\\r\\n                width: 1160px;\\r\\n                height: 720px\\r\\n            }\\r\\n        }\\r\\n\\r\\n        /* 修正稍后再看迷你播放器样式 */\\r\\n        .bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-danmaku {\\r\\n            top: 30px;\\r\\n            height: 240px;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container has-menu"></div>\\r\\n    <div id="viewlater-app">\\r\\n        <app></app>\\r\\n    </div>\\r\\n    <div class="footer bili-footer"></div>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/content/watchlater/code.ts
  function watchlaterPage() {
    keepNewCheck();
    const title = document.title;
    document.documentElement.replaceWith(createElements(htmlVnode(watchlater_default)));
    title && !title.includes("404") && (document.title = title);
    loadVideoScript();
    loadComment();
    xhrhook("api.live.bilibili.com/bili/living_v2/", void 0, (r) => {
      r.response = r.responseText = \` \${r.response}\`;
    }, false);
    appendScripts(script_default8);
    window.commentAgent = { seek: (t) => window.player && window.player.seek(t) };
    setting.enlike && new enLike("watchlater");
    primaryMenu();
    banner();
    loadByDmId();
    globalVector();
  }

  // src/tampermonkey/vector.ts
  replaceUrl(urlClean(location.href));
  if (setting.index && path[2] == "www.bilibili.com" && (!path[3] || (path[3].startsWith("?") || path[3].startsWith("#") || path[3].startsWith("index.")))) {
    indexPage();
  }
  if (setting.av && /(\\/s)?\\/video\\/[AaBb][Vv]/.test(location.href)) {
    path[3] === "s" && replaceUrl(location.href.replace("s/video", "video"));
    avPage();
  }
  if (setting.bangumi && /\\/bangumi\\/play\\/(ss|ep)/.test(location.href)) {
    bangumiPage();
  }
  if (setting.watchlater && /\\/watchlater/.test(location.href)) {
    watchlaterPage();
  }
  if (setting.player && /player\\./.test(location.href) && !location.href.includes("ancient")) {
    palyerPage();
  }
  if (setting.playlist && /\\/medialist\\/play\\//.test(location.href) && !/watchlater/.test(location.href) || /\\/playlist\\/video\\/pl/.test(location.href)) {
    playlistPage();
  }
  if (setting.ranking && /\\/v\\/popular\\//.test(location.href)) {
    rankingPage();
  }
  if (setting.read && /\\/read\\/[Cc][Vv]/.test(location.href)) {
    readPage();
  }
  if (setting.search && path[2] == "search.bilibili.com") {
    searchPage();
  }
  globalVector();
})();
/**
 * remove-invalid-xml-characters.js
 * @link https://gist.github.com/john-doherty/b9195065884cdbfd2017a4756e6409cc
 * @license MIT
 * @see https://en.wikipedia.org/wiki/Valid_characters_in_XML
 */
// @license GFUL
// @license MIT

`;"use strict";
(() => {
  // src/tampermonkey/index.ts
  (function() {
    new Function(
      "GM",
      "GM_xmlhttpRequest",
      "GM_getResourceText",
      "GM_getResourceURL",
      "GM_getValue",
      "GM_setValue",
      "GM_deleteValue",
      "GM_listValues",
      modules
    )(
      GM,
      GM_xmlhttpRequest,
      GM_getResourceText,
      GM_getResourceURL,
      GM_getValue,
      GM_setValue,
      GM_deleteValue,
      GM_listValues
    );
  })();
})();
