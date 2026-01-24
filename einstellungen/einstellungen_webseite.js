let data_1 = `{
            "verbindungsarten":[
                {"typ":"hierarchisch", "farbe":"blue"},
                {"typ":"sequenz", "farbe":"lime"},
                {"typ":"konkurrenz", "farbe":"red"}
            ]
        }`

function getEinstellungen(){
    localStorage.setItem("einstellungen", data_1);
    console.log(data_1)

    return data_1;
}


 
document.getElementById("jsonFile").addEventListener("click", () => {
    const data = getEinstellungen();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const aObj = document.getElementById("jsonFile");
    aObj.href = url;
    aObj.download = "einstellungen.json";
});



document.getElementById("einstellungenHochladen").addEventListener("change", async (event) => {
    const file = document.getElementById("einstellungenHochladen").files[0]; //event.target.files[0];

    const reader = new FileReader();

    let data = await file.text();
    data = JSON.parse(data);

    localStorage.setItem("einstellungen", data);
})

document.getElementById("btnEinstellungHinzufuegen").addEventListener("click", () => {
    const einstellungstext = document.getElementById("einstellungstext").value;
    const einstellungsfarbe = document.getElementById("einstellungsfarbe").value;

    console.log(einstellungstext, einstellungsfarbe);

    // Dient um weitere Verbindungen zu speichern
    // data_1 = localStorage.getItem("einstellungen");

    let dataEnde = data_1.lastIndexOf("\"}")

    data_1 = data_1.slice(0, dataEnde+2) + ",\n" + "{\"typ\":\"" + einstellungstext + "\", \"farbe\":\"" + einstellungsfarbe + "\"}" + 
        data_1.slice(dataEnde+2);

    console.log(data_1);

    //-----------
    localStorage.setItem("option", einstellungstext);

    getEinstellungen();
})
