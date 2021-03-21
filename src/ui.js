/**
 * @module ui
 * @description 设置UI绘制
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main  */
    const config = BLOD.config; /** @see main */
    const toast = BLOD.toast; /** @see debug */

    class Ui {
        constructor() {
            console.debug('import module "ui.js"');
            // 将设置以主键名进行分类，未分类的将单独绘制
            this.menu = ["播放", "弹幕", "修复", "样式", "直播"];
            this.item = [
                ["static", "viewbofqi", "widescreen", "electric", "panel", "autoplay", "playerStyle"],
                ["danmuku", "livechat", "selectdanmu", "midcrc", "danmakuoff", "localDanmaku", "concatDanmaku"],
                ["replyfloor", "preview", "jointime", "lostvideo", "bvid2av", "like", "heartbeat", "carousel"],
                ["grobalboard", "headblur", "episodedata", "adloc", "history", "oldreply", "uplist", "indexIcon", "commentjump", "searchHistory"],
                ["roomplay", "nosleep", "noanchor", "nopkvm", "nop2p"],
            ]
            this.init();
        }
        /**
         * 恢复默认设置
         */
        flesh() {
            for (let key in BLOD.defaultConfig.rewrite) if (key in config.rewrite) config.rewrite[key] = BLOD.defaultConfig.rewrite[key][0];
            for (let key in BLOD.defaultConfig.reset) if (key in config.reset) config.reset[key] = BLOD.defaultConfig.reset[key][0];
            BLOD.setValue("config", config);
            BLOD.reset.accesskey();
            toast("恢复默认数据！", "刷新页面以立即生效");
        }
        /**
         * 浮动信息
         * @param {HTMLElement} div 鼠标所在节点
         * @param {string} msg 浮动信息字符串，可以包含HTML节点
         */
        state(div, msg) {
            div.onmouseover = () => {
                let state = BLOD.addElement("div", { id: "BLOD-UI-state" });
                state.innerHTML = msg;
            }
            div.onmouseout = () => {
                let state = document.querySelector("#BLOD-UI-state");
                if (state) state.remove();
            }
        }
        /**
         * 绘制设置入口
         */
        init() {
            let div = document.createElement("div"), timer;
            div.setAttribute("class", "BLOD-UI-face");
            div.setAttribute("id", "BLOD-UI-face");
            div.setAttribute("style", "right : -54px;");
            div.onmouseover = () => div.setAttribute("style", "right : 0px;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);");
            div.onmouseout = () => div.setAttribute("style", "right : -54px;");
            div.onclick = () => this.table();
            div.innerHTML = "<i></i><span>设置</span>";
            (timer = () => {
                setTimeout(() => { document.body ? document.body.appendChild(div) : timer() }, 100);
            })();
        }
        /**
         * 绘制设置面板
         */
        table() {
            let table = document.querySelector("#BLOD-UI-table");
            if (table) return;
            table = BLOD.addElement("div", { id: "BLOD-UI-table" });
            table.innerHTML = '<div class="BLOD-UI-title">Bilibili Old<span id="BLOD-UI-flesh">恢复默认</span><b id="BLOD-UI-close">❌</b></div><div><div id="BLOD-UI-left"><ul><li>重写</li></ul></div><div id="BLOD-UI-right"></div></div>';
            this.left = table.children[1].children[0].children[0];
            this.right = table.children[1].children[1];
            this.left.children[0].setAttribute("id", "BLOD-UI-menu");
            this.left.children[0].onclick = () => {
                document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                this.left.children[0].setAttribute("id", "BLOD-UI-menu");
                this.right.innerHTML = '';
                for (let key in config.rewrite) { this.checked(key, true) }
            }
            table.children[0].children[0].onclick = () => {
                this.flesh();
                table.remove();
            }
            table.children[0].children[1].onclick = () => {
                let state = document.querySelector("#BLOD-UI-state");
                if (state) state.remove();
                table.remove();
                toast("设置已保存", "部分功能可能需要刷新才会生效！")
            }
            this.menu.forEach((d, i) => {
                let li = BLOD.addElement("li", {}, this.left);
                li.innerHTML = d;
                li.onclick = () => {
                    document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                    li.setAttribute("id", "BLOD-UI-menu");
                    this.right.innerHTML = '';
                    this.item[i].forEach(d => { this.checked(d) });
                    if (i == 1) this.danmaku();
                }
            })
            this.download();
            this.limit();
            this.toast();
            this.left.children[0].click();
        }
        /**
         * 创建复选框
         * @param {string} d 设置选项主键名
         * @param {boolean} [type] 有效则主键在config.rewrite下
         * @param {{}} [style] 该功能定制css样式
         * @param {Function} [en] 启用功能时的回调，传入该功能节点作为参数以修改修改显示
         * @param {Function} [dis] 禁用该功能时的回调，传入该功能节点作为参数以修改修改显示
         */
        checked(d, type, style = {}, en = () => { }, dis = () => { }) {
            type = type ? "rewrite" : "reset";
            let div = BLOD.addElement("div", style, this.right);
            div.innerHTML = `<label><input type="checkbox" />${BLOD.defaultConfig[type][d][1]}</label>`;
            this.state(div, BLOD.defaultConfig[type][d][2]);
            if (config[type][d]) div.children[0].children[0].checked = true;
            div.querySelector("input").onclick = () => {
                if (config[type][d]) {
                    toast.warning("禁用功能：" + BLOD.defaultConfig[type][d][1]);
                    config[type][d] = 0;
                    BLOD.setValue("config", config);
                    dis(div);
                } else {
                    toast.success("启用功能：" + BLOD.defaultConfig[type][d][1]);
                    config[type][d] = 1;
                    BLOD.setValue("config", config);
                    en(div);
                }
            }
        }
        /**
         * 创建输入框
         * @param {string} name 输入框前面的提示文字
         * @param {string} [type] 输入框类型，text、url、file、checkbox。。。
         * @param {string} [placeholder] 输入框置空时显示的文本
         * @param {string} [value] 输入框预显示的文本
         * @param {string} [button] 输入框按钮上的文字
         * @param {string} [toast] 鼠标移到输入框时显示的提示
         * @param {Function} [callback] 输入框输入文本处理程序
         */
        input(name, type = "text", placeholder = "", value = "", button = "确认", toast, callback) {
            let custom = BLOD.addElement("div", {}, this.right);
            custom.innerHTML = `${name}<input type="${type}" placeholder="${placeholder}"> <button>${button}</button>`;
            if (toast) this.state(custom, toast);
            let commit = custom.querySelector("button");
            let input = custom.querySelector("input");
            if (value) input.value = value;
            if (callback) {
                commit.onclick = () => callback(input.value);
                input.onkeydown = (e) => {
                    if (e.which == 13) callback(input.value);
                }
            }
        }
        /**
         * 弹幕菜单，这里可能之后会定制其他功能
         */
        danmaku() {
            if (window.player && BLOD.path.name) {
                // 载入其他视频弹幕
                let config = BLOD.getValue("onlineDanmaku") || {};
                let value = (BLOD.cid && config[BLOD.cid]) ? "aid=" + config[BLOD.cid][0] + "&cid=" + config[BLOD.cid][1] : "";
                this.input("载入其他视频弹幕", "url", "av2", value, "载入", "为当前视频载入其他视频弹幕，请输入对应视频链接</br>支持短链接，如av50619577或者ss3398</br>也支持参数形式，如aid=50619577或者ssid=3398", (value) => {
                    new BLOD.onlineDanmaku(value, this.right);
                })
                if (!BLOD.uid) return;
                // 载入全弹幕装填功能
                let div = BLOD.addElement("div", { "style": "display: flex;align-items: center;justify-content: space-between;white-space: nowrap;" }, this.right);
                div.innerHTML = '<label><input type="button" value="全弹幕装填"></label><label>接口冷却时间：<input type="number" min="1" max="60" step="1">秒</label>';
                this.state(div, "为当前视频装填全部历史弹幕，可能会耗费一定时间，具体取决与视频历史弹幕总量以及设定的接口冷却时间。</br>※接口冷却时间请尽量设置大一点，以免短时间内大量请求触发【临时端口封禁】，默认5秒/次。</br>※端口封禁时间未知，若被禁短时间内（24h?）请不要再使用该功能！</br>※另外由于历史弹幕池一天有上限，若是那天发送弹幕数超过上限而又已被挤出普通弹幕池的话将无法获取，而新版历史弹幕改版时很多代码弹幕就此丢失(ಥ_ಥ)，所以最终弹幕总量可能小于实际弹幕总量。");
                let button = div.children[0].children[0];
                let step = div.children[1].children[0];
                let delay = BLOD.getValue("allDanmaku") || {};
                step.value = delay.delay || 5;
                button.onclick = () => {
                    new BLOD.AllDanmaku(step.value, button);
                }
                step.oninput = () => {
                    // 保存延时设定
                    if (!/^\d+$/.test(step.value) || step.value > 60 || step.value < 1) return;
                    delay.delay = step.value;
                    BLOD.setValue("allDanmaku", delay);
                }
            }
        }
        /**
         * 下载菜单，这里之后可能会定制其他功能
         */
        download() {
            let li = BLOD.addElement("li", {}, this.left);
            li.innerHTML = "下载";
            li.onclick = () => {
                document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                li.setAttribute("id", "BLOD-UI-menu");
                this.right.innerHTML = '';
                this.checked("download");
                this.checked("dlother");
                this.checked("novideo");
                this.checked("ef2");
                this.input("自定义链接", "url", "http://www.example.com", "", "下载", "输入视频所在链接URL，回车或者点击“下载”按钮即可</br>暂不支持获取弹幕等其他信息", (value) => {
                    if (!BLOD.download) new Function(BLOD.getResourceText("download"))();
                    if (value) BLOD.download(value);
                    else toast.warning("请输入有效的视频链接", "</br>支持短链接，如av50619577或者ss3398", "也支持参数形式，如aid=50619577或者ssid=3398");
                })
            }
        }
        /**
         * 区域限制，这里之后可能会定制其他功能
         */
        limit() {
            let li = BLOD.addElement("li", {}, this.left);
            li.innerHTML = "区域";
            li.onclick = () => {
                document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                li.setAttribute("id", "BLOD-UI-menu");
                this.right.innerHTML = '';
                this.checked("limit");
                this.checked("accesskey", false, {}, BLOD.reset.accesskey, BLOD.reset.accesskey);
                let thaiLand = BLOD.addElement("div", {}, this.right);
                thaiLand.innerHTML = '代理服务器（东南亚）<input type="url" placeholder="http://www.example.com"> <button>保存</button>'
                this.state(thaiLand, "请输入解除限制时所需的东南亚代理服务器地址，用以解除东南亚区域番剧限制</br>东南亚番剧账户与主站不互通，只能播放480P，启用账号授权也无效！</br>链接有效形式如输入框提示：需带http/https头，末尾无需斜杠！")
                let commit = thaiLand.querySelector("button");
                let input = thaiLand.querySelector("input");
                input.value = decodeURI(BLOD.getValue("thaiLand") || "");
                let callback = () => {
                    if (input.value && /^http.+$/.test(input.value)) {
                        if (input.value[input.value.length - 1] == "/") input.value = input.value.substr(0, input.value.length - 1);
                        BLOD.setValue("thaiLand", encodeURI(input.value));
                        toast.success("代理服务器（东南亚）已保存！", "URL：" + input.value);
                    } else {
                        toast.warning("请输入有效服务器链接！")
                    }
                }
                commit.onclick = callback;
                input.onkeydown = (e) => {
                    if (e.which == 13) callback();
                }
            }
        }
        /**
         * 其他功能，这里之后可能会定制其他功能
         */
        toast() {
            let li = BLOD.addElement("li", {}, this.left);
            li.innerHTML = "其他";
            li.onclick = () => {
                document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                li.setAttribute("id", "BLOD-UI-menu");
                this.right.innerHTML = '';
                this.checked("toast");
                let timeout = BLOD.addElement("div", {}, this.right);
                timeout.innerHTML = '<label>通知时长：<input type="number" min="1" max="30" />秒</label>';
                this.state(timeout, "调整每条通知浮动时长，单位/秒");
                timeout = timeout.children[0].children[0];
                timeout.value = BLOD.toast.config.timeout;
                timeout.oninput = () => {
                    if (!/^\d+$/.test(timeout.value) || timeout.value > 30 || timeout.value < 1) return;
                    BLOD.toast.config.timeout = timeout.value;
                    BLOD.toast.change(BLOD.toast.config);
                    toast.success("调整通知时长：" + timeout.value + " 秒");
                }
                let step = BLOD.addElement("div", {}, this.right);
                step.innerHTML = '<label>同时出现通知延时：<input type="number" min="50" max="1000" step="50"/>豪秒</label>';
                this.state(step, "调整多条通知同时出现的时间间隔，方便逐条阅读每条通知内容，单位/毫秒")
                step = step.children[0].children[0];
                step.value = BLOD.toast.config.step;
                step.oninput = () => {
                    if (!/^\d+$/.test(step.value) || step.value > 1000 || step.value < 50) return;
                    BLOD.toast.config.step = step.value;
                    BLOD.toast.change(BLOD.toast.config);
                    toast.success("调整通知延时：" + step.value + " 毫秒");
                }
                let button = BLOD.addElement("div", {}, this.right);
                button.innerHTML = '<label><input type="button" value="恢复默认" /></label>';
                button.onclick = () => {
                    let config = BLOD.toast.change();
                    timeout.value = config.timeout;
                    step.value = config.step;
                }
                this.other();
            }
        }
        async other() {
            try {
                // 获取番剧情报
                if (!this.bangumi) {
                    this.bangumi = [];
                    this.appdata = this.appdata || BLOD.jsonCheck(await BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/pgc/page/bangumi", { build: 6205500, c_locale: "zh_CN", channel: "master", fnval: 464, fnver: 0, fourk: 1, mobi_app: "android", platform: "android", qn: 0, s_locale: "zh_CN" })));
                    this.appdata.result.modules.forEach(d => {
                        if (d.title.includes("功能入口")) {
                            d.items.forEach(d => {
                                if (d.title.includes("新番")) this.bangumi.push(d);
                                if (d.title.includes("限免")) this.bangumi.push(d);
                                if (d.title.includes("推荐")) this.bangumi.push(d);
                            })
                        }
                    })
                }
                BLOD.addElement("hr", {}, this.right);
                BLOD.addElement("br", {}, this.right);
                this.bangumi.forEach(d => {
                    if (d) {
                        if (d.link.includes("bilibili:/")) return;
                        d.link = d.link.replace("http:", "https://").replace("m.bili", "www.bili");
                        let div = BLOD.addElement("div", { "style": "display: flex;align-items: center;justify-content: center;white-space: nowrap;" }, this.right);
                        div.innerHTML = `<a href="${d.link}" target="_blank">${d.title}</a>`;
                    }
                })
                BLOD.addElement("div", { style: "position: absolute;bottom: 5%;left: 58%;transform: translateX(-50%);font-family: fangsong;" }, this.right).innerHTML = "永言配命 自求多福";
            } catch (e) { }
        }
    }

    if (window.self == window.top) new Ui();
})()
