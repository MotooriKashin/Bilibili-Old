interface modules {
    /** 设置数据处理 */
    readonly "config.js": string;
}
/** 
 * 设置接口，包含`value`值的设置项可以key: value格式存储。
 * 添加设置项时请拓展本接口定义以说明该设置项。
 */
interface config {
    /** 开发者模式 */
    developer: boolean;
}
/** 设置项分类名称，注册新设置分类时请拓展本接口 */
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
namespace API {
    /** 设置分类 */
    interface Menu<T extends keyof MenuName> {
        /** 主键 */
        key: T;
        /** 名称 */
        name: MenuName[T];
        /** 图标（svg格式） */
        svg?: string;
    }
    /** 通用设置内容，用于继承 */
    interface SettingCommon {
        /** 主键：请拓展config声明` */
        key: keyof config;
        /** 分类。新建分类请通过`registerMenu` */
        sort: keyof MenuName;
        /** 图标（svg格式） */
        svg?: string;
        /** 标题 */
        label: string;
        /** 副标题 */
        sub?: string;
        /** 浮动信息（html编码） */
        float?: string;
        /** 设置面板被呼出时的回调，可用于调整显示 */
        callback?: (this: HTMLDivElement) => void;
        /** 隐藏本设置项 */
        hidden?: boolean;
        /** 设置初始化时执行的回调 */
        init?: () => void;
    }
    export interface SettingType {
        switch: SettingCommon & {
            /** 开关类设置 */
            type: "switch";
            /** 默认值 */
            value: boolean;
            /** 用户拨动开关时的回调，第一个参数为调整后的value */
            action?: (value: Boolean) => void;
        }
        row: SettingCommon & {
            /** 下拉框类设置 */
            type: "row";
            /** 默认值 */
            value: string | number;
            /** 下拉表值组 */
            list: (string | number)[];
            /** 用户下拉取值后的回调函数，第一个参数为调整后的value */
            action?: (value: string) => void
        }
        action: SettingCommon & {
            /** 按钮类设置 */
            type: "action";
            /** 按钮名称 */
            title: string;
            /** 按下回调 */
            action: () => void;
            /** 按钮CD：/秒，默认3秒，0表示只能按下一次 */
            disabled?: number;
        }
        input: SettingCommon & {
            /** 输入框型设置 */
            type: "input";
            /** 输入框（input标签）的属性 */
            input: input;
            /** 确认输入后的回调 */
            action?: (value: string) => void;
            /** 按钮名字，缺省表示无需按钮 */
            title?: string;
            /** 默认值 */
            value?: string | number;
            /** 非法输入检测正则 */
            pattern?: RegExp;
            /** 按钮CD：/秒，默认3秒，0表示只能按下一次 */
            disabled?: number;
        }
        file: SettingCommon & {
            /** 文件选择按钮 */
            type: "file";
            /** 按钮名称 */
            title: string;
            /** 拓展名列表，如`.txt`，缺省表示不限 */
            accept?: string[];
            /** 是否多选 */
            multiple?: boolean;
            /** 选好文件后回调 */
            action: (files: FileList) => void
        }
        mutlti: SettingCommon & {
            /** 复选框类设置 */
            type: "mutlti";
            /** 默认值表，list的子集 */
            value: string[];
            /** 候选值表，value的超集 */
            list: string[];
            /** 用户调整选择后回调 */
            action?: (value: string[]) => void
        }
        sort: SettingCommon & {
            /** 分组类设置，可收纳一组设置 */
            type: "sort";
            /** 分组名 */
            label: string;
            /** 组员 */
            list: SettingType[keyof SettingType][];
        }
        custom: SettingCommon & {
            /** 自定义设置 */
            type: "custom";
            /** 自定义html内容 */
            custom: string;
            /** 设置面板被呼出时的回调，可用于调整显示 */
            flesh?: (obj: SettingType["custom"]) => void;
        }
        picture: Omit<SettingCommon, "label"> & {
            /** 图片类设置 */
            type: "picture";
            /** 图片链接 */
            src: string;
        }
        icon: Omit<SettingCommon, "label" | "sort" | "key"> & {
            /** 图标类设置，类似于右上角的叉 */
            type: "icon";
            /** 提示 */
            title: string;
            /** 点击回调 */
            action: (node: HTMLDivElement) => void;
        }
    }
    /** 输入框（input标签）属性 */
    export interface input {
        /** 文件类型：`type="file"`限定。如：`audio/*` `video/*` `image/*` `MIME_type` */
        accept?: string;
        /** 图片加载时的展示文字，`type="image`限定 */
        alt?: string;
        /** 自动完成输入 */
        autocomplete?: "on" | "off";
        /** 自动焦点 */
        autofocus?: "autofocus";
        /** 自动选中，`type="checkbox" | "radio"`限定 */
        checked?: "checked";
        /** 是否禁用 */
        disabled?: "disabled";
        /** 所属表单节点，以逗号分隔 */
        form?: string;
        /** 表单提交URL，`type="submit" | "image"`限定 */
        formaction?: string;
        /** 表单数据编码，`type="submit" | "image"`限定 */
        formenctypeNew?: string;
        /** 表单提交请求的HTTP方法，`type="submit" | "image"`限定 */
        formmethod?: "GET" | "POST";
        /** 覆盖表单节点的`novalidate`属性 */
        formnovalidate?: "formnovalidate";
        /** 表单处理者，内置值或者表单节点的`framename` */
        formtarget?: "_blank" | "_self" | "_parent" | "_top" | string;
        /** 节点高度：/px，`type="image"`限定 */
        height?: number;
        /** 绑定的<datalist>节点的id */
        list?: string;
        /** 输入上限 */
        max?: number | string;
        /** 输入字符数目上限 */
        maxlength?: number;
        /** 输入下限 */
        min?: number | string;
        /** 多选，`type="file" | "email"`限定 */
        multiple?: "multiple";
        /** 名称 */
        name?: string;
        /** 提示 */
        placeholder?: string;
        /** 只读 */
        readonly?: "readonly";
        /** 禁止空提交 */
        required?: "required";
        /** 节点尺寸，`type="image"`限定 */
        size?: number;
        /** 按钮图片src，`type="image"`限定 */
        src?: string;
        /** 最小单位值 */
        step?: number;
        /** 输入框类型 */
        type?: "button" | "checkbox" | "color" | "date" | "datetime" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week"
        /** 元素的宽度：/px，`type="image"`限定 */
        width?: number;
    }
    /** 设置接口，包含`value`值的设置项可以key: value格式获取 */
    export const config = new Proxy(GM.getValue<config>("config", <config>{}), {
        // 修改设置立即存储
        set: (t, p: keyof config, v) => {
            Reflect.set(t, p, v);
            GM.setValue<Record<string, any>>("config", t);
            return true;
        }
    });
    /** 设置分类栈 */
    const MENU: Record<keyof MenuName, Menu<keyof MenuName>> = <any>{};
    /** 设置栈 */
    const SETTING: SettingType[keyof SettingType][] = [];
    /**
     * 注册设置项
     * @param obj 设置项
     */
    export function registerSetting(obj: SettingType[keyof SettingType]) {
        SETTING.push(obj);
        modifyConfig(obj);
    }
    /**
     * 初始化默认值
     * @param obj 设置项
     */
    function modifyConfig(obj: SettingType[keyof SettingType]) {
        try {
            Reflect.has(obj, "value") && !Reflect.has(config, Reflect.get(obj, "key")) && (Reflect.set(config, Reflect.get(obj, "key"), Reflect.get(obj, "value")), obj.init && obj.init());
            obj.type == "sort" && obj.list && obj.list.forEach(d => { modifyConfig(d) });
        } catch (e) {
            debug.warn(`UI设置项注册错误！`, obj);
        }
    }
    /**
     * 注册设置分类
     * @param obj 设置分类
     */
    export function registerMenu(obj: Menu<keyof MenuName>) {
        MENU[obj.key] = obj;
    }
    /**
     * 显示/隐藏设置项
     * @param mode 设置项主键: 是否隐藏
     */
    export function changeSettingMode(mode: Record<string, boolean>) {
        const keys = Object.keys(mode);
        SETTING.forEach(d => {
            Reflect.has(d, "key") && keys.includes(Reflect.get(d, "key")) && (d.hidden = mode[Reflect.get(d, "key")]);
        })
    }
    registerMenu({ key: "common", name: "通用", svg: '<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>' });
    registerMenu({ key: "rewrite", name: "重构", svg: `<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>` });
    registerMenu({ key: "danmaku", name: "弹幕", svg: `<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>` });
    registerMenu({ key: "restore", name: "修复", svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>` });
    registerMenu({ key: "player", name: "播放", svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>` });
    registerMenu({ key: "style", name: "样式", svg: `<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>` });
    registerMenu({ key: "live", name: "直播", svg: `<svg viewBox="0 0 1024 1024"><path d="M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0"></path><path d="M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512"></path><path d="M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504"></path></svg>` });
    registerMenu({ key: "download", name: "下载", svg: `<svg viewBox="0 0 24 24"><g><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>` });
    registerSetting({
        key: "developer",
        sort: "common",
        label: "开发者模式",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g></svg>',
        type: "switch",
        value: false,
        float: `启用开发者模式，暴露顶层命名空间API到全局以便于调试。`,
        sub: "暴露API到window",
        action: v => {
            v ? (!window.API && (window.API = API)) : (window.API && Reflect.deleteProperty(window, "API"));
        }
    })
    config.developer && (window.API = API); // 开发者模式
    window.top === window.self && importModule("ui.js", { MENU, SETTING }); // 绘制设置UI
}