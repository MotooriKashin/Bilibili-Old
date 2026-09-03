import { hex8 } from "../../../../../../../../utils/color";
import type { Matrix } from "../geom/Matrix";
import type { BitmapData } from "./BitmapData";
import type { CapsStyle } from "./CapsStyle";
import { GradientType } from "./GradientType";
import { GraphicsPathCommand } from "./GraphicsPathCommand";
import { GraphicsPathWinding } from "./GraphicsPathWinding";
import { InterpolationMethod } from "./InterpolationMethod";
import type { JointStyle } from "./JointStyle";
import { LineScaleMode } from "./LineScaleMode";
import { SpreadMethod } from "./SpreadMethod";
import { TriangleCulling } from "./TriangleCulling";

/** 包含一组可用来创建矢量形状的方法 */
export class Graphics {
    #defaultGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    #globalDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    /** 当前 SVGPathElement 节点 */
    #lastPath?: SVGPathElement;
    /** 当前 SVGPathElement 节点的 d 属性缓存 */
    #d = '';
    /** 上一次 moveTo 位置 */
    #m: [number, number] = [0, 0];
    /** 当前填充样式 */
    #fill = {
        fill: "none",
        alpha: 1,
        fillRule: "nonzero",
    }
    /** 当前线条样式 */
    #line = <LineContext>{
        width: 0,
        color: "white",
        alpha: 1,
    };
    constructor(svg: SVGSVGElement) {
        svg.append(this.#defaultGroup, this.#globalDefs);
    }
    /**
     * 为节点应用当前填充样式
     * 
     * @param element 要应用样式的节点
     */
    #applyFill(element: Element) {
        element.setAttribute('fill', this.#fill.fill);
        element.setAttribute('fill-opacity', <any>this.#fill.alpha);
        element.setAttribute('fill-rule', this.#fill.fillRule);
    }
    /**
     * 为节点应用当前线条样式
     * 
     * @param element 要应用样式的节点
     */
    #applyStroke(element: Element) {
        element.setAttribute('stroke', this.#line.color);
        element.setAttribute('stroke-width', <any>this.#line.width);
        element.setAttribute('stroke-opacity', <any>this.#line.alpha);
        this.#line.caps && element.setAttribute('stroke-linecap', this.#line.caps);
        this.#line.joints && element.setAttribute('stroke-linejoin', this.#line.joints);
        this.#line.miterLimit && element.setAttribute('stroke-miterlimit', <any>this.#line.miterLimit);
    }
    /**
     * 用位图图像填充绘图区。
     * 可以重复或平铺位图以填充该区域。
     * 该填充将保持有效，直到您调用 beginFill()、beginBitmapFill()、beginGradientFill() 或 beginShaderFill() 方法。
     * 调用 clear() 方法会清除填充。  
     * 只要绘制 3 个或更多个点，或者调用 endFill() 方法时，应用程序就会呈现填充。
     * 
     * @param _bitmap 包含要显示的位的透明或不透明位图图像。
     * @param _matrix 一个 matrix 对象（属于 flash.geom.Matrix 类），您可以使用它在位图上定义转换。
     * @param _repeat 如果为 true，则位图图像按平铺模式重复。如果为 false，位图图像不会重复，并且位图边缘将用于所有扩展出位图的填充区域。
     * @param _smooth 如果为 false，则使用最近邻点算法来呈现放大的位图图像，而且该图像看起来是像素化的。如果为 true，则使用双线性算法来呈示放大的位图图像。使用最近邻点算法呈现较快。
     * @deprecated 暂未实现
     */
    beginBitmapFill(_bitmap: BitmapData, _matrix?: Matrix, _repeat = true, _smooth = false) {
        this.#lastPath = undefined;
    }
    /**
     * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
     * 该填充将保持有效，直到您调用 beginFill()、beginBitmapFill()、beginGradientFill() 或 beginShaderFill() 方法。
     * 调用 clear() 方法会清除填充。  
     * 只要绘制 3 个或更多个点，或者调用 endFill() 方法时，应用程序就会呈现填充。
     * 
     * @param color 填充的颜色 (0xRRGGBB)。
     * @param alpha 填充的 Alpha 值（从 0.0 到 1.0）。
     */
    beginFill(color: number, alpha = 1) {
        this.#fill.fill = hex8(color);
        this.#fill.alpha = alpha;
        this.#lastPath = undefined;
    }
    /**
     * 指定一种渐变填充，用于随后调用对象的其他 Graphics 方法（如 lineTo() 或 drawCircle()）。
     * 该填充将保持有效，直到您调用 beginFill()、beginBitmapFill()、beginGradientFill() 或 beginShaderFill() 方法。
     * 调用 clear() 方法会清除填充。
     * 只要绘制 3 个或更多个点，或者调用 endFill() 方法时，应用程序就会呈现填充。
     * 
     * @param type 用于指定要使用哪种渐变类型的 GradientType 类的值。
     * @param colors 渐变中使用的 RGB 十六进制颜色值的数组（例如，红色为 0xFF0000，蓝色为 0x0000FF，等等）。可以至多指定 15 种颜色。对于每种颜色，请在 alphas 和 ratios 参数中指定对应值。
     * @param alphas colors 数组中对应颜色的 alpha 值数组；有效值为 0 到 1。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
     * @param ratios 颜色分布比率的数组；有效值为 0 到 255。该值定义 100% 采样的颜色所在位置的宽度百分比。值 0 表示渐变框中的左侧位置，255 表示渐变框中的右侧位置。注意：此值表示渐变框中的位置，而不是最终渐变的坐标空间，最终渐变可能会比渐变框更宽或更窄。为 colors 参数中的每个值指定一个值。数组中的值必须持续增加；例如，[0, 63, 127, 190, 255]。
     * @param _matrix 一个由 flash.geom.Matrix 类定义的转换矩阵。flash.geom.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 beginGradientFill() 方法一起使用。
     * @param spreadMethod 用于指定要使用哪种 spread 方法的 SpreadMethod 类的值
     * @param _interpolationMethod 用于指定要使用哪个值的 InterpolationMethod 类的值
     * @param _focalPointRatio 一个控制渐变的焦点位置的数字。0 表示焦点位于中心。1 表示焦点位于渐变圆的一条边界上。-1 表示焦点位于渐变圆的另一条边界上。小于 -1 或大于 1 的值将舍入为 -1 或 1。
     */
    beginGradientFill(
        type: GradientType,
        colors: number[],
        alphas: number[],
        ratios: number[],
        _matrix?: Matrix,
        spreadMethod = SpreadMethod.PAD,
        _interpolationMethod = InterpolationMethod.RGB,
        _focalPointRatio = 0,
    ) {
        const gradId = `gradient-${type}-${this.#globalDefs.childNodes.length}`;
        const grad = document.createElementNS('http://www.w3.org/2000/svg', type === GradientType.RADIAL ? 'radialGradient' : 'linearGradient');
        grad.id = gradId;
        grad.setAttribute('spreadMethod', spreadMethod.trim());
        for (let i = 0, len = ratios.length; i < len; i++) {
            const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop.setAttribute('offset', <any>(ratios[i]! / 255) || 0);
            stop.setAttribute('stop-color', hex8(colors[i]));
            stop.setAttribute('stop-opacity', <any>alphas[i] || 1);
            grad.append(stop);
        }
        this.#globalDefs.appendChild(grad);
        this.#fill.fill = `url(#${gradId})`;
        this.#lastPath = undefined;
    }
    /**
     * 为对象指定着色器填充，供随后调用其他 Graphics 方法（如 lineTo() 或 drawCircle()）时使用。
     * 该填充将保持有效，直到您调用 beginFill()、beginBitmapFill()、beginGradientFill() 或 beginShaderFill() 方法。
     * 调用 clear() 方法会清除填充。  
     * 只要绘制 3 个或更多个点，或者调用 endFill() 方法时，应用程序就会呈现填充。  
     * 在 GPU 呈现下不支持着色器填充；填充的区域将以蓝绿色着色。
     * 
     * @param _shader 要用于填充的着色器。此 Shader 实例无需指定图像输入。但是，如果在着色器中指定图像输入，则必须手动提供输入。要指定输入，请设置 Shader.data 属性的对应 ShaderInput 属性的 input 属性。传递 Shader 实例作为参数时，会在内部复制着色器。绘图填充操作将使用该内部副本，而不是对原始着色器的引用。对着色器进行的任何更改（比如更改参数值、输入或字节代码）不会应用于所复制的用于填充的着色器。
     * @param _matrix 一个 matrix 对象（属于 flash.geom.Matrix 类），可用于对着色器定义转换。着色器中收到的坐标基于为 matrix 参数指定的矩阵。对于默认 (null) 矩阵，着色器中的坐标是可用于对输入采样的局部像素坐标。
     * @deprecated 暂未实现
     */
    beginShaderFill(_shader: unknown, _matrix?: Matrix) {
        this.#lastPath = undefined;
    }

    /** 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。 */
    clear() {
        this.#fill = {
            fill: "none",
            alpha: 1,
            fillRule: "nonzero",
        };
        this.#line = {
            width: 0,
            color: "white",
            alpha: 1,
        };
        this.#defaultGroup.replaceChildren();
        this.#globalDefs.replaceChildren();
        this.#lastPath = undefined;
    }
    /**
     * 将源 Graphics 对象中的所有绘图命令复制到执行调用的 Graphics 对象中。
     * 
     * @param _sourceGraphics 从中复制绘图命令的 Graphics 对象。
     * @deprecated 暂未实现
     */
    copyFrom(_sourceGraphics: Graphics) { }
    /**
     * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。
     * 三次贝塞尔曲线由两个锚点和两个控制点组成。
     * 该曲线内插这两个锚点，并向两个控制点弯曲。  
     * 用于使用 cubicCurveTo() 方法绘制三次贝塞尔曲线的四个点如下所示：
     *    - 当前绘图位置为首个锚点。
     *    - anchorX 和 anchorY 参数指定第二个锚点。
     *    - controlX1 和 controlY1 参数指定首个控制点。
     *    - controlX2 和 controlY2 参数指定第二个控制点。
     * 
     * 如果调用 cubicCurveTo() 方法后才调用 moveTo() 方法，则曲线从位置 (0, 0) 处开始。  
     * 如果 cubicCurveTo() 方法成功调用，则 Flash 运行时将当前绘图位置设置为 (anchorX, anchorY)。
     * 如果 cubicCurveTo() 方法调用失败，则当前绘图位置保持不变。
     * 如果影片剪辑包含使用 Flash 绘图工具创建的内容，则调用 cubicCurveTo() 方法的结果将在该内容下绘制。
     * 
     * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置。
     * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置。
     * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置。
     * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置。
     * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置。
     * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置。
     */
    cubicCurveTo(
        controlX1 = 0,
        controlY1 = 0,
        controlX2 = 0,
        controlY2 = 0,
        anchorX = 0,
        anchorY = 0,
    ) {
        if (!this.#lastPath) {
            this.moveTo(...this.#m);
        }
        this.#lastPath?.setAttribute('d', this.#d += ` C${controlX1} ${controlY1} ${controlX2} ${controlY2} ${anchorX} ${anchorY}`);
    }
    /**
     * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。
     * 当前绘图位置随后设置为 (anchorX, anchorY)。
     * 如果正在其中绘制的影片剪辑包含用 Flash 绘图工具创建的内容，则调用 curveTo() 方法将在该内容下面进行绘制。
     * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。
     * 如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。  
     * 绘制的曲线是二次贝塞尔曲线。
     * 二次贝塞尔曲线包含两个锚点和一个控制点。
     * 该曲线内插这两个锚点，并向控制点弯曲。
     * 
     * @param controlX 一个数字，指定控制点相对于父显示对象注册点的水平位置。
     * @param controlY 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
     * @param anchorX 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
     * @param anchorY 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
     */
    curveTo(
        controlX = 0,
        controlY = 0,
        anchorX = 0,
        anchorY = 0,
    ) {
        if (!this.#lastPath) {
            this.moveTo(...this.#m);
        }
        this.#lastPath?.setAttribute('d', this.#d += ` Q${controlX} ${controlY} ${anchorX} ${anchorY}`);
    }
    /**
     * 绘制一个圆。
     * 在调用 drawCircle() 方法之前，通过调用 linestyle()、lineGradientStyle()、beginFill()、beginGradientFill() 或 beginBitmapFill() 方法来设置线条样式或/和填充。
     * 
     * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
     * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
     * @param radius 圆的半径（以像素为单位）。
     */
    drawCircle(
        x = 0,
        y = 0,
        radius = 0,
    ) {
        if (radius >= 0) {
            const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            c.setAttribute('cx', <any>x);
            c.setAttribute('cy', <any>y);
            c.setAttribute('r', <any>radius);
            this.#applyFill(c);
            this.#applyStroke(c);
            this.#defaultGroup.append(c);
        }
    }
    /**
     * 绘制一个椭圆。
     * 在调用 drawEllipse() 方法之前，通过调用 linestyle()、lineGradientStyle()、beginFill()、beginGradientFill() 或 beginBitmapFill() 方法来设置线条样式或/和填充。
     * 
     * @param x 椭圆边框左上角相对于父显示对象注册点的 x 位置（以像素为单位）。
     * @param y 椭圆边框左上角相对于父显示对象注册点的 y 位置（以像素为单位）。
     * @param width 椭圆的宽度（以像素为单位）。
     * @param height 椭圆的高度（以像素为单位）。
     */
    drawEllipse(
        x = 0,
        y = 0,
        width = 0,
        height = 0,
    ) {

        const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        e.setAttribute('cx', <any>x + width / 2);
        e.setAttribute('cy', <any>y + height / 2);
        e.setAttribute('rx', <any>(width / 2));
        e.setAttribute('ry', <any>(height / 2));
        this.#applyFill(e);
        this.#applyStroke(e);
        this.#defaultGroup.append(e);
    }
    /**
     * 提交一系列 IGraphicsData 实例来进行绘图。
     * 此方法接受一个包含对象（包括路径、填充和笔触）的矢量，这些对象实现 IGraphicsData 接口。
     * 包含 IGraphicsData 实例的矢量可以引用形状的一部分，或引用一组完整定义的复杂数据以呈现完整的形状。  
     * 图形路径可以包含其他图形路径。
     * 如果 graphicsData 矢量包括路径，则在此操作期间将呈现该路径及其所有子路径。
     * 
     * @param _graphicsData 一个包含图形对象的矢量，其中的每个对象都必须实现 IGraphicsData 接口。
     * @deprecated 暂未实现
     */
    drawGraphicsData(_graphicsData: unknown[]) { }
    /**
     * 提交一系列绘制命令。
     * drawPath() 方法接受一个矢量，它由单个的 moveTo()、lineTo() 和 curveTo() 绘图命令构成，这三个命令合并为一个单独的调用。
     * drawPath() 方法参数将绘图命令与 x 和 y 坐标值对以及绘图方向组合起来。
     * 这几个绘图命令是整数，表示为 GraphicsPathCommand 类中定义的常量。
     * x 和 y 坐标值对是数组中的数字，其中的每对数字定义一个坐标位置。
     * 绘图方向为 GraphicsPathWinding 类中的值。  
     * 通常，与使用一系列单个 lineTo() 和 curveTo() 方法调用相比，使用 drawPath() 呈现绘图的速度会更快。  
     * drawPath() 方法使用浮动计算，因此形状的旋转和缩放更准确，可以获得更好的结果。
     * 但是，通过使用 drawPath() 方法提交的曲线在与 lineTo() 和 curveTo() 方法结合使用时，可能会存在小的子像素对齐误差。  
     * drawPath() 方法还使用稍有不同的规则进行填充和绘制线条。
     * 这些规则是：
     *    - 在应用填充以呈现路径时：
     *       - 不呈现少于 3 个点的子路径。（但请注意，笔触呈现仍将发生，并与下面的笔触规则相一致。）
     *       - 隐式闭合未闭合的子路径（结束点不等于开始点）。
     *    - 在应用笔触以呈现路径时：
     *       - 子路径可以由任何数量的点组成。
     *       - 从不隐式闭合子路径。
     * 
     * @param commands 由表示绘图命令的整数构成的矢量。可接受的值集由 GraphicsPathCommand 类中的常量定义。
     * @param data 由数字实例构成的矢量，其中的每一对数字将被视为一个坐标位置（一个 x, y 对）。x 和 y 坐标值对不是 Point 对象；data 矢量是一系列数字，其中的每个由两个数字构成的组表示一个坐标位置。
     * @param winding 使用 GraphicsPathWinding 类中定义的值指定缠绕规则。
     */
    drawPath(
        commands: GraphicsPathCommand[],
        data: number[],
        winding = GraphicsPathWinding.EVEN_ODD,
    ) {
        this.#fill.fillRule = winding === GraphicsPathWinding.NON_ZERO ? 'nonzero' : 'evenodd';
        let d = "M0 0";
        for (const c of commands) {
            switch (c) {
                case GraphicsPathCommand.CUBIC_CURVE_TO: {
                    d += " C" + (data.splice(0, 6).join(" ") || '0 0 0 0 0 0');
                    break;
                }
                case GraphicsPathCommand.CURVE_TO: {
                    d += " Q" + (data.splice(0, 4).join(" ") || '0 0 0 0');
                    break;
                }
                case GraphicsPathCommand.LINE_TO: {
                    d += " L" + (data.splice(0, 2).join(" ") || '0 0');
                    break;
                }
                case GraphicsPathCommand.MOVE_TO: {
                    d += " M" + (data.splice(0, 2).join(" ") || '0 0');
                    break;
                }
                case GraphicsPathCommand.WIDE_LINE_TO: {
                    data.splice(0, 2);
                    d += " L" + (data.splice(0, 2).join(" ") || '0 0');
                    break;
                }
                case GraphicsPathCommand.WIDE_MOVE_TO: {
                    data.splice(0, 2);
                    d += " M" + (data.splice(0, 2).join(" ") || '0 0');
                    break;
                }
                default: {
                    break;
                }
            }
        }
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        this.#applyFill(path);
        this.#applyStroke(path);
        this.#defaultGroup.appendChild(path);
    }
    /**
     * 绘制一个矩形。
     * 在调用 drawRect() 方法之前，通过调用 linestyle()、lineGradientStyle()、beginFill()、beginGradientFill() 或 beginBitmapFill() 方法来设置线条样式或/和填充。
     * 
     * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
     * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
     * @param width 矩形的宽度（以像素为单位）。
     * @param height 矩形的高度（以像素为单位）。
     */
    drawRect(
        x = 0,
        y = 0,
        width = 0,
        height = 0,
    ) {
        if (width < 0) {
            x += width;
            width = -width;
        }
        if (height < 0) {
            y += height;
            height = -height;
        }
        const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        r.setAttribute('x', <any>x);
        r.setAttribute('y', <any>y);
        r.setAttribute('width', <any>width || 0);
        r.setAttribute('height', <any>height || 0);
        this.#applyFill(r);
        this.#applyStroke(r);
        this.#defaultGroup.append(r);
    }
    /**
     * 绘制一个圆角矩形。
     * 在调用 drawRoundRect() 方法之前，通过调用 linestyle()、lineGradientStyle()、beginFill()、beginGradientFill() 或 beginBitmapFill() 方法来设置线条样式或/和填充。
     * 
     * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
     * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
     * @param width 圆角矩形的宽度（以像素为单位）。
     * @param height 圆角矩形的高度（以像素为单位）。
     * @param ellipseWidth 用于绘制圆角的椭圆的宽度（以像素为单位）。
     * @param ellipseHeight 用于绘制圆角的椭圆的高度（以像素为单位）。（可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
     */
    drawRoundRect(
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        ellipseWidth = 0,
        ellipseHeight = ellipseWidth,
    ) {
        if (width < 0) {
            x += width;
            width = -width;
        }
        if (height < 0) {
            y += height;
            height = -height;
        }
        const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        r.setAttribute('x', <any>x);
        r.setAttribute('y', <any>y);
        r.setAttribute('width', <any>width || 0);
        r.setAttribute('height', <any>height || 0);
        r.setAttribute('rx', <any>ellipseWidth);
        r.setAttribute('ry', <any>ellipseHeight);
        this.#applyFill(r);
        this.#applyStroke(r);
        this.#defaultGroup.append(r);
    }
    /**
     * 呈现一组三角形（通常用于扭曲位图），并为其指定三维外观。
     * drawTriangles() 方法使用一组 (u,v) 坐标将当前填充或位图填充映射到三角形面。  
     * 可以使用任何类型的填充，但如果填充有转换矩阵，则将忽略该转换矩阵。  
     * 在使用位图填充时，uvtData 参数可改善纹理映射。
     * 
     * @param vertices 由数字构成的矢量，其中的每一对数字将被视为一个坐标位置（一个 x, y 对）。vertices 参数是必需的。
     * @param indices 一个由整数或索引构成的矢量，其中每三个索引定义一个三角形。如果 indexes 参数为 null，则每三个顶点（vertices 矢量中的 6 对 x,y）定义一个三角形。否则，每个索引将引用一个顶点，即 vertices 矢量中的一对数字。例如，indexes[1] 引用 (vertices[2], vertices[3])。indexes 参数是可选的，但 indexes 通常会减少提交的数据量和计算的数据量。
     * @param _uvtData 由用于应用纹理映射的标准坐标构成的矢量。每个坐标引用用于填充的位图上的一个点。每个顶点必须具有一个 UV 或一个 UVT 坐标。对于 UV 坐标，(0,0) 是位图的左上角，(1,1) 是位图的右下角。如果此矢量的长度是 vertices 矢量长度的两倍，则使用标准坐标而不进行透视校正。如果此矢量的长度是 vertices 矢量长度的三倍，则将第三个坐标解释为“t”（即在视角空间中从视点到纹理的距离）。这有助于呈现引擎在三维中映射纹理时正确应用透视。如果 uvtData 参数为 null，则将应用普通填充规则（和任何填充类型）。
     * @param culling 指定是否呈现面向指定方向的三角形。此参数可防止呈现在当前视图中看不见的三角形。此参数可设置为由 TriangleCulling 类定义的任何值。
     */
    drawTriangles(
        vertices: number[],
        indices?: number[],
        _uvtData?: number[],
        culling = TriangleCulling.NONE,
    ) {
        if (!indices) {
            indices = [];
            for (let i = 0; i < vertices.length; i += 2) {
                indices.push(i / 2);
            }
        } else {
            indices = indices.slice(0);
        }
        // Do culling of triangles here to lessen work later
        if (culling !== TriangleCulling.NONE) {
            for (let i = 0; i < indices.length / 3; i++) {
                const ux = vertices[2 * indices[i * 3 + 1]!]! - vertices[2 * indices[i * 3]!]!,
                    uy = vertices[2 * indices[i * 3 + 1]! + 1]! - vertices[2 * indices[i * 3]! + 1]!,
                    vx = vertices[2 * indices[i * 3 + 2]!]! - vertices[2 * indices[i * 3 + 1]!]!,
                    vy = vertices[2 * indices[i * 3 + 2]! + 1]! - vertices[2 * indices[i * 3 + 1]! + 1]!;
                const zcomp = ux * vy - vx * uy;
                if (zcomp < 0 && culling === TriangleCulling.POSITIVE || zcomp > 0 && culling === TriangleCulling.NEGATIVE) {
                    // Remove the indices. Leave the vertices. 
                    indices.splice(i * 3, 3);
                    i--;
                }
            }
        }
        const commands: GraphicsPathCommand[] = [];
        const data: number[] = [];
        for (let i = 0; i < indices.length / 3; i++) {
            const a = indices[3 * i]!,
                b = indices[3 * i + 1]!,
                c = indices[3 * i + 2]!;
            const ax = vertices[2 * a]!, ay = vertices[2 * a + 1]!;
            const bx = vertices[2 * b]!, by = vertices[2 * b + 1]!;
            const cx = vertices[2 * c]!, cy = vertices[2 * c + 1]!;
            commands.push(1, 2, 2, 2);
            data.push(ax, ay, bx, by, cx, cy, ax, ay);
        }
        this.drawPath(commands, data, GraphicsPathWinding.EVEN_ODD);
    }
    /**
     * 对从上一次调用 beginFill()、beginGradientFill() 或 beginBitmapFill() 方法之后添加的直线和曲线应用填充。
     * Flash 使用的是对 beginFill()、beginGradientFill() 或 beginBitmapFill() 方法的先前调用中指定的填充。
     * 如果当前绘图位置不等于 moveTo() 方法中指定的上一个位置，而且定义了填充，则用线条闭合该路径，然后进行填充。
     */
    endFill() {
        this.#fill.fill = "none";
        this.#lastPath = undefined;
    }
    /**
     * 指定一个位图，用于绘制线条时的线条笔触。  
     * 位图线条样式将用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
     * 线条样式仍然有效，直到您使用不同的参数调用 lineStyle() 或 lineGradientStyle() 方法或再次调用 lineBitmapStyle() 方法。  
     * 可以在绘制路径的中间调用 lineBitmapStyle() 方法以为路径中的不同线段指定不同的样式。  
     * 请在调用 lineBitmapStyle() 方法之前调用 lineStyle() 方法以启用笔触，否则线条样式的值将为 undefined。  
     * 调用 clear() 方法会将线条样式设置回 undefined。
     * 
     * @param _bitmap 用于线条笔触的位图。
     * @param _matrix 一个由 flash.geom.Matrix 类定义的可选转换矩阵。该矩阵可用于在将位图应用于线条样式之前缩放位图或以其他方式处理位图。
     * @param _repeat 是否以平铺方式重复位图。
     * @param _smooth 是否应对位图应用平滑处理。
     * @deprecated 暂未实现
     */
    lineBitmapStyle(
        _bitmap: BitmapData,
        _matrix?: Matrix,
        _repeat = true,
        _smooth = false,
    ) {
        this.#lastPath = undefined;
    }
    /**
     * 指定一种渐变，用于绘制线条时的笔触。  
     * 渐变线条样式将用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
     * 线条样式仍然有效，直到您使用不同的参数调用 lineStyle() 或 lineBitmapStyle() 方法或再次调用 lineGradientStyle() 方法。  
     * 可以在绘制路径的中间调用 lineGradientStyle() 方法以为路径中的不同线段指定不同的样式。  
     * 请在调用 lineGradientStyle() 方法之前调用 lineStyle() 方法以启用笔触，否则线条样式的值将为 undefined。
     * 调用 clear() 方法会将线条样式设置回 undefined。
     * 
     * @param _type 用于指定要使用哪种渐变类型的 GradientType 类的值。
     * @param _colors 要在渐变中使用的 RGB 十六进制颜色值数组（例如，红色为 0xFF0000，蓝色为 0x0000FF 等等）。
     * @param _alphas colors 数组中对应颜色的 alpha 值数组；有效值为 0 到 1。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
     * @param _ratios 颜色分布比率的数组；有效值为 0 到 255。该值定义 100% 采样的颜色所在位置的宽度百分比。值 0 表示渐变框中的左侧位置，255 表示渐变框中的右侧位置。此值表示渐变框中的位置，而不是最终渐变的坐标空间，最终渐变可能会比渐变框更宽或更窄。为 colors 参数中的每个值指定一个值。数组中的值必须持续增加；例如，[0, 63, 127, 190, 255]。
     * @param _matrix 一个由 flash.geom.Matrix 类定义的转换矩阵。flash.geom.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 lineGradientStyle() 方法一起使用。
     * @param _spreadMethod 用于指定要使用哪种 spread 方法的 SpreadMethod 类的值。
     * @param _interpolationMethod InterpolationMethod 类中用于指定要使用的值的值。
     * @param _focalPointRatio 一个控制渐变的焦点位置的数字。值 0 表示焦点位于中心。值 1 表示焦点位于渐变圆的一条边界上。值 -1 表示焦点位于渐变圆的另一条边界上。小于 -1 或大于 1 的值将舍入为 -1 或 1。
     * @deprecated 暂未实现
     */
    lineGradientStyle(
        _type: GradientType,
        _colors: number[],
        _alphas: number[],
        _ratios: number[],
        _matrix?: Matrix,
        _spreadMethod = SpreadMethod.PAD,
        _interpolationMethod = InterpolationMethod.RGB,
        _focalPointRatio = 0,
    ) {
        this.#lastPath = undefined;
    }
    /**
     * 指定一个着色器以用于绘制线条时的线条笔触。  
     * 着色器线条样式将用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
     * 线条样式仍然有效，直到您使用不同的参数调用 lineStyle() 或 lineGradientStyle() 方法或再次调用 lineBitmapStyle() 方法。  
     * 可以在绘制路径的中间调用 lineShaderStyle() 方法，以便为路径中的不同线段指定不同的样式。  
     * 请在调用 lineShaderStyle() 方法之前调用 lineStyle() 方法以启用笔触，否则线条样式的值将为 undefined。  
     * 调用 clear() 方法会将线条样式设置回 undefined。
     * 
     * @param _shader 用于线条笔触的着色器。
     * @param _matrix 一个由 flash.geom.Matrix 类定义的可选转换矩阵。该矩阵可用于在将位图应用于线条样式之前缩放位图或以其他方式处理位图。
     */
    lineShaderStyle(_shader: unknown, _matrix?: Matrix) {
        this.#lastPath = undefined;
    }
    /**
     * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
     * 线条样式仍然有效，直到您使用不同的参数调用 lineGradientStyle() 方法、lineBitmapStyle() 方法或 lineStyle() 方法。  
     * 可以在绘制路径的中间调用 lineStyle() 方法以为路径中的不同线段指定不同的样式。  
     * **注意：**调用 clear() 方法会将线条样式设置回 undefined。  
     * **注意：**Flash Lite 4 仅支持前 3 个参数（thickness、color 和 alpha）。
     * 
     * @param thickness 一个整数，以点为单位表示线条的粗细；有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
     * @param color 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
     * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
     * @param _pixelHinting （在 Flash Lite 4 中不受支持）布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。如果未提供值，则线条不使用像素提示。
     * @param _scaleMode LineScaleMode 类的值
     * @param caps 用于指定线条末端处端点类型的 CapsStyle 类的值。如果未表示值，则 Flash 使用圆头端点。
     * @param joints JointStyle 类的值，指定用于拐角的连接外观的类型。如果未表示值，则 Flash 使用圆角连接。**注意：**对于设置为 JointStyle.MITER 的 joints，您可以使用 miterLimit 参数限制尖角的长度。
     * @param miterLimit 用于表示剪切斜接的极限值的数字。有效值的范围是 1 到 255（超出该范围的值将舍入为 1 或 255）。此值只可用于 jointStyle 设置为 "miter" 的情况下。miterLimit 值表示向外延伸的尖角可以超出角边相交所形成的结合点的长度。此值表示为线条 thickness 的因子。请注意，对于给定的 miterLimit 值，会有一个被切断的尖角的特定最大角度。
     */
    lineStyle(
        thickness: number,
        color = 0,
        alpha = 1,
        _pixelHinting = false,
        _scaleMode = LineScaleMode.NORMAL,
        caps?: CapsStyle,
        joints?: JointStyle,
        miterLimit = 3,
    ) {
        this.#line.width = thickness;
        this.#line.color = hex8(color);
        this.#line.alpha = alpha;
        caps && (this.#line.caps = caps);
        joints && (this.#line.joints = joints);
        miterLimit && (this.#line.miterLimit = miterLimit);
        this.#lastPath = undefined;
    }
    /**
     * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
     * 如果正在其中绘制的显示对象包含用 Flash 绘图工具创建的内容，则调用 lineTo() 方法将在该内容下面进行绘制。
     * 如果在对 moveTo() 方法进行任何调用之前调用了 lineTo()，则当前绘图的默认位置为 (0, 0)。  
     * 如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
     * 
     * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
     * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
     */
    lineTo(x = 0, y = 0) {
        if (!this.#lastPath) {
            this.moveTo(...this.#m);
        }
        this.#lastPath?.setAttribute('d', this.#d += ` L${x || 0} ${y || 0}`);
    }
    /**
     * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
     * 
     * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
     * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
     */
    moveTo(x = 0, y = 0) {
        if (!this.#lastPath || this.#fill.fill !== "none") {
            this.#lastPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            this.#lastPath.setAttribute('d', this.#d = `M${x} ${y}`);
            this.#applyFill(this.#lastPath);
            this.#applyStroke(this.#lastPath);
            this.#defaultGroup.append(this.#lastPath);
        } else {
            // 只有在 pure stroke (fill === "none") 时，才安全地在同一 path 中追加 M
            this.#lastPath.setAttribute('d', this.#d += ` M${x} ${y}`);
        }
        this.#m = [x, y];
    }
    /**
     * 查询 Sprite 或 Shape 对象（也可以是其子对象）的矢量图形内容。
     * 结果是一个由 IGraphicsData 对象构成的矢量。
     * 转换是在进行查询之前应用到显示对象的，因此返回路径全部在同一坐标空间中。
     * 结果数据集中的坐标是相对于舞台的，而不是相对于进行采样的显示对象。  
     * 结果包括以下类型的对象，并具有指定限制：
     *    - GraphicsSolidFill
     *    - GraphicsGradientFill
     *       - 渐变填充的所有属性由 readGraphicsData() 返回。
     *       - 返回的矩阵接近输入矩阵，但不完全等同。
     *    - GraphicsEndFill
     *    - GraphicsBitmapFill
     *       - 返回的矩阵接近输入矩阵，但不完全等同。
     *       - repeat 始终为 true。
     *       - smooth 始终为 false。
     *    - GraphicsStroke
     *       - 支持 thickness。
     *       - 如前所述，fill 支持 GraphicsSolidFill、GraphicsGradientFill 及 GraphicsBitmapFill
     *       - 所有其他属性均有默认值。
     *    - GraphicsPath
     *       - 仅支持 MOVE_TO、CURVE_TO 和 LINE_TO 命令。
     * 
     * 无法表示以下可视元素和转换，因此它们不会包括在结果中：
     *    - 屏蔽
     *    - 文本，但有一个例外：用消除锯齿类型“动画消除锯齿”定义的静态文本将作为矢量图形呈现，因此包括在结果中。
     *    - 着色器填充
     *    - 混合模式
     *    - 9 切片缩放
     *    - 三角形（用 drawTriangles() 方法创建）
     *    - 不透明的背景
     *    - scrollrect 设置
     *    - 2.5D 转换
     *    - 非可见对象（其 visible 属性为 false 的对象）
     * 
     * @param _recurse 运行时是否还应查询当前显示对象的子对象。执行递归查询会花费更多的时间和内存。查询结果将以单一的拼合结果集返回，不会按显示对象分隔开。
     * @deprecated 暂未实现
     */
    readGraphicsData(_recurse = true) { }
}
/** 线条样式 */
interface LineContext {
    width: number;
    color: string;
    alpha: number;
    caps?: CapsStyle;
    joints?: JointStyle;
    miterLimit?: number;
}