//Copyright (C) 2021 Gabriel Zamora
'use strict';

import Square from "./Square.js"

export default class Minefield {
    constructor(size = 10, minecount = 10) {

        this.size = size;
        this.rowSize = size;
        this.colSize = size;
        this.field = []; //turn into a 2D array of squares

        //Init Minefield with empty squares
        this._init();
        // Init Minefield with n mines
        this._randomizeMines(minecount);
        // tell all the squares to compute adjacent mines
        this._computeAdj();
    }

    get SIZE() { return this.size; }

    squareAt(row, col) {
        //Look for square
        return this.field[row][col];
    }

    _init() {
        //Create 2D Array of squares
        for (let i = 0; i < this.size; i++) {
            this.field[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.field[i][j] = new Square();
                this.colSize = j;
            }
            this.rowSize = i;
            if (i >= 23) {
                break;
            }
        }
    }

    _randomizeMines(minecount) {
        let randRow = 0;
        let randCol = 0;

        //Foreach mine, randomize row, col
        for (let counter = 0; counter < minecount; counter++) {
            randRow = Math.floor(Math.random() * (this.rowSize + 1));
            randCol = Math.floor(Math.random() * (this.colSize + 1));

            //Generate random mine
            const selectedSquare = this.squareAt(randRow, randCol);

            //Place mine at row, column, unless mine is altready there
            if (selectedSquare.hasMine) {
                //Debug message
                console.log('Cell has mine already');
                //End of debug message
                counter--;
                continue;
            }
            selectedSquare.addMine();

            //Debug message
            console.log('Mine cell at ' + randRow + ", " + randCol);
            //End of debug message

        }

    }

    _computeAdj() {
        //walk through field, for each square count
        let colSearch = this.size;
        let rowSearch = this.size;
        if (this.size >= 30) {
            colSearch = this.size;
            rowSearch = 24;
        }

        for (let i = 0; i <= rowSearch; i++) {

            for (let j = 0; j <= colSearch; j++) {
                //call check function
                this.CheckAdj(i, j);
            }
        }

        //Debug message
        console.log("Adjacent count complete");
        //End of debug message
    }


    CheckAdj(row, col) {
        if (row > this.rowSize || col > this.colSize) {
            return;
        }
        const selectedSquare = this.squareAt(row, col);

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (row + i <= -1 || row + i > this.rowSize || col + j <= -1 || col + j > this.colSize) {

                    continue;
                }

                //continue if searching itself
                if (i == 0 && j == 0) {
                    continue;
                }

                if (this.field[row + i][col + j].hasMine) {
                    //Debug message
                    console.log("HAS MINE!");
                    //end debug message
                    selectedSquare.PlusAdjMines();
                }
            }
        }
        //Debug message
        console.log(`the number of adj mines in ${row}, ${col} is ${selectedSquare.numAdjMines}`);
        //end debug message
    }

    CheckFlaggedCells() {

        let colSearch = this.size;
        let rowSearch = this.size;
        let flaggedMines = 0;
        if (this.size >= 30) {
            colSearch = this.size;
            rowSearch = 24;
        }

        for (let i = 0; i < rowSearch; i++) {

            for (let j = 0; j < colSearch; j++) {
                //select the square
                const selectedSquare = this.squareAt(i, j);
                if (selectedSquare.hasMine && selectedSquare.Flagged) {
                    flaggedMines++;
                    //Debug message
                    console.log(`Flagged mine! Number of mines flagged: ${flaggedMines}`);
                    //End of debug message
                }
            }
        }

        return flaggedMines;
    }

}