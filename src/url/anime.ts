interface modules {
    /**
     * 番剧分区首页
     */
    readonly "anime.js": string;
    readonly "anime.html": string;
}
class Anime extends API.rewrite {
    constructor(html: keyof modules) {
        super(html);
        this.script = [
            {
                type: "text/javascript",
                src: "//static.hdslb.com/js/jquery.min.js"
            },
            {
                type: "text/javascript",
                src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
            },
            {
                type: "text/javascript",
                src: "//s2.hdslb.com/bfs/cm/st/bundle.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/js/promise.auto.min.js"
            },
            {
                type: "text/javascript",
                src: "//www.bilibili.com/gentleman/polyfill.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"
            },
            {
                type: "text/javascript",
                src: "//s1.hdslb.com/bfs/static/ogv/fe/iris.min.js"
            },
            {
                src: "//s1.hdslb.com/bfs/static/bangumi-home/1.bangumi-home.73141fb5868615cb4fe6bc969ccd02cb7c1c7d4c.js",
                crossorigin: "",
                defer: "defer"
            },
            {
                src: "//s1.hdslb.com/bfs/static/bangumi-home/bangumi-home.73141fb5868615cb4fe6bc969ccd02cb7c1c7d4c.js",
                crossorigin: "",
                defer: "defer"
            },
            {
                type: "text/javascript",
                charset: "utf-8",
                src: "//static.hdslb.com/common/js/footer.js"
            }
        ];
        API.path.name = "anime";
        this.flushDocument();
    }
}
new Anime("anime.html");