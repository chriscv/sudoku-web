//[[8, 28, 6], [8, 30, 3], [5, 32, 2], [2, 34, 1]]
//solutions using thick, cell, thin
//requires a set of images that match the cellPix dimensions (square)
//1.png, 2.png, ..., 9.png

const thickPix = 5;
const cellPix = 32;
const thinPix = 2;
let imageLoadedCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    
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
            startGame(canvas, ctx, imageList);
        });
    }   

});

function startGame(canvas, ctx, imageList)
{
    imageLoadedCount++;
    if (imageLoadedCount === 9)
    {
        //ctx.drawImage(imageList[0],thickPix,thickPix);
        activeCell = [];

        //debug tool, detect click position
        canvas.addEventListener('click', function () {
            
            //get click coordinates relative to canvas position (centered)
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            //console.log("x: " + x + " y: " + y);

            //find which cell was clicked on [0,0] to [8,8]
            cell = cellSelected(x,y);

            //get the coordinates of drawing into that cell
            coords = imageCoordinates(cell[0], cell[1], this);
            
            //ctx.fillStyle = 'rgb(0, 128, 0)';
            //ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
            //console.log(coords);
            //ctx.drawImage(imageList[0],coords[0],coords[1]);

            if (activeCell.length > 0)
            {
                tempCell = activeCell.pop();
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(tempCell[0],tempCell[1],cellPix,cellPix);
            }
            
            ctx.fillStyle = 'rgb(0, 128, 0)';
            ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
            activeCell.push(coords);

            //tofix: clicking on inactive regions (e.g. on a border line)
        });

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
function imageCoordinates(row, col, canvas)
{
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

//accept mouse coordinates
//returns the cell of interest [0,0] to [8,8]
function cellSelected(x,y)
{
    cellX = findCell(x);
    cellY = findCell(y);

    console.log(cellX);
    console.log(cellY);

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
}