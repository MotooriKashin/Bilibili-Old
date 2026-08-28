/** Token类型 */
type TokenType =
    | 'Keyword'     // 关键字：语言预先保留的“指令单词”，有特殊语法含义。
    | 'Identifier'  // 标识符：变量名、函数名、参数名等。
    | 'Number'      // 数字字面量：1
    | 'Color'       // 颜色字面量：0x00a1d6
    | 'Percent'     // 百分比字面量：50%
    | 'String'      // 字符串字面量
    | 'Time'        // 时间字面量
    | 'Operator'    // 用于运算或赋值的符号
    | 'Punctuation' // 标点/分割符
    | 'Comment';    // 注释：// ... 或 /* ... */


interface Position {
    /** 行号，从 1 开始 */
    line: number;
    /** 列号，从 1 开始 */
    column: number;
    /** 在整个代码中的索引，从 0 开始 */
    index: number;
}

export interface Token {
    /** token类型 */
    type: TokenType;
    /** 值 */
    value: string;
    /** 标记 Token 的开始位置 */
    start: Position;
    /** 标记 Token 的结束位置 */
    end: Position;
}

/** 关键字 */
const KEYWORDS = new Set(['def', 'let', 'set', 'then']);

export function tokenize(code: string) {
    const tokens: Token[] = [];
    const { length } = code;
    let cursor = 0;
    let line = 1;
    let column = 1;

    /** 获取当前状态的位置快照 */
    function getPos() {
        return <Position>{ line, column, index: cursor };
    };

    /** 往前走一步，并自动更新行列号 */
    function advance() {
        const char = code[cursor];
        cursor++;
        if (char === '\n') {
            line++;
            column = 1; // 换行后列号归一
        } else {
            column++;  // 普通字符列号加一
        }
    };

    const [isDigit, isAlpha, isWhitespace, isHex, isTimeUnit, isPunctuation] = [/[0-9]/, /[a-zA-Z_$]/, /\s/, /[0-9a-fA-F]/, /[hms]/!, /[{},\(\)]/];

    while (cursor < length) {
        const char = code[cursor]!;

        // 1.忽略纯空白字符（空格、换行、Tab）、
        if (isWhitespace.test(char)) {
            advance();
            continue;
        }

        // 记录当前 Token 的起始位置！
        const start = getPos();

        // 2.处理注释 (Comment)
        if (char === '/') {
            const nextChar = code[cursor + 1];

            // 单行注释 //
            if (nextChar === '/') {
                let value = '';
                while (cursor < length && code[cursor] !== '\n') {
                    value += code[cursor];
                    advance();
                }
                tokens.push({ type: 'Comment', value, start, end: getPos() });
                continue;
            }

            // 多行注释 /* ... */
            if (nextChar === '*') {
                let value = '';

                while (cursor < length) {
                    if (code[cursor] === '*' && code[cursor + 1] === '/') {
                        value += '*/';
                        // 跳过 */
                        advance();
                        advance();
                        break;
                    }
                    value += code[cursor];
                    advance();
                }
                tokens.push({ type: 'Comment', value, start, end: getPos() });
                continue;
            }

        }

        // 3.处理字符串
        if (char === '"' || char === "'") {
            const quoteMark = char;
            let value = '';
            advance(); // 跳过起始引号

            while (cursor < length) {
                const current = code[cursor];
                if (current === '\\') { // 处理转义符
                    value += code[cursor + 1];
                    advance();
                    advance();
                    continue;
                }
                if (current === quoteMark) { // 遇到了闭合引号
                    advance();
                    break;
                }
                value += current;
                advance();
            }
            tokens.push({ type: 'String', value, start, end: getPos() });
            continue;
        }

        // 4.处理颜色
        if (char === '0' && code[cursor + 1] === 'x') {
            let value = '#';
            advance();
            advance();
            while (cursor < length && isHex.test(code[cursor]!)) {
                value += code[cursor];
                advance();
            }
            tokens.push({ type: 'Color', value, start, end: getPos() });
            continue;
        }

        // 5.处理数字，时间，百分比
        if (isDigit.test(char) || (char === '.' && isDigit.test(code[cursor + 1]!)) || (char === '-' && (isDigit.test(code[cursor + 1]!) || (code[cursor + 1] === '.' && isDigit.test(code[cursor + 2]!))))) {
            let nd = 0;
            let value = char;
            advance();
            while (cursor < length && (isDigit.test(code[cursor]!) || (code[cursor] === '.' && nd < 2))) {
                if (code[cursor] === '.') {
                    nd++;
                }
                value += code[cursor]!;
                advance();
            }
            // 处理百分比
            if (code[cursor] === '%') {
                advance();
                tokens.push({ type: 'Percent', value, start, end: getPos() });
                continue;
            }
            // 处理时间
            if (isTimeUnit.test(code[cursor]!)) {
                let nd = 0;
                while (cursor < length && (isDigit.test(code[cursor]!) || (code[cursor] === '.' && nd < 2)) || isTimeUnit.test(code[cursor]!)) {
                    if (code[cursor] === '.') {
                        nd++;
                    }
                    if (isTimeUnit.test(code[cursor]!)) {
                        nd = 0;
                    }
                    value += code[cursor]!;
                    advance();
                }
                if (isTimeUnit.test(code[cursor - 1]!)) {
                    tokens.push({ type: 'Time', value, start, end: getPos() });
                    continue;
                }
                throw new Error(`非法字符串: "${value}" 位置在：第${line}行，第${column}个字符，总第${cursor + 1}个字符。预期为时间，但是缺少末尾单位`);
            }
            // 普通数字
            tokens.push({ type: 'Number', value, start, end: getPos() });
            continue;
        }

        // 6. 处理标识符或关键字
        if (isAlpha.test(char)) {
            let idStr = '';
            while (cursor < code.length && (isAlpha.test(code[cursor]!) || isDigit.test(code[cursor]!))) {
                idStr += code[cursor];
                advance();
            }
            const type = KEYWORDS.has(idStr) ? 'Keyword' : 'Identifier';
            tokens.push({ type, value: idStr, start, end: getPos() });
            continue;
        }

        // 7. 处理运算符
        if (char === '=') {
            advance();
            tokens.push({ type: 'Operator', value: char, start, end: getPos() });
            continue;
        }

        // 8. 处理分割符
        if (isPunctuation.test(char)) {
            advance();
            tokens.push({ type: 'Punctuation', value: char, start, end: getPos() });
            continue;
        }

        throw new Error(`非法字符: "${char}" 位置在：第${line}行，第${column}个字符，总第${cursor + 1}个字符`);
    }

    return tokens;
}