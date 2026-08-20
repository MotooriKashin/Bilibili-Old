/**
 * 将数值形式的颜色转换为十六进制颜色字符串，支持单独指定透明度（CSS opacity范围）
 * 
 * 函数支持三种使用方式：
 * 1. 仅传入包含alpha通道的32位ARGB数值（0xAARRGGBB）
 * 2. 仅传入24位RGB数值（0xRRGGBB），不包含透明度
 * 3. 传入24位RGB数值 + 单独的alpha值（0-1范围，对应CSS opacity）
 * 
 * @param colorValue - 颜色数值，支持24位RGB（0xRRGGBB）或32位ARGB（0xAARRGGBB）
 * @param alpha - 可选，透明度值，范围0-1（0表示完全透明，1表示完全不透明）
 *                          若提供此参数，将覆盖colorValue中包含的alpha通道信息
 * @returns 十六进制颜色字符串，格式为`#RRGGBB`（无透明度）或`#RRGGBBAA`（有透明度）
 * @example
 * // 仅使用RGB值
 * hex8(0xFF0080); // 返回 "#ff0080"
 * 
 * @example
 * // RGB值 + 透明度（50%）
 * hex8(0xFF0080, 0.5); // 返回 "#ff008080"
 * 
 * @example
 * // 使用包含alpha的32位ARGB值
 * hex8(0x80FF0080); // 返回 "#ff008080"
 * 
 * @example
 * // 边界处理示例（alpha自动限制在0-1范围）
 * hex8(0x00FF00, 1.2); // 超出上限，按1处理，返回 "#00ff00ff"
 * hex8(0x00FF00, -0.3); // 低于下限，按0处理，返回 "#00ff00"
 */
export function hex8(
    colorValue: number | bigint = 0,
    alpha?: number
) {
    // 统一转换为数字类型处理
    const num = Number(colorValue);

    // 提取RGB通道（兼容24位RGB和32位ARGB）
    const red = (num >> 16) & 0xFF;
    const green = (num >> 8) & 0xFF;
    const blue = num & 0xFF;

    // 处理alpha通道：
    // 1. 如果提供了单独的alpha（0-1范围），优先使用
    // 2. 否则从colorValue中提取alpha通道
    let alphaValue: number;
    if (alpha !== undefined) {
        // 将CSS opacity范围（0-1）转换为0-255范围
        alphaValue = Math.round(Math.max(0, Math.min(1, alpha)) * 255);
    } else {
        // 从32位颜色值中提取alpha通道
        alphaValue = (num >> 24) & 0xFF;
    }

    // 辅助函数：将数值转换为两位十六进制字符串
    const toHex = (n: number) => n.toString(16).padStart(2, '0').toLowerCase();

    // 构建颜色字符串
    const rgbPart = `${toHex(red)}${toHex(green)}${toHex(blue)}`;

    // 只有当透明度不为 0 时才添加 alpha 通道
    return alphaValue ? `#${rgbPart}${toHex(alphaValue)}` : `#${rgbPart}`;
}

/**
 * 将十六进制颜色字符串解析为数值形式和透明度值
 * 
 * 支持解析两种格式的颜色字符串：
 * 1. 标准RGB格式：`#RRGGBB`（6位十六进制）
 * 2. 带透明度的格式：`#RRGGBBAA`（8位十六进制）
 * 
 * @param hex - 十六进制颜色字符串，必须以#开头，后跟6位或8位十六进制字符
 * @returns  
 *          包含解析结果的对象，其中：
 *          - colorValue: 24位RGB数值（0xRRGGBB）
 *          - alpha: 透明度值（0-1范围，对应CSS opacity），默认1（完全不透明）
 * @throws 当输入的颜色字符串格式无效时抛出错误
 * @example
 * // 解析标准RGB颜色
 * parseHex8("#ff0080"); 
 * // 返回 { colorValue: 0xFF0080, alpha: 1 }
 * 
 * @example
 * // 解析带透明度的颜色
 * parseHex8("#ff008080"); 
 * // 返回 { colorValue: 0xFF0080, alpha: 0.5019607843137255 }
 * 
 * @example
 * // 解析大写字母的颜色字符串
 * parseHex8("#FF008080"); 
 * // 返回 { colorValue: 0xFF0080, alpha: 0.5019607843137255 }
 */
export function parseHex8(hex: string) {
    // 验证输入格式
    const hexRegex = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/;
    const match = hex.match(hexRegex);

    if (!match) {
        throw new Error(`无效的颜色字符串格式: ${hex}。请使用#RRGGBB或#RRGGBBAA格式。`);
    }

    // 提取RGB部分（6位）
    const rgbHex = match[1]!;
    const red = parseInt(rgbHex.substring(0, 2), 16);
    const green = parseInt(rgbHex.substring(2, 4), 16);
    const blue = parseInt(rgbHex.substring(4, 6), 16);

    // 计算24位RGB数值
    const colorValue = (red << 16) | (green << 8) | blue;

    // 提取并计算alpha值（0-1范围）
    let alpha = 1; // 默认完全不透明
    if (match[2]) {
        const alphaHex = match[2];
        const alphaValue = parseInt(alphaHex, 16);
        alpha = alphaValue / 255;
    }

    return { colorValue, alpha };
}
