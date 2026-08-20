import { Mode } from "../index.js";
import type { DanmakuElem } from "../../index.js";
import type { Space } from "../mode1/space.js";
import stylesheet from "./index.css" with {type: 'css'};

export class Mode6 extends Mode {
    static get is() {
        return 'mode-6';
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
            const res = Mode6.space.getPos({ id: this.dmid, progress: this.progress, width: this.width, height: this.height });
            if (res) {
                this.dataset["y"] = <any>res;
            }
        }
    }
    override disconnectedCallback() {
        super.disconnectedCallback();
        Mode6.space.delete(this.dmid);
    }
}
customElements.define(Mode6.is, Mode6);