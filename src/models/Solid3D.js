import Poly  from "./Poly.js";
import Vertex from "./Vertex.js";
import { getMJP, getInvertedMJP } from "./Scene.js";
import { getParallelMatrix, getPerspectiveMatrix } from "./ProjectionMatrix.js";
import { multiplyMatrices, matrixMultiplicationPoints } from "./Matrix.js";
import Camera, { normalizarVetor, produtoEscalar } from "./Camera.js";
import Edge from "./Edge.js";
import Face from "./Face.js";
import Pintor from "./Pintor.js";
import ZBuffer from "./ZBuffer.js";
import ConstantShade from "./ConstantShade.js";
import GouroudShade from "./GouroudShade.js";
import ZBufferGouraud from "./ZBufferGouroud.js";
import ZBufferPhong from "./ZBufferPhong.js";
import PhongShade from "./PhongShade.js";

export default class Solid {
    facesList = [];
    visibleFaceList = [];
    notVisibleFaceList = [];
    color = [10, 10, 1];

    material = {
        ka :  [0.97, 0.34, 0.6],
        kd :  [0.7, 0.50, 0.7],
        ks :  [0.67, 0.3, 0.6],
        n :   100,
    }
    constructor(id, list) {

        this.id = id;  
        this.sliceList = list;
    }
    getMaterial() {
        return this.material;
    }
    calcWireframe(fatias, axis, ctx, sruWidth, sruHeight, canvasWidth, canvasHeight) {
        let tempFacesList = [];
        let degree = 360/fatias;
        let rad = degree*(Math.PI/180);
        // console.log("rad: ", rad);
        let incrementRad = rad;
        let radX, radY, radZ;
        // this.sliceList[0].invertVertex(canvasHeight);
        console.log("sliceList: ", this.sliceList);
        let tempSliceList = this.sliceList;
        for (let i = 1; i < fatias; i++) {
            if (axis === 'x') {
                radX = rad;
                radY = 0;
                radZ = 0;
            } else if (axis === 'y') {
                radX = 0;
                radY = rad;
                radZ = 0;
            } else if (axis === 'z') {
                radX = 0;
                radY = 0;
                radZ = rad;
            }
            tempSliceList.push(new Poly(this.sliceList[0].id, this.sliceList[0].vertexList.map(v => new Vertex(v.x, v.y, 0))));
            tempSliceList[i].rotatePolygon(radX, radY, radZ, axis);
            rad += incrementRad;
            
        }
        console.log("testeWireframe: ", tempSliceList);
        for (let i = 0; i < fatias; i++) {
            let index = i;
            if(i == fatias-1) {
                index = 0;
            } 
            for(let j = 0; j < tempSliceList[index].vertexList.length; j++){
                const currentFaceEdges = [];
                let edgeSlice1;
                let edgeToSlice2;
                let edgeSlice2;
                let edgeToSlice1;
                if(j == tempSliceList[index].vertexList.length - 1){
                    if(i == fatias-1) {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[0], tempSliceList[index].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[index].vertexList[0], tempSliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[index].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[0], tempSliceList[i+1].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[i+1].vertexList[0], tempSliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[i+1].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }


                } else {  

                    if(i == fatias-1) {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[j+1], tempSliceList[index].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[index].vertexList[j+1], tempSliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[index].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[j+1], tempSliceList[i+1].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[i+1].vertexList[j+1], tempSliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[i+1].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }

                }

                currentFaceEdges.push(edgeSlice1);
                currentFaceEdges.push(edgeToSlice2);
                currentFaceEdges.push(edgeSlice2);
                currentFaceEdges.push(edgeToSlice1);
                const face = new Face(currentFaceEdges);
                if(face.isCounterClockwise()) {
                    console.log("faceTesteLogica Verdadeiro: ", face);
                    // this.facesList.push(face);
                    tempFacesList.push(face);
                } else {
                    console.log("faceTesteLogica Falso: ", face);
                    tempFacesList.push(face);

                // this.facesList.push(face);
                
                }
            }


        }
        
        let sruX = {
            min: -sruWidth,
            max: sruWidth
        }
        let sruY = {
            min: -sruHeight,
            max: sruHeight
        }
        
        let windowX = {
            min: 0,
            max: canvasWidth
        }
        let windowY = {
            min: 0,
            max: canvasHeight
        }
        console.log("TEMPPOLYLIST: ", tempSliceList);
        // let camera = new Camera([120, 120, 120], [1, 100, 5]);  // paralelo frontal
        // let camera = new Camera([0, 0, 0], [200, 0 , 0]); // rodar em X
        let camera = new Camera([0, 0, 0], [300, 0 , 0]); // rodar em X
        this.drawVisibleFaces(ctx, camera, tempFacesList);
        
        // let mjpMatrix = getMJP(sruX, sruY, windowX, windowY);
        let mjpMatrix = getInvertedMJP(sruX, sruY, windowX, windowY);

        console.log("mjpMatrix: ", mjpMatrix);

        let projectionMatrix = getPerspectiveMatrix(camera);
        // let projectionMatrix = getParallelMatrix();
        console.log("projectionMatrix: ", projectionMatrix);

        let srcMatrix = camera.getSRCMatrix();
        console.log("srcMatrix: ", srcMatrix);

        let auxMatrix = multiplyMatrices(mjpMatrix, projectionMatrix);
        console.log("auxMatrix: ", auxMatrix);

        let matrixSRU_SRT = multiplyMatrices(auxMatrix, srcMatrix);
        // console.log("matrixSRU_SRT: ", matrixSRU_SRT);

        let auxSliceList = tempSliceList;
        // console.log("size: ", tempSliceList[0].vertexList.length)
        // console.log("size templist: ", auxSliceList.length)

        // console.log("temp[4]: ", tempSliceList[4].vertexList)
        let newTempFaceList = [];
        let newEdgesList = [];
        
        for(let k = 0; k < tempFacesList.length; k++){
            for(let s = 0; s< tempFacesList[k].listEdges.length; s++){
                tempFacesList[k].listEdges[s].vertexInit.x = tempFacesList[k].listEdges[s].vertexInit.x;
                tempFacesList[k].listEdges[s].vertexInit.y = tempFacesList[k].listEdges[s].vertexInit.y;
                tempFacesList[k].listEdges[s].vertexInit.z = tempFacesList[k].listEdges[s].vertexInit.z;

                tempFacesList[k].listEdges[s].vertexEnd.x = tempFacesList[k].listEdges[s].vertexEnd.x;
                tempFacesList[k].listEdges[s].vertexEnd.y = tempFacesList[k].listEdges[s].vertexEnd.y;
                tempFacesList[k].listEdges[s].vertexEnd.z = tempFacesList[k].listEdges[s].vertexEnd.z;

                let xInit = tempFacesList[k].listEdges[s].vertexInit.x;
                let yInit = tempFacesList[k].listEdges[s].vertexInit.y;
                let zInit = tempFacesList[k].listEdges[s].vertexInit.z;

                let xEnd = tempFacesList[k].listEdges[s].vertexEnd.x;    
                let yEnd = tempFacesList[k].listEdges[s].vertexEnd.y;
                let zEnd = tempFacesList[k].listEdges[s].vertexEnd.z;
                let auxInitPoints = [[xInit],
                                 [yInit],
                                 [zInit],
                                 [1]];

                let auxEndPoints = [[xEnd],
                                 [yEnd],
                                 [zEnd],
                                 [1]];
                let resultInitMatrix = multiplyMatrices(matrixSRU_SRT, auxInitPoints);
                let resultEndMatrix = multiplyMatrices(matrixSRU_SRT, auxEndPoints);
                console.log("result1: ", resultInitMatrix, "result2: ", resultEndMatrix);
                let resultInit = new Vertex(resultInitMatrix[0]/resultInitMatrix[3], resultInitMatrix[1]/resultInitMatrix[3], resultInitMatrix[2][0]);
                let resultEnd = new Vertex(resultEndMatrix[0]/resultEndMatrix[3], resultEndMatrix[1]/resultEndMatrix[3], resultEndMatrix[2][0]);
                let newEdge = new Edge(resultInit, resultEnd, tempFacesList[k].listEdges[s].edgeID);
                console.log("newEdge: ", newEdge);
                newEdgesList.push(newEdge);
                
            }
            console.log("newEdgesList: ", newEdgesList);
            let newVisibleFace = new Face(newEdgesList);
            newTempFaceList[k] = newVisibleFace;
            newEdgesList = [];
        }

        let newVisibleFaceList = [];
        let edgesList = [];

        console.log("this.visibleFaceList.length")
        for(let k = 0; k < this.visibleFaceList.length; k++){
            for(let s = 0; s< this.visibleFaceList[k].listEdges.length; s++){
                this.visibleFaceList[k].listEdges[s].vertexInit.x = this.visibleFaceList[k].listEdges[s].vertexInit.x;
                this.visibleFaceList[k].listEdges[s].vertexInit.y = this.visibleFaceList[k].listEdges[s].vertexInit.y;
                this.visibleFaceList[k].listEdges[s].vertexInit.z = this.visibleFaceList[k].listEdges[s].vertexInit.z;

                this.visibleFaceList[k].listEdges[s].vertexEnd.x = this.visibleFaceList[k].listEdges[s].vertexEnd.x;
                this.visibleFaceList[k].listEdges[s].vertexEnd.y = this.visibleFaceList[k].listEdges[s].vertexEnd.y;
                this.visibleFaceList[k].listEdges[s].vertexEnd.z = this.visibleFaceList[k].listEdges[s].vertexEnd.z;

                let xInit = this.visibleFaceList[k].listEdges[s].vertexInit.x;
                let yInit = this.visibleFaceList[k].listEdges[s].vertexInit.y;
                let zInit = this.visibleFaceList[k].listEdges[s].vertexInit.z;

                let xEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.x;    
                let yEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.y;
                let zEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.z;
                let auxInitPoints = [[xInit],
                                 [yInit],
                                 [zInit],
                                 [1]];

                let auxEndPoints = [[xEnd],
                                 [yEnd],
                                 [zEnd],
                                 [1]];
                let resultInitMatrix = multiplyMatrices(matrixSRU_SRT, auxInitPoints);
                let resultEndMatrix = multiplyMatrices(matrixSRU_SRT, auxEndPoints);
                console.log("result1: ", resultInitMatrix, "result2: ", resultEndMatrix);
                let resultInit = new Vertex(resultInitMatrix[0]/resultInitMatrix[3], resultInitMatrix[1]/resultInitMatrix[3], resultInitMatrix[2][0]);
                let resultEnd = new Vertex(resultEndMatrix[0]/resultEndMatrix[3], resultEndMatrix[1]/resultEndMatrix[3], resultEndMatrix[2][0]);
                let newEdge = new Edge(resultInit, resultEnd, this.visibleFaceList[k].listEdges[s].edgeID);
                console.log("newEdge: ", newEdge);
                edgesList.push(newEdge);
                
            }
            console.log("EdgesList: ", edgesList);
            let newVisibleFace = new Face(edgesList);
            newVisibleFaceList[k] = newVisibleFace;
            edgesList = [];
        }

        // for(let i = 0; i < tempSliceList.length; i++){
        //     for(let j = 0; j < tempSliceList[i].vertexList.length; j++){
        //         tempSliceList[i].vertexList[j].x = tempSliceList[i].vertexList[j].x.toFixed(3);
        //         tempSliceList[i].vertexList[j].y = tempSliceList[i].vertexList[j].y.toFixed(3);
        //         tempSliceList[i].vertexList[j].z = tempSliceList[i].vertexList[j].z.toFixed(3);
        //         let x = tempSliceList[i].vertexList[j].x;
        //         let y = tempSliceList[i].vertexList[j].y;
        //         let z = tempSliceList[i].vertexList[j].z;
        //         console.log("teste do Z: ", z);
        //         let auxPoints = [[x], 
        //                          [y], 
        //                          [z], 
        //                          [1]];
        //         console.log("matrixSRU_SRT: ", matrixSRU_SRT);
        //         // console.log("auxPoints: ", auxPoints);
                
        //         let resultMatrix = multiplyMatrices(matrixSRU_SRT, auxPoints);
        //         // console.log("resultMatrix: ", resultMatrix);

        //         auxSliceList[i].vertexList[j].x = resultMatrix[0]/resultMatrix[3];
        //         auxSliceList[i].vertexList[j].y = resultMatrix[1]/resultMatrix[3];
        //         auxSliceList[i].vertexList[j].z = resultMatrix[2][0];
        //         console.log("aux teste do zaza :",  auxSliceList[i].vertexList[j].x,  auxSliceList[i].vertexList[j].y, auxSliceList[i].vertexList[j].z)
                
        //     }
        // }
        // this.sliceList = auxSliceList;
        // for(let i = 0; i < this.sliceList.length; i++){
        //     this.sliceList[i].drawPolygon(ctx);
        // }

        // console.log("sliceList: ", this.sliceList);

        // let teste1 = this.sliceList[0].vertexList[0+1];

        // for (let i = 0; i < fatias; i++) {
        //     let index = i;
        //     // this.sliceList[index].drawPolygon(ctx);
        //     if(i == fatias-1) {
        //         index = 0;
        //     } 
        //     for(let j = 0; j < this.sliceList[index].vertexList.length; j++){
        //         const currentFaceEdges = [];
        //         let edgeSlice1;
        //         let edgeToSlice2;
        //         let edgeSlice2;
        //         let edgeToSlice1;
        //         if(j == this.sliceList[index].vertexList.length - 1){
        //             if(i == fatias-1) {
        //                 edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[0], "edgeSlice1 " + i);
        //                 edgeToSlice2 = new Edge(this.sliceList[i].vertexList[0], this.sliceList[index].vertexList[0], 'edgeToSlice2 ' + i);
        //                 edgeSlice2 = new Edge(this.sliceList[index].vertexList[0], this.sliceList[index].vertexList[j], 'edgeSlice2 ' + i);
        //                 edgeToSlice1 = new Edge(this.sliceList[index].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
        //             } else {
        //                 edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[0], "edgeSlice1 " + i);
        //                 edgeToSlice2 = new Edge(this.sliceList[i].vertexList[0], this.sliceList[i+1].vertexList[0], 'edgeToSlice2 ' + i);
        //                 edgeSlice2 = new Edge(this.sliceList[i+1].vertexList[0], this.sliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
        //                 edgeToSlice1 = new Edge(this.sliceList[i+1].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
        //             }


        //         } else {  

        //             if(i == fatias-1) {
        //                 edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
        //                 edgeToSlice2 = new Edge(this.sliceList[i].vertexList[j+1], this.sliceList[index].vertexList[j+1], 'edgeToSlice2 ' + i);
        //                 edgeSlice2 = new Edge(this.sliceList[index].vertexList[j+1], this.sliceList[index].vertexList[j], 'edgeSlice2 ' + i);
        //                 edgeToSlice1 = new Edge(this.sliceList[index].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
        //             } else {
        //                 edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
        //                 edgeToSlice2 = new Edge(this.sliceList[i].vertexList[j+1], this.sliceList[i+1].vertexList[j+1], 'edgeToSlice2 ' + i);
        //                 edgeSlice2 = new Edge(this.sliceList[i+1].vertexList[j+1], this.sliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
        //                 edgeToSlice1 = new Edge(this.sliceList[i+1].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
        //             }

        //         }

        //         currentFaceEdges.push(edgeSlice1);
        //         currentFaceEdges.push(edgeToSlice2);
        //         currentFaceEdges.push(edgeSlice2);
        //         currentFaceEdges.push(edgeToSlice1);
        //         const face = new Face(currentFaceEdges);

        //         if(face.isCounterClockwise()) {
        //             console.log("faceTesteLogica Verdadeiro: ", face);
        //             this.facesList.push(face);
        //             // tempFacesList.push(face);
        //         } else {
        //             console.log("faceTesteLogica Falso: ", face);
        //             let newFace = this.reverseFace(face);

        //             // inverter aqui
        //             this.facesList.push(newFace);
                
        //         }
        //         // this.facesList.push(face);
                
        //     }
        //     console.log("SliceList: ", this.sliceList);
        //     console.log("drawWireframe: ", this.sliceList[0].vertexList[1].x, this.sliceList[0].vertexList[1].y, this.sliceList[1].vertexList[1].x, this.sliceList[1].vertexList[1].y);
        //     // this.drawFaceOK(ctx, this.facesList[i]);
        //     // if(this.testeVisibilidade(tempFacesList[i], camera.getVRP()) > 0){
                
        //     //     if (i < fatias - 1) {
        //     //         this.drawFaceOK(ctx, tempFacesList[i]); 
        //     //     }
        //     //      else {
        //     //         this.drawFace(ctx, this.sliceList[i]); // Fecha o polígono
        //     //     }
        //     // }
                        
        // }
        // console.log("facesList: ", tempFacesList);
        let count = 0;

            // let result = this.testeVisibilidade(tempFacesList[i], camera.getVRP(), ctx, i);
        // for(let i = 0; i < newVisibleFaceList.length; i++){
        //     ctx.beginPath();
        //         ctx.strokeStyle = "Black";

        //         ctx.moveTo(newVisibleFaceList[i].listEdges[0].vertexInit.x, newVisibleFaceList[i].listEdges[0].vertexInit.y);
        //         newVisibleFaceList[i].listEdges.forEach(edge => {
        //             console.log("testeDoWireframe: ", edge, "X DIFF: ", edge.vertexEnd.x - edge.vertexInit.x, " Y Diff ", edge.vertexEnd.y - edge.vertexInit.y);
        //             ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
        //         });
        //         ctx.closePath();
        //         ctx.stroke();
        // }

        // let L = {vector : [-250, 500, -500], Il : [233, 200, 99]};	
        let L = {vector : [1050, -500, -900], Il : [170, 140, 120]};	//gouroud
        // let L = {vector : [-10000, 300, 500], Il : [233, 100, 200]};	

        console.log("newTempFaceList: ", newTempFaceList);

        let zBufferFrame = Array.from({ length: windowY.max }, () => Array.from({ length: windowX.max }, () => null));

        for(let i = 0; i < newVisibleFaceList.length; i++){
            let material = this.getMaterial();
            // let constantShade = new ConstantShade([120, 160, 200], L, newVisibleFaceList[i], camera, material);
            // constantShade.constantRun();
            // let zBuffer = new ZBuffer(windowX, windowY, newVisibleFaceList[i]);
            // zBuffer.render(ctx, zBufferFrame, this.color);
            // let gouroudShade = new GouroudShade([120, 160, 200], L, newVisibleFaceList[i], camera, material, newTempFaceList);
            // gouroudShade.gouroudRun();
            // let zBufferGouraud = new ZBufferGouraud(windowX, windowY, newVisibleFaceList[i]);
            // zBufferGouraud.render(ctx, zBufferFrame, this.color);

            let phongShade = new PhongShade([120, 160, 200], L, newVisibleFaceList[i], camera, material, newTempFaceList);

            let zBufferPhong = new ZBufferPhong(windowX, windowY, newVisibleFaceList[i]);
            zBufferPhong.render(ctx, zBufferFrame, phongShade, newTempFaceList, L, camera);

            // console.log("zbuffer " + i + ": ", zBuffer.getFace());
        }

        for (let currentY = windowY.min; currentY < windowY.max; currentY++) {
            for(let currentX = windowX.min; currentX < windowX.max; currentX++) {
                if (zBufferFrame[currentY][currentX] != null) {
                    ctx.fillStyle = zBufferFrame[currentY][currentX].color;
                    ctx.fillRect(currentX, currentY, 1, 1);
                }
            }
        }
        // this.drawVisibleFaces(ctx, camera, count);


        
        // console.log(this.facesList);
        let pintor = new Pintor();
        for(let i = 0; i < this.facesList.length; i++){
            // console.log("Centroiude: ", this.facesList[i].centroide);
            pintor.getDistance(this.facesList[i], camera.getVRP());
            // console.log("Dist: ", pintor.distance);
        }
        for(let i = 0; i < tempFacesList.length; i++){
            // console.log(i + " Visibilidade: ", this.testeVisibilidade(tempFacesList[i], camera.getVRP()));
        }
    }
    reverseFace(face) {
        // Inverter a ordem dos vértices
            // face.listEdges.reverse();
        // while(!face.isCounterClockwise()) {

        //     for (let i = 0; i < face.listEdges.length; i++) {
        //         const edge = face.listEdges[i];
        //         const tempVertexInit = edge.vertexInit;
        //         edge.vertexInit = edge.vertexEnd;
        //         edge.vertexEnd = tempVertexInit;
        //         // Não é necessário inverter os vetores normalizados das arestas, já que a ordem dos vértices está sendo invertida
        //         // Se necessário, essa lógica pode ser adicionada aqui
        //     }
        // }
        let edgeSlice1 = new Edge(face.listEdges[0].vertexInit, face.listEdges[3].vertexInit, face.listEdges[0].edgeID);
        let edgeToSlice2 = new Edge(face.listEdges[3].vertexInit, face.listEdges[2].vertexInit, face.listEdges[3].edgeID);
        let edgeSlice2 = new Edge(face.listEdges[2].vertexInit, face.listEdges[1].vertexInit, face.listEdges[2].edgeID);
        let edgeToSlice1 = new Edge(face.listEdges[1].vertexInit, face.listEdges[0].vertexInit, face.listEdges[1].edgeID);
        const currentFaceEdges = [];
        currentFaceEdges.push(edgeSlice1);
        currentFaceEdges.push(edgeToSlice2);
        currentFaceEdges.push(edgeSlice2);
        currentFaceEdges.push(edgeToSlice1);
        const newFace = new Face(currentFaceEdges);
        // Recriar as arestas para manter a consistência da orientação

        console.log("reverseFace: ", newFace.isCounterClockwise())
        return face;
    }

