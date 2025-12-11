// globale Variablen
nodeMaxID = 0;
graphMaxID = 0;
verbindenAktiv = false;
class Node {
	constructor(info){
        // ID
        nodeMaxID += 1;
    	this.id = nodeMaxID;
        
        // Blätter
		this.left = null;
        this.right = null;

        // Info
        this.info = info;  
        this.anforderungsquelle = null;

        // DeKnoten
        this.make_knoten();
        this.make_draggable();

        this.isDragging = false;
        this.activeElement = null;

        // Menu
        this.addMenu();
        this.aktiveMenuOption = null;
    }
    
    append(direction, info){
    	if(direction == "left"){
        	this.left = new Node(info);
        }
        else if(direction == "right"){
        	this.right = new Node(info);
        }
    }
    
    print_graph(){
        console.log(this.id + " " + this.info);
        if(this.left != null){
            this.left.print_graph();
        }
        if(this.right != null){
            this.right.print_graph();
        }
    }

    search(text){
        // Debug
        // console.log("Text: " + text + " Info: " + this.info);

        if(this.info == text){
            return  this.id;
        }

        let result = null;
        
        if(this.left != null){
            result = this.left.search(text);
            if (result != null)  return result;
        }
        if(this.right != null){
            result = this.right.search(text);
            if (result != null)  return result;
        }

        // Der Text wurde nicht gefunden
        return -1;
    }

    set_anforgerungsquelle(aquelle){
        this.anforderungsquelle = aquelle;
    }

    make_knoten(){
        // Den Knoten auf einer Stelle setzen (oben links)
        this.el = document.createElement("div");
        this.el.className = "draggable-el";
        this.el.id = "knoten_" + this.id;

        const graphContainer = document.getElementById("nodec");
        
        this.el.style.position = "absolute";
        this.el.style.left = "50px";
        this.el.style.top = "50px"; 

        // Änderbares Textfeld
        this.par = document.createElement("p");
        this.par.contentEditable = true;
        this.par.textContent = this.info;
        this.el.appendChild(this.par);

        // ID
        const parID = document.createElement("p");
        parID.textContent = "ID: " + this.el.id;
        this.el.appendChild(parID);

        // Verbunden mit
        this.parVerbindung = document.createElement("p");
        this.parVerbindung.id = "verbindung";
        this.parVerbindung.textContent = "Verbindungen\n";
        this.el.appendChild(this.parVerbindung);

        this.menuContainer = document.createElement("div");
        this.menuContainer.id = "menu";
        this.menuContainer.className = "dropdown-content";

        // make a menu options
        this.menuOption = document.createElement("a");
        this.menuOption.className = "menuOption";
        this.menuOption.textContent = "verbinden";

        this.menuContainer.appendChild(this.menuOption);
        this.el.appendChild(this.menuContainer);

        graphContainer.appendChild(this.el);
    }

    make_draggable(){
        this.el.addEventListener('mousedown', (event) => {
            this.activeElement = event.currentTarget;
            this.activeElement.style.zIndex = 100;
            this.isDragging = true;
            lastX = event.target.clientX;
            lastY = event.target.clientY;
            this.computedStyleMap.cursor = "grabbing";
        })

        // Debug
        this.el.addEventListener('mouseup', (event) => {
            this.activeElement = null;
            this.isDragging = false;

            event.currentTarget.style.zIndex = 1;
        })

        this.el.addEventListener('mousemove', (event) =>{ // Target hinzugefügt
            if(!this.activeElement)  return;
            // if(!this.isDragging) return;

            const deltaX = event.clientX - lastX;
            const deltaY = event.clientY - lastY;

        
            const elementX = parseInt(window.getComputedStyle(this.el).getPropertyValue('left'));
            const elementY = parseInt(window.getComputedStyle(this.el).getPropertyValue('top'));
        
            this.el.style.left = `${elementX + deltaX}px`;
            this.el.style.top = `${elementY + deltaY}px`;

            lastX = event.clientX;
            lastY = event.clientY;
        })
    }

    // Funktionalitäten zum Munü
    addMenu(){
        this.el.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            // event.currentTarget.classList.toggle("show");
            // document.getElementById("menu").classList.toggle("show");

            // # - ID
            // .p - className
            this.el.querySelector("#menu").classList.toggle("show");            
        })

        const menuOptions = this.el.querySelectorAll(".menuOption");
        for(const mOpt of menuOptions){
            mOpt.addEventListener('mousedown', (event) => {
                if(mOpt.textContent == "verbinden"){
                    if(verbindenAktiv){
                        document.getElementById("ausgabetest").textContent += " - verbunden mit ID: " + 
                            // verbinden->Menü->Knoten
                            event.target.parentElement.parentElement.id;
                        this.aktiveMenuOption = null; // Noch nützlich?
                        verbindenAktiv = false;
                    }
                    else {
                        // const msg = "Der Knopf verbinden wurde gedrückt, ID: " + event.target.parentElement.parentElement.id;
                        const msg = "Der Knopf verbinden wurde gedrückt, ID: " + event.target.parentElement.parentElement.id;
                        document.getElementById("ausgabetest").textContent = msg;

                        // global machen?
                        this.aktiveMenuOption = "verbinden"; // Noch nützlich?
                        verbindenAktiv = true;
                    }

                }
            })
        }
        
    }
}

