declare const logLevels: {
    silent: number;
    error: number;
    minimal: number;
    warn: number;
    info: number;
    verbose: number;
    silly: number;
};
declare const defaults: (initialObj: any, ...potentialFillers: any[]) => any;
declare const print: (options: {} | undefined, message: any, loglevel: any, method?: string) => void;
declare const programError: (options: any, message: any) => void;
declare const printJson: (options: any, object: any) => void;
