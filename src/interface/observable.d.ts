/**
 * WICG Observable API 的全局定义。
 * 规范链接：https://wicg.github.io/observable/
 */

// ==============================================
// 1. 核心回调类型：定义 Observable 数据流中不同场景的回调格式
// ==============================================

/**
 * 正常数据回调：接收 Observable 发射的普通数据（T 为数据类型）
 * @param value -  Observable 发射的当前数据项
 */
type ObservableSubscriptionCallback<T = any> = (value: T) => void;

/**
 * 错误回调：接收 Observable 发射的错误对象
 * @param error - 错误信息（可能是 Error 实例或其他错误描述）
 */
type ObservableErrorCallback = (error: any) => void;

/**
 * 订阅器回调：创建 Observable 时传入，用于定义数据流发射逻辑
 * @param subscriber - 订阅者实例，通过其 next/error/complete 方法控制数据流
 */
type SubscribeCallback<T = any> = (subscriber: Subscriber<T>) => void;


// ==============================================
// 2. 订阅者接口（Subscriber）：Observable 与订阅者的核心交互层
// 负责发射数据、错误、完成信号，以及资源清理
// ==============================================

interface Subscriber<T = any> {
    /**
     * 发射正常数据：向订阅者推送一条新数据
     * @param value - 当前数据项（类型与 Observable 泛型 T 一致）
     */
    next(value: T): void;

    /**
     * 发射错误信号：通知订阅者数据流发生异常，后续不再发射数据
     * @param error - 错误信息
     */
    error(error: any): void;

    /**
     * 发射完成信号：通知订阅者数据流正常结束，后续不再发射数据
     */
    complete(): void;

    /**
     * 注册资源清理函数：订阅终止时（complete/error/取消订阅）自动执行
     * 用于清理定时器、事件监听器等资源，避免内存泄漏
     * @param teardown - 清理逻辑函数
     */
    addTeardown(teardown: () => void): void;

    /**
     * 订阅活跃状态：标记当前订阅是否处于有效状态
     * - true：可正常接收数据
     * - false：已终止（complete/error/取消订阅）
     */
    readonly active: boolean;

    /**
     * 取消信号：与 AbortController 关联，用于外部触发订阅取消
     */
    readonly signal: AbortSignal;
}


// ==============================================
// 3. 订阅观察者接口（SubscriptionObserver）：简化版订阅配置
// 用于 subscribe 方法，仅需传入关心的回调（无需实现完整 Subscriber）
// ==============================================

interface SubscriptionObserver<T = any> {
    /** 可选：接收正常数据的回调 */
    next?: ObservableSubscriptionCallback<T>;

    /** 可选：接收错误信息的回调 */
    error?: ObservableErrorCallback;

    /** 可选：接收完成信号的回调 */
    complete?: () => void;
}

/**
 * 订阅观察者联合类型：支持两种订阅方式
 * 1. 直接传入数据回调（仅关心正常数据）
 * 2. 传入完整 SubscriptionObserver 对象（关心数据/错误/完成）
 */
type ObserverUnion<T = any> = ObservableSubscriptionCallback<T> | SubscriptionObserver<T>;


// ==============================================
// 4. 订阅配置选项：控制订阅行为（如取消信号）
// ==============================================

interface SubscribeOptions {
    /**
     * 外部取消信号：通过 AbortController 控制订阅取消
     * 当 signal.aborted 为 true 时，订阅自动终止并执行清理逻辑
     */
    signal?: AbortSignal;
}


// ==============================================
// 5. 工具类型：用于 Observable 运算符（map/filter/reduce 等）
// ==============================================

/**
 * 过滤断言函数：用于 filter 运算符，判断数据是否保留
 * @param value - 当前数据项
 * @param index - 数据项在流中的索引（从 0 开始）
 * @returns true：保留数据；false：过滤数据
 */
type Predicate<T = any> = (value: T, index: number) => boolean;

