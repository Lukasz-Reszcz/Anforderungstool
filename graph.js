import Node from "./node_class.js";

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

// class Node {
//     // Hilft, um später die Knoten aus IDs zu finden
//     static register = new Map();
    
// 	constructor(info){
//         // ID
//         nodeMaxID += 1;
//     	this.id = nodeMaxID;
//         this.graph_id = 0;
//         Node.register.set(this.id, this);
        
//         // Blätter
// 		this.left = null;
//         this.right = null;

//         // Info
//         this.info = info; //"Anforderung";  
//         this.anforderungsquelle = null;

//         // DeKnoten
//         this.make_knoten();
//         this.make_draggable();

//         this.isDragging = false;
//         this.activeElement = null;

//         // Menu
//         this.addMenu();
//         this.aktiveMenuOption = null;
//     }

//     static getByID(id){
//         return Node.register.get(id);
//     }
    
//     append(direction, info){
//     	if(direction == "left"){
//         	this.left = new Node(info);
//         }
//         else if(direction == "right"){
//         	this.right = new Node(info);
//         }
//     }

//     set_graph_id(gid){
//         this.graph_id = gid; 
//     }

//     set_info(info){
//         this.info = info;
//     }
    
//     print_graph(){
//         console.log(this.id + " " + this.info);
//         if(this.left != null){
//             this.left.print_graph();
//         }
//         if(this.right != null){
//             this.right.print_graph();
//         }
//     }

//     search(text){
//         // Debug
//         // console.log("Text: " + text + " Info: " + this.info);

//         if(this.info == text){
//             return  this.id;
//         }

//         let result = null;
        
//         if(this.left != null){
//             result = this.left.search(text);
//             if (result != null)  return result;
//         }
//         if(this.right != null){
//             result = this.right.search(text);
//             if (result != null)  return result;
//         }

//         // Der Text wurde nicht gefunden
//         return -1;
//     }

//     set_anforgerungsquelle(aquelle){
//         this.anforderungsquelle = aquelle;
//     }

//     make_knoten(){
//         // Den Knoten auf einer Stelle setzen (oben links)
//         this.el = document.createElement("div");
//         this.el.className = "draggable-el";
//         this.el.id = this.id;

//         const graphContainer = document.getElementById("nodec");
        
//         this.el.style.position = "absolute";
//         this.el.style.left = "50px";
//         this.el.style.top = "50px"; 

//         // Änderbares Textfeld
//         this.par = document.createElement("p");
//         this.par.contentEditable = true;
//         this.par.textContent = this.info;
//         this.el.appendChild(this.par);

//         // Menü
//         this.menuContainer = document.createElement("div");
//         this.menuContainer.id = "menu";
//         this.menuContainer.className = "dropdown-content";

//         // make a menu options
//         this.menuOption = document.createElement("a");
//         this.menuOption.className = "menuOption";
//         this.menuOption.textContent = "verbinden";

//         this.menuOption_info = document.createElement("a");
//         this.menuOption_info.className = "menuOption";
//         this.menuOption_info.textContent = "Knoteninfo";
        
//         this.menuContainer.appendChild(this.menuOption);
//         this.menuContainer.appendChild(this.menuOption_info);
        
//         this.el.appendChild(this.menuContainer);

//         graphContainer.appendChild(this.el);
//     }

//     make_draggable(){
//         this.el.addEventListener('mousedown', (event) => {
//             // Wenn der Knoten zwar angeclicked wurde, aber mit dem Zweck um zwei Knoten
//             // zu verbinden
//             if(event.target.nodeName == "A") {
//                 return;
//             }

//             this.activeElement = event.currentTarget;
//             this.activeElement.style.zIndex = 100;
//             this.isDragging = true;
//             lastX = event.target.clientX;
//             lastY = event.target.clientY;
//             this.computedStyleMap.cursor = "grabbing";
//         })

//         this.el.addEventListener('mouseup', (event) => {
//             this.activeElement = null;
//             this.isDragging = false;

//             event.currentTarget.style.zIndex = 1;
//         })

//         this.el.addEventListener('mousemove', (event) =>{ // Target hinzugefügt
//             if(this.activeElement == null) {
//                 return;
//             }

//             const deltaX = event.clientX - lastX;
//             const deltaY = event.clientY - lastY;
        
//             const elementX = parseInt(window.getComputedStyle(this.el).getPropertyValue('left'));
//             const elementY = parseInt(window.getComputedStyle(this.el).getPropertyValue('top'));
        
//             this.el.style.left = `${elementX + deltaX}px`;
//             this.el.style.top = `${elementY + deltaY}px`;

