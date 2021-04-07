function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$("#login-form").submit(e => {
    e.preventDefault();
    login();
});

function login() {
    const email = $("#login-email").val();
    const password = $("#login-password").val();

    if (email.length < 1 || !validateEmail(email)) {
        return loginError("Email non valida");
    } else if (password.length < 8) {
        return loginError("Password non valida (min 8 caratteri)");
    }

    loginAjax();
}

function loginAjax() {
    return new Promise(async (resolve, reject) => {
        $.ajax({
            type: "post",
            url: "/login",
            data: {
                email: $("#login-email").val(),
                password: $("#login-password").val()
            },
            success: xhr => {
                console.log(xhr);
                loginOk();
                resolve();
            },
            error: xhr => {
                console.log(xhr);
                loginError(xhr.responseJSON.err);
                resolve();
            }
        });
    });
}

function loginError(err) {
    $("#login-success").hide();
    console.log(err);
    $("#login-error").text(err);
    $("#login-error").show();
}

function loginOk() {
    $("#login-error").hide();
    $("#login-success").show();

    window.location.href = "/";
}
