const log = console.log;
const canvas = this.__canvas = new fabric.Canvas('mainCanvas');
// canvas.setBackgroundColor('lightgrey');
const imageUrl = "../canvas/img/fbc.png";

//Define
function setCanvasBgImg() {
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
        // Optionally add an opacity lvl to the image
        backgroundImageOpacity: 1,
        // should the image be resized to fit the container?
        backgroundImageStretch: true
    });
}
canvas.selection = false; // disable group selection

window.onload = function () {
    setCanvasBgImg();
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
    this.shape.on('mousedown', doubleClicked([this.shape,this.stickyId], function (obj) {
        displayEditForm(obj)
    }));
    numberOfStickies++;
}

const getBackgroundJson = function() {
    const backgroundJson = {
        left: 0,
        top: 0, // position offset the center
        originX: 'center',
        originY: 'center', // centered within the group
        fill: 'yellow',
        strokeWidth: 3,
        stroke: 'rgba(100,200,200,0.5)',
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
    const textboxValue = $('#textInputBox').value;
    const stickyBackground = new fabric.Rect(new getBackgroundJson());
    const stickyContent = new fabric.Textbox(textboxValue, new getContentJson());
    $('#textInputBox').value = "";
    const stickyObj = new fabric.Group([stickyBackground, stickyContent], new getStickyObjJson());
    return stickyObj;
}

function createSticky() {
    const newSticky = new Sticky();
    newSticky.shape.on('moving', function() {
        log(this.left + ', ' + this.top);
    })
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
    // const zIndexText = document.createElement('span');
    // zIndexText.id = 'zIndexText';
    // zIndexText.innerHTML = "Z-Index: "+ "??";

    // const bringFront = document.createElement('button');
    // bringFront.id = 'bringFront';
    // bringFront.innerText = 'To Front';
    // bringFront.onclick = function() {
    //     log("bring to front");
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
    //         const textValue = $('#textInput').value
    //         console.log(textValue);
    //     }
    //     const edit = $('#editPop')
    //     edit.appendChild(textInput);
    //     edit.appendChild(submit);
    // }

    // const bringFront = document.createElement('button');
    // bringFront.id = 'bringFront';
    // bringFront.innerText = 'To Front';
    // bringFront.onclick = function() {
    //     log("bring to front");
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
        const colors = ['maroon', 'red', 'purple', 'lime', 'yellow', 'teal', 'aqua'];
        const colorDict = {'maroon':0, 'red':1, 'purple':2, 'lime':3, 'yellow':4, 'teal':5, 'aqua':6};
        const newColor = colors[(colorDict[sticky.shape._objects[0].fill] + 1) % 7]
        sticky.shape._objects[0].set('fill', newColor)
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
    $('#infoBarContainer').appendChild(stickyInfo);
}

function updateInfoText() {
    for (let i = 0; i < stickyList.length; i++) {
        const shape = stickyList[i].shape;
        const id = stickyList[i].stickyId;
        const infoBarId = '#sticky' + id;
        $(infoBarId + ' #leftPosText').innerHTML = "Left: "+ shape.left;
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
            const text = new fabric.Textbox($('#newText').value, {
                left: shape.left,
                top: shape.top,
                fontSize: 20,
                fontFamily: 'Roboto'
            })

            shape.addWithUpdate(text);
            canvas.renderAll();
            const editDiv = $('#editDiv')
            editDiv.removeChild(editDiv.children[0]);
            editDiv.style.display = 'none';

        }
    }
    const editRemoveBtn = document.createElement('button');
    editRemoveBtn.id = 'removeBtn';
    editRemoveBtn.innerText = 'Remove';
    editRemoveBtn.onclick = function() {
        // remove sticky in canvas
        const indexToRemove = stickyList.findIndex(s => s.stickyId == stickyId);
        const stickyToRemove = stickyList.find(s => s.stickyId == stickyId).shape;
        canvas.remove(stickyToRemove);
        canvas.discardActiveObject();

        const editDiv = $('#editDiv')
        editDiv.removeChild(editDiv.children[0]);
        editDiv.style.display = 'none';

        // remove stickyInfo
        $('#infoBarContainer').removeChild( $('#sticky' + stickyId) );
        // remove sticky in list
        stickyList.splice(indexToRemove, 1);
    };

    const editDiv = $('#editDiv')
    editDiv.appendChild(textarea);
    editDiv.appendChild(editRemoveBtn);
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
