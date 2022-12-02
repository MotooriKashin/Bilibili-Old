import { sizeFormat } from "../../utils/format/size";
import { toObject } from "../../utils/type";
import { IDownloadCell, IDownloadColor, IDownlodData } from "../ui/download";

export interface IDownlodDataFilter extends IDownlodData {
    type: IDownloadCell;
    flv?: number;
}
export class PlayinfoFilter {
    /** 数据 */
    private record: IDownlodDataFilter[] = [];
    /** id => 质量 */
    quality = {
        100032: "8K",
        100029: '4K',
        100028: '1080P60',
        100027: '1080P+',
        100026: '1080P',
        100024: '720P',
        100023: '480P',
        100022: '360P',
        30280: "320Kbps",
        30260: "320Kbps",
        30259: "128Kbps",
        30257: "64Kbps",
        30255: "AUDIO",
        30251: "FLAC",
        30250: "ATMOS",
        30232: "128Kbps",
        30216: "64Kbps",
        30127: "8K",
        30126: "Dolby",
        30125: "HDR",
        30121: "4K",
        30120: "4K",
        30116: '1080P60',
        30112: '1080P+',
        30106: '1080P60',
        30102: '1080P+',
        30080: '1080P',
        30077: '1080P',
        30076: '720P',
        30074: '720P',
        30066: '720P',
        30064: '720P',
        30048: "720P",
        30033: '480P',
        30032: '480P',
        30016: '360P',
        30015: '360P',
        30011: '360P',
        464: '预览',
        336: "1080P",
        320: "720P",
        288: "480P",
        272: "360P",
        208: "1080P",
        192: "720P",
        160: "480P",
        127: "8K",
        126: "Dolby",
        125: "HDR",
        120: "4K",
        116: "1080P60",
        112: "1080P+",
        80: "1080P",
        74: "720P60",
        64: "720P",
        48: "720P",
        32: "480P",
        16: "360P",
        15: "360P",
        6: "240P",
        5: "144P"
    };
    /** id => 类型（备用方案） */
    codec = {
        hev: [30127, 30126, 30125, 30121, 30106, 30102, 30077, 30066, 30033, 30011],
        avc: [30120, 30112, 30080, 30064, 30032, 30016],
        av1: [100029, 100028, 100027, 100026, 100024, 100023, 100022]
    }
    /** 颜色表 */
    color: Record<string, IDownloadColor> = {
        "8K": "yellow",
        "Dolby": "pink",
        "FLAC": "pink",
        "ATMOS": "pink",
        "AUDIO": "pink",
        "HDR": "purple",
        "4K": "purple",
        "1080P60": "red",
        "1080P+": "red",
        "1080P": "red",
        "720P60": "orange",
        "720P": "orange",
        "480P": "blue",
        "360P": "green",
        "320Kbps": "red",
        "128Kbps": "blue",
        "64Kbps": "green"
    }
    constructor(private fileName?: string) { }
    /**
     * 解码playurl的下载数据
     * @param playinfo playurl返回值(json)
     */
    filter(playinfo: Partial<Record<"data" | "result" | "durl" | "dash", any>>) {
        typeof playinfo === 'string' && (playinfo = toObject(playinfo));
        if (playinfo) {
            playinfo.data && this.filter(playinfo.data); // data型
            playinfo.result && this.filter(playinfo.result); // result型
            playinfo.durl && this.durl(playinfo.durl); // 顶层durl型
            playinfo.dash && this.dash(playinfo.dash); // 顶层dash型
        }
        return this.record;
    }
    /**
     * 整理durl部分
     * @param durl durl信息
     */
    durl(durl: any[]) {
        let index = 0; // flv分段标记
        durl.forEach(d => {
            const url: any[] = d.backupUrl || d.backup_url || [];
            url.unshift(d.url);
            const qua = <keyof typeof this.color>this.getQuality(url[0], d.id);
            const link: IDownlodDataFilter = {
                type: '',
                url,
                quality: qua,
                size: sizeFormat(d.size),
                color: this.color[qua] || ""
            }
            switch (d.url.includes("mp4?")) {
                case true: link.type = "mp4";
                    break;
                case false: link.type = "flv"; index++; link.flv = index;
                    break;
            }
            this.fileName && (link.fileName = `${this.fileName}${qua}.${link.type}`);
            this.record.push(link);
        })
    }
    /**
     * 整理dash部分
     * @param dash dash信息
     */
    dash(dash: any) {
        dash.video && this.dashVideo(dash.video, dash.duration); // dash视频部分
        dash.audio && this.dashAudio(dash.audio, dash.duration); // dash音频部分
        dash.dolby && dash.dolby.audio && Array.isArray(dash.dolby.audio) && this.dashAudio(dash.dolby.audio, dash.duration); // 杜比音效部分
        dash.flac && dash.flac.audio && this.dashAudio([dash.flac.audio], dash.duration, ".flac") // 无损音频部分
    }
    /**
     * 整理dash视频部分
     * @param video dash视频信息
     * @param duration duration信息，配合bandwidth能计算出文件大小
     */
    dashVideo(video: any[], duration: number) {
        video.forEach(d => {
            const url: any[] = d.backupUrl || d.backup_url || [];
            (d.baseUrl || d.base_url) && url.unshift(d.baseUrl || d.base_url);
            if (!url.length) return;
            let type = "";
            if (d.codecs) {
                // 编码类型
                type = d.codecs.includes("avc") ? "avc" : d.codecs.includes("av01") ? "av1" : "hev";
            } else {
                const id = this.getID(url[0]);
                type = this.codec.hev.find(d => d === id) ? "hev" : "avc";
            }
            const qua = <keyof typeof this.color>this.getQuality(url[0], d.id);
            this.record.push({
                type: <''>type,
                url: url,
                quality: qua,
                size: sizeFormat(d.bandwidth * duration / 8),
                color: this.color[qua] || "",
                fileName: `${this.fileName}${qua}.m4v`
            })
        })
    }
    /**
     * 整理dash音频部分
     * @param audio dash音频信息
     * @param duration duration信息，配合bandwidth能计算出文件大小
     * @param fmt 音频拓展名，默认`.m4a`
     */
    dashAudio(audio: any[], duration: number, fmt = ".m4a") {
        audio.forEach(d => {
            const url: any[] = d.backupUrl || d.backup_url || [];
            (d.baseUrl || d.base_url) && url.unshift(d.baseUrl || d.base_url);
            const qua = <keyof typeof this.color>this.getQuality(url[0], d.id);
            url.length && this.record.push({
                type: "aac",
                url: url,
                quality: qua,
                size: sizeFormat(d.bandwidth * duration / 8),
                color: this.color[qua] || "",
                fileName: `${this.fileName}${qua}.${fmt}`
            })
        })
    }
    /**
     * 根据url确定画质/音质信息  
     * 需要维护quality表
     * @param url 多媒体url
     * @param id 媒体流id
     * @returns 画质/音质信息
     */
    getQuality(url: string, id?: number) {
        return this.quality[<keyof typeof this.quality>this.getID(url)] || (id && this.quality[<keyof typeof this.quality>id]) || "N/A";
    }
    /**
     * 从url中提取可能的id
     * @param url 多媒体url
     */
    getID(url: string) {
        let id = 0;
        url.replace(/\d+\.((flv)|(mp4)|(m4s))/, d => id = <any>Number(d.split(".")[0]));
        return id;
    }
}