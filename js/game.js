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
var gIsfirstClicked = true


function onInit() {

    getRestartImage(NORMAL)

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCountRight: 0,
        secsPassed: 0,
        life: 3,
    }
    gLevel.HIDDEN_MINES = gLevel.MINES

    clearInterval(gTimer)
    gIsfirstClicked = true
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
    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {

            var cellClass = getClassName({ i, j })

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
    var clickedRowIdx = rowIdx
    var clickedColIdx = colIdx

    if (!gBoard[rowIdx][colIdx]) return

    if (!gGame.isOn) return

    if (gBoard[rowIdx][colIdx].isShown) return

    if (gIsfirstClicked) {
        gIsfirstClicked = false

        // startTimer()
        gBoard[rowIdx][colIdx].isShown = true
        gMinesLocation = randomMinesLocation(gBoard)
        setMinesNegsCount(gBoard)
    }

    if (gBoard[rowIdx][colIdx].isMine) {
        elCell.innerHTML = MINE
        gLevel.HIDDEN_MINES--

        if (!gGame.life) {
            gGame.isOn = false
            for (var i = 0; i < gMinesLocation.length; i++) {

                var elCellMine = document.querySelector(`.cell-${gMinesLocation[i].i}-${gMinesLocation[i].j}`)

                elCell.classList.add('uncover-mine')
                elCellMine.classList.add('uncover')
                elCellMine.innerHTML = MINE
            }
            getRestartImage(LOSE)
            stopTimer()
        }
        loseLife()


    } else {

        elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount

        gBoard[rowIdx][colIdx].isShown = true
        gGame.shownCount++


    }
    if (!gBoard[rowIdx][colIdx].minesAroundCount) {
        expandShown(gBoard, elCell, clickedRowIdx, clickedColIdx)
    }

    elCell.classList.add('uncover')
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
        gGame.isOn = false
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


function expandShown(board, elCell, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j].isShown) continue

            gBoard[i][j].isShown = true
            elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount
            gGame.shownCount++
            var elCellNeg = document.querySelector(`.cell-${i}-${j}`)
            elCellNeg.innerText = gBoard[i][j].minesAroundCount
            elCellNeg.classList.add('uncover')

            if (!gBoard[i][j].minesAroundCount) {
                expandShown(gBoard, elCellNeg, i, j)
            }

        }
    }
}

function randomSafeClickCell() {

    var safeClickCellsIdx = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShown || gBoard[i][j].isMine || gBoard[i][j].isMarked) continue
            safeClickCellsIdx.push({ i, j })
        }
    }
    shuffle(safeClickCellsIdx)
    var safeClickCell = safeClickCellsIdx[0]
    return safeClickCell
}

function safeClickCellDisplay() {

    var safeClickCell = randomSafeClickCell()

    console.log(safeClickCell);
    var elCellSafe = document.querySelector(`.cell-${safeClickCell.i}-${safeClickCell.j}`)
    elCellSafe.classList.add('cell-safe')

    return safeClickCell
}

function removeSafeClickDisplay(elCell) {
    console.log('removeSafeClickDisplay', elCell);

    var elCellSafe = document.querySelector(`.cell-${elCell.i}-${elCell.j}`)
    elCellSafe.classList.remove('cell-safe')

}


function safeClickDisplayBehaver() {

    var elCellIdx = safeClickCellDisplay()
    
    setTimeout(() => {
        removeSafeClickDisplay(elCellIdx)
    }, 500)
}

