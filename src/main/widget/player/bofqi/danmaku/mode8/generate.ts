import type { ArrayExpression, AssignmentExpression, AwaitExpression, BinaryExpression, BlockStatement, BreakStatement, CallExpression, ConditionalExpression, ContinueStatement, DoWhileStatement, Expression, ExpressionStatement, ForStatement, FunctionDeclaration, FunctionExpression, Identifier, IfStatement, LabeledStatement, Literal, LogicalExpression, MemberExpression, NewExpression, ObjectExpression, Program, ReturnStatement, SequenceExpression, Statement, SwitchStatement, ThrowStatement, TryStatement, UnaryExpression, UpdateExpression, VariableDeclaration, WhileStatement, WithStatement } from "./ast";

export function generate({ body }: Program) {
    return statements(body);
}

function statements(body: Statement[]) {
    return body.reduce((s, d) => {
        s.push(statement(d));
        return s;
    }, <string[]>[]).join('');
}

function statement(d: Statement): string {
    switch (d.type) {
        case 'FunctionDeclaration': {
            const { id, params, body: { body }, async } = <FunctionDeclaration>d;
            return `${async ? 'async ' : ''}function ${id.name}(${params.map(({ name }) => name).join(',')}) {\n${statements(body)}}\n`;
        }
        case 'DebuggerStatement': {
            return 'debugger';
        }
        case 'WithStatement': {
            const { object, body } = <WithStatement>d;
            return `with (${expression(object)}) ${statement(body)}`;
        }
        case 'ReturnStatement': {
            const { argument } = <ReturnStatement>d;
            if (argument === null) {
                return 'return';
            } else {
                return `return ${expression(argument)}`;
            }
        }
        case 'BreakStatement': {
            const { label } = <BreakStatement>d;
            if (label === null) {
                return 'break';
            } else {
                return `break ${label.name}`;
            }
        }
        case 'ContinueStatement': {
            const { label } = <ContinueStatement>d;
            if (label === null) {
                return 'continue';
            } else {
                return `continue ${label.name}`;
            }
        }
        case 'IfStatement': {
            const { test, consequent, alternate } = <IfStatement>d;
            return `if (${expression(test)}) ${statement(consequent)}${alternate === null ? '' : ` ${statement(alternate)}`}`;
        }
        case 'SwitchStatement': {
            const { discriminant, cases } = <SwitchStatement>d;
            return `switch (${expression(discriminant)}) {\n${cases.map(({ test, consequent }) => {
                if (test === null) {
                    return `default: ${consequent.map(d => statement(d)).join('')}`;
                } else {
                    return `case ${expression(test)}: ${consequent.map(d => statement(d)).join('')}`;
                }
            }).join('')}}\n`
        }
        case 'ThrowStatement': {
            const { argument } = <ThrowStatement>d;
            return `throw ${expression(argument)}`;
        }
        case 'TryStatement': {
            const { block, handler, finalizer } = <TryStatement>d;
            return `try ${statement(block)} catch${handler?.param?.name ? `(${handler.param.name})` : ''} ${handler?.body ? `${statement(handler.body)}` : '{}'}${finalizer ? ` finally ${statement(finalizer)}` : ''}`;
        }
        case 'WhileStatement': {
            const { test, body } = <WhileStatement>d;
            return `while (${expression(test)}) ${statement(body)}`;
        }
        case 'DoWhileStatement': {
            const { body, test } = <DoWhileStatement>d;
            return `do ${statement(body)} while(${expression(test)})`;
        }
        case 'ForStatement': {
            const { init, test, update, body } = <ForStatement>d;
            return `for (${init === null ? '' : init.type === 'VariableDeclaration' ? statement(init) : expression(init)};${test === null ? '' : expression(test)};${update === null ? '' : expression(update)}) ${statement(body)}`;
        }
        case 'VariableDeclaration': {
            const { declarations, kind } = <VariableDeclaration>d;
            return `${kind} ${declarations.map(({ id, init }) => `${id.name}${init === null ? '' : `=${expression(init, 2)}`}`).join(', ')}`;
        }
        case 'LabeledStatement': {
            const { label, body } = <LabeledStatement>d;
            return `${label.name}: ${statement(body)}`;
        }
        case 'BlockStatement': {
            const { body } = <BlockStatement>d;
            return `{\n${body.map(d => statement(d)).join('')}}\n`;
        }
        case 'ExpressionStatement': {
            const { expression: body } = <ExpressionStatement>d;
            return (body.type === 'ObjectExpression' || body.type === 'FunctionExpression') ? `(${expression(body)})` : expression(body);
        }
        case 'EmptyStatement': {
            return ';\n';
        }
        default: {
            return ''
        }
    }
}

