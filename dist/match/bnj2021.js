/**
 * 本模块负责替换拜年祭2021专题页面使用旧版嵌入播放器
 */
var bnj2021;
(function (bnj2021) {
    try {
        API.runWhile(() => window.__INITIAL_STATE__, () => {
            const titles = window.__INITIAL_STATE__.videoSections.reduce((s, d) => {
                d.episodes.forEach(d => s.push(d));
                return s;
            }, []);
            // 替换播放器节点
            const node = document.querySelector("#bilibili-player");
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.bilibili.com/blackboard/html5player.html?aid=${window.__INITIAL_STATE__.videoInfo.aid}&cid=${window.__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1`;
            iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
            iframe.setAttribute("id", "bofqi");
            node.replaceWith(iframe);
            // 添加时间戳监听
            const episodes = document.querySelectorAll('.video-episode-card__info-title');
            episodes.forEach((d, i, e) => {
                const episode = titles.find(t => t.title == d.innerText);
                e[i].parentNode.parentNode.onclick = () => {
                    toast(episode.title, `av${Reflect.get(episode, "aid")}`, `UP主：${Reflect.get(episode, "author").name}`);
                    iframe.contentWindow.postMessage({ aid: Reflect.get(episode, "aid"), cid: Reflect.get(episode, "cid") });
                };
            });
        });
    }
    catch (e) {
        API.trace(e, "bnj2021.js", true);
    }
})(bnj2021 || (bnj2021 = {}));
