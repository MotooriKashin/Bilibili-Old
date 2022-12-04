// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      10.0.0-aa44074247e44c6b488c3fea73ed1d93de8cc144
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

const MODULES = (<><![CDATA[

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/crypt/crypt.js
var require_crypt = __commonJS({
  "node_modules/crypt/crypt.js"(exports, module) {
    (function() {
      var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt = {
        rotl: function(n, b) {
          return n << b | n >>> 32 - b;
        },
        rotr: function(n, b) {
          return n << 32 - b | n >>> b;
        },
        endian: function(n) {
          if (n.constructor == Number) {
            return crypt.rotl(n, 8) & 16711935 | crypt.rotl(n, 24) & 4278255360;
          }
          for (var i = 0; i < n.length; i++)
            n[i] = crypt.endian(n[i]);
          return n;
        },
        randomBytes: function(n) {
          for (var bytes = []; n > 0; n--)
            bytes.push(Math.floor(Math.random() * 256));
          return bytes;
        },
        bytesToWords: function(bytes) {
          for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= bytes[i] << 24 - b % 32;
          return words;
        },
        wordsToBytes: function(words) {
          for (var bytes = [], b = 0; b < words.length * 32; b += 8)
            bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
          return bytes;
        },
        bytesToHex: function(bytes) {
          for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 15).toString(16));
          }
          return hex.join("");
        },
        hexToBytes: function(hex) {
          for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
          return bytes;
        },
        bytesToBase64: function(bytes) {
          for (var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
            for (var j = 0; j < 4; j++)
              if (i * 8 + j * 6 <= bytes.length * 8)
                base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
              else
                base64.push("=");
          }
          return base64.join("");
        },
        base64ToBytes: function(base64) {
          base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
          for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
            if (imod4 == 0)
              continue;
            bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
          }
          return bytes;
        }
      };
      module.exports = crypt;
    })();
  }
});

// node_modules/charenc/charenc.js
var require_charenc = __commonJS({
  "node_modules/charenc/charenc.js"(exports, module) {
    var charenc = {
      utf8: {
        stringToBytes: function(str) {
          return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
        },
        bytesToString: function(bytes) {
          return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
        }
      },
      bin: {
        stringToBytes: function(str) {
          for (var bytes = [], i = 0; i < str.length; i++)
            bytes.push(str.charCodeAt(i) & 255);
          return bytes;
        },
        bytesToString: function(bytes) {
          for (var str = [], i = 0; i < bytes.length; i++)
            str.push(String.fromCharCode(bytes[i]));
          return str.join("");
        }
      }
    };
    module.exports = charenc;
  }
});

// node_modules/is-buffer/index.js
var require_is_buffer = __commonJS({
  "node_modules/is-buffer/index.js"(exports, module) {
    module.exports = function(obj) {
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
  "node_modules/md5/md5.js"(exports, module) {
    (function() {
      var crypt = require_crypt(), utf8 = require_charenc().utf8, isBuffer = require_is_buffer(), bin = require_charenc().bin, md52 = function(message, options) {
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
        var FF = md52._ff, GG = md52._gg, HH = md52._hh, II = md52._ii;
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
      md52._ff = function(a, b, c, d, x, s, t) {
        var n = a + (b & c | ~b & d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md52._gg = function(a, b, c, d, x, s, t) {
        var n = a + (b & d | c & ~d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md52._hh = function(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md52._ii = function(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
      };
      md52._blocksize = 16;
      md52._digestsize = 16;
      module.exports = function(message, options) {
        if (message === void 0 || message === null)
          throw new Error("Illegal argument " + message);
        var digestbytes = crypt.wordsToBytes(md52(message, options));
        return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt.bytesToHex(digestbytes);
      };
    })();
  }
});

// src/utils/format/integer.ts
function integerFormat(num, byte = 2) {
  return num < 10 ** byte ? (Array(byte).join("0") + num).slice(-1 * byte) : num;
}

// src/utils/format/time.ts
function timeFormat(time = new Date().getTime(), type) {
  const date = new Date(time);
  const arr2 = date.toLocaleString().split(" ");
  const day = arr2[0].split("/");
  day[1] = integerFormat(day[1], 2);
  day[2] = integerFormat(day[2], 2);
  return type ? day.join("-") + " " + arr2[1] : arr2[1];
}

// src/utils/debug.ts
var group = {
  i: 0,
  call: []
};
function debug(...data) {
  group.call.push(console.log.bind(console, `%c[${timeFormat()}]`, "color: blue;", ...arguments));
  !group.i && setTimeout(group.call.shift());
  return debug;
}
debug.assert = function(condition, ...data) {
  group.call.push(console.assert.bind(console, `[${timeFormat()}]`, ...arguments));
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
  group.call.push(console.debug.bind(console, `[${timeFormat()}]`, ...arguments));
  !group.i && setTimeout(group.call.shift());
  return debug;
};
debug.error = function(...data) {
  group.call.push(console.error.bind(console, `[${timeFormat()}]`, ...arguments));
  !group.i && setTimeout(group.call.shift());
  return debug;
};
debug.group = function(...data) {
  group.i++;
  group.call.push(console.group.bind(console, `[${timeFormat()}]`, ...arguments));
  return debug;
};
debug.groupCollapsed = function(...data) {
  group.i++;
  group.call.push(console.groupCollapsed.bind(console, `[${timeFormat()}]`, ...arguments));
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
  group.call.push(console.info.bind(console, `%c[${timeFormat()}]`, "color: blue;", ...arguments));
  !group.i && setTimeout(group.call.shift());
  return debug;
};
debug.log = function(...data) {
  group.call.push(console.log.bind(console, `%c[${timeFormat()}]`, "color: blue;", ...arguments));
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
  console.timeLog(label, `[${timeFormat()}]`, ...data);
  return debug;
};
debug.trace = function(...data) {
  group.call.push(console.trace.bind(console, ...arguments));
  !group.i && setTimeout(group.call.shift());
  return debug;
};
debug.warn = function(...data) {
  group.call.push(console.warn.bind(console, `[${timeFormat()}]`, ...arguments));
  !group.i && setTimeout(group.call.shift());
  return debug;
};

// src/utils/file.ts
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

// src/utils/typeof.ts
var isArray = Array.isArray;
var isObject = (val) => val !== null && typeof val === "object";
var isNumber = (val) => !isNaN(parseFloat(val)) && isFinite(val);

// src/utils/hook/method.ts
function methodHook(target, propertyKey, callback, modifyArguments) {
  const values = [];
  const iArguments = [];
  let loading2 = false;
  let loaded = false;
  function modify() {
    loaded = true;
    if (values[0]) {
      Reflect.defineProperty(target, propertyKey, { configurable: true, value: values[0] });
      iArguments.forEach((d) => values[0](...d));
    } else {
      debug.error("拦截方法出错！", "目标方法", propertyKey, "所属对象", target);
    }
  }
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
            res.finally(() => modify());
          } else {
            modify();
          }
        });
      }
      return function() {
        modifyArguments?.(arguments);
        iArguments.push(arguments);
      };
    }
  });
}
function propertyHook(target, propertyKey, propertyValue) {
  Reflect.defineProperty(target, propertyKey, {
    configurable: true,
    set: (v) => true,
    get: () => {
      Reflect.defineProperty(target, propertyKey, { configurable: true, value: propertyValue });
      return propertyValue;
    }
  });
}
propertyHook.modify = (target, propertyKey, callback, once = false) => {
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

// src/utils/poll.ts
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
  id && !parrent.querySelector(`#${id}`) && style.setAttribute("id", id);
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

// src/html/button.html
var button_default = '<div class="button" role="button">按钮</div>\r\n<style>\r\n    .button {\r\n        width: fit-content;\r\n        cursor: pointer;\r\n        line-height: 28px;\r\n        padding-left: 10px;\r\n        padding-right: 10px;\r\n        text-align: right;\r\n        border: 1px solid #ccd0d7;\r\n        border-radius: 4px;\r\n        color: #222;\r\n        transition: border-color .2s ease, background-color .2s ease;\r\n        box-sizing: border-box;\r\n        user-select: none;\r\n    }\r\n\r\n    .button:hover {\r\n        color: #00a1d6;\r\n        border-color: #00a1d6;\r\n    }\r\n\r\n    .button:active {\r\n        background-color: #eee;\r\n    }\r\n</style>';

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
customElements.get(`button-${"aa44074"}`) || customElements.define(`button-${"aa44074"}`, PushButton);

// src/html/popupbox.html
var popupbox_default = '<div class="box">\r\n    <div class="contain"></div>\r\n    <div class="fork"></div>\r\n</div>\r\n<style type="text/css">\r\n    .box {\r\n        top: 50%;\r\n        left: 50%;\r\n        transform: translateX(-50%) translateY(-50%);\r\n        transition: 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);\r\n        padding: 12px;\r\n        background-color: #fff;\r\n        color: black;\r\n        border-radius: 8px;\r\n        box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);\r\n        border: 1px solid rgba(136, 136, 136, 0.13333);\r\n        box-sizing: border-box;\r\n        position: fixed;\r\n        font-size: 13px;\r\n        z-index: 11115;\r\n        line-height: 14px;\r\n    }\r\n\r\n    .contain {\r\n        display: flex;\r\n        flex-direction: column;\r\n        height: 100%;\r\n    }\r\n\r\n    .fork {\r\n        position: absolute;\r\n        transform: scale(0.8);\r\n        right: 10px;\r\n        top: 10px;\r\n        height: 20px;\r\n        width: 20px;\r\n        pointer-events: visible;\r\n    }\r\n\r\n    .fork:hover {\r\n        border-radius: 50%;\r\n        background-color: rgba(0, 0, 0, 10%);\r\n    }\r\n</style>';

// src/svg/fork.svg
var fork_default = '<svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#212121" stroke-linecap="round"></path></svg>';

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
  dislike: dislike_default
};

// src/core/ui/utils/popupbox.ts
var ClickOutRemove = class {
  constructor(target) {
    this.target = target;
    target.addEventListener("click", (e) => e.stopPropagation());
  }
  enabled = false;
  remove = () => {
    this.target.remove();
  };
  disable = () => {
    if (this.enabled) {
      document.removeEventListener("click", this.remove);
      this.enabled = false;
    }
    return this;
  };
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
  $fork = true;
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
  get fork() {
    return this.$fork;
  }
  set fork(v) {
    this.$fork = v;
    this._fork.style.display = v ? "" : "none";
    if (v) {
      this.clickOutRemove.disable();
    } else {
      this.clickOutRemove.enable();
    }
  }
};
customElements.get(`popupbox-${"aa44074"}`) || customElements.define(`popupbox-${"aa44074"}`, PopupBox);

// src/core/ui/alert.ts
function alert(msg, title, buttons) {
  isArray(msg) || (msg = [msg]);
  msg = msg.join("</br>");
  const popup = new PopupBox();
  popup.fork = false;
  popup.setAttribute("style", "max-width: 400px; max-height: 300px;line-height: 16px;");
  popup.innerHTML = `<div style="text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;">
    <span>${title || "Bilibili Old"}</span>
</div>
<div><div style="padding-block: 10px;padding-inline: 15px;">${msg}</div></div>`;
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

// src/html/toast.html
var toast_default = '<div id="toast-container"></div>\r\n<style type="text/css">\r\n    .toast-close-button>svg {\r\n        width: 12px;\r\n        height: 12px;\r\n    }\r\n\r\n    .toast {\r\n        transition: height 1s ease 0s, padding 1s ease 0s;\r\n    }\r\n\r\n    #toast-container {\r\n        font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif;\r\n    }\r\n</style>\r\n<style type="text/css">\r\n    /*\r\n     * Note that this is toastr v2.1.3, the "latest" version in url has no more maintenance,\r\n     * please go to https://cdnjs.com/libraries/toastr.js and pick a certain version you want to use,\r\n     * make sure you copy the url from the website since the url may change between versions.\r\n     */\r\n    .toast-title {\r\n        font-weight: bold;\r\n    }\r\n\r\n    .toast-message {\r\n        -ms-word-wrap: break-word;\r\n        word-wrap: break-word;\r\n    }\r\n\r\n    .toast-message a,\r\n    .toast-message label {\r\n        color: #FFFFFF;\r\n    }\r\n\r\n    .toast-message a:hover {\r\n        color: #CCCCCC;\r\n        text-decoration: none;\r\n    }\r\n\r\n    .toast-close-button {\r\n        position: relative;\r\n        right: -0.3em;\r\n        top: -0.3em;\r\n        float: right;\r\n        font-size: 20px;\r\n        font-weight: bold;\r\n        color: #FFFFFF;\r\n        -webkit-text-shadow: 0 1px 0 #ffffff;\r\n        text-shadow: 0 1px 0 #ffffff;\r\n        opacity: 0.8;\r\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);\r\n        filter: alpha(opacity=80);\r\n        line-height: 1;\r\n    }\r\n\r\n    .toast-close-button:hover,\r\n    .toast-close-button:focus {\r\n        color: #000000;\r\n        text-decoration: none;\r\n        cursor: pointer;\r\n        opacity: 0.4;\r\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);\r\n        filter: alpha(opacity=40);\r\n    }\r\n\r\n    .rtl .toast-close-button {\r\n        left: -0.3em;\r\n        float: left;\r\n        right: 0.3em;\r\n    }\r\n\r\n    /*Additional properties for button version\r\n     iOS requires the button element instead of an anchor tag.\r\n     If you want the anchor version, it requires `href="#"`.*/\r\n    button.toast-close-button {\r\n        padding: 0;\r\n        cursor: pointer;\r\n        background: transparent;\r\n        border: 0;\r\n        -webkit-appearance: none;\r\n    }\r\n\r\n    .toast-top-center {\r\n        top: 0;\r\n        right: 0;\r\n        width: 100%;\r\n    }\r\n\r\n    .toast-bottom-center {\r\n        bottom: 0;\r\n        right: 0;\r\n        width: 100%;\r\n    }\r\n\r\n    .toast-top-full-width {\r\n        top: 0;\r\n        right: 0;\r\n        width: 100%;\r\n    }\r\n\r\n    .toast-bottom-full-width {\r\n        bottom: 0;\r\n        right: 0;\r\n        width: 100%;\r\n    }\r\n\r\n    .toast-top-left {\r\n        top: 12px;\r\n        left: 12px;\r\n    }\r\n\r\n    .toast-top-right {\r\n        top: 12px;\r\n        right: 12px;\r\n    }\r\n\r\n    .toast-bottom-right {\r\n        right: 12px;\r\n        bottom: 12px;\r\n    }\r\n\r\n    .toast-bottom-left {\r\n        bottom: 12px;\r\n        left: 12px;\r\n    }\r\n\r\n    #toast-container {\r\n        position: fixed;\r\n        z-index: 999999;\r\n        pointer-events: none;\r\n        /*overrides*/\r\n    }\r\n\r\n    #toast-container * {\r\n        -moz-box-sizing: border-box;\r\n        -webkit-box-sizing: border-box;\r\n        box-sizing: border-box;\r\n    }\r\n\r\n    #toast-container>div {\r\n        position: relative;\r\n        pointer-events: auto;\r\n        overflow: hidden;\r\n        margin: 0 0 6px;\r\n        padding: 15px 15px 15px 50px;\r\n        width: 300px;\r\n        -moz-border-radius: 3px 3px 3px 3px;\r\n        -webkit-border-radius: 3px 3px 3px 3px;\r\n        border-radius: 3px 3px 3px 3px;\r\n        background-position: 15px center;\r\n        background-repeat: no-repeat;\r\n        -moz-box-shadow: 0 0 12px #999999;\r\n        -webkit-box-shadow: 0 0 12px #999999;\r\n        box-shadow: 0 0 12px #999999;\r\n        color: #FFFFFF;\r\n        opacity: 0.8;\r\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);\r\n        filter: alpha(opacity=80);\r\n    }\r\n\r\n    #toast-container>div.rtl {\r\n        direction: rtl;\r\n        padding: 15px 50px 15px 15px;\r\n        background-position: right 15px center;\r\n    }\r\n\r\n    #toast-container>div:hover {\r\n        -moz-box-shadow: 0 0 12px #000000;\r\n        -webkit-box-shadow: 0 0 12px #000000;\r\n        box-shadow: 0 0 12px #000000;\r\n        opacity: 1;\r\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\r\n        filter: alpha(opacity=100);\r\n        cursor: pointer;\r\n    }\r\n\r\n    #toast-container>.toast-info {\r\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=") !important;\r\n    }\r\n\r\n    #toast-container>.toast-error {\r\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=") !important;\r\n    }\r\n\r\n    #toast-container>.toast-success {\r\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==") !important;\r\n    }\r\n\r\n    #toast-container>.toast-warning {\r\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=") !important;\r\n    }\r\n\r\n    #toast-container.toast-top-center>div,\r\n    #toast-container.toast-bottom-center>div {\r\n        width: 300px;\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n    }\r\n\r\n    #toast-container.toast-top-full-width>div,\r\n    #toast-container.toast-bottom-full-width>div {\r\n        width: 96%;\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n    }\r\n\r\n    .toast {\r\n        background-color: #030303;\r\n    }\r\n\r\n    .toast-success {\r\n        background-color: #51A351;\r\n    }\r\n\r\n    .toast-error {\r\n        background-color: #BD362F;\r\n    }\r\n\r\n    .toast-info {\r\n        background-color: #2F96B4;\r\n    }\r\n\r\n    .toast-warning {\r\n        background-color: #F89406;\r\n    }\r\n\r\n    .toast-progress {\r\n        position: absolute;\r\n        left: 0;\r\n        bottom: 0;\r\n        height: 4px;\r\n        background-color: #000000;\r\n        opacity: 0.4;\r\n        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);\r\n        filter: alpha(opacity=40);\r\n    }\r\n\r\n    /*Responsive Design*/\r\n    @media all and (max-width: 240px) {\r\n        #toast-container>div {\r\n            padding: 8px 8px 8px 50px;\r\n            width: 11em;\r\n        }\r\n\r\n        #toast-container>div.rtl {\r\n            padding: 8px 50px 8px 8px;\r\n        }\r\n\r\n        #toast-container .toast-close-button {\r\n            right: -0.2em;\r\n            top: -0.2em;\r\n        }\r\n\r\n        #toast-container .rtl .toast-close-button {\r\n            left: -0.2em;\r\n            right: 0.2em;\r\n        }\r\n    }\r\n\r\n    @media all and (min-width: 241px) and (max-width: 480px) {\r\n        #toast-container>div {\r\n            padding: 8px 8px 8px 50px;\r\n            width: 18em;\r\n        }\r\n\r\n        #toast-container>div.rtl {\r\n            padding: 8px 50px 8px 8px;\r\n        }\r\n\r\n        #toast-container .toast-close-button {\r\n            right: -0.2em;\r\n            top: -0.2em;\r\n        }\r\n\r\n        #toast-container .rtl .toast-close-button {\r\n            left: -0.2em;\r\n            right: 0.2em;\r\n        }\r\n    }\r\n\r\n    @media all and (min-width: 481px) and (max-width: 768px) {\r\n        #toast-container>div {\r\n            padding: 15px 15px 15px 50px;\r\n            width: 25em;\r\n        }\r\n\r\n        #toast-container>div.rtl {\r\n            padding: 15px 50px 15px 15px;\r\n        }\r\n    }\r\n</style>';

// src/utils/type.ts
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
          if (/^\d+n$/.test(input))
            input = BigInt(input.slice(0, -1));
        } catch {
        }
      }
      break;
  }
  return input;
}
function toString(input, space = "\n") {
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
  closeButton = document.createElement("div");
  message = document.createElement("div");
  timer;
  hovering = false;
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
  set data(v) {
    isArray(v) || (v = [v]);
    let html = "";
    v.forEach((d, i) => {
      d = toString(d);
      html += i ? `<br>${d}` : `<label>${d}</label>`;
    });
    const close = this.message.contains(this.closeButton);
    this.message.innerHTML = html;
    close && (this.delay = 0);
    this.setAttribute("style", `height: ${this.message.scrollHeight + 30}px;`);
  }
  set type(v) {
    this.classList.remove("toast-success", "toast-error", "toast-info", "toast-warning");
    v && this.classList.add(`toast-${v}`);
  }
  set rtl(v) {
    v ? this.classList.add("rtl") : this.classList.remove("rtl");
  }
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
customElements.get(`toast-${"aa44074"}`) || customElements.define(`toast-${"aa44074"}`, Toast, { extends: "div" });
var ToastContainer = class extends HTMLElement {
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
  update(value) {
    Object.entries(value).forEach((d) => {
      this[d[0]] = d[1];
    });
  }
  toast(delay, type = "info", ...data) {
    document.body.contains(this) || document.body.appendChild(this);
    const toast = new Toast();
    toast.type = type;
    toast.rtl = this.rtl;
    this.container.insertBefore(toast, this.container.firstChild);
    toast.data = data;
    toast.delay = delay;
    return toast;
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
  get position() {
    return this.getAttribute("position");
  }
  set rtl(v) {
    this.setAttribute("rtl", v);
  }
  get rtl() {
    return toObject(this.getAttribute("rtl"));
  }
  set delay(v) {
    this.setAttribute("delay", v);
  }
  get delay() {
    return toObject(this.getAttribute("delay"));
  }
  set disabled(v) {
    this.setAttribute("disabled", v);
  }
  get disabled() {
    return toObject(this.getAttribute("disabled"));
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue)
      return;
    switch (name) {
      case "position":
        newValue && (this.container.className = `toast-${newValue}`);
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
customElements.get(`toast-container-${"aa44074"}`) || customElements.define(`toast-container-${"aa44074"}`, ToastContainer);

// src/html/ui-entry.html
var ui_entry_default = '<div class="setting">\r\n    <i></i><span>设置</span>\r\n</div>\r\n<div class="gear"></div>\r\n<style type="text/css">\r\n    .gear {\r\n        position: fixed;\r\n        right: 40px;\r\n        bottom: 60px;\r\n        height: 20px;\r\n        width: 20px;\r\n        border: 1px solid #e9eaec;\r\n        border-radius: 50%;\r\n        box-shadow: 0 0 12px 4px rgb(106, 115, 133, 22%);\r\n        padding: 10px;\r\n        cursor: pointer;\r\n        animation: roll 1s ease-out;\r\n        transition: opacity 0.3s ease-out;\r\n        background: none;\r\n        z-index: 11110;\r\n    }\r\n\r\n    .setting {\r\n        box-sizing: content-box;\r\n        color: #fff;\r\n        background-color: #fff;\r\n        border-radius: 5px;\r\n        position: fixed;\r\n        bottom: 65px;\r\n        width: 56px;\r\n        height: 40px;\r\n        transition: right 0.7s;\r\n        -moz-transition: right 0.7s;\r\n        -webkit-transition: right 0.7s;\r\n        -o-transition: right 0.7s;\r\n        z-index: 11110;\r\n        padding: 4px;\r\n        right: -54px;\r\n    }\r\n\r\n    .setting:hover {\r\n        right: 0px;\r\n        box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;\r\n        border: 1px solid rgb(233, 234, 236);\r\n    }\r\n\r\n    .setting i {\r\n        background-position: -471px -982px;\r\n        display: block;\r\n        width: 20px;\r\n        height: 20px;\r\n        transition: 0.2s;\r\n        background-image: url(//static.hdslb.com/images/base/icons.png);\r\n        margin: auto;\r\n    }\r\n\r\n    .setting span {\r\n        font-size: 14px;\r\n        display: block;\r\n        width: 50%;\r\n        transition: 0.2s;\r\n        color: #000;\r\n        margin: auto;\r\n    }\r\n\r\n    @keyframes roll {\r\n\r\n        30%,\r\n        60%,\r\n        90% {\r\n            transform: scale(1) rotate(0deg);\r\n        }\r\n\r\n        10%,\r\n        40%,\r\n        70% {\r\n            transform: scale(1.11) rotate(-180deg);\r\n        }\r\n\r\n        20%,\r\n        50%,\r\n        80% {\r\n            transform: scale(0.9) rotate(-360deg);\r\n        }\r\n    }\r\n</style>';

// src/core/ui/entry.ts
var UiEntryType = "new";
var BilioldEntry = class extends HTMLElement {
  stage;
  gear;
  root;
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
customElements.get("biliold-entry-aa44074") || customElements.define("bilibili-entry-aa44074", BilioldEntry);

// src/core/userstatus.ts
var userStatus = {
  development: true,
  index: true,
  toast: Toastconfig,
  header: true,
  comment: true,
  av: true,
  player: true,
  webRTC: false,
  elecShow: true,
  staff: false,
  bangumi: true,
  videoLimit: {
    status: false,
    server: "内置",
    th: "api.global.bilibili.com",
    tw: "",
    hk: "",
    cn: ""
  },
  uposReplace: {
    th: "ks3（金山）",
    gat: "不替换",
    nor: "不替换",
    download: "不替换"
  },
  bangumiEplist: false,
  accessKey: {
    token: "",
    date: 0,
    dateStr: ""
  },
  watchlater: true,
  playlist: true,
  ranking: true,
  read: true,
  search: true,
  album: true,
  jointime: false,
  lostVideo: true,
  history: true,
  liveRecord: false,
  uiEntryType: UiEntryType,
  automate: {
    danmakuFirst: false,
    showBofqi: false,
    screenWide: false,
    noDanmaku: false,
    autoPlay: false,
    webFullScreen: false,
    videospeed: false
  },
  videoDisableAA: false,
  disableSleepChcek: true,
  disableReport: true,
  commentJumpUrlTitle: false,
  ugcSection: false,
  downloadType: ["mp4"],
  TVresource: false,
  downloadQn: 127,
  downloadMethod: "浏览器",
  userAgent: "Bilibili Freedoooooom/MarkII",
  referer: "https://www.bilibili.com",
  filepath: "",
  aria2: {
    server: "http://localhost",
    port: 6800,
    token: "",
    split: 4,
    size: 20
  },
  ef2: {
    delay: false,
    silence: false
  },
  like: false,
  bilibiliplayer: true
};

// src/core/user.ts
var User = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    this.BLOD.GM.getValue("userStatus", userStatus).then((status) => {
      status = Object.assign(userStatus, status);
      const proxy = propertryChangeHook(status, (key, value) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.BLOD.GM.setValue("userStatus", status));
        this.emitChange(key, value);
      });
      this.userStatus = proxy;
      this.initialized = true;
      while (this.BLOD.userLoadedCallbacks.length) {
        this.BLOD.userLoadedCallbacks.shift()?.(this.userStatus);
      }
    });
  }
  userStatus;
  initialized = false;
  updating;
  changes = {};
  timer;
  bindChange(key, callback) {
    this.changes[key] || (this.changes[key] = []);
    const id = this.changes[key].push(callback);
    return () => {
      delete this.changes[key][id - 1];
    };
  }
  emitChange(key, newValue) {
    this.changes[key].forEach(async (d) => {
      d(newValue);
    });
  }
  addCallback(callback) {
    if (typeof callback === "function") {
      if (this.initialized) {
        callback(this.userStatus);
      } else {
        this.BLOD.userLoadedCallbacks.push(callback);
      }
    }
  }
  restoreUserStatus() {
    this.BLOD.GM.deleteValue("userStatus");
    this.BLOD.toast.warning("已恢复默认设置数据，请<strong>刷新</strong>页面以避免数据紊乱！");
  }
  outputUserStatus() {
    this.BLOD.GM.getValue("userStatus", userStatus).then((d) => {
      saveAs(JSON.stringify(d, void 0, "	"), `Bilibili-Old-${timeFormat(void 0, true).replace(/ |:/g, (d2) => "-")}`, "application/json");
    });
  }
  inputUserStatus() {
    const msg = ["请选择一个备份的数据文件（.json）", "注意：无效的数据文件可能导致异常！"];
    const toast = this.BLOD.toast.toast(0, "warning", ...msg);
    fileRead("application/json").then((d) => {
      if (d && d[0]) {
        msg.push(`读取文件：${d[0].name}`);
        toast.data = msg;
        toast.type = "info";
        return readAs(d[0]).then((d2) => {
          const data = JSON.parse(d2);
          if (typeof data === "object") {
            this.BLOD.GM.setValue("userStatus", data);
            const text = "已恢复设置数据，请<strong>刷新</strong>页面以避免数据紊乱！";
            msg.push(text);
            toast.data = msg;
            toast.type = "success";
            return alert(text, "刷新页面", [{
              text: "刷新",
              callback: () => location.reload()
            }]);
          }
        }).catch((e) => {
          msg.push("读取文件出错！", e);
          toast.data = msg;
          toast.type = "error";
          debug.error("恢复设置数据", e);
        });
      }
    }).catch((e) => {
      msg.push(e);
      toast.data = msg;
    }).finally(() => {
      toast.delay = 4;
    });
  }
};

// src/utils/abv.ts
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
    if (/^[aA][vV][0-9]+$/.test(String(input)) || /^\d+$/.test(String(input)))
      return this.avToBv(Number(/[0-9]+/.exec(String(input))[0]));
    if (/^1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}$/.test(String(input)))
      return this.bvToAv("BV" + input);
    if (/^[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}$/.test(String(input)))
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

