import * as Module from './module.js';

const cellPix = 32;

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
            var val = puzzle[i][j];
            if (val != 0)
            {
                let cell = [j,i];
                let coords = Module.imageCoordinates(cell[0], cell[1]);
                //render image
                ctx.fillStyle = 'rgb(200, 200, 200)';
                ctx.fillRect(coords[0],coords[1],cellPix,cellPix);
                ctx.drawImage(imageList[val-1], coords[0], coords[1])

                //set -1 to tempBoard
                tempBoard[i][j] = -1;
            }
            else
                tempBoard[i][j] = 0;
        }   
    }    

    return [tempBoard, puzzle];
}

export {createBoard};