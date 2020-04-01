const thickPix = 5;
const cellPix = 32;
const thinPix = 2;

const CLICKS = {
    outsideCanvas: -2,
    neutralRegion: -1,
    cellRegion: 0
};

class GameObject {
    constructor(ctx, clickBoard, imageList, activeCell, valBoard) {
      this.ctx = ctx;
      this.clickBoard = clickBoard;
      this.imageList = imageList;
      this.activeCell = activeCell;
      this.valBoard = valBoard;
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

function fillCell(row,col,color,ctx)
{
    if (color === "white")
    {
        ctx.fillStyle = 'rgb(255, 255, 255)';
    }
    else if (color === "green")
    {
        ctx.fillStyle = 'rgb(0, 128, 0)';
    }
    else if (color === "grey")
    {
        ctx.fillStyle = 'rgb(200, 200, 200)';
    }

    var coords = imageCoordinates(row,col);
    ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
}

function drawToCell(image,row,col,ctx)
{
    var coords = imageCoordinates(row,col);
    ctx.drawImage(image,coords[0],coords[1]);    
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
                fillCell(i,j,"green",ctx);
                drawToCell(imageList[val-1],i,j,ctx);
            }
        }
    }
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
        fillCell(row,col,"green",ctx);
        drawToCell(imageList[val-1],row,col,ctx);
    }
            
    else
    {
        //no: green
        fillCell(row,col,"green",ctx);
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
        fillCell(row,col,"white",ctx);
        drawToCell(imageList[val-1],row,col,ctx);
    }
            
    else
    {
        //no: white
        fillCell(row,col,"white",ctx);
    }
}

function imageCoordinates(row, col)
{
    console.log(row);
    console.log(col);
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
    
    //returning (x,y) pixel coordinates -- origin is top left
    return [ pixelList[col], pixelList[row] ];
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

    //if (aVeryLongExpression === anotherVeryLongExpressionSuperLongExpression);
        //code

    //switch (aVeryLongExpression)
        //case (equality with anotherVeryLongExpressionSuperLongExpression):
            //code
            //break;
        //case (another very long expression):
            //code
            //break;
        //...
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
export {activateCell, deactivateCell, getKeyEntry, getClickType};
export {activateCell2,GameObject, deactivateCell2, fillCell, drawToCell};