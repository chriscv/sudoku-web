import * as Calc from './calc.js'

const thickPix = 5;
const cellPix = 32;
const thinPix = 2;

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


//render the baselines puzzle
//return a blank board of zeros with -1 entries for givens
function createBoard(ctx, imageList)
{
    let row1 = [5,3,0, 0,7,0, 0,0,0];
    let row2 = [6,0,0, 1,9,5, 0,0,0];
    let row3 = [0,9,8, 0,0,0, 0,6,0];
    
    let row4 = [8,0,0, 0,6,0, 0,0,3];
    let row5 = [4,0,0, 8,0,3, 0,0,1];
    let row6 = [7,0,0, 0,2,0, 0,0,6];
    
    let row7 = [0,6,0, 0,0,0, 2,8,0];
    let row8 = [0,0,0, 4,1,9, 0,0,5];
    let row9 = [0,0,0, 0,8,0, 0,7,9];
    
    let puzzle = [
                   row1,
                   row2,
                   row3,
                   row4,
                   row5,
                   row6,
                   row7,
                   row8,
                   row9
                 ];
    
    var tempBoard = [ [],[],[],
                      [],[],[],   
                      [],[],[] ];            
    
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
            //value at (row, col)
            var val = puzzle[i][j];
            if (val != 0)
            {
                let cell = [i,j];
                
                //accepts (cellRow, cellCol)
                //returns (y,x) for rendering
                let coords = Calc.imageCoordinates(cell[0], cell[1]);
                
                //we want to render the value's image at (row, col) 
                //which is essentially (y,x)
                //but the canvas drawImage functions accepts (x,y)
                //therefore we reverse the arguments in the call to drawImage
                ctx.fillStyle = 'rgb(200, 200, 200)';
                ctx.fillRect(coords[1],coords[0],cellPix,cellPix);
                ctx.drawImage(imageList[val-1], coords[1], coords[0])

                tempBoard[i][j] = -1; //neutral (given)
            }
            else
                tempBoard[i][j] = 0; //empty cell
        }   
    }    

    return [tempBoard, puzzle];
}

export {createBoard, drawGrid};