function expression(object: Expression, precedence = 0): string {
    switch (object.type) {
        case 'Identifier': {
            const { name } = <Identifier>object;
            return name;
        }
        case 'Literal': {
            const { value } = <Literal>object;
            return typeof value === 'string' ? `'${value.replaceAll("'", "\\'").replaceAll('\n', '\\n')}'` : <any>value;
        }
        case 'FunctionExpression': {
            const { params, body: { body }, async } = <FunctionExpression>object;
            return `${async ? 'async ' : ''}function (${params.map(({ name }) => name).join(',')}) {\n${statements(body)}}\n`;
        }
        case 'ThisExpression': {
            return 'this';
        }
        case 'ArrayExpression': {
            const { elements } = <ArrayExpression>object;
            return `[${elements.map(d => {
                if (d === null) {
                    return '';
                } else {
                    return expression(d);
                }
            }).join(', ')}]`;
        }
        case 'ObjectExpression': {
            const { properties } = <ObjectExpression>object;
            return `{${properties.map(({ key, value }) => {
                return `${key.type === 'Identifier' ? key.name : key.value}: ${expression(value)}`
            }).join(', ')}}`;
        }
        case 'UnaryExpression': {
            const { operator, prefix, argument } = <UnaryExpression>object;
            const children = expression(argument, 15);
            const res = prefix ? `${operator} ${children}` : `${children} ${operator}`;
            return precedence > 15 ? `(${res})` : res;
        }
        case 'UpdateExpression': {
            const { operator, argument, prefix } = <UpdateExpression>object;
            const children = expression(argument, prefix ? 15 : 16);
            const res = prefix ? `${operator} ${children}` : `${children} ${operator}`;
            return precedence > (prefix ? 15 : 16) ? `(${res})` : res;
        }
        case 'BinaryExpression': {
            const { operator, left, right } = <BinaryExpression>object;
            switch (operator) {
                case '|': {
                    const res = `${expression(left)} ${operator} ${expression(right, 6)}`;
                    return precedence > 16 ? `(${res})` : res;
                }
                case '^': {
                    const res = `${expression(left)} ${operator} ${expression(right, 7)}`;
                    return precedence > 7 ? `(${res})` : res;
                }
                case '&': {
                    const res = `${expression(left)} ${operator} ${expression(right, 8)}`;
                    return precedence > 8 ? `(${res})` : res;
                }
                case '==':
                case '!=':
                case '===':
                case '!==': {
                    const res = `${expression(left)} ${operator} ${expression(right, 9)}`;
                    return precedence > 9 ? `(${res})` : res;
                }
                case '<':
                case '<=':
                case '>':
                case '>=':
                case 'in':
                case 'instanceof': {
                    const res = `${expression(left)} ${operator} ${expression(right, 10)}`;
                    return precedence > 10 ? `(${res})` : res;
                }
                case '<<':
                case '>>':
                case '>>>': {
                    const res = `${expression(left)} ${operator} ${expression(right, 11)}`;
                    return precedence > 11 ? `(${res})` : res;
                }
                case '+':
                case '-': {
                    const res = `${expression(left)} ${operator} ${expression(right, 12)}`;
                    return precedence > 12 ? `(${res})` : res;
                }
                case '*':
                case '/':
                case '%': {
                    const res = `${expression(left)} ${operator} ${expression(right, 13)}`;
                    return precedence > 13 ? `(${res})` : res;
                }
                case '**': {
                    const res = `${expression(left)} ${operator} ${expression(right, 14)}`;
                    return precedence > 14 ? `(${res})` : res;
                }
                default: {
                    return `${expression(left)} ${operator} ${expression(right)}`;
                }
            }
        }
        case 'AssignmentExpression': {
            const { operator, left, right } = <AssignmentExpression>object;
            const res = `${left.type === 'Identifier' ? (<Identifier>left).name : expression(left)} ${operator} ${expression(right, 2)}`;
            return precedence > 2 ? `(${res})` : res;
        }
        case 'LogicalExpression': {
            const { operator, left, right } = <LogicalExpression>object;
            const res = `${expression(left)} ${operator} ${expression(right, operator === '&&' ? 5 : 4)}`;
            return precedence > (operator === '&&' ? 5 : 4) ? `(${res})` : res;
        }
        case 'MemberExpression': {
            const { object: obj, property, computed } = <MemberExpression>object;
            const parrent = expression(obj);
            const res = computed ? `${parrent}[${expression(property)}]` : `${parrent}.${expression(property, 18)}`;
            return precedence > 18 ? `(${res})` : res;
        }
        case 'ConditionalExpression': {
            const { test, consequent, alternate } = <ConditionalExpression>object;
            const res = `${expression(test)} ? ${expression(consequent, 3)} : ${expression(alternate, 3)}`;
            return precedence > 3 ? `(${res})` : res;
        }
        case 'CallExpression': {
            const { callee, arguments: args } = <CallExpression>object;
            const res = `${expression(callee)}(${args.map(d => expression(d)).join(', ')})`;
            return precedence > 18 ? `(${res})` : res;
        }
        case 'NewExpression': {
            const { callee, arguments: args } = <NewExpression>object;
            const res = `new ${expression(callee)}(${args.map(d => expression(d)).join(', ')})`;
            return precedence > 18 ? `(${res})` : res;
        }
        case 'SequenceExpression': {
            const { expressions } = <SequenceExpression>object;
            const res = expressions.map(d => expression(d, 1)).join(', ');
            return precedence > 1 ? `(${res})` : res;
        }
        case 'AwaitExpression': {
            const { argument } = <AwaitExpression>object;
            const res = `await ${expression(argument)}`;
            return precedence > 15 ? `(${res})` : res;
        }
        default: {
            return '';
        }
    }
}