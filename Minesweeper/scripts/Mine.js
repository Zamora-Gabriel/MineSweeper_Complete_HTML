//Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class Mine {
    constructor(mine = false) {
        this._hasMine = false;
        this.adjacentMines = 0;
        //this.location
        this.mine = mine; //new Mine
    }

    get hasMine() {
        return this._hasMine;
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