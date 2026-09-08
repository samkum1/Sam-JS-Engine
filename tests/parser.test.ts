import { describe, it } from "vitest";
import { createLexer } from "../src/lexer/lexer";
import { createParser } from "../src/parser/parser";
import { expect } from "vitest";
import { NodeType } from "../src/ast/ast";

describe('Parser', () => {
    it('parses a let declaration without initializer', () => {
        const tokens = createLexer('let a;').tokenize();
        const program = createParser(tokens).parseProgram();
        expect(program).toEqual({
            type: NodeType.Program,
            body: [
                { type: NodeType.VariableStatement, name: 'a', initializer: null },
            ],
        });
    })
})