// src/utils/format/url.ts
var URL2 = class {
  hash;
  base;
  params = {};
  get param() {
    return Object.entries(this.params).reduce((s, d) => {
      return s += `${s ? "&" : ""}${d[0]}=${d[1]}`;
    }, "");
  }
  constructor(url) {
    const arr1 = url.split("#");
    let str = arr1.shift();
    this.hash = arr1.join("#");
    (this.hash || url.includes("#")) && (this.hash = `#${this.hash}`);
    const arr2 = str.split("?");
    this.base = arr2.shift();
    str = arr2.join("?");
    if (str) {
      str.split("&").forEach((d) => {
        const arr3 = d.split("=");
        const key = arr3.shift();
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
      });
    }
  }
  sort() {
    this.params = Object.keys(this.params).sort().reduce((s, d) => {
      s[d] = this.params[d];
      return s;
    }, {});
  }
  toJSON() {
    return `${this.base ? this.param ? this.base + "?" : this.base : ""}${this.param}${this.hash || ""}`;
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

// src/core/url.ts
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
  paramsSet = paramsSet;
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
  clear(str) {
    const url = new URL2(str);
    if (url) {
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
  location() {
    this.updateLocation(this.clear(location.href));
  }
  updateLocation(url) {
    const Url = new self.URL(url);
    if (Url.host === location.host) {
      window.history.replaceState(window.history.state, "", url);
    }
  }
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
  anchor(list) {
    list.forEach((d) => {
      if (!d.href)
        return;
      d.href = this.clear(d.href);
    });
  }
};

// src/utils/htmlvnode.ts
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
      if (this.html.startsWith(`</${this.tagNames.reduce((s, d) => s = d, void 0)}`)) {
        this.textContent();
        this.html = this.html.replace(new RegExp(`^</${this.tagNames.reduce((s, d) => s = d, void 0)}>`), "");
        this.popNode();
      } else {
        this.removeScanned();
        if (this.html.startsWith("!-- ")) {
          this.html = this.html.replace(/^!--[\S\s]+?-->/, "");
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
              case "\r":
              case "\n":
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
        case "`":
          !this.quote ? this.quote = "`" : this.quote === "`" && (this.quote = "");
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
            const str = this.html.substring(start, this.pos).replace(/\r|\n|"/g, "").replace(/^ +/, "");
            const prop = str.split("=");
            const key = prop.shift();
            key && key !== "/" && (this.targets.reduce((s, d) => s = d, void 0).props[key] = prop.join("=") || key);
            start = this.pos;
          }
          break;
        case ">":
          if (!value) {
            stop = true;
            const str = this.html.substring(start, this.pos).replace(/\r|\n|"/g, "").replace(/^ +/, "");
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
    const text = this.text.replace(/\r|\n| /g, "");
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
  appendTo(node) {
    node.append(this.toFragment());
  }
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

// src/page/page.ts
var Page = class {
  vdom;
  initilized = false;
  constructor(html) {
    this.vdom = new VdomTool(html);
    Reflect.defineProperty(window, "_babelPolyfill", {
      configurable: true,
      set: () => true,
      get: () => void 0
    });
    Reflect.deleteProperty(window, "webpackJsonp");
  }
  updateDom() {
    const title = document.title;
    this.vdom.replace(document.documentElement);
    Reflect.deleteProperty(window, "PlayerAgent");
    this.vdom.loadScript().then(() => this.loadedCallback());
    title && !title.includes("404") && (document.title = title);
  }
  loadedCallback() {
    this.initilized = true;
    poll(() => document.readyState === "complete", () => {
      document.querySelector("#jvs-cert") || window.dispatchEvent(new ProgressEvent("load"));
    });
  }
};

// src/html/index.html
var html_default = '<!-- <!DOCTYPE html> -->\r\n<html lang="zh-CN">\r\n\r\n<head>\r\n    <meta charset="utf-8" />\r\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\r\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\r\n    <meta name="keywords"\r\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\r\n    <meta name="renderer" content="webkit" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\r\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\r\n        title="哔哩哔哩" />\r\n    <link rel="stylesheet"\r\n        href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css" />\r\n    <style type="text/css">\r\n        /* 隐藏失效节点 */\r\n        #fixed_app_download,\r\n        #app>div.report-wrap-module.elevator-module>div.ver {\r\n            display: none;\r\n        }\r\n\r\n        /* 禁用失效节点 */\r\n        .bili-tab.rank-tab,\r\n        .bili-dropdown.rank-dropdown {\r\n            pointer-events: none;\r\n        }\r\n\r\n        /* 资讯区图标 */\r\n        .icon.icon_t.icon-news {\r\n            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMzNhZmQ3OS04ZTViLWQ2NDItOTYxZi0yNDM2MGQyN2JhM2YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTFEMzQ4MEJBNUM1MTFFQ0FGQTk5NEVFMjgwODg3M0UiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTFEMzQ4MEFBNUM1MTFFQ0FGQTk5NEVFMjgwODg3M0UiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBiNzNlZjA5LTA1ZmEtNTM0MC1iMWY3LWE4MTljMjFhYmEzMiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjI2MDJjOTk2LTBiNzQtZDQ0MC1hMzcxLTIxN2NkM2ZlOTgzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsCIXZoAAAi+SURBVHja7Fh7TJvXFT+fwTa2MX5gXjZgg3kEJvICh6YELUujNKNb10ZpWFc17aapSxcpy1YlUjctUbt0L22VMm2NlkXLsqZJWdT0sWwlaZOmCwW1gfIMCSYYDOZhDH6ADdjGvvvOhc8YY8Bru61/9EhX97vnnnvv755z7znnfgwhBD7PxIPPOcWHNxiGWdSp0Wi2eX0+uSxJVuxyOaXIk8nkk1hj2+FwlHGyCoWiMbwfaXLCNRIEsAsFAufU9LSdLxL2jw4O21cCFGlRJpzBAUzTqnX2Qdtlti8/XFir04AqK58RieVgtxinPB6XyFBRRQf19nfDtH10Cr+Rj/XIuNvnnXQJuPFCqcznc0+YgyRoCQaD/ckq1d/HbLaLMQP0zPjmtCFN7Nq45csFzxz4IeTk6ilPJBGDLjMNJAmCmM0zMu4Ci2UEek09YBs0w+jENHR13aV9nS0fTHXe6hRpdbojPT13jy0HkDK44p72QmpKyncl8uQZEiOxY2j5JLT/0E9IfFx8EC0WDQ+WJRqUihNOVz++78nzZ14KafS/QWgJnF+eKCFypWI3Z+pIDS65xTweL7vSULLsxHE8Hj2rkRdq0Rzz/VzhLSOLIEsrtzIsCGXMbobH8DJzS8qjCuMygWAwpP7lKBhhpmAUWc46ZYZy7M+PGaAgMUkb3u7r7YWrV94Bv98PZL7d3NT0mZm6pGQdhLurFQF2dfaowt0C3anbDUODg9DR1hZq28ftnxlAbbaeWi0mgLV1danRHLZAKGQBtgPr+BbxUZM1587DG6+9Bk6nk7aNXV2078b196m2kdACttFRWr98+i+s3MeRniTf+uP90phMjOBUcskinkqlArVGAw0f1Id4uCCC1uXowOv1Qf2NOhAIBHDX2E03guAGzP1UDi3g9/lpvbGsFHL0uaF5sjQptD6Vti5rVYDD/b1aTnuRx3rt+nV0gZHhEdoetVpp7Z50g1AogPGxMdBkZdG612SiG0KQKKfLyQF1pgYK1hRCR3sHCPj80LzJiiQaYXDtVQFmZOeYlzsLKampdCEEGW56BF5RWQk7H6gCuVw+dxxYEPr8PJAmSeHjxibI0mZT+fLNm0EqlcL1a+99umxmzOmJKlxqWLhsOblzZmpraYU7nbfxJtI2mtzn9YImMxMy1GrKS2U3N2QZpGdwcnISfD7vkrndnqn1q2Yzx399lNrP7bCGeLl5emo6JLFEAl9/+KGF7288SM0pSUwEuUIx5zbWroXCoiLgs2bE71y9nsoioVbTM9JDm0NiN0PQcyRKxC2rAmx/Ypdff6IGPaiQu8cikZgWjtCMHOHCXypZHHWQJw7/ngeHNR6RSJqc8jJRjnx0E0t++iLN5UYtff+zhHTaQzM0MFRs88d0Bll1m+saO0KxcqWElgt/keyFWLy0L5IwFUOyDPQOxQQwL0/f8uGNSySWbJdzR5HshVi8tC+SME+E1VLs8HxQlZKyC3O0my13FuVuASyBIC3++TKL7SCbH9PyiVJC8s29TxPMP7lIEpkPxi9RqSD+OtavvPQ8FB0/DX0WKzVjUe1lGLm/FOKS9ayb8BE2ajAkTI+xPg7T/noOhqrKwK/eACn8IH0qZKepmtN+/ofJVW8xkulun51NWs/86W+XH12z5U0hBvPUty4A+f0JMmLez1j2PAYJXh89WbJpE1imJaAWutlavOwxQOKrsyGruR54hw5Pqxu3i7oOfh9uTCXTd4xtfPxfy20o6puELp4ovpoglVfI9v5CaPBPwQWlHWzt3dOHlEoRXoDkNDkok5SQmiRaERhH+B550GaFEkkCtHtm4HmvGhqMTeB4/1VjYpK02mG3t0SbZ5EGERSmPrOB2Xo2swZJaZXQVvxVeKf1FrQ+ooNS93HR2NlzYFLIiNXu8eFkMxNOAcbSCE8g4F5x4d/fySsW8N/4DbPjnBkc7nWgvP4q4FocuJhMLMsvLSDf/lGB3J9FknfeA/iasXS+jUGMTd5K4NK+FOAfe44Z7LopnHv7OsEx7hAqkuciCfsdmovlURlpkhy89WcFWa1+hkgVILS0Anm4wKerqBHAweonXd1N9yLQ3Fw9+pxjywJMksmewTRPf98jkC2eZHrYvIDPruv0Z8OfGzuhbE8pkOpfAsyOgKbQQGuINwC5+RGQzjvAFK8BYh0G3mM7WH76fH86ndv/8iWGbNDDW7e9MDNkhfUBEPBU2ZB7tgGCY/0FfQerC/q7m4yRABf5QVS1w3jzWt/hvdA/JaXgkGZScqCm9haAZhN0GPLh/vRiYDUYWpwxbAJIl8Hsm/+gIClx4Nj6e9u2B4/WnATeE3vhSkc3O5+Bzu1nlc0qYi6iDHd78Syu6Adp5qHJUPLj+V2p9z1O9C80BAsvuMiGdwkRP11L37F6vTaIfhJL+dbt5OBT3yL1b9cQ4h+ec2xsffujK5R39IXfEk4WC8qqD5wkca+4yKYmQgu2sQ/9bzQ/uARgWBb9KxyIE+y+PUF4R7qoQ0XHah60UnAcSORvrdpNN4BtVdE9RLn7Z7Qgf3jMSUFzfARWdtlMx+PYlR7uUQHiTyPUIg7efMJEJ0QNNgy4QxGgd8JPeRzhwqh13BD+aUDZHadM7sjIgWOY94gX50QLIWhUxnIajI92tfGPFv7g8bknoO1Zg1aUkS9k2DNy3LNHOPDQ16CYTbFOmueGbjn2Lq2dxXtg16MZ8M/f1bNuyQi1bR6oa3ZKjmaOwE4yAC5RHpjaP4REYwNk1Mv4cco0UJSpGUfzAzDx+nOHAsHAGXaaiys66mjZCqo/MOXfyG6nnHu/snnKVwRPXWKqDtwLF88PUzkEp01LBLPVTUHixcoR2on5SCVwfhJ9IveHayGxCFqSlcrzozbbqZh/v60YS1nAbpf3zj6TTZgvWBjb7Vs6FvuvnfwjvH74B0aZQv5sIBAwrfaP8FMDjIuLu6ooMGz7TxNT1hkb/bP+wtXkVgT4xT/qLwD+H+jfAgwAa4KbOGyf2aUAAAAASUVORK5CYII=);\r\n            background-position: unset;\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div id="home-app"></div>\r\n    <div id="app" data-server-rendered="true"></div>\r\n    <div class="footer bili-footer report-wrap-module"></div>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\/script>\r\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js"><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"><\/script>\r\n    <script src="//static.hdslb.com/common/js/footer.js"><\/script>\r\n</body>\r\n\r\n</html>';

// src/html/news.html
var news_default = '<div class="r-con">\r\n    <div class="r-con">\r\n        <header style="margin-bottom: 14px">\r\n            <h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3>\r\n        </header>\r\n        <div class="carousel-module">\r\n            <div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img\r\n                        src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp"\r\n                        width="260" height="280" /></a></div>\r\n        </div>\r\n    </div>\r\n</div>';

// src/io/api.ts
var import_md5 = __toESM(require_md5());
function jsonCheck(str) {
  const result = typeof str === "string" ? JSON.parse(str) : str;
  if (result.code === 0)
    return result;
  throw new Error(`${result.code} ${result.message}`, { cause: result.code });
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
  return APP_KEY2;
})(APP_KEY || {});
var ApiSign = class {
  constructor(url, appkey) {
    this.url = url;
    this.appkey = appkey;
  }
  get ts() {
    return new Date().getTime();
  }
  sign(searchParams = {}, api = "") {
    const url = new URL2(this.url);
    Object.assign(url.params, searchParams, { ts: this.ts });
    delete url.params.sign;
    api && (this.appkey = "27eb53fc9058f8c3");
    const appSecret = this.appSecret;
    url.params.appkey = this.appkey;
    url.sort();
    url.params.sign = (0, import_md5.default)((api ? `api=${decodeURIComponent(api)}` : url.param) + appSecret);
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
        switch (Math.trunc(new Date().getHours() / 4)) {
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

// src/io/urls.ts
var _URLS = class {
};
var URLS = _URLS;
__publicField(URLS, "P_AUTO", "//");
__publicField(URLS, "P_HTTP", "http://");
__publicField(URLS, "P_HTTPS", "https://");
__publicField(URLS, "P_WS", "ws://");
__publicField(URLS, "P_WSS", "wss://");
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

// src/io/api-webshow-locs.ts
function ApiWebshowLocs(data) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.WEBSHOW_LOCS, {
      pf: 0,
      ids: data.ids.join(",")
    })).then((d) => d.text()).then((d) => resolve(jsonCheck(BV2avAll(d)).data)).catch((e) => reject(e));
  });
}

// src/io/api-index-top-rcmd.ts
function apiIndexTopRcmd(data) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.INDEX_TOP_RCMD, {
      fresh_type: data?.fresh_type || 3
    }), {
      credentials: data?.credentials || "include"
    }).then((d) => d.json()).then((d) => resolve(jsonCheck(d).data.item.map((d2) => {
      d2.author = d2.owner.name;
      d2.play = d2.stat.view;
      d2.aid = d2.id;
      return d2;
    }))).catch((e) => reject(e));
  });
}

// src/utils/cookie.ts
function getCookies() {
  return document.cookie.split("; ").reduce((s, d) => {
    let key = d.split("=")[0];
    let val = d.split("=")[1];
    s[key] = unescape(val);
    return s;
  }, {});
}
function setCookie(name, value, days = 365) {
  const exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1e3);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toUTCString() + "; path=/; domain=.bilibili.com";
}

// src/utils/conf/uid.ts
var uid = Number(getCookies().DedeUserID);

// src/utils/hook/node.ts
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

// src/utils/hook/xhr.ts
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
        return "content-type: application/octet-stream\r\n";
      case "document":
        return "content-type: text/xml; charset=utf-8\r\n";
      case "json":
        return "content-type: application/json; charset=utf-8\r\n";
      default:
        return "content-type: text/plain; charset=utf-8\r\n";
    }
  };
}

// src/utils/format/unit.ts
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

// src/io/api-page-header.ts
function apiPageHeader(data) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.PAGE_HEADER, data)).then((d) => d.json()).then((d) => resolve(jsonCheck(d).data)).catch((e) => reject(e));
  });
}

// src/utils/format/subarray.ts
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

// src/css/avatar-animation.css
var avatar_animation_default = "/* 鼠标放在顶栏上的动效 */\r\n.bili-header-m .profile-info .i-face .face {\r\n    border: 0\r\n}\r\n\r\n.bili-header-m .profile-info .i-face .pendant {\r\n    transform: scale(0.5);\r\n    width: 112px;\r\n    height: 112px;\r\n    left: -41px;\r\n    bottom: -46px;\r\n    opacity: 0;\r\n    transition: opacity .1s ease-in\r\n}\r\n\r\n.bili-header-m .profile-info.on .i-face {\r\n    left: 8px !important;\r\n    top: 0 !important;\r\n    height: 32px !important;\r\n    width: 32px !important;\r\n    transform: translateY(10px) translateX(-16px) scale(2);\r\n    transform-origin: top left\r\n}\r\n\r\n.bili-header-m .profile-info.on .i-face .legalize {\r\n    transform: scale(0.5) translate(10px, 15px)\r\n}\r\n\r\n.bili-header-m .profile-info.on .i-face .pendant {\r\n    opacity: 1\r\n}\r\n\r\n.bili-header-m .profile-info.on .i-face .face {\r\n    border: 0;\r\n    box-shadow: 0 0 0 2px #fff\r\n}\r\n\r\n.bili-header-m .profile-info.on .i-face.scale-in {\r\n    transform: translateY(5px) translateX(-10px) scale(1.75)\r\n}\r\n\r\n.bili-header-m .profile-info.on .scale-in .face {\r\n    height: 32px;\r\n    width: 32px\r\n}\r\n\r\n.bili-header-m .profile-info.on .i-face.scale-in .legalize {\r\n    transform: scale(0.5) translate(38px, 48px)\r\n}";

// src/css/message.css
var message_default = "/* 修复消息页样式 */\r\n.container[data-v-6969394c] {\r\n    height: calc(100vh - 42px) !important;\r\n}\r\n\r\n.container[data-v-1c9150a9] {\r\n    height: calc(100vh - 42px) !important;\r\n}\r\n\r\n.im-root,\r\n.im-root .im-list-box * {\r\n    font-size: 12px;\r\n    line-height: 42px;\r\n}\r\n\r\n.im-root .im-list-box {\r\n    width: 100%;\r\n    overflow: visible;\r\n}\r\n\r\n.im-root .im-list-box .im-list {\r\n    line-height: 42px;\r\n    height: 42px;\r\n}\r\n\r\n.im-root .im-list-box .im-notify.im-number {\r\n    height: 14px;\r\n    line-height: 13px;\r\n    border-radius: 10px;\r\n    padding: 1px 3px;\r\n    font-size: 12px;\r\n    min-width: 20px;\r\n    text-align: center;\r\n    color: #fff;\r\n}\r\n\r\n.im-root .im-list-box .im-notify.im-number.im-center {\r\n    top: 14px;\r\n    left: 80px;\r\n}\r\n\r\n.im-root .im-list-box .im-notify.im-dot {\r\n    top: 11px;\r\n    right: -10px;\r\n    width: 8px;\r\n    height: 8px;\r\n    border-radius: 100%;\r\n}\r\n\r\n.im-root .im-list-box .im-notify.im-dot.im-center {\r\n    top: 16px;\r\n    right: 20px;\r\n}";

// src/page/header.ts
var _Header = class {
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
  static plaza() {
    jsonpHook.async("api.bilibili.com/plaza/banner", () => true, async () => {
      return { "code": 0, "result": [{ "link": "https://www.bilibili.com/blackboard/x/act_list", "end": 1640966407, "begin": 1456709887, "title": "bilibili 活动", "cover": "http://i0.hdslb.com/bfs/square/6830d0e479eee8cc9a42c3e375ca99a5147390cd.jpg", "id": 9, "created_ts": 1491386053 }, { "link": "http://www.bilibili.com/blackboard/topic_list.html", "end": 1640966418, "begin": 1544258598, "title": "话题列表", "cover": "http://i0.hdslb.com/bfs/square/b1b00a0c3ce8570b48277ae07a2e55603a4a4ddf.jpg", "id": 17, "created_ts": 1491386030 }] };
    }, false);
  }
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
  static message() {
    addCss(message_default, "message");
  }
  static videoOffset() {
    if (uid) {
      const offset2 = getCookies()[`bp_video_offset_${uid}`];
      if (offset2) {
        setCookie(`bp_t_offset_${uid}`, offset2);
      }
    }
  }
  miniHeader() {
    this.oldHeader.classList.remove("has-menu");
  }
  static isMiniHead(d) {
    return location.href.includes("blackboard/topic_list") || location.href.includes("blackboard/x/act_list") || document.querySelector(".large-header") || document.querySelector(".bili-banner") || d?.getAttribute("type") == "all" ? false : true;
  }
  constructor() {
    this.oldHeader.className = "z-top-container has-menu";
    this.hookHeadV2();
    this.feedCount();
    poll(() => document.readyState === "complete", () => this.styleClear());
  }
  hookHeadV2() {
    poll(() => {
      return document.querySelector("#internationalHeader") || document.querySelector("#biliMainHeader") || document.querySelector("#bili-header-container");
    }, (d) => {
      _Header.isMiniHead(d) && this.miniHeader();
      this.loadOldHeader(d);
    });
    poll(() => document.querySelector(".z_top_container"), (d) => {
      this.loadOldHeader(d);
      document.querySelector(".header").style.display = "none";
    });
    poll(() => document.querySelector(".international-footer"), (d) => this.loadOldFooter(d));
    poll(() => document.querySelector("#biliMainFooter"), (d) => this.loadOldFooter(d));
  }
  oldHeadLoaded = false;
  oldHeader = document.createElement("div");
  loadOldHeader(target) {
    if (target) {
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
    });
  }
  static styleFix() {
    addCss(".nav-item.live {width: auto;}.lt-row {display: none !important;} .bili-header-m #banner_link{background-size: cover;background-position: center !important;}", "lt-row-fix");
    addCss(avatar_animation_default, "avatarAnimation");
  }
  async styleClear() {
    const d = document.styleSheets;
    for (let i = 0; i < d.length; i++) {
      (d[i].href?.includes("laputa-footer") || d[i].href?.includes("laputa-header")) && (d[i].disabled = true);
    }
    _Header.styleFix();
  }
  feedCount() {
    xhrHook.async("api.live.bilibili.com/ajax/feed/count", void 0, async () => {
      const response = '{ "code": 0, "data": { "count": 0 }, "message": "0" }';
      return { response, responseText: response };
    }, false);
  }
};
var Header = _Header;
__publicField(Header, "locs", [1576, 1612, 1580, 1920, 1584, 1588, 1592, 3129, 1600, 1608, 1604, 1596, 2210, 1634, 142]);
__publicField(Header, "record", {});
__publicField(Header, "rid", _Header.resourceId());

