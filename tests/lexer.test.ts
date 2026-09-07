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