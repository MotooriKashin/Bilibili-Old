/**
 * 本模块负责替换拜年祭2021专题页面使用旧版嵌入播放器
 */
(function () {
    API.runWhile(() => (<any>window).__INITIAL_STATE__, () => {
        try {
            const titles: Record<"title", string>[] = (<any>window).__INITIAL_STATE__.videoSections.reduce((s: Record<string, string>[], d: Record<"episodes", Record<"title", string>[]>) => {
                d.episodes.forEach(d => s.push(d));
                return s;
            }, []);
            // 替换播放器节点
            const node = document.querySelector("#bilibili-player");
            const root = node.attachShadow({ mode: "closed" }); // 使用shadow覆盖视频节点而不影响页面其他功能
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.bilibili.com/blackboard/html5player.html?aid=${(<any>window).__INITIAL_STATE__.videoInfo.aid}&cid=${(<any>window).__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1`;
            iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
            root.appendChild(iframe);
            // 添加时间戳监听
            const episodes = <NodeListOf<HTMLDivElement>>document.querySelectorAll('.video-episode-card__info-title');
            episodes.forEach((d, i, e) => {
                const episode = titles.find(t => t.title == d.innerText);
                (<HTMLDivElement>e[i].parentNode.parentNode).onclick = () => {
                    setTimeout(() => {
                        // 销毁切p播放器已阻止自动播放
                        window.player && window.player.destroy();
                    }, 100);
                    // toast(episode.title, `av${Reflect.get(episode, "aid")}`, `UP主：${Reflect.get(episode, "author").name}`)
                    iframe.contentWindow.postMessage({ ...episode })
                }
            })
            // 销毁原播放器
            API.runWhile(() => window.player && window.player.destroy, () => {
                const episode: any = titles.find(t => t.title == (<any>window).__INITIAL_STATE__.videoInfo.title);
                iframe.contentWindow.postMessage({
                    title: episode.title,
                    author: episode.author,
                    cover: episode.cover
                })
                setTimeout(() => {
                    window.player && window.player.destroy();
                }, 100);
            })
        } catch (e) { toast.error("bnjFestival.js", e) }
    })
})();