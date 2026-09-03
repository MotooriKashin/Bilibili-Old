import { applyFilter, type BitmapFilter } from ".";
import { BitmapFilterQuality } from "./BitmapFilterQuality";
import { BitmapFilterType } from "./BitmapFilterType";

/**
 * 对显示对象添加斜角效果。  
 * 斜角效果使对象（如按钮）具有三维外观。您可以利用不同的加亮颜色和阴影颜色、斜角上的模糊量、斜角的角度、斜角的位置和挖空效果来自定义斜角的外观。
 */
export class BevelFilter implements BitmapFilter {
    constructor(
        /** 斜角的偏移距离。有效值以像素为单位（浮点）。默认值为 4。 */
        public distance = 4.0,
        /**
         * 斜角的角度。有效值为 0 到 360 度。默认值为 45 度。  
         * 角度值表示理论上的光源落在对象上的角度，它决定了效果相对于该对象的位置。如果 distance 属性设置为 0，则效果相对于对象没有偏移，因此 angle 属性不起作用。
         */
        public angle = 45,
        /** 斜角的加亮颜色。有效值采用十六进制格式，0xRRGGBB。默认值为 0xFFFFFF。 */
        public highlightColor = 0xFFFFFF,
        /** 加亮颜色的 Alpha 透明度值。该值被指定为 0 到 1 之间的标准值。例如，0.25 设置透明度值为 25%。默认值为 1。 */
        public highlightAlpha = 1.0,
        /** 斜角的阴影颜色。有效值采用十六进制格式，0xRRGGBB。默认值为 0x000000。 */
        public shadowColor = 0x000000,
        /** 阴影颜色的 Alpha 透明度值。该值被指定为 0 到 1 之间的标准值。例如，0.25 设置透明度值为 25%。默认值为 1。 */
        public shadowAlpha = 1.0,
        /** 水平模糊量，以像素为单位。有效值为从 0 到 255（浮点）。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈现速度比其他值更快。 */
        public blurX = 4.0,
        /** 垂直模糊量，以像素为单位。有效值为从 0 到 255（浮点）。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈现速度比其他值更快。 */
        public blurY = 4.0,
        /** 印记或跨页的强度。有效值为 0 到 255。该值越大，印记的颜色越深，而且斜角与背景之间的对比度也越强。默认值为 1。 */
        public strength = 1,
        /**
         * 应用滤镜的次数。默认值为 BitmapFilterQuality.LOW，与应用一次滤镜等效。值 BitmapFilterQuality.MEDIUM 两次应用滤镜；值 BitmapFilterQuality.HIGH 三次应用滤镜。滤镜的值越小，呈示速度越快。  
         * 对于大多数应用，quality 的值为低、中或高就足够了。您可以使用其他数值（最高为 15）来达到不同的效果，但是值越高，呈示速度越慢。除了增加 quality 的值，仅增加 blurX 和 blurY 属性的值通常也可以获得类似的效果，而且呈现速度更快。
         */
        public quality = BitmapFilterQuality.LOW,
        /** 斜角在对象上的位置。内斜角和外斜角被放置在内缘或外缘上；完全斜角被放置在整个对象上。 */
        public type = BitmapFilterType.INNER,
        /** 应用挖空效果 (true)，这将有效地使对象的填色变为透明，并显示文档的背景颜色。默认值为 false（不应用挖空效果）。 */
        public knockout = false,
    ) { }
    clone() {
        return <this>new BevelFilter(this.distance, this.angle, this.highlightColor, this.highlightAlpha, this.shadowColor, this.shadowAlpha, this.blurX, this.blurY, this.strength, this.quality, this.type, this.knockout);
    }
    [applyFilter](inPrimitive = 'SourceGraphic') {
        const angleRad = (this.angle - 90) * Math.PI / 180;
        const offsetX = Math.cos(angleRad) * this.distance;
        const offsetY = Math.sin(angleRad) * this.distance;

        let primitives = '';
        const bevelResult = 'bevelResult';

        // 基础模糊
        primitives += `<feGaussianBlur in="${inPrimitive}" stdDeviation="${this.blurX} ${this.blurY}" result="blur" />`;

        // 根据类型生成滤镜基元
        if (this.type === BitmapFilterType.OUTER || this.type === BitmapFilterType.FULL) {
            primitives += `
                <feOffset dx="${offsetX}" dy="${offsetY}" in="blur" result="highlightOuterOffset" />
                <feFlood flood-color="#${this.highlightColor.toString(16).padStart(6, '0')}" flood-opacity="${this.highlightAlpha}" result="highlightOuterColor" />
                <feComposite in="highlightOuterColor" in2="highlightOuterOffset" operator="in" result="highlightOuter" />

                <feOffset dx="${-offsetX}" dy="${-offsetY}" in="blur" result="shadowOuterOffset" />
                <feFlood flood-color="#${this.shadowColor.toString(16).padStart(6, '0')}" flood-opacity="${this.shadowAlpha}" result="shadowOuterColor" />
                <feComposite in="shadowOuterColor" in2="shadowOuterOffset" operator="in" result="shadowOuter" />
            `;
        }

        if (this.type === BitmapFilterType.INNER || this.type === BitmapFilterType.FULL) {
            primitives += `
                <feMorphology in="${inPrimitive}" operator="dilate" radius="${Math.max(this.blurX, this.blurY) * 1.5}" result="innerMask" />

                <feOffset dx="${offsetX}" dy="${offsetY}" in="${inPrimitive}" result="highlightInnerOffset" />
                <feGaussianBlur in="highlightInnerOffset" stdDeviation="${this.blurX} ${this.blurY}" result="highlightInnerBlur" />
                <feComposite in="highlightInnerBlur" in2="innerMask" operator="in" result="highlightInner" />
                <feComposite in="highlightInner" in2="${inPrimitive}" operator="out" result="highlightInnerFinal" />
                
                <feOffset dx="${-offsetX}" dy="${-offsetY}" in="${inPrimitive}" result="shadowInnerOffset" />
                <feGaussianBlur in="shadowInnerOffset" stdDeviation="${this.blurX} ${this.blurY}" result="shadowInnerBlur" />
                <feComposite in="shadowInnerBlur" in2="innerMask" operator="in" result="shadowInner" />
                <feComposite in="shadowInner" in2="${inPrimitive}" operator="out" result="shadowInnerFinal" />
            `;
        }

        // 合并所有效果
        let mergeNodes = '';
        if (this.type === BitmapFilterType.OUTER || this.type === BitmapFilterType.FULL) {
            mergeNodes += `<feMergeNode in="highlightOuter" />`;
            mergeNodes += `<feMergeNode in="shadowOuter" />`;
        }
        if (this.type === BitmapFilterType.INNER || this.type === BitmapFilterType.FULL) {
            mergeNodes += `<feMergeNode in="highlightInnerFinal" />`;
            mergeNodes += `<feMergeNode in="shadowInnerFinal" />`;
        }

        primitives += `<feMerge result="${bevelResult}">${mergeNodes}</feMerge>`;

        // 挖空效果
        if (this.knockout) {
            primitives += `<feComposite in="${bevelResult}" in2="${inPrimitive}" operator="out" result="${bevelResult}-knockout" />`;
            return { primitives, result: `${bevelResult}-knockout` };
        }

        return { primitives, result: bevelResult };
    }
}