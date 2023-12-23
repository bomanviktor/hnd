import { Character, Fighter, Player } from "../character";
import { Enemy } from "../enemies/enemy";
import { Stats } from "../stats";

export abstract class Animal extends Character implements Fighter {
    actions: number
    blockAmount: number;
    constructor(name: string, level: number, stats: Stats, actions: number) {
        super(name, level, null, stats)
        this.actions = actions
    }

    attack(target: Character, damage: damage) {
        target.recieveDamage(damage)
    }
    block(amount: damage) {
        this.blockAmount = amount
    }
}

export class Pet extends Animal {
    owner: Character
    constructor(name: string, level: number, stats: Stats, actions: number, owner: Character) {
        super(name, level, stats, actions)
        this.owner = owner
    }
}

export class Undead extends Pet {
    used_ability: boolean
    terrorize(target: Enemy) {
        if (this.used_ability) {
            throw new Error(`${this.name} already used terrorize`)
        }
        target.stats.dmg -= this.level * 4
        this.used_ability = true
    }
}


export class Dog extends Pet implements Fighter {
    bark(target: Character) {
        target.stats.def--
        console.log(`${this.name} is barking at ${target.name}. It barely affects them.`)
    }
}

export class Wolf extends Dog {
    used_ability: boolean
    bite(target: Enemy) {
        if (this.used_ability) {
            throw new Error(`${this.name} already used bite`)
        }

        target.recieveDamage(10 + this.level * 5)
        this.used_ability = true
    }
}