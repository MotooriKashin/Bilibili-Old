import { applyFilter, type BitmapFilter } from ".";

/**
 * 将模糊视觉效果应用于显示对象。  
 * 模糊效果可以柔化图像的细节。您可以生成一些模糊效果，范围从创建一个柔化的、未聚焦的外观到高斯模糊（就像通过半透明玻璃查看图像一样的朦胧的外观）。当此滤镜的 quality 属性设置为低时，结果为柔化的、未聚焦的外观。当 quality 属性设置为高时，该属性接近高斯模糊滤镜。
 */
export class BlurFilter implements BitmapFilter {
    constructor(
        /** 水平模糊量。有效值为从 0 到 255（浮点）。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其它值更快。 */
        public blurX = 4.0,
        /** 垂直模糊量。有效值为从 0 到 255（浮点）。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其它值更快。 */
        public blurY = 4.0,
        /**
         * 执行模糊的次数。默认值为 BitmapFilterQuality.LOW，与应用一次滤镜等效。值 BitmapFilterQuality.MEDIUM 两次应用滤镜；值 BitmapFilterQuality.HIGH 三次应用滤镜并接近高斯模糊。滤镜的值越小，呈示速度越快。  
         * 对于大多数应用，quality 的值为低、中或高就足够了。虽然您可以使用不超过 15 的其他数值来增加应用模糊的次数，但该数值越高，呈现速度就越慢。除了增加 quality 的值，仅增加 blurX 和 blurY 属性的值通常也可以获得类似的效果，而且呈现速度更快。
         */
        public quality = 1,
    ) { }
    clone() {
        return <this>new BlurFilter(this.blurX, this.blurY, this.quality);
    }
    [applyFilter](inPrimitive: string) {
        const qualityCount = this.quality;
        let primitives = '';
        let lastResult = inPrimitive;

        for (let i = 0; i < qualityCount; i++) {
            const resultId = `blur-${Math.random().toString(36).substring(2, 9)}-${i}`;
            primitives += `<feGaussianBlur in="${lastResult}" stdDeviation="${this.blurX} ${this.blurY}" result="${resultId}" />`;
            lastResult = resultId;
        }

        return { primitives, result: lastResult };
    }
}