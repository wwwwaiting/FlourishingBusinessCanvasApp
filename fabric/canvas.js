"use strict";
console.log("canvas.js");

// Global vars
let canvas;
const snapGridSize = 30;
const mainCanvasWidth = 2040;
const mainCanvasHeight = 1320;
let numberOfStickies = 0;
let stickyList = [];
const ogLeft = 173;
let currLeft = ogLeft;
const ogTop = 240;
let currTop = ogTop;
const stickyRadius = 5;
const stickyOgWidth = 100;
const stickyOgHeight = 100;
const stickyPadding = 20;
const stickyMinimumWidth = 80;

// Define colors
const fallbackBackgroundColor = 'rgb(236,232,238)';
const stickyWhite = 'rgb(255,255,255)';
const stickyPink = 'rgb(255,230,252)';
const stickyOrange = 'rgb(255,220,188)';
const stickyYellow = 'rgb(252,255,197)';
const stickyGold = 'rgb(251,254,94)';
const stickyBlue = 'rgb(204,243,255)';
const stickyOlive = 'rgb(222,225,171)';
const stickyBrown = 'rgb(252,215,193)';
const stickyPurple = 'rgb(234,233,253)';
const stickyColors = [stickyWhite, stickyPink, stickyOrange, stickyYellow, stickyGold, stickyBlue, stickyOlive, stickyBrown, stickyPurple]
const stickyShadow = 'rgba(3, 3, 3, 0.1) 0px 10px 20px';
const stickyStroke = 'rgba(255,255,255,0.1)';
const imageUrl = "https://i.imgur.com/4scrQ34.png";

// Initialize the canvas
function initialize_canvas() {
    // Check if there's an existing canvas
    if (canvas) {
        canvas.clear();
        canvas.dispose();
    }
    canvas = new fabric.Canvas('mainCanvas', {
        hoverCursor: 'pointer'
    });

    // Reset global vars
    numberOfStickies = 1;
    stickyList = [];
    setCanvasBgImg();
    currLeft = ogLeft;
    currTop = ogTop;

    // Event listeners down below
    /// updateInfoText for every changes
    // canvas.on({
    //     'object:moving': updateInfoText,
    //     'object:scaling': updateInfoText,
    //     'object:resizing': updateInfoText,
    //     'object:rotating': updateInfoText,
    //     'object:skewing': updateInfoText
    // });
    /// Snap to grid
    canvas.on('object:moving', function (e) {
        // snapToGrid(e.target);
    });
    /// Boundary Check
    canvas.on({
        // 'object:moving': checkBoudningBox,
        // 'object:scaling': checkBoudningBox,
        // 'object:resizing': checkBoudningBox,
        // 'object:rotating': checkBoudningBox,
        // 'object:skewing': checkBoudningBox
    });
    /// Pan and zoom
    canvas.on('mouse:down', function (opt) {
        const evt = opt.e;
        if (!canvas.getActiveObject()) {
        // if (evt.ctrlKey === true) {
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        }
    });
    canvas.on('mouse:move', function (opt) {
        if (this.isDragging) {
            const e = opt.e;
            this.viewportTransform[4] += e.clientX - this.lastPosX;
            this.viewportTransform[5] += e.clientY - this.lastPosY;
            this.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
        }
    });
    canvas.on('mouse:up', function (opt) {
        this.isDragging = false;
        this.selection = true;
        canvas.forEachObject(obj => {
            obj.selectable = true;
            obj.setCoords();
        });
    });
    canvas.on('mouse:wheel', function (opt) {
        const delta = opt.e.deltaY;
        const pointer = canvas.getPointer(opt.e);
        let zoom = canvas.getZoom();
        zoom = zoom + delta / 400;
        if (zoom > 8) zoom = 8;
        if (zoom < 0.5) zoom = 0.5;
        canvas.zoomToPoint({
            x: opt.e.offsetX,
            y: opt.e.offsetY
        }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
        canvas.renderAll()
    });
}

// Used to set / reset background image of the canvas
function setCanvasBgImg() {
    canvas.backgroundColor = fallbackBackgroundColor;
    canvas.renderTop();
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
        backgroundImageOpacity: 1,
        backgroundImageStretch: true,
        crossOrigin: 'anonymous'
    });
}

//the fuction restrict moving borders
function vertical_restrict(sticky){
  let top = sticky.top;
  let left = sticky.left;
  if (top < ogTop) top = ogTop;
  if (top > 1133 - sticky.height * sticky.scaleY) top = 1133 - sticky.height * sticky.scaleY;
  if (top > 932 - sticky.height * sticky.scaleY && top < ((1942 - sticky.height * sticky.scaleY) / 2)) top = 932 - sticky.height * sticky.scaleY;
  if (top < 1010 && top > ((1888 - sticky.height * sticky.scaleY) / 2)) top = 956;
  if (left > (796 - sticky.width * sticky.scaleX) / 2 && left < (3288 - sticky.width * sticky.scaleX) / 2){ //only for the middle part
    if (top < 330) top = 330;
  }
  return top
}

