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

// Days go from 0 (sunday) to 6 (saturday)
// La variabile "orari" viene passata dal server nel P con id orari-server
const orariElem = document.getElementById("orari-server");
const orari = JSON.parse(orariElem.textContent);
orariElem.remove();

let materiaAttuale = null;

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
    materiaAttuale = materiaTrovata;

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
            "tag-materia tag is-info is-normal is-light"
        );
        tagSpan.textContent = `${giorni[ora.giorno]} dalle ${ora.da} alle ${
            ora.a
        }`;
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
