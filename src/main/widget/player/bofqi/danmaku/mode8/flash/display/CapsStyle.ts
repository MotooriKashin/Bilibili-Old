/**
 * CapsStyle 类是可指定在绘制线条中使用的端点样式的常量值枚举。常量可用作 flash.display.Graphics.lineStyle() 方法的 caps 参数中的值。可以指定以下三种类型的端点：  
 * - 无
 * - 圆头
 * - 方头
 */
export enum CapsStyle {
    /** 用于在 flash.display.Graphics.lineStyle() 方法的 caps 参数中指定没有端点。 */
    NONE = 'none',
    /** 用于在 flash.display.Graphics.lineStyle() 方法的 caps 参数中指定圆头端点。 */
    ROUND = 'round',
    /** 用于在 flash.display.Graphics.lineStyle() 方法的 caps 参数中指定方头端点。 */
    SQUARE = 'square',
}