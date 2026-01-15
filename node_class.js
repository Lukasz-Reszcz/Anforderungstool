let lastX = 0;
let lastY = 0;

export default class Node {
    // Hilft, um später die Knoten aus IDs zu finden
    static register = new Map();
    static aktiverKnoten = null;

    // Zum Verbinden
    static verbindenVon = null;
    static verbindungAktiv = false;

	constructor(info){
        // ID
        nodeMaxID += 1;
    	this.id = nodeMaxID;
        this.graph_id = 0;
        Node.register.set(this.id, this);
        
        // Blätter
		this.left = null;
        this.right = null;

        // Info
        this.info = info; //"Anforderung";  
        this.anforderungsquelle = null;

        // DeKnoten
        this.make_knoten();
        this.make_draggable();

        this.isDragging = false;
        this.activeElement = null;

        // Menu
        this.addMenu();
        this.aktiveMenuOption = null;

        // aktiver Knoten
        this.make_aktiverKnoten();
    }

    static getByID(id){
        return Node.register.get(id);
    }

    clone(){
        // Weitere Infos kopieren
        return new Node(this.info);
    }
    
    append(direction, info){
    	if(direction == "left"){
        	this.left = new Node(info);
        }
        else if(direction == "right"){
        	this.right = new Node(info);
        }
    }

    set_graph_id(gid){
        this.graph_id = gid; 
    }

    set_info(info){
        this.info = info;
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
        this.el.id = this.id;

        const graphContainer = document.getElementById("nodec");
        
        this.el.style.position = "absolute";
        this.el.style.left = "50px";
        this.el.style.top = "50px"; 

        // Änderbares Textfeld
        this.par = document.createElement("p");
        this.par.contentEditable = true;
        this.par.textContent = this.info;
        this.el.appendChild(this.par);

        // Menü
        this.menuContainer = document.createElement("div");
        this.menuContainer.id = "menu";
        this.menuContainer.className = "dropdown-content";

        // make a menu options
        this.menuOption = document.createElement("a");
        this.menuOption.className = "menuOption";
        this.menuOption.textContent = "verbinden";

        this.menuOption_info = document.createElement("a");
        this.menuOption_info.className = "menuOption";
        this.menuOption_info.textContent = "Knoteninfo";

        this.menuOption_knotenloeschen = document.createElement("a");
        this.menuOption_knotenloeschen.className = "menuOption";
        this.menuOption_knotenloeschen.textContent = "Knoten löschen";
        
        this.menuContainer.appendChild(this.menuOption);
        this.menuContainer.appendChild(this.menuOption_info);
        this.menuContainer.appendChild(this.menuOption_knotenloeschen);
        
        // this.el.appendChild(this.menuContainer);

        graphContainer.appendChild(this.el);
    }

