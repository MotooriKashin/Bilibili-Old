interface modules {
    /** 设置媒体控制器MediaMeta信息 */
    readonly "MediaMeta.js": string;
}
namespace API {
    /**
     * 置媒体控制器MediaMeta信息
     * @param data MediaMeta数据
     */
    export function mediaSession(data: MediaMetadataInit) {
        if (!navigator.mediaSession.metadata) navigator.mediaSession.metadata = new MediaMetadata({ ...data });
        else {
            navigator.mediaSession.metadata.title = <any>data.title;
            navigator.mediaSession.metadata.artist = <any>data.artist;
            navigator.mediaSession.metadata.album = <any>data.album;
            navigator.mediaSession.metadata.artwork = <any>data.artwork;
        }
    }
}