import type { Token } from "./lexer";

/** AST 基础节点 */
export interface ASTNode {
    type: string;
}

/** def定义节点 */
export interface DefNode extends ASTNode {
    type: 'def';
    key: string;
    value: string;
    params: ASTNode[];
    properties: ASTNode[];
}

export interface ParamNode extends ASTNode {
    type: 'param';
    key: string;
    value: ASTNode;
}

/** 参数引用节点 */
export interface CurserNode extends ASTNode {
    type: 'curser';
    /** 引用参数名称 */
    value: string;
}

export interface NumberNode extends ASTNode {
    type: 'number';
    value: number;
}

export interface ColorNode extends ASTNode {
    type: 'color';
    value: string;
}

export interface PercentNode extends ASTNode {
    type: 'percent';
    value: string;
}

export interface StringNode extends ASTNode {
    type: 'string';
    value: string;
}

export interface TimeNode extends ASTNode {
    type: 'time';
    value: number;
}

export interface SubNode extends ASTNode {
    type: 'sub';
    key: string;
    value: ParamNode[];
}

export interface LetNode extends ASTNode {
    type: 'let';
    key: string;
    value: string;
    params: ASTNode[];
    properties: ASTNode[];
}

export interface SetNode extends ASTNode {
    type: 'set';
    key: string;
    properties: ASTNode[];
    duration: number;
    timeFunction: string | null;
}

export interface ThenNode extends ASTNode {
    type: 'then';
    key: string;
    properties: ASTNode[];
    duration: number;
    timeFunction: string | null;
}

