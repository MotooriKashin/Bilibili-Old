/**
 * 本模块负责重写旧版嵌入播放器
 */
(function () {
    try {
        class Player {
            obj = API.urlObj(location.href);
            aid = this.obj.aid || this.obj.avid;
            bvid = this.obj.bvid;
            cid = this.obj.cid;
            constructor() {
                API.path.name = "player";
                if (!Number(this.aid)) {
                    if (this.obj.aid) this.aid = <string>API.abv(this.aid);
                    else if (this.bvid) this.aid = this.bvid;
                    else this.check();
                }
                else this.write();
            }
            async check() {
                const obj = await API.urlInputCheck(location.href);
                if (!obj.aid) return toast.error("未能获取到外链视频的aid，已禁用重写操作~");
                (<any>window).aid = obj.aid; (<any>window).cid = obj.cid;
                history.replaceState(null, "", API.objUrl(location.href, { avid: obj.aid, cid: obj.cid }));
                this.write();
            }
            write() {
                Reflect.set(window, "aid", this.aid);
                this.cid && Reflect.set(window, "cid", this.cid);
                API.restorePlayerSetting(); // 备份还原旧版播放器设置数据
                API.rewriteHTML(API.getModule("player.html"));
                window.parent = window; // 重定向父索引回本身以禁止向父索引暴露播放器接口，该接口可能被新版页面乱用
                window.addEventListener('message', e => {
                    if (e.data.aid) {
                        (<any>window).__playinfo__ = undefined;
                        e.data.as_wide = 1;
                        e.data.dashSymbol = true;
                        e.data.p = 1;
                        e.data.pre_ad = "";
                        history.replaceState(undefined, undefined, API.objUrl("https://www.bilibili.com/blackboard/html5player.html", { aid: e.data.aid, cid: e.data.cid }));
                        window.player.destroy();
                        window.player = new (<any>window).BilibiliPlayer(e.data);
                        navigator.mediaSession.setActionHandler("play", window.player.play);
                        navigator.mediaSession.setActionHandler("pause", window.player.pause);
                        navigator.mediaSession.setActionHandler("stop", window.player.stop);
                    }
                    if (e.data.title) {
                        this.mediaSession({
                            title: e.data.title,
                            artist: e.data.author?.name,
                            album: document.title,
                            artwork: [{
                                src: e.data.cover
                            }]
                        })
                    }
                })
            }
            /**
             * 设置媒体控制器
             * @param data 媒体控制面板
             */
            mediaSession(data: MediaMetadataInit) {
                if (!navigator.mediaSession.metadata) navigator.mediaSession.metadata = new MediaMetadata({ ...data });
                else {
                    navigator.mediaSession.metadata.title = data.title;
                    navigator.mediaSession.metadata.artist = data.artist;
                    navigator.mediaSession.metadata.album = data.album;
                    navigator.mediaSession.metadata.artwork = data.artwork;
                }
            }
        }
        new Player();
    } catch (e) { toast.error("player.js", e) }
})();