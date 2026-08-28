/** Token类型 */
type TokenType =
    | 'Keyword'     // 关键字：变量/函数、操作符/字面量、基础控制流、协程/流程扩展
    | 'Identifier'  // 标识符：变量名、函数名、属性名（字母、$、_ 开头，后接数字字母下划线）。
    | 'Number'      // 数字字面量：支持十进制（含小数 123.45）、科学计数法（1e-5）以及十六进制（0xFF0000，常用于弹幕颜色
    | 'String'      // 字符串字面量：单引号 '...' 或双引号 "..." 字符串（支持基本的转义字符如 \n, \", \\ 等）
    | 'Operator'    // 运算符：算术运算符、赋值运算符、比较运算符、逻辑与位运算符、三元与条件
    | 'Punctuation' // 定界符：各种标点
    | 'Comment';    // 注释：单行注释 // 和多行注释 /* ... */


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
const KEYWORDS = new Set(['break', 'case', 'continue', 'default', 'delete', 'do', 'else', 'for', 'function', 'if', 'instanceof', 'new', 'return', 'switch', 'this', 'typeof', 'var', 'while', 'with', 'coroutine', 'suspend', 'yield', 'loop', 'null', 'undefined', 'true', 'false', 'void']);

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

    const [isDigit, isAlpha, isWhitespace, isHex, isPunctuation] = [/[0-9]/, /[a-zA-Z_$]/, /\s/, /[0-9a-fA-F]/, /[\(\)\[\]{}\.,;]/];

    while (cursor < length) {
        const char = code[cursor]!;
        const nextChar = code[cursor + 1];

        // 1.忽略纯空白字符（空格、换行、Tab）、
        if (isWhitespace.test(char)) {
            advance();
            continue;
        }

        // 记录当前 Token 的起始位置！
        const start = getPos();

        // 2.处理注释 (Comment)
        if (char === '/') {

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

            // 运算符逻辑交还给下面处理
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

        // 4. 处理标识符或关键字
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

        // 5. 处理十六进制数字
        if (char === '0' && nextChar === 'x') {
            let value = '0x';
            advance();
            advance();
            while (cursor < length && isHex.test(code[cursor]!)) {
                value += code[cursor];
                advance();
            }
            tokens.push({ type: 'Number', value, start, end: getPos() });
            continue;
        }

        // 5.处理十进制数字
        if (isDigit.test(char) || (char === '.' && isDigit.test(nextChar!)) || (char === '-' && (isDigit.test(code[cursor + 1]!) || (code[cursor + 1] === '.' && isDigit.test(code[cursor + 2]!))))) {
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
            // 处理e指数
            if ((code[cursor] === 'e' || code[cursor] === 'E') && (isDigit.test(code[cursor + 1]!) || (code[cursor + 1] === '-' && isDigit.test(code[cursor + 2]!)))) {
                value += code[cursor] + code[cursor + 1]!;
                advance();
                advance();
                while (cursor < length && isDigit.test(code[cursor]!)) {
                    value += code[cursor]!;
                    advance();
                }
            }
            tokens.push({ type: 'Number', value, start, end: getPos() });
            continue;
        }

        // 6. 处理运算符
        if (char === ':') {
            advance();
            tokens.push({ type: 'Operator', value: char, start, end: getPos() });
            continue;
        }
        if (char === '+' || char === '-') {
            if (nextChar === char || nextChar === '=') {
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + nextChar, start, end: getPos() });
                continue;
            }
            advance();
            tokens.push({ type: 'Operator', value: char, start, end: getPos() });
            continue;
        }
        if (char === '/' || char === '%' || char === '^' || char === '~') {
            if (nextChar === '=') {
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + nextChar, start, end: getPos() });
                continue;
            }
            advance();
            tokens.push({ type: 'Operator', value: char, start, end: getPos() });
            continue;
        }
        if (char === '=' || char === '*' || char === '&' || char === '|' || char === '<') {
            if (nextChar === char) {
                if (code[cursor + 2] === '=') {
                    advance();
                    advance();
                    advance();
                    tokens.push({ type: 'Operator', value: char + char + '=', start, end: getPos() });
                    continue;
                }
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + char, start, end: getPos() });
                continue;
            }
            if (nextChar === '=') {
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + nextChar, start, end: getPos() });
                continue;
            }
            advance();
            tokens.push({ type: 'Operator', value: char, start, end: getPos() });
            continue;
        }
        if (char === '?') {
            if (nextChar === char) {
                if (code[cursor + 2] === '=') {
                    advance();
                    advance();
                    advance();
                    tokens.push({ type: 'Operator', value: char + char + '=', start, end: getPos() });
                    continue;
                }
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + char, start, end: getPos() });
                continue;
            }
            if (nextChar === '.') {
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + nextChar, start, end: getPos() });
                continue;
            }
            advance();
            tokens.push({ type: 'Operator', value: char, start, end: getPos() });
            continue;
        }
        if (char === '>') {
            if (nextChar === char) {
                if (code[cursor + 2] === char) {
                    if (code[cursor + 3] === '=') {
                        advance();
                        advance();
                        advance();
                        advance();
                        tokens.push({ type: 'Operator', value: char + char + char + '=', start, end: getPos() });
                        continue;
                    }
                    advance();
                    advance();
                    advance();
                    tokens.push({ type: 'Operator', value: char + char + char, start, end: getPos() });
                    continue;
                }
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + char, start, end: getPos() });
                continue;
            }
            if (nextChar === '=') {
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + nextChar, start, end: getPos() });
                continue;
            }
            advance();
            tokens.push({ type: 'Operator', value: char, start, end: getPos() });
            continue;
        }
        if (char === '!') {
            if (nextChar === '=') {
                if (code[cursor + 2] === '=') {
                    advance();
                    advance();
                    advance();
                    tokens.push({ type: 'Operator', value: char + '=' + '=', start, end: getPos() });
                    continue;
                }
                advance();
                advance();
                tokens.push({ type: 'Operator', value: char + '=', start, end: getPos() });
                continue;
            }
            advance();
            tokens.push({ type: 'Operator', value: char, start, end: getPos() });
            continue;
        }

        // 7. 处理定界符
        if (isPunctuation.test(char)) {
            advance();
            tokens.push({ type: 'Punctuation', value: char, start, end: getPos() });
            continue;
        }

        throw new Error(`非法字符: "${char}" 位置在：第${line}行，第${column}个字符，总第${cursor + 1}个字符`);
    }

    return tokens;
}