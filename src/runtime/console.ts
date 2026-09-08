import { ConsoleObject } from "./environment";

export function createConsole(): ConsoleObject {
    return {
        kind: 'console',
        log: (...args) => console.log(...args),
    }
}