import { TextFormatAlign } from "./TextFormatAlign";

/**
 * TextFormat 类描述字符格式设置信息。使用 TextFormat 类可以为文本字段创建特定的文本格式。您可以将文本格式应用于静态文本字段和动态文本字段。TextFormat 类的属性适用于设备字体和嵌入字体。不过，对于嵌入字体，粗体和斜体文本实际上需要特定字体。如果要使用嵌入字体来显示粗体或斜体文本，则需要嵌入该字体的粗体和斜体变体。  
 * 必须先使用构造函数 new TextFormat() 创建 TextFormat 对象，才能设置该构造函数的属性。在使用 TextField.defaultTextFormat 属性或 TextField.setTextFormat() 方法对文本字段应用 TextFormat 对象时，将只应用该对象的已定义的属性。在向 TextField 添加文本前，请使用 TextField.defaultTextFormat 属性应用格式，在向 the TextField 添加文本后，请使用 setTextFormat() 方法添加格式。默认情况下，TextFormat 属性为 null，因为如果没有提供属性值，Flash Player 将使用自己的默认格式设置。Flash Player 用于各个属性的默认格式（如果属性的值为 null）如下所示：
 * | align | blockIndent | bold | bullet | color | font | indent | italic | kerning | leading | leftMargin | letterSpacing | rightMargin | size | tabStops | target | underline | url |
 * | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
 * | left | 0 | false | false | 0x000000 | Times New Roman | 0 | false | false | 0 | 0 | 0 | 0 | 25 | [] | "" | false | "" |
 * 
 * 各个属性的默认格式设置在各自的说明中也有所描述。
 */
export class TextFormat {
    /** 表示块缩进，以像素为单位。块缩进应用于整个文本块，即文本的所有行。而普通缩进 (TextFormat.indent) 只影响各段的第一行。如果此属性为 null，则 TextFormat 对象不指定块缩进（块缩进为 0）。 */
    blockIndent?: number;
    /** 表示文本为带项目符号的列表的一部分。在带项目符号的列表中，文本的各段都是缩进的。项目符号显示在各段第一行的左侧。默认值为 null，这意味着不使用带项目符号的列表。 */
    bullet?: boolean;
    /**
     * 一个布尔值，表示是启用 (true) 还是禁用 (false) 字距调整。通过字距调整可为了提高可读性而调整某些字符对之间的像素，并且只在需要时（如使用大字体标题时）使用字距调整。仅嵌入字体支持字距调整。  
     * 某些字体（如宋体）和等宽字体（如 Courier New）不支持字距调整。  
     * 默认值为 null，这意味着没有启用字距调整。
     */
    kerning?: boolean;
    /** 一个数字，表示在所有字符之间均匀分配的空间量。该值指定在每个字符之后添加到进距的像素数。默认值为 null，这意味着使用的字母间距为 0 个像素。可以使用十进制值，如 1.75。 */
    letterSpacing?: number;
    /** @deprecated 将自定义 Tab 停靠位指定为一个非负整数的数组。指定每个 Tab 停靠位，以像素为单位。如果没有指定自定义 Tab 停靠位 (null)，则默认的 Tab 停靠位为 4（平均字符宽度）。 */
    tabStops?: number[];
    constructor(
        /** 使用此文本格式的文本的字体名称，以字符串形式表示。 */
        public font = 'Times New Roman',
        /** 使用此文本格式的文本的大小（以像素为单位）。 */
        public size = 25,
        /** 表示文本的颜色。 */
        public color = 0x000000,
        /** 指定文本是否为粗体字。 */
        public bold = false,
        /** 表示使用此文本格式的文本是否为斜体。 */
        public italic = false,
        /** 表示使用此文本格式的文本是带下划线 (true) 还是不带下划线 (false)。 */
        public underline = false,
        /** 表示使用此文本格式的文本的目标 URL。 */
        public url = '',
        /** 表示显示超链接的目标窗口。 */
        public target = '',
        /** 表示段落的对齐方式。 */
        public align = TextFormatAlign.LEFT,
        /** 段落的左边距，以像素为单位。 */
        public leftMargin = 0,
        /** 段落的右边距，以像素为单位。 */
        public rightMargin = 0,
        /** 表示从左边距到段落中第一个字符的缩进。 */
        public indent = 0,
        /** 一个整数，表示行与行之间的垂直间距（称为前导）量。 */
        public leading = 0,
    ) { }
}