//[[8, 28, 6], [8, 30, 3], [5, 32, 2], [2, 34, 1]]
//solutions using thick, cell, thin
//requires a set of images that match the cellPix dimensions (square)
//1.png, 2.png, ..., 9.png

const thickPix = 5;
const cellPix = 32;
const thinPix = 2;
//let imageLoadedCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    var imageCounter = 0;
    
    //initialize board
    drawGrid(ctx);

    //load images then start
    numImages = 9;
    var imageList = []
    for (count = 1; count <= numImages; count++)
    {
        tempImg = document.createElement("img");
        tempImg.src = "./images/" + count.toString() + ".png";

        tempImg.addEventListener('load', function () {
            imageList.push(this);
            imageCounter++;
            console.log(imageCounter);
            if(imageCounter === 9)
              startGame(canvas, ctx, imageList);
        });
    }   

});

function startGame(canvas, ctx, imageList)
{
    //topState
    waiting = 1;
    cellClicked = 2;
    topState = waiting;

    //clickType
    neutralClick = 3;
    cellClick = 4;
    outsideClick = 5;
    canvasClick = 6;
    console.log("neutral 3, active 4, outside 5");

    //cell memory
    prevCell = [];
    currCell = [];

    //board memory -- FIX: update this in the state machine
    //TODO: initialize board with initial position
    board = [ [],[],[],
              [],[],[],
              [],[],[] ];
    for (i = 0; i < 9; i++)
    {
        for (j = 0; j < 9; j++)
        {
            board[i][j] = 0;
        }
    }
    console.log(board);
    

    window.addEventListener('click', function() {
        
        //get input***
        //
        //get canvas coordinates, if outside canvas return [-1,-1]
        clickCoords = getClickCoordinates(window, canvas);  
        console.log(clickCoords);
        
        //filter input***
        //
        //new code
        
        //canvasClick or outsideClick
        clickType = getClickType(clickCoords[0],clickCoords[1]);

        if (clickType === canvasClick)
        {
            //determine which cell was clicked on [0,0] to [8,8]
            //return [-1,y] or [x,-1] if neutral region
            currCell = cellSelected(clickCoords[0],clickCoords[1]);
            if (currCell[0] === -1 || currCell[1] === -1)
                clickType = neutralClick;
            else
            {
                clickType = cellClick;
                coords =  imageCoordinates(currCell[0], currCell[1]);
            }
        }
        
        //advance game state
        //state machine
        //
        //new code
        if (topState === waiting && clickType === cellClick)
        {
            //turn currCell ON
            coords = imageCoordinates(currCell[0], currCell[1]);
            ctx.fillStyle = 'rgb(0, 128, 0)';
            ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
            
            topState = cellClicked;
            prevCell[0] = currCell[0];
            prevCell[1] = currCell[1];
        }
        else if (topState === cellClicked)
        {
            if (clickType === outsideClick)
            {
                //turn prevCell OFF
                coords = imageCoordinates(prevCell[0], prevCell[1]);
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(coords[0],coords[1],cellPix,cellPix);

                topState = waiting;
                //flush cell memory
                prevCell = [];
            }
            else if (clickType === cellClick)
            {
                //case 1: prevCell === currCell
                if (prevCell[0] === currCell[0] && prevCell[1] === currCell[1])
                {
                    //turn prevCell OFF
                    coords = imageCoordinates(prevCell[0], prevCell[1]);
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                    
                    topState = waiting;
                    //flush cell memory
                    prevCell = [];
                    
                }
                
                //case 2: prevCell != currCell
                else
                {
                    //turn prevCell OFF
                    coords = imageCoordinates(prevCell[0], prevCell[1]);
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);

                    //turn currCell ON
                    ctx.fillStyle = 'rgb(0, 128, 0)';
                    coords = imageCoordinates(currCell[0], currCell[1]);
                    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);

                    topState = cellClicked;
                    prevCell[0] = currCell[0];
                    prevCell[1] = currCell[1];
                }
                
            }
            else if (clickType === neutralClick)
            {
                //do nothing?
            }
        }

    });

    //so in the callback, this is the element and event is the event?
    //seems like event can be omitted in the function parameter list
    //document.addEventListener('keydown', function(event) { 
    document.addEventListener('keydown', function() {
        
        c = event.keyCode;

        if( (( c >= 49 && c <= 57 ) || ( c >= 97 && c <= 105 ))
            && topState === cellClicked)
        {
            console.log(coords[0]);
            console.log(coords[1]);
            
            //clever way: 
            //tempImg = imageList[c-49]
            if (c === 49 || c === 97) //1, one code is for numpad
                tempImg = imageList[0]
            if (c === 50 || c === 98) //2
                tempImg = imageList[1]
            if (c === 51 || c === 99)
                tempImg = imageList[2]
            if (c === 52 || c === 100)
                tempImg = imageList[3]
            if (c === 53 || c === 101)
                tempImg = imageList[4]
            if (c === 54 || c === 102)
                tempImg = imageList[5]
            if (c === 55 || c === 103)
                tempImg = imageList[6]
            if (c === 56 || c === 104)
                tempImg = imageList[7]
            if (c === 57 || c === 105) //9
                tempImg = imageList[8]

            if (coords[0] >= 0)
                ctx.drawImage(tempImg,coords[0],coords[1]);            
            topState = waiting;
        }
    });
}

