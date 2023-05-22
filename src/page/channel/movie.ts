import htmlMovie from "../../html/movie.html";
import { xhrHook } from "../../utils/hook/xhr";
import { Header } from "../header";
import { Page } from "../page";

export class PageMovie extends Page {
    constructor() {
        super(htmlMovie);
        Header.prid = 1634;
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
        this.slideshow();
    }
    private slideshow() {
        xhrHook.async('pgc/operation/api/slideshow?position_id=265', undefined, async () => {
            const d = await fetch('https://api.bilibili.com/pgc/page/web/v2?name=movie', { credentials: 'include' })
            const json = await d.json();
            const response = JSON.stringify({
                code: 0,
                message: "success",
                result: json.data.modules[0].items.map((d: any) => {
                    return {
                        blink: d.link,
                        gif: '',
                        id: d.item_id,
                        img: d.cover,
                        link: d.link,
                        pub_time: '',
                        simg: d.cover,
                        title: d.title
                    }
                })
            })
            return { response, responseText: response }
        })
    }
}