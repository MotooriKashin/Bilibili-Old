/**
 * @module ui
 * @description 设置UI绘制
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    const BLOD = window.BLOD;
    const toast = BLOD.toast;
=======
    const BLOD = window.BLOD; /** @see main  */
    const config = BLOD.config; /** @see main */
    const toast = BLOD.toast; /** @see debug */
>>>>>>> eea4f89 (重绘设置界面)
=======
    // @ts-ignore
=======
>>>>>>> 39d49de (remove eslint rules)
    const BLOD = window.BLOD; /** @see main  */
    const toast = BLOD.toast; /** @see debug */
>>>>>>> 2f00fde (format with JsDoc)

    class Ui {
        constructor() {
            console.debug('import module "ui.js"');
<<<<<<< HEAD
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
=======
            // 将设置进行分类
            this.menu = ["播放", "弹幕", "修复", "样式", "直播"];
            this.item = [
                ["static", "viewbofqi", "widescreen", "electric", "panel", "autoplay", "playerStyle"],
                ["danmuku", "livechat", "selectdanmu", "midcrc", "danmakuoff"],
                ["replyfloor", "preview", "jointime", "lostvideo", "bvid2av", "like", "heartbeat", "carousel"],
                ["grobalboard", "headblur", "episodedata", "adloc", "history", "oldreply", "uplist", "indexIcon", "commentjump"],
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
>>>>>>> eea4f89 (重绘设置界面)
        }
        /**
<<<<<<< HEAD
         * 恢复默认设置
         */
        flesh() {
            for (let key in BLOD.defaultConfig.rewrite) if (key in config.rewrite) config.rewrite[key] = BLOD.defaultConfig.rewrite[key][0];
            for (let key in BLOD.defaultConfig.reset) if (key in config.reset) config.reset[key] = BLOD.defaultConfig.reset[key][0];
            BLOD.setValue("config", config);
            BLOD.reset.accesskey();
            toast("恢复默认数据！", "刷新页面以立即生效");
        }
<<<<<<< HEAD
=======
         * 绘制设置入口
         */
<<<<<<< HEAD
>>>>>>> 2f00fde (format with JsDoc)
        init(timer) {
            let face = document.createElement("div");
            let attribute = {
                "class": "bili-old ui-face",
                "id": "ui-face",
                "style": "right : -54px;"
            }
            for (let key in attribute) face.setAttribute(key, attribute[key]);
            face.onmouseover = () => face.setAttribute("style", "right : 0px;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);");
            face.onmouseout = () => face.setAttribute("style", "right : -54px;");
            face.onclick = () => {
                let check = document.getElementsByClassName("ui-table")[0];
                if (!check) this.table(); else if (check.getAttribute("hidden")) check.removeAttribute("hidden");
            }
            face.innerHTML = "<i></i><span>设置</span>";
=======
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
=======
>>>>>>> eea4f89 (重绘设置界面)
        init() {
            let div = document.createElement("div"), timer;
            div.setAttribute("class", "BLOD-UI-face");
            div.setAttribute("id", "BLOD-UI-face");
            div.setAttribute("style", "right : -54px;");
            div.onmouseover = () => div.setAttribute("style", "right : 0px;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);");
            div.onmouseout = () => div.setAttribute("style", "right : -54px;");
            div.onclick = () => this.table();
            div.innerHTML = "<i></i><span>设置</span>";
<<<<<<< HEAD
>>>>>>> eea4f89 (重绘设置界面)
=======
>>>>>>> eea4f89 (重绘设置界面)
            (timer = () => {
                setTimeout(() => { document.body ? document.body.appendChild(div) : timer() }, 100);
            })();
        }
<<<<<<< HEAD
<<<<<<< HEAD
=======
        /**
         * 绘制设置面板
         */
<<<<<<< HEAD
>>>>>>> 2f00fde (format with JsDoc)
        table(timer) {
            let table = document.createElement("div");
            let config = BLOD.config;
            table.setAttribute("class", "bili-old ui-table");
            table.setAttribute("id", "ui-table");
            table.innerHTML = '<span style="color : rgb(0,0,0);font-size : 14px;">BilibiliOld 设置</span><span style="color : blue;float : right;font-size : 12px;">恢复默认</span>';
            document.body.appendChild(table);
            table.children[1].onclick = () => {
                for (let key in BLOD.defaultConfig.rewrite) if (key in config.rewrite) config.rewrite[key] = BLOD.defaultConfig.rewrite[key][0];
                for (let key in BLOD.defaultConfig.reset) if (key in config.reset) config.reset[key] = BLOD.defaultConfig.reset[key][0];
                BLOD.setValue("config", config);
                BLOD.reset.accesskey();
                table.remove();
<<<<<<< HEAD
                toast.warning("已恢复默认数据", "刷新页面以立即生效");
<<<<<<< HEAD
=======
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
=======
>>>>>>> 43b3ef7 (启用toast模块)
            }
            table.children[0].children[0].onclick = () => {
                this.flesh();
                table.remove();
>>>>>>> eea4f89 (重绘设置界面)
=======
                toast("恢复默认数据！", "刷新页面以立即生效");
>>>>>>> 760e38a (Update JavaScript module)
=======
        table() {
            let table = document.querySelector("#BLOD-UI-table");
            if (table) return;
            table = BLOD.addElement("div", { id: "BLOD-UI-table" });
            table.innerHTML = '<div class="BLOD-UI-title">Bilibili Old<span id="BLOD-UI-flesh">恢复默认</span><b id="BLOD-UI-close">❌</b></div><div><div id="BLOD-UI-left"><ul><li>重写</li></ul></div><div id="BLOD-UI-right"></div></div>';
            let left = table.children[1].children[0].children[0];
            let right = table.children[1].children[1];
            left.children[0].setAttribute("id", "BLOD-UI-menu");
            left.children[0].onclick = () => {
                document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                left.children[0].setAttribute("id", "BLOD-UI-menu");
                right.innerHTML = '';
                for (let key in config.rewrite) { this.checked(key, right, true) }
            }
            table.children[0].children[0].onclick = () => {
                this.flesh();
                table.remove();
>>>>>>> eea4f89 (重绘设置界面)
            }
            table.children[0].children[1].onclick = () => {
                table.remove();
                toast("设置已保存", "部分功能可能需要刷新才会生效！")
            }
            this.menu.forEach((d, i) => {
<<<<<<< HEAD
                let li = BLOD.addElement("li", {}, this.left);
=======
                let li = BLOD.addElement("li", {}, left);
>>>>>>> eea4f89 (重绘设置界面)
                li.innerHTML = d;
                li.onclick = () => {
                    document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                    li.setAttribute("id", "BLOD-UI-menu");
<<<<<<< HEAD
                    this.right.innerHTML = '';
                    this.item[i].forEach(d => { this.checked(d) });
                }
            })
            this.download(this.left, this.right);
            this.limit(this.left, this.right);
            this.toast(this.left, this.right);
            this.left.children[0].click();
=======
                    right.innerHTML = '';
                    this.item[i].forEach(d => { this.checked(d, right) });
                }
            })
            this.download(left, right);
            this.limit(left, right);
            this.toast(left, right);
            left.children[0].click();
>>>>>>> eea4f89 (重绘设置界面)
        }
        /**
         * 创建复选框
         * @param {string} d 设置选项主键名
<<<<<<< HEAD
=======
         * @param {HTMLElement} tar 复选框所在父节点
>>>>>>> eea4f89 (重绘设置界面)
         * @param {boolean} [type] 有效则主键在config.rewrite下
         * @param {object} [style] 该功能定制css样式
         * @param {Function} [en] 启用功能时的回调，传入该功能节点作为参数以修改修改显示
         * @param {Function} [dis] 禁用该功能时的回调，传入该功能节点作为参数以修改修改显示
         */
<<<<<<< HEAD
        checked(d, type, style = {}, en = () => { }, dis = () => { }) {
            type = type ? "rewrite" : "reset";
            let div = BLOD.addElement("div", style, this.right);
            div.innerHTML = `<label><input type="checkbox" />${BLOD.defaultConfig[type][d][1]}</label>`;
            this.state(div, BLOD.defaultConfig[type][d][2]);
            if (config[type][d]) div.children[0].children[0].checked = true;
            div.querySelector("input").onclick = () => {
=======
        checked(d, tar, type, style = {}, en = () => { }, dis = () => { }) {
            type = type ? "rewrite" : "reset";
            let div = BLOD.addElement("div", style, tar);
            div.innerHTML = `<label><input type="checkbox" />${BLOD.defaultConfig[type][d][1]}</label>`;
            div.onmouseover = () => {
                let state = BLOD.addElement("div", { id: "BLOD-UI-state" });
                state.innerHTML = BLOD.defaultConfig[type][d][2];
            }
            div.onmouseout = () => {
                let state = document.querySelector("#BLOD-UI-state");
                if (state) state.remove();
            }
            if (config[type][d]) div.children[0].children[0].checked = true;
            div.onclick = () => {
>>>>>>> eea4f89 (重绘设置界面)
                if (config[type][d]) {
                    toast.warning("禁用功能：" + BLOD.defaultConfig[type][d][1]);
                    config[type][d] = 0;
                    BLOD.setValue("config", config);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> eea4f89 (重绘设置界面)
                    dis(div);
                } else {
                    toast.success("启用功能：" + BLOD.defaultConfig[type][d][1]);
                    config[type][d] = 1;
                    BLOD.setValue("config", config);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                    toast.warning("设置数据已保存", "部分功能需要刷新页面才会生效！")
=======
                    toast.success("设置数据已保存", "部分功能需要刷新页面才会生效！")
>>>>>>> 43b3ef7 (启用toast模块)
=======
                    toast("设置数据已保存！", "可能需要刷新页面才会生效！")
>>>>>>> 760e38a (Update JavaScript module)
                }, 500);
=======
                    en(div);
                }
            }
        }
        /**
         * 下载菜单，这里之后可能会定制其他功能
         * @param {HTMLElement} left 菜单左边节点
         * @param {HTMLElement} right 菜单右侧节点
         */
        download(left, right) {
            let li = BLOD.addElement("li", {}, left);
            li.innerHTML = "下载";
            li.onclick = () => {
                document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                li.setAttribute("id", "BLOD-UI-menu");
                right.innerHTML = '';
                this.checked("download", right);
                this.checked("dlother", right);
>>>>>>> eea4f89 (重绘设置界面)
            }
        }
        /**
         * 区域限制，这里之后可能会定制其他功能
         * @param {HTMLElement} left 菜单左边节点
         * @param {HTMLElement} right 菜单右侧节点
         */
<<<<<<< HEAD
        setTable(table, name, check, key) {
            let setTable = document.createElement("div");
            let config = BLOD.config;
            setTable.setAttribute("style", "padding : 4px 4px 0px 4px;clear : both;");
            setTable.innerHTML = '<span style="float : left;display : inline-block;color : rgb(0,0,0);font-size : 14px;"></span><input type="checkbox" class="checke">';
            setTable.onmouseover = () => {
                let toast = document.createElement("div");
                toast.setAttribute("class", "bili-old ui-state");
                toast.setAttribute("id", "ui-state");
                toast.innerHTML = name[2];
                document.body.appendChild(toast);
=======
                    en(div);
                }
            }
<<<<<<< HEAD
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
                let custom = BLOD.addElement("div", {}, this.right);
                custom.innerHTML = '自定义链接<input type="url" placeholder="http://www.example.com"> <button>下载</button>';
                this.state(custom, "输入视频所在链接URL，回车或者点击“下载”按钮即可</br>暂不支持获取弹幕等其他信息")
                let commit = custom.querySelector("button");
                let input = custom.querySelector("input");
                let callback = () => {
                    if (!BLOD.download) new Function(BLOD.getResourceText("download"))();
                    if (input.value) BLOD.download(input.value);
                    else toast.warning("请输入有效的视频链接", "支持完整av/BV/bangumi链接，如https://www.bilibili.com/video/av50619577", "也支持视频关键参数，如aid、bvid、ssid、epid");
                }
                commit.onclick = callback;
                input.onkeydown = (e) => {
                    if (e.which == 13) callback();
                }
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
<<<<<<< HEAD
                right.innerHTML = '';
                this.checked("limit", right);
                this.checked("accesskey", right, false, {}, BLOD.reset.accesskey, BLOD.reset.accesskey);
<<<<<<< HEAD
>>>>>>> eea4f89 (重绘设置界面)
=======
                let thaiLand = BLOD.addElement("div", {}, right);
=======
                this.right.innerHTML = '';
                this.checked("limit");
                this.checked("accesskey", false, {}, BLOD.reset.accesskey, BLOD.reset.accesskey);
                let thaiLand = BLOD.addElement("div", {}, this.right);
>>>>>>> 69fdcaa (Feature refactor)
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
=======
            setTable.onmouseout = () => document.getElementById("ui-state") ? document.getElementById("ui-state").remove() : "";
            setTable.children[0].innerText = name[1];
            setTable.children[1].onclick = () => {
                if (setTable.children[1].checked) {
                    if (key in config.rewrite) {
                        config.rewrite[key] = 1;
                        toast.success("启用功能：" + name[1]);
                    } else {
                        config.reset[key] = 1;
                        toast.success("启用功能：" + name[1]);
>>>>>>> 43b3ef7 (启用toast模块)
                    }
                }
                commit.onclick = callback;
                input.onkeydown = (e) => {
                    if (e.which == 13) callback();
                }
>>>>>>> 57513a7 (Thailand server)
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
<<<<<<< HEAD
<<<<<<< HEAD
                else {
                    if (key in config.rewrite) {
                        config.rewrite[key] = 0;
                        toast.warning("禁用功能：" + name[1]);
                    }
                    else {
                        config.reset[key] = 0;
                        toast.warning("禁用功能：" + name[1]);
                    }
<<<<<<< HEAD
=======
                let button = BLOD.addElement("div", {}, right);
=======
                let button = BLOD.addElement("div", {}, this.right);
>>>>>>> 69fdcaa (Feature refactor)
=======
        limit(left, right) {
            let li = BLOD.addElement("li", {}, left);
            li.innerHTML = "区域";
            li.onclick = () => {
                document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                li.setAttribute("id", "BLOD-UI-menu");
                right.innerHTML = '';
                this.checked("limit", right);
                this.checked("accesskey", right, false, {}, BLOD.reset.accesskey, BLOD.reset.accesskey);
            }
        }
        /**
         * 其他功能，这里之后可能会定制其他功能
         * @param {HTMLElement} left 菜单左边节点
         * @param {HTMLElement} right 菜单右侧节点
         */
        toast(left, right) {
            let li = BLOD.addElement("li", {}, left);
            li.innerHTML = "其他";
            li.onclick = () => {
                document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                li.setAttribute("id", "BLOD-UI-menu");
                right.innerHTML = '';
                this.checked("toast", right);
                let timeout = BLOD.addElement("div", {}, right);
                timeout.innerHTML = '<label>通知时长：<input type="number" min="1" max="30" />秒</label>';
                timeout = timeout.children[0].children[0];
                timeout.value = BLOD.toast.config.timeout;
                timeout.oninput = () => {
                    if (!/^\d+$/.test(timeout.value) || timeout.value > 30 || timeout.value < 1) return;
                    BLOD.toast.config.timeout = timeout.value;
                    BLOD.toast.change(BLOD.toast.config);
                    toast.success("调整通知时长：" + timeout.value + " 秒");
                }
                let step = BLOD.addElement("div", {}, right);
                step.innerHTML = '<label>同时出现通知延时：<input type="number" min="50" max="1000" step="50"/>豪秒</label>';
                step = step.children[0].children[0];
                step.value = BLOD.toast.config.step;
                step.oninput = () => {
                    if (!/^\d+$/.test(step.value) || step.value > 1000 || step.value < 50) return;
                    BLOD.toast.config.step = step.value;
                    BLOD.toast.change(BLOD.toast.config);
                    toast.success("调整通知延时：" + step.value + " 毫秒");
                }
                let button = BLOD.addElement("div", {}, right);
>>>>>>> eea4f89 (重绘设置界面)
                button.innerHTML = '<label><input type="button" value="恢复默认" /></label>';
                button.onclick = () => {
                    let config = BLOD.toast.change();
                    timeout.value = config.timeout;
                    step.value = config.step;
<<<<<<< HEAD
>>>>>>> eea4f89 (重绘设置界面)
=======
>>>>>>> 43b3ef7 (启用toast模块)
                }
            }
<<<<<<< HEAD
<<<<<<< HEAD
=======
            // @ts-ignore
=======
>>>>>>> 39d49de (remove eslint rules)
            if (check) setTable.children[1].checked = true;
            table.appendChild(setTable);
>>>>>>> 2f00fde (format with JsDoc)
=======
                }
            }
>>>>>>> eea4f89 (重绘设置界面)
        }
    }

    if (window.self == window.top) new Ui();
})()
