import {Game} from "./main_menu.js";

const wrapper = document.getElementById("wrapper") as HTMLElement;

export function newGame(): Game {

    wrapper.innerHTML = newGameHtml

    return new Game()
}


const newGameHtml: string = `
<div id="menu">
<h1 id="title">New Game</h1>
<div id="menu-items">

<form id="new-game-form">
    <label for="party-name">Party name:</label>
    <input type="text" id="party-name" name="party-name">

    <label>Number of players:</label>
    <div id="total-players">
        <label for="1-player">1</label>
        <input class="select-player-amount" type="radio" id="1-player" name="total-players" value="1" checked>

        <label for="2-players">2</label>
        <input class="select-player-amount" type="radio" id="2-players" name="total-players" value="2">

        <label for="3-players">3</label>
        <input class="select-player-amount" type="radio" id="3-players" name="total-players" value="3">

        <label for="4-players">4</label>
        <input class="select-player-amount" type="radio" id="4-players" name="total-players" value="4">
    </div>

    <label for="difficulty">Choose difficulty:</label>
    <select id="difficulty" name="difficulty">
        <option class="difficulty-option" value="easy">Easy</option>
        <option class="difficulty-option" value="medium">Medium</option>
        <option class="difficulty-option" value="hard">Hard</option>
    </select> 

    <input type="submit" value="Create Party" id="create-party-btn">
</form>

</div>
</div>
`