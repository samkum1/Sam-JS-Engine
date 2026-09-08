export type JSValue = number | boolean | null | string | ConsoleObject;

export type ConsoleObject = {
    kind: 'console';
    log: (...args: JSValue[]) => void;
}

export type Environment = Map<string, JSValue>;

