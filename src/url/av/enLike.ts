interface modules {
    /**
     * 旧版页面添加点赞功能
     */
    readonly "enLike.js": string;
}
{
    class Like {
        aid: number;
        coin: HTMLElement;
        span: HTMLSpanElement;
        liked = false;
        number = API.like || 0;
        svgLike = `<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1{fill:#f36392;}</style></defs><g><path class="cls-1" d="M10.28,32.77h2.5V13.19h-2.5ZM25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86H5.56a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h6.25l6.8-8.49A3.83,3.83,0,0,1,25.25,5Zm10.14,2.51H22.22l.28-2.92L22.92,5a1.26,1.26,0,0,0-.18-1,1.28,1.28,0,0,0-.82-.56,1.11,1.11,0,0,0-1.25.42l-6.36,8.2-.83,1.11H5.14a2,2,0,0,0-.83.28,2.28,2.28,0,0,0-1.25,2.08V30.41a2,2,0,0,0,.42,1.25,2,2,0,0,0,2.08,1.11H28.89a2.38,2.38,0,0,0,1.39-.41,3.61,3.61,0,0,0,2.08-2.78L36.8,15l2.5.56L36.8,15a2.45,2.45,0,0,0-.14-1.39,2.89,2.89,0,0,0-1.52-.54l.28-2.5Z" transform="translate(-0.56 -0.82)"/></g></svg>`;
        svgEnLike = `<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1{fill:#f36392;}</style></defs><g><path class="cls-1" d="M12.06,35.27V10.43h-.15l6.7-8.37A3.83,3.83,0,0,1,25.25,5L25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86Zm-2.5,0h-4a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h4Z" transform="translate(-0.56 -0.82)"/></g></svg>`;
        constructor() {
            API.runWhile(() => {
                this.coin = API.path.name == "watchlater" ? document.querySelector(".u.coin") : document.querySelector("[report-id*=coin]");
                return this.coin && API.aid;
            }, () => this.init())
        }
        init() {
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
            let style = `.ulike {cursor: pointer;}.ulike svg{vertical-align: middle;margin-right: 10px;}`;
            switch (API.path.name) {
                case "bangumi": style += `.ulike {margin-left: 15px;position: relative;float: left;height: 100%;line-height: 18px;font-size: 12px;color: #222;}`;
                    break;
                case "watchlater": style += `.video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}`;
                    break;
                default: style += `.video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}`;
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
            this.span.innerHTML = `${this.liked ? this.svgEnLike : this.svgLike}</i>点赞 ${Format.unitFormat(this.number) || "--"}`;
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