interface modules {
    /**
     * 设置媒体控制器MediaMeta信息  
     */
    readonly "MediaMeta.js": string;
}
{
    function mediaSession(data: MediaMetadataInit) {
        if (!navigator.mediaSession.metadata) navigator.mediaSession.metadata = new MediaMetadata({ ...data });
        else {
            navigator.mediaSession.metadata.title = data.title;
            navigator.mediaSession.metadata.artist = data.artist;
            navigator.mediaSession.metadata.album = data.album;
            navigator.mediaSession.metadata.artwork = data.artwork;
        }
    }
    API.mediaSession = (data: MediaMetadataInit) => mediaSession(data);
}
declare namespace API {
    /**
     * 设置媒体控制器MediaMeta信息
     * @param data MediaMeta数据
     */
    export function mediaSession(data: MediaMetadataInit): void;
}