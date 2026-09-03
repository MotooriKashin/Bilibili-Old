/** 二维坐标点接口 */
export interface Point2D {
    x: number;
    y: number;
}

/**
 * 线性插值函数 (Lerp)
 */
function lerp(p0: Point2D, p1: Point2D, t: number): Point2D {
    return {
        x: p0.x + (p1.x - p0.x) * t,
        y: p0.y + (p1.y - p0.y) * t,
    };
}

/**
 * 使用 De Casteljau 算法计算任意阶贝塞尔曲线上参数 t 处的坐标
 * @param points 控制点数组（包含起点、中间控制点、终点）
 * @param t 曲线参数，范围 [0, 1]
 */
function getBezierPoint(points: Point2D[], t: number): Point2D {
    // 复制一份控制点数组作为计算缓冲区
    const tempPoints: Point2D[] = [...points];
    const n = tempPoints.length;

    // 逐层迭代进行线性插值，直至只剩最后一个点
    for (let level = 1; level < n; level++) {
        for (let i = 0; i < n - level; i++) {
            tempPoints[i] = lerp(tempPoints[i]!, tempPoints[i + 1]!, t);
        }
    }

    return tempPoints[0]!;
}

/**
 * 任意阶贝塞尔曲线拟合工具函数
 * 
 * @param startPoint 曲线起点
 * @param endPoint 曲线终点
 * @param controlPoints 中间控制点数组（可以为0个或多个，阶数 = 1 + 控制点数 + 1 - 1）
 * @param count 要返回的拟合采样点总数量（至少为 2）
 * @returns 拟合生成的坐标点数组
 */
export function generateBezierPoints(
    startPoint: Point2D,
    endPoint: Point2D,
    controlPoints: Point2D[],
    count: number
): Point2D[] {
    // 参数校验与边界处理
    if (count < 2) {
        throw new Error("采样点数量 count 必须大于或等于 2");
    }

    // 组装完整的控制点序列：[起点, ...中间控制点, 终点]
    const allPoints: Point2D[] = [startPoint, ...controlPoints, endPoint];

    const result: Point2D[] = [];
    const step = 1 / (count - 1);

    for (let i = 0; i < count; i++) {
        // 最后一项直接设为 1，避免浮点数累加导致的精度误差（如 0.9999999999999999）
        const t = i === count - 1 ? 1 : i * step;
        result.push(getBezierPoint(allPoints, t));
    }

    return result;
}