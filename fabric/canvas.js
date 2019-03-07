"use strict";
console.log("canvas.js");

// Global vars
let canvas = new fabric.Canvas('mainCanvas');;
let stickyCounter;
const snapGridSize = 30;
const mainCanvasWidth = 2040;
const mainCanvasHeight = 1320;

// Define colors
const fallbackBackgroundColor = 'rgb(236,232,238)';
const stickyPink = 'rgb(255,230,252)';
const stickyOrange = 'rgb(255,220,188)';
const stickyYellow = 'rgb(252,255,197)';
const stickyGold = 'rgb(251,254,94)';
const stickyBlue = 'rgb(204,243,255)';
const stickyOlive = 'rgb(222,225,171)';
const stickyBrown = 'rgb(252,215,193)';
const stickyPurple = 'rgb(234,233,253)';
const stickyColors = [stickyPink, stickyOrange, stickyYellow, stickyGold, stickyBlue, stickyOlive, stickyBrown, stickyPurple]
const stickyShadow = 'rgba(3, 3, 3, 0.1) 0px 10px 20px';
const stickyStroke = 'rgba(100,200,200,0.1)';
const imageUrl = "https://i.imgur.com/TROjQTF.png";

// Initialize the canvas
function initialize() {
    if (canvas) {
        canvas.clear();
        canvas.dispose();
    }
    canvas = new fabric.Canvas('mainCanvas');
}

//Define
function setCanvasBgImg() {
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
        // Optionally add an opacity lvl to the image
        backgroundImageOpacity: 1,
        // should the image be resized to fit the container?
        backgroundImageStretch: true,
        crossOrigin: 'anonymous'
    });
}
canvas.selection = false; // disable group selection

window.onload = function () {
    setCanvasBgImg();
    canvas.renderAll();
}

let numberOfStickies = 0;
let stickyList = [];
const ogLeft = 100;
let currLeft = ogLeft;
const ogTop = 150;
let currTop = ogTop;
const stickyRadius = 5;

const Sticky = function() {
    this.shape = getShape();
    // this.shape.hasControls = false;
    this.stickyId = numberOfStickies;
    this.shape.on('mousedown', doubleClicked([this.shape,this.stickyId], function (obj) {
        displayEditForm(obj)
    }));
    this.shape.on('moving', function() {
              let left = this.left;
              let top = this.top;
              if (top < 240) {top = 240}
              if (top > 1133 - this.height * this.scaleY) {top = 1133 - this.height * this.scaleY}
              if (left < 173) {left = 173}
              if (left > 1865 - this.width * this.scaleX) {left = 1865 - this.width * this.scaleX}
              this.left = left;
              this.top = top;
        console.log(this.left + ', ' + this.top);
    })
    this.shape.on('scaling', function() {
              let width = this.width * this.scaleX;
              let height = this.height * this.scaleY;
              this.set('width', width);
              this.set('height', height);
              this.set('scaleX', 1);
              this.set('scaleY', 1);
              const stickyBg = this.item(0);
              stickyBg.set('width', width);
              stickyBg.set('height', height);
              const stickyCt = this.item(1);
              stickyCt.set('width', width - 20); //20 as padding
              stickyCt.set('height', height - 20);//20 as padding
    })
    numberOfStickies++;
}

