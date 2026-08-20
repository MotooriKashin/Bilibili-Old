import { Mode } from "../index.js";
import type { DanmakuElem } from "../../index.js";
import type { Space } from "./space.js";
import stylesheet from "./index.css" with {type: 'css'};

export class Mode4 extends Mode {
    static get is() {
        return 'mode-4';
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
            const res = Mode4.space.getPos({ id: this.dmid, progress: this.progress, height: this.height });
            if (res) {
                this.dataset["y"] = <any>res;
            }
        }
    }
    override disconnectedCallback() {
        super.disconnectedCallback();
        Mode4.space.delete(this.dmid);
    }
}
customElements.define(Mode4.is, Mode4);