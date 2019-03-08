"use strict"
console.log("popup.js")


const changePasswordContent = '<div class="modal-body">\n' +
    '        <form>\n' +
    '          <div class="form-group">\n' +
    '            <label for="recipient-name" class="col-form-label">New password:</label>\n' +
    '            <input type="text" class="form-control" id="recipient-name">\n' +
    '          </div>\n' +
    '          <div class="form-group">\n' +
    '            <label for="message-text" class="col-form-label">Repeat password:</label>\n' +
    '            <textarea class="form-control" id="message-text"></textarea>\n' +
    '          </div>\n' +
    '        </form>\n' +
    '      </div>'

const sendInvitationContent = '<div class="modal-body">\n' +
    '        <form>\n' +
    '          <div class="form-group">\n' +
    '            <label for="recipient-name" class="col-form-label">New user Email:</label>\n' +
    '            <input type="text" class="form-control" id="recipient-name">\n' +
    '          </div>\n' +
    '        </form>\n' +
    '      </div>'

const manageUsersContent = '<div class="modal-body">\n' +
    '        <form>\n' +
    '          <div class="form-group">\n' +
    '            <label for="recipient-name" class="col-form-label">List of participating users...</label>\n' +
    '          </div>\n' +
    '        </form>\n' +
    '      </div>'

const manageCanvasContent = '<div class="modal-body">\n' +
    '        <form>\n' +
    '          <div class="form-group">\n' +
    '            <label for="recipient-name" class="col-form-label">List of active canvas...</label>\n' +
    '          </div>\n' +
    '        </form>\n' +
    '      </div>'


function changePassword(){
    $(".modal-title").html("Change password")
    $(".modal-body").html(changePasswordContent)
}

function sendInvitation(){
    $(".modal-title").html("Send invitation")
    $(".modal-body").html(sendInvitationContent)
}

function manageUsers(){
    $(".modal-title").html("Manage users")
    $(".modal-body").html(manageUsersContent)
}

function manageCanvas(){
    $(".modal-title").html("Manage Canvas")
    $(".modal-body").html(manageCanvasContent)
}