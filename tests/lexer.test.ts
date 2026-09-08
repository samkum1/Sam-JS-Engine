import { describe, expect, it } from 'vitest';
import { createLexer } from '../src/lexer/lexer';
import { TokenType } from '../src/lexer/token';

describe('Lexer skeleton', () => {
  it('returns a single EOF token for empty input', () => {
    const tokens = createLexer('').tokenize();
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toEqual({ type: TokenType.EOF, value: '', line: 1, column: 1 });
  });

  it('skips whitespace and returns only EOF', () => {
    const tokens = createLexer('  \t\n  ').tokenize();
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toEqual({ type: TokenType.EOF, value: '', line: 2, column: 3 });
  });

  it('throws on unexpected characters', () => {
    expect(() => createLexer('@').tokenize()).toThrowError(
      "Unexpected character '@' at line 1, column 1"
    );
  });
});


describe('Numbers', () => {
  it('tokenizes a single integer', () => {
    const tokens = createLexer('42').tokenize();
    expect(tokens).toHaveLength(2);
    expect(tokens[0]).toEqual({ type: TokenType.NUMBER, value: '42', line: 1, column: 1 });
    expect(tokens[1].type).toBe(TokenType.EOF);
  });

  it('tokenizes multiple digits correctly', () => {
    const tokens = createLexer('12345').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.NUMBER, value: '12345', line: 1, column: 1 });
  });

  it('tokenizes a decimal number', () => {
    const tokens = createLexer('20.5').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.NUMBER, value: '20.5', line: 1, column: 1 });
  });

  it('guards the dot: keeps number and dot separate', () => {
    // readNumber stops before '.'; the '.' is now its own DOT token
    const tokens = createLexer('20.').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.NUMBER, value: '20', line: 1, column: 1 });
    expect(tokens[1]).toEqual({ type: TokenType.DOT, value: '.', line: 1, column: 3 });
    expect(tokens[2].type).toBe(TokenType.EOF);
  });

  it('tracks column correctly across tokens', () => {
    const tokens = createLexer('  7 8').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.NUMBER, value: '7', line: 1, column: 3 });
    expect(tokens[1]).toEqual({ type: TokenType.NUMBER, value: '8', line: 1, column: 5 });
  });

  it('tracks line/column across a newline', () => {
    const tokens = createLexer('1\n23').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.NUMBER, value: '1', line: 1, column: 1 });
    expect(tokens[1]).toEqual({ type: TokenType.NUMBER, value: '23', line: 2, column: 1 });
  });
});

describe('Identifiers & keywords', () => {
  it('tokenizes a keyword token', () => {
    const tokens = createLexer('let').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.LET, value: 'let', line: 1, column: 1 });
  });

  it('tokenizes an identifier', () => {
    const tokens = createLexer('a').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.IDENTIFIER, value: 'a', line: 1, column: 1 });
  });

  it('a keyword inside a longer word is NOT a keyword', () => {
    // 'letx' reads fully before keyword lookup -> IDENTIFIER, not LET + IDENTIFIER(x)
    const tokens = createLexer('letx').tokenize();
    expect(tokens).toHaveLength(2);
    expect(tokens[0]).toEqual({ type: TokenType.IDENTIFIER, value: 'letx', line: 1, column: 1 });
    expect(tokens[1].type).toBe(TokenType.EOF);
  });

  it('identifiers can contain digits after the first char', () => {
    const tokens = createLexer('foo1').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.IDENTIFIER, value: 'foo1', line: 1, column: 1 });
  });

  it('underscore is a valid identifier start', () => {
    const tokens = createLexer('_tmp').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.IDENTIFIER, value: '_tmp', line: 1, column: 1 });
  });


});


describe('Operators & punctuation', () => {
  it('tokenizes basic operators and punctuation', () => {
    const tokens = createLexer('= + ; . ( )').tokenize();
    expect(tokens.map(t => t.type)).toEqual([
      TokenType.ASSIGN, TokenType.PLUS, TokenType.SEMICOLON,
      TokenType.DOT, TokenType.LEFT_PAREN, TokenType.RIGHT_PAREN, TokenType.EOF,
    ]);
  });

  it('tokenizes console.log with dot and parens', () => {
    const tokens = createLexer('console.log').tokenize();
    expect(tokens[0]).toEqual({ type: TokenType.IDENTIFIER, value: 'console', line: 1, column: 1 });
    expect(tokens[1]).toEqual({ type: TokenType.DOT, value: '.', line: 1, column: 8 });
    expect(tokens[2]).toEqual({ type: TokenType.IDENTIFIER, value: 'log', line: 1, column: 9 });
  });
});