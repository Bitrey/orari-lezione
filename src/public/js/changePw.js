function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$("#pw-form").submit(e => {
    e.preventDefault();
    changePassword();
});

function changePassword() {
    const oldPassword = $("#old-password").val();
    const newPassword = $("#new-password").val();

    if (oldPassword === newPassword) {
        return changePasswordError("Le password non possono essere uguali");
    } else if (newPassword.length < 8) {
        return changePasswordError(
            "Nuova password non valida (min 8 caratteri)"
        );
    }

    changePasswordAjax();
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

function changePasswordAjax() {
    return new Promise(async (resolve, reject) => {
        $.ajax({
            type: "post",
            url: "/cambia-password",
            data: {
                password: $("#new-password").val()
            },
            success: xhr => {
                console.log(xhr);
                changePasswordOk();
                resolve();
            },
            error: xhr => {
                console.log(xhr);
                changePasswordError(xhr.responseJSON.err);
                resolve();
            }
        });
    });
}

function changePasswordError(err) {
    $("#pw-success").hide();
    console.log(err);
    $("#pw-error").text(err);
    $("#pw-error").show();
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function changePasswordOk() {
    $("#pw-error").hide();
    $("#pw-success").show();

    setCookie("showPwChanged", "true", 1);
    window.location.href = "/";
}

if (getQueryVariable("tempPw")) {
    $("#pw-info").text(
        "Per usare il sito devi cambiare la password temporanea."
    );
    $("#pw-info").show();
}
