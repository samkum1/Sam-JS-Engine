import * as fs from 'fs';
import * as path from 'path';
import { createLexer } from './lexer/lexer';
import { TokenType } from './lexer/token';
import { createParser } from './parser/parser';
import { createConsole } from './runtime/console';
import { interpret } from './interpreter/interpreter';

function main() {
    const args = process.argv.slice(2);

    const wantsTokens = args.includes('--tokens');
    const wantsAst = args.includes('--ast');
    const fileArg = args.find(a=> !a.startsWith('--'));


    if(!fileArg || args.length === 0){
        console.error('Usage: samjs <file.js>');
        process.exit(1);
    }

    const filePath = path.resolve(fileArg);


    if(!fs.existsSync(filePath)){
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const code = fs.readFileSync(filePath, 'utf-8');

    if(wantsTokens){
        const tokens = createLexer(code).tokenize();
        for (const t of tokens){
            const pos = `${t.line}:${t.column}`.padEnd(6);
            console.log(`${pos} ${TokenType[t.type].padEnd(12)} '${t.value}'`);
        }
    } else if (wantsAst){
        const program = createParser(createLexer(code).tokenize()).parseProgram()
        console.log(JSON.stringify(program, null, 2))
    }else{
        const env = new Map();
        env.set('console', createConsole());
        interpret(createParser(createLexer(code).tokenize()).parseProgram(), env);
    }
}

main();