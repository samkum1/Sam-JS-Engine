import { Token, TokenType } from './token';



const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.LET,
    const: TokenType.CONST,
    var: TokenType.VAR,
    function: TokenType.FUNCTION,
    return: TokenType.RETURN,
    if: TokenType.IF,
    else: TokenType.ELSE,
    true: TokenType.TRUE,
    false: TokenType.FALSE,
    null: TokenType.NULL,
}


export function createLexer(source: string) {
    let position = 0;
    let line = 1;
    let column = 1;

    function currentChar(): string | null {
        if (position >= source.length) return null;
        return source[position];
    }

    function peekChar(): string | null {
        if (position + 1 >= source.length) return null;
        return source[position + 1];
    }

    function advance(): string | null {
        const c = currentChar();
        if (c === null) return null;
        position++;
        if (c === '\n') {
            line++;
            column = 1;
        } else {
            column++
        }
        return c;
    }

    function createToken(type: TokenType, value: string, l: number, col: number) {
        return {
            type,
            value,
            line: l,
            column: col
        }
    }

    function isWhitespace(c: string): boolean {
        return c === " " || c === '\t' || c === "\n" || c === "\r";
    }

    function isDigit(c: string | null): boolean {
        return c !== null && c >= '0' && c <= '9';
    }

    function isAlpha(c: string | null): boolean {
        return c !== null && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_');
    }

    function isAlphaNumeric(c: string | null): boolean {
        return isAlpha(c) || isDigit(c);
    }

    function readNumber(): Token {
        const startLine = line;
        const startColumn = column;
        let value = '';

        while(isDigit(currentChar())){
            value += advance();
        }

        if(currentChar() === '.' && isDigit(peekChar())){
            value += advance();
            while(isDigit(currentChar())){
                value += advance();
            }
        }

        return createToken(
            TokenType.NUMBER,
            value,
            startLine,
            startColumn
        )

    }

    function readIdentifier(): Token {
        const startLine = line;
        const startColumn = column;
        let value = '';

        while (isAlphaNumeric(currentChar())){
            value += advance();
        }

        const type = KEYWORDS[value] ?? TokenType.IDENTIFIER;
        return createToken(
            type,
            value,
            startLine,
            startColumn
        )
    }

    function skipWhitespace(): void {
        while (currentChar() !== null && isWhitespace(currentChar()!)) {
            advance();
        }
    }

    function tokenize(): Token[] {
        const tokens: Token[] = [];

        while (true) {
            skipWhitespace();

            const startLine = line;
            const startColumn = column;
            const c = currentChar();

            if(isDigit(c)){
                tokens.push(readNumber());
                continue;
            }

            if(isAlpha(c)){
                tokens.push(readIdentifier());
                continue;
            }

            if (c === null) {
                tokens.push(createToken(TokenType.EOF, '', startLine, startColumn));
                break;
            }

            throw new Error(`Unexpected character '${c}' at line ${startLine}, column ${startColumn}`);
        }

        return tokens;
    }

    return { tokenize };


}