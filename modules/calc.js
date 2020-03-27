const thickPix = 5;
const cellPix = 32;
const thinPix = 2;

const CLICKS = {
    outsideCanvas: -2,
    neutralRegion: -1,
    cellRegion: 0
};

class GameObject {
    constructor(ctx, clickBoard, imageList) {
      this.ctx = ctx;
      this.clickBoard = clickBoard;
      this.imageList = imageList;
    }
}

class CellObj {
    constructor(cellRow, cellCol, ctx, clickBoard, imageList) {
        this.cellRow = cellRow;
        this.cellCol = cellCol;
        this.ctx = ctx;
        this.clickBoard = clickBoard;
        this.imageList = imageList;
    }

    activate() {
        activateCell(cellRow,cellCol,ctx,clickBoard,imageList);
    }
}

function copyThis(board)
{
    let tempBoard = [];
    for (var i = 0; i < 9; i++)
    {
        var row = [];
        for (var j = 0; j < 9; j++)
        {
            row.push(board[i][j]);
            console.log(row);
        }
        tempBoard.push(row);
    }
    console.log("copy done");
    console.log(tempBoard);
    return tempBoard;
}

function winnerHighlight(ctx,clickBoard,imageList)
{
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            var val = clickBoard[i][j];

            if (val != -1)
            {
                var coords = imageCoordinates(i,j);
                //highlight the cell
                ctx.fillStyle = 'rgb(0, 128, 0)';
                ctx.fillRect(coords[1],coords[0],cellPix,cellPix);
                //draw image
                ctx.drawImage(imageList[val-1],coords[1],coords[0]);    
    
                //the thing is about the switched indices is:
                //imageCoords(row,col) makes sense but
                //drawImage (x,y) is actually column, row
            }
        }
    }
}

function checkWin(clickBoard,valBoard)
{
    //check for empties in clickBoard
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (clickBoard[i][j] === 0)
            {
                    console.log("failed zero");
                    return false;
            }
        }
    }

    //copy clickBoard data into valBoard then run checks
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            if (clickBoard[i][j] != -1)
                valBoard[i][j] = clickBoard[i][j];
        }
    }

    //re-using old name bindings
    var board = valBoard;

    console.log("checking");
    var tempBoard = copyThis(board);
    console.log(tempBoard);
    //check rows***
    for (var i = 0; i < 9; i++)
    {
        var row = tempBoard[i];
        row = row.sort();
        for (var k = 0; k < 8; k++)
        {
            if (row[k+1] != row[k]+1)
            {
                    console.log("failed rows");
                    return false;
            }
        }
    }
    
    //check columns***
    //build up columns into rows, then re-use the code
    var columnBoard = [];
    var tempBoard = copyThis(board);
    for (var i = 0; i < 9; i++)
    {
        var column = [];

        for (var j = 0; j < 9; j++)
        {
            column.push(tempBoard[j][i]);    
        }
        console.log(column);
        columnBoard.push(column);
    }
    console.log(column.board);
    //re-use row tester on columnBoard
    //check rows
    for (var i = 0; i < 9; i++)
    {
        var row = columnBoard[i];
        row = row.sort();
        for (var k = 0; k < 8; k++)
        {
            if (row[k+1] != row[k]+1)
            {
                console.log("failed columns");
                return false;
            }
                
        }
    }

    //box checker***
    //build up boxes into rows, then re-use the code
    //box1, i [0,2] j [0,2]
    //box2, i [0,2] j [3,5]
    //box3, i [0,2] j [6,8]
    
    //box4, i [3,5] j [0,2]
    //box5, i [3,5] j [3,5]
    //box6, i [3,5] j [6,8]
    
    //box7, i [6,8] j [6,8]
    //box8, i [6,8] j [3,5]
    //box9, i [6,8] j [0,2]
    let box1 = [];
    let box2 = [];
    let box3 = [];
    let box4 = [];
    let box5 = [];
    let box6 = [];
    let box7 = [];
    let box8 = [];
    let box9 = [];
    var tempBoard = copyThis(board);
    for (var i = 0; i < 9; i++) //i is the row depth
    {
        for (var j = 0; j < 9; j++) //j is the column depth
        {
            var val = tempBoard[i][j];

            if (i < 2)
            {
                if (j < 3) //box1
                    box1.push(val);
                else if (j < 6)
                    box2.push(val);
                else
                    box3.push(val);
            }
            else if (i < 6)
            {
                if (j < 3)
                    box4.push(val);
                else if (j < 6)
                    box5.push(val);
                else
                    box6.push(val);
            }
            else
            {
                if (j < 3)
                    box7.push(val);
                else if (j < 6)
                    box8.push(val);
                else
                    box9.push(val);
            }
            
        }
    }
    let boxBoard = [ 
                     box1,
                     box2,
                     box3,
                     box4,
                     box5,
                     box6,
                     box7,
                     box8,
                     box9
                   ];
    console.log(boxBoard);
    //re-use row tester on boxBoard
    //check rows
    for (var i = 0; i < 9; i++)
    {
        var row = columnBoard[i];
        row = row.sort();
        for (var k = 0; k < 8; k++)
        {
            if (row[k+1] != row[k]+1)
            {
                console.log("failed boxes");
                return false;
            }
                
        }
    }
    
    return true;
}

