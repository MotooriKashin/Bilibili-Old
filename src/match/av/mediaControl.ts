/**
 * 本模块负责为旧版播放器添加媒体控制键  
 * 请以`title`、`artist`、`chapterName`、`coverUrl`、`getPlaylistIndex`的名义传入数据  
 * 告知：本模块由js强行any为ts版本，可能需要进一步优化
 */
(async function () {
    try {
        if (document.visibilityState !== "visible") {
            await new Promise(r => window.addEventListener('load', r))
        }
        if ("mediaSession" in (<any>navigator)) {
            function trial(fn: any) {
                let limit = 7;
                function task() { if (!fn() && --limit > 0) setTimeout(task, 1000) }
                task();
            }
            trial(() => {
                if ((<any>window).player != undefined && (<any>window).player.getPlaylist && (<any>window).player.getPlaylist() != null) {
                    let playList = (<any>window).player.getPlaylist();
                    // @ts-ignore：该变量由主模块传入
                    let partIndex = getPlaylistIndex();
                    // @ts-ignore：这是一项试验性特性
                    (<any>(<any>navigator)).mediaSession.metadata = new MediaMetadata({
                        // @ts-ignore：该变量由主模块传入
                        title: title,
                        // @ts-ignore：该变量由主模块传入
                        artist: artist,
                        // @ts-ignore：该变量由主模块传入
                        album: chapterName(partIndex, playList),
                        // @ts-ignore：该变量由主模块传入
                        artwork: coverUrl(partIndex, playList)
                    });
                    (<any>(<any>navigator)).mediaSession.setActionHandler('play', () => (<any>window).player.play());
                    (<any>navigator).mediaSession.setActionHandler('pause', () => (<any>window).player.pause());
                    (<any>navigator).mediaSession.setActionHandler('seekbackward', () => (<any>window).player.seek((<any>window).player.getCurrentTime() - 10));
                    (<any>navigator).mediaSession.setActionHandler('seekforward', () => (<any>window).player.seek((<any>window).player.getCurrentTime() + 10));
                    (<any>navigator).mediaSession.setActionHandler('previoustrack', () => (<any>window).player.prev());
                    (<any>navigator).mediaSession.setActionHandler('nexttrack', () => (<any>window).player.next());
                    API.switchVideo(() => {
                        // 要等到新的分p载入完成，getPlaylistIndex()的值才会更新
                        trial(() => {
                            // @ts-ignore：该变量由主模块传入
                            let pid = getPlaylistIndex();
                            if (pid != partIndex) {
                                partIndex = pid;
                                // @ts-ignore：该变量由主模块传入
                                (<any>navigator).mediaSession.metadata.album = chapterName(partIndex, playList);
                                // @ts-ignore：该变量由主模块传入
                                (<any>navigator).mediaSession.metadata.artwork = coverUrl(partIndex, playList);
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