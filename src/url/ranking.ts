interface modules {
    /** 重写排行榜 */
    readonly "ranking.js": string;
    readonly "ranking.html": string;
}
namespace API {
    class Ranking extends Rewrite {
        refer = document.referrer.split("/");
        obj = { rid: "0", day: "3", type: "1", arc_type: "0" };
        constructor(html: keyof modules) {
            super(html);
            this.script = [
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/cm/st/bundle.js",
                    crossorigin: ""
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/common/js/footer.js",
                    defer: "defer"
                }
            ];
            path.name = "ranking"; // 重写标记
            this.getIniState();
        }
        async getIniState() {
            const json = await xhr({ // 排行榜数据
                url: Format.objUrl("https://api.bilibili.com/x/web-interface/ranking", this.obj),
                responseType: "json",
                credentials: true
            })
            const data = jsonCheck(json);
            const result: any = { loading: false, rankRouteParams: { arc_type: 0, day: 3, rankTab: "all", rid: Number(this.refer[5]) || 0, season_type: 1 }, showTypes: true, times: [{ name: "日排行", value: 1 }, { name: "三日排行", value: 3 }, { name: "周排行", value: 7 }, { name: "月排行", value: 30 }], typeList: [{ name: "全部投稿", value: 0 }, { name: "近期投稿", value: 1 }] };
            result.channels = [{ name: "全站", tid: 0 }, { name: "动画", tid: 1 }, { name: "国创相关", tid: 168 }, { name: "音乐", tid: 3 }, { name: "舞蹈", tid: 129 }, { name: "游戏", tid: 4 }, { name: "知识", tid: 36 }, { name: "数码", tid: 188 }, { name: "生活", tid: 160 }, { name: "美食", tid: 211 }, { name: "鬼畜", tid: 119 }, { name: "时尚", tid: 155 }, { name: "娱乐", tid: 5 }, { name: "影视", tid: 181 }];
            result.rankList = data.data.list;
            result.note = data.data.note;
            (<any>window).__INITIAL_STATE__ = result; // 写入__INITIAL_STATE__
            this.flushDocument();
            addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}"); // 高分辨率屏修补
        }
    }
    new Ranking("ranking.html");
}