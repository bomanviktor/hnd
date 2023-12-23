import { Player } from "../character"
import { Merchant } from "../merchants/merchant"

export abstract class Item implements Tradeable {
    value: number

    constructor(value: number) {
        this.value = value
    }
    
    buy(player: Player, merchant: Merchant) {
        // Add personality modifier here
        if (player.gold < this.value) {
            throw new Error(`${player.name} is too broke.`)
        }        
        merchant.gold + this.value
        player.gold - this.value
        player.inventory!.push(this)
    }

    sell(player: Player, merchant: Merchant) {
        // Add personality modifier here
        if (merchant.gold < this.value) {
            throw new Error(`${merchant.name} is too broke.`)
        }        
        
        merchant.gold - this.value
        player.gold + this.value
        // this will remove duplicates for now
        // TODO: Fix to only remove one item
        player.inventory = player.inventory!.filter((item) => {
            item != this
        })
    }  
}

interface Tradeable {
    buy(player: Player, merchant: Merchant)
    sell(player: Player, merchant: Merchant)
}