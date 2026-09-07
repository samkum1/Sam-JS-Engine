# SamJS Architecture

## Goal

SamJS is an educational JavaScript engine. It is built stage by
stage, favoring readable, understandable code over production
performance. The long-term goal is to compare our architecture and
performance against V8.

## High-level pipeline

```text
Source code (JavaScript)
     │
     ▼
Lexer  ──→  Tokens
     │
     ▼
Parser  ──→  Abstract Syntax Tree (AST)
     │
     ▼
Interpreter  ──→  Result
     │
     ▼
Bytecode Compiler  ──→  Bytecode  ──→  Virtual Machine  ──→  Result
Both execution models (AST interpreter and bytecode VM) will share
the same lexer and parser.
Modules
Module	Responsibility
src/lexer	Source text → tokens
src/ast	AST node definitions
src/parser	Tokens → AST
src/interpreter	Walks and executes the AST
src/runtime	Environment, values, objects
src/vm	Bytecode compiler + virtual machine
src/index.ts	CLI entry point
Data flow
npm run samjs file.js
     │
     ▼
CLI reads file → code string
     │
     ▼
code string → Lexer → tokens
     │
     ▼
tokens → Parser → AST
     │
     ▼
AST → Interpreter (or Bytecode VM) → result
Design principles
- No third-party parser/interpreter libraries. The engine is hand-written.
- Modular enough that the interpreter and VM are swappable behind the same front-end.
- Correctness and readability first; performance later.
- Every phase is verified with Vitest tests.
Phase roadmap
Phase	Deliverable
0	Project setup, CLI, docs
1	Lexer
2	AST definitions
3	Parser
4	Interpreter + runtime env
5	Control flow (if/while/for)
6	Functions, call stack
7	Scope & closures
8	Objects & arrays
9	this & prototypes
10	Error handling
11	Bytecode compiler + VM
12	Function calls inside the VM
13	Garbage collection
14	Benchmarks
15	V8 comparison
16	Polish, docs, examples

## Current status

- Phase 0 in progress: project scaffolding and CLI complete;
  README and this document in place.