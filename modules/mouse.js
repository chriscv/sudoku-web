import * as Calc from './calc.js'
import {STATES} from './enums.js'

const CLICKS = {
    outsideCanvas: -2,
    neutralRegion: -1,
    cellRegion: 0
};

function handleMouseClick(event, topState, gameObj, canvas)
{
        var clickBoard = gameObj.clickBoard;
        var activeCell = gameObj.activeCell;

         //get raw input
        let clickCoords = Calc.getClickCoordinates(window, canvas, event);
        
        //filter input
        var currCell = Calc.getCell(clickCoords[0],clickCoords[1], canvas);
        var clickType = Calc.getClickType(currCell[0],currCell[1], clickBoard);
        
        //advance state
        //
        //initial click -- no cell is active
        if (topState === STATES.waiting && clickType === CLICKS.cellRegion)
        {
            //Calc.activateCell(currCell[0],currCell[1],clickBoard,ctx,imageList);
            Calc.activateCell(currCell[0],currCell[1],gameObj);

            gameObj.activeCell[0] = currCell[0];
            gameObj.activeCell[1] = currCell[1];
            topState = STATES.activeCell;
        }
        //secondary click -- a cell is active
        else if (topState === STATES.activeCell)
        {
            //outside click
            if (clickType === CLICKS.outsideCanvas)
            {
                Calc.deactivateCell(activeCell[0],activeCell[1],gameObj);

                topState = STATES.waiting;
            }

            //neutral click
            else if (clickType === CLICKS.neutralRegion)
            {
                //do nothing
            }

            //cell click
            else if (clickType === CLICKS.cellRegion)
            {
                //clicked the active cell
                if (currCell[0]===activeCell[0] && currCell[1]===activeCell[1])
                {
                    Calc.deactivateCell(currCell[0],currCell[1],gameObj);

                    topState = STATES.waiting;
                }
                
                //clicked a new cell
                else
                {  
                    Calc.deactivateCell(activeCell[0],activeCell[1],gameObj);
                    Calc.activateCell(currCell[0],currCell[1],gameObj);
                    
                    gameObj.activeCell[0] = currCell[0];
                    gameObj.activeCell[1] = currCell[1];
                    topState = STATES.activeCell;
                }
            }
        }

        return topState;
}

export {handleMouseClick};