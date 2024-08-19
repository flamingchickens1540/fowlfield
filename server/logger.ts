import pino, { ChildLoggerOptions, type Logger } from 'pino'

const transport = pino.transport({
    targets: [
        {
            level: 'debug',
            target: 'pino-pretty',
            options: {
                colorize: true,
                levelFirst: false,
                ignore: 'pid,hostname'
            }
        }
    ]
})

const rootLogger = pino({ level: 'trace' }, transport)
type MyLogger = {
    trace: Logger['trace']
    debug: Logger['debug']
    info: Logger['info']
    warn: Logger['warn']
    error: Logger['error']
    fatal: Logger['fatal']
}
export function createLogger(name: string, opts?: ChildLoggerOptions): Logger {
    const logger = rootLogger.child({ name, ...opts })
    return {
        ...logger,
        trace(arg0: unknown, ...args: unknown[]) {
            logger.trace(arg0, args.join(' '))
        },
        debug(arg0: unknown, ...args: unknown[]) {
            logger.debug(arg0, args.join(' '))
        },
        info(arg0: unknown, ...args: unknown[]) {
            logger.info(arg0, args.join(' '))
        },
        warn(arg0: unknown, ...args: unknown[]) {
            logger.warn(arg0, args.join(' '))
        },
        error(arg0: unknown, ...args: unknown[]) {
            logger.error(arg0, args.join(' '))
        },
        fatal(arg0: unknown, ...args: unknown[]) {
            logger.fatal(arg0, args.join(' '))
        }
    }
}
