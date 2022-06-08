interface modules {
    readonly "setting.html": string;
}
namespace API {
    /** 设置项菜单名称，注册新设置菜单时请拓展本接口 */
    interface MenuName {
        common: "通用";
        danmaku: "弹幕";
        download: "下载";
        rewrite: "重构";
        live: "直播";
        restore: "修复";
        player: "播放";
        style: "样式";
    }
    /** 设置菜单 */
    interface Menu<T extends keyof MenuName> {
        /** 主键 */
        key: T;
        /** 名称 */
        name: MenuName[T];
        /** 图标（svg格式） */
        svg?: string;
    }
    /** 设置项组合 此类设置将单独归组，所有组员将以组长属性形式存储 */
    export interface SettingList {
        /** 主键 */
        key: keyof config;
        /** 设置项类型 */
        type: "list";
        /** 所属菜单 */
        menu: keyof MenuName;
        /** 设置列表 */
        list: (SettingL[keyof SettingL])[];
        /** 组合名称 */
        name: string;
    }
    interface SettingO {
        /** 名称 */
        label: string;
        /** 图标 */
        svg?: string;
        /** 副标题 */
        sub?: string;
        /** 浮动信息 */
        float?: string;
    }
    /** 通用设置内容，用于继承 */
    interface SettingConfig extends SettingO {
        /** 主键 */
        key: keyof config;
        /** 所属菜单 */
        menu: keyof MenuName;

    }
    interface SettingN extends SettingO {
        /** 主键 */
        key: string;
    }
    /** 设置项配置 */
    interface Setting {
        /** 开关 */
        switch: SettingConfig & {
            /** 设置项类型 */
            type: "switch";
            /** 默认值 */
            value: boolean;
            callback?: (v: boolean) => void
        };
        /** 复选 */
        checkbox: SettingConfig & {
            /** 设置项类型 */
            type: "checkbox";
            /** 默认值 */
            value: string[];
            /** 候选值 */
            candidate: string[];
            callback?: (v: boolean) => void
        };
        /** 按钮 */
        button: SettingConfig & {
            /** 设置项类型 */
            type: "button";
            /** 点击回调 */
            value: () => void;
            /** 按钮标题 */
            button?: string;
        };
        /** 单选 */
        select: SettingConfig & {
            /** 设置项类型 */
            type: "select";
            /** 默认值 */
            value: string;
            /** 候选值 */
            candidate: string[];
            /** 候选值对应的样式 */
            styles?: Record<string, string>
            callback?: (v: string) => void
        };
        /** 滑动条 */
        slider: SettingConfig & {
            /** 设置项类型 */
            type: "slider";
            /** 默认值 ∈ [min, max] */
            value: number;
            /** 最小值 默认0 */
            min?: number;
            /** 最大值 默认100 */
            max?: number;
            /** 刻度数 默认100 */
            precision?: number;
            /** 变动时显示当前值 默认真 */
            hint?: boolean;
            callback?: (v: number) => void
        };
        /** 输入框 */
        input: SettingConfig & {
            /** 设置项类型 */
            type: "input";
            /** 默认值 */
            value?: string;
            /** 候选值 可作为提示 */
            candidate?: string[];
            /** 输入框（HTMLInputElement）属性 */
            props?: HTMLInputAttribudeMap;
            callback?: (v: string | FileList) => void
        };
    }
    interface SettingL {
        /** 开关 */
        switch: SettingN & {
            /** 设置项类型 */
            type: "switch";
            /** 默认值 */
            value: boolean
            callback?: (v: boolean) => void
        };
        /** 复选 */
        checkbox: SettingN & {
            /** 设置项类型 */
            type: "checkbox";
            /** 默认值 */
            value: string[];
            /** 候选值 */
            candidate: string[];
            callback?: (v: boolean) => void
        };
        /** 按钮 */
        button: SettingN & {
            /** 设置项类型 */
            type: "button";
            /** 点击回调 */
            value: () => void;
            /** 按钮标题 */
            button?: string;
        };
        /** 单选 */
        select: SettingN & {
            /** 设置项类型 */
            type: "select";
            /** 默认值 */
            value: string;
            /** 候选值 */
            candidate: string[];
            /** 候选值对应的样式 */
            styles?: Record<string, string>;
            callback?: (v: string) => void;
        };
        /** 滑动条 */
        slider: SettingN & {
            /** 设置项类型 */
            type: "slider";
            /** 默认值 ∈ [min, max] */
            value: number;
            /** 最小值 默认0 */
            min?: number;
            /** 最大值 默认100 */
            max?: number;
            /** 刻度数 默认100 */
            precision?: number;
            /** 变动时显示当前值 默认真 */
            hint?: boolean;
            callback?: (v: number) => void
        };
        /** 输入框 */
        input: SettingN & {
            /** 设置项类型 */
            type: "input";
            /** 默认值 */
            value?: string;
            /** 候选值 可作为提示 */
            candidate?: string[];
            /** 输入框（HTMLInputElement）属性 */
            props?: HTMLInputAttribudeMap;
            callback?: (v: string | FileList) => void
        };
    }
    /** 设置菜单栈 */
    const MENU: Menu<keyof MenuName>[] = [];
    /** 设置项栈 */
    const SETTING: (Setting[keyof Setting] | SettingList)[] = [];
    /**
     * 注册设置菜单
     * @param mus 设置菜单
     */
    export function registerMenu(mus: Menu<keyof MenuName> | Menu<keyof MenuName>[]) {
        const arr = isArray(mus) ? mus : [mus];
        arr.forEach(d => MENU.push(d));
    }
    /** 用于初始化设置时临时禁用回调的标记 */
    let disableSettingCallback = false;
    /**
     * 注册设置项
     * @param sets 设置项（组）
     */
    export function registerSetting(sets: (Setting[keyof Setting] | SettingList) | (Setting[keyof Setting] | SettingList)[]) {
        disableSettingCallback = true;
        const arr = isArray(sets) ? sets : [sets];
        arr.forEach(d => {
            let tag = false;
            if (d.type !== "list") {
                Reflect.has(config, d.key) && (d.value = Reflect.get(config, d.key));
                d = new Proxy(d, {
                    set: (t, p, v, r) => {
                        if (p === "value") {
                            if (!tag) {
                                (<any>config)[d.key] = v;
                                return true;
                            }
                            tag = false;
                            disableSettingCallback || ((<any>t).callback && Promise.resolve().then(() => (<any>t).callback(v)));
                        }
                        return Reflect.set(t, p, v, r);
                    }
                });
                // 先赋值再修改才能枚举到哦~
                (<any>config)[d.key] = d.value;
                Object.defineProperty(config, d.key, {
                    set: v => {
                        tag = true;
                        (<any>d).value = v;
                    },
                    get: () => (<any>d).value
                });
            } else {
                const obj = Reflect.has(config, d.key) && JSON.parse(JSON.stringify(config[d.key]));
                const bak: any = {};
                (<any>config)[d.key] = new Proxy(bak, {});
                d.list.forEach((t, i, a) => {
                    obj && obj[t.key] && (t.value = obj[t.key]);
                    a[i] = new Proxy(t, {
                        set: (t, p, v, r) => {
                            if (p === "value") {
                                if (!tag) {
                                    (<any>config)[d.key][t.key] = v;
                                    return true
                                }
                                tag = false;
                                disableSettingCallback || ((<any>t).callback && Promise.resolve().then(() => (<any>t).callback(v)));
                            }
                            return Reflect.set(t, p, v, r);
                        }
                    });
                    bak[t.key] = a[i].value;
                    Object.defineProperty(bak, t.key, {
                        get: () => a[i].value,
                        set: v => {
                            tag = true;
                            a[i].value = v;
                        }
                    });
                    (<any>config)[d.key][t.key] = t.value;
                });
            }
            SETTING.push(d);
        });
        disableSettingCallback = false;
    }
    /**
     * 获取设置项，用于修改设置项`value`以外的属性
     * @param key 设置项的key，如果是组合设置，格式是`组合key.组员key`
     */
    export function getSetting<T extends keyof Setting>(key: string) {
        const arr = key.split(".");
        let rsa = <Setting[T]>SETTING.find(d => d.key === arr[0]);
        if (arr[1] && (<any>rsa).list) {
            rsa = <any>(<any>rsa).list.find((d: any) => d.key === arr[1]);
        }
        return rsa;
    }
    /** 设置界面 */
    class BilibiliOld extends HTMLElement {
        /** 跟节点 */
        _box: HTMLDivElement;
        /** 标题栏 */
        _tool: HTMLDivElement;
        /** 关闭按钮 */
        _close: HTMLDivElement;
        /** 菜单栏 */
        _menu: HTMLDivElement;
        /** 项目栏 */
        _item: HTMLDivElement;
        constructor() {
            super();
            const root = this.attachShadow({ mode: "closed" });
            root.appendChild(createElements(htmlVnode(getModule("setting.html"))));
            this._box = <HTMLDivElement>root.children[0];
            this._tool = <HTMLDivElement>root.children[0].children[0];
            this._close = <HTMLDivElement>root.children[0].children[0].children[0];
            this._menu = <HTMLDivElement>root.children[0].children[1].children[0].children[0];
            this._item = <HTMLDivElement>root.children[0].children[1].children[0].children[1];
            this._close.appendChild(createElements(htmlVnode(getModule("fork.svg"))));
            this._close.addEventListener("click", () => this._box.removeAttribute("style"));
            document.body.appendChild(this);
            disableSettingCallback = true;
            this.initMenu();
            disableSettingCallback = false;
        }
        /** 菜单栈 */
        MENU: Record<keyof MenuName, HTMLDivElement> = <any>{};
        /** 页面栈 */
        ITEM: Record<keyof MenuName, HTMLDivElement> = <any>{};
        /** 初始化菜单 */
        initMenu() {
            this._menu.replaceChildren();
            MENU.forEach(d => {
                const menuitem = this._menu.appendChild(<HTMLDivElement>createElement(htmlVnode(
                    `<div class="menuitem">${(d.svg ? `<div class="icon">${d.svg}</div>` : "") + d.name}</div>`
                )[0]));
                this.MENU[d.key] = menuitem;
                menuitem.addEventListener("click", () => { this.menuSelect(d.key) });
                this.ITEM[d.key] = this._item.appendChild(<HTMLDivElement>createElement(htmlVnode(
                    `<div class="item${d.key}">
                        <div class="contain1">
                            <div class="header">
                                <h2 class="title">${d.name}</h2>
                            </div>
                        </div>
                        <div class="card"></div>
                    </div>`
                )[0]));
            });
            this.initItem();
        }
        /** 当前菜单 */
        _menuNow?: HTMLDivElement;
        /** 当前页面 */
        _itemNow?: HTMLDivElement;
        /** 菜单选择 */
        menuSelect(key: keyof MenuName = "common") {
            this._menuNow?.classList.remove("selected");
            this._menuNow?.removeAttribute("style");
            this._menuNow = this.MENU[key];
            this.MENU[key].classList.add("selected");
            this._itemNow?.removeAttribute("style");
            this._itemNow = this.ITEM[key];
            this.ITEM[key].setAttribute("style", `display: block;`);
        }
        /**
         * 呼出设置界面
         * @param key 设置项，直达对应设置项
         */
        show(key?: keyof config) {
            this._box.setAttribute("style", "display: block;");
            this.menuSelect(this.SETTING[<keyof config>key]);
            key && this._itemNow?.querySelector(`.${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        /** 设置项菜单对应表 */
        SETTING: Record<keyof config, keyof MenuName> = <any>{};
        /** 初始化页面 */
        initItem() {
            SETTING.forEach(d => {
                this.SETTING[d.key] = d.menu;
                if (d.type === "list") {
                    const node = <HTMLDivElement>this.ITEM[d.menu];
                    node.appendChild(createElements(htmlVnode(
                        `<div class="contain1 ${d.key}">
                            <div class="header">
                                <h2 class="title">${d.name}</h2>
                            </div>
                        </div>
                        <div class="card"></div>`
                    )));
                    d.list.forEach(t => {
                        this.SETTING[<keyof config>`${d.key}-${t.key}`] = d.menu;
                        this.appendItem(<HTMLDivElement>node.lastChild, <any>t, d.key);
                    });
                }
                else {
                    this.appendItem(this.ITEM[d.menu].children[1], d);
                }

            })
        }
        /**
         * 添加设置项
         * @param node 父节点
         * @param set 设置项
         * @param str 组合key
         */
        appendItem(node: Element, set: Setting[keyof Setting], str?: string) {
            const part = node.appendChild(<HTMLDivElement>createElement(htmlVnode(
                `<div class="contain2 ${(str ? `${str}-` : "") + set.key}">${set.svg ? `<div class="icon">${set.svg}</div>` : ""}
            <div class="label">${set.label + (set.sub ? `<div class="sub">${set.sub}</div>` : "")}</div>
            <div class="value"></div></div>`
            )[0]));
            switch (set.type) {
                case "button": part.classList.add("button");
                    (<HTMLDivElement>part.lastChild).appendChild(new PushButton(set));
                    break;
                case "checkbox": part.classList.add("checkbox");
                    const checkbox = addElement("div", undefined, <HTMLDivElement>part.lastChild);
                    set.candidate.forEach(t => {
                        checkbox.appendChild(new Checkbox(new Proxy({ label: t, value: set.value.includes(t) }, {
                            set: (tar, ppt, val, rcv) => {
                                if (ppt === "value") {
                                    if (val) {
                                        set.value.includes(t) || set.value.push(t);
                                    } else {
                                        const i = set.value.indexOf(t);
                                        i >= 0 && set.value.splice(i, 1);
                                    }
                                    saveConfig();
                                }
                                return Reflect.set(tar, ppt, val, rcv);
                            }
                        })))
                    });
                    break;
                case "input": part.classList.add("input");
                    (<HTMLDivElement>part.lastChild).appendChild(new InputArea(set));
                    break;
                case "select": part.classList.add("select");
                    (<HTMLDivElement>part.lastChild).appendChild(new SelectMenu(set));
                    break;
                case "slider": part.classList.add("slider");
                    (<HTMLDivElement>part.lastChild).appendChild(new SliderBlock(set));
                    break;
                case "switch": part.classList.add("switch");
                    (<HTMLDivElement>part.lastChild).appendChild(new ButtonSwitch(set));
                    break;
            }
            set.float && new FloatQuote(part, set.float);
        }
    }
    customElements.define("bilibili-old", BilibiliOld);
    let node: BilibiliOld
    /**
     * 显示设置界面
     * @param key 设置项主键，将直达指定设置。组合设置项请使用 组名key-组员key 格式
     */
    export function showSetting(key?: keyof config) {
        node || (node = new BilibiliOld());
        document.body.contains(node) || document.body.appendChild(node);
        node.show(key);
    }
}