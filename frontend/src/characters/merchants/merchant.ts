import { NonPlayable, Trader, Player } from "../character";
import { Item } from "../items/item";

export abstract class Merchant extends NonPlayable implements Trader {
    buy(player: Player, item: Item, gold: number) {
        throw new Error("Method not implemented.");
    }
    sell(player: Player, item: Item) {
        throw new Error("Method not implemented.");
    }

}