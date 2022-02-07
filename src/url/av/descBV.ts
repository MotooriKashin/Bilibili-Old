interface modules {
    /**
     * 修复视频简介中的超链接
     */
    readonly "descBV.js": string;
}
API.switchVideo(() => {
    try {
        let desc = document.getElementsByClassName("info");
        if (desc[1] && desc[1].parentNode && (<HTMLElement>desc[1].parentNode).id == "v_desc") {
            let text = (<HTMLDivElement>desc[1]).textContent;
            text = text.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (str) => {
                const av = API.abv(str);
                return `<a target="_blank" href="http://acg.tv/av${av}">av${av}</a>`;
            }).replace(/(av|sm)[0-9]+/gi, (str) => {
                str = str.toLowerCase();
                return `<a target="_blank" href="http://acg.tv/${str}">${str}</a>`;
            });
            desc[1].innerHTML = text;
        }
    } catch (e) { debug.error("descBV.js", e) }
})