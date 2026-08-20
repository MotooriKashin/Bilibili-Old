import { Mode } from "../index.js";
import type { DanmakuElem } from "../../index.js";
import type { Space } from "./space.js";
import stylesheet from "./index.css" with {type: 'css'};

export class Mode1 extends Mode {
    static get is() {
        return 'mode-1';
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
            const res = Mode1.space.getPos({ id: this.dmid, progress: this.progress, width: this.width, height: this.height });
            if (res) {
                this.dataset["y"] = <any>res;
            }
        }
    }
    override disconnectedCallback() {
        super.disconnectedCallback();
        Mode1.space.delete(this.dmid);
    }
}
customElements.define(Mode1.is, Mode1);