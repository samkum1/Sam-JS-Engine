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

    function parseExpression(): Expression {
        return parseAdditive();
    }

    function parseCallOrMember(base: Expression): Expression {
        let expr = base;

        while (true) {
            if (match(TokenType.DOT)) {
                const prop = consume();
                expr = { type: NodeType.MemberExpression, object: expr, property: prop.value };
            } else if (match(TokenType.LEFT_PAREN)) {
                const args: Expression[] = [];
                if (!match(TokenType.RIGHT_PAREN)) {
                    do {
                        args.push(parseExpression());
                    } while (match(TokenType.COMMA));
                    match(TokenType.RIGHT_PAREN);
                }
                expr = { type: NodeType.CallExpression, callee: expr, args };
            } else {
                break;
            }
        }

        return expr;
    }

    function parsePrimary(): Expression {
        const token = peek();

        if (token.type === TokenType.NUMBER) {
            consume();
            return { type: NodeType.NumberLiteral, value: Number(token.value) };
        }

        if (token.type === TokenType.IDENTIFIER) {
            consume();
            return parseCallOrMember({ type: NodeType.Identifier, name: token.value });
        }

        if (token.type === TokenType.LEFT_PAREN) {
            consume();
            const expr = parseExpression();
            consume();                       // RIGHT_PAREN
            return expr;
        }

        throw new Error(`Unexpected token ${token.type} at line ${token.line}, column ${token.column}`);
    }

    function parseAdditive(): Expression {
        let left = parsePrimary();

        while (peek().type === TokenType.PLUS) {
            consume();
            const right = parsePrimary();
            left = {
                type: NodeType.BinaryExpression,
                operator: '+',
                left,
                right,
            };
        }

        return left;
    }

    function parseVariableDeclaration(): Statement {

        const nameToken = consume();
        let initializer: Expression | null = null;


        if (match(TokenType.ASSIGN)) {
            initializer = parseExpression();
        }

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

        const expr = parseExpression();
        match(TokenType.SEMICOLON);
        return {
            type: NodeType.ExpressionStatement,
            expression: expr
        }
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