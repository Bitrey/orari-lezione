# Link lezioni

Uno strumento semplicissimo per salvare in uno spazio unico il link delle lezioni online di tutte le materie.
Creato per la 4F, adattabile a ogni classe.

Il frontend è scritto in JavaScript, il backend in [TypeScript](https://www.typescriptlang.org/ "TypeScript") e utilizza [Node.js](https://nodejs.org/ "Node.js"), il view engine [EJS](https://ejs.co/ "EJS") e [Helmet JS](https://helmetjs.github.io/ "Helmet JS") per usare header sicuri.

### Come usarlo per la propria classe

-   Clona il repository con `git clone https://github.com/Bitrey/orari-lezione.git`
-   Entra nella cartella e scarica le dependencies con `npm install`
-   Opzionalmente, crea un file `.env` nella cartella root dove imposti le variabili d'ambiente PORT e IP.
-   Cambia gli orari nel file `src/public/json/orari.json`
    Il formato è il seguente:

```json
[
    {
        "id": "id-della-materia",
        "nome": "nome della materia",
        "link": "link della lezione",
        "note": "alcune note aggiuntive, letteralmente qualunque cosa",
        "tag": ["alcuni", "tag", "pertinenti"],
        "ore": [
            {
                "giorno": 1,
                "da": 10,
                "a": 12
            },
            {
                "giorno": 3,
                "da": 8,
                "a": 10
            }
        ]
    }
]
```

Alla proprietà `giorno` dentro l'array di oggetti `ore` va assegnato il numero di un giorno, che vanno da 0 (domenica) a 6 (sabato).
La proprietà `note` è opzionale, le restanti sono obbligatorie.

-   Rimuovi eventuali riferimenti alla 4F (tipo nel titolo e nella navbar) e all'ITIS Fermi (nella navbar).
-   Fai partire il server in modalità debug con `npm run start:dev`
-   Fatti i tuoi debug, fai partire il server come se fosse in produzione con `npm start`, il codice in TypeScript verrà transpilato in JavaScript ES6.
-   Puoi accedere al sito andando all'indirizzo stampato nella console.

Se ti piace questo strumento, [un eurino non lo butto mai c:](https://www.paypal.me/alessandroamella "un eurino non lo butto mai c:")
