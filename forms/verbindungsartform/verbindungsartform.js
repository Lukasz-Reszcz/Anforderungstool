let verbindungsarten_text = `{
        "verbindungsarten":[
            {"typ":"hierarchisch", "farbe":"blue"},
            {"typ":"sequenz", "farbe":"lime"},
            {"typ":"konkurrenz", "farbe":"red"}
        ]     
    }`;

let verbindungsarten = JSON.parse(verbindungsarten_text);

export function getVerbindungsarten(){
    return verbindungsarten;
}


document.getElementById("optVerbindungsartHinzufuegen").addEventListener("click", () => {
    document.getElementById("verbindungsarteingabeform").style.visibility = "visible";
});

document.getElementById("verbformschliessen").addEventListener("click", () => {
    document.getElementById("verbindungsarteingabeform").style.visibility = "hidden";
});

document.getElementById("btnVerbindungsartHinzufuegen").addEventListener("click", () => {
    const typ = document.getElementById("einstellungstext").value;
    const farbe = document.getElementById("einstellungsfarbe").value;
    const optionnummer = verbindungsarten.verbindungsarten.length+1;
    
    verbindungsarten.verbindungsarten.push({typ, farbe, optionnummer});

    console.log(verbindungsarten)

    window.verbindungsarten = verbindungsarten;

    let parOption = document.createElement("p");
    parOption.textContent = typ;
    parOption.dataset.value = optionnummer;

    document.getElementById("verbindungsarten").appendChild(parOption);
})