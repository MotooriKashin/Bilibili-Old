/** PixelSnapping 类是可使用 Bitmap 对象的 pixelSnapping 属性来设置像素贴紧选项的常量值枚举。 */
export enum PixelSnapping {
    /** 一个在 Bitmap 对象的 pixelSnapping 属性中使用的常量值，用于指定位图图像始终与最近的像素贴紧，与任何变形无关。 */
    ALWAYS = 'always',
    /** 一个在 Bitmap 对象的 pixelSnapping 属性中使用的常量值，用于指定如果位图图像是未经旋转或倾斜而绘制的，并且是以 99.9% 至 100.1% 的缩放系数绘制的，则该位图图像将与最近的像素贴紧。如果满足这些条件，则图像以 100% 缩放比例绘制，并与最近的像素贴紧。在内部，此设置允许使用矢量渲染器以尽可能快的速度绘制图像。 */
    AUTO = 'auto',
    /** 一个在 Bitmap 对象的 pixelSnapping 属性中使用的常量值，用于指定不发生任何像素贴紧。 */
    NEVER = 'never',
}