import { Dog, Pet, Undead, Wolf } from "../animals/animal";
import { Character, Healer, Player } from "../character";
import { Enemy } from "../enemies/enemy";
import { Stats } from "../stats";

class Wizard extends Player implements Healer {
    heal(target: Character, amount: number) {
        throw new Error("Method not implemented.");
    }
    constructions: any[]
    undead: Pet | null

    // Cracked lock:
    // Unlock an (easy, intermediate, expert) lock
    crackedLock() {
        const ability = this.abilities.get("crackedLock")!

        if (ability.used) {
            throw new Error("Cracked lock has already been used")
        }

        ability.used = true
    }

    // Construction:
    // Construct a (2x2, 3x3, 3x3) structure with (20, 20, 40) health
    // that deals (0, 5, 10) damage with (0, 3, 4) range
    construction(position: Coordinates) {
        const ability = this.abilities.get("construction")!

        if (ability.used) {
            throw new Error("Construction has already been used")
        }

        // Construction switch here

        ability.used = true
    }

    // Conjuration:
    // Summon an undead with (20, 40, 60) health, 3 actions and (5, 10, 15) damage.
    // Will follow you until death.
    conjuration(position: Coordinates) {
        const ability = this.abilities.get("conjuration")!

        if (ability.used) {
            return
        }

        const actions = 3

        switch (ability.level) {
            case 1:
                this.undead = new Undead("Undead", 1, new Stats(20, 5, 0, 0, 0, 0, 0), 3, this)
                this.undead.move(position) // Move the dog to position
                break
            case 2:
                this.undead = new Undead("Undead", 2, new Stats(40, 10, 0, 0, 0, 0, 0), 3, this)
                this.undead.move(position) // Move the dog to position
                break
            case 3:
                this.undead = new Undead("Undead", 3, new Stats(60, 15, 0, 0, 0, 0, 0), 3, this)
                this.undead.move(position) // Move the dog to position
                break
            default:
                return
        }

        ability.used = true
    }

    // Firestorm:
    // Deal (10, 15, 25) damage to everyone adjacent
    firestorm(characters: Character[]) {
        const ability = this.abilities.get("firestorm")!

        if (ability.used) {
            throw new Error(`${this.name} has already used Firestorm`)
        }

        let damage: number;

        switch (ability.level) {
            case 1:
                damage = 10
                break
            case 2:
                damage = 15
                break
            case 3:
                damage = 25
                break
            default: return
        }

        characters
        .filter((character) => character != this && this.inRange(character.position, 1))
        .forEach((character) => {this.attack(character, damage)})


        ability.used = true
    }

    // Fireball:
    // (1, 1, 2) fire ball(s) with (4, 5, infinite) range and (12, 24, 24) damage.
    fireball(target: Enemy, targetTwo: Enemy | null) {
        const ability = this.abilities.get("fireball")!

        if (ability.used) {
            throw new Error(`${this.name} has already used Longshot`)
        }

        switch (ability.level) {
            case 1: 
                if (this.inRange(target.position, 4)) {
                    this.attack(target, 12)
                } else {
                    throw new Error("Target is not in range")
                }
                break
            case 2:
                if (this.inRange(target.position, 5)) {
                    this.attack(target, 24)
                } else {
                    throw new Error("Target is not in range")
                }
                break
            case 3:
                this.attack(target, 24)
                if (targetTwo) {
                    this.attack(targetTwo, 24)
                }
                break
            default:
                return
        }

        ability.used = true
    }

    // The wise:
    // Get (1 hint, 2 hints, the answer) to a riddle
    theWise() {
        const ability = this.abilities.get("theWise")!

        if (ability.used) {
            throw new Error(`${this.name} has already used The Wise`)
        }

        ability.used = true
    }

    // Alteration:
    // (you, all adjacent, all allies) take no projectile damage for 1 turn
    alteration(allies: Player[]) {
        const ability = this.abilities.get("alteration")!

        if (ability.used) {
            throw new Error(`${this.name} has already used alteration`)
        }

        this.immuneTo.arrows = true
        this.immuneTo.magic = true
        switch (ability.level) {
            case 1: break
            case 2: 
                allies.filter((ally) => this.inRange(ally.position, 1))
                .forEach((ally) => {
                    ally.immuneTo.arrows = true
                    ally.immuneTo.magic = true
                })
                break
            case 3:
                allies.forEach((ally) => {
                    ally.immuneTo.arrows = true
                    ally.immuneTo.magic = true
                })
                break
            default: return
        }
        ability.used = true
    }

    // Restoration:
    // Heal for (10, 20, 100%) HP
    healingWounds() {
        const ability = this.abilities.get("restoration")!

        if (ability.used) {
            throw new Error(``)
        }

        switch (ability.level) {
            case 3: this.heal(this, this.stats.maxHp); break
            case 2: this.heal(this, 10)
            case 1: this.heal(this, 10); break
            default: return                
        }        

        ability.used = true
    }
}