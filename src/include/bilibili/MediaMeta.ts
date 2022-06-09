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
    /** 设置媒体控制信息 */
    export function setMediaSession() {
        xhr({
            url: `https://api.bilibili.com/x/article/cards?ids=av${aid}`,
            responseType: "json"
        }, true).then(d => {
            if (d.data[`av${aid}`]) {
                mediaSession({
                    title: d.data[`av${aid}`].title,
                    artist: d.data[`av${aid}`].owner.name,
                    album: epid ? `ep${epid}` : `av${aid}`,
                    artwork: [
                        { src: cover = d.data[`av${aid}`].pic }
                    ]
                });
                title = epid ? `ep${epid}` : `av${aid}` + " " + d.data[`av${aid}`].title;
            }
        }).catch(e => { debug.error("MediaSession", e) })
    }
}
declare namespace API {
    /** 封面 */
    let cover: string | undefined;
}