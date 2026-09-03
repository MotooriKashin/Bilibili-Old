/** TextFormatAlign 类为 TextFormat 类中的文本对齐方式提供值。 */
export enum TextFormatAlign {
    /** 常数；在文本字段内将文本居中对齐。 */
    CENTER = "center",
    /** 常量；将文本与一行的结束边缘对齐。与从左至右的语言的右对齐相同，与从右至左语言的左对齐相同。 */
    END = "end",
    /** 常数；在文本字段内将文本两端对齐。 */
    JUSTIFY = "justify",
    /** 常数；在文本字段内将文本左对齐。 */
    LEFT = "start",
    /** 常数；在文本字段内将文本右对齐。 */
    RIGHT = "end",
    /** 常量；将文本与一行的起始边缘对齐。与从左至右的语言的左对齐相同，与从右至左语言的右对齐相同。 */
    START = "start",
}