import htmlMovie from "../../html/movie.html";
import { Header } from "../header";
import { Page } from "../page";

export class PageMovie extends Page {
    constructor() {
        super(htmlMovie);
        Header.prid = 1634;
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
    }
}