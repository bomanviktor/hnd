import {Enemy} from "../enemies/enemy.ts"
import {Stats} from "../stats.ts"
import {Player, Healer, Character} from "../character.ts"
import {Friendly} from "../friendlies/friendly.ts"
import {Dog, Pet, Wolf} from "../animals/animal.ts"

class Human extends Player implements Healer {
    bonusDamage: number
    totalAttacks: number = 1
    pet: Pet | null = null

    startTurn() {
        this.remainingActions = this.actions
        this.bonusDamage = 0
        this.totalAttacks = 1
    }

    heal(target: Character, amount: number) {
        if (target.stats.currentHp + amount > target.stats.maxHp) {
            target.stats.currentHp = target.stats.maxHp
        } else {
            target.stats.currentHp += amount
        }
    }


    attack(target: Character) {
        if (!this.inRange(target.position, 1)) {
            throw new Error("Target is not in range.")
        }

        const total_dmg = this.stats.dmg + this.bonusDamage
        target.receiveDamage(total_dmg)
    }

    // Fighter:
    // Increase damage by (5, 10, 15) for one turn. Heal for same amount.
    fighter() {
        const ability = this.abilities.get("fighter")!

        if (ability.used) {
            throw new Error("Fighter has already been used.")
        }

        switch (ability.level) {
            // Fallthrough behaviour
            case 3:
                this.heal(this, 5)
                this.bonusDamage += 5
            case 2:
                this.heal(this, 5)
                this.bonusDamage += 5
            case 1:
                this.heal(this, 5)
                this.bonusDamage += 5
        }  

        ability.used = true
    }

    // Rage:
    // (1, 2, 3) enemies can't attack next turn
    rage(targets: Enemy[]) {
        const ability = this.abilities.get("rage")!

        if (ability.used) {
            throw new Error("Rage has already been used.")
        }

        switch (ability.level) {
            // Fallthrough behaviour
            case 3:
                targets[2].canAttack = false
            case 2:
                targets[1].canAttack = false
            case 1:
                targets[0].canAttack = false
                break;
            default:
                return
        }  

        ability.used = true
    }

    // Tactician:
    // Move (1, 2, 3) hero(es) anywhere
    tactician(targets: Map<Player | Friendly, Coordinates>) {
        const ability = this.abilities.get("tactician")!

        if (ability.used) {
            throw new Error("Tactician has already been used.")
        }

        let total_movements = ability.level;

        targets.forEach((coordinates, target) => {
            if (total_movements == 0) {
                return
            }
            target.position = coordinates
            total_movements--
        }) 

        ability.used = true

    }

    // Sprinter:
    // Gain (2, 3, 4) extra actions. Can be distributed.
    sprinter() {
        const ability = this.abilities.get("sprinter")!

        if (ability.used) {
            throw new Error("Sprinter has already been used.")
        }

        switch (ability.level) {
            case 3: this.actions++
            case 2: this.actions++
            case 1: this.actions += 2; break
            default: return
        }

        this.abilities.get("sprinter")!.used = true
    }

    // Counter:
    // 1. Melee damage from one enemy is reflected back for one turn.
    // 2. Also heal for half the amount.
    // 3. Also heal for full amount.
    counter(enemy: Enemy, amount: damage) {
        const ability = this.abilities.get("counter")!

        if (ability.used) {
            throw new Error("Counter has already been used.")
        }

        switch (ability.level) {
            case 3: this.heal(this, amount / 2)
            case 2: this.heal(this, amount / 2)
            case 1: enemy.receiveDamage(amount); break
            default: return                
        }        

        ability.used = true
    }

    // Healing Wounds:
    // Heal for (10, 20, 100%) HP
    healingWounds() {
        const ability = this.abilities.get("healingWounds")!

        if (ability.used) {
            throw new Error("Healing wounds has already been used.")
        }

        switch (ability.level) {
            case 3: this.heal(this, this.stats.maxHp); break
            case 2: this.heal(this, 10)
            case 1: this.heal(this, 10); break
            default: return                
        }        

        ability.used = true
    }

    // Spear Throw:
    // Throw a spear with (2, 3, 4) range, dealing (10, 15, 20) damage
    spearThrow(target: Enemy) {
        const ability = this.abilities.get("spearThrow")!

        if (ability.used) {
            throw new Error("Spear throw has already been used.")
        }

        const pos = target.position
        switch (ability.level) {
            case 3:
                if (this.inRange(pos, 4)) {
                    target.receiveDamage(5)
                } else {
                    return
                }
            case 2: 
                if (this.inRange(pos, 3)) {
                    target.receiveDamage(5)
                } else {
                    return
                }
            case 1: 
                if (this.inRange(pos, 2)) {
                    target.receiveDamage(10)
                    break
                } else {
                    return
                }
            default: return                
        }        

        ability.used = true
    }

    // Companion:
    // Summon a (Dog, Wolf, Wolf) with (20, 40, 60) HP, (5, 10, 15) damage
    // and 3 actions. The companion will follow you until death.
    companion(position: Coordinates) {
        const ability = this.abilities.get("companion")!

        if (ability.used) {
            throw new Error("Companion has already been used.")
        }

        const actions = 3

        switch (ability.level) {
            case 1:
                this.pet = new Dog("Dog", 1, new Stats(20, 5, 0, 0, 0, 0, 0), 3, this)
                this.pet.move(position) // Move the dog to position
                break
            case 2:
                this.pet = new Wolf("Wolf", 1, new Stats(40, 10, 0, 0, 0, 0, 0), 3, this)
                this.pet.move(position) // Move the dog to position
                break
            case 3:
                this.pet = new Wolf("Wolf", 2, new Stats(60, 15, 0, 0, 0, 0, 0), 3, this)
                this.pet.move(position) // Move the dog to position
                break
            default:
                return
        }

        ability.used = true
    }


    // Rolling Dice:
    // Reroll dice (1, 2, 3) time(s)
    rollingDice() {
        const ability = this.abilities.get("rollingDice")!

        if (ability.used) {
            throw new Error("Rolling dice has already been used.")
        }

        ability.used = true
    }

    // Attacker:
    // Can attack (2, 3, 4) times this turn.
    // Level 3 bonus: 1 extra action
    attacker() {
        const ability = this.abilities.get("attacker")!

        if (ability.used) {
            throw new Error("Attacker has already been used.")
        }

        switch (ability.level) {
            case 3: 
                this.totalAttacks++
                this.remainingActions++
            case 2:
                this.totalAttacks++
            case 1:
                this.totalAttacks++
                break
            default:
                return
            
        } 

        ability.used = true
    }
}

let stats = new Stats(10, 10, 10, 10, 10, 10, 10)

let test = new Human("hektor", [], stats, 3)