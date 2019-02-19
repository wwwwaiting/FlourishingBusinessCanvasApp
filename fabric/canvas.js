const log = console.log;
const canvas = this.__canvas = new fabric.Canvas('mainCanvas');
// canvas.setBackgroundColor('lightgrey');
var imageUrl = "../canvas/img/fbc.png";

//Define
canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
    // Optionally add an opacity lvl to the image
    backgroundImageOpacity: 1,
    // should the image be resized to fit the container?
    backgroundImageStretch: true
});
canvas.selection = false; // disable group selection

window.onload = function () {
    canvas.renderAll();
}

const $ = function(selector) {return document.querySelector(selector)};

let numberOfStickies = 0;
let stickyList = [];
const ogLeft = 100;
let currLeft = ogLeft;
const ogTop = 150;
let currTop = ogTop;
const stickyRadius = 5;

const Sticky = function() {
    this.shape = getShape();
    this.stickyId = numberOfStickies;
    numberOfStickies++;
}

const getBackgroundJson = function() {
    const backgroundJson = {
        left: 0,
        top: 0, // position offset the center
        originX: 'center',
        originY: 'center', // centered within the group
        fill: 'red',
        strokeWidth: 3,
        stroke: 'rgba(100,200,200,0.5)',
        width: 200,
        height: 200, // size
        rx: stickyRadius,
        ry: stickyRadius,
        // angle: 45,
        // opacity: 0.5,
        // selectable: false
    };
    return backgroundJson;
}

const getContentJson = function() {
    const contentJson = {
        // content box position offset & size
        left: 0,
        top: 0, // position offset the center
        originX: 'center',
        originY: 'center',

        // font styling
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 'normal', // or 'bold'
        fontStyle: 'normal', // or 'italic'
        underline: false,
        linethrough: false,
        overline: false,
        // fill: 'rgba(100,200,200,0.5)',

        // paragraph & alignment
        textAlign: 'left', // or 'center', 'right'
        lineHeight: 1.2,

        // other properties
        editable: true,
        // selectable: false
    };
    return contentJson;
}

const getStickyObjJson = function() {
    const stickyObjJson = {
        left: currLeft,
        top: currTop,
    };
    currLeft += 10;
    currTop += 10;
    return stickyObjJson;
}

function getShape () {
    const stickyBackground = new fabric.Rect(new getBackgroundJson());
    const stickyContent = new fabric.Textbox("Example\nsentence.", new getContentJson());
    const stickyObj = new fabric.Group([stickyBackground, stickyContent], new getStickyObjJson());
    return stickyObj;
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
    canvas.setBackgroundColor('lightgrey');
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
    const editText = document.createElement('button');
    editText.id = 'editText';
    editText.innerText = 'Edit';
    editText.onclick = function() {
        sticky.shape.item(1).enterEditing();
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
    stickyInfo.appendChild(editText);
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

// Serialization of the canvas

// download popup helper function
function downloadPopup(href, extension) {
    const link = document.createElement('a');
    link.href = href;
    link.download = $('#canvasTitle').innerText + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// toJSON
function exportJson() {
    log(JSON.stringify(canvas));
    const href = 'data:text/plain;charset=utf-u,' + JSON.stringify(canvas);
    downloadPopup(href, '.json');
}

// toSVG
function exportSvg() {
    const href = 'data:image/svg+xml,' + canvas.toSVG();
    downloadPopup(href, '.svg');
}

// toPNG
function exportPng() {
    const href = canvas.toDataURL("image/png");
    downloadPopup(href, '.png');
}

// toPDF
function exportPdf() {
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
        orientation: 'portrait', // or 'landscape'
        format: 'letter', // or 'a4'
      });
    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save($('#canvasTitle').innerText + ".pdf");
}

// Deserialization of a canvas from JSON
function importJson() {
    const fileInput = document.createElement('input');
    fileInput.type = "file";
    fileInput.accept = ".json,application/json";
    fileInput.style = "display:none";
    document.body.appendChild(fileInput);
    fileInput.click();
    fileInput.onchange = function() {
        const importedJson = fileInput.files[0];
        const reader = new FileReader();
        if (importedJson) {
            reader.readAsText(importedJson);
        }
        if (importedJson.size > 10485760) { // > 10MB
            alert("File too large. Maximum upload size is 10MB.");
        } else {
            reader.addEventListener("load", function () {
                loadJsonToCanvas(reader.result);
            }, false);
        }
    }
    document.body.removeChild(fileInput);
}

function loadJsonToCanvas(jsonOutput) {
    canvas.loadFromJSON(jsonOutput);
}