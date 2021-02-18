// Copyright (C) 2021 Gabriel Zamora
'use strict';

import Game from './Game.js';
import Splash from './Splash.js';
import Score from './Score.js';


$(document).ready(event => {

    //Main Application
    let game = new Game();
    let splash = new Splash();
    let score = new Score();

    //Start with score page
    document.querySelector("#score-page").hidden = true;
    document.querySelector("#minesw-game").hidden = true;


    //Check buttons
    game.checkbttn();
    console.log()
    score.checkover();
    splash.retbttn();
    game.resbttn();
});