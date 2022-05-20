interface modules {
    readonly "ui.html": string;
}
namespace API {
    class BilibilEntry extends HTMLElement {
        root: ShadowRoot;
        gear: HTMLDivElement;
        stage: HTMLDivElement;
        constructor() {
            super();
            this.root = this.attachShadow({ mode: "closed" });
            this.root.appendChild(createElements(htmlVnode(getModule("ui.html").replace('<div class="gear"></div>', `<div class="gear">${getModule("gear.svg")}</div>`))));
            this.stage = <HTMLDivElement>this.root.children[0];
            this.gear = <HTMLDivElement>this.root.children[1];
            this.stage.remove();
            this.gear.remove();
            this.gear.addEventListener("mouseover", () => this.gear.style.opacity = "0.8");
            this.gear.addEventListener("mouseout", () => this.gear.style.opacity = "0");
            this.gear.addEventListener("click", () => { showSetting() });
            this.stage.addEventListener("click", () => { showSetting() });
        }
        change() {
            if (config.settingEntryType) {
                this.root.contains(this.gear) && this.gear.remove();
                this.root.contains(this.stage) || this.root.appendChild(this.stage);
            } else {
                this.root.contains(this.stage) && this.stage.remove();
                if (!this.root.contains(this.gear)) {
                    this.root.appendChild(this.gear);
                    setTimeout(() => {
                        this.gear.style.opacity = "0";
                    }, 2e3);
                }
            }
        }
    }
    customElements.define("bilibili-entry", BilibilEntry);
    const node = new BilibilEntry();
    /** 绘制设置入口 */
    export function showSettingEntry() {
        document.body.contains(node) || document.body.appendChild(node);
        node.change();
    }
}