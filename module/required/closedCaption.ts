/**
 * 本模块负责处理CC字幕  
 * 代码移植自 Bilibili CC 字幕工具，源项目信息如下
 * @see indefined {@link https://github.com/indefined/UserScripts/tree/master/bilibiliCCHelper}
 */
(function () {
    try {
        class ClosedCaption {
            element: { [name: string]: any } = {}; // 节点集合
            data: { [name: string]: any } = {}; // 字幕缓存
            resizeRate = 100; // 字幕大小倍率
            ON = `<svg width="22" height="28" viewbox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m4.07787,6.88102l14,0a2,2 0 0 1 2,2l0,10a2,2 0 0 1 -2,2l-14,0a2,2 0 0 1 -2,-2l0,-10a2,2 0 0 1 2,-2zm5,5.5a1,1 0 1 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0zm8,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0z"/></svg>`;
            OFF = `<svg width="22" height="28" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m15.172,21.87103l-11.172,0a2,2 0 0 1 -2,-2l0,-10c0,-0.34 0.084,-0.658 0.233,-0.938l-0.425,-0.426a1,1 0 1 1 1.414,-1.414l15.556,15.556a1,1 0 0 1 -1.414,1.414l-2.192,-2.192zm-10.21,-10.21c-0.577,0.351 -0.962,0.986 -0.962,1.71l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 0.713,-0.958l-1.751,-1.752zm1.866,-3.79l11.172,0a2,2 0 0 1 2,2l0,10c0,0.34 -0.084,0.658 -0.233,0.938l-2.48,-2.48a1,1 0 0 0 -0.287,-1.958l-1.672,0l-1.328,-1.328l0,-0.672a1,1 0 0 1 1,-1l2,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -1.977,1.695l-5.195,-5.195z"/></svg>`;
            color = [
                { value: '16777215', content: '<span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span>' },
                { value: '16007990', content: '<b style="color:#F44336;text-shadow: #000 0px 0px 1px">红色</b>' },
                { value: '10233776', content: '<b style="color:#9C27B0;text-shadow: #000 0px 0px 1px">紫色</b>' },
                { value: '6765239', content: '<b style="color:#673AB7;text-shadow: #000 0px 0px 1px">深紫色</b>' },
                { value: '4149685', content: '<b style="color:#3F51B5;text-shadow: #000 0px 0px 1px">靛青色</b>' },
                { value: '2201331', content: '<b style="color:#2196F3;text-shadow: #000 0px 0px 1px">蓝色</b>' },
                { value: '240116', content: '<b style="color:#03A9F4;text-shadow: #000 0px 0px 1px">亮蓝色</b>' }
            ];
            position = [
                { value: 'bl', content: '左下角' },
                { value: 'bc', content: '底部居中' },
                { value: 'br', content: '右下角' },
                { value: 'tl', content: '左上角' },
                { value: 'tc', content: '顶部居中' },
                { value: 'tr', content: '右上角' }
            ];
            shadow = [
                { value: '0', content: '无描边', style: '' },
                { value: '1', content: '重墨', style: `text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px,#000 -1px 0px 1px;` },
                { value: '2', content: '描边', style: `text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;` },
                { value: '3', content: '45°投影', style: `text-shadow: #000 1px 1px 2px, #000 0px 0px 1px;` }
            ];
            setting: {
                backgroundopacity: number,
                color: number,
                fontsize: number,
                isclosed: boolean,
                scale: boolean,
                shadow: string,
                position: string
            };
            subtitlePrefer: string; // 首选语言
            isON: boolean = false; // 是否启用
            caption: any; // 当前字幕
            contain: any;
            captions: any; // 字幕集
            text: any;
            constructor() {
                this.setting = GM.getValue("subtitle", { backgroundopacity: 0.5, color: 16777215, fontsize: 1, isclosed: false, scale: true, shadow: "0", position: 'bc' });
                this.subtitlePrefer = GM.getValue("subtitlePrefer"); // 默认语言
            }
            /**
             * 绘制字幕面板
             */
            initUI() {
                this.element.node = document.createElement("div");
                this.element.node.setAttribute("class", "bilibili-player-video-btn");
                this.element.node.setAttribute("id", "bilibili-player-subtitle-btn");
                this.element.node.setAttribute("style", "display: block;");
                this.element.span = API.addElement("span", {}, this.element.node);
                this.element.span.innerHTML = this.ON;
                this.isON = true;
                this.element.span.onclick = () => {
                    if (this.isON) this.iconSwitch();
                    else this.iconSwitch(this.caption);
                }
                this.element.table = API.addElement("div", { id: "subtitle-setting-panel", style: "position: absolute; bottom: 28px; right: 30px; background: white; border-radius: 4px; text-align: left; padding: 13px; display: none; cursor: default;" }, this.element.node);
                this.language();
                this.fontsize();
                this.fontcolor();
                this.fontshadow();
                this.fontposition();
                this.fontopacrity();
                API.addCss(API.getModule("closedCaption.css"), "caption");
                this.changeResize();
                this.changePosition();
            }
            /**
             * 切换字幕样式
             */
            changeStyle() {
                document.querySelector("#caption-style")?.remove();
                API.addCss(`span.subtitle-item-background{opacity: ${this.setting.backgroundopacity};}
            span.subtitle-item-text {color:#${("000000" + this.setting.color.toString(16)).slice(-6)};}
            span.subtitle-item {font-size: ${this.setting.fontsize * this.resizeRate}%;line-height: 110%;}
            span.subtitle-item {${(<any>this.shadow)[this.setting.shadow].style}}`, "caption-style");
                GM.setValue("subtitle", this.setting);
            }
            /**
             * 切换字幕大小
             */
            changeResize() {
                this.resizeRate = this.setting.scale ? (<any>window).player.getWidth() / 1280 * 100 : 100;
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
                GM.setValue("subtitle", this.setting);
            }
            /**
             * 字幕图标切换
             * @param caption 
             */
            iconSwitch(caption?: any) {
                if (caption) {
                    this.isON = true;
                    this.element.span.innerHTML = this.ON;
                    this.setCaption(caption);
                    this.text.innerHTML = caption.lan_doc;
                    this.element.language.children[2].disabled = false;
                }
                else {
                    this.isON = false;
                    this.element.span.innerHTML = this.OFF;
                    this.setCaption();
                    this.text.innerHTML = "关闭";
                    this.element.language.children[2].disabled = true;
                }
            }
            /**
             * 字幕选择
             */
            language() {
                this.element.language = API.addElement("div", {}, this.element.table);
                this.element.language.innerHTML = `<div>字幕</div>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 100px;">
            <div class="bpui-selectmenu-txt">关闭</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 180px; overflow: hidden auto; white-space: nowrap;">
            <li class="bpui-selectmenu-list-row" data-value="close">关闭</li>
            </ul></div>
            <button class="bpui-button" style="padding: 0px 8px;">下载</button>
            <a class="bpui-button" href="https://member.bilibili.com/v2#/zimu/my-zimu/zimu-editor?cid=${API.cid}&aid=${API.aid}" target="_blank" title="" style="margin-right: 0px; height: 24px; padding: 0px 6px;">添加字幕</a>`;
                let list = this.element.language.children[1].children[2];
                this.text = this.element.language.children[1].children[0];
                // this.element.language.children[2].onclick = () => {
                //     API.importModule("download");
                //     API.config.reset.dlother = 1; // 开启其他下载
                //     API.download(); // 拉起下载面板
                // }
                list.children[0].onclick = () => {
                    this.text.innerHTML = "关闭";
                    this.setCaption();
                }
                this.text.innerHTML = this.caption.lan_doc;
                this.captions = this.captions.reverse();
                this.captions.forEach((d: any) => {
                    let temp = API.addElement("div", { class: "bpui-selectmenu-list-row", "data-value": d.lan }, list, d.lan_doc, true);
                    temp.onclick = () => {
                        this.text.innerHTML = d.lan_doc;
                        this.iconSwitch(d);
                        GM.setValue("subtitlePrefer", this.subtitlePrefer = d.lan);
                    }
                })
            }
            /**
             * 字幕大小
             */
            fontsize() {
                this.element.fontsize = API.addElement("div", {}, this.element.table);
                this.element.fontsize.innerHTML = `<div>字体大小</div>
            <input type="range" step="25" style="width: 70%;">
            <input id="subtitle-auto-resize" type="checkbox">
            <label for="subtitle-auto-resize" style="cursor: pointer;">自动缩放</label>`;
                this.element.fontsize.children[1].value = this.setting.fontsize == 0.6 ? 0
                    : this.setting.fontsize == 0.8 ? 25
                        : this.setting.fontsize == 1.3 ? 75
                            : this.setting.fontsize == 1.6 ? 100 : 50;
                this.element.fontsize.children[1].oninput = (e: any) => {
                    const v = e.target.value / 25;
                    this.setting.fontsize = v > 2 ? (v - 2) * 0.3 + 1 : v * 0.2 + 0.6;
                    this.changeStyle();
                }
                this.element.fontsize.children[2].checked = this.setting.scale;
                this.element.fontsize.children[2].onchange = (e: any) => (<any>this.changeResize)(this.setting.scale = e.target.checked);
            }
            /**
             * 字幕颜色
             */
            fontcolor() {
                this.element.fontcolor = API.addElement("div", {}, this.element.table);
                this.element.fontcolor.innerHTML = `<span>字幕颜色</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt"><span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span></div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>`;
                this.color.forEach(d => {
                    if (d.value == <any>this.setting.color) this.element.fontcolor.children[1].children[0].innerHTML = d.content;
                    let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontcolor.children[1].children[2]);
                    temp.innerHTML = d.content;
                    temp.onclick = () => {
                        this.element.fontcolor.children[1].children[0].innerHTML = d.content;
                        (<any>this.changeStyle)(this.setting.color = parseInt(d.value));
                    }
                });
            }
            /**
             * 字幕阴影
             */
            fontshadow() {
                this.element.fontshadow = API.addElement("div", {}, this.element.table);
                this.element.fontshadow.innerHTML = `<span>字幕描边</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">无描边</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>`;
                this.shadow.forEach(d => {
                    if (d.value == this.setting.shadow) this.element.fontshadow.children[1].children[0].innerHTML = d.content;
                    let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontshadow.children[1].children[2]);
                    temp.innerHTML = d.content;
                    temp.onclick = () => {
                        this.element.fontshadow.children[1].children[0].innerHTML = d.content;
                        (<any>this.changeStyle)(this.setting.shadow = d.value);
                    }
                })
            }
            /**
             * 字幕位置
             */
            fontposition() {
                this.element.fontposition = API.addElement("div", {}, this.element.table);
                this.element.fontposition.innerHTML = `<span>字幕位置</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">底部居中</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 100px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>`;
                this.position.forEach(d => {
                    if (d.value == this.setting.position) this.element.fontposition.children[1].children[0].innerHTML = d.content;
                    let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontposition.children[1].children[2]);
                    temp.innerHTML = d.content;
                    temp.onclick = () => {
                        this.element.fontposition.children[1].children[0].innerHTML = d.content;
                        (<any>this.changePosition)(this.setting.position = d.value);
                    }
                })
            }
            /**
             * 字幕透明度
             */
            fontopacrity() {
                this.element.fontopacrity = API.addElement("div", {}, this.element.table);
                this.element.fontopacrity.innerHTML = `<div>背景不透明度</div><input type="range" style="width: 100%;">`;
                this.element.fontopacrity.children[1].value = this.setting.backgroundopacity * 100;
                this.element.fontopacrity.children[1].oninput = (e: any) => {
                    (<any>this.changeStyle)(this.setting.backgroundopacity = e.target.value / 100);
                }
            }
            /**
             * 获取CC字幕信息
             */
            async getCaption(data: any) {
                try {
                    API.subtitle = this.captions = data.data.subtitle.subtitles || [];
                    let i = 0; // 指示字幕语言记录
                    this.captions.forEach((d: any, j: any) => {
                        if (d.lan == this.subtitlePrefer) i = j;
                    })
                    if (this.captions[i]) await this.setCaption(this.captions[i]);
                    if (this.caption) {
                        // 只在有字幕时添加面板
                        (<any>window).player.addEventListener('video_resize', (event: any) => {
                            (<any>this.changeResize)(event);
                        });
                        let anchor = <HTMLDivElement>document.querySelector(".bilibili-player-video-btn-quality");
                        this.initUI();
                        if (!document.querySelector("#bilibili-player-subtitle-btn")) anchor.insertAdjacentElement("afterend", this.element.node);
                    }
                } catch (e) { API.trace(e, "closedCaption.js") }
            }
            /**
             * 设置CC字幕
             * @param caption CC字幕对象
             */
            async setCaption(caption?: any) {
                let data = { body: [] }; // 空字幕
                if (caption && caption.subtitle_url) {
                    this.data[caption.subtitle_url] = this.data[caption.subtitle_url] || await xhr({
                        url: caption.subtitle_url,
                        responseType: "json",
                        credentials: false
                    });
                    data = this.data[caption.subtitle_url] || data;
                }
                (<any>window).player.updateSubtitle(data); // 投喂字幕数据给播放器
                setTimeout(() => {
                    if ((<any>window).player.getState() == "PLAYING") {
                        // 刷新一次播放状态
                        (<any>window).player.pause();
                        (<any>window).player.play();
                    }
                }, 1000);
                if (caption && caption.subtitle_url) {
                    this.caption = caption; // 记忆当前字幕
                    API.bofqiMessage(["载入字幕", this.captions[0].lan_doc])
                } else API.bofqiMessage("关闭字幕");
            }
        }
        API.closedCaption = (data: any) => { new ClosedCaption().getCaption(data) };
    } catch (e) { API.trace(e, "closedCaption.js", true) }
})();
declare namespace API {
    /**
     * CC字幕组
     */
    let subtitle: any;
    /**
     * CC字幕
     * @param data 视频信息，来自https://api.bilibili.com/x/player/v2
     */
    function closedCaption(data: any): void;
}