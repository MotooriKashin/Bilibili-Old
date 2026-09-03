/** InterpolationMethod 类为 Graphics.beginGradientFill() 和 Graphics.lineGradientStyle() 方法中的 interpolationMethod 参数提供值。此参数确定在呈现渐变时所用的 RGB 空间。 */
export enum InterpolationMethod {
    /** 指定应使用线性 RGB 插值方法。这意味着使用基于线性 RGB 颜色模型的 RGB 颜色空间。 */
    LINEAR_RGB = 'linearRGB',
    /** 指定应使用 RGB 插值方法。这意味着使用指数式 sRGB（标准 RGB）空间来呈现渐变。sRGB 空间是一种 W3C 批准的标准，用于定义红色、绿色和蓝色成分值和可见成分颜色实际浓度之间的非线性转换。 */
    RGB = 'rgb',
}