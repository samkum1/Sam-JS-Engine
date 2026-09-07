export enum TokenType {
    // identifies --- 
    NUMBER,
    STRING,
    IDENTIFIER,

    // --- keywords --- 
    LET,
    CONST,
    VAR,
    FUNCTION,
    RETURN,
    IF,
    ELSE,
    TRUE,
    FALSE,
    NULL,

    // --- operators ----
    PLUS,
    MINUS,
    STAR,
    SLASH,
    PERCENT,
    ASSIGN,
    LESS_THAN,
    GREATER_THAN,
    NOT,

    // --- operators multi char

    EQUAL,
    STRICT_EQUAL,      // ===
    NOT_EQUAL,         // !=
    STRICT_NOT_EQUAL,  // !==
    LESS_THAN_OR_EQUAL,    // <=
    GREATER_THAN_OR_EQUAL, // >=
    AND,               // &&
    OR,                // ||

    // --- Punctuation ---
    LEFT_PAREN,    // (
    RIGHT_PAREN,   // )
    LEFT_BRACE,    // {
    RIGHT_BRACE,   // }
    LEFT_BRACKET,  // [
    RIGHT_BRACKET, // ]
    SEMICOLON,     // ;
    COMMA,         // ,
    DOT,           // .

    // --- Sentinel ---
    EOF
}

export type Token = {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}