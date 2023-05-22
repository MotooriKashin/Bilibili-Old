import htmlAnime from "../../html/anime.html";
import { xhrHook } from "../../utils/hook/xhr";
import { Header } from "../header";
import { Page } from "../page";

export class PageAnime extends Page {
    constructor() {
        super(htmlAnime);
        Header.prid = location.pathname.includes('anime') ? 1612 : 1920;
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
        this.handPickList();
    }
    /** 修复编辑推荐 */
    private handPickList() {
        xhrHook(['pgc/operation/api/static', 'position_id=52'], undefined, () => {
            setTimeout(() => {
                const d = document.querySelector<any>('.hot-recom-module')
                if (d && d.__vue__) {
                    d.__vue__.renderList = JSON.parse(JSON.stringify(d.__vue__.HAND_PICK_LIST));
                }
            })
        }, false);
    }
}