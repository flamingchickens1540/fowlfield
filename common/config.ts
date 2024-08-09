import type config_type from '../config/example.json'
import { readFileSync } from 'node:fs'

const CONFIG_NAME = process.env['NODE_CONFIG'] || 'default'
const data = readFileSync(`./config/${CONFIG_NAME}.json`)
export const config: typeof config_type = JSON.parse(data.toString())
export default config
