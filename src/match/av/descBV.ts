/**
 * 本模块负责转化av页简介中BV号为超链接
 */
(function () {
    try {
        API.switchVideo(() => {
            let desc = document.getElementsByClassName("info");
            if (desc[1] && desc[1].parentNode && (<HTMLElement>desc[1].parentNode).id == "v_desc") {
                if (desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                    const text = (<HTMLDivElement>desc[1]).innerText.replace(/BV[A-Za-z0-9]+/gi, (str) => {
                        const av = API.abv(str);
                        return `<a target="_blank" href="//www.bilibili.com/video/av${av}">av${av}</a>`;
                    })
                    desc[1].innerHTML = text;
                }
            }
        })
    } catch (e) { debug.error("descBV.js", e) }
})();