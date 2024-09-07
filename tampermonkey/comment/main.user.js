// ==UserScript==
// @name         Bilibili 翻页评论区
// @namespace    MotooriKashin
// @version      2.2.9
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
    return `${this.base ? this.param ? this.base + "?" : this.base : ""}${this.param}${this.hash || ""}`;
  }
};
function objUrl(url, obj) {
  const res = new URL(url);
  Object.entries(obj).forEach((d) => {
    if (d[1] === void 0 || d[1] === null) return;
    res.params[d[0]] = d[1];
  });
  return res.toJSON();
}
function urlObj(url) {
  const res = new URL(url);
  return res.params;
}

// src/io/api.ts
function jsonCheck(str) {
  const result = typeof str === "string" ? JSON.parse(str) : str;
  if (result.code === 0) return result;
  throw new Error(`${result.code} ${result.message}`, { cause: result.code });
}

// src/io/urls.ts
var URLS = class _URLS {
  // protocol + //
  static P_AUTO = "//";
  static P_HTTP = "http://";
  static P_HTTPS = "https://";
  static P_WS = "ws://";
  static P_WSS = "wss://";
  // domain
  static D_WWW = "www.bilibili.com";
  static D_API = "api.bilibili.com";
  static D_APP = "app.bilibili.com";
  static D_MANAGER = "manager.bilibili.co";
  static D_INTERFACE = "interface.bilibili.com";
  static D_PASSPORT = "passport.bilibili.com";
  static D_BANGUMI = "bangumi.bilibili.com";
  static D_SPACE = "space.bilibili.com";
  static D_STATIC_S = "static.hdslb.com";
  static D_CHAT = "chat.bilibili.com";
  static D_DATA = "data.bilibili.com";
  static D_COMMENT = "comment.bilibili.com";
  static D_BROADCAST = "broadcast.bilibili.com";
  static D_MISAKA_SW = "misaka-sw.bilibili.com";
  static D_MEMBER = "member.bilibili.com";
  static D_BVC = "bvc.bilivideo.com";
  static D_S1 = "s1.hdslb.com";
  static D_API_GLOBAL = "api.global.bilibili.com";
  static D_ACCOUNT = "account.bilibili.com";
  static D_INTL = "apiintl.biliapi.net";
  static D_API_VC = "api.vc.bilibili.com";
  static WEBSHOW_LOCS = _URLS.P_AUTO + _URLS.D_API + "/x/web-show/res/locs";
  static INDEX_TOP_RCMD = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/index/top/rcmd";
  static PAGE_HEADER = _URLS.P_AUTO + _URLS.D_API + "/x/web-show/page/header";
  static SEASON_RANK_LIST = _URLS.P_AUTO + _URLS.D_API + "/pgc/season/rank/web/list";
  static VIDEO = _URLS.P_AUTO + _URLS.D_STATIC_S + "/js/video.min.js";
  static JQUERY = _URLS.P_AUTO + _URLS.D_STATIC_S + "/js/jquery.min.js";
  static ARTICLE_CARDS = _URLS.P_AUTO + _URLS.D_API + "/x/article/cards";
  static VIEW_DETAIL = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/view/detail";
  static VIEW = _URLS.P_AUTO + _URLS.D_API + "/view";
  static X_VIEW = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/view";
  static PAGE_LIST = _URLS.P_AUTO + _URLS.D_API + "/x/player/pagelist";
  static TAG_INFO = _URLS.P_AUTO + _URLS.D_API + "/x/tag/info";
  static TAG_TOP = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/tag/top";
  static BANGUMI_SEASON = _URLS.P_AUTO + _URLS.D_BANGUMI + "/view/web_api/season";
  static SEASON_STATUS = _URLS.P_AUTO + _URLS.D_API + "/pgc/view/web/season/user/status";
  static PGC_SEASON = _URLS.P_AUTO + _URLS.D_API + "/pgc/view/web/season";
  static SEASON_SECTION = _URLS.P_AUTO + _URLS.D_API + "/pgc/web/season/section";
  static GLOBAL_OGV_VIEW = _URLS.P_AUTO + _URLS.D_API_GLOBAL + "/intl/gateway/v2/ogv/view/app/season";
  static GLOBAL_OGV_PLAYURL = _URLS.P_AUTO + _URLS.D_API_GLOBAL + "/intl/gateway/v2/ogv/playurl";
  static APP_PGC_PLAYURL = _URLS.P_AUTO + _URLS.D_API + "/pgc/player/api/playurl";
  static ACCOUNT_GETCARDBYMID = _URLS.P_AUTO + _URLS.D_ACCOUNT + "/api/member/getCardByMid";
  static LOGIN_APP_THIRD = _URLS.P_AUTO + _URLS.D_PASSPORT + "/login/app/third";
  static PLAYER = _URLS.P_AUTO + _URLS.D_API + "/x/player/v2";
  static PLAYURL_PROJ = _URLS.P_AUTO + _URLS.D_APP + "/v2/playurlproj";
  static PGC_PLAYURL_PROJ = _URLS.P_AUTO + _URLS.D_API + "/pgc/player/api/playurlproj";
  static PGC_PLAYURL_TV = _URLS.P_AUTO + _URLS.D_API + "/pgc/player/api/playurltv";
  static UGC_PLAYURL_TV = _URLS.P_AUTO + _URLS.D_API + "/x/tv/ugc/playurl";
  static PGC_PLAYURL = _URLS.P_AUTO + _URLS.D_API + "/pgc/player/web/playurl";
  static PLAYURL = _URLS.P_AUTO + _URLS.D_API + "/x/player/playurl";
  static INTL_PLAYURL = _URLS.P_AUTO + _URLS.D_APP + "/x/intl/playurl";
  static INTL_OGV_PLAYURL = _URLS.P_AUTO + _URLS.D_INTL + "/intl/gateway/ogv/player/api/playurl";
  static PLAYURL_INTERFACE = _URLS.P_AUTO + _URLS.D_INTERFACE + "/v2/playurl";
  static PLAYURL_BANGUMI = _URLS.P_AUTO + _URLS.D_BANGUMI + "/player/web_api/v2/playurl";
  static LIKE = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/archive/like";
  static HAS_LIKE = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/archive/has/like";
  static DM_WEB_VIEW = _URLS.P_AUTO + _URLS.D_API + "/x/v2/dm/web/view";
  static DM_WEB_SEG_SO = _URLS.P_AUTO + _URLS.D_API + "/x/v2/dm/web/seg.so";
  static STAT = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/archive/stat";
  static SLIDE_SHOW = _URLS.P_AUTO + _URLS.D_API + "/pgc/operation/api/slideshow";
  static SEARCH_SQUARE = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/search/square";
  static SPACE_ARC = _URLS.P_AUTO + _URLS.D_API + "/x/space/wbi/arc/search";
  static NEWLIST = _URLS.P_AUTO + _URLS.D_API + "/x/web-interface/newlist";
  static SEARCH = _URLS.P_AUTO + _URLS.D_API + "/search";
  static REPLY = _URLS.P_AUTO + _URLS.D_API + "/x/v2/reply";
  static ARTICLE_UPCOVER = _URLS.P_AUTO + _URLS.D_API + "/x/article/creative/article/upcover";
  static DRAW_IMAGE_UPLOAD = _URLS.P_AUTO + _URLS.D_API_VC + "/api/v1/drawImage/upload";
  static DYNAMIC_UPLOAD_BFS = _URLS.P_AUTO + _URLS.D_API + "/x/dynamic/feed/draw/upload_bfs";
  /** 退出登录 */
  static PASSPORT_LOGIN_EXIT = _URLS.P_AUTO + _URLS.D_PASSPORT + "/login/exit/v2";
  static PASSPORT_AUTH_CODE = _URLS.P_AUTO + _URLS.D_PASSPORT + "/x/passport-tv-login/qrcode/auth_code";
  static PASSPORT_QRCODE_CONFIRM = _URLS.P_AUTO + _URLS.D_PASSPORT + "/x/passport-tv-login/h5/qrcode/confirm";
  static PASSPORT_QRCODE_POLL = _URLS.P_AUTO + _URLS.D_PASSPORT + "/x/passport-tv-login/qrcode/poll";
};

