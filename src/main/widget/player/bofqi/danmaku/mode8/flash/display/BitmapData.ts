import { applyFilter, type BitmapFilter } from "../filters";
import type { ColorTransform } from "../geom/ColorTransform";
import type { Matrix } from "../geom/Matrix";
import type { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { BitmapDataChannel } from "./BitmapDataChannel";
import { BlendMode } from "./BlendMode";
import type { StageQuality } from "./StageQuality";

/** BitmapData内部canvas元素的键 */
export const canvas = Symbol('canvas');

export class BitmapData {
    [canvas] = document.createElement('canvas');
    #context = this[canvas].getContext('2d')!;
    get rect() {
        return new Rectangle(0, 0, this.width, this.height);
    }
    constructor(
        public readonly width: number,
        public readonly height: number,
        public readonly transparent = true,
        private fillColor = 0xFFFFFFFF,
    ) {

        this[canvas].width = width;
        this[canvas].height = height;


        if (transparent) {
            this.#context.clearRect(0, 0, width, height);
        } else {
            this.fillRect(new Rectangle(0, 0, width, height), fillColor);
        }
    }
    /**
     * 将滤镜对象应用于此 BitmapData 对象。
     * @param sourceBitmapData 源 BitmapData 对象。
     * @param sourceRect 一个 Rectangle 对象，定义要进行滤镜处理的像素区域。
     * @param destPoint 一个 Point 对象，定义将复制的像素区域的左上角位置。
     * @param filter 要应用的滤镜对象。
     */
    applyFilter(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, filter: BitmapFilter) {
        // SVG 滤镜的实现需要一个 SVG 容器
        const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgContainer.setAttribute('width', `${sourceRect.width}`);
        svgContainer.setAttribute('height', `${sourceRect.height}`);

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filterElement = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filterElement.setAttribute('id', 'tempFilter');


        const { primitives: primitives } = filter[applyFilter]('SourceGraphic');

        filterElement.innerHTML = primitives;
        defs.appendChild(filterElement);
        svgContainer.appendChild(defs);

        // 创建一个指向源 BitmapData 的 SVG image
        const svgImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        svgImage.setAttribute('width', `${sourceRect.width}`);
        svgImage.setAttribute('height', `${sourceRect.height}`);
        svgImage.setAttribute('href', sourceBitmapData[canvas].toDataURL());
        svgImage.setAttribute('filter', `url(#tempFilter)`);
        svgContainer.appendChild(svgImage);

        // 异步等待 SVG 渲染完成
        const svgString = new XMLSerializer().serializeToString(svgContainer);
        const img = new Image();

        return new Promise<void>((resolve) => {
            img.onload = () => {
                // 清空当前 BitmapData 的 Canvas
                this.#context.clearRect(0, 0, this.width, this.height);

                // 将滤镜后的图像绘制回当前 BitmapData 的 Canvas
                this.#context.drawImage(
                    img,
                    0,
                    0,
                    sourceRect.width,
                    sourceRect.height,
                    destPoint.x,
                    destPoint.y,
                    sourceRect.width,
                    sourceRect.height,
                );
                resolve();
            };
            img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
        });
    }
    /**
     * 返回一个新的 BitmapData 对象，它是对原始实例的克隆，包含与原始实例所含位图完全相同的副本。
     * @returns 一个新的 BitmapData 对象，它与原始对象相同。
     */
    clone() {
        return new BitmapData(this.width, this.height, this.transparent, this.fillColor);
    }
    /**
     * 将颜色转换对象应用于此 BitmapData 对象。
     * @param rect 要应用颜色转换的矩形区域。
     * @param colorTransform 要应用的 ColorTransform 对象。
     */
    colorTransform(rect: Rectangle, colorTransform: ColorTransform) {
        const imageData = this.#context.getImageData(rect.x, rect.y, rect.width, rect.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i]!;
            let g = data[i + 1]!;
            let b = data[i + 2]!;
            let a = data[i + 3]!;

            // 应用乘数和偏移量
            r = r * colorTransform.redMultiplier + colorTransform.redOffset;
            g = g * colorTransform.greenMultiplier + colorTransform.greenOffset;
            b = b * colorTransform.blueMultiplier + colorTransform.blueOffset;
            a = a * colorTransform.alphaMultiplier + colorTransform.alphaOffset;

            // 夹紧值到 0-255 范围
            data[i] = Math.min(255, Math.max(0, r));
            data[i + 1] = Math.min(255, Math.max(0, g));
            data[i + 2] = Math.min(255, Math.max(0, b));
            data[i + 3] = Math.min(255, Math.max(0, a));
        }

        this.#context.putImageData(imageData, rect.x, rect.y);
    }
    /**
     * 比较两个 BitmapData 对象的像素数据。
     * @param otherBitmapData 要与当前 BitmapData 对象进行比较的另一个 BitmapData 对象。
     * @returns 一个新的 BitmapData 对象，它显示两个位图之间的差异。如果两个位图的尺寸不同，则返回 null。
     */
    compare(otherBitmapData: BitmapData): BitmapData | null {
        // 检查两个位图的尺寸是否相同
        if (this.width !== otherBitmapData.width || this.height !== otherBitmapData.height) {
            return null;
        }

        // 创建一个用于存放比较结果的新 BitmapData 对象
        const resultBitmapData = new BitmapData(this.width, this.height, false, 0x000000);

        // 获取两个位图的像素数据
        const thisImageData = this.#context.getImageData(0, 0, this.width, this.height);
        const otherImageData = otherBitmapData.#context.getImageData(0, 0, otherBitmapData.width, otherBitmapData.height);

        const thisData = thisImageData.data;
        const otherData = otherImageData.data;
        const resultData = resultBitmapData.#context.getImageData(0, 0, resultBitmapData.width, resultBitmapData.height).data;

        // 逐像素比较
        for (let i = 0; i < thisData.length; i += 4) {
            const r1 = thisData[i];
            const g1 = thisData[i + 1];
            const b1 = thisData[i + 2];
            const a1 = thisData[i + 3];

            const r2 = otherData[i];
            const g2 = otherData[i + 1];
            const b2 = otherData[i + 2];
            const a2 = otherData[i + 3];

            if (r1 === r2 && g1 === g2 && b1 === b2 && a1 === a2) {
                // 像素相同，写入黑色
                resultData[i] = 0;
                resultData[i + 1] = 0;
                resultData[i + 2] = 0;
                resultData[i + 3] = 255;
            } else {
                // 像素不同，写入白色
                resultData[i] = 255;
                resultData[i + 1] = 255;
                resultData[i + 2] = 255;
                resultData[i + 3] = 255;
            }
        }

        // 将结果数据写回新的 BitmapData
        resultBitmapData.#context.putImageData(new ImageData(resultData, resultBitmapData.width, resultBitmapData.height), 0, 0);

        return resultBitmapData;
    }
    /**
     * 使用一个源 BitmapData 对象的指定通道，来更新当前 BitmapData 对象的指定通道。
     * @param sourceBitmapData 包含要用于通道复制的通道的源 BitmapData 对象。
     * @param sourceRect 一个 Rectangle 对象，它定义源 BitmapData 对象的区域。
     * @param destPoint 一个 Point 对象，它定义要复制像素的目标位图数据中的左上角点。
     * @param sourceChannel 一个 BitmapDataChannel 常量，它指定要用作新通道的源通道（如 BitmapDataChannel.RED）。
     * @param destChannel 一个 BitmapDataChannel 常量，它指定要更新的目标通道（如 BitmapDataChannel.BLUE）。
     */
    copyChannel(
        sourceBitmapData: BitmapData,
        sourceRect: Rectangle,
        destPoint: Point,
        sourceChannel: BitmapDataChannel,
        destChannel: BitmapDataChannel,
    ) {
        const sourceImageData = sourceBitmapData.#context.getImageData(sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height);
        const destImageData = this.#context.getImageData(destPoint.x, destPoint.y, sourceRect.width, sourceRect.height);

        const sourceData = sourceImageData.data;
        const destData = destImageData.data;

        const sourceOffset = sourceChannel === BitmapDataChannel.RED ? 0 :
            sourceChannel === BitmapDataChannel.GREEN ? 1 :
                sourceChannel === BitmapDataChannel.BLUE ? 2 : 3;

        const destOffset = destChannel === BitmapDataChannel.RED ? 0 :
            destChannel === BitmapDataChannel.GREEN ? 1 :
                destChannel === BitmapDataChannel.BLUE ? 2 : 3;

        for (let i = 0; i < sourceData.length; i += 4) {
            destData[i + destOffset] = sourceData[i + sourceOffset]!;
        }

        this.#context.putImageData(destImageData, destPoint.x, destPoint.y);
    }
    /**
     * 将源 BitmapData 的像素复制到目标 BitmapData。
     * @param sourceBitmapData 要从中复制像素的 BitmapData 对象。
     * @param sourceRect 一个 Rectangle 对象，它定义 sourceBitmapData 对象的区域。
     * @param destPoint 一个 Point 对象，它定义目标 BitmapData 对象中的目标位置。
     */
    copyPixels(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point) {
        this.#context.drawImage(
            sourceBitmapData[canvas],
            sourceRect.x,
            sourceRect.y,
            sourceRect.width,
            sourceRect.height,
            destPoint.x,
            destPoint.y,
            sourceRect.width,
            sourceRect.height,
        );
    }
    /**
     * 将源 DisplayObject 绘制到此 BitmapData 对象上。
     * @param source 一个 DisplayObject（或一个包含 canvas 属性的对象），它将作为源图像进行绘制。
     * @param matrix 可选的 Matrix 对象，用于在绘制时应用变换。
     * @param colorTransform 可选的 ColorTransform 对象，用于在绘制时应用颜色变换。
     * @param blendMode 可选的 BlendMode，指定混合模式。
     * @param clipRect 可选的 Rectangle 对象，用于定义源对象的裁剪区域。
     * @param smoothing 指定是否平滑绘制。
     */
    draw(source: IBitmapDrawable, matrix?: Matrix, colorTransform?: ColorTransform, blendMode?: BlendMode, clipRect?: Rectangle, smoothing?: boolean) {
        this.#context.save();
        smoothing && (this.#context.imageSmoothingEnabled = smoothing);

        // 应用矩阵变换
        if (matrix) {
            this.#context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        }

        // 应用剪裁矩形
        if (clipRect) {
            this.#context.beginPath();
            this.#context.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
            this.#context.clip();
        }

        // 应用混合模式
        switch (blendMode) {
            case BlendMode.ADD: {
                this.#context.globalCompositeOperation = <any>'plus-lighter';
                break;
            }
            case BlendMode.DARKEN: {
                this.#context.globalCompositeOperation = 'darken';
                break;
            }
            case BlendMode.DIFFERENCE: {
                this.#context.globalCompositeOperation = 'difference';
                break;
            }
            case BlendMode.HARDLIGHT: {
                this.#context.globalCompositeOperation = 'hard-light';
                break;
            }
            case BlendMode.LIGHTEN: {
                this.#context.globalCompositeOperation = 'lighten';
                break;
            }
            case BlendMode.MULTIPLY: {
                this.#context.globalCompositeOperation = 'multiply';
                break;
            }
            case BlendMode.OVERLAY: {
                this.#context.globalCompositeOperation = 'overlay';
                break;
            }
            case BlendMode.SCREEN: {
                this.#context.globalCompositeOperation = 'screen';
                break;
            }
        }

        // 绘制源
        if (source instanceof BitmapData) {
            this.#context.drawImage(source[canvas], 0, 0);
        } else {
            // 这里可以处理其他类型的显示对象，例如 HTMLImageElement, HTMLVideoElement 等
            this.#context.drawImage(source[canvas], 0, 0);
        }

        // 恢复上下文状态
        this.#context.restore();

        // 颜色变换需要手动实现，因为它无法直接通过 Canvas API 完成
        if (colorTransform) {
            // 获取绘制后的像素数据
            const imageData = this.#context.getImageData(0, 0, this.width, this.height);
            const data = imageData.data;

            // 应用颜色转换
            const rm = colorTransform.redMultiplier;
            const gm = colorTransform.greenMultiplier;
            const bm = colorTransform.blueMultiplier;
            const am = colorTransform.alphaMultiplier;
            const ro = colorTransform.redOffset;
            const go = colorTransform.greenOffset;
            const bo = colorTransform.blueOffset;
            const ao = colorTransform.alphaOffset;

            for (let i = 0; i < data.length; i += 4) {
                data[i] = (data[i]! * rm + ro) > 255 ? 255 : ((data[i]! * rm + ro) < 0 ? 0 : (data[i]! * rm + ro));
                data[i + 1] = (data[i + 1]! * gm + go) > 255 ? 255 : ((data[i + 1]! * gm + go) < 0 ? 0 : (data[i + 1]! * gm + go));
                data[i + 2] = (data[i + 2]! * bm + bo) > 255 ? 255 : ((data[i + 2]! * bm + bo) < 0 ? 0 : (data[i + 2]! * bm + bo));
                data[i + 3] = (data[i + 3]! * am + ao) > 255 ? 255 : ((data[i + 3]! * am + ao) < 0 ? 0 : (data[i + 3]! * am + ao));
            }

            // 将修改后的像素数据放回 Canvas
            this.#context.putImageData(imageData, 0, 0);
        }
    }
    /**
     * 使用 Flash 运行时矢量渲染器在位图图像上绘制 source 显示对象。可以指定 matrix、colorTransform、blendMode 和目标 clipRect 参数来控制呈现的执行方式。您可以根据需要指定是否应在缩放时对位图进行平滑处理（这只适用于源对象是 BitmapData 对象的情况）。  
     * 注意：drawWithQuality() 方法与 draw() 方法非常相似，但不使用 Stage.quality 属性确定矢量呈现的品质，您需要为 drawWithQuality() 方法指定 quality 参数。  
     * 此方法与如何在创作工具界面中使用对象的标准矢量渲染器来绘制对像直接对应。  
     * 源显示对象不对此调用使用其任何已应用的转换。它会被视为存在于库或文件中，没有矩阵转换、没有颜色转换，也没有混合模式。要使用对象自己的 transform 属性来绘制显示对象（如影片剪辑），可以将其 transform 属性对象复制到使用 BitmapData 对象的 Bitmap 对象的 transform 属性。  
     * 在 Flash Player 9.0.115.0 及更高版本和 Adobe AIR 中，通过 RTMP 支持此方法。在 Flash Media Server 上，可以在服务器端脚本中控制对流的访问。有关详细信息，请参阅 Server-Side ActionScript Language Reference for Adobe Flash Media Server（《Adobe Flash Media Server 服务器端 ActionScript 语言参考》）中的 Client.audioSampleAccess 和 Client.videoSampleAccess 属性。  
     * 如果源对象（如果是 Sprite 或 MovieClip 对象）和其所有子对象与调用方不来自同一个域，或者不在调用方可通过调用 Security.allowDomain() 方法访问的内容中，则调用 drawWithQuality() 将引发 SecurityError 异常。此限制不适用于应用程序安全沙箱中的 AIR 内容。  
     * 对于使用所加载的位图图像作为 source 也有一些限制。如果所加载的图像来自与调用方相同的域，则调用 drawWithQuality() 方法将成功。此外，图像服务器上的跨域策略文件可以向调用 drawWithQuality() 方法的 SWF 内容的域授予权限。在这种情况下，必须设置 LoaderContext 对象的 checkPolicyFile 属性，并在调用用于加载图像的 Loader 对象的 load() 方法时使用 LoaderContext 对象作为 context 参数。这些限制不适用于应用程序安全沙箱中的 AIR 内容。  
     * 在 Windows 中，drawWithQuality() 方法无法在 Adobe AIR 的 HTMLLoader 对象中捕获嵌入 HTML 页中的 SWF 内容。  
     * drawWithQuality() 方法无法捕获 Adobe AIR 中的 PDF 内容。也无法捕获 Adobe AIR 中 wmode 属性设置为“window”的 HTML 中嵌入的 SWF 内容。
     * @param source 要绘制到 BitmapData 对象的显示对象或 BitmapData 对象。（DisplayObject 和 BitmapData 类实现 IBitmapDrawable 接口。）
     * @param matrix (default = null) — 一个 Matrix 对象，用于缩放、旋转位图或转换位图的坐标。如果不想将矩阵转换应用于图像，请将此参数设置为恒等矩阵（使用默认 new Matrix() 构造函数创建），或传递 null 值。
     * @param colorTransform (default = null) — 一个 ColorTransform 对象，用于调整位图的颜色值。如果没有提供任何对象，则不会转换位图图像的颜色。如果必须传递此参数但又不想转换图像，请将此参数设置为使用默认 new ColorTransform() 构造函数创建的 ColorTransform 对象。
     * @param blendMode (default = null) — 来自 flash.display.BlendMode 类的一个字符串值，指定要应用于所生成位图的混合模式。
     * @param clipRect (default = null) — 一个 Rectangle 对象，定义要绘制的源对象的区域。 如果不提供此值，则不会进行剪裁，并且将绘制整个源对象。
     * @param smoothing (default = false) — 一个布尔值，用于确定因在 matrix 参数中指定缩放或旋转而对 BitmapData 对象进行缩放或旋转以后，是否对该对象进行平滑处理。smoothing 参数只有在 source 参数是 BitmapData 对象时才适用。在将 smoothing 设置为 false 的情况下，经过旋转或缩放的 BitmapData 图像可能会显得像素化或带有锯齿。
     * @param _quality (default = null) — 任意一个 StageQuality 值。选择要在绘制矢量图形时使用的消除锯齿品质。
     */
    drawWithQuality(source: IBitmapDrawable, matrix?: Matrix, colorTransform?: ColorTransform, blendMode?: BlendMode, clipRect?: Rectangle, smoothing?: boolean, _quality?: StageQuality) {
        this.draw(source, matrix, colorTransform, blendMode, clipRect, smoothing);
    }
    /**
     * 使用指定的颜色填充一个矩形区域。
     * @param rect 要填充的矩形区域。
     * @param color 用于填充矩形的 32 位 ARGB 颜色值。
     */
    fillRect(rect: Rectangle, color: number) {
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;
        const a = (color >> 24) & 0xFF;
        const hexColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
        this.#context.fillStyle = hexColor;
        this.#context.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
    /**
     * 用指定的颜色填充一个封闭区域。
     * @param x 像素的 x 坐标。
     * @param y 像素的 y 坐标。
     * @param color 用于填充的 32 位 ARGB 颜色值。
     */
    floodFill(x: number, y: number, color: number) {
        // 检查起始点是否在位图边界内
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }

        const targetColor = this.getPixel(x, y);

        // 如果起始像素颜色与新颜色相同，则无需填充
        if (targetColor === color) {
            return;
        }

        const queue: { x: number, y: number }[] = [];
        queue.push({ x, y });

        const visited = new Set<string>();

        const width = this.width;
        const height = this.height;

        while (queue.length > 0) {
            const { x: currentX, y: currentY } = queue.shift()!;

            const key = `${currentX},${currentY}`;
            if (visited.has(key)) {
                continue;
            }
            visited.add(key);

            const currentPixelColor = this.getPixel(currentX, currentY);

            // 如果当前像素与目标颜色不匹配，则跳过
            if (currentPixelColor !== targetColor) {
                continue;
            }

            // 匹配，则设置新颜色
            this.setPixel(currentX, currentY, color);

            // 检查并添加邻居像素
            // 上
            if (currentY > 0) {
                queue.push({ x: currentX, y: currentY - 1 });
            }
            // 下
            if (currentY < height - 1) {
                queue.push({ x: currentX, y: currentY + 1 });
            }
            // 左
            if (currentX > 0) {
                queue.push({ x: currentX - 1, y: currentY });
            }
            // 右
            if (currentX < width - 1) {
                queue.push({ x: currentX + 1, y: currentY });
            }
        }
    }
    /**
     * 已知 BitmapData 对象、源矩形和滤镜对象，确定 applyFilter() 方法调用所影响的目标矩形。  
     * 例如，模糊滤镜影响的区域通常比原始图像大。由一个默认 BlurFilter 实例过滤的 100 x 200 像素图像，其中 blurX = blurY = 4 将生成一个目标矩形 (-2,-2,104,204)。generateFilterRect() 方法使您可以提前了解到此目标矩形的大小，以便能够在执行滤镜操作之前相应地调整目标图像的大小。  
     * 有些滤镜会基于源图像大小裁剪其目标矩形。例如，一个内部 DropShadow 不会生成比其源图像大的结果。在此 API 中，BitmapData 对象用作源范围而不是源 rect 参数。
     * @param _sourceRect 一个矩形，它定义要用作输入的源图像的区域。
     * @param _filter  一个滤镜对象，用于计算目标矩形。
     * @returns 一个目标矩形，它是使用图像、sourceRect 参数和滤镜计算得到的。
     */
    generateFilterRect(_sourceRect: Rectangle, _filter: BitmapFilter) {
        return this.rect;
    }
    /**
     * 确定矩形区域是将位图图像中指定颜色的所有像素完全包括起来（如果将 findColor 参数设置为 true），还是将不包括指定颜色的所有像素完全包括起来（如果将 findColor 参数设置为 false）。  
     * 例如，如果有一个源图像并且想要确定包含非零 Alpha 通道的图像矩形，请传递 {mask: 0xFF000000, color: 0x00000000} 作为参数。如果 findColor 参数设置为 true，则会在整个图像中搜索其 (value & mask) == color 的像素范围（其中 value 是像素的颜色值）。如果 findColor 参数设置为 false，则在整个图像中搜索以下像素的范围，这些像素满足条件 (value & mask) != color（其中 value 是像素的颜色值）。要确定图像周围的空白区域，请传递 {mask: 0xFFFFFFFF, color: 0xFFFFFFFF} 以查找非空白像素的范围。
     * @param _mask 一个十六进制值，指定要考虑的 ARGB 颜色的位。通过使用 & (bitwise AND) 运算符，将颜色值与此十六进制值合并。
     * @param _color 一个十六进制值，指定要匹配（如果 findColor 设置为 true）或不 匹配（如果 findColor 设置为 false）的 ARGB 颜色。
     * @param _findColor (default = true) — 如果该值设置为 true，则返回图像中颜色值的范围。如果该值设置为 false，则返回图像中不存在此颜色的范围。
     * @returns 指定颜色的图像区域。
     */
    getColorBoundsRect(_mask: number, _color: number, _findColor = true) {
        return this.rect;
    }
    /**
     * 获取指定坐标点的像素颜色值。
     * 
     * @param x 像素的 x 坐标。
     * @param y 像素的 y 坐标。
     * @returns 一个 32 位 ARGB 整数，表示指定坐标的像素颜色。
     */
    getPixel(x: number, y: number) {
        const imageData = this.#context.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        return (r! << 16) | (g! << 8) | b!;
    }
    /**
     * 返回指定坐标点的像素颜色值（32 位 ARGB）。
     * @param x 像素的 x 坐标。
     * @param y 像素的 y 坐标。
     * @returns 一个 32 位 ARGB 整数，表示指定坐标的像素颜色。
     */
    getPixel32(x: number, y: number) {
        const imageData = this.#context.getImageData(x, y, 1, 1);
        const [r, g, b, a] = imageData.data;
        return (a! << 24) | (r! << 16) | (g! << 8) | b!;
    }
    /**
     * 返回一个 ByteArray 对象，其中包含一个矩形区域的像素数据。
     * @param rect 一个 Rectangle 对象，它定义 BitmapData 对象的区域。
     * @returns 一个 ByteArray 对象，其中包含来自指定区域的像素数据。
     */
    getPixels(rect: Rectangle) {
        const imageData = this.#context.getImageData(rect.x, rect.y, rect.width, rect.height);
        return imageData.data;
    }
    /**
     * 对一个 BitmapData 对象与另一个 BitmapData 对象进行像素级别的碰撞检测。
     * @param other 要与之进行碰撞检测的另一个 BitmapData 对象。
     * @param otherPoint 一个 Point 对象，表示 other 对象的左上角坐标。
     * @param alpha 一个 0 到 255 之间的数字，表示透明度阈值。两个像素的 Alpha 值都必须大于等于此值才被视为碰撞。默认值为 1。
     * @returns 如果两个位图的重叠部分存在一个或多个非透明像素的重叠，则返回 true；否则，返回 false。
     */
    hitTest(other: BitmapData, otherPoint: Point, alpha: number = 1) {
        // 获取两个位图的边界矩形
        const thisRect = new Rectangle(0, 0, this.width, this.height);
        const otherRect = new Rectangle(otherPoint.x, otherPoint.y, other.width, other.height);

        // 计算重叠区域
        const intersectionRect = new Rectangle();
        const intersectX1 = Math.max(thisRect.x, otherRect.x);
        const intersectY1 = Math.max(thisRect.y, otherRect.y);
        const intersectX2 = Math.min(thisRect.x + this.width, otherRect.x + other.width);
        const intersectY2 = Math.min(thisRect.y + this.height, otherRect.y + other.height);

        // 如果没有重叠，则返回 false
        if (intersectX2 <= intersectX1 || intersectY2 <= intersectY1) {
            return false;
        }

        intersectionRect.setTo(intersectX1, intersectY1, intersectX2 - intersectX1, intersectY2 - intersectY1);

        // 获取重叠区域的像素数据
        const thisData = this.#context.getImageData(intersectionRect.x, intersectionRect.y, intersectionRect.width, intersectionRect.height).data;
        const otherData = other.#context.getImageData(intersectionRect.x - otherPoint.x, intersectionRect.y - otherPoint.y, intersectionRect.width, intersectionRect.height).data;

        // 遍历像素数据，进行碰撞检测
        for (let i = 3; i < thisData.length; i += 4) {
            const thisAlpha = thisData[i]!;
            const otherAlpha = otherData[i]!;

            if (thisAlpha >= alpha && otherAlpha >= alpha) {
                return true; // 发现碰撞
            }
        }

        return false; // 没有发现碰撞
    }
    /**
    * 使用伪随机像素填充一个矩形区域。
    * @param randomSeed 用于伪随机数生成器的种子。
    * @param low 确定噪点颜色的下限。
    * @param high 确定噪点颜色的上限。
    * @param channelOptions 一个位掩码，用于指定要修改的颜色通道。
    * @param grayScale 一个布尔值，指定是否应将噪点转换为灰度。
    * @param rect 可选的 Rectangle 对象，用于定义要生成噪点的区域。如果为 null，则整个位图将填充噪点。
    */
    noise(randomSeed: number, low: number, high: number, channelOptions: number = 7, grayScale: boolean = false, rect?: Rectangle) {
        let seed = randomSeed;
        const _random = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        const targetRect = rect || new Rectangle(0, 0, this.width, this.height);
        const imageData = this.#context.getImageData(targetRect.x, targetRect.y, targetRect.width, targetRect.height);
        const data = imageData.data;

        const lowR = (low >> 16) & 0xFF;
        const lowG = (low >> 8) & 0xFF;
        const lowB = low & 0xFF;
        const lowA = (low >> 24) & 0xFF;

        const highR = (high >> 16) & 0xFF;
        const highG = (high >> 8) & 0xFF;
        const highB = high & 0xFF;
        const highA = (high >> 24) & 0xFF;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i]!;
            let g = data[i + 1]!;
            let b = data[i + 2]!;
            let a = data[i + 3]!;

            if (grayScale) {
                const grayValue = low + _random() * (high - low);
                r = g = b = grayValue;
            } else {
                const randomR = lowR + _random() * (highR - lowR);
                const randomG = lowG + _random() * (highG - lowG);
                const randomB = lowB + _random() * (highB - lowB);

                if (channelOptions & 4) r = randomR;
                if (channelOptions & 2) g = randomG;
                if (channelOptions & 1) b = randomB;
            }

            if (channelOptions & 8) {
                const randomA = lowA + _random() * (highA - lowA);
                a = randomA;
            }

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = a;
        }

        this.#context.putImageData(imageData, targetRect.x, targetRect.y);
    }
    /**
     * 在 BitmapData 对象上生成一个伪随机分形柏林噪声纹理。
     * @param baseX 噪声的 x 坐标偏移量。
     * @param baseY 噪声的 y 坐标偏移量。
     * @param numOctaves 用于生成分形噪声的八度数。
     * @param _randomSeed 随机种子，用于生成可重复的噪声。
     * @param _stitch 一个布尔值，指定噪声是否可平铺。
     * @param _fractalNoise 一个布尔值，指定是否生成分形噪声。
     * @param channelOptions 一个 32 位整数，指定要应用噪声的通道。
     * @param grayScale 一个布尔值，指定是否生成灰度噪声。
     */
    perlinNoise(
        baseX: number,
        baseY: number,
        numOctaves: number,
        _randomSeed: number,
        _stitch: boolean,
        _fractalNoise: boolean,
        channelOptions: number,
        grayScale = false,
    ) {
        // 辅助函数：平滑曲线
        const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
        // 辅助函数：线性插值
        const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

        // 辅助函数：根据哈希值计算梯度点积
        const grad = (hash: number, x: number, y: number) => {
            const h = hash & 15;
            const u = h < 8 ? x : y;
            const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        };

        const imageData = this.#context.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        const p = <number[]>Array.from({ length: 512 }, (_, i) => {
            const index = Math.floor(Math.random() * 256);
            return i < 256 ? index : p[i % 256];
        });

        const offsetX = baseX;
        const offsetY = baseY;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let totalNoise = 0;
                let amplitude = 1;
                let frequency = 1;
                let maxAmplitude = 0;

                for (let i = 0; i < numOctaves; i++) {
                    const sampleX = (x + offsetX) / this.width * frequency;
                    const sampleY = (y + offsetY) / this.height * frequency;

                    const X = Math.floor(sampleX) & 255;
                    const Y = Math.floor(sampleY) & 255;

                    const xf = sampleX - Math.floor(sampleX);
                    const yf = sampleY - Math.floor(sampleY);

                    const u = fade(xf);
                    const v = fade(yf);

                    // 获取四个角的哈希值
                    const A = p[X]! + Y;
                    const AA = p[A]!;
                    const AB = p[A + 1]!;
                    const B = p[X + 1]! + Y;
                    const BA = p[B]!;
                    const BB = p[B + 1]!;

                    // 插值
                    const noise = lerp(
                        lerp(grad(p[AA]!, xf, yf), grad(p[BA]!, xf - 1, yf), u),
                        lerp(grad(p[AB]!, xf, yf - 1), grad(p[BB]!, xf - 1, yf - 1), u),
                        v
                    );

                    totalNoise += noise * amplitude;
                    maxAmplitude += amplitude;

                    amplitude *= 0.5;
                    frequency *= 2;
                }

                // 归一化到 0-1 范围，然后映射到 0-255
                let value = ((totalNoise / maxAmplitude) + 1) / 2;
                value = Math.max(0, Math.min(255, Math.floor(value * 255)));

                const index = (y * this.width + x) * 4;

                if (grayScale) {
                    data[index] = data[index + 1] = data[index + 2] = value;
                    data[index + 3] = 255; // 完全不透明
                } else {
                    // 根据 channelOptions 设置颜色，这里我们简单地将噪声值作为 RGB
                    // 实际应用中需要更复杂的颜色映射
                    const r = (channelOptions & 0x01) ? value : 0;
                    const g = (channelOptions & 0x02) ? value : 0;
                    const b = (channelOptions & 0x04) ? value : 0;
                    const a = (channelOptions & 0x08) ? value : 255; // 默认不透明

                    data[index] = r;
                    data[index + 1] = g;
                    data[index + 2] = b;
                    data[index + 3] = a;
                }
            }
        }
        this.#context.putImageData(imageData, 0, 0);
    }
    /**
     * 在指定的矩形区域内，将源 BitmapData 的像素以随机顺序复制到此 BitmapData 对象。
     * @param sourceBitmapData 包含源图像数据的 BitmapData 对象。
     * @param destRect 一个 Rectangle 对象，它定义要复制像素的目标矩形区域。
     * @param randomSeed 一个整数，用于初始化随机数生成器。相同的种子值将产生相同的溶解顺序。
     * @returns 一个整数，表示成功复制的像素数。
     */
    pixelDissolve(sourceBitmapData: BitmapData, destRect: Rectangle, randomSeed: number) {
        // 检查矩形是否在位图边界内
        if (destRect.x >= this.width || destRect.y >= this.height || destRect.x + destRect.width <= 0 || destRect.y + destRect.height <= 0) {
            return 0;
        }

        // 简单的伪随机数生成器 (Linear Congruential Generator)
        let seed = randomSeed;
        const nextRandom = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        // 获取源和目标的像素数据
        const sourceImageData = sourceBitmapData.#context.getImageData(0, 0, sourceBitmapData.width, sourceBitmapData.height);
        const destImageData = this.#context.getImageData(destRect.x, destRect.y, destRect.width, destRect.height);
        const destData = destImageData.data;
        const sourceData = sourceImageData.data;

        // 生成所有像素坐标
        const pixels: { x: number, y: number }[] = [];
        for (let y = 0; y < destRect.height; y++) {
            for (let x = 0; x < destRect.width; x++) {
                pixels.push({ x: destRect.x + x, y: destRect.y + y });
            }
        }

        // 使用 Fisher-Yates 洗牌算法打乱数组
        for (let i = pixels.length - 1; i > 0; i--) {
            const j = Math.floor(nextRandom() * (i + 1));
            [pixels[i], pixels[j]] = [pixels[j]!, pixels[i]!];
        }

        // 逐一复制像素
        let pixelsCopied = 0;
        for (const { x, y } of pixels) {
            // 确保坐标在源位图内
            if (x >= 0 && x < sourceBitmapData.width && y >= 0 && y < sourceBitmapData.height) {
                const sourceIndex = (y * sourceBitmapData.width + x) * 4;
                const destIndex = ((y - destRect.y) * destRect.width + (x - destRect.x)) * 4;

                destData[destIndex] = sourceData[sourceIndex]!;
                destData[destIndex + 1] = sourceData[sourceIndex + 1]!;
                destData[destIndex + 2] = sourceData[sourceIndex + 2]!;
                destData[destIndex + 3] = sourceData[sourceIndex + 3]!;
                pixelsCopied++;
            }
        }

        // 将修改后的像素数据放回目标位图
        this.#context.putImageData(destImageData, destRect.x, destRect.y);

        return pixelsCopied;
    }
    /**
     * 将位图数据沿 x 和 y 轴滚动指定的像素数。
     * @param x 沿水平轴滚动的像素数。
     * @param y 沿垂直轴滚动的像素数。
     */
    scroll(x: number, y: number) {
        // 保存当前画布状态
        this.#context.save();

        // 创建一个新的临时位图数据，用于存储当前位图数据
        const tempBitmapData = new BitmapData(this.width, this.height, this.transparent, 0);
        tempBitmapData.draw(this);

        // 清空当前画布
        this.#context.clearRect(0, 0, this.width, this.height);

        // 将临时位图数据绘制回当前画布，并应用滚动偏移
        this.#context.drawImage(
            tempBitmapData[canvas],
            x,
            y,
            this.width - Math.abs(x),
            this.height - Math.abs(y),
        );
        this.#context.restore();

        // 处理滚动后出现的空白区域
        if (x > 0) {
            // 向右滚动，左侧出现空白区域
            this.fillRect(new Rectangle(0, 0, x, this.height), this.fillColor);
        } else if (x < 0) {
            // 向左滚动，右侧出现空白区域
            this.fillRect(new Rectangle(this.width + x, 0, -x, this.height), this.fillColor);
        }

        if (y > 0) {
            // 向下滚动，上方出现空白区域
            this.fillRect(new Rectangle(0, 0, this.width, y), this.fillColor);
        } else if (y < 0) {
            // 向上滚动，下方出现空白区域
            this.fillRect(new Rectangle(0, this.height + y, this.width, -y), this.fillColor);
        }
    }
    /**
     * 设置指定坐标点的像素颜色。
     * @param x 像素的 x 坐标。
     * @param y 像素的 y 坐标。
     * @param color 像素的 RGB 颜色值。
     */
    setPixel(x: number, y: number, color: number) {
        this.setPixel32(x, y, color);
    }
    /**
     * 设置指定坐标点的像素颜色。
     * @param x 像素的 x 坐标。
     * @param y 像素的 y 坐标。
     * @param color 像素的 32 位 ARGB 颜色值。
     */
    setPixel32(x: number, y: number, color: number) {
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;
        const a = (color >> 24) & 0xFF;
        const imageData = this.#context.createImageData(1, 1);
        imageData.data[0] = r;
        imageData.data[1] = g;
        imageData.data[2] = b;
        imageData.data[3] = a;
        this.#context.putImageData(imageData, x, y);
    }
    /**
     * 使用一个 ByteArray 对象中的像素数据设置一个矩形区域的像素。
     * @param rect 一个 Rectangle 对象，它定义 BitmapData 对象的区域。
     * @param inputPixels 一个 ByteArray 对象，其中包含该区域的像素数据。
     */
    setPixels(rect: Rectangle, inputPixels: ImageDataArray) {
        const imageData = new ImageData(inputPixels, rect.width, rect.height);
        this.#context.putImageData(imageData, rect.x, rect.y);
    }
}

/**
 * 这是一个可绘制到 BitmapData 对象上的对象的类型别名。
 * Flash 中，任何继承自 DisplayObject 的类或 BitmapData 本身都可以作为 draw() 方法的源。
 */
export type IBitmapDrawable = { [canvas]: HTMLCanvasElement };