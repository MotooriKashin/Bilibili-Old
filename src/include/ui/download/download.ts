namespace API {
    /** 下载记录 */
    interface DownloadRecord {
        /** 链接类型 */
        url: {
            /** 分组名称 */
            group: string;
            /** 下载链接 */
            url: string;
            /** 上标：一般为名字 */
            up: string;
            /** 下标：一般为大小 */
            down: string;
            /** 上标颜色 */
            color?: DownloadUpColer;
            /** 文件名 */
            fileName?: string;
        };
        /** 非链接类型 */
        Blob: {
            /** 分组名称 */
            group: string;
            /** 下载数据，文本或json */
            data: any;
            /** 上标：一般为名字 */
            up: string;
            /** 下标：一般为大小 */
            down: string;
            /** 上标颜色 */
            color?: DownloadUpColer;
            /** 文件名 */
            fileName?: string;
            /** 点击回调，不使用默认下载，由本回调函数接管点击事件 */
            callback?: () => void
        }
    }
    /** 下载数据栈 */
    const Record: DownloadDate = {};
    let downloading = false;
    // 切P清栈
    switchVideo(() => Object.keys(Record).forEach(d => delete Record[d]));
    /**
     * 添加数据到下载面板
     * @param obj 数据配置
     */
    export function pushDownload<T extends keyof DownloadRecord>(obj: DownloadRecord[T]) {
        Reflect.has(Record, obj.group) || (Record[obj.group] = []);
        const data: {
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
        } = { up: obj.up, down: obj.down };
        obj.color && (data.color = obj.color);
        obj.fileName && (data.fileName = obj.fileName);
        if ((<DownloadRecord["url"]>obj).url) {
            data.href = (<DownloadRecord["url"]>obj).url;
        } else {
            data.onclick = () => {
                if ((<DownloadRecord["Blob"]>obj).callback) {
                    return (<any>obj).callback();
                }
                isObject((<DownloadRecord["Blob"]>obj).data)
                    ? saveAs(JSON.stringify((<DownloadRecord["Blob"]>obj).data), obj.fileName || "")
                    : saveAs((<DownloadRecord["Blob"]>obj).data, obj.fileName || "")
            }
        }
        Record[obj.group].push(data);
    }
    /**
     * 合并下载数据
     * @param target 原下载数据
     * @param source 新增下载数据
     */
    function contactDownloadDate(target: DownloadDate, source: DownloadDate) {
        Object.entries(source).forEach(d => {
            Reflect.has(target, d[0]) || (target[d[0]] = []);
            target[d[0]] = target[d[0]].concat(d[1]);
        });
    }
    /** 封面等下载 */
    function getCover() {
        if (!config.downloadOther) return;
        cover && pushDownload({
            group: "封面",
            url: cover,
            up: "封面",
            down: "N/A",
            fileName: `${title || `av${aid}`}.${cover.split(".").reduce((s, d) => s = d, <any>undefined) || "jpg"}`
        });
        bkg_cover && pushDownload({
            group: "封面",
            url: bkg_cover,
            up: "封面",
            down: "N/A",
            fileName: `${title || `av${aid}`}.${bkg_cover.split(".").reduce((s, d) => s = d, <any>undefined) || "jpg"}`
        });
    }
    /** 默认下载 */
    export async function downloadDefault() {
        if (downloading) return;
        downloading = true;
        if (!cid) return toast.warning("请在视频页使用本功能~");
        const data = playinfoFiter(__playinfo__);
        const request: Promise<any>[] = [];
        const type = config.downlaodType.join(" ").toLowerCase();
        downloadUI.obj.data = data;
        downloadUI.show();
        (/mp4/g.test(type) && request.push(getContent("mp4")));
        data.flv || (/flv/g.test(type) && request.push(getContent("flv")));
        data.aac || (/dash/g.test(type) && request.push(getContent("dash")));
        (await Promise.all(request)).forEach(d => {
            playinfoFiter(d, downloadUI.obj.data);
        });
        getCover();
        contactDownloadDate(downloadUI.obj.data, Record);
        downloading = false;
    }
    /** 其他下载，下载视频外的数据 */
    export function downloadOther() {
        if (downloading) return;
        downloading = true;
        downloadUI.obj.data = Record;
        downloadUI.show();
        downloading = false;
    }
    /**
     * 封装请求链接
     * 用于过滤Promise.all请求错误
     * @param d 请求类型
     * @returns 请求结果
     */
    async function getContent(d: "dash" | "flv" | "mp4") {
        d = <"dash" | "flv" | "mp4">d.toLowerCase();
        let result: any;
        try {
            switch (d) {
                case "dash": result = pgc ?
                    await url.getJson(config.TVresource ? "api.bilibili.com/pgc/player/api/playurltv" : "api.bilibili.com/pgc/player/web/playurl", { avid: aid, cid: cid, fnver: 0, fnval: fnval }, true) :
                    await url.getJson(config.TVresource ? "api.bilibili.com/x/tv/ugc/playurl" : "api.bilibili.com/x/player/playurl", { avid: aid, cid: cid, fnver: 0, fnval: fnval }, true);
                    break;
                case "flv": result = pgc ?
                    await url.getJson(config.TVresource ? "api.bilibili.com/pgc/player/api/playurltv" : "api.bilibili.com/pgc/player/web/playurl", { avid: aid, cid: cid, qn: config.downloadQn }, true) :
                    await url.getJson(config.TVresource ? "api.bilibili.com/x/tv/ugc/playurl" : "api.bilibili.com/x/player/playurl", { avid: aid, cid: cid, qn: config.downloadQn }, true);
                    break;
                case "mp4": result = pgc ?
                    await url.getJson("api.bilibili.com/pgc/player/api/playurlproj", { cid: cid }, true) :
                    await url.getJson("app.bilibili.com/v2/playurlproj", { cid: cid }, true);
                    break;
            }
        } catch (e) { }
        return result;
    }
}