class Vertex {
    constructor(){
        this.nodes = [];
        this.kanten = new Array();
        this.size = 0;
    }

    addNode(node){
        // this.nodes.push(node.id);
        this.nodes.push(node);
        this.size++;
        this.kanten.push([0]);

        // console.log(this.kanten);

        for(let i=1; i<this.size-1; i++){
            this.kanten[this.size-1].push(0);
        }

        for(let i=0; i<this.size-1; i++){
            this.kanten[i][this.size-1] = 0;
            this.kanten[this.size-1][i] = 0;
        }
    }

    // Soll diese Funktion in die Klasse Graph rein und "Vertex"
    // als eine Datenstruktur betrachtet weden?
    addConnection(nodex, nodey, con){
        if(nodex > this.size - 1 || nodey > this.size - 1){
            console.log("Der Knoten existiert nicht");
            return;
        }
        this.kanten[nodex][nodey] = con;
    }

    print(){
        console.log(this.kanten);
        /*
        for(let i=0; i<this.size; i++){
            for(let j=0; j<this.size; j++){
                if (i !== j){
                    continue;
                }
                System.out.log(this.kanten[i][j]);
            }
        }
        */
    }
}

class Graph {
    constructor(){
        graphMaxID += 1;
        this.id = graphMaxID;
        this.knoten = new Array();
        this.kanten = new Vertex();
    }

    addKnoten(node){
        // Die Menge der Knoten
        this.knoten.push(node);

        // Kanten
        this.kanten.addNode(node);
    }

    addConnection(nodex, nodey, con){
        this.kanten.addConnection(nodex, nodey, con);
        
        const knotenx = this.knoten[nodex];
        const knoteny = this.knoten[nodey];

        // alert(knotenx.parVerbindung.textContent); //.querySelector("#verbindung").textContent);

        // Testmäßig eine Anzeige
        knotenx.parVerbindung.textContent += "Verbunden mit: " + knoteny.id + " (" + con + ")";
        knoteny.parVerbindung.textContent += "Verbunden mit: " + knotenx.id + " (" + con + ")";
    }

}

function newNode(){
    const knoten = new Node("Test");
}

// Den Graphen erstellen (die Verbindungen)


function newGraph(){
    const graph = new Graph();
    const knoten1 = new Node("Test1");
    const knoten2 = new Node("Anforderung");
    const knoten3 = new Node("Test3");
    
    graph.addKnoten(knoten1);
    graph.addKnoten(knoten2);
    graph.addKnoten(knoten3);

    graph.addConnection(0, 1, 1);
    graph.addConnection(0, 2, 1);
    graph.addConnection(1, 2, 2);
    
    
    // Der zweite Graph
    const graph2 = new Graph();
    const knoten12 = new Node("Test12");
    const knoten22 = new Node("Anforderung");
    const knoten32 = new Node("Test32");
    
    graph2.addKnoten(knoten12);
    graph2.addKnoten(knoten22);
    graph2.addKnoten(knoten32);

    graph2.addConnection(0, 1, 1);
    graph2.addConnection(0, 2, 1);
    graph2.addConnection(1, 2, 2);

    graphenVerbinden(graph, graph2);
}

function graphenVerbinden(graph1, graph2){
    // Verbindung "2" suchen
    let wx = -1;
    let wy = -1;
    
    for(let i=0; i<graph1.knoten.length; i++){
        for(let j=0; j<graph1.knoten.length; j++){
            // alert("i: " + i + graph1.kanten.kanten[i][j]);
            if(graph1.kanten.kanten[i][j] == 2){
                if(graph2.kanten.kanten[i][j] == 2){
                    alert("Gemeinsame Verbindung gefunden");
                    wx = i;
                    wy = j;

                    i = graph1.knoten.length;
                    break;
                }
            }   
        }
    }

    if(wx != -1){
        // A -> B und A -> C
        const knot1 = new Node("Fantasma");
        const knot2 = graph1.knoten[wy];
        const knot3 = graph2.knoten[wy];

        // Verbindung löschen
        graph1.kanten.kanten[wx][wy] = 0; 
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

