interface modules {
    /**
     * 重构playlist页面
     */
    readonly "medialist.js": string;
    readonly "playlist.html": string;
}
class Playlist extends API.rewrite {
    pl = /\d+/.exec(API.path[5]) && Number(/\d+/.exec(API.path[5])[0]);
    constructor(html: keyof modules) {
        super(html);
        history.replaceState(null, null, "https://www.bilibili.com/playlist/video/pl769");
        this.script = [
            {
                type: "text/javascript",
                src: "//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/js/jquery.qrcode.min.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/common/js/footer.js"
            },
            {
                type: "text/javascript",
                charset: "utf-8",
                src: "//static.hdslb.com/common/js/footer.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/js/swfobject.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/mstation/js/upload/moxie.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/mstation/js/upload/plupload.js"
            },
            {
                type: "text/javascript",
                src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
            },
            {
                type: "text/javascript",
                src: "//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"
            },
            {
                type: "text/javascript",
                src: "//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"
            }
        ];
        API.jsonphook(["toview"], josnp => {
            const obj = Format.urlObj(josnp.src);
            const callback: any = obj.callback;
            josnp.removeAttribute("src");
            if (this.pl === 769 || this.pl === 182603655) {
                xhr({
                    url: "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/Json/pl769.json",
                    responseType: "json"
                }).then(d => {
                    (<any>window)[callback](d);
                    josnp.dispatchEvent(new ProgressEvent("load"));
                })
            }
        })
        this.flushDocument();
    }
}
new Playlist("playlist.html");
