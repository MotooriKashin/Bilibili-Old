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
            }
            table.children[0].children[1].onclick = () => {
                table.remove();
                toast("设置已保存", "部分功能可能需要刷新才会生效！")
            }
            this.menu.forEach((d, i) => {
                let li = BLOD.addElement("li", {}, left);
                li.innerHTML = d;
                li.onclick = () => {
                    document.querySelector("#BLOD-UI-menu") && document.querySelector("#BLOD-UI-menu").removeAttribute("id");
                    li.setAttribute("id", "BLOD-UI-menu");
                    right.innerHTML = '';
                    this.item[i].forEach(d => { this.checked(d, right) });
                }
            })
            this.download(left, right);
            this.limit(left, right);
            this.toast(left, right);
            left.children[0].click();
        }
        /**
         * 创建复选框
         * @param {string} d 设置选项主键名
         * @param {HTMLElement} tar 复选框所在父节点
         * @param {boolean} [type] 有效则主键在config.rewrite下
         * @param {object} [style] 该功能定制css样式
         * @param {Function} [en] 启用功能时的回调，传入该功能节点作为参数以修改修改显示
         * @param {Function} [dis] 禁用该功能时的回调，传入该功能节点作为参数以修改修改显示
         */
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
            }
        }
        /**
         * 区域限制，这里之后可能会定制其他功能
         * @param {HTMLElement} left 菜单左边节点
         * @param {HTMLElement} right 菜单右侧节点
         */
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
                button.innerHTML = '<label><input type="button" value="恢复默认" /></label>';
                button.onclick = () => {
                    let config = BLOD.toast.change();
                    timeout.value = config.timeout;
                    step.value = config.step;
                }
            }
        }
    }

    if (window.self == window.top) new Ui();
})()
