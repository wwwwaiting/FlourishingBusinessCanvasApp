const log = console.log;
const canvas = this.__canvas = new fabric.Canvas('mainCanvas');

const $ = function(selector) {return document.querySelector(selector)};

let numberOfStickies = 0;
let stickyList = [];
const ogLeft = 100;
let currLeft = ogLeft;
const ogTop = 150;
let currTop = ogTop;

const Sticky = function() {
    this.shape = getShape();
    this.stickyId = numberOfStickies;
    numberOfStickies++;
}

const shapeJson = function() {
    const shapeJson = {
        left: currLeft,
        top: currTop, // position
        fill: 'red',
        width: 200,
        height: 200, // size
        // angle: 45,
        // opacity: 0.5,
        // selectable: false
    };
    currLeft += 10;
    currTop += 10;
    return shapeJson;
}

function getShape () {
    const shape = new fabric.Rect(new shapeJson());
    return shape;
}

function createSticky() {
    const newSticky = new Sticky();
    canvas.add(newSticky.shape);
    stickyList.push(newSticky);
    createControl(newSticky);
    canvas.renderAll();
}

function removeAll() {
    canvas.clear();
    $('#infoBarContainer').innerHTML = "";
    stickyList = [];
    currLeft = ogLeft;
    currTop = ogTop;
}

function removeSticky() {
    // remove sticky in canvas
    const indexToRemove = stickyList.findIndex(s => s.stickyId == this.parentNode.id.split('y')[1]);
    const stickyToRemove = stickyList.find(s => s.stickyId == this.parentNode.id.split('y')[1]).shape;
    canvas.remove(stickyToRemove);
    canvas.discardActiveObject();
    // remove stickyInfo
    $('#infoBarContainer').removeChild(this.parentNode);
    // remove sticky in list
    stickyList.splice(indexToRemove, 1);
}

function createControl(sticky) {
    const stickyInfo = document.createElement('div');
    stickyInfo.className = 'stickyInfo';
    stickyInfo.id = 'sticky' + sticky.stickyId;
    const idText = document.createElement('span');
    idText.id = 'idText';
    idText.innerHTML = "ID: "+ sticky.stickyId;
    const topPosText = document.createElement('span');
    topPosText.id = 'topPosText';
    topPosText.innerHTML = "Top: "+ sticky.shape.top;
    const leftPosText = document.createElement('span');
    leftPosText.id = 'leftPosText';
    leftPosText.innerHTML = "Left: "+ sticky.shape.left;
    const zIndexText = document.createElement('span');
    zIndexText.id = 'zIndexText';
    zIndexText.innerHTML = "Z-Index: "+ "??";
    const bringFront = document.createElement('button');
    bringFront.id = 'bringFront';
    bringFront.innerText = 'To Front';
    bringFront.onclick = function() {
        log("bring to front");
    }
    const goRight = document.createElement('button');
    goRight.id = 'goRight';
    goRight.innerText = 'Go Right';
    goRight.onclick = function() {
        sticky.shape.set('left', sticky.shape.left + 10);
        canvas.renderAll();
    }
    const goLeft = document.createElement('button');
    goLeft.id = 'goLeft';
    goLeft.innerText = 'Go Left';
    goLeft.onclick = function() {
        sticky.shape.set('left', sticky.shape.left - 10);
        canvas.renderAll();
    }
    const goUp = document.createElement('button');
    goUp.id = 'goUp';
    goUp.innerText = 'Go Up';
    goUp.onclick = function() {
        sticky.shape.set('top', sticky.shape.top - 10);
        canvas.renderAll();
    }
    const goDown = document.createElement('button');
    goDown.id = 'goDown';
    goDown.innerText = 'Go Down';
    goDown.onclick = function() {
        sticky.shape.set('top', sticky.shape.top + 10);
        canvas.renderAll();
    }
    const removeBtn = document.createElement('button');
    removeBtn.id = 'removeBtn';
    removeBtn.innerText = 'Remove';
    removeBtn.onclick = removeSticky;

    stickyInfo.appendChild(idText);
    stickyInfo.appendChild(topPosText);
    stickyInfo.appendChild(leftPosText);
    stickyInfo.appendChild(zIndexText);
    stickyInfo.appendChild(bringFront);
    stickyInfo.appendChild(goRight);
    stickyInfo.appendChild(goLeft);
    stickyInfo.appendChild(goUp);
    stickyInfo.appendChild(goDown);
    stickyInfo.appendChild(removeBtn);
    $('#infoBarContainer').appendChild(stickyInfo);
}

function updateInfoText() {
    for (let i = 0; i < stickyList.length; i++) {
        const shape = stickyList[i].shape;
        const id = stickyList[i].stickyId;
        const infoBarId = '#sticky' + id;
        $(infoBarId + ' #leftPosText').innerHTML = "Top: "+ shape.left;
        $(infoBarId + ' #topPosText').innerHTML = "Top: "+ shape.top;
    }
}

canvas.on({
'object:moving': updateInfoText,
'object:scaling': updateInfoText,
'object:resizing': updateInfoText,
'object:rotating': updateInfoText,
'object:skewing': updateInfoText
});
