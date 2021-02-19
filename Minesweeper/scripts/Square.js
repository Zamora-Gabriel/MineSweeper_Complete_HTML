//Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class Square {
    constructor(mine = false) {
        this._hasMine = false;
        this.adjacentMines = 0;
        //this.location
        this.mine = mine; //new Mine
        this.revealed = false;
    }

    get hasMine() {
        return this._hasMine;
    }

    get numAdjMines() {
        return this.adjacentMines;
    }

    Revealing() {
        this.revealed = true;
    }

    isRevealed() {
        return this.revealed;
    }

    PlusAdjMines() {
        this.adjacentMines++;
    }

    addMine() {
        this._hasMine = true;
    }

    hasAdjacent() {
        if (this.adjacentMines > 0) {
            return true;
        }
        return false;
    }
}