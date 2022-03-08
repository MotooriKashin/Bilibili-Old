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
                text = text.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (str: string) => {
                    return "av" + abv(str);;
                }).replace(/av[0-9]+/gi, (str: string) => {
                    str = str.toLowerCase();
                    return `<a target="_blank" href="//www.bilibili.com/video/${str}">${str}</a>`;
                }).replace(/sm[0-9]+/gi, (str: string) => {
                    str = str.toLowerCase();
                    return `<a target="_blank" href="//www.nicovideo.jp/watch/${str}">${str}</a>`;
                }).replace(/cv[0-9]+/gi, (str: string) => {
                    str = str.toLowerCase();
                    return `<a target="_blank" href="//www.bilibili.com/read/${str}">${str}</a>`;
                });
                desc[1].innerHTML = text;
            }
        } catch (e) { debug.error("descBV.js", e) }
    })
}