import { menu } from "../runtime/chrome/menu";
import { settingDefault } from "../runtime/chrome/settings";
import { createElements } from "../runtime/element/create_element";
import { htmlVnode } from "../runtime/element/html_vnode";
import { setting } from "../runtime/setting";
import { registerMenu, registerSetting, showSetting } from "./setting";
import html from "./ui.html";
import gear from "../images/svg/gear.svg";
import { downloadDefault, pushDownload } from "../runtime/download/download";
import { allDanmaku } from "../runtime/danmaku/all_danmaku";
import { danmaku } from "../runtime/danmaku/danmaku";
import { debug } from "../runtime/debug";
import { toast } from "../runtime/toast/toast";
import { urlParam } from "../runtime/url_param";
import { LocalMedia } from "../runtime/danmaku/local_danmaku";

settingDefault.push(
    {
        key: "settingEntryType",
        menu: "common",
        label: "贴边隐藏设置入口",
        svg: gear,
        type: "switch",
        value: false,
        sub: '右下角贴边隐藏',
        float: '原滋原味保护旧版页面，不添加、修改或删除任何元素是本脚本的终极追求。<br>开启后将贴边隐藏设置入口，页面加载完成时也不会有任何提示，需要将鼠标移动到页面右下角以上一定感应区域才会显现。<br>※ <strong>Firefox用户切莫开启！</strong>',
        callback: () => {
            showSettingEntry();
        }
    },
    {
        key: "downloadBtn",
        menu: "download",
        type: "switch",
        label: "下载按钮",
        sub: "播放器右上角",
        value: false
    },
    {
        key: <any>"downloadNow",
        menu: "download",
        type: "button",
        label: "下载面板",
        sub: "下载当前视频",
        func: () => {
            downloadDefault()
        },
        button: "呼出"
    },
    {
        key: <any>"onlineDanmaku",
        menu: "danmaku",
        name: "在线弹幕",
        type: "list",
        list: [
            {
                key: "url",
                label: "视频链接或参数",
                type: "input",
                float: '请提供对应视频的完整url或者能提取有效信息的参数，比如：<br>av806828803<br>av806828803?p=1<br>BV1T34y1o72w<br>ss3398<br>ep84795<br>aid=806828803<br>aid=806828803&p=1<br>avid=806828803<br>bvid=1T34y1o72w<br>bvid=BV1T34y1o72w<br>ssid=3398<br>epid=84795<br>season_id=3398<br>ep_id=84795',
                props: { placeholder: "av806828803" }
            },
            {
                key: "concat",
                label: "合并已有弹幕",
                type: "switch",
                value: false
            },
            {
                key: "action",
                label: "(👉ﾟヮﾟ)👉",
                type: "button",
                func: async () => {
                    if (!(<any>window).player) return toast.warning("请在播放页面使用本功能 →_→");
                    if (!(<any>window).player.setDanmaku) return toast.warning("内部组件丢失！", "请检查【托管原生脚本】功能是否开启！");
                    if (!(<any>setting).onlineDanmaku.url) return toast.warning("请输入视频链接或参数~");
                    toast.info(`正在解析url：${(<any>setting).onlineDanmaku.url}`);
                    try {
                        const d = await urlParam((<any>setting).onlineDanmaku.url, false);
                        if (d.aid && d.cid) {
                            toast.info("参数解析成功，正在获取弹幕数据~", d);
                            debug((<any>setting).onlineDanmaku.url, d);
                            let dm = await danmaku.getSegDanmaku(d.aid, d.cid);
                            if (dm) {
                                const dat = danmaku.danmakuFormat(dm);
                                toast.success("获取弹幕成功~");
                                (<any>window).player?.setDanmaku(dat, setting.danmakuContact);
                                setting.downloadOther && pushDownload({
                                    group: "弹幕",
                                    data: dat,
                                    up: "在线",
                                    down: `N/A`,
                                    callback: () => danmaku.saveDanmaku(dat, (<any>setting).onlineDanmaku.url)
                                });
                            }
                            else {
                                toast.error("获取弹幕失败，请在控制台检查原因~");
                            }
                        } else {
                            toast.warning("提取弹幕参数失败，请检查输入~");
                        }
                    } catch (e) {
                        toast.error("在线弹幕", e);
                        debug.error("在线弹幕", e);
                    }
                },
                button: "加载"
            }
        ]
    },
    {
        key: <any>"allAction",
        menu: "danmaku",
        label: "(👉ﾟヮﾟ)👉",
        type: "button",
        func: () => {
            allDanmaku();
        },
        button: "开始",
        float: '通过获取所有历史弹幕来实现，但每天的历史弹幕池其实有上限（远低于普通弹幕池），超出的部分是获取不到的，所以最后获取到的总数其实未必达得到【全弹幕】的要求（甚至可能不如普通弹幕池）。另外高级弹幕、代码弹幕等并不在历史弹幕池内，如果普通池内没有，想通过本功能来获取只是徒劳。'
    },
    {
        key: <any>"localMedia",
        menu: "player",
        type: "list",
        name: "播放本地文件",
        list: [
            {
                key: "concat",
                label: "与已有弹幕合并",
                type: "switch",
                value: false
            },
            {
                key: "file",
                label: "选择本地文件或者弹幕",
                type: "input",
                props: { type: "file", accept: "video/mp4,application/xml,application/json", multiple: "multiple" },
                change: v => {
                    new LocalMedia(<FileList>v);
                }
            }
        ]
    }
)
registerMenu(menu);
registerSetting(settingDefault);

class BilibilEntry extends HTMLElement {
    root: ShadowRoot;
    gear: HTMLDivElement;
    stage: HTMLDivElement;
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        this.root.appendChild(createElements(htmlVnode(html.replace('<div class="gear"></div>', `<div class="gear">${gear}</div>`))));
        this.stage = <HTMLDivElement>this.root.children[0];
        this.gear = <HTMLDivElement>this.root.children[1];
        this.stage.remove();
        this.gear.remove();
        this.gear.addEventListener("mouseover", () => this.gear.style.opacity = "0.8");
        this.gear.addEventListener("mouseout", () => this.gear.style.opacity = "0");
        this.gear.addEventListener("click", () => { showSetting() });
        this.stage.addEventListener("click", () => { showSetting() });
    }
    change() {
        if (setting.settingEntryType) {
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
    }
}
customElements.get("bilibili-entry") || customElements.define("bilibili-entry", BilibilEntry);
const node = new BilibilEntry();
/** 绘制设置入口 */
export function showSettingEntry() {
    document.body.contains(node) || document.body.appendChild(node);
    node.change();
}