/**
 * 归约函数：用于 reduce 运算符，累积数据流计算最终结果
 * @param accumulator - 累积器，存储当前计算结果
 * @param currentValue - 当前数据项
 * @param index - 数据项在流中的索引
 * @returns 新的累积结果
 */
type Reducer<T = any, R = any> = (accumulator: R, currentValue: T, index: number) => R;

/**
 * 映射函数：用于 map 运算符，转换数据格式
 * @param value - 当前数据项
 * @param index - 数据项在流中的索引
 * @returns 转换后的数据（类型 R）
 */
type Mapper<T = any, R = any> = (value: T, index: number) => R;

/**
 * 扁平化映射函数：用于 flatMap/switchMap 运算符
 * @param value - 当前数据项
 * @param index - 数据项在流中的索引
 * @returns 子 Observable（最终会被合并到主流）
 */
type ObservableMapper<T = any, R = any> = (value: T, index: number) => Observable<R>;

/**
 * 遍历函数：用于 forEach 运算符，消费数据但不改变数据流
 * @param value - 当前数据项
 * @param index - 数据项在流中的索引
 */
type Visitor<T = any> = (value: T, index: number) => void;

/**
 * 错误捕获函数：用于 catch 运算符，错误后切换到新流
 * @param error - 捕获到的错误信息
 * @returns 新的 Observable 或原始值（会自动转为 Observable）
 */
type CatchCallback<R = any> = (error: any) => Observable<R> | R;


// ==============================================
// 6. 订阅句柄接口（Subscription）：管理订阅生命周期
// ==============================================

interface Subscription {
    /**
     * 手动取消订阅：终止数据流接收，并执行注册的清理逻辑
     * 调用后 closed 变为 true，active 变为 false
     */
    unsubscribe(): void;

    /**
     * 订阅关闭状态：标记订阅是否已终止
     * - true：已终止（unsubscribe/complete/error）
     * - false：仍活跃
     */
    readonly closed: boolean;
}


// ==============================================
// 7. 事件监听配置：扩展 EventTarget.when 方法的选项
// 与 addEventListener 选项对齐，支持捕获阶段和被动监听
// ==============================================

interface ObservableEventListenerOptions {
    /**
     * 捕获阶段触发：true 表示在事件捕获阶段执行监听逻辑
     * 默认为 false（冒泡阶段触发）
     */
    capture?: boolean;

    /**
     * 被动监听：true 表示监听函数不会调用 preventDefault()
     * 用于优化滚动、触摸等高频事件性能
     */
    passive?: boolean;
}


// ==============================================
// 8. 核心 Observable 类：实现数据流的创建、订阅、转换
// 严格对齐官方 API，修复原类型中的方法返回值、参数类型错误
// ==============================================

class Observable<T = any> {
    /**
     * 创建 Observable 实例
     * @param callback - 订阅逻辑函数，订阅时自动执行，用于定义数据流发射规则
     */
    constructor(callback: SubscribeCallback<T>);

    /**
     * 订阅数据流：开始接收数据，并返回订阅句柄
     * @param observer - 订阅观察者（回调函数或完整配置）
     * @param options - 订阅配置（如外部取消信号）
     * @returns 订阅句柄，用于手动取消订阅
     */
    subscribe(observer?: ObserverUnion<T>, options?: SubscribeOptions): Subscription;

    /**
     * 静态方法：从其他数据类型创建 Observable
     * @param value - 源数据（Observable/AsyncIterable/Iterable/Promise）
     * @returns 新的 Observable 实例
     */
    static from<T>(
        value: Observable<T> | AsyncIterable<T> | Iterable<T> | Promise<T>
    ): Observable<T>;

    /**
     * 运算符：接收数据直到停止信号 Observable 发射第一个值
     * @param stopSignal$ - 停止信号 Observable，其发射第一个值后当前流终止
     * @returns 新的 Observable（仅发射停止信号前的数据）
     */
    takeUntil(stopSignal$: Observable<any>): Observable<T>;

