"use strict"
console.log("popup.js")
let canvasUsers = null
let canvasIds = null
let canvasTitles = null
class Fbc{
    constructor(users, name, id){
        this.users = users;
        this.name = name;
        this.id = id;
    }
}
const fbcs = []
for (let i = 1; i <= 7; i++) {
    const users = []
    for (let e = 1; e <= i; e++) {
        users.push(e)
    }
    fbcs.push(new Fbc(users, `fbc${i}`, i))
}
console.log(fbcs)


$(document).ready(main);


// Used to call functions after page is fully loaded.
function main() {
    //get request
    const url = '/library/get'

    renderFbc()
}

function renderFbc() {
    const imgUrl = '/images/fbc.png'
    for (let i = 0; i < fbcs.length; i++) {
        const html = `
        <div class="col-lg-3 col-md-6 col-sm-6 mb-4 post-column">
            <a href="" id="${fbcs[i].id}">
                <div class="card shadow postCard">
                    <div class="image-constrain">
                        <img src="${imgUrl}" class="card-img-top post-img p-3">
                    </div>
                    <div class="card-body text-center">
                        <h6 class="post-title font-weight-bold font-italic text-truncate">FBC 1</h6>
                    </div>
                </div>
            </a>
        </div>`
        const rowNum = Math.ceil((i + 1) /4)
        if (i % 4 == 0) {
            $('#post-TwoRow').append(`<div id="row${rowNum}"class="row fadeIn post-row"></div>`)
        }
        $(`#row${rowNum}`).append(html)
    }
}



let manageUsersContent = ''
manageUsersContent += '<div class="modal-body">\n'
manageUsersContent += '<form>\n'
for(let i = 0; i < fbcs.length; i++){
    manageUsersContent += '<h5>'
    manageUsersContent += fbcs[i].name
    manageUsersContent += '</h5>'
    for (let j = 0; j < fbcs[i].users.length; j++){
        manageUsersContent += `<div class="form-check">
    <input class="form-check-input" type="checkbox" onclick="storeRemovingUsers(${fbcs[i].users[j].username})">
    <label class="form-check-label" for="defaultCheck1">
        ${fbcs[i].users[j].username}
    </label>
</div>`
    }
    manageUsersContent += `<button type="button" class="btn btn-light">Add</button>
        <button type="button" class="btn btn-light">Remove</button>`
}
manageUsersContent += '</form>\n'
manageUsersContent += '</div>'

let manageCanvasContent = ''
manageCanvasContent += '<div class="modal-body">\n'
manageCanvasContent += '<form>\n'
for(let i = 0; i < fbcs.length; i++){
    manageCanvasContent += `<div class="form-check">
    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
    <label class="form-check-label" for="defaultCheck1">
        ${fbcs[i].name}
    </label>
</div>`
}
manageCanvasContent += '</form>\n'
manageCanvasContent += '</div>'




function manageUsers(){
    $(".modal-title").html("Manage users")
    $(".modal-body").html(manageUsersContent)
    $(".modal-footer").html(`<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`)
}

function manageCanvas(){
    $(".modal-title").html("Manage Canvas")
    $(".modal-body").html(manageCanvasContent)
    $(".modal-footer").html(`<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Add</button>
                    <button type="button" class="btn btn-primary">Remove</button>`)
}

let removingUsers = []

function storeRemovingUsers(index, username){
    removingUsers.push((index, username))
}
//
// function removeUsers(i){
//     for (let j = 0; j < removingUsers.length; j++){
//         let index = fbcs[i].indexOf(removingUsers[j])
//         fbcs[i].splice(index, 1)
//     }
// }