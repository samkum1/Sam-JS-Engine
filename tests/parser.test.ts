import { describe, it } from "vitest";
import { createLexer } from "../src/lexer/lexer";
import { createParser } from "../src/parser/parser";
import { expect } from "vitest";
import { NodeType } from "../src/ast/ast";

describe('Parser', () => {
    it('parses a let declaration without initializer', () => {
        const program = createParser(createLexer('let a;').tokenize()).parseProgram();
        expect(program).toEqual({
            type: NodeType.Program,
            body: [
                { type: NodeType.VariableStatement, name: 'a', initializer: null },
            ],
        });
    });

    it('parses a let declaration with a number initializer', () => {
        const program = createParser(createLexer('let a = 10;').tokenize()).parseProgram();
        expect(program).toEqual({
            type: NodeType.Program,
            body: [
                {
                    type: NodeType.VariableStatement,
                    name: 'a',
                    initializer: { type: NodeType.NumberLiteral, value: 10 },
                },
            ],
        });
    });

    it('parses an additive expression', () => {
        const program = createParser(createLexer('a + b;').tokenize()).parseProgram();
        expect(program).toEqual({
            type: NodeType.Program,
            body: [
                {
                    type: NodeType.ExpressionStatement,
                    expression: {
                        type: NodeType.BinaryExpression,
                        operator: '+',
                        left: { type: NodeType.Identifier, name: 'a' },
                        right: { type: NodeType.Identifier, name: 'b' },
                    },
                },
            ],
        });
    });

    it('parses console.log(a + b)', () => {
        const program = createParser(createLexer('console.log(a+b);').tokenize()).parseProgram();
        expect(program).toEqual({
            type: NodeType.Program,
            body: [
                {
                    type: NodeType.ExpressionStatement,
                    expression: {
                        type: NodeType.CallExpression,
                        callee: {
                            type: NodeType.MemberExpression,
                            object: { type: NodeType.Identifier, name: 'console' },
                            property: 'log',
                        },
                        args: [
                            {
                                type: NodeType.BinaryExpression,
                                operator: '+',
                                left: { type: NodeType.Identifier, name: 'a' },
                                right: { type: NodeType.Identifier, name: 'b' },
                            },
                        ],
                    },
                },
            ],
        });
    });

    it('parses multiple statements', () => {
        const program = createParser(createLexer('let a = 10; let b = 20;').tokenize()).parseProgram();
        expect(program.body).toHaveLength(2);
        expect(program.body[0]).toEqual(
            expect.objectContaining({ name: 'a' })
        );
        expect(program.body[1]).toEqual(
            expect.objectContaining({ name: 'b' })
        );
    });
})