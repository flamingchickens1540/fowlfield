import {$Enums, Card, PrismaClient} from '@prisma/client'
import {createLogger} from '~/logger'

const logger = createLogger("db")
export const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query'
        },
        {
            emit: 'event',
            level: 'info'
        },
        {
            emit: 'event',
            level: 'warn'
        },
        {
            emit: 'event',
            level: 'error'
        }
    ]
})
export default prisma

if (process.env.NODE_ENV != 'prod') {
    prisma.$on('query', (e) => {
        logger.trace({name: 'prisma'}, e.query)
    })
}
prisma.$on('info', (e) => {
    logger.info({ name: 'prisma' }, e.message)
})
prisma.$on('warn', (e) => {
    logger.warn({ name: 'prisma' }, e.message)
})
prisma.$on('error', (e) => {
    logger.error({ name: 'prisma' }, e.message)
})

c