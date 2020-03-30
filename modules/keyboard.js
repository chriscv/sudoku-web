import {STATES} from './enums.js'
import * as Calc from './calc.js'
import * as Win from './checkWin.js'

function handleKeyPress(event, topState, gameObj, activeCell, valBoard)
{        
    var ctx = gameObj.ctx;
    var imageList = gameObj.imageList;
    var clickBoard = gameObj.clickBoard;

    //get raw input
    let c = event.keyCode;

    if (topState == STATES.activeCell)
    {
        //filter input -- convert keycode to digit
        var entry = Calc.getKeyEntry(c);
        
        //check for valid input -- a digit
        if (entry != -1)
        {
            //deletion with 0
            if (entry === 0)
            {
                clickBoard[activeCell[0]][activeCell[1]] = entry;
                
                Calc.deactivateCell(activeCell[0],activeCell[1],gameObj);

                topState = STATES.waiting;
            }
            //data entry with 1 to 9
            else
            {
                clickBoard[activeCell[0]][activeCell[1]] = entry; 
                
                Calc.deactivateCell(activeCell[0],activeCell[1],gameObj);
                
                topState = STATES.waiting;
                
                //check for win
                let win = Win.checkWin(clickBoard,valBoard);
                if(win)
                {                    
                    topState = 99; //stop the state machine
                    Calc.winnerHighlight(ctx,clickBoard,imageList);
                }
            }
        }
    }
    return topState;
}

export {handleKeyPress};