function getClickType(x,y)
{
    //clickType
    /*
    neutralClick = 3;
    cellClick = 4;
    outsideClick = 5;
    canvasClick = 6;
    
    */
    if (x === -1 || y === -1)
        return 5; //outsideClick
    else
        return 6; //canvasClick

    /*
    tempCell = cellSelected(x,y);
    if (tempCell[0] === -1 || tempCell[1] === -1)
        return 3; //neutralClick
    else
        return 4; //cellClick
    */


}
//get click coordinates relative to canvas position (centered)
//called inside the callback function for the click event
function getClickCoordinates(window, canvas)
{
    const rect = canvas.getBoundingClientRect();
    
    //check if the click was not in the canvas
    if (event.clientX < rect.left || event.clientX >= rect.right)
    {
        return [-1,-1];
    }
    else if (event.clientY < rect.top || event.clientY >= rect.bottom)
    {
        return [-1,-1];
    }
    //this click was in the canvas, get the canvas coordinates
    else
    {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return [x,y];
    }
}

function drawGrid(ctx)
{
    ctx.fillStyle = 'rgb(0, 0, 0)';

    //thick outer border
    ctx.fillRect(0, 0, 320, thickPix); //top
    ctx.fillRect(0, 320-thickPix, 320, thickPix); //bottom
    ctx.fillRect(0, 0, thickPix, 320); //left
    ctx.fillRect(320-thickPix,0,thickPix,320); //right

    //simplify calculations for thick lines
    boxPix = 3*cellPix + 2*thinPix

    //thick bars
    ctx.fillRect(thickPix+boxPix, 0, thickPix, 320); //vertical left
    ctx.fillRect(2*(thickPix+boxPix),0,thickPix,320);//vertical right
    ctx.fillRect(0,thickPix+boxPix, 320, thickPix); //horizontal top
    ctx.fillRect(0,2*(thickPix+boxPix),320,thickPix);//vertical right//hotizontal bottom

    //thin bars
    //verticals 1-6
    ctx.fillRect(thickPix+cellPix, 0, thinPix, 320); 
    ctx.fillRect(thickPix+2*cellPix+thinPix, 0, thinPix, 320); 
    
    ctx.fillRect(2*thickPix+4*cellPix+2*thinPix, 0, thinPix, 320); 
    ctx.fillRect(2*thickPix+5*cellPix+3*thinPix, 0, thinPix, 320); 
    
    ctx.fillRect(3*thickPix+7*cellPix+4*thinPix, 0, thinPix, 320); 
    ctx.fillRect(3*thickPix+8*cellPix+5*thinPix, 0, thinPix, 320); 

    //horizontals 1-6
    ctx.fillRect(0,thickPix+cellPix, 320, thinPix); 
    ctx.fillRect(0,thickPix+2*cellPix+thinPix, 320, thinPix); 
    
    ctx.fillRect(0,2*thickPix+4*cellPix+2*thinPix, 320, thinPix); 
    ctx.fillRect(0,2*thickPix+5*cellPix+3*thinPix, 320, thinPix); 
    
    ctx.fillRect(0,3*thickPix+7*cellPix+4*thinPix, 320, thinPix); 
    ctx.fillRect(0,3*thickPix+8*cellPix+5*thinPix, 320, thinPix); 
}

//accept the cell of interest [0,0] to [8,8]
//returns the pixel position to output the image
function imageCoordinates(row, col)
{
    if (row === -1 || col === -1)
        return [-1,-1]

    d = thickPix;
    c = cellPix;
    b = thinPix;
    
    //board is symmetric so decoding x and y is the same process
    pixelList = [   
                    d,
                    d+c+b,
                    d+2*c+2*b,
                    2*d+3*c+2*b,
                    2*d+4*c+3*b,
                    2*d+5*c+4*b,
                    3*d+6*c+4*b,
                    3*d+7*c+5*b,
                    3*d+8*c+6*b
                ];
    
    return [ pixelList[row], pixelList[col] ];
}

//accept mouse coordinates of the click
//returns the cell of interest [0,0] to [8,8]
//function cellSelected(x,y)
function cellSelected(x, y)
{
    cellX = findCell(x);
    cellY = findCell(y);
    return [cellX, cellY]
}

function findCell(x)
{
    d = thickPix;
    c = cellPix;
    b = thinPix;

    if ( x >= d           && x < d+c       )
        return 0;
    if ( x >= d+c+b       && x < d+2*c+b   )
        return 1;
    if ( x >= d+2*c+2*b   && x < d+3*c+2*b)
        return 2;

    if ( x >= 2*d+3*c+2*b && x < 2*d+4*c+2*b)
        return 3;
    if ( x >= 2*d+4*c+3*b && x < 2*d+5*c+3*b)
        return 4;
    if ( x >= 2*d+5*c+4*b && x < 2*d+6*c+4*b)
        return 5;

    if ( x >= 3*d+6*c+4*b && x < 3*d+7*c+4*b)
        return 6;
    if ( x >= 3*d+7*c+5*b && x < 3*d+8*c+5*b)
        return 7;
    if ( x >= 3*d+8*c+6*b && x < 3*d+9*c+6*b)
        return 8;

    //clicked on a neutral portion
    return -1;
}