    // reverseFace(face) {
    //     // Inverter a ordem dos vértices
    //     if (!face.isCounterClockwise()) {
    //         face.listEdges.reverse();
    
    //         for (let i = 0; i < face.listEdges.length; i++) {
    //             const edge = face.listEdges[i];
    //             const tempVertexInit = edge.vertexInit;
    //             edge.vertexInit = edge.vertexEnd;
    //             edge.vertexEnd = tempVertexInit;
    //             // Não é necessário inverter os vetores normalizados das arestas, já que a ordem dos vértices está sendo invertida
    //             // Se necessário, essa lógica pode ser adicionada aqui
    //         }
    //     }
    //     console.log("reverseFace: ", face.isCounterClockwise());
    //     return face;
    // }

    drawFaceOK(ctx, face) {
        if (!ctx) {
            console.error("Canvas context (ctx) is undefined");
            return;
        }
        ctx.beginPath();
        ctx.strokeStyle = "black";
        face.listEdges.forEach(edge => {
            ctx.moveTo(edge.vertexInit.x, edge.vertexInit.y);
            ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
        });
        ctx.closePath();
        ctx.stroke();
    }

    testeVisibilidade(face, vrp, ctx, index) {
        const x = (vrp[0] - face.centroide[0]); // (Math.pow(vrp[0] - face.centroide[0], 2));
        const y = (vrp[1] - face.centroide[1]); // (Math.pow(vrp[1] - face.centroide[1], 2));
        const z = (vrp[2] - face.centroide[2]); // (Math.pow(vrp[2] - face.centroide[2], 2));
        const O = [x, y, z];
        const oNormalized = normalizarVetor(O)
        // console.log("o: ", O);
        console.log("oNormalizado: ", oNormalized, " face normal: ", face.getNormal());

        const result = produtoEscalar(oNormalized, face.getNormal());
        console.log("RESULTTODO: ", result);
        // if(result > 0){
        //     this.drawFaces(ctx, index);
        // }
        return result;
    }
        
