interface modules {
    /** 重构搜索页面 */
    readonly "search.js": string;
    readonly "search.html": string;
}
namespace API {
    class Search extends Rewrite {
        /** url参数 */
        obj = Format.urlObj(location.href)
        constructor(html: keyof modules) {
            super(html);
            Reflect.has(this.obj, "keyword") && (document.title = `${decodeURIComponent(<string>this.obj.keyword)} _ 搜索结果_哔哩哔哩_Bilibili`);
            this.script = [
                {
                    type: "text/javascript",
                    src: "//www.bilibili.com/gentleman/polyfill.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/long/js/sentry/sentry-5.7.1.vue.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/search/1.search.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.js",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/search/search.1dc4c70682c12d4daaa90c2114effa0a7cbca11a.js",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    charset: "utf-8",
                    src: "//static.hdslb.com/common/js/footer.js"
                }
            ];
            this.flushDocument();
        }
    }
    new Search("search.html");
}