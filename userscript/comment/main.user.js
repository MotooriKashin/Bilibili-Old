// ==UserScript==
// @name         Bilibili 翻页评论区
// @namespace    MotooriKashin
// @version      2.1.0
// @description  恢复评论区翻页功能。
// @author       MotooriKashin
// @homepage     https://github.com/MotooriKashin/Bilibili-Old
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {


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
  /**
   * av/BV互转
   * @param input av或BV，可带av/BV前缀
   * @returns 转化结果
   */
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

// src/utils/format/integer.ts
function integerFormat(num, byte = 2) {
  return num < 10 ** byte ? (Array(byte).join("0") + num).slice(-1 * byte) : num;
}

// src/utils/format/time.ts
function timeFormat(time = new Date().getTime(), type) {
  const date = new Date(time);
  const arr = date.toLocaleString().split(" ");
  const day = arr[0].split("/");
  day[1] = integerFormat(day[1], 2);
  day[2] = integerFormat(day[2], 2);
  return type ? day.join("-") + " " + arr[1] : arr[1];
}

// src/utils/debug.ts
var group = {
  /** 分组层次 */
  i: 0,
  /** 分组栈 */
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

// src/utils/typeof.ts
var isArray = Array.isArray;
var isNumber = (val) => !isNaN(parseFloat(val)) && isFinite(val);

// src/utils/format/url.ts
var URL = class {
  /** 锚 */
  hash;
  /** 基链 */
  base;
  /** 参数对象。结果会格式化`undefined``null``NaN`等特殊值，但不会处理数字，以免丢失精度。 */
  params = {};
  /** 参数链（不含`?`） */
  get param() {
    return Object.entries(this.params).reduce((s, d) => {
      return s += `${s ? "&" : ""}${d[0]}=${d[1]}`;
    }, "");
  }
  /** 提取URL参数 */
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
  /** 还原url链接 */
  toJSON() {
    return `${this.base ? this.param ? this.base + "?" : this.base : ""}${this.param}${this.hash || ""}`;
  }
};
function urlObj(url) {
  const res = new URL(url);
  return res.params;
}

// src/utils/hook/node.ts
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

// src/html/preview-image.html
var preview_image_default = '<div class="reply-view-image">\r\n    <!-- 操作区 -->\r\n    <div class="operation-btn">\r\n        <div class="operation-btn-icon close-container">\r\n            <i class="svg-icon close use-color" style="width: 14px; height: 14px;"></i>\r\n        </div>\r\n        <div class="operation-btn-icon last-image">\r\n            <i class="svg-icon left-arrow use-color" style="width: 22px; height: 22px;"></i>\r\n        </div>\r\n        <div class="operation-btn-icon next-image">\r\n            <i class="svg-icon right-arrow use-color" style="width: 22px; height: 22px;"></i>\r\n        </div>\r\n    </div>\r\n    <!-- 图片内容 -->\r\n    <div class="show-image-wrap"></div>\r\n    <!-- 小图预览栏 -->\r\n    <div class="preview-list"></div>\r\n</div>\r\n<style>\r\n    .reply-view-image {\r\n        position: fixed;\r\n        z-index: 999999;\r\n        top: 0;\r\n        right: 0;\r\n        bottom: 0;\r\n        left: 0;\r\n        width: 100%;\r\n        height: 100%;\r\n        background: rgba(24, 25, 28, 0.85);\r\n        transform: scale(1);\r\n        user-select: none;\r\n    }\r\n\r\n    .reply-view-image,\r\n    .reply-view-image * {\r\n        box-sizing: border-box;\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon {\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: center;\r\n        position: absolute;\r\n        z-index: 2;\r\n        width: 42px;\r\n        height: 42px;\r\n        border-radius: 50%;\r\n        color: white;\r\n        background: rgba(0, 0, 0, 0.58);\r\n        transition: 0.2s;\r\n        cursor: pointer;\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon:hover {\r\n        color: #FF6699;\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon.close-container {\r\n        top: 16px;\r\n        right: 16px;\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon.last-image {\r\n        top: 50%;\r\n        left: 16px;\r\n        transform: translateY(-50%);\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon.next-image {\r\n        top: 50%;\r\n        right: 16px;\r\n        transform: translateY(-50%);\r\n    }\r\n\r\n    .reply-view-image .show-image-wrap {\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: center;\r\n        position: absolute;\r\n        width: 100%;\r\n        height: 100%;\r\n        max-height: 100%;\r\n        padding: 0 100px;\r\n        overflow: auto;\r\n    }\r\n\r\n    .reply-view-image .show-image-wrap .loading-svga {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        transform: translate(-50%, -50%);\r\n        width: 42px;\r\n        height: 42px;\r\n    }\r\n\r\n    .reply-view-image .show-image-wrap.vertical {\r\n        flex-direction: column;\r\n        justify-content: start;\r\n    }\r\n\r\n    .reply-view-image .show-image-wrap .image-content {\r\n        max-width: 100%;\r\n    }\r\n\r\n    .reply-view-image .preview-list {\r\n        display: flex;\r\n        align-items: center;\r\n        position: absolute;\r\n        left: 50%;\r\n        bottom: 30px;\r\n        z-index: 2;\r\n        padding: 6px 10px;\r\n        border-radius: 8px;\r\n        background: rgba(24, 25, 28, 0.8);\r\n        backdrop-filter: blur(20px);\r\n        transform: translateX(-50%);\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box {\r\n        padding: 1px;\r\n        border: 2px solid transparent;\r\n        border-radius: 8px;\r\n        transition: 0.3s;\r\n        cursor: pointer;\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box.active {\r\n        border-color: #FF6699;\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap {\r\n        display: flex;\r\n        justify-content: center;\r\n        overflow: hidden;\r\n        width: 100%;\r\n        height: 100%;\r\n        border-radius: 6px;\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap.vertical {\r\n        flex-direction: column;\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap.extra-long {\r\n        justify-content: start;\r\n    }\r\n\r\n    .svg-icon {\r\n        display: inline-flex;\r\n        justify-content: center;\r\n        align-items: center;\r\n    }\r\n\r\n    .svg-icon svg {\r\n        width: 100%;\r\n        height: 100%;\r\n    }\r\n\r\n    .svg-icon.use-color svg path {\r\n        fill: currentColor;\r\n        color: inherit;\r\n    }\r\n</style>\r\n<style type="text/css">\r\n    ::-webkit-scrollbar {\r\n        width: 7px;\r\n        height: 7px;\r\n    }\r\n\r\n    ::-webkit-scrollbar-track {\r\n        border-radius: 4px;\r\n        background-color: #EEE;\r\n    }\r\n\r\n    ::-webkit-scrollbar-thumb {\r\n        border-radius: 4px;\r\n        background-color: #999;\r\n    }\r\n</style>';

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
  right: right_default
};

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
    close.addEventListener("click", (e) => {
      this.remove();
      document.body.style.overflow = "";
      e.stopPropagation();
    });
    left.addEventListener("click", (e) => {
      this.togger(e, false);
      e.stopPropagation();
    });
    right.addEventListener("click", (e) => {
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
        this._image.innerHTML = `<img class="image-content" src="${img.src}">`;
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
    this._image.innerHTML = `<img class="image-content" src="${imgs[active]}">`;
    vertical ? this.classList.add("vertical") : this.classList.remove("vertical");
    this._list.innerHTML = "";
    imgs.forEach((d, i) => {
      const item = addElement("div", {
        class: `preview-item-box${i === active ? " active" : ""}`,
        style: "min-width: 54px; max-width: 54px; height: 54px;"
      }, this._list, `<div class="preview-item-wrap${vertical ? " vertical" : ""}"><img src="${d}"></div>`);
      item.addEventListener("click", (e) => {
        this._list.querySelector(".preview-item-box.active")?.classList.remove("active");
        item.classList.add("active");
        this._image.innerHTML = `<img class="image-content" src="${d}">`;
        e.stopPropagation();
      });
    });
    document.body.contains(this) || document.body.appendChild(this);
    document.body.style.overflow = "hidden";
  }
};
customElements.get(`preview-image-${"wsvs0a85lp"}`) || customElements.define(`preview-image-${"wsvs0a85lp"}`, PreviewImage);

// src/core/comment.ts
var Feedback;
var loading = false;
var load = false;
var events = {};
var Comment = class {
  constructor(BLOD) {
    this.BLOD = BLOD;
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
          let initComment = function(tar, init) {
            new Feedback(tar, init.oid, init.pageType, init.userStatus);
          };
          Reflect.defineProperty(window, "initComment", { configurable: true, value: initComment });
          return initComment;
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
    this.BLOD.status.commentJumpUrlTitle && this._resolveJump();
  }
  /** 样式修补 */
  styleFix() {
    addCss(`.bb-comment .comment-list .list-item .info .btn-hover, .comment-bilibili-fold .comment-list .list-item .info .btn-hover {
            line-height: 24px;
        }`, "comment-btn-24pxH");
    addCss(`.operation.btn-hide-re .opera-list {visibility: visible}`, "keep-operalist-visible");
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
  /** 楼中楼“查看对话按钮” & 让评论菜单可以通过再次点击按钮来关闭 */
  _registerEvent() {
    const _registerEvent = Feedback.prototype._registerEvent;
    let previewImage;
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
            let nextPage = function(minFloor) {
              if (minFloor < resp.data.dialog.max_floor) {
                fetchDialog(minFloor + 1).done((resp2) => {
                  if (resp2.code == 0 && resp2.data.replies && resp2.data.replies.length > 0) {
                    replyBox.insertAdjacentHTML("beforeend", l._createSubReplyList(resp2.data.replies, resp2.data.replies.length, true, rootid, null, false));
                    nextPage(resp2.data.cursor.max_floor);
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
            replyBox.innerHTML = l._createSubReplyList(resp.data.replies, resp.data.replies.length, true, rootid, null, false);
            l._registerEvent(container);
            container.className = "comment-dialog-container";
            fixEmojiPosition(replyBox);
            nextPage(resp.data.cursor.max_floor);
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
          pictureList.push(`<div class="image-exhibition">`);
          content.pictures.forEach((d) => {
            const type = d.img_width >= d.img_height ? "horizontal" : "vertical";
            const extraLong = d.img_width / d.img_height >= 3 || d.img_height / d.img_width >= 3;
            pictureList.push(
              '<div class="image-item-wrap ',
              type,
              `${extraLong ? "extraLong" : ""}`,
              '"><img class="image-item-img" src="',
              d.img_src + "@.webp",
              `"></div>`
            );
          });
          pictureList.push(`</div>`);
        }
      }
      return pictureList.join("");
    };
  }
};

// userscript/comment/main.ts
new Comment({ status: {} });
// @license MIT

})();