    // drawFaces(ctx) {
    //     if (!ctx) {
    //         console.error("Canvas context (ctx) is undefined");
    //         return;
    //     }
    
    //     if (this.facesList.length === 0) {
    //         console.warn("No faces to draw");
    //         return;
    //     }
    
    //     this.facesList.forEach(face => {
    //         if (face.listEdges.length < 3) {
    //             console.warn("Face has less than 3 edges");
    //             return;
    //         }
    
    //         ctx.beginPath();
    //         ctx.strokeStyle = this.getRandomColor();
    //         ctx.moveTo(face.listEdges[0].vertexInit.x, face.listEdges[0].vertexInit.y);
    //         face.listEdges.forEach(edge => {
    //             ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
    //         });
    //         ctx.closePath();
    //         ctx.stroke();
    //     });
    // }



    // drawVisibleFaces(ctx, camera, count) {
    //     if (!ctx) {
    //         console.error("Canvas context (ctx) is undefined");
    //         return;
    //     }
    
    //     if (this.facesList.length === 0) {
    //         console.warn("No faces to draw");
    //         return;
    //     }
        
    //     for(let i = 0; i < this.facesList.length; i++){
    //         const visibility = this.testeVisibilidade(this.facesList[i], camera.getVRP());
    //         if (visibility > 0) {
    //             this.visibleFaceList.push(this.facesList[i]);
    //             // count++;
    //             // console.log("count: ", count, "face: ", this.facesList[i].centroide);
    //             // // Desenha a face apenas se for visível
    //             // ctx.beginPath();
    //             // ctx.strokeStyle = "Black";

