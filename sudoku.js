import * as InitBoard from './modules/initBoard.js'
import * as Calc from './modules/calc.js'
import * as Boards from './modules/boards.js'
import * as Win from './modules/checkWin.js'

const thickPix = 5;
const cellPix = 32;
const thinPix = 2;

const CLICKS = {
    outsideCanvas: -2,
    neutralRegion: -1,
    cellRegion: 0
};

const STATES = {
    waiting: 0,
    activeCell: 1
};

document.addEventListener("DOMContentLoaded", () => {
    
    //create canvas context
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    
    //load images then start
    var imageCounter = 0;
    var smallImageCounter = 0;
    
    let numImages = 9;
    var numSmallImages = 9;

    var imageList = [];
    var smallImageList = [];
    for (let count = 1; count <= numImages; count++)
    {
        let tempImg = document.createElement("img");
        tempImg.src = "./images/" + count.toString() + ".png";

        tempImg.addEventListener('load', function () {
            imageList[count-1] = this; //indexing into empty array works
            imageCounter++;
            if(imageCounter === numImages && smallImageCounter === numSmallImages)
            {
              startGame(canvas, ctx, imageList);
            }
        });
    }   
    for (let count = 1; count <= numImages; count++)
    {
        let tempImg = document.createElement("img");
        tempImg.src = "./images/" + "small" + count.toString() + "n.png";
        
        tempImg.addEventListener('load', function () {
            smallImageList[count-1] = this; //indexing into empty array works
            smallImageCounter++;
            if(imageCounter === numImages && smallImageCounter === numSmallImages)
            {
                startGame(canvas, ctx, imageList, smallImageList);
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
    var clickType = null;
    var topState = STATES.waiting;

    //cell memory
    var currCell = [null,null];
    var activeCell = [null,null];

    //rendering resources, use object to shorten function calls
    var gameObj = new Calc.GameObject(ctx,clickBoard,imageList);

    //FIX: TESTING SMALL IMAGES 
    ctx.drawImage(smallImageList[1],7+2*thinPix+2*cellPix,7);
    ctx.drawImage(smallImageList[4],7+2*thinPix+2*cellPix+9,7);
    ctx.drawImage(smallImageList[3],7+2*thinPix+2*cellPix+18,7);

    ctx.drawImage(smallImageList[5],7+2*thinPix+2*cellPix,7+9);
    ctx.drawImage(smallImageList[7],7+2*thinPix+2*cellPix+9,7+9);
    ctx.drawImage(smallImageList[8],7+2*thinPix+2*cellPix+18,7+9);
    
    ctx.drawImage(smallImageList[0],7+2*thinPix+2*cellPix,7+18);
    ctx.drawImage(smallImageList[2],7+2*thinPix+2*cellPix+9,7+18);
    ctx.drawImage(smallImageList[6],7+2*thinPix+2*cellPix+18,7+18);    

    //MOUSE CLICK HANDLER
    window.addEventListener('click', function(event) {

        //get raw input
        let clickCoords = Calc.getClickCoordinates(window, canvas, event);
        
        //filter input
        currCell = Calc.getCell(clickCoords[0],clickCoords[1], canvas);
        clickType = Calc.getClickType(currCell[0],currCell[1], clickBoard);
        
        //advance state
        //
        //initial click -- no cell is active
        if (topState === STATES.waiting && clickType === CLICKS.cellRegion)
        {
            //Calc.activateCell(currCell[0],currCell[1],clickBoard,ctx,imageList);
            Calc.activateCell(currCell[0],currCell[1],gameObj);

            activeCell[0] = currCell[0];
            activeCell[1] = currCell[1];
            topState = STATES.activeCell;
        }
        //secondary click -- a cell is active
        else if (topState === STATES.activeCell)
        {
            //outside click
            if (clickType === CLICKS.outsideCanvas)
            {
                Calc.deactivateCell(activeCell[0],activeCell[1],gameObj);

                topState = STATES.waiting;
            }

            //neutral click
            else if (clickType === CLICKS.neutralRegion)
            {
                //do nothing
            }

            //cell click
            else if (clickType === CLICKS.cellRegion)
            {
                //clicked the active cell
                if (currCell[0]===activeCell[0] && currCell[1]===activeCell[1])
                {
                    Calc.deactivateCell(currCell[0],currCell[1],gameObj);

                    topState = STATES.waiting;
                }
                
                //clicked a new cell
                else
                {  
                    Calc.deactivateCell(activeCell[0],activeCell[1],gameObj);
                    Calc.activateCell(currCell[0],currCell[1],gameObj);
                    
                    activeCell[0] = currCell[0];
                    activeCell[1] = currCell[1];
                    topState = STATES.activeCell;
                }
            }
        }

    });


    //KEYBOARD PRESS HANDLER
    document.addEventListener('keydown', function(event) {
        
        //get raw input
        let c = event.keyCode;

        if (topState == STATES.activeCell)
        {
            //filter input -- convert keycode to digit
            var entry = Calc.getKeyEntry(c);
            
            //check for valid input -- a digit
            if (entry != -1)
            {
                //deletion with 0
                if (entry === 0)
                {
                    clickBoard[activeCell[0]][activeCell[1]] = entry;
                    
                    Calc.deactivateCell(activeCell[0],activeCell[1],gameObj);

                    topState = STATES.waiting;
                }
                //data entry with 1 to 9
                else
                {
                    clickBoard[activeCell[0]][activeCell[1]] = entry; 
                    
                    Calc.deactivateCell(activeCell[0],activeCell[1],gameObj);
                    
                    topState = STATES.waiting;
                    
                    //check for win
                    let win = Win.checkWin(clickBoard,valBoard);
                    if(win)
                    {                    
                        topState = 99; //stop the state machine
                        Calc.winnerHighlight(ctx,clickBoard,imageList);
                    }
                }
            }
        }
        
    });

    //reset button
    var resetButton = document.querySelector("#resetButton");
    resetButton.addEventListener("click", function () {
    
        if (topState = STATES.activeCell)
        {
            Calc.deactivateCell(activeCell[0], activeCell[1], gameObj);
        }

        clickBoard = Boards.resetBoard(gameObj);
        
        topState = STATES.waiting;
    });

    //new puzzle button
    var newPuzzleButton = document.querySelector("#newPuzzleButton");
    newPuzzleButton.addEventListener("click", function () {
        
        console.log("generate new puzzle");
    
    });

}