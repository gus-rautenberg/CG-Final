import Canvas from './models/Canva.js';
import Vertex from './models/Vertex.js';
import Poly from './models/Poly.js';
import Solid from './models/Solid3D.js';
import Camera from './models/Camera.js';
// Criar uma instância de Canva com largura e altura especificadas
// = document.getElementById("canvas2D");
let canva2D;
let canvasContext2D; // = canva2D.getContext("2d");
let  windowXValueMax, windowYValueMax, viewportXValueMax, viewportYValueMax;
let polyID = 0;

let telaCriada = false;
let wireframeOK = false;

let vertexList = [];
let polyList = [];
let solidList = [];
// canva2D.width = 1000; //16
// canva2D.height = 500; //12
// console.log("canva2D: ", canva2D.clientWidth, canva2D.clientHeight);

let shading = false;

const createScreenButton = document.getElementById("createScreenButton");
const wireframeButton = document.getElementById("wireframeButton");
const shadingButton = document.getElementById("shadingButton");

createScreenButton.addEventListener('click', function() {

    windowXValueMax = document.getElementById("windowXMax").value;
    windowYValueMax = document.getElementById("windowYMax").value;

    if( windowXValueMax == "" || windowYValueMax == ""){
        alert("Preencha todos os campos com os valores da Window");
        return; // Aborta a execução se algum campo estiver vazio
    }

    viewportXValueMax = document.getElementById("viewportXMax").value;
    viewportYValueMax = document.getElementById("viewportYMax").value;


    if( viewportXValueMax  == "" || viewportYValueMax == ""){
        alert("Preencha todos os campos com os valores da Viewport");
        return; // Aborta a execução se algum campo estiver vazio
    }

    canva2D = document.getElementById("canvas2D");
    canva2D.width = windowXValueMax;
    canva2D.height = windowYValueMax;
    canvasContext2D = canva2D.getContext("2d");
    canvasContext2D.translate(0, canva2D.height);
    canvasContext2D.scale(1, -1);
    telaCriada = true;

    // Desabilita o botão createScreenButton após a tela ter sido criada
    createScreenButton.disabled = true;

    canva2D.addEventListener('mousemove', function(event) {
        // Obtenha as coordenadas do mouse em relação ao canvas
        var rect = canva2D.getBoundingClientRect();
        var x = Math.floor(event.clientX - rect.left);
        var y = Math.floor(canva2D.height - (event.clientY - rect.top));
    
        // Atualize o título da página com as coordenadas do mouse
        document.title = 'X: ' + x + ', Y: ' + y;
    });
    // Adicionar um event listener ao elemento <canvas>
    
    canva2D.addEventListener('click', (event) => {   
    
        // console.log(event.offsetX, event.offsetY);
        // Lógica para criar um objeto Vertex com base nas coordenadas do clique
        const rect = canva2D.getBoundingClientRect();
        const current_point2D = new Vertex(
            event.clientX - rect.left,
            // event.clientY - rect.top,
    
            canva2D.height - (event.clientY - rect.top),
            0,
            
        );
        // console.log("Teste1 current_point2D: ", current_point2D.x, current_point2D.y);
        
    
    
        if (vertexList.length > 2 && vertex_distance(current_point2D, vertexList[0]) < 20) {
            // Fechar o polígono sem adicionar o último ponto
            let currentPoly = new Poly(polyID++, vertexList);
            currentPoly.drawPolygon(canvasContext2D);
            polyList.push(currentPoly);
            vertexList = [];
            console.log("Teste1 currentPolyList: ", currentPoly.vertexList);
            console.log("Teste1 polyList: ", currentPoly);
            console.log("fechou")
            // wireframeTeste(currentPoly);
        } else {
            canvasContext2D.beginPath();
            canvasContext2D.arc(current_point2D.x, current_point2D.y, 2, 0, 2 * Math.PI);
            canvasContext2D.fill();
            canvasContext2D.stroke();
            // Adicionar o ponto à lista de vértices
            vertexList.push(current_point2D);
        }
    });
    

})

const resetCanvasButton = document.getElementById("resetCanvasButton");