    //             // ctx.moveTo(this.facesList[i].listEdges[0].vertexInit.x, this.facesList[i].listEdges[0].vertexInit.y);
    //             // this.facesList[i].listEdges.forEach(edge => {
    //             //     console.log("testeDoWireframe: ", edge, "X DIFF: ", edge.vertexEnd.x - edge.vertexInit.x, " Y Diff ", edge.vertexEnd.y - edge.vertexInit.y);
    //             //     ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
    //             // });
    //             // ctx.closePath();
    //             ctx.stroke();
    //         }
    //         else {
    //             this.notVisibleFaceList.push(this.facesList[i]);
    //             // ctx.beginPath();
    //             // ctx.strokeStyle = "red";

    //             // ctx.moveTo(this.facesList[i].listEdges[0].vertexInit.x, this.facesList[i].listEdges[0].vertexInit.y);
    //             // this.facesList[i].listEdges.forEach(edge => {
    //             //     console.log("testeDoWireframe: ", edge, "X DIFF: ", edge.vertexEnd.x - edge.vertexInit.x, " Y Diff ", edge.vertexEnd.y - edge.vertexInit.y);
    //             //     ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
    //             // });
    //             // ctx.closePath();
    //             // ctx.stroke();
    //         }
    //     }
    // }

    drawVisibleFaces(ctx, camera, list) {
        console.log("LISTA: ", list);
        if (!ctx) {
            console.error("Canvas context (ctx) is undefined");
            return;
        }
    
        if (list.length === 0) {
            console.warn("No faces to draw");
            return;
        }
        
        for(let i = 0; i < list.length; i++){
            const visibility = this.testeVisibilidade(list[i], camera.getVRP());
            if (visibility > 0) {
                this.visibleFaceList.push(list[i]);
                // count++;
                // console.log("count: ", count, "face: ", list[i].centroide);
                // Desenha a face apenas se for visível
                // ctx.beginPath();
                // ctx.strokeStyle = "Black";

                // ctx.moveTo(list[i].listEdges[0].vertexInit.x, list[i].listEdges[0].vertexInit.y);
                // list[i].listEdges.forEach(edge => {
                //     console.log("testeDoWireframe: ", edge, "X DIFF: ", edge.vertexEnd.x - edge.vertexInit.x, " Y Diff ", edge.vertexEnd.y - edge.vertexInit.y);
                //     ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
                // });
                // ctx.closePath();
                // ctx.stroke();
            }
            else {
                this.notVisibleFaceList.push(list[i]);
                // ctx.beginPath();
                // ctx.strokeStyle = "red";

                // ctx.moveTo(list[i].listEdges[0].vertexInit.x, list[i].listEdges[0].vertexInit.y);
                // list[i].listEdges.forEach(edge => {
                //     console.log("testeDoWireframe: ", edge, "X DIFF: ", edge.vertexEnd.x - edge.vertexInit.x, " Y Diff ", edge.vertexEnd.y - edge.vertexInit.y);
                //     ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
                // });
                // ctx.closePath();
                // ctx.stroke();
            }
        }
    }


