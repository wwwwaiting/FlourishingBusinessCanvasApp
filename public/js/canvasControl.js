"use strict";

console.log("canvasControl.js");

var socket = io();

// Global vars
let canvas;
let backUpSticky;
const canvasMaxZoom = 8;
const canvasMinZoom = 0.3;
const mainCanvasWidth = 2040;
const mainCanvasHeight = 1320;
// let numberOfStickies = 0;
const ogLeft = 182;
let currLeft = ogLeft;
const ogTop = 243;
let currTop = ogTop;
const stickyRadius = 0;
const stickyOgWidth = 100;
const stickyOgHeight = 100;
const stickyPadding = 20;
const stickyMinimumWidth = 80;
const stickyMinimumHeight = 80;
const stickyMaxWidth = 185;
const stickyMaxHeight = 175;
const stickyStrokeWidth = 0.5;
const dataFormat = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};


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
const stickyShadow = 'rgba(130, 138, 145, 0.3) 0px 3px 10px';
const stickyFocusShadow = 'rgba(130, 138, 145, 0.5) 0px 3px 10px';
const stickyStroke = 'rgba(130, 138, 145, 0.3)';
const imageUrl = "https://i.imgur.com/MoXPVzV.png";

// Initialize the canvas
function initialize_canvas(data) {
  // Check if there's an existing canvas
  if (canvas) {
    canvas.clear();
    canvas.dispose();
  }
  canvas = new fabric.Canvas('mainCanvas', {
    canvasId: data.canvasId,
    hoverCursor: 'pointer'
  });

  $('#title').attr('value', data.title);
  $('#designedFor').attr('value', data.company);
  $('#designedBy').attr('value', data.owner);
  // $('#designedDate').attr('value', data.createDate);
  $('#designedDate').attr('value', new Date(data.createDate).toLocaleDateString("en-US", dataFormat));

  data.stickies.forEach(sticky => {
    const options = {
      stickyId: sticky._id,
      left: sticky.position.left,
      top: sticky.position.top,
      width: sticky.size.width,
      height: sticky.size.height,
      originX: 'left',
      originY: 'top',
      title: sticky.title,
      content: sticky.content,
      comment: sticky.comment
    }
    const newSticky = new Sticky(options);
    newSticky.item(0).set('fill', sticky.color);
    canvas.add(newSticky);
  })
  canvas.renderAll();

  // Reset global vars
  // numberOfStickies = 0;
  setCanvasBgImg();
  currLeft = ogLeft;
  currTop = ogTop;

  /// Pan and zoom
  canvas.on('mouse:down', function(opt) {
    const evt = opt.e;
    if (!canvas.getActiveObject()) {
      canvas.setCursor('move');
      this.isDragging = true;
      this.selection = false;

      let lastX;
      let lastY;
      if (evt.touches) {
        lastX = evt.touches[0].clientX;
        lastY = evt.touches[0].clientY;
      } else {
        lastX = evt.clientX;
        lastY = evt.clientY;
      }
      this.lastPosX = lastX;
      this.lastPosY = lastY;
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
  canvas.on('mouse:move:before', function() {
    if (this.isDragging) {
      canvas.setCursor('move');
    }
  })
  canvas.on('mouse:move', function(opt) {
    if (this.isDragging) {
      canvas.setCursor('move');
      $('#collapseSidepanel').collapse('hide');

      const e = opt.e;
      let clientX;
      let clientY;
      if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      this.viewportTransform[4] += clientX - this.lastPosX;
      this.viewportTransform[5] += clientY - this.lastPosY;

      this.requestRenderAll();
      this.lastPosX = clientX;
      this.lastPosY = clientY;
    }
    // else {
    //     const e = opt.e
    //     const positionClass = returnMouseClass(e.clientY,e.clientX)
    //     if (positionClass != undefined){
    //         showMouseSidepanel(positionClass);
    //     } else {
    //         $('.collapse').collapse('hide');
    //     }
    //
    // }
  });
  canvas.on('mouse:up', function(opt) {
    // TODO: when mouse:up, send data to backend
    if (canvas.getActiveObject()) {
      let sticky = canvas.getActiveObject();
      // console.log(backUpSticky);
      // console.log(sticky);
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
    canvas.setCursor('default');
    this.isDragging = false;
    this.selection = true;
    canvas.forEachObject(obj => {
      obj.selectable = true;
      obj.setCoords();
    });
  });
  canvas.on('mouse:wheel', function(opt) {
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
  canvas.on('selection:cleared', () => {
    // console.log('cleared!')
    $('#collapseSidepanel').collapse('hide');
    // $('.collapse').collapse('dispose');
  })
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
    if (top < 334) top = 334;
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
    onComplete: function() {
      // console.log('finish move h');
    },
    easing: fabric.util.ease['easeInOutQuart']
  });
}

function smoothMoveV(stickyShape, topDest) {
  stickyShape.animate('top', topDest, {
    duration: 400,
    onChange: canvas.renderAll.bind(canvas),
    onComplete: function() {
      // console.log('finish move v');
    },
    easing: fabric.util.ease['easeInOutQuart']
  });
}

function convertDisplay(sticky) {
  const width = sticky.width * sticky.scaleX;
  const height = sticky.height * sticky.scaleY;
  let printText = sticky.content;
  // console.log(printText);
  if (printText.length > Math.floor((width - stickyPadding) / 10) * Math.floor((height - stickyPadding) / 15)) {
    printText = printText.slice(0, Math.floor((width - stickyPadding) / 10) * Math.floor((height - stickyPadding) / 15) - 3);
    printText = printText + '...';
  }
  return printText;
}

function argHandler(obj, handler) {
  return function() {
    handler(obj);
  };
};

function sidepanelStickyHoverOver(sideSticky) {
  const targetStickyId = sideSticky.id.split('-')[1];
  const targetSticky = canvas.getObjects().find(s => s.get('stickyId') == targetStickyId);
  targetSticky.item(0).set('shadow', stickyFocusShadow);
  canvas.renderAll();
}

function sidepanelStickyHoverOut(sideSticky) {
  const targetStickyId = sideSticky.id.split('-')[1];
  const targetSticky = canvas.getObjects().find(s => s.get('stickyId') == targetStickyId);
  targetSticky.item(0).set('shadow', stickyShadow);
  canvas.renderAll();
}

function sidepanelClick(sideSticky) {
  const targetStickyId = sideSticky.id.split('-')[1];
  const targetSticky = canvas.getObjects().find(s => s.get('stickyId') == targetStickyId);
  displayEditForm(targetSticky);
}


function showSidepanel(stickySelected) {
  focusOnSticky(stickySelected);

  const stickyBoxName = returnClass(stickySelected);
  $('#sidepanel-title').text(stickyBoxName);
  const stickyClass = returnClass(stickySelected)
  $('#sidepanel-list').html('')
  // canvas.getObjects().forEach(sticky => {
  //     if (sticky.intersectsWithObject(testRect)) {
  //         $('#sidepanel-list').append(`<a class="list-group-item list-group-item-action p-2">
  //         <div class="p-2 rounded" style="{ background-color: ${sticky.item(0).get('fill')}; }">
  //             <h6 class="mb-1">Sticky ${sticky.get('stickyId')}</h5>
  //             <p class="mb-1">${sticky.get('content')}</p>
  //         </div></a>`);
  //     }
  // });
  canvas.getObjects().forEach(sticky => {
    let titleText = 'Sticky';
    if (sticky.get('title').length > 0) {
      titleText = sticky.get('title');
    }
    if (returnClass(sticky) == stickyClass) {
      // console.log(sticky.item(0).get('fill'));
      $('#sidepanel-list').append(`<a id="sideSticky-${sticky.get('stickyId')}" class="list-group-item bg-light list-group-item-action p-1 border-0" onmouseover="sidepanelStickyHoverOver(this)" onmouseout="sidepanelStickyHoverOut(this)" onclick="sidepanelClick(this)">
            <div class="p-2 rounded" style= "background-color: ${sticky.item(0).get('fill')};">
                <h6 class="mb-1">${titleText}</h6>
                <p class="mb-1">${sticky.get('content')}</p>
            </div></a>`);
    }
  });
  $('#collapseSidepanel').collapse('show');
}

function showMouseSidepanel(stickyBoxName) {
  $('#sidepanel-title').text(stickyBoxName);
  const stickyClass = stickyBoxName;
  $('#sidepanel-list').html('')
  // canvas.getObjects().forEach(sticky => {
  //     if (sticky.intersectsWithObject(testRect)) {
  //         $('#sidepanel-list').append(`<a class="list-group-item list-group-item-action p-2">
  //         <div class="p-2 rounded" style="{ background-color: ${sticky.item(0).get('fill')}; }">
  //             <h6 class="mb-1">Sticky ${sticky.get('stickyId')}</h5>
  //             <p class="mb-1">${sticky.get('content')}</p>
  //         </div></a>`);
  //     }
  // });
  canvas.getObjects().forEach(sticky => {
    if (returnClass(sticky) == stickyClass) {
      // console.log(sticky.item(0).get('fill'));
      $('#sidepanel-list').append(`<a class="list-group-item list-group-item-light list-group-item-action p-2">
            <div class="p-2 rounded" style= "background-color: ${sticky.item(0).get('fill')};">
                <h6 class="mb-1">Sticky ${sticky.get('stickyId')}</h5>
                <p class="mb-1">${sticky.get('content')}</p>
            </div></a>`);
    }
  });
  $('#collapseSidepanel').collapse('show');
}

let stickyIsMoving = false;
let stickyIsResizing = false;

const Sticky = fabric.util.createClass(fabric.Group, {
  type: 'Sticky',

  initialize: function(options) {
    options || (options = {
      left: currLeft,
      top: currTop,
      width: stickyOgWidth,
      height: stickyOgHeight,
      originX: 'left',
      originY: 'top',
    });
    options.content || (options.content = $('#textInputBox').val())
    const textboxValue = options.content;
    $('#textInputBox').val("");
    options.title || (options.title = $("#stickyTitleInput").val())
    const textboxTitle = options.title;
    $("#stickyTitleInput").val("")
    const stickyBackground = new fabric.Rect(new getBackgroundJson());
    stickyBackground.width = options.width;
    stickyBackground.height = options.height;
    const stickyContent = new fabric.Textbox(textboxValue, new getContentJson());
    this.callSuper('initialize', [stickyBackground, stickyContent], options);
    const stickyCt = this.item(1);
    stickyCt.set('width', this.width - stickyPadding); //20 as padding
    stickyCt.set('height', this.height - stickyPadding); //20 as padding
    this.set('title', textboxTitle || '');
    this.set('content', textboxValue);
    this.set('stickyId', options.stickyId || 'no_id');
    this.set('comments', options.comment || []);
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
    this.set("isMoving", false);
    this.set("isResizing", false);

    // // Sticky content (text)
    // this.content = textboxValue;
    // this.comments = []

    // Sticky fabric object (named as shape)

    this.on('selected', () => {
      showSidepanel(this)
      //     if (!stickyIsMoving && !stickyIsResizing) showSidepanel(this);
    })

    this.item(1).text = convertDisplay(this);

    // this.on('mousedown', doubleClicked(this, function (sticky) {
    //     $('#editDiv').html('')
    //     displayEditForm(sticky)
    // }));
    this.on('mousedblclick', function() {
      displayEditForm(this)
    });

    this.on('mouseover', function() {
      this.item(0).set('shadow', stickyFocusShadow);
      canvas.renderAll();
    });

    this.on('mouseout', function() {
      this.item(0).set('shadow', stickyShadow);
      canvas.renderAll();
    });

    this.on('mouseup', function() {
      let top = vertical_restrict(this);
      let left = horizontal_restrict(this);
      smoothMoveH(this, left);
      smoothMoveV(this, top);
      this.setCoords()
      console.log('L:' + this.left + ', T:' + this.top);
      if (stickyIsResizing) {

        socket.emit('stickyUpdateSize', {
          stickyId: this.stickyId,
          height: parseInt(this.get('height')),
          width: parseInt(this.get('width')),
          left: parseInt(left),
          top: parseInt(top)
        });

        $.ajax({
          type: 'POST',
          url: "/canvas/edit",
          data: {
            type: "size",
            change: {
              height: parseInt(this.get('height')),
              width: parseInt(this.get('width'))
            },
            canvasId: canvas.canvasId,
            stickyId: this.stickyId
          },
          success: function(resultData) {
            console.log(resultData)
          },
          error: function() {
            alert("Something went wrong")
          }
        });
        $.ajax({
          type: 'POST',
          url: "/canvas/edit",
          data: {
            type: "position",
            change: {
              left: parseInt(left),
              top: parseInt(top)
            },
            canvasId: canvas.canvasId,
            stickyId: this.stickyId
          },
          success: function(resultData) {
            console.log(resultData)
          },
          error: function() {
            alert("Something went wrong")
          }
        });
        stickyIsResizing = false;
      } else if (stickyIsMoving) {

        socket.emit('stickyUpdatePos', {
          stickyId: this.stickyId,
          left: parseInt(left),
          top: parseInt(top)
        });

        $.ajax({
          type: 'POST',
          url: "/canvas/edit",
          data: {
            type: "position",
            change: {
              left: parseInt(left),
              top: parseInt(top)
            },
            canvasId: canvas.canvasId,
            stickyId: this.stickyId
          },
          success: function(resultData) {
            console.log(resultData)
          },
          error: function() {
            alert("Something went wrong")
          }
        });
        stickyIsMoving = false;
      }
      showSidepanel(this);
    })
    this.on('moving', () => {
      stickyIsMoving = true;
      showSidepanel(this);
    });
    this.on('scaling', argHandler(this, function(sticky) {
      let width = sticky.width * sticky.scaleX;
      let height = sticky.height * sticky.scaleY;
      if (width > stickyMaxWidth) width = stickyMaxWidth;
      if (height > stickyMaxHeight) height = stickyMaxHeight; // set scaling boundary so that not stikcy will have size larger than a block
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
      // console.log(sticky.content);
      stickyCt.text = convertDisplay(sticky);
      sticky.setCoords();
      stickyIsResizing = true;
    }))
    // numberOfStickies++;
    currLeft += 10;
    currTop += 10;
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      lockRotation: this.get('lockRotation'),
      lockScalingFlip: this.get('lockScalingFlip'),
      transparentCorners: this.get('transparentCorners'),
      cornerStyle: this.get('cornerStyle'),
      _controlsVisibility: this.get('_controlsVisibility'),
      content: this.get('content'),
      stickyId: this.get('stickyId'),
      comments: this.get('comments')
    });
  }

});

const getBackgroundJson = function() {
  let stickyColorIndex = 0;
  $('#stickyColorRow').find('label').each(function() {
    if ($(this).hasClass('active')) stickyColorIndex = parseInt($(this).attr('id').split('-')[1]);
  });
  const backgroundJson = {
    left: 0,
    top: 0, // position offset the center
    originX: 'center',
    originY: 'center', // centered within the group
    fill: stickyColors[stickyColorIndex],
    shadow: stickyShadow,
    strokeWidth: stickyStrokeWidth,
    stroke: stickyStroke,
    width: stickyOgWidth,
    height: stickyOgHeight,
    rx: stickyRadius,
    ry: stickyRadius,
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
  canvas.renderAll();
  // Send to backend
  $.ajax({
    type: 'POST',
    url: "/canvas/add",
    data: {
      canvasId: canvas.canvasId,
      sticky: {
        content: newSticky.get('content'),
        position: {
          left: newSticky.get('left'),
          top: newSticky.get('top')
        },
        size: {
          width: newSticky.get('width'),
          height: newSticky.get('height')
        },
        color: newSticky.item(0).get('fill'),
        title: newSticky.get('title'),
        comment: [],
        optimalFields: {}
      }
    },
    success: function(resultData) {
      console.log(resultData);
      newSticky.set('stickyId', resultData.id);
      showSidepanel(newSticky);

      socket.emit('stickyAdd', {
        stickyId: newSticky.get('stickyId'),
        content: newSticky.get('content'),
        left: newSticky.get('left'),
        top: newSticky.get('top'),
        width: newSticky.get('width'),
        height: newSticky.get('height'),
        color: newSticky.item(0).get('fill'),
        title: newSticky.get('title'),
        comment: [],
        optimalFields: {}
      })
    },
    error: function() {
      alert("Something went wrong")
    }
  });
}

function removeAll() {
  initialize_canvas();
  currLeft = ogLeft;
  currTop = ogTop;
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

function focusOnSticky(sticky) {
  if (stickyIsMoving || stickyIsResizing) {
    return
  }
  const lastVPX = canvas.viewportTransform[4];
  const lastVPY = canvas.viewportTransform[5];
  const sidepanelWidth = $('#sidepanel').width();
  const x = -(sticky.left - canvas.width / 2);
  const y = -(sticky.top - canvas.height / 2);
  const rightLimit = -(canvas.width / 2) + sticky.width + 60;
  const leftLimit = canvas.width / 2 - sidepanelWidth - 20;
  console.log(x - lastVPX, y - lastVPY, leftLimit, rightLimit);
  if (x - lastVPX > leftLimit || x - lastVPX < rightLimit) {
    const vpObj = {
      vpx: lastVPX,
      vpy: lastVPY,
      a: canvas.viewportTransform[0],
      b: canvas.viewportTransform[3]
    };
    $(vpObj).animate({
      vpx: x - sidepanelWidth,
      vpy: y,
      a: 1.2,
      b: 1.2
    }, {
      duration: 400,
      specialEasing: {
        vpx: "swing",
        vpy: "swing"
      },
      step: function() {
        canvas.viewportTransform[0] = vpObj.a;
        canvas.viewportTransform[3] = vpObj.b;
        canvas.viewportTransform[4] = vpObj.vpx;
        canvas.viewportTransform[5] = vpObj.vpy;
      },
      complete: function() {
        canvas.requestRenderAll();
      }
    });
  }
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
  // const href = 'data:image/svg+xml,' + canvas.toSVG();
  const href = 'data:image/svg+xml,' + canvas.toSVG(null, function(svg) {
    return svg.replace(/(filter: .*;)/g, 'filter:;');
  });
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
  fileInput.onchange = function() {
    const importedJson = fileInput.files[0];
    const reader = new FileReader();
    if (importedJson) {
      reader.readAsText(importedJson);
    }
    if (importedJson.size > 10485760) { // > 10MB
      alert("File too large. Maximum upload size is 10MB.");
    } else {
      reader.addEventListener("load", function() {
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
    <div id="editForm" class="modal-content" style="background-color:${sticky.item(0).fill}">
        <div class="modal-header border-0">
            <h5 class="modal-title">Sticky Information</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
            </button>
        </div>
        <div class="modal-body">
            <div id="textboxContainer">
                <p id="textboxP" class="textbox" style="background-color:${sticky.item(0).fill}">${sticky.content}</p>
            </div>
            <div id="btnContainer" class="d-flex input-group mb-3 mt-3 pr-3 pl-3">
                <div id="editColorRow" class="colorRow d-flex position-relative btn-group btn-group-toggle ml-auto" data-toggle="buttons"></div>
                <button class="btn btn-outline-secondary editFormBtns mr-auto btn-sm" id="deleteBtn" type="button">Delete</button>
            </div>
            <p>Comments: </p>
            <div><ul id="commentContainer"></ul>
            </div>
            <div id="commentInputContainer" class="input-group">

                    <input id="commentContent" type="text" class="form-control" placeholder="Add new comment" style="background-color:${sticky.item(0).fill}; border: 1px solid #6c757d">
                    <div class="input-group-append">
                        <button id="addComment" class="btn btn-outline-secondary" type="button">Add</button>
                    </div>

            </div>
        </div>
    </div>`
  // <button class="btn btn-primary editFormBtns" id="editBtn" type="button" id="removeBtn">Edit</button>
  const editDiv = $('#editDiv')
  editDiv.html(html)
  let i = 0;
  stickyColors.forEach(color => {
    $('#editColorRow').append(`<label id="colorLabel-${i}" class="btn btn-secondary m-1 stickyInfoInput btn-circle"><input id="color-${i}" class="stickyInfoInput" type="radio" name="options" autocomplete="off"><span class="stickyInfoInput"></span></label>`)
    $(`#colorLabel-${i}`).css({
      'color': 'black',
      'background-color': `${ color }`,
      'border-color': `${ color }`
    });
    i += 1;
  })
  const index = stickyColors.indexOf(sticky.item(0).fill)
  $(`#colorLabel-${index}`).button('toggle'); // default color
  $(`#colorLabel-${index}`).find('span').html(`<svg class="stickyInfoInput" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="stickyInfoInput" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="rgba(130, 138, 145, 0.5)"/></svg>`);
  $('#colorRow').css({
    'background-color': `${sticky.item(0).fill}`,
    'border-color': `${sticky.item(0).fill}`
  })

  $('#editColorRow').on('click', function(e) {
    if ($(e.target).parent().attr('id') == 'editColorRow') {
      $(e.target).siblings('label').each(function() {
        $(this).find('span').html('');
      });
      $(e.target).find('span').html(`<svg class="stickyInfoInput" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="stickyInfoInput" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="rgba(130, 138, 145, 0.5)"/></svg>`);
      const index = parseInt($(e.target).attr('id').split('-')[1]);
      sticky.item(0).set('fill', stickyColors[index])
      $('#editForm').css('background-color', sticky.item(0).fill)
      $('#commentContent').css('background-color', sticky.item(0).fill)
      $('#editForm').find('p').css('background-color', sticky.item(0).fill)
      $('#editForm').find('textarea').css('background-color', sticky.item(0).fill)

      $.ajax({
        type: 'POST',
        url: "/canvas/edit",
        data: {
          type: "color",
          change: sticky.item(0).get('fill'),
          canvasId: canvas.canvasId,
          stickyId: sticky.stickyId
        },
        success: function(resultData) {
          console.log(resultData)
        },
        error: function() {
          alert("Something went wrong")
        }
      });

      socket.emit('stickyUpdateColor', {
        change: sticky.item(0).get('fill'),
        stickyId: sticky.stickyId
      })

      canvas.renderAll()
      showSidepanel(sticky);

    }
  })

  // Reconstructing previous comments
  for (let i = 0; i < sticky.comments.length; i++) {
    const c = sticky.comments[i]
    console.log(c);
    const li = document.createElement('dl')
    const buttonId = `delComment${i}`
    li.innerHTML = `<span class="userWrap">${c.user}</span><span class="dateWrap">${new Date(c.modifiedTime).toLocaleDateString("en-US", dataFormat)}</span><span class="commentWrap">${c.content}</span><button id='${buttonId}' class="delComment border-0" style="background-color: transparent" type="button" data-dismiss="modal" aria-label="Close">×</button>`
    $('#commentContainer').append(li)
    $(`#${buttonId}`).click(function() {
      // Comment delete and send to backend
      // send post request
      const content = $(this).prev().text()
      const date = $(this).prev().prev().text()
      const user = $(this).prev().prev().prev().text()
      const index = sticky.comments.findIndex(c => (c.user == user && c.content == content && new Date(c.modifiedTime).toLocaleDateString("en-US", dataFormat) == date))
      if (index >= 0) {
        const commentData = sticky.comments[index]
        $.ajax({
          type: 'POST',
          url: "/canvas/edit",
          data: {
            type: "delete comment",
            change: commentData,
            canvasId: canvas.canvasId,
            stickyId: sticky.stickyId
          },
          success: function(resultData) {
            console.log(resultData)
            sticky.comments.splice(index, 1)
          },
          error: function() {
            alert("Something went wrong")
          }
        });
      }

      socket.emit('stickyUpdateComment', {
        change: sticky.get('comments'),
        stickyId: sticky.get('stickyId')
      })

      $(this).parent().remove()
    })
  }

  // Adding new comment
  $('#addComment').click(function addComments() {
    const content = $('#commentContent').val();
    const buttonId = `delComment${sticky.comments.length}`;
    const user = Cookies.get("email");
    $.ajax({
      type: 'POST',
      url: "/canvas/edit",
      data: {
        type: "add comment",
        change: content,
        canvasId: canvas.canvasId,
        stickyId: sticky.stickyId
      },
      success: function(resultData) {
        const date = resultData
        const c = {
          modifiedTime: date,
          user: user,
          content: content
        }
        sticky.comments.push(c)

        const li = document.createElement('dl')
        li.innerHTML = `<span class="userWrap">${c.user}</span><span class="dateWrap">${new Date(c.modifiedTime).toLocaleDateString("en-US", dataFormat)}</span><span class="commentWrap">${c.content}</span><button id='${buttonId}' class="delComment border-0" style="background-color: transparent" type="button" data-dismiss="modal" aria-label="Close">×</button>`
        $('#commentContainer').append(li)
        $(`#${buttonId}`).click(function() {
          // Comment delete and send to backend
          // send post request
          const content = $(this).prev().text()
          const date = $(this).prev().prev().text()
          const user = $(this).prev().prev().prev().text()
          const index = sticky.comments.findIndex(c => (c.user == user && c.content == content && new Date(c.modifiedTime).toLocaleDateString("en-US", dataFormat) == date))
          if (index >= 0) {
            const commentData = sticky.comments[index]
            console.log(commentData);
            $.ajax({
              type: 'POST',
              url: "/canvas/edit",
              data: {
                type: "delete comment",
                change: commentData,
                canvasId: canvas.canvasId,
                stickyId: sticky.stickyId
              },
              success: function(resultData) {
                console.log(resultData);
                sticky.comments.splice(index, 1)
              },
              error: function() {
                alert("Something went wrong")
              }
            });
          }

          socket.emit('stickyUpdateComment', {
            change: sticky.get('comments'),
            stickyId: sticky.get('stickyId')
          })

          $(this).parent().remove()
        })
        $('#commentContent').remove()
        $('#commentInputContainer').prepend(`<input id="commentContent" type="text" class="form-control" placeholder="Add new comment" style="background-color:${sticky.item(0).fill}; border: 1px solid #6c757d">`)
        scrollToBottom("#commentContainer");

      },
      error: function() {
        alert("Something went wrong")
      }
    });
  })

  $('button.close').click(function() {
    editDiv.html('')
  })

  $('#deleteBtn').click(function() {
    // delete request to server
    // send post request
    $.ajax({
      type: 'DELETE',
      url: "/canvas/delete",
      data: {
        canvasId: canvas.canvasId,
        stickyId: sticky.stickyId
      },
      success: function(resultData) {
        console.log(resultData)
      },
      error: function() {
        alert("Something went wrong")
      }
    });

    socket.emit('stickyDelete', {
      stickyId: sticky.stickyId
    })

    canvas.remove(sticky);
    canvas.discardActiveObject();
    editDiv.html('')
  })

  $('body').on('click', '#textboxP', function() {

    const textarea = document.createElement('textarea');
    textarea.rows = '4';
    textarea.cols = '40';
    textarea.className = 'textbox';
    textarea.id = 'textarea;'
    textarea.style.backgroundColor = sticky.item(0).fill
    textarea.innerHTML = sticky.content;

    textarea.autofocus = "autofocus";

    $("#textboxContainer").html(textarea)

    textarea.onkeydown = function(e) {
      let key = e.keyCode;
      if (key == '13') {
        stickyContentEditCore(sticky, textarea.value)
        // send post request
        $.ajax({
          type: 'POST',
          url: "/canvas/edit",
          data: {
            type: "content",
            change: sticky.content,
            canvasId: canvas.canvasId,
            stickyId: sticky.stickyId
          },
          success: function(resultData) {
            console.log(resultData)
          },
          error: function() {
            alert("Something went wrong")
          }
        });

        socket.emit('stickyUpdateContent', {
          change: sticky.content,
          stickyId: sticky.stickyId
        });
        showSidepanel(sticky);
      }
    }
  })

}

function scrollToBottom(containerId) {
  const div = document.querySelector(containerId);
  $(`${containerId}`).animate({
    scrollTop: div.scrollHeight - div.clientHeight
  }, 500);
}

function stickyContentEditCore(sticky, newContent) {
  sticky.content = newContent;
  sticky.item(1).text = convertDisplay(sticky)
  const stickyCt = sticky.item(1);
  stickyCt.set('width', sticky.width - stickyPadding); //20 as padding
  stickyCt.set('height', sticky.height - stickyPadding); //20 as padding
  stickyCt.setCoords()
  canvas.renderAll();
  // $('#editBtn').text('Edit');
  const p = document.createElement('p');
  p.className = 'textbox';
  p.id = 'textboxP'
  p.innerHTML = sticky.content;
  $('#textboxContainer').html(p)
}

function doubleClicked(obj, handler) {
  return function() {
    if (obj.clicked) handler(obj);
    else {
      obj.clicked = true;
      setTimeout(function() {
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

  const activeObj = canvas.getActiveObject();
  if (activeObj) {
    focusOnSticky(activeObj)
  }
}

function searchInCanvas() {
  document.getElementById("searchContent").addEventListener("input", function() {
    // reset search result
    $('#searchResult').html('');

    // make search less case-sensitive
    const searchContent = $('#searchContent').val().toLowerCase();

    if (searchContent != "") {
      const dropDownMenu = document.querySelector('#searchResult')

      // for (let i = 0; i < stickyList.length; i++) {
      // const sticky = stickyList[i];
      canvas.getObjects().forEach(sticky => {
        const title = sticky.title;
        const content = sticky.content;

        if (searchContent == title || content.includes(searchContent)) {
          const listItem = document.createElement('a');
          listItem.setAttribute('class', "list-group-item list-group-item-action");
          listItem.appendChild(document.createTextNode(sticky.content));

          dropDownMenu.appendChild(listItem);
        }
      })

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

  // when clicking, pop up the corresponding sticky
  document.getElementById("searchResult").addEventListener("click", function(e) {
    const content = e.target.innerText

    canvas.getObjects().forEach(sticky => {
      if (content === sticky.content) {
        displayEditForm(sticky)
      }
    })
  })
}

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


function inWhichBox() {
  canvas.getObjects().forEach(sticky => {
    console.log(sticky.stickyId + ' in ' + returnClass(sticky));
  })
}

function returnClass(sticky) {
  const top = sticky.top;
  const left = sticky.left;
  if (top >= 243 && top <= 613 && left >= 147 && left <= 372) {
    return "BIOPHYSICAL STOCKS"
  }
  if (top >= 613 && top <= 933 && left >= 147 && left <= 372) {
    return "ECOSYSTEMSERVICES"
  }
  if (top >= 243 && top <= 613 && left >= 1669 && left <= 1866) {
    return "ECOSYSTEM ACTORS"
  }
  if (top >= 613 && top <= 933 && left >= 1669 && left <= 1866) {
    return "NEEDS"
  }
  if (top >= 953 && top <= 1136 && left >= 147 && left <= 764) {
    return "COSTS"
  }
  if (top >= 953 && top <= 1136 && left >= 764 && left <= 1278) {
    return "GOALS"
  }
  if (top >= 953 && top <= 1136 && left >= 1278 && left <= 1866) {
    return "BENIFITS"
  }
  if (top >= 330 && top <= 613 && left >= 423 && left <= 654) {
    return "RESOURCES"
  }
  if (top >= 613 && top <= 933 && left >= 423 && left <= 654) {
    return "ACTIVITIES"
  }
  if (top >= 330 && top <= 613 && left >= 654 && left <= 838) {
    return "PARTNERSHIP"
  }
  if (top >= 613 && top <= 933 && left >= 654 && left <= 838) {
    return "GOVERNANCE"
  }
  if (top >= 330 && top <= 613 && left >= 1203 && left <= 1388) {
    return "RELATIONSHIPS"
  }
  if (top >= 613 && top <= 933 && left >= 1203 && left <= 1388) {
    return "CHANNELS"
  }
  if (top >= 330 && top <= 933 && left >= 1388 && left <= 1620) {
    return "STAKEHOLDERS"
  }
  if (top >= 330 && top <= 732 && left >= 850 && left <= 1192) {
    return "VALUE CO-CREATIONS"
  }
  if (top >= 732 && top <= 933 && left >= 850 && left <= 1192) {
    return "VALUE CO-DESTRUCTIONS"
  }
}

// function returnMouseClass(top, left) {
//     if (top >= 243 && top <= 613 && left >= 147 && left <= 372) {
//         return "BIOPHYSICAL STOCKS"
//     }
//     if (top >= 613 && top <= 933 && left >= 147 && left <= 372) {
//         return "ECOSYSTEMSERVICES"
//     }
//     if (top >= 243 && top <= 613 && left >= 1669 && left <= 1866) {
//         return "ECOSYSTEM ACTORS"
//     }
//     if (top >= 613 && top <= 933 && left >= 1669 && left <= 1866) {
//         return "NEEDS"
//     }
//     if (top >= 953 && top <= 1136 && left >= 147 && left <= 764) {
//         return "COSTS"
//     }
//     if (top >= 953 && top <= 1136 && left >= 764 && left <= 1278) {
//         return "GOALS"
//     }
//     if (top >= 953 && top <= 1136 && left >= 1278 && left <= 1866) {
//         return "BENIFITS"
//     }
//     if (top >= 330 && top <= 613 && left >= 423 && left <= 654) {
//         return "RESOURCES"
//     }
//     if (top >= 613 && top <= 933 && left >= 423 && left <= 654) {
//         return "ACTIVITIES"
//     }
//     if (top >= 330 && top <= 613 && left >= 654 && left <= 838) {
//         return "PARTNERSHIP"
//     }
//     if (top >= 613 && top <= 933 && left >= 654 && left <= 838) {
//         return "GOVERNANCE"
//     }
//     if (top >= 330 && top <= 613 && left >= 1203 && left <= 1388) {
//         return "RELATIONSHIPS"
//     }
//     if (top >= 613 && top <= 933 && left >= 1203 && left <= 1388) {
//         return "CHANNELS"
//     }
//     if (top >= 330 && top <= 933 && left >= 1388 && left <= 1620) {
//         return "STAKEHOLDERS"
//     }
//     if (top >= 330 && top <= 732 && left >= 850 && left <= 1192) {
//         return "VALUE CO-CREATIONS"
//     }
//     if (top >= 732 && top <= 933 && left >= 850 && left <= 1192) {
//         return "VALUE CO-DESTRUCTIONS"
//     }
// }

function getCanvasInfo() {
  let currentUser = Cookies.get('email');
  if (currentUser == null) {
    alert("Our system detects that you have not yet signed in to our website, we will transfer you to the log in page immediately.")
    window.location.href = '/login'
    return
  }
  $.ajax({
    type: "GET",
    url: "/canvas/get",
    success: function(data) {
      initialize_canvas(data);
      handleWindowResize();
    },
    error: function() {
      alert('error getting canvas info');
    }
  });
}

// Used to call functions after page is fully loaded.
$(window).resize(handleWindowResize);
$(document).ready(getCanvasInfo);



// $('#editBtn').click(function () {
//     if ($(this).text() == 'Edit') {
//         console.log($(this).text())
//         $(this).text('Done')
//         const textarea = document.createElement('textarea');
//         textarea.rows = '4';
//         textarea.cols = '40';
//         textarea.className = 'textbox';
//         textarea.id = 'textarea;'
//         textarea.style.backgroundColor = 'rgb(236,232,238)';
//         const prevText = $('#textboxP').text()
//         textarea.innerHTML = prevText;
//         $("#textboxContainer").html(textarea)

//         textarea.onkeydown = function (e) {
//             let key = e.keyCode;
//             if (key == '13') {
//                 stickyContentEdit(sticky)
//                 // send post request
//                 $.ajax({
//                     type: 'POST',
//                     url: "/canvas/edit",
//                     data: {
//                         type: "content",
//                         change: sticky.content,
//                         canvasId: canvas.canvasId,
//                         stickyId: sticky.stickyId
//                     },
//                     success: function (resultData) {
//                         console.log(resultData)
//                     },
//                     error: function () {
//                         alert("Something went wrong")
//                     }
//                 });
//                 showSidepanel(sticky);
//             }
//         }
//     } else {
//         stickyContentEdit(sticky)
//         // send post request
//         $.ajax({
//             type: 'POST',
//             url: "/canvas/edit",
//             data: {
//                 type: "content",
//                 change: sticky.content,
//                 canvasId: canvas.canvasId,
//                 stickyId: sticky.stickyId
//             },
//             success: function (resultData) {
//                 console.log(resultData)
//             },
//             error: function () {
//                 alert("Something went wrong")
//             }
//         });
//         showSidepanel(sticky);
//         // sticky.content = $('.textbox').val()
//         // sticky.shape.item(1).text = convertDisplay(sticky)
//         // const stickyCt = sticky.shape.item(1);
//         // stickyCt.set('width', sticky.shape.width - stickyPadding); //20 as padding
//         // stickyCt.set('height', sticky.shape.height - stickyPadding); //20 as padding
//         // stickyCt.setCoords()
//         // canvas.renderAll();
//         // // $(this)[0].id = 'editBtn'
//         // $('#editBtn').text('Edit');
//         // const p = document.createElement('p');
//         // p.className = 'textbox';
//         // $('#textboxContainer').html(p)
//     }
// })

socket.on('testLog', testLog);

function testLog(gotResult) {
  console.log('got: ', gotResult);
}
socket.on('stickyUpdateSize', function stickyUpdateSize(result) {
  console.log('got: ', result);
  const changingSticky = canvas.getObjects().find(sticky => sticky.get('stickyId') == result.stickyId);
  changingSticky.set('width', result.width);
  changingSticky.set('height', result.height);
  // changingSticky.set('scaleX', 1);
  // changingSticky.set('scaleY', 1);
  const stickyBg = changingSticky.item(0);
  stickyBg.set('width', result.width);
  stickyBg.set('height', result.height);
  stickyBg.setCoords();
  const stickyCt = changingSticky.item(1);
  stickyCt.set('width', result.width - stickyPadding); //20 as padding
  stickyCt.set('height', result.height - stickyPadding); //20 as padding
  stickyCt.setCoords();
  // console.log(sticky.content);
  stickyCt.text = convertDisplay(changingSticky);
  changingSticky.setCoords();
  canvas.renderAll();
  smoothMoveH(changingSticky, result.left);
  smoothMoveV(changingSticky, result.top);
  changingSticky.setCoords();
});
socket.on('stickyUpdatePos', function stickyUpdatePos(result) {
  // console.log('got: ', result);
  const changingSticky = canvas.getObjects().find(sticky => sticky.get('stickyId') == result.stickyId);
  smoothMoveH(changingSticky, result.left);
  smoothMoveV(changingSticky, result.top);
  changingSticky.setCoords();
});
socket.on('stickyAdd', function stickyAdd(result) {
  // console.log('got: ', result);
  const newSticky = new Sticky(result);
  newSticky.item(0).set('fill', result.color);
  canvas.add(newSticky);
  canvas.renderAll();
});
socket.on('stickyUpdateComment', function stickyUpdateComment(result) {
  // console.log('got: ', result);
  const changingSticky = canvas.getObjects().find(sticky => sticky.get('stickyId') == result.stickyId);
  changingSticky.set('comments', result.change);
  canvas.renderAll();
});
socket.on('stickyUpdateColor', function stickyUpdateColor(result) {
  // console.log('got: ', result);
  const changingSticky = canvas.getObjects().find(sticky => sticky.get('stickyId') == result.stickyId);
  changingSticky.item(0).set('fill', result.change);
  canvas.renderAll();
});
socket.on('stickyDelete', function stickyDelete(result) {
  // console.log('got: ', result);
  const changingSticky = canvas.getObjects().find(sticky => sticky.get('stickyId') == result.stickyId);
  canvas.remove(changingSticky);
  canvas.discardActiveObject();
  $('#editDiv').html('');
  canvas.renderAll();
});
socket.on('stickyUpdateContent', function stickyUpdateContent(result) {
  // console.log('got: ', result);
  const changingSticky = canvas.getObjects().find(sticky => sticky.get('stickyId') == result.stickyId);
  stickyContentEditCore(changingSticky, result.change)
});

$('#canvasHeader').on('show.bs.collapse', function() {
  $('#collapseBtn').html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M7 14l5-5 5 5z" /></svg>`);
  $('#sidepanel').css("height", "calc(100% - 120px)");
  $('#sidepanel').css("top", "102px");
});
$('#canvasHeader').on('hide.bs.collapse', function() {
  $('#collapseBtn').html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M7 10l5 5 5-5z" /></svg>`);
  $('#sidepanel').css("height", "calc(100% - 75px)");
  $('#sidepanel').css("top", "57px");
});

let inputExtended = false;

function extendNewStickyInput() {
  inputExtended = true;
  $('#stickyInfo').addClass('p-3');
  $('#stickyInfo').prepend(`<div class="stickyInfoInput extendInput input-group mb-2"><input id="stickyTitleInput" class="stickyInfoInput form-control" type="text" placeholder="Title"></div>`)
  $('#stickyInfo').prepend(`<div id="stickyColorRow" class="stickyInfoInput extendInput d-flex mb-2 position-relative btn-group btn-group-toggle" data-toggle="buttons"><button id="stickyInfoInputCloseBtn" class="btn p-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#6c757d"/></svg></button></div>`)
  let i = 0;
  stickyColors.forEach(color => {
    $('#stickyColorRow').append(`<label id="colorLabel-${i}" class="btn btn-secondary m-1 stickyInfoInput btn-circle"><input id="color-${i}" class="stickyInfoInput" type="radio" name="options" autocomplete="off"><span class="stickyInfoInput"></span></label>`)
    $(`#colorLabel-${i}`).css({
      'color': 'black',
      'background-color': `${ color }`,
      'border-color': `${ color }`
    });
    i += 1;
  })
  $(`#colorLabel-${0}`).button('toggle'); // default color
  $(`#colorLabel-${0}`).find('span').html(`<svg class="stickyInfoInput" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="stickyInfoInput" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="rgba(130, 138, 145, 0.5)"/></svg>`);
  $('#stickyInfo').css({
    'background-color': `${stickyColors[0]}`,
    'border-color': `${stickyColors[0]}`
  })
  $('#stickyTitleInput').css({
    'background-color': `${stickyColors[0]}`
  })
  $('#textInputBox').css({
    'background-color': `${stickyColors[0]}`
  })
}

function blurNewStickyInput() {
  inputExtended = false;
  $('#stickyInfo').css({
    'background-color': '',
    'border-color': ''
  })
  $('#stickyInfo').removeClass('p-3')
  $('.extendInput').remove();
}

$('body').on('click', function(e) {
  if (!($(e.target).hasClass('stickyInfoInput'))) blurNewStickyInput();
})

$('#stickyInfo').on('click', function(e) {
  console.log($(e.target));
  if (($(e.target).hasClass('stickyInfoInput')) && !inputExtended) {
    extendNewStickyInput()
  } else if ($(e.target).parent().attr('id') == 'stickyColorRow') {
    $(e.target).siblings('label').each(function() {
      $(this).find('span').html('');
    });
    $(e.target).find('span').html(`<svg class="stickyInfoInput" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="stickyInfoInput" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="rgba(130, 138, 145, 0.5)"/></svg>`);
    const colorIndex = parseInt($(e.target).attr('id').split('-')[1]);
    $('#stickyInfo').css({
      'background-color': `${stickyColors[colorIndex]}`,
      'border-color': `${stickyColors[colorIndex]}`
    })
    $('#stickyTitleInput').css({
      'background-color': `${stickyColors[colorIndex]}`
    })
    $('#textInputBox').css({
      'background-color': `${stickyColors[colorIndex]}`
    })
  } else if ($(e.target).attr('id') == 'createBtn') {
    createSticky()
    $('#createBtn').attr('disabled', '');
    blurNewStickyInput()
  }
})

$('#textInputBox').on('input', function(e) {
  if (e.target.value.length > 0) {
    $('#createBtn').removeAttr('disabled');
  } else {
    $('#createBtn').attr('disabled', '');
  }
})
