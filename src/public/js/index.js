const oraElem = document.getElementById("ora-attuale");
const dataElem = document.getElementById("data-attuale");

const giorni = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato"
];

let bong = new Audio("/sfx/snapchat.mp3");
let audioTime = 59;
function handleFiles(event) {
    var files = event.target.files;
    bong = new Audio(URL.createObjectURL(files[0]));
}

const pushCb = document.getElementById("do-push");

const currentTitle = document.title;
const playSound = () => {
    const date = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Europe/Rome"
        })
    );
    const { materiaTrovata, prossimaMateria } = trovaMateriaAttuale(date);

    let newTitle =
        (prossimaMateria && prossimaMateria.nome) ||
        (materiaTrovata && materiaTrovata.nome);
    if (newTitle) {
        newTitle = newTitle.toUpperCase();
        setTimeout(() => (document.title = newTitle), 0);
        setTimeout(() => (document.title = currentTitle), 500);
        setTimeout(() => (document.title = newTitle), 1000);
        setTimeout(() => (document.title = currentTitle), 1500);
        setTimeout(() => (document.title = newTitle), 2000);
        setTimeout(() => (document.title = currentTitle), 4000);
    }
    bong.play();
};

document
    .getElementById("sound-upload")
    .addEventListener("change", handleFiles, false);

// Days go from 0 (sunday) to 6 (saturday)
// La variabile "orari" viene passata dal server nel P con id orari-server
const orariElem = document.getElementById("orari-server");
const orari = JSON.parse(orariElem.textContent);
orariElem.remove();

// let materiaAttuale = null;

const trovaMateriaAttuale = date => {
    let prossimaMateria = null;
    const giornoAttuale = date.getDay();
    const oraAttuale = date.getHours();
    const minutiAttuali = date.getMinutes();
    let materiaTrovata;
    let oraTrovata;
    for (const orario of orari) {
        for (const ora of orario.ore) {
            if (
                ora.giorno === giornoAttuale &&
                ora.da <= oraAttuale &&
                ora.a > oraAttuale
            ) {
                materiaTrovata = orario;
                oraTrovata = ora;
            }
            if (
                ora.giorno === giornoAttuale &&
                ora.da === oraAttuale + 1 &&
                (!materiaTrovata || materiaTrovata.nome !== orario.nome)
            ) {
                prossimaMateria = orario;
            }
        }
    }
    // Non fare diretto return orario,
    // altrimenti viene segnata ora passata
    return { materiaTrovata, oraTrovata, minutiAttuali, prossimaMateria };
};

const materiaAttualeElem = document.getElementById("materia-attuale");
const noteMateriaElem = document.getElementById("note-materia");
const noteMateriaSpan = document.getElementById("note-materia-span");
const linkAttualeElem = document.getElementById("link-attuale");

const prossimaMateriaDiv = document.getElementById("prossima-materia-div");
const prossimaMateriaElem = document.getElementById("prossima-materia");
const noteProssimaElem = document.getElementById("note-prossima");
const noteProssimaSpan = document.getElementById("note-prossima-span");
const linkProssimaElem = document.getElementById("link-prossima");

