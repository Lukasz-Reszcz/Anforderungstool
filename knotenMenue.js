import Node from "./node_class.js";

document.getElementById("knoteninfo").addEventListener('click', (event) => { 
    // document.getElementById("knoteninfo").style.backgroundColor = "rgb(144, 238, 144)";
    const aktiverKnoten = Node.aktiverKnoten;
    
    aktiverKnoten.showInfo();
    document.getElementById("knoteninfo").style.backgroundColor = null;
})

document.getElementById("knotenLoeschen").addEventListener('click', () => {
    const aktiverKnoten = Node.aktiverKnoten;

    if(aktiverKnoten.graph_id === 1){
        hauptgraph.loescheKnoten(aktiverKnoten);
    }

    Node.aktiverKnoten = null;
})

document.getElementById("knotenVerbinden").addEventListener('click', () => {
    const aktiverKnoten = Node.aktiverKnoten;

    const msg = "Der Knopf verbinden wurde gedrückt, ID: " + aktiverKnoten.id;
    document.getElementById("ausgabetest").textContent = msg;

    Node.verbindungAktiv = true;
})

// Noch nötig
document.getElementById("knotenDesaktivieren").addEventListener('click', () => {
    Node.aktiverKnoten.el.style.backgroundColor = null;
    Node.aktiverKnoten = null;
})

document.getElementById("knotenNamenAendern").addEventListener('click', () => {
    let anforderungsname = prompt("Gib den Anforderungsnamen an: ", "Anforderung");
    if((anforderungsname !== "") && (anforderungsname !== null)){
        Node.aktiverKnoten.set_info(anforderungsname);

        console.log(Node.aktiverKnoten);

        Node.aktiverKnoten.par.textContent = anforderungsname;
    }
})
