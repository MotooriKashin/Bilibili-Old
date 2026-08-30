import { type ArrayExpression, type AssignmentExpression, type AwaitExpression, type BinaryExpression, type BlockStatement, type BreakStatement, type CallExpression, type CatchClause, type ConditionalExpression, type ContinueStatement, type DebuggerStatement, type DoWhileStatement, type EmptyStatemen, type Expression, type ExpressionStatement, type ForInStatement, type ForStatement, type FunctionDeclaration, type FunctionExpression, type Identifier, type IfStatement, type LabeledStatement, type Literal, type LogicalExpression, type MemberExpression, type NewExpression, type ObjectExpression, type Program, type Property, type ReturnStatement, type SequenceExpression, type Statement, type SwitchCase, type SwitchStatement, type ThisExpression, type ThrowStatement, type TryStatement, type UnaryExpression, type UpdateExpression, type VariableDeclaration, type VariableDeclarator, type WhileStatement, type WithStatement } from "./ast";
import type { Token } from "./lexer";

/**
 * 语法分析器  
 * 将 token 转换为标准 es5 语法树（ESTree）  
 * 对于自定义语法：
 * 1. 协程（coroutine）转换为 async 函数
 * 2. loop 循环转换为 while(true) 循环
 * 3. suspend/yield 表达式转换为 await 语句
 * 
 * 沙箱中别忘了提供全局函数`function $nextFrame: Promise<void>`
 * @example
 * function $nextFrame = () => { return new Promise(resolve => requestAnimationFrame(resolve)); }
 */