// src/io/api-season-rank-list.ts
function apiSeasonRankList(data) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.SEASON_RANK_LIST, {
      season_type: data.season_type,
      day: 3
    })).then((d) => d.json()).then((d) => resolve(jsonCheck(d).data.list)).catch((e) => reject(e));
  });
}

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
  constructor(BLOD2) {
    super(html_default);
    this.BLOD = BLOD2;
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
  }
  locsData() {
    ApiWebshowLocs({ ids: [4694, 29, 31, 34, 40, 42, 44] }).then((d) => {
      __INITIAL_STATE__.locsData[23] = this.adblock(d[4694]);
      __INITIAL_STATE__.locsData[29] = this.adblock(d[29]);
      __INITIAL_STATE__.locsData[31] = this.adblock(d[31]);
      __INITIAL_STATE__.locsData[34] = this.adblock(d[34]);
      __INITIAL_STATE__.locsData[40] = this.adblock(d[40]);
      __INITIAL_STATE__.locsData[42] = this.adblock(d[42]);
      __INITIAL_STATE__.locsData[44] = this.adblock(d[44]);
    }).catch((e) => {
      this.BLOD.toast.error("locsData Error!", e)();
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
      this.BLOD.toast.error("recommendData Error!", e)();
    });
  }
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
  newlist() {
    jsonpHook(["newlist", "rid=202"], (url) => url.replace("rid=202", "rid=203"), void 0, false);
  }
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
          let html = `<header class="rank-head"><h3>排行</h3><div class="bili-dropdown rank-dropdown"><span class="selected">三日</span><i class="icon icon-arrow-down"></i><ul class="dropdown-list"><li class="dropdown-item" style="display: none;">三日</li><li class="dropdown-item">一周</li></ul></div></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list">`;
          for (let i = 0; i < 8; i++) {
            html += `<li class="rank-item${i < 3 ? " highlight" : ""}"><i class="ri-num">${i + 1}</i><a href="${d[i].url}" target="_blank" title="${d[i].title} 播放:${d[i].stat.view}" class="ri-info-wrap"><p class="ri-title">${d[i].title}</p><span class="ri-total">${d[i].new_ep.index_show}</span></a></li>`;
          }
          html += `</ul></div><a href="${arr2[2]}" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>`;
          const vnode = htmlVnode(html);
          vnode[1].children[0].children?.forEach((t, i) => {
            let node;
            t.event = {
              "mouseover": (e) => {
                const target = e.target;
                const nodes = `<div class="bangumi-info-module" style="left: ${target.getBoundingClientRect().left}px; top: ${getTotalTop(target) - 150}px;"><div class="v-preview clearfix"><div class="lazy-img cover"><img alt="${d[i].title}" src="${d[i].cover.replace("http:", "")}@72w_72h.webp" /></div><div><p class="title">${d[i].title}</p><p class="desc">${d[i].new_ep.index_show}</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>${unitFormat(d[i].stat.view)}</span><span class="danmu"><i class="icon"></i>${unitFormat(d[i].stat.danmaku)}</span><span class="fav"><i class="icon"></i>${unitFormat(d[i].stat.follow)}</span></div></div>`;
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
};

// src/core/comment.ts
var Feedback;
var loading = false;
var load = false;
var events = {};
var Comment = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    Feedback = void 0;
    loading = false;
    load = false;
    events = {};
    this.bbComment();
    this.initComment();
    this.pageCount();
  }
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
            loadScript(`//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js`).then(() => {
              load = true;
            });
          }
          loading = true;
          setTimeout(() => window.initComment(...arguments), 100);
        };
      }
    });
  }
  pageCount() {
    jsonpHook(["api.bilibili.com/x/v2/reply?", "sort=2"], void 0, (res) => {
      if (0 === res.code && res.data?.page) {
        const page = res.data.page;
        page && jsonpHook(["api.bilibili.com/x/v2/reply?", "sort=0"], void 0, (res2) => {
          if (0 === res2.code && res2.data?.page) {
            page.count && (res2.data.page.count = page.count);
            page.acount && (res2.data.page.acount = page.acount);
          }
          return res2;
        }, false);
      }
      return res;
    });
  }
  bbCommentModify() {
    this.styleFix();
    this.initAbtest();
    this._renderBottomPagination();
    this._createListCon();
    this._createSubReplyItem();
    this._registerEvent();
    this.BLOD.status.commentJumpUrlTitle && this._resolveJump();
  }
  styleFix() {
    addCss(`.bb-comment .comment-list .list-item .info .btn-hover, .comment-bilibili-fold .comment-list .list-item .info .btn-hover {
            line-height: 24px;
        }`, "comment-btn-24pxH");
    addCss(`.operation.btn-hide-re .opera-list {visibility: visible}`, "keep-operalist-visible");
  }
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
        this.$root.find(".bottom-page").addClass("center").html(html);
        return;
      }
      const count = Math.ceil(pageInfo.count / pageInfo.size);
      if (count > 1) {
        this.$root.find(".header-interaction").addClass("paging-box").paging({
          pageCount: count,
          current: pageInfo.num,
          backFn: (p) => {
            this.$root.trigger("replyPageChange", {
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
        this.$root.find(".bottom-page").paging({
          pageCount: count,
          current: pageInfo.num,
          jump: true,
          smallSize: this.smallPager,
          backFn: (p) => {
            this.$root.trigger("replyPageChange", {
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
        this.$root.find(".header-page").html("");
        this.$root.find(".bottom-page").html("");
      }
    };
  }
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
        this._createPerfectReply(item),
        '<div class="info">',
        item.floor ? '<span class="floor">#' + item.floor + "</span>" : "",
        this._createPlatformDom(item.content.plat),
        '<span class="time-location">',
        '<span class="reply-time">'.concat(this._formateTime(item.ctime), "</span>"),
        item?.reply_control?.location ? `<span class="reply-location">${item?.reply_control?.location || ""}</span>` : "",
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
        item?.reply_control?.location ? `<span class="reply-location">${item?.reply_control?.location || ""}</span>` : "",
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
  _registerEvent() {
    const _registerEvent = Feedback.prototype._registerEvent;
    Feedback.prototype._registerEvent = function(e) {
      _registerEvent.call(this, e);
      let n = this.$root;
      let $ = window.$;
      if (e)
        n = $(e);
      let l = this;
      n.on("click.dialog", ".dialog", function() {
        let clickTarget = this;
        clickTarget.innerHTML = "正在载入……";
        let rootid = clickTarget.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
        let dialogid = clickTarget.getAttribute("dialog-id");
        let selfRpid = clickTarget.getAttribute("data-id");
        addCss(`
            .comment-dialog .dialog{display:none!important}
            .comment-dialog > .comment-list{transform:translateY(-13px)}
            .comment-dialog{min-height:200px;max-height:70vh;overflow-y:auto}
            .comment-dialog-container{width:600px;z-index:100000;position:fixed;background:#fff;left:50%;top:50%;transform:translate(-50%,-50%);box-shadow:0 0 20px 3px #0000005c;border-radius:10px;padding:0 18px;opacity:1;transition:opacity 0.1s}
            .comment-dialog-container.hidden{opacity:0}`, "comment-dialog");
        let container = document.createElement("div");
        container.className = "comment-dialog-container hidden";
        container.innerHTML = `
            <div class="comment-dialog bb-comment">
            <div class="comment-list">
            <div class="list-item" data-id="${rootid}">
            <div class="con" style="border:none;margin:0;padding:0;">
            <div class="reply-box">
            </div></div></div></div></div>`;
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
          return $.ajax({
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
          node = $(node);
          node.find(".reply-item").each(function(_, n2) {
            var t = $(n2).find(".reply-face"), r = $(n2).find(".user"), n2 = $(n2).find(".name");
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
                replyBox.querySelector(`div[data-id="${selfRpid}"]`).style.cssText = `
                            background: linear-gradient(45deg, rgba(115,108,231,0.13) 0%, rgba(0,161,214,0.13) 67%, rgba(0,212,255,0.13) 100%);
                            border-radius: 15px;
                            margin-right: 15px;`;
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
          $(".opera-list").hide(), $(this).siblings(".opera-list").show(), e2.stopPropagation(), $(this).hasClass("more-operation") && (e2 = +$(this).parents(".reply-wrap:eq(0)").attr("data-id"));
          l.lastClickOperation = this;
        } else
          operalist && (operalist.style.display = "none");
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
          var _jumpInfo$extra;
          var jumpInfo = jumpUrl[jumpKey];
          var img = jumpInfo.prefix_icon ? '<img src="' + jumpInfo.prefix_icon + '" class="jump-img"/>' : "";
          var content = jumpKey;
          if ((_jumpInfo$extra = jumpInfo.extra) !== null && _jumpInfo$extra !== void 0 && _jumpInfo$extra.is_word_search) {
            continue;
          } else {
            var url = jumpInfo.pc_url ? jumpInfo.pc_url : jumpKey.indexOf("http") === 0 ? jumpKey : this._createLinkById(jumpKey);
            var res = img + (jumpInfo.state === 0 ? '<a href="' + url + '" data-report="' + this.jumpReportIndex + '" class="comment-jump-url" target="_blank">' + content + "</a>" : content);
            var reg = new RegExp(jumpKey.replace(/\?/, "\\?"), "ig");
            try {
              var regStr = jumpKey.replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\?/, "\\?");
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
};

// src/io/api-article-cards.ts
function apiArticleCards(data) {
  return new Promise((resolve, reject) => {
    const arr2 = [];
    Object.entries(data).forEach((d) => {
      if (d[1]) {
        (isArray(d[1]) ? d[1] : [d[1]]).forEach((t) => arr2.push(d[0] + t));
      }
    });
    if (!arr2.length)
      return reject();
    fetch(objUrl(URLS.ARTICLE_CARDS, {
      ids: arr2.join(",")
    })).then((d) => d.json()).then((d) => resolve(jsonCheck(d).data)).catch((e) => reject(e));
  });
}

// src/core/observer.ts
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

// src/core/player.ts
var GroupKind = /* @__PURE__ */ ((GroupKind2) => {
  GroupKind2[GroupKind2["Ugc"] = 0] = "Ugc";
  GroupKind2[GroupKind2["Pgc"] = 1] = "Pgc";
  GroupKind2[GroupKind2["Pugv"] = 2] = "Pugv";
  return GroupKind2;
})(GroupKind || {});
var _Player = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    this.EmbedPlayer();
    switchVideo(this.switchVideo);
  }
  static addModifyArgument(callback) {
    this.modifyArgumentCallback.push(callback);
  }
  GroupKind = GroupKind;
  initData = {};
  EmbedPlayer() {
    methodHook(window, "EmbedPlayer", () => this.BLOD.loadplayer(), (d) => this.modifyArgument(d));
    propertyHook(window, "nano", this);
  }
  modifyArgument(args) {
    const obj = urlObj(`?${args[2]}`);
    this.BLOD.status.automate.screenWide && (obj.as_wide = 1);
    this.BLOD.status.automate.autoPlay && (obj.autoplay = 1);
    this.BLOD.status.automate.noDanmaku && (obj.danmaku = 0);
    args[2] = objUrl("", obj);
    while (_Player.modifyArgumentCallback.length) {
      _Player.modifyArgumentCallback.shift()?.(args);
    }
  }
  createPlayer(initData, theme) {
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
    return this;
  }
  connect() {
    window.EmbedPlayer("player", "", objUrl("", this.initData));
    addCss(`#bofqi .player,#bilibili-player .player{width: 100%;height: 100%;display: block;}.bilibili-player .bilibili-player-auxiliary-area{z-index: 1;}`, "nano-fix");
    Object.defineProperties(this, {
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
      volume: { get: () => window.player?.volume }
    });
  }
  switchVideo = async () => {
    if (!this.BLOD.videoInfo.metadata && this.BLOD.aid) {
      apiArticleCards({ av: this.BLOD.aid }).then((d) => {
        Object.values(d).forEach((d2) => this.BLOD.videoInfo.aidDatail(d2));
        this.BLOD.videoInfo.mediaSession();
      }).catch((e) => {
        debug.error("获取aid详情出错！", e);
      });
    } else {
      this.BLOD.videoInfo.mediaSession();
    }
  };
};
var Player = _Player;
__publicField(Player, "modifyArgumentCallback", []);

// src/core/webrtc.ts
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

// src/html/av.html
var av_default = '<!-- <!DOCTYPE html> -->\r\n<html lang="zh-CN">\r\n\r\n<head>\r\n    <meta charset="utf-8" />\r\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\r\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\r\n    <meta name="keywords"\r\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\r\n    <meta name="renderer" content="webkit" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\r\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\r\n        title="哔哩哔哩" />\r\n    <link rel="stylesheet"\r\n        href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" />\r\n    <style type="text/css">\r\n        #bofqi .player {\r\n            width: 980px;\r\n            height: 620px;\r\n            display: block;\r\n        }\r\n\r\n        @media screen and (min-width:1400px) {\r\n\r\n            #bofqi .player {\r\n                width: 1160px;\r\n                height: 720px\r\n            }\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div class="z-top-container has-menu"></div>\r\n    <div id="video-page-app"></div>\r\n    <div id="app" data-server-rendered="true"></div>\r\n    <div class="footer bili-footer report-wrap-module"></div>\r\n    <script type="text/javascript">\r\n        window.getInternetExplorerVersion = function () {\r\n            var e = -1; if ("Microsoft Internet Explorer" == navigator.appName) {\r\n                var r = navigator.userAgent;\r\n                null != new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r) && (e = parseFloat(RegExp.$1))\r\n            }\r\n            return e\r\n        };\r\n        function getQueryString(e) {\r\n            var r = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),\r\n                i = window.location.search.substr(1).match(r);\r\n            return null != i ? unescape(i[2]) : null\r\n        }\r\n        window.commentAgent = { seek: t => window.player && window.player.seek(t) };\r\n    <\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\/script>\r\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\r\n        crossorigin=""><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\r\n        crossorigin=""><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js"\r\n        crossorigin=""><\/script>\r\n    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\/script>\r\n</body>\r\n\r\n</html>';

// src/utils/hook/webpack.ts
var arr = [];
var param = [];
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
          if (arr[moreModules.length]) {
            const obj = arr[moreModules.length];
            const pam = param[moreModules.length];
            Object.entries(obj).forEach((d) => {
              let code = moreModules[d[0]];
              if (code) {
                code = code.toString();
                d[1].forEach((e) => code = e(code));
                moreModules[d[0]] = new Function(pam[0], pam[1], pam[2], `(${code})(${pam[0]},${pam[1]},${pam[2]})`);
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

// src/json/sort.txt
var sort_default = '[{name:"首页",route:"/",tid:"",locid:23,sub:[]},{name:"动画",route:"douga",tid:1,locid:52,count:"",subMenuSize:162,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2507,leftId:2452,rightId:2453},sub:[{name:"MAD·AMV",route:"mad",tid:24,ps:15,rps:10,ad:{active:!0,dataLocId:151},desc:"具有一定制作程度的动画或静画的二次创作视频",url:"//www.bilibili.com/video/douga-mad-1.html"},{name:"MMD·3D",route:"mmd",tid:25,ps:15,rps:10,ad:{active:!0,dataLocId:152},desc:"使用MMD（MikuMikuDance）和其他3D建模类软件制作的视频",url:"//www.bilibili.com/video/douga-mmd-1.html"},{name:"短片·手书·配音",route:"voice",tid:47,ps:15,rps:10,desc:"追求创新并具有强烈特色的短片、手书（绘）及ACG相关配音",url:"//www.bilibili.com/video/douga-voice-1.html"},{name:"手办·模玩",route:"garage_kit",tid:210,ps:15,rps:10,desc:"手办模玩的测评、改造或其他衍生内容",url:""},{name:"特摄",route:"tokusatsu",tid:86,ps:15,rps:10,desc:"特摄相关衍生视频",url:"//www.bilibili.com/video/cinephile-tokusatsu.html"},{name:"综合",route:"other",tid:27,ps:15,rps:10,ad:{active:!0,dataLocId:153},desc:"以动画及动画相关内容为素材，包括但不仅限于音频替换、杂谈、排行榜等内容",url:"//www.bilibili.com/video/douga-else-1.html"}]},{name:"番剧",route:"anime",tid:13,url:"//www.bilibili.com/anime/",takeOvered:!0,count:"",subMenuSize:172,combination:!0,sub:[{name:"连载动画",tid:33,route:"serial",desc:"当季连载的动画番剧",url:"//www.bilibili.com/video/bangumi-two-1.html"},{name:"完结动画",tid:32,route:"finish",desc:"已完结的动画番剧合集",url:"//www.bilibili.com/video/part-twoelement-1.html"},{name:"资讯",tid:51,route:"information",desc:"动画番剧相关资讯视频",url:"//www.bilibili.com/video/douga-else-information-1.html"},{name:"官方延伸",tid:152,route:"offical",desc:"动画番剧为主题的宣传节目、采访视频，及声优相关视频",url:"//www.bilibili.com/video/bagumi_offical_1.html"},{name:"新番时间表",url:"//www.bilibili.com/anime/timeline/",desc:""},{name:"番剧索引",url:"//www.bilibili.com/anime/index/",desc:""}]},{name:"国创",tid:167,route:"guochuang",url:"//www.bilibili.com/guochuang/",takeOvered:!0,count:"",subMenuSize:214,combination:!0,sub:[{name:"国产动画",tid:153,route:"chinese",desc:"我国出品的PGC动画",url:"//www.bilibili.com/video/bangumi_chinese_1.html"},{name:"国产原创相关",tid:168,route:"original",desc:"",url:"//www.bilibili.com/video/guochuang-fanvid-1.html"},{name:"布袋戏",tid:169,route:"puppetry",desc:"",url:"//www.bilibili.com/video/glove-puppetry-1.html"},{name:"动态漫·广播剧",tid:195,route:"motioncomic",desc:"",url:""},{name:"资讯",tid:170,route:"information",desc:"",url:"//www.bilibili.com/video/guochuang-offical-1.html"},{name:"新番时间表",url:"//www.bilibili.com/guochuang/timeline/",desc:""},{name:"国产动画索引",url:"//www.bilibili.com/guochuang/index/",desc:""}]},{name:"音乐",route:"music",tid:3,locid:58,count:"",subMenuSize:268,slider:{width:620,height:220},viewTag:!0,customComponent:{name:"Energy",titleId:2511,leftId:2462,rightId:3131,rightType:"slide"},sub:[{name:"原创音乐",route:"original",tid:28,ps:15,rps:10,viewHotTag:!0,ad:{active:!0,dataLocId:243},dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"原创歌曲及纯音乐，包括改编、重编曲及remix",url:"//www.bilibili.com/video/music-original-1.html"},{name:"翻唱",route:"cover",tid:31,ps:15,rps:10,ad:{active:!0,dataLocId:245},viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"对曲目的人声再演绎视频",url:"//www.bilibili.com/video/music-Cover-1.html"},{name:"演奏",route:"perform",tid:59,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"乐器和非传统乐器器材的演奏作品",url:"//www.bilibili.com/video/music-perform-1.html"},{name:"VOCALOID·UTAU",route:"vocaloid",tid:30,ps:15,rps:10,viewHotTag:!0,ad:{active:!0,dataLocId:247},dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"以VOCALOID等歌声合成引擎为基础，运用各类音源进行的创作",url:"//www.bilibili.com/video/music-vocaloid-1.html"},{name:"音乐现场",route:"live",tid:29,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"音乐表演的实况视频，包括官方/个人拍摄的综艺节目、音乐剧、音乐节、演唱会等",url:"//www.bilibili.com/video/music-oped-1.html"},{name:"MV",route:"mv",tid:193,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"为音乐作品配合拍摄或制作的音乐录影带（Music Video），以及自制拍摄、剪辑、翻拍MV",url:"//www.bilibili.com/video/music-coordinate-1.html"},{name:"乐评盘点",route:"commentary",tid:243,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"音乐类新闻、盘点、点评、reaction、榜单、采访、幕后故事、唱片开箱等",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音乐教学",route:"tutorial",tid:244,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"以音乐教学为目的的内容",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音乐综合",route:"other",tid:130,ps:15,rps:10,viewHotTag:!0,dpConfig:[{name:"一日",value:1},{name:"三日",value:3}],desc:"所有无法被收纳到其他音乐二级分区的音乐类视频",url:"//www.bilibili.com/video/music-collection-1.html"},{name:"音频",customZone:"Audio",route:"audio",url:"//www.bilibili.com/audio/home?musicType=music"},{name:"说唱",url:"//www.bilibili.com/v/rap"}]},{name:"舞蹈",route:"dance",tid:129,locid:64,count:"",subMenuSize:172,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2513,leftId:2472,rightId:2473},sub:[{name:"宅舞",route:"otaku",tid:20,ps:15,rps:10,ad:{active:!0,dataLocId:249},desc:"与ACG相关的翻跳、原创舞蹈",url:"//www.bilibili.com/video/dance-1.html"},{name:"街舞",route:"hiphop",tid:198,ps:15,rps:10,ad:{active:!0,dataLocId:251},desc:"收录街舞相关内容，包括赛事现场、舞室作品、个人翻跳、FREESTYLE等",url:""},{name:"明星舞蹈",route:"star",tid:199,ps:15,rps:10,desc:"国内外明星发布的官方舞蹈及其翻跳内容",url:""},{name:"中国舞",route:"china",tid:200,ps:15,rps:10,ad:{active:!0,dataLocId:253},desc:"传承中国艺术文化的舞蹈内容，包括古典舞、民族民间舞、汉唐舞、古风舞等",url:""},{name:"舞蹈综合",route:"three_d",tid:154,ps:15,rps:10,desc:"收录无法定义到其他舞蹈子分区的舞蹈视频",url:""},{name:"舞蹈教程",route:"demo",tid:156,ps:10,rps:6,desc:"镜面慢速，动作分解，基础教程等具有教学意义的舞蹈视频",url:"//www.bilibili.com/video/dance-demo-1.html"}]},{name:"游戏",route:"game",tid:4,locid:70,count:"",subMenuSize:240,slider:{width:470,height:216},viewTag:!0,customComponent:{name:"Energy",titleId:3761,leftId:3765,rightId:3775,rightType:"slide"},recommendCardType:"GameGroomBox",sub:[{name:"单机游戏",route:"stand_alone",tid:17,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:255},dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"以所有平台（PC、主机、移动端）的单机或联机游戏为主的视频内容，包括游戏预告、CG、实况解说及相关的评测、杂谈与视频剪辑等",url:"//www.bilibili.com/video/videogame-1.html"},{name:"电子竞技",route:"esports",tid:171,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:257},desc:"具有高对抗性的电子竞技游戏项目，其相关的赛事、实况、攻略、解说、短剧等视频。",url:"//www.bilibili.com/video/esports-1.html"},{name:"手机游戏",route:"mobile",tid:172,ps:10,rps:7,rankshow:1,viewHotTag:!0,desc:"以手机及平板设备为主要平台的游戏，其相关的实况、攻略、解说、短剧、演示等视频。",url:"//www.bilibili.com/video/mobilegame-1.html"},{name:"网络游戏",route:"online",tid:65,ps:10,rps:7,rankshow:1,viewHotTag:!0,ad:{active:!0,dataLocId:259},dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"由网络运营商运营的多人在线游戏，以及电子竞技的相关游戏内容。包括赛事、攻略、实况、解说等相关视频",url:"//www.bilibili.com/video/onlinegame-1.html"},{name:"桌游棋牌",route:"board",tid:173,ps:5,rps:3,rankshow:1,viewHotTag:!0,desc:"桌游、棋牌、卡牌对战等及其相关电子版游戏的实况、攻略、解说、演示等视频。",url:"//www.bilibili.com/video/boardgame-1.html"},{name:"GMV",route:"gmv",tid:121,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"由游戏素材制作的MV视频。以游戏内容或CG为主制作的，具有一定创作程度的MV类型的视频",url:"//www.bilibili.com/video/gmv-1.html"},{name:"音游",route:"music",tid:136,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"各个平台上，通过配合音乐与节奏而进行的音乐类游戏视频",url:"//www.bilibili.com/video/music-game-1.html"},{name:"Mugen",route:"mugen",tid:19,ps:5,rps:3,rankshow:1,viewHotTag:!0,dpConfig:[{name:"三日",value:3},{name:"一日",value:1},{name:"一周",value:7}],desc:"以Mugen引擎为平台制作、或与Mugen相关的游戏视频",url:"//www.bilibili.com/video/game-mugen-1.html"},{name:"游戏赛事",url:"//www.bilibili.com/v/game/match/",newIcon:!0}]},{name:"知识",route:"knowledge",tid:36,locid:76,count:"",subMenuSize:172,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2058,leftId:2047,rightId:2048},sub:[{name:"科学科普",route:"science",tid:201,ps:15,rps:10,ad:{active:!0,dataLocId:261},desc:"回答你的十万个为什么"},{name:"社科·法律·心理",route:"social_science",tid:124,ps:15,rps:10,ad:{active:!0,dataLocId:263},desc:"基于社会科学、法学、心理学展开或个人观点输出的知识视频"},{name:"人文历史",route:"humanity_history",tid:228,ps:15,rps:10,desc:"看看古今人物，聊聊历史过往，品品文学典籍"},{name:"财经商业",route:"business",tid:207,ps:15,rps:10,desc:"说金融市场，谈宏观经济，一起畅聊商业故事"},{name:"校园学习",route:"campus",tid:208,ps:15,rps:10,ad:{active:!0,dataLocId:265},desc:"老师很有趣，学生也有才，我们一起搞学习"},{name:"职业职场",route:"career",tid:209,ps:15,rps:10,desc:"职业分享、升级指南，一起成为最有料的职场人"},{name:"设计·创意",route:"design",tid:229,ps:15,rps:10,desc:"天马行空，创意设计，都在这里"},{name:"野生技能协会",route:"skill",tid:122,ps:15,rps:10,desc:"技能党集合，是时候展示真正的技术了"}]},{name:"科技",route:"tech",tid:188,locid:2977,count:"",subMenuSize:80,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2980,leftId:2978,rightId:2979},sub:[{name:"数码",route:"digital",tid:95,ps:15,rps:10,viewHotTag:!0,desc:"科技数码产品大全，一起来做发烧友",url:"#"},{name:"软件应用",route:"application",tid:230,ps:15,rps:10,viewHotTag:!0,desc:"超全软件应用指南",url:"#"},{name:"计算机技术",route:"computer_tech",tid:231,ps:15,rps:10,viewHotTag:!0,desc:"研究分析、教学演示、经验分享......有关计算机技术的都在这里",url:"#"},{name:"科工机械",route:"industry",tid:232,ps:15,rps:10,viewHotTag:!0,desc:"从小芯片到大工程，一起见证科工力量",url:"#"},{name:"极客DIY",route:"diy",tid:233,ps:15,rps:10,viewHotTag:!0,desc:"炫酷技能，极客文化，硬核技巧，准备好你的惊讶",url:"#"}]},{name:"运动",route:"sports",tid:234,locid:4639,isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4646,rightId:4652,rightType:"slide"},sub:[{name:"篮球·足球",route:"basketballfootball",tid:235,ps:15,rps:10,ad:{active:!0,dataLocId:4656},desc:"与篮球、足球相关的视频，包括但不限于篮足球赛事、教学、评述、剪辑、剧情等相关内容",url:"#"},{name:"健身",route:"aerobics",tid:164,ps:15,rps:10,desc:"与健身相关的视频，包括但不限于瑜伽、CrossFit、健美、力量举、普拉提、街健等相关内容",url:"//www.bilibili.com/video/fashion-body-1.html"},{name:"竞技体育",route:"athletic",tid:236,ps:15,rps:10,desc:"与竞技体育相关的视频，包括但不限于乒乓、羽毛球、排球、赛车等竞技项目的赛事、评述、剪辑、剧情等相关内容",url:"#"},{name:"运动文化",route:"culture",tid:237,ps:15,rps:10,desc:"与运动文化相关的视频，包络但不限于球鞋、球衣、球星卡等运动衍生品的分享、解读，体育产业的分析、科普等相关内容",url:"#"},{name:"运动综合",route:"comprehensive",tid:238,ps:15,rps:10,desc:"与运动综合相关的视频，包括但不限于钓鱼、骑行、滑板等日常运动分享、教学、Vlog等相关内容",url:"#"}]},{name:"汽车",route:"car",tid:223,locid:4428,isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4435,rightId:4441,rightType:"slide"},sub:[{name:"汽车生活",route:"life",tid:176,ps:15,rps:10,ad:{active:!0,dataLocId:4445},desc:"分享汽车及出行相关的生活体验类视频",url:"#"},{name:"汽车文化",route:"culture",tid:224,ps:15,rps:10,desc:"汽车改装、品牌历史、汽车设计、老爷车、汽车模型等",url:"#"},{name:"赛车",route:"racing",tid:245,ps:15,rps:10,desc:"F1等汽车运动相关",url:"#"},{name:"汽车极客",route:"geek",tid:225,ps:15,rps:10,desc:"汽车硬核达人聚集地，包括DIY造车、专业评测和技术知识分享",url:"#"},{name:"摩托车",route:"motorcycle",tid:240,ps:15,rps:10,desc:"骑士们集合啦",url:"#"},{name:"智能出行",route:"smart",tid:226,ps:15,rps:10,desc:"探索新能源汽车和未来智能出行的前沿阵地",url:"#"},{name:"购车攻略",route:"strategy",tid:227,ps:15,rps:10,desc:"丰富详实的购车建议和新车体验",url:"#"}]},{name:"生活",route:"life",tid:160,locid:88,count:"",subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2062,leftId:1674,rightId:1670},sub:[{name:"搞笑",route:"funny",tid:138,ps:15,rps:10,ad:{active:!0,dataLocId:273},desc:"各种沙雕有趣的搞笑剪辑，挑战，表演，配音等视频",url:"//www.bilibili.com/video/ent_funny_1.html",locid:4204,recommendId:4210,slider:{width:620,height:220},customComponent:{name:"Energy",leftId:4212,rightId:4218,rightType:"slide"}},{name:"家居房产",route:"home",tid:239,ps:15,rps:10,ad:{active:!0,dataLocId:275},desc:"与买房、装修、居家生活相关的分享",url:"#"},{name:"手工",route:"handmake",tid:161,ps:15,rps:10,desc:"手工制品的制作过程或成品展示、教程、测评类视频",url:"//www.bilibili.com/video/ent-handmake-1.html"},{name:"绘画",route:"painting",tid:162,ps:15,rps:10,desc:"绘画过程或绘画教程，以及绘画相关的所有视频",url:"//www.bilibili.com/video/ent-painting-1.html"},{name:"日常",route:"daily",tid:21,ps:15,rps:10,desc:"记录日常生活，分享生活故事",url:"//www.bilibili.com/video/ent-life-1.html"}]},{name:"美食",route:"food",tid:211,locid:4243,count:"",isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4258,rightId:4264},sub:[{name:"美食制作",route:"make",tid:76,ps:15,rps:10,ad:{active:!0,dataLocId:4268},desc:"学做人间美味，展示精湛厨艺",url:"#"},{name:"美食侦探",route:"detective",tid:212,ps:15,rps:10,desc:"寻找美味餐厅，发现街头美食",url:"#"},{name:"美食测评",route:"measurement",tid:213,ps:15,rps:10,desc:"吃货世界，品尝世间美味",url:"#"},{name:"田园美食",route:"rural",tid:214,ps:15,rps:10,desc:"品味乡野美食，寻找山与海的味道",url:"#"},{name:"美食记录",route:"record",tid:215,ps:15,rps:10,desc:"记录一日三餐，给生活添一点幸福感",url:"#"}]},{name:"动物圈",route:"animal",tid:217,locid:4365,count:"",isHide:!0,subMenuSize:164,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",leftId:4376,rightId:4381,rightType:"slide"},sub:[{name:"喵星人",route:"cat",tid:218,ps:15,rps:10,desc:"喵喵喵喵喵",url:"#",ad:{active:!0,dataLocId:4385}},{name:"汪星人",route:"dog",tid:219,ps:15,rps:10,desc:"汪汪汪汪汪",url:"#"},{name:"大熊猫",route:"panda",tid:220,ps:15,rps:10,desc:"芝麻汤圆营业中",url:"#"},{name:"野生动物",route:"wild_animal",tid:221,ps:15,rps:10,desc:"内有“猛兽”出没",url:"#"},{name:"爬宠",route:"reptiles",tid:222,ps:15,rps:10,desc:"鳞甲有灵",url:"#"},{name:"动物综合",route:"animal_composite",tid:75,ps:15,rps:10,desc:"收录除上述子分区外，其余动物相关视频以及非动物主体或多个动物主体的动物相关延伸内容",url:"#"}]},{name:"鬼畜",route:"kichiku",tid:119,locid:100,count:"",subMenuSize:182,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2509,leftId:2482,rightId:2483},sub:[{name:"鬼畜调教",route:"guide",tid:22,ps:15,rps:10,ad:{active:!0,dataLocId:285},desc:"使用素材在音频、画面上做一定处理，达到与BGM一定的同步感",url:"//www.bilibili.com/video/ent-Kichiku-1.html"},{name:"音MAD",route:"mad",tid:26,ps:15,rps:10,ad:{active:!0,dataLocId:287},desc:"使用素材音频进行一定的二次创作来达到还原原曲的非商业性质稿件",url:"//www.bilibili.com/video/douga-kichiku-1.html"},{name:"人力VOCALOID",route:"manual_vocaloid",tid:126,ps:15,rps:10,desc:"将人物或者角色的无伴奏素材进行人工调音，使其就像VOCALOID一样歌唱的技术",url:"//www.bilibili.com/video/kichiku-manual_vocaloid-1.html"},{name:"鬼畜剧场",route:"theatre",tid:216,ps:15,rps:10,desc:"使用素材进行人工剪辑编排的有剧情的作品"},{name:"教程演示",route:"course",tid:127,ps:10,rps:6,rightComponent:{name:"CmImgList",id:148},ad:{active:!0,dataLocId:289},hideDropdown:!1,desc:"鬼畜相关的教程演示",url:"//www.bilibili.com/video/kichiku-course-1.html"}]},{name:"时尚",route:"fashion",tid:155,locid:94,count:"",subMenuSize:124,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2515,leftId:2492,rightId:2493},sub:[{name:"美妆护肤",route:"makeup",tid:157,ps:15,rps:10,ad:{active:!0,dataLocId:279},desc:"彩妆护肤、美甲美发、仿妆、医美相关内容分享或产品测评",url:"//www.bilibili.com/video/fashion-makeup-fitness-1.html"},{name:"穿搭",route:"clothing",tid:158,ps:15,rps:10,ad:{active:!0,dataLocId:281},desc:"穿搭风格、穿搭技巧的展示分享，涵盖衣服、鞋靴、箱包配件、配饰（帽子、钟表、珠宝首饰）等",url:"//www.bilibili.com/video/fashion-clothing-1.html"},{name:"时尚潮流",route:"trend",tid:159,ps:15,rps:10,desc:"时尚街拍、时装周、时尚大片，时尚品牌、潮流等行业相关记录及知识科普",url:"#"}]},{name:"资讯",route:"information",tid:202,locid:4076,count:"",subMenuSize:60,slider:{width:620,height:220},viewTag:!1,sub:[{name:"热点",route:"hotspot",tid:203,ps:18,rps:10,desc:"全民关注的时政热门资讯"},{name:"环球",route:"global",tid:204,ps:18,rps:10,desc:"全球范围内发生的具有重大影响力的事件动态"},{name:"社会",route:"social",tid:205,ps:18,rps:10,desc:"日常生活的社会事件、社会问题、社会风貌的报道"},{name:"综合",route:"multiple",tid:206,ps:18,rps:10,desc:"除上述领域外其它垂直领域的综合资讯"}]},{name:"娱乐",route:"ent",tid:5,locid:82,count:"",subMenuSize:62,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2067,leftId:2065,rightId:2066},sub:[{name:"综艺",route:"variety",tid:71,ps:15,rps:10,ad:{active:!0,dataLocId:267},desc:"所有综艺相关，全部一手掌握！",url:"//www.bilibili.com/video/ent-variety-1.html"},{name:"娱乐杂谈",route:"talker",tid:241,ps:15,rps:10,ad:{active:!0,dataLocId:269},desc:"娱乐人物解读、娱乐热点点评、娱乐行业分析"},{name:"粉丝创作",route:"fans",tid:242,ps:15,rps:10,desc:"粉丝向创作视频"},{name:"明星综合",route:"celebrity",tid:137,ps:15,rps:10,desc:"娱乐圈动态、明星资讯相关"}]},{name:"影视",route:"cinephile",tid:181,locid:2211,count:"",subMenuSize:84,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:2309,leftId:2307,rightId:2308},sub:[{name:"影视杂谈",route:"cinecism",tid:182,ps:15,rps:10,ad:{active:!0,dataLocId:2212},desc:"影视评论、解说、吐槽、科普等",url:"//www.bilibili.com/video/cinephile-cinecism.html"},{name:"影视剪辑",route:"montage",tid:183,ps:15,rps:10,ad:{active:!0,dataLocId:2213},desc:"对影视素材进行剪辑再创作的视频",url:"//www.bilibili.com/video/cinephile-montage.html"},{name:"短片",route:"shortfilm",tid:85,ps:15,rps:10,desc:"追求自我表达且具有特色的短片",url:"//www.bilibili.com/video/cinephile-shortfilm.html"},{name:"预告·资讯",route:"trailer_info",tid:184,ps:15,rps:10,ad:{active:!0,dataLocId:2214},desc:"影视类相关资讯，预告，花絮等视频",url:"//www.bilibili.com/video/cinephile-trailer-info.html"}]},{name:"纪录片",route:"documentary",tid:177,url:"//www.bilibili.com/documentary/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"人文·历史",tid:37,route:"history",dise:"",url:"//www.bilibili.com/video/doco-history.html"},{name:"科学·探索·自然",tid:178,route:"science",dise:"",url:"//www.bilibili.com/video/doco-science.html"},{name:"军事",tid:179,route:"military",dise:"",url:"//www.bilibili.com/video/doco-military.html"},{name:"社会·美食·旅行",tid:180,route:"travel",dise:"",url:"//www.bilibili.com/video/doco-travel.html"},{name:"纪录片索引",url:"//www.bilibili.com/documentary/index/"}]},{name:"电影",route:"movie",tid:23,url:"//www.bilibili.com/movie/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"华语电影",tid:147,route:"chinese",desc:"",url:"//www.bilibili.com/video/movie_chinese_1.html"},{name:"欧美电影",tid:145,route:"west",desc:"",url:"//www.bilibili.com/video/movie_west_1.html"},{name:"日本电影",tid:146,route:"japan",desc:"",url:"//www.bilibili.com/video/movie_japan_1.html"},{name:"其他国家",tid:83,route:"movie",desc:"",url:"//www.bilibili.com/video/movie-movie-1.html"},{name:"电影索引",url:"//www.bilibili.com/movie/index/"}]},{name:"电视剧",route:"tv",tid:11,url:"//www.bilibili.com/tv/",count:"",takeOvered:!0,hasParent:!0,combination:!0,sub:[{name:"国产剧",tid:185,route:"mainland",desc:"",url:"//www.bilibili.com/video/tv-mainland.html"},{name:"海外剧",tid:187,route:"overseas",desc:"",url:"//www.bilibili.com/video/tv-overseas.html"},{name:"电视剧索引",url:"//www.bilibili.com/tv/index/"}]},{name:"虚拟UP主",route:"virtual",locid:4735,count:"",isHide:!0,subMenuSize:60,slider:{width:620,height:220},viewTag:!1,customComponent:{name:"Energy",titleId:4754,leftId:4756},sub:[{name:"游戏",route:"game",tid:4,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/game"},{name:"音乐",route:"music",tid:3,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/music"},{name:"动画",route:"douga",tid:1,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/douga"},{name:"其他",route:"other",tid:0,ps:18,rps:10,url:"//www.bilibili.com/v/virtual/other"}]}]';

// src/io/api-view-detail.ts
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
function apiViewDetail(aid) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.VIEW_DETAIL, {
      aid
    })).then((d) => d.json()).then((d) => resolve(jsonCheck(d).data)).catch((e) => reject(e));
  });
}

// src/utils/utils.ts
function getUrlValue(name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null)
    return decodeURIComponent(r[2]);
  return null;
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
  getDate() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.json()).then((d) => resolve(d)).catch((e) => reject(e));
    });
  }
  toDetail() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.json()).then((d) => resolve(this.view2Detail(d))).catch((e) => reject(e));
    });
  }
  view2Detail(data) {
    const result = new ApiViewDetail();
    if (data.v2_app_api) {
      delete data.v2_app_api.redirect_url;
      result.data.Card.follower = data.v2_app_api.owner_ext?.fans;
      result.data.Card.card = { ...data.v2_app_api.owner, ...data.v2_app_api.owner_ext };
      result.data.Tags = data.v2_app_api.tag;
      result.data.View = data.v2_app_api;
      xhrHook(`api.bilibili.com/x/web-interface/view?aid=${this.aid}`, void 0, (res) => {
        const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify(result.data.View)}}`;
        res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
      }, false);
      xhrHook(`api.bilibili.com/x/web-interface/archive/stat?aid=${this.aid}`, void 0, (res) => {
        const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify({ ...result.data.View.stat, aid: this.aid })}}`;
        res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
      }, false);
      return JSON.parse(JSON.stringify(result));
    } else
      return this.view2Detail_v1(data);
  }
  view2Detail_v1(data) {
    const result = new ApiViewDetail();
    const p = Number(getUrlValue("p"));
    result.data.Card.card = {
      face: "//static.hdslb.com/images/akari.jpg",
      mid: data.mid,
      name: data.author,
      vip: {}
    };
    result.data.View = {
      aid: data.aid || data.id || this.aid,
      cid: data.list[p ? p - 1 : 0].cid,
      copyright: 1,
      ctime: data.created,
      dimension: { width: 1920, height: 1080, rotate: 0 },
      duration: -1,
      owner: result.data.Card.card,
      pages: data.list.map((d) => {
        d.dimension = { width: 1920, height: 1080, rotate: 0 };
        return d;
      }),
      pic: data.pic,
      pubdate: data.lastupdatets,
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
      tid: data.tid,
      title: data.title,
      tname: data.typename,
      videos: data.list.length
    };
    data.bangumi && (result.data.View.season = data.bangumi);
    xhrHook(`api.bilibili.com/x/web-interface/view?aid=${this.aid}`, void 0, (res) => {
      const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify(result.data.View)}}`;
      res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
    }, false);
    xhrHook(`api.bilibili.com/x/web-interface/archive/stat?aid=${this.aid}`, void 0, (res) => {
      const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify({ ...result.data.View.stat, aid: this.aid })}}`;
      res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
    }, false);
    return JSON.parse(JSON.stringify(result));
  }
};

// src/css/uplist.css
var uplist_default = ".up-info-m .up-card-box {\r\n    white-space: nowrap;\r\n    overflow: auto;\r\n}\r\n\r\n.up-info-m .up-card {\r\n    display: inline-block;\r\n    margin-top: 10px;\r\n}\r\n\r\n.up-info-m .avatar img {\r\n    cursor: pointer;\r\n    width: 40px;\r\n    height: 40px;\r\n    border-radius: 50%;\r\n}\r\n\r\n.up-info-m .avatar {\r\n    position: relative;\r\n}\r\n\r\n.up-info-m .avatar .info-tag {\r\n    position: absolute;\r\n    background: #fff;\r\n    border: 1px solid #fb7299;\r\n    border-radius: 2px;\r\n    display: inline-block;\r\n    font-size: 12px;\r\n    color: #fb7299;\r\n    padding: 0 3px;\r\n    top: -10px;\r\n    right: -10px;\r\n    white-space: nowrap;\r\n}\r\n\r\n.up-info-m .avatar {\r\n    width: 60px;\r\n    height: 30px;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-pack: center;\r\n    justify-content: center;\r\n    -ms-flex-align: start;\r\n    align-items: flex-start;\r\n}\r\n\r\n.up-info-m .avatar .name-text {\r\n    font-family: PingFangSC-Regular, sans-serif;\r\n    line-height: 30px;\r\n    color: #222;\r\n    word-break: break-all;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    display: -webkit-box;\r\n    -webkit-line-clamp: 2;\r\n    -webkit-box-orient: vertical;\r\n    white-space: nowrap;\r\n}\r\n\r\n.up-info-m .avatar .name-text.is-vip,\r\n.up-info-m .avatar .name-text:hover {\r\n    color: #fb7299;\r\n}\r\n\r\n.up-info-m .title {\r\n    display: block;\r\n    font-size: 14px;\r\n    margin-right: 80px;\r\n    color: #525659;\r\n    overflow: hidden;\r\n    height: 24px;\r\n    font-weight: 400;\r\n    padding: 8px 0;\r\n}\r\n\r\n.up-card-box::-webkit-scrollbar {\r\n    width: 7px;\r\n    height: 7px;\r\n}\r\n\r\n.up-card-box::-webkit-scrollbar-track {\r\n    border-radius: 4px;\r\n    background-color: #EEE;\r\n}\r\n\r\n.up-card-box::-webkit-scrollbar-thumb {\r\n    border-radius: 4px;\r\n    background-color: #999;\r\n}";

