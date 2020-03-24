const thickPix = 5;
const cellPix = 32;
const thinPix = 2;

function getKeyEntry(c, topState)
{
    let cellClicked = 2;

    if( (( c >= 49 && c <= 57 ) || ( c >= 97 && c <= 105 ))
            && topState === cellClicked)
    {
        //console.log(coords[0]);
        //console.log(coords[1]);
        
        //clever way: 
        //tempImg = imageList[c-49]
        var entry;
        if (c === 49 || c === 97) //1, one code is for numpad
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
    else
        entry = -1;
    
    return entry;
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
    This code was moved to prevent double function call
    tempCell = cellSelected(x,y);
    if (tempCell[0] === -1 || tempCell[1] === -1)
        return 3; //neutralClick
    else
        return 4; //cellClick
    */


}
//get click coordinates relative to canvas position (centered)
//called inside the callback function for the click event
function getClickCoordinates(window, canvas, event)
{
    const rect = canvas.getBoundingClientRect();
    
    //check if the click was not in the canvas
    if (event.clientX < rect.left || event.clientX >= rect.right)
        return [-1,-1];
    else if (event.clientY < rect.top || event.clientY >= rect.bottom)
        return [-1,-1];
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
    let boxPix = 3*cellPix+2*thinPix;

    //thick bars
    ctx.fillRect(thickPix+boxPix, 0, thickPix, 320); //vertical left
    ctx.fillRect(2*(thickPix+boxPix),0,thickPix,320); //vertical right
    ctx.fillRect(0,thickPix+boxPix, 320, thickPix); //horizontal top
    ctx.fillRect(0,2*(thickPix+boxPix),320,thickPix); //horizontal bottom

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
//e.g. the top left pixel position of the cell
function imageCoordinates(row, col)
{
    if (row === -1 || col === -1)
        return [-1,-1]

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
    
    return [ pixelList[row], pixelList[col] ];
}

//accept coordinates of the canvas click
//returns the cell of interest [0,0] to [8,8]
//return [-1,y] or [x,-1] if neutral area click
function cellSelected(x,y)
{
    //board is symmetric so decoding x and y is the same process
    let cellX = findCell(x);
    let cellY = findCell(y);
    return [cellX, cellY]
}

function findCell(x)
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

export {drawGrid, getClickCoordinates, getClickType, cellSelected};
export {imageCoordinates, getKeyEntry};
//change names of imageCoordinates and cellSelected
//getImgCoords
//getCell