export function parser(tokens: Token[]) {
    let cursor = 0;
    const ast: ASTNode[] = [];

    // 过滤注释token
    tokens = tokens.filter(t => t.type !== 'Comment');

    /** 获取当前token */
    function peek() {
        return tokens[cursor];
    }

    /** 消费当前token */
    function eat() {
        return tokens[cursor++];
    }

    /** 解析 def 定义 */
    function parseDef() {
        eat(); // 消费 def
        const [type, id] = [eat(), eat()];
        let data = eat();
        if (!type || !id || !data) throw new Error('语法错误: def 定义不完整');
        if (type.type !== 'Identifier' && type.type !== 'Keyword') {
            // 贪婪匹配：语法并未规定关键字不能作为标识符
            throw new Error(`语法错误：预期之外的 token 类型，值“${type.value}”，位置在：第${type.start.line}行，第${type.start.column}个字符，总第${type.start.index + 1}个字符`);
        }
        if (id.type !== 'Identifier' && id.type !== 'Keyword') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
        }
        if (data.type !== 'Punctuation') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${data.value}”，位置在：第${data.start.line}行，第${data.start.column}个字符，总第${data.start.index + 1}个字符`);
        }
        const params: ASTNode[] = [];
        if (data.value === '(') {
            while (peek()?.type !== 'Punctuation' || peek()?.value !== ')') {
                const param = parseParam();
                param && params.push(param);
            }
            eat(); // 消费参数末尾的“)”
            data = eat(); // 进入属性处理
        }
        const properties: ASTNode[] = [];
        if (data?.type === 'Punctuation' && data?.value === '{') {
            while (peek()?.type !== 'Punctuation' || peek()?.value !== '}') {
                const property = parseProperty();
                property && properties.push(property);
            }
            eat(); // 消费属性末尾的“}”
        }

        return <DefNode>{ type: 'def', key: type.value, value: id.value, params, properties };
    }

    /** 解析 let 定义 */
    function parseLet() {
        eat(); // 消费 let
        const [id, operator, type] = [eat(), eat(), eat()];
        let data = peek();
        if (!type || !operator || !id) throw new Error('语法错误: let 定义不完整');
        if (id.type !== 'Identifier' && id.type !== 'Keyword') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
        }
        if (operator.type !== 'Punctuation' && operator.value !== '=') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
        }
        if (type.type !== 'Identifier' && type.type !== 'Keyword') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${type.value}”，位置在：第${type.start.line}行，第${type.start.column}个字符，总第${type.start.index + 1}个字符`);
        }
        const params: ASTNode[] = [];
        if (data?.type === 'Punctuation' && data?.value === '(') {
            eat(); // 消费参数前的“(”
            while (peek()?.type !== 'Punctuation' || peek()?.value !== ')') {
                const param = parseParam();
                param && params.push(param);
            }
            eat(); // 消费参数末尾的“)”
            data = peek(); // 进入属性处理
        }
        const properties: ASTNode[] = [];
        if (data?.type === 'Punctuation' || data?.value === '{') {
            eat(); // 消费属性前的“{”
            while (peek()?.type !== 'Punctuation' || peek()?.value !== '}') {
                const property = parseProperty();
                property && properties.push(property);
            }
            eat(); // 消费属性末尾的“}”
        }

        return <LetNode>{ type: 'let', key: type.value, value: id.value, params, properties };
    }

    /** 解析 set 定义 */
    function parseSet() {
        eat(); // 消费 set
        const id = eat();
        if (!id) throw new Error('语法错误: set 定义不完整');
        let { value, type } = id;
        if (type === 'Punctuation') {
            if (id.value !== '(') throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
            // 使用匿名实例
            value = crypto.randomUUID();
            type = 'Identifier';
            const typeNode = eat();
            if (!typeNode) throw new Error('语法错误: set 定义不完整');
            if (typeNode.type !== 'Identifier' && typeNode.type !== 'Keyword') {
                throw new Error(`语法错误：预期之外的 token 类型，值“${typeNode.value}”，位置在：第${typeNode.start.line}行，第${typeNode.start.column}个字符，总第${typeNode.start.index + 1}个字符`);
            }
            let data = peek();
            if (!data) throw new Error('语法错误: set 定义不完整');
            const params: ASTNode[] = [];
            if (data?.type === 'Punctuation' && data?.value === '(') {
                eat(); // 消费参数前的“(”
                while (peek()?.type !== 'Punctuation' || peek()?.value !== ')') {
                    const param = parseParam();
                    param && params.push(param);
                }
                eat(); // 消费参数末尾的“)”
                data = peek(); // 进入属性处理
            }
            const properties: ASTNode[] = [];
            if (data?.type === 'Punctuation' && data?.value === '{') {
                eat(); // 消费属性前的“{”
                while (peek()?.type !== 'Punctuation' || peek()?.value !== '}') {
                    const property = parseProperty();
                    property && properties.push(property);
                }
                eat(); // 消费属性末尾的“}”
            }
            ast.push(<LetNode>{ type: 'let', key: typeNode.value, value, params, properties });
            eat(); // 消费“)”
        }
        if (type !== 'Identifier' && type !== 'Keyword') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
        }
        const data = peek();
        if (!data) throw new Error('语法错误: set 定义不完整');
        const properties: ASTNode[] = [];
        if (data?.type === 'Punctuation' || data?.value === '{') {
            eat(); // 消费属性前的“{”
            while (peek()?.type !== 'Punctuation' || peek()?.value !== '}') {
                const property = parseProperty();
                property && properties.push(property);
            }
            eat(); // 消费属性末尾的“}”
        }
        const durationNode = eat();
        if (!durationNode) throw new Error('语法错误: set 定义不完整');
        if (durationNode.type !== 'Time') throw new Error(`语法错误：预期之外的 token 类型，值“${durationNode.value}”，位置在：第${durationNode.start.line}行，第${durationNode.start.column}个字符，总第${durationNode.start.index + 1}个字符`);
        const duration = parseDurationToMs(durationNode.value);
        let timeFunction = null;
        const pu = peek();
        if (pu?.type === 'Punctuation' && pu.value === ',') {
            eat();
            const tf = eat();
            if (tf?.type === 'String') {
                timeFunction = tf.value;
            }
        }

        return <SetNode>{ type: 'set', key: value, properties, duration, timeFunction };
    }

    /** 解析参数 */
    function parseParam() {
        const [key, next] = [eat(), peek()];
        if (!key || !next) throw new Error('语法错误: 参数定义不完整');
        if (key.type === 'Punctuation') {
            if (key.value !== ',') throw new Error(`语法错误：预期之外的 token 类型，值“${key.value}”，位置在：第${key.start.line}行，第${key.start.column}个字符，总第${key.start.index + 1}个字符`);
            return;
        }
        if (next.type === 'Punctuation' && (next.value === ',' || next.value === ')')) {
            // 匿名参数
            switch (key.type) {
                case "Number": {
                    return parseNumber(key);
                }
                case 'Color': {
                    return parseColor(key);
                }
                case 'Percent': {
                    return parsePercent(key);
                }
                case 'String': {
                    return parseString(key);
                }
                case 'Time': {
                    return parseTime(key);
                }
                case 'Identifier': case 'Keyword': {
                    if (key.value.startsWith('Ox')) {
                        // 兼容将颜色值前缀 0 误写成 O 的笔误
                        key.value = `#${key.value.slice(2)}`;
                        return parseColor(key);
                    }
                }
            }
            throw new Error(`语法错误：预期之外的 token 类型，值“${key.value}”，位置在：第${key.start.line}行，第${key.start.column}个字符，总第${key.start.index + 1}个字符`);
        }
        if (key.type !== 'Identifier' && key.type !== 'Keyword') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${key.value}”，位置在：第${key.start.line}行，第${key.start.column}个字符，总第${key.start.index + 1}个字符`);
        }
        if (next.type === 'Punctuation' && next.value === '{') {
            // 匿名参数还嵌套？！
            // 处理嵌套属性
            const properties: ASTNode[] = [];
            eat(); // 消费属性前的“{”
            while (peek()?.type === 'Punctuation' || peek()?.value === '}') {
                const property = parseProperty();
                property && properties.push(property);
            }
            eat(); // 消费属性末尾的“}”
            return <SubNode>{ type: 'sub', key: key.value, value: properties };
        }
        const [operator, value] = [eat(), eat()];
        if (!operator || !value) throw new Error('语法错误: 参数定义不完整');
        if (operator.type !== 'Operator' && operator.value !== '=') throw new Error(`语法错误：预期之外的 token 类型，值“${operator.value}”，位置在：第${operator.start.line}行，第${operator.start.column}个字符，总第${operator.start.index + 1}个字符`);
        let res: ASTNode | undefined = undefined;
        switch (value.type) {
            case 'Number': {
                res = parseNumber(value);
                break;
            }
            case 'Color': {
                res = parseColor(value);
                break;
            }
            case 'Percent': {
                res = parsePercent(value);
                break;
            }
            case 'String': {
                res = parseString(value);
                break;
            }
            case 'Time': {
                res = parseTime(value);
                break;
            }
            case 'Identifier': case 'Keyword': {
                if (value.value.startsWith('Ox')) {
                    // 兼容将颜色值前缀 0 误写成 O 的笔误
                    value.value = `#${value.value.slice(2)}`;
                    res = parseColor(value);
                } else if (peek()?.type === 'Punctuation' && peek()?.value === '{') {
                    // 处理嵌套属性
                    const properties: ASTNode[] = [];
                    eat(); // 消费属性前的“{”
                    while (peek()?.type !== 'Punctuation' || peek()?.value !== '}') {
                        const property = parseProperty();
                        property && properties.push(property);
                    }
                    eat(); // 消费属性末尾的“}”
                    res = <SubNode>{ type: 'sub', key: value.value, value: properties };
                }
                break;
            }
        }
        if (!res) throw new Error(`语法错误：预期之外的 token 类型，值“${value.value}”，位置在：第${value.start.line}行，第${value.start.column}个字符，总第${value.start.index + 1}个字符`);
        return <ParamNode>{ type: 'param', key: key.value, value: res };
    }

    /** 解析属性 */
    function parseProperty() {
        const key = eat();
        if (!key) throw new Error('语法错误: 参数定义不完整');
        if (key.type !== 'Identifier' && key.type !== 'Keyword') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${key.value}”，位置在：第${key.start.line}行，第${key.start.column}个字符，总第${key.start.index + 1}个字符`);
        }
        const [operator, value] = [eat(), eat()];
        if (!operator || !value) throw new Error('语法错误: 参数定义不完整');
        if (operator.type !== 'Operator' && operator.value !== '=') throw new Error(`语法错误：预期之外的 token 类型，值“${operator.value}”，位置在：第${operator.start.line}行，第${operator.start.column}个字符，总第${operator.start.index + 1}个字符`);
        let res: ASTNode | undefined = undefined;
        switch (value.type) {
            case 'Number': {
                res = parseNumber(value);
                break;
            }
            case 'Color': {
                res = parseColor(value);
                break;
            }
            case 'Percent': {
                res = parsePercent(value);
                break;
            }
            case 'String': {
                res = parseString(value);
                break;
            }
            case 'Time': {
                res = parseTime(value);
                break;
            }
            case 'Identifier': case 'Keyword': {
                if (value.value.startsWith('Ox')) {
                    // 兼容将颜色值前缀 0 误写成 O 的笔误
                    value.value = `#${value.value.slice(2)}`;
                    res = parseColor(value);
                } else if (peek()?.type === 'Punctuation' && peek()?.value === '{') {
                    // 处理嵌套属性
                    const properties: ASTNode[] = [];
                    eat(); // 消费属性前的“{”
                    while (peek()?.type !== 'Punctuation' || peek()?.value !== '}') {
                        const property = parseProperty();
                        property && properties.push(property);
                    }
                    eat(); // 消费属性末尾的“}”
                    res = <SubNode>{ type: 'sub', key: value.value, value: properties };
                } else {
                    // 可能是参数引用
                    res = <CurserNode>{ type: 'curser', value: value.value };
                }
                break;
            }
        }
        if (!res) throw new Error(`语法错误：预期之外的 token 类型，值“${value.value}”，位置在：第${value.start.line}行，第${value.start.column}个字符，总第${value.start.index + 1}个字符`);
        return <ParamNode>{ type: 'param', key: key.value, value: res };
    }

    /** 解析数字 */
    function parseNumber(token: Token) {
        return <NumberNode>{ type: 'number', value: Number(token.value) };
    }

    /** 解析颜色 */
    function parseColor(token: Token) {
        return <ColorNode>{ type: 'color', value: token.value };
    }

    /** 解析百分比 */
    function parsePercent(token: Token) {
        return <PercentNode>{ type: 'percent', value: token.value };
    }

    /** 解析字符串 */
    function parseString(token: Token) {
        return <StringNode>{ type: 'string', value: token.value };
    }

    /** 解析时间 */
    function parseTime(token: Token) {
        return <TimeNode>{ type: 'time', value: parseDurationToMs(token.value) }
    }

    const { length } = tokens;
    while (cursor < length) {
        const token = peek();
        if (token) {
            // 1.处理对象定义
            switch (token.type) {
                case 'Keyword': {
                    switch (token.value) {
                        case 'def': {
                            ast.push(parseDef());
                            break;
                        }
                        case 'let': {
                            ast.push(parseLet());
                            break;
                        }
                        case 'set': {
                            ast.push(parseSet());
                            break;
                        }
                        case 'then': {
                            eat(); // 消费 then
                            ast.push(Object.assign(parseSet(), { type: 'then' }));
                            break;
                        }
                        default: {
                            throw new Error(`语法错误: 不支持的“Keyword”，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
                        }
                    }
                    break;
                }
                case 'Punctuation': {
                    // 语句组
                    if (token.value !== '{' && token.value !== '}') throw new Error(`语法错误: 预期为“Keyword”，但获取到类型“${token.type}”，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
                    eat();
                    break;
                }
                default: {
                    throw new Error(`语法错误: 预期为“Keyword”，但获取到类型“${token.type}”，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
                }
            }
        }
    }

    return ast;
}

/**
 * 支持的时间单位类型
 */
type TimeUnit = 'h' | 'm' | 's' | 'ms';

/**
 * 各单位对应的毫秒数换算表
 */
const UNIT_TO_MS: Record<TimeUnit, number> = {
    h: 3600 * 1000,
    m: 60 * 1000,
    s: 1000,
    ms: 1,
};

/**
 * 将时间长度字符串转换为毫秒数
 * @param durationStr 时间长度字符串，例如 "1h30m", "1.5s", "1000ms"
 * @returns 转换后的总毫秒数
 * @throws 当字符串格式不合法或含有未定义单位时抛出异常
 */
export function parseDurationToMs(durationStr: string): number {
    if (!durationStr || typeof durationStr !== 'string') {
        throw new Error('输入必须是非空字符串');
    }

    const str = durationStr.trim().toLowerCase();

    // 正则解析：匹配 (数字)(单位)，支持浮点数
    const regex = /(-?\d+(?:\.\d+)?)\s*(ms|h|m|s)/g;

    let totalMs = 0;
    let matchCount = 0;
    let lastIndex = 0;

    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
        // 检查是否有无法识别的字符夹杂在匹配之间
        if (match.index !== lastIndex) {
            throw new Error(`无法解析的字符段: "${str.slice(lastIndex, match.index)}"`);
        }

        const value = parseFloat(match[1]!);
        const unit = match[2] as TimeUnit;

        if (isNaN(value)) {
            throw new Error(`无效的数值: "${match[1]}"`);
        }

        totalMs += value * UNIT_TO_MS[unit];
        matchCount++;
        lastIndex = regex.lastIndex;
    }

    // 如果字符串结尾还有未被匹配的内容，或完全没匹配到任何有效时间
    if (lastIndex !== str.length || matchCount === 0) {
        throw new Error(`无效的时间格式: "${durationStr}"`);
    }

    return totalMs;
}