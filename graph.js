import Node from "./node_class.js";
import "./knotenMenue.js";
import Graph from "./graph_class.js";

// globale Variablen
window.nodeMaxID = 0;
window.graphMaxID = 0;
window.verbindenAktiv = false;

window.verbindungKnotenHinzugefuegt = false;

window.verbinden_graph_id = 0;

// Verbindung Von - Nach
window.verbindungVon = 0;
window.verbindungNach = 0;

// Zwei vorhandene Graphen
window.hauptgraph = null;
window.hauptgraph_1 = null;

window.aktiverKnoten = null;

// Verbindungsoptionen
window.optionnummer = 3;


function newNode(){
    let knoten = new Node("Test");
    knoten.el.className = "draggable-el-freierKnoten";

}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function zeichneGraphenrauemenrahmen(){
    const graphenraumbreite = canvas.width / 3;

    for(let i=0; i<3; i++){
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.moveTo((i+1)*graphenraumbreite, 0);
        ctx.lineTo((i+1)*graphenraumbreite, canvas.height);
        ctx.stroke();
    }
    ctx.lineWidth = 1;
}

function setGraphenflaechen(){
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = document.getElementById("hauptcontainer").clientWidth;
    canvas.height = document.getElementById("hauptcontainer").clientHeight;

    zeichneGraphenrauemenrahmen();
}

setGraphenflaechen();

// Den Graphen erstellen (die Verbindungen)


function newGraph(){
    if(hauptgraph == null){
        hauptgraph = new Graph();
        const knoten1 = new Node("Anforderung");
        
        knoten1.el.style.left = "0px";
        knoten1.el.style.top = "200px";

        const knoten2 = new Node("Test1");
        // const knoten3 = new Node("Test3");

        knoten2.el.style.left = "200px";
        knoten2.el.style.top = "200px";

        hauptgraph.addKnoten(knoten1);
        hauptgraph.addKnoten(knoten2);

        console.log(knoten1);

        hauptgraph.addConnection(hauptgraph.knoten_h.id, knoten1.id, 1);
        hauptgraph.addConnection(hauptgraph.knoten_h.id, knoten2.id, 1);
        hauptgraph.addConnection(knoten1.id, knoten2.id, 2);
    }
    else if (hauptgraph_1 == null){
        hauptgraph_1 = new Graph();

        const knoten2 = new Node("Anforderung");
        hauptgraph_1.addKnoten(knoten2);
        hauptgraph_1.addConnection(hauptgraph_1.knoten_h.id, knoten2.id, 1);

        const knoten12 = new Node("Neuer Graph");
        hauptgraph_1.addKnoten(knoten12);

        // Richtig platzieren
        hauptgraph_1.knoten_h.el.style.top = "50px";
        hauptgraph_1.knoten_h.el.style.left = "400px";

        knoten2.el.style.top = "200px";
        knoten2.el.style.left = "400px";

        knoten12.el.style.top = "400px";
        knoten12.el.style.left = "400px";

        hauptgraph_1.addConnection(hauptgraph_1.knoten_h.id, knoten2.id, 1);
        hauptgraph_1.addConnection(hauptgraph_1.knoten_h.id, knoten12.id, 1);
        hauptgraph_1.addConnection(knoten2.id, knoten12.id, 2);
    }
    else{
        graph = new Graph();
    }
}

let graphenVerbindenZustand = false;
let modellEtappe = 1;

