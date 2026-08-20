/** 空间计算器 */
export class Space {

    /** 路线配置 */
    #road: IRoad;

    /** 车辆路线图谱 (多条跑道，每条跑道是一个车辆数组) */
    #lanes: IRecord[][] = [];

    /**
     * 车辆ID所对应的记录和它所在的跑道索引
     * { record: IRecord, laneIndex: number }
     */
    #records = new Map<bigint, { record: IRecord, laneIndex: number }>();

    constructor(road: IRoad) {
        this.#road = road;
    }

    /**
     * 判定当前路线是否有追尾风险
     * 
     * @param road 路线信息
     * @param car 当前车辆信息
     * @returns 判定结果，返回数字代表没有追尾风险
     */
    #hitCheck(lane: IRecord[], car: ICar) {

        // 1. 识别所有在时间上有追尾风险的车辆的 Y 轴占用范围
        const overlappingRanges: { start: number, end: number }[] = [];

        for (const { progress, y, height: width } of lane) {

            // 追尾风险：前车的出发时间 + 占据起跑线的时间 > 本车发车时间
            if (progress + this.#road.duration * this.#road.rate > car.progress) {
                overlappingRanges.push({ start: y, end: y + width });
            }
        }

        // 2. 在 Y 轴上找到第一个“空位” (O(M log M))
        let optimalY = 0;

        if (overlappingRanges.length > 0) {
            overlappingRanges.sort((a, b) => a.start - b.start);

            let currentY = 0;
            let foundGap = false;

            for (const range of overlappingRanges) {
                if (currentY + car.height <= range.start) {
                    optimalY = currentY;
                    foundGap = true;
                    break;
                }
                if (currentY < range.end) {
                    currentY = range.end;
                }
            }

            if (!foundGap) {
                optimalY = currentY;
            }
        }

        // 3. 检查最终 y 是否越界
        if (optimalY + car.height > this.#road.height) {
            return;
        }

        return { y: optimalY };
    }

    /** 获取车辆出发点坐标 */
    getPos(car: ICar) {

        for (let i = 0; i < this.#lanes.length; i++) {
            const lane = this.#lanes[i]!;

            // 对每条路线进行追尾判定
            const res = this.#hitCheck(lane, car);

            if (res !== undefined) {
                // 当前路线没有追尾风险
                const record = { ...car, y: res.y };
                lane.push(record); // 添加入跑道数组
                this.#records.set(car.id, { record, laneIndex: i }); // 记录索引
                return res.y;
            }
        }

        // 现有路线都有追尾风险，开辟新道路
        const lane: IRecord[] = [];
        const record = { ...car, y: 0 };
        lane.push(record);
        this.#lanes.push(lane);
        const newLaneIndex = this.#lanes.length - 1;
        this.#records.set(car.id, { record, laneIndex: newLaneIndex }); // 记录索引
        return 0;
    }

    /** 删除过期记录 */
    delete(id: bigint) {
        const entry = this.#records.get(id);
        if (entry) {
            const { record, laneIndex } = entry;
            const lane = this.#lanes[laneIndex]!;

            // 在数组中查找并删除记录（这步是 O(N)，N 为该跑道车辆数）
            // 注意：由于 #hitCheck 依赖于遍历，数组顺序不重要，所以可以使用快速删除技巧。
            const index = lane.indexOf(record);
            if (index > -1) {
                // 快速删除：用最后一个元素覆盖当前要删除的元素，然后pop
                // 性能比 splice 好
                if (index !== lane.length - 1) {
                    lane[index] = lane[lane.length - 1]!;
                }
                lane.pop();
            }
        }
        this.#records.delete(id); // O(1)
    }

    identify() {
        this.#lanes.length = 0;
        this.#records.clear();
    }
}

/** 道路 */
interface IRoad {
    /** 宽度 */
    height: number;
    /** 车辆占据起跑线的时长 */
    duration: number;
    /** 时间倍率 */
    rate: number;
}

/** 车辆 */
interface ICar {
    /** 宽度 */
    height: number;
    /** 发车时间/ms */
    progress: number;
    /** 车辆ID */
    id: bigint;
}

interface IRecord extends ICar {
    /** 发车点 */
    y: number;
}