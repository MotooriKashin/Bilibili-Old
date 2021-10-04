/**
 * 本模块负责生成和作视频的UP列表
 * 请以`staff`的名义传入UP主列表
 */
(function () {
    try {
        API.runWhile(() => document.querySelector("#v_upinfo"), () => {
            let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
            // @ts-ignore：该变量由主模块传入
            fl = staff.reduce((s, d) => {
                s = s + `<div class="up-card">
                <a href="//space.bilibili.com/${d.mid}" data-usercard-mid="${d.mid}" target="_blank" class="avatar">
                <img src="${d.face}@48w_48h.webp" /><!---->
                <span class="info-tag">${d.title}</span><!----></a>
                <div class="avatar">
                <a href="//space.bilibili.com/${d.mid}" data-usercard-mid="${d.mid}" target="_blank" class="${(d.vip && d.vip.status) ? 'name-text is-vip' : 'name-text'}">${d.name}</a>
                </div></div>`;
                return s;
            }, fl) + `</div>`;
            document.querySelector("#v_upinfo").innerHTML = fl;
            API.addCss(API.getModule("upList.css"));
        });
    }
    catch (e) {
        API.trace(e, "upList.js", true);
    }
})();
