interface modules {
    /** 注册时间 */
    readonly "jointime.js": string;
}
namespace API {
    (async function () {
        try {
            if (!document.querySelector(".user-info-title")) {
                await new Promise(r => {
                    runWhile(() => document.querySelector(".user-info-title"), r)
                })
            }
            let data = jsonCheck(await xhr.GM({ url: Format.objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": <string>mid }) }));
            let jointime = Format.timeFormat(data.card.regtime * 1000, true);
            let node = <HTMLDivElement>document.querySelector(".user-info-title");
            addElement("span", { class: "info-jointime" }, node, jointime);
        } catch (e) { toast.error("jsontime.js", e) }
    })();
}