// src/html/bangumi.html
var bangumi_default = '<!-- <!DOCTYPE html> -->\r\n<html lang="zh-CN">\r\n\r\n<head>\r\n    <meta charset="utf-8" />\r\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\r\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\r\n    <meta name="keywords"\r\n        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />\r\n    <meta name="renderer" content="webkit" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\r\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\r\n        title="哔哩哔哩" />\r\n    <link rel="stylesheet"\r\n        href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" />\r\n    <style type="text/css">\r\n        .new-entry {\r\n            display: none;\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div class="z-top-container has-menu"></div>\r\n    <div id="app" data-server-rendered="true" class="main-container"></div>\r\n    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"><\/script>\r\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"><\/script>\r\n    <script>\r\n        window.__INITIAL_STATE__ = { activity: {}, app: false, area: 0, canReview: false, epId: -1, epInfo: {}, epList: [], epStat: { isPay: false, isVip: false, payPack: 0, status: 0, vipNeedPay: false }, isPlayerTrigger: false, loginInfo: { isLogin: false }, mdId: -1, mediaInfo: {}, mediaRating: {}, miniOn: 0, newestEp: {}, paster: {}, payMent: {}, payPack: {}, playerRecomList: [], pubInfo: {}, recomList: [], rightsInfo: {}, seasonFollowed: false, seasonList: [], seasonStat: { coins: 0, danmakus: 0, favorites: 0, views: 0 }, special: false, spending: 0, sponsorTotal: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } }, sponsorTotalCount: 0, sponsorWeek: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } }, ssId: -1, ssStat: { isPay: false, isVip: false, payPack: 0, status: 0, vipNeedPay: false }, upInfo: {}, userCoined: false, userLongReview: {}, userScore: 0, userShortReview: {}, userStat: { error: true, follow: 0, loaded: true, pay: 0, payPackPaid: 0, sponsor: 0, vipInfo: { due_date: 0, status: 0, type: 0 }, watchProgress: { lastEpId: -1, lastEpIndex: "", lastTime: 0 } }, ver: {} }; (function () { Reflect.deleteProperty(window, "webpackJsonp"); Reflect.deleteProperty(window, "_babelPolyfill"); var s; (s = document.currentScript || document.scripts[document.scripts.length - 1]).parentNode.removeChild(s); }());\r\n    <\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"\r\n        crossorigin=""><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"\r\n        crossorigin=""><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\/script>\r\n</body>\r\n\r\n</html>';

// src/io/api-tag-info.ts
function apiTagInfo(tag_name) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.TAG_INFO, { tag_name })).then((d) => d.json()).then((d) => resolve(jsonCheck(d).data)).catch((e) => reject(e));
  });
}

// src/io/api-tag-top.ts
function apiTagTop(tid) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.TAG_TOP, { tid })).then((d) => d.json()).then((d) => resolve(jsonCheck(d).data)).catch((e) => reject(e));
  });
}

// src/io/bangumi-season.ts
function apiBangumiSeason(data) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.BANGUMI_SEASON, data), { credentials: "include" }).then((d) => d.json()).then((d) => resolve(jsonCheck(d).result)).catch((e) => reject(e));
  });
}

// src/io/api-season-status.ts
function apiSeasonStatus(data) {
  return new Promise((resolve, reject) => {
    fetch(objUrl(URLS.SEASON_STATUS, data), { credentials: "include" }).then((d) => d.json()).then((d) => resolve(jsonCheck(d).result)).catch((e) => reject(e));
  });
}

// src/io/api-season-section.ts
var ApiSeasonSection = class {
  fetch;
  constructor(season_id) {
    this.fetch = fetch(objUrl(URLS.SEASON_STATUS, { season_id }), { credentials: "include" });
  }
  getDate() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.json()).then((d) => resolve(jsonCheck(d).result)).catch((e) => reject(e));
    });
  }
  toEpisodes() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.json()).then((d) => {
        const res = jsonCheck(d).result;
        resolve(
          res.main_section.episodes.concat(...res.section.map((d2) => d2.episodes)).map((d2) => {
            d2.ep_id = d2.id;
            d2.episode_status = d2.status;
            d2.index = d2.title;
            d2.index_title = d2.long_title;
            d2.premiere = Boolean(d2.is_premiere);
            return d2;
          })
        );
      }).catch((e) => reject(e));
    });
  }
};

// src/io/api-global-view.ts
var ApiGlobalOgvView = class extends ApiSign {
  fetch;
  constructor(data, server = "api.global.bilibili.com") {
    super(URLS.GLOBAL_OGV_VIEW.replace("api.global.bilibili.com", server), "7d089525d3611b1c");
    data = Object.assign({
      build: 108003,
      mobi_app: "bstar_a",
      s_locale: "zh_SG"
    }, data);
    this.fetch = fetch(this.sign(data));
  }
  getDate() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.json()).then((d) => resolve(jsonCheck(d).result)).catch((e) => reject(e));
    });
  }
};

// src/io/api-player.ts
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
  now_time = new Date().getTime() / 1e3;
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

// src/io/api-like.ts
async function apiLike(aid, bili_jct, like = false) {
  const response = await fetch(URLS.LIKE, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `aid=${aid}&like=${like ? 1 : 2}&csrf=${bili_jct}`,
    credentials: "include"
  });
  const json = await response.json();
  return jsonCheck(json);
}

// src/io/api-like-has.ts
async function apiLikeHas(aid) {
  const response = await fetch(objUrl(URLS.HAS_LIKE, { aid }), {
    credentials: "include"
  });
  const json = await response.json();
  return jsonCheck(json).data;
}

// src/core/ui/like.ts
var Like = class extends HTMLSpanElement {
  constructor(BLOD2) {
    super();
    this.BLOD = BLOD2;
    this.classList.add("ulike");
    this.update();
    this.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (uid) {
        apiLike(this.BLOD.aid, getCookies().bili_jct, !this.liked).then(() => {
          this.liked ? this.number-- : this.number++;
          this.toggle();
        }).catch((e) => {
          this.BLOD.toast.error("点赞出错！", e)();
        });
      } else {
        this.BLOD.biliQuickLogin();
      }
    });
  }
  liked = false;
  number = 0;
  init() {
    if (uid) {
      apiLikeHas(this.BLOD.aid).then((d) => {
        this.liked = d === 1 ? true : false;
        this.update();
      }).catch((e) => {
        debug.error("获取点赞情况失败", e);
      });
    }
    addCss(".ulike {cursor: pointer;}.ulike svg{vertical-align: middle;margin-right: 10px;transform: translateY(-1px);}", `ulike${"aa44074"}`);
  }
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
customElements.get(`like-${"aa44074"}`) || customElements.define(`like-${"aa44074"}`, Like, { extends: "span" });

