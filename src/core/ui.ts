import { debug } from "../utils/debug";
import { propertyHook } from "../utils/hook/method";
import { poll } from "../utils/poll";
import { svg } from "../utils/svg";
import { AccessKey } from "./accesskey";
import { BLOD } from "./bilibili-old";
import { Chain } from "./chain";
import { danmaku } from "./danmaku";
import { download } from "./download";
import { Aria2 } from "./download/aria2";
import { player } from "./player";
import { toast } from "./toast";
import { alert } from "./ui/alert";
import { Desc } from "./ui/desc";
import { BilioldEntry } from "./ui/entry";
import { BiliOldInterface } from "./ui/interface";
import { SettingItem } from "./ui/item";
import { Menuitem } from "./ui/menu";
import { PushButton } from "./ui/utils/button";
import { CheckBoxs } from "./ui/utils/checkbox";
import { IInputAreaValue, InputArea } from "./ui/utils/input";
import { ISelectMenuValue, SelectMenu } from "./ui/utils/select";
import { ISliderBlockValue, SliderBlock } from "./ui/utils/slider";
import { SwitchButton } from "./ui/utils/switch";
import { user } from "./user";
import { userStatus } from "./userstatus";
import { UPOS } from "./videolimit";

/** 菜单项 */
export const Menus = {
    common: ['通用', svg.wrench],
    rewrite: ['重写', svg.note],
    danmaku: ['弹幕', svg.dmset],
    restore: ['修复', svg.stethoscope],
    player: ['播放', svg.play],
    style: ['样式', svg.palette],
    download: ['下载', svg.download]
};
export class UI {
    protected entry = new BilioldEntry();
    protected interface = new BiliOldInterface();
    protected menuitem: Record<keyof typeof Menus, Menuitem> = <any>{};
    protected settingItem: Record<keyof typeof userStatus, SettingItem> = <any>{}
    constructor() {
        this.initMenu();
        this.initSettings();
        poll(() => document.readyState === 'complete', () => {
            this.entry.type = user.userStatus!.uiEntryType;
            document.body.appendChild(this.entry);
            this.updateCheck();
        }, 1e3, 0);
        this.entry.addEventListener('click', e => {
            this.show();
            e.stopPropagation();
        })
    }
    /** 检查播放器脚本更新 */
    protected async updateCheck() {
        if (_UserScript_ && user.userStatus!.bilibiliplayer && user.userStatus!.checkUpdate) {
            const version = await GM.getValue('version');
            if (version !== BLOD.version) {
                player.loadplayer(true);
            }
        }
    }
    /** 初始化菜单 */
    protected initMenu() {
        Object.entries(Menus).forEach(d => {
            const menu = new Menuitem();
            this.menuitem[<'common'>d[0]] = menu;
            menu.init(d[1][0], d[1][1]);
            this.interface.addMenu(menu);
        });
    }
    /** 初始化设置项 */
    protected initSettings() {
        this.initSettingCommon();
        this.initSettingRewrite();
        this.initSettingStyle();
        this.initSettingRestore();
        this.initSettingPlayer();
        this.initSettingDanmaku();
        this.initSettingDownload();
    }
    /** 通用设置 */
    protected initSettingCommon() {
        this.menuitem.common.addSetting([
            this.switch('development', '开发者模式', '暴露调试接口到控制台', svg.warn, v => {
                if (v) {
                    propertyHook(window, 'BLOD', BLOD);
                } else {
                    Reflect.deleteProperty(window, 'BLOD');
                }
            }, '暴露一个名为【BLOD】的对象到全局，你可以在浏览器控制台里使用内部的属性及方法进行调试。'),
            this.switch('disableReport', '数据上报', '禁止网页跟踪上报', svg.linechart),
            this.select('uiEntryType', '设置入口样式', {
                candidate: ['old', 'new']
            }, '浮动齿轮或者贴边隐藏', svg.gear, v => this.entry.type = v, '【old】入口更具隐蔽性，鼠标移动到贴边位置才会浮现。【new】入口每次网页加载完成都会滚动浮现，隐藏会鼠标移动到对应位置便会浮现。'),
            this.button(<'toast'>'userStatus', '管理设置数据', () => {
                alert([
                    '备份脚本设置或者恢复已备份的数据。',
                    '当调整的选项过多时，备份一下是一个良好的主意，以免因为意外重复第二次操作。'
                ], '备份还原', [
                    {
                        text: '默认',
                        callback: () => user.restoreUserStatus()
                    },
                    {
                        text: '导出',
                        callback: () => user.outputUserStatus()
                    },
                    {
                        text: '导入',
                        callback: () => user.inputUserStatus()
                    }
                ])
            }, '备份/恢复', '管理', svg.blind),
            this.switch('bilibiliplayer', '重构播放器', '修复及增强', svg.play, v => {
                if (v) {
                    this.updateCheck();
                }
            }, '旧版播放器已于 2019-10-31T07:38:36.004Z 失去官方维护，为了旧版播放器长期可持续维护，我们使用typescript完全重构了旧版播放器。修复了旧版播放器出现异常或失效的功能（如无法获取90分钟以后的弹幕问题），移植了一些B站后续推出的功能（如互动视频、全景视频、杜比视界、杜比全景声、AV1编码支持和DRM支持等）。能力有限无法做到100%复刻，如果您想体验原生的旧版播放器，可以禁用本功能。同时由于项目托管于Github，国内部分网络环境可能访问不畅，初次启动播放器可能耗时较久，加载失败后也会回滚原生播放器。如果您的网络环境始终无法正常加载，也请禁用本功能或者前往反馈。'),
            this.select('cdn', 'CDN', {
                candidate: ['Github', 'jsdelivr']
            }, '更新外部资源', svg.net, undefined, '用于加载外部资源的CDN，一般而言jsdelivr比GitHub好些，然而部分网路环境可能二者都无法访问。')
        ]);
        this.menuitem.common.addCard('toastr');
        this.menuitem.common.addSetting([
            this.switch(<'toast'>'toast.disabled', '禁用', '<a href="https://github.com/CodeSeven/toastr" target="_blank">toastr</a>', undefined, v => toast.disabled = v),
            this.switch(<'toast'>'toast.rtl', '镜像', '左右翻转', undefined, v => toast.rtl = v),
            this.select(<'toast'>'toast.position', '位置', {
                candidate: ['top-left', 'top-center', 'top-right', 'top-full-width', 'bottom-left', 'bottom-right', 'bottom-center', 'bottom-full-width']
            }, '相对屏幕', undefined, v => toast.position = <'top-right'>v),
            this.slider(<'toast'>'toast.delay', '时长', {
                min: 2,
                max: 60,
                precision: 58
            }, '单位：/秒', undefined, v => toast.delay = v),
            this.select(<'toast'>'toast.type', '类型', {
                candidate: ["info", "success", "warning", "error"],
                styles: {
                    info: "color: #2F96B4",
                    success: "color: #51A351",
                    warning: "color: #F89406",
                    error: "color: #BD362F"
                }
            }, '测试限定'),
            this.inputCustom(<'toast'>'toast.test', '测试', {
                candidate: ["Hello World!"]
            }, v => {
                try {
                    toast.toast(user.userStatus!.toast.delay, (<any>this).BLOD.status.toast.type, v);
                } catch (e) {
                    toast.error('非常抱歉！发生了错误', e);
                }
            }, '请输入一句话~')
        ], 1);
        this.menuitem.common.addCard('账户授权');
        this.menuitem.common.addSetting([
            this.input(<'accessKey'>'accessKey.token', 'token', {
                prop: { type: "text", readonly: "readonly" }
            }, 'access_key', undefined, undefined, '鉴权。效果等同于网页端的cookie，B站服务器用以识别您的登录身份。本脚本只会在您本地保存鉴权，绝对不会泄露出去，唯一的例外是如果启用了【解除区域限制】功能并选择自定义服务器，则会向代理服务器发送鉴权，我们无法保证第三方服务器如何使用您的鉴权，所以万请自行必确认代理服务器的可信度，<strong>三思而后行</strong>！'),
            this.input(<'accessKey'>'accessKey.dateStr', '授权日期', {
                prop: { type: "text", readonly: "readonly" }
            }, '有效期一般为一个月', undefined, undefined, '脚本不会代为检查鉴权是否失效，请失效时自行重新授权。'),
            this.button(<'accessKey'>'accessKey.action', '进行授权', () => {
                new AccessKey();
            }, '授权脚本使用登录鉴权', '授权', svg.warn)
        ], 2);
        if (_UserScript_) {
            this.menuitem.common.addSetting([
                this.switch('checkUpdate', '检查更新', '自动更新播放器', svg.download, undefined, '启用【重构播放器】后，脚本会自动检查并更新播放器组件，但可能因为网络原因更新失败，出现反复更新->反复失败的问题。您可以禁用此功能，以继续使用【重构播放器】，等待网络环境改善后再尝试启用。')
            ]);
        }
    }
    /** 重写设置 */
    protected initSettingRewrite() {
        this.menuitem.rewrite.addSetting([
            this.switch('av', 'av/BV', '恢复旧版av页'),
            this.switch('bangumi', 'bangumi', '恢复旧版bangumi页'),
            this.switch('watchlater', '稍后再看', '恢复旧版稍后再看'),
            this.switch('playlist', '播单', '恢复旧版播单页'),
            this.switch('index', '主页', '恢复旧版Bilibili主页'),
            this.switch('player', '播放器', '替换其他未重写页面的播放器'),
            this.switch('read', '专栏', '恢复旧版专栏'),
            this.switch('ranking', '排行榜', '恢复旧版全站排行榜页'),
            this.switch('search', '搜索', '恢复旧版搜索页'),
            this.switch('album', '相簿', '恢复相簿页')
        ]);
    }
    /** 弹幕设置 */
    protected initSettingDanmaku() {
        this.menuitem.danmaku.addSetting([
            this.switch('dmproto', 'proto弹幕', 'protobuf弹幕支持', undefined, undefined, '因为B站已放弃维护xml弹幕，带来一些问题，比如90分钟后无弹幕，所以此项不建议禁用。【重构播放器】默认启用且不受此项影响。'),
            this.switch('dmwrap', '弹幕提权', '允许普权弹幕排版', undefined, undefined, '上古时代存在大量使用换行及空格等特殊字符来提权以达到高级弹幕效果的作品，在html5时代无法正常显示，启用此项将恢复普权弹幕排版效果。尽情享受弹幕艺术。【重构播放器】默认启用且不受此项影响。'),
            this.select('dmExtension', '弹幕格式', {
                candidate: ['xml', 'json']
            }, '拓展名', undefined, undefined, '【下载弹幕】及【本地弹幕】使用的弹幕格式，xml是传统格式，json是protobuf弹幕实际格式，前者一般拥有更小的体积，只是可能丢失彩蛋及部分非法字符。'),
            this.switch('dmContact', '合并弹幕', '本地弹幕或在线弹幕', undefined, undefined, '选择【本地弹幕】或【在线弹幕】是否与播放器内已有弹幕合并。'),
            this.inputCustom(<'dmContact'>'onlineDm', '在线弹幕', {
                prop: { placeholder: 'ss3398' }
            }, v => {
                v && typeof v === 'string' && danmaku.onlineDm(v);
            }, '从其他视频加载弹幕', undefined, '从其他B站视频加载弹幕，可以输入关键url或者查询参数，如：<br/>av806828803<br/>av806828803?p=1<br/>aid=806828803&p=1<br/>ss3398<br/>ep84795<br/>注意：【重构播放器】此处加载的弹幕会替换【下载弹幕】的内容！'),
            this.button(<'dmContact'>'localDm', '本地弹幕', () => {
                user.userStatus!.dmExtension === 'json' ? danmaku.localDmJson() : danmaku.localDmXml();
            }, '加载本地磁盘上的弹幕', '打开', undefined, '从本地磁盘上加载弹幕文件，来源可以是下载功能下载的弹幕，拓展名.xml或.json，编码utf-8。【合并弹幕】项能选择是否与播放器内已有弹幕合并。'),
            this.switch('danmakuProtect', '弹幕保护计划', '<a href="https://github.com/MotooriKashin/Bilibili-Old/blob/master/danmaku/README.md" target="_blank">查看目录</a>', undefined, undefined, '上古弹幕作品很多高级弹幕都丢失了，幸好本项目备份了一些。启用本功能将自动识别对应作品并使用【在线弹幕】功能加载备份的弹幕，找回曾经的感动。<br>※部分4:3视频请以播放器原始形态观看获取最佳体验，不推荐全屏。')
        ])
    }
    /** 样式设置 */
    protected initSettingStyle() {
        this.menuitem.style.addSetting([
            this.switch('header', '恢复旧版顶栏', '替换所有B站页面中的顶栏为旧版', undefined, undefined, '除非替换后实在不和谐，一般都会进行替换。'),
            this.switch('comment', '恢复评论翻页', '替换瀑布流评论区', undefined, undefined, '评论区版本将被固定，可能享受不到B站后续为评论区推出的新功能。本功能有专门独立为一个脚本，不要重复安装。'),
            this.switch('staff', '合作UP主', '联合投稿显示合作UP主', undefined, undefined, '在原av页up主信息处列出所有合作up主。'),
            this.switch('bangumiEplist', '保留bangumi分P', '牺牲特殊背景图', undefined, undefined, '旧版bangumi遇到有特殊背景图的视频时，会隐藏播放器下方的分集选择界面，二者不可得兼。'),
            this.switch('jointime', '注册时间', '个人空间显示账户注册时间'),
            this.switch('history', '纯视频历史', '过滤历史记录页的非视频部分'),
            this.switch('liveRecord', '录屏动态', '允许动态页显示直播录屏'),
            this.switch('commentJumpUrlTitle', '评论超链接标题', '还原为链接或短链接', undefined, undefined, '直接显示链接标题固然方便，但有些时候还是直接显示链接合适。'),
            this.switch('like', '添加点赞功能', '不支持一键三连'),
            this.switch('fullBannerCover', '修正banner分辨率', '顶栏banner完整显示不裁剪', undefined, undefined, '旧版顶栏banner接口已不再更新，脚本使用新版banner接口进行修复，但二者图片分辨率不一致。脚本默认不会去动页面样式以尽可能原汁原味还原旧版页面，导致顶栏banner被裁剪显示不全，启用本项将调整顶栏分辨率以完整显示图片。'),
            this.switch('episodeData', '分集数据', 'bangumi', undefined, undefined, '显示bangumi分集播放和弹幕数，原始合计数据移动到鼠标浮动提示中。'),
            this.switch('simpleChinese', '繁 -> 简', '将繁体字幕翻译为简体', undefined, undefined, '识别并替换CC字幕繁体并转化为简体，使用内置的简繁对照表机械翻译。')
        ]);
    }
    /** 修复设置 */
    protected initSettingRestore() {
        this.menuitem.restore.addSetting([
            this.switch('lostVideo', '失效视频', '尝试获取失效视频信息', undefined, undefined, '修复收藏的失效视频的封面和标题信息，并以红色删除线标记。使用缓存数据恢复的页面重构av页默认开启且不受此项影响，其中部分上古失效视频甚至还保留了评论区。'),
            this.switch('disableSleepChcek', '禁用直播间挂机检测', '就喜欢挂后台听个响不行吗！'),
            this.switch('show1080p', '不登录高画质支持', 'dash模式限定', undefined, v => {
                if (v && !user.userStatus!.accessKey.token) {
                    toast.warning('需要启用【账户授权】功能！');
                    alert('需要启用【账户授权】功能！是否前往？', '【账户授权】', [{ text: '前往【账户授权】', callback: () => this.show(<'accessKey'>'accessKey.token') }]);
                    user.userStatus!.show1080p = false;
                }
            }, 'B站砍掉了不登录能获取的画质，最多只能获取480P。您可以启用【账户授权】功能，授权本脚本使用您的登录信息，如此您退出登录后依然能获取高画质视频流。本功能只会在请求播放源时添加上登录鉴权，不影响页面其他功能的未登录状态，B站也不会记录您的播放记录。本功能适用于那些经常用浏览器无痕模式上B站的用户。若<strong>非常抱歉</strong>报错请关闭本选项！'),
            this.switch('timeLine', '港澳台新番时间表', '填充首页番剧板块', undefined, undefined, '在首页番剧板块中填充港澳台最新番剧更新信息。只提取了最新的30条番剧信息，所以数据中可能不会包含过于久远的更新。本功能只能显示已更新的番剧信息，而不能作为即将更新番剧的预测。'),
            this.switch('searchAllArea', '全区域搜索', '还原港澳台Bangumi结果', undefined, undefined, '替换搜索页面默认搜索结果，使能够搜索到港澳台bangumi。需要特别注意搜索关键词，港澳台译名通常与简中译名不一致，但也不强制要求繁体，如：<br>别当欧尼酱了 -> 不当哥哥了/不當哥哥了<br>本功能只在默认搜索时生效，更改搜索范围无效。另外，启用本功能搜索到的bangumi会丢失ep列表。')
        ]);
    }
    /** 播放设置 */
    protected initSettingPlayer() {
        this.menuitem.player.addSetting([
            this.sliderCustom(<'player'>'playbackRate', '播放速率', {
                min: 0.25,
                max: 5,
                precision: 95,
                value: 1,
                solid: true
            }, e => {
                player.playbackRate(e);
            }, '播放速率调整拓展', undefined, '调节当前HTML5播放器速率，拥有比播放器自带的更宽的调整范围。注意：未调整前的当前速率默认为1。'),
            this.switch('webRTC', 'WebRTC', '<strong>关闭</strong>以禁用p2p共享带宽', undefined, undefined, 'B站使用【WebRTC】实现p2p共享，等同于将您的设备变成了B站的一个视频服务器节点，别人观看相同的视频或直播便可以从您的设备取流而不必访问B站固有的服务器。脚本默认<strong>关闭</strong>了此功能，以减轻小水管的带宽压力，如果您的带宽允许，还是推荐开启，人人为我，我为人人。bilibili~乾杯 - ( ゜-゜)つロ！'),
            this.switch('elecShow', '充电鸣谢', '允许视频结尾的充电鸣谢'),
            this.switch('videoDisableAA', '禁用视频渲染抗锯齿', '详见<a href="https://github.com/MotooriKashin/Bilibili-Old/issues/292" target="_blank">#292</a>说明'),
            this.switch('ugcSection', '视频合集', '以播单形式呈现', undefined, undefined, '视频合集在旧版页面时代本不存在，但其实质类似于上古的播单，所以直接使用播单页面进行模拟。值得一提的是真正的播单页面相关接口已完全被404，如果有幸访问到脚本会直接替换为缓存的播单号769——因为只缓存了这一项数据。另外播单详情页面还是404状态，以后可能也会用缓存数据修复，让后人能一窥范例。')
        ]);
        this.menuitem.player.addCard('自动化操作');
        this.menuitem.player.addSetting([
            this.switch(<'automate'>'automate.danmakuFirst', '展开弹幕列表', '而不是推荐视频', undefined, undefined, '载入播放器时右侧面板默认切换到弹幕列表。'),
            this.switch(<'automate'>'automate.showBofqi', '滚动到播放器', '载入视频时', undefined, undefined, '载入播放器时自动滚动到播放器。'),
            this.switch(<'automate'>'automate.screenWide', '宽屏模式', '隐藏播放器右侧面板', undefined, v => v && (user.userStatus!.automate.webFullScreen = false), '载入播放器时自动启用宽屏模式。（与网页全屏二选一）'),
            this.switch(<'automate'>'automate.noDanmaku', '无弹幕模式', '默认关闭弹幕', undefined, undefined, '载入播放器时默认关闭弹幕。'),
            this.switch(<'automate'>'automate.autoPlay', '自动播放', '播放器初始化完成时', undefined, undefined, '播放器加载完成自动播放。'),
            this.switch(<'automate'>'automate.webFullScreen', '网页全屏模式', '载入视频时', undefined, v => v && (user.userStatus!.automate.screenWide = false), '载入播放器时自动网页全屏。（与宽屏模式二选一）'),
            this.switch(<'automate'>'automate.videospeed', '记忆播放速率', '永久继承播放速率设定', undefined, undefined, '默认的记忆播放速率记忆仅同一个网页标签页有效，开启后将代为记忆固定下来。'),
        ], 1);
        this.menuitem.player.addCard('限制视频');
        this.menuitem.player.addSetting([
            this.switch(<'videoLimit'>'videoLimit.status', '解除播放限制', '解除区域/APP限制', undefined, undefined, '内置服务器只能获取到360P，有条件请在下面自定义服务器。'),
            this.select(<'videoLimit'>'videoLimit.server', '代理服务器模式', {
                candidate: ['内置', '自定义']
            }, '<strong>自定义</strong>模式须要填写下面的服务器', undefined, v => {
                if (v === '自定义') {
                    if (!user.userStatus!.videoLimit.cn && !user.userStatus!.videoLimit.hk && !user.userStatus!.videoLimit.tw) {
                        toast.warning('请至少填选以下代理服务器中的一下再选择！', '服务器请自行搭建或参考【公共反代服务器】');
                        user.userStatus!.videoLimit.server = '内置';
                        alert('<a href="https://github.com/yujincheng08/BiliRoaming/wiki/%E5%85%AC%E5%85%B1%E8%A7%A3%E6%9E%90%E6%9C%8D%E5%8A%A1%E5%99%A8" target="_blank">https://github.com/yujincheng08/BiliRoaming/</a>', '公共反代服务器');
                    } else if (!user.userStatus!.accessKey.token) {
                        alert([
                            '【公共反代服务器】一般都要求识别您的登录身份才能正常登录',
                            '点击【授权】将跳转到账户授权页面，点击【取消】或其他区域返回',
                            '<strong>【账户授权】是高风险操作，请仔细阅读相关说明后三思而后操作！</strong>'
                        ], undefined, [
                            {
                                text: '授权',
                                callback: () => {
                                    this.show(<'accessKey'>'accessKey.token')
                                }
                            },
                            {
                                text: '取消'
                            }
                        ])
                    }
                }
            }, '大部分新视频【内置】服务器只能获取到360P，实在不堪入目，有条件的话还是【自定义】服务器吧。对于大陆用户而言，【自定义】服务器一般填一个台湾就行，或者加上一个泰区。'),
            this.input(<'videoLimit'>'videoLimit.th', '泰区', {
                prop: { type: "url", placeholder: "www.example.com" }
            }, '泰国（东南亚）限定视频反代服务器', undefined, undefined, '解析泰国（东南亚）限定视频所用的代理服务器。东南亚视频暂时无弹幕和评论，有也是其他视频乱入的。'),
            this.input(<'videoLimit'>'videoLimit.tw', '台湾', {
                prop: { type: "url", placeholder: "www.example.com" }
            }, '台湾限定视频反代服务器', undefined, undefined, '解析【仅限台湾地区】视频所用的代理服务器。港澳台限定视频的首选。'),
            this.input(<'videoLimit'>'videoLimit.hk', '港澳', {
                prop: { type: "url", placeholder: "www.example.com" }
            }, '香港澳门限定视频反代服务器', undefined, undefined, '解析【仅限香港澳门地区】视频所用的代理服务器。与台湾不同，香港澳门基本上是绑定在一起的。'),
            this.input(<'videoLimit'>'videoLimit.cn', '大陆', {
                prop: { type: "url", placeholder: "www.example.com" }
            }, '大陆限定视频反代服务器', undefined, undefined, '解析大陆（一般）视频所用的代理服务器。此项一般是留给海外用户用的。'),
        ], 2);
        this.menuitem.player.addCard('替换 UPOS 服务器');
        const upos = Object.keys(UPOS);
        this.menuitem.player.addSetting([
            this.select(<'uposReplace'>'uposReplace.th', '泰区', {
                candidate: upos
            }, '针对泰国（东南亚）限制视频', undefined, undefined, '泰区服务器ban了大陆ip，所以必须选一个进行替换。卡加载时请酌情切换。'),
            this.select(<'uposReplace'>'uposReplace.gat', '港澳台', {
                candidate: ['不替换'].concat(upos)
            }, '针对港澳台限制视频', undefined, undefined, '港澳台视频服务器一般为大陆外的Akamai，大陆用户有可能访问不畅，请按需酌情切换。若卡加载请关闭或者换一个。'),
            this.select(<'uposReplace'>'uposReplace.nor', '一般视频', {
                candidate: ['不替换'].concat(upos)
            }, '针对其他视频', undefined, undefined, '一般视频不需要替换，除非分配给您的视频服务器实在不行，请按需酌情切换。若卡加载请关闭或者换一个。'),
            this.select(<'uposReplace'>'uposReplace.download', '下载', {
                candidate: ['不替换'].concat(upos)
            }, '针对下载功能', undefined, undefined, '一般不需要替换，除非屡屡下载403。若还是403请关闭或者换一个。'),
        ], 3);
    }
    /** 下载设置 */
    protected initSettingDownload() {
        this.menuitem.download.addSetting([
            this.button(<'aria2'>'download', '下载视频', () => {
                download.default();
            }, '当前视频', '视频', undefined, '根据当前设置下载当前网页（顶层）的视频，在页面底部列出所有可用下载源。仅在视频播放页可用。'),
            this.button(<'aria2'>'downloadDm', '下载弹幕', () => {
                danmaku.download();
            }, '当前弹幕', '弹幕', undefined, '下载当前视频的弹幕，你可以在【弹幕格式】里选择要保存的格式，详见对应设置项说明。文件名格式为“视频标题(分P标题).扩展名”或者“aid.cid.扩展名”。'),
            this.button(<'aria2'>'downloadImg', '下载图片', () => {
                download.image();
            }, '当前封面', '图片', undefined, '下载当前封面，如果有其他特殊图片，如专栏正文图片，也会一并显示。请右键对应的<strong>图片另存为</strong>。'),
            this.switch('downloadButton', '下载按钮', '播放器右侧', undefined, undefined, '在旧版播放器右侧添加下载按钮，呼出并滚动到下载设置界面，以方便快捷下载。'),
            this.chockboxs('downloadType', '请求的文件类型', ['mp4', 'dash', 'flv'], '视频封装格式', undefined, () => download.destory(), '勾选视频的封装类型，具体能不能获取到两说。封装类型≠编码类型：①mp4封装，视频编码avc+音频编码aac，画质上限1080P。②flv封装，编码同mp4，但可能切分成多个分段，须手动合并。③dash，未封装的视频轨和音频轨，以编码格式分类，aac为音频轨（含flac、杜比全景声），avc、hev和av1为视频轨（任选其一即可），须下载音视频轨各一条后手动封装为一个视频文件。另外【解除区域限制】功能获取到的下载源不受本项限制。<br>※ 2022年11月2日以后的视频已经没有flv封装。'),
            this.switch('TVresource', '请求tv端视频源', '无水印', undefined, e => {
                e && alert('下载TV源必须将【referer】置空，否则会403（无权访问）！另外浏览器不支持配置UA和referer，请更换【下载方式】！', '403警告', [
                    {
                        text: '置空referer',
                        callback: () => user.userStatus!.referer = ''
                    }
                ])
                download.destory()
            }, '请求TV端下载源，唯一的优势是可能无Bilibili水印。注意：①B站tv端大会员不通用，所以可能无法获取到大会员视频或画质。②需要进行【账户授权】，否则只能以游客身份获取下载数据。③TV源要求特定的UA且不能发送referer，基本无法通过浏览器直接下载（403无权访问），请选择其他下载工具。④mp4封装的并非tv源。'),
            this.select('downloadQn', '画质', {
                candidate: ["0", "15", "16", "32", "48", "64", "74", "80", "112", "116", "120", "125", "126", "127"]
            }, 'flv限定', undefined, () => download.destory(), '画质参数，只针对flv封装。mp4封装没得选，dash则由于特性会一次性提供所有画质选项。'),
            this.select('downloadMethod', '下载方式', {
                candidate: ['浏览器', 'IDM', 'ef2', 'aria2', 'aria2rpc']
            }, '浏览器或第三方工具', undefined, e => {
                switch (e) {
                    case '浏览器':
                        alert('由于浏览器安全限制，直接鼠标左键点击很难触发下载功能，更良好的习惯是右键要下载的文件选择【另存为】（不同浏览器可能命名不同）', '浏览器下载')
                        break;
                    case 'IDM':
                        alert('<a href="https://www.internetdownloadmanager.com/" target="_blank">IDM（Internet Download Manager）</a>是Windows端著名的的下载工具，本方式将下载数据生成IDM导出文件，您可以在打开IDM -> 任务 -> 导入 -> 从"IDM导出文件"导入开始下载。虽然有点麻烦，但是IDM支持配置UA和referer，并且下载速度的确不是浏览器能比的。', 'IDM导出文件');
                        break;
                    case 'ef2':
                        alert('<a href="https://github.com/MotooriKashin/ef2" target="_blank">ef2</a>是本脚本作者开发的一款开源的IDM辅助工具，支持直接从浏览器里拉起IDM进行下载，免去使用IDM导出文件的繁琐，同时解放你的鼠标左键。', 'ef2辅助下载');
                        break;
                    case 'aria2':
                        alert('<a href="https://github.com/aria2/aria2" target="_blank">aria2</a>是著名的开源命令行下载工具，本方式将下载命令复制到剪切板。命令行不是一般人能使用的工具，没有相应知识储备和使用习惯不推荐选择。', 'aria2');
                        break;
                    case 'aria2rpc':
                        alert('aria2支持rpc方式进行下载，正确配置后方便程度不亚于ef2方式，唯一的问题是配置起来有亿点麻烦。</br>是否跳转到rpc相关设置？', 'aria2 rpc', [
                            {
                                text: 'RPC配置',
                                callback: () => this.show(<'aria2'>'aria2.server')
                            },
                            {
                                text: '不必了'
                            }
                        ]);
                        break;
                    default:
                        break;
                }
            }, '使用浏览器下载请右键另存为而不是左键点击！其他选项需要使用对应工具，详见对应选项弹窗说明。'),
            this.input('userAgent', 'User-Agent', {
                candidate: [
                    'Bilibili Freedoooooom/MarkII',
                    'Mozilla/5.0 BiliDroid/7.0.0 (bbcallen@gmail.com)',
                    navigator.userAgent
                ]
            }, '鉴权参数', undefined, undefined, '下载工具发送给服务器的身份标志，鉴权关键参数之一，无效的User-Agent将导致403无权访问。<strong>除非你知道自己在修改什么，否则请不要轻易调整此项。</strong>此项只在使用第三方下载方式时有效。'),
            this.input('referer', 'referer', {
                candidate: [location.origin]
            }, '鉴权参数', undefined, v => {
                v && alert('您勾选了下载TV源，根据经验必须将referer置空，不然会触发403（无权访问）！是否撤销输入将referer置空？还是取消勾选tv源？', '设置冲突', [
                    {
                        text: '置空referer',
                        callback: () => user.userStatus!.referer = ''
                    },
                    {
                        text: '取消勾选tv源',
                        callback: () => user.userStatus!.TVresource = false
                    }
                ])
            }, '下载时发送给服务器的标志之一，鉴权关键参数之一，无效的User-Agent将导致403无权访问。此项在网页端必须存在，而且一般为主站域名，但是<strong>TV、APP等源此项必须为空！</strong>'),
            this.input('filepath', '下载目录', {}, '保存下载文件的本地磁盘目录', undefined, undefined, 'ef2、aria2和aria2rpc方式限定。Windows平台请注意使用反斜杠哦。')
        ]);
        this.menuitem.download.addCard('aria2 相关');
        this.menuitem.download.addSetting([
            this.input(<'aria2'>'aria2.server', 'RPC服务器', {
                prop: { type: "url", placeholder: "http://localhost" },
                candidate: ['http://localhost']
            }, '本地或远程链接', undefined, undefined, '端口号请另外输入。建议使用下方按钮测试RPC连接可用性。'),
            this.input(<'aria2'>'aria2.port', '端口', {
                prop: { type: "number", placeholder: "6800" },
                candidate: ['6800']
            }, '本地或远程端口', undefined, undefined, '服务器链接另外输入。建议使用下方按钮测试RPC连接可用性。'),
            this.input(<'aria2'>'aria2.token', 'token', {
                prop: { type: "password" }
            }, '鉴权', undefined, undefined, '如果RPC服务器启用了token鉴权的话。'),
            this.slider(<'aria2'>'aria2.split', '分段数目', {
                min: 1,
                max: 16,
                precision: 15
            }, '分段并发下载', undefined, undefined, '对于支持断点续传的文件，启用多线程同时并发下载通常是一种非常有效的提高下载速度的方法。如果需要请自行调整一个合适的并发数，1表示不并发下载。值得注意的是，部分服务器会限制并发连接数目，并发连接过多有触发风控甚至被临时封禁的风险，所以并不是并发数越多越好。'),
            this.slider(<'aria2'>'aria2.size', '分段大小', {
                min: 1,
                max: 20,
                precision: 19
            }, '单位：/MB', undefined, undefined, '如果一个文件有多个下载源，那么此项会间接决定使用几个下载源。一旦要下载的文件不小于此项的2倍，aria2便会同时尝试连接多个下载源。这也是提高下载速率的有效方法。注意：某种意义上此项是越小越好，原因不言而喻。'),
            this.button(<'aria2'>'aria2.test', '测试RPC连接', () => {
                const tst = toast.list('正在测试RPC连接~');
                new Aria2().getVersion()
                    .then(d => {
                        tst.type = 'success';
                        tst.push(`-------aria2 v${d.version}-------`, ...d.enabledFeatures);
                    })
                    .catch(e => {
                        tst.type = 'error';
                        tst.push('RPC链接失败 ಥ_ಥ', e);
                        debug.error('RPC链接失败 ಥ_ಥ', e);
                    })
                    .finally(() => {
                        tst.delay = 4;
                    });
            }, '获取aria2信息', 'ping', undefined, '请确定正确配置并启用了aria2的RPC服务器。')
        ], 1);
        this.menuitem.download.addCard('ef2 相关');
        this.menuitem.download.addSetting([
            this.switch(<'ef2'>'ef2.delay', '稍后下载', '添加到IDM下载队列但不开始', undefined, undefined, '要开始时请手动到IDM队列里点击开始。本项可以用来批量下载而不弹出多个窗口。注意：B站视频源使用的是临时链接，过期后无法访问，请及时下载或清理。'),
            this.switch(<'ef2'>'ef2.silence', '静默下载', '跳过IDM确认对话框', undefined, undefined, '默认情况下IDM会弹窗询问是否确认下载，在该确认框中可以调整保存目录和文件名等操作。启用本项以跳过该确认框。')
        ], 2);
    }
    /**
     * 新建开关设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param sub 副标题
     * @param svg 图标
     * @param callback 用户调整设置的回调，将新值作为第一个参数传入
     * @param desc 浮动窗口
     */
    protected switch(id: keyof typeof userStatus, label: string, sub?: string, svg?: string, callback?: (value: boolean) => void, desc?: string) {
        const item = new SettingItem();
        const button = new SwitchButton();
        const arr = id.split('.');
        let looping = false;
        item.init(arr.join(''), label, sub, svg);
        button.update(Chain.getStatus(id));
        button.addEventListener('change', () => {
            looping = true;
            Chain.setStatus(id, button.value);
            callback && callback(button.value);
        });
        user.bindChange(<'toast'>arr.shift(), v => {
            looping || button.update(Chain.getStatus(arr.join('.'), v));
            looping = false;
        });
        item.value(button);
        this.settingItem[id] = item;
        desc && new Desc().value(label, desc, item);
        return item;
    }
    /**
     * 新建下拉菜单设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param value 配置数据
     * @param sub 副标题
     * @param svg 图标
     * @param callback 用户调整设置的回调，将新值作为第一个参数传入
     * @param desc 浮动窗口
     */
    protected select(id: keyof typeof userStatus, label: string, value: ISelectMenuValue, sub?: string, svg?: string, callback?: (value: string) => void, desc?: string) {
        const item = new SettingItem();
        const select = new SelectMenu();
        const arr = id.split('.');
        let looping = false;
        item.init(arr.join(''), label, sub, svg);
        value.value = Chain.getStatus(id);
        select.update(value);
        select.addEventListener('change', () => {
            looping = true;
            Chain.setStatus(id, select.value);
            callback && callback(select.value);
        });
        user.bindChange(<'toast'>arr.shift(), v => {
            looping || (select.value = Chain.getStatus(arr.join('.'), v));
            looping = false;
        });
        item.value(select);
        this.settingItem[id] = item;
        desc && new Desc().value(label, desc, item);
        return item;
    }
    /**
     * 创建滑动条菜单设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param value 配置数据
     * @param sub 副标题
     * @param svg 图标
     * @param callback 用户调整设置的回调，将新值作为第一个参数传入
     * @param desc 浮动窗口
     */
    protected slider(id: keyof typeof userStatus, label: string, value: ISliderBlockValue, sub?: string, svg?: string, callback?: (value: number) => void, desc?: string) {
        const item = new SettingItem();
        const slider = new SliderBlock();
        const arr = id.split('.');
        let looping = false;
        item.init(arr.join(''), label, sub, svg);
        value.value = Chain.getStatus(id);
        slider.update(value);
        slider.addEventListener('change', () => {
            looping = true
            Chain.setStatus(id, slider.value);
            callback && callback(slider.value);
        });
        user.bindChange(<'toast'>arr.shift(), v => {
            looping || (slider.value = Chain.getStatus(arr.join('.'), v));
            looping = false;
        });
        item.value(slider);
        this.settingItem[id] = item;
        desc && new Desc().value(label, desc, item);
        return item;
    }
    /**
     * 创建自定义滑动条菜单设置
     * @param id 用来索引的字符串
     * @param label 标题
     * @param value 配置数据
     * @param callback 输入回调
     * @param sub 副标题
     * @param svg 图标
     * @param desc 浮动窗口
     */
    protected sliderCustom(id: keyof typeof userStatus, label: string, value: ISliderBlockValue, callback: (value: number) => void, sub?: string, svg?: string, desc?: string) {
        const item = new SettingItem();
        const slider = new SliderBlock();
        item.init('', label, sub, svg);
        slider.update(value);
        slider.addEventListener('change', () => {
            callback(slider.value);
        });
        item.value(slider);
        this.settingItem[id] = item;
        desc && new Desc().value(label, desc, item);
        return item;
    }
    /**
     * 创建自定义输入框设置
     * @param id 用来索引的字符串
     * @param label 标题
     * @param value 配置数据
     * @param callback 输入回调
     * @param sub 副标题
     * @param svg 图标
     * @param desc 浮动窗口
     */
    protected inputCustom(id: keyof typeof userStatus, label: string, value: IInputAreaValue, callback: (input: string | FileList) => void, sub?: string, svg?: string, desc?: string) {
        const item = new SettingItem();
        const input = new InputArea();
        item.init('', label, sub, svg);
        input.update(value);
        input.addEventListener('change', () => {
            callback(input.value);
        });
        item.value(input);
        this.settingItem[id] = item;
        desc && new Desc().value(label, desc, item);
        return item;
    }
    /**
     * 创建输入框设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param value 配置数据
     * @param sub 副标题
     * @param svg 图标
     * @param callback 输入回调
     * @param desc 浮动窗口
     */
    protected input(id: keyof typeof userStatus, label: string, value: IInputAreaValue, sub?: string, svg?: string, callback?: (input: string | FileList) => void, desc?: string) {
        const item = new SettingItem();
        const input = new InputArea();
        const arr = id.split('.');
        let looping = false;
        item.init(arr.join(''), label, sub, svg);
        value.value = Chain.getStatus(id);
        input.update(value);
        input.addEventListener('change', () => {
            looping = true
            Chain.setStatus(id, input.value);
            callback && callback(input.value);
        });
        user.bindChange(<'toast'>arr.shift(), v => {
            looping || (input.value = Chain.getStatus(arr.join('.'), v));
            looping = false;
        });
        item.value(input);
        this.settingItem[id] = item;
        desc && new Desc().value(label, desc, item);
        return item;
    }
    /**
     * 创建按钮设置
     * @param id 用来索引的字符串
     * @param label 标题
     * @param callback 按钮点击回调
     * @param sub 副标题
     * @param text 按钮文字
     * @param svg 图标
     * @param desc 浮动窗口
     */
    protected button(id: keyof typeof userStatus, label: string, callback: () => void, sub?: string, text?: string, svg?: string, desc?: string) {
        const item = new SettingItem();
        const button = new PushButton();
        item.init('', label, sub, svg);
        text && (button.text = text);
        button.addEventListener('change', ev => {
            callback();
        });
        item.value(button);
        this.settingItem[id] = item;
        desc && new Desc().value(label, desc, item);
        return item;
    }
    /**
     * 新建复选框设置
     * @param id 用户数据键或链式字符串，链式字符串用来提取深层数据
     * @param label 标题
     * @param values 配置数据
     * @param sub 副标题
     * @param svg 图标
     * @param callback 用户调整设置的回调，将新值作为第一个参数传入
     * @param desc 浮动窗口
     */
    protected chockboxs(id: keyof typeof userStatus, label: string, values: string[], sub?: string, svg?: string, callback?: (value: string[]) => void, desc?: string) {
        const item = new SettingItem();
        const checkboxs = new CheckBoxs();
        const arr = id.split('.');
        let looping = false;
        item.init(arr.join(''), label, sub, svg);
        checkboxs.update(values);
        checkboxs.value = Array.from(Chain.getStatus(id));
        checkboxs.addEventListener('change', () => {
            looping = true;
            Chain.setStatus(id, checkboxs.value);
            callback && callback(checkboxs.value);
        })
        user.bindChange(<'toast'>arr.shift(), v => {
            looping || (checkboxs.value = Chain.getStatus(arr.join('.'), v));
            looping = false;
        });
        item.value(checkboxs);
        this.settingItem[id] = item;
        desc && new Desc().value(label, desc, item);
        return item;
    }
    /**
     * 显示设置面板
     * @param id 设置项注册id，id不在可选项时可以使用强制断言
     * @example
     * this.show('accessKey.token') // 显示设置面板并滚动到【账户授权】那一项
     * this.show(<'accessKey'>'accessKey.token') // TypeScript 强制断言
     */
    show(id?: keyof typeof userStatus) {
        this.interface.show();
        if (id && this.settingItem[id]) {
            this.settingItem[id].dispatchEvent(new Event('show'));
        } else {
            this.menuitem.common.click();
        }
    }
}