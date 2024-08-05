import { Settings } from '~/models/settings'
import prisma from '~/models/db'

export async function readSettings() {
    const result: Settings = {
        loadedMatch: "",
        preloadedMatch: "",
        atLunch: false,
        lunchReturnTime: 0
    }
    for await (const setting of await prisma.setting.findMany({})) {
        result[setting.key] = setting.value
    }
    return result
}


export const settings = await readSettings()