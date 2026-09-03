/** LineScaleMode 类为 Graphics.lineStyle() 方法中的 scaleMode 参数提供值。 */
export enum LineScaleMode {
    /** 将此设置用作 lineStyle() 方法的 scaleMode 参数时，线条粗细只会水平缩放。例如，考虑下面的圆形，它们是用一个像素的线条绘制的，每个圆的 scaleMode 参数都被设置为 LineScaleMode.HORIZONTAL。左侧的圆仅在水平方向上缩放，右侧的圆同时在垂直和水平方向上缩放。 */
    HORIZONTAL = 'horizontal',
    /** 将此设置用作 lineStyle() 方法的 scaleMode 参数时，线条粗细不会缩放。 */
    NONE = 'none',
    /** 将此设置用作 lineStyle() 方法的 scaleMode 参数时，线条粗细会始终随对象的缩放而缩放（默认值）。 */
    NORMAL = 'normal',
    /** 将此设置用作 lineStyle() 方法的 scaleMode 参数时，线条粗细只会垂直缩放。例如，考虑下面的圆形，它们是用一个像素的线条绘制的，每个圆的 scaleMode 参数都被设置为 LineScaleMode.VERTICAL。左侧的圆仅在垂直方向上缩放，右侧的圆同时在垂直和水平方向上缩放。 */
    VERTICAL = 'vertical',
}