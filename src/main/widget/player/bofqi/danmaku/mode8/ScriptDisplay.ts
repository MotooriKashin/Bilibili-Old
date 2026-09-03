import { CommentCanvas, type ICommentCanvas } from "./CommentCanvas";
import { CommentField, type ICommentField } from "./CommentField";
import { CommentShape, type ICommentShape } from "./CommentShape";
import { type ICommentButton, CommentButton } from "./flash/CommentButton";
import type { BitmapData } from "./flash/display/BitmapData";
import { Stage } from "./flash/display/Stage";
import { BevelFilter } from "./flash/filters/BevelFilter";
import type { BitmapFilterQuality } from "./flash/filters/BitmapFilterQuality";
import type { BitmapFilterType } from "./flash/filters/BitmapFilterType";
import { BlurFilter } from "./flash/filters/BlurFilter";
import { ColorMatrixFilter, type IMatrix } from "./flash/filters/ColorMatrixFilter";
import { ConvolutionFilter } from "./flash/filters/ConvolutionFilter";
import { DisplacementMapFilter } from "./flash/filters/DisplacementMapFilter";
import type { DisplacementMapFilterMode } from "./flash/filters/DisplacementMapFilterMode";
import { DropShadowFilter } from "./flash/filters/DropShadowFilter";
import { GlowFilter } from "./flash/filters/GlowFilter";
import { GradientBevelFilter } from "./flash/filters/GradientBevelFilter";
import { GradientGlowFilter } from "./flash/filters/GradientGlowFilter";
import { ColorTransform } from "./flash/geom/ColorTransform";
import { Matrix } from "./flash/geom/Matrix";
import { Matrix3D, type IMatrix3D } from "./flash/geom/Matrix3D";
import { Point } from "./flash/geom/Point";
import { pointTowards, projectVector, projectVectors } from "./flash/geom/Utils3D";
import { Vector3D } from "./flash/geom/Vector3D";
import { TextField } from "./flash/text/TextField";
import { TextFormat } from "./flash/text/TextFormat";
import type { TextFormatAlign } from "./flash/text/TextFormatAlign";

export class ScriptDisplay {
    #stage: Stage;
    #delay = 0;
    get fullScreenWidth() {
        return screen.width;
    }
    get fullScreenHeight() {
        return screen.height;
    }
    get screenWidth() {
        return screen.width;
    }
    get screenHeight() {
        return screen.height;
    }
    get stageWidth() {
        return this.#stage.stageWidth;
    }
    get stageHeight() {
        return this.#stage.stageHeight;
    }
    get width() {
        return this.#stage.width;
    }
    get height() {
        return this.#stage.height;
    }
    get root() {
        return this.#stage;
    }
    get frameRate() {
        return 60;
    }
    constructor(stage: Stage, delay = 0) {
        this.#stage = stage;
        this.#delay = delay;
    }
    createMatrix(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number) {
        return new Matrix(a, b, c, d, tx, ty);
    }
    createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number) {
        return new Matrix().createGradientBox(width, height, rotation, tx, ty);
    }
    createPoint(x?: number, y?: number) {
        return new Point(x, y);
    }
    createComment(text: string, param: ICommentField) {
        return new CommentField(text, param, this.#stage, this.#delay);
    }
    createShape(param: ICommentShape) {
        return new CommentShape(param, this.#stage);
    }
    createCanvas(param: ICommentCanvas) {
        return new CommentCanvas(param, this.#stage);
    }
    createButton(param: ICommentButton) {
        return new CommentButton(param, this.#stage);
    }
    createGlowFilter(color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: BitmapFilterQuality, inner?: boolean, knockout?: boolean) {
        return new GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
    }
    createBlurFilter(blurX?: number, blurY?: number, quality?: number) {
        return new BlurFilter(blurX, blurY, quality);
    }
    /** 兼容[[高级弹幕]Rolling Girl](https://www.bilibili.com/video/av379138)拼写错误 */
    createBlurFilters(blurX?: number, blurY?: number, quality?: number) {
        return new BlurFilter(blurX, blurY, quality);
    }
    toIntVector<T>(num: Array<T>) {
        return num;
    }
    toUIntVector(num: number[]) {
        return num;
    }
    toNumberVector(num: number[]) {
        return num;
    }
    createMatrix3D(v?: IMatrix3D) {
        return new Matrix3D(v);
    }
    createColorTransform(redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaMultiplier?: number, redOffset?: number, greenOffset?: number, blueOffset?: number, alphaOffset?: number) {
        return new ColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset);
    }
    createTextFormat(font?: string, size?: number, color?: number, bold?: boolean, italic?: boolean, underline?: boolean, url?: string, target?: string, align?: TextFormatAlign, leftMargin?: number, rightMargin?: number, indent?: number, leading?: number) {
        return new TextFormat(font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading);
    }
    createVector3D(x?: number, y?: number, z?: number, w?: number) {
        return new Vector3D(x, y, z, w);
    }
    createTextField() {
        return new TextField();
    }
    createBevelFilter(distance?: number, angle?: number, highlightColor?: number, highlightAlpha?: number, shadowColor?: number, shadowAlpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: BitmapFilterQuality, type?: BitmapFilterType, knockout?: boolean) {
        return new BevelFilter(distance, angle, highlightColor, highlightAlpha, shadowColor, shadowAlpha, blurX, blurY, strength, quality, type, knockout);
    }
    createColorMatrixFilter(matrix?: IMatrix) {
        return new ColorMatrixFilter(matrix);
    }
    createConvolutionFilter(matrixX?: number, matrixY?: number, matrix?: number[], divisor?: number, bias?: number, preserveAlpha?: boolean, clamp?: boolean, color?: number, alpha?: number) {
        return new ConvolutionFilter(matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha);
    }
    createDisplacementMapFilter(mapBitmap: BitmapData, mapPoint: Point, componentX?: number, componentY?: number, scaleX?: number, scaleY?: number, mode?: DisplacementMapFilterMode, color?: number, alpha?: number) {
        return new DisplacementMapFilter(mapBitmap, mapPoint, componentX, componentY, scaleX, scaleY, mode, color, alpha);
    }
    createDropShadowFilter(distance?: number, angle?: number, color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: BitmapFilterQuality, inner?: boolean, knockout?: boolean, hideObject?: boolean) {
        return new DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality, inner, knockout, hideObject);
    }
    createGradientBevelFilter(distance?: number, angle?: number, colors?: number[], alphas?: number[], ratios?: number[], blurX?: number, blurY?: number, strength?: number, quality?: BitmapFilterQuality, type?: BitmapFilterType, knockout?: boolean) {
        return new GradientBevelFilter(distance, angle, colors, alphas, ratios, blurX, blurY, strength, quality, type, knockout);
    }
    createGradientGlowFilter(distance?: number, angle?: number, colors?: number[], alphas?: number[], ratios?: number[], blurX?: number, blurY?: number, strength?: number, quality?: BitmapFilterQuality, type?: BitmapFilterType, knockout?: boolean) {
        return new GradientGlowFilter(distance, angle, colors, alphas, ratios, blurX, blurY, strength, quality, type, knockout);
    }
    pointTowards(percent: number, mat: Matrix3D, pos: Vector3D, at?: Vector3D, up?: Vector3D) {
        return pointTowards(percent, mat, pos, at, up);
    }
    projectVector(m: Matrix3D, v: Vector3D) {
        return projectVector(m, v);
    }
    projectVectors(m: Matrix3D, verts: number[], projectedVerts: number[], uvts: number[]) {
        return projectVectors(m, verts, projectedVerts, uvts);
    }
}