export function parser(tokens: Token[]) {
    let cursor = 0;

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

    /** 函数声明 */
    function parseFunctionDeclaration(): FunctionDeclaration {
        eat(); // 消费 function
        const [id, param] = [eat(), eat()];
        if (!id || !param) throw new Error('语法错误：函数声明不完整');
        if (id.type !== 'Identifier' && id.type !== 'Keyword') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
        }
        if (param.type !== 'Punctuation' && param.value !== '(') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${param.value}”，位置在：第${param.start.line}行，第${param.start.column}个字符，总第${param.start.index + 1}个字符`);
        }
        const params: Identifier[] = [];
        while (peek() && (peek()?.type !== 'Punctuation' || peek()?.value !== ')')) {
            const id = eat()!;
            if (id.type !== 'Identifier' && id.type !== 'Keyword') {
                throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
            }
            params.push({ type: 'Identifier', name: id.value });
            if (peek() && peek()?.type === 'Punctuation' && peek()?.value === ',') {
                eat();
            }
        }
        eat() // 消费 )
        const body = parseBlockStatement();

        return { type: 'FunctionDeclaration', id: { type: 'Identifier', name: id.value }, params, body, async: false };
    }

    /** 函数体 */
    function parseFunctionExpression(): FunctionExpression {
        const [, param] = [eat(), eat()];
        if (!param) throw new Error('语法错误：函数声明不完整');
        if (param.type !== 'Punctuation' && param.value !== '(') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${param.value}”，位置在：第${param.start.line}行，第${param.start.column}个字符，总第${param.start.index + 1}个字符`);
        }
        const params: Identifier[] = [];
        while (peek() && (peek()?.type !== 'Punctuation' && peek()?.value !== ')')) {
            const id = eat()!;
            if (id.type !== 'Identifier' && id.type !== 'Keyword') {
                throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
            }
            params.push({ type: 'Identifier', name: id.value });
            if (peek() && peek()?.type === 'Punctuation' && peek()?.value === ',') {
                eat();
            }
        }
        eat() // 消费 )
        const body = parseBlockStatement();

        return { type: 'FunctionExpression', id: null, params, body, async: false };
    }

    /** 块语句 */
    function parseBlockStatement(): BlockStatement {
        eat();
        const body: Statement[] = [];
        const { length } = tokens;
        top:
        while (cursor < length) {
            const token = peek();
            if (token) {
                if (token.type === 'Punctuation' && token.value === '}') {
                    break;
                }
                const next = parseStatement();
                if (next.type === 'SequenceExpression') {
                    const prev = body.at(-1);
                    if (prev) {
                        if (prev.type === 'SequenceExpression') {
                            (<SequenceExpression>prev).expressions.push(next);
                        } else {
                            (<SequenceExpression>next).expressions.unshift(prev);
                            body[body.length - 1] = next;
                        }
                    }
                } else {
                    body.push(next);
                }
            }
        }
        eat();

        return { type: 'BlockStatement', body };
    }

    /** 空语句 */
    function parseEmptyStatement(): EmptyStatemen {
        eat();
        return { type: 'EmptyStatement' };
    }

    /** debugger */
    function parseDebuggerStatement(): DebuggerStatement {
        eat();
        return { type: 'DebuggerStatement' };
    }

    /** with 语句 */
    function parseWithStatement(): WithStatement {
        eat();
        const b = eat();
        if (!b) throw new Error('语法错误：with 语句不完整');
        if (b.type !== 'Punctuation' || b.value !== '(') {
            throw new Error(`语法错误: 不支持的 token，值“${b.value}”，位置在：第${b.start.line}行，第${b.start.column}个字符，总第${b.start.index + 1}个字符`);
        }
        let object: Expression = parseExpression();
        eat(); // 消费 )

        const body = parseStatement();
        return { type: 'WithStatement', object, body };
    }

    /** 表达式语句 */
    function parseExpressionStatement(): ExpressionStatement {
        const expression = parseExpression();
        return { type: 'ExpressionStatement', expression }
    }

    /** 解析表达式 */
    function parseExpression(precedence = 0): Expression {
        const token = eat();
        if (!token) throw new Error('语法错误：非表达式');
        let res: Expression;
        switch (token.type) {
            case 'Identifier':
            case 'Keyword': {
                switch (token.value.toLowerCase()) {
                    case 'function': {
                        cursor--;
                        res = parseFunctionExpression();
                        break;
                    }
                    case 'this': {
                        res = <ThisExpression>{ type: 'ThisExpression' };
                        break;
                    }
                    case 'true':
                    case 'false':
                    case 'null': {
                        res = <Literal>{ type: 'Literal', value: token.value };
                        break;
                    }
                    case 'typeof':
                    case 'void':
                    case 'delete': {
                        const operator = token.value;
                        const argument = parseExpression(15);
                        res = <UnaryExpression>{ type: 'UnaryExpression', operator, prefix: true, argument };
                        break;
                    }
                    case 'suspend':
                    case 'yield': {
                        // 【扩展】 原携暂停语法，转换为配合 async 函数的 await 表达式，依赖全局蹄冻函数 function $nextFrame: Promise<void>
                        const argument: CallExpression = { type: 'CallExpression', callee: <Identifier>{ type: 'Identifier', name: '$nextFrame' }, arguments: [] };
                        res = <AwaitExpression>{ type: 'AwaitExpression', argument };
                        break;
                    }
                    case 'new': {
                        const callee = parseExpression(18);
                        const argument: Expression[] = [];
                        if (peek()?.type === 'Punctuation' && peek()?.value === '(') {
                            eat();
                            while (cursor < length && peek()?.type !== 'Punctuation' && peek()?.value !== ')') {
                                argument.push(parseExpression(2));
                                if (peek() && peek()?.type === 'Punctuation' && peek()?.value === ',') {
                                    eat();
                                }
                            }
                            eat(); // 消费)
                        }
                        res = <NewExpression>{ type: 'NewExpression', callee, arguments: argument }
                        break;
                    }
                    default: {
                        res = <Identifier>{ type: 'Identifier', name: token.value };
                        break;
                    }
                }
                break;
            }
            case 'Number': {
                res = <Literal>{ type: 'Literal', value: token.value };
                break;
            }
            case 'String': {
                res = <Literal>{ type: 'Literal', value: token.value };
                break;
            }
            case 'Operator': {
                switch (token.value) {
                    case '!':
                    case '-':
                    case '+':
                    case '~': {
                        const operator = token.value;
                        const argument = parseExpression(15);
                        res = <UnaryExpression>{ type: 'UnaryExpression', operator, prefix: true, argument };
                        break;
                    }
                    case '++':
                    case '--': {
                        const operator = token.value;
                        const argument = parseExpression(15);
                        res = <UpdateExpression>{ type: 'UpdateExpression', operator, prefix: true, argument };
                        break;
                    }
                    default: {
                        throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
                    }
                }
                break;
            }
            case 'Punctuation': {
                switch (token.value) {
                    case '(': {
                        res = parseExpression();
                        eat(); // 消费)
                        break;
                    }
                    case '[': {
                        cursor--;
                        res = parseArrayExpression();
                        break;
                    }
                    case '{': {
                        cursor--;
                        res = parseObjectExpression();
                        break;
                    }
                    default: {
                        throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
                    }
                }
                break;
            }
            default: {
                throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
            }
        }

        return parseExpressionPrecedence(res, precedence);
    }

    function parseExpressionPrecedence(prev: Expression, precedence: number) {
        switch (peek()?.type) {
            case 'Identifier':
            case 'Keyword': {
                switch (peek()?.value) {
                    case 'in':
                    case 'instanceof': {
                        if (precedence >= 10) break;
                        const operator = eat()!.value;
                        const right = parseExpression(10);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                }
                break;
            }
            case 'Operator': {
                switch (peek()?.value) {
                    case '++':
                    case '--': {
                        if (precedence >= 16) break;
                        const operator = eat()!.value;
                        prev = <UpdateExpression>{ type: 'UpdateExpression', operator, prefix: false, argument: prev };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '==':
                    case '!=':
                    case '===':
                    case '!==': {
                        if (precedence >= 9) break;
                        const operator = eat()!.value;
                        const right = parseExpression(9);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '<':
                    case '<=':
                    case '>':
                    case '>=': {
                        if (precedence >= 10) break;
                        const operator = eat()!.value;
                        const right = parseExpression(10);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '<<':
                    case '>>':
                    case '>>>': {
                        if (precedence >= 11) break;
                        const operator = eat()!.value;
                        const right = parseExpression(11);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '+':
                    case '-': {
                        if (precedence >= 12) break;
                        const operator = eat()!.value;
                        const right = parseExpression(12);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '*':
                    case '/':
                    case '%': {
                        if (precedence >= 13) break;
                        const operator = eat()!.value;
                        const right = parseExpression(13);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '**': {
                        if (precedence >= 14) break;
                        const operator = eat()!.value;
                        const right = parseExpression(14);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '|': {
                        if (precedence >= 6) break;
                        const operator = eat()!.value;
                        const right = parseExpression(6);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '^': {
                        if (precedence >= 7) break;
                        const operator = eat()!.value;
                        const right = parseExpression(7);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '&': {
                        if (precedence >= 8) break;
                        const operator = eat()!.value;
                        const right = parseExpression(8);
                        prev = <BinaryExpression>{ type: 'BinaryExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '=':
                    case '+=':
                    case '-=':
                    case '*=':
                    case '/=':
                    case '%=':
                    case '<<=':
                    case '>>=':
                    case '>>>=':
                    case '|=':
                    case '^=':
                    case '&=': {
                        if (precedence > 2) break;
                        const operator = eat()!.value;
                        const right = parseExpression(2);
                        prev = <AssignmentExpression>{ type: 'AssignmentExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '&&': {
                        if (precedence >= 5) break;
                        const operator = eat()!.value;
                        const right = parseExpression(5);
                        prev = <LogicalExpression>{ type: 'LogicalExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '||':
                    case '??': {
                        if (precedence >= 4) break;
                        const operator = eat()!.value;
                        const right = parseExpression(4);
                        prev = <LogicalExpression>{ type: 'LogicalExpression', operator, left: prev, right };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '?': {
                        if (precedence > 3) break;
                        eat(); // 消费?
                        const consequent = parseExpression(3);
                        const o = eat();
                        if (!o) throw new Error('语法错误：三元运算符不完整');
                        if (o.type !== 'Operator' || o.value !== ':') throw new Error(`语法错误: 不支持的 token，值“${o.value}”，位置在：第${o.start.line}行，第${o.start.column}个字符，总第${o.start.index + 1}个字符`);
                        const alternate = parseExpression(3);
                        prev = <ConditionalExpression>{ type: 'ConditionalExpression', test: prev, alternate, consequent }
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                }
                break;
            }
            case 'Punctuation': {
                switch (peek()?.value) {
                    case '.': {
                        if (precedence > 18) break;
                        eat();
                        const property = parseExpression(18);
                        prev = <MemberExpression>{ type: 'MemberExpression', object: prev, property, computed: false };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '[': {
                        if (precedence >= 18) break;
                        eat();
                        const property = parseExpression(18);
                        prev = <MemberExpression>{ type: 'MemberExpression', object: prev, property, computed: true };
                        eat(); // 消费]
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case '(': {
                        if (precedence >= 18) break;
                        eat();
                        const argument: Expression[] = [];
                        while (cursor < length && (peek()?.type !== 'Punctuation' || peek()?.value !== ')')) {
                            argument.push(parseExpression(2));
                            if (peek() && peek()?.type === 'Punctuation' && peek()?.value === ',') {
                                eat();
                            }
                        }
                        eat(); // 消费 )
                        prev = <CallExpression>{ type: 'CallExpression', callee: prev, arguments: argument };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                    case ',': {
                        if (precedence >= 1) break;
                        eat(); //消费,
                        const next = parseExpression(1);
                        const expressions = prev.type === 'SequenceExpression' ? [...(<SequenceExpression>prev).expressions, next] : [prev, next];
                        prev = <SequenceExpression>{ type: 'SequenceExpression', expressions };
                        prev = parseExpressionPrecedence(prev, precedence);
                        break;
                    }
                }
                break;
            }
        }
        return prev
    }

    /** 解析数组字面量 */
    function parseArrayExpression(): ArrayExpression {
        eat(); // 消费 [
        const elements: (Expression | null)[] = [];
        while (cursor < length && (peek()?.type !== 'Punctuation' || peek()?.value !== ']')) {
            elements.push(parseExpression(2));
            if (peek() && peek()?.type === 'Punctuation' && peek()?.value === ',') {
                eat();
            }
        }
        eat(); // 消费 ]
        return { type: 'ArrayExpression', elements };
    }

    /** 解析对象字面量 */
    function parseObjectExpression(): ObjectExpression {
        eat(); // 消费 {
        const properties: Property[] = [];
        while (cursor < length && (peek()?.type !== 'Punctuation' || peek()?.value !== '}')) {
            properties.push(parseProperty());
            if (peek() && peek()?.type === 'Punctuation' && peek()?.value === ',') {
                eat();
            }
        }
        eat(); // 消费 }
        return { type: 'ObjectExpression', properties };
    }

    /** 解析对象属性 */
    function parseProperty(): Property {
        const token = eat();
        if (!token) throw new Error('语法错误：对象属性不完整');
        let key: Literal | Identifier;
        switch (token.type) {
            case 'Keyword':
            case 'Identifier': {
                switch (token.value.toLowerCase()) {
                    case 'true':
                    case 'false':
                    case 'null': {
                        key = <Literal>{ type: 'Literal', value: token.value };
                        break;
                    }
                    default: {
                        key = <Identifier>{ type: 'Identifier', name: token.value };
                        break;
                    }
                }
                break;
            }
            case 'String':
            case 'Number': {
                key = <Literal>{ type: 'Literal', value: token.value };
                break;
            }
            default: {
                throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
            }
        }
        let value: Expression = <Literal>{ type: 'Literal', value: null };
        if (peek()?.type === 'Operator' && peek()?.value === ':') {
            eat(); // 消费:
            value = parseExpression(2);
        }
        return { type: 'Property', key, value, kind: 'init' }
    }

    /** 返回语句 */
    function parseReturnStatement(): ReturnStatement {
        eat();
        let argument: Expression | null = null;
        try {
            // 尝试提取返回值
            argument = parseExpression();
        } catch {
            // 返回值并不是表达式，回退指针
            cursor--;
        }
        return { type: 'ReturnStatement', argument };
    }

    /** 标签语句 */
    function parseLabeledStatement() {
        const token = eat();
        if (!token) throw new Error('语法错误：语句意外结束');
        if (token.type !== 'Keyword' && token.type !== 'Identifier') throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
        const p = peek();
        if (p?.type === 'Operator' && p.value === ':') {
            // 是标签语句
            const label = <Identifier>{ type: 'Identifier', name: token.value };
            eat(); // 消费:
            const body = parseStatement()
            return <LabeledStatement>{ type: 'LabeledStatement', label, body };
        } else {
            // 尝试作为表达式解析
            cursor--;
            return parseExpressionStatement();
        }
    }

    /** 中断语句 */
    function parseBreakStatement(): BreakStatement {
        const [, token] = [eat(), peek()];
        let label: Identifier | null = null;
        if (token?.type === 'Keyword' || token?.type === 'Identifier') {
            label = { type: 'Identifier', name: eat()!.value }
        }
        return { type: 'BreakStatement', label };
    }

    /** 继续语句 */
    function parseContinueStatement(): ContinueStatement {
        const [, token] = [eat(), peek()];
        let label: Identifier | null = null;
        if (token?.type === 'Keyword' || token?.type === 'Identifier') {
            label = { type: 'Identifier', name: eat()!.value }
        }
        return { type: 'ContinueStatement', label };
    }

    /** 条件语句 */
    function parseIfStatement(): IfStatement {
        const [, token] = [eat(), eat()];
        if (!token) throw new Error('语法错误：条件语句意外结束');
        if (token.type !== 'Punctuation' || token.value !== '(') throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
        const [test, , consequent, e] = [parseExpression(), eat(), parseStatement(), peek()];
        let alternate: Statement | null = null;
        if ((e?.type === 'Keyword' || e?.type === 'Identifier') && e.value === 'else') {
            eat();
            alternate = parseStatement();
        }
        return { type: 'IfStatement', test, consequent, alternate };
    }

    /** 分支切换 */
    function parseSwitchStatement(): SwitchStatement {
        const [, token] = [eat(), eat()];
        if (!token) throw new Error('语法错误：分支切换意外结束');
        if (token.type !== 'Punctuation' || token.value !== '(') throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
        const [discriminant, , o] = [parseExpression(), eat(), eat()];
        if (!o) throw new Error('语法错误：分支切换意外结束');
        if (o.type !== 'Punctuation' || o.value !== '{') throw new Error(`语法错误: 不支持的 token，值“${o.value}”，位置在：第${o.start.line}行，第${o.start.column}个字符，总第${o.start.index + 1}个字符`);
        const cases: SwitchCase[] = [];
        while (cursor < length && peek()?.type !== 'Punctuation' && peek()?.value !== '}') {
            cases.push(parseSwitchCase());
        }
        eat(); // 消费}

        return { type: 'SwitchStatement', discriminant, cases };
    }

    /** case 语句 */
    function parseSwitchCase(): SwitchCase {
        const c = eat();
        if (!c) throw new Error('语法错误：分支切换意外结束');
        if (c.type !== 'Keyword' && c.type !== 'Identifier') throw new Error(`语法错误: 不支持的 token，值“${c.value}”，位置在：第${c.start.line}行，第${c.start.column}个字符，总第${c.start.index + 1}个字符`);
        let test: Expression | null = null;
        if (c.value === 'case') {
            test = parseExpression(2);
        } else if (c.value !== 'default') {
            throw new Error(`语法错误: 不支持的 token，值“${c.value}”，位置在：第${c.start.line}行，第${c.start.column}个字符，总第${c.start.index + 1}个字符`);
        }
        const o = eat();
        if (!o) throw new Error('语法错误：分支切换意外结束');
        if (o.type !== 'Operator' && o.value !== ':') throw new Error(`语法错误: 不支持的 token，值“${o.value}”，位置在：第${o.start.line}行，第${o.start.column}个字符，总第${o.start.index + 1}个字符`);
        const consequent: Statement[] = [];
        top:
        while (cursor < length) {
            const token = peek();
            switch (token?.type) {
                case 'Keyword':
                case 'Identifier': {
                    switch (token.value) {
                        case 'case':
                        case 'default': {
                            break top;
                        }
                        default: {
                            const next = parseStatement();
                            if (next.type === 'SequenceExpression') {
                                const prev = consequent.at(-1);
                                if (prev) {
                                    if (prev.type === 'SequenceExpression') {
                                        (<SequenceExpression>prev).expressions.push(next);
                                    } else {
                                        (<SequenceExpression>next).expressions.unshift(prev);
                                        consequent[consequent.length - 1] = next;
                                    }
                                }
                            } else {
                                consequent.push(next);
                            }
                        }
                    }
                    break;
                }
                case 'Punctuation': {
                    switch (token.value) {
                        case '}': {
                            break top;
                        }
                        default: {
                            const next = parseStatement();
                            if (next.type === 'SequenceExpression') {
                                const prev = consequent.at(-1);
                                if (prev) {
                                    if (prev.type === 'SequenceExpression') {
                                        (<SequenceExpression>prev).expressions.push(next);
                                    } else {
                                        (<SequenceExpression>next).expressions.unshift(prev);
                                        consequent[consequent.length - 1] = next;
                                    }
                                }
                            } else {
                                consequent.push(next);
                            }
                        }
                    }
                    break;
                }
                default: {
                    const next = parseStatement();
                    if (next.type === 'SequenceExpression') {
                        const prev = consequent.at(-1);
                        if (prev) {
                            if (prev.type === 'SequenceExpression') {
                                (<SequenceExpression>prev).expressions.push(next);
                            } else {
                                (<SequenceExpression>next).expressions.unshift(prev);
                                consequent[consequent.length - 1] = next;
                            }
                        }
                    } else {
                        consequent.push(next);
                    }
                }
            }
        }

        return { type: 'SwitchCase', test, consequent };
    }

    /** 抛出异常 */
    function parseThrowStatement(): ThrowStatement {
        const [, argument] = [eat(), parseExpression(19)];
        return { type: 'ThrowStatement', argument };
    }

    /** 捕获异常 */
    function parseTryStatement(): TryStatement {
        const [, block, handler, fl] = [eat(), parseBlockStatement(), parseCatchClause(), peek()];
        let finalizer: BlockStatement | null = null;
        if ((fl?.type === 'Keyword' || fl?.type === 'Identifier') && fl.value === 'finally') {
            eat();
            finalizer = parseBlockStatement();
        }

        return { type: 'TryStatement', block, handler, finalizer };
    }

    /** 异常处理 */
    function parseCatchClause(): CatchClause {
        const [token, p, pr] = [eat(), eat(), eat(), eat()];
        if (!token || !p || !pr) throw new Error('语法错误：语句意外结束');
        if (token.type !== 'Keyword' && token.type !== 'Identifier' && token.value !== 'catch') throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
        if (p.type !== 'Punctuation' || p.value !== '(') throw new Error(`语法错误: 不支持的 token，值“${token.value}”，位置在：第${token.start.line}行，第${token.start.column}个字符，总第${token.start.index + 1}个字符`);
        if (pr.type !== 'Keyword' && pr.type !== 'Identifier') throw new Error(`语法错误: 不支持的 token，值“${pr.value}”，位置在：第${pr.start.line}行，第${pr.start.column}个字符，总第${pr.start.index + 1}个字符`);
        const param: Identifier = { type: 'Identifier', name: pr.value };
        const body = parseBlockStatement();

        return { type: 'CatchClause', param, body }
    }

    /** While 循环 */
    function parseWhileStatement(): WhileStatement {
        const [, o] = [eat(), eat()];
        if (!o) throw new Error('语法错误：While 循环语句意外结束');
        if (o.type !== 'Punctuation' || o.value !== '(') throw new Error(`语法错误: 不支持的 token，值“${o.value}”，位置在：第${o.start.line}行，第${o.start.column}个字符，总第${o.start.index + 1}个字符`);
        const [test, e] = [parseExpression(), eat()];
        if (!e) throw new Error('语法错误：While 循环语句意外结束');
        if (e.type !== 'Punctuation' || e.value !== ')') throw new Error(`语法错误: 不支持的 token，值“${e.value}”，位置在：第${e.start.line}行，第${e.start.column}个字符，总第${e.start.index + 1}个字符`);
        const body = parseStatement();

        return { type: 'WhileStatement', test, body };
    }

    /** Do-While 循环 */
    function parseDoWhileStatement(): DoWhileStatement {
        const [, body, w, o] = [eat(), parseStatement(), eat(), eat()];
        if (!w || !o) throw new Error('语法错误：Do-While 循环语句意外结束');
        if (w.type !== 'Operator' && w.type !== 'Identifier' && w.value !== 'while') throw new Error(`语法错误: 不支持的 token，值“${w.value}”，位置在：第${w.start.line}行，第${w.start.column}个字符，总第${w.start.index + 1}个字符`);
        if (o.type !== 'Punctuation' || o.value !== '(') throw new Error(`语法错误: 不支持的 token，值“${o.value}”，位置在：第${o.start.line}行，第${o.start.column}个字符，总第${o.start.index + 1}个字符`);
        const [test, e] = [parseExpression(), eat()];
        if (!e) throw new Error('语法错误：While 循环语句意外结束');
        if (e.type !== 'Punctuation' || e.value !== ')') throw new Error(`语法错误: 不支持的 token，值“${e.value}”，位置在：第${e.start.line}行，第${e.start.column}个字符，总第${e.start.index + 1}个字符`);

        return { type: 'DoWhileStatement', body, test };
    }

    /** For 循环 */
    function parseForStatement(): ForStatement | ForInStatement {
        const [, s, v] = [eat(), eat(), peek()];
        if (!v || !s) throw new Error('语法错误：For 循环语句意外结束');
        if (s.type !== 'Punctuation' || s.value !== '(') throw new Error(`语法错误: 不支持的 token，值“${s.value}”，位置在：第${s.start.line}行，第${s.start.column}个字符，总第${s.start.index + 1}个字符`);
        let init: Expression | VariableDeclaration | null = null;
        if ((v.type === 'Keyword' || v.type === 'Identifier') && v.value === 'var') {
            init = parseVariableDeclaration();
        } else if (v.type !== 'Punctuation' && v.value !== ';') {
            init = parseExpression();
        }
        const [a, p] = [eat(), peek()];
        if (a?.type === 'Identifier' && a.value === 'in') {
            if (init?.type !== 'VariableDeclaration' && init?.type !== 'Identifier') throw new Error('语法错误：For-In 循环语句声明丢失');
            const [right, e] = [parseExpression(2), eat()];
            if (!e) throw new Error('语法错误：For-In 循环语句意外结束');
            if (e.type !== 'Punctuation' || e.value !== ')') throw new Error(`语法错误: 不支持的 token，值“${e.value}”，位置在：第${e.start.line}行，第${e.start.column}个字符，总第${e.start.index + 1}个字符`);
            const body = parseStatement();
            return { type: 'ForInStatement', left: <VariableDeclaration>init, right, body };
        }
        if (!p) throw new Error('语法错误：For 循环语句意外结束');
        let test: Expression | null = null;
        if (p.type !== 'Punctuation' && p.value !== ';') {
            test = parseExpression();
        }
        const [, o] = [eat(), peek()];
        if (!o) throw new Error('语法错误：For 循环语句意外结束');
        let update: Expression | null = null;
        if (o.type !== 'Punctuation' && o.value !== ')') {
            update = parseExpression();
        }
        const e = eat();
        if (!e) throw new Error('语法错误：For 循环语句意外结束');
        if (e.type !== 'Punctuation' || e.value !== ')') throw new Error(`语法错误: 不支持的 token，值“${e.value}”，位置在：第${e.start.line}行，第${e.start.column}个字符，总第${e.start.index + 1}个字符`);
        const body = parseStatement();

        return { type: 'ForStatement', init, test, update, body }
    }

    /** 变量声明 */
    function parseVariableDeclaration(): VariableDeclaration {
        eat();
        const declarations: VariableDeclarator[] = [parseVariableDeclarator()];
        while (cursor < length && peek()?.type === 'Punctuation' && peek()?.value === ',') {
            eat(); // 消费,
            declarations.push(parseVariableDeclarator());
        }

        return { type: 'VariableDeclaration', declarations, kind: 'var' };
    }

    /** 变量名 */
    function parseVariableDeclarator(): VariableDeclarator {
        const i = eat();
        if (!i) throw new Error('语法错误：变量声明语句意外结束');
        if (i.type !== 'Keyword' && i.type !== 'Identifier') throw new Error(`语法错误: 不支持的 token，值“${i.value}”，位置在：第${i.start.line}行，第${i.start.column}个字符，总第${i.start.index + 1}个字符`);
        const id: Identifier = { type: 'Identifier', name: i.value };
        const o = peek();
        let init: Expression | null = null
        if (o?.type === 'Operator' && o.value === '=') {
            eat();
            init = parseExpression(2);
        }

        return { type: 'VariableDeclarator', id, init }
    }

    /** 【扩展】协程语法，转换为 async 函数 */
    function parseCoroutineDeclaration(): FunctionDeclaration {
        eat(); // 消费 coroutine
        const [id, param] = [eat(), eat()];
        if (!id || !param) throw new Error('语法错误：函数声明不完整');
        if (id.type !== 'Identifier' && id.type !== 'Keyword') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
        }
        if (param.type !== 'Punctuation' && param.value !== '(') {
            throw new Error(`语法错误：预期之外的 token 类型，值“${param.value}”，位置在：第${param.start.line}行，第${param.start.column}个字符，总第${param.start.index + 1}个字符`);
        }
        const params: Identifier[] = [];
        while (peek() && (peek()?.type !== 'Punctuation' || peek()?.value !== ')')) {
            const id = eat()!;
            if (id.type !== 'Identifier' && id.type !== 'Keyword') {
                throw new Error(`语法错误：预期之外的 token 类型，值“${id.value}”，位置在：第${id.start.line}行，第${id.start.column}个字符，总第${id.start.index + 1}个字符`);
            }
            params.push({ type: 'Identifier', name: id.value });
            if (peek() && peek()?.type === 'Punctuation' && peek()?.value === ',') {
                eat();
            }
        }
        eat() // 消费 )
        const body = parseBlockStatement();

        return { type: 'FunctionDeclaration', id: { type: 'Identifier', name: id.value }, params, body, async: true };
    }

    /** 【扩展】loop循环，转转为 while(true) 循环 */
    function parseLoopStatement(): WhileStatement {
        eat();
        const test: Literal = { type: 'Literal', value: 'true' };
        const body = parseStatement();

        return { type: 'WhileStatement', test, body };
    }

    /** 解析任何语句 */
    function parseStatement(): Statement {
        const token = peek();
        if (!token) throw new Error('语法错误：语句意外结束');
        switch (token.type) {
            case 'Keyword':
            case 'Identifier': {
                switch (token.value.toLowerCase()) {
                    case 'function': {
                        return parseFunctionDeclaration();
                    }
                    case 'debugger': {
                        return parseDebuggerStatement();
                    }
                    case 'with': {
                        return parseWithStatement();
                    }
                    case 'return': {
                        return parseReturnStatement();
                    }
                    case 'break': {
                        return parseBreakStatement();
                    }
                    case 'continue': {
                        return parseContinueStatement();
                    }
                    case 'if': {
                        return parseIfStatement();
                    }
                    case 'switch': {
                        return parseSwitchStatement();
                    }
                    case 'throw': {
                        return parseThrowStatement();
                    }
                    case 'try': {
                        return parseTryStatement();
                    }
                    case 'while': {
                        return parseWhileStatement();
                    }
                    case 'do': {
                        return parseDoWhileStatement();
                    }
                    case 'for': {
                        return parseForStatement();
                    }
                    case 'var': {
                        return parseVariableDeclaration();
                    }
                    case 'coroutine': {
                        return parseCoroutineDeclaration();
                    }
                    case 'loop': {
                        return parseLoopStatement();
                    }
                    default: {
                        return parseLabeledStatement();
                    }
                }
            }
            case 'Punctuation': {
                switch (token.value) {
                    case '{': {
                        return parseBlockStatement();
                    }
                    case ';': {
                        return parseEmptyStatement();
                    }
                    default: {
                        return parseExpressionStatement();
                    }
                }
            }
            default: {
                return parseExpressionStatement();
            }
        }
    }

    const body: Statement[] = [];
    const { length } = tokens;
    while (cursor < length) {
        const next = parseStatement();
        if (next.type === 'SequenceExpression') {
            const prev = body.at(-1);
            if (prev) {
                if (prev.type === 'SequenceExpression') {
                    (<SequenceExpression>prev).expressions.push(next);
                } else {
                    (<SequenceExpression>next).expressions.unshift(prev);
                    body[body.length - 1] = next;
                }
            }
        } else {
            body.push(next);
        }
    }

    return <Program>{ type: 'Program', body };
}