resetCanvasButton.addEventListener('click', function() {
    // Limpa o canvas
    canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

    // Restaura as dimensões do canvas
    canva2D.width = windowXValueMax;
    canva2D.height = windowYValueMax;

    // Restaura a transformação do contexto
    canvasContext2D.translate(0, canva2D.height);
    canvasContext2D.scale(1, -1);

    // Define telaCriada como false para permitir a criação de uma nova tela
    telaCriada = false;

    // Habilita o botão createScreenButton
    createScreenButton.disabled = false;
    polyList = [];
    vertexList = [];	
    solidList = [];
    wireframeOK = false;
    shading = false;
});

wireframeButton.addEventListener('click', function() {
    if(polyList.length <= 0){
        alert("Adicione pelo menos um polígono para mostrar o wireframe");
        return;
    }
    if(windowXValueMax == "" || windowYValueMax == "" || viewportXValueMax == "" || viewportYValueMax == ""){
        alert("Preencha todos os campos com os valores da Window e Viewport");
        return; // Aborta a execução se algum campo estiver vazio
    }
    if(canvasContext2D == null){
        alert("Clique na tela para mostrar o wireframe");
        return;
    }
    const cameraX = document.getElementById("cameraX").value;
    const cameraY = document.getElementById("cameraY").value;
    const cameraZ = document.getElementById("cameraZ").value;
    if(cameraX == "" || cameraY == "" || cameraZ == ""){
        alert("Preencha todos os campos com os valores da Camera");
        return; // Aborta a execução se algum campo estiver vazio
    }
    const focalPointX = document.getElementById("pX").value;
    const focalPointY = document.getElementById("pY").value;
    const focalPointZ = document.getElementById("pZ").value;
    if(cameraX == "" || cameraY == "" || cameraZ == ""){
        alert("Preencha todos os campos com os valores da Camera");
        return; // Aborta a execução se algum campo estiver vazio
    }
    // let      windowXValue = document.getElementById("windowX").value;
    const rotationAxisRadios = document.getElementsByName('rotationAxis');
    let selectedRotationAxis;

    rotationAxisRadios.forEach(radio => {
        if (radio.checked) {
            // Se o input de tipo "radio" estiver selecionado, armazena o valor dele
            selectedRotationAxis = radio.value;
        }
    });
    if(selectedRotationAxis == ""){
        alert("Selecione o eixo de rotação");
        return; // Aborta a execução se algum campo estiver vazio
    }
    let slices = document.getElementById("slices").value;
    if(slices == ""){
        alert("Selecione o número de slices");
        return; // Aborta a execução se algum campo estiver vazio
    }

    const vision = document.getElementsByName('vision');
    let selectedVision;

    vision.forEach(radio => {
        if (radio.checked) {
            // Se o input de tipo "radio" estiver selecionado, armazena o valor dele
            selectedVision = radio.value;
        }
    });
    if(selectedVision == ""){
        alert("Selecione o tipo de visao");
        return; // Aborta a execução se algum campo estiver vazio
    }
    let camera = [parseFloat(cameraX), parseFloat(cameraY), parseFloat(cameraZ)]; // [cameraX, cameraY, cameraZ];
    let focalPoint = [parseFloat(focalPointX), parseFloat(focalPointY), parseFloat(focalPointZ)]; // [focalPointX, focalPointY, focalPointZ];
    wireframeOK = true;
    for(let i = 0; i < polyList.length; i++){
        
        wireframeTeste(polyList[i], viewportXValueMax, viewportYValueMax, selectedRotationAxis, slices, camera, focalPoint, selectedVision);
    }
})