// src/page/bangumi.ts
var PageBangumi = class extends Page {
  constructor(BLOD2) {
    super(bangumi_default);
    this.BLOD = BLOD2;
    Reflect.deleteProperty(window, "__INITIAL_STATE__");
    this.like = new Like(this.BLOD);
    new Comment(BLOD2);
    window.__Iris__ = true;
    this.pgc = true;
    location.href.replace(/[sS][sS]\d+/, (d) => this.ssid = Number(d.substring(2)));
    location.href.replace(/[eE][pP]\d+/, (d) => this.epid = Number(d.substring(2)));
    this.updateDom();
    this.recommend();
    this.seasonCount();
    BLOD2.status.videoLimit?.status && this.videoLimit();
    this.related();
    this.initialState();
    this.enLike();
    Header.primaryMenu();
    Header.banner();
  }
  like;
  get ssid() {
    return this.BLOD.ssid;
  }
  set ssid(v) {
    this.BLOD.ssid = v;
  }
  get epid() {
    return this.BLOD.epid;
  }
  set epid(v) {
    this.BLOD.epid = v;
  }
  get th() {
    return this.BLOD.th;
  }
  set th(v) {
    this.BLOD.th = v;
  }
  get limit() {
    return this.BLOD.limit;
  }
  set limit(v) {
    this.BLOD.limit = v;
  }
  get pgc() {
    return this.BLOD.pgc;
  }
  set pgc(v) {
    this.BLOD.pgc = v;
  }
  subtitles = [];
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
        this.BLOD.status.videoLimit.status || (t.area = this.limit);
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
        if (this.BLOD.status.bangumiEplist)
          delete i.bkg_cover;
        this.BLOD.status.videoLimit.status && bangumi.rights && (bangumi.rights.watch_platform = 0);
        t.mediaInfo = i;
        t.mediaInfo.bkg_cover && (t.special = true, this.BLOD.bkg_cover = t.mediaInfo.bkg_cover);
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
        if (t.upInfo.mid == 677043260 || t.upInfo.mid == 688418886) {
          this.th = true;
        }
        const title = this.setTitle(t.epInfo.index, t.mediaInfo.title, this.Q(t.mediaInfo.season_type), true);
        loopTitle2();
        this.BLOD.videoInfo.bangumiSeason(bangumi);
      } else {
        return this.initGlobal();
      }
    }).catch((e) => {
      this.BLOD.toast.error("初始化bangumi数据出错！", e)();
    }).finally(() => {
      if (window.__INITIAL_STATE__.special) {
        addCss("#bili-header-m > #banner_link,#bili-header-m > .bili-wrapper{ display: none; }");
      }
      if (document.compatMode === "BackCompat")
        addCss(".header-info > .count-wrapper {height: 18px !important;}");
    });
  }
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
  async initGlobal() {
    const data = this.epid ? { ep_id: this.epid } : { season_id: this.ssid };
    Object.assign(data, { access_key: this.BLOD.status.accessKey.token });
    const d = await new ApiGlobalOgvView(data, this.BLOD.status.videoLimit.th).getDate();
    this.BLOD.networkMock();
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
    t.mediaInfo.bkg_cover && (t.special = true, this.BLOD.bkg_cover = t.mediaInfo.bkg_cover);
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
      const t_1 = `{"code": 0,"message":"0","ttl":1,"result":${JSON.stringify(d.stat)}}`;
      res.responseType === "json" ? res.response = JSON.parse(t_1) : res.response = res.responseText = t_1;
    }, false);
    this.player();
    this.BLOD.toast.warning("这大概是一个泰区专属Bangumi，可能没有弹幕和评论区，可以使用【在线弹幕】【播放本地文件】等功能载入弹幕~", "另外：播放泰区番剧还可能导致历史记录错乱，请多担待🤣");
    const title = this.setTitle(t.epInfo.index, t.mediaInfo.title, this.Q(t.mediaInfo.season_type), true);
    function loopTitle() {
      poll(() => document.title != title, () => {
        document.title = title;
        if (document.title != title)
          loopTitle();
      });
    }
    loopTitle();
    this.BLOD.videoInfo.bangumiEpisode(episodes, i.title, i.actor?.info, i.cover, t.mediaInfo.bkg_cover);
  }
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
  enLike() {
    if (this.BLOD.status.like) {
      poll(() => document.querySelector("[report-id*=coin]"), (d) => {
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
};

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
      desc: "bilibili moe 2018 动画角色人气大赏日本动画场宣传PV / BGM : No.1 / Editor : @暗猫の祝福  \n\n活动地址 https://www.bilibili.com/moe/2018/jp/home\n\n了解活动最新动态请关注@哔哩哔哩萌战基",
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
      desc: "因为是突然心血来潮的作品，所以也没有特意去找无字幕的片源，直接用了带字幕的。所以中间有一段我添加了部分马赛克。\n之前已经做过一次关于（Fate/Stay night 宛若天堂）这一条樱线的视频了，但是上一次毕竟是战斗画面为主，所以这一次我决定给樱做一期她为主角的剪辑视频，希望大家可以喜欢。\nBGM：River Flows in You",
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
      desc: "尼禄殿下好可爱啊，用了前十集的素材。一共30多个唔嗯，有些不能用，用了好长时间剪素材\n动漫：Fate/EXTRA Last Encore，其实我觉得这番挺好看的，内容也是有点，可能还是和UBW有点差距吧\nBGM：Unity",
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
      desc: "米娜桑，大家好！这次趁着B萌赶紧做一波应援视频，希望大家喜欢！btw考虑一下投凛哟~\n使用素材: Fate/Grand Order, Fate/Stay Night UBW, Fate/Zero, Fate,/Stay Night HF, Fate/Hollow Ataraxia\n视频类型: AMV/MAD\nBGM【音乐名】: Illuminate\nBGM【音乐人】: Minami",
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
      desc: "救救孩子！！请给咔酱投上一票！！！\n【别问我为什么要用这样的应援我已经彻底放弃剪燃向了_(:з」∠)_】【无cp】\nBGM:\nだってまだまだアバンタイトル—觉得爆豪同学特别可爱的轰君和切岛君x【梶裕贵/增田俊树】",
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
      desc: "封面源自网络\r\n前方高渣....\r\n使用素材: 我的英雄学院\r\nBGM【音乐名】: Look At Me Now",
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
      desc: "模型：ザビ男：なかむら\n场景：im8225803：SNowly\n动作：sm25937215：ゆり\n镜头：一騎当千(1人用)：うぐいす\nBGM：一騎当千（Luz）\nMME：AutoLuminous4、Diffusion7：そぼろ",
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
      desc: "BGM：skillet--hero\n喜欢的话点个转发，加个关注都是对我最大的支持～",
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
      desc: "某不知名萌新up，第一次做mad/amv。做的不好请多指教\nBGM：THERE IS REASON。\n因为我的天谴之力，一共做了4次，第一次没保存重做，第二次出了致命问题重做，第三次电脑死机重做，第四次电脑卡死只保存了一半......但是游戏人生是我top1，剧场版看哭了40分钟，所以还是坚持做完了·-·\n播放量要是没超1w，可能我以后就不会做这种视频了,除非游戏人生出第二季→.→...\n求关注求硬币求推荐求收藏求打赏求转发(๑ • . • ๑)",
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
      desc: "歌曲：魔法少女小圆OPコネクト -歌手：ClariS（网易云有）\n剪辑软件：PR\n没找到生肉，也没找到歌词字幕，，好气啊。。。。\n总之，2018萌战请多多支持小樱，拜托了！！！",
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
      desc: "《闪耀之海》\n演唱：染音若蔡\n作词：冰梓yuri\n作曲：甄小熊\nPV：EinsElric\n封面画师：汐洛琪SHIROKI\n\nST声迹配音组《宝石之国》中文配音原创歌。助力宝石之国B萌大人气角色，取得好成绩！\n网易云：https://music.163.com/#/album?id=71806628\n5sing：http://5sing.kugou.com/yc/3652162.html\n\n微博：@瑷珥-染音若蔡",
      dimension: {
        height: 720,
        rotate: 0,
        width: 1280
      },
      duration: 133,
      dynamic: "B萌记得给宝石们投票哦~！支持请多多点赞收藏~！爱你们~！\nps:配合PV看会感觉到了不一样的东西！\n《闪耀之海》\n演唱：@瑷珥-染音若蔡\n作词：@冰梓yuri\n作曲：甄小熊\nPV：@EinsElric\n封面画师：@汐洛琪SHIROKI\n#宝石之国##染音若蔡##磷叶石##原创歌#",
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
      desc: "智乃应援视频第二弹终于肝出来了！！由于是两天肝出来的，有一半的镜头有重复，但看点完全是两个看点！希望大家多多支持智乃！！！emmm也希望智乃能比伊莉雅的票高!!\nbgm：光吉猛修 - 天国と地獄",
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
      desc: "新人渣作，素材和音乐等方面有很大不足，请大家多多见谅，欢迎大家的批评指教。\n封面ID64099009",
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
      desc: "主要内容为纳萨力克大坟墓目前登场的领域守护者\nBGM：鏡音レン,mothy - 悪ノ召使\n欢迎加入UP的粉丝群：237213911",
      dimension: {
        height: 720,
        rotate: 0,
        width: 1280
      },
      duration: 299,
      dynamic: "#不死者之王##骨傲天##Overlord##新星计划#\n主要内容为纳萨力克大坟墓目前登场的领域守护者\nBGM：鏡音レン,mothy - 悪ノ召使\n欢迎加入UP的粉丝群：237213911",
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
      desc: "·自制，2018b萌日本场贞德应援作品\n·草稿风，渣上色，轻喷……\n·BGM：自伤无色\n·无cp向，请勿ky，一起愉快的食用\n·求硬币，收藏，关注(　´・◡・｀)",
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
          part: "【木之本樱B萌应援】燃向踩点混剪，小樱今天就告诉你什么是魔法少女\\(✨∇✨)\\",
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
      desc: "各位好我是冥香。这个不出意外可能是天草在参加本届B萌期间我会做的最后一个应援视频。\r\n这次改成适用持刀的动作费了好长时间……如果觉得效果好，也不用给我投币，请给天草投票xxxxxxxxxxx\r\n\r\n总而言之本周六天草对小太阳的32进16，希望大家支持天草！虽然我也很喜欢小太阳但内战就是这样了！！",
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
      desc: "这次做了好长时间哦。\r\n素材：魔法少女伊莉雅雪下的誓言，Fate/Stay Night06版，Fate/Stay Night UBW版，Fate/Stay Night HF版\r\n音乐：Flower Dance",
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
      desc: "模型：衛宮士郎：ごまもりは流れゆく／遠坂凛、間桐桜、ぐだお：珠華（しゅか）／セイバー：ribbondog／ネロ・クラウディウス：あかね／玉藻の前、ザビ男：なかむら／ザビ子：1010浣／エミヤ、クーフーリン：ちょビ玉／ギルガメッシュ：ひどく泰平化されたオティー\n场景：月面ステージ、月面低軌道ステージ：Tansoku102cm-短足沼地人\n动作/镜头：Thriller：DJRocket\nBGM：Thriller（Michael Jackson）\nMME：Diffusion7：そぼろ",
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
      desc: "视频类型: 其他\n相关题材: OVERLORD；报菜名\n简介: 老骨头：我的那萨里克原来还有说相声的女仆！？\n贯口：相声中常见的表现形式，\n贯是一气呵成，一贯到底的意思。",
      dimension: {
        height: 1080,
        rotate: 0,
        width: 1920
      },
      duration: 147,
      dynamic: "视频类型: 其他\n相关题材: OVERLORD；报菜名\n简介: 老骨头：我的那萨里克原来还有说相声的女仆！？\n贯口：相声中常见的表现形式，\n贯是一气呵成，一贯到底的意思。",
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
      desc: "大家如果观后感觉不错，有劳点个推荐赞一下吧，小透明up主在B站生存艰难，没有推荐就没有播放量，拜托各位了，十分感谢！\n新作指路 ——→ 鬼灯不同造型帅气瞬间，av30505048 ：【踩点高燃】鬼灯：无所不能，瞬间切换！白泽：笑瘫！鬼灯百变造型帅气瞬间剪辑，求推荐哇！\n在av28147879里，白泽被鬼灯一顿狂扁，弹幕和评论中不少老中医粉纷纷表达心疼。为了活命，up主做了新的剪辑。\n这次，换白泽来折腾鬼灯！虐啊——！从头到尾，鬼灯被安排得明明白白。题目为《欲胜鬼灯，惟可用情》。“胜”改为“虐”后，情，就是",
      dimension: {
        height: 720,
        rotate: 0,
        width: 1280
      },
      duration: 229,
      dynamic: "本视频主题：鬼灯可爱~（误......）\n身为一只上亿岁的老神兽，白泽反虐的方式，自然与鬼灯不同。\n鬼灯战力爆表，名贯三界，遇事属他拎得清，总能找到最适宜有效的解决方法。虽然行事和表情令人生怖，但威严下亦有对他人尊重、体恤与守护的心意。\n这样的人物，却反常且别扭地，总和非奸非恶的白泽过不去。\n可能鬼灯自己也没有发觉内心真实的情感吧。\n难以察觉的情感，即本视频主题。\n#鬼灯的冷彻# #白泽# #鬼灯# #Bilibili Moe# #日本场应援2018# #剪辑#",
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
      desc: "字幕来源／应援文：半翅雀@半翅雀\n票根来源：UP主自己\n让我们迎接各位刀回家，他们在我们心里是最棒的\n欢迎各位婶婶加入刀剑乱舞B萌应援群\n群号：773458796",
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
      desc: "番名：《DARLING in the FRANXX》\nBGM:日剧产科医生鸿鸟的主题曲《あなたがここにいて抱きしめることができるなら》    from  miwa\n第二发了，做完就感觉比上次工作量大了很多，很幸运歌不算很难，对我这个萌新比较友好\n喜欢我的视频别忘了点赞，投币，收藏，关注，分享给你的朋友。b萌02加油！02赛高！让这个世界给这个女孩一丝温暖吧！\n敏娜桑！！！多谢了！！！    \n最后祝02在b萌取得好成绩",
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
      desc: "第一次做amv也是费了一番心血\n从文案 剪辑 后期\n一共花了大概一个星期吧\n其中偷懒过 爆肝过\n苦想过 也欣喜过\n用自己微弱的力量给薇尔莉特应援\n薇尔莉特 冲鸭！！！！！！！！！！！！！",
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
      desc: "不要收藏，不要硬币，要脸。\r\n啊……太菜了……剪了半天弄了个什么出来……留个黑历史在这儿以后拿来嘲笑一下自己。",
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
      desc: "8月6日，与人梭哈莓反杀，惜败\r\n素材：DARLING in the FRANXX\r\nBGM：Take me hand  - DAISHI DANCE",
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
      desc: "做了16天的视频，可是食戟全员已回家，但128强仍然值得骄傲。\n素材：食戟之灵\nBGM：Black Rail\n参考了一个黑契的视频：av3219374，是一个良作",
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
      desc: "BGM:ONE OK ROCK -The beginning\n素材：fate  进击的巨人 一击男  小英雄 \n上一次做的很多小伙伴说不够好,BGM不搭什么的，这次就重新做了一遍，希望大家会喜欢",
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
      desc: "爆豪胜己，粗中有细\n话不多说，西内为敬\n西内！",
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
      desc: "fate全员应援，外加失踪人口回归（｡ò ∀ ó｡）\nBGM：Shot In The Dark",
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
      desc: "第一次做mad，做的不怎么好，多多包涵。\r\n素材：魔法少女伊莉雅剧场版：雪下的誓言\r\nBGM：ひび割れた世界\r\n封面：https://www.pixiv.net/member_illust.php?mode=medium&illust_id=65608478",
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
      desc: "第一次做AMV，估计观感欠佳_(:з」∠)_\r\n算是b萌朱碧和利库的应援视频吧ww\r\n素材：NGNL0（No Game No Life Zero)\r\n           鈴木このみ - There is a reason",
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
      desc: "新人初投稿 请多指教\n五战骑主从真好\n\nBGM：浅川悠-《瞬时の涡》（Fate/Stay Night Rider 角色歌）\n素材来源：《Fate/Stay Night[Unlimited Blade Works]》、《Fate/Stay Night[Heaven's Feel I.presage flower]》",
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
      desc: "迦勒底加班人员的b萌应援。\n嘛，对上了大狗感觉有点恐怖,也许是在做最后的挣扎也说不定呢。。。。.。\n说起来这是我第一次正经地尝试2d向渲染，我吹爆akon太太的模型wwwww~\nBGM是れをる桑的no title，降了三个半调（降调狂魔就是我了）。\n韦伯子裙子的物理出了点问题咋改也改不好我也很烦恼，稍微忍耐下吧，别刷暂停成功什么的，小心复明失败23333。\n借物表见评论，如果没看见就是你来的太早啦我还没起床。\n另外为了应援9号当天我会发一个小彩蛋，能记住的可以来我的动态看下哦~",
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
      desc: "Bilibili Moe,弗兰肯斯坦应援向MMD\nBGM:from Y to Y\nModel:做成参谋\nCamera+Action:Hiramori Amu",
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
      desc: "BGM:田中井彩智——黄金の辉き\n=\n说到做到。上星期看到B站上架了06版的fate，打鸡血剪辑的……剪到后面遇到不少困难有点摸鱼了，甚至忘了自己最初想通过视频表达什么了，有些粗制滥造，真是对不起（飞歌语气）。\n可能赶不上士郎今天的应援了，但是我喜欢士郎的热情还是不变的（笑），也请大家多多支持士郎咯。",
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
      desc: "bgm：Old Memory\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n希望有一个小埋那样的妹妹",
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
      desc: "第一次剪辑这种视频\n所以暂且把开头放出来当预告\n不知道大家感觉怎么样\n评论区说一下，我在正片里改改\n争取赶在十号之前给小樱应援L('ω')┘三└('ω')｣\n\n视频素材：魔卡少女樱clear篇\n音乐素材：认真卖萌么么哒--洛天依（作曲：周存JUSF）",
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
      desc: "做MAD之前：这首歌好适合士樱啊，做个MAD试试吧\n为了做MAD去看了HF线生肉后：呜呜呜呜，老虫子你还我樱！qaq\n【BGM：THERE IS A REASON】\n顺便求个关注收藏推荐硬币，你们的支持是我最大的动力！",
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
      desc: "关于胜出上学路上的小故事\n尝试做了手书，差点累死我这个手残\n果然还是回去好好学画画吧",
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
      desc: "末尾有信长三连！\n没纯踩点所以不敢用87k！\n没错我就是那个欠债的后期！\n\nbgm：handclap",
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
      desc: "■ 调教 · 混音 · 字幕：梦落遗廊P\n■ 曲：じん\n■ 編曲：Nhato\n■ 映像：しづ\n \n● 本家 → sm21720819\n● 时隔5个月的稿，鸽了这么久请诸位别把我抓去炖汤……\n● 调教了这首带感曲子来应援阳炎，海选赛只有Konoha通过了，球球你们本战投稿这位小天使一票，让他好歹撑到决赛(´；ω；`)\n● 在niconico也有投稿 → sm33640672 \n● 之前用 IA 翻调的车祸曲 → av20887402",
      dimension: {
        height: 720,
        rotate: 0,
        width: 1280
      },
      duration: 217,
      dynamic: "#じん##VOCALOID##阳炎计划#个\n翻调了界外科学，快来听一听ww",
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
      desc: "不希望别人看这个视频啦\n所以呢就悄悄地换了源！\n不删掉视频的原因是会扣硬币w\n\n原简介：\n万恶之源：av17699810\n参考，音频：av20536168",
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
      desc: "模型：アストルフォ：すがきれもん\n场景：im8225803：SNowly\n动作/镜头：av25782915：浪潮小汐\n表情：av25782915：閃爍P\nBGM：恋して♥ポプテピピック（牧野由依、渡部优衣）\nMME：AutoLuminous4、Diffusion7：そぼろ",
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
      desc: "话说对导演下手的“家伙”还是挺多的嘛，如：\n库洛牌：消牌、冰牌、迷牌、声牌、地牌、无牌等\n人物：柊泽艾力欧、女占卜师等\n透明牌-包围、冰雹、幻影等\n（还有个破坏知世房子的摇动没加进去）",
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
      desc: "一个短小的绿谷小天使应援视频...........\n莺莺燕燕嘤嘤\n新人UP求关注",
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
      desc: "迦尔纳应援视频，各位一定要去为迦尔纳投票啊，他现在的处境很不好。\n不要三连，只要你们投票。\n十分感谢。",
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
      desc: "这是在下第一次投稿希望不会出什么问题......也许吧。\n如果问题太多我就重做一次吧。",
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
      desc: "视频类型: 动画\r\n动漫中那些毁天灭地的炫酷大招",
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
      desc: "模型：天草四郎時貞：sema／カルナ：ユタカ／シェイクスピア：履物連絡用（準備中）\n背景：sm15356644：kiyo_NoN\n动作/镜头：sm24491916：にもゆに\nBGM：EVERYBODY（Backstreet Boys）\nMME：Diffusion7：そぼろ",
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
      desc: "喜欢就点个赞吧 谢谢大家！\nbgm: 菅田将晖《ロングホープ・フィリア》",
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
      desc: "第一次尝试着做视频，对pr还不是很了解，\n但对于金木。（尽力了）\n做视频不敢有任何懈怠，大家好，新人up猪\n我来啦,希望各位大佬wu喷\nBGM：Angel    saybia\n           透明で透き通って何でも成れそうで    haku",
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
      desc: "模型：ロビン・フッド：切な顔P\n场景：im4179284：切な顔P\n动作：sm29180863：yurie\n镜头：sm29298856：一護牛乳\nBGM：av5451565：云潇翼Seanwing\nMME：Diffusion7：そぼろ",
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
      desc: "BGM：Désir——《fate/apocrypha》ED1\n新人up摸鱼出来的第二个视频\n前面一段偷懒了还望谅解（还有一小段用过两次\n喜欢的话就请关注投币推荐收藏一条龙吧=v=",
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
      desc: "首先，感谢网易云用户：saberycr他在网易云投稿的游戏人生mad非常棒！给了我很大的灵感，大家可以去看看。\n新人渣作，喜欢的话就点个赞也是好的，谢谢！",
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
      desc: "大家好我死回来啦.........!\n学会了录屏和一点点简单的剪辑超开心!!!\n炫耀一下vqv。\n大家今天一定要给茶茶投票鸭!!!!!!!!!!!!!\n\nbgm:\n無邪気な冒険心——Goose house\n3/4——Goose house\n18歲——Goose house",
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
      desc: "休息了2周 再次回来做视频了\nBGM:一刀缭乱-六花\n希望大家喜欢 也希望fate在萌战里获得好成绩 也希望大家鬼岛活动加油！",
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
      desc: "应援视频。\n对不起来晚了，如果这样就能让故事停留在P1就好了。\n（虽然我觉得P2很好）\n希望休比和助手都能拿个好名次~",
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
      desc: "模型：エミヤ：ちょビ玉\n场景：im8147346：鯖缶359\n动作：sm24923974：遊風稜\n口型：sm32918418：しわこ\n镜头：sm26631976：足屋ｺｰﾋｰ\nMME：Diffusion7：そぼろ\nBGM：Beat It（Michael Jackson）",
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
      desc: "第三期预告（水视频）\n我怀疑我们能不能继续了（失望）赞好少，感觉大家不是很喜欢我这个系列\n真的如果收藏没有达到200我们打算做其他简单的了",
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
      desc: "因为第一次传失误了所以删除了...对此感到抱歉...\n明天的帮派火拼请各位务必投zero two一票\nBGM：い〜やい〜やい〜や（算了~算了~算了~）",
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
      desc: "bgm:彼女は旅に出る\n我的英雄学院实在是，太太太太太太太太好看了！！！！吹爆我英！！！真的具TM好看，我永远爱着绿谷小天使/咔酱/轰总/茶爷/欧叔/渡我/...(省略)，真的，我英真的很棒，b萌轰总下一场和小天使对，自己人打自己人，咔酱对闪闪，简直死亡分组）\nqaq手书里的绿毛是up我了，刚开始因为画风，然后一直没看，我朋友安利过我很多次了，后面是没东西看了，然后去看我英，然后 出不来了！！\n此生无悔入我英，祝小伙伴们食用愉快【比心】",
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
      desc: "ooc警告！！！！！！！！！！\n开头声音不知道为什么爆炸了，小心啊（虽然我觉得没人看简介）\n本家手书：sm7598520\n是半成品（但是不会画完，因为懒）\n作品是闪恩向向，伊斯塔凛厨慎入",
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
      desc: "原图作者：@micsu3_3   \n一时兴起录的勾线视频 \n因为我就是被这张图拉入闪恩 就当给闪闪应援了\nBGM发在弹幕里   \n作者大大只在图里做了签名 但是微博p站都找不到了\n有人知道求发我一下",
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
      desc: "素材 DARLING in the FRANXX\nBGM lie 三无MarBlue\n02应援 希望大家多多支持02",
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
      desc: "为02和广主席疯狂打call！\n封面pixiv画师：星晓吻",
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
      desc: "借物表：\nmodel:Kei\nmotion:srs\ncamera:aokana\nstage:hazi，溯北，怪獣対若大将P，kotami，RedialC\nmme:角砂糖，下っ腹P，XDOF，Diffusion7，SSAO\nmusic:無情",
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
      desc: "主要内容为管家助理艾克雷亚·艾克雷尔·艾伊克雷亚\nBGM：ほぼ日P - 家に帰ると妻が必ず死んだふりをしています\n欢迎加入UP的粉丝群：237213911",
      dimension: {
        height: 720,
        rotate: 0,
        width: 1280
      },
      duration: 163,
      dynamic: "#不死者之王##骨傲天##Overlord##新星计划#\n主要内容为管家助理艾克雷亚·艾克雷尔·艾伊克雷亚\nBGM：ほぼ日P - 家に帰ると妻が必ず死んだふりをしています\n欢迎加入UP的粉丝群：237213911",
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
      desc: "又一个积压了一个多月的视频，花了两天时间憋出来。\n（才刚用pr的新人啥也不会）\n很遗憾爱酱的B萌已经落幕了\n但他的留下反叛精神与钢铁的意志永远不会消失\n献给伟大的起义领袖，斯巴达克斯\n（中间部分已3倍速快进，需要也可跳至25:35继续食用）",
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
      desc: "bgm:lemon\n稍微小改了一下,虽然感觉还有点问题,但之后也没有大改的打算了",
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
      desc: "高三那年看了游戏人生zero，过了很久才释然...\n“我其实不想给任何人的...喜欢里克的心情，不想和他分开的心情，毕竟很害羞啊！从里克那得到的多到数不清的系统错误，这些都是只属于休比自己的东西，现在要把这些交给你们，这意味着什么？你们给我明白啊！笨蛋！别在那啰里啰唆！给我把这份思念继承下去啊！\n给我把应援票投给休比啊！w\n给我把关注和硬币投up主啊！（误）“\n休比，祝你终有一天能与自己重要的人重逢.\n\n封面截自BD  0：55：56\nbgm：befall（崩三女王降临印象曲）",
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
      desc: "第一次剪视频，完全用爱发电爆肝赶在凛凛本战的时候做完，做得不好的地方还请大家包容啦。\n他们俩真好嘤嘤嘤，凛凛、哈鲁冲鸭！\n事先声明，里面混有玻璃渣，但结局绝对是甜的！绝对！！",
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
      desc: "永不放弃努力前行 是想抓住梦想的翅膀\n时至今日 想要传达的心愿无法按捺 在心中迸发\n动摇的心或有迷茫 即使如此也要向前\n相信会有风停雨散\n向着明天前行  得以遇见Sunshine!\n昂首便是万里晴空",
      dimension: {
        height: 1080,
        rotate: 0,
        width: 1920
      },
      duration: 282,
      dynamic: "#日本场应援2018##MAD.AMV##MAD##Aqours##lovelive#\n永不放弃努力前行 是想抓住梦想的翅膀\n时至今日 想要传达的心愿无法按捺 在心中迸发\n动摇的心或有迷茫 即使如此也要向前\n相信会有风停雨散\n向着明天前行  得以遇见Sunshine!\n昂首便是万里晴空",
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
      desc: "尝试去讲一个机器人少女拥有心的故事，于是选用了镜音的这首歌曲，同时和花たん的翻唱结合做音频处理，试图从休比的个体视角，而不是故事的全局视角，去表现少女从“无心”到拥有“心”的升华过程。\n\n素材：no game no life 0（游戏人生剧场版）\nBGM：ココロ（镜音+花たん,UP主剪辑版）",
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
      desc: '青叶可真是个罪孽深重的女人，没有青叶看我要死了("▔□▔)/\n请大家为青叶投上宝贵的一票！！\nbgm：恋爱循环香菜版',
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
      desc: "自制，借物表见视频内\n摸鱼，这次算填完一个坑，于是顺便把它当做了应援视频，虽然感觉发的时间有点微妙\n很喜欢这首歌的动作数据，感觉和波特莫名契合，很可爱",
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
      desc: "=-=想哭了，感觉莫名对不到节奏\n但总之是吧之前的遗憾略微弥补了一下（真的是略微）哭\n因为里克违背了誓约，所以他注定要失去一切（哭）\nMAD很一般，不知道是做的烂还是审美疲劳了（我觉得是做的烂）\n请审核大佬放过~呜呜呜",
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
      desc: "原作：《孤独的巡礼/孤独な巡礼》\n出自作品：Fate/Stay Night\n作者：川井宪次\n演奏乐器：钢琴/小提琴\nSTAFF：钢琴/小提琴/COS/后期：Kino\n终于翻了自己从刚入fate坑就特别喜欢的这首歌~！\n一人全役了整首歌，有许多不足，还请各位dalao们指正~\n一人制作辛苦，如果喜欢希望能给点个赞啦~比心(๑•̀ㅁ•́ฅ)\n（原声乐器的录音好蓝瘦QWQ）\n这次试了远坂凛在Fate/Grand Order中的概念礼装元素转换的COS，凛酱赛高！我永远喜欢远坂凛.JPG \n（虽然这是Saber的",
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

// src/page/av.ts
var PageAV = class extends Page {
  constructor(BLOD2) {
    super(av_default);
    this.BLOD = BLOD2;
    location.href.replace(/av\d+/i, (d) => this.aid = d.slice(2));
    new Comment(BLOD2);
    this.like = new Like(this.BLOD);
    propertyHook(window, "__INITIAL_STATE__", void 0);
    location.href.includes("/s/video") && this.BLOD.urlCleaner.updateLocation(location.href.replace("s/video", "video"));
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
    switchVideo(this.switchVideo);
  }
  destroy = false;
  like;
  get aid() {
    return this.BLOD.aid;
  }
  set aid(v) {
    this.BLOD.aid = v;
  }
  switchVideo = () => {
    window.aid = this.BLOD.aid = window.aid;
    window.cid = this.BLOD.cid = window.cid;
  };
  favCode() {
    webpackHook(717, 251, (code) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
  }
  tagTopic() {
    webpackHook(717, 660, (code) => code.replace('tag/"+t.info.tag_id+"/?pagetype=videopage', 'topic/"+t.info.tag_id+"/?pagetype=videopage'));
  }
  menuConfig() {
    webpackHook(717, 100, (code) => code.replace(/MenuConfig[\S\s]+?LiveMenuConfig/, `MenuConfig=${sort_default},e.LiveMenuConfig`));
  }
  ancientHeader() {
    webpackHook(717, 609, () => `()=>{}`);
  }
  hyperLink() {
    webpackHook(717, 2, (code) => code.replace("av$1</a>')", `av$1</a>').replace(/(?!<a[^>]*>)cv([0-9]+)(?![^<]*<\\/a>)/ig, '<a href="//www.bilibili.com/read/cv$1/" target="_blank" data-view="$1">cv$1</a>').replace(/(?!<a[^>]*>)(bv1)(\\w{9})(?![^<]*<\\/a>)/ig, '<a href="//www.bilibili.com/video/bv1$2/" target="_blank">$1$2</a>')`).replace("http://acg.tv/sm", "https://www.nicovideo.jp/watch/sm"));
  }
  embedPlayer() {
    webpackHook(717, 286, (code) => code.replace('e("setVideoData",t)', `e("setVideoData",t);$("#bofqi").attr("id","__bofqi").html('<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>');new Function('EmbedPlayer',t.embedPlayer)(window.EmbedPlayer);`));
  }
  elecShow() {
    if (this.BLOD.status.elecShow) {
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
  aidLostCheck() {
    jsonpHook("api.bilibili.com/x/web-interface/view/detail", void 0, (res, r, call) => {
      if (0 !== res.code) {
        const obj = urlObj(r);
        if (obj.aid) {
          this.aid = obj.aid;
          this.getVideoInfo(call);
          return true;
        }
      } else {
        if (res.data && res.data.View) {
          Promise.resolve().then(() => {
            this.BLOD.status.staff && res.data.View.staff && this.staff(res.data.View.staff);
          });
          if (this.BLOD.status.ugcSection && res.data.View.ugc_season) {
            this.ugcSection(res.data.View.ugc_season, res.data.View.owner);
          }
          this.BLOD.videoInfo.aidDatail(res.data.View);
        }
      }
    }, false);
  }
  async getVideoInfo(callback) {
    try {
      const data = [`av${this.aid}可能无效，尝试其他接口~`];
      const toast = this.BLOD.toast.toast(0, "info", ...data);
      apiArticleCards({ av: this.aid }).then((d) => {
        if (d[`av${this.aid}`]) {
          if (d[`av${this.aid}`].redirect_url) {
            data.push(`bangumi重定向：${d[`av${this.aid}`].redirect_url}`);
            toast.data = data;
            toast.type = "warning";
            callback(new ApiViewDetail());
            this.BLOD.urlCleaner.updateLocation(d[`av${this.aid}`].redirect_url);
            new PageBangumi(this.BLOD);
            this.destroy = true;
            return;
          }
        }
        new apiBiliplusView(this.aid).toDetail().then((d2) => {
          if (d2?.data.View.season) {
            data.push(`bangumi重定向：${d2.data.View.season.ogv_play_url}`);
            toast.data = data;
            toast.type = "warning";
            d2.data.View.season = void 0;
            callback(new ApiViewDetail());
            this.BLOD.urlCleaner.updateLocation(d2.data.View.season.ogv_play_url);
            new PageBangumi(this.BLOD);
            this.destroy = true;
            return;
          }
          callback(d2);
          this.BLOD.videoInfo.aidDatail(d2.data.View);
          data.push("获取缓存数据成功！");
          toast.data = data;
          toast.type = "success";
        });
      }).catch((e) => {
        debug.error("获取数据出错！", e);
        data.push("获取数据出错！", e);
        toast.data = data;
        toast.type = "error";
      }).finally(() => {
        toast.delay = 4;
      });
    } catch (e) {
      debug.error(e);
    }
  }
  staff(staff) {
    poll(() => document.querySelector("#v_upinfo"), (node) => {
      let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
      fl = staff.reduce((s, d) => {
        s = s + `<div class="up-card">
                    <a href="//space.bilibili.com/${d.mid}" data-usercard-mid="${d.mid}" target="_blank" class="avatar">
                    <img src="${d.face}@48w_48h.webp" /><!---->
                    <span class="info-tag">${d.title}</span><!----></a>
                    <div class="avatar">
                    <a href="//space.bilibili.com/${d.mid}" data-usercard-mid="${d.mid}" target="_blank" class="${d.vip && d.vip.status ? "name-text is-vip" : "name-text"}">${d.name}</a>
                    </div></div>`;
        return s;
      }, fl) + `</div>`;
      node.innerHTML = fl;
      addCss(uplist_default, "up-list");
    });
  }
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
    toview_default.name = void 0;
    toview_default.owner = void 0;
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
    Player.addModifyArgument((args) => {
      if (this.destroy)
        return;
      const obj = urlObj(`?${args[2]}`);
      obj.playlist = JSON.stringify({ code: 0, data: toview_default, message: "0", ttl: 1 });
      args[2] = objUrl("", obj);
    });
    propertyHook(window, "callAppointPart", this.callAppointPart);
    addCss(".bilibili-player .bilibili-player-auxiliary-area .bilibili-player-playlist .bilibili-player-playlist-playlist {height: calc(100% - 45px);}");
  }
  callAppointPart = (p, state) => {
    if (this.destroy)
      return Reflect.deleteProperty(window, "callAppointPart");
    const vue = document.querySelector("#app")?.__vue__;
    if (vue) {
      vue.$store.state.aid = state.aid;
      apiViewDetail(state.aid).then((d) => {
        vue.setVideoData(d.View);
        document.querySelector("#recommend_report")?.__vue__.init(d.Related);
        document.querySelector("#v_tag").__vue__.$data.tags = d.Tags;
        this.BLOD.videoInfo.aidDatail(d.View);
      }).catch((e) => {
        this.BLOD.toast.error("更新视频信息失败", e)();
      }).finally(() => {
        history.pushState(history.state, "", `/video/av${state.aid}`);
      });
    }
  };
  enLike() {
    if (this.BLOD.status.like) {
      poll(() => document.querySelector("[report-id*=coin]"), (d) => {
        if (this.destroy)
          return this.like.remove();
        d.parentElement?.insertBefore(this.like, d);
        addCss(".video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}", "ulike-av");
      });
      const destroy = this.BLOD.videoInfo.bindChange((v) => {
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

// src/html/watchlater.html
var watchlater_default = '<!-- <!DOCTYPE html> -->\r\n<html lang="zh-CN">\r\n\r\n<head>\r\n    <meta charset="utf-8" />\r\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\r\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\r\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\r\n    <meta name="renderer" content="webkit" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\r\n    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />\r\n    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"\r\n        title="哔哩哔哩" />\r\n    <link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css" />\r\n    <link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css" />\r\n    <link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css"\r\n        rel="stylesheet" />\r\n    <style type="text/css">\r\n        #bofqi .player {\r\n            width: 980px;\r\n            height: 620px;\r\n            display: block;\r\n        }\r\n\r\n        @media screen and (min-width:1400px) {\r\n            #bofqi .player {\r\n                width: 1160px;\r\n                height: 720px\r\n            }\r\n        }\r\n\r\n        /* 修正稍后再看迷你播放器样式 */\r\n        .bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-danmaku {\r\n            top: 30px;\r\n            height: 240px;\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div class="z-top-container has-menu"></div>\r\n    <div id="viewlater-app">\r\n        <app></app>\r\n    </div>\r\n    <div class="footer bili-footer"></div>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\/script>\r\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"><\/script>\r\n    <script type="text/javascript"\r\n        src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"><\/script>\r\n</body>\r\n\r\n</html>';

// src/page/watchalter.ts
var PageWatchlater = class extends Page {
  constructor(BLOD2) {
    super(watchlater_default);
    this.BLOD = BLOD2;
    this.like = new Like(this.BLOD);
    new Comment(BLOD2);
    this.enLike();
    this.toview();
    this.updateDom();
    this.living();
    this.commentAgent();
    Header.primaryMenu();
    Header.banner();
  }
  like;
  toview() {
    jsonpHook("history/toview/web?", void 0, (d) => {
      setTimeout(() => {
        d.data.list.forEach((d2) => this.BLOD.videoInfo.aidDatail(d2));
      });
      return d;
    });
  }
  enLike() {
    if (this.BLOD.status.like) {
      poll(() => document.querySelector(".u.coin"), (d) => {
        d.parentElement?.insertBefore(this.like, d);
        addCss(".video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}", "ulike-watchlater");
      }, void 0, 0);
      jsonpHook("x/web-interface/view?", void 0, (d) => {
        setTimeout(() => {
          const data = jsonCheck(d).data;
          this.BLOD.aid = data.aid;
          this.like.likes = data.stat.like;
          this.like.init();
        });
        return d;
      }, false);
    }
  }
  living() {
    xhrHook("api.live.bilibili.com/bili/living_v2/", void 0, (r) => {
      r.response = r.responseText = ` ${r.response}`;
    }, false);
  }
  commentAgent() {
    window.commentAgent = { seek: (t) => window.player && window.player.seek(t) };
  }
};

// src/html/playlist.html
var playlist_default = '<!-- <!DOCTYPE html> -->\r\n<html lang="zh-CN">\r\n\r\n<head>\r\n    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\r\n    <meta charset="utf-8" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\r\n    <meta name="renderer" content="webkit" />\r\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\r\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\r\n    <meta charset="utf-8" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\r\n    <meta name="renderer" content="webkit" />\r\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\r\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\r\n    <link\r\n        href="//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css"\r\n        rel="stylesheet" />\r\n    <style type="text/css">\r\n        #bofqi .player {\r\n            width: 980px;\r\n            height: 620px;\r\n            display: block;\r\n        }\r\n\r\n        @media screen and (min-width:1400px) {\r\n            #bofqi .player {\r\n                width: 1160px;\r\n                height: 720px\r\n            }\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div id="playlist-video-app"></div>\r\n    <div class="footer bili-footer report-wrap-module"></div>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"><\/script>\r\n    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"><\/script>\r\n    <script type="text/javascript"\r\n        src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"><\/script>\r\n    <script type="text/javascript"\r\n        src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"><\/script>\r\n</body>\r\n\r\n</html>';

// src/page/playlist.ts
var PagePlaylist = class extends Page {
  constructor(BLOD2) {
    super(playlist_default);
    this.BLOD = BLOD2;
    this.like = new Like(this.BLOD);
    new Comment(BLOD2);
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
  route = urlObj(location.href);
  type = 3;
  pl = -1;
  isPl = false;
  like;
  init() {
    this.isPl = Boolean(this.BLOD.path[5].startsWith("pl"));
    this.BLOD.path[5].replace(/\d+/, (d) => this.pl = d);
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
    this.isPl || this.BLOD.urlCleaner.updateLocation(objUrl(`https://www.bilibili.com/playlist/video/pl${this.pl}`, this.route));
  }
  EmbedPlayer() {
    if (!this.isPl) {
      Player.addModifyArgument((args) => {
        const obj = urlObj(`?${args[2]}`);
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
          this.BLOD.videoInfo.aidInfo(d);
        });
      });
    }
  }
  toviewHook() {
    jsonpHook.async("toview", void 0, async () => {
      this.BLOD.urlCleaner.updateLocation(this.BLOD.path.join("/"));
      return { code: 0, data: toview_default, message: "0", ttl: 1 };
    });
    this.BLOD.videoInfo.toview(toview_default);
  }
  elecShow() {
    if (this.BLOD.status.elecShow) {
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
  switchVideo = () => {
    this.BLOD.urlCleaner.updateLocation(location.href.split("?")[0]);
  };
  enLike() {
    if (this.BLOD.status.like) {
      poll(() => document.querySelector(".u.coin"), (d) => {
        d.parentElement?.insertBefore(this.like, d);
        addCss(".video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}", "ulike-playlist");
      });
      jsonpHook("x/web-interface/view?", void 0, (d) => {
        setTimeout(() => {
          const data = jsonCheck(d).data;
          this.BLOD.aid = data.aid;
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

// src/html/ranking.html
var ranking_default = '<!-- <!DOCTYPE html> -->\r\n<html lang="zh-CN">\r\n\r\n<head>\r\n    <title>热门视频排行榜 - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>\r\n    <meta charset="utf-8" />\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\r\n    <meta name="renderer" content="webkit" />\r\n    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />\r\n    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />\r\n    <link rel="stylesheet"\r\n        href="//s1.hdslb.com/bfs/static/jinkela/rank/css/rank.0.ba58f8684a87651e0e1c576df8f918bfa10c1a90.css" />\r\n    <style type="text/css">\r\n        .gg-floor-module {\r\n            display: none;\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div class="z-top-container has-menu"></div>\r\n    <div id="rank-app"></div>\r\n    <div class="footer bili-footer report-wrap-module"></div>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\/script>\r\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\/script>\r\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin=""><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"><\/script>\r\n</body>\r\n\r\n</html>';

// src/page/ranking.ts
var PageRanking = class extends Page {
  constructor(BLOD2) {
    super(ranking_default);
    this.BLOD = BLOD2;
    this.location();
    this.overDue();
    this.initState();
    this.updateDom();
    Header.primaryMenu();
    Header.banner();
  }
  location() {
    this.BLOD.urlCleaner.updateLocation(/ranking/.test(document.referrer) ? document.referrer : "https://www.bilibili.com/ranking");
  }
  overDue() {
    jsonpHook(["api.bilibili.com/x/web-interface/ranking", "arc_type=0"], (d) => d.replace(/day=\d+/, "day=3"), void 0, false);
  }
  initState() {
    propertyHook(window, "__INITIAL_STATE__", void 0);
  }
  style() {
    addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
  }
};

// src/html/read.html
var read_default = '<!-- <!DOCTYPE html> -->\r\n<html lang="zh-CN">\r\n\r\n<head itemprop="Article" itemscope="itemscope" itemtype="http://schema.org/Article">\r\n    <meta charset="UTF-8" />\r\n    <meta data-n-head="true" name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />\r\n    <meta name="theme-color" content="#de698c" />\r\n    <meta http="Cache-Control" content="no-transform" />\r\n    <meta name="format-detection" content="telephone=no" />\r\n    <meta name="applicable-device" content="pc" />\r\n    <link rel="apple-touch-icon-precomposed" href="//static.hdslb.com/mobile/img/512.png" />\r\n    <link rel="icon" type="image/vnd.microsoft.icon" href="//www.bilibili.com/favicon.ico" />\r\n    <link rel="apple-touch-icon" href="//www.bilibili.com/favicon.ico" />\r\n    <meta name="renderer" content="webkit" />\r\n    <link data-n-head="true" rel="icon" type="image/x-icon" href="//www.bilibili.com/favicon.ico" />\r\n    <link data-n-head="true" rel="apple-touch-icon-precomposed" type="image/x-icon"\r\n        href="//static.hdslb.com/mobile/img/512.png" />\r\n    <title>哔哩哔哩专栏</title>\r\n    <link href="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.css"\r\n        rel="stylesheet" />\r\n    <style type="text/css">\r\n        .nav-tab-bar .tab-item[data-tab-id="41"]:before {\r\n            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA6lBMVEUAAAAiIiIkJCT///8jIyMiIiIiIiIiIiJVVVUjIyMjIyMlJSU0NDT9/f0iIiIoKCjz8/NCQkIjIyMjIyMrKysiIiJFRUWQkJAiIiIlJSUjIyMkJCQzMzNAQEDv7+/7+/tHR0ciIiIlJSUjIyNKSkp7e3tcXFxoaGgjIyMjIyMkJCT8/PxDQ0MnJyf39/fx8fHn5+cvLy/i4uLe3t7R0dHAwMA0NDQjIyOtra06Ojo+Pj4iIiJAQEBOTk5VVVVwcHBtbW1hYWEjIyMjIyMjIyMiIiIiIiIlJSUpKSkkJCT///95eXltbW1zc3PUVbhEAAAASnRSTlMAf4H+6NOdaAOnQRQF/asO/vTs5NnXxcO6NzMaCgT++fLv3s7GwMC/v6Fi+vr59PDn5ePh2dHOzMrKyMjGw8C/v7+1sZeVUikfHAMz54kAAAEUSURBVCjPldLXboMwFIDhQ7DNDBA2JGmTNLt7772d9v1fp5hSjEOkqP+lP/lIlg+sTVcaRV1gKXE/mLWBZWqYSEUMjfjsYv/4Hr0zxJYKlYxgItOsaMpmItHwA82TkQGgEMG2JrTITwGkRsXs80f6F/oU0b4el3YaQI585l1pm/6bgHZ/Ry7tcgYCaoetjcKaV1ZXwGSwvSi0efNsgoAvI0oXLYc9MXwyQcTBSXb83XOoPIw7AGlawQ8ks4FfPWc47fyec5yHmTHddZmJqEU57t16baghOqL0IArdVxvq6I3GvqvN2bU6JkRK+Odx5P0LFbIaicLWBKurTPX0/IEWV24WBpaJEWksRbBmlkstLaXosK4fYdYsW/LHMigAAAAASUVORK5CYII=);\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div class="z-top-container report-wrap-module"></div>\r\n    <div class="page-container"></div>\r\n    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>\r\n    <script src="//static.hdslb.com/public/intersection-observer.js"><\/script>\r\n    <script src="//static.hdslb.com/public/timing.min.js"><\/script>\r\n    <script src="//static.hdslb.com/js/jquery.min.js"><\/script>\r\n    <script type="text/javascript" charset="utf-8" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\/script>\r\n    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/biliapp/biliapp.js"><\/script>\r\n    <script type="text/javascript"\r\n        src="//s1.hdslb.com/bfs/static/jinkela/article/manifest.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\/script>\r\n    <script type="text/javascript"\r\n        src="//s1.hdslb.com/bfs/static/jinkela/article/vendor.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\/script>\r\n    <script type="text/javascript"\r\n        src="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"><\/script>\r\n</body>\r\n\r\n</html>';

// src/page/read.ts
var PageRead = class extends Page {
  constructor(BLOD2) {
    super(read_default);
    this.BLOD = BLOD2;
    new Comment(BLOD2);
    this.initState();
    PageRead.rightCopyEnable();
  }
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
      s += `<a href="//www.bilibili.com/read/${d[2]}?from=articleDetail" target="_self" class="tab-item${this.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="${d[0]}"><span>${d[1]}</span></a>`;
      return s;
    }, '<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>') + "</div>";
  }
  upInfoHolder() {
    this.readInfoStr += `<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
        <a class="up-face-holder" href="//space.bilibili.com/${this.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="${this.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
        <a class="up-name" href="//space.bilibili.com/${this.readInfo.author.mid}" target="_blank">${this.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
        </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>`;
  }
  headContainer() {
    this.readInfoStr += `<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
        <h1 class="title">${this.readInfo.title}</h1><div class="info">
        <a class="category-link" href="//www.bilibili.com/read/${this.bars.find((d) => {
      if (d[0] == this.readInfo.category.parent_id)
        return d;
    })[2]}#rid=${this.readInfo.category.id}" target="_blank"><span>${this.readInfo.category.name}</span></a> <span class="create-time" data-ts="${this.readInfo.ctime}"></span><div class="article-data"></div>
        </div></div><div style="display:none" class="author-container">
        <a class="author-face" href="//space.bilibili.com/${this.readInfo.author.mid}" target="_blank"><img data-face-src="${this.readInfo.author.face.replace("http:", "")}" src="${this.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/${this.readInfo.author.mid}" target="_blank">${this.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>`;
  }
  articleHolder() {
    this.readInfoStr += `<div class="article-holder">${this.readInfo.content}</div><p class="original">本文为我原创</p>`;
  }
  tagContainer() {
    this.readInfoStr += (this.readInfo.tags || []).reduce((o, d) => {
      o = o + `<li data-tag-id="${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">${d.name}</span></li>`;
      return o;
    }, `<ul class="tag-container">`) + "</ul>";
  }
  articleAction() {
    this.readInfoStr += `<div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>`;
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
    this.vdom.loadScript().then(() => this.loadedCallback());
    title && !title.includes("404") && (document.title = title);
  }
  static rightCopyEnable() {
    addCss(`* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }`);
    [].forEach.call(["contextmenu", "copy", "cut", "paste", "mouseup", "mousedown", "keyup", "keydown", "drag", "dragstart", "select", "selectstart"], function(event) {
      document.addEventListener(event, function(e) {
        e.stopPropagation();
      }, true);
    });
  }
};

// src/html/search.html
var search_default = '<!-- <!DOCTYPE html> -->\r\n<html lang="zh-CN">\r\n\r\n<head>\r\n    <title data-vue-meta="true"> _ 搜索结果_哔哩哔哩_Bilibili</title>\r\n    <meta data-vue-meta="true" charset="UTF-8">\r\n    <meta data-vue-meta="true" http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\r\n    <meta data-vue-meta="true" name="renderer" content="webkit|ie-comp|ie-stand">\r\n    <meta data-vue-meta="true" name="description"\r\n        content="点击查看更多相关视频、番剧、影视、直播、专栏、话题、用户等内容；你感兴趣的视频都在B站，bilibili是国内知名的视频弹幕网站，这里有及时的动漫新番，活跃的ACG氛围，有创意的Up主。大家可以在这里找到许多欢乐。">\r\n    <meta data-vue-meta="true" name="keywords"\r\n        content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid">\r\n    <meta data-vue-meta="true" charset="UTF-8">\r\n    <meta name="referrer" content="no-referrer-when-downgrade">\r\n    <link rel="dns-prefetch" href="//s1.hdslb.com">\r\n    <link rel="dns-prefetch" href="//i0.hdslb.com">\r\n    <link rel="dns-prefetch" href="//i1.hdslb.com">\r\n    <link rel="dns-prefetch" href="//i2.hdslb.com">\r\n    <link rel="dns-prefetch" href="//static.hdslb.com">\r\n    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico">\r\n    <link rel="stylesheet"\r\n        href="//s1.hdslb.com/bfs/static/jinkela/search/css/search.1.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.css">\r\n    <link rel="stylesheet"\r\n        href="//s1.hdslb.com/bfs/static/jinkela/search/css/search.0.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.css">\r\n</head>\r\n\r\n<body id="bili-search">\r\n    <div class="z-top-container"></div>\r\n    <div id="search-app"></div>\r\n    <!-- built files will be auto injected -->\r\n    <div class="footer bili-footer report-wrap-module"></div>\r\n    <script type="text/javascript"\r\n        src="//www.bilibili.com/gentleman/polyfill.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"><\/script>\r\n    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"><\/script>\r\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.min.js"><\/script>\r\n    <script type="text/javascript"\r\n        src="//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.vue.min.js"><\/script>\r\n    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"><\/script>\r\n    <script\r\n        src="//s1.hdslb.com/bfs/static/jinkela/search/1.search.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.js"><\/script>\r\n    <script src="//s1.hdslb.com/bfs/static/jinkela/search/search.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.js"><\/script>\r\n</body>\r\n\r\n</html>';

// src/page/search.ts
var PageSearch = class extends Page {
  constructor(BLOD2) {
    super(search_default);
    this.BLOD = BLOD2;
    this.location();
    this.initState();
    this.updateDom();
  }
  location() {
    poll(() => location.href.endsWith("all"), () => {
      this.BLOD.urlCleaner.updateLocation(location.origin);
    }, 10, 30);
  }
  initState() {
    propertyHook(window, "__INITIAL_STATE__", void 0);
  }
};

// src/io/api-biliplus-playurl.ts
var apiBiliplusPlayurl = class {
  fetch;
  constructor(data) {
    this.fetch = fetch(objUrl("//www.biliplus.com/BPplayurl.php", data));
  }
  getData() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.json()).then((d) => resolve(d)).catch((e) => reject(e));
    });
  }
};

// src/io/fnval.ts
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
  30251: "fLaC",
  30250: "ec-3",
  30280: "mp4a.40.2",
  30232: "mp4a.40.2",
  30216: "mp4a.40.2"
};
var PlayurlCodecsAPP = {
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
async function apiPlayurl(data, dash = true, pgc = false) {
  data = Object.assign({
    qn,
    otype: "json",
    fourk: 1
  }, data, dash ? { fnver, fnval } : {});
  const response = await fetch(objUrl(pgc ? URLS.PGC_PLAYURL : URLS.PLAYURL, data), { credentials: "include" });
  const json = await response.json();
  if (pgc) {
    return jsonCheck(json).result;
  }
  return jsonCheck(json).data;
}
var ApiAppPgcPlayurl = class extends ApiSign {
  fetch;
  constructor(data, server = "api.bilibili.com") {
    super(URLS.APP_PGC_PLAYURL.replace("api.bilibili.com", server), "1d8b6e7d45233436");
    data = Object.assign({
      build: 6720300,
      device: "android",
      force_host: 2,
      mobi_app: "android",
      platform: "android"
    }, data);
    this.fetch = fetch(this.sign(data));
  }
  getData() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.json()).then((d) => resolve(jsonCheck(d))).catch((e) => reject(e));
    });
  }
};

// src/io/sidx.ts
var Sidx = class {
  constructor(url, size = 6e4) {
    this.url = url;
    this.size = size;
  }
  end = 5999;
  start = 0;
  hex_data = "";
  getData() {
    return new Promise((resolve, reject) => {
      this.fetch(resolve, reject);
    });
  }
  fetch(resolve, reject) {
    fetch(this.url.replace("http:", "https:"), {
      headers: {
        range: `bytes=${this.start}-${this.end}`
      }
    }).then((d) => {
      if ((d.status >= 300 || d.status < 200) && d.status !== 304)
        throw new Error(`${d.status} ${d.statusText}`, { cause: d.status });
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
  constructor(data, uposName, server = "api.global.bilibili.com") {
    super(URLS.GLOBAL_OGV_PLAYURL.replace("api.global.bilibili.com", server), "7d089525d3611b1c");
    this.uposName = uposName;
    data = Object.assign({
      area: "th",
      build: 1001310,
      device: "android",
      force_host: 2,
      download: 1,
      mobi_app: "bstar_a",
      platform: "android"
    }, data);
    this.fetch = fetch(this.sign(data));
  }
  fetch;
  getDate() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.text()).then((d) => resolve(jsonCheck(VideoLimit.uposReplace(d, this.uposName)).data)).catch((e) => reject(e));
    });
  }
  toPlayurl() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.text()).then((d) => jsonCheck(VideoLimit.uposReplace(d, this.uposName)).data).then((d) => {
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
          resolve(playurl);
        }).catch((e) => reject(e));
      }).catch((e) => reject(e));
    });
  }
};

