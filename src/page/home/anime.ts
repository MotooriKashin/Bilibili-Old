import htmlAnime from "../../html/anime.html";
import { xhrHook } from "../../utils/hook/xhr";
import { Header } from "../header";
import { Page } from "../page";

export class PageAnime extends Page {
    constructor() {
        super(htmlAnime);
        Header.prid = 1612;
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
    }
    /** 修复编辑推荐 */
    handPickList() {
        xhrHook(['pgc/operation/api/static', 'position_id=520'], undefined, () => {
            setTimeout(() => {
                const d = document.querySelector<any>('.hot-recom-module')
                if (d && d.__vue__) {
                    d.__vue__.renderList = JSON.parse(JSON.stringify(d.__vue__.HAND_PICK_LIST));
                }
            })
        }, false);
    }
}