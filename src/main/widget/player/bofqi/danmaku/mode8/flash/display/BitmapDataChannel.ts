/**
 * BitmapDataChannel 类是常数值枚举，表示要使用的通道：红色通道、蓝色通道、绿色通道或 Alpha 透明度通道。  
 * 调用某些方法时，您可以使用按位 OR (|) 运算符来合并 BitmapDataChannel 常数，从而表示多个颜色通道。  
 * 提供的 BitmapDataChannel 常数用作以下参数或属性的值：  
 * - flash.display.BitmapData.copyChannel() 方法的 sourceChannel 和 destChannel 参数
 * - flash.display.BitmapData.noise() 方法的 channelOptions 参数
 * - flash.filters.DisplacementMapFilter.componentX 和 flash.filters.DisplacementMapFilter.componentY 属性
 */
export enum BitmapDataChannel {
    /** 红色通道。 */
    RED = 0b1,
    /** 绿色通道。 */
    GREEN = 0b10,
    /** 蓝色通道。 */
    BLUE = 0b100,
    /** Alpha 通道。 */
    ALPHA = 0b1000,
}