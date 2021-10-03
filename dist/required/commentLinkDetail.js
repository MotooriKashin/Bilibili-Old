/**
 * 本模块负责将评论区超链接还原为av号
 */
(function () {
    let timer;
    API.observerAddedNodes((node) => {
        if (/l_id/.test(node.id) || /reply-wrap/.test(node.className)) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = undefined;
                document.querySelectorAll(".comment-jump-url").forEach((d, i, e) => {
                    if (d.href && !d.href.includes(d.text)) {
                        const arr = d.href.split("/");
                        let text = arr[arr.length - 1] || arr[arr.length - 2];
                        text.toLowerCase().startsWith("bv") && (text = API.abv(text));
                        e[i].title = d.text;
                        e[i].text = text;
                    }
                });
            }, 100);
        }
    });
})();