//             lastX = event.clientX;
//             lastY = event.clientY;
//         })
//     }

//     // Funktionalitäten zum Munü
//     addMenu(){
//         this.el.addEventListener('contextmenu', (event) => {
//             event.preventDefault();
//             // event.currentTarget.classList.toggle("show");
//             // document.getElementById("menu").classList.toggle("show");

//             // # - ID
//             // .p - className
//             this.el.querySelector("#menu").classList.toggle("show");            
//         })

//         const menuOptions = this.el.querySelectorAll(".menuOption");
//         for(const mOpt of menuOptions){
//             mOpt.addEventListener('mousedown', (event) => {
//                 if(mOpt.textContent == "verbinden"){
//                     if(verbindenAktiv){
//                         document.getElementById("ausgabetest").textContent += " - verbunden mit ID: " + 
//                             // verbinden->Menü->Knoten
//                             event.target.parentElement.parentElement.id;

//                         // this.graph_id = verbinden_graph_id;
            
//                         // Verbindung
//                         verbindungNach = this.id;

//                         // Debug
//                         console.log("(0) VerbindungVon: " + verbindungVon +
//                             "\nVerbindungNach: " + verbindungNach);

//                         // Knoten aus verschiedenen Graphen
//                         // Keiner der Knoten gehört einem Graphen
//                         const knotenVon = Node.getByID(verbindungVon);
//                         const knotenNach = Node.getByID(verbindungNach);

//                         // Debug
//                         console.log(knotenNach);
//                         console.log("(1) VerbindungVon: " + knotenVon.graph_id +
//                             "\nVerbindungNach: " + knotenNach.graph_id);


//                         if(((knotenVon.graph_id !== 0 && knotenNach.graph_id !== 0) && 
//                                 (knotenVon.graph_id != knotenNach.graph_id)) || 
//                             (knotenVon.graph_id === 0 && knotenNach.graph_id === 0)){
//                                 alert("Die Verbindung kann nicht hergestellt werden");
//                                 return;
//                         }

//                         // Im welchen Graphen 
//                         // const knotenVon = Node.getByID(verbindungVon);
//                         if(hauptgraph.knoten.includes(verbindungVon)){
//                             hauptgraph.addKnoten(knotenNach);
//                             hauptgraph.addConnection(verbindungVon, verbindungNach, 1);
//                         }
//                         else if((hauptgraph_1 != null) && (hauptgraph_1.knoten.includes(verbindungVon))){
//                             hauptgraph_1.addKnoten(knotenNach);
//                             hauptgraph_1.addConnection(verbindungVon, verbindungNach, 1);
//                         }
//                         // KnotenVon ist keinem Graphen zugewiesen
//                         else{
//                             let graphAktuell = knotenNach.graph_id;
//                             if(graphAktuell === 1){
//                                 graphAktuell = hauptgraph;
//                             }
//                             else if(graphAktuell === 2){
//                                 graphAktuell = hauptgraph_1;
//                             }

//                             graphAktuell.addKnoten(knotenVon);
//                             graphAktuell.addConnection(verbindungVon, verbindungNach, 1);
//                         }

//                         // Debug
//                         console.log("(2) VerbindungVon: " + verbindungVon +
//                             "\nVerbindungNach: " + verbindungNach);


//                         // Verbindung von innen aufbauen
//                         /*
//                         if(!verbindungKnotenHinzugefuegt){
//                             console.log("verbindungVon: " + verbindungVon);
//                             console.log("verbindungNach: " + verbindungNach);

//                             const knoten = Node.getByID(verbindungNach);
//                             console.log(knoten);
//                             hauptgraph.addKnoten(knoten);

//                             hauptgraph.addConnection(verbindungVon, verbindungNach, 1);
//                         }
//                         else{
//                             hauptgraph.addConnection(verbindungVon, verbindungNach, 1);
//                         }
//                         */

//                         leereVerbindungen();
//                         hauptgraph.zeichneVerbindungen();
//                         if(hauptgraph_1 != null) hauptgraph_1.zeichneVerbindungen();
//                         // hauptgraph_1.zeichneVerbindungen();
                        
                        
//                         // alert("Die GraphID: " + aktivGraphID);
//                         // if(aktivGraphID === 1){
//                         //     hauptgraph.addConnection(verbindungVon-1, verbindungNach-1, 1);
//                         //     hauptgraph.zeichneVerbindungen();
//                         // }
//                         // else if (aktivGraphID === 2){
//                         //     hauptgraph_1.addConnection(verbindungVon-1, verbindungNach-1, 1);
//                         //     hauptgraph_1.zeichneVerbindungen();
//                         // }

