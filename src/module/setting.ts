/**
 * 本模块负责集中注册相关设置项
 */
(function () {
    // 注册设置菜单
    API.registerMenu({ key: "common", name: "通用", svg: '<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>' });
    API.registerMenu({ key: "rewrite", name: "重写", svg: `<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>` });
    API.registerMenu({ key: "restore", name: "修复", svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>` });
    API.registerMenu({ key: "style", name: "样式", svg: `<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>` });
    API.registerMenu({ key: "danmaku", name: "弹幕", svg: `<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>` });
    API.registerMenu({ key: "player", name: "播放", svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>` });
    API.registerMenu({ key: "live", name: "直播", svg: `<svg viewBox="0 0 1024 1024"><path d="M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0"></path><path d="M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512"></path><path d="M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504"></path></svg>` });

    // 注册设置项
    API.registerSetting({
        key: "developer",
        sort: "common",
        label: "开发者模式",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g></svg>',
        type: "switch",
        value: false,
        float: '开发者模式将暴露核心变量 <b>API</b> 到页面顶级对象 window，可以借此在控制台调试部分功能。',
        sub: '暴露 API 到 window',
        action: (value) => {
            value ? (!(<any>window).API && ((<any>window).API = API)) : ((<any>window).API && delete (<any>window).API)
        }
    })
    API.registerSetting({
        key: "localModule",
        sort: "common",
        label: "安装本地模块",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>',
        type: 'file',
        title: '选择',
        accept: [".js", ".css", ".json"],
        multiple: true,
        depends: ["manage.js"],
        float: '从本地磁盘安装脚本的模块文件（编码格式utf-8），包括js、css和json。</br>js/css文件将直接以文本形式保存，可通过使用`API.getMoudle`方法以文件+拓展名形式获取，json则以对象形式保存，可通过`GM.getValue`方法以无拓展名形式获取。</br>※ 本项目以文件名+拓展名索引模块，<strong>切勿添加同名模块！</strong>，以本地方式更新模块除外。',
        action: (files) => {
            API.localModule(files);
        }
    })
})();
/**
 * 已注册的菜单，通过`registerMenu`新建项请补充这里的可能值
 * **本变量仅作为类型声明接口类似的东西存在，不可参与到任何实际运行代码中！**
 */
declare const settingSort: "common" | "rewrite" | "restore" | "style" | "danmaku" | "player" | "live"
/**
 * 已注册设置项
 */
declare namespace config {
    /**
     * 开发者模式
     */
    let developer: boolean;
}
/**
 * 工具栏按钮
 */
interface ToolIcon {
    /**
     * 类型标志，用于识别这是工具栏按钮设置项
     */
    type: "icon";
    /**
     * 按钮 svg 图标字符串
     */
    svg: string;
    /**
     * 鼠标焦点按钮时提示的文字
     */
    title: string;
    /**
     * 鼠标单击时的回调
     */
    action: (node: HTMLDivElement) => void;
    /**
     * 所依赖的模块名称（带拓展名）  
     * 脚本会基于此提前从服务器获取模块到本地  
     */
    depends?: string[];
}
/**
 * 菜单项
 */
interface Menuitem {
    /**
     * 菜单主键（唯一），可以取已有的，也可以自定义
     */
    key: string;
    /**
     * 主键名字，简短的菜单分类名字，与 key 一一对应
     */
    name: string;
    /**
     * 菜单图标 svg 字符串
     */
    svg?: string;
}
/**
 * 图片类菜单项，可以作为banner或者下一项设置的图解说明等
 */
interface ItemPic {
    /**
     * 类型标志，用于识别这是图片类设置项
     */
    type: "picture";
    /**
     * 菜单归属分类菜单，也可以新建
     */
    sort: string;
    /**
     * 图片 URL
     */
    src: string;
}
interface ItemCommon {
    /**
     * 设置唯一主键，将作为全局变量`config`的属性名。  
     * **注意不能与已有设置项重复**
     */
    key: string;
    /**
     * 菜单归属分类菜单  
     * 可以使用已有的，参见`API.settingMenu`  
     * 若要新建，请到`register.ts`中添加，并补充`settingSort`声明的可能值
     */
    sort: typeof settingSort;
    /**
     * 设置 svg 图片
     */
    svg?: string;
    /**
     * 设置内容
     */
    label: string;
    /**
     * 内容附加简短介绍
     */
    sub?: string;
    /**
     * 鼠标移动到设置项时浮动信息，可以详细介绍设置的信息  
     * 该内容可以包含<i>、<strong>等HTML便签用于格式化信息  
     * ※ 理论上支持所有能以<div>为父节点的标签
     */
    float?: string;
    /**
     * 所依赖的模块名称（带拓展名）  
     * 脚本会基于此提前从服务器获取模块到本地  
     */
    depends?: string[]
}
/**
 * 开关类菜单项，用以给用户判断是否开启某些功能等  
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作  
 * 否则可能需要刷新页面才会生效
 */
