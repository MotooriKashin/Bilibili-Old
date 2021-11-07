/**
 * 本模块负责为旧版播放器添加媒体控制键  
 * 请以`mediaInfo`、`getPlaylistIndex`的名义传入数据
 * 告知：本模块由js强行any为ts版本，可能需要进一步优化
 */
(async function mediaControl() {
    try {
        // 等待播放器正式加载
        if (document.visibilityState !== "visible") {
            let listener = () => {
                document.removeEventListener("visibilitychange", listener);
                mediaControl();
            }
            document.addEventListener("visibilitychange", listener);
        } else if ("mediaSession" in window.navigator) {
            function trial(fn: Function) {
                let limit = 7;
                function task() { if (!fn() && --limit > 0) setTimeout(task, 1000) }
                task();
            }
            trial(() => {
                // 确保播放器和播放列表已经加载
                if ((<any>window).player != undefined && (<any>window).player.getPlaylist && (<any>window).player.getPlaylist() != null) {
                    // @ts-ignore：该变量由主模块传入
                    let LastPid = getPlaylistIndex();
                    // @ts-ignore：该变量由主模块传入
                    let info = mediaInfo(LastPid, (<any>window).player.getPlaylist());
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: info.title,
                        artist: info.artist,
                        album: info.chapterName,
                        artwork: info.coverUrl
                    });
                    navigator.mediaSession.setActionHandler('play', () => (<any>window).player.play());
                    navigator.mediaSession.setActionHandler('pause', () => (<any>window).player.pause());
                    navigator.mediaSession.setActionHandler('seekbackward', () => (<any>window).player.seek((<any>window).player.getCurrentTime() - 10));
                    navigator.mediaSession.setActionHandler('seekforward', () => (<any>window).player.seek((<any>window).player.getCurrentTime() + 10));
                    navigator.mediaSession.setActionHandler('previoustrack', () => (<any>window).player.prev());
                    navigator.mediaSession.setActionHandler('nexttrack', () => (<any>window).player.next());
                    let playList = (<any>window).player.getPlaylist();
                    API.switchVideo(() => {
                        // 要等到新的分p载入完成，getPlaylistIndex()的值才会更新
                        trial(() => {
                            // @ts-ignore：该变量由主模块传入
                            let pid = getPlaylistIndex();
                            if (pid != LastPid) {
                                LastPid = pid;
                                // @ts-ignore：该变量由主模块传入
                                info = mediaInfo(LastPid, (<any>window).player.getPlaylist());
                                navigator.mediaSession.metadata.title = info.title;
                                navigator.mediaSession.metadata.artist = info.artist;
                                navigator.mediaSession.metadata.album = info.chapterName;
                                navigator.mediaSession.metadata.artwork = info.coverUrl;
                                return true;
                            }
                        });
                    });
                    return true;
                }
            });
        }
    } catch (e) { toast.error("mediaControl.js", e) }
})();