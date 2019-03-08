"use strict";
console.log("post.js");

// Event Listeners
$('body').on('click', '#visibleUpload', () => {
    $('#hiddenUpload').click()
});
$('body').on('change', '#hiddenUpload', displayUploadPreview);
$('body').on('click', '#clearUpload', () => {
    console.log('ddd')
    $('#hiddenUpload').attr("value", "");
    $('#uploadPreview').html('');
})

function displayUploadPreview() {
    const curFiles = $('#hiddenUpload')[0].files;
    console.log(curFiles)
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        $("#uploadPreview").append(para);
    } else {
        var list = document.createElement('div');
        list.setAttribute("style", "display: inline-flex;")
        $("#uploadPreview").append(list);
        for (var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement('div');

            var image = document.createElement('img');
            image.src = window.URL.createObjectURL(curFiles[i]);
            listItem.appendChild(image);
            list.appendChild(listItem);
        }
    }
}

const postPopupElement = `
<div class="modal-dialog modal-lg" role="document">
<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Change password</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <div class="table-responsive">
                
            <table class="table">
                <tbody>
                    <tr>
                        <td>New password:</td>
                        <td><input id="newPassword" type="text"></td>
                    </tr>
                    <tr>
                        <td>Repeat password:</td>
                        <td><input id="repeatPassword" type="text"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
     <div class="modal-footer">
        <button id="submit" type="button" class="btn btn-primary">Submit</button>
    </div>   
    </div>
</div>
</div>`;
$("#modal").html(postPopupElement);

const postPopupElement2 = `
<div class="modal-dialog modal-lg" role="document">
<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Change password</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <div class="table-responsive">
                
            <table class="table">
                <tbody>
                    <tr>
                        <td>Email:</td>
                        <td><input id="email" type="text"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
     <div class="modal-footer">
        <button id="submit" type="button" class="btn btn-primary">Submit</button>
    </div>   
    </div>
</div>
</div>`;
$("#modal2").html(postPopupElement2);

const category = ['food', 'electronics', 'clothing', 'furniture', 'tools', 'other']

// For mock data
const Post_post = function (id, date, title, userName, description, price, quantity, image, dueDate, type) {
    this.id = id;
    this.date = date;
    this.title = title;
    this.userName = userName;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.image = image;
    this.dueDate = dueDate;
    this.type = type;
}


$(document).ready(function () {
    renderCategory()

})

function renderCategory() {
    let html = ''
    for (let c of category) {
        html = html + `<li><a class="dropdown-item" role="presentation">${c}</a></li>`
    }
    $('#categoryMenu').html(html);
}

$('#categoryMenu').on('click', 'li a', currentSelectionCategory)

function currentSelectionCategory() {
    $("#categoryCurrentSelection").text($(this).text());
}

function removeAll() {
    $('.modal-dialog').html('')
}

$('#close').click(removeAll);
$('#submit').click(getInputData);

function getInputData(e) {
    // get request to server to get currentUser
    let id = currentUser.posts.length.toString(10);
    const prependZeroNum = 4 - id.length;
    for (let i = 0; i < prependZeroNum; i++) {
        id = "0" + id;
    }
    const date = new Date()
    const title = $('#title').val()
    const userName = currentUser.name
    const description = $('#description').val()
    const price = $('#price').val()
    const quantity = $('#quantity').val()
    const image = ''
    const dueDate = $('#dueDate').val()
    const type = (currentUser.isBuyer ? "request" : "offer")
    const category = $('#categoryCurrentSelection')[0].innerHTML
    const newPost = new Post_post(id, date, title, userName, description, price, quantity, image, dueDate, type, category)
    
    // send new post data to backend and save to database
    currentUser.posts.push(currentUser.posts)
    console.log(newPost)

    $('#modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();

}