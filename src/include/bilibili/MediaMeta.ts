namespace API {
    /** 信息存档 */
    let temp: any;
    /**
     * 媒体控制器MediaMeta信息
     * @param data MediaMeta数据
     */
    export function mediaSession(data: MediaMetadataInit) {
        Promise.resolve().then(() => window.GrayManager.setActionHandler());
        const check = JSON.stringify(data);
        if (temp === check) return;
        temp = check;
        if (!navigator.mediaSession.metadata) navigator.mediaSession.metadata = new MediaMetadata({ ...data });
        else {
            navigator.mediaSession.metadata.title = <any>data.title;
            navigator.mediaSession.metadata.artist = <any>data.artist;
            navigator.mediaSession.metadata.album = <any>data.album;
            navigator.mediaSession.metadata.artwork = <any>data.artwork;
        }
    }
    function getView() {
        xhr({
            url: `https://api.bilibili.com/x/web-interface/view?aid=${aid}`,
            credentials: true,
            responseType: "json"
        }).then(d => {
            if (d.code === 0) {
                mediaSession({
                    title: title = d.data.pages.find((d: any) => d.cid == cid).part,
                    artist: d.data.owner.name,
                    album: d.data.title,
                    artwork: [
                        { src: cover = d.data.pic }
                    ]
                })
            } else {
                return xhr({
                    url: `https://api.bilibili.com/view?appkey=8e9fc618fbd41e28&id=${aid}&type=json`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    if (d.cid) {
                        mediaSession({
                            title: title = d.list.find((d: any) => d.cid == cid).part,
                            artist: d.author,
                            album: d.title,
                            artwork: [
                                { src: cover = d.pic }
                            ]
                        })
                    } else {
                        return xhr({
                            url: `https://www.biliplus.com/api/view?id=${aid}`,
                            responseType: "json"
                        }).then(d => {
                            if (d.cid) {
                                mediaSession({
                                    title: title = d.list.find((d: any) => d.cid == cid).part,
                                    artist: d.author,
                                    album: d.title,
                                    artwork: [
                                        { src: cover = d.pic }
                                    ]
                                })
                            } else {
                                return Promise.reject("未能获取到播放数据~");
                            }
                        })
                    }
                })
            }
        }).catch(e => { debug.error(e) })
    }
    /** 设置媒体控制信息 */
    export function setMediaSession() {
        if (ssid && epid) {
            xhr({
                url: `https://bangumi.bilibili.com/view/web_api/season?season_id=${ssid}`,
                credentials: true,
                responseType: "json"
            }).then(d => {
                if (d.code === 0) {
                    mediaSession({
                        title: title = d.result.episodes.find((d: any) => d.ep_id == epid).index_title,
                        artist: d.result.actors,
                        album: d.result.title,
                        artwork: [
                            { src: cover = d.result.episodes.find((d: any) => d.ep_id == epid).cover }
                        ]
                    })
                }
                else getView();
            })
        }
        else getView();
    }
}
declare namespace API {
    /** 封面 */
    let cover: string | undefined;
}