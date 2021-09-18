/**
 * 本模块负责为旧版av/BV、稍后再看添加点赞功能
 */
(function () {
    API.runWhile(() => document.querySelector(".v.play"), async () => {
        let span = document.createElement("span");
        let like = `background-image: url(//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/like.png);`;
        let dislike = `background-image: url(//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/dislike.png);`;
        let text = document.createTextNode("点赞 --");
        let arg = text;
        let islike = false;
        let i = API.addElement("i", { class: "l-icon-move", style: 'width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;' + dislike }, span);
        let b = API.addElement("b", { class: "l-icon-moved", style: "width : 22px;height : 22px;display : none;" }, span)
        span.setAttribute("class", "u like");
        span.setAttribute("style", "margin-left : 24px;margin-right : 10px;");
        span.appendChild(text);
        (<HTMLElement>document.querySelector(".number")).insertBefore(span, document.querySelector(".coin"));
        try {
            span.onclick = async () => {
                if (like) {
                    // 取消点赞
                    let data = await xhr({
                        url: "https://api.bilibili.com/x/web-interface/archive/like",
                        method: "POST",
                        data: `aid=${API.aid}&like=2&csrf=${API.getCookies().bili_jct}`
                    });
                    data = API.jsonCheck(data).ttl;
                    toast.warning("取消点赞！");
                    islike = false;
                    i.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + dislike);
                    b.setAttribute("style", "width : 22px;height : 22px;display : none;");
                    if ((<any>arg.nodeValue).match("万")) return;
                    let number = 1 * (<any>arg.nodeValue).match(/[0-9]+/) - 1;
                    text = document.createTextNode(" 点赞 " + number);
                    arg.replaceWith(text);
                    arg = text;
                } else {
                    if (!API.uid) return API.biliQuickLogin(); // 登录判断
                    // 点赞
                    let data = await xhr({
                        url: "https://api.bilibili.com/x/web-interface/archive/like",
                        method: "POST",
                        data: `aid=${API.aid}&like=1&csrf=${API.getCookies().bili_jct}`
                    });
                    data = API.jsonCheck(data).ttl;
                    toast.success("点赞成功！");
                    islike = true;
                    i.setAttribute("style", "width : 22px;height : 22px;display : none;");
                    b.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + like);
                    if ((<any>arg.nodeValue).match("万")) return;
                    let number = 1 * (<any>arg.nodeValue).match(/[0-9]+/) + 1;
                    text = document.createTextNode(" 点赞 " + number);
                    arg.replaceWith(text);
                    arg = text;
                }
            }
            // 初始化按钮
            let data = await xhr({
                url: API.objUrl("https://api.bilibili.com/x/web-interface/view", { aid: <any>API.aid })
            })
            data = API.jsonCheck(data).data.stat.like;
            (<HTMLElement>document.querySelector(".like")).setAttribute("title", "点赞人数" + data);
            text = document.createTextNode(" 点赞 " + API.unitFormat(data));
            arg.replaceWith(text);
            arg = text;
            if (!API.uid) return;
            data = API.jsonCheck(await xhr({ url: API.objUrl("https://api.bilibili.com/x/web-interface/archive/has/like", { "aid": <any>API.aid }) })).data;
            if (data == 1) {
                // 点赞过点亮图标
                i.setAttribute("style", "width : 22px;height : 22px;display : none;");
                b.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + like);
                islike = true;
            }
        } catch (e) { API.trace(e, "enLike.js") }
    })
})();