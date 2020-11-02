class Song {
    constructor() {}

    getElement = () => document.getElementsByClassName('container')[0];

    getJsonData = () => fetch('../data/music.json').then(response => response.json()).then(data => data);

    setElementData = (element, contingut) => element.innerHTML += contingut;

    setResetData = (element) => element.innerHTML = '';

    setTitle = (titol) => {
        if (titol == "topten") {
            titol = "Top 10";
        } else if (titol == "biggest") {
            titol = "The Biggest";
        } else {
            titol = titol.charAt(0).toUpperCase() + titol.slice(1); // Inicial amb majúscula
        }
        document.getElementById("titol").innerHTML = titol;
    }

    setColor = (element) => {
        let delColor = document.getElementById('actual');

        if (delColor != null)   // S'elimina el pintat actualment
            delColor.removeAttribute('id');

        document.getElementsByClassName(element)[0].id = 'actual';
    }

}

const loadSongs = (buttonClass) => {

    const init = () => {
        // Primer cop que entra
        if (buttonClass == undefined)
            buttonClass = "overview"

        let musica = new Song();
        let contenidor = musica.getElement();
        musica.setColor(buttonClass);


        musica.getJsonData().then(arrMusica => {

            let arrMusicaNou = [...arrMusica];

            // Afegim els elements
            switch (buttonClass) {
                case "overview":
                    loadOverview(musica, arrMusicaNou, contenidor);
                    break;

                case "topten":
                    loadTenListened(musica, arrMusicaNou, contenidor);
                    break;

                case "biggest":
                    loadBiggest(musica, arrMusicaNou, contenidor);
                    break;

                case "rock":
                case "hip-hop":
                case "indie":
                case "jazz":
                case "reggae":
                    loadByGenre(musica, arrMusicaNou, contenidor, buttonClass);
                    break;
            }

        }).catch(e => console.log(e));
    }

    const printContent = (musica, arrMusica, contenidor) => {
        musica.setResetData(contenidor);
        musica.setTitle(buttonClass);
        arrMusica.map((k, i) =>
            musica.setElementData(contenidor,
                `<li><div><img src="img/play.png" alt="Play"><p>${i+1 + ". " +k.name}</p>
                <p>${k.artist.name}</p></div><div><p>${k.listeners} listeners</p></div></li>`));
    }

    const loadOverview = (musica, arrMusica, contenidor) => printContent(musica, arrMusica, contenidor);

    const loadTenListened = (musica, arrMusica, contenidor) => {
        arrMusica.sort((a, b) => +b.listeners - +a.listeners);
        let resultat = arrMusica.slice(0, 10);
        printContent(musica, resultat, contenidor);
    }

    const loadBiggest = (musica, arrMusica, contenidor) => {
        let biggestArtist = '';

        // Agafem només 1 cop el mateix grup
        let nouArr = new Set();
        arrMusica.map(k => nouArr.add(k.artist.name));
        nouArr = Array.from(nouArr);

        // Per cada grup, s'agrupa la suma dels listeners
        let sumaListeners = [];
        nouArr.map((k, i) => {
            let artAgrupat = arrMusica.filter((el) => el.artist.name == k);
            let suma = 0;

            artAgrupat.map((k, i) => suma += +k.listeners);

            sumaListeners.push({
                nom: k,
                suma: suma
            });
        });

        // S'ordena el nou array pels listeners
        sumaListeners.sort((a, b) => b.suma - a.suma);

        // Agafem el grup amb el valor listener més gran
        biggestArtist = sumaListeners[0].nom;

        // Agafem totes les músiques del grup anterior
        let resultat = arrMusica.filter(el => el.artist.name == biggestArtist);

        printContent(musica, resultat, contenidor);
    }

    const loadByGenre = (musica, arrMusica, contenidor, genero) => {
        let resultat = arrMusica.filter(el => el.genre == genero);
        printContent(musica, resultat, contenidor);
    }

    window.onload = init();
}

loadSongs();