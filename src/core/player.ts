import { BLOD } from "../bilibili-old";
import { apiArticleCards } from "../io/api-article-cards";
import { URLS } from "../io/urls";
import { debug } from "../utils/debug";
import { addCss, loadScript, loadStyle } from "../utils/element";
import { objUrl, urlObj } from "../utils/format/url";
import { methodHook, propertyHook } from "../utils/hook/method";
import { switchVideo } from "./observer";

interface NanoInitData {
    aid: number;
    cid: number;
    bvid: string;
    revision: number
    featureList: Set<string>,
    enableAV1: boolean;
    enableWMP: boolean;
    enableHEVC: boolean;
    hideBoxShadow: boolean;
    t: number;
    kind: number;
    element: HTMLDivElement;
    auxiliary: HTMLDivElement;
}

enum GroupKind {
    Ugc,
    Pgc,
    Pugv
}

/** 播放器引导 */
export class Player {
    /** 播放器启动参数修改回调栈 */
    protected static modifyArgumentCallback: ((args: IArguments) => void)[] = [];
    /** 添加播放器启动参数修改命令 */
    static addModifyArgument(callback: (args: IArguments) => void) {
        this.modifyArgumentCallback.push(callback);
    }
    protected GroupKind = GroupKind;
    protected initData: Record<string, any> = {};
    constructor(protected BLOD: BLOD) {
        this.EmbedPlayer();
        switchVideo(this.switchVideo);
    }
    protected EmbedPlayer() {
        // 1.x/2.x播放器
        methodHook(window, 'EmbedPlayer', () => this.loadPlayer(), d => this.modifyArgument(d));
        // 3.x播放器
        propertyHook(window, 'nano', this);
        // 与新版页面共用此接口容易出故障
        // propertyHook(window, 'PlayerAgent', undefined);
    }
    /** 修改播放器启动参数 */
    protected modifyArgument(args: IArguments) {
        const obj = urlObj(`?${args[2]}`);
        this.BLOD.status.automate.screenWide && (obj.as_wide = 1);
        this.BLOD.status.automate.autoPlay && (obj.autoplay = 1);
        this.BLOD.status.automate.noDanmaku && (obj.danmaku = 0);
        args[2] = objUrl('', obj);
        while (Player.modifyArgumentCallback.length) {
            Player.modifyArgumentCallback.shift()?.(args);
        }
    }
    protected createPlayer(initData: NanoInitData, theme: Record<string, string>) {
        Object.entries(initData).forEach(d => {
            switch (typeof d[1]) {
                case 'bigint':
                case 'boolean':
                case 'number':
                case 'string':
                case 'undefined':
                    this.initData[d[0]] = d[1];
                    break;
                default:
                    break;
            }
        });
        this.initData.as_wide = true; // 需要替换3.x播放器的场合还是强制宽屏启动吧
        return this;
    }
    protected connect() {
        (<any>window).EmbedPlayer('player', '', objUrl('', <any>this.initData));
        // 修正播放器样式
        addCss(`#bofqi .player,#bilibili-player .player{width: 100%;height: 100%;display: block;}.bilibili-player .bilibili-player-auxiliary-area{z-index: 1;}`, 'nano-fix');
        // 为3.x播放器代理player实例方法
        Object.defineProperties(this, {
            addEventListener: { get: () => (<any>window).player?.addEventListener },
            // destroy: { get: () => (<any>window).player?.destroy },
            directiveDispatcher: { get: () => (<any>window).player?.directiveDispatcher },
            editorCenter: { get: () => (<any>window).player?.editorCenter },
            exitFullScreen: { get: () => (<any>window).player?.exitFullScreen },
            getCurrentTime: { get: () => (<any>window).player?.getCurrentTime },
            getDuration: { get: () => (<any>window).player?.getDuration },
            next: { get: () => (<any>window).player?.next },
            ogvUpdate: { get: () => (<any>window).player?.ogvUpdate },
            pause: { get: () => (<any>window).player?.pause },
            play: { get: () => (<any>window).player?.play },
            prev: { get: () => (<any>window).player?.prev },
            reload: { get: () => (<any>window).player?.reload },
            seek: { get: () => (<any>window).player?.seek },
            stop: { get: () => (<any>window).player?.stop },
            volume: { get: () => (<any>window).player?.volume }
        })
    }
    /** 加载播放器 */
    protected async loadPlayer() {
        try {
            const tasks: Promise<string>[] = [];
            if (!_UserScript_) {
                tasks.push(
                    this.BLOD.GM.executeScript('player/video.js', true),
                    this.BLOD.GM.insertCSS('player/video.css', true)
                );
            }
            // 检查jQuery依赖
            if (!(<any>window).jQuery) {
                tasks.push(<any>loadScript(URLS.JQUERY));
            }
            const arr = await Promise.all(tasks);
            if (_UserScript_) {
                return loadScript(URLS.VIDEO);
            }
            return await Promise.all([loadScript(arr[0]), loadStyle(arr[1])]);
        } catch (e) {
            this.BLOD.toast.error('播放器加载失败！', '已回滚~', e)();
            loadScript(URLS.VIDEO);
        }
    }
    /** 切p回调 */
    private switchVideo = async () => {
        if (!this.BLOD.videoInfo.metadata && this.BLOD.aid) {
            apiArticleCards({ av: this.BLOD.aid })
                .then(d => {
                    Object.values(d).forEach(d => this.BLOD.videoInfo.aidDatail(d));
                    this.BLOD.videoInfo.mediaSession();
                })
                .catch((e) => { debug.error('获取aid详情出错！', e) })
        } else {
            this.BLOD.videoInfo.mediaSession();
        }
    }
}