import { applyFilter, type BitmapFilter } from ".";
import { BitmapFilterQuality } from "./BitmapFilterQuality";

/**
 * 向显示对象添加投影。  
 * 阴影算法基于模糊滤镜使用的同一个框型滤镜。投影样式有多个选项，包括内侧或外侧阴影和挖空模式。
 */
export class DropShadowFilter implements BitmapFilter {
    constructor(
        /** 阴影的偏移距离，以像素为单位。默认值为 4.0（浮点）。 */
        public distance = 4.0,
        /** 阴影的角度。有效值为 0 到 360 度（浮点）。默认值为 45。 */
        public angle = 45,
        /** 阴影的颜色。有效值采用十六进制格式 0xRRGGBB。默认值为 0x000000。 */
        public color = 0,
        /** 阴影颜色的 Alpha 透明度值。有效值为 0.0 到 1.0。例如，0.25 设置透明度值为 25%。默认值为 1.0。 */
        public alpha = 1.0,
        /** 水平模糊量。有效值为 0 到 255.0（浮点）。默认值为 4.0。 */
        public blurX = 4.0,
        /** 垂直模糊量。有效值为 0 到 255.0（浮点）。默认值为 4.0。 */
        public blurY = 4.0,
        /** 印记或跨页的强度。该值越高，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255.0。默认值为 1.0。 */
        public strength = 1.0,
        /**
         * 应用滤镜的次数。默认值为 BitmapFilterQuality.LOW，与应用一次滤镜等效。值 BitmapFilterQuality.MEDIUM 两次应用滤镜；值 BitmapFilterQuality.HIGH 三次应用滤镜。滤镜的值越小，呈示速度越快。  
         * 对于大多数应用，quality 的值为低、中或高就足够了。您可以使用其他数值（最高为 15）来达到不同的效果，但是值越高，呈示速度越慢。除了增加 quality 的值，仅增加 blurX 和 blurY 属性的值通常也可以获得类似的效果，而且呈现速度更快。
         */
        public quality = BitmapFilterQuality.LOW,
        /** 表示阴影是否为内侧阴影。值为 true 表明是内侧阴影。默认为 false，即外侧阴影（对象外缘周围的阴影）。 */
        public inner = false,
        /** 应用挖空效果 (true)，这将有效地使对象的填色变为透明，并显示文档的背景颜色。默认值为 false（不应用挖空效果）。 */
        public knockout = false,
        /** 表示是否隐藏对象。如果值为 true，则表示没有绘制对象本身，只有阴影是可见的。默认值为 false（显示对象）。 */
        public hideObject = false,
    ) { }
    clone() {
        return <this>new DropShadowFilter(this.distance, this.angle, this.color, this.alpha, this.blurX, this.blurY, this.strength, this.quality, this.inner, this.knockout, this.hideObject);
    }
    [applyFilter](inPrimitive: string) {
        const angleRad = (this.angle - 90) * Math.PI / 180;
        const offsetX = Math.cos(angleRad) * this.distance;
        const offsetY = Math.sin(angleRad) * this.distance;

        let primitives = '';
        const shadowResult = `shadowResult-${Math.random().toString(36).substring(2, 9)}`;

        // 基础模糊
        const qualityCount = this.quality;
        let lastBlurInput = inPrimitive;
        for (let i = 0; i < qualityCount; i++) {
            const tempBlurResult = `tempBlur-${i}`;
            primitives += `<feGaussianBlur in="${lastBlurInput}" stdDeviation="${this.blurX} ${this.blurY}" result="${tempBlurResult}" />`;
            lastBlurInput = tempBlurResult;
        }

        const shadowOffset = `shadowOffset-${Math.random().toString(36).substring(2, 9)}`;
        const floodColor = `floodColor-${Math.random().toString(36).substring(2, 9)}`;
        const finalShadow = `finalShadow-${Math.random().toString(36).substring(2, 9)}`;

        // 投影逻辑
        primitives += `<feOffset in="${lastBlurInput}" dx="${offsetX}" dy="${offsetY}" result="${shadowOffset}" />`;
        primitives += `<feFlood flood-color="#${this.color.toString(16).padStart(6, '0')}" flood-opacity="${this.alpha}" result="${floodColor}" />`;
        primitives += `<feComposite in="${floodColor}" in2="${shadowOffset}" operator="in" result="${finalShadow}" />`;

        // 根据类型和挖空效果组合
        if (this.knockout) {
            if (this.inner) {
                primitives += `<feComposite in="${finalShadow}" in2="SourceGraphic" operator="out" result="${shadowResult}" />`;
            } else {
                primitives += `<feComposite in="${finalShadow}" in2="SourceGraphic" operator="xor" result="${shadowResult}" />`;
            }
        } else {
            primitives += `<feMerge result="${shadowResult}">
                <feMergeNode in="${finalShadow}" />
                <feMergeNode in="${inPrimitive}" />
            </feMerge>`;
        }

        if (this.hideObject) {
            return { primitives, result: shadowResult };
        } else {
            return { primitives, result: shadowResult };
        }
    }
}