const getBackgroundJson = function() {
    const backgroundJson = {
        left: 0,
        top: 0, // position offset the center
        originX: 'center',
        originY: 'center', // centered within the group
        fill: stickyYellow,
        shadow: stickyShadow,
        strokeWidth: 3,
        stroke: stickyStroke,
        width: 100,
        height: 100, // size
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
        height: 80,
        width: 80,
        originX: 'center',
        originY: 'center',
        absolutePositioned: true,
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
    const textboxValue = $('#textInputBox').val();
    const stickyBackground = new fabric.Rect(new getBackgroundJson());
    const stickyContent = new fabric.Textbox(textboxValue, new getContentJson());
    $('#textInputBox').val("");
    const stickyObj = new fabric.Group([stickyBackground, stickyContent], new getStickyObjJson());
    const stickyCt = stickyObj.item(1);
    stickyCt.set('width', stickyObj.width - 20); //20 as padding
    stickyCt.set('height', stickyObj.height - 20);//20 as padding
    return stickyObj;
}

function createSticky() {
    const newSticky = new Sticky();
    canvas.add(newSticky.shape);
    stickyList.push(newSticky);
    createControl(newSticky);
    // canvas.add(textasd)
    canvas.renderAll();
}

function removeAll() {
    canvas.clear();
    // canvas.setBackgroundColor('lightgrey');
    setCanvasBgImg();
    $('#infoBarContainer').html("");
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
    document.querySelector('#infoBarContainer').removeChild(this.parentNode);
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
    // const zIndexText = document.createElement('span');
    // zIndexText.id = 'zIndexText';
    // zIndexText.innerHTML = "Z-Index: "+ "??";

    // const bringFront = document.createElement('button');
    // bringFront.id = 'bringFront';
    // bringFront.innerText = 'To Front';
    // bringFront.onclick = function() {
    //     console.log("bring to front");
    // }
    // const editText = document.createElement('button');
    // editText.id = 'editText';
    // editText.innerText = 'Edit';
    // editText.onclick = function() {
    //     // sticky.shape.item(1).enterEditing();
    //     const textInput = document.createElement('input')
    //     textInput.id = 'textInput';
    //     textInput.className = 'input'
    //     textInput.type = 'text';
    //     const submit = document.createElement('input')
    //     submit.id = 'submitInput'
    //     submit.type = 'submit';
    //     submit.className = 'input'
    //     submit.value = 'Done Editing'
    //     submit.onsubmit = function() {
    //         const textValue = $('#textInput').val()
    //         console.log(textValue);
    //     }
    //     const edit = document.querySelector('#editPop')
    //     edit.appendChild(textInput);
    //     edit.appendChild(submit);
    // }

    // const bringFront = document.createElement('button');
    // bringFront.id = 'bringFront';
    // bringFront.innerText = 'To Front';
    // bringFront.onclick = function() {
    //     console.log("bring to front");
    // }
    // const editText = document.createElement('button');
    // editText.id = 'editText';
    // editText.innerText = 'Edit';
    // editText.onclick = function() {
    //     sticky.shape.item(1).enterEditing();
    // }

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
    const changeColor = document.createElement('button');
    changeColor.id = 'changeColor';
    changeColor.innerText = 'Color';
    changeColor.onclick = function() {
        // const colors = ['maroon', 'red', 'purple', 'lime', 'yellow', 'teal', 'aqua'];
        // const colorDict = {'maroon':0, 'red':1, 'purple':2, 'lime':3, 'yellow':4, 'teal':5, 'aqua':6};
        // const newColor = colors[(colorDict[sticky.shape._objects[0].fill] + 1) % 7]
        sticky.shape._objects[0].set('fill', stickyColors[(stickyColors.indexOf(sticky.shape._objects[0].fill)+1)%(stickyColors.length)])
        canvas.renderAll();
    }
    const removeBtn = document.createElement('button');
    removeBtn.id = 'removeBtn';
    removeBtn.innerText = 'Remove';
    removeBtn.onclick = removeSticky;

    stickyInfo.appendChild(idText);
    stickyInfo.appendChild(topPosText);
    stickyInfo.appendChild(leftPosText);
    // stickyInfo.appendChild(zIndexText);

    // stickyInfo.appendChild(bringFront);
    // stickyInfo.appendChild(editText);

    stickyInfo.appendChild(goLeft);
    stickyInfo.appendChild(goRight);
    stickyInfo.appendChild(goUp);
    stickyInfo.appendChild(goDown);
    stickyInfo.appendChild(changeColor);
    stickyInfo.appendChild(removeBtn);
    document.querySelector('#infoBarContainer').appendChild(stickyInfo);
}

function updateInfoText() {
    for (let i = 0; i < stickyList.length; i++) {
        const shape = stickyList[i].shape;
        const id = stickyList[i].stickyId;
        const infoBarId = '#sticky' + id;
        $(infoBarId + ' #leftPosText').html("Left: "+ shape.left);
        $(infoBarId + ' #topPosText').html("Top: "+ shape.top);
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
    link.download = $('#canvasTitle').text() + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// toJSON
function exportJson() {
    console.log(JSON.stringify(canvas));
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
    const imgData = canvas.toDataURL({
        format: 'jpeg',
        quality: 1
      });
    console.log(imgData)
    const pdf = new jsPDF({
        orientation: 'portrait', // or 'landscape'
        format: 'letter', // or 'a4'
      });
    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save($('#canvasTitle').text() + ".pdf");
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

function displayEditForm(obj) {
    shape = obj[0]
    stickyId = obj[1]

    const textarea = document.createElement('textarea');
    textarea.rows = '4';
    textarea.cols = '40';
    textarea.id = 'newText';
    textarea.onkeydown = function(e) {
        let key = e.keyCode;
        if (key == '13') {
            shape.remove(shape.item(1));
            const text = new fabric.Textbox($('#newText').val(), {
                left: shape.left,
                top: shape.top,
                fontSize: 20,
                fontFamily: 'Roboto'
            })

            shape.addWithUpdate(text);
            canvas.renderAll();
            const editDiv = document.querySelector('#editDiv')
            editDiv.removeChild(editDiv.children[0]);
            editDiv.removeChild(editDiv.children[0]);
            editDiv.style.display = 'none';

        }
    }
    const editRemoveBtn = document.createElement('button');
    editRemoveBtn.id = 'editRemoveBtn';
    editRemoveBtn.innerText = 'Remove';
    editRemoveBtn.onclick = function() {
        // remove sticky in canvas
        const indexToRemove = stickyList.findIndex(s => s.stickyId == stickyId);
        const stickyToRemove = stickyList.find(s => s.stickyId == stickyId).shape;
        canvas.remove(stickyToRemove);
        canvas.discardActiveObject();
        // remove stickyInfo
        document.querySelector('#infoBarContainer').removeChild( document.querySelector('#sticky' + stickyId) );
        // remove sticky in list
        stickyList.splice(indexToRemove, 1);

        const editDiv = document.querySelector('#editDiv')
        editDiv.removeChild(editDiv.children[0]);
        editDiv.removeChild(editDiv.children[0]);
        editDiv.style.display = 'none';
    };

    const editDiv = document.querySelector('#editDiv')
    if ( document.querySelector('#editRemoveBtn') == undefined){
      editDiv.appendChild(textarea);
      editDiv.appendChild(editRemoveBtn);
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
