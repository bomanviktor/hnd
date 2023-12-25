import {newGame} from "./new_game.js";

// Create an Audio object
let audio = new Audio('./assets/audio/music/main-menu.mp3');
audio.loop = true;

const wrapper = document.getElementById("wrapper") as HTMLElement;

export function mainMenu(): Game | void {
   audio.play();

    wrapper.style.backgroundImage = 'url("./assets/images/dark-forest.jpg")'
    wrapper.innerHTML = mainMenuHtml
    const newGameSelection = document.getElementById("new-game")!
    newGameSelection.addEventListener("mousedown", () => {
            return newGame()
        })

    /*
    const loadGame = document.getElementById("load-game")!
    const settings = document.getElementById("settings")!

     */
}


const mainMenuHtml: string = `
<div id="menu">
<h1 id="title">Hektor and Dragons</h1>
<div id="menu-items">
<h2 class="main-menu-item selectable" id="new-game">New Game</h2>
<h2 class="main-menu-item selectable" id="load-game">Load Game</h2>
<h2 class="main-menu-item selectable" id="settings">Settings</h2>
</div>
</div>
`


export class Game {
    name: string

}

function playSound() {
    // Check if the audio is paused, and if so, play it
    if (audio.paused) {
        audio.play();
    } else {
        // If the audio is already playing, you might want to rewind it to the beginning
        audio.currentTime = 0;
    }
}