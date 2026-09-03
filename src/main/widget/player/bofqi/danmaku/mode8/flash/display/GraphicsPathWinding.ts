/**
 * GraphicsPathWinding 类为 flash.display.GraphicsPath.winding 属性和 flash.display.Graphics.drawPath() 方法提供值，以确定绘制路径的方向。顺时针路径为正向缠绕，逆时针路径为反向缠绕。  
 * 当路径相交或重叠时，缠绕方向将确定由相交或重叠创建的区域的填充规则：  
 * - 奇偶缠绕规则
 * - 非零缠绕规则
 */
export enum GraphicsPathWinding {
    /** 建立奇偶缠绕类型。奇偶缠绕类型是由所有原始的绘图 API 使用的规则，并且是 flash.display.Graphics.drawPath() 方法的默认类型。任何重叠的路径将在开放填充与闭合填充之间交替。如果使用相同的填充绘制的两个正方形相交，则将不会填充相交的区域。相邻的区域是不相同的（二者没有同时填充或同时不填充）。 */
    EVEN_ODD = 'evenOdd',
    /** 建立非零缠绕类型。非零缠绕类型确定：当反向缠绕的路径相交时，将不填充相交区域（与奇偶缠绕类型一样）。对于相同缠绕的路径，将填充相交区域。 */
    NON_ZERO = 'nonZero',
}