// src/io/api-reply.ts
async function apiReply(oid, pn = 1, type = 1, sort = 0) {
  const reply = await fetch(objUrl(URLS.REPLY, { pn, type, oid, sort }), { credentials: "include" });
  const json = await reply.json();
  return jsonCheck(json).data;
}

// src/utils/av.ts
var AV;
((AV2) => {
  const XOR_CODE = 23442827791579n;
  const MASK_CODE = 2251799813685247n;
  const MAX_AID = 1n << 51n;
  const MIN_AID = 1n;
  const BASE = 58n;
  const BYTES = ["B", "V", 1, "", "", "", "", "", "", "", "", ""];
  const BV_LEN = BYTES.length;
  const ALPHABET = [
    "F",
    "c",
    "w",
    "A",
    "P",
    "N",
    "K",
    "T",
    "M",
    "u",
    "g",
    "3",
    "G",
    "V",
    "5",
    "L",
    "j",
    "7",
    "E",
    "J",
    "n",
    "H",
    "p",
    "W",
    "s",
    "x",
    "4",
    "t",
    "b",
    "8",
    "h",
    "a",
    "Y",
    "e",
    "v",
    "i",
    "q",
    "B",
    "z",
    "6",
    "r",
    "k",
    "C",
    "y",
    "1",
    "2",
    "m",
    "U",
    "S",
    "D",
    "Q",
    "X",
    "9",
    "R",
    "d",
    "o",
    "Z",
    "f"
  ];
  const DIGIT_MAP = [0, 1, 2, 9, 7, 5, 6, 4, 8, 3, 10, 11];
  const REG_EXP = new RegExp(`^[bB][vV]1[${ALPHABET.join("")}]{9}$`, "g");
  const REG_EXP_SHORT = new RegExp(`^1[${ALPHABET.join("")}]{9}$`, "g");
  const REG_EXP_STR = new RegExp(`[bB][vV]1[${ALPHABET.join("")}]{9}`, "g");
  function toBV(avid) {
    typeof avid === "bigint" || (avid = BigInt(avid));
    if (avid < MIN_AID) {
      throw new RangeError(`Av ${avid} is smaller than ${MIN_AID}`);
    }
    if (avid >= MAX_AID) {
      throw new RangeError(`Av ${avid} is bigger than ${MAX_AID}`);
    }
    const bytes = Array.from(BYTES);
    let bv_idx = BV_LEN - 1;
    let tmp = (MAX_AID | avid) ^ XOR_CODE;
    while (tmp !== 0n) {
      let table_idx = tmp % BASE;
      bytes[DIGIT_MAP[Number(bv_idx)]] = ALPHABET[Number(table_idx)];
      tmp /= BASE;
      bv_idx -= 1;
    }
    return bytes.join("");
  }
  AV2.toBV = toBV;
  function fromBV(bvid) {
    if (REG_EXP_SHORT.test(bvid)) {
      bvid = "BV" + bvid;
    }
    let r = 0n;
    for (let i = 3; i < BV_LEN; i++) {
      r = r * BASE + BigInt(ALPHABET.indexOf(bvid[DIGIT_MAP[i]]));
    }
    return `${r & MASK_CODE ^ XOR_CODE}`;
  }
  AV2.fromBV = fromBV;
  function fromStr(str) {
    return str.replace(REG_EXP_STR, (s) => "av" + fromBV(s));
  }
  AV2.fromStr = fromStr;
})(AV || (AV = {}));

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
  const element = document.createElement(tag);
  attribute && Object.entries(attribute).forEach((d) => element.setAttribute(d[0], d[1]));
  innerHTML && element.insertAdjacentHTML("beforeend", innerHTML);
  replaced ? replaced.replaceWith(element) : parrent && (top ? parrent.insertAdjacentElement("afterbegin", element) : parrent.insertAdjacentElement("beforeend", element));
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
function timeFormat(time = (/* @__PURE__ */ new Date()).getTime(), type) {
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
    if (redirect) try {
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
          this == null ? void 0 : this.remove();
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
jsonpHook.xhr = (url) => {
  const one = Array.isArray(url) ? url : [url];
  const two = function() {
    try {
      const obj = urlObj(this.src);
      if (obj) {
        const callback = obj.callback || obj.jsoncallback;
        const call = window[callback];
        const url2 = this.src;
        this.removeAttribute("src");
        delete obj.callback;
        delete obj.jsoncallback;
        fetch(objUrl(url2.split("?")[0], obj)).then((d) => d.json()).then((d) => {
          call(d);
          this.dispatchEvent(new ProgressEvent("load"));
        }).catch(() => {
          this.dispatchEvent(new ProgressEvent("error"));
        });
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

// src/core/quickLogin.ts
function biliQuickLogin() {
  window.biliQuickLogin ? window.biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
}

// src/html/preview-image.html
var preview_image_default = '<div class="reply-view-image">\r\n    <!-- 操作区 -->\r\n    <div class="operation-btn">\r\n        <div class="operation-btn-icon close-container">\r\n            <i class="svg-icon close use-color" style="width: 14px; height: 14px;"></i>\r\n        </div>\r\n        <div class="operation-btn-icon last-image">\r\n            <i class="svg-icon left-arrow use-color" style="width: 22px; height: 22px;"></i>\r\n        </div>\r\n        <div class="operation-btn-icon next-image">\r\n            <i class="svg-icon right-arrow use-color" style="width: 22px; height: 22px;"></i>\r\n        </div>\r\n    </div>\r\n    <!-- 图片内容 -->\r\n    <div class="show-image-wrap"></div>\r\n    <!-- 小图预览栏 -->\r\n    <div class="preview-list"></div>\r\n</div>\r\n<style>\r\n    .reply-view-image {\r\n        position: fixed;\r\n        z-index: 999999;\r\n        top: 0;\r\n        right: 0;\r\n        bottom: 0;\r\n        left: 0;\r\n        width: 100%;\r\n        height: 100%;\r\n        background: rgba(24, 25, 28, 0.85);\r\n        transform: scale(1);\r\n        user-select: none;\r\n    }\r\n\r\n    .reply-view-image,\r\n    .reply-view-image * {\r\n        box-sizing: border-box;\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon {\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: center;\r\n        position: absolute;\r\n        z-index: 2;\r\n        width: 42px;\r\n        height: 42px;\r\n        border-radius: 50%;\r\n        color: white;\r\n        background: rgba(0, 0, 0, 0.58);\r\n        transition: 0.2s;\r\n        cursor: pointer;\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon:hover {\r\n        color: #FF6699;\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon.close-container {\r\n        top: 16px;\r\n        right: 16px;\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon.last-image {\r\n        top: 50%;\r\n        left: 16px;\r\n        transform: translateY(-50%);\r\n    }\r\n\r\n    .reply-view-image .operation-btn .operation-btn-icon.next-image {\r\n        top: 50%;\r\n        right: 16px;\r\n        transform: translateY(-50%);\r\n    }\r\n\r\n    .reply-view-image .show-image-wrap {\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: center;\r\n        position: absolute;\r\n        width: 100%;\r\n        height: 100%;\r\n        max-height: 100%;\r\n        padding: 0 100px;\r\n        overflow: auto;\r\n    }\r\n\r\n    .reply-view-image .show-image-wrap .loading-svga {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        transform: translate(-50%, -50%);\r\n        width: 42px;\r\n        height: 42px;\r\n    }\r\n\r\n    .reply-view-image .show-image-wrap.vertical {\r\n        flex-direction: column;\r\n        justify-content: start;\r\n    }\r\n\r\n    .reply-view-image .show-image-wrap .image-content {\r\n        max-width: 100%;\r\n        margin: auto;\r\n    }\r\n\r\n    .reply-view-image .preview-list {\r\n        display: flex;\r\n        align-items: center;\r\n        position: absolute;\r\n        left: 50%;\r\n        bottom: 30px;\r\n        z-index: 2;\r\n        padding: 6px 10px;\r\n        border-radius: 8px;\r\n        background: rgba(24, 25, 28, 0.8);\r\n        backdrop-filter: blur(20px);\r\n        transform: translateX(-50%);\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box {\r\n        padding: 1px;\r\n        border: 2px solid transparent;\r\n        border-radius: 8px;\r\n        transition: 0.3s;\r\n        cursor: pointer;\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box.active {\r\n        border-color: #FF6699;\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap {\r\n        display: flex;\r\n        justify-content: center;\r\n        overflow: hidden;\r\n        width: 100%;\r\n        height: 100%;\r\n        border-radius: 6px;\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap.vertical {\r\n        flex-direction: column;\r\n    }\r\n\r\n    .reply-view-image .preview-list .preview-item-box .preview-item-wrap.extra-long {\r\n        justify-content: start;\r\n    }\r\n\r\n    .svg-icon {\r\n        display: inline-flex;\r\n        justify-content: center;\r\n        align-items: center;\r\n    }\r\n\r\n    .svg-icon svg {\r\n        width: 100%;\r\n        height: 100%;\r\n    }\r\n\r\n    .svg-icon.use-color svg path {\r\n        fill: currentColor;\r\n        color: inherit;\r\n    }\r\n</style>';

// src/svg/fork.svg
var fork_default = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.284996 0.286944C0.480258 0.091682 0.796841 0.0916819 0.992103 0.286944L4.99893 4.29377L9.00684 0.285851C9.20211 0.0905889 9.51869 0.0905886 9.71395 0.285851C9.90921 0.481113 9.90921 0.797696 9.71395 0.992958L5.70603 5.00088L9.71309 9.00793C9.90835 9.20319 9.90835 9.51978 9.71309 9.71504C9.51783 9.9103 9.20124 9.9103 9.00598 9.71504L4.99893 5.70798L0.992966 9.71394C0.797704 9.90921 0.481122 9.90921 0.28586 9.71394C0.0905973 9.51868 0.0905975 9.2021 0.28586 9.00684L4.29182 5.00088L0.284996 0.994051C0.0897343 0.798789 0.0897342 0.482206 0.284996 0.286944Z" fill="#E19C2C"></path></svg>';

// src/svg/left.svg
var left_default = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.67413 1.57564C7.90844 1.80995 7.90844 2.18985 7.67413 2.42417L4.09839 5.9999L7.67413 9.57564C7.90844 9.80995 7.90844 10.1899 7.67413 10.4242C7.43981 10.6585 7.05992 10.6585 6.8256 10.4242L3.00238 6.60094C2.67043 6.269 2.67043 5.73081 3.00238 5.39886L6.8256 1.57564C7.05992 1.34132 7.43981 1.34132 7.67413 1.57564Z" fill="#A2A7AE"></path></svg>';

// src/svg/right.svg
var right_default = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.82576 2.07564C5.59145 2.30995 5.59145 2.68985 5.82576 2.92417L10.9015 7.9999L5.82576 13.0756C5.59145 13.31 5.59145 13.6899 5.82576 13.9242C6.06008 14.1585 6.43997 14.1585 6.67429 13.9242L11.9386 8.65987C12.3031 8.29538 12.3031 7.70443 11.9386 7.33994L6.67429 2.07564C6.43997 1.84132 6.06008 1.84132 5.82576 2.07564Z" fill="#E19C2C"></path></svg>';

// src/utils/mutex.ts
function getMetux() {
  return Math.random().toString(36).substring(2);
}

// src/utils/scrollbar.ts
var Scrollbar = class _Scrollbar {
  /**
   * 设置滚动条
   * @param ele 目标节点
   * @param x 是否显示横滚动条
   * @param y 是否显示纵滚动条
   * @param side 复制样式到目标节点旁边，用于默认样式不生效的情况，比如ShadowRoot环境
   */
  constructor(ele, x = true, y = true, side = false) {
    this.ele = ele;
    this.x = x;
    this.y = y;
    this.side = side;
    _Scrollbar.style || _Scrollbar.init();
    this.overflow = this.ele.style.overflow;
    side && ele.insertAdjacentElement("afterend", _Scrollbar.style.cloneNode(true));
    this.flesh();
  }
  static mutex = getMetux();
  static prefix = "scrollbar-" + _Scrollbar.mutex;
  static style;
  static thumb = "#999";
  static track = "#EEE";
  static init() {
    this.style || (this.style = addElement("style", void 0), document.head);
    this.style.textContent = `.${this.prefix}[data-${this.mutex}="${this.mutex}"]{
    scrollbar-width: none;
    scrollbar-color: ${this.thumb} ${this.track};
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]:hover {
    scrollbar-width: thin;
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]::-webkit-scrollbar {
    width: 0;
    height: 0;
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: ${this.track};
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${this.thumb};
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]:hover::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}
.${this.prefix}[data-${this.mutex}="${this.mutex}"]::-webkit-scrollbar:hover {
    width: 7px;
    height: 7px;
}`;
  }
  /** 备份原始overflow */
  overflow;
  /** 滑块颜色 */
  get thumb() {
    return _Scrollbar.thumb;
  }
  set thumb(v) {
    _Scrollbar.thumb = v;
    _Scrollbar.init();
  }
  /** 轨道颜色 */
  get track() {
    return _Scrollbar.track;
  }
  set track(v) {
    _Scrollbar.track = v;
    _Scrollbar.init();
  }
  flesh() {
    document.contains(_Scrollbar.style) || document.head.append(_Scrollbar.style);
    this.ele.classList.add(_Scrollbar.prefix);
    this.ele.setAttribute(`data-${_Scrollbar.mutex}`, _Scrollbar.mutex);
    switch (this.suffix()) {
      case "-all": {
        this.ele.style.overflow = "auto auto";
        break;
      }
      case "-x": {
        this.ele.style.overflow = "auto hidden";
        break;
      }
      case "-y": {
        this.ele.style.overflow = "hidden auto";
        break;
      }
      case "-none":
      default: {
        this.ele.style.overflow = this.overflow;
        this.remove();
        break;
      }
    }
  }
  suffix() {
    if (this.x) {
      return this.y ? "-all" : "-x";
    } else {
      return this.y ? "-y" : "-none";
    }
  }
  remove() {
    this.ele.classList.remove(_Scrollbar.prefix);
    this.ele.removeAttribute(`data-${_Scrollbar.mutex}`);
  }
  /**
   * 更新滚动条
   * @param x 是否显示横滚动条
   * @param y 是否显示纵滚动条
   * @param thumb 滑块颜色
   * @param track 轨道颜色
   */
  update(x = true, y = true) {
    this.x = x;
    this.y = y;
    this.flesh();
  }
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
    close.innerHTML = fork_default;
    left.innerHTML = left_default;
    right.innerHTML = right_default;
    this._image = root.querySelector(".show-image-wrap");
    this._list = root.querySelector(".preview-list");
    new Scrollbar(this._image, true, true, true);
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
    this._image.addEventListener("click", (e) => {
      if (e.target === this._image) {
        this.remove();
        document.body.style.overflow = "";
        e.stopPropagation();
      }
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
        var _a;
        (_a = this._list.querySelector(".preview-item-box.active")) == null ? void 0 : _a.classList.remove("active");
        item.classList.add("active");
        this._image.innerHTML = `<img class="image-content" src="${d}">`;
        e.stopPropagation();
      });
    });
    document.body.contains(this) || document.body.appendChild(this);
    document.body.style.overflow = "hidden";
  }
};
customElements.get(`preview-image-${"f6jo3gkpoyp"}`) || customElements.define(`preview-image-${"f6jo3gkpoyp"}`, PreviewImage);

// src/core/comment.ts
var Feedback;
var loading = false;
var load = false;
var events = {};
var Comment = class _Comment {
  /** 还原超链接标题 */
  static commentJumpUrlTitle = false;
  /** 显示评论图片 */
  static resolvePictures = true;
  /** 评论页数 */
  count = 0;
  constructor() {
    Feedback = void 0;
    loading = false;
    load = false;
    events = {};
    this.bbComment();
    this.initComment();
    this.BiliComments();
    this.pageCount();
    this.jump();
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
    const commentHander = {};
    Reflect.defineProperty(window, "initComment", {
      configurable: true,
      set: (v) => true,
      get: () => {
        if (load) {
          let initComment2 = function(tar, init) {
            commentHander.reset = function({ oid }) {
              new Feedback(tar, oid, init.pageType, init.userStatus);
            };
            new Feedback(tar, init.oid, init.pageType, init.userStatus, init.jumpReplyId);
            return commentHander;
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
          return commentHander;
        };
      }
    });
  }
  BiliComments() {
    Reflect.defineProperty(self, "BiliComments", {
      configurable: true,
      set: (v) => true,
      get: () => {
        return class extends EventTarget {
          constructor(arg) {
            super();
            this.arg = arg;
          }
          $parent;
          mount(parent) {
            if (load) {
              this.$parent = parent;
              const [type, oid] = this.arg.params.split(",");
              new Feedback(parent, oid, type, void 0, this.arg.seekId);
              setTimeout(() => {
                this.dispatchEvent(new Event("inited"));
                this.dispatchEvent(new Event("expand"));
              });
            } else {
              if (!loading) {
                loadScript(`//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js`).then(() => {
                  load = true;
                });
              }
              loading = true;
              setTimeout(() => this.mount(parent), 100);
            }
            return this;
          }
          dispatchAction({ type, args, callback }) {
            var _a;
            switch (type) {
              case "reload": {
                const [type2, oid] = args[0].params.split(",");
                (_a = this.$parent) == null ? void 0 : _a.replaceChildren();
                new Feedback(this.$parent, oid, type2, void 0, this.arg.seekId);
                callback == null ? void 0 : callback();
                break;
              }
            }
          }
        };
      }
    });
  }
  /** 修复按时间排序评论翻页数 */
  pageCount() {
    jsonpHook("api.bilibili.com/x/v2/reply?", void 0, (res, url) => {
      var _a;
      if (0 === res.code && ((_a = res.data) == null ? void 0 : _a.page)) {
        if (res.data.page.count) {
          this.count = res.data.page.count;
        } else if (this.count) {
          res.data.page.count = this.count;
        }
      }
      return res;
    }, false);
  }
  /** 预取评论页数 */
  async getPageCount(that) {
    var _a;
    if (that.oid) {
      const res = await apiReply(that.oid, 1, that.pageType);
      ((_a = res.page) == null ? void 0 : _a.count) && (this.count = res.page.count);
    }
  }
  /** 修复评论跳转 */
  jump() {
    jsonpHook.async("x/v2/reply/jump?", void 0, async (url) => {
      var _a, _b;
      const obj = urlObj(url);
      const data = await fetch(`https://api.bilibili.com/x/v2/reply/main?csrf=6c09e4c6405d1369c9e94e0d0a4f6790&mode=3&oid=${obj.oid}&pagination_str=%7B%22offset%22:%22%22%7D&plat=1&seek_rpid=${obj.rpid}&type=${obj.type}`, { credentials: "include" });
      const json = await data.json();
      const { config, control, cursor, seek_root_reply, replies, top, upper } = json.data;
      return {
        code: 0,
        data: {
          config,
          control,
          mode: (_a = cursor.mode) != null ? _a : 3,
          page: { acount: cursor.all_count, count: (_b = this.count) != null ? _b : cursor.all_count, num: 1, rt_num: 1, size: 20 },
          replies: seek_root_reply ? [seek_root_reply].concat(replies) : replies,
          support_mode: cursor.support_mode,
          top,
          upper
        },
        message: "0",
        ttl: 1
      };
    });
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
    this.quickLogin();
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
    const that = this;
    Feedback.prototype.initAbtest = function() {
      this.abtest = {};
      this.abtest.optimize = false;
      if (this.jumpId || this.noPage) {
        this.abtest.optimize = false;
      }
      if (this.appMode === "comic") {
        this.abtest.optimize = false;
      }
      that.getPageCount(this).finally(() => {
        var _a;
        this.init();
        if (!document.querySelector(".b-head")) {
          const div = addElement("div", { class: `b-head` }, void 0, '<span class="b-head-t results"></span><span class="b-head-t">评论</span>');
          const com = document.querySelector(".bb-comment");
          com == null ? void 0 : com.insertAdjacentElement("beforebegin", div);
          (_a = com == null ? void 0 : com.parentElement) == null ? void 0 : _a.classList.add("common");
          addCss(".b-head {    font-size: 18px;    line-height: 24px;    color: #222;    margin: 0 0 20px;}.b-head .results {    margin-right: 10px;}", "b-head");
        }
      });
      this._registerEvent();
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
      var _a, _b;
      const blCon = this._parentBlacklistDom(item, i, pos);
      const con = [
        '<div class="con ' + (pos == i ? "no-border" : "") + '">',
        '<div class="user">' + this._createNickNameDom(item),
        this._createLevelLink(item),
        this._identity(item.mid, item.assist, item.member.fans_detail),
        this._createNameplate(item.member.nameplate) + this._createUserSailing(item) + "</div>",
        this._createMsgContent(item),
        _Comment.resolvePictures && this._resolvePictures(item.content),
        this._createPerfectReply(item),
        '<div class="info">',
        item.floor ? '<span class="floor">#' + item.floor + "</span>" : "",
        this._createPlatformDom(item.content.plat),
        '<span class="time-location">',
        '<span class="reply-time">'.concat(this._formateTime(item.ctime), "</span>"),
        ((_a = item == null ? void 0 : item.reply_control) == null ? void 0 : _a.location) ? `<span class="reply-location">${((_b = item == null ? void 0 : item.reply_control) == null ? void 0 : _b.location) || ""}</span>` : "",
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
      var _a, _b;
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
        ((_a = item == null ? void 0 : item.reply_control) == null ? void 0 : _a.location) ? `<span class="reply-location">${((_b = item == null ? void 0 : item.reply_control) == null ? void 0 : _b.location) || ""}</span>` : "",
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
      if (e) n = $(e);
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
      n.on("click.image-exhibition", ".image-item-img", function(e2) {
        var _a, _b, _c;
        const src = this.src;
        const srcs = [];
        (_b = (_a = this.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.querySelectorAll("img").forEach((d) => {
          srcs.push(d.src);
        });
        srcs.length || srcs.push(src);
        previewImage || (previewImage = new PreviewImage());
        previewImage.value(srcs, (_c = this.parentElement) == null ? void 0 : _c.classList.contains("vertical"), srcs.indexOf(src));
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
      return AV.fromStr(str);
    };
  }
  /** 评论图片 */
  _resolvePictures() {
    Feedback.prototype._resolvePictures = function(content) {
      var _a, _b, _c, _d;
      const pictureList = [];
      if (content) {
        if ((_b = (_a = content.rich_text) == null ? void 0 : _a.note) == null ? void 0 : _b.images) {
          if (!content.pictures) {
            content.pictures = [];
            content.rich_text.note.images.forEach((d) => {
              content.pictures.push({
                img_src: d,
                click_url: content.rich_text.note.click_url
              });
            });
          }
        }
        if (((_d = (_c = content.rich_text) == null ? void 0 : _c.note) == null ? void 0 : _d.click_url) && !content.message.includes(content.rich_text.note.click_url)) {
          pictureList.push(`<a href="${content.rich_text.note.click_url}" target="_blank" style="font-size: 14px;">${content.rich_text.note.click_url}</a>`);
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
  /** 快速登录 */
  quickLogin() {
    Feedback.prototype.quickLogin = function() {
      biliQuickLogin();
    };
  }
};

// src/comment.ts
new Comment();
// @license MIT

})();

