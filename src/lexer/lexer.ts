import { Token, TokenType } from './token';

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