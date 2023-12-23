import { Animal, Pet } from "../animals/animal";
import { Character, Healer, Player } from "../character";
import { Enemy } from "../enemies/enemy";

class Elf extends Player implements Healer {
    pets: Pet[]
    bonusDamage: number

    startTurn() {
        this.remainingActions = this.actions
        this.pets = []
        this.bonusDamage = 0
    }

    heal(target: Character, amount: number) {
        if (target.stats.currentHp + amount > target.stats.maxHp) {
            target.stats.currentHp = target.stats.maxHp
        } else {
            target.stats.currentHp += amount
        }
    }

    // Acrobat:
    // Take no damage from (arrows, +melee, +magic) next turn.
    acrobat() {
        const ability = this.abilities.get("acrobat")!

        if (ability.used) {
            throw new Error("Acrobat has already been used")
        }

        switch (ability.level) {
            case 3: this.immuneTo.magic = true 
            case 2: this.immuneTo.melee = true
            case 1: this.immuneTo.arrows = true; break
            default: return
        }

        ability.used = true
    }

    // Twinshot:
    // Roll for a ranged attack. This attack hits (2, 3, 5) enemies.
    twinshot(enemies: Enemy[], damage: damage) {
        const ability = this.abilities.get("twinshot")!

        if (ability.used) {
            throw new Error("Twinshot has already been used")
        }

        switch (ability.level) {
            case 1: 
                const levelOneRange = enemies.length < 2 ? enemies.length : 2
                for (let i = 0; i < levelOneRange; i++) {
                    this.attack(enemies[i], damage)
                }
                break
            case 2:
                const levelTwoRange = enemies.length < 3 ? enemies.length : 3
                for (let i = 0; i < levelTwoRange; i++) {
                    this.attack(enemies[i], damage)
                }
                break
            case 3:
                const levelThreeRange = enemies.length < 5 ? enemies.length : 5
                for (let i = 0; i < levelThreeRange; i++) {
                    this.attack(enemies[i], damage)
                }
            default:
                return
        }
        ability.used = true
    }

    // Longshot:
    // (1, 1, 2) arrow(s) with (4, 5, infinite) range and (12, 24, 24) damage.
    longshot(target: Enemy, targetTwo: Enemy | null) {
        const ability = this.abilities.get("longshot")!

        if (ability.used) {
            throw new Error("Longshot has already been used")
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

    // Fortune:
    // Reroll dice (1, 2, 3) time(s)
    fortune() {
        const ability = this.abilities.get("fortune")!

        if (ability.used) {
            throw new Error("Fortune has already been used")
        }

        ability.used = true
    }

    // Healer:
    // (10, 20, full) heal on self or adjacent hero
    healer(target: Player) {
        const ability = this.abilities.get("healer")!

        if (ability.used) {
            throw new Error("Healer has already been used")
        }

        if (!this.inRange(target.position, 1)) {
            throw new Error("Target hero is not in range")
        }



        switch (ability.level) {
            case 3: this.heal(target, target.stats.maxHp)
            case 2: this.heal(target, 10)
            case 1: this.heal(target, 10); break
            default: return
        }

        ability.used = true        
    }

    // Twin swords:
    // Deal (10, 15, 25) damage to everyone adjacent
    twinSwords(characters: Character[]) {
        const ability = this.abilities.get("twinSwords")!

        if (ability.used) {
            throw new Error("Twin swords has already been used")
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

    // Divine Focus:
    // Increase damage by (5, 10, 15) for one turn. Heal for same amount.
    divineFocus() {
        const ability = this.abilities.get("divineFocus")!

        if (ability.used) {
            throw new Error("Divine focus has already been used")
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

    // Nature's blessing:
    // Possess (1, 2, 4) animals for one turn
    naturesBlessing(animals: Animal[]) {
        const ability = this.abilities.get("naturesBlessing")!

        if (ability.used) {
            throw new Error("Nature's blessing has already been used")
        }

        let numberOfAnimals: number;

        switch (ability.level) {
            case 1: numberOfAnimals = 1; break
            case 2: numberOfAnimals = 2; break
            case 3: numberOfAnimals = 4; break
            default: return
        }

        if (numberOfAnimals > animals.length) {
            numberOfAnimals = animals.length
        }

        for (let i = 0; i < numberOfAnimals; i++) {
            const animal = animals[i];
            const pet = new Pet(animal.name, animal.level, animal.stats, 3, this)
            this.pets.push(pet)
        }
        ability.used = true
    }

    // Elven beauty:
    // (1, 2, 3) enemies can't attack next turn
    elvenBeauty(targets: Enemy[]) {
        const ability = this.abilities.get("elvenBeauty")!

        if (ability.used) {
            throw new Error("Elven beauty has already been used")
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

    // Divine blessing:
    // (Double, triple, quadruple) any roll once
    divineBlessing() {
        const ability = this.abilities.get("divineBlessing")!

        if (ability.used) {
            throw new Error("Divine blessing has already been used")
        }

        ability.used = true
    }
}