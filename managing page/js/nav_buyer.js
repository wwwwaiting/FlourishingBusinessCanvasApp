"use strict";
console.log("nav_buyer.js")  // log to the JavaScript console.

const currentUser = getUser();

function getMessage() {
    return currentUser.messages;
}

function getPost() {
    return currentUser.posts;
}

function getUser() {
    let mockUser = {
        name: "User1",
        password: "buyer",
        email: "buyer@gmail.com",
        phone: "4166666666",
        orderInfo: {
            activeNum : 0,
            finishedNum : 3,
            postedNum : 4
        },
        // unreadNum: 5,
        messages: [
            {
                from: 'User2',
                to: 'User1',
                title: 'Offer Question',
                content: 'Hey, Could you give me some explanation on what is included in the frozen vegetables in your offer? Thank you!',
                date: new Date(2019, 1, 11),
                isRead: true,
                isStarred: true
            }, 
            {
                from: 'User1',
                to: 'User2',
                title: 'Answer To Question',
                content: 'Hey, it includes broccoli, lettuce, sliced tomato, sliced potato, and green beans. Let me know if you are interested.',
                date: new Date(2019, 1, 12),
                isRead: true,
                isStarred: false
            }, 
            {
                from: 'User3',
                to: 'User1',
                title: 'Regarding the Offer',
                content: 'Hello, I was wondering if you could give me some explanation on what is included in the frozen vegetables in your offer. Thank you!',
                date: new Date(2019, 2, 11),
                isRead: false,
                isStarred: false
            },
            {
                from: 'User1',
                to: 'User3',
                title: 'Response',
                content: 'Hello, it includes broccoli, lettuce, sliced tomato, sliced potato, and green beans. Let me know if you are interested.',
                date: new Date(2019, 2, 13),
                isRead: false,
                isStarred: false
            }
        ],
        posts: [
            {
                id: 1,
                title: "Canned soup",
                type: "request",
                category: "food",
                quantity: "20 unit",
                price: 89,
                userName: "User1",
                date: new Date(2018, 11, 10),
                dueDate: new Date(2018, 12, 30),
                description: "Mix of 10 kinds of vegetables. Frozen and packaged safely. Easy to Cook while good in taste. Initial request of 10kg is made. After first purchase, we are willing to make ongoing, continuous orders if the quality of the product is approved.",
                image: "img/canned_soup.jpg",
                isCompleted:true

            }, 
            {
                id: 2,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 3,
                title: "Frozen vegetables",
                type: "request",
                category: "food",
                quantity: "10 kg",
                price: 100,
                userName: "User1",
                date: new Date(2019, 0, 9),
                dueDate: new Date(2019, 1, 30),
                description: "Mix of 10 kinds of vegetables. Frozen and packaged safely. Easy to Cook while good in taste. Initial request of 10kg is made. After first purchase, we are willing to make ongoing, continuous orders if the quality of the product is approved.",
                image: "img/frozen_veg.png",
                isCompleted:true
            },
            {
                id: 4,
                title: "Android tablet (used or new)",
                type: "request",
                category: "electronics",
                quantity: "2 unit",
                price: 199,
                userName: "User1",
                date: new Date(2019, 1, 10),
                dueDate: new Date(2019, 3, 1),
                description: "We plan to upgrade to paperless workflow. Our reception desk need 2 basic Android tablet to access our database and deal with visitors.",
                image: "img/tablet.jpg",
                isCompleted:true
            },
            {
                id: 5,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 6,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 7,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 8,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 9,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: true
            },
            {
                id: 10,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 11,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 12,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: true
            },
            {
                id: 13,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 14,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: true
            },
            {
                id: 15,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 16,
                title: "Canned soup",
                type: "request",
                category: "food",
                quantity: "20 unit",
                price: 89,
                userName: "User1",
                date: new Date(2018, 11, 10),
                dueDate: new Date(2018, 12, 30),
                description: "Mix of 10 kinds of vegetables. Frozen and packaged safely. Easy to Cook while good in taste. Initial request of 10kg is made. After first purchase, we are willing to make ongoing, continuous orders if the quality of the product is approved.",
                image: "img/canned_soup.jpg",
                isCompleted:true

            },
            {
                id: 17,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 18,
                title: "Frozen vegetables",
                type: "request",
                category: "food",
                quantity: "10 kg",
                price: 100,
                userName: "User1",
                date: new Date(2019, 0, 9),
                dueDate: new Date(2019, 1, 30),
                description: "Mix of 10 kinds of vegetables. Frozen and packaged safely. Easy to Cook while good in taste. Initial request of 10kg is made. After first purchase, we are willing to make ongoing, continuous orders if the quality of the product is approved.",
                image: "img/frozen_veg.png",
                isCompleted:true
            },
            {
                id: 19,
                title: "Android tablet (used or new)",
                type: "request",
                category: "electronics",
                quantity: "2 unit",
                price: 199,
                userName: "User1",
                date: new Date(2019, 1, 10),
                dueDate: new Date(2019, 3, 1),
                description: "We plan to upgrade to paperless workflow. Our reception desk need 2 basic Android tablet to access our database and deal with visitors.",
                image: "img/tablet.jpg",
                isCompleted:true
            },
            {
                id: 20,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 21,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 22,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 23,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 24,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 25,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 26,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 27,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },{
                id: 28,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },{
                id: 29,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            },
            {
                id: 30,
                title: "Basic desk lamp",
                type: "request",
                category: "tools",
                quantity: "8 unit",
                price: 80,
                userName: "User1",
                date: new Date(2018, 11, 23),
                dueDate: new Date(2019, 0, 10),
                description: "Our office is in need of desk lamp. ",
                image: "img/lamp.jpg",
                isCompleted: false
            }




        ],
        isBanned: false,
        isBuyer: true,
        avatar: "img/profile-image.jpg",
        description: "Somewhere Over The Rainbow"
    };
    return mockUser;
}

