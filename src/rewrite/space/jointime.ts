/**
 * 本模块负责添加空间账号注册时间信息
 */
(async function () {
    if (!document.querySelector(".user-info-title")) {

        await new Promise(r => {
            API.runWhile(() => document.querySelector(".user-info-title"), r)
        })
    }
    try {
        let data = API.jsonCheck(await API.xhr.GM({ url: API.objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": <string>API.mid }) }));
        let jointime = API.timeFormat(data.card.regtime * 1000, true);
        let node = <HTMLDivElement>document.querySelector(".user-info-title");
        API.addElement("span", { class: "info-jointime" }, node, jointime);
    } catch (e) { API.debug.trace(e, "jointime.js") }
})();