'use strict'




function randomMinesLocation(board) {

    var boardCells = shuffledCellsBoard(board)
    var minesLocation = []

    for (var i = 0; i < gLevel.MINES; i++) {
        var mineLocation = board[boardCells[i].i][boardCells[i].j]
        minesLocation.push({i: boardCells[i].i, j: boardCells[i].j})
        mineLocation.isMine = true
    }
    return minesLocation
}



function shuffledCellsBoard(board) {

    var boardCellsIndx = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            boardCellsIndx.push({ i, j })

        }
    }
    shuffle(boardCellsIndx)
    return boardCellsIndx
}

function gameLevel(btnNum) {

    var begginnerLevel = 4
    var mediumLevel = 8
    var expertLevel = 12
    const elHeading = document.querySelector('h3')

    var btnLevelSelected = +btnNum.getAttribute('data-btn-size')

    switch (btnLevelSelected) {
        case begginnerLevel:

            gLevel.SIZE = 4
            gLevel.MINES = 2

            elHeading.innerText = 'Game Level: Begginner'

            break;
        case mediumLevel:

            gLevel.SIZE = 8
            gLevel.MINES = 14

            elHeading.innerText = 'Game Level: Medium'

            break;
        case expertLevel:

            gLevel.SIZE = 12
            gLevel.MINES = 32

            elHeading.innerText = 'Game Level: Expert'

            break;
    }
    onInit()
}