    drawWireframe(ctx, poly1, poly2, index){
        ctx.lineWidth = 2;
        // poly1.drawPolygon(ctx);
        for (let i = 0; i < poly1.vertexList.length; i++) {
            // Gera uma cor aleatória para cada linha
            ctx.strokeStyle = this.getRandomColor();
            
            ctx.beginPath();    
            ctx.moveTo(poly1.vertexList[i].x, poly1.vertexList[i].y);
            ctx.lineTo(poly2.vertexList[i].x, poly2.vertexList[i].y);
            // console.log("drawWireframe: ", poly1.vertexList[i].x, poly1.vertexList[i].y, poly2.vertexList[i].x, poly2.vertexList[i].y);
            ctx.stroke();
            ctx.closePath();
        }
        
    }

    getRandomColor() {
        // Gera uma cor aleatória no formato hexadecimal
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    
}

    // projectAndDraw(ctx, poly, canvasWidth, canvasHeight) {
    //     let width = canvasWidth;
    //     let height = canvasHeight;
    //     console.log("width, height: ", width, height);
    //     let PERSPECTIVE = width * 1000; // The field of view of our 3D scene
    //     let PROJECTION_CENTER_X = width / 2; // x center of the canvas
    //     let PROJECTION_CENTER_Y = height / 2;
    //     for(let i = 0; i < poly.vertexList.length; i++) {
    //         ctx.globalAlpha = Math.abs(1 - poly.vertexList[i].z / width);

    //         // The scaleProjected will store the scale of the element based on its distance from the 'camera'
    //         let scaleProjected = PERSPECTIVE / (PERSPECTIVE + poly.vertexList[i].z);
    //         console.log("scaleProjected: ", scaleProjected);
    //         // The xProjected is the x position on the 2D world
    //         let xProjected = (poly.vertexList[i].x * scaleProjected); 
    //         console.log("xProjected: ", xProjected);
    //         // The yProjected is the y position on the 2D world
    //         let yProjected = (poly.vertexList[i].y * scaleProjected);
    //         console.log("yProjected: ", yProjected);
    //         ctx.fillRect(xProjected - 3, yProjected - 3, 3 * 2 * scaleProjected, 3 * 2 * scaleProjected);
    //     }
    //   }