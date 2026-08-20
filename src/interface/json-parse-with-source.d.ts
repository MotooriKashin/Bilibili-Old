/**
 * TC39 提案：JSON.parse source text access (JSON.parse with source) 和 JSON.rawJSON 的全局类型和接口定义。
 * 此定义扩展了全局内置的 `JSON` 接口。
 * @see https://tc39.es/proposal-json-parse-with-source/
 */

// =================================================================
// 1. 新的数据结构接口
// =================================================================

/**
 * 传递给 JSON.parse reviver 函数的上下文对象。
 */
declare interface JSONParseContext {
    /**
     * 如果解析出的值是未修改的基本类型（字符串、数字、布尔值或 null），
     * 此属性包含该值在原始 JSON 字符串中对应的源文本（包含引号等）。
     * 对于对象或数组，此属性通常不存在。
     */
    readonly source?: string;
}

/**
 * JSON.rawJSON() 返回的对象，用于表示原始 JSON 文本。
 * 这是一个不可变 (frozen) 的对象，其中包含原始 JSON 文本的字符串。
 */
declare interface RawJSON {
    /**
     * 包含原始 JSON 文本的字符串。
     * 例如，如果调用 `JSON.rawJSON('123')`，此属性值为 `'123'`。
     */
    readonly rawJSON: string;
}


// =================================================================
// 2. 扩展全局 JSON 接口
// =================================================================

/**
 * 扩展全局内置的 JSON 接口。
 */
interface JSON {
    /**
     * 检查给定对象是否是使用 `JSON.rawJSON()` 创建的 RawJSON 对象。
     *
     * @param O 要检查的值。
     * @returns 如果 O 是一个 RawJSON 对象则返回 true，否则返回 false。
     * @see https://tc39.es/proposal-json-parse-with-source/#sec-json.israwjson
     */
    isRawJSON(O: any): O is RawJSON;

    /**
     * 从表示 JSON 原始值（字符串、数字、布尔值或 null）的文本中创建一个不可变的 RawJSON 对象。
     * 此方法主要用于在自定义序列化中插入预先格式化好的 JSON 片段。
     *
     * @param text 包含单个 JSON 原始值的字符串（如 '123' 或 '"hello"'）。
     * @returns 一个被冻结的 RawJSON 对象。
     * @throws {SyntaxError} 如果输入不是有效的 JSON 原始值文本，或输入为空字符串或包含外部空白字符。
     * @see https://tc39.es/proposal-json-parse-with-source/#sec-json.rawjson
     */
    rawJSON(text: string): RawJSON;

    /**
     * 使用 reviver 函数解析 JSON 字符串，并支持获取源文本。
     *
     * @param text 要解析的 JSON 字符串。
     * @param reviver 用于转换解析结果的函数，可选择接受第三个参数 `context`。
     * @returns 解析后的 JavaScript 值。
     * @throws {SyntaxError} 如果输入不是有效的 JSON 文本。
     */
    parse(
        text: string,
        reviver: (this: any, key: string, value: any, context: JSONParseContext) => any
    ): any;
}