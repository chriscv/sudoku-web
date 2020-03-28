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

export {checkWin};