function graphenVerbinden(){
    const graph1 = hauptgraph;
    const graph2 = hauptgraph_1;

    let verbindungGefunden = false;
    
    // Verbindung "2" suchen
    let wx = -1;
    let wy = -1;
    
    for(let i=0; i<graph1.knoten.length; i++){
        for(let j=0; j<graph1.knoten.length; j++){
            // alert("i: " + i + graph1.kanten[i][j]);
            if(graph1.kanten[i][j] == 2){
                if(graph2.kanten[i][j] == 2){
                    verbindungGefunden = true;
                    wx = i;
                    wy = j;

                    i = graph1.knoten.length;
                    break;
                }
            }   
        }
    }

    if(verbindungGefunden){
        //
        let graph_kopie1 = graph1.clone();
        let graph_kopie2 = graph2.clone();

        let knotenKopieG1 = new Node(Node.getByID(hauptgraph.knoten[wy]).info);

        console.log(knotenKopieG1);
        
        // Knoten "B" in Fantasma umwandeln (abstraktes Ziel)
        let abstraktKnoten = Node.getByID(hauptgraph.knoten[wy]);
        abstraktKnoten.text = "Fantasma";

        // Testmäßig - später Verändern
        abstraktKnoten.par.textContent = abstraktKnoten.text;
        hauptgraph.addKnoten(knotenKopieG1);


        let knotenKopieG2 = Node.getByID(hauptgraph_1.knoten[wy]);
        knotenKopieG2.set_graph_id(0);
        hauptgraph_1.knoten

        hauptgraph.addKnoten(knotenKopieG2); // Wie verhält sich die ID?

        hauptgraph.addConnection(abstraktKnoten.id, knotenKopieG1.id, 1);
        hauptgraph.addConnection(abstraktKnoten.id, knotenKopieG2.id, 1);
        hauptgraph.addConnection(knotenKopieG1.id, knotenKopieG2.id, 3);

        // Den zweiten Graphen löschen
        for(let i=0; i<hauptgraph_1.knoten.length; i++){
            if(hauptgraph_1.knoten[i] === knotenKopieG2.id){
                continue;
            }
            Node.getByID(hauptgraph_1.knoten[i]).el.style.visibility = "hidden";
            hauptgraph_1.loescheKnoten(hauptgraph_1.knoten[i]);
        }
        hauptgraph_1 = null;

        graphenVerbindenZustand = true;
        
        // Graphen neu zeichnen
        zeichneVerbindung();
        // graphenVerbindenZustand = false;
    }

    /*
    if(wx != -1){
        // A -> B und A -> C
        const knot1 = new Node("Fantasma");
        const knot2 = graph1.knoten[wy];
        const knot3 = graph2.knoten[wy];

        // Verbindung löschen
        graph1.kanten[wx][wy] = 0; 
        // graph1.knoten[2].info = "Fantasma"; // 2

        graph1.addKnoten(knot1); // 3
        graph1.addKnoten(knot2); // 2
        graph1.addKnoten(knot3); // 5

        graph1.addConnection(0, 3, 1); 
        graph1.addConnection(3, 2, 1);
        graph1.addConnection(3, 5, 1);
        graph1.addConnection(2, 5, 3);

        for( let i=0; i<graph2.knoten.length; i++){
            graph2.knoten[i].el.className = "draggable-el-del";
        }

        // Den Knoten aus dem zweiten Graphen. der zu dem ersten
        // übernommen wurde die Farbe des ersten geben
        knot3.el.className = "draggable-el";
    }
    */
}

