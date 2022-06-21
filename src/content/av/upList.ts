import { doWhile } from "../../runtime/doWhile";
import { addCssEs } from "../../runtime/element/addElement";

export function upList(staff: Record<string, any>[]) {
    doWhile(() => document.querySelector<HTMLDivElement>("#v_upinfo"), node => {
        let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
        fl = staff.reduce((s, d) => {
            s = s + `<div class="up-card">
                <a href="//space.bilibili.com/${d.mid}" data-usercard-mid="${d.mid}" target="_blank" class="avatar">
                <img src="${d.face}@48w_48h.webp" /><!---->
                <span class="info-tag">${d.title}</span><!----></a>
                <div class="avatar">
                <a href="//space.bilibili.com/${d.mid}" data-usercard-mid="${d.mid}" target="_blank" class="${(d.vip && d.vip.status) ? 'name-text is-vip' : 'name-text'}">${d.name}</a>
                </div></div>`
            return s;
        }, fl) + `</div>`;
        node.innerHTML = fl;
        addCssEs("content/av/upList.css");
    });
}