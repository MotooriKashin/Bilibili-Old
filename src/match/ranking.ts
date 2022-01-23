/**
 * 本模块负责重写全站排行榜页面
 */
(function () {
    try {
        class Ranking {
            refer = document.referrer.split("/");
            obj = { rid: "0", day: "3", type: "1", arc_type: "0" };
            constructor() {
                API.path.name = "ranking";
                (this.refer && this.refer[4] && this.refer[4] == "all") && Reflect.set(this.obj, "rid", this.refer[5]);
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            prepareA() {
                (<Promise<JSON>>xhr({
                    url: API.objUrl("https://api.bilibili.com/x/web-interface/ranking", this.obj),
                    responseType: "json",
                    credentials: true
                })).then(d => { this.write(d) })
            }
            prepareB() {
                let data = xhr({
                    url: API.objUrl("https://api.bilibili.com/x/web-interface/ranking", this.obj),
                    async: false,
                    credentials: true
                })
                this.write(data)
            }
            write(d: any) {
                const data = API.jsonCheck(d);
                const result: any = { loading: false, rankRouteParams: { arc_type: 0, day: 3, rankTab: "all", rid: Number(this.refer[5]) || 0, season_type: 1 }, showTypes: true, times: [{ name: "日排行", value: 1 }, { name: "三日排行", value: 3 }, { name: "周排行", value: 7 }, { name: "月排行", value: 30 }], typeList: [{ name: "全部投稿", value: 0 }, { name: "近期投稿", value: 1 }] };
                result.channels = [{ name: "全站", tid: 0 }, { name: "动画", tid: 1 }, { name: "国创相关", tid: 168 }, { name: "音乐", tid: 3 }, { name: "舞蹈", tid: 129 }, { name: "游戏", tid: 4 }, { name: "知识", tid: 36 }, { name: "数码", tid: 188 }, { name: "生活", tid: 160 }, { name: "美食", tid: 211 }, { name: "鬼畜", tid: 119 }, { name: "时尚", tid: 155 }, { name: "娱乐", tid: 5 }, { name: "影视", tid: 181 }];
                result.rankList = data.data.list;
                result.note = data.data.note;
                (<any>window).__INITIAL_STATE__ = result;
                API.rewriteHTML(API.getModule("ranking.html"));
                API.addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
                API.addCss('.bili-dropdown.rank-dropdown, li[type="origin"], li[type="rookie"] { pointer-events: none; }');
            }
        }
        new Ranking();
    } catch (e) { toast.error("ranking.js", e) }
})();