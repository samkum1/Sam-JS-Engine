import * as fs from 'fs';
import * as path from 'path';

function main() {
    const args = process.argv.slice(2);


    if(args.length === 0){
        console.error('Usage: samjs <file.js>');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);


    if(!fs.existsSync(filePath)){
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    console.log(code);
}

main();