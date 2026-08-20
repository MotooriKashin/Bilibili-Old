import type { DashPlayer } from "./index.js";
import { error } from "../../../../utils/debug.js";

export class Fetch {
    private abortController = new AbortController();
    private appendBufferwithResolvers?: PromiseWithResolvers<void>;
    private range = 0;
    private isPending = false;
    isEnd = false;
    private contentLength = 0;
    private init = false;
    private initBuffer = new Uint8Array();
    private reference: IReference[] = [];
    private tolerance = 0.2;
    flushing = false;
    constructor(
        private dashplayer: DashPlayer,
        private mediaSource: MediaSource,
        private sourceBuffer: SourceBuffer,
        private url: URL,
        public type: string,
    ) {
        this.fetch();
    }
    /**
     * 视频缓冲暂停
     * 
     * @param currentTime 当前时间
     */
    async onWaiting(currentTime: number) {
        // 1. 检查当前播放点是否已经在缓冲区内
        const { buffered } = this.sourceBuffer;
        for (let i = 0; i < buffered.length; i++) {
            const start = buffered.start(i);
            const end = buffered.end(i);
            // 使用 tolerance 判定是否处于有效 buffer 内部
            if (currentTime >= start - this.tolerance && currentTime <= end + this.tolerance) {
                if (this.isPending) {
                    if (this.appendBufferwithResolvers) {
                        this.appendBufferwithResolvers.resolve();
                    }
                } else if (!this.isEnd) {
                    // 请求已断开重新请求
                    return this.fetch();
                }
                return;
            }
        }

        // 2. 处于缓冲区外（发生了 Seek 跳频）
        const reference = this.reference.find(
            ({ segmentStartTime, segmentEndTime }) => segmentStartTime <= currentTime && segmentEndTime > currentTime
        );

        if (!reference) {
            // 如果跳到了超出视频总长或 sidx 范围的位置
            return;
        }

        // 3. 中断旧请求并更新 range 为目标切片的起始字节
        this.range = reference.start;
        await this.abort();
        return this.fetch();
    }
    /**
     * 视频时间更新
     * 
     * @param currentTime 当前时间
     */
    async onTimeupdate(currentTime: number) {
        const { buffered } = this.sourceBuffer;
        for (let i = 0; i < buffered.length; i++) {
            const start = buffered.start(i);
            const end = buffered.end(i);
            if (currentTime >= start - this.tolerance && currentTime <= end + this.tolerance) {
                // 当剩余可播放缓冲区不足 10 秒时，继续预加载
                if (currentTime - start >= end - currentTime || end - currentTime < 10) {
                    if (this.isPending) {
                        if (this.appendBufferwithResolvers) {
                            this.appendBufferwithResolvers.resolve();
                        }
                    } else if (!this.isEnd) {
                        // 请求已断开重新请求
                        return this.fetch();
                    }

                }
                return;
            }
        }
    }
    /**
     * 切换源
     * 
     * @param mime 新源的 MIME
     * @param url 新元的 URL
     * @param currentTime 当前视频播放进度
     */
    async switchSource(mime: string, url: URL, currentTime: number) {

        // 1. 停止当前的请求，但不销毁 SourceBuffer
        await this.abort();
        await this.sourceBufferUpdating();

        // 2. 如果编码变了，执行 changeType
        if (this.type !== mime) {
            this.sourceBuffer.changeType(this.type = mime);
            await this.sourceBufferUpdating();
        }

        // 3. 重置状态，准备接收新流的初始化数据
        this.init = false;
        this.range = 0;
        this.initBuffer = new Uint8Array(0);
        this.url = url;

        // 4. 发起请求获取新流的 SIDX 和初始化信息
        this.fetch();

        // 5. 关键：等待新流的 SIDX 解析完成
        const { promise, resolve, reject } = Promise.withResolvers<void>();
        const checkInit = setInterval(() => {
            if (this.abortController.signal.aborted) {
                clearInterval(checkInit);
                reject(new Error('Switch aborted'));
            } else if (this.init) {
                clearInterval(checkInit);
                resolve();
            }
        }, 50);

        try {
            await promise;

            // 6. 执行“平滑清除”：保留当前播放点后 1 秒的数据，清除之后的
            // 这样可以防止新旧流在缓冲区内交叉重叠导致解析卡顿
            await this.removeBuffer(currentTime + 1, Infinity);

            // 7. 让请求逻辑跳转到当前播放时间对应的分片
            // 这样接下来 fetch 流式读取的数据就是新清晰度的分片了
            await this.onWaiting(currentTime);

        } catch (e) { }
    }
    identify() {
        this.suspend();
        this.range = 0;
        this.isPending = false;
        this.isEnd = false;
        this.contentLength = 0;
        this.init = false;
        this.initBuffer = new Uint8Array();
        this.reference.length = 0;
        this.flushing = false;
    }
    private async fetch() {
        if (this.flushing) return;
        this.suspend();
        const signal = this.abortController.signal;
        const headers = new Headers();
        if (this.range) headers.append('range', `bytes=${this.range}-`);

        this.isPending = true;
        this.isEnd = false;

        const response = await fetch(this.url, { headers, signal }).catch(e => {
            this.isPending = false;
            if (e.name === 'AbortError') return;
            if (e.message = 'Failed to fetch') {
                this.flushing = true;
                this.suspend();
                this.dashplayer.fetchError();
                return;
            }
            throw e;
        });
        if (!response) return;
        const { body, headers: resHeaders, ok } = response;
        if (!ok) {
            this.flushing = true;
            this.suspend();
            this.dashplayer.fetchError();
            return;
        }
        if (!body) throw new Error('Response body is null!');
        if (!this.range) {
            const contentLength = Number(resHeaders.get('content-length'));
            if (contentLength) this.contentLength = contentLength;
        }

        try {
            for await (const buffer of body) {
                // 关键检查：如果已经被中断，直接退出循环，绝对不要 appendBuffer
                if (signal.aborted) break;

                if (this.init) {
                    await this.appendBuffer(buffer);
                } else {
                    await this.parseSidx(buffer);
                }
            }
        } catch (e: any) {
            this.isPending = false;
            switch (e.name) {
                case 'AbortError': {
                    // 主动取消链接
                    return;
                }
                default: {
                    // 其他错误
                    switch (e.message) {
                        case 'network error': {
                            this.fetch();
                            return
                        }
                        default: {
                            throw e;
                        }
                    }
                }
            }
        }

        if (signal.aborted) return;

        await this.sourceBufferUpdating();
        this.isEnd = true;
        this.isPending = false;

        if (this.range < this.contentLength) {
            this.fetch();
            return;
        }
        this.dashplayer.endOfStream();
    }
    private suspend() {
        this.appendBufferwithResolvers?.reject();
        delete this.appendBufferwithResolvers;
        this.abortController.abort();
        this.abortController = new AbortController();
    }
    /** 解码 SIDX */
    private async parseSidx(buffer: Uint8Array) {
        // 拼接缓存数据
        const newData = new Uint8Array(this.initBuffer.length + buffer.length);
        newData.set(this.initBuffer, 0);
        newData.set(buffer, this.initBuffer.length);
        this.initBuffer = newData;

        const view = new DataView(this.initBuffer.buffer);
        if (view.byteLength <= 8) return;
        let offset = 0;

        // 搜索 sidx box header
        /** sidx 起始索引 */
        let indexRangeStart = 0;
        /** sidx 大小 */
        let indexLength = 0;
        for (; offset <= view.byteLength - 8; offset++) {
            // 我们直接找 'sidx' 这个魔数
            if (view.getUint32(offset + 4) === 1936286840) {
                indexRangeStart = offset;
                indexLength = view.getUint32(offset);
                break;
            }
        }

        if (indexRangeStart === -1 || this.initBuffer.length < indexRangeStart + indexLength) {
            return;
        }

        offset = indexRangeStart + 8;  // 跳过 header
        // 读取 Version 和 flags
        const version = view.getUint8(offset);
        offset += 4; // 跳过 version(1) 和 flags(3)

        // 根据标准：sidx 头部接下来是 reference_ID(4), timescale(4)
        const timescale = view.getUint32(offset + 4);
        offset += 8; // 跳过 reference_ID 和 timescale

        // 读取 Earliest Presentation Time 和 First Offset (根据 version 判断)
        let earliestPresentationTime: number | bigint;
        if (version === 0) {
            earliestPresentationTime = view.getUint32(offset);
            offset += 8;
        } else {
            earliestPresentationTime = view.getBigUint64(offset);
            offset += 16;
        }

        // 跳过保留字段
        offset += 2;

        // 读取 Reference Count
        const referenceCount = view.getUint16(offset);
        offset += 2;

        // 解析每个参考（reference）
        this.reference = [];
        // 计算分片的起始和结束字节范围
        let segmentStartByte = indexRangeStart + indexLength; // 计算分片起始字节
        for (let i = 0; i < referenceCount; i++) {
            const reference = view.getUint32(offset);
            const referenceType = (reference >>> 31) & 1;  // 获取 Reference Type
            const referencedSize = reference & 0x7FFFFFFF; // 获取 Referenced Size（31位）

            const subsegmentDuration = view.getUint32(offset + 4);

            const sap = view.getUint32(offset + 8);
            const startsWithSAP = (sap >> 31) & 0x1;
            const SAPType = (sap >> 28) & 0x7;
            const SAPDeltaTime = sap & 0xFFFFFFF;

            // 更新偏移量
            offset += 12;  // 跳过 reference, duration, flags

            // 计算 segment 的开始和结束时间
            const segmentStartTime = Number(earliestPresentationTime) / timescale;
            const segmentEndTime = segmentStartTime + subsegmentDuration / timescale;

            // 推入 segments 数组
            this.reference.push({
                referenceType,
                referencedSize,
                subsegmentDuration,
                segmentStartTime,
                segmentEndTime,
                start: segmentStartByte,
                end: segmentStartByte += referencedSize,
                startsWithSAP,
                SAPType,
                SAPDeltaTime,
            });

            // 更新 earliestPresentationTime
            earliestPresentationTime = BigInt(earliestPresentationTime) + BigInt(subsegmentDuration);
        }

        this.init = true;
        await this.appendBuffer(this.initBuffer);
        this.initBuffer = new Uint8Array(0);
    }
    private async appendBuffer(buffer: BufferSource) {
        await this.sourceBufferUpdating();
        try {
            this.sourceBuffer.appendBuffer(buffer);
            this.range += buffer.byteLength;
        } catch (e: any) {
            switch (e.name) {
                case 'QuotaExceededError': {
                    // 缓冲区已满，等待重新尝试
                    this.appendBufferwithResolvers = Promise.withResolvers<void>();
                    try {
                        await this.appendBufferwithResolvers.promise;
                        delete this.appendBufferwithResolvers;
                        await this.appendBuffer(buffer);
                    } catch { }
                    break;
                }
                default: {
                    throw e;
                }
            }
        }
    }
    /** 等待上一个`SourceBuffer`操作更新 */
    private async sourceBufferUpdating() {
        if (this.sourceBuffer.updating) {
            if (this.sourceBuffer.updating) {
                const { promise, resolve, reject } = Promise.withResolvers<void>();
                this.sourceBuffer.when('updateend').filter(() => !this.sourceBuffer.updating).take(1).subscribe({ next: () => { resolve() }, error: reject }, { signal: this.abortController.signal });
                await promise;
            }
        }
    }
    /** 检查 MediaSource.readyState 状态 */
    private async checkMediaSourceReadyState() {
        if (this.mediaSource.readyState !== 'open') {
            // 监听状态变化
            const { promise, resolve, reject } = Promise.withResolvers<void>();
            this.mediaSource.when('sourceopen').takeUntil(this.mediaSource.when('sourceclose')).takeUntil(this.mediaSource.when('sourceended')).take(1).subscribe({ next: () => { resolve() }, error: reject });
            if (this.mediaSource.readyState === 'ended') {
                // 使用 hack 强制将 readyState 从 'ended' 切换回 'open';
                await this.removeBuffer();
                await this.sourceBufferUpdating();
            } else {
                error(this.type, 'MediaSource 未开启', this.mediaSource.readyState);
            }
            await promise;
        }
    }
    /** 取消缓冲区解码 */
    private async abort() {
        this.suspend(); // 触发 fetch 的 signal.abort()，退出 for await 循环
        await this.sourceBufferUpdating();

        // 如果 SourceBuffer 正常开启且没有在 update，重置 Demuxer 状态
        if (this.mediaSource.readyState === 'open') {
            try {
                this.sourceBuffer.abort();
            } catch { }
        }
        await this.checkMediaSourceReadyState();
    }
    /**
     * 移除对应时间段的缓冲区
     * 
     * @param start 时间段起点
     * @param end 时间段终点
     */
    private async removeBuffer(start = 0, end = Infinity) {
        await this.sourceBufferUpdating();
        this.sourceBuffer.remove(start, end);
    }
}

interface IReference {
    referenceType: number;
    /** 片段大小 */
    referencedSize: number;
    segmentEndTime: number;
    /** 片段时间戳起始点 */
    segmentStartTime: number;
    /** 片段时间戳结束点 */
    subsegmentDuration: number;
    /** Range 起始范围（闭） */
    start: number;
    /** Range 结束范围（开） */
    end: number;
    startsWithSAP: number;
    SAPType: number;
    SAPDeltaTime: number;
};