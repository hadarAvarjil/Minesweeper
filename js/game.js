'use strict'

var gBoard

const MINE = '<img src="img/poop.png" class="img">'
const FLAG = '<img src="img/flag.png" class="img">'

const LOSE = 'img/lose.png'
const WIN = 'img/win.png'
const NORMAL = 'img/normal.png'

var gLevel = {
    SIZE: 8,
    MINES: 14
}

var gGame

var gMinesLocation

// gIsfirstClicked =


function onInit() {
    getRestartImage(NORMAL)

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCountRight: 0,
        secsPassed: 0,
        life: 3,
    }

    lifeElmDisplayReturn()

    gBoard = buildBoard()
    renderBoard(gBoard)
}


function buildBoard() {
    const size = gLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }

    }

    gMinesLocation = randomMinesLocation(board)
    setMinesNegsCount(board)

    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {

            const cell = board[i][j]
            var cellClass = getClassName({ i, j })
            // const className = cell.isShown ? 'uncover' : 'cover'

            strHTML += `<td 
                onclick="onCellClicked(this, ${i}, ${j})"
                oncontextmenu="onCellMarked(this, ${i}, ${j})"
                class=${cellClass}></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function renderCell(location, value) {

    const elCell = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`)
    elCell.innerHTML = value
}



function onCellClicked(elCell, rowIdx, colIdx) {

    if (!gBoard[rowIdx][colIdx]) return

    if (!gGame.isOn) return

    if (gBoard[rowIdx][colIdx].isMine) {
        elCell.innerHTML = MINE
        elCell.classList.add('uncover')

        if (!gGame.life) {
            gGame.isOn = false
            for (var i = 0; i < gMinesLocation.length; i++) {

                var elCellMine = document.querySelector(`.cell-${gMinesLocation[i].i}-${gMinesLocation[i].j}`)

                elCellMine.innerHTML = MINE
                elCellMine.classList.add('uncover')
                elCell.classList.add('uncover-mine')
            }
            getRestartImage(LOSE)
        }
        loseLife()



    } else {

        elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount

        gBoard[rowIdx][colIdx].isShown = true
        gGame.shownCount++

        elCell.classList.add('uncover')

        
        
    }
    checkGameOver()

}


function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            var numOfNeighbors = countNeighbors(i, j, board)

            board[i][j].minesAroundCount = numOfNeighbors


        }
    }
}


function countNeighbors(rowIdx, colIdx, mat) {
    var neighborsCount = ''

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function onCellMarked(elCell, rowIdx, colIdx) {

    window.addEventListener('contextmenu', function (e) {
        e.preventDefault()
    }, false);

    if ((gBoard[rowIdx][colIdx]).isShown || elCell.innerHTML === MINE || !gGame.isOn) return

    if (gBoard[rowIdx][colIdx].isMarked) {
        if (gBoard[rowIdx][colIdx].isMine) gGame.markedCountRight--

        elCell.innerHTML = ''
        gBoard[rowIdx][colIdx].isMarked = false

    } else {
        elCell.innerHTML = FLAG
        gBoard[rowIdx][colIdx].isMarked = true
    }


    if (gBoard[rowIdx][colIdx].isMarked && gBoard[rowIdx][colIdx].isMine) {
        gGame.markedCountRight++

    }

    checkGameOver()

}

function checkGameOver() {

    if ((gGame.shownCount === ((+gLevel.SIZE) ** 2 - gLevel.MINES)) && (gGame.markedCountRight === gLevel.MINES)) {
        getRestartImage(WIN)
    }
}

function getRestartImage(restartBtnImage) {

    const restartBtn = document.querySelector('.img-btn')
    restartBtn.src = restartBtnImage
}

function loseLife() {
    const fullLife = 3
    const twoLife = 2
    const oneLife = 1

    if (gGame.life === fullLife) {
        const thirdLife = document.querySelector('.life3')
        thirdLife.classList.add('hidden')
        gGame.life--
        return
    }

    if (gGame.life === twoLife) {
        const thirdLife = document.querySelector('.life2')
        thirdLife.classList.add('hidden')
        gGame.life--
        return
    }

    if (gGame.life === oneLife) {
        const thirdLife = document.querySelector('.life1')
        thirdLife.classList.add('hidden')
        gGame.life--
    }

}

function lifeElmDisplayReturn(){
    const life1 = document.querySelector('.life1' )
    const life2 = document.querySelector('.life2' )
    const life3 = document.querySelector('.life3' )

    life1.classList.remove('hidden')
    life2.classList.remove('hidden')
    life3.classList.remove('hidden')
}

