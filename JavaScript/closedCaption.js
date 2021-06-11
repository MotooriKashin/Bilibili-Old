/**
 * @module closedCaption
 * @description 使旧版播放器支持CC字幕，移植自[Bilibili CC 字幕工具](https://github.com/indefined/UserScripts/tree/master/bilibiliCCHelper)
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main  */
    const debug = BLOD.debug; /** @see debug  */
    const toast = BLOD.toast; /** @see debug  */

    /**
     * @class ClosedCaption
     * @description CC字幕
     * @see indefined {@link https://github.com/indefined/UserScripts/tree/master/bilibiliCCHelper}
     */
    class ClosedCaption {
        constructor() {
            BLOD.xhrhook((xhr, args) => { if (args[1].includes('api.bilibili.com/x/player/carousel')) this.getCaption(); }); // CC字幕入口
            this.element = {}; // 节点集合
            this.data = {}; // 字幕缓存
            this.resizeRate = 100; // 字幕大小倍率
            this.style = `/*对齐，悬停按钮显示菜单*/
            #subtitle-setting-panel>div>* {margin-right: 5px;}
            #bilibili-player-subtitle-btn:hover>#subtitle-setting-panel {display: block!important;}
            /*滑动选择样式*/
            #subtitle-setting-panel input[type="range"] {
                background-color: #ebeff4;
                -webkit-appearance: none;
                height:4px;
                transform: translateY(-4px);
            }
            #subtitle-setting-panel input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 15px;
                width: 15px;
                background: #fff;
                border-radius: 15px;
                border: 1px solid;
            }
            /*复选框和其对应标签样式*/
            #subtitle-setting-panel input[type="checkbox"]{display:none;}
            #subtitle-setting-panel input ~ label {cursor:pointer;}
            #subtitle-setting-panel input:checked ~ label:before {content: '\\2714';}
            #subtitle-setting-panel input ~ label:before{
                width: 12px;
                height:12px;
                line-height: 14px;
                vertical-align: text-bottom;
                border-radius: 3px;
                border:1px solid #d3d3d3;
                display: inline-block;
                text-align: center;
                content: ' ';
            }
            /*悬停显示下拉框样式*/
            #subtitle-setting-panel .bpui-selectmenu:hover .bpui-selectmenu-list{display:block;}
            /*滚动条样式*/
            #subtitle-setting-panel ::-webkit-scrollbar{width: 7px;}
            #subtitle-setting-panel ::-webkit-scrollbar-track{border-radius: 4px;background-color: #EEE;}
            #subtitle-setting-panel ::-webkit-scrollbar-thumb{border-radius: 4px;background-color: #999;}`;
            this.iconOn = `<svg width="22" height="28" viewbox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
            <path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m4.07787,6.88102l14,0a2,2 0 0 1 2,2l0,10a2,2 0 0 1 -2,2l-14,0a2,2 0 0 1 -2,-2l0,-10a2,2 0 0 1 2,-2zm5,5.5a1,1 0 1 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0zm8,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0z"/></svg>`;
            this.iconOff = `<svg width="22" height="28" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg">
            <path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m15.172,21.87103l-11.172,0a2,2 0 0 1 -2,-2l0,-10c0,-0.34 0.084,-0.658 0.233,-0.938l-0.425,-0.426a1,1 0 1 1 1.414,-1.414l15.556,15.556a1,1 0 0 1 -1.414,1.414l-2.192,-2.192zm-10.21,-10.21c-0.577,0.351 -0.962,0.986 -0.962,1.71l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 0.713,-0.958l-1.751,-1.752zm1.866,-3.79l11.172,0a2,2 0 0 1 2,2l0,10c0,0.34 -0.084,0.658 -0.233,0.938l-2.48,-2.48a1,1 0 0 0 -0.287,-1.958l-1.672,0l-1.328,-1.328l0,-0.672a1,1 0 0 1 1,-1l2,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -1.977,1.695l-5.195,-5.195z"/></svg>`;
            this.color = [
                { value: '16777215', content: '<span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span>' },
                { value: '16007990', content: '<b style="color:#F44336;text-shadow: #000 0px 0px 1px">红色</b>' },
                { value: '10233776', content: '<b style="color:#9C27B0;text-shadow: #000 0px 0px 1px">紫色</b>' },
                { value: '6765239', content: '<b style="color:#673AB7;text-shadow: #000 0px 0px 1px">深紫色</b>' },
                { value: '4149685', content: '<b style="color:#3F51B5;text-shadow: #000 0px 0px 1px">靛青色</b>' },
                { value: '2201331', content: '<b style="color:#2196F3;text-shadow: #000 0px 0px 1px">蓝色</b>' },
                { value: '240116', content: '<b style="color:#03A9F4;text-shadow: #000 0px 0px 1px">亮蓝色</b>' }
            ];
            this.position = [
                { value: 'bl', content: '左下角' },
                { value: 'bc', content: '底部居中' },
                { value: 'br', content: '右下角' },
                { value: 'tl', content: '左上角' },
                { value: 'tc', content: '顶部居中' },
                { value: 'tr', content: '右上角' }
            ];
            this.shadow = [
                { value: '0', content: '无描边', style: '' },
                { value: '1', content: '重墨', style: `text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px,#000 -1px 0px 1px;` },
                { value: '2', content: '描边', style: `text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;` },
                { value: '3', content: '45°投影', style: `text-shadow: #000 1px 1px 2px, #000 0px 0px 1px;` }
            ];
            this.setting = BLOD.GM.getValue("subtitle") || {
                backgroundopacity: 0.5,
                color: 16777215,
                fontsize: 1,
                isclosed: false,
                scale: true,
                shadow: "0",
                position: 'bc'
            };
            this.subtitlePrefer = BLOD.GM.getValue("subtitlePrefer"); // 默认语言
        }
        /**
         * 绘制字幕面板
         */
        initUI() {
            this.element.node = document.createElement("div");
            this.element.node.setAttribute("class", "bilibili-player-video-btn");
            this.element.node.setAttribute("id", "bilibili-player-subtitle-btn");
            this.element.node.setAttribute("style", "display: block;");
            this.element.span = BLOD.addElement("span", {}, this.element.node);
            this.element.span.innerHTML = this.iconOn;
            this.on = true;
            this.element.span.onclick = () => {
                if (this.on) this.iconSwitch();
                else this.iconSwitch(this.caption);
            }
            this.element.table = BLOD.addElement("div", { id: "subtitle-setting-panel", style: "position: absolute; bottom: 28px; right: 30px; background: white; border-radius: 4px; text-align: left; padding: 13px; display: none; cursor: default;" }, this.element.node);
            this.language();
            this.fontsize();
            this.fontcolor();
            this.fontshadow();
            this.fontposition();
            this.fontopacrity();
            BLOD.addCss(this.style, "caption");
            this.changeResize();
            this.changePosition();
        }
        /**
         * 切换字幕样式
         */
        changeStyle() {
            if (document.querySelector("#caption-style")) document.querySelector("#caption-style").remove();
            BLOD.addCss(`span.subtitle-item-background{opacity: ${this.setting.backgroundopacity};}
            span.subtitle-item-text {color:#${("000000" + this.setting.color.toString(16)).slice(-6)};}
            span.subtitle-item {font-size: ${this.setting.fontsize * this.resizeRate}%;line-height: 110%;}
            span.subtitle-item {${this.shadow[this.setting.shadow].style}}`, "caption-style");
            BLOD.GM.setValue("subtitle", this.setting);
        }
        /**
         * 切换字幕大小
         */
        changeResize() {
            this.resizeRate = this.setting.scale ? window.player.getWidth() / 1280 * 100 : 100;
            this.changeStyle();
        }
        /**
         * 切换字幕位置
         */
        changePosition() {
            this.contain = document.querySelector(".bilibili-player-video-subtitle>div");
            this.contain.className = 'subtitle-position subtitle-position-'
                + (this.setting.position || 'bc');
            this.contain.style = '';
            BLOD.GM.setValue("subtitle", this.setting);
        }
        /**
         * 字幕图标切换
         * @param {*} caption 
         */
        iconSwitch(caption) {
            if (caption) {
                this.on = true;
                this.element.span.innerHTML = this.iconOn;
                this.setCaption(caption);
                this.text.innerHTML = caption.lan_doc;
                this.element.language.children[2].disabled = false;
            }
            else {
                this.on = false;
                this.element.span.innerHTML = this.iconOff;
                this.setCaption();
                this.text.innerHTML = "关闭";
                this.element.language.children[2].disabled = true;
            }
        }
        /**
         * 字幕选择
         */
        language() {
            this.element.language = BLOD.addElement("div", {}, this.element.table);
            this.element.language.innerHTML = `<div>字幕</div>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 100px;">
            <div class="bpui-selectmenu-txt">关闭</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 180px; overflow: hidden auto; white-space: nowrap;">
            <li class="bpui-selectmenu-list-row" data-value="close">关闭</li>
            </ul></div>
            <button class="bpui-button" style="padding: 0px 8px;">下载</button>
            <a class="bpui-button" href="https://member.bilibili.com/v2#/zimu/my-zimu/zimu-editor?cid=${BLOD.cid}&aid=${BLOD.aid}" target="_blank" title="" style="margin-right: 0px; height: 24px; padding: 0px 6px;">添加字幕</a>`;
            let list = this.element.language.children[1].children[2];
            this.text = this.element.language.children[1].children[0];
            this.element.language.children[2].onclick = () => {
                BLOD.importModule("download");
                BLOD.config.reset.dlother = 1; // 开启其他下载
                BLOD.download(); // 拉起下载面板
            }
            list.children[0].onclick = () => {
                this.text.innerHTML = "关闭";
                this.setCaption();
            }
            this.text.innerHTML = this.caption.lan_doc;
            this.captions = this.captions.reverse();
            this.captions.forEach(d => {
                let temp = BLOD.addElement("div", { class: "bpui-selectmenu-list-row", "data-value": d.lan }, list, true);
                temp.innerHTML = d.lan_doc;
                temp.onclick = () => {
                    this.text.innerHTML = d.lan_doc;
                    this.iconSwitch(d);
                    BLOD.GM.setValue("subtitlePrefer", this.subtitlePrefer = d.lan);
                }
            })
        }
        /**
         * 字幕大小
         */
        fontsize() {
            this.element.fontsize = BLOD.addElement("div", {}, this.element.table);
            this.element.fontsize.innerHTML = `<div>字体大小</div>
            <input type="range" step="25" style="width: 70%;">
            <input id="subtitle-auto-resize" type="checkbox">
            <label for="subtitle-auto-resize" style="cursor: pointer;">自动缩放</label>`;
            this.element.fontsize.children[1].value = this.setting.fontsize == 0.6 ? 0
                : this.setting.fontsize == 0.8 ? 25
                    : this.setting.fontsize == 1.3 ? 75
                        : this.setting.fontsize == 1.6 ? 100 : 50;
            this.element.fontsize.children[1].oninput = (e) => {
                const v = e.target.value / 25;
                this.setting.fontsize = v > 2 ? (v - 2) * 0.3 + 1 : v * 0.2 + 0.6;
                this.changeStyle();
            }
            this.element.fontsize.children[2].checked = this.setting.scale;
            this.element.fontsize.children[2].onchange = (e) => this.changeResize(this.setting.scale = e.target.checked);
        }
        /**
         * 字幕颜色
         */
        fontcolor() {
            this.element.fontcolor = BLOD.addElement("div", {}, this.element.table);
            this.element.fontcolor.innerHTML = `<span>字幕颜色</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt"><span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span></div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>`;
            this.color.forEach(d => {
                if (d.value == this.setting.color) this.element.fontcolor.children[1].children[0].innerHTML = d.content;
                let temp = BLOD.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontcolor.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontcolor.children[1].children[0].innerHTML = d.content;
                    this.changeStyle(this.setting.color = parseInt(d.value));
                }
            });
        }
        /**
         * 字幕阴影
         */
        fontshadow() {
            this.element.fontshadow = BLOD.addElement("div", {}, this.element.table);
            this.element.fontshadow.innerHTML = `<span>字幕描边</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">无描边</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>`;
            this.shadow.forEach(d => {
                if (d.value == this.setting.shadow) this.element.fontshadow.children[1].children[0].innerHTML = d.content;
                let temp = BLOD.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontshadow.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontshadow.children[1].children[0].innerHTML = d.content;
                    this.changeStyle(this.setting.shadow = d.value);
                }
            })
        }
        /**
         * 字幕位置
         */
        fontposition() {
            this.element.fontposition = BLOD.addElement("div", {}, this.element.table);
            this.element.fontposition.innerHTML = `<span>字幕位置</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">底部居中</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 100px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>`;
            this.position.forEach(d => {
                if (d.value == this.setting.position) this.element.fontposition.children[1].children[0].innerHTML = d.content;
                let temp = BLOD.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontposition.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontposition.children[1].children[0].innerHTML = d.content;
                    this.changePosition(this.setting.position = d.value);
                }
            })
        }
        /**
         * 字幕透明度
         */
        fontopacrity() {
            this.element.fontopacrity = BLOD.addElement("div", {}, this.element.table);
            this.element.fontopacrity.innerHTML = `<div>背景不透明度</div><input type="range" style="width: 100%;">`;
            this.element.fontopacrity.children[1].value = this.setting.backgroundopacity * 100;
            this.element.fontopacrity.children[1].oninput = (e) => {
                this.changeStyle(this.setting.backgroundopacity = e.target.value / 100);
            }
        }
        /**
         * 查询有无弹幕，暂未支持泰区
         * @returns {Promise<{}>}} 字幕结果返回
         */
        async getCaptionView() {
            try {
                // 网页端接口
                return BLOD.jsonCheck(await BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/player/v2", { cid: BLOD.cid, aid: BLOD.aid })));
            } catch (e) {
                e = Array.isArray(e) ? e : [e];
                debug.error("CC字幕接口", ...e);
                // 移动端接口
                return BLOD.jsonCheck(await BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: BLOD.cid, aid: BLOD.aid, type: 1 })));
            }
        }
        /**
         * 获取CC字幕信息
         */
        async getCaption() {
            try {
                let data = await this.getCaptionView();
                BLOD.subtitle = this.captions = data.data.subtitle.subtitles || [];
                let i = 0; // 指示字幕语言记录
                this.captions.forEach((d, j) => {
                    if (d.lan == this.subtitlePrefer) i = j;
                })
                if (this.captions[i]) await this.setCaption(this.captions[i]);
                if (this.caption) {
                    // 只在有字幕时添加面板
                    window.player.addEventListener('video_resize', (event) => {
                        this.changeResize(event);
                    });
                    let anchor = document.querySelector(".bilibili-player-video-btn-quality");
                    this.initUI();
                    if (!document.querySelector("#bilibili-player-subtitle-btn")) anchor.insertAdjacentElement("afterend", this.element.node);
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("CC字幕", ...e); }
        }
        /**
         * 设置CC字幕
         * @param {{}} [caption] CC字幕对象
         */
        async setCaption(caption) {
            let data = { body: [] }; // 空字幕
            if (caption && caption.subtitle_url) {
                this.data[caption.subtitle_url] = this.data[caption.subtitle_url] || await BLOD.xhr.true(caption.subtitle_url, "json", undefined, false);
                data = this.data[caption.subtitle_url] || data;
            }
            window.player.updateSubtitle(data); // 投喂字幕数据给播放器
            window.player.pause(); window.player.play(); // 刷新一次播放状态
            if (caption && caption.subtitle_url) {
                this.caption = caption; // 记忆当前字幕
                debug.msg(3, "载入字幕", this.captions[0].lan_doc);
            } else debug.msg(3, "关闭字幕");
        }
    }
    new ClosedCaption();
})()