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

// src/tampermonkey/index.ts
(function() {
  const modules = `
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/runtime/format/integer.ts
function integerFormat(num, byte = 2) {
  return num < 10 ** byte ? (Array(byte).join("0") + num).slice(-1 * byte) : num;
}

// src/runtime/format/time.ts
function timeFormat(time = new Date().getTime(), type) {
  const date = new Date(time);
  const arr = date.toLocaleString().split(" ");
  const day = arr[0].split("/");
  day[1] = integerFormat(day[1], 2);
  day[2] = integerFormat(day[2], 2);
  return type ? day.join("-") + " " + arr[1] : arr[1];
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

// src/runtime/do_while.ts
function doWhile(check, callback, delay = 100, stop = 180) {
  let timer = setInterval(() => {
    const d = check();
    if (d) {
      clearInterval(timer);
      callback(d);
    }
  }, delay);
  stop && setTimeout(() => clearInterval(timer), stop * 1e3);
}

// src/runtime/lib/typeof.ts
var isArray = Array.isArray;
var isObject = (val) => val !== null && typeof val === "object";

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

// src/runtime/variable/mutex.ts
var mutex = Math.random().toString(36).substring(2);

// src/runtime/gm.ts
var xhrGM = [];
var getValue = [];
var cookiesEs = [];
window.addEventListener("message", (ev) => {
  if (GM_getValue)
    return GM_getValue("config");
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
  xmlHttpRequest(input, init) {
    return new Promise((resolve, reject) => {
      window.postMessage({
        \$type: "xhrGM",
        data: {
          index: xhrGM.push([resolve, reject]) - 1,
          input,
          init,
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
    const obj = {};
    obj[key] = value;
    window.postMessage({
      \$type: "setValue",
      data: obj
    });
  },
  deleteValue(...key) {
    window.postMessage({
      \$type: "setValue",
      data: key
    });
  },
  cookie() {
    return new Promise((resolve, reject) => {
      const host = location.host;
      const arr = host.split(".");
      arr.length > 2 && arr.shift();
      window.postMessage({
        \$type: "getCookies",
        data: {
          url: arr.join("."),
          index: cookiesEs.push([resolve, reject]) - 1,
          flag: mutex
        }
      });
    });
  }
};

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
function get(t, p, r) {
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
        const res = get(target, key, receiver);
        const targetIsArray = isArray(res);
        if (isObject(res) || targetIsArray) {
          return new Proxy(res, new ProxyHandler(callback));
        }
        return res;
      },
      set: (target, key, value, receiver) => {
        value !== get(target, key, receiver) && Promise.resolve().then(() => callback());
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
  if (GM_getValue) {
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
    const root = this.attachShadow({ mode: "closed" });
    root.appendChild(createElements(htmlVnode(toast_default)));
    this.container = root.children[0];
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
function get2(url, details = {}, cache = false) {
  !Reflect.has(details, "credentials") && (details.credentials = true);
  return xhr({ url, ...details }, cache);
}
xhr.get = get2;
function post(url, data, contentType = "application/x-www-form-urlencoded", details = {}, cache = false) {
  !Reflect.has(details, "credentials") && (details.credentials = true);
  details.headers = { "Content-Type": contentType, ...details.headers };
  return xhr({ url, method: "POST", data, ...details }, cache);
}
xhr.port = post;

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
  return function(message) {
    return new Md5(true).update(message)[outputType]();
  };
};
var createMethod = function() {
  let method = createOutputMethod("hex");
  method.create = function() {
    return new Md5();
  };
  method.update = function(message) {
    return method.create().update(message);
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
  update(message) {
    if (this.finalized) {
      return;
    }
    message = typeof message === "number" ? message + "" : message;
    let notString, type = typeof message;
    if (type !== "string") {
      if (type === "object") {
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
    let code, index = 0, i, length = message.length, blocks2 = this.blocks;
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
            buffer82[i++] = message[index];
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            blocks2[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        }
      } else {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
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
              code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
              buffer82[i++] = 240 | code >> 18;
              buffer82[i++] = 128 | code >> 12 & 63;
              buffer82[i++] = 128 | code >> 6 & 63;
              buffer82[i++] = 128 | code & 63;
            }
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
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
              code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
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
    return gm ? GM.xmlHttpRequest(this.jsonUrlDefault[url].appkey > 0 ? urlsign(str, void 0, this.jsonUrlDefault[url].appkey) : str, { credentials: "include" }).then((d) => JSON.parse(d)) : xhr({
      url: this.jsonUrlDefault[url].appkey > 0 ? urlsign(str, void 0, this.jsonUrlDefault[url].appkey) : str,
      responseType: "json",
      credentials: true
    });
  }
};
var urlPack = new UrlPack();

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

// src/runtime/format/sub_array.ts
function subArray(res, num = 1) {
  const arr = [...res];
  const out = [];
  num = num || 1;
  num = num < arr.length ? num : arr.length;
  while (out.length < num) {
    var temp = Math.random() * arr.length >> 0;
    out.push(arr.splice(temp, 1)[0]);
  }
  return num === 1 ? out[0] : out;
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
      const curveParameterToFunc = (param) => {
        const o = bezier(...param);
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

// src/runtime/variable/path.ts
var path = location.href.split("/");

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
    const param = { ep_id: epid, season_id: ssid };
    let data = jsonCheck(await xhr({ url: objUrl("https://bangumi.bilibili.com/view/web_api/season", param) }, true)).result;
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
  GM,
  urlParam,
  xhr,
  urlsign,
  objUrl,
  urlObj,
  URLEs
};
setting.development && Reflect.set(window, "API", API);

// src/content/comment.ts
var Feedback;
var loading = false;
var load = false;
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
      if (load) {
        let initComment2 = function(tar, init) {
          new Feedback(tar, init.oid, init.pageType, init.userStatus);
        };
        var initComment = initComment2;
        Object.defineProperty(window, "initComment", { configurable: true, value: initComment2 });
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
var _default = {};

// src/content/message/message.ts
function messagePage() {
  addCss(_default);
}

// src/content/player/bnj.css
var _default2 = {};

// src/content/player/bnj.ts
function bnj() {
  addCss(_default2);
  window.bnj = false;
  const arr = [];
  doWhile(() => window.__INITIAL_STATE__, () => {
    const node2 = document.querySelector("#bilibili-player").parentElement;
    const root = node2.attachShadow({ mode: "closed" });
    const iframe = document.createElement("iframe");
    iframe.src = \`https://www.bilibili.com/blackboard/html5player.html?aid=\${window.__INITIAL_STATE__.videoInfo.aid}&cid=\${window.__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1&bnj=1\`;
    iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
    root.appendChild(iframe);
  });
  Object.defineProperty(window, "EmbedPlayer", {
    configurable: true,
    set: (v) => {
      if (!window.bnj) {
        arr.unshift(v);
      }
    },
    get: () => {
      if (window.bnj) {
        Object.defineProperty(window, "EmbedPlayer", { configurable: true, value: arr[0] });
        return arr[0];
      } else {
        return function() {
          setTimeout(() => window.EmbedPlayer(...arguments), 100);
        };
      }
    }
  });
}

// src/content/avatar_animation.css
var _default3 = {};

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
  debug(t);
  header(menu);
  styleClear();
}
function section() {
  addCss(".nav-item.live {width: auto;}.lt-row {display: none !important;}");
  doWhile(() => document.querySelector("#internationalHeader"), replaceHeader);
  doWhile(() => document.querySelector("#biliMainHeader"), replaceHeader);
  doWhile(() => document.querySelector(".z-top-container"), replaceHeader);
  doWhile(() => document.querySelector(".z_top_container"), (t) => {
    t.setAttribute("class", "z-top-container has-menu");
    document.querySelector(".header")?.remove();
    header(true);
  });
  doWhile(() => document.querySelector(".international-footer") || document.querySelector("#biliMainFooter"), (t) => {
    t.setAttribute("class", "footer bili-footer report-wrap-module");
    t.setAttribute("id", "home_footer");
    footer();
    styleClear();
  });
  doWhile(() => document.querySelector("#bili-header-m"), () => {
    addCss(_default3);
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
    GM.xmlHttpRequest(\`https://account.bilibili.com/api/member/getCardByMid"?mid=\${mid}\`).then((d) => {
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

// src/content/space/lost_video.ts
async function getLostVideo(aid) {
  let result = [];
  try {
    let data = await GM.xmlHttpRequest(\`https://www.biliplus.com/video/av\${aid}\`);
    if (data.match(/\\<title\\>.+?\\ \\-\\ AV/)) {
      result[0] = data.match(/\\<title\\>.+?\\ \\-\\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
      result[1] = data.match(/\\<img style=\\"display:none\\"\\ src=\\".+?\\"\\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
    }
  } catch (e) {
    debug.error("lostVideo.js", e);
  }
  if (!result[0] || !result[1]) {
    try {
      let data = await GM.xmlHttpRequest(\`https://www.biliplus.com/all/video/av\${aid}/\`);
      if (data.match("/api/view_all?")) {
        data = data.match(/\\/api\\/view_all\\?.+?\\',cloudmoe/)[0].replace(/\\',cloudmoe/, "");
        data = await GM.xmlHttpRequest(\`//www.biliplus.com\${data}\`);
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
      let data = await GM.xmlHttpRequest(\`https://www.jijidown.com/video/\${aid}\`);
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
  if (!sessionStorage2.getItem("rebuild")) {
    setting.section && section();
    setting.comment && loadComment();
  } else {
    addCss(_default3);
  }
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
    if (GM_getValue)
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
}

// src/content/index/code.ts
function indexPage() {
  keepNewCheck();
  sessionStorage2.setItem("rebuild", true);
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
    let arr = void 0;
    switch (obj.searchParams.get("rid")) {
      case "23":
        arr = [document.querySelector("#ranking_movie"), 2, "/ranking/cinema/23/0/3"];
        break;
      case "11":
        arr = [document.querySelector("#ranking_teleplay"), 5, "/ranking/cinema/11/0/3"];
        break;
      case "177":
        arr = [document.querySelector("#ranking_documentary"), 3, "/ranking/cinema/177/0/3"];
        break;
    }
    if (arr) {
      fetch(\`https://api.bilibili.com/pgc/season/rank/web/list?season_type=\${arr[1]}&day=3\`).then((d) => d.json()).then((d) => {
        const data = jsonCheck(d).data;
        let html = \`<header class="rank-head"><h3>排行</h3><div class="bili-dropdown rank-dropdown"><span class="selected">三日</span><i class="icon icon-arrow-down"></i><ul class="dropdown-list"><li class="dropdown-item" style="display: none;">三日</li><li class="dropdown-item">一周</li></ul></div></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list">\`;
        for (let i = 0; i < 8; i++) {
          html += \`<li class="rank-item\${i < 3 ? " highlight" : ""}"><i class="ri-num">\${i + 1}</i><a href="\${data.list[i].url}" target="_blank" title="\${data.list[i].title} 播放:\${data.list[i].stat.view}" class="ri-info-wrap"><p class="ri-title">\${data.list[i].title}</p><span class="ri-total">\${data.list[i].new_ep.index_show}</span></a></li>\`;
        }
        html += \`</ul></div><a href="\${arr[2]}" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>\`;
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
        arr[0].replaceChildren(createElements(vnode));
      }).catch((e) => {
        debug.error(arr[0], e);
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

// src/tampermonkey/vector.ts
replaceUrl(urlClean(location.href));
if (setting.index && path[2] == "www.bilibili.com" && (!path[3] || (path[3].startsWith("?") || path[3].startsWith("#") || path[3].startsWith("index.")))) {
  indexPage();
}
// @license MIT
`;
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
