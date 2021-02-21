// Copyright (C) 2021 Gabriel Zamora
'use strict';

import Game from './Game.js';
import Splash from './Splash.js';
import Score from './Score.js';
import Instructions from './Instructions.js';


$(document).ready(event => {

    //Main Application

    let game = new Game();
    let splash = new Splash();
    let score = new Score();
    let instruct = new Instructions();

    //Start with score page
    document.querySelector("#score-page").hidden = true;
    document.querySelector("#minesw-game").hidden = true;
    document.querySelector("#instr-page").hidden = true;


    //Check buttons
    game.checkbttn();
    splash.retbttn();
    splash.instrRetBttn()
    instruct.showInstrbttn();
    game.resbttn();
});