function getSearchResult() {
    return `
        <div class="row mt-2 mb-2 border-bottom result">
        <div class="col-3 mb-2"><img class="rounded" alt="..." src="img/nestea.jpg"></div>
        <div class="col-9">
            <h5><a href="product_detail_buyer.html">Nestea Lemon, Pack of 12 cans</a> <small>5 packs</small></h5>
            <p><a href="profile_seller.html">User2</a> posted on <span>Dec 9, 2018</span></p>
        </div></div>

        <div class="row mt-2 mb-2 border-bottom result">
        <div class="col-3 mb-2"><img class="rounded" alt="..." src="img/nestea.jpg"></div>
        <div class="col-9">
            <h5><a href="product_detail_buyer.html">Nestea Lemon, Pack of 12 cans</a> <small>5 packs</small></h5>
            <p><a href="profile_seller.html">User2</a> posted on <span>Dec 9, 2018</span></p>
        </div></div>
        
        <div class="row mt-2 mb-2 border-bottom result">
        <div class="col-3 mb-2"><img class="rounded" alt="..." src="img/nestea.jpg"></div>
        <div class="col-9">
            <h5><a href="product_detail_buyer.html">Nestea Lemon, Pack of 12 cans</a> <small>5 packs</small></h5>
            <p><a href="profile_seller.html">User2</a> posted on <span>Dec 9, 2018</span></p>
        </div></div>`;
}