    /**
     * 运算符：转换数据格式（1:1 映射）
     * @param mapper - 映射函数，将 T 类型转为 R 类型
     * @returns 新的 Observable（发射映射后的数据）
     */
    map<R>(mapper: Mapper<T, R>): Observable<R>;

    /**
     * 运算符：过滤数据（保留符合条件的项）
     * @param predicate - 过滤断言，返回 true 保留数据
     * @returns 新的 Observable（仅发射符合条件的数据）
     */
    filter(predicate: Predicate<T>): Observable<T>;

    /**
     * 运算符：仅保留前 N 个数据项
     * @param amount - 保留的数量
     * @returns 新的 Observable（发射前 N 个数据后自动完成）
     */
    take(amount: number): Observable<T>;

    /**
     * 运算符：跳过前 N 个数据项
     * @param amount - 跳过的数量
     * @returns 新的 Observable（从第 N+1 个数据开始发射）
     */
    drop(amount: number): Observable<T>;

    /**
     * 运算符：映射+扁平化（处理嵌套 Observable）
     * @param mapper - 扁平化映射函数，返回子 Observable
     * @returns 新的 Observable（合并子 Observable 的数据）
     */
    flatMap<R>(mapper: ObservableMapper<T, R>): Observable<R>;

    /**
     * 运算符：映射+切换（仅保留最新的子 Observable）
     * @param mapper - 切换映射函数，返回子 Observable
     * @returns 新的 Observable（仅发射最新子 Observable 的数据）
     */
    switchMap<R>(mapper: ObservableMapper<T, R>): Observable<R>;

    /**
     * 运算符：捕获错误并切换到新流
     * @param callback - 错误处理函数，返回新流
     * @returns 新的 Observable（错误后发射新流的数据）
     */
    catch<R>(callback: CatchCallback<R>): Observable<R>;

    /**
     * 运算符：无论流正常完成还是错误，都执行清理逻辑
     * @param callback - 清理函数（无参数，无返回值）
     * @returns 新的 Observable（与原流数据一致，仅附加清理逻辑）
     */
    finally(callback: () => void): Observable<T>;

    /**
     * 转换为 Promise：收集所有数据到数组，流完成后 resolve
     * @param options - 订阅配置
     * @returns 包含所有数据的数组
     */
    toArray(options?: SubscribeOptions): Promise<T[]>;

    /**
     * 遍历数据：消费每个数据项，流完成后 resolve
     * @param callback - 遍历函数（处理每个数据项）
     * @param options - 订阅配置
     * @returns 流完成后 resolve
     */
    forEach(callback: Visitor<T>, options?: SubscribeOptions): Promise<void>;

    /**
     * 验证所有数据：判断是否所有数据都符合条件
     * @param predicate - 验证函数
     * @param options - 订阅配置
     * @returns 全部符合返回 true，否则 false
     */
    every(predicate: Predicate<T>, options?: SubscribeOptions): Promise<boolean>;

    /**
     * 获取第一个数据项：流发射第一个数据后 resolve  
     * **推荐使用take(1)方法代替**，以免被 AbortController 取消后报错
     * @param options - 订阅配置
     * @returns 第一个数据项
     */
    first(options?: SubscribeOptions): Promise<T>;

    /**
     * 获取最后一个数据项：流完成后 resolve 最后一个数据
     * @param options - 订阅配置
     * @returns 最后一个数据项
     */
    last(options?: SubscribeOptions): Promise<T>;

    /**
     * 查找第一个符合条件的数据项
     * @param predicate - 查找条件函数
     * @param options - 订阅配置
     * @returns 找到返回数据，否则 undefined
     */
    find(predicate: Predicate<T>, options?: SubscribeOptions): Promise<T | undefined>;

    /**
     * 验证部分数据：判断是否存在符合条件的数据
     * @param predicate - 验证函数
     * @param options - 订阅配置
     * @returns 存在符合返回 true，否则 false
     */
    some(predicate: Predicate<T>, options?: SubscribeOptions): Promise<boolean>;

