//Copyright (C) 2021 Gabriel Zamora
'use strict';

import Minefield from "./Minefield.js";

import Score from "./Score.js";

export default class Game {
    constructor() {

        this.board = {
            size: 15,
            //placeholder variable for time to be implemented
            timecount: 20
        };
        this.minefield;

        this.minecount = 10;

        this.scorePage = new Score();

        this.done = false;
        //Flag for size
        this.sizerr = true;
        //Flag for restart or new game
        this.newgame = true;

        //score value
        this.score = 0;

        //shields
        this.shields = 0;

        //gameover flag
        this.gameOver = false; //State of game
    }


    get UserScore() {
        return this.score;
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

    reset() {

        //Clear score
        this.score = 0;
        $("#score-count").html(`${this.score}`);

        //Clear Shields
        this.shields = 0;
        $("#shield-count").html(`${this.shields}`)

        //Clear flags
        this.gameOver = false;
    }

    changeMineCount() {
        switch (this.board.size) {
            case "4":
                this.minecount = 2;
                this.board.timecount = 20;
                break;
            case "8":
                this.minecount = 4;
                this.board.timecount = 50;
                break;
            case "15":
                this.minecount = 10;
                this.board.timecount = 90;
                break;
            case "30":
                this.minecount = 20;
                this.board.timecount = 120;
                break;
        }
    }

    run() {
        //run the game

        while (!this.done) {
            this.reset();
            this.render();
            this.timing();
        }
        this.done = false;
    }
    update(seconds) {
        //timeout
        if (seconds <= 0) {
            this.gameOver = true;
            console.log("SHOOT");
        }
    }

    timing() {
        let secondCount = this.board.timecount;
        const $timerE1 = $("#timer-count");
        //Predefined objects
        let timer = window.setInterval(() => {
            //TODO: what do we do each second - update the timer
            $timerE1.html(secondCount);
            secondCount--;

            this.update(secondCount);
            if (this.gameOver) {
                window.clearInterval(timer);
                this.scorePage.runscore();
            }
        }, 1000);
    }


    render() {
        // Change grid size according to user's input
        this.resizeGrid();

        //Update mine counter
        this.changeMineCount();

        if (!this.sizerr) {
            // Generate the playfield
            this.minefield = new Minefield(this.board.size, this.minecount);
            this.generateBoard();
            this.updateCellHandlers();
            //Discriminate between a new game or a restart
            if (this.newgame) {
                this.hidesplash();
            } else {
                this.hidescore();
            }
        }
    }

    updateCellHandlers() {
        //Handle the user clicking one of the game map squares
        //Find the clicked thing
        $(".square").on('click', event => {
            const $theE1 = $(event.target);
            const id = $theE1.attr("id");

            //Check if cell has or not a flag
            if (!(this.CheckFlag($theE1))) {

                const row = $theE1.data("row");
                const col = $theE1.data("col");

                const selectedSquare = this.minefield.squareAt(row, col);
                // Check if mine is here (Debugging)

                console.log('Clicked cell at ' + row + ", " + col);
                //END debugging

                //if isn't revealed
                if (!(selectedSquare.isRevealed())) {
                    this._reveal(selectedSquare, $theE1);
                }
            }

        });

        $(".square").on("contextmenu", event => {
            //Right click
            event.preventDefault();

            const $theE1 = $(event.target);
            const id = $theE1.attr("id");


            //Debugging
            console.log("Flag detected");

            //Check if cell has already a flag
            if (this.CheckFlag($theE1)) {
                //Check the size to remove and add the right classes
                if (this.board.size < 30) {
                    $theE1.addClass("unknown-cell");
                    $theE1.removeClass("flag-cell");
                    return;
                }
                $theE1.addClass("unknown-cell32");
                $theE1.removeClass("flag-cell32");
                return;
            }

            //Check the size to remove and add the right classes
            if (this.board.size < 30) {
                $theE1.removeClass("unknown-cell");
                $theE1.addClass("flag-cell");
                return;
            }
            $theE1.removeClass("unknown-cell32");
            $theE1.addClass("flag-cell32");
            return;
        });
    }


    _reveal(selectedSquare, $theE1) {

        //Reveal the contents of the cell

        if (selectedSquare.hasMine) {

            //Debugging
            console.log("Mine detected");

            //Check the size to remove the right classes
            if (this.board.size < 30) {
                $theE1.removeClass("unknown-cell");
                $theE1.addClass("mine-cell");

                //sound effect: Explosion
                this.MineExplosion();

                //TODO: Shield
                this.gameOver = true;

                return;
            }

            $theE1.removeClass("unknown-cell32");

            $theE1.addClass("mine-cell32");

            //sound effect: Explosion
            this.MineExplosion();

            this.scorePage.runscore();

            return;
        }
        //ADD hasAdjacent method
        if (selectedSquare.hasAdjacent()) {
            //Are there adjacent mines? if so, show count
            const count = selectedSquare.adjacentMines;
            const $innerDiv = $("<div" + selectedSquare.adjacentMines + "</div>");

        }

        selectedSquare.Revealing();
        this._SquareReveal(selectedSquare);
        $theE1.removeClass("unknown-cell");
        $theE1.addClass(this._SquareReveal(selectedSquare));
        $theE1.append(`${selectedSquare.adjacentMines}`);

        this.score++;
        console.log("Score is: " + this.score);

        $("#score-count").html(`${this.score}`);

        //if no adjacent mines, clear squares until mines are found (adjmines > 0)
        //TODO:BFS/DFS to clear
    }

    //Check if the cell has flags
    CheckFlag($theE1) {
        if ($theE1.hasClass("flag-cell") || $theE1.hasClass("flag-cell32")) {
            return true;
        }
    }

    MineExplosion() {
        /*var ExplosionSound = new buzz.sound("sounds/Explosion.wav", {
            preload: true,
        });


        ExplosionSound.play()*/
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
                    //Assign position data to every cell
                    const id = `square-${row}-${col}`;
                    const dataAtt = `data-row= ${row} data-col= ${col}`;
                    markup += `<td class= "square" ><button class="unknown-cell" ${dataAtt} id=${id}><!--c1r1--></button></td>`;
                } else {
                    //Assign position data to every cell for 24x30 board size
                    const id = `square-${row}-${col}`;
                    const dataAtt = `data-row= ${row} data-col= ${col}`;
                    markup += `<td class= "square" ><button class="unknown-cell32" ${dataAtt} id=${id}><!--c1r1--></button></td>`;
                }
            }
            markup += "</tr>";
            if (row >= 23) {
                break;
            }
        }

        markup += "</table>";
        //find the board div, attach to this table
        $("#board").html(markup);
    }


    //Hide splash screen and show game screen
    hidesplash() {
        document.querySelector("#splash-page").hidden = true;
        document.querySelector("#splash-page").classList.remove("fixing-pos");
        document.querySelector("#minesw-game").hidden = false;
        document.querySelector("#board").classList.add("fixing-pos");
    }


    //hide score screen and show game screen
    hidescore() {
        document.querySelector("#score-page").hidden = true;
        document.querySelector("#score-show").classList.remove("fixing-pos");
        document.querySelector("#minesw-game").hidden = false;
        document.querySelector("#board").classList.add("fixing-pos");
    }

    _SquareReveal(theSquare) {
        let classes = "revealed-cell";
        //Square revealed?
        if (theSquare.isRevealed) {
            //Ternary operator value = (Condition ? result_iftrue : result_ifnot);
            classes += (theSquare.hasMine ? "" : ` color-${theSquare.adj}`);
        }

        return classes;
    }
}