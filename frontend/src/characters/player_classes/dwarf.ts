import { Character, Healer, Player, Trader } from "../character";
import { Enemy } from "../enemies/enemy";
import { Item } from "../items/item";

class Dwarf extends Player implements Healer {
    boostedWeaponLevel: number
    bonusDamage: number
    damageMultiplier: number

    startTurn() {
        this.immuneTo = {
            arrows: false,
            melee: false,
            magic: false
        }
        this.remainingActions = this.actions
        this.boostedWeaponLevel = 0
        this.bonusDamage = 0
        this.damageMultiplier = 1
    }

    heal(target: Character, amount: number) {
        target.stats.currentHp += amount

        if (target.stats.currentHp > target.stats.maxHp) {
            target.stats.currentHp = target.stats.maxHp
        }
    }

    // Greed:
    // Get one item for (half price, free, one of each)
    // Only available once per city.
    greed(target: Trader, itemOne: Item, itemTwo: Item | null) {
        const ability = this.abilities.get("greed")!

        if (ability.used) {
            return
        }

        switch (ability.level) {
            case 1:
                this.inventory!.push(target.buy(this, itemOne, itemOne.value / 2))
                break
            case 2:
                this.inventory!.push(target.buy(this, itemOne, 0))
                break
            case 3:
                this.inventory!.push(target.buy(this, itemOne, 0))
                this.inventory!.push(target.buy(this, itemTwo!, itemTwo!.value / 2))
                break
            default:
                return
        }        

        ability.used = true
    }

    // Shield Wall:
    // Take no damage from (arrows, +melee, +magic) next turn.
    shieldWall() {
        const ability = this.abilities.get("shieldWall")!

        if (ability.used) {
            return
        }

        switch (ability.level) {
            case 3: this.immuneTo.magic = true 
            case 2: this.immuneTo.melee = true
            case 1: this.immuneTo.arrows = true; break
            default: return
        }

        ability.used = true
    }

    // Gunner:
    // Deal (10, 15, 20) damage with (2, 3, 4) range
    gunner(target: Enemy) {
        const ability = this.abilities.get("gunner")!

        if (ability.used) {
            return
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

    // Miner:
    // Gain (30, 60, 90) gold for a new cave you enter
    miner() {
        const ability = this.abilities.get("miner")!

        if (ability.used) {
            throw new Error("Miner was already used.")
        }

        switch (ability.level) {
            case 3: this.gold += 30
            case 2: this.gold += 30
            case 1: this.gold += 30; break
            default: return
        }

        ability.used = true
    }

    // Blacksmith:
    // For the rest of this turn, increase the level of your weapon by (1, 2, 3) levels.
    blacksmith() {
        const ability = this.abilities.get("blacksmith")!

        if (ability.used) {
            throw new Error("Blacksmith was already used.")
        }

        switch (ability.level) {
            case 3: this.boostedWeaponLevel++
            case 2: this.boostedWeaponLevel++
            case 1: this.boostedWeaponLevel++; break
            default: return
        }

        ability.used = true
    }

    // Hammer:
    // Increase damage by (5, 10, 15) for one turn. Heal for same amount.
    hammer() {
        const ability = this.abilities.get("hammer")!

        if (ability.used) {
            return
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

    // Gambler:
    // Reroll dice (1, 2, 3) time(s)
    gambler() {
        const ability = this.abilities.get("gambler")!

        if (ability.used) {
            return
        }

        ability.used = true
    }

    // Healing Wounds:
    // Heal for (10, 20, 100%) HP
    healingWounds() {
        const ability = this.abilities.get("healingWounds")!

        if (ability.used) {
            return
        }

        switch (ability.level) {
            case 3: this.heal(this, this.stats.maxHp); break
            case 2: this.heal(this, 10)
            case 1: this.heal(this, 10); break
            default: return                
        }        

        ability.used = true
    }

    // Runestone:
    // Move (1, 2, 3) foe(s) anywhere
    runestone(targets: Map<Enemy, Coordinates>) {
        const ability = this.abilities.get("runestone")!

        if (ability.used) {
            throw new Error("Runestone has already been used")
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

    // Berserk:
    // Deal (2x, 3x, 4x) damage this turn
    berserk() {
        const ability = this.abilities.get("berserk")!

        if (ability.used) {
            throw new Error("Berserk has already been used")
        }

        switch (ability.level) {
            case 1:
                this.damageMultiplier = 2
                break
            case 2:
                this.damageMultiplier = 3
                break
            case 3:
                this.damageMultiplier = 4
                break
            default:
                return
        }

        ability.used = true
    }
}