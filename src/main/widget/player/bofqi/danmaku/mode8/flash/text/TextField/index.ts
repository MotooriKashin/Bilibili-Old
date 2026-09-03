import { hex8 } from "../../../../../../../../../utils/color";
import { DisplayObject, target } from "../../display/DisplayObject";
import { TextFieldAutoSize } from "../TextFieldAutoSize";
import { TextFormat } from "../TextFormat";
import style from './index.css' with {type: 'css'};

export class TextField extends DisplayObject {
    #autoSize = TextFieldAutoSize.NONE;
    #host = this[target].div.appendChild(document.createElement('pre'));
    get autoSize() {
        return this.#autoSize;
    }
    /**
     * 控制文本字段的自动大小调整和对齐。TextFieldAutoSize 常数的可接受值为 TextFieldAutoSize.NONE（默认值）、TextFieldAutoSize.LEFT、TextFieldAutoSize.RIGHT 和 TextFieldAutoSize.CENTER。  
     * 如果 autoSize 设置为 TextFieldAutoSize.NONE（默认值），则不会进行调整。  
     * 如果 autoSize 设置为 TextFieldAutoSize.LEFT，会将文本视为左对齐文本，这意味着该文本字段的左边距保持固定，在右边可调整单个文本字段行。如果文本中包括换行符（例如 "\n" 或 "\r"），则会另外调整底边来适合文本的下一行。如果 wordWrap 也设置为 true，则仅调整文本字段的底边，而右边距保持固定。  
     * 如果 autoSize 设置为 TextFieldAutoSize.RIGHT，会将文本视为右对齐文本，这意味着该文本字段的右边距保持固定，可在左边调整单个文本字段行。如果文本中包括换行符（例如 "\n" 或 "\r")，则会另外调整底边来适合文本的下一行。如果 wordWrap 也设置为 true，则仅调整文本字段的底边，而左边距保持固定。  
     * 如果 autoSize 设置为 TextFieldAutoSize.CENTER，会将文本视为居中对齐文本，这意味着对单个文本字段行的调整将使其在左右边距间均衡分布。如果文本中包括换行符（例如 "\n" 或 "\r"），则会另外调整底边来适合文本的下一行。如果 wordWrap 也设置为 true，则仅调整文本字段的底边，而左右边距保持固定。
     */
    set autoSize(v) {
        switch (v) {
            case TextFieldAutoSize.CENTER: {
                this.#host.style.textAlign = 'center';
                break;
            }
            case TextFieldAutoSize.LEFT: {
                this.#host.style.textAlign = 'start';
                break;
            }
            case TextFieldAutoSize.NONE: {
                this.#host.style.textAlign = '';
                break;
            }
            case TextFieldAutoSize.RIGHT: {
                this.#host.style.textAlign = 'end';
                break;
            }
        }
    }
    #background = false;
    get background() {
        return this.#background;
    }
    /**
     * 指定文本字段是否具有背景填充。如果为 true，则文本字段具有背景填充。如果为 false，则文本字段没有背景填充。使用 backgroundColor 属性来设置文本字段的背景颜色。  
     * 默认值为 false。
     */
    set background(v) {
        this.#background = v;
        this.#host.style.backgroundColor = v ? hex8(this.#backgroundColor) : '';
    }
    #backgroundColor = 0xFFFFFF;
    get backgroundColor() {
        return this.#backgroundColor;
    }
    /** 文本字段背景的颜色。默认值为 0xFFFFFF（白色）。即使当前没有背景，也可检索或设置此属性，但只有当文本字段已将 background 属性设置为 true 时，才可以看到颜色。 */
    set backgroundColor(v) {
        this.#backgroundColor = v;
        this.background = this.#background; // 触发样式改变
    }
    #border = false;
    get border() {
        return this.#border;
    }
    set border(v) {
        this.#border = v;
        this.#host.style.borderStyle = v ? 'solid' : '';
    }
    #borderColor = 0x000000;
    get borderColor() {
        return this.#borderColor;
    }
    /** 文本字段边框的颜色。默认值为 0x000000（黑色）。即使当前没有边框，也可检索或设置此属性，但只有当文本字段已将 border 属性设置为 true 时，才可以看到颜色。 */
    set borderColor(v) {
        this.#borderColor = v;
        this.#host.style.borderColor = hex8(v);
    }
    /**
     * 一个整数（从 1 开始的索引），表示指定文本字段中当前可以看到的最后一行。可将文本字段看作文本块上的一个窗口。scrollV 属性是此窗口中最顶端可见行的从 1 开始的索引。  
     * 当前可以看到文本字段中 scrollV 和 bottomScrollV 表示的行之间的所有文本。
     */
    get bottomScrollV() {
        const computedStyle = window.getComputedStyle(this.#host);

        // 获取元素内容高度（减去padding和border）
        const height = this.#host.offsetHeight;
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
        const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

        const contentHeight = height - paddingTop - paddingBottom - borderTop - borderBottom;

        // 处理行高
        let lineHeight = computedStyle.lineHeight;
        if (lineHeight === 'normal') {
            const fontSize = parseFloat(computedStyle.fontSize) || 16; // 默认16px字体大小
            lineHeight = fontSize * 1.2 + 'px';
        }
        const lineHeightValue = Math.max(parseFloat(lineHeight) || 0, 1); // 确保行高至少为1px

        // 计算行数，确保至少返回1行
        return Math.ceil(contentHeight / lineHeightValue) || 1;
    }
    /**
     * 插入点（尖号）位置的索引。如果没有显示任何插入点，则在将焦点恢复到字段时，值将为插入点所在的位置（通常为插入点上次所在的位置，如果字段不曾具有焦点，则为 0）。  
     * 选择范围索引是从零开始的（例如，第一个位置为 0、第二个位置为 1，依此类推）。
     */
    get caretIndex() {
        return 0;
    }
    #defaultTextFormat = new TextFormat();
    get defaultTextFormat() {
        return this.#defaultTextFormat;
    }
    /**
     * 指定应用于新插入文本（例如，用户输入的文本或使用 replaceSelectedText() 方法插入的文本）的格式。  
     * **注意**：当选择要替换为 setSelection() 和 replaceSelectedText() 的字符时，仅在选择的文本达到和包括最后字符时才会应用 defaultTextFormat。下面是一个示例：
     * 
     * ```
     * var my_txt:TextField new TextField();
     * my_txt.text = "Flash Macintosh version";
     * var my_fmt:TextFormat = new TextFormat();
     * my_fmt.color = 0xFF0000;
     * my_txt.defaultTextFormat = my_fmt;
     * my_txt.setSelection(6,15); // partial text selected - defaultTextFormat not applied
     * my_txt.setSelection(6,23); // text selected to end - defaultTextFormat applied
     * my_txt.replaceSelectedText("Windows version");
     * ```
     * 
     * 在访问 defaultTextFormat 属性时，返回的 TextFormat 对象已定义了它的所有属性。所有属性都不为 null。  
     * **注意**：如果对文本字段应用了样式表，则不能设置该属性。
     */
    set defaultTextFormat(v) {
        const { font, size, color, bold, italic, underline, align, leftMargin, rightMargin, indent, leading, blockIndent, bullet, kerning, letterSpacing } = this.#defaultTextFormat = v;

        this.#host.style.fontFamily = font;
        this.#host.style.fontSize = `${size}px`;
        this.#host.style.color = hex8(color);
        this.#host.style.fontWeight = bold ? 'bold' : '';
        this.#host.style.fontStyle = italic ? 'italic' : '';
        this.#host.style.textDecoration = underline ? 'underline' : '';
        this.#host.style.textAlign = align;
        this.#host.style.marginInlineStart = leftMargin ? `${leftMargin}px` : '';
        this.#host.style.marginInlineEnd = rightMargin ? `${rightMargin}px` : '';
        this.#host.style.textIndent = indent ? `${indent}em` : '';
        this.#host.style.lineHeight = leading ? <any>leading : '';

        this.#host.style.paddingInlineStart = blockIndent ? `${blockIndent}em` : '';
        this.#host.style.display = bullet ? 'list-item' : '';
        this.#host.style.fontKerning = kerning ? 'normal' : '';
        this.#host.style.letterSpacing = letterSpacing ? `${letterSpacing}px` : '';
    }
    get htmlText() {
        return this.#host.innerHTML;
    }
    /** 包含文本字段内容的 HTML 表示形式。 */
    set htmlText(v) {
        this.#host.innerHTML = v;
    }
    /** 文本字段中的字符数。如 tab (\t) 之类的字符视为一个字符。 */
    get length() {
        return this.#host.textContent.length;
    }
    /**
     * 文本字段中最多可包含的字符数（即用户输入的字符数）。脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。  
     * 默认值为 0。
     */
    maxChars = 0;
    /** scrollH 的最大值。 */
    get maxScrollH() {
        return this.#host.scrollWidth;
    }
    /** scrollV 的最大值。 */
    get maxScrollV() {
        return this.#host.scrollHeight;
    }
    /** 定义多行文本字段中的文本行数。如果 wordWrap 属性设置为 true，则在文本自动换行时会增加行数。 */
    get numLines() {
        return this.bottomScrollV;
    }
    get scrollH() {
        return this.#host.scrollLeft;
    }
    /**
     * 当前水平滚动位置。如果 scrollH 属性为 0，则不能水平滚动文本。此属性值是一个以像素为单位表示水平位置的整数。  
     * 水平滚动的单位是像素，而垂直滚动的单位是行。水平滚动以像素计量是因为您通常使用的大多数字体都是按比例隔开的；这意味着字符可以有不同的宽度。Flash Player 按行进行垂直滚动是因为用户通常希望看到完整的一行文本，而不是一行的局部。即使一行中包含多种字体，行的高度也会调整到与使用的最大字体相适合。  
     * **注意**： scrollH 属性是从 0 开始的，不像 scrollV 垂直滚动属性是从 1 开始的。
     */
    set scrollH(v) {
        this.#host.scrollLeft = v;
    }
    get scrollV() {
        return this.#host.scrollTop;
    }
    /**
     * 文本在文本字段中的垂直位置。scrollV 属性可帮助用户定位到长篇文章的特定段落，还可用于创建滚动文本字段。  
     * 垂直滚动的单位是行，而水平滚动的单位是像素。如果显示的第一行是文本字段中的第一行，则 scrollV 设置为 1（而非 0）。水平滚动以像素计量是因为大多数字体都是按比例隔开的；这意味着字符可以有不同的宽度。Flash 按行进行垂直滚动是因为用户通常希望看到完整的一行文本，而不是一行的局部。即使一行上有多种字体，行的高度也会调整到与使用的最大字体相适合。
     */
    set scrollV(v) {
        this.#host.scrollTop = v;
    }
    get text() {
        return this.#host.textContent;
    }
    /**
     * 作为文本字段中当前文本的字符串。各行之间用回车符（'\r'，即 ASCII 13）分隔。此属性包含文本字段中的无格式文本，不带 HTML 标签。  
     * 要获取 HTML 形式的文本，请使用 htmlText 属性。  
     * **注意**：如果将样式表应用到文本字段，text 属性的内容将按 HTML 解释。
     */
    set text(v) {
        this.#host.textContent = v;
    }
    #textColor = 0x000000;
    get textColor() {
        return this.#textColor;
    }
    /**
     * 文本字段中文本的颜色（采用十六进制格式）。十六进制颜色系统使用六位数表示颜色值。每位数有 16 个可能的值或字符。字符范围从 0 到 9，然后从 A 到 F。例如，黑色是 0x000000；白色是 0xFFFFFF。  
     * 默认值为 0 (0x000000)。
     */
    set textColor(v) {
        this.#textColor = v;
        this.#host.style.color = hex8(v);
    }
    /** 文本的高度，以像素为单位。 */
    get textHeight() {
        return this.#host.clientHeight;
    }
    /** 文本的宽度，以像素为单位。 */
    get textWidth() {
        return this.#host.clientWidth;
    }
    #wordWrap = false;
    get wordWrap() {
        return this.#wordWrap;
    }
    /** 一个布尔值，表示文本字段是否自动换行。如果 wordWrap 的值为 true，则该文本字段自动换行；如果值为 false，则该文本字段不自动换行。默认值为 false。 */
    set wordWrap(v) {
        this.#wordWrap = v;
        this.#host.style.textWrapMode = v ? 'wrap' : '';
    }
    constructor() {
        super();

        this[target].shadowRoot.adoptedStyleSheets.push(style);
    }
    /**
     * 将 newText 参数指定的字符串追加到文本字段的文本的末尾。此方法要比对 text 属性的加法赋值 (+=)（如 someTextField.text += moreText）更有效，对于包含大量内容的文本字段尤其有效。
     * 
     * @param newText 要追加到现有文本末尾的字符串。
     */
    appendText(newText: string) {
        this.#host.append(newText);
    }
    /**
     * 返回 TextFormat 对象，其中包含 beginIndex 和 endIndex 参数指定的文本范围的格式信息。在生成的 TextFormat 对象中，只设置指定的整个文本共有的属性。所有混合型属性（意味着它在文本中的不同位置有不同的值）的值都为 null。  
     * 如果没有为这些参数指定值，则此方法适用于文本字段中的所有文本。
     * 
     * @param _beginIndex (default = -1) — 可选；一个指定文本字段中某段文本起始位置的整数。
     * @param _endIndex (default = -1) — 可选；一个整数，指定所需文本范围后面的第一个字符的位置。正如所设计的一样，如果指定 beginIndex 和 endIndex 值，则读取从 beginIndex 到 endIndex-1 的文本。
     * @returns 表示指定文本格式设置属性的 TextFormat 对象。
     */
    getTextFormat(_beginIndex = -1, _endIndex = -1) {
        return this.defaultTextFormat;
    }
    /**
     * 将 beginIndex 和 endIndex 参数指定的字符范围替换为 newText 参数的内容。正如所设计的一样，将替换从 beginIndex 到 endIndex-1 的文本。  
     * **注意**：如果已对文本字段应用了样式表，则此方法不起作用。
     * 
     * @param beginIndex 替换范围开始位置的从零开始的索引值。
     * @param endIndex 所需文本范围后面的第一个字符的从零开始的索引位置。
     * @param newText 要用来替换指定范围字符的文本。
     */
    replaceText(beginIndex: number, endIndex: number, newText: string) {
        const { textContent } = this.#host;
        this.#host.textContent = textContent.substring(0, beginIndex) + newText + textContent.substring(endIndex);
    }
    /**
     * 将 format 参数指定的文本格式应用于文本字段中的指定文本。format 的值必须是指定所需文本格式设置更改的 TextFormat 对象。只有 format 的非空属性才会应用到文本字段。不会应用 format 的设置为 null 的任何属性。默认情况下，新创建的 TextFormat 对象的所有属性都设置为 null。  
     * **注意**：如果已对文本字段应用了样式表，则此方法不起作用。  
     * setTextFormat() 方法会更改应用于文本字段中一定范围的字符或整个文本的文本格式设置。要将 format 的属性应用于文本字段中的所有文本，请不要指定 beginIndex 和 endIndex 的值。要将 format 的属性应用于一定范围的文本，请指定 beginIndex 和 endIndex 参数的值。可以使用 length 属性来确定索引值。  
     * TextFormat 对象中包含两种类型的格式设置信息：字符级格式设置和段落级格式设置。文本字段中的每个字符都可以有自己的字符格式设置，例如字体名称、字体大小、粗体和斜体。  
     * 对于段落，通过检查段落的第一个字符可了解整个段落的格式设置。段落格式设置的示例有左边距、右边距和缩进。  
     * 对于用户手动插入的任何文本或通过 replaceSelectedText() 方法替换的任何文本，将接收默认的文本格式设置（而非为文本插入点指定的格式设置）以应用于新文本。要为新文本设置默认格式，请使用 defaultTextFormat。
     * 
     * @param format 一个包含字符和段落格式设置信息的 TextFormat 对象。
     * @param _beginIndex (default = -1) — 可选；一个整数，指定所需文本范围内第一个字符的从零开始的索引位置。
     * @param _endIndex (default = -1) — 可选；一个整数，指定所需文本范围后面的第一个字符。正如所设计的一样，如果指定 beginIndex 和 endIndex 值，则更新从 beginIndex 到 endIndex-1 的文本。
     */
    setTextFormat(format: TextFormat, _beginIndex = -1, _endIndex = -1) {
        this.defaultTextFormat = format;
    }
}