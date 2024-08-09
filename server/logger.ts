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

export function createLogger(name: string, opts?: ChildLoggerOptions): Logger {
    return rootLogger.child({ name, ...opts })
}
