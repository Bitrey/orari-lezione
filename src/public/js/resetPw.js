$("#pw-form").submit(e => {
    $("#reset-btn").prop("disabled", true);
    e.preventDefault();
    resetPassword();
});

function resetPassword() {
    const password = $("#new-password").val();
    const password2 = $("#new-password-2").val();

    if (password !== password2) {
        return resetPasswordError("Le due password non corrispondono");
    } else if (!password || password.length < 8) {
        return resetPasswordError(
            "Nuova password non valida (min 8 caratteri)"
        );
    }

    resetPasswordAjax(password);
}

function resetPasswordAjax(password) {
    return new Promise(async (resolve, reject) => {
        $.ajax({
            type: "post",
            url: window.location.href,
            data: { password },
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
    $("#pw-success").html(
        `Password cambiata con successo! Ora puoi fare il <a href="/login">login</a>`
    );
    $("#pw-success").show();
}
