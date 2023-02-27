// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      10.3.2-caecec5992d77bb3ca0d10621b4a2a7858158994
// @description  恢复Bilibili旧版页面，为了那些念旧的人。
// @author       MotooriKashin, wly5556
// @homepage     https://github.com/MotooriKashin/Bilibili-Old
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://*.bilibili.com/*
// @connect      *
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.cookie
// @run-at       document-start
// @license      MIT
// ==/UserScript==

const MODULES = `
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
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
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
    mod2
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // tampermonkey/gm.ts
  var init_gm = __esm({
    "tampermonkey/gm.ts"() {
      "use strict";
      init_tampermonkey();
      GM.fetch = function(input, init) {
        return new Promise((resolve, reject) => {
          try {
            input = input.url ? input.url : input;
            input = new URL(input, location.origin).toJSON();
          } catch (e) {
            reject(e);
          }
          GM.xmlHttpRequest({
            url: input,
            method: init?.method,
            data: init?.body,
            anonymous: init ? init.credentials === "include" ? false : true : true,
            headers: init?.headers,
            onload: (xhr) => {
              const response = new Response(xhr.response, { status: xhr.status, statusText: xhr.statusText });
              Object.defineProperties(response, {
                url: { value: xhr.finalUrl }
              });
              resolve(response);
            },
            onerror: reject
          });
        });
      };
    }
  });

  // tampermonkey/polyfill/polyfill.ts
  var init_polyfill = __esm({
    "tampermonkey/polyfill/polyfill.ts"() {
      "use strict";
      init_tampermonkey();
      if (typeof Element.prototype.replaceChildren === "undefined") {
        Reflect.defineProperty(Element.prototype, "replaceChildren", {
          configurable: true,
          enumerable: false,
          value: function() {
            while (this.lastChild)
              this.removeChild(this.lastChild);
            this.append.call(this, ...arguments);
          }
        });
      }
    }
  });

  // tampermonkey/index.ts
  var init_tampermonkey = __esm({
    "tampermonkey/index.ts"() {
      init_gm();
      init_polyfill();
    }
  });

  // node_modules/crypt/crypt.js
  var require_crypt = __commonJS({
    "node_modules/crypt/crypt.js"(exports2, module2) {
      init_tampermonkey();
      (function() {
        var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt = {
          // Bit-wise rotation left
          rotl: function(n, b) {
            return n << b | n >>> 32 - b;
          },
          // Bit-wise rotation right
          rotr: function(n, b) {
            return n << 32 - b | n >>> b;
          },
          // Swap big-endian to little-endian and vice versa
          endian: function(n) {
            if (n.constructor == Number) {
              return crypt.rotl(n, 8) & 16711935 | crypt.rotl(n, 24) & 4278255360;
            }
            for (var i = 0; i < n.length; i++)
              n[i] = crypt.endian(n[i]);
            return n;
          },
          // Generate an array of any length of random bytes
          randomBytes: function(n) {
            for (var bytes = []; n > 0; n--)
              bytes.push(Math.floor(Math.random() * 256));
            return bytes;
          },
          // Convert a byte array to big-endian 32-bit words
          bytesToWords: function(bytes) {
            for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
              words[b >>> 5] |= bytes[i] << 24 - b % 32;
            return words;
          },
          // Convert big-endian 32-bit words to a byte array
          wordsToBytes: function(words) {
            for (var bytes = [], b = 0; b < words.length * 32; b += 8)
              bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
            return bytes;
          },
          // Convert a byte array to a hex string
          bytesToHex: function(bytes) {
            for (var hex = [], i = 0; i < bytes.length; i++) {
              hex.push((bytes[i] >>> 4).toString(16));
              hex.push((bytes[i] & 15).toString(16));
            }
            return hex.join("");
          },
          // Convert a hex string to a byte array
          hexToBytes: function(hex) {
            for (var bytes = [], c = 0; c < hex.length; c += 2)
              bytes.push(parseInt(hex.substr(c, 2), 16));
            return bytes;
          },
          // Convert a byte array to a base-64 string
          bytesToBase64: function(bytes) {
            for (var base642 = [], i = 0; i < bytes.length; i += 3) {
              var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
              for (var j = 0; j < 4; j++)
                if (i * 8 + j * 6 <= bytes.length * 8)
                  base642.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
                else
                  base642.push("=");
            }
            return base642.join("");
          },
          // Convert a base-64 string to a byte array
          base64ToBytes: function(base642) {
            base642 = base642.replace(/[^A-Z0-9+\\/]/ig, "");
            for (var bytes = [], i = 0, imod4 = 0; i < base642.length; imod4 = ++i % 4) {
              if (imod4 == 0)
                continue;
              bytes.push((base64map.indexOf(base642.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base642.charAt(i)) >>> 6 - imod4 * 2);
            }
            return bytes;
          }
        };
        module2.exports = crypt;
      })();
    }
  });

  // node_modules/charenc/charenc.js
  var require_charenc = __commonJS({
    "node_modules/charenc/charenc.js"(exports2, module2) {
      init_tampermonkey();
      var charenc = {
        // UTF-8 encoding
        utf8: {
          // Convert a string to a byte array
          stringToBytes: function(str) {
            return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
          },
          // Convert a byte array to a string
          bytesToString: function(bytes) {
            return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
          }
        },
        // Binary encoding
        bin: {
          // Convert a string to a byte array
          stringToBytes: function(str) {
            for (var bytes = [], i = 0; i < str.length; i++)
              bytes.push(str.charCodeAt(i) & 255);
            return bytes;
          },
          // Convert a byte array to a string
          bytesToString: function(bytes) {
            for (var str = [], i = 0; i < bytes.length; i++)
              str.push(String.fromCharCode(bytes[i]));
            return str.join("");
          }
        }
      };
      module2.exports = charenc;
    }
  });

  // node_modules/is-buffer/index.js
  var require_is_buffer = __commonJS({
    "node_modules/is-buffer/index.js"(exports2, module2) {
      init_tampermonkey();
      module2.exports = function(obj) {
        return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
      };
      function isBuffer(obj) {
        return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
      }
      function isSlowBuffer(obj) {
        return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
      }
    }
  });

  // node_modules/md5/md5.js
  var require_md5 = __commonJS({
    "node_modules/md5/md5.js"(exports2, module2) {
      init_tampermonkey();
      (function() {
        var crypt = require_crypt(), utf8 = require_charenc().utf8, isBuffer = require_is_buffer(), bin = require_charenc().bin, md53 = function(message, options) {
          if (message.constructor == String)
            if (options && options.encoding === "binary")
              message = bin.stringToBytes(message);
            else
              message = utf8.stringToBytes(message);
          else if (isBuffer(message))
            message = Array.prototype.slice.call(message, 0);
          else if (!Array.isArray(message) && message.constructor !== Uint8Array)
            message = message.toString();
          var m = crypt.bytesToWords(message), l = message.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
          for (var i = 0; i < m.length; i++) {
            m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
          }
          m[l >>> 5] |= 128 << l % 32;
          m[(l + 64 >>> 9 << 4) + 14] = l;
          var FF = md53._ff, GG = md53._gg, HH = md53._hh, II = md53._ii;
          for (var i = 0; i < m.length; i += 16) {
            var aa = a, bb = b, cc = c, dd = d;
            a = FF(a, b, c, d, m[i + 0], 7, -680876936);
            d = FF(d, a, b, c, m[i + 1], 12, -389564586);
            c = FF(c, d, a, b, m[i + 2], 17, 606105819);
            b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
            a = FF(a, b, c, d, m[i + 4], 7, -176418897);
            d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
            c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
            b = FF(b, c, d, a, m[i + 7], 22, -45705983);
            a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
            d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
            c = FF(c, d, a, b, m[i + 10], 17, -42063);
            b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
            a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
            d = FF(d, a, b, c, m[i + 13], 12, -40341101);
            c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
            b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
            a = GG(a, b, c, d, m[i + 1], 5, -165796510);
            d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
            c = GG(c, d, a, b, m[i + 11], 14, 643717713);
            b = GG(b, c, d, a, m[i + 0], 20, -373897302);
            a = GG(a, b, c, d, m[i + 5], 5, -701558691);
            d = GG(d, a, b, c, m[i + 10], 9, 38016083);
            c = GG(c, d, a, b, m[i + 15], 14, -660478335);
            b = GG(b, c, d, a, m[i + 4], 20, -405537848);
            a = GG(a, b, c, d, m[i + 9], 5, 568446438);
            d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
            c = GG(c, d, a, b, m[i + 3], 14, -187363961);
            b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
            a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
            d = GG(d, a, b, c, m[i + 2], 9, -51403784);
            c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
            b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
            a = HH(a, b, c, d, m[i + 5], 4, -378558);
            d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
            c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
            b = HH(b, c, d, a, m[i + 14], 23, -35309556);
            a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
            d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
            c = HH(c, d, a, b, m[i + 7], 16, -155497632);
            b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
            a = HH(a, b, c, d, m[i + 13], 4, 681279174);
            d = HH(d, a, b, c, m[i + 0], 11, -358537222);
            c = HH(c, d, a, b, m[i + 3], 16, -722521979);
            b = HH(b, c, d, a, m[i + 6], 23, 76029189);
            a = HH(a, b, c, d, m[i + 9], 4, -640364487);
            d = HH(d, a, b, c, m[i + 12], 11, -421815835);
            c = HH(c, d, a, b, m[i + 15], 16, 530742520);
            b = HH(b, c, d, a, m[i + 2], 23, -995338651);
            a = II(a, b, c, d, m[i + 0], 6, -198630844);
            d = II(d, a, b, c, m[i + 7], 10, 1126891415);
            c = II(c, d, a, b, m[i + 14], 15, -1416354905);
            b = II(b, c, d, a, m[i + 5], 21, -57434055);
            a = II(a, b, c, d, m[i + 12], 6, 1700485571);
            d = II(d, a, b, c, m[i + 3], 10, -1894986606);
            c = II(c, d, a, b, m[i + 10], 15, -1051523);
            b = II(b, c, d, a, m[i + 1], 21, -2054922799);
            a = II(a, b, c, d, m[i + 8], 6, 1873313359);
            d = II(d, a, b, c, m[i + 15], 10, -30611744);
            c = II(c, d, a, b, m[i + 6], 15, -1560198380);
            b = II(b, c, d, a, m[i + 13], 21, 1309151649);
            a = II(a, b, c, d, m[i + 4], 6, -145523070);
            d = II(d, a, b, c, m[i + 11], 10, -1120210379);
            c = II(c, d, a, b, m[i + 2], 15, 718787259);
            b = II(b, c, d, a, m[i + 9], 21, -343485551);
            a = a + aa >>> 0;
            b = b + bb >>> 0;
            c = c + cc >>> 0;
            d = d + dd >>> 0;
          }
          return crypt.endian([a, b, c, d]);
        };
        md53._ff = function(a, b, c, d, x, s, t) {
          var n = a + (b & c | ~b & d) + (x >>> 0) + t;
          return (n << s | n >>> 32 - s) + b;
        };
        md53._gg = function(a, b, c, d, x, s, t) {
          var n = a + (b & d | c & ~d) + (x >>> 0) + t;
          return (n << s | n >>> 32 - s) + b;
        };
        md53._hh = function(a, b, c, d, x, s, t) {
          var n = a + (b ^ c ^ d) + (x >>> 0) + t;
          return (n << s | n >>> 32 - s) + b;
        };
        md53._ii = function(a, b, c, d, x, s, t) {
          var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
          return (n << s | n >>> 32 - s) + b;
        };
        md53._blocksize = 16;
        md53._digestsize = 16;
        module2.exports = function(message, options) {
          if (message === void 0 || message === null)
            throw new Error("Illegal argument " + message);
          var digestbytes = crypt.wordsToBytes(md53(message, options));
          return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt.bytesToHex(digestbytes);
        };
      })();
    }
  });

  // node_modules/@protobufjs/aspromise/index.js
  var require_aspromise = __commonJS({
    "node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = asPromise;
      function asPromise(fn, ctx) {
        var params = new Array(arguments.length - 1), offset2 = 0, index = 2, pending = true;
        while (index < arguments.length)
          params[offset2++] = arguments[index++];
        return new Promise(function executor(resolve, reject) {
          params[offset2] = function callback(err) {
            if (pending) {
              pending = false;
              if (err)
                reject(err);
              else {
                var params2 = new Array(arguments.length - 1), offset3 = 0;
                while (offset3 < params2.length)
                  params2[offset3++] = arguments[offset3];
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
      init_tampermonkey();
      var base642 = exports2;
      base642.length = function length2(string) {
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
      base642.encode = function encode(buffer, start, end) {
        var parts = null, chunk = [];
        var i2 = 0, j = 0, t;
        while (start < end) {
          var b = buffer[start++];
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
      base642.decode = function decode(string, buffer, offset2) {
        var start = offset2;
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
              buffer[offset2++] = t << 2 | (c & 48) >> 4;
              t = c;
              j = 2;
              break;
            case 2:
              buffer[offset2++] = (t & 15) << 4 | (c & 60) >> 2;
              t = c;
              j = 3;
              break;
            case 3:
              buffer[offset2++] = (t & 3) << 6 | c;
              j = 0;
              break;
          }
        }
        if (j === 1)
          throw Error(invalidEncoding);
        return offset2 - start;
      };
      base642.test = function test(string) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\$/.test(string);
      };
    }
  });

  // node_modules/@protobufjs/eventemitter/index.js
  var require_eventemitter = __commonJS({
    "node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
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
      init_tampermonkey();
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
                writeUint(1 / val > 0 ? (
                  /* positive */
                  0
                ) : (
                  /* negative 0 */
                  2147483648
                ), buf, pos);
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
                writeUint(1 / val > 0 ? (
                  /* positive */
                  0
                ) : (
                  /* negative 0 */
                  2147483648
                ), buf, pos + off1);
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
      init_tampermonkey();
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
      init_tampermonkey();
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
      utf8.read = function utf8_read(buffer, start, end) {
        var len = end - start;
        if (len < 1)
          return "";
        var parts = null, chunk = [], i = 0, t;
        while (start < end) {
          t = buffer[start++];
          if (t < 128)
            chunk[i++] = t;
          else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
          else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
            chunk[i++] = 55296 + (t >> 10);
            chunk[i++] = 56320 + (t & 1023);
          } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
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
      utf8.write = function utf8_write(string, buffer, offset2) {
        var start = offset2, c1, c2;
        for (var i = 0; i < string.length; ++i) {
          c1 = string.charCodeAt(i);
          if (c1 < 128) {
            buffer[offset2++] = c1;
          } else if (c1 < 2048) {
            buffer[offset2++] = c1 >> 6 | 192;
            buffer[offset2++] = c1 & 63 | 128;
          } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
            c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
            ++i;
            buffer[offset2++] = c1 >> 18 | 240;
            buffer[offset2++] = c1 >> 12 & 63 | 128;
            buffer[offset2++] = c1 >> 6 & 63 | 128;
            buffer[offset2++] = c1 & 63 | 128;
          } else {
            buffer[offset2++] = c1 >> 12 | 224;
            buffer[offset2++] = c1 >> 6 & 63 | 128;
            buffer[offset2++] = c1 & 63 | 128;
          }
        }
        return offset2 - start;
      };
    }
  });

  // node_modules/@protobufjs/pool/index.js
  var require_pool = __commonJS({
    "node_modules/@protobufjs/pool/index.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = pool;
      function pool(alloc, slice, size) {
        var SIZE = size || 8192;
        var MAX = SIZE >>> 1;
        var slab = null;
        var offset2 = SIZE;
        return function pool_alloc(size2) {
          if (size2 < 1 || size2 > MAX)
            return alloc(size2);
          if (offset2 + size2 > SIZE) {
            slab = alloc(SIZE);
            offset2 = 0;
          }
          var buf = slice.call(slab, offset2, offset2 += size2);
          if (offset2 & 7)
            offset2 = (offset2 | 7) + 1;
          return buf;
        };
      }
    }
  });

  // node_modules/protobufjs/src/util/longbits.js
  var require_longbits = __commonJS({
    "node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
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
      LongBits.prototype.length = function length2() {
        var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
        return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
      };
    }
  });

  // node_modules/protobufjs/src/util/minimal.js
  var require_minimal = __commonJS({
    "node_modules/protobufjs/src/util/minimal.js"(exports2) {
      "use strict";
      init_tampermonkey();
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
      util.emptyArray = Object.freeze ? Object.freeze([]) : (
        /* istanbul ignore next */
        []
      );
      util.emptyObject = Object.freeze ? Object.freeze({}) : (
        /* istanbul ignore next */
        {}
      );
      util.isInteger = Number.isInteger || /* istanbul ignore next */
      function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
      util.isString = function isString(value) {
        return typeof value === "string" || value instanceof String;
      };
      util.isObject = function isObject2(value) {
        return value && typeof value === "object";
      };
      util.isset = /**
       * Checks if a property on a message is considered to be present.
       * @param {Object} obj Plain object or message instance
       * @param {string} prop Property name
       * @returns {boolean} \`true\` if considered to be present, otherwise \`false\`
       */
      util.isSet = function isSet(obj, prop) {
        var value = obj[prop];
        if (value != null && obj.hasOwnProperty(prop))
          return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
        return false;
      };
      util.Buffer = function() {
        try {
          var Buffer2 = util.inquire("buffer").Buffer;
          return Buffer2.prototype.utf8Write ? Buffer2 : (
            /* istanbul ignore next */
            null
          );
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
      util.Long = /* istanbul ignore next */
      util.global.dcodeIO && /* istanbul ignore next */
      util.global.dcodeIO.Long || /* istanbul ignore next */
      util.global.Long || util.inquire("long");
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
        function CustomError(message, properties) {
          if (!(this instanceof CustomError))
            return new CustomError(message, properties);
          Object.defineProperty(this, "message", { get: function() {
            return message;
          } });
          if (Error.captureStackTrace)
            Error.captureStackTrace(this, CustomError);
          else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });
          if (properties)
            merge(this, properties);
        }
        CustomError.prototype = Object.create(Error.prototype, {
          constructor: {
            value: CustomError,
            writable: true,
            enumerable: false,
            configurable: true
          },
          name: {
            get: function get() {
              return name;
            },
            set: void 0,
            enumerable: false,
            // configurable: false would accurately preserve the behavior of
            // the original, but I'm guessing that was not intentional.
            // For an actual error subclass, this property would
            // be configurable.
            configurable: true
          },
          toString: {
            value: function value() {
              return this.name + ": " + this.message;
            },
            writable: true,
            enumerable: false,
            configurable: true
          }
        });
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
        util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || /* istanbul ignore next */
        function Buffer_from(value, encoding) {
          return new Buffer2(value, encoding);
        };
        util._Buffer_allocUnsafe = Buffer2.allocUnsafe || /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
          return new Buffer2(size);
        };
      };
    }
  });

  // node_modules/protobufjs/src/writer.js
  var require_writer = __commonJS({
    "node_modules/protobufjs/src/writer.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = Writer;
      var util = require_minimal();
      var BufferWriter;
      var LongBits = util.LongBits;
      var base642 = util.base64;
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
          var buf = Writer.alloc(len = base642.length(value));
          base642.decode(value, buf, 0);
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
      init_tampermonkey();
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
      init_tampermonkey();
      module2.exports = Reader;
      var util = require_minimal();
      var BufferReader;
      var LongBits = util.LongBits;
      var utf8 = util.utf8;
      function indexOutOfRange(reader, writeLength) {
        return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
      }
      function Reader(buffer) {
        this.buf = buffer;
        this.pos = 0;
        this.len = buffer.length;
      }
      var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
          return new Reader(buffer);
        throw Error("illegal buffer");
      } : function create_array2(buffer) {
        if (Array.isArray(buffer))
          return new Reader(buffer);
        throw Error("illegal buffer");
      };
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup(buffer) {
          return (Reader.create = function create_buffer(buffer2) {
            return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
          })(buffer);
        } : create_array;
      };
      Reader.create = create();
      Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
      util.Array.prototype.slice;
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
        var length2 = this.uint32(), start = this.pos, end = this.pos + length2;
        if (end > this.len)
          throw indexOutOfRange(this, length2);
        this.pos += length2;
        if (Array.isArray(this.buf))
          return this.buf.slice(start, end);
        return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
      };
      Reader.prototype.string = function read_string() {
        var bytes = this.bytes();
        return utf8.read(bytes, 0, bytes.length);
      };
      Reader.prototype.skip = function skip(length2) {
        if (typeof length2 === "number") {
          if (this.pos + length2 > this.len)
            throw indexOutOfRange(this, length2);
          this.pos += length2;
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
        var fn = util.Long ? "toLong" : (
          /* istanbul ignore next */
          "toNumber"
        );
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
      init_tampermonkey();
      module2.exports = BufferReader;
      var Reader = require_reader();
      (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
      var util = require_minimal();
      function BufferReader(buffer) {
        Reader.call(this, buffer);
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
      init_tampermonkey();
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
                self2.end(
                  /* endedByRPC */
                  true
                );
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
      init_tampermonkey();
      var rpc = exports2;
      rpc.Service = require_service();
    }
  });

  // node_modules/protobufjs/src/roots.js
  var require_roots = __commonJS({
    "node_modules/protobufjs/src/roots.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = {};
    }
  });

  // node_modules/protobufjs/src/index-minimal.js
  var require_index_minimal = __commonJS({
    "node_modules/protobufjs/src/index-minimal.js"(exports2) {
      "use strict";
      init_tampermonkey();
      var protobuf = exports2;
      protobuf.build = "minimal";
      protobuf.Writer = require_writer();
      protobuf.BufferWriter = require_writer_buffer();
      protobuf.Reader = require_reader();
      protobuf.BufferReader = require_reader_buffer();
      protobuf.util = require_minimal();
      protobuf.rpc = require_rpc();
      protobuf.roots = require_roots();
      protobuf.configure = configure;
      function configure() {
        protobuf.util._configure();
        protobuf.Writer._configure(protobuf.BufferWriter);
        protobuf.Reader._configure(protobuf.BufferReader);
      }
      configure();
    }
  });

  // node_modules/@protobufjs/codegen/index.js
  var require_codegen = __commonJS({
    "node_modules/@protobufjs/codegen/index.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = codegen;
      function codegen(functionParams, functionName) {
        if (typeof functionParams === "string") {
          functionName = functionParams;
          functionParams = void 0;
        }
        var body = [];
        function Codegen(formatStringOrScope) {
          if (typeof formatStringOrScope !== "string") {
            var source = toString2();
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
        function toString2(functionNameOverride) {
          return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\\n  " + body.join("\\n  ") + "\\n}";
        }
        Codegen.toString = toString2;
        return Codegen;
      }
      codegen.verbose = false;
    }
  });

  // node_modules/@protobufjs/fetch/index.js
  var require_fetch = __commonJS({
    "node_modules/@protobufjs/fetch/index.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
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
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function fetchOnReadyStateChange() {
          if (xhr.readyState !== 4)
            return void 0;
          if (xhr.status !== 0 && xhr.status !== 200)
            return callback(Error("status " + xhr.status));
          if (options.binary) {
            var buffer = xhr.response;
            if (!buffer) {
              buffer = [];
              for (var i = 0; i < xhr.responseText.length; ++i)
                buffer.push(xhr.responseText.charCodeAt(i) & 255);
            }
            return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
          }
          return callback(null, xhr.responseText);
        };
        if (options.binary) {
          if ("overrideMimeType" in xhr)
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          xhr.responseType = "arraybuffer";
        }
        xhr.open("GET", filename);
        xhr.send();
      };
    }
  });

  // node_modules/@protobufjs/path/index.js
  var require_path = __commonJS({
    "node_modules/@protobufjs/path/index.js"(exports2) {
      "use strict";
      init_tampermonkey();
      var path = exports2;
      var isAbsolute = (
        /**
         * Tests if the specified path is absolute.
         * @param {string} path Path to test
         * @returns {boolean} \`true\` if path is absolute
         */
        path.isAbsolute = function isAbsolute2(path2) {
          return /^(?:\\/|\\w+:)/.test(path2);
        }
      );
      var normalize = (
        /**
         * Normalizes the specified path.
         * @param {string} path Path to normalize
         * @returns {string} Normalized path
         */
        path.normalize = function normalize2(path2) {
          path2 = path2.replace(/\\\\/g, "/").replace(/\\/{2,}/g, "/");
          var parts = path2.split("/"), absolute = isAbsolute(path2), prefix = "";
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
        }
      );
      path.resolve = function resolve(originPath, includePath, alreadyNormalized) {
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
      init_tampermonkey();
      var types = exports2;
      var util = require_util();
      var s = [
        "double",
        // 0
        "float",
        // 1
        "int32",
        // 2
        "uint32",
        // 3
        "sint32",
        // 4
        "fixed32",
        // 5
        "sfixed32",
        // 6
        "int64",
        // 7
        "uint64",
        // 8
        "sint64",
        // 9
        "fixed64",
        // 10
        "sfixed64",
        // 11
        "bool",
        // 12
        "string",
        // 13
        "bytes"
        // 14
      ];
      function bake(values, offset2) {
        var i = 0, o = {};
        offset2 |= 0;
        while (i < values.length)
          o[s[i + offset2]] = values[i++];
        return o;
      }
      types.basic = bake([
        /* double   */
        1,
        /* float    */
        5,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0,
        /* string   */
        2,
        /* bytes    */
        2
      ]);
      types.defaults = bake([
        /* double   */
        0,
        /* float    */
        0,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        0,
        /* sfixed32 */
        0,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        0,
        /* sfixed64 */
        0,
        /* bool     */
        false,
        /* string   */
        "",
        /* bytes    */
        util.emptyArray,
        /* message  */
        null
      ]);
      types.long = bake([
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1
      ], 7);
      types.mapKey = bake([
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0,
        /* string   */
        2
      ], 2);
      types.packed = bake([
        /* double   */
        1,
        /* float    */
        5,
        /* int32    */
        0,
        /* uint32   */
        0,
        /* sint32   */
        0,
        /* fixed32  */
        5,
        /* sfixed32 */
        5,
        /* int64    */
        0,
        /* uint64   */
        0,
        /* sint64   */
        0,
        /* fixed64  */
        1,
        /* sfixed64 */
        1,
        /* bool     */
        0
      ]);
    }
  });

  // node_modules/protobufjs/src/field.js
  var require_field = __commonJS({
    "node_modules/protobufjs/src/field.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = Field;
      var ReflectionObject = require_object();
      ((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      var Type2;
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
        this.long = util.Long ? types.long[type] !== void 0 : (
          /* istanbul ignore next */
          false
        );
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
          if (this.resolvedType instanceof Type2)
            this.typeDefault = null;
          else
            this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
        } else if (this.options && this.options.proto3_optional) {
          this.typeDefault = null;
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
        if (this.parent instanceof Type2)
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
        Type2 = Type_;
      };
    }
  });

  // node_modules/protobufjs/src/oneof.js
  var require_oneof = __commonJS({
    "node_modules/protobufjs/src/oneof.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
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
      init_tampermonkey();
      module2.exports = Namespace;
      var ReflectionObject = require_object();
      ((Namespace.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace).className = "Namespace";
      var Field = require_field();
      var util = require_util();
      var OneOf = require_oneof();
      var Type2;
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
              // most to least likely
              (nested.fields !== void 0 ? Type2.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service.fromJSON : nested.id !== void 0 ? Field.fromJSON : Namespace.fromJSON)(names[i], nested)
            );
          }
        }
        return this;
      };
      Namespace.prototype.get = function get(name) {
        return this.nested && this.nested[name] || null;
      };
      Namespace.prototype.getEnum = function getEnum(name) {
        if (this.nested && this.nested[name] instanceof Enum)
          return this.nested[name].values;
        throw Error("no such enum: " + name);
      };
      Namespace.prototype.add = function add(object) {
        if (!(object instanceof Field && object.extend !== void 0 || object instanceof Type2 || object instanceof OneOf || object instanceof Enum || object instanceof Service || object instanceof Namespace))
          throw TypeError("object must be a valid nested object");
        if (!this.nested)
          this.nested = {};
        else {
          var prev = this.get(object.name);
          if (prev) {
            if (prev instanceof Namespace && object instanceof Namespace && !(prev instanceof Type2 || prev instanceof Service)) {
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
      Namespace.prototype.define = function define(path, json) {
        if (util.isString(path))
          path = path.split(".");
        else if (!Array.isArray(path))
          throw TypeError("illegal path");
        if (path && path.length && path[0] === "")
          throw Error("path must be relative");
        var ptr = this;
        while (path.length > 0) {
          var part = path.shift();
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
      Namespace.prototype.lookup = function lookup(path, filterTypes, parentAlreadyChecked) {
        if (typeof filterTypes === "boolean") {
          parentAlreadyChecked = filterTypes;
          filterTypes = void 0;
        } else if (filterTypes && !Array.isArray(filterTypes))
          filterTypes = [filterTypes];
        if (util.isString(path) && path.length) {
          if (path === ".")
            return this.root;
          path = path.split(".");
        } else if (!path.length)
          return this;
        if (path[0] === "")
          return this.root.lookup(path.slice(1), filterTypes);
        var found = this.get(path[0]);
        if (found) {
          if (path.length === 1) {
            if (!filterTypes || filterTypes.indexOf(found.constructor) > -1)
              return found;
          } else if (found instanceof Namespace && (found = found.lookup(path.slice(1), filterTypes, true)))
            return found;
        } else
          for (var i = 0; i < this.nestedArray.length; ++i)
            if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i].lookup(path, filterTypes, true)))
              return found;
        if (this.parent === null || parentAlreadyChecked)
          return null;
        return this.parent.lookup(path, filterTypes);
      };
      Namespace.prototype.lookupType = function lookupType(path) {
        var found = this.lookup(path, [Type2]);
        if (!found)
          throw Error("no such type: " + path);
        return found;
      };
      Namespace.prototype.lookupEnum = function lookupEnum(path) {
        var found = this.lookup(path, [Enum]);
        if (!found)
          throw Error("no such Enum '" + path + "' in " + this);
        return found;
      };
      Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path) {
        var found = this.lookup(path, [Type2, Enum]);
        if (!found)
          throw Error("no such Type or Enum '" + path + "' in " + this);
        return found;
      };
      Namespace.prototype.lookupService = function lookupService(path) {
        var found = this.lookup(path, [Service]);
        if (!found)
          throw Error("no such Service '" + path + "' in " + this);
        return found;
      };
      Namespace._configure = function(Type_, Service_, Enum_) {
        Type2 = Type_;
        Service = Service_;
        Enum = Enum_;
      };
    }
  });

  // node_modules/protobufjs/src/mapfield.js
  var require_mapfield = __commonJS({
    "node_modules/protobufjs/src/mapfield.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
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
      init_tampermonkey();
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
          this.type !== "rpc" && /* istanbul ignore next */
          this.type || void 0,
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
      init_tampermonkey();
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
          Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */
          {},
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
      Service.prototype.get = function get(name) {
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
        for (var i = 0, method; i < /* initializes */
        this.methodsArray.length; ++i) {
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
      init_tampermonkey();
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
      Message.encode = function encode(message, writer) {
        return this.\$type.encode(message, writer);
      };
      Message.encodeDelimited = function encodeDelimited(message, writer) {
        return this.\$type.encodeDelimited(message, writer);
      };
      Message.decode = function decode(reader) {
        return this.\$type.decode(reader);
      };
      Message.decodeDelimited = function decodeDelimited(reader) {
        return this.\$type.decodeDelimited(reader);
      };
      Message.verify = function verify(message) {
        return this.\$type.verify(message);
      };
      Message.fromObject = function fromObject(object) {
        return this.\$type.fromObject(object);
      };
      Message.toObject = function toObject2(message, options) {
        return this.\$type.toObject(message, options);
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
      init_tampermonkey();
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
        for (; i < /* initializes */
        mtype.fieldsArray.length; ++i) {
          var field = mtype._fieldsArray[i].resolve(), type = field.resolvedType instanceof Enum ? "int32" : field.type, ref = "m" + util.safeProp(field.name);
          gen("case %i: {", field.id);
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
          gen("break")("}");
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
      init_tampermonkey();
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
        for (var i = 0; i < /* initializes */
        mtype.fieldsArray.length; ++i) {
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
      init_tampermonkey();
      var converter = exports2;
      var Enum = require_enum();
      var util = require_util();
      function genValuePartial_fromObject(gen, field, fieldIndex, prop) {
        var defaultAlreadyEmitted = false;
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum) {
            gen("switch(d%s){", prop);
            for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
              if (values[keys[i]] === field.typeDefault && !defaultAlreadyEmitted) {
                gen("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', prop, prop, prop);
                if (!field.repeated)
                  gen("break");
                defaultAlreadyEmitted = true;
              }
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
              gen('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length >= 0)", prop)("m%s=d%s", prop, prop);
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
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop + "[ks[i]]"
            )("}")("}");
          } else if (field.repeated) {
            gen("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field.fullName + ": array expected")("m%s=[]", prop)("for(var i=0;i<d%s.length;++i){", prop);
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop + "[i]"
            )("}")("}");
          } else {
            if (!(field.resolvedType instanceof Enum))
              gen("if(d%s!=null){", prop);
            genValuePartial_fromObject(
              gen,
              field,
              /* not sorted */
              i,
              prop
            );
            if (!(field.resolvedType instanceof Enum))
              gen("}");
          }
        }
        return gen("return m");
      };
      function genValuePartial_toObject(gen, field, fieldIndex, prop) {
        if (field.resolvedType) {
          if (field.resolvedType instanceof Enum)
            gen("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", prop, fieldIndex, prop, prop, fieldIndex, prop, prop);
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
      converter.toObject = function toObject2(mtype) {
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
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              prop + "[ks2[j]]"
            )("}");
          } else if (field.repeated) {
            gen("if(m%s&&m%s.length){", prop, prop)("d%s=[]", prop)("for(var j=0;j<m%s.length;++j){", prop);
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              prop + "[j]"
            )("}");
          } else {
            gen("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field.name);
            genValuePartial_toObject(
              gen,
              field,
              /* sorted */
              index,
              prop
            );
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
      init_tampermonkey();
      var wrappers = exports2;
      var Message = require_message();
      wrappers[".google.protobuf.Any"] = {
        fromObject: function(object) {
          if (object && object["@type"]) {
            var name = object["@type"].substring(object["@type"].lastIndexOf("/") + 1);
            var type = this.lookup(name);
            if (type) {
              var type_url = object["@type"].charAt(0) === "." ? object["@type"].slice(1) : object["@type"];
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
        toObject: function(message, options) {
          var googleApi = "type.googleapis.com/";
          var prefix = "";
          var name = "";
          if (options && options.json && message.type_url && message.value) {
            name = message.type_url.substring(message.type_url.lastIndexOf("/") + 1);
            prefix = message.type_url.substring(0, message.type_url.lastIndexOf("/") + 1);
            var type = this.lookup(name);
            if (type)
              message = type.decode(message.value);
          }
          if (!(message instanceof this.ctor) && message instanceof Message) {
            var object = message.\$type.toObject(message, options);
            var messageName = message.\$type.fullName[0] === "." ? message.\$type.fullName.slice(1) : message.\$type.fullName;
            if (prefix === "") {
              prefix = googleApi;
            }
            name = prefix + messageName;
            object["@type"] = name;
            return object;
          }
          return this.toObject(message, options);
        }
      };
    }
  });

  // node_modules/protobufjs/src/type.js
  var require_type = __commonJS({
    "node_modules/protobufjs/src/type.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = Type2;
      var Namespace = require_namespace();
      ((Type2.prototype = Object.create(Namespace.prototype)).constructor = Type2).className = "Type";
      var Enum = require_enum();
      var OneOf = require_oneof();
      var Field = require_field();
      var MapField = require_mapfield();
      var Service = require_service2();
      var Message = require_message();
      var Reader = require_reader();
      var Writer = require_writer();
      var util = require_util();
      var encoder = require_encoder();
      var decoder = require_decoder();
      var verifier = require_verifier();
      var converter = require_converter();
      var wrappers = require_wrappers();
      function Type2(name, options) {
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
      Object.defineProperties(Type2.prototype, {
        /**
         * Message fields by id.
         * @name Type#fieldsById
         * @type {Object.<number,Field>}
         * @readonly
         */
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
        /**
         * Fields of this message as an array for iteration.
         * @name Type#fieldsArray
         * @type {Field[]}
         * @readonly
         */
        fieldsArray: {
          get: function() {
            return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
          }
        },
        /**
         * Oneofs of this message as an array for iteration.
         * @name Type#oneofsArray
         * @type {OneOf[]}
         * @readonly
         */
        oneofsArray: {
          get: function() {
            return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
          }
        },
        /**
         * The registered constructor, if any registered, otherwise a generic constructor.
         * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
         * @name Type#ctor
         * @type {Constructor<{}>}
         */
        ctor: {
          get: function() {
            return this._ctor || (this.ctor = Type2.generateConstructor(this)());
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
            for (; i < /* initializes */
            this.fieldsArray.length; ++i)
              this._fieldsArray[i].resolve();
            var ctorProperties = {};
            for (i = 0; i < /* initializes */
            this.oneofsArray.length; ++i)
              ctorProperties[this._oneofsArray[i].resolve().name] = {
                get: util.oneOfGetter(this._oneofsArray[i].oneof),
                set: util.oneOfSetter(this._oneofsArray[i].oneof)
              };
            if (i)
              Object.defineProperties(ctor.prototype, ctorProperties);
          }
        }
      });
      Type2.generateConstructor = function generateConstructor(mtype) {
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
      Type2.fromJSON = function fromJSON(name, json) {
        var type = new Type2(name, json.options);
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
              // most to least likely
              (nested.id !== void 0 ? Field.fromJSON : nested.fields !== void 0 ? Type2.fromJSON : nested.values !== void 0 ? Enum.fromJSON : nested.methods !== void 0 ? Service.fromJSON : Namespace.fromJSON)(names[i], nested)
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
      Type2.prototype.toJSON = function toJSON(toJSONOptions) {
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
      Type2.prototype.resolveAll = function resolveAll() {
        var fields = this.fieldsArray, i = 0;
        while (i < fields.length)
          fields[i++].resolve();
        var oneofs = this.oneofsArray;
        i = 0;
        while (i < oneofs.length)
          oneofs[i++].resolve();
        return Namespace.prototype.resolveAll.call(this);
      };
      Type2.prototype.get = function get(name) {
        return this.fields[name] || this.oneofs && this.oneofs[name] || this.nested && this.nested[name] || null;
      };
      Type2.prototype.add = function add(object) {
        if (this.get(object.name))
          throw Error("duplicate name '" + object.name + "' in " + this);
        if (object instanceof Field && object.extend === void 0) {
          if (this._fieldsById ? (
            /* istanbul ignore next */
            this._fieldsById[object.id]
          ) : this.fieldsById[object.id])
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
      Type2.prototype.remove = function remove(object) {
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
      Type2.prototype.isReservedId = function isReservedId(id) {
        return Namespace.isReservedId(this.reserved, id);
      };
      Type2.prototype.isReservedName = function isReservedName(name) {
        return Namespace.isReservedName(this.reserved, name);
      };
      Type2.prototype.create = function create(properties) {
        return new this.ctor(properties);
      };
      Type2.prototype.setup = function setup() {
        var fullName = this.fullName, types = [];
        for (var i = 0; i < /* initializes */
        this.fieldsArray.length; ++i)
          types.push(this._fieldsArray[i].resolve().resolvedType);
        this.encode = encoder(this)({
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
      Type2.prototype.encode = function encode_setup(message, writer) {
        return this.setup().encode(message, writer);
      };
      Type2.prototype.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
      };
      Type2.prototype.decode = function decode_setup(reader, length2) {
        return this.setup().decode(reader, length2);
      };
      Type2.prototype.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof Reader))
          reader = Reader.create(reader);
        return this.decode(reader, reader.uint32());
      };
      Type2.prototype.verify = function verify_setup(message) {
        return this.setup().verify(message);
      };
      Type2.prototype.fromObject = function fromObject(object) {
        return this.setup().fromObject(object);
      };
      Type2.prototype.toObject = function toObject2(message, options) {
        return this.setup().toObject(message, options);
      };
      Type2.d = function decorateType(typeName) {
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
      init_tampermonkey();
      module2.exports = Root2;
      var Namespace = require_namespace();
      ((Root2.prototype = Object.create(Namespace.prototype)).constructor = Root2).className = "Root";
      var Field = require_field();
      var Enum = require_enum();
      var OneOf = require_oneof();
      var util = require_util();
      var Type2;
      var parse;
      var common;
      function Root2(options) {
        Namespace.call(this, "", options);
        this.deferred = [];
        this.files = [];
      }
      Root2.fromJSON = function fromJSON(json, root) {
        if (!root)
          root = new Root2();
        if (json.options)
          root.setOptions(json.options);
        return root.addJSON(json.nested);
      };
      Root2.prototype.resolvePath = util.path.resolve;
      Root2.prototype.fetch = util.fetch;
      function SYNC() {
      }
      Root2.prototype.load = function load2(filename, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = void 0;
        }
        var self2 = this;
        if (!callback)
          return util.asPromise(load2, self2, filename, options);
        var sync = callback === SYNC;
        function finish(err, root) {
          if (!callback)
            return;
          var cb = callback;
          callback = null;
          if (sync)
            throw err;
          cb(err, root);
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
          filename2 = getBundledFileName(filename2) || filename2;
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
      Root2.prototype.loadSync = function loadSync(filename, options) {
        if (!util.isNode)
          throw Error("not supported");
        return this.load(filename, options, SYNC);
      };
      Root2.prototype.resolveAll = function resolveAll() {
        if (this.deferred.length)
          throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
            return "'extend " + field.extend + "' in " + field.parent.fullName;
          }).join(", "));
        return Namespace.prototype.resolveAll.call(this);
      };
      var exposeRe = /^[A-Z]/;
      function tryHandleExtension(root, field) {
        var extendedType = field.parent.lookup(field.extend);
        if (extendedType) {
          var sisterField = new Field(field.fullName, field.id, field.type, field.rule, void 0, field.options);
          if (extendedType.get(sisterField.name)) {
            return true;
          }
          sisterField.declaringField = field;
          field.extensionField = sisterField;
          extendedType.add(sisterField);
          return true;
        }
        return false;
      }
      Root2.prototype._handleAdd = function _handleAdd(object) {
        if (object instanceof Field) {
          if (
            /* an extension field (implies not part of a oneof) */
            object.extend !== void 0 && /* not already handled */
            !object.extensionField
          ) {
            if (!tryHandleExtension(this, object))
              this.deferred.push(object);
          }
        } else if (object instanceof Enum) {
          if (exposeRe.test(object.name))
            object.parent[object.name] = object.values;
        } else if (!(object instanceof OneOf)) {
          if (object instanceof Type2)
            for (var i = 0; i < this.deferred.length; )
              if (tryHandleExtension(this, this.deferred[i]))
                this.deferred.splice(i, 1);
              else
                ++i;
          for (var j = 0; j < /* initializes */
          object.nestedArray.length; ++j)
            this._handleAdd(object._nestedArray[j]);
          if (exposeRe.test(object.name))
            object.parent[object.name] = object;
        }
      };
      Root2.prototype._handleRemove = function _handleRemove(object) {
        if (object instanceof Field) {
          if (
            /* an extension field */
            object.extend !== void 0
          ) {
            if (
              /* already handled */
              object.extensionField
            ) {
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
          for (var i = 0; i < /* initializes */
          object.nestedArray.length; ++i)
            this._handleRemove(object._nestedArray[i]);
          if (exposeRe.test(object.name))
            delete object.parent[object.name];
        }
      };
      Root2._configure = function(Type_, parse_, common_) {
        Type2 = Type_;
        parse = parse_;
        common = common_;
      };
    }
  });

  // node_modules/protobufjs/src/util.js
  var require_util = __commonJS({
    "node_modules/protobufjs/src/util.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      var util = module2.exports = require_minimal();
      var roots = require_roots();
      var Type2;
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
      util.toObject = function toObject2(array) {
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
        if (!Type2)
          Type2 = require_type();
        var type = new Type2(typeName || ctor.name);
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
      util.setProperty = function setProperty(dst, path, value) {
        function setProp(dst2, path2, value2) {
          var part = path2.shift();
          if (part === "__proto__") {
            return dst2;
          }
          if (path2.length > 0) {
            dst2[part] = setProp(dst2[part] || {}, path2, value2);
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
        if (!path)
          throw TypeError("path must be specified");
        path = path.split(".");
        return setProp(dst, path, value);
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
      init_tampermonkey();
      module2.exports = ReflectionObject;
      ReflectionObject.className = "ReflectionObject";
      var util = require_util();
      var Root2;
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
        /**
         * Reference to the root namespace.
         * @name ReflectionObject#root
         * @type {Root}
         * @readonly
         */
        root: {
          get: function() {
            var ptr = this;
            while (ptr.parent !== null)
              ptr = ptr.parent;
            return ptr;
          }
        },
        /**
         * Full name including leading dot.
         * @name ReflectionObject#fullName
         * @type {string}
         * @readonly
         */
        fullName: {
          get: function() {
            var path = [this.name], ptr = this.parent;
            while (ptr) {
              path.unshift(ptr.name);
              ptr = ptr.parent;
            }
            return path.join(".");
          }
        }
      });
      ReflectionObject.prototype.toJSON = /* istanbul ignore next */
      function toJSON() {
        throw Error();
      };
      ReflectionObject.prototype.onAdd = function onAdd(parent) {
        if (this.parent && this.parent !== parent)
          this.parent.remove(this);
        this.parent = parent;
        this.resolved = false;
        var root = parent.root;
        if (root instanceof Root2)
          root._handleAdd(this);
      };
      ReflectionObject.prototype.onRemove = function onRemove(parent) {
        var root = parent.root;
        if (root instanceof Root2)
          root._handleRemove(this);
        this.parent = null;
        this.resolved = false;
      };
      ReflectionObject.prototype.resolve = function resolve() {
        if (this.resolved)
          return this;
        if (this.root instanceof Root2)
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
      ReflectionObject.prototype.toString = function toString2() {
        var className = this.constructor.className, fullName = this.fullName;
        if (fullName.length)
          return className + " " + fullName;
        return className;
      };
      ReflectionObject._configure = function(Root_) {
        Root2 = Root_;
      };
    }
  });

  // node_modules/protobufjs/src/enum.js
  var require_enum = __commonJS({
    "node_modules/protobufjs/src/enum.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = Enum;
      var ReflectionObject = require_object();
      ((Enum.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum).className = "Enum";
      var Namespace = require_namespace();
      var util = require_util();
      function Enum(name, values, options, comment, comments, valuesOptions) {
        ReflectionObject.call(this, name, options);
        if (values && typeof values !== "object")
          throw TypeError("values must be an object");
        this.valuesById = {};
        this.values = Object.create(this.valuesById);
        this.comment = comment;
        this.comments = comments || {};
        this.valuesOptions = valuesOptions;
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
          "valuesOptions",
          this.valuesOptions,
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
      Enum.prototype.add = function add(name, id, comment, options) {
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
        if (options) {
          if (this.valuesOptions === void 0)
            this.valuesOptions = {};
          this.valuesOptions[name] = options || null;
        }
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
        if (this.valuesOptions)
          delete this.valuesOptions[name];
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
      init_tampermonkey();
      module2.exports = encoder;
      var Enum = require_enum();
      var types = require_types();
      var util = require_util();
      function genTypePartial(gen, field, fieldIndex, ref) {
        return field.resolvedType.group ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
      }
      function encoder(mtype) {
        var gen = util.codegen(["m", "w"], mtype.name + "\$encode")("if(!w)")("w=Writer.create()");
        var i, ref;
        var fields = (
          /* initializes */
          mtype.fieldsArray.slice().sort(util.compareFieldsById)
        );
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
      init_tampermonkey();
      var protobuf = module2.exports = require_index_minimal();
      protobuf.build = "light";
      function load2(filename, root, callback) {
        if (typeof root === "function") {
          callback = root;
          root = new protobuf.Root();
        } else if (!root)
          root = new protobuf.Root();
        return root.load(filename, callback);
      }
      protobuf.load = load2;
      function loadSync(filename, root) {
        if (!root)
          root = new protobuf.Root();
        return root.loadSync(filename);
      }
      protobuf.loadSync = loadSync;
      protobuf.encoder = require_encoder();
      protobuf.decoder = require_decoder();
      protobuf.verifier = require_verifier();
      protobuf.converter = require_converter();
      protobuf.ReflectionObject = require_object();
      protobuf.Namespace = require_namespace();
      protobuf.Root = require_root();
      protobuf.Enum = require_enum();
      protobuf.Type = require_type();
      protobuf.Field = require_field();
      protobuf.OneOf = require_oneof();
      protobuf.MapField = require_mapfield();
      protobuf.Service = require_service2();
      protobuf.Method = require_method();
      protobuf.Message = require_message();
      protobuf.wrappers = require_wrappers();
      protobuf.types = require_types();
      protobuf.util = require_util();
      protobuf.ReflectionObject._configure(protobuf.Root);
      protobuf.Namespace._configure(protobuf.Type, protobuf.Service, protobuf.Enum);
      protobuf.Root._configure(protobuf.Type);
      protobuf.Field._configure(protobuf.Type);
    }
  });

  // node_modules/protobufjs/light.js
  var require_light = __commonJS({
    "node_modules/protobufjs/light.js"(exports2, module2) {
      "use strict";
      init_tampermonkey();
      module2.exports = require_index_light();
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/value-types.js
  var require_value_types = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/value-types.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var NewLine = "\\n";
      exports2.NewLine = NewLine;
      var ListType;
      (function(ListType2) {
        ListType2["Ordered"] = "ordered";
        ListType2["Bullet"] = "bullet";
        ListType2["Checked"] = "checked";
        ListType2["Unchecked"] = "unchecked";
      })(ListType || (ListType = {}));
      exports2.ListType = ListType;
      var ScriptType;
      (function(ScriptType2) {
        ScriptType2["Sub"] = "sub";
        ScriptType2["Super"] = "super";
      })(ScriptType || (ScriptType = {}));
      exports2.ScriptType = ScriptType;
      var DirectionType;
      (function(DirectionType2) {
        DirectionType2["Rtl"] = "rtl";
      })(DirectionType || (DirectionType = {}));
      exports2.DirectionType = DirectionType;
      var AlignType;
      (function(AlignType2) {
        AlignType2["Left"] = "left";
        AlignType2["Center"] = "center";
        AlignType2["Right"] = "right";
        AlignType2["Justify"] = "justify";
      })(AlignType || (AlignType = {}));
      exports2.AlignType = AlignType;
      var DataType;
      (function(DataType2) {
        DataType2["Image"] = "image";
        DataType2["Video"] = "video";
        DataType2["Formula"] = "formula";
        DataType2["Text"] = "text";
      })(DataType || (DataType = {}));
      exports2.DataType = DataType;
      var GroupType;
      (function(GroupType2) {
        GroupType2["Block"] = "block";
        GroupType2["InlineGroup"] = "inline-group";
        GroupType2["List"] = "list";
        GroupType2["Video"] = "video";
        GroupType2["Table"] = "table";
      })(GroupType || (GroupType = {}));
      exports2.GroupType = GroupType;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/InsertData.js
  var require_InsertData = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/InsertData.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var InsertDataQuill = function() {
        function InsertDataQuill2(type, value) {
          this.type = type;
          this.value = value;
        }
        return InsertDataQuill2;
      }();
      exports2.InsertDataQuill = InsertDataQuill;
      var InsertDataCustom = function() {
        function InsertDataCustom2(type, value) {
          this.type = type;
          this.value = value;
        }
        return InsertDataCustom2;
      }();
      exports2.InsertDataCustom = InsertDataCustom;
    }
  });

  // node_modules/lodash.isequal/index.js
  var require_lodash = __commonJS({
    "node_modules/lodash.isequal/index.js"(exports2, module2) {
      init_tampermonkey();
      var LARGE_ARRAY_SIZE = 200;
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var COMPARE_PARTIAL_FLAG = 1;
      var COMPARE_UNORDERED_FLAG = 2;
      var MAX_SAFE_INTEGER = 9007199254740991;
      var argsTag = "[object Arguments]";
      var arrayTag = "[object Array]";
      var asyncTag = "[object AsyncFunction]";
      var boolTag = "[object Boolean]";
      var dateTag = "[object Date]";
      var errorTag = "[object Error]";
      var funcTag = "[object Function]";
      var genTag = "[object GeneratorFunction]";
      var mapTag = "[object Map]";
      var numberTag = "[object Number]";
      var nullTag = "[object Null]";
      var objectTag = "[object Object]";
      var promiseTag = "[object Promise]";
      var proxyTag = "[object Proxy]";
      var regexpTag = "[object RegExp]";
      var setTag = "[object Set]";
      var stringTag = "[object String]";
      var symbolTag = "[object Symbol]";
      var undefinedTag = "[object Undefined]";
      var weakMapTag = "[object WeakMap]";
      var arrayBufferTag = "[object ArrayBuffer]";
      var dataViewTag = "[object DataView]";
      var float32Tag = "[object Float32Array]";
      var float64Tag = "[object Float64Array]";
      var int8Tag = "[object Int8Array]";
      var int16Tag = "[object Int16Array]";
      var int32Tag = "[object Int32Array]";
      var uint8Tag = "[object Uint8Array]";
      var uint8ClampedTag = "[object Uint8ClampedArray]";
      var uint16Tag = "[object Uint16Array]";
      var uint32Tag = "[object Uint32Array]";
      var reRegExpChar = /[\\\\^\$.*+?()[\\]{}|]/g;
      var reIsHostCtor = /^\\[object .+?Constructor\\]\$/;
      var reIsUint = /^(?:0|[1-9]\\d*)\$/;
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
      var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var nodeUtil = function() {
        try {
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      function arrayFilter(array, predicate) {
        var index = -1, length2 = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length2) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function arrayPush(array, values) {
        var index = -1, length2 = values.length, offset2 = array.length;
        while (++index < length2) {
          array[offset2 + index] = values[index];
        }
        return array;
      }
      function arraySome(array, predicate) {
        var index = -1, length2 = array == null ? 0 : array.length;
        while (++index < length2) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      function getValue(object, key) {
        return object == null ? void 0 : object[key];
      }
      function mapToArray(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      function setToArray(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      var arrayProto = Array.prototype;
      var funcProto = Function.prototype;
      var objectProto = Object.prototype;
      var coreJsData = root["__core-js_shared__"];
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var maskSrcKey = function() {
        var uid2 = /[^.]+\$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid2 ? "Symbol(src)_1." + uid2 : "";
      }();
      var nativeObjectToString = objectProto.toString;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\\\\$&").replace(/hasOwnProperty|(function).*?(?=\\\\\\()| for .+?(?=\\\\\\])/g, "\$1.*?") + "\$"
      );
      var Buffer2 = moduleExports ? root.Buffer : void 0;
      var Symbol2 = root.Symbol;
      var Uint8Array2 = root.Uint8Array;
      var propertyIsEnumerable = objectProto.propertyIsEnumerable;
      var splice = arrayProto.splice;
      var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
      var nativeGetSymbols = Object.getOwnPropertySymbols;
      var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
      var nativeKeys = overArg(Object.keys, Object);
      var DataView = getNative(root, "DataView");
      var Map = getNative(root, "Map");
      var Promise2 = getNative(root, "Promise");
      var Set2 = getNative(root, "Set");
      var WeakMap = getNative(root, "WeakMap");
      var nativeCreate = getNative(Object, "create");
      var dataViewCtorString = toSource(DataView);
      var mapCtorString = toSource(Map);
      var promiseCtorString = toSource(Promise2);
      var setCtorString = toSource(Set2);
      var weakMapCtorString = toSource(WeakMap);
      var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
      var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
      function Hash(entries) {
        var index = -1, length2 = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length2) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? void 0 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : void 0;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index = -1, length2 = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length2) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index = -1, length2 = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length2) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map || ListCache)(),
          "string": new Hash()
        };
      }
      function mapCacheDelete(key) {
        var result = getMapData(this, key)["delete"](key);
        this.size -= result ? 1 : 0;
        return result;
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        var data = getMapData(this, key), size = data.size;
        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function SetCache(values) {
        var index = -1, length2 = values == null ? 0 : values.length;
        this.__data__ = new MapCache();
        while (++index < length2) {
          this.add(values[index]);
        }
      }
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key) {
        var data = this.__data__, result = data["delete"](key);
        this.size = data.size;
        return result;
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      function stackSet(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray2(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length2 = result.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable \`arguments.length\` in strict mode.
          (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
          isIndex(key, length2)))) {
            result.push(key);
          }
        }
        return result;
      }
      function assocIndexOf(array, key) {
        var length2 = array.length;
        while (length2--) {
          if (eq(array[length2][0], key)) {
            return length2;
          }
        }
        return -1;
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray2(object) ? result : arrayPush(result, symbolsFunc(object));
      }
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
      }
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray2(object), othIsArr = isArray2(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
      function baseIsNative(value) {
        if (!isObject2(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty.call(object, key) && key != "constructor") {
            result.push(key);
          }
        }
        return result;
      }
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var stacked = stack.get(array);
        if (stacked && stack.get(other)) {
          return stacked == other;
        }
        var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
        stack.set(array, other);
        stack.set(other, array);
        while (++index < arrLength) {
          var arrValue = array[index], othValue = other[index];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== void 0) {
            if (compared) {
              continue;
            }
            result = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result = false;
            break;
          }
        }
        stack["delete"](array);
        stack["delete"](other);
        return result;
      }
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
              return false;
            }
            return true;
          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);
          case errorTag:
            return object.name == other.name && object.message == other.message;
          case regexpTag:
          case stringTag:
            return object == other + "";
          case mapTag:
            var convert = mapToArray;
          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG;
            stack.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
            return false;
          }
        }
        var stacked = stack.get(object);
        if (stacked && stack.get(other)) {
          return stacked == other;
        }
        var result = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key], othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
          }
          if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result = false;
            break;
          }
          skipCtor || (skipCtor = key == "constructor");
        }
        if (result && !skipCtor) {
          var objCtor = object.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result = false;
          }
        }
        stack["delete"](object);
        stack["delete"](other);
        return result;
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
        try {
          value[symToStringTag] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result = nativeObjectToString.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag] = tag;
          } else {
            delete value[symToStringTag];
          }
        }
        return result;
      }
      var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object(object);
        return arrayFilter(nativeGetSymbols(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
        getTag = function(value) {
          var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result;
        };
      }
      function isIndex(value, length2) {
        length2 = length2 == null ? MAX_SAFE_INTEGER : length2;
        return !!length2 && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length2);
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
        return value === proto;
      }
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var isArguments = baseIsArguments(function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
      };
      var isArray2 = Array.isArray;
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      var isBuffer = nativeIsBuffer || stubFalse;
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }
      function isFunction(value) {
        if (!isObject2(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isObject2(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function stubArray() {
        return [];
      }
      function stubFalse() {
        return false;
      }
      module2.exports = isEqual;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/DeltaInsertOp.js
  var require_DeltaInsertOp = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/DeltaInsertOp.js"(exports2) {
      "use strict";
      init_tampermonkey();
      var __importDefault = exports2 && exports2.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var value_types_1 = require_value_types();
      var InsertData_1 = require_InsertData();
      var lodash_isequal_1 = __importDefault(require_lodash());
      var DeltaInsertOp = function() {
        function DeltaInsertOp2(insertVal, attrs) {
          if (typeof insertVal === "string") {
            insertVal = new InsertData_1.InsertDataQuill(value_types_1.DataType.Text, insertVal + "");
          }
          this.insert = insertVal;
          this.attributes = attrs || {};
        }
        DeltaInsertOp2.createNewLineOp = function() {
          return new DeltaInsertOp2(value_types_1.NewLine);
        };
        DeltaInsertOp2.prototype.isContainerBlock = function() {
          return this.isBlockquote() || this.isList() || this.isTable() || this.isCodeBlock() || this.isHeader() || this.isBlockAttribute() || this.isCustomTextBlock();
        };
        DeltaInsertOp2.prototype.isBlockAttribute = function() {
          var attrs = this.attributes;
          return !!(attrs.align || attrs.direction || attrs.indent);
        };
        DeltaInsertOp2.prototype.isBlockquote = function() {
          return !!this.attributes.blockquote;
        };
        DeltaInsertOp2.prototype.isHeader = function() {
          return !!this.attributes.header;
        };
        DeltaInsertOp2.prototype.isTable = function() {
          return !!this.attributes.table;
        };
        DeltaInsertOp2.prototype.isSameHeaderAs = function(op) {
          return op.attributes.header === this.attributes.header && this.isHeader();
        };
        DeltaInsertOp2.prototype.hasSameAdiAs = function(op) {
          return this.attributes.align === op.attributes.align && this.attributes.direction === op.attributes.direction && this.attributes.indent === op.attributes.indent;
        };
        DeltaInsertOp2.prototype.hasSameIndentationAs = function(op) {
          return this.attributes.indent === op.attributes.indent;
        };
        DeltaInsertOp2.prototype.hasSameAttr = function(op) {
          return lodash_isequal_1.default(this.attributes, op.attributes);
        };
        DeltaInsertOp2.prototype.hasHigherIndentThan = function(op) {
          return (Number(this.attributes.indent) || 0) > (Number(op.attributes.indent) || 0);
        };
        DeltaInsertOp2.prototype.isInline = function() {
          return !(this.isContainerBlock() || this.isVideo() || this.isCustomEmbedBlock());
        };
        DeltaInsertOp2.prototype.isCodeBlock = function() {
          return !!this.attributes["code-block"];
        };
        DeltaInsertOp2.prototype.hasSameLangAs = function(op) {
          return this.attributes["code-block"] === op.attributes["code-block"];
        };
        DeltaInsertOp2.prototype.isJustNewline = function() {
          return this.insert.value === value_types_1.NewLine;
        };
        DeltaInsertOp2.prototype.isList = function() {
          return this.isOrderedList() || this.isBulletList() || this.isCheckedList() || this.isUncheckedList();
        };
        DeltaInsertOp2.prototype.isOrderedList = function() {
          return this.attributes.list === value_types_1.ListType.Ordered;
        };
        DeltaInsertOp2.prototype.isBulletList = function() {
          return this.attributes.list === value_types_1.ListType.Bullet;
        };
        DeltaInsertOp2.prototype.isCheckedList = function() {
          return this.attributes.list === value_types_1.ListType.Checked;
        };
        DeltaInsertOp2.prototype.isUncheckedList = function() {
          return this.attributes.list === value_types_1.ListType.Unchecked;
        };
        DeltaInsertOp2.prototype.isACheckList = function() {
          return this.attributes.list == value_types_1.ListType.Unchecked || this.attributes.list === value_types_1.ListType.Checked;
        };
        DeltaInsertOp2.prototype.isSameListAs = function(op) {
          return !!op.attributes.list && (this.attributes.list === op.attributes.list || op.isACheckList() && this.isACheckList());
        };
        DeltaInsertOp2.prototype.isSameTableRowAs = function(op) {
          return !!op.isTable() && this.isTable() && this.attributes.table === op.attributes.table;
        };
        DeltaInsertOp2.prototype.isText = function() {
          return this.insert.type === value_types_1.DataType.Text;
        };
        DeltaInsertOp2.prototype.isImage = function() {
          return this.insert.type === value_types_1.DataType.Image;
        };
        DeltaInsertOp2.prototype.isFormula = function() {
          return this.insert.type === value_types_1.DataType.Formula;
        };
        DeltaInsertOp2.prototype.isVideo = function() {
          return this.insert.type === value_types_1.DataType.Video;
        };
        DeltaInsertOp2.prototype.isLink = function() {
          return this.isText() && !!this.attributes.link;
        };
        DeltaInsertOp2.prototype.isCustomEmbed = function() {
          return this.insert instanceof InsertData_1.InsertDataCustom;
        };
        DeltaInsertOp2.prototype.isCustomEmbedBlock = function() {
          return this.isCustomEmbed() && !!this.attributes.renderAsBlock;
        };
        DeltaInsertOp2.prototype.isCustomTextBlock = function() {
          return this.isText() && !!this.attributes.renderAsBlock;
        };
        DeltaInsertOp2.prototype.isMentions = function() {
          return this.isText() && !!this.attributes.mentions;
        };
        return DeltaInsertOp2;
      }();
      exports2.DeltaInsertOp = DeltaInsertOp;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/mentions/MentionSanitizer.js
  var require_MentionSanitizer = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/mentions/MentionSanitizer.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var OpAttributeSanitizer_1 = require_OpAttributeSanitizer();
      var MentionSanitizer = function() {
        function MentionSanitizer2() {
        }
        MentionSanitizer2.sanitize = function(dirtyObj, sanitizeOptions) {
          var cleanObj = {};
          if (!dirtyObj || typeof dirtyObj !== "object") {
            return cleanObj;
          }
          if (dirtyObj.class && MentionSanitizer2.IsValidClass(dirtyObj.class)) {
            cleanObj.class = dirtyObj.class;
          }
          if (dirtyObj.id && MentionSanitizer2.IsValidId(dirtyObj.id)) {
            cleanObj.id = dirtyObj.id;
          }
          if (MentionSanitizer2.IsValidTarget(dirtyObj.target + "")) {
            cleanObj.target = dirtyObj.target;
          }
          if (dirtyObj.avatar) {
            cleanObj.avatar = OpAttributeSanitizer_1.OpAttributeSanitizer.sanitizeLinkUsingOptions(dirtyObj.avatar + "", sanitizeOptions);
          }
          if (dirtyObj["end-point"]) {
            cleanObj["end-point"] = OpAttributeSanitizer_1.OpAttributeSanitizer.sanitizeLinkUsingOptions(dirtyObj["end-point"] + "", sanitizeOptions);
          }
          if (dirtyObj.slug) {
            cleanObj.slug = dirtyObj.slug + "";
          }
          return cleanObj;
        };
        MentionSanitizer2.IsValidClass = function(classAttr) {
          return !!classAttr.match(/^[a-zA-Z0-9_\\-]{1,500}\$/i);
        };
        MentionSanitizer2.IsValidId = function(idAttr) {
          return !!idAttr.match(/^[a-zA-Z0-9_\\-\\:\\.]{1,500}\$/i);
        };
        MentionSanitizer2.IsValidTarget = function(target) {
          return ["_self", "_blank", "_parent", "_top"].indexOf(target) > -1;
        };
        return MentionSanitizer2;
      }();
      exports2.MentionSanitizer = MentionSanitizer;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/helpers/url.js
  var require_url = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/helpers/url.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      function sanitize(str) {
        var val = str;
        val = val.replace(/^\\s*/gm, "");
        var whiteList = /^((https?|s?ftp|file|blob|mailto|tel):|#|\\/|data:image\\/)/;
        if (whiteList.test(val)) {
          return val;
        }
        return "unsafe:" + val;
      }
      exports2.sanitize = sanitize;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/funcs-html.js
  var require_funcs_html = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/funcs-html.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var EncodeTarget;
      (function(EncodeTarget2) {
        EncodeTarget2[EncodeTarget2["Html"] = 0] = "Html";
        EncodeTarget2[EncodeTarget2["Url"] = 1] = "Url";
      })(EncodeTarget || (EncodeTarget = {}));
      function makeStartTag(tag, attrs) {
        if (attrs === void 0) {
          attrs = void 0;
        }
        if (!tag) {
          return "";
        }
        var attrsStr = "";
        if (attrs) {
          var arrAttrs = [].concat(attrs);
          attrsStr = arrAttrs.map(function(attr) {
            return attr.key + (attr.value ? '="' + attr.value + '"' : "");
          }).join(" ");
        }
        var closing = ">";
        if (tag === "img" || tag === "br") {
          closing = "/>";
        }
        return attrsStr ? "<" + tag + " " + attrsStr + closing : "<" + tag + closing;
      }
      exports2.makeStartTag = makeStartTag;
      function makeEndTag(tag) {
        if (tag === void 0) {
          tag = "";
        }
        return tag && "</" + tag + ">" || "";
      }
      exports2.makeEndTag = makeEndTag;
      function decodeHtml(str) {
        return encodeMappings(EncodeTarget.Html).reduce(decodeMapping, str);
      }
      exports2.decodeHtml = decodeHtml;
      function encodeHtml(str, preventDoubleEncoding) {
        if (preventDoubleEncoding === void 0) {
          preventDoubleEncoding = true;
        }
        if (preventDoubleEncoding) {
          str = decodeHtml(str);
        }
        return encodeMappings(EncodeTarget.Html).reduce(encodeMapping, str);
      }
      exports2.encodeHtml = encodeHtml;
      function encodeLink(str) {
        var linkMaps = encodeMappings(EncodeTarget.Url);
        var decoded = linkMaps.reduce(decodeMapping, str);
        return linkMaps.reduce(encodeMapping, decoded);
      }
      exports2.encodeLink = encodeLink;
      function encodeMappings(mtype) {
        var maps = [
          ["&", "&amp;"],
          ["<", "&lt;"],
          [">", "&gt;"],
          ['"', "&quot;"],
          ["'", "&#x27;"],
          ["\\\\/", "&#x2F;"],
          ["\\\\(", "&#40;"],
          ["\\\\)", "&#41;"]
        ];
        if (mtype === EncodeTarget.Html) {
          return maps.filter(function(_a) {
            var v = _a[0], _ = _a[1];
            return v.indexOf("(") === -1 && v.indexOf(")") === -1;
          });
        } else {
          return maps.filter(function(_a) {
            var v = _a[0], _ = _a[1];
            return v.indexOf("/") === -1;
          });
        }
      }
      function encodeMapping(str, mapping) {
        return str.replace(new RegExp(mapping[0], "g"), mapping[1]);
      }
      function decodeMapping(str, mapping) {
        return str.replace(new RegExp(mapping[1], "g"), mapping[0].replace("\\\\", ""));
      }
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/helpers/array.js
  var require_array = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/helpers/array.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      function preferSecond(arr2) {
        if (arr2.length === 0) {
          return null;
        }
        return arr2.length >= 2 ? arr2[1] : arr2[0];
      }
      exports2.preferSecond = preferSecond;
      function flatten(arr2) {
        return arr2.reduce(function(pv, v) {
          return pv.concat(Array.isArray(v) ? flatten(v) : v);
        }, []);
      }
      exports2.flatten = flatten;
      function find(arr2, predicate) {
        if (Array.prototype.find) {
          return Array.prototype.find.call(arr2, predicate);
        }
        for (var i = 0; i < arr2.length; i++) {
          if (predicate(arr2[i]))
            return arr2[i];
        }
        return void 0;
      }
      exports2.find = find;
      function groupConsecutiveElementsWhile(arr2, predicate) {
        var groups = [];
        var currElm, currGroup;
        for (var i = 0; i < arr2.length; i++) {
          currElm = arr2[i];
          if (i > 0 && predicate(currElm, arr2[i - 1])) {
            currGroup = groups[groups.length - 1];
            currGroup.push(currElm);
          } else {
            groups.push([currElm]);
          }
        }
        return groups.map(function(g) {
          return g.length === 1 ? g[0] : g;
        });
      }
      exports2.groupConsecutiveElementsWhile = groupConsecutiveElementsWhile;
      function sliceFromReverseWhile(arr2, startIndex, predicate) {
        var result = {
          elements: [],
          sliceStartsAt: -1
        };
        for (var i = startIndex; i >= 0; i--) {
          if (!predicate(arr2[i])) {
            break;
          }
          result.sliceStartsAt = i;
          result.elements.unshift(arr2[i]);
        }
        return result;
      }
      exports2.sliceFromReverseWhile = sliceFromReverseWhile;
      function intersperse(arr2, item) {
        return arr2.reduce(function(pv, v, index) {
          pv.push(v);
          if (index < arr2.length - 1) {
            pv.push(item);
          }
          return pv;
        }, []);
      }
      exports2.intersperse = intersperse;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/OpAttributeSanitizer.js
  var require_OpAttributeSanitizer = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/OpAttributeSanitizer.js"(exports2) {
      "use strict";
      init_tampermonkey();
      var __importStar = exports2 && exports2.__importStar || function(mod2) {
        if (mod2 && mod2.__esModule)
          return mod2;
        var result = {};
        if (mod2 != null) {
          for (var k in mod2)
            if (Object.hasOwnProperty.call(mod2, k))
              result[k] = mod2[k];
        }
        result["default"] = mod2;
        return result;
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var value_types_1 = require_value_types();
      var MentionSanitizer_1 = require_MentionSanitizer();
      var url = __importStar(require_url());
      var funcs_html_1 = require_funcs_html();
      var array_1 = require_array();
      var OpAttributeSanitizer = function() {
        function OpAttributeSanitizer2() {
        }
        OpAttributeSanitizer2.sanitize = function(dirtyAttrs, sanitizeOptions) {
          var cleanAttrs = {};
          if (!dirtyAttrs || typeof dirtyAttrs !== "object") {
            return cleanAttrs;
          }
          var booleanAttrs = [
            "bold",
            "italic",
            "underline",
            "strike",
            "code",
            "blockquote",
            "code-block",
            "renderAsBlock"
          ];
          var colorAttrs = ["background", "color"];
          var font = dirtyAttrs.font, size = dirtyAttrs.size, link = dirtyAttrs.link, script = dirtyAttrs.script, list = dirtyAttrs.list, header = dirtyAttrs.header, align = dirtyAttrs.align, direction = dirtyAttrs.direction, indent = dirtyAttrs.indent, mentions = dirtyAttrs.mentions, mention = dirtyAttrs.mention, width = dirtyAttrs.width, target = dirtyAttrs.target, rel = dirtyAttrs.rel;
          var codeBlock = dirtyAttrs["code-block"];
          var sanitizedAttrs = booleanAttrs.concat(colorAttrs, [
            "font",
            "size",
            "link",
            "script",
            "list",
            "header",
            "align",
            "direction",
            "indent",
            "mentions",
            "mention",
            "width",
            "target",
            "rel",
            "code-block"
          ]);
          booleanAttrs.forEach(function(prop) {
            var v = dirtyAttrs[prop];
            if (v) {
              cleanAttrs[prop] = !!v;
            }
          });
          colorAttrs.forEach(function(prop) {
            var val = dirtyAttrs[prop];
            if (val && (OpAttributeSanitizer2.IsValidHexColor(val + "") || OpAttributeSanitizer2.IsValidColorLiteral(val + "") || OpAttributeSanitizer2.IsValidRGBColor(val + ""))) {
              cleanAttrs[prop] = val;
            }
          });
          if (font && OpAttributeSanitizer2.IsValidFontName(font + "")) {
            cleanAttrs.font = font;
          }
          if (size && OpAttributeSanitizer2.IsValidSize(size + "")) {
            cleanAttrs.size = size;
          }
          if (width && OpAttributeSanitizer2.IsValidWidth(width + "")) {
            cleanAttrs.width = width;
          }
          if (link) {
            cleanAttrs.link = OpAttributeSanitizer2.sanitizeLinkUsingOptions(link + "", sanitizeOptions);
          }
          if (target && OpAttributeSanitizer2.isValidTarget(target)) {
            cleanAttrs.target = target;
          }
          if (rel && OpAttributeSanitizer2.IsValidRel(rel)) {
            cleanAttrs.rel = rel;
          }
          if (codeBlock) {
            if (OpAttributeSanitizer2.IsValidLang(codeBlock)) {
              cleanAttrs["code-block"] = codeBlock;
            } else {
              cleanAttrs["code-block"] = !!codeBlock;
            }
          }
          if (script === value_types_1.ScriptType.Sub || value_types_1.ScriptType.Super === script) {
            cleanAttrs.script = script;
          }
          if (list === value_types_1.ListType.Bullet || list === value_types_1.ListType.Ordered || list === value_types_1.ListType.Checked || list === value_types_1.ListType.Unchecked) {
            cleanAttrs.list = list;
          }
          if (Number(header)) {
            cleanAttrs.header = Math.min(Number(header), 6);
          }
          if (array_1.find([value_types_1.AlignType.Center, value_types_1.AlignType.Right, value_types_1.AlignType.Justify, value_types_1.AlignType.Left], function(a) {
            return a === align;
          })) {
            cleanAttrs.align = align;
          }
          if (direction === value_types_1.DirectionType.Rtl) {
            cleanAttrs.direction = direction;
          }
          if (indent && Number(indent)) {
            cleanAttrs.indent = Math.min(Number(indent), 30);
          }
          if (mentions && mention) {
            var sanitizedMention = MentionSanitizer_1.MentionSanitizer.sanitize(mention, sanitizeOptions);
            if (Object.keys(sanitizedMention).length > 0) {
              cleanAttrs.mentions = !!mentions;
              cleanAttrs.mention = mention;
            }
          }
          return Object.keys(dirtyAttrs).reduce(function(cleaned, k) {
            if (sanitizedAttrs.indexOf(k) === -1) {
              cleaned[k] = dirtyAttrs[k];
            }
            return cleaned;
          }, cleanAttrs);
        };
        OpAttributeSanitizer2.sanitizeLinkUsingOptions = function(link, options) {
          var sanitizerFn = function() {
            return void 0;
          };
          if (options && typeof options.urlSanitizer === "function") {
            sanitizerFn = options.urlSanitizer;
          }
          var result = sanitizerFn(link);
          return typeof result === "string" ? result : funcs_html_1.encodeLink(url.sanitize(link));
        };
        OpAttributeSanitizer2.IsValidHexColor = function(colorStr) {
          return !!colorStr.match(/^#([0-9A-F]{6}|[0-9A-F]{3})\$/i);
        };
        OpAttributeSanitizer2.IsValidColorLiteral = function(colorStr) {
          return !!colorStr.match(/^[a-z]{1,50}\$/i);
        };
        OpAttributeSanitizer2.IsValidRGBColor = function(colorStr) {
          var re = /^rgb\\(((0|25[0-5]|2[0-4]\\d|1\\d\\d|0?\\d?\\d),\\s*){2}(0|25[0-5]|2[0-4]\\d|1\\d\\d|0?\\d?\\d)\\)\$/i;
          return !!colorStr.match(re);
        };
        OpAttributeSanitizer2.IsValidFontName = function(fontName) {
          return !!fontName.match(/^[a-z\\s0-9\\- ]{1,30}\$/i);
        };
        OpAttributeSanitizer2.IsValidSize = function(size) {
          return !!size.match(/^[a-z0-9\\-]{1,20}\$/i);
        };
        OpAttributeSanitizer2.IsValidWidth = function(width) {
          return !!width.match(/^[0-9]*(px|em|%)?\$/);
        };
        OpAttributeSanitizer2.isValidTarget = function(target) {
          return !!target.match(/^[_a-zA-Z0-9\\-]{1,50}\$/);
        };
        OpAttributeSanitizer2.IsValidRel = function(relStr) {
          return !!relStr.match(/^[a-zA-Z\\s\\-]{1,250}\$/i);
        };
        OpAttributeSanitizer2.IsValidLang = function(lang) {
          if (typeof lang === "boolean") {
            return true;
          }
          return !!lang.match(/^[a-zA-Z\\s\\-\\\\\\/\\+]{1,50}\$/i);
        };
        return OpAttributeSanitizer2;
      }();
      exports2.OpAttributeSanitizer = OpAttributeSanitizer;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/helpers/string.js
  var require_string = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/helpers/string.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      function tokenizeWithNewLines(str) {
        var NewLine = "\\n";
        if (str === NewLine) {
          return [str];
        }
        var lines = str.split(NewLine);
        if (lines.length === 1) {
          return lines;
        }
        var lastIndex = lines.length - 1;
        return lines.reduce(function(pv, line, ind) {
          if (ind !== lastIndex) {
            if (line !== "") {
              pv = pv.concat(line, NewLine);
            } else {
              pv.push(NewLine);
            }
          } else if (line !== "") {
            pv.push(line);
          }
          return pv;
        }, []);
      }
      exports2.tokenizeWithNewLines = tokenizeWithNewLines;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/helpers/object.js
  var require_object2 = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/helpers/object.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      function assign(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          sources[_i - 1] = arguments[_i];
        }
        if (target == null) {
          throw new TypeError("Cannot convert undefined or null to object");
        }
        var to = Object(target);
        for (var index = 0; index < sources.length; index++) {
          var nextSource = sources[index];
          if (nextSource != null) {
            for (var nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      }
      exports2.assign = assign;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/InsertOpDenormalizer.js
  var require_InsertOpDenormalizer = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/InsertOpDenormalizer.js"(exports2) {
      "use strict";
      init_tampermonkey();
      var __importStar = exports2 && exports2.__importStar || function(mod2) {
        if (mod2 && mod2.__esModule)
          return mod2;
        var result = {};
        if (mod2 != null) {
          for (var k in mod2)
            if (Object.hasOwnProperty.call(mod2, k))
              result[k] = mod2[k];
        }
        result["default"] = mod2;
        return result;
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var value_types_1 = require_value_types();
      var str = __importStar(require_string());
      var obj = __importStar(require_object2());
      var InsertOpDenormalizer = function() {
        function InsertOpDenormalizer2() {
        }
        InsertOpDenormalizer2.denormalize = function(op) {
          if (!op || typeof op !== "object") {
            return [];
          }
          if (typeof op.insert === "object" || op.insert === value_types_1.NewLine) {
            return [op];
          }
          var newlinedArray = str.tokenizeWithNewLines(op.insert + "");
          if (newlinedArray.length === 1) {
            return [op];
          }
          var nlObj = obj.assign({}, op, { insert: value_types_1.NewLine });
          return newlinedArray.map(function(line) {
            if (line === value_types_1.NewLine) {
              return nlObj;
            }
            return obj.assign({}, op, {
              insert: line
            });
          });
        };
        return InsertOpDenormalizer2;
      }();
      exports2.InsertOpDenormalizer = InsertOpDenormalizer;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/InsertOpsConverter.js
  var require_InsertOpsConverter = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/InsertOpsConverter.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var DeltaInsertOp_1 = require_DeltaInsertOp();
      var value_types_1 = require_value_types();
      var InsertData_1 = require_InsertData();
      var OpAttributeSanitizer_1 = require_OpAttributeSanitizer();
      var InsertOpDenormalizer_1 = require_InsertOpDenormalizer();
      var InsertOpsConverter = function() {
        function InsertOpsConverter2() {
        }
        InsertOpsConverter2.convert = function(deltaOps, options) {
          if (!Array.isArray(deltaOps)) {
            return [];
          }
          var denormalizedOps = [].concat.apply([], deltaOps.map(InsertOpDenormalizer_1.InsertOpDenormalizer.denormalize));
          var results = [];
          var insertVal, attributes;
          for (var _i = 0, denormalizedOps_1 = denormalizedOps; _i < denormalizedOps_1.length; _i++) {
            var op = denormalizedOps_1[_i];
            if (!op.insert) {
              continue;
            }
            insertVal = InsertOpsConverter2.convertInsertVal(op.insert, options);
            if (!insertVal) {
              continue;
            }
            attributes = OpAttributeSanitizer_1.OpAttributeSanitizer.sanitize(op.attributes, options);
            results.push(new DeltaInsertOp_1.DeltaInsertOp(insertVal, attributes));
          }
          return results;
        };
        InsertOpsConverter2.convertInsertVal = function(insertPropVal, sanitizeOptions) {
          if (typeof insertPropVal === "string") {
            return new InsertData_1.InsertDataQuill(value_types_1.DataType.Text, insertPropVal);
          }
          if (!insertPropVal || typeof insertPropVal !== "object") {
            return null;
          }
          var keys = Object.keys(insertPropVal);
          if (!keys.length) {
            return null;
          }
          return value_types_1.DataType.Image in insertPropVal ? new InsertData_1.InsertDataQuill(value_types_1.DataType.Image, OpAttributeSanitizer_1.OpAttributeSanitizer.sanitizeLinkUsingOptions(insertPropVal[value_types_1.DataType.Image] + "", sanitizeOptions)) : value_types_1.DataType.Video in insertPropVal ? new InsertData_1.InsertDataQuill(value_types_1.DataType.Video, OpAttributeSanitizer_1.OpAttributeSanitizer.sanitizeLinkUsingOptions(insertPropVal[value_types_1.DataType.Video] + "", sanitizeOptions)) : value_types_1.DataType.Formula in insertPropVal ? new InsertData_1.InsertDataQuill(value_types_1.DataType.Formula, insertPropVal[value_types_1.DataType.Formula]) : new InsertData_1.InsertDataCustom(keys[0], insertPropVal[keys[0]]);
        };
        return InsertOpsConverter2;
      }();
      exports2.InsertOpsConverter = InsertOpsConverter;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/OpToHtmlConverter.js
  var require_OpToHtmlConverter = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/OpToHtmlConverter.js"(exports2) {
      "use strict";
      init_tampermonkey();
      var __importStar = exports2 && exports2.__importStar || function(mod2) {
        if (mod2 && mod2.__esModule)
          return mod2;
        var result = {};
        if (mod2 != null) {
          for (var k in mod2)
            if (Object.hasOwnProperty.call(mod2, k))
              result[k] = mod2[k];
        }
        result["default"] = mod2;
        return result;
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var funcs_html_1 = require_funcs_html();
      var value_types_1 = require_value_types();
      var obj = __importStar(require_object2());
      var arr2 = __importStar(require_array());
      var OpAttributeSanitizer_1 = require_OpAttributeSanitizer();
      var DEFAULT_INLINE_FONTS = {
        serif: "font-family: Georgia, Times New Roman, serif",
        monospace: "font-family: Monaco, Courier New, monospace"
      };
      exports2.DEFAULT_INLINE_STYLES = {
        font: function(value) {
          return DEFAULT_INLINE_FONTS[value] || "font-family:" + value;
        },
        size: {
          small: "font-size: 0.75em",
          large: "font-size: 1.5em",
          huge: "font-size: 2.5em"
        },
        indent: function(value, op) {
          var indentSize = parseInt(value, 10) * 3;
          var side = op.attributes["direction"] === "rtl" ? "right" : "left";
          return "padding-" + side + ":" + indentSize + "em";
        },
        direction: function(value, op) {
          if (value === "rtl") {
            return "direction:rtl" + (op.attributes["align"] ? "" : "; text-align:inherit");
          } else {
            return void 0;
          }
        }
      };
      var OpToHtmlConverter = function() {
        function OpToHtmlConverter2(op, options) {
          this.op = op;
          this.options = obj.assign({}, {
            classPrefix: "ql",
            inlineStyles: void 0,
            encodeHtml: true,
            listItemTag: "li",
            paragraphTag: "p"
          }, options);
        }
        OpToHtmlConverter2.prototype.prefixClass = function(className) {
          if (!this.options.classPrefix) {
            return className + "";
          }
          return this.options.classPrefix + "-" + className;
        };
        OpToHtmlConverter2.prototype.getHtml = function() {
          var parts = this.getHtmlParts();
          return parts.openingTag + parts.content + parts.closingTag;
        };
        OpToHtmlConverter2.prototype.getHtmlParts = function() {
          var _this = this;
          if (this.op.isJustNewline() && !this.op.isContainerBlock()) {
            return { openingTag: "", closingTag: "", content: value_types_1.NewLine };
          }
          var tags = this.getTags(), attrs = this.getTagAttributes();
          if (!tags.length && attrs.length) {
            tags.push(this.options.textTag || "span");
          }
          var beginTags = [], endTags = [];
          var imgTag = "img";
          var isImageLink = function(tag2) {
            return tag2 === imgTag && !!_this.op.attributes.link;
          };
          for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            if (isImageLink(tag)) {
              beginTags.push(funcs_html_1.makeStartTag("a", this.getLinkAttrs()));
            }
            beginTags.push(funcs_html_1.makeStartTag(tag, attrs));
            endTags.push(tag === "img" ? "" : funcs_html_1.makeEndTag(tag));
            if (isImageLink(tag)) {
              endTags.push(funcs_html_1.makeEndTag("a"));
            }
            attrs = [];
          }
          endTags.reverse();
          return {
            openingTag: beginTags.join(""),
            content: this.getContent(),
            closingTag: endTags.join("")
          };
        };
        OpToHtmlConverter2.prototype.getContent = function() {
          if (this.op.isContainerBlock()) {
            return "";
          }
          if (this.op.isMentions()) {
            return this.op.insert.value;
          }
          var content = this.op.isFormula() || this.op.isText() ? this.op.insert.value : "";
          return this.options.encodeHtml && funcs_html_1.encodeHtml(content) || content;
        };
        OpToHtmlConverter2.prototype.getCssClasses = function() {
          var attrs = this.op.attributes;
          if (this.options.inlineStyles) {
            return [];
          }
          var propsArr = ["indent", "align", "direction", "font", "size"];
          if (this.options.allowBackgroundClasses) {
            propsArr.push("background");
          }
          return (this.getCustomCssClasses() || []).concat(propsArr.filter(function(prop) {
            return !!attrs[prop];
          }).filter(function(prop) {
            return prop === "background" ? OpAttributeSanitizer_1.OpAttributeSanitizer.IsValidColorLiteral(attrs[prop]) : true;
          }).map(function(prop) {
            return prop + "-" + attrs[prop];
          }).concat(this.op.isFormula() ? "formula" : []).concat(this.op.isVideo() ? "video" : []).concat(this.op.isImage() ? "image" : []).map(this.prefixClass.bind(this)));
        };
        OpToHtmlConverter2.prototype.getCssStyles = function() {
          var _this = this;
          var attrs = this.op.attributes;
          var propsArr = [["color"]];
          if (!!this.options.inlineStyles || !this.options.allowBackgroundClasses) {
            propsArr.push(["background", "background-color"]);
          }
          if (this.options.inlineStyles) {
            propsArr = propsArr.concat([
              ["indent"],
              ["align", "text-align"],
              ["direction"],
              ["font", "font-family"],
              ["size"]
            ]);
          }
          return (this.getCustomCssStyles() || []).concat(propsArr.filter(function(item) {
            return !!attrs[item[0]];
          }).map(function(item) {
            var attribute = item[0];
            var attrValue = attrs[attribute];
            var attributeConverter = _this.options.inlineStyles && _this.options.inlineStyles[attribute] || exports2.DEFAULT_INLINE_STYLES[attribute];
            if (typeof attributeConverter === "object") {
              return attributeConverter[attrValue];
            } else if (typeof attributeConverter === "function") {
              var converterFn = attributeConverter;
              return converterFn(attrValue, _this.op);
            } else {
              return arr2.preferSecond(item) + ":" + attrValue;
            }
          })).filter(function(item) {
            return item !== void 0;
          });
        };
        OpToHtmlConverter2.prototype.getTagAttributes = function() {
          if (this.op.attributes.code && !this.op.isLink()) {
            return [];
          }
          var makeAttr = this.makeAttr.bind(this);
          var customTagAttributes = this.getCustomTagAttributes();
          var customAttr = customTagAttributes ? Object.keys(this.getCustomTagAttributes()).map(function(k) {
            return makeAttr(k, customTagAttributes[k]);
          }) : [];
          var classes = this.getCssClasses();
          var tagAttrs = classes.length ? customAttr.concat([makeAttr("class", classes.join(" "))]) : customAttr;
          if (this.op.isImage()) {
            this.op.attributes.width && (tagAttrs = tagAttrs.concat(makeAttr("width", this.op.attributes.width)));
            return tagAttrs.concat(makeAttr("src", this.op.insert.value));
          }
          if (this.op.isACheckList()) {
            return tagAttrs.concat(makeAttr("data-checked", this.op.isCheckedList() ? "true" : "false"));
          }
          if (this.op.isFormula()) {
            return tagAttrs;
          }
          if (this.op.isVideo()) {
            return tagAttrs.concat(makeAttr("frameborder", "0"), makeAttr("allowfullscreen", "true"), makeAttr("src", this.op.insert.value));
          }
          if (this.op.isMentions()) {
            var mention = this.op.attributes.mention;
            if (mention.class) {
              tagAttrs = tagAttrs.concat(makeAttr("class", mention.class));
            }
            if (mention["end-point"] && mention.slug) {
              tagAttrs = tagAttrs.concat(makeAttr("href", mention["end-point"] + "/" + mention.slug));
            } else {
              tagAttrs = tagAttrs.concat(makeAttr("href", "about:blank"));
            }
            if (mention.target) {
              tagAttrs = tagAttrs.concat(makeAttr("target", mention.target));
            }
            return tagAttrs;
          }
          var styles = this.getCssStyles();
          if (styles.length) {
            tagAttrs.push(makeAttr("style", styles.join(";")));
          }
          if (this.op.isCodeBlock() && typeof this.op.attributes["code-block"] === "string") {
            return tagAttrs.concat(makeAttr("data-language", this.op.attributes["code-block"]));
          }
          if (this.op.isContainerBlock()) {
            return tagAttrs;
          }
          if (this.op.isLink()) {
            tagAttrs = tagAttrs.concat(this.getLinkAttrs());
          }
          return tagAttrs;
        };
        OpToHtmlConverter2.prototype.makeAttr = function(k, v) {
          return { key: k, value: v };
        };
        OpToHtmlConverter2.prototype.getLinkAttrs = function() {
          var tagAttrs = [];
          var targetForAll = OpAttributeSanitizer_1.OpAttributeSanitizer.isValidTarget(this.options.linkTarget || "") ? this.options.linkTarget : void 0;
          var relForAll = OpAttributeSanitizer_1.OpAttributeSanitizer.IsValidRel(this.options.linkRel || "") ? this.options.linkRel : void 0;
          var target = this.op.attributes.target || targetForAll;
          var rel = this.op.attributes.rel || relForAll;
          return tagAttrs.concat(this.makeAttr("href", this.op.attributes.link)).concat(target ? this.makeAttr("target", target) : []).concat(rel ? this.makeAttr("rel", rel) : []);
        };
        OpToHtmlConverter2.prototype.getCustomTag = function(format) {
          if (this.options.customTag && typeof this.options.customTag === "function") {
            return this.options.customTag.apply(null, [format, this.op]);
          }
        };
        OpToHtmlConverter2.prototype.getCustomTagAttributes = function() {
          if (this.options.customTagAttributes && typeof this.options.customTagAttributes === "function") {
            return this.options.customTagAttributes.apply(null, [this.op]);
          }
        };
        OpToHtmlConverter2.prototype.getCustomCssClasses = function() {
          if (this.options.customCssClasses && typeof this.options.customCssClasses === "function") {
            var res = this.options.customCssClasses.apply(null, [this.op]);
            if (res) {
              return Array.isArray(res) ? res : [res];
            }
          }
        };
        OpToHtmlConverter2.prototype.getCustomCssStyles = function() {
          if (this.options.customCssStyles && typeof this.options.customCssStyles === "function") {
            var res = this.options.customCssStyles.apply(null, [this.op]);
            if (res) {
              return Array.isArray(res) ? res : [res];
            }
          }
        };
        OpToHtmlConverter2.prototype.getTags = function() {
          var _this = this;
          var attrs = this.op.attributes;
          if (!this.op.isText()) {
            return [
              this.op.isVideo() ? "iframe" : this.op.isImage() ? "img" : "span"
            ];
          }
          var positionTag = this.options.paragraphTag || "p";
          var blocks = [
            ["blockquote"],
            ["code-block", "pre"],
            ["list", this.options.listItemTag],
            ["header"],
            ["align", positionTag],
            ["direction", positionTag],
            ["indent", positionTag]
          ];
          for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var item = blocks_1[_i];
            var firstItem = item[0];
            if (attrs[firstItem]) {
              var customTag = this.getCustomTag(firstItem);
              return customTag ? [customTag] : firstItem === "header" ? ["h" + attrs[firstItem]] : [arr2.preferSecond(item)];
            }
          }
          if (this.op.isCustomTextBlock()) {
            var customTag = this.getCustomTag("renderAsBlock");
            return customTag ? [customTag] : [positionTag];
          }
          var customTagsMap = Object.keys(attrs).reduce(function(res, it) {
            var customTag2 = _this.getCustomTag(it);
            if (customTag2) {
              res[it] = customTag2;
            }
            return res;
          }, {});
          var inlineTags = [
            ["link", "a"],
            ["mentions", "a"],
            ["script"],
            ["bold", "strong"],
            ["italic", "em"],
            ["strike", "s"],
            ["underline", "u"],
            ["code"]
          ];
          return inlineTags.filter(function(item2) {
            return !!attrs[item2[0]];
          }).concat(Object.keys(customTagsMap).filter(function(t) {
            return !inlineTags.some(function(it) {
              return it[0] == t;
            });
          }).map(function(t) {
            return [t, customTagsMap[t]];
          })).map(function(item2) {
            return customTagsMap[item2[0]] ? customTagsMap[item2[0]] : item2[0] === "script" ? attrs[item2[0]] === value_types_1.ScriptType.Sub ? "sub" : "sup" : arr2.preferSecond(item2);
          });
        };
        return OpToHtmlConverter2;
      }();
      exports2.OpToHtmlConverter = OpToHtmlConverter;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/grouper/group-types.js
  var require_group_types = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/grouper/group-types.js"(exports2) {
      "use strict";
      init_tampermonkey();
      var __extends = exports2 && exports2.__extends || function() {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
        };
        return function(d, b) {
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var InlineGroup = function() {
        function InlineGroup2(ops) {
          this.ops = ops;
        }
        return InlineGroup2;
      }();
      exports2.InlineGroup = InlineGroup;
      var SingleItem = function() {
        function SingleItem2(op) {
          this.op = op;
        }
        return SingleItem2;
      }();
      var VideoItem = function(_super) {
        __extends(VideoItem2, _super);
        function VideoItem2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return VideoItem2;
      }(SingleItem);
      exports2.VideoItem = VideoItem;
      var BlotBlock = function(_super) {
        __extends(BlotBlock2, _super);
        function BlotBlock2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return BlotBlock2;
      }(SingleItem);
      exports2.BlotBlock = BlotBlock;
      var BlockGroup = function() {
        function BlockGroup2(op, ops) {
          this.op = op;
          this.ops = ops;
        }
        return BlockGroup2;
      }();
      exports2.BlockGroup = BlockGroup;
      var ListGroup = function() {
        function ListGroup2(items) {
          this.items = items;
        }
        return ListGroup2;
      }();
      exports2.ListGroup = ListGroup;
      var ListItem = function() {
        function ListItem2(item, innerList) {
          if (innerList === void 0) {
            innerList = null;
          }
          this.item = item;
          this.innerList = innerList;
        }
        return ListItem2;
      }();
      exports2.ListItem = ListItem;
      var TableGroup = function() {
        function TableGroup2(rows) {
          this.rows = rows;
        }
        return TableGroup2;
      }();
      exports2.TableGroup = TableGroup;
      var TableRow = function() {
        function TableRow2(cells) {
          this.cells = cells;
        }
        return TableRow2;
      }();
      exports2.TableRow = TableRow;
      var TableCell = function() {
        function TableCell2(item) {
          this.item = item;
        }
        return TableCell2;
      }();
      exports2.TableCell = TableCell;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/grouper/Grouper.js
  var require_Grouper = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/grouper/Grouper.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var DeltaInsertOp_1 = require_DeltaInsertOp();
      var array_1 = require_array();
      var group_types_1 = require_group_types();
      var Grouper = function() {
        function Grouper2() {
        }
        Grouper2.pairOpsWithTheirBlock = function(ops) {
          var result = [];
          var canBeInBlock = function(op2) {
            return !(op2.isJustNewline() || op2.isCustomEmbedBlock() || op2.isVideo() || op2.isContainerBlock());
          };
          var isInlineData = function(op2) {
            return op2.isInline();
          };
          var lastInd = ops.length - 1;
          var opsSlice;
          for (var i = lastInd; i >= 0; i--) {
            var op = ops[i];
            if (op.isVideo()) {
              result.push(new group_types_1.VideoItem(op));
            } else if (op.isCustomEmbedBlock()) {
              result.push(new group_types_1.BlotBlock(op));
            } else if (op.isContainerBlock()) {
              opsSlice = array_1.sliceFromReverseWhile(ops, i - 1, canBeInBlock);
              result.push(new group_types_1.BlockGroup(op, opsSlice.elements));
              i = opsSlice.sliceStartsAt > -1 ? opsSlice.sliceStartsAt : i;
            } else {
              opsSlice = array_1.sliceFromReverseWhile(ops, i - 1, isInlineData);
              result.push(new group_types_1.InlineGroup(opsSlice.elements.concat(op)));
              i = opsSlice.sliceStartsAt > -1 ? opsSlice.sliceStartsAt : i;
            }
          }
          result.reverse();
          return result;
        };
        Grouper2.groupConsecutiveSameStyleBlocks = function(groups, blocksOf) {
          if (blocksOf === void 0) {
            blocksOf = {
              header: true,
              codeBlocks: true,
              blockquotes: true,
              customBlocks: true
            };
          }
          return array_1.groupConsecutiveElementsWhile(groups, function(g, gPrev) {
            if (!(g instanceof group_types_1.BlockGroup) || !(gPrev instanceof group_types_1.BlockGroup)) {
              return false;
            }
            return blocksOf.codeBlocks && Grouper2.areBothCodeblocksWithSameLang(g, gPrev) || blocksOf.blockquotes && Grouper2.areBothBlockquotesWithSameAdi(g, gPrev) || blocksOf.header && Grouper2.areBothSameHeadersWithSameAdi(g, gPrev) || blocksOf.customBlocks && Grouper2.areBothCustomBlockWithSameAttr(g, gPrev);
          });
        };
        Grouper2.reduceConsecutiveSameStyleBlocksToOne = function(groups) {
          var newLineOp = DeltaInsertOp_1.DeltaInsertOp.createNewLineOp();
          return groups.map(function(elm) {
            if (!Array.isArray(elm)) {
              if (elm instanceof group_types_1.BlockGroup && !elm.ops.length) {
                elm.ops.push(newLineOp);
              }
              return elm;
            }
            var groupsLastInd = elm.length - 1;
            elm[0].ops = array_1.flatten(elm.map(function(g, i) {
              if (!g.ops.length) {
                return [newLineOp];
              }
              return g.ops.concat(i < groupsLastInd ? [newLineOp] : []);
            }));
            return elm[0];
          });
        };
        Grouper2.areBothCodeblocksWithSameLang = function(g1, gOther) {
          return g1.op.isCodeBlock() && gOther.op.isCodeBlock() && g1.op.hasSameLangAs(gOther.op);
        };
        Grouper2.areBothSameHeadersWithSameAdi = function(g1, gOther) {
          return g1.op.isSameHeaderAs(gOther.op) && g1.op.hasSameAdiAs(gOther.op);
        };
        Grouper2.areBothBlockquotesWithSameAdi = function(g, gOther) {
          return g.op.isBlockquote() && gOther.op.isBlockquote() && g.op.hasSameAdiAs(gOther.op);
        };
        Grouper2.areBothCustomBlockWithSameAttr = function(g, gOther) {
          return g.op.isCustomTextBlock() && gOther.op.isCustomTextBlock() && g.op.hasSameAttr(gOther.op);
        };
        return Grouper2;
      }();
      exports2.Grouper = Grouper;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/grouper/ListNester.js
  var require_ListNester = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/grouper/ListNester.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var group_types_1 = require_group_types();
      var array_1 = require_array();
      var ListNester = function() {
        function ListNester2() {
        }
        ListNester2.prototype.nest = function(groups) {
          var _this = this;
          var listBlocked = this.convertListBlocksToListGroups(groups);
          var groupedByListGroups = this.groupConsecutiveListGroups(listBlocked);
          var nested = array_1.flatten(groupedByListGroups.map(function(group2) {
            if (!Array.isArray(group2)) {
              return group2;
            }
            return _this.nestListSection(group2);
          }));
          var groupRootLists = array_1.groupConsecutiveElementsWhile(nested, function(curr, prev) {
            if (!(curr instanceof group_types_1.ListGroup && prev instanceof group_types_1.ListGroup)) {
              return false;
            }
            return curr.items[0].item.op.isSameListAs(prev.items[0].item.op);
          });
          return groupRootLists.map(function(v) {
            if (!Array.isArray(v)) {
              return v;
            }
            var litems = v.map(function(g) {
              return g.items;
            });
            return new group_types_1.ListGroup(array_1.flatten(litems));
          });
        };
        ListNester2.prototype.convertListBlocksToListGroups = function(items) {
          var grouped = array_1.groupConsecutiveElementsWhile(items, function(g, gPrev) {
            return g instanceof group_types_1.BlockGroup && gPrev instanceof group_types_1.BlockGroup && g.op.isList() && gPrev.op.isList() && g.op.isSameListAs(gPrev.op) && g.op.hasSameIndentationAs(gPrev.op);
          });
          return grouped.map(function(item) {
            if (!Array.isArray(item)) {
              if (item instanceof group_types_1.BlockGroup && item.op.isList()) {
                return new group_types_1.ListGroup([new group_types_1.ListItem(item)]);
              }
              return item;
            }
            return new group_types_1.ListGroup(item.map(function(g) {
              return new group_types_1.ListItem(g);
            }));
          });
        };
        ListNester2.prototype.groupConsecutiveListGroups = function(items) {
          return array_1.groupConsecutiveElementsWhile(items, function(curr, prev) {
            return curr instanceof group_types_1.ListGroup && prev instanceof group_types_1.ListGroup;
          });
        };
        ListNester2.prototype.nestListSection = function(sectionItems) {
          var _this = this;
          var indentGroups = this.groupByIndent(sectionItems);
          Object.keys(indentGroups).map(Number).sort().reverse().forEach(function(indent) {
            indentGroups[indent].forEach(function(lg) {
              var idx = sectionItems.indexOf(lg);
              if (_this.placeUnderParent(lg, sectionItems.slice(0, idx))) {
                sectionItems.splice(idx, 1);
              }
            });
          });
          return sectionItems;
        };
        ListNester2.prototype.groupByIndent = function(items) {
          return items.reduce(function(pv, cv) {
            var indent = cv.items[0].item.op.attributes.indent;
            if (indent) {
              pv[indent] = pv[indent] || [];
              pv[indent].push(cv);
            }
            return pv;
          }, {});
        };
        ListNester2.prototype.placeUnderParent = function(target, items) {
          for (var i = items.length - 1; i >= 0; i--) {
            var elm = items[i];
            if (target.items[0].item.op.hasHigherIndentThan(elm.items[0].item.op)) {
              var parent = elm.items[elm.items.length - 1];
              if (parent.innerList) {
                parent.innerList.items = parent.innerList.items.concat(target.items);
              } else {
                parent.innerList = target;
              }
              return true;
            }
          }
          return false;
        };
        return ListNester2;
      }();
      exports2.ListNester = ListNester;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/grouper/TableGrouper.js
  var require_TableGrouper = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/grouper/TableGrouper.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var group_types_1 = require_group_types();
      var array_1 = require_array();
      var TableGrouper = function() {
        function TableGrouper2() {
        }
        TableGrouper2.prototype.group = function(groups) {
          var tableBlocked = this.convertTableBlocksToTableGroups(groups);
          return tableBlocked;
        };
        TableGrouper2.prototype.convertTableBlocksToTableGroups = function(items) {
          var _this = this;
          var grouped = array_1.groupConsecutiveElementsWhile(items, function(g, gPrev) {
            return g instanceof group_types_1.BlockGroup && gPrev instanceof group_types_1.BlockGroup && g.op.isTable() && gPrev.op.isTable();
          });
          return grouped.map(function(item) {
            if (!Array.isArray(item)) {
              if (item instanceof group_types_1.BlockGroup && item.op.isTable()) {
                return new group_types_1.TableGroup([new group_types_1.TableRow([new group_types_1.TableCell(item)])]);
              }
              return item;
            }
            return new group_types_1.TableGroup(_this.convertTableBlocksToTableRows(item));
          });
        };
        TableGrouper2.prototype.convertTableBlocksToTableRows = function(items) {
          var grouped = array_1.groupConsecutiveElementsWhile(items, function(g, gPrev) {
            return g instanceof group_types_1.BlockGroup && gPrev instanceof group_types_1.BlockGroup && g.op.isTable() && gPrev.op.isTable() && g.op.isSameTableRowAs(gPrev.op);
          });
          return grouped.map(function(item) {
            return new group_types_1.TableRow(Array.isArray(item) ? item.map(function(it) {
              return new group_types_1.TableCell(it);
            }) : [new group_types_1.TableCell(item)]);
          });
        };
        return TableGrouper2;
      }();
      exports2.TableGrouper = TableGrouper;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/QuillDeltaToHtmlConverter.js
  var require_QuillDeltaToHtmlConverter = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/QuillDeltaToHtmlConverter.js"(exports2) {
      "use strict";
      init_tampermonkey();
      var __importStar = exports2 && exports2.__importStar || function(mod2) {
        if (mod2 && mod2.__esModule)
          return mod2;
        var result = {};
        if (mod2 != null) {
          for (var k in mod2)
            if (Object.hasOwnProperty.call(mod2, k))
              result[k] = mod2[k];
        }
        result["default"] = mod2;
        return result;
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var InsertOpsConverter_1 = require_InsertOpsConverter();
      var OpToHtmlConverter_1 = require_OpToHtmlConverter();
      var Grouper_1 = require_Grouper();
      var group_types_1 = require_group_types();
      var ListNester_1 = require_ListNester();
      var funcs_html_1 = require_funcs_html();
      var obj = __importStar(require_object2());
      var value_types_1 = require_value_types();
      var TableGrouper_1 = require_TableGrouper();
      var BrTag = "<br/>";
      var QuillDeltaToHtmlConverter2 = function() {
        function QuillDeltaToHtmlConverter3(deltaOps, options) {
          this.rawDeltaOps = [];
          this.callbacks = {};
          this.options = obj.assign({
            paragraphTag: "p",
            textTag: "span",
            encodeHtml: true,
            classPrefix: "ql",
            inlineStyles: false,
            multiLineBlockquote: true,
            multiLineHeader: true,
            multiLineCodeblock: true,
            multiLineParagraph: true,
            multiLineCustomBlock: true,
            allowBackgroundClasses: false,
            linkTarget: "_blank"
          }, options, {
            orderedListTag: "ol",
            bulletListTag: "ul",
            listItemTag: "li"
          });
          var inlineStyles;
          if (!this.options.inlineStyles) {
            inlineStyles = void 0;
          } else if (typeof this.options.inlineStyles === "object") {
            inlineStyles = this.options.inlineStyles;
          } else {
            inlineStyles = {};
          }
          this.converterOptions = {
            encodeHtml: this.options.encodeHtml,
            classPrefix: this.options.classPrefix,
            inlineStyles,
            listItemTag: this.options.listItemTag,
            paragraphTag: this.options.paragraphTag,
            textTag: this.options.textTag,
            linkRel: this.options.linkRel,
            linkTarget: this.options.linkTarget,
            allowBackgroundClasses: this.options.allowBackgroundClasses,
            customTag: this.options.customTag,
            customTagAttributes: this.options.customTagAttributes,
            customCssClasses: this.options.customCssClasses,
            customCssStyles: this.options.customCssStyles
          };
          this.rawDeltaOps = deltaOps;
        }
        QuillDeltaToHtmlConverter3.prototype._getListTag = function(op) {
          return op.isOrderedList() ? this.options.orderedListTag + "" : op.isBulletList() ? this.options.bulletListTag + "" : op.isCheckedList() ? this.options.bulletListTag + "" : op.isUncheckedList() ? this.options.bulletListTag + "" : "";
        };
        QuillDeltaToHtmlConverter3.prototype.getGroupedOps = function() {
          var deltaOps = InsertOpsConverter_1.InsertOpsConverter.convert(this.rawDeltaOps, this.options);
          var pairedOps = Grouper_1.Grouper.pairOpsWithTheirBlock(deltaOps);
          var groupedSameStyleBlocks = Grouper_1.Grouper.groupConsecutiveSameStyleBlocks(pairedOps, {
            blockquotes: !!this.options.multiLineBlockquote,
            header: !!this.options.multiLineHeader,
            codeBlocks: !!this.options.multiLineCodeblock,
            customBlocks: !!this.options.multiLineCustomBlock
          });
          var groupedOps = Grouper_1.Grouper.reduceConsecutiveSameStyleBlocksToOne(groupedSameStyleBlocks);
          var tableGrouper = new TableGrouper_1.TableGrouper();
          groupedOps = tableGrouper.group(groupedOps);
          var listNester = new ListNester_1.ListNester();
          return listNester.nest(groupedOps);
        };
        QuillDeltaToHtmlConverter3.prototype.convert = function() {
          var _this = this;
          var groups = this.getGroupedOps();
          return groups.map(function(group2) {
            if (group2 instanceof group_types_1.ListGroup) {
              return _this._renderWithCallbacks(value_types_1.GroupType.List, group2, function() {
                return _this._renderList(group2);
              });
            } else if (group2 instanceof group_types_1.TableGroup) {
              return _this._renderWithCallbacks(value_types_1.GroupType.Table, group2, function() {
                return _this._renderTable(group2);
              });
            } else if (group2 instanceof group_types_1.BlockGroup) {
              var g = group2;
              return _this._renderWithCallbacks(value_types_1.GroupType.Block, group2, function() {
                return _this._renderBlock(g.op, g.ops);
              });
            } else if (group2 instanceof group_types_1.BlotBlock) {
              return _this._renderCustom(group2.op, null);
            } else if (group2 instanceof group_types_1.VideoItem) {
              return _this._renderWithCallbacks(value_types_1.GroupType.Video, group2, function() {
                var g2 = group2;
                var converter = new OpToHtmlConverter_1.OpToHtmlConverter(g2.op, _this.converterOptions);
                return converter.getHtml();
              });
            } else {
              return _this._renderWithCallbacks(value_types_1.GroupType.InlineGroup, group2, function() {
                return _this._renderInlines(group2.ops, true);
              });
            }
          }).join("");
        };
        QuillDeltaToHtmlConverter3.prototype._renderWithCallbacks = function(groupType, group2, myRenderFn) {
          var html = "";
          var beforeCb = this.callbacks["beforeRender_cb"];
          html = typeof beforeCb === "function" ? beforeCb.apply(null, [groupType, group2]) : "";
          if (!html) {
            html = myRenderFn();
          }
          var afterCb = this.callbacks["afterRender_cb"];
          html = typeof afterCb === "function" ? afterCb.apply(null, [groupType, html]) : html;
          return html;
        };
        QuillDeltaToHtmlConverter3.prototype._renderList = function(list) {
          var _this = this;
          var firstItem = list.items[0];
          return funcs_html_1.makeStartTag(this._getListTag(firstItem.item.op)) + list.items.map(function(li) {
            return _this._renderListItem(li);
          }).join("") + funcs_html_1.makeEndTag(this._getListTag(firstItem.item.op));
        };
        QuillDeltaToHtmlConverter3.prototype._renderListItem = function(li) {
          li.item.op.attributes.indent = 0;
          var converter = new OpToHtmlConverter_1.OpToHtmlConverter(li.item.op, this.converterOptions);
          var parts = converter.getHtmlParts();
          var liElementsHtml = this._renderInlines(li.item.ops, false);
          return parts.openingTag + liElementsHtml + (li.innerList ? this._renderList(li.innerList) : "") + parts.closingTag;
        };
        QuillDeltaToHtmlConverter3.prototype._renderTable = function(table) {
          var _this = this;
          return funcs_html_1.makeStartTag("table") + funcs_html_1.makeStartTag("tbody") + table.rows.map(function(row) {
            return _this._renderTableRow(row);
          }).join("") + funcs_html_1.makeEndTag("tbody") + funcs_html_1.makeEndTag("table");
        };
        QuillDeltaToHtmlConverter3.prototype._renderTableRow = function(row) {
          var _this = this;
          return funcs_html_1.makeStartTag("tr") + row.cells.map(function(cell) {
            return _this._renderTableCell(cell);
          }).join("") + funcs_html_1.makeEndTag("tr");
        };
        QuillDeltaToHtmlConverter3.prototype._renderTableCell = function(cell) {
          var converter = new OpToHtmlConverter_1.OpToHtmlConverter(cell.item.op, this.converterOptions);
          var parts = converter.getHtmlParts();
          var cellElementsHtml = this._renderInlines(cell.item.ops, false);
          return funcs_html_1.makeStartTag("td", {
            key: "data-row",
            value: cell.item.op.attributes.table
          }) + parts.openingTag + cellElementsHtml + parts.closingTag + funcs_html_1.makeEndTag("td");
        };
        QuillDeltaToHtmlConverter3.prototype._renderBlock = function(bop, ops) {
          var _this = this;
          var converter = new OpToHtmlConverter_1.OpToHtmlConverter(bop, this.converterOptions);
          var htmlParts = converter.getHtmlParts();
          if (bop.isCodeBlock()) {
            return htmlParts.openingTag + funcs_html_1.encodeHtml(ops.map(function(iop) {
              return iop.isCustomEmbed() ? _this._renderCustom(iop, bop) : iop.insert.value;
            }).join("")) + htmlParts.closingTag;
          }
          var inlines = ops.map(function(op) {
            return _this._renderInline(op, bop);
          }).join("");
          return htmlParts.openingTag + (inlines || BrTag) + htmlParts.closingTag;
        };
        QuillDeltaToHtmlConverter3.prototype._renderInlines = function(ops, isInlineGroup) {
          var _this = this;
          if (isInlineGroup === void 0) {
            isInlineGroup = true;
          }
          var opsLen = ops.length - 1;
          var html = ops.map(function(op, i) {
            if (i > 0 && i === opsLen && op.isJustNewline()) {
              return "";
            }
            return _this._renderInline(op, null);
          }).join("");
          if (!isInlineGroup) {
            return html;
          }
          var startParaTag = funcs_html_1.makeStartTag(this.options.paragraphTag);
          var endParaTag = funcs_html_1.makeEndTag(this.options.paragraphTag);
          if (html === BrTag || this.options.multiLineParagraph) {
            return startParaTag + html + endParaTag;
          }
          return startParaTag + html.split(BrTag).map(function(v) {
            return v === "" ? BrTag : v;
          }).join(endParaTag + startParaTag) + endParaTag;
        };
        QuillDeltaToHtmlConverter3.prototype._renderInline = function(op, contextOp) {
          if (op.isCustomEmbed()) {
            return this._renderCustom(op, contextOp);
          }
          var converter = new OpToHtmlConverter_1.OpToHtmlConverter(op, this.converterOptions);
          return converter.getHtml().replace(/\\n/g, BrTag);
        };
        QuillDeltaToHtmlConverter3.prototype._renderCustom = function(op, contextOp) {
          var renderCb = this.callbacks["renderCustomOp_cb"];
          if (typeof renderCb === "function") {
            return renderCb.apply(null, [op, contextOp]);
          }
          return "";
        };
        QuillDeltaToHtmlConverter3.prototype.beforeRender = function(cb) {
          if (typeof cb === "function") {
            this.callbacks["beforeRender_cb"] = cb;
          }
        };
        QuillDeltaToHtmlConverter3.prototype.afterRender = function(cb) {
          if (typeof cb === "function") {
            this.callbacks["afterRender_cb"] = cb;
          }
        };
        QuillDeltaToHtmlConverter3.prototype.renderCustomWith = function(cb) {
          this.callbacks["renderCustomOp_cb"] = cb;
        };
        return QuillDeltaToHtmlConverter3;
      }();
      exports2.QuillDeltaToHtmlConverter = QuillDeltaToHtmlConverter2;
    }
  });

  // node_modules/quill-delta-to-html-cb/dist/commonjs/main.js
  var require_main = __commonJS({
    "node_modules/quill-delta-to-html-cb/dist/commonjs/main.js"(exports2) {
      "use strict";
      init_tampermonkey();
      Object.defineProperty(exports2, "__esModule", { value: true });
      var QuillDeltaToHtmlConverter_1 = require_QuillDeltaToHtmlConverter();
      exports2.QuillDeltaToHtmlConverter = QuillDeltaToHtmlConverter_1.QuillDeltaToHtmlConverter;
      var OpToHtmlConverter_1 = require_OpToHtmlConverter();
      exports2.OpToHtmlConverter = OpToHtmlConverter_1.OpToHtmlConverter;
      var group_types_1 = require_group_types();
      exports2.InlineGroup = group_types_1.InlineGroup;
      exports2.VideoItem = group_types_1.VideoItem;
      exports2.BlockGroup = group_types_1.BlockGroup;
      exports2.ListGroup = group_types_1.ListGroup;
      exports2.ListItem = group_types_1.ListItem;
      exports2.BlotBlock = group_types_1.BlotBlock;
      var DeltaInsertOp_1 = require_DeltaInsertOp();
      exports2.DeltaInsertOp = DeltaInsertOp_1.DeltaInsertOp;
      var InsertData_1 = require_InsertData();
      exports2.InsertDataQuill = InsertData_1.InsertDataQuill;
      exports2.InsertDataCustom = InsertData_1.InsertDataCustom;
      var value_types_1 = require_value_types();
      exports2.NewLine = value_types_1.NewLine;
      exports2.ListType = value_types_1.ListType;
      exports2.ScriptType = value_types_1.ScriptType;
      exports2.DirectionType = value_types_1.DirectionType;
      exports2.AlignType = value_types_1.AlignType;
      exports2.DataType = value_types_1.DataType;
      exports2.GroupType = value_types_1.GroupType;
    }
  });

  // src/index.ts
  init_tampermonkey();

  // src/core/bilibili-old.ts
  init_tampermonkey();
  var import_md52 = __toESM(require_md5());

  // src/io/api.ts
  init_tampermonkey();
  var import_md5 = __toESM(require_md5());

  // src/utils/format/url.ts
  init_tampermonkey();

  // src/utils/typeof.ts
  init_tampermonkey();
  var isArray = Array.isArray;
  var isObject = (val) => val !== null && typeof val === "object";
  var isNumber = (val) => !isNaN(parseFloat(val)) && isFinite(val);

  // src/utils/format/url.ts
  var URL2 = class {
    /** 锚 */
    hash;
    /** 基链 */
    base;
    /** 参数对象。结果会格式化\`undefined\`\`null\`\`NaN\`等特殊值，但不会处理数字，以免丢失精度。 */
    params = {};
    /** 参数链（不含\`?\`） */
    get param() {
      return Object.entries(this.params).reduce((s, d) => {
        return s += \`\${s ? "&" : ""}\${d[0]}=\${d[1]}\`;
      }, "");
    }
    /** 提取URL参数 */
    constructor(url) {
      const arr1 = url.split("#");
      let str = arr1.shift();
      this.hash = arr1.join("#");
      (this.hash || url.includes("#")) && (this.hash = \`#\${this.hash}\`);
      const arr2 = str.split("?");
      this.base = arr2.shift();
      str = arr2.join("?");
      if (str) {
        str.split("&").forEach((d) => {
          const arr3 = d.split("=");
          const key = arr3.shift();
          if (key) {
            let value = arr3.join("=") || "";
            try {
              if (!isNumber(value)) {
                value = JSON.parse(value);
              }
            } catch {
              value === "undefined" && (value = void 0);
              value === "NaN" && (value = NaN);
            }
            this.params[key] = value;
          }
        });
      }
    }
    sort() {
      this.params = Object.keys(this.params).sort().reduce((s, d) => {
        s[d] = this.params[d];
        return s;
      }, {});
    }
    /** 还原url链接 */
    toJSON() {
      return \`\${this.base ? this.param ? this.base + "?" : this.base : ""}\${this.param}\${this.hash || ""}\`;
    }
  };
  function objUrl(url, obj) {
    const res = new URL2(url);
    Object.entries(obj).forEach((d) => {
      if (d[1] === void 0 || d[1] === null)
        return;
      res.params[d[0]] = d[1];
    });
    return res.toJSON();
  }
  function urlObj(url) {
    const res = new URL2(url);
    return res.params;
  }

  // src/io/api.ts
  function jsonCheck(str) {
    const result = typeof str === "string" ? JSON.parse(str) : str;
    if (result.code === 0)
      return result;
    throw new Error(\`\${result.code} \${result.message}\`, { cause: result.code });
  }
  var APP_KEY = /* @__PURE__ */ ((APP_KEY2) => {
    APP_KEY2["1d8b6e7d45233436"] = "560c52ccd288fed045859ed18bffd973";
    APP_KEY2["c1b107428d337928"] = "ea85624dfcf12d7cc7b2b3a94fac1f2c";
    APP_KEY2["07da50c9a0bf829f"] = "25bdede4e1581c836cab73a48790ca6e";
    APP_KEY2["7d089525d3611b1c"] = "acd495b248ec528c2eed1e862d393126";
    APP_KEY2["9e5ded06c39bf5c4"] = "583e398ed0f980290b5903aba30b4cc4";
    APP_KEY2["27eb53fc9058f8c3"] = "c2ed53a74eeefe3cf99fbd01d8c9c375";
    APP_KEY2["85eb6835b0a1034e"] = "2ad42749773c441109bdc0191257a664";
    APP_KEY2["4409e2ce8ffd12b8"] = "59b43e04ad6965f34319062b478f83dd";
    APP_KEY2["37207f2beaebf8d7"] = "e988e794d4d4b6dd43bc0e89d6e90c43";
    APP_KEY2["84956560bc028eb7"] = "94aba54af9065f71de72f5508f1cd42e";
    APP_KEY2["bb3101000e232e27"] = "36efcfed79309338ced0380abd824ac1";
    APP_KEY2["fb06a25c6338edbc"] = "fd10bd177559780c2e4a44f1fa47fa83";
    APP_KEY2["iVGUTjsxvpLeuDCf"] = "aHRmhWMLkdeMuILqORnYZocwMBpMEOdt";
    APP_KEY2["178cf125136ca8ea"] = "34381a26236dd1171185c0beb042e1c6";
    APP_KEY2["57263273bc6b67f6"] = "a0488e488d1567960d3a765e8d129f90";
    APP_KEY2["8d23902c1688a798"] = "710f0212e62bd499b8d3ac6e1db9302a";
    APP_KEY2["7d336ec01856996b"] = "a1ce6983bc89e20a36c37f40c4f1a0dd";
    APP_KEY2["8e16697a1b4f8121"] = "f5dd03b752426f2e623d7badb28d190a";
    APP_KEY2["aae92bc66f3edfab"] = "af125a0d5279fd576c1b4418a3e8276d";
    APP_KEY2["ae57252b0c09105d"] = "c75875c596a69eb55bd119e74b07cfe3";
    APP_KEY2["bca7e84c2d947ac6"] = "60698ba2f68e01ce44738920a0ffe768";
    APP_KEY2["cc578d267072c94d"] = "ffb6bb4c4edae2566584dbcacfc6a6ad";
    APP_KEY2["cc8617fd6961e070"] = "3131924b941aac971e45189f265262be";
    APP_KEY2["YvirImLGlLANCLvM"] = "JNlZNgfNGKZEpaDTkCdPQVXntXhuiJEM";
    APP_KEY2["f3bb208b3d081dc8"] = "f7c926f549b9becf1c27644958676a21";
    APP_KEY2["4fa4601d1caa8b48"] = "f7c926f549b9becf1c27644958676a21";
    APP_KEY2["452d3958f048c02a"] = "f7c926f549b9becf1c27644958676a21";
    APP_KEY2["86385cdc024c0f6c"] = "f7c926f549b9becf1c27644958676a21";
    APP_KEY2["5256c25b71989747"] = "f7c926f549b9becf1c27644958676a21";
    APP_KEY2["e97210393ad42219"] = "f7c926f549b9becf1c27644958676a21";
    APP_KEY2["5dce947fe22167f9"] = "";
    APP_KEY2["8e9fc618fbd41e28"] = "";
    APP_KEY2["21087a09e533a072"] = "e5b8ba95cab6104100be35739304c23a";
    return APP_KEY2;
  })(APP_KEY || {});
  var ApiSign = class {
    constructor(url, appkey) {
      this.url = url;
      this.appkey = appkey;
    }
    get ts() {
      return (/* @__PURE__ */ new Date()).getTime();
    }
    /** 查询参数，须要在子类中初始化好才能无参数调用\`sign\`方法 */
    data = {};
    /**
     * URL签名
     * @param searchParams 查询参数，会覆盖url原有参数
     * @param api 授权api，**授权第三方登录专用**
     * @returns 签名后的api
     */
    sign(searchParams = this.data, api = "") {
      const url = new URL2(this.url);
      Object.assign(url.params, searchParams, { ts: this.ts });
      delete url.params.sign;
      api && (this.appkey = "27eb53fc9058f8c3");
      const appSecret = this.appSecret;
      url.params.appkey = this.appkey;
      url.sort();
      url.params.sign = (0, import_md5.default)((api ? \`api=\${decodeURIComponent(api)}\` : url.param) + appSecret);
      return url.toJSON();
    }
    get appSecret() {
      switch (this.appkey) {
        case "f3bb208b3d081dc8":
        case "4fa4601d1caa8b48":
        case "452d3958f048c02a":
        case "86385cdc024c0f6c":
        case "5256c25b71989747":
        case "e97210393ad42219":
          switch (Math.trunc((/* @__PURE__ */ new Date()).getHours() / 4)) {
            case 0:
              this.appkey = "f3bb208b3d081dc8";
              break;
            case 1:
              this.appkey = "4fa4601d1caa8b48";
              break;
            case 2:
              this.appkey = "452d3958f048c02a";
              break;
            case 3:
              this.appkey = "86385cdc024c0f6c";
              break;
            case 4:
              this.appkey = "5256c25b71989747";
              break;
            case 5:
              this.appkey = "e97210393ad42219";
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      return APP_KEY[this.appkey];
    }
  };
  async function urlSign(url, searchParams = {}, appkey = "c1b107428d337928") {
    const api = new ApiSign(url, appkey);
    const response = await fetch(api.sign(searchParams));
    return await response.json();
  }

  // src/utils/base64.ts
  init_tampermonkey();
  var base64 = new class {
    /**
     * Base64编码
     * @param str 原始字符串
     * @returns 编码结果
     */
    encode(str) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode("0x" + p1);
      }));
    }
    /**
     * Base64解码
     * @param str 原始字符串
     * @returns 解码结果
     */
    decode(str) {
      return decodeURIComponent(atob(str).split("").map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
    }
  }();

  // src/utils/debug.ts
  init_tampermonkey();

  // src/utils/format/time.ts
  init_tampermonkey();

  // src/utils/format/integer.ts
  init_tampermonkey();
  function integerFormat(num, byte = 2) {
    return num < 10 ** byte ? (Array(byte).join("0") + num).slice(-1 * byte) : num;
  }

  // src/utils/format/time.ts
  function timeFormat(time = (/* @__PURE__ */ new Date()).getTime(), type) {
    const date = new Date(time);
    const arr2 = date.toLocaleString().split(" ");
    const day = arr2[0].split("/");
    day[1] = integerFormat(day[1], 2);
    day[2] = integerFormat(day[2], 2);
    return type ? day.join("-") + " " + arr2[1] : arr2[1];
  }

  // src/utils/debug.ts
  var group = {
    /** 分组层次 */
    i: 0,
    /** 分组栈 */
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

  // src/core/danmaku.ts
  init_tampermonkey();

  // src/io/grpc/api-dm-web.ts
  init_tampermonkey();
  var import_light = __toESM(require_light());

  // src/json/dm-web.json
  var dm_web_default = {
    nested: {
      bilibili: {
        nested: {
          community: {
            nested: {
              service: {
                nested: {
                  dm: {
                    nested: {
                      v1: {
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
                              },
                              reportFilter: {
                                rule: "repeated",
                                type: "string",
                                id: 11
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
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  // src/utils/danmaku.ts
  init_tampermonkey();
  var DanmakuBase = class {
    /** 从小到大排序弹幕 */
    static sortDmById(dms) {
      dms.sort((a, b) => this.bigInt(a.idStr, b.idStr) ? 1 : -1);
    }
    /** 比较两个弹幕ID先后 */
    static bigInt(num1, num2) {
      String(num1).replace(/\\d+/, (d) => num1 = d.replace(/^0+/, ""));
      String(num2).replace(/\\d+/, (d) => num2 = d.replace(/^0+/, ""));
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
    /** 重构为旧版弹幕类型 */
    static parseCmd(dms) {
      return dms.map((d) => {
        const dm = {
          class: d.pool || 0,
          color: d.color || 0,
          date: d.ctime || 0,
          dmid: d.idStr || "",
          mode: +d.mode || 1,
          pool: d.pool || 0,
          size: d.fontsize || 25,
          stime: d.progress / 1e3 || 0,
          text: d.content && d.mode != 8 && d.mode != 9 ? d.content.replace(/(\\/n|\\\\n|\\n|\\r\\n)/g, "\\n") : d.content,
          uhash: d.midHash || "",
          uid: d.midHash || "",
          weight: d.weight,
          attr: d.attr
        };
        d.action?.startsWith("picture:") && (dm.html = \`<img src="\${d.action.replace("picture:", "//")}" style="width:auto;height:28.13px;">\`);
        return dm;
      });
    }
    /** 解析解码xml弹幕 */
    static decodeXml(xml) {
      if (typeof xml === "string") {
        xml = xml.replace(/((?:[\\0-\\x08\\x0B\\f\\x0E-\\x1F\\uFFFD\\uFFFE\\uFFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))/g, "");
        xml = new DOMParser().parseFromString(xml, "application/xml");
      }
      const items = xml.querySelectorAll("d");
      const dms = [];
      items.forEach((d) => {
        const json = d.getAttribute("p").split(",");
        const text = d.textContent || d.text;
        if (text) {
          const dm = {
            pool: Number(json[5]),
            color: Number(json[3]),
            ctime: Number(json[4]),
            id: Number(json[7]),
            idStr: String(json[7]),
            mode: Number(json[1]),
            fontsize: Number(json[2]),
            progress: Number(json[0]) * 1e3,
            content: String(text),
            midHash: json[6]
          };
          dms.push(dm);
        }
      });
      return dms;
    }
    /** 编码xml弹幕 */
    static encodeXml(dms, cid) {
      return dms.reduce((s, d) => {
        const text = d.mode === 8 || d.mode === 9 ? d.text : (d.text ?? "").replace(/(\\n|\\r\\n)/g, "/n");
        s += \`<d p="\${d.stime},\${d.mode},\${d.size},\${d.color},\${d.date},\${d.class},\${d.uid},\${d.dmid}">\${text.replace(/[<&]/g, (a) => {
          return { "<": "&lt;", "&": "&amp;" }[a];
        })}</d>
\`;
        return s;
      }, \`<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.api.bilibili.com</chatserver><chatid>\${cid}</chatid><mission>0</mission><maxlimit>\${dms.length}</maxlimit><state>0</state><real_name>0</real_name><source>k-v</source>
\`) + "</i>";
    }
  };

  // src/io/urls.ts
  init_tampermonkey();
  var _URLS = class {
  };
  var URLS = _URLS;
  // protocol + //
  __publicField(URLS, "P_AUTO", "//");
  __publicField(URLS, "P_HTTP", "http://");
  __publicField(URLS, "P_HTTPS", "https://");
  __publicField(URLS, "P_WS", "ws://");
  __publicField(URLS, "P_WSS", "wss://");
  // domain
  __publicField(URLS, "D_WWW", "www.bilibili.com");
  __publicField(URLS, "D_API", "api.bilibili.com");
  __publicField(URLS, "D_APP", "app.bilibili.com");
  __publicField(URLS, "D_MANAGER", "manager.bilibili.co");
  __publicField(URLS, "D_INTERFACE", "interface.bilibili.com");
  __publicField(URLS, "D_PASSPORT", "passport.bilibili.com");
  __publicField(URLS, "D_BANGUMI", "bangumi.bilibili.com");
  __publicField(URLS, "D_SPACE", "space.bilibili.com");
  __publicField(URLS, "D_STATIC_S", "static.hdslb.com");
  __publicField(URLS, "D_CHAT", "chat.bilibili.com");
  __publicField(URLS, "D_DATA", "data.bilibili.com");
  __publicField(URLS, "D_COMMENT", "comment.bilibili.com");
  __publicField(URLS, "D_BROADCAST", "broadcast.bilibili.com");
  __publicField(URLS, "D_MISAKA_SW", "misaka-sw.bilibili.com");
  __publicField(URLS, "D_MEMBER", "member.bilibili.com");
  __publicField(URLS, "D_BVC", "bvc.bilivideo.com");
  __publicField(URLS, "D_S1", "s1.hdslb.com");
  __publicField(URLS, "D_API_GLOBAL", "api.global.bilibili.com");
  __publicField(URLS, "D_ACCOUNT", "account.bilibili.com");
  __publicField(URLS, "D_INTL", "apiintl.biliapi.net");
  __publicField(URLS, "WEBSHOW_LOCS", _URLS.P_AUTO + _URLS.D_API + "/x/web-show/res/locs");
  __publicField(URLS, "INDEX_TOP_RCMD", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/index/top/rcmd");
  __publicField(URLS, "PAGE_HEADER", _URLS.P_AUTO + _URLS.D_API + "/x/web-show/page/header");
  __publicField(URLS, "SEASON_RANK_LIST", _URLS.P_AUTO + _URLS.D_API + "/pgc/season/rank/web/list");
  __publicField(URLS, "VIDEO", _URLS.P_AUTO + _URLS.D_STATIC_S + "/js/video.min.js");
  __publicField(URLS, "JQUERY", _URLS.P_AUTO + _URLS.D_STATIC_S + "/js/jquery.min.js");
  __publicField(URLS, "ARTICLE_CARDS", _URLS.P_AUTO + _URLS.D_API + "/x/article/cards");
  __publicField(URLS, "VIEW_DETAIL", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/view/detail");
  __publicField(URLS, "VIEW", _URLS.P_AUTO + _URLS.D_API + "/view");
  __publicField(URLS, "X_VIEW", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/view");
  __publicField(URLS, "PAGE_LIST", _URLS.P_AUTO + _URLS.D_API + "/x/player/pagelist");
  __publicField(URLS, "TAG_INFO", _URLS.P_AUTO + _URLS.D_API + "/x/tag/info");
  __publicField(URLS, "TAG_TOP", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/tag/top");
  __publicField(URLS, "BANGUMI_SEASON", _URLS.P_AUTO + _URLS.D_BANGUMI + "/view/web_api/season");
  __publicField(URLS, "SEASON_STATUS", _URLS.P_AUTO + _URLS.D_API + "/pgc/view/web/season/user/status");
  __publicField(URLS, "SEASON_SECTION", _URLS.P_AUTO + _URLS.D_API + "/pgc/web/season/section");
  __publicField(URLS, "GLOBAL_OGV_VIEW", _URLS.P_AUTO + _URLS.D_API_GLOBAL + "/intl/gateway/v2/ogv/view/app/season");
  __publicField(URLS, "GLOBAL_OGV_PLAYURL", _URLS.P_AUTO + _URLS.D_API_GLOBAL + "/intl/gateway/v2/ogv/playurl");
  __publicField(URLS, "APP_PGC_PLAYURL", _URLS.P_AUTO + _URLS.D_API + "/pgc/player/api/playurl");
  __publicField(URLS, "ACCOUNT_GETCARDBYMID", _URLS.P_AUTO + _URLS.D_ACCOUNT + "/api/member/getCardByMid");
  __publicField(URLS, "LOGIN_APP_THIRD", _URLS.P_AUTO + _URLS.D_PASSPORT + "/login/app/third");
  __publicField(URLS, "PLAYER", _URLS.P_AUTO + _URLS.D_API + "/x/player/v2");
  __publicField(URLS, "PLAYURL_PROJ", _URLS.P_AUTO + _URLS.D_APP + "/v2/playurlproj");
  __publicField(URLS, "PGC_PLAYURL_PROJ", _URLS.P_AUTO + _URLS.D_API + "/pgc/player/api/playurlproj");
  __publicField(URLS, "PGC_PLAYURL_TV", _URLS.P_AUTO + _URLS.D_API + "/pgc/player/api/playurltv");
  __publicField(URLS, "UGC_PLAYURL_TV", _URLS.P_AUTO + _URLS.D_API + "/x/tv/ugc/playurl");
  __publicField(URLS, "PGC_PLAYURL", _URLS.P_AUTO + _URLS.D_API + "/pgc/player/web/playurl");
  __publicField(URLS, "PLAYURL", _URLS.P_AUTO + _URLS.D_API + "/x/player/playurl");
  __publicField(URLS, "INTL_PLAYURL", _URLS.P_AUTO + _URLS.D_APP + "/x/intl/playurl");
  __publicField(URLS, "INTL_OGV_PLAYURL", _URLS.P_AUTO + _URLS.D_INTL + "/intl/gateway/ogv/player/api/playurl");
  __publicField(URLS, "PLAYURL_INTERFACE", _URLS.P_AUTO + _URLS.D_INTERFACE + "/v2/playurl");
  __publicField(URLS, "PLAYURL_BANGUMI", _URLS.P_AUTO + _URLS.D_BANGUMI + "/player/web_api/v2/playurl");
  __publicField(URLS, "LIKE", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/archive/like");
  __publicField(URLS, "HAS_LIKE", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/archive/has/like");
  __publicField(URLS, "DM_WEB_VIEW", _URLS.P_AUTO + _URLS.D_API + "/x/v2/dm/web/view");
  __publicField(URLS, "DM_WEB_SEG_SO", _URLS.P_AUTO + _URLS.D_API + "/x/v2/dm/web/seg.so");
  __publicField(URLS, "STAT", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/archive/stat");
  __publicField(URLS, "SLIDE_SHOW", _URLS.P_AUTO + _URLS.D_API + "/pgc/operation/api/slideshow");
  __publicField(URLS, "SEARCH_SQUARE", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/search/square");
  __publicField(URLS, "SPACE_ARC", _URLS.P_AUTO + _URLS.D_API + "/x/space/wbi/arc/search");
  __publicField(URLS, "NEWLIST", _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/newlist");
  __publicField(URLS, "SEARCH", _URLS.P_AUTO + _URLS.D_API + "/search");

  // src/io/grpc/api-dm-web.ts
  var _ApiDmWeb = class {
    constructor(aid, cid) {
      this.aid = aid;
      this.cid = cid;
      _ApiDmWeb.Root || _ApiDmWeb.RootInit();
    }
    static RootInit() {
      this.Root = import_light.Root.fromJSON(dm_web_default);
      this.DmWebViewReply = this.Root.lookupType("DmWebViewReply");
      this.DmSegMobileReply = this.Root.lookupType("DmSegMobileReply");
    }
    danmaku = [];
    /** 获取新版弹幕 */
    async getData() {
      if (!this.danmaku.length) {
        const dmWebView = await this.DmWebViewReply();
        const pageSize = dmWebView.dmSge.pageSize ? dmWebView.dmSge.pageSize / 1e3 : 360;
        const total = this.aid == window.aid && window.player?.getDuration?.() / pageSize + 1 || dmWebView.dmSge.total;
        const promises = [];
        for (let i = 1; i <= total; i++) {
          promises.push(
            this.DmSegMobileReply(i).then((d) => {
              d.elems && (this.danmaku = this.danmaku.concat(d.elems));
            }).catch((e) => {
              console.warn("弹幕丢包：", \`segment_index=\${i}\`, e);
            })
          );
        }
        dmWebView.specialDms && dmWebView.specialDms.forEach((d) => {
          promises.push(
            this.specialDm(d.replace("http:", "")).then((d2) => {
              d2.elems && (this.danmaku = this.danmaku.concat(d2.elems));
            }).catch((e) => {
              console.warn("高级弹幕丢包：", d, e);
            })
          );
        });
        await Promise.all(promises);
        DanmakuBase.sortDmById(this.danmaku);
      }
      return this.danmaku;
    }
    /** 获取旧版弹幕 */
    async toCmd() {
      const danmaku2 = await this.getData();
      return DanmakuBase.parseCmd(danmaku2);
    }
    /** 获取弹幕分包 */
    async DmWebViewReply() {
      const response = await fetch(objUrl(URLS.DM_WEB_VIEW, {
        type: 1,
        oid: this.cid,
        pid: this.aid
      }), { credentials: "include", cache: "force-cache" });
      const arraybuffer = await response.arrayBuffer();
      const msg = _ApiDmWeb.DmWebViewReply.decode(new Uint8Array(arraybuffer));
      return _ApiDmWeb.DmWebViewReply.toObject(msg);
    }
    /** 获取弹幕分包 */
    async DmSegMobileReply(segment_index = 1) {
      const response = await fetch(objUrl(URLS.DM_WEB_SEG_SO, {
        type: 1,
        oid: this.cid,
        pid: this.aid,
        segment_index
      }), { credentials: "include" });
      const arraybuffer = await response.arrayBuffer();
      const msg = _ApiDmWeb.DmSegMobileReply.decode(new Uint8Array(arraybuffer));
      return _ApiDmWeb.DmSegMobileReply.toObject(msg);
    }
    /** 获取高级弹幕 */
    async specialDm(url) {
      const response = await fetch(url);
      const arraybuffer = await response.arrayBuffer();
      const msg = _ApiDmWeb.DmSegMobileReply.decode(new Uint8Array(arraybuffer));
      return _ApiDmWeb.DmSegMobileReply.toObject(msg);
    }
  };
  var ApiDmWeb = _ApiDmWeb;
  __publicField(ApiDmWeb, "Root");
  __publicField(ApiDmWeb, "DmWebViewReply");
  __publicField(ApiDmWeb, "DmSegMobileReply");

  // src/utils/file.ts
  init_tampermonkey();
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
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      let selected = false;
      input.type = "file";
      accept && (input.accept = accept);
      multiple && (input.multiple = multiple);
      input.style.opacity = "0";
      input.addEventListener("change", () => {
        selected = true;
        resolve(input.files);
      });
      document.body.appendChild(input);
      input.click();
      window.addEventListener("focus", () => {
        setTimeout(() => {
          selected || reject("取消选择~");
        }, 100);
      }, { once: true });
    });
  }

  // src/utils/format/size.ts
  init_tampermonkey();
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

  // src/utils/hook/method.ts
  init_tampermonkey();
  function methodHook(target, propertyKey, callback, modifyArguments) {
    try {
      let modify2 = function() {
        loaded = true;
        if (values[0]) {
          Reflect.defineProperty(target, propertyKey, { configurable: true, value: values[0] });
          iArguments.forEach((d) => values[0](...d));
        } else {
          debug.error("拦截方法出错！", "目标方法", propertyKey, "所属对象", target);
        }
      };
      var modify = modify2;
      const values = [];
      const iArguments = [];
      let loading2 = false;
      let loaded = false;
      Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        set: (v) => {
          if (loading2 && !loaded) {
            values.unshift(v);
          }
          return true;
        },
        get: () => {
          if (!loading2) {
            loading2 = true;
            setTimeout(() => {
              const res = callback();
              if (res && res.finally) {
                res.finally(() => modify2());
              } else {
                modify2();
              }
            });
          }
          return function() {
            modifyArguments?.(arguments);
            iArguments.push(arguments);
          };
        }
      });
    } catch (e) {
      debug.error(e);
    }
  }
  function propertyHook(target, propertyKey, propertyValue, configurable = true) {
    try {
      Reflect.defineProperty(target, propertyKey, {
        configurable,
        set: (v) => true,
        get: () => {
          Reflect.defineProperty(target, propertyKey, { configurable: true, value: propertyValue });
          return propertyValue;
        }
      });
    } catch (e) {
      debug.error(e);
    }
  }
  propertyHook.modify = (target, propertyKey, callback, once = false) => {
    try {
      let value = target[propertyKey];
      value && (value = callback(value));
      Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        set: (v) => {
          value = callback(v);
          return true;
        },
        get: () => {
          if (once) {
            Reflect.deleteProperty(target, propertyKey);
            Reflect.set(target, propertyKey, value);
          }
          return value;
        }
      });
    } catch (e) {
      debug.error(e);
    }
  };
  function ProxyHandler(target, parrent, key) {
    return new Proxy(target, {
      deleteProperty(target2, p) {
        const res = Reflect.deleteProperty(target2, p);
        parrent[key] = target2;
        return res;
      },
      set(target2, p, newValue, receiver) {
        const res = Reflect.set(target2, p, newValue, receiver);
        parrent[key] = target2;
        return res;
      },
      get(target2, p, receiver) {
        const res = Reflect.get(target2, p, receiver);
        if (isArray(res) || isObject(res)) {
          return ProxyHandler(res, receiver, p);
        }
        return res;
      }
    });
  }
  function propertryChangeHook(target, callback) {
    return new Proxy(target, {
      deleteProperty(target2, p) {
        const res = Reflect.deleteProperty(target2, p);
        callback(p, void 0);
        return res;
      },
      set(target2, p, newValue, receiver) {
        const res = Reflect.set(target2, p, newValue, receiver);
        callback(p, newValue);
        return res;
      },
      get(target2, p, receiver) {
        const res = Reflect.get(target2, p, receiver);
        if (isArray(res) || isObject(res)) {
          return ProxyHandler(res, receiver, p);
        }
        return res;
      }
    });
  }

  // src/utils/hook/worker.ts
  init_tampermonkey();
  var _WorkerHook = class {
    /** Worker.prototype.postMessage hook init. */
    static postMessageHook() {
      this.postMessage = Worker.prototype.postMessage;
      Worker.prototype.postMessage = function(message, transfer) {
        let ishook = false;
        _WorkerHook.postMessageCallback.forEach((d) => {
          d.call(this, message, transfer) && (ishook = true);
        });
        ishook || _WorkerHook.postMessage.call(this, message, transfer);
      };
    }
    constructor() {
      _WorkerHook.postMessage || _WorkerHook.postMessageHook();
    }
    /**
     * Worker.prototype.postMessage hook.
     * @param callback 检查并处理\`Worker.prototype.postMessage\`的回调函数，继承原传参，返回 **true** 时拦截该实例。
     * @returns 取消该hook的方法，执行后不再hook。
     */
    postMessage(callback) {
      const id = _WorkerHook.postMessageCallback.push(callback);
      return () => {
        id >= 0 && delete _WorkerHook.postMessageCallback[id - 1];
      };
    }
  };
  var WorkerHook = _WorkerHook;
  /** Worker.prototype.postMessage backup. */
  __publicField(WorkerHook, "postMessage");
  __publicField(WorkerHook, "postMessageCallback", []);

  // src/utils/utils.ts
  init_tampermonkey();

  // src/io/api-bangumi-season.ts
  init_tampermonkey();
  async function apiBangumiSeason(data) {
    const response = await fetch(objUrl(URLS.BANGUMI_SEASON, data), { credentials: "include" });
    const json = await response.json();
    return jsonCheck(json).result;
  }

  // src/io/api-biliplus-view.ts
  init_tampermonkey();

  // src/utils/hook/xhr.ts
  init_tampermonkey();
  var rules = [];
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(...rest) {
    const args = [...rest];
    args[1] && rules.forEach((d) => {
      d && d[0].every((d2) => args[1].includes(d2)) && d[1].call(this, args);
    });
    return open.call(this, ...args);
  };
  function xhrHook(url, modifyOpen, modifyResponse, once = true) {
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
                Reflect.defineProperty(this, "response", { configurable: true, value: response.response });
                response.responseText && Reflect.defineProperty(this, "responseText", { configurable: true, value: response.responseText });
                response.responseXML && Reflect.defineProperty(this, "responseXML", { configurable: true, value: response.responseXML });
              }
            } catch (e) {
              debug.error("modifyResponse of xhrhook", one, e);
            }
          });
        } catch (e) {
          debug.error("modifyResponse of xhrhook", one, e);
        }
    };
    const iid = rules.push([one, two]);
    return () => {
      removeXhrhook(iid);
    };
  }
  xhrHook.async = (url, condition, modifyResponse, once = true) => {
    let id, temp;
    const one = Array.isArray(url) ? url : [url];
    const two = function(args) {
      try {
        if (!condition || condition(args)) {
          this.xhrhookTimes = this.xhrhookTimes ? this.xhrhookTimes++ : 1;
          id && (temp = rules[id - 1]);
          delete rules[id - 1];
          this.send = () => true;
          (!args[2] || args[2] === true) && (this.timeout = 0);
          const et = setInterval(() => {
            this.dispatchEvent(new ProgressEvent("progress"));
          }, 50);
          Reflect.defineProperty(this, "status", { configurable: true, value: 200 });
          Reflect.defineProperty(this, "readyState", { configurable: true, value: 2 });
          this.dispatchEvent(new ProgressEvent("readystatechange"));
          modifyResponse ? modifyResponse(args).then((d) => {
            clearInterval(et);
            if (d) {
              Reflect.defineProperty(this, "response", { configurable: true, value: d.response });
              d.responseType && setResponseType(d.responseType, this);
              d.responseText && Reflect.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
              d.responseXML && Reflect.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
              !this.responseURL && Reflect.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
              Reflect.defineProperty(this, "readyState", { configurable: true, value: 4 });
              this.dispatchEvent(new ProgressEvent("readystatechange"));
              this.dispatchEvent(new ProgressEvent("load"));
              this.dispatchEvent(new ProgressEvent("loadend"));
            }
          }).catch((d) => {
            if (this.xhrhookTimes === 1) {
              if (d && d.response) {
                Reflect.defineProperty(this, "response", { configurable: true, value: d.response });
                d.responseType && setResponseType(d.responseType, this);
                d.responseText && Reflect.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                d.responseXML && Reflect.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                !this.responseURL && Reflect.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                Reflect.defineProperty(this, "readyState", { configurable: true, value: 4 });
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
            !once && (id = rules.push(temp));
          }) : (this.abort(), !once && (id = rules.push(temp)));
          clearInterval(et);
        }
      } catch (e) {
        debug.error("condition of xhrhook", one, e);
      }
    };
    const iid = rules.push([one, two]);
    return () => {
      removeXhrhook(iid);
    };
  };
  function removeXhrhook(id) {
    id >= 0 && delete rules[id - 1];
  }
  xhrHook.ultra = (url, modify) => {
    const one = Array.isArray(url) ? url : [url];
    const two = function(args) {
      try {
        modify.call(this, this, args);
      } catch (e) {
        debug.error("xhrhook modify", one, modify, e);
      }
    };
    const iid = rules.push([one, two]);
    return () => {
      removeXhrhook(iid);
    };
  };
  function setResponseType(responseType, xhr) {
    Reflect.defineProperty(xhr, "responseType", { configurable: true, value: responseType });
    xhr.getResponseHeader = (name) => {
      if (name === "content-type") {
        switch (xhr.responseType) {
          case "arraybuffer":
          case "blob":
            return "application/octet-stream";
          case "document":
            return "text/xml; charset=utf-8";
          case "json":
            return "application/json; charset=utf-8";
          default:
            return "text/plain; charset=utf-8";
        }
      }
      return "text/plain; charset=utf-8";
    };
    xhr.getAllResponseHeaders = () => {
      switch (xhr.responseType) {
        case "arraybuffer":
        case "blob":
          return "content-type: application/octet-stream\\r\\n";
        case "document":
          return "content-type: text/xml; charset=utf-8\\r\\n";
        case "json":
          return "content-type: application/json; charset=utf-8\\r\\n";
        default:
          return "content-type: text/plain; charset=utf-8\\r\\n";
      }
    };
  }

  // src/io/api-view-detail.ts
  init_tampermonkey();
  var ApiViewDetail = class {
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
  async function apiViewDetail(aid) {
    const response = await fetch(objUrl(URLS.VIEW_DETAIL, {
      aid
    }));
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/io/api-biliplus-view.ts
  var apiBiliplusView = class {
    constructor(aid) {
      this.aid = aid;
      this.fetch = fetch(objUrl("//www.biliplus.com/api/view", {
        id: aid
      }));
    }
    fetch;
    async getDate() {
      const respense = await this.fetch;
      return await respense.json();
    }
    /** 转化为\`apiViewDetail\`格式 */
    async toDetail() {
      const json = await this.getDate();
      return this.view2Detail(json);
    }
    view2Detail(data) {
      const result = new ApiViewDetail();
      if (data.v2_app_api) {
        delete data.v2_app_api.redirect_url;
        result.data.Card.follower = data.v2_app_api.owner_ext?.fans;
        result.data.Card.card = { ...data.v2_app_api.owner, ...data.v2_app_api.owner_ext };
        result.data.Tags = data.v2_app_api.tag;
        result.data.View = data.v2_app_api;
        xhrHook(\`api.bilibili.com/x/web-interface/view?aid=\${this.aid}\`, void 0, (res) => {
          const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify(result.data.View)}}\`;
          res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        xhrHook(\`api.bilibili.com/x/web-interface/archive/stat?aid=\${this.aid}\`, void 0, (res) => {
          const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify({ ...result.data.View.stat, aid: this.aid })}}\`;
          res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        return JSON.parse(JSON.stringify(result));
      } else
        return this.view2Detail_v1(data);
    }
    view2Detail_v1(data) {
      if ("code" in data) {
        jsonCheck(data);
      }
      const result = new ApiViewDetail();
      const p = Number(getUrlValue("p"));
      result.data.Card.card = {
        face: "//static.hdslb.com/images/akari.jpg",
        mid: data.mid,
        name: data.author,
        vip: {}
      };
      data.list || (data.list = [{
        cid: -1,
        dimension: { width: 1920, height: 1080, rotate: 0 }
      }]);
      result.data.View = {
        aid: data.aid || data.id || this.aid,
        cid: data.list[p ? p - 1 : 0].cid,
        copyright: 1,
        ctime: data.created ?? 0,
        dimension: { width: 1920, height: 1080, rotate: 0 },
        duration: -1,
        owner: result.data.Card.card,
        pages: data.list.map((d) => {
          d.dimension = { width: 1920, height: 1080, rotate: 0 };
          return d;
        }),
        pic: data.pic ?? "",
        pubdate: data.lastupdatets ?? 0,
        rights: {},
        stat: {
          aid: data.aid || data.id || this.aid,
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
        tid: data.tid ?? 0,
        title: data.title ?? "",
        tname: data.typename ?? "",
        videos: data.list.length ?? 0
      };
      data.bangumi && (result.data.View.season = data.bangumi);
      xhrHook(\`api.bilibili.com/x/web-interface/view?aid=\${this.aid}\`, void 0, (res) => {
        const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify(result.data.View)}}\`;
        res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
      }, false);
      xhrHook(\`api.bilibili.com/x/web-interface/archive/stat?aid=\${this.aid}\`, void 0, (res) => {
        const t = \`{"code": 0,"message":"0","ttl":1,"data":\${JSON.stringify({ ...result.data.View.stat, aid: this.aid })}}\`;
        res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
      }, false);
      return JSON.parse(JSON.stringify(result));
    }
  };

  // src/io/api-player-pagelist.ts
  init_tampermonkey();
  async function apiPlayerPagelist(aid) {
    const response = await fetch(objUrl(URLS.PAGE_LIST, { aid }));
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/io/api-view.ts
  init_tampermonkey();
  async function apiView(aid) {
    const response = await fetch(objUrl(URLS.VIEW, {
      appkey: "8e9fc618fbd41e28",
      id: aid,
      type: "json"
    }));
    return await response.json();
  }

  // src/io/api-x-view.ts
  init_tampermonkey();
  async function apiXView(aid) {
    const response = await fetch(objUrl(URLS.X_VIEW, { aid }));
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/utils/abv.ts
  init_tampermonkey();
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
    /**
     * av/BV互转
     * @param input av或BV，可带av/BV前缀
     * @returns 转化结果
     */
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
  function BV2avAll(str) {
    return str.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (s) => "av" + abv(s));
  }

  // src/utils/utils.ts
  function getUrlValue(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|\$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null)
      return decodeURIComponent(r[2]);
    return null;
  }
  var catchs = { aid: {}, ssid: {}, epid: {} };
  async function urlParam(url, redirect = true) {
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
          let data = await apiXView(aid);
          if (data.redirect_url)
            return urlParam(objUrl(data.redirect_url, { aid, cid, ssid, epid, p }));
          catchs.aid[aid] = data.pages;
          catchs.aid[aid].forEach((d) => d.aid = aid);
          return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
        } catch (e) {
          debug.error("view", e);
          try {
            catchs.aid[aid] = await apiPlayerPagelist(aid);
            catchs.aid[aid].forEach((d) => d.aid = aid);
            return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
          } catch (e2) {
            debug.error("pagelist", e2);
            try {
              catchs.aid[aid] = (await apiView(aid)).list;
              catchs.aid[aid].forEach((d) => d.aid = aid);
              return catchs.aid[aid][p - 1] || catchs.aid[aid][0];
            } catch (e3) {
              debug.error("appkey", e3);
              try {
                let data = await new apiBiliplusView(aid).getDate();
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
      let data = await apiBangumiSeason({ ep_id: epid, season_id: ssid });
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

  // src/core/toast.ts
  init_tampermonkey();

  // src/html/toast.html
  var toast_default = '<div id="toast-container"></div>\\r\\n<style type="text/css">\\r\\n    .toast-close-button>svg {\\r\\n        width: 12px;\\r\\n        height: 12px;\\r\\n    }\\r\\n\\r\\n    .toast {\\r\\n        transition: height 1s ease 0s, padding 1s ease 0s;\\r\\n    }\\r\\n\\r\\n    #toast-container {\\r\\n        font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif;\\r\\n    }\\r\\n</style>\\r\\n<style type="text/css">\\r\\n    /*\\r\\n     * Note that this is toastr v2.1.3, the "latest" version in url has no more maintenance,\\r\\n     * please go to https://cdnjs.com/libraries/toastr.js and pick a certain version you want to use,\\r\\n     * make sure you copy the url from the website since the url may change between versions.\\r\\n     */\\r\\n    .toast-title {\\r\\n        font-weight: bold;\\r\\n    }\\r\\n\\r\\n    .toast-message {\\r\\n        -ms-word-wrap: break-word;\\r\\n        word-wrap: break-word;\\r\\n    }\\r\\n\\r\\n    .toast-message a,\\r\\n    .toast-message label {\\r\\n        color: #FFFFFF;\\r\\n    }\\r\\n\\r\\n    .toast-message a:hover {\\r\\n        color: #CCCCCC;\\r\\n        text-decoration: none;\\r\\n    }\\r\\n\\r\\n    .toast-close-button {\\r\\n        position: relative;\\r\\n        right: -0.3em;\\r\\n        top: -0.3em;\\r\\n        float: right;\\r\\n        font-size: 20px;\\r\\n        font-weight: bold;\\r\\n        color: #FFFFFF;\\r\\n        -webkit-text-shadow: 0 1px 0 #ffffff;\\r\\n        text-shadow: 0 1px 0 #ffffff;\\r\\n        opacity: 0.8;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);\\r\\n        filter: alpha(opacity=80);\\r\\n        line-height: 1;\\r\\n    }\\r\\n\\r\\n    .toast-close-button:hover,\\r\\n    .toast-close-button:focus {\\r\\n        color: #000000;\\r\\n        text-decoration: none;\\r\\n        cursor: pointer;\\r\\n        opacity: 0.4;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);\\r\\n        filter: alpha(opacity=40);\\r\\n    }\\r\\n\\r\\n    .rtl .toast-close-button {\\r\\n        left: -0.3em;\\r\\n        float: left;\\r\\n        right: 0.3em;\\r\\n    }\\r\\n\\r\\n    /*Additional properties for button version\\r\\n     iOS requires the button element instead of an anchor tag.\\r\\n     If you want the anchor version, it requires \`href="#"\`.*/\\r\\n    button.toast-close-button {\\r\\n        padding: 0;\\r\\n        cursor: pointer;\\r\\n        background: transparent;\\r\\n        border: 0;\\r\\n        -webkit-appearance: none;\\r\\n    }\\r\\n\\r\\n    .toast-top-center {\\r\\n        top: 0;\\r\\n        right: 0;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .toast-bottom-center {\\r\\n        bottom: 0;\\r\\n        right: 0;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .toast-top-full-width {\\r\\n        top: 0;\\r\\n        right: 0;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .toast-bottom-full-width {\\r\\n        bottom: 0;\\r\\n        right: 0;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .toast-top-left {\\r\\n        top: 12px;\\r\\n        left: 12px;\\r\\n    }\\r\\n\\r\\n    .toast-top-right {\\r\\n        top: 12px;\\r\\n        right: 12px;\\r\\n    }\\r\\n\\r\\n    .toast-bottom-right {\\r\\n        right: 12px;\\r\\n        bottom: 12px;\\r\\n    }\\r\\n\\r\\n    .toast-bottom-left {\\r\\n        bottom: 12px;\\r\\n        left: 12px;\\r\\n    }\\r\\n\\r\\n    #toast-container {\\r\\n        position: fixed;\\r\\n        z-index: 999999;\\r\\n        pointer-events: none;\\r\\n        /*overrides*/\\r\\n    }\\r\\n\\r\\n    #toast-container * {\\r\\n        -moz-box-sizing: border-box;\\r\\n        -webkit-box-sizing: border-box;\\r\\n        box-sizing: border-box;\\r\\n    }\\r\\n\\r\\n    #toast-container>div {\\r\\n        position: relative;\\r\\n        pointer-events: auto;\\r\\n        overflow: hidden;\\r\\n        margin: 0 0 6px;\\r\\n        padding: 15px 15px 15px 50px;\\r\\n        width: 300px;\\r\\n        -moz-border-radius: 3px 3px 3px 3px;\\r\\n        -webkit-border-radius: 3px 3px 3px 3px;\\r\\n        border-radius: 3px 3px 3px 3px;\\r\\n        background-position: 15px center;\\r\\n        background-repeat: no-repeat;\\r\\n        -moz-box-shadow: 0 0 12px #999999;\\r\\n        -webkit-box-shadow: 0 0 12px #999999;\\r\\n        box-shadow: 0 0 12px #999999;\\r\\n        color: #FFFFFF;\\r\\n        opacity: 0.8;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);\\r\\n        filter: alpha(opacity=80);\\r\\n    }\\r\\n\\r\\n    #toast-container>div.rtl {\\r\\n        direction: rtl;\\r\\n        padding: 15px 50px 15px 15px;\\r\\n        background-position: right 15px center;\\r\\n    }\\r\\n\\r\\n    #toast-container>div:hover {\\r\\n        -moz-box-shadow: 0 0 12px #000000;\\r\\n        -webkit-box-shadow: 0 0 12px #000000;\\r\\n        box-shadow: 0 0 12px #000000;\\r\\n        opacity: 1;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\\r\\n        filter: alpha(opacity=100);\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    #toast-container>.toast-info {\\r\\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=") !important;\\r\\n    }\\r\\n\\r\\n    #toast-container>.toast-error {\\r\\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=") !important;\\r\\n    }\\r\\n\\r\\n    #toast-container>.toast-success {\\r\\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==") !important;\\r\\n    }\\r\\n\\r\\n    #toast-container>.toast-warning {\\r\\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=") !important;\\r\\n    }\\r\\n\\r\\n    #toast-container.toast-top-center>div,\\r\\n    #toast-container.toast-bottom-center>div {\\r\\n        width: 300px;\\r\\n        margin-left: auto;\\r\\n        margin-right: auto;\\r\\n    }\\r\\n\\r\\n    #toast-container.toast-top-full-width>div,\\r\\n    #toast-container.toast-bottom-full-width>div {\\r\\n        width: 96%;\\r\\n        margin-left: auto;\\r\\n        margin-right: auto;\\r\\n    }\\r\\n\\r\\n    .toast {\\r\\n        background-color: #030303;\\r\\n    }\\r\\n\\r\\n    .toast-success {\\r\\n        background-color: #51A351;\\r\\n    }\\r\\n\\r\\n    .toast-error {\\r\\n        background-color: #BD362F;\\r\\n    }\\r\\n\\r\\n    .toast-info {\\r\\n        background-color: #2F96B4;\\r\\n    }\\r\\n\\r\\n    .toast-warning {\\r\\n        background-color: #F89406;\\r\\n    }\\r\\n\\r\\n    .toast-progress {\\r\\n        position: absolute;\\r\\n        left: 0;\\r\\n        bottom: 0;\\r\\n        height: 4px;\\r\\n        background-color: #000000;\\r\\n        opacity: 0.4;\\r\\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);\\r\\n        filter: alpha(opacity=40);\\r\\n    }\\r\\n\\r\\n    /*Responsive Design*/\\r\\n    @media all and (max-width: 240px) {\\r\\n        #toast-container>div {\\r\\n            padding: 8px 8px 8px 50px;\\r\\n            width: 11em;\\r\\n        }\\r\\n\\r\\n        #toast-container>div.rtl {\\r\\n            padding: 8px 50px 8px 8px;\\r\\n        }\\r\\n\\r\\n        #toast-container .toast-close-button {\\r\\n            right: -0.2em;\\r\\n            top: -0.2em;\\r\\n        }\\r\\n\\r\\n        #toast-container .rtl .toast-close-button {\\r\\n            left: -0.2em;\\r\\n            right: 0.2em;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    @media all and (min-width: 241px) and (max-width: 480px) {\\r\\n        #toast-container>div {\\r\\n            padding: 8px 8px 8px 50px;\\r\\n            width: 18em;\\r\\n        }\\r\\n\\r\\n        #toast-container>div.rtl {\\r\\n            padding: 8px 50px 8px 8px;\\r\\n        }\\r\\n\\r\\n        #toast-container .toast-close-button {\\r\\n            right: -0.2em;\\r\\n            top: -0.2em;\\r\\n        }\\r\\n\\r\\n        #toast-container .rtl .toast-close-button {\\r\\n            left: -0.2em;\\r\\n            right: 0.2em;\\r\\n        }\\r\\n    }\\r\\n\\r\\n    @media all and (min-width: 481px) and (max-width: 768px) {\\r\\n        #toast-container>div {\\r\\n            padding: 15px 15px 15px 50px;\\r\\n            width: 25em;\\r\\n        }\\r\\n\\r\\n        #toast-container>div.rtl {\\r\\n            padding: 15px 50px 15px 15px;\\r\\n        }\\r\\n    }\\r\\n</style>';

  // src/utils/svg.ts
  init_tampermonkey();

  // src/svg/fork.svg
  var fork_default = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.284996 0.286944C0.480258 0.091682 0.796841 0.0916819 0.992103 0.286944L4.99893 4.29377L9.00684 0.285851C9.20211 0.0905889 9.51869 0.0905886 9.71395 0.285851C9.90921 0.481113 9.90921 0.797696 9.71395 0.992958L5.70603 5.00088L9.71309 9.00793C9.90835 9.20319 9.90835 9.51978 9.71309 9.71504C9.51783 9.9103 9.20124 9.9103 9.00598 9.71504L4.99893 5.70798L0.992966 9.71394C0.797704 9.90921 0.481122 9.90921 0.28586 9.71394C0.0905973 9.51868 0.0905975 9.2021 0.28586 9.00684L4.29182 5.00088L0.284996 0.994051C0.0897343 0.798789 0.0897342 0.482206 0.284996 0.286944Z" fill="#E19C2C"></path></svg>';

  // src/svg/gear.svg
  var gear_default = '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></svg>';

  // src/svg/wrench.svg
  var wrench_default = '<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>';

  // src/svg/note.svg
  var note_default = '<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>';

  // src/svg/dmset.svg
  var dmset_default = '<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>';

  // src/svg/stethoscope.svg
  var stethoscope_default = '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>';

  // src/svg/play.svg
  var play_default = '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>';

  // src/svg/palette.svg
  var palette_default = '<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>';

  // src/svg/download.svg
  var download_default = '<svg viewBox="0 0 24 24"><g><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>';

  // src/svg/warn.svg
  var warn_default = '<svg viewBox="0 0 24 24"><g><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g></svg>';

  // src/svg/linechart.svg
  var linechart_default = '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"></path></svg>';

  // src/svg/blind.svg
  var blind_default = '<svg viewBox="0 0 24 24"><g><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></g></svg>';

  // src/svg/like.svg
  var like_default = '<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1 {fill: #f36392;}</style></defs><g><path class="cls-1" d="M12.06,35.27V10.43h-.15l6.7-8.37A3.83,3.83,0,0,1,25.25,5L25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86Zm-2.5,0h-4a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h4Z" transform="translate(-0.56 -0.82)" /></g></svg>';

  // src/svg/dislike.svg
  var dislike_default = '<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1 {fill: #f36392;}</style></defs><g><path class="cls-1" d="M10.28,32.77h2.5V13.19h-2.5ZM25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86H5.56a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h6.25l6.8-8.49A3.83,3.83,0,0,1,25.25,5Zm10.14,2.51H22.22l.28-2.92L22.92,5a1.26,1.26,0,0,0-.18-1,1.28,1.28,0,0,0-.82-.56,1.11,1.11,0,0,0-1.25.42l-6.36,8.2-.83,1.11H5.14a2,2,0,0,0-.83.28,2.28,2.28,0,0,0-1.25,2.08V30.41a2,2,0,0,0,.42,1.25,2,2,0,0,0,2.08,1.11H28.89a2.38,2.38,0,0,0,1.39-.41,3.61,3.61,0,0,0,2.08-2.78L36.8,15l2.5.56L36.8,15a2.45,2.45,0,0,0-.14-1.39,2.89,2.89,0,0,0-1.52-.54l.28-2.5Z" transform="translate(-0.56 -0.82)" /></g></svg>';

  // src/svg/left.svg
  var left_default = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.67413 1.57564C7.90844 1.80995 7.90844 2.18985 7.67413 2.42417L4.09839 5.9999L7.67413 9.57564C7.90844 9.80995 7.90844 10.1899 7.67413 10.4242C7.43981 10.6585 7.05992 10.6585 6.8256 10.4242L3.00238 6.60094C2.67043 6.269 2.67043 5.73081 3.00238 5.39886L6.8256 1.57564C7.05992 1.34132 7.43981 1.34132 7.67413 1.57564Z" fill="#A2A7AE"></path></svg>';

  // src/svg/right.svg
  var right_default = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.82576 2.07564C5.59145 2.30995 5.59145 2.68985 5.82576 2.92417L10.9015 7.9999L5.82576 13.0756C5.59145 13.31 5.59145 13.6899 5.82576 13.9242C6.06008 14.1585 6.43997 14.1585 6.67429 13.9242L11.9386 8.65987C12.3031 8.29538 12.3031 7.70443 11.9386 7.33994L6.67429 2.07564C6.43997 1.84132 6.06008 1.84132 5.82576 2.07564Z" fill="#E19C2C"></path></svg>';

  // src/svg/net.svg
  var net_default = '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"><g><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></g></svg>';

  // src/utils/svg.ts
  var svg = {
    fork: fork_default,
    gear: gear_default,
    wrench: wrench_default,
    note: note_default,
    dmset: dmset_default,
    stethoscope: stethoscope_default,
    play: play_default,
    palette: palette_default,
    download: download_default,
    warn: warn_default,
    linechart: linechart_default,
    blind: blind_default,
    like: like_default,
    dislike: dislike_default,
    left: left_default,
    right: right_default,
    net: net_default
  };

  // src/utils/type.ts
  init_tampermonkey();
  function toObject(input) {
    switch (input) {
      case "undefined":
        input = void 0;
        break;
      case "null":
        input = null;
        break;
      case "NaN":
        input = NaN;
        break;
      default:
        if (!input)
          break;
        try {
          const temp = JSON.parse(input);
          if (typeof temp !== "number" || input === String(temp)) {
            input = temp;
          }
        } catch {
          try {
            const temp = Number(input);
            if (String(temp) !== "NaN" && !input.startsWith("0")) {
              input = temp;
            }
          } catch {
          }
          try {
            if (/^\\d+n\$/.test(input))
              input = BigInt(input.slice(0, -1));
          } catch {
          }
        }
        break;
    }
    return input;
  }
  function toString(input, space = "\\n") {
    let result;
    try {
      result = input.toString();
    } catch {
      result = String(input);
    }
    if (result.startsWith("[object") && result.endsWith("]")) {
      try {
        const str = JSON.stringify(input, void 0, space);
        str === "{}" || (result = str);
      } catch {
      }
    }
    return result;
  }

  // src/core/toast.ts
  var Toastconfig = {
    position: "top-right",
    rtl: false,
    delay: 4,
    disabled: false
  };
  var Toast = class extends HTMLDivElement {
    /** 关闭按钮 */
    closeButton = document.createElement("div");
    /** 消息节点 */
    message = document.createElement("div");
    /** 延时 */
    timer;
    /** 鼠标移入 */
    hovering = false;
    /** 延时结束 */
    timeout = false;
    constructor() {
      super();
      this.classList.add("toast");
      this.setAttribute("aria-live", "assertive");
      this.setAttribute("style", "padding-top: 0px;padding-bottom: 0px;height: 0px;");
      this.appendChild(this.message);
      this.message.className = "toast-message";
      this.closeButton.className = "toast-close-button";
      this.closeButton.innerHTML = svg.fork;
      this.closeButton.addEventListener("click", (e) => {
        this.timeout = true;
        this.delay = 1;
        e.stopPropagation();
      });
      this.addEventListener("mouseover", () => this.hovering = true);
      this.addEventListener("mouseout", () => {
        this.hovering = false;
        this.timeout && (this.delay = 1);
      });
    }
    /** 内容 */
    set data(v) {
      isArray(v) || (v = [v]);
      let html = "";
      v.forEach((d, i) => {
        d = toString(d);
        html += i ? \`<br>\${d}\` : \`<label>\${d}</label>\`;
      });
      const close = this.message.contains(this.closeButton);
      this.message.innerHTML = html;
      close && (this.delay = 0);
      this.setAttribute("style", \`height: \${this.message.scrollHeight + 30}px;\`);
    }
    /** 类型 */
    set type(v) {
      this.classList.remove("toast-success", "toast-error", "toast-info", "toast-warning");
      v && this.classList.add(\`toast-\${v}\`);
    }
    /** 镜像 */
    set rtl(v) {
      v ? this.classList.add("rtl") : this.classList.remove("rtl");
    }
    /** 时长 */
    set delay(v) {
      clearTimeout(this.timer);
      v = Math.max(Math.trunc(v), 0);
      v ? this.message.contains(this.closeButton) && this.closeButton.remove() : this.message.contains(this.closeButton) || this.message.insertBefore(this.closeButton, this.message.firstChild);
      if (v === 1) {
        if (!this.hovering) {
          this.setAttribute("style", "padding-top: 0px;padding-bottom: 0px;height: 0px;");
          setTimeout(() => this.remove(), 1e3);
        }
      } else if (v !== 0) {
        this.timer = setTimeout(() => {
          this.timeout = true;
          this.delay = 1;
        }, v * 1e3);
      }
    }
  };
  customElements.get(\`toast-\${"caecec5"}\`) || customElements.define(\`toast-\${"caecec5"}\`, Toast, { extends: "div" });
  var ToastContainer = class extends HTMLElement {
    /** 实际根节点 */
    container;
    static get observedAttributes() {
      return [
        "position",
        "rtl",
        "delay",
        "disabled"
      ];
    }
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = toast_default;
      this.container = root.children[0];
    }
    /** 刷新配置 */
    update(value) {
      Object.entries(value).forEach((d) => {
        this[d[0]] = d[1];
      });
    }
    toast(delay, type = "info", ...data) {
      document.body.contains(this) || document.body.appendChild(this);
      const toast2 = new Toast();
      toast2.type = type;
      toast2.rtl = this.rtl;
      this.container.insertBefore(toast2, this.container.firstChild);
      toast2.data = data;
      toast2.delay = delay;
      return toast2;
    }
    success(...data) {
      this.toast(this.delay, "success", ...data);
      return () => {
        debug(...data);
      };
    }
    error(...data) {
      this.toast(this.delay, "error", ...data);
      return () => {
        debug.error(...data);
      };
    }
    info(...data) {
      this.toast(this.delay, "info", ...data);
      return () => {
        debug.debug(...data);
      };
    }
    warning(...data) {
      this.toast(this.delay, "warning", ...data);
      return () => {
        debug.warn(...data);
      };
    }
    set position(v) {
      this.setAttribute("position", v);
    }
    /** 位置 */
    get position() {
      return this.getAttribute("position");
    }
    set rtl(v) {
      this.setAttribute("rtl", v);
    }
    /** 镜像 */
    get rtl() {
      return toObject(this.getAttribute("rtl"));
    }
    set delay(v) {
      this.setAttribute("delay", v);
    }
    /** 延时 */
    get delay() {
      return toObject(this.getAttribute("delay"));
    }
    set disabled(v) {
      this.setAttribute("disabled", v);
    }
    /** 禁用 */
    get disabled() {
      return toObject(this.getAttribute("disabled"));
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue)
        return;
      switch (name) {
        case "position":
          newValue && (this.container.className = \`toast-\${newValue}\`);
          break;
        case "rtl":
          this.container.querySelectorAll(".toast").forEach((d) => {
            d.rtl = toObject(newValue);
          });
          break;
        case "delay":
          this.container.querySelectorAll(".toast").forEach((d) => {
            d.delay = toObject(newValue);
          });
          break;
        case "disabled":
          this.container.style.display = toObject(newValue) ? "none" : "";
        default:
          break;
      }
    }
  };
  customElements.get(\`toast-container-\${"caecec5"}\`) || customElements.define(\`toast-container-\${"caecec5"}\`, ToastContainer);
  var toast = new ToastContainer();

  // src/core/user.ts
  init_tampermonkey();

  // src/core/userstatus.ts
  init_tampermonkey();

  // src/core/ui/entry.ts
  init_tampermonkey();

  // src/html/ui-entry.html
  var ui_entry_default = '<div class="setting">\\r\\n    <i></i><span>设置</span>\\r\\n</div>\\r\\n<div class="gear"></div>\\r\\n<style type="text/css">\\r\\n    .gear {\\r\\n        position: fixed;\\r\\n        right: 40px;\\r\\n        bottom: 60px;\\r\\n        height: 20px;\\r\\n        width: 20px;\\r\\n        border: 1px solid #e9eaec;\\r\\n        border-radius: 50%;\\r\\n        box-shadow: 0 0 12px 4px rgb(106, 115, 133, 22%);\\r\\n        padding: 10px;\\r\\n        cursor: pointer;\\r\\n        animation: roll 1s ease-out;\\r\\n        transition: opacity 0.3s ease-out;\\r\\n        background: none;\\r\\n        z-index: 11110;\\r\\n    }\\r\\n\\r\\n    .setting {\\r\\n        box-sizing: content-box;\\r\\n        color: #fff;\\r\\n        background-color: #fff;\\r\\n        border-radius: 5px;\\r\\n        position: fixed;\\r\\n        bottom: 65px;\\r\\n        width: 56px;\\r\\n        height: 40px;\\r\\n        transition: right 0.7s;\\r\\n        -moz-transition: right 0.7s;\\r\\n        -webkit-transition: right 0.7s;\\r\\n        -o-transition: right 0.7s;\\r\\n        z-index: 11110;\\r\\n        padding: 4px;\\r\\n        right: -54px;\\r\\n    }\\r\\n\\r\\n    .setting:hover {\\r\\n        right: 0px;\\r\\n        box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;\\r\\n        border: 1px solid rgb(233, 234, 236);\\r\\n    }\\r\\n\\r\\n    .setting i {\\r\\n        background-position: -471px -982px;\\r\\n        display: block;\\r\\n        width: 20px;\\r\\n        height: 20px;\\r\\n        transition: 0.2s;\\r\\n        background-image: url(//static.hdslb.com/images/base/icons.png);\\r\\n        margin: auto;\\r\\n    }\\r\\n\\r\\n    .setting span {\\r\\n        font-size: 14px;\\r\\n        display: block;\\r\\n        width: 50%;\\r\\n        transition: 0.2s;\\r\\n        color: #000;\\r\\n        margin: auto;\\r\\n    }\\r\\n\\r\\n    @keyframes roll {\\r\\n\\r\\n        30%,\\r\\n        60%,\\r\\n        90% {\\r\\n            transform: scale(1) rotate(0deg);\\r\\n        }\\r\\n\\r\\n        10%,\\r\\n        40%,\\r\\n        70% {\\r\\n            transform: scale(1.11) rotate(-180deg);\\r\\n        }\\r\\n\\r\\n        20%,\\r\\n        50%,\\r\\n        80% {\\r\\n            transform: scale(0.9) rotate(-360deg);\\r\\n        }\\r\\n    }\\r\\n</style>';

  // src/core/ui/entry.ts
  var UiEntryType = "new";
  var BilioldEntry = class extends HTMLElement {
    /** 旧版按钮 */
    stage;
    /** 新版按钮 */
    gear;
    /** 实际节点 */
    root;
    /** 实际根节点 */
    static get observedAttributes() {
      return [
        "type"
      ];
    }
    constructor() {
      super();
      this.root = this.attachShadow({ mode: "closed" });
      this.root.innerHTML = ui_entry_default;
      this.stage = this.root.children[0];
      this.gear = this.root.children[1];
      this.gear.innerHTML = svg.gear;
      this.stage.remove();
      this.gear.remove();
      this.gear.addEventListener("mouseover", () => this.gear.style.opacity = "0.8");
      this.gear.addEventListener("mouseout", () => this.gear.style.opacity = "0");
    }
    get type() {
      return this.getAttribute("type");
    }
    set type(v) {
      this.setAttribute("type", v);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue)
        return;
      switch (name) {
        case "type":
          if (newValue === "old") {
            this.root.contains(this.gear) && this.gear.remove();
            this.root.contains(this.stage) || this.root.appendChild(this.stage);
          } else {
            this.root.contains(this.stage) && this.stage.remove();
            if (!this.root.contains(this.gear)) {
              this.root.appendChild(this.gear);
              setTimeout(() => {
                this.gear.style.opacity = "0";
              }, 2e3);
            }
          }
          break;
        default:
          break;
      }
    }
  };
  customElements.get("biliold-entry-caecec5") || customElements.define("bilibili-entry-caecec5", BilioldEntry);

  // src/core/userstatus.ts
  var userStatus = {
    /** 开发者模式 */
    development: true,
    /** 主页 */
    index: true,
    /** toastr */
    toast: Toastconfig,
    /** 替换全局顶栏 */
    header: true,
    /** 翻页评论区 */
    comment: true,
    /** av */
    av: true,
    /** 嵌入式播放器 */
    player: true,
    /** WebRTC */
    webRTC: false,
    /** 充电鸣谢 */
    elecShow: true,
    /** 合作UP */
    staff: false,
    /** bangumi */
    bangumi: true,
    /** 解除限制 */
    videoLimit: {
      /** 开关 */
      status: false,
      /** 服务器类型 */
      server: "内置",
      /** 东南亚（泰区）代理服务器 */
      th: "api.global.bilibili.com",
      /** 台湾代理服务器 */
      tw: "",
      /** 香港代理服务器 */
      hk: "",
      /** 大陆代理服务器 */
      cn: ""
    },
    /** UPOS替换 */
    uposReplace: {
      /** 东南亚（泰区） */
      th: "ks3（金山）",
      /** 港澳台 */
      gat: "不替换",
      /** 一般视频 */
      nor: "不替换",
      /** 下载 */
      download: "不替换"
    },
    /** 强制显示bangumi分p */
    bangumiEplist: false,
    /** 账户授权 */
    accessKey: {
      /** access_key */
      token: void 0,
      /** 授权日期 */
      date: 0,
      /** 授权日期字符串 */
      dateStr: ""
    },
    /** 稍后再看 */
    watchlater: true,
    /** 播单 */
    playlist: true,
    /** 全站排行榜 */
    ranking: true,
    /** 专栏 */
    read: true,
    /** 搜索 */
    search: true,
    /** 相簿 */
    album: true,
    /** 注册时间 */
    jointime: false,
    /** 失效视频 */
    lostVideo: true,
    /** 纯视频历史 */
    history: true,
    /** 动态里的直播录屏 */
    liveRecord: false,
    /** 设置入口样式 */
    uiEntryType: UiEntryType,
    /** 自动化操作 */
    automate: {
      /** 展开弹幕列表 */
      danmakuFirst: false,
      /** 滚动到播放器 */
      showBofqi: false,
      /** 自动宽屏 */
      screenWide: false,
      /** 自动关弹幕 */
      noDanmaku: false,
      /** 自动播放 */
      autoPlay: false,
      /** 自动网页全屏 */
      webFullScreen: false,
      /** 记忆播放速率 */
      videospeed: false
    },
    /** 关闭抗锯齿 */
    videoDisableAA: false,
    /** 禁用直播间挂机检测 */
    disableSleepChcek: true,
    /** 禁止上报 */
    disableReport: true,
    /** 禁用评论跳转标题 */
    commentJumpUrlTitle: false,
    /** 合集 */
    ugcSection: false,
    /** 请求的文件类型 */
    downloadType: ["mp4"],
    /** 请求无水印源 */
    TVresource: false,
    /** 画质 */
    downloadQn: 127,
    /** 下载方式 */
    downloadMethod: "浏览器",
    /** User-Agent */
    userAgent: "Bilibili Freedoooooom/MarkII",
    /** referer */
    referer: "https://www.bilibili.com",
    /** 下载目录 */
    filepath: "",
    /** aria2 */
    aria2: {
      /** 服务器 */
      server: "http://localhost",
      /** 端口 */
      port: 6800,
      /** 令牌 */
      token: "",
      /** 分片数目 */
      split: 4,
      /** 分片大小 */
      size: 20
    },
    ef2: {
      /** 稍后下载 */
      delay: false,
      /** 静默下载 */
      silence: false
    },
    /** 点赞功能 */
    like: false,
    /** 重构播放器脚本 */
    bilibiliplayer: true,
    /** 检查播放器脚本更新 */
    checkUpdate: true,
    /** 不登录1080P支持 */
    show1080p: false,
    /** 调整顶栏banner样式 */
    fullBannerCover: false,
    /** 原生播放器新版弹幕 */
    dmproto: true,
    /** 普权弹幕换行 */
    dmwrap: true,
    /** 弹幕格式 */
    dmExtension: "xml",
    /** 合并已有弹幕 */
    dmContact: false,
    /** 分集数据 */
    episodeData: false,
    /** 港澳台新番时间表 */
    timeLine: false,
    /** 字幕：繁 -> 简 */
    simpleChinese: true,
    /** 资源cdn */
    cdn: "jsdelivr",
    /** 弹幕保护计划 */
    danmakuProtect: false,
    /** 下载按钮 */
    downloadButton: false,
    /** 全区域搜索 */
    searchAllArea: false
  };

  // src/core/ui/alert.ts
  init_tampermonkey();

  // src/utils/element.ts
  init_tampermonkey();

  // src/utils/poll.ts
  init_tampermonkey();
  function poll(check, callback, delay = 100, stop = 180) {
    let timer = setInterval(() => {
      const d = check();
      if (d) {
        clearInterval(timer);
        callback(d);
      }
    }, delay);
    stop && setTimeout(() => clearInterval(timer), stop * 1e3);
  }

  // src/utils/element.ts
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
      await new Promise((r) => poll(() => document.body, r));
    }
    parrent = parrent || document.head;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    id && !parrent.querySelector(\`#\${id}\`) && style.setAttribute("id", id);
    style.appendChild(document.createTextNode(txt));
    parrent.appendChild(style);
    return style;
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
  function getTotalTop(node) {
    var sum = 0;
    do {
      sum += node.offsetTop;
      node = node.offsetParent;
    } while (node);
    return sum;
  }

  // src/core/ui/utils/button.ts
  init_tampermonkey();

  // src/html/button.html
  var button_default = '<div class="button" role="button">按钮</div>\\r\\n<style>\\r\\n    .button {\\r\\n        width: fit-content;\\r\\n        cursor: pointer;\\r\\n        line-height: 28px;\\r\\n        padding-left: 10px;\\r\\n        padding-right: 10px;\\r\\n        text-align: right;\\r\\n        border: 1px solid #ccd0d7;\\r\\n        border-radius: 4px;\\r\\n        color: #222;\\r\\n        transition: border-color .2s ease, background-color .2s ease;\\r\\n        box-sizing: border-box;\\r\\n        user-select: none;\\r\\n    }\\r\\n\\r\\n    .button:hover {\\r\\n        color: #00a1d6;\\r\\n        border-color: #00a1d6;\\r\\n    }\\r\\n\\r\\n    .button:active {\\r\\n        background-color: #eee;\\r\\n    }\\r\\n</style>';

  // src/core/ui/utils/button.ts
  var PushButton = class extends HTMLElement {
    _button;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = button_default;
      this._button = root.querySelector(".button");
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(new Event("change"));
      });
    }
    set text(v) {
      this._button.textContent = v;
    }
  };
  customElements.get(\`button-\${"caecec5"}\`) || customElements.define(\`button-\${"caecec5"}\`, PushButton);

  // src/core/ui/utils/popupbox.ts
  init_tampermonkey();

  // src/html/popupbox.html
  var popupbox_default = '<div class="box">\\r\\n    <div class="contain"></div>\\r\\n    <div class="fork"></div>\\r\\n</div>\\r\\n<style type="text/css">\\r\\n    .box {\\r\\n        top: 50%;\\r\\n        left: 50%;\\r\\n        transform: translateX(-50%) translateY(-50%);\\r\\n        transition: 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);\\r\\n        padding: 12px;\\r\\n        background-color: #fff;\\r\\n        color: black;\\r\\n        border-radius: 8px;\\r\\n        box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);\\r\\n        border: 1px solid rgba(136, 136, 136, 0.13333);\\r\\n        box-sizing: border-box;\\r\\n        position: fixed;\\r\\n        font-size: 13px;\\r\\n        z-index: 11115;\\r\\n        line-height: 14px;\\r\\n    }\\r\\n\\r\\n    .contain {\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        height: 100%;\\r\\n    }\\r\\n\\r\\n    .fork {\\r\\n        position: absolute;\\r\\n        transform: scale(0.8);\\r\\n        right: 10px;\\r\\n        top: 10px;\\r\\n        height: 20px;\\r\\n        width: 20px;\\r\\n        pointer-events: visible;\\r\\n    }\\r\\n\\r\\n    .fork:hover {\\r\\n        border-radius: 50%;\\r\\n        background-color: rgba(0, 0, 0, 10%);\\r\\n    }\\r\\n</style>';

  // src/core/ui/utils/popupbox.ts
  var ClickOutRemove = class {
    constructor(target) {
      this.target = target;
      target.addEventListener("click", (e) => e.stopPropagation());
    }
    /** 已启用监听 */
    enabled = false;
    /** 移除节点 */
    remove = () => {
      this.target.remove();
    };
    /** 停止监听 */
    disable = () => {
      if (this.enabled) {
        document.removeEventListener("click", this.remove);
        this.enabled = false;
      }
      return this;
    };
    /** 开始监听 */
    enable = () => {
      this.enabled || setTimeout(() => {
        document.addEventListener("click", this.remove, { once: true });
        this.enabled = true;
      }, 100);
      return this;
    };
  };
  var PopupBox = class extends HTMLElement {
    _contain;
    _fork;
    clickOutRemove;
    \$fork = true;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = popupbox_default;
      this._contain = root.children[0].children[0];
      this._fork = root.children[0].children[1];
      this._fork.innerHTML = svg.fork;
      this._fork.addEventListener("click", () => this.remove());
      this.clickOutRemove = new ClickOutRemove(this);
      document.body.appendChild(this);
    }
    append(...nodes) {
      this._contain.append(...nodes);
    }
    appendChild(node) {
      this._contain.appendChild(node);
      return node;
    }
    replaceChildren(...nodes) {
      this._contain.replaceChildren(...nodes);
    }
    setAttribute(qualifiedName, value) {
      this._contain.setAttribute(qualifiedName, value);
    }
    getAttribute(qualifiedName) {
      return this._contain.getAttribute(qualifiedName);
    }
    get style() {
      return this._contain.style;
    }
    get innerHTML() {
      return this._contain.innerHTML;
    }
    set innerHTML(v) {
      this._contain.innerHTML = v;
    }
    /** 设置是否显示关闭按钮，不显示则点击节点外部自动关闭 */
    get fork() {
      return this.\$fork;
    }
    set fork(v) {
      this.\$fork = v;
      this._fork.style.display = v ? "" : "none";
      if (v) {
        this.clickOutRemove.disable();
      } else {
        this.clickOutRemove.enable();
      }
    }
  };
  customElements.get(\`popupbox-\${"caecec5"}\`) || customElements.define(\`popupbox-\${"caecec5"}\`, PopupBox);

  // src/core/ui/alert.ts
  function alert(msg, title, buttons, fork = false) {
    isArray(msg) || (msg = [msg]);
    msg = msg.join("</br>");
    const popup = new PopupBox();
    popup.fork = fork;
    popup.setAttribute("style", "max-width: 400px; max-height: 300px;line-height: 16px;");
    popup.innerHTML = \`<div style="text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;">
    <span>\${title || "Bilibili Old"}</span>
</div>
<div><div style="padding-block: 10px;padding-inline: 15px;">\${msg}</div></div>\`;
    if (buttons) {
      addElement("hr", { style: "width: 100%;opacity: .3;" }, popup);
      const div = addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;" }, popup);
      buttons.forEach((d) => {
        const button = new PushButton();
        button.text = d.text;
        button.addEventListener("change", () => {
          d.callback?.();
          popup.remove();
        });
        div.appendChild(button);
      });
    }
  }

  // src/core/user.ts
  var User = class {
    /** 用户数据，除非确定已初始化，否则请使用\`addCallback\`用户数据回调代替 */
    userStatus;
    /** 初始化标记 */
    initialized = false;
    /** 更新CD */
    updating;
    /** 回调栈 */
    changes = {};
    /** 更新存储延时 */
    timer;
    /** 用户数据加载回调序列 */
    userLoadedCallbacks = [];
    constructor() {
      GM.getValue("userStatus", userStatus).then((status) => {
        status = Object.assign(userStatus, status);
        const proxy = propertryChangeHook(status, (key, value) => {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => GM.setValue("userStatus", status));
          this.emitChange(key, value);
        });
        this.userStatus = proxy;
        this.initialized = true;
        while (this.userLoadedCallbacks.length) {
          this.userLoadedCallbacks.shift()?.(proxy);
        }
      });
    }
    /**
     * 监听设置改动
     * @param key 设置键
     * @param callback 设置项变动时执行的回调，新值将作为第一个参数传入
     * @returns 用于取消监听的回调
     */
    bindChange(key, callback) {
      this.changes[key] || (this.changes[key] = []);
      const id = this.changes[key].push(callback);
      return () => {
        delete this.changes[key][id - 1];
      };
    }
    /**
     * 推送设置改动
     * @param key 设置键
     * @param newValue 新值
     */
    emitChange(key, newValue) {
      this.changes[key].forEach(async (d) => {
        d(newValue);
      });
    }
    /** 用户数据回调 */
    addCallback(callback) {
      if (typeof callback === "function") {
        if (this.initialized) {
          callback(this.userStatus);
        } else {
          this.userLoadedCallbacks.push(callback);
        }
      }
    }
    /** 恢复默认数据 */
    restoreUserStatus() {
      GM.deleteValue("userStatus");
      toast.warning("已恢复默认设置数据，请<strong>刷新</strong>页面以避免数据紊乱！");
    }
    /** 备份设置数据 */
    outputUserStatus() {
      GM.getValue("userStatus", userStatus).then((d) => {
        saveAs(JSON.stringify(d, void 0, "	"), \`Bilibili-Old-\${timeFormat(void 0, true).replace(/ |:/g, (d2) => "-")}\`, "application/json");
      });
    }
    /** 恢复备份数据 */
    inputUserStatus() {
      const msg = ["请选择一个备份的数据文件（.json）", "注意：无效的数据文件可能导致异常！"];
      const tst = toast.toast(0, "warning", ...msg);
      fileRead("application/json").then((d) => {
        if (d && d[0]) {
          msg.push(\`读取文件：\${d[0].name}\`);
          tst.data = msg;
          tst.type = "info";
          return readAs(d[0]).then((d2) => {
            const data = JSON.parse(d2);
            if (typeof data === "object") {
              GM.setValue("userStatus", data);
              const text = "已恢复设置数据，请<strong>刷新</strong>页面以避免数据紊乱！";
              msg.push(text);
              tst.data = msg;
              tst.type = "success";
              return alert(text, "刷新页面", [{
                text: "刷新",
                callback: () => location.reload()
              }]);
            }
          }).catch((e) => {
            msg.push("读取文件出错！", e);
            tst.data = msg;
            tst.type = "error";
            debug.error("恢复设置数据", e);
          });
        }
      }).catch((e) => {
        msg.push(e);
        tst.data = msg;
      }).finally(() => {
        tst.delay = 4;
      });
    }
  };
  var user = new User();

  // src/core/video-info.ts
  init_tampermonkey();
  var VideoInfo = class {
    cids = {};
    stats = {};
    get metadata() {
      const cid = BLOD.cid;
      return cid ? this.cids[cid] : void 0;
    }
    get album() {
      return this.metadata?.album || this.title;
    }
    get artist() {
      return this.metadata?.artist;
    }
    get title() {
      return this.metadata?.title || document.title.slice(0, -26);
    }
    get artwork() {
      return this.metadata?.artwork;
    }
    get stat() {
      const aid = BLOD.aid;
      return aid ? this.stats[aid] : void 0;
    }
    /** 数据变动回调栈 */
    callbacks = [];
    /**
     * 数据变动回调
     * @param callback 数据变动时执行的回调函数
     * @returns 撤销监听的函数
     */
    bindChange(callback) {
      const id = this.callbacks.push(callback);
      return () => {
        delete this.callbacks[id - 1];
      };
    }
    timer;
    /** 推送数据变动 */
    emitChange() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.callbacks.forEach((d) => d(this)), 100);
    }
    /** 从\`IAidDatail\`中提取 */
    aidDatail(data) {
      const album = data.title;
      const artist = data.owner.name;
      const pic = data.pic.replace("http:", "");
      data.pages ? data.pages.forEach((d, i) => {
        this.cids[d.cid] = {
          album,
          artist,
          title: d.part || \`#\${i + 1}\`,
          artwork: [{ src: pic }]
        };
      }) : this.cids[data.cid] = {
        album,
        artist,
        title: \`#1\`,
        artwork: [{ src: pic }]
      };
      this.stats[data.aid] = data.stat;
      this.emitChange();
    }
    /** 从\`IAidInfo\`中提取 */
    aidInfo(data) {
      const album = data.title;
      const artist = data.upper.name;
      const pic = data.cover.replace("http:", "");
      data.pages ? data.pages.forEach((d, i) => {
        this.cids[d.id] = {
          album,
          artist,
          title: d.title || \`#\${i + 1}\`,
          artwork: [{ src: pic }]
        };
      }) : this.cids[data.id] = {
        album,
        artist,
        title: \`#1\`,
        artwork: [{ src: pic }]
      };
    }
    /** 从\`IBangumiSeasonResponse\`中提取 */
    bangumiSeason(data) {
      const album = data.title || data.jp_title;
      const artist = data.actors || data.staff || data.up_info?.name;
      const pic = data.cover.replace("http:", "");
      const bkg_cover = data.bkg_cover?.replace("http:", "");
      this.bangumiEpisode(data.episodes, album, artist, pic, bkg_cover);
      this.emitChange();
    }
    /** 从\`IBangumiEpisode\`中提取 */
    bangumiEpisode(data, album, artist, pic, bkg_cover) {
      data.forEach((d) => {
        const artwork = [{ src: d.cover.replace("http:", "") }, { src: pic }];
        bkg_cover && artwork.push({ src: bkg_cover });
        this.cids[d.cid] = {
          album,
          artist,
          title: d.index_title,
          artwork
        };
      });
    }
    toview(data) {
      const album = data.name;
      const pic = data.cover.replace("http:", "");
      data.list.forEach((d) => {
        const title = d.title;
        const cover = d.pic.replace("http:", "");
        const artist = d.owner.name;
        d.pages.forEach((d2, i) => {
          this.cids[d2.cid] = {
            album,
            artist,
            title: title + \`(\${d2.part})\`,
            artwork: [{ src: pic }, { src: cover }]
          };
        });
      });
      this.emitChange();
    }
    /** 设置浏览器媒体信息 */
    mediaSession() {
      if (this.metadata) {
        navigator.mediaSession.metadata = new MediaMetadata({ ...this.metadata });
      }
    }
  };
  var videoInfo = new VideoInfo();

  // src/core/danmaku.ts
  var Danmaku = class {
    listSoFixed = false;
    constructor() {
      user.addCallback((status) => {
        if (!status.bilibiliplayer) {
          this.listSoFix();
        }
      });
    }
    /** 原生旧版播放器使用protobuf弹幕 */
    listSoFix() {
      if (this.listSoFixed)
        return;
      this.listSoFixed = true;
      const that = this;
      new WorkerHook().postMessage(function(message) {
        if (message.url && message.url.includes("list.so")) {
          user.userStatus.dmwrap && that.trim();
          if (!user.userStatus.dmproto)
            return false;
          const params = urlObj(message.url);
          const startTime = (/* @__PURE__ */ new Date()).getTime();
          that.getSegDanmaku(void 0, params.oid).then((d) => {
            this.dispatchEvent(new MessageEvent("message", {
              data: {
                code: 0,
                danmakuArray: d,
                loadTime: (/* @__PURE__ */ new Date()).getTime() - startTime,
                parseTime: Math.random(),
                sendTip: "",
                state: 0,
                textSide: "",
                total: d.length.toString()
              }
            }));
          }).catch((e) => {
            console.error("protobuf 弹幕获取失败", e);
          });
          return true;
        }
        return false;
      });
    }
    /** 允许普权弹幕排版 */
    trim() {
      propertyHook(String.prototype, "trim", function() {
        return String(this);
      });
    }
    async getSegDanmaku(aid = BLOD.aid, cid = BLOD.cid) {
      if (!cid)
        throw new Error(\`无法获取弹幕 aid：\${aid} cid：\${cid}\`);
      return new ApiDmWeb(aid, cid).toCmd();
    }
    /** 加载本地xml弹幕 */
    localDmXml() {
      if (!window.player)
        return toast.warning("未找到播放器实例！请在播放页面使用。");
      if (!window.player?.appendDm)
        return toast.warning("未启用【重构播放器】，无法载入弹幕！");
      const data = ["请选择一个弹幕文件，拓展名：.xml，编码：utf-8"];
      const tst = toast.toast(0, "info", ...data);
      fileRead(".xml", false).then((d) => {
        if (d && d[0]) {
          data.push("-------loading-------", \`弹幕：\${d[0].name}\`, \`类型：\${d[0].type}\`, \`大小：\${sizeFormat(d[0].size)}\`);
          tst.data = data;
          tst.type = "warning";
          return readAs(d[0]);
        }
        throw new Error(data[0]);
      }).then((d) => {
        const dm = DanmakuBase.decodeXml(d);
        window.player.appendDm(dm, !user.userStatus.dmContact);
        data.push("-------decoding-------", \`有效弹幕数：\${dm.length}\`, \`加载模式：\${user.userStatus.dmContact ? "与已有弹幕合并" : "清空已有弹幕"}\`);
        tst.data = data;
        tst.type = "success";
      }).catch((e) => {
        data.push(e);
        debug.error(e);
        tst.data = data;
        tst.type = "error";
      }).finally(() => {
        tst.delay = user.userStatus.toast.delay;
      });
    }
    /** 加载本地json弹幕 */
    localDmJson() {
      if (!window.player)
        return toast.warning("未找到播放器实例！请在播放页面使用。");
      if (!window.player?.appendDm)
        return toast.warning("未启用【重构播放器】，无法载入弹幕！");
      const data = ["请选择一个弹幕文件，拓展名：.json，编码：utf-8"];
      const tst = toast.toast(0, "info", ...data);
      fileRead(".json", false).then((d) => {
        if (d && d[0]) {
          data.push("-------loading-------", \`弹幕：\${d[0].name}\`, \`类型：\${d[0].type}\`, \`大小：\${sizeFormat(d[0].size)}\`);
          tst.data = data;
          tst.type = "warning";
          return readAs(d[0]);
        }
        throw new Error(data[0]);
      }).then((d) => {
        const dm = JSON.parse(d);
        window.player.appendDm(dm, !user.userStatus.dmContact);
        data.push("-------decoding-------", \`有效弹幕数：\${dm.length}\`, \`加载模式：\${user.userStatus.dmContact ? "与已有弹幕合并" : "清空已有弹幕"}\`);
        tst.data = data;
        tst.type = "success";
      }).catch((e) => {
        data.push(e);
        debug.error(e);
        tst.data = data;
        tst.type = "error";
      }).finally(() => {
        tst.delay = user.userStatus.toast.delay;
      });
    }
    /** 下载弹幕 */
    async download(aid = BLOD.aid, cid = BLOD.cid) {
      if (!cid)
        return toast.warning("未找到播放器实例！请在播放页面使用。");
      const dms = window.player?.getDanmaku ? window.player.getDanmaku() : await new ApiDmWeb(aid, cid).getData();
      const metadata = videoInfo.metadata;
      const title = metadata ? \`\${metadata.album}(\${metadata.title})\` : \`\${aid}.\${cid}\`;
      if (user.userStatus.dmExtension === "json") {
        return saveAs(JSON.stringify(dms, void 0, "	"), \`\${title}.json\`, "application/json");
      }
      return saveAs(DanmakuBase.encodeXml(DanmakuBase.parseCmd(dms), cid), \`\${title}.xml\`, "application/xml");
    }
    /** 加载在线弹幕 */
    async onlineDm(str) {
      if (!window.player)
        return toast.warning("未找到播放器实例！请在播放页面使用。");
      if (!window.player?.appendDm)
        return toast.warning("未启用【重构播放器】，无法载入弹幕！");
      const data = ["-------在线弹幕-------", \`目标：\${str}\`];
      const tst = toast.toast(0, "info", ...data);
      const { aid, cid } = await urlParam(str);
      data.push(\`aid：\${aid}\`, \`cid：\${cid}\`);
      tst.data = data;
      if (!aid || !cid) {
        data.push("查询cid信息失败，已退出！");
        tst.data = data;
        tst.type = "error";
        tst.delay = toast.delay;
      } else {
        new ApiDmWeb(aid, cid).getData().then((d) => {
          window.player.appendDm(d, !user.userStatus.dmContact);
          data.push(\`有效弹幕数：\${d.length}\`, \`加载模式：\${user.userStatus.dmContact ? "与已有弹幕合并" : "清空已有弹幕"}\`);
          tst.data = data;
          tst.type = "success";
        }).catch((e) => {
          data.push(e);
          debug.error(e);
          tst.data = data;
          tst.type = "error";
        }).finally(() => {
          tst.delay = user.userStatus.toast.delay;
        });
      }
    }
  };
  var danmaku = new Danmaku();

  // src/core/download.ts
  init_tampermonkey();

  // src/io/api-playurl.ts
  init_tampermonkey();

  // src/io/fnval.ts
  init_tampermonkey();
  var qn = 127;
  var fnver = 0;
  var fnval = 0 /* FLV */ + 16 /* DASH_H265 */ + 64 /* HDR */ + 128 /* DASH_4K */ + 256 /* DOLBYAUDIO */ + 512 /* DOLBYVIDEO */ + 1024 /* DASH_8K */ + 2048 /* DASH_AV1 */;

  // src/io/api-playurl.ts
  var PlayurlDescriptionMap = {
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
  var PlayurlFormatMap = {
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
  var PlayurlQualityMap = {
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
  var PlayurlCodecs = {
    30126: "hvc1.2.4.L153.90",
    126: "hvc1.2.4.L153.90",
    30121: "hev1.1.6.L156.90",
    121: "hev1.1.6.L156.90",
    30120: "avc1.64003C",
    120: "avc1.64003C",
    30112: "avc1.640028",
    // 1080P+
    112: "avc1.640028",
    // 1080P+
    30102: "hev1.1.6.L120.90",
    // HEVC 1080P+
    102: "hev1.1.6.L120.90",
    // HEVC 1080P+
    30080: "avc1.640028",
    // 1080P
    80: "avc1.640028",
    // 1080P
    30077: "hev1.1.6.L120.90",
    // HEVC 1080P
    77: "hev1.1.6.L120.90",
    // HEVC 1080P
    30064: "avc1.64001F",
    // 720P
    64: "avc1.64001F",
    // 720P
    30066: "hev1.1.6.L120.90",
    // HEVC 720P
    66: "hev1.1.6.L120.90",
    // HEVC 720P
    30032: "avc1.64001E",
    // 480P
    32: "avc1.64001E",
    // 480P
    30033: "hev1.1.6.L120.90",
    // HEVC 480P
    33: "hev1.1.6.L120.90",
    // HEVC 480P
    30011: "hev1.1.6.L120.90",
    // HEVC 360P
    11: "hev1.1.6.L120.90",
    // HEVC 360P
    30016: "avc1.64001E",
    // 360P
    16: "avc1.64001E",
    // 360P
    30006: "avc1.64001E",
    //240P
    6: "avc1.64001E",
    // 240P
    30005: "avc1.64001E",
    // 144P
    5: "avc1.64001E",
    // 144P
    30251: "fLaC",
    // Hires
    30250: "ec-3",
    // Dolby
    30280: "mp4a.40.2",
    // 高码音频
    30232: "mp4a.40.2",
    // 中码音频
    30216: "mp4a.40.2"
    // 低码音频
  };
  var PlayurlCodecsAPP = {
    30016: "avc1.64001E",
    // APP源 360P
    16: "avc1.64001E",
    // APP源 360P
    30032: "avc1.64001F",
    // APP源 480P
    32: "avc1.64001F",
    // APP源 480P
    30064: "avc1.640028",
    // APP源 720P
    64: "avc1.640028",
    // APP源 720P
    30080: "avc1.640032",
    // APP源 1080P
    80: "avc1.640032",
    // APP源 1080P
    30216: "mp4a.40.2",
    // APP源 低码音频
    30232: "mp4a.40.2",
    // APP源 中码音频
    30280: "mp4a.40.2"
    // APP源 高码音频 
  };
  var PlayurlFrameRate = {
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
  var PlayurlResolution = {
    30121: [3840, 2160],
    121: [3840, 2160],
    30120: [3840, 2160],
    120: [3840, 2160],
    30112: [1920, 1080],
    // 1080P+
    112: [1920, 1080],
    // 1080P+
    30102: [1920, 1080],
    // HEVC 1080P+
    102: [1920, 1080],
    // HEVC 1080P+
    30080: [1920, 1080],
    // 1080P
    80: [1920, 1080],
    // 1080P
    30077: [1920, 1080],
    // HEVC 1080P
    77: [1920, 1080],
    // HEVC 1080P
    30064: [1280, 720],
    // 720P
    64: [1280, 720],
    // 720P
    30066: [1280, 720],
    // HEVC 720P
    66: [1280, 720],
    // HEVC 720P
    30032: [852, 480],
    // 480P
    32: [852, 480],
    // 480P
    30033: [852, 480],
    // HEVC 480P
    33: [852, 480],
    // HEVC 480P
    30011: [640, 360],
    // HEVC 360P
    11: [640, 360],
    // HEVC 360P
    30016: [640, 360],
    // 360P
    16: [640, 360],
    // 360P
    30006: [426, 240],
    // 240P
    6: [426, 240],
    // 240P
    30005: [256, 144],
    // 144P
    5: [256, 144]
    // 144P
  };
  var PlayurlDash = class {
    accept_description = [];
    accept_format = "";
    accept_quality = [];
    bp = 0;
    code = 0;
    dash = {
      audio: [],
      dolby: { audio: [], type: 0 },
      duration: 0,
      min_buffer_time: 1.5,
      minBufferTime: 1.5,
      video: []
    };
    fnval = 4048;
    fnver = 0;
    format = "flv";
    from = "local";
    has_paid = true;
    is_preview = 0;
    message = "";
    no_rexcode = 1;
    quality = 80;
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
  async function apiPlayurl(data, dash = true, pgc = false, server = "api.bilibili.com") {
    data = Object.assign({
      qn,
      otype: "json",
      fourk: 1
    }, data, dash ? { fnver, fnval } : {});
    const response = await fetch(objUrl(pgc ? URLS.PGC_PLAYURL.replace("api.bilibili.com", server) : URLS.PLAYURL, data), { credentials: "include" });
    const json = await response.json();
    if (pgc) {
      return jsonCheck(json).result;
    }
    return jsonCheck(json).data;
  }

  // src/io/api-playurl-interface.ts
  init_tampermonkey();
  var ApiPlayurlInterface = class extends ApiSign {
    constructor(data, pgc = false) {
      super(pgc ? URLS.PLAYURL_BANGUMI : URLS.PLAYURL_INTERFACE, "YvirImLGlLANCLvM");
      this.data = data;
      this.data = Object.assign({
        otype: "json",
        qn: data.quality,
        type: "",
        fnver,
        fnval
      }, data, pgc ? { module: "bangumi", season_type: 1 } : {});
    }
    async getData() {
      const response = await fetch(this.sign(), { credentials: "include" });
      return await response.json();
    }
  };

  // src/io/api-playurl-intl.ts
  init_tampermonkey();
  var ApiPlayurlIntl = class extends ApiSign {
    constructor(data, dash = true, pgc = false) {
      super(pgc ? URLS.INTL_OGV_PLAYURL : URLS.INTL_PLAYURL, "bb3101000e232e27");
      this.data = data;
      this.pgc = pgc;
      this.data = Object.assign({
        device: "android",
        force_host: 1,
        mobi_app: "android_i",
        qn,
        platform: "android_i",
        fourk: 1,
        build: 2100110,
        otype: "json"
      }, data, dash ? { fnval, fnver } : {});
    }
    async getData() {
      const response = await GM.fetch(this.sign());
      const json = await response.json();
      if (this.pgc) {
        return jsonCheck(json);
      }
      return jsonCheck(json).data;
    }
  };

  // src/io/api-playurl-tv.ts
  init_tampermonkey();
  var ApiPlayurlTv = class extends ApiSign {
    constructor(data, dash = true, pgc = false) {
      super(pgc ? URLS.PGC_PLAYURL_TV : URLS.UGC_PLAYURL_TV, "4409e2ce8ffd12b8");
      this.data = data;
      this.data = Object.assign({
        qn,
        fourk: 1,
        otype: "json",
        platform: "android",
        mobi_app: "android_tv_yst",
        build: 102801
      }, data, dash ? { fnval, fnver } : {});
    }
    async getData() {
      const response = await fetch(this.sign());
      const json = await response.json();
      return jsonCheck(json);
    }
  };

  // src/io/api-playurlproj.ts
  init_tampermonkey();
  var ApiPlayurlProj = class extends ApiSign {
    constructor(data, pgc = false) {
      super(pgc ? URLS.PGC_PLAYURL_PROJ : URLS.PLAYURL_PROJ, "bb3101000e232e27");
      this.data = data;
      this.data = Object.assign({
        build: "2040100",
        device: "android",
        mobi_app: "android_i",
        otype: "json",
        platform: "android_i",
        qn
      }, data);
      pgc && (this.data.module = "bangumi");
    }
    async getData() {
      const response = await fetch(this.sign());
      return await response.json();
    }
  };

  // src/core/download/aria2.ts
  init_tampermonkey();

  // src/utils/mutex.ts
  init_tampermonkey();
  function getMetux() {
    return Math.random().toString(36).substring(2);
  }

  // src/core/download/aria2.ts
  var Aria2 = class {
    constructor(userAgent, referer, dir, server = "http://localhost", port = 6800, token, split, size) {
      this.userAgent = userAgent;
      this.referer = referer;
      this.dir = dir;
      this.server = server;
      this.port = port;
      this.token = token;
      this.split = split;
      this.size = size;
    }
    get url() {
      return \`\${this.server}:\${this.port}/jsonrpc\`;
    }
    /** 命令行 */
    cmdlet(data) {
      const arr2 = ["aria2c"];
      data.urls.forEach((d) => arr2.push(\`"\${d}"\`));
      data.out && arr2.push(\`--out="\${data.out}"\`);
      (data.userAgent || this.userAgent) && arr2.push(\`--user-agent="\${data.userAgent || this.userAgent}"\`);
      (data.referer || this.referer) && arr2.push(\`--referer="\${data.referer || this.referer}"\`);
      (data.dir || this.dir) && arr2.push(\`--dir="\${data.dir || this.dir}"\`);
      (data.split || this.split) && arr2.push(\`--split="\${data.split || this.split}"\`, \`--max-connection-per-server="\${data.split || this.split}"\`);
      (data.size || this.size) && arr2.push(\`--min-split-size="\${data.size || this.size}M"\`);
      data.header && Object.entries(data.header).forEach((d) => arr2.push(\`--header="\${d[0]}: \${d[1]}"\`));
      return navigator.clipboard.writeText(arr2.join(" "));
    }
    /** RPC */
    rpc(data) {
      const options = {};
      data.out && (options.out = data.out);
      (data.userAgent || this.userAgent) && (options["user-agent"] = data.userAgent || this.userAgent);
      (data.referer || this.referer) && (options.referer = data.referer || this.referer);
      (data.dir || this.dir) && (options.dir = data.dir || this.dir);
      (data.split || this.split) && (options.split = options["max-connection-per-server"] = data.split || this.split);
      (data.size || this.size) && (options["min-split-size"] = \`\${data.size || this.size}M\`);
      data.header && (options.header = data.header);
      return this.postMessage("aria2.addUri", data.id, [data.urls, options]);
    }
    /** 获取aria2配置信息 */
    getVersion() {
      return this.postMessage("aria2.getVersion");
    }
    postMessage(method, id = getMetux(), params = []) {
      this.token && params.unshift(\`token:\${this.token}\`);
      return new Promise((r, j) => {
        fetch(this.url, {
          method: "POST",
          body: JSON.stringify({ method, id, params }),
          headers: {
            "Content-Type": "application/json"
          }
        }).then((d) => d.json()).then((d) => {
          d.error && j(d.error);
          d.result && r(d.result);
        }).catch((e) => {
          debug.error("RPC<POST>", e);
          fetch(objUrl(this.url, { method, id, params: base64.encode(JSON.stringify(params)) })).then((d) => d.json()).then((d) => {
            d.error && j(d.error);
            d.result && r(d.result);
          }).catch((e2) => {
            debug.error("RPC<GET>", e2);
            j(e2);
          });
        });
      });
    }
  };

  // src/core/download/ef2.ts
  init_tampermonkey();
  var Ef2 = class {
    constructor(userAgent, referer, dir, delay = false, silence = false) {
      this.userAgent = userAgent;
      this.referer = referer;
      this.dir = dir;
      this.delay = delay;
      this.silence = silence;
    }
    /** 拉起IDM */
    sendLinkToIDM(data) {
      this.rebuildData(data);
      const ef2str = Ef2.encode(data);
      const a = document.createElement("a");
      a.href = ef2str;
      a.click();
      return ef2str;
    }
    /** 生成ef2文件 */
    file(data, fileName) {
      this.rebuildData(data);
      return Ef2.file([data], fileName);
    }
    /** 补全数据 */
    rebuildData(data) {
      this.userAgent && !data.userAgent && (data.userAgent = this.userAgent);
      this.referer && !data.referer && (data.referer = this.referer);
      this.dir && !data.dir && (data.dir = this.dir);
      this.delay && !data.delay && (data.delay = this.delay);
      this.silence && !data.silence && (data.silence = this.silence);
    }
    /** 生成ef2文件 */
    static file(data, fileName) {
      const result = [];
      data.forEach((d) => {
        const arr2 = ["<", "", "", "", ""];
        Object.entries(d).forEach((d2) => {
          switch (d2[0]) {
            case "cookie":
              arr2[4] = \`cookie: \${d2[1]}\`;
              break;
            case "delay":
              break;
            case "dir":
              d2[1] = d2[1].replace(/\\//, "\\\\");
              d2[1].endsWith("\\\\") && (d2[1] = d2[1].slice(0, -1));
              arr2.push(\`filepath: \${d2[1]}\`);
              break;
            case "out":
              arr2.push(\`filename: \${d2[1]}\`);
              break;
            case "password":
              arr2.push(\`password: \${d2[1]}\`);
              break;
            case "body":
              arr2.push(\`postdata: \${d2[1]}\`);
              break;
            case "referer":
              arr2[2] = \`referer: \${d2[1]}\`;
              break;
            case "silence":
              break;
            case "url":
              d2[1].startsWith("//") && (d2[1] = "https:" + d2[1]);
              arr2[1] = d2[1];
              break;
            case "userAgent":
              arr2[3] = \`User-Agent: \${d2[1]}\`;
              break;
            case "userName":
              arr2.push(\`username: \${d2[1]}\`);
              break;
            default:
              break;
          }
        });
        arr2.push(">");
        arr2.forEach((d2) => {
          d2 && result.push(d2);
        });
      });
      result.push("");
      saveAs(result.join("\\r\\n"), fileName || \`\${data[0].out || getMetux()}.ef2\`);
    }
    /** 生成ef2协议 */
    static encode(data) {
      const arr2 = [];
      Object.entries(data).forEach((d) => {
        typeof d[1] === "string" && d[1].startsWith('"') || (d[1] = \`"\${d[1]}"\`);
        switch (d[0]) {
          case "cookie":
            arr2.push("-c", d[1]);
            break;
          case "delay":
            arr2.push("-q");
            break;
          case "dir":
            d[1] = d[1].replace(/\\//, "\\\\");
            d[1].endsWith("\\\\") && (d[1] = d[1].slice(0, -1));
            arr2.push("-o", d[1]);
            break;
          case "out":
            arr2.push("-s", d[1]);
            break;
          case "password":
            arr2.push("-P", d[1]);
            break;
          case "body":
            arr2.push("-d", d[1]);
            break;
          case "referer":
            arr2.push("-r", d[1]);
            break;
          case "silence":
            arr2.push("-f");
            break;
          case "url":
            d[1].startsWith("//") && (d[1] = "https:" + d[1]);
            arr2.push("-u", d[1]);
            break;
          case "userAgent":
            arr2.push("-a", d[1]);
            break;
          case "userName":
            arr2.push("-U", d[1]);
            break;
          default:
            break;
        }
      });
      return \`ef2://\${base64.encode(arr2.join(" "))}\`;
    }
    /** 解码ef2协议 */
    static decode(ef2str) {
      ef2str = ef2str.replace("ef2://", "");
      ef2str = base64.decode(ef2str);
      const arr2 = ef2str.split(" ");
      const data = {};
      for (let i = 0; i < arr2.length; i++) {
        if (/-\\w/.test(arr2[i])) {
          switch (arr2[i]) {
            case "-c":
              data.cookie = arr2[i + 1];
              i++;
              break;
            case "-q":
              data.delay = true;
              break;
            case "-o":
              data.dir = arr2[i + 1];
              i++;
              break;
            case "-s":
              data.out = arr2[i + 1];
              i++;
              break;
            case "-P":
              data.password = arr2[i + 1];
              i++;
              break;
            case "-d":
              data.body = arr2[i + 1];
              i++;
              break;
            case "-r":
              data.referer = arr2[i + 1];
              i++;
              break;
            case "-f":
              data.silence = true;
              break;
            case "-u":
              data.url = arr2[i + 1];
              i++;
              break;
            case "-a":
              data.userAgent = arr2[i + 1];
              i++;
              break;
            case "-U":
              data.userName = arr2[i + 1];
              i++;
              break;
            default:
              break;
          }
        }
      }
      return data;
    }
  };

  // src/core/download/playinfo.ts
  init_tampermonkey();
  var PlayinfoFilter = class {
    constructor(fileName) {
      this.fileName = fileName;
    }
    /** 数据 */
    record = [];
    /** id => 质量 */
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
    /** id => 类型（备用方案） */
    codec = {
      hev: [30127, 30126, 30125, 30121, 30106, 30102, 30077, 30066, 30033, 30011],
      avc: [30120, 30112, 30080, 30064, 30032, 30016],
      av1: [100029, 100028, 100027, 100026, 100024, 100023, 100022]
    };
    /** 颜色表 */
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
    /**
     * 解码playurl的下载数据
     * @param playinfo playurl返回值(json)
     */
    filter(playinfo) {
      typeof playinfo === "string" && (playinfo = toObject(playinfo));
      if (playinfo) {
        playinfo.data && this.filter(playinfo.data);
        playinfo.result && this.filter(playinfo.result);
        playinfo.durl && this.durl(playinfo.durl);
        playinfo.dash && this.dash(playinfo.dash);
      }
      return this.record;
    }
    /**
     * 整理durl部分
     * @param durl durl信息
     */
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
    /**
     * 整理dash部分
     * @param dash dash信息
     */
    dash(dash) {
      dash.video && this.dashVideo(dash.video, dash.duration);
      dash.audio && this.dashAudio(dash.audio, dash.duration);
      dash.dolby && dash.dolby.audio && Array.isArray(dash.dolby.audio) && this.dashAudio(dash.dolby.audio, dash.duration);
      dash.flac && dash.flac.audio && this.dashAudio([dash.flac.audio], dash.duration, ".flac");
    }
    /**
     * 整理dash视频部分
     * @param video dash视频信息
     * @param duration duration信息，配合bandwidth能计算出文件大小
     */
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
    /**
     * 整理dash音频部分
     * @param audio dash音频信息
     * @param duration duration信息，配合bandwidth能计算出文件大小
     * @param fmt 音频拓展名，默认\`.m4a\`
     */
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
    /**
     * 根据url确定画质/音质信息  
     * 需要维护quality表
     * @param url 多媒体url
     * @param id 媒体流id
     * @returns 画质/音质信息
     */
    getQuality(url, id) {
      return this.quality[this.getID(url)] || id && this.quality[id] || "N/A";
    }
    /**
     * 从url中提取可能的id
     * @param url 多媒体url
     */
    getID(url) {
      let id = 0;
      url.replace(/\\d+\\.((flv)|(mp4)|(m4s))/, (d) => id = Number(d.split(".")[0]));
      return id;
    }
  };

  // src/core/observer.ts
  init_tampermonkey();
  var nodelist = [];
  var observe = new MutationObserver(async (d) => d.forEach((d2) => {
    d2.addedNodes[0] && nodelist.forEach((f) => {
      try {
        f(d2.addedNodes[0]);
      } catch (e) {
        debug.error("MutationObserver", e);
      }
    });
  }));
  observe.observe(document, { childList: true, subtree: true });
  function observerAddedNodes(callback) {
    try {
      if (typeof callback === "function")
        nodelist.push(callback);
      return nodelist.length - 1;
    } catch (e) {
      debug.error(e);
    }
  }
  var switchlist = [];
  function switchVideo(callback) {
    try {
      if (typeof callback === "function")
        switchlist.push(callback);
    } catch (e) {
      debug.error("switchVideo", e);
    }
  }
  observerAddedNodes((node) => {
    if (/video-state-pause/.test(node.className)) {
      switchlist.forEach(async (d) => {
        try {
          d();
        } catch (e) {
          debug.error(d);
        }
      });
    }
  });

  // src/core/ui/download.ts
  init_tampermonkey();

  // src/html/download.html
  var download_default2 = '<div class="table"></div>\\r\\n<style type="text/css">\\r\\n    .table {\\r\\n        position: fixed;\\r\\n        z-index: 11113;\\r\\n        bottom: 0;\\r\\n        width: 100%;\\r\\n        min-height: 50px;\\r\\n        display: flex;\\r\\n        box-sizing: border-box;\\r\\n        background: #fff;\\r\\n        border-radius: 8px;\\r\\n        box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);\\r\\n        transition: transform 0.3s ease-in;\\r\\n        flex-wrap: wrap;\\r\\n        align-content: center;\\r\\n        justify-content: center;\\r\\n        align-items: center;\\r\\n    }\\r\\n\\r\\n    .cell {\\r\\n        background-color: #fff;\\r\\n        color: #000 !important;\\r\\n        border: #ccc 1px solid;\\r\\n        border-radius: 3px;\\r\\n        display: flex;\\r\\n        margin: 3px;\\r\\n        flex-wrap: wrap;\\r\\n        align-content: center;\\r\\n        justify-content: center;\\r\\n        align-items: center;\\r\\n        flex-direction: row;\\r\\n    }\\r\\n\\r\\n    .type {\\r\\n        color: #000 !important;\\r\\n        display: table-cell;\\r\\n        min-width: 1.5em;\\r\\n        text-align: center;\\r\\n        vertical-align: middle;\\r\\n        padding: 10px 3px;\\r\\n    }\\r\\n\\r\\n    .type.mp4 {\\r\\n        background-color: #e0e;\\r\\n    }\\r\\n\\r\\n    .type.av1 {\\r\\n        background-color: #feb;\\r\\n    }\\r\\n\\r\\n    .type.avc {\\r\\n        background-color: #07e;\\r\\n    }\\r\\n\\r\\n    .type.hev {\\r\\n        background-color: #7ba;\\r\\n    }\\r\\n\\r\\n    .type.aac {\\r\\n        background-color: #0d0;\\r\\n    }\\r\\n\\r\\n    .type.flv {\\r\\n        background-color: #0dd;\\r\\n    }\\r\\n\\r\\n    .item {\\r\\n        display: table-cell;\\r\\n        text-decoration: none;\\r\\n        padding: 3px;\\r\\n        cursor: pointer;\\r\\n        color: #1184B4;\\r\\n    }\\r\\n\\r\\n    .item:hover {\\r\\n        color: #FE3676;\\r\\n    }\\r\\n\\r\\n    .up {\\r\\n        color: #fff !important;\\r\\n        text-align: center;\\r\\n        padding: 1px 3px;\\r\\n        background-color: #777;\\r\\n    }\\r\\n\\r\\n    .up.yellow {\\r\\n        background-color: #ffe42b;\\r\\n        background-image: linear-gradient(to right, #ffe42b, #dfb200);\\r\\n    }\\r\\n\\r\\n    .up.pink {\\r\\n        background-color: #ffafc9;\\r\\n        background-image: linear-gradient(to right, #ffafc9, #dfada7);\\r\\n    }\\r\\n\\r\\n    .up.purple {\\r\\n        background-color: #c0f;\\r\\n        background-image: linear-gradient(to right, #c0f, #90f);\\r\\n    }\\r\\n\\r\\n    .up.red {\\r\\n        background-color: #f00;\\r\\n        background-image: linear-gradient(to right, #f00, #c00);\\r\\n    }\\r\\n\\r\\n    .up.orange {\\r\\n        background-color: #f90;\\r\\n        background-image: linear-gradient(to right, #f90, #d70);\\r\\n    }\\r\\n\\r\\n    .up.blue {\\r\\n        background-color: #00d;\\r\\n        background-image: linear-gradient(to right, #00d, #00b);\\r\\n    }\\r\\n\\r\\n    .up.green {\\r\\n        background-color: #0d0;\\r\\n        background-image: linear-gradient(to right, #0d0, #0b0);\\r\\n    }\\r\\n\\r\\n    .up.lv9 {\\r\\n        background-color: #151515;\\r\\n        background-image: linear-gradient(to right, #151515, #030303);\\r\\n    }\\r\\n\\r\\n    .up.lv8 {\\r\\n        background-color: #841cf9;\\r\\n        background-image: linear-gradient(to right, #841cf9, #620ad7);\\r\\n    }\\r\\n\\r\\n    .up.lv7 {\\r\\n        background-color: #e52fec;\\r\\n        background-image: linear-gradient(to right, #e52fec, #c30dca);\\r\\n    }\\r\\n\\r\\n    .up.lv6 {\\r\\n        background-color: #ff0000;\\r\\n        background-image: linear-gradient(to right, #ff0000, #dd0000);\\r\\n    }\\r\\n\\r\\n    .up.lv5 {\\r\\n        background-color: #ff6c00;\\r\\n        background-image: linear-gradient(to right, #ff6c00, #dd4a00);\\r\\n    }\\r\\n\\r\\n    .up.lv4 {\\r\\n        background-color: #ffb37c;\\r\\n        background-image: linear-gradient(to right, #ffb37c, #dd915a);\\r\\n    }\\r\\n\\r\\n    .up.lv3 {\\r\\n        background-color: #92d1e5;\\r\\n        background-image: linear-gradient(to right, #92d1e5, #70b0c3);\\r\\n    }\\r\\n\\r\\n    .up.lv2 {\\r\\n        background-color: #95ddb2;\\r\\n        background-image: linear-gradient(to right, #95ddb2, #73bb90);\\r\\n    }\\r\\n\\r\\n    .up.lv1 {\\r\\n        background-color: #bfbfbf;\\r\\n        background-image: linear-gradient(to right, #bfbfbf, #9d9d9d);\\r\\n    }\\r\\n\\r\\n    .down {\\r\\n        font-size: 90%;\\r\\n        margin-top: 2px;\\r\\n        text-align: center;\\r\\n        padding: 1px 3px;\\r\\n    }\\r\\n</style>';

  // src/core/ui/download.ts
  var BilioldDownload = class extends HTMLElement {
    _container;
    _cells = {};
    _noData;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = download_default2;
      this._container = root.children[0];
      this.addEventListener("click", (e) => e.stopPropagation());
      this._noData = addElement("div", void 0, this._container, "正在获取下载数据~");
    }
    updateItem = (key, value) => {
      this._container.contains(this._noData) && this._noData.remove();
      this._cells[key] || (this._cells[key] = addElement("div", { class: "cell" }, this._container));
      this._cells[key].innerHTML = \`<div class="type \${key}">\${key}</div>\`;
      value ? value.forEach((d) => {
        const a = addElement("a", { class: "item", target: "_blank" }, this._cells[key], \`<div class="up\${d.color ? \` \${d.color}\` : ""}">\${d.quality}</div><div class="down">\${d.size}</div>\`);
        d.url && (a.href = d.url[0]);
        d.fileName && (a.download = d.fileName);
        d.onClick && a.addEventListener("click", (e) => d.onClick(e));
      }) : this._cells[key]?.remove();
      this._container.firstChild || this._container.replaceChildren(this._noData);
    };
    show() {
      document.contains(this) || document.body.appendChild(this);
      this.style.display = "";
      window.addEventListener("click", () => {
        this.style.display = "none";
      }, { once: true });
    }
    init() {
      return propertryChangeHook({}, this.updateItem);
    }
    disconnectedCallback() {
      this.destory();
    }
    destory() {
      this._cells = {};
      this._container.replaceChildren(this._noData);
    }
  };
  customElements.get(\`download-\${"caecec5"}\`) || customElements.define(\`download-\${"caecec5"}\`, BilioldDownload);

  // src/core/ui/preview-image.ts
  init_tampermonkey();

  // src/html/preview-image.html
  var preview_image_default = '<div class="reply-view-image">\\r\\n    <!-- 操作区 -->\\r\\n    <div class="operation-btn">\\r\\n        <div class="operation-btn-icon close-container">\\r\\n            <i class="svg-icon close use-color" style="width: 14px; height: 14px;"></i>\\r\\n        </div>\\r\\n        <div class="operation-btn-icon last-image">\\r\\n            <i class="svg-icon left-arrow use-color" style="width: 22px; height: 22px;"></i>\\r\\n        </div>\\r\\n        <div class="operation-btn-icon next-image">\\r\\n            <i class="svg-icon right-arrow use-color" style="width: 22px; height: 22px;"></i>\\r\\n        </div>\\r\\n    </div>\\r\\n    <!-- 图片内容 -->\\r\\n    <div class="show-image-wrap"></div>\\r\\n    <!-- 小图预览栏 -->\\r\\n    <div class="preview-list"></div>\\r\\n</div>\\r\\n<style>\\r\\n    .reply-view-image {\\r\\n        position: fixed;\\r\\n        z-index: 999999;\\r\\n        top: 0;\\r\\n        right: 0;\\r\\n        bottom: 0;\\r\\n        left: 0;\\r\\n        width: 100%;\\r\\n        height: 100%;\\r\\n        background: rgba(24, 25, 28, 0.85);\\r\\n        transform: scale(1);\\r\\n        user-select: none;\\r\\n    }\\r\\n\\r\\n    .reply-view-image,\\r\\n    .reply-view-image * {\\r\\n        box-sizing: border-box;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .operation-btn .operation-btn-icon {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        position: absolute;\\r\\n        z-index: 2;\\r\\n        width: 42px;\\r\\n        height: 42px;\\r\\n        border-radius: 50%;\\r\\n        color: white;\\r\\n        background: rgba(0, 0, 0, 0.58);\\r\\n        transition: 0.2s;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .operation-btn .operation-btn-icon:hover {\\r\\n        color: #FF6699;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .operation-btn .operation-btn-icon.close-container {\\r\\n        top: 16px;\\r\\n        right: 16px;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .operation-btn .operation-btn-icon.last-image {\\r\\n        top: 50%;\\r\\n        left: 16px;\\r\\n        transform: translateY(-50%);\\r\\n    }\\r\\n\\r\\n    .reply-view-image .operation-btn .operation-btn-icon.next-image {\\r\\n        top: 50%;\\r\\n        right: 16px;\\r\\n        transform: translateY(-50%);\\r\\n    }\\r\\n\\r\\n    .reply-view-image .show-image-wrap {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        justify-content: center;\\r\\n        position: absolute;\\r\\n        width: 100%;\\r\\n        height: 100%;\\r\\n        max-height: 100%;\\r\\n        padding: 0 100px;\\r\\n        overflow: auto;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .show-image-wrap .loading-svga {\\r\\n        position: absolute;\\r\\n        top: 50%;\\r\\n        left: 50%;\\r\\n        transform: translate(-50%, -50%);\\r\\n        width: 42px;\\r\\n        height: 42px;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .show-image-wrap.vertical {\\r\\n        flex-direction: column;\\r\\n        justify-content: start;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .show-image-wrap .image-content {\\r\\n        max-width: 100%;\\r\\n        margin: auto;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .preview-list {\\r\\n        display: flex;\\r\\n        align-items: center;\\r\\n        position: absolute;\\r\\n        left: 50%;\\r\\n        bottom: 30px;\\r\\n        z-index: 2;\\r\\n        padding: 6px 10px;\\r\\n        border-radius: 8px;\\r\\n        background: rgba(24, 25, 28, 0.8);\\r\\n        backdrop-filter: blur(20px);\\r\\n        transform: translateX(-50%);\\r\\n    }\\r\\n\\r\\n    .reply-view-image .preview-list .preview-item-box {\\r\\n        padding: 1px;\\r\\n        border: 2px solid transparent;\\r\\n        border-radius: 8px;\\r\\n        transition: 0.3s;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .preview-list .preview-item-box.active {\\r\\n        border-color: #FF6699;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap {\\r\\n        display: flex;\\r\\n        justify-content: center;\\r\\n        overflow: hidden;\\r\\n        width: 100%;\\r\\n        height: 100%;\\r\\n        border-radius: 6px;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap.vertical {\\r\\n        flex-direction: column;\\r\\n    }\\r\\n\\r\\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap.extra-long {\\r\\n        justify-content: start;\\r\\n    }\\r\\n\\r\\n    .svg-icon {\\r\\n        display: inline-flex;\\r\\n        justify-content: center;\\r\\n        align-items: center;\\r\\n    }\\r\\n\\r\\n    .svg-icon svg {\\r\\n        width: 100%;\\r\\n        height: 100%;\\r\\n    }\\r\\n\\r\\n    .svg-icon.use-color svg path {\\r\\n        fill: currentColor;\\r\\n        color: inherit;\\r\\n    }\\r\\n</style>\\r\\n<style type="text/css">\\r\\n    ::-webkit-scrollbar {\\r\\n        width: 7px;\\r\\n        height: 7px;\\r\\n    }\\r\\n\\r\\n    ::-webkit-scrollbar-track {\\r\\n        border-radius: 4px;\\r\\n        background-color: #EEE;\\r\\n    }\\r\\n\\r\\n    ::-webkit-scrollbar-thumb {\\r\\n        border-radius: 4px;\\r\\n        background-color: #999;\\r\\n    }\\r\\n</style>';

  // src/core/ui/preview-image.ts
  var PreviewImage = class extends HTMLElement {
    _image;
    _list;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = preview_image_default;
      const close = root.querySelector(".svg-icon.close.use-color");
      const left = root.querySelector(".svg-icon.left-arrow.use-color");
      const right = root.querySelector(".svg-icon.right-arrow.use-color");
      close.innerHTML = svg.fork;
      left.innerHTML = svg.left;
      right.innerHTML = svg.right;
      this._image = root.querySelector(".show-image-wrap");
      this._list = root.querySelector(".preview-list");
      close.parentElement.addEventListener("click", (e) => {
        this.remove();
        document.body.style.overflow = "";
        e.stopPropagation();
      });
      left.parentElement.addEventListener("click", (e) => {
        this.togger(e, false);
        e.stopPropagation();
      });
      right.parentElement.addEventListener("click", (e) => {
        this.togger(e);
        e.stopPropagation();
      });
    }
    togger(e, right = true) {
      const list = this._list.querySelectorAll(".preview-item-box");
      if (list.length) {
        let i = 0;
        list.forEach((d, j) => {
          if (d.classList.contains("active")) {
            d.classList.remove("active");
            if (right) {
              i = j + 1;
              i < list.length || (i = 0);
            } else {
              i = j - 1;
              i < 0 && (i = list.length - 1);
            }
          }
        });
        list[i].classList.add("active");
        const img = list[i].querySelector("img");
        if (img) {
          this._image.innerHTML = \`<img class="image-content" src="\${img.src}">\`;
        }
      }
      e.stopPropagation();
    }
    /**
     * 初始化
     * @param imgs 图片链接（组）
     * @param vertical 是否垂直
     * @param active 显示第几张图片
     */
    value(imgs, vertical = false, active = 0) {
      imgs = isArray(imgs) ? imgs : [imgs];
      active < imgs.length || (active = 0);
      this._image.innerHTML = \`<img class="image-content" src="\${imgs[active]}">\`;
      vertical ? this.classList.add("vertical") : this.classList.remove("vertical");
      this._list.innerHTML = "";
      imgs.forEach((d, i) => {
        const item = addElement("div", {
          class: \`preview-item-box\${i === active ? " active" : ""}\`,
          style: "min-width: 54px; max-width: 54px; height: 54px;"
        }, this._list, \`<div class="preview-item-wrap\${vertical ? " vertical" : ""}"><img src="\${d}"></div>\`);
        item.addEventListener("click", (e) => {
          this._list.querySelector(".preview-item-box.active")?.classList.remove("active");
          item.classList.add("active");
          this._image.innerHTML = \`<img class="image-content" src="\${d}">\`;
          e.stopPropagation();
        });
      });
      document.body.contains(this) || document.body.appendChild(this);
      document.body.style.overflow = "hidden";
    }
  };
  customElements.get(\`preview-image-\${"caecec5"}\`) || customElements.define(\`preview-image-\${"caecec5"}\`, PreviewImage);

  // src/core/videolimit.ts
  init_tampermonkey();

  // src/io/api-biliplus-playurl.ts
  init_tampermonkey();
  async function apiBiliplusPlayurl(data) {
    const response = await fetch(objUrl("//www.biliplus.com/BPplayurl.php", data));
    return await response.json();
  }

  // src/io/api-global-ogv-playurl.ts
  init_tampermonkey();

  // src/io/sidx.ts
  init_tampermonkey();
  var Sidx = class {
    /**
     * @param url 目标url
     * @param size 最大索引范围（不宜过大），默认6万字节
     */
    constructor(url, size = 6e4) {
      this.url = url;
      this.size = size;
    }
    /** range索引结束点 */
    end = 5999;
    /** range索引开始点 */
    start = 0;
    /** 结果hex字符串 */
    hex_data = "";
    getData() {
      return new Promise((resolve, reject) => {
        this.fetch(resolve, reject);
      });
    }
    /** 请求片段 */
    fetch(resolve, reject) {
      fetch(this.url.replace("http:", "https:"), {
        headers: {
          range: \`bytes=\${this.start}-\${this.end}\`
        }
      }).then((d) => {
        if ((d.status >= 300 || d.status < 200) && d.status !== 304)
          throw new Error(\`\${d.status} \${d.statusText}\`, { cause: d.status });
        return d.arrayBuffer();
      }).then((d) => {
        const data = new Uint8Array(d);
        this.hex_data += Array.prototype.map.call(data, (x) => ("00" + x.toString(16)).slice(-2)).join("");
        if (this.hex_data.indexOf("73696478") > -1 && this.hex_data.indexOf("6d6f6f66") > -1) {
          const indexRangeStart = this.hex_data.indexOf("73696478") / 2 - 4;
          const indexRagneEnd = this.hex_data.indexOf("6d6f6f66") / 2 - 5;
          resolve(["0-" + String(indexRangeStart - 1), String(indexRangeStart) + "-" + String(indexRagneEnd)]);
        } else {
          this.start = this.end + 1;
          if (this.size && this.start > this.size) {
            reject("未能获取到sidx");
          } else {
            this.end += 6e3;
            this.size && (this.end = Math.min(this.end, this.size));
            this.fetch(resolve, reject);
          }
        }
      }).catch((e) => reject(e));
    }
  };

  // src/io/api-global-ogv-playurl.ts
  var ApiGlobalOgvPlayurl = class extends ApiSign {
    /**
     * @param data 查询参数
     * @param server 东南亚（泰区）代理服务器
     */
    constructor(data, server = "api.global.bilibili.com") {
      super(URLS.GLOBAL_OGV_PLAYURL.replace("api.global.bilibili.com", server), "7d089525d3611b1c");
      this.data = data;
      this.data = Object.assign({
        area: "th",
        build: 1001310,
        device: "android",
        force_host: 2,
        download: 1,
        mobi_app: "bstar_a",
        platform: "android"
      }, data);
    }
    response;
    async getDate() {
      if (this.response)
        return this.response;
      const response = await fetch(this.sign());
      const json = await response.json();
      return this.response = jsonCheck(json).data;
    }
    toPlayurl() {
      return new Promise((resolve, reject) => {
        this.getDate().then((d) => {
          const playurl = new PlayurlDash();
          const set = [];
          playurl.quality = d.video_info.stream_list[0].stream_info.quality || d.video_info.quality;
          playurl.format = PlayurlFormatMap[playurl.quality];
          playurl.timelength = d.video_info.timelength;
          playurl.dash.duration = Math.ceil(playurl.timelength / 1e3);
          playurl.dash.minBufferTime = playurl.dash.min_buffer_time = 1.5;
          Promise.all([
            ...d.video_info.stream_list.map((d2) => (async () => {
              if (d2.dash_video && d2.dash_video.base_url) {
                const id = d2.stream_info.quality;
                playurl.accept_description.push(PlayurlDescriptionMap[id]);
                set.push(PlayurlFormatMap[id]);
                playurl.accept_quality.push(id);
                playurl.support_formats.push({
                  description: PlayurlDescriptionMap[id],
                  display_desc: PlayurlQualityMap[id],
                  format: PlayurlFormatMap[id],
                  new_description: PlayurlDescriptionMap[id],
                  quality: id,
                  superscript: "",
                  codecs: [PlayurlCodecs[id]]
                });
                const sidx = await new Sidx(d2.dash_video.base_url, d2.dash_video.size).getData();
                playurl.dash.video.push({
                  SegmentBase: {
                    Initialization: sidx[0],
                    indexRange: sidx[1]
                  },
                  segment_base: {
                    initialization: sidx[0],
                    index_range: sidx[1]
                  },
                  backupUrl: [],
                  backup_url: [],
                  bandwidth: d2.dash_video.bandwidth,
                  baseUrl: d2.dash_video.base_url,
                  base_url: d2.dash_video.base_url,
                  codecid: d2.dash_video.codecid,
                  codecs: PlayurlCodecsAPP[id] || PlayurlCodecs[id],
                  frameRate: PlayurlFrameRate[id],
                  frame_rate: PlayurlFrameRate[id],
                  height: PlayurlResolution[id]?.[1],
                  id: d2.stream_info.quality,
                  mimeType: "video/mp4",
                  mime_type: "video/mp4",
                  sar: "1:1",
                  startWithSap: 1,
                  start_with_sap: 1,
                  width: PlayurlResolution[id]?.[0]
                });
              }
            })()),
            ...d.video_info.dash_audio.map((d2) => (async () => {
              const id = d2.id;
              const sidx = await new Sidx(d2.base_url, d2.size).getData();
              playurl.dash.audio.push({
                SegmentBase: {
                  Initialization: sidx[0],
                  indexRange: sidx[1]
                },
                segment_base: {
                  initialization: sidx[0],
                  index_range: sidx[1]
                },
                backupUrl: [],
                backup_url: [],
                bandwidth: d2.bandwidth,
                baseUrl: d2.base_url,
                base_url: d2.base_url,
                codecid: d2.codecid,
                codecs: PlayurlCodecsAPP[id] || PlayurlCodecs[id],
                frameRate: "",
                frame_rate: "",
                height: 0,
                id,
                mimeType: "audio/mp4",
                mime_type: "audio/mp4",
                sar: "",
                startWithSap: 0,
                start_with_sap: 0,
                width: 0
              });
            })())
          ]).then(() => {
            const avc = [], hev = [], video = [];
            playurl.dash.video.forEach((d2) => {
              if (d2.codecid == 7)
                avc.push(d2);
              else
                hev.push(d2);
            });
            let length2 = avc.length > hev.length ? avc.length : hev.length;
            for (let i = length2 - 1; i >= 0; i--) {
              if (avc[i])
                video.push(avc[i]);
              if (hev[i])
                video.push(hev[i]);
            }
            playurl.dash.video = video;
            playurl.accept_format = set.join(",");
            playurl.quality > 80 && (playurl.quality = 80);
            resolve(playurl);
          }).catch((e) => reject(e));
        }).catch((e) => reject(e));
      });
    }
  };

  // src/utils/conf/uid.ts
  init_tampermonkey();

  // src/utils/cookie.ts
  init_tampermonkey();
  function getCookies() {
    return document.cookie.split("; ").reduce((s, d) => {
      let key = d.split("=")[0];
      let val = d.split("=")[1];
      s[key] = unescape(val);
      return s;
    }, {});
  }
  function setCookie(name, value, days = 365) {
    const exp = /* @__PURE__ */ new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1e3);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toUTCString() + "; path=/; domain=.bilibili.com";
  }

  // src/utils/conf/uid.ts
  var uid = Number(getCookies().DedeUserID);

  // src/core/network-mock.ts
  init_tampermonkey();
  var networkMocked = false;
  function defineRes(target, res, v) {
    Object.defineProperties(target, {
      status: {
        configurable: true,
        writable: true,
        value: res.status
      },
      statusText: {
        configurable: true,
        writable: true,
        value: res.statusText
      },
      response: {
        configurable: true,
        writable: true,
        value: res.response
      },
      responseText: {
        configurable: true,
        writable: true,
        value: res.responseText
      },
      responseXML: {
        configurable: true,
        writable: true,
        value: res.responseXML
      },
      responseURL: {
        configurable: true,
        writable: true,
        value: res.finalUrl
      }
    });
    v();
  }
  function networkMock() {
    if (!networkMocked) {
      networkMocked = true;
      if (true) {
        xhrHook.ultra(".m4s", function(target, args) {
          const obj = {
            method: args[0],
            url: args[1],
            headers: {
              "user-agent": user.userStatus.userAgent
            },
            onloadstart: (res) => {
              defineRes(this, res, () => {
              });
            }
          };
          args[2] || (obj.anonymous = true);
          Object.defineProperties(this, {
            responseType: {
              configurable: true,
              set: (v) => {
                obj.responseType = v;
              },
              get: () => obj.responseType
            },
            onload: {
              configurable: true,
              set: (v) => {
                obj.onload = (res) => {
                  defineRes(this, res, v);
                };
              },
              get: () => obj.onload
            },
            onerror: {
              configurable: true,
              set: (v) => {
                obj.onerror = (res) => {
                  defineRes(this, res, v);
                };
              },
              get: () => obj.onerror
            },
            timeout: {
              configurable: true,
              set: (v) => {
                obj.timeout = v;
              },
              get: () => obj.timeout
            },
            ontimeout: {
              configurable: true,
              set: (v) => {
                obj.ontimeout = (res) => {
                  defineRes(this, res, v);
                };
              },
              get: () => obj.ontimeout
            },
            onprogress: {
              configurable: true,
              set: (v) => {
                obj.onprogress = (res) => {
                  defineRes(this, res, v.bind(this, new ProgressEvent("progress", {
                    lengthComputable: res.lengthComputable,
                    loaded: res.loaded,
                    total: res.total
                  })));
                };
              },
              get: () => obj.onprogress
            },
            onabort: {
              configurable: true,
              set: (v) => {
                obj.onabort = (res) => {
                  defineRes(this, res, v);
                };
              },
              get: () => obj.onabort
            },
            onreadystatechange: {
              configurable: true,
              set: (v) => {
                obj.onreadystatechange = (res) => {
                  defineRes(this, res, v);
                };
              },
              get: () => obj.onreadystatechange
            },
            setRequestHeader: {
              configurable: true,
              value: (name, value) => {
                obj.headers && (obj.headers[name] = value);
              }
            },
            send: {
              configurable: true,
              value: (body) => {
                obj.method === "POST" && body && (obj.data = body);
                const tar = GM.xmlHttpRequest(obj);
                this.abort = tar.abort.bind(tar);
                return true;
              }
            }
          });
        });
      } else {
        GM.updateSessionRules(mock);
      }
    }
  }

  // src/core/videolimit.ts
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
  var AREA = /* @__PURE__ */ ((AREA2) => {
    AREA2[AREA2["tw"] = 0] = "tw";
    AREA2[AREA2["hk"] = 1] = "hk";
    AREA2[AREA2["cn"] = 2] = "cn";
    return AREA2;
  })(AREA || {});
  var VideoLimit = class {
    /** 数据备份 */
    Backup = {};
    /** 通知组件 */
    toast;
    /** 通知信息 */
    data = [];
    /** 监听中 */
    listening = false;
    /** 播放数据备份 */
    __playinfo__;
    constructor() {
      xhrHook("/playurl?", (args) => {
        const param2 = urlObj(args[1]);
        if (!uid && user.userStatus.show1080p && user.userStatus.accessKey.token) {
          param2.appkey = "27eb53fc9058f8c3";
          param2.access_key = user.userStatus.accessKey.token;
        }
        param2.fnval && (param2.fnval = fnval);
        args[1] = objUrl(args[1], param2);
        return !(BLOD.limit || BLOD.th);
      }, (res) => {
        try {
          const result = res.responseType === "json" ? JSON.stringify(res) : res.responseText;
          if (user.userStatus.uposReplace.nor !== "不替换") {
            const nstr = this.uposReplace(result, user.userStatus.uposReplace.nor);
            toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", \`CDN：\${user.userStatus.uposReplace.nor}\`, \`UPOS：\${UPOS[user.userStatus.uposReplace.nor]}\`);
            if (res.responseType === "json") {
              res.response = JSON.parse(nstr);
            } else {
              res.response = res.responseText = nstr;
            }
          }
        } catch (e) {
        }
      }, false);
    }
    /** 开始监听 */
    enable() {
      if (this.listening)
        return;
      const disable = xhrHook.async("/playurl?", (args) => {
        const obj = urlObj(args[1]);
        this.updateVaribale(obj);
        return Boolean(BLOD.limit || BLOD.th);
      }, async (args) => {
        const response = BLOD.th ? await this._th(args) : await this._gat(args);
        return { response, responseType: "json", responseText: JSON.stringify(response) };
      }, false);
      this.disable = () => {
        disable();
        this.listening = false;
      };
      this.listening = true;
    }
    /** 处理泰区 */
    async _th(args) {
      this.data = ["泰区限制视频！"];
      this.toast = toast.toast(0, "info", ...this.data);
      const obj = urlObj(args[1]);
      this.data.push(\`aid：\${BLOD.aid}\`, \`cid：\${BLOD.cid}\`);
      this.toast.data = this.data;
      const epid = obj.ep_id || obj.episodeId || BLOD.epid;
      obj.access_key = user.userStatus.accessKey.token;
      if (!this.Backup[epid]) {
        try {
          networkMock();
          this.data.push(\`代理服务器：\${user.userStatus.videoLimit.th}\`);
          this.toast.data = this.data;
          this.Backup[epid] = { code: 0, message: "success", result: await this.th(obj) };
          this.data.push("获取代理数据成功！");
          this.toast.data = this.data;
          this.toast.type = "success";
        } catch (e) {
          this.data.push("代理出错！", e);
          !obj.access_key && this.data.push("代理服务器要求【账户授权】才能进一步操作！");
          this.toast.data = this.data;
          this.toast.type = "error";
          debug.error(...this.data);
          this.toast.delay = 4;
          delete this.toast;
          this.data = [];
          return { code: -404, message: e, data: null };
        }
      }
      this.toast.delay = 4;
      delete this.toast;
      this.data = [];
      return this.__playinfo__ = this.Backup[epid];
    }
    /** 处理港澳台 */
    async _gat(args) {
      this.data = ["港澳台限制视频！"];
      this.toast = toast.toast(0, "info", ...this.data);
      const obj = urlObj(args[1]);
      this.data.push(\`aid：\${BLOD.aid}\`, \`cid：\${BLOD.cid}\`);
      this.toast.data = this.data;
      const epid = obj.ep_id || obj.episodeId || BLOD.epid;
      obj.access_key = user.userStatus.accessKey.token;
      if (!this.Backup[epid]) {
        try {
          if (user.userStatus.videoLimit.server === "内置") {
            obj.module = "bangumi";
            const upInfo = window.__INITIAL_STATE__?.upInfo;
            if (upInfo) {
              (upInfo.mid == 1988098633 || upInfo.mid == 2042149112) && (obj.module = "movie");
            }
            this.data.push(\`代理服务器：内置\`, \`类型：\${obj.module}\`);
            this.toast.data = this.data;
            const res = await apiBiliplusPlayurl(obj);
            this.Backup[epid] = { code: 0, message: "success", result: res };
          } else {
            const res = await this.gat(obj);
            this.Backup[epid] = { code: 0, message: "success", result: res };
          }
          if (user.userStatus.uposReplace.gat !== "不替换") {
            this.Backup[epid] = JSON.parse(this.uposReplace(JSON.stringify(this.Backup[epid]), user.userStatus.uposReplace.gat));
            toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", \`CDN：\${user.userStatus.uposReplace.gat}\`, \`UPOS：\${UPOS[user.userStatus.uposReplace.gat]}\`);
          }
          ;
          this.data.push("获取代理数据成功！");
          this.toast.data = this.data;
          this.toast.type = "success";
        } catch (e) {
          this.data.push("代理出错！", e);
          !obj.access_key && this.data.push("代理服务器要求【账户授权】才能进一步操作！");
          this.toast.data = this.data;
          this.toast.type = "error";
          debug.error(...this.data);
          this.toast.delay = 4;
          delete this.toast;
          this.data = [];
          return { code: -404, message: e, data: null };
        }
      }
      this.toast.delay = 4;
      delete this.toast;
      this.data = [];
      return this.__playinfo__ = this.Backup[epid];
    }
    /** 停止监听 */
    disable() {
      this.listening = false;
    }
    /** 更新全局变量 */
    updateVaribale(obj) {
      obj.seasonId && (BLOD.ssid = obj.seasonId);
      obj.episodeId && (BLOD.epid = obj.episodeId);
      obj.ep_id && (BLOD.epid = obj.ep_id);
      obj.aid && (BLOD.aid = Number(obj.aid)) && (BLOD.aid = obj.aid);
      obj.avid && (BLOD.aid = Number(obj.avid)) && (BLOD.aid = obj.avid);
      obj.cid && (BLOD.cid = Number(obj.cid)) && (BLOD.cid = obj.cid);
    }
    /** 访问泰区代理 */
    async th(obj) {
      const d = await new ApiGlobalOgvPlayurl(obj, user.userStatus.uposReplace.th).toPlayurl();
      toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", \`CDN：\${user.userStatus.uposReplace.th}\`, \`UPOS：\${UPOS[user.userStatus.uposReplace.th]}\`);
      return JSON.parse(this.uposReplace(JSON.stringify(d), user.userStatus.uposReplace.th));
    }
    /** 代理服务器序号 */
    area = 0;
    /** 访问港澳台代理 */
    async gat(obj) {
      if (!user.userStatus.videoLimit[AREA[this.area]])
        throw new Error(\`无有效代理服务器：\${AREA[this.area]}\`);
      const server = user.userStatus.videoLimit[AREA[this.area]];
      obj.area = AREA[this.area];
      this.data.push(\`代理服务器：\${server}\`);
      this.toast && (this.toast.data = this.data);
      try {
        return await apiPlayurl(obj, true, true, server);
      } catch (e) {
        this.data.push("代理服务器返回异常！", e);
        if (this.toast) {
          this.toast.data = this.data;
          this.toast.type = "warning";
        }
        this.area++;
        if (this.area > 2)
          throw new Error("代理服务器不可用！");
        return await this.gat(obj);
      }
    }
    /** 用于过滤upos提示 */
    upos = false;
    /** 用于取消过滤upos提示 */
    timer;
    /**
     * 替换upos服务器
     * @param str playurl或包含视频URL的字符串
     * @param uposName 替换的代理服务器名 keyof typeof {@link UPOS}
     */
    uposReplace(str, uposName) {
      if (uposName === "不替换")
        return str;
      this.upos = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.upos = false, 1e3);
      return str.replace(/:\\\\?\\/\\\\?\\/[^\\/]+\\\\?\\//g, () => \`://\${UPOS[uposName]}/\`);
    }
  };
  var videoLimit = new VideoLimit();

  // src/core/download.ts
  var Download = class {
    /** 下载界面 */
    ui = new BilioldDownload();
    /** 数据缓存 */
    data = this.ui.init();
    previewImage;
    /** 下载按钮 */
    bgrayButtonBtn;
    get fileName() {
      if (videoInfo.metadata) {
        return \`\${videoInfo.metadata.album}(\${videoInfo.metadata.title})\`;
      }
      return "";
    }
    constructor() {
      switchVideo(() => {
        this.destory();
        user.userStatus.downloadButton && this.bgrayButton();
      });
    }
    /** 解码playinfo */
    decodePlayinfo(playinfo, fileName = this.fileName) {
      const data = new PlayinfoFilter(fileName).filter(playinfo);
      data.forEach((d) => {
        this.data[d.type] || (this.data[d.type] = []);
        this.data[d.type].push({
          url: d.url,
          fileName,
          quality: Reflect.has(d, "flv") ? \`\${d.quality}*\${d.flv}\` : d.quality,
          size: d.size,
          color: d.color,
          onClick: (ev) => this.pushDownload(d, ev)
        });
      });
    }
    /** 分发数据 */
    pushDownload(data, ev) {
      if (data.onClick) {
        data.onClick(ev);
      } else if (data.url) {
        switch (user.userStatus.downloadMethod) {
          case "IDM":
            ev.preventDefault();
            new Ef2(user.userStatus.userAgent, user.userStatus.referer, user.userStatus.filepath, user.userStatus.ef2.delay, user.userStatus.ef2.silence).file({
              url: data.url[0],
              out: data.fileName
            });
            toast.success('保存IDM导出文件后，打开IDM -> 任务 -> 导入 -> 从"IDM导出文件"导入即可下载');
            break;
          case "ef2":
            ev.preventDefault();
            new Ef2(user.userStatus.userAgent, user.userStatus.referer, user.userStatus.filepath, user.userStatus.ef2.delay, user.userStatus.ef2.silence).sendLinkToIDM({
              url: data.url[0],
              out: data.fileName
            });
            toast.warning("允许浏览器打开【IDM EF2辅助工具】即可开始下载", "如果浏览器和IDM都没有任何反应，那些请先安装ef2辅助工具。");
            break;
          case "aria2":
            ev.preventDefault();
            const cmdLine = new Aria2(user.userStatus.userAgent, user.userStatus.referer, user.userStatus.filepath, user.userStatus.aria2.server, user.userStatus.aria2.port, user.userStatus.aria2.token, user.userStatus.aria2.split, user.userStatus.aria2.size).cmdlet({
              urls: data.url,
              out: data.fileName
            });
            toast.success(
              "已复制下载命令到剪切板，粘贴到终端里回车即可开始下载。当然前提是您的设备已配置好了aria2。",
              "--------------",
              cmdLine
            );
            break;
          case "aria2rpc":
            ev.preventDefault();
            new Aria2(user.userStatus.userAgent, user.userStatus.referer, user.userStatus.filepath, user.userStatus.aria2.server, user.userStatus.aria2.port, user.userStatus.aria2.token, user.userStatus.aria2.split, user.userStatus.aria2.size).rpc({
              urls: data.url,
              out: data.fileName
            }).then((d) => {
              toast.success("aria2已经开始下载", \`GUID: \${d}\`);
            }).catch((e) => {
              toast.error("aria2[RPC]错误！", e);
            });
            break;
          default:
            toast.warning("当前下载方式设定为浏览器（默认），受限于浏览器安全策略，可能并未触发下载而是打开了一个标签页，所以更良好的习惯是右键要下载的链接【另存为】。另外如果下载失败（403无权访问），请尝试在设置里修改下载方式及其他下载相关选项。");
            break;
        }
      }
    }
    /** 请求中 */
    downloading = false;
    /** 已请求 */
    gets = [];
    /** 下载当前视频 */
    default() {
      if (this.downloading)
        return;
      if (!BLOD.cid)
        return toast.warning("未找到视频文件");
      this.downloading = true;
      this.ui.show();
      user.userStatus.TVresource || this.gets.includes("_") || (this.decodePlayinfo(videoLimit.__playinfo__), this.gets.push("_"));
      const tasks = [];
      user.userStatus.downloadType.includes("mp4") && (this.data.mp4 || this.gets.includes("mp4") || tasks.push(this.mp4(BLOD.cid).then((d) => {
        this.gets.push("mp4");
        this.decodePlayinfo(d);
      })));
      user.userStatus.downloadType.includes("flv") && (this.data.flv || this.gets.includes("flv") || tasks.push(
        (user.userStatus.TVresource ? this.tv(BLOD.aid, BLOD.cid, false, user.userStatus.downloadQn) : this.interface(BLOD.cid, user.userStatus.downloadQn)).then((d) => {
          this.gets.push("flv");
          this.decodePlayinfo(d);
        })
      ));
      user.userStatus.downloadType.includes("dash") && (this.data.aac || this.gets.includes("dash") || this.data.hev || this.data.av1 || tasks.push(
        (user.userStatus.TVresource ? this.tv(BLOD.aid, BLOD.cid) : this.dash(BLOD.aid, BLOD.cid)).then((d) => {
          this.gets.push("dash");
          this.decodePlayinfo(d);
        })
      ));
      Promise.allSettled(tasks).finally(() => {
        this.downloading = false;
      });
    }
    /** 清空数据 */
    destory() {
      this.ui.remove();
      this.data = this.ui.init();
      this.downloading = false;
      this.gets = [];
      videoLimit.__playinfo__ = void 0;
    }
    mp4(cid) {
      return new ApiPlayurlProj({ cid, access_key: user.userStatus.accessKey.token }, BLOD.pgc).getData();
    }
    // private flv(avid: number, cid: number) {
    //     return <Promise<IPlayurlDurl>>apiPlayurl({ avid, cid }, false, this.BLOD.pgc);
    // }
    dash(avid, cid) {
      return apiPlayurl({ avid, cid }, true, BLOD.pgc);
    }
    tv(avid, cid, dash = true, quality = qn) {
      return new ApiPlayurlTv({ avid, cid, access_key: user.userStatus.accessKey.token, qn: quality }, dash, BLOD.pgc).getData();
    }
    intl(aid, cid, dash = true) {
      return new ApiPlayurlIntl({ aid, cid, access_key: user.userStatus.accessKey.token }, dash, BLOD.pgc).getData();
    }
    interface(cid, quality = qn) {
      return new ApiPlayurlInterface({ cid, quality }, BLOD.pgc).getData();
    }
    image() {
      const src = [];
      videoInfo.metadata?.artwork?.forEach((d) => src.push(d.src));
      if (location.host === "live.bilibili.com" && window.__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover) {
        src.push(window.__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover);
      }
      if (/\\/read\\/[Cc][Vv]/.test(location.href)) {
        document.querySelectorAll(".article-holder img").forEach((d) => {
          d.src && src.push(d.src);
        });
      }
      if (src.length) {
        this.previewImage || (this.previewImage = new PreviewImage());
        this.previewImage.value(src);
      } else {
        toast.warning("未找到封面信息！");
      }
    }
    /** 添加播放器下载按钮 */
    bgrayButton() {
      if (!this.bgrayButtonBtn) {
        this.bgrayButtonBtn = document.createElement("div");
        this.bgrayButtonBtn.classList.add("bgray-btn", "show");
        this.bgrayButtonBtn.title = "下载当前视频";
        this.bgrayButtonBtn.innerHTML = "下载<br>视频";
        this.bgrayButtonBtn.addEventListener("click", (e) => {
          BLOD.ui?.show("download");
          e.stopPropagation();
        });
      }
      document.querySelector(".bgray-btn-wrap")?.appendChild(this.bgrayButtonBtn);
    }
  };
  var download = new Download();

  // src/core/bilibili-old.ts
  var BLOD = new class {
    /** 路径拆分 */
    path = location.href.split("/");
    /** bangumi标记 */
    pgc = false;
    ui;
    get aid() {
      return window.aid;
    }
    set aid(v) {
      window.aid = v;
    }
    get cid() {
      return window.cid;
    }
    set cid(v) {
      window.cid = v;
    }
    /** bangumi ssid */
    ssid;
    /** bangumi epid */
    epid;
    /** 限制视频 */
    limit;
    /** 东南亚视频标记 */
    th;
    /** 播放器已加载 */
    playLoaded = false;
    /** 已模拟APP端取流 */
    networkMocked = false;
    /** 是否大会员 */
    isVip = false;
    /** 播放器哈希值 */
    version;
    // 调试接口
    GM = GM;
    urlSign = urlSign;
    objUrl = objUrl;
    urlObj = urlObj;
    download = download;
    danmaku = danmaku;
    toast = toast;
    debug = debug;
    videoInfo = videoInfo;
    base64 = base64;
    md5 = import_md52.default;
  }();

  // src/core/storage.ts
  init_tampermonkey();
  var LocalStorage = class {
    /** 清空！ */
    static clear() {
      localStorage.clear();
    }
    /**
     * 读取
     * @param key 目标键名
     * @returns 格式化后的数据
     */
    static getItem(key) {
      return toObject(localStorage.getItem(key));
    }
    /**
     * 列出键名数组  
     * 原生Storage.key只返回但索引，感觉意义不大。
     * @returns 键名数组
     */
    static keys() {
      return Object.keys(localStorage);
    }
    /**
     * 移除
     * @param key 目标键名
     */
    static removeItem(key) {
      localStorage.removeItem(key);
    }
    /**
     * 添加/修改
     * @param key 
     * @param value 
     */
    static setItem(key, value) {
      localStorage.setItem(key, toString(value));
    }
  };
  var SessionStorage = class {
    /** 清空！ */
    static clear() {
      sessionStorage.clear();
    }
    /**
     * 读取
     * @param key 目标键名
     * @returns 格式化后的数据
     */
    static getItem(key) {
      return toObject(sessionStorage.getItem(key));
    }
    /**
     * 列出键名数组  
     * 原生Storage.key只返回但索引，感觉意义不大。
     * @returns 键名数组
     */
    static keys() {
      return Object.keys(sessionStorage);
    }
    /**
     * 移除
     * @param key 目标键名
     */
    static removeItem(key) {
      sessionStorage.removeItem(key);
    }
    /**
     * 添加/修改
     * @param key 
     * @param value 
     */
    static setItem(key, value) {
      sessionStorage.setItem(key, toString(value));
    }
  };

  // src/page/header.ts
  init_tampermonkey();

  // src/io/api-page-header.ts
  init_tampermonkey();
  async function apiPageHeader(data) {
    const response = await fetch(objUrl(URLS.PAGE_HEADER, data));
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/utils/format/subarray.ts
  init_tampermonkey();
  function subArray(res, num = 1) {
    const arr2 = [...res];
    const out = [];
    num = num || 1;
    num = num < arr2.length ? num : arr2.length;
    while (out.length < num) {
      var temp = Math.random() * arr2.length >> 0;
      out.push(arr2.splice(temp, 1)[0]);
    }
    return num === 1 ? out[0] : out;
  }

  // src/utils/hook/node.ts
  init_tampermonkey();
  var appendChild = Element.prototype.appendChild;
  var insertBefore = Element.prototype.insertBefore;
  var jsonp = [];
  Element.prototype.appendChild = function(newChild) {
    this.parentElement === document.documentElement && newChild.nodeName == "SCRIPT" && newChild.src && jsonp.forEach((d) => {
      d[0].every((d2) => newChild.src.includes(d2)) && d[1].call(newChild);
    });
    return appendChild.call(this, newChild);
  };
  Element.prototype.insertBefore = function(newChild, refChild) {
    this.parentElement === document.documentElement && newChild.nodeName == "SCRIPT" && newChild.src && jsonp.forEach((d) => {
      d[0].every((d2) => newChild.src.includes(d2)) && d[1].call(newChild);
    });
    return insertBefore.call(this, newChild, refChild);
  };
  function jsonpHook(url, redirect, modifyResponse, once = true) {
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
    const iid = jsonp.push([one, two]);
    return () => {
      removeJsonphook(iid);
    };
  }
  jsonpHook.async = (url, condition, modifyResponse, once = true) => {
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
    const iid = jsonp.push([one, two]);
    return () => {
      removeJsonphook(iid);
    };
  };
  jsonpHook.scriptBlock = (url) => {
    const one = Array.isArray(url) ? url : [url];
    const two = function() {
      try {
        this.removeAttribute("src");
        setTimeout(() => {
          this.dispatchEvent(new ProgressEvent("load"));
          try {
            this.remove();
          } catch (e) {
          }
        }, 100);
      } catch (e) {
        debug.error("脚本拦截失败！", one, e);
      }
    };
    jsonp.push([one, two]);
  };
  jsonpHook.scriptIntercept = (url, redirect, text) => {
    const one = Array.isArray(url) ? url : [url];
    const two = function() {
      try {
        if (text) {
          this.text = text(this.src);
          this.removeAttribute("src");
          setTimeout(() => {
            this.dispatchEvent(new ProgressEvent("load"));
            this?.remove();
          }, 100);
        } else if (redirect) {
          this.src = redirect(this.src);
        }
      } catch (e) {
        debug.error("scriptIntercept", one, e);
      }
    };
    const iid = jsonp.push([one, two]);
    return () => {
      removeJsonphook(iid);
    };
  };
  function removeJsonphook(id) {
    id >= 0 && delete jsonp[id - 1];
  }

  // src/css/avatar-animation.css
  var avatar_animation_default = "/* 鼠标放在顶栏上的动效 */\\r\\n.bili-header-m .profile-info .i-face .face {\\r\\n    border: 0\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info .i-face .pendant {\\r\\n    transform: scale(0.5);\\r\\n    width: 112px;\\r\\n    height: 112px;\\r\\n    left: -41px;\\r\\n    bottom: -46px;\\r\\n    opacity: 0;\\r\\n    transition: opacity .1s ease-in\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face {\\r\\n    left: 8px !important;\\r\\n    top: 0 !important;\\r\\n    height: 32px !important;\\r\\n    width: 32px !important;\\r\\n    transform: translateY(10px) translateX(-16px) scale(2);\\r\\n    transform-origin: top left\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face .legalize {\\r\\n    transform: scale(0.5) translate(10px, 15px)\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face .pendant {\\r\\n    opacity: 1\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face .face {\\r\\n    border: 0;\\r\\n    box-shadow: 0 0 0 2px #fff\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face.scale-in {\\r\\n    transform: translateY(5px) translateX(-10px) scale(1.75)\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .scale-in .face {\\r\\n    height: 32px;\\r\\n    width: 32px\\r\\n}\\r\\n\\r\\n.bili-header-m .profile-info.on .i-face.scale-in .legalize {\\r\\n    transform: scale(0.5) translate(38px, 48px)\\r\\n}";

  // src/css/message.css
  var message_default = "/* 修复消息页样式 */\\r\\n.container[data-v-6969394c] {\\r\\n    height: calc(100vh - 42px) !important;\\r\\n}\\r\\n\\r\\n.container[data-v-1c9150a9] {\\r\\n    height: calc(100vh - 42px) !important;\\r\\n}\\r\\n\\r\\n.im-root,\\r\\n.im-root .im-list-box * {\\r\\n    font-size: 12px;\\r\\n    line-height: 42px;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box {\\r\\n    width: 100%;\\r\\n    overflow: visible;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-list {\\r\\n    line-height: 42px;\\r\\n    height: 42px;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-notify.im-number {\\r\\n    height: 14px;\\r\\n    line-height: 13px;\\r\\n    border-radius: 10px;\\r\\n    padding: 1px 3px;\\r\\n    font-size: 12px;\\r\\n    min-width: 20px;\\r\\n    text-align: center;\\r\\n    color: #fff;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-notify.im-number.im-center {\\r\\n    top: 14px;\\r\\n    left: 80px;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-notify.im-dot {\\r\\n    top: 11px;\\r\\n    right: -10px;\\r\\n    width: 8px;\\r\\n    height: 8px;\\r\\n    border-radius: 100%;\\r\\n}\\r\\n\\r\\n.im-root .im-list-box .im-notify.im-dot.im-center {\\r\\n    top: 16px;\\r\\n    right: 20px;\\r\\n}";

  // src/page/header.ts
  var _Header = class {
    /**
     * 根据页面返回resourceId
     * @returns resourceId
     */
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
    /** 顶栏分区 */
    static primaryMenu() {
      poll(() => document.querySelector("#primary_menu"), (d) => {
        const vue = d.__vue__;
        vue.menuList.forEach((d2, i, s) => {
          switch (d2.name) {
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
      this.plaza();
      this.indexIcon();
      this.styleFix();
    }
    static banner() {
      jsonpHook.async("api.bilibili.com/x/web-show/res/loc", void 0, async (url) => {
        const obj = new URL(url);
        obj.searchParams.delete("callback");
        let loc = this.record[url];
        let header = this.record[this.rid];
        let rqs;
        if (!loc || !header) {
          rqs = await Promise.all([
            fetch(obj.toJSON()).then((d) => d.json()),
            apiPageHeader({ resource_id: this.rid })
          ]);
          loc = this.record[url] = rqs[0];
          header = this.record[this.rid] = rqs[1];
        }
        loc.data && this.locs.forEach((d) => {
          loc.data[d] && (loc.data[d][0].pic = header && header.pic || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png", loc.data[d][0].litpic = header && header.litpic, loc.data[d][0].url = header && header.url || "", loc.data[d][0].title = header && header.name || "");
          if (url.includes("loc?") && obj.searchParams.get("id") == String(d)) {
            loc.data[0].pic = header && header.pic || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png";
            loc.data[0].litpic = header && header.litpic || "";
            loc.data[0].url = header && header.url || "";
            loc.data[0].title = header && header.name || "";
          }
        });
        return loc;
      }, false);
    }
    /** 顶栏广场 */
    static plaza() {
      jsonpHook.async("api.bilibili.com/plaza/banner", () => true, async () => {
        return { "code": 0, "result": [{ "link": "https://www.bilibili.com/blackboard/x/act_list", "end": 1640966407, "begin": 1456709887, "title": "bilibili 活动", "cover": "http://i0.hdslb.com/bfs/square/6830d0e479eee8cc9a42c3e375ca99a5147390cd.jpg", "id": 9, "created_ts": 1491386053 }, { "link": "http://www.bilibili.com/blackboard/topic_list.html", "end": 1640966418, "begin": 1544258598, "title": "话题列表", "cover": "http://i0.hdslb.com/bfs/square/b1b00a0c3ce8570b48277ae07a2e55603a4a4ddf.jpg", "id": 17, "created_ts": 1491386030 }] };
      }, false);
    }
    /** 顶栏动图 */
    static indexIcon() {
      jsonpHook.async("api.bilibili.com/x/web-interface/index/icon", void 0, async () => {
        const data = await fetch("https://www.bilibili.com/index/index-icon.json").then((d) => d.json());
        return {
          code: 0,
          data: subArray(data.fix),
          message: "0",
          ttl: 1
        };
      }, false);
    }
    /** 消息页面样式 */
    static message() {
      addCss(message_default, "message");
    }
    /** 顶栏动态记录参数失效，另行找补 */
    static videoOffset() {
      if (uid) {
        const offset2 = getCookies()[\`bp_video_offset_\${uid}\`];
        if (offset2) {
          setCookie(\`bp_t_offset_\${uid}\`, offset2);
        }
      }
    }
    /** 迷你顶栏 */
    miniHeader() {
      this.oldHeader.classList.remove("has-menu");
    }
    /** 是否mini顶栏 */
    static isMiniHead(d) {
      return location.href.includes("blackboard/topic_list") || location.href.includes("blackboard/x/act_list") || document.querySelector(".large-header") || document.querySelector(".bili-banner") || d?.getAttribute("type") == "all" ? false : true;
    }
    constructor() {
      this.oldHeader.className = "z-top-container has-menu";
      this.hookHeadV2();
      this.feedCount();
      poll(() => document.readyState === "complete", () => this.styleClear());
    }
    /** 监听新版顶栏 */
    hookHeadV2() {
      poll(() => {
        return document.querySelector("#internationalHeader") || document.querySelector("#biliMainHeader") || document.querySelector("#bili-header-container") || document.querySelector("#home_nav") || document.querySelector(".bili-header__bar");
      }, (d) => {
        _Header.isMiniHead(d) && this.miniHeader();
        this.loadOldHeader(d);
      });
      poll(() => document.querySelector(".z_top_container"), (d) => {
        this.loadOldHeader(d);
        document.querySelector(".header").style.display = "none";
      });
    }
    /** 已加载旧版顶栏 */
    oldHeadLoaded = false;
    /** 旧版顶栏节点 */
    oldHeader = document.createElement("div");
    /** 加载旧版顶栏 */
    loadOldHeader(target) {
      if (target) {
        if (target.className === "bili-header__bar") {
          addCss('.bili-header.large-header,.header-channel,.z-top-container.has-menu[type="all"] {display: none;}');
        }
        document.body.classList.remove("header-v3");
        target.style.display = "none";
        target.hidden = true;
      }
      if (this.oldHeadLoaded)
        return;
      this.oldHeadLoaded = true;
      addCss("#internationalHeader,#biliMainHeader,#bili-header-container{display: none;}");
      document.body.insertBefore(this.oldHeader, document.body.firstChild);
      (window.jQuery ? Promise.resolve() : loadScript("//static.hdslb.com/js/jquery.min.js")).then(() => loadScript("//s1.hdslb.com/bfs/seed/jinkela/header/header.js")).then(() => {
        _Header.styleFix();
      });
      _Header.primaryMenu();
      _Header.banner();
    }
    loadOldFooter(target) {
      addElement("div", { class: "footer bili-footer report-wrap-module" }, void 0, void 0, void 0, target);
      (window.jQuery ? Promise.resolve() : loadScript("//static.hdslb.com/js/jquery.min.js")).then(() => loadScript("//static.hdslb.com/common/js/footer.js")).then(() => {
        target && (target.style.display = "none");
        this.styleClear();
        addCss(".bili-footer {position: relative;}");
        document.getElementsByClassName("bili-header-m")[1]?.remove();
      });
    }
    /** 顶栏样式修复 */
    static styleFix() {
      addCss(".nav-item.live {width: auto;}.lt-row {display: none !important;} .bili-header-m #banner_link{background-size: cover;background-position: center !important;}", "lt-row-fix");
      addCss(avatar_animation_default, "avatarAnimation");
      this.fullBannerCover && addCss(".bili-header-m #banner_link{height: 9.375vw !important;min-width: 1000px;min-height: 155px;max-height: 240px;}");
    }
    /** 禁用新版顶栏相关样式 */
    async styleClear() {
      const d = document.styleSheets;
      for (let i = 0; i < d.length; i++) {
        d[i].href?.includes("laputa-header") && (d[i].disabled = true);
      }
      _Header.styleFix();
    }
    /** 顶栏动态直播回复数目接口失效，强制标记为0 */
    feedCount() {
      xhrHook.async("api.live.bilibili.com/ajax/feed/count", void 0, async () => {
        const response = '{ "code": 0, "data": { "count": 0 }, "message": "0" }';
        return { response, responseText: response };
      }, false);
    }
  };
  var Header = _Header;
  /** locs列表 */
  __publicField(Header, "locs", [1576, 1612, 1580, 1920, 1584, 1588, 1592, 3129, 1600, 1608, 1604, 1596, 2210, 1634, 142]);
  /** 缓存已请求内容 */
  __publicField(Header, "record", {});
  /** 资源id */
  __publicField(Header, "rid", _Header.resourceId());
  __publicField(Header, "fullBannerCover", false);

  // src/page/space.ts
  init_tampermonkey();

  // src/io/account-getcardbymid.ts
  init_tampermonkey();
  async function accountGetCardByMid(mid) {
    const response = await GM.fetch(objUrl(URLS.ACCOUNT_GETCARDBYMID, { mid }));
    const json = await response.json();
    return jsonCheck(json).card;
  }

  // src/json/mid.json
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

  // src/utils/vdomtool.ts
  init_tampermonkey();

  // src/utils/htmlvnode.ts
  init_tampermonkey();
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
    /** HTML */
    html;
    /** 当前光标 */
    pos = 0;
    /** Vnode */
    vnode = [];
    /** 节点名栈 */
    tagNames = [];
    /** Vnode栈 */
    targets = [];
    /** innerText栈 */
    text = "";
    /** 引号栈 */
    quote = "";
    /**
     * 扫描html文本转化为Vnode
     * @param html html文本
     */
    constructor(html) {
      this.html = html;
      this.targets.push({ children: this.vnode });
      while (this.html) {
        this.organizeTag();
      }
      this.textContent();
    }
    /** 提取节点名 */
    organizeTag() {
      if (!this.quote && this.html[0] === "<") {
        if (this.html.startsWith(\`</\${this.tagNames.reduce((s, d) => s = d, void 0)}\`)) {
          this.textContent();
          this.html = this.html.replace(new RegExp(\`^</\${this.tagNames.reduce((s, d) => s = d, void 0)}>\`), "");
          this.popNode();
        } else {
          this.removeScanned();
          if (this.html.startsWith("!--")) {
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
    /** 提取属性 */
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
    /** 出栈检查 空元素直接出栈*/
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
    /** 节点出栈 */
    popNode() {
      this.tagNames.splice(this.tagNames.length - 1, 1);
      this.targets.splice(this.targets.length - 1, 1);
      this.text = "";
    }
    /** 移除已扫描字符长度 默认1位 */
    removeScanned(length2 = 1) {
      this.html = this.html.slice(length2);
    }
    /** 处理TextContent */
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

  // src/utils/vdomtool.ts
  var VdomTool = class {
    vdom;
    script = [];
    constructor(html) {
      if (typeof html === "string") {
        this.vdom = htmlVnode(html);
      } else {
        this.vdom = html;
      }
    }
    /** 生成 DocumentFragment（会过滤script标签，请稍后使用\`loadScript\`方法依次运行所有script） */
    toFragment() {
      const fragment = document.createDocumentFragment();
      this.vdom.forEach((d) => {
        if (d.tagName === "script") {
          this.script.push(d);
        } else
          fragment.appendChild(this.createElement(d));
      });
      return fragment;
    }
    /** 根据vdom生成真DOM（过滤script标签） */
    createElement(element) {
      if (element.tagName === "text") {
        return document.createTextNode(element.text);
      }
      if (element.tagName === "svg") {
        return this.createSVG(element);
      }
      const node = document.createElement(element.tagName);
      element.props && Object.entries(element.props).forEach((d) => {
        node.setAttribute(d[0], d[1]);
      });
      element.text && node.appendChild(document.createTextNode(element.text));
      element.event && Object.entries(element.event).forEach((d) => {
        node.addEventListener(...d);
      });
      element.children && element.children.forEach((d) => {
        if (d.tagName === "script") {
          this.script.push(d);
        } else
          node.appendChild(this.createElement(d));
      });
      return node;
    }
    /** svg限定生成方法 */
    createSVG(element) {
      const node = document.createElementNS("http://www.w3.org/2000/svg", element.tagName);
      element.props && Object.entries(element.props).forEach((d) => {
        node.setAttribute(d[0], d[1]);
      });
      element.children && element.children.forEach((d) => {
        node.appendChild(this.createSVG(d));
      });
      return node;
    }
    static loopScript(scripts) {
      return new Promise((r, j) => {
        const prev = scripts.shift();
        if (prev) {
          if (prev.src) {
            prev.addEventListener("load", () => r(this.loopScript(scripts)));
            prev.addEventListener("abort", () => r(this.loopScript(scripts)));
            prev.addEventListener("error", () => r(this.loopScript(scripts)));
            return document.body.appendChild(prev);
          }
          document.body.appendChild(prev);
          r(this.loopScript(scripts));
        } else
          r();
      });
    }
    loadScript() {
      const scripts = this.script.map((d) => this.createElement(d));
      return VdomTool.loopScript(scripts);
    }
    /** 添加为目标节点的子节点 */
    appendTo(node) {
      node.append(this.toFragment());
    }
    /** 替换目标节点 */
    replace(node) {
      node.replaceWith(this.toFragment());
    }
    addEventListener(target, type, listener) {
      try {
        const arr2 = target.split("");
        let dom = this.vdom;
        let ele;
        while (dom && arr2.length) {
          const i = Number(arr2.shift());
          if (i) {
            ele = dom[i];
            dom = ele.children;
          }
        }
        ele.event || (ele.event = {});
        ele.event[type] = listener;
      } catch (e) {
        debug.error(e);
      }
    }
    removeEventListener(target, type) {
      try {
        const arr2 = target.split("");
        let dom = this.vdom;
        let ele;
        while (dom && arr2.length) {
          const i = Number(arr2.shift());
          if (i) {
            ele = dom[i];
            dom = ele.children;
          }
        }
        delete ele.event?.[type];
      } catch (e) {
        debug.error(e);
      }
    }
  };

  // src/page/space.ts
  var Mid = {
    11783021: "哔哩哔哩番剧出差",
    1988098633: "b站_戲劇咖",
    2042149112: "b站_綜藝咖"
  };
  var PageSpace = class {
    mid;
    /** 失效视频aid */
    aids = [];
    aidInfo = [];
    constructor() {
      this.mid = Number(BLOD.path[3] && BLOD.path[3].split("?")[0]);
      this.midInfo();
      user.addCallback((status) => {
        status.album && this.album();
        status.jointime && this.jointime();
        status.lostVideo && this.lostVideo();
      });
    }
    /** 修复限制访问up空间 */
    midInfo() {
      switch (this.mid) {
        case 11783021:
        case 1988098633:
        case 2042149112:
          mid_default.data.name = Mid[this.mid];
          mid_default.data.official.desc = mid_default.data.name + " 官方帐号";
          xhrHook("acc/info?", void 0, (obj) => {
            if (obj.responseText && obj.responseText.includes("-404")) {
              obj.response = obj.responseText = JSON.stringify(mid_default);
              toast.warning("该用户被404，已使用缓存数据恢复访问！");
            }
          }, false);
          break;
        default:
          break;
      }
    }
    /** 还原相簿 */
    album() {
      xhrHook("api.bilibili.com/x/dynamic/feed/draw/doc_list", void 0, (obj) => {
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
    }
    /** 动态重定向回相簿 */
    static album() {
      xhrHook(["x/polymer/web-dynamic", "detail?"], void 0, (res) => {
        const result = res.responseType === "json" ? res.response : JSON.parse(res.response);
        if (result.code === 0) {
          if (result.data?.item.type === "DYNAMIC_TYPE_DRAW")
            location.replace(\`https://h.bilibili.com/\${result.data.item.basic.rid_str}\`);
        }
      }, false);
    }
    /** 注册时间 */
    jointime() {
      poll(() => document.querySelector(".section.user-info"), (t) => {
        accountGetCardByMid(this.mid).then((d) => {
          const jointime = timeFormat(d.regtime * 1e3, true);
          const node = t.lastChild;
          new VdomTool(\`<div class="info-regtime" style="display: inline-block;word-break: break-all;">
                    <span class="info-command" style="display: inline-block;font-size: 12px;font-family: Microsoft YaHei;line-height: 16px;color: #9499a0;margin-right: 16px;">注册</span>
                    <span class="info-value" style="color: #6d757a;font-family: Microsoft YaHei;font-size: 12px;line-height: 16px;padding-right: 15px;">\${jointime}</span>
                </div>\`).appendTo(node);
        });
      });
    }
    /** 失效视频 */
    lostVideo() {
      xhrHook("x/v3/fav/resource/list", void 0, async (res) => {
        try {
          const data = jsonCheck(res.response);
          if (data.data.medias) {
            data.data.medias.forEach((d) => {
              d.attr % 2 && this.aids.push(d.id);
            });
          }
          if (this.aids.length) {
            const data2 = ["检测到失效视频！", this.aids.join(" ")];
            const tst = toast.toast(0, "warning", ...data2);
            this.lostVideoView().then(() => {
              setTimeout(() => {
                data2.push("数据返回，正在修复~");
                let resolve = 0, reject = 0;
                tst.data = data2;
                tst.type = "success";
                const ele = document.querySelector("#page-fav");
                if (ele) {
                  const medias = ele.__vue__.favListDetails.medias;
                  medias?.forEach((d) => {
                    if (d.attr % 2) {
                      data2.push(\`-------- av\${d.id} --------\`);
                      if (this.aidInfo[d.id].title) {
                        resolve++;
                        d.title = this.aidInfo[d.id].title;
                        data2.push(this.aidInfo[d.id].title);
                      } else {
                        reject++;
                        d.title = \`av\${d.id}\`;
                        data2.push("未能获取到有效信息！");
                      }
                      this.aidInfo[d.id].cover && (d.cover = this.aidInfo[d.id].cover);
                      d.attr = 0;
                      tst.data = data2;
                      ele.querySelector(\`[data-aid=\${d.bvid}]\`)?.children[1]?.setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                    }
                  });
                }
                data2.push("", \`修复结束：成功 \${resolve} 失败 \${reject}\`);
                tst.data = data2;
                tst.delay = 4;
              }, 100);
            });
          }
        } catch {
        }
      }, false);
    }
    lostVideoView() {
      const arr2 = [];
      while (this.aids.length) {
        arr2.push((async () => {
          const d = this.aids.shift();
          if (this.aidInfo[d])
            return;
          let title, cover;
          await GM.fetch(\`//www.biliplus.com/video/av\${d}\`).then((d2) => d2.text()).then((d2) => {
            if (d2.match(/\\<title\\>.+?\\ \\-\\ AV/)) {
              title = d2.match(/\\<title\\>.+?\\ \\-\\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
              cover = d2.match(/\\<img style=\\"display:none\\"\\ src=\\".+?\\"\\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
            }
          }).catch((e) => {
            debug.error(\`获取失效视频av\${d}信息错误\`, "BILIPLUS", e);
          });
          if (!title || !cover) {
            await GM.fetch(\`//www.biliplus.com/all/video/av\${d}\`).then((d2) => d2.text()).then((d2) => {
              if (d2.match("/api/view_all?")) {
                const url = d2.match(/\\/api\\/view_all\\?.+?\\',cloudmoe/)[0].replace(/\\',cloudmoe/, "");
                return GM.fetch(\`//www.biliplus.com\${url}\`);
              }
              throw new Error("无cid缓存");
            }).then((d2) => d2.json()).then((d2) => {
              d2 = jsonCheck(d2);
              title = title || d2.data.info.title;
              cover = cover || d2.data.info.pic;
            }).catch((e) => {
              debug.error(\`获取失效视频av\${d}信息错误\`, "BILIPLUSALL", e);
            });
          }
          if (!title || !cover) {
            await GM.fetch(\`//www.jijidown.com/video/av\${d}\`).then((d2) => d2.text()).then((d2) => {
              if (d2.match("window._INIT")) {
                title = title || d2.match(/\\<title\\>.+?\\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                cover = cover || d2.match(/\\"img\\":\\ \\".+?\\",/)[0].match(/http.+?\\",/)[0].replace(/",/, "");
              }
            }).catch((e) => {
              debug.error(\`获取失效视频av\${d}信息错误\`, "JIJIDOWN", e);
            });
          }
          cover = cover && cover.replace("http:", "");
          this.aidInfo[d] = { title, cover };
        })());
      }
      return Promise.all(arr2);
    }
  };

  // src/page/media.ts
  init_tampermonkey();
  var PageMedia = class {
    constructor() {
      this.limit();
    }
    /** 解除限制 */
    limit() {
      xhrHook("user/status", void 0, (res) => {
        try {
          const result = jsonCheck(res.response);
          result.result.area_limit = 0;
          result.result.ban_area_show = 0;
          res.responseType === "json" ? res.response = result : res.response = res.responseText = JSON.stringify(result);
        } catch (e) {
        }
      }, false);
    }
  };

  // src/page/history.ts
  init_tampermonkey();
  var PageHistory = class {
    constructor() {
      user.addCallback((status) => {
        status.history && this.archive();
      });
    }
    /** 纯视频历史记录 */
    archive() {
      xhrHook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function(args) {
        let obj = new URL(args[1]), max = obj.searchParams.get("max") || "", view_at = obj.searchParams.get("view_at") || "";
        args[1] = objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max, view_at, type: "archive", ps: "20" });
      }, void 0, false);
    }
  };

  // src/page/live.ts
  init_tampermonkey();

  // src/core/report.ts
  init_tampermonkey();
  var Cache = class {
    fpriskMsg = {};
  };
  var EventTracker = class {
    extMsgs = {};
    legalContainer = "report-wrap-module";
    bindEvent() {
    }
    bindHeatMapEvent() {
    }
    checkContainer() {
    }
    eventCB() {
    }
    handleSelfDefReport() {
    }
    todo() {
    }
  };
  var LoadTracker = class {
    msg = {};
    showRawPerformance() {
    }
    todo() {
    }
  };
  var PvTracker = class {
    extMsgs = {};
    _uuid = "";
    sendPV() {
    }
    todo() {
    }
  };
  var ScrollTracker = class {
    extMsgs = {};
    ignoreHidden = true;
    reportedIds = [];
    scrollDivClass = "";
    scrollLintenerFns = [];
    scrollMsg = {};
    scrollReportOffset = 200;
    scrollSubDivClass = "";
    addScrollListenNode() {
    }
    checkScroll() {
    }
    customReport() {
    }
    getOffset() {
    }
    inView() {
    }
    judgeAppear() {
    }
    judgeCustom() {
    }
    judgeHidden() {
    }
    judgeSubAppear() {
    }
    removeScrollListenNode() {
    }
    subInView() {
    }
    todo() {
    }
    todoCustom() {
    }
  };
  var reportConfig = { msgObjects: "spmReportData", sample: -1, scrollTracker: false };
  var reportMsgObj = {};
  var ReportObserver = class {
    constructor() {
      propertyHook(window, "reportObserver", this);
      propertyHook(window, "reportConfig", reportConfig);
    }
    cache = new Cache();
    eventTracker = new EventTracker();
    loadTracker = new LoadTracker();
    pvTracker = new PvTracker();
    scrollTracker = new ScrollTracker();
    forceCommit() {
    }
    importTracker() {
    }
    init() {
    }
    initBsource() {
    }
    initTracker() {
    }
    reportCustomData() {
    }
    reportWithAdditionalParam() {
    }
    reportWithSpmPrefix() {
    }
    sendPV() {
    }
    sendPerformance() {
    }
    setSPM_id() {
    }
    setSpeicalMsg() {
    }
    updateConfig() {
    }
  };
  var statisObserverConfig = {
    blackEvents: [],
    clickConfig: { logId: "", isDoubleWrite: false },
    loadPerform: false,
    loadSpecial: false,
    performConfig: { isWrite: false },
    pvConfig: { isDoubleWrite: false, logId: "", selfDefMsg: {} },
    selfConfig: { logId: "", isDoubleWrite: false, isSelfDefWrite: false, isDefaultWrite: false },
    spmId: ""
  };
  var StatisObserver = class {
    __bufferFuns = [];
    __initConfig = {};
    __loadedFlag = { baidu: false, error: false, event: false, perform: false, pv: false, special: false };
    __visitId = "";
    constructor() {
      propertyHook(window, "__statisObserver", this);
      propertyHook(window, "reportMsgObj", reportMsgObj);
      propertyHook(window, "__statisObserverConfig", statisObserverConfig);
    }
    addClickTracker() {
    }
    addLegalContainer() {
    }
    addSelfDefineMsg() {
    }
    forceCommit() {
    }
    getPvid() {
    }
    removeLegalContainer() {
    }
    removeSelfDefineMsg() {
    }
    sendBaidu() {
    }
    sendClickEvent() {
    }
    sendCustomMetrics() {
    }
    sendError() {
    }
    sendPV() {
    }
    sendPerform() {
    }
    sendSpecial() {
    }
    setAttrName() {
    }
    setBaseUrl() {
    }
    setErrorInterval() {
    }
    setErrorLogId() {
    }
    setEventLogId() {
    }
    setEventSendStatus() {
    }
    setPVLogId() {
    }
    setPVSendStatus() {
    }
    setPerformLogId() {
    }
    setPvid() {
    }
    setSpecialFirstLoop() {
    }
    setSpecialInterval() {
    }
    setSpecialLogId() {
    }
    setSpmId() {
    }
    startPoolListen() {
    }
    startSpecialLoop() {
    }
    stopPoolListen() {
    }
    stopSpecialLoop() {
    }
  };

  // src/core/url.ts
  init_tampermonkey();
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
  var UrlCleaner = class {
    /** 垃圾参数序列 */
    paramsSet = paramsSet;
    /** 精准爆破序列 */
    paramArr = paramArr;
    constructor() {
      this.location();
      window.navigation?.addEventListener("navigate", (e) => {
        const newURL = this.clear(e.destination.url);
        if (e.destination.url != newURL) {
          e.preventDefault();
          if (newURL == window.location.href)
            return;
          this.updateLocation(newURL);
        }
      });
      window.addEventListener("click", (e) => this.anchorClick(e));
      window.addEventListener("contextmenu", (e) => this.anchorClick(e));
      document.addEventListener("DOMContentLoaded", () => {
        this.location();
        this.anchor(document.querySelectorAll("a"));
      }, { once: true });
    }
    /** 净化url */
    clear(str) {
      const url = new URL2(str);
      if (url && !str.includes("passport.bilibili.com")) {
        const params = url.params;
        if (params.bvid) {
          params.aid = abv(params.bvid);
        }
        if (params.aid && !Number(params.aid)) {
          params.aid = abv(params.aid);
        }
        paramsSet.forEach((d) => {
          delete params[d];
        });
        paramArr.forEach((d) => {
          if (params[d[0]]) {
            if (d[1].includes(params[d[0]])) {
              delete params[d[0]];
            }
          }
        });
        url.base = BV2avAll(url.base);
        url.hash && (url.hash = BV2avAll(url.hash));
        return url.toJSON();
      } else
        return str;
    }
    /** 净化URL */
    location() {
      this.updateLocation(this.clear(location.href));
    }
    /** 更新URL而不触发重定向 */
    updateLocation(url) {
      const Url = new self.URL(url);
      if (Url.host === location.host) {
        window.history.replaceState(window.history.state, "", url);
      }
    }
    /** 点击回调 */
    anchorClick(e) {
      var f = e.target;
      for (; f && "A" !== f.tagName; ) {
        f = f.parentNode;
      }
      if ("A" !== f?.tagName) {
        return;
      }
      this.anchor([f]);
    }
    /** 净化a标签 */
    anchor(list) {
      list.forEach((d) => {
        if (!d.href)
          return;
        d.href = this.clear(d.href);
      });
    }
  };
  var urlCleaner = new UrlCleaner();

  // src/page/live.ts
  var PageLive = class {
    sleep = false;
    constructor() {
      user.addCallback((status) => {
        status.disableSleepChcek && this.disAbleSleepCheck();
        status.disableReport && new StatisObserver();
      });
      this.urlClean();
    }
    /** 添加url清理参数 */
    urlClean() {
      urlCleaner.paramsSet.add("broadcast_type");
      urlCleaner.paramsSet.add("is_room_feed");
    }
    /** 禁止挂机检测 */
    disAbleSleepCheck() {
      const setInterval2 = self.setInterval;
      self.setInterval = (...args) => {
        if (args[0].toString().includes("triggerSleepCallback")) {
          if (!this.sleep) {
            this.sleep = true;
            toast.warning("成功阻止直播间挂机检测！");
          }
          return Number.MIN_VALUE;
        }
        return setInterval2.call(self, ...args);
      };
    }
  };

  // src/page/dynamic.ts
  init_tampermonkey();
  var PageDynamic = class {
    constructor() {
      user.addCallback((status) => {
        status.liveRecord || this.liveRecord();
      });
    }
    liveRecord() {
      xhrHook("api.bilibili.com/x/polymer/web-dynamic/v1/feed/all", void 0, (r) => {
        try {
          const response = jsonCheck(r.response);
          response.data.items = response.data.items.filter((d) => d.modules?.module_dynamic?.major?.archive?.badge?.text != "直播回放");
          r.responseType === "json" ? r.response = response : r.response = r.responseText = JSON.stringify(response);
        } catch (e) {
        }
      }, false);
    }
  };

  // src/page/index.ts
  init_tampermonkey();

  // src/html/index.html
  var html_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta charset="utf-8" />\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords"\\r\\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\\r\\n        title="哔哩哔哩" />\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css" />\\r\\n    <style type="text/css">\\r\\n        /* 隐藏失效节点 */\\r\\n        #fixed_app_download,\\r\\n        #app>div.report-wrap-module.elevator-module>div.ver {\\r\\n            display: none;\\r\\n        }\\r\\n\\r\\n        /* 禁用失效节点 */\\r\\n        .bili-tab.rank-tab,\\r\\n        .bili-dropdown.rank-dropdown {\\r\\n            pointer-events: none;\\r\\n        }\\r\\n\\r\\n        /* 资讯区图标 */\\r\\n        .icon.icon_t.icon-news {\\r\\n            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMzNhZmQ3OS04ZTViLWQ2NDItOTYxZi0yNDM2MGQyN2JhM2YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTFEMzQ4MEJBNUM1MTFFQ0FGQTk5NEVFMjgwODg3M0UiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTFEMzQ4MEFBNUM1MTFFQ0FGQTk5NEVFMjgwODg3M0UiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBiNzNlZjA5LTA1ZmEtNTM0MC1iMWY3LWE4MTljMjFhYmEzMiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjI2MDJjOTk2LTBiNzQtZDQ0MC1hMzcxLTIxN2NkM2ZlOTgzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsCIXZoAAAi+SURBVHja7Fh7TJvXFT+fwTa2MX5gXjZgg3kEJvICh6YELUujNKNb10ZpWFc17aapSxcpy1YlUjctUbt0L22VMm2NlkXLsqZJWdT0sWwlaZOmCwW1gfIMCSYYDOZhDH6ADdjGvvvOhc8YY8Bru61/9EhX97vnnnvv755z7znnfgwhBD7PxIPPOcWHNxiGWdSp0Wi2eX0+uSxJVuxyOaXIk8nkk1hj2+FwlHGyCoWiMbwfaXLCNRIEsAsFAufU9LSdLxL2jw4O21cCFGlRJpzBAUzTqnX2Qdtlti8/XFir04AqK58RieVgtxinPB6XyFBRRQf19nfDtH10Cr+Rj/XIuNvnnXQJuPFCqcznc0+YgyRoCQaD/ckq1d/HbLaLMQP0zPjmtCFN7Nq45csFzxz4IeTk6ilPJBGDLjMNJAmCmM0zMu4Ci2UEek09YBs0w+jENHR13aV9nS0fTHXe6hRpdbojPT13jy0HkDK44p72QmpKyncl8uQZEiOxY2j5JLT/0E9IfFx8EC0WDQ+WJRqUihNOVz++78nzZ14KafS/QWgJnF+eKCFypWI3Z+pIDS65xTweL7vSULLsxHE8Hj2rkRdq0Rzz/VzhLSOLIEsrtzIsCGXMbobH8DJzS8qjCuMygWAwpP7lKBhhpmAUWc46ZYZy7M+PGaAgMUkb3u7r7YWrV94Bv98PZL7d3NT0mZm6pGQdhLurFQF2dfaowt0C3anbDUODg9DR1hZq28ftnxlAbbaeWi0mgLV1danRHLZAKGQBtgPr+BbxUZM1587DG6+9Bk6nk7aNXV2078b196m2kdACttFRWr98+i+s3MeRniTf+uP90phMjOBUcskinkqlArVGAw0f1Id4uCCC1uXowOv1Qf2NOhAIBHDX2E03guAGzP1UDi3g9/lpvbGsFHL0uaF5sjQptD6Vti5rVYDD/b1aTnuRx3rt+nV0gZHhEdoetVpp7Z50g1AogPGxMdBkZdG612SiG0KQKKfLyQF1pgYK1hRCR3sHCPj80LzJiiQaYXDtVQFmZOeYlzsLKampdCEEGW56BF5RWQk7H6gCuVw+dxxYEPr8PJAmSeHjxibI0mZT+fLNm0EqlcL1a+99umxmzOmJKlxqWLhsOblzZmpraYU7nbfxJtI2mtzn9YImMxMy1GrKS2U3N2QZpGdwcnISfD7vkrndnqn1q2Yzx399lNrP7bCGeLl5emo6JLFEAl9/+KGF7288SM0pSUwEuUIx5zbWroXCoiLgs2bE71y9nsoioVbTM9JDm0NiN0PQcyRKxC2rAmx/Ypdff6IGPaiQu8cikZgWjtCMHOHCXypZHHWQJw7/ngeHNR6RSJqc8jJRjnx0E0t++iLN5UYtff+zhHTaQzM0MFRs88d0Bll1m+saO0KxcqWElgt/keyFWLy0L5IwFUOyDPQOxQQwL0/f8uGNSySWbJdzR5HshVi8tC+SME+E1VLs8HxQlZKyC3O0my13FuVuASyBIC3++TKL7SCbH9PyiVJC8s29TxPMP7lIEpkPxi9RqSD+OtavvPQ8FB0/DX0WKzVjUe1lGLm/FOKS9ayb8BE2ajAkTI+xPg7T/noOhqrKwK/eACn8IH0qZKepmtN+/ofJVW8xkulun51NWs/86W+XH12z5U0hBvPUty4A+f0JMmLez1j2PAYJXh89WbJpE1imJaAWutlavOwxQOKrsyGruR54hw5Pqxu3i7oOfh9uTCXTd4xtfPxfy20o6puELp4ovpoglVfI9v5CaPBPwQWlHWzt3dOHlEoRXoDkNDkok5SQmiRaERhH+B550GaFEkkCtHtm4HmvGhqMTeB4/1VjYpK02mG3t0SbZ5EGERSmPrOB2Xo2swZJaZXQVvxVeKf1FrQ+ooNS93HR2NlzYFLIiNXu8eFkMxNOAcbSCE8g4F5x4d/fySsW8N/4DbPjnBkc7nWgvP4q4FocuJhMLMsvLSDf/lGB3J9FknfeA/iasXS+jUGMTd5K4NK+FOAfe44Z7LopnHv7OsEx7hAqkuciCfsdmovlURlpkhy89WcFWa1+hkgVILS0Anm4wKerqBHAweonXd1N9yLQ3Fw9+pxjywJMksmewTRPf98jkC2eZHrYvIDPruv0Z8OfGzuhbE8pkOpfAsyOgKbQQGuINwC5+RGQzjvAFK8BYh0G3mM7WH76fH86ndv/8iWGbNDDW7e9MDNkhfUBEPBU2ZB7tgGCY/0FfQerC/q7m4yRABf5QVS1w3jzWt/hvdA/JaXgkGZScqCm9haAZhN0GPLh/vRiYDUYWpwxbAJIl8Hsm/+gIClx4Nj6e9u2B4/WnATeE3vhSkc3O5+Bzu1nlc0qYi6iDHd78Syu6Adp5qHJUPLj+V2p9z1O9C80BAsvuMiGdwkRP11L37F6vTaIfhJL+dbt5OBT3yL1b9cQ4h+ec2xsffujK5R39IXfEk4WC8qqD5wkca+4yKYmQgu2sQ/9bzQ/uARgWBb9KxyIE+y+PUF4R7qoQ0XHah60UnAcSORvrdpNN4BtVdE9RLn7Z7Qgf3jMSUFzfARWdtlMx+PYlR7uUQHiTyPUIg7efMJEJ0QNNgy4QxGgd8JPeRzhwqh13BD+aUDZHadM7sjIgWOY94gX50QLIWhUxnIajI92tfGPFv7g8bknoO1Zg1aUkS9k2DNy3LNHOPDQ16CYTbFOmueGbjn2Lq2dxXtg16MZ8M/f1bNuyQi1bR6oa3ZKjmaOwE4yAC5RHpjaP4REYwNk1Mv4cco0UJSpGUfzAzDx+nOHAsHAGXaaiys66mjZCqo/MOXfyG6nnHu/snnKVwRPXWKqDtwLF88PUzkEp01LBLPVTUHixcoR2on5SCVwfhJ9IveHayGxCFqSlcrzozbbqZh/v60YS1nAbpf3zj6TTZgvWBjb7Vs6FvuvnfwjvH74B0aZQv5sIBAwrfaP8FMDjIuLu6ooMGz7TxNT1hkb/bP+wtXkVgT4xT/qLwD+H+jfAgwAa4KbOGyf2aUAAAAASUVORK5CYII=);\\r\\n            background-position: unset;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div id="home-app"></div>\\r\\n    <div id="app" data-server-rendered="true"></div>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"><\\/script>\\r\\n    <script src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/html/news.html
  var news_default = '<div class="r-con">\\r\\n    <div class="r-con">\\r\\n        <header style="margin-bottom: 14px">\\r\\n            <h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3>\\r\\n        </header>\\r\\n        <div class="carousel-module">\\r\\n            <div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img\\r\\n                        src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp"\\r\\n                        width="260" height="280" /></a></div>\\r\\n        </div>\\r\\n    </div>\\r\\n</div>';

  // src/io/api-article-cards.ts
  init_tampermonkey();
  async function apiArticleCards(data) {
    const arr2 = [];
    if (isArray(data)) {
      arr2.push(...data);
    } else {
      Object.entries(data).forEach((d) => {
        if (d[1]) {
          (isArray(d[1]) ? d[1] : [d[1]]).forEach((t) => arr2.push(d[0] + t));
        }
      });
    }
    if (!arr2.length)
      throw new Error("输入参数不能为空！");
    const response = await fetch(objUrl(URLS.ARTICLE_CARDS, { ids: arr2.join(",") }));
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/io/api-index-top-rcmd.ts
  init_tampermonkey();
  async function apiIndexTopRcmd(data) {
    const response = await fetch(objUrl(URLS.INDEX_TOP_RCMD, {
      fresh_type: data?.fresh_type || 3
    }), {
      credentials: data?.credentials || "include"
    });
    const json = await response.json();
    return jsonCheck(json).data.item.map((d) => {
      d.author = d.owner.name;
      d.play = d.stat.view;
      d.aid = d.id;
      return d;
    });
  }

  // src/io/api-newlist.ts
  init_tampermonkey();
  async function apiNewlist(rid, ps = 30, pn = 1, type = 0) {
    const response = await fetch(objUrl(URLS.NEWLIST, { rid, type, pn, ps }));
    const json = await response.json();
    return jsonCheck(json).data.archives;
  }

  // src/io/api-season-rank-list.ts
  init_tampermonkey();
  async function apiSeasonRankList(data) {
    const response = await fetch(objUrl(URLS.SEASON_RANK_LIST, {
      season_type: data.season_type,
      day: 3
    }));
    const json = await response.json();
    return jsonCheck(json).data.list;
  }

  // src/io/api-webshow-locs.ts
  init_tampermonkey();
  async function apiWebshowLoc(id) {
    const response = await fetch(objUrl(URLS.WEBSHOW_LOCS.slice(0, -1), {
      pf: 0,
      id
    }));
    const text = await response.text();
    return jsonCheck(BV2avAll(text)).data;
  }
  async function apiWebshowLocs(data) {
    const response = await fetch(objUrl(URLS.WEBSHOW_LOCS, {
      pf: 0,
      ids: data.ids.join(",")
    }));
    const text = await response.text();
    return jsonCheck(BV2avAll(text)).data;
  }

  // src/utils/format/unit.ts
  init_tampermonkey();
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

  // src/page/page.ts
  init_tampermonkey();
  var Page = class {
    /** 页面框架vdom */
    vdom;
    /** 初始化完成 */
    initilized = false;
    /**
     * @param html 页面框架
     */
    constructor(html) {
      this.vdom = new VdomTool(html);
      Reflect.defineProperty(window, "_babelPolyfill", {
        configurable: true,
        set: () => true,
        get: () => void 0
      });
    }
    /** 重写页面 */
    updateDom() {
      const title = document.title;
      this.vdom.replace(document.documentElement);
      Reflect.deleteProperty(window, "PlayerAgent");
      Reflect.deleteProperty(window, "webpackJsonp");
      this.vdom.loadScript().then(() => this.loadedCallback());
      title && !title.includes("404") && (document.title = title);
    }
    /** 重写完成回调 */
    loadedCallback() {
      this.initilized = true;
      poll(() => document.readyState === "complete", () => {
        document.querySelector("#jvs-cert") || window.dispatchEvent(new ProgressEvent("load"));
      });
    }
  };

  // src/page/index.ts
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
  var PageIndex = class extends Page {
    constructor() {
      super(html_default);
      window.__INITIAL_STATE__ = __INITIAL_STATE__;
      this.updateDom();
      this.locsData();
      this.recommendData();
      this.ranking();
      this.roomRecommend();
      this.newlist();
      this.region();
      Header.primaryMenu();
      Header.banner();
      user.userStatus.timeLine && this.timeLine();
    }
    locsData() {
      apiWebshowLocs({ ids: [4694, 29, 31, 34, 40, 42, 44] }).then((d) => {
        __INITIAL_STATE__.locsData[23] = this.adblock(d[4694]);
        __INITIAL_STATE__.locsData[29] = this.adblock(d[29]);
        __INITIAL_STATE__.locsData[31] = this.adblock(d[31]);
        __INITIAL_STATE__.locsData[34] = this.adblock(d[34]);
        __INITIAL_STATE__.locsData[40] = this.adblock(d[40]);
        __INITIAL_STATE__.locsData[42] = this.adblock(d[42]);
        __INITIAL_STATE__.locsData[44] = this.adblock(d[44]);
      }).catch((e) => {
        toast.error("locsData Error!", e)();
      });
    }
    recommendData() {
      apiIndexTopRcmd().then((d) => {
        if (uid) {
          __INITIAL_STATE__.recommendData = d;
          poll(() => document.querySelector(".rec-btn.prev"), () => {
            addElement(
              "span",
              { class: "rec-btn prev" },
              void 0,
              "刷新",
              void 0,
              document.querySelector(".rec-btn.prev")
            ).addEventListener("click", () => {
              apiIndexTopRcmd().then((d2) => __INITIAL_STATE__.recommendData = d2);
            });
            addElement(
              "span",
              { class: "rec-btn next" },
              void 0,
              "刷新",
              void 0,
              document.querySelector(".rec-btn.next")
            ).addEventListener("click", () => {
              apiIndexTopRcmd().then((d2) => __INITIAL_STATE__.recommendData = d2);
            });
          });
        } else {
          const one = d.splice(0, 10);
          const two = d.splice(0, 10);
          __INITIAL_STATE__.recommendData = [...one];
          jsonpHook.async("api.bilibili.com/x/web-interface/ranking/index", void 0, async (str) => {
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
      }).catch((e) => {
        toast.error("recommendData Error!", e)();
      });
    }
    /** 修复分区排行 */
    ranking() {
      poll(() => document.querySelector("#ranking_ad"), () => {
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
        poll(() => document.querySelector("#ranking_news"), (d) => {
          new VdomTool(news_default).replace(d);
        });
      });
    }
    /** 修复直播推荐 */
    roomRecommend() {
      xhrHook("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec", (args) => {
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
    }
    /** 用户热点最新投稿修复资讯区最新投稿 */
    newlist() {
      jsonpHook(["newlist", "rid=202"], (url) => url.replace("rid=202", "rid=203"), void 0, false);
    }
    /** 修正电影/电视剧/纪录片排行 */
    region() {
      jsonpHook("api.bilibili.com/x/web-interface/ranking/region", (url) => {
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
          apiSeasonRankList({ season_type: arr2[1] }).then((d) => {
            let html = \`<header class="rank-head"><h3>排行</h3><div class="bili-dropdown rank-dropdown"><span class="selected">三日</span><i class="icon icon-arrow-down"></i><ul class="dropdown-list"><li class="dropdown-item" style="display: none;">三日</li><li class="dropdown-item">一周</li></ul></div></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list">\`;
            for (let i = 0; i < 8; i++) {
              html += \`<li class="rank-item\${i < 3 ? " highlight" : ""}"><i class="ri-num">\${i + 1}</i><a href="\${d[i].url}" target="_blank" title="\${d[i].title} 播放:\${d[i].stat.view}" class="ri-info-wrap"><p class="ri-title">\${d[i].title}</p><span class="ri-total">\${d[i].new_ep.index_show}</span></a></li>\`;
            }
            html += \`</ul></div><a href="\${arr2[2]}" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>\`;
            const vnode = htmlVnode(html);
            vnode[1].children[0].children?.forEach((t, i) => {
              let node;
              t.event = {
                "mouseover": (e) => {
                  const target = e.target;
                  const nodes = \`<div class="bangumi-info-module" style="left: \${target.getBoundingClientRect().left}px; top: \${getTotalTop(target) - 150}px;"><div class="v-preview clearfix"><div class="lazy-img cover"><img alt="\${d[i].title}" src="\${d[i].cover.replace("http:", "")}@72w_72h.webp" /></div><div><p class="title">\${d[i].title}</p><p class="desc">\${d[i].new_ep.index_show}</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>\${unitFormat(d[i].stat.view)}</span><span class="danmu"><i class="icon"></i>\${unitFormat(d[i].stat.danmaku)}</span><span class="fav"><i class="icon"></i>\${unitFormat(d[i].stat.follow)}</span></div></div>\`;
                  node = new VdomTool(nodes).toFragment().children[0];
                  document.body.appendChild(node);
                },
                "mouseout": () => node.remove()
              };
            });
            arr2[0].replaceChildren(new VdomTool(vnode).toFragment());
          }).catch((e) => {
            debug.error(arr2[0], e);
          });
        }
        return url;
      }, void 0, false);
    }
    adblock(arr2) {
      return arr2?.filter((d) => !d.is_ad && d.id);
    }
    /** 港澳台新番时间表 */
    timeLine() {
      poll(() => document.querySelector("#bili_bangumi > .bangumi-module")?.__vue__, (vue) => {
        apiNewlist(33).then(async (d) => {
          const eps = d.reduce((s, d2) => {
            if (d2.redirect_url && d2.owner.mid === 11783021) {
              const arr2 = d2.redirect_url.split("/");
              const ep = arr2.at(-1);
              if (ep) {
                ep.replace("d+", (e) => d2.episode_id = e);
                s[ep] = d2;
              }
            }
            return s;
          }, {});
          const cards = await apiArticleCards(Object.keys(eps));
          Object.entries(cards).forEach((d2) => {
            if (eps[d2[0]]) {
              Object.assign(eps[d2[0]], d2[1]);
            }
          });
          const timingData = vue.timingData;
          Object.values(eps).forEach((d2) => {
            const date = new Date(d2.pubdate * 1e3);
            for (let i = timingData.length - 1; i >= 0; i--) {
              if (date.getDay() + 1 === timingData[i].day_of_week) {
                timingData[i].episodes.push({
                  cover: d2.cover || d2.pic,
                  delay: 0,
                  delay_id: 0,
                  delay_index: "",
                  delay_reason: "",
                  ep_cover: d2.cover || d2.pic,
                  episode_id: d2.episode_id,
                  follows: d2.follow_count,
                  plays: d2.play_count,
                  pub_index: d2.desc,
                  pub_time: \`\${integerFormat(date.getHours())}:\${integerFormat(date.getMinutes())}\`,
                  pub_ts: d2.pubdate,
                  published: 1,
                  season_id: d2.season_id,
                  square_cover: d2.cover || d2.pic,
                  title: d2.title
                });
                break;
              }
            }
          });
          vue.timingData = timingData;
        }).catch((e) => {
          debug.error("港澳台新番时间表", e);
        });
      });
    }
  };

  // src/utils/cdn.ts
  init_tampermonkey();
  var Cdn = class {
    /**
     * 
     * @param host CDN名
     * @param hash 默认文件版本哈希值
     * @param protocol url协议
     */
    constructor(host = "Github", hash, protocol = "https") {
      this.host = host;
      this.hash = hash;
      this.protocol = protocol;
    }
    /**
     * 获取cdn链接
     * @param path 文件相对路径
     * @param hash 文件版本哈希值
     */
    encode(path, hash = this.hash) {
      switch (this.host) {
        case "jsdelivr":
          return \`\${this.protocol}://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old\${hash ? \`@\${hash}\` : ""}\${path}\`;
        default:
          return \`\${this.protocol}://github.com/MotooriKashin/Bilibili-Old/raw/\${hash || "master"}\${path}\`;
      }
    }
    /** 更新默认值 */
    update(host, hash, protocol) {
      this.host = host;
      hash && (this.hash = hash);
      protocol && (this.protocol = protocol);
    }
  };
  var cdn = new Cdn();

  // src/core/player.ts
  init_tampermonkey();

  // src/io/api-pgc-slideshow.ts
  init_tampermonkey();
  async function apiPgcSlideShow(position_id) {
    const response = await fetch(objUrl(URLS.SLIDE_SHOW, { position_id }));
    const json = await response.json();
    return jsonCheck(json).result;
  }

  // src/io/api-search-square.ts
  init_tampermonkey();
  async function apiSearchSquare(limit = 10) {
    const response = await fetch(objUrl(URLS.SEARCH_SQUARE, { limit }));
    const json = await response.json();
    return jsonCheck(json).data.trending.list;
  }

  // src/utils/format/cht2chs.ts
  init_tampermonkey();
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
  var regexp;
  function cht2chs(text) {
    regexp || (regexp = new RegExp(Object.keys(aTC2SC).join("|"), "g"));
    return text.replace(regexp, (d) => aTC2SC[d]);
  }

  // src/core/player.ts
  var danmakuProtect = [
    // 96048, // 【幸运星组曲】「らき☆すた動画」
    207527,
    // 【呆又呆】鹿乃呆? 弹幕呆?
    329896,
    // 【白屏弹幕】10 years after
    469970,
    // 【黑屏弹幕】美丽之物【Soundhorizon】
    1474616,
    // 繁星梅露露(弹幕版)
    4335759,
    // 【弹幕PV】世界终结舞厅
    384460933
    // 【弹幕祭应援】 緋色月下、狂咲ノ絶-1st Anniversary Remix
  ];
  var Player = class {
    /** 播放器启动参数修改回调栈 */
    modifyArgumentCallback = [];
    /** 添加播放器启动参数修改命令 */
    addModifyArgument(callback) {
      this.modifyArgumentCallback.push(callback);
    }
    /** 捕获的新版播放器 */
    nanoPlayer;
    connect;
    isConnect = false;
    /** 已加载播放器 */
    playLoaded = false;
    constructor() {
      propertyHook.modify(window, "nano", (v) => {
        debug("捕获新版播放器！");
        const createPlayer = v.createPlayer;
        const that = this;
        propertyHook(v, "createPlayer", function() {
          debug("新版播放器试图启动！");
          if (that.isEmbedPlayer)
            throw new Error("爆破新版播放器！");
          that.nanoPlayer = createPlayer.call(v, ...arguments);
          that.createPlayer(...arguments);
          that.connect = that.nanoPlayer.connect;
          that.nanoPlayer.connect = function() {
            if (that.isConnect) {
              debug("允许新版播放器启动！");
              return that.connect?.();
            } else {
              that.isConnect = true;
              return Promise.resolve(true);
            }
          };
          return that.nanoPlayer;
        });
        if (window.player) {
          try {
            const manifest = window.player?.getManifest();
            debug("播放器实例已存在，可能脚本注入过慢！", manifest);
            manifest && this.createPlayer(manifest);
          } catch (e) {
            debug("读取播放器启动参数失败！", e);
          }
        }
        return v;
      });
    }
    /** 修改播放器启动参数 */
    modifyArgument(args) {
      while (this.modifyArgumentCallback.length) {
        this.modifyArgumentCallback.shift()?.(args);
      }
    }
    initData = {};
    dataInited = false;
    createPlayer(initData, theme) {
      this.dataInited = true;
      Object.entries(initData).forEach((d) => {
        switch (typeof d[1]) {
          case "bigint":
          case "boolean":
          case "number":
          case "string":
          case "undefined":
            this.initData[d[0]] = d[1];
            break;
          default:
            break;
        }
      });
      this.initData.as_wide = true;
      this.dataInitedCallback();
    }
    /** 脚本初始化中 */
    // private loading = true;
    /** 旧版播放器已启用 */
    isEmbedPlayer = false;
    /** 旧版播放器正常引导 */
    EmbedPlayer(loadPlayer, isEmbedPlayer = true) {
      this.nanoPermit = () => {
      };
      this.isEmbedPlayer = isEmbedPlayer;
      methodHook(window, "EmbedPlayer", () => loadPlayer(), (d) => this.modifyArgument(d));
      if (window.player?.disconnect) {
        try {
          debug("爆破新版播放器!");
          window.player.disconnect();
          this.nanoPlayer || (this.nanoPlayer = window.player);
        } catch {
        }
      }
      this.switchVideo();
      this.simpleChinese();
    }
    /** 通过hook新版播放器来引导旧版播放器 */
    connectPlayer(loadPlayer) {
      this.EmbedPlayer(loadPlayer, false);
      this.dataInitedCallback(() => {
        window.EmbedPlayer("player", "", objUrl("", this.initData));
        if (this.nanoPlayer) {
          Object.defineProperties(this.nanoPlayer, {
            addEventListener: { get: () => window.player?.addEventListener },
            directiveDispatcher: { get: () => window.player?.directiveDispatcher },
            editorCenter: { get: () => window.player?.editorCenter },
            exitFullScreen: { get: () => window.player?.exitFullScreen },
            getCurrentTime: { get: () => window.player?.getCurrentTime },
            getDuration: { get: () => window.player?.getDuration },
            next: { get: () => window.player?.next },
            ogvUpdate: { get: () => window.player?.ogvUpdate },
            pause: { get: () => window.player?.pause },
            play: { get: () => window.player?.play },
            prev: { get: () => window.player?.prev },
            reload: { get: () => window.player?.reload },
            seek: { get: () => window.player?.seek },
            stop: { get: () => window.player?.stop },
            volume: { get: () => window.player?.volume },
            isInitialized: { value: () => true }
          });
        }
      });
      addCss(\`#bofqi .player,#bilibili-player .player{width: 100%;height: 100%;display: block;}.bilibili-player .bilibili-player-auxiliary-area{z-index: 1;}\`, "nano-fix");
    }
    /** 不启用旧版播放器允许新版播放器启动 */
    nanoPermit() {
      if (this.isConnect) {
        debug("允许新版播放器启动！");
        this.connect?.();
      } else {
        this.isConnect = true;
      }
    }
    /** 引导旧播放器 */
    loadEmbedPlayer() {
      if (!this.playLoaded) {
        this.playLoaded = true;
        this.EmbedPlayer(() => this.loadplayer());
        this.playerSettings();
      }
    }
    /** 替换新版播放器 */
    loadConnectPlayer() {
      if (!this.playLoaded) {
        this.playLoaded = true;
        this.connectPlayer(() => this.loadplayer());
        this.playerSettings();
      }
    }
    /** 播放器启动栈 */
    dataInitedCallbacks = [];
    /** 捕获启动数据后启动播放器 */
    dataInitedCallback(callback) {
      callback && this.dataInitedCallbacks.push(callback);
      if (this.dataInited) {
        while (this.dataInitedCallbacks.length) {
          this.dataInitedCallbacks.shift()?.();
        }
      }
    }
    regised = false;
    switchVideo() {
      if (this.regised)
        return;
      this.regised = true;
      let cache;
      switchVideo(() => {
        if (window.player.appendTopMessage) {
          const cfg = LocalStorage.getItem("bilibili_player_settings");
          poll(() => document.querySelector(".bilibili-player-video-message-panel"), () => {
            if (cache) {
              window.player.appendTopMessage(cache);
            } else if (cfg.message) {
              const message = Object.keys(cfg.message).filter((d) => cfg.message[d]).sort(() => 0.5 - Math.random());
              if (message[0]) {
                switch (message[0]) {
                  case "system":
                    apiWebshowLoc(4694).then((d) => {
                      window.player.appendTopMessage(cache = d.filter((d2) => d2.name).map((d2) => {
                        return {
                          url: d2.url,
                          type: message[0],
                          name: d2.name
                        };
                      }));
                    }).catch((e) => {
                      debug.error("播放器通知", e);
                    });
                    break;
                  case "bangumi":
                    apiPgcSlideShow(531).then((d) => {
                      window.player.appendTopMessage(cache = d.map((d2) => {
                        return {
                          url: d2.blink,
                          type: message[0],
                          name: d2.title
                        };
                      }));
                    }).catch((e) => {
                      debug.error("播放器通知", e);
                    });
                    break;
                  case "news":
                    apiSearchSquare().then((d) => {
                      window.player.appendTopMessage(cache = d.map((d2) => {
                        return {
                          url: d2.uri || \`//search.bilibili.com/all?keyword=\${encodeURIComponent(d2.keyword)}\`,
                          type: message[0],
                          name: d2.show_name || d2.keyword
                        };
                      }));
                    }).catch((e) => {
                      debug.error("播放器通知", e);
                    });
                    break;
                  default:
                    break;
                }
              }
            }
          });
        }
        user.userStatus.danmakuProtect && this.danmakuProtect();
      });
    }
    playbackRateTimer;
    /** 更改播放器速率 */
    playbackRate(playbackRate = 1) {
      clearTimeout(this.playbackRateTimer);
      this.playbackRateTimer = setTimeout(() => {
        const video = document.querySelector("#bilibiliPlayer video");
        if (!video)
          return toast.warning("未找到播放器！请在播放页面使用。");
        video.playbackRate = Number(playbackRate);
      }, 100);
    }
    /** 繁体字幕转简体 */
    simpleChinese() {
      if (user.userStatus.simpleChinese) {
        xhrHook("x/player/v2?", void 0, (res) => {
          try {
            const response = jsonCheck(res.response);
            if (response?.data?.subtitle?.subtitles?.length) {
              response.data.subtitle.subtitles.forEach((d) => {
                if (typeof d.subtitle_url === "string") {
                  switch (d.lan) {
                    case "zh-Hant":
                      xhrHook(d.subtitle_url, void 0, (res2) => {
                        try {
                          let response2 = res2.responseType === "json" ? JSON.stringify(res2.response) : res2.responseText;
                          if (response2) {
                            response2 = cht2chs(response2);
                            if (res2.responseType === "json") {
                              res2.response = JSON.parse(response2);
                            } else {
                              res2.response = res2.responseText = response2;
                            }
                            toast.warning("字幕：繁 -> 简", \`原始语言：\${d.lan_doc}\`);
                          }
                        } catch (e) {
                          debug.error("繁 -> 简", e);
                        }
                      });
                      break;
                    default:
                      break;
                  }
                }
              });
            }
          } catch {
          }
        }, false);
      }
    }
    /** 弹幕保护计划 */
    danmakuProtect() {
      if (!window.player?.appendDm)
        return;
      const cid = Number(BLOD.cid);
      if (cid && danmakuProtect.includes(cid)) {
        alert("此视频高级弹幕部分丢失，点击确认加载备份弹幕。<br>※ 请在原弹幕加载完后再点确定，以免备份弹幕被覆盖。", "弹幕保护计划", [
          {
            text: "确定",
            callback: () => {
              const data = ["弹幕保护计划 >>>"];
              const tst = toast.toast(0, "info", ...data);
              GM.fetch(cdn.encode(\`/danmaku/\${cid}.xml\`, ""), { cache: "force-cache" }).then((d) => {
                data.push(\`获取存档：\${cid}.xml\`);
                tst.data = data;
                tst.type = "success";
                return d.text();
              }).then((d) => {
                const dm = DanmakuBase.decodeXml(d);
                window.player.appendDm(dm, !user.userStatus.dmContact);
                data.push(\`有效弹幕数：\${dm.length}\`, \`加载模式：\${user.userStatus.dmContact ? "与已有弹幕合并" : "清空已有弹幕"}\`);
                tst.data = data;
              }).catch((e) => {
                data.push(e);
                debug.error("弹幕保护计划", e);
                tst.data = data;
                tst.type = "error";
              }).finally(() => {
                tst.delay = user.userStatus.toast.delay;
              });
            }
          },
          {
            text: "取消"
          }
        ], true);
      }
    }
    /** 备份播放器设置 */
    playerSettings() {
      const local = LocalStorage.getItem("bilibili_player_settings");
      if (local) {
        GM.setValue("bilibili_player_settings", local);
      } else {
        GM.getValue("bilibili_player_settings").then((d) => {
          d && LocalStorage.setItem("bilibili_player_settings", d);
        });
      }
    }
    /** 正在更新播放器 */
    updating = false;
    /**
     * 加载播放器
     * @param force 强制更新
     */
    async loadplayer(force = false) {
      if (!window.jQuery)
        await loadScript(URLS.JQUERY);
      try {
        if (user.userStatus.bilibiliplayer) {
          if (true) {
            const data = await Promise.all([
              GM.getValue("bilibiliplayer"),
              GM.getValue("bilibiliplayerstyle")
            ]);
            if (force || !data[0] || !data[1]) {
              if (this.updating)
                throw new Error("一次只能运行一个更新实例！");
              this.updating = true;
              if (!BLOD.version)
                throw new Error(\`未知错误导致脚本版本异常！version：\${BLOD.version}\`);
              const msg = [
                "更新播放器组件中，可能需要花费一点时间，请不要关闭页面！",
                "如果弹出跨域提醒，推荐【总是允许全部域名】",
                "如果多次更新失败，请禁用【重构播放器】功能！"
              ];
              const tst = toast.toast(0, "warning", ...msg);
              let i = 1;
              await Promise.all([
                GM.fetch(cdn.encode("/chrome/player/video.js")).then((d) => d.text()).then((d) => {
                  data[0] = d;
                  msg.push(\`加载播放器组件：\${i++}/2\`);
                  tst.data = msg;
                }).catch((e) => {
                  msg.push(\`获取播放器组件出错！\${i++}/2\`, e);
                  tst.data = msg;
                  tst.type = "error";
                }),
                GM.fetch(cdn.encode("/chrome/player/video.css")).then((d) => d.text()).then((d) => {
                  data[1] = d;
                  msg.push(\`加载播放器组件：\${i++}/2\`);
                  tst.data = msg;
                }).catch((e) => {
                  msg.push(\`获取播放器组件出错！\${i++}/2\`, e);
                  tst.data = msg;
                  tst.type = "error";
                })
              ]);
              this.updating = false;
              tst.delay = user.userStatus.toast.delay;
              if (!data[0] || !data[1])
                throw new Error("获取播放器组件出错！");
              msg.push("-------加载成功-------");
              tst.data = msg;
              tst.type = "success";
              GM.setValue("bilibiliplayer", data[0]);
              GM.setValue("bilibiliplayerstyle", data[1]);
            }
            new Function(data[0])();
            addCss(data[1], \`bilibiliplayer-\${BLOD.version}\`);
            GM.setValue("version", BLOD.version);
          } else {
            await Promise.all([
              GM.executeScript("player/video.js", true).then((d) => loadScript(d)),
              GM.insertCSS("player/video.css", true).then((d) => loadStyle(d))
            ]);
          }
        } else {
          await loadScript(URLS.VIDEO);
          addCss(".bilibili-player-video-progress-detail-img {transform: scale(0.333333);transform-origin: 0px 0px;}", "detail-img");
        }
      } catch (e) {
        this.updating || toast.error("播放器加载失败！", "已回滚~", e)();
        await loadScript(URLS.VIDEO);
        addCss(".bilibili-player-video-progress-detail-img {transform: scale(0.333333);transform-origin: 0px 0px;}", "detail-img");
      }
    }
  };
  var player = new Player();

  // src/page/av.ts
  init_tampermonkey();

  // src/core/comment.ts
  init_tampermonkey();
  var Feedback;
  var loading = false;
  var load = false;
  var events = {};
  var _Comment = class {
    constructor() {
      Feedback = void 0;
      loading = false;
      load = false;
      events = {};
      this.bbComment();
      this.initComment();
      this.pageCount();
    }
    /** 捕获评论组件 */
    bbComment() {
      Reflect.defineProperty(window, "bbComment", {
        configurable: true,
        set: (v) => {
          if (!v.prototype._createNickNameDom) {
            return loadScript("//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js").then(() => {
              Array.from(document.styleSheets).forEach((d) => {
                d.href && d.href.includes("comment") && (d.disabled = true);
              });
            });
          }
          Feedback = v;
          this.bbCommentModify();
          Reflect.defineProperty(window, "bbComment", { configurable: true, value: Feedback });
        },
        get: () => {
          return Feedback ? Feedback : class {
            constructor() {
              if (!loading) {
                loadScript("//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js").then(() => {
                  Array.from(document.styleSheets).forEach((d) => {
                    d.href && d.href.includes("comment") && (d.disabled = true);
                  });
                });
                loading = true;
              }
              setTimeout(() => {
                let bbcomment = new window.bbComment(...arguments);
                bbcomment.events && (bbcomment.events = Object.assign(bbcomment.events, events));
              });
            }
            on(eventName, cb) {
              if (!events[eventName]) {
                events[eventName] = [];
              }
              events[eventName].push(cb);
            }
          };
        }
      });
    }
    initComment() {
      Reflect.defineProperty(window, "initComment", {
        configurable: true,
        set: (v) => true,
        get: () => {
          if (load) {
            let initComment2 = function(tar, init) {
              new Feedback(tar, init.oid, init.pageType, init.userStatus);
            };
            var initComment = initComment2;
            Reflect.defineProperty(window, "initComment", { configurable: true, value: initComment2 });
            return initComment2;
          }
          return function() {
            if (!loading) {
              loadScript(\`//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js\`).then(() => {
                load = true;
              });
            }
            loading = true;
            setTimeout(() => window.initComment(...arguments), 100);
          };
        }
      });
    }
    /** 修复按时间排序评论翻页数 */
    pageCount() {
      let page;
      jsonpHook(["api.bilibili.com/x/v2/reply?", "sort=2"], void 0, (res) => {
        if (0 === res.code && res.data?.page) {
          page = res.data.page;
        }
        return res;
      }, false);
      jsonpHook(["api.bilibili.com/x/v2/reply?", "sort=0"], void 0, (res) => {
        if (page && 0 === res.code && res.data?.page) {
          page.count && (res.data.page.count = page.count);
          page.acount && (res.data.page.acount = page.acount);
        }
        return res;
      }, false);
    }
    /** 修补评论组件 */
    bbCommentModify() {
      this.styleFix();
      this.initAbtest();
      this._renderBottomPagination();
      this._createListCon();
      this._createSubReplyItem();
      this._registerEvent();
      this._resolvePictures();
      _Comment.commentJumpUrlTitle && this._resolveJump();
    }
    /** 样式修补 */
    styleFix() {
      addCss(\`.bb-comment .comment-list .list-item .info .btn-hover, .comment-bilibili-fold .comment-list .list-item .info .btn-hover {
            line-height: 24px;
        }\`, "comment-btn-24pxH");
      addCss(\`.operation.btn-hide-re .opera-list {visibility: visible}\`, "keep-operalist-visible");
      addCss(".image-exhibition {margin-top: 8px;user-select: none;} .image-exhibition .image-item-wrap {max-width: 240px;display: flex;justify-content: center;position: relative;border-radius: 4px;overflow: hidden;cursor: zoom-in;} .image-exhibition .image-item-wrap.vertical {flex-direction: column} .image-exhibition .image-item-wrap.extra-long {justify-content: start;} .image-exhibition .image-item-wrap img {width: 100%;}", "image-exhibition");
    }
    /** 退出abtest，获取翻页评论区 */
    initAbtest() {
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
    }
    /** 添加回小页码区 */
    _renderBottomPagination() {
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
    }
    /** 顶层评论ip属地 */
    _createListCon() {
      Feedback.prototype._createListCon = function(item, i, pos) {
        const blCon = this._parentBlacklistDom(item, i, pos);
        const con = [
          '<div class="con ' + (pos == i ? "no-border" : "") + '">',
          '<div class="user">' + this._createNickNameDom(item),
          this._createLevelLink(item),
          this._identity(item.mid, item.assist, item.member.fans_detail),
          this._createNameplate(item.member.nameplate) + this._createUserSailing(item) + "</div>",
          this._createMsgContent(item),
          this._resolvePictures(item.content),
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
    }
    /** 楼中楼评论ip属地 */
    _createSubReplyItem() {
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
          item.dialog != item.rpid ? '<span class="dialog btn-hover" dialog-id="' + item.dialog + '" data-id="' + item.rpid + '">查看对话</span>' : "",
          '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul>' + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : "") + (this._canReport(item.mid) ? '<li class="report">举报</li>' : "") + (this._canDel(item.mid) ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : "") + "</ul></div></div>",
          "</div>",
          "</div>"
        ].join("");
      };
    }
    /** 楼中楼“查看对话按钮” & 让评论菜单可以通过再次点击按钮来关闭 */
    _registerEvent() {
      const _registerEvent = Feedback.prototype._registerEvent;
      let previewImage;
      Feedback.prototype._registerEvent = function(e) {
        _registerEvent.call(this, e);
        let n = this.\$root;
        let \$ = window.\$;
        if (e)
          n = \$(e);
        let l = this;
        n.on("click.dialog", ".dialog", function() {
          let clickTarget = this;
          clickTarget.innerHTML = "正在载入……";
          let rootid = clickTarget.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
          let dialogid = clickTarget.getAttribute("dialog-id");
          let selfRpid = clickTarget.getAttribute("data-id");
          addCss(\`
            .comment-dialog .dialog{display:none!important}
            .comment-dialog > .comment-list{transform:translateY(-13px)}
            .comment-dialog{min-height:200px;max-height:70vh;overflow-y:auto}
            .comment-dialog-container{width:600px;z-index:100000;position:fixed;background:#fff;left:50%;top:50%;transform:translate(-50%,-50%);box-shadow:0 0 20px 3px #0000005c;border-radius:10px;padding:0 18px;opacity:1;transition:opacity 0.1s}
            .comment-dialog-container.hidden{opacity:0}\`, "comment-dialog");
          let container = document.createElement("div");
          container.className = "comment-dialog-container hidden";
          container.innerHTML = \`
            <div class="comment-dialog bb-comment">
            <div class="comment-list">
            <div class="list-item" data-id="\${rootid}">
            <div class="con" style="border:none;margin:0;padding:0;">
            <div class="reply-box">
            </div></div></div></div></div>\`;
          document.body.appendChild(container);
          let replyBox = container.getElementsByClassName("reply-box")[0];
          setTimeout(() => {
            let closeWindow = (e2) => {
              if (!container.contains(e2.target) && e2.target != container) {
                container.className = "comment-dialog-container hidden";
                setTimeout(() => container.remove(), 100);
                clickTarget.innerHTML = "查看对话";
                window.removeEventListener("click", closeWindow, false);
              }
            };
            window.addEventListener("click", closeWindow);
          }, 0);
          function fetchDialog(minFloor) {
            return \$.ajax({
              url: "//api.bilibili.com/x/v2/reply/dialog/cursor",
              type: "GET",
              data: {
                type: l.pageType,
                oid: l.oid,
                root: rootid,
                dialog: dialogid,
                size: 20,
                min_floor: minFloor
              },
              xhrFields: { withCredentials: true }
            });
          }
          function fixEmojiPosition(node) {
            node = \$(node);
            node.find(".reply-item").each(function(_, n2) {
              var t = \$(n2).find(".reply-face"), r = \$(n2).find(".user"), n2 = \$(n2).find(".name");
              t && r && n2 && (10 < n2.offset().top - r.offset().top ? t.css("top", "32px") : t.css("top", "0"));
            });
          }
          fetchDialog(0).done((resp) => {
            if (resp.code == 0 && resp.data.replies && resp.data.replies.length > 0) {
              let nextPage2 = function(minFloor) {
                if (minFloor < resp.data.dialog.max_floor) {
                  fetchDialog(minFloor + 1).done((resp2) => {
                    if (resp2.code == 0 && resp2.data.replies && resp2.data.replies.length > 0) {
                      replyBox.insertAdjacentHTML("beforeend", l._createSubReplyList(resp2.data.replies, resp2.data.replies.length, true, rootid, null, false));
                      nextPage2(resp2.data.cursor.max_floor);
                    }
                  });
                } else {
                  fixEmojiPosition(replyBox);
                  replyBox.querySelector(\`div[data-id="\${selfRpid}"]\`).style.cssText = \`
                            background: linear-gradient(45deg, rgba(115,108,231,0.13) 0%, rgba(0,161,214,0.13) 67%, rgba(0,212,255,0.13) 100%);
                            border-radius: 15px;
                            margin-right: 15px;\`;
                }
              };
              var nextPage = nextPage2;
              replyBox.innerHTML = l._createSubReplyList(resp.data.replies, resp.data.replies.length, true, rootid, null, false);
              l._registerEvent(container);
              container.className = "comment-dialog-container";
              fixEmojiPosition(replyBox);
              nextPage2(resp.data.cursor.max_floor);
            }
          });
        });
        n.off("click.operation", ".spot");
        n.on("click.operation", ".spot", function(e2) {
          let operalist = this.parentNode.getElementsByClassName("opera-list")[0];
          if (l.lastClickOperation != this || operalist && operalist.style.display == "none") {
            \$(".opera-list").hide(), \$(this).siblings(".opera-list").show(), e2.stopPropagation(), \$(this).hasClass("more-operation") && (e2 = +\$(this).parents(".reply-wrap:eq(0)").attr("data-id"));
            l.lastClickOperation = this;
          } else
            operalist && (operalist.style.display = "none");
        });
        n.on("click.image-exhibition", ".image-item-img", function(e2) {
          const src = this.src;
          const srcs = [];
          this.parentElement?.parentElement?.querySelectorAll("img").forEach((d) => {
            srcs.push(d.src);
          });
          srcs.length || srcs.push(src);
          previewImage || (previewImage = new PreviewImage());
          previewImage.value(srcs, this.parentElement?.classList.contains("vertical"), srcs.indexOf(src));
        });
      };
    }
    _resolveJump() {
      Feedback.prototype._resolveJump = function(str, jumpUrl) {
        var jumpUrlSortKeyList = [];
        for (var item in jumpUrl) {
          if (item.startsWith("http")) {
            jumpUrlSortKeyList.unshift(item);
          } else {
            jumpUrlSortKeyList.push(item);
          }
        }
        for (var _i = 0, _jumpUrlSortKeyList = jumpUrlSortKeyList; _i < _jumpUrlSortKeyList.length; _i++) {
          var jumpKey = _jumpUrlSortKeyList[_i];
          if (str.includes(jumpKey)) {
            var _jumpInfo\$extra;
            var jumpInfo = jumpUrl[jumpKey];
            var img = jumpInfo.prefix_icon ? '<img src="' + jumpInfo.prefix_icon + '" class="jump-img"/>' : "";
            var content = jumpKey;
            if ((_jumpInfo\$extra = jumpInfo.extra) !== null && _jumpInfo\$extra !== void 0 && _jumpInfo\$extra.is_word_search) {
              continue;
            } else {
              var url = jumpInfo.pc_url ? jumpInfo.pc_url : jumpKey.indexOf("http") === 0 ? jumpKey : this._createLinkById(jumpKey);
              var res = img + (jumpInfo.state === 0 ? '<a href="' + url + '" data-report="' + this.jumpReportIndex + '" class="comment-jump-url" target="_blank">' + content + "</a>" : content);
              var reg = new RegExp(jumpKey.replace(/\\?/, "\\\\?"), "ig");
              try {
                var regStr = jumpKey.replace(/\\(/g, "\\\\(").replace(/\\)/g, "\\\\)").replace(/\\?/, "\\\\?");
                var reg = new RegExp(regStr, "ig");
                str = str.replace(reg, res);
              } catch (e) {
              }
            }
            this.jumpReport[this.jumpReportIndex] = jumpInfo.click_report;
            this.jumpReportIndex++;
          }
        }
        return BV2avAll(str);
      };
    }
    /** 评论图片 */
    _resolvePictures() {
      Feedback.prototype._resolvePictures = function(content) {
        const pictureList = [];
        if (content) {
          if (content.rich_text?.note?.images) {
            content.pictures || (content.pictures = []);
            content.rich_text.note.images.forEach((d) => {
              content.pictures.push({
                img_src: d,
                click_url: content.rich_text.note.click_url
              });
            });
          }
          if (content.pictures && content.pictures.length) {
            pictureList.push(\`<div class="image-exhibition">\`);
            content.pictures.forEach((d) => {
              const type = d.img_width >= d.img_height ? "horizontal" : "vertical";
              const extraLong = d.img_width / d.img_height >= 3 || d.img_height / d.img_width >= 3;
              pictureList.push(
                '<div class="image-item-wrap ',
                type,
                \`\${extraLong ? "extraLong" : ""}\`,
                '"><img class="image-item-img" src="',
                d.img_src + "@.webp",
                \`"></div>\`
              );
            });
            pictureList.push(\`</div>\`);
          }
        }
        return pictureList.join("");
      };
    }
  };
  var Comment = _Comment;
  __publicField(Comment, "commentJumpUrlTitle", false);

  // src/core/ui/like.ts
  init_tampermonkey();

  // src/io/api-like.ts
  init_tampermonkey();
  async function apiLike(aid, bili_jct, like = false) {
    const response = await fetch(URLS.LIKE, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: \`aid=\${aid}&like=\${like ? 1 : 2}&csrf=\${bili_jct}\`,
      credentials: "include"
    });
    const json = await response.json();
    return jsonCheck(json);
  }

  // src/io/api-like-has.ts
  init_tampermonkey();
  async function apiLikeHas(aid) {
    const response = await fetch(objUrl(URLS.HAS_LIKE, { aid }), {
      credentials: "include"
    });
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/core/quickLogin.ts
  init_tampermonkey();
  function biliQuickLogin() {
    window.biliQuickLogin ? window.biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
  }

  // src/core/ui/like.ts
  var Like = class extends HTMLSpanElement {
    liked = false;
    number = 0;
    constructor() {
      super();
      this.classList.add("ulike");
      this.update();
      this.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (uid) {
          apiLike(BLOD.aid, getCookies().bili_jct, !this.liked).then(() => {
            this.liked ? this.number-- : this.number++;
            this.toggle();
          }).catch((e) => {
            toast.error("点赞出错！", e)();
          });
        } else {
          biliQuickLogin();
        }
      });
    }
    /** 初始化节点 */
    init() {
      if (uid) {
        apiLikeHas(BLOD.aid).then((d) => {
          this.liked = d === 1 ? true : false;
          this.update();
        }).catch((e) => {
          debug.error("获取点赞情况失败", e);
        });
      }
      addCss(".ulike {cursor: pointer;}.ulike svg{vertical-align: middle;margin-right: 10px;transform: translateY(-1px);}", \`ulike\${"caecec5"}\`);
    }
    /** 更新点赞数 */
    get likes() {
      return this.number;
    }
    set likes(v) {
      this.number = v;
      this.update();
    }
    toggle() {
      this.liked = !this.liked;
      this.update();
    }
    update() {
      this.innerHTML = (this.liked ? svg.like : svg.dislike) + "点赞 " + unitFormat(this.number);
    }
  };
  customElements.get(\`like-\${"caecec5"}\`) || customElements.define(\`like-\${"caecec5"}\`, Like, { extends: "span" });

  // src/css/uplist.css
  var uplist_default = ".up-info-m .up-card-box {\\r\\n    white-space: nowrap;\\r\\n    overflow: auto;\\r\\n}\\r\\n\\r\\n.up-info-m .up-card {\\r\\n    display: inline-block;\\r\\n    margin-top: 10px;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar img {\\r\\n    cursor: pointer;\\r\\n    width: 40px;\\r\\n    height: 40px;\\r\\n    border-radius: 50%;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar {\\r\\n    position: relative;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar .info-tag {\\r\\n    position: absolute;\\r\\n    background: #fff;\\r\\n    border: 1px solid #fb7299;\\r\\n    border-radius: 2px;\\r\\n    display: inline-block;\\r\\n    font-size: 12px;\\r\\n    color: #fb7299;\\r\\n    padding: 0 3px;\\r\\n    top: -10px;\\r\\n    right: -10px;\\r\\n    white-space: nowrap;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar {\\r\\n    width: 60px;\\r\\n    height: 30px;\\r\\n    display: -ms-flexbox;\\r\\n    display: flex;\\r\\n    -ms-flex-pack: center;\\r\\n    justify-content: center;\\r\\n    -ms-flex-align: start;\\r\\n    align-items: flex-start;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar .name-text {\\r\\n    font-family: PingFangSC-Regular, sans-serif;\\r\\n    line-height: 30px;\\r\\n    color: #222;\\r\\n    word-break: break-all;\\r\\n    overflow: hidden;\\r\\n    text-overflow: ellipsis;\\r\\n    display: -webkit-box;\\r\\n    -webkit-line-clamp: 2;\\r\\n    -webkit-box-orient: vertical;\\r\\n    white-space: nowrap;\\r\\n}\\r\\n\\r\\n.up-info-m .avatar .name-text.is-vip,\\r\\n.up-info-m .avatar .name-text:hover {\\r\\n    color: #fb7299;\\r\\n}\\r\\n\\r\\n.up-info-m .title {\\r\\n    display: block;\\r\\n    font-size: 14px;\\r\\n    margin-right: 80px;\\r\\n    color: #525659;\\r\\n    overflow: hidden;\\r\\n    height: 24px;\\r\\n    font-weight: 400;\\r\\n    padding: 8px 0;\\r\\n}\\r\\n\\r\\n.up-card-box::-webkit-scrollbar {\\r\\n    width: 7px;\\r\\n    height: 7px;\\r\\n}\\r\\n\\r\\n.up-card-box::-webkit-scrollbar-track {\\r\\n    border-radius: 4px;\\r\\n    background-color: #EEE;\\r\\n}\\r\\n\\r\\n.up-card-box::-webkit-scrollbar-thumb {\\r\\n    border-radius: 4px;\\r\\n    background-color: #999;\\r\\n}";

  // src/html/av.html
  var av_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta charset="utf-8" />\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords"\\r\\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\\r\\n        title="哔哩哔哩" />\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" />\\r\\n    <style type="text/css">\\r\\n        #bofqi .player {\\r\\n            width: 980px;\\r\\n            height: 620px;\\r\\n            display: block;\\r\\n        }\\r\\n\\r\\n        @media screen and (min-width:1400px) {\\r\\n\\r\\n            #bofqi .player {\\r\\n                width: 1160px;\\r\\n                height: 720px\\r\\n            }\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container has-menu"></div>\\r\\n    <div id="video-page-app"></div>\\r\\n    <div id="app" data-server-rendered="true"></div>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n    <script type="text/javascript">\\r\\n        window.getInternetExplorerVersion = function () {\\r\\n            var e = -1; if ("Microsoft Internet Explorer" == navigator.appName) {\\r\\n                var r = navigator.userAgent;\\r\\n                null != new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r) && (e = parseFloat(RegExp.\$1))\\r\\n            }\\r\\n            return e\\r\\n        };\\r\\n        function getQueryString(e) {\\r\\n            var r = new RegExp("(^|&)" + e + "=([^&]*)(&|\$)"),\\r\\n                i = window.location.search.substr(1).match(r);\\r\\n            return null != i ? unescape(i[2]) : null\\r\\n        }\\r\\n        window.commentAgent = { seek: t => window.player && window.player.seek(t) };\\r\\n    <\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\\r\\n        crossorigin=""><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\\r\\n        crossorigin=""><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\\r\\n        crossorigin=""><\\/script>\\r\\n    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/json/sort.txt
  var sort_default = '[{name:"首页",route:"/",tid:"",locid:23,sub:[]},{name:"动画",route:"douga",tid:1,locid:52,count:"",subMenuSize:162,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2507,leftId:2452,rightId:2453},sub:[{name:"MAD·AMV",route:"mad",tid:24,ps:15,rps:10,ad:{active:!0,dataLocId:151},desc:"具有一定制作程度的动画或静画的二次创作视频",url:"//www.bilibili.com/video/douga-mad-1.html"},{name:"MMD·3D",route:"mmd",tid:25,ps:15,rps:10,ad:{active:!0,dataLocId:152},desc:"使用MMD（MikuMikuDance）和其他3D建模类软件制作的视频",url:"//www.bilibili.com/video/douga-mmd-1.html"},{name:"短片·手书·配音",route:"voice",tid:47,ps:15,rps:10,desc:"追求创新并具有强烈特色的短片、手书（绘）及ACG相关配音",url:"//www.bilibili.com/video/douga-voice-1.html"},{name:"手办·模玩",route:"garage_kit",tid:210,ps:15,rps:10,desc:"手办模玩的测评、改造或其他衍生内容",url:""},{name:"特摄",route:"tokusatsu",tid:86,ps:15,rps:10,desc:"特摄相关衍生视频",url:"//www.bilibili.com/video/cinephile-tokusatsu.html"},{name:"综合",route:"other",tid:27,ps:15,rps:10,ad:{active:!0,dataLocId:153},desc:"以动画及动画相关内容为素材，包括但不仅限于音频替换、杂谈、排行榜等内容",url:"//www.bilibili.com/video/douga-else-1.html"}]},{name:"番剧",route:"anime",tid:13,url:"//www.bilibili.com/anime/",takeOvered:!0,count:"",subMenuSize:172,combination:!0,sub:[{name:"连载动画",tid:33,route:"serial",desc:"当季连载的动画番剧",url:"//www.bilibili.com/video/bangumi-two-1.html"},{name:"完结动画",tid:32,route:"finish",desc:"已完结的动画番剧合集",url:"//www.bilibili.com/video/part-twoelement-1.html"},{name:"资讯",tid:51,route:"information",desc:"动画番剧相关资讯视频",url:"//www.bilibili.com/video/douga-else-information-1.html"},{name:"官方延伸",tid:152,route:"offical",desc:"动画番剧为主题的宣传节目、采访视频，及声优相关视频",url:"//www.bilibili.com/video/bagumi_offical_1.html"},{name:"新番时间表",url:"//www.bilibili.com/anime/timeline/",desc:""},{name:"番剧索引",url:"//www.bilibili.com/anime/index/",desc:""}]},{name:"国创",tid:167,route:"guochuang",url:"//www.bilibili.com/guochuang/",takeOvered:!0,count:"",subMenuSize:214,combination:!0,sub:[{name:"国产动画",tid:153,route:"chinese",desc:"我国出品的PGC动画",url:"//www.bilibili.com/video/bangumi_chinese_1.html"},{name:"国产原创相关",tid:168,route:"original",desc:"",url:"//www.bilibili.com/video/guochuang-fanvid-1.html"},{name:"布袋戏",tid:169,route:"puppetry",desc:"",url:"//www.bilibili.com/video/glove-puppetry-1.html"},{name:"动态漫·广播剧",tid:195,route:"motioncomic",desc:"",url:""},{name:"资讯",tid:170,route:"information",desc:"",url:"//www.bilibili.com/video/guochuang-offical-1.html"},{name:"新番时间表",url:"//www.bilibili.com/guochuang/timeline/",desc:""},{name:"国产动画索引",url:"//www.bilibili.com/guochuang/index/",desc:""}]},{name:"音乐",route:"music",tid:3,locid:58,count:"",subMenuSize:268,slider:{width:620,height:220},viewTag:!0,customComponent:{name:"Energy",titleId:2511,leftId:2462,rightId:3131,rightType:"slide"},sub:[{name:"原创音乐",route:"original",tid:28,ps:15,rps:10,viewHotTag:!0,ad:{active:!0,dataLocId:243},dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"原创歌曲及纯音乐，包括改编、重编曲及remix",url:"//www.bilibili.com/video/music-original-1.html"},{name:"翻唱",route:"cover",tid:31,ps:15,rps:10,ad:{active:!0,dataLocId:245},viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"对曲目的人声再演绎视频",url:"//www.bilibili.com/video/music-Cover-1.html"},{name:"演奏",route:"perform",tid:59,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"乐器和非传统乐器器材的演奏作品",url:"//www.bilibili.com/video/music-perform-1.html"},{name:"VOCALOID·UTAU",route:"vocaloid",tid:30,ps:15,rps:10,viewHotTag:!0,ad:{active:!0,dataLocId:247},dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"以VOCALOID等歌声合成引擎为基础，运用各类音源进行的创作",url:"//www.bilibili.com/video/music-vocaloid-1.html"},{name:"音乐现场",route:"live",tid:29,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"音乐表演的实况视频，包括官方/个人拍摄的综艺节目、音乐剧、音乐节、演唱会等",url:"//www.bilibili.com/video/music-oped-1.html"},{name:"MV",route:"mv",tid:193,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"为音乐作品配合拍摄或制作的音乐录影带（Music Video），以及自制拍摄、剪辑、翻拍MV",url:"//www.bilibili.com/video/music-coordinate-1.html"},{name:"乐评盘点",route:"commentary",tid:243,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"音乐类新闻、盘点、点评、reaction、榜单、采访、幕后故事、唱片开箱等",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音乐教学",route:"tutorial",tid:244,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"以音乐教学为目的的内容",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音乐综合",route:"other",tid:130,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"所有无法被收纳到其他音乐二级分区的音乐类视频",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音频",customZone:"Audio",route:"audio",url:"//www.bilibili.com/audio/home?musicType=music"},{name:"说唱",url:"//www.bilibili.com/v/rap"}]},{name:"舞蹈",route:"dance",tid:129,locid:64,count:"",subMenuSize:172,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2513,leftId:2472,rightId:2473},sub:[{name:"宅舞",route:"otaku",tid:20,ps:15,rps:10,ad:{active:!0,dataLocId:249},desc:"与ACG相关的翻跳、原创舞蹈",url:"//www.bilibili.com/video/dance-1.html"},{name:"街舞",route:"hiphop",tid:198,ps:15,rps:10,ad:{active:!0,dataLocId:251},desc:"收录街舞相关内容，包括赛事现场、舞室作品、个人翻跳、FREESTYLE等",url:""},{name:"明星舞蹈",route:"star",tid:199,ps:15,rps:10,desc:"国内外明星发布的官方舞蹈及其翻跳内容",url:""},{name:"中国舞",route:"china",tid:200,ps:15,rps:10,ad:{active:!0,dataLocId:253},desc:"传承中国艺术文化的舞蹈内容，包括古典舞、民族民间舞、汉唐舞、古风舞等",url:""},{name:"舞蹈综合",route:"three_d",tid:154,ps:15,rps:10,desc:"收录无法定义到其他舞蹈子分区的舞蹈视频",url:""},{name:"舞蹈教程",route:"demo",tid:156,ps:10,rps:6,desc:"镜面慢速，动作分解，基础教程等具有教学意义的舞蹈视频",url:"//www.bilibili.com/video/dance-demo-1.html"}]},{name:"游戏",route:"game",tid:4,locid:70,count:"",subMenuSize:240,slider:{width:470,height:216},viewTag:!0,customComponent:{name:"Energy",titleId:3761,leftId:3765,rightId:3775,rightType:"slide"},recommendCardType:"GameGroomBox",sub:[{name:"单机游戏",route:"stand_alone",tid:17,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:255},dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"以所有平台（PC、主机、移动端）的单机或联机游戏为主的视频内容，包括游戏预告、CG、实况解说及相关的评测、杂谈与视频剪辑等",url:"//www.bilibili.com/video/videogame-1.html"},{name:"电子竞技",route:"esports",tid:171,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:257},desc:"具有高对抗性的电子竞技游戏项目，其相关的赛事、实况、攻略、解说、短剧等视频。",url:"//www.bilibili.com/video/esports-1.html"},{name:"手机游戏",route:"mobile",tid:172,ps:10,rps:7,rankshow:1,viewHotTag:!0,desc:"以手机及平板设备为主要平台的游戏，其相关的实况、攻略、解说、短剧、演示等视频。",url:"//www.bilibili.com/video/mobilegame-1.html"},{name:"网络游戏",route:"online",tid:65,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:259},dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"由网络运营商运营的多人在线游戏，以及电子竞技的相关游戏内容。包括赛事、攻略、实况、解说等相关视频",url:"//www.bilibili.com/video/onlinegame-1.html"},{name:"桌游棋牌",route:"board",tid:173,ps:5,rps:3,rankshow:1,viewHotTag:!0,desc:"桌游、棋牌、卡牌对战等及其相关电子版游戏的实况、攻略、解说、演示等视频。",url:"//www.bilibili.com/video/boardgame-1.html"},{name:"GMV",route:"gmv",tid:121,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"由游戏素材制作的MV视频。以游戏内容或CG为主制作的，具有一定创作程度的MV类型的视频",url:"//www.bilibili.com/video/gmv-1.html"},{name:"音游",route:"music",tid:136,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"各个平台上，通过配合音乐与节奏而进行的音乐类游戏视频",url:"//www.bilibili.com/video/music-game-1.html"},{name:"Mugen",route:"mugen",tid:19,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"以Mugen引擎为平台制作、或与Mugen相关的游戏视频",url:"//www.bilibili.com/video/game-mugen-1.html"},{name:"游戏赛事",url:"//www.bilibili.com/v/game/match/",newIcon:!0}]},{name:"知识",route:"knowledge",tid:36,locid:76,count:"",subMenuSize:172,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2058,leftId:2047,rightId:2048},sub:[{name:"科学科普",route:"science",tid:201,ps:15,rps:10,ad:{active:!0,dataLocId:261},desc:"回答你的十万个为什么"},{name:"社科·法律·心理",route:"social_science",tid:124,ps:15,rps:10,ad:{active:!0,dataLocId:263},desc:"基于社会科学、法学、心理学展开或个人观点输出的知识视频"},{name:"人文历史",route:"humanity_history",tid:228,ps:15,rps:10,desc:"看看古今人物，聊聊历史过往，品品文学典籍"},{name:"财经商业",route:"business",tid:207,ps:15,rps:10,desc:"说金融市场，谈宏观经济，一起畅聊商业故事"},{name:"校园学习",route:"campus",tid:208,ps:15,rps:10,ad:{active:!0,dataLocId:265},desc:"老师很有趣，学生也有才，我们一起搞学习"},{name:"职业职场",route:"career",tid:209,ps:15,rps:10,desc:"职业分享、升级指南，一起成为最有料的职场人"},{name:"设计·创意",route:"design",tid:229,ps:15,rps:10,desc:"天马行空，创意设计，都在这里"},{name:"野生技能协会",route:"skill",tid:122,ps:15,rps:10,desc:"技能党集合，是时候展示真正的技术了"}]},{name:"科技",route:"tech",tid:188,locid:2977,count:"",subMenuSize:80,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2980,leftId:2978,rightId:2979},sub:[{name:"数码",route:"digital",tid:95,ps:15,rps:10,viewHotTag:!0,desc:"科技数码产品大全，一起来做发烧友",url:"#"},{name:"软件应用",route:"application",tid:230,ps:15,rps:10,viewHotTag:!0,desc:"超全软件应用指南",url:"#"},{name:"计算机技术",route:"computer_tech",tid:231,ps:15,rps:10,viewHotTag:!0,desc:"研究分析、教学演示、经验分享......有关计算机技术的都在这里",url:"#"},{name:"科工机械",route:"industry",tid:232,ps:15,rps:10,viewHotTag:!0,desc:"从小芯片到大工程，一起见证科工力量",url:"#"},{name:"极客DIY",route:"diy",tid:233,ps:15,rps:10,viewHotTag:!0,desc:"炫酷技能，极客文化，硬核技巧，准备好你的惊讶",url:"#"}]},{name:"运动",route:"sports",tid:234,locid:4639,isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4646,rightId:4652,rightType:"slide"},sub:[{name:"篮球·足球",route:"basketballfootball",tid:235,ps:15,rps:10,ad:{active:!0,dataLocId:4656},desc:"与篮球、足球相关的视频，包括但不限于篮足球赛事、教学、评述、剪辑、剧情等相关内容",url:"#"},{name:"健身",route:"aerobics",tid:164,ps:15,rps:10,desc:"与健身相关的视频，包括但不限于瑜伽、CrossFit、健美、力量举、普拉提、街健等相关内容",url:"//www.bilibili.com/video/fashion-body-1.html"},{name:"竞技体育",route:"athletic",tid:236,ps:15,rps:10,desc:"与竞技体育相关的视频，包括但不限于乒乓、羽毛球、排球、赛车等竞技项目的赛事、评述、剪辑、剧情等相关内容",url:"#"},{name:"运动文化",route:"culture",tid:237,ps:15,rps:10,desc:"与运动文化相关的视频，包络但不限于球鞋、球衣、球星卡等运动衍生品的分享、解读，体育产业的分析、科普等相关内容",url:"#"},{name:"运动综合",route:"comprehensive",tid:238,ps:15,rps:10,desc:"与运动综合相关的视频，包括但不限于钓鱼、骑行、滑板等日常运动分享、教学、Vlog等相关内容",url:"#"}]},{name:"汽车",route:"car",tid:223,locid:4428,isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4435,rightId:4441,rightType:"slide"},sub:[{name:"汽车生活",route:"life",tid:176,ps:15,rps:10,ad:{active:!0,dataLocId:4445},desc:"分享汽车及出行相关的生活体验类视频",url:"#"},{name:"汽车文化",route:"culture",tid:224,ps:15,rps:10,desc:"汽车改装、品牌历史、汽车设计、老爷车、汽车模型等",url:"#"},{name:"赛车",route:"racing",tid:245,ps:15,rps:10,desc:"F1等汽车运动相关",url:"#"},{name:"汽车极客",route:"geek",tid:225,ps:15,rps:10,desc:"汽车硬核达人聚集地，包括DIY造车、专业评测和技术知识分享",url:"#"},{name:"摩托车",route:"motorcycle",tid:240,ps:15,rps:10,desc:"骑士们集合啦",url:"#"},{name:"智能出行",route:"smart",tid:226,ps:15,rps:10,desc:"探索新能源汽车和未来智能出行的前沿阵地",url:"#"},{name:"购车攻略",route:"strategy",tid:227,ps:15,rps:10,desc:"丰富详实的购车建议和新车体验",url:"#"}]},{name:"生活",route:"life",tid:160,locid:88,count:"",subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2062,leftId:1674,rightId:1670},sub:[{name:"搞笑",route:"funny",tid:138,ps:15,rps:10,ad:{active:!0,dataLocId:273},desc:"各种沙雕有趣的搞笑剪辑，挑战，表演，配音等视频",url:"//www.bilibili.com/video/ent_funny_1.html",locid:4204,recommendId:4210,slider:{width:620,height:220},customComponent:{name:"Energy",leftId:4212,rightId:4218,rightType:"slide"}},{name:"家居房产",route:"home",tid:239,ps:15,rps:10,ad:{active:!0,dataLocId:275},desc:"与买房、装修、居家生活相关的分享",url:"#"},{name:"手工",route:"handmake",tid:161,ps:15,rps:10,desc:"手工制品的制作过程或成品展示、教程、测评类视频",url:"//www.bilibili.com/video/ent-handmake-1.html"},{name:"绘画",route:"painting",tid:162,ps:15,rps:10,desc:"绘画过程或绘画教程，以及绘画相关的所有视频",url:"//www.bilibili.com/video/ent-painting-1.html"},{name:"日常",route:"daily",tid:21,ps:15,rps:10,desc:"记录日常生活，分享生活故事",url:"//www.bilibili.com/video/ent-life-1.html"}]},{name:"美食",route:"food",tid:211,locid:4243,count:"",isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4258,rightId:4264},sub:[{name:"美食制作",route:"make",tid:76,ps:15,rps:10,ad:{active:!0,dataLocId:4268},desc:"学做人间美味，展示精湛厨艺",url:"#"},{name:"美食侦探",route:"detective",tid:212,ps:15,rps:10,desc:"寻找美味餐厅，发现街头美食",url:"#"},{name:"美食测评",route:"measurement",tid:213,ps:15,rps:10,desc:"吃货世界，品尝世间美味",url:"#"},{name:"田园美食",route:"rural",tid:214,ps:15,rps:10,desc:"品味乡野美食，寻找山与海的味道",url:"#"},{name:"美食记录",route:"record",tid:215,ps:15,rps:10,desc:"记录一日三餐，给生活添一点幸福感",url:"#"}]},{name:"动物圈",route:"animal",tid:217,locid:4365,count:"",isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4376,rightId:4381,rightType:"slide"},sub:[{name:"喵星人",route:"cat",tid:218,ps:15,rps:10,desc:"喵喵喵喵喵",url:"#",ad:{active:!0,dataLocId:4385}},{name:"汪星人",route:"dog",tid:219,ps:15,rps:10,desc:"汪汪汪汪汪",url:"#"},{name:"大熊猫",route:"panda",tid:220,ps:15,rps:10,desc:"芝麻汤圆营业中",url:"#"},{name:"野生动物",route:"wild_animal",tid:221,ps:15,rps:10,desc:"内有“猛兽”出没",url:"#"},{name:"爬宠",route:"reptiles",tid:222,ps:15,rps:10,desc:"鳞甲有灵",url:"#"},{name:"动物综合",route:"animal_composite",tid:75,ps:15,rps:10,desc:"收录除上述子分区外，其余动物相关视频以及非动物主体或多个动物主体的动物相关延伸内容",url:"#"}]},{name:"鬼畜",route:"kichiku",tid:119,locid:100,count:"",subMenuSize:182,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2509,leftId:2482,rightId:2483},sub:[{name:"鬼畜调教",route:"guide",tid:22,ps:15,rps:10,ad:{active:!0,dataLocId:285},desc:"使用素材在音频、画面上做一定处理，达到与BGM一定的同步感",url:"//www.bilibili.com/video/ent-Kichiku-1.html"},{name:"音MAD",route:"mad",tid:26,ps:15,rps:10,ad:{active:!0,dataLocId:287},desc:"使用素材音频进行一定的二次创作来达到还原原曲的非商业性质稿件",url:"//www.bilibili.com/video/douga-kichiku-1.html"},{name:"人力VOCALOID",route:"manual_vocaloid",tid:126,ps:15,rps:10,desc:"将人物或者角色的无伴奏素材进行人工调音，使其就像VOCALOID一样歌唱的技术",url:"//www.bilibili.com/video/kichiku-manual_vocaloid-1.html"},{name:"鬼畜剧场",route:"theatre",tid:216,ps:15,rps:10,desc:"使用素材进行人工剪辑编排的有剧情的作品"},{name:"教程演示",route:"course",tid:127,ps:10,rps:6,rightComponent:{name:"CmImgList",id:148},ad:{active:!0,dataLocId:289},hideDropdown:!1,desc:"鬼畜相关的教程演示",url:"//www.bilibili.com/video/kichiku-course-1.html"}]},{name:"时尚",route:"fashion",tid:155,locid:94,count:"",subMenuSize:124,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2515,leftId:2492,rightId:2493},sub:[{name:"美妆护肤",route:"makeup",tid:157,ps:15,rps:10,ad:{active:!0,dataLocId:279},desc:"彩妆护肤、美甲美发、仿妆、医美相关内容分享或产品测评",url:"//www.bilibili.com/video/fashion-makeup-fitness-1.html"},{name:"穿搭",route:"clothing",tid:158,ps:15,rps:10,ad:{active:!0,dataLocId:281},desc:"穿搭风格、穿搭技巧的展示分享，涵盖衣服、鞋靴、箱包配件、配饰（帽子、钟表、珠宝首饰）等",url:"//www.bilibili.com/video/fashion-clothing-1.html"},{name:"时尚潮流",route:"trend",tid:159,ps:15,rps:10,desc:"时尚街拍、时装周、时尚大片，时尚品牌、潮流等行业相关记录及知识科普",url:"#"}]},{name:"资讯",route:"information",tid:202,locid:4076,count:"",subMenuSize:60,slider:{width:620,height:220},viewTag:!1,sub:[{name:"热点",route:"hotspot",tid:203,ps:18,rps:10,desc:"全民关注的时政热门资讯"},{name:"环球",route:"global",tid:204,ps:18,rps:10,desc:"全球范围内发生的具有重大影响力的事件动态"},{name:"社会",route:"social",tid:205,ps:18,rps:10,desc:"日常生活的社会事件、社会问题、社会风貌的报道"},{name:"综合",route:"multiple",tid:206,ps:18,rps:10,desc:"除上述领域外其它垂直领域的综合资讯"}]},{name:"娱乐",route:"ent",tid:5,locid:82,count:"",subMenuSize:62,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2067,leftId:2065,rightId:2066},sub:[{name:"综艺",route:"variety",tid:71,ps:15,rps:10,ad:{active:!0,dataLocId:267},desc:"所有综艺相关，全部一手掌握！",url:"//www.bilibili.com/video/ent-variety-1.html"},{name:"娱乐杂谈",route:"talker",tid:241,ps:15,rps:10,ad:{active:!0,dataLocId:269},desc:"娱乐人物解读、娱乐热点点评、娱乐行业分析"},{name:"粉丝创作",route:"fans",tid:242,ps:15,rps:10,desc:"粉丝向创作视频"},{name:"明星综合",route:"celebrity",tid:137,ps:15,rps:10,desc:"娱乐圈动态、明星资讯相关"}]},{name:"影视",route:"cinephile",tid:181,locid:2211,count:"",subMenuSize:84,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2309,leftId:2307,rightId:2308},sub:[{name:"影视杂谈",route:"cinecism",tid:182,ps:15,rps:10,ad:{active:!0,dataLocId:2212},desc:"影视评论、解说、吐槽、科普等",url:"//www.bilibili.com/video/cinephile-cinecism.html"},{name:"影视剪辑",route:"montage",tid:183,ps:15,rps:10,ad:{active:!0,dataLocId:2213},desc:"对影视素材进行剪辑再创作的视频",url:"//www.bilibili.com/video/cinephile-montage.html"},{name:"短片",route:"shortfilm",tid:85,ps:15,rps:10,desc:"追求自我表达且具有特色的短片",url:"//www.bilibili.com/video/cinephile-shortfilm.html"},{name:"预告·资讯",route:"trailer_info",tid:184,ps:15,rps:10,ad:{active:!0,dataLocId:2214},desc:"影视类相关资讯，预告，花絮等视频",url:"//www.bilibili.com/video/cinephile-trailer-info.html"}]},{name:"纪录片",route:"documentary",tid:177,url:"//www.bilibili.com/documentary/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"人文·历史",tid:37,route:"history",dise:"",url:"//www.bilibili.com/video/doco-history.html"},{name:"科学·探索·自然",tid:178,route:"science",dise:"",url:"//www.bilibili.com/video/doco-science.html"},{name:"军事",tid:179,route:"military",dise:"",url:"//www.bilibili.com/video/doco-military.html"},{name:"社会·美食·旅行",tid:180,route:"travel",dise:"",url:"//www.bilibili.com/video/doco-travel.html"},{name:"纪录片索引",url:"//www.bilibili.com/documentary/index/"}]},{name:"电影",route:"movie",tid:23,url:"//www.bilibili.com/movie/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"华语电影",tid:147,route:"chinese",desc:"",url:"//www.bilibili.com/video/movie_chinese_1.html"},{name:"欧美电影",tid:145,route:"west",desc:"",url:"//www.bilibili.com/video/movie_west_1.html"},{name:"日本电影",tid:146,route:"japan",desc:"",url:"//www.bilibili.com/video/movie_japan_1.html"},{name:"其他国家",tid:83,route:"movie",desc:"",url:"//www.bilibili.com/video/movie-movie-1.html"},{name:"电影索引",url:"//www.bilibili.com/movie/index/"}]},{name:"电视剧",route:"tv",tid:11,url:"//www.bilibili.com/tv/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"国产剧",tid:185,route:"mainland",desc:"",url:"//www.bilibili.com/video/tv-mainland.html"},{name:"海外剧",tid:187,route:"overseas",desc:"",url:"//www.bilibili.com/video/tv-overseas.html"},{name:"电视剧索引",url:"//www.bilibili.com/tv/index/"}]},{name:"虚拟UP主",route:"virtual",locid:4735,count:"",isHide:!0,subMenuSize:60,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:4754,leftId:4756},sub:[{name:"游戏",route:"game",tid:4,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/game"},{name:"音乐",route:"music",tid:3,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/music"},{name:"动画",route:"douga",tid:1,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/douga"},{name:"其他",route:"other",tid:0,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/other"}]}]';

  // src/json/toview.json
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

  // src/utils/hook/webpack.ts
  init_tampermonkey();
  var arr = [];
  var param = [];
  var length;
  var _Webpack = class {
    backup = window.webpackJsonp;
    constructor() {
      _Webpack.load = true;
      Reflect.defineProperty(window, "webpackJsonp", {
        configurable: true,
        set: (v) => {
          typeof v === "function" && (this.backup = v);
          return true;
        },
        get: () => {
          return this.backup && ((chunkIds, moreModules, executeModules) => {
            const len = moreModules.length ?? length;
            if (len in arr) {
              const obj = arr[len];
              const pam = param[len];
              Object.entries(obj).forEach((d) => {
                let code = moreModules[d[0]];
                if (code) {
                  code = code.toString();
                  d[1].forEach((e) => code = e(code));
                  moreModules[d[0]] = new Function(pam[0], pam[1], pam[2], \`(\${code})(\${pam[0]},\${pam[1]},\${pam[2]})\`);
                } else {
                  length = len;
                }
              });
            }
            return this.backup(chunkIds, moreModules, executeModules);
          });
        }
      });
    }
  };
  var Webpack = _Webpack;
  __publicField(Webpack, "load", false);
  function webpackHook(len, pos, rpc, params = ["t", "e", "i"]) {
    Webpack.load || new Webpack();
    if (!arr[len]) {
      arr[len] = {};
      param[len] = params;
    }
    arr[len][pos] = arr[len][pos] || [];
    arr[len][pos].push((code) => rpc(code));
  }

  // src/page/bangumi.ts
  init_tampermonkey();

  // src/html/bangumi.html
  var bangumi_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta charset="utf-8" />\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords"\\r\\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\\r\\n        title="哔哩哔哩" />\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" />\\r\\n    <style type="text/css">\\r\\n        .new-entry {\\r\\n            display: none;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container has-menu"></div>\\r\\n    <div id="app" data-server-rendered="true" class="main-container"></div>\\r\\n    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"><\\/script>\\r\\n    <script>\\r\\n        window.__INITIAL_STATE__ = { activity: {}, app: false, area: 0, canReview: false, epId: -1, epInfo: {}, epList: [], epStat: { isPay: false, isVip: false, payPack: 0, status: 0, vipNeedPay: false }, isPlayerTrigger: false, loginInfo: { isLogin: false }, mdId: -1, mediaInfo: {}, mediaRating: {}, miniOn: 0, newestEp: {}, paster: {}, payMent: {}, payPack: {}, playerRecomList: [], pubInfo: {}, recomList: [], rightsInfo: {}, seasonFollowed: false, seasonList: [], seasonStat: { coins: 0, danmakus: 0, favorites: 0, views: 0 }, special: false, spending: 0, sponsorTotal: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } }, sponsorTotalCount: 0, sponsorWeek: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } }, ssId: -1, ssStat: { isPay: false, isVip: false, payPack: 0, status: 0, vipNeedPay: false }, upInfo: {}, userCoined: false, userLongReview: {}, userScore: 0, userShortReview: {}, userStat: { error: true, follow: 0, loaded: true, pay: 0, payPackPaid: 0, sponsor: 0, vipInfo: { due_date: 0, status: 0, type: 0 }, watchProgress: { lastEpId: -1, lastEpIndex: "", lastTime: 0 } }, ver: {} }; (function () { Reflect.deleteProperty(window, "webpackJsonp"); Reflect.deleteProperty(window, "_babelPolyfill"); var s; (s = document.currentScript || document.scripts[document.scripts.length - 1]).parentNode.removeChild(s); }());\\r\\n    <\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"\\r\\n        crossorigin=""><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"\\r\\n        crossorigin=""><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/io/api-global-view.ts
  init_tampermonkey();
  var ApiGlobalOgvView = class extends ApiSign {
    constructor(data, server = "api.global.bilibili.com") {
      super(URLS.GLOBAL_OGV_VIEW.replace("api.global.bilibili.com", server), "7d089525d3611b1c");
      this.data = data;
      this.data = Object.assign({
        build: 108003,
        mobi_app: "bstar_a",
        s_locale: "zh_SG"
      }, data);
    }
    async getDate() {
      const response = await fetch(this.sign());
      const json = await response.json();
      return jsonCheck(json).result;
    }
  };

  // src/io/api-player.ts
  init_tampermonkey();
  var PlayerResponse = class {
    constructor(aid, cid, has_next = false) {
      this.aid = aid;
      this.cid = cid;
      this.has_next = has_next;
    }
    allow_bp = false;
    answer_status = 0;
    bgm_info;
    block_time = 0;
    fawkes = { config_version: 18964, ff_version: 21289 };
    guide_attention = [];
    ip_info = { city: "", country: "中国", ip: "", province: "", zone_id: 0, zone_ip: "" };
    is_owner = false;
    is_ugc_pay_preview = false;
    jump_card = [];
    last_play_cid = 0;
    last_play_time = 0;
    level_info = { current_level: 0, current_min: 0, current_exp: 0, next_exp: 0, level_up: 0 };
    login_mid = 0;
    login_mid_hash = "";
    max_limit = 1e3;
    name = "";
    no_share = false;
    now_time = (/* @__PURE__ */ new Date()).getTime() / 1e3;
    online_count = 1;
    online_switch = { enable_gray_dash_playback: "500", new_broadcast: "1", realtime_dm: "1", subtitle_submit_switch: "1" };
    operation_card = [];
    options = { is_360: false, without_vip: false };
    page_no = 1;
    pcdn_loader = {
      dash: {
        labels: { pcdn_video_type: "dash", pcdn_stage: "release", pcdn_group: "nil", pcdn_version: "nil", pcdn_vendor: "nil" }
      },
      flv: {
        labels: { pcdn_video_type: "flv", pcdn_stage: "release", pcdn_group: "nil", pcdn_version: "nil", pcdn_vendor: "nil" }
      }
    };
    permission = 0;
    preview_toast = "为创作付费，购买观看完整视频|购买观看";
    role = "";
    show_switch = { long_progress: false };
    subtitle = { allow_submit: false, lan: "", lan_doc: "", subtitles: [] };
    toast_block = false;
    view_points = [];
    vip = {
      avatar_subscript: 0,
      avatar_subscript_url: "",
      due_date: 0,
      label: {
        bg_color: "",
        bg_style: 0,
        border_color: "",
        img_label_uri_hans: "",
        img_label_uri_hans_static: "",
        img_label_uri_hant: "",
        img_label_uri_hant_static: "",
        label_theme: "",
        path: "",
        text: "",
        text_color: "",
        use_img_label: false
      },
      nickname_color: "",
      role: 0,
      status: 0,
      theme_type: 0,
      tv_vip_pay_type: 0,
      tv_vip_status: 0,
      type: 0,
      vip_pay_type: 0
    };
  };

  // src/io/api-season-section.ts
  init_tampermonkey();
  var ApiSeasonSection = class {
    fetch;
    constructor(season_id) {
      this.fetch = fetch(objUrl(URLS.SEASON_STATUS, { season_id }), { credentials: "include" });
    }
    async getDate() {
      const response = await this.fetch;
      const json = await response.json();
      return jsonCheck(json).result;
    }
    async toEpisodes() {
      const res = await this.getDate();
      return res.main_section.episodes.concat(...res.section.map((d) => d.episodes)).map((d) => {
        d.ep_id = d.id;
        d.episode_status = d.status;
        d.index = d.title;
        d.index_title = d.long_title;
        d.premiere = Boolean(d.is_premiere);
        return d;
      });
    }
  };

  // src/io/api-season-status.ts
  init_tampermonkey();
  async function apiSeasonStatus(data) {
    const response = await fetch(objUrl(URLS.SEASON_STATUS, data), { credentials: "include" });
    const json = await response.json();
    return jsonCheck(json).result;
  }

  // src/io/api-stat.ts
  init_tampermonkey();
  async function apiStat(aid) {
    const response = await fetch(objUrl(URLS.STAT, { aid }));
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/io/api-tag-info.ts
  init_tampermonkey();
  async function apiTagInfo(tag_name) {
    const response = await fetch(objUrl(URLS.TAG_INFO, { tag_name }));
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/io/api-tag-top.ts
  init_tampermonkey();
  async function apiTagTop(tid) {
    const response = await fetch(objUrl(URLS.TAG_TOP, { tid }));
    const json = await response.json();
    return jsonCheck(json).data;
  }

  // src/page/bangumi.ts
  var PageBangumi = class extends Page {
    like;
    get ssid() {
      return BLOD.ssid;
    }
    set ssid(v) {
      BLOD.ssid = v;
    }
    get epid() {
      return BLOD.epid;
    }
    set epid(v) {
      BLOD.epid = v;
    }
    get th() {
      return BLOD.th;
    }
    set th(v) {
      BLOD.th = v;
    }
    get limit() {
      return BLOD.limit;
    }
    set limit(v) {
      BLOD.limit = v;
    }
    get pgc() {
      return BLOD.pgc;
    }
    set pgc(v) {
      BLOD.pgc = v;
    }
    /** 字幕暂存 */
    subtitles = [];
    constructor() {
      super(bangumi_default);
      Reflect.deleteProperty(window, "__INITIAL_STATE__");
      this.like = new Like();
      new Comment();
      window.__Iris__ = true;
      this.pgc = true;
      location.href.replace(/[sS][sS]\\d+/, (d) => this.ssid = Number(d.substring(2)));
      location.href.replace(/[eE][pP]\\d+/, (d) => this.epid = Number(d.substring(2)));
      this.updateDom();
      this.recommend();
      this.seasonCount();
      user.userStatus.videoLimit?.status && this.videoLimit();
      this.related();
      this.initialState();
      this.enLike();
      this.episodeData();
      Header.primaryMenu();
      Header.banner();
    }
    /** 修复：末尾番剧推荐 */
    recommend() {
      xhrHook("api.bilibili.com/pgc/web/recommend/related/recommend", (args) => {
        args[1] = args[1].replace("web/recommend", "season/web");
      }, (r) => {
        try {
          const result = jsonCheck(r.response);
          result.result = result.data.season;
          r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
          propertyHook.modify(window, "getPlayerExtraParams", (d) => {
            const res = d();
            res.recommend = result.result;
            return () => res;
          });
        } catch (e) {
        }
      });
    }
    /** 修复追番数据 */
    seasonCount() {
      xhrHook("bangumi.bilibili.com/ext/web_api/season_count", (args) => {
        args[1] = args[1].replace("bangumi.bilibili.com/ext/web_api/season_count", "api.bilibili.com/pgc/web/season/stat");
      }, (r) => {
        try {
          const result = jsonCheck(r.response);
          result.result.favorites = result.result.follow;
          r.responseType === "json" ? r.response = result : r.response = r.responseText = JSON.stringify(result);
        } catch (e) {
        }
      }, true);
    }
    /** 解除区域限制（重定向模式） */
    videoLimit() {
      xhrHook("bangumi.bilibili.com/view/web_api/season/user/status", void 0, (res) => {
        try {
          const data = res.responseType === "json" ? res.response : JSON.parse(res.response);
          data.result.area_limit = 0;
          data.result.ban_area_show = 0;
          res.responseType === "json" || (res.response = res.responseText = JSON.stringify(data));
        } catch (e) {
        }
      }, false);
    }
    /** 修复相关视频推荐 接口来自md页面 */
    related() {
      const related = {};
      xhrHook.async("x/web-interface/archive/related", () => window.__INITIAL_STATE__?.mediaInfo?.title, async () => {
        let response = { code: 0, data: [], message: "0" };
        if (related[window.__INITIAL_STATE__?.mediaInfo?.title]) {
          response.data = related[window.__INITIAL_STATE__.mediaInfo.title];
        } else {
          await apiTagInfo(window.__INITIAL_STATE__.mediaInfo.title).then((d) => {
            return apiTagTop(d.tag_id);
          }).then((d) => {
            response.data = related[window.__INITIAL_STATE__.mediaInfo.title] = d;
          }).catch((e) => {
            debug.error("相关视频推荐", e);
          });
        }
        return { response, responseType: "json", responseText: JSON.stringify(response) };
      }, false);
    }
    /** 初始化\`__INITIAL_STATE__\` */
    initialState() {
      const data = this.epid ? { ep_id: this.epid } : { season_id: this.ssid };
      Promise.allSettled([apiBangumiSeason(data), apiSeasonStatus(data), new Promise((r) => poll(() => this.initilized, r))]).then((d) => d.map((d2) => d2.status === "fulfilled" && d2.value)).then(async (d) => {
        const t = window.__INITIAL_STATE__;
        const bangumi = d[0];
        const status = d[1];
        if (status) {
          const i = status.progress ? status.progress.last_ep_id : -1, n = status.progress ? status.progress.last_ep_index : "", s = status.progress ? status.progress.last_time : 0, o = status.vip_info || {};
          !this.epid && i > 0 && (this.epid = i);
          t.userStat = {
            loaded: true,
            error: void 0 === status.pay,
            follow: status.follow || 0,
            pay: status.pay || 0,
            payPackPaid: status.pay_pack_paid || 0,
            sponsor: status.sponsor || 0,
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
          status.paster && (t.paster = status.paster || {});
          this.limit = status.area_limit || 0;
          user.userStatus.videoLimit.status || (t.area = this.limit);
          t.seasonFollowed = 1 === status.follow;
        }
        if (bangumi) {
          let loopTitle2 = function() {
            poll(() => document.title != title, () => {
              document.title = title;
              if (document.title != title)
                loopTitle2();
            });
          };
          var loopTitle = loopTitle2;
          if (bangumi.season_id && bangumi.total_ep && !bangumi.episodes?.[0]) {
            await new ApiSeasonSection(bangumi.season_id).toEpisodes().then((d2) => {
              bangumi.episodes = d2;
            }).catch((e) => {
              debug.warn("episodes数据获取出错", e);
            });
          }
          const i = JSON.parse(JSON.stringify(bangumi));
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
          if (user.userStatus.bangumiEplist)
            delete i.bkg_cover;
          user.userStatus.videoLimit.status && bangumi.rights && (bangumi.rights.watch_platform = 0);
          t.mediaInfo = i;
          t.mediaInfo.bkg_cover && (t.special = true);
          t.ssId = bangumi.season_id || -1;
          t.mdId = bangumi.media_id;
          t.epInfo = this.epid && bangumi.episodes.find((d2) => d2.ep_id == this.epid) || bangumi.episodes[0] || {};
          t.epList = bangumi.episodes || [];
          t.seasonList = bangumi.seasons || [];
          t.upInfo = bangumi.up_info || {};
          t.rightsInfo = bangumi.rights || {};
          t.app = 1 === t.rightsInfo.watch_platform;
          t.pubInfo = bangumi.publish || {};
          t.newestEp = bangumi.newest_ep || {};
          t.mediaRating = bangumi.rating || {};
          t.payPack = bangumi.pay_pack || {};
          t.payMent = bangumi.payment || {};
          t.activity = bangumi.activity || {};
          t.epStat = this.setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
          t.epId = Number(this.epid || t.epInfo.ep_id);
          this.ssid = t.ssId;
          this.epid = t.epId;
          if (t.upInfo.mid == /** Classic_Anime */
          677043260 || t.upInfo.mid == /** Anime_Ongoing */
          688418886) {
            this.th = true;
          }
          const title = this.setTitle(t.epInfo.index, t.mediaInfo.title, this.Q(t.mediaInfo.season_type), true);
          loopTitle2();
          videoInfo.bangumiSeason(bangumi);
        } else {
          return this.initGlobal();
        }
      }).catch((e) => {
        toast.error("初始化bangumi数据出错！", e)();
      }).finally(() => {
        if (window.__INITIAL_STATE__.special) {
          addCss("#bili-header-m > #banner_link,#bili-header-m > .bili-wrapper{ display: none; }");
        }
        if (document.compatMode === "BackCompat")
          addCss(".header-info > .count-wrapper {height: 18px !important;}");
      });
    }
    /** epStat，用于判定ep状态。同样由于原生缺陷，ep_id初始化时不会更新本信息，需要主动更新 */
    setEpStat(status, pay, payPackPaid, loginInfo) {
      var s = 0, o = false, a = (1 === loginInfo.vipType || 2 === loginInfo.vipType) && 1 === loginInfo.vipStatus, r = "number" == typeof payPackPaid ? payPackPaid : -1;
      return 1 === pay ? s = 0 : 6 === status || 7 === status ? s = loginInfo.isLogin ? a ? 0 : 1 : 2 : 8 === status || 9 === status ? (s = loginInfo.isLogin ? 1 : 2, o = true) : 12 === status ? s = loginInfo.isLogin ? 1 === r ? 0 : 1 : 2 : 13 === status && (s = loginInfo.isLogin ? a ? 0 : 1 : 2), {
        status: s,
        isPay: 6 === status || 7 === status || 8 === status || 9 === status || 12 === status || 13 === status,
        isVip: a,
        vipNeedPay: o,
        payPack: r
      };
    }
    /** 更新标题 */
    setTitle(t, e, i, n) {
      var s = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4], o = "";
      if (i = void 0 === i ? "番剧" : i, e && i)
        if (s && t) {
          var a = this.V(t, i);
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
    Q(t, e) {
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
    V(t, e) {
      var i = Number(t), n = 1 === e || 4 === e || "番剧" === e || "国创" === e ? "话" : "集";
      return isNaN(i) ? t : "第".concat(i).concat(n);
    }
    /** 尝试东南亚接口 */
    async initGlobal() {
      const data = this.epid ? { ep_id: this.epid } : { season_id: this.ssid };
      Object.assign(data, { access_key: user.userStatus.accessKey.token });
      const d = await new ApiGlobalOgvView(data, user.userStatus.videoLimit.th).getDate();
      networkMock();
      await new Promise((r) => poll(() => window.__INITIAL_STATE__, r));
      const t = window.__INITIAL_STATE__;
      const i = JSON.parse(JSON.stringify(d));
      const episodes = d.modules.reduce((s, d_1) => {
        d_1.data.episodes.forEach((d_2) => {
          s.push({
            aid: d_2.aid,
            cid: d_2.id,
            cover: d_2.cover,
            ep_id: d_2.id,
            episode_status: d_2.status,
            from: d_2.from,
            index: d_2.title,
            index_title: d_2.title_display,
            subtitles: d_2.subtitles
          });
          if (d_2.subtitles) {
            this.subtitles[d_2.id] = [];
            d_2.subtitles.forEach((d2) => {
              this.subtitles[d_2.id].push({
                ai_status: 2,
                ai_type: Number(d2.is_machine),
                id: d2.id,
                id_str: String(d2.id),
                is_lock: false,
                lan: d2.key,
                lan_doc: d2.title,
                subtitle_url: d2.url,
                type: 1
              });
            });
          }
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
        style: i.styles?.map((d_3) => d_3.name),
        title: i.title,
        total_ep: i.total
      };
      t.mediaInfo.bkg_cover && (t.special = true);
      t.ssId = i.season_id || -1;
      t.epInfo = this.epid && episodes.find((d_4) => d_4.ep_id == this.epid) || episodes[0] || {};
      t.epList = episodes;
      t.seasonList = d.series?.seasons?.map((d_5) => {
        return {
          badge: "独家",
          badge_type: 1,
          cover: "",
          media_id: -1,
          new_ep: {},
          season_id: d_5.season_id,
          season_title: d_5.quarter_title,
          season_type: 1,
          stat: {},
          title: d_5.quarter_title
        };
      }) || [];
      t.upInfo = d.up_info || {};
      t.rightsInfo = d.rights || {};
      t.app = 1 === t.rightsInfo.watch_platform;
      d.publish.is_started = 1;
      d.publish?.time_length_show === "已完结" && (d.publish.is_finish = 1);
      t.pubInfo = d.publish || {};
      if (d.new_ep) {
        d.new_ep.desc = d.new_ep.new_ep_display;
        d.new_ep.index = d.new_ep.title;
      }
      t.newestEp = d.new_ep || {};
      t.mediaRating = d.rating || {};
      t.payPack = d.pay_pack || {};
      t.payMent = d.payment || {};
      t.activity = d.activity_dialog || {};
      t.epStat = this.setEpStat(t.epInfo.episode_status || t.mediaInfo.season_status, t.userStat.pay, t.userStat.payPackPaid, t.loginInfo);
      t.epId = Number(this.epid || t.epInfo.ep_id);
      this.ssid = t.ssId;
      this.epid = t.epId;
      this.th = true;
      xhrHook("api.bilibili.com/pgc/web/season/stat", void 0, (res) => {
        const t_1 = \`{"code": 0,"message":"0","ttl":1,"result":\${JSON.stringify(d.stat)}}\`;
        res.responseType === "json" ? res.response = JSON.parse(t_1) : res.response = res.responseText = t_1;
      }, false);
      this.player();
      toast.warning("这大概是一个泰区专属Bangumi，可能没有弹幕和评论区，可以使用【在线弹幕】【播放本地文件】等功能载入弹幕~", "另外：播放泰区番剧还可能导致历史记录错乱，请多担待🤣");
      const title = this.setTitle(t.epInfo.index, t.mediaInfo.title, this.Q(t.mediaInfo.season_type), true);
      function loopTitle() {
        poll(() => document.title != title, () => {
          document.title = title;
          if (document.title != title)
            loopTitle();
        });
      }
      loopTitle();
      videoInfo.bangumiEpisode(episodes, i.title, i.actor?.info, i.cover, t.mediaInfo.bkg_cover);
    }
    /** 修复泰区player接口 */
    player() {
      xhrHook.async("api.bilibili.com/x/player/v2?", void 0, async (args) => {
        const obj = urlObj(args[1]);
        const aid = obj.aid;
        const cid = obj.cid;
        const response = { code: 0, message: "0", data: new PlayerResponse(aid, cid) };
        if (this.subtitles[cid]) {
          response.data.subtitle.subtitles = this.subtitles[cid];
        }
        return { response, responseType: "json", responseText: JSON.stringify(response) };
      }, false);
    }
    /** 点赞功能 */
    enLike() {
      if (user.userStatus.like) {
        poll(() => document.querySelector("#bangumi_header > div.header-info > div.count-wrapper.clearfix > div.bangumi-coin-wrap"), (d) => {
          d.parentElement?.insertBefore(this.like, d);
          addCss(".ulike {margin-left: 15px;position: relative;float: left;height: 100%;line-height: 18px;font-size: 12px;color: #222;}", "ulike-bangumi");
        });
        xhrHook("pgc/web/season/stat?", void 0, async (res) => {
          try {
            const result = typeof res.response === "string" ? jsonCheck(res.response) : res.response;
            this.like.likes = result.result.likes;
          } catch {
          }
        });
        switchVideo(() => {
          this.like.init();
        });
      }
    }
    episodeIndex = 0;
    /** 分集数据 */
    episodeData() {
      if (user.userStatus.episodeData) {
        switchVideo(() => {
          this.episodeIndex++;
          const views = document.querySelector(".view-count > span");
          const danmakus = document.querySelector(".danmu-count > span");
          if (views && danmakus) {
            if (this.episodeIndex === 1) {
              const [view, danmaku2] = [
                unitFormat(window.__INITIAL_STATE__.mediaInfo.stat.views),
                unitFormat(window.__INITIAL_STATE__.mediaInfo.stat.danmakus)
              ];
              views.setAttribute("title", "总播放数 " + view);
              danmakus.setAttribute("title", "总弹幕数 " + danmaku2);
              debug.log("总播放数：", view, "总弹幕数", danmaku2);
            }
            apiStat(BLOD.aid).then(({ view, danmaku: danmaku2 }) => {
              views.textContent = unitFormat(view);
              danmakus.textContent = unitFormat(danmaku2);
              debug.log("总播放数：", view, "总弹幕数", danmaku2);
            }).catch((e) => {
              debug.error("分集数据", e);
            });
          }
        });
      }
    }
  };

  // src/page/av.ts
  var PageAV = class extends Page {
    /** 销毁标记，当前已不是av页，部分回调禁止生效 */
    destroy = false;
    like;
    get aid() {
      return BLOD.aid;
    }
    set aid(v) {
      BLOD.aid = v;
    }
    constructor() {
      super(av_default);
      location.href.replace(/av\\d+/i, (d) => this.aid = d.slice(2));
      new Comment();
      this.like = new Like();
      propertyHook(window, "__INITIAL_STATE__", void 0);
      location.href.includes("/s/video") && urlCleaner.updateLocation(location.href.replace("s/video", "video"));
      this.enLike();
      this.aidLostCheck();
      this.updateDom();
      this.favCode();
      this.tagTopic();
      this.menuConfig();
      this.ancientHeader();
      this.hyperLink();
      this.embedPlayer();
      this.elecShow();
      Header.primaryMenu();
      Header.banner();
    }
    /**
     * 暴露UI组件
     * 717 -> video.b1b7706abd590dd295794f540f7669a5d8d978b3.js
     * .onCoinSuccess(n)   页面变为已投币n枚的状态
     * .onFollow()         变为已关注状态
     * .favSubmit(bool)    设置收藏状态，参数bool: true -> “已收藏”状态 false -> 未收藏状态
     */
    // protected biliUIcomponents() {
    //     webpackHook(717, 274, (code: string) => code.replace("init:function(){", "init:function(){window.biliUIcomponents=this;").replace("this.getAdData()", "this.getAdData"));
    // }
    /**
     * 修复：收藏视频时，在“添加到收藏夹”弹窗中，如果将视频从收藏夹A删除，并同时添加到收藏夹B，点击确定后窗口不消失的问题
     * @example
     * // 报错原因示意：
     * jQuery.when(deferredA,deferredB).done((resultA,resultB) => {
     *      let codeA = resultA[0].code; // Cannot read property 'code' of undefined
     *      let codeA = resultA.code;    // 本应该写成这样
     * })
     */
    favCode() {
      webpackHook(717, 251, (code) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
    }
    /** 修复：视频标签链接（tag -> topic） */
    tagTopic() {
      webpackHook(717, 660, (code) => code.replace('tag/"+t.info.tag_id+"/?pagetype=videopage', 'topic/"+t.info.tag_id+"/?pagetype=videopage'));
    }
    /** 修复：视频分区 */
    menuConfig() {
      webpackHook(717, 100, (code) => code.replace(/MenuConfig[\\S\\s]+?LiveMenuConfig/, \`MenuConfig=\${sort_default},e.LiveMenuConfig\`));
    }
    /** 移除上古顶栏 */
    ancientHeader() {
      webpackHook(717, 609, () => \`()=>{}\`);
    }
    /** 修复：超链接跳转 */
    hyperLink() {
      webpackHook(717, 2, (code) => code.replace("av\$1</a>')", \`av\$1</a>').replace(/(?!<a[^>]*>)cv([0-9]+)(?![^<]*<\\\\/a>)/ig, '<a href="//www.bilibili.com/read/cv\$1/" target="_blank" data-view="\$1">cv\$1</a>').replace(/(?!<a[^>]*>)(bv1)(\\\\w{9})(?![^<]*<\\\\/a>)/ig, '<a href="//www.bilibili.com/video/bv1\$2/" target="_blank">\$1\$2</a>')\`).replace("http://acg.tv/sm", "https://www.nicovideo.jp/watch/sm"));
    }
    /**
     * 添加：播放器启动代码
     * 无\`__INITIAL_STATE__\`启动
     */
    embedPlayer() {
      webpackHook(717, 286, (code) => code.replace('e("setVideoData",t)', \`e("setVideoData",t);\$("#bofqi").attr("id","__bofqi").html('<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>');new Function('EmbedPlayer',t.embedPlayer)(window.EmbedPlayer);\`));
    }
    /** 跳过充电鸣谢 */
    elecShow() {
      if (user.userStatus.elecShow) {
        jsonpHook("api.bilibili.com/x/web-interface/elec/show", void 0, (res) => {
          try {
            res.data.av_list = [];
          } catch {
          }
          return res;
        }, false);
      } else {
        jsonpHook.async("api.bilibili.com/x/web-interface/elec/show", void 0, async () => {
          return { code: -404 };
        }, false);
      }
    }
    /** 检查页面是否失效及bangumi跳转 */
    aidLostCheck() {
      jsonpHook("api.bilibili.com/x/web-interface/view/detail", void 0, (res, r, call) => {
        if (0 !== res.code) {
          const obj = urlObj(r);
          if (obj.aid) {
            this.aid = obj.aid;
            this.getVideoInfo().then((d) => call(d)).catch(() => call(res));
            return true;
          }
        } else {
          if (res.data && res.data.View) {
            Promise.resolve().then(() => {
              user.userStatus.staff && res.data.View.staff && this.staff(res.data.View.staff);
            });
            if (user.userStatus.ugcSection && res.data.View.ugc_season) {
              this.ugcSection(res.data.View.ugc_season, res.data.View.owner);
            }
            videoInfo.aidDatail(res.data.View);
          }
        }
      }, false);
    }
    /** 通过其他接口获取aid数据 */
    async getVideoInfo() {
      const data = [\`av\${this.aid}可能无效，尝试其他接口~\`];
      const tst = toast.toast(0, "info", ...data);
      try {
        const card = await apiArticleCards({ av: this.aid });
        if (card[\`av\${this.aid}\`]) {
          if (card[\`av\${this.aid}\`].redirect_url) {
            data.push(\`bangumi重定向：\${card[\`av\${this.aid}\`].redirect_url}\`);
            tst.data = data;
            tst.type = "warning";
            setTimeout(() => {
              urlCleaner.updateLocation(card[\`av\${this.aid}\`].redirect_url);
              new PageBangumi();
              this.destroy = true;
              tst.delay = 4;
            }, 100);
            return new ApiViewDetail();
          }
        }
        const view = await new apiBiliplusView(this.aid).toDetail();
        if (view?.data.View.season) {
          data.push(\`bangumi重定向：\${view.data.View.season.ogv_play_url}\`);
          tst.data = data;
          tst.type = "warning";
          view.data.View.season = void 0;
          setTimeout(() => {
            urlCleaner.updateLocation(card[\`av\${this.aid}\`].redirect_url);
            new PageBangumi();
            this.destroy = true;
            tst.delay = 4;
          }, 100);
          return new ApiViewDetail();
        }
        setTimeout(() => {
          videoInfo.aidDatail(view.data.View);
          data.push("获取缓存数据成功！但这可能是个失效视频！");
          tst.data = data;
          tst.type = "success";
          tst.delay = 4;
        }, 100);
        return view;
      } catch (e) {
        debug.error("获取数据出错！", e);
        data.push("获取数据出错！", e);
        tst.data = data;
        tst.type = "error";
        tst.delay = 4;
        throw e;
      }
    }
    /** 合作UP */
    staff(staff) {
      poll(() => document.querySelector("#v_upinfo"), (node) => {
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
        node.innerHTML = fl;
        addCss(uplist_default, "up-list");
      });
    }
    /** 合集（使用播单模拟） */
    ugcSection(season, owner) {
      toview_default.cover = season.cover;
      toview_default.count = season.ep_count;
      toview_default.id = season.id;
      toview_default.description = season.intro;
      toview_default.mid = season.mid;
      toview_default.type = season.season_type;
      toview_default.state = season.sign_state;
      toview_default.stat.favorite = season.stat.fav;
      toview_default.stat.reply = season.stat.reply;
      toview_default.stat.share = season.stat.share;
      toview_default.stat.view = season.stat.view;
      toview_default.pid = -1;
      toview_default.list = season.sections.reduce((s, d) => {
        d.episodes.forEach((d2) => {
          s.push({
            aid: d2.aid,
            attribute: d2.attribute,
            cid: d2.cid,
            copyright: d2.arc.copyright,
            ctime: d2.arc.ctime,
            desc: d2.arc.desc,
            dimension: d2.arc.dimension,
            duration: d2.arc.duration,
            dynamic: d2.arc.dynamic,
            owner,
            pages: [d2.page],
            pic: d2.arc.pic,
            pubdate: d2.arc.pubdate,
            rights: d2.arc.rights,
            stat: d2.arc.stat,
            state: d2.arc.state,
            tid: d2.arc.type_id,
            title: d2.title,
            tname: "",
            videos: 1
          });
        });
        return s;
      }, []);
      player.addModifyArgument((args) => {
        if (this.destroy)
          return;
        const obj = urlObj(\`?\${args[2]}\`);
        obj.playlist = encodeURIComponent(JSON.stringify({ code: 0, data: toview_default, message: "0", ttl: 1 }));
        args[2] = objUrl("", obj);
      });
      propertyHook(window, "callAppointPart", this.callAppointPart);
      addCss(".bilibili-player .bilibili-player-auxiliary-area .bilibili-player-playlist .bilibili-player-playlist-playlist {height: calc(100% - 45px);}.bilibili-player-playlist-nav-title,.bilibili-player-playlist-nav-ownername{display: none;}");
    }
    /** hook合集切p回调 */
    callAppointPart = (p, state) => {
      if (this.destroy)
        return Reflect.deleteProperty(window, "callAppointPart");
      const vue = document.querySelector("#app")?.__vue__;
      if (vue) {
        vue.\$store.state.aid = state.aid;
        apiViewDetail(state.aid).then((d) => {
          vue.setVideoData(d.View);
          document.querySelector("#recommend_report")?.__vue__.init(d.Related);
          document.querySelector("#v_tag").__vue__.\$data.tags = d.Tags;
          videoInfo.aidDatail(d.View);
        }).catch((e) => {
          toast.error("更新视频信息失败", e)();
        }).finally(() => {
          history.pushState(history.state, "", \`/video/av\${state.aid}\`);
        });
      }
    };
    /** 点赞功能 */
    enLike() {
      if (user.userStatus.like) {
        poll(() => document.querySelector("#viewbox_report > div.number > span.u.coin"), (d) => {
          if (this.destroy)
            return this.like.remove();
          d.parentElement?.insertBefore(this.like, d);
          addCss(".video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}", "ulike-av");
        });
        const destroy = videoInfo.bindChange((v) => {
          if (this.destroy) {
            destroy();
            return this.like.remove();
          }
          this.like.likes = v.stat?.like;
          this.like.init();
        });
      }
    }
  };

  // src/page/watchalter.ts
  init_tampermonkey();

  // src/html/watchlater.html
  var watchlater_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <meta charset="utf-8" />\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />\\r\\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\\r\\n        title="哔哩哔哩" />\\r\\n    <link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css" />\\r\\n    <link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css" />\\r\\n    <link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css"\\r\\n        rel="stylesheet" />\\r\\n    <style type="text/css">\\r\\n        #bofqi .player {\\r\\n            width: 980px;\\r\\n            height: 620px;\\r\\n            display: block;\\r\\n        }\\r\\n\\r\\n        @media screen and (min-width:1400px) {\\r\\n            #bofqi .player {\\r\\n                width: 1160px;\\r\\n                height: 720px\\r\\n            }\\r\\n        }\\r\\n\\r\\n        /* 修正稍后再看迷你播放器样式 */\\r\\n        .bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-danmaku {\\r\\n            top: 30px;\\r\\n            height: 240px;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container has-menu"></div>\\r\\n    <div id="viewlater-app">\\r\\n        <app></app>\\r\\n    </div>\\r\\n    <div class="footer bili-footer"></div>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"><\\/script>\\r\\n    <script type="text/javascript"\\r\\n        src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/page/watchalter.ts
  var PageWatchlater = class extends Page {
    like;
    constructor() {
      super(watchlater_default);
      this.like = new Like();
      new Comment();
      this.enLike();
      this.toview();
      this.updateDom();
      this.living();
      this.commentAgent();
      Header.primaryMenu();
      Header.banner();
    }
    /** 记录视频数据 */
    toview() {
      jsonpHook("history/toview/web?", void 0, (d) => {
        setTimeout(() => {
          d.data.list.forEach((d2) => videoInfo.aidDatail(d2));
        });
        return d;
      });
    }
    /** 点赞功能 */
    enLike() {
      if (user.userStatus.like) {
        poll(() => document.querySelector("#viewlater-app > div > div > div > div.video-top-info.clearfix.bili-wrapper.bili-wrapper > div.video-info-module > div.number > span.u.coin.on"), (d) => {
          d.parentElement?.insertBefore(this.like, d);
          addCss(".video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}", "ulike-watchlater");
        }, void 0, 0);
        jsonpHook("x/web-interface/view?", void 0, (d) => {
          setTimeout(() => {
            const data = jsonCheck(d).data;
            BLOD.aid = data.aid;
            this.like.likes = data.stat.like;
            this.like.init();
          });
          return d;
        }, false);
      }
    }
    /** 修正直播错误 */
    living() {
      xhrHook("api.live.bilibili.com/bili/living_v2/", void 0, (r) => {
        r.response = r.responseText = \` \${r.response}\`;
      }, false);
    }
    /** 修复评论播放跳转 */
    commentAgent() {
      window.commentAgent = { seek: (t) => window.player && window.player.seek(t) };
    }
  };

  // src/page/playlist.ts
  init_tampermonkey();

  // src/html/playlist.html
  var playlist_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta charset="utf-8" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <meta charset="utf-8" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <link\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css"\\r\\n        rel="stylesheet" />\\r\\n    <style type="text/css">\\r\\n        #bofqi .player {\\r\\n            width: 980px;\\r\\n            height: 620px;\\r\\n            display: block;\\r\\n        }\\r\\n\\r\\n        @media screen and (min-width:1400px) {\\r\\n            #bofqi .player {\\r\\n                width: 1160px;\\r\\n                height: 720px\\r\\n            }\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div id="playlist-video-app"></div>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\\/script>\\r\\n    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"><\\/script>\\r\\n    <script type="text/javascript"\\r\\n        src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"><\\/script>\\r\\n    <script type="text/javascript"\\r\\n        src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/page/playlist.ts
  var PagePlaylist = class extends Page {
    /** 查询参数 */
    route = urlObj(location.href);
    /** 播单类型 */
    type = 3;
    /** 播单号 */
    pl = -1;
    /** 是否播单 */
    isPl = false;
    like;
    constructor() {
      super(playlist_default);
      this.like = new Like();
      new Comment();
      this.init();
      this.EmbedPlayer();
      this.toviewHook();
      this.updateDom();
      this.elecShow();
      this.enLike();
      Header.primaryMenu();
      Header.banner();
      this.isPl || switchVideo(this.switchVideo);
    }
    /** 初始化 */
    init() {
      const path = BLOD.path.at(-1);
      this.isPl = Boolean(path?.startsWith("pl"));
      path?.replace(/\\d+/, (d) => this.pl = d);
      if (this.route.business) {
        switch (this.route.business) {
          case "space":
            this.type = 1;
            break;
          case "space_series":
            this.type = 5;
            this.pl = this.route.business_id;
            break;
          case "space_channel":
            this.type = 6;
            this.pl = 10 * this.route.business_id + this.pl % 10;
            break;
          case "space_collection":
            this.type = 8;
            this.pl = this.route.business_id;
            break;
          default:
            this.type = 3;
        }
      }
      this.isPl || urlCleaner.updateLocation(objUrl(\`https://www.bilibili.com/playlist/video/pl\${this.pl}\`, this.route));
    }
    /** 过滤播放启动参数 */
    EmbedPlayer() {
      if (!this.isPl) {
        player.addModifyArgument((args) => {
          const obj = urlObj(\`?\${args[2]}\`);
          delete obj.playlist;
          obj.playlistType = this.type;
          obj.playlistId = this.pl;
          obj.playBvid = NaN;
          obj.playlistOid = "";
          obj.playlistOtype = NaN;
          obj.sort_field = 1;
          args[2] = objUrl("", obj);
        });
        xhrHook("x/v2/medialist/resource/list?", void 0, async (res) => {
          const data = jsonCheck(res.response);
          data.data.media_list.forEach((d) => {
            videoInfo.aidInfo(d);
          });
        });
      }
    }
    /** 拦截并修改页面初始化请求 */
    toviewHook() {
      jsonpHook.async("toview", void 0, async () => {
        urlCleaner.updateLocation(BLOD.path.join("/"));
        return { code: 0, data: toview_default, message: "0", ttl: 1 };
      });
      videoInfo.toview(toview_default);
    }
    /** 跳过充电鸣谢 */
    elecShow() {
      if (user.userStatus.elecShow) {
        jsonpHook("api.bilibili.com/x/web-interface/elec/show", void 0, (res) => {
          try {
            res.data.av_list = [];
          } catch {
          }
          return res;
        }, false);
      } else {
        jsonpHook.async("api.bilibili.com/x/web-interface/elec/show", void 0, async () => {
          return { code: -404 };
        }, false);
      }
    }
    /** 伪造的播单页不应有识别参数 */
    switchVideo = () => {
      urlCleaner.updateLocation(BLOD.path.join("/"));
    };
    /** 点赞功能 */
    enLike() {
      if (user.userStatus.like) {
        poll(() => document.querySelector("#viewbox_report > div.number > span.u.coin"), (d) => {
          d.parentElement?.insertBefore(this.like, d);
          addCss(".video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}", "ulike-playlist");
        });
        jsonpHook("x/web-interface/view?", void 0, (d) => {
          setTimeout(() => {
            const data = jsonCheck(d).data;
            BLOD.aid = data.aid;
            this.like.likes = data.stat.like;
          });
          return d;
        }, false);
        switchVideo(() => {
          this.like.init();
        });
      }
    }
  };

  // src/page/playlist-detail.ts
  init_tampermonkey();

  // src/html/playlist-detail.html
  var playlist_detail_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta charset="utf-8" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/css/playlist_detail.1.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.css" />\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container"></div>\\r\\n    <div id="playlist-detail-app"></div>\\r\\n    <div id="app" data-server-rendered="true" class="pl-app"></div>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/manifest.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"\\r\\n        defer="defer"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/vendor.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"\\r\\n        defer="defer"><\\/script>\\r\\n    <script\\r\\n        src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/playlist_detail.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"\\r\\n        defer="defer"><\\/script>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/page/playlist-detail.ts
  var PagePlaylistDetail = class extends Page {
    constructor() {
      super(playlist_detail_default);
      this.__INITIAL_STATE__();
      this.updateDom();
      this.ancientHeader();
    }
    /** 移除上古顶栏 */
    ancientHeader() {
      webpackHook(499, 446, () => \`()=>{}\`);
    }
    __INITIAL_STATE__() {
      urlCleaner.updateLocation("https://www.bilibili.com/playlist/detail/pl769");
      window.__INITIAL_STATE__ = {
        mid: toview_default.mid,
        pid: toview_default.pid,
        plinfoData: {
          attr: toview_default.attr,
          count: toview_default.count,
          cover: toview_default.cover,
          ctime: toview_default.ctime,
          description: toview_default.description,
          favored: toview_default.favored,
          id: toview_default.id,
          is_favorite: toview_default.is_favorite,
          mid: toview_default.mid,
          mtime: toview_default.mtime,
          owner: toview_default.owner,
          pid: toview_default.pid,
          stat: toview_default.stat,
          state: toview_default.state,
          type: toview_default.type
        },
        pllistData: toview_default.list
      };
      window.addEventListener("load", () => {
        toast.warning("播单详情页面已不存在，这里显示的是缓存的播单 769 的数据。");
      }, { once: true });
    }
  };

  // src/page/ranking.ts
  init_tampermonkey();

  // src/html/ranking.html
  var ranking_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <title>热门视频排行榜 - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\\r\\n    <meta charset="utf-8" />\\r\\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\\r\\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/rank/css/rank.0.ba58f8684a87651e0e1c576df8f918bfa10c1a90.css" />\\r\\n    <style type="text/css">\\r\\n        .gg-floor-module {\\r\\n            display: none;\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container has-menu"></div>\\r\\n    <div id="rank-app"></div>\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin=""><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/page/ranking.ts
  var PageRanking = class extends Page {
    constructor() {
      super(ranking_default);
      this.location();
      this.overDue();
      this.initState();
      this.updateDom();
      Header.primaryMenu();
      Header.banner();
    }
    /** 还原正确的排行地址否则页面无法正常初始化 */
    location() {
      urlCleaner.updateLocation(/ranking/.test(document.referrer) ? document.referrer : "https://www.bilibili.com/ranking");
    }
    /** 三日以外的数据全部过期 */
    overDue() {
      jsonpHook(["api.bilibili.com/x/web-interface/ranking", "arc_type=0"], (d) => d.replace(/day=\\d+/, "day=3"), void 0, false);
    }
    /** 禁用错误的__INITIAL_STATE__ */
    initState() {
      propertyHook(window, "__INITIAL_STATE__", void 0);
    }
    /** 优化高分辨率支持 */
    style() {
      addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
    }
  };

  // src/page/read.ts
  init_tampermonkey();
  var import_quill_delta_to_html_cb = __toESM(require_main());

  // src/html/read.html
  var read_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head itemprop="Article" itemscope="itemscope" itemtype="http://schema.org/Article">\\r\\n    <meta charset="UTF-8" />\\r\\n    <meta data-n-head="true" name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />\\r\\n    <meta name="theme-color" content="#de698c" />\\r\\n    <meta http="Cache-Control" content="no-transform" />\\r\\n    <meta name="format-detection" content="telephone=no" />\\r\\n    <meta name="applicable-device" content="pc" />\\r\\n    <link rel="apple-touch-icon-precomposed" href="//static.hdslb.com/mobile/img/512.png" />\\r\\n    <link rel="icon" type="image/vnd.microsoft.icon" href="//www.bilibili.com/favicon.ico" />\\r\\n    <link rel="apple-touch-icon" href="//www.bilibili.com/favicon.ico" />\\r\\n    <meta name="renderer" content="webkit" />\\r\\n    <link data-n-head="true" rel="icon" type="image/x-icon" href="//www.bilibili.com/favicon.ico" />\\r\\n    <link data-n-head="true" rel="apple-touch-icon-precomposed" type="image/x-icon"\\r\\n        href="//static.hdslb.com/mobile/img/512.png" />\\r\\n    <title>哔哩哔哩专栏</title>\\r\\n    <link href="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.css"\\r\\n        rel="stylesheet" />\\r\\n    <style type="text/css">\\r\\n        .nav-tab-bar .tab-item[data-tab-id="41"]:before {\\r\\n            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA6lBMVEUAAAAiIiIkJCT///8jIyMiIiIiIiIiIiJVVVUjIyMjIyMlJSU0NDT9/f0iIiIoKCjz8/NCQkIjIyMjIyMrKysiIiJFRUWQkJAiIiIlJSUjIyMkJCQzMzNAQEDv7+/7+/tHR0ciIiIlJSUjIyNKSkp7e3tcXFxoaGgjIyMjIyMkJCT8/PxDQ0MnJyf39/fx8fHn5+cvLy/i4uLe3t7R0dHAwMA0NDQjIyOtra06Ojo+Pj4iIiJAQEBOTk5VVVVwcHBtbW1hYWEjIyMjIyMjIyMiIiIiIiIlJSUpKSkkJCT///95eXltbW1zc3PUVbhEAAAASnRSTlMAf4H+6NOdaAOnQRQF/asO/vTs5NnXxcO6NzMaCgT++fLv3s7GwMC/v6Fi+vr59PDn5ePh2dHOzMrKyMjGw8C/v7+1sZeVUikfHAMz54kAAAEUSURBVCjPldLXboMwFIDhQ7DNDBA2JGmTNLt7772d9v1fp5hSjEOkqP+lP/lIlg+sTVcaRV1gKXE/mLWBZWqYSEUMjfjsYv/4Hr0zxJYKlYxgItOsaMpmItHwA82TkQGgEMG2JrTITwGkRsXs80f6F/oU0b4el3YaQI585l1pm/6bgHZ/Ry7tcgYCaoetjcKaV1ZXwGSwvSi0efNsgoAvI0oXLYc9MXwyQcTBSXb83XOoPIw7AGlawQ8ks4FfPWc47fyec5yHmTHddZmJqEU57t16baghOqL0IArdVxvq6I3GvqvN2bU6JkRK+Odx5P0LFbIaicLWBKurTPX0/IEWV24WBpaJEWksRbBmlkstLaXosK4fYdYsW/LHMigAAAAASUVORK5CYII=);\\r\\n        }\\r\\n    </style>\\r\\n</head>\\r\\n\\r\\n<body>\\r\\n    <div class="z-top-container report-wrap-module"></div>\\r\\n    <div class="page-container"></div>\\r\\n    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>\\r\\n    <script src="//static.hdslb.com/public/intersection-observer.js"><\\/script>\\r\\n    <script src="//static.hdslb.com/public/timing.min.js"><\\/script>\\r\\n    <script src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <script type="text/javascript" charset="utf-8" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/biliapp/biliapp.js"><\\/script>\\r\\n    <script type="text/javascript"\\r\\n        src="//s1.hdslb.com/bfs/static/jinkela/article/manifest.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\\/script>\\r\\n    <script type="text/javascript"\\r\\n        src="//s1.hdslb.com/bfs/static/jinkela/article/vendor.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\\/script>\\r\\n    <script type="text/javascript"\\r\\n        src="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/page/read.ts
  var PageRead = class extends Page {
    readInfo;
    cvid;
    bars = [
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
    readInfoStr = "";
    ops;
    constructor() {
      super(read_default);
      this.webpackjsonp();
      new Comment();
      this.initState();
    }
    /** 处理webpackJsonp污染 */
    webpackjsonp() {
      webpackHook(115, 0, (str) => {
        return str.replace("gi,function(i){return", 'gi,function(i){return i.indexOf("api.")>-1?i:');
      });
    }
    /** 获取专栏信息 */
    initState() {
      this.readInfo = window.__INITIAL_STATE__?.readInfo;
      if (this.readInfo) {
        this.cvid = window.__INITIAL_STATE__.cvid;
        this.buildReadInfo();
      } else {
        Reflect.defineProperty(window, "__INITIAL_STATE__", {
          configurable: true,
          set: (v) => {
            this.readInfo = v.readInfo;
            this.cvid = v.cvid;
            propertyHook(window, "__INITIAL_STATE__", v);
            this.buildReadInfo();
          }
        });
      }
    }
    /** 构造专栏节点 */
    buildReadInfo() {
      this.navTabBar();
      this.upInfoHolder();
      this.headContainer();
      this.articleHolder();
      this.tagContainer();
      this.articleAction();
      this.updateDom();
    }
    navTabBar() {
      this.readInfoStr += this.bars.reduce((s, d) => {
        s += \`<a href="//www.bilibili.com/read/\${d[2]}?from=articleDetail" target="_self" class="tab-item\${this.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="\${d[0]}"><span>\${d[1]}</span></a>\`;
        return s;
      }, '<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>') + "</div>";
    }
    upInfoHolder() {
      this.readInfoStr += \`<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
        <a class="up-face-holder" href="//space.bilibili.com/\${this.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="\${this.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
        <a class="up-name" href="//space.bilibili.com/\${this.readInfo.author.mid}" target="_blank">\${this.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
        </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>\`;
    }
    headContainer() {
      this.readInfoStr += \`<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
        <h1 class="title">\${this.readInfo.title}</h1><div class="info">
        <a class="category-link" href="//www.bilibili.com/read/\${this.bars.find((d) => {
        if (d[0] == this.readInfo.category.parent_id)
          return d;
      })[2]}#rid=\${this.readInfo.category.id}" target="_blank"><span>\${this.readInfo.category.name}</span></a> <span class="create-time" data-ts="\${this.readInfo.ctime}"></span><div class="article-data"></div>
        </div></div><div style="display:none" class="author-container">
        <a class="author-face" href="//space.bilibili.com/\${this.readInfo.author.mid}" target="_blank"><img data-face-src="\${this.readInfo.author.face.replace("http:", "")}" src="\${this.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/\${this.readInfo.author.mid}" target="_blank">\${this.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>\`;
    }
    articleHolder() {
      this.readInfoStr += \`<div class="article-holder">\${this.delta()}</div><p class="original">本文为我原创</p>\`;
    }
    delta() {
      let str = this.readInfo.content.replace(/(\\&lt;)|(\\&quot;)|(\\&gt;)|(\\&#34;)|(\\&#39;)|(\\&amp;)/g, (d) => {
        return { "&lt;": "<", "&quot;": '"', "&gt;": ">", "&#34;": '"', "&#39;": "'", "&amp;": "&" }[d];
      });
      if (str?.startsWith('{"ops"')) {
        try {
          this.ops = JSON.parse(str).ops;
          const converter = new import_quill_delta_to_html_cb.QuillDeltaToHtmlConverter(this.ops);
          converter.renderCustomWith(function(customOp, contextOp) {
            switch (customOp.insert.type) {
              case "native-image":
                const val = customOp.insert.value;
                return \`<img src="\${val.url.split("@")[0]}@progressive.webp"\${val.alt ? \` alt="\${val.alt}"\` : ""}\${val.height ? \` data-h="\${val.height}"\` : ""}\${val.width ? \` data-w="\${val.width}"\` : ""}\${val.size ? \` data-size="\${val.size}"\` : ""}\${val.status ? \` data-status="\${val.status}"\` : ""}\${val.id ? \` data-id="\${val.id}"\` : ""}>\`;
              default:
                return "Unmanaged custom blot!";
            }
          });
          str = converter.convert();
        } catch (e) {
          debug.error(e);
        }
      }
      return BV2avAll(str);
    }
    tagContainer() {
      this.readInfoStr += (this.readInfo.tags || []).reduce((o, d) => {
        o = o + \`<li data-tag-id="\${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">\${d.name}</span></li>\`;
        return o;
      }, \`<ul class="tag-container">\`) + "</ul>";
    }
    articleAction() {
      this.readInfoStr += \`<div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>\`;
    }
    updateDom() {
      window.original = {
        cvid: this.cvid,
        author: {
          name: this.readInfo.author.name,
          mid: this.readInfo.author.mid
        },
        banner_url: this.readInfo.banner_url || this.readInfo && this.readInfo.image_urls[0] || null,
        reprint: this.readInfo.reprint,
        summary: this.readInfo.summary,
        media: "",
        actId: this.readInfo.act_id,
        dispute: {
          dispute: "",
          dispute_url: ""
        },
        spoiler: "0"
      };
      const title = document.title;
      this.vdom.replace(document.documentElement);
      document.querySelector(".page-container").innerHTML = this.readInfoStr;
      this.vdom.loadScript().then(() => {
        this.loadedCallback();
        PageRead.rightCopyEnable();
      });
      title && !title.includes("404") && (document.title = title);
    }
    /** 解锁右键菜单及复制 */
    static rightCopyEnable() {
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
    /** 重构后回调 */
    loadedCallback() {
      super.loadedCallback();
      const pres = document.querySelectorAll("figure pre");
      let prism = false;
      pres.forEach((d) => {
        const code = d.getAttribute("codecontent");
        if (code) {
          d.querySelector("code").textContent = code;
          d.removeAttribute("codecontent");
          prism = true;
        }
      });
      prism && loadScript("//s1.hdslb.com/bfs/static/article-text/static/ueditor/plugins/prism/prism.js").catch((e) => {
        toast.error("代码组件加载失败！", e)();
      });
    }
  };

  // src/page/search.ts
  init_tampermonkey();

  // src/html/search.html
  var search_default = '<!-- <!DOCTYPE html> -->\\r\\n<html lang="zh-CN">\\r\\n\\r\\n<head>\\r\\n    <title data-vue-meta="true"> _ 搜索结果_哔哩哔哩_Bilibili</title>\\r\\n    <meta data-vue-meta="true" charset="UTF-8">\\r\\n    <meta data-vue-meta="true" http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\\r\\n    <meta data-vue-meta="true" name="renderer" content="webkit|ie-comp|ie-stand">\\r\\n    <meta data-vue-meta="true" name="description"\\r\\n        content="点击查看更多相关视频、番剧、影视、直播、专栏、话题、用户等内容；你感兴趣的视频都在B站，bilibili是国内知名的视频弹幕网站，这里有及时的动漫新番，活跃的ACG氛围，有创意的Up主。大家可以在这里找到许多欢乐。">\\r\\n    <meta data-vue-meta="true" name="keywords"\\r\\n        content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid">\\r\\n    <meta data-vue-meta="true" charset="UTF-8">\\r\\n    <meta name="referrer" content="no-referrer-when-downgrade">\\r\\n    <link rel="dns-prefetch" href="//s1.hdslb.com">\\r\\n    <link rel="dns-prefetch" href="//i0.hdslb.com">\\r\\n    <link rel="dns-prefetch" href="//i1.hdslb.com">\\r\\n    <link rel="dns-prefetch" href="//i2.hdslb.com">\\r\\n    <link rel="dns-prefetch" href="//static.hdslb.com">\\r\\n    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico">\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/search/css/search.1.873ddf42c10f89041580a7464cc60c78d86b8329.css">\\r\\n    <link rel="stylesheet"\\r\\n        href="//s1.hdslb.com/bfs/static/jinkela/search/css/search.0.873ddf42c10f89041580a7464cc60c78d86b8329.css">\\r\\n</head>\\r\\n\\r\\n<body id="bili-search">\\r\\n    <div class="z-top-container"></div>\\r\\n    <div id="search-app"></div>\\r\\n    <!-- built files will be auto injected -->\\r\\n    <div class="footer bili-footer report-wrap-module"></div>\\r\\n    <script type="text/javascript"\\r\\n        src="//www.bilibili.com/gentleman/polyfill.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"><\\/script>\\r\\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.min.js"><\\/script>\\r\\n    <script type="text/javascript"\\r\\n        src="//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.vue.min.js"><\\/script>\\r\\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\\/script>\\r\\n    <script\\r\\n        src="//s1.hdslb.com/bfs/static/jinkela/search/1.search.873ddf42c10f89041580a7464cc60c78d86b8329.js"><\\/script>\\r\\n    <script src="//s1.hdslb.com/bfs/static/jinkela/search/search.873ddf42c10f89041580a7464cc60c78d86b8329.js"><\\/script>\\r\\n    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\\/script>\\r\\n</body>\\r\\n\\r\\n</html>';

  // src/io/api-search.ts
  init_tampermonkey();
  var ApiSearch = class extends ApiSign {
    constructor(keyword) {
      super(URLS.SEARCH, "c1b107428d337928");
      this.data = Object.assign({ keyword }, {
        type: "json",
        build: 404e3,
        main_ver: "v4",
        page: 1,
        pagesize: 20,
        platform: "android",
        search_type: "all",
        source_type: 0,
        bangumi_num: 1,
        special_num: 1,
        topic_num: 1,
        upuser_num: 1,
        tv_num: 1,
        movie_num: 1
      });
    }
    async getData() {
      const response = await fetch(this.sign());
      const json = await response.json();
      return jsonCheck(json);
    }
    /**
     * 转换为网页版搜索结果
     * @param data 本api结果
     */
    static toSearchV2(data) {
      const { code, result } = data;
      delete data.code;
      delete data.result;
      delete data.cache;
      return {
        code,
        data: Object.assign(data, {
          result: Object.entries(result).map((d) => {
            return {
              result_type: d[0],
              data: d[1]
            };
          })
        }),
        message: "0",
        ttl: 1
      };
    }
  };

  // src/utils/timer.ts
  init_tampermonkey();
  function timeout(value, time = 0) {
    return new Promise((r) => {
      setTimeout(() => {
        r(value);
      }, time);
    });
  }

  // src/page/search.ts
  var PageSearch = class extends Page {
    constructor() {
      super(search_default);
      this.location();
      this.initState();
      this.updateDom();
      this.style();
      this.gat();
    }
    /** 修正URL */
    location() {
      poll(() => location.href.endsWith("/all"), () => {
        urlCleaner.updateLocation(location.origin);
      }, 10, 30);
    }
    /** 新版__INITIAL_STATE__可能损坏页面 */
    initState() {
      propertyHook(window, "__INITIAL_STATE__", void 0);
    }
    style() {
      addCss(\`
.home-wrap .home-form .home-suggest .hotlist {
    display: flex;
    flex-direction: column;
    width: auto;
}
.home-wrap .home-form .home-suggest .hotlist .item {
    width: auto;
}\`);
    }
    /** 获取港澳台搜索数据 */
    gat() {
      if (user.userStatus.searchAllArea) {
        const record = {};
        jsonpHook("x/web-interface/search/all/v2?", void 0, (res, url) => {
          const keyword = decodeURIComponent(urlObj(url).keyword);
          (keyword in record ? timeout(record[keyword]) : new ApiSearch(keyword).getData()).then((data) => {
            record[keyword] = data;
            const vue = document.querySelector("#all-list > div.flow-loader")?.__vue__;
            if (vue && data?.result?.media_bangumi.length) {
              vue.source.result.forEach((d) => {
                switch (d.result_type) {
                  case "media_bangumi": {
                    const arr2 = [].concat(d.data);
                    const names = arr2.map((d2) => d2.season_id);
                    data.result.media_bangumi.forEach((d2) => {
                      d2.season_type_name = "番剧";
                      names.includes(d2.season_id) || arr2.push(d2);
                    });
                    d.data = JSON.parse(JSON.stringify(arr2));
                    break;
                  }
                  default:
                    break;
                }
              });
            }
          });
          return res;
        }, false);
        jsonpHook(["x/web-interface/search/type?", "search_type=media_bangumi"], void 0, (res, url) => {
          const keyword = decodeURIComponent(urlObj(url).keyword);
          const data = record[keyword];
          if (data?.result?.media_bangumi.length && res?.data?.result?.length) {
            const arr2 = [].concat(res.data.result);
            const names = arr2.map((d) => d.season_id);
            data.result.media_bangumi.forEach((d) => {
              d.season_type_name = "番剧";
              names.includes(d.season_id) || arr2.push(d);
            });
            res.data.result = arr2;
          }
          return res;
        }, false);
      }
    }
  };

  // src/core/automate.ts
  init_tampermonkey();
  var Automate = class {
    constructor() {
      this.modifyArgument();
      this.danmakuFirst();
      switchVideo(this.switchVideo);
      this.videospeed();
    }
    /** 展开弹幕列表 */
    danmakuFirst() {
      user.userStatus.automate.danmakuFirst && SessionStorage.setItem("player_last_filter_tab_info", 4);
    }
    /** 滚动到播放器 */
    showBofqi() {
      const str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
      user.userStatus.automate.showBofqi && setTimeout(() => {
        const node = str.reduce((s, d) => {
          s = s || document.querySelector(d);
          return s;
        }, document.querySelector("#__bofqi"));
        node && node.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
    /** 自动网页全屏 */
    webFullScreen() {
      user.userStatus.automate.webFullScreen && poll(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => document.querySelector(".bilibili-player-video-web-fullscreen").click());
    }
    /** 记忆播放速率 */
    videospeed() {
      if (user.userStatus.automate.videospeed) {
        GM.getValue("videospeed").then((videospeed) => {
          if (videospeed) {
            let setting = SessionStorage.getItem("bilibili_player_settings");
            setting ? setting.video_status ? setting.video_status.videospeed = videospeed : setting.video_status = { videospeed } : setting = { video_status: { videospeed } };
            SessionStorage.setItem("bilibili_player_settings", setting);
          }
        });
        switchVideo(() => {
          poll(() => document.querySelector("#bofqi")?.querySelector("video"), (d) => {
            d.addEventListener("ratechange", (e) => {
              GM.setValue("videospeed", e.target.playbackRate || 1);
            });
          });
        });
      }
    }
    /** 关闭抗锯齿 */
    videoDisableAA() {
      user.userStatus.videoDisableAA && poll(() => document.querySelector("#bilibiliPlayer .bilibili-player-video video"), (d) => d.style.filter += "contrast(1)");
    }
    /** 修改播放器启动参数 */
    modifyArgument() {
      player.addModifyArgument((args) => {
        const obj = urlObj(\`?\${args[2]}\`);
        user.userStatus.automate.screenWide && (obj.as_wide = 1);
        user.userStatus.automate.autoPlay && (obj.autoplay = 1);
        user.userStatus.automate.noDanmaku && (obj.danmaku = 0);
        args[2] = objUrl("", obj);
      });
    }
    /** 切p回调 */
    switchVideo = async () => {
      this.showBofqi();
      this.webFullScreen();
      this.videoDisableAA();
      if (!videoInfo.metadata && BLOD.aid) {
        apiArticleCards({ av: BLOD.aid }).then((d) => {
          Object.values(d).forEach((d2) => videoInfo.aidDatail(d2));
          videoInfo.mediaSession();
        }).catch((e) => {
          debug.error("获取aid详情出错！", e);
        });
      } else {
        videoInfo.mediaSession();
      }
    };
  };

  // src/core/webrtc.ts
  init_tampermonkey();
  var WebTRC = class {
    static disable() {
      navigator.getUserMedia = void 0;
      window.MediaStreamTrack = void 0;
      window.RTCPeerConnection = void 0;
      window.RTCSessionDescription = void 0;
      navigator.mozGetUserMedia = void 0;
      window.mozMediaStreamTrack = void 0;
      window.mozRTCPeerConnection = void 0;
      window.mozRTCSessionDescription = void 0;
      navigator.webkitGetUserMedia = void 0;
      window.webkitMediaStreamTrack = void 0;
      window.webkitRTCPeerConnection = void 0;
      window.webkitRTCSessionDescription = void 0;
    }
  };

  // src/core/ui.ts
  init_tampermonkey();

  // src/core/accesskey.ts
  init_tampermonkey();

  // src/io/api-login-app-third.ts
  init_tampermonkey();
  var ApiLoginAppThird = class extends ApiSign {
    constructor(api) {
      super(URLS.LOGIN_APP_THIRD, "27eb53fc9058f8c3");
      this.api = api;
      this.api = encodeURIComponent(api);
    }
    async getData() {
      const response = await fetch(this.sign({ api: this.api }, this.api), { credentials: "include" });
      const json = await response.json();
      return jsonCheck(json).data;
    }
  };

  // src/core/accesskey.ts
  var AccessKey = class {
    constructor() {
      const button = [{
        text: "开始授权",
        callback: () => this.get()
      }];
      if (user.userStatus.accessKey.token) {
        button[0].text = "刷新授权";
        button.push({
          text: "取消授权",
          callback: () => this.remove()
        });
      }
      alert([
        "【账户授权】将授权脚本获取您的登录鉴权，允许脚本访问一些网页端无权访问的B站接口，以实现【解除播放限制】等功能。",
        "警告：如果您启用了脚本的【解除播放限制】功能，并且选择使用【自定义】服务器，请务必自行确认服务器的可信度！",
        "第三方服务器获得授权等于您在上面登录了B站，好比在网吧登录又忘了退出，第三方能用您的账户实现任何登录状态能进行的操作！",
        "个中风险请务必知悉！<strong>如无必要，切莫授权！</strong>"
      ], "授权确认", button);
    }
    get() {
      if (uid) {
        const data = ["正在申请账户授权~"];
        const tst = toast.toast(0, "info", ...data);
        new ApiLoginAppThird("https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png").getData().then(async (d) => {
          data.push("成功获取到授权链接~");
          tst.data = data;
          return GM.fetch(d.confirm_uri, { credentials: "include" });
        }).then((d) => {
          const date = (/* @__PURE__ */ new Date()).getTime();
          const dateStr = timeFormat(date, true);
          const obj = urlObj(d.url);
          user.userStatus.accessKey.token = obj.access_key;
          user.userStatus.accessKey.date = date;
          user.userStatus.accessKey.dateStr = dateStr;
          data.push("------- 授权成功 -------", \`鉴权: \${obj.access_key}\`, \`日期：\${dateStr}\`);
          tst.data = data;
          tst.type = "success";
          tst.delay = 4;
        }).catch((e) => {
          debug.error("授权出错！", e);
          data.push("授权出错！", e);
          tst.data = data;
          tst.type = "error";
          tst.delay = 4;
        });
      } else {
        toast.warning("请先登录B站账户！");
        biliQuickLogin();
      }
    }
    remove() {
      user.userStatus.accessKey.token = void 0;
      user.userStatus.accessKey.date = 0;
      user.userStatus.accessKey.dateStr = "";
      toast.warning("已清除账户鉴权", "如果您在【解除播放限制】功能中选择【自定义】服务器，那么第三方服务器中很可能依然有鉴权。", "为求保险，您可以修改一次密码，这会强制所有鉴权失效。")();
    }
  };

  // src/core/chain.ts
  init_tampermonkey();
  var Chain = new class {
    /**
     * 链式获取目标对象的值
     * @param key 链式字符串
     * @param obj 目标对象（默认为用户数据）
     * @returns 用户数据
     * @example
     * getStatus('toast.disabled') // userStatus.toast.disabled
     */
    getStatus(key, obj = user.userStatus) {
      const arr2 = key.split(".");
      let status = obj;
      while (status && arr2.length) {
        const d = arr2.shift();
        d && (status = status[d]);
      }
      return status;
    }
    /**
     * 链式设置目标对象的值
     * @param key 链式字符串
     * @param value 用户数据
     * @param obj 目标对象（默认为用户数据）
     * @example
     * setStatus('toast.disabled', false) // userStatus.toast.disabled
     */
    setStatus(key, value, obj = user.userStatus) {
      try {
        const arr2 = key.split(".");
        let target = obj;
        key = void 0;
        while (arr2.length) {
          key && (target = target[key]);
          key = arr2.shift();
        }
        target[key] = value;
      } catch {
      }
    }
  }();

  // src/core/ui/desc.ts
  init_tampermonkey();

  // src/css/desc.css
  var desc_default = ".container {\\r\\n    position: fixed;\\r\\n    top: 16px;\\r\\n    left: 100%;\\r\\n    background: hsla(0, 0%, 95.7%, .8);\\r\\n    border-radius: 2px;\\r\\n    box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);\\r\\n    color: #000;\\r\\n    width: 381px;\\r\\n    z-index: 1;\\r\\n}\\r\\n\\r\\n.title {\\r\\n    text-align: center;\\r\\n    margin-top: 16px;\\r\\n    margin-bottom: 3px;\\r\\n    font-size: 12px;\\r\\n}\\r\\n\\r\\n.content {\\r\\n    font-size: 12px;\\r\\n    line-height: 19px;\\r\\n    padding: 0 16px 16px;\\r\\n    text-align: justify;\\r\\n    white-space: pre-line;\\r\\n}";

  // src/core/ui/desc.ts
  var Desc = class extends HTMLElement {
    _title;
    _content;
    show = true;
    timer;
    _container;
    _parrent;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = \`<div class="container"><div class="title"></div><div class="content"></div></div>\`;
      addCss(desc_default, void 0, root);
      this._container = root.querySelector(".container");
      this._title = root.querySelector(".title");
      this._content = root.querySelector(".content");
      this.toggle(false);
    }
    /**
     * 更新浮窗
     * @param title 标题
     * @param content 内容
     * @param appendTo 父节点
     */
    value(title, content, appendTo) {
      this._title.innerHTML = title;
      this._content.innerHTML = content;
      this._parrent = appendTo;
      appendTo.appendChild(this);
      appendTo.addEventListener("mouseover", () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.toggle(true);
        }, 300);
      });
      appendTo.addEventListener("mouseout", () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.toggle(false);
        }, 300);
      });
    }
    toggle(show) {
      this.show = show === void 0 ? !this.show : show;
      this.style.display = this.show ? "" : "none";
      if (this._parrent) {
        const rect = this._parrent.getBoundingClientRect();
        this._container.style.top = rect.top - rect.height * 2 + "px";
      }
    }
  };
  customElements.get(\`desc-\${"caecec5"}\`) || customElements.define(\`desc-\${"caecec5"}\`, Desc);

  // src/core/ui/interface.ts
  init_tampermonkey();

  // src/html/ui-interface.html
  var ui_interface_default = '<div class="box">\\r\\n    <div class="tool">\\r\\n        <div title="关闭" class="icon"></div>\\r\\n        <header>Bilbili Old</header>\\r\\n    </div>\\r\\n    <div class="content">\\r\\n        <div class="contain">\\r\\n            <div class="menu"></div>\\r\\n            <div class="item"></div>\\r\\n        </div>\\r\\n    </div>\\r\\n</div>\\r\\n<style type="text/css">\\r\\n    .box {\\r\\n        left: 50%;\\r\\n        top: 50%;\\r\\n        transform: translateX(-50%) translateY(-50%);\\r\\n        min-width: 600px;\\r\\n        min-height: 400px;\\r\\n        padding: 0;\\r\\n        border: 0;\\r\\n        position: fixed;\\r\\n        z-index: 11110;\\r\\n        display: none;\\r\\n        box-sizing: border-box;\\r\\n        background: #fff;\\r\\n        border-radius: 8px;\\r\\n        box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);\\r\\n        transition: transform 0.3s ease-in;\\r\\n        line-height: 14px;\\r\\n        font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB,\\r\\n            Heiti SC, WenQuanYi Micro Hei, sans-serif;\\r\\n    }\\r\\n\\r\\n    .tool {\\r\\n        border-bottom-left-radius: 8px;\\r\\n        border-bottom-right-radius: 8px;\\r\\n        overflow: hidden;\\r\\n        width: 100%;\\r\\n        display: inline-flex;\\r\\n        z-index: 1;\\r\\n        align-items: center;\\r\\n        justify-content: flex-end;\\r\\n        pointer-events: none;\\r\\n    }\\r\\n\\r\\n    .tool header {\\r\\n        position: absolute;\\r\\n        transform: translateX(-50%);\\r\\n        left: 50%;\\r\\n        font-size: 14px;\\r\\n    }\\r\\n\\r\\n    .tool div {\\r\\n        border-radius: 50%;\\r\\n        padding: 10px;\\r\\n        transform: scale(0.8);\\r\\n        pointer-events: visible;\\r\\n        transition: opacity 0.3s ease;\\r\\n    }\\r\\n\\r\\n    .tool div:hover {\\r\\n        background-color: rgba(0, 0, 0, 10%);\\r\\n    }\\r\\n\\r\\n    .content {\\r\\n        position: relative;\\r\\n        border-bottom-left-radius: 8px;\\r\\n        border-bottom-right-radius: 8px;\\r\\n        overflow: hidden;\\r\\n        background-color: #fff;\\r\\n    }\\r\\n\\r\\n    .contain {\\r\\n        padding-bottom: 15px;\\r\\n        background-position: top center;\\r\\n        background-size: contain;\\r\\n        background-repeat: no-repeat;\\r\\n        display: flex;\\r\\n        align-items: flex-start;\\r\\n        flex: 1;\\r\\n        height: 360px;\\r\\n    }\\r\\n\\r\\n    .menu::-webkit-scrollbar,\\r\\n    .item::-webkit-scrollbar {\\r\\n        width: 0 !important;\\r\\n        height: 0 !important;\\r\\n    }\\r\\n\\r\\n    .menu {\\r\\n        flex: 1 1 0;\\r\\n        flex-basis: calc(480px * 0.2);\\r\\n        height: 100%;\\r\\n        position: sticky;\\r\\n        top: 0;\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        min-width: fit-content;\\r\\n        overflow: auto;\\r\\n    }\\r\\n\\r\\n    .item {\\r\\n        flex: 4 4 0;\\r\\n        flex-basis: calc(480px * 0.8);\\r\\n        height: 100%;\\r\\n        box-sizing: border-box;\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        margin: 0 auto;\\r\\n        position: relative;\\r\\n        overflow: auto;\\r\\n        background-image: linear-gradient(to top, white, white),\\r\\n            linear-gradient(to top, white, white),\\r\\n            linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0)),\\r\\n            linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0));\\r\\n        background-position: bottom center, top center, bottom center, top center;\\r\\n        background-color: white;\\r\\n        background-repeat: no-repeat;\\r\\n        background-size: 100% 20px, 100% 20px, 100% 10px, 100% 10px;\\r\\n        background-attachment: local, local, scroll, scroll;\\r\\n    }\\r\\n\\r\\n    .item>div {\\r\\n        margin-bottom: 60px;\\r\\n    }\\r\\n\\r\\n    .menuitem {\\r\\n        align-items: center;\\r\\n        display: flex;\\r\\n        font-weight: 500;\\r\\n        margin-inline-end: 2px;\\r\\n        margin-inline-start: 1px;\\r\\n        min-height: 20px;\\r\\n        padding-bottom: 10px;\\r\\n        padding-inline-start: 23px;\\r\\n        padding-top: 10px;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    .menuitem:hover {\\r\\n        background-color: rgb(0, 0, 0, 6%);\\r\\n    }\\r\\n\\r\\n    .menuitem>div {\\r\\n        padding-inline-end: 12px;\\r\\n    }\\r\\n\\r\\n    .selected {\\r\\n        color: rgb(51, 103, 214) !important;\\r\\n    }\\r\\n\\r\\n    .selected>.icon {\\r\\n        fill: rgb(51, 103, 214) !important;\\r\\n    }\\r\\n\\r\\n    .contain1 {\\r\\n        margin-bottom: 3px;\\r\\n        padding-inline-start: 20px;\\r\\n        padding-inline-end: 20px;\\r\\n        display: flex;\\r\\n        flex-direction: column;\\r\\n        outline: none;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .header .title {\\r\\n        color: #000;\\r\\n        font-size: 108%;\\r\\n        font-weight: 400;\\r\\n        letter-spacing: 0.25px;\\r\\n        margin-bottom: 12px;\\r\\n        outline: none;\\r\\n        padding-bottom: 4px;\\r\\n    }\\r\\n\\r\\n    .card {\\r\\n        border-radius: 4px;\\r\\n        box-shadow: 0px 0px 1px 1px rgb(60 64 67 / 30%);\\r\\n        flex: 1;\\r\\n        color: #000;\\r\\n        line-height: 154%;\\r\\n        user-select: text;\\r\\n        margin-inline: 12px;\\r\\n        margin-bottom: 12px;\\r\\n    }\\r\\n\\r\\n    .contain2 {\\r\\n        align-items: center;\\r\\n        border-top: 1px solid rgba(0, 0, 0, 6%);\\r\\n        display: flex;\\r\\n        min-height: 24px;\\r\\n        padding: 0 20px;\\r\\n        flex-wrap: wrap;\\r\\n        justify-content: flex-end;\\r\\n        background-color: transparent !important;\\r\\n    }\\r\\n\\r\\n    .value {\\r\\n        flex: 1;\\r\\n        flex-basis: 1e-9px;\\r\\n        display: flex;\\r\\n    }\\r\\n\\r\\n    .value>* {\\r\\n        flex: 1;\\r\\n        flex-basis: 1e-9px;\\r\\n        display: flex;\\r\\n        flex-wrap: wrap;\\r\\n        justify-content: flex-end;\\r\\n        align-items: center;\\r\\n        align-content: center;\\r\\n    }\\r\\n\\r\\n    .label {\\r\\n        flex: 1;\\r\\n        flex-basis: 1e-9px;\\r\\n        padding-block-end: 12px;\\r\\n        padding-block-start: 12px;\\r\\n        padding-inline-start: 12px;\\r\\n    }\\r\\n\\r\\n    .switch>.label,\\r\\n    .button>.label,\\r\\n    .select>.label,\\r\\n    .input>.label,\\r\\n    .slider>.label {\\r\\n        flex: 2;\\r\\n    }\\r\\n\\r\\n    .select>.value,\\r\\n    .input>.value,\\r\\n    .slider>.value {\\r\\n        flex: 3;\\r\\n    }\\r\\n\\r\\n    .sub {\\r\\n        color: rgb(95, 99, 104);\\r\\n        font-weight: 400;\\r\\n    }\\r\\n\\r\\n    .icon {\\r\\n        align-items: center;\\r\\n        border-radius: 50%;\\r\\n        display: flex;\\r\\n        height: 20px;\\r\\n        justify-content: center;\\r\\n        position: relative;\\r\\n        width: 20px;\\r\\n        box-sizing: content-box;\\r\\n        background: none;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n</style>';

  // src/core/ui/interface.ts
  var BiliOldInterface = class extends HTMLElement {
    /** 跟节点 */
    _box;
    /** 标题栏 */
    _tool;
    /** 关闭按钮 */
    _close;
    /** 菜单栏 */
    _menu;
    /** 项目栏 */
    _item;
    /** 显示设置 */
    showing = false;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = ui_interface_default;
      this._box = root.children[0];
      this._tool = root.children[0].children[0];
      this._close = root.children[0].children[0].children[0];
      this._menu = root.children[0].children[1].children[0].children[0];
      this._item = root.children[0].children[1].children[0].children[1];
      this._close.innerHTML = svg.fork;
      this._close.addEventListener("click", () => this.hide());
    }
    show() {
      document.body.contains(this) || document.body.appendChild(this);
      this._box.style.display = "block";
      this.showing = true;
    }
    hide() {
      this._box.style.display = "";
      this.showing = false;
    }
    addMenu(menu) {
      this._menu.appendChild(menu);
      const sets = menu.show();
      menu.show = () => {
        this._item.replaceChildren(...sets);
        return sets;
      };
    }
  };
  customElements.get("bili-old") || customElements.define("bili-old", BiliOldInterface);

  // src/core/ui/item.ts
  init_tampermonkey();
  var SettingItem = class extends HTMLDivElement {
    _value = document.createElement("div");
    /**
     * 新建设置项
     * @param id keyof typeof {@link userStatus}
     * @param title 标题
     * @param sub 副标题
     * @param svg 图标
     */
    init(id, title, sub, svg2) {
      this.innerHTML = \`<div class="contain2\${id ? \` \${id}\` : ""}">\${svg2 ? \`<div class="icon">\${svg2}</div>\` : ""}
    <div class="label">\${title}\${sub ? \`<div class="sub">\${sub}</div>\` : ""}</div>
</div>\`;
      this._value.className = "value";
      this.querySelector(".contain2")?.appendChild(this._value);
    }
    /** 添加值 */
    value(value) {
      this._value.appendChild(value);
    }
  };
  customElements.get(\`item-\${"caecec5"}\`) || customElements.define(\`item-\${"caecec5"}\`, SettingItem, { extends: "div" });

  // src/core/ui/menu.ts
  init_tampermonkey();

  // src/core/ui/item-container.ts
  init_tampermonkey();
  var ItemContainer = class extends HTMLDivElement {
    _title;
    /** 设置项容器 */
    _card;
    constructor() {
      super();
      this.innerHTML = \`<div class="contain1">
    <div class="header">
        <h2 class="title"></h2>
    </div>
</div>
<div class="card"></div>\`;
      this._title = this.querySelector(".title");
      this._card = this.querySelector(".card");
    }
    /** 初始化设置项容器 */
    init(title) {
      this._title.textContent = title;
    }
    /**
     * 添加设置
     * @param item 设置项
     */
    addSetting(item) {
      this._card.append(...item);
    }
  };
  customElements.get(\`item-container-\${"caecec5"}\`) || customElements.define(\`item-container-\${"caecec5"}\`, ItemContainer, { extends: "div" });

  // src/core/ui/menu.ts
  var Menuitem = class extends HTMLDivElement {
    container = [new ItemContainer()];
    constructor() {
      super();
      this.addEventListener("click", () => {
        this.parentElement?.querySelector(".selected")?.classList.remove("selected");
        this.classList.add("selected");
        this.show();
      });
    }
    /**
     * 初始化菜单项
     * @param name 标题
     * @param svg 图标
     * @returns 默认设置项容器
     */
    init(name, svg2) {
      this.className = "menuitem";
      this.innerHTML = (svg2 ? \`<div class="icon">\${svg2}</div>\` : "") + name;
      this.container[0].init(name);
      return this.container[0];
    }
    /**
     * 添加设置分组
     * @param name 分组名称
     * @returns 分组设置项容器
     */
    addCard(name) {
      const con = new ItemContainer();
      con.init(name);
      this.container.push(con);
      return con;
    }
    /**
     * 添加设置项到容器
     * @param item 设置项
     * @param i 容器序号
     */
    addSetting(item, i = 0) {
      isArray(item) || (item = [item]);
      item.forEach((d) => {
        d.addEventListener("show", (e) => {
          Promise.resolve(this.click()).then(() => {
            d.scrollIntoView({ behavior: "smooth", block: "start" });
            e.stopPropagation();
          });
        });
      });
      i = Math.min(this.container.length - 1, i);
      this.container[i].addSetting(item);
    }
    /** 显示容器中的设置 */
    show() {
      return this.container;
    }
  };
  customElements.get(\`menuitem-\${"caecec5"}\`) || customElements.define(\`menuitem-\${"caecec5"}\`, Menuitem, { extends: "div" });

  // src/core/ui/utils/checkbox.ts
  init_tampermonkey();

  // src/html/checkbox.html
  var checkbox_default = \`<input type="checkbox" id="checkbox">\\r
<label for="checkbox"></label>\\r
<style>\\r
    input[type="checkbox"] {\\r
        display: none;\\r
    }\\r
\\r
    input~label {\\r
        cursor: pointer;\\r
    }\\r
\\r
    input:checked~label:before {\\r
        content: '\\\\2714';\\r
    }\\r
\\r
    input~label:before {\\r
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
</style>\`;

  // src/core/ui/utils/checkbox.ts
  var CheckBox = class extends HTMLElement {
    _input;
    _text;
    static get observedAttributes() {
      return [
        "label",
        "value"
      ];
    }
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = checkbox_default;
      this._input = root.children[0];
      this._text = root.children[1];
      this._input.addEventListener("change", () => {
        this.setAttribute("value", this._input.checked);
        this.dispatchEvent(new Event("change"));
      });
    }
    /** 是否选中 */
    get value() {
      return this.getAttribute("value") === "true" ? true : false;
    }
    set value(v) {
      v || (v = false);
      this.setAttribute("value", v);
    }
    /** 标签 */
    get label() {
      return this.getAttribute("label");
    }
    set label(v) {
      v || (v = "");
      this.setAttribute("label", v);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue)
        return;
      switch (name) {
        case "label":
          this._text.textContent = newValue;
          break;
        case "value":
          this._input.checked = newValue === "false" ? false : true;
          break;
        default:
          break;
      }
    }
    /** 刷新值 */
    update(value) {
      Object.entries(value).forEach((d) => this[d[0]] = d[1]);
    }
  };
  customElements.get(\`checkbox-\${"caecec5"}\`) || customElements.define(\`checkbox-\${"caecec5"}\`, CheckBox);
  var CheckBoxs = class extends HTMLDivElement {
    \$value = [];
    checkboxs = {};
    get value() {
      return this.\$value;
    }
    set value(v) {
      v.forEach((d) => {
        if (!this.\$value.includes(d)) {
          if (this.checkboxs[d]) {
            this.checkboxs[d].value = true;
          } else {
            this.update(Object.keys(this.checkboxs).concat(d));
            this.checkboxs[d].value = true;
          }
        }
      });
      this.\$value.forEach((d) => {
        v.includes(d) || (this.checkboxs[d].value = false);
      });
      this.\$value = [...v];
    }
    update(labels) {
      labels.forEach((d) => {
        if (!this.checkboxs[d]) {
          const checkbox = new CheckBox();
          checkbox.update({ label: d });
          checkbox.addEventListener("change", () => {
            if (checkbox.value) {
              this.\$value.includes(d) || this.\$value.push(d);
            } else {
              const i = this.\$value.indexOf(d);
              i >= 0 && this.\$value.splice(i, 1);
            }
            this.dispatchEvent(new Event("change"));
          });
          this.appendChild(checkbox);
          this.checkboxs[d] = checkbox;
        }
      });
      this.\$value.forEach((d) => {
        if (!labels.includes(d)) {
          this.checkboxs[d]?.remove();
          const i = this.\$value.indexOf(d);
          i >= 0 && this.\$value.splice(i, 1);
        }
      });
    }
  };
  customElements.get(\`checkboxs-\${"caecec5"}\`) || customElements.define(\`checkboxs-\${"caecec5"}\`, CheckBoxs, { extends: "div" });

  // src/core/ui/utils/input.ts
  init_tampermonkey();

  // src/html/input.html
  var input_default = '<div class="input"><input>\\r\\n    <ul class="input-list"></ul>\\r\\n</div>\\r\\n<style type="text/css">\\r\\n    .input {\\r\\n        width: 100%;\\r\\n        display: inline-block;\\r\\n        position: relative;\\r\\n        border: 0;\\r\\n        overflow: visible;\\r\\n        white-space: nowrap;\\r\\n        height: 24px;\\r\\n        line-height: 24px;\\r\\n        cursor: pointer;\\r\\n        font-size: 12px;\\r\\n    }\\r\\n\\r\\n    .input input {\\r\\n        height: 24px;\\r\\n        line-height: 24px;\\r\\n        display: inline;\\r\\n        user-select: auto;\\r\\n        text-decoration: none;\\r\\n        outline: none;\\r\\n        width: calc(100% - 10px);\\r\\n        background: transparent;\\r\\n        padding: 0 5px;\\r\\n        border: 1px solid #ccd0d7;\\r\\n        border-radius: 4px;\\r\\n    }\\r\\n\\r\\n    .input input:focus {\\r\\n        border-color: #00a1d6;\\r\\n    }\\r\\n\\r\\n    .input-list {\\r\\n        display: none;\\r\\n        margin: 0;\\r\\n        width: 100%;\\r\\n        padding: 0;\\r\\n        border-radius: 0 0 4px 4px;\\r\\n        max-height: 120px;\\r\\n        background-color: #fff;\\r\\n        border: 1px solid #ccd0d7;\\r\\n        box-shadow: 0 0 2px 0 #ccd0d7;\\r\\n        position: absolute;\\r\\n        left: -1px;\\r\\n        right: auto;\\r\\n        z-index: 2;\\r\\n        overflow: hidden auto;\\r\\n        white-space: nowrap;\\r\\n    }\\r\\n\\r\\n    .input:hover .input-list {\\r\\n        display: block;\\r\\n    }\\r\\n\\r\\n    .input-list-row {\\r\\n        padding: 0 5px;\\r\\n        transition: background-color .3s;\\r\\n        line-height: 30px;\\r\\n        height: 30px;\\r\\n        font-size: 12px;\\r\\n        cursor: pointer;\\r\\n        color: #222;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .input-list-row:hover {\\r\\n        background-color: #f4f5f7;\\r\\n        color: #6d757a;\\r\\n    }\\r\\n\\r\\n    .cancel {\\r\\n        position: absolute;\\r\\n        right: 0;\\r\\n        top: 0px;\\r\\n        width: 38px;\\r\\n        height: 28px;\\r\\n        background: url(//static.hdslb.com/images/base/icons.png) -461px -530px no-repeat;\\r\\n    }\\r\\n\\r\\n    .input-list-row:hover .cancel {\\r\\n        background-position: -525px -530px;\\r\\n    }\\r\\n</style>\\r\\n<style type="text/css">\\r\\n    ::-webkit-scrollbar {\\r\\n        width: 7px;\\r\\n        height: 7px;\\r\\n    }\\r\\n\\r\\n    ::-webkit-scrollbar-track {\\r\\n        border-radius: 4px;\\r\\n        background-color: #EEE;\\r\\n    }\\r\\n\\r\\n    ::-webkit-scrollbar-thumb {\\r\\n        border-radius: 4px;\\r\\n        background-color: #999;\\r\\n    }\\r\\n</style>';

  // src/core/ui/utils/input.ts
  var InputArea = class extends HTMLElement {
    _input;
    _ul;
    \$prop = {};
    \$value = "";
    \$candidate = [];
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = input_default;
      this._input = root.children[0].children[0];
      this._ul = root.children[0].children[1];
      this._input.addEventListener("change", () => {
        this.\$value = this.\$prop.type === "file" ? this._input.files : this._input.value;
        this.dispatchEvent(new Event("change"));
      });
    }
    /** input标签属性 */
    get prop() {
      return this.\$prop;
    }
    set prop(v) {
      this.\$prop = v;
      Object.entries(v).forEach((d) => this._input.setAttribute(...d));
    }
    /** 输入框值 */
    get value() {
      return this.\$value;
    }
    set value(v) {
      if (this.\$value === v)
        return;
      this.\$value = v || "";
      this._input.value = this.\$value;
    }
    /** 候选值 */
    get candidate() {
      return this.\$candidate;
    }
    set candidate(v) {
      this.\$candidate = v;
      this._ul.replaceChildren(...v.map((d, i, t) => {
        const li = document.createElement("li");
        li.className = "input-list-row";
        li.addEventListener("click", (e) => {
          this.value = d;
          e.stopPropagation();
          this.dispatchEvent(new Event("change"));
        });
        const span = document.createElement("span");
        span.textContent = d;
        const div = document.createElement("div");
        div.className = "cancel";
        div.addEventListener("click", (e) => {
          t.splice(i, 1);
          li.remove();
          e.stopPropagation();
        });
        li.append(span, div);
        return li;
      }));
    }
    /** 刷新值 */
    update(value) {
      Object.entries(value).forEach((d) => this[d[0]] = d[1]);
    }
  };
  customElements.get(\`input-\${"caecec5"}\`) || customElements.define(\`input-\${"caecec5"}\`, InputArea);

  // src/core/ui/utils/select.ts
  init_tampermonkey();

  // src/html/select.html
  var select_default = '<div class="selectmenu">\\r\\n    <div class="selectmenu-txt"><span></span></div>\\r\\n    <div class="selectmenu-arrow arrow-down"></div>\\r\\n    <ul class="selectmenu-list"></ul>\\r\\n</div>\\r\\n<style type="text/css">\\r\\n    .selectmenu {\\r\\n        width: 100%;\\r\\n        display: inline-block;\\r\\n        position: relative;\\r\\n        border: 1px solid #ccd0d7;\\r\\n        border-radius: 4px;\\r\\n        overflow: visible;\\r\\n        white-space: nowrap;\\r\\n        height: 24px;\\r\\n        line-height: 24px;\\r\\n        cursor: pointer;\\r\\n        font-size: 12px;\\r\\n    }\\r\\n\\r\\n    .selectmenu-txt {\\r\\n        display: inline-block;\\r\\n        overflow: hidden;\\r\\n        vertical-align: top;\\r\\n        text-overflow: ellipsis;\\r\\n        padding: 0 5px;\\r\\n        height: 24px;\\r\\n        line-height: 24px;\\r\\n    }\\r\\n\\r\\n    .selectmenu-arrow {\\r\\n        position: absolute;\\r\\n        background-color: transparent;\\r\\n        top: 0;\\r\\n        right: 4px;\\r\\n        z-index: 0;\\r\\n        border-radius: 4px;\\r\\n        width: 20px;\\r\\n        height: 100%;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    .arrow-down:before {\\r\\n        margin: 0 auto;\\r\\n        margin-top: 8px;\\r\\n        width: 0;\\r\\n        height: 0;\\r\\n        display: block;\\r\\n        border-width: 4px 4px 0;\\r\\n        border-style: solid;\\r\\n        border-color: #99a2aa transparent transparent;\\r\\n        position: relative;\\r\\n        content: "";\\r\\n    }\\r\\n\\r\\n    .selectmenu-list {\\r\\n        display: none;\\r\\n        margin: 0;\\r\\n        width: 100%;\\r\\n        padding: 0;\\r\\n        max-height: 120px;\\r\\n        background-color: #fff;\\r\\n        border: 1px solid #ccd0d7;\\r\\n        box-shadow: 0 0 2px 0 #ccd0d7;\\r\\n        position: absolute;\\r\\n        left: -1px;\\r\\n        right: auto;\\r\\n        z-index: 2;\\r\\n        overflow: hidden auto;\\r\\n        white-space: nowrap;\\r\\n    }\\r\\n\\r\\n    .selectmenu:hover .selectmenu-list {\\r\\n        display: block;\\r\\n    }\\r\\n\\r\\n    .selectmenu-list-row {\\r\\n        padding: 0 5px;\\r\\n        transition: background-color .3s;\\r\\n        line-height: 30px;\\r\\n        height: 30px;\\r\\n        font-size: 12px;\\r\\n        cursor: pointer;\\r\\n        color: #222;\\r\\n    }\\r\\n\\r\\n    .selectmenu-list-row:hover {\\r\\n        background-color: #f4f5f7;\\r\\n        color: #6d757a;\\r\\n    }\\r\\n</style>\\r\\n<style type="text/css">\\r\\n    ::-webkit-scrollbar {\\r\\n        width: 7px;\\r\\n        height: 7px;\\r\\n    }\\r\\n\\r\\n    ::-webkit-scrollbar-track {\\r\\n        border-radius: 4px;\\r\\n        background-color: #EEE;\\r\\n    }\\r\\n\\r\\n    ::-webkit-scrollbar-thumb {\\r\\n        border-radius: 4px;\\r\\n        background-color: #999;\\r\\n    }\\r\\n</style>';

  // src/core/ui/utils/select.ts
  var SelectMenu = class extends HTMLElement {
    _text;
    _list;
    \$value = "";
    \$candidate = [];
    \$styles = {};
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = select_default;
      this._text = root.children[0].children[0].children[0];
      this._list = root.children[0].children[2];
    }
    /** 当前值 */
    get value() {
      return this.\$value;
    }
    set value(v) {
      if (this.\$value === v)
        return;
      this.\$value = v || "";
      this._text.textContent = v || "";
      v && this.\$styles[v] && this._text.setAttribute("style", this.\$styles[v]);
    }
    /** 候选值 */
    get candidate() {
      return this.\$candidate;
    }
    set candidate(v) {
      this.\$candidate = v;
      this._list.replaceChildren(...v.map((d, i, t) => {
        const li = document.createElement("li");
        li.className = "selectmenu-list-row";
        li.addEventListener("click", (e) => {
          this.value = d;
          this.dispatchEvent(new Event("change"));
          e.stopPropagation();
        });
        const span = document.createElement("span");
        span.textContent = d;
        this.\$styles[d] && span.setAttribute("style", this.\$styles[d]);
        li.appendChild(span);
        return li;
      }));
    }
    /** 候选值对应的行内应该 格式 => 候选值: 样式 */
    get styles() {
      return this.\$styles;
    }
    set styles(v) {
      this.\$styles = v;
      this.candidate = this.candidate;
    }
    /** 刷新值 */
    update(value) {
      Object.entries(value).forEach((d) => this[d[0]] = d[1]);
    }
  };
  customElements.get(\`select-\${"caecec5"}\`) || customElements.define(\`select-\${"caecec5"}\`, SelectMenu);

  // src/core/ui/utils/slider.ts
  init_tampermonkey();

  // src/html/slider.html
  var slider_default = '<div class="block">\\r\\n    <div class="slider">\\r\\n        <div class="slider-tracker-wrp">\\r\\n            <div class="slider-tracker">\\r\\n                <div class="slider-handle">\\r\\n                    <div class="slider-hint"></div>\\r\\n                </div>\\r\\n                <div class="slider-progress"></div>\\r\\n            </div>\\r\\n        </div>\\r\\n    </div>\\r\\n</div>\\r\\n<style type="text/css">\\r\\n    .block {\\r\\n        vertical-align: top;\\r\\n        display: inline-block;\\r\\n        width: 100%;\\r\\n    }\\r\\n\\r\\n    .slider {\\r\\n        width: 100%;\\r\\n        height: 13px;\\r\\n        clear: both;\\r\\n        position: relative;\\r\\n    }\\r\\n\\r\\n    .slider-tracker-wrp {\\r\\n        position: relative;\\r\\n        width: 100%;\\r\\n        height: 100%;\\r\\n        cursor: pointer;\\r\\n    }\\r\\n\\r\\n    .slider-tracker {\\r\\n        position: absolute;\\r\\n        width: 100%;\\r\\n        height: 6px;\\r\\n        left: 0;\\r\\n        border-radius: 4px;\\r\\n        top: 50%;\\r\\n        margin-top: -3px;\\r\\n        background-color: #e5e9ef;\\r\\n    }\\r\\n\\r\\n    .slider-handle {\\r\\n        position: absolute;\\r\\n        top: -4px;\\r\\n        height: 14px;\\r\\n        width: 14px;\\r\\n        border-radius: 7px;\\r\\n        cursor: pointer;\\r\\n        z-index: 1;\\r\\n        margin-left: -7px;\\r\\n        box-shadow: 0 0 3px #017cc3;\\r\\n        background-color: #fff;\\r\\n        transition: box-shadow .3s;\\r\\n    }\\r\\n\\r\\n    .slider-handle:hover {\\r\\n        box-shadow: 0 0 5px #017cc3;\\r\\n    }\\r\\n\\r\\n    .slider-hint {\\r\\n        display: none;\\r\\n        position: absolute;\\r\\n        top: -21px;\\r\\n        white-space: nowrap;\\r\\n        border-radius: 4px;\\r\\n        background-color: hsla(0, 0%, 100%, .8);\\r\\n        padding: 0 3px;\\r\\n        border: 1px solid #fafafa;\\r\\n        z-index: 1;\\r\\n        transform: translateX(-25%);\\r\\n        user-select: none;\\r\\n    }\\r\\n\\r\\n    .slider-progress {\\r\\n        width: 0;\\r\\n        height: 100%;\\r\\n        border-radius: 4px;\\r\\n        background-color: #00a1d6;\\r\\n        position: relative;\\r\\n    }\\r\\n</style>';

  // src/core/ui/utils/slider.ts
  function offset(node) {
    const result = {
      top: 0,
      left: 0
    };
    const onwer = node.ownerDocument;
    if (node === onwer.body) {
      result.top = node.offsetTop;
      result.left = node.offsetLeft;
    } else {
      let rect = void 0;
      try {
        rect = node.getBoundingClientRect();
      } catch {
      }
      if (!rect || !onwer.documentElement.contains(node)) {
        rect && (result.top = rect.top, result.left = rect.left);
        return result;
      }
      result.top = rect.top + onwer.body.scrollTop - onwer.documentElement.clientTop;
      result.left = rect.left + onwer.body.scrollLeft - onwer.documentElement.clientLeft;
    }
    return result;
  }
  var SliderBlock = class extends HTMLElement {
    _handle;
    _progress;
    _hinter;
    _wrp;
    \$value = 0;
    \$min = 0;
    \$max = 100;
    \$precision = 100;
    \$hint = true;
    \$solid = false;
    \$vertical = false;
    showChange;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = slider_default;
      this._handle = root.children[0].children[0].children[0].children[0].children[0];
      this._progress = root.children[0].children[0].children[0].children[0].children[1];
      this._hinter = root.children[0].children[0].children[0].children[0].children[0].children[0];
      this._wrp = root.children[0].children[0].children[0];
      const mouseLinster = (e) => {
        const { pageX, pageY } = e;
        const offsetX = this.\$vertical ? pageY - offset(this._wrp).top - 7 : pageX - offset(this._wrp).left - 7;
        const allX = this._wrp.offsetWidth - 14;
        const pv = (0 > offsetX ? 0 : offsetX > allX ? allX : offsetX) / allX;
        this.value = (this.\$max - this.\$min) * Math.round(pv * this.\$precision) / this.\$precision + this.\$min;
        this.dispatchEvent(new Event("change"));
      };
      this.addEventListener("click", mouseLinster);
      const mouseClear = () => {
        window.removeEventListener("mousemove", mouseLinster);
        window.removeEventListener("mouseup", mouseClear);
      };
      this._handle.addEventListener("mousedown", () => {
        window.addEventListener("mousemove", mouseLinster);
        window.addEventListener("mouseup", mouseClear);
      });
      this._handle.addEventListener("mouseover", () => this.showChange());
      let nHint = 0;
      this.showChange = () => {
        const pv = (this.\$value - this.\$min) / (this.\$max - this.\$min);
        this._handle.style.cssText = \`left: \${(pv * (this._wrp.offsetWidth - 14) + 7) / this._wrp.offsetWidth * 100}%;\`;
        this._progress.style.cssText = \`width: \${pv * 100}%;\`;
        if (this.\$hint) {
          this._hinter.textContent = this.\$value;
          if (this._hinter.style.display !== "block")
            this._hinter.style.display = "block";
          if (this.\$solid)
            return;
          clearTimeout(nHint);
          nHint = setTimeout(() => this._hinter.style.display = "", 300);
        }
        ;
      };
    }
    /** 默认值 */
    get value() {
      return this.\$value;
    }
    set value(v) {
      if (this.\$vertical)
        v = this.\$max - v + this.\$min;
      v = (this.\$max - this.\$min) * Math.round((v - this.\$min) / (this.\$max - this.\$min) * this.\$precision) / this.\$precision + this.\$min;
      if (v === this.\$value)
        return;
      this.\$value = v;
      this.showChange();
    }
    /** 最小值 */
    get min() {
      return this.\$min;
    }
    set min(v) {
      if (v === this.\$min || v >= this.\$max)
        return;
      this.\$min = v;
      if (v > this.\$value)
        this.value = v;
      this.showChange();
    }
    /** 最大值 */
    get max() {
      return this.\$max;
    }
    set max(v) {
      if (v === this.\$max || v <= this.\$min)
        return;
      this.\$max = v;
      if (v < this.\$value)
        this.value = v;
      this.showChange();
    }
    /** 刻度数 */
    get precision() {
      return this.\$precision;
    }
    set precision(v) {
      if (v === this.\$precision)
        return;
      this.\$precision = v;
      this.value = this.\$value;
    }
    /** 提示信息 */
    get hint() {
      return this.\$hint;
    }
    set hint(v) {
      if (v === this.\$hint)
        return;
      this.\$hint = v;
    }
    /** 固化提示 */
    get solid() {
      return this.\$solid;
    }
    set solid(v) {
      if (v === this.\$solid)
        return;
      this.\$solid = v;
      this.showChange();
    }
    /** 垂直 */
    get vertical() {
      return this.\$vertical;
    }
    set vertical(v) {
      if (v === this.\$vertical)
        return;
      this.\$vertical = v;
      this.style.transform = v ? "rotate(-90deg)" : "";
    }
    connectedCallback() {
      this.showChange();
    }
    adoptedCallback() {
      this.showChange();
    }
    /** 刷新值 */
    update(value) {
      Object.entries(value).forEach((d) => this[d[0]] = d[1]);
    }
  };
  customElements.get(\`slider-\${"caecec5"}\`) || customElements.define(\`slider-\${"caecec5"}\`, SliderBlock);

  // src/core/ui/utils/switch.ts
  init_tampermonkey();

  // src/html/switch.html
  var switch_default = '<div class="switch">\\r\\n    <span class="bar"></span>\\r\\n    <span class="knob">\\r\\n        <i class="circle"></i>\\r\\n    </span>\\r\\n</div>\\r\\n<style type="text/css">\\r\\n    .switch {\\r\\n        cursor: pointer;\\r\\n        display: block;\\r\\n        min-width: 34px;\\r\\n        outline: none;\\r\\n        position: relative;\\r\\n        width: 34px;\\r\\n    }\\r\\n\\r\\n    .bar {\\r\\n        background-color: rgb(189, 193, 198);\\r\\n        border-radius: 8px;\\r\\n        height: 12px;\\r\\n        left: 3px;\\r\\n        position: absolute;\\r\\n        top: 2px;\\r\\n        transition: background-color linear 80ms;\\r\\n        width: 28px;\\r\\n        z-index: 0;\\r\\n    }\\r\\n\\r\\n    .bar[checked] {\\r\\n        background-color: rgb(26, 115, 232);\\r\\n        opacity: 0.5;\\r\\n    }\\r\\n\\r\\n    .bar:active {\\r\\n        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);\\r\\n    }\\r\\n\\r\\n    .knob {\\r\\n        background-color: #fff;\\r\\n        border-radius: 50%;\\r\\n        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 40%);\\r\\n        display: block;\\r\\n        height: 16px;\\r\\n        position: relative;\\r\\n        transition: transform linear 80ms, background-color linear 80ms;\\r\\n        width: 16px;\\r\\n        z-index: 1;\\r\\n    }\\r\\n\\r\\n    .knob[checked] {\\r\\n        background-color: rgb(26, 115, 232);\\r\\n        transform: translate3d(18px, 0, 0);\\r\\n    }\\r\\n\\r\\n    .knob:active {\\r\\n        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);\\r\\n    }\\r\\n\\r\\n    .knob i {\\r\\n        color: rgba(128, 134, 139, 15%);\\r\\n        height: 40px;\\r\\n        left: -12px;\\r\\n        pointer-events: none;\\r\\n        top: -12px;\\r\\n        transition: color linear 80ms;\\r\\n        width: 40px;\\r\\n        border-radius: 50%;\\r\\n        bottom: 0;\\r\\n        display: block;\\r\\n        overflow: hidden;\\r\\n        position: absolute;\\r\\n        right: 0;\\r\\n        transform: translate3d(0, 0, 0);\\r\\n    }\\r\\n\\r\\n    .knob i[checked] {\\r\\n        color: rgb(26, 115, 232);\\r\\n    }\\r\\n\\r\\n    .knob i:active {\\r\\n        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);\\r\\n    }\\r\\n</style>';

  // src/core/ui/utils/switch.ts
  var SwitchButton = class extends HTMLElement {
    _bar;
    _knob;
    _circle;
    \$value = false;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "closed" });
      root.innerHTML = switch_default;
      this._bar = root.children[0].children[0];
      this._knob = root.children[0].children[1];
      this._circle = root.children[0].children[1].children[0];
      root.children[0].addEventListener("click", (e) => {
        this.value = !this.\$value;
        e.stopPropagation();
        this.dispatchEvent(new Event("change"));
      });
    }
    get value() {
      return this.\$value;
    }
    set value(v) {
      if (this.\$value === v)
        return;
      if (v) {
        this._bar.setAttribute("checked", "checked");
        this._knob.setAttribute("checked", "checked");
        this._circle.setAttribute("checked", "checked");
      } else {
        this._bar.removeAttribute("checked");
        this._knob.removeAttribute("checked");
        this._circle.removeAttribute("checked");
      }
      this.\$value = v;
    }
    /** 刷新值 */
    update(value) {
      value === void 0 || (this.value = value);
      return this;
    }
  };
  customElements.get(\`switch-\${"caecec5"}\`) || customElements.define(\`switch-\${"caecec5"}\`, SwitchButton);

  // src/core/ui.ts
  var Menus = {
    common: ["通用", svg.wrench],
    rewrite: ["重写", svg.note],
    danmaku: ["弹幕", svg.dmset],
    restore: ["修复", svg.stethoscope],
    player: ["播放", svg.play],
    style: ["样式", svg.palette],
    download: ["下载", svg.download]
  };
  var UI = class {
    entry = new BilioldEntry();
    interface = new BiliOldInterface();
    menuitem = {};
    settingItem = {};
    constructor() {
      this.initMenu();
      this.initSettings();
      poll(() => document.readyState === "complete", () => {
        this.entry.type = user.userStatus.uiEntryType;
        document.body.appendChild(this.entry);
        this.updateCheck();
      }, 1e3, 0);
      this.entry.addEventListener("click", (e) => {
        this.show();
        e.stopPropagation();
      });
    }
    /** 检查播放器脚本更新 */
    async updateCheck() {
      if (user.userStatus.bilibiliplayer && user.userStatus.checkUpdate) {
        const version = await GM.getValue("version");
        if (version !== BLOD.version) {
          player.loadplayer(true);
        }
      }
    }
    /** 初始化菜单 */
    initMenu() {
      Object.entries(Menus).forEach((d) => {
        const menu = new Menuitem();
        this.menuitem[d[0]] = menu;
        menu.init(d[1][0], d[1][1]);
        this.interface.addMenu(menu);
      });
    }
    /** 初始化设置项 */
    initSettings() {
      this.initSettingCommon();
      this.initSettingRewrite();
      this.initSettingStyle();
      this.initSettingRestore();
      this.initSettingPlayer();
      this.initSettingDanmaku();
      this.initSettingDownload();
    }
    /** 通用设置 */
    initSettingCommon() {
      this.menuitem.common.addSetting([
        this.switch("development", "开发者模式", "暴露调试接口到控制台", svg.warn, (v) => {
          if (v) {
            propertyHook(window, "BLOD", BLOD);
          } else {
            Reflect.deleteProperty(window, "BLOD");
          }
        }, "暴露一个名为【BLOD】的对象到全局，你可以在浏览器控制台里使用内部的属性及方法进行调试。"),
        this.switch("disableReport", "数据上报", "禁止网页跟踪上报", svg.linechart),
        this.select("uiEntryType", "设置入口样式", {
          candidate: ["old", "new"]
        }, "浮动齿轮或者贴边隐藏", svg.gear, (v) => this.entry.type = v, "【old】入口更具隐蔽性，鼠标移动到贴边位置才会浮现。【new】入口每次网页加载完成都会滚动浮现，隐藏会鼠标移动到对应位置便会浮现。"),
        this.button("userStatus", "管理设置数据", () => {
          alert([
            "备份脚本设置或者恢复已备份的数据。",
            "当调整的选项过多时，备份一下是一个良好的主意，以免因为意外重复第二次操作。"
          ], "备份还原", [
            {
              text: "默认",
              callback: () => user.restoreUserStatus()
            },
            {
              text: "导出",
              callback: () => user.outputUserStatus()
            },
            {
              text: "导入",
              callback: () => user.inputUserStatus()
            }
          ]);
        }, "备份/恢复", "管理", svg.blind),
        this.switch("bilibiliplayer", "重构播放器", "修复及增强", svg.play, (v) => {
          if (v) {
            this.updateCheck();
          }
        }, "旧版播放器已于 2019-10-31T07:38:36.004Z 失去官方维护，为了旧版播放器长期可持续维护，我们使用typescript完全重构了旧版播放器。修复了旧版播放器出现异常或失效的功能（如无法获取90分钟以后的弹幕问题），移植了一些B站后续推出的功能（如互动视频、全景视频、杜比视界、杜比全景声、AV1编码支持和DRM支持等）。能力有限无法做到100%复刻，如果您想体验原生的旧版播放器，可以禁用本功能。同时由于项目托管于Github，国内部分网络环境可能访问不畅，初次启动播放器可能耗时较久，加载失败后也会回滚原生播放器。如果您的网络环境始终无法正常加载，也请禁用本功能或者前往反馈。"),
        this.select("cdn", "CDN", {
          candidate: ["Github", "jsdelivr"]
        }, "更新外部资源", svg.net, void 0, "用于加载外部资源的CDN，一般而言jsdelivr比GitHub好些，然而部分网路环境可能二者都无法访问。")
      ]);
      this.menuitem.common.addCard("toastr");
      this.menuitem.common.addSetting([
        this.switch("toast.disabled", "禁用", '<a href="https://github.com/CodeSeven/toastr" target="_blank">toastr</a>', void 0, (v) => toast.disabled = v),
        this.switch("toast.rtl", "镜像", "左右翻转", void 0, (v) => toast.rtl = v),
        this.select("toast.position", "位置", {
          candidate: ["top-left", "top-center", "top-right", "top-full-width", "bottom-left", "bottom-right", "bottom-center", "bottom-full-width"]
        }, "相对屏幕", void 0, (v) => toast.position = v),
        this.slider("toast.delay", "时长", {
          min: 2,
          max: 60,
          precision: 58
        }, "单位：/秒", void 0, (v) => toast.delay = v),
        this.select("toast.type", "类型", {
          candidate: ["info", "success", "warning", "error"],
          styles: {
            info: "color: #2F96B4",
            success: "color: #51A351",
            warning: "color: #F89406",
            error: "color: #BD362F"
          }
        }, "测试限定"),
        this.inputCustom("toast.test", "测试", {
          candidate: ["Hello World!"]
        }, (v) => {
          try {
            toast.toast(user.userStatus.toast.delay, this.BLOD.status.toast.type, v);
          } catch (e) {
            toast.error("非常抱歉！发生了错误", e);
          }
        }, "请输入一句话~")
      ], 1);
      this.menuitem.common.addCard("账户授权");
      this.menuitem.common.addSetting([
        this.input("accessKey.token", "token", {
          prop: { type: "text", readonly: "readonly" }
        }, "access_key", void 0, void 0, "鉴权。效果等同于网页端的cookie，B站服务器用以识别您的登录身份。本脚本只会在您本地保存鉴权，绝对不会泄露出去，唯一的例外是如果启用了【解除区域限制】功能并选择自定义服务器，则会向代理服务器发送鉴权，我们无法保证第三方服务器如何使用您的鉴权，所以万请自行必确认代理服务器的可信度，<strong>三思而后行</strong>！"),
        this.input("accessKey.dateStr", "授权日期", {
          prop: { type: "text", readonly: "readonly" }
        }, "有效期一般为一个月", void 0, void 0, "脚本不会代为检查鉴权是否失效，请失效时自行重新授权。"),
        this.button("accessKey.action", "进行授权", () => {
          new AccessKey();
        }, "授权脚本使用登录鉴权", "授权", svg.warn)
      ], 2);
      if (true) {
        this.menuitem.common.addSetting([
          this.switch("checkUpdate", "检查更新", "自动更新播放器", svg.download, void 0, "启用【重构播放器】后，脚本会自动检查并更新播放器组件，但可能因为网络原因更新失败，出现反复更新->反复失败的问题。您可以禁用此功能，以继续使用【重构播放器】，等待网络环境改善后再尝试启用。")
        ]);
      }
    }
    /** 重写设置 */
    initSettingRewrite() {
      this.menuitem.rewrite.addSetting([
        this.switch("av", "av/BV", "恢复旧版av页"),
        this.switch("bangumi", "bangumi", "恢复旧版bangumi页"),
        this.switch("watchlater", "稍后再看", "恢复旧版稍后再看"),
        this.switch("playlist", "播单", "恢复旧版播单页"),
        this.switch("index", "主页", "恢复旧版Bilibili主页"),
        this.switch("player", "播放器", "替换其他未重写页面的播放器"),
        this.switch("read", "专栏", "恢复旧版专栏"),
        this.switch("ranking", "排行榜", "恢复旧版全站排行榜页"),
        this.switch("search", "搜索", "恢复旧版搜索页"),
        this.switch("album", "相簿", "恢复相簿页")
      ]);
    }
    /** 弹幕设置 */
    initSettingDanmaku() {
      this.menuitem.danmaku.addSetting([
        this.switch("dmproto", "proto弹幕", "protobuf弹幕支持", void 0, void 0, "因为B站已放弃维护xml弹幕，带来一些问题，比如90分钟后无弹幕，所以此项不建议禁用。【重构播放器】默认启用且不受此项影响。"),
        this.switch("dmwrap", "弹幕提权", "允许普权弹幕排版", void 0, void 0, "上古时代存在大量使用换行及空格等特殊字符来提权以达到高级弹幕效果的作品，在html5时代无法正常显示，启用此项将恢复普权弹幕排版效果。尽情享受弹幕艺术。【重构播放器】默认启用且不受此项影响。"),
        this.select("dmExtension", "弹幕格式", {
          candidate: ["xml", "json"]
        }, "拓展名", void 0, void 0, "【下载弹幕】及【本地弹幕】使用的弹幕格式，xml是传统格式，json是protobuf弹幕实际格式，前者一般拥有更小的体积，只是可能丢失彩蛋及部分非法字符。"),
        this.switch("dmContact", "合并弹幕", "本地弹幕或在线弹幕", void 0, void 0, "选择【本地弹幕】或【在线弹幕】是否与播放器内已有弹幕合并。"),
        this.inputCustom("onlineDm", "在线弹幕", {
          prop: { placeholder: "ss3398" }
        }, (v) => {
          v && typeof v === "string" && danmaku.onlineDm(v);
        }, "从其他视频加载弹幕", void 0, "从其他B站视频加载弹幕，可以输入关键url或者查询参数，如：<br/>av806828803<br/>av806828803?p=1<br/>aid=806828803&p=1<br/>ss3398<br/>ep84795<br/>注意：【重构播放器】此处加载的弹幕会替换【下载弹幕】的内容！"),
        this.button("localDm", "本地弹幕", () => {
          user.userStatus.dmExtension === "json" ? danmaku.localDmJson() : danmaku.localDmXml();
        }, "加载本地磁盘上的弹幕", "打开", void 0, "从本地磁盘上加载弹幕文件，来源可以是下载功能下载的弹幕，拓展名.xml或.json，编码utf-8。【合并弹幕】项能选择是否与播放器内已有弹幕合并。"),
        this.switch("danmakuProtect", "弹幕保护计划", '<a href="https://github.com/MotooriKashin/Bilibili-Old/blob/master/danmaku/README.md" target="_blank">查看目录</a>', void 0, void 0, "上古弹幕作品很多高级弹幕都丢失了，幸好本项目备份了一些。启用本功能将自动识别对应作品并使用【在线弹幕】功能加载备份的弹幕，找回曾经的感动。<br>※部分4:3视频请以播放器原始形态观看获取最佳体验，不推荐全屏。")
      ]);
    }
    /** 样式设置 */
    initSettingStyle() {
      this.menuitem.style.addSetting([
        this.switch("header", "恢复旧版顶栏", "替换所有B站页面中的顶栏为旧版", void 0, void 0, "除非替换后实在不和谐，一般都会进行替换。"),
        this.switch("comment", "恢复评论翻页", "替换瀑布流评论区", void 0, void 0, "评论区版本将被固定，可能享受不到B站后续为评论区推出的新功能。本功能有专门独立为一个脚本，不要重复安装。"),
        this.switch("staff", "合作UP主", "联合投稿显示合作UP主", void 0, void 0, "在原av页up主信息处列出所有合作up主。"),
        this.switch("bangumiEplist", "保留bangumi分P", "牺牲特殊背景图", void 0, void 0, "旧版bangumi遇到有特殊背景图的视频时，会隐藏播放器下方的分集选择界面，二者不可得兼。"),
        this.switch("jointime", "注册时间", "个人空间显示账户注册时间"),
        this.switch("history", "纯视频历史", "过滤历史记录页的非视频部分"),
        this.switch("liveRecord", "录屏动态", "允许动态页显示直播录屏"),
        this.switch("commentJumpUrlTitle", "评论超链接标题", "还原为链接或短链接", void 0, void 0, "直接显示链接标题固然方便，但有些时候还是直接显示链接合适。"),
        this.switch("like", "添加点赞功能", "不支持一键三连"),
        this.switch("fullBannerCover", "修正banner分辨率", "顶栏banner完整显示不裁剪", void 0, void 0, "旧版顶栏banner接口已不再更新，脚本使用新版banner接口进行修复，但二者图片分辨率不一致。脚本默认不会去动页面样式以尽可能原汁原味还原旧版页面，导致顶栏banner被裁剪显示不全，启用本项将调整顶栏分辨率以完整显示图片。"),
        this.switch("episodeData", "分集数据", "bangumi", void 0, void 0, "显示bangumi分集播放和弹幕数，原始合计数据移动到鼠标浮动提示中。"),
        this.switch("simpleChinese", "繁 -> 简", "将繁体字幕翻译为简体", void 0, void 0, "识别并替换CC字幕繁体并转化为简体，使用内置的简繁对照表机械翻译。")
      ]);
    }
    /** 修复设置 */
    initSettingRestore() {
      this.menuitem.restore.addSetting([
        this.switch("lostVideo", "失效视频", "尝试获取失效视频信息", void 0, void 0, "修复收藏的失效视频的封面和标题信息，并以红色删除线标记。使用缓存数据恢复的页面重构av页默认开启且不受此项影响，其中部分上古失效视频甚至还保留了评论区。"),
        this.switch("disableSleepChcek", "禁用直播间挂机检测", "就喜欢挂后台听个响不行吗！"),
        this.switch("show1080p", "不登录高画质支持", "dash模式限定", void 0, (v) => {
          if (v && !user.userStatus.accessKey.token) {
            toast.warning("需要启用【账户授权】功能！");
            alert("需要启用【账户授权】功能！是否前往？", "【账户授权】", [{ text: "前往【账户授权】", callback: () => this.show("accessKey.token") }]);
            user.userStatus.show1080p = false;
          }
        }, "B站砍掉了不登录能获取的画质，最多只能获取480P。您可以启用【账户授权】功能，授权本脚本使用您的登录信息，如此您退出登录后依然能获取高画质视频流。本功能只会在请求播放源时添加上登录鉴权，不影响页面其他功能的未登录状态，B站也不会记录您的播放记录。本功能适用于那些经常用浏览器无痕模式上B站的用户。若<strong>非常抱歉</strong>报错请关闭本选项！"),
        this.switch("timeLine", "港澳台新番时间表", "填充首页番剧板块", void 0, void 0, "在首页番剧板块中填充港澳台最新番剧更新信息。只提取了最新的30条番剧信息，所以数据中可能不会包含过于久远的更新。本功能只能显示已更新的番剧信息，而不能作为即将更新番剧的预测。"),
        this.switch("searchAllArea", "全区域搜索", "还原港澳台Bangumi结果", void 0, void 0, "替换搜索页面默认搜索结果，使能够搜索到港澳台bangumi。需要特别注意搜索关键词，港澳台译名通常与简中译名不一致，但也不强制要求繁体，如：<br>别当欧尼酱了 -> 不当哥哥了/不當哥哥了<br>本功能只在默认搜索时生效，更改搜索范围无效。另外，启用本功能搜索到的bangumi会丢失ep列表。")
      ]);
    }
    /** 播放设置 */
    initSettingPlayer() {
      this.menuitem.player.addSetting([
        this.sliderCustom("playbackRate", "播放速率", {
          min: 0.25,
          max: 5,
          precision: 95,
          value: 1,
          solid: true
        }, (e) => {
          player.playbackRate(e);
        }, "播放速率调整拓展", void 0, "调节当前HTML5播放器速率，拥有比播放器自带的更宽的调整范围。注意：未调整前的当前速率默认为1。"),
        this.switch("webRTC", "WebRTC", "<strong>关闭</strong>以禁用p2p共享带宽", void 0, void 0, "B站使用【WebRTC】实现p2p共享，等同于将您的设备变成了B站的一个视频服务器节点，别人观看相同的视频或直播便可以从您的设备取流而不必访问B站固有的服务器。脚本默认<strong>关闭</strong>了此功能，以减轻小水管的带宽压力，如果您的带宽允许，还是推荐开启，人人为我，我为人人。bilibili~乾杯 - ( ゜-゜)つロ！"),
        this.switch("elecShow", "充电鸣谢", "允许视频结尾的充电鸣谢"),
        this.switch("videoDisableAA", "禁用视频渲染抗锯齿", '详见<a href="https://github.com/MotooriKashin/Bilibili-Old/issues/292" target="_blank">#292</a>说明'),
        this.switch("ugcSection", "视频合集", "以播单形式呈现", void 0, void 0, "视频合集在旧版页面时代本不存在，但其实质类似于上古的播单，所以直接使用播单页面进行模拟。值得一提的是真正的播单页面相关接口已完全被404，如果有幸访问到脚本会直接替换为缓存的播单号769——因为只缓存了这一项数据。另外播单详情页面还是404状态，以后可能也会用缓存数据修复，让后人能一窥范例。")
      ]);
      this.menuitem.player.addCard("自动化操作");
      this.menuitem.player.addSetting([
        this.switch("automate.danmakuFirst", "展开弹幕列表", "而不是推荐视频", void 0, void 0, "载入播放器时右侧面板默认切换到弹幕列表。"),
        this.switch("automate.showBofqi", "滚动到播放器", "载入视频时", void 0, void 0, "载入播放器时自动滚动到播放器。"),
        this.switch("automate.screenWide", "宽屏模式", "隐藏播放器右侧面板", void 0, (v) => v && (user.userStatus.automate.webFullScreen = false), "载入播放器时自动启用宽屏模式。（与网页全屏二选一）"),
        this.switch("automate.noDanmaku", "无弹幕模式", "默认关闭弹幕", void 0, void 0, "载入播放器时默认关闭弹幕。"),
        this.switch("automate.autoPlay", "自动播放", "播放器初始化完成时", void 0, void 0, "播放器加载完成自动播放。"),
        this.switch("automate.webFullScreen", "网页全屏模式", "载入视频时", void 0, (v) => v && (user.userStatus.automate.screenWide = false), "载入播放器时自动网页全屏。（与宽屏模式二选一）"),
        this.switch("automate.videospeed", "记忆播放速率", "永久继承播放速率设定", void 0, void 0, "默认的记忆播放速率记忆仅同一个网页标签页有效，开启后将代为记忆固定下来。")
      ], 1);
      this.menuitem.player.addCard("限制视频");
      this.menuitem.player.addSetting([
        this.switch("videoLimit.status", "解除播放限制", "解除区域/APP限制", void 0, void 0, "内置服务器只能获取到360P，有条件请在下面自定义服务器。"),
        this.select("videoLimit.server", "代理服务器模式", {
          candidate: ["内置", "自定义"]
        }, "<strong>自定义</strong>模式须要填写下面的服务器", void 0, (v) => {
          if (v === "自定义") {
            if (!user.userStatus.videoLimit.cn && !user.userStatus.videoLimit.hk && !user.userStatus.videoLimit.tw) {
              toast.warning("请至少填选以下代理服务器中的一下再选择！", "服务器请自行搭建或参考【公共反代服务器】");
              user.userStatus.videoLimit.server = "内置";
              alert('<a href="https://github.com/yujincheng08/BiliRoaming/wiki/%E5%85%AC%E5%85%B1%E8%A7%A3%E6%9E%90%E6%9C%8D%E5%8A%A1%E5%99%A8" target="_blank">https://github.com/yujincheng08/BiliRoaming/</a>', "公共反代服务器");
            } else if (!user.userStatus.accessKey.token) {
              alert([
                "【公共反代服务器】一般都要求识别您的登录身份才能正常登录",
                "点击【授权】将跳转到账户授权页面，点击【取消】或其他区域返回",
                "<strong>【账户授权】是高风险操作，请仔细阅读相关说明后三思而后操作！</strong>"
              ], void 0, [
                {
                  text: "授权",
                  callback: () => {
                    this.show("accessKey.token");
                  }
                },
                {
                  text: "取消"
                }
              ]);
            }
          }
        }, "大部分新视频【内置】服务器只能获取到360P，实在不堪入目，有条件的话还是【自定义】服务器吧。对于大陆用户而言，【自定义】服务器一般填一个台湾就行，或者加上一个泰区。"),
        this.input("videoLimit.th", "泰区", {
          prop: { type: "url", placeholder: "www.example.com" }
        }, "泰国（东南亚）限定视频反代服务器", void 0, void 0, "解析泰国（东南亚）限定视频所用的代理服务器。东南亚视频暂时无弹幕和评论，有也是其他视频乱入的。"),
        this.input("videoLimit.tw", "台湾", {
          prop: { type: "url", placeholder: "www.example.com" }
        }, "台湾限定视频反代服务器", void 0, void 0, "解析【仅限台湾地区】视频所用的代理服务器。港澳台限定视频的首选。"),
        this.input("videoLimit.hk", "港澳", {
          prop: { type: "url", placeholder: "www.example.com" }
        }, "香港澳门限定视频反代服务器", void 0, void 0, "解析【仅限香港澳门地区】视频所用的代理服务器。与台湾不同，香港澳门基本上是绑定在一起的。"),
        this.input("videoLimit.cn", "大陆", {
          prop: { type: "url", placeholder: "www.example.com" }
        }, "大陆限定视频反代服务器", void 0, void 0, "解析大陆（一般）视频所用的代理服务器。此项一般是留给海外用户用的。")
      ], 2);
      this.menuitem.player.addCard("替换 UPOS 服务器");
      const upos = Object.keys(UPOS);
      this.menuitem.player.addSetting([
        this.select("uposReplace.th", "泰区", {
          candidate: upos
        }, "针对泰国（东南亚）限制视频", void 0, void 0, "泰区服务器ban了大陆ip，所以必须选一个进行替换。卡加载时请酌情切换。"),
        this.select("uposReplace.gat", "港澳台", {
          candidate: ["不替换"].concat(upos)
        }, "针对港澳台限制视频", void 0, void 0, "港澳台视频服务器一般为大陆外的Akamai，大陆用户有可能访问不畅，请按需酌情切换。若卡加载请关闭或者换一个。"),
        this.select("uposReplace.nor", "一般视频", {
          candidate: ["不替换"].concat(upos)
        }, "针对其他视频", void 0, void 0, "一般视频不需要替换，除非分配给您的视频服务器实在不行，请按需酌情切换。若卡加载请关闭或者换一个。"),
        this.select("uposReplace.download", "下载", {
          candidate: ["不替换"].concat(upos)
        }, "针对下载功能", void 0, void 0, "一般不需要替换，除非屡屡下载403。若还是403请关闭或者换一个。")
      ], 3);
    }
    /** 下载设置 */
    initSettingDownload() {
      this.menuitem.download.addSetting([
        this.button("download", "下载视频", () => {
          download.default();
        }, "当前视频", "视频", void 0, "根据当前设置下载当前网页（顶层）的视频，在页面底部列出所有可用下载源。仅在视频播放页可用。"),
        this.button("downloadDm", "下载弹幕", () => {
          danmaku.download();
        }, "当前弹幕", "弹幕", void 0, "下载当前视频的弹幕，你可以在【弹幕格式】里选择要保存的格式，详见对应设置项说明。文件名格式为“视频标题(分P标题).扩展名”或者“aid.cid.扩展名”。"),
        this.button("downloadImg", "下载图片", () => {
          download.image();
        }, "当前封面", "图片", void 0, "下载当前封面，如果有其他特殊图片，如专栏正文图片，也会一并显示。请右键对应的<strong>图片另存为</strong>。"),
        this.switch("downloadButton", "下载按钮", "播放器右侧", void 0, void 0, "在旧版播放器右侧添加下载按钮，呼出并滚动到下载设置界面，以方便快捷下载。"),
        this.chockboxs("downloadType", "请求的文件类型", ["mp4", "dash", "flv"], "视频封装格式", void 0, () => download.destory(), "勾选视频的封装类型，具体能不能获取到两说。封装类型≠编码类型：①mp4封装，视频编码avc+音频编码aac，画质上限1080P。②flv封装，编码同mp4，但可能切分成多个分段，须手动合并。③dash，未封装的视频轨和音频轨，以编码格式分类，aac为音频轨（含flac、杜比全景声），avc、hev和av1为视频轨（任选其一即可），须下载音视频轨各一条后手动封装为一个视频文件。另外【解除区域限制】功能获取到的下载源不受本项限制。<br>※ 2022年11月2日以后的视频已经没有flv封装。"),
        this.switch("TVresource", "请求tv端视频源", "无水印", void 0, (e) => {
          e && alert("下载TV源必须将【referer】置空，否则会403（无权访问）！另外浏览器不支持配置UA和referer，请更换【下载方式】！", "403警告", [
            {
              text: "置空referer",
              callback: () => user.userStatus.referer = ""
            }
          ]);
          download.destory();
        }, "请求TV端下载源，唯一的优势是可能无Bilibili水印。注意：①B站tv端大会员不通用，所以可能无法获取到大会员视频或画质。②需要进行【账户授权】，否则只能以游客身份获取下载数据。③TV源要求特定的UA且不能发送referer，基本无法通过浏览器直接下载（403无权访问），请选择其他下载工具。④mp4封装的并非tv源。"),
        this.select("downloadQn", "画质", {
          candidate: ["0", "15", "16", "32", "48", "64", "74", "80", "112", "116", "120", "125", "126", "127"]
        }, "flv限定", void 0, () => download.destory(), "画质参数，只针对flv封装。mp4封装没得选，dash则由于特性会一次性提供所有画质选项。"),
        this.select("downloadMethod", "下载方式", {
          candidate: ["浏览器", "IDM", "ef2", "aria2", "aria2rpc"]
        }, "浏览器或第三方工具", void 0, (e) => {
          switch (e) {
            case "浏览器":
              alert("由于浏览器安全限制，直接鼠标左键点击很难触发下载功能，更良好的习惯是右键要下载的文件选择【另存为】（不同浏览器可能命名不同）", "浏览器下载");
              break;
            case "IDM":
              alert('<a href="https://www.internetdownloadmanager.com/" target="_blank">IDM（Internet Download Manager）</a>是Windows端著名的的下载工具，本方式将下载数据生成IDM导出文件，您可以在打开IDM -> 任务 -> 导入 -> 从"IDM导出文件"导入开始下载。虽然有点麻烦，但是IDM支持配置UA和referer，并且下载速度的确不是浏览器能比的。', "IDM导出文件");
              break;
            case "ef2":
              alert('<a href="https://github.com/MotooriKashin/ef2" target="_blank">ef2</a>是本脚本作者开发的一款开源的IDM辅助工具，支持直接从浏览器里拉起IDM进行下载，免去使用IDM导出文件的繁琐，同时解放你的鼠标左键。', "ef2辅助下载");
              break;
            case "aria2":
              alert('<a href="https://github.com/aria2/aria2" target="_blank">aria2</a>是著名的开源命令行下载工具，本方式将下载命令复制到剪切板。命令行不是一般人能使用的工具，没有相应知识储备和使用习惯不推荐选择。', "aria2");
              break;
            case "aria2rpc":
              alert("aria2支持rpc方式进行下载，正确配置后方便程度不亚于ef2方式，唯一的问题是配置起来有亿点麻烦。</br>是否跳转到rpc相关设置？", "aria2 rpc", [
                {
                  text: "RPC配置",
                  callback: () => this.show("aria2.server")
                },
                {
                  text: "不必了"
                }
              ]);
              break;
            default:
              break;
          }
        }, "使用浏览器下载请右键另存为而不是左键点击！其他选项需要使用对应工具，详见对应选项弹窗说明。"),
        this.input("userAgent", "User-Agent", {
          candidate: [
            "Bilibili Freedoooooom/MarkII",
            "Mozilla/5.0 BiliDroid/7.0.0 (bbcallen@gmail.com)",
            navigator.userAgent
          ]
        }, "鉴权参数", void 0, void 0, "下载工具发送给服务器的身份标志，鉴权关键参数之一，无效的User-Agent将导致403无权访问。<strong>除非你知道自己在修改什么，否则请不要轻易调整此项。</strong>此项只在使用第三方下载方式时有效。"),
        this.input("referer", "referer", {
          candidate: [location.origin]
        }, "鉴权参数", void 0, (v) => {
          v && alert("您勾选了下载TV源，根据经验必须将referer置空，不然会触发403（无权访问）！是否撤销输入将referer置空？还是取消勾选tv源？", "设置冲突", [
            {
              text: "置空referer",
              callback: () => user.userStatus.referer = ""
            },
            {
              text: "取消勾选tv源",
              callback: () => user.userStatus.TVresource = false
            }
          ]);
        }, "下载时发送给服务器的标志之一，鉴权关键参数之一，无效的User-Agent将导致403无权访问。此项在网页端必须存在，而且一般为主站域名，但是<strong>TV、APP等源此项必须为空！</strong>"),
        this.input("filepath", "下载目录", {}, "保存下载文件的本地磁盘目录", void 0, void 0, "ef2、aria2和aria2rpc方式限定。Windows平台请注意使用反斜杠哦。")
      ]);
      this.menuitem.download.addCard("aria2 相关");
      this.menuitem.download.addSetting([
        this.input("aria2.server", "RPC服务器", {
          prop: { type: "url", placeholder: "http://localhost" },
          candidate: ["http://localhost"]
        }, "本地或远程链接", void 0, void 0, "端口号请另外输入。建议使用下方按钮测试RPC连接可用性。"),
        this.input("aria2.port", "端口", {
          prop: { type: "number", placeholder: "6800" },
          candidate: ["6800"]
        }, "本地或远程端口", void 0, void 0, "服务器链接另外输入。建议使用下方按钮测试RPC连接可用性。"),
        this.input("aria2.token", "token", {
          prop: { type: "password" }
        }, "鉴权", void 0, void 0, "如果RPC服务器启用了token鉴权的话。"),
        this.slider("aria2.split", "分段数目", {
          min: 1,
          max: 16,
          precision: 15
        }, "分段并发下载", void 0, void 0, "对于支持断点续传的文件，启用多线程同时并发下载通常是一种非常有效的提高下载速度的方法。如果需要请自行调整一个合适的并发数，1表示不并发下载。值得注意的是，部分服务器会限制并发连接数目，并发连接过多有触发风控甚至被临时封禁的风险，所以并不是并发数越多越好。"),
        this.slider("aria2.size", "分段大小", {
          min: 1,
          max: 20,
          precision: 19
        }, "单位：/MB", void 0, void 0, "如果一个文件有多个下载源，那么此项会间接决定使用几个下载源。一旦要下载的文件不小于此项的2倍，aria2便会同时尝试连接多个下载源。这也是提高下载速率的有效方法。注意：某种意义上此项是越小越好，原因不言而喻。"),
        this.button("aria2.test", "测试RPC连接", () => {
          const data = ["正在测试RPC连接~"];
          const tst = toast.toast(0, "info", ...data);
          new Aria2().getVersion().then((d) => {
            tst.type = "success";
            data.push(\`-------aria2 v\${d.version}-------\`, ...d.enabledFeatures);
            tst.data = data;
          }).catch((e) => {
            tst.type = "error";
            data.push("RPC链接失败 ಥ_ಥ", e);
            debug.error("RPC链接失败 ಥ_ಥ", e);
            tst.data = data;
          }).finally(() => {
            tst.delay = 4;
          });
        }, "获取aria2信息", "ping", void 0, "请确定正确配置并启用了aria2的RPC服务器。")
      ], 1);
      this.menuitem.download.addCard("ef2 相关");
      this.menuitem.download.addSetting([
        this.switch("ef2.delay", "稍后下载", "添加到IDM下载队列但不开始", void 0, void 0, "要开始时请手动到IDM队列里点击开始。本项可以用来批量下载而不弹出多个窗口。注意：B站视频源使用的是临时链接，过期后无法访问，请及时下载或清理。"),
        this.switch("ef2.silence", "静默下载", "跳过IDM确认对话框", void 0, void 0, "默认情况下IDM会弹窗询问是否确认下载，在该确认框中可以调整保存目录和文件名等操作。启用本项以跳过该确认框。")
      ], 2);
    }
    /**
     * 新建开关设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param sub 副标题
     * @param svg 图标
     * @param callback 用户调整设置的回调，将新值作为第一个参数传入
     * @param desc 浮动窗口
     */
    switch(id, label, sub, svg2, callback, desc) {
      const item = new SettingItem();
      const button = new SwitchButton();
      const arr2 = id.split(".");
      let looping = false;
      item.init(arr2.join(""), label, sub, svg2);
      button.update(Chain.getStatus(id));
      button.addEventListener("change", () => {
        looping = true;
        Chain.setStatus(id, button.value);
        callback && callback(button.value);
      });
      user.bindChange(arr2.shift(), (v) => {
        looping || button.update(Chain.getStatus(arr2.join("."), v));
        looping = false;
      });
      item.value(button);
      this.settingItem[id] = item;
      desc && new Desc().value(label, desc, item);
      return item;
    }
    /**
     * 新建下拉菜单设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param value 配置数据
     * @param sub 副标题
     * @param svg 图标
     * @param callback 用户调整设置的回调，将新值作为第一个参数传入
     * @param desc 浮动窗口
     */
    select(id, label, value, sub, svg2, callback, desc) {
      const item = new SettingItem();
      const select = new SelectMenu();
      const arr2 = id.split(".");
      let looping = false;
      item.init(arr2.join(""), label, sub, svg2);
      value.value = Chain.getStatus(id);
      select.update(value);
      select.addEventListener("change", () => {
        looping = true;
        Chain.setStatus(id, select.value);
        callback && callback(select.value);
      });
      user.bindChange(arr2.shift(), (v) => {
        looping || (select.value = Chain.getStatus(arr2.join("."), v));
        looping = false;
      });
      item.value(select);
      this.settingItem[id] = item;
      desc && new Desc().value(label, desc, item);
      return item;
    }
    /**
     * 创建滑动条菜单设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param value 配置数据
     * @param sub 副标题
     * @param svg 图标
     * @param callback 用户调整设置的回调，将新值作为第一个参数传入
     * @param desc 浮动窗口
     */
    slider(id, label, value, sub, svg2, callback, desc) {
      const item = new SettingItem();
      const slider = new SliderBlock();
      const arr2 = id.split(".");
      let looping = false;
      item.init(arr2.join(""), label, sub, svg2);
      value.value = Chain.getStatus(id);
      slider.update(value);
      slider.addEventListener("change", () => {
        looping = true;
        Chain.setStatus(id, slider.value);
        callback && callback(slider.value);
      });
      user.bindChange(arr2.shift(), (v) => {
        looping || (slider.value = Chain.getStatus(arr2.join("."), v));
        looping = false;
      });
      item.value(slider);
      this.settingItem[id] = item;
      desc && new Desc().value(label, desc, item);
      return item;
    }
    /**
     * 创建自定义滑动条菜单设置
     * @param id 用来索引的字符串
     * @param label 标题
     * @param value 配置数据
     * @param callback 输入回调
     * @param sub 副标题
     * @param svg 图标
     * @param desc 浮动窗口
     */
    sliderCustom(id, label, value, callback, sub, svg2, desc) {
      const item = new SettingItem();
      const slider = new SliderBlock();
      item.init("", label, sub, svg2);
      slider.update(value);
      slider.addEventListener("change", () => {
        callback(slider.value);
      });
      item.value(slider);
      this.settingItem[id] = item;
      desc && new Desc().value(label, desc, item);
      return item;
    }
    /**
     * 创建自定义输入框设置
     * @param id 用来索引的字符串
     * @param label 标题
     * @param value 配置数据
     * @param callback 输入回调
     * @param sub 副标题
     * @param svg 图标
     * @param desc 浮动窗口
     */
    inputCustom(id, label, value, callback, sub, svg2, desc) {
      const item = new SettingItem();
      const input = new InputArea();
      item.init("", label, sub, svg2);
      input.update(value);
      input.addEventListener("change", () => {
        callback(input.value);
      });
      item.value(input);
      this.settingItem[id] = item;
      desc && new Desc().value(label, desc, item);
      return item;
    }
    /**
     * 创建输入框设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param value 配置数据
     * @param sub 副标题
     * @param svg 图标
     * @param callback 输入回调
     * @param desc 浮动窗口
     */
    input(id, label, value, sub, svg2, callback, desc) {
      const item = new SettingItem();
      const input = new InputArea();
      const arr2 = id.split(".");
      let looping = false;
      item.init(arr2.join(""), label, sub, svg2);
      value.value = Chain.getStatus(id);
      input.update(value);
      input.addEventListener("change", () => {
        looping = true;
        Chain.setStatus(id, input.value);
        callback && callback(input.value);
      });
      user.bindChange(arr2.shift(), (v) => {
        looping || (input.value = Chain.getStatus(arr2.join("."), v));
        looping = false;
      });
      item.value(input);
      this.settingItem[id] = item;
      desc && new Desc().value(label, desc, item);
      return item;
    }
    /**
     * 创建按钮设置
     * @param id 用来索引的字符串
     * @param label 标题
     * @param callback 按钮点击回调
     * @param sub 副标题
     * @param text 按钮文字
     * @param svg 图标
     * @param desc 浮动窗口
     */
    button(id, label, callback, sub, text, svg2, desc) {
      const item = new SettingItem();
      const button = new PushButton();
      item.init("", label, sub, svg2);
      text && (button.text = text);
      button.addEventListener("change", (ev) => {
        callback();
      });
      item.value(button);
      this.settingItem[id] = item;
      desc && new Desc().value(label, desc, item);
      return item;
    }
    /**
     * 新建复选框设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param values 配置数据
     * @param sub 副标题
     * @param svg 图标
     * @param callback 用户调整设置的回调，将新值作为第一个参数传入
     * @param desc 浮动窗口
     */
    chockboxs(id, label, values, sub, svg2, callback, desc) {
      const item = new SettingItem();
      const checkboxs = new CheckBoxs();
      const arr2 = id.split(".");
      let looping = false;
      item.init(arr2.join(""), label, sub, svg2);
      checkboxs.update(values);
      checkboxs.value = Array.from(Chain.getStatus(id));
      checkboxs.addEventListener("change", () => {
        looping = true;
        Chain.setStatus(id, checkboxs.value);
        callback && callback(checkboxs.value);
      });
      user.bindChange(arr2.shift(), (v) => {
        looping || (checkboxs.value = Chain.getStatus(arr2.join("."), v));
        looping = false;
      });
      item.value(checkboxs);
      this.settingItem[id] = item;
      desc && new Desc().value(label, desc, item);
      return item;
    }
    /**
     * 显示设置面板
     * @param id 设置项注册id，id不在可选项时可以使用强制断言
     * @example
     * this.show('accessKey.token') // 显示设置面板并滚动到【账户授权】那一项
     * this.show(<'accessKey'>'accessKey.token') // TypeScript 强制断言
     */
    show(id) {
      this.interface.show();
      if (id && this.settingItem[id]) {
        this.settingItem[id].dispatchEvent(new Event("show"));
      } else {
        this.menuitem.common.click();
      }
    }
  };

  // src/index.ts
  document.domain = "bilibili.com";
  BLOD.version = GM.info?.script.version.slice(-40);
  user.addCallback((status) => {
    cdn.update(status.cdn, BLOD.version);
    Comment.commentJumpUrlTitle = status.commentJumpUrlTitle;
    if (BLOD.path[2] == "www.bilibili.com" && (!BLOD.path[3] || (BLOD.path[3].startsWith("?") || BLOD.path[3].startsWith("#") || BLOD.path[3].startsWith("index.")))) {
      status.index && new PageIndex();
    }
    if (status.av && /(\\/s)?\\/video\\/[AaBb][Vv]/.test(location.href)) {
      BLOD.path[3] === "s" && urlCleaner.updateLocation(location.href.replace("s/video", "video"));
      player.loadEmbedPlayer();
      new PageAV();
    }
    if (status.player && (/\\/festival\\//.test(location.href) || /player\\./.test(location.href) && !location.href.includes("ancient"))) {
      player.loadConnectPlayer();
    }
    if (status.bangumi && /\\/bangumi\\/play\\/(ss|ep)/.test(location.href)) {
      player.loadEmbedPlayer();
      new PageBangumi();
    }
    if (status.watchlater && /\\/watchlater/.test(location.href)) {
      player.loadEmbedPlayer();
      new PageWatchlater();
    }
    if (status.playlist && /\\/medialist\\/play\\//.test(location.href) && !/watchlater/.test(location.href) || /\\/list\\/ml\\d+/.test(location.href) || /\\/playlist\\/video\\/pl/.test(location.href)) {
      player.loadEmbedPlayer();
      new PagePlaylist();
    }
    if (/\\/playlist\\/detail\\/pl/.test(location.href)) {
      new PagePlaylistDetail();
    }
    if (status.ranking && /\\/v\\/popular\\//.test(location.href)) {
      new PageRanking();
    }
    if (status.read && /\\/read\\/[Cc][Vv]/.test(location.href)) {
      new PageRead();
    }
    if (status.search && BLOD.path[2] == "search.bilibili.com") {
      new PageSearch();
    }
    if (/\\/moe\\/2018\\/jp\\/home/.test(location.href)) {
      Reflect.set(window, "getPlayList", () => {
        return { code: 0, data: toview_default };
      });
    }
    player.nanoPermit();
    new Automate();
    toast.update(status.toast);
    status.disableReport && new ReportObserver();
    status.videoLimit.status && videoLimit.enable();
    status.fullBannerCover && (Header.fullBannerCover = true);
    status.header && new Header();
    status.comment && new Comment();
    status.webRTC || WebTRC.disable();
    status.album && /t.bilibili.com\\/\\d+/.test(location.href) && PageSpace.album();
    status.development && Reflect.defineProperty(window, "BLOD", {
      value: BLOD,
      configurable: true
    });
    window.top === window.self && (BLOD.ui = new UI());
  });
  try {
    const bpx_player_profile = LocalStorage.getItem("bpx_player_profile") || { media: { autoplay: false } };
    bpx_player_profile.media.autoplay = false;
    LocalStorage.setItem("bpx_player_profile", bpx_player_profile);
  } catch (e) {
  }
  BLOD.path[2] == "message.bilibili.com" && Header.message();
  Header.videoOffset();
  /space\\.bilibili\\.com/.test(location.href) && new PageSpace();
  /bangumi\\/media\\/md/.test(location.href) && new PageMedia();
  location.href.includes("www.bilibili.com/account/history") && new PageHistory();
  BLOD.path[2] == "live.bilibili.com" && new PageLive();
  BLOD.path[2] == "t.bilibili.com" && new PageDynamic();
})();
// @license MIT
/*! Bundled license information:

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/

`;

new Function("GM", MODULES)(GM);
