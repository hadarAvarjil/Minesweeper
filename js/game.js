'use strict'

const MINE = '<img src="img/poop.png" class="img">'
const FLAG = '<img src="img/flag.png" class="img">'

const LOSE = 'img/lose.png'
const WIN = 'img/win.png'
const NORMAL = 'img/normal.png'

var gLevel = {
    SIZE: 8,
    MINES: 14,
    HIDDEN_MINES: 14,
}

var gBoard
var gGame
var gTimer
var gMinesLocation
var gIsfirstClicked = false


function onInit() {

    getRestartImage(NORMAL)

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCountRight: 0,
        secsPassed: 0,
        life: 3,
    }

    clearInterval(gTimer)
    gIsfirstClicked = false
    document.querySelector('h2').innerText = `Time: ${0}s`

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
        gLevel.HIDDEN_MINES--

        if (!gGame.life) {
            gGame.isOn = false
            for (var i = 0; i < gMinesLocation.length; i++) {

                var elCellMine = document.querySelector(`.cell-${gMinesLocation[i].i}-${gMinesLocation[i].j}`)

                elCellMine.innerHTML = MINE
                elCellMine.classList.add('uncover')
                elCell.classList.add('uncover-mine')
            }
            getRestartImage(LOSE)
            stopTimer()
        }
        loseLife()


    } else {

        elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount

        gBoard[rowIdx][colIdx].isShown = true
        gGame.shownCount++

        elCell.classList.add('uncover')

    }

    if (!gIsfirstClicked) {
        gIsfirstClicked = true
        startTimer()
    }
    checkGameOver()
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

    if ((gGame.shownCount === ((+gLevel.SIZE) ** 2 - gLevel.MINES)) && (gGame.markedCountRight === gLevel.HIDDEN_MINES)) {
        getRestartImage(WIN)
        stopTimer()
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

function lifeElmDisplayReturn() {
    const life1 = document.querySelector('.life1')
    const life2 = document.querySelector('.life2')
    const life3 = document.querySelector('.life3')

    life1.classList.remove('hidden')
    life2.classList.remove('hidden')
    life3.classList.remove('hidden')
}

function startTimer() {
    var start = Date.now()
    var elTimer = document.querySelector('h2')

    gTimer = setInterval(function () {
        const diff = Date.now() - start
        const secs = parseInt(diff / 1000)

        var ms = (diff - secs * 1000) + ''
        ms = ms.padStart(3, '0')

        elTimer.innerText = `Time: ${secs}.${ms}s`;
    }, 29);
}

function stopTimer() {
    clearInterval(gTimer)
}

