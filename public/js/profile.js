var oldCompany, oldOccupation, oldPhone;

$('body').ready(function() {
    var email = $.cookie("email");
    var emailTextBox = document.querySelector('#email')
    emailTextBox.appendChild(document.createTextNode(email))

    var oldName = $.cookie("name").split(" ");

    var oldFirstName = oldName[0];
    var firstNameTextBox = document.querySelector('#firstName')
    firstNameTextBox.appendChild(document.createTextNode(oldFirstName))

    var oldLastName = oldName[1];
    var lastNameTextBox = document.querySelector('#lastName')
    lastNameTextBox.appendChild(document.createTextNode(oldLastName))

    $.ajax({
        type: "GET",
        url: "/profile/get",
        success: function(data) {
            oldCompany = data.company;
            var companyTextBox = document.querySelector('#company')
            companyTextBox.appendChild(document.createTextNode(oldCompany))

            oldOccupation = data.occupation;
            var occupationTextBox = document.querySelector('#occupation')
            occupationTextBox.appendChild(document.createTextNode(oldOccupation))

            oldPhone = data.phone;
            var phoneTextBox = document.querySelector('#phone')
            phoneTextBox.appendChild(document.createTextNode(oldPhone))
        }
    });
})

$('#save').on('click', function() {
    const firstName = document.getElementById("#firstName").value;
    const lastName = document.getElementById("#lastName").value;
    const company = document.getElementById("#company").value;
    const occupation = document.getElementById("#occupation").value;
    const phone = document.getElementById("#phone").value;

    var name = firstName + " " + lastName;
    
    var send = {name, company, occupation, phone};

    $.ajax({
        type: "POST",
        url: "/profile/edit",
        data: send,
        success: function(data) {
            if (data == 'true') {
                alert("Successfully changed profile!")
            } else {
                alert("Oops! An error occurred. Failed to change profile.")
            }
        }
    });
})