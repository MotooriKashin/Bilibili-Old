/**
 * StageQuality 类为 Stage.quality 属性提供值，还为 BitmapData.drawWithQuality() 方法的 quality 参数提供值。  
 * 较高的品质设置可以使缩放的位图得到较好的呈现品质。不过，较高的品质设置从运算角度看更昂贵。尤其在呈现缩放的视频时，使用较高的品质设置可以降低帧速率。  
 * 在 Adobe AIR 的桌面配置文件中，quality 可设置为 StageQuality.BEST 或 StageQuality.HIGH（默认值为 StageQuality.HIGH）。试图将其设置为其他值不会产生任何效果（且该属性保持不变）。在 AIR 的移动配置文件中，所有四个品质设置均可用。在移动设备上，默认值为 StageQuality.MEDIUM。  
 * 对于在 Adobe AIR 中运行的内容，设置一个 Stage 对象的 quality 属性会更改所有 Stage 对象（由不同的 NativeWindow 对象使用）的呈现品质。  
 * **注意**： 操作系统绘制设备字体，因此，这些设备字体不会受 quality 属性的影响。
 */
export enum StageQuality {
    /** 指定极高的呈示品质。图形是使用 4 x 4 像素网格消除锯齿的。如果将 Bitmap.smoothing 设置为 true，则运行时会使用产生较少失真的高品质降级算法（但是，使用 StageQuality.BEST 时将 Bitmap.smoothing 设置为 true 会显著降低性能，因此不建议使用此设置）。 */
    BEST = 'best',
    /** 指定高渲染品质。图形是使用 4 x 4 像素网格消除锯齿的，而位图平滑处理取决于 Bitmap.smoothing 设置。运行时使用 mip 贴图技术。这是 Flash Player 使用的默认呈现品质设置。 */
    HIGH = 'high',
    /** 指定极高的呈示品质。图形是使用 16 x 16 像素网格消除锯齿的。如果将 Bitmap.smoothing 设置为 true，则运行时会使用产生较少失真的高品质降级算法（但是，使用 StageQuality.BEST 时将 Bitmap.smoothing 设置为 true 会显著降低性能，因此不建议使用此设置）。 */
    HIGH_16X16 = '16x16',
    /** 指定极高的呈示品质。图形是使用 16 x 16 像素网格消除锯齿的。在线性 sRGB 空间中消除锯齿。如果将 Bitmap.smoothing 设置为 true，则运行时会使用产生较少失真的高品质降级算法（但是，使用 StageQuality.BEST 时将 Bitmap.smoothing 设置为 true 会显著降低性能，因此不建议使用此设置）。 */
    HIGH_16X16_LINEAR = '16x16linear',
    /** 指定极高的呈示品质。图形是使用 8 x 8 像素网格消除锯齿的。如果将 Bitmap.smoothing 设置为 true，则运行时会使用产生较少伪像的高品质降级算法（但是，使用 StageQuality.BEST 时将 Bitmap.smoothing 设置为 true 会显著降低性能，因此不建议使用此设置）。 */
    HIGH_8X8 = '8x8',
    /** 指定极高的呈示品质。图形是使用 8 x 8 像素网格消除锯齿的。在线性 sRGB 空间中消除锯齿。如果将 Bitmap.smoothing 设置为 true，则运行时会使用产生较少失真的高品质降级算法（但是，使用 StageQuality.BEST 时将 Bitmap.smoothing 设置为 true 会显著降低性能，因此不建议使用此设置）。 */
    HIGH_8X8_LINEAR = '8x8linear',
    /** 指定低渲染品质。不消除图形的锯齿，不对位图进行平滑处理，但运行时仍使用 mip 贴图技术。 */
    LOW = 'low',
    /** 指定中等渲染品质。图形是使用 2 x 2 像素网格消除锯齿的，而位图平滑处理取决于 Bitmap.smoothing 设置。运行时使用 mip 贴图技术。此设置适用于不包含文本的影片。 */
    MEDIUM = 'medium',
}