function findeGemeinsamenTeilgraphen(){
    const graph1 = hauptgraph;
    const graph2 = Graph.getByID(2);
    let gemeinsameKnoten = [];

    console.log(graph2);

    // Gemeinsame Knoten finden
    for(let i=0; i < graph1.knoten.length; i++){
        for(let j=0; j < graph2.knoten.length; j++){
            const knoten1 = Node.getByID(graph1.knoten[i]);
            const knoten2 = Node.getByID(graph2.knoten[j]);

            if(knoten1.info === knoten2.info){
                gemeinsameKnoten.push([knoten1, knoten2]);
            }
        }
    }

    // const knotentt = ergebnis[0][0];
    // knotentt.el.style.backgroundColor = "red";
    let teilgraph = new Graph();
    //teilgraph.loescheKnoten(teilgraph.knoten_h);
    let graphenMap = new Map();

    for(let i=0; i<gemeinsameKnoten.length; i++){
        const knoten = gemeinsameKnoten[i][0].clone();
        knoten.el.style.backgroundColor = "yellow";
        teilgraph.addKnoten(knoten);
        graphenMap.set(gemeinsameKnoten[i][0].id, knoten.id);
    }

    for(let i=0; i<gemeinsameKnoten.length; i++){
        for(let j=i+1; j<gemeinsameKnoten.length; j++){

            console.log(i, j);
            console.log(graph1.getVerbindung(gemeinsameKnoten[i][0].id, gemeinsameKnoten[j][0].id));
            console.log(graph2.getVerbindung(gemeinsameKnoten[i][1].id, gemeinsameKnoten[j][1].id));
            
            if(graph1.getVerbindung(gemeinsameKnoten[i][0].id, gemeinsameKnoten[j][0].id) === 
               graph2.getVerbindung(gemeinsameKnoten[i][1].id, gemeinsameKnoten[j][1].id)){             

                teilgraph.addConnection(graphenMap.get(gemeinsameKnoten[i][0].id), 
                    graphenMap.get(gemeinsameKnoten[j][0].id), 
                    graph1.getVerbindung(gemeinsameKnoten[i][0].id, gemeinsameKnoten[j][0].id))
            }
        }
    }

    teilgraph.loescheKnoten(teilgraph.knoten_h);

    // Den Knoten finden, der nur hierarchische Verbindungen hat
    let hauptknotenGefunden = false;
    let hauptknotenID = 0;
    for(let i=0; i<teilgraph.knoten.length; i++){
        for(let j=0; j<teilgraph.knoten.length; j++){
            if(teilgraph.kanten[i][j] > 1){
                break;
            }
            if(j === teilgraph.knoten.length-1){
                hauptknotenGefunden = true;
                hauptknotenID = teilgraph.knoten[i];
            }
        }
        if(hauptknotenGefunden){
            break;
        }
    }

    // Prüfen, ob die Verbindungen zu dem Knoten rein- oder rausgehen
    // Als eine Funktion schreiben
    let verbindungsart1 = null;
    let verbindungsart2 = null
    for(const knoten1 of graph1.knoten){
        if(Node.getByID(hauptknotenID).info === Node.getByID(knoten1).info){
            hauptknotenID = knoten1;
        }
    }

    const knotenPosition = graph1.knoten.indexOf(hauptknotenID);
    for(let i=0; i<graph1.knoten.lenght; i++){
        if(graph1.kanten[i][knotenPosition] >= 2){
            verbindungsart1 = "rein";
            break;
        }
    }

    for(let i=0; i<graph1.knoten.lenght; i++){
        if(graph1.kanten[knotenPosition][i] >= 2){
            verbindungsart1 = "raus";
            break;
        }
    }

    for(const knoten2 of graph2.knoten){
        if(Node.getByID(hauptknotenID).info === Node.getByID(knoten2).info){
            hauptknotenID = knoten2;
        }
    }

    const knotenPosition1 = graph2.knoten.indexOf(hauptknotenID);

    for(let i=0; i<graph2.knoten.lenght; i++){
        if(graph2.kanten[i][knotenPosition1] >= 2){
            verbindungsart2 = "rein";
            break;
        }
    }

    for(let i=0; i<graph2.knoten.lenght; i++){
        if(graph2.kanten[knotenPosition1][i] >= 2){
            verbindungsart2 = "raus";
            break;
        }
    }

    console.log(verbindungsart1, verbindungsart2);
    
    



    teilgraph.zeichneVerbindungen();
}

export function zeichneVerbindung(){
    leereVerbindungen();

    zeichneGraphenrauemenrahmen();

    for(const graph of Graph.register){
        graph[1].zeichneVerbindungen();
    }
}

