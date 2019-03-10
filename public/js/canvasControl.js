"use strict";
console.log("canvasControl.js");

// Global vars
let canvas;
let backUpSticky;
const canvasMaxZoom = 8;
const canvasMinZoom = 0.3;
const mainCanvasWidth = 2040;
const mainCanvasHeight = 1320;
let numberOfStickies = 0;
let stickyList = [];
const ogLeft = 173;
let currLeft = ogLeft;
const ogTop = 240;
let currTop = ogTop;
const stickyRadius = 3;
const stickyOgWidth = 100;
const stickyOgHeight = 100;
const stickyPadding = 20;
const stickyMinimumWidth = 80;
const stickyMinimumHeight = 80;
const stickyMaxWidth = 185;
const stickyMaxHeight = 175;


// Define colors
const fallbackBackgroundColor = 'rgb(0,104,88)';
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
const imageUrl = "https://i.imgur.com/MoXPVzV.png";

// Initialize the canvas
function initialize_canvas() {
    // Check if there's an existing canvas
    if (canvas) {
        canvas.clear();
        canvas.dispose();
    }
    canvas = new fabric.Canvas('mainCanvas', {
        canvasId: 0,
        hoverCursor: 'pointer'
    });
    // Reset global vars
    numberOfStickies = 0;
    stickyList = [];
    setCanvasBgImg();
    currLeft = ogLeft;
    currTop = ogTop;

    /// Pan and zoom
    canvas.on('mouse:down', function (opt) {
        const evt = opt.e;
        if (!canvas.getActiveObject()) {
            // if (evt.ctrlKey === true) {
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        } else {
            // let temp = canvas.getActiveObject()
            // let temp0 = temp.item(0);
            // let temp1 = temp.item(1);
            // backUpSticky = [temp.height, temp.width, temp.left, temp.top,
            //                 temp0.height, temp0.width, temp0.left, temp0.top,
            //                 temp1.height, temp1.width, temp1.left, temp1.top];

        }
        $('#editDiv').html('')
    });
    canvas.on('mouse:move', function (opt) {
        if (this.isDragging) {
            canvas.setCursor('move');
            const e = opt.e;
            this.viewportTransform[4] += e.clientX - this.lastPosX;
            this.viewportTransform[5] += e.clientY - this.lastPosY;
            this.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
        }
    });
    canvas.on('mouse:up', function (opt) {
        // TODO: when mouse:up, send data to backend
        if (canvas.getActiveObject()){
            let sticky = canvas.getActiveObject();
            console.log(backUpSticky);
            console.log(sticky);
            // sticky.height = backUpSticky[0];
            // sticky.width = backUpSticky[1];
            // sticky.left = backUpSticky[2];
            // sticky.top = backUpSticky[3];
            // sticky.item(0).height = backUpSticky[4];
            // sticky.item(0).width = backUpSticky[5];
            // sticky.item(0).left = backUpSticky[6];
            // sticky.item(0).top = backUpSticky[7];
            // sticky.item(1).height = backUpSticky[8];
            // sticky.item(1).width = backUpSticky[9];
            // sticky.item(1).left = backUpSticky[10];
            // sticky.item(1).top = backUpSticky[11];
            canvas.renderAll();
            backUpSticky = "";
        }

        this.isDragging = false;
        canvas.setCursor('default');
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
        if (zoom > canvasMaxZoom) zoom = canvasMaxZoom;
        if (zoom < canvasMinZoom) zoom = canvasMinZoom;
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
function vertical_restrict(sticky) {
    let top = sticky.top;
    let left = sticky.left;
    if (top < ogTop) top = ogTop;
    if (top > 1133 - sticky.height * sticky.scaleY) top = 1133 - sticky.height * sticky.scaleY;
    if (top > 932 - sticky.height * sticky.scaleY && top < ((1942 - sticky.height * sticky.scaleY) / 2)) top = 932 - sticky.height * sticky.scaleY;
    if (top < 1010 && top > ((1888 - sticky.height * sticky.scaleY) / 2)) top = 956;
    if (left > (796 - sticky.width * sticky.scaleX) / 2 && left < (3288 - sticky.width * sticky.scaleX) / 2) { //only for the middle part
        if (top < 330) top = 330;
    }
    return top
}

function horizontal_restrict(sticky) {
    let top = sticky.top;
    let left = sticky.left;
    if (left < ogLeft) left = ogLeft;
    if (left > 1865 - sticky.width * sticky.scaleX) left = 1865 - sticky.width * sticky.scaleX;

    if (top < ((1942 - sticky.height * sticky.scaleY) / 2)) { // only for the upper part
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

function smoothMoveH(stickyShape, leftDest) {
    stickyShape.animate('left', leftDest, {
        duration: 400,
        onChange: canvas.renderAll.bind(canvas),
        onComplete: function () {
            // console.log('finish move h');
        },
        easing: fabric.util.ease['easeInOutQuart']
    });
}

function smoothMoveV(stickyShape, topDest) {
    stickyShape.animate('top', topDest, {
        duration: 400,
        onChange: canvas.renderAll.bind(canvas),
        onComplete: function () {
            // console.log('finish move v');
        },
        easing: fabric.util.ease['easeInOutQuart']
    });
}

function convertDisplay(sticky){
  const width = sticky.width * sticky.scaleX;
  const height = sticky.height * sticky.scaleY;
  let printText = sticky.content;
  console.log(printText);
  if (printText.length > Math.floor((width - stickyPadding) / 10) * Math.floor((height - stickyPadding)/15)){
      printText = printText.slice(0, Math.floor((width - stickyPadding) / 10) * Math.floor((height - stickyPadding)/15) - 3);
      printText = printText + '...';
  }
  return printText;
}

function argHandler(obj, handler) {
    return function () {
        handler(obj);
    };
};

function setupStickyListeners(stickyShape) {
    stickyShape.on('mousedown', doubleClicked(this, function (sticky) {
        $('#editDiv').html('')
        displayEditForm(sticky)
    }));
    stickyShape.on('mouseup', function () {
        let top = vertical_restrict(this);
        let left = horizontal_restrict(this);
        smoothMoveH(this, left);
        smoothMoveV(this, top);
        this.setCoords()
        console.log(this.left + ', ' + this.top);
    })
    stickyShape.on('scaling', argHandler(this, function (sticky) {
        let width = sticky.width * sticky.scaleX;
        let height = sticky.height * sticky.scaleY;
        if (width > stickyMaxWidth) width = stickyMaxWidth;
        if (height > stickyMaxHeight) height = stickyMaxHeight;// set scaling boundary so that not stikcy will have size larger than a block
        if (width < stickyMinimumWidth) width = stickyMinimumWidth;
        if (height < stickyMinimumHeight) height = stickyMinimumHeight;
        sticky.set('width', width);
        sticky.set('height', height);
        sticky.set('scaleX', 1);
        sticky.set('scaleY', 1);
        const stickyBg = sticky.item(0);
        stickyBg.set('width', width);
        stickyBg.set('height', height);
        stickyBg.setCoords();
        const stickyCt = sticky.item(1);
        stickyCt.set('width', width - stickyPadding); //20 as padding
        stickyCt.set('height', height - stickyPadding); //20 as padding
        stickyCt.setCoords();
        console.log(sticky.content);
        stickyCt.text = convertDisplay(sticky);
        sticky.setCoords();
    }))
}

const Sticky = fabric.util.createClass(fabric.Group, {
  type: 'Sticky',

  initialize: function(){
      const options = {
              left: currLeft,
              top: currTop,
              width: stickyOgWidth,
              height: stickyOgHeight,
              originX: 'left',
              originY: 'top',};
      const textboxValue = $('#textInputBox').val();
      $('#textInputBox').val("");
      const stickyBackground = new fabric.Rect(new getBackgroundJson());
      const stickyContent = new fabric.Textbox(textboxValue, new getContentJson());
      this.callSuper('initialize', [stickyBackground, stickyContent], options);
      const stickyCt = this.item(1);
      stickyCt.set('width', this.width - stickyPadding); //20 as padding
      stickyCt.set('height', this.height - stickyPadding); //20 as padding
      this.set('content', options.content || textboxValue);
      this.set('stickyId', options.stickyId || numberOfStickies);
      this.set('comments', options.comments || []);
      this.set('lockRotation', options.lockRotation || true);
      this.set('lockScalingFlip', options.lockScalingFlip || true);
      this.set('transparentCorners', options.transparentCorners || false);
      this.set('cornerStyle', options.cornerStyle || 'circle');
      this.set('_controlsVisibility', options._controlsVisibility || {
          tl: false,
          tr: false,
          br: false,
          bl: false,
          ml: false,
          mt: false,
          mr: true,
          mb: true,
          mtr: false
      });

      // // Sticky content (text)
      // this.content = textboxValue;
      // this.comments = []

      // Sticky fabric object (named as shape)

      this.item(1).text = convertDisplay(this);

      this.on('mousedown', doubleClicked(this, function (sticky) {
          $('#editDiv').html('')
          displayEditForm(sticky)
      }));

      this.on('mouseup', function () {
          let top = vertical_restrict(this);
          let left = horizontal_restrict(this);
          smoothMoveH(this, left);
          smoothMoveV(this, top);
          this.setCoords()
          console.log(this.left + ', ' + this.top);
      })
      this.on('scaling', argHandler(this, function (sticky) {
          let width = sticky.width * sticky.scaleX;
          let height = sticky.height * sticky.scaleY;
          if (width > stickyMaxWidth) width = stickyMaxWidth;
          if (height > stickyMaxHeight) height = stickyMaxHeight;// set scaling boundary so that not stikcy will have size larger than a block
          if (width < stickyMinimumWidth) width = stickyMinimumWidth;
          if (height < stickyMinimumHeight) height = stickyMinimumHeight;
          sticky.set('width', width);
          sticky.set('height', height);
          sticky.set('scaleX', 1);
          sticky.set('scaleY', 1);
          const stickyBg = sticky.item(0);
          stickyBg.set('width', width);
          stickyBg.set('height', height);
          stickyBg.setCoords();
          const stickyCt = sticky.item(1);
          stickyCt.set('width', width - stickyPadding); //20 as padding
          stickyCt.set('height', height - stickyPadding); //20 as padding
          stickyCt.setCoords();
          console.log(sticky.content);
          stickyCt.text = convertDisplay(sticky);
          sticky.setCoords();
      }))
      numberOfStickies++;
      currLeft += 10;
      currTop += 10;
    },

    toObject: function(){
      return fabric.util.object.extend(this.callSuper('toObject'), {
        lockRotation: this.get('lockRotation'),
        lockScalingFlip: this.get('lockScalingFlip'),
        transparentCorners: this.get('transparentCorners'),
        cornerStyle: this.get('cornerStyle'),
        _controlsVisibility: this.get('_controlsVisibility'),
        content:this.get('content'),
        stickyId: this.get('stickyId'),
        comments:this.get('comments')
      });
    }

});

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

// const getStickyObjJson = function () {
//     const stickyObjJson = {
//         left: currLeft,
//         top: currTop,
//         width: stickyOgWidth,
//         height: stickyOgHeight,
//         originX: 'left',
//         originY: 'top',
//     };
//
//     return stickyObjJson;
// }

// function getShape(textboxValue) {
//     const stickyBackground = new fabric.Rect(new getBackgroundJson());
//     const stickyContent = new fabric.Textbox(textboxValue, new getContentJson());
//     const stickyObj = new fabric.Group([stickyBackground, stickyContent], new getStickyObjJson());
//     const stickyCt = stickyObj.item(1);
//     stickyCt.set('width', stickyObj.width - stickyPadding); //20 as padding
//     stickyCt.set('height', stickyObj.height - stickyPadding); //20 as padding
//     return stickyObj;
// }

function createSticky() {
    const newSticky = new Sticky();
    canvas.add(newSticky);
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
function downloadPopup(href) {
    const canvasTitle = $('#canvasTitle').text().trim();
    $("body").prepend(`<a id="hiddenLink" download="${canvasTitle.length == 0 ? "untitled canvas" : canvasTitle}">`);
    $("#hiddenLink").attr("href", href);
    $("#hiddenLink")[0].click();
    $("#hiddenLink").remove();
}

// toJSON
function exportJson() {
    revertTransformation();
    const href = 'data:application/json,' + JSON.stringify(canvas.toJSON(['canvasId', 'hoverCursor']));
    downloadPopup(href);
}

// toSVG
function exportSvg() {
    revertTransformation();
    const href = 'data:image/svg+xml,' + canvas.toSVG();
    console.log(href)
    downloadPopup(href);
}

// toPNG
function exportPng() {
    revertTransformation();
    const href = canvas.toDataURL("image/png");
    downloadPopup(href);
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

// handling all the editing/deleting/comments of sticky
function displayEditForm(sticky) {
    console.log(sticky)
    const html = `
    <div id="editForm" class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Sticky Information</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
            </button>
        </div>
        <div class="modal-body">
            <div id="textboxContainer">
                <p id="textboxP" class="textbox">${sticky.content}</p>
            </div>
            <div id="btnContainer" class="input-group mb-3 mt-3 pr-3 pl-3">
                <button class="btn btn-primary editFormBtns" id="colorBtn" type="button">Color</button>
                <button class="btn btn-primary editFormBtns" id="editBtn" type="button" id="removeBtn">Edit</button>
                <button class="btn btn-primary editFormBtns" id="deleteBtn" type="button">Delete</button>
            </div>
            <div><ul id="commentContainer"></ul>
            </div>
            <div id="commentInputContainer" class="input-group">

                    <input id="commentContent" type="text" class="form-control" placeholder="Add new comment" >
                    <div class="input-group-append">
                        <button id="addComment" class="btn btn-primary" type="button">Add</button>
                    </div>

            </div>
        </div>
    </div>`
    const editDiv = $('#editDiv')
    editDiv.html(html)

    for (let i = 0; i < sticky.comments.length; i++) {
        const c = sticky.comments[i]
        const li = document.createElement('li')
        const buttonId = `delComment${i}`
        li.innerHTML = `<span class="commentWrap">${c}</span><button id='${buttonId}' type="button" class="delComment" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
    </button>`
        $('#commentContainer').append(li)
        $(`#${buttonId}`).click(function() {
            const content = $(this).prev().text()
            const index = sticky.comments.findIndex(c => c == content)
            if (index >= 0) {
                sticky.comments.splice(index, 1)
            }
            console.log(sticky.comments)
            $(this).parent().remove()
        })
    }

    $('#addComment').click(function addComments() {
        const content = $('#commentContent').val()
        const buttonId = `delComment${sticky.comments.length}`
        // send post request 
        sticky.comments.push(content)
        const li = document.createElement('li')
        li.innerHTML = `<span class="commentWrap">${content}</span><button id='${buttonId}' type="button" class="delComment" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
    </button>`
        $('#commentContainer').append(li)
        $(`#${buttonId}`).click(function() {
            const content = $(this).prev().text()
            const index = sticky.comments.findIndex(c => c == content)
            if (index >= 0) {
                sticky.comments.splice(index, 1)
            }
            console.log(sticky.comments)
            $(this).parent().remove()
        })
        $('#commentContent').remove()
        $('#commentInputContainer').prepend('<input id="commentContent" type="text" class="form-control" placeholder="Add new comment" >')

    })

    $('button.close').click(function () {
        editDiv.html('')
    })

    $('#colorBtn').click(function () {
        // console.log(targetSticky)
        sticky.item(0).set('fill', stickyColors[(stickyColors.indexOf(sticky.item(0).fill) + 1) % (stickyColors.length)])
        canvas.renderAll()
    })


    $('#deleteBtn').click(function() {
        // delete request to server
        const indexToRemove = stickyList.findIndex(s => s.stickyId == sticky.stickyId);
        canvas.remove(sticky);
        canvas.discardActiveObject();
        stickyList.splice(indexToRemove, 1);
        editDiv.html('')
    })

    $('#editBtn').click(function() {
        if ($(this).text() == 'Edit') {
            console.log($(this).text())
            $(this).text('Done')
            const textarea = document.createElement('textarea');
            textarea.rows = '4';
            textarea.cols = '40';
            textarea.className = 'textbox';
            textarea.id = 'textarea;'
            textarea.style.backgroundColor = 'rgb(236,232,238)';
            const prevText = $('#textboxP').text()
            textarea.innerHTML = prevText;
            $("#textboxContainer").html(textarea)

            textarea.onkeydown = function (e) {
                let key = e.keyCode;
                if (key == '13') {
                    stickyContentEdit(sticky)
                }
            }
        } else {
            stickyContentEdit(sticky)
            // sticky.content = $('.textbox').val()
            // sticky.shape.item(1).text = convertDisplay(sticky)
            // const stickyCt = sticky.shape.item(1);
            // stickyCt.set('width', sticky.shape.width - stickyPadding); //20 as padding
            // stickyCt.set('height', sticky.shape.height - stickyPadding); //20 as padding
            // stickyCt.setCoords()
            // canvas.renderAll();
            // // $(this)[0].id = 'editBtn'
            // $('#editBtn').text('Edit');
            // const p = document.createElement('p');
            // p.className = 'textbox';
            // $('#textboxContainer').html(p)
        }
    })

}

function stickyContentEdit(sticky) {
    sticky.content = $('.textbox').val()
    sticky.item(1).text = convertDisplay(sticky)
    const stickyCt = sticky.item(1);
    stickyCt.set('width', sticky.width - stickyPadding); //20 as padding
    stickyCt.set('height', sticky.height - stickyPadding); //20 as padding
    stickyCt.setCoords()
    canvas.renderAll();
    $('#editBtn').text('Edit');
    const p = document.createElement('p');
    p.className = 'textbox';
    p.id = 'textboxP'
    p.innerHTML = sticky.content;
    $('#textboxContainer').html(p)
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
    canvas.requestRenderAll();
}

function searchInCanvas() {
    document.getElementById("searchContent").addEventListener("input", function() {
        // reset search result
        $('#searchResult').html('');

        const searchContent = $('#searchContent').val();

        if (searchContent != "") {
            const dropDownMenu = document.querySelector('#searchResult')

            for (let i = 0; i < stickyList.length; i++) {
                const sticky = stickyList[i];

                const content = sticky.content;

                const words = content.split(" ")
                for (let j = 0; j < words.length; j++) {
                    const word = words[j];

                    if (searchContent == word) {
                        const listItem = document.createElement('a');
                        listItem.setAttribute('class', "list-group-item list-group-item-action");
                        listItem.appendChild(document.createTextNode(sticky.content));

                        dropDownMenu.appendChild(listItem);
                    }
                }
            }

            if (document.getElementById('searchResult').innerHTML === "") {
                const noResult = document.createElement('a');
                noResult.setAttribute('class', "list-group-item");
                noResult.appendChild(document.createTextNode("No matching found"));

                dropDownMenu.appendChild(noResult);
            }
        }
    }, false);

    // hide the search result if clicked outside
    $('body').on('click', function(e) {
        $('#searchResult').html('');
        document.getElementById('searchContent').value = '';
    });
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


function inWhichBox(){
  for (let i = 0; i < stickyList.length; i++){
    console.log(stickyList[i].stickyId + ' in ' + returnClass(stickyList[i]));
  }
}

function returnClass(sticky){
  const top = sticky.top;
  const left = sticky.left;
  if (top >= 243 && top <= 613 && left >= 147 && left <= 372){return "BIOPHYSICAL STOCKS"}
  if (top >= 613 && top <= 933 && left >= 147 && left <= 372){return "ECOSYSTEMSERVICES"}
  if (top >= 243 && top <= 613 && left >= 1669 && left <= 1866){return "ECOSYSTEM ACTORS"}
  if (top >= 613 && top <= 933 && left >= 1669 && left <= 1866){return "NEEDS"}
  if (top >= 953 && top <= 1136 && left >= 147 && left <= 764){return "COSTS"}
  if (top >= 953 && top <= 1136 && left >= 764 && left <= 1278){return "GOALS"}
  if (top >= 953 && top <= 1136 && left >= 1278 && left <= 1866){return "BENIFITS"}
  if (top >= 334 && top <= 613 && left >= 423 && left <= 654){return "RESOURCES"}
  if (top >= 613 && top <= 933 && left >= 423 && left <= 654){return "ACTIVITIES"}
  if (top >= 334 && top <= 613 && left >= 654 && left <= 838){return "PARTNERSHIP"}
  if (top >= 613 && top <= 933 && left >= 654 && left <= 838){return "GOVERNANCE"}
  if (top >= 334 && top <= 613 && left >= 1203 && left <= 1388){return "RELATIONSHIPS"}
  if (top >= 613 && top <= 933 && left >= 1203 && left <= 1388){return "CHANNELS"}
  if (top >= 334 && top <= 933 && left >= 1388 && left <= 1620){return "STAKEHOLDERS"}
  if (top >= 334 && top <= 732 && left >= 850 && left <= 1192){return "VALUE CO-CREATIONS"}
  if (top >= 732 && top <= 933 && left >= 850 && left <= 1192){return "VALUE CO-DESTRUCTIONS"}
}
