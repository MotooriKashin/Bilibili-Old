import { applyFilter, type BitmapFilter } from ".";
import { BitmapFilterQuality } from "./BitmapFilterQuality";

/**
 * 对显示对象应用发光效果。  
 * 有多个用于发光样式的选项，包括内侧发光或外侧发光以及挖空模式。在投影滤镜的 distance 和 angle 属性设置为 0 时，发光滤镜与投影滤镜极为相似。
 */
export class GlowFilter implements BitmapFilter {
    constructor(
        /** 光晕颜色。有效值采用十六进制格式 0xRRGGBB。默认值为 0xFF0000。 */
        public color = 0xFF0000,
        /** 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。默认值为 1。 */
        public alpha = 1.0,
        /** 水平模糊量。有效值为 0 到 255（浮点）。默认值为 6。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈现速度比其他值更快。 */
        public blurX = 6.0,
        /** 垂直模糊量。有效值为 0 到 255（浮点）。默认值为 6。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈现速度比其他值更快。 */
        public blurY = 6.0,
        /** 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。默认值为 2。 */
        public strength = 2,
        /**
         * 应用滤镜的次数。默认值为 BitmapFilterQuality.LOW，与应用一次滤镜等效。值 BitmapFilterQuality.MEDIUM 两次应用滤镜；值 BitmapFilterQuality.HIGH 三次应用滤镜。滤镜的值越小，呈示速度越快。  
         * 对于大多数应用，quality 的值为低、中或高就足够了。您可以使用其他数值（最高为 15）来达到不同的效果，但是值越高，呈示速度越慢。除了增加 quality 的值，仅增加 blurX 和 blurY 属性的值通常也可以获得类似的效果，而且呈现速度更快。
         */
        public quality = BitmapFilterQuality.LOW,
        /** 指定发光是否为内侧发光。值 true 表示内侧发光。默认值为 false，即外侧发光（对象外缘周围的发光）。 */
        public inner = false,
        /** 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。默认值为 false（不应用挖空效果）。 */
        public knockout = false,
    ) { }
    clone() {
        return <this>new GlowFilter(this.color, this.alpha, this.blurX, this.blurY, this.strength, this.quality, this.inner, this.knockout);
    }
    [applyFilter](inPrimitive: string) {
        let primitives = '';
        const glowResult = `glowResult-${Math.random().toString(36).substring(2, 9)}`;

        // 基础模糊
        const qualityCount = this.quality;
        let lastBlurInput = inPrimitive;
        for (let i = 0; i < qualityCount; i++) {
            const tempBlurResult = `tempBlur-${i}`;
            primitives += `<feGaussianBlur in="${lastBlurInput}" stdDeviation="${this.blurX} ${this.blurY}" result="${tempBlurResult}" />`;
            lastBlurInput = tempBlurResult;
        }

        const floodResult = `floodResult-${Math.random().toString(36).substring(2, 9)}`;
        const compositeResult = `compositeResult-${Math.random().toString(36).substring(2, 9)}`;

        primitives += `<feFlood flood-color="#${this.color.toString(16).padStart(6, '0')}" flood-opacity="${this.alpha}" result="${floodResult}" />`;

        if (!this.inner) { // 外发光
            primitives += `<feComposite in="${floodResult}" in2="${lastBlurInput}" operator="in" result="${compositeResult}" />`;
            if (this.knockout) {
                primitives += `<feComposite in="${compositeResult}" in2="${inPrimitive}" operator="xor" result="${glowResult}" />`;
            } else {
                primitives += `<feMerge result="${glowResult}">
                    <feMergeNode in="${compositeResult}" />
                    <feMergeNode in="${inPrimitive}" />
                </feMerge>`;
            }
        } else { // 内发光
            const innerGlow = `innerGlow-${Math.random().toString(36).substring(2, 9)}`;
            primitives += `<feComposite in="SourceGraphic" in2="${lastBlurInput}" operator="out" result="${innerGlow}" />`;
            primitives += `<feComposite in="${floodResult}" in2="${innerGlow}" operator="in" result="${compositeResult}" />`;

            if (this.knockout) {
                primitives += `<feComposite in="${compositeResult}" in2="SourceGraphic" operator="out" result="${glowResult}" />`;
            } else {
                primitives += `<feMerge result="${glowResult}">
                    <feMergeNode in="${inPrimitive}" />
                    <feMergeNode in="${compositeResult}" />
                </feMerge>`;
            }
        }

        return { primitives, result: glowResult };
    }
}