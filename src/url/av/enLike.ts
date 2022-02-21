interface modules {
    /**
     * 旧版页面添加点赞功能
     */
    readonly "enLike.js": string;
    readonly "vanfont.css": string;
}
{
    class Like {
        aid: number;
        coin: HTMLElement;
        span: HTMLSpanElement;
        liked = false;
        number = API.like || 0;
        constructor() {
            API.runWhile(() => {
                this.coin = API.path.name == "watchlater" ? document.querySelector(".u.coin") : document.querySelector("[report-id*=coin]");
                return this.coin && API.aid;
            }, () => this.init())
        }
        init() {
            API.addCss(API.getModule("vanfont.css"), "vanfont");
            this.style();
            this.aid = API.aid;
            this.span = document.createElement("span");
            this.span.classList.add("ulike");
            this.coin.parentElement.insertBefore(this.span, this.coin);
            this.changeLiked();
            this.span.addEventListener("click", () => this.setLike());
            API.switchVideo(() => this.switch());
            try {
                !this.number && xhr({
                    url: `https://api.bilibili.com/x/web-interface/view?aid=${API.aid}`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    this.number = API.jsonCheck(d).data.stat.like;
                    this.changeLiked();
                })
                API.uid && xhr({
                    url: `https://api.bilibili.com/x/web-interface/archive/has/like?aid=${API.aid}`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    d = API.jsonCheck(d).data;
                    d === 1 && (this.liked = true, this.changeLiked());
                })
            } catch (e) { toast.error("点赞出错！", e) }
        }
        style() {
            let style = `.ulike {cursor: pointer;}.van-icon-videodetails_like{font-size: 25px;vertical-align: middle;margin-right: 6px;transform: translateY(-1px);}`;
            switch (API.path.name) {
                case "bangumi": style += `.ulike {position: relative;min-width: 110px;float: left;height: 100%;line-height: 18px;font-size: 12px;color: #222;transform: translateY(-2px);}`;
                    style += `.van-icon-videodetails_like{margin-left: 25px;}`;
                    break;
                case "watchlater": style += `.video-info-module .number .ulike {margin-right: 5px;}`;
                    break;
                default: style += `.video-info-m .number .ulike {margin-right: 5px;}`;
            }
            API.addCss(style);
        }
        setLike() {
            if (API.uid) {
                const like = this.liked ? 2 : 1;
                xhr({
                    url: "https://api.bilibili.com/x/web-interface/archive/like",
                    method: "POST",
                    data: `aid=${API.aid}&like=${like}&csrf=${API.getCookies().bili_jct}`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    API.jsonCheck(d).ttl;
                    this.liked = !this.liked;
                    this.number = this.liked ? this.number + 1 : this.number - 1;
                    this.changeLiked();
                })
            }
            else API.biliQuickLogin();
        }
        changeLiked() {
            this.span.innerHTML = `<i class="van-icon-videodetails_like" style="color: ${this.liked ? "#f36392;" : "#ffffff;text-shadow: 0px -1px #f36392, 0px 1px #f36392, -1px 0px #f36392, 1px 0px #f36392;"}" ></i>点赞 ${Format.unitFormat(this.number) || "--"}`;
        }
        switch() {
            if (this.aid != API.aid) {
                this.aid = API.aid;
                xhr({
                    url: `https://api.bilibili.com/x/web-interface/view?aid=${API.aid}`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    this.number = API.jsonCheck(d).data.stat.like;
                    this.changeLiked();
                })
            }
        }
    }
    new Like();
}
declare namespace API {
    /**
     * 点赞数
     */
    let like: number;
}