//                         // Reset von verbindungsvariablen
//                         verbinden_graph_id = null;

//                         verbindungVon = 0;
//                         verbindungNach = 0;

//                         this.aktiveMenuOption = null; // Noch nützlich?
//                         verbindenAktiv = false;
//                         verbindungKnotenHinzugefuegt = false;
//                     }
//                     else {
//                         // const msg = "Der Knopf verbinden wurde gedrückt, ID: " + event.target.parentElement.parentElement.id;
//                         const msg = "Der Knopf verbinden wurde gedrückt, ID: " + event.target.parentElement.parentElement.id;
//                         document.getElementById("ausgabetest").textContent = msg;

//                         // graphenIDVon
//                         verbinden_graph_id = this.graph_id;

//                         // VerbindungVon
//                         verbindungVon = this.id;

//                         // Zu dem Graphen anbinden
//                         // Im diesen Schritt ist noch nicht bekannt zu welchem Graphen der
//                         // Knoten angebindet werden soll
//                         // if (this.graph_id === 0){
//                         // }
//                         /*
//                         if(this.graph_id != 1){
//                             verbindungKnotenHinzugefuegt = 1;
//                             hauptgraph.addKnoten(this);

//                             console.log("Zu dem Graphen hinzugefügt\n" + this);
//                         }
//                         if(this.graph_id )
//                         */

//                         verbindenAktiv = true;
//                     }
//                 }
//                 if(mOpt.textContent == "Knoteninfo"){
//                     let infoString = "GraphID: " + this.graph_id +
//                         "KnotenID: " + this.id + 
//                         "Anforderung: " + this.info +
//                         "Quelle: " + this.anforderungsquelle;
//                     alert(infoString);
//                 }
//             })
//         }
//     }
// }
// Node - ENDE

class Graph {
    constructor(){
        graphMaxID += 1;
        this.id = graphMaxID;
        this.knoten = new Array();
        this.kanten = new Array();
        this.size = 0;

        this.knoten_h = new Node("Knotenbezeichnung");

        this.addKnoten(this.knoten_h);
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
        // ctx.clearRect(0,0, canvas.width, canvas.height);

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
                    ctx.moveTo(parseInt(knotenx.el.style.left) - verschiebung, parseInt(knotenx.el.style.top));
                    ctx.lineTo(parseInt(knoteny.el.style.left) - verschiebung, parseInt(knoteny.el.style.top));
                    
                    ctx.stroke();
                }
            }
        }
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
    else {
        alert("Es sind bereits zwei Graphen vorhanden");
        return;
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

function zeichneVerbindung(){
    leereVerbindungen()
    hauptgraph.zeichneVerbindungen();
    if(hauptgraph_1 != null)    hauptgraph_1.zeichneVerbindungen();
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


/*
const myNode1 = new Node("Hauptknoten");
myNode1.append("left", "Links");
myNode1.append("left", "Links");
myNode1.append("right", "Rechts");
myNode1.left.append("left", "Unterlinks");
myNode1.left.append("right", "Unterrechts");
myNode1.right.append("left", "Wald");
myNode1.right.append("right", "Blatt");

myNode1.left.set_anforgerungsquelle("Dokumentenname.pdf");

// console.log(myNode1.info + "\n" + myNode1.left.info + " " + myNode1.right.info);
myNode1.print_graph();
console.log("Found node: " + myNode1.search("Links"));
console.log("Anforderungsquelle: " + myNode1.left.anforderungsquelle);
*/

// (Drag and drop)
// https://www.youtube.com/watch?v=cNw0ySz79FI


// code für draggable (ziehbar) Elementen

const elements = document.getElementsByClassName("draggable-el");

let isDragging = false;
let lastX = 0;
let lastY = 0;

/*
for(const element of elements){
    element.addEventListener('mousedown', (event) => {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        element.computedStyleMap.cursor = "grabbing";
    })

    element.addEventListener('mousemove', (event) =>{
        if(!isDragging) return;

        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;

        const elementX = parseInt(window.getComputedStyle(element).getPropertyValue('left'));
        const elementY = parseInt(window.getComputedStyle(element).getPropertyValue('top'));
    
        element.style.left = `${elementX + deltaX}px`;
        element.style.top = `${elementY + deltaY}px`;

        lastX = event.clientX;
        lastY = event.clientY;
    })
}

document.addEventListener('mouseup', ()=>{
    if(isDragging){
        isDragging = false;
        element.style.cursor = "grab";
    }
})
*/
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


