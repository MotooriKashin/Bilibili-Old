interface modules {
    /** 相簿重定向 */
    readonly "album.js": string;
}
namespace API {
    xhrhook("api.bilibili.com/x/dynamic/feed/draw/doc_list", undefined, obj => {
        const response = JSON.parse(<string>obj.responseText);
        let data = response.data.items.reduce((s: number[], d: Record<string, any>) => {
            s.push(d.doc_id);
            return s;
        }, []);
        setTimeout(() => {
            document.querySelectorAll(".album-card").forEach((d, i) => {
                (<HTMLAnchorElement>d.firstChild).href = `//h.bilibili.com/${data[i]}`;
                (<HTMLAnchorElement>d.children[1]).href = `//h.bilibili.com/${data[i]}`;
            })
        }, 1000)
    }, false);
}