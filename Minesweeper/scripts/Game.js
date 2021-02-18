//Copyright (C) 2021 Gabriel Zamora
'use strict';

import Minefield from "./Minefield.js";

export default class Game {
    constructor() {

        this.board = {
            size: 15,
            //placeholder variable for time to be implemented
            timecount: 20
        };
        this.minefield;

        this.minecount = 10;

        this.done = false;
        //Flag for size
        this.sizerr = true;
        //Flag for restart or new game
        this.newgame = true;

        //score value
        this.score = 0;

        //shields
        this.shields = 0;
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
    }

    changeMineCount() {
        switch (this.board.size) {
            case "4":
                this.minecount = 2;
                break;
            case "8":
                this.minecount = 4;
                break;
            case "15":
                this.minecount = 10;
                break;
            case "30":
                this.minecount = 20;
                break;
        }
    }

    run() {
        //run the game

        while (!this.done) {
            this.reset();
            this.render();
            this.update();
        }
        this.done = false;
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
        //TODO: Handle the user clicking one of the game map squares
        //Find the clicked thing
        $(".square").on('click', event => {
            const $theE1 = $(event.target);
            const id = $theE1.attr("id");
            $theE1.addClass("show-indicator");

            // TODO: check if mine is here
            const row = $theE1.data("row");
            const col = $theE1.data("col");
            console.log('Clicked cell at ' + row + ", " + col);

            //if mine GAME OVER
            const selectedSquare = this.minefield.squareAt(row, col);

            if (selectedSquare.hasMine) {
                console.log("Kaboom");
                //Check the size to remove the right classes
                if (this.board.size < 30) {
                    $theE1.removeClass("unknown-cell");
                    $theE1.addClass("mine-cell");

                    return;
                }

            }
            //TODO: ADD hasAdjacent method
            if (selectedSquare.hasAdjacent()) {
                const count = selectedSquare.adjacentMines;
                const $innerDiv = $("<div" + selectedSquare.adjacentMines + "</div>");
                //const $innerDiv = $("<div" + selectedSquare.adjacentMines + "</div>");
                $innerDiv.addClass(`color-${count}`);
                $theE1.append($innerDiv);

            }
            this.score++;
            console.log("Score is: " + this.score);

            $("#score-count").html(`${this.score}`);
            //if no mine, are there adjacent mines? if so, show count
            //if no adjacent mines, clear squares until found mines
        });

        $(".square").on("contextmenu", event => {
            event.preventDefault();

            //TODO: what happens on the right click....
        });
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
                    //Assign position data to every cell for 32x24 board size
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


    update() {
        //Game timer and disabling selected buttons (to be implemented)
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
}