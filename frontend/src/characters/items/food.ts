import { Item } from "./item";

export abstract class Food extends Item {
    hp: number
    constructor(value: number, hp: number) {
        super(value)
        this.hp = hp
    }
}

export class Apple extends Food {
    hp = 3
    value = 5
}

export class Salad extends Food {
    hp = 3
    value = 5
}
