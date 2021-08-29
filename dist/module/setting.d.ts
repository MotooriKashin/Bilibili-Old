/**
 * 已注册的菜单，通过`registerMenu`新建项请补充这里的可能值
 * **本变量仅作为类型声明接口类似的东西存在，不可参与到任何实际运行代码中！**
 */
declare const settingSort: "common" | "rewrite" | "restore" | "style" | "danmaku" | "player" | "live";
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
    /**
     * 所依赖的模块名称（带拓展名）
     * `value`为true时脚本会基于此提前从服务器获取模块到本地
     */
    depends?: string[];
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
    action?: (value: string) => void;
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
    action: () => void;
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
    action: (files: FileList) => void;
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
    action?: (value: string[]) => void;
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
    type?: "button" | "checkbox" | "color" | "date" | "datetime" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";
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
    list: (ItemPic | ItemSwh | ItemSor | ItemRow | ItemPus | ItemIpt | ItemFie | ItemMut | ToolIcon)[];
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
