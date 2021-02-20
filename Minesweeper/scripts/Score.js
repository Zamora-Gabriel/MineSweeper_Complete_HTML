//Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class Score {
    constructor() {

        this.overclicked = false;
    }

    runscore(wonFlag) {
        //After game stops hide game page and show score page
        document.querySelector("#minesw-game").hidden = true;
        document.querySelector("#board").classList.remove("fixing-pos");
        document.querySelector("#score-page").hidden = false;
        document.querySelector("#score-show").classList.add("fixing-pos");

        //Display Score by getting it from the game page
        if (wonFlag) {
            const scorenum = $("#score-count").html();
            $("#result-numb").html(`You Won! No of clicks: ${scorenum}`);
            return;
        }
        $("#result-numb").html(`GAME OVER`);
    }
}