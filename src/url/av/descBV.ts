interface modules {
    /** 修复视频简介中的超链接 */
    readonly "descBV.js": string;
}
namespace API {
    switchVideo(() => {
        try {
            let desc = document.getElementsByClassName("info");
            if (desc[1] && desc[1].parentNode && (<HTMLElement>desc[1].parentNode).id == "v_desc") {
                let text: any = (<HTMLDivElement>desc[1]).textContent;
                text = text.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (str: any) => {
                    return "av" + API.abv(str);;
                }).replace(/(av|sm)[0-9]+/gi, (str: any) => {
                    str = str.toLowerCase();
                    return `<a target="_blank" href="http://acg.tv/${str}">${str}</a>`; // 此域名并未升级https！
                });
                desc[1].innerHTML = text;
            }
        } catch (e) { debug.error("descBV.js", e) }
    })
}