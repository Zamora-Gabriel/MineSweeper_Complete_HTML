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

        this.flags = 0;

        //object for score page transition
        this.scorePage = new Score();

        this.done = false;
        //Flag for size
        this.sizerr = true;
        //Flag for restart or new game
        this.newgame = true;

        //score value
        this.score = 0;

        //Row Size
        this.rowSize = 0;

        //Column Size
        this.columnSize = 0;


        //won flag
        this.wonFlag = false;

        //gameover flag
        this.gameOver = false; //State of game
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

        //Clear flags
        this.gameOver = false;
        this.wonFlag = false;
    }

    changeMineCount() {
        switch (this.board.size) {
            case "4":
                this.minecount = 2;
                this.board.timecount = 20;
                break;
            case "8":
                this.minecount = 10;
                this.board.timecount = 50;
                break;
            case "15":
                this.minecount = 25;
                this.board.timecount = 90;
                break;
            case "30":
                this.minecount = 90;
                this.board.timecount = 120;
                break;
        }
        this.flags = this.minecount;
        $("#flag-count").html(`${this.flags}`);
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

        //Check Winning conditions
        this.GameCompleted();

        //timeout
        if (seconds <= 0) {
            this.gameOver = true;
        }
    }

    timing() {

        if (!this.sizerr) {
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
                    this.scorePage.runscore(false);
                }
                if (this.wonFlag) {
                    window.clearInterval(timer);
                    this.scorePage.runscore(this.wonFlag);
                }
            }, 1000);
        }
    }



    render() {
        // Change grid size according to user's input
        this.resizeGrid();


        if (!this.sizerr) {
            //Update mine counter
            this.changeMineCount();

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

            const row = $theE1.data("row");
            const col = $theE1.data("col");

            const selectedSquare = this.minefield.squareAt(row, col);

            if ($theE1.hasClass("revealed-cell") || $theE1.hasClass("revealed-cell32")) {
                //Debug Message
                console.log("Can't flag a revealed cell");
                //End debug message

                return;
            }


            //Debug Message
            console.log("Right click detected, checking flagged...");

            //End debug message

            //Check if cell has not a flag
            if (!(this.CheckFlag($theE1))) {
                //Check the size to remove and add the right classes

                //Check if there are flags remaining
                if (this.flags <= 0) {
                    alert("Wait... You don't have more flags");
                    return;
                }

                if (this.CheckBoardSizing()) {
                    this._flaggingCell(true, $theE1, selectedSquare);
                    this.PlacedFlags(true);
                    return;
                }
                this._flaggingCell(false, $theE1, selectedSquare);
                this.PlacedFlags(true);
                return;
            }

            //Check the size to remove and add the right classes

            if (this.CheckBoardSizing()) {
                this._UnflaggingCell(true, $theE1, selectedSquare);
                this.PlacedFlags(false);
                return;
            }
            this._UnflaggingCell(false, $theE1, selectedSquare);
            this.PlacedFlags(false);
            return;
        });
    }

    CheckBoardSizing() {

        //Check if board size is lower than 30 in order to change adding and removing classes
        if (this.board.size < 30) {
            return true;
        }
        return false;
    }

    _flaggingCell(isLowSize, $theE1, selectedSquare) {
        //Check if board size is lower than 30
        if (isLowSize) {
            //Board size is lower than 30
            $theE1.removeClass("unknown-cell");
            $theE1.addClass("flag-cell");
            selectedSquare.ToggleFlag();
            return;
        }
        $theE1.removeClass("unknown-cell32");
        $theE1.addClass("flag-cell32");
        selectedSquare.ToggleFlag();
    }

    _UnflaggingCell(isLowSize, $theE1, selectedSquare) {
        //Check if board size is lower than 30
        if (isLowSize) {
            //Board size is lower than 30
            $theE1.addClass("unknown-cell");
            $theE1.removeClass("flag-cell");
            selectedSquare.ToggleFlag();
            return;
        }
        $theE1.addClass("unknown-cell32");
        $theE1.removeClass("flag-cell32");
        selectedSquare.ToggleFlag();
    }

    _reveal(selectedSquare, $theE1) {

        //Reveal the contents of the cell

        if (selectedSquare.hasMine) {

            //Debugging
            console.log("Mine detected");

            //Check the size to remove the right classes
            if (this.CheckBoardSizing()) {
                $theE1.removeClass("unknown-cell");
                $theE1.addClass("mine-cell");

                //sound effect: Explosion
                this.MineExplosion();

                //Update game state lose
                this.gameOver = true;

                return;
            }

            $theE1.removeClass("unknown-cell32");

            $theE1.addClass("mine-cell32");

            //sound effect: Explosion
            this.MineExplosion();


            //Update game state lose
            this.gameOver = true;

            //this.scorePage.runscore();

            return;
        }
        //ADD hasAdjacent method
        if (selectedSquare.hasAdjacent()) {
            //Are there adjacent mines? if so, show count
            const count = selectedSquare.adjacentMines;
            const $innerDiv = $("<div" + selectedSquare.adjacentMines + "</div>");

        }

        selectedSquare.Revealing();

        //Removing unknown classes, adding revealed
        this._RemoveUnknown($theE1, selectedSquare);

        this.score++;
        console.log("Score is: " + this.score);

        $("#score-count").html(`${this.score}`);

        let row = $theE1.data("row");
        let col = $theE1.data("col");

        //if no adjacent mines, clear squares until mines are found (adjmines > 0)
        if (!(selectedSquare.hasAdjacent())) {

            this.ClearEmptSquares(row, col);
        }

    }

    ClearEmptSquares(row, col) {
        //Flood fill algorithm
        if (row > this.rowSize || col > this.colSize) {
            return;
        }

        //Cycle through cells
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (row + i <= -1 || row + i > this.rowSize || col + j <= -1 || col + j > this.colSize) {

                    continue;
                }

                //continue if searching itself
                if (i == 0 && j == 0) {
                    continue;
                }

                //Select neighbour square
                const neighbourSquare = this.minefield.squareAt(row + i, col + j);
                const $theSquare = $(`#square-${row+i}-${col+j}`);

                //Check if cell has not been revealed
                if (!(neighbourSquare.isRevealed())) {
                    //reveal cell's contents   
                    neighbourSquare.Revealing();

                    //Removing unknown classes, adding revealed
                    this._RemoveUnknown($theSquare, neighbourSquare);

                    if (neighbourSquare.numAdjMines == 0 && !neighbourSquare.hasMine) {
                        //Keep revealing neighbouring cells by calling the same function (recursion)
                        this.ClearEmptSquares(row + i, col + j);
                    }

                }
            }
        }
    }

    //Check if the cell has flags
    CheckFlag($theE1) {
        if ($theE1.hasClass("flag-cell") || $theE1.hasClass("flag-cell32")) {
            return true;
        }
        return false;
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
                if (this.CheckBoardSizing()) {
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
                //update column size
                this.colSize = col;
            }
            markup += "</tr>";
            //Update row size
            this.rowSize = row;
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
        document.querySelector("#splash-show").classList.remove("fixing-pos");
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
        let classes = "revealed-cell32";
        if (this.CheckBoardSizing()) {
            //If board size is lower than 30
            classes = "revealed-cell"
        }
        //Square revealed?
        if (theSquare.isRevealed) {
            //exclude zero as isn't printed on cells
            if (theSquare.numAdjMines >= 1) {
                classes += (theSquare.hasMine ? "" : ` color-${theSquare.numAdjMines}`);
                return classes;
            }
            classes += (theSquare.hasMine ? "" : ` color-0`);
        }

        return classes;
    }

    _RemoveUnknown($theSquare, selectedSquare) {

        //Remove unknown class from cell and add the revealed class

        if (this.CheckBoardSizing()) {
            //Board size is lower than 30
            $theSquare.removeClass("unknown-cell");
            $theSquare.addClass(this._SquareReveal(selectedSquare));
            if (selectedSquare.adjacentMines != 0) {
                $theSquare.append(`${selectedSquare.adjacentMines}`);
            }
            return;
        }

        $theSquare.removeClass("unknown-cell32");
        $theSquare.addClass(this._SquareReveal(selectedSquare));
        if (selectedSquare.adjacentMines != 0) {
            $theSquare.append(`${selectedSquare.adjacentMines}`);
        }
    }

    //Update flag counter
    PlacedFlags(placed) {
        if (placed == true) {
            //As a flag fas placed, substract 1 from flag counter
            this.flags--;
        } else {
            this.flags++;
        }

        //Update User interface flag counter
        $("#flag-count").html(`${this.flags}`);
    }

    GameCompleted() {
        if (this.minefield.CheckFlaggedCells() == this.minecount) {
            this.wonFlag = true;
            console.log("WIN");
        }
    }

    /***Sound effects***/
    MineExplosion() {
        var ExplosionSound = new buzz.sound("sounds/Explosion.m4a", {
            preload: true,
        });


        ExplosionSound.play()
    }

}