    /**
     * 归约数据：累积计算所有数据，流完成后 resolve 最终结果
     * @param reducer - 归约函数
     * @param initialValue - 初始累积值（可选，无则用第一个数据）
     * @param options - 订阅配置
     * @returns 归约后的最终结果
     */
    reduce<R>(reducer: Reducer<T, R>, initialValue?: R, options?: SubscribeOptions): Promise<R>;
}


// ==============================================
// 9. DOM 接口扩展：为原生 DOM 类型添加 when 方法
// 实现 EventTarget 与 Observable 的集成，替代 addEventListener
// ==============================================

/**
 * EventTarget 扩展：添加 when 方法（官方核心能力）
 */
interface EventTargetEventMap {
    abort: Event;    // 中止事件（如 XHR 中止）
    error: Event;    // 错误事件（如资源加载失败）
}

interface EventTarget {
    /**
     * 监听指定类型的事件，返回 Observable（类型安全版）
     * @param event - 事件类型（从 EventTargetEventMap 继承的合法事件名）
     * @param options - 事件监听配置（捕获/被动）
     * @returns 发射对应事件对象的 Observable
     */
    when<T extends keyof EventTargetEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<EventTargetEventMap[T]>;

    /**
     * 监听自定义事件（通用版，无类型约束）
     * @param type - 自定义事件类型字符串（如 "custom-event"）
     * @param options - 事件监听配置
     * @returns 发射 Event 对象的 Observable
     */
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * AbortSignal 扩展：监听信号相关事件（如 abort 信号触发）
 */
interface AbortSignal {
    when<T extends keyof AbortSignalEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AbortSignalEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * AbstractWorker 扩展：监听 Worker 相关事件（如 message/error）
 */
interface AbstractWorker {
    when<T extends keyof AbstractWorkerEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AbstractWorkerEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * Animation 扩展：监听动画相关事件（如 animationend）
 */
interface Animation {
    when<T extends keyof AnimationEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AnimationEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * AudioBufferSourceNode 扩展：监听音频源事件（如 ended）
 */
interface AudioBufferSourceNode {
    when<T extends keyof AudioScheduledSourceNodeEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AudioScheduledSourceNodeEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * AudioContext 扩展：监听音频上下文事件（如 statechange）
 */
interface AudioContext {
    when<T extends keyof BaseAudioContextEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<BaseAudioContextEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * AudioDecoder 扩展：监听音频解码事件（如 decode）
 */
interface AudioDecoder {
    when<T extends keyof AudioDecoderEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AudioDecoderEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * AudioEncoder 扩展：监听音频编码事件（如 encode）
 */
interface AudioEncoder {
    when<T extends keyof AudioEncoderEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AudioEncoderEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * AudioScheduledSourceNode 扩展：监听音频定时源事件（如 ended）
 */
interface AudioScheduledSourceNode {
    when<T extends keyof AudioScheduledSourceNodeEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AudioScheduledSourceNodeEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * AudioWorkletNode 扩展：监听音频工作节点事件（如 message）
 */
interface AudioWorkletNode {
    when<T extends keyof AudioWorkletNodeEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AudioWorkletNodeEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * BaseAudioContext 扩展：监听基础音频上下文事件（如 statechange）
 */
interface BaseAudioContext {
    when<T extends keyof BaseAudioContextEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<BaseAudioContextEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * BroadcastChannel 扩展：监听广播频道事件（如 message）
 */
interface BroadcastChannel {
    when<T extends keyof BroadcastChannelEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<BroadcastChannelEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * CSSAnimation 扩展：监听 CSS 动画事件（如 animationstart）
 */
interface CSSAnimation {
    when<T extends keyof AnimationEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AnimationEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * CSSTransition 扩展：监听 CSS 过渡事件（如 transitionend）
 */
interface CSSTransition {
    when<T extends keyof AnimationEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AnimationEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * CanvasCaptureMediaStreamTrack 扩展：监听画布捕获流事件（如 ended）
 */
interface CanvasCaptureMediaStreamTrack {
    when<T extends keyof MediaStreamTrackEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MediaStreamTrackEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * ConstantSourceNode 扩展：监听常量音频源事件（如 ended）
 */
interface ConstantSourceNode {
    when<T extends keyof AudioScheduledSourceNodeEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AudioScheduledSourceNodeEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * Document 扩展：监听文档事件（如 DOMContentLoaded）
 */
interface Document {
    when<T extends keyof DocumentEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<DocumentEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * Element 扩展：监听元素事件（如 click/input）
 */
interface Element {
    when<T extends keyof ElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<ElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * EventSource 扩展：监听 SSE 事件（如 message/error）
 */
interface EventSource {
    when<T extends keyof EventSourceEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<EventSourceEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * FileReader 扩展：监听文件读取事件（如 load/error）
 */
interface FileReader {
    when<T extends keyof FileReaderEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<FileReaderEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * FontFaceSet 扩展：监听字体加载事件（如 loading/loaded）
 */
interface FontFaceSet {
    when<T extends keyof FontFaceSetEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<FontFaceSetEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * GlobalEventHandlers 扩展：监听全局事件（如 click/keydown）
 */
interface GlobalEventHandlers {
    when<T extends keyof GlobalEventHandlersEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<GlobalEventHandlersEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * HTMLAudioElement 扩展：监听音频元素事件（如 play/pause）
 */
interface HTMLAudioElement {
    when<T extends keyof HTMLMediaElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<HTMLMediaElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * HTMLBodyElement 扩展：监听 body 元素事件（如 load）
 */
interface HTMLBodyElement {
    when<T extends keyof HTMLBodyElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<HTMLBodyElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * HTMLElement 扩展：监听 HTML 元素事件（如 scroll）
 */
interface HTMLElement {
    when<T extends keyof HTMLElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<HTMLElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * HTMLFrameSetElement 扩展：监听框架集事件（如 load）
 */
interface HTMLFrameSetElement {
    when<T extends keyof HTMLFrameSetElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<HTMLFrameSetElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * HTMLMediaElement 扩展：监听媒体元素事件（如 play/ended）
 */
interface HTMLMediaElement {
    when<T extends keyof HTMLMediaElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<HTMLMediaElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * HTMLVideoElement 扩展：监听视频元素事件（如 play/pause）
 */
interface HTMLVideoElement {
    when<T extends keyof HTMLVideoElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<HTMLVideoElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * IDBDatabase 扩展：监听 IndexedDB 数据库事件（如 versionchange）
 */
interface IDBDatabase {
    when<T extends keyof IDBDatabaseEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<IDBDatabaseEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * IDBOpenDBRequest 扩展：监听 IndexedDB 打开请求事件（如 success/error）
 */
interface IDBOpenDBRequest {
    when<T extends keyof IDBOpenDBRequestEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<IDBOpenDBRequestEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * IDBRequest 扩展：监听 IndexedDB 请求事件（如 success/error）
 */
interface IDBRequest<T = any> {
    when<K extends keyof IDBRequestEventMap>(
        event: K,
        options?: ObservableEventListenerOptions
    ): Observable<IDBRequestEventMap[K]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * IDBTransaction 扩展：监听 IndexedDB 事务事件（如 complete/abort）
 */
interface IDBTransaction {
    when<T extends keyof IDBTransactionEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<IDBTransactionEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MIDIAccess 扩展：监听 MIDI 访问事件（如 statechange）
 */
interface MIDIAccess {
    when<T extends keyof MIDIAccessEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MIDIAccessEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MIDIInput 扩展：监听 MIDI 输入事件（如 midimessage）
 */
interface MIDIInput {
    when<T extends keyof MIDIInputEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MIDIInputEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MIDIOutput 扩展：监听 MIDI 输出事件（如 statechange）
 */
interface MIDIOutput {
    when<T extends keyof MIDIPortEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MIDIPortEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MIDIPort 扩展：监听 MIDI 端口事件（如 statechange）
 */
interface MIDIPort {
    when<T extends keyof MIDIPortEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MIDIPortEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MathMLElement 扩展：监听 MathML 元素事件（如 click）
 */
interface MathMLElement {
    when<T extends keyof MathMLElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MathMLElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MediaDevices 扩展：监听媒体设备事件（如 devicechange）
 */
interface MediaDevices {
    when<T extends keyof MediaDevicesEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MediaDevicesEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MediaKeySession 扩展：监听媒体密钥会话事件（如 message）
 */
interface MediaKeySession {
    when<T extends keyof MediaKeySessionEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MediaKeySessionEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MediaQueryList 扩展：监听媒体查询事件（如 change）
 */
interface MediaQueryList {
    when<T extends keyof MediaQueryListEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MediaQueryListEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MediaRecorder 扩展：监听媒体录制事件（如 dataavailable/stop）
 */
interface MediaRecorder {
    when<T extends keyof MediaRecorderEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MediaRecorderEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MediaSource 扩展：监听媒体源事件（如 sourceopen/sourceclose）
 */
interface MediaSource {
    when<T extends keyof MediaSourceEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MediaSourceEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MediaStream 扩展：监听媒体流事件（如 addtrack/removetrack）
 */
interface MediaStream {
    when<T extends keyof MediaStreamEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MediaStreamEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MediaStreamTrack 扩展：监听媒体流轨道事件（如 ended/mute）
 */
interface MediaStreamTrack {
    when<T extends keyof MediaStreamTrackEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MediaStreamTrackEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MessageEventTarget 扩展：监听消息事件（如 message）
 */
interface MessageEventTarget<T> {
    when<K extends keyof MessageEventTargetEventMap>(
        event: K,
        options?: ObservableEventListenerOptions
    ): Observable<MessageEventTargetEventMap[K]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * MessagePort 扩展：监听消息端口事件（如 message/error）
 */
interface MessagePort {
    when<T extends keyof MessagePortEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<MessagePortEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * NavigationHistoryEntry 扩展：监听导航历史条目事件（如 dispose）
 */
interface NavigationHistoryEntry {
    when<T extends keyof NavigationHistoryEntryEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<NavigationHistoryEntryEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * Notification 扩展：监听通知事件（如 click/close）
 */
interface Notification {
    when<T extends keyof NotificationEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<NotificationEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * OfflineAudioContext 扩展：监听离线音频上下文事件（如 complete）
 */
interface OfflineAudioContext {
    when<T extends keyof OfflineAudioContextEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<OfflineAudioContextEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * OffscreenCanvas 扩展：监听离屏画布事件（如 contextlost/contextrestored）
 */
interface OffscreenCanvas {
    when<T extends keyof OffscreenCanvasEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<OffscreenCanvasEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * OscillatorNode 扩展：监听振荡器节点事件（如 ended）
 */
interface OscillatorNode {
    when<T extends keyof AudioScheduledSourceNodeEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AudioScheduledSourceNodeEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * PaymentRequest 扩展：监听支付请求事件（如 paymentmethodchange）
 */
interface PaymentRequest {
    when<T extends keyof PaymentRequestEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<PaymentRequestEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * PaymentResponse 扩展：监听支付响应事件（如 complete）
 */
interface PaymentResponse {
    when<T extends keyof PaymentResponseEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<PaymentResponseEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * Performance 扩展：监听性能事件（如 measure）
 */
interface Performance {
    when<T extends keyof PerformanceEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<PerformanceEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * PermissionStatus 扩展：监听权限状态事件（如 change）
 */
interface PermissionStatus {
    when<T extends keyof PermissionStatusEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<PermissionStatusEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * PictureInPictureWindow 扩展：监听画中画窗口事件（如 resize）
 */
interface PictureInPictureWindow {
    when<T extends keyof PictureInPictureWindowEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<PictureInPictureWindowEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * RTCDTMFSender 扩展：监听 WebRTC DTMF 发送事件（如 tonechange）
 */
interface RTCDTMFSender {
    when<T extends keyof RTCDTMFSenderEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<RTCDTMFSenderEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * RTCDataChannel 扩展：监听 WebRTC 数据通道事件（如 message/open）
 */
interface RTCDataChannel {
    when<T extends keyof RTCDataChannelEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<RTCDataChannelEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * RTCDtlsTransport 扩展：监听 WebRTC DTLS 传输事件（如 statechange）
 */
interface RTCDtlsTransport {
    when<T extends keyof RTCDtlsTransportEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<RTCDtlsTransportEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * RTCIceTransport 扩展：监听 WebRTC ICE 传输事件（如 statechange）
 */
interface RTCIceTransport {
    when<T extends keyof RTCIceTransportEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<RTCIceTransportEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * RTCPeerConnection 扩展：监听 WebRTC 对等连接事件（如 connectionstatechange）
 */
interface RTCPeerConnection {
    when<T extends keyof RTCPeerConnectionEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<RTCPeerConnectionEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * RTCSctpTransport 扩展：监听 WebRTC SCTP 传输事件（如 statechange）
 */
interface RTCSctpTransport {
    when<T extends keyof RTCSctpTransportEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<RTCSctpTransportEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * RemotePlayback 扩展：监听远程播放事件（如 connecting/connected）
 */
interface RemotePlayback {
    when<T extends keyof RemotePlaybackEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<RemotePlaybackEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * SVGAElement 扩展：监听 SVG 元素事件（如 click）
 */
interface SVGAElement {
    when<T extends keyof SVGElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<SVGElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * SVGSVGElement 扩展：监听 SVG 根元素事件（如 load）
 */
interface SVGSVGElement {
    when<T extends keyof SVGSVGElementEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<SVGSVGElementEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * ScreenOrientation 扩展：监听屏幕方向事件（如 change）
 */
interface ScreenOrientation {
    when<T extends keyof ScreenOrientationEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<ScreenOrientationEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * ScriptProcessorNode 扩展：监听脚本处理器节点事件（如 audioprocess）
 */
interface ScriptProcessorNode {
    when<T extends keyof ScriptProcessorNodeEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<ScriptProcessorNodeEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * ServiceWorker 扩展：监听 ServiceWorker 事件（如 statechange）
 */
interface ServiceWorker {
    when<T extends keyof ServiceWorkerEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<ServiceWorkerEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * ServiceWorkerContainer 扩展：监听 ServiceWorker 容器事件（如 controllerchange）
 */
interface ServiceWorkerContainer {
    when<T extends keyof ServiceWorkerContainerEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<ServiceWorkerContainerEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * ServiceWorkerRegistration 扩展：监听 ServiceWorker 注册事件（如 updatefound）
 */
interface ServiceWorkerRegistration {
    when<T extends keyof ServiceWorkerRegistrationEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<ServiceWorkerRegistrationEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * ShadowRoot 扩展：监听影子 DOM 事件（如 slotchange）
 */
interface ShadowRoot {
    when<T extends keyof ShadowRootEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<ShadowRootEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * SharedWorker 扩展：监听共享 Worker 事件（如 message/error）
 */
interface SharedWorker {
    when<T extends keyof AbstractWorkerEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<AbstractWorkerEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * SourceBuffer 扩展：监听媒体源缓冲区事件（如 update/error）
 */
interface SourceBuffer {
    when<T extends keyof SourceBufferEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<SourceBufferEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * SourceBufferList 扩展：监听媒体源缓冲区列表事件（如 addsourcebuffer）
 */
interface SourceBufferList {
    when<T extends keyof SourceBufferListEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<SourceBufferListEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * SpeechSynthesis 扩展：监听语音合成事件（如 voiceschanged）
 */
interface SpeechSynthesis {
    when<T extends keyof SpeechSynthesisEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<SpeechSynthesisEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * SpeechSynthesisUtterance 扩展：监听语音合成语句事件（如 start/end）
 */
interface SpeechSynthesisUtterance {
    when<T extends keyof SpeechSynthesisUtteranceEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<SpeechSynthesisUtteranceEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * TextTrack 扩展：监听文本轨道事件（如 cuechange）
 */
interface TextTrack {
    when<T extends keyof TextTrackEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<TextTrackEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * TextTrackCue 扩展：监听文本轨道提示事件（如 enter/exit）
 */
interface TextTrackCue {
    when<T extends keyof TextTrackCueEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<TextTrackCueEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * TextTrackList 扩展：监听文本轨道列表事件（如 addtrack/removetrack）
 */
interface TextTrackList {
    when<T extends keyof TextTrackListEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<TextTrackListEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * VTTCue 扩展：监听 VTT 提示事件（如 enter/exit）
 */
interface VTTCue {
    when<T extends keyof TextTrackCueEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<TextTrackCueEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * VideoDecoder 扩展：监听视频解码事件（如 decode）
 */
interface VideoDecoder {
    when<T extends keyof VideoDecoderEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<VideoDecoderEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * VideoEncoder 扩展：监听视频编码事件（如 encode）
 */
interface VideoEncoder {
    when<T extends keyof VideoEncoderEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<VideoEncoderEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * VisualViewport 扩展：监听视觉视口事件（如 resize/scroll）
 */
interface VisualViewport {
    when<T extends keyof VisualViewportEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<VisualViewportEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * WakeLockSentinel 扩展：监听唤醒锁事件（如 release）
 */
interface WakeLockSentinel {
    when<T extends keyof WakeLockSentinelEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<WakeLockSentinelEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * WebSocket 扩展：监听 WebSocket 事件（如 open/message/close）
 */
interface WebSocket {
    when<T extends keyof WebSocketEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<WebSocketEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * Window 扩展：监听窗口事件（如 load/resize/scroll）
 */
interface Window {
    when<T extends keyof WindowEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<WindowEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * WindowEventHandlers 扩展：监听窗口事件处理器事件（如 beforeunload）
 */
interface WindowEventHandlers {
    when<T extends keyof WindowEventHandlersEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<WindowEventHandlersEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * Worker 扩展：监听 Worker 事件（如 message/error）
 */
interface Worker {
    when<T extends keyof WorkerEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<WorkerEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * XMLHttpRequest 扩展：监听 XHR 事件（如 load/error/progress）
 */
interface XMLHttpRequest {
    when<T extends keyof XMLHttpRequestEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<XMLHttpRequestEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * XMLHttpRequestEventTarget 扩展：监听 XHR 事件目标事件（如 load）
 */
interface XMLHttpRequestEventTarget {
    when<T extends keyof XMLHttpRequestEventTargetEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<XMLHttpRequestEventTargetEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * XMLHttpRequestUpload 扩展：监听 XHR 上传事件（如 progress/load）
 */
interface XMLHttpRequestUpload {
    when<T extends keyof XMLHttpRequestEventTargetEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<XMLHttpRequestEventTargetEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}

/**
 * Navigation 扩展：监听页面导航事件（如 navigate）
 */
interface Navigation {
    when<T extends keyof NavigationEventMap>(
        event: T,
        options?: ObservableEventListenerOptions
    ): Observable<NavigationEventMap[T]>;
    when(type: string, options?: ObservableEventListenerOptions): Observable<Event>;
}


// ==============================================
// 10. 全局 when 函数：便捷监听 Window 事件（官方标准）
// ==============================================

/**
 * 全局 when 函数：监听 Window 事件（类型安全版）
 * 等价于 window.when(event, options)，提供更便捷的调用方式
 * @param event - Window 事件类型（如 "resize"）
 * @param options - 事件监听配置
 * @returns 发射对应事件的 Observable
 */
declare function when<T extends keyof WindowEventMap>(
    event: T,
    options?: ObservableEventListenerOptions
): Observable<WindowEventMap[T]>;

/**
 * 全局 when 函数：监听 Window 自定义事件（通用版）
 * @param type - 自定义事件类型字符串
 * @param options - 事件监听配置
 * @returns 发射 Event 对象的 Observable
 */
declare function when(
    type: string,
    options?: ObservableEventListenerOptions
): Observable<Event>;