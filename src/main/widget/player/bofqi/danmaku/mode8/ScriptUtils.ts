import { error } from "../../../../../../utils/debug";
import { popTimer, pushTimer } from "./ScriptManager";

/**
 * 根据色相值（Hue）计算对应的24位RGB颜色整数
 * @param hue - 色相值，范围建议为0-360，超出部分会自动取模处理
 * @returns 24位RGB颜色整数（格式：0xRRGGBB）
 */
export function hue(hue: number) {
    // 定义三通道对应的角度参数：[起始角, 峰值角, 结束角]
    const CHANNEL_ANGLES = {
        red: [0, 120, 240] as const,    // 红色通道角度区间
        green: [124, 240, 360] as const,// 绿色通道角度区间
        blue: [240, 360, 480] as const  // 蓝色通道角度区间（480=360+120，处理0°附近逻辑）
    };

    /**
     * 计算单个颜色通道的亮度（0-100%）
     * 
     * @param channel - 目标颜色通道（red/green/blue）
     * @param hue - 归一化后的色相值
     * @returns 通道亮度（0-100）
     */
    function calculateChannelBrightness(
        channel: keyof typeof CHANNEL_ANGLES,
        hue: number
    ) {
        const [start, peak, end] = CHANNEL_ANGLES[channel];
        let targetHue = hue;

        // 处理蓝色通道跨0°的情况（hue+360映射到360-480区间）
        if (channel === 'blue' && hue < start) {
            targetHue = hue + 360;
        }

        // 若色相在当前通道区间内，计算亮度；否则亮度为0
        return targetHue > start && targetHue < end
            ? 100 - 50 * Math.abs(targetHue - peak) / 120
            : 0;
    };

    // 确保色相值在0-360范围内
    const normalizedHue = hue % 360;

    // 计算红、绿、蓝三通道的亮度（0-100%）
    const redBrightness = calculateChannelBrightness('red', normalizedHue);
    const greenBrightness = calculateChannelBrightness('green', normalizedHue);
    const blueBrightness = calculateChannelBrightness('blue', normalizedHue);

    // 将亮度（0-100）转换为RGB数值（0-255），并组合成24位颜色整数
    const red = Math.trunc(redBrightness * 255 / 100);
    const green = Math.trunc(greenBrightness * 255 / 100);
    const blue = Math.trunc(blueBrightness * 255 / 100);

    return (red << 16) | (green << 8) | blue;
}

/**
 * 将红、绿、蓝三通道颜色值组合为24位RGB颜色整数
 * @param r - 红色通道值，范围应为0-255
 * @param g - 绿色通道值，范围应为0-255
 * @param b - 蓝色通道值，范围应为0-255
 * @returns 24位RGB颜色整数，格式为0xRRGGBB
 */
export function rgb(r: number, g: number, b: number) {
    return r << 16 | g << 8 | b;
}

/**
 * 将秒数格式化为 MM:SS 格式的时间字符串
 * 
 * @param time - 以秒为单位的时间数值，可正可负
 * @returns 格式化后的时间字符串，例如 "01:23" 或 "-00:45"
 */
export function formatTimes(time: number): string {
    // 处理负数情况
    if (time < 0) {
        return `-${formatTimes(-time)}`;
    }

    // 计算分钟和秒数
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60);

    // 补零并格式化，使用 String.padStart 替代 substr
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * 延迟执行函数（对setTimeout的轻量封装）
 * 
 * @param callback - 要延迟执行的函数
 * @param delayMs - 延迟时间（毫秒），默认1000ms
 * @returns 定时器ID，可用于clearTimeout取消执行
 */
export function delay(f: Function, time = 1e3) {
    return setTimeout(() => {
        try {
            f();
        } catch (e) { error('mode8', e) };
    }, time);
}

/**
 * 定时器函数，用于周期性执行回调函数
 * 
 * @param callback 每次定时器触发时执行的回调函数
 * @param delay 每次执行的间隔时间（毫秒），默认1000ms
 * @param repeatCount 执行次数，默认1次。0表示无限循环
 * @returns 定时器控制对象，包含stop方法用于提前终止
 */
export function interval(
    callback: () => void,
    delay: number = 1000,
    repeatCount: number = 1
) {
    let intervalId: number;
    let timeoutId: number;
    let currentCount = 0;

    // 处理定时器触发逻辑
    const handleTimer = () => {
        currentCount++;
        try {
            callback();
        } catch (e) { error('mode8', e) }

        // 检查是否达到执行次数上限
        if (repeatCount > 0 && currentCount >= repeatCount) {
            stop();
            popTimer(res);
        }
    };

    // 清理定时器
    const stop = () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    // 返回控制对象，允许外部停止定时器
    const res = { stop };

    // 启动定时器
    if (repeatCount === 1) {
        // 只执行一次时使用setTimeout更高效
        timeoutId = setTimeout(handleTimer, delay);
    } else {
        // 多次执行时先立即执行一次，再设置间隔
        timeoutId = setTimeout(handleTimer, 0);
        if (repeatCount === 0 || currentCount < repeatCount) {
            intervalId = setInterval(handleTimer, delay);
        }
    }


    pushTimer(res);
    return res;
}

/**
 * 计算座标距离
 * 
 * @param x1 计算起始座标X轴
 * @param y1 计算起始座标Y轴
 * @param x2 计算结束座标X轴
 * @param y2 计算结束座标Y轴
 * @returns 以像素为单位的座标距离
 */
export function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

/**
 * 返回一个伪随机数 n，其中 n ∈ [min,max]。
 * 因为该计算不可避免地包含某些非随机的成分，所以返回的数字以保密方式计算且为“伪随机数”。
 * 
 * @param min 伪随机数最小值
 * @param max 伪随机数最大值
 * @returns 伪随机数 n，其中 n ∈ [min,max]
 */
export function rand(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min));
}

/**
 * 克隆一个对象
 * 
 * @param obj 原始对象
 * @returns 原始对象的克隆
 */
export function clone<T>(obj: T) {
    return structuredClone(obj);
}

/**
 * 用指定函数处理对象的每个值
 * 
 * @param obj 要遍历的对象
 * @param f 值处理函数
 */
export function foreach(obj: Record<string, unknown>, f: (v: unknown) => void) {
    for (const value of Object.values(obj)) {
        f(value);
    }
}