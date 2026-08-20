import { Mode } from "../index.js";
import type { DanmakuElem } from "../../index.js";
import { Space } from "../mode4/space.js";
import stylesheet from "./index.css" with {type: 'css'};

export class Mode5 extends Mode {
    static get is() {
        return 'mode-5';
    }
    static space: Space;
    constructor(
        parent: ParentNode,
        dm: DanmakuElem,
        delay = 0,
    ) {
        super(parent, dm, delay, stylesheet);

        // 计算轨道数据
        if (!this.special) {
            const res = Mode5.space.getPos({ id: this.dmid, progress: this.progress, height: this.height });
            if (res) {
                this.dataset["y"] = <any>res;
            }
        }
    }
    override disconnectedCallback() {
        super.disconnectedCallback();
        Mode5.space.delete(this.dmid);
    }
}
customElements.define(Mode5.is, Mode5);