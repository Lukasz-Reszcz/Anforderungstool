import Node from "./node_class.js"

export default class Graph {
    static register = new Map();

    constructor(){
        graphMaxID += 1;
        this.id = graphMaxID;
        this.knoten = new Array();
        this.kanten = new Array();
        this.size = 0;
        
        this.phase = 1;

        Graph.register.set(this.id, this);

        // Als Wurzelknoten kennzeichnen
        this.knoten_h = new Node("Knotenbezeichnung");
        this.knoten_h.el.className = "draggable-el-wurzelknoten";
        this.knoten_h.wurzelknoten = true;

        this.addKnoten(this.knoten_h.id);
    }

    static getByID(id){
        return Graph.register.get(id);
    }

    addKnoten(nodeID){
        // Die Menge der Knoten
        if(this.knoten.includes(nodeID)){
            return;
        }
        this.knoten.push(nodeID);

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
        let gegebenKnoten = Node.getByID(nodeID);
        gegebenKnoten.set_graph_id(this.id);             
    }

    clone(){
        let graphClone = new Graph();
        let knotenMap = new Map();

        // Knoten kopieren
        for(const knoten of this.knoten){
            let knotenClone = Node.getByID(knoten).clone();
            graphClone.addKnoten(knotenClone.id);
            knotenMap.set(knoten, knotenClone.id);
        }

        graphClone.loescheKnoten(graphClone.knoten_h);

        console.log(graphClone);

        // Verbindungen kopieren
        for(let i=0; i<this.knoten.length; i++){
            for(let j=0; j<this.knoten.length; j++){
                graphClone.addConnection(knotenMap.get(this.knoten[i]), knotenMap.get(this.knoten[j]), 
                    this.kanten[i][j]);
            }
        }

        return graphClone;
    }

    loescheKnoten(knoten){
        const knotenid = knoten.id;
        const knotenindex = this.knoten.indexOf(knotenid);
        this.size--;

        // Knoten unsichtbar machen
        knoten.el.style.visibility = "hidden";

        // Knoten aus der Liste loeschen
        this.knoten.splice(knotenindex, 1);
        
        // Verbindungen loeschen
        for(let zeile of this.kanten){
            zeile.splice(knotenindex, 1);
        }
        
        this.kanten.splice(knotenindex, 1);


        // Debug
        console.log(this);

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
        let paragraphenhoehe = parseInt(document.getElementById("menue").clientHeight) + 
            parseInt(document.getElementById("ausgabetest").clientHeight) +
            parseInt(document.getElementById("ueberschriften").clientHeight);

        // Einmalig bei der Etappenwechseln von einem Graphen
        /*
        if(graphenVerbindenZustand){
            const knoten = document.querySelectorAll(".draggable-el");
            verschiebung = parseInt(document.getElementById('nodec').clientWidth);
            for(const element of knoten){
                element.style.left = `${parseInt(element.style.left) + verschiebung}px`;
            }

            graphenVerbindenZustand = false;
        }
        */


        // Einstellungen bzgl. Verbindungsarten von einer json-Datei lesen
        let jsonObj = localStorage.getItem("einstellungen");
        
        let obj = JSON.parse(jsonObj);

        // Es wird nur ein Graph gezeichnet
        for (let i=0; i<this.knoten.length; i++){
            for (let j=0; j<this.knoten.length; j++){
                if(this.kanten[i][j] > 0){ // Ist diese Bedingung noch nötig?
                    // If in effizientere Struktur umwandeln, wie z.B. switch
                    
                    ctx.strokeStyle = obj.verbindungsarten[this.kanten[i][j]-1].farbe;

                    const knotenx = Node.getByID(this.knoten[i]);
                    const knoteny = Node.getByID(this.knoten[j]);

                    ctx.beginPath();
                    // Die Paragraphenhöhe anpassen
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

        return this.kanten[indx1][indx2];
    }
}