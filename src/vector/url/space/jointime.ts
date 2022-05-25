interface modules {
    /** 注册时间 */
    readonly "jointime.js": string;
}
namespace API {
    doWhile(() => document.querySelector(".info-uid"), () => {
        xhr.GM({
            url: objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": <string>mid }),
            responseType: "json"
        }, true).then(d => {
            const jointime = timeFormat(d.card.regtime * 1000, true);
            const node: HTMLDivElement = (<any>document.querySelector(".info-uid")).parentElement.parentElement;
            node.appendChild(createElement({
                tagName: "div",
                props: { class: "info-regtime", style: "display: inline-block;word-break: break-all;" },
                children: [
                    {
                        tagName: "span",
                        props: { class: "info-command", style: "display: inline-block;font-size: 12px;font-family: Microsoft YaHei;line-height: 16px;color: #9499a0;margin-right: 16px;" },
                        children: [
                            {
                                tagName: "text",
                                text: "注册"
                            }
                        ]
                    }, {
                        tagName: "span",
                        props: { class: "info-value", style: "color: #6d757a;font-family: Microsoft YaHei;font-size: 12px;line-height: 16px;padding-right: 15px;" },
                        children: [
                            {
                                tagName: "text",
                                text: jointime
                            }
                        ]
                    }
                ]
            }));
        })
    })
}