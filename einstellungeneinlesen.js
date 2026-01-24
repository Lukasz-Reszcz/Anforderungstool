import fs from "fs"

export function getEinstellungen(){
    let obj = null

    fs.readFile("./einstellungen/verbindungsarten.json", "utf8", (err, data) => {
        if(err){
            console.log("Fehler beim Einlesen von Datei: " + err.message);
        }
        else{
            obj = JSON.parse(data);
            for(let i=0; i<3; i++){
                console.log(obj.verbindungsarten[i]);
            }

            return obj;
        }
    })
}