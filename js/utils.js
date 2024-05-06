'use strict'

function playCollectedSound(audioName) {
    let audio = new Audio(audioName)
    audio.play()
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}

function shuffle(items) {
    var randIdx, temp, i

    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);

        temp = items[i];
        items[i] = items[randIdx];
        items[randIdx] = temp;
    }
    return items;
}

function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}
