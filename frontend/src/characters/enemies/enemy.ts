import {Stats} from "../stats.js"
import {Character, NonPlayable, Fighter} from "../character.js"

export abstract class Enemy extends NonPlayable implements Fighter {
    canAttack: boolean
    blockAmount: number
    stats: Stats

    attack(target: Character, damage: number) {
        target.receiveDamage(damage)
    }

    block(amount: number) {
        this.blockAmount = amount
    }
}