function horizontal_restrict(sticky){
  let top = sticky.top;
  let left = sticky.left;
  if (left < ogLeft) left = ogLeft;
  if (left > 1865 - sticky.width * sticky.scaleX) left = 1865 - sticky.width * sticky.scaleX;

  if (top < ((1942 - sticky.height * sticky.scaleY) / 2)){ // only for the upper part
    if (left > 371 - sticky.width * sticky.scaleX && left < ((796 - sticky.width * sticky.scaleX) / 2)) left = 371 - sticky.width * sticky.scaleX;
    if (left < 425 && left > ((796 - sticky.width * sticky.scaleX) / 2)) left = 425;
    if (left > 838 - sticky.width * sticky.scaleX && left < ((1690 - sticky.width * sticky.scaleX) / 2)) left = 838 - sticky.width * sticky.scaleX;
    if (left < 852 && left > ((1690 - sticky.width * sticky.scaleX) / 2)) left = 852;
    if (left > 1190 - sticky.width * sticky.scaleX && left < ((2392 - sticky.width * sticky.scaleX) / 2)) left = 1190 - sticky.width * sticky.scaleX;
    if (left < 1202 && left > ((2392 - sticky.width * sticky.scaleX) / 2)) left = 1202;
    if (left > 1620 - sticky.width * sticky.scaleX && left < ((3288 - sticky.width * sticky.scaleX) / 2)) left = 1620 - sticky.width * sticky.scaleX;
    if (left < 1668 && left > ((3288 - sticky.width * sticky.scaleX) / 2)) left = 1668;
  }

  return left
}

const Sticky = function () {
    this.shape = getShape();
    this.shape.set('lockRotation', true);
    this.shape.set('lockScalingFlip', true);
    this.shape.set('transparentCorners', false);
    this.shape.set('cornerStyle', 'circle');
    this.shape.setControlVisible('tl', false);
    this.shape.setControlVisible('bl', false);
    this.shape.setControlVisible('br', false);
    this.shape.setControlVisible('tr', false);
    this.shape.setControlVisible('mtr', false);
    this.shape.set('minScaleLimit', 0.5);
    this.stickyId = numberOfStickies;
    this.shape.on('mousedown', doubleClicked([this.shape, this.stickyId], function (obj) {
        $('#editDiv').html('')
        displayEditForm(obj)
    }));
    this.shape.on('mouseup', function () {
        // let left = this.left;
        // let top = this.top;
        // if (top < ogTop) top = ogTop;
        // if (top > 1133 - this.height * this.scaleY) top = 1133 - this.height * this.scaleY;
        let top = vertical_restrict(this);
        let left = horizontal_restrict(this);
        // if (left < ogLeft) left = ogLeft;
        // if (left > 1865 - this.width * this.scaleX) left = 1865 - this.width * this.scaleX;
        this.left = left;
        this.top = top;
        console.log(this.left + ', ' + this.top);
    })
    this.shape.on('scaling', function () {
        let width = this.width * this.scaleX;
        let height = this.height * this.scaleY;
        if (width > stickyMinimumWidth && height > stickyMinimumWidth) {
            this.set('width', width);
            this.set('height', height);
            this.set('scaleX', 1);
            this.set('scaleY', 1);
            const stickyBg = this.item(0);
            stickyBg.set('width', width);
            stickyBg.set('height', height);
            const stickyCt = this.item(1);
            stickyCt.set('width', width - stickyPadding); //20 as padding
            stickyCt.set('height', height - stickyPadding); //20 as padding
        }
        this.set('scaleX', 1);
        this.set('scaleY', 1);
    })
    numberOfStickies++;
}

const getBackgroundJson = function () {
    const backgroundJson = {
        left: 0,
        top: 0, // position offset the center
        originX: 'center',
        originY: 'center', // centered within the group
        fill: stickyYellow,
        shadow: stickyShadow,
        strokeWidth: 3,
        stroke: stickyStroke,
        width: stickyOgWidth,
        height: stickyOgHeight,
        rx: stickyRadius,
        ry: stickyRadius,
    };
    return backgroundJson;
}

