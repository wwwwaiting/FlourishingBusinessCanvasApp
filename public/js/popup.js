"use strict"
console.log("popup.js")

class User{
    constructor(username){
        this.username = username;
    }
}

class Fbc{
    constructor(users, name){
        this.users = users;
        this.name = name
    }
}

const user1 = new User("1");
const user2 = new User("2");
const user3 = new User("3");
const user4 = new User("4");
const user5 = new User("5");
const user6 = new User("6");
const user7 = new User("7");

// Fbc 1
const mockUsers1 = [];
mockUsers1.push(user1);
const fbc1 = new Fbc(mockUsers1, "fbc1");

// Fbc 2
const mockUsers2 = [];
mockUsers2.push(user1);
mockUsers2.push(user2);
const fbc2 = new Fbc(mockUsers2, "fbc2");

// Fbc 3
const mockUsers3 = [];
mockUsers3.push(user1);
mockUsers3.push(user2);
mockUsers3.push(user3);
const fbc3 = new Fbc(mockUsers3, "fbc3");

// Fbc 4
const mockUsers4 = [];
mockUsers4.push(user1);
mockUsers4.push(user2);
mockUsers4.push(user3);
mockUsers4.push(user4);
const fbc4 = new Fbc(mockUsers4, "fbc4");

// Fbc 5
const mockUsers5 = [];
mockUsers5.push(user1);
mockUsers5.push(user2);
mockUsers5.push(user3);
mockUsers5.push(user4);
mockUsers5.push(user5);
const fbc5 = new Fbc(mockUsers5, "fbc5");

// Fbc 6
const mockUsers6 = [];
mockUsers6.push(user1);
mockUsers6.push(user2);
mockUsers6.push(user3);
mockUsers6.push(user4);
mockUsers6.push(user5);
mockUsers6.push(user6);
const fbc6 = new Fbc(mockUsers6, "fbc6");

// Fbc 7
const mockUsers7 = [];
mockUsers7.push(user1);
mockUsers7.push(user2);
mockUsers7.push(user3);
mockUsers7.push(user4);
mockUsers7.push(user5);
mockUsers7.push(user6);
mockUsers7.push(user7);
const fbc7 = new Fbc(mockUsers7, "fbc7");

const fbcs = [];
fbcs.push(fbc1);
fbcs.push(fbc2);
fbcs.push(fbc3);
fbcs.push(fbc4);
fbcs.push(fbc5);
fbcs.push(fbc6);
fbcs.push(fbc7);

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