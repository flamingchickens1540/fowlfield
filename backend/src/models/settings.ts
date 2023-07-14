import { EventInfo } from "@fowltypes";
import * as db from "./db"

export interface Settings extends EventInfo {
    loadedMatch:string,
    preloadedMatch:string,
}

export class DBSettings implements Settings {
    private static instance:DBSettings
    private constructor(private data:Settings){}

    get loadedMatch() {return this.data.loadedMatch}
    set loadedMatch(value) {this.data.loadedMatch = value; db.updateSetting("loadedMatch", value)}
    
    get preloadedMatch() {return this.data.preloadedMatch}
    set preloadedMatch(value) {this.data.preloadedMatch = value; db.updateSetting("preloadedMatch", value)}

    get atLunch() {return this.data.atLunch}
    set atLunch(value) {this.data.atLunch = value; db.updateSetting("atLunch", value)}

    get lunchReturnTime() {return this.data.lunchReturnTime}
    set lunchReturnTime(value) {this.data.lunchReturnTime = value; db.updateSetting("lunchReturnTime", value)}

    static async getInstance() {
        if (DBSettings.instance == null) {DBSettings.instance = new DBSettings(await db.readSettings())}
        return DBSettings.instance
    }
}