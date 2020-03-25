//todo -- set up cells that block clicks for puzzle givens
//e.g. just a list of cells that are not accepting blocks
//the code that determines the clicked cell can check against this list

import * as Module from './modules/module.js';
import * as InitBoard from './modules/initBoard.js'

const thickPix = 5;
const cellPix = 32;
const thinPix = 2;

//[[8, 28, 6], [8, 30, 3], [5, 32, 2], [2, 34, 1]]
//solutions using thick, cell, thin
//requires a set of images that match the cellPix dimensions (square)
//1.png, 2.png, ..., 9.png

document.addEventListener("DOMContentLoaded", () => {
    
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    var imageCounter = 0;
    
    //initialize board
    Module.drawGrid(ctx);

    //load images then start
    let numImages = 9;
    var imageList = []
    for (let count = 1; count <= numImages; count++)
    {
        let tempImg = document.createElement("img");
        tempImg.src = "./images/" + count.toString() + ".png";

        tempImg.addEventListener('load', function () {
            //imageList.push(this);
            imageList[count-1] = this;
            imageCounter++;
            console.log(imageCounter);
            if(imageCounter === numImages)
              startGame(canvas, ctx, imageList);
        });
    }   

});

function startGame(canvas, ctx, imageList)
{
    console.log(imageList);

    //topState
    let waiting = 1;
    let cellClicked = 2;
    let win = 7;

    let topState = waiting;


    //clickType
    let neutralClick = 3;
    let cellClick = 4;
    let outsideClick = 5;
    let canvasClick = 6;
    console.log("neutral 3, active 4, outside 5, canvasClick 6");

    //cell memory
    let prevCell = [];
    let currCell = [];

    //coordinate variables
    let coords = [];
    
    //board memory -- FIX: update this in the state machine
    //TODO: initialize board with initial position (e.g. a sudoku puzzle)
    /*
    let board = [ [],[],[],
                  [],[],[],
                  [],[],[] ];
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            board[i][j] = 0;
    */
    
    //fix this to have a click checker and a value holder
    //winchecks are run against the value holder
    //the logic to handle clicks will work on the click checker
    //var board = InitBoard.createBoard(ctx, imageList);

    //new code
    var boardList = InitBoard.createBoard(ctx, imageList);
    //maintain old name bindings with board instead of clickBoard
    var board = boardList[0]; 
    var valBoard = boardList[1]; //FIX: update on keypress
    var val;
    console.log(board);
    console.log(valBoard);
    var x = 1;
    
    window.addEventListener('click', function(event) {
        
        //get click input***
        //get canvas coordinates, if outside canvas return [-1,-1]
        let clickCoords = Module.getClickCoordinates(window, canvas, event);  
        console.log(clickCoords);
        
        //filter click input***       
        let clickType = Module.getClickType(clickCoords[0],clickCoords[1]);
        if (clickType === canvasClick)
        {
            //determine which cell was clicked on [0,0] to [8,8]
            //return [-1,y] or [x,-1] if neutral region
            currCell = Module.cellSelected(clickCoords[0],clickCoords[1],board);
            if (currCell[0] === -1 || currCell[1] === -1)
                clickType = neutralClick;
            else
            {
                clickType = cellClick;
                coords = Module.imageCoordinates(currCell[0], currCell[1]);
            }
        }
        console.log("clickType: " + clickType);
        
        //advance state machine***
        if (topState === waiting && clickType === cellClick)
        {
            console.log("cellClick");
            console.log(coords);
            console.log(currCell);

            //this code goes in keyboard area
            //board[currCell[1]][currCell[0]] = 99;

            //check for entry in board
            //if current entry, highlight green, then redraw the entry
            val = board[currCell[1]][currCell[0]];
            console.log(val);
            if (val != 0)
            {
                coords = Module.imageCoordinates(currCell[0], currCell[1]);
                //green fill
                ctx.fillStyle = 'rgb(0, 128, 0)';
                ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                //redraw
                ctx.drawImage(imageList[val-1],coords[0],coords[1]);
                console.log(coords);
            }
            //if no entry, highlight green
            else
            {
                coords = Module.imageCoordinates(currCell[0], currCell[1]);
                //green fill
                ctx.fillStyle = 'rgb(0, 128, 0)';
                ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
            }
            console.log(board);

            topState = cellClicked;
            prevCell[0] = currCell[0];
            prevCell[1] = currCell[1];
        }
        else if (topState === cellClicked)
        {
            if (clickType === outsideClick)
            {
                val = board[currCell[1]][currCell[0]];
                //cell was full
                if (val != 0)
                {
                    //turn prevCell OFF
                    coords = Module.imageCoordinates(prevCell[0], prevCell[1]);
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                    //redraw contents
                    ctx.drawImage(imageList[val-1],coords[0],coords[1]);
                }
                //cell was empty
                else
                {
                    //turn prevCell OFF
                    coords = Module.imageCoordinates(prevCell[0], prevCell[1]);
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                }

                topState = waiting;
                //flush cell memory
                prevCell = [];
            }
            else if (clickType === cellClick)
            {
                //case 1: prevCell === currCell
                if (prevCell[0] === currCell[0] && prevCell[1] === currCell[1])
                {
                    val = board[currCell[1]][currCell[0]];
                    //cell is full
                    if (val != 0)
                    {
                        //turn prevCell OFF
                        coords = Module.imageCoordinates(prevCell[0], prevCell[1]);
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                        //redraw
                        ctx.drawImage(imageList[val-1],coords[0],coords[1]);
                    }
                    //cell is empty
                    else
                    {
                        //turn prevCell OFF
                        coords = Module.imageCoordinates(prevCell[0], prevCell[1]);
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                    }

                    topState = waiting;
                    //flush cell memory
                    prevCell = [];
                    
                }
                
                //case 2: prevCell != currCell
                else
                {
                    let currVal = board[currCell[1]][currCell[0]];
                    let prevVal = board[prevCell[1]][prevCell[0]];
                
                    //turn prevCell OFF
                    coords = Module.imageCoordinates(prevCell[0], prevCell[1]);
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                    if(prevVal != 0)
                    {
                        //redraw
                        ctx.drawImage(imageList[prevVal-1],coords[0],coords[1]);
                    }

                    //turn currCell ON
                    ctx.fillStyle = 'rgb(0, 128, 0)';
                    coords = Module.imageCoordinates(currCell[0], currCell[1]);
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                    if (currVal != 0)
                    { 
                        //redraw
                        ctx.drawImage(imageList[currVal-1],coords[0],coords[1]);
                    }

                    topState = cellClicked;
                    prevCell[0] = currCell[0];
                    prevCell[1] = currCell[1];
                }
                
            }
        }
    });

    //so in the callback, this is the element and event is the event?
    //seems like event can be omitted in the function parameter list
    //document.addEventListener('keydown', function(event) { 
    document.addEventListener('keydown', function(event) {
        
        let c = event.keyCode;
        let tempImg = null;

        if (topState == cellClicked)
        {
            var entry = Module.getKeyEntry(c);
        
            //entry is -1 if the keypress wasn't in the valid range of 1 to 9
            if (entry != -1)
            {
                if (entry === 0)
                {
                    //white-out the cell
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                    
                    topState = waiting;
                    board[currCell[1]][currCell[0]] = entry;
                    valBoard[currCell[1]][currCell[0]] = entry;
                }
                else
                {
                    tempImg = imageList[entry-1];

                    //white-out the cell
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                    //draw image
                    ctx.drawImage(tempImg,coords[0],coords[1]);            
                    
                    topState = waiting;
                    board[currCell[1]][currCell[0]] = entry;
                    valBoard[currCell[1]][currCell[0]] = entry;
                    console.log(valBoard);
    
                    console.log("about to check");
                    let win = Module.checkWin(valBoard);
                    //console.log("win is: " + win);
                    if(win)
                    {                    
                        topState = win;
                        console.log("winner");
                    }
                }
                
            }

        }
        
    });
}
