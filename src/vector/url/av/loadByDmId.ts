interface modules {
    /** 弹幕ID跳转 */
    readonly "loadByDmId.js": string;
}
namespace API {
    const dmid = urlObj(location.href).dmid;
    let progress: any = Number(urlObj(location.href).dm_progress);
    let first = 0;
    switchVideo(async () => {
        if (!(<any>window).player?.seek) {
            await new Promise(r => {
                doWhile(() => (<any>window).player?.seek, r)
            })
        }
        if (first) return;
        first++;
        if (progress) return (<any>window).player.seek(progress);
        if (dmid) {
            progress = await xhr({
                url: `https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=${cid}&dmid=${dmid}`,
                credentials: true
            }, true);
            progress = jsonCheck(progress).data.progress; // 检查xhr返回值并转化为json
            progress && (<any>window).player.seek(progress / 1000 - .2);
        }
    })
}