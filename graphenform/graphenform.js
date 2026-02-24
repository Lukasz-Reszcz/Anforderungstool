import Graph from "../graph_class.js";
import Node from "../node_class.js";

document.getElementById("graphHochladen").addEventListener("click", () => {
    document.getElementById("graphenform").style.visibility = "visible";
})

document.getElementById("graphHerunterladen").addEventListener("click", () => {
    document.getElementById("graphenform").style.visibility = "visible";
})

document.getElementById("graphenformschliessen").addEventListener("click", () => {
    document.getElementById("graphenform").style.visibility = "hidden";
})

document.getElementById("btngraphenSpeichern").addEventListener("click", () => {
    // Graphen bestimmen
    let graph = Graph.getByID(1);

    class Knoten_json {
        constructor(){
            this.id = 0;
            this.pos_x = 0;
            this.pos_y = 0;
            this.info = "";
            this.wurzelknoten = 0;
        }
    }

    class Graph_json {
        constructor(){
            this.id = 0;
            this.knoten = [];
            this.kanten = [];
            this.size = 0;
        }
    }

    class Kante_json {
        constructor(){
            this.von = 0;
            this.nach = 0;
            this.typ = 0;
        }
    }

    let jsonStr = null;

    // knoten 
    let data_speichern = {
            "knoten":[],
            "graphen":[]
        }
    for(const i of Node.register.keys()){
        // Iteration -- 
        let knoten = Node.getByID(i);

        // Wenn gelöscht, dann überspringen
        if(knoten.el.style.visibility == "hidden")  continue;



        let knoten_json = new Knoten_json();

        knoten_json.id = knoten.id;
        knoten_json.pos_x = knoten.el.style.left;
        knoten_json.pos_y = knoten.el.style.top;
        knoten_json.info = knoten.info;
        knoten_json.wurzelknoten = knoten.wurzelknoten;

        data_speichern.knoten.push(knoten_json);
    }
  
    for(const i of Graph.register.keys()){
        let graph = Graph.getByID(i);
        let graph_json = new Graph_json();

        // etappe
        graph_json.id = graph.id;
        graph_json.knoten = graph.knoten;
        // graph_json.kanten = graph.kanten;
        graph_json.size = graph.size;

        // kanten in struktur bringen
        for(let j=0; j<graph.size; j++){
            for(let k=0; k<graph.size; k++){
                if(graph.kanten[j][k] != 0){
                    let kante_json = new Kante_json();

                    kante_json.von = graph.knoten[j];
                    kante_json.nach = graph.knoten[k];
                    kante_json.typ = graph.kanten[j][k];

                    graph_json.kanten.push(kante_json);
                }
            }
        }


        data_speichern.graphen.push(graph_json);
    }

    jsonStr = JSON.stringify(data_speichern);

    console.log("JSON: " + jsonStr);

    // for(let i=0; i<graph.size; i++){
    //     let knoten = Node.getByID(graph.knoten[i]);

    //     knoten_json.id = knoten.id;
    //     knoten_json.pos_x = knoten.el.style.left;
    //     knoten_json.pos_y = knoten.el.style.top;
    //     knoten_json.info = knoten.info;
    //     knoten_json.wurzelknoten = knoten.wurzelknoten;

    //     jsonStr = JSON.stringify(knoten_json);
    //     console.log(jsonStr);
    // }

    // let jsonStr = JSON.stringify(graph_json);
    // console.log("JSONStr: " + jsonStr);

    // Testmäßig - später in die ganze Graphstruktur wechseln
    const data = jsonStr;


    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'aufgabenmodell.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
})

document.getElementById("btngraphenHochladen").addEventListener("click", async () => {
    let graphenDatei = document.getElementById("graphenDatei").files[0];

    let graphJSON = await graphenDatei.text();

    // Warum zwei mal?
    graphJSON = JSON.parse(graphJSON);
    graphJSON = JSON.parse(graphJSON);

    console.log(graphJSON);

    for(let i=0; i<graphJSON.knoten.length; i++){
        let knoten = new Node(graphJSON.knoten[i].info);
        knoten.el.style.left = graphJSON.knoten[i].pos_x;
        knoten.el.style.top = graphJSON.knoten[i].pos_y;
    }

    for(let i=0; i<graphJSON.graphen.length; i++){
        let graph = new Graph();
        graph.loescheKnoten(graph.knoten_h.id);

        for(let j=0; j<graphJSON.graphen[i].knoten.length; j++){
            graph.addKnoten(graphJSON.graphen[i].knoten[j]);
        }

        for(let j=0; j<graphJSON.graphen[i].kanten.length; j++){
            console.log(graphJSON.graphen[i].kanten[j]);
            const graphen_kanten = graphJSON.graphen[i].kanten[j];
            graph.addConnection(graphen_kanten.von, graphen_kanten.nach, graphen_kanten.typ);
        }
    }
    // Klasse ändern
    for(let i=0; i<graphJSON.knoten.length; i++){
        let knoten = Node.getByID(graphJSON.knoten[i].id);
        if(knoten.graph_id == 0)    
            knoten.el.className = "draggable-el-freierKnoten";

        if(graphJSON.knoten[i].wurzelknoten == 1){
            Node.getByID(graphJSON.knoten[i].id).el.className = "draggable-el-wurzelknoten";
        }
    }  
})