// src/core/videolimit.ts
var UPOS2 = {
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
var _VideoLimit = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
  }
  Backup = {};
  toast;
  data = [];
  listening = false;
  __playinfo__;
  enable() {
    if (this.listening)
      return;
    const disable = xhrHook.async("/playurl?", (args) => {
      const obj = urlObj(args[1]);
      this.updateVaribale(obj);
      return Boolean(this.BLOD.limit || this.BLOD.th);
    }, async (args) => {
      const response = this.BLOD.th ? await this._th(args) : await this._gat(args);
      return { response, responseType: "json", responseText: JSON.stringify(response) };
    }, false);
    xhrHook("/playurl?", () => !(this.BLOD.limit || this.BLOD.th), (res) => {
      try {
        const result = res.responseType === "json" ? JSON.stringify(res) : res.responseText;
        if (this.BLOD.status.uposReplace.nor !== "不替换") {
          const nstr = _VideoLimit.uposReplace(result, this.BLOD.status.uposReplace.nor);
          this.BLOD.toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${this.BLOD.status.uposReplace.nor}`, `UPOS：${UPOS2[this.BLOD.status.uposReplace.nor]}`);
          if (res.responseType === "json") {
            res.response = JSON.parse(nstr);
          } else {
            res.response = res.responseText = nstr;
          }
        }
      } catch (e) {
      }
    }, false);
    this.disable = () => {
      disable();
      this.listening = false;
    };
    this.listening = true;
  }
  async _th(args) {
    this.data = ["泰区限制视频！"];
    this.toast = this.BLOD.toast.toast(0, "info", ...this.data);
    const obj = urlObj(args[1]);
    this.data.push(`aid：${this.BLOD.aid}`, `cid：${this.BLOD.cid}`);
    this.toast.data = this.data;
    const epid = obj.ep_id || obj.episodeId || this.BLOD.epid;
    obj.access_key = this.BLOD.status.accessKey.token;
    if (!this.Backup[epid]) {
      try {
        this.BLOD.networkMock();
        this.data.push(`代理服务器：${this.BLOD.status.videoLimit.th}`);
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
  async _gat(args) {
    this.data = ["港澳台限制视频！"];
    this.toast = this.BLOD.toast.toast(0, "info", ...this.data);
    const obj = urlObj(args[1]);
    this.data.push(`aid：${this.BLOD.aid}`, `cid：${this.BLOD.cid}`);
    this.toast.data = this.data;
    const epid = obj.ep_id || obj.episodeId || this.BLOD.epid;
    obj.access_key = this.BLOD.status.accessKey.token;
    if (!this.Backup[epid]) {
      try {
        if (this.BLOD.status.videoLimit.server === "内置") {
          obj.module = "bangumi";
          const upInfo = window.__INITIAL_STATE__?.upInfo;
          if (upInfo) {
            (upInfo.mid == 1988098633 || upInfo.mid == 2042149112) && (obj.module = "movie");
          }
          this.data.push(`代理服务器：内置`, `类型：${obj.module}`);
          this.toast.data = this.data;
          const res = await new apiBiliplusPlayurl(obj).getData();
          this.Backup[epid] = { code: 0, message: "success", result: res };
        } else {
          this.BLOD.networkMock();
          const res = await this.gat(obj);
          this.Backup[epid] = { code: 0, message: "success", result: res };
        }
        if (this.BLOD.status.uposReplace.gat !== "不替换") {
          this.Backup[epid] = JSON.parse(_VideoLimit.uposReplace(JSON.stringify(this.Backup[epid]), this.BLOD.status.uposReplace.gat));
          this.BLOD.toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${this.BLOD.status.uposReplace.gat}`, `UPOS：${UPOS2[this.BLOD.status.uposReplace.gat]}`);
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
  disable() {
    this.listening = false;
  }
  updateVaribale(obj) {
    obj.seasonId && (this.BLOD.ssid = obj.seasonId);
    obj.episodeId && (this.BLOD.epid = obj.episodeId);
    obj.ep_id && (this.BLOD.epid = obj.ep_id);
    obj.aid && (this.BLOD.aid = Number(obj.aid)) && (this.BLOD.aid = obj.aid);
    obj.avid && (this.BLOD.aid = Number(obj.avid)) && (this.BLOD.aid = obj.avid);
    obj.cid && (this.BLOD.cid = Number(obj.cid)) && (this.BLOD.cid = obj.cid);
  }
  async th(obj) {
    const d = await new ApiGlobalOgvPlayurl(obj, this.BLOD.status.uposReplace.th, this.BLOD.status.videoLimit.th).toPlayurl();
    this.BLOD.toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${this.BLOD.status.uposReplace.th}`, `UPOS：${UPOS2[this.BLOD.status.uposReplace.th]}`);
    return d;
  }
  area = 0;
  async gat(obj) {
    if (!this.BLOD.status.videoLimit[AREA[this.area]])
      throw new Error(`无有效代理服务器：${AREA[this.area]}`);
    const server = this.BLOD.status.videoLimit[AREA[this.area]];
    obj.area = AREA[this.area];
    this.data.push(`代理服务器：${server}`);
    this.toast && (this.toast.data = this.data);
    try {
      return await new ApiAppPgcPlayurl(obj, server).getData();
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
  static uposReplace(str, uposName) {
    if (uposName === "不替换")
      return str;
    this.upos = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.upos = false, 1e3);
    return str.replace(/:\\?\/\\?\/[^\/]+\\?\//g, () => `://${UPOS2[uposName]}/`);
  }
};
var VideoLimit = _VideoLimit;
__publicField(VideoLimit, "upos", false);
__publicField(VideoLimit, "timer");

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

// src/io/account-getcardbymid.ts
async function accountGetCardByMid(mid, GM2) {
  const data = await GM2.fetch(objUrl(URLS.ACCOUNT_GETCARDBYMID, { mid }));
  return jsonCheck(await data.json()).card;
}

// src/page/space.ts
var Mid = {
  11783021: "哔哩哔哩番剧出差",
  1988098633: "b站_戲劇咖",
  2042149112: "b站_綜藝咖"
};
var PageSpace = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    this.mid = Number(this.BLOD.path[3] && this.BLOD.path[3].split("?")[0]);
    this.midInfo();
    this.BLOD.userLoadedCallback((status) => {
      status.album && this.album();
      status.jointime && this.jointime();
      status.lostVideo && this.lostVideo();
    });
  }
  mid;
  aids = [];
  aidInfo = [];
  midInfo() {
    switch (this.mid) {
      case 11783021:
      case 1988098633:
      case 2042149112:
        mid_default.data.name = Mid[this.mid];
        mid_default.data.official.desc = mid_default.data.name + " 官方帐号";
        xhrHook("api.bilibili.com/x/space/acc/info", void 0, (obj) => {
          if (obj.responseText && obj.responseText.includes("-404")) {
            obj.response = obj.responseText = JSON.stringify(mid_default);
            this.BLOD.toast.warning("该用户被404，已使用缓存数据恢复访问！");
          }
        }, false);
        break;
      default:
        break;
    }
  }
  album() {
    xhrHook("api.bilibili.com/x/dynamic/feed/draw/doc_list", void 0, (obj) => {
      const response = JSON.parse(obj.responseText);
      let data = response.data.items.reduce((s, d) => {
        s.push(d.doc_id);
        return s;
      }, []);
      setTimeout(() => {
        document.querySelectorAll(".album-card").forEach((d, i) => {
          d.firstChild.href = `//h.bilibili.com/${data[i]}`;
          d.children[1].href = `//h.bilibili.com/${data[i]}`;
        });
      }, 1e3);
    }, false);
  }
  static album() {
    xhrHook(["x/polymer/web-dynamic", "detail?"], void 0, (res) => {
      const result = res.responseType === "json" ? res.response : JSON.parse(res.response);
      if (result.code === 0) {
        if (result.data?.item.type === "DYNAMIC_TYPE_DRAW")
          location.replace(`https://h.bilibili.com/${result.data.item.basic.rid_str}`);
      }
    }, false);
  }
  jointime() {
    poll(() => document.querySelector(".section.user-info"), (t) => {
      accountGetCardByMid(this.mid, this.BLOD.GM).then((d) => {
        const jointime = timeFormat(d.regtime * 1e3, true);
        const node = t.lastChild;
        new VdomTool(`<div class="info-regtime" style="display: inline-block;word-break: break-all;">
                    <span class="info-command" style="display: inline-block;font-size: 12px;font-family: Microsoft YaHei;line-height: 16px;color: #9499a0;margin-right: 16px;">注册</span>
                    <span class="info-value" style="color: #6d757a;font-family: Microsoft YaHei;font-size: 12px;line-height: 16px;padding-right: 15px;">${jointime}</span>
                </div>`).appendTo(node);
      });
    });
  }
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
          const toast = this.BLOD.toast.toast(0, "warning", ...data2);
          this.lostVideoView().then(() => {
            setTimeout(() => {
              data2.push("数据返回，正在修复~");
              let resolve = 0, reject = 0;
              toast.data = data2;
              toast.type = "success";
              const ele = document.querySelector("#page-fav");
              if (ele) {
                const medias = ele.__vue__.favListDetails.medias;
                medias?.forEach((d) => {
                  if (d.attr % 2) {
                    data2.push(`-------- av${d.id} --------`);
                    if (this.aidInfo[d.id].title) {
                      resolve++;
                      d.title = this.aidInfo[d.id].title;
                      data2.push(this.aidInfo[d.id].title);
                    } else {
                      reject++;
                      d.title = `av${d.id}`;
                      data2.push("未能获取到有效信息！");
                    }
                    this.aidInfo[d.id].cover && (d.cover = this.aidInfo[d.id].cover);
                    d.attr = 0;
                    toast.data = data2;
                    ele.querySelector(`[data-aid=${d.bvid}]`)?.children[1]?.setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                  }
                });
              }
              data2.push("", `修复结束：成功 ${resolve} 失败 ${reject}`);
              toast.data = data2;
              toast.delay = 4;
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
        await this.BLOD.GM.fetch(`//www.biliplus.com/video/av${d}`).then((d2) => d2.text()).then((d2) => {
          if (d2.match(/\<title\>.+?\ \-\ AV/)) {
            title = d2.match(/\<title\>.+?\ \-\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
            cover = d2.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
          }
        }).catch((e) => {
          debug.error(`获取失效视频av${d}信息错误`, "BILIPLUS", e);
        });
        if (!title || !cover) {
          await this.BLOD.GM.fetch(`//www.biliplus.com/all/video/av${d}`).then((d2) => d2.text()).then((d2) => {
            if (d2.match("/api/view_all?")) {
              const url = d2.match(/\/api\/view_all\?.+?\',cloudmoe/)[0].replace(/\',cloudmoe/, "");
              return this.BLOD.GM.fetch(`//www.biliplus.com${url}`);
            }
            throw new Error("无cid缓存");
          }).then((d2) => d2.json()).then((d2) => {
            d2 = jsonCheck(d2);
            title = title || d2.data.info.title;
            cover = cover || d2.data.info.pic;
          }).catch((e) => {
            debug.error(`获取失效视频av${d}信息错误`, "BILIPLUSALL", e);
          });
        }
        if (!title || !cover) {
          await this.BLOD.GM.fetch(`//www.jijidown.com/video/av${d}`).then((d2) => d2.text()).then((d2) => {
            if (d2.match("window._INIT")) {
              title = title || d2.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
              cover = cover || d2.match(/\"img\":\ \".+?\",/)[0].match(/http.+?\",/)[0].replace(/",/, "");
            }
          }).catch((e) => {
            debug.error(`获取失效视频av${d}信息错误`, "JIJIDOWN", e);
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
var PageMedia = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    this.limit();
  }
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
var PageHistory = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    BLOD2.userLoadedCallback((status) => {
      status.history && this.archive();
    });
  }
  archive() {
    xhrHook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function(args) {
      let obj = new URL(args[1]), max = obj.searchParams.get("max") || "", view_at = obj.searchParams.get("view_at") || "";
      args[1] = objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max, view_at, type: "archive", ps: "20" });
    }, void 0, false);
  }
};

// src/page/dynamic.ts
var PageDynamic = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    this.BLOD.userLoadedCallback((status) => {
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

// src/io/api-login-app-third.ts
var ApiLoginAppThird = class extends ApiSign {
  fetch;
  constructor(api) {
    api = encodeURIComponent(api);
    super(URLS.LOGIN_APP_THIRD, "27eb53fc9058f8c3");
    this.fetch = fetch(this.sign({ api }, api), { credentials: "include" });
  }
  getData() {
    return new Promise((resolve, reject) => {
      this.fetch.then((d) => d.json()).then((d) => resolve(jsonCheck(d).data)).catch((e) => reject(e));
    });
  }
};

// src/core/accesskey.ts
var AccessKey = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    const button = [{
      text: "开始授权",
      callback: () => this.get()
    }];
    if (this.BLOD.status.accessKey.token) {
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
      const toast = this.BLOD.toast.toast(0, "info", ...data);
      new ApiLoginAppThird("https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png").getData().then(async (d) => {
        data.push("成功获取到授权链接~");
        toast.data = data;
        return this.BLOD.GM.fetch(d.confirm_uri);
      }).then((d) => {
        const date = new Date().getTime();
        const dateStr = timeFormat(date, true);
        const obj = urlObj(d.url);
        this.BLOD.status.accessKey.token = obj.access_key;
        this.BLOD.status.accessKey.date = date;
        this.BLOD.status.accessKey.dateStr = dateStr;
        data.push("------- 授权成功 -------", `鉴权: ${obj.access_key}`, `日期：${dateStr}`);
        toast.data = data;
        toast.type = "success";
        toast.delay = 4;
      }).catch((e) => {
        debug.error("授权出错！", e);
        data.push("授权出错！", e);
        toast.data = data;
        toast.type = "error";
        toast.delay = 4;
      });
    } else {
      this.BLOD.toast.warning("请先登录B站账户！");
      this.BLOD.biliQuickLogin();
    }
  }
  remove() {
    this.BLOD.status.accessKey.token = "";
    this.BLOD.status.accessKey.date = 0;
    this.BLOD.status.accessKey.dateStr = "";
    this.BLOD.toast.warning("已清除账户鉴权", "如果您在【解除播放限制】功能中选择【自定义】服务器，那么第三方服务器中很可能依然有鉴权。", "为求保险，您可以修改一次密码，这会强制所有鉴权失效。")();
  }
};

// src/utils/base64.ts
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

// src/utils/mutex.ts
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
    return `${this.server}:${this.port}/jsonrpc`;
  }
  cmdlet(data) {
    const arr2 = ["aria2c"];
    data.urls.forEach((d) => arr2.push(`"${d}"`));
    data.out && arr2.push(`--out="${data.out}"`);
    (data.userAgent || this.userAgent) && arr2.push(`--user-agent="${data.userAgent || this.userAgent}"`);
    (data.referer || this.referer) && arr2.push(`--referer="${data.referer || this.referer}"`);
    (data.dir || this.dir) && arr2.push(`--dir="${data.dir || this.dir}"`);
    (data.split || this.split) && arr2.push(`--split="${data.split || this.split}"`, `--max-connection-per-server="${data.split || this.split}"`);
    (data.size || this.size) && arr2.push(`--min-split-size="${data.size || this.size}M"`);
    data.header && Object.entries(data.header).forEach((d) => arr2.push(`--header="${d[0]}: ${d[1]}"`));
    return navigator.clipboard.writeText(arr2.join(" "));
  }
  rpc(data) {
    const options = {};
    data.out && (options.out = data.out);
    (data.userAgent || this.userAgent) && (options["user-agent"] = data.userAgent || this.userAgent);
    (data.referer || this.referer) && (options.referer = data.referer || this.referer);
    (data.dir || this.dir) && (options.dir = data.dir || this.dir);
    (data.split || this.split) && (options.split = options["max-connection-per-server"] = data.split || this.split);
    (data.size || this.size) && (options["min-split-size"] = `${data.size || this.size}M`);
    data.header && (options.header = data.header);
    return this.postMessage("aria2.addUri", data.id, [data.urls, options]);
  }
  getVersion() {
    return this.postMessage("aria2.getVersion");
  }
  postMessage(method, id = getMetux(), params = []) {
    this.token && params.unshift(`token:${this.token}`);
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
        fetch(objUrl(this.url, { method, id, params: Base64.encode(JSON.stringify(params)) })).then((d) => d.json()).then((d) => {
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

// src/css/desc.css
var desc_default = ".container {\r\n    position: fixed;\r\n    top: 16px;\r\n    left: 100%;\r\n    background: hsla(0, 0%, 95.7%, .8);\r\n    border-radius: 2px;\r\n    box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);\r\n    color: #000;\r\n    width: 381px;\r\n    z-index: 1;\r\n}\r\n\r\n.title {\r\n    text-align: center;\r\n    margin-top: 16px;\r\n    margin-bottom: 3px;\r\n    font-size: 12px;\r\n}\r\n\r\n.content {\r\n    font-size: 12px;\r\n    line-height: 19px;\r\n    padding: 0 16px 16px;\r\n    text-align: justify;\r\n    white-space: pre-line;\r\n}";

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
    root.innerHTML = `<div class="container"><div class="title"></div><div class="content"></div></div>`;
    addCss(desc_default, void 0, root);
    this._container = root.querySelector(".container");
    this._title = root.querySelector(".title");
    this._content = root.querySelector(".content");
    this.toggle(false);
  }
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
customElements.get(`desc-${"aa44074"}`) || customElements.define(`desc-${"aa44074"}`, Desc);

// src/html/ui-interface.html
var ui_interface_default = '<div class="box">\r\n    <div class="tool">\r\n        <div title="关闭" class="icon"></div>\r\n        <header>Bilbili Old</header>\r\n    </div>\r\n    <div class="content">\r\n        <div class="contain">\r\n            <div class="menu"></div>\r\n            <div class="item"></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style type="text/css">\r\n    .box {\r\n        left: 50%;\r\n        top: 50%;\r\n        transform: translateX(-50%) translateY(-50%);\r\n        min-width: 600px;\r\n        min-height: 400px;\r\n        padding: 0;\r\n        border: 0;\r\n        position: fixed;\r\n        z-index: 11110;\r\n        display: none;\r\n        box-sizing: border-box;\r\n        background: #fff;\r\n        border-radius: 8px;\r\n        box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);\r\n        transition: transform 0.3s ease-in;\r\n        line-height: 14px;\r\n        font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB,\r\n            Heiti SC, WenQuanYi Micro Hei, sans-serif;\r\n    }\r\n\r\n    .tool {\r\n        border-bottom-left-radius: 8px;\r\n        border-bottom-right-radius: 8px;\r\n        overflow: hidden;\r\n        width: 100%;\r\n        display: inline-flex;\r\n        z-index: 1;\r\n        align-items: center;\r\n        justify-content: flex-end;\r\n        pointer-events: none;\r\n    }\r\n\r\n    .tool header {\r\n        position: absolute;\r\n        transform: translateX(-50%);\r\n        left: 50%;\r\n        font-size: 14px;\r\n    }\r\n\r\n    .tool div {\r\n        border-radius: 50%;\r\n        padding: 10px;\r\n        transform: scale(0.8);\r\n        pointer-events: visible;\r\n        transition: opacity 0.3s ease;\r\n    }\r\n\r\n    .tool div:hover {\r\n        background-color: rgba(0, 0, 0, 10%);\r\n    }\r\n\r\n    .content {\r\n        position: relative;\r\n        border-bottom-left-radius: 8px;\r\n        border-bottom-right-radius: 8px;\r\n        overflow: hidden;\r\n        background-color: #fff;\r\n    }\r\n\r\n    .contain {\r\n        padding-bottom: 15px;\r\n        background-position: top center;\r\n        background-size: contain;\r\n        background-repeat: no-repeat;\r\n        display: flex;\r\n        align-items: flex-start;\r\n        flex: 1;\r\n        height: 360px;\r\n    }\r\n\r\n    .menu::-webkit-scrollbar,\r\n    .item::-webkit-scrollbar {\r\n        width: 0 !important;\r\n        height: 0 !important;\r\n    }\r\n\r\n    .menu {\r\n        flex: 1 1 0;\r\n        flex-basis: calc(480px * 0.2);\r\n        height: 100%;\r\n        position: sticky;\r\n        top: 0;\r\n        display: flex;\r\n        flex-direction: column;\r\n        min-width: fit-content;\r\n        overflow: auto;\r\n    }\r\n\r\n    .item {\r\n        flex: 4 4 0;\r\n        flex-basis: calc(480px * 0.8);\r\n        height: 100%;\r\n        box-sizing: border-box;\r\n        display: flex;\r\n        flex-direction: column;\r\n        margin: 0 auto;\r\n        position: relative;\r\n        overflow: auto;\r\n        background-image: linear-gradient(to top, white, white),\r\n            linear-gradient(to top, white, white),\r\n            linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0)),\r\n            linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0));\r\n        background-position: bottom center, top center, bottom center, top center;\r\n        background-color: white;\r\n        background-repeat: no-repeat;\r\n        background-size: 100% 20px, 100% 20px, 100% 10px, 100% 10px;\r\n        background-attachment: local, local, scroll, scroll;\r\n    }\r\n\r\n    .item>div {\r\n        margin-bottom: 60px;\r\n    }\r\n\r\n    .menuitem {\r\n        align-items: center;\r\n        display: flex;\r\n        font-weight: 500;\r\n        margin-inline-end: 2px;\r\n        margin-inline-start: 1px;\r\n        min-height: 20px;\r\n        padding-bottom: 10px;\r\n        padding-inline-start: 23px;\r\n        padding-top: 10px;\r\n        cursor: pointer;\r\n    }\r\n\r\n    .menuitem:hover {\r\n        background-color: rgb(0, 0, 0, 6%);\r\n    }\r\n\r\n    .menuitem>div {\r\n        padding-inline-end: 12px;\r\n    }\r\n\r\n    .selected {\r\n        color: rgb(51, 103, 214) !important;\r\n    }\r\n\r\n    .selected>.icon {\r\n        fill: rgb(51, 103, 214) !important;\r\n    }\r\n\r\n    .contain1 {\r\n        margin-bottom: 3px;\r\n        padding-inline-start: 20px;\r\n        padding-inline-end: 20px;\r\n        display: flex;\r\n        flex-direction: column;\r\n        outline: none;\r\n        position: relative;\r\n    }\r\n\r\n    .header .title {\r\n        color: #000;\r\n        font-size: 108%;\r\n        font-weight: 400;\r\n        letter-spacing: 0.25px;\r\n        margin-bottom: 12px;\r\n        outline: none;\r\n        padding-bottom: 4px;\r\n    }\r\n\r\n    .card {\r\n        border-radius: 4px;\r\n        box-shadow: 0px 0px 1px 1px rgb(60 64 67 / 30%);\r\n        flex: 1;\r\n        color: #000;\r\n        line-height: 154%;\r\n        user-select: text;\r\n        margin-inline: 12px;\r\n        margin-bottom: 12px;\r\n    }\r\n\r\n    .contain2 {\r\n        align-items: center;\r\n        border-top: 1px solid rgba(0, 0, 0, 6%);\r\n        display: flex;\r\n        min-height: 24px;\r\n        padding: 0 20px;\r\n        flex-wrap: wrap;\r\n        justify-content: flex-end;\r\n        background-color: transparent !important;\r\n    }\r\n\r\n    .value {\r\n        flex: 1;\r\n        flex-basis: 1e-9px;\r\n        display: flex;\r\n    }\r\n\r\n    .value>* {\r\n        flex: 1;\r\n        flex-basis: 1e-9px;\r\n        display: flex;\r\n        flex-wrap: wrap;\r\n        justify-content: flex-end;\r\n        align-items: center;\r\n        align-content: center;\r\n    }\r\n\r\n    .label {\r\n        flex: 1;\r\n        flex-basis: 1e-9px;\r\n        padding-block-end: 12px;\r\n        padding-block-start: 12px;\r\n        padding-inline-start: 12px;\r\n    }\r\n\r\n    .switch>.label,\r\n    .button>.label,\r\n    .select>.label,\r\n    .input>.label,\r\n    .slider>.label {\r\n        flex: 2;\r\n    }\r\n\r\n    .select>.value,\r\n    .input>.value,\r\n    .slider>.value {\r\n        flex: 3;\r\n    }\r\n\r\n    .sub {\r\n        color: rgb(95, 99, 104);\r\n        font-weight: 400;\r\n    }\r\n\r\n    .icon {\r\n        align-items: center;\r\n        border-radius: 50%;\r\n        display: flex;\r\n        height: 20px;\r\n        justify-content: center;\r\n        position: relative;\r\n        width: 20px;\r\n        box-sizing: content-box;\r\n        background: none;\r\n        cursor: pointer;\r\n    }\r\n</style>';

// src/core/ui/interface.ts
var BiliOldInterface = class extends HTMLElement {
  _box;
  _tool;
  _close;
  _menu;
  _item;
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
var SettingItem = class extends HTMLDivElement {
  _value = document.createElement("div");
  init(id, title, sub, svg2) {
    this.innerHTML = `<div class="contain2${id ? ` ${id}` : ""}">${svg2 ? `<div class="icon">${svg2}</div>` : ""}
    <div class="label">${title}${sub ? `<div class="sub">${sub}</div>` : ""}</div>
</div>`;
    this._value.className = "value";
    this.querySelector(".contain2")?.appendChild(this._value);
  }
  value(value) {
    this._value.appendChild(value);
  }
};
customElements.get(`item-${"aa44074"}`) || customElements.define(`item-${"aa44074"}`, SettingItem, { extends: "div" });

// src/core/ui/item-container.ts
var ItemContainer = class extends HTMLDivElement {
  _title;
  _card;
  constructor() {
    super();
    this.innerHTML = `<div class="contain1">
    <div class="header">
        <h2 class="title"></h2>
    </div>
</div>
<div class="card"></div>`;
    this._title = this.querySelector(".title");
    this._card = this.querySelector(".card");
  }
  init(title) {
    this._title.textContent = title;
  }
  addSetting(item) {
    this._card.append(...item);
  }
};
customElements.get(`item-container-${"aa44074"}`) || customElements.define(`item-container-${"aa44074"}`, ItemContainer, { extends: "div" });

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
  init(name, svg2) {
    this.className = "menuitem";
    this.innerHTML = (svg2 ? `<div class="icon">${svg2}</div>` : "") + name;
    this.container[0].init(name);
    return this.container[0];
  }
  addCard(name) {
    const con = new ItemContainer();
    con.init(name);
    this.container.push(con);
    return con;
  }
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
  show() {
    return this.container;
  }
};
customElements.get(`menuitem-${"aa44074"}`) || customElements.define(`menuitem-${"aa44074"}`, Menuitem, { extends: "div" });

// src/html/checkbox.html
var checkbox_default = `<input type="checkbox" id="checkbox">\r
<label for="checkbox"></label>\r
<style>\r
    input[type="checkbox"] {\r
        display: none;\r
    }\r
\r
    input~label {\r
        cursor: pointer;\r
    }\r
\r
    input:checked~label:before {\r
        content: '\\2714';\r
    }\r
\r
    input~label:before {\r
        width: 12px;\r
        height: 12px;\r
        line-height: 14px;\r
        vertical-align: text-bottom;\r
        border-radius: 3px;\r
        border: 1px solid #d3d3d3;\r
        display: inline-block;\r
        text-align: center;\r
        content: ' ';\r
    }\r
</style>`;

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
  get value() {
    return this.getAttribute("value") === "true" ? true : false;
  }
  set value(v) {
    v || (v = false);
    this.setAttribute("value", v);
  }
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
  update(value) {
    Object.entries(value).forEach((d) => this[d[0]] = d[1]);
  }
};
customElements.get(`checkbox-${"aa44074"}`) || customElements.define(`checkbox-${"aa44074"}`, CheckBox);
var CheckBoxs = class extends HTMLDivElement {
  $value = [];
  checkboxs = {};
  get value() {
    return this.$value;
  }
  set value(v) {
    v.forEach((d) => {
      if (!this.$value.includes(d)) {
        if (this.checkboxs[d]) {
          this.checkboxs[d].value = true;
        } else {
          this.update(Object.keys(this.checkboxs).concat(d));
          this.checkboxs[d].value = true;
        }
      }
    });
    this.$value.forEach((d) => {
      v.includes(d) || (this.checkboxs[d].value = false);
    });
    this.$value = [...v];
  }
  update(labels) {
    labels.forEach((d) => {
      if (!this.checkboxs[d]) {
        const checkbox = new CheckBox();
        checkbox.update({ label: d });
        checkbox.addEventListener("change", () => {
          if (checkbox.value) {
            this.$value.includes(d) || this.$value.push(d);
          } else {
            const i = this.$value.indexOf(d);
            i >= 0 && this.$value.splice(i, 1);
          }
          this.dispatchEvent(new Event("change"));
        });
        this.appendChild(checkbox);
        this.checkboxs[d] = checkbox;
      }
    });
    this.$value.forEach((d) => {
      if (!labels.includes(d)) {
        this.checkboxs[d]?.remove();
        const i = this.$value.indexOf(d);
        i >= 0 && this.$value.splice(i, 1);
      }
    });
  }
};
customElements.get(`checkboxs-${"aa44074"}`) || customElements.define(`checkboxs-${"aa44074"}`, CheckBoxs, { extends: "div" });

// src/html/input.html
var input_default = '<div class="input"><input>\r\n    <ul class="input-list"></ul>\r\n</div>\r\n<style type="text/css">\r\n    .input {\r\n        width: 100%;\r\n        display: inline-block;\r\n        position: relative;\r\n        border: 0;\r\n        overflow: visible;\r\n        white-space: nowrap;\r\n        height: 24px;\r\n        line-height: 24px;\r\n        cursor: pointer;\r\n        font-size: 12px;\r\n    }\r\n\r\n    .input input {\r\n        height: 24px;\r\n        line-height: 24px;\r\n        display: inline;\r\n        user-select: auto;\r\n        text-decoration: none;\r\n        outline: none;\r\n        width: calc(100% - 10px);\r\n        background: transparent;\r\n        padding: 0 5px;\r\n        border: 1px solid #ccd0d7;\r\n        border-radius: 4px;\r\n    }\r\n\r\n    .input input:focus {\r\n        border-color: #00a1d6;\r\n    }\r\n\r\n    .input-list {\r\n        display: none;\r\n        margin: 0;\r\n        width: 100%;\r\n        padding: 0;\r\n        border-radius: 0 0 4px 4px;\r\n        max-height: 120px;\r\n        background-color: #fff;\r\n        border: 1px solid #ccd0d7;\r\n        box-shadow: 0 0 2px 0 #ccd0d7;\r\n        position: absolute;\r\n        left: -1px;\r\n        right: auto;\r\n        z-index: 2;\r\n        overflow: hidden auto;\r\n        white-space: nowrap;\r\n    }\r\n\r\n    .input:hover .input-list {\r\n        display: block;\r\n    }\r\n\r\n    .input-list-row {\r\n        padding: 0 5px;\r\n        transition: background-color .3s;\r\n        line-height: 30px;\r\n        height: 30px;\r\n        font-size: 12px;\r\n        cursor: pointer;\r\n        color: #222;\r\n        position: relative;\r\n    }\r\n\r\n    .input-list-row:hover {\r\n        background-color: #f4f5f7;\r\n        color: #6d757a;\r\n    }\r\n\r\n    .cancel {\r\n        position: absolute;\r\n        right: 0;\r\n        top: 0px;\r\n        width: 38px;\r\n        height: 28px;\r\n        background: url(//static.hdslb.com/images/base/icons.png) -461px -530px no-repeat;\r\n    }\r\n\r\n    .input-list-row:hover .cancel {\r\n        background-position: -525px -530px;\r\n    }\r\n</style>\r\n<style type="text/css">\r\n    ::-webkit-scrollbar {\r\n        width: 7px;\r\n        height: 7px;\r\n    }\r\n\r\n    ::-webkit-scrollbar-track {\r\n        border-radius: 4px;\r\n        background-color: #EEE;\r\n    }\r\n\r\n    ::-webkit-scrollbar-thumb {\r\n        border-radius: 4px;\r\n        background-color: #999;\r\n    }\r\n</style>';

// src/core/ui/utils/input.ts
var InputArea = class extends HTMLElement {
  _input;
  _ul;
  $prop = {};
  $value = "";
  $candidate = [];
  constructor() {
    super();
    const root = this.attachShadow({ mode: "closed" });
    root.innerHTML = input_default;
    this._input = root.children[0].children[0];
    this._ul = root.children[0].children[1];
    this._input.addEventListener("change", () => {
      this.$value = this.$prop.type === "file" ? this._input.files : this._input.value;
      this.dispatchEvent(new Event("change"));
    });
  }
  get prop() {
    return this.$prop;
  }
  set prop(v) {
    this.$prop = v;
    Object.entries(v).forEach((d) => this._input.setAttribute(...d));
  }
  get value() {
    return this.$value;
  }
  set value(v) {
    if (this.$value === v)
      return;
    this.$value = v || "";
    this._input.value = this.$value;
  }
  get candidate() {
    return this.$candidate;
  }
  set candidate(v) {
    this.$candidate = v;
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
  update(value) {
    Object.entries(value).forEach((d) => this[d[0]] = d[1]);
  }
};
customElements.get(`input-${"aa44074"}`) || customElements.define(`input-${"aa44074"}`, InputArea);

// src/html/select.html
var select_default = '<div class="selectmenu">\r\n    <div class="selectmenu-txt"><span></span></div>\r\n    <div class="selectmenu-arrow arrow-down"></div>\r\n    <ul class="selectmenu-list"></ul>\r\n</div>\r\n<style type="text/css">\r\n    .selectmenu {\r\n        width: 100%;\r\n        display: inline-block;\r\n        position: relative;\r\n        border: 1px solid #ccd0d7;\r\n        border-radius: 4px;\r\n        overflow: visible;\r\n        white-space: nowrap;\r\n        height: 24px;\r\n        line-height: 24px;\r\n        cursor: pointer;\r\n        font-size: 12px;\r\n    }\r\n\r\n    .selectmenu-txt {\r\n        display: inline-block;\r\n        overflow: hidden;\r\n        vertical-align: top;\r\n        text-overflow: ellipsis;\r\n        padding: 0 5px;\r\n        height: 24px;\r\n        line-height: 24px;\r\n    }\r\n\r\n    .selectmenu-arrow {\r\n        position: absolute;\r\n        background-color: transparent;\r\n        top: 0;\r\n        right: 4px;\r\n        z-index: 0;\r\n        border-radius: 4px;\r\n        width: 20px;\r\n        height: 100%;\r\n        cursor: pointer;\r\n    }\r\n\r\n    .arrow-down:before {\r\n        margin: 0 auto;\r\n        margin-top: 8px;\r\n        width: 0;\r\n        height: 0;\r\n        display: block;\r\n        border-width: 4px 4px 0;\r\n        border-style: solid;\r\n        border-color: #99a2aa transparent transparent;\r\n        position: relative;\r\n        content: "";\r\n    }\r\n\r\n    .selectmenu-list {\r\n        display: none;\r\n        margin: 0;\r\n        width: 100%;\r\n        padding: 0;\r\n        max-height: 120px;\r\n        background-color: #fff;\r\n        border: 1px solid #ccd0d7;\r\n        box-shadow: 0 0 2px 0 #ccd0d7;\r\n        position: absolute;\r\n        left: -1px;\r\n        right: auto;\r\n        z-index: 2;\r\n        overflow: hidden auto;\r\n        white-space: nowrap;\r\n    }\r\n\r\n    .selectmenu:hover .selectmenu-list {\r\n        display: block;\r\n    }\r\n\r\n    .selectmenu-list-row {\r\n        padding: 0 5px;\r\n        transition: background-color .3s;\r\n        line-height: 30px;\r\n        height: 30px;\r\n        font-size: 12px;\r\n        cursor: pointer;\r\n        color: #222;\r\n    }\r\n\r\n    .selectmenu-list-row:hover {\r\n        background-color: #f4f5f7;\r\n        color: #6d757a;\r\n    }\r\n</style>\r\n<style type="text/css">\r\n    ::-webkit-scrollbar {\r\n        width: 7px;\r\n        height: 7px;\r\n    }\r\n\r\n    ::-webkit-scrollbar-track {\r\n        border-radius: 4px;\r\n        background-color: #EEE;\r\n    }\r\n\r\n    ::-webkit-scrollbar-thumb {\r\n        border-radius: 4px;\r\n        background-color: #999;\r\n    }\r\n</style>';

// src/core/ui/utils/select.ts
var SelectMenu = class extends HTMLElement {
  _text;
  _list;
  $value = "";
  $candidate = [];
  $styles = {};
  constructor() {
    super();
    const root = this.attachShadow({ mode: "closed" });
    root.innerHTML = select_default;
    this._text = root.children[0].children[0].children[0];
    this._list = root.children[0].children[2];
  }
  get value() {
    return this.$value;
  }
  set value(v) {
    if (this.$value === v)
      return;
    this.$value = v || "";
    this._text.textContent = v || "";
    v && this.$styles[v] && this._text.setAttribute("style", this.$styles[v]);
  }
  get candidate() {
    return this.$candidate;
  }
  set candidate(v) {
    this.$candidate = v;
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
      this.$styles[d] && span.setAttribute("style", this.$styles[d]);
      li.appendChild(span);
      return li;
    }));
  }
  get styles() {
    return this.$styles;
  }
  set styles(v) {
    this.$styles = v;
    this.candidate = this.candidate;
  }
  update(value) {
    Object.entries(value).forEach((d) => this[d[0]] = d[1]);
  }
};
customElements.get(`select-${"aa44074"}`) || customElements.define(`select-${"aa44074"}`, SelectMenu);

// src/html/slider.html
var slider_default = '<div class="block">\r\n    <div class="slider">\r\n        <div class="slider-tracker-wrp">\r\n            <div class="slider-tracker">\r\n                <div class="slider-handle">\r\n                    <div class="slider-hint"></div>\r\n                </div>\r\n                <div class="slider-progress"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style type="text/css">\r\n    .block {\r\n        vertical-align: top;\r\n        display: inline-block;\r\n        width: 100%;\r\n    }\r\n\r\n    .slider {\r\n        width: 100%;\r\n        height: 13px;\r\n        clear: both;\r\n        position: relative;\r\n    }\r\n\r\n    .slider-tracker-wrp {\r\n        position: relative;\r\n        width: 100%;\r\n        height: 100%;\r\n        cursor: pointer;\r\n    }\r\n\r\n    .slider-tracker {\r\n        position: absolute;\r\n        width: 100%;\r\n        height: 6px;\r\n        left: 0;\r\n        border-radius: 4px;\r\n        top: 50%;\r\n        margin-top: -3px;\r\n        background-color: #e5e9ef;\r\n    }\r\n\r\n    .slider-handle {\r\n        position: absolute;\r\n        top: -4px;\r\n        height: 14px;\r\n        width: 14px;\r\n        border-radius: 7px;\r\n        cursor: pointer;\r\n        z-index: 1;\r\n        margin-left: -7px;\r\n        box-shadow: 0 0 3px #017cc3;\r\n        background-color: #fff;\r\n        transition: box-shadow .3s;\r\n    }\r\n\r\n    .slider-handle:hover {\r\n        box-shadow: 0 0 5px #017cc3;\r\n    }\r\n\r\n    .slider-hint {\r\n        display: none;\r\n        position: absolute;\r\n        top: -21px;\r\n        white-space: nowrap;\r\n        border-radius: 4px;\r\n        background-color: hsla(0, 0%, 100%, .8);\r\n        padding: 0 3px;\r\n        border: 1px solid #fafafa;\r\n        z-index: 1;\r\n        transform: translateX(-25%);\r\n        user-select: none;\r\n    }\r\n\r\n    .slider-progress {\r\n        width: 0;\r\n        height: 100%;\r\n        border-radius: 4px;\r\n        background-color: #00a1d6;\r\n        position: relative;\r\n    }\r\n</style>';

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
  $value = 0;
  $min = 0;
  $max = 100;
  $precision = 100;
  $hint = true;
  $solid = false;
  $vertical = false;
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
      const offsetX = this.$vertical ? pageY - offset(this._wrp).top - 7 : pageX - offset(this._wrp).left - 7;
      const allX = this._wrp.offsetWidth - 14;
      const pv = (0 > offsetX ? 0 : offsetX > allX ? allX : offsetX) / allX;
      this.value = (this.$max - this.$min) * Math.round(pv * this.$precision) / this.$precision + this.$min;
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
      const pv = (this.$value - this.$min) / (this.$max - this.$min);
      this._handle.style.cssText = `left: ${(pv * (this._wrp.offsetWidth - 14) + 7) / this._wrp.offsetWidth * 100}%;`;
      this._progress.style.cssText = `width: ${pv * 100}%;`;
      if (this.$hint) {
        this._hinter.textContent = this.$value;
        if (this._hinter.style.display !== "block")
          this._hinter.style.display = "block";
        if (this.$solid)
          return;
        clearTimeout(nHint);
        nHint = setTimeout(() => this._hinter.style.display = "", 300);
      }
      ;
    };
  }
  get value() {
    return this.$value;
  }
  set value(v) {
    if (this.$vertical)
      v = this.$max - v + this.$min;
    v = (this.$max - this.$min) * Math.round((v - this.$min) / (this.$max - this.$min) * this.$precision) / this.$precision + this.$min;
    if (v === this.$value)
      return;
    this.$value = v;
    this.showChange();
  }
  get min() {
    return this.$min;
  }
  set min(v) {
    if (v === this.$min || v >= this.$max)
      return;
    this.$min = v;
    if (v > this.$value)
      this.value = v;
    this.showChange();
  }
  get max() {
    return this.$max;
  }
  set max(v) {
    if (v === this.$max || v <= this.$min)
      return;
    this.$max = v;
    if (v < this.$value)
      this.value = v;
    this.showChange();
  }
  get precision() {
    return this.$precision;
  }
  set precision(v) {
    if (v === this.$precision)
      return;
    this.$precision = v;
    this.value = this.$value;
  }
  get hint() {
    return this.$hint;
  }
  set hint(v) {
    if (v === this.$hint)
      return;
    this.$hint = v;
  }
  get solid() {
    return this.$solid;
  }
  set solid(v) {
    if (v === this.$solid)
      return;
    this.$solid = v;
    this.showChange();
  }
  get vertical() {
    return this.$vertical;
  }
  set vertical(v) {
    if (v === this.$vertical)
      return;
    this.$vertical = v;
    this.style.transform = v ? "rotate(-90deg)" : "";
  }
  connectedCallback() {
    this.showChange();
  }
  adoptedCallback() {
    this.showChange();
  }
  update(value) {
    Object.entries(value).forEach((d) => this[d[0]] = d[1]);
  }
};
customElements.get(`slider-${"aa44074"}`) || customElements.define(`slider-${"aa44074"}`, SliderBlock);