function getClickType(row,col,clickBoard)
{
    var currCell = [row,col];
    var clickType;

    //set clickType
    if (currCell[0] >= 0 && currCell[1] >= 0)
        if (clickBoard[currCell[0]][currCell[1]] === -1)
            currCell = [-1,-1]

    if (currCell[0] === -2)
        clickType = CLICKS.outsideCanvas;
    else if (currCell[0] === -1)
        clickType = CLICKS.neutralRegion;
    else   
        clickType = CLICKS.cellRegion;

    return clickType;
}


function getKeyEntry(c)
{
    var entry;
    if( (( c >= 49 && c <= 57 ) || ( c >= 97 && c <= 105 )) )
    { 
        if (c === 49 || c === 97) //1, alternate code is for numpad
            entry = 1;
        if (c === 50 || c === 98) //2
            entry = 2;
        if (c === 51 || c === 99)
            entry = 3;
        if (c === 52 || c === 100)
            entry = 4;
        if (c === 53 || c === 101)
            entry = 5;
        if (c === 54 || c === 102)
            entry = 6;
        if (c === 55 || c === 103)
            entry = 7;
        if (c === 56 || c === 104)
            entry = 8;
        if (c === 57 || c === 105) //9
            entry = 9;
    }
    else if (c === 48 || c === 96)
        entry = 0;
    else
        entry = -1;
    
    return entry;
}

function activateCell(row,col,gameObj)
{
    var clickBoard = gameObj.clickBoard;
    var ctx = gameObj.ctx;
    var imageList = gameObj.imageList;
    
    console.log("inside activateCell2");
    console.log(clickBoard);
    
    activateCell2(row,col,clickBoard,ctx,imageList);
}

function deactivateCell(row,col,gameObj)
{
    var clickBoard = gameObj.clickBoard;
    var ctx = gameObj.ctx;
    var imageList = gameObj.imageList;
    
    console.log("inside activateCell2");
    console.log(clickBoard);
    
    deactivateCell2(row,col,clickBoard,ctx,imageList);
}

function activateCell2(row,col,clickBoard,ctx,imageList)
{
    var cell = [row,col];
    console.log("activating");
    //activate cell***

    //check if cell has contents
    var val = clickBoard[row][col];
    if (val != 0)
    {
        //yes: green, img
        let coords = imageCoordinates(cell[0], cell[1]);
        ctx.fillStyle = 'rgb(0, 128, 0)';
        ctx.fillRect(coords[1],coords[0],cellPix,cellPix);
        ctx.drawImage(imageList[val-1], coords[1], coords[0]);
    }
            
    else
    {
        //no: green
        let coords = imageCoordinates(cell[0], cell[1]);
        ctx.fillStyle = 'rgb(0, 128, 0)';
        ctx.fillRect(coords[1],coords[0],cellPix,cellPix);
    }
}

function deactivateCell2(row,col,clickBoard,ctx,imageList)
{
    var cell = [row,col];
    console.log("deactivating");
    //deactivate cell***

    //check if cell has contents
    var val = clickBoard[row][col];
    if (val != 0)
    {
        //yes: white, img
        let coords = imageCoordinates(cell[0], cell[1]);
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(coords[1],coords[0],cellPix,cellPix);
        ctx.drawImage(imageList[val-1], coords[1], coords[0]);
    }
            
    else
    {
        //no: white
        let coords = imageCoordinates(cell[0], cell[1]);
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(coords[1],coords[0],cellPix,cellPix);
    }
}

function imageCoordinates(row, col)
{
    if (row === -1 || col === -1)
        return [-1, -1];

    let d = thickPix;
    let c = cellPix;
    let b = thinPix;
    
    //board is symmetric so decoding x and y is the same process
    let pixelList = [   
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
    
    //returning (y,x) pixel coordinates
    return [ pixelList[row], pixelList[col] ];
}

function getClickCoordinates(window, canvas, event)
{
    const rect = canvas.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x,y];
}

function getCell(x,y,canvas)
{
    const rect = canvas.getBoundingClientRect();
    let width = rect.right - rect.left;
    let height = rect.bottom - rect.top;

    //out-of-canvas 
    if (x < 0 || y < 0 || x >= width || y >= height)
        return [-2,-2]; 
    
    //in-canvas
    else
    {
        var cellRow = getCellFromDistance(y);
        var cellColumn = getCellFromDistance(x);
    }

    //neutral-zone
    if (cellRow === -1 || cellColumn === -1)
        return [-1,-1];
    //active-cell
    else
        return [cellRow,cellColumn];
}

function getCellFromDistance(x)
{
    let d = thickPix;
    let c = cellPix;
    let b = thinPix;

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

export {imageCoordinates, getClickCoordinates, getCell, winnerHighlight};
export {activateCell, deactivateCell, getKeyEntry, getClickType, checkWin};
export {activateCell2,GameObject, deactivateCell2};