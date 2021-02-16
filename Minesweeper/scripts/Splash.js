//Copyright (C) 2021 Gabriel Zamora
'use strict';


export default class Splash {
    constructor() {

        this.bttnclicked = false;
    }

    splashrun() {
        //Returning from the score/gameover page
        for (let i = 1; i <= 4; i++) {

            if (document.querySelector("#lvl-" + i).checked) {
                // clear checked radio box for size
                document.querySelector("#lvl-" + i).checked = false;
                break;
            }
        }

        //hide score page, show splash page
        document.querySelector("#score-page").hidden = true;
        document.querySelector("#score-show").classList.remove("fixing-pos");
        document.querySelector("#splash-page").hidden = false;
        document.querySelector("#splash-page").classList.add("fixing-pos");
    }

    retbttn() {
        //Check return button in score page
        let retElement = document.querySelector("#return-btn");

        retElement.addEventListener('click', event => {
            this.bttnclicked = true;
            this.splashrun();
        });
    }
}