// src/html/switch.html
var switch_default = '<div class="switch">\r\n    <span class="bar"></span>\r\n    <span class="knob">\r\n        <i class="circle"></i>\r\n    </span>\r\n</div>\r\n<style type="text/css">\r\n    .switch {\r\n        cursor: pointer;\r\n        display: block;\r\n        min-width: 34px;\r\n        outline: none;\r\n        position: relative;\r\n        width: 34px;\r\n    }\r\n\r\n    .bar {\r\n        background-color: rgb(189, 193, 198);\r\n        border-radius: 8px;\r\n        height: 12px;\r\n        left: 3px;\r\n        position: absolute;\r\n        top: 2px;\r\n        transition: background-color linear 80ms;\r\n        width: 28px;\r\n        z-index: 0;\r\n    }\r\n\r\n    .bar[checked] {\r\n        background-color: rgb(26, 115, 232);\r\n        opacity: 0.5;\r\n    }\r\n\r\n    .bar:active {\r\n        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);\r\n    }\r\n\r\n    .knob {\r\n        background-color: #fff;\r\n        border-radius: 50%;\r\n        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 40%);\r\n        display: block;\r\n        height: 16px;\r\n        position: relative;\r\n        transition: transform linear 80ms, background-color linear 80ms;\r\n        width: 16px;\r\n        z-index: 1;\r\n    }\r\n\r\n    .knob[checked] {\r\n        background-color: rgb(26, 115, 232);\r\n        transform: translate3d(18px, 0, 0);\r\n    }\r\n\r\n    .knob:active {\r\n        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);\r\n    }\r\n\r\n    .knob i {\r\n        color: rgba(128, 134, 139, 15%);\r\n        height: 40px;\r\n        left: -12px;\r\n        pointer-events: none;\r\n        top: -12px;\r\n        transition: color linear 80ms;\r\n        width: 40px;\r\n        border-radius: 50%;\r\n        bottom: 0;\r\n        display: block;\r\n        overflow: hidden;\r\n        position: absolute;\r\n        right: 0;\r\n        transform: translate3d(0, 0, 0);\r\n    }\r\n\r\n    .knob i[checked] {\r\n        color: rgb(26, 115, 232);\r\n    }\r\n\r\n    .knob i:active {\r\n        box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);\r\n    }\r\n</style>';

// src/core/ui/utils/switch.ts
var SwitchButton = class extends HTMLElement {
  _bar;
  _knob;
  _circle;
  $value = false;
  constructor() {
    super();
    const root = this.attachShadow({ mode: "closed" });
    root.innerHTML = switch_default;
    this._bar = root.children[0].children[0];
    this._knob = root.children[0].children[1];
    this._circle = root.children[0].children[1].children[0];
    root.children[0].addEventListener("click", (e) => {
      this.value = !this.$value;
      e.stopPropagation();
      this.dispatchEvent(new Event("change"));
    });
  }
  get value() {
    return this.$value;
  }
  set value(v) {
    if (this.$value === v)
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
    this.$value = v;
  }
  update(value) {
    value === void 0 || (this.value = value);
    return this;
  }
};
customElements.get(`switch-${"aa44074"}`) || customElements.define(`switch-${"aa44074"}`, SwitchButton);

// src/core/ui.ts
var Menus = {
  common: ["通用", svg.wrench],
  rewrite: ["重写", svg.note],
  restore: ["修复", svg.stethoscope],
  player: ["播放", svg.play],
  style: ["样式", svg.palette],
  download: ["下载", svg.download]
};
var UI = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    this.initMenu();
    this.initSettings();
    poll(() => document.readyState === "complete", () => {
      this.entry.type = this.BLOD.status.uiEntryType;
      document.body.appendChild(this.entry);
      this.updateCheck();
    }, 1e3, 0);
    this.entry.addEventListener("click", (e) => {
      this.show();
      e.stopPropagation();
    });
  }
  entry = new BilioldEntry();
  interface = new BiliOldInterface();
  menuitem = {};
  settingItem = {};
  async updateCheck() {
    if (this.BLOD.status.bilibiliplayer) {
      const version = await this.BLOD.GM.getValue("version");
      if (version !== this.BLOD.version) {
        this.BLOD.loadplayer(true);
      }
    }
  }
  initMenu() {
    Object.entries(Menus).forEach((d) => {
      const menu = new Menuitem();
      this.menuitem[d[0]] = menu;
      menu.init(d[1][0], d[1][1]);
      this.interface.addMenu(menu);
    });
  }
  initSettings() {
    this.initSettingCommon();
    this.initSettingRewrite();
    this.initSettingStyle();
    this.initSettingRestore();
    this.initSettingPlayer();
    this.initSettingDownload();
  }
  initSettingCommon() {
    this.menuitem.common.addSetting([
      this.switch("development", "开发者模式", "暴露调试接口到控制台", svg.warn, (v) => {
        if (v) {
          propertyHook(window, "BLOD", this.BLOD);
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
            callback: () => this.BLOD.user.restoreUserStatus()
          },
          {
            text: "导出",
            callback: () => this.BLOD.user.outputUserStatus()
          },
          {
            text: "导入",
            callback: () => this.BLOD.user.inputUserStatus()
          }
        ]);
      }, "备份/恢复", "管理", svg.blind)
    ]);
    this.menuitem.common.addCard("toastr");
    this.menuitem.common.addSetting([
      this.switch("toast.disabled", "禁用", '<a href="https://github.com/CodeSeven/toastr" target="_blank">toastr</a>', void 0, (v) => this.BLOD.toast.disabled = v),
      this.switch("toast.rtl", "镜像", "左右翻转", void 0, (v) => this.BLOD.toast.rtl = v),
      this.select("toast.position", "位置", {
        candidate: ["top-left", "top-center", "top-right", "top-full-width", "bottom-left", "bottom-right", "bottom-center", "bottom-full-width"]
      }, "相对屏幕", void 0, (v) => this.BLOD.toast.position = v),
      this.slider("toast.delay", "时长", {
        min: 2,
        max: 60,
        precision: 58
      }, "单位：/秒", void 0, (v) => this.BLOD.toast.delay = v),
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
          this.BLOD.toast.toast(this.BLOD.status.toast.delay, this.BLOD.status.toast.type, v);
        } catch (e) {
          this.BLOD.toast.error("非常抱歉！发生了错误", e);
        }
      }, "请输入一句话~")
    ], 1);
    this.menuitem.common.addCard("账户授权");
    this.menuitem.common.addSetting([
      this.input("accessKey.token", "token", {
        prop: { type: "text", readonly: "readonly" }
      }, "access_key", void 0, void 0, "鉴权。效果等同于网页端的cookie，B站服务器用以识别您的登录身份。如果启用了【解除区域限制】功能并选择自定义服务器，请务必确认代理服务器的可信度！"),
      this.input("accessKey.dateStr", "授权日期", {
        prop: { type: "text", readonly: "readonly" }
      }, "有效期一般为一个月", void 0, void 0, "脚本不会代为检查鉴权是否失效，请失效时自行重新授权。"),
      this.button("accessKey.action", "进行授权", () => {
        new AccessKey(this.BLOD);
      }, "授权脚本使用登录鉴权", "授权", svg.warn)
    ], 2);
    if (true) {
      this.menuitem.common.addSetting([
        this.switch("bilibiliplayer", "重构播放器", "修复及增强", svg.play, (v) => {
          if (v) {
            this.updateCheck();
          }
        }, "旧版播放器已于 2019-10-31T07:38:36.004Z 失去官方维护，为了旧版播放器长期可持续维护，我们使用typescript完全重构了旧版播放器。修复了旧版播放器出现异常或失效的功能（如无法获取90分钟以后的弹幕问题），移植了一些B站后续推出的功能（如互动视频、全景视频、杜比视界、杜比全景声、AV1编码支持和DRM支持等）。能力有限无法做到100%复刻，如果您想体验原生的旧版播放器，可以禁用本功能。同时由于项目托管于Github，国内部分网络环境可能访问不畅，初次启动播放器可能耗时较久，加载失败后也会回滚原生播放器。如果您的网络环境始终无法正常加载，也请禁用本功能或者前往反馈。")
      ]);
    }
  }
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
  initSettingStyle() {
    this.menuitem.style.addSetting([
      this.switch("header", "恢复旧版顶栏", "替换所有B站页面中的顶栏为旧版"),
      this.switch("comment", "恢复评论翻页", "替换瀑布流评论区"),
      this.switch("staff", "合作UP主", "联合投稿显示合作UP主"),
      this.switch("bangumiEplist", "保留bangumi分P", "牺牲特殊背景图", void 0, void 0, "旧版bangumi遇到有特殊背景图的视频时，会隐藏播放器下方的分集选择界面，二者不可得兼。"),
      this.switch("jointime", "注册时间", "个人空间显示账户注册时间"),
      this.switch("history", "纯视频历史", "过滤历史记录页的非视频部分"),
      this.switch("liveRecord", "录屏动态", "允许动态页显示直播录屏"),
      this.switch("commentJumpUrlTitle", "评论超链接标题", "还原为链接或短链接", void 0, void 0, "直接显示链接标题固然方便，但有些时候还是直接显示链接合适。"),
      this.switch("like", "添加点赞功能", "不支持一键三连")
    ]);
  }
  initSettingRestore() {
    this.menuitem.restore.addSetting([
      this.switch("lostVideo", "失效视频", "尝试获取失效视频信息"),
      this.switch("disableSleepChcek", "禁用直播间挂机检测", "就喜欢挂后台听个响不行吗！")
    ]);
  }
  initSettingPlayer() {
    this.menuitem.player.addSetting([
      this.switch("webRTC", "WebRTC", "<strong>关闭</strong>以禁用p2p共享带宽", void 0, void 0, "B站使用【WebRTC】实现p2p共享，等同于将您的设备变成了B站的一个视频服务器节点，别人观看相同的视频或直播便可以从您的设备取流而不必访问B站固有的服务器。脚本默认<strong>关闭</strong>了此功能，以减轻小水管的带宽压力，如果您的带宽允许，还是推荐开启，人人为我，我为人人。bilibili~乾杯 - ( ゜-゜)つロ！"),
      this.switch("elecShow", "充电鸣谢", "允许视频结尾的充电鸣谢"),
      this.switch("videoDisableAA", "禁用视频渲染抗锯齿", '详见<a href="https://github.com/MotooriKashin/Bilibili-Old/issues/292" target="_blank">#292</a>说明'),
      this.switch("ugcSection", "视频合集", "以播单形式呈现")
    ]);
    this.menuitem.player.addCard("自动化操作");
    this.menuitem.player.addSetting([
      this.switch("automate.danmakuFirst", "展开弹幕列表", "而不是推荐视频"),
      this.switch("automate.showBofqi", "滚动到播放器", "载入视频时"),
      this.switch("automate.screenWide", "宽屏模式", "隐藏播放器右侧面板", void 0, (v) => v && (this.BLOD.status.automate.webFullScreen = false)),
      this.switch("automate.noDanmaku", "无弹幕模式", "默认关闭弹幕"),
      this.switch("automate.autoPlay", "自动播放", "播放器初始化完成时"),
      this.switch("automate.webFullScreen", "网页全屏模式", "载入视频时", void 0, (v) => v && (this.BLOD.status.automate.screenWide = false)),
      this.switch("automate.videospeed", "记忆播放速率", "永久继承播放速率设定", void 0, void 0, "默认的记忆播放速率记忆仅同一个网页标签页有效，开启后将代为记忆固定下来。")
    ], 1);
    this.menuitem.player.addCard("限制视频");
    this.menuitem.player.addSetting([
      this.switch("videoLimit.status", "解除播放限制", "解除区域/APP限制"),
      this.select("videoLimit.server", "代理服务器模式", {
        candidate: ["内置", "自定义"]
      }, "<strong>自定义</strong>模式须要填写下面的服务器", void 0, (v) => {
        if (v === "自定义") {
          if (!this.BLOD.status.videoLimit.cn && !this.BLOD.status.videoLimit.hk && !this.BLOD.status.videoLimit.tw) {
            this.BLOD.toast.warning("请至少填选以下代理服务器中的一下再选择！", "服务器请自行搭建或参考【公共反代服务器】");
            this.BLOD.status.videoLimit.server = "内置";
            alert('<a href="https://github.com/yujincheng08/BiliRoaming/wiki/%E5%85%AC%E5%85%B1%E8%A7%A3%E6%9E%90%E6%9C%8D%E5%8A%A1%E5%99%A8" target="_blank">https://github.com/yujincheng08/BiliRoaming/</a>', "公共反代服务器");
          } else if (!this.BLOD.status.accessKey.token) {
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
      }, "泰国（东南亚）限定视频反代服务器"),
      this.input("videoLimit.tw", "台湾", {
        prop: { type: "url", placeholder: "www.example.com" }
      }, "台湾限定视频反代服务器"),
      this.input("videoLimit.hk", "港澳", {
        prop: { type: "url", placeholder: "www.example.com" }
      }, "香港澳门限定视频反代服务器"),
      this.input("videoLimit.cn", "大陆", {
        prop: { type: "url", placeholder: "www.example.com" }
      }, "大陆限定视频反代服务器")
    ], 2);
    this.menuitem.player.addCard("替换 UPOS 服务器");
    const upos = Object.keys(UPOS2);
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
      }, "针对下载功能", void 0, void 0, "一般视频不需要替换，除非屡屡下载403。若还是403请关闭或者换一个。")
    ], 3);
  }
  initSettingDownload() {
    this.menuitem.download.addSetting([
      this.button("download", "下载当前视频", () => {
        this.BLOD.download.default();
      }, "呼出下载面板", "下载", void 0, "根据当前设置下载当前网页（顶层）的视频，在页面底部列出所有可用下载源。仅在视频播放页可用。"),
      this.chockboxs("downloadType", "请求的文件类型", ["mp4", "dash", "flv"], "视频封装格式", void 0, () => this.BLOD.download.destory(), "勾选视频的封装类型，具体能不能获取到两说。封装类型≠编码类型：①mp4封装，视频编码avc+音频编码aac，画质上限1080P。②flv封装，编码同mp4，但可能切分成多个分段，须手动合并。③dash，未封装的视频轨和音频轨，以编码格式分类，aac为音频轨（含flac、杜比全景声），avc、hev和av1为视频轨（任选其一即可），须下载音视频轨各一条后手动封装为一个视频文件。另外【解除区域限制】功能获取到的下载源不受本项限制。"),
      this.switch("TVresource", "请求tv端视频源", "无水印", void 0, (e) => {
        e && alert("下载TV源必须将【referer】置空，否则会403（无权访问）！另外浏览器不支持配置UA和referer，请更换【下载方式】！", "403警告", [
          {
            text: "置空referer",
            callback: () => this.BLOD.status.referer = ""
          }
        ]);
        this.BLOD.download.destory();
      }, "请求TV端下载源，唯一的优势是可能无Bilibili水印。注意：①B站tv端大会员不通用，所以可能无法获取到大会员视频或画质。②需要进行【账户授权】，否则只能以游客身份获取下载数据。③TV源要求特定的UA且不能发送referer，基本无法通过浏览器直接下载（403无权访问），请选择其他下载工具。④mp4封装的并非tv源。"),
      this.select("downloadQn", "画质", {
        candidate: ["0", "15", "16", "32", "48", "64", "74", "80", "112", "116", "120", "125", "126", "127"]
      }, "flv限定", void 0, () => this.BLOD.download.destory(), "画质参数，只针对flv封装。mp4封装没得选，dash则由于特性会一次性提供所有画质选项。"),
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
            callback: () => this.BLOD.status.referer = ""
          },
          {
            text: "取消勾选tv源",
            callback: () => this.BLOD.status.TVresource = false
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
        const toast = this.BLOD.toast.toast(0, "info", ...data);
        new Aria2().getVersion().then((d) => {
          toast.type = "success";
          data.push(`-------aria2 v${d.version}-------`, ...d.enabledFeatures);
          toast.data = data;
        }).catch((e) => {
          toast.type = "error";
          data.push("RPC链接失败 ಥ_ಥ", e);
          debug.error("RPC链接失败 ಥ_ಥ", e);
          toast.data = data;
        }).finally(() => {
          toast.delay = 4;
        });
      }, "获取aria2信息", "ping", void 0, "请确定正确配置并启用了aria2的RPC服务器。")
    ], 1);
    this.menuitem.download.addCard("ef2 相关");
    this.menuitem.download.addSetting([
      this.switch("ef2.delay", "稍后下载", "添加到IDM下载队列但不开始", void 0, void 0, "要开始时请手动到IDM队列里点击开始。本项可以用来批量下载而不弹出多个窗口。注意：B站视频源使用的是临时链接，过期后无法访问，请及时下载或清理。"),
      this.switch("ef2.silence", "静默下载", "跳过IDM确认对话框", void 0, void 0, "默认情况下IDM会弹窗询问是否确认下载，在该确认框中可以调整保存目录和文件名等操作。启用本项以跳过该确认框。")
    ], 2);
  }
  switch(id, label, sub, svg2, callback, desc) {
    const item = new SettingItem();
    const button = new SwitchButton();
    const arr2 = id.split(".");
    let looping = false;
    item.init(arr2.join(""), label, sub, svg2);
    button.update(this.BLOD.getStatus(id));
    button.addEventListener("change", () => {
      looping = true;
      this.BLOD.setStatus(id, button.value);
      callback && callback(button.value);
    });
    this.BLOD.bindStatusChange(arr2.shift(), (v) => {
      looping || button.update(this.BLOD.getStatus(arr2.join("."), v));
      looping = false;
    });
    item.value(button);
    this.settingItem[id] = item;
    desc && new Desc().value(label, desc, item);
    return item;
  }
  select(id, label, value, sub, svg2, callback, desc) {
    const item = new SettingItem();
    const select = new SelectMenu();
    const arr2 = id.split(".");
    let looping = false;
    item.init(arr2.join(""), label, sub, svg2);
    value.value = this.BLOD.getStatus(id);
    select.update(value);
    select.addEventListener("change", () => {
      looping = true;
      this.BLOD.setStatus(id, select.value);
      callback && callback(select.value);
    });
    this.BLOD.bindStatusChange(arr2.shift(), (v) => {
      looping || (select.value = this.BLOD.getStatus(arr2.join("."), v));
      looping = false;
    });
    item.value(select);
    this.settingItem[id] = item;
    desc && new Desc().value(label, desc, item);
    return item;
  }
  slider(id, label, value, sub, svg2, callback, desc) {
    const item = new SettingItem();
    const slider = new SliderBlock();
    const arr2 = id.split(".");
    let looping = false;
    item.init(arr2.join(""), label, sub, svg2);
    value.value = this.BLOD.getStatus(id);
    slider.update(value);
    slider.addEventListener("change", () => {
      looping = true;
      this.BLOD.setStatus(id, slider.value);
      callback && callback(slider.value);
    });
    this.BLOD.bindStatusChange(arr2.shift(), (v) => {
      looping || (slider.value = this.BLOD.getStatus(arr2.join("."), v));
      looping = false;
    });
    item.value(slider);
    this.settingItem[id] = item;
    desc && new Desc().value(label, desc, item);
    return item;
  }
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
  input(id, label, value, sub, svg2, callback, desc) {
    const item = new SettingItem();
    const input = new InputArea();
    const arr2 = id.split(".");
    let looping = false;
    item.init(arr2.join(""), label, sub, svg2);
    value.value = this.BLOD.getStatus(id);
    input.update(value);
    input.addEventListener("change", () => {
      looping = true;
      this.BLOD.setStatus(id, input.value);
      callback && callback(input.value);
    });
    this.BLOD.bindStatusChange(arr2.shift(), (v) => {
      looping || (input.value = this.BLOD.getStatus(arr2.join("."), v));
      looping = false;
    });
    item.value(input);
    this.settingItem[id] = item;
    desc && new Desc().value(label, desc, item);
    return item;
  }
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
  chockboxs(id, label, values, sub, svg2, callback, desc) {
    const item = new SettingItem();
    const checkboxs = new CheckBoxs();
    const arr2 = id.split(".");
    let looping = false;
    item.init(arr2.join(""), label, sub, svg2);
    checkboxs.update(values);
    checkboxs.value = Array.from(this.BLOD.getStatus(id));
    checkboxs.addEventListener("change", () => {
      looping = true;
      this.BLOD.setStatus(id, checkboxs.value);
      callback && callback(checkboxs.value);
    });
    this.BLOD.bindStatusChange(arr2.shift(), (v) => {
      looping || (checkboxs.value = this.BLOD.getStatus(arr2.join("."), v));
      looping = false;
    });
    item.value(checkboxs);
    this.settingItem[id] = item;
    desc && new Desc().value(label, desc, item);
    return item;
  }
  show(id) {
    this.interface.show();
    if (id && this.settingItem[id]) {
      this.settingItem[id].dispatchEvent(new Event("show"));
    } else {
      this.menuitem.common.click();
    }
  }
};

// src/core/storage.ts
var LocalStorage = class {
  static clear() {
    localStorage.clear();
  }
  static getItem(key) {
    return toObject(localStorage.getItem(key));
  }
  static keys() {
    return Object.keys(localStorage);
  }
  static removeItem(key) {
    localStorage.removeItem(key);
  }
  static setItem(key, value) {
    localStorage.setItem(key, toString(value));
  }
};
var SessionStorage = class {
  static clear() {
    sessionStorage.clear();
  }
  static getItem(key) {
    return toObject(sessionStorage.getItem(key));
  }
  static keys() {
    return Object.keys(sessionStorage);
  }
  static removeItem(key) {
    sessionStorage.removeItem(key);
  }
  static setItem(key, value) {
    sessionStorage.setItem(key, toString(value));
  }
};

