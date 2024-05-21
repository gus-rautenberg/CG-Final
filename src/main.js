import Canvas from './models/Canva.js';
import Vertex from './models/Vertex.js';
import Poly from './models/Poly.js';
import Solid from './models/Solid3D.js';

// Criar uma instância de Canva com largura e altura especificadas
const canva2D = new Canvas(800, 600, 'canvas2D');
const canva3D = new Canvas(800, 600, 'canvas3D');
const canvasElement3D = canva3D.getCanvas();
const canvasContext3D = canva3D.getContext();
let polyID = 1;
// Obter o elemento <canvas> criado pela instância de Canva
const canvasElement2D = canva2D.getCanvas();
const canvasContext2D = canva2D.getContext();
let vertexList = [];
let polyList = [];
// Adicionar um event listener ao elemento <canvas>
canvasElement2D.addEventListener('click', (event) => {
    console.log(event.offsetX, event.offsetY);
    let polyID = 1;
    // Lógica para criar um objeto Vertex com base nas coordenadas do clique
    const rect = canvasElement2D.getBoundingClientRect();
    const current_point2D = new Vertex(
        event.clientX - rect.left,
        event.clientY - rect.top,
        
    );
    
    canvasContext2D.beginPath();
    canvasContext2D.arc(current_point2D.x, current_point2D.y, 5, 0, 2 * Math.PI);
    canvasContext2D.fill();
    canvasContext2D.stroke();

    vertexList.push(current_point2D);
    if(vertexList.length > 2){ // tem que ter pelo menos 3 vertices pra formar um polígono
        if(vertex_distance(current_point2D, vertexList[0]) < 20){
            let currentPoly = new Poly(polyID++, vertexList);
            currentPoly.drawPolygon(canvasContext2D);
            polyID++;
            polyList.push(currentPoly);
            vertexList = [];
            wireframeTeste(currentPoly);
        }
    }
});

function wireframeTeste(poly){
    let polyTeste = poly;
    let polyListTeste = [];	
    polyListTeste.push(polyTeste);
    let solid3D = new Solid(polyListTeste[0].id, polyListTeste);
    solid3D.calcWireframe(36, 'x', canvasContext3D);
}





function vertex_distance(vertex1, vertex2){
    var dist = Math.sqrt(Math.pow((vertex2.x - vertex1.x), 2) + Math.pow((vertex2.y - vertex1.y), 2));
    return dist;
}
