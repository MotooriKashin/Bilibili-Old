import { toast } from "../../core/toast";
import htmlTv from "../../html/tv.html";
import { Header } from "../header";
import { Page } from "../page";

export class PageTv extends Page {
    constructor() {
        super(htmlTv);
        Header.prid = 1634;
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
        this.carouselList();
        this.hotRecomSpec();
        this.hotRecomList();
    }
    private carouselList() {
        fetch('https://api.bilibili.com/pgc/operation/api/slideshow?position_id=273', { credentials: 'include' }).then(d => d.json()).then(d => {
            if ((<any>window).__INITIAL_STATE__) {
                (<any>window).__INITIAL_STATE__.carouselList = d.result;
            }
        }).catch(e => {
            toast.error('滚动推荐', e);
        });
    }
    private hotRecomSpec() {
        fetch('https://api.bilibili.com/pgc/operation/api/static?position_id=274', { credentials: 'include' }).then(d => d.json()).then(d => {
            if ((<any>window).__INITIAL_STATE__) {
                (<any>window).__INITIAL_STATE__.hotRecomSpec = d.result;
            }
        }).catch(e => {
            toast.error('热播推荐', e);
        });
    }
    private hotRecomList() {
        fetch('https://api.bilibili.com/pgc/operation/api/static?position_id=275', { credentials: 'include' }).then(d => d.json()).then(d => {
            if ((<any>window).__INITIAL_STATE__) {
                (<any>window).__INITIAL_STATE__.hotRecomList = d.result;
            }
        }).catch(e => {
            toast.error('热播推荐', e);
        });
    }
}