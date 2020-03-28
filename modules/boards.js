import { deactivateCell } from "./calc.js";

function resetBoard(gameObj)
{
    var ctx = gameObj.ctx;
    var imageList = gameObj.imageList;
    var clickBoard = gameObj.clickBoard;

    var tempBoard = clickBoard;

    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            var val = tempBoard[i][j];
            if (val === 0)
                continue;

            if (val != -1)
            {
                tempBoard[i][j] = 0;
                deactivateCell(i, j, gameObj);
            }   
        }
    }
    return tempBoard;
}

export {resetBoard};