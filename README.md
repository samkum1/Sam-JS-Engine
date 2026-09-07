# SamJS

A small JavaScript engine, built from scratch to understand how
JavaScript engines work internally.

## What is SamJS?

SamJS is an educational JavaScript interpreter. It lexes, parses,
and executes JavaScript itself — no `eval()`, no `Function()`,
no hidden parser/interpreter libraries.

## Why I built it

To deeply understand how JavaScript engines work under the hood,
stage by stage:

- A lexer turns source text into tokens
- A parser turns tokens into an abstract syntax tree (AST)
- An interpreter executes the AST
- A bytecode compiler and virtual machine form a second execution path
- Closures, `this`, prototypes, garbage collection — implemented by hand

## Current Status

- Phase 0 complete: project scaffolding + CLI that reads a file

## Requirements

- Node.js
- npm

## Setup

```powershell
npm install
Usage
npm run samjs examples/hello.js
For now the CLI reads the file and prints it. In later phases it
will tokenize, parse, and execute the code.
Scripts
Script	Action
npm run samjs <file>	Run the SamJS CLI on a file
npm run build	Compile TypeScript to dist/
npm test	Run tests once
npm run test:watch	Run tests in watch mode
Project Structure
src/
├── lexer/       Phase 1
├── ast/         Phase 2
├── parser/      Phase 3
├── interpreter/ Phase 4
├── runtime/     Phase 4
├── vm/          Phase 11
└── index.ts     CLI entry point
tests/       Vitest tests per phase
examples/    Example programs
benchmarks/  Benchmarks (Phase 14)
docs/        Architecture notes
Docs
- docs/architecture.md (docs/architecture.md)