let canPlay = true;
const updateDate = () => {
    const date = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Europe/Rome"
        })
    );

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; //months from 1-12
    const year = date.getUTCFullYear();

    const dayMonthYear = day + "/" + month + "/" + year;

    const strTime = date.toTimeString().split(" ")[0];

    dataElem.textContent = dayMonthYear;
    oraElem.textContent = strTime;

    const {
        materiaTrovata,
        oraTrovata,
        minutiAttuali,
        prossimaMateria
    } = trovaMateriaAttuale(date);
    // materiaAttuale = materiaTrovata;

    if (materiaTrovata) {
        materiaAttualeElem.textContent = `Ora abbiamo ${materiaTrovata.nome} (dalle ${oraTrovata.da} alle ${oraTrovata.a}).`;
        if (materiaTrovata.note) {
            noteMateriaSpan.textContent = materiaTrovata.note;
            noteMateriaElem.style.display = "block";
        } else noteMateriaElem.style.display = "none";

        if (materiaTrovata.link) {
            linkAttualeElem.href = materiaTrovata.link + "?pli=1&authuser=1";
            linkAttualeElem.textContent = materiaTrovata.link;
        } else {
            linkAttualeElem.href = "https://youtu.be/dQw4w9WgXcQ";
            linkAttualeElem.textContent = "non so il link :c";
        }

        linkAttualeElem.style.display = "block";
    } else {
        if (prossimaMateria) {
            materiaAttualeElem.style.display = "none";
        } else {
            materiaAttualeElem.textContent =
                "Ora non abbiamo lezione, in teoria c:";
            materiaAttualeElem.style.display = "block";
        }

        linkAttualeElem.style.display = "none";
        noteMateriaElem.style.display = "none";
    }

    if (prossimaMateria) {
        const countdown = 60 - minutiAttuali;
        prossimaMateriaDiv.style.display = "block";
        prossimaMateriaElem.textContent = `Tra ${countdown} minut${
            countdown === 1 ? "o" : "i"
        } abbiamo ${prossimaMateria.nome}`;
        if (prossimaMateria.note) {
            noteProssimaSpan.textContent = prossimaMateria.note;
            noteProssimaElem.style.display = "block";
        } else noteProssimaElem.style.display = "none";

        // linkProssimaElem.style.display = "block";
        if (prossimaMateria.link) {
            linkProssimaElem.href = prossimaMateria.link + "?pli=1&authuser=1";
            linkProssimaElem.textContent = prossimaMateria.link;
        } else {
            linkProssimaElem.href = "https://youtu.be/dQw4w9WgXcQ";
            linkProssimaElem.textContent = "non so il link :c";
        }
    } else {
        // linkProssimaElem.style.display = "none";
        prossimaMateriaDiv.style.display = "none";
    }

    // Suono
    if (date.getMinutes() == audioTime && date.getSeconds() == 0) {
        if (document.getElementById("do-play-sound").checked) {
            playSound();
        }
        if (canPlay && showNotifications) {
            displayNotification();
            canPlay = false;
            setTimeout(() => (canPlay = true), 1000);
        }
    }
};
updateDate();
setInterval(updateDate, 200);

const materieDiv = document.getElementById("materie");
for (const orario of orari) {
    const cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card");
    cardDiv.setAttribute("id", orario.id);

    const cardContentDiv = document.createElement("div");
    cardContentDiv.setAttribute("class", "card-content");

    const mediaDiv = document.createElement("div");
    mediaDiv.setAttribute("class", "media");

    const mediaContentDiv = document.createElement("div");
    mediaContentDiv.setAttribute("class", "media-content");

    const titleParagraph = document.createElement("p");
    titleParagraph.setAttribute("class", "nome-materia title is-4");
    titleParagraph.textContent = orario.nome;
    mediaContentDiv.append(titleParagraph);

    if (orario.link) {
        const subtitleLink = document.createElement("a");
        subtitleLink.setAttribute("class", "subtitle is-6");
        subtitleLink.textContent = orario.link;
        subtitleLink.href = orario.link + "?pli=1&authuser=1";
        subtitleLink.target = "_blank";
        mediaContentDiv.append(subtitleLink);
    }

    if (orario.note) {
        const notificationDiv = document.createElement("div");
        notificationDiv.style.marginTop = "1rem";
        notificationDiv.setAttribute("class", "notification is-info is-light");
        notificationDiv.textContent = "Nota: " + orario.note;
        mediaContentDiv.append(notificationDiv);
    }

    const oreDiv = document.createElement("div");
    oreDiv.setAttribute("class", "tags are-medium");
    for (const ora of orario.ore) {
        const tagSpan = document.createElement("span");
        tagSpan.setAttribute(
            "class",
            "tag-materia tag is-normal is-light is-info"
            // + (ora.dad ? "is-primary" : "is-info")
        );
        tagSpan.textContent = `${giorni[ora.giorno]} dalle ${ora.da} alle ${
            ora.a
        }`; // ${ora.dad ? " (DAD)" : ""}`;
        oreDiv.append(tagSpan);
    }
    mediaContentDiv.append(oreDiv);

    const tagsDiv = document.createElement("div");
    tagsDiv.setAttribute("class", "tags are-medium");
    for (const tag of orario.tag) {
        const tagSpan = document.createElement("span");
        tagSpan.setAttribute("class", "tag is-primary is-normal is-light");
        tagSpan.textContent = tag;
        tagsDiv.append(tagSpan);
    }
    mediaContentDiv.append(tagsDiv);

    mediaDiv.append(mediaContentDiv);
    cardContentDiv.append(mediaDiv);
    cardDiv.append(cardContentDiv);
    materieDiv.append(cardDiv);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays || 7) * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

