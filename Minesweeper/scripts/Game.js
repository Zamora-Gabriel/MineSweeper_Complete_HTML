//Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class Game {
    constructor() {

        this.board = {
            size: 0,
            //placeholder variable for time to be implemented
            timecount: 20
        };
        this.done = false;
        //Flag for size
        this.sizerr = true;
        //Flag for restart or new game
        this.newgame = true;

        //score value
        this.score = 0;
    }

    checkbttn() {
        //Select play button from splash page and check until is pressed
        let bttnElement = document.querySelector("#play-btn");

        bttnElement.addEventListener('click', event => {
            this.newgame = true;
            //Tell game to run
            this.run();
        });
    }

    resbttn() {
        //Check restart button and until pressed run again
        let resElement = document.querySelector("#restart-btn");

        resElement.addEventListener('click', event => {
            this.newgame = false;
            this.run();
        });
    }

    run() {
        //run the game
        while (!this.done) {
            this.resizeGrid();
            this.render();
            this.update();
        }
        this.done = false;
    }


    render() {
        // Change grid size according to user's input
        this.resizeGrid();
        if (!this.sizerr) {
            // Generate the playfield
            this.generateBoard();
            //Discriminate between a new game or a restart
            if (this.newgame) {
                this.hidesplash();
            } else {
                this.hidescore();
            }
        }
    }

    resizeGrid() {
        //get user's choice by cycling through the radio boxes and find selected

        //restart the previous value if is a new game
        if (this.newgame) {
            this.board.size = 0;
        }
        for (let i = 1; i <= 4; i++) {

            if (document.querySelector("#lvl-" + i).checked) {
                // assign checked radio's value to the size variable inside board
                this.board.size = document.querySelector("#lvl-" + i).value;
                //Flags
                this.sizerr = false;
                this.done = true;
                break;
            }
        }

        if (this.board.size === 0) {
            alert("Please check an option");
            this.sizerr = true;
            this.done = true;
        }
    }

    generateBoard() {
        /*autogenerate table*/
        let markup = "<table id=\"board-grid\">";
        for (let row = 0; row < this.board.size; row++) {
            markup += "<tr>";
            for (let col = 0; col < this.board.size; col++) {
                if (this.board.size < 30) {
                    markup += "<td><button class=\"mine-cell\"><!--c1r1--></button></td>";
                } else {
                    markup += "<td><button class=\"mine-cell32\"><!--c1r1--></button></td>"
                }
            }
            markup += "</tr>";
            if (row >= 24) {
                break;
            }
        }

        markup += "</table>";
        //find the board div, attach to this table
        document.querySelector("#board").innerHTML = markup;
    }


    update() {
        //Game timer and disabling selected buttons (to be implemented)
    }

    hidesplash() {
        document.querySelector("#splash-page").hidden = true;
        document.querySelector("#splash-page").classList.remove("fixing-pos");
        document.querySelector("#minesw-game").hidden = false;
        document.querySelector("#board").classList.add("fixing-pos");
    }

    hidescore() {
        document.querySelector("#score-page").hidden = true;
        document.querySelector("#score-show").classList.remove("fixing-pos");
        document.querySelector("#minesw-game").hidden = false;
        document.querySelector("#board").classList.add("fixing-pos");
    }
}