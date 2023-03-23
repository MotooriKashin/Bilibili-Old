import { apiPlayurl, IPlayurlDash, IPlayurlDurl } from "../io/api-playurl";
import { ApiPlayurlInterface } from "../io/api-playurl-interface";
import { ApiPlayurlIntl } from "../io/api-playurl-intl";
import { ApiPlayurlTv } from "../io/api-playurl-tv";
import { ApiPlayurlProj } from "../io/api-playurlproj";
import { qn } from "../io/fnval";
import { BLOD } from "./bilibili-old";
import { Aria2 } from "./download/aria2";
import { Ef2 } from "./download/ef2";
import { IDownlodDataFilter, PlayinfoFilter } from "./download/playinfo";
import { switchVideo } from "./observer";
import { toast } from "./toast";
import { BilioldDownload } from "./ui/download";
import { PreviewImage } from "./ui/preview-image";
import { user } from "./user";
import { videoInfo } from "./video-info";
import { videoLimit } from "./videolimit";

export class Download {
    /** 下载界面 */
    private ui = new BilioldDownload();
    /** 数据缓存 */
    private data = this.ui.init();
    private previewImage?: PreviewImage;
    /** 下载按钮 */
    private bgrayButtonBtn?: HTMLDivElement;
    private get fileName() {
        if (videoInfo.metadata) {
            return `${videoInfo.metadata.album}(${videoInfo.metadata.title})`;
        }
        return '';
    }
    constructor() {
        // 切p时清空数据
        switchVideo(() => {
            this.destory();
            user.userStatus!.downloadButton && this.bgrayButton();
        });
    }
    /** 解码playinfo */
    private decodePlayinfo(playinfo: Partial<Record<"data" | "result" | "durl" | "dash", any>>, fileName: string = this.fileName) {
        const data = new PlayinfoFilter(fileName).filter(playinfo);
        data.forEach(d => {
            this.data[d.type] || (this.data[d.type] = []);
            this.data[d.type].push({
                url: d.url,
                fileName,
                quality: Reflect.has(d, "flv") ? `${d.quality}*${d.flv}` : d.quality,
                size: d.size,
                color: d.color,
                onClick: ev => this.pushDownload(d, ev)
            })
        });
    }
    /** 分发数据 */
    private pushDownload(data: IDownlodDataFilter, ev: MouseEvent) {
        if (data.onClick) {
            data.onClick(ev)
        } else if (data.url) {
            switch (user.userStatus!.downloadMethod) {
                case 'IDM':
                    ev.preventDefault();
                    new Ef2(user.userStatus!.userAgent, user.userStatus!.referer, user.userStatus!.filepath, user.userStatus!.ef2.delay, user.userStatus!.ef2.silence)
                        .file({
                            url: data.url[0],
                            out: data.fileName
                        });
                    toast.success('保存IDM导出文件后，打开IDM -> 任务 -> 导入 -> 从"IDM导出文件"导入即可下载');
                    break;
                case 'ef2':
                    ev.preventDefault();
                    new Ef2(user.userStatus!.userAgent, user.userStatus!.referer, user.userStatus!.filepath, user.userStatus!.ef2.delay, user.userStatus!.ef2.silence)
                        .sendLinkToIDM({
                            url: data.url[0],
                            out: data.fileName
                        });
                    toast.warning('允许浏览器打开【IDM EF2辅助工具】即可开始下载', '如果浏览器和IDM都没有任何反应，那些请先安装ef2辅助工具。');
                    break;
                case 'aria2':
                    ev.preventDefault();
                    const cmdLine = new Aria2(user.userStatus!.userAgent, user.userStatus!.referer, user.userStatus!.filepath, user.userStatus!.aria2.server, user.userStatus!.aria2.port, user.userStatus!.aria2.token, user.userStatus!.aria2.split, user.userStatus!.aria2.size)
                        .cmdlet({
                            urls: data.url,
                            out: data.fileName
                        });
                    toast.success(
                        '已复制下载命令到剪切板，粘贴到终端里回车即可开始下载。当然前提是您的设备已配置好了aria2。',
                        '--------------',
                        cmdLine
                    );
                    break;
                case 'aria2rpc':
                    ev.preventDefault();
                    new Aria2(user.userStatus!.userAgent, user.userStatus!.referer, user.userStatus!.filepath, user.userStatus!.aria2.server, user.userStatus!.aria2.port, user.userStatus!.aria2.token, user.userStatus!.aria2.split, user.userStatus!.aria2.size)
                        .rpc({
                            urls: data.url,
                            out: data.fileName
                        })
                        .then(d => {
                            toast.success('aria2已经开始下载', `GUID: ${d}`);
                        })
                        .catch(e => {
                            toast.error('aria2[RPC]错误！', e);
                        });
                    break;
                default:
                    toast.warning('当前下载方式设定为浏览器（默认），受限于浏览器安全策略，可能并未触发下载而是打开了一个标签页，所以更良好的习惯是右键要下载的链接【另存为】。另外如果下载失败（403无权访问），请尝试在设置里修改下载方式及其他下载相关选项。');
                    break;
            }
        }
    }
    /** 请求中 */
    protected downloading = 0;
    /** 已请求 */
    protected gets: string[] = [];
    /** 下载当前视频 */
    default() {
        if (this.downloading) return;
        if (!BLOD.cid) return toast.warning('未找到视频文件');
        this.ui.show();
        user.userStatus!.TVresource || this.getPlayInfo();
        user.userStatus!.downloadType.includes('mp4') && this.getMp4();
        user.userStatus!.downloadType.includes('flv') && this.getFlv();
        user.userStatus!.downloadType.includes('dash') && this.getDash();
    }
    protected getPlayInfo() {
        if (this.gets.includes('_')) return;
        this.decodePlayinfo(videoLimit.__playinfo__);
        this.gets.push('_');
    }
    protected getMp4() {
        if (this.data.mp4 || this.gets.includes('mp4')) return;
        this.downloading++;
        (BLOD.pgc ? this.mp4(BLOD.cid) : this.flv(BLOD.aid, BLOD.cid))
            .then(d => {
                this.gets.push('mp4');
                this.decodePlayinfo(d);
            })
            .finally(() => {
                this.downloading--;
            });
    }
    protected getFlv() {
        if (this.data.flv || this.gets.includes('flv')) return;
        this.downloading++;
        (user.userStatus!.TVresource
            ? this.tv(BLOD.aid, BLOD.cid, false, user.userStatus!.downloadQn)
            : this.interface(BLOD.cid, user.userStatus!.downloadQn))
            .then(d => { this.gets.push('flv'); this.decodePlayinfo(d) })
            .finally(() => {
                this.downloading--;
            });
    }
    protected getDash() {
        if (this.data.aac || this.gets.includes('dash') || this.data.hev || this.data.av1) return;
        this.downloading++;
        (user.userStatus!.TVresource
            ? this.tv(BLOD.aid, BLOD.cid)
            : this.dash(BLOD.aid, BLOD.cid))
            .then(d => { this.gets.push('dash'); this.decodePlayinfo(d) })
            .finally(() => {
                this.downloading--;
            });
    }
    /** 清空数据 */
    destory() {
        this.ui.remove();
        this.data = this.ui.init();
        this.downloading = 0;
        this.gets = [];
        videoLimit.__playinfo__ = undefined;
    }
    private mp4(cid: number) {
        return new ApiPlayurlProj({ cid, access_key: user.userStatus!.accessKey.token }, BLOD.pgc).getData();
    }
    private flv(avid: number, cid: number) {
        return <Promise<IPlayurlDurl>>apiPlayurl({ avid, cid }, false, BLOD.pgc);
    }
    private dash(avid: number, cid: number) {
        return <Promise<IPlayurlDash>>apiPlayurl({ avid, cid }, true, BLOD.pgc);
    }
    private tv(avid: number, cid: number): Promise<IPlayurlDash>;
    private tv(avid: number, cid: number, dash: false, quality: number): Promise<IPlayurlDurl>;
    private tv(avid: number, cid: number, dash: true): Promise<IPlayurlDash>;
    private tv(avid: number, cid: number, dash = true, quality = qn) {
        return new ApiPlayurlTv({ avid, cid, access_key: user.userStatus!.accessKey.token, qn: quality }, dash, BLOD.pgc).getData();
    }
    private intl(avid: number, cid: number): Promise<IPlayurlDash>;
    private intl(avid: number, cid: number, dash: false): Promise<IPlayurlDurl>;
    private intl(avid: number, cid: number, dash: true): Promise<IPlayurlDash>;
    private intl(aid: number, cid: number, dash = true) {
        return new ApiPlayurlIntl({ aid, cid, access_key: user.userStatus!.accessKey.token }, dash, BLOD.pgc).getData();
    }
    private interface(cid: number, quality = qn) {
        return new ApiPlayurlInterface({ cid, quality }, BLOD.pgc).getData();
    }
    image() {
        const src: string[] = [];
        videoInfo.metadata?.artwork?.forEach(d => src.push(d.src));
        if (location.host === 'live.bilibili.com' && (<any>window).__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover) {
            // 直播封面
            src.push((<any>window).__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover);
        }
        if (/\/read\/[Cc][Vv]/.test(location.href)) {
            document.querySelectorAll<HTMLImageElement>(".article-holder img").forEach(d => { d.src && src.push(d.src) })
        }
        if (src.length) {
            this.previewImage || (this.previewImage = new PreviewImage());
            this.previewImage.value(src);
        } else {
            toast.warning('未找到封面信息！')
        }
    }
    /** 添加播放器下载按钮 */
    private bgrayButton() {
        if (!this.bgrayButtonBtn) {
            this.bgrayButtonBtn = document.createElement('div');
            this.bgrayButtonBtn.classList.add('bgray-btn', 'show');
            this.bgrayButtonBtn.title = '下载当前视频';
            this.bgrayButtonBtn.innerHTML = '下载<br>视频';
            this.bgrayButtonBtn.addEventListener('click', e => {
                BLOD.ui?.show(<any>'download');
                e.stopPropagation();
            });
        }
        document.querySelector('.bgray-btn-wrap')?.appendChild(this.bgrayButtonBtn);
    }
}
/** 下载组件 */
export const download = new Download();