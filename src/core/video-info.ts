import { BLOD } from "../bilibili-old";
import { IAidDatail, IAidInfo, IStat } from "../io/api";
import { IBangumiEpisode, IBangumiSeasonResponse } from "../io/bangumi-season";
import toview from '../json/toview.json';


interface MediaImage {
    sizes?: string;
    src: string;
    type?: string;
}
interface ICid {
    album: string;
    artist: string;
    title: string;
    artwork: MediaImage[];
}
export class VideoInfo {
    private cids: Record<number, ICid> = {};
    private stats: Record<number, IStat> = {};
    get metadata() {
        const cid = this.BLOD.cid;
        return cid ? this.cids[cid] : undefined
    }
    get album() {
        return this.metadata?.album || this.title;
    }
    get artist() {
        return this.metadata?.artist;
    }
    get title() {
        return this.metadata?.title || document.title.slice(0, -26);
    }
    get artwork() {
        return this.metadata?.artwork;
    }
    get stat() {
        const aid = this.BLOD.aid;
        return aid ? this.stats[aid] : undefined;
    }
    constructor(private BLOD: BLOD) { }
    /** 数据变动回调栈 */
    private callbacks: ((value: VideoInfo) => void)[] = [];
    /**
     * 数据变动回调
     * @param callback 数据变动时执行的回调函数
     * @returns 撤销监听的函数
     */
    bindChange(callback: (value: VideoInfo) => void) {
        const id = this.callbacks.push(callback);
        return () => {
            delete this.callbacks[id - 1];
        }
    }
    private timer?: number;
    /** 推送数据变动 */
    private emitChange() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.callbacks.forEach(d => d(this)), 100);
    }
    /** 从`IAidDatail`中提取 */
    aidDatail(data: IAidDatail) {
        const album = data.title;
        const artist = data.owner.name;
        const pic = data.pic;
        data.pages ? data.pages.forEach((d, i) => {
            this.cids[d.cid] = {
                album,
                artist,
                title: d.part || `#${i + 1}`,
                artwork: [{ src: pic }]
            }
        }) : this.cids[data.cid] = {
            album,
            artist,
            title: `#1`,
            artwork: [{ src: pic }]
        };
        this.stats[data.aid] = data.stat;
        this.emitChange();
    }
    /** 从`IAidInfo`中提取 */
    aidInfo(data: IAidInfo) {
        const album = data.title;
        const artist = data.upper.name;
        const pic = data.cover;
        data.pages ? data.pages.forEach((d, i) => {
            this.cids[d.id] = {
                album,
                artist,
                title: d.title || `#${i + 1}`,
                artwork: [{ src: pic }]
            }
        }) : this.cids[data.id] = {
            album,
            artist,
            title: `#1`,
            artwork: [{ src: pic }]
        };
    }
    /** 从`IBangumiSeasonResponse`中提取 */
    bangumiSeason(data: IBangumiSeasonResponse) {
        const album = data.title || data.jp_title;
        const artist = data.actors || data.staff || data.up_info?.name!;
        const pic = data.cover;
        const bkg_cover = data.bkg_cover;
        this.bangumiEpisode(data.episodes, album, artist, pic, bkg_cover);
        this.emitChange();
    }
    /** 从`IBangumiEpisode`中提取 */
    bangumiEpisode(data: IBangumiEpisode[], album: string, artist: string, pic: string, bkg_cover?: string) {
        data.forEach(d => {
            const artwork = [{ src: d.cover }, { src: pic }];
            bkg_cover && artwork.push({ src: bkg_cover });
            this.cids[d.cid] = {
                album,
                artist,
                title: d.index_title,
                artwork
            }
        })
    }
    toview(data: typeof toview) {
        const album = data.name;
        const pic = data.cover;
        data.list.forEach(d => {
            const title = d.title;
            const cover = d.pic;
            const artist = d.owner.name;
            d.pages.forEach((d, i) => {
                this.cids[d.cid] = {
                    album,
                    artist,
                    title: title + `(${d.part})`,
                    artwork: [{ src: pic }, { src: cover }]
                }
            })
        });
        this.emitChange();
    }
    /** 设置浏览器媒体信息 */
    mediaSession() {
        if (this.metadata) {
            navigator.mediaSession.metadata = new MediaMetadata({ ...this.metadata });
        }
    }
}