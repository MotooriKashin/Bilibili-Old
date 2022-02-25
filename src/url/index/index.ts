interface modules {
    /** 重写首页 */
    readonly "index.js": string;
    readonly "index.html": string;
}
namespace API {
    class Index extends Rewrite {
        constructor(html: keyof modules) {
            super(html);
            this.script = [
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.min.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/cm/st/bundle.js",
                    crossorigin: ""
                },
                {
                    type: "text/javascript",
                    defer: "defer",
                    charset: "utf-8",
                    src: "//static.hdslb.com/common/js/footer.js"
                }
            ];
            path.name = "index"; // 重写标记
            this.getIniState();
            this.onload = () => { this.afterFlush() }
        }
        async getIniState() {
            const data = (await xhr({ // 推荐数据
                url: "https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,34,31",
                responseType: "json"
            })).data;
            let result = { locsData: { 23: data[4694], 34: data[34], 31: data[31] } };
            config.indexLoc && this.reAD(result); // 广告
            (<any>window).__INITIAL_STATE__ = result; // 写入__INITIAL_STATE__
            importModule("indexSort.js");
            this.flushDocument();
        }
        reAD(data: any) {
            for (let key in data.locsData) {
                if (Array.isArray(data.locsData[key])) {
                    data.locsData[key] = data.locsData[key].filter((d: any) => {
                        return d.is_ad ? (debug.debug("移除广告", key, d), false) : true;
                    })
                }
            }
        }
        afterFlush() {
            // 移除无效节点
            runWhile(() => document.querySelector(".ver"), () => document.querySelector(".ver")?.remove());
            runWhile(() => document.querySelector("#fixed_app_download"), () => document.querySelector("#fixed_app_download")?.remove());
            // 修复失效分区
            addCss(".bili-tab.rank-tab, .bili-dropdown.rank-dropdown { pointer-events: none; }");
        }
    }
    new Index("index.html");
}
