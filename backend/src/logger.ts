const levels = {
    never:{value:-1, func:() => {}},
    error:{value:0, func:console.error},
    warning:{value:1, func:console.warn},
    normal:{value:2, func:console.log},
    debug:{value:3, func:console.debug}
}
type Level = keyof typeof levels;




class Logger {
    private name:string;
    private level:Level;

    constructor(name:string, level:Level) {
        this.name = name
        this.level = level
    }

    getLogger(name:string) {
        return this.getLoggerWithLevel(name, "normal")
    }

    getLoggerWithLevel(name:string, level:Level) {
        if (this.name != null) {
            return new Logger(this.name+":"+name, level)
        } else {
            return new Logger(name, level)
        }
    }

    setName(name:string) {
        this.name = name;
    }

    setLevel(level:Level) {
        this.level = level;
    }



    error(...data:any[]) {
        this.logAtLevel("error", data)
    }

    warn(...data:any[]) {
        this.logAtLevel("warning", data)
    }
    
    log(...data:any[]) {
        this.logAtLevel("normal", data)
    }

    debug(...data:any[]) {
        this.logAtLevel("debug", data)
    }

    private logAtLevel(level: keyof typeof levels, data:any[]) {
        if (levels[this.level].value >= levels[level].value) {
            levels[level].func(`[${(this.name ?? "root").toUpperCase()}]`,...data)
        }
    }
}

const rootLogger = new Logger(null, "normal")

export default rootLogger