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
    xhrhook("api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail", undefined, res => {
        const result = res.responseType === "json" ? res.response : JSON.parse(res.response);
        if (result.code === 0) {
            if (result.data?.card?.desc?.type === 2) location.replace(`https://h.bilibili.com/${result.data.card.desc.rid_str}`)
        }
    }, false);
}