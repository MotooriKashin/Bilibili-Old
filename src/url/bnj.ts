interface modules {
    /** 拜年祭专题页面 */
    readonly "bnj.js": string;
}
namespace API {
    runWhile(() => (<any>window).__INITIAL_STATE__, () => {
        try {
            const titles: Record<"title" | "aid", string>[] = (<any>window).__INITIAL_STATE__.videoSections.reduce((s: Record<string, string>[], d: Record<"episodes", Record<"title", string>[]>) => {
                d.episodes.forEach(d => s.push(d));
                return s;
            }, []);
            // 替换播放器节点
            const node = document.querySelector<any>("#bilibili-player").parentElement;
            const root = node.attachShadow({ mode: "closed" }); // 使用shadow覆盖视频节点而不影响页面其他功能
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.bilibili.com/blackboard/html5player.html?aid=${(<any>window).__INITIAL_STATE__.videoInfo.aid}&cid=${(<any>window).__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1`;
            iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
            root.appendChild(iframe);
            // 添加时间戳监听
            const episodes = <NodeListOf<HTMLDivElement>>document.querySelectorAll('.video-episode-card__info-title');
            episodes.forEach((d, i, e) => {
                const episode = titles.find(t => t.title == d.innerText);
                (<any>e[i]).parentNode.parentNode.onclick = () => {
                    setTimeout(() => {
                        // 销毁切p播放器已阻止自动播放
                        window.player && window.player.destroy();
                    }, 100);
                    // toast(episode.title, `av${Reflect.get(episode, "aid")}`, `UP主：${Reflect.get(episode, "author").name}`)
                    (<any>iframe).contentWindow.postMessage({ ...episode })
                }
            })
            window.addEventListener("message", e => {
                if (e.data == "MediaMeta") {
                    const episode: any = titles.find(t => t.aid == (<any>window).__INITIAL_STATE__.videoInfo.aid);
                    (<any>iframe).contentWindow.postMessage({
                        title: episode.title,
                        author: episode.author,
                        cover: episode.cover
                    })
                }
            })
            // 销毁原播放器
            runWhile(() => window.player && window.player.destroy, () => {
                setTimeout(() => {
                    window.player && window.player.destroy();
                }, 100);
            })
        } catch (e) { toast.error("bnjFestival.js", e) }
    })
}