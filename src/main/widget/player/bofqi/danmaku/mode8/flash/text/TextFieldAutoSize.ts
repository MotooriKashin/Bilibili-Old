/** TextFieldAutoSize 类是在设置 TextField 类的 autoSize 属性时使用的常数值的枚举。 */
export enum TextFieldAutoSize {
    /** 指定将文本视为居中对齐文本。调整单个文本字段行，使其在左右边距之间均衡分布。 */
    CENTER = 'center',
    /** 指定将文本视为左对齐文本，即文本字段的左侧固定不变，只在右侧调整单行的大小。 */
    LEFT = 'left',
    /** 指定不调整大小。 */
    NONE = 'none',
    /** 指定将文本视为右对齐文本，即文本字段的右侧固定不变，只在左侧调整单行的大小。 */
    RIGHT = 'right',
}