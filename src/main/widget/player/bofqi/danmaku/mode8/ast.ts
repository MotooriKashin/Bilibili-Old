// 1. 基础结构(Base Structures)

/** 节点基类 */
export interface Node {
    type: string;
    loc?: SourceLocation | null;
}

/** 节点的源位置信息 */
export interface SourceLocation {
    source: string | null;
    start: Position;
    end: Position;
}

export interface Position {
    /** >= 1 */
    line: number;
    /** >= 0 */
    column: number;
}

/** 标识符：变量名、函数名或属性名。 */
export interface Identifier extends Expression {
    type: 'Identifier';
    name: string;
}

/** 字面量：基础数据类型字面量（数字、字符串、布尔值、null）。 */
export interface Literal extends Expression {
    type: 'Literal';
    value: string | boolean | null | number;
}

// 2. 程序与函数 (Programs & Functions)

/**
 * Program (程序根节点)  
 * 整段代码文件的根节点。
 */
export interface Program extends Node {
    type: 'Program';
    body: Statement[];
}

/** 函数声明 */
export interface FunctionDeclaration extends Declaration {
    type: 'FunctionDeclaration';
    id: Identifier;
    params: Identifier[];
    body: FunctionBody;
    async: boolean;
}

/** 函数表达式 */
export interface FunctionExpression extends Expression {
    type: 'FunctionExpression';
    id: null;
    params: Identifier[];
    body: FunctionBody;
    async: boolean;
}

// 3. 语句(Statements)

/** 任何声明。 */
export interface Statement extends Node { }

/** 表达式语句，即由单个表达式组成的语句。 */
export interface ExpressionStatement extends Statement {
    type: 'ExpressionStatement';
    expression: Expression;
}

/** 代码块语句，即用花括号括起来的一系列语句。 */
export interface BlockStatement extends Statement {
    type: 'BlockStatement';
    body: Statement[];
}

/** 函数体，即一个代码块语句，可以以指令开头。 */
export interface FunctionBody extends BlockStatement {
    body: Statement[];
}

/** 一个空语句，即一个单独的分号。 */
export interface EmptyStatement extends Statement {
    type: 'EmptyStatement';
}

/** 一份debugger声明。 */
export interface DebuggerStatement extends Statement {
    type: 'DebuggerStatement';
}

/** 一份with声明。 */
export interface WithStatement extends Statement {
    type: 'WithStatement';
    object: Expression;
    body: Statement;
}

// 4. 控制流语句 (Control Flow)

/** 一份return声明。 */
export interface ReturnStatement extends Statement {
    type: 'ReturnStatement';
    argument: Expression | null;
}

/** 标签语句 */
export interface LabeledStatement extends Statement {
    type: 'LabeledStatement';
    label: Identifier;
    body: Statement;
}

/** 中断语句 */
export interface BreakStatement extends Statement {
    type: 'BreakStatement';
    label: Identifier | null;
}

/** 继续语句 */
export interface ContinueStatement extends Statement {
    type: 'ContinueStatement';
    label: Identifier | null;
}

/** 条件语句 */
export interface IfStatement extends Statement {
    type: 'IfStatement';
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}

/** 分支切换:一份switch声明。 */
export interface SwitchStatement extends Statement {
    type: 'SwitchStatement';
    discriminant: Expression;
    cases: SwitchCase[];
}

/** 分支切换:一份switch声明。 */
export interface SwitchCase extends Node {
    type: 'SwitchCase';
    test: Expression | null;
    consequent: Statement[];
}

/** 抛出异常 */
export interface ThrowStatement extends Statement {
    type: 'ThrowStatement';
    argument: Expression;
}

/** 捕获异常 */
export interface TryStatement extends Statement {
    type: 'TryStatement';
    block: BlockStatement;
    handler: CatchClause | null;
    finalizer: BlockStatement | null;
}

/** 异常回退 */
export interface CatchClause extends Node {
    type: 'CatchClause';
    param: Identifier;
    body: BlockStatement;
}

