let verbindungsarten_text = `{
        "verbindungsarten":[
            {"typ":"hierarchisch", "farbe":"blue", "bezeichnung":""},
            {"typ":"sequenz", "farbe":"lime", "bezeichnung":">>"},
            {"typ":"konkurrenz", "farbe":"red", "bezeichnung":"[]"}
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
    const bezeichnung = document.getElementById("einstellungsbezeichnung").value;
    
    verbindungsarten.verbindungsarten.push({typ, farbe, bezeichnung, optionnummer});

    console.log(verbindungsarten)

    window.verbindungsarten = verbindungsarten;

    let parOption = document.createElement("p");
    parOption.textContent = `${typ} (${bezeichnung})`;
    parOption.dataset.value = optionnummer;

    document.getElementById("verbindungsarten").appendChild(parOption);
})