// src/core/automate.ts
var Automate = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    this.playerSettings();
    this.danmakuFirst();
    switchVideo(() => {
      this.showBofqi();
      this.webFullScreen();
      this.videoDisableAA();
    });
    this.videospeed();
  }
  playerSettings() {
    const local = LocalStorage.getItem("bilibili_player_settings");
    if (local) {
      this.BLOD.GM.setValue("bilibili_player_settings", local);
    } else {
      this.BLOD.GM.getValue("bilibili_player_settings").then((d) => {
        d && LocalStorage.setItem("bilibili_player_settings", d);
      });
    }
  }
  danmakuFirst() {
    this.BLOD.status.automate.danmakuFirst && SessionStorage.setItem("player_last_filter_tab_info", 4);
  }
  showBofqi() {
    const str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
    this.BLOD.status.automate.showBofqi && setTimeout(() => {
      const node = str.reduce((s, d) => {
        s = s || document.querySelector(d);
        return s;
      }, document.querySelector("#__bofqi"));
      node && node.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);
  }
  webFullScreen() {
    this.BLOD.status.automate.webFullScreen && poll(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => document.querySelector(".bilibili-player-video-web-fullscreen").click());
  }
  videospeed() {
    if (this.BLOD.status.automate.videospeed) {
      this.BLOD.GM.getValue("videospeed").then((videospeed) => {
        if (videospeed) {
          let setting = SessionStorage.getItem("bilibili_player_settings");
          setting ? setting.video_status ? setting.video_status.videospeed = videospeed : setting.video_status = { videospeed } : setting = { video_status: { videospeed } };
          SessionStorage.setItem("bilibili_player_settings", setting);
        }
      });
      switchVideo(() => {
        poll(() => document.querySelector("#bofqi")?.querySelector("video"), (d) => {
          d.addEventListener("ratechange", (e) => {
            this.BLOD.GM.setValue("videospeed", e.target.playbackRate || 1);
          });
        });
      });
    }
  }
  videoDisableAA() {
    this.BLOD.status.videoDisableAA && poll(() => document.querySelector("#bilibiliPlayer .bilibili-player-video video"), (d) => d.style.filter += "contrast(1)");
  }
};

// src/core/report.ts
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

// src/page/live.ts
var PageLive = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    BLOD2.userLoadedCallback((status) => {
      status.disableSleepChcek && this.disAbleSleepCheck();
      status.disableReport && new StatisObserver();
    });
    this.urlClean();
  }
  sleep = false;
  urlClean() {
    this.BLOD.urlCleaner.paramsSet.add("broadcast_type");
    this.BLOD.urlCleaner.paramsSet.add("is_room_feed");
  }
  disAbleSleepCheck() {
    const setInterval2 = self.setInterval;
    self.setInterval = (...args) => {
      if (args[0].toString().includes("triggerSleepCallback")) {
        if (!this.sleep) {
          this.sleep = true;
          this.BLOD.toast.warning("成功阻止直播间挂机检测！");
        }
        return Number.MIN_VALUE;
      }
      return setInterval2.call(self, ...args);
    };
  }
};

// src/core/video-info.ts
var VideoInfo = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
  }
  cids = {};
  stats = {};
  get metadata() {
    const cid = this.BLOD.cid;
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
    const aid = this.BLOD.aid;
    return aid ? this.stats[aid] : void 0;
  }
  callbacks = [];
  bindChange(callback) {
    const id = this.callbacks.push(callback);
    return () => {
      delete this.callbacks[id - 1];
    };
  }
  timer;
  emitChange() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.callbacks.forEach((d) => d(this)), 100);
  }
  aidDatail(data) {
    const album = data.title;
    const artist = data.owner.name;
    const pic = data.pic;
    data.pages ? data.pages.forEach((d, i) => {
      this.cids[d.cid] = {
        album,
        artist,
        title: d.part || `#${i + 1}`,
        artwork: [{ src: pic }]
      };
    }) : this.cids[data.cid] = {
      album,
      artist,
      title: `#1`,
      artwork: [{ src: pic }]
    };
    this.stats[data.aid] = data.stat;
    this.emitChange();
  }
  aidInfo(data) {
    const album = data.title;
    const artist = data.upper.name;
    const pic = data.cover;
    data.pages ? data.pages.forEach((d, i) => {
      this.cids[d.id] = {
        album,
        artist,
        title: d.title || `#${i + 1}`,
        artwork: [{ src: pic }]
      };
    }) : this.cids[data.id] = {
      album,
      artist,
      title: `#1`,
      artwork: [{ src: pic }]
    };
  }
  bangumiSeason(data) {
    const album = data.title || data.jp_title;
    const artist = data.actors || data.staff || data.up_info?.name;
    const pic = data.cover;
    const bkg_cover = data.bkg_cover;
    this.bangumiEpisode(data.episodes, album, artist, pic, bkg_cover);
    this.emitChange();
  }
  bangumiEpisode(data, album, artist, pic, bkg_cover) {
    data.forEach((d) => {
      const artwork = [{ src: d.cover }, { src: pic }];
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
    const pic = data.cover;
    data.list.forEach((d) => {
      const title = d.title;
      const cover = d.pic;
      const artist = d.owner.name;
      d.pages.forEach((d2, i) => {
        this.cids[d2.cid] = {
          album,
          artist,
          title: title + `(${d2.part})`,
          artwork: [{ src: pic }, { src: cover }]
        };
      });
    });
    this.emitChange();
  }
  mediaSession() {
    if (this.metadata) {
      navigator.mediaSession.metadata = new MediaMetadata({ ...this.metadata });
    }
  }
};

// src/io/api-playurl-interface.ts
var ApiPlayurlInterface = class extends ApiSign {
  fetch;
  constructor(data, pgc = false) {
    super(pgc ? URLS.PLAYURL_BANGUMI : URLS.PLAYURL_INTERFACE, "YvirImLGlLANCLvM");
    data = Object.assign({
      otype: "json",
      qn: data.quality,
      type: "",
      fnver,
      fnval
    }, data, pgc ? { module: "bangumi", season_type: 1 } : {});
    this.fetch = fetch(this.sign(data), { credentials: "include" });
  }
  async getData() {
    const response = await this.fetch;
    return await response.json();
  }
};

// src/io/api-playurl-intl.ts
var ApiPlayurlIntl = class extends ApiSign {
  constructor(data, fetch2 = self.fetch, dash = true, pgc = false) {
    super(pgc ? URLS.INTL_OGV_PLAYURL : URLS.INTL_PLAYURL, "bb3101000e232e27");
    this.pgc = pgc;
    data = Object.assign({
      device: "android",
      force_host: 1,
      mobi_app: "android_i",
      qn,
      platform: "android_i",
      fourk: 1,
      build: 2100110,
      otype: "json"
    }, data, dash ? { fnval, fnver } : {});
    this.fetch = fetch2(this.sign(data));
  }
  fetch;
  async getData() {
    const response = await this.fetch;
    const json = await response.json();
    if (this.pgc) {
      return jsonCheck(json);
    }
    return jsonCheck(json).data;
  }
};

// src/io/api-playurl-tv.ts
var ApiPlayurlTv = class extends ApiSign {
  fetch;
  constructor(data, dash = true, pgc = false) {
    super(pgc ? URLS.PGC_PLAYURL_TV : URLS.UGC_PLAYURL_TV, "4409e2ce8ffd12b8");
    data = Object.assign({
      qn,
      fourk: 1,
      otype: "json",
      platform: "android",
      mobi_app: "android_tv_yst",
      build: 102801
    }, data, dash ? { fnval, fnver } : {});
    this.fetch = fetch(this.sign(data));
  }
  async getData() {
    const response = await this.fetch;
    const json = await response.json();
    return jsonCheck(json);
  }
};

// src/io/api-playurlproj.ts
var ApiPlayurlProj = class extends ApiSign {
  fetch;
  constructor(data, pgc = false) {
    super(pgc ? URLS.PGC_PLAYURL_PROJ : URLS.PLAYURL_PROJ, "bb3101000e232e27");
    data = Object.assign({
      build: "2040100",
      device: "android",
      mobi_app: "android_i",
      otype: "json",
      platform: "android_i",
      qn
    }, data);
    pgc && (data.module = "bangumi");
    this.fetch = fetch(this.sign(data));
  }
  async getData() {
    const response = await this.fetch;
    return await response.json();
  }
};

// src/core/download/ef2.ts
var Ef2 = class {
  constructor(userAgent, referer, dir, delay = false, silence = false) {
    this.userAgent = userAgent;
    this.referer = referer;
    this.dir = dir;
    this.delay = delay;
    this.silence = silence;
  }
  sendLinkToIDM(data) {
    this.rebuildData(data);
    const ef2str = Ef2.encode(data);
    const a = document.createElement("a");
    a.href = ef2str;
    a.click();
    return ef2str;
  }
  file(data, fileName) {
    this.rebuildData(data);
    return Ef2.file([data], fileName);
  }
  rebuildData(data) {
    this.userAgent && !data.userAgent && (data.userAgent = this.userAgent);
    this.referer && !data.referer && (data.referer = this.referer);
    this.dir && !data.dir && (data.dir = this.dir);
    this.delay && !data.delay && (data.delay = this.delay);
    this.silence && !data.silence && (data.silence = this.silence);
  }
  static file(data, fileName) {
    const result = [];
    data.forEach((d) => {
      const arr2 = [];
      Object.entries(d).forEach((d2) => {
        switch (d2[0]) {
          case "cookie":
            arr2.push(`cookie: ${d2[1]}`);
            break;
          case "delay":
            break;
          case "dir":
            d2[1] = d2[1].replace(/\//, "\\");
            d2[1].endsWith("\\") && (d2[1] = d2[1].slice(0, -1));
            arr2.push(`filepath: ${d2[1]}`);
            break;
          case "out":
            arr2.push(`filename: ${d2[1]}`);
            break;
          case "password":
            arr2.push(`password: ${d2[1]}`);
            break;
          case "body":
            arr2.push(`postdata: ${d2[1]}`);
            break;
          case "referer":
            arr2.push(`referer: ${d2[1]}`);
            break;
          case "silence":
            break;
          case "url":
            d2[1].startsWith("//") && (d2[1] = "https:" + d2[1]);
            arr2.unshift(d2[1]);
            break;
          case "userAgent":
            arr2.push(`User-Agent: ${d2[1]}`);
            break;
          case "userName":
            arr2.push(`username: ${d2[1]}`);
            break;
          default:
            break;
        }
      });
      arr2.unshift("<");
      arr2.push(">");
      result.push(...arr2);
    });
    saveAs(result.join("\r\n"), fileName || `${data[0].out || getMetux()}.ef2`);
  }
  static encode(data) {
    const arr2 = [];
    Object.entries(data).forEach((d) => {
      switch (d[0]) {
        case "cookie":
          arr2.push("-c", d[1]);
          break;
        case "delay":
          arr2.push("-q");
          break;
        case "dir":
          d[1] = d[1].replace(/\//, "\\");
          d[1].endsWith("\\") && (d[1] = d[1].slice(0, -1));
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
    return `ef2://${Base64.encode(arr2.join(" "))}`;
  }
  static decode(ef2str) {
    ef2str = ef2str.replace("ef2://", "");
    ef2str = Base64.decode(ef2str);
    const arr2 = ef2str.split(" ");
    const data = {};
    for (let i = 0; i < arr2.length; i++) {
      if (/-\w/.test(arr2[i])) {
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

// src/utils/format/size.ts
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

// src/core/download/playinfo.ts
var PlayinfoFilter = class {
  constructor(fileName) {
    this.fileName = fileName;
  }
  record = [];
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
      this.fileName && (link.fileName = `${this.fileName}${qua}.${link.type}`);
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
        fileName: `${this.fileName}${qua}.m4v`
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
        fileName: `${this.fileName}${qua}.${fmt}`
      });
    });
  }
  getQuality(url, id) {
    return this.quality[this.getID(url)] || id && this.quality[id] || "N/A";
  }
  getID(url) {
    let id = 0;
    url.replace(/\d+\.((flv)|(mp4)|(m4s))/, (d) => id = Number(d.split(".")[0]));
    return id;
  }
};

// src/html/download.html
var download_default2 = '<div class="table"></div>\r\n<style type="text/css">\r\n    .table {\r\n        position: fixed;\r\n        z-index: 11113;\r\n        bottom: 0;\r\n        width: 100%;\r\n        min-height: 50px;\r\n        display: flex;\r\n        box-sizing: border-box;\r\n        background: #fff;\r\n        border-radius: 8px;\r\n        box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);\r\n        transition: transform 0.3s ease-in;\r\n        flex-wrap: wrap;\r\n        align-content: center;\r\n        justify-content: center;\r\n        align-items: center;\r\n    }\r\n\r\n    .cell {\r\n        background-color: #fff;\r\n        color: #000 !important;\r\n        border: #ccc 1px solid;\r\n        border-radius: 3px;\r\n        display: flex;\r\n        margin: 3px;\r\n        flex-wrap: wrap;\r\n        align-content: center;\r\n        justify-content: center;\r\n        align-items: center;\r\n        flex-direction: row;\r\n    }\r\n\r\n    .type {\r\n        color: #000 !important;\r\n        display: table-cell;\r\n        min-width: 1.5em;\r\n        text-align: center;\r\n        vertical-align: middle;\r\n        padding: 10px 3px;\r\n    }\r\n\r\n    .type.mp4 {\r\n        background-color: #e0e;\r\n    }\r\n\r\n    .type.av1 {\r\n        background-color: #feb;\r\n    }\r\n\r\n    .type.avc {\r\n        background-color: #07e;\r\n    }\r\n\r\n    .type.hev {\r\n        background-color: #7ba;\r\n    }\r\n\r\n    .type.aac {\r\n        background-color: #0d0;\r\n    }\r\n\r\n    .type.flv {\r\n        background-color: #0dd;\r\n    }\r\n\r\n    .item {\r\n        display: table-cell;\r\n        text-decoration: none;\r\n        padding: 3px;\r\n        cursor: pointer;\r\n        color: #1184B4;\r\n    }\r\n\r\n    .item:hover {\r\n        color: #FE3676;\r\n    }\r\n\r\n    .up {\r\n        color: #fff !important;\r\n        text-align: center;\r\n        padding: 1px 3px;\r\n        background-color: #777;\r\n    }\r\n\r\n    .up.yellow {\r\n        background-color: #ffe42b;\r\n        background-image: linear-gradient(to right, #ffe42b, #dfb200);\r\n    }\r\n\r\n    .up.pink {\r\n        background-color: #ffafc9;\r\n        background-image: linear-gradient(to right, #ffafc9, #dfada7);\r\n    }\r\n\r\n    .up.purple {\r\n        background-color: #c0f;\r\n        background-image: linear-gradient(to right, #c0f, #90f);\r\n    }\r\n\r\n    .up.red {\r\n        background-color: #f00;\r\n        background-image: linear-gradient(to right, #f00, #c00);\r\n    }\r\n\r\n    .up.orange {\r\n        background-color: #f90;\r\n        background-image: linear-gradient(to right, #f90, #d70);\r\n    }\r\n\r\n    .up.blue {\r\n        background-color: #00d;\r\n        background-image: linear-gradient(to right, #00d, #00b);\r\n    }\r\n\r\n    .up.green {\r\n        background-color: #0d0;\r\n        background-image: linear-gradient(to right, #0d0, #0b0);\r\n    }\r\n\r\n    .up.lv9 {\r\n        background-color: #151515;\r\n        background-image: linear-gradient(to right, #151515, #030303);\r\n    }\r\n\r\n    .up.lv8 {\r\n        background-color: #841cf9;\r\n        background-image: linear-gradient(to right, #841cf9, #620ad7);\r\n    }\r\n\r\n    .up.lv7 {\r\n        background-color: #e52fec;\r\n        background-image: linear-gradient(to right, #e52fec, #c30dca);\r\n    }\r\n\r\n    .up.lv6 {\r\n        background-color: #ff0000;\r\n        background-image: linear-gradient(to right, #ff0000, #dd0000);\r\n    }\r\n\r\n    .up.lv5 {\r\n        background-color: #ff6c00;\r\n        background-image: linear-gradient(to right, #ff6c00, #dd4a00);\r\n    }\r\n\r\n    .up.lv4 {\r\n        background-color: #ffb37c;\r\n        background-image: linear-gradient(to right, #ffb37c, #dd915a);\r\n    }\r\n\r\n    .up.lv3 {\r\n        background-color: #92d1e5;\r\n        background-image: linear-gradient(to right, #92d1e5, #70b0c3);\r\n    }\r\n\r\n    .up.lv2 {\r\n        background-color: #95ddb2;\r\n        background-image: linear-gradient(to right, #95ddb2, #73bb90);\r\n    }\r\n\r\n    .up.lv1 {\r\n        background-color: #bfbfbf;\r\n        background-image: linear-gradient(to right, #bfbfbf, #9d9d9d);\r\n    }\r\n\r\n    .down {\r\n        font-size: 90%;\r\n        margin-top: 2px;\r\n        text-align: center;\r\n        padding: 1px 3px;\r\n    }\r\n</style>';

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
    this._cells[key].innerHTML = `<div class="type ${key}">${key}</div>`;
    value ? value.forEach((d) => {
      const a = addElement("a", { class: "item", target: "_blank" }, this._cells[key], `<div class="up${d.color ? ` ${d.color}` : ""}">${d.quality}</div><div class="down">${d.size}</div>`);
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
customElements.get(`download-${"aa44074"}`) || customElements.define(`download-${"aa44074"}`, BilioldDownload);

// src/core/download.ts
var Download = class {
  constructor(BLOD2) {
    this.BLOD = BLOD2;
    switchVideo(() => this.destory());
  }
  ui = new BilioldDownload();
  data = this.ui.init();
  get fileName() {
    if (this.BLOD.videoInfo.metadata) {
      return `${this.BLOD.videoInfo.metadata.album}(${this.BLOD.videoInfo.metadata.title})`;
    }
    return "";
  }
  decodePlayinfo(playinfo, fileName = this.fileName) {
    const data = new PlayinfoFilter(fileName).filter(playinfo);
    data.forEach((d) => {
      this.data[d.type] || (this.data[d.type] = []);
      this.data[d.type].push({
        url: d.url,
        fileName,
        quality: Reflect.has(d, "flv") ? `${d.quality}*${d.flv}` : d.quality,
        size: d.size,
        color: d.color,
        onClick: (ev) => this.pushDownload(d, ev)
      });
    });
  }
  pushDownload(data, ev) {
    if (data.onClick) {
      data.onClick(ev);
    } else if (data.url) {
      switch (this.BLOD.status.downloadMethod) {
        case "IDM":
          ev.preventDefault();
          new Ef2(this.BLOD.status.userAgent, this.BLOD.status.referer, this.BLOD.status.filepath, this.BLOD.status.ef2.delay, this.BLOD.status.ef2.silence).file({
            url: data.url[0],
            out: data.fileName
          });
          this.BLOD.toast.success('保存IDM导出文件后，打开IDM -> 任务 -> 导入 -> 从"IDM导出文件"导入即可下载');
          break;
        case "ef2":
          ev.preventDefault();
          new Ef2(this.BLOD.status.userAgent, this.BLOD.status.referer, this.BLOD.status.filepath, this.BLOD.status.ef2.delay, this.BLOD.status.ef2.silence).sendLinkToIDM({
            url: data.url[0],
            out: data.fileName
          });
          this.BLOD.toast.warning("允许浏览器打开【IDM EF2辅助工具】即可开始下载", "如果浏览器和IDM都没有任何反应，那些请先安装ef2辅助工具。");
          break;
        case "aria2":
          ev.preventDefault();
          const cmdLine = new Aria2(this.BLOD.status.userAgent, this.BLOD.status.referer, this.BLOD.status.filepath, this.BLOD.status.aria2.server, this.BLOD.status.aria2.port, this.BLOD.status.aria2.token, this.BLOD.status.aria2.split, this.BLOD.status.aria2.size).cmdlet({
            urls: data.url,
            out: data.fileName
          });
          this.BLOD.toast.success(
            "已复制下载命令到剪切板，粘贴到终端里回车即可开始下载。当然前提是您的设备已配置好了aria2。",
            "--------------",
            cmdLine
          );
          break;
        case "aria2rpc":
          ev.preventDefault();
          new Aria2(this.BLOD.status.userAgent, this.BLOD.status.referer, this.BLOD.status.filepath, this.BLOD.status.aria2.server, this.BLOD.status.aria2.port, this.BLOD.status.aria2.token, this.BLOD.status.aria2.split, this.BLOD.status.aria2.size).rpc({
            urls: data.url,
            out: data.fileName
          }).then((d) => {
            this.BLOD.toast.success("aria2已经开始下载", `GUID: ${d}`);
          }).catch((e) => {
            this.BLOD.toast.error("aria2[RPC]错误！", e);
          });
          break;
        default:
          this.BLOD.toast.warning("当前下载方式设定为浏览器（默认），受限于浏览器安全策略，可能并未触发下载而是打开了一个标签页，所以更良好的习惯是右键要下载的链接【另存为】。另外如果下载失败（403无权访问），请尝试在设置里修改下载方式及其他下载相关选项。");
          break;
      }
    }
  }
  downloading = false;
  gets = [];
  default() {
    if (this.downloading)
      return;
    if (!this.BLOD.cid)
      return this.BLOD.toast.warning("未找到视频文件");
    this.downloading = true;
    this.ui.show();
    this.BLOD.status.TVresource || this.decodePlayinfo(this.BLOD.videoLimit.__playinfo__);
    const tasks = [];
    this.BLOD.status.downloadType.includes("mp4") && (this.data.mp4 || this.gets.includes("mp4") || tasks.push(this.mp4(this.BLOD.cid).then((d) => {
      this.gets.push("mp4");
      this.decodePlayinfo(d);
    })));
    this.BLOD.status.downloadType.includes("flv") && (this.data.flv || this.gets.includes("flv") || tasks.push(
      (this.BLOD.status.TVresource ? this.tv(this.BLOD.aid, this.BLOD.cid, false, this.BLOD.status.downloadQn) : this.interface(this.BLOD.cid, this.BLOD.status.downloadQn)).then((d) => {
        this.gets.push("flv");
        this.decodePlayinfo(d);
      })
    ));
    this.BLOD.status.downloadType.includes("dash") && (this.data.aac || this.gets.includes("dash") || this.data.hev || this.data.av1 || tasks.push(
      (this.BLOD.status.TVresource ? this.tv(this.BLOD.aid, this.BLOD.cid) : this.dash(this.BLOD.aid, this.BLOD.cid)).then((d) => {
        this.gets.push("dash");
        this.decodePlayinfo(d);
      })
    ));
    Promise.allSettled(tasks).finally(() => {
      this.downloading = false;
    });
  }
  destory() {
    this.ui.remove();
    this.data = this.ui.init();
    this.downloading = false;
    this.gets = [];
    this.BLOD.videoLimit.__playinfo__ = void 0;
  }
  mp4(cid) {
    return new ApiPlayurlProj({ cid, access_key: this.BLOD.status.accessKey.token }, this.BLOD.pgc).getData();
  }
  dash(avid, cid) {
    return apiPlayurl({ avid, cid }, true, this.BLOD.pgc);
  }
  tv(avid, cid, dash = true, quality = qn) {
    return new ApiPlayurlTv({ avid, cid, access_key: this.BLOD.status.accessKey.token, qn: quality }, dash, this.BLOD.pgc).getData();
  }
  intl(aid, cid, dash = true) {
    return new ApiPlayurlIntl({ aid, cid, access_key: this.BLOD.status.accessKey.token }, this.BLOD.GM.fetch, dash, this.BLOD.pgc).getData();
  }
  interface(cid, quality = qn) {
    return new ApiPlayurlInterface({ cid, quality }, this.BLOD.pgc).getData();
  }
};

// src/bilibili-old.ts
var BLOD = class {
  constructor(GM2) {
    this.GM = GM2;
    this.user = new User(this);
    this.urlCleaner = new UrlCleaner();
    this.toast = new ToastContainer();
    this.videoLimit = new VideoLimit(this);
    this.videoInfo = new VideoInfo(this);
    this.download = new Download(this);
    this.userLoadedCallbacks = [];
    this.status = userStatus;
    this.path = location.href.split("/");
    this.pgc = false;
    this.playLoaded = false;
    this.networkMocked = false;
    this.isVip = false;
    this.updating = false;
    this.version = this.GM.info?.script.version.slice(-40);
    this.userLoadedCallback((status) => {
      this.status = status;
      this.init();
    });
    this.bpxPlayerProfile();
    this.path[2] == "message.bilibili.com" && Header.message();
    Header.videoOffset();
    /space\.bilibili\.com/.test(location.href) && new PageSpace(this);
    /bangumi\/media\/md/.test(location.href) && new PageMedia(this);
    location.href.includes("www.bilibili.com/account/history") && new PageHistory(this);
    this.path[2] == "live.bilibili.com" && new PageLive(this);
    this.path[2] == "t.bilibili.com" && new PageDynamic(this);
  }
  init() {
    if (this.path[2] == "www.bilibili.com" && (!this.path[3] || (this.path[3].startsWith("?") || this.path[3].startsWith("#") || this.path[3].startsWith("index.")))) {
      this.status.index && new PageIndex(this);
    }
    if (this.status.av && /(\/s)?\/video\/[AaBb][Vv]/.test(location.href)) {
      this.path[3] === "s" && this.urlCleaner.updateLocation(location.href.replace("s/video", "video"));
      this.EmbedPlayer();
      new PageAV(this);
    }
    if (this.status.player && (/\/festival\//.test(location.href) || /player\./.test(location.href) && !location.href.includes("ancient"))) {
      this.EmbedPlayer();
    }
    if (this.status.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)) {
      this.EmbedPlayer();
      new PageBangumi(this);
    }
    if (this.status.watchlater && /\/watchlater/.test(location.href)) {
      this.EmbedPlayer();
      new PageWatchlater(this);
    }
    if (this.status.playlist && /\/medialist\/play\//.test(location.href) && !/watchlater/.test(location.href) || /\/playlist\/video\/pl/.test(location.href)) {
      this.EmbedPlayer();
      new PagePlaylist(this);
    }
    if (this.status.ranking && /\/v\/popular\//.test(location.href)) {
      new PageRanking(this);
    }
    if (this.status.read && /\/read\/[Cc][Vv]/.test(location.href)) {
      new PageRead(this);
    }
    if (this.status.search && this.path[2] == "search.bilibili.com") {
      new PageSearch(this);
    }
    new Automate(this);
    this.toast.update(this.status.toast);
    this.status.disableReport && new ReportObserver();
    this.status.videoLimit.status && this.videoLimit.enable();
    this.status.header && new Header();
    this.status.comment && new Comment(this);
    this.status.webRTC || WebTRC.disable();
    this.status.album && /t.bilibili.com\/\d+/.test(location.href) && PageSpace.album();
    this.status.development && Reflect.defineProperty(window, "BLOD", {
      value: this,
      configurable: true
    });
    window.top === window.self && (this.ui = new UI(this));
  }
  EmbedPlayer() {
    if (!this.playLoaded) {
      this.playLoaded = true;
      new Player(this);
    }
  }
  userLoadedCallback(callback) {
    if (this.user) {
      this.user.addCallback(callback);
    } else {
      this.userLoadedCallbacks.push(callback);
    }
  }
  defineRes(target, res, v) {
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
  networkMock() {
    if (!this.networkMocked) {
      this.networkMocked = true;
      if (true) {
        const that = this;
        xhrHook.ultra(".m4s", function(target, args) {
          const obj = {
            method: args[0],
            url: args[1],
            headers: {
              "user-agent": that.status.userAgent
            },
            onloadstart: (res) => {
              that.defineRes(this, res, () => {
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
                  that.defineRes(this, res, v);
                };
              },
              get: () => obj.onload
            },
            onerror: {
              configurable: true,
              set: (v) => {
                obj.onerror = (res) => {
                  that.defineRes(this, res, v);
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
                  that.defineRes(this, res, v);
                };
              },
              get: () => obj.ontimeout
            },
            onprogress: {
              configurable: true,
              set: (v) => {
                obj.onprogress = (res) => {
                  that.defineRes(this, res, v.bind(this, new ProgressEvent("progress", {
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
                  that.defineRes(this, res, v);
                };
              },
              get: () => obj.onabort
            },
            onreadystatechange: {
              configurable: true,
              set: (v) => {
                obj.onreadystatechange = (res) => {
                  that.defineRes(this, res, v);
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
                const tar = that.GM.xmlHttpRequest(obj);
                this.abort = tar.abort.bind(tar);
                return true;
              }
            }
          });
        });
      } else {
        this.GM.updateSessionRules(networkMock);
      }
    }
  }
  bindStatusChange(key, callback) {
    return this.user.bindChange(key, callback);
  }
  getStatus(key, obj = this.status) {
    const arr2 = key.split(".");
    let status = obj;
    while (status && arr2.length) {
      const d = arr2.shift();
      d && (status = status[d]);
    }
    return status;
  }
  setStatus(key, value, obj = this.status) {
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
  biliQuickLogin() {
    window.biliQuickLogin ? window.biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => this.biliQuickLogin());
  }
  bpxPlayerProfile() {
    try {
      const bpx_player_profile = LocalStorage.getItem("bpx_player_profile") || { media: { autoplay: false } };
      bpx_player_profile.media.autoplay = false;
      LocalStorage.setItem("bpx_player_profile", bpx_player_profile);
    } catch (e) {
    }
  }
  async loadplayer(force = false) {
    if (!window.jQuery)
      await loadScript(URLS.JQUERY);
    try {
      if (true) {
        if (this.status.bilibiliplayer) {
          const data = await Promise.all([
            this.GM.getValue("bilibiliplayer"),
            this.GM.getValue("bilibiliplayerstyle")
          ]);
          if (force || !data[0] || !data[1]) {
            if (this.updating)
              throw new Error("一次只能运行一个更新实例！");
            this.updating = true;
            if (!this.version)
              throw new Error(`未知错误导致脚本版本异常！version：${this.version}`);
            const msg = [
              "更新播放器组件中，可能需要花费一点时间，请不要关闭页面！",
              "如果弹出跨域提醒，推荐【总是允许全部域名】",
              "如果多次更新失败，请禁用【重构播放器】功能！"
            ];
            const toast = this.toast.toast(0, "warning", ...msg);
            let i = 1;
            await Promise.all([
              this.GM.fetch(`https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${this.version}/extension/player/video.js`).then((d) => d.text()).then((d) => {
                data[0] = d;
                msg.push(`加载播放器组件：${i++}/2`);
                toast.data = msg;
              }).catch((e) => {
                msg.push(`获取播放器组件出错！${i++}/2`, e);
                toast.data = msg;
                toast.type = "error";
              }),
              this.GM.fetch(`https://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${this.version}/extension/player/video.css`).then((d) => d.text()).then((d) => {
                data[1] = d;
                msg.push(`加载播放器组件：${i++}/2`);
                toast.data = msg;
              }).catch((e) => {
                msg.push(`获取播放器组件出错！${i++}/2`, e);
                toast.data = msg;
                toast.type = "error";
              })
            ]);
            this.updating = false;
            toast.delay = this.status.toast.delay;
            if (!data[0] || !data[1])
              throw new Error("获取播放器组件出错！");
            msg.push("-------加载成功-------");
            toast.data = msg;
            toast.type = "success";
            this.GM.setValue("bilibiliplayer", data[0]);
            this.GM.setValue("bilibiliplayerstyle", data[1]);
          }
          new Function(data[0])();
          addCss(data[1], `bilibiliplayer-${this.version}`);
          this.GM.setValue("version", this.version);
        } else {
          await loadScript(URLS.VIDEO);
        }
      } else {
        await Promise.all([
          this.GM.executeScript("player/video.js", true).then((d) => loadScript(d)),
          this.GM.insertCSS("player/video.css", true).then((d) => loadStyle2(d))
        ]);
      }
    } catch (e) {
      this.updating || this.toast.error("播放器加载失败！", "已回滚~", e)();
      await loadScript(URLS.VIDEO);
    }
  }
};

// userscript/gm.ts
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

// userscript/polyfill/polyfill.ts
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

// userscript/main.ts
new BLOD(GM);
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
// @license MIT

]]></>).toString();

new Function("GM", MODULES)(GM);

