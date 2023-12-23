import {Stats} from "../stats.ts"
import {Character, NonPlayable, Fighter} from "../character.ts"

export abstract class Enemy extends NonPlayable implements Fighter {
    canAttack: boolean
    blockAmount: number
    stats: Stats

    attack(target: Character, damage: damage) {
        target.recieveDamage(damage)   
    }

    block(amount: damage) {
        this.blockAmount = amount
    }
}