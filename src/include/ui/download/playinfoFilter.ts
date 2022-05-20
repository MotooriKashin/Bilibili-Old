namespace API {
    /** 下载数据配置 */
    export type DownloadDate = Record<string, {
        /** 上标，一般为数据说明 */
        up: string,
        /** 下标，一般为文件大小 */
        down: string,
        /** 上标底色，方便区分 */
        color?: DownloadUpColer,
        /** 超链接，被动下载 */
        href?: string,
        /** 点击回调，主动下载 */
        onclick?: () => void,
        /** 文件名 */
        fileName?: string;
    }[]>;
    type DownloadRecord = {
        /** 类型 */
        type: string;
        /** 链接 */
        url: string[];
        /** 质量 */
        quality: string;
        /** 大小 */
        size: string;
        /** flv专属，分片序号 */
        flv?: number;
        /** 上标颜色 */
        color?: DownloadUpColer;
        /** 文件名 */
        fileName?: string;
    }
    class PlayinfoFiter {
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
            15: "360P"
        };
        /** id => 类型（备用方案） */
        codec = {
            hev: [30127, 30126, 30125, 30121, 30106, 30102, 30077, 30066, 30033, 30011],
            avc: [30120, 30112, 30080, 30064, 30032, 30016],
            av1: [100029, 100028, 100027, 100026, 100024, 100023, 100022]
        }
        /** 颜色表 */
        color: Record<string, DownloadUpColer> = {
            "8K": "yellow",
            "Dolby": "pink",
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
        record: DownloadRecord[] = [];
        /** 文件名 */
        fileName?: string;
        constructor(fileName?: string) {
            this.fileName = fileName;
        }
        /**
         * 解码playurl的下载数据
         * @param playinfo playurl返回值(json)
         */
        filter(playinfo: Record<"data" | "result" | "durl" | "dash", any>) {
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
                const link: DownloadRecord = {
                    type: "",
                    url: url,
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
                    type: type,
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
         */
        dashAudio(audio: any[], duration: number) {
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
                    fileName: `${this.fileName}${qua}.m4a`
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
    /**
     * 解码playurl的下载数据
     * @param playinfo playurl返回值(json)
     * @param prev 其他已解码的数据，用于合并
     * @param fileName 文件名
     */
    export function playinfoFiter(playinfo: Record<"data" | "result" | "durl" | "dash", any>, prev: DownloadDate = {}, fileName: string = title) {
        return new PlayinfoFiter(fileName).filter(playinfo).reduce((s, d) => {
            s[d.type] || (s[d.type] = []);
            const obj: DownloadDate[keyof DownloadDate][0] = {
                up: Reflect.has(d, "flv") ? `${d.quality}*${d.flv}` : d.quality,
                down: d.size,
                href: subArray(d.url),
                color: d.color
            }
            if (config.downloadMethod !== "默认") {
                delete obj.href;
                obj.onclick = () => {
                    postData(d);
                }
            }
            s[d.type].push(obj);
            return s;
        }, prev);
    }
    /**
     * 发送下载数据
     * @param data 下载数据
     */
    function postData(data: DownloadRecord) {
        switch (config.downloadMethod) {
            case "IDM+ef2": ef2.sendLinkToIDM({ url: data.url[0], out: data.fileName });
                break;
            case "aria2": aria2.shell({ urls: data.url, out: data.fileName })
                .then(() => toast.success(`已复制aria2命令行到剪切板，在cmd等shell中使用即可下载~`))
                .catch(e => {
                    toast.error(`复制aria2命令行失败！`);
                    debug.error(`复制aria2命令行失败！`, e);
                });
                break;
            case "aria2+rpc": aria2.rpc({ urls: data.url, out: data.fileName })
                .then(GID => toast.success(`已添加下载任务到aria2 RPC主机，任务GID：${GID}`))
                .catch(e => {
                    toast.error(`添加下载任务到aria2 RPC主机出错！`);
                    debug.error(`添加下载任务到aria2 RPC主机出错！`, e);
                });
                break;
        }
    }
}