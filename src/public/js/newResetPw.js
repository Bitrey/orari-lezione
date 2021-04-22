function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$("#pw-form").submit(e => {
    $("#reset-btn").prop("disabled", true);
    e.preventDefault();
    resetPassword();
});

function resetPassword() {
    const email = $("#login-email").val();

    if (!email || !validateEmail(email)) {
        return resetPasswordError("Email non valida");
    }

    resetPasswordAjax(email);
}

function resetPasswordAjax(email) {
    return new Promise(resolve => {
        $.ajax({
            type: "post",
            url: "/nuovo-reset-password",
            data: { email },
            success: xhr => {
                console.log(xhr);
                resetPasswordOk();
                resolve();
            },
            error: xhr => {
                console.log(xhr);
                resetPasswordError(xhr.responseJSON.err);
                resolve();
            }
        });
    });
}

function resetPasswordError(err) {
    $("#pw-success").hide();
    console.log(err);
    $("#pw-error").text(err);
    $("#pw-error").show();
    $("#reset-btn").prop("disabled", false);
}

function resetPasswordOk() {
    $("#pw-error").hide();
    $("#pw-success").text(
        "Ti è stata inviata una mail con le istruzioni per il cambio password!"
    );
    $("#pw-success").show();
}
