//Copyright (C) 2021 Gabriel Zamora
'use strict';

import Square from "./Square.js"
import Mine from "./Mine.js"

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

            const selectedSquare = this.squareAt(Math.floor(Math.random() * (this.rowSize + 1)), Math.floor(Math.random() * (this.rowSize + 1)));
            //Place mine at row, column, unless mine is altready there
            if (selectedSquare.hasMine) {
                console.log('Cell has mine already');
                counter--;
                continue;
            }
            selectedSquare.addMine();
            //Debugging
            console.log('Mine cell at ' + randRow + ", " + randCol);

        }

    }

    _computeAdj() {
        //TODO: walk through field, for each square count


    }

}