import * as InitBoard from './modules/initBoard.js'
import * as Calc from './modules/calc.js'
import * as Boards from './modules/boards.js'
import * as Keyboard from './modules/keyboard.js'
import * as Mouse from './modules/mouse.js'
import {STATES} from './modules/enums.js'

document.addEventListener("DOMContentLoaded", () => {

    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    
    var imageCounter = 0;
    let numImages = 9;

    var imageList = [];

    //can we remove this code and simply use window.onload? 
    //which fires after all scripts, images, css have loaded?
    for (let count = 1; count <= numImages; count++)
    {
        let tempImg = document.createElement("img");
        tempImg.src = "./images/" + count.toString() + ".png";

        //update this code to be less confusing, lucky with the let binding
        //pass the count into the callback function
        //alternatively push the handlers into a handlerList
        //afterwards call all the handlerList callbacks
        //see irc ##javascript question
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

function startGame(canvas, ctx, imageList, smallImageList)
{
    //draw board grid
    InitBoard.drawGrid(ctx);

    //initialize puzzle and board memory
    var boards = InitBoard.createBoard(ctx, imageList)
    var clickBoard = boards[0];
    var valBoard = boards[1];

    //state machine variables
    var topState = STATES.waiting;

    //cell memory
    var activeCell = [null,null];

    //rendering resources, use object to shorten function calls
    var gameObj = new Calc.GameObject(ctx,
                                      clickBoard,
                                      imageList,
                                      activeCell,
                                      valBoard);  

    //MOUSE CLICK HANDLER
    //FIX: Move handler function to mouse.js
    window.addEventListener('click', function(event) {

        topState = Mouse.handleMouseClick(event, topState, gameObj, canvas);

    });


    //KEYBOARD PRESS HANDLER
    //FIX: capture more variables into the game object
    document.addEventListener('keydown', function(event) {

        topState = Keyboard.handleKeyPress(event, topState, gameObj);

    });

    //"Reset" button
    //FIX: move handler to boards.js
    var resetButton = document.querySelector("#resetButton");
    resetButton.addEventListener("click", function () {
    
      //confirmation dialog:
      //if (confirm):
        if (topState = STATES.activeCell)
        {
            Calc.deactivateCell(activeCell[0], activeCell[1], gameObj);
        }

        clickBoard = Boards.resetBoard(gameObj);
        
        topState = STATES.waiting;
    });

    //"New Puzzle" button
    //FIX: move handler to puzzle.js
    var newPuzzleButton = document.querySelector("#newPuzzleButton");
    newPuzzleButton.addEventListener("click", function () {
        
        console.log("generate new puzzle");
    
    });

}