shadingButton.addEventListener('click', function() {
    if(polyList.length <= 0){
        alert("Adicione pelo menos um polígono para mostrar o wireframe");
        return;
    }
    if(windowXValueMax == "" || windowYValueMax == "" || viewportXValueMax == "" ||  viewportYValueMax == ""){
        alert("Preencha todos os campos com os valores da Window e Viewport");
        return; // Aborta a execução se algum campo estiver vazio
    }
    if(canvasContext2D == null){
        alert("Clique na tela para mostrar o wireframe1");
        return;
    }
    if(wireframeOK == false){
        alert("Clique na tela para mostrar o wireframe2");
        return;
    }


    const shadingType = document.getElementsByName("shadingType");
    let selectedShading;

    shadingType.forEach(radio => {
        if (radio.checked) {
            selectedShading = radio.value;
        }
    });
    if(selectedShading == ""){
        alert("Selecione o tipo de Sombreamento");
        return; // Aborta a execução se algum campo estiver vazio
    } 

    const lampadaX = document.getElementById("lampX").value;
    const lampadaY = document.getElementById("lampY").value;
    const lampadaZ = document.getElementById("lampZ").value;
    if(lampadaX == "" || lampadaY == "" || lampadaZ == ""){
        alert("Preencha todos os campos com os valores da Lampada");
        return; // Aborta a execução se algum campo estiver vazio
    }

    const iaR = document.getElementById("iaR").value;
    const iaG = document.getElementById("iaG").value;
    const iaB = document.getElementById("iaB").value;
    if(iaR == "" || iaG == "" || iaB == ""){
        alert("Preencha todos os campos com os valores da Ia");
        return; // Aborta a execução se algum campo estiver vazio
    }

    const ilR = document.getElementById("ilR").value;
    const ilG = document.getElementById("ilG").value;
    const ilB = document.getElementById("ilB").value;
    if(ilR == "" || ilG == "" || ilB == ""){
        alert("Preencha todos os campos com os valores da Il");
        return; // Aborta a execução se algum campo estiver vazio
    }

    const kaR = document.getElementById("kaR").value;
    const kaG = document.getElementById("kaG").value;
    const kaB = document.getElementById("kaB").value;
    if(kaR == "" || kaG == "" || kaB == ""){
        alert("Preencha todos os campos com os valores da Ka");
        return; // Aborta a execução se algum campo estiver vazio
    }
    
    const kdR = document.getElementById("kdR").value;
    const kdG = document.getElementById("kdG").value;
    const kdB = document.getElementById("kdB").value;
    if(kdR == "" || kdG == "" || kdB == ""){
        alert("Preencha todos os campos com os valores da Kd");
        return; // Aborta a execução se algum campo estiver vazio
    }

    const ksR = document.getElementById("ksR").value;
    const ksG = document.getElementById("ksG").value;
    const ksB = document.getElementById("ksB").value;
    if(ksR == "" || ksG == "" || ksB == ""){
        alert("Preencha todos os campos com os valores da Ks");
        return; // Aborta a execução se algum campo estiver vazio
    }

    const n = document.getElementById("nValue").value;
    if(n == ""){
        alert("Preencha todos os campos com os valores da n");
        return; // Aborta a execução se algum campo estiver vazio
    }

    let material = {
        ka :  [parseFloat(kaR), parseFloat(kaG), parseFloat(kaB)],
        kd :  [parseFloat(kdR), parseFloat(kdG), parseFloat(kdB)],
        ks :  [parseFloat(ksR), parseFloat(ksG), parseFloat(ksB)], // [0.67, 0.3, 0.6],
        n :   parseFloat(n),
    }
    let viewPortX = {
        min: 0,
        max: viewportXValueMax,
    }

    let viewPortY = {
        min: 0,
        max: viewportYValueMax,
    }
    let L = {vector : [parseFloat(lampadaX), parseFloat(lampadaY), parseFloat(lampadaZ)], Il : [parseFloat(ilR), parseFloat(ilG), parseFloat(ilB)]};//{vector : [0, 140, 120]};	//gouroud
    let ia = [parseFloat(iaR), parseFloat(iaG), parseFloat(iaB)];
    for(let i = 0; i < solidList.length; i++){
        let solidTeste = solidList[i];
        solidTeste.shading(canvasContext2D, selectedShading, viewPortX, viewPortY, L, ia, material)
    }
    shading =true;
})

const translateButton = document.getElementById("translateSolid");

translateButton.addEventListener("click", () => {
    if(shading == false) {
        alert("Selecione uma iluminação");
        return;
    }
    let translateX = document.getElementById("translateX").value;
    let translateY = document.getElementById("translateY").value;
    let translateZ = document.getElementById("translateZ").value;
    if(translateX === "" && translateY === "" && translateZ === ""){
        alert("Preencha pelo menos um dos campos com os valores da Translação");
        return; // Aborta a execução se nenhum campo estiver preenchido
    }
    if(translateX === ""){
        translateX = 0;
    }
    if(translateY === ""){
        translateY = 0;
    }
    if(translateZ === ""){
        translateZ = 0;
    }
    canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);
    for(let i = 0; i < solidList.length; i++){
        let solidTeste = solidList[i];
        solidTeste.translateSolid(parseFloat(translateX), parseFloat(translateY), parseFloat(translateZ));
    }
})
const rotateX = document.getElementById("rotateX");

