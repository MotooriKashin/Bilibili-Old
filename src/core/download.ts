import { BLOD } from "../bilibili-old";
import { apiPlayurl, IPlayurlDash, IPlayurlDurl } from "../io/api-playurl";
import { ApiPlayurlInterface } from "../io/api-playurl-interface";
import { ApiPlayurlIntl } from "../io/api-playurl-intl";
import { ApiPlayurlTv } from "../io/api-playurl-tv";
import { ApiPlayurlProj } from "../io/api-playurlproj";
import { qn } from "../io/fnval";
import { addElement } from "../utils/element";
import { Aria2 } from "./download/aria2";
import { Ef2 } from "./download/ef2";
import { IDownlodDataFilter, PlayinfoFilter } from "./download/playinfo";
import { switchVideo } from "./observer";
import { alert } from "./ui/alert";
import { Desc } from "./ui/desc";
import { BilioldDownload } from "./ui/download";
import { PopupBox } from "./ui/utils/popupbox";

export class Download {
    /** 下载界面 */
    private ui = new BilioldDownload();
    /** 数据缓存 */
    private data = this.ui.init();
    private get fileName() {
        if (this.BLOD.videoInfo.metadata) {
            return `${this.BLOD.videoInfo.metadata.album}(${this.BLOD.videoInfo.metadata.title})`;
        }
        return '';
    }
    constructor(private BLOD: BLOD) {
        // 切p时清空数据
        switchVideo(() => this.destory());
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
            switch (this.BLOD.status.downloadMethod) {
                case 'IDM':
                    ev.preventDefault();
                    new Ef2(this.BLOD.status.userAgent, this.BLOD.status.referer, this.BLOD.status.filepath, this.BLOD.status.ef2.delay, this.BLOD.status.ef2.silence)
                        .file({
                            url: data.url[0],
                            out: data.fileName
                        });
                    this.BLOD.toast.success('保存IDM导出文件后，打开IDM -> 任务 -> 导入 -> 从"IDM导出文件"导入即可下载');
                    break;
                case 'ef2':
                    ev.preventDefault();
                    new Ef2(this.BLOD.status.userAgent, this.BLOD.status.referer, this.BLOD.status.filepath, this.BLOD.status.ef2.delay, this.BLOD.status.ef2.silence)
                        .sendLinkToIDM({
                            url: data.url[0],
                            out: data.fileName
                        });
                    this.BLOD.toast.warning('允许浏览器打开【IDM EF2辅助工具】即可开始下载', '如果浏览器和IDM都没有任何反应，那些请先安装ef2辅助工具。');
                    break;
                case 'aria2':
                    ev.preventDefault();
                    const cmdLine = new Aria2(this.BLOD.status.userAgent, this.BLOD.status.referer, this.BLOD.status.filepath, this.BLOD.status.aria2.server, this.BLOD.status.aria2.port, this.BLOD.status.aria2.token, this.BLOD.status.aria2.split, this.BLOD.status.aria2.size)
                        .cmdlet({
                            urls: data.url,
                            out: data.fileName
                        });
                    this.BLOD.toast.success(
                        '已复制下载命令到剪切板，粘贴到终端里回车即可开始下载。当然前提是您的设备已配置好了aria2。',
                        '--------------',
                        cmdLine
                    );
                    break;
                case 'aria2rpc':
                    ev.preventDefault();
                    new Aria2(this.BLOD.status.userAgent, this.BLOD.status.referer, this.BLOD.status.filepath, this.BLOD.status.aria2.server, this.BLOD.status.aria2.port, this.BLOD.status.aria2.token, this.BLOD.status.aria2.split, this.BLOD.status.aria2.size)
                        .rpc({
                            urls: data.url,
                            out: data.fileName
                        })
                        .then(d => {
                            this.BLOD.toast.success('aria2已经开始下载', `GUID: ${d}`);
                        })
                        .catch(e => {
                            this.BLOD.toast.error('aria2[RPC]错误！', e);
                        });
                    break;
                default:
                    this.BLOD.toast.warning('当前下载方式设定为浏览器（默认），受限于浏览器安全策略，可能并未触发下载而是打开了一个标签页，所以更良好的习惯是右键要下载的链接【另存为】。另外如果下载失败（403无权访问），请尝试在设置里修改下载方式及其他下载相关选项。');
                    break;
            }
        }
    }
    /** 请求中 */
    protected downloading = false;
    /** 已请求 */
    protected gets: string[] = [];
    /** 下载当前视频 */
    default() {
        if (this.downloading) return;
        if (!this.BLOD.cid) return this.BLOD.toast.warning('未找到视频文件');
        this.downloading = true;
        this.ui.show();
        this.BLOD.status.TVresource || this.gets.includes('_') || (this.decodePlayinfo(this.BLOD.videoLimit.__playinfo__), this.gets.push('_'));
        const tasks: Promise<any>[] = [];
        this.BLOD.status.downloadType.includes('mp4') && (this.data.mp4 || this.gets.includes('mp4') || tasks.push(this.mp4(this.BLOD.cid).then(d => { this.gets.push('mp4'); this.decodePlayinfo(d) })));
        this.BLOD.status.downloadType.includes('flv') && (this.data.flv || this.gets.includes('flv') || tasks.push(
            (this.BLOD.status.TVresource
                ? this.tv(this.BLOD.aid, this.BLOD.cid, false, this.BLOD.status.downloadQn)
                : this.interface(this.BLOD.cid, this.BLOD.status.downloadQn))
                .then(d => { this.gets.push('flv'); this.decodePlayinfo(d) })
        ));
        this.BLOD.status.downloadType.includes('dash') && (this.data.aac || this.gets.includes('dash') || this.data.hev || this.data.av1 || tasks.push(
            (this.BLOD.status.TVresource
                ? this.tv(this.BLOD.aid, this.BLOD.cid)
                : this.dash(this.BLOD.aid, this.BLOD.cid))
                .then(d => { this.gets.push('dash'); this.decodePlayinfo(d) })
        ));
        Promise.allSettled(tasks).finally(() => { this.downloading = false; });
    }
    /** 清空数据 */
    destory() {
        this.ui.remove();
        this.data = this.ui.init();
        this.downloading = false;
        this.gets = [];
        this.BLOD.videoLimit.__playinfo__ = undefined;
    }
    private mp4(cid: number) {
        return new ApiPlayurlProj({ cid, access_key: this.BLOD.status.accessKey.token }, this.BLOD.pgc).getData();
    }
    // private flv(avid: number, cid: number) {
    //     return <Promise<IPlayurlDurl>>apiPlayurl({ avid, cid }, false, this.BLOD.pgc);
    // }
    private dash(avid: number, cid: number) {
        return <Promise<IPlayurlDash>>apiPlayurl({ avid, cid }, true, this.BLOD.pgc);
    }
    private tv(avid: number, cid: number): Promise<IPlayurlDash>;
    private tv(avid: number, cid: number, dash: false, quality: number): Promise<IPlayurlDurl>;
    private tv(avid: number, cid: number, dash: true): Promise<IPlayurlDash>;
    private tv(avid: number, cid: number, dash = true, quality = qn) {
        return new ApiPlayurlTv({ avid, cid, access_key: this.BLOD.status.accessKey.token, qn: quality }, dash, this.BLOD.pgc).getData();
    }
    private intl(avid: number, cid: number): Promise<IPlayurlDash>;
    private intl(avid: number, cid: number, dash: false): Promise<IPlayurlDurl>;
    private intl(avid: number, cid: number, dash: true): Promise<IPlayurlDash>;
    private intl(aid: number, cid: number, dash = true) {
        return new ApiPlayurlIntl({ aid, cid, access_key: this.BLOD.status.accessKey.token }, this.BLOD.GM.fetch, dash, this.BLOD.pgc).getData();
    }
    private interface(cid: number, quality = qn) {
        return new ApiPlayurlInterface({ cid, quality }, this.BLOD.pgc).getData();
    }
    image() {
        const src: string[] = [];
        this.BLOD.videoInfo.metadata?.artwork?.forEach(d => src.push(d.src));
        if (location.host === 'live.bilibili.com' && (<any>window).__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover) {
            // 直播封面
            src.push((<any>window).__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.room_info?.cover);
        }
        if (src.length) {
            const popup = new PopupBox();
            popup.fork = false;
            popup.setAttribute('style', 'display: flex;flex-direction: row;align-items: flex-start;;max-width: 100vw;');
            popup.innerHTML = src.map(d => `<img src="${d}" width=300>`).join('');
        } else {
            this.BLOD.toast.warning('未找到封面信息！')
        }
    }
}