export enum NodeType {
    Program = 'Program',
    VariableStatement = 'VariableStatement',
    ExpressionStatement = 'ExpressionStatement',
    BinaryExpression = 'BinaryExpression',
    MemberExpression = 'MemberExpression',
    CallExpression = 'CallExpression',
    Identifier = 'Identifier',
    NumberLiteral = 'NumberLiteral',
}

export type Program = { type: NodeType.Program; body: Statement[] };

export type Statement =
    | VariableStatement
    | ExpressionStatement;

export type VariableStatement = {
    type: NodeType.VariableStatement;
    name: string;            // "a"
    initializer: Expression | null;  // 10, or null for `let x;`
};

export type ExpressionStatement = {
    type: NodeType.ExpressionStatement;
    expression: Expression;
};

export type Expression =
    | BinaryExpression
    | MemberExpression
    | CallExpression
    | Identifier
    | NumberLiteral;

export type BinaryExpression = {
    type: NodeType.BinaryExpression;
    operator: '+' | '-';   // '+' only for the slice
    left: Expression;
    right: Expression;
};

export type MemberExpression = {
    type: NodeType.MemberExpression;
    object: Expression;      // console
    property: string;        // log
};

export type CallExpression = {
    type: NodeType.CallExpression;
    callee: Expression;      // console.log
    args: Expression[];      // [a + b]
};

export type Identifier = {
    type: NodeType.Identifier;
    name: string;            // a, b, console, log
};

export type NumberLiteral = {
    type: NodeType.NumberLiteral;
    value: number;           // 10 (converted from text here, not in lexer)
};