import * as InitBoard from './modules/initBoard.js'
import * as Calc from './modules/calc.js'

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
    let numImages = 9;
    var imageList = []
    for (let count = 1; count <= numImages; count++)
    {
        let tempImg = document.createElement("img");
        tempImg.src = "./images/" + count.toString() + ".png";

        tempImg.addEventListener('load', function () {
            imageList[count-1] = this; //strange JS indexing, into empty array
            imageCounter++;
            if(imageCounter === numImages)
              startGame(canvas, ctx, imageList);
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

    //state machine variables
    var clickType = null;
    var topState = STATES.waiting;

    //var cell = [null,null];
    var currCell = [null,null];
    var activeCell = [null,null];

    window.addEventListener('click', function(event) {

        //get raw input***
        let clickCoords = Calc.getClickCoordinates(window, canvas, event);
        console.log(clickCoords);
        
        //filter input***
        currCell = Calc.getCell(clickCoords[0],clickCoords[1], canvas);
        clickType = Calc.getClickType(currCell[0],currCell[1], clickBoard);
        
        //advance state***

        //initial click
        if (topState === STATES.waiting && clickType === CLICKS.cellRegion)
        {
            Calc.activateCell(currCell[0],currCell[1],clickBoard,ctx,imageList);

            activeCell[0] = currCell[0];
            activeCell[1] = currCell[1];
            topState = STATES.activeCell;
        }
        //secondary click
        else if (topState === STATES.activeCell)
        {
            //outside click
            if (clickType === CLICKS.outsideCanvas)
            {
                Calc.deactivateCell(activeCell[0],activeCell[1],clickBoard,ctx,imageList);

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
                //clicked the same active cell
                if (currCell[0] === activeCell[0] && currCell[1] === activeCell[1])
                {
                    Calc.deactivateCell(currCell[0],currCell[1],clickBoard,ctx,imageList);

                    topState = STATES.waiting;
                }
                
                //clicked a new active cell
                else
                {  
                    Calc.deactivateCell(activeCell[0],activeCell[1],clickBoard,ctx,imageList);
                    Calc.activateCell(currCell[0],currCell[1],clickBoard,ctx,imageList);
                    
                    activeCell[0] = currCell[0];
                    activeCell[1] = currCell[1];
                    topState = STATES.activeCell;
                }
            }
        }

    });

    document.addEventListener('keydown', function(event) {
        
        let c = event.keyCode;
        let tempImg = null;

        if (topState == STATES.activeCell)
        {
            //entry is -1 if the keypress wasn't valid
            var entry = Calc.getKeyEntry(c);
        
            //entries are 1 to 9
            //deletions are 0
            if (entry != -1)
            {
                if (entry === 0)
                {
                    clickBoard[activeCell[0]][activeCell[1]] = entry;
                    
                    Calc.deactivateCell(activeCell[0],activeCell[1],clickBoard,ctx,imageList);
                    
                    topState = STATES.waiting;
                }
                else
                {
                    clickBoard[activeCell[0]][activeCell[1]] = entry; 
                    
                    Calc.deactivateCell(activeCell[0],activeCell[1],clickBoard,ctx,imageList);
                    
                    topState = STATES.waiting;
                    
                    //CHECK FOR WIN
                    let win = Calc.checkWin(clickBoard,valBoard);
                    //console.log("win is: " + win);
                    if(win)
                    {                    
                        topState = 99;
                        console.log("winner");
                        Calc.winnerHighlight(ctx,clickBoard,imageList);
                        //Calc.winnerHighlight(ctx,board,imageList);
                        //document.querySelector("body").append("win");
                    }
                }
                console.log(clickBoard);
            }

        }
    });

}