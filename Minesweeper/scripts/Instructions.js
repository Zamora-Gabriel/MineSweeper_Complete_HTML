//Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class Instructions {
    constructor() {

    }

    instrRun() {
        document.querySelector("#splash-page").hidden = true;
        document.querySelector("#splash-show").classList.remove("fixing-pos");
        document.querySelector("#instr-page").hidden = false;
        document.querySelector("#instr-show").classList.add("fixing-pos");
    }

    showInstrbttn() {
        //Check return button in score page
        let retElement = document.querySelector("#instr-btn");

        retElement.addEventListener('click', event => {
            this.instrRun();
        });
    }
}