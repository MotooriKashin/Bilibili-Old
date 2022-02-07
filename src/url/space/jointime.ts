interface modules {
    /**
     * 注册时间
     */
    readonly "jointime.js": string;
}
(async function () {
    try {
        if (!document.querySelector(".user-info-title")) {
            await new Promise(r => {
                API.runWhile(() => document.querySelector(".user-info-title"), r)
            })
        }
        let data = API.jsonCheck(await xhr.GM({ url: Format.objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": <string>API.mid }) }));
        let jointime = Format.timeFormat(data.card.regtime * 1000, true);
        let node = <HTMLDivElement>document.querySelector(".user-info-title");
        API.addElement("span", { class: "info-jointime" }, node, jointime);
    } catch (e) { toast.error("jsontime.js", e) }
})();