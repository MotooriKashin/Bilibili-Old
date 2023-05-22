import { toast } from "../../core/toast";
import htmlDocumentary from "../../html/documentary.html";
import { Header } from "../header";
import { Page } from "../page";

export class PageDocumentary extends Page {
    constructor() {
        super(htmlDocumentary);
        Header.prid = 1634;
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
        this.carouselList();
        this.hotRecomSpec();
        this.hotRecomList();
    }
    private carouselList() {
        fetch('https://api.bilibili.com/pgc/page/web/v2?name=documentary', { credentials: 'include' }).then(d => d.json()).then(d => {
            if ((<any>window).__INITIAL_STATE__) {
                (<any>window).__INITIAL_STATE__.carouselList = d.data.modules[0].items.map((d: any) => {
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
                });
            }
        }).catch(e => {
            toast.error('滚动推荐', e);
        });
    }
    private hotRecomSpec() {
        fetch('https://api.bilibili.com/pgc/operation/api/static?position_id=384', { credentials: 'include' }).then(d => d.json()).then(d => {
            if ((<any>window).__INITIAL_STATE__) {
                (<any>window).__INITIAL_STATE__.hotRecomSpec = d.result;
            }
        }).catch(e => {
            toast.error('热播推荐', e);
        });
    }
    private hotRecomList() {
        fetch('https://api.bilibili.com/pgc/operation/api/static?position_id=258', { credentials: 'include' }).then(d => d.json()).then(d => {
            if ((<any>window).__INITIAL_STATE__) {
                (<any>window).__INITIAL_STATE__.hotRecomList = d.result;
            }
        }).catch(e => {
            toast.error('热播推荐', e);
        });
    }
}