// 5. 循环语句 (Loops)

/** While 循环 */
export interface WhileStatement extends Statement {
    type: 'WhileStatement';
    test: Expression;
    body: Statement;
}

/** Do-While 循环 */
export interface DoWhileStatement extends Statement {
    type: 'DoWhileStatement';
    body: Statement;
    test: Expression;
}

/** For 循环 */
export interface ForStatement extends Statement {
    type: 'ForStatement';
    init: VariableDeclaration | Expression | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}

/** For-In 循环 */
export interface ForInStatement extends Statement {
    type: 'ForInStatement';
    left: VariableDeclaration | Identifier;
    right: Expression;
    body: Statement;
}

// 6. 声明语句 (Declarations)

/** 任何声明节点。请注意，声明被视为语句；这是因为声明可以出现在任何语句上下文中。 */
export interface Declaration extends Statement { }

/** 变量声明 */
export interface VariableDeclaration extends Declaration {
    type: 'VariableDeclaration';
    declarations: VariableDeclarator[];
    kind: 'var';
}

export interface VariableDeclarator extends Node {
    type: 'VariableDeclarator';
    id: Identifier;
    init: Expression | null;
}

// 7. 表达式 (Expressions)

/** 任何表达式节点。由于赋值语句的左侧通常可以是任何表达式，因此表达式也可以是模式。 */
export interface Expression extends Node { }

/** this 关键字 */
export interface ThisExpression extends Expression {
    type: 'ThisExpression';
}

/**
 * 数组字面量  
 * 元素可能null表示稀疏数组中的一个空位。例如[1,,2]：
 */
export interface ArrayExpression extends Expression {
    type: 'ArrayExpression';
    elements: (Expression | null)[];
}

/** 对象字面量 */
export interface ObjectExpression extends Expression {
    type: 'ObjectExpression';
    properties: Property[];
}

/** 对象属性 */
export interface Property extends Node {
    type: 'Property';
    key: Literal | Identifier;
    value: Expression;
    kind: 'init' | 'get' | 'set';
}

/** 一元表达式 */
export interface UnaryExpression extends Expression {
    type: 'UnaryExpression';
    operator: string;
    prefix: boolean;
    argument: Expression;
}

/** 自增/自减表达式 */
export interface UpdateExpression extends Expression {
    type: 'UpdateExpression';
    operator: string;
    argument: Expression;
    prefix: boolean;
}

/** 二元表达式 */
export interface BinaryExpression extends Expression {
    type: 'BinaryExpression';
    operator: string;
    left: Expression;
    right: Expression;
}

/** 赋值表达式 */
export interface AssignmentExpression extends Expression {
    type: 'AssignmentExpression';
    operator: string;
    left: Identifier | Expression;
    right: Expression;
}

/** 逻辑表达式 */
export interface LogicalExpression extends Expression {
    type: 'LogicalExpression';
    operator: string;
    left: Expression;
    right: Expression;
}

/** 成员访问 */
export interface MemberExpression extends Expression {
    type: 'MemberExpression';
    object: Expression;
    property: Expression;
    /**
     * | true | false |
     * | - | - |
     * | a[b] | a.b |
     */
    computed: boolean;
}

/** 三元运算符 */
export interface ConditionalExpression extends Expression {
    type: 'ConditionalExpression';
    test: Expression;
    /** 真 */
    consequent: Expression;
    /** 假 */
    alternate: Expression;
}

/** 函数调用 */
export interface CallExpression extends Expression {
    type: 'CallExpression';
    callee: Expression;
    arguments: Expression[];
}

/** 实例化对象 */
export interface NewExpression extends Expression {
    type: 'NewExpression';
    callee: Expression;
    arguments: Expression[];
}

/** 逗号运算符 */
export interface SequenceExpression extends Expression {
    type: 'SequenceExpression';
    expressions: Expression[];
}

/** await 表达式 */
export interface AwaitExpression extends Expression {
    type: "AwaitExpression";
    argument: Expression;
}