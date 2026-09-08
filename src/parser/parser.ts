import { Expression, NodeType, Program, Statement } from "../ast/ast";
import { Token, TokenType } from "../lexer/token";


export function createParser(tokens: Token[]) {


    let position = 0;

    function peek(): Token {
        return tokens[position]
    }

    function consume(): Token {
        const tok = tokens[position];
        position++;
        return tok;
    }

    function match(type: TokenType) {
        if (peek().type === type) {
            position++;
            return true;
        }
        return false;
    }


    function parseVariableDeclaration(): Statement {
        const nameToken = consume();
        let initializer: Expression | null = null;


        match(TokenType.SEMICOLON);

        return {
            type: NodeType.VariableStatement,
            name: nameToken.value,
            initializer,
        };
    }


    function parseStatement(): Statement {
        if (match(TokenType.LET)) {
            return parseVariableDeclaration();
        }
        throw new Error(`Unexpected token at line ${peek().line}, column ${peek().column}`);
    }

    function parseProgram(): Program {
        const body: Statement[] = [];
        while (peek().type !== TokenType.EOF) {
            body.push(parseStatement());
        }
        return { type: NodeType.Program, body };
    }

    return { parseProgram }

}