function addNavContent(user) {
    // Search box input
    const searchInput = document.createElement("form");
    searchInput.className += "form-inline mr-auto";
    // searchInput.setAttribute("action", "/action_page.php");
    const searchTextbox = document.createElement("input");
    searchTextbox.className += "form-control mr-sm-2";
    searchTextbox.setAttribute("type", "text");
    searchTextbox.setAttribute("placeholder", "Search");

    searchTextbox.setAttribute("id", "searchInput");
    $("#topNav").after(`<div class="modal" id="searchrResultModal" tabindex="-1" role="dialog" data-focus=false>
        <div class="modal-dialog" role="document">
            <div class="modal-content"><div class="modal-body p-1 pl-3 pr-3">
                ${getSearchResult()}
            </div></div>
        </div></div>`);
    $("body").on('click', function(){
        $('#searchrResultModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    })
    $("#topNav").on('keypress', '#searchInput',function(){
        console.log("pressed")
        $('#searchrResultModal').modal('show');
    });

    searchInput.appendChild(searchTextbox);
    // searchInput.appendChild(searchBtn);
    $("#topNav").append(searchInput);

    // The rest of the buttons
    const navBtnUl = document.createElement("ul");
    navBtnUl.className += "navbar-nav";

    /// Post button
    const postBtn = document.createElement("li");
    postBtn.className += "nav-item ml-2";
    const postBtnLink = document.createElement("button");
    postBtnLink.className += "btn btn-success nav-link";
    postBtnLink.setAttribute("type", "button");
    postBtnLink.setAttribute("data-toggle","modal");
    postBtnLink.setAttribute("data-target", "#modal");
    postBtnLink.innerHTML = `<svg class="d-md-none d-sm-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"fill="white" /><path d="M0 0h24v24H0z" fill="none" /></svg>`;
    const postBtnSpan = document.createElement("span")
    postBtnSpan.className += "d-none d-md-block";
    postBtnSpan.innerText = "Change password ";
    postBtn.id="myModal";
    postBtnLink.appendChild(postBtnSpan)
    postBtn.appendChild(postBtnLink);

    /// Send invitation button
    const profileBtn = document.createElement("li");
    profileBtn.className += "nav-item ml-2";
    const profileBtnLink = document.createElement("button");
    profileBtnLink.className += "btn btn-success nav-link";
    profileBtnLink.setAttribute("type", "button");
    profileBtnLink.setAttribute("data-toggle","modal2");
    profileBtnLink.setAttribute("data-target", "#modal2");
    profileBtnLink.innerHTML = `<svg class="d-md-none d-sm-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"fill="white" /><path d="M0 0h24v24H0z" fill="none" /></svg>`;
    const profileBtnSpan = document.createElement("span")
    profileBtnSpan.className += "d-none d-md-block";
    profileBtnSpan.innerText = "Send invitation ";
    profileBtn.id="myModal2";
    profileBtnLink.appendChild(profileBtnSpan)
    profileBtn.appendChild(profileBtnLink);

    // Manage users button
    const msgBtn = document.createElement("li");
    msgBtn.className += "nav-item ml-2";
    const msgBtnLink = document.createElement("button");
    msgBtnLink.className += "btn btn-success nav-link";
    msgBtnLink.setAttribute("type", "button");
    msgBtnLink.setAttribute("data-toggle","modal");
    msgBtnLink.setAttribute("data-target", "#modal");
    msgBtnLink.innerHTML = `<svg class="d-md-none d-sm-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"fill="white" /><path d="M0 0h24v24H0z" fill="none" /></svg>`;
    const msgBtnSpan = document.createElement("span")
    msgBtnSpan.className += "d-none d-md-block";
    msgBtnSpan.innerText = "Manage users ";
    msgBtn.id="myModal3";
    msgBtnLink.appendChild(msgBtnSpan)
    msgBtn.appendChild(msgBtnLink);

    // Manage canvas button
    const mgcsBtn = document.createElement("li");
    mgcsBtn.className += "nav-item ml-2";
    const mgcsBtnLink = document.createElement("button");
    mgcsBtnLink.className += "btn btn-success nav-link";
    mgcsBtnLink.setAttribute("type", "button");
    mgcsBtnLink.setAttribute("data-toggle","modal");
    mgcsBtnLink.setAttribute("data-target", "#modal");
    mgcsBtnLink.innerHTML = `<svg class="d-md-none d-sm-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"fill="white" /><path d="M0 0h24v24H0z" fill="none" /></svg>`;
    const mgcsBtnSpan = document.createElement("span")
    mgcsBtnSpan.className += "d-none d-md-block";
    mgcsBtnSpan.innerText = "Manage canvas ";
    mgcsBtn.id="myModal4";
    mgcsBtnLink.appendChild(mgcsBtnSpan)
    mgcsBtn.appendChild(mgcsBtnLink);


    /// Logout button
    const logoutBtn = document.createElement("li");
    logoutBtn.className += "nav-item ml-2";
    const logoutBtnLink = document.createElement("a");
    logoutBtnLink.className += "btn nav-link btn-light";
    logoutBtnLink.setAttribute("href", "index.html");
    logoutBtnLink.innerHTML = `<svg class="d-md-none d-sm-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>`;
    const logoutBtnSpan = document.createElement("span")
    logoutBtnSpan.className += "d-none d-md-block";
    logoutBtnSpan.innerText = `Log Out ${user.name}`;
    logoutBtnLink.appendChild(logoutBtnSpan);
    logoutBtn.appendChild(logoutBtnLink);

    navBtnUl.append(postBtn);
    navBtnUl.append(profileBtn);
    navBtnUl.append(msgBtn);
    navBtnUl.append(mgcsBtn);
    navBtnUl.append(logoutBtn);
    $("#topNav").append(navBtnUl);
}

function main() {
    addNavContent(getUser());
}
$(document).ready(main);