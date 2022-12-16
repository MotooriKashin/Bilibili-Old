import { debug } from "../utils/debug";
import { addCss, } from "../utils/element";
import { objUrl } from "../utils/format/url";
import { methodHook, propertyHook } from "../utils/hook/method";

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

/** 播放器引导 */
export class Player {
    /** 播放器启动参数修改回调栈 */
    protected static modifyArgumentCallback: ((args: IArguments) => void)[] = [];
    /** 添加播放器启动参数修改命令 */
    static addModifyArgument(callback: (args: IArguments) => void) {
        this.modifyArgumentCallback.push(callback);
    }
    /** 捕获的新版播放器 */
    protected nanoPlayer: any;
    protected connect: any;
    protected isConnect: boolean = false;
    constructor() {
        // 3.x播放器
        propertyHook.modify(window, 'nano', (v: any) => {
            debug('捕获新版播放器！')
            const createPlayer = v.createPlayer;
            const that = this;
            propertyHook(v, 'createPlayer', function () {
                debug('新版播放器试图启动！')
                if (that.isEmbedPlayer) throw new Error('爆破新版播放器！');
                that.nanoPlayer = createPlayer.call(v, ...arguments);
                (<any>that).createPlayer(...arguments); // 记录播放器初始化参数
                that.connect = that.nanoPlayer.connect;
                that.nanoPlayer.connect = function () {
                    if (that.isConnect) {
                        debug('允许新版播放器启动！')
                        return that.connect?.();
                    } else {
                        that.isConnect = true;
                        return Promise.resolve(true);
                    }
                }
                return that.nanoPlayer;
            });
            if ((<any>window).player) {
                try {
                    const manifest = (<any>window).player?.getManifest();
                    debug('播放器实例已存在，可能脚本注入过慢！', manifest);
                    manifest && this.createPlayer(manifest);
                } catch (e) {
                    debug('读取播放器启动参数失败！', e);
                }
            }
            return v;
        });
    }
    /** 修改播放器启动参数 */
    protected modifyArgument(args: IArguments) {
        while (Player.modifyArgumentCallback.length) {
            Player.modifyArgumentCallback.shift()?.(args);
        }
    }
    protected initData: Record<string, any> = {};
    protected dataInited = false;
    protected createPlayer(initData: NanoInitData, theme?: Record<string, string>) {
        this.dataInited = true;
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
        this.dataInitedCallback();
    }
    /** 脚本初始化中 */
    // private loading = true;
    /** 旧版播放器已启用 */
    private isEmbedPlayer = false;
    /** 旧版播放器正常引导 */
    EmbedPlayer(loadPlayer: Function, isEmbedPlayer = true) {
        this.nanoPermit = () => { } // 禁止放行新版播放器
        // this.loading = false; // 脚本初始化完成
        this.isEmbedPlayer = isEmbedPlayer; // 旧版播放器正常引导
        // 1.x/2.x播放器
        methodHook(window, 'EmbedPlayer', () => loadPlayer(), d => this.modifyArgument(d));
        if ((<any>window).player?.disconnect) {
            try {
                debug('爆破新版播放器!');
                (<any>window).player.disconnect();
                this.nanoPlayer || (this.nanoPlayer = (<any>window).player);
            } catch { }
        }
    }
    /** 通过hook新版播放器来引导旧版播放器 */
    connectPlayer(loadPlayer: Function) {
        this.EmbedPlayer(loadPlayer, false);
        this.dataInitedCallback(() => {
            // 记录播放器初始化参数后引导播放器
            (<any>window).EmbedPlayer('player', '', objUrl('', <any>this.initData));
            if (this.nanoPlayer) {
                // 为3.x播放器代理player实例方法
                Object.defineProperties(this.nanoPlayer, {
                    addEventListener: { get: () => (<any>window).player?.addEventListener },
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
        });
        // 修正播放器样式
        addCss(`#bofqi .player,#bilibili-player .player{width: 100%;height: 100%;display: block;}.bilibili-player .bilibili-player-auxiliary-area{z-index: 1;}`, 'nano-fix');
    }
    /** 不启用旧版播放器允许新版播放器启动 */
    nanoPermit() {
        // this.loading = false;
        if (this.isConnect) {
            debug('允许新版播放器启动！');
            this.connect?.()
        } else {
            this.isConnect = true;
        }
    }
    /** 播放器启动栈 */
    private dataInitedCallbacks: Function[] = [];
    /** 捕获启动数据后启动播放器 */
    private dataInitedCallback(callback?: Function) {
        callback && this.dataInitedCallbacks.push(callback);
        if (this.dataInited) {
            while (this.dataInitedCallbacks.length) {
                this.dataInitedCallbacks.shift()?.();
            }
        }
    }
}