// const removeDadWarning = () => {
// document.getElementById("dad-warning").remove();
// setCookie("dadWarning", 1);
// };

const removeGlobalWarning = () => {
    document.getElementById("global-warning").style.display = "none";
    setCookie("globalWarning", 4);
};

// if (getCookie("dadWarning")) removeDadWarning();
// Incrementa a ogni nuovo avviso, così se nuovo avviso utente lo vede
if (getCookie("globalWarning") == 4) removeGlobalWarning();

// Dark theme
let darkTheme = false;
const savedTheme = localStorage.getItem("darkTheme");
if (savedTheme !== null) darkTheme = savedTheme === "true";
else {
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        darkTheme = true;
    } else darkTheme = false;
}

const switchTheme = on => {
    if (on) {
        darkTheme = true;
    } else if (on === false) {
        darkTheme = false;
    } else {
        darkTheme = !darkTheme;
    }
    localStorage.setItem("darkTheme", darkTheme);

    applyTheme();
};

const applyTheme = () => {
    if (darkTheme) {
        document.querySelector(".navbar-menu").classList.add("bg-discord-dark");
        document
            .querySelector(".navbar-brand")
            .classList.add("bg-discord-dark");
        document
            .querySelectorAll(".message-header")
            .forEach(e => e.classList.add("bg-discord-dark"));
        document.querySelector(".title").classList.add("bg-discord-dark");
        document
            .querySelectorAll(".message-body")
            .forEach(e => e.classList.add("bg-discord"));
        document
            .querySelectorAll(".message-body")
            .forEach(e => e.classList.add("text-light"));
        document.querySelector(".message-p").classList.add("text-light");
        document
            .querySelectorAll(".message-title")
            .forEach(e => e.classList.add("text-white"));
        document.querySelector("body").classList.add("bg-discord-light");
        document
            .querySelectorAll(".card")
            .forEach(e => e.classList.add("bg-discord"));
        document
            .querySelectorAll(".title")
            .forEach(e => e.classList.add("text-white"));
        document
            .querySelectorAll(".subtitle")
            .forEach(e => e.classList.add("text-light"));
        document
            .querySelectorAll(".is-info")
            .forEach(e => e.classList.add("bg-discord-light"));
        document
            .querySelectorAll(".is-normal")
            .forEach(e => e.classList.add("text-white"));
        document
            .querySelectorAll(".is-normal")
            .forEach(e => e.classList.add("bg-discord-light"));
        document
            .querySelectorAll(".is-info")
            .forEach(e => e.classList.add("text-white"));
        document
            .querySelectorAll("a")
            .forEach(e => e.classList.add("text-light"));
        document
            .querySelectorAll("span")
            .forEach(e => e.classList.add("text-light"));
        document
            .querySelectorAll(".file-cta")
            .forEach(e => e.classList.add("bg-discord-light"));
        document
            .querySelectorAll(".button-ds")
            .forEach(e => e.classList.add("bg-discord-light"));
        document.querySelectorAll(".svg").forEach(e => (e.style.fill = "#fff"));
    } else {
        document
            .querySelector(".navbar-menu")
            .classList.remove("bg-discord-dark");
        document
            .querySelector(".navbar-brand")
            .classList.remove("bg-discord-dark");
        document
            .querySelectorAll(".message-header")
            .forEach(e => e.classList.remove("bg-discord-dark"));
        document.querySelector(".title").classList.remove("bg-discord-dark");
        document
            .querySelectorAll(".message-body")
            .forEach(e => e.classList.remove("bg-discord"));
        document
            .querySelectorAll(".message-body")
            .forEach(e => e.classList.remove("text-light"));
        document.querySelector(".message-p").classList.remove("text-light");
        document
            .querySelectorAll(".message-title")
            .forEach(e => e.classList.remove("text-white"));
        document.querySelector("body").classList.remove("bg-discord-light");
        document
            .querySelectorAll(".card")
            .forEach(e => e.classList.remove("bg-discord"));
        document
            .querySelectorAll(".title")
            .forEach(e => e.classList.remove("text-white"));
        document
            .querySelectorAll(".subtitle")
            .forEach(e => e.classList.remove("text-light"));
        document
            .querySelectorAll(".is-info")
            .forEach(e => e.classList.remove("bg-discord-light"));
        document
            .querySelectorAll(".is-normal")
            .forEach(e => e.classList.remove("text-white"));
        document
            .querySelectorAll(".is-normal")
            .forEach(e => e.classList.remove("bg-discord-light"));
        document
            .querySelectorAll(".is-info")
            .forEach(e => e.classList.remove("text-white"));
        document
            .querySelectorAll("a")
            .forEach(e => e.classList.remove("text-light"));
        document
            .querySelectorAll("span")
            .forEach(e => e.classList.remove("text-light"));
        document
            .querySelectorAll(".file-cta")
            .forEach(e => e.classList.remove("bg-discord-light"));
        document
            .querySelectorAll(".button-ds")
            .forEach(e => e.classList.remove("bg-discord-light"));
        document
            .querySelectorAll(".svg")
            .forEach(e => (e.style.fill = "#1d72aa"));
    }
};

