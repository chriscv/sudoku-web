import * as InitBoard from './modules/initBoard.js'
import * as Boards from './modules/boards.js'

import * as Calc from './modules/calc.js'
//create a render file?

import * as Keyboard from './modules/keyboard.js'
import * as Mouse from './modules/mouse.js'
import {STATES} from './modules/enums.js'

document.addEventListener("DOMContentLoaded", () => {

    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    
    var imageCounter = 0;
    let numImages = 9;

    var imageList = [];

    //load images then start
    for (let count = 1; count <= numImages; count++)
    {
        let tempImg = document.createElement("img");
        tempImg.src = "./images/" + count.toString() + ".png";

        tempImg.addEventListener('load', function () {
            imageList[count-1] = this; //indexing into empty array works
            imageCounter++;
            if(imageCounter === numImages)
            {
                startGame(canvas, ctx, imageList);
            }
        });
    }  
});

function startGame(canvas, ctx, imageList)
{
    //draw board grid
    InitBoard.drawGrid(ctx);

    //initialize puzzle and board memory
    var boards = InitBoard.createBoard(ctx, imageList)
    var clickBoard = boards[0];
    var valBoard = boards[1];

    //cell memory
    var activeCell = [null,null];

    //game variables container
    var gameObj = new Calc.GameObject(ctx,
                                      clickBoard,
                                      imageList,
                                      activeCell,
                                      valBoard);  

    //state machine variables
    var topState = STATES.waiting;

    //mouse click handler
    window.addEventListener('click', function(event) {

        //highlights or de-highlights cell
        topState = Mouse.handleMouseClick(event, topState, gameObj, canvas);

    });


    //key press handler
    document.addEventListener('keydown', function(event) {

        //enters data into or deletes data from cell
        topState = Keyboard.handleKeyPress(event, topState, gameObj);

    });

    //"Reset" button -- FIX: move handler to boards.js
    var resetButton = document.querySelector("#resetButton");
    resetButton.addEventListener("click", function () {
    
        if (topState = STATES.activeCell)
        {
            Calc.deactivateCell(activeCell[0], activeCell[1], gameObj);
        }

        clickBoard = Boards.resetBoard(gameObj);
        
        topState = STATES.waiting;
    });

    //"New Puzzle" button -- FIX: move handler to puzzle.js
    var newPuzzleButton = document.querySelector("#newPuzzleButton");
    newPuzzleButton.addEventListener("click", function () {
        
        console.log("generate new puzzle");
    
    });

}