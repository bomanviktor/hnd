export class Stats {
    maxHp: number
    currentHp: number
    dmg: number
    def: number
    int: number
    pers: number
    stealth: number
    dext: number

    constructor(hp: number, dmg: number, def: number, int: number, pers: number, stealth: number, dext: number) {
        this.maxHp = hp
        this.currentHp = hp
        this.dmg = dmg
        this.def = def
        this.int = int
        this.pers = pers
        this.stealth = stealth
        this.dext = dext
    }
}