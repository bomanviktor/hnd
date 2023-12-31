import { Food } from "./items/food.ts"
import { Item } from "./items/item.ts"
import {Stats} from "./stats.ts"

export abstract class Character {
    readonly name: string
    position: Coordinates
    level: number
    stats: Stats
    gold: number
    inventory: Item[] | null
    constructor(name: string, level: number, inventory: any[] | null, stats: Stats) {
        this.name = name
        this.level = level
        this.inventory = inventory
        this.stats = stats
    }

    move(coordinates: Coordinates) {
        this.position = coordinates 
    }

    recieveDamage(amount: damage) {
        if (this.stats.currentHp - amount <= 0) {
            this.stats.currentHp = 0
            this.die()
        } else {
            this.stats.currentHp -= amount
        }
    }

    eat(food: Food) {
        if (this.stats.currentHp + food.hp > this.stats.maxHp) {
            this.stats.currentHp = this.stats.maxHp
        } else {
            this.stats.currentHp += food.hp
        }
    }

    inRange(position: Coordinates, range: number): boolean {
        return (Math.abs(this.position.x) - Math.abs(position.x) <= range) && 
        (Math.abs(this.position.y) - Math.abs(position.y) <= range)
    }

    // unimplemented. But character was KILL
    die() {
        console.log(`Character ${this.name} has died. RIP.`)
    }
}



export abstract class Player extends Character implements Fighter {
    actions: number
    remainingActions: number
    blockAmount: number
    abilityPoints: number
    abilities: Map<string, Ability>
    immuneTo: {
        arrows: boolean
        melee: boolean
        magic: boolean
    }

    constructor(name: string, inventory: any[], stats: Stats, actions: number) {
        const level = 1
        super(name, level, inventory, stats)
        this.actions = actions
        this.remainingActions = actions
        this.abilityPoints = 3
        this.abilities = new Map<string, Ability>
    }

    startTurn() {
        this.remainingActions = this.actions
        this.blockAmount = 0
    }

    sleep() {
        this.startTurn()
        this.abilities.forEach((ability) => {
            ability.used = false // Reset all abilities
        })
    }

    upgradeAbility(abilityName: string) {
        if (this.abilities.get(abilityName)!.level < 3) {
            this.abilities.get(abilityName)!.level++
        } else {
            throw new Error(`${abilityName} is already at max level.`)
        }
    }

    attack(target: Character, damage: damage) {
        target.recieveDamage(damage)
    }

    block(amount: damage) {
        this.blockAmount = amount
    }

    recieveDamage(amount: damage) {
        this.stats.currentHp -= amount
        if (this.stats.currentHp <= 0) {
            this.die()
        }
    }
}

export abstract class NonPlayable extends Character  {

}

export interface Trader {
    buy(player: Player, item: Item, gold: number)
    sell(player: Player, item: Item)
}

export interface Fighter {
    attack(target: Character, damage: damage)
    block(amount: damage)
    blockAmount: number
}

export interface Healer {
    heal(target: Character, amount: number)
}

export interface Ranger {
    attack() // No block for rangers
}

export interface Protector {
    protect(target: Character)
}
