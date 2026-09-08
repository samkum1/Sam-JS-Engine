import {
    BinaryExpression, CallExpression, Expression, Identifier,
    MemberExpression, NumberLiteral, Program, Statement,
} from '../ast/ast';
import { JSValue } from '../runtime/environment';

export function interpret(program: Program, env: Map<string, JSValue>): void {
    for (const stmt of program.body) {
        executeStatement(stmt, env);
    }
}

function executeStatement(stmt: Statement, env: Map<string, JSValue>): void {
    switch (stmt.type) {
        case 'VariableStatement': {
            const value = stmt.initializer ? evaluate(stmt.initializer, env) : null;
            env.set(stmt.name, value);
            break;
        }
        case 'ExpressionStatement':
            evaluate(stmt.expression, env);
            break;
    }
}

function evaluate(expr: Expression, env: Map<string, JSValue>): JSValue {
    switch (expr.type) {
        case 'NumberLiteral':
            return (expr as NumberLiteral).value;

        case 'Identifier':
            return env.get((expr as Identifier).name)!;

        case 'BinaryExpression': {
            const bin = expr as BinaryExpression;
            const left = evaluate(bin.left, env);
            const right = evaluate(bin.right, env);
            if (bin.operator === '+') {
                return (left as number) + (right as number);
            }
            throw new Error(`Unknown operator ${bin.operator}`);
        }

        case 'MemberExpression': {
            const member = expr as MemberExpression;
            const object = evaluate(member.object, env) as any;
            return object[member.property];
        }

        case 'CallExpression': {
            const call = expr as CallExpression;
            const callee = evaluate(call.callee, env) as any;
            const args = call.args.map((a) => evaluate(a, env));
            return callee(...args);
        }

        default:
            throw new Error(`Cannot evaluate node ${(expr as any).type}`);
    }
}