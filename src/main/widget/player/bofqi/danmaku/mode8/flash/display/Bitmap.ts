import { BitmapData, canvas } from "./BitmapData";
import { DisplayObject, target } from "./DisplayObject";
import { PixelSnapping } from "./PixelSnapping";

export class Bitmap extends DisplayObject {
    constructor(
        /** 被引用的 BitmapData 对象。 */
        public bitmapData: BitmapData,
        /** 控制 Bitmap 对象是否贴紧至最近的像素。 */
        public pixelSnapping = PixelSnapping.AUTO,
        /** 控制在缩放时是否对位图进行平滑处理。如果为 true，则会在缩放时对位图进行平滑处理。如果为 false，则不会在缩放时对位图进行平滑处理。 */
        public smoothing = false,
    ) {
        super();

        this[target].div.append(bitmapData[canvas]);
    }
}