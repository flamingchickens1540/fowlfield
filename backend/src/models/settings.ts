import * as db from "./db"

export interface Settings {
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

    static async getInstance() {
        if (DBSettings.instance == null) {DBSettings.instance = new DBSettings(await db.readSettings())}
        return DBSettings.instance
    }
}