const getContentJson = function () {
    const contentJson = {
        // content box position offset & size
        left: 0,
        top: 0, // position offset the center
        originX: 'center',
        originY: 'center',
        width: stickyOgWidth - stickyPadding,
        height: stickyOgHeight - stickyPadding,
        // font styling
        fontFamily: 'Roboto',
        fontSize: 14,
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

const getStickyObjJson = function () {
    const stickyObjJson = {
        left: currLeft,
        top: currTop,
        width: stickyOgWidth,
        height: stickyOgHeight,
        // lockUniScaling: true,
        // lockScalingX: true,
        originX: 'left',
        originY: 'top'
    };
    currLeft += 10;
    currTop += 10;
    return stickyObjJson;
}

function getShape() {
    const textboxValue = $('#textInputBox').val();
    const stickyBackground = new fabric.Rect(new getBackgroundJson());
    const stickyContent = new fabric.Textbox(textboxValue, new getContentJson());
    $('#textInputBox').val("");
    const stickyObj = new fabric.Group([stickyBackground, stickyContent], new getStickyObjJson());
    const stickyCt = stickyObj.item(1);
    stickyCt.set('width', stickyObj.width - stickyPadding); //20 as padding
    stickyCt.set('height', stickyObj.height - stickyPadding); //20 as padding
    return stickyObj;
}

function createSticky() {
    const newSticky = new Sticky();
    canvas.add(newSticky.shape);
    stickyList.push(newSticky);
    // createControl(newSticky);
    canvas.renderAll();
}

function removeAll() {
    initialize_canvas();
    currLeft = ogLeft;
    currTop = ogTop;
}

function removeSticky() {
    // remove sticky in canvas
    const indexToRemove = stickyList.findIndex(s => s.stickyId == this.parentNode.id.split('y')[1]);
    const stickyToRemove = stickyList.find(s => s.stickyId == this.parentNode.id.split('y')[1]).shape;
    canvas.remove(stickyToRemove);
    canvas.discardActiveObject();
    // remove stickyInfo (commented for testing)
    // document.querySelector('#infoBarContainer').removeChild(this.parentNode);
    // remove sticky in list
    stickyList.splice(indexToRemove, 1);
}

// Serialization of the canvas
function revertTransformation() {
    canvas.viewportTransform[0] = 1;    
    canvas.viewportTransform[3] = 1;
    canvas.viewportTransform[4] = 0;
    canvas.viewportTransform[5] = 0;
    canvas.set('width', mainCanvasWidth);
    canvas.set('height', mainCanvasHeight);
    canvas.requestRenderAll();
}

// download popup helper function
function downloadPopup(href, extension) {
    const link = document.createElement('a');
    link.href = href;
    const canvasTitle = $('#canvasTitle').text().trim();
    link.download = canvasTitle.length == 0 ? "untitled canvas" : canvasTitle + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// toJSON
function exportJson() {
    revertTransformation();
    const href = 'data:text/plain;charset=utf-u,' + JSON.stringify(canvas);
    downloadPopup(href, '.json');
}

// toSVG
function exportSvg() {
    revertTransformation();
    const href = 'data:image/svg+xml,' + canvas.toSVG();
    downloadPopup(href, '.svg');
}

// toPNG
function exportPng() {
    revertTransformation();
    const href = canvas.toDataURL("image/png");
    downloadPopup(href, '.png');
}

// toPDF
function exportPdf() {
    revertTransformation();
    const imgData = canvas.toDataURL({
        format: 'jpeg',
        quality: 1
    });
    // console.log(imgData)
    const pdf = new jsPDF({
        orientation: 'portrait', // or 'landscape'
        format: 'letter', // or 'a4'
    });
    pdf.addImage(imgData, 'JPEG', 0, 0);
    const gotCanvasTitle = $('#canvasTitle').text().trim();
    const pdfTitle = gotCanvasTitle.length == 0 ? "untitled canvas" : gotCanvasTitle;
    pdf.save(pdfTitle + ".pdf");
}

// Deserialization of a canvas from JSON
function importJson() {
    const fileInput = document.createElement('input');
    fileInput.type = "file";
    fileInput.accept = ".json,application/json";
    fileInput.style = "display:none";
    document.body.appendChild(fileInput);
    fileInput.click();
    fileInput.onchange = function () {
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

function displayEditForm(obj) {
    console.log(obj);
    const shape = obj[0]
    const stickyId = obj[1]

    const textarea = document.createElement('textarea');
    textarea.rows = '4';
    textarea.cols = '40';
    textarea.id = 'newText';
    textarea.onkeydown = function (e) {
        let key = e.keyCode;
        if (key == '13') {
            shape.item(1).text = $('#newText').val()
            const stickyCt = shape.item(1);
            stickyCt.set('width', shape.width - stickyPadding); //20 as padding
            stickyCt.set('height', shape.height - stickyPadding); //20 as padding
            stickyCt.setCoords()
            canvas.renderAll();
            const editDiv = document.querySelector('#editDiv')
            editDiv.innerHTML = '';
            editDiv.style.display = 'none';
        }
    }
    const editRemoveBtn = document.createElement('button');
    // editRemoveBtn.id = 'editRemoveBtn';
    editRemoveBtn.innerText = 'Remove';
    editRemoveBtn.className = 'editFormBtns';
    editRemoveBtn.onclick = function () {
        // remove sticky in canvas
        const indexToRemove = stickyList.findIndex(s => s.stickyId == stickyId);
        const stickyToRemove = stickyList.find(s => s.stickyId == stickyId).shape;
        canvas.remove(stickyToRemove);
        canvas.discardActiveObject();
        // remove sticky in list
        stickyList.splice(indexToRemove, 1);

        const editDiv = document.querySelector('#editDiv')
        editDiv.innerHTML = ''
        editDiv.style.display = 'none';
    };

    const editColorBtn = document.createElement('button')
    // editColorBtn.id = 'editColorBtn';
    editColorBtn.className = 'editFormBtns'
    editColorBtn.innerText = 'Color';
    editColorBtn.onclick = function () {
        const targetSticky = stickyList.find(s => s.stickyId == stickyId)
        targetSticky.shape._objects[0].set('fill', stickyColors[(stickyColors.indexOf(targetSticky.shape._objects[0].fill) + 1) % (stickyColors.length)])
        canvas.renderAll()
    }

    const closeBtn = document.createElement('button')
    closeBtn.innerText = 'Close'
    closeBtn.className = 'editFormBtns'
    closeBtn.onclick = function () {
        const editDiv = $('#editDiv')
        editDiv.html('')
        editDiv[0].style.display = 'none';

    }
    const btnContainer = document.createElement('div')
    btnContainer.id = 'btnContainer'
    btnContainer.appendChild(editRemoveBtn)
    btnContainer.appendChild(editColorBtn)
    btnContainer.appendChild(closeBtn)


    const editDiv = document.querySelector('#editDiv')
    if (document.querySelector('#editRemoveBtn') == undefined) {
        editDiv.appendChild(textarea);
        editDiv.appendChild(btnContainer);
    }
    editDiv.style.display = 'block';

}

function doubleClicked(obj, handler) {
    return function () {
        if (obj.clicked) handler(obj);
        else {
            obj.clicked = true;
            setTimeout(function () {
                obj.clicked = false;
            }, 500);
        }
    };
};

function handleWindowResize() {
    $(".canvas-container").width($(window).width());
    $(".canvas-container").height($(window).height());
    $("canvas").width($(window).width());
    $("canvas").height($(window).height());
    $('canvas').attr('width', $(window).width());
    $('canvas').attr('height', $(window).height());
    canvas.set('width', $(window).width());
    canvas.set('height', $(window).height());
    canvas.renderAll();
}


// Used to call functions after page is fully loaded.
function main() {
    initialize_canvas();
    canvas.selection = false; // disable group selection
    handleWindowResize();
    canvas.renderAll();
}
$(window).resize(handleWindowResize);
$(document).ready(main);

//###################################################3
// functions that we deleted as we coded. 

// function createControl(sticky) {
//     const stickyInfo = document.createElement('div');
//     stickyInfo.className = 'stickyInfo';
//     stickyInfo.id = 'sticky' + sticky.stickyId;
//     const idText = document.createElement('span');
//     idText.id = 'idText';
//     idText.innerHTML = "ID: " + sticky.stickyId;

//     const changeColor = document.createElement('button');
//     changeColor.id = 'changeColor';
//     changeColor.innerText = 'Color';
//     changeColor.onclick = function () {
//         sticky.shape._objects[0].set('fill', stickyColors[(stickyColors.indexOf(sticky.shape._objects[0].fill) + 1) % (stickyColors.length)])
//         canvas.renderAll();
//     }
//     const removeBtn = document.createElement('button');
//     removeBtn.id = 'removeBtn';
//     removeBtn.innerText = 'Remove';
//     removeBtn.onclick = removeSticky;

//     stickyInfo.appendChild(idText);
//     stickyInfo.appendChild(changeColor);
//     stickyInfo.appendChild(removeBtn);
//     document.querySelector('#infoBarContainer').appendChild(stickyInfo);
// }


// function updateInfoText(e) {
//     for (let i = 0; i < stickyList.length; i++) {
//         const shape = stickyList[i].shape;
//         const id = stickyList[i].stickyId;
//         const infoBarId = '#sticky' + id;
//     }
// }

