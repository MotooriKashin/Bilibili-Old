/** 节点数据 */
export interface Vdom {
    /** 节点名称 */
    tagName: keyof HTMLElementTagNameMap | "text" | "svg";
    /** 节点属性 */
    props?: Record<string, string>;
    /** 子节点 */
    children?: Vdom[];
    /** 节点文本（tagName==="text"） */
    text?: string | number;
    /** 事件回调 */
    event?: Partial<Record<keyof DocumentEventMap, (this: Document, ev: DocumentEventMap[keyof DocumentEventMap]) => any>>;
}
/** Vdom节点模板 */
class Vnode {
    tagName: string;
    props: Record<string, string> = {};
    children: Vdom[] = [];
    text?: string;
    constructor(tagName: string) {
        this.tagName = tagName;
    }
}
class Scanner {
    /** HTML */
    html: string;
    /** 当前光标 */
    pos = 0;
    /** Vnode */
    vnode: Vdom[] = [];
    /** 节点名栈 */
    tagNames: string[] = [];
    /** Vnode栈 */
    targets: any[] = [];
    /** innerText栈 */
    text = "";
    /** 引号栈 */
    quote = "";
    /**
     * 扫描html文本转化为Vnode
     * @param html html文本
     */
    constructor(html: string) {
        this.html = html;
        this.targets.push({ children: this.vnode }); // 初始片段
        while (this.html) {
            this.organizeTag();
        }
        this.textContent();
    }
    /** 提取节点名 */
    organizeTag() {
        if (!this.quote && this.html[0] === "<") {
            if (this.html.startsWith(`</${this.tagNames.reduce((s, d) => s = d, <any>undefined)}`)) {
                // 闭合标签
                this.textContent();
                this.html = this.html.replace(new RegExp(`^</${this.tagNames.reduce((s, d) => s = d, <any>undefined)}>`), "");
                this.popNode();
            } else {
                // 节点开始标记
                this.removeScanned();
                if (this.html.startsWith("!-- ")) {
                    this.html = this.html.replace(/^!--[\S\s]+?-->/, "");
                }
                if (/^[a-zA-Z]/.test(this.html)) {
                    this.textContent()
                    const func: (() => void)[] = []; // 操作栈
                    let stop = false; // 循环退出标记
                    // 合法节点名
                    for (this.pos = 0; this.pos < this.html.length; this.pos++) {
                        if (stop) {
                            this.pos--;
                            break;
                        }
                        switch (this.html[this.pos]) {
                            case " ":
                            case "\r":
                            case "\n": // 含属性节点
                                func.push(() => this.organizeProp());
                                stop = true;
                                break;
                            case ">": // 无属性节点
                                this.html[this.pos - 1] === "/" ? func.push(() => this.popNode()) : func.push(() => this.tagSingle());
                                stop = true;
                                break;
                        }
                    }
                    const tagName = this.html.substring(0, this.pos); // 提取节点名
                    const tag = new Vnode(tagName); // 添加Vnode模板
                    this.tagNames.push(tagName); // 节点名压栈
                    this.targets.reduce((s, d) => s = d, <any>undefined).children.push(tag); // Vnode上树
                    this.targets.push(tag); // Vnode压栈
                    this.removeScanned(this.pos + 1);
                    func.forEach(d => d()); // 操作栈：属性处理/出栈
                }
            }
        }
        else {
            // 处理TextContent有字符串形式的节点问题
            switch (this.html[0]) {
                case "'": !this.quote ? this.quote = "'" : (this.quote === "'" && (this.quote = ""));
                    break;
                case '"': !this.quote ? this.quote = '"' : (this.quote === '"' && (this.quote = ""));
                    break;
                case '`': !this.quote ? this.quote = '`' : (this.quote === '`' && (this.quote = ""));
                    break;
            }
            this.text += this.html[0]; // 记录TextContent
            this.removeScanned();
        }
    }
    /** 提取属性 */
    organizeProp() {
        let value = false; // 属性内部标记
        let stop = false; // 循环退出标记
        let start = 0; // 属性起点
        let popd = false; // 是否出栈
        for (this.pos = 0; this.pos < this.html.length; this.pos++) {
            if (stop) break;
            switch (this.html[this.pos]) {
                case '"': value = !value; // 进出属性内部
                    break;
                case " ": if (!value) { // 忽略属性值内部
                    const str = this.html.substring(start, this.pos).replace(/\r|\n|"/g, "").replace(/^ +/, "");
                    const prop = str.split("=");
                    const key = <string>prop.shift();
                    key && key !== "/" && (this.targets.reduce((s, d) => s = d, <any>undefined).props[key] = prop.join("=") || key);
                    start = this.pos;
                }
                    break;
                case ">": if (!value) { // 忽略属性值内部
                    stop = true;
                    const str = this.html.substring(start, this.pos).replace(/\r|\n|"/g, "").replace(/^ +/, "");
                    const prop = str.split("=");
                    const key = <string>prop.shift();
                    key && key !== "/" && (this.targets.reduce((s, d) => s = d, <any>undefined).props[key] = prop.join("=") || key);
                    if (this.html[this.pos - 1] === "/") {
                        this.popNode();
                        popd = true;
                    }
                }
                    break;
            }
        }
        if (!popd) this.tagSingle(); // 出栈检查
        this.removeScanned(this.pos--)
    }
    /** 出栈检查 空元素直接出栈*/
    tagSingle() {
        switch (this.tagNames.reduce((s, d) => s = d, <any>undefined)) {
            case "area":
            case "base":
            case "br":
            case "col":
            case "colgroup":
            case "command":
            case "embed":
            case "hr":
            case "img":
            case "input":
            case "keygen":
            case "link":
            case "meta":
            case "param":
            case "path": // svg专属
            case "source":
            case "track":
            case "wbr": this.popNode();
                break;
        }
    }
    /** 节点出栈 */
    popNode() {
        this.tagNames.splice(this.tagNames.length - 1, 1); // 节点名出栈
        this.targets.splice(this.targets.length - 1, 1); // Vnode出栈
        this.text = ""; // 标签闭后合重置TextContent
    }
    /** 移除已扫描字符长度 默认1位 */
    removeScanned(length = 1) {
        this.html = this.html.slice(length);
    }
    /** 处理TextContent */
    textContent() {
        const text = this.text.replace(/\r|\n| /g, ""); //  过滤空字符
        if (text) { // 有效TextContent
            const tag = new Vnode("text");
            tag.text = this.text;
            this.targets.reduce((s, d) => s = d, <any>undefined).children.push(tag);
        }
        this.text = ""; // 新节点伊始，重置TextContent
    }
}
/**
 * html => vnode  
 * @param html html字符串
 * @returns vnode映射
 */
export function htmlVnode(html: string) {
    return new Scanner(html).vnode;
}