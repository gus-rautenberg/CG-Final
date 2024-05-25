import Canvas from './models/Canva.js';
import Vertex from './models/Vertex.js';
import Poly from './models/Poly.js';
import Solid from './models/Solid3D.js';
// Criar uma instância de Canva com largura e altura especificadas
const canva2D = document.getElementById("canvas2D");
canva2D.width = 8; //16
canva2D.height = 6; //12
console.log("canva2D: ", canva2D.clientWidth, canva2D.clientHeight);

let polyID = 1;
// Obter o elemento <canvas> criado pela instância de Canva
// const canva2D = canva2D.getCanvas();
const canvasContext2D = canva2D.getContext("2d");
canvasContext2D.translate(0, canva2D.height);
canvasContext2D.scale(1, -1);

let vertexList = [];
let polyList = [];

let vertexA = new Vertex(21.2, 0.7, 0);
let vertexB = new Vertex(34.1, 3.4, 0);
let vertexC = new Vertex(18.8, 5.6, 0);
vertexList.push(vertexA);
vertexList.push(vertexB);
vertexList.push(vertexC);
let polyEx = new Poly("exemplo", vertexList);
wireframeTeste(polyEx);

vertexList = [];
canvas2D.addEventListener('mousemove', function(event) {
    // Obtenha as coordenadas do mouse em relação ao canvas
    var rect = canvas2D.getBoundingClientRect();
    var x = Math.floor(event.clientX - rect.left);
    var y = Math.floor(event.clientY - rect.top);

    // Atualize o título da página com as coordenadas do mouse
    document.title = 'X: ' + x + ', Y: ' + y;
});
// Adicionar um event listener ao elemento <canvas>
// canva2D.addEventListener('click', (event) => {   

//     console.log(event.offsetX, event.offsetY);
//     let polyID = 1;
//     // Lógica para criar um objeto Vertex com base nas coordenadas do clique
//     const rect = canva2D.getBoundingClientRect();
//     const current_point2D = new Vertex(
//         event.clientX - rect.left,
//         // event.clientY - rect.top,

//         canva2D.height - (event.clientY - rect.top),
//         0,
        
//     );
    


//     if (vertexList.length > 2 && vertex_distance(current_point2D, vertexList[0]) < 20) {
//         // Fechar o polígono sem adicionar o último ponto
//         let currentPoly = new Poly(polyID++, vertexList);
//         currentPoly.drawPolygon(canvasContext2D);
//         polyList.push(currentPoly);
//         vertexList = [];
//         wireframeTeste(currentPoly);
//     } else {
//         canvasContext2D.beginPath();
//         canvasContext2D.arc(current_point2D.x, current_point2D.y, 2, 0, 2 * Math.PI);
//         canvasContext2D.fill();
//         canvasContext2D.stroke();
//         // Adicionar o ponto à lista de vértices
//         vertexList.push(current_point2D);
//     }
// });

function wireframeTeste(poly){
    let polyTeste = poly;
    let polyListTeste = [];	
    polyListTeste.push(polyTeste);
    let solid3D = new Solid(polyListTeste[0].id, polyListTeste);
    let sruWidth = canva2D.width;
    let sruHeight = canva2D.height;
    canva2D.width = 320; //320 600
    canva2D.height = 240; //240 600 
    // canvasContext2D.translate(0, canva2D.height);
    // canvasContext2D.scale(1, -1);
    let canvasWidth = canva2D.width;
    let canvasHeight = canva2D.height;
    // canvasContext2D.clearRect(0, 0, canvasWidth, canvasHeight);
    solid3D.calcWireframe(4, 'x', canvasContext2D, sruWidth, sruHeight, canvasWidth, canvasHeight);
    // solid3D.identifyFaces();

    // console.log("canvWidth: ", canva2D.width, "canvHeight: ", canva2D.height);
    // canvasContext2D.beginPath();
    // canvasContext2D.arc(34, 281, 2, 0, 2 * Math.PI);
    // canvasContext2D.fill();
    // canvasContext2D.stroke();
    // canvasContext2D.arc(163, 266, 2, 0, 2 * Math.PI);
    // canvasContext2D.fill();
    // canvasContext2D.stroke();
    // canvasContext2D.arc(10, 252, 2, 0, 2 * Math.PI);
    // canvasContext2D.fill();
    // canvasContext2D.stroke();
}

document.getElementById('translateButtonUP').addEventListener('click', function() {
    let polyListTeste = [];
    polyListTeste.push(polyTeste);

    let solid3D = new Solid(polyListTeste[0].id, polyListTeste);

    solid3D.calcWireframe(4, 'x', canvasContext2D, sruWidth, sruHeight, canvasWidth, canvasHeight);
    canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

});


document.getElementById('translateButtonD').addEventListener('click', function() {
    solid3D.calcWireframe(4, 'x', canvasContext2D, sruWidth, sruHeight, canvasWidth, canvasHeight);
    canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

});


document.getElementById('translateButtonL').addEventListener('click', function() {
    solid3D.calcWireframe(4, 'x', canvasContext2D, sruWidth, sruHeight, canvasWidth, canvasHeight);
    canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

});


document.getElementById('translateButtonR').addEventListener('click', function() {
   
    canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

});



function vertex_distance(vertex1, vertex2){
    var dist = Math.sqrt(Math.pow((vertex2.x - vertex1.x), 2) + Math.pow((vertex2.y - vertex1.y), 2));
    return dist;
}
