import { doWhile } from "../../runtime/doWhile";
import { createElement } from "../../runtime/element/createElement";
import { timeFormat } from "../../runtime/format/time";
import { objUrl } from "../../runtime/format/url";
import { jsonCheck } from "../../runtime/unit";
import { xhr } from "../../runtime/xhr";

/** 注册时间 */
export function jointime(mid: number) {
    doWhile(() => document.querySelector(".section.user-info"), t => {
        xhr.GM(objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": mid }))
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