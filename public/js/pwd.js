var oldPassword;

$ ('body').ready(function() {
    $.ajax({
        type: "GET",
        url: "/pwd/get",
        success: function(data) {
            oldPassword = data.pwd;
        }
    });
})

$('#submit').on('click', function() {
    const oldP = document.getElementById("#oldP").value;
    const pwd = document.getElementById("#newP").value;
    const confirmP = document.getElementById("#confirmP").value;

    if (oldP != oldPassword || pwd != confirmP) {
        alert("Cannot change password! Either old password does not match with record or new password does not match with confirm password.")
    } else {
        var send = {pwd};

        $.ajax({
            type: "POST",
            url: "/pwd/edit",
            data: send,
            success: function(data) {
                if (data == 'true') {
                    alert("Successfully changed password!")
                } else {
                    alert("Oops! An error occurred. Failed to change password.")
                }
            }
        });
    }
})