import { applyFilter, type BitmapFilter } from ".";
import { canvas, type BitmapData } from "../display/BitmapData";
import type { Point } from "../geom/Point";
import { DisplacementMapFilterMode } from "./DisplacementMapFilterMode";

/**
 * 用指定的 BitmapData 对象（称为置换图图像）的像素值执行对象置换。  
 */
export class DisplacementMapFilter implements BitmapFilter {
    constructor(
        /** 包含置换映射数据的 BitmapData 对象。 */
        public mapBitmap: BitmapData,
        /** 一个值，它包含目标显示对象的左上角相对于映射图像左上角的偏移量。 */
        public mapPoint: Point,
        /** 说明在映射图像中使用哪个颜色通道来置换 x 结果。可能的值为 BitmapDataChannel 常量。 */
        public componentX = 0,
        /** 说明在映射图像中使用哪个颜色通道来置换 y 结果。可能的值为 BitmapDataChannel 常量。 */
        public componentY = 0,
        /** 用于缩放映射计算的 x 置换结果的乘数。 */
        public scaleX = 0.0,
        /** 用于缩放映射计算的 y 置换结果的乘数。 */
        public scaleY = 0.0,
        /** 滤镜模式。 */
        public mode = DisplacementMapFilterMode.WRAP,
        /** 指定对于超出范围的替换应用什么颜色。置换的有效范围是 0.0 到 1.0。值采用十六进制格式。color 的默认值为 0。如果 mode 属性设置为 DisplacementMapFilterMode.COLOR，则使用此属性。 */
        public color = 0,
        /** 指定对于超出范围的替换应用的 Alpha 透明度值。它被指定为 0.0 到 1.0 之间的标准值。例如，0.25 设置透明度值为 25%。默认值为 0。如果 mode 属性设置为 DisplacementMapFilterMode.COLOR，则使用此属性。 */
        public alpha = 0.0,
    ) { }
    clone() {
        return <this>new DisplacementMapFilter(this.mapBitmap, this.mapPoint, this.componentX, this.componentY, this.scaleX, this.scaleY, this.mode, this.color, this.alpha);
    }
    [applyFilter](inPrimitive: string) {
        if (!this.mapBitmap) {
            return { primitives: '', result: inPrimitive };
        }

        const mapCanvas = this.mapBitmap[canvas];
        const mapDataUrl = mapCanvas.toDataURL('image/png');

        const mapImageId = `mapImage-${Math.random().toString(36).substring(2, 9)}`;
        const displaceResult = `displaceResult-${Math.random().toString(36).substring(2, 9)}`;

        let primitives = '';

        // 将位移图作为 SVG 图像基元嵌入
        primitives += `<feImage href="${mapDataUrl}" x="${this.mapPoint.x}" y="${this.mapPoint.y}" width="${this.mapBitmap.width}" height="${this.mapBitmap.height}" result="${mapImageId}" />`;

        // 使用 feDisplacementMap 基元
        primitives += `<feDisplacementMap 
            in="${inPrimitive}" 
            in2="${mapImageId}"
            xChannelSelector="${this.#getChannelName(this.componentX)}" 
            yChannelSelector="${this.#getChannelName(this.componentY)}"
            scale="${this.scaleX}"
            result="${displaceResult}"
        />`;

        // 注意：SVG 没有直接的 scaleY 属性，通常 scale 属性同时作用于 X 和 Y
        // 如果需要分开控制，需要更复杂的逻辑，这里简化处理。
        // mode 属性同样在 SVG 中需要通过 `edgeMode` 来实现，这里也简化处理。

        return { primitives, result: displaceResult };
    }
    #getChannelName(component: number) {
        switch (component) {
            case 1: // BitmapDataChannel.RED
                return 'R';
            case 2: // BitmapDataChannel.GREEN
                return 'G';
            case 4: // BitmapDataChannel.BLUE
                return 'B';
            case 8: // BitmapDataChannel.ALPHA
                return 'A';
            default:
                return 'R'; // 默认值
        }
    }
}