rotateX.addEventListener("click", () => {
    if(shading == false) {
        alert("Selecione uma iluminação");
        return;
    }

    canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);
    for(let i = 0; i < solidList.length; i++){
        let solidTeste = solidList[i];
        solidTeste.rotateX(15*(Math.PI/180));
    }
})

const rotateXMinus = document.getElementById("rotateXMinus");

rotateXMinus.addEventListener("click", () => {
    if(shading == false) {
        alert("Selecione uma iluminação");
        return;
    }

    canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);
    for(let i = 0; i < solidList.length; i++){
        let solidTeste = solidList[i];
        solidTeste.rotateX(-(15*(Math.PI/180)));
    }
})




let vertexA = new Vertex(21.2, 0.7, 0);
let vertexB = new Vertex(34.1, 3.4, 0);
let vertexC = new Vertex(18.8, 5.6, 0);
vertexList.push(vertexA);
vertexList.push(vertexB);
vertexList.push(vertexC);
let polyEx = new Poly("exemplo", vertexList);
// wireframeTeste(polyEx);

vertexList = [];
function wireframeTeste(polyList, viewportX, viewportY, eixoRotacao, slices, camera, focalPoint, selectedVision){
    // for(let i = 0; i < polyList.length; i++){
        let polyTeste = polyList;
        let polyListTeste = [];	
        polyListTeste.push(polyTeste);
        let solid3D = new Solid(polyListTeste[0].id, polyListTeste);

        let sruWidth = canva2D.width;
        let sruHeight = canva2D.height;

        canva2D.width = viewportX; //320 600
        canva2D.height = viewportY; //240 600 

        canvasContext2D.translate(0, canva2D.height);
        canvasContext2D.scale(1, -1);
        let sruX = {
            min: parseFloat(-windowXValueMax),
            max: parseFloat(windowXValueMax),
        }
        let sruY = {
            min: parseFloat(-windowYValueMax),
            max: parseFloat(windowYValueMax)
        }
        
        let windowX = {
            min: 0,
            max: parseFloat(viewportXValueMax)
        }
        let windowY = {
            min: 0,
            max: parseFloat(viewportYValueMax)
        }
        let canvasWidth = canva2D.width;
        let canvasHeight = canva2D.height;
        // canvasContext2D.clearRect(0, 0, canvasWidth, canvasHeight);
        solid3D.calcWireframe(slices, eixoRotacao, canvasContext2D, sruX, sruY, windowX, windowY, camera, focalPoint, selectedVision);
        solidList.push(solid3D);
    


}

// document.getElementById('translateButtonUP').addEventListener('click', function() {
//     let polyListTeste = [];
//     polyListTeste.push(polyTeste);

//     let solid3D = new Solid(polyListTeste[0].id, polyListTeste);

//     solid3D.calcWireframe(4, 'x', canvasContext2D, sruWidth, sruHeight, canvasWidth, canvasHeight);
//     canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

// });


// document.getElementById('translateButtonD').addEventListener('click', function() {
//     solid3D.calcWireframe(4, 'x', canvasContext2D, sruWidth, sruHeight, canvasWidth, canvasHeight);
//     canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

// });


// document.getElementById('translateButtonL').addEventListener('click', function() {
//     solid3D.calcWireframe(4, 'x', canvasContext2D, sruWidth, sruHeight, canvasWidth, canvasHeight);
//     canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

// });


// document.getElementById('translateButtonR').addEventListener('click', function() {
   
//     canvasContext2D.clearRect(0, 0, canva2D.width, canva2D.height);

// });



function vertex_distance(vertex1, vertex2){
    var dist = Math.sqrt(Math.pow((vertex2.x - vertex1.x), 2) + Math.pow((vertex2.y - vertex1.y), 2));
    return dist;
}
