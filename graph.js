import Node from "./node_class.js";
import "./knotenMenue.js";

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

class Graph {
    static register = new Map();

    constructor(){
        graphMaxID += 1;
        this.id = graphMaxID;
        this.knoten = new Array();
        this.kanten = new Array();
        this.size = 0;

        Graph.register.set(this.id, this);

        this.knoten_h = new Node("Knotenbezeichnung");

        this.addKnoten(this.knoten_h);
    }

    static getByID(id){
        return Graph.register.get(id);
    }

    addKnoten(node){
        // Die Menge der Knoten
        if(this.knoten.includes(node.id)){
            return;
        }
        this.knoten.push(node.id);

        // Kanten
        this.size++;
        this.kanten.push([0]);

        // Die letzte Reihe
        for(let i=2; i<this.size; i++){
            this.kanten[this.size-1].push(0);
        }

        // Die Reihe rechts hinzufügen
        for(let i=0; i<this.size; i++){
            // Sonst wird die erste Reihe um ein 0 mehr haben
            if(this.size == 1)  continue;
            this.kanten[i].push(0);
        }

        // Knoten mit dem Graphen verbinden
        // node.graph_id = this.id;
        let gegebenKnoten = Node.getByID(node.id);
        gegebenKnoten.set_graph_id(this.id);             
    }

    loescheKnoten(knoten){
        const knotenid = knoten.id;
        const knotenindex = this.knoten.indexOf(knotenid);

        // Knoten unsichtbar machen
        knoten.el.style.visibility = "hidden";

        // Knoten aus der Liste loeschen
        this.knoten.splice(knotenindex, 1);
        
        // Verbindungen loeschen
        for(let zeile of this.kanten){
            zeile.splice(knotenindex, 1);
        }
        
        this.kanten.splice(knotenindex, 1);
    }

    addConnection(nodexid, nodeyid, con){
        const knotenx = this.knoten.indexOf(nodexid);
        const knoteny = this.knoten.indexOf(nodeyid);

        console.log("Knotenx: " + knotenx);
        console.log("Knoteny: " + knoteny);
        console.log(this.kanten);

        this.kanten[knotenx][knoteny] = con;

        console.log(this.kanten);
    }

    zeichneVerbindungen(){
        let canvas = document.getElementById("myCanvas"); //
        let ctx = canvas.getContext("2d");
    

        let verschiebung = 0;
        let paragraphenhoehe = parseInt(document.getElementById("ausgabetest").clientHeight) + 16;

        // Einmalig bei der Etappenwechseln von einem Graphen
        if(graphenVerbindenZustand){
            const knoten = document.querySelectorAll(".draggable-el");
            verschiebung = parseInt(document.getElementById('nodec').clientWidth);
            for(const element of knoten){
                element.style.left = `${parseInt(element.style.left) + verschiebung}px`;
            }

            graphenVerbindenZustand = false;
        }

        if(modellEtappe === 2){
            verschiebung = parseInt(document.getElementById('nodec').clientWidth);
            canvas = document.getElementById("myCanvasPlanung"); //
            ctx = canvas.getContext("2d");
        }

        // Es wird nur ein Graph gezeichnet
        for (let i=0; i<this.knoten.length; i++){
            for (let j=0; j<this.knoten.length; j++){
                if(this.kanten[i][j] > 0){ // Ist diese Bedingung noch nötig?
                    // If in effizientere Struktur umwandeln, wie z.B. switch
                    if(this.kanten[i][j] === 1){
                        ctx.strokeStyle = "blue";
                    }
                    if(this.kanten[i][j] === 2){
                        ctx.strokeStyle = "lime";
                    }
                    if(this.kanten[i][j] === 3){
                        ctx.strokeStyle = "red";
                    }

                    const knotenx = Node.getByID(this.knoten[i]);
                    const knoteny = Node.getByID(this.knoten[j]);

                    ctx.beginPath();
                    ctx.moveTo(parseInt(knotenx.el.style.left) - verschiebung, parseInt(knotenx.el.style.top) - paragraphenhoehe);
                    ctx.lineTo(parseInt(knoteny.el.style.left) - verschiebung, parseInt(knoteny.el.style.top) - paragraphenhoehe);
                    
                    ctx.stroke();
                }
            }
        }
    }

    getVerbindung(id1, id2){
        let indx1 = this.knoten.indexOf(id1);
        let indx2 = this.knoten.indexOf(id2);

        /*
        if(indx1 > indx2){
            const indxh = indx1;
            indx1 = indx2;
            indx2 = indxh;
        }
        */

        return this.kanten[indx1][indx2];
    }
}

function newNode(){
    const knoten = new Node("Test");
}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function setGraphenflaechen(){
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = document.getElementById("nodec").clientWidth;
    canvas.height = document.getElementById("nodec").clientHeight;

    const canvas1 = document.getElementById("myCanvasPlanung");
    // canvas1.getContext("2d");
    canvas1.width = document.getElementById("planung").clientWidth;
    canvas1.height = document.getElementById("planung").clientHeight;

    const canvas2 = document.getElementById("myCanvasPlanungSoll");
    // canvas2.getContext("2d");
    canvas2.width = document.getElementById("soll-modell").clientWidth;
    canvas2.height = document.getElementById("soll-modell").clientHeight;

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

        hauptgraph.addConnection(1, 2, 1);
        hauptgraph.addConnection(1, 3, 1);
        hauptgraph.addConnection(2, 3, 2);
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
    // else {
    //     alert("Es sind bereits zwei Graphen vorhanden");
    //     return;
    // }
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
        }
        hauptgraph_1 = null;

        graphenVerbindenZustand = true;
        modellEtappe = 2;
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
    teilgraph.zeichneVerbindungen();

    console.log(teilgraph);

    return gemeinsameKnoten;
}

function zeichneVerbindung(){
    leereVerbindungen();

    for(const graph of Graph.register){
        graph[1].zeichneVerbindungen();
    }

    // hauptgraph.zeichneVerbindungen();
    // if(hauptgraph_1 != null)    hauptgraph_1.zeichneVerbindungen();
}

// loesche Verbindung - verwirrend mit tatsächlichem Löschen
// leere von leeren
function leereVerbindungen(){
    // Später mit for-Schleife umsetzen
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const canvas1 = document.getElementById('myCanvasPlanung');
    let ctx1 = canvas1.getContext('2d');
    ctx1.clearRect(0,0, canvas1.width, canvas1.height);
}

//=========================================================
// 
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
//===============================================================
document.getElementById("TeilgraphenFinden").addEventListener('click', () => {
    let res = findeGemeinsamenTeilgraphen();

    console.log(res);
})
