import { CommentBitmap, type ICommentBitmap } from "./CommentBitmap";
import { BitmapData } from "./flash/display/BitmapData";
import type { Stage } from "./flash/display/Stage";
import { Rectangle } from "./flash/geom/Rectangle";

export class ScriptBitmap {
    #stage: Stage;
    #delay = 0;
    constructor(stage: Stage, delay = 0) {
        this.#stage = stage;
        this.#delay = delay;
    }
    createBitmap(param: ICommentBitmap) {
        return new CommentBitmap(param, this.#stage, this.#delay);
    }
    createBitmapData(width: number, height: number, transparent?: boolean, fillColor?: number) {
        return new BitmapData(width, height, transparent, fillColor);
    }
    createRectangle(x?: number, y?: number, width?: number, height?: number) {
        return new Rectangle(x, y, width, height);
    }
}