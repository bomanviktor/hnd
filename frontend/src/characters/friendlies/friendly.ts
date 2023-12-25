import { Fighter, NonPlayable } from "../character"
import { Enemy } from "../enemies/enemy"
import { Stats } from "../stats"


export abstract class Friendly extends NonPlayable implements Fighter {
    stats: Stats
    blockAmount: number

    attack(target: Enemy, damage: damage) {
        target.receiveDamage(damage)
    }

    block(amount: number) {
        this.blockAmount = amount
    }
}