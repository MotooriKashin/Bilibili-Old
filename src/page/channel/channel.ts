import { BLOD } from "../../core/bilibili-old";
import htmlChannel from "../../html/channel.html";
import { poll } from "../../utils/poll";
import { Header } from "../header";
import { Page } from "../page";

export class PageChannel extends Page {
    constructor() {
        super(htmlChannel);
        Header.primaryMenu();
        Header.banner();
        this.updateDom();
        this.sliderData();
    }
    get carousel() {
        switch (BLOD.path[4]) {
            case 'douga': return 4973;
            // case 'music': return 4991;
        }
    }
    private sliderData() {
        const carousel = this.carousel;
        if (carousel) {
            poll(() => document.querySelector<any>('.channel-m>.nominate-m'), slider => {
                fetch(`https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=${carousel}`).then(d => d.json()).then(d => {
                    if (slider && slider.__vue__) {
                        slider.__vue__.sliderData = d.data[carousel].filter((d: any) => d.name)
                    }
                })
            })
        }
    }
}