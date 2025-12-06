/*
window.onload() = async () => {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo(800, 400);
    // ctx.strokeStyle = "blue";
    ctx.stroke();
}
*/

function blockVerschieben(){
    const block = document.getElementById("block");

    ctx.zIndex = 5;
    ctx.clearRect(xViereck-2, yViereck-2, laengeViereck+4, hoeheViereck+4);
    xViereck += 10;


    ctx.beginPath();
    ctx.rect(xViereck, yViereck, laengeViereck, hoeheViereck);
    ctx.stroke();
}

function blockVerbinden(){
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.lineTo(xViereck+laengeViereck/2, yViereck+hoeheViereck/2);
    ctx.stroke();
}

// Die Lage des Vierecks
xViereck = 10;
yViereck = 10;
laengeViereck = 100;
hoeheViereck = 100;


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(800, 400);
// // ctx.strokeStyle = "blue";
// ctx.stroke();

ctx.rect(10, 10, 100, 100);
ctx.zIndex = 5;
ctx.stroke();

ctx.rect(200, 200, 100, 100);
ctx.stroke();
