import { Item } from "./item";

export abstract class Weapon extends Item {
    level: number
    damage: number
    itemSlots: number
}