// loesche Verbindung - verwirrend mit tatsächlichem Löschen
// leere von leeren
function leereVerbindungen(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

function findeUnteknoten(graphID, knotenID){
    let unterknoten = [];

    const graph = Graph.getByID(graphID);
    const indxVon = graph.knoten.indexOf(knotenID);

    for(let i=0; i<graph.knoten.length; i++){
        if(graph.kanten[indxVon][i] > 0){
            unterknoten.push(graph.knoten[i]);
        }
    }

    for(const knoten of unterknoten){
        return unterknoten.concat(findeUnteknoten(graphID, knoten));
    }

    return unterknoten;
}

function loescheUnterknoten(graphID, unterknoten){
    const graph = Graph.getByID(graphID);
    
    let uk = new Set(unterknoten);
    for(const knoten of uk){
        graph.loescheKnoten(Node.getByID(knoten));
    }
}

//=========================================================
document.getElementById("btnNeuerGraph").addEventListener('click', (event) => {
    newGraph();
})
document.getElementById("btnGraphenVerbinden").addEventListener('click', (event) => {
    graphenVerbinden();
})
document.getElementById("btnNeuerKnoten").addEventListener('click', (event) => {
    newNode();
})
document.getElementById("btnZeichneVerbindung").addEventListener('click', (event) => {
    zeichneVerbindung();
})

document.getElementById("verbunden").addEventListener("onchange", () => {
    alert("Hola");
    if(document.getElementById("verbunden").textContent === "verbunden"){
        zeichneVerbindung();
        document.getElementById("verbunden").textContent = null;
    }
})

//===============================================================
document.getElementById("TeilgraphenFinden").addEventListener('click', () => {
    let res = findeGemeinsamenTeilgraphen();

    console.log(res);
})

document.getElementById("knotenAutomatisieren").addEventListener('click', () => {
    const graphid = Node.aktiverKnoten.graph_id;
    const knotenid = Node.aktiverKnoten.id;

    let uk = findeUnteknoten(graphid, knotenid);
    loescheUnterknoten(graphid, uk);
})

document.getElementById("graphenKopieren").addEventListener('click', (event) => {
    console.log(event);
    Graph.register.get(Node.aktiverKnoten.graph_id).clone();
})

document.getElementById("verbindungsarten").addEventListener("click", () => {
    //------------
    let sel = document.getElementById("verbindungsarten");
    let option = document.createElement("option");
    option.text = localStorage.getItem("option");
    
    if(sel.options[window.optionnummer-1].text != option.text){
        window.optionnummer++;
        option.value = window.optionnummer;
    
        sel.add(option);
    }
    //------------------
})

document.getElementById("graphenLaden").addEventListener("click", async () => {
    let graphenDatei = document.getElementById("graphenDatei").files[0];

    let graphJSON = await graphenDatei.text();

    graphJSON = JSON.parse(graphJSON);

    console.log(graphJSON);

    for(let i=0; i<graphJSON.knoten.length; i++){
        let knoten = new Node(graphJSON.knoten[i].info);
        knoten.el.style.left = graphJSON.knoten[i].pos_x;
        knoten.el.style.top = graphJSON.knoten[i].pos_y;
    }

    for(let i=0; i<graphJSON.graphen.length; i++){
        let graph = new Graph();
        graph.loescheKnoten(graph.knoten_h);
        for(const graphen_knoten of graphJSON.graphen[i].knoten){
            console.log(graphen_knoten);
            graph.addKnoten(graphen_knoten);
        }

        for(const graphen_kanten of graphJSON.graphen[i].kanten){
            console.log(graphen_kanten);
            graph.addConnection(graphen_kanten.von, graphen_kanten.nach, graphen_kanten.typ);
        }
    }
    // Einen Knoten erstellen
})

document.getElementById("nachIstAbstrakt").addEventListener("click", () => {
    graphenVerschieben(1);
});
document.getElementById("nachSollAbstrakt").addEventListener("click", () => {
    graphenVerschieben(2);
});


function graphenVerschieben(stand){
    let breite = document.getElementById("myCanvas").clientWidth/3;

    for(let knoten of Node.register){
        if(knoten[1].stand == stand){
            knoten[1].stand++;
            if(knoten[1].stand == 4)    knoten[1].stand--;
            knoten[1].el.style.left = `${parseInt(knoten[1].el.style.left) + breite}px`;
        }
    }
}