applyTheme();

const powerCb = document.querySelector("#power-cb");
if (darkTheme) powerCb.checked = true;
powerCb.addEventListener("click", () => {
    switchTheme();
});

// function getCookie(cname) {
//     var name = cname + "=";
//     var decodedCookie = decodeURIComponent(document.cookie);
//     var ca = decodedCookie.split(";");
//     for (var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == " ") {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }
// function setCookie(cname, cvalue, exdays) {
//     var d = new Date();
//     d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
//     var expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }

if (getCookie("showPwChanged") === "true") {
    document.getElementById("pw-info").textContent =
        "Hai cambiato la password!";
    document.getElementById("pw-info").style.display = "block";
    setCookie("showPwChanged", "false");
}

const changeVolume = newVol => {
    const vol = newVol || parseInt(document.getElementById("volume").value);
    document.getElementById("vol-percentage").textContent = vol;
    bong.volume = vol / 100;
    localStorage.setItem("volume", vol);
    return vol;
};

document.getElementById("volume").value = changeVolume(
    localStorage.getItem("volume")
);

document.getElementById("minutes-bong").addEventListener("input", e => {
    const elem = document.getElementById("minutes-bong");

    const insertedNum = parseInt(e.data);
    let totalNum = parseInt(elem.textContent);

    if (!Number.isNaN(totalNum)) {
        if (totalNum < 0) totalNum = 0;
        else if (totalNum > 59) totalNum = 59;
    } else if (
        (Number.isNaN(insertedNum) && Number.isNaN(totalNum)) ||
        !elem.textContent
    ) {
        totalNum = 59;
    }
    audioTime = totalNum;
    elem.textContent = audioTime;
});

const hasPermissions = () =>
    Notification && Notification.permission === "granted";

let showNotifications =
    localStorage.getItem("showNotifications") === "true" && hasPermissions();
pushCb.checked = showNotifications;

pushCb.addEventListener("change", function () {
    if (this.checked) {
        if (hasPermissions()) {
            showNotifications = true;
            localStorage.setItem("showNotifications", showNotifications);
        } else askNotificationPermission();
    } else {
        showNotifications = false;
        localStorage.setItem("showNotifications", showNotifications);
    }
});

// function to actually ask the permissions
function handlePermission() {
    if (
        Notification.permission === "denied" ||
        Notification.permission === "default"
    ) {
        noNotifications();
        pushCb.checked = false;
    }
    showNotifications = true;
    localStorage.setItem("showNotifications", true);
    // Already checked
    // else {
    //     pushCb.checked = true;
    // }
}

function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }

    return true;
}

function askNotificationPermission() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) noNotifications();
    else {
        if (checkNotificationPromise()) {
            Notification.requestPermission().then(permission => {
                handlePermission(permission);
            });
        } else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
}

const noNotifications = () => {
    document.getElementById("content").classList.remove("focus");
    document.getElementById("content").classList.add("blur");
    document.getElementById("no-push").style.display = "block";
};

const displayNotification = () => {
    const date = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Europe/Rome"
        })
    );
    const {
        materiaTrovata,
        prossimaMateria,
        minutiAttuali
    } = trovaMateriaAttuale(date);

    const materia =
        (prossimaMateria && prossimaMateria.nome) ||
        (materiaTrovata && materiaTrovata.nome);
    const s = 60 - minutiAttuali;

    const img = "/icon128.png";
    const text = `${s === 0 ? "Ora" : `Tra ${s} minut${s === 1 ? "o" : "i"}`} ${
        materia
            ? `abbiamo ${materia}`
            : "non c'è niente, hai giusto lezioni.bitrey.it aperto"
    }`;
    new Notification("Orari Lezione 4F", {
        body: text,
        icon: img,
        vibrate: true
    });
};