interface ItemSwh extends ItemCommon {
    /**
     * 类型标志，用于识别这是开关类设置项
     */
    type: "switch";
    /**
     * 设置的值，添加设置项时将作为默认值  
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: boolean;
    /**
     * 点击该设置时的回调函数  
     * 将调整后的`value`作为参数传递  
     * 设置节点本身将作为`this`传递
     */
    action?: (value: Boolean) => void;
}
/**
 * 下拉框类菜单项，用于给用户从多个数值选一个等  
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作  
 * 否则可能需要刷新页面才会生效
 */
interface ItemRow extends ItemCommon {
    /**
     * 类型标志，用于识别这是下拉框类设置项
     */
    type: "row";
    /**
     * 默认取值
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: string;
    /**
     * 下拉框可选值列表
     */
    list: string[];
    /**
     * 改变选值后的回调函数  
     * 将调整后的`value`作为参数传递  
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string) => void
}
/**
 * 按钮设置，用以用户点击按钮执行操作
 * 必须在`action`属性添加回调函数
 */
interface ItemPus extends ItemCommon {
    /**
     * 类型标志，用于识别这是按钮设置项
     */
    type: "action";
    /**
     * 按钮上的文字
     */
    title: string;
    /**
     * 点击按钮执行的回调函数  
     * 设置节点本身将作为this传入
     */
    action: () => void,
    /**
     * 点击按钮后临时禁用按钮多长时间，单位：/s，默认为 3  
     * 0 表示一直禁用直到刷新面板
     */
    disabled?: number;
}
/**
 * 输入框设置项，用以提供一个输入框与用户交互等
 * 需要自行将HTML的`input`标签配置以对象形式写入`input`属性
 */
interface ItemIpt {
    /**
     * 类型标志，用于识别这是输入框设置项
     */
    type: "input";
    /**
     * 菜单归属分类菜单，也可以新建
     */
    sort: string;
    /**
     * 设置 svg 图片
     */
    svg?: string;
    /**
     * 鼠标移动到设置项时浮动信息，可以详细介绍设置的信息  
     * 该内容可以包含<i>、<strong>等HTML便签用于格式化信息  
     * ※ 理论上支持所有能以<div>为父节点的标签
     */
    float?: string;
    /**
     * 输入框前面的文字，用来提示该输入框是干什么的
     */
    label: string;
    /**
     * 用于给`input`标签添加的属性  
     * 请自行通过合适的属性来指定`input`类型及其他要求
     */
    input: input;
    /**
     * 回调函数，用于接受用户输入内容以执行操作  
     * 将输入值作为参数传递  
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string) => void;
    /**
     * 输入框后按钮上的文字
     */
    title?: string;
    /**
     * 设置项主键（唯一），可选  
     */
    key: string;
    /**
     * 默认值，输入框内的默认值
     * 这意味着本设置将保存到本地 config
     */
    value?: string;
    /**
     * 用于判断输入的正则表达式
     */
    pattern?: RegExp;
    /**
     * 点击按钮后临时禁用按钮多长时间，单位：/s，默认为 3  
     * 0 表示一直禁用直到刷新面板
     */
    disabled?: number;
}
/**
 * 文件选择设置项，用于提取本地文件读取等
 */
interface ItemFie extends ItemCommon {
    /**
     * 类型标志，用于识别这是输入框设置项
     */
    type: "file";
    /**
     * 按钮上的文字
     */
    title: string;
    /**
     * 文件拓展名列表：如 `.txt`
     */
    accept?: string[];
    /**
     * 是否允许文件多选
     */
    multiple?: boolean;
    /**
     * 点击按钮执行的回调函数  
     * 设置节点本身将作为this传递
     * 将文件列表`input.files`作为参数传递
     */
    action: (files: FileList) => void
}
/**
 * 多选类菜单项，用以提供一组数据供用户不定多选等  
 * 可以在`action`属性添加回调函数以立即响应用户的开关操作
 * 如果值只有一个等于另一种形式的开关菜单只是回调还是数组  
 * 注意：任意选项改变都会触发回调
 */
interface ItemMut extends ItemCommon {
    /**
     * 类型标志，用于识别这是输入框设置项
     */
    type: "mutlti";
    /**
     * 设置主键（唯一），将作为用户本地设置`config`的属性名称
     */
    key: string;
    /**
     * 默认取值列表
     * 实际时将以用户本地配置`config[key]`为准
     */
    value: string[];
    /**
     * 所有选项列表
     */
    list: string[];
    /**
     * 改变选值后的回调函数  
     * 将调整后的`value`作为参数传递  
     * 设置节点本身将作为`this`传递
     */
    action?: (value: string[]) => void
}
/**
 * input标签的可选属性
 */
interface input {
    /**
     * 选择提交的文件类型，仅限type="file"  
     * `audio/*` `video/*` `image/*` `MIME_type`  
     */
    accept?: string;
    /**
     * 图像输入的替代文本，仅限type="image"
     */
    alt?: string;
    /**
     * 自动完成输入
     */
    autocomplete?: "on" | "off";
    /**
     * 页面加载时自动焦点
     */
    autofocus?: "autofocus";
    /**
     * 页面加载时自动选中，仅限ype="checkbox"或type="radio"
     */
    checked?: "checked";
    /**
     * 禁用输入框
     */
    disabled?: "disabled";
    /**
     * 所属的表单，复数时以逗号间隔
     */
    form?: string;
    /**
     * 提交表单时的URL，仅限type="submit"或type="image"
     */
    formaction?: string;
    /**
     * 表单数据使用的编码，仅限type="submit"或type="image"
     */
    formenctypeNew?: string;
    /**
     * 表单提交使用的HTTP方法，仅限type="submit"或type="image"
     */
    formmethod?: "GET" | "POST";
    /**
     * 覆盖表单标签的`novalidate`属性
     */
    formnovalidate?: "formnovalidate";
    /**
     * 由谁处理表单相应，取值内置关键词或对应的`framename`
     */
    formtarget?: "_blank" | "_self" | "_parent" | "_top" | string;
    /**
     * 元素高度：/px，仅限type="image"
     */
    height?: number;
    /**
     * 绑定的<datalist>元素的id
     */
    list?: string;
    /**
     * 接受输入的最大值
     */
    max?: number | string;
    /**
     * 输入框最大字符数
     */
    maxlength?: number;
    /**
     * 接受输入的最小值
     */
    min?: number | string;
    /**
     * 允许多个输入，仅限type="file"或type="email"
     */
    multiple?: "multiple";
    /**
     * 元素名称
     */
    name?: string;
    /**
     * 输入提示信息
     */
    placeholder?: string;
    /**
     * 只读元素
     */
    readonly?: "readonly";
    /**
     * 禁止空提交
     */
    required?: "required";
    /**
     * 元素可见宽度
     */
    size?: number;
    /**
     * 提交按钮的图片URL
     */
    src?: string;
    /**
     * 输入的合法间隔
     */
    step?: number;
    /**
     * 输入框类型
     */
    type?: "button" | "checkbox" | "color" | "date" | "datetime" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week"
    /**
     * 元素的宽度：/px，仅限type="image"
     */
    width?: number;
}
/**
 * 归档一组设置，这组设置将在点击本条设置后展开  
 * 用于分组一些关联性很强或者同类的设置  
 * 可以看作是在菜单中再分类
 */
interface ItemSor extends ItemCommon {
    /**
     * 类型标志，用于识别这是分组集合设置项
     */
    type: "sort";
    /**
     * 类别名称
     */
    label: string;
    /**
     * 设置组，包含该类下属设置项
     */
    list: (ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon)[]
    ;
}
declare namespace API {
    /**
     * 注册设置项  
     * 脚本内置多种设置模型，用于往脚本设置界面添加设置
     * @param obj 设置对象
     */
    function registerSetting(obj: ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon): void;
    /**
     * 注册设置项所属菜单信息
     * @param obj 用于将设置分类，设置项中sort值即可这里注册的key值
     */
    function registerMenu(obj: Menuitem): void;
}
