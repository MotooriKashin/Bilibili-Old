import { doWhile } from "../../runtime/do_while";
import { createElement } from "../../runtime/element/create_element";
import { timeFormat } from "../../runtime/format/time";
import { GM } from "../../runtime/gm";
import { jsonCheck } from "../../runtime/unit";
import { isUserScript } from "../../tampermonkey/check";

/** 注册时间 */
export function jointime(mid: number) {
    doWhile(() => document.querySelector(".section.user-info"), t => {
        (isUserScript ? GM.xhr({ url: `https://account.bilibili.com/api/member/getCardByMid"?mid=${mid}` }) : GM.xmlHttpRequest(`https://account.bilibili.com/api/member/getCardByMid"?mid=${mid}`))
            .then(d => {
                const data = jsonCheck(d);
                const jointime = timeFormat(data.card.regtime * 1000, true);
                const node = <HTMLDivElement>t.lastChild;
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