    make_draggable(){
        this.el.addEventListener('mousedown', (event) => {
            // Wenn der Knoten zwar angeclicked wurde, aber mit dem Zweck um zwei Knoten
            // zu verbinden
            if(event.target.nodeName == "A") {
                return;
            }

            this.activeElement = event.currentTarget;
            this.activeElement.style.zIndex = 100;
            this.isDragging = true;
            lastX = event.target.clientX;
            lastY = event.target.clientY;
            this.computedStyleMap.cursor = "grabbing";
        })

        this.el.addEventListener('mouseup', (event) => {
            this.activeElement = null;
            this.isDragging = false;

            event.currentTarget.style.zIndex = 1;
        })

        this.el.addEventListener('mousemove', (event) =>{ // Target hinzugefügt
            if(this.activeElement == null) {
                return;
            }

            // Die Kanten von den Boxen erreicht
            // Zustand hinzufügen
            // const graphDiv = document.getElementById('nodec');
            // if(event.clientX > parseInt(graphDiv.clientLeft) + parseInt(graphDiv.clientWidth)){
            //     return;
            // }

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

    // Den Knoten akitieren
    make_aktiverKnoten(){
        this.el.addEventListener('dblclick', (event) => {
            for(let knotenh of Node.register){
                knotenh[1].el.style.backgroundColor = null;
            }

            if(!Node.verbindungAktiv){
                Node.aktiverKnoten = this;
            }

            this.el.style.backgroundColor = "rgb(60, 179, 113)";

            // Für verbinden mit
            if(Node.verbindungAktiv){
                Node.verbindungAktiv = false;
                Node.verbindenVon = Node.aktiverKnoten;
                Node.aktiverKnoten = this;

                const verbindungsart = parseInt(document.getElementById("verbindungsarten").value);


                document.getElementById("ausgabetest").textContent += " - verbunden mit ID: " + this.id;
                            // verbinden->Menü->Knoten
                            // event.target.parentElement.parentElement.id;



                // Knoten aus verschiedenen Graphen
                // Keiner der Knoten gehört einem Graphen
                const knotenVon = Node.verbindenVon;
                const knotenNach = Node.aktiverKnoten;

                // Verbindung
                verbindungVon = knotenVon.id;
                verbindungNach = this.id;
                
                if(((knotenVon.graph_id !== 0 && knotenNach.graph_id !== 0) && 
                        (knotenVon.graph_id != knotenNach.graph_id)) || 
                    (knotenVon.graph_id === 0 && knotenNach.graph_id === 0)){
                        alert("Die Verbindung kann nicht hergestellt werden");

                        // reset
                        verbinden_graph_id = null;
                        verbindungVon = 0;
                        verbindungNach = 0;
                        Node.verbindungAktiv = false;
                        verbindungKnotenHinzugefuegt = false;
                        
                        return;
                }

                // Im welchen Graphen 
                // const knotenVon = Node.getByID(verbindungVon);
                if(hauptgraph.knoten.includes(verbindungVon)){
                    hauptgraph.addKnoten(knotenNach);
                    hauptgraph.addConnection(verbindungVon, verbindungNach, verbindungsart);
                }
                else if((hauptgraph_1 != null) && (hauptgraph_1.knoten.includes(verbindungVon))){
                    hauptgraph_1.addKnoten(knotenNach);
                    hauptgraph_1.addConnection(verbindungVon, verbindungNach, verbindungsart);
                }
                // KnotenVon ist keinem Graphen zugewiesen
                else{
                    let graphAktuell = knotenNach.graph_id;
                    if(graphAktuell === 1){
                        graphAktuell = hauptgraph;
                    }
                    else if(graphAktuell === 2){
                        graphAktuell = hauptgraph_1;
                    }

                    graphAktuell.addKnoten(knotenVon);
                    graphAktuell.addConnection(verbindungVon, verbindungNach, verbindungsart);
                }

                // leereVerbindungen();
                // hauptgraph.zeichneVerbindungen();
                // if(hauptgraph_1 != null) hauptgraph_1.zeichneVerbindungen();

                // Reset von verbindungsvariablen
                verbinden_graph_id = null;
                verbindungVon = 0;
                verbindungNach = 0;
                Node.verbindungAktiv = false;
                verbindungKnotenHinzugefuegt = false;
            }
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
                        
            
                        // Verbindung
                        verbindungNach = this.id;


                        // Knoten aus verschiedenen Graphen
                        // Keiner der Knoten gehört einem Graphen
                        const knotenVon = Node.getByID(verbindungVon);
                        const knotenNach = Node.getByID(verbindungNach);

                        
                        if(((knotenVon.graph_id !== 0 && knotenNach.graph_id !== 0) && 
                                (knotenVon.graph_id != knotenNach.graph_id)) || 
                            (knotenVon.graph_id === 0 && knotenNach.graph_id === 0)){
                                alert("Die Verbindung kann nicht hergestellt werden");

                                // reset
                                verbinden_graph_id = null;
                                verbindungVon = 0;
                                verbindungNach = 0;
                                verbindenAktiv = false;
                                verbindungKnotenHinzugefuegt = false;
                                
                                return;
                        }

                        // Im welchen Graphen 
                        // const knotenVon = Node.getByID(verbindungVon);
                        if(hauptgraph.knoten.includes(verbindungVon)){
                            hauptgraph.addKnoten(knotenNach);
                            hauptgraph.addConnection(verbindungVon, verbindungNach, 1);
                        }
                        else if((hauptgraph_1 != null) && (hauptgraph_1.knoten.includes(verbindungVon))){
                            hauptgraph_1.addKnoten(knotenNach);
                            hauptgraph_1.addConnection(verbindungVon, verbindungNach, 1);
                        }
                        // KnotenVon ist keinem Graphen zugewiesen
                        else{
                            let graphAktuell = knotenNach.graph_id;
                            if(graphAktuell === 1){
                                graphAktuell = hauptgraph;
                            }
                            else if(graphAktuell === 2){
                                graphAktuell = hauptgraph_1;
                            }

                            graphAktuell.addKnoten(knotenVon);
                            graphAktuell.addConnection(verbindungVon, verbindungNach, 1);
                        }

                        leereVerbindungen();
                        hauptgraph.zeichneVerbindungen();
                        if(hauptgraph_1 != null) hauptgraph_1.zeichneVerbindungen();

                        // Reset von verbindungsvariablen
                        verbinden_graph_id = null;
                        verbindungVon = 0;
                        verbindungNach = 0;
                        verbindenAktiv = false;
                        verbindungKnotenHinzugefuegt = false;
                    }
                    else {
                        // const msg = "Der Knopf verbinden wurde gedrückt, ID: " + event.target.parentElement.parentElement.id;
                        const msg = "Der Knopf verbinden wurde gedrückt, ID: " + event.target.parentElement.parentElement.id;
                        document.getElementById("ausgabetest").textContent = msg;

                        // graphenIDVon
                        verbinden_graph_id = this.graph_id;

                        // VerbindungVon
                        verbindungVon = this.id;

                        // Zu dem Graphen anbinden
                        // Im diesen Schritt ist noch nicht bekannt zu welchem Graphen der
                        // Knoten angebindet werden soll
                        // if (this.graph_id === 0){
                        // }
                        /*
                        if(this.graph_id != 1){
                            verbindungKnotenHinzugefuegt = 1;
                            hauptgraph.addKnoten(this);

                            console.log("Zu dem Graphen hinzugefügt\n" + this);
                        }
                        if(this.graph_id )
                        */

                        verbindenAktiv = true;
                    }
                }
            })
        }
    }

    showInfo(){
        let infoString = "GraphID: " + this.graph_id +
                        "KnotenID: " + this.id + 
                        "Anforderung: " + this.info +
                        "Quelle: " + this.anforderungsquelle;
        alert(infoString);
    }

    verbindungErstellen(){

    }
}
