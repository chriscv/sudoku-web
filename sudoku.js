//[[8, 28, 6], [8, 30, 3], [5, 32, 2], [2, 34, 1]]
//solutions using thick, cell, thin

const thickPix = 5;
const cellPix = 32;
const thinPix = 2;

document.addEventListener("DOMContentLoaded", () => {

    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');

    //numberImages = 5;
    tempImg = document.createElement("img");
    var t = 5;
    tempImg.src = "./images/" + t.toString() + ".png";

    var imageList = []
    //image must load before drawing
    tempImg.addEventListener('load', function () {
        imageList.push(this);
        //ctx.drawImage(this,thickPix,thickPix);
        console.log(this);
        console.log(imageList[0]);
        startGame(ctx,imageList);
    });

    //debug tool, detect click position
    canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log("x: " + x + " y: " + y);
    });

    //initialize board
    drawGrid(ctx);

    //debug tools
    coords = imageCoordinates(0,0,canvas);
    console.log(coords[0]);
    console.log(coords[1]);

    coords = imageCoordinates(8,2,canvas);
    console.log(coords[0]);
    console.log(coords[1]);

    //while (imageList.length != 1)
    {

    }
    //ctx.drawImage(imageList[0],thickPix,thickPix);
});

function startGame(ctx,imageList)
{